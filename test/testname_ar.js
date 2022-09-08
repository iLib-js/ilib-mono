/*
 * testname_ar.js - test the name object in Arabic
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

export const testname_ar = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            return LocaleData.ensureLocale("ar-SA").then(() => {
                callback();
            });
        } else {
            callback();
        }
    },

    testParseSimpleName_ar: function(test) {
        test.expect(2);
        const parsed = new Name("ابن سعود", {locale: 'ar-SA'});
        test.ok(typeof(parsed) !== "undefined");

        const expected =   {
            givenName: "ابن",
            familyName: "سعود"
        };

        test.contains(parsed, expected);
        test.done();
    },


    testParseAdjunctNames_ar: function(test) {
        test.expect(2);
        const parsed = new Name("ابن سعود", {locale: 'ar-SA'});
        test.ok(typeof(parsed) !== "undefined");

        const expected =  {
            givenName: "ابن",
            familyName: "سعود"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseSingleNameWithPrefixAndAdjunct_ar: function(test) {
        test.expect(2);
        const parsed = new Name("السيد و السيدة سعود", {locale: 'ar-SA'});
        test.ok(typeof(parsed) !== "undefined");

        const expected =   {
            prefix: "السيد و السيدة",
            familyName: "سعود"
        };

        test.contains(parsed, expected);
        test.done();
    },


    testParseTitle_ar: function(test) {
        test.expect(2);
        const parsed = new Name("ابن سعود كبار", {locale: 'ar-SA'});
        test.ok(typeof(parsed) !== "undefined");

        const expected =    {
            suffix: "كبار",
            givenName: "ابن",
            familyName: "سعود"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseTitleWithFamilyOnly_ar: function(test) {
        test.expect(2);
        const parsed = new Name("الملك سعود", {locale: 'ar-SA'});
        test.ok(typeof(parsed) !== "undefined");

        const expected =   {
            prefix: "الملك",
            familyName: "سعود"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseEverything_ar: function(test) {
        test.expect(2);
        const parsed = new Name("الملك ابن سعود", {locale: 'ar-SA'});
        test.ok(typeof(parsed) !== "undefined");

        const expected =    {
            prefix: "الملك",
            givenName: "ابن",
            familyName: "سعود"
        };

        test.contains(parsed, expected);
        test.done();
    },


    /*
     * Format Tests
     */

    testFormatSimpleNameShort_ar: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "ابن",
            familyName: "سعود"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'ar-SA'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "ابن سعود";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameMedium_ar: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "ابن",
            familyName: "سعود"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'ar-SA'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "ابن سعود";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameLong_ar: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "ابن",

            familyName: "سعود",
            suffix: "كبار"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'ar-SA'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "ابن سعود";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameFull_ar: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "الملك",
            givenName: "ابن",
            familyName: "سعود",
            suffix: "كبار"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'ar-SA'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "الملك ابن سعود كبار";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameShort_ar: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "الملك",
            givenName: "ابن",
            familyName: "سعود"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'ar-SA'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "ابن سعود";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameMedium_ar: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "الملك",
            givenName: "ابن",
            familyName: "سعود"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'ar-SA'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "ابن سعود";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameLong_ar: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "الملك",
            givenName: "ابن",
            familyName: "سعود"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'ar-SA'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "الملك ابن سعود";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatAsianNameShort_ar: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'ar-SA'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "地獸";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatAsianNameMedium_ar: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'ar-SA'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "地獸";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatAsianNameLong_ar: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'ar-SA'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "小地獸";

        test.equal(formatted, expected);
        test.done();
    }
};
