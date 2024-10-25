/*
 * ResourceQuoteStyle.js - rule to check quotes in the target string
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

import LocaleInfo from 'ilib-localeinfo';
import { Result } from 'ilib-lint-common';

import ResourceRule from './ResourceRule.js';

/** @ignore @typedef {import("ilib-tools-common").Resource} Resource */

/**
 * @typedef BaseRegExpCollection
 * @type {object}
 * @prop {string} quoteStart
 * @prop {string} quoteStartAlt
 * @prop {string} quoteEnd
 * @prop {string} quoteEndAlt
 * @prop {RegExp} quotesNative
 * @prop {RegExp} quotesNativeAlt
 *
 * @typedef {BaseRegExpCollection} SourceRegExpCollection
 */

/**
 * @typedef ExtendedRegExpCollection
 * @type {object}
 * @prop {RegExp} quotesAll
 * @prop {RegExp} quotesAllAlt
 * @prop {string} nonQuoteChars
 * @prop {string} nonQuoteCharsAlt
 *
 * @typedef {BaseRegExpCollection & ExtendedRegExpCollection} TargetRegExpCollection
 */

/**
 * @typedef RegExpCollectionForLocale
 * @type {object}
 * @prop {RegExp} quotesAscii
 * @prop {RegExp} quotesAsciiAlt
 * @prop {SourceRegExpCollection} source
 * @prop {TargetRegExpCollection} target
 */

let /** @type {{[locale: string]: LocaleInfo}} */ LICache = {};

/**
 * @typedef ModeLocaleOnly
 * @type {"localeOnly"}
 * Allow only localized quotes in the target string. This also sets default result severity to "error".
 */

/**
 * @typedef Severity
 * @type {("error"|"warning"|"suggestion")}
 * Result severity.
 */

/**
 * @typedef Modes
 * @type {ModeLocaleOnly}
 * One-param rule configuration.
 */

/**
 * @typedef Configuration
 * @type {Modes}
 * Parameters that can be set through rule configuration file.
 */

/**
 * @class Represent an ilib-lint rule.
 */
class ResourceQuoteStyle extends ResourceRule {
    /**
     * Make a new rule instance.
     *
     * @param {object} [options]
     * @param {string} [options.sourceLocale]
     * @param {Configuration} [options.param]
     */
    constructor(options) {
        super(options ?? {});
        this.name = "resource-quote-style";
        this.description = "Ensure that the proper quote characters are used in translated resources";
        this.sourceLocale = (options && options.sourceLocale) || "en-US";
        this.link = "https://github.com/ilib-js/ilib-lint/blob/main/docs/resource-quote-style.md";

        if (options?.param === "localeOnly") {
            // only localized quotes are allowed in the target string
            this.localeOnly = true;
        }

        if (!this.skipLocales) {
            this.skipLocales = new Set();
        }

        [
            "sv", // According to the MS Style guidelines, quotes are usually not required in Swedish when the source English text contains quotes
            "it", // Based on feedback from linguists quotes in Italian are not required to be the guillemets, even though CLDR says so
        ].forEach(locale => this.skipLocales.add(locale));
    }

    /**
     * @private
     * @param {string} src
     * @param {string} tar
     * @param {Resource} resource
     * @param {string} file
     * @param {string} locale
     */
    checkString(src, tar, resource, file, locale) {
        const regExps = this.getRegExps(locale);

        const sourceStyle = {
            ascii: regExps.quotesAscii.test(src),
            asciiAlt: regExps.quotesAsciiAlt.test(src),
            native: regExps.source.quotesNative.test(src),
            nativeAlt: regExps.source.quotesNativeAlt.test(src)
        }

        // used in results to show what the expected quote style is
        const targetQuoteStyleExample = (sourceStyle.ascii || sourceStyle.native) ?
            `${regExps.target.quoteStart[0]}text${regExps.target.quoteEnd[0]}` :
            `${regExps.target.quoteStartAlt[0]}text${regExps.target.quoteEndAlt[0]}`;

        // verify that corresponding quote style is present in target
        // otherwise, construct regexps to pinpoint violation positions
        // (for highlighting purposes)
        let startQuote, endQuote;
        if (sourceStyle.ascii) {
            if (regExps.target.quotesAll.test(tar)) return;
            startQuote = new RegExp(`(^|\\W)([${regExps.target.nonQuoteChars}'])([\\p{Letter}\\{])`, "gu");
            endQuote = new RegExp(`([\\p{Letter}\\}])([${regExps.target.nonQuoteChars}'])(\\W|$)`, "gu");
        } else if (sourceStyle.asciiAlt) {
            if (regExps.target.quotesAllAlt.test(tar)) return;
            startQuote = new RegExp(`(^|\\W)([${regExps.target.nonQuoteCharsAlt}"])([\\p{Letter}\\{])`, "gu");
            endQuote = new RegExp(`([\\p{Letter}\\}])([${regExps.target.nonQuoteCharsAlt}"])(\\W|$)`, "gu");
        } else if (sourceStyle.native) {
            if (regExps.target.quotesNative.test(tar)) return;
            startQuote = new RegExp(`(^|\\W)([${regExps.target.nonQuoteChars}'"])([\\p{Letter}\\{])`, "gu");
            endQuote = new RegExp(`([\\p{Letter}\\}])([${regExps.target.nonQuoteChars}'"])(\\W|$)`, "gu");
        } else if (sourceStyle.nativeAlt) {
            if (regExps.target.quotesNativeAlt.test(tar)) return;
            startQuote = new RegExp(`(^|\\W)([${regExps.target.nonQuoteCharsAlt}'"])([\\p{Letter}\\{])`, "gu");
            endQuote = new RegExp(`([\\p{Letter}\\}])([${regExps.target.nonQuoteCharsAlt}'"])(\\W|$)`, "gu");
        } else {
            // no quotes detected in source string
            return;
        }

        let highlight, description, lineNumber;
        if (startQuote.test(tar) || endQuote.test(tar)) {
            highlight = tar;
            if (startQuote) { highlight = highlight.replace(startQuote, "$1<e0>$2</e0>$3"); }
            if (endQuote) { highlight = highlight.replace(endQuote, "$1<e1>$2</e1>$3"); }
            highlight = `Target: ${highlight}`;
            description = `Quote style for the locale ${locale} should be ${targetQuoteStyleExample}`;
        } else {
            highlight = `Target: ${tar}<e0></e0>`;
            description = `Quotes are missing in the target. Quote style for the locale ${locale} should be ${targetQuoteStyleExample}`;
        }
        // @ts-ignore: Property 'lineNumber' does not exist on type 'Resource'
        // there is no lineNumber property on a Resource type
        // (preserved for compatibility)
        if (typeof(resource.lineNumber) !== 'undefined') {lineNumber = /** @type {number} */ (resource.lineNumber); }

        return new Result({
            /** @type {Severity} */ severity: this.localeOnly ? "error" : "warning",
            id: resource.getKey(),
            source: src,
            rule: this,
            locale,
            pathName: file,
            highlight,
            description,
            lineNumber,
        });
    }

    /**
     * Calculate all the regular expressions we need.
     * @private
     * @param {string} locale
     * @returns {RegExpCollectionForLocale}
     */
    getRegExps(locale) {
        // superset of all the non-ASCII start and end chars used in CLDR
        const quoteChars = "«»‘“”„「」’‚‹›『』";

        // shared between all locales since there is nothing locale-specific in here
        const quotesAscii = new RegExp(`((^|\\W)"\\s?[\\p{Letter}\\{]|[\\p{Letter}\\}]\\s?"(\\W|$))`, "gu");
        // leave out the "s" before the final quote to take care of plural possessives (eg. my colleagues' files.)
        const quotesAsciiAlt = new RegExp(`((^|\\W)'\\s?[\\p{Letter}\\{]|[a-rt-zA-RT-Z\\}]\\s?'(\\W|$))`, "gu");

        // locale info object will tell us the quote chars for the locale
        let li = LICache[locale];
        if (!li) {
            // @ts-ignore: An argument for 'options' was not provided
            // LocaleInfo constructor type annotation does not reflect that options are in fact optional
            li = new LocaleInfo(locale);
            LICache[locale] = li;
        }

        let sourceLI = LICache[this.sourceLocale];
        if (!sourceLI) {
            // @ts-ignore: An argument for 'options' was not provided
            // LocaleInfo constructor type annotation does not reflect that options are in fact optional
            sourceLI = new LocaleInfo(this.sourceLocale);
            LICache[this.sourceLocale] = sourceLI;
        }

        // what are all the quote chars that this locale uses?
        const sourceQuoteStart = sourceLI.getDelimiterQuotationStart();
        const sourceQuoteStartAlt = /** @type {string} */ (sourceLI.info.delimiter.alternateQuotationStart);

        const sourceQuoteEnd = sourceLI.getDelimiterQuotationEnd();
        const sourceQuoteEndAlt = /** @type {string} */ (sourceLI.info.delimiter.alternateQuotationEnd);

        /** special case for Japanese: accept the main quote style only and also square brackets */
        const targetQuoteStartChars = (locale === "ja-JP") ? ["「", "\\["] : [li.getDelimiterQuotationStart()];
        // used in regular expressions:
        const targetQuoteStart = targetQuoteStartChars.join("");
        const targetQuoteStartAltChars = (locale === "ja-JP") ? ["「", "\\["] : [li.info.delimiter.alternateQuotationStart];
        // used in regular expressions:
        const targetQuoteStartAlt = /** @type {string} */ targetQuoteStartAltChars.join("");

        /** special case for Japanese: accept the main quote style only and also square brackets */
        const targetQuoteEndChars = (locale === "ja-JP") ? ["」", "\\]"] : [li.getDelimiterQuotationEnd()];
        // used in regular expressions:
        const targetQuoteEnd = targetQuoteEndChars.join("");
        const targetQuoteEndAltChars = (locale === "ja-JP") ? ["」", "\\]"] : [li.info.delimiter.alternateQuotationEnd];
        // used in regular expressions:
        const targetQuoteEndAlt = /** @type {string} */ targetQuoteEndAltChars.join("");

        // now calculate regular expressions for the source string that use those quotes
        // if the source uses ASCII quotes, then the target could have ASCII or native quotes
        const sourceQuotesNative = new RegExp(`((^|\\W)${sourceQuoteStart}\\s?[\\p{Letter}\\{]|[\\p{Letter}\\}]\\s?${sourceQuoteEnd}(\\W|$))`, "gu");
        const sourceQuotesNativeAlt = new RegExp(`((^|\\W)${sourceQuoteStartAlt}\\s?[\\p{Letter}\\{]|[\\p{Letter}\\}]\\s?${sourceQuoteEndAlt}(\\W|$))`, "gu");

        // now calculate the regular expressions for the target string that use quotes
        // if the source contains native quotes, then the target should also have native quotes
        const targetQuotesNative = new RegExp(`((^|\\W)${targetQuoteStart}\\s?[\\p{Letter}\\{]|[\\p{Letter}\\}]\\s?${targetQuoteEnd}(\\W|$))`, "gu");
        const targetQuotesNativeAlt = new RegExp(`((^|\\W)${targetQuoteStartAlt}\\s?[\\p{Letter}\\{]|[\\p{Letter}\\}]\\s?${targetQuoteEndAlt}(\\W|$))`, "gu");
        const targetQuotesAll = this.localeOnly ?
            targetQuotesNative :
            new RegExp(`((^|\\W)[${targetQuoteStart}${targetQuoteStartAlt}"]\\s?[\\p{Letter}\\{]|[\\p{Letter}\\}]\\s?[${targetQuoteEnd}${targetQuoteEndAlt}"](\\W|$))`, "gu");
        const targetQuotesAllAlt = this.localeOnly ?
            targetQuotesNativeAlt :
            new RegExp(`((^|\\W)[${targetQuoteStartAlt}']\\s?[\\p{Letter}\\{]|[\\p{Letter}\\}]\\s?[${targetQuoteEndAlt}'](\\W|$))`, "gu");

        // the non quote chars are used to highlight errors in the target string where they are using quotes, but
        // they are the wrong type. Start with the superset of all quotes and then remove the valid ones so that
        // you are left with the wrong ones for this locale.
        const targetNonQuoteChars = quoteChars.
                replace(sourceQuoteStart, "").
                replace(targetQuoteStart, "").
                replace(sourceQuoteEnd, "").
                replace(targetQuoteEnd, "");
        const targetNonQuoteCharsAlt = quoteChars.
                replace(new RegExp(`[${sourceQuoteStartAlt}]`, "gu"), "").
                replace(new RegExp(`[${targetQuoteStartAlt}]`, "gu"), "").
                replace(new RegExp(`[${sourceQuoteEndAlt}]`, "gu"), "").
                replace(new RegExp(`[${targetQuoteEndAlt}]`, "gu"), "");

        return {
            quotesAscii,
            quotesAsciiAlt,
            source: {
                quoteStart: sourceQuoteStart,
                quoteStartAlt: sourceQuoteStartAlt,
                quoteEnd: sourceQuoteEnd,
                quoteEndAlt: sourceQuoteEndAlt,
                quotesNative: sourceQuotesNative,
                quotesNativeAlt: sourceQuotesNativeAlt,
            },
            target: {
                quoteStart: targetQuoteStart,
                quoteStartAlt: targetQuoteStartAlt,
                quoteEnd: targetQuoteEnd,
                quoteEndAlt: targetQuoteEndAlt,
                quotesNative: targetQuotesNative,
                quotesNativeAlt: targetQuotesNativeAlt,
                quotesAll: targetQuotesAll,
                quotesAllAlt: targetQuotesAllAlt,
                nonQuoteChars: targetNonQuoteChars,
                nonQuoteCharsAlt: targetNonQuoteCharsAlt,
            }
        };
    }

    /**
     * @override
     * @param {Object} params
     * @param {string | undefined} params.source
     * @param {string | undefined} params.target
     * @param {Resource} params.resource
     * @param {string} params.file
     */
    matchString({source, target, resource, file}) {
        if (!source || !target) return; // cannot match in strings that don't exist!
        const locale = resource.getTargetLocale();
        if (!locale) return; // nothing to do if there is no target locale specified
        return this.checkString(source, target, resource, file, locale);
    }
}

export default ResourceQuoteStyle;
