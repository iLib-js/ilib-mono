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
import { LocaleData } from 'ilib-localedata';

export const testResourcesAsync = {
    testResBundleAsyncLocaleformatChoice_de_DE: function(test) {
        test.expect(2);
        // clear this to be sure it is actually loading something
        LocaleData.clearCache();

        var base = path.relative(process.cwd(), path.resolve(__dirname, "./resources"));
        ResBundle.create({
            locale: "de-DE",
            basePath: base
        }).then((rb) => {
            var loc = rb.getLocale();
            test.equal(loc.toString(), "de-DE");

            var str = new IString("one#({N}) file selected|#({N}) files selected");
            var temp = rb.getString(str);
            test.equal(temp.formatChoice(2, {N:2}), "(2) Dateien ausgewählt");

            test.done();
        });
    },

    testResBundleAsyncLocaleformatChoice_ko_KR: function(test) {
        test.expect(2);
        // clear this to be sure it is actually loading something
        LocaleData.clearCache();
        var base = path.relative(process.cwd(), path.resolve(__dirname, "./resources"));
        ResBundle.create({
            locale: "ko-KR",
            basePath: base
        }).then((rb) => {
            var loc = rb.getLocale();
            test.equal(loc.toString(), "ko-KR");

            var str = new IString("one#({N}) file selected|#({N}) files selected");
            var temp = rb.getString(str);
            test.equal(temp.formatChoice(1, {N:1}), "(1)개 파일 선택됨(other)");

            test.done();
        });
    },

    testResBundleAsyncGetStringOtherBundleesMX: function(test) {
        test.expect(4);

        // clear this to be sure it is actually loading something
        LocaleData.clearCache();

        var base = path.relative(process.cwd(), path.resolve(__dirname, "./resources"));

        ResBundle.create({
            locale: "es-MX",
            loadParams: {
                base: base
            }
        }).then((rb) => {
            test.ok(rb !== null);

            test.equal(rb.getString("Hello from {country}").toString(), "Que tal de {country}");
            test.equal(rb.getString("Hello from {city}").toString(), "Que tal de {city}");
            test.equal(rb.getString("Greetings from {city} in {country}").toString(), "Hola de {city} en {country}");
            test.done();
        });
    },

    testResBundleAsyncGetStringWithPathesMX: function(test) {
        test.expect(4);

        // clear this to be sure it is actually loading something
        LocaleData.clearCache();

        var base = path.relative(process.cwd(), path.resolve(__dirname, "./resources"));

        ResBundle.create({
            locale: "es-MX",
            basePath: base
        }).then((rb) => {
            test.ok(rb !== null);

            test.equal(rb.getString("Hello from {country}").toString(), "Que tal de {country}");
            test.equal(rb.getString("Hello from {city}").toString(), "Que tal de {city}");
            test.equal(rb.getString("Greetings from {city} in {country}").toString(), "Hola de {city} en {country}");
            test.done();
        });
    },
};
