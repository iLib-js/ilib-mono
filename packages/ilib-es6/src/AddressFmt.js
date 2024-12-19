/**
 * AddressFmt.js - ES6 wrappers around an ilib class
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

import promisify, { promisifyFunction } from './promisify.js';

import { default as ilibAddressFmt } from 'ilib/lib/AddressFmt.js';

function wrapGetFormatInfo(formatter) {
    if (!formatter) return;

    const oldGetFormatInfo = ilibAddressFmt.prototype.getFormatInfo.bind(formatter);
    formatter.getFormatInfo = (locale, sync, callback) => {
        if (typeof(sync) === "undefined" || sync) {
            return oldGetFormatInfo(locale, sync, callback);
        }

        return promisifyFunction((options = {}) => {
            const {locale, onLoad} = options;
            return oldGetFormatInfo(locale, false, onLoad);
        }, {
            locale: locale,
            sync: false,
            onLoad: callback
        });
    };

    return formatter;
}

export default class AddressFmt {
    constructor(options = {}) {
        return wrapGetFormatInfo(new ilibAddressFmt(options));
    }

    static create(options = {}) {
        return new Promise((resolve, reject) => {
            let tempOptions = Object.assign({}, options, {
                sync: false,
                onLoad: af => resolve(wrapGetFormatInfo(af))
            });
            new ilibAddressFmt(tempOptions);
        });
    }
};
