/*
 * expectFile.ts - E2E test file assertion utilities
 *
 * Copyright © 2025, Box, Inc.
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

import fs from "fs";

/**
 * Asserts that a file exists
 * @param path - The path to the file
 */
export const expectFile = (path: string) => {
    expect(fs.existsSync(path)).toBe(true);
};

/**
 * Asserts that a file matches a snapshot
 *
 * It will also throw if the file does not exist.
 *
 * @param path - The path to the file
 */
export const expectFileToMatchSnapshot = (path: string) => {
    expect(fs.readFileSync(path, "utf8")).toMatchSnapshot();
};
