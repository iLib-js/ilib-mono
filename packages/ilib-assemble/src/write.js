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
 * Write locale data into per-locale JSON files.
 * Keys may be BCP-47 locale specs ("en-US") or sublocale path keys ("en/US");
 * slashes are normalized to hyphens so both produce the same flat filenames.
 *
 * @param {Record<string, object>} allData Locale-keyed data map.
 * @param {string} outDir Output directory path.
 * @param {boolean} isCompressed When true, write minified JSON.
 * @returns {void}
 */
function writeFiles(allData, outDir, isCompressed) {
    if (!allData || typeof allData !== "object") return;

    fs.mkdirSync(outDir, { recursive: true });

    Object.entries(allData).forEach(([key, data]) => {
        const filePath = path.join(outDir, key.replace(/\//g, "-") + ".json");
        const contents = isCompressed
            ? JSON.stringify(data)
            : JSON.stringify(data, null, 4);

        fs.writeFileSync(filePath, contents, "utf-8");
    });
}

export default writeFiles;
