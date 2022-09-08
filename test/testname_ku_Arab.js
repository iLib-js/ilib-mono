/*
 * testname_ku_Arab.js - test the name object in Kurdish
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
import LocaleData from 'ilib-localedata';
import { getPlatform } from 'ilib-env';

let setUpPerformed = false;


export const testname_ku_Arab = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            return LocaleData.ensureLocale("ku-Arab-IQ").then(() => {
                callback();
            });
        } else {
            callback();
        }
    },

    testParseSimpleName_ku_Arab: function(test) {
        test.expect(2);
        const parsed = new Name("جەلال تاڵەبانی", {locale: 'ku-Arab-IQ'});
        test.ok(typeof(parsed) !== "undefined");

        const expected =   {
            givenName: "جەلال",
            familyName: "تاڵەبانی"
        };

        test.contains(parsed, expected);
        test.done();
    },





    testParseSingleNameWithPrefixAndAdjunct_ku_Arab: function(test) {
        test.expect(2);
        const parsed = new Name("بەڕێز و خاتوو تاڵەبانی", {locale: 'ku-Arab-IQ'});
        test.ok(typeof(parsed) !== "undefined");

        const expected =  {
            prefix: "بەڕێز و خاتوو",
            familyName: "تاڵەبانی"
        };

        test.contains(parsed, expected);
        test.done();
    },


    testParseTitle_ku_Arab: function(test) {
        test.expect(2);
        const parsed = new Name("جەلال تاڵەبانی کوڕ", {locale: 'ku-Arab-IQ'});
        test.ok(typeof(parsed) !== "undefined");

        const expected =    {
            suffix: "کوڕ",
            givenName: "جەلال",
            familyName: "تاڵەبانی"
        };

        test.contains(parsed, expected);
        test.done();
    },





    testParseEverything_ku_Arab: function(test) {
        test.expect(2);
        const parsed = new Name("بەڕێز جەلال تاڵەبانی", {locale: 'ku-Arab-IQ'});
        test.ok(typeof(parsed) !== "undefined");

        const expected =    {
            prefix: "بەڕێز",
            givenName: "جەلال",
            familyName: "تاڵەبانی"
        };

        test.contains(parsed, expected);
        test.done();
    },


    /*
     * Format Tests
     */

    testFormatSimpleNameShort_ku_Arab: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "جەلال",
            familyName: "تاڵەبانی"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'ku-Arab-IQ'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "جەلال تاڵەبانی";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameMedium_ku_Arab: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "جەلال",
            familyName: "تاڵەبانی"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'ku-Arab-IQ'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "جەلال تاڵەبانی";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameLong_ku_Arab: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "جەلال",

            familyName: "تاڵەبانی",
            suffix: "کوڕ"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'ku-Arab-IQ'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "جەلال تاڵەبانی کوڕ";

        test.equal(formatted, expected);
        test.done();
    }








};
