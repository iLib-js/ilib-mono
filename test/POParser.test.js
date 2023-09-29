/*
 * POParser.test.js - test the parser factory
 *
 * Copyright © 2022-2023 JEDLSoft
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

import { Parser } from 'i18nlint-common';

import POParser from '../src/POParser.js';

describe("testPOParser", () => {
    test("POParserConstructor", () => {
        expect.assertions(1);

        const parser = new POParser();
        expect(parser).toBeTruthy();
    });

    test("POParserConstructorOptions", () => {
        expect.assertions(1);

        const parser = new POParser({
            filePath: "./test/testfiles/test.po"
        });
        expect(parser).toBeTruthy();
    });

    test("POParserParse", () => {
        expect.assertions(6);

        const parser = new POParser({
            filePath: "./test/testfiles/test.po"
        });
        expect(parser).toBeTruthy();
        const irArray = parser.parse();
        expect(Array.isArray(irArray)).toBeTruthy();
        expect(irArray[0].getType()).toBe("resource");

        const resources = irArray[0].getRepresentation();
        expect(resources).toBeTruthy();
        expect(Array.isArray(resources)).toBeTruthy();
        expect(resources.length).toBe(4);
    });

    test("POParserParseRightContents", () => {
        expect.assertions(19);

        const parser = new POParser({
            filePath: "./test/testfiles/test.po"
        });
        expect(parser).toBeTruthy();
        const irArray = parser.parse();
        expect(Array.isArray(irArray)).toBeTruthy();

        const resources = irArray[0].getRepresentation();
        expect(resources).toBeTruthy();

        expect(resources[0].getSource()).toBe("string 1");
        expect(resources[0].getType()).toBe("string");
        expect(resources[0].getKey()).toBe("string 1");
        expect(resources[0].getSourceLocale()).toBe("en-US");

        expect(resources[1].getSource()).toBe("string 2");
        expect(resources[1].getType()).toBe("string");
        expect(resources[1].getKey()).toBe("string 2");
        expect(resources[1].getSourceLocale()).toBe("en-US");

        expect(resources[2].getSource()).toStrictEqual({
            one: "one string",
            other: "{count} strings"
        });
        expect(resources[2].getType()).toBe("plural");
        expect(resources[2].getKey()).toBe("one string");
        expect(resources[2].getSourceLocale()).toBe("en-US");

        expect(resources[3].getSource()).toBe("string 3 and 4");
        expect(resources[3].getType()).toBe("string");
        expect(resources[3].getKey()).toBe("string 3 and 4");
        expect(resources[3].getSourceLocale()).toBe("en-US");
    });

    test("POParserParseTranslatedFile", () => {
        expect.assertions(27);

        const parser = new POParser({
            filePath: "./test/testfiles/de-DE.po"
        });
        expect(parser).toBeTruthy();
        const irArray = parser.parse();
        expect(Array.isArray(irArray)).toBeTruthy();

        const resources = irArray[0].getRepresentation();
        expect(resources).toBeTruthy();

        expect(resources[0].getSource()).toBe("string 1");
        expect(resources[0].getTarget()).toBe("Zeichenfolge 1");
        expect(resources[0].getType()).toBe("string");
        expect(resources[0].getKey()).toBe("string 1");
        expect(resources[0].getSourceLocale()).toBe("en-US");
        expect(resources[0].getTargetLocale()).toBe("de-DE");

        expect(resources[1].getSource()).toBe("string 2");
        expect(resources[1].getTarget()).toBe("Zeichenfolge 2");
        expect(resources[1].getType()).toBe("string");
        expect(resources[1].getKey()).toBe("string 2");
        expect(resources[1].getSourceLocale()).toBe("en-US");
        expect(resources[1].getTargetLocale()).toBe("de-DE");

        expect(resources[2].getSource()).toStrictEqual({
            one: "one string",
            other: "{count} strings"
        });
        expect(resources[2].getTarget()).toStrictEqual({
            one: "eine Zeichenfolge",
            other: "{count} Zeichenfolgen"
        });
        expect(resources[2].getType()).toBe("plural");
        expect(resources[2].getKey()).toBe("one string");
        expect(resources[2].getSourceLocale()).toBe("en-US");
        expect(resources[2].getTargetLocale()).toBe("de-DE");

        expect(resources[3].getSource()).toBe("string 3 and 4");
        expect(resources[3].getTarget()).toBe("Zeichenfolgen 3 und 4");
        expect(resources[3].getType()).toBe("string");
        expect(resources[3].getKey()).toBe("string 3 and 4");
        expect(resources[3].getSourceLocale()).toBe("en-US");
        expect(resources[3].getTargetLocale()).toBe("de-DE");
    });

    test("POParserParseTranslatedFileWithPathTemplate", () => {
        expect.assertions(27);

        const parser = new POParser({
            filePath: "./test/testfiles/test_de_DE.po",
            settings: {
                template: "[dir]/test_[localeUnder].po"
            }
        });
        expect(parser).toBeTruthy();
        const irArray = parser.parse();
        expect(Array.isArray(irArray)).toBeTruthy();

        const resources = irArray[0].getRepresentation();
        expect(resources).toBeTruthy();

        expect(resources[0].getSource()).toBe("string 1");
        expect(resources[0].getTarget()).toBe("Zeichenfolge 1");
        expect(resources[0].getType()).toBe("string");
        expect(resources[0].getKey()).toBe("string 1");
        expect(resources[0].getSourceLocale()).toBe("en-US");
        expect(resources[0].getTargetLocale()).toBe("de-DE");

        expect(resources[1].getSource()).toBe("string 2");
        expect(resources[1].getTarget()).toBe("Zeichenfolge 2");
        expect(resources[1].getType()).toBe("string");
        expect(resources[1].getKey()).toBe("string 2");
        expect(resources[1].getSourceLocale()).toBe("en-US");
        expect(resources[1].getTargetLocale()).toBe("de-DE");

        expect(resources[2].getSource()).toStrictEqual({
            one: "one string",
            other: "{count} strings"
        });
        expect(resources[2].getTarget()).toStrictEqual({
            one: "eine Zeichenfolge",
            other: "{count} Zeichenfolgen"
        });
        expect(resources[2].getType()).toBe("plural");
        expect(resources[2].getKey()).toBe("one string");
        expect(resources[2].getSourceLocale()).toBe("en-US");
        expect(resources[2].getTargetLocale()).toBe("de-DE");

        expect(resources[3].getSource()).toBe("string 3 and 4");
        expect(resources[3].getTarget()).toBe("Zeichenfolgen 3 und 4");
        expect(resources[3].getType()).toBe("string");
        expect(resources[3].getKey()).toBe("string 3 and 4");
        expect(resources[3].getSourceLocale()).toBe("en-US");
        expect(resources[3].getTargetLocale()).toBe("de-DE");
    });
});

