/*
 * testname_uz_Cyrl.js - test the name object in Uzbek
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


export const testname_uz_Cyrl = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            return LocaleData.ensureLocale("uz-Cyrl-UZ").then(() => {
                callback();
            });
        } else {
            callback();
        }
    },

    testParseSimpleName_uz_Cyrl: function(test) {
        test.expect(2);
        const parsed = new Name("Бобур Мирзаев", {locale: 'uz-Cyrl-UZ'});
        test.ok(typeof(parsed) !== "undefined");

        const expected =   {
            givenName:"Бобур",
            familyName: "Мирзаев"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseSingleNameWithPrefixAndAdjunct_uz_Cyrl: function(test) {
        test.expect(2);
        const parsed = new Name("жаноб ва хоним Мирзаев", {locale: 'uz-Cyrl-UZ'});
        test.ok(typeof(parsed) !== "undefined");

        const expected =   {
            prefix: "жаноб ва хоним",
            familyName: "Мирзаев"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseTitle_uz_Cyrl: function(test) {
        test.expect(2);
        const parsed = new Name("Бобур Мирзаев кичик", {locale: 'uz-Cyrl-UZ'});
        test.ok(typeof(parsed) !== "undefined");

        const expected =    {
            suffix: "кичик",
            givenName:"Бобур",
            familyName: "Мирзаев"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseTitleWithFamilyOnly_uz_Cyrl: function(test) {
        test.expect(2);
        const parsed = new Name("доктор Мирзаев", {locale: 'uz-Cyrl-UZ'});
        test.ok(typeof(parsed) !== "undefined");

        const expected =   {
            prefix: "доктор",
            familyName: "Мирзаев"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseEverything_uz_Cyrl: function(test) {
        test.expect(2);
        const parsed = new Name("доктор Бобур Мирзаев", {locale: 'uz-Cyrl-UZ'});
        test.ok(typeof(parsed) !== "undefined");

        const expected =    {
            prefix: "доктор",
            givenName: "Бобур",
            familyName: "Мирзаев"
        };

        test.contains(parsed, expected);
        test.done();
    },

    /*
     * Format Tests
     */

    testFormatSimpleNameShort_uz_Cyrl: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Бобур",
            familyName: "Мирзаев"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'uz-Cyrl-UZ'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Бобур Мирзаев";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameMedium_uz_Cyrl: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Бобур",
            familyName: "Мирзаев"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'uz-Cyrl-UZ'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Бобур Мирзаев";

        test.equal(formatted, expected);
        test.done();
    },



    testFormatSimpleNameFull_uz_Cyrl: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "доктор",
            givenName: "Бобур",
            familyName: "Мирзаев",
            suffix: "2-чи"
           });
        let fmt = new NameFmt({
            style: "full",
            locale: 'uz-Cyrl-UZ'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "доктор Бобур Мирзаев 2-чи";

        test.equal(formatted, expected);
        test.done();
    }




};
