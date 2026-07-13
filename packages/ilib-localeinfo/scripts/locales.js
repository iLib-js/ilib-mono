/*
 * locales.js - generate the locales data
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

import { setValue } from './common';

/**
 * Remove a locale if the only thing in the locale is the locale name.
 */
export function pruneLocales(root) {
    if (root.data && Object.keys(root.data).length === 1 && root.data.locale) {
        root.data = {};
    }
    for (let property in root) {
        if (property !== "data" && typeof(root[property]) === 'object') {
            pruneLocales(root[property]);
        }
    }
}

function addLocale(names, root) {
    if (names.length) {
        root.data.locale = names.join("-");
    }
    for (let property in root) {
        if (property !== "data" && typeof(root[property]) === 'object') {
            addLocale(names.concat([property]), root[property]);
        }
    }
}

export default function genLocales(root) {
    addLocale([], root);
};
