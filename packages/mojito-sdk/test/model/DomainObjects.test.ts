/*
 * DomainObjects.test.ts - tests for generated-DTO-backed model objects
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
import { Branch } from "../../src/model/Branch";
import { RepositoryType } from "../../src/model/RepositoryType";
import { Screenshot } from "../../src/model/Screenshot";
import { Translation } from "../../src/model/Translation";
import { createJsonFetch, createTestClient } from "./testClient";
import Locale from "./ilibLocale";

describe("domain objects", () => {
    test("RepositoryType lists generated DTOs as model objects", async () => {
        const { fetchImpl, getLastRequest } = createJsonFetch(() => [
            { id: 3, name: "web", aiPrompt: "Preserve UI terminology." },
        ]);
        const types = await RepositoryType.list(createTestClient(fetchImpl), { name: "web" });

        expect(types[0]).toBeInstanceOf(RepositoryType);
        expect(types[0].name).toBe("web");
        expect(new URL(getLastRequest().url).pathname).toBe("/api/repo-types");
    });

    test("Asset and Branch expose domain fields", () => {
        const client = createTestClient(async () => new Response("{}", { status: 200 }));
        expect(new Asset(client, { id: 1, path: "messages.json", virtual: false }).path)
            .toBe("messages.json");
        expect(new Branch(client, { id: 2, name: "main" }, 1).name).toBe("main");
    });

    test("Screenshot maps clean filters to Mojito query names", async () => {
        const { fetchImpl, getLastRequest } = createJsonFetch(() => [
            { id: 4, name: "settings" },
        ]);
        const screenshots = await Screenshot.list(createTestClient(fetchImpl), {
            repositoryIds: [7],
            locales: [new Locale("fr-FR")],
            name: "settings",
        });

        expect(screenshots[0].name).toBe("settings");
        const url = new URL(getLastRequest().url);
        expect(url.searchParams.get("repositoryIds[]")).toBe("7");
        expect(url.searchParams.get("bcp47Tags[]")).toBe("fr-FR");
        expect(url.searchParams.get("screenshotName")).toBe("settings");
    });

    test("Translation maps AI review DTOs to a domain result", async () => {
        const { fetchImpl } = createJsonFetch(() => ({
            aiReviewOutput: {
                altTarget: {
                    content: "Bonjour",
                    explanation: "More idiomatic",
                    confidenceLevel: 95,
                },
                existingTargetRating: { score: 70 },
                reviewRequired: { required: true, reason: "Low score" },
            },
        }));
        const translation = new Translation(createTestClient(fetchImpl), { id: 9 });

        await expect(translation.reviewWithAi()).resolves.toEqual({
            suggestedContent: "Bonjour",
            explanation: "More idiomatic",
            confidence: 95,
            score: 70,
            reviewRequired: true,
            reason: "Low score",
        });
    });
});
