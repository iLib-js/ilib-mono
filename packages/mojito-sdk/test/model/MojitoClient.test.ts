/*
 * MojitoClient.test.ts - unit tests for the MojitoClient facade
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
    test("delegates listRepositories and listLocales through the low-level client", async () => {
        const { fetchImpl, getLastRequest } = createJsonFetch((url) => {
            if (url.includes("/api/repositories")) {
                return [{ id: 1, name: "demo" }];
            }
            if (url.includes("/api/locales")) {
                return [{ id: 2, bcp47Tag: "ja-JP" }];
            }
            throw new Error(`Unexpected URL ${url}`);
        });
        const lowLevel = createTestClient(fetchImpl);
        const client = new MojitoClient({ lowLevel, baseUrl: "http://localhost:8080" });

        const repos = await client.listRepositories({ name: "demo" });
        expect(repos[0].name).toBe("demo");
        expect(new URL(getLastRequest().url).pathname).toBe("/api/repositories");

        const locales = await client.listLocales({ bcp47Tag: "ja-JP" });
        expect(locales[0].bcp47Tag).toBe("ja-JP");
        expect(new URL(getLastRequest().url).pathname).toBe("/api/locales");
    });

    test("call is an escape hatch to arbitrary operationIds", async () => {
        const { fetchImpl, getLastRequest } = createJsonFetch(() => ({ ok: true }));
        const lowLevel = createTestClient(fetchImpl);
        const client = new MojitoClient({ lowLevel });

        const result = await client.call<{ ok: boolean }>("getCsrfToken");
        expect(result).toEqual({ ok: true });
        expect(new URL(getLastRequest().url).pathname).toBe("/api/csrf-token");
    });

    test("me and searchTextUnits delegate to model helpers", async () => {
        const { fetchImpl, getLastRequest } = createJsonFetch((url) => {
            if (url.includes("/api/users/me")) {
                return { username: "bob" };
            }
            if (url.includes("/api/textunits/search")) {
                return [{ tmTextUnitId: 5, name: "title" }];
            }
            throw new Error(`Unexpected URL ${url}`);
        });
        const client = new MojitoClient({ lowLevel: createTestClient(fetchImpl) });

        const me = await client.me();
        expect(me.username).toBe("bob");

        const units = await client.searchTextUnits({ repositoryIds: [1] });
        expect(units[0].id).toBe(5);
        expect(JSON.parse(String(getLastRequest().init?.body))).toEqual({
            repositoryIds: [1],
        });
    });
});
