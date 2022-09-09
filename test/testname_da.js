/*
 * testname_da.js - test the name object in Danish
 *
 * Copyright © 2013-2015,2017,2022 JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Udaess required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import NameFmt from '../src/NameFmt.js';
import Name from '../src/Name.js';
import { LocaleData } from 'ilib-localedata';
import { getPlatform } from 'ilib-env';

let setUpPerformed = false;


export const testname_da = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            return LocaleData.ensureLocale("da-DK").then(() => {
                callback();
            });
        } else {
            callback();
        }
    },

    testDKParseSimpleName: function(test) {
        test.expect(2);
        const parsed = new Name("Maren Jensdatter", {locale: 'da-DK'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Maren",
            familyName: "Jensdatter"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testDKParseTripleName: function(test) {
        test.expect(2);
        const parsed = new Name("Jan Michael Jensdatter", {locale: 'da-DK'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Jan",
            middleName: "Michael",
            familyName: "Jensdatter"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testDKParseAdjunctNames: function(test) {
        test.expect(2);
        const parsed = new Name("Jan Michael Jensdatter", {locale: 'da-DK'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Jan",
            middleName: "Michael",
            familyName: "Jensdatter"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testDKParseMultiAdjunctNames: function(test) {
        test.expect(2);
        const parsed = new Name("Jan Michael Jensdatter", {locale: 'da-DK'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Jan",
            familyName: "Jensdatter"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testDKParseHypenatedName: function(test) {
        test.expect(2);
        const parsed = new Name("Jan Michael Bergische-Jensdatter", {locale: 'da-DK'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Jan",
            middleName: "Michael",
            familyName: "Bergische-Jensdatter"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testDKParseQuadrupleName: function(test) {
        test.expect(2);
        const parsed = new Name("Jan Michael Jürgen Jensdatter", {locale: 'da-DK'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Jan",
            middleName: "Michael Jürgen",
            familyName: "Jensdatter"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testDKParseTitle: function(test) {
        test.expect(2);
        const parsed = new Name("Dr. Jan Jensdatter", {locale: 'da-DK'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Dr.",
            givenName: "Jan",
            familyName: "Jensdatter"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testDKParseHonorific: function(test) {
        test.expect(2);
        const parsed = new Name("Fru Julia Jensdatter", {locale: 'da-DK'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Fru",
            givenName: "Julia",
            familyName: "Jensdatter"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testDKParseEverything: function(test) {
        test.expect(2);
        const parsed = new Name("Præsident Jan Michael Jürgen Jensdatter Jr.", {locale: 'da-DK'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Præsident",
            givenName: "Jan",
            middleName: "Michael Jürgen",
            familyName: "Jensdatter",
            suffix: "Jr."
        };

        test.contains(parsed, expected);
        test.done();
    },

    /*
     * Format Tests
     */

    testDKFormatSimpleNameShort: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Jan",
            middleName: "Michael",
            familyName: "Jensdatter"
        });
        let fmt = new NameFmt({style: "short", locale: 'da-DK'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Jan Jensdatter";

        test.equal(formatted, expected);
        test.done();
    },

    testDKFormatSimpleNameMedium: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Jan",
            middleName: "Michael",
            familyName: "Jensdatter"
        });
        let fmt = new NameFmt({style: "medium", locale: 'da-DK'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Jan Michael Jensdatter";

        test.equal(formatted, expected);
        test.done();
    },

    testDKFormatSimpleNameLong: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Jan",
            middleName: "Michael",
            familyName: "Jensdatter"
        });
        let fmt = new NameFmt({style: "long", locale: 'da-DK'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Jan Michael Jensdatter";

        test.equal(formatted, expected);
        test.done();
    },

    testDKFormatSimpleNameFull: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Jan",
            middleName: "Michael",
            familyName: "Jensdatter"
        });
        let fmt = new NameFmt({style: "full", locale: 'da-DK'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Jan Michael Jensdatter";

        test.equal(formatted, expected);
        test.done();
    },

    testDKFormatComplexNameShort: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Dr.",
            givenName: "Jan",
            middleName: "Michael Pieter",
            familyName: "Jensdatter",
            suffix: "III"
        });
        let fmt = new NameFmt({style: "short", locale: 'da-DK'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Jan Jensdatter";

        test.equal(formatted, expected);
        test.done();
    },

    testDKFormatComplexNameMedium: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Dr.",
            givenName: "Jan",
            middleName: "Michael Pieter",
            familyName: "Jensdatter",
            suffix: "III"
        });
        let fmt = new NameFmt({style: "medium", locale: 'da-DK'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Jan Michael Pieter Jensdatter";

        test.equal(formatted, expected);
        test.done();
    },

    testDKFormatComplexNameLong: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Dr.",
            givenName: "Jan",
            middleName: "Michael Pieter",
            familyName: "Jensdatter",
            suffix: "III"
        });
        let fmt = new NameFmt({style: "long", locale: 'da-DK'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Dr. Jan Michael Pieter Jensdatter";

        test.equal(formatted, expected);
        test.done();
    },

    testDKFormatComplexNameFull: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Dr.",
            givenName: "Jan",
            middleName: "Michael Pieter",
            familyName: "Jensdatter",
            suffix: "III"
        });
        let fmt = new NameFmt({style: "full", locale: 'da-DK'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Dr. Jan Michael Pieter Jensdatter III";

        test.equal(formatted, expected);
        test.done();
    },

    testDKFormatAsianNameShort: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "short", locale: 'da-DK'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "地獸";

        test.equal(formatted, expected);
        test.done();
    },

    testDKFormatAsianNameMedium: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "medium", locale: 'da-DK'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "地獸";

        test.equal(formatted, expected);
        test.done();
    },

    testDKFormatAsianNameLong: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "long", locale: 'da-DK'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "小地獸";

        test.equal(formatted, expected);
        test.done();
    },

    testDKFormatAsianNameFull: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "full", locale: 'da-DK'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "小地獸太太";

        test.equal(formatted, expected);
        test.done();
    },

    testParseSimpleName_da_DK: function(test) {
        test.expect(2);
        const parsed = new Name("Raeburn van Buren", {locale: 'da-DK'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Raeburn",
            familyName: "van Buren"
        };

        test.contains(parsed, expected);
        test.done();
    },


    testParseAdjunctNames_da_DK: function(test) {
        test.expect(2);
        const parsed = new Name("Humphrey Dallas Bogart", {locale: 'da-DK'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Humphrey",
            middleName: "Dallas",
            familyName: "Bogart"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseSingleName_da_DK: function(test) {
        test.expect(2);
        const parsed = new Name("Armin", {locale: 'da-DK'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Armin",
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseSingleNameWithPrefixAndAdjunct_da_DK: function(test) {
        test.expect(2);
        const parsed = new Name("meneer Raeburn van Buren", {locale: 'da-DK'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "meneer",
            familyName: "van Buren"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseHypenatedName_da_DK: function(test) {
        test.expect(2);
        const parsed = new Name("Raeburn van Buren", {locale: 'da-DK'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Raeburn",
            familyName: "van Buren"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseQuadrupleName_da_DK: function(test) {
        test.expect(2);
        const parsed = new Name("Raeburn Jürgen van Buren", {locale: 'da-DK'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Raeburn",
            middleName: "Jürgen",
            familyName: "van Buren"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseTitle_da_DK: function(test) {
        test.expect(2);
        const parsed = new Name("meneer Dr. Raeburn van Buren", {locale: 'da-DK'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "meneer Dr.",
            givenName: "Raeburn",
            familyName: "van Buren"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseTitle_da_DK: function(test) {
        test.expect(2);
        const parsed = new Name("meneer Dr. Raeburn van Buren", {locale: 'da-DK'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "meneer Dr.",
            givenName: "Raeburn",
            familyName: "van Buren"
        };

        test.contains(parsed, expected);
        test.done();
    },


    testParseTitleWithFamilyOnly_da_DK: function(test) {
        test.expect(2);
        const parsed = new Name("meneer van Buren", {locale: 'da-DK'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "meneer",
            familyName: "van Buren"
        };

        test.contains(parsed, expected);
        test.done();
    },


    testParseHonorific_da_DK: function(test) {
        test.expect(2);
        const parsed = new Name("Fr. Julia Maier", {locale: 'da-DK'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Fr.",
            givenName: "Julia",
            familyName: "Maier"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseEverything_da_DK: function(test) {
        test.expect(2);
        const parsed = new Name("guvernør Raeburn Jürgen van Buren pensioneret", {locale: 'da-DK'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "guvernør",
            givenName: "Raeburn",
            middleName: "Jürgen",
            familyName: "van Buren",
            suffix: "pensioneret"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseCompoundHonorific_da_DK: function(test) {
        test.expect(2);
        const parsed = new Name("Mr. Buren", {locale: 'da-DK'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Mr.",
            familyName: "Buren"
        };

        test.contains(parsed, expected);
        test.done();
    },

    /*
     * Format Tests
     */

    testFormatSimpleNameShort_da_DK: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Raeburn",
            middleName: "Michael",
            familyName: "van Buren"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'da-DK'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Raeburn van Buren";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameMedium_da_DK: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Raeburn",
            familyName: "van Buren"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'da-DK'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Raeburn van Buren";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameLong_da_DK: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Raeburn",
            familyName: "van Buren",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'da-DK'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Raeburn van Buren";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameFull_da_DK: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "meneer Dr.",
            givenName: "Raeburn",
            familyName: "van Buren",
            suffix: "pensioneret"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'da-DK'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "meneer Dr. Raeburn van Buren pensioneret";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameShort_da_DK: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "meneer Dr.",
            givenName: "Raeburn",
            middleName: "Michael Uwe",
            familyName: "von van Buren",
            suffix: "pensioneret"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'da-DK'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Raeburn von van Buren";

        test.equal(formatted, expected);
        test.done();
    },



    testFormatComplexNameLong_da_DK: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "meneer Dr.",
            givenName: "Raeburn",
            middleName: "Michael Uwe",
            familyName: "von van Buren",
            suffix: "pensioneret"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'da-DK'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "meneer Dr. Raeburn Michael Uwe von van Buren pensioneret";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatAsianNameShort_da_DK: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'da-DK'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "地獸";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatAsianNameMedium_da_DK: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'da-DK'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "地獸";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatAsianNameLong_da_DK: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'da-DK'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "小地獸太太";

        test.equal(formatted, expected);
        test.done();
    }
};
