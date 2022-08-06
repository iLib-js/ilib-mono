/*
 * testname_fr.js - test the name object in French
 *
 * Copyright © 2013-2015,2017,2022 JEDLSoft
 *
 * Licensed unfrr the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed unfrr the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations unfrr the License.
 */

import Name from '../src/NameFmt.js';
import Name from '../src/Name.js';

export const testname_fr = {
    setUp: function(callback) {
        ilib.clearCache();
        callback();
    },

    testFRParseSimpleName: function(test) {
        test.expect(2);
        const parsed = new Name("Isabelle Antena", {locale: 'fr-FR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Isabelle",
            familyName: "Antena"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testFRParseTripleName: function(test) {
        test.expect(2);
        const parsed = new Name("Jean-Louis Aubert", {locale: 'fr-FR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Jean-Louis",
            ////middleName: "Michael",
            familyName: "Aubert"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testFRParseAdjunctNames: function(test) {
        test.expect(2);
        const parsed = new Name("Jean-Marie Le Pen", {locale: 'fr-FR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Jean-Marie",
            ////middleName: "Klaus",
            familyName: "Le Pen"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testFRParseSingleName: function(test) {
        test.expect(4);
        test.expect(2);
        const parsed = new Name("Jean-Louis", {locale: 'fr-FR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Jean-Louis",
        };

        test.contains(parsed, expected);
        test.done();
    },

    /*function testFRParseSingleNameWithAdjunct() {
        const parsed = new Name("von Beethoven", {locale: 'fr-FR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "von",
            familyName: "Beethoven"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testFRParseSingleNameWithPrefixAndAdjunct: function(test) {
        test.expect(2);
        const parsed = new Name("Monsieur von Beethoven", {locale: 'fr-FR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Monsieur",
            familyName: "von Beethoven"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testFRParseMultiAdjunctNames: function(test) {
        test.expect(2);
        const parsed = new Name("Ludwig von frn Wiesthal", {locale: 'fr-FR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Ludwig",
            familyName: "von frn Wiesthal"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testFRParseHypenatedName: function(test) {
        test.expect(2);
        const parsed = new Name("Jean-Marie Le Pen", {locale: 'fr-FR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Jean-Marie",
            //middleName: "Michael",
            familyName: "Le Pen"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testFRParseQuadrupleName: function(test) {
        test.expect(2);
        const parsed = new Name("Emil Michael David Vallefois", {locale: 'fr-FR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Emil",
            middleName: "Michael David",
            familyName: "Vallefois"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testFRParseTitle: function(test) {
        test.expect(2);
        const parsed = new Name("Monsieur Dr. Jean-Louis Aubert", {locale: 'fr-FR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Monsieur Dr.",
            givenName: "Jean-Louis",
            familyName: "Aubert"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testFRParseTitleWithFamilyOnly: function(test) {
        test.expect(2);
        const parsed = new Name("Monsieur Jean-Louis", {locale: 'fr-FR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Monsieur",
            familyName: "Jean-Louis"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testFRParseTitleWithFamilyOnlyAndAdjunct: function(test) {
        test.expect(2);
        const parsed = new Name("Monsieur Aubert", {locale: 'fr-FR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Monsieur",
            familyName: "Aubert"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testFRParseHonorific: function(test) {
        test.expect(2);
        const parsed = new Name("Madame Isabelle Antena", {locale: 'fr-FR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Madame",
            givenName: "Isabelle",
            familyName: "Antena"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testFRParseEverything: function(test) {
        test.expect(2);
        const parsed = new Name("Monsieur Président Jean-Louis Aubert", {locale: 'fr-FR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Monsieur Président",
            givenName: "Jean-Louis",
            //middleName: "Michael Jürgen",
            familyName: "Aubert",
            //suffix: "III"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testFRParseFamilyWithAuxillary: function(test) {
        test.expect(2);
        const parsed = new Name("George Le Pen", {locale: 'fr-FR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "George",
            familyName: "Le Pen"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testFRParseCompoundHonorific: function(test) {
        test.expect(2);
        const parsed = new Name("Monsieur et Madame Maier", {locale: 'fr-FR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Monsieur et Madame",
            familyName: "Maier"
        };

        test.contains(parsed, expected);
        test.done();
    },

    /*
     * Format Tests
     */

    testFRFormatSimpleNameShort: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Emil",
            //middleName: "Michael",
            familyName: "Schmidt"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'fr-FR'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Emil Schmidt";

        test.equal(formatted, expected);
        test.done();
    },

    testFRFormatSimpleNameMedium: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Emil",
            middleName: "Michael",
            familyName: "Schmidt"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'fr-FR'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Emil Michael Schmidt";

        test.equal(formatted, expected);
        test.done();
    },

    testFRFormatSimpleNameLong: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Emil",
            middleName: "Michael",
            familyName: "Schmidt",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'fr-FR'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Emil Michael Schmidt";

        test.equal(formatted, expected);
        test.done();
    },

    testFRFormatSimpleNameFull: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Monsieur Docteur",
            givenName: "Emil",
            middleName: "Michael",
            familyName: "Schmidt",
            suffix: " dem"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'fr-FR'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Monsieur Docteur Emil Michael Schmidt dem";

        test.equal(formatted, expected);
        test.done();
    },

    testFRFormatComplexNameShort: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Monsieur Docteur",
            givenName: "Emil",
            middleName: "Michael Francois",
            familyName: "de Rigeur",
            suffix: "III"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'fr-FR'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Emil de Rigeur";

        test.equal(formatted, expected);
        test.done();
    },

    testFRFormatComplexNameMedium: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Monsieur Docteur",
            givenName: "Emil",
            middleName: "Michael Francois",
            familyName: "de Rigeur",
            suffix: "III"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'fr-FR'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Emil Michael Francois de Rigeur";

        test.equal(formatted, expected);
        test.done();
    },

    testFRFormatComplexNameLong: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Monsieur Docteur",
            givenName: "Emil",
            middleName: "Michael Francois",
            familyName: "de Rigeur",
            suffix: "III"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'fr-FR'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Monsieur Docteur Emil Michael Francois de Rigeur III";

        test.equal(formatted, expected);
        test.done();
    },

    testFRFormatAsianNameShort: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'fr-FR'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "地獸";

        test.equal(formatted, expected);
        test.done();
    },

    testFRFormatAsianNameMedium: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'fr-FR'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "地獸";

        test.equal(formatted, expected);
        test.done();
    },

    testFRFormatAsianNameLong: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'fr-FR'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "小地獸太太";

        test.equal(formatted, expected);
        test.done();
    }

};
