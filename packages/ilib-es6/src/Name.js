/**
 * Name.js - ES6 wrappers around an ilib class
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

import { default as ilibName } from 'ilib/lib/Name.js';

export default class Name {
    constructor(name, options = {}) {
        return new ilibName(name, options);
    }

    static create(name, options = {}) {
        return promisifyFunction((opts = {}) => {
            const { name } = opts;
            return new ilibName(name, opts);
        }, Object.assign({}, options, {
            name: name
        }));
    }
};
