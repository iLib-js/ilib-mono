/*
 * SourceString.test.ts - unit tests for the SourceString object model
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

import { Asset } from "../../src/model/Asset";
import { SourceString } from "../../src/model/SourceString";
import { createJsonFetch, createTestClient } from "./testClient";
import Locale from "./ilibLocale";

describe("SourceString", () => {
    test("Asset.sourceStrings maps results and forwards the request body", async () => {
        const { fetchImpl, getLastRequest } = createJsonFetch(() => [
            { tmTextUnitId: 10, name: "hello", source: "Hello" },
            { tmTextUnitId: 11, name: "bye", source: "Goodbye" },
        ]);
        const client = createTestClient(fetchImpl);
        const asset = new Asset(client, { id: 3, path: "messages.json" });

        const units = await asset.sourceStrings({
            locales: [new Locale("fr-FR")],
            vendorHint: "on",
        });

        expect(units).toHaveLength(2);
        expect(units[0]).toBeInstanceOf(SourceString);
        expect(units[0].id).toBe(10);
        expect(units[1].content).toBe("Goodbye");

        expect(getLastRequest().init?.method).toBe("POST");
        expect(new URL(getLastRequest().url).pathname).toBe("/api/textunits/search");
        expect(JSON.parse(String(getLastRequest().init?.body))).toEqual({
            localeTags: ["fr-FR"],
            vendorHint: "on",
            assetPath: "messages.json",
        });
    });

    test("Asset.sourceStrings returns an empty array when the response body is empty", async () => {
        const fetchImpl: typeof fetch = async () => new Response("", { status: 200 });
        const client = createTestClient(fetchImpl);
        const asset = new Asset(client, { path: "a.json" });
        const units = await asset.sourceStrings();
        expect(units).toEqual([]);
    });

    test("Asset.sourceStrings requires an asset path", async () => {
        const client = createTestClient(async () => new Response("{}", { status: 200 }));
        const asset = new Asset(client, { id: 1 });
        await expect(asset.sourceStrings()).rejects.toThrow(/requires an asset path/);
    });
});
