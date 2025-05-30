/*
 * ILibPluralString.test.js - test the ilib plural string conversion functions
 *
 * Copyright © 2025 JEDLSoft
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
import { ResourceString, ResourcePlural } from 'ilib-tools-common';

import {
    isPluralString,
    isValidPluralString,
    convertPluralStringToObject,
    convertObjectToPluralString,
    convertPluralToString,
    convertStringToPlural
} from '../src/ILibPluralString.js';

describe("test ilib plural string conversion functions", () => {
    test("isPluralString works properly with an actual plural string", () => {
        expect.assertions(1);

        expect(isPluralString("one#1|two#2|other#3")).toBeTruthy();
    });

    test("isPluralString works properly with a non-plural string", () => {
        expect.assertions(1);
        expect(isPluralString("This is not a plural string")).toBeFalsy();
    });

    test("isPluralString works properly with an empty string", () => {
        expect.assertions(1);
        expect(isPluralString("")).toBeFalsy();
    });

    test("isPluralString works properly with a string with no #", () => {
        expect.assertions(1);
        expect(isPluralString("This is not|a plural string")).toBeFalsy();
    });

    test("isPluralString works properly with a string with no |", () => {
        expect.assertions(1);
        expect(isPluralString("other#3")).toBeTruthy();
    });

    test("isPluralString works properly when the number of | is more than #", () => {
        expect.assertions(1);
        expect(isPluralString("|one#1|two#2|three#3|")).toBeFalsy();
    });

    test("isPluralString works properly there are an equal number of # and |", () => {
        expect.assertions(1);
        expect(isPluralString("one#1|two#2||three#3")).toBeFalsy();
    });

    test("isValidPluralString works properly with a valid plural string", () => {
        expect.assertions(1);
        expect(isValidPluralString("one#1|two#2|other#3")).toBeTruthy();
    });

    test("isValidPluralString works properly with a non-plural string", () => {
        expect.assertions(1);
        expect(isValidPluralString("This is not a plural string")).toBeFalsy();
    });

    test("isValidPluralString works properly with an empty string", () => {
        expect.assertions(1);
        expect(isValidPluralString("")).toBeFalsy();
    });

    test("isValidPluralString works properly with a string with no #", () => {
        expect.assertions(1);
        expect(isValidPluralString("This is not|a plural string")).toBeFalsy();
    });

    test("isValidPluralString works properly with a string with no |", () => {
        expect.assertions(1);
        expect(isValidPluralString("other#3")).toBeTruthy();
    });

    test("isValidPluralString works properly when the number of | is more than #", () => {
        expect.assertions(1);
        expect(isValidPluralString("|one#1|two#2|three#3|")).toBeFalsy();
    });

    test("isValidPluralString works properly there are an equal number of # and |", () => {
        expect.assertions(1);
        expect(isValidPluralString("one#1|two#2||three#3")).toBeFalsy();
    });

    test("convertPluralStringToObject works properly with a valid plural string", () => {
        expect.assertions(1);
        const result = convertPluralStringToObject("one#1|two#2|other#3");
        expect(result).toEqual({
            one: "1",
            two: "2",
            other: "3"
        });
    });

    test("convertPluralStringToObject throws an error for a non-plural string", () => {
        expect.assertions(1);
        expect(() => convertPluralStringToObject("This is not a plural string")).toThrow("Invalid plural string format");
    });

    test("convertPluralStringToObject throws an error for an empty string", () => {
        expect.assertions(1);
        expect(() => convertPluralStringToObject("")).toThrow("Invalid plural string format");
    });

    test("convertPluralStringToObject throws an error for a string with no #", () => {
        expect.assertions(1);
        expect(() => convertPluralStringToObject("This is not|a plural string")).toThrow("Invalid plural string format");
    });

    test("convertPluralStringToObject throws an error for a string with no |", () => {
        expect.assertions(1);
        const result = convertPluralStringToObject("other#3");
        expect(result).toEqual({ other: "3" });
    });

    test("convertPluralStringToObject throws an error when the number of | is more than #", () => {
        expect.assertions(1);
        expect(() => convertPluralStringToObject("|one#1|two#2|three#3|")).toThrow("Invalid plural string format");
    });

    test("convertPluralStringToObject throws an error when there are an equal number of # and |", () => {
        expect.assertions(1);
        expect(() => convertPluralStringToObject("one#1|two#2||three#3")).toThrow("Invalid plural string format");
    });

    test("convertObjectToPluralString works properly with a valid object", () => {
        expect.assertions(1);
        const result = convertObjectToPluralString({
            one: "1",
            two: "2",
            other: "3"
        });
        expect(result).toBe("one#1|two#2|other#3");
    });

    test("convertObjectToPluralString throws an error for a non-object input", () => {
        expect.assertions(1);
        expect(() => convertObjectToPluralString("This is not an object")).toThrow("Invalid object format");
    });

    test("convertObjectToPluralString throws an error for a null input", () => {
        expect.assertions(1);
        expect(() => convertObjectToPluralString(null)).toThrow("Invalid object format");
    });

    test("convertStringToPlural works properly with a valid plural string", () => {
        expect.assertions(3);
        const stringRes = new ResourceString({
            key: "testPlural",
            context: "test",
            pathName: "test.json",
            sourceLocale: "en-US",
            source: "one#1|two#2|other#3",
            targetLocale: "de-DE",
            target: "one#eins|two#zwei|other#drei"
        });
        const pluralRes = convertStringToPlural(stringRes);
        expect(pluralRes).toBeInstanceOf(ResourcePlural);
        expect(pluralRes.getSource()).toStrictEqual({
            one: "1",
            two: "2",
            other: "3"
        });
        expect(pluralRes.getTarget()).toStrictEqual({
            one: "eins",
            two: "zwei",
            other: "drei"
        });
    });

    test("convertStringToPlural carries over all of the other properties of string", () => {
        expect.assertions(4);
        const stringRes = new ResourceString({
            key: "testPlural",
            context: "test",
            pathName: "test.json",
            sourceLocale: "en-US",
            source: "one#1|two#2|other#3",
            targetLocale: "de-DE",
            target: "one#eins|two#zwei|other#drei"
        });
        const pluralRes = convertStringToPlural(stringRes);
        expect(pluralRes).toBeInstanceOf(ResourcePlural);
        expect(pluralRes.getKey()).toBe("testPlural");
        expect(pluralRes.getContext()).toBe("test");
        expect(pluralRes.getPath()).toBe("test.json");
    });

    test("convertStringToPlural returns undefined for a non-plural string", () => {
        expect.assertions(1);
        const stringRes = new ResourceString({
            key: "testNonPlural",
            context: "test",
            pathName: "test.json",
            sourceLocale: "en-US",
            source: "This is not a plural string",
            targetLocale: "de-DE",
            target: "Dies ist kein Pluralstring"
        });
        const pluralRes = convertStringToPlural(stringRes);
        expect(pluralRes).toBeUndefined();
    });

    test("convertStringToPlural converts a minimal string properly", () => {
        expect.assertions(3);
        const stringRes = new ResourceString({
            key: "testMinimalPlural",
            context: "test",
            pathName: "test.json",
            sourceLocale: "en-US",
            source: "other#3",
            targetLocale: "de-DE",
            target: "other#drei"
        });
        const pluralRes = convertStringToPlural(stringRes);
        expect(pluralRes).toBeInstanceOf(ResourcePlural);
        expect(pluralRes.getSource()).toStrictEqual({ other: "3" });
        expect(pluralRes.getTarget()).toStrictEqual({ other: "drei" });
    });

    test("convertStringToPlural returns undefined for a non-ResourceString", () => {
        expect.assertions(1);
        const notString = { key: "test", source: "This is not a plural string" };
        const pluralRes = convertStringToPlural(notString);
        expect(pluralRes).toBeUndefined();
    });

    test("convertStringToPlural deals with implied other category properly", () => {
        expect.assertions(3);

        const stringRes = new ResourceString({
            key: "testImpliedOther",
            context: "test",
            pathName: "test.json",
            sourceLocale: "en-US",
            source: "one#singular|#plural",
            targetLocale: "de-DE",
            target: "one#einzelig|#mehrzahl"
        });
        const pluralRes = convertStringToPlural(stringRes);
        expect(pluralRes).toBeInstanceOf(ResourcePlural);
        expect(pluralRes.getSource()).toStrictEqual({
            one: "singular",
            other: "plural"
        });
        expect(pluralRes.getTarget()).toStrictEqual({
            one: "einzelig",
            other: "mehrzahl"
        });
    });

    test("convertPluralToString works properly with a valid plural object", () => {
        expect.assertions(3);
        const pluralRes = new ResourcePlural({
            key: "testPlural",
            context: "test",
            pathName: "test.json",
            sourceLocale: "en-US",
            source: {
                one: "singular string",
                other: "plural string"
            },
            targetLocale: "ru-RU",
            target: {
                one: "один",
                few: "два",
                many: "три",
                other: "три"
            }
        });
        const stringRes = convertPluralToString(pluralRes);
        expect(stringRes).toBeInstanceOf(ResourceString);
        expect(stringRes.getSource()).toBe("one#singular string|other#plural string");
        expect(stringRes.getTarget()).toBe("one#один|few#два|many#три|other#три");
    });

    test("convertPluralToString carries over all of the other properties of plural", () => {
        expect.assertions(4);
        const pluralRes = new ResourcePlural({
            key: "testPlural",
            context: "test",
            pathName: "test.json",
            sourceLocale: "en-US",
            source: {
                one: "singular string",
                other: "plural string"
            },
            targetLocale: "ru-RU",
            target: {
                one: "один",
                few: "два",
                many: "три",
                other: "три"
            }
        });
        const stringRes = convertPluralToString(pluralRes);
        expect(stringRes).toBeInstanceOf(ResourceString);
        expect(stringRes.getKey()).toBe("testPlural");
        expect(stringRes.getContext()).toBe("test");
        expect(stringRes.getPath()).toBe("test.json");
    });

    test("convertPluralToString returns undefined for a non-plural resource", () => {
        expect.assertions(1);
        const stringRes = new ResourceString({
            key: "testNonPlural",
            context: "test",
            pathName: "test.json",
            sourceLocale: "en-US",
            source: "This is not a plural string",
            targetLocale: "de-DE",
            target: "Dies ist kein Pluralstring"
        });
        const pluralRes = convertPluralToString(stringRes);
        expect(pluralRes).toBeUndefined();
    });

    test("convertPluralToString returns undefined for a non-ResourcePlural", () => {
        expect.assertions(1);
        const notPlural = { key: "test", source: "This is not a plural string" };
        const pluralRes = convertPluralToString(notPlural);
        expect(pluralRes).toBeUndefined();
    });

    test("convertPluralToString returns undefined for a null input", () => {
        expect.assertions(1);
        const pluralRes = convertPluralToString(null);
        expect(pluralRes).toBeUndefined();
    });

    test("convertPluralToString returns something appropriate if some of the plural categories are empty", () => {
        expect.assertions(3);
        const pluralRes = new ResourcePlural({
            key: "testPlural",
            context: "test",
            pathName: "test.json",
            sourceLocale: "en-US",
            source: {
                one: "1",
                two: "",
                other: "3"
            },
            targetLocale: "de-DE",
            target: {
                one: "eins",
                two: "",
                other: "drei"
            }
        });
        const stringRes = convertPluralToString(pluralRes);
        expect(stringRes).toBeInstanceOf(ResourceString);
        expect(stringRes.getSource()).toBe("one#1|two#|other#3");
        expect(stringRes.getTarget()).toBe("one#eins|two#|other#drei");
    });
});

