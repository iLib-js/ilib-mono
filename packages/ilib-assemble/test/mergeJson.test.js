/*
 * mergeJson.test.js - test the mergeJson utility
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

import mergeJson from '../src/mergeJson.js';

const OUTPUT_DIR = "test/testfiles/output/mergeJson";

describe("testMergeJson", () => {
    afterEach(() => {
        if (fs.existsSync(OUTPUT_DIR)) {
            fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
        }
    });

    test("MergeJsonReturns", async () => {
        expect.assertions(1);
        const options = {
            args: [OUTPUT_DIR],
            opt: {
                ilibincPath: "test/testfiles/ilib-all-inc.js",
                ilibPath: "test/",
                locales: ["en"]
            }
        };
        const result = await mergeJson(options);
        expect(result).toBeUndefined();
    });

    test("MergeJsonWritesOutputFiles", async () => {
        expect.assertions(2);
        const options = {
            args: [OUTPUT_DIR],
            opt: {
                ilibincPath: "test/testfiles/ilib-all-inc.js",
                ilibPath: "test/",
                locales: ["en", "de"]
            }
        };
        await mergeJson(options);
        expect(fs.existsSync(path.join(OUTPUT_DIR, "en.json"))).toBeTruthy();
        expect(fs.existsSync(path.join(OUTPUT_DIR, "de.json"))).toBeTruthy();
    });

    test("MergeJsonOutputContentIsValidJson", async () => {
        expect.assertions(2);
        const options = {
            args: [OUTPUT_DIR],
            opt: {
                ilibincPath: "test/testfiles/ilib-all-inc.js",
                ilibPath: "test/",
                locales: ["en"]
            }
        };
        await mergeJson(options);
        const content = fs.readFileSync(path.join(OUTPUT_DIR, "en.json"), "utf-8");
        const parsed = JSON.parse(content);
        expect(parsed.locale).toBe("en");
        expect(Array.isArray(parsed.modules)).toBeTruthy();
    });

    test("MergeJsonModulesPassedToAssemble", async () => {
        expect.assertions(2);
        const options = {
            args: [OUTPUT_DIR],
            opt: {
                ilibincPath: "test/testfiles/ilib-all-inc.js",
                ilibPath: "test/",
                locales: ["en"]
            }
        };
        await mergeJson(options);
        const content = fs.readFileSync(path.join(OUTPUT_DIR, "en.json"), "utf-8");
        const parsed = JSON.parse(content);
        expect(parsed.modules).toContain("ilib-mock.js");
        expect(parsed.modules).toContain("ilib-common.js");
    });

    test("MergeJsonNotCompressedByDefault", async () => {
        expect.assertions(1);
        const options = {
            args: [OUTPUT_DIR],
            opt: {
                ilibincPath: "test/testfiles/ilib-all-inc.js",
                ilibPath: "test/",
                locales: ["en"]
            }
        };
        await mergeJson(options);
        const content = fs.readFileSync(path.join(OUTPUT_DIR, "en.json"), "utf-8");
        // pretty-printed JSON contains newlines
        expect(content).toContain("\n");
    });

    test("MergeJsonCompressed", async () => {
        expect.assertions(1);
        const options = {
            args: [OUTPUT_DIR],
            opt: {
                ilibincPath: "test/testfiles/ilib-all-inc.js",
                ilibPath: "test/",
                locales: ["en"],
                compressed: true
            }
        };
        await mergeJson(options);
        const content = fs.readFileSync(path.join(OUTPUT_DIR, "en.json"), "utf-8");
        // minified JSON has no newlines
        expect(content).not.toContain("\n");
    });

    test("MergeJsonNotCompressedExplicit", async () => {
        expect.assertions(1);
        const options = {
            args: [OUTPUT_DIR],
            opt: {
                ilibincPath: "test/testfiles/ilib-all-inc.js",
                ilibPath: "test/",
                locales: ["en"],
                compressed: false
            }
        };
        await mergeJson(options);
        const content = fs.readFileSync(path.join(OUTPUT_DIR, "en.json"), "utf-8");
        expect(content).toContain("\n");
    });

    test("MergeJsonSingleLocale", async () => {
        expect.assertions(2);
        const options = {
            args: [OUTPUT_DIR],
            opt: {
                ilibincPath: "test/testfiles/ilib-all-inc.js",
                ilibPath: "test/",
                locales: ["fr"]
            }
        };
        await mergeJson(options);
        expect(fs.existsSync(path.join(OUTPUT_DIR, "fr.json"))).toBeTruthy();
        expect(fs.existsSync(path.join(OUTPUT_DIR, "en.json"))).toBeFalsy();
    });

    test("MergeJsonCreatesOutputDirectory", async () => {
        expect.assertions(1);
        const nestedOutDir = path.join(OUTPUT_DIR, "nested", "subdir");
        const options = {
            args: [nestedOutDir],
            opt: {
                ilibincPath: "test/testfiles/ilib-all-inc.js",
                ilibPath: "test/",
                locales: ["en"]
            }
        };
        await mergeJson(options);
        expect(fs.existsSync(path.join(nestedOutDir, "en.json"))).toBeTruthy();
    });

    test("MergeJsonMultipleLocales", async () => {
        expect.assertions(4);
        const options = {
            args: [OUTPUT_DIR],
            opt: {
                ilibincPath: "test/testfiles/ilib-all-inc.js",
                ilibPath: "test/",
                locales: ["en", "de", "fr", "ko"]
            }
        };
        await mergeJson(options);
        expect(fs.existsSync(path.join(OUTPUT_DIR, "en.json"))).toBeTruthy();
        expect(fs.existsSync(path.join(OUTPUT_DIR, "de.json"))).toBeTruthy();
        expect(fs.existsSync(path.join(OUTPUT_DIR, "fr.json"))).toBeTruthy();
        expect(fs.existsSync(path.join(OUTPUT_DIR, "ko.json"))).toBeTruthy();
    });

    test("MergeJsonExplicitIlibPath", async () => {
        expect.assertions(1);
        const options = {
            args: [OUTPUT_DIR],
            opt: {
                ilibincPath: "test/testfiles/ilib-all-inc.js",
                ilibPath: path.join(process.cwd(), "test"),
                locales: ["en"]
            }
        };
        await mergeJson(options);
        expect(fs.existsSync(path.join(OUTPUT_DIR, "en.json"))).toBeTruthy();
    });

    test("MergeJsonInvalidIlibPathRejects", async () => {
        expect.assertions(1);
        const options = {
            args: [OUTPUT_DIR],
            opt: {
                ilibincPath: "test/testfiles/ilib-all-inc.js",
                ilibPath: "/nonexistent/path",
                locales: ["en"]
            }
        };
        await expect(mergeJson(options)).rejects.toThrow("mergeJson failed:");
    });

    test("MergeJsonInvalidIncludePathRejects", async () => {
        expect.assertions(1);
        const options = {
            args: [OUTPUT_DIR],
            opt: {
                ilibincPath: "test/testfiles/nonexistent-inc.js",
                ilibPath: "test/",
                locales: ["en"]
            }
        };
        await expect(mergeJson(options)).rejects.toThrow(
            'Failed to read include file "test/testfiles/nonexistent-inc.js"'
        );
    });

    test("MergeJsonInvalidIncludePathNoOutputCreated", async () => {
        expect.assertions(1);
        const options = {
            args: [OUTPUT_DIR],
            opt: {
                ilibincPath: "test/testfiles/nonexistent-inc.js",
                ilibPath: "test/",
                locales: ["en"]
            }
        };
        await mergeJson(options).catch(() => {});
        expect(fs.existsSync(OUTPUT_DIR)).toBeFalsy();
    });
});
