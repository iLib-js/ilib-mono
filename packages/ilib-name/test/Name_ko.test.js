/*
 * Name_ko.test.js - test the name object in Korean
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

describe("Name_ko", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("ko-KR");
        }
    });

    test("should parse a simple Korean name", () => {
        expect.assertions(2);
        const parsed = new Name("정훈교", {locale: 'ko-KR', order:"fmg"});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "훈교",
            familyName: "정"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a simple Korean name with a bogus order", () => {
        expect.assertions(2);
        const parsed = new Name("정훈교", {locale: 'ko-KR', order:"xcfa"});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "훈교",
            familyName: "정"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Korean name with an honorific", () => {
        expect.assertions(2);
        const parsed = new Name("정훈교씨", {locale: 'ko-KR'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "훈교",
            familyName: "정",
            suffix: "씨"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Korean name with a prefix", () => {
        expect.assertions(2);
        const parsed = new Name("미스터김근면", {locale: 'ko-KR'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "미스터",
            givenName: "근면",
            familyName: "김"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Latin Korean name", () => {
        expect.assertions(2);
        // written with western style when in Latin
        const parsed = new Name("Byeongsub Kim", {locale: 'ko-KR'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Byeongsub",
            familyName: "Kim"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Korean name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("미스터김동경", {locale: 'ko-KR'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "미스터",
            givenName: "동경",
            familyName: "김"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Korean honorific", () => {
        expect.assertions(2);
        const parsed = new Name("미스터김동경", {locale: 'ko-KR'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "미스터",
            givenName: "동경",
            familyName: "김"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Korean name suffix", () => {
        expect.assertions(2);
        const parsed = new Name("김동경주니어", {locale: 'ko-KR'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "동경",
            familyName: "김",
            suffix: "주니어"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a long mixed Korean name", () => {
        expect.assertions(2);
        const parsed = new Name("홍길동/선임연구원/MC연구소 A실 1팀 1파트", {locale: "ko-KR"});
        expect(parsed).toBeTruthy();
        const expected = {
            familyName: "홍",
            givenName: "길동",
            suffix: "/선임연구원/MC연구소 A실 1팀 1파트"
        };
        expect(parsed).toMatchObject(expected);
    });

    test("should parse a long mixed Korean name (2)", () => {
        expect.assertions(2);
        const parsed = new Name("홍길동/Software Engineer", {locale: "ko-KR"});
        expect(parsed).toBeTruthy();
        const expected = {
            familyName: "홍",
            givenName: "길동",
            suffix: "/Software Engineer"
        };
        expect(parsed).toMatchObject(expected);
    });

    test("should parse a long mixed Korean name (2)", () => {
        expect.assertions(2);
        const parsed = new Name("김Jinah/Software Engineer", {locale: "ko-KR"});
        expect(parsed).toBeTruthy();
        const expected = {
            familyName: "김",
            givenName: "Jinah",
            suffix: "/Software Engineer"
        };
        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Korean name suffix with a comma", () => {
        expect.assertions(2);
        const parsed = new Name("김동경,박사", {locale: 'ko-KR'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "동경",
            familyName: "김",
            suffix: ",박사"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should handle Korean last names", () => {
        expect.assertions(2);
        const parsed = new Name("미스터강", {locale: 'ko-KR'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "미스터",
            familyName: "강"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse punctuation in a Korean name suffix", () => {
        expect.assertions(2);
        const parsed = new Name("홍길동 선임연구원", {locale: "ko-KR"});
        expect(parsed).toBeTruthy();

        const expected = {
            familyName: "홍",
            givenName: "길동 ",
            suffix: "선임연구원"
        };
        expect(parsed).toMatchObject(expected);
    });

    test("should parse punctuation in a Korean name suffix (2)", () => {
        expect.assertions(2);
        const parsed = new Name("홍길동 선임", {locale: "ko-KR"});
        expect(parsed).toBeTruthy();
        const expected = {
            familyName: "홍",
            givenName: "길동 ",
            suffix: "선임"
        };
        expect(parsed).toMatchObject(expected);
    });

    test("should parse punctuation in a Korean name suffix (3)", () => {
        expect.assertions(2);
        const parsed = new Name("홍길동 선임 연구원", {locale: "ko-KR"});
        expect(parsed).toBeTruthy();
        const expected = {
            familyName: "홍",
            givenName: "길동 선임 ",
            suffix: "연구원"
        };
        expect(parsed).toMatchObject(expected);
    });

    test("should parse a four-character Korean name (1)", () => {
        expect.assertions(2);
        const parsed = new Name("가나다라", {locale: 'ko-KR'});
        expect(parsed).toBeTruthy();

        const expected = {
            familyName: "가",
            givenName: "나다라"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a four-character Korean name (2)", () => {
        expect.assertions(2);
        const parsed = new Name("김빛나리", {locale: 'ko-KR'});
        expect(parsed).toBeTruthy();

        const expected = {
            familyName: "김",
            givenName: "빛나리"
        };
        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Korean name with long characters (1)", () => {
        expect.assertions(2);
        const parsed = new Name("가나다라마바사", {locale: 'ko-KR'});
        expect(parsed).toBeTruthy();

        const expected = {
            familyName: "가",
            givenName: "나다라마바사"
        };
        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Korean name with a space (1)", () => {
        expect.assertions(2);
        const parsed = new Name("김빛 나리", {locale: 'ko-KR'});
        expect(parsed).toBeTruthy();

        const expected = {
            familyName: "김빛",
            givenName: " 나리"
        };
        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Korean name with a space (2)", () => {
        expect.assertions(2);
        const parsed = new Name("김빛나리 입니다", {locale: 'ko-KR'});
        expect(parsed).toBeTruthy();

        const expected = {
            familyName: "김빛나리",
            givenName: " 입니다"
        };
        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Korean name with a space (3)", () => {
        expect.assertions(2);
        const parsed = new Name("김 빛나리 입니다", {locale: 'ko-KR'});
        expect(parsed).toBeTruthy();

        const expected = {
            familyName: "김",
            middleName: " 빛나리",
            givenName: " 입니다"
        };
        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Korean name with a space (4)", () => {
        expect.assertions(2);
        const parsed = new Name("가나 다라 마바사", {locale: 'ko-KR'});
        expect(parsed).toBeTruthy();

        const expected = {
            familyName: "가나",
            middleName: " 다라",
            givenName: " 마바사"
        };
        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Korean name with a space (5)", () => {
        expect.assertions(2);
        const parsed = new Name("가나 다라 마 바사", {locale: 'ko-KR'});
        expect(parsed).toBeTruthy();

        const expected = {
            familyName: "가나",
            middleName: " 다라 마",
            givenName: " 바사"
        };
        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Korean name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "미스터",
            givenName: "동경",
            familyName: "김",
            suffix: ", 박사"
        });
        let fmt = new NameFmt({style: "short", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "김동경";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Korean name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "미스터",
            givenName: "동경",
            familyName: "김",
            suffix: ", 박사"
        });
        let fmt = new NameFmt({style: "medium", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "김동경";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Korean name in long style", () => {
        expect.assertions(2);
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
        expect(formatted).toBeTruthy();

        const expected = "김동경 , 박사";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Korean name in full style", () => {
        expect.assertions(2);
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
        expect(formatted).toBeTruthy();

        const expected = "미스터 김동경 , 박사";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Korean name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "미스터",
            givenName: "경",
            familyName: "남궁",
            suffix: "씨"
        });
        let fmt = new NameFmt({style: "short", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "남궁경";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Korean name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "미스터",
            givenName: "동경",
            familyName: "남궁",
            suffix: "씨"
        });
        let fmt = new NameFmt({style: "medium", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "남궁동경";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Korean name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "미스터",
            givenName: "동경",
            familyName: "남궁",
            suffix: "씨"
        });
        let fmt = new NameFmt({style: "long", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "남궁동경 씨";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Korean name in full style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "미스터",
            givenName: "동경",
            familyName: "남궁",
            suffix: "씨"
        });
        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "미스터 남궁동경 씨";

        expect(formatted).toBe(expected);
    });

    test("should format commas in a Korean name suffix", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "미스터",
            givenName: "동경",
            familyName: "남궁",
            suffix: "씨"
        });
        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "미스터 남궁동경 씨";

        expect(formatted).toBe(expected);
    });

    test("should format a Korean name with nulls", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: null,
            givenName: "경",
            middleName: null,
            familyName: "김",
            suffix: null
        });

        let fmt = new NameFmt({style: "long", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "김경";

        expect(formatted).toBe(expected);
    });

    test("should format a long mixed Korean name", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "연구소 A실 1팀 1파트",
            familyName: "홍길동/선임연구원/MC",
        });
        let fmt = new NameFmt({style: "long", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "홍길동/선임연구원/MC연구소 A실 1팀 1파트";

        expect(formatted).toBe(expected);
    });

    test("should format a Korean name with an honorific", () => {
        expect.assertions(3);
        const parsed = new Name("정훈교씨", {locale: 'ko-KR'});
        expect(parsed).toBeTruthy();

        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(parsed);
        expect(formatted).toBeTruthy();

        const expected = "정훈교 씨";

        expect(formatted).toBe(expected);
    });

    test("should format a Korean name with a suffix", () => {
        expect.assertions(3);
        const parsed = new Name("홍길동선배", {locale: 'ko-KR'});
        expect(parsed).toBeTruthy();

        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(parsed);
        expect(formatted).toBeTruthy();

        const expected = "홍길동 선배";

        expect(formatted).toBe(expected);
    });

    test("should format punctuation in a Korean name suffix", () => {
        expect.assertions(3);
        const parsed = new Name("홍길동 선임 연구원", {locale: "ko-KR"});
        expect(parsed).toBeTruthy();

        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(parsed);
        expect(formatted).toBeTruthy();

        const expected = "홍길동 선임 연구원";
        expect(formatted).toBe(expected);
    });

    test("should parse punctuation in a Korean name suffix (1)", () => {
        expect.assertions(3);
        const parsed = new Name("홍길동 회장", {locale: "ko-KR"});
        expect(parsed).toBeTruthy();

        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(parsed);
        expect(formatted).toBeTruthy();

        const expected = "홍길동 회장";
        expect(formatted).toBe(expected);
    });

    test("should format a Korean name with a suffix (2)", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "길동",
            familyName: "홍",
            suffix: "주임"
        });
        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "홍길동 주임";

        expect(formatted).toBe(expected);
    });

    test("should format a Korean name with a suffix (3)", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "길동",
            familyName: "홍",
            suffix: "선생님"
        });
        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "홍길동 선생님";

        expect(formatted).toBe(expected);
    });

    test("should format a Korean name with a suffix (4)", () => {
        expect.assertions(3);
        let name = new Name("홍길동 선임 연구원", {locale: "ko-KR"});
        expect(name).toBeTruthy();

        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "홍길동 선임 연구원";

        expect(formatted).toBe(expected);
    });

    test("should format a Korean name using the copy constructor", () => {
        expect.assertions(2);
        let name = new Name({
            familyName: "가",
            givenName: "나"
        });
        let fmt = new NameFmt({locale: 'ko-KR'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "가나";

        expect(formatted).toBe(expected);
    });

    test("should format a Korean name in full style without a suffix (1)", () => {
        expect.assertions(2);
        let name = new Name("홍길동", {locale: "ko-KR"});

        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "홍길동";

        expect(formatted).toBe(expected);
    });

    test("should format a Korean name", () => {
        expect.assertions(3);
        let name = new Name("빛나리", {locale: 'ko-KR'});
        expect(name).toBeTruthy();

        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "빛나리";

        expect(formatted).toBe(expected);
    });

    test("should format a Korean name in full style without a suffix (2)", () => {
        expect.assertions(2);
        let name = new Name({
            familyName: "홍",
            givenName: "길동"
        });
        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "홍길동";

        expect(formatted).toBe(expected);
    });

    test("should format a four-character Korean name (1)", () => {
        expect.assertions(3);
        let name = new Name("가나다라", {locale: 'ko-KR'});
        expect(name).toBeTruthy();

        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "가나다라";

        expect(formatted).toBe(expected);
    });

    test("should format a four-character Korean name (2)", () => {
        expect.assertions(3);
        let name = new Name("김빛나리", {locale: 'ko-KR'});
        expect(name).toBeTruthy();

        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "김빛나리";

        expect(formatted).toBe(expected);
    });

    test("should format a Korean name with long characters (1)", () => {
        expect.assertions(3);
        let name = new Name("가나다라마바사", {locale: 'ko-KR'});
        expect(name).toBeTruthy();

        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "가나다라마바사";

        expect(formatted).toBe(expected);
    });

    test("should format a Korean name with a space (1)", () => {
        expect.assertions(3);
        let name = new Name("김빛 나리", {locale: 'ko-KR'});
        expect(name).toBeTruthy();

        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "김빛 나리";

        expect(formatted).toBe(expected);
    });

    test("should format a Korean name with a space (2)", () => {
        expect.assertions(3);
        let name = new Name("김빛나리 입니다", {locale: 'ko-KR'});
        expect(name).toBeTruthy();

        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "김빛나리 입니다";
        expect(formatted).toBe(expected);
    });

    test("should format a Korean name with a space (3)", () => {
        expect.assertions(3);
        let name = new Name("김 빛나리 입니다", {locale: 'ko-KR'});
        expect(name).toBeTruthy();


        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "김 빛나리 입니다";

        expect(formatted).toBe(expected);
    });

    test("should format a Korean name with a space (4)", () => {
        expect.assertions(3);
        let name = new Name("가나 다라 마바사", {locale: 'ko-KR'});
        expect(name).toBeTruthy();

        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "가나 다라 마바사";
        expect(formatted).toBe(expected);
    });

    test("should format a Korean name with a space (5)", () => {
        expect.assertions(3);
        let name = new Name("가나 다라 마 바사", {locale: 'ko-KR'});
        expect(name).toBeTruthy();

        let fmt = new NameFmt({style: "full", locale: 'ko-KR'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "가나 다라 마 바사";

        expect(formatted).toBe(expected);
    });

});
