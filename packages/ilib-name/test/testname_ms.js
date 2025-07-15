/*
 * testname_ms_MY.js - test the name object in Malaysian
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


export const testname_ms = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            return LocaleData.ensureLocale("ms-MY").then(() => {
                callback();
            });
        } else {
            callback();
        }
    },

    testParseSimpleName_ms_MY: function(test) {
        test.expect(2);
        const parsed = new Name("Carmen Soo", {locale: 'ms-MY'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Carmen",
            familyName: "Soo"
        };

        test.contains(parsed, expected);
        test.done();
    },




    testParseTitle_ms_MY: function(test) {
        test.expect(2);
        const parsed = new Name("Carmen Soo bersara", {locale: 'ms-MY'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            suffix: "bersara",
            givenName: "Carmen",
            familyName: "Soo"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseTitleWithFamilyOnly_ms_MY: function(test) {
        test.expect(2);
        const parsed = new Name("cik Soo", {locale: 'ms-MY'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "cik",
            familyName: "Soo"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseEverything_ms_MY: function(test) {
        test.expect(2);
        const parsed = new Name("encik dan cik Soo", {locale: 'ms-MY'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "encik dan cik",
            familyName: "Soo"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseprefix_ms_MY: function(test) {
        test.expect(2);
        const parsed = new Name("cik Carmen Soo", {locale: 'ms-MY'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "cik",
            givenName: "Carmen",
            familyName: "Soo"
        };

        test.contains(parsed, expected);
        test.done();
    },
    /*
     * Format Tests
     */

    testFormatSimpleNameShort_ms_MY: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Carmen",
            familyName: "Soo"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'ms-MY'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Carmen Soo";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameMedium_ms_MY: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Carmen",
            familyName: "Soo"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'ms-MY'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Carmen Soo";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameLong_ms_MY: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Carmen",
            familyName: "Soo",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'ms-MY'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Carmen Soo";

        test.equal(formatted, expected);
        test.done();
    },



    testFormatSurname_ms_MY: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "encik dan cik",
            familyName: "Soo"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'ms-MY'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "encik dan cik Soo";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameFull_ms_MY: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "pesuruhjaya",
            givenName: "Carmen",
            familyName: "Soo",
            suffix: "bersara"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'ms-MY'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "pesuruhjaya Carmen Soo bersara";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameShort_ms_MY: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "pesuruhjaya",
            givenName: "Carmen",
            familyName: "Soo"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'ms-MY'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Carmen Soo";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameMedium_ms_MY: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "pesuruhjaya",
            givenName: "Carmen",
            familyName: "Soo"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'ms-MY'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Carmen Soo";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameLong_ms_MY: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "pesuruhjaya",
            givenName: "Carmen",
            familyName: "Soo"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'ms-MY'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "pesuruhjaya Carmen Soo";

        test.equal(formatted, expected);
        test.done();
    }



};
