/*
 * LocaleInfo.js - Encode locale-specific defaults
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

// !data localeinfo

import Locale from 'ilib-locale';
import LocaleMatcher from 'ilib-localematcher';
import { Utils, Path } from 'ilib-common';
import { getPlatform } from 'ilib-env';
import getLocaleData, { LocaleData } from 'ilib-localedata';

const defaultInfo = {
    "calendar": "gregorian",
    "clock": "24",
    "currency": "USD",
    "delimiter": {
        "quotationStart": "“",
        "quotationEnd": "”",
        "alternateQuotationStart": "‘",
        "alternateQuotationEnd": "’"
    },
    "firstDayOfWeek": 1,
    "meridiems": "gregorian",
    "numfmt": {
        "script": "Latn",
        "decimalChar": ".",
        "groupChar": ",",
        "pctChar": "%",
        "exponential": "E",
        "prigroupSize": 3,
        "currencyFormats": {
            "common": "{s} {n}",
            "commonNegative": "-{s} {n}",
            "iso": "{s} {n}",
            "isoNegative": "({s} {n})"
        },
        "negativenumFmt": "-{n}",
        "pctFmt": "{n}%",
        "negativepctFmt": "-{n}%",
        "roundingMode": "halfdown",
        "secGroupSize": null,
        "useNative": false
    },
    "paperSizes": {
        "regular": "A4"
    },
    "timezone": "Etc/UTC",
    "units": "metric",
    "weekendEnd": 0,
    "weekendStart": 6
};

/**
 * @class
 * Create a new locale info instance. Locale info instances give information about
 * the default settings for a particular locale. These settings may be overridden
 * by various parts of the code, and should be used as a fall-back setting of last
 * resort. <p>
 *
 * The optional options object holds extra parameters if they are necessary. The
 * current list of supported options are:
 *
 * <ul>
 * <li><i>sync</i> - tell whether to load any missing locale data synchronously or
 * asynchronously. If this option is given as "false", then the "onLoad"
 * callback must be given, as the instance returned from this constructor will
 * not be usable for a while.
 * </ul>
 *
 * If this copy of ilib is pre-assembled and all the data is already available,
 * or if the data was already previously loaded, then this constructor will call
 * the onLoad callback immediately when the initialization is done.
 * If the onLoad option is not given, this class will only attempt to load any
 * missing locale data synchronously.
 *
 *
 * @constructor
 * @see {ilib.setLoaderCallback} for information about registering a loader callback
 * function
 * @param {Locale|string=} locale the locale for which the info is sought, or undefined for
 * @param {Object=} options the locale for which the info is sought, or undefined for
 * the current locale
 */
class LocaleInfo {
    /**
     * @class Create a new instance of LocaleInfo synchronously.<p>
     *
     * As with all ilib classes that support asynchronous operation, if the
     * platform does not support synchronous loading of locale data, then
     * this constructor can still succeed if the locale data has already been
     * loaded into memory. This can be accomplished by pre-loading the data
     * using `LocaleData.ensureLocale` or if another instance has already
     * loaded it asynchronous and the data is cached.
     *
     * @constructor
     * @param {string} locale
     * @param {Object} options
     */
    constructor(locale, options) {
        if (!options || !options._noinit) {
            this.init(locale, options, true);
        }
    }

    /**
     * Initialize this instance.
     * @private
     */
    init(locale, options, sync) {
        switch (typeof(locale)) {
            case "string":
                this.locale = new Locale(locale);
                break;
            default:
            case "undefined":
                this.locale = new Locale();
                break;
            case "object":
                this.locale = locale;
                break;
        }

        if (this.locale && this.locale.getSpec() !== "root" && !this.locale.getLanguage()) {
            this.locale = new Locale("und", this.locale.getRegion(), this.locale.getVariant(), this.locale.getScript());
        }

        const locData = getLocaleData({
            basename: "localeinfo",
            path: this.localeDir(),
            sync
        });

        if (sync) {
            this.info = locData.loadData({
                basename: "localeinfo",
                locale: this.locale,
                sync: sync
            }) || defaultInfo;
        } else {
            return locData.loadData({
                basename: "localeinfo",
                locale: this.locale,
                sync: sync
            }).then((info) => {
                this.info = info || defaultInfo;
                return this;
            });
        }
    }

    /**
     * Factory method to create a new instance of LocaleInfo asynchronously.
     * The parameters are the same as for the constructor, but it returns
     * a `Promise` instead of the instance directly.
     *
     * @param {string} locale the locale to get the info for
     * @param {Object} options the same objects you would send to a constructor
     * @returns {Promise} a promise to load a LocaleInfo instance. The resolved
     * value of the promise is the new instance of LocaleInfo,
     */
    static create(locale, options) {
        const li = new LocaleInfo(undefined, { ...options, _noinit: true });
        return li.init(locale, options, false);
    }


    localeDir() {
        switch (getPlatform()) {
            case "nodejs":
                return Path.join(Path.dirname((typeof(module) !== 'undefined') ? module.id : Path.fileUriToPath(import.meta.url)),
                    "../locale");

            case "browser":
                return "../assembled";

            default:
                return "../locale";
        }
    }

    /**
     * Return the name of the locale's language in English.
     * @returns {string} the name of the locale's language in English
     */
    getLanguageName() {
        return this.info["language.name"];
    }

    /**
     * Return the name of the locale's region in English. If the locale
     * has no region, this returns undefined.
     *
     * @returns {string|undefined} the name of the locale's region in English
     */
    getRegionName() {
        return this.info["region.name"];
    }

    /**
     * Return whether this locale commonly uses the 12- or the 24-hour clock.
     *
     * @returns {string} "12" if the locale commonly uses a 12-hour clock, or "24"
     * if the locale commonly uses a 24-hour clock.
     */
    getClock() {
        return this.info.clock;
    }

    /**
     * Return the locale that this info object was created with.
     * @returns {Locale} The locale spec of the locale used to construct this info instance
     */
    getLocale() {
        return this.locale;
    }

    /**
     * Return the name of the measuring system that is commonly used in the given locale.
     * Valid values are "uscustomary", "imperial", and "metric".
     *
     * @returns {string} The name of the measuring system commonly used in the locale
     */
    getUnits() {
        return this.info.units;
    }

    /**
     * Return the name of the calendar that is commonly used in the given locale.
     *
     * @returns {string} The name of the calendar commonly used in the locale
     */
    getCalendar() {
        return this.info.calendar;
    }

    /**
     * Return the day of week that starts weeks in the current locale. Days are still
     * numbered the standard way with 0 for Sunday through 6 for Saturday, but calendars
     * should be displayed and weeks calculated with the day of week returned from this
     * function as the first day of the week.
     *
     * @returns {number} the day of the week that starts weeks in the current locale.
     */
    getFirstDayOfWeek() {
        return this.info.firstDayOfWeek;
    }

    /**
     * Return the day of week that starts weekend in the current locale. Days are still
     * numbered the standard way with 0 for Sunday through 6 for Saturday.
     *
     * @returns {number} the day of the week that starts weeks in the current locale.
     */
    getWeekEndStart() {
        return this.info.weekendStart;
    }

    /**
     * Return the day of week that starts weekend in the current locale. Days are still
     * numbered the standard way with 0 for Sunday through 6 for Saturday.
     *
     * @returns {number} the day of the week that starts weeks in the current locale.
     */
    getWeekEndEnd() {
        return this.info.weekendEnd;
    }

    /**
     * Return the default time zone for this locale. Many locales span across multiple
     * time zones. In this case, the time zone with the largest population is chosen
     * to represent the locale. This is obviously not that accurate, but then again,
     * this method's return value should only be used as a default anyways.
     * @returns {string} the default time zone for this locale.
     */
    getTimeZone() {
        return this.info.timezone;
    }

    /**
     * Return the decimal separator for formatted numbers in this locale.
     * @returns {string} the decimal separator char
     */
    getDecimalSeparator() {
        return this.info.numfmt && this.info.numfmt.decimalChar;
    }

    /**
     * Return the decimal separator for formatted numbers in this locale for native script.
     * @returns {string} the decimal separator char
     */
    getNativeDecimalSeparator() {
        return (this.info.native_numfmt && this.info.native_numfmt.decimalChar) || this.info.numfmt.decimalChar;
    }

    /**
     * Return the separator character used to separate groups of digits on the
     * integer side of the decimal character.
     * @returns {string} the grouping separator char
     */
    getGroupingSeparator() {
        return this.info.numfmt && this.info.numfmt.groupChar;
    }

    /**
     * Return the separator character used to separate groups of digits on the
     * integer side of the decimal character for the native script if present other than the default script.
     * @returns {string} the grouping separator char
     */
    getNativeGroupingSeparator() {
        return (this.info.native_numfmt && this.info.native_numfmt.groupChar) || this.info.numfmt.groupChar;
    }

    /**
     * Return the minimum number of digits grouped together on the integer side
     * for the first (primary) group.
     * In western European cultures, groupings are in 1000s, so the number of digits
     * is 3.
     * @returns {number} the number of digits in a primary grouping, or 0 for no grouping
     */
    getPrimaryGroupingDigits() {
        return (this.info.numfmt && typeof(this.info.numfmt.prigroupSize) !== 'undefined' && this.info.numfmt.prigroupSize) || 0;
    }

    /**
     * Return the minimum number of digits grouped together on the integer side
     * for the second or more (secondary) group.<p>
     *
     * In western European cultures, all groupings are by 1000s, so the secondary
     * size should be 0 because there is no secondary size. In general, if this
     * method returns 0, then all groupings are of the primary size.<p>
     *
     * For some other cultures, the first grouping (primary)
     * is 3 and any subsequent groupings (secondary) are two. So, 100000 would be
     * written as: "1,00,000".
     *
     * @returns {number} the number of digits in a secondary grouping, or 0 for no
     * secondary grouping.
     */
    getSecondaryGroupingDigits() {
        return (this.info.numfmt && this.info.numfmt.secgroupSize) || 0;
    }

    /**
     * Return the format template used to format percentages in this locale.
     * @returns {string} the format template for formatting percentages
     */
    getPercentageFormat() {
        return this.info.numfmt && this.info.numfmt.pctFmt;
    }

    /**
     * Return the format template used to format percentages in this locale
     * with negative amounts.
     * @returns {string} the format template for formatting percentages
     */
    getNegativePercentageFormat() {
        return this.info.numfmt && this.info.numfmt.negativepctFmt;
    }

    /**
     * Return the symbol used for percentages in this locale.
     * @returns {string} the symbol used for percentages in this locale
     */
    getPercentageSymbol() {
        return (this.info.numfmt && this.info.numfmt.pctChar) || "%";
    }

    /**
     * Return the symbol used for exponential in this locale.
     * @returns {string} the symbol used for exponential in this locale
     */
    getExponential() {
        return this.info.numfmt && this.info.numfmt.exponential;
    }

    /**
     * Return the symbol used for exponential in this locale for native script.
     * @returns {string} the symbol used for exponential in this locale for native script
     */
    getNativeExponential() {
        return (this.info.native_numfmt && this.info.native_numfmt.exponential) || this.info.numfmt.exponential;
    }

    /**
     * Return the symbol used for percentages in this locale for native script.
     * @returns {string} the symbol used for percentages in this locale for native script
     */
    getNativePercentageSymbol() {
        return (this.info.native_numfmt && this.info.native_numfmt.pctChar) || this.info.numfmt.pctChar || "%";

    }
    /**
     * Return the format template used to format negative numbers in this locale.
     * @returns {string} the format template for formatting negative numbers
     */
    getNegativeNumberFormat() {
        return this.info.numfmt && this.info.numfmt.negativenumFmt;
    }

    /**
     * Return an object containing the format templates for formatting currencies
     * in this locale. The object has a number of properties in it that each are
     * a particular style of format. Normally, this contains a "common" and an "iso"
     * style, but may contain others in the future.
     * @returns {Object} an object containing the format templates for currencies
     */
    getCurrencyFormats() {
        return this.info.numfmt && this.info.numfmt.currencyFormats;
    }

    /**
     * Return the currency that is legal in the locale, or which is most commonly
     * used in regular commerce.
     * @returns {string} the ISO 4217 code for the currency of this locale
     */
    getCurrency() {
        return this.info.currency;
    }

    /**
     * Return a string that describes the style of digits used by this locale.
     * Possible return values are:
     * <ul>
     * <li><i>western</i> - uses the regular western 10-based digits 0 through 9
     * <li><i>optional</i> - native 10-based digits exist, but in modern usage,
     * this locale most often uses western digits
     * <li><i>native</i> - native 10-based native digits exist and are used
     * regularly by this locale
     * <li><i>custom</i> - uses native digits by default that are not 10-based
     * </ul>
     * @returns {string} string that describes the style of digits used in this locale
     */
    getDigitsStyle() {
        if (this.info.numfmt && this.info.numfmt.useNative) {
            return "native";
        }
        if (typeof(this.info.native_numfmt) !== 'undefined') {
            return "optional";
        }
        return "western";
    }

    /**
     * Return the digits of the default script if they are defined.
     * If not defined, the default should be the regular "Arabic numerals"
     * used in the Latin script. (0-9)
     * @returns {string|undefined} the digits used in the default script
     */
    getDigits() {
        return this.info.numfmt && this.info.numfmt.digits;
    }

    /**
     * Return the digits of the native script if they are defined.
     * @returns {string|undefined} the digits used in the default script
     */
    getNativeDigits() {
        return (this.info.numfmt && this.info.numfmt.useNative && this.info.numfmt.digits) || (this.info.native_numfmt && this.info.native_numfmt.digits);
    }

    /**
     * If this locale typically uses a different type of rounding for numeric
     * formatting other than halfdown, especially for currency, then it can be
     * specified in the localeinfo. If the locale uses the default, then this
     * method returns undefined. The locale's rounding method overrides the
     * rounding method for the currency itself, which can sometimes shared
     * between various locales so it is less specific.
     * @returns {string} the name of the rounding mode typically used in this
     * locale, or "halfdown" if the locale does not override the default
     */
    getRoundingMode() {
        return this.info.numfmt ? this.info.numfmt.roundingMode : "halfdown";
    }

    /**
     * Return the default script used to write text in the language of this
     * locale. Text for most languages is written in only one script, but there
     * are some languages where the text can be written in a number of scripts,
     * depending on a variety of things such as the region, ethnicity, religion,
     * etc. of the author. This method returns the default script for the
     * locale, in which the language is most commonly written.<p>
     *
     * The script is returned as an ISO 15924 4-letter code.
     *
     * @returns {string} the ISO 15924 code for the default script used to write
     * text in this locale
     */
    getDefaultScript() {
        return (this.info.scripts) ? this.info.scripts[0] : "Latn";
    }

    /**
     * Return the script used for the current locale. If the current locale
     * explicitly defines a script, then this script is returned. If not, then
     * the default script for the locale is returned.
     *
     * @see LocaleInfo.getDefaultScript
     * @returns {string} the ISO 15924 code for the script used to write
     * text in this locale
     */
    getScript() {
        return this.locale.getScript() || this.getDefaultScript();
    }

    /**
     * Return an array of script codes which are used to write text in the current
     * language. Text for most languages is written in only one script, but there
     * are some languages where the text can be written in a number of scripts,
     * depending on a variety of things such as the region, ethnicity, religion,
     * etc. of the author. This method returns an array of script codes in which
     * the language is commonly written.
     *
     * @returns {Array.<string>} an array of ISO 15924 codes for the scripts used
     * to write text in this language
     */
    getAllScripts() {
        return this.info.scripts || ["Latn"];
    }

    /**
     * Return the default style of meridiems used in this locale. Meridiems are
     * times of day like AM/PM. In a few locales with some calendars, for example
     * Amharic/Ethiopia using the Ethiopic calendar, the times of day may be
     * split into different segments than simple AM/PM as in the Gregorian
     * calendar. Only a few locales are like that. For most locales, formatting
     * a Gregorian date will use the regular Gregorian AM/PM meridiems.
     *
     * @returns {string} the default meridiems style used in this locale. Possible
     * values are "gregorian", "chinese", and "ethiopic"
     */
    getMeridiemsStyle() {
        return this.info.meridiems || "gregorian";
    }
    /**
     * Return the default PaperSize information in this locale.
     * @returns {string} default PaperSize in this locale
     */
    getPaperSize() {
        return this.info.paperSizes.regular;
    }
    /**
     * Return the default Delimiter QuotationStart information in this locale.
     * @returns {string} default QuotationStart in this locale
     */
    getDelimiterQuotationStart() {
        return this.info.delimiter.quotationStart;
    }
    /**
     * Return the default Delimiter QuotationEnd information in this locale.
     * @returns {string} default QuotationEnd in this locale
     */
    getDelimiterQuotationEnd() {
        return this.info.delimiter.quotationEnd;
    }
};

export default LocaleInfo;
