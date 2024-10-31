/*
 * JSUtils.js - Misc utilities to work around Javascript engine differences
 *
 * Copyright © 2013-2015, 2018, 2021-2022 JEDLSoft
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

import log4js from '@log4js-node/log4js-api';

const logger = log4js.getLogger("ilib-common");

/**
 * @module JSUtils
 */

/**
 * Polyfill to test whether an object is an javascript array.
 *
 * @static
 * @param {*} object The object to test
 * @return {boolean} return true if the object is an array
 * and false otherwise
 */
export function isArray(object) {
    if (typeof(Array.isArray) === 'function') return Array.isArray(object);

    if (typeof(object) === 'object') {
        return Object.prototype.toString.call(object) === '[object Array]';
    }
    return false;
};

/**
 * Perform a shallow copy of the source object to the target object. This only
 * copies the assignments of the source properties to the target properties,
 * but not recursively from there.<p>
 *
 *
 * @static
 * @param {Object} source the source object to copy properties from
 * @param {Object} target the target object to copy properties into
 */
export function shallowCopy(source, target) {
    var prop = undefined;
    if (source && target) {
        // using Object.assign is about 1/3 faster on nodejs
        if (typeof(Object.assign) === "function") {
            return Object.assign(target, source);
        }
        // polyfill
        for (prop in source) {
            if (prop !== undefined && typeof(source[prop]) !== 'undefined') {
                target[prop] = source[prop];
            }
        }
    }
};

/**
 * Perform a recursive deep copy from the "from" object to the "deep" object.
 *
 * @static
 * @param {Object} from the object to copy from
 * @param {Object} to the object to copy to
 * @return {Object} a reference to the the "to" object
 */
export function deepCopy(from, to) {
    var prop;

    for (prop in from) {
        if (prop) {
            if (typeof(from[prop]) === 'object') {
                to[prop] = {};
                deepCopy(from[prop], to[prop]);
            } else {
                to[prop] = from[prop];
            }
        }
    }
    return to;
};

/**
 * Map a string to the given set of alternate characters. If the target set
 * does not contain a particular character in the input string, then that
 * character will be copied to the output unmapped.
 *
 * @static
 * @param {string} str a string to map to an alternate set of characters
 * @param {Array.<string>|Object} map a mapping to alternate characters
 * @return {string} the source string where each character is mapped to alternate characters
 */
export function mapString(str, map) {
    var mapped = "";
    if (map && str) {
        for (var i = 0; i < str.length; i++) {
            var c = str.charAt(i); // TODO use a char iterator?
            mapped += map[c] || c;
        }
    } else {
        mapped = str;
    }
    return mapped;
};

/**
 * Check if an object is a member of the given array. This is a polyfill for
 * Array.indexOf. If this javascript engine
 * support indexOf, it is used directly. Otherwise, this function implements it
 * itself. The idea is to make sure that you can use the quick indexOf if it is
 * available, but use a slower implementation in older engines as well.
 *
 * @static
 * @param {Array.<Object|string|number>} array array to search
 * @param {Object|string|number} obj object being sought. This should be of the same type as the
 * members of the array being searched. If not, this function will not return
 * any results.
 * @return {number} index of the object in the array, or -1 if it is not in the array.
 */
export function indexOf(array, obj) {
    if (!array || !obj) {
        return -1;
    }
    if (typeof(array.indexOf) === 'function') {
        return array.indexOf(obj);
    } else {
        // polyfill
        for (var i = 0; i < array.length; i++) {
            if (array[i] === obj) {
                return i;
            }
        }
        return -1;
    }
};

/** @private */
const zeros = "00000000000000000000000000000000";

/**
 * Pad the str with zeros to the given length of digits.
 *
 * @static
 * @param {string|number} str the string or number to pad
 * @param {number} length the desired total length of the output string, padded
 * @param {boolean=} right if true, pad on the right side of the number rather than the left.
 * Default is false.
 */
export function pad(str, length, right) {
    if (typeof(str) !== 'string') {
        str = "" + str;
    }
    var start = 0;
    // take care of negative numbers
    if (str.charAt(0) === '-') {
        start++;
    }
    return (str.length >= length+start) ? str :
        (right ? str + zeros.substring(0,length-str.length+start) :
            str.substring(0, start) + zeros.substring(0,length-str.length+start) + str.substring(start));
};


/**
 * Convert a string into the hexadecimal representation
 * of the Unicode characters in that string.
 *
 * @static
 * @param {string} string The string to convert
 * @param {number=} limit the number of digits to use to represent the character (1 to 8)
 * @return {string} a hexadecimal representation of the
 * Unicode characters in the input string
 */
export function toHexString(string, limit) {
    var i,
        result = "",
        lim = (limit && limit < 9) ? limit : 4;

    if (!string) {
        return "";
    }
    for (i = 0; i < string.length; i++) {
        var ch = string.charCodeAt(i).toString(16);
        result += pad(ch, lim);
    }
    return result.toUpperCase();
};

/**
 * Test whether an object in a Javascript Date.
 *
 * @static
 * @param {Object|null|undefined} object The object to test
 * @return {boolean} return true if the object is a Date
 * and false otherwise
 */
export function isDate(object) {
    if (typeof(object) === 'object') {
        return Object.prototype.toString.call(object) === '[object Date]';
    }
    return false;
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
 * @static
 * @param {*} object1 the object to merge into
 * @param {*} object2 the object to merge
 * @param {boolean=} replace if true, replace the array elements in object1 with those in object2.
 * If false, concatenate array elements in object1 with items in object2.
 * @param {string=} name1 name of the object being merged into
 * @param {string=} name2 name of the object being merged in
 * @return {Object} the merged object
 */
export function merge(object1, object2, replace, name1, name2) {
    if (!object1 && object2) {
        return object2;
    }
    if (object1 && !object2) {
        return object1;
    }
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
                if (typeof(replace) !== 'boolean' || !replace) {
                    newObj[prop] = [].concat(object1[prop]);
                    newObj[prop] = newObj[prop].concat(object2[prop]);
                } else {
                    newObj[prop] = object2[prop];
                }
            } else if (typeof(object1[prop]) === 'object' && typeof(object2[prop]) === 'object') {
                newObj[prop] = merge(object1[prop], object2[prop], replace);
            } else {
                // for debugging. Used to determine whether or not json files are overriding their parents unnecessarily
                if (name1 && name2 && newObj[prop] == object2[prop]) {
                    logger.debug("Property " + prop + " in " + name1 + " is being overridden by the same value in " + name2);
                }
                newObj[prop] = object2[prop];
            }
        }
    }
    return newObj;
};

/**
 * Return true if the given object has no properties.<p>
 *
 *
 * @static
 * @param {Object} obj the object to check
 * @return {boolean} true if the given object has no properties, false otherwise
 */
export function isEmpty(obj) {
    var prop = undefined;

    if (!obj) {
        return true;
    }

    for (prop in obj) {
        if (prop && typeof(obj[prop]) !== 'undefined') {
            return false;
        }
    }
    return true;
};

/**
 * @static
 */
export function hashCode(obj) {
    var hash = 0;

    function addHash(hash, newValue) {
        // co-prime numbers creates a nicely distributed hash
        hash *= 65543;
        hash += newValue;
        hash %= 2147483647;
        return hash;
    }

    function stringHash(str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = addHash(hash, str.charCodeAt(i));
        }
        return hash;
    }

    switch (typeof(obj)) {
        case 'undefined':
            hash = 0;
            break;
        case 'string':
            hash = stringHash(obj);
            break;
        case 'function':
        case 'number':
        case 'xml':
            hash = stringHash(String(obj));
            break;
        case 'boolean':
            hash = obj ? 1 : 0;
            break;
        case 'object':
            var props = [];
            for (var p in obj) {
                if (obj.hasOwnProperty(p)) {
                    props.push(p);
                }
            }
            // make sure the order of the properties doesn't matter
            props.sort();
            for (var i = 0; i < props.length; i++) {
                hash = addHash(hash, stringHash(props[i]));
                hash = addHash(hash, hashCode(obj[props[i]]));
            }
            break;
    }

    return hash;
};

/**
 * Calls the given action function on each element in the given
 * array arr asynchronously and in order and finally call the given callback when they are
 * all done. The action function should take the array to
 * process as its parameter, and a callback function. It should
 * process the first element in the array and then call its callback
 * function with the result of processing that element (if any).
 *
 * @param {Array.<Object>} arr the array to process
 * @param {Function(Array.<Object>, Function(*))} action the action
 * to perform on each element of the array
 * @param {Function(*)} callback the callback function to call
 * with the results of processing each element of the array.
 */
export function callAll(arr, action, callback, results) {
    results = results || [];
    if (arr && arr.length) {
        action(arr, function(result) {
            results.push(result);
            callAll(arr.slice(1), action, callback, results);
        });
    } else {
        callback(results);
    }
};


/**
 * Extend object1 by mixing in everything from object2 into it. The objects
 * are deeply extended, meaning that this method recursively descends the
 * tree in the objects and mixes them in at each level. Arrays are extended
 * by concatenating the elements of object2 onto those of object1.
 *
 * @static
 * @param {Object} object1 the target object to extend
 * @param {Object=} object2 the object to mix in to object1
 * @return {Object} returns object1
 */
export function extend(object1, object2) {
    var prop = undefined;
    if (object2) {
        for (prop in object2) {
            // don't extend object with undefined or functions
            if (prop && typeof(object2[prop]) !== 'undefined' && typeof(object2[prop]) !== "function") {
                if (isArray(object1[prop]) && isArray(object2[prop])) {
                    logger.trace("Merging array prop " + prop);
                    object1[prop] = object1[prop].concat(object2[prop]);
                } else if (typeof(object1[prop]) === 'object' && typeof(object2[prop]) === 'object') {
                    logger.trace("Merging object prop " + prop);
                    if (prop !== "ilib") {
                        object1[prop] = extend(object1[prop], object2[prop]);
                    }
                } else {
                    logger.trace("Copying prop " + prop);
                    // for debugging. Used to determine whether or not json files are overriding their parents unnecessarily
                    object1[prop] = object2[prop];
                }
            }
        }
    }
    return object1;
};

export function extend2(object1, object2) {
    var prop = undefined;
    if (object2) {
        for (prop in object2) {
            // don't extend object with undefined or functions
            if (prop && typeof(object2[prop]) !== 'undefined') {
                if (isArray(object1[prop]) && isArray(object2[prop])) {
                    logger.trace("Merging array prop " + prop);
                    object1[prop] = object1[prop].concat(object2[prop]);
                } else if (typeof(object1[prop]) === 'object' && typeof(object2[prop]) === 'object') {
                    logger.trace("Merging object prop " + prop);
                    if (prop !== "ilib") {
                        object1[prop] = extend2(object1[prop], object2[prop]);
                    }
                } else {
                    logger.trace("Copying prop " + prop);
                    // for debugging. Used to determine whether or not json files are overriding their parents unnecessarily
                    object1[prop] = object2[prop];
                }
            }
        }
    }
    return object1;
};

/**
 * Convert a UCS-4 code point to a Javascript string. The codepoint can be any valid
 * UCS-4 Unicode character, including supplementary characters. Standard Javascript
 * only supports supplementary characters using the UTF-16 encoding, which has
 * values in the range 0x0000-0xFFFF. String.fromCharCode() will only
 * give you a string containing 16-bit characters, and will not properly convert
 * the code point for a supplementary character (which has a value > 0xFFFF) into
 * two UTF-16 surrogate characters. Instead, it will just just give you whatever
 * single character happens to be the same as your code point modulo 0x10000, which
 * is almost never what you want.<p>
 *
 * Similarly, that means if you use String.charCodeAt()
 * you will only retrieve a 16-bit value, which may possibly be a single
 * surrogate character that is part of a surrogate pair representing a character
 * in the supplementary plane. It will not give you a code point. Use
 * IString.codePointAt() to access code points in a string, or use
 * an iterator to walk through the code points in a string.
 *
 * @static
 * @param {number} codepoint UCS-4 code point to convert to a character
 * @return {string} a string containing the character represented by the codepoint
 */
export function fromCodePoint(codepoint) {
    if (codepoint < 0x10000) {
        return String.fromCharCode(codepoint);
    } else {
        var high = Math.floor(codepoint / 0x10000) - 1;
        var low = codepoint & 0xFFFF;

        return String.fromCharCode(0xD800 | ((high & 0x000F) << 6) |  ((low & 0xFC00) >> 10)) +
            String.fromCharCode(0xDC00 | (low & 0x3FF));
    }
};

/**
 * Convert the character or the surrogate pair at the given
 * index into the intrinsic Javascript string to a Unicode
 * UCS-4 code point.
 *
 * @static
 * @param {string} str string to get the code point from
 * @param {number} index index into the string
 * @return {number} code point of the character at the
 * given index into the string
 */
export function toCodePoint(str, index) {
    if (!str || str.length === 0) {
        return -1;
    }
    var code = -1, high = str.charCodeAt(index);
    if (high >= 0xD800 && high <= 0xDBFF) {
        if (str.length > index+1) {
            var low = str.charCodeAt(index+1);
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
