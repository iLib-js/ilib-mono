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
import { Path } from "ilib-common";
import { getPlatform, setPlatform, getLocale, setLocale } from 'ilib-env';
import { LocaleData } from 'ilib-localedata';
import { registerLoader } from 'ilib-loader';

import ResBundle from "../src/index.js";

const __dirname = Path.dirname(Path.fileUriToPath(import.meta.url));

let setupCompleted = false;

describe("testResourcesNode", () => {
    beforeEach(() => {
        LocaleData.clearCache();
    });

    beforeAll(() => {
        if (!setupCompleted) {
            LocaleData.addGlobalRoot("test/resources4");
            ResBundle.clearPseudoLocales();
            setupCompleted = true;
        }
    });

    test("ResBundleGetStringko_KR", () => {
        expect.assertions(2);
        // clear this to be sure it is actually loading something
        LocaleData.clearCache();

        const root = Path.join(__dirname, "./resources");
        LocaleData.addGlobalRoot(root);

        var rb = new ResBundle({
            locale: "ko-KR"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getStringJS("Hello, {name}")).toBe("{name}, 안녕하세요");

        LocaleData.removeGlobalRoot(root);
    });

    test("ResBundleGetStringVariant", () => {
        expect.assertions(2);

        // clear this to be sure it is actually loading something
        LocaleData.clearCache();

        const root = Path.join(__dirname, "./resources");
        LocaleData.addGlobalRoot(root);

        var rb = new ResBundle({
            locale: "ko-KR-flavor"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getStringJS("Hello, {name}")).toBe("안녕하세요");
        LocaleData.removeGlobalRoot(root);
    });

    test("ResBundleGetString_zh_Hans_CN", () => {

        expect.assertions(2);
        // clear this to be sure it is actually loading something
        LocaleData.clearCache();

        const root = Path.join(__dirname, "./resources");
        LocaleData.addGlobalRoot(root);

        var rb = new ResBundle({
            locale: "zh-Hans-CN"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getStringJS("Hello, {name}")).toBe("{name}, 你好");
        LocaleData.removeGlobalRoot(root);
    });

    test("ResBundleGetStringVariant2", () => {
        expect.assertions(2);
        // clear this to be sure it is actually loading something
        LocaleData.clearCache();

        const root = Path.join(__dirname, "./resources");
        LocaleData.addGlobalRoot(root);

        var rb = new ResBundle({
            locale: "zh-Hans-CN-flavor"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getStringJS("Hello, {name}")).toBe("你好");
        LocaleData.removeGlobalRoot(root);
    });

    test("ResBundleGetStringformatChoice_de_DE", () => {
        expect.assertions(3);

        // clear this to be sure it is actually loading something
        LocaleData.clearCache();
        const root = Path.join(__dirname, "./resources");
        LocaleData.addGlobalRoot(root);
        var str = new IString("one#({N}) file selected|#({N}) files selected");

        var rb = new ResBundle({
            locale: "de-DE"
        });
        expect(rb !== null).toBeTruthy();

        expect(rb.getString(str).formatChoice(1, {N:1})).toBe("(1) Datei ausgewählt");
        expect(rb.getString(str).formatChoice(5, {N:5})).toBe("(5) Dateien ausgewählt");
        LocaleData.removeGlobalRoot(root);
    });

    test("ResBundleGetStringWithBasePath", () => {

        expect.assertions(4);

        // clear this to be sure it is actually loading something
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const root = Path.join(__dirname, "./resources");

        var rb = new ResBundle({
            basePath: root,
            locale: "ja-JP",
            name: "basetest"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getStringJS("Hello from {country}")).toBe("{country}からこんにちは");
        expect(rb.getStringJS("Hello from {city}")).toBe("{city}からこんにちは");
        expect(rb.getStringJS("Greetings from {city} in {country}")).toBe("{city}と{country}からこんにちは");

        // put it back again
        LocaleData.addGlobalRoot("test/resources4");
    });

    test("ResBundleGetStringWithDifferentBasePath", () => {
        expect.assertions(4);

        LocaleData.clearGlobalRoots();
        const root = Path.join(__dirname, "./resources2");

        var rb = new ResBundle({
            basePath: root,
            locale: "ja-JP",
            name: "basetest"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getStringJS("Hello from {country}")).toBe("{country}からこんにちは2");
        expect(rb.getStringJS("Hello from {city}")).toBe("{city}からこんにちは2");
        expect(rb.getStringJS("Greetings from {city} in {country}")).toBe("{city}と{country}からこんにちは2");

        // put it back again
        LocaleData.addGlobalRoot("test/resources4");
    });

    test("ResBundleGetStringFromOtherRootPath", () => {

        expect.assertions(4);

        // clear this to be sure it is actually loading something
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const root = Path.join(__dirname, "./resources");
        LocaleData.addGlobalRoot(root);

        var rb = new ResBundle({
            locale: "ja-JP",
            name: "basetest"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getStringJS("Hello from {country}")).toBe("{country}からこんにちは");
        expect(rb.getStringJS("Hello from {city}")).toBe("{city}からこんにちは");
        expect(rb.getStringJS("Greetings from {city} in {country}")).toBe("{city}と{country}からこんにちは");

        LocaleData.removeGlobalRoot(root);

        // put the old one back again
        LocaleData.addGlobalRoot("test/resources4");
    });

    test("ResBundleGetStringFromDifferentRootPath", () => {
        expect.assertions(4);

        // don't clear the cache
        const root = Path.join(__dirname, "./resources2");
        LocaleData.addGlobalRoot(root);

        var rb = new ResBundle({
            locale: "ja-JP",
            name: "basetest"
        });

        expect(rb !== null).toBeTruthy();

        expect(rb.getStringJS("Hello from {country}")).toBe("{country}からこんにちは2");
        expect(rb.getStringJS("Hello from {city}")).toBe("{city}からこんにちは2");
        expect(rb.getStringJS("Greetings from {city} in {country}")).toBe("{city}と{country}からこんにちは2");
        LocaleData.removeGlobalRoot(root);
    });

    test("ResBundleMultiPaths_ko_KR", () => {
        expect.assertions(3);

        const root = Path.join(__dirname, "./resources");
        LocaleData.addGlobalRoot(root);

        var rb = new ResBundle({
            locale: "ko-KR"
        });
        expect(rb !== null).toBeTruthy();
        expect(rb.getStringJS("hello")).toBe("안녕하세요!");
        expect(rb.getStringJS("Settings")).toBe("설정");

        LocaleData.removeGlobalRoot(root);
    });

    test("ResBundleMultiPaths_ko_KR2", () => {
        expect.assertions(3);

        const root = Path.join(__dirname, "./resources");
        LocaleData.addGlobalRoot(root);
        const root2 = Path.join(__dirname, "./resources2");
        LocaleData.addGlobalRoot(root2);

        var rb = new ResBundle({
            locale: "ko-KR"
        });
        expect(rb !== null).toBeTruthy();
        expect(rb.getStringJS("hello")).toBe("안녕2");
        expect(rb.getStringJS("Settings")).toBe("설정");

        LocaleData.removeGlobalRoot(root);
        LocaleData.removeGlobalRoot(root2);
    });

    test("ResBundleMultiPathsArray_ko_KR3", () => {
        expect.assertions(3);

        const root = Path.join(__dirname, "./resources");
        LocaleData.addGlobalRoot(root);
        const root2 = Path.join(__dirname, "./resources2");
        LocaleData.addGlobalRoot(root2);

        var rb = new ResBundle({
            locale: "ko-KR"
        });
        expect(rb !== null).toBeTruthy();
        expect(rb.getStringJS("hello")).toBe("안녕2");
        expect(rb.getStringJS("Settings")).toBe("설정");

        LocaleData.removeGlobalRoot(root);
        LocaleData.removeGlobalRoot(root2);
    });

    test("ResBundleMultiPaths_ko_KR4", () => {
        expect.assertions(3);
        // clear this to be sure it is actually loading something
        LocaleData.clearCache();

        const root = Path.join(__dirname, "./resources");
        LocaleData.addGlobalRoot(root);
        const root2 = Path.join(__dirname, "./resources5"); // does not exist
        LocaleData.addGlobalRoot(root2);

        var rb = new ResBundle({
            locale: "ko-KR"
        });
        expect(rb !== null).toBeTruthy();
        expect(rb.getStringJS("hello")).toBe("안녕하세요!");
        expect(rb.getStringJS("Settings")).toBe("설정");

        LocaleData.removeGlobalRoot(root);
        LocaleData.removeGlobalRoot(root2);

    });

    test("ResBundleMultiPaths_ko_KR5", () => {
        expect.assertions(3);
        // clear this to be sure it is actually loading something
        LocaleData.clearCache();

        const root = Path.join(__dirname, "./resources");
        LocaleData.addGlobalRoot(root);
        const root2 = Path.join(__dirname, "./resources2");
        LocaleData.addGlobalRoot(root2);

        var rb = new ResBundle({
            locale: "ko-KR"
        });
        expect(rb !== null).toBeTruthy();
        expect(rb.getStringJS("hello")).toBe("안녕2");
        expect(rb.getStringJS("Settings")).toBe("설정");

        LocaleData.removeGlobalRoot(root);
        LocaleData.removeGlobalRoot(root2);

    });

    test("ResBundleMultiPaths_ko_KR6", () => {
        expect.assertions(3);
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
        expect(rb !== null).toBeTruthy();
        expect(rb.getStringJS("hello")).toBe("안녕3");
        expect(rb.getStringJS("Settings")).toBe("설정");

        LocaleData.removeGlobalRoot(root);
        LocaleData.removeGlobalRoot(root2);
        LocaleData.removeGlobalRoot(root3);
    });

    test("ResBundleMultiPaths_ko_KR7", () => {

        expect.assertions(3);
        // clear this to be sure it is actually loading something
        LocaleData.clearCache();

        const root = Path.join(__dirname, "./resources");
        LocaleData.addGlobalRoot(root);

        var rb = new ResBundle({
            locale: "ko-KR"
        });
        expect(rb !== null).toBeTruthy();
        expect(rb.getStringJS("hello")).toBe("안녕하세요!");
        expect(rb.getStringJS("thanks")).toBe("감사합니다");

        LocaleData.removeGlobalRoot(root);
    });

    test("ResBundleMultiPaths_ko_KR8", () => {
        expect.assertions(4);
        // clear this to be sure it is actually loading something
        LocaleData.clearCache();

        const root = Path.join(__dirname, "./resources");
        LocaleData.addGlobalRoot(root);
        const root2 = Path.join(__dirname, "./resources2");
        LocaleData.addGlobalRoot(root2);

        var rb = new ResBundle({
            locale: "ko-KR"
        });
        expect(rb !== null).toBeTruthy();
        expect(rb.getStringJS("hello")).toBe("안녕2");
        expect(rb.getStringJS("thanks")).toBe("고마워2");
        expect(rb.getStringJS("Settings")).toBe("설정");

        LocaleData.removeGlobalRoot(root);
        LocaleData.removeGlobalRoot(root2);

    });

    test("ResBundleMultiPaths_ko_KR9", () => {
        expect.assertions(3);
        // clear this to be sure it is actually loading something
        LocaleData.clearCache();

        const root = Path.join(__dirname, "./resources");
        LocaleData.addGlobalRoot(root);
        const root2 = Path.join(__dirname, "./resources2");
        LocaleData.addGlobalRoot(root2);

        var rb = new ResBundle({
            locale: "ko-KR"
        });
        expect(rb !== null).toBeTruthy();
        expect(rb.getStringJS("hello")).toBe("안녕2");
        expect(rb.getStringJS("Settings")).toBe("설정");

        LocaleData.removeGlobalRoot(root);
        LocaleData.removeGlobalRoot(root2);
    });

    test("ResBundleMultiPaths_ko_KR10", () => {
        expect.assertions(3);
        // clear this to be sure it is actually loading something
        LocaleData.clearCache();

        const root = Path.join(__dirname, "./resources");
        LocaleData.addGlobalRoot(root);
        const root2 = Path.join(__dirname, "./resources2");
        LocaleData.addGlobalRoot(root2);

        var rb = new ResBundle({
            locale: "ko-KR"
        });
        expect(rb !== null).toBeTruthy();
        expect(rb.getStringJS("hello")).toBe("안녕2");
        expect(rb.getStringJS("Settings")).toBe("설정");

        LocaleData.removeGlobalRoot(root);
        LocaleData.removeGlobalRoot(root2);

    });
});
