/*
 * TranslationUnit.js - model a translation unit in a translation file
 *
 * Copyright © 2023-2024 JEDLSoft
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
import log4js from "@log4js-node/log4js-api";

import TranslationVariant from './TranslationVariant.js';
import { hashKey } from './utils.js';

const logger = log4js.getLogger("tools-common.TranslationUnit");

/**
 * @class Represent a translation unit. A translation unit is
 * a segment in the source language, along with one or
 * more variants, which are translations to various
 * target languages. A translation unit may contain more
 * than one translation for a particular locale, as there
 * are sometimes more than one translation for a particular
 * phrase in the source language, depending on the context.
 */
class TranslationUnit {
    /**
     * Create a new translation unit.
     *
     * The options may be undefined, which represents
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
     * <li><i>location</i> - the location information where this string is encoded in the file
     * <li><i>translate</i> - flag that tells whether to translate this unit (optional)
     * </ul>
     *
     * If the required properties are not given, the constructor throws an exception.<p>
     *
     * For newly extracted strings, there is no target text yet. There must be a target
     * locale for the translators to use when creating new target text, however. This
     * means that there may be multiple translation units in a file with the same
     * source locale and no target text, but different target locales.
     *
     * @param {Object} options options for this unit
     */
    constructor(options) {
//        this.locale = options.locale;      -> sourceLocale
//        this.string = options.string;      -> source
//        this.datatype = options.datatype;  -> datatype

        this.variants = [];
        this.variantHash = {};
        this.properties = {};

        if (options) {
            const requiredFields = ["source", "sourceLocale"];
            const missing = requiredFields.filter(p => {
                if (typeof(options[p]) !== "undefined") {
                    this[p] = options[p];
                    return false;
                }
                return true;
            });
            // logger.trace("options is " + JSON.stringify(options));
            if (missing.length) {
                throw new Error("Missing required parameters in the TranslationUnit constructor: " + missing.join(", "));
            }

            const otherFields = ["key", "file", "project", "target", "targetLocale", "resType", "state", "comment", "datatype", "flavor", "location", "translate"];
            for (var p of otherFields) {
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

    /**
     * Return a unique hash key for this translation unit. The
     * hash key is calculated from the source string and locale
     * and does not depend on the properties or variants in
     * the unit.
     *
     * @returns {string} the unique hash key
     */
    hashKey() {
        return [hashKey(this.source), this.sourceLocale, this.datatype].join("_");
    }

    /**
     * Return the list of variants for this translation unit. If the locale
     * parameter is specified, only return the variants for the given locale.
     *
     * @param {String|undefined} locale the locale to find
     * @returns {Array.<TranslationVariant>} the variants for
     * this translation unit
     */
    getVariants(locale) {
        if (locale) {
            return this.variants.filter(variant => (variant.locale === locale));
        }
        return this.variants;
    }

    /**
     * Add a single variant to this translation unit. This variant
     * is only added if it is unique in this translation unit. That is,
     * No other variant exists in this unit with the same locale and
     * string.
     *
     * @param {TranslationVariant} variant the variant to add
     */
    addVariant(variant) {
        var key = variant.hashKey();
        if (!this.variantHash[key]) {
            this.variants.push(variant);
            this.variantHash[key] = variant;
        }
    }

    /**
     * Add an array of variants to this translation unit. This only
     * adds a variant if it is unique. That is, the unit is not
     * added if the locale and string are the same as an existing
     * variant.
     *
     * @param {Array.<TranslationVariant>} variants the array of variants to add
     */
    addVariants(variants) {
        variants.forEach(variant => {
            this.addVariant(variant);
        });
    }

    /**
     * Return the list of properties and their values for this translation unit.
     * @returns {Object} an object mapping properties to values
     */
    getProperties() {
        return this.properties;
    }

    /**
     * Add a property to this translation unit.
     * @param {Object} properties an object that maps properties to values
     */
    addProperties(properties) {
        for (let p in properties) {
            if (properties[p]) {
                this.properties[p] = properties[p];
            }
        }
    }
}

export default TranslationUnit;
