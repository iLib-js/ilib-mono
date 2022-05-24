/*
 * walk.js - function to walk a directory recursively and return
 * the relative paths to all javascript files
 *
 * Copyright © 2022 JEDLSoft
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

import path from 'path';
import { statSync, readdirSync, existsSync } from 'node:fs';

const extensionsToScan = {
    ".js": true,
    ".mjs": true,
    ".cjs": true
};

/**
 * Walk a directory tree and return an array of the relative paths to
 * all javascript files found in that tree.
 *
 * @param {string} dir top level of the tree to start searching
 * @returns {Array<string>} an array of relative paths to all the
 * javascript files
 */ 
function walk(dir) {
    console.log("Searching " + dir);

    let results = [];
    let pathName, included, stat, extension;

    stat = statSync(dir);
    if (stat && !stat.isDirectory()) {
        if (extensionsToScan[extension]) {
            results.push(dir);
        }
    } else {
        const list = readdirSync(dir);
        if (list && list.length !== 0) {
            list.sort().forEach((file) => {
                extension = path.extname(file);
                pathName = path.join(dir, file);
    
                if (existsSync(pathName)) {
                    stat = statSync(pathName);
                    if (stat && stat.isDirectory()) {
                        results = results.concat(walk(pathName));
                    } else if (extensionsToScan[extension]) {
                        results.push(pathName);
                    }
                } else {
                    console.log(`File ${pathName} does not exist or is inaccessible.`);
                }
            });
        }
    }

    return results;
}

export default walk;