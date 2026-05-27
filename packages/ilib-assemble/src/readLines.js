/*
 * readLines.js - read lines from an ilib include file and collect module names
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

import { readFileSync } from 'fs';

/**
 * Read a file and parse each non-empty line as a JS filename, adding it to
 * the given set. Lines that do not already end with ".js" have the suffix appended.
 *
 * @param {string} pathName - Path to the file to read
 * @param {Set<string>} set - Set to which each filename is added
 */
function readLines(pathName, set) {
    const data = readFileSync(pathName, "utf-8");
    data.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;
        set.add(trimmed.endsWith(".js") ? trimmed : trimmed + ".js");
    });
}

export default readLines;
