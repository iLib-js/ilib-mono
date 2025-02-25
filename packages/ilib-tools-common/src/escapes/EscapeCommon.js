/*
 * JSCommon.js - common functions between JS and JSON that unescape strings
 *
 * Copyright © 2025 JEDLSoft
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

import IString from 'ilib-istring';

const reUnicodeChar = /\\u([a-fA-F0-9]{1,5})/g;
const reUnicodeBracketedChar = /\\u\{([a-fA-F0-9]{1,5})\}/g;
const reUnicodeExtendedChar = /\\U([a-fA-F0-9]{1,8})/g;
const reHexadecimalChar = /\\x([a-fA-F0-9]{1,2})/g;
const reOctalChar = /\\([0-7]{1,3})/g;

/**
 * Unescape a string that has sequences like \uXXXX
 * @param {string} string the string to unescape
 * @returns {string} the unescaped string
 * @static
 */
export function unescapeUnicode(string) {
    let unescaped = string;
    let match;

    while ((match = reUnicodeChar.exec(unescaped))) {
        if (match && match.length > 1) {
            const value = parseInt(match[1], 16);
            unescaped = unescaped.replace(match[0], IString.fromCodePoint(value));
            reUnicodeChar.lastIndex = 0;
        }
    }

    return unescaped;
};

/**
 * Unescape a string that has sequences like \u{XXXXX}
 * @param {string} string the string to unescape
 * @returns {string} the unescaped string
 * @static
 */
export function unescapeUnicodeWithBrackets(string) {
    let unescaped = string;
    let match;

    while ((match = reUnicodeBracketedChar.exec(unescaped))) {
        if (match && match.length > 1) {
            const value = parseInt(match[1], 16);
            unescaped = unescaped.replace(match[0], IString.fromCodePoint(value));
            reUnicodeBracketedChar.lastIndex = 0;
        }
    }

    return unescaped;
};

/**
 * Unescape a string that has sequences like \U000XXXXXX
 * @param {string} string the string to unescape
 * @returns {string} the unescaped string
 * @static
 */
export function unescapeUnicodeExtended(string) {
    let unescaped = string;
    let match;

    while ((match = reUnicodeExtendedChar.exec(unescaped))) {
        if (match && match.length > 1) {
            const value = parseInt(match[1], 16);
            unescaped = unescaped.replace(match[0], IString.fromCodePoint(value));
            reUnicodeExtendedChar.lastIndex = 0;
        }
    }

    return unescaped;
};

/**
 * Unescape a string that has hexadecimal escape sequences in it
 * of the form \xXX.
 *
 * @param {string} string the string to escape
 * @returns {string} the escaped string
 * @static
 */
export function unescapeHex(string) {
    let unescaped = string;
    let match;

    while ((match = reHexadecimalChar.exec(unescaped))) {
        if (match && match.length > 1) {
            const value = parseInt(match[1], 16);
            unescaped = unescaped.replace(match[0], IString.fromCodePoint(value));
            reHexadecimalChar.lastIndex = 0;
        }
    }

    return unescaped;
};

/**
 * Unescape a string that has octal escape sequences in it of the form \XXX.
 *
 * @param {string} string the string to escape
 * @returns {string} the escaped string
 * @static
 */
export function unescapeOctal(string) {
    let unescaped = string;
    let match;

    while ((match = reOctalChar.exec(unescaped))) {
        if (match && match.length > 1) {
            const value = parseInt(match[1], 8);
            unescaped = unescaped.replace(match[0], IString.fromCodePoint(value));
            reOctalChar.lastIndex = 0;
        }
    }

    return unescaped;
};

export const escapeRegexes = {
    "js": {
        "unescape": {
            "\\\\\\\\n": "",                 // line continuation
            "\\\\\\n": "",                   // line continuation
            "^\\\\\\\\": "\\",               // unescape backslashes
            "([^\\\\])\\\\\\\\": "$1\\",
            "^\\\\'": "'",                   // unescape quotes
            "([^\\\\])\\\\'": "$1'",
            '^\\\\"': '"',
            '([^\\\\])\\\\"': '$1"',
            "\\\\0": "\0",
            "\\\\b": "\b",
            "\\\\f": "\f",
            "\\\\n": "\n",
            "\\\\r": "\r",
            "\\\\t": "\t",
            "\\\\v": "\v"
        },
        "escape": {
            "\\\\": "\\\\",
            "'": "\\'",
            '"': '\\"',
            "\\0": "\\0",
            "\x08": "\\b",
            "\\f": "\\f",
            "\\n": "\\n",
            "\\r": "\\r",
            "\\t": "\\t",
            "\\v": "\\v",
        }
    },
    "php-double": {
        "unescape": {
            "^\\\\\\\\": "\\",               // unescape backslashes
            "([^\\\\])\\\\\\\\": "$1\\",     // unescape backslashes
            '^\\\\"': '"',                   // unescape double quotes only, not single
            '([^\\\\])\\\\"': '$1"',         // unescape double quotes only, not single
            "\\\\\\$": "$",
            "\\\\n": "\n",
            "\\\\r": "\r",
            "\\\\t": "\t",
            "\\\\e": "\u001B",
            "\\\\f": "\f",
            "\\\\v": "\v"
        },
        "escape": {
            "^\\\\": "\\\\",
            "([^\\\\])\\\\": "$1\\\\\\",
            '^"': '\\"',
            '([^\\\\])"': '$1\\"',
            "\\$": "\\$",
            "\\n": "\\n",
            "\\r": "\\r",
            "\\t": "\\t",
            "\u001B": "\\e",
            "\\f": "\\f",
            "\\v": "\\v"
        }
    },
    "php-single": {
        "unescape": {
            "^\\\\\\\\": "\\",               // unescape backslashes
            "([^\\\\])\\\\\\\\": "$1\\",     // unescape backslashes
            "^\\\\'": "'",                   // unescape quotes
            "([^\\\\])\\\\'": "$1'"
        },
        "escape": {
            "^\\\\": "\\\\",
            "([^\\\\])\\\\": "$1\\\\",
            "'": "\\'"
        }
    },
    "php-heredoc": {
        "unescape": {
            "^\\\\\\\\": "\\",               // unescape backslashes
            "([^\\\\])\\\\\\\\": "$1\\",     // unescape backslashes
            "\\\\\\$": "$",
            "\\\\n": "\n",
            "\\\\r": "\r",
            "\\\\t": "\t",
            "\\\\e": "\u001B",
            "\\\\f": "\f",
            "\\\\v": "\v"
        },
        "escape": {
            "^\\\\": "\\\\",
            "([^\\\\])\\\\": "$1\\\\",
            "\\$": "\\$",
            "\\n": "\\n",
            "\\r": "\\r",
            "\\t": "\\t",
            "\u001B": "\\e",
            "\\f": "\\f",
            "\\v": "\\v"
        }
    },
    "php-nowdoc": { // no escaping or unescaping whatsoever!!!
        "unescape": {
        },
        "escape": {
        }
    },
    "python": {
        "unescape": {
            "^\\\\\\\\": "\\",               // unescape backslashes
            "([^\\\\])\\\\\\\\": "$1\\",     // unescape backslashes
            "^\\\\'": "'",                   // unescape quotes
            "([^\\\\])\\\\'": "$1'",
            '^\\\\"': '"',
            '([^\\\\])\\\\"': '$1"',
            "\\\\n": "\n",
            "\\\\r": "\r",
            "\\\\t": "\t",
            "\\\\b": "\x08",
            "\\\\f": "\f",
            "\\\\v": "\v",
            "\\\\a": "\x07"
        },
        "escape": {
            "^\\\\": "\\\\",
            "([^\\\\])\\\\": "$1\\\\",
            '^"': '\\"',
            '([^\\\\])"': '$1\\"',
            "^'": "\\'",
            "([^\\\\])'": "$1\\'",
            "\\n": "\\n",
            "\\r": "\\r",
            "\\t": "\\t",
            "\x08": "\\b",
            "\\f": "\\f",
            "\\v": "\\v",
            "\x07": "\\a"
        }
    },
    "python-raw": {
        "unescape": {
            "^\\\\\\\\": "\\",               // unescape backslashes
            "([^\\\\])\\\\\\\\": "$1\\",     // unescape backslashes
            "^\\\\'": "'",                   // unescape quotes
            "([^\\\\])\\\\'": "$1'"
        },
        "escape": {
            "^\\\\": "\\\\",
            "([^\\\\])\\\\": "$1\\\\",
            "'": "\\'"
        }
    },
    "python-byte": {
        "unescape": {
            "^\\\\\\\\": "\\",               // unescape backslashes
            "([^\\\\])\\\\\\\\": "$1\\",     // unescape backslashes
            "^\\\\'": "'",                   // unescape quotes
            "([^\\\\])\\\\'": "$1'"
        },
        "escape": {
            "^\\\\": "\\\\",
            "([^\\\\])\\\\": "$1\\\\",
            "'": "\\'"
        }
    },
    "python-multi": {
        "unescape": {
            "^\\\\\\\\": "\\",               // unescape backslashes
            "([^\\\\])\\\\\\\\": "$1\\",     // unescape backslashes
            '^\\\\"': '"',                   // unescape double quotes only, not single
            '([^\\\\])\\\\"': '$1"',         // unescape double quotes only, not single
            "\\\\n": "\n",
            "\\\\r": "\r",
            "\\\\t": "\t",
            "\\\\b": "\x08",
            "\\\\f": "\f",
            "\\\\v": "\v",
            "\\\\a": "\x07"
        },
        "escape": {
            "([^\\\\])\\\\": "$1\\\\",
            '^"': '\\"',
            '([^\\\\])"': '$1\\"',
            "\\n": "\\n",
            "\\r": "\\r",
            "\\t": "\\t",
            "\x08": "\\b",
            "\\f": "\\f",
            "\\v": "\\v",
            "\x07": "\\a"
         }
    },
    // from https://docs.swift.org/swift-book/documentation/the-swift-programming-language/stringsandcharacters
    "swift": {
        "unescape": {
            "^\\\\\\\\": "\\",               // unescape backslashes
            "([^\\\\])\\\\\\\\": "$1\\",     // unescape backslashes
            "^\\\\'": "'",                   // unescape single quotes
            "([^\\\\])\\\\'": "$1'",
            '^\\\\"': '"',                   // unescape double quotes
            '([^\\\\])\\\\"': '$1"',
            "\\\\0": "\x00",
            "\\\\n": "\n",
            "\\\\r": "\r",
            "\\\\t": "\t",

        },
        "escape": {
            "^\\\\": "\\\\",
            "([^\\\\])\\\\": "$1\\\\",
            '^"': '\\"',
            '([^\\\\])"': '$1\\"',
            "^'": "\\'",
            "([^\\\\])'": "$1\\'",
            "\\x00": "\\0",
            "\n": "\\n",
            "\r": "\\r",
            "\t": "\\t"
        }
    },
    "swift-multi": {
        "unescape": {
            "^\\\\\\\\": "\\",               // unescape backslashes
            "([^\\\\])\\\\\\\\": "$1\\",     // unescape backslashes
            "^\\\\'": "'",                   // unescape single quotes
            "([^\\\\])\\\\'": "$1'",
            '^\\\\"': '"',                   // unescape double quotes
            '([^\\\\])\\\\"': '$1"',
            "\\\\0": "\x00",
            "\\\\n": "\n",
            "\\\\r": "\r",
            "\\\\t": "\t",
            "\\\\\n": ""                     // remove line continuation
        },
        "escape": {
            "^\\\\": "\\\\",
            "([^\\\\])\\\\": "$1\\\\",
        }
    },
    "swift-extended": {
        "unescape": {
            "^\\\\#+\\\\": "\\",               // unescape backslashes
            "([^\\\\])\\\\#+\\\\": "$1\\",     // unescape backslashes
            "^\\\\#+'": "'",                   // unescape single quotes
            "([^\\\\])\\\\#+'": "$1'",
            '^\\\\#+"': '"',                   // unescape double quotes
            '([^\\\\])\\\\#+"': '$1"',
            "\\\\#+0": "\x00",
            "\\\\#+n": "\n",
            "\\\\#+r": "\r",
            "\\\\#+t": "\t",
            "\\\\#+\n": ""                     // remove line continuation
        },
        "escape": {
            "^\\\\": "\\\\",
            "([^\\\\])\\\\": "$1\\\\",
        }
    },
    "xml": {
        "unescape": {
            "&lt;": "<",
            "&gt;": ">",
            "&quot;": "\"",
            "&apos;": "'",
            "&amp;": "&"
        },
        "escape": {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "\"": "&quot;",
            "'": "&apos;"
        }
    },
    "xml-attr": {
        "unescape": {
            "&lt;": "<",
            "&gt;": ">",
            "&quot;": "\"",
            "&apos;": "'",
            "&amp;": "&",
            "\\\\n": "\n",
            "\\\\r": "\r",
            "\\\\t": "\t",
            "\\\\b": "\x08",
            "\\\\f": "\f",
            "\\\\v": "\v"
        },
        "escape": {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "\"": "&quot;",
            "'": "&apos;",
            "\n": "\\n",
            "\r": "\\r",
            "\t": "\\t",
            "\x08": "\\b",
            "\f": "\\f",
            "\v": "\\v"
        }
    }
};

/**
 * Escape a string so that it has Javascript escape sequences
 * in it instead of the characters themselves.
 *
 * @param {string} string the string to escape
 * @returns {string} the escaped string
 * @static
 */
export function escapeJS(string) {
    let escaped = string;

    for (const [key, value] of Object.entries(escapeRegexes.js.escape)) {
        escaped = escaped.replace(new RegExp(key, "g"), value);
    }

    return escaped;
}

/**
 * Unescape a string that has Javascript escape sequences
 * in it.
 *
 * @param {string} string the string to unescape
 * @returns {string} the unescaped string
 * @static
 */
export function unescapeJS(string) {
    let unescaped = string;

    for (const [key, value] of Object.entries(escapeRegexes.js.unescape)) {
        unescaped = unescaped.replace(new RegExp(key, "g"), value);
    }

    return unescaped;
}

/**
 * Convert all code points above U+00FF and below U+10000
 * to \uXXXX form.
 *
 * @param {string} string the string to unescape
 * @returns {string} the unescaped string
 * @static
 */
export function escapeUnicode(string) {
    let output = "";

    for (const ch of string) {
        const code = IString.toCodePoint(ch, 0);
        if (code < 0x10000 && code > 0x00FF) {
            const str = code.toString(16).toUpperCase();
            output += "\\u" + str;
        } else {
            output += ch;
        }
    }

    return output;
}

/**
 * Convert all code points above U+FFFF to \uXXXXX form.
 *
 * @param {string} string the string to unescape
 * @returns {string} the unescaped string
 * @static
 */
export function escapeUnicodeAstral(string) {
    let output = "";

    for (const ch of string) {
        const code = IString.toCodePoint(ch, 0);
        if (code > 0xFFFF) {
            const str = code.toString(16).toUpperCase();
            output += "\\u" + str;
        } else {
            output += ch;
        }
    }

    return output;
}

/**
 * Convert all code points above U+FFFF to \u{XXXXX} form
 *
 * @param {string} string the string to escape
 * @returns {string} the escaped string
 * @static
 */
export function escapeUnicodeWithBrackets(string) {
    let output = "";

    for (const ch of string) {
        const code = IString.toCodePoint(ch, 0);
        if (code > 0x00FF) {
            const str = code.toString(16).toUpperCase();
            output += "\\u{" + str + "}";
        } else {
            output += ch;
        }
    }

    return output;
}

/**
 * Convert all code points above U+FFFF to \U000XXXXXX form
 *
 * @param {string} string the string to escape
 * @returns {string} the escaped string
 * @static
 */
export function escapeUnicodeExtended(string) {
    let output = "";

    for (const ch of string) {
        const code = IString.toCodePoint(ch, 0);
        if (code > 0xFFFF) {
            const str = code.toString(16).toUpperCase().padStart(8, "0");
            output += `\\U${str}`;
        } else {
            output += ch;
        }
    }

    return output;
}

/**
 * Escape a string so that it has hexadecimal escape sequences
 * in it instead of the characters themselves. This function
 * will only convert characters from U+0000 to U+001F. The rest
 * of the characters will be left alone. If you have characters
 * that are less than U+001F that have special escape sequences
 * in the target programming language, you should escape them
 * first before calling this function.
 *
 * @param {string} string the string to escape
 * @returns {string} the escaped string
 * @staticaaaa
 */
export function escapeHex(string) {
    let output = "";
    for (const ch of string) {
        const code = IString.toCodePoint(ch, 0);
        if (code < 0x20) {
            output += `\\x${code.toString(16).padStart(2, "0")}`;
        } else {
            output += ch;
        }
    }
    return output;
}

/**
 * Escape a string according to the rules given.
 * @param {string} string the string to escape
 * @param {object} rules the rules to use for escaping
 * @returns {string} the escaped string
 */
export function escapeRules(string, rules) {
    let escaped = string;
    for (const [key, value] of Object.entries(rules.escape)) {
        escaped = escaped.replace(new RegExp(key, "g"), value);
    }
    return escaped;
}

/**
 * Unescape a string according to the rules given.
 * @param {string} string the string to unescape
 * @param {object} rules the rules to use for unescaping
 * @returns {string} the unescaped string
 */
export function unescapeRules(string, rules) {
    let unescaped = string;
    for (const [key, value] of Object.entries(rules.unescape)) {
        unescaped = unescaped.replace(new RegExp(key, "g"), value);
    }
    return unescaped;
}
