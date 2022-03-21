/*
 * index.js - utilities to load ilib locale data
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

import log4js from '@log4js-node/log4js-api';

import LocaleData from './LocaleData';

// the singletons
const locData = {
};

/**
 * Return the locale data singleton for the package that needs data.
 *
 * @param {string} pkg name of the package that needs a locale
 * data object.
 * @param {Object} params
 * @returns {LocaleData|undefined} a locale data instance you can use
 * to load locale data, or undefined if it could not be created
 * or if the package name was not specified
 */
function getLocaleData(pkg, params) {
    if (typeof(pkg) !== 'string' || !pkg) return undefined;
    if (!locData[pkg]) {
        locData[pkg] = new LocaleData(pkg, params);
    }
    return locData[pkg];
}

export * from './LocaleData';
export default getLocaleData;
