/*
 * currencies.js - generate the currency info from the CLDR data files
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
import { supplemental } from 'cldr-core/supplemental/currencyData.json';
import { main } from 'cldr-numbers-full/main/en/currencies.json';

import { setValue } from './common';

const currencyData = supplemental.currencyData;
const currencyDispData = main['en'].numbers.currencies;

/**
 * Find the last one by the _from date
 */
function getUsingCurrency(currencies) {
    const curObj = currencies.filter((curObj) => {
        for (let currency in curObj) {
            // only take the first one
            return curObj[currency]._from && !curObj[currency]._tender;
        }
    }).map((curObj) => {
        for (let currency in curObj) {
            // only take the first one
            return {
                date: new Date(curObj[currency]._from).getTime(),
                code: currency
            };
        }
    }).sort((left, right) => {
        return right.date - left.date;
    });
    return curObj && curObj.length && curObj[0].code;
}

export default function genCurrencies(root) {
    // US Dollars is the world reserve currency
    setValue(root, [], "currency", "USD");
    console.log(`Currency: root -> USD`);

    for (var region in currencyData.region) {
        if (region && currencyData.region[region]) {
            let names = ["und", region];

            const cur = getUsingCurrency(currencyData.region[region]);

            setValue(root, names, "currency", cur);
            console.log(`Currency: und-${region} -> ${cur}`);
        }
    }
}
