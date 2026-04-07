/*
 * write.test.js - test the writeFiles utility
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

import fs from 'node:fs';
import path from 'node:path';

import writeFiles from '../src/write.js';

const OUTPUT_DIR = "test/testfiles/output/write";

afterEach(() => {
    if (fs.existsSync(OUTPUT_DIR)) {
        fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
    }
});

describe("testWriteFiles", () => {
    test("WriteFilesNull", () => {
        expect.assertions(1);
        writeFiles(null, OUTPUT_DIR, false);
        expect(fs.existsSync(OUTPUT_DIR)).toBeFalsy();
    });

    test("WriteFilesUndefined", () => {
        expect.assertions(1);
        writeFiles(undefined, OUTPUT_DIR, false);
        expect(fs.existsSync(OUTPUT_DIR)).toBeFalsy();
    });

    test("WriteFilesNonObject", () => {
        expect.assertions(1);
        writeFiles("not an object", OUTPUT_DIR, false);
        expect(fs.existsSync(OUTPUT_DIR)).toBeFalsy();
    });

    test("WriteFilesEmptyObject", () => {
        expect.assertions(2);
        writeFiles({}, OUTPUT_DIR, false);
        expect(fs.existsSync(OUTPUT_DIR)).toBeTruthy();
        expect(fs.readdirSync(OUTPUT_DIR)).toHaveLength(0);
    });

    test("WriteFilesSingleLocale", () => {
        expect.assertions(1);
        const data = { "en": { "key": "value" } };
        writeFiles(data, OUTPUT_DIR, false);
        expect(fs.existsSync(path.join(OUTPUT_DIR, "en.json"))).toBeTruthy();
    });

    test("WriteFilesMultipleLocales", () => {
        expect.assertions(4);
        const data = {
            "en": { "key": "value" },
            "de": { "key": "Wert" },
            "fr": { "key": "valeur" }
        };
        writeFiles(data, OUTPUT_DIR, false);
        expect(fs.existsSync(path.join(OUTPUT_DIR, "en.json"))).toBeTruthy();
        expect(fs.existsSync(path.join(OUTPUT_DIR, "de.json"))).toBeTruthy();
        expect(fs.existsSync(path.join(OUTPUT_DIR, "fr.json"))).toBeTruthy();
        expect(fs.readdirSync(OUTPUT_DIR)).toHaveLength(3);
    });

    test("WriteFilesContentsAreValidJson", () => {
        expect.assertions(1);
        const data = { "en": { "key": "value", "num": 42 } };
        writeFiles(data, OUTPUT_DIR, false);
        const content = fs.readFileSync(path.join(OUTPUT_DIR, "en.json"), "utf-8");
        expect(() => JSON.parse(content)).not.toThrow();
    });

    test("WriteFilesContentMatchesInput", () => {
        expect.assertions(1);
        const localeData = { "key": "value", "nested": { "a": 1 } };
        writeFiles({ "en": localeData }, OUTPUT_DIR, false);
        const content = fs.readFileSync(path.join(OUTPUT_DIR, "en.json"), "utf-8");
        expect(JSON.parse(content)).toStrictEqual(localeData);
    });

    test("WriteFilesNotCompressed", () => {
        expect.assertions(1);
        const data = { "en": { "key": "value" } };
        writeFiles(data, OUTPUT_DIR, false);
        const content = fs.readFileSync(path.join(OUTPUT_DIR, "en.json"), "utf-8");
        expect(content).toContain("\n");
    });

    test("WriteFilesCompressed", () => {
        expect.assertions(1);
        const data = { "en": { "key": "value" } };
        writeFiles(data, OUTPUT_DIR, true);
        const content = fs.readFileSync(path.join(OUTPUT_DIR, "en.json"), "utf-8");
        expect(content).not.toContain("\n");
    });

    test("WriteFilesCompressedContentMatchesInput", () => {
        expect.assertions(1);
        const localeData = { "key": "value", "nested": { "a": 1 } };
        writeFiles({ "en": localeData }, OUTPUT_DIR, true);
        const content = fs.readFileSync(path.join(OUTPUT_DIR, "en.json"), "utf-8");
        expect(JSON.parse(content)).toStrictEqual(localeData);
    });

    test("WriteFilesCreatesOutputDirectory", () => {
        expect.assertions(1);
        const data = { "en": { "key": "value" } };
        writeFiles(data, OUTPUT_DIR, false);
        expect(fs.existsSync(OUTPUT_DIR)).toBeTruthy();
    });

    test("WriteFilesCreatesNestedDirectory", () => {
        expect.assertions(1);
        const nestedDir = path.join(OUTPUT_DIR, "nested", "subdir");
        const data = { "en": { "key": "value" } };
        writeFiles(data, nestedDir, false);
        expect(fs.existsSync(path.join(nestedDir, "en.json"))).toBeTruthy();
    });

    test("WriteFilesLocaleNameInFilename", () => {
        expect.assertions(3);
        const data = {
            "en-US": { "key": "value" },
            "zh-Hans-CN": { "key": "值" }
        };
        writeFiles(data, OUTPUT_DIR, false);
        expect(fs.existsSync(path.join(OUTPUT_DIR, "en-US.json"))).toBeTruthy();
        expect(fs.existsSync(path.join(OUTPUT_DIR, "zh-Hans-CN.json"))).toBeTruthy();
        expect(fs.readdirSync(OUTPUT_DIR)).toHaveLength(2);
    });
});
