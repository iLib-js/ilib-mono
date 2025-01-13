/*
 * Locale.js - Locale specifier definition
 *
 * Copyright © 2012-2015,2018,2021-2022 JEDLSoft
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

// from http://en.wikipedia.org/wiki/ISO_3166-1
import { a2toa3regmap } from "./a2toa3regmap.js";
import { a1toa3langmap } from "./a1toa3langmap.js";

// the list below is originally from https://unicode.org/iso15924/iso15924-codes.html
import { iso15924 } from "./scripts.js";

import * as ilibEnv from "ilib-env";

/**
 * Check if an object is a member of the given array. If this javascript engine
 * support indexOf, it is used directly. Otherwise, this function implements it
 * itself. The idea is to make sure that you can use the quick indexOf if it is
 * available, but use a slower implementation in older engines as well.
 *
 * @private
 * @param {Array.<Object|string|number>} array array to search
 * @param {Object|string|number} obj object being sought. This should be of the same type as the
 * members of the array being searched. If not, this function will not return
 * any results.
 * @return {number} index of the object in the array, or -1 if it is not in the array.
 */
function indexOf(array, obj) {
    if (!array || !obj) {
        return -1;
    }
    if (typeof(array.indexOf) === 'function') {
        return array.indexOf(obj);
    } else {
        // polyfill
        for (let i = 0; i < array.length; i++) {
            if (array[i] === obj) {
                return i;
            }
        }
        return -1;
    }
};

/**
 * @class Represent a locale specifier instance.
 * Locales are specified either with a specifier string
 * that follows the BCP-47 convention (roughly: "language-region-script-variant") or
 * with 4 parameters that specify the language, region, variant, and script individually.
 */
class Locale {
    /**
     * Create a new locale instance. Locales are specified either with a specifier string
     * that follows the BCP-47 convention (roughly: "language-region-script-variant") or
     * with 4 parameters that specify the language, region, variant, and script individually.<p>
     *
     * The language is given as an ISO 639-1 two-letter, lower-case language code. You
     * can find a full list of these codes at
     * <a href="http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes">http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes</a><p>
     *
     * The region is given as an ISO 3166-1 two-letter, upper-case region code. You can
     * find a full list of these codes at
     * <a href="http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2">http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2</a>.<p>
     *
     * The variant is any string that does not contain a dash which further differentiates
     * locales from each other.<p>
     *
     * The script is given as the ISO 15924 four-letter script code. In some locales,
     * text may be validly written in more than one script. For example, Serbian is often
     * written in both Latin and Cyrillic, though not usually mixed together. You can find a
     * full list of these codes at
     * <a href="http://en.wikipedia.org/wiki/ISO_15924#List_of_codes">http://en.wikipedia.org/wiki/ISO_15924#List_of_codes</a>.<p>
     *
     * As an example in ilib, the script can be used in the date formatter. Dates formatted
     * in Serbian could have day-of-week names or month names written in the Latin
     * or Cyrillic script. Often one script is default such that sr-SR-Latn is the same
     * as sr-SR so the script code "Latn" can be left off of the locale spec.<p>
     *
     * Each part is optional, and an empty string in the specifier before or after a
     * dash or as a parameter to the constructor denotes an unspecified value. In this
     * case, many of the ilib functions will treat the locale as generic. For example
     * the locale "en-" is equivalent to "en" and to "en--" and denotes a locale
     * of "English" with an unspecified region and variant, which typically matches
     * any region or variant.<p>
     *
     * Without any arguments to the constructor, this function returns the locale of
     * the host Javascript engine.<p>
     *
     *
     * @constructor
     * @param {?string|Locale=} language the ISO 639 2-letter code for the language, or a full
     * locale spec in BCP-47 format, or another Locale instance to copy from
     * @param {string=} region the ISO 3166 2-letter code for the region
     * @param {string=} variant the name of the variant of this locale, if any
     * @param {string=} script the ISO 15924 code of the script for this locale, if any
     */
    constructor(language, region, variant, script) {
        if (typeof(region) === 'undefined' && typeof(variant) === 'undefined' && typeof(script) === 'undefined') {
            let spec = language || ilibEnv.getLocale();
            if (typeof(spec) === 'string') {
                const parts = spec.split(/[-_]/g);
                for (let i = 0; i < parts.length; i++ ) {
                    if (Locale._isLanguageCode(parts[i])) {
                        /**
                         * @private
                         * @type {string|undefined}
                         */
                        this.language = parts[i];
                    } else if (Locale._isRegionCode(parts[i])) {
                        /**
                         * @private
                         * @type {string|undefined}
                         */
                        this.region = parts[i];
                    } else if (Locale._isScriptCode(parts[i])) {
                        /**
                         * @private
                         * @type {string|undefined}
                         */
                        this.script = parts[i];
                    } else {
                        /**
                         * @private
                         * @type {string|undefined}
                         */
                        this.variant = parts[i];
                    }
                }
                this.language = this.language || undefined;
                this.region = this.region || undefined;
                this.script = this.script || undefined;
                this.variant = this.variant || undefined;
            } else if (typeof(spec) === 'object') {
                this.language = spec.language || undefined;
                this.region = spec.region || undefined;
                this.script = spec.script || undefined;
                this.variant = spec.variant || undefined;
            }
        } else {
            if (language && typeof(language) === "string") {
                language = language.trim();
                this.language = language.length > 0 ? language.toLowerCase() : undefined;
            } else {
                this.language = undefined;
            }
            if (region && typeof(region) === "string") {
                region = region.trim();
                this.region = region.length > 0 ? region.toUpperCase() : undefined;
            } else {
                this.region = undefined;
            }
            if (variant && typeof(variant) === "string") {
                variant = variant.trim();
                this.variant = variant.length > 0 ? variant : undefined;
            } else {
                this.variant = undefined;
            }
            if (script && typeof(script) === "string") {
                script = script.trim();
                this.script = script.length > 0 ? script : undefined;
            } else {
                this.script = undefined;
            }
        }
        this._genSpec();
    }

    /**
     * @private
     */
    _genSpec() {
        this.spec = [this.language, this.script, this.region, this.variant].filter(part => part).join("-");
    }

    /**
     * Return the ISO 639 language code for this locale.
     * @return {string|undefined} the language code for this locale
     */
    getLanguage() {
        return this.language;
    }

    /**
     * Return the language of this locale as an ISO-639-alpha3 language code
     * @return {string|undefined} the alpha3 language code of this locale
     */
    getLanguageAlpha3() {
        return Locale.languageAlpha1ToAlpha3(this.language);
    }

    /**
     * Return the ISO 3166 region code for this locale.
     * @return {string|undefined} the region code of this locale
     */
    getRegion() {
        return this.region;
    }

    /**
     * Return the region of this locale as an ISO-3166-alpha3 region code
     * @return {string|undefined} the alpha3 region code of this locale
     */
    getRegionAlpha3() {
        return Locale.regionAlpha2ToAlpha3(this.region);
    }

    /**
     * Return the ISO 15924 script code for this locale
     * @return {string|undefined} the script code of this locale
     */
    getScript() {
        return this.script;
    }

    /**
     * Return the variant code for this locale
     * @return {string|undefined} the variant code of this locale, if any
     */
    getVariant() {
        return this.variant;
    }

    /**
     * Return the whole locale specifier as a string.
     * @return {string} the locale specifier
     */
    getSpec() {
        if (!this.spec) this._genSpec();
        return this.spec;
    }

    /**
     * Return the language locale specifier. This includes the
     * language and the script if it is available. This can be
     * used to see whether the written language of two locales
     * match each other regardless of the region or variant.
     *
     * @return {string} the language locale specifier
     */
    getLangSpec() {
        var spec = this.language;
        if (spec && this.script) {
            spec += "-" + this.script;
        }
        return spec || "";
    }

    /**
     * Express this locale object as a string. Currently, this simply calls the getSpec
     * function to represent the locale as its specifier.
     *
     * @return {string} the locale specifier
     */
    toString() {
        return this.getSpec();
    }

    /**
     * Return true if the the other locale is exactly equal to the current one.
     * @return {boolean} whether or not the other locale is equal to the current one
     */
    equals(other) {
        return this.language === other.language &&
            this.region === other.region &&
            this.script === other.script &&
            this.variant === other.variant;
    }

    /**
     * Return true if the current locale uses a valid ISO codes for each component
     * of the locale that exists.
     * @return {boolean} true if the current locale has all valid components, and
     * false otherwise.
     */
    isValid() {
        if (!this.language && !this.script && !this.region) return false;

        return !!((!this.language || (Locale._isLanguageCode(this.language) && Locale.a1toa3langmap[this.language])) &&
            (!this.script || (Locale._isScriptCode(this.script) && Locale.iso15924.indexOf(this.script) > -1)) &&
            (!this.region || (Locale._isRegionCode(this.region) && Locale.a2toa3regmap[this.region])));
    }
};

// from http://en.wikipedia.org/wiki/ISO_3166-1
Locale.a2toa3regmap = a2toa3regmap;
Locale.a1toa3langmap = a1toa3langmap;

// the list below is originally from https://unicode.org/iso15924/iso15924-codes.html
Locale.iso15924 = iso15924.scripts;

/**
 * Tell whether or not the str does not start with a lower case ASCII char.
 * @private
 * @param {string} str the char to check
 * @return {boolean} true if the char is not a lower case ASCII char
 */
Locale._notLower = function(str) {
    // do this with ASCII only so we don't have to depend on the CType functions
    const ch = str.charCodeAt(0);
    return ch < 97 || ch > 122;
};

/**
 * Tell whether or not the str does not start with an upper case ASCII char.
 * @private
 * @param {string} str the char to check
 * @return {boolean} true if the char is a not an upper case ASCII char
 */
Locale._notUpper = function(str) {
    // do this with ASCII only so we don't have to depend on the CType functions
    const ch = str.charCodeAt(0);
    return ch < 65 || ch > 90;
};

/**
 * Tell whether or not the str does not start with a digit char.
 * @private
 * @param {string} str the char to check
 * @return {boolean} true if the char is a not an upper case ASCII char
 */
Locale._notDigit = function(str) {
    // do this with ASCII only so we don't have to depend on the CType functions
    const ch = str.charCodeAt(0);
    return ch < 48 || ch > 57;
};

/**
 * Tell whether or not the given string has the correct syntax to be
 * an ISO 639 language code.
 *
 * @private
 * @param {string} str the string to parse
 * @return {boolean} true if the string could syntactically be a language code.
 */
Locale._isLanguageCode = function(str) {
    if (typeof(str) === 'undefined' || str.length < 2 || str.length > 3) {
        return false;
    }

    for (let i = 0; i < str.length; i++) {
        if (Locale._notLower(str.charAt(i))) {
            return false;
        }
    }

    return true;
};

/**
 * Tell whether or not the given string has the correct syntax to be
 * an ISO 3166 2-letter region code or M.49 3-digit region code.
 *
 * @private
 * @param {string} str the string to parse
 * @return {boolean} true if the string could syntactically be a language code.
 */
Locale._isRegionCode = function (str) {
     let i;

    if (typeof(str) === 'undefined' || str.length < 2 || str.length > 3) {
        return false;
    }

    if (str.length === 2) {
        for (i = 0; i < str.length; i++) {
            if (Locale._notUpper(str.charAt(i))) {
                return false;
            }
        }
    } else {
        for (i = 0; i < str.length; i++) {
            if (Locale._notDigit(str.charAt(i))) {
                return false;
            }
        }
    }

    return true;
};

/**
 * Tell whether or not the given string has the correct syntax to be
 * an ISO 639 language code.
 *
 * @private
 * @param {string} str the string to parse
 * @return {boolean} true if the string could syntactically be a language code.
 */
Locale._isScriptCode = function(str) {
    if (typeof(str) === 'undefined' || str.length !== 4 || Locale._notUpper(str.charAt(0))) {
        return false;
    }

    for (let i = 1; i < 4; i++) {
        if (Locale._notLower(str.charAt(i))) {
            return false;
        }
    }

    return true;
};

/**
 * Return the ISO-3166 alpha3 equivalent region code for the given ISO 3166 alpha2
 * region code. If the given alpha2 code is not found, this function returns its
 * argument unchanged.
 * @static
 * @param {string|undefined} alpha2 the alpha2 code to map
 * @return {string|undefined} the alpha3 equivalent of the given alpha2 code, or the alpha2
 * parameter if the alpha2 value is not found
 */
Locale.regionAlpha2ToAlpha3 = function(alpha2) {
    return Locale.a2toa3regmap[alpha2] || alpha2;
};

/**
 * Return the ISO-639 alpha3 equivalent language code for the given ISO 639 alpha1
 * language code. If the given alpha1 code is not found, this function returns its
 * argument unchanged.
 * @static
 * @param {string|undefined} alpha1 the alpha1 code to map
 * @return {string|undefined} the alpha3 equivalent of the given alpha1 code, or the alpha1
 * parameter if the alpha1 value is not found
 */
Locale.languageAlpha1ToAlpha3 = function(alpha1) {
    return Locale.a1toa3langmap[alpha1] || alpha1;
};


export default Locale;
