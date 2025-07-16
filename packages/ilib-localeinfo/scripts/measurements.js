/*
 * measurements.js - generate the measurements information
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

import { setValue } from './common';

// hard-code these because CLDR has incorrect data
// See https://en.wikipedia.org/wiki/Metrication#Overview
// Remove GB from an imperial list
// note: https://www.worldatlas.com/articles/does-england-use-the-metric-system.html
var systems = {
    "uscustomary": ["US", "FM", "MH", "LR", "PR", "PW", "GU", "WS", "AS", "VI", "MP"],
    "imperial": ["MM"]
};

export default function genMeasurements(root) {
    let value = "metric";
    setValue(root, [], "units", value);
    console.log(`Measurements: root -> ${value}`);

    for (let value in systems) {
        for (let region of systems[value]) {
            setValue(root, ["und", region], "units", value);
            console.log(`Measurements: und-${region} -> ${value}`);
        }
    }
};
