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
import { Translation } from "../../src/model/Translation";
import { createJsonFetch, createTestClient } from "./testClient";
import Locale from "./ilibLocale";

describe("SourceString", () => {
    test("Asset.sourceStrings maps results and forwards the request body", async () => {
        const { fetchImpl, getLastRequest } = createJsonFetch(() => [
            { tmTextUnitId: 10, name: "hello", source: "Hello" },
            { tmTextUnitId: 11, name: "bye", source: "Goodbye" },
        ]);
        const client = createTestClient(fetchImpl);
        const asset = new Asset(client, { id: 3, path: "messages.json", repositoryId: 11 });

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
            repositoryIds: [11],
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

    test("translations requests the current wording for the selected locales", async () => {
        const { fetchImpl, getLastRequest } = createJsonFetch(() => [
            {
                tmTextUnitId: 10,
                tmTextUnitVariantId: 20,
                target: "Bonjour",
                targetLocale: "fr-FR",
                status: "APPROVED",
            },
            { tmTextUnitId: 10, name: "hello", source: "Hello" },
        ]);
        const source = new SourceString(createTestClient(fetchImpl), {
            id: 10,
            repositoryId: 4,
        });

        const translations = await source.translations({ locales: [new Locale("fr-FR")] });

        expect(translations).toHaveLength(1);
        expect(translations[0].content).toBe("Bonjour");
        expect(translations[0].locale?.getSpec()).toBe("fr-FR");
        expect(translations[0].status).toBe("APPROVED");
        expect(JSON.parse(String(getLastRequest().init?.body))).toEqual({
            tmTextUnitIds: [10],
            localeTags: ["fr-FR"],
            repositoryIds: [4],
        });
    });

    test("screenshots keeps rows linked to this source string", async () => {
        const { fetchImpl, getLastRequest } = createJsonFetch(() => [
            { id: 1, name: "shot", textUnits: [{ tmTextUnit: { id: 10 } }] },
            { id: 2, name: "other", textUnits: [{ tmTextUnit: { id: 99 } }] },
            { id: 3, name: "unlinked" },
        ]);
        const source = new SourceString(createTestClient(fetchImpl), {
            id: 10,
            name: "hello",
            content: "Hello",
            repositoryId: 4,
        });

        const screenshots = await source.screenshots();

        expect(screenshots.map((screenshot) => screenshot.id)).toEqual([1, 3]);
        const url = new URL(getLastRequest().url);
        expect(url.pathname).toBe("/api/screenshots");
        expect(url.searchParams.get("name")).toBe("hello");
        expect(url.searchParams.get("source")).toBe("Hello");
        expect(url.searchParams.get("searchType")).toBe("EXACT");
        expect(url.searchParams.get("repositoryIds[]")).toBe("4");
    });

    test("getTranslationHistory keeps author, date, and variant comments", async () => {
        const { fetchImpl } = createJsonFetch(() => [
            {
                id: 5,
                content: "Bonjour",
                createdDate: "2020-01-01T00:00:00Z",
                status: "APPROVED",
                comment: "ship it",
                locale: { bcp47Tag: "fr-FR" },
                includedInLocalizedFile: true,
                createdByUser: { id: 7, username: "alice", givenName: "Alice" },
                tmTextUnitVariantComments: [{
                    id: 1,
                    content: "note",
                    severity: "INFO",
                    type: "AI_TRANSLATE",
                }],
            },
        ]);
        const source = new SourceString(createTestClient(fetchImpl), { id: 10 });

        const history = await source.getTranslationHistory(new Locale("fr-FR"));

        expect(history).toHaveLength(1);
        expect(history[0].content).toBe("Bonjour");
        expect(history[0].createdDate).toBe("2020-01-01T00:00:00Z");
        expect(history[0].createdByUser).toEqual({
            id: 7,
            username: "alice",
            givenName: "Alice",
            surname: undefined,
            commonName: undefined,
        });
        expect(history[0].comments).toEqual([{
            id: 1,
            createdDate: undefined,
            content: "note",
            severity: "INFO",
            type: "AI_TRANSLATE",
        }]);
        expect(history[0].includedInLocalizedFile).toBe(true);
        expect(history[0].comment).toBe("ship it");
    });

    test("createTranslation posts target fields for this source string", async () => {
        const { fetchImpl, getLastRequest } = createJsonFetch(() => ({
            tmTextUnitId: 10,
            tmTextUnitVariantId: 44,
            target: "Bonjour",
            targetLocale: "fr-FR",
            status: "REVIEW_NEEDED",
        }));
        const source = new SourceString(createTestClient(fetchImpl), {
            id: 10,
            name: "hello",
            content: "Hello",
            assetId: 5,
            repositoryName: "demo",
        });

        const translation = await source.createTranslation({
            locale: new Locale("fr-FR"),
            content: "Bonjour",
            status: "REVIEW_NEEDED",
        });

        expect(translation).toBeInstanceOf(Translation);
        expect(translation.id).toBe(44);
        expect(translation.content).toBe("Bonjour");
        expect(JSON.parse(String(getLastRequest().init?.body))).toMatchObject({
            tmTextUnitId: 10,
            assetId: 5,
            name: "hello",
            source: "Hello",
            target: "Bonjour",
            targetLocale: "fr-FR",
            status: "REVIEW_NEEDED",
        });
    });

    test("createScreenshot posts a screenshot run linked to this string", async () => {
        const { fetchImpl, getLastRequest } = createJsonFetch(() => ({
            screenshots: [{ id: 9, name: "home", src: "https://example/home.png" }],
        }));
        const source = new SourceString(createTestClient(fetchImpl), {
            id: 10,
            name: "hello",
            content: "Hello",
            repositoryId: 4,
        });

        const screenshot = await source.createScreenshot({
            name: "home",
            sourceUrl: "https://example/home.png",
        });

        expect(screenshot.id).toBe(9);
        expect(screenshot.sourceUrl).toBe("https://example/home.png");
        expect(new URL(getLastRequest().url).pathname).toBe("/api/screenshots");
        expect(JSON.parse(String(getLastRequest().init?.body))).toEqual({
            name: "home",
            repository: { id: 4 },
            screenshots: [{
                name: "home",
                src: "https://example/home.png",
                textUnits: [{
                    tmTextUnit: { id: 10 },
                    name: "hello",
                    source: "Hello",
                }],
            }],
        });
    });

    test("delete removes the virtual-asset text unit by name", async () => {
        const { fetchImpl, getLastRequest } = createJsonFetch(() => undefined);
        const source = new SourceString(createTestClient(fetchImpl), {
            id: 10,
            name: "hello",
            content: "Hello",
            assetId: 5,
        });

        await source.delete();

        expect(getLastRequest().init?.method).toBe("DELETE");
        expect(new URL(getLastRequest().url).pathname).toBe("/api/virtualAssets/5/textUnits");
        expect(JSON.parse(String(getLastRequest().init?.body))).toEqual({
            name: "hello",
            content: "Hello",
        });
    });

    test("Translation.delete removes the current variant", async () => {
        const { fetchImpl, getLastRequest } = createJsonFetch(() => undefined);
        const translation = new Translation(createTestClient(fetchImpl), { id: 44 });

        await translation.delete();

        expect(getLastRequest().init?.method).toBe("DELETE");
        expect(new URL(getLastRequest().url).pathname).toBe("/api/textunits/44");
    });
});
