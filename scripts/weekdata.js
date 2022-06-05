/*
 * weekdata.js - generate the week information
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
import { supplemental} from 'cldr-core/supplemental/weekData.json';

import { setValue } from './common';

const dayProperties = {"sun":0, "mon":1, "tue":2, "wed":3, "thu":4, "fri":5, "sat":6};
const firstDayOfWeekData = supplemental.weekData.firstDay;
const weekendStartData = supplemental.weekData.weekendStart;
const weekendEndData = supplemental.weekData.weekendEnd;

export default function genWeekData(root) {
    let value = dayProperties[firstDayOfWeekData["001"]];
    setValue(root, [], "firstDayOfWeek", value);
    console.log(`FirstDOW: root -> ${value}`);

    for (let loc in firstDayOfWeekData) {
        if (loc !== "001" && loc !== "GB-alt-variant") {
            const locale = new Locale(loc);
            const names = [
                locale.getLanguage() || "und",
                locale.getRegion()
            ];
            value = dayProperties[firstDayOfWeekData[loc]];
            setValue(root, names, "firstDayOfWeek", value);
            console.log(`FirstDOW: und-${loc} -> ${value}`);
        }
    }

    value = dayProperties[weekendStartData["001"]];
    setValue(root, [], "weekendStart", value);
    console.log(`WeekendStart: root -> ${value}`);

    for (var loc in weekendStartData) {
        if (loc !== "001") {
            const locale = new Locale(loc);
            const names = [
                locale.getLanguage() || "und",
                locale.getRegion()
            ];
            value = dayProperties[weekendStartData[loc]];
            setValue(root, names, "weekendStart", value);
            console.log(`WeekendStart: und-${loc} -> ${value}`);
        }
    }

    value = dayProperties[weekendEndData["001"]];
    setValue(root, [], "weekendEnd", value);
    console.log(`WeekendEnd: root -> ${value}`);

    for (var loc in weekendEndData) {
        if (loc !== "001") {
            const locale = new Locale(loc);
            const names = [
                locale.getLanguage() || "und",
                locale.getRegion()
            ];
            value = dayProperties[weekendEndData[loc]];
            setValue(root, names, "weekendEnd", value);
            console.log(`WeekendEnd: und-${loc} -> ${value}`);
        }
    }
};
