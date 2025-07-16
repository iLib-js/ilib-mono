/*
 * assemble.mjs - Assemble locale data for ilib-assemble
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

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { JSUtils, Utils } from 'ilib-common';
import JSON5 from 'json5';

let cache = {};

function assemble(options) {
    let localeData = {};

    if (!options || !options.locales) return undefined;

    const here = join(dirname(import.meta.url.replace(/file:\/\//, "")), "locale");

    options.locales.forEach(locale => {
        const locales = Utils.getSublocales(locale);
        const locFiles = Utils.getLocFiles(locale, "name.json").map(file => {
            return join(here, file);
        });
        let locData = {};
        locFiles.forEach((file, i) => {
            const loc = locales[i];
            if (!locData[loc]) {
                locData[loc] = {};
            }
            if (cache[file]) {
                locData[loc].name = cache[file];
            } else if (existsSync(file)) {
                const data = readFileSync(file, "utf-8");
                const json = JSON5.parse(data);
                locData[loc].name = json;
                cache[file] = json;
            }
        });
        localeData[locale] = locData;
    });

    return Promise.resolve(localeData);
}

export default assemble;