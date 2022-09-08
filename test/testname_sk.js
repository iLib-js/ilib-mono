/*
 * testname_sk_SK.js - test the name object in Slovak
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
import LocaleData from 'ilib-localedata';
import { getPlatform } from 'ilib-env';

let setUpPerformed = false;


export const testname_sk = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            return LocaleData.ensureLocale("sk-SK").then(() => {
                callback();
            });
        } else {
            callback();
        }
    },

    testParseSimpleName_sk_SK: function(test) {
        test.expect(2);
        const parsed = new Name("Iveta Stan", {locale: 'sk-SK'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Iveta",
            familyName: "Stan"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseTitle_sk_SK: function(test) {
        test.expect(2);
        const parsed = new Name("Iveta Stan dôchodku", {locale: 'sk-SK'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            suffix: "dôchodku",
            givenName: "Iveta",
            familyName: "Stan"
        };

        test.contains(parsed, expected);
        test.done();
    },


    testParseTitleWithFamilyOnly_sk_SK: function(test) {
        test.expect(2);
        const parsed = new Name("Pán. Stan", {locale: 'sk-SK'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Pán.",
            familyName: "Stan"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseEverything_sk_SK: function(test) {
        test.expect(2);
        const parsed = new Name("Pán. a pani. Stan", {locale: 'sk-SK'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Pán. a pani.",
            familyName: "Stan"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseprefix_sk_SK: function(test) {
        test.expect(2);
        const parsed = new Name("Pán. Iveta Stan", {locale: 'sk-SK'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Pán.",
            givenName: "Iveta",
            familyName: "Stan"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseprefixAndSuffix_sk_SK: function(test) {
        test.expect(2);
        const parsed = new Name("Viceprezident Iveta Stan dôchodku", {locale: 'sk-SK'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Viceprezident",
            givenName: "Iveta",
            familyName: "Stan",
            suffix:"dôchodku"
        };

        test.contains(parsed, expected);
        test.done();
    },
    /*
     * Format Tests
     */

    testFormatSimpleNameShort_sk_SK: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Iveta",
            familyName: "Stan"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'sk-SK'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Iveta Stan";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameMedium_sk_SK: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Iveta",
            familyName: "Stan"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'sk-SK'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Iveta Stan";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameLong_sk_SK: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Iveta",
            familyName: "Stan",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'sk-SK'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Iveta Stan";

        test.equal(formatted, expected);
        test.done();
    },



    testFormatSurname_sk_SK: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Pán. a pani.",
            familyName: "Stan"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'sk-SK'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Pán. a pani. Stan";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameFull_sk_SK: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "princezná",
            givenName: "Iveta",
            familyName: "Stan",
            suffix: "dôchodku"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'sk-SK'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "princezná Iveta Stan dôchodku";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameShort_sk_SK: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "princezná",
            givenName: "Iveta",
            familyName: "Stan"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'sk-SK'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Iveta Stan";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameMedium_sk_SK: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "princezná",
            givenName: "Iveta",
            familyName: "Stan"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'sk-SK'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Iveta Stan";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameLong_sk_SK: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "princezná",
            givenName: "Iveta",
            familyName: "Stan"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'sk-SK'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "princezná Iveta Stan";

        test.equal(formatted, expected);
        test.done();
    }



};
