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

const extensionsToScan = [
    ".js",
    ".mjs",
    ".cjs"
];

const javaScriptFiles = new Set();
extensionsToScan.forEach((ext) => {
    javaScriptFiles.add(ext);
});

/**
 * Walk a directory tree and return an array of the relative paths to
 * all javascript files found in that tree.
 *
 * Options can contain any of the following properties:
 * <ul>
 * <li>quiet (boolean) - if true, do not emit any output. Just report results.
 * <li>extensions (Set) - a set of extensions to scan for. If not specified,
 * this function will search for all Javascript files.
 * </ul>
 *
 * @param {string} dirOrFile top level of the tree to start searching or
 * a file to consider
 * @param {Object} options options to control the operation of this function
 * @returns {Array<string>} an array of relative paths to all the
 * javascript files
 */
function walk(dirOrFile, options) {
    let results = [];
    let pathName, included, stat, extension;
    const extensions = (options && options.extensions) || javaScriptFiles;

    try {
        stat = statSync(dirOrFile);
        if (stat && !stat.isDirectory()) {
            extension = path.extname(dirOrFile);
            if (extensions.has(extension)) {
                results.push(dirOrFile);
            }
        } else {
            if (options && !options.quiet) console.log(`    Searching ${dirOrFile}`);
            const list = readdirSync(dirOrFile);
            if (list && list.length !== 0) {
                list.sort().forEach((file) => {
                    pathName = path.join(dirOrFile, file);
                    results = results.concat(walk(pathName, options));
                });
            }
        }
    } catch (e) {
        // ignore
        if (options && !options.quiet) console.log(`    Could not access path ${dirOrFile}`);
    }

    return results;
}

export default walk;