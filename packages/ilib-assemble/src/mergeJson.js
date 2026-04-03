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


import { spawnSync } from 'node:child_process';
import path from 'node:path';
import scan from './scan.js';

let outDir = ".";
let isCompressed;
let customPath;

function mergeJson(options) {
    console.log("Merging JSON files...");
    const incPath = options.opt.ilibincPath || "./ilib-all-inc.js";
    const locales = options.opt.locales;

    outDir = options.args[0];
    isCompressed = options.opt.compressed || false;
    customPath = options.opt.customLocalePath;

    const ilibModules = new Set();
    scan(incPath, ilibModules, true);

    const ilibPath = options.opt.ilibPath;
    let scriptPath = path.join(process.cwd(), "js/assemblefiles", "testNode.js");
    if (scriptPath) {
        //const result = spawnSync('node', [scriptPath, ...[...ilibModules]], { stdio: ['inherit', 'pipe', 'inherit'] });
        const result = spawnSync('node', ['--inspect-brk=9230', scriptPath, ...[...ilibModules]], { stdio: ['inherit', 'pipe', 'inherit'] });

        if (result.status !== 0) {
            console.error(`Script ${scriptPath} exited with status ${result.status}`);
        }
        const result_data = JSON.parse(result.stdout.toString());
        console.log("!!!!" + result_data);
    }
}

export default mergeJson;
