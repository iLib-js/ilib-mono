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

async function mergeJson(options) {
    console.log("Merging JSON files...");
    const incPath = options.opt.ilibincPath || "./ilib-all-inc.js";
    const outDir = options.args[0];
    const isCompressed = options.opt.compressed || false;

    const ilibModules = new Set();
    scan(incPath, ilibModules, true);

    const assemblePath = path.join(process.cwd(), "js/assemblefiles", "assembleJson.mjs");
    const { assemble } = await import(pathToFileURL(assemblePath).href);

    const result_data = assemble([...ilibModules], options);
    writeFiles(result_data, outDir, isCompressed);
}

export default mergeJson;
