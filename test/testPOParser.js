/*
 * testPOParser.js - test the parser factory
 *
 * Copyright © 2022 JEDLSoft
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

export const testPOParser = {
    testPOParserConstructor: function(test) {
        test.expect(1);

        const parser = new POParser();
        test.ok(parser);

        test.done();
    },

    testPOParserConstructorOptions: function(test) {
        test.expect(1);

        const parser = new POParser({
            filePath: "./test/testfiles/test.po"
        });
        test.ok(parser);

        test.done();
    },

    testPOParserParse: function(test) {
        test.expect(4);

        const parser = new POParser({
            filePath: "./test/testfiles/test.po"
        });
        test.ok(parser);
        parser.parse();

        const resources = parser.getResources();
        test.ok(resources);
        test.ok(Array.isArray(resources));
        test.equal(resources.length, 4);

        test.done();
    },

    testPOParserParseRightContents: function(test) {
        test.expect(18);

        const parser = new POParser({
            filePath: "./test/testfiles/test.po"
        });
        test.ok(parser);
        parser.parse();

        const resources = parser.getResources();
        test.ok(resources);

        test.equal(resources[0].getSource(), "string 1");
        test.equal(resources[0].getType(), "string");
        test.equal(resources[0].getKey(), "string 1");
        test.equal(resources[0].getSourceLocale(), "en-US");

        test.equal(resources[1].getSource(), "string 2");
        test.equal(resources[1].getType(), "string");
        test.equal(resources[1].getKey(), "string 2");
        test.equal(resources[1].getSourceLocale(), "en-US");

        test.deepEqual(resources[2].getSource(), {
            one: "one string",
            other: "{count} strings"
        });
        test.equal(resources[2].getType(), "plural");
        test.equal(resources[2].getKey(), "one string");
        test.equal(resources[2].getSourceLocale(), "en-US");

        test.equal(resources[3].getSource(), "string 3 and 4");
        test.equal(resources[3].getType(), "string");
        test.equal(resources[3].getKey(), "string 3 and 4");
        test.equal(resources[3].getSourceLocale(), "en-US");

        test.done();
    },

    testPOParserParseTranslatedFile: function(test) {
        test.expect(26);

        const parser = new POParser({
            filePath: "./test/testfiles/de-DE.po"
        });
        test.ok(parser);
        parser.parse();

        const resources = parser.getResources();
        test.ok(resources);

        test.equal(resources[0].getSource(), "string 1");
        test.equal(resources[0].getTarget(), "Zeichenfolge 1");
        test.equal(resources[0].getType(), "string");
        test.equal(resources[0].getKey(), "string 1");
        test.equal(resources[0].getSourceLocale(), "en-US");
        test.equal(resources[0].getTargetLocale(), "de-DE");

        test.equal(resources[1].getSource(), "string 2");
        test.equal(resources[1].getTarget(), "Zeichenfolge 2");
        test.equal(resources[1].getType(), "string");
        test.equal(resources[1].getKey(), "string 2");
        test.equal(resources[1].getSourceLocale(), "en-US");
        test.equal(resources[1].getTargetLocale(), "de-DE");

        test.deepEqual(resources[2].getSource(), {
            one: "one string",
            other: "{count} strings"
        });
        test.deepEqual(resources[2].getTarget(), {
            one: "eine Zeichenfolge",
            other: "{count} Zeichenfolgen"
        });
        test.equal(resources[2].getType(), "plural");
        test.equal(resources[2].getKey(), "one string");
        test.equal(resources[2].getSourceLocale(), "en-US");
        test.equal(resources[2].getTargetLocale(), "de-DE");

        test.equal(resources[3].getSource(), "string 3 and 4");
        test.equal(resources[3].getTarget(), "Zeichenfolgen 3 und 4");
        test.equal(resources[3].getType(), "string");
        test.equal(resources[3].getKey(), "string 3 and 4");
        test.equal(resources[3].getSourceLocale(), "en-US");
        test.equal(resources[3].getTargetLocale(), "de-DE");

        test.done();
    },

    testPOParserParseTranslatedFileWithPathTemplate: function(test) {
        test.expect(26);

        const parser = new POParser({
            filePath: "./test/testfiles/test_de_DE.po",
            settings: {
                template: "[dir]/test_[localeUnder].po"
            }
        });
        test.ok(parser);
        parser.parse();

        const resources = parser.getResources();
        test.ok(resources);

        test.equal(resources[0].getSource(), "string 1");
        test.equal(resources[0].getTarget(), "Zeichenfolge 1");
        test.equal(resources[0].getType(), "string");
        test.equal(resources[0].getKey(), "string 1");
        test.equal(resources[0].getSourceLocale(), "en-US");
        test.equal(resources[0].getTargetLocale(), "de-DE");

        test.equal(resources[1].getSource(), "string 2");
        test.equal(resources[1].getTarget(), "Zeichenfolge 2");
        test.equal(resources[1].getType(), "string");
        test.equal(resources[1].getKey(), "string 2");
        test.equal(resources[1].getSourceLocale(), "en-US");
        test.equal(resources[1].getTargetLocale(), "de-DE");

        test.deepEqual(resources[2].getSource(), {
            one: "one string",
            other: "{count} strings"
        });
        test.deepEqual(resources[2].getTarget(), {
            one: "eine Zeichenfolge",
            other: "{count} Zeichenfolgen"
        });
        test.equal(resources[2].getType(), "plural");
        test.equal(resources[2].getKey(), "one string");
        test.equal(resources[2].getSourceLocale(), "en-US");
        test.equal(resources[2].getTargetLocale(), "de-DE");

        test.equal(resources[3].getSource(), "string 3 and 4");
        test.equal(resources[3].getTarget(), "Zeichenfolgen 3 und 4");
        test.equal(resources[3].getType(), "string");
        test.equal(resources[3].getKey(), "string 3 and 4");
        test.equal(resources[3].getSourceLocale(), "en-US");
        test.equal(resources[3].getTargetLocale(), "de-DE");

        test.done();
    },

};

