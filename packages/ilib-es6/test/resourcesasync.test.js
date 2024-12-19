/*
 * resourcesasync.test.js - test the Resources object
 *
 * Copyright © 2018, 2022-2024 JEDLSoft
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
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import ilib from "../src/ilib.js";

import ResBundle from "../src/ResBundle.js";
import Locale from "../src/Locale.js";

import path from 'path';

import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

describe("testresourcesasync", () => {
    test("ResBundleAsyncConstructorEmpty", () => {
        expect.assertions(2);
        ilib.clearPseudoLocales();

        new ResBundle({
            sync: false,
            onLoad: rb => {
                expect(rb !== null).toBeTruthy();

                expect(rb.getName()).toBe("strings");
            }
        });
    });

    test("ResBundleAsyncConstructorOtherLocale", () => {
        expect.assertions(2);
        new ResBundle({
            locale: "de-DE",
            sync: false,
            onLoad: rb => {
                expect(rb !== null).toBeTruthy();

                const loc = rb.getLocale();

                expect(loc.toString()).toBe("de-DE");
            }
        });
    });

    test("ResBundleAsyncGetStringOtherBundleesMX", () => {
        if (ilib._getPlatform() !== "nodejs" || !ilib._dyndata || !ilib._dyncode) {
            return;
        }

        expect.assertions(4);

        // clear this to be sure it is actually loading something
        ilib.data.strings = undefined;
        ilib.data.strings_es = undefined;
        ilib.data.strings_und_MX = undefined;
        ilib.data.strings_es_MX = undefined;
        ilib.clearCache();

        const base = path.relative(process.cwd(), path.resolve(__dirname, "./resources"));

        new ResBundle({
            locale: "es-MX",
            sync: false,
            loadParams: {
                base: base
            },
            onLoad: rb => {
                expect(rb !== null).toBeTruthy();

                expect(rb.getString("Hello from {country}").toString()).toBe("Que tal de {country}");
                expect(rb.getString("Hello from {city}").toString()).toBe("Que tal de {city}");
                expect(rb.getString("Greetings from {city} in {country}").toString()).toBe("Hola de {city} en {country}");
            }
        });

    });

    test("ResBundleAsyncGetStringOtherBundlePsuedoRaw", () => {
        expect.assertions(4);
        new ResBundle({
            name: "tester",
            locale: "zxx-XX",
            type: "raw",
            sync: false,
            onLoad: rb => {
                expect(rb !== null).toBeTruthy();

                // should not pseudo-ize the replacement parameter names
                expect(rb.getString("Hello from {country}").toString()).toBe("[Ħëľľõ fŕõm {çõüñţŕÿ}]");
                expect(rb.getString("Hello from {city}").toString()).toBe("[Ħëľľõ fŕõm {çíţÿ}]");
                expect(rb.getString("Greetings from {city} in {country}").toString()).toBe("[Ĝŕëëţíñğš fŕõm {çíţÿ} íñ {çõüñţŕÿ}]");
            }
        });
    });

    test("ResBundleAsyncGetStringNonExistantTranslations", () => {
        expect.assertions(2);
        new ResBundle({
            name: "tester",
            locale: "zh-CN",
            sync: false,
            onLoad: rb => {
                expect(rb !== null).toBeTruthy();

                // should return source
                expect(rb.getString("foobar").toString()).toBe("foobar");
            }
        });
    });

    test("ResBundleAsyncGetStringNoResourcesReturnSource", () => {
        expect.assertions(2);
        new ResBundle({
            name: "tester",
            locale: "zz-ZZ",
            sync: false,
            onLoad: rb => {
                expect(rb !== null).toBeTruthy();

                expect(rb.getString("This is a test.").toString()).toBe("This is a test.");
            }
        });
    });

    test("ResBundleAsyncGetStringCyrlPsuedoRaw", () => {
        expect.assertions(4);
        new ResBundle({
            name: "tester",
            locale: "zxx-Cyrl-XX",
            type: "raw",
            sync: false,
            onLoad: rb => {
                expect(rb !== null).toBeTruthy();

                // should pseudo-ize the replacement parameter names
                expect(rb.getString("Hello from {country}").toString()).toBe("[Хэлло фром {чоунтря}]");
                expect(rb.getString("Hello from {city}").toString()).toBe("[Хэлло фром {читя}]");
                expect(rb.getString("Greetings from {city} in {country}").toString()).toBe("[Грээтингс фром {читя} ин {чоунтря}]");
            }
        });

    });

    test("ResBundleAsyncGetStringHansPsuedoText", () => {
        expect.assertions(4);
        new ResBundle({
            name: "tester",
            locale: "zxx-Hans-XX",
            type: "text",
            sync: false,
            onLoad: rb => {
                expect(rb !== null).toBeTruthy();

                // should not pseudo-ize the replacement parameter names
                // for Chinese scripts, remove the spaces to the simulate Chinese writing style
                expect(rb.getString("Hello from {country}").toString()).toBe("[和俄了了夥凡熱夥们{country}]");
                expect(rb.getString("Hello from {city}").toString()).toBe("[和俄了了夥凡熱夥们{city}]");
                expect(rb.getString("Greetings from {city} in {country}").toString()).toBe("[个熱俄俄推意尼个思凡熱夥们{city}意尼{country}]");
            }
        });

    });

    test("ResBundleAsyncGetStringHebrPsuedoText", () => {
        expect.assertions(4);
        new ResBundle({
            name: "tester",
            locale: "zxx-Hebr-XX",
            type: "text",
            sync: false,
            onLoad: rb => {
                expect(rb !== null).toBeTruthy();

                // should not pseudo-ize the replacement parameter names
                expect(rb.getString("Hello from {country}").toString()).toBe("[הֶללֹ פרֹמ {country}]");
                expect(rb.getString("Hello from {city}").toString()).toBe("[הֶללֹ פרֹמ {city}]");
                expect(rb.getString("Greetings from {city} in {country}").toString()).toBe("[גרֶֶטִנגס פרֹמ {city} ִנ {country}]");
            }
        });

    });

    test("ResBundleAsyncPseudo_euES", () => {
        expect.assertions(1);
        ilib.clearPseudoLocales();
        ilib.setAsPseudoLocale("eu-ES");
        new ResBundle({
            locale:'eu-ES',
            sync: false,
            onLoad: rb => {
                expect(rb.getString("This is psuedo string test").toString()).toBe("[Ťĥíš íš þšüëðõ šţŕíñğ ţëšţ]");
                ilib.clearPseudoLocales();
            }
        });
    });

    test("ResBundleAsyncPseudo_psAF", () => {
        expect.assertions(1);
        ilib.clearPseudoLocales();
        ilib.setAsPseudoLocale("ps-AF");
        new ResBundle({
            locale:'ps-AF',
            sync: false,
            onLoad: rb => {
                expect(rb.getString("This is psuedo string test").toString()).toBe("[טהִס ִס פסֶֻדֹ סטרִנג טֶסט]");
                ilib.clearPseudoLocales();
            }
        });
    });
});
