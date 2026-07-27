/*
 * testresources.js - test the Resources object
 *
 * Copyright © 2012-2015, 2017-2019, 2021-2022, 2026 JEDLSoft
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

import IString from "ilib-istring";
import Locale from "ilib-locale";
import { getPlatform, getLocale, setLocale } from 'ilib-env';
import getLocaleData, { LocaleData } from 'ilib-localedata';

import ResBundle from "../src/index.js";
import { localeList } from './locales.js';

let setupCompleted = false;

function arrayEqual(array1, array2) {
    if (!Array.isArray(array1) || !Array.isArray(array2)) {
        throw new Error("not an array");
    }

    for (let i = 0; i < array1.length; i++) {
        expect(array1[i]).toEqual(array2[i]);
    }
}

describe("testResources", () => {
    beforeEach(() => {
        setLocale("en-US");
    });

    beforeAll(async () => {
        if (!setupCompleted) {
            LocaleData.addGlobalRoot("test/resources");
            LocaleData.addGlobalRoot("test/resources2");
            LocaleData.addGlobalRoot("test/resources3");
            LocaleData.addGlobalRoot("test/resources4");
            ResBundle.clearPseudoLocales();
            LocaleData.clearCache();
            if (getPlatform() === "browser") {
                // The webpack loader cannot load synchronously, so we have to
                // pre-load the locale data before running these sync tests. The
                // browser build stores its assembled data under "../assembled"
                // (the same path ResBundle uses in the browser), so we must
                // register that as a global root.
                LocaleData.addGlobalRoot("../assembled");
                let promise = Promise.resolve(true);
                localeList.locales.forEach(locale => {
                    promise = promise.then(() => LocaleData.ensureLocale(locale));
                });
                promise = promise.then(async () => {
                    const locData = getLocaleData({
                        path: "../assembled",
                        sync: false
                    });
                    // Pre-cache data for sync tests that use locales/basenames
                    // that are not fully covered by ensureLocale alone.
                    await locData.loadData({
                        basename: "pseudomap",
                        locale: "zxx-Latn-XX",
                        sync: false
                    });
                    await locData.loadData({
                        basename: "tester",
                        locale: "zz-ZZ",
                        sync: false
                    });
                });
                await promise;
            }
            setupCompleted = true;
        }
    });

    test("ResBundleConstructorEmpty", () => {
        expect.assertions(1);

        var rb = new ResBundle();

        expect(rb !== null).toBeTruthy();
    });

    test("ResBundleConstructorDefaultName", () => {
        expect.assertions(2);
        var rb = new ResBundle();

        expect(rb !== null).toBeTruthy();

        expect(rb.getName()).toBe("strings");
    });

    test("ResBundleConstructorDefaultLocale", () => {
        expect.assertions(2);
        var rb = new ResBundle();

        expect(rb !== null).toBeTruthy();

        var loc = rb.getLocale();

        expect(loc.toString()).toBe("en-US");
    });

    test("ResBundleConstructorOtherLocale", () => {
        expect.assertions(2);
        var rb = new ResBundle({locale: "de-DE"});

        expect(rb !== null).toBeTruthy();

        var loc = rb.getLocale();

        expect(loc.toString()).toBe("de-DE");
    });

    test("ResBundleConstructorOtherName", () => {
        expect.assertions(2);
        var rb = new ResBundle({name: "tester"});

        expect(rb !== null).toBeTruthy();

        expect(rb.getName()).toBe("tester");
    });

    test("ResBundleGetString", () => {
        expect.assertions(4);
        var rb = new ResBundle(); // default locale

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("first string").toString()).toBe("first");
        expect(rb.getString("second string").toString()).toBe("second");
        expect(rb.getString("third string").toString()).toBe("third");
    });

    test("ResBundleGetStringJS", () => {
        expect.assertions(4);
        var rb = new ResBundle(); // default locale

        expect(rb !== null).toBeTruthy();

        expect(rb.getStringJS("first string")).toBe("first");
        expect(rb.getStringJS("second string")).toBe("second");
        expect(rb.getStringJS("third string")).toBe("third");
    });

    test("ResBundleGetStringJSUndefinedSource", () => {
        expect.assertions(2);
        var rb = new ResBundle(); // default locale

        expect(rb !== null).toBeTruthy();

        expect(typeof(rb.getStringJS(undefined)) === "undefined").toBeTruthy();
    });

    test("ResBundleGetStringEmpty", () => {
        expect.assertions(2);
        var rb = new ResBundle(); // default locale

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("").toString()).toBe("");
    });

    test("ResBundleGetStringUndefined", () => {
        expect.assertions(2);
        var rb = new ResBundle(); // default locale

        expect(rb !== null).toBeTruthy();

        expect(rb.getString(undefined).toString()).toBe("");
    });

    test("ResBundleGetStringde", () => {
        expect.assertions(4);
        var rb = new ResBundle({locale: "de"});

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("first string").toString()).toBe("erste String");
        expect(rb.getString("second string").toString()).toBe("zweite String");
        expect(rb.getString("third string").toString()).toBe("dritte String");
    });

    test("ResBundleGetStringfr", () => {
        expect.assertions(4);
        var rb = new ResBundle({locale: "fr"});

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("first string").toString()).toBe("première chaîne");
        expect(rb.getString("second string").toString()).toBe("deuxième chaîne");
        expect(rb.getString("third string").toString()).toBe("troisième chaîne");
    });

    test("ResBundleGetStringfrCA", () => {
        expect.assertions(4);
        var rb = new ResBundle({locale: "fr-CA"});

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("first string").toString()).toBe("première collier");
        expect(rb.getString("second string").toString()).toBe("deuxième collier");
        expect(rb.getString("third string").toString()).toBe("troisième chaîne");
    });

    test("ResBundleGetStringfrCAgovt", () => {
        expect.assertions(4);
        var rb = new ResBundle({locale: "fr-CA-govt"});

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("first string").toString()).toBe("première corde");
        expect(rb.getString("second string").toString()).toBe("deuxième collier");
        expect(rb.getString("third string").toString()).toBe("troisième corde");
    });

    test("ResBundleGetStringDefaultToParent", () => {
        expect.assertions(4);
        var rb = new ResBundle({locale: "de-DE"});

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("first string").toString()).toBe("erste String");
        expect(rb.getString("second string").toString()).toBe("zweite String");
        expect(rb.getString("third string").toString()).toBe("dritte String");
    });

    test("ResBundleGetStringDefaultToSource", () => {
        expect.assertions(4);
        var rb = new ResBundle({locale: "ja-JP"});

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("first string x").toString()).toBe("first string x");
        expect(rb.getString("second string x").toString()).toBe("second string x");
        expect(rb.getString("third string x").toString()).toBe("third string x");
    });

    test("ResBundleGetStringJSDefaultToSource", () => {
        expect.assertions(4);
        var rb = new ResBundle({locale: "ja-JP"});

        expect(rb !== null).toBeTruthy();

        expect(rb.getStringJS("first string x")).toBe("first string x");
        expect(rb.getStringJS("second string x")).toBe("second string x");
        expect(rb.getStringJS("third string x")).toBe("third string x");
    });

    test("ResBundleGetStringOtherBundle", () => {
        expect.assertions(4);
        var rb = new ResBundle({name: "tester"});

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("Hello from {country}").toString()).toBe("Hello from {country}");
        expect(rb.getString("Hello from {city}").toString()).toBe("Hello from {city}");
        expect(rb.getString("Greetings from {city} in {country}").toString()).toBe("Greetings from {city} in {country}");
    });

    test("ResBundleGetStringOtherBundleesES", () => {
        expect.assertions(4);
        var rb = new ResBundle({
            name: "tester",
            locale: "es-ES"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("Hello from {country}").toString()).toBe("Saludos desde {country}");
        expect(rb.getString("Hello from {city}").toString()).toBe("Saludos desde {city}");
        expect(rb.getString("Greetings from {city} in {country}").toString()).toBe("Saludos desde {city} en {country}");
    });

    test("ResBundleGetStringOtherBundleesMX", () => {
        expect.assertions(4);
        var rb = new ResBundle({
            name: "tester",
            locale: "es-MX"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("Hello from {country}").toString()).toBe("Hola de {country}");
        expect(rb.getString("Hello from {city}").toString()).toBe("Saludos desde {city}");
        expect(rb.getString("Greetings from {city} in {country}").toString()).toBe("Hola de {city} en {country}");
    });

    test("ResBundleGetStringOtherBundleesMXslang", () => {
        expect.assertions(4);
        var rb = new ResBundle({
            name: "tester",
            locale: "es-MX-slang"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("Hello from {country}").toString()).toBe("Que tal de {country}");
        expect(rb.getString("Hello from {city}").toString()).toBe("Que tal de {city}");
        expect(rb.getString("Greetings from {city} in {country}").toString()).toBe("Hola de {city} en {country}");
    });

    test("ResBundleGetStringOtherBundlePseudoRaw", () => {
        expect.assertions(4);
        var rb = new ResBundle({
            name: "tester",
            locale: "zxx-XX",
            type: "raw"
        });

        expect(rb !== null).toBeTruthy();

        // should not pseudo-ize the replacement parameter names
        expect(rb.getString("Hello from {country}").toString()).toBe("Ħëľľõ fŕõm {çõüñţŕÿ}");
        expect(rb.getString("Hello from {city}").toString()).toBe("Ħëľľõ fŕõm {çíţÿ}");
        expect(rb.getString("Greetings from {city} in {country}").toString()).toBe("Ĝŕëëţíñğš fŕõm {çíţÿ} íñ {çõüñţŕÿ}");
    });

    test("ResBundleGetStringOtherBundlePseudoText", () => {
        expect.assertions(4);
        var rb = new ResBundle({
            name: "tester",
            locale: "zxx-XX",
            type: "text"
        });

        expect(rb !== null).toBeTruthy();

        // should not pseudo-ize the replacement parameter names
        expect(rb.getString("Hello from {country}").toString()).toBe("Ħëľľõ fŕõm {country}");
        expect(rb.getString("Hello from {city}").toString()).toBe("Ħëľľõ fŕõm {city}");
        expect(rb.getString("Greetings from {city} in {country}").toString()).toBe("Ĝŕëëţíñğš fŕõm {city} íñ {country}");
    });

    test("ResBundleGetStringOtherBundlePseudoHtml", () => {
        expect.assertions(4);
        var rb = new ResBundle({
            name: "tester",
            locale: "zxx-XX",
            type: "html"
        });

        expect(rb !== null).toBeTruthy();

        // should not pseudo-ize the replacement parameter names
        expect(rb.getString("Hello from {country}").toString()).toBe("Ħëľľõ fŕõm {country}");
        expect(rb.getString("Hello from {city}").toString()).toBe("Ħëľľõ fŕõm {city}");
        expect(rb.getString("Greetings from {city} in {country}").toString()).toBe("Ĝŕëëţíñğš fŕõm {city} íñ {country}");
    });

    test("ResBundleGetStringOtherBundlePseudoHtmlWithTags", () => {
        expect.assertions(4);
        var rb = new ResBundle({
            name: "tester",
            locale: "zxx-XX",
            type: "html"
        });

        expect(rb !== null).toBeTruthy();

        // should not pseudo-ize the replacement parameter names
        expect(rb.getString("Hello from <span class=\"foo\">{country}</span>").toString()).toBe("Ħëľľõ fŕõm <span class=\"foo\">{country}</span>");
        expect(rb.getString("Hello from <span class=\"foo\">{city}</span>").toString()).toBe("Ħëľľõ fŕõm <span class=\"foo\">{city}</span>");
        expect(rb.getString("Greetings from <span class=\"foo\">{city}</span> in <span class=\"foo\">{country}</span>").toString()).toBe("Ĝŕëëţíñğš fŕõm <span class=\"foo\">{city}</span> íñ <span class=\"foo\">{country}</span>");
    });

    test("ResBundleGetStringOtherBundlePseudoHtmlWithMultipleTags", () => {
        expect.assertions(4);
        var rb = new ResBundle({
            name: "tester",
            locale: "zxx-XX",
            type: "html"
        });

        expect(rb !== null).toBeTruthy();

        // should not pseudo-ize the replacement parameter names
        expect(rb.getString("Hello from <div><span class=\"foo\">{country}</span></div>").toString()).toBe("Ħëľľõ fŕõm <div><span class=\"foo\">{country}</span></div>");
        expect(rb.getString("Hello from <div><span class=\"foo\">{city}</span></div>").toString()).toBe("Ħëľľõ fŕõm <div><span class=\"foo\">{city}</span></div>");
        expect(rb.getString("Greetings from <div><span class=\"foo\">{city}</span></div> in <div><span class=\"foo\">{country}</span></div>").toString()).toBe("Ĝŕëëţíñğš fŕõm <div><span class=\"foo\">{city}</span></div> íñ <div><span class=\"foo\">{country}</span></div>");
    });

    test("ResBundleGetStringOtherBundlePseudoHtmlWithTagsAndEntities", () => {
        expect.assertions(4);
        var rb = new ResBundle({
            name: "tester",
            locale: "zxx-XX",
            type: "html"
        });

        expect(rb !== null).toBeTruthy();

        // should not pseudo-ize the replacement parameter names
        expect(rb.getString("Hello from &amp;<span class=\"foo\">{country}</span>&mdash;").toString()).toBe("Ħëľľõ fŕõm &amp;<span class=\"foo\">{country}</span>&mdash;");
        expect(rb.getString("Hello from &amp;<span class=\"foo\">{city}</span>&mdash;").toString()).toBe("Ħëľľõ fŕõm &amp;<span class=\"foo\">{city}</span>&mdash;");
        expect(rb.getString("Greetings from &amp;<span class=\"foo\">{city}</span>&mdash; in &amp;<span class=\"foo\">{country}</span>&mdash;").toString()).toBe("Ĝŕëëţíñğš fŕõm &amp;<span class=\"foo\">{city}</span>&mdash; íñ &amp;<span class=\"foo\">{country}</span>&mdash;");
    });

    test("ResBundleGetStringOtherBundlePseudoXml", () => {
        expect.assertions(4);
        var rb = new ResBundle({
            name: "tester",
            locale: "zxx-XX",
            type: "xml"
        });

        expect(rb !== null).toBeTruthy();

        // should not pseudo-ize the replacement parameter names
        expect(rb.getString("Hello from {country}").toString()).toBe("Ħëľľõ fŕõm {country}");
        expect(rb.getString("Hello from {city}").toString()).toBe("Ħëľľõ fŕõm {city}");
        expect(rb.getString("Greetings from {city} in {country}").toString()).toBe("Ĝŕëëţíñğš fŕõm {city} íñ {country}");
    });

    test("ResBundleGetStringOtherBundlePseudoC", () => {
        expect.assertions(48);
        var rb = new ResBundle({
            name: "tester",
            locale: "zxx-XX",
            type: "c",
            lengthen: true
        });

        expect(rb !== null).toBeTruthy();

        // should not pseudo-ize the C style replacement parameters
        // now follows the IEEE printf specification:
        // https://pubs.opengroup.org/onlinepubs/009695399/functions/printf.html
        expect(rb.getStringJS("actual %s ")).toBe("àçţüàľ %s 43210");
        expect(rb.getStringJS("actual %b ")).toBe("àçţüàľ %b 43210");
        expect(rb.getStringJS("actual %c ")).toBe("àçţüàľ %c 43210");
        expect(rb.getStringJS("actual %d ")).toBe("àçţüàľ %d 43210");
        expect(rb.getStringJS("actual %o ")).toBe("àçţüàľ %o 43210");
        expect(rb.getStringJS("actual %x ")).toBe("àçţüàľ %x 43210");
        expect(rb.getStringJS("actual %e ")).toBe("àçţüàľ %e 43210");
        expect(rb.getStringJS("actual %f ")).toBe("àçţüàľ %f 43210");
        expect(rb.getStringJS("actual %g ")).toBe("àçţüàľ %g 43210");
        expect(rb.getStringJS("actual %a ")).toBe("àçţüàľ %a 43210");
        expect(rb.getStringJS("actual %% ")).toBe("àçţüàľ %% 43210");
        expect(rb.getStringJS("actual %n ")).toBe("àçţüàľ %n 43210");
        expect(rb.getStringJS("actual %p ")).toBe("àçţüàľ %p 43210");

        expect(rb.getStringJS("actual %S ")).toBe("àçţüàľ %S 43210");
        expect(rb.getStringJS("actual %C ")).toBe("àçţüàľ %C 43210");
        expect(rb.getStringJS("actual %X ")).toBe("àçţüàľ %X 43210");
        expect(rb.getStringJS("actual %E ")).toBe("àçţüàľ %E 43210");
        expect(rb.getStringJS("actual %G ")).toBe("àçţüàľ %G 43210");
        expect(rb.getStringJS("actual %A ")).toBe("àçţüàľ %A 43210");
        expect(rb.getStringJS("actual %% ")).toBe("àçţüàľ %% 43210");

        expect(rb.getStringJS("actual %2$s ")).toBe("àçţüàľ %2$s 543210");
        expect(rb.getStringJS("actual %-d ")).toBe("àçţüàľ %-d 543210");
        expect(rb.getStringJS("actual %#d ")).toBe("àçţüàľ %#d 543210");
        expect(rb.getStringJS("actual %+d ")).toBe("àçţüàľ %+d 543210");
        expect(rb.getStringJS("actual % d ")).toBe("àçţüàľ % d 543210");
        expect(rb.getStringJS("actual %02d ")).toBe("àçţüàľ %02d 543210");
        expect(rb.getStringJS("actual %.2d ")).toBe("àçţüàľ %.2d 543210");
        expect(rb.getStringJS("actual %(2d ")).toBe("àçţüàľ %(2d 543210");
        expect(rb.getStringJS("actual %4$-2.2d ")).toBe("àçţüàľ %4$-2.2d 76543210");

        expect(rb.getStringJS("actual %N ")).toBe("àçţüàľ %Ň 43210");
        expect(rb.getStringJS("actual %F ")).toBe("àçţüàľ %F 43210");
        expect(rb.getStringJS("actual %D ")).toBe("àçţüàľ %Ð 43210");
        expect(rb.getStringJS("actual %O ")).toBe("àçţüàľ %Ø 43210");

        expect(rb.getStringJS("actual %hd ")).toBe("àçţüàľ %hd 543210");
        expect(rb.getStringJS("actual %hhd ")).toBe("àçţüàľ %hhd 543210");
        expect(rb.getStringJS("actual %ld ")).toBe("àçţüàľ %ld 543210");
        expect(rb.getStringJS("actual %lld ")).toBe("àçţüàľ %lld 543210");
        expect(rb.getStringJS("actual %Af ")).toBe("àçţüàľ %Af 543210");
        expect(rb.getStringJS("actual %zd ")).toBe("àçţüàľ %zd 543210");
        expect(rb.getStringJS("actual %td ")).toBe("àçţüàľ %td 543210");
        expect(rb.getStringJS("actual %jd ")).toBe("àçţüàľ %jd 543210");
        expect(rb.getStringJS("actual %% ")).toBe("àçţüàľ %% 43210");

        // now everything at once!
        expect(rb.getStringJS("actual %2$+0.4lld ")).toBe("àçţüàľ %2$+0.4lld 876543210");

        // now some extended format specifiers to support Swift/Objective-C
        // from https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/Strings/Articles/formatSpecifiers.html#//apple_ref/doc/uid/TP40004265-SW1
        // %@ means format an objective-C or swift object
        expect(rb.getStringJS("actual %@ ")).toBe("àçţüàľ %@ 43210");
        expect(rb.getStringJS("actual %2$@ ")).toBe("àçţüàľ %2$@ 543210");
        expect(rb.getStringJS("actual %2$0ll@ ")).toBe("àçţüàľ %2$0ll@ 76543210");
        expect(rb.getStringJS("actual %qd ")).toBe("àçţüàľ %qd 543210");

    });

    test("ResBundleGetStringOtherBundlePseudoDefault", () => {
        expect.assertions(4);
        var rb = new ResBundle({
            name: "tester",
            locale: "zxx-XX"
        });

        expect(rb !== null).toBeTruthy();

        // should be equivalent to "text" and not pseudo-ize the replacement parameter names
        expect(rb.getString("Hello from {country}").toString()).toBe("Ħëľľõ fŕõm {country}");
        expect(rb.getString("Hello from {city}").toString()).toBe("Ħëľľõ fŕõm {city}");
        expect(rb.getString("Greetings from {city} in {country}").toString()).toBe("Ĝŕëëţíñğš fŕõm {city} íñ {country}");
    });

    test("ResBundleGetStringMissingBundlePseudoHtml", () => {
        expect.assertions(4);
        var rb = new ResBundle({
            name: "asdfasdffoobar",
            locale: "zxx-XX",
            type: "html"
        });

        expect(rb !== null).toBeTruthy();

        // should still pseudo-translate, despite having no translations
        expect(rb.getString("Hello from {country}").toString()).toBe("Ħëľľõ fŕõm {country}");
        expect(rb.getString("Hello from {city}").toString()).toBe("Ħëľľõ fŕõm {city}");
        expect(rb.getString("Greetings from {city} in {country}").toString()).toBe("Ĝŕëëţíñğš fŕõm {city} íñ {country}");
    });

    test("ResBundleGetStringPseudoHtmlLengthenShort", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "asdfasdffoobar",
            locale: "zxx-XX",
            type: "html",
            lengthen: true
        });

        expect(rb !== null).toBeTruthy();

        // short: increase by 50%
        expect(rb.getString("Hello from Paris").toString()).toBe("Ħëľľõ fŕõm Pàŕíš76543210");
    });

    test("ResBundleGetStringPseudoHtmlLengthenMedium", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "asdfasdffoobar",
            locale: "zxx-XX",
            type: "html",
            lengthen: true
        });

        expect(rb !== null).toBeTruthy();

        // short: increase by 33%
        expect(rb.getString("Hello from Paris, city of lights").toString()).toBe("Ħëľľõ fŕõm Pàŕíš, çíţÿ õf ľíğĥţš09876543210");
    });

    test("ResBundleGetStringPseudoHtmlLengthenLong", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "asdfasdffoobar",
            locale: "zxx-XX",
            type: "html",
            lengthen: true
        });

        expect(rb !== null).toBeTruthy();

        // short: increase by 20%
        expect(rb.getString("Hello from Paris, city of culture, lights, and superb cuisine.").toString()).toBe("Ħëľľõ fŕõm Pàŕíš, çíţÿ õf çüľţüŕë, ľíğĥţš, àñð šüþëŕb çüíšíñë.109876543210");
    });

    test("ResBundleGetStringPseudoLeaveHTMLTags", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "tester",
            locale: "zxx-XX",
            type: "html"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("Hello from <a href='url'>{city}</a>").toString()).toBe("Ħëľľõ fŕõm <a href='url'>{city}</a>");
    });

    test("ResBundleGetStringPseudoLeaveHTMLTags2", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "tester",
            locale: "zxx-XX",
            type: "html"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getString('<span class="n_letter">n</span>Cluster: <strong>{clusterName}</strong>').toString()).toBe('<span class="n_letter">ñ</span>Çľüšţëŕ: <strong>{clusterName}</strong>');
    });

    test("ResBundleGetStringPseudoNotLeaveHTMLTagsRaw", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "tester",
            locale: "zxx-XX",
            type: "raw"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("Hello from <a href='url'>{city}</a>").toString()).toBe("Ħëľľõ fŕõm <à ĥŕëf='üŕľ'>{çíţÿ}</à>");
    });

    test("ResBundleGetStringPseudoNotLeaveHTMLTagsText", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "tester",
            locale: "zxx-XX",
            type: "text"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("Hello from <a href='url'>{city}</a>").toString()).toBe("Ħëľľõ fŕõm <à ĥŕëf='üŕľ'>{city}</à>");
    });

    test("ResBundleGetStringPseudoLeaveHTMLEntities", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "tester",
            locale: "zxx-XX",
            type: "html"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("Hello from {city} &amp; {country}").toString()).toBe("Ħëľľõ fŕõm {city} &amp; {country}");
    });

    test("ResBundleGetStringPseudoNotLeaveHTMLEntitiesRaw", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "tester",
            locale: "zxx-XX",
            type: "raw"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("Hello from {city} &amp; {country}").toString()).toBe("Ħëľľõ fŕõm {çíţÿ} &àmþ; {çõüñţŕÿ}");
    });

    test("ResBundleGetStringPseudoNotLeaveHTMLEntitiesText", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "tester",
            locale: "zxx-XX",
            type: "text"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("Hello from {city} &amp; {country}").toString()).toBe("Ħëľľõ fŕõm {city} &àmþ; {country}");
    });

    test("ResBundleGetStringMissingBundlePseudoXml", () => {
        expect.assertions(4);
        var rb = new ResBundle({
            name: "asdfasdffoobar",
            locale: "zxx-XX",
            type: "xml"
        });

        expect(rb !== null).toBeTruthy();

        // should still pseudo-translate, despite having no translations
        expect(rb.getString("Hello from {country}").toString()).toBe("Ħëľľõ fŕõm {country}");
        expect(rb.getString("Hello from {city}").toString()).toBe("Ħëľľõ fŕõm {city}");
        expect(rb.getString("Greetings from {city} in {country}").toString()).toBe("Ĝŕëëţíñğš fŕõm {city} íñ {country}");
    });

    test("ResBundleGetStringPseudoXmlLengthenShort", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "asdfasdffoobar",
            locale: "zxx-XX",
            type: "xml",
            lengthen: true
        });

        expect(rb !== null).toBeTruthy();

        // short: increase by 50%
        expect(rb.getString("Hello from Paris").toString()).toBe("Ħëľľõ fŕõm Pàŕíš76543210");
    });

    test("ResBundleGetStringPseudoXmlLengthenMedium", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "asdfasdffoobar",
            locale: "zxx-XX",
            type: "xml",
            lengthen: true
        });

        expect(rb !== null).toBeTruthy();

        // short: increase by 33%
        expect(rb.getString("Hello from Paris, city of lights").toString()).toBe("Ħëľľõ fŕõm Pàŕíš, çíţÿ õf ľíğĥţš09876543210");
    });

    test("ResBundleGetStringPseudoXmlLengthenLong", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "asdfasdffoobar",
            locale: "zxx-XX",
            type: "xml",
            lengthen: true
        });

        expect(rb !== null).toBeTruthy();

        // short: increase by 20%
        expect(rb.getString("Hello from Paris, city of culture, lights, and superb cuisine.").toString()).toBe("Ħëľľõ fŕõm Pàŕíš, çíţÿ õf çüľţüŕë, ľíğĥţš, àñð šüþëŕb çüíšíñë.109876543210");
    });

    test("ResBundleGetStringPseudoLeaveXmlTags", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "tester",
            locale: "zxx-XX",
            type: "xml"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("Hello from <city type='large'>{city}</city>").toString()).toBe("Ħëľľõ fŕõm <city type='large'>{city}</city>");
    });

    test("ResBundleGetStringPseudoLeaveXmlEntities", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "tester",
            locale: "zxx-XX",
            type: "xml"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("Hello from {city} &amp; {country}").toString()).toBe("Ħëľľõ fŕõm {city} &amp; {country}");
    });

    test("ResBundleGetStringWithKeyNamees", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "tester",
            locale: "es"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("Hello from {user}.", "key1").toString()).toBe("Saludos desde {user}.");
    });

    test("ResBundleGetStringWithKeyNameesMX", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "tester",
            locale: "es-MX"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("Hello from {user}.", "key1").toString()).toBe("Saludos desde {user}.");
    });

    test("ResBundleGetStringWithKeyNameesMXslang", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "tester",
            locale: "es-MX-slang"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("Hello from {user}.", "key1").toString()).toBe("Buenas desde {user}.");
    });

    test("ResBundleGetStringWithKeyNamedeDE", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "tester",
            locale: "de-DE"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("Hello from {user}.", "key1").toString()).toBe("Grüße vom {user}");
    });

    test("ResBundleGetStringWithKeyNameUnknown", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "tester",
            locale: "de-DE"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("Hello from {user}.", "key3").toString()).toBe("Hello from {user}.");
    });

    test("ResBundleGetStringRightLocale", () => {
        expect.assertions(3);
        var rb = new ResBundle({
            locale: "de-DE"
        });

        expect(rb !== null).toBeTruthy();

        var str = rb.getString("first string");
        expect(str.toString()).toBe("erste String");
        expect(str.getLocale()).toBe("de-DE");
    });

    test("ResBundleGetResObj", () => {
        expect.assertions(4);
        var rb = new ResBundle({locale: "fr"});

        expect(rb !== null).toBeTruthy();

        var obj = rb.getResObj();

        expect(obj["first string"]).toBe("première chaîne");
        expect(obj["second string"]).toBe("deuxième chaîne");
        expect(obj["third string"]).toBe("troisième chaîne");
    });

    test("ResBundleGetResObjMerge", () => {
        expect.assertions(4);
        var rb = new ResBundle({locale: "fr-CA"});

        expect(rb !== null).toBeTruthy();

        var obj = rb.getResObj();

        expect(obj["first string"]).toBe("première collier");
        expect(obj["second string"]).toBe("deuxième collier");
        expect(obj["third string"]).toBe("troisième chaîne");
    });

    test("ResBundleGetStringAcceptEmptyTranslations", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "tester",
            locale: "zh-CN"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("empty").toString()).toBe("");
    });

    test("ResBundleGetStringNonExistantTranslations", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "tester",
            locale: "zh-CN"
        });

        expect(rb !== null).toBeTruthy();

        // should return source
        expect(rb.getString("foobar").toString()).toBe("foobar");
    });

    test("ResBundleGetStringAcceptSpaceTranslations", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "tester",
            locale: "zh-CN"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("space").toString()).toBe(" ");
    });

    test("ResBundleGetStringAcceptCommaTranslations", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "tester",
            locale: "zh-CN"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("comma").toString()).toBe(",");
    });

    test("ResBundleGetStringAcceptEmptyTranslationsWithKey", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "tester",
            locale: "zh-CN"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("asdf", "empty").toString()).toBe("");
    });

    test("ResBundleGetStringAcceptNonExistantTranslationsWithKey", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "tester",
            locale: "zh-CN"
        });

        expect(rb !== null).toBeTruthy();

        // should return source
        expect(rb.getString("asdf", "foobar").toString()).toBe("asdf");
    });

    test("ResBundleGetStringAcceptSpaceTranslationsWithKey", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "tester",
            locale: "zh-CN"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("asdf", "space").toString()).toBe(" ");
    });

    test("ResBundleGetStringAcceptCommaTranslationsWithKey", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "tester",
            locale: "zh-CN"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("asdf", "comma").toString()).toBe(",");
    });

    test("ResBundleGetStringNoResourcesReturnSource", () => {
        expect.assertions(2);
       var rb = new ResBundle({
         name: "tester",
         locale: "zz-ZZ"
       });

       expect(rb !== null).toBeTruthy();

       expect(rb.getString("This is a test.").toString()).toBe("This is a test.");
       });

    test("ResBundleGetStringNoResourcesReturnSourceHtmlTypeHtml", () => {
        expect.assertions(2);
       var rb = new ResBundle({
         name: "tester",
         locale: "zz-ZZ",
         type: "html"
       });

       expect(rb !== null).toBeTruthy();

       expect(rb.getString("This is a <b>test</b>. A&amp;P.").toString()).toBe("This is a <b>test</b>. A&amp;P.");
       });

    test("ResBundleGetStringNoResourcesReturnSourceHtmlTypejs", () => {
        expect.assertions(2);
       var rb = new ResBundle({
         name: "tester",
         locale: "zz-ZZ",
         type: "js"
       });

       expect(rb !== null).toBeTruthy();

       expect(rb.getString("This is a <b>test</b>. A&amp;P.").toString()).toBe("This is a <b>test</b>. A&amp;P.");
       });

    test("ResBundleGetStringNoResourcesReturnSourceTypejsNoEscape", () => {
        expect.assertions(2);
       var rb = new ResBundle({
         name: "tester",
         locale: "zz-ZZ",
         type: "js"
       });

       expect(rb !== null).toBeTruthy();

       expect(rb.getString("This is a 'test'.").toString()).toBe("This is a 'test'.");
       });

    test("ResBundleGetStringNoResourcesReturnSourceTypejsWithEscape", () => {
        expect.assertions(2);
       var rb = new ResBundle({
         name: "tester",
         locale: "zz-ZZ",
         type: "js"
       });

       expect(rb !== null).toBeTruthy();

       expect(rb.getString("This is a 'test'.", undefined, "js").toString()).toBe("This is a \\'test\\'.");
       });

    test("ResBundleGetStringNoResourcesReturnSourceTypeHtmlWithEscape", () => {
        expect.assertions(2);
       var rb = new ResBundle({
         name: "tester",
         locale: "zz-ZZ",
         type: "html"
       });

       expect(rb !== null).toBeTruthy();

       expect(rb.getString("This is a <b>test</b>. A&amp;P.", undefined, "html").toString()).toBe("This is a &lt;b&gt;test&lt;/b&gt;. A&amp;amp;P.");
       });

    test("ResBundleGetStringNoResourcesReturnSourceTypeHtmlWithEscapeJS", () => {
        expect.assertions(2);
       var rb = new ResBundle({
         name: "tester",
         locale: "zz-ZZ",
         type: "html"
       });

       expect(rb !== null).toBeTruthy();

       expect(rb.getString("This is <a href=\"a test\">a 'test'</a>.", undefined, "js").toString()).toBe("This is <a href=\\\"a test\\\">a \\'test\\'</a>.");
       });

    test("ResBundleGetStringPseudoHtmlNoEscape", () => {
        expect.assertions(2);
       var rb = new ResBundle({
           name: "asdfasdffoobar",
           locale: "zxx-XX",
           type: "html"
       });

       expect(rb !== null).toBeTruthy();

       expect(rb.getString("Hello from <a href=\"asdf\">Paris</a>, city of lights.").toString()).toBe("Ħëľľõ fŕõm <a href=\"asdf\">Pàŕíš</a>, çíţÿ õf ľíğĥţš.");
       });

    test("ResBundleGetStringPseudoHtmlEscapeHtml", () => {
        expect.assertions(2);
       var rb = new ResBundle({
           name: "asdfasdffoobar",
           locale: "zxx-XX",
           type: "html"
       });

       expect(rb !== null).toBeTruthy();

       expect(rb.getString("Hello from <a href=\"asdf\">Paris</a>, city of lights.", undefined, "html").toString()).toBe("Ħëľľõ fŕõm &lt;a href=\"asdf\"&gt;Pàŕíš&lt;/a&gt;, çíţÿ õf ľíğĥţš.");
       });

    test("ResBundleGetStringPseudoHtmlEscapeJst", () => {
        expect.assertions(2);
       var rb = new ResBundle({
           name: "asdfasdffoobar",
           locale: "zxx-XX",
           type: "template"
       });

       expect(rb !== null).toBeTruthy();

       expect(rb.getStringJS("Hello from <%= (i > 4) ? RB.getStringJS(\"Las Vegas\") : RB.getStringJS(\"Paris\") %>, city of lights.", undefined, "none")).toBe("Ħëľľõ fŕõm <%= (i > 4) ? RB.getStringJS(\"Las Vegas\") : RB.getStringJS(\"Paris\") %>, çíţÿ õf ľíğĥţš.");
       });

    test("ResBundleGetStringPseudoHtmlEscapeRuby", () => {
        expect.assertions(2);
       var rb = new ResBundle({
           name: "asdfasdffoobar",
           locale: "zxx-XX",
           type: "ruby"
       });

       expect(rb !== null).toBeTruthy();

       expect(rb.getStringJS("Hello from %PARIS%, city of lights.", undefined, "html")).toBe("Ħëľľõ fŕõm %PARIS%, çíţÿ õf ľíğĥţš.");
       });

    test("ResBundleGetStringPseudoHtmlEscapeHaml", () => {
        expect.assertions(2);
       var rb = new ResBundle({
           name: "asdfasdffoobar",
           locale: "zxx-XX",
           type: "ruby"
       });

       expect(rb !== null).toBeTruthy();

       expect(rb.getStringJS("Hello from %{city}, city of #{description}.")).toBe("Ħëľľõ fŕõm %{city}, çíţÿ õf #{description}.");
       });

    test("ResBundleGetStringPseudoHtmlEscapeJS", () => {
        expect.assertions(2);
       var rb = new ResBundle({
           name: "asdfasdffoobar",
           locale: "zxx-XX",
           type: "html"
       });

       expect(rb !== null).toBeTruthy();

       expect(rb.getString("Hello from <a href=\"asdf\">Paris</a>, city of lights.", undefined, "js").toString()).toBe("Ħëľľõ fŕõm <a href=\\\"asdf\\\">Pàŕíš</a>, çíţÿ õf ľíğĥţš.");
       });

    test("ResBundleContainsKeyByKeyTrue", () => {
        expect.assertions(2);
       var rb = new ResBundle({
           name: "strings",
           locale: "de-DE"
       });

       expect(rb !== null).toBeTruthy();

       expect(rb.containsKey(undefined, "first string")).toBeTruthy();
       });

    test("ResBundleContainsKeyByKeyFalse", () => {
        expect.assertions(2);
       var rb = new ResBundle({
           name: "strings",
           locale: "de-DE"
       });

       expect(rb !== null).toBeTruthy();

       expect(!rb.containsKey(undefined, "asdfasdf")).toBeTruthy();
       });

    test("ResBundleContainsKeyBySourceTrue", () => {
        expect.assertions(2);
       var rb = new ResBundle({
           name: "strings",
           locale: "de-DE"
       });

       expect(rb !== null).toBeTruthy();

       expect(rb.containsKey("first string")).toBeTruthy();
       });

    test("ResBundleContainsKeyBySourceFalse", () => {
        expect.assertions(2);
       var rb = new ResBundle({
           name: "strings",
           locale: "de-DE"
       });

       expect(rb !== null).toBeTruthy();

       expect(!rb.containsKey("asdfasdf")).toBeTruthy();
       });

    test("ResBundleContainsKeyBySourceMakeKey", () => {
        expect.assertions(2);
       var rb = new ResBundle({
           name: "strings",
           locale: "de-DE"
       });

       expect(rb !== null).toBeTruthy();

       expect(rb.containsKey("first   \t\t\r\n  string")).toBeTruthy();
       });

    test("ResBundleContainsKeyBothUndefined", () => {
        expect.assertions(2);
       var rb = new ResBundle({
           name: "strings",
           locale: "de-DE"
       });

       expect(rb !== null).toBeTruthy();

       expect(!rb.containsKey(undefined, undefined)).toBeTruthy();
       });

    test("ResBundleConstructSynchDynamic", () => {
        // uses Mock
        var rb = new ResBundle({
            locale: "de-DE-SAP",
            name: "foobar"
        });

        expect.assertions(4);
        expect(typeof(rb) !== "undefined").toBeTruthy();

        expect(rb.getString("first string").toString()).toBe("erste String");
        expect(rb.getString("second string").toString()).toBe("zweite String");
        expect(rb.getString("third string").toString()).toBe("dritte String");
    });

    test("ResBundleConstructSynchDynamicDefaultName", () => {
        // uses Mock
        var rb = new ResBundle({
            locale: "fr-CA-govt"
        });

        expect.assertions(4);
        expect(typeof(rb) !== "undefined").toBeTruthy();

        expect(rb.getString("first string").toString()).toBe("première corde");
        expect(rb.getString("second string").toString()).toBe("deuxième collier");
        expect(rb.getString("third string").toString()).toBe("troisième corde");
    });

    test("ResBundleConstructSynchDynamicNoStrings", () => {
        // uses Mock
        var rb = new ResBundle({
            locale: "de-DE-SAP",
            name: "asdf" // doesn't exist
        });

        expect.assertions(4);
        expect(typeof(rb) !== "undefined").toBeTruthy();

        expect(rb.getString("first string").toString()).toBe("first string");
        expect(rb.getString("second string").toString()).toBe("second string");
        expect(rb.getString("third string").toString()).toBe("third string");
    });

    test("ResBundleGetStringCyrlPseudoRaw", () => {
        expect.assertions(4);
        var rb = new ResBundle({
            name: "tester",
            locale: "zxx-Cyrl-XX",
            type: "raw"
        });

        expect(rb !== null).toBeTruthy();

        // should pseudo-ize the replacement parameter names
        expect(rb.getString("Hello from {country}").toString()).toBe("Хэлло фром {чоунтря}");
        expect(rb.getString("Hello from {city}").toString()).toBe("Хэлло фром {читя}");
        expect(rb.getString("Greetings from {city} in {country}").toString()).toBe("Грээтингс фром {читя} ин {чоунтря}");
    });

    test("ResBundleGetStringCyrlPseudoText", () => {
        expect.assertions(4);
        var rb = new ResBundle({
            name: "tester",
            locale: "zxx-Cyrl-XX",
            type: "text"
        });

        expect(rb !== null).toBeTruthy();

        // should not pseudo-ize the replacement parameter names
        expect(rb.getString("Hello from {country}").toString()).toBe("Хэлло фром {country}");
        expect(rb.getString("Hello from {city}").toString()).toBe("Хэлло фром {city}");
        expect(rb.getString("Greetings from {city} in {country}").toString()).toBe("Грээтингс фром {city} ин {country}");
    });

    test("ResBundleGetStringCyrlPseudoHtml", () => {
        expect.assertions(4);
        var rb = new ResBundle({
            name: "tester",
            locale: "zxx-Cyrl-XX",
            type: "html"
        });

        expect(rb !== null).toBeTruthy();

        // should not pseudo-ize the replacement parameter names
        expect(rb.getString("Hello from {country}").toString()).toBe("Хэлло фром {country}");
        expect(rb.getString("Hello from {city}").toString()).toBe("Хэлло фром {city}");
        expect(rb.getString("Greetings from {city} in {country}").toString()).toBe("Грээтингс фром {city} ин {country}");
    });

    test("ResBundleGetStringCyrlPseudoXml", () => {
        expect.assertions(4);
        var rb = new ResBundle({
            name: "tester",
            locale: "zxx-Cyrl-XX",
            type: "xml"
        });

        expect(rb !== null).toBeTruthy();

        // should not pseudo-ize the replacement parameter names
        expect(rb.getString("Hello from {country}").toString()).toBe("Хэлло фром {country}");
        expect(rb.getString("Hello from {city}").toString()).toBe("Хэлло фром {city}");
        expect(rb.getString("Greetings from {city} in {country}").toString()).toBe("Грээтингс фром {city} ин {country}");
    });

    test("ResBundleGetStringCyrlPseudoDefault", () => {
        expect.assertions(4);
        var rb = new ResBundle({
            name: "tester",
            locale: "zxx-Cyrl-XX"
        });

        expect(rb !== null).toBeTruthy();

        // should be equivalent to "text" and not pseudo-ize the replacement parameter names
        expect(rb.getString("Hello from {country}").toString()).toBe("Хэлло фром {country}");
        expect(rb.getString("Hello from {city}").toString()).toBe("Хэлло фром {city}");
        expect(rb.getString("Greetings from {city} in {country}").toString()).toBe("Грээтингс фром {city} ин {country}");
    });

    test("ResBundleGetStringHansPseudoText", () => {
        expect.assertions(4);
        var rb = new ResBundle({
            name: "tester",
            locale: "zxx-Hans-XX",
            type: "text"
        });

        expect(rb !== null).toBeTruthy();

        // should not pseudo-ize the replacement parameter names
        // for Chinese scripts, remove the spaces to the simulate Chinese writing style
        expect(rb.getString("Hello from {country}").toString()).toBe("和俄了了夥凡熱夥们{country}");
        expect(rb.getString("Hello from {city}").toString()).toBe("和俄了了夥凡熱夥们{city}");
        expect(rb.getString("Greetings from {city} in {country}").toString()).toBe("个熱俄俄推意尼个思凡熱夥们{city}意尼{country}");
    });

    test("ResBundleGetStringHebrPseudoText", () => {
        expect.assertions(4);
        var rb = new ResBundle({
            name: "tester",
            locale: "zxx-Hebr-XX",
            type: "text"
        });

        expect(rb !== null).toBeTruthy();

        // should not pseudo-ize the replacement parameter names
        expect(rb.getString("Hello from {country}").toString()).toBe("הֶללֹ פרֹמ {country}");
        expect(rb.getString("Hello from {city}").toString()).toBe("הֶללֹ פרֹמ {city}");
        expect(rb.getString("Greetings from {city} in {country}").toString()).toBe("גרֶֶטִנגס פרֹמ {city} ִנ {country}");
    });

    test("ResBundleGetStringMissingWrongValue", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "tester2",
            locale: "ru-RU",
            missing: "foo"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.missing).toBe("source");
    });

    test("ResBundleGetStringMissingRightValue1", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "tester2",
            locale: "ru-RU",
            missing: "pseudo"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.missing).toBe("pseudo");
    });

    test("ResBundleGetStringMissingRightValue2", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "tester2",
            locale: "ru-RU",
            missing: "source"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.missing).toBe("source");
    });

    test("ResBundleGetStringMissingRightValue3", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "tester2",
            locale: "ru-RU",
            missing: "empty"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.missing).toBe("empty");
    });

    test("ResBundleGetStringCyrlMissingRawSource", () => {
        expect.assertions(4);
        var rb = new ResBundle({
            name: "tester2",
            locale: "ru-RU",
            type: "raw",
            missing: "source"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("Hello from {country}").toString()).toBe("Hello from {country}");
        expect(rb.getString("Hello from {city}").toString()).toBe("Hello from {city}");
        expect(rb.getString("Greetings from {city} in {country}").toString()).toBe("Greetings from {city} in {country}");
    });

    test("ResBundleGetStringCyrlMissingRawPseudo", () => {
        expect.assertions(4);
        var rb = new ResBundle({
            name: "tester2",
            locale: "ru-RU",
            type: "raw",
            missing: "pseudo"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("Hello from {country}").toString()).toBe("Хэлло фром {чоунтря}");
        expect(rb.getString("Hello from {city}").toString()).toBe("Хэлло фром {читя}");
        expect(rb.getString("Greetings from {city} in {country}").toString()).toBe("Грээтингс фром {читя} ин {чоунтря}");
    });

    test("ResBundleGetStringCyrlMissingRawEmpty", () => {
        expect.assertions(4);
        var rb = new ResBundle({
            name: "tester2",
            locale: "ru-RU",
            type: "raw",
            missing: "empty"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("Hello from {country}").toString()).toBe("");
        expect(rb.getString("Hello from {city}").toString()).toBe("");
        expect(rb.getString("Greetings from {city} in {country}").toString()).toBe("");
    });

    test("ResBundleGetStringLatnMissingPseudo", () => {
        expect.assertions(4);
        var rb = new ResBundle({
            name: "tester2",
            locale: "de-DE",
            missing: "pseudo"
        });

        expect(rb !== null).toBeTruthy();

        // should not pseudo-ize the replacement parameter names
        expect(rb.getString("Hello from {country}").toString()).toBe("Ħëľľõ fŕõm {country}");
        expect(rb.getString("Hello from {city}").toString()).toBe("Ħëľľõ fŕõm {city}");
        expect(rb.getString("Greetings from {city} in {country}").toString()).toBe("Ĝŕëëţíñğš fŕõm {city} íñ {country}");
    });

    test("ResBundleGetStringCyrlMissingPseudo", () => {
        expect.assertions(4);
        var rb = new ResBundle({
            name: "tester2",
            locale: "ru-RU",
            missing: "pseudo"
        });

        expect(rb !== null).toBeTruthy();

        // should not pseudo-ize the replacement parameter names
        expect(rb.getString("Hello from {country}").toString()).toBe("Хэлло фром {country}");
        expect(rb.getString("Hello from {city}").toString()).toBe("Хэлло фром {city}");
        expect(rb.getString("Greetings from {city} in {country}").toString()).toBe("Грээтингс фром {city} ин {country}");
    });

    test("ResBundleGetStringHebrMissingPseudo", () => {
        expect.assertions(4);
        var rb = new ResBundle({
            name: "tester2",
            locale: "he-IL",
            missing: "pseudo"
        });

        expect(rb !== null).toBeTruthy();

        // should not pseudo-ize the replacement parameter names
        expect(rb.getString("Hello from {country}").toString()).toBe("הֶללֹ פרֹמ {country}");
        expect(rb.getString("Hello from {city}").toString()).toBe("הֶללֹ פרֹמ {city}");
        expect(rb.getString("Greetings from {city} in {country}").toString()).toBe("גרֶֶטִנגס פרֹמ {city} ִנ {country}");
    });

    test("ResBundleGetStringHansMissingPseudo", () => {
        expect.assertions(4);
        var rb = new ResBundle({
            name: "tester2",
            locale: "zh-Hans-CN",
            missing: "pseudo"
        });

        expect(rb !== null).toBeTruthy();

        // should not pseudo-ize the replacement parameter names
        // for Chinese scripts, remove the spaces to the simulate Chinese writing style
        expect(rb.getString("Hello from {country}").toString()).toBe("和俄了了夥凡熱夥们{country}");
        expect(rb.getString("Hello from {city}").toString()).toBe("和俄了了夥凡熱夥们{city}");
        expect(rb.getString("Greetings from {city} in {country}").toString()).toBe("个熱俄俄推意尼个思凡熱夥们{city}意尼{country}");
    });

    test("ResBundleGetStringWithSpaces", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "tester2"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getString(" This is a test. ").toString()).toBe("test1");
    });

    test("ResBundleGetStringCompressSpaces", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "tester2"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("    This    is     a     test.     ").toString()).toBe("test1");
    });

    test("ResBundleGetStringConvertAllWhiteToSpaces", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "tester2"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getString(" \t\r   This \n\n   is \n\t    a    \t test.  \n   ").toString()).toBe("test1");
    });

    test("ResBundleGetStringCompressSpacesEnd", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "tester2"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("This    is     a     test.     ").toString()).toBe("test2");
    });

    test("ResBundleGetStringCompressSpacesBeginning", () => {
        expect.assertions(2);
        var rb = new ResBundle({
            name: "tester2"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getString("     This    is     a     test.").toString()).toBe("test3");
    });

    test("ResBundlePseudo_euES", () => {
        expect.assertions(1);
        ResBundle.clearPseudoLocales();
        ResBundle.addPseudoLocale("eu-XX");
        var rb = new ResBundle({
            locale:'eu-XX'
        });
        expect(rb.getStringJS("This is pseudo string test")).toBe("Ťĥíš íš þšëüðõ šţŕíñğ ţëšţ");
        ResBundle.clearPseudoLocales();
    });

    test("ResBundlePseudo_psAF", () => {
        expect.assertions(1);
        ResBundle.clearPseudoLocales();
        ResBundle.addPseudoLocale("ps-XX");
        var rb = new ResBundle({
            locale:'ps-XX'
        });
        expect(rb.getStringJS("This is pseudo string test")).toBe('טהִס ִס פסֶֻדֹ סטרִנג טֶסט');

        ResBundle.clearPseudoLocales();
    });

    test("ResBundlePseudo_deDE", () => {
        expect.assertions(1);
        ResBundle.clearPseudoLocales();
        ResBundle.addPseudoLocale("de-DE");
        var rb = new ResBundle({
            locale:'de-DE'
        });
        expect(rb.getStringJS("This is pseudo string test")).toBe("Ťĥíš íš þšëüðõ šţŕíñğ ţëšţ");
        ResBundle.clearPseudoLocales();
    });

    test("ResBundlePseudoReallyThere", () => {
        expect.assertions(2);
        ResBundle.clearPseudoLocales();
        expect(!ResBundle.isPseudoLocale("de-DE")).toBeTruthy();
        ResBundle.addPseudoLocale("de-DE");
        expect(ResBundle.isPseudoLocale("de-DE")).toBeTruthy();
        ResBundle.clearPseudoLocales();
    });

    test("ResBundlePseudoIsPseudo", () => {
        expect.assertions(2);
        var loc = new Locale("de-DE");
        ResBundle.clearPseudoLocales();
        expect(!ResBundle.isPseudoLocale(loc)).toBeTruthy();
        ResBundle.addPseudoLocale("de-DE");
        expect(ResBundle.isPseudoLocale(loc)).toBeTruthy();
        ResBundle.clearPseudoLocales();
    });

    test("ResBundlePseudo_EMPTY", () => {
        expect.assertions(1);
        ResBundle.clearPseudoLocales();
        ResBundle.addPseudoLocale("");
        var rb = new ResBundle({
            locale:""
        });
        expect(rb.getStringJS("This is pseudo string test")).toBe("This is pseudo string test");
        ResBundle.clearPseudoLocales();
    });

    test("ResBundlePseudoEmptyNothingAdded", () => {
        expect.assertions(2);
        ResBundle.clearPseudoLocales();
        expect(!ResBundle.isPseudoLocale("")).toBeTruthy();
        ResBundle.addPseudoLocale("");
        expect(!ResBundle.isPseudoLocale("")).toBeTruthy();
        ResBundle.clearPseudoLocales();
    });

    test("ResBundlePseudoUndefinedNothingAdded", () => {
        expect.assertions(2);
        ResBundle.clearPseudoLocales();
        expect(!ResBundle.isPseudoLocale()).toBeTruthy();
        ResBundle.addPseudoLocale();
        expect(!ResBundle.isPseudoLocale()).toBeTruthy();
        ResBundle.clearPseudoLocales();
    });

    test("ClearPseudoLocalesOldOnesGone", () => {
        expect.assertions(2);
        var loc = new Locale("de-DE");
        ResBundle.addPseudoLocale("de-DE");
        expect(ResBundle.isPseudoLocale(loc)).toBeTruthy();

        ResBundle.clearPseudoLocales();

        expect(!ResBundle.isPseudoLocale(loc)).toBeTruthy();
    });

    test("ClearResetToDefaults", () => {
        expect.assertions(4);
        ResBundle.clearPseudoLocales();

        var loc = new Locale("zxx-XX");
        expect(ResBundle.isPseudoLocale(loc)).toBeTruthy();

        loc = new Locale("zxx-Hans-XX");
        expect(ResBundle.isPseudoLocale(loc)).toBeTruthy();
        loc = new Locale("zxx-Cyrl-XX");
        expect(ResBundle.isPseudoLocale(loc)).toBeTruthy();
        loc = new Locale("zxx-Hebr-XX");
        expect(ResBundle.isPseudoLocale(loc)).toBeTruthy();
    });

    test("ResBundleWithDefaultLocaleBeingPseudo", () => {
        expect.assertions(1);
        ResBundle.clearPseudoLocales();
        var tmp = getLocale();

        setLocale("zxx-XX"); // pseudo-locale

        // this used to throw an exception:
        var rb = new ResBundle();

        expect(rb.getStringJS("translation")).toBe("ţŕàñšľàţíõñ");
        setLocale(tmp);
    });

    test("ResBundleLocalizeArray", () => {
        expect.assertions(3);
        var rb = new ResBundle({locale: "de-DE"});

        arrayEqual( rb.getStringJS([
            "first string",
            "second string",
            "third string"
        ]), [
            "erste String",
            "zweite String",
            "dritte String"
        ]);

    });

    test("ResBundleLocalizeArrayUntranslatedElements", () => {
        expect.assertions(4);
        var rb = new ResBundle({locale: "de-DE"});

        arrayEqual( rb.getStringJS([
            "first string",
            "second string",
            "third string",
            "fourth string"
        ]), [
            "erste String",
            "zweite String",
            "dritte String",
            "fourth string"
        ]);

    });

    test("ResBundleLocalizeArrayUndefinedElements", () => {
        expect.assertions(3);
        var rb = new ResBundle({locale: "de-DE"});

        arrayEqual( rb.getStringJS([
            "first string",
            undefined,
            "third string"
        ]), [
            "erste String",
            undefined,
            "dritte String"
        ]);

    });

    test("ResBundleLocalizeArrayEmptyString", () => {
        expect.assertions(3);
        var rb = new ResBundle({locale: "de-DE"});

        arrayEqual( rb.getStringJS([
            "first string",
            "",
            "third string"
        ]), [
            "erste String",
            "",
            "dritte String"
        ]);

    });

    test("ResBundleLocalizeArraySkipNonStrings", () => {
        expect.assertions(7);
        var rb = new ResBundle({locale: "de-DE"});

        arrayEqual( rb.getStringJS([
            "first string",
            2,
            "second string",
            { "asdf": "an object element"},
            [ "this", "is", "an", "array", "element"],
            true,
            "third string"
        ]), [
            "erste String",
            2,
            "zweite String",
            { "asdf": "an object element"},
            [ "this", "is", "an", "array", "element"],
            true,
            "dritte String"
        ]);

    });

    test("ResBundleLocalizeArrayWithFormat", () => {
        expect.assertions(3);
        var rb = new ResBundle({locale: "de-DE"});

        arrayEqual( rb.getString([
            "first string {n}",
            "second string {n}",
            "third string {n}"
        ]).map(function(str) {
            return str.format({n: 2})
        }), [
            "erste String 2",
            "zweite String 2",
            "dritte String 2"
        ]);

    });
});
