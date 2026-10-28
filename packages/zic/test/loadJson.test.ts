/*
 * loadJson.test.ts - unit tests for loadJsonFile
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

import * as fs from "fs";
import * as os from "os";
import * as path from "path";

import { loadJsonFile } from "../src/loadJson";

describe("loadJsonFile", () => {
    let root: string;

    beforeEach(() => {
        root = fs.mkdtempSync(path.join(os.tmpdir(), "ilib-zic-json-"));
    });

    afterEach(() => {
        fs.rmSync(root, { recursive: true, force: true });
    });

    test("reads and parses a JSON file", () => {
        expect.assertions(1);
        const filePath = path.join(root, "sample.json");
        fs.writeFileSync(filePath, '{\n    "timezone": "Etc/UTC"\n}', "utf-8");
        expect(loadJsonFile<{ timezone: string }>(filePath)).toEqual({
            timezone: "Etc/UTC",
        });
    });

    test("throws a clear error when the file is missing", () => {
        expect.assertions(2);
        const filePath = path.join(root, "missing.json");
        expect(() => loadJsonFile(filePath)).toThrow(/Failed to read JSON file/);
        expect(() => loadJsonFile(filePath)).toThrow(
            new RegExp(filePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        );
    });

    test("throws a clear error when the file is not valid JSON", () => {
        expect.assertions(2);
        const filePath = path.join(root, "bad.json");
        fs.writeFileSync(filePath, "{ not json", "utf-8");
        expect(() => loadJsonFile(filePath)).toThrow(/Invalid JSON in file/);
        expect(() => loadJsonFile(filePath)).toThrow(
            new RegExp(filePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        );
    });
});
