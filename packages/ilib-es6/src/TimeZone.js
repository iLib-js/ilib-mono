/**
 * TimeZone.js - ES6 wrappers around an ilib class
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

import promisify, {promisifyFunction} from './promisify.js';

import { default as ilibTimeZone } from 'ilib/lib/TimeZone.js';

const oldGetAvailableIds = ilibTimeZone.getAvailableIds;

ilibTimeZone.getAvailableIds = (country, sync, callback) => {
    if (typeof(sync) === "undefined" || sync) {
        return oldGetAvailableIds(country, sync, callback);
    }

    return promisifyFunction((options = {}) => {
        const {country, onLoad} = options;
        return oldGetAvailableIds(country, false, onLoad);
    }, {
        country: country,
        sync: false,
        onLoad: callback
    });
};

export default class TimeZone {
    constructor(options = {}) {
        return new ilibTimeZone(options);
    }

    static create(options = {}) {
        return promisify(ilibTimeZone, options);
    }

    static getAvailableIds(country, sync, callback) {
        if (typeof(sync) === "undefined" || sync) {
            return oldGetAvailableIds(country, sync, callback);
        }

        return promisifyFunction((options = {}) => {
            const {country, onLoad} = options;
            return oldGetAvailableIds(country, false, onLoad);
        }, {
            country: country,
            sync: false,
            onLoad: callback
        });
    };
};
