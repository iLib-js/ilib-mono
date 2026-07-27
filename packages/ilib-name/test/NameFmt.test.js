/*
 * NameFmt.test.js - test the name formatter object
 *
 * Copyright © 2013-2015,2017,2019,2026 JEDLSoft
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

describe("NameFmt", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            for (const locale of [
                "en-US",
                "ii-II",
                "hu-MG",
                "cs-CZ",
                "de-DE",
                "ko-KR",
                "nl-NL",
                "sk-SK",
                "zh-Hans-CN",
            ]) {
                await LocaleData.ensureLocale(locale);
            }
        }
    });

    test("should create a name formatter with an empty constructor", () => {
        expect.assertions(1);
        let fmt = new NameFmt();

        expect(typeof(fmt) !== "undefined").toBeTruthy();
    });

    test("should return the default locale", () => {
        expect.assertions(1);
        let fmt = new NameFmt();

        expect(fmt.getLocale().getSpec()).toBe("en-US");
    });

    test("should return the configured locale", () => {
        expect.assertions(1);
        let fmt = new NameFmt({
            locale: "nl-NL"
        });

        expect(fmt.getLocale().getSpec()).toBe("nl-NL");
    });

    test("should return a bogus locale as configured", () => {
        expect.assertions(1);
        let fmt = new NameFmt({
            locale: "ii-II"
        });

        expect(fmt.getLocale().getSpec()).toBe("ii-II");
    });

    test("should return the configured style", () => {
        expect.assertions(1);
        let fmt = new NameFmt({
            style: "medium"
        });

        expect(fmt.getStyle()).toBe("medium");
    });

    test("should return the default style", () => {
        expect.assertions(1);
        let fmt = new NameFmt();

        expect(fmt.getStyle()).toBe("short");
    });

    test("should fall back to short for a bogus style", () => {
        expect.assertions(1);
        let fmt = new NameFmt({
            style: "humungous"
        });

        expect(fmt.getStyle()).toBe("short");
    });

    test("should format an English name in short style", () => {
        expect.assertions(1);
        let name = new Name({
            prefix: "Mr.",
            givenName: "John",
            middleName: "Kevin",
            familyName: "Smith",
            suffix: "Phd."
        });
        let fmt = new NameFmt({
            style: "short"
        });

        expect(fmt.format(name)).toBe("John Smith");
    });

    test("should format an English name in medium style", () => {
        expect.assertions(1);
        let name = new Name({
            prefix: "Mr.",
            givenName: "John",
            middleName: "Kevin",
            familyName: "Smith",
            suffix: "Phd."
        });
        let fmt = new NameFmt({
            style: "medium"
        });

        expect(fmt.format(name)).toBe("John Kevin Smith");
    });

    test("should format an English name in long style", () => {
        expect.assertions(1);
        let name = new Name({
            prefix: "Mr.",
            givenName: "John",
            middleName: "Kevin",
            familyName: "Smith",
            suffix: "Phd."
        });
        let fmt = new NameFmt({
            style: "long"
        });

        expect(fmt.format(name)).toBe("Mr. John Kevin Smith");
    });

    test("should format an English name in full style", () => {
        expect.assertions(1);
        let name = new Name({
            prefix: "Mr.",
            givenName: "John",
            middleName: "Kevin",
            familyName: "Smith",
            suffix: "Phd."
        });
        let fmt = new NameFmt({
            style: "full"
        });

        expect(fmt.format(name)).toBe("Mr. John Kevin Smith Phd.");
    });

    test("should format an English name in familiar style", () => {
        expect.assertions(1);
        let name = new Name({
            prefix: "Mr.",
            givenName: "John",
            middleName: "Kevin",
            familyName: "Smith",
            suffix: "Phd."
        });
        let fmt = new NameFmt({
            style: "familiar"
        });

        expect(fmt.format(name)).toBe("John");
    });

    test("should format an English name with a comma in the suffix", () => {
        expect.assertions(1);
        let name = new Name({
            prefix: "Mr.",
            givenName: "John",
            middleName: "Kevin",
            familyName: "Smith",
            suffix: ", Phd."
        });
        let fmt = new NameFmt({
            style: "full"
        });

        expect(fmt.format(name)).toBe("Mr. John Kevin Smith, Phd.");
    });

    test("should format an English name with only the prefix component", () => {
        expect.assertions(1);
        let name = new Name({
            prefix: "Mr.",
            givenName: "John",
            middleName: "Kevin",
            familyName: "Smith",
            suffix: "Phd."
        });
        let fmt = new NameFmt({
            components: "p"
        });

        expect(fmt.format(name)).toBe("Mr.");
    });

    test("should format an English name with prefix and given name components", () => {
        expect.assertions(1);
        let name = new Name({
            prefix: "Mr.",
            givenName: "John",
            middleName: "Kevin",
            familyName: "Smith",
            suffix: "Phd."
        });
        let fmt = new NameFmt({
            components: "pg"
        });

        expect(fmt.format(name)).toBe("Mr. John");
    });

    test("should format an English name with prefix and family name components", () => {
        expect.assertions(1);
        let name = new Name({
            prefix: "Mr.",
            givenName: "John",
            middleName: "Kevin",
            familyName: "Smith",
            suffix: "Phd."
        });
        let fmt = new NameFmt({
            components: "pf"
        });

        expect(fmt.format(name)).toBe("Mr. Smith");
    });

    test("should format an English name with prefix, given, and family name components", () => {
        expect.assertions(1);
        let name = new Name({
            prefix: "Mr.",
            givenName: "John",
            middleName: "Kevin",
            familyName: "Smith",
            suffix: "Phd."
        });
        let fmt = new NameFmt({
            components: "pgf"
        });

        expect(fmt.format(name)).toBe("Mr. John Smith");
    });

    test("should format an English name with prefix, family, and suffix components", () => {
        expect.assertions(1);
        let name = new Name({
            prefix: "Mr.",
            givenName: "John",
            middleName: "Kevin",
            familyName: "Smith",
            suffix: "Phd."
        });
        let fmt = new NameFmt({
            components: "pfs"
        });

        expect(fmt.format(name)).toBe("Mr. Smith Phd.");
    });

    test("should format an English name with scrambled component order", () => {
        expect.assertions(1);
        let name = new Name({
            prefix: "Mr.",
            givenName: "John",
            middleName: "Kevin",
            familyName: "Smith",
            suffix: "Phd."
        });
        let fmt = new NameFmt({
            components: "gfp"
        });

        expect(fmt.format(name)).toBe("Mr. John Smith");
    });

    test("should format an English name with components overriding the style", () => {
        expect.assertions(1);
        let name = new Name({
            prefix: "Mr.",
            givenName: "John",
            middleName: "Kevin",
            familyName: "Smith",
            suffix: "Phd."
        });
        let fmt = new NameFmt({
            style: "full",
            components: "gfp"
        });

        expect(fmt.format(name)).toBe("Mr. John Smith");
    });

    test("should format a German name in short style", () => {
        expect.assertions(1);
        let name = new Name({
            prefix: "Hr.",
            givenName: "Andreas",
            middleName: "Helmut",
            familyName: "Schmidt",
            suffix: "MdB"
        }, {
            locale: "de-DE"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: "de-DE"
        });

        expect(fmt.format(name)).toBe("Andreas Schmidt");
    });

    test("should format a German name in medium style", () => {
        expect.assertions(1);
        let name = new Name({
            prefix: "Hr.",
            givenName: "Andreas",
            middleName: "Helmut",
            familyName: "Schmidt",
            suffix: "MdB"
        }, {
            locale: "de-DE"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: "de-DE"
        });

        expect(fmt.format(name)).toBe("Andreas Helmut Schmidt");
    });

    test("should format a German name in long style", () => {
        expect.assertions(1);
        let name = new Name({
            prefix: "Hr.",
            givenName: "Andreas",
            middleName: "Helmut",
            familyName: "Schmidt",
            suffix: "MdB"
        }, {
            locale: "de-DE"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: "de-DE"
        });

        expect(fmt.format(name)).toBe("Hr. Andreas Helmut Schmidt");
    });

    test("should format a German name in full style", () => {
        expect.assertions(1);
        let name = new Name({
            prefix: "Hr.",
            givenName: "Andreas",
            middleName: "Helmut",
            familyName: "Schmidt",
            suffix: "MdB"
        }, {
            locale: "de-DE"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: "de-DE"
        });

        expect(fmt.format(name)).toBe("Hr. Andreas Helmut Schmidt MdB");
    });

    test("should format a German name in familiar style", () => {
        expect.assertions(1);
        let name = new Name({
            prefix: "Hr.",
            givenName: "Andreas",
            middleName: "Helmut",
            familyName: "Schmidt",
            suffix: "MdB"
        }, {
            locale: "de-DE"
        });
        let fmt = new NameFmt({
            style: "familiar",
            locale: "de-DE"
        });

        expect(fmt.format(name)).toBe("Hr. Schmidt");
    });

    test("should format a German name with a comma in the suffix", () => {
        expect.assertions(1);
        let name = new Name({
            prefix: "Hr.",
            givenName: "Andreas",
            middleName: "Helmut",
            familyName: "Schmidt",
            suffix: ", MdB"
        }, {
            locale: "de-DE"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: "de-DE"
        });

        expect(fmt.format(name)).toBe("Hr. Andreas Helmut Schmidt, MdB");
    });

    test("should format a German name with only the prefix component", () => {
        expect.assertions(1);
        let name = new Name({
            prefix: "Hr.",
            givenName: "Andreas",
            middleName: "Helmut",
            familyName: "Schmidt",
            suffix: "MdB"
        }, {
            locale: "de-DE"
        });
        let fmt = new NameFmt({
            components: "p",
            locale: "de-DE"
        });

        expect(fmt.format(name)).toBe("Hr.");
    });

    test("should format a German name with prefix and given name components", () => {
        expect.assertions(1);
        let name = new Name({
            prefix: "Hr.",
            givenName: "Andreas",
            middleName: "Helmut",
            familyName: "Schmidt",
            suffix: "MdB"
        }, {
            locale: "de-DE"
        });
        let fmt = new NameFmt({
            components: "pg",
            locale: "de-DE"
        });

        expect(fmt.format(name)).toBe("Hr. Andreas");
    });

    test("should format a German name with prefix and family name components", () => {
        expect.assertions(1);
        let name = new Name({
            prefix: "Hr.",
            givenName: "Andreas",
            middleName: "Helmut",
            familyName: "Schmidt",
            suffix: "MdB"
        }, {
            locale: "de-DE"
        });
        let fmt = new NameFmt({
            components: "pf",
            locale: "de-DE"
        });

        expect(fmt.format(name)).toBe("Hr. Schmidt");
    });

    test("should format a German name with prefix, given, and family name components", () => {
        expect.assertions(1);
        let name = new Name({
            prefix: "Hr.",
            givenName: "Andreas",
            middleName: "Helmut",
            familyName: "Schmidt",
            suffix: "MdB"
        }, {
            locale: "de-DE"
        });
        let fmt = new NameFmt({
            components: "pgf",
            locale: "de-DE"
        });

        expect(fmt.format(name)).toBe("Hr. Andreas Schmidt");
    });

    test("should format a German name with prefix, family, and suffix components", () => {
        expect.assertions(1);
        let name = new Name({
            prefix: "Hr.",
            givenName: "Andreas",
            middleName: "Helmut",
            familyName: "Schmidt",
            suffix: "MdB"
        }, {
            locale: "de-DE"
        });
        let fmt = new NameFmt({
            components: "pfs",
            locale: "de-DE"
        });

        expect(fmt.format(name)).toBe("Hr. Schmidt MdB");
    });

    test("should format a German name with scrambled component order", () => {
        expect.assertions(1);
        let name = new Name({
            prefix: "Hr.",
            givenName: "Andreas",
            middleName: "Helmut",
            familyName: "Schmidt",
            suffix: "MdB"
        }, {
            locale: "de-DE"
        });
        let fmt = new NameFmt({
            components: "gfp",
            locale: "de-DE"
        });

        expect(fmt.format(name)).toBe("Hr. Andreas Schmidt");
    });

    test("should format a German name with components overriding the style", () => {
        expect.assertions(1);
        let name = new Name({
            prefix: "Hr.",
            givenName: "Andreas",
            middleName: "Helmut",
            familyName: "Schmidt",
            suffix: "MdB"
        }, {
            locale: "de-DE"
        });
        let fmt = new NameFmt({
            style: "full",
            components: "pgf",
            locale: "de-DE"
        });

        expect(fmt.format(name)).toBe("Hr. Andreas Schmidt");
    });

    test("should format an English name with an honorific", () => {
        expect.assertions(1);
        let name = new Name({
            honorific: "Dr.",
            givenName: "Andreas",
            middleName: "Helmut",
            familyName: "Schmidt"
        }, {
            locale: "en-US"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: "en-US"
        });

        expect(fmt.format(name)).toBe("Dr. Andreas Helmut Schmidt");
    });

    test("should format a Chinese name with an honorific", () => {
        expect.assertions(1);
        let name = new Name({
            honorific: "医生",
            givenName: "芳",
            familyName: "李"
        }, {
            locale: "zh-Hans-CN"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: "zh-Hans-CN"
        });

        expect(fmt.format(name)).toBe("李芳医生");
    });

    test("should format an English name in formal short style", () => {
        expect.assertions(1);
        let name = new Name({
            honorific: "Dr.",
            givenName: "Andreas",
            middleName: "Helmut",
            familyName: "Schmidt"
        }, {
            locale: "en-US"
        });
        let fmt = new NameFmt({
            style: "formal_short",
            locale: "en-US"
        });

        expect(fmt.format(name)).toBe("Dr. Schmidt");
    });

    test("should format an English name in formal long style", () => {
        expect.assertions(1);
        let name = new Name({
            honorific: "Dr.",
            givenName: "Andreas",
            middleName: "Helmut",
            familyName: "Schmidt"
        }, {
            locale: "en-US"
        });
        let fmt = new NameFmt({
            style: "formal_long",
            locale: "en-US"
        });

        expect(fmt.format(name)).toBe("Dr. Andreas Schmidt");
    });

    test("should format a Chinese name in formal short style", () => {
        expect.assertions(1);
        let name = new Name({
            honorific: "医生",
            givenName: "芳",
            familyName: "李"
        }, {
            locale: "zh-Hans-CN"
        });
        let fmt = new NameFmt({
            style: "formal_short",
            locale: "zh-Hans-CN"
        });

        expect(fmt.format(name)).toBe("李医生");
    });

    test("should format a Chinese name in formal long style", () => {
        expect.assertions(1);
        let name = new Name({
            honorific: "医生",
            givenName: "芳",
            familyName: "李"
        }, {
            locale: "zh-Hans-CN"
        });
        let fmt = new NameFmt({
            style: "formal_long",
            locale: "zh-Hans-CN"
        });

        expect(fmt.format(name)).toBe("李芳医生");
    });

    test("should format a Korean name in formal short style", () => {
        expect.assertions(1);
        let name = new Name({
            honorific: "닥터",
            givenName: "은성",
            familyName: "박"
        }, {
            locale: "ko-KR"
        });
        let fmt = new NameFmt({
            style: "formal_short",
            locale: "ko-KR"
        });

        // use the full name, even in formal_short
        // honorifics are prefixes in Korean
        expect(fmt.format(name)).toBe("박은성");
    });

    test("should format a Korean name in formal short style with a suffix", () => {
        expect.assertions(1);
        let name = new Name({
            honorific: "닥터",
            givenName: "은성",
            familyName: "박",
            suffix: "님"
        }, {
            locale: "ko-KR"
        });
        let fmt = new NameFmt({
            style: "formal_short",
            locale: "ko-KR"
        });

        // use the full name, even in formal_short
        // honorifics are prefixes in Korean
        expect(fmt.format(name)).toBe("박은성 님");
    });

    test("should format a Korean name in short style", () => {
        expect.assertions(1);
        let name = new Name({
            honorific: "닥터",
            givenName: "은성",
            familyName: "박",
            suffix: "님"
        }, {
            locale: "ko-KR"
        });
        let fmt = new NameFmt({
            locale: "ko-KR",
            style: "short"
        });
        expect(fmt.format(name)).toBe("박은성");
    });

    test("should format a Korean name in medium style", () => {
        expect.assertions(1);
        let name = new Name({
            honorific: "닥터",
            givenName: "은성",
            familyName: "박",
            suffix: "님"
        }, {
            locale: "ko-KR"
        });
        let fmt = new NameFmt({
            locale: "ko-KR",
            style: "medium"
        });

        expect(fmt.format(name)).toBe("박은성");
    });

    test("should format a Korean name in long style", () => {
        expect.assertions(1);
        let name = new Name({
            honorific: "닥터",
            givenName: "은성",
            familyName: "박",
            suffix: "님"
        }, {
            locale: "ko-KR"
        });
        let fmt = new NameFmt({
            locale: "ko-KR",
            style: "long"
        });

        expect(fmt.format(name)).toBe("박은성 님");
    });

    test("should format a Korean name in full style", () => {
        expect.assertions(1);
        let name = new Name({
            honorific: "닥터",
            givenName: "은성",
            familyName: "박",
            suffix: "님"
        }, {
            locale: "ko-KR"
        });
        let fmt = new NameFmt({
            locale: "ko-KR",
            style: "full"
        });

        expect(fmt.format(name)).toBe("닥터 박은성 님");
    });

    test("should format a Korean name in formal long style", () => {
        expect.assertions(1);
        let name = new Name({
            honorific: "닥터",
            givenName: "은성",
            familyName: "박"
        }, {
            locale: "ko-KR"
        });
        let fmt = new NameFmt({
            style: "formal_long",
            locale: "ko-KR"
        });

        expect(fmt.format(name)).toBe("닥터 박은성");
    });

    test("should format a Korean name in formal long style with a suffix", () => {
        expect.assertions(1);
        let name = new Name({
            honorific: "닥터",
            givenName: "은성",
            familyName: "박",
            suffix: "님"
        }, {
            locale: "ko-KR"
        });
        let fmt = new NameFmt({
            style: "formal_long",
            locale: "ko-KR"
        });

        expect(fmt.format(name)).toBe("닥터 박은성 님");
    });

    test("should format a Korean name in familiar style", () => {
        expect.assertions(1);
        let name = new Name({
            honorific: "닥터",
            givenName: "은성",
            familyName: "박",
            suffix: "님"
        }, {
            locale: "ko-KR"
        });
        let fmt = new NameFmt({
            style: "familiar",
            locale: "ko-KR"
        });

        expect(fmt.format(name)).toBe("박은성 님");
    });

    test("should format a Czech name in familiar style", () => {
        expect.assertions(1);
        let name = new Name({
            honorific: "Pan",
            givenName: "Jan",
            familyName: "Novák"
        }, {
            locale: "cs-CZ"
        });
        let fmt = new NameFmt({
            style: "familiar",
            locale: "cs-CZ"
        });

        expect(fmt.format(name)).toBe("Pan Novák");
    });

    test("should format a Slovak name in familiar style", () => {
        expect.assertions(1);
        let name = new Name({
            honorific: "Pani",
            givenName: "Mária",
            familyName: "Obecny"
        }, {
            locale: "sk-SK"
        });
        let fmt = new NameFmt({
            style: "familiar",
            locale: "sk-SK"
        });

        expect(fmt.format(name)).toBe("Pani Obecny");
    });

    test("should format an English name with implicit conversion of the argument to Name", () => {
        expect.assertions(1);
        let fmt = new NameFmt({
            style: "full",
            locale: "en-US"
        });

        expect(fmt.format({
            honorific: "Dr.",
            givenName: "Andreas",
            middleName: "Helmut",
            familyName: "Schmidt"
        })).toBe("Dr. Andreas Helmut Schmidt");
    });

    test("should take on the locale of the formatter for implicit conversion", () => {
        expect.assertions(1);
        let fmt = new NameFmt({
            style: "full",
            locale: "hu-MG"
        });

        expect(fmt.format({
            honorific: "Dr.",
            givenName: "Andreas",
            middleName: "Helmut",
            familyName: "Schmidt"
        })).toBe("Dr. Schmidt Andreas Helmut");
    });
});
