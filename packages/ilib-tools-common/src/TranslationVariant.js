/*
 * TranslationVariant.js - model a translation variant in a translation file
 *
 * Copyright © 2023 JEDLSoft
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

import { hashKey } from './utils.js';

/**
 * @class A class that represents a translation unit variant.
 */
class TranslationVariant {
    /**
     * Options may contain the following properties:
     * - locale: locale of the target string
     * - string: the translation for this locale
     *
     * @param {Object} options
     */
    constructor(options) {
        if (options) {
            this.locale = options.locale;
            this.string = options.string;
        }
    }

    /**
     * Return a unique hash key for this translation unit variant. The
     * hash key is calculated from the source string and locale.
     *
     * @returns {string} the unique hash key
     */
    hashKey() {
        return [hashKey(this.string), this.locale].join("_");
    }
}

export default TranslationVariant;