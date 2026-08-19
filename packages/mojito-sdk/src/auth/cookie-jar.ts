/*
 * cookie-jar.ts - minimal Cookie header jar for Mojito sessions
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
 * Tiny in-memory cookie jar sufficient for Mojito SESSION/JSESSIONID cookies.
 */
export class CookieJar {
    private readonly cookies = new Map<string, string>();

    /**
     * Store cookies from a `Set-Cookie` header value list.
     *
     * @param setCookieHeaders Values from one or more Set-Cookie headers.
     */
    store(setCookieHeaders: string[] | undefined): void {
        if (!setCookieHeaders) {
            return;
        }
        for (const header of setCookieHeaders) {
            const pair = header.split(";", 1)[0];
            const eq = pair.indexOf("=");
            if (eq <= 0) {
                continue;
            }
            const name = pair.slice(0, eq).trim();
            const value = pair.slice(eq + 1).trim();
            if (name) {
                this.cookies.set(name, value);
            }
        }
    }

    /**
     * Store cookies from a Fetch {@link Response}.
     *
     * @param response HTTP response that may include Set-Cookie headers.
     */
    storeFromResponse(response: Response): void {
        const headers = response.headers as Headers & {
            getSetCookie?: () => string[];
        };
        if (typeof headers.getSetCookie === "function") {
            this.store(headers.getSetCookie());
            return;
        }
        const single = response.headers.get("set-cookie");
        if (single) {
            this.store([single]);
        }
    }

    /**
     * Read a cookie value by name.
     *
     * @param name Cookie name.
     * @returns Cookie value, or undefined if absent.
     */
    get(name: string): string | undefined {
        return this.cookies.get(name);
    }

    /**
     * Build a `Cookie` request header value.
     *
     * @returns Cookie header string, or undefined when the jar is empty.
     */
    headerValue(): string | undefined {
        if (this.cookies.size === 0) {
            return undefined;
        }
        return Array.from(this.cookies.entries())
            .map(([name, value]) => `${name}=${value}`)
            .join("; ");
    }

    /**
     * Remove all cookies.
     */
    clear(): void {
        this.cookies.clear();
    }
}
