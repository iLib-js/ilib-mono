/*
 * numbers.js - generate the number info
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

import path from 'path';
import Locale from 'ilib-locale';

import { supplemental } from 'cldr-core/supplemental/numberingSystems.json';
import { availableLocales } from 'cldr-core/availableLocales.json';

import { getLocaleParts, setValue } from './common';

const localeDirs = availableLocales.full;

function correctedLocale(locale) {
    return (locale === "ku") ? "ckb" : locale;
}

function getNumberSymbols(root, numberingSystem, data) {
    const symbols = root["symbols-numberSystem-" + numberingSystem];

    data.script = numberingSystem.charAt(0).toUpperCase() + numberingSystem.substring(1, 4);
    data.decimalChar = symbols.decimal;
    data.groupChar = symbols.group;
    data.pctChar = symbols.percentSign;
    //data.pmlChar = symbols.perMille;
    data.exponential = symbols.exponential;
    //data.minus = symbols.minusSign;
    //data.plus = symbols.plusSign;
    data.roundingMode = "halfdown";
}

function getNumberDecimals(root, numberingSystem, data) {
    const decimals = root["decimalFormats-numberSystem-" + numberingSystem];
    const symbols = root["symbols-numberSystem-" + numberingSystem];
    const decimalFormat = decimals.standard.replace(/'.+'/g, "");
    const decimalFormatPositive = decimalFormat.replace(/.*;/g, "");
    const decimalFormatNegative = decimalFormat.replace(/;.*/g, "");

    let lastDecimal = decimalFormat.lastIndexOf(".");
    let lastComma = decimalFormat.lastIndexOf(",");

    if (lastDecimal > -1) {
        if (lastDecimal > lastComma) {
            lastComma++;
        } else {
            lastDecimal++;
        }
        data.prigroupSize = Math.abs(lastDecimal - lastComma);
    } else {
        data.prigroupSize = decimalFormat.length - (lastComma + 1);
    }

    const commas = decimalFormat.match(/,/g);
    if (commas != null) {
        const secondarySize = (commas.length > 1) ? (decimalFormat.lastIndexOf(",") - (decimalFormat.indexOf(",") + 1)) : 0;
        if (secondarySize) {
            data.secgroupSize = secondarySize;
        }
    }

    data.negativenumFmt = (decimalFormatPositive !== decimalFormatNegative) ?
        decimalFormatNegative.replace(/[0#,\.]+/, "{n}").trim() :
        symbols.minusSign + decimalFormatPositive.replace(/[0#,\.]+/, "{n}").trim();
}

function getNumberPercentages(root, numberingSystem, data) {
    const percents = root["percentFormats-numberSystem-" + numberingSystem].standard;
    const symbols = root["symbols-numberSystem-" + numberingSystem];

    const percentFormat = percents.replace(/'.+'/g, "");
    const percentFormatPositive = percentFormat.replace(/.*;/g, "");
    const percentFormatNegative = percentFormat.replace(/;.*/g, "");

    data.pctFmt = percentFormatPositive.replace(/[0#,\.]+/, "{n}").replace("%", data.pctChar).trim();

    data.negativepctFmt = (percentFormatPositive !== percentFormatNegative) ?
        percentFormatNegative.replace(/[0#,\.]+/, "{n}").replace("%", data.pctChar).trim() :
        symbols.minusSign + data.pctFmt;
}

function getNumberCurrencies(root, numberingSystem, data) {
    const currencies = root["currencyFormats-numberSystem-" + numberingSystem].standard;
    const symbols = root["symbols-numberSystem-" + numberingSystem];

    const currencyFormat = currencies.replace(/'.+'/g, "");
    const currencyFormatPositive = currencyFormat.replace(/;.*/g, "");
    const currencyFormatNegative = currencyFormat.replace(/.*;/g, "");
    const positive = currencyFormatPositive.replace(/[0#,\.]+/, "{n}").replace(/¤/g, "{s}");

    data.currencyFormats = {
        common: positive,
        commonNegative: (currencyFormatPositive !== currencyFormatNegative) ?
            currencyFormatNegative.replace(/[0#,\.]+/, "{n}").replace(/¤/g, "{s}") :
            symbols.minusSign + positive
    };
}

function getNumberDigits(root, numberingSystem, data) {
    const digitsData = supplemental.numberingSystems[numberingSystem];

    let nativeDigits;
    const standardDigits = "0123456789";

    if (typeof(digitsData) !== 'undefined' && numberingSystem !== "Latn" && digitsData._type === "numeric") {
        nativeDigits = digitsData._digits;

        if (nativeDigits != standardDigits) {
            data.digits = nativeDigits;
            data.useNative = true;
        } else {
            data.useNative = false;
        }
    }
}

function getNumberFormats(root, numberingSystem) {
    let data = {};
    getNumberSymbols(root, numberingSystem, data);
    getNumberDecimals(root, numberingSystem, data);
    getNumberPercentages(root, numberingSystem, data);
    getNumberCurrencies(root, numberingSystem, data);
    getNumberDigits(root, numberingSystem, data);
    return data;
}

function getLocaleData(dirname) {
    const loc = correctedLocale(dirname);
    const filename = path.join("cldr-numbers-full/main", loc, "numbers.json");
    const data = require(filename);
    const numbers = data.main[loc].numbers;

    const numberingSystem = numbers.defaultNumberingSystem;

    return getNumberFormats(numbers, numberingSystem);
};

function getLocaleDataNative(dirname) {
    const loc = correctedLocale(dirname);
    const filename = path.join("cldr-numbers-full/main", loc, "numbers.json");
    const data = require(filename);
    const numbers = data.main[loc].numbers;

    const numberingSystem = numbers.defaultNumberingSystem;
    const nativeNumberingSystem = numbers.otherNumberingSystems.native;

    if (nativeNumberingSystem && nativeNumberingSystem != numberingSystem) {
        return getNumberFormats(numbers, nativeNumberingSystem);
    }

    return undefined;
};

export default function genNumbers(root) {
    setValue(root, [], "numfmt", getLocaleData("und"));
    var native = getLocaleDataNative("und");
    if (native) {
        setValue(root, [], "native_numfmt", native);
    }
    console.log(`Numbers: root`);

    for (let dir of localeDirs) {
        const names = getLocaleParts(dir);
        setValue(root, names, "numfmt", getLocaleData(dir));
        var native = getLocaleDataNative(dir);
        if (native) {
            setValue(root, names, "native_numfmt", native);
        }
        console.log(`Numbers: ${dir}`);
    }
};
