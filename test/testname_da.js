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
import LocaleData from 'ilib-localedata';
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
    }

};
