/*
 * stateful-auth.test.ts - unit tests for Mojito form-login auth
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

import { StatefulFormLoginAuth } from "../../src/auth/stateful-auth";

function jsonResponse(status: number, body: string, headers: Record<string, string> = {}): Response {
    return new Response(body, { status, headers });
}

describe("StatefulFormLoginAuth", () => {
    test("logs in via form CSRF handshake and returns session headers", async () => {
        const calls: Array<{ url: string; init?: RequestInit }> = [];
        const fetchImpl: typeof fetch = async (input, init) => {
            const url = String(input);
            calls.push({ url, init });
            if (url.endsWith("/login") && (!init || init.method === "GET" || !init.method)) {
                return jsonResponse(
                    200,
                    "<html><script>var CSRF_TOKEN = 'csrf-from-html';</script></html>",
                    { "set-cookie": "SESSION=session-1; Path=/" },
                );
            }
            if (url.endsWith("/login") && init?.method === "POST") {
                const body = String(init.body);
                expect(body).toContain("username=admin");
                expect(body).toContain("password=secret");
                expect(body).toContain("_csrf=csrf-from-html");
                return jsonResponse(302, "", {
                    location: "/",
                    "set-cookie": "SESSION=session-2; Path=/",
                });
            }
            if (url.endsWith("/api/csrf-token")) {
                return jsonResponse(200, "csrf-from-endpoint");
            }
            throw new Error(`Unexpected URL ${url}`);
        };

        const auth = new StatefulFormLoginAuth({
            baseUrl: "http://localhost:8080",
            username: "admin",
            password: "secret",
            fetchImpl,
        });

        const headers = await auth.authorize("http://localhost:8080/api/repositories", "GET");
        expect(headers.Cookie).toContain("SESSION=session-2");
        expect(headers["X-CSRF-TOKEN"]).toBe("csrf-from-endpoint");
        expect(calls.length).toBe(3);
    });
});
