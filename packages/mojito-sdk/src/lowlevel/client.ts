/*
 * client.ts - low-level Mojito OpenAPI HTTP client
 *
 * Copyright © 2026 JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { AuthProvider } from "../auth/types";
import { MojitoHttpError } from "./errors";
import { OPERATIONS, type OperationMeta } from "./spec-meta";

/** JSON-compatible value used for request/response payloads. */
export type JsonValue =
    | null
    | boolean
    | number
    | string
    | JsonValue[]
    | { [key: string]: JsonValue };

/**
 * Parameters for a low-level Mojito operation call.
 *
 * Known path/query/body fields may be supplied directly. Additional unknown
 * fields are forwarded for forward compatibility:
 * - Remaining keys become query parameters when there is no body, or
 * - Are merged into the JSON body when `body` is present / the operation has a body.
 */
export type OperationParams = Record<string, unknown> & {
    /** Optional explicit JSON/body payload. */
    body?: unknown;
    /** Optional extra headers for this request. */
    headers?: Record<string, string>;
};

export type LowLevelClientOptions = {
    /** Absolute Mojito base URL. */
    baseUrl: string;
    /** Auth provider that supplies cookies/headers. */
    auth: AuthProvider;
    /** Optional fetch implementation. */
    fetchImpl?: typeof fetch;
};

/**
 * OpenAPI-derived HTTP client that marshals parameters and unpacks JSON results.
 */
export class LowLevelClient {
    private readonly baseUrl: string;
    private readonly auth: AuthProvider;
    private readonly fetchImpl: typeof fetch;

    /**
     * @param options Base URL, auth, and optional fetch implementation.
     */
    constructor(options: LowLevelClientOptions) {
        this.baseUrl = options.baseUrl.replace(/\/+$/, "");
        this.auth = options.auth;
        this.fetchImpl = options.fetchImpl ?? fetch;
    }

    /**
     * Invoke a Mojito operation by OpenAPI `operationId`.
     *
     * @param operationId OpenAPI operationId (for example `getDrops`).
     * @param params Path/query/body parameters; unknown keys are forwarded.
     * @returns Parsed JSON body, or `undefined` for empty responses.
     */
    async call<T = JsonValue>(
        operationId: string,
        params: OperationParams = {},
    ): Promise<T> {
        const meta = OPERATIONS[operationId];
        if (!meta) {
            throw new Error(`Unknown Mojito operationId: ${operationId}`);
        }
        return this.execute<T>(meta, params);
    }

    /**
     * Escape hatch for endpoints not yet mapped in the object model.
     *
     * @param method HTTP method.
     * @param path Absolute path beginning with `/` (may include `{param}` placeholders).
     * @param params Path/query/body parameters.
     */
    async request<T = JsonValue>(
        method: string,
        path: string,
        params: OperationParams = {},
    ): Promise<T> {
        const meta: OperationMeta = {
            operationId: `${method}:${path}`,
            method: method.toUpperCase() as OperationMeta["method"],
            path,
            tags: [],
            summary: "",
            pathParams: Array.from(path.matchAll(/\{([^}]+)\}/g)).map((m) => m[1]),
            queryParams: [],
            hasBody: params.body !== undefined || !["GET", "HEAD"].includes(method.toUpperCase()),
        };
        return this.execute<T>(meta, params);
    }

    private async execute<T>(
        meta: OperationMeta,
        params: OperationParams,
        allowRetry = true,
    ): Promise<T> {
        const { headers: extraHeaders, body: explicitBody, ...rest } = params;
        const values: Record<string, unknown> = { ...rest };

        let path = meta.path;
        for (const name of meta.pathParams) {
            if (values[name] === undefined) {
                throw new Error(`Missing required path parameter "${name}" for ${meta.operationId}`);
            }
            path = path.replace(`{${name}}`, encodeURIComponent(String(values[name])));
            delete values[name];
        }

        const query = new URLSearchParams();
        for (const qp of meta.queryParams) {
            const value = values[qp.name];
            if (value === undefined) {
                continue;
            }
            delete values[qp.name];
            if (qp.isPageable && value && typeof value === "object" && !Array.isArray(value)) {
                appendPageable(query, value as Record<string, unknown>);
            } else {
                appendQueryValue(query, qp.name, value);
            }
        }

        let body: unknown = explicitBody;
        const knownBodyOp = meta.hasBody;
        if (body === undefined && knownBodyOp) {
            body = values;
        } else if (body === undefined) {
            for (const [key, value] of Object.entries(values)) {
                appendQueryValue(query, key, value);
            }
        } else if (body && typeof body === "object" && !Array.isArray(body) && !(body instanceof Uint8Array)) {
            // Merge leftover unknown params into the body for forward compatibility.
            body = { ...(body as Record<string, unknown>), ...values };
        } else {
            for (const [key, value] of Object.entries(values)) {
                appendQueryValue(query, key, value);
            }
        }

        const qs = query.toString();
        const url = `${this.baseUrl}${path}${qs ? `?${qs}` : ""}`;
        const authHeaders = await this.auth.authorize(url, meta.method);
        const headers: Record<string, string> = {
            Accept: "application/json, application/hal+json",
            ...authHeaders,
            ...(extraHeaders ?? {}),
        };

        let requestBody: string | Uint8Array | undefined;
        if (body !== undefined && meta.method !== "GET" && meta.method !== "HEAD") {
            if (typeof body === "string" || body instanceof Uint8Array) {
                requestBody = body;
            } else {
                headers["Content-Type"] = headers["Content-Type"] ?? "application/json";
                requestBody = JSON.stringify(body);
            }
        }

        const response = await this.fetchImpl(url, {
            method: meta.method,
            headers,
            body: requestBody,
            redirect: "manual",
        });
        if (this.auth.handleResponse) {
            await this.auth.handleResponse(response);
        }

        if (
            allowRetry &&
            (response.status === 401 || response.status === 403 || isLoginRedirect(response)) &&
            this.auth.reset
        ) {
            this.auth.reset();
            return this.execute<T>(meta, params, false);
        }

        if (!response.ok) {
            const text = await response.text();
            throw new MojitoHttpError(
                `Mojito ${meta.method} ${path} failed with HTTP ${response.status}`,
                {
                    status: response.status,
                    body: text,
                    method: meta.method,
                    url,
                },
            );
        }

        if (response.status === 204) {
            return undefined as T;
        }

        const text = await response.text();
        if (!text) {
            return undefined as T;
        }
        try {
            return JSON.parse(text) as T;
        } catch {
            return text as T;
        }
    }
}

function appendPageable(query: URLSearchParams, pageable: Record<string, unknown>): void {
    if (pageable.page !== undefined) {
        query.set("page", String(pageable.page));
    }
    if (pageable.size !== undefined) {
        query.set("size", String(pageable.size));
    }
    if (pageable.sort !== undefined) {
        appendQueryValue(query, "sort", pageable.sort);
    }
    for (const [key, value] of Object.entries(pageable)) {
        if (key === "page" || key === "size" || key === "sort") {
            continue;
        }
        appendQueryValue(query, key, value);
    }
}

function appendQueryValue(query: URLSearchParams, name: string, value: unknown): void {
    if (value === undefined || value === null) {
        return;
    }
    if (Array.isArray(value)) {
        for (const entry of value) {
            query.append(name, String(entry));
        }
        return;
    }
    if (typeof value === "object") {
        query.set(name, JSON.stringify(value));
        return;
    }
    query.set(name, String(value));
}

function isLoginRedirect(response: Response): boolean {
    if (response.status < 300 || response.status >= 400) {
        return false;
    }
    const location = response.headers.get("location") ?? "";
    return /login/i.test(location);
}
