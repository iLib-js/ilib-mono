/*
 * testname_ru.js - test the name object in Russian
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

let setUpPerformed = false;


export const testname_ru = {
    setUp: function(callback) {
        if (getPlatform() === "browser" && !setUpPerformed) {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            setUpPerformed = true;
            return LocaleData.ensureLocale("ru-RU").then(() => {
                callback();
            });
        } else {
            callback();
        }
    },

    testRUParseSimpleName: function(test) {
        test.expect(2);
        const parsed = new Name("Андрей Николаевич", {locale: 'ru-RU'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Андрей",
            middleName: "Николаевич"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testRUParseTripleName: function(test) {
        test.expect(2);
        const parsed = new Name("Андрей Микаэль Николаевич", {locale: 'ru-RU'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Микаэль",
            middleName: "Николаевич",
            familyName: "Андрей"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testRUParseQuadrupleName: function(test) {
        test.expect(2);
        const parsed = new Name("Андрей Микаэль Григорий Николаевич", {locale: 'ru-RU'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Микаэль Григорий",
            middleName: "Николаевич",
            familyName: "Андрей"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testRUParseTitle: function(test) {
        test.expect(2);
        const parsed = new Name("Доктор Андрей Николаевич", {locale: 'ru-RU'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Доктор",
            givenName: "Андрей",
            middleName: "Николаевич"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testRUParseHonorific: function(test) {
        test.expect(2);
        const parsed = new Name("Г-жа Татьяна Ивановна", {locale: 'ru-RU'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            prefix: "Г-жа",
            givenName: "Татьяна",
            middleName: "Ивановна"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testRUFamilyName1: function(test) {
        test.expect(2);
        const parsed = new Name("Pavel Яшкин", {locale: 'ru-RU'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Pavel",
            familyName: "Яшкин"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testRUFamilyName2: function(test) {
        test.expect(2);
        const parsed = new Name("Абакумов Pavel", {locale: 'ru-RU'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Pavel",
            familyName: "Абакумов"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testRUFamilyName3: function(test) {
        test.expect(2);
        const parsed = new Name("Pavel Андреевич", {locale: 'ru-RU'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Pavel",
            middleName: "Андреевич"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testRUName1: function(test) {
        test.expect(2);
        const parsed = new Name("Иван Иванович Иванов", {locale: 'ru-RU'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Иван",
            middleName: "Иванович",
            familyName: "Иванов"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testRUName2: function(test) {
        test.expect(2);
        const parsed = new Name("Иван Иванович", {locale: 'ru-RU'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Иван",
            middleName: "Иванович"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testRUName3: function(test) {
        test.expect(2);
        const parsed = new Name("Иван Иванов", {locale: 'ru-RU'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Иван",
            familyName: "Иванов"
        };

        test.contains(parsed, expected);
        test.done();
    },

    testRUName4: function(test) {
        test.expect(2);
        const parsed = new Name("Иванов Иван", {locale: 'ru-RU'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Иван",
            familyName: "Иванов"
        };
        test.contains(parsed, expected);
        test.done();
    },

    testRUName5: function(test) {
        test.expect(2);
        const parsed = new Name("Владимир Андреевич Филатов", {locale: 'ru-RU'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Владимир",
            middleName: "Андреевич",
            familyName: "Филатов"
        };
        test.contains(parsed, expected);
        test.done();
    },

    testRUName6: function(test) {
        test.expect(2);
        const parsed = new Name("Владимир Андреевич", {locale: 'ru-RU'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Владимир",
            middleName: "Андреевич"
         };
        test.contains(parsed, expected);
        test.done();
    },
    testRUName7: function(test) {
        test.expect(2);
        const parsed = new Name("Владимир Филатов", {locale: 'ru-RU'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Владимир",
            familyName: "Филатов"
        };
        test.contains(parsed, expected);
        test.done();
    },
    testRUName8: function(test) {
        test.expect(2);
        const parsed = new Name("Филатов Владимир", {locale: 'ru-RU'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Владимир",
            familyName: "Филатов"
        };
        test.contains(parsed, expected);
        test.done();
    },


    testRUName10: function(test) {
        test.expect(2);
        const parsed = new Name("Филатов Андреевич", {locale: 'ru-RU'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            middleName: "Андреевич",
            givenName: "Филатов"
        };
        test.contains(parsed, expected);
        test.done();
    },

    testRUName11: function(test) {
        test.expect(2);
        const parsed = new Name("Владимир Андреевич Филатовa", {locale: 'ru-RU'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Владимир",
            middleName: "Андреевич",
            familyName: "Филатовa"
        };
        test.contains(parsed, expected);
        test.done();
    },

    testRUName12: function(test) {
        test.expect(2);
        const parsed = new Name("Владимир Андреевич", {locale: 'ru-RU'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Владимир",
            middleName: "Андреевич"
        };
        test.contains(parsed, expected);
        test.done();
    },
    testRUName13: function(test) {
        test.expect(2);
        const parsed = new Name("Филатова Филатова", {locale: 'ru-RU'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Филатова",
            familyName: "Филатова"
        };
        test.contains(parsed, expected);
        test.done();
    },
    testRUName14: function(test) {
        test.expect(2);
        const parsed = new Name("Филатова Филатова", {locale: 'ru-RU'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Филатова",
            familyName: "Филатова"
        };
        test.contains(parsed, expected);
        test.done();
    },

    testRUName15: function(test) {
        test.expect(2);
        const parsed = new Name("Екатерина Таттар", {locale: 'ru-RU'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Екатерина",
            familyName: "Таттар"
        };
        test.contains(parsed, expected);
        test.done();
    },
    testRUName16: function(test) {
        test.expect(2);
        const parsed = new Name("Таттар Екатерина", {locale: 'ru-RU'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Екатерина",
            familyName: "Таттар"
        };
        test.contains(parsed, expected);
        test.done();
    },

    testRUName17: function(test) {
        test.expect(2);
        const parsed = new Name("Валерия Твардовскиая", {locale: 'ru-RU'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Валерия",
            familyName: "Твардовскиая"
        };
        test.contains(parsed, expected);
        test.done();
    },

    testRUName18: function(test) {
        test.expect(2);
        const parsed = new Name("Твардовскиая Валерия", {locale: 'ru-RU'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Валерия",
            familyName: "Твардовскиая"
        };
        test.contains(parsed, expected);
        test.done();
    },

    testRUName19: function(test) {
        test.expect(2);
        const parsed = new Name("Анатолы Полищук", {locale: 'ru-RU'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Анатолы",
            familyName: "Полищук"
        };
        test.contains(parsed, expected);
        test.done();
    },

    testRUName20: function(test) {
        test.expect(2);
        const parsed = new Name("Полищук Анатолы", {locale: 'ru-RU'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Анатолы",
            familyName: "Полищук"
        };
        test.contains(parsed, expected);
        test.done();
    },
    testRUParseEverything: function(test) {
        test.expect(2);
        const parsed = new Name("Pavel Андреевич", {locale: 'ru-RU'});
        test.ok(typeof(parsed) !== "undefined");

        const expected = {
            givenName: "Pavel",
            middleName: "Андреевич"
        };

        test.contains(parsed, expected);
        test.done();
    },

    /*
     * Format Tests
     */

    testRUFormatSimpleNameShort: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Андрей",
            familyName: "Николаевич"
        });
        let fmt = new NameFmt({style: "short", locale: 'ru-RU'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Андрей Николаевич";

        test.equal(formatted, expected);
        test.done();
    },

    testRUFormatSimpleNameMedium: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Андрей",
            familyName: "Николаевич"
        });
        let fmt = new NameFmt({style: "medium", locale: 'ru-RU'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Андрей Николаевич";

        test.equal(formatted, expected);
        test.done();
    },

    testRUFormatSimpleNameLong: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Андрей",
            familyName: "Николаевич"
        });
        let fmt = new NameFmt({style: "long", locale: 'ru-RU'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Андрей Николаевич";

        test.equal(formatted, expected);
        test.done();
    },

    testRUFormatSimpleNameFull: function(test) {
        test.expect(2);
        let name = new Name({
            givenName: "Андрей",
            //middleName: "Микаэль",
            familyName: "Николаевич"
        });
        let fmt = new NameFmt({style: "full", locale: 'ru-RU'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Андрей Николаевич";

        test.equal(formatted, expected);
        test.done();
    },

    testRUFormatComplexNameShort: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Доктор",
            givenName: "Андрей",
            familyName: "Николаевич",
        });
        let fmt = new NameFmt({style: "short", locale: 'ru-RU'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Андрей Николаевич";

        test.equal(formatted, expected);
        test.done();
    },

    testRUFormatComplexNameMedium: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Доктор",
            givenName: "Андрей",
            familyName: "Николаевич"
        });
        let fmt = new NameFmt({style: "medium", locale: 'ru-RU'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Андрей Николаевич";

        test.equal(formatted, expected);
        test.done();
    },

    testRUFormatComplexNameLong: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Доктор",
            givenName: "Андрей",
            familyName: "Николаевич"
        });
        let fmt = new NameFmt({style: "long", locale: 'ru-RU'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Доктор Андрей Николаевич";

        test.equal(formatted, expected);
        test.done();
    },

    testRUFormatComplexNameFull: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "Доктор",
            givenName: "Андрей",
            familyName: "Николаевич"
        });
        let fmt = new NameFmt({style: "full", locale: 'ru-RU'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "Доктор Андрей Николаевич";

        test.equal(formatted, expected);
        test.done();
    },

    testRUFormatAsianNameShort: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "short", locale: 'ru-RU'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "地獸";

        test.equal(formatted, expected);
        test.done();
    },

    testRUFormatAsianNameMedium: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "medium", locale: 'ru-RU'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "地獸";

        test.equal(formatted, expected);
        test.done();
    },

    testRUFormatAsianNameLong: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "long", locale: 'ru-RU'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "小地獸";

        test.equal(formatted, expected);
        test.done();
    },

    testRUFormatAsianNameFull: function(test) {
        test.expect(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "full", locale: 'ru-RU'});
        let formatted = fmt.format(name);
        test.ok(typeof(formatted) !== "undefined");

        const expected = "小地獸太太";

        test.equal(formatted, expected);
        test.done();
    }

};
