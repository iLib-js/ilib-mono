/*
 * write.test.js - test the write utility
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
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import fs from 'fs';
import path from 'path';

import write from '../src/write.js';

const OUTPUT_DIR = "test/testfiles/output/write";

describe("testWrite", () => {
    afterEach(() => {
        if (fs.existsSync(OUTPUT_DIR)) {
            fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
        }
    });

    test("WriteNull", () => {
        expect.assertions(1);
        write(null, OUTPUT_DIR, false);
        expect(fs.existsSync(OUTPUT_DIR)).toBeFalsy();
    });

    test("WriteUndefined", () => {
        expect.assertions(1);
        write(undefined, OUTPUT_DIR, false);
        expect(fs.existsSync(OUTPUT_DIR)).toBeFalsy();
    });

    test("WriteNonObject", () => {
        expect.assertions(1);
        write("not an object", OUTPUT_DIR, false);
        expect(fs.existsSync(OUTPUT_DIR)).toBeFalsy();
    });

    test("WriteEmptyObject", () => {
        expect.assertions(2);
        write({}, OUTPUT_DIR, false);
        expect(fs.existsSync(OUTPUT_DIR)).toBeTruthy();
        expect(fs.readdirSync(OUTPUT_DIR)).toHaveLength(0);
    });

    test("WriteSingleLocale", () => {
        expect.assertions(1);
        const data = { "en": { "key": "value" } };
        write(data, OUTPUT_DIR, false);
        expect(fs.existsSync(path.join(OUTPUT_DIR, "en.json"))).toBeTruthy();
    });

    test("WriteMultipleLocales", () => {
        expect.assertions(4);
        const data = {
            "en": { "key": "value" },
            "de": { "key": "Wert" },
            "fr": { "key": "valeur" }
        };
        write(data, OUTPUT_DIR, false);
        expect(fs.existsSync(path.join(OUTPUT_DIR, "en.json"))).toBeTruthy();
        expect(fs.existsSync(path.join(OUTPUT_DIR, "de.json"))).toBeTruthy();
        expect(fs.existsSync(path.join(OUTPUT_DIR, "fr.json"))).toBeTruthy();
        expect(fs.readdirSync(OUTPUT_DIR)).toHaveLength(3);
    });

    test("WriteContentsAreValidJson", () => {
        expect.assertions(1);
        const data = { "en": { "key": "value", "num": 42 } };
        write(data, OUTPUT_DIR, false);
        const content = fs.readFileSync(path.join(OUTPUT_DIR, "en.json"), "utf-8");
        expect(() => JSON.parse(content)).not.toThrow();
    });

    test("WriteContentMatchesInput", () => {
        expect.assertions(1);
        const localeData = { "key": "value", "nested": { "a": 1 } };
        write({ "en": localeData }, OUTPUT_DIR, false);
        const content = fs.readFileSync(path.join(OUTPUT_DIR, "en.json"), "utf-8");
        expect(JSON.parse(content)).toStrictEqual(localeData);
    });

    test("WriteNotCompressed", () => {
        expect.assertions(1);
        const data = { "en": { "key": "value" } };
        write(data, OUTPUT_DIR, false);
        const content = fs.readFileSync(path.join(OUTPUT_DIR, "en.json"), "utf-8");
        expect(content).toContain("\n");
    });

    test("WriteCompressed", () => {
        expect.assertions(1);
        const data = { "en": { "key": "value" } };
        write(data, OUTPUT_DIR, true);
        const content = fs.readFileSync(path.join(OUTPUT_DIR, "en.json"), "utf-8");
        expect(content).not.toContain("\n");
    });

    test("WriteCompressedContentMatchesInput", () => {
        expect.assertions(1);
        const localeData = { "key": "value", "nested": { "a": 1 } };
        write({ "en": localeData }, OUTPUT_DIR, true);
        const content = fs.readFileSync(path.join(OUTPUT_DIR, "en.json"), "utf-8");
        expect(JSON.parse(content)).toStrictEqual(localeData);
    });

    test("WriteCreatesOutputDirectory", () => {
        expect.assertions(1);
        const data = { "en": { "key": "value" } };
        write(data, OUTPUT_DIR, false);
        expect(fs.existsSync(OUTPUT_DIR)).toBeTruthy();
    });

    test("WriteCreatesNestedDirectory", () => {
        expect.assertions(1);
        const nestedDir = path.join(OUTPUT_DIR, "nested", "subdir");
        const data = { "en": { "key": "value" } };
        write(data, nestedDir, false);
        expect(fs.existsSync(path.join(nestedDir, "en.json"))).toBeTruthy();
    });

    test("WriteLocaleNameInFilename", () => {
        expect.assertions(3);
        const data = {
            "en-US": { "key": "value" },
            "zh-Hans-CN": { "key": "值" }
        };
        write(data, OUTPUT_DIR, false);
        expect(fs.existsSync(path.join(OUTPUT_DIR, "en-US.json"))).toBeTruthy();
        expect(fs.existsSync(path.join(OUTPUT_DIR, "zh-Hans-CN.json"))).toBeTruthy();
        expect(fs.readdirSync(OUTPUT_DIR)).toHaveLength(2);
    });

    test("WriteSlashKeyProducesHyphenFilename", () => {
        expect.assertions(1);
        const data = { "en/US": { "key": "value" } };
        write(data, OUTPUT_DIR, false);
        expect(fs.existsSync(path.join(OUTPUT_DIR, "en-US.json"))).toBeTruthy();
    });

    test("WriteMultipleSlashesInKey", () => {
        expect.assertions(1);
        const data = { "zh/Hans/CN": { "key": "值" } };
        write(data, OUTPUT_DIR, false);
        expect(fs.existsSync(path.join(OUTPUT_DIR, "zh-Hans-CN.json"))).toBeTruthy();
    });

    test("WriteSlashKeyContentMatchesInput", () => {
        expect.assertions(1);
        const localeData = { "key": "value" };
        write({ "en/US": localeData }, OUTPUT_DIR, false);
        const content = fs.readFileSync(path.join(OUTPUT_DIR, "en-US.json"), "utf-8");
        expect(JSON.parse(content)).toStrictEqual(localeData);
    });

    test("WriteRootKeyWritesRootJson", () => {
        expect.assertions(1);
        const data = { "root": { "key": "base" } };
        write(data, OUTPUT_DIR, false);
        expect(fs.existsSync(path.join(OUTPUT_DIR, "root.json"))).toBeTruthy();
    });

    test("WriteSplitLocaleHierarchyAllFilesCreated", () => {
        expect.assertions(4);
        const data = {
            "root": { "key": "base" },
            "ko": { "key": "ko" },
            "und_KR": { "key": "und_KR" },
            "ko_KR": { "key": "ko_KR" }
        };
        write(data, OUTPUT_DIR, false);
        expect(fs.existsSync(path.join(OUTPUT_DIR, "root.json"))).toBeTruthy();
        expect(fs.existsSync(path.join(OUTPUT_DIR, "ko.json"))).toBeTruthy();
        expect(fs.existsSync(path.join(OUTPUT_DIR, "und_KR.json"))).toBeTruthy();
        expect(fs.existsSync(path.join(OUTPUT_DIR, "ko_KR.json"))).toBeTruthy();
    });

    test("WriteSplitLocaleHierarchyFileCount", () => {
        expect.assertions(1);
        const data = {
            "root": { "key": "base" },
            "ko": { "key": "ko" },
            "und_KR": { "key": "und_KR" },
            "ko_KR": { "key": "ko_KR" }
        };
        write(data, OUTPUT_DIR, false);
        expect(fs.readdirSync(OUTPUT_DIR)).toHaveLength(4);
    });

    test("WriteSplitLocaleHierarchyContentsMatchInput", () => {
        expect.assertions(4);
        const data = {
            "root": { "key": "base" },
            "ko": { "key": "ko" },
            "und_KR": { "key": "und_KR" },
            "ko_KR": { "key": "ko_KR" }
        };
        write(data, OUTPUT_DIR, false);
        for (const [key, expected] of Object.entries(data)) {
            const content = fs.readFileSync(path.join(OUTPUT_DIR, `${key}.json`), "utf-8");
            expect(JSON.parse(content)).toStrictEqual(expected);
        }
    });
});
