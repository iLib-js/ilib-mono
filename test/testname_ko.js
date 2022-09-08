/*
 * testname_ko.js - test the name object in Korean
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


export const testname_ko = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            return LocaleData.ensureLocale("ko-KR").then(() => {
                callback();
            });
        } else {
            callback();
        }
    },

    testParseSimpleName_ko_KR: function(test) {
        test.expect(2);
        const parsed = new Name("정훈교", {locale: 'ko-KR', order:"fmg"});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "훈교",
            familyName: "정"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseSimpleNameBogusOrder_ko_KR: function(test) {
        test.expect(2);
        const parsed = new Name("정훈교", {locale: 'ko-KR', order:"xcfa"});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "훈교",
            familyName: "정"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseWithHonorific_ko_KR: function(test) {
        test.expect(2);
        const parsed = new Name("정훈교씨", {locale: 'ko-KR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "훈교",
            familyName: "정",
            suffix: "씨"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseNameWithPrefix_ko_KR1: function(test) {
        test.expect(2);
        const parsed = new Name("미스터김근면", {locale: 'ko-KR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "미스터",
            givenName: "근면",
            familyName: "김"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseLatinName_ko_KR: function(test) {
        test.expect(2);
        // written with western style when in Latin
        const parsed = new Name("Byeongsub Kim", {locale: 'ko-KR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Byeongsub",
            familyName: "Kim"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseTitle_ko_KR: function(test) {
        test.expect(2);
        const parsed = new Name("미스터김동경", {locale: 'ko-KR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "미스터",
            givenName: "동경",
            familyName: "김"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseHonorific_ko_KR: function(test) {
        test.expect(2);
        const parsed = new Name("미스터김동경", {locale: 'ko-KR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "미스터",
            givenName: "동경",
            familyName: "김"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseSuffix_ko_KR: function(test) {
        test.expect(2);
        const parsed = new Name("김동경주니어", {locale: 'ko-KR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "동경",
            familyName: "김",
            suffix: "주니어"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseWithLongMixedName_ko_KR: function(test) {
        test.expect(2);
        const parsed = new Name("홍길동/선임연구원/MC연구소 A실 1팀 1파트", {locale: "ko-KR"});
        test.ok(typeof(parsed) !== "undefined");
        const expected = {
            familyName: "홍",
            givenName: "길동",
            suffix: "/선임연구원/MC연구소 A실 1팀 1파트"
        };
        test.contains(parsed, expected);
        test.done();
    },

    testParseWithLongMixedName2_ko_KR: function(test) {
        test.expect(2);
        const parsed = new Name("홍길동/Software Engineer", {locale: "ko-KR"});
        test.ok(typeof(parsed) !== "undefined");
        const expected = {
            familyName: "홍",
            givenName: "길동",
            suffix: "/Software Engineer"
        };
        test.contains(parsed, expected);
        test.done();
    },

    testParseWithLongMixedName2_ko_KR: function(test) {
        test.expect(2);
        const parsed = new Name("김Jinah/Software Engineer", {locale: "ko-KR"});
        test.ok(typeof(parsed) !== "undefined");
        const expected = {
            familyName: "김",
            givenName: "Jinah",
            suffix: "/Software Engineer"
        };
        test.contains(parsed, expected);
        test.done();
    },


    // for DFISH-25146
    testParseSuffixWithComma_ko_KR: function(test) {
        test.expect(2);
        const parsed = new Name("김동경,박사", {locale: 'ko-KR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "동경",
            familyName: "김",
            suffix: ",박사"
        };

        test.contains(parsed, expected);
        test.done();
    },


    testLastNames_ko_KR: function(test) {
        test.expect(2);
        const parsed = new Name("미스터강", {locale: 'ko-KR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "미스터",
            familyName: "강"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParsePunctInSuffix_ko_KR: function(test) {
        test.expect(2);
        const parsed = new Name("홍길동 선임연구원", {locale: "ko-KR"});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            familyName: "홍",
            givenName: "길동 ",
            suffix: "선임연구원"
        };
        test.contains(parsed, expected);
        test.done();
    },

    testParsePunctInSuffix2_ko_KR: function(test) {
        test.expect(2);
        const parsed = new Name("홍길동 선임", {locale: "ko-KR"});
        test.ok(typeof(parsed) !== "undefined");
        const expected = {
            familyName: "홍",
            givenName: "길동 ",
            suffix: "선임"
        };
        test.contains(parsed, expected);
        test.done();
    },

    testParsePunctInSuffix3_ko_KR: function(test) {
        test.expect(2);
        const parsed = new Name("홍길동 선임 연구원", {locale: "ko-KR"});
        test.ok(typeof(parsed) !== "undefined");
        const expected = {
            familyName: "홍",
            givenName: "길동 선임 ",
            suffix: "연구원"
        };
        test.contains(parsed, expected);
        test.done();
    },

    testParseWithfourLength1_ko_KR: function(test) {
        test.expect(2);
        const parsed = new Name("가나다라", {locale: 'ko-KR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            familyName: "가",
            givenName: "나다라"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testParseWithfourLength2_ko_KR: function(test) {
        test.expect(2);
        const parsed = new Name("김빛나리", {locale: 'ko-KR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            familyName: "김",
            givenName: "빛나리"
        };
        test.contains(parsed, expected);
        test.done();
    },

    testParseLongCharacters1_ko_KR: function(test) {
        test.expect(2);
        const parsed = new Name("가나다라마바사", {locale: 'ko-KR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            familyName: "가",
            givenName: "나다라마바사"
        };
        test.contains(parsed, expected);
        test.done();
    },


    testParseWithSpace1_ko_KR: function(test) {
        test.expect(2);
        const parsed = new Name("김빛 나리", {locale: 'ko-KR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            familyName: "김빛",
            givenName: " 나리"
        };
        test.contains(parsed, expected);
        test.done();
    },

    testParseWithSpace2_ko_KR: function(test) {
        test.expect(2);
        const parsed = new Name("김빛나리 입니다", {locale: 'ko-KR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            familyName: "김빛나리",
            givenName: " 입니다"
        };
        test.contains(parsed, expected);
        test.done();
    },

    testParseWithSpace3_ko_KR: function(test) {
        test.expect(2);
        const parsed = new Name("김 빛나리 입니다", {locale: 'ko-KR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            familyName: "김",
            middleName: " 빛나리",
            givenName: " 입니다"
        };
        test.contains(parsed, expected);
        test.done();
    },

    testParseWithSpace4_ko_KR: function(test) {
        test.expect(2);
        const parsed = new Name("가나 다라 마바사", {locale: 'ko-KR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            familyName: "가나",
            middleName: " 다라",
            givenName: " 마바사"
        };
        test.contains(parsed, expected);
        test.done();
    },

    testParseWithSpace5_ko_KR: function(test) {
        test.expect(2);
        const parsed = new Name("가나 다라 마 바사", {locale: 'ko-KR'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            familyName: "가나",
            middleName: " 다라 마",
            givenName: " 바사"
        };
        test.contains(parsed, expected);
        test.done();
    },

    /*
     * Format tests
     */

    testFormatSimpleNameShort_ko_KR: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "미스터",
            givenName: "동경",
            familyName: "김",
            suffix: ", 박사"
        });
        let fmt = new NameFmt({style: "short", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "김동경";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameMedium_ko_KR: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "미스터",
            givenName: "동경",
            familyName: "김",
            suffix: ", 박사"
        });
        let fmt = new NameFmt({style: "medium", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "김동경";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameLong_ko_KR: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "미스터",
            givenName: "동경",
            familyName: "김",
            suffix: ", 박사"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'ko-KR'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "김동경 , 박사";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatSimpleNameFull_ko_KR: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "미스터",
            givenName: "동경",
            familyName: "김",
            suffix: ", 박사"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'ko-KR'
        });
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "미스터 김동경 , 박사";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameShort_ko_KR: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "미스터",
            givenName: "경",
            familyName: "남궁",
            suffix: "씨"
        });
        let fmt = new NameFmt({style: "short", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "남궁경";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameMedium_ko_KR: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "미스터",
            givenName: "동경",
            familyName: "남궁",
            suffix: "씨"
        });
        let fmt = new NameFmt({style: "medium", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "남궁동경";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameLong_ko_KR: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "미스터",
            givenName: "동경",
            familyName: "남궁",
            suffix: "씨"
        });
        let fmt = new NameFmt({style: "long", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "남궁동경 씨";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatComplexNameFull_ko_KR: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "미스터",
            givenName: "동경",
            familyName: "남궁",
            suffix: "씨"
        });
        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "미스터 남궁동경 씨";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatCommasInSuffix_ko_KR: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "미스터",
            givenName: "동경",
            familyName: "남궁",
            suffix: "씨"
        });
        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "미스터 남궁동경 씨";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatWithNulls_ko_KR: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: null,
            givenName: "경",
            middleName: null,
            familyName: "김",
            suffix: null
        });

        let fmt = new NameFmt({style: "long", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "김경";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatWithLongMixedName_ko_KR: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "연구소 A실 1팀 1파트",
            familyName: "홍길동/선임연구원/MC",
        });
        let fmt = new NameFmt({style: "long", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "홍길동/선임연구원/MC연구소 A실 1팀 1파트";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatWithHonorifix_ko_KR: function(test) {
        test.expect(3);
        const parsed = new Name("정훈교씨", {locale: 'ko-KR'});
        test.ok(typeof(parsed) !== "undefined");

        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(parsed);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "정훈교 씨";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatWithSuffix_ko_KR: function(test) {
        test.expect(3);
        const parsed = new Name("홍길동선배", {locale: 'ko-KR'});
        test.ok(typeof(parsed) !== "undefined");

        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(parsed);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "홍길동 선배";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatPunctInSuffix_ko_KR: function(test) {
        test.expect(3);
        const parsed = new Name("홍길동 선임 연구원", {locale: "ko-KR"});
        test.ok(typeof(parsed) !== "undefined");

        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(parsed);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "홍길동 선임 연구원";
        test.equal(formatted, expected);
        test.done();
    },

    testParsePunctInSuffix1_ko_KR: function(test) {
        test.expect(3);
        const parsed = new Name("홍길동 회장", {locale: "ko-KR"});
        test.ok(typeof(parsed) !== "undefined");

        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(parsed);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "홍길동 회장";
        test.equal(formatted, expected);
        test.done();
    },

    testFormatWithSuffix2_ko_KR: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "길동",
            familyName: "홍",
            suffix: "주임"
        });
        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "홍길동 주임";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatWithSuffix3_ko_KR: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "길동",
            familyName: "홍",
            suffix: "선생님"
        });
        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "홍길동 선생님";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatWithSuffix4_ko_KR: function(test) {
        test.expect(3);
        let name = new Name("홍길동 선임 연구원", {locale: "ko-KR"});
        test.ok(typeof(name) !== "undefined");

        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "홍길동 선임 연구원";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatWithCopyConstructor_ko_KR: function(test) {
        test.expect(2);
        let name = new Name({
            familyName: "가",
            givenName: "나"
        });
        let fmt = new NameFmt({locale: 'ko-KR'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "가나";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatWithfullStyleWithoutSuffix1_ko_KR: function(test) {
        test.expect(2);
        let name = new Name("홍길동", {locale: "ko-KR"});

        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "홍길동";

        test.equal(formatted, expected);
        test.done();
    },


    testFormatWithName_ko_KR: function(test) {
        test.expect(3);
        let name = new Name("빛나리", {locale: 'ko-KR'});
        test.ok(typeof(name) !== "undefined");

        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "빛나리";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatWithfullStyleWithoutSuffix2_ko_KR: function(test) {
        test.expect(2);
        let name = new Name({
            familyName: "홍",
            givenName: "길동"
        });
        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "홍길동";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatWithfourLength1_ko_KR: function(test) {
        test.expect(3);
        let name = new Name("가나다라", {locale: 'ko-KR'});
        test.ok(typeof(name) !== "undefined");

        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "가나다라";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatWithfourLength2_ko_KR: function(test) {
        test.expect(3);
        let name = new Name("김빛나리", {locale: 'ko-KR'});
        test.ok(typeof(name) !== "undefined");

        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "김빛나리";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatLongCharacters1_ko_KR: function(test) {
        test.expect(3);
        let name = new Name("가나다라마바사", {locale: 'ko-KR'});
        test.ok(typeof(name) !== "undefined");

        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "가나다라마바사";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatWithSpace1_ko_KR: function(test) {
        test.expect(3);
        let name = new Name("김빛 나리", {locale: 'ko-KR'});
        test.ok(typeof(name) !== "undefined");

        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "김빛 나리";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatWithSpace2_ko_KR: function(test) {
        test.expect(3);
        let name = new Name("김빛나리 입니다", {locale: 'ko-KR'});
        test.ok(typeof(name) !== "undefined");

        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "김빛나리 입니다";
        test.equal(formatted, expected);
        test.done();
    },

    testFormatWithSpace3_ko_KR: function(test) {
        test.expect(3);
        let name = new Name("김 빛나리 입니다", {locale: 'ko-KR'});
        test.ok(typeof(name) !== "undefined");


        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "김 빛나리 입니다";

        test.equal(formatted, expected);
        test.done();
    },

    testFormatWithSpace4_ko_KR: function(test) {
        test.expect(3);
        let name = new Name("가나 다라 마바사", {locale: 'ko-KR'});
        test.ok(typeof(name) !== "undefined");

        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "가나 다라 마바사";
        test.equal(formatted, expected);
        test.done();
    },

    testFormatWithSpace5_ko_KR: function(test) {
        test.expect(3);
        let name = new Name("가나 다라 마 바사", {locale: 'ko-KR'});
        test.ok(typeof(name) !== "undefined");

        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "가나 다라 마 바사";

        test.equal(formatted, expected);
        test.done();
    }

};
