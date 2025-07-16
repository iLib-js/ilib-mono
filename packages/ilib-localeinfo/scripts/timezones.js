/*
 * timezones.js - generate time zone info
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

import fs from 'fs';
import { UnicodeFile } from 'ilib-data-utils';

import { getLocaleParts, setValue } from './common';

let countries = {};
let countryToZones = {};
let backwardsMap = {};

// hard-code countries with multiple time zones
const defaultTimeZoneID = {
    "AU": "Australia/Sydney",
    "BR": "America/Sao_Paulo",
    "CA": "America/Toronto",
    "CL": "America/Santiago",
    "CY": "Asia/Nicosia",
    "ES": "Europe/Madrid",
    "FM": "Pacific/Pohnpei",
    "GL": "America/Nuuk",
    "KI": "Pacific/Kiritimati",
    "MH": "Pacific/Majuro",
    "MN": "Asia/Ulaanbaatar",
    "MX": "America/Mexico_City",
    "PF": "Pacific/Tahiti",
    "PG": "Pacific/Port_Moresby",
    "PT": "Europe/Lisbon",
    "RU": "Europe/Moscow",
    "US": "America/New_York"
};

function setUpTimeZones() {
    const zoneTab = new UnicodeFile({
        path: '../tz/zone.tab',
        splitChar: /\t+/g
    });

    const backwardsFile = new UnicodeFile({
        path: '../tz/backward',
        splitChar: /\t+/g
    });

    for (let i = 0; i < backwardsFile.length(); i++) {
        const row = backwardsFile.get(i);
        backwardsMap[row[2].trim()] = row[1].trim();
        console.log("mapped old id " + row[2] + " to modern " + row[1] );
    }

    for (var i = 0; i < zoneTab.length(); i++) {
        const row = zoneTab.get(i);
        console.log("map " + row[2] + " to " + row[0] );
        countries[row[2]] = row[0];
        if (!countryToZones[row[0]]) {
            countryToZones[row[0]] = new Set();
        }
        countryToZones[row[0]].add(row[2]);
    }

    // some hard-coded zones that not listed properly in the zone.tab
    countries = Object.assign(countries, {
        "America/Coral_Harbour": "CA",
        "Atlantic/Jan_Mayen": "NO",
        "America/Virgin": "TT"
    });

    // now deal with backwards maps so that they appear in the right country's list of zones
    for (let oldzone in backwardsMap) {
        let newzone = backwardsMap[oldzone];
        if (countries[newzone] && (!countries[oldzone] || countries[newzone] === countries[oldzone])) {
            countryToZones[countries[newzone]].add(oldzone);
        } else if (countries[oldzone]) {
            countryToZones[countries[oldzone]].add(oldzone);
        }
    }

    for (var country in countryToZones) {
        let zones = [];
        countryToZones[country].forEach((zone) => {
            zones.push(zone);
        });
        countryToZones[country] = zones.sort();
    }
}

export default function genTimeZones(root) {
    let names;

    setUpTimeZones();

    // special case
    setValue(root, [], "timezone", "Etc/UTC");
    console.log(`Timezone: root -> Etc/UTC`);

    for (var country in countryToZones) {
        let countryZoneID = countryToZones[country][0];
        if (typeof(backwardsMap[countryZoneID]) !== 'undefined') {
            countryZoneID = backwardsMap[countryZoneID];
        }

        const timezone = defaultTimeZoneID[country] || countryZoneID;

        names = getLocaleParts("und-" + country);
        setValue(root, names, "timezone", timezone);
        console.log(`Timezone: ${country} -> ${timezone}`);
    }
};
