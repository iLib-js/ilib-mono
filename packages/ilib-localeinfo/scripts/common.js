/*
 * common.js - common routines for the loc info generator
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

export function getLocaleParts(spec) {
    var locale = new Locale(spec);
    return [
        locale.getLanguage(),
        locale.getScript(),
        locale.getRegion()
    ].filter((part) => {
        return part;
    });
}

/**
 * Set the value into the named property within the locale name within
 * the whole structure.
 *
 * @param {Object} root object that contains all the data
 * @param {Array.<string>} an array of locale parts
 * @param {string} property the name of the property to set the value into
 * @param {Object} value the value to set into that property
 */
export function setValue(root, names, property, value) {
    let target = root;
    // have to make sure that we put it in the "data" property of the target
    let full = names.concat(["data"]);
    for (let name of full) {
        if (!target[name]) {
            target[name] = {};
        }
        target = target[name];
    }
    target[property] = value;
}

/**
 * Get the value of the named property within the locale name within
 * the whole structure.
 *
 * @param {Object} root object that contains all the data
 * @param {Array.<string>} an array of locale parts
 * @param {string} property the name of the property to get
 * @returns {Object} the value in that property
 */
export function getValue(root, names, property) {
    let target = root;
    // have to make sure that we put it in the "data" property of the target
    let full = names.concat(["data"]);
    for (let name of full) {
        if (!target[name]) {
            return undefined;
        }
        target = target[name];
    }
    return target[property];
}
