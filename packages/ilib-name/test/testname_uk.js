/*
 * testname_uk_UA.js - test the name object in Ukrainian
 *
 * Copyright © 2013-2015,2017,2022 JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * unless required by applicable law or agreed to in writing, software
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


export const testname_uk = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            return LocaleData.ensureLocale("uk-UA").then(() => {
                callback();
            });
        } else {
            callback();
        }
    },

    testParseSimpleName_uk_UA: function(test) {
        test.expect(2);
        const parsed = new Name("Міла Куніс", {locale: 'uk-UA'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Міла",
            familyName: "Куніс"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseTitle_uk_UA: function(test) {
        test.expect(2);
        const parsed = new Name("Міла Куніс відставку", {locale: 'uk-UA'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            suffix: "відставку",
            givenName: "Міла",
            familyName: "Куніс"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseTitleWithFamilyOnly_uk_UA: function(test) {
        test.expect(2);
        const parsed = new Name("г-н Куніс", {locale: 'uk-UA'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "г-н",
            familyName: "Куніс"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseEverything_uk_UA: function(test) {
        test.expect(2);
        const parsed = new Name("г-н і г-жа Куніс", {locale: 'uk-UA'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "г-н і г-жа",
            familyName: "Куніс"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseprefix_uk_UA: function(test) {
        test.expect(2);
        const parsed = new Name("г-н Міла Куніс", {locale: 'uk-UA'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "г-н",
            givenName: "Міла",
            familyName: "Куніс"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseprefixAndSuffix_uk_UA: function(test) {
        test.expect(2);
        const parsed = new Name("міністр Міла Куніс відставку", {locale: 'uk-UA'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "міністр",
            givenName: "Міла",
            familyName: "Куніс",
            suffix:"відставку"
        };

        test.contains(parsed, expected);
        test.done();
    },
    /*
     * Format Tests
     */

    testFormatSimpleNameShort_uk_UA: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Міла",
            familyName: "Куніс"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'uk-UA'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Міла Куніс";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameMedium_uk_UA: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Міла",
            familyName: "Куніс"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'uk-UA'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Міла Куніс";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameLong_uk_UA: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Міла",
            familyName: "Куніс",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'uk-UA'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Міла Куніс";

        test.equal(formatted, expected);
        test.done();
    },



    testFormatSurname_uk_UA: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "г-н i г-жа",
            familyName: "Куніс"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'uk-UA'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "г-н i г-жа Куніс";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameFull_uk_UA: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "шеф-кухар",
            givenName: "Міла",
            familyName: "Куніс",
            suffix: "відставку"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'uk-UA'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "шеф-кухар Міла Куніс відставку";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameShort_uk_UA: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "шеф-кухар",
            givenName: "Міла",
            familyName: "Куніс"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'uk-UA'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Міла Куніс";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameMedium_uk_UA: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "шеф-кухар",
            givenName: "Міла",
            familyName: "Куніс"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'uk-UA'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Міла Куніс";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameLong_uk_UA: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "шеф-кухар",
            givenName: "Міла",
            familyName: "Куніс"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'uk-UA'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "шеф-кухар Міла Куніс";

        test.equal(formatted, expected);
        test.done();
    }



};
