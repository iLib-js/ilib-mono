/**
 * PhoneNumber.js - ES6 wrappers around an ilib class
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

import { default as ilibPhoneNumber } from 'ilib/lib/PhoneNumber.js';

function wrapNormalize(phoneNumber) {
    if (!phoneNumber) return;

    const oldNormalize = ilibPhoneNumber.prototype.normalize.bind(phoneNumber);
    phoneNumber.normalize = (options = {}) => {
        const { sync } = options;
        if (typeof(sync) === "undefined" || sync) {
            return oldNormalize(options);
        }

        return promisifyFunction((opts = {}) => {
            return oldNormalize(opts);
        }, options);
    };

    return phoneNumber;
}

export default class PhoneNumber {
    constructor(phoneNumber, options = {}) {
        return wrapNormalize(new ilibPhoneNumber(phoneNumber, options));
    }

    static create(phoneNumber, options = {}) {
        return promisifyFunction((opts = {}) => {
            const { phoneNumber } = opts;
            return wrapNormalize(new ilibPhoneNumber(phoneNumber, opts));
        }, Object.assign({}, options, {
            phoneNumber: phoneNumber
        }));
    }

    static parseImsi(imsi, options = {}) {
        const { sync } = options;
        if (typeof(sync) === "undefined" || sync) {
            return ilibPhoneNumber.parseImsi(imsi, options);
        }

        return promisifyFunction((opts = {}) => {
            return ilibPhoneNumber.parseImsi(imsi, opts);
        }, options);
    }
};
