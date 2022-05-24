/*
 * scan.js - scan a file for references to ilib modules
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

import { readFileSync } from 'node:fs';

const importTypes = [
    /\bimport\s*.*\sfrom\s*['"](ilib-[^'"]*)['"]\s*;/g,
    /\bimport\s*\(\s*['"](ilib-[^'"]*)['"]\s*\)/g,
    /\brequire\s*\(\s*['"](ilib-[^'"]*)['"]\s*\)/g
];

/**
 * Scan a string for references to ilib modules. The references are in
 * the form of ES6 import statements or older commonjs require calls:
 *
 * <ul>
 * <li>import something from 'ilib-something';
 * <li>import('ilib-module).then(do something with it)
 * <li>var something = require("ilib-something");
 * </ul>
 *
 * @param {string} pathName the path to the file to scan
 * @param {Set} set the set to which to add the name of each ilib module
 */
export function scanString(data, set) {
    importTypes.forEach((re) => {
        re.lastIndex = 0; // just to be safe
    
        let result = re.exec(data);
        while (result && result.length > 1 && result[1]) {
            set.add(result[1]);
            result = re.exec(data);
        }
    });
}

/**
 * Scan a file for references to ilib modules. The references are in
 * the form of ES6 import statements or older commonjs require calls:
 *
 * <ul>
 * <li>import something from 'ilib-something';
 * <li>import('ilib-module).then(do something with it)
 * <li>var something = require("ilib-something");
 * </ul>
 *
 * @param {string} pathName the path to the file to scan
 * @param {Set} set the set to which to add the name of each ilib module
 */
function scan(pathName, set) {
    const data = readFileSync(pathName, "utf-8");
    scanString(data, set);
}

export default scan;
