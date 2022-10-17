/*
 * scanres.js - scan a resource dir for translated resource files
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

import { createRequire } from 'module';
import { readFileSync } from 'node:fs';
import path from 'path';

import Locale from 'ilib-locale';

const require = createRequire(import.meta.url);
import walk from './walk.js';

const extensions = new Set();
extensions.add(".json");
extensions.add(".jsn");

/**
 * Scan a resource dir for translated resource files.
 *
 * @param {string} dir the root directory to scan
 * @param {Object} options options from the command-line
 * @returns {Promise} a promise to scan and load all the resource
 * file data, and return it in the format documented above
 */
function scanResources(dir, options) {
    let files = walk(dir, { ...options, extensions });

    let promise = Promise.resolve(true);
    let translations = {};

    files.forEach((fileName) => {
        const subpath = fileName.substring(path.normalize(dir).length+1);
        const dirName = path.dirname(subpath);
        const base = path.basename(subpath, ".json");
        let locale;

        if (dirName === ".") {
            locale = "root";
        } else {
            const loc = new Locale(dirName.replace(/\//g, "-"));
            locale = loc.getSpec();
        }

        // console.log(`${fileName} locale ${locale}`);
        promise = promise.then(result => {
            const data = readFileSync(fileName, "utf-8");
            if (data) {
                if (!translations[locale]) {
                    translations[locale] = {};
                }
                translations[locale][base] = JSON.parse(data);
            }
            return true;
        }).catch(err => {
            console.log(err);
            return Promise.resolve(false);
        });
    });

    return promise.then(result => {
        // console.log(JSON.stringify(translations, undefined, 4));
        return translations;
    });
}

export default scanResources;
