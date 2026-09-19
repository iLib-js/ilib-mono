/*
 * MojitoClient.test.ts - unit tests for the MojitoClient session
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

import { MojitoClient } from "../../src/model/MojitoClient";
import { createJsonFetch, createTestClient } from "./testClient";

describe("MojitoClient", () => {
    test("call is an escape hatch to arbitrary operationIds", async () => {
        const { fetchImpl, getLastRequest } = createJsonFetch(() => ({ ok: true }));
        const client = createTestClient(fetchImpl);

        const result = await client.call<{ ok: boolean }>("getCsrfToken");
        expect(result).toEqual({ ok: true });
        expect(new URL(getLastRequest().url).pathname).toBe("/api/csrf-token");
    });

    test("uses HEADER auth without constructing a low-level client in tests", async () => {
        const { fetchImpl } = createJsonFetch(() => ({ username: "bob" }));
        const client = new MojitoClient({
            host: "localhost",
            port: 8080,
            loadCliConfig: false,
            authenticationMode: "HEADER",
            headers: { "cf-access-token": "x" },
            fetchImpl,
        });

        const me = await client.call("getCurrentUser");
        expect(me).toEqual({ username: "bob" });
    });
});
