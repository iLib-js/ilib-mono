/*
 * papersizes.js - generate info about paper sizes
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

import { supplemental } from 'cldr-core/supplemental/measurementData.json';

import { setValue } from './common';

const paperSizeData = supplemental.measurementData.paperSize;

const sizeMap = {
    "US-Letter": {"regular": "8x11"},
    "A4": {"regular": "A4"}
};

export default function genPaperSizes(root) {
    let value = sizeMap[paperSizeData["001"]];
    setValue(root, [], "paperSizes", value);
    console.log(`PaperSizes: root -> ${value.regular}`);

    for (let region in paperSizeData) {
        if (region !== "001") {
            const names = [ "und", region ];
            let value = sizeMap[paperSizeData[region]];
            setValue(root, names, "paperSizes", value);
            console.log(`PaperSizes: und-${region} -> ${value.regular}`);
        }
    }
}

