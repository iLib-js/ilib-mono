/*
 * testname_ta_IN.js - test the name object in Tamil
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

describe("Name_ta", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            await LocaleData.ensureLocale("ta-IN");
        }
    });

    test("should parse a simple Tamil name", () => {
        expect.assertions(2);
        const parsed = new Name("மஹிலா ஜெயவர்த்தனே", {locale: 'ta-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "மஹிலா",
            familyName: "ஜெயவர்த்தனே"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Tamil name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("மஹிலா ஜெயவர்த்தனே மூத்த", {locale: 'ta-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            suffix: "மூத்த",
            givenName: "மஹிலா",
            familyName: "ஜெயவர்த்தனே"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Tamil title with family name only", () => {
        expect.assertions(2);
        const parsed = new Name("திரு ஜெயவர்த்தனே", {locale: 'ta-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "திரு",
            familyName: "ஜெயவர்த்தனே"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a complete Tamil name", () => {
        expect.assertions(2);
        const parsed = new Name("திரு மற்றும் திருமதி ஜெயவர்த்தனே", {locale: 'ta-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "திரு மற்றும் திருமதி",
            familyName: "ஜெயவர்த்தனே"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Tamil name with a prefix", () => {
        expect.assertions(2);
        const parsed = new Name("திரு மஹிலா ஜெயவர்த்தனே", {locale: 'ta-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "திரு",
            givenName: "மஹிலா",
            familyName: "ஜெயவர்த்தனே"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Tamil name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "மஹிலா",
            familyName: "ஜெயவர்த்தனே"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'ta-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "மஹிலா ஜெயவர்த்தனே";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Tamil name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "மஹிலா",
            familyName: "ஜெயவர்த்தனே"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'ta-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "மஹிலா ஜெயவர்த்தனே";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Tamil name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "மஹிலா",
            familyName: "ஜெயவர்த்தனே"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'ta-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "மஹிலா ஜெயவர்த்தனே";

        expect(formatted).toBe(expected);
    });

    test("should format a Tamil surname", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "திரு மற்றும் திருமதி",
            familyName: "ஜெயவர்த்தனே"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'ta-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "திரு மற்றும் திருமதி ஜெயவர்த்தனே";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Tamil name in full style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "வைத்தியர்",
            givenName: "மஹிலா",
            familyName: "ஜெயவர்த்தனே",
            suffix: "மிஸ்"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'ta-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "வைத்தியர் மஹிலா ஜெயவர்த்தனே மிஸ்";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Tamil name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "வைத்தியர்",
            givenName: "மஹிலா",
            familyName: "ஜெயவர்த்தனே"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'ta-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "மஹிலா ஜெயவர்த்தனே";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Tamil name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "வைத்தியர்",
            givenName: "மஹிலா",
            familyName: "ஜெயவர்த்தனே"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'ta-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "மஹிலா ஜெயவர்த்தனே";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Tamil name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "வைத்தியர்",
            givenName: "மஹிலா",
            familyName: "ஜெயவர்த்தனே"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'ta-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "வைத்தியர் மஹிலா ஜெயவர்த்தனே";

        expect(formatted).toBe(expected);
    });
});
