/*
 * utils.js - utility functions for the rules
 *
 * Copyright © 2022-2023 JEDLSoft
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

import { IntlMessageFormat } from 'intl-messageformat';

/** @returns {string} */
function concatIntlAstText(/** @type {import("@formatjs/icu-messageformat-parser").MessageFormatElement[]} */ astElements) {
    return astElements
        .map((element) => {
            switch (element.type) {
                case 0: // literal
                    return element.value;
                case 1: // argument
                    return "{" + element.value + "}";
                case 5: // select
                case 6: // plural
                    return "";
                    /*
                    // take each variation of a given plural, recursively convert its ast to text,
                    // then join all stripped variants into single string separating them by single space
                    return Object.values(element.options)
                        .map((pluralOption) => concatIntlAstText(pluralOption.value))
                        .join(" ");
                    */
                case 8: // tag
                    // recursively process elements inside of a tag
                    return concatIntlAstText(element.children);
                default:
                    return "value" in element ? element.value : "";
            }
        })
        .join("");
};

export function stripPlurals(/** @type {string} */ message, /** @type {string} */ locale) {
    try {
        const imf = new IntlMessageFormat(message, locale);
        const ast = imf.getAst();
        return concatIntlAstText(ast);
    } catch (e) {
        // punt
        return message;
    }
}

export function wrap(text, length) {
    // already short enough?
    if (text.length < length) return [text];

    let output = [];

    for (let i = length; i > 0; i--) {
        if (text[i] === ' ' || text[i] === '\t') {
            output.push(text.substring(0, i));
            output.push(text.substring(i+1));
            return output;
        }
    }

    // no spaces? Just cut it off
    output.push(text.substring(0, length - index.length));
    output.push(text.substring(length - index.length));
    return output;
}

const spaces = "                                                     ";

export function indent(arr, length) {
    arr[0] = spaces.substring(0, length) + arr[0];
    for (let i = 1; i < arr.length; i++) {
        arr[i] = spaces.substring(0, 2*length) + arr[i];
    }
    return arr;
}