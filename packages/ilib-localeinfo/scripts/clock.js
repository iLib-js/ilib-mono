/*
 * clock.js - generate the clock info from the CLDR data files
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

import Locale from 'ilib-locale';
import { supplemental as supplementalData } from 'cldr-core/supplemental/timeData.json';

import { setValue } from './common';

let timeData = supplementalData.timeData;

function getPreferClock(char) {
    if (!char) return;
    return (char === "H") ? "24" : "12";
}

export default function genClock(root) {
    let value = getPreferClock(timeData["001"]["_preferred"]);
    setValue(root, [], "clock", value);
    console.log(`Clock: root -> ${value}`);

    for (let localeSpec in timeData) {
        if (localeSpec !== "001") {
            let locale = new Locale(localeSpec);

            let names = [ locale.getLanguage() || "und" ];

            if (locale.getRegion() !== "001") {
                names.push(locale.getRegion());
            }

            value = getPreferClock(timeData[localeSpec]["_preferred"]);
            setValue(root, names, "clock", value);
            console.log(`Clock: ${locale.getSpec()} -> ${value}`);
        }
    }
}
