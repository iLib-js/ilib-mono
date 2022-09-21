/*
 * testresources.js - test the Resources object
 *
 * Copyright © 2012-2015, 2017-2019, 2021-2022 JEDLSoft
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
import { Path } from "ilib-common";
import { getPlatform, setPlatform, getLocale, setLocale } from 'ilib-env';
import { LocaleData } from 'ilib-localedata';
import { registerLoader } from 'ilib-loader';

import ResBundle from "../src/index.js";

const __dirname = Path.dirname(Path.fileUriToPath(import.meta.url));

let setupCompleted = false;

export const testResourcesNode = {
    setUp: function(callback) {
        LocaleData.clearCache();
        if (!setupCompleted) {
            LocaleData.addGlobalRoot("test/resources4");
            ResBundle.clearPseudoLocales();
            setupCompleted = true;
        }
        callback();
    },

    testResBundleGetStringko_KR: function(test) {
        test.expect(2);
        // clear this to be sure it is actually loading something
        LocaleData.clearCache();

        const root = Path.join(__dirname, "./resources");
        LocaleData.addGlobalRoot(root);

        var rb = new ResBundle({
            locale: "ko-KR"
        });

        test.ok(rb !== null);

        test.equal(rb.getStringJS("Hello, {name}"), "{name}, 안녕하세요");

        LocaleData.removeGlobalRoot(root);
        test.done();
    },
    testResBundleGetStringVariant: function(test) {
        test.expect(2);

        // clear this to be sure it is actually loading something
        LocaleData.clearCache();

        const root = Path.join(__dirname, "./resources");
        LocaleData.addGlobalRoot(root);

        var rb = new ResBundle({
            locale: "ko-KR-flavor"
        });

        test.ok(rb !== null);

        test.equal(rb.getStringJS("Hello, {name}"), "안녕하세요")
        LocaleData.removeGlobalRoot(root);
        test.done();
    },
    testResBundleGetString_zh_Hans_CN: function(test) {

        test.expect(2);
        // clear this to be sure it is actually loading something
        LocaleData.clearCache();

        const root = Path.join(__dirname, "./resources");
        LocaleData.addGlobalRoot(root);

        var rb = new ResBundle({
            locale: "zh-Hans-CN"
        });

        test.ok(rb !== null);

        test.equal(rb.getStringJS("Hello, {name}"), "{name}, 你好");
        LocaleData.removeGlobalRoot(root);
        test.done();
    },
    testResBundleGetStringVariant2: function(test) {
        test.expect(2);
        // clear this to be sure it is actually loading something
        LocaleData.clearCache();

        const root = Path.join(__dirname, "./resources");
        LocaleData.addGlobalRoot(root);

        var rb = new ResBundle({
            locale: "zh-Hans-CN-flavor"
        });

        test.ok(rb !== null);

        test.equal(rb.getStringJS("Hello, {name}"), "你好")
        LocaleData.removeGlobalRoot(root);
        test.done();
    },

    testResBundleGetStringformatChoice_de_DE: function(test) {
        test.expect(3);

        // clear this to be sure it is actually loading something
        LocaleData.clearCache();
        const root = Path.join(__dirname, "./resources");
        LocaleData.addGlobalRoot(root);
        var str = new IString("one#({N}) file selected|#({N}) files selected");

        var rb = new ResBundle({
            locale: "de-DE"
        });
        test.ok(rb !== null);

        test.equal(rb.getString(str).formatChoice(1, {N:1}), "(1) Datei ausgewählt");
        test.equal(rb.getString(str).formatChoice(5, {N:5}), "(5) Dateien ausgewählt");
        LocaleData.removeGlobalRoot(root);
        test.done();
    },

    testResBundleGetStringWithBasePath: function(test) {

        test.expect(4);

        // clear this to be sure it is actually loading something
        LocaleData.clearCache();

        const root = Path.join(__dirname, "./resources");
        LocaleData.addGlobalRoot(root);

        var rb = new ResBundle({
            locale: "ja-JP",
            name: "basetest"
        });

        test.ok(rb !== null);

        test.equal(rb.getStringJS("Hello from {country}"), "{country}からこんにちは");
        test.equal(rb.getStringJS("Hello from {city}"), "{city}からこんにちは");
        test.equal(rb.getStringJS("Greetings from {city} in {country}"), "{city}と{country}からこんにちは");

        LocaleData.removeGlobalRoot(root);
        test.done();
    },

    testResBundleGetStringWithDifferentBasePath: function(test) {
        test.expect(4);

        // don't clear the cache
        const root = Path.join(__dirname, "./resources2");
        LocaleData.addGlobalRoot(root);

        var rb = new ResBundle({
            locale: "ja-JP",
            name: "basetest"
        });

        test.ok(rb !== null);

        test.equal(rb.getStringJS("Hello from {country}"), "{country}からこんにちは2");
        test.equal(rb.getStringJS("Hello from {city}"), "{city}からこんにちは2");
        test.equal(rb.getStringJS("Greetings from {city} in {country}"), "{city}と{country}からこんにちは2");
        LocaleData.removeGlobalRoot(root);
        test.done();
    },
    testResBundleMultiPaths_ko_KR: function(test) {
        test.expect(3);

        const root = Path.join(__dirname, "./resources");
        LocaleData.addGlobalRoot(root);

        var rb = new ResBundle({
            locale: "ko-KR"
        });
        test.ok(rb !== null);
        test.equal(rb.getStringJS("hello"), "안녕하세요!");
        test.equal(rb.getStringJS("Settings"), "설정");

        LocaleData.removeGlobalRoot(root);
        test.done();
    },
    testResBundleMultiPaths_ko_KR2: function(test) {
        test.expect(3);

        const root = Path.join(__dirname, "./resources");
        LocaleData.addGlobalRoot(root);
        const root2 = Path.join(__dirname, "./resources2");
        LocaleData.addGlobalRoot(root2);

        var rb = new ResBundle({
            locale: "ko-KR"
        });
        test.ok(rb !== null);
        test.equal(rb.getStringJS("hello"), "안녕2");
        test.equal(rb.getStringJS("Settings"), "설정");

        LocaleData.removeGlobalRoot(root);
        LocaleData.removeGlobalRoot(root2);
        test.done();
    },
    testResBundleMultiPathsArray_ko_KR3: function(test) {
        test.expect(3);

        const root = Path.join(__dirname, "./resources");
        LocaleData.addGlobalRoot(root);
        const root2 = Path.join(__dirname, "./resources2");
        LocaleData.addGlobalRoot(root2);

        var rb = new ResBundle({
            locale: "ko-KR"
        });
        test.ok(rb !== null);
        test.equal(rb.getStringJS("hello"), "안녕2");
        test.equal(rb.getStringJS("Settings"), "설정");

        LocaleData.removeGlobalRoot(root);
        LocaleData.removeGlobalRoot(root2);
        test.done();
    },
    testResBundleMultiPaths_ko_KR4: function(test) {
        test.expect(3);
        // clear this to be sure it is actually loading something
        LocaleData.clearCache();

        const root = Path.join(__dirname, "./resources");
        LocaleData.addGlobalRoot(root);
        const root2 = Path.join(__dirname, "./resources5"); // does not exist
        LocaleData.addGlobalRoot(root2);

        var rb = new ResBundle({
            locale: "ko-KR"
        });
        test.ok(rb !== null);
        test.equal(rb.getStringJS("hello"), "안녕하세요!");
        test.equal(rb.getStringJS("Settings"), "설정");

        LocaleData.removeGlobalRoot(root);
        LocaleData.removeGlobalRoot(root2);

        test.done();
    },
    testResBundleMultiPaths_ko_KR5: function(test) {
        test.expect(3);
        // clear this to be sure it is actually loading something
        LocaleData.clearCache();

        const root = Path.join(__dirname, "./resources");
        LocaleData.addGlobalRoot(root);
        const root2 = Path.join(__dirname, "./resources2");
        LocaleData.addGlobalRoot(root2);

        var rb = new ResBundle({
            locale: "ko-KR"
        });
        test.ok(rb !== null);
        test.equal(rb.getStringJS("hello"), "안녕2");
        test.equal(rb.getStringJS("Settings"), "설정");

        LocaleData.removeGlobalRoot(root);
        LocaleData.removeGlobalRoot(root2);

        test.done();
    },
    testResBundleMultiPaths_ko_KR6: function(test) {
        test.expect(3);
        // clear this to be sure it is actually loading something
        LocaleData.clearCache();

        const root = Path.join(__dirname, "./resources");
        LocaleData.addGlobalRoot(root);
        const root2 = Path.join(__dirname, "./resources2");
        LocaleData.addGlobalRoot(root2);
        const root3 = Path.join(__dirname, "./resources3");
        LocaleData.addGlobalRoot(root3);

        var rb = new ResBundle({
            locale: "ko-KR"
        });
        test.ok(rb !== null);
        test.equal(rb.getStringJS("hello"), "안녕3");
        test.equal(rb.getStringJS("Settings"), "설정");

        LocaleData.removeGlobalRoot(root);
        LocaleData.removeGlobalRoot(root2);
        LocaleData.removeGlobalRoot(root3);
        test.done();
    },
    testResBundleMultiPaths_ko_KR7: function(test) {

        test.expect(3);
        // clear this to be sure it is actually loading something
        LocaleData.clearCache();

        const root = Path.join(__dirname, "./resources");
        LocaleData.addGlobalRoot(root);

        var rb = new ResBundle({
            locale: "ko-KR"
        });
        test.ok(rb !== null);
        test.equal(rb.getStringJS("hello"), "안녕하세요!");
        test.equal(rb.getStringJS("thanks"), "감사합니다");

        LocaleData.removeGlobalRoot(root);
        test.done();
    },
    testResBundleMultiPaths_ko_KR8: function(test) {
        test.expect(4);
        // clear this to be sure it is actually loading something
        LocaleData.clearCache();

        const root = Path.join(__dirname, "./resources");
        LocaleData.addGlobalRoot(root);
        const root2 = Path.join(__dirname, "./resources2");
        LocaleData.addGlobalRoot(root2);

        var rb = new ResBundle({
            locale: "ko-KR"
        });
        test.ok(rb !== null);
        test.equal(rb.getStringJS("hello"), "안녕2");
        test.equal(rb.getStringJS("thanks"), "고마워2");
        test.equal(rb.getStringJS("Settings"), "설정");

        LocaleData.removeGlobalRoot(root);
        LocaleData.removeGlobalRoot(root2);

        test.done();
    },
    testResBundleMultiPaths_ko_KR9: function(test) {
        test.expect(3);
        // clear this to be sure it is actually loading something
        LocaleData.clearCache();

        const root = Path.join(__dirname, "./resources");
        LocaleData.addGlobalRoot(root);
        const root2 = Path.join(__dirname, "./resources2");
        LocaleData.addGlobalRoot(root2);

        var rb = new ResBundle({
            locale: "ko-KR"
        });
        test.ok(rb !== null);
        test.equal(rb.getStringJS("hello"), "안녕2");
        test.equal(rb.getStringJS("Settings"), "설정");

        LocaleData.removeGlobalRoot(root);
        LocaleData.removeGlobalRoot(root2);
        test.done();
    },

    testResBundleMultiPaths_ko_KR10: function(test) {
        test.expect(3);
        // clear this to be sure it is actually loading something
        LocaleData.clearCache();

        const root = Path.join(__dirname, "./resources");
        LocaleData.addGlobalRoot(root);
        const root2 = Path.join(__dirname, "./resources2");
        LocaleData.addGlobalRoot(root2);

        var rb = new ResBundle({
            locale: "ko-KR"
        });
        test.ok(rb !== null);
        test.equal(rb.getStringJS("hello"), "안녕2");
        test.equal(rb.getStringJS("Settings"), "설정");

        LocaleData.removeGlobalRoot(root);
        LocaleData.removeGlobalRoot(root2);

        test.done();
    }
};