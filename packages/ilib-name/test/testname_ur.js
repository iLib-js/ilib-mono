/*
 * testname_ur_IN.js - test the name object in Urdu
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
import { LocaleData } from 'ilib-localedata';
import { getPlatform } from 'ilib-env';

let setUpPerformed = false;


export const testname_ur = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            return LocaleData.ensureLocale("ur-IN").then(() => {
                callback();
            });
        } else {
            callback();
        }
    },

    testParseSimpleName_ur_IN: function(test) {
        test.expect(2);
        const parsed = new Name("موہن لال", {locale: 'ur-IN'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "موہن",
            familyName: "لال"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseTitle_ur_IN: function(test) {
        test.expect(2);
        const parsed = new Name("موہن لال میں", {locale: 'ur-IN'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            suffix: "میں",
            givenName: "موہن",
            familyName: "لال"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseTitleWithFamilyOnly_ur_IN: function(test) {
        test.expect(2);
        const parsed = new Name("مسٹر لال", {locale: 'ur-IN'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "مسٹر",
            familyName: "لال"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseEverything_ur_IN: function(test) {
        test.expect(2);
        const parsed = new Name("مسٹر اور مسز لال", {locale: 'ur-IN'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "مسٹر اور مسز",
            familyName: "لال"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseprefix_ur_IN: function(test) {
        test.expect(2);
        const parsed = new Name("مسٹر موہن لال", {locale: 'ur-IN'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "مسٹر",
            givenName: "موہن",
            familyName: "لال"
        };

        test.contains(parsed, expected);
        test.done();
    },
    /*
     * Format Tests
     */

    testFormatSimpleNameShort_ur_IN: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "موہن",
            familyName: "لال"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'ur-IN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "موہن لال";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameMedium_ur_IN: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "موہن",
            familyName: "لال"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'ur-IN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "موہن لال";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameLong_ur_IN: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "موہن",
            familyName: "لال"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'ur-IN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "موہن لال";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSurname_ur_IN: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "مسٹر اور مسز",
            familyName: "لال"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'ur-IN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "مسٹر اور مسز لال";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameFull_ur_IN: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "ڈاکٹر",
            givenName: "موہن",
            familyName: "لال",
            suffix: "میں"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'ur-IN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "ڈاکٹر موہن لال میں";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameShort_ur_IN: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "ڈاکٹر",
            givenName: "موہن",
            familyName: "لال"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'ur-IN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "موہن لال";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameMedium_ur_IN: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "ڈاکٹر",
            givenName: "موہن",
            familyName: "لال"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'ur-IN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "موہن لال";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameLong_ur_IN: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "ڈاکٹر",
            givenName: "موہن",
            familyName: "لال"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'ur-IN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "ڈاکٹر موہن لال";

        test.equal(formatted, expected);
        test.done();
    }



};
