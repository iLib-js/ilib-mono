/*
 * testname_he.js - test the name object in Hebrew
 *
 * Copyright © 2013-2015,2017,2022 JEDLSoft
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

import NameFmt from '../src/NameFmt.js';
import Name from '../src/Name.js';
import LocaleData from 'ilib-localedata';
import { getPlatform } from 'ilib-env';

let setUpPerformed = false;


export const testname_he = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            return LocaleData.ensureLocale("he-IL").then(() => {
                callback();
            });
        } else {
            callback();
        }
    },

    testParseSimpleName_he: function(test) {
        test.expect(2);
        const parsed = new Name("נטלי פורטמן", {locale: 'he-IL'});
        test.ok(typeof(parsed) !== "undefined");

        const expected =   {
            givenName: "נטלי",
            familyName: "פורטמן"
        };

        test.contains(parsed, expected);
        test.done();
    },


    testParseAdjunctNames_he: function(test) {
        test.expect(2);
        const parsed = new Name("נטלי פורטמן", {locale: 'he-IL'});
        test.ok(typeof(parsed) !== "undefined");

        const expected =  {
            givenName: "נטלי",
            familyName: "פורטמן"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseSingleNameWithPrefixAndAdjunct_he: function(test) {
        test.expect(2);
        const parsed = new Name("מר ו - גברת פורטמן", {locale: 'he-IL'});
        test.ok(typeof(parsed) !== "undefined");

        const expected =   {
            prefix: "מר ו - גברת",
            familyName: "פורטמן"
        };

        test.contains(parsed, expected);
        test.done();
    },


    testParseTitle_he: function(test) {
        test.expect(2);
        const parsed = new Name("נטלי פורטמן דוקטור", {locale: 'he-IL'});
        test.ok(typeof(parsed) !== "undefined");

        const expected =    {
            suffix: "דוקטור",
            givenName: "נטלי",
            familyName: "פורטמן"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseTitleWithFamilyOnly_he: function(test) {
        test.expect(2);
        const parsed = new Name("גברת פורטמן", {locale: 'he-IL'});
        test.ok(typeof(parsed) !== "undefined");

        const expected =   {
            prefix: "גברת",
            familyName: "פורטמן"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseEverything_he: function(test) {
        test.expect(2);
        const parsed = new Name("גברת נטלי פורטמן", {locale: 'he-IL'});
        test.ok(typeof(parsed) !== "undefined");

        const expected =    {
            prefix: "גברת",
            givenName: "נטלי",
            familyName: "פורטמן"
        };

        test.contains(parsed, expected);
        test.done();
    },


    /*
     * Format Tests
     */

    testFormatSimpleNameShort_he: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "נטלי",
            familyName: "פורטמן"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'he-IL'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "נטלי פורטמן";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameMedium_he: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "נטלי",
            familyName: "פורטמן"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'he-IL'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "נטלי פורטמן";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameLong_he: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "נטלי",
            familyName: "פורטמן",
            suffix: "דוקטור"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'he-IL'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "נטלי פורטמן";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameFull_he: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "ראש הממשלה",
            givenName: "נטלי",

            familyName: "פורטמן",
            suffix: "לשעבר"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'he-IL'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "ראש הממשלה נטלי פורטמן לשעבר";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameShort_he: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "ראש הממשלה",
            givenName: "נטלי",

            familyName: "פורטמן",
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'he-IL'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "נטלי פורטמן";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameMedium_he: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "ראש הממשלה",
            givenName: "נטלי",

            familyName: "פורטמן",
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'he-IL'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "נטלי פורטמן";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameLong_he: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "ראש הממשלה",
            givenName: "נטלי",

            familyName: "פורטמן",
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'he-IL'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "ראש הממשלה נטלי פורטמן";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatAsianNameShort_he: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'he-IL'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "地獸";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatAsianNameMedium_he: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'he-IL'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "地獸";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatAsianNameLong_he: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'he-IL'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "小地獸";

        test.equal(formatted, expected);
        test.done();
    }






};
