/*
 * Asset.test.ts - unit tests for the Asset object model
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
import { createJsonFetch, createTestClient } from "./testClient";
import Locale from "./ilibLocale";

describe("Asset", () => {
    test("localize resolves a BCP 47 tag and returns localized content", async () => {
        const requests: string[] = [];
        const { fetchImpl } = createJsonFetch((url) => {
            requests.push(new URL(url).pathname);
            if (url.includes("/api/locales")) {
                return [{ id: 12, bcp47Tag: "fr-FR" }];
            }
            return { content: "bonjour=Bonjour" };
        });
        const asset = new Asset(createTestClient(fetchImpl), { id: 5 });

        const localized = await asset.localize({
            locale: new Locale("fr-FR"),
            content: "bonjour=Hello",
            status: "ACCEPTED",
        });

        expect(localized).toBe("bonjour=Bonjour");
        expect(requests).toEqual(["/api/locales", "/api/assets/5/localized/12"]);
    });

    test("localize accepts an ilib Locale", async () => {
        const { fetchImpl, getLastRequest } = createJsonFetch((url) =>
            url.includes("/api/locales")
                ? [{ id: 12, bcp47Tag: "fr-FR" }]
                : { content: "done" },
        );
        const asset = new Asset(createTestClient(fetchImpl), { id: 5 });

        await asset.localize({ locale: new Locale("fr-FR"), content: "source" });

        const request = getLastRequest();
        expect(new URL(request.url).pathname).toBe("/api/assets/5/localized/12");
        expect(JSON.parse(String(request.init?.body))).toEqual({ content: "source" });
    });

    test("localize caches the resolved locale id across calls", async () => {
        let localeLookups = 0;
        const { fetchImpl } = createJsonFetch((url) => {
            if (url.includes("/api/locales")) {
                localeLookups += 1;
                return [{ id: 12, bcp47Tag: "fr-FR" }];
            }
            return { content: "ok" };
        });
        const asset = new Asset(createTestClient(fetchImpl), { id: 5 });

        await asset.localize({ locale: new Locale("fr-FR"), content: "a" });
        await asset.localize({ locale: new Locale("fr-FR"), content: "b" });

        expect(localeLookups).toBe(1);
    });

    test("localize rejects a locale Mojito does not know", async () => {
        const { fetchImpl } = createJsonFetch(() => []);
        const asset = new Asset(createTestClient(fetchImpl), { id: 5 });

        await expect(asset.localize({ locale: new Locale("zz-ZZ"), content: "a" }))
            .rejects.toThrow('Unknown Mojito locale "zz-ZZ"');
    });

    test("pseudoLocalize posts to the pseudo endpoint", async () => {
        const { fetchImpl, getLastRequest } = createJsonFetch(() => ({ content: "[Ĥéļļö]" }));
        const asset = new Asset(createTestClient(fetchImpl), { id: 7 });

        const pseudo = await asset.pseudoLocalize({
            content: "greeting=Hello",
            substituteType: "CONSISTENT",
        });

        expect(pseudo).toBe("[Ĥéļļö]");
        expect(new URL(getLastRequest().url).pathname).toBe("/api/assets/7/pseudo");
    });

    test("importLocalized waits for the background task to finish", async () => {
        const paths: string[] = [];
        const { fetchImpl } = createJsonFetch((url) => {
            const { pathname } = new URL(url);
            paths.push(pathname);
            if (pathname === "/api/locales") {
                return [{ id: 12, bcp47Tag: "fr-FR" }];
            }
            if (pathname === "/api/assets/5/localized/12/import") {
                return { pollableTask: { id: 42, allFinished: false } };
            }
            if (pathname === "/api/pollableTasks/42") {
                return { id: 42, allFinished: true };
            }
            return { imported: true };
        });
        const asset = new Asset(createTestClient(fetchImpl), { id: 5 });

        await asset.importLocalized({
            locale: new Locale("fr-FR"),
            content: "greeting=Bonjour",
            wait: { pollIntervalMs: 1 },
        });

        expect(paths).toEqual([
            "/api/locales",
            "/api/assets/5/localized/12/import",
            "/api/pollableTasks/42",
            "/api/pollableTasks/42/output",
        ]);
    });

    test("importLocalized surfaces a task error message", async () => {
        const { fetchImpl } = createJsonFetch((url) => {
            if (url.includes("/api/locales")) {
                return [{ id: 12, bcp47Tag: "fr-FR" }];
            }
            if (url.includes("/import")) {
                return {
                    pollableTask: { id: 43, allFinished: true, errorMessage: "bad XLIFF" },
                };
            }
            return {};
        });
        const asset = new Asset(createTestClient(fetchImpl), { id: 5 });

        await expect(asset.importLocalized({ locale: new Locale("fr-FR"), content: "x" }))
            .rejects.toThrow("bad XLIFF");
    });

    test("localization methods require an asset id", async () => {
        const asset = new Asset(
            createTestClient(async () => new Response("{}", { status: 200 })),
            {},
        );

        await expect(asset.localize({ locale: new Locale("fr-FR"), content: "a" }))
            .rejects.toThrow("Asset.localize requires an asset id");
        await expect(asset.pseudoLocalize({ content: "a" }))
            .rejects.toThrow("Asset.pseudoLocalize requires an asset id");
    });
});
