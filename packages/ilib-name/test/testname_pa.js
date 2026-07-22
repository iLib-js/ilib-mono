/*
 * testname_pa_IN.js - test the name object in Panjabi
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


export const testname_pa = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            return LocaleData.ensureLocale("pa-IN").then(() => {
                callback();
            });
        } else {
            callback();
        }
    },

    testParseSimpleName_pa_IN: function(test) {
        test.expect(2);
        const parsed = new Name("ਹਰਭਜਨ ਸਿੰਘ", {locale: 'pa-IN'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "ਹਰਭਜਨ",
            familyName: "ਸਿੰਘ"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseTitle_pa_IN: function(test) {
        test.expect(2);
        const parsed = new Name("ਹਰਭਜਨ ਸਿੰਘ ਸੇਨਿਓਰ", {locale: 'pa-IN'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            suffix: "ਸੇਨਿਓਰ",
            givenName: "ਹਰਭਜਨ",
            familyName: "ਸਿੰਘ"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseTitleWithFamilyOnly_pa_IN: function(test) {
        test.expect(2);
        const parsed = new Name("ਦਰ ਸਿੰਘ", {locale: 'pa-IN'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "ਦਰ",
            familyName: "ਸਿੰਘ"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseEverything_pa_IN: function(test) {
        test.expect(2);
        const parsed = new Name("ਦਰ ਏੰਡ ਮਰ ਸਿੰਘ", {locale: 'pa-IN'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "ਦਰ ਏੰਡ ਮਰ",
            familyName: "ਸਿੰਘ"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseprefix_pa_IN: function(test) {
        test.expect(2);
        const parsed = new Name("ਦਰ ਹਰਭਜਨ ਸਿੰਘ", {locale: 'pa-IN'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "ਦਰ",
            givenName: "ਹਰਭਜਨ",
            familyName: "ਸਿੰਘ"
        };

        test.contains(parsed, expected);
        test.done();
    },
    /*
     * Format Tests
     */

    testFormatSimpleNameShort_pa_IN: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "ਹਰਭਜਨ",
            familyName: "ਸਿੰਘ"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'pa-IN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "ਹਰਭਜਨ ਸਿੰਘ";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameMedium_pa_IN: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "ਹਰਭਜਨ",
            familyName: "ਸਿੰਘ"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'pa-IN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "ਹਰਭਜਨ ਸਿੰਘ";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameLong_pa_IN: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "ਹਰਭਜਨ",
            familyName: "ਸਿੰਘ"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'pa-IN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "ਹਰਭਜਨ ਸਿੰਘ";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSurname_pa_IN: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "ਦਰ ਏੰਡ ਮਰ",
            familyName: "ਸਿੰਘ"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'pa-IN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "ਦਰ ਏੰਡ ਮਰ ਸਿੰਘ";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameFull_pa_IN: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "ਡਾਕ੍ਟਰ",
            givenName: "ਹਰਭਜਨ",
            familyName: "ਸਿੰਘ",
            suffix: "ਸੇਨਿਓਰ"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'pa-IN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "ਡਾਕ੍ਟਰ ਹਰਭਜਨ ਸਿੰਘ ਸੇਨਿਓਰ";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameShort_pa_IN: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "ਡਾਕ੍ਟਰ",
            givenName: "ਹਰਭਜਨ",
            familyName: "ਸਿੰਘ"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'pa-IN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "ਹਰਭਜਨ ਸਿੰਘ";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameMedium_pa_IN: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "ਡਾਕ੍ਟਰ",
            givenName: "ਹਰਭਜਨ",
            familyName: "ਸਿੰਘ"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'pa-IN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "ਹਰਭਜਨ ਸਿੰਘ";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameLong_pa_IN: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "ਡਾਕ੍ਟਰ",
            givenName: "ਹਰਭਜਨ",
            familyName: "ਸਿੰਘ"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'pa-IN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "ਡਾਕ੍ਟਰ ਹਰਭਜਨ ਸਿੰਘ";

        test.equal(formatted, expected);
        test.done();
    }



};
