/*
 * testname_mn_Cyrl.js - test the name object in Arabic
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

import Name from '../src/NameFmt.js';
import Name from '../src/Name.js';

export const testname_mn_Cyrl = {
    setUp: function(callback) {
        ilib.clearCache();
        callback();
    },

    testParseSimpleName_mn_Cyrl: function(test) {
        test.expect(2);
        const parsed = new Name("Цахиагийн Элбэгдорж", {locale: 'mn-Cyrl-MN'});
        test.ok(typeof(parsed) !== "undefined");

        const expected =   {
            givenName: "Цахиагийн",
            familyName: "Элбэгдорж"
        };

        test.contains(parsed, expected);
        test.done();
    },


    testParseAdjunctNames_mn_Cyrl: function(test) {
        test.expect(2);
        const parsed = new Name("Ноён ба Хатагтай Элбэгдорж", {locale: 'mn-Cyrl-MN'});
        test.ok(typeof(parsed) !== "undefined");

        const expected =  {
            prefix: "Ноён ба Хатагтай",
            familyName: "Элбэгдорж"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseSingleNameWithPrefixAndAdjunct_mn_Cyrl: function(test) {
        test.expect(2);
        const parsed = new Name("хатагтай Элбэгдорж", {locale: 'mn-Cyrl-MN'});
        test.ok(typeof(parsed) !== "undefined");

        const expected =   {
            prefix: "хатагтай",
            familyName: "Элбэгдорж"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseTitle_mn_Cyrl: function(test) {
        test.expect(2);
        const parsed = new Name("Цахиагийн Элбэгдорж 9-р", {locale: 'mn-Cyrl-MN'});
        test.ok(typeof(parsed) !== "undefined");

        const expected =    {
            suffix: "9-р",
            givenName: "Цахиагийн",
            familyName: "Элбэгдорж"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseEverything_mn_Cyrl: function(test) {
        test.expect(2);
        const parsed = new Name("ц.э Цахиагийн Элбэгдорж ерөнхийлөгч", {locale: 'mn-Cyrl-MN'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "ц.э",
            suffix: "ерөнхийлөгч",
            givenName: "Цахиагийн",
            familyName: "Элбэгдорж"
        };

        test.contains(parsed, expected);
        test.done();
    },

    /*
     * Format Tests
     */

    testFormatSimpleNameFull_mn_Cyrl: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "mонгол Улсын Ерөнхийлөгч",
            givenName: "Цахиагийн",
            familyName: "Элбэгдорж",
            suffix: "9-р"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'mn-Cyrl-MN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "mонгол Улсын Ерөнхийлөгч Цахиагийн Элбэгдорж 9-р";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameShort_mn_Cyrl: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "mонгол Улсын Ерөнхийлөгч",
            givenName: "Цахиагийн",
            familyName: "Элбэгдорж"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'mn-Cyrl-MN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Цахиагийн Элбэгдорж";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameMedium_mn_Cyrl: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "mонгол Улсын Ерөнхийлөгч",
            givenName: "Цахиагийн",
            familyName: "Элбэгдорж"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'mn-Cyrl-MN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Цахиагийн Элбэгдорж";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameLong_mn_Cyrl: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "mонгол Улсын Ерөнхийлөгч",
            givenName: "Цахиагийн",
            familyName: "Элбэгдорж"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'mn-Cyrl-MN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "mонгол Улсын Ерөнхийлөгч Цахиагийн Элбэгдорж";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatAsianNameShort_mn_Cyrl: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'mn-Cyrl-MN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "地獸";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatAsianNameMedium_mn_Cyrl: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'mn-Cyrl-MN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "地獸";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatAsianNameLong_mn_Cyrl: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'mn-Cyrl-MN'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "小地獸";

        test.equal(formatted, expected);
        test.done();
    }






};
