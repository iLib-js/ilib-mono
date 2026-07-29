/*
 * Name_fr.test.js - test the name object in French
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

describe("Name_fr", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("fr-FR");
        }
    });

    test("should parse a simple French name", () => {
        expect.assertions(2);
        const parsed = new Name("Isabelle Antena", {locale: 'fr-FR'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Isabelle",
            familyName: "Antena"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a French name with given, middle, and family parts", () => {
        expect.assertions(2);
        const parsed = new Name("Jean-Louis Aubert", {locale: 'fr-FR'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Jean-Louis",
            familyName: "Aubert"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a French name with an adjunct", () => {
        expect.assertions(2);
        const parsed = new Name("Jean-Marie Le Pen", {locale: 'fr-FR'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Jean-Marie",
            familyName: "Le Pen"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a single French name", () => {
        expect.assertions(4);
        expect.assertions(2);
        const parsed = new Name("Jean-Louis", {locale: 'fr-FR'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Jean-Louis",
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a single French name with prefix and adjunct", () => {
        expect.assertions(2);
        const parsed = new Name("Monsieur de la Fontaine", {locale: 'fr-FR'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Monsieur",
            familyName: "de la Fontaine"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a French name with multiple adjuncts", () => {
        expect.assertions(2);
        const parsed = new Name("Pierre de la Fontaine", {locale: 'fr-FR'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Pierre",
            familyName: "de la Fontaine"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a hyphenated French name", () => {
        expect.assertions(2);
        const parsed = new Name("Jean-Marie Le Pen", {locale: 'fr-FR'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Jean-Marie",
            familyName: "Le Pen"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a French name with four parts", () => {
        expect.assertions(2);
        const parsed = new Name("Emile Michel David Vallefois", {locale: 'fr-FR'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Emile",
            middleName: "Michel David",
            familyName: "Vallefois"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a French name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("Monsieur Dr. Jean-Louis Aubert", {locale: 'fr-FR'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Monsieur Dr.",
            givenName: "Jean-Louis",
            familyName: "Aubert"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a French title with family name only", () => {
        expect.assertions(2);
        const parsed = new Name("Monsieur Jean-Louis", {locale: 'fr-FR'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Monsieur",
            familyName: "Jean-Louis"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a French title with family name and adjunct", () => {
        expect.assertions(2);
        const parsed = new Name("Monsieur Aubert", {locale: 'fr-FR'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Monsieur",
            familyName: "Aubert"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a French name with an honorific", () => {
        expect.assertions(2);
        const parsed = new Name("Madame Isabelle Antena", {locale: 'fr-FR'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Madame",
            givenName: "Isabelle",
            familyName: "Antena"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a complete French name", () => {
        expect.assertions(2);
        const parsed = new Name("Monsieur Président Jean-Louis Aubert", {locale: 'fr-FR'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Monsieur Président",
            givenName: "Jean-Louis",
            familyName: "Aubert",
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a French family name with auxiliary", () => {
        expect.assertions(2);
        const parsed = new Name("Georges Le Pen", {locale: 'fr-FR'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Georges",
            familyName: "Le Pen"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a French name with a compound honorific", () => {
        expect.assertions(2);
        const parsed = new Name("Monsieur et Madame Dupont", {locale: 'fr-FR'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Monsieur et Madame",
            familyName: "Dupont"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple French name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Emile",
            familyName: "Aubert"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'fr-FR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Emile Aubert";

        expect(formatted).toBe(expected);
    });

    test("should format a simple French name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Emile",
            middleName: "Michel",
            familyName: "Aubert"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'fr-FR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Emile Michel Aubert";

        expect(formatted).toBe(expected);
    });

    test("should format a simple French name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Emile",
            middleName: "Michel",
            familyName: "Aubert",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'fr-FR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Emile Michel Aubert";

        expect(formatted).toBe(expected);
    });

    test("should format a simple French name in full style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Monsieur Docteur",
            givenName: "Emile",
            middleName: "Michel",
            familyName: "Aubert",
            suffix: " dem"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'fr-FR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Monsieur Docteur Emile Michel Aubert dem";

        expect(formatted).toBe(expected);
    });

    test("should format a complex French name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Monsieur Docteur",
            givenName: "Emile",
            middleName: "Michel Francois",
            familyName: "de Montfort",
            suffix: "III"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'fr-FR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Emile de Montfort";

        expect(formatted).toBe(expected);
    });

    test("should format a complex French name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Monsieur Docteur",
            givenName: "Emile",
            middleName: "Michel Francois",
            familyName: "de Montfort",
            suffix: "III"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'fr-FR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Emile Michel Francois de Montfort";

        expect(formatted).toBe(expected);
    });

    test("should format a complex French name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Monsieur Docteur",
            givenName: "Emile",
            middleName: "Michel Francois",
            familyName: "de Montfort",
            suffix: "III"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'fr-FR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Monsieur Docteur Emile Michel Francois de Montfort III";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in short style with French formatter", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'fr-FR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in medium style with French formatter", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'fr-FR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in long style with French formatter", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'fr-FR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "小地獸太太";

        expect(formatted).toBe(expected);
    });

});
