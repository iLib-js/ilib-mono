/*
 * scripts.js - generate script info
 *
 * Copyright © 2013-2018, 2020-2022 JEDLSoft
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

import { getLocaleParts, getValue, setValue } from './common';

import { supplemental } from 'cldr-core/supplemental/languageData.json';

const languagesData = supplemental.languageData;

export default function genScripts(root) {
    let names;

    for (let language in languagesData) {
        if (languagesData[language]._scripts) {
            names = language.split(/-/g);
            names = [ names[0] ];
            let scripts = getValue(root, names, "scripts");

            scripts = scripts ? scripts.concat(languagesData[language]._scripts) : languagesData[language]._scripts;

            setValue(root, names, "scripts", scripts);
            console.log(`Language: ${language}`);
        }
    }

    // special cases where we disagree with CLDR
    [ 'az', 'ms', 'kk', 'pa', 'tk', 'ha' ].forEach((language) => {
        const scripts = getValue(root, [ language ], "scripts");
        setValue(root, [ language ], "scripts", scripts.reverse());
    });
    [ 'ky', 'tg' ].forEach((language) => {
        const scripts = getValue(root, [ language ], "scripts");
        let tmp = scripts[0];
        scripts[0] = scripts[1];
        scripts[1] = tmp;
        setValue(root, [ language ], "scripts", scripts);
    });
};
