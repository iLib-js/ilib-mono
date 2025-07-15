/*
 * testname_mk_MK.js - test the name object in Macedonian
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


export const testname_mk = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            return LocaleData.ensureLocale("mk-MK").then(() => {
                callback();
            });
        } else {
            callback();
        }
    },

    testParseSimpleName_mk_MK: function(test) {
        test.expect(2);
        const parsed = new Name("Љубunша Самарџunќ", {locale: 'mk-MK'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Љубunша",
            familyName: "Самарџunќ"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseSimpleWithHiphen_mk_MK: function(test) {
        test.expect(2);
        const parsed = new Name("Nikola-Kole Angelovski", {locale: 'mk-MK'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Nikola-Kole",
            familyName: "Angelovski"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseTitle_mk_MK: function(test) {
        test.expect(2);
        const parsed = new Name("Љубunша Самарџunќ високи", {locale: 'mk-MK'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            suffix: "високи",
            givenName: "Љубunша",
            familyName: "Самарџunќ"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseTitleWithFamilyOnly_mk_MK: function(test) {
        test.expect(2);
        const parsed = new Name("г-дин Самарџunќ", {locale: 'mk-MK'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "г-дин",
            familyName: "Самарџunќ"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseEverything_mk_MK: function(test) {
        test.expect(2);
        const parsed = new Name("г-дин и г-ѓа Самарџunќ", {locale: 'mk-MK'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "г-дин и г-ѓа",
            familyName: "Самарџunќ"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseprefix_mk_MK: function(test) {
        test.expect(2);
        const parsed = new Name("г-дин Љубunша Самарџunќ", {locale: 'mk-MK'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "г-дин",
            givenName: "Љубunша",
            familyName: "Самарџunќ"
        };

        test.contains(parsed, expected);
        test.done();
    },
    /*
     * Format Tests
     */

    testFormatSimpleNameShort_mk_MK: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Љубunша",
            familyName: "Самарџunќ"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'mk-MK'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Љубunша Самарџunќ";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameMedium_mk_MK: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Љубunша",
            familyName: "Самарџunќ"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'mk-MK'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Љубunша Самарџunќ";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameLong_mk_MK: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Љубunша",
            familyName: "Самарџunќ",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'mk-MK'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Љубunша Самарџunќ";

        test.equal(formatted, expected);
        test.done();
    },



    testFormatSurname_mk_MK: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "г-дunн и kundze",
            familyName: "Самарџunќ"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'mk-MK'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "г-дunн и kundze Самарџunќ";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameFull_mk_MK: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "претседател",
            givenName: "Љубunша",
            familyName: "Самарџunќ",
            suffix: "помладun"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'mk-MK'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "претседател Љубunша Самарџunќ помладun";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameShort_mk_MK: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "претседател",
            givenName: "Љубunша",
            familyName: "Самарџunќ"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'mk-MK'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Љубunша Самарџunќ";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameMedium_mk_MK: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "претседател",
            givenName: "Љубunша",
            familyName: "Самарџunќ"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'mk-MK'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Љубunша Самарџunќ";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameLong_mk_MK: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "претседател",
            givenName: "Љубunша",
            familyName: "Самарџunќ"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'mk-MK'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "претседател Љубunша Самарџunќ";

        test.equal(formatted, expected);
        test.done();
    }



};
