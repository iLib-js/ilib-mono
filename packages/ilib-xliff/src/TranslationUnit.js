/*
 * TranslationUnit.js - model a translation unit
 *
 * Copyright © 2022-2023 JEDLSoft
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

/**
 * @class A class that represents an translation unit in an
 * xliff file. 
 */
class TranslationUnit {
    /**
     * Construct a new translation unit The options may be undefined, which represents
     * a new, clean TranslationUnit instance. The options object may also
     * be an object with the following properties:
     *
     * <ul>
     * <li><i>source</i> - source text for this unit (required)
     * <li><i>sourceLocale</i> - the source locale spec for this unit (required)
     * <li><i>target</i> - target text for this unit (optional)
     * <li><i>targetLocale</i> - the target locale spec for this unit (optional)
     * <li><i>key</i> - the unique resource key for this translation unit (required)
     * <li><i>file</i> - path to the original source code file that contains the
     * source text of this translation unit (required)
     * <li><i>project</i> - the project that this string/unit is part of
     * <li><i>resType</i> - type of this resource (string, array, plural) (optional)
     * <li><i>state</i> - the state of the current unit (optional)
     * <li><i>comment</i> - the translator's comment for this unit (optional)
     * <li><i>datatype</i> - the source of the data of this unit (optional)
     * <li><i>flavor</i> - the flavor that this string comes from (optional)
     * <li><i>translate</i> - flag that tells whether to translate this unit (optional)
     * <li><i>location</i> - the line and character location of the start of this
     * translation unit in the xml representation of the file
     * </ul>
     *
     * If the required properties are not given, the constructor throws an exception.<p>
     *
     * For newly extracted strings, there is no target text yet. There must be a target
     * locale for the translators to use when creating new target text, however. This
     * means that there may be multiple translation units in a file with the same
     * source locale and no target text, but different target locales.
     *
     * @constructor
     * @param {Object|undefined} options options to
     * initialize the unit, or undefined for a new empty unit
     */
    constructor(options) {
        if (options) {
            const everything = ["source", "sourceLocale", "key", "file", "project"].every((p) => {
                return typeof(options[p]) !== "undefined";
            });

            if (!everything) {
                const missing = ["source", "sourceLocale", "key", "file", "project"].filter((p) => {
                    return typeof(options[p]) === "undefined";
                });
                throw new Error(`Missing required parameters in the TranslationUnit constructor: ${missing.join(", ")}`);
            }

            for (let p in options) {
                this[p] = options[p];
            }
        }
    }

    /**
     * Clone the current unit and return the clone.
     * @returns {TranslationUnit} a clone of the current unit.
     */
    clone() {
        return new TranslationUnit(this);
    }
}

export default TranslationUnit;
