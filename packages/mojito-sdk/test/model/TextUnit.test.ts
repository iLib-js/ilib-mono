/*
 * TextUnit.test.ts - unit tests for the TextUnit object model
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

import { TextUnit } from "../../src/model/TextUnit";
import { createJsonFetch, createTestClient } from "./testClient";

describe("TextUnit", () => {
    test("search maps results and forwards the request body", async () => {
        const { fetchImpl, getLastRequest } = createJsonFetch(() => [
            { tmTextUnitId: 10, name: "hello", content: "Hello" },
            { tmTextUnitId: 11, name: "bye", content: "Goodbye" },
        ]);
        const client = createTestClient(fetchImpl);

        const units = await TextUnit.search(client, {
            repositoryNames: ["demo"],
            localeTags: ["fr-FR"],
            vendorHint: "on",
        });

        expect(units).toHaveLength(2);
        expect(units[0]).toBeInstanceOf(TextUnit);
        expect(units[0].id).toBe(10);
        expect(units[1].data.content).toBe("Goodbye");

        expect(getLastRequest().init?.method).toBe("POST");
        expect(new URL(getLastRequest().url).pathname).toBe("/api/textunits/search");
        expect(JSON.parse(String(getLastRequest().init?.body))).toEqual({
            repositoryNames: ["demo"],
            localeTags: ["fr-FR"],
            vendorHint: "on",
        });
    });

    test("search returns an empty array when the response body is empty", async () => {
        const fetchImpl: typeof fetch = async () => new Response("", { status: 200 });
        const client = createTestClient(fetchImpl);
        const units = await TextUnit.search(client);
        expect(units).toEqual([]);
    });
});
