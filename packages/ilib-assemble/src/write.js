/*
 * writeFiles.js - write merged JSON files for ilib
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

/**
 * Write merged locale data into per-locale JSON files.
 *
 * @param {Record<string, object>} allData Locale-keyed merged data map.
 * @param {string} outDir Output directory path.
 * @param {boolean} isCompressed When true, write minified JSON.
 * @returns {void}
 */
function writeFiles(allData, outDir, isCompressed) {
    if (!allData || typeof allData !== "object") return;

    fs.mkdirSync(outDir, { recursive: true });

    Object.entries(allData).forEach(([loc, data]) => {
        const resultFilePath = path.join(outDir, loc + ".json");
        const contents = isCompressed
            ? JSON.stringify(data)
            : JSON.stringify(data, null, 4);

        console.log("writing " + resultFilePath + " file.");
        fs.writeFileSync(resultFilePath, contents, "utf-8");
    });
}

export default writeFiles;