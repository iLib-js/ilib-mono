/*
 * testname_pt_PT.js - test the name object in Portugese
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


export const testname_pt = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            return LocaleData.ensureLocale("pt-PT").then(() => {
                callback();
            });
        } else {
            callback();
        }
    },

    testParseSimpleName_pt_PT: function(test) {
        test.expect(2);
        const parsed = new Name("Cristiano Ronaldo", {locale: 'pt-PT'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Cristiano",
            familyName: "Ronaldo"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseSimpleNameWithTwoFamilyName_pt_PT: function(test) {
        test.expect(2);
        const parsed = new Name("José Eduardo Tavares Silva", {locale: 'pt-PT'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "José",
            middleName: "Eduardo",
            familyName: "Tavares Silva"
        };

        test.contains(parsed, expected);
        test.done();
    },


    testParseTitle_pt_PT: function(test) {
        test.expect(2);
        const parsed = new Name("Cristiano Ronaldo aposentados", {locale: 'pt-PT'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            suffix: "aposentados",
            givenName: "Cristiano",
            familyName: "Ronaldo"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseTitleWithFamilyOnly_pt_PT: function(test) {
        test.expect(2);
        const parsed = new Name("Senhor Ronaldo", {locale: 'pt-PT'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Senhor",
            familyName: "Ronaldo"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseEverything_pt_PT: function(test) {
        test.expect(2);
        const parsed = new Name("Senhor e Senhora Ronaldo", {locale: 'pt-PT'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Senhor e Senhora",
            familyName: "Ronaldo"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseprefix_pt_PT: function(test) {
        test.expect(2);
        const parsed = new Name("Senhor Cristiano Ronaldo", {locale: 'pt-PT'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Senhor",
            givenName: "Cristiano",
            familyName: "Ronaldo"
        };

        test.contains(parsed, expected);
        test.done();
    },
    /*
     * Format Tests
     */

    testFormatSimpleNameShort_pt_PT: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Cristiano",
            familyName: "Ronaldo"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'pt-PT'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Cristiano Ronaldo";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameMedium_pt_PT: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Cristiano",
            familyName: "Ronaldo"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'pt-PT'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Cristiano Ronaldo";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameLong_pt_PT: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Cristiano",
            familyName: "Ronaldo",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'pt-PT'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Cristiano Ronaldo";

        test.equal(formatted, expected);
        test.done();
    },



    testFormatSurname_pt_PT: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Senhor e Senhori",
            familyName: "Ronaldo"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'pt-PT'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Senhor e Senhori Ronaldo";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameFull_pt_PT: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "presidente",
            givenName: "Cristiano",
            familyName: "Ronaldo",
            suffix: "aposentados"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'pt-PT'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "presidente Cristiano Ronaldo aposentados";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameShort_pt_PT: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "presidente",
            givenName: "Cristiano",
            familyName: "Ronaldo"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'pt-PT'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Cristiano Ronaldo";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameMedium_pt_PT: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "presidente",
            givenName: "Cristiano",
            familyName: "Ronaldo"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'pt-PT'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Cristiano Ronaldo";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameLong_pt_PT: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "presidente",
            givenName: "Cristiano",
            familyName: "Ronaldo"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'pt-PT'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "presidente Cristiano Ronaldo";

        test.equal(formatted, expected);
        test.done();
    }



};
