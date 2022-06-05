/*
 * languages.js - generate the languages data
 *
 * Copyright © 2013-2018, 2020, 2022 JEDLSoft
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

import { getLocaleParts, setValue } from './common';

import { main } from 'cldr-localenames-full/main/en/languages.json';

const languagesData = main.en.localeDisplayNames.languages;

export default function genLanguages(root) {
    let names;

    for (var lang in languagesData) {
        if (lang.search(/[_-]/) === -1) {
            names = getLocaleParts(lang);
            setValue(root, names, "language.name", languagesData[lang]);
            console.log(`Language: ${lang}`);
        }
    }
};
