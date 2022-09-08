/*
 * testname_sr_Cyrl_RS.js - test the name object in Serbian
 *
 * Copyright © 2013-2015,2017, JEгосподинSoft
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


export const testname_sr = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            return LocaleData.ensureLocale("sr-Cyrl-RS").then(() => {
                callback();
            });
        } else {
            callback();
        }
    },

    testParseSimpleName_sr_Cyrl_RS: function(test) {
        test.expect(2);
        const parsed = new Name("Александар Дероко", {locale: 'sr-Cyrl-RS'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Александар",
            familyName: "Дероко"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseTitle_sr_Cyrl_RS: function(test) {
        test.expect(2);
        const parsed = new Name("Александар Дероко млађи", {locale: 'sr-Cyrl-RS'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            suffix: "млађи",
            givenName: "Александар",
            familyName: "Дероко"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseTitleWithFamilyOnly_sr_Cyrl_RS: function(test) {
        test.expect(2);
        const parsed = new Name("господин. Дероко", {locale: 'sr-Cyrl-RS'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "господин.",
            familyName: "Дероко"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseEverything_sr_Cyrl_RS: function(test) {
        test.expect(2);
        const parsed = new Name("господин. и госпођа. Дероко", {locale: 'sr-Cyrl-RS'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "господин. и госпођа.",
            familyName: "Дероко"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseprefix_sr_Cyrl_RS: function(test) {
        test.expect(2);
        const parsed = new Name("господин. Александар Дероко", {locale: 'sr-Cyrl-RS'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "господин.",
            givenName: "Александар",
            familyName: "Дероко"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseprefixAndSuffix_sr_Cyrl_RS: function(test) {
        test.expect(2);
        const parsed = new Name("заменик председника Александар Дероко млађи", {locale: 'sr-Cyrl-RS'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "заменик председника",
            givenName: "Александар",
            familyName: "Дероко",
            suffix:"млађи"
        };

        test.contains(parsed, expected);
        test.done();
    },
    /*
     * Format Tests
     */

    testFormatSimpleNameShort_sr_Cyrl_RS: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Александар",
            familyName: "Дероко"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'sr-Cyrl-RS'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Александар Дероко";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameMedium_sr_Cyrl_RS: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Александар",
            familyName: "Дероко"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'sr-Cyrl-RS'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Александар Дероко";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameLong_sr_Cyrl_RS: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Александар",
            familyName: "Дероко",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'sr-Cyrl-RS'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Александар Дероко";

        test.equal(formatted, expected);
        test.done();
    },



    testFormatSurname_sr_Cyrl_RS: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "господин. и госпођа.",
            familyName: "Дероко"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'sr-Cyrl-RS'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "господин. и госпођа. Дероко";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameFull_sr_Cyrl_RS: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "председавајућа",
            givenName: "Александар",
            familyName: "Дероко",
            suffix: "млађи"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'sr-Cyrl-RS'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "председавајућа Александар Дероко млађи";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameShort_sr_Cyrl_RS: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "председавајућа",
            givenName: "Александар",
            familyName: "Дероко"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'sr-Cyrl-RS'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Александар Дероко";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameMedium_sr_Cyrl_RS: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "председавајућа",
            givenName: "Александар",
            familyName: "Дероко"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'sr-Cyrl-RS'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Александар Дероко";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameLong_sr_Cyrl_RS: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "председавајућа",
            givenName: "Александар",
            familyName: "Дероко"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'sr-Cyrl-RS'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "председавајућа Александар Дероко";

        test.equal(formatted, expected);
        test.done();
    }



};
