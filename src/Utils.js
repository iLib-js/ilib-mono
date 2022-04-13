/*
 * Utils.js - common routines shared amongst the cldr/unicode tools
 * 
 * Copyright © 2013, 2018, 2021-2022 JEDLSoft
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

/**
 * @module Utils
 */

/**
 * Test whether an object is an javascript array. 
 * 
 * @param {*} object The object to test
 * @return {boolean} return true if the object is an array
 * and false otherwise
 */
export function isArray(object) {
    let o;
    if (typeof(object) === 'object') {
        o = /** @type {Object|null|undefined} */ object;
        return Object.prototype.toString.call(o) === '[object Array]';
    }
    return false;
};

/*
 * The 32-bit Unicode value:
 * 000u uuuu xxxx   xxxx xxxx xxxx
 * 
 * Is translated to the following UTF-16 sequence:
 * 1101 10ww wwxx xxxx   1101 11xx xxxx xxxx
 * 
 * Where wwww = uuuuu - 1
 */
export function codePointToUTF16(codepoint) {
    if (codepoint < 0x10000) {
        return String.fromCharCode(codepoint);
    } else {
        const high = Math.floor(codepoint / 0x10000) - 1;
        const low = codepoint & 0xFFFF;

        return String.fromCharCode(0xD800 | ((high & 0x000F) << 6) |  ((low & 0xFC00) >> 10)) +
            String.fromCharCode(0xDC00 | (low & 0x3FF));
    }
};

export function UTF16ToCodePoint(str) {
    if (!str || str.length === 0) {
        return -1;
    }
    let code = -1;
    const high = str.charCodeAt(0);
    if (high >= 0xD800 && high <= 0xDBFF) {
        if (str.length > 1) {
            const low = str.charCodeAt(1);
            if (low >= 0xDC00 && low <= 0xDFFF) {
                code = (((high & 0x3C0) >> 6) + 1) << 16 |
                    (((high & 0x3F) << 10) | (low & 0x3FF));
            }
        }
    } else {
        code = high;
    }

    return code;
};

export function isSurrogate(ch) {
    const n = ch.charCodeAt(0);
    return ((n >= 0xDC00 && n <= 0xDFFF) || (n >= 0xD800 && n <= 0xDBFF));
};

export function charIterator(string) {
    this.index = 0;
    this.hasNext = function () {
        return (this.index < string.length);
    };
    this.next = function () {
        let ch = undefined;
        if (this.index < string.length) {
            ch = string.charAt(this.index);
            if (isSurrogate(ch) && 
                    this.index+1 < string.length && 
                    isSurrogate(string.charAt(this.index+1))) {
                this.index++;
                ch += string.charAt(this.index);
            }
            this.index++;
        }
        return ch;
    };
};

/**
 * Return the character that is represented by the given hexadecimal encoding.
 * 
 * @param {string} hex the hexadecimal encoding of the code point of the character
 * @return {string} the character that is equivalent to the hexadecimal
 */
export function hexToChar(hex) {
    return codePointToUTF16(parseInt(hex,16));
};

/**
 * Return a string created by interpretting the space-separated Unicode characters
 * encoded as hex digits. 
 * 
 * Example: "0065 0066"  -> "ab"
 * 
 * @param {string} hex the string of characters encoded as hex digits
 * @return {string} the equivalent string as regular UTF-16 Unicode characters
 */
export function hexStringUTF16String(hex) {
    const chars = hex.split(/\s+/g);
    let ret = "";

    for (var i = 0; i < chars.length; i++) {
        ret += hexToChar(chars[i]);
    }

    return ret;
};

/**
 * Re-encode the characters in a string as a space-separated sequence of 16-bit
 * hex values.
 * 
 * @param {string} string string to re-encode 
 * @return {string} the re-encoded string
 */
export function toHexString(string) {
    let i, result = "";

    if (!string) {
        return "";
    }
    for (i = 0; i < string.length; i++) {
        const ch = string.charCodeAt(i).toString(16);
        result += "0000".substring(0, 4-ch.length) + ch;
        if (i < string.length - 1) {
            result += " ";
        }
    }
    return result.toUpperCase();
};

/**
 * Do a binary search of an array of ranges and single values to determine
 * whether or not the given value is encoded in that array. If an element
 * is a single number, it must match exactly for that element to be returned
 * as a match. If the element is a range array, then the range array
 * has the low end of the range encoded in the 0th element, and the
 * high end in the 1st element. The range array may contain more elements
 * after that, but the extra elements are ignored. They may be used to 
 * indicate other information about the range, such as a name for example. 
 * 
 * @param {Array.<{Array.<number>|number}>} arr array of number or array of number to search
 * @param {number} num value to search for
 * @return {number} the index in the array of the matching element or -1 to indicate no
 * match
 */
export function findMember(arr, num) {
    let high = arr.length - 1,
        low = 0,
        mid = 0,
        value;

    while (low <= high) {
        mid = Math.floor((high+low)/2);
        if (typeof(arr[mid]) === 'object') {
            if (num >= arr[mid][0] && num <= arr[mid][1]) {
                return mid;
            } else {
                value = arr[mid][0] - num;
            }
        } else {
            value = arr[mid] - num;
        }
        if (value > 0) {
            high = mid - 1;
        } else if (value < 0) {
            low = mid + 1;
        } else {
            return mid;
        }
    }

    return ((typeof(arr[mid]) === 'object') ? (num >= arr[mid][0] && num <= arr[mid][1]) : (arr[mid] == num)) ? mid : -1;
};

/**
 * Do a binary search of an array of ranges and single values to determine
 * whether or not the given character is encoded in that array.
 * 
 * @param {Array.<{Array.<number>|number}>} arr 
 * @param {number} num number to search for
 * @return {boolean} true if the number is in the array or within a range in the array
 */
export function isMember(arr, num) {
    return findMember(arr, num) !== -1;
};

/**
 * Coelesce ranges to shorten files and to make searching it more efficient. There are 4 cases:
 * 
 * 1. [A] followed by [A+1]       -> [A, A+1]
 * 2. [A] followed by [A+1, B]    -> [A, B]
 * 3. [A, B] followed by [B+1]    -> [A, B+1]
 * 4. [A, B] followed by [B+1, C] -> [A, C]
 * 
 * where A, B, and C represent particular values. Handle each case properly.
 * 
 * @param {Array.<{Array.<string|number>}>} ranges an array of range arrays
 * @param {number} skip the number of elements to skip before the range.  
 * If it is 0, look at elements 0 and 1, and if it is 1, then the range is 
 * in elements 1 and 2.
 * @return {Array.<{Array.<string|number>}>} a coelesced array of ranges
 */
export function coelesce(ranges, skip) {
    let ret = [];

    for (var i = ranges.length-1; i >= 0; i--) {
        if (ranges[i] && ranges[i+1] && (skip === 0 || ranges[i][0] === ranges[i+1][0])) {
            if (ranges[i].length === 1+skip) {
                if (ranges[i][skip] === ranges[i+1][skip] - 1) {
                    ranges[i].push(ranges[i+1][(ranges[i+1].length === 1+skip) ? skip : 1+skip]);
                    ranges.splice(i+1, 1);
                }
            } else {
                if (ranges[i][1+skip] === ranges[i+1][skip] - 1) {
                    ranges[i][1+skip] = ranges[i+1][(ranges[i+1].length === 1+skip) ? skip : 1+skip];
                    ranges.splice(i+1, 1);
                }
            }
        }
    }

    for (var i = 0; i < ranges.length; i++) {
        if (ranges[i]) {
            ret.push(ranges[i]);
        }
    }

    return ret;
};

/**
 * Merge the properties of object2 into object1 in a deep manner and return a merged
 * object. If the property exists in both objects, the value in object2 will overwrite
 * the value in object1. If a property exists in object1, but not in object2, its value
 * will not be touched. If a property exists in object2, but not in object1, it will be
 * added to the merged result.<p>
 * 
 * Name1 and name2 are for creating debug output only. They are not necessary.<p>
 * 
 * 
 * @param {*} object1 the object to merge into
 * @param {*} object2 the object to merge
 * @param {string=} name1 name of the object being merged into
 * @param {string=} name2 name of the object being merged in
 * @return {Object} the merged object
 */
export function merge(object1, object2, name1, name2) {
    var prop = undefined,
        newObj = {};

    for (prop in object1) {
        if (prop && typeof(object1[prop]) !== 'undefined') {
            newObj[prop] = object1[prop];
        }
    }

    for (prop in object2) {
        if (prop && typeof(object2[prop]) !== 'undefined') {
            if (isArray(object1[prop]) && isArray(object2[prop])) {
                newObj[prop] = [].concat(object1[prop]);
                newObj[prop] = newObj[prop].concat(object2[prop]);
            } else if (typeof(object1[prop]) === 'object' && typeof(object2[prop]) === 'object') {
                newObj[prop] = merge(object1[prop], object2[prop]);
            } else {
                // for debugging. Used to determine whether or not json files are overriding their parents unnecessarily
                if (name1 && name2 && newObj[prop] == object2[prop]) {
                    console.log("Property " + prop + " in " + name1 + " is being overridden by the same value in " + name2);
                }
                newObj[prop] = object2[prop];
            }
        }
    }
    return newObj;
};

export function prune(parent, child) {
    let ret = {};
    for (var prop in child) {
        if (prop && typeof(child[prop]) !== 'undefined') {
            if (prop === 'generated') {
                ret[prop] = child[prop];
            } else if (parent && typeof(parent[prop]) === 'object') {
                if (typeof(child[prop]) === 'object') {
                    const obj = prune(parent[prop], child[prop]);
                    if (!isEmpty(obj)) {
                        ret[prop] = obj;
                    }
                } else {
                    // overriding an object with an non-object
                    ret[prop] = child[prop];
                }
            //} else if (typeof(parent[prop]) === 'undefined') {
                //if (prop !== child[prop]) {
                    //ret[prop] = child[prop];
                //}
            } else if (!parent || (parent[prop] !== child[prop] && child[prop].toString().length !== undefined)) {
                ret[prop] = child[prop];
            }
        }
    }
    return ret;
};

export function mergeAndPrune(localeData) {
    if (localeData) {
        if (typeof(localeData.merged) === 'undefined') {
            // special case for the top level
            localeData.merged = localeData.data;
        }
        for (var prop in localeData) {
            // console.log("merging " + prop);
            if (prop && typeof(localeData[prop]) !== 'undefined' && prop !== 'data' && prop !== 'merged') {
                // console.log(prop + " ");
                localeData[prop].merged = merge(localeData.merged || {}, localeData[prop].data || {});
                localeData[prop].data = prune(localeData.merged || {}, localeData[prop].data || {});
                // console.log("recursing");
                mergeAndPrune(localeData[prop]);
            }
        }
    }
};

export function makeDirs(path) {
    var parts = path.split(/[\\\/]/);

    for (var i = 1; i <= parts.length; i++) {
        var p = parts.slice(0, i).join("/");
        if (p && p.length > 0 && !fs.existsSync(p)) {
            fs.mkdirSync(p);
        }
    }
};

export function isEmpty(obj) {
    var prop = undefined;

    if (!obj) {
        return true;
    }

    for (prop in obj) {
        if (prop && obj[prop]) {
            return false;
        }
    }
    return true;
};
