/*
 * testname_nl.js - test the name object in Dutch
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


export const testname_nl = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            return LocaleData.ensureLocale("nl-NL").then(() => {
                callback();
            });
        } else {
            callback();
        }
    },

    testNLParseSimpleName: function(test) {
        test.expect(2);
        const parsed = new Name("Jan Hoogeboom", {locale: 'nl-NL'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Jan",
            familyName: "Hoogeboom"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testNLParseTripleName: function(test) {
        test.expect(2);
        const parsed = new Name("Jan Michael Hoogeboom", {locale: 'nl-NL'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Jan",
            middleName: "Michael",
            familyName: "Hoogeboom"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testNLParseAdjunctNames: function(test) {
        test.expect(2);
        const parsed = new Name("Ludwig Klaus von Beethoven", {locale: 'nl-NL'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Ludwig",
            middleName: "Klaus",
            familyName: "von Beethoven"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testNLParseMultiAdjunctNames: function(test) {
        test.expect(2);
        const parsed = new Name("Geertje van den Bosch", {locale: 'nl-NL'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Geertje",
            familyName: "van den Bosch"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testNLParseHypenatedName: function(test) {
        test.expect(2);
        const parsed = new Name("Jan Michael Bergische-Hoogeboom", {locale: 'nl-NL'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Jan",
            middleName: "Michael",
            familyName: "Bergische-Hoogeboom"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testNLParseQuadrupleName: function(test) {
        test.expect(2);
        const parsed = new Name("Jan Michael Jürgen Hoogeboom", {locale: 'nl-NL'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Jan",
            middleName: "Michael Jürgen",
            familyName: "Hoogeboom"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testNLParseTitle: function(test) {
        test.expect(2);
        const parsed = new Name("Dr. Jan Hoogeboom", {locale: 'nl-NL'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Dr.",
            givenName: "Jan",
            familyName: "Hoogeboom"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testNLParseHonorific: function(test) {
        test.expect(2);
        const parsed = new Name("Mvw. Julia Maier", {locale: 'nl-NL'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Mvw.",
            givenName: "Julia",
            familyName: "Maier"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testNLParseEverything: function(test) {
        test.expect(2);
        const parsed = new Name("President Jan Michael Jürgen Hoogeboom Jr.", {locale: 'nl-NL'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "President",
            givenName: "Jan",
            middleName: "Michael Jürgen",
            familyName: "Hoogeboom",
            suffix: "Jr."
        };

        test.contains(parsed, expected);
        test.done();
    },

    /*
     * Format Tests
     */

    testNLFormatSimpleNameShort: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Jan",
            middleName: "Michael",
            familyName: "Hoogeboom"
        });
        let fmt = new NameFmt({style: "short", locale: 'nl-NL'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Jan Hoogeboom";

        test.equal(formatted, expected);
        test.done();
    },

    testNLFormatSimpleNameMedium: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Jan",
            middleName: "Michael",
            familyName: "Hoogeboom"
        });
        let fmt = new NameFmt({style: "medium", locale: 'nl-NL'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Jan Michael Hoogeboom";

        test.equal(formatted, expected);
        test.done();
    },

    testNLFormatSimpleNameLong: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Jan",
            middleName: "Michael",
            familyName: "Hoogeboom"
        });
        let fmt = new NameFmt({style: "long", locale: 'nl-NL'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Jan Michael Hoogeboom";

        test.equal(formatted, expected);
        test.done();
    },

    testNLFormatSimpleNameFull: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Jan",
            middleName: "Michael",
            familyName: "Hoogeboom"
        });
        let fmt = new NameFmt({style: "full", locale: 'nl-NL'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Jan Michael Hoogeboom";

        test.equal(formatted, expected);
        test.done();
    },

    testNLFormatComplexNameShort: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Dr.",
            givenName: "Jan",
            middleName: "Michael Pieter",
            familyName: "van der Smits",
            suffix: "III"
        });
        let fmt = new NameFmt({style: "short", locale: 'nl-NL'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Jan van der Smits";

        test.equal(formatted, expected);
        test.done();
    },

    testNLFormatComplexNameMedium: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Dr.",
            givenName: "Jan",
            middleName: "Michael Pieter",
            familyName: "van der Smits",
            suffix: "III"
        });
        let fmt = new NameFmt({style: "medium", locale: 'nl-NL'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Jan Michael Pieter van der Smits";

        test.equal(formatted, expected);
        test.done();
    },

    testNLFormatComplexNameLong: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Dr.",
            givenName: "Jan",
            middleName: "Michael Pieter",
            familyName: "van der Smits",
            suffix: "III"
        });
        let fmt = new NameFmt({style: "long", locale: 'nl-NL'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Dr. Jan Michael Pieter van der Smits";

        test.equal(formatted, expected);
        test.done();
    },

    testNLFormatComplexNameFull: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Dr.",
            givenName: "Jan",
            middleName: "Michael Pieter",
            familyName: "van der Smits",
            suffix: "III"
        });
        let fmt = new NameFmt({style: "full", locale: 'nl-NL'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Dr. Jan Michael Pieter van der Smits III";

        test.equal(formatted, expected);
        test.done();
    },

    testNLFormatAsianNameShort: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "short", locale: 'nl-NL'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "地獸";

        test.equal(formatted, expected);
        test.done();
    },

    testNLFormatAsianNameMedium: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "medium", locale: 'nl-NL'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "地獸";

        test.equal(formatted, expected);
        test.done();
    },

    testNLFormatAsianNameLong: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "long", locale: 'nl-NL'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "小地獸";

        test.equal(formatted, expected);
        test.done();
    },

    testNLFormatAsianNameFull: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "full", locale: 'nl-NL'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "小地獸太太";

        test.equal(formatted, expected);
        test.done();
    }

};
