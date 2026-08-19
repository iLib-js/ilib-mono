/*
 * types.ts - authentication configuration types for mojito-sdk
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

/**
 * Mojito CLI-compatible authentication modes
 * (`l10n.resttemplate.authentication-mode`).
 *
 * - `STATEFUL` — Form login against Mojito: obtain a session cookie
 *   (`SESSION` / `JSESSIONID`) and send `X-CSRF-TOKEN` on API requests.
 *   Uses `username` / `password` (CONFIG) or a console prompt (CONSOLE).
 *   This is the default / legacy CLI mode.
 * - `STATELESS` — No Mojito session. Authenticate with a bearer token from
 *   Azure AD via MSAL (device code, browser code, or client credentials) and
 *   send `Authorization: Bearer …` on each request.
 * - `HEADER` — No Mojito login. Attach static headers configured under
 *   `l10n.resttemplate.header.headers.*` on every request (for example
 *   Cloudflare Access client id/secret).
 */
export type AuthenticationMode = "STATEFUL" | "STATELESS" | "HEADER";

/**
 * How Mojito CLI obtains the username/password for `STATEFUL` form login
 * (`l10n.resttemplate.authentication.credentialProvider`).
 *
 * - `CONFIG` — Read credentials from properties (`authentication.username` /
 *   `authentication.password`). Suitable for scripts and non-interactive use.
 * - `CONSOLE` — Prompt on the terminal for the password (username still comes
 *   from config / the OS user). Interactive CLI use only; not supported by
 *   this SDK.
 */
export type CredentialProviderKind = "CONFIG" | "CONSOLE";

/**
 * Connection and authentication settings aligned with
 * `l10n.resttemplate.*` Mojito CLI properties.
 */
export type MojitoConnectionConfig = {
    /** URL scheme (`http` or `https`). Default: `http`. */
    scheme?: string;
    /** Mojito host. Default: `localhost`. */
    host?: string;
    /** Mojito port. Default: `8080`. */
    port?: number;
    /** Optional context path (no trailing slash required). */
    contextPath?: string;
    /** Authentication mode. Default: `STATEFUL`. */
    authenticationMode?: AuthenticationMode;
    /** Username for STATEFUL form login. */
    username?: string;
    /** Password for STATEFUL form login when using CONFIG credentials. */
    password?: string;
    /** Credential source for STATEFUL auth. Default: `CONFIG`. */
    credentialProvider?: CredentialProviderKind;
    /** Static headers for HEADER mode (e.g. Cloudflare Access). */
    headers?: Record<string, string>;
    /** Relative login form path. Default: `login`. */
    loginFormPath?: string;
    /** Relative login POST path. Default: `login`. */
    loginPostPath?: string;
    /** Relative CSRF token path. Default: `api/csrf-token`. */
    csrfTokenPath?: string;
};

/**
 * Prepares cookies and headers for each Mojito HTTP request.
 */
export interface AuthProvider {
    /**
     * Return headers (and ensure any required session) for an outgoing request.
     *
     * @param url Absolute request URL.
     * @param method HTTP method.
     */
    authorize(url: string, method: string): Promise<Record<string, string>>;

    /**
     * Observe a response so cookie jars / CSRF tokens can be updated.
     *
     * @param response Fetch response from Mojito.
     */
    handleResponse?(response: Response): Promise<void> | void;

    /**
     * Force a fresh login / token acquisition before the next request.
     */
    reset?(): void;
}
