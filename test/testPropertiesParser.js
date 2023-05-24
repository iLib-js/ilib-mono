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

    testPropertiesParserParseReadSourceFile: function(test) {
        test.expect(15);

        const parser = new PropertiesParser({
            filePath: "./test/testfiles/strings_en-US.properties",
            sourceLocale: "en-US"
        });
        test.ok(parser);

        const actual = parser.parse();
        test.ok(actual);

        const expected = [
            new ResourceString({
                sourceLocale: "en-US",
                source: "translation 1",
                key: "resource1",
                pathName: "./test/testfiles/strings_en-US.properties",
                state: "new",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                source: "translation 2",
                key: "resource2",
                pathName: "./test/testfiles/strings_en-US.properties",
                state: "new",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                source: "translation 3",
                key: "resource3",
                pathName: "./test/testfiles/strings_en-US.properties",
                state: "new",
                comment: "comment for resource3",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                source: "translation 4",
                key: "resource4",
                pathName: "./test/testfiles/strings_en-US.properties",
                state: "new",
                comment: "this is a comment for translation 4",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                source: "translation 5",
                key: "resource5",
                pathName: "./test/testfiles/strings_en-US.properties",
                state: "new",
                comment: "start of comment for translation5 continuation of comment for translation 5",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                source: "translation 6",
                key: "resource6",
                pathName: "./test/testfiles/strings_en-US.properties",
                state: "new",
                comment: "this is a comment for resource6",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                source: "translation 7",
                key: "resource7",
                pathName: "./test/testfiles/strings_en-US.properties",
                state: "new",
                datatype: "properties"
            })
        ];

        test.ok(actual);
        test.ok(Array.isArray(actual));
        test.equal(actual.length, 1);

        const ir = actual[0];
        test.equal(ir.getType(), "resource");
        test.equal(ir.getPath(), "./test/testfiles/strings_en-US.properties");
        const resources = ir.getRepresentation();
        test.equal(resources.length, 7);

        for (let i = 0; i < resources.length; i++) {
            test.deepEqual(resources[i], expected[i], `resource ${i}`);
        }

        test.done();
    },

    testPropertiesParserParseReadTargetFile: function(test) {
        test.expect(15);

        const parser = new PropertiesParser({
            filePath: "./test/testfiles/de-DE.properties",
            sourceLocale: "en-US"
        });
        test.ok(parser);

        const actual = parser.parse();
        test.ok(actual);

        const expected = [
            new ResourceString({
                sourceLocale: "en-US",
                source: "translation 1",
                targetLocale: "de-DE",
                target: "Umsetzung 1",
                key: "resource1",
                pathName: "./test/testfiles/de-DE.properties",
                state: "new",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                source: "translation 2",
                targetLocale: "de-DE",
                target: "Umsetzung 2",
                key: "resource2",
                pathName: "./test/testfiles/de-DE.properties",
                state: "new",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                source: "translation 3",
                targetLocale: "de-DE",
                target: "Umsetzung 3",
                key: "resource3",
                pathName: "./test/testfiles/de-DE.properties",
                state: "new",
                comment: "comment for resource3",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                source: "translation 4",
                targetLocale: "de-DE",
                target: "Umsetzung 4",
                key: "resource4",
                pathName: "./test/testfiles/de-DE.properties",
                state: "new",
                comment: "this is a comment for translation 4",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                source: "translation 5",
                targetLocale: "de-DE",
                target: "Umsetzung 5",
                key: "resource5",
                pathName: "./test/testfiles/de-DE.properties",
                state: "new",
                comment: "start of comment for translation5 continuation of comment for translation 5",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                source: "translation 6",
                targetLocale: "de-DE",
                target: "Umsetzung 6",
                key: "resource6",
                pathName: "./test/testfiles/de-DE.properties",
                state: "new",
                comment: "this is a comment for resource6",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                source: "translation 7",
                targetLocale: "de-DE",
                target: "Umsetzung 7",
                key: "resource7",
                pathName: "./test/testfiles/de-DE.properties",
                state: "new",
                datatype: "properties"
            })
        ];

        test.ok(actual);
        test.ok(Array.isArray(actual));
        test.equal(actual.length, 1);

        const ir = actual[0];
        test.equal(ir.getType(), "resource");
        test.equal(ir.getPath(), "./test/testfiles/de-DE.properties");
        const resources = ir.getRepresentation();
        test.equal(resources.length, 7);

        for (let i = 0; i < resources.length; i++) {
            test.deepEqual(resources[i], expected[i], `resource ${i}`);
        }

        test.done();
    },

    testPropertiesParserParseReadTargetFileWithSharedSource: function(test) {
        test.expect(15);

        const parser = new PropertiesParser({
            filePath: "./test/testfiles/resources_de-DE.properties",
            sourceLocale: "en-US"
        });
        test.ok(parser);

        const actual = parser.parse();
        test.ok(actual);

        const expected = [
            new ResourceString({
                sourceLocale: "en-US",
                source: "translation 1",
                targetLocale: "de-DE",
                target: "Umsetzung 1",
                key: "resource1",
                pathName: "./test/testfiles/resources_de-DE.properties",
                state: "new",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                source: "translation 2",
                targetLocale: "de-DE",
                target: "Umsetzung 2",
                key: "resource2",
                pathName: "./test/testfiles/resources_de-DE.properties",
                state: "new",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                source: "translation 3",
                targetLocale: "de-DE",
                target: "Umsetzung 3",
                key: "resource3",
                pathName: "./test/testfiles/resources_de-DE.properties",
                state: "new",
                comment: "comment for resource3",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                source: "translation 4",
                targetLocale: "de-DE",
                target: "Umsetzung 4",
                key: "resource4",
                pathName: "./test/testfiles/resources_de-DE.properties",
                state: "new",
                comment: "this is a comment for translation 4",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                source: "translation 5",
                targetLocale: "de-DE",
                target: "Umsetzung 5",
                key: "resource5",
                pathName: "./test/testfiles/resources_de-DE.properties",
                state: "new",
                comment: "start of comment for translation5 continuation of comment for translation 5",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                source: "translation 6",
                targetLocale: "de-DE",
                target: "Umsetzung 6",
                key: "resource6",
                pathName: "./test/testfiles/resources_de-DE.properties",
                state: "new",
                comment: "this is a comment for resource6",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                source: "translation 7",
                targetLocale: "de-DE",
                target: "Umsetzung 7",
                key: "resource7",
                pathName: "./test/testfiles/resources_de-DE.properties",
                state: "new",
                datatype: "properties"
            })
        ];

        test.ok(actual);
        test.ok(Array.isArray(actual));
        test.equal(actual.length, 1);

        const ir = actual[0];
        test.equal(ir.getType(), "resource");
        test.equal(ir.getPath(), "./test/testfiles/resources_de-DE.properties");
        const resources = ir.getRepresentation();
        test.equal(resources.length, 7);

        for (let i = 0; i < resources.length; i++) {
            test.deepEqual(resources[i], expected[i], `resource ${i}`);
        }

        test.done();
    },

    testPropertiesParserParseReadTargetFileWithSourceWithNoLocale: function(test) {
        test.expect(15);

        const parser = new PropertiesParser({
            filePath: "./test/testfiles/test_de-DE.properties",
            sourceLocale: "en-US"
        });
        test.ok(parser);

        const actual = parser.parse();
        test.ok(actual);

        const expected = [
            new ResourceString({
                sourceLocale: "en-US",
                source: "translation 1",
                targetLocale: "de-DE",
                target: "Umsetzung 1",
                key: "resource1",
                pathName: "./test/testfiles/test_de-DE.properties",
                state: "new",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                source: "translation 2",
                targetLocale: "de-DE",
                target: "Umsetzung 2",
                key: "resource2",
                pathName: "./test/testfiles/test_de-DE.properties",
                state: "new",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                source: "translation 3",
                targetLocale: "de-DE",
                target: "Umsetzung 3",
                key: "resource3",
                pathName: "./test/testfiles/test_de-DE.properties",
                state: "new",
                comment: "comment for resource3",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                source: "translation 4",
                targetLocale: "de-DE",
                target: "Umsetzung 4",
                key: "resource4",
                pathName: "./test/testfiles/test_de-DE.properties",
                state: "new",
                comment: "this is a comment for translation 4",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                source: "translation 5",
                targetLocale: "de-DE",
                target: "Umsetzung 5",
                key: "resource5",
                pathName: "./test/testfiles/test_de-DE.properties",
                state: "new",
                comment: "start of comment for translation5 continuation of comment for translation 5",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                source: "translation 6",
                targetLocale: "de-DE",
                target: "Umsetzung 6",
                key: "resource6",
                pathName: "./test/testfiles/test_de-DE.properties",
                state: "new",
                comment: "this is a comment for resource6",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                source: "translation 7",
                targetLocale: "de-DE",
                target: "Umsetzung 7",
                key: "resource7",
                pathName: "./test/testfiles/test_de-DE.properties",
                state: "new",
                datatype: "properties"
            })
        ];

        test.ok(actual);
        test.ok(Array.isArray(actual));
        test.equal(actual.length, 1);

        const ir = actual[0];
        test.equal(ir.getType(), "resource");
        test.equal(ir.getPath(), "./test/testfiles/test_de-DE.properties");
        const resources = ir.getRepresentation();
        test.equal(resources.length, 7);

        for (let i = 0; i < resources.length; i++) {
            test.deepEqual(resources[i], expected[i], `resource ${i}`);
        }

        test.done();
    },
};

