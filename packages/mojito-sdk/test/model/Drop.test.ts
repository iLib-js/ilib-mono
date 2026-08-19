/*
 * Drop.test.ts - unit tests for the Drop object model
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
import { Drop } from "../../src/model/Drop";

describe("Drop", () => {
    test("list maps page content into Drop instances", async () => {
        const auth: AuthProvider = { async authorize() { return {}; } };
        const fetchImpl: typeof fetch = async () =>
            new Response(
                JSON.stringify({
                    content: [{ id: 1, name: "drop-a" }, { id: 2, name: "drop-b" }],
                }),
                { status: 200 },
            );
        const client = new LowLevelClient({
            baseUrl: "http://localhost:8080",
            auth,
            fetchImpl,
        });

        const drops = await Drop.list(client, { repositoryId: 5 });
        expect(drops).toHaveLength(2);
        expect(drops[0]).toBeInstanceOf(Drop);
        expect(drops[0].id).toBe(1);
        expect(drops[1].name).toBe("drop-b");
    });

    test("export posts ExportDropConfig body", async () => {
        const auth: AuthProvider = { async authorize() { return {}; } };
        let body = "";
        const fetchImpl: typeof fetch = async (_input, init) => {
            body = String(init?.body);
            return new Response(JSON.stringify({ dropId: 99 }), { status: 200 });
        };
        const client = new LowLevelClient({
            baseUrl: "http://localhost:8080",
            auth,
            fetchImpl,
        });

        const result = await Drop.export(client, {
            repositoryId: 7,
            locales: ["fr-FR"],
            customVendorFlag: true,
        });
        expect(result.dropId).toBe(99);
        expect(JSON.parse(body)).toEqual({
            repositoryId: 7,
            locales: ["fr-FR"],
            customVendorFlag: true,
        });
    });
});
