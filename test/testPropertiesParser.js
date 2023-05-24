/*
 * testPropertiesParser.js - test the React JS parser
 *
 * Copyright © 2023 Box, Inc.
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
import { ResourceString } from 'ilib-tools-common';

import PropertiesParser from '../src/parsers/PropertiesParser.js';

import { Result, IntermediateRepresentation } from 'i18nlint-common';

export const testPropertiesParser = {
    testPropertiesParserConstructorEmpty: function(test) {
        test.expect(1);

        const parser = new PropertiesParser();
        test.ok(parser);

        test.done();
    },

    testPropertiesParserConstructorTargetPath: function(test) {
        test.expect(5);

        const parser = new PropertiesParser({
            filePath: "./test/testfiles/test_de-DE.properties",
            sourceLocale: "en-US"
        });
        test.ok(parser);
        test.equal(parser.sourceLocale, "en-US");
        test.equal(parser.targetLocale, "de-DE");
        test.equal(parser.sourcePath, "./test/testfiles/test.properties");
        test.equal(parser.path, "./test/testfiles/test_de-DE.properties");

        test.done();
    },

    testPropertiesParserConstructorSourcePathNoLocale: function(test) {
        test.expect(5);

        const parser = new PropertiesParser({
            filePath: "./test/testfiles/test.properties",
            sourceLocale: "en-US"
        });
        test.ok(parser);
        test.equal(parser.sourceLocale, "en-US");
        test.ok(!parser.targetLocale);
        test.equal(parser.sourcePath, "./test/testfiles/test.properties");
        test.ok(!parser.path);

        test.done();
    },

    testPropertiesParserConstructorTargetPathWithSourceLocale: function(test) {
        test.expect(5);

        const parser = new PropertiesParser({
            filePath: "./test/testfiles/strings_de-DE.properties",
            sourceLocale: "en-US"
        });
        test.ok(parser);
        test.equal(parser.sourceLocale, "en-US");
        test.equal(parser.targetLocale, "de-DE");
        test.equal(parser.sourcePath, "./test/testfiles/strings_en-US.properties");
        test.equal(parser.path, "./test/testfiles/strings_de-DE.properties");

        test.done();
    },

    testPropertiesParserConstructorSourcePathWithSourceLocale: function(test) {
        test.expect(5);

        const parser = new PropertiesParser({
            filePath: "./test/testfiles/strings_en-US.properties",
            sourceLocale: "en-US"
        });
        test.ok(parser);
        test.equal(parser.sourceLocale, "en-US");
        test.ok(!parser.targetLocale);
        test.equal(parser.sourcePath, "./test/testfiles/strings_en-US.properties");
        test.ok(!parser.path);

        test.done();
    },

    testPropertiesParserConstructorTargetPathWithSharedSourceLocale: function(test) {
        test.expect(5);

        const parser = new PropertiesParser({
            filePath: "./test/testfiles/resources_de-DE.properties",
            sourceLocale: "en-US"
        });
        test.ok(parser);
        test.equal(parser.sourceLocale, "en-US");
        test.equal(parser.targetLocale, "de-DE");
        test.equal(parser.sourcePath, "./test/testfiles/resources_en.properties");
        test.equal(parser.path, "./test/testfiles/resources_de-DE.properties");

        test.done();
    },

    testPropertiesParserConstructorSourcePathWithSharedSourceLocale: function(test) {
        test.expect(5);

        const parser = new PropertiesParser({
            filePath: "./test/testfiles/resources_en.properties",
            sourceLocale: "en-US"
        });
        test.ok(parser);
        test.equal(parser.sourceLocale, "en-US");
        test.ok(!parser.targetLocale);
        test.equal(parser.sourcePath, "./test/testfiles/resources_en.properties");
        test.ok(!parser.path);

        test.done();
    },

    testPropertiesParserConstructorTargetPathWithNoBasename: function(test) {
        test.expect(5);

        const parser = new PropertiesParser({
            filePath: "./test/testfiles/de-DE.properties",
            sourceLocale: "en-US"
        });
        test.ok(parser);
        test.equal(parser.sourceLocale, "en-US");
        test.equal(parser.targetLocale, "de-DE");
        test.equal(parser.sourcePath, "./test/testfiles/en-US.properties");
        test.equal(parser.path, "./test/testfiles/de-DE.properties");

        test.done();
    },

    testPropertiesParserConstructorSourcePathWithNoBasename: function(test) {
        test.expect(5);

        const parser = new PropertiesParser({
            filePath: "./test/testfiles/en-US.properties",
            sourceLocale: "en-US"
        });
        test.ok(parser);
        test.equal(parser.sourceLocale, "en-US");
        test.ok(!parser.targetLocale);
        test.equal(parser.sourcePath, "./test/testfiles/en-US.properties");
        test.ok(!parser.path);

        test.done();
    },

    testPropertiesParserGetDescription: function(test) {
        test.expect(2);

        const parser = new PropertiesParser();
        test.ok(parser);

        test.equal(parser.getDescription(), "A parser for properties files.");

        test.done();
    },

    testPropertiesParserGetName: function(test) {
        test.expect(2);

        const parser = new PropertiesParser();
        test.ok(parser);

        test.equal(parser.getName(), "properties");

        test.done();
    },

    testPropertiesParserGetExtensions: function(test) {
        test.expect(2);

        const parser = new PropertiesParser();
        test.ok(parser);

        test.deepEqual(parser.getExtensions(), [ "properties" ]);

        test.done();
    },

    testPropertiesParserParseStringSimple: function(test) {
        test.expect(3);

        const parser = new PropertiesParser();
        test.ok(parser);

        const actual = parser.parseString(
            `
            resource1 = value 1
            resource2 = value 2
            `);
        test.ok(actual);

        const expected = {
            resource1: {
                source: "value 1"
            },
            resource2: {
                source: "value 2"
            }
        };
        test.deepEqual(actual, expected);

        test.done();
    },

    testPropertiesParserParseStringWithComments: function(test) {
        test.expect(3);

        const parser = new PropertiesParser();
        test.ok(parser);

        const actual = parser.parseString(
            `
            # this is a comment before the string
            resource1 = value 1
            resource2 = value 2 # this is an inline comment
            ! this is a comment using an exclamation point instead
            resource3 = value 3
            `);
        test.ok(actual);

        const expected = {
            resource1: {
                source: "value 1",
                comment: "this is a comment before the string"
            },
            resource2: {
                source: "value 2",
                comment: "this is an inline comment"
            },
            resource3: {
                source: "value 3",
                comment: "this is a comment using an exclamation point instead"
            }
        };
        test.deepEqual(actual, expected);

        test.done();
    },

    testPropertiesParserParseStringSkipBlankLines: function(test) {
        test.expect(3);

        const parser = new PropertiesParser();
        test.ok(parser);

        const actual = parser.parseString(
            `
            resource1 = value 1
            
            
            
            resource2 = value 2
            `);
        test.ok(actual);

        const expected = {
            resource1: {
                source: "value 1"
            },
            resource2: {
                source: "value 2"
            }
        };
        test.deepEqual(actual, expected);

        test.done();
    },

    testPropertiesParserParseStringColonSeparator: function(test) {
        test.expect(3);

        const parser = new PropertiesParser();
        test.ok(parser);

        const actual = parser.parseString(
            `
            resource1: value 1
            resource2: value 2
            `);
        test.ok(actual);

        const expected = {
            resource1: {
                source: "value 1"
            },
            resource2: {
                source: "value 2"
            }
        };
        test.deepEqual(actual, expected);

        test.done();
    },

    testPropertiesParserParseStringSpacesInId: function(test) {
        test.expect(3);

        const parser = new PropertiesParser();
        test.ok(parser);

        const actual = parser.parseString(
            `
            resource\\ 1 = value 1
            resource\\ 2 = value 2
            `);
        test.ok(actual);

        const expected = {
            "resource 1": {
                source: "value 1"
            },
            "resource 2": {
                source: "value 2"
            }
        };
        test.deepEqual(actual, expected);

        test.done();
    },

    testPropertiesParserParseStringLineContinuation: function(test) {
        test.expect(3);

        const parser = new PropertiesParser();
        test.ok(parser);

        const actual = parser.parseString(
            `
            resource1 = value 1\\
            this is also value 1
            resource2 = value 2
            `);
        test.ok(actual);

        const expected = {
            resource1: {
                source: "value 1\n            this is also value 1"
            },
            resource2: {
                source: "value 2"
            }
        };
        test.deepEqual(actual, expected);

        test.done();
    },

    testPropertiesParserParseStringUnicodeEscapeSequences: function(test) {
        test.expect(3);

        const parser = new PropertiesParser();
        test.ok(parser);

        const actual = parser.parseString(
            `
            resource1 = value 1 \\u306B\\u307B\\u3093
            resource2 = value 2
            `);
        test.ok(actual);

        const expected = {
            resource1: {
                source: "value 1 にほん"
            },
            resource2: {
                source: "value 2"
            }
        };
        test.deepEqual(actual, expected);

        test.done();
    },

    testPropertiesParserParseStringUnicodeNonAscii: function(test) {
        test.expect(3);

        const parser = new PropertiesParser();
        test.ok(parser);

        const actual = parser.parseString(
            `
            resource1 = value 1 にほん
            resource2 = value 2
            `);
        test.ok(actual);

        const expected = {
            resource1: {
                source: "value 1 にほん"
            },
            resource2: {
                source: "value 2"
            }
        };
        test.deepEqual(actual, expected);

        test.done();
    },

    testPropertiesParserParseStringExtraEquals: function(test) {
        test.expect(3);

        const parser = new PropertiesParser();
        test.ok(parser);

        const actual = parser.parseString(
            `
            resource1 = value 1 = value 3
            resource2 = value 2
            `);
        test.ok(actual);

        const expected = {
            resource1: {
                source: "value 1 = value 3"
            },
            resource2: {
                source: "value 2"
            }
        };
        test.deepEqual(actual, expected);

        test.done();
    },

    testPropertiesParserParseStringStripLeadingWhitespace: function(test) {
        test.expect(3);

        const parser = new PropertiesParser();
        test.ok(parser);

        const actual = parser.parseString(
            `
            resource1 =     value 1           \t\u00A0    
            resource2 = value 2    
            `);
        test.ok(actual);

        const expected = {
            resource1: {
                source: "value 1           \t     "
            },
            resource2: {
                source: "value 2    "
            }
        };
        test.deepEqual(actual, expected);

        test.done();
    },
};

