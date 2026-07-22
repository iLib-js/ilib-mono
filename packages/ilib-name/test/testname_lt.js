/*
 * testname_lt_LT.js - test the name object in Lithunaian
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


export const testname_lt = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            return LocaleData.ensureLocale("lt-LT").then(() => {
                callback();
            });
        } else {
            callback();
        }
    },

    testParseSimpleName_lt_LT: function(test) {
        test.expect(2);
        const parsed = new Name("Gediminas Baravykas", {locale: 'lt-LT'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Gediminas",
            familyName: "Baravykas"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseTitle_lt_LT: function(test) {
        test.expect(2);
        const parsed = new Name("Gediminas Baravykas jaunesnysis", {locale: 'lt-LT'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            suffix: "jaunesnysis",
            givenName: "Gediminas",
            familyName: "Baravykas"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseTitleWithFamilyOnly_lt_LT: function(test) {
        test.expect(2);
        const parsed = new Name("inspektorius Baravykas", {locale: 'lt-LT'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "inspektorius",
            familyName: "Baravykas"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseEverything_lt_LT: function(test) {
        test.expect(2);
        const parsed = new Name("ponas ir ponia Baravykas", {locale: 'lt-LT'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "ponas ir ponia",
            familyName: "Baravykas"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseprefix_lt_LT: function(test) {
        test.expect(2);
        const parsed = new Name("ponas Gediminas Baravykas", {locale: 'lt-LT'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "ponas",
            givenName: "Gediminas",
            familyName: "Baravykas"
        };

        test.contains(parsed, expected);
        test.done();
    },
    /*
     * Format Tests
     */

    testFormatSimpleNameShort_lt_LT: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Gediminas",
            familyName: "Baravykas"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'lt-LT'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Gediminas Baravykas";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameMedium_lt_LT: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Gediminas",
            familyName: "Baravykas"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'lt-LT'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Gediminas Baravykas";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameLong_lt_LT: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Gediminas",
            familyName: "Baravykas",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'lt-LT'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Gediminas Baravykas";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSurname_lt_LT: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "ponas ir ponia",
            familyName: "Baravykas"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'lt-LT'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "ponas ir ponia Baravykas";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameFull_lt_LT: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "profesorius",
            givenName: "Gediminas",
            familyName: "Baravykas",
            suffix: "daktaro"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'lt-LT'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "profesorius Gediminas Baravykas daktaro";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameShort_lt_LT: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "profesorius",
            givenName: "Gediminas",
            familyName: "Baravykas"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'lt-LT'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Gediminas Baravykas";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameMedium_lt_LT: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "profesorius",
            givenName: "Gediminas",
            familyName: "Baravykas"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'lt-LT'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Gediminas Baravykas";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameLong_lt_LT: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "profesorius",
            givenName: "Gediminas",
            familyName: "Baravykas"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'lt-LT'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "profesorius Gediminas Baravykas";

        test.equal(formatted, expected);
        test.done();
    }



};
