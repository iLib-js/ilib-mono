/*
 * Name_hi.test.js - test the name object in Hindi
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

describe("Name_hi", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("hi-IN");
        }
    });

    test("should parse a simple Hindi name", () => {
        expect.assertions(2);
        const parsed = new Name("आदित्य मित्तल", {locale: 'hi-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "आदित्य",
            familyName: "मित्तल"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Hindi name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("आदित्य मित्तल जूनियर", {locale: 'hi-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            suffix: "जूनियर",
            givenName: "आदित्य",
            familyName: "मित्तल"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Hindi title with family name only", () => {
        expect.assertions(2);
        const parsed = new Name("राज्यपाल मित्तल", {locale: 'hi-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "राज्यपाल",
            familyName: "मित्तल"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a full Hindi name", () => {
        expect.assertions(2);
        const parsed = new Name("श्री और श्रीमती मित्तल", {locale: 'hi-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "श्री और श्रीमती",
            familyName: "मित्तल"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Hindi name with a prefix", () => {
        expect.assertions(2);
        const parsed = new Name("श्री आदित्य मित्तल", {locale: 'hi-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "श्री",
            givenName: "आदित्य",
            familyName: "मित्तल"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Hindi name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "आदित्य",
            familyName: "मित्तल"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'hi-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "आदित्य मित्तल";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Hindi name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "आदित्य",

            familyName: "मित्तल"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'hi-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "आदित्य मित्तल";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Hindi name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "आदित्य",

            familyName: "मित्तल",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'hi-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "आदित्य मित्तल";

        expect(formatted).toBe(expected);
    });

    test("should format a Hindi surname", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "श्री और श्रीमती",

            familyName: "मित्तल"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'hi-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "श्री और श्रीमती मित्तल";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Hindi name in full style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "प्रोफेसर",
            givenName: "आदित्य",

            familyName: "मित्तल",
            suffix: " वरिष्ठ"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'hi-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "प्रोफेसर आदित्य मित्तल वरिष्ठ";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Hindi name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "प्रोफेसर",
            givenName: "आदित्य",
            familyName: "मित्तल"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'hi-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "आदित्य मित्तल";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Hindi name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "प्रोफेसर",
            givenName: "आदित्य",
            familyName: "मित्तल"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'hi-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "आदित्य मित्तल";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Hindi name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "प्रोफेसर",
            givenName: "आदित्य",
            familyName: "मित्तल"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'hi-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "प्रोफेसर आदित्य मित्तल";

        expect(formatted).toBe(expected);
    });

});
