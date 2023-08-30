/*
 * CaseMapper.js - define upper- and lower-case string mapper
 *
 * Copyright © 2014-2015, 2018, 2023 JEDLSoft
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

import { getBrowser } from 'ilib-env';
import Locale from 'ilib-locale';
import IString from 'ilib-istring';

/**
 * @class A class that can map strings to upper and lower case in a 
 * locale-sensitive manner.
 */
class CaseMapper {
    /**
     * Create a new string case mapper instance that maps strings to upper or
     * lower case. This mapping will work for any string as characters
     * that have no case will be returned unchanged.<p>
     *
     * The options may contain any of the following properties:
     *
     * <ul>
     * <li><i>locale</i> - locale to use when loading the mapper. Some maps are
     * locale-dependent, and this locale selects the right one. Default if this is
     * not specified is the current locale.
     *
     * <li><i>direction</i> - "toupper" for upper-casing, or "tolower" for lower-casing.
     * Default if not specified is "toupper".
     * </ul>
     *
     * @constructor
     * @param {Object=} options options to initialize this mapper
     */
    constructor(options) {
        this.up = true;
        this.locale = new Locale();
    
        if (options) {
            if (typeof(options.locale) !== 'undefined') {
                this.locale = (typeof(options.locale) === 'string') ? new Locale(options.locale) : options.locale;
            }
    
            this.up = (!options.direction || options.direction === "toupper");
        }
    
        this.mapData = this.up ? {
            "ß": "SS",       // German
            'ΐ': 'Ι',        // Greek
            'ά': 'Α',
            'έ': 'Ε',
            'ή': 'Η',
            'ί': 'Ι',
            'ΰ': 'Υ',
            'ϊ': 'Ι',
            'ϋ': 'Υ',
            'ό': 'Ο',
            'ύ': 'Υ',
            'ώ': 'Ω',
            'Ӏ': 'Ӏ',        // Russian and slavic languages
            'ӏ': 'Ӏ'
        } : {
            'Ӏ': 'Ӏ'         // Russian and slavic languages
        };
    
        switch (this.locale.getLanguage()) {
            case "az":
            case "tr":
            case "crh":
            case "kk":
            case "krc":
            case "tt":
                var lower = "iı";
                var upper = "İI";
                this.setUpMap(lower, upper);
                break;
        }
        const browser = getBrowser();
        if (browser === "ie" || browser === "Edge") {
            // IE is missing these mappings for some reason
            if (this.up) {
                this.mapData['ς'] = 'Σ';
            }
            this.setUpMap("ⲁⲃⲅⲇⲉⲋⲍⲏⲑⲓⲕⲗⲙⲛⲝⲟⲡⲣⲥⲧⲩⲫⲭⲯⲱⳁⳉⳋ", "ⲀⲂⲄⲆⲈⲊⲌⲎⲐⲒⲔⲖⲘⲚⲜⲞⲠⲢⲤⲦⲨⲪⲬⲮⲰⳀⳈⳊ"); // Coptic
            // Georgian Nuskhuri <-> Asomtavruli
            this.setUpMap("ⴀⴁⴂⴃⴄⴅⴆⴇⴈⴉⴊⴋⴌⴍⴎⴏⴐⴑⴒⴓⴔⴕⴖⴗⴘⴙⴚⴛⴜⴝⴞⴟⴠⴡⴢⴣⴤⴥ", "ႠႡႢႣႤႥႦႧႨႩႪႫႬႭႮႯႰႱႲႳႴႵႶႷႸႹႺႻႼႽႾႿჀჁჂჃჄჅ");
        }
    }

    /**
     * @private
     */
    charMapper(string) {
        if (!string) {
            return string;
        }
        const input = (typeof(string) === 'string') ? new IString(string) : string.toString();
        let ret = "";
        let it = input.charIterator();
        let c;

        // use an iterator so that we skip over UTF-16 code points properly
        while (it.hasNext()) {
            c = it.next();
            if (!this.up && c === 'Σ') {
                if (it.hasNext()) {
                    c = it.next();
                    const code = c.charCodeAt(0);
                    // if the next char is not a greek letter, this is the end of the word so use the
                    // final form of sigma. Otherwise, use the mid-word form.
                    ret += ((code < 0x0388 && code !== 0x0386) || code > 0x03CE) ? 'ς' : 'σ';
                    ret += c.toLowerCase();
                } else {
                    // no next char means this is the end of the word, so use the final form of sigma
                    ret += 'ς';
                }
            } else {
                if (this.mapData[c]) {
                    ret += this.mapData[c];
                } else {
                    ret += this.up ? c.toUpperCase() : c.toLowerCase();
                }
            }
        }

        return ret;
    }

    /** @private */
    setUpMap(lower, upper) {
        let from, to;
        if (this.up) {
            from = lower;
            to = upper;
        } else {
            from = upper;
            to = lower;
        }
        for (var i = 0; i < upper.length; i++) {
            this.mapData[from[i]] = to[i];
        }
    }

    /**
     * Return the locale that this mapper was constructed with.
     * @returns {Locale} the locale that this mapper was constructed with
     */
    getLocale() {
        return this.locale;
    }

    /**
     * Map a string to lower case in a locale-sensitive manner.
     *
     * @param {string|undefined} string
     * @returns {string|undefined}
     */
    map(string) {
        return this.charMapper(string);
    }
};

export default CaseMapper;
