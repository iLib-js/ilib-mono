/*
 * utils.js - utility functions to support the other code
 *
 * Copyright © 2023 JEDLSoft
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

/** Replace whitespace in input string with visible representations
 *
 * The following explicit mapping is used:
 * | Whitespace | Description | Representation | Description |
 * | - | - | - | - |
 * | `\u0020` | regular space | `⎵` | open box |
 * | `\u00a0` | non-breaking space | `⍽` | shouldered open box |
 * | `\t` | tabulator | `→` | tab symbol |
 * | `\r` | carriage return | `␍` | CR symbol |
 * | `\n` | line feed | `␊` | LF symbol |
 * | `\v` | vertical tab | `␋` | VT symbol |
 *
 * Additionally, whitespaces not included in explicit mapping are represented
 * as their Unicode codepoint value, e.g. `\u3000` becomes `[U+3000]`.
 * 
 * @note If a non-string is passed on input, returned value will be an empty string.
 * 
 * @param {string} str Input string
 * @returns {string} String in which whitespaces are replaced with visible representations
 */
export const withVisibleWhitespace = (str) => {
    // safeguard - per convention, return empty string in case of an unexpected type of input
    if ("string" !== typeof str) return "";

    // partially per https://en.wikipedia.org/wiki/Whitespace_character#Substitute_images
    const explicitMapping = {
        "\u0020": "⎵",
        "\u00a0": "⍽",
        "\t": "→",
        "\r": "␍",
        "\n": "␊",
        "\v": "␋",
    };
    return str.replace(/\s/gm, (match) => {
        const representation = explicitMapping[match];
        if (undefined !== representation) {
            return representation;
        } else {
            // encode other whitespace characters with their unicode codepoint representations
            return `[U+${match.codePointAt(0).toString(16)}]`;
        }
    });
};

const kebabRe = /^[a-zA-Z]+-[a-zA-Z\-]*$/g
const camelRe = /^[A-Z]?[a-z]+[A-Z][a-zA-Z]*$/g;
const snakeRe = /(^|^[a-zA-Z]+)_[a-zA-Z_]*$/g;

/**
 * Return true if the given string is written with kebab case. Kebab
 * case is where words are separated with dashes, looking like they
 * have been strung out on a kebab stick.
 *
 * Example: this-is-kebab-case-text
 *
 * @param {String} str the string to test
 * @returns {boolean} true if the entire string is kebab case, and
 * false otherwise
 */
export function isKebabCase(str) {
    if (typeof(str) !== "string" || !str) return false;
    kebabRe.lastIndex = 0;
    return kebabRe.test(str);
}

/**
 * Return true if the given string is written with camel case. Camel
 * case is where words are not separated by spaces but the first letter
 * of each word is capitalized, looking like the humps of a camel.
 *
 * Example: thisIsCamelCaseText
 *
 * @param {String} str the string to test
 * @returns {boolean} true if the entire string is kebab case, and
 * false otherwise
 */
export function isCamelCase(str) {
    if (typeof(str) !== "string" || !str) return false;
    camelRe.lastIndex = 0;
    return camelRe.test(str);
}

/**
 * Return true if the given string is written with snake case. Snake
 * case is where words are separated with underscores, looking like they
 * have been strung out horizontally like a snake.
 *
 * Example: this_is_snake_case_text
 *
 * @param {String} str the string to test
 * @returns {boolean} true if the entire string is snake case, and
 * false otherwise
 */
export function isSnakeCase(str) {
    if (typeof(str) !== "string" || !str) return false;
    snakeRe.lastIndex = 0;
    return snakeRe.test(str);
}
