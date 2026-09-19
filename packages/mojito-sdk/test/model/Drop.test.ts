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

import { Drop } from "../../src/model/Drop";
import { createJsonFetch, createTestClient } from "./testClient";
import Locale from "./ilibLocale";

describe("Drop", () => {
    test("list maps page content into Drop instances", async () => {
        const { fetchImpl } = createJsonFetch(() => ({
            content: [{ id: 1, name: "drop-a" }, { id: 2, name: "drop-b" }],
        }));
        const client = createTestClient(fetchImpl);

        const drops = await Drop.list(client, { repositoryId: 5 });
        expect(drops).toHaveLength(2);
        expect(drops[0]).toBeInstanceOf(Drop);
        expect(drops[0].id).toBe(1);
        expect(drops[1].name).toBe("drop-b");
    });

    test("export posts ExportDropConfig body", async () => {
        const { fetchImpl, getLastRequest } = createJsonFetch(() => ({ dropId: 99 }));
        const client = createTestClient(fetchImpl);

        const result = await Drop.export(client, {
            repositoryId: 7,
            locales: [new Locale("fr-FR")],
            customVendorFlag: true,
        });
        expect(result).toBeInstanceOf(Drop);
        expect(result.id).toBe(99);
        expect(JSON.parse(String(getLastRequest().init?.body))).toEqual({
            repositoryId: 7,
            locales: ["fr-FR"],
            customVendorFlag: true,
        });
    });

    test("import uses this drop id and repository from the instance", async () => {
        const { fetchImpl, getLastRequest } = createJsonFetch(() => ({ dropId: 4 }));
        const client = createTestClient(fetchImpl);
        const drop = new Drop(client, { id: 4, repository: { id: 7 } });

        const imported = await drop.import({ status: "APPROVED" });
        expect(imported.id).toBe(4);
        expect(JSON.parse(String(getLastRequest().init?.body))).toEqual({
            dropId: 4,
            repositoryId: 7,
            status: "APPROVED",
        });
    });
});
