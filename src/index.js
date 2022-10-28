/*
 * ResBundle.js - Resource bundle definition
 *
 * Copyright © 2012-2016, 2018-2019, 2022 JEDLSoft
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

// !data pseudomap

import { Utils, JSUtils, Path } from 'ilib-common';
import { top, getPlatform } from 'ilib-env';
import Locale from "ilib-locale";
import LocaleInfo from "ilib-localeinfo";
import IString from "ilib-istring";
import getLocaleData from 'ilib-localedata';

const defaultPseudo = {
    "a": "à",
    "e": "ë",
    "i": "í",
    "o": "õ",
    "u": "ü",
    "y": "ÿ",
    "A": "Ã",
    "E": "Ë",
    "I": "Ï",
    "O": "Ø",
    "U": "Ú",
    "Y": "Ŷ"
};

/**
 * @private
 */
function localeDir() {
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
 * @private
 */
function getIlib() {
    var globalScope = top();
    if (!globalScope.ilib) {
        globalScope.ilib = {};
    }
    return globalScope.ilib;
}

/**
 * @class
 * Create a new resource bundle instance. The resource bundle loads strings
 * appropriate for a particular locale and provides them via the getString
 * method.
 */
class ResBundle {
    /**
     * Create a new resource bundle instance. The resource bundle loads strings
     * appropriate for a particular locale and provides them via the getString
     * method.<p>
     *
     * The options object may contain any (or none) of the following properties:
     *
     * <ul>
     * <li><i>locale</i> - The locale of the strings to load. If not specified, the default
     * locale is the the default for the web page or app in which the bundle is
     * being loaded.
     *
     * <li><i>name</i> - Base name of the resource bundle to load. If not specified the default
     * base name is "resources".
     *
     * <li><i>type</i> - Name the type of strings this bundle contains. Valid values are
     * "xml", "html", "text", "c", "raw", "ruby", or "template". The default is "text".
     * If the type is "xml" or "html",
     * then XML/HTML entities and tags are not pseudo-translated. During a real translation,
     * HTML character entities are translated to their corresponding characters in a source
     * string before looking that string up in the translations. Also, the characters "<", ">",
     * and "&" are converted to entities again in the output, but characters are left as they
     * are. If the type is "xml", "html", "ruby", or "text" types, then the replacement parameter names
     * are not pseudo-translated as well so that the output can be used for formatting with
     * the IString class. If the type is "c" then all C language style printf replacement
     * parameters (eg. "%s" and "%d") are skipped automatically. This includes iOS/Objective-C/Swift
     * substitution parameters like "%@" or "%1$@". If the type is raw, all characters
     * are pseudo-translated, including replacement parameters as well as XML/HTML tags and entities.
     *
     * <li><i>lengthen</i> - when pseudo-translating the string, tell whether or not to
     * automatically lengthen the string to simulate "long" languages such as German
     * or French. This is a boolean value. Default is false.
     *
     * <li><i>missing</i> - what to do when a resource is missing. The choices are:
     * <ul>
     *   <li><i>source</i> - return the source string unchanged
     *   <li><i>pseudo</i> - return the pseudo-translated source string, translated to the
     *   script of the locale if the mapping is available, or just the default Latin
     *   pseudo-translation if not
     *   <li><i>empty</i> - return the empty string
     * </ul>
     * The default behaviour is the same as before, which is to return the source string
     * unchanged.
     *
     * <li><i>basePath</i> - look in the given path for the resource bundle files. This can be
     * an absolute path or a relative path that is relative to the application's root.
     * Default if this is not specified is to look in the standard path (ie. in the root
     * of the app).
     * </ul>
     *
     * The locale option may be given as a locale spec string or as an
     * Locale object. If the locale option is not specified, then strings for
     * the default locale will be loaded.<p>
     *
     * The name option can be used to put groups of strings together in a
     * single bundle. The strings will then appear together in a JS object in
     * a JS file that can be included before the ilib.<p>
     *
     * A resource bundle with a particular name is actually a set of bundles
     * that are each specific to a language, a language plus a region, etc.
     * All bundles with the same base name should
     * contain the same set of source strings, but with different translations for
     * the given locale. The user of the bundle does not need to be aware of
     * the locale of the bundle, as long as it contains values for the strings
     * it needs.<p>
     *
     * Strings in bundles for a particular locale are inherited from parent bundles
     * that are more generic. In general, the hierarchy is as follows (from
     * least locale-specific to most locale-specific):
     *
     * <ol>
     * <li> language
     * <li> region
     * <li> language_script
     * <li> language_region
     * <li> region_variant
     * <li> language_script_region
     * <li> language_region_variant
     * <li> language_script_region_variant
     * </ol>
     *
     * That is, if the translation for a string does not exist in the current
     * locale, the more-generic parent locale is searched for the string. In the
     * worst case scenario, the string is not found in the base locale's strings.
     * In this case, the missing option guides this class on what to do. If
     * the missing option is "source", then the original source is returned as
     * the translation. If it is "empty", the empty string is returned. If it
     * is "pseudo", then the pseudo-translated string that is appropriate for
     * the default script of the locale is returned.<p>
     *
     * This allows developers to create code with new or changed strings in it and check in that
     * code without waiting for the translations to be done first. The translated
     * version of the app or web site will still function properly, but will show
     * a spurious untranslated string here and there until the translations are
     * done and also checked in.<p>
     *
     * The base is whatever language your developers use to code in. For
     * a German web site, strings in the source code may be written in German
     * for example. Often this base is English, as many web sites are coded in
     * English, but that is not required.<p>
     *
     * The strings can be extracted with the ilib localization tool (which will be
     * shipped at some future time.) Once the strings
     * have been translated, the set of translated files can be generated with the
     * same tool. The output from the tool can be used as input to the ResBundle
     * object. It is up to the web page or app to make sure the JS file that defines
     * the bundle is included before creating the ResBundle instance.<p>
     *
     * A special locale "zxx-XX" is used as the pseudo-translation locale because
     * zxx means "no linguistic information" in the ISO 639 standard, and the region
     * code XX is defined to be user-defined in the ISO 3166 standard.
     * Pseudo-translation is a locale where the translations are generated on
     * the fly based on the contents of the source string. Characters in the source
     * string are replaced with other characters and returned.
     *
     * Example. If the source string is:
     *
     * <pre>
     * "This is a string"
     * </pre>
     *
     * then the pseudo-translated version might look something like this:
     *
     * <pre>
     * "Ţħïş ïş á şţřïñĝ"
     * </pre>
     * <p>
     *
     * Pseudo-translation can be used to test that your app or web site is translatable
     * before an actual translation has happened. These bugs can then be fixed
     * before the translation starts, avoiding an explosion of bugs later when
     * each language's tester registers the same bug complaining that the same
     * string is not translated. When pseudo-localizing with
     * the Latin script, this allows the strings to be readable in the UI in the
     * source language (if somewhat funky-looking),
     * so that a tester can easily verify that the string is properly externalized
     * and loaded from a resource bundle without the need to be able to read a
     * foreign language.<p>
     *
     * If one of a list of script tags is given in the pseudo-locale specifier, then the
     * pseudo-localization can map characters to very rough transliterations of
     * characters in the given script. For example, zxx-Hebr-XX maps strings to
     * Hebrew characters, which can be used to test your UI in a right-to-left
     * language to catch bidi bugs before a translation is done. Currently, the
     * list of target scripts includes Hebrew (Hebr), Chinese Simplified Han (Hans),
     * and Cyrillic (Cyrl) with more to be added later. If no script is explicitly
     * specified in the locale spec, or if the script is not supported,
     * then the default mapping maps Latin base characters to accented versions of
     * those Latin characters as in the example above.
     *
     * When the "lengthen" property is set to true in the options, the
     * pseudotranslation code will add digits to the end of the string to simulate
     * the lengthening that occurs when translating to other languages. The above
     * example will come out like this:
     *
     * <pre>
     * "Ţħïş ïş á şţřïñĝ76543210"
     * </pre>
     *
     * The string is lengthened according to the length of the source string. If
     * the source string is less than 20 characters long, the string is lengthened
     * by 50%. If the source string is 20-40
     * characters long, the string is lengthened by 33%. If te string is greater
     * than 40 characters long, the string is lengthened by 20%.<p>
     *
     * The pseudotranslation always ends a string with the digit "0". If you do
     * not see the digit "0" in the UI for your app, you know that truncation
     * has occurred, and the number you see at the end of the string tells you
     * how many characters were truncated.<p>
     *
     *
     * @constructor
     * @param {?Object} options Options controlling how the bundle is created
     */
    constructor (options) {
        if (!options || !options._noinit) {
            this.init(options, true);
        }
    }

    /**
     * @private
     */
    init(options, sync) {
        let lookupLocale, spec;

        this.locale = new Locale();    // use the default locale
        this.baseName = "strings";
        this.type = "text";
        this.missing = "source";

        if (options) {
            if (options.locale) {
                this.locale = (typeof(options.locale) === 'string') ?
                        new Locale(options.locale) :
                        options.locale;
            }
            if (options.name) {
                this.baseName = options.name;
            }
            if (options.type) {
                this.type = options.type;
            }
            this.lengthen = options.lengthen || false;
            this.path = options.basePath;

            if (typeof(options.sync) !== 'undefined') {
                sync = !!options.sync;
            }

            if (typeof(options.missing) !== 'undefined') {
                if (options.missing === "pseudo" || options.missing === "empty") {
                    this.missing = options.missing;
                }
            }
        }

        this.map = {};
        this.percentRE = new RegExp("%(\\d+\\$)?([\\-#\\+ 0,\\(])*(\\d+)?(\\.\\d+)?(h|hh|l|ll|j|z|t|L|q)?[diouxXfFeEgGaAcspnCS%@]");

        lookupLocale = ResBundle.isPseudoLocale(this.locale.getSpec()) ? new Locale("en-US") : this.locale;

        const locData = getLocaleData({
            path: this.path || localeDir(),
            sync
        });

        if (sync) {
            this.map = locData.loadData({
                basename: this.baseName,
                locale: lookupLocale,
                crossRoots: true,
                sync
            });
            if (ResBundle.isPseudoLocale(this.locale.getSpec())) {
                this._loadPseudo(this.locale, true, locData);
            } else if (this.missing === "pseudo") {
                const li = new LocaleInfo(this.locale);
                const pseudoLocale = new Locale("zxx", "XX", undefined, li.getDefaultScript());
                this._loadPseudo(pseudoLocale, true, locData);
            }
        } else {
            return locData.loadData({
                basename: this.baseName,
                locale: lookupLocale,
                crossRoots: true,
                sync
            }).then((map) => {
                this.map = map;
                if (ResBundle.isPseudoLocale(this.locale.getSpec())) {
                    return this._loadPseudo(this.locale, false, locData);
                } else if (this.missing === "pseudo") {
                    return LocaleInfo.create(this.locale).then((li) => {
                        const pseudoLocale = new Locale("zxx", "XX", undefined, li.getDefaultScript());
                        return this._loadPseudo(pseudoLocale, false, locData);
                    });
                }
                return this;
            }).then(() => {
                // ensure that the locale data is loaded so we can do synchronous calls after this
                return IString.create("", {locale: this.locale});
            }).then(() => {
                return this;
            });
        }
    }

    /**
     * Factory method to create a new instance of ResBundle asynchronously.
     * The parameters are the same as for the constructor, but it returns
     * a `Promise` instead of the instance directly.
     *
     * @param {Object} options the same object you would send to a constructor
     * @returns {Promise} a promise to load a ResBundle instance. The resolved
     * value of the promise is the new instance of ResBundle,
     */
    static create(options) {
        const n = new ResBundle({ ...options, _noinit: true });
        return n.init(options, false);
    }

    /**
     * @protected
     */
    _loadPseudo(pseudoLocale, sync, locData) {
        if (sync) {
            try {
                const map = locData.loadData({
                    basename: "pseudomap",
                    locale: pseudoLocale,
                    sync
                });
                this.pseudomap = (!map || JSUtils.isEmpty(map)) ? defaultPseudo : map;
            } catch (e) {
                this.pseudomap = defaultPseudo;
            }
        } else {
            return locData.loadData({
                basename: "pseudomap",
                locale: pseudoLocale,
                sync
            }).then((map) => {
                this.pseudomap = (!map || JSUtils.isEmpty(map)) ? defaultPseudo : map;
                return this;
            }).catch((e) => {
                this.pseudomap = defaultPseudo;
                return this;
            });
        }
    }

    /**
     * Return the locale of this resource bundle.
     * @return {Locale} the locale of this resource bundle object
     */
    getLocale() {
        return this.locale;
    }

    /**
     * Return the name of this resource bundle. This corresponds to the name option
     * given to the constructor.
     * @return {string} name of the the current instance
     */
    getName() {
        return this.baseName;
    }

    /**
     * Return the type of this resource bundle. This corresponds to the type option
     * given to the constructor.
     * @return {string} type of the the current instance
     */
    getType() {
        return this.type;
    }

    

    /**
     * @private
     * Pseudo-translate a string
     */
    _pseudo(str) {
        if (!str) {
            return undefined;
        }
        let ret = "", i;
        for (i = 0; i < str.length; i++) {
            if (this.type !== "raw") {
                if (this.type === "html" || this.type === "xml") {
                    if (str.charAt(i) === '<') {
                        ret += str.charAt(i++);
                        while (i < str.length && str.charAt(i) !== '>') {
                            ret += str.charAt(i++);
                        }
                    } else if (str.charAt(i) === '&') {
                        ret += str.charAt(i++);
                        while (i < str.length && str.charAt(i) !== ';' && str.charAt(i) !== ' ') {
                            ret += str.charAt(i++);
                        }
                    } else if (str.charAt(i) === '\\' && str.charAt(i+1) === "u") {
                        ret += str.substring(i, i+6);
                        i += 6;
                    }
                } else if (this.type === "c") {
                    if (str.charAt(i) === "%") {
                        const m = this.percentRE.exec(str.substring(i));
                        if (m && m.length) {
                            // console.log("Match found: " + JSON.stringify(m[0].replace("%", "%%")));
                            ret += m[0];
                            i += m[0].length;
                        }
                    }
                } else if (this.type === "ruby") {
                    if (str.charAt(i) === "%" && i < str.length && str.charAt(i+1) !== "{") {
                        ret += str.charAt(i++);
                        while (i < str.length && str.charAt(i) !== '%') {
                            ret += str.charAt(i++);
                        }
                    }
                } else if (this.type === "template") {
                    if (str.charAt(i) === '<' && str.charAt(i+1) === '%') {
                        ret += str.charAt(i++);
                        ret += str.charAt(i++);
                        while (i < str.length && (str.charAt(i) !== '>' || str.charAt(i-1) !== '%')) {
                            ret += str.charAt(i++);
                        }
                    } else if (str.charAt(i) === '&') {
                        ret += str.charAt(i++);
                        while (i < str.length && str.charAt(i) !== ';' && str.charAt(i) !== ' ') {
                            ret += str.charAt(i++);
                        }
                    } else if (str.charAt(i) === '\\' && str.charAt(i+1) === "u") {
                        ret += str.substring(i, i+6);
                        i += 6;
                    }
                }
                if (i < str.length) {
                    if (str.charAt(i) === '{') {
                        ret += str.charAt(i++);
                        while (i < str.length && str.charAt(i) !== '}') {
                            ret += str.charAt(i++);
                        }
                        if (i < str.length) {
                            ret += str.charAt(i);
                        }
                    } else {
                        ret += this.pseudomap[str.charAt(i)] || str.charAt(i);
                    }
                }
            } else {
                ret += this.pseudomap[str.charAt(i)] || str.charAt(i);
            }
        }
        if (this.lengthen) {
            let add;
            if (ret.length <= 20) {
                add = Math.round(ret.length / 2);
            } else if (ret.length > 20 && ret.length <= 40) {
                add = Math.round(ret.length / 3);
            } else {
                add = Math.round(ret.length / 5);
            }
            for (i = add-1; i >= 0; i--) {
                ret += (i % 10);
            }
        }
        if (this.locale.getScript() === "Hans" || this.locale.getScript() === "Hant" ||
                this.locale.getScript() === "Hani" ||
                this.locale.getScript() === "Hrkt" || this.locale.getScript() === "Jpan" ||
                this.locale.getScript() === "Hira" || this.locale.getScript() === "Kana" ) {
            // simulate Asian languages by getting rid of all the spaces
            ret = ret.replace(/ /g, "");
        }
        return ret;
    }

    /**
     * @private
     * Escape html characters in the output.
     */
    _escapeXml(str) {
        return str.replace(/&/g, '&amp;').
            replace(/</g, '&lt;').
            replace(/>/g, '&gt;');
    }

    /**
     * @private
     * @param {string} str the string to unescape
     */
    _unescapeXml(str) {
        return str.replace(/&amp;/g, '&').
            replace(/&lt;/g, '<').
            replace(/&gt;/g, '>');
    }

    /**
     * @private
     * Create a key name out of a source string. All this does so far is
     * compress sequences of white space into a single space on the assumption
     * that this doesn't really change the meaning of the string, and therefore
     * all such strings that compress to the same thing should share the same
     * translation.
     * @param {null|string=} source the source string to make a key out of
     */
    _makeKey(source) {
        if (!source || (typeof(source) === 'object' && !(source instanceof IString))) return undefined;
        const s = source.toString();
        const key = s.replace(/\s+/gm, ' ');
        return (this.type === "xml" || this.type === "html") ? this._unescapeXml(key) : key;
    }

    /**
     * @private
     */
    _getStringSingle(source, key, escapeMode) {
        if (!source && !key) return new IString("", {locale: this.locale});

        let trans;
        if (ResBundle.isPseudoLocale(this.locale.getSpec())) {
            const str = source || this.map[key];
            trans = this._pseudo(str || key);
        } else {
            const keyName = key || this._makeKey(source);
            if (typeof(this.map[keyName]) !== 'undefined') {
                trans = this.map[keyName];
            } else if (this.missing === "pseudo") {
                trans = this._pseudo(source || key);
            } else if (this.missing === "empty") {
                trans = "";
            } else {
                trans = source;
            }
        }

        if (escapeMode && escapeMode !== "none") {
            if (escapeMode === "default") {
                escapeMode = this.type;
            }
            if (escapeMode === "xml" || escapeMode === "html") {
                trans = this._escapeXml(trans);
            } else if (escapeMode === "js" || escapeMode === "attribute") {
                trans = trans.replace(/'/g, "\\\'").replace(/"/g, "\\\"");
            }
        }
        if (trans === undefined) {
            return undefined;
        } else {
            return new IString(trans, {locale: this.locale});
        }
    }

    /**
     * Return a localized string, array, or object. This method can localize individual
     * strings or arrays of strings.<p>
     *
     * If the source parameter is a string, the translation of that string is looked
     * up and returned. If the source parameter is an array of strings, then the translation
     * of each of the elements of that array is looked up, and an array of translated strings
     * is returned. <p>
     *
     * If any string is not found in the loaded set of
     * resources, the original source string is returned. If the key is not given,
     * then the source string itself is used as the key. In the case where the
     * source string is used as the key, the whitespace is compressed down to 1 space
     * each, and the whitespace at the beginning and end of the string is trimmed.<p>
     *
     * The escape mode specifies what type of output you are escaping the returned
     * string for. Modes are similar to the types:
     *
     * <ul>
     * <li>"html" -- prevents HTML injection by escaping the characters &lt &gt; and &amp;
     * <li>"xml" -- currently same as "html" mode
     * <li>"js" -- prevents breaking Javascript syntax by backslash escaping all quote and
     * double-quote characters
     * <li>"attribute" -- meant for HTML attribute values. Currently this is the same as
     * "js" escape mode.
     * <li>"default" -- use the type parameter from the constructor as the escape mode as well
     * <li>"none" or undefined -- no escaping at all.
     * </ul>
     *
     * The type parameter of the constructor specifies what type of strings this bundle
     * is operating upon. This allows pseudo-translation and automatic key generation
     * to happen properly by telling this class how to parse the string. The escape mode
     * for this method is different in that it specifies how this string will be used in
     * the calling code and therefore how to escape it properly.<p>
     *
     * For example, a section of Javascript code may be constructing an HTML snippet in a
     * string to add to the web page. In this case, the type parameter in the constructor should
     * be "html" so that the source string can be parsed properly, but the escape mode should
     * be "js" so that the output string can be used in Javascript without causing syntax
     * errors.
     *
     * @param {?string|Array.<string>=} source the source string or strings to translate
     * @param {?string|Array.<string>=} key optional name of the key, if any
     * @param {?string=} escapeMode escape mode, if any
     * @return {IString|Array.<IString>|undefined} the translation of the given source/key or undefined
     * if the translation is not found and the source is undefined
     */
    getString(source, key, escapeMode) {
        if (!source && !key) return new IString("", {locale: this.locale});

        //if (typeof(source) === "object") {
            // TODO localize objects
        //} else

        if (JSUtils.isArray(source)) {
            return source.map((str) => {
               return typeof(str) === "string" ? this._getStringSingle(str, key, escapeMode) : str;
            });
        } else {
            return this._getStringSingle(source, key, escapeMode);
        }
    }

    /**
     * Return a localized string as an intrinsic Javascript String object. This does the same thing as
     * the getString() method, but it returns a regular Javascript string instead of
     * and IString instance. This means it cannot be formatted with the format()
     * method without being wrapped in an IString instance first.
     *
     * @param {?string|Array.<string>=} source the source string to translate
     * @param {?string|Array.<string>=} key optional name of the key, if any
     * @param {?string=} escapeMode escape mode, if any
     * @return {string|Array.<string>|undefined} the translation of the given source/key or undefined
     * if the translation is not found and the source is undefined
     */
    getStringJS(source, key, escapeMode) {
        if (typeof(source) === 'undefined' && typeof(key) === 'undefined') {
            return undefined;
        }
        //if (typeof(source) === "object") {
            // TODO localize objects
        //} else

        if (JSUtils.isArray(source)) {
            return this.getString(source, key, escapeMode).map((str) => {
                return (str && str instanceof IString) ? str.toString() : str;
            });
        } else {
            const s = this.getString(source, key, escapeMode);
            return (s && s instanceof IString) ? s.toString() : undefined;
        }
    }

    /**
     * Return true if the current bundle contains a translation for the given key and
     * source. The
     * getString method will always return a string for any given key and source
     * combination, so it cannot be used to tell if a translation exists. Either one
     * or both of the source and key must be specified. If both are not specified,
     * this method will return false.
     *
     * @param {?string=} source source string to look up
     * @param {?string=} key key to look up
     * @return {boolean} true if this bundle contains a translation for the key, and
     * false otherwise
     */
    containsKey(source, key) {
        if (typeof(source) === 'undefined' && typeof(key) === 'undefined') {
            return false;
        }

        const keyName = key || this._makeKey(source);
        return typeof(this.map[keyName]) !== 'undefined';
    }

    /**
     * Return the merged resources as an entire object. When loading resources for a
     * locale that are not just a set of translated strings, but instead an entire
     * structured javascript object, you can gain access to that object via this call. This method
     * will ensure that all the of the parts of the object are correct for the locale.<p>
     *
     * For pre-assembled data, it starts by loading <i>ilib.data[name]</i>, where
     * <i>name</i> is the base name for this set of resources. Then, it successively
     * merges objects in the base data using progressively more locale-specific data.
     * It loads it in this order from <i>ilib.data</i>:
     *
     * <ol>
     * <li> language
     * <li> region
     * <li> language_script
     * <li> language_region
     * <li> region_variant
     * <li> language_script_region
     * <li> language_region_variant
     * <li> language_script_region_variant
     * </ol>
     *
     * For dynamically loaded data, the code attempts to load the same sequence as
     * above, but with slash path separators instead of underscores.<p>
     *
     * Loading the resources this way allows the program to share resources between all
     * locales that share a common language, region, or script. As a
     * general rule-of-thumb, resources should be as generic as possible in order to
     * cover as many locales as possible.
     *
     * @return {Object} returns the object that is the basis for this resources instance
     */
    getResObj() {
        return this.map;
    }

    /**
     * Return whether the given locale is on the list of pseudo locales.
     *
     * @static
     * @returns {boolean} true if the given locale is on the list of pseudo locales
     */
    static isPseudoLocale(locale) {
        if (!locale) return false;
        const loc = (locale instanceof Locale) ? locale.getSpec() : locale;
        const ilib = getIlib();
        if (!ilib.pseudos) {
            ilib.pseudos = [];
        }
        // this.path always goes at the end
        return ilib.pseudos.indexOf(loc) > -1;
    }

    /**
     * Add the given locale to the list of locales that are pseudo locales.
     *
     * @static
     * @param {string} locale the locale to add to the list
     */
    static addPseudoLocale(locale) {
        if (!locale) return;
        const loc = (locale instanceof Locale) ? locale.getSpec() : locale;
        const ilib = getIlib();
        if (!ilib.pseudos) {
            ilib.pseudos = [];
        } else if (ilib.pseudos.indexOf(loc) > -1) {
            // Already there. Don't need to add it again.
            return;
        }
        ilib.pseudos.push(loc);
    }
    
    /**
     * Clear the list of pseudo locales.
     */
    static clearPseudoLocales() {
        const ilib = getIlib();
        ilib.pseudos = [
            "zxx-XX",
            "zxx-Hans-XX",
            "zxx-Hebr-XX",
            "zxx-Cyrl-XX"
        ];
    }
};

export default ResBundle;
