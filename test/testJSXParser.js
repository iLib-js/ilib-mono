/*
 * testJSXParser.js - test the React JSX parser
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

import JSXParser from '../src/parsers/JSXParser.js';

import { Result } from 'i18nlint-common';

export const testJSXParser = {
    testJSXParserConstructorEmpty: function(test) {
        test.expect(1);

        const parser = new JSXParser();
        test.ok(parser);

        test.done();
    },

    testJSXParserConstructorPath: function(test) {
        test.expect(1);

        const parser = new JSXParser({
            filePath: "./test/testfiles/test.jsx"
        });
        test.ok(parser);

        test.done();
    },

    testJSXParserGetDescription: function(test) {
        test.expect(2);

        const parser = new JSXParser();
        test.ok(parser);

        test.equal(parser.getDescription(), "A parser for React JSX files.");

        test.done();
    },

    testJSXParserGetName: function(test) {
        test.expect(2);

        const parser = new JSXParser();
        test.ok(parser);

        test.equal(parser.getName(), "jsx");

        test.done();
    },

    testJSXParserGetExtensions: function(test) {
        test.expect(2);

        const parser = new JSXParser();
        test.ok(parser);

        test.deepEqual(parser.getExtensions(), [ "jsx" ]);

        test.done();
    },

    testJSXParserSimple: function(test) {
        test.expect(3);

        const parser = new JSXParser();
        test.ok(parser);

        const actual = parser.parseString("import foo from '../src/index.js';", "x/y");
        test.ok(actual);

        const expected = {
            type: "ast-jstree",
            ir: {
                type: 'Program',
                start: 0,
                end: 34,
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 34 }
                },
                body: [
                    {
                        type: 'ImportDeclaration',
                        start: 0,
                        end: 34,
                        loc: {
                            start: { line: 1, column: 0 },
                            end: { line: 1, column: 34 }
                        },
                        specifiers: [
                            {
                                type: 'ImportDefaultSpecifier',
                                start: 7,
                                end: 10,
                                loc: {
                                    start: { line: 1, column: 7 },
                                    end: { line: 1, column: 10 }
                                },
                                local: {
                                    type: 'Identifier',
                                    start: 7,
                                    end: 10,
                                    loc: {
                                        start: { line: 1, column: 7 },
                                        end: { line: 1, column: 10 }
                                    },
                                    name: 'foo'
                                }
                            }
                        ],
                        source: {
                            type: 'Literal',
                            start: 16,
                            end: 33,
                            loc: {
                                start: { line: 1, column: 16 },
                                end: { line: 1, column: 33 }
                            },
                            value: '../src/index.js',
                            raw: "'../src/index.js'"
                        }
                    }
                ],
                sourceType: 'module'
            },
            filePath: "x/y",
            stats: undefined
        };
        test.deepEqual(actual, expected);

        test.done();
    },

    testJSXParserMoreComplex: function(test) {
        test.expect(3);

        const parser = new JSXParser();
        test.ok(parser);

        const actual = parser.parseString(
            `// comment
            import foo from '../src/index.js';

            const str = <b>String</b>;
            `, "x/y");
        test.ok(actual);

        const expected = {
            type: "ast-jstree",
            ir: {
                "type": "Program",
                "start": 0,
                "end": 110,
                "loc": {
                    "start": { "line": 1, "column": 0 },
                    "end": { "line": 5, "column": 12 }
                },
                "body": [
                    {
                        "type": "ImportDeclaration",
                        "start": 23,
                        "end": 57,
                        "loc": {
                            "start": { "line": 2, "column": 12 },
                            "end": { "line": 2, "column": 46 }
                        },
                        "specifiers": [
                            {
                                "type": "ImportDefaultSpecifier",
                                "start": 30,
                                "end": 33,
                                "loc": {
                                    "start": { "line": 2, "column": 19 },
                                    "end": { "line": 2, "column": 22 }
                                },
                                "local": {
                                    "type": "Identifier",
                                    "start": 30,
                                    "end": 33,
                                    "loc": {
                                        "start": { "line": 2, "column": 19 },
                                        "end": { "line": 2, "column": 22 }
                                    },
                                    "name": "foo"
                                }
                            }
                        ],
                        "source": {
                            "type": "Literal",
                            "start": 39,
                            "end": 56,
                            "loc": {
                                "start": { "line": 2, "column": 28 },
                                "end": { "line": 2, "column": 45 }
                            },
                            "value": "../src/index.js",
                            "raw": "'../src/index.js'"
                        }
                    },
                    {
                        "type": "VariableDeclaration",
                        "start": 71,
                        "end": 97,
                        "loc": {
                            "start": { "line": 4, "column": 12 },
                            "end": { "line": 4, "column": 38 }
                        },
                        "declarations": [
                            {
                                "type": "VariableDeclarator",
                                "start": 77,
                                "end": 96,
                                "loc": {
                                    "start": { "line": 4, "column": 18 },
                                    "end": { "line": 4, "column": 37 }
                                },
                                "id": {
                                    "type": "Identifier",
                                    "start": 77,
                                    "end": 80,
                                    "loc": {
                                        "start": { "line": 4, "column": 18 },
                                        "end": { "line": 4, "column": 21 }
                                    },
                                    "name": "str"
                                },
                                "init": {
                                    "type": "JSXElement",
                                    "start": 83,
                                    "end": 96,
                                    "loc": {
                                        "start": { "line": 4, "column": 24 },
                                        "end": { "line": 4, "column": 37 }
                                    },
                                    "openingElement": {
                                        "type": "JSXOpeningElement",
                                        "start": 83,
                                        "end": 86,
                                        "loc": {
                                            "start": { "line": 4, "column": 24 },
                                            "end": { "line": 4, "column": 27 }
                                        },
                                        "attributes": [],
                                        "name": {
                                            "type": "JSXIdentifier",
                                            "start": 84,
                                            "end": 85,
                                            "loc": {
                                                "start": { "line": 4, "column": 25 },
                                                "end": { "line": 4, "column": 26 }
                                            },
                                            "name": "b"
                                        },
                                        "selfClosing": false
                                    },
                                    "closingElement": {
                                        "type": "JSXClosingElement",
                                        "start": 92,
                                        "end": 96,
                                        "loc": {
                                            "start": { "line": 4, "column": 33 },
                                            "end": { "line": 4, "column": 37 }
                                        },
                                        "name": {
                                            "type": "JSXIdentifier",
                                            "start": 94,
                                            "end": 95,
                                            "loc": {
                                                "start": { "line": 4, "column": 35 },
                                                "end": { "line": 4, "column": 36 }
                                            },
                                            "name": "b"
                                        }
                                    },
                                    "children": [
                                        {
                                            "type": "JSXText",
                                            "start": 86,
                                            "end": 92,
                                            "loc": {
                                                "start": { "line": 4, "column": 27 },
                                                "end": { "line": 4, "column": 33 }
                                            },
                                            "value": "String",
                                            "raw": "String"
                                        }
                                    ]
                                }
                            }
                        ],
                        "kind": "const"
                    }
                ],
                "sourceType": "module"
            },
            filePath: "x/y",
            stats: undefined
        };
        test.deepEqual(actual, expected);

        test.done();
    },
};

