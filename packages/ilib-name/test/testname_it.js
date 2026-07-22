/*
 * testname_it_IT.js - test the name object in Italian
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


export const testname_it = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            return LocaleData.ensureLocale("it-IT").then(() => {
                callback();
            });
        } else {
            callback();
        }
    },

    testParseSimpleName_it_IT: function(test) {
        test.expect(2);
        const parsed = new Name("Leonardo DiCaprio", {locale: 'it-IT'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Leonardo",
            familyName: "DiCaprio"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseTitle_it_IT: function(test) {
        test.expect(2);
        const parsed = new Name("Leonardo DiCaprio", {locale: 'it-IT'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Leonardo",
            familyName: "DiCaprio"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseTitleWithFamilyOnly_it_IT: function(test) {
        test.expect(2);
        const parsed = new Name("ingegnere. DiCaprio", {locale: 'it-IT'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "ingegnere.",
            familyName: "DiCaprio"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseEverything_it_IT: function(test) {
        test.expect(2);
        const parsed = new Name("ingegnere Leonardo DiCaprio", {locale: 'it-IT'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "ingegnere",
            givenName: "Leonardo",
            familyName: "DiCaprio"
        };

        test.contains(parsed, expected);
        test.done();
    },


    /*
     * Format Tests
     */

    testFormatSimpleNameShort_it_IT: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Leonardo",
            familyName: "DiCaprio"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'it-IT'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Leonardo DiCaprio";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameMedium_it_IT: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Leonardo",

            familyName: "DiCaprio"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'it-IT'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Leonardo DiCaprio";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameLong_it_IT: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Leonardo",

            familyName: "DiCaprio",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'it-IT'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Leonardo DiCaprio";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameFull_it_IT: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "dottore",
            givenName: "Leonardo",

            familyName: "DiCaprio"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'it-IT'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "dottore Leonardo DiCaprio";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameShort_it_IT: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "dottore",
            givenName: "Leonardo",
            familyName: "DiCaprio"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'it-IT'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Leonardo DiCaprio";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameMedium_it_IT: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "dottore",
            givenName: "Leonardo",
            familyName: "DiCaprio"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'it-IT'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Leonardo DiCaprio";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameLong_it_IT: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "dottore",
            givenName: "Leonardo",
            familyName: "DiCaprio"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'it-IT'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "dottore Leonardo DiCaprio";

        test.equal(formatted, expected);
        test.done();
    }



};
