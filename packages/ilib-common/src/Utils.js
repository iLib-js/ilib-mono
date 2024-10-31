/*
 * Utils.js - Core utility routines
 *
 * Copyright © 2012-2015, 2018-2019, 2021-2022 JEDLSoft
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

import Locale from 'ilib-locale';
import Path from './Path.js';

/**
 * @module Utils
 */

/**
 * Return an array of locales that represent the sublocales of
 * the given locale. These sublocales are intended to be used
 * to load locale data. Each sublocale might be represented
 * separately by files on disk in order to share them with other
 * locales that have the same sublocales. The sublocales are
 * given in the order that they should be loaded, which is
 * least specific to most specific.<p>
 *
 * For example, the locale "en-US" would have the sublocales
 * "root", "en", "und-US", and "en-US".<p>
 *
 * <h4>Variations</h4>
 *
 * With only language and region specified, the following
 * sequence of sublocales will be generated:<p>
 *
 * <pre>
 * root
 * language
 * und-region
 * language-region
 * </pre>
 *
 * With only language and script specified:<p>
 *
 * <pre>
 * root
 * language
 * language-script
 * </pre>
 *
 * With only script and region specified:<p>
 *
 * <pre>
 * root
 * und-region
 * </pre>
 *
 * With only region and variant specified:<p>
 *
 * <pre>
 * root
 * und-region
 * region-variant
 * </pre>
 *
 * With only language, script, and region specified:<p>
 *
 * <pre>
 * root
 * language
 * und-region
 * language-script
 * language-region
 * language-script-region
 * </pre>
 *
 * With only language, region, and variant specified:<p>
 *
 * <pre>
 * root
 * language
 * und-region
 * language-region
 * und-region-variant
 * language-region-variant
 * </pre>
 *
 * With all parts specified:<p>
 *
 * <pre>
 * root
 * language
 * und-region
 * language-script
 * language-region
 * und-region-variant
 * language-script-region
 * language-region-variant
 * language-script-region-variant
 * </pre>
 *
 * @param {Locale|String} locale the locale to find the sublocales for
 * @return {Array.<string>} An array of locale specifiers that
 * are the sublocales of the given on
 */
export function getSublocales(locale) {
    var ret = ["root"];
    var loc = typeof(locale) === "string" ? new Locale(locale) : locale;
    var lang = loc.getLanguage();
    var region = loc.getRegion();
    var script = loc.getScript();
    var variant = loc.getVariant();

    if (lang) {
        ret.push(lang);
    }
    if (region) {
        ret.push('und-' + region);
    }

    if (lang) {
        if (script) {
            ret.push(lang + '-' + script);
        }
        if (region) {
            ret.push(lang + '-' + region);
        }
        if (variant) {
            ret.push(lang + '-' + variant);
        }
    }

    if (region && variant) {
        ret.push("und-" + region + '-' + variant);
    }

    if (lang) {
        if (script && region) {
            ret.push(lang + '-' + script + '-' + region);
        }
        if (script && variant) {
            ret.push(lang + '-' + script + '-' + variant);
        }
        if (region && variant) {
            ret.push(lang + '-' + region + '-' + variant);
        }
        if (script && region && variant) {
            ret.push(lang + '-' + script + '-' + region + '-' + variant);
        }
    }
    return ret;
};

/**
 * Return an array of relative path names for the
 * files that represent the data for the given locale.<p>
 *
 * Note that to prevent the situation where a directory for
 * a language exists next to the directory for a region where
 * the language code and region code differ only by case, the
 * plain region directories are located under the special
 * "undefined" language directory which has the ISO code "und".
 * The reason is that some platforms have case-insensitive
 * file systems, and you cannot have 2 directories with the
 * same name which only differ by case. For example, "es" is
 * the ISO 639 code for the language "Spanish" and "ES" is
 * the ISO 3166 code for the region "Spain", so both the
 * directories cannot exist underneath "locale". The region
 * therefore will be loaded from "und/ES" instead.<p>
 *
 * <h4>Variations</h4>
 *
 * With only language and region specified, the following
 * sequence of paths will be generated:<p>
 *
 * <pre>
 * language
 * und/region
 * language/region
 * </pre>
 *
 * With only language and script specified:<p>
 *
 * <pre>
 * language
 * language/script
 * </pre>
 *
 * With only script and region specified:<p>
 *
 * <pre>
 * und/region
 * </pre>
 *
 * With only region and variant specified:<p>
 *
 * <pre>
 * und/region
 * region/variant
 * </pre>
 *
 * With only language, script, and region specified:<p>
 *
 * <pre>
 * language
 * und/region
 * language/script
 * language/region
 * language/script/region
 * </pre>
 *
 * With only language, region, and variant specified:<p>
 *
 * <pre>
 * language
 * und/region
 * language/region
 * region/variant
 * language/region/variant
 * </pre>
 *
 * With all parts specified:<p>
 *
 * <pre>
 * language
 * und/region
 * language/script
 * language/region
 * region/variant
 * language/script/region
 * language/region/variant
 * language/script/region/variant
 * </pre>
 *
 * @static
 * @param {Locale} locale load the files for this locale
 * @param {string?} name the file name of each file to load without
 * any path
 * @return {Array.<string>} An array of relative path names
 * for the files that contain the locale data
 */
export function getLocFiles(locale, name) {
    var filename = name || "resources.json";
    var loc = locale || new Locale();

    return getSublocales(loc).map(function(l) {
        return (l === "root") ? filename : Path.join(l.replace(/-/g, "/"), filename);
    });
};
