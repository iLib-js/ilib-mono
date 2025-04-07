/*
 * genPluralCategories.js - generate the list of plural categories
 * per locale
 *
 * Copyright © 2021, 2025, JEDLSoft
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

console.log("Generating pluralCategories.json ...");

const pluralFileContents = fs.readFileSync("./node_modules/cldr-core/supplemental/plurals.json", "utf-8");
const pluralData = JSON.parse(pluralFileContents);
const plurals = pluralData.supplemental["plurals-type-cardinal"];

let categories = {};

const languages = Object.keys(plurals);
languages.sort();

const prefixLength = "pluralRule-count-".length;

for (let i = 0; i < languages.length; i++ ) {
    const language = languages[i];
    const rules = Object.keys(plurals[language]);
    if (rules.length === 2 && rules[0] === "pluralRule-count-one" && rules[1] === "pluralRule-count-other") {
        // this language is the default case, which is the same as English
        // so we can skip it
        continue;
    }
    categories[language] = rules.map(rule => {
        // cut off the prefix: pluralRule-count-X -> X
        return rule.substring(prefixLength);
    });
}

fs.mkdirSync("./locale", { recursive: true });
fs.writeFileSync("./locale/pluralCategories.json", JSON.stringify(categories, undefined, 4), "utf-8");

console.log("Done.");