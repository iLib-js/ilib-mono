/*
 * regions.js - generate the regions data
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

import { main } from 'cldr-localenames-full/main/en/territories.json';

const territoriesData = main.en.localeDisplayNames.territories;

/*
 * Region names where iLib intentionally differs from CLDR, usually because a
 * country has been renamed and CLDR has not published the new name yet. Delete
 * an entry once the CLDR data catches up so that we go back to tracking it.
 *
 * NR: renamed to Naoero by constitutional amendment in May 2026.
 *     See https://en.wikipedia.org/wiki/Naoero
 */
const overrides = {
    "NR": "Naoero"
};

export default function genRegions(root) {
    let names;

    for (var region in territoriesData) {
        if (region.search(/[_\-0123456789]/) === -1) {
            names = getLocaleParts("und-" + region);
            setValue(root, names, "region.name", overrides[region] || territoriesData[region]);
            console.log(`Region: ${region}`);
        }
    }
};
