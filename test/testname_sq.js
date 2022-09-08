/*
 * testname_sq_AL.js - test the name object in Albanian
 *
 * Copyright © 2013-2015,2017, JEDLSoft
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


export const testname_sq = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            return LocaleData.ensureLocale("sq-AL").then(() => {
                callback();
            });
        } else {
            callback();
        }
    },

    testParseSimpleName_sq_AL: function(test) {
        test.expect(2);
        const parsed = new Name("James Belushi", {locale: 'sq-AL'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "James",
            familyName: "Belushi"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseTitle_sq_AL: function(test) {
        test.expect(2);
        const parsed = new Name("James Belushi njom", {locale: 'sq-AL'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            suffix: "njom",
            givenName: "James",
            familyName: "Belushi"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseTitleWithFamilyOnly_sq_AL: function(test) {
        test.expect(2);
        const parsed = new Name("Zoti. Belushi", {locale: 'sq-AL'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Zoti.",
            familyName: "Belushi"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseEverything_sq_AL: function(test) {
        test.expect(2);
        const parsed = new Name("Zoti. dhe Zonja. Belushi", {locale: 'sq-AL'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Zoti. dhe Zonja.",
            familyName: "Belushi"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseprefix_sq_AL: function(test) {
        test.expect(2);
        const parsed = new Name("Zoti. James Belushi", {locale: 'sq-AL'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Zoti.",
            givenName: "James",
            familyName: "Belushi"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseprefixAndSuffix_sq_AL: function(test) {
        test.expect(2);
        const parsed = new Name("Zëvendëspresident James Belushi njom", {locale: 'sq-AL'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Zëvendëspresident",
            givenName: "James",
            familyName: "Belushi",
            suffix:"njom"
        };

        test.contains(parsed, expected);
        test.done();
    },
    /*
     * Format Tests
     */

    testFormatSimpleNameShort_sq_AL: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "James",
            familyName: "Belushi"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'sq-AL'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "James Belushi";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameMedium_sq_AL: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "James",
            familyName: "Belushi"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'sq-AL'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "James Belushi";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameLong_sq_AL: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "James",
            familyName: "Belushi",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'sq-AL'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "James Belushi";

        test.equal(formatted, expected);
        test.done();
    },



    testFormatSurname_sq_AL: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Zoti. dhe Zonja.",
            familyName: "Belushi"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'sq-AL'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Zoti. dhe Zonja. Belushi";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameFull_sq_AL: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Guvernator",
            givenName: "James",
            familyName: "Belushi",
            suffix: "njom"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'sq-AL'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Guvernator James Belushi njom";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameShort_sq_AL: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Guvernator",
            givenName: "James",
            familyName: "Belushi"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'sq-AL'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "James Belushi";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameMedium_sq_AL: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Guvernator",
            givenName: "James",
            familyName: "Belushi"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'sq-AL'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "James Belushi";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameLong_sq_AL: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Guvernator",
            givenName: "James",
            familyName: "Belushi"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'sq-AL'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Guvernator James Belushi";

        test.equal(formatted, expected);
        test.done();
    }



};
