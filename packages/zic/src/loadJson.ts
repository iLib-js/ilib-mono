/*
 * loadJson.ts - read and parse a JSON file from disk
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

/**
 * Read a UTF-8 JSON file from disk and parse it.
 *
 * @param filePath Absolute or relative path to a `.json` file
 * @returns Parsed JSON value
 * @throws Error when the file cannot be read or is not valid JSON
 *     (message includes `filePath` and the underlying cause)
 */
export function loadJsonFile<T = unknown>(filePath: string): T {
    let contents: string;
    try {
        contents = fs.readFileSync(filePath, "utf-8");
    } catch (e) {
        const detail = e instanceof Error ? e.message : String(e);
        throw new Error(
            "Failed to read JSON file " + filePath + ": " + detail
        );
    }

    try {
        return JSON.parse(contents) as T;
    } catch (e) {
        const detail = e instanceof Error ? e.message : String(e);
        throw new Error(
            "Invalid JSON in file " + filePath + ": " + detail
        );
    }
}
