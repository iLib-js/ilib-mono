/*
 * testname_en.js - test the name object in Japanese
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


export const testname_et = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            return LocaleData.ensureLocale("et-EE").then(() => {
                callback();
            });
        } else {
            callback();
        }
    },

    testParseSimpleName_et_EE: function(test) {
        test.expect(2);
        const parsed = new Name("Kertu-Triin Sepp", {locale: 'et-EE'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Kertu-Triin",
            familyName: "Sepp"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseSimpleName_et_EE: function(test) {
        test.expect(2);
        const parsed = new Name("professor Kertu Sepp", {locale: 'et-EE'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix : "professor",
            givenName: "Kertu",
            familyName: "Sepp"

        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseSingleNameWithPrefixAndAdjunct_et_EE: function(test) {
        test.expect(2);
        const parsed = new Name("Kertu-Triin Sepp jr.", {locale: 'et-EE'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
             suffix : "jr.",
            givenName: "Kertu-Triin",
            familyName: "Sepp"
        };

        test.contains(parsed, expected);
        test.done();
    },


    testParseTitle_et_EE1: function(test) {
        test.expect(2);
        const parsed = new Name("Hr. Kertu-Triin Sepp", {locale: 'et-EE'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix : "Hr.",
            givenName: "Kertu-Triin",
            familyName: "Sepp"
        };

        test.contains(parsed, expected);
        test.done();
    },


    testParseTitle_et_EE_second: function(test) {
        test.expect(2);
        const parsed = new Name("Prl. Kertu-Triin Sepp", {locale: 'et-EE'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix : "Prl.",
            givenName: "Kertu-Triin",
            familyName: "Sepp"
        };

        test.contains(parsed, expected);
        test.done();
    },


    testParseTitleWithFamilyOnlyAndAdjunct_et_EE: function(test) {
        test.expect(2);

        let name = new Name({
            prefix: "Hr.",
            givenName: "Kertu-Triin",
            familyName: "Sepp",
            suffix: "pensionile"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'et-EE'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Hr. Kertu-Triin Sepp pensionile";

        test.equal(formatted, expected);
        test.done();

    },


    testParseTitleWithFamilyOnlyAndAdjunctex_et_EE: function(test) {
        test.expect(2);
        const parsed = new Name("inspektor Kertu-Triin Sepp pensionile", {locale: 'et-EE'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "inspektor",
            givenName: "Kertu-Triin",
            familyName: "Sepp",
            suffix : "pensionile"
        };

        test.contains(parsed, expected);
        test.done();
    },


    testParseCompoundHonorific_et_EE: function(test) {
        test.expect(2);
        const parsed = new Name("Hr. Sepp", {locale: 'et-EE'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Hr.",
            familyName: "Sepp"
        };

        test.contains(parsed, expected);
        test.done();
    },

    /*
     * Format Tests
     */

    testFormatSimpleNameShort_et_EE: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Kertu-Triin",
            familyName: "Sepp"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'et-EE'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Kertu-Triin Sepp";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameMedium_et_EE: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Kertu-Triin",
            familyName: "Sepp"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'et-EE'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Kertu-Triin Sepp";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameFull_et_EE: function(test) {
        test.expect(2);
        let name = new Name({

            givenName: "Kertu-Triin",
            familyName: "Sepp",
            suffix: "pensionile"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'et-EE'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Kertu-Triin Sepp pensionile";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameShort_et_EE: function(test) {
        test.expect(2);
        let name = new Name({
            suffix: "pensionile",
            givenName: "Kertu-Triin",
            familyName: "Sepp"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'et-EE'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Kertu-Triin Sepp";

        test.equal(formatted, expected);
        test.done();
    },


    testFormatAsianNameMedium_et_EE: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'et-EE'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "地獸";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatAsianNameLong_et_EE: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'et-EE'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "小地獸太太";

        test.equal(formatted, expected);
        test.done();
    }




};
