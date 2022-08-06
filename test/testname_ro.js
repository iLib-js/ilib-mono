/*
 * testname_ro_RO.js - test the name object in Romanian
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

import Name from '../src/NameFmt.js';
import Name from '../src/Name.js';

export const testname_ro = {
    setUp: function(callback) {
        ilib.clearCache();
        callback();
    },

    testParseSimpleName_ro_RO: function(test) {
        test.expect(2);
        const parsed = new Name("Sebastian Stan", {locale: 'ro-RO'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Sebastian",
            familyName: "Stan"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseSimpleNameWithMiddleName_ro_RO: function(test) {
        test.expect(2);
        const parsed = new Name("Alexandra Maria Lara", {locale: 'ro-RO'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Alexandra",
            middleName: "Maria",
            familyName: "Lara"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseTitle_ro_RO: function(test) {
        test.expect(2);
        const parsed = new Name("Sebastian Stan doctorand", {locale: 'ro-RO'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            suffix: "doctorand",
            givenName: "Sebastian",
            familyName: "Stan"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseTitleWithFamilyOnly_ro_RO: function(test) {
        test.expect(2);
        const parsed = new Name("Dl. Stan", {locale: 'ro-RO'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Dl.",
            familyName: "Stan"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseEverything_ro_RO: function(test) {
        test.expect(2);
        const parsed = new Name("Dl. și D-na. Stan", {locale: 'ro-RO'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Dl. și D-na.",
            familyName: "Stan"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseprefix_ro_RO: function(test) {
        test.expect(2);
        const parsed = new Name("Dl. Sebastian Stan", {locale: 'ro-RO'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Dl.",
            givenName: "Sebastian",
            familyName: "Stan"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseprefixAndSuffix_ro_RO: function(test) {
        test.expect(2);
        const parsed = new Name("Vice-presedinte Sebastian Stan retras", {locale: 'ro-RO'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Vice-presedinte",
            givenName: "Sebastian",
            familyName: "Stan",
            suffix:"retras"
        };

        test.contains(parsed, expected);
        test.done();
    },
    /*
     * Format Tests
     */

    testFormatSimpleNameShort_ro_RO: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Sebastian",
            familyName: "Stan"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'ro-RO'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Sebastian Stan";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameMedium_ro_RO: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Sebastian",

            familyName: "Stan"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'ro-RO'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Sebastian Stan";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameLong_ro_RO: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Sebastian",

            familyName: "Stan",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'ro-RO'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Sebastian Stan";

        test.equal(formatted, expected);
        test.done();
    },



    testFormatSurname_ro_RO: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Dl. i D-na.",

            familyName: "Stan"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'ro-RO'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Dl. i D-na. Stan";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameFull_ro_RO: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Administrator",
            givenName: "Sebastian",

            familyName: "Stan",
            suffix: "doctorand"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'ro-RO'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Administrator Sebastian Stan doctorand";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameShort_ro_RO: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Administrator",
            givenName: "Sebastian",
            familyName: "Stan"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'ro-RO'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Sebastian Stan";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameMedium_ro_RO: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Administrator",
            givenName: "Sebastian",
            familyName: "Stan"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'ro-RO'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Sebastian Stan";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameLong_ro_RO: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Administrator",
            givenName: "Sebastian",
            familyName: "Stan"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'ro-RO'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Administrator Sebastian Stan";

        test.equal(formatted, expected);
        test.done();
    }



};
