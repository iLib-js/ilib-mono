/**
 * IString.js - ES6 wrappers around an ilib class
 *
 * @license
 * Copyright © 2018, 2022, 2024 JEDLSoft
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

import { promisifyFunction } from './promisify.js';

import { default as ilibIString } from 'ilib/lib/IString.js';

function wrapSetLocale(str) {
    if (!str) return;

    const oldSetLocale = ilibIString.prototype.setLocale.bind(str);
    str.setLocale = (locale, sync, loadParams, onLoad) => {
        if (typeof(sync) === "undefined" || sync) {
            return oldSetLocale(locale, sync, loadParams, onLoad);
        }

        return promisifyFunction((opts = {}) => {
            const { locale, sync, loadParams, onLoad } = opts;
            return oldSetLocale(locale, sync, loadParams, onLoad);
        }, {
            locale,
            sync: false,
            loadParams,
            onLoad
        });
    };

    return str;
}

export default class IString {
    constructor(str) {
        return wrapSetLocale(new ilibIString(str));
    }

    static loadPlurals(sync, locale, loadParams, onLoad) {
        if (typeof(sync) === "undefined" || sync) {
            return ilibIString.loadPlurals(sync, locale, loadParams, onLoad);
        }

        return promisifyFunction((options = {}) => {
            const {locale, loadParams, onLoad} = options;
            return ilibIString.loadPlurals(false, locale, loadParams, onLoad);
        }, {
            loadParams,
            locale,
            sync: false,
            onLoad
        });
    }
    
    static fromCodePoint(codepoint) {
        return ilibIString.fromCodePoint(codepoint);
    }
    
    static toCodePoint(str, index) {
        return ilibIString.toCodePoint(str, index);
    }
};
