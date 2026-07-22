/*
 * testname_en.js - test the name object in Hungarian
 *
 * Copyright © 2013-2015,2017,2022 JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICJASE-2.0
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


export const testname_hu = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            return LocaleData.ensureLocale("hu-HU").then(() => {
                callback();
            });
        } else {
            callback();
        }
    },

    testParseSimpleName_hu_HU: function(test) {
        test.expect(2);
        const parsed = new Name("Halász Dorottya", {locale: 'hu-HU'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Dorottya",
            familyName: "Halász"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseSimpleName_hu_HU1: function(test) {
        test.expect(2);
        const parsed = new Name("úr. Halász Dorottya", {locale: 'hu-HU'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix : "úr.",
            givenName: "Dorottya",
            familyName: "Halász"

        };

        test.contains(parsed, expected);
        test.done();
    },


    testParseSimpleNameWom_hu_HU: function(test) {
        test.expect(2);
        const parsed = new Name("Kisasszony. Kovács Lajos", {locale: 'hu-HU'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix : "Kisasszony.",
            givenName: "Lajos",
            familyName: "Kovács"

        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseSingleNameWithPrefixAndAdjunct_hu_HU: function(test) {
        test.expect(2);
        const parsed = new Name("Halász Dorottya jr.", {locale: 'hu-HU'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            suffix : "jr.",
            givenName: "Dorottya",
            familyName: "Halász"
        };

        test.contains(parsed, expected);
        test.done();
    },


    testParseTitle_hu_HU1: function(test) {
        test.expect(2);
        const parsed = new Name("alelnöke Halász Dorottya", {locale: 'hu-HU'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix : "alelnöke",
                familyName: "Halász",
            givenName: "Dorottya"
        };

        test.contains(parsed, expected);
        test.done();
    },


    testParseTitle_hu_HU_second: function(test) {
        test.expect(2);
        const parsed = new Name("Úr. és Kisasszony. Halász", {locale: 'hu-HU'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            familyName: "Halász",
            prefix: "Úr. és Kisasszony."
        };

        test.contains(parsed, expected);
        test.done();
    },


    testParseTitleWithFamilyOnlyAndAdjunct_hu_HU: function(test) {
        test.expect(2);

        let name = new Name({
            prefix: "alelnöke",
            givenName: "Dorottya",

            familyName: "Halász",
            suffix: "idősebb"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'hu-HU'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "alelnöke Halász Dorottya idősebb";

        test.equal(formatted, expected);
        test.done();

    },



    testParseCompoundHonorific_hu_HU: function(test) {
        test.expect(2);
        const parsed = new Name("alelnöke Halász", {locale: 'hu-HU'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "alelnöke",
            familyName: "Halász"
        };

        test.contains(parsed, expected);
        test.done();
    },

    /*
     * Format Tests
     */

    testFormatSimpleNameShort_hu_HU: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Dorottya",
            familyName: "Halász"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'hu-HU'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Halász Dorottya";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameMedium_hu_HU: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Dorottya",
            familyName: "Halász"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'hu-HU'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Halász Dorottya";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameFull_hu_HU: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Dorottya",
            familyName: "Halász",
            suffix: "idősebb"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'hu-HU'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Halász Dorottya idősebb";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameShort_hu_HU: function(test) {
        test.expect(2);
        let name = new Name({
            suffix: "idősebb",
            givenName: "Dorottya",
            familyName: "Halász"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'hu-HU'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Halász Dorottya";

        test.equal(formatted, expected);
        test.done();
    },


    testFormatAsianNameMedium_hu_HU: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'hu-HU'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "地獸";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatAsianNameLong_hu_HU: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'hu-HU'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "小地獸太太";

        test.equal(formatted, expected);
        test.done();
    }




};
