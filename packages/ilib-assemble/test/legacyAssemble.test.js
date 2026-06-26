/*
 * legacyAssemble.test.js - test the legacy ilib assembly with customLocalePath
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
import assembleilib from '../src/legacyilibassemble.js';

const OUTPUT_DIR = "test/testfiles/output/legacy";
const ILIB_PATH = "test/testfiles/legacy-ilib";
const INC_PATH = "test/testfiles/legacy-ilib-inc.js";
const CUSTOM_PATH = "test/testfiles/legacy-custom";

const FLAT_OUTPUT_DIR = "test/testfiles/output/legacy-flat";
const FLAT_ILIB_PATH = "test/testfiles/legacy-ilib-flat";

describe("legacyAssemble with customPath", () => {
    afterEach(() => {
        if (fs.existsSync(OUTPUT_DIR)) {
            fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
        }
    });

    test("with customPath, custom root data is merged into ilib root data", async () => {
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        }

        assembleilib({
            opt: {
                ilibPath: ILIB_PATH,
                ilibincPath: INC_PATH,
                locales: ["ko-KR"],
                customLocalePath: CUSTOM_PATH,
                outjsFileName: "ilib-all.js"
            },
            args: [OUTPUT_DIR]
        });

        const output = fs.readFileSync(path.join(OUTPUT_DIR, "ilib-all.js"), "utf-8");

        // root data should contain merged currency
        expect(output).toContain("ilib.data.currency");
        expect(output).toContain('"HKD"');
        expect(output).toContain('"TWD"');

        // extract currency JSON from output (multi-line pretty-printed)
        const match = output.match(/ilib\.data\.currency = ([\s\S]*?)\n\};/);
        expect(match).not.toBeNull();
        const currency = JSON.parse(match[1] + "\n}");

        // custom overrides HKD sign from "$" to "HK$"
        expect(currency.HKD.sign).toBe("HK$");
        // custom overrides TWD sign from "$" to "NT$"
        expect(currency.TWD.sign).toBe("NT$");
    });

});

describe("legacyAssemble with flat directory layout (lib/ and locale/)", () => {
    afterEach(() => {
        if (fs.existsSync(FLAT_OUTPUT_DIR)) {
            fs.rmSync(FLAT_OUTPUT_DIR, { recursive: true, force: true });
        }
    });

    test("resolves lib/ and locale/ when js/lib and js/data/locale do not exist", () => {
        if (!fs.existsSync(FLAT_OUTPUT_DIR)) {
            fs.mkdirSync(FLAT_OUTPUT_DIR, { recursive: true });
        }

        assembleilib({
            opt: {
                ilibPath: FLAT_ILIB_PATH,
                ilibincPath: INC_PATH,
                locales: ["ko-KR"],
                outjsFileName: "ilib-all.js"
            },
            args: [FLAT_OUTPUT_DIR]
        });

        const output = fs.readFileSync(path.join(FLAT_OUTPUT_DIR, "ilib-all.js"), "utf-8");

        // the JS file from lib/ should have been assembled in
        expect(output).toContain("var CurrencyInfo = function() {};");

        // root data read from locale/currency.json should be present
        expect(output).toContain("ilib.data.currency");
        expect(output).toContain('"HKD"');
        expect(output).toContain('"TWD"');
    });

    test("assembles locale specific data from the flat locale/ directory", () => {
        if (!fs.existsSync(FLAT_OUTPUT_DIR)) {
            fs.mkdirSync(FLAT_OUTPUT_DIR, { recursive: true });
        }

        assembleilib({
            opt: {
                ilibPath: FLAT_ILIB_PATH,
                ilibincPath: INC_PATH,
                locales: ["ko-KR"],
                outjsFileName: "ilib-all.js"
            },
            args: [FLAT_OUTPUT_DIR]
        });

        // locale specific data is written to <lang>.js by assembleLocale
        const koOutput = fs.readFileSync(path.join(FLAT_OUTPUT_DIR, "ko.js"), "utf-8");

        // data read from locale/ko/currency.json should be keyed by language
        expect(koOutput).toContain("ilib.data.currency_ko");
        expect(koOutput).toContain('"KRW"');
        expect(koOutput).toContain("South Korean Won");
    });
});
