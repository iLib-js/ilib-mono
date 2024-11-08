/*
 * index.js - export all the library code from one main file
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

import Resource from './Resource.js';
import ResourceString from './ResourceString.js';
import ResourceArray from './ResourceArray.js';
import ResourcePlural from './ResourcePlural.js';
import TranslationSet from './TranslationSet.js';
import ResourceXliff from './ResourceXliff.js';
import TranslationUnit from './TranslationUnit.js';
import TranslationVariant from './TranslationVariant.js';
import Location from './Location.js';
import {
    formatPath,
    parsePath,
    getLocaleFromPath,
    cleanString,
    isEmpty,
    makeDirs,
    containsActualText,
    objectMap,
    hashKey,
    nonBreakingTags,
    selfClosingTags,
    ignoreTags,
    localizableAttributes
} from './utils.js';

export {
    Resource,
    ResourceString,
    ResourceArray,
    ResourcePlural,
    TranslationSet,
    TranslationUnit,
    TranslationVariant,
    ResourceXliff,
    formatPath,
    parsePath,
    getLocaleFromPath,
    cleanString,
    isEmpty,
    makeDirs,
    containsActualText,
    objectMap,
    hashKey,
    nonBreakingTags,
    selfClosingTags,
    ignoreTags,
    localizableAttributes,
    Location
};