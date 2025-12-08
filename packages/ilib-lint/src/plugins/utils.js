/*
 * utils.js - utility functions for the plugins
 *
 * Copyright © 2025 JEDLSoft
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

import { xml2js } from 'xml-js';

/**
* Extracts the XLIFF version from the provided data.
*
* @param {String} data The XML data as a string.
* @returns {Object} the xliff version and style.
*/
export function getXliffInfo(data) {
    const defaultInfo = {
        version: "1.2",
        style: "standard"
    };
    if (!data) return defaultInfo;

    try {
        const parsedData = xml2js(data);
        const xmlVersion = parsedData?.elements?.[0]?.attributes?.version;
        const projectAttr = parsedData?.elements?.[0]?.elements?.[0]?.attributes?.['l:project'];

        return {
            version: xmlVersion || defaultInfo.version,
            style: (!projectAttr && xmlVersion === "2.0") ? "webOS" : "standard"
        };
    } catch (e) {
        return defaultInfo;
    }
}