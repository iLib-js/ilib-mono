/*
 * Name_gu.test.js - test the name object in Gujurati
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

describe("Name_gu", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("gu-IN");
        }
    });

    test("should parse a simple Gujarati name", () => {
        expect.assertions(2);
        const parsed = new Name("જેઠાલાલ મોદી", {locale: 'gu-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "જેઠાલાલ",
            familyName: "મોદી"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Gujarati name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("જેઠાલાલ મોદી વરિષ્ઠ", {locale: 'gu-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            suffix: "વરિષ્ઠ",
            givenName: "જેઠાલાલ",
            familyName: "મોદી"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a full Gujarati name", () => {
        expect.assertions(2);
        const parsed = new Name("મિસ્ટર અને શ્રીમતી મોદી", {locale: 'gu-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "મિસ્ટર અને શ્રીમતી",
            familyName: "મોદી"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Gujarati name with a prefix", () => {
        expect.assertions(2);
        const parsed = new Name("મિસ્ટર જેઠાલાલ મોદી", {locale: 'gu-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "મિસ્ટર",
            givenName: "જેઠાલાલ",
            familyName: "મોદી"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Gujarati name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "જેઠાલાલ",
            familyName: "મોદી"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'gu-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "જેઠાલાલ મોદી";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Gujarati name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "જેઠાલાલ",

            familyName: "મોદી"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'gu-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "જેઠાલાલ મોદી";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Gujarati name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "જેઠાલાલ",

            familyName: "મોદી",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'gu-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "જેઠાલાલ મોદી";

        expect(formatted).toBe(expected);
    });

    test("should format a Gujarati surname", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "મિસ્ટર અને શ્રીમતી",

            familyName: "મોદી"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'gu-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "મિસ્ટર અને શ્રીમતી મોદી";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Gujarati name in full style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "ગુમાવે છે",
            givenName: "જેઠાલાલ",

            familyName: "મોદી",
            suffix: "વરિષ્ઠ"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'gu-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "ગુમાવે છે જેઠાલાલ મોદી વરિષ્ઠ";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Gujarati name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "ગુમાવે છે",
            givenName: "જેઠાલાલ",
            familyName: "મોદી"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'gu-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "જેઠાલાલ મોદી";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Gujarati name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "ગુમાવે છે",
            givenName: "જેઠાલાલ",
            familyName: "મોદી"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'gu-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "જેઠાલાલ મોદી";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Gujarati name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "ગુમાવે છે",
            givenName: "જેઠાલાલ",
            familyName: "મોદી"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'gu-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "ગુમાવે છે જેઠાલાલ મોદી";

        expect(formatted).toBe(expected);
    });

});
