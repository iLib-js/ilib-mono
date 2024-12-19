/*
 * Address.js - Represent a mailing address
 *
 * Copyright © 2013-2015, 2018, 2022 JEDLSoft
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

/*globals console RegExp */

import { Utils, JSUtils, Path } from 'ilib-common';
import Locale from 'ilib-locale';
import { withinRange, isIdeo, isAscii, isDigit } from 'ilib-ctype';
import IString from 'ilib-istring';
import getLocaleData, { LocaleData } from 'ilib-localedata';
import { getPlatform } from 'ilib-env';

import { nativeCountries } from './NativeCountries.js';
import { countries } from './Countries.js';

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

const defaultAddressInfo = {
    "formats": {
        "default": "{streetAddress}\n{locality} {region} {postalCode}\n{country}",
        "nocountry": "{streetAddress}\n{locality} {region} {postalCode}"
    },

    "startAt": "end",
    "fields": [
        {
            "name": "postalCode",
            "line": "startAtLast",
            "pattern": "[0-9]+$"
        },
        {
            "name": "locality",
            "line": "last",
            "pattern": "[\\wÀÁÂÄÇÈÉÊËÌÍÎÏÒÓÔÙÚÛàáâçèéêëìíîïòóôùúû\\.\\-']+$"
        }
    ]
};

/**
 * @class A class to parse and represent mailing addresses
 */
class Address {
    /**
     * Create a new Address instance and parse a physical address.<p>
     *
     * This function parses a physical address written in a free-form string.
     * It returns an object with a number of properties from the list below
     * that it may have extracted from that address.<p>
     *
     * The following is a list of properties that the algorithm will return:<p>
     *
     * <ul>
     * <li><i>streetAddress</i>: The street address, including house numbers and all.
     * <li><i>locality</i>: The locality of this address (usually a city or town).
     * <li><i>region</i>: The region where the locality is located. In the US, this
     * corresponds to states. In other countries, this may be provinces,
     * cantons, prefectures, etc. In some smaller countries, there are no
     * such divisions.
     * <li><i>postalCode</i>: Country-specific code for expediting mail. In the US,
     * this is the zip code.
     * <li><i>country</i>: The country of the address.
     * <li><i>countryCode</i>: The ISO 3166 2-letter region code for the destination
     * country in this address.
     * </ul>
     *
     * The above properties will not necessarily appear in the instance. For
     * any individual property, if the free-form address does not contain
     * that property or it cannot be parsed out, the it is left out.<p>
     *
     * The options parameter may contain any of the following properties:
     *
     * <ul>
     * <li><i>locale</i> - locale or localeSpec to use to parse the address. If not
     * specified, this function will use the current ilib locale
     * </ul>
     *
     * When an address cannot be parsed properly, the entire address will be placed
     * into the streetAddress property.<p>
     *
     * When the freeformAddress is another Address, this will act like a copy
     * constructor.<p>
     *
     * @param {string|Address} freeformAddress free-form address to parse, or a
     * javascript object containing the fields
     * @param {Object} options options to the parser
     */
    constructor(freeformAddress, options) {
        if (!options || !options._noinit) {
            this.init(freeformAddress, options, true);
        }
    }

    /**
     * Factory method to create a new instance of AddressFmt asynchronously.
     * The parameters are the same as for the constructor, but it returns
     * a `Promise` instead of the instance directly.
     *
     * @param {string|Address} freeformAddress free-form address to parse, or a
     * javascript object containing the fields
     * @param {Object} options the same objects you would send to a constructor
     * @returns {Promise} a promise to load a AddressFmt instance. The resolved
     * value of the promise is the new instance of AddressFmt,
     */
    static create(freeformAddress, options) {
        const nf = new Address(freeformAddress, { ...options, _noinit: true });
        return nf.init(freeformAddress, options, false);
    }

    /**
     * Initialize this instance.
     * @private
     */
    init(freeformAddress, options, sync) {
        if (!freeformAddress) {
            return undefined;
        }

        if (options) {
            if (options.locale) {
                this.locale = (typeof(options.locale) === 'string') ? new Locale(options.locale) : options.locale;
            }
        }

        this.locale = this.locale || new Locale();
        // initialize from an already parsed object
        if (typeof(freeformAddress) === 'object') {
            /**
             * The street address, including house numbers and all.
             * @type {string|undefined}
             */
            this.streetAddress = freeformAddress.streetAddress;
            /**
             * The locality of this address (usually a city or town).
             * @type {string|undefined}
             */
            this.locality = freeformAddress.locality;
            /**
             * The region (province, canton, prefecture, state, etc.) where the address is located.
             * @type {string|undefined}
             */
            this.region = freeformAddress.region;
            /**
             * Country-specific code for expediting mail. In the US, this is the zip code.
             * @type {string|undefined}
             */
            this.postalCode = freeformAddress.postalCode;
            /**
             * Optional city-specific code for a particular post office, used to expidite
             * delivery.
             * @type {string|undefined}
             */
            this.postOffice = freeformAddress.postOffice;
            /**
             * The country of the address.
             * @type {string|undefined}
             */
            this.country = freeformAddress.country;
            if (freeformAddress.countryCode) {
                /**
                 * The 2 or 3 letter ISO 3166 region code for the destination country in this address.
                 * @type {string}
                 */
                this.countryCode = freeformAddress.countryCode;
            }
            if (freeformAddress.format) {
                /**
                 * private
                 * @type {string}
                 */
                this.format = freeformAddress.format;
            }

            return !sync ? Promise.resolve(this) : this;
        }

        let address = freeformAddress.replace(/[ \t\r]+/g, " ").trim();
        address = address.replace(/[\s\n]+$/, "");
        address = address.replace(/^[\s\n]+/, "");
        //console.log("\n\n-------------\nAddress is '" + address + "'");

        this.lines = address.split(/[,，\n]/g);
        this.removeEmptyLines(this.lines);

        const locData = getLocaleData({
            path: localeDir(),
            sync
        });

        if (sync) {
            try {
                const ctrynames = locData.loadData({
                    basename: "ctrynames",
                    locale: this.locale,
                    sync
                });

                this.countryCode = this._determineDest(ctrynames);

                this.info = locData.loadData({
                    basename: "address",
                    locale: new Locale(`und-${this.countryCode}`),
                    sync
                });

                if (!this.info.formats) {
                    // default "unknown" region
                    this.info = {...this.info, ...defaultAddressInfo};
                }
            } catch (e) {
                this.info = defaultAddressInfo;
            }
            this._parseAddress();
        } else {
            return locData.loadData({
                basename: "ctrynames",
                locale: this.locale,
                sync
            }).then((ctrynames) => {
                this.countryCode = this._determineDest(ctrynames);
                return locData.loadData({
                    basename: "address",
                    locale: new Locale(`und-${this.countryCode}`),
                    sync
                });
            }).then((info) => {
                this.info = info.formats ? info : { ...info, ...defaultAddressInfo};
                this._parseAddress();
                return this;
            }).catch((e) => {
                this.info = defaultAddressInfo;
                this._parseAddress();
                return this;
            });
        }
    }

    /**
     * @private
     * @param {Object?} ctrynames
     */
    _findDest(ctrynames) {
        let match;

        for (const countryName in ctrynames) {
            if (countryName && countryName !== "generated") {
                // find the longest match in the current table
                // ctrynames contains the country names mapped to region code
                // for efficiency, only test for things longer than the current match
                if (!match || match.text.length < countryName.length) {
                    const temp = this._findCountry(countryName);
                    if (temp) {
                        match = temp;
                        this.country = match.text;
                        match.countryCode = ctrynames[countryName];
                    }
                }
            }
        }
        return match;
    }

    /**
     * @private
     * @param {Object?} localizedCountries
     */
    _determineDest(localizedCountries) {
        let match;

        /*
         * First, find the name of the destination country, as that determines how to parse
         * the rest of the address. For any address, there are three possible ways
         * that the name of the country could be written:
         * 1. In the current language
         * 2. In its own native language
         * 3. In English
         * We'll try all three.
         */
        let tables = [];
        if (localizedCountries) {
            tables.push(localizedCountries);
        }
        tables.push(nativeCountries);
        tables.push(countries);

        for (let i = 0; i < tables.length; i++) {
            match = this._findDest(tables[i]);

            if (match) {
                this.lines[match.line] = this.lines[match.line].substring(0, match.start) + this.lines[match.line].substring(match.start + match.text.length);
                return match.countryCode;
            }
        }

        // no country, so try parsing it as if we were in the same country
        return this.locale.getRegion();
    }

    /**
     * @private
     */
    _parseAddress() {
        // clean it up first
        let i,
            asianChars = 0,
            latinChars = 0,
            startAt,
            infoFields,
            field,
            pattern,
            matchFunction,
            match,
            fieldNumber;

        // for locales that support both latin and asian character addresses,
        // decide if we are parsing an asian or latin script address
        if (this.info && this.info.multiformat) {
            for (let j = 0; j < this.lines.length; j++) {
                const line = new IString(this.lines[j]);
                const it = line.charIterator();
                while (it.hasNext()) {
                    const c = it.next();
                    if (isIdeo(c) ||
                            withinRange(c, "hangul") ||
                            withinRange(c, 'katakana') ||
                            withinRange(c, 'hiragana') ||
                            withinRange(c, 'bopomofo')) {
                        asianChars++;
                    } else if (isAscii(c) && !isDigit(c)) {
                        latinChars++;
                    }
                }
            }

            this.format = (asianChars >= latinChars) ? "asian" : "latin";
            startAt = this.info.startAt[this.format];
            infoFields = this.info.fields[this.format];
            // console.log("multiformat locale: format is now " + this.format);
        } else {
            startAt = (this.info && this.info.startAt) || "end";
            infoFields = (this.info && this.info.fields) || [];
        }
        this.compare = (startAt === "end") ? this.endsWith : this.startsWith;

        //console.log("this.lines is: " + JSON.stringify(this.lines));

        for (i = 0; i < infoFields.length && this.lines.length > 0; i++) {
            field = infoFields[i];
            this.removeEmptyLines(this.lines);
            //console.log("Searching for field " + field.name);
            if (field.pattern) {
                if (typeof(field.pattern) === 'string') {
                    pattern = new RegExp(field.pattern, "img");
                    matchFunction = this.matchRegExp;
                } else {
                    pattern = field.pattern;
                    matchFunction = this.matchPattern;
                }

                switch (field.line) {
                case 'startAtFirst':
                    for (fieldNumber = 0; fieldNumber < this.lines.length; fieldNumber++) {
                        match = matchFunction(this, this.lines[fieldNumber], pattern, field.matchGroup, startAt);
                        if (match) {
                            break;
                        }
                    }
                    break;
                case 'startAtLast':
                    for (fieldNumber = this.lines.length-1; fieldNumber >= 0; fieldNumber--) {
                        match = matchFunction(this, this.lines[fieldNumber], pattern, field.matchGroup, startAt);
                        if (match) {
                            break;
                        }
                    }
                    break;
                case 'first':
                    fieldNumber = 0;
                    match = matchFunction(this, this.lines[fieldNumber], pattern, field.matchGroup, startAt);
                    break;
                case 'last':
                default:
                    fieldNumber = this.lines.length - 1;
                    match = matchFunction(this, this.lines[fieldNumber], pattern, field.matchGroup, startAt);
                    break;
                }
                if (match) {
                    // //console.log("found match for " + field.name + ": " + JSON.stringify(match));
                    // //console.log("remaining line is " + match.line);
                    this.lines[fieldNumber] = match.line;
                    this[field.name] = match.match;
                }
            } else {
                // if nothing is given, default to taking the whole field
                this[field.name] = this.lines.splice(fieldNumber,1)[0].trim();
                //console.log("typeof(this[field.name]) is " + typeof(this[field.name]) + " and value is " + JSON.stringify(this[field.name]));
            }
        }

        // all the left overs go in the street address field
        this.removeEmptyLines(this.lines);
        if (this.lines.length > 0) {
            //console.log("this.lines is " + JSON.stringify(this.lines) + " and splicing to get streetAddress");
            // Korea uses spaces between words, despite being an "asian" locale
            const joinString = (this.info.joinString && this.info.joinString[this.format]) || ((this.format && this.format === "asian") ? "" : ", ");
            this.streetAddress = this.lines.join(joinString).trim();
        }

        this.lines = undefined;
        //console.log("final result is " + JSON.stringify(this));
    }

    /**
     * @private
     * Find the named country either at the end or the beginning of the address.
     */
    _findCountry(name) {
        let start = -1, match, line = 0;

        if (this.lines.length > 0) {
            start = this.startsWith(this.lines[line], name);
            if (start === -1) {
                line = this.lines.length-1;
                start = this.endsWith(this.lines[line], name);
            }
            if (start !== -1) {
                match = {
                    text: this.lines[line].substring(start, start + name.length),
                    line,
                    start
                };
            }
        }

        return match;
    }

    /**
     * @private
     */
    endsWith(subject, query) {
        let start = subject.length-query.length,
            i,
            pat;
        //console.log("endsWith: checking " + query + " against " + subject);
        for (i = 0; i < query.length; i++) {
            // TODO: use case mapper instead of toLowerCase()
            if (subject.charAt(start+i).toLowerCase() !== query.charAt(i).toLowerCase()) {
                return -1;
            }
        }
        if (start > 0) {
            pat = /\s/;
            if (!pat.test(subject.charAt(start-1))) {
                // make sure if we are not at the beginning of the string, that the match is
                // not the end of some other word
                return -1;
            }
        }
        return start;
    }

    /**
     * @private
     */
    startsWith(subject, query) {
        let i;
        // //console.log("startsWith: checking " + query + " against " + subject);
        for (i = 0; i < query.length; i++) {
            // TODO: use case mapper instead of toLowerCase()
            if (subject.charAt(i).toLowerCase() !== query.charAt(i).toLowerCase()) {
                return -1;
            }
        }
        return 0;
    }

    /**
     * @private
     */
    removeEmptyLines(arr) {
        let i = 0;

        while (i < arr.length) {
            if (arr[i]) {
                arr[i] = arr[i].trim();
                if (arr[i].length === 0) {
                    arr.splice(i,1);
                } else {
                    i++;
                }
            } else {
                arr.splice(i,1);
            }
        }
    }

    /**
     * @private
     */
    matchRegExp(address, line, expression, matchGroup, startAt) {
        let lastMatch,
            match,
            ret = {},
            last;

        //console.log("searching for regexp " + expression.source + " in line " + line);

        match = expression.exec(line);
        if (startAt === 'end') {
            while (match !== null && match.length > 0) {
                //console.log("found matches " + JSON.stringify(match));
                lastMatch = match;
                match = expression.exec(line);
            }
            match = lastMatch;
        }

        if (match && match !== null) {
            //console.log("found matches " + JSON.stringify(match));
            matchGroup = matchGroup || 0;
            if (match[matchGroup] !== undefined) {
                ret.match = match[matchGroup].trim();
                ret.match = ret.match.replace(/^\-|\-+$/, '');
                ret.match = ret.match.replace(/\s+$/, '');
                last = (startAt === 'end') ? line.lastIndexOf(match[matchGroup]) : line.indexOf(match[matchGroup]);
                //console.log("last is " + last);
                ret.line = line.slice(0,last);
                if (address.format !== "asian") {
                    ret.line += " ";
                }
                ret.line += line.slice(last+match[matchGroup].length);
                ret.line = ret.line.trim();
                //console.log("found match " + ret.match + " from matchgroup " + matchGroup + " and rest of line is " + ret.line);
                return ret;
            }
        //} else {
            //console.log("no match");
        }

        return undefined;
    }

    /**
     * @private
     */
    matchPattern(address, line, pattern, matchGroup) {
        let start,
            j,
            ret = {};

        //console.log("searching in line " + line);

        // search an array of possible fixed strings
        //console.log("Using fixed set of strings.");
        for (j = 0; j < pattern.length; j++) {
            start = address.compare(line, pattern[j]);
            if (start !== -1) {
                ret.match = line.substring(start, start+pattern[j].length);
                if (start !== 0) {
                    ret.line = line.substring(0,start).trim();
                } else {
                    ret.line = line.substring(pattern[j].length).trim();
                }
                //console.log("found match " + ret.match + " and rest of line is " + ret.line);
                return ret;
            }
        }

        return undefined;
    }
};

export default Address;
