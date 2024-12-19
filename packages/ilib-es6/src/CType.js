/**
 * CType.js - ES6 wrappers around an ilib class
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

import { default as ilibCType } from 'ilib/lib/CType.js';

function CType(ch) {
    return ilibCType(ch);
};

CType._init = (sync, loadParams, onLoad) => {
    if (typeof(sync) === "undefined" || sync) {
        return ilibCType._init(sync, loadParams, onLoad);
    }

    return promisifyFunction((options = {}) => {
        const { sync, loadParams, onLoad } = options;
        return ilibCType._init(sync, loadParams, onLoad);
    }, {
        sync: sync,
        loadParams: loadParams,
        onLoad: onLoad
    });
};

CType._load = (name, sync, loadParams, onLoad) => {
    if (typeof(sync) === "undefined" || sync) {
        return ilibCType._load(name, sync, loadParams, onLoad);
    }

    return promisifyFunction((options = {}) => {
        const { name, sync, loadParams, onLoad } = options;
        return ilibCType._init(name, sync, loadParams, onLoad);
    }, {
        name: name,
        sync: sync,
        loadParams: loadParams,
        onLoad: onLoad
    });
};

CType.withinRange = ilibCType.withinRange;

export default CType;
