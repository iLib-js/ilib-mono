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
 * as their Unicode codepoint value, e.g. `\u3000` becomes `[U+3000]`
 */
export const withVisibleWhitespace = (/** @type {string} */ str) => {
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
