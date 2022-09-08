/*
 * testname_kk.js - test the name object in Kazahk
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


export const testname_kk = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            return LocaleData.ensureLocale("kk-KZ").then(() => {
                callback();
            });
        } else {
            callback();
        }
    },

    testParseSimpleName_kk: function(test) {
        test.expect(2);
        const parsed = new Name("Джордж Буш", {locale: 'kk-KZ'});
        test.ok(typeof(parsed) !== "undefined");

        const expected =   {
            givenName: "Джордж",
            familyName: "Буш"
        };

        test.contains(parsed, expected);
        test.done();
    },


    testParseSingleNameWithPrefixAndAdjunct_kk: function(test) {
        test.expect(2);
        const parsed = new Name("үлкен Буш", {locale: 'kk-KZ'});
        test.ok(typeof(parsed) !== "undefined");

        const expected =   {
            prefix: "үлкен",
            familyName: "Буш"
        };

        test.contains(parsed, expected);
        test.done();
    },


    testParseTitle_kk: function(test) {
        test.expect(2);
        const parsed = new Name("Джордж Буш 2-ші", {locale: 'kk-KZ'});
        test.ok(typeof(parsed) !== "undefined");

        const expected =    {
            suffix: "2-ші",
            givenName: "Джордж",
            familyName: "Буш"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseEverything_kk: function(test) {
        test.expect(2);
        const parsed = new Name("үлкен Джордж Буш 2-ші", {locale: 'kk-KZ'});
        test.ok(typeof(parsed) !== "undefined");

        const expected =    {
            prefix: "үлкен",
            givenName: "Джордж",
            familyName: "Буш",
            suffix: "2-ші"
        };

        test.contains(parsed, expected);
        test.done();
    },


    /*
     * Format Tests
     */

    testFormatSimpleNameShort_kk: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Джордж",
            familyName: "Буш"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'kk-KZ'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Джордж Буш";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameMedium_kk: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Джордж",
            familyName: "Буш"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'kk-KZ'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Джордж Буш";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameLong_kk: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Джордж",
            familyName: "Буш",
            suffix: "2-ші"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'kk-KZ'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Джордж Буш";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameFull_kk: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "үлкен",
            givenName: "Джордж",
            familyName: "Буш",
            suffix: "2-ші"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'kk-KZ'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "үлкен Джордж Буш 2-ші";

        test.equal(formatted, expected);
        test.done();
    }



};
