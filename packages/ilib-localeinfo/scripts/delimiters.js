/*
 * delimiters.js - generate delimiters info from the CLDR data files
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

/*
 * This code is intended to be run under node.js
 */

import path from 'path';
import { availableLocales } from 'cldr-core/availableLocales.json';

import { getLocaleParts, setValue } from './common';

const localeDirs = availableLocales.full;

function getLocaleData(dirname) {
    var filename = path.join("cldr-misc-full/main", dirname, "delimiters.json");
    var data = require(filename);
    return data.main[dirname].delimiters;
};

export default function genDelimiters(root) {
    setValue(root, [], "delimiter", getLocaleData("en-001"));
    console.log(`Delimiter: root`);
    for (let dir of localeDirs) {
        const names = getLocaleParts(dir);
        setValue(root, names, "delimiter", getLocaleData(dir));
        console.log(`Delimiter: ${dir}`);
    }
};
