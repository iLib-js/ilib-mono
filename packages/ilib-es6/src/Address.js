/**
 * Address.js - ES6 wrappers around an ilib class
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

import { default as ilibAddress } from 'ilib/lib/Address.js';

export default class Address {
    constructor(address, options = {}) {
        return new ilibAddress(address, options);
    }

    static create(address, options = {}) {
        return promisifyFunction((opts = {}) => {
            const { address } = opts;
            return new ilibAddress(address, opts);
        }, Object.assign({}, options, {
            address: address,
            sync: false
        }));
    }
};
