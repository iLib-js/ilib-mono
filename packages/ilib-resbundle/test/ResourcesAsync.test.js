/*
 * testresourcesasync.js - test the Resources object
 *
 * Copyright © 2018-2019, 2022, 2026 JEDLSoft
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

import ResBundle from "../src/index.js";

import IString from "ilib-istring";
import Locale from "ilib-locale";
import { Path } from "ilib-common";
import { LocaleData } from "ilib-localedata";

describe("testResourcesAsync", () => {
    test("ResBundleAsyncConstructorEmpty", async () => {
        expect.assertions(2);
        LocaleData.addGlobalRoot("test/resources");
        LocaleData.addGlobalRoot("test/resources2");
        LocaleData.addGlobalRoot("test/resources3");
        LocaleData.addGlobalRoot("test/resources4");
        ResBundle.clearPseudoLocales();
        LocaleData.clearCache();

        return ResBundle.create({}).then((rb) => {
            expect(rb !== null).toBeTruthy();

            expect(rb.getName()).toBe("strings");
        });
    });

    test("ResBundleAsyncConstructorOtherLocale", async () => {
        expect.assertions(2);
        return ResBundle.create({
            locale: "de-DE"
        }).then((rb) => {
            expect(rb !== null).toBeTruthy();

            var loc = rb.getLocale();

            expect(loc.toString()).toBe("de-DE");
        });
    });

    test("ResBundleAsyncGetStringOtherBundlePsuedoRaw", async () => {
        expect.assertions(4);
        return ResBundle.create({
            name: "tester",
            locale: "zxx-XX",
            type: "raw"
        }).then((rb) => {
            expect(rb !== null).toBeTruthy();

            // should pseudo-ize the replacement parameter names in raw mode
            expect(rb.getString("Hello from {country}").toString()).toBe("Ħëľľõ fŕõm {çõüñţŕÿ}");
            expect(rb.getString("Hello from {city}").toString()).toBe("Ħëľľõ fŕõm {çíţÿ}");
            expect(rb.getString("Greetings from {city} in {country}").toString()).toBe("Ĝŕëëţíñğš fŕõm {çíţÿ} íñ {çõüñţŕÿ}");
        });
    });

    test("ResBundleAsyncGetStringNonExistantTranslations", async () => {
        expect.assertions(2);
        return ResBundle.create({
            name: "tester",
            locale: "zh-CN"
        }).then((rb) => {
            expect(rb !== null).toBeTruthy();

            // should return source
            expect(rb.getString("foobar").toString()).toBe("foobar");
        });
    });

    test("ResBundleAsyncGetStringNoResourcesReturnSource", async () => {
        expect.assertions(2);
        return ResBundle.create({
            name: "tester",
            locale: "zz-ZZ"
        }).then((rb) => {
            expect(rb !== null).toBeTruthy();

            expect(rb.getString("This is a test.").toString()).toBe("This is a test.");
        });
    });

    test("ResBundleAsyncGetStringCyrlPsuedoRaw", async () => {
        expect.assertions(4);
        return ResBundle.create({
            name: "tester",
            locale: "zxx-Cyrl-XX",
            type: "raw"
        }).then((rb) => {
            expect(rb !== null).toBeTruthy();

            // should pseudo-ize the replacement parameter names in raw mode
            expect(rb.getString("Hello from {country}").toString()).toBe("Хэлло фром {чоунтря}");
            expect(rb.getString("Hello from {city}").toString()).toBe("Хэлло фром {читя}");
            expect(rb.getString("Greetings from {city} in {country}").toString()).toBe("Грээтингс фром {читя} ин {чоунтря}");
        });
    });

    test("ResBundleAsyncGetStringHansPsuedoText", async () => {
        expect.assertions(4);
        return ResBundle.create({
            name: "tester",
            locale: "zxx-Hans-XX",
            type: "text"
        }).then((rb) => {
            expect(rb !== null).toBeTruthy();

            // should not pseudo-ize the replacement parameter names
            // for Chinese scripts, remove the spaces to the simulate Chinese writing style
            expect(rb.getString("Hello from {country}").toString()).toBe("和俄了了夥凡熱夥们{country}");
            expect(rb.getString("Hello from {city}").toString()).toBe("和俄了了夥凡熱夥们{city}");
            expect(rb.getString("Greetings from {city} in {country}").toString()).toBe("个熱俄俄推意尼个思凡熱夥们{city}意尼{country}");
        });
    });

    test("ResBundleAsyncGetStringHebrPsuedoText", async () => {
        expect.assertions(4);
        return ResBundle.create({
            name: "tester",
            locale: "zxx-Hebr-XX",
            type: "text"
        }).then((rb) => {
            expect(rb !== null).toBeTruthy();

            // should not pseudo-ize the replacement parameter names
            expect(rb.getString("Hello from {country}").toString()).toBe("הֶללֹ פרֹמ {country}");
            expect(rb.getString("Hello from {city}").toString()).toBe("הֶללֹ פרֹמ {city}");
            expect(rb.getString("Greetings from {city} in {country}").toString()).toBe("גרֶֶטִנגס פרֹמ {city} ִנ {country}");
        });
    });

    test("ResBundleAsyncPseudo_euES", async () => {
        expect.assertions(1);
        ResBundle.clearPseudoLocales();
        ResBundle.addPseudoLocale("eu-XX");
        return ResBundle.create({
            locale:'eu-XX'
        }).then((rb) => {
            expect(rb.getString("This is psuedo string test").toString()).toBe("Ťĥíš íš þšüëðõ šţŕíñğ ţëšţ");
            ResBundle.clearPseudoLocales();
        });
    });

    test("ResBundleAsyncPseudo_psAF", async () => {
        expect.assertions(1);
        ResBundle.clearPseudoLocales();
        ResBundle.addPseudoLocale("ps-XX");
        return ResBundle.create({
            locale:'ps-XX'
        }).then((rb) => {
            expect(rb.getString("This is psuedo string test").toString()).toBe("טהִס ִס פסֶֻדֹ סטרִנג טֶסט");
            ResBundle.clearPseudoLocales();
        });
    });

    test("ResBundleConstructAsynchDynamic", async () => {
        return ResBundle.create({
            locale: "de-DE-SAP",
            name: "foobar"
        }).then((rb) => {
            expect.assertions(4);
            expect(typeof(rb) !== "undefined").toBeTruthy();

            expect(rb.getString("first string").toString()).toBe("erste String");
            expect(rb.getString("second string").toString()).toBe("zweite String");
            expect(rb.getString("third string").toString()).toBe("dritte String");
        });
    });

    test("ResBundleConstructAsynchDynamicDefaultName", async () => {
        return ResBundle.create({
            locale: "fr-CA-govt"
        }).then((rb) => {
            expect.assertions(4);
            expect(typeof(rb) !== "undefined").toBeTruthy();

            expect(rb.getString("first string").toString()).toBe("première corde");
            expect(rb.getString("second string").toString()).toBe("deuxième collier");
            expect(rb.getString("third string").toString()).toBe("troisième corde");
        });
    });

    test("ResBundleConstructAsynchDynamicNoStrings", async () => {
        return ResBundle.create({
            locale: "de-DE-SAP",
            name: "asdf" // doesn't exist
        }).then((rb) => {
            expect.assertions(4);
            expect(typeof(rb) !== "undefined").toBeTruthy();

            expect(rb.getString("first string").toString()).toBe("first string");
            expect(rb.getString("second string").toString()).toBe("second string");
            expect(rb.getString("third string").toString()).toBe("third string");
        });
    });
});
