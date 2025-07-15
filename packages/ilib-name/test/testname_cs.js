/*
 * testname_cs_CZ.js - test the name object in Czech
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


export const testname_cs = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            return LocaleData.ensureLocale("cs-CZ").then(() => {
                callback();
            });
        } else {
            callback();
        }
    },

    testParseSimpleName_cs_CZ: function(test) {
        test.expect(2);
        const parsed = new Name("Yana Synkova", {locale: 'cs-CZ'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Yana",
            familyName: "Synkova"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseTripleName_cs_CZ: function(test) {
        test.expect(2);
        const parsed = new Name("Yana Synkova", {locale: 'cs-CZ'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Yana",
            familyName: "Synkova"
        };

        test.contains(parsed, expected);
        test.done();
    },


    testParseSingleNameWithPrefixAndAdjunct_cs_CZ: function(test) {
        test.expect(2);
        const parsed = new Name("prezident Yana Synkova", {locale: 'cs-CZ'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "prezident",
            givenName: "Yana",
            familyName: "Synkova"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseHypenatedName_cs_CZ: function(test) {
        test.expect(2);
        const parsed = new Name("Yana Synkova", {locale: 'cs-CZ'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Yana",
            familyName: "Synkova"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseTitle_cs_CZ: function(test) {
        test.expect(2);
        const parsed = new Name("prezident Yana Synkova", {locale: 'cs-CZ'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "prezident",
            givenName: "Yana",
            familyName: "Synkova"
        };

        test.contains(parsed, expected);
        test.done();
    },


    testParseTitle_cs_CZ1: function(test) {
        test.expect(2);
        const parsed = new Name("předsedkyně Yana Synkova", {locale: 'cs-CZ'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "předsedkyně",
            givenName: "Yana",
            familyName: "Synkova"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseTitleWithFamilyOnlyAndAdjunct_cs_CZ: function(test) {
        test.expect(2);
        const parsed = new Name("viceprezident Yana Synkova", {locale: 'cs-CZ'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "viceprezident",
            givenName: "Yana",
            familyName: "Synkova"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseEverything_cs_CZ: function(test) {
        test.expect(2);
        const parsed = new Name("dáma Yana Synkova", {locale: 'cs-CZ'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "dáma",
            givenName: "Yana",
            familyName: "Synkova"
        };

        test.contains(parsed, expected);
        test.done();
    },


    testParseCompoundHonorific_cs_CZ: function(test) {
        test.expect(2);
        const parsed = new Name("šéfkuchař Synkova", {locale: 'cs-CZ'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "šéfkuchař",
            familyName: "Synkova"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseCompoundHonorific_cs_CZ1: function(test) {
        test.expect(2);
        const parsed = new Name("Dr. Synkova", {locale: 'cs-CZ'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Dr.",
            familyName: "Synkova"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParsewithFamilyCompoundHonorific_cs_CZ1: function(test) {
        test.expect(2);
        const parsed = new Name("Pan a Paní Synkova", {locale: 'cs-CZ'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Pan a Paní",
            familyName: "Synkova"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseCompoundHonorific_cs_CZZ: function(test) {
        test.expect(2);
        const parsed = new Name("Paní Yana Synkova", {locale: 'cs-CZ'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Paní",
            givenName: "Yana",
            familyName: "Synkova"
        };

        test.contains(parsed, expected);
        test.done();
    },
    /*
     * Format Tests
     */

    testFormatSimpleNameShort_cs_CZ: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Yana",
            familyName: "Synkova"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'cs-CZ'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Yana Synkova";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameMedium_cs_CZ: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Yana",
            familyName: "Synkova"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'cs-CZ'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Yana Synkova";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameLong_cs_CZ: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Yana",
            familyName: "Synkova",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'cs-CZ'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Yana Synkova";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameFull1_cs_CZ: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Pan",
            givenName: "Yana",
            familyName: "Synkova",
            suffix: "v důchodu"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'cs-CZ'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Pan Yana Synkova v důchodu";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameFullu_cs_CZ: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Paní",
            givenName: "Yana",
            familyName: "Synkova",
            suffix: "v důchodu"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'cs-CZ'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Paní Yana Synkova v důchodu";

        test.equal(formatted, expected);
        test.done();
    },


    testFormatSimpleNameFull_cs_CZ: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "prezidentí ministerský předseda",
            givenName: "Yana",
            familyName: "Synkova",
            suffix: "v důchodu"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'cs-CZ'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "prezidentí ministerský předseda Yana Synkova v důchodu";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameShort_cs_CZ: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "prezidentí ministerský",
            givenName: "Yana",
            familyName: "von Synkova"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'cs-CZ'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Yana von Synkova";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameMedium_cs_CZ: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "prezidentí ministerský",
            givenName: "Yana",
            familyName: "von Synkova"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'cs-CZ'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Yana von Synkova";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameLong_cs_CZ: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "prezidentí ministerský",
            givenName: "Yana",
            familyName: "von Synkova"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'cs-CZ'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "prezidentí ministerský Yana von Synkova";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatAsianNameShort_cs_CZ: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'cs-CZ'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "地獸";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatAsianNameMedium_cs_CZ: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'cs-CZ'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "地獸";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatAsianNameLong_cs_CZ: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'cs-CZ'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "小地獸太太";

        test.equal(formatted, expected);
        test.done();
    }

};
