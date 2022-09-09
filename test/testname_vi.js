/*
 * testname_vi.js - test the name object in Vietnamese
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


export const testname_vi = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            return LocaleData.ensureLocale("vi-VN").then(() => {
                callback();
            });
        } else {
            callback();
        }
    },

    testParseSimpleName_vi: function(test) {
        test.expect(2);
        const parsed = new Name("Chau-Giang Thi Nguyen", {locale: 'vi-VN'});
        test.ok(typeof(parsed) !== "undefined");

        const expected =   {
            givenName: "Chau-Giang",
            middleName: "Thi",
            familyName: "Nguyen"
        };

        test.contains(parsed, expected);
        test.done();
    },


    testParseAdjunctNames_vi: function(test) {
        test.expect(2);
        const parsed = new Name("Chau-Giang Thi Nguyen", {locale: 'vi-VN'});
        test.ok(typeof(parsed) !== "undefined");

        const expected =  {
            givenName: "Chau-Giang",
            middleName: "Thi",
            familyName: "Nguyen"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseSingleNameWithPrefixAndAdjunct_vi: function(test) {
        test.expect(2);
        const parsed = new Name("Ông và Bà Nguyen", {locale: 'vi-VN'});
        test.ok(typeof(parsed) !== "undefined");

        const expected =   {
            prefix: "Ông và Bà",
            familyName: "Nguyen"
        };

        test.contains(parsed, expected);
        test.done();
    },


    testParseTitle_vi: function(test) {
        test.expect(2);
        const parsed = new Name("Chau-Giang Nguyen Cao cấp", {locale: 'vi-VN'});
        test.ok(typeof(parsed) !== "undefined");

        const expected =    {
            suffix: "Cao cấp",
            givenName: "Chau-Giang",
            familyName: "Nguyen"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseTitleWithFamilyOnly_vi: function(test) {
        test.expect(2);
        const parsed = new Name("Thị trưởng Nguyen", {locale: 'vi-VN'});
        test.ok(typeof(parsed) !== "undefined");

        const expected =   {
            prefix: "Thị trưởng",
            familyName: "Nguyen"
        };

        test.contains(parsed, expected);
        test.done();
    },



    testParseEverything_vi: function(test) {
        test.expect(2);
        const parsed = new Name("Ông Chau-Giang Thi Nguyen", {locale: 'vi-VN'});
        test.ok(typeof(parsed) !== "undefined");

        const expected =    {
            prefix: "Ông",
            givenName: "Chau-Giang",
            middleName: "Thi",
            familyName: "Nguyen"
        };

        test.contains(parsed, expected);
        test.done();
    },


    /*
     * Format Tests
     */

    testFormatSimpleNameShort_vi: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Chau-Giang",
            middleName: "Thi",
            familyName: "Nguyen"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'vi-VN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Chau-Giang Nguyen";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameMedium_vi: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Chau-Giang",
            middleName: "Thi",
            familyName: "Nguyen"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'vi-VN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Chau-Giang Thi Nguyen";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameLong_vi: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Chau-Giang",
            middleName: "Thi",
            familyName: "Nguyen",
            suffix: "Cao cấp"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'vi-VN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Chau-Giang Thi Nguyen";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameFull_vi: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Ông",
            givenName: "Chau-Giang",
            middleName: "Thi",
            familyName: "Nguyen",
            suffix: "Cao cấp"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'vi-VN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Ông Chau-Giang Thi Nguyen Cao cấp";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameShort_vi: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Ông",
            givenName: "Chau-Giang",
            middleName: "Thi",
            familyName: "Nguyen"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'vi-VN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Chau-Giang Nguyen";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameMedium_vi: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Ông",
            givenName: "Chau-Giang",
            middleName: "Thi",
            familyName: "Nguyen"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'vi-VN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Chau-Giang Thi Nguyen";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameLong_vi: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Ông",
            givenName: "Chau-Giang",
            middleName: "Thi",
            familyName: "Nguyen"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'vi-VN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Ông Chau-Giang Thi Nguyen";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatAsianNameShort_vi: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'vi-VN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "地獸";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatAsianNameMedium_vi: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'vi-VN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "地獸";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatAsianNameLong_vi: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'vi-VN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "小地獸";

        test.equal(formatted, expected);
        test.done();
    }






};
