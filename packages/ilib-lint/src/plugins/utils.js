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
* @returns {Object} the xliff version, style and sourceLocale.
*/
export function getXliffInfo(data) {
    const defaultInfo = {
        version: "1.2",
        style: "standard",
        sourceLocale: "en-US"
    };
    if (!data) return defaultInfo;

    try {
        const parsedData = xml2js(data);
        const root = parsedData?.elements?.find(el => el.name === "xliff");
        if (!root) return defaultInfo;

        const xmlVersion = root.attributes?.version || defaultInfo.version;

        // XLIFF 1.2: <file source-language="">
        const fileElem = root.elements?.find(el => el.name === "file");
        const sourceLanguage12 = fileElem?.attributes?.["source-language"];

        // XLIFF 2.0: <xliff srcLang="">
        const sourceLanguage20 = root.attributes?.srcLang;

        const sourceLocale = xmlVersion === "1.2" ? sourceLanguage12 : sourceLanguage20;

        // style
        const projectAttr = fileElem?.attributes?.["l:project"] || root.attributes?.["l:project"];
        const style = xmlVersion === "2.0" && !projectAttr ? "webOS" : "standard";

        return {
            version: xmlVersion,
            style,
            sourceLocale: sourceLocale || defaultInfo.sourceLocale
        };

    } catch (e) {
        return defaultInfo;
    }
}
