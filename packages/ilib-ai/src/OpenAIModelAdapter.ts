/*
 * OpenAIModelAdapter.ts — OpenAI (ChatGPT / OpenAI API) adapter
 *
 * Copyright © 2026, JEDLSoft
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
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { AIModelAdapter } from "./AIModelAdapter";
import type { OpenAIModelInitOptions } from "./OpenAIModelInitOptions";
import { OPENAI_ADAPTER_NAME } from "./constants";
import type {
    AdapterCapabilities,
    CompletionRequest,
    CompletionResponse,
    CompletionResponseError,
    ModelInfo,
} from "./types";

const DEFAULT_OPENAI_MODEL = "gpt-4o-2024-08-06";

function normalizeOpenAiBaseUrl(baseUrl: string | undefined): string {
    return (baseUrl ?? "https://api.openai.com").replace(/\/$/, "");
}

type OpenAiHttpResult = {
    ok: boolean;
    status: number;
    statusText: string;
    json: () => Promise<unknown>;
    text: () => Promise<string>;
};

/** Older Node typings may omit `fetch`; runtime requires global fetch (Node 18+). */
async function openAiFetch(
    url: string,
    init: { method: string; headers: Record<string, string>; body?: string }
): Promise<OpenAiHttpResult> {
    const f = (globalThis as unknown as {
        fetch?: (input: string, init?: object) => Promise<OpenAiHttpResult>;
    }).fetch;
    if (typeof f !== "function") {
        throw new Error(
            "OpenAIModelAdapter requires global fetch (Node.js 18+)"
        );
    }
    return f(url, init);
}

function buildOpenAiErrorMessage(
    status: number,
    statusText: string,
    bodyText: string
): string {
    let detail = bodyText.slice(0, 800);
    try {
        const j = JSON.parse(bodyText) as {
            error?: { message?: string };
        };
        if (j?.error?.message) {
            detail = j.error.message;
        }
    } catch {
        /* use raw slice */
    }
    return `${status} ${statusText}${detail ? `: ${detail}` : ""}`;
}

/**
 * OpenAI-backed adapter. Initialization options are defined by {@link OpenAIModelInitOptions}.
 *
 * **Connection:** Call {@link connect} before {@link complete}. {@link connect} performs a
 * lightweight **GET `/v1/models?limit=1`** so invalid API keys fail at handshake time; subsequent
 * {@link complete} calls reuse the same logical session (HTTP is still stateless, but no extra
 * validation work is done per prompt beyond the chat request itself).
 *
 * @see {@link OpenAIModelInitOptions} for credential and connection fields.
 */
export class OpenAIModelAdapter extends AIModelAdapter {
    private readonly init: OpenAIModelInitOptions;

    /** Set after a successful {@link connect}; cleared by {@link disconnect}. */
    private sessionActive = false;

    constructor(init: OpenAIModelInitOptions) {
        super();
        if (!init?.apiKey?.trim()) {
            throw new Error(
                "OpenAI model initialization failed: `apiKey` is required and must be non-empty"
            );
        }
        this.init = { ...init };
    }

    getProviderId(): string {
        return OPENAI_ADAPTER_NAME;
    }

    getDisplayName(): string {
        return "OpenAI";
    }

    getCapabilities(): AdapterCapabilities {
        return {
            supportsModelListing: true,
            defaultModel: this.init.defaultModel ?? DEFAULT_OPENAI_MODEL,
            maxConcurrentRequests: 20,
        };
    }

    isConfigured(): boolean {
        return !!this.init.apiKey?.trim();
    }

    override isConnected(): boolean {
        return this.sessionActive;
    }

    /**
     * Validates the API key with OpenAI via **GET `/v1/models?limit=1`**.
     */
    override async connect(): Promise<void> {
        if (this.sessionActive) {
            return;
        }
        const base = normalizeOpenAiBaseUrl(this.init.baseUrl);
        const url = `${base}/v1/models?limit=1`;
        const res = await openAiFetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${this.init.apiKey.trim()}`,
            },
        });
        if (!res.ok) {
            const snippet = await res.text().catch(() => "");
            throw new Error(
                `OpenAI connect failed: HTTP ${res.status} ${res.statusText}${
                    snippet ? ` — ${snippet.slice(0, 500)}` : ""
                }`
            );
        }
        this.sessionActive = true;
    }

    override async disconnect(): Promise<void> {
        this.sessionActive = false;
    }

    override async listAvailableModels(): Promise<ModelInfo[]> {
        if (!this.sessionActive) {
            return Promise.reject(
                new Error(
                    "OpenAIModelAdapter: call connect() before listAvailableModels()"
                )
            );
        }
        const base = normalizeOpenAiBaseUrl(this.init.baseUrl);
        const url = `${base}/v1/models`;
        const res = await openAiFetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${this.init.apiKey.trim()}`,
            },
        });
        if (!res.ok) {
            return [];
        }
        let data: unknown;
        try {
            data = await res.json();
        } catch {
            return [];
        }
        const list = data as { data?: Array<{ id?: string }> };
        const rows = list.data ?? [];
        return rows
            .filter((m): m is { id: string } => typeof m?.id === "string")
            .map((m) => ({
                id: m.id,
                displayName: m.id,
            }));
    }

    override async complete(
        request: CompletionRequest
    ): Promise<CompletionResponse> {
        if (!this.sessionActive) {
            return Promise.reject(
                new Error("OpenAIModelAdapter: call connect() before complete()")
            );
        }
        const base = normalizeOpenAiBaseUrl(this.init.baseUrl);
        const url = `${base}/v1/chat/completions`;
        const body: Record<string, unknown> = {
            model: request.model,
            messages: [
                { role: "system", content: request.systemPrompt },
                { role: "user", content: request.userContent },
            ],
        };
        const p = request.parameters;
        if (p?.temperature !== undefined) {
            body.temperature = p.temperature;
        }
        if (p?.maxTokens !== undefined) {
            body.max_tokens = p.maxTokens;
        }

        const res = await openAiFetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.init.apiKey.trim()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const fail = async (): Promise<CompletionResponseError> => {
            const text = await res.text().catch(() => "");
            return {
                message: buildOpenAiErrorMessage(
                    res.status,
                    res.statusText,
                    text
                ),
                httpStatus: res.status,
                httpStatusText: res.statusText,
                providerBody: text.slice(0, 2000),
            };
        };

        if (!res.ok) {
            const err = await fail();
            return {
                rawContent: "",
                error: err,
            };
        }

        let parsed: unknown;
        try {
            parsed = await res.json();
        } catch (e) {
            const text = await res.text().catch(() => "");
            return {
                rawContent: "",
                error: {
                    message:
                        (e as Error)?.message ||
                        `Invalid JSON from OpenAI: ${text.slice(0, 200)}`,
                },
            };
        }

        const chat = parsed as {
            id?: string;
            choices?: Array<{
                message?: { content?: string | null };
            }>;
        };
        const id = chat.id;
        const choices = chat.choices ?? [];
        const first = choices[0];
        const content = first?.message?.content;

        if (choices.length === 0 || content === undefined || content === null) {
            return {
                rawContent: "",
                error: {
                    message: "OpenAI returned no assistant message",
                    httpStatus: res.status,
                    httpStatusText: res.statusText,
                },
            };
        }

        return {
            rawContent: content,
            providerRequestId: id,
        };
    }
}
