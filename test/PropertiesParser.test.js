/*
 * PropertiesParser.test.js - test the React JS parser
 *
 * Copyright © 2023-2024 Box, Inc.
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

describe("testPropertiesParser", () => {
    test("PropertiesParserConstructorEmpty", () => {
        expect.assertions(1);

        const parser = new PropertiesParser();
        expect(parser).toBeTruthy();
    });

    test("PropertiesParserConstructorTargetPath", () => {
        expect.assertions(5);

        const parser = new PropertiesParser({
            filePath: "./test/testfiles/test_de-DE.properties",
            sourceLocale: "en-US"
        });
        expect(parser).toBeTruthy();
        expect(parser.sourceLocale).toBe("en-US");
        expect(parser.targetLocale).toBe("de-DE");
        expect(parser.sourcePath).toBe("./test/testfiles/test.properties");
        expect(parser.path).toBe("./test/testfiles/test_de-DE.properties");
    });

    test("PropertiesParserConstructorSourcePathNoLocale", () => {
        expect.assertions(5);

        const parser = new PropertiesParser({
            filePath: "./test/testfiles/test.properties",
            sourceLocale: "en-US"
        });
        expect(parser).toBeTruthy();
        expect(parser.sourceLocale).toBe("en-US");
        expect(!parser.targetLocale).toBeTruthy();
        expect(parser.sourcePath).toBe("./test/testfiles/test.properties");
        expect(!parser.path).toBeTruthy();
    });

    test("PropertiesParserConstructorTargetPathWithSourceLocale", () => {
        expect.assertions(5);

        const parser = new PropertiesParser({
            filePath: "./test/testfiles/strings_de-DE.properties",
            sourceLocale: "en-US"
        });
        expect(parser).toBeTruthy();
        expect(parser.sourceLocale).toBe("en-US");
        expect(parser.targetLocale).toBe("de-DE");
        expect(parser.sourcePath).toBe("./test/testfiles/strings_en-US.properties");
        expect(parser.path).toBe("./test/testfiles/strings_de-DE.properties");
    });

    test("PropertiesParserConstructorSourcePathWithSourceLocale", () => {
        expect.assertions(5);

        const parser = new PropertiesParser({
            filePath: "./test/testfiles/strings_en-US.properties",
            sourceLocale: "en-US"
        });
        expect(parser).toBeTruthy();
        expect(parser.sourceLocale).toBe("en-US");
        expect(!parser.targetLocale).toBeTruthy();
        expect(parser.sourcePath).toBe("./test/testfiles/strings_en-US.properties");
        expect(!parser.path).toBeTruthy();
    });

    test("PropertiesParserConstructorTargetPathWithSharedSourceLocale", () => {
        expect.assertions(5);

        const parser = new PropertiesParser({
            filePath: "./test/testfiles/resources_de-DE.properties",
            sourceLocale: "en-US"
        });
        expect(parser).toBeTruthy();
        expect(parser.sourceLocale).toBe("en-US");
        expect(parser.targetLocale).toBe("de-DE");
        expect(parser.sourcePath).toBe("./test/testfiles/resources_en.properties");
        expect(parser.path).toBe("./test/testfiles/resources_de-DE.properties");
    });

    test("PropertiesParserConstructorSourcePathWithSharedSourceLocale", () => {
        expect.assertions(5);

        const parser = new PropertiesParser({
            filePath: "./test/testfiles/resources_en.properties",
            sourceLocale: "en-US"
        });
        expect(parser).toBeTruthy();
        expect(parser.sourceLocale).toBe("en-US");
        expect(!parser.targetLocale).toBeTruthy();
        expect(parser.sourcePath).toBe("./test/testfiles/resources_en.properties");
        expect(!parser.path).toBeTruthy();
    });

    test("PropertiesParserConstructorTargetPathWithNoBasename", () => {
        expect.assertions(5);

        const parser = new PropertiesParser({
            filePath: "./test/testfiles/de-DE.properties",
            sourceLocale: "en-US"
        });
        expect(parser).toBeTruthy();
        expect(parser.sourceLocale).toBe("en-US");
        expect(parser.targetLocale).toBe("de-DE");
        expect(parser.sourcePath).toBe("./test/testfiles/en-US.properties");
        expect(parser.path).toBe("./test/testfiles/de-DE.properties");
    });

    test("PropertiesParserConstructorSourcePathWithNoBasename", () => {
        expect.assertions(5);

        const parser = new PropertiesParser({
            filePath: "./test/testfiles/en-US.properties",
            sourceLocale: "en-US"
        });
        expect(parser).toBeTruthy();
        expect(parser.sourceLocale).toBe("en-US");
        expect(!parser.targetLocale).toBeTruthy();
        expect(parser.sourcePath).toBe("./test/testfiles/en-US.properties");
        expect(!parser.path).toBeTruthy();
    });

    test("PropertiesParserGetDescription", () => {
        expect.assertions(2);

        const parser = new PropertiesParser();
        expect(parser).toBeTruthy();

        expect(parser.getDescription()).toBe("A parser for properties files.");
    });

    test("PropertiesParserGetName", () => {
        expect.assertions(2);

        const parser = new PropertiesParser();
        expect(parser).toBeTruthy();

        expect(parser.getName()).toBe("PropertiesParser");
    });

    test("PropertiesParserGetExtensions", () => {
        expect.assertions(2);

        const parser = new PropertiesParser();
        expect(parser).toBeTruthy();

        expect(parser.getExtensions()).toStrictEqual([ "properties" ]);
    });

    test("PropertiesParserParseStringSimple", () => {
        expect.assertions(3);

        const parser = new PropertiesParser();
        expect(parser).toBeTruthy();

        const actual = parser.parseString(
            `
            resource1 = value 1
            resource2 = value 2
            `);
        expect(actual).toBeTruthy();

        const expected = {
            resource1: {
                source: "value 1"
            },
            resource2: {
                source: "value 2"
            }
        };
        expect(actual).toStrictEqual(expected);
    });

    test("PropertiesParserParseStringWithComments", () => {
        expect.assertions(3);

        const parser = new PropertiesParser();
        expect(parser).toBeTruthy();

        const actual = parser.parseString(
            `
            # this is a comment before the string
            resource1 = value 1
            resource2 = value 2 # this is an inline comment
            ! this is a comment using an exclamation point instead
            resource3 = value 3
            `);
        expect(actual).toBeTruthy();

        const expected = {
            resource1: {
                source: "value 1",
                comment: "this is a comment before the string"
            },
            resource2: {
                // no inline comments
                source: "value 2 # this is an inline comment"
            },
            resource3: {
                source: "value 3",
                comment: "this is a comment using an exclamation point instead"
            }
        };
        expect(actual).toStrictEqual(expected);
    });

    test("PropertiesParserParseStringSkipBlankLines", () => {
        expect.assertions(3);

        const parser = new PropertiesParser();
        expect(parser).toBeTruthy();

        const actual = parser.parseString(
            `
            resource1 = value 1



            resource2 = value 2
            `);
        expect(actual).toBeTruthy();

        const expected = {
            resource1: {
                source: "value 1"
            },
            resource2: {
                source: "value 2"
            }
        };
        expect(actual).toStrictEqual(expected);
    });

    test("PropertiesParserParseStringColonSeparator", () => {
        expect.assertions(3);

        const parser = new PropertiesParser();
        expect(parser).toBeTruthy();

        const actual = parser.parseString(
            `
            resource1: value 1
            resource2: value 2
            `);
        expect(actual).toBeTruthy();

        const expected = {
            resource1: {
                source: "value 1"
            },
            resource2: {
                source: "value 2"
            }
        };
        expect(actual).toStrictEqual(expected);
    });

    test("PropertiesParserParseStringSpacesInId", () => {
        expect.assertions(3);

        const parser = new PropertiesParser();
        expect(parser).toBeTruthy();

        const actual = parser.parseString(
            `
            resource\\ 1 = value 1
            resource\\ 2 = value 2
            `);
        expect(actual).toBeTruthy();

        const expected = {
            "resource 1": {
                source: "value 1"
            },
            "resource 2": {
                source: "value 2"
            }
        };
        expect(actual).toStrictEqual(expected);
    });

    test("PropertiesParserParseStringLineContinuation", () => {
        expect.assertions(3);

        const parser = new PropertiesParser();
        expect(parser).toBeTruthy();

        const actual = parser.parseString(
            `
            resource1 = value 1\\
            this is also value 1
            resource2 = value 2
            `);
        expect(actual).toBeTruthy();

        const expected = {
            resource1: {
                source: "value 1\n            this is also value 1"
            },
            resource2: {
                source: "value 2"
            }
        };
        expect(actual).toStrictEqual(expected);
    });

    test("PropertiesParserParseStringUnicodeEscapeSequences", () => {
        expect.assertions(3);

        const parser = new PropertiesParser();
        expect(parser).toBeTruthy();

        const actual = parser.parseString(
            `
            resource1 = value 1 \\u306B\\u307B\\u3093
            resource2 = value 2
            `);
        expect(actual).toBeTruthy();

        const expected = {
            resource1: {
                source: "value 1 にほん"
            },
            resource2: {
                source: "value 2"
            }
        };
        expect(actual).toStrictEqual(expected);
    });

    test("PropertiesParserParseStringUnicodeNonAscii", () => {
        expect.assertions(3);

        const parser = new PropertiesParser();
        expect(parser).toBeTruthy();

        const actual = parser.parseString(
            `
            resource1 = value 1 にほん
            resource2 = value 2
            `);
        expect(actual).toBeTruthy();

        const expected = {
            resource1: {
                source: "value 1 にほん"
            },
            resource2: {
                source: "value 2"
            }
        };
        expect(actual).toStrictEqual(expected);
    });

    test("PropertiesParserParseStringExtraEquals", () => {
        expect.assertions(3);

        const parser = new PropertiesParser();
        expect(parser).toBeTruthy();

        const actual = parser.parseString(
            `
            resource1 = value 1 = value 3
            resource2 = value 2
            `);
        expect(actual).toBeTruthy();

        const expected = {
            resource1: {
                source: "value 1 = value 3"
            },
            resource2: {
                source: "value 2"
            }
        };
        expect(actual).toStrictEqual(expected);
    });

    test("PropertiesParserParseStringStripLeadingWhitespace", () => {
        expect.assertions(3);

        const parser = new PropertiesParser();
        expect(parser).toBeTruthy();

        const actual = parser.parseString(
            `
            resource1 =     value 1           \t\u00A0    
            resource2 = value 2    
            `);
        expect(actual).toBeTruthy();

        const expected = {
            resource1: {
                source: "value 1           \t     "
            },
            resource2: {
                source: "value 2    "
            }
        };
        expect(actual).toStrictEqual(expected);
    });

    test("PropertiesParserParseReadSourceFile", () => {
        expect.assertions(15);

        const parser = new PropertiesParser({
            filePath: "./test/testfiles/strings_en-US.properties",
            sourceLocale: "en-US"
        });
        expect(parser).toBeTruthy();

        const actual = parser.parse();
        expect(actual).toBeTruthy();

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

        expect(actual).toBeTruthy();
        expect(Array.isArray(actual)).toBeTruthy();
        expect(actual.length).toBe(1);

        const ir = actual[0];
        expect(ir.getType()).toBe("resource");
        expect(ir.getPath()).toBe("./test/testfiles/strings_en-US.properties");
        const resources = ir.getRepresentation();
        expect(resources.length).toBe(7);

        for (let i = 0; i < resources.length; i++) {
            expect(resources[i]).toStrictEqual(expected[i]) // `resource ${i}`;
        }
    });

    test("PropertiesParserParseReadTargetFile", () => {
        expect.assertions(15);

        const parser = new PropertiesParser({
            filePath: "./test/testfiles/de-DE.properties",
            sourceLocale: "en-US"
        });
        expect(parser).toBeTruthy();

        const actual = parser.parse();
        expect(actual).toBeTruthy();

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

        expect(actual).toBeTruthy();
        expect(Array.isArray(actual)).toBeTruthy();
        expect(actual.length).toBe(1);

        const ir = actual[0];
        expect(ir.getType()).toBe("resource");
        expect(ir.getPath()).toBe("./test/testfiles/de-DE.properties");
        const resources = ir.getRepresentation();
        expect(resources.length).toBe(7);

        for (let i = 0; i < resources.length; i++) {
            expect(resources[i]).toStrictEqual(expected[i]); // `resource ${i}`
        }
    });

    test("PropertiesParserParseReadTargetFileWithSharedSource", () => {
        expect.assertions(15);

        const parser = new PropertiesParser({
            filePath: "./test/testfiles/resources_de-DE.properties",
            sourceLocale: "en-US"
        });
        expect(parser).toBeTruthy();

        const actual = parser.parse();
        expect(actual).toBeTruthy();

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

        expect(actual).toBeTruthy();
        expect(Array.isArray(actual)).toBeTruthy();
        expect(actual.length).toBe(1);

        const ir = actual[0];
        expect(ir.getType()).toBe("resource");
        expect(ir.getPath()).toBe("./test/testfiles/resources_de-DE.properties");
        const resources = ir.getRepresentation();
        expect(resources.length).toBe(7);

        for (let i = 0; i < resources.length; i++) {
            expect(resources[i]).toStrictEqual(expected[i]); // `resource ${i}`
        }
    });

    test("PropertiesParserParseReadTargetFileWithSourceWithNoLocale", () => {
        expect.assertions(15);

        const parser = new PropertiesParser({
            filePath: "./test/testfiles/test_de-DE.properties",
            sourceLocale: "en-US"
        });
        expect(parser).toBeTruthy();

        const actual = parser.parse();
        expect(actual).toBeTruthy();

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

        expect(actual).toBeTruthy();
        expect(Array.isArray(actual)).toBeTruthy();
        expect(actual.length).toBe(1);

        const ir = actual[0];
        expect(ir.getType()).toBe("resource");
        expect(ir.getPath()).toBe("./test/testfiles/test_de-DE.properties");
        const resources = ir.getRepresentation();
        expect(resources.length).toBe(7);

        for (let i = 0; i < resources.length; i++) {
            expect(resources[i]).toStrictEqual(expected[i]); // `resource ${i}`
        }
    });

    test("PropertiesParserParseReadTargetFileWithNoSourceFile", () => {
        expect.assertions(15);

        const parser = new PropertiesParser({
            filePath: "./test/testfiles/test2_de-DE.properties",
            sourceLocale: "en-US"
        });
        expect(parser).toBeTruthy();

        const actual = parser.parse();
        expect(actual).toBeTruthy();

        // should give target-only resources
        const expected = [
            new ResourceString({
                sourceLocale: "en-US",
                targetLocale: "de-DE",
                target: "Umsetzung 1",
                key: "resource1",
                pathName: "./test/testfiles/test2_de-DE.properties",
                state: "new",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                targetLocale: "de-DE",
                target: "Umsetzung 2",
                key: "resource2",
                pathName: "./test/testfiles/test2_de-DE.properties",
                state: "new",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                targetLocale: "de-DE",
                target: "Umsetzung 3",
                key: "resource3",
                pathName: "./test/testfiles/test2_de-DE.properties",
                state: "new",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                targetLocale: "de-DE",
                target: "Umsetzung 4",
                key: "resource4",
                pathName: "./test/testfiles/test2_de-DE.properties",
                state: "new",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                targetLocale: "de-DE",
                target: "Umsetzung 5",
                key: "resource5",
                pathName: "./test/testfiles/test2_de-DE.properties",
                state: "new",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                targetLocale: "de-DE",
                target: "Umsetzung 6",
                key: "resource6",
                pathName: "./test/testfiles/test2_de-DE.properties",
                state: "new",
                comment: "this is a comment for resource6 which is ignored",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                targetLocale: "de-DE",
                target: "Umsetzung 7",
                key: "resource7",
                pathName: "./test/testfiles/test2_de-DE.properties",
                state: "new",
                datatype: "properties"
            })
        ];

        expect(actual).toBeTruthy();
        expect(Array.isArray(actual)).toBeTruthy();
        expect(actual.length).toBe(1);

        const ir = actual[0];
        expect(ir.getType()).toBe("resource");
        expect(ir.getPath()).toBe("./test/testfiles/test2_de-DE.properties");
        const resources = ir.getRepresentation();
        expect(resources.length).toBe(7);

        for (let i = 0; i < resources.length; i++) {
            expect(resources[i]).toStrictEqual(expected[i]); // resource ${i}`
        }
    });

    test("PropertiesParserParseReadTargetFileWithMissingSourceStrings", () => {
        expect.assertions(15);

        const parser = new PropertiesParser({
            filePath: "./test/testfiles/test2_de-DE.properties",
            sourceLocale: "en-US"
        });
        expect(parser).toBeTruthy();

        const actual = parser.parse();
        expect(actual).toBeTruthy();

        // should give target-only resources
        const expected = [
            new ResourceString({
                sourceLocale: "en-US",
                targetLocale: "de-DE",
                target: "Umsetzung 1",
                key: "resource1",
                pathName: "./test/testfiles/test2_de-DE.properties",
                state: "new",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                targetLocale: "de-DE",
                target: "Umsetzung 2",
                key: "resource2",
                pathName: "./test/testfiles/test2_de-DE.properties",
                state: "new",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                targetLocale: "de-DE",
                target: "Umsetzung 3",
                key: "resource3",
                pathName: "./test/testfiles/test2_de-DE.properties",
                state: "new",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                targetLocale: "de-DE",
                target: "Umsetzung 4",
                key: "resource4",
                pathName: "./test/testfiles/test2_de-DE.properties",
                state: "new",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                targetLocale: "de-DE",
                target: "Umsetzung 5",
                key: "resource5",
                pathName: "./test/testfiles/test2_de-DE.properties",
                state: "new",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                targetLocale: "de-DE",
                target: "Umsetzung 6",
                key: "resource6",
                pathName: "./test/testfiles/test2_de-DE.properties",
                state: "new",
                comment: "this is a comment for resource6 which is ignored",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                targetLocale: "de-DE",
                target: "Umsetzung 7",
                key: "resource7",
                pathName: "./test/testfiles/test2_de-DE.properties",
                state: "new",
                datatype: "properties"
            })
        ];

        expect(actual).toBeTruthy();
        expect(Array.isArray(actual)).toBeTruthy();
        expect(actual.length).toBe(1);

        const ir = actual[0];
        expect(ir.getType()).toBe("resource");
        expect(ir.getPath()).toBe("./test/testfiles/test2_de-DE.properties");
        const resources = ir.getRepresentation();
        expect(resources.length).toBe(7);

        for (let i = 0; i < resources.length; i++) {
            expect(resources[i]).toStrictEqual(expected[i]); // `resource ${i}`
        }
    });

    test("PropertiesParserParseSomeStringsHaveNoSource", () => {
        expect.assertions(15);

        const parser = new PropertiesParser({
            filePath: "./test/testfiles/test3_de-DE.properties",
            sourceLocale: "en-US"
        });
        expect(parser).toBeTruthy();

        const actual = parser.parse();
        expect(actual).toBeTruthy();

        const expected = [
            new ResourceString({
                sourceLocale: "en-US",
                targetLocale: "de-DE",
                target: "Umsetzung 1",
                key: "resource1",
                pathName: "./test/testfiles/test3_de-DE.properties",
                state: "new",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                source: "translation 2",
                targetLocale: "de-DE",
                target: "Umsetzung 2",
                key: "resource2",
                pathName: "./test/testfiles/test3_de-DE.properties",
                state: "new",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                source: "translation 3",
                targetLocale: "de-DE",
                target: "Umsetzung 3",
                key: "resource3",
                pathName: "./test/testfiles/test3_de-DE.properties",
                state: "new",
                comment: "comment for resource3",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                targetLocale: "de-DE",
                target: "Umsetzung 4",
                key: "resource4",
                pathName: "./test/testfiles/test3_de-DE.properties",
                state: "new",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                targetLocale: "de-DE",
                target: "Umsetzung 5",
                key: "resource5",
                pathName: "./test/testfiles/test3_de-DE.properties",
                state: "new",
                datatype: "properties"
            }),
            new ResourceString({
                sourceLocale: "en-US",
                source: "translation 6",
                targetLocale: "de-DE",
                target: "Umsetzung 6",
                key: "resource6",
                pathName: "./test/testfiles/test3_de-DE.properties",
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
                pathName: "./test/testfiles/test3_de-DE.properties",
                state: "new",
                datatype: "properties"
            })
        ];

        expect(actual).toBeTruthy();
        expect(Array.isArray(actual)).toBeTruthy();
        expect(actual.length).toBe(1);

        const ir = actual[0];
        expect(ir.getType()).toBe("resource");
        expect(ir.getPath()).toBe("./test/testfiles/test3_de-DE.properties");
        const resources = ir.getRepresentation();
        expect(resources.length).toBe(7);

        for (let i = 0; i < resources.length; i++) {
            expect(resources[i]).toStrictEqual(expected[i]); // `resource ${i}`
        }
    });
});
