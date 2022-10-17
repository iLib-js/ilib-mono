/*
 * testresourcesasync.js - test the Resources object
 *
 * Copyright © 2018-2019, 2022 JEDLSoft
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

export const testResourcesAsync = {
    testResBundleAsyncConstructorEmpty: function(test) {
        test.expect(2);
        LocaleData.addGlobalRoot("test/resources");
        LocaleData.addGlobalRoot("test/resources2");
        LocaleData.addGlobalRoot("test/resources3");
        LocaleData.addGlobalRoot("test/resources4");
        ResBundle.clearPseudoLocales();
        LocaleData.clearCache();

        ResBundle.create({}).then((rb) => {
            test.ok(rb !== null);

            test.equal(rb.getName(), "strings");
            test.done();
        });
    },

    testResBundleAsyncConstructorOtherLocale: function(test) {
        test.expect(2);
        ResBundle.create({
            locale: "de-DE"
        }).then((rb) => {
            test.ok(rb !== null);

            var loc = rb.getLocale();

            test.equal(loc.toString(), "de-DE");
            test.done();
        });
    },

    testResBundleAsyncGetStringOtherBundlePsuedoRaw: function(test) {
        test.expect(4);
        ResBundle.create({
            name: "tester",
            locale: "zxx-XX",
            type: "raw"
        }).then((rb) => {
            test.ok(rb !== null);

            // should pseudo-ize the replacement parameter names in raw mode
            test.equal(rb.getString("Hello from {country}").toString(), "Ħëľľõ fŕõm {çõüñţŕÿ}");
            test.equal(rb.getString("Hello from {city}").toString(), "Ħëľľõ fŕõm {çíţÿ}");
            test.equal(rb.getString("Greetings from {city} in {country}").toString(), "Ĝŕëëţíñğš fŕõm {çíţÿ} íñ {çõüñţŕÿ}");
            test.done();
        });
    },

    testResBundleAsyncGetStringNonExistantTranslations: function(test) {
        test.expect(2);
        ResBundle.create({
            name: "tester",
            locale: "zh-CN"
        }).then((rb) => {
            test.ok(rb !== null);

            // should return source
            test.equal(rb.getString("foobar").toString(), "foobar");
            test.done();
        });
    },

    testResBundleAsyncGetStringNoResourcesReturnSource: function(test) {
        test.expect(2);
        ResBundle.create({
            name: "tester",
            locale: "zz-ZZ"
        }).then((rb) => {
            test.ok(rb !== null);

            test.equal(rb.getString("This is a test.").toString(), "This is a test.");
            test.done();
        });
    },

    testResBundleAsyncGetStringCyrlPsuedoRaw: function(test) {
        test.expect(4);
        ResBundle.create({
            name: "tester",
            locale: "zxx-Cyrl-XX",
            type: "raw"
        }).then((rb) => {
            test.ok(rb !== null);

            // should pseudo-ize the replacement parameter names in raw mode
            test.equal(rb.getString("Hello from {country}").toString(), "Хэлло фром {чоунтря}");
            test.equal(rb.getString("Hello from {city}").toString(), "Хэлло фром {читя}");
            test.equal(rb.getString("Greetings from {city} in {country}").toString(), "Грээтингс фром {читя} ин {чоунтря}");
            test.done();
        });
    },

    testResBundleAsyncGetStringHansPsuedoText: function(test) {
        test.expect(4);
        ResBundle.create({
            name: "tester",
            locale: "zxx-Hans-XX",
            type: "text"
        }).then((rb) => {
            test.ok(rb !== null);

            // should not pseudo-ize the replacement parameter names
            // for Chinese scripts, remove the spaces to the simulate Chinese writing style
            test.equal(rb.getString("Hello from {country}").toString(), "和俄了了夥凡熱夥们{country}");
            test.equal(rb.getString("Hello from {city}").toString(), "和俄了了夥凡熱夥们{city}");
            test.equal(rb.getString("Greetings from {city} in {country}").toString(), "个熱俄俄推意尼个思凡熱夥们{city}意尼{country}");
            test.done();
        });
    },

    testResBundleAsyncGetStringHebrPsuedoText: function(test) {
        test.expect(4);
        ResBundle.create({
            name: "tester",
            locale: "zxx-Hebr-XX",
            type: "text"
        }).then((rb) => {
            test.ok(rb !== null);

            // should not pseudo-ize the replacement parameter names
            test.equal(rb.getString("Hello from {country}").toString(), "הֶללֹ פרֹמ {country}");
            test.equal(rb.getString("Hello from {city}").toString(), "הֶללֹ פרֹמ {city}");
            test.equal(rb.getString("Greetings from {city} in {country}").toString(), "גרֶֶטִנגס פרֹמ {city} ִנ {country}");
            test.done();
        });
    },

    testResBundleAsyncPseudo_euES: function(test) {
        test.expect(1);
        ResBundle.clearPseudoLocales();
        ResBundle.addPseudoLocale("eu-ES");
        ResBundle.create({
            locale:'eu-ES'
        }).then((rb) => {
            test.equal(rb.getString("This is psuedo string test").toString(), "Ťĥíš íš þšüëðõ šţŕíñğ ţëšţ");
            test.done();
            ResBundle.clearPseudoLocales();
        });
    },

    testResBundleAsyncPseudo_psAF: function(test) {
        test.expect(1);
        ResBundle.clearPseudoLocales();
        ResBundle.addPseudoLocale("ps-AF");
        ResBundle.create({
            locale:'ps-AF'
        }).then((rb) => {
            test.equal(rb.getString("This is psuedo string test").toString(), "טהִס ִס פסֶֻדֹ סטרִנג טֶסט");
            test.done();
            ResBundle.clearPseudoLocales();
        });
    },

    testResBundleConstructAsynchDynamic: function(test) {
        ResBundle.create({
            locale: "de-DE-SAP",
            name: "foobar"
        }).then((rb) => {
            test.expect(4);
            test.ok(typeof(rb) !== "undefined");

            test.equal(rb.getString("first string").toString(), "erste String");
            test.equal(rb.getString("second string").toString(), "zweite String");
            test.equal(rb.getString("third string").toString(), "dritte String");

            test.done();
        });
    },

    testResBundleConstructAsynchDynamicDefaultName: function(test) {
        ResBundle.create({
            locale: "fr-CA-govt"
        }).then((rb) => {
            test.expect(4);
            test.ok(typeof(rb) !== "undefined");

            test.equal(rb.getString("first string").toString(), "première corde");
            test.equal(rb.getString("second string").toString(), "deuxième collier");
            test.equal(rb.getString("third string").toString(), "troisième corde");
            test.done();
        });
    },

    testResBundleConstructAsynchDynamicNoStrings: function(test) {
        ResBundle.create({
            locale: "de-DE-SAP",
            name: "asdf" // doesn't exist
        }).then((rb) => {
            test.expect(4);
            test.ok(typeof(rb) !== "undefined");

            test.equal(rb.getString("first string").toString(), "first string");
            test.equal(rb.getString("second string").toString(), "second string");
            test.equal(rb.getString("third string").toString(), "third string");
            test.done();
        });
    }
};
