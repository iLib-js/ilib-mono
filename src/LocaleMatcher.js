/*
 * LocaleMatcher.js - Locale matcher definition
 *
 * Copyright © 2013-2015, 2018-2019, 2021-2022 JEDLSoft
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

// !data localematch

import { Utils } from 'ilib-common';
import Locale from 'ilib-locale';

import { matchdata } from './localematch.js';

const componentWeights = [
    0.5,   // language
    0.2,   // script
    0.25,  // region
    0.05   // variant
];

// these are languages where you have to put the script all the time,
// as none of the scripts are default for the language
const multiScriptLanguages = {
    "az": true,   // Azerbaijani
    "kk": true,   // Kazakh
    "ku": true,   // Kurdish
    "ky": true,   // Kyrgyz
    "pa": true,   // Panjabi
    "sr": true,   // Serbian
    "tg": true,   // Tajik
    "uz": true,   // Uzbek
    "zh": true    // Chinese
};

/**
 * @class Represent a locale matcher instance, which is used
 * to see which locales can be matched with each other in
 * various ways.
 */
class LocaleMatcher {
    /**
     * Create a new locale matcher instance. This is used
     * to see which locales can be matched with each other in
     * various ways.<p>
     *
     * The options object may contain any of the following properties:
     *
     * <ul>
     * <li><i>locale</i> - the locale instance or locale spec to match
     * </ul>
     *
     * @constructor
     * @param {Object} options parameters to initialize this matcher
     */
    constructor(options) {
        this.locale = new Locale();

        if (options && typeof(options.locale) !== 'undefined') {
            this.locale = (typeof(options.locale) === 'string') ? new Locale(options.locale) : options.locale;
        }
    }

    /**
     * Return the locale used to construct this instance.
     * @return {Locale|undefined} the locale for this matcher
     */
    getLocale() {
        return this.locale;
    }

    /**
     * Do the work
     * @private
     */
    _getLikelyLocale(locale) {
        // already full specified
        if (locale.language && locale.script && locale.region) return locale;

        if (typeof(matchdata.likelyLocales[locale.getSpec()]) === 'undefined') {
            // try various partials before giving up
            let partial = matchdata.likelyLocales[new Locale(locale.language, undefined, locale.region).getSpec()];
            if (typeof(partial) !== 'undefined') return new Locale(partial);

            partial = matchdata.likelyLocales[new Locale(locale.language, locale.script, undefined).getSpec()];
            if (typeof(partial) !== 'undefined') return new Locale(partial);

            partial = matchdata.likelyLocales[new Locale(locale.language, undefined, undefined).getSpec()];
            if (typeof(partial) !== 'undefined') return new Locale(partial);

            partial = matchdata.likelyLocales[new Locale(undefined, locale.script, locale.region).getSpec()];
            if (typeof(partial) !== 'undefined') return new Locale(partial);

            partial = matchdata.likelyLocales[new Locale(undefined, undefined, locale.region).getSpec()];
            if (typeof(partial) !== 'undefined') return new Locale(partial);

            partial = matchdata.likelyLocales[new Locale(undefined, locale.script, undefined).getSpec()];
            if (typeof(partial) !== 'undefined') return new Locale(partial);

            return locale;
        }

        return new Locale(matchdata.likelyLocales[locale.getSpec()]);
    }

    /**
     * Return an Locale instance that is fully specified based on partial information
     * given to the constructor of this locale matcher instance. For example, if the locale
     * spec given to this locale matcher instance is simply "ru" (for the Russian language),
     * then it will fill in the missing region and script tags and return a locale with
     * the specifier "ru-Cyrl-RU". (ie. Russian language, Cyrillic, Russian Federation).
     * Any one or two of the language, script, or region parts may be left unspecified,
     * and the other one or two parts will be filled in automatically. If this
     * class has no information about the given locale, then the locale of this
     * locale matcher instance is returned unchanged.
     *
     * @returns {Locale} the most likely completion of the partial locale given
     * to the constructor of this locale matcher instance
     */
    getLikelyLocale() {
        return this._getLikelyLocale(this.locale);
    }

    /**
     * Return an Locale instance that is specified based on partial information
     * given to the constructor of this locale matcher instance but which leaves out any
     * part of the locale specifier that is so common that it is understood. For example,
     * if the locale
     * spec given to this locale matcher instance is simply "ru" (for the Russian language),
     * then it will fill in the missing region and/or script tags and return a locale with
     * the specifier "ru-RU". (ie. Russian language, Russian Federation). Note that the
     * default script "Cyrl" is left out because the vast majority of text written in
     * Russian is written with the Cyrllic script, so that part of the locale is understood
     * and is commonly left out.<p>
     *
     * Any one or two of the language, script, or region parts may be left unspecified,
     * and the other one or two parts will be filled in automatically. If this
     * class has no information about the given locale, then the locale of this
     * locale matcher instance is returned unchanged.<p>
     *
     * This method returns the same information as getLikelyLocale but with the very common
     * parts left out.
     *
     * @returns {Locale} the most likely "minimal" completion of the partial locale given
     * to the constructor of this locale matcher instance where the commonly understood
     * parts are left out.
     */
    getLikelyLocaleMinimal() {
        const fullLocale = this._getLikelyLocale(this.locale);
        const langLocale = this._getLikelyLocale(new Locale(fullLocale.language));
        return fullLocale.script === langLocale.script && !multiScriptLanguages[fullLocale.language] ?
            new Locale(fullLocale.language, undefined, fullLocale.region) :
            fullLocale;
    }

    /**
     * Return the degree that the given locale matches the current locale of this
     * matcher. This method returns an integer from 0 to 100. A value of 100 is
     * a 100% match, meaning that the two locales are exactly equivalent to each
     * other. (eg. "ja-JP" and "ja-JP") A value of 0 means that there 0% match or
     * that the two locales have nothing in common. (eg. "en-US" and "ja-JP") <p>
     *
     * Locale matching is not the same as equivalence, as the degree of matching
     * is returned. (See Locale.equals for equivalence.)<p>
     *
     * The match score is calculated based on matching the 4 locale components,
     * weighted by importance:
     *
     * <ul>
     * <li> language - this accounts for 50% of the match score
     * <li> region - accounts for 25% of the match score
     * <li> script - accounts for 20% of the match score
     * <li> variant - accounts for 5% of the match score
     * </ul>
     *
     * The score is affected by the following things:
     *
     * <ul>
     * <li> A large language score is given when the language components of the locales
     * match exactly.
     * <li> Higher language scores are given when the languages are linguistically
     * close to each other, such as dialects.
     * <li> A small score is given when two languages are in the same
     * linguistic family, but one is not a dialect of the other, such as German
     * and Dutch.
     * <li> A large region score is given when two locales share the same region.
     * <li> A smaller region score is given when one region is contained within
     * another. For example, Hong Kong is part of China, so a moderate score is
     * given instead of a full score.
     * <li> A small score is given if two regions are geographically close to
     * each other or are tied by history. For example, Ireland and Great Britain
     * are both adjacent and tied by history, so they receive a moderate score.
     * <li> A high script score is given if the two locales share the same script.
     * The legibility of a common script means that there is some small kinship of the
     * different languages.
     * <li> A high variant score is given if the two locales share the same
     * variant. Full score is given when both locales have no variant at all.
     * <li> Locale components that are unspecified in both locales are given high
     * scores.
     * <li> Locales where a particular locale component is missing in only one
     * locale can still match when the default for that locale component matches
     * the component in the other locale. The
     * default value for the missing component is determined using the likely locales
     * data. (See getLikelyLocale()) For example, "en-US" and "en-Latn-US" receive
     * a high script score because the default script for "en" is "Latn".
     * </ul>
     *
     * The intention of this method is that it can be used to determine
     * compatibility of locales. For example, when a user signs up for an
     * account on a web site, the locales that the web site supports and
     * the locale of the user's browser may differ, and the site needs to
     * pick the best locale to show the user. Let's say the
     * web site supports a selection of European languages such as "it-IT",
     * "fr-FR", "de-DE", and "en-GB". The user's
     * browser may be set to "it-CH". The web site code can then match "it-CH"
     * against each of the supported locales to find the one with the
     * highest score. In
     * this case, the best match would be "it-IT" because it shares a
     * language and script in common with "it-CH" and differs only in the region
     * component. It is not a 100% match, but it is pretty good. The web site
     * may decide if the match scores all fall
     * below a chosen threshold (perhaps 50%?), it should show the user the
     * default language "en-GB", because that is probably a better choice
     * than any other supported locale.<p>
     *
     * @param {Locale} locale the other locale to match against the current one
     * @return {number} an integer from 0 to 100 that indicates the degree to
     * which these locales match each other
     */
    match(locale) {
        const other = new Locale(locale);
        let scores = [0, 0, 0, 0];
        let thisfull, otherfull, i;

        if (this.locale.language === other.language) {
            scores[0] = 100;
        } else {
            if (!this.locale.language || !other.language) {
                // check for default language
                thisfull = this.getLikelyLocale();
                otherfull = new Locale(matchdata.likelyLocales[other.getSpec()] || other.getSpec());
                if (thisfull.language === otherfull.language) {
                    scores[0] = 100;
                }
            } else {
                // check for macro languages
                const mlthis = matchdata.macroLanguagesReverse[this.locale.language] || this.locale.language;
                const mlother = matchdata.macroLanguagesReverse[other.language] || other.language;
                if (mlthis === mlother) {
                    scores[0] = 90;
                } else {
                    // check for mutual intelligibility
                    const pair = this.locale.language + "-" + other.language;
                    scores[0] = matchdata.mutualIntelligibility[pair] || 0;
                }
            }
        }

        if (this.locale.script === other.script) {
            scores[1] = 100;
        } else {
            if (!this.locale.script || !other.script) {
                // check for default script
                thisfull = this.locale.script ? this.locale : new Locale(matchdata.likelyLocales[this.locale.language]);
                otherfull = other.script ? other : new Locale(matchdata.likelyLocales[other.language]);
                if (thisfull.script === otherfull.script) {
                    scores[1] = 100;
                }
            }
        }

        if (this.locale.region === other.region) {
            scores[2] = 100;
        } else {
            if (!this.locale.region || !other.region) {
                // check for default region
                thisfull = this.getLikelyLocale();
                otherfull = new Locale(matchdata.likelyLocales[other.getSpec()] || other.getSpec());
                if (thisfull.region === otherfull.region) {
                    scores[2] = 100;
                }
            } else {
                // check for containment
                const containers = matchdata.territoryContainmentReverse[this.locale.region] || [];
                // end at length-1 because the end is "001" which is "the whole world" -- which is not useful
                for (i = 0; i < containers.length-1; i++) {
                    const container = matchdata.territoryContainment[containers[i]];
                    if (container && container.indexOf(other.region) > -1) {
                        // same area only accounts for 20% of the region score
                        scores[2] = ((i+1) * 100 / containers.length) * 0.2;
                        break;
                    }
                }
            }
        }

        if (this.locale.variant === other.variant) {
            scores[3] = 100;
        }

        let total = 0;

        for (i = 0; i < 4; i++) {
            total += scores[i] * componentWeights[i];
        }

        return Math.round(total);
    }

    /**
     * Return the macrolanguage associated with this locale. If the
     * locale's language is not part of a macro-language, then the
     * locale's language is returned as-is.
     *
     * @returns {string} the ISO code for the macrolanguage associated
     * with this locale, or language of the locale
     */
    getMacroLanguage() {
        return matchdata.macroLanguagesReverse[this.locale.language] || this.locale.language;
    }

    /**
     * Return the containment array for the given region code.
     * @private
     */
    _getRegionContainment(region) {
        return matchdata.territoryContainmentReverse[region] || [];
    }

    /**
     * Return the list of regions that this locale is contained within. Regions are
     * nested, so locales can be in multiple regions. (eg. US is in Northern North
     * America, North America, the Americas, the World.) Most regions are specified
     * using UN.49 region numbers, though some, like "EU", are letters. If the
     * locale is underspecified, this method will use the most likely locale method
     * to get the region first. For example, the locale "ja" (Japanese) is most
     * likely "ja-JP" (Japanese for Japan), and the region containment info for Japan
     * is returned.
     *
     * @returns {Array.<string>} an array of region specifiers that this locale is within
     */
    getRegionContainment() {
        const region = this.locale.region || this.getLikelyLocale().region;
        return this._getRegionContainment(region);
    }

    /**
     * Find the smallest region that contains both the current locale and the other locale.
     * If the current or other locales are underspecified, this method will use the most
     * likely locale method
     * to get their regions first. For example, the locale "ja" (Japanese) is most
     * likely "ja-JP" (Japanese for Japan), and the region containment info for Japan
     * is checked against the other locale's region containment info.
     *
     * @param {string|Locale} otherLocale a locale specifier or a Locale instance to
     * compare against
     * @returns {string} the region specifier of the smallest region containing both the
     * current locale and other locale
     */
    smallestCommonRegion(otherLocale) {
        if (typeof(otherLocale) === "undefined") return "001";

        const thisRegion = this.locale.region || this.getLikelyLocale().region;
        const otherLoc = typeof(otherLocale) === "string" ? new Locale(otherLocale) : otherLocale;
        const otherRegion = this._getLikelyLocale(otherLoc).region;

        const thisRegions = this._getRegionContainment(thisRegion);
        const otherRegions = this._getRegionContainment(otherRegion);

        for (let i = 0; i < thisRegions.length; i++) {
            if (otherRegions.indexOf(thisRegions[i]) > -1) {
                return thisRegions[i];
            }
        }

        // this default should never be reached because the world should be common to all regions
        return "001";
    }
};

export default LocaleMatcher;
