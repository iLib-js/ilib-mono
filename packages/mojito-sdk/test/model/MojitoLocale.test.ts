/*
 * MojitoLocale.test.ts - unit tests for Mojito locale inheritance
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

import { MojitoLocale } from "../../src/model/MojitoLocale";
import { createTestClient } from "./testClient";
import Locale from "./ilibLocale";

describe("MojitoLocale", () => {
    const client = createTestClient(async () => new Response("{}", { status: 200 }));

    test("represents a fully translated locale", () => {
        const locale = new MojitoLocale(client, new Locale("fr-FR"));

        expect(locale.locale.getSpec()).toBe("fr-FR");
        expect(locale.isFullyTranslated).toBe(true);
        expect(locale.inherits).toBe(false);
        expect(locale.inheritsFromSource).toBe(false);
    });

    test("represents a locale inherited from an explicit parent", () => {
        const locale = new MojitoLocale(client, new Locale("fr-CA"), {
            parent: new Locale("fr-FR"),
        });

        expect(locale.inherits).toBe(true);
        expect(locale.parent?.getSpec()).toBe("fr-FR");
        expect(locale.inheritsFromSource).toBe(false);
    });

    test("represents a locale inherited from the source locale", () => {
        const locale = new MojitoLocale(client, new Locale("fr-CA"), {
            inherits: true,
        });

        expect(locale.inherits).toBe(true);
        expect(locale.parent).toBeUndefined();
        expect(locale.inheritsFromSource).toBe(true);
    });
});
