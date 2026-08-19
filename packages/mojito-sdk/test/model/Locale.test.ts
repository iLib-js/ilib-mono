/*
 * Locale.test.ts - unit tests for the Locale object model
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

import { Locale } from "../../src/model/Locale";
import { createJsonFetch, createTestClient } from "./testClient";

describe("Locale", () => {
    test("list maps locales and forwards query filters", async () => {
        const { fetchImpl, getLastRequest } = createJsonFetch(() => [
            { id: 1, bcp47Tag: "en-US" },
            { id: 2, bcp47Tag: "fr-FR" },
        ]);
        const client = createTestClient(fetchImpl);

        const locales = await Locale.list(client, {
            bcp47Tag: "fr-FR",
            onlyEnabled: true,
        });

        expect(locales).toHaveLength(2);
        expect(locales[0]).toBeInstanceOf(Locale);
        expect(locales[0].id).toBe(1);
        expect(locales[1].bcp47Tag).toBe("fr-FR");

        const url = new URL(getLastRequest().url);
        expect(url.pathname).toBe("/api/locales");
        expect(url.searchParams.get("bcp47Tag")).toBe("fr-FR");
        expect(url.searchParams.get("onlyEnabled")).toBe("true");
    });
});
