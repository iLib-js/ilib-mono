/*
 * testname_en.js - test the name object in English
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


export const testname_en = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            let promise = Promise.resolve(true);
            ["en-US", "en-HK"].forEach(locale => {
                promise = promise.then(() => {
                    return LocaleData.ensureLocale(locale);
                });
            });
            promise.then(() => {
                callback();
            });
        } else {
            callback();
        }
        
    },

    testENUSParseSimpleName: function(test) {
        test.expect(2);
        const parsed = new Name("John Smith", {locale: 'en-US'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "John",
            familyName: "Smith"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testENUSParseTripleName: function(test) {
        test.expect(2);
        const parsed = new Name("John Michael Smith", {locale: 'en-US'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "John",
            middleName: "Michael",
            familyName: "Smith"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testENUSParseHypenatedName: function(test) {
        test.expect(2);
        const parsed = new Name("John Michael Taylor-Smith", {locale: 'en-US'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "John",
            middleName: "Michael",
            familyName: "Taylor-Smith"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testENUSParseQuadrupleName: function(test) {
        test.expect(2);
        const parsed = new Name("John Michael Kevin Smith", {locale: 'en-US'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "John",
            middleName: "Michael Kevin",
            familyName: "Smith"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testENUSParseTitle: function(test) {
        test.expect(2);
        const parsed = new Name("Dr. John Smith", {locale: 'en-US'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Dr.",
            givenName: "John",
            familyName: "Smith"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testENUSParseHonorific: function(test) {
        test.expect(2);
        const parsed = new Name("Mr. John Smith", {locale: 'en-US'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Mr.",
            givenName: "John",
            familyName: "Smith"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testENUSParseSuffix: function(test) {
        test.expect(2);
        const parsed = new Name("John Smith Jr. Esq.", {locale: 'en-US'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "John",
            familyName: "Smith",
            suffix: "Jr. Esq."
        };

        test.contains(parsed, expected);
        test.done();
    },

    // for DFISH-25146
    testENUSParseSuffixWithComma: function(test) {
        test.expect(2);
        const parsed = new Name("John Smith, PhD", {locale: 'en-US'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "John",
            familyName: "Smith",
            suffix: ", PhD"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testENUSParseEuroMultiName: function(test) {
        test.expect(2);
        const parsed = new Name("Pieter van der Meulen", {locale: 'en-US'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Pieter",
            familyName: "van der Meulen"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testENBenStrong: function(test) {
        test.expect(2);
        const parsed = new Name("Ben Strong", {locale: 'en-US'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Ben",
            familyName: "Strong"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testENUSParseEverything: function(test) {
        test.expect(2);
        const parsed = new Name("The Right Honorable Governor General Dr. John Michael Kevin Smith III, DDM", {locale: 'en-US'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "The Right Honorable Governor General Dr.",
            givenName: "John",
            middleName: "Michael Kevin",
            familyName: "Smith",
            suffix: "III, DDM"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testENSingleName: function(test) {
        test.expect(2);
        const parsed = new Name("Sting", {locale: 'en-US'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Sting"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testENLastNames: function(test) {
        test.expect(2);
        const parsed = new Name("Dr. Roberts", {locale: 'en-US'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Dr.",
            familyName: "Roberts"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testENCompoundNames: function(test) {
        test.expect(2);
        const parsed = new Name("Mr. and Mrs. Smith", {locale: 'en-US'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Mr. and Mrs.",
            familyName: "Smith"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testENCompoundFamily: function(test) {
        test.expect(2);
        const parsed = new Name("John and Mary Smith", {locale: 'en-US'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "John and Mary",
            familyName: "Smith"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testENByFamily: function(test) {
        test.expect(2);
        const parsed = new Name("The Robertsons", {locale: 'en-US'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "The",
            familyName: "Robertsons"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testENAuxDE: function(test) {
        test.expect(2);
        const parsed = new Name("Herbert von Karajan", {locale: 'en-US'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Herbert",
            familyName: "von Karajan"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testENAuxNL: function(test) {
        test.expect(2);
        const parsed = new Name("Jan van der Heiden", {locale: 'en-US'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Jan",
            familyName: "van der Heiden"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testENAuxFR: function(test) {
        test.expect(2);
        const parsed = new Name("Serges du Maurier", {locale: 'en-US'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Serges",
            familyName: "du Maurier"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testENAuxIT: function(test) {
        test.expect(2);
        const parsed = new Name("Leonardo di Caprio", {locale: 'en-US'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Leonardo",
            familyName: "di Caprio"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testENAuxES: function(test) {
        test.expect(2);
        const parsed = new Name("Jorge de las Cruces", {locale: 'en-US'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Jorge",
            familyName: "de las Cruces"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testENGibberish: function(test) {
        test.expect(2);
        const parsed = new Name("Géê ëī a d øö", {locale: 'en-US'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Géê",
            middleName: "ëī a d",
            familyName: "øö"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testENHKNormal: function(test) {
        test.expect(2);
        const parsed = new Name("Chan Ho Yun", {locale: 'en-HK'});
        test.ok(typeof(parsed) !== "undefined");

        // name in English in Hong Kong are written with Asian order, much like Hungarian
        const expected = {
            givenName: "Ho",
            middleName: "Yun",
            familyName: "Chan"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testENHKWithPrefix: function(test) {
        test.expect(2);
        const parsed = new Name("Dr Chan Ho Yun", {locale: 'en-HK'});
        test.ok(typeof(parsed) !== "undefined");

        // name in English in Hong Kong are written with Asian order, much like Hungarian
        const expected = {
        	prefix: "Dr",
            givenName: "Ho",
            middleName: "Yun",
            familyName: "Chan"
        };

        test.contains(parsed, expected);
        test.done();
    },

    /*
     * Format tests
     */

    testENFormatSimpleNameShort: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Dr.",
            givenName: "John",
            middleName: "Michael",
            familyName: "Smith",
            suffix: ", PhD"
        });
        let fmt = new NameFmt({style: "short", locale: 'en-US'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "John Smith";

        test.equal(formatted, expected);
        test.done();
    },

    testENFormatSimpleNameMedium: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Dr.",
            givenName: "John",
            middleName: "Michael",
            familyName: "Smith",
            suffix: ", PhD"
        });
        let fmt = new NameFmt({style: "medium", locale: 'en-US'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "John Michael Smith";

        test.equal(formatted, expected);
        test.done();
    },

    testENFormatSimpleNameLong: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Dr.",
            givenName: "John",
            middleName: "Michael",
            familyName: "Smith",
            suffix: ", PhD"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'en-US'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Dr. John Michael Smith";

        test.equal(formatted, expected);
        test.done();
    },

    testENFormatSimpleNameFull: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Dr.",
            givenName: "John",
            middleName: "Michael",
            familyName: "Smith",
            suffix: ", PhD"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'en-US'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Dr. John Michael Smith, PhD";

        test.equal(formatted, expected);
        test.done();
    },

    testENFormatComplexNameShort: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Mr.",
            givenName: "John",
            middleName: "Michael Kevin",
            familyName: "von Schmitt",
            suffix: "III"
        });
        let fmt = new NameFmt({style: "short", locale: 'en-US'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "John von Schmitt";

        test.equal(formatted, expected);
        test.done();
    },

    testENFormatComplexNameMedium: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Mr.",
            givenName: "John",
            middleName: "Michael Kevin",
            familyName: "von Schmitt",
            suffix: "III"
        });
        let fmt = new NameFmt({style: "medium", locale: 'en-US'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "John Michael Kevin von Schmitt";

        test.equal(formatted, expected);
        test.done();
    },

    testENFormatComplexNameLong: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Mr.",
            givenName: "John",
            middleName: "Michael Kevin",
            familyName: "von Schmitt",
            suffix: "III"
        });
        let fmt = new NameFmt({style: "long", locale: 'en-US'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Mr. John Michael Kevin von Schmitt";

        test.equal(formatted, expected);
        test.done();
    },

    testENFormatComplexNameFull: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Mr.",
            givenName: "John",
            middleName: "Michael Kevin",
            familyName: "von Schmitt",
            suffix: "III"
        });
        let fmt = new NameFmt({style: "full", locale: 'en-US'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Mr. John Michael Kevin von Schmitt III";

        test.equal(formatted, expected);
        test.done();
    },

    testENFormatCommasInSuffix: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Mr.",
            givenName: "John",
            middleName: "Michael Kevin",
            familyName: "von Schmitt",
            suffix: ", III, PhD"
        });
        let fmt = new NameFmt({style: "full", locale: 'en-US'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Mr. John Michael Kevin von Schmitt, III, PhD";

        test.equal(formatted, expected);
        test.done();
    },

    testENFormatAsianNameShort: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "short", locale: 'en-US'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "地獸";

        test.equal(formatted, expected);
        test.done();
    },

    testENFormatAsianNameMedium: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "medium", locale: 'en-US'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "地獸";

        test.equal(formatted, expected);
        test.done();
    },

    testENFormatAsianNameLong: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "long", locale: 'en-US'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "小地獸";

        test.equal(formatted, expected);
        test.done();
    },

    testENFormatAsianNameFull: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "full", locale: 'en-US'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "小地獸太太";

        test.equal(formatted, expected);
        test.done();
    },

    testENFormatWithNulls: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: null,
            givenName: "John",
            middleName: null,
            familyName: "Doe",
            suffix: null
        });

        let fmt = new NameFmt({style: "long", locale: 'en-US'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "John Doe";

        test.equal(formatted, expected);
        test.done();
    },

    testENHKRegular: function(test) {
        test.expect(2);
        let name = new Name({
            honorific: "Dr",
            givenName: "Min Kee",
            middleName: "John",
            familyName: "Fan",
            suffix: null
        });

        let fmt = new NameFmt({style: "short", locale: 'en-HK'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        // English names in Hong Kong are formatted with family name first, much like Hungarian
        const expected = "Fan Min Kee";

        test.equal(formatted, expected);
        test.done();
    },

    testENHKFormatFormalShort: function(test) {
        test.expect(2);
        let name = new Name({
            honorific: "Dr",
            givenName: "Min Kee",
            middleName: "John",
            familyName: "Fan",
            suffix: null
        });

        let fmt = new NameFmt({style: "formal_short", locale: 'en-HK'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Dr Fan";

        test.equal(formatted, expected);
        test.done();
    },

    testENHKFormatFormalLong: function(test) {
        test.expect(2);
        let name = new Name({
            honorific: "Dr",
            givenName: "Min Kee",
            middleName: "John",
            familyName: "Fan",
            suffix: null
        });

        let fmt = new NameFmt({style: "formal_long", locale: 'en-HK'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Dr Fan Min Kee John";

        test.equal(formatted, expected);
        test.done();
    }
};
