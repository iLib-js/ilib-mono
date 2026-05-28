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

const OUTPUT_DIR = "test/testfiles/output/legacy";
const ILIB_PATH = "test/testfiles/legacy-ilib";
const INC_PATH = "test/testfiles/legacy-ilib-inc.js";
const CUSTOM_PATH = "test/testfiles/legacy-custom";

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

        const { default: assembleilib } = await import('../src/legacyilibassemble.js');
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
