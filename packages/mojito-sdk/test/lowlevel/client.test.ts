/*
 * client.test.ts - unit tests for the low-level Mojito HTTP client
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

import type { AuthProvider } from "../../src/auth/types";
import { LowLevelClient } from "../../src/lowlevel/client";

describe("LowLevelClient", () => {
    test("marshals path/query/body and unpacks JSON", async () => {
        const auth: AuthProvider = {
            async authorize() {
                return { Cookie: "SESSION=abc", "X-CSRF-TOKEN": "tok" };
            },
        };

        let seenUrl = "";
        let seenInit: RequestInit | undefined;
        const fetchImpl: typeof fetch = async (input, init) => {
            seenUrl = String(input);
            seenInit = init;
            return new Response(JSON.stringify({ id: 9, name: "demo" }), {
                status: 200,
                headers: { "content-type": "application/json" },
            });
        };

        const client = new LowLevelClient({
            baseUrl: "http://localhost:8080",
            auth,
            fetchImpl,
        });

        const result = await client.call<{ id: number; name: string }>("createRepository", {
            body: { name: "demo" },
            description: "extra forwarded field",
        });

        expect(result).toEqual({ id: 9, name: "demo" });
        expect(seenUrl).toBe("http://localhost:8080/api/repositories");
        expect(seenInit?.method).toBe("POST");
        const headers = seenInit?.headers as Record<string, string>;
        expect(headers.Cookie).toBe("SESSION=abc");
        expect(headers["X-CSRF-TOKEN"]).toBe("tok");
        expect(JSON.parse(String(seenInit?.body))).toEqual({
            name: "demo",
            description: "extra forwarded field",
        });
    });

    test("flattens pageable query params for getDrops", async () => {
        const auth: AuthProvider = {
            async authorize() {
                return {};
            },
        };
        let seenUrl = "";
        const fetchImpl: typeof fetch = async (input) => {
            seenUrl = String(input);
            return new Response(JSON.stringify({ content: [] }), { status: 200 });
        };
        const client = new LowLevelClient({
            baseUrl: "https://mojito.example",
            auth,
            fetchImpl,
        });

        await client.call("getDrops", {
            repositoryId: 12,
            pageable: { page: 1, size: 25, sort: ["name,asc"] },
            weirdFutureFlag: true,
        });

        const url = new URL(seenUrl);
        expect(url.pathname).toBe("/api/drops");
        expect(url.searchParams.get("repositoryId")).toBe("12");
        expect(url.searchParams.get("page")).toBe("1");
        expect(url.searchParams.get("size")).toBe("25");
        expect(url.searchParams.get("sort")).toBe("name,asc");
        expect(url.searchParams.get("weirdFutureFlag")).toBe("true");
    });
});
