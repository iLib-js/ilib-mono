/*
 * testname_de.js - test the name object in Bulgarian
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


export const testname_bg = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            return LocaleData.ensureLocale("bg-BG").then(() => {
                callback();
            });
        } else {
            callback();
        }
    },

    testParseSimpleName_bg_BG: function(test) {
        test.expect(2);
        const parsed = new Name("Мария Георгиева", {locale: 'bg-BG'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Мария",
            familyName: "Георгиева"
        };

        test.contains(parsed, expected);
        test.done();
    },


    testParseAdjunctNames_bg_BG: function(test) {
        test.expect(2);
        const parsed = new Name("Стоян Драганов", {locale: 'bg-BG'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Стоян",
            familyName: "Драганов"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseSingleNameWithPrefixAndAdjunct_bg_BG: function(test) {
        test.expect(2);
        const parsed = new Name("сестра Драганов", {locale: 'bg-BG'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "сестра",
            familyName: "Драганов"
        };

        test.contains(parsed, expected);
        test.done();
    },


    testParseTitle_bg_BG: function(test) {
        test.expect(2);
        const parsed = new Name("Мария Георгиева младши", {locale: 'bg-BG'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            suffix: "младши",
            givenName: "Мария",
            familyName: "Георгиева"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseTitleWithFamilyOnly_bg_BG: function(test) {
        test.expect(2);
        const parsed = new Name("сестра. Георгиева", {locale: 'bg-BG'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "сестра.",
            familyName: "Георгиева"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseEverything_bg_BG: function(test) {
        test.expect(2);
        const parsed = new Name("баба Мария Георгиева", {locale: 'bg-BG'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "баба",
            givenName: "Мария",
            familyName: "Георгиева"
        };

        test.contains(parsed, expected);
        test.done();
    },


    /*
     * Format Tests
     */

    testFormatSimpleNameShort_bg_BG: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Мария",
            familyName: "Георгиева"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'bg-BG'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Мария Георгиева";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameMedium_bg_BG: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Мария",

            familyName: "Георгиева"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'bg-BG'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Мария Георгиева";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameLong_bg_BG: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Мария",

            familyName: "Георгиева",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'bg-BG'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Мария Георгиева";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameFull_bg_BG: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "лекар",
            givenName: "Мария",

            familyName: "Георгиева",
            suffix: " MdB"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'bg-BG'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "лекар Мария Георгиева MdB";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameShort_bg_BG: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "лекар",
            givenName: "Мария",
            familyName: "Георгиева"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'bg-BG'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Мария Георгиева";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameMedium_bg_BG: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "лекар",
            givenName: "Мария",
            familyName: "Георгиева"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'bg-BG'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Мария Георгиева";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameLong_bg_BG: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "лекар",
            givenName: "Мария",
            familyName: "Георгиева"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'bg-BG'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "лекар Мария Георгиева";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatAsianNameShort_bg_BG: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'bg-BG'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "地獸";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatAsianNameMedium_bg_BG: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'bg-BG'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "地獸";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatAsianNameLong_bg_BG: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'bg-BG'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "小地獸";

        test.equal(formatted, expected);
        test.done();
    }
};
