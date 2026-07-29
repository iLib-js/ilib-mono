/*
 * Name_ru.test.js - test the name object in Russian
 *
 * Copyright © 2013-2015,2017,2022 JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Uruess required by applicable law or agreed to in writing, software
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

describe("Name_ru", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("ru-RU");
        }
    });

    test("should parse a simple Russian name", () => {
        expect.assertions(2);
        const parsed = new Name("Андрей Николаевич", {locale: 'ru-RU'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Андрей",
            middleName: "Николаевич"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a triple name", () => {
        expect.assertions(2);
        const parsed = new Name("Андрей Микаэль Николаевич", {locale: 'ru-RU'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Микаэль",
            middleName: "Николаевич",
            familyName: "Андрей"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a quadruple name", () => {
        expect.assertions(2);
        const parsed = new Name("Андрей Микаэль Григорий Николаевич", {locale: 'ru-RU'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Микаэль Григорий",
            middleName: "Николаевич",
            familyName: "Андрей"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a title", () => {
        expect.assertions(2);
        const parsed = new Name("Доктор Андрей Николаевич", {locale: 'ru-RU'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Доктор",
            givenName: "Андрей",
            middleName: "Николаевич"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse an honorific", () => {
        expect.assertions(2);
        const parsed = new Name("Г-жа Татьяна Ивановна", {locale: 'ru-RU'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Г-жа",
            givenName: "Татьяна",
            middleName: "Ивановна"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse family name 1", () => {
        expect.assertions(2);
        const parsed = new Name("Pavel Яшкин", {locale: 'ru-RU'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Pavel",
            familyName: "Яшкин"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse family name 2", () => {
        expect.assertions(2);
        const parsed = new Name("Абакумов Pavel", {locale: 'ru-RU'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Pavel",
            familyName: "Абакумов"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse family name 3", () => {
        expect.assertions(2);
        const parsed = new Name("Pavel Андреевич", {locale: 'ru-RU'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Pavel",
            middleName: "Андреевич"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse name 1", () => {
        expect.assertions(2);
        const parsed = new Name("Иван Иванович Иванов", {locale: 'ru-RU'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Иван",
            middleName: "Иванович",
            familyName: "Иванов"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse name 2", () => {
        expect.assertions(2);
        const parsed = new Name("Иван Иванович", {locale: 'ru-RU'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Иван",
            middleName: "Иванович"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse name 3", () => {
        expect.assertions(2);
        const parsed = new Name("Иван Иванов", {locale: 'ru-RU'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Иван",
            familyName: "Иванов"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse name 4", () => {
        expect.assertions(2);
        const parsed = new Name("Иванов Иван", {locale: 'ru-RU'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Иван",
            familyName: "Иванов"
        };
        expect(parsed).toMatchObject(expected);
    });

    test("should parse name 5", () => {
        expect.assertions(2);
        const parsed = new Name("Владимир Андреевич Филатов", {locale: 'ru-RU'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Владимир",
            middleName: "Андреевич",
            familyName: "Филатов"
        };
        expect(parsed).toMatchObject(expected);
    });

    test("should parse name 6", () => {
        expect.assertions(2);
        const parsed = new Name("Владимир Андреевич", {locale: 'ru-RU'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Владимир",
            middleName: "Андреевич"
         };
        expect(parsed).toMatchObject(expected);
    });

    test("should parse name 7", () => {
        expect.assertions(2);
        const parsed = new Name("Владимир Филатов", {locale: 'ru-RU'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Владимир",
            familyName: "Филатов"
        };
        expect(parsed).toMatchObject(expected);
    });

    test("should parse name 8", () => {
        expect.assertions(2);
        const parsed = new Name("Филатов Владимир", {locale: 'ru-RU'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Владимир",
            familyName: "Филатов"
        };
        expect(parsed).toMatchObject(expected);
    });

    test("should parse name 10", () => {
        expect.assertions(2);
        const parsed = new Name("Филатов Андреевич", {locale: 'ru-RU'});
        expect(parsed).toBeTruthy();

        const expected = {
            middleName: "Андреевич",
            givenName: "Филатов"
        };
        expect(parsed).toMatchObject(expected);
    });

    test("should parse name 11", () => {
        expect.assertions(2);
        const parsed = new Name("Владимир Андреевич Филатовa", {locale: 'ru-RU'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Владимир",
            middleName: "Андреевич",
            familyName: "Филатовa"
        };
        expect(parsed).toMatchObject(expected);
    });

    test("should parse name 12", () => {
        expect.assertions(2);
        const parsed = new Name("Владимир Андреевич", {locale: 'ru-RU'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Владимир",
            middleName: "Андреевич"
        };
        expect(parsed).toMatchObject(expected);
    });

    test("should parse name 13", () => {
        expect.assertions(2);
        const parsed = new Name("Филатова Филатова", {locale: 'ru-RU'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Филатова",
            familyName: "Филатова"
        };
        expect(parsed).toMatchObject(expected);
    });

    test("should parse name 14", () => {
        expect.assertions(2);
        const parsed = new Name("Филатова Филатова", {locale: 'ru-RU'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Филатова",
            familyName: "Филатова"
        };
        expect(parsed).toMatchObject(expected);
    });

    test("should parse name 15", () => {
        expect.assertions(2);
        const parsed = new Name("Екатерина Таттар", {locale: 'ru-RU'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Екатерина",
            familyName: "Таттар"
        };
        expect(parsed).toMatchObject(expected);
    });

    test("should parse name 16", () => {
        expect.assertions(2);
        const parsed = new Name("Таттар Екатерина", {locale: 'ru-RU'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Екатерина",
            familyName: "Таттар"
        };
        expect(parsed).toMatchObject(expected);
    });

    test("should parse name 17", () => {
        expect.assertions(2);
        const parsed = new Name("Валерия Твардовскиая", {locale: 'ru-RU'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Валерия",
            familyName: "Твардовскиая"
        };
        expect(parsed).toMatchObject(expected);
    });

    test("should parse name 18", () => {
        expect.assertions(2);
        const parsed = new Name("Твардовскиая Валерия", {locale: 'ru-RU'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Валерия",
            familyName: "Твардовскиая"
        };
        expect(parsed).toMatchObject(expected);
    });

    test("should parse name 19", () => {
        expect.assertions(2);
        const parsed = new Name("Анатолы Полищук", {locale: 'ru-RU'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Анатолы",
            familyName: "Полищук"
        };
        expect(parsed).toMatchObject(expected);
    });

    test("should parse name 20", () => {
        expect.assertions(2);
        const parsed = new Name("Полищук Анатолы", {locale: 'ru-RU'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Анатолы",
            familyName: "Полищук"
        };
        expect(parsed).toMatchObject(expected);
    });

    test("should parse a name with everything", () => {
        expect.assertions(2);
        const parsed = new Name("Pavel Андреевич", {locale: 'ru-RU'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Pavel",
            middleName: "Андреевич"
        };

        expect(parsed).toMatchObject(expected);
    });

    /*
     * Format Tests
     */

    test("should format a simple name short", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Андрей",
            familyName: "Николаевич"
        });
        let fmt = new NameFmt({style: "short", locale: 'ru-RU'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Андрей Николаевич";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name medium", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Андрей",
            familyName: "Николаевич"
        });
        let fmt = new NameFmt({style: "medium", locale: 'ru-RU'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Андрей Николаевич";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name long", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Андрей",
            familyName: "Николаевич"
        });
        let fmt = new NameFmt({style: "long", locale: 'ru-RU'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Андрей Николаевич";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name full", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Андрей",
            //middleName: "Микаэль",
            familyName: "Николаевич"
        });
        let fmt = new NameFmt({style: "full", locale: 'ru-RU'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Андрей Николаевич";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name short", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Доктор",
            givenName: "Андрей",
            familyName: "Николаевич",
        });
        let fmt = new NameFmt({style: "short", locale: 'ru-RU'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Андрей Николаевич";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name medium", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Доктор",
            givenName: "Андрей",
            familyName: "Николаевич"
        });
        let fmt = new NameFmt({style: "medium", locale: 'ru-RU'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Андрей Николаевич";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name long", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Доктор",
            givenName: "Андрей",
            familyName: "Николаевич"
        });
        let fmt = new NameFmt({style: "long", locale: 'ru-RU'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Доктор Андрей Николаевич";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name full", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Доктор",
            givenName: "Андрей",
            familyName: "Николаевич"
        });
        let fmt = new NameFmt({style: "full", locale: 'ru-RU'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Доктор Андрей Николаевич";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name short", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "short", locale: 'ru-RU'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name medium", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "medium", locale: 'ru-RU'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name long", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "long", locale: 'ru-RU'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "小地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name full", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "full", locale: 'ru-RU'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "小地獸太太";

        expect(formatted).toBe(expected);
    });

});
