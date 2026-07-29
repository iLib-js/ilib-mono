/*
 * testname_en.js - test the name object in Greek
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

describe("Name_el", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("el-GR");
        }
    });

    test("should parse a simple Greek name", () => {
        expect.assertions(2);
        const parsed = new Name("Νικόλαος Αλεξόπουλος", {locale: 'el-GR'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Νικόλαος",
            familyName: "Αλεξόπουλος"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a simple Greek name (duplicate)", () => {
        expect.assertions(2);
        const parsed = new Name("Νικόλαος Αλεξόπουλος", {locale: 'el-GR'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Νικόλαος",
            familyName: "Αλεξόπουλος"

        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a single Greek name with prefix and adjunct", () => {
        expect.assertions(2);
        const parsed = new Name("Νικόλαος Αλεξόπουλος κατώτερος", {locale: 'el-GR'});
        expect(parsed).toBeTruthy();

        const expected = {
             suffix : "κατώτερος",
            givenName: "Νικόλαος",
            familyName: "Αλεξόπουλος"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Greek title (variant)", () => {
        expect.assertions(2);
        const parsed = new Name("Ο κ. Νικόλαος Αλεξόπουλος", {locale: 'el-GR'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix : "Ο κ.",
            givenName: "Νικόλαος",
            familyName: "Αλεξόπουλος"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a second Greek title", () => {
        expect.assertions(2);
        const parsed = new Name("Κυρία. Νικόλαος Αλεξόπουλος", {locale: 'el-GR'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix : "Κυρία.",
            givenName: "Νικόλαος",
            familyName: "Αλεξόπουλος"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Greek title with family name and adjunct", () => {
        expect.assertions(2);

        let name = new Name({
            prefix: "Ο κ.",
            givenName: "Νικόλαος",
            familyName: "Αλεξόπουλος",
            suffix: "μουσκεύω"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'el-GR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Ο κ. Νικόλαος Αλεξόπουλος μουσκεύω";

        expect(formatted).toBe(expected);
    });

    test("should parse a Greek title with family name and adjunct (extra)", () => {
        expect.assertions(2);
        const parsed = new Name("αντιπρόεδρος Νικόλαος Αλεξόπουλος μουσκεύω", {locale: 'el-GR'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "αντιπρόεδρος",
            givenName: "Νικόλαος",
            familyName: "Αλεξόπουλος",
            suffix : "μουσκεύω"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Greek name with a compound honorific", () => {
        expect.assertions(2);
        const parsed = new Name("Ο κ. Αλεξόπουλος", {locale: 'el-GR'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Ο κ.",
            familyName: "Αλεξόπουλος"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Greek name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Νικόλαος",
            familyName: "Αλεξόπουλος"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'el-GR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Νικόλαος Αλεξόπουλος";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Greek name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Νικόλαος",
            familyName: "Αλεξόπουλος"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'el-GR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Νικόλαος Αλεξόπουλος";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Greek name in full style", () => {
        expect.assertions(2);
        let name = new Name({

            givenName: "Νικόλαος",
            familyName: "Αλεξόπουλος",
            suffix: "μουσκεύω"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'el-GR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Νικόλαος Αλεξόπουλος μουσκεύω";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Greek name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            suffix: "μουσκεύω",
            givenName: "Νικόλαος",
            familyName: "Αλεξόπουλος"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'el-GR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Νικόλαος Αλεξόπουλος";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in medium style with Greek formatter", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'el-GR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in long style with Greek formatter", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'el-GR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "小地獸太太";

        expect(formatted).toBe(expected);
    });

});
