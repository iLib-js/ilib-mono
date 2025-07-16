/*
 * calendars.js - generate the calendars information
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

import { getLocaleParts, setValue } from './common';

// hard-code these because CLDR does not have this data
var calendars = {
    "und-TH": "thaisolar",
    "und-IR": "persian",
    "und-AF": "persian",
    "und-ET": "ethiopic",
    "cop": "coptic"
};

export default function genMeasurements(root) {
    let value = "gregorian";
    setValue(root, [], "calendar", value);
    console.log(`Calendar: root -> ${value}`);

    for (let locale in calendars) {
        value = calendars[locale];
        const names = getLocaleParts(locale);
        setValue(root, names, "calendar", value);
        console.log(`Calendar: ${locale} -> ${value}`);
    }
};
