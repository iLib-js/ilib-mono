/*
 * header-auth.ts - Mojito HEADER authentication (static request headers)
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

import type { AuthProvider } from "./types";

/**
 * Attach configured static headers on every request (Cloudflare Access, etc.).
 */
export class HeaderAuth implements AuthProvider {
    private readonly headers: Record<string, string>;

    /**
     * @param headers Header name/value pairs to send on each request.
     */
    constructor(headers: Record<string, string>) {
        if (!headers || Object.keys(headers).length === 0) {
            throw new Error(
                "HEADER auth requires at least one l10n.resttemplate.header.headers.* value",
            );
        }
        this.headers = { ...headers };
    }

    /**
     * @returns A copy of the configured static headers.
     */
    async authorize(_url: string, _method: string): Promise<Record<string, string>> {
        return { ...this.headers };
    }
}
