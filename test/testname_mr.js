/*
 * testname_mr_IN.js - test the name object in Hindi
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

import Name from '../src/NameFmt.js';
import Name from '../src/Name.js';

export const testname_mr = {
    setUp: function(callback) {
        ilib.clearCache();
        callback();
    },

    testParseSimpleName_mr_IN: function(test) {
        test.expect(2);
        const parsed = new Name("सचिन तेंडुलकर", {locale: 'mr-IN'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "सचिन",
            familyName: "तेंडुलकर"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseTitle_mr_IN: function(test) {
        test.expect(2);
        const parsed = new Name("सचिन तेंडुलकर ज्येष्ठ", {locale: 'mr-IN'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            suffix: "ज्येष्ठ",
            givenName: "सचिन",
            familyName: "तेंडुलकर"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseTitleWithFamilyOnly_mr_IN: function(test) {
        test.expect(2);
        const parsed = new Name("श्रीयुत तेंडुलकर", {locale: 'mr-IN'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "श्रीयुत",
            familyName: "तेंडुलकर"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseEverything_mr_IN: function(test) {
        test.expect(2);
        const parsed = new Name("श्रीयुत आणि मिसेस तेंडुलकर", {locale: 'mr-IN'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "श्रीयुत आणि मिसेस",
            familyName: "तेंडुलकर"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseprefix_mr_IN: function(test) {
        test.expect(2);
        const parsed = new Name("श्रीयुत सचिन तेंडुलकर", {locale: 'mr-IN'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "श्रीयुत",
            givenName: "सचिन",
            familyName: "तेंडुलकर"
        };

        test.contains(parsed, expected);
        test.done();
    },
    /*
     * Format Tests
     */

    testFormatSimpleNameShort_mr_IN: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "सचिन",
            familyName: "तेंडुलकर"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'mr-IN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "सचिन तेंडुलकर";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameMedium_mr_IN: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "सचिन",
            familyName: "तेंडुलकर"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'mr-IN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "सचिन तेंडुलकर";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameLong_mr_IN: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "सचिन",
            familyName: "तेंडुलकर"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'mr-IN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "सचिन तेंडुलकर";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSurname_mr_IN: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "श्रीयुत आणि मिसेस",
            familyName: "तेंडुलकर"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'mr-IN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "श्रीयुत आणि मिसेस तेंडुलकर";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameFull_mr_IN: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "डॉक्टर",
            givenName: "सचिन",
            familyName: "तेंडुलकर",
            suffix: "वरिष्ठ"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'mr-IN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "डॉक्टर सचिन तेंडुलकर वरिष्ठ";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameShort_mr_IN: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "डॉक्टर",
            givenName: "सचिन",
            familyName: "तेंडुलकर"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'mr-IN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "सचिन तेंडुलकर";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameMedium_mr_IN: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "डॉक्टर",
            givenName: "सचिन",
            familyName: "तेंडुलकर"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'mr-IN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "सचिन तेंडुलकर";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameLong_mr_IN: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "डॉक्टर",
            givenName: "सचिन",
            familyName: "तेंडुलकर"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'mr-IN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "डॉक्टर सचिन तेंडुलकर";

        test.equal(formatted, expected);
        test.done();
    }



};
