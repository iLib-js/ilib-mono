/*
 * testname_en.js - test the name object in Japanese
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


export const testname_ja = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            return LocaleData.ensureLocale("ja-JP").then(() => {
                callback();
            });
        } else {
            callback();
        }
    },

    testParseSimpleNameEuro_ja_JP: function(test) {
        test.expect(2);
        const parsed = new Name("Takuya Kimura", {locale: 'ja-JP'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Takuya",
            familyName: "Kimura"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseSimpleNameAsian_ja_JP: function(test) {
        test.expect(2);
        const parsed = new Name("高橋弘樹", {locale: 'ja-JP'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "弘樹",
            familyName: "高橋"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseSingleNameWithPrefixAndAdjunct_ja_JP: function(test) {
        test.expect(2);
        const parsed = new Name("高橋弘樹さん", {locale: 'ja-JP'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            suffix : "さん",
            givenName: "弘樹",
            familyName: "高橋"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseTitle_ja_JP1: function(test) {
        test.expect(2);
        const parsed = new Name("高橋弘樹知事", {locale: 'ja-JP'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            suffix: "知事",
            givenName: "弘樹",
            familyName: "高橋"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseTitleWithFamilyOnlyAndAdjunct_ja_JP: function(test) {
        test.expect(2);
        const parsed = new Name("高橋弘樹教授", {locale: 'ja-JP'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            suffix: "教授",
            givenName: "弘樹",
            familyName: "高橋"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseCompoundHonorific_ja_JP: function(test) {
        test.expect(2);
        const parsed = new Name("高橋教授", {locale: 'ja-JP'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            suffix: "教授",
            familyName: "高橋"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseCompoundHonorific_ja_JP1: function(test) {
        test.expect(2);
        const parsed = new Name("高橋総裁", {locale: 'ja-JP'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            suffix : "総裁",
            familyName: "高橋"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseFamilyName_ja_JP1: function(test) {
        test.expect(2);
        const parsed = new Name("佐々木主浩", {locale: 'ja-JP'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName : "主浩",
            familyName: "佐々木"
        };

        test.contains(parsed, expected);
        test.done();
    },


    testParseWithLongMixedName_ja_JP: function(test) {
        test.expect(2);
        const parsed = new Name("佐々木主浩/Software Engineer", {locale: "ja-JP"});
        test.ok(typeof(parsed) !== "undefined");
        const expected = {
            givenName : "主浩",
            familyName: "佐々木",
            suffix: "/Software Engineer"
        };
        test.contains(parsed, expected);
        test.done();
    },

    /*
     * Format Tests
     */

    testFormatSimpleNameShort_ja_JP: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "弘樹",
            familyName: "高橋"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'ja-JP'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "高橋弘樹";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameMedium_ja_JP: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "弘樹",
            familyName: "高橋"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'ja-JP'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "高橋弘樹";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameFull_ja_JP: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "弘樹",
            familyName: "高橋",
            suffix: "副大統領ご"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'ja-JP'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "高橋弘樹副大統領ご";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameShort_ja_JP: function(test) {
        test.expect(2);
        let name = new Name({
            suffix: "きゅう",
            givenName: "弘樹",
            familyName: "高橋"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'ja-JP'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "高橋弘樹";

        test.equal(formatted, expected);
        test.done();
    },


    testFormatAsianNameMedium_ja_JP: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'ja-JP'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "地獸";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatAsianNameLong_ja_JP: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'ja-JP'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "小地獸太太";

        test.equal(formatted, expected);
        test.done();
    }

};
