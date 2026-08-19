/*
 * stateful-auth.ts - Mojito STATEFUL form-login + CSRF session auth
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

import { CookieJar } from "./cookie-jar";
import type { AuthProvider, MojitoConnectionConfig } from "./types";

const CSRF_HTML_PATTERN = /CSRF_TOKEN\s*=\s*'([^']*)'/;
const SESSION_COOKIE_NAMES = ["SESSION", "JSESSIONID"] as const;

export type StatefulFormLoginAuthOptions = {
    /** Absolute Mojito base URL (no trailing slash required). */
    baseUrl: string;
    /** Username for form login. */
    username: string;
    /** Password for form login. */
    password: string;
    /** Login form path relative to base URL. */
    loginFormPath?: string;
    /** Login POST path relative to base URL. */
    loginPostPath?: string;
    /** CSRF token endpoint path relative to base URL. */
    csrfTokenPath?: string;
    /** Optional fetch implementation (defaults to global fetch). */
    fetchImpl?: typeof fetch;
};

/**
 * Mojito STATEFUL authentication: form login, session cookies, and CSRF header.
 */
export class StatefulFormLoginAuth implements AuthProvider {
    private readonly baseUrl: string;
    private readonly username: string;
    private readonly password: string;
    private readonly loginFormPath: string;
    private readonly loginPostPath: string;
    private readonly csrfTokenPath: string;
    private readonly fetchImpl: typeof fetch;
    private readonly jar = new CookieJar();
    private csrfToken: string | undefined;
    private loginPromise: Promise<void> | undefined;

    /**
     * @param options Form-login configuration.
     */
    constructor(options: StatefulFormLoginAuthOptions) {
        this.baseUrl = options.baseUrl.replace(/\/+$/, "");
        this.username = options.username;
        this.password = options.password;
        this.loginFormPath = options.loginFormPath ?? "login";
        this.loginPostPath = options.loginPostPath ?? "login";
        this.csrfTokenPath = options.csrfTokenPath ?? "api/csrf-token";
        this.fetchImpl = options.fetchImpl ?? fetch;
    }

    /**
     * Ensure a session exists and return Cookie + X-CSRF-TOKEN headers.
     *
     * @param _url Absolute request URL (unused; session is host-scoped).
     * @param _method HTTP method (unused).
     */
    async authorize(_url: string, _method: string): Promise<Record<string, string>> {
        await this.ensureLoggedIn();
        const headers: Record<string, string> = {};
        const cookie = this.jar.headerValue();
        if (cookie) {
            headers.Cookie = cookie;
        }
        if (this.csrfToken) {
            headers["X-CSRF-TOKEN"] = this.csrfToken;
        }
        return headers;
    }

    /**
     * Capture any Set-Cookie headers from Mojito responses.
     *
     * @param response Fetch response.
     */
    handleResponse(response: Response): void {
        this.jar.storeFromResponse(response);
    }

    /**
     * Clear session state so the next request re-authenticates.
     */
    reset(): void {
        this.jar.clear();
        this.csrfToken = undefined;
        this.loginPromise = undefined;
    }

    private async ensureLoggedIn(): Promise<void> {
        if (this.hasSession() && this.csrfToken) {
            return;
        }
        if (!this.loginPromise) {
            this.loginPromise = this.login().finally(() => {
                this.loginPromise = undefined;
            });
        }
        await this.loginPromise;
    }

    private hasSession(): boolean {
        return SESSION_COOKIE_NAMES.some((name) => this.jar.get(name) !== undefined);
    }

    private async login(): Promise<void> {
        const loginPageUrl = `${this.baseUrl}/${this.loginFormPath}`;
        const loginPage = await this.fetchImpl(loginPageUrl, {
            method: "GET",
            redirect: "manual",
        });
        this.jar.storeFromResponse(loginPage);
        const html = await loginPage.text();
        const match = CSRF_HTML_PATTERN.exec(html);
        if (!match) {
            throw new Error(
                "Mojito form login failed: could not find CSRF_TOKEN in the login page HTML",
            );
        }
        const formCsrf = match[1];

        const body = new URLSearchParams({
            username: this.username,
            password: this.password,
            _csrf: formCsrf,
        });

        const loginPostUrl = `${this.baseUrl}/${this.loginPostPath}`;
        const headers: Record<string, string> = {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-CSRF-TOKEN": formCsrf,
        };
        const cookie = this.jar.headerValue();
        if (cookie) {
            headers.Cookie = cookie;
        }

        const loginResponse = await this.fetchImpl(loginPostUrl, {
            method: "POST",
            headers,
            body,
            redirect: "manual",
        });
        this.jar.storeFromResponse(loginResponse);

        if (loginResponse.status >= 400) {
            throw new Error(
                `Mojito form login failed with HTTP ${loginResponse.status}`,
            );
        }

        // Prefer the dedicated CSRF endpoint after authentication when available.
        try {
            const csrfUrl = `${this.baseUrl}/${this.csrfTokenPath}`;
            const csrfHeaders: Record<string, string> = {};
            const sessionCookie = this.jar.headerValue();
            if (sessionCookie) {
                csrfHeaders.Cookie = sessionCookie;
            }
            const csrfResponse = await this.fetchImpl(csrfUrl, {
                method: "GET",
                headers: csrfHeaders,
                redirect: "manual",
            });
            this.jar.storeFromResponse(csrfResponse);
            if (csrfResponse.ok) {
                const token = (await csrfResponse.text()).trim();
                if (token) {
                    this.csrfToken = token;
                    return;
                }
            }
        } catch {
            // Fall back to the form CSRF token.
        }

        this.csrfToken = formCsrf;
    }
}

/**
 * Create {@link StatefulFormLoginAuth} from a resolved connection config.
 *
 * @param baseUrl Absolute base URL.
 * @param config Connection configuration containing username/password.
 * @param fetchImpl Optional fetch implementation.
 */
export function createStatefulAuthFromConfig(
    baseUrl: string,
    config: MojitoConnectionConfig,
    fetchImpl?: typeof fetch,
): StatefulFormLoginAuth {
    if (!config.username) {
        throw new Error(
            "STATEFUL auth requires l10n.resttemplate.authentication.username (or username override)",
        );
    }
    if (config.credentialProvider === "CONSOLE") {
        throw new Error(
            "CONSOLE credential provider is not supported by mojito-sdk; use CONFIG credentials",
        );
    }
    if (!config.password) {
        throw new Error(
            "STATEFUL auth requires l10n.resttemplate.authentication.password (or password override)",
        );
    }
    return new StatefulFormLoginAuth({
        baseUrl,
        username: config.username,
        password: config.password,
        loginFormPath: config.loginFormPath,
        loginPostPath: config.loginPostPath,
        csrfTokenPath: config.csrfTokenPath,
        fetchImpl,
    });
}
