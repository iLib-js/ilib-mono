/*
 * TranslationUnit.js - model a translation unit
 *
 * Copyright © 2022-2025 JEDLSoft
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
     * a new, clean TranslationUnit instance.
     *
     * If the required properties are not given, the constructor throws an exception.<p>
     *
     * For newly extracted strings, there is no target text yet. There must be a target
     * locale for the translators to use when creating new target text, however. This
     * means that there may be multiple translation units in a file with the same
     * source locale and no target text, but different target locales.
     *
     * @constructor
     * @param {Object} options options to initialize the unit, or undefined for a new empty unit
     * @param {string} options.source source text for this unit
     * @param {string} options.sourceLocale the source locale spec for this unit
     * @param {string} options.key the unique resource key for this translation unit
     * @param {string} options.file path to the original source code file that contains the
     * source text of this translation unit
     * @param {string} [options.target] target text for this unit
     * @param {string} [options.targetLocale] the target locale spec for this unit
     * @param {string} [options.project] the project that this string/unit is part of
     * @param {string} [options.resType] type of this resource (string, array, plural)
     * @param {string} [options.state] the state of the current unit
     * @param {string} [options.comment] the translator's comment for this unit
     * @param {string} [options.datatype] the source of the data of this unit
     * @param {string} [options.flavor] the flavor that this string comes from
     * @param {boolean} [options.translate] flag that tells whether to translate this unit
     * @param {Object} [options.location] the line and character location of the start of this
     * translation unit in the xml representation of the file
     * @param {Object} [options.extended] extended properties for this unit. This is an object that
     * can contain any additional properties that are not explicitly defined in
     * this class. This is useful for storing additional metadata about the
     * translation unit that may be specific to a particular application or
     * use case.
     * @param {string} [options.resfile] the resource file that this unit came from. The file
     * property is the path to the file in the source code where the
     * resource was originally extracted from before it was put in the resource
     * file, and this property is the path to the resource file that contains this
     * translation unit. This is always the same as the xliff file that is currently
     * being processed. The resfile property is only set when the xliff file is
     * created from parsing a resource file. It is undefined when the xliff file is
     * created from parsing a string or when the xliff is new and being created
     * from scratch.
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
