/*
 * readFile.js - read text files for ilib assemble tools
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


import { pathToFileURL } from 'node:url';
import path from 'node:path';
import scan from './scan.js';
import writeFiles from './write.js';

/**
 * Scans ilib include files to collect required modules, assembles locale
 * JSON data via assembleJson.mjs, and writes the merged output files.
 *
 * @async
 * @param {object} options - ilib-assemble options object
 * @param {string[]} options.args - Positional arguments; args[0] is the output directory
 * @param {object} options.opt - CLI/config options
 * @param {string} [options.opt.ilibincPath] - Path to the ilib include file (default: "./ilib-all-inc.js")
 * @param {boolean} [options.opt.compressed] - Write minified JSON when true (default: false)
 * @param {string[]} [options.opt.locales] - Target locale list (BCP-47)
 * @param {string} [options.opt.customLocalePath] - Custom locale data directory path
 * @returns {Promise<void>}
 */
function mergeJson(options) {
    const incPath = options.opt.ilibincPath || "./ilib-all-inc.js";
    const outDir = options.args[0];
    const isCompressed = options.opt.compressed || false;

    const ilibModules = new Set();
    scan(incPath, ilibModules, true);

    const assemblePath = path.join(process.cwd(), "js/assembleData", "assembleJson.mjs");
    return import(pathToFileURL(assemblePath).href).then(({ assemble }) => {
        const result_data = assemble([...ilibModules], options);
        writeFiles(result_data, outDir, isCompressed);
    });
}

export default mergeJson;
