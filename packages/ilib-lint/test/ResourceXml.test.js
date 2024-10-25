/*
 * ResourceXML.test.js - test the rule that checks XML matching
 *
 * Copyright © 2024 JEDLSoft
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
import { IntermediateRepresentation, Result, SourceFile } from 'ilib-lint-common';

import ResourceXML from "../src/rules/ResourceXML.js";

const sourceFile = new SourceFile("a/b/c.xliff", {});

describe("testResourceXML", () => {
    test("ResourceXML", () => {
        expect.assertions(1);

        const rule = new ResourceXML();
        expect(rule).toBeTruthy();
    });

    test("ResourceXMLName", () => {
        expect.assertions(2);

        const rule = new ResourceXML();
        expect(rule).toBeTruthy();

        expect(rule.getName()).toBe("resource-xml");
    });

    test("ResourceXMLDescription", () => {
        expect.assertions(2);

        const rule = new ResourceXML();
        expect(rule).toBeTruthy();

        expect(rule.getDescription()).toBe("Ensure that XML in translated resources match the source");
    });

    test("ResourceXMLSourceLocale", () => {
        expect.assertions(2);

        const rule = new ResourceXML({
            sourceLocale: "de-DE"
        });
        expect(rule).toBeTruthy();

        expect(rule.getSourceLocale()).toBe("de-DE");
    });

    test("ResourceXMLGetRuleType", () => {
        expect.assertions(2);

        const rule = new ResourceXML({
            sourceLocale: "de-DE"
        });
        expect(rule).toBeTruthy();

        expect(rule.getRuleType()).toBe("resource");
    });

    test("ResourceXML match simple no problems", () => {
        expect.assertions(2);

        const rule = new ResourceXML();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "xml.test",
            sourceLocale: "en-US",
            source: 'This string contains <c0>xml tags</c0> in it.',
            targetLocale: "de-DE",
            target: "Diese Zeichenfolge enthält <c0>xml</c0>.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeUndefined();
    });

    test("ResourceXML match complicated no problems", () => {
        expect.assertions(2);

        const rule = new ResourceXML();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "xml.test",
            sourceLocale: "en-US",
            source: 'This string contains <c0><b>xml</b> tags</c0> in it.',
            targetLocale: "de-DE",
            target: "Diese Zeichenfolge enthält <c0><b>xml</b> Elementer</c0>.",
            pathName: "a/b/c.xliff"
        });
debugger;
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeUndefined();
    });

    test("ResourceXML match no xml", () => {
        expect.assertions(2);

        const rule = new ResourceXML();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "xml.test",
            sourceLocale: "en-US",
            source: 'This string does not contains xml tags in it.',
            targetLocale: "de-DE",
            target: "Diese Zeichenfolge enthält kein xml.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeUndefined();
    });

    test("ResourceXML match with unclosed HTML tags", () => {
        expect.assertions(2);

        const rule = new ResourceXML();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "xml.test",
            sourceLocale: "en-US",
            source: 'This string contains <p>two paragraphs and a <br>line break in it.',
            targetLocale: "de-DE",
            target: "Diese Zeichenfolge enthält <p>zwei Absätze und ein <br> drin.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeUndefined();
    });

    test("ResourceXML does not match with missing unclosed HTML tags", () => {
        expect.assertions(2);

        const rule = new ResourceXML();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "xml.test",
            sourceLocale: "en-US",
            source: 'This string contains <p>two paragraphs in it.',
            targetLocale: "de-DE",
            target: "Diese Zeichenfolge enthält nur eine Absätz.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        const expected = new Result({
            severity: "error",
            description: "The number of XML <p> elements in the target (0) does not match the number in the source (1).",
            id: "xml.test",
            source: 'This string contains <p>two paragraphs in it.',
            highlight: 'Target: Diese Zeichenfolge enthält nur eine Absätz.<e0/>',
            rule,
            locale: "de-DE",
            pathName: "a/b/c.xliff"
        });
        expect(actual).toStrictEqual(expected);
    });

    test("ResourceXML not well-formed xml in target, bad tag syntax", () => {
        expect.assertions(2);

        const rule = new ResourceXML();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "xml.test",
            sourceLocale: "en-US",
            source: 'This string contains <p>xml tags</p> in it.',
            targetLocale: "de-DE",
            target: "Diese Zeichenfolge enthält <>pxml</>p.",
            pathName: "a/b/c.xliff"
        });
debugger;
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // if the source contains XML tags, the target must too
        const expected = [
            new Result({
                severity: "error",
                description: "Empty XML elements <> and </> are not allowed in the target.",
                id: "xml.test",
                source: 'This string contains <p>xml tags</p> in it.',
                highlight: 'Target: Diese Zeichenfolge enthält <e0><></e0>pxml<e0></></e0>p.',
                rule,
                locale: "de-DE",
                pathName: "a/b/c.xliff"
            }),
            new Result({
                severity: "error",
                description: "XML in translation is not well-formed. Error: Unmatched closing tag: p.",
                id: "xml.test",
                source: 'This string contains <p>xml tags</p> in it.',
                highlight: 'Target: Diese Zeichenfolge enthält <>pxml</>p.<e0/>',
                rule,
                locale: "de-DE",
                pathName: "a/b/c.xliff"
            })
        ];

        expect(actual).toStrictEqual(expected);
    });

    test("ResourceXML not well-formed xml in target, not nested properly", () => {
        expect.assertions(2);

        const rule = new ResourceXML();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "xml.test",
            sourceLocale: "en-US",
            source: 'This string contains <c0><b>xml</b> tags</c0> in it.',
            targetLocale: "de-DE",
            target: "Diese Zeichenfolge enthält <c0><b>xml</c0></b>.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // the target should have properly nested xml tags
        const expected = new Result({
            severity: "error",
            description: "XML in translation is not well-formed. Error: Unmatched closing tag: b",
            id: "xml.test",
            source: 'This string contains <c0><b>xml</b> tags</c0> in it.',
            highlight: 'Target: Diese Zeichenfolge enthält <c0><b>xml</c0></b><e0>.</e0>',
            rule,
            locale: "de-DE",
            pathName: "a/b/c.xliff"
        });
        expect(actual).toStrictEqual(expected);
    });

    test("ResourceXML do not match simple tag", () => {
        expect.assertions(2);

        const rule = new ResourceXML();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "xml.test",
            sourceLocale: "en-US",
            source: 'This string contains <c0>xml tags</c0> in it.',
            targetLocale: "de-DE",
            target: "Diese Zeichenfolge enthält <c>xml</c>.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // if the source contains XML tags, the target must too
        const expected = [
            new Result({
                severity: "error",
                description: "The number of XML <c0> elements in the target (0) does not match the number in the source (1).",
                id: "xml.test",
                source: 'This string contains <c0>xml tags</c0> in it.',
                highlight: 'Target: Diese Zeichenfolge enthält <c>xml</c>.<e0/>',
                rule,
                locale: "de-DE",
                pathName: "a/b/c.xliff"
            }),
            new Result({
                severity: "error",
                description: "The XML element <c> in the target does not appear in the source.",
                id: "xml.test",
                source: 'This string contains <c0>xml tags</c0> in it.',
                highlight: 'Target: Diese Zeichenfolge enthält <e0><c></e0>xml<e0></c></e0>.',
                rule,
                locale: "de-DE",
                pathName: "a/b/c.xliff"
            })
        ];
        expect(actual).toStrictEqual(expected);
    });

    test("ResourceXML match multiple tags, one does not match", () => {
        expect.assertions(2);

        const rule = new ResourceXML();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "xml.test",
            sourceLocale: "en-US",
            source: 'This <b>string</b> contains <c0>xml tags</c0> in it.',
            targetLocale: "de-DE",
            target: "Diese <b>Zeichenfolge</b> enthält <c>xml</c>.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
debugger;
        // if the source contains XML tags, the target must too
        const expected = [
            new Result({
                severity: "error",
                description: "The number of XML <c0> elements in the target (0) does not match the number in the source (1).",
                id: "xml.test",
                source: 'This <b>string</b> contains <c0>xml tags</c0> in it.',
                highlight: 'Target: Diese <b>Zeichenfolge</b> enthält <c>xml</c>.<e0/>',
                rule,
                locale: "de-DE",
                pathName: "a/b/c.xliff"
            }),
            new Result({
                severity: "error",
                description: "The XML element <c> in the target does not appear in the source.",
                id: "xml.test",
                source: 'This <b>string</b> contains <c0>xml tags</c0> in it.',
                highlight: 'Target: Diese <b>Zeichenfolge</b> enthält <e0><c></e0>xml<e0></c></e0>.',
                rule,
                locale: "de-DE",
                pathName: "a/b/c.xliff"
            })
        ];
        expect(actual).toStrictEqual(expected);
    });

    test("ResourceXML match multiple tags where all do not match", () => {
        expect.assertions(2);

        const rule = new ResourceXML();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "xml.test",
            sourceLocale: "en-US",
            source: 'This <b>string</b> contains <c0>xml tags</c0> in it.',
            targetLocale: "de-DE",
            target: "Diese <x>Zeichenfolge</x> enthält <c>xml</c>.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // if the source contains XML tags, the target must too
        const expected = [
            new Result({
                severity: "error",
                description: "The number of XML <b> elements in the target (0) does not match the number in the source (1).",
                id: "xml.test",
                source: 'This <b>string</b> contains <c0>xml tags</c0> in it.',
                highlight: 'Target: Diese <x>Zeichenfolge</x> enthält <c>xml</c>.<e0/>',
                rule,
                locale: "de-DE",
                pathName: "a/b/c.xliff"
            }),
            new Result({
                severity: "error",
                description: "The number of XML <c0> elements in the target (0) does not match the number in the source (1).",
                id: "xml.test",
                source: 'This <b>string</b> contains <c0>xml tags</c0> in it.',
                highlight: 'Target: Diese <x>Zeichenfolge</x> enthält <c>xml</c>.<e0/>',
                rule,
                locale: "de-DE",
                pathName: "a/b/c.xliff"
            }),
            new Result({
                severity: "error",
                description: "The XML element <x> in the target does not appear in the source.",
                id: "xml.test",
                source: 'This <b>string</b> contains <c0>xml tags</c0> in it.',
                highlight: 'Target: Diese <e0><x></e0>Zeichenfolge<e0></x></e0> enthält <c>xml</c>.',
                rule,
                locale: "de-DE",
                pathName: "a/b/c.xliff"
            }),
            new Result({
                severity: "error",
                description: "The XML element <c> in the target does not appear in the source.",
                id: "xml.test",
                source: 'This <b>string</b> contains <c0>xml tags</c0> in it.',
                highlight: 'Target: Diese <x>Zeichenfolge</x> enthält <e0><c></e0>xml<e0></c></e0>.',
                rule,
                locale: "de-DE",
                pathName: "a/b/c.xliff"
            })
        ];
        expect(actual).toStrictEqual(expected);
    });

    test("ResourceXML match multiple tags, one is missing", () => {
        expect.assertions(2);

        const rule = new ResourceXML();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "xml.test",
            sourceLocale: "en-US",
            source: 'This <b>string</b> contains <c0>xml tags</c0> in it.',
            targetLocale: "de-DE",
            target: "Diese Zeichenfolge enthält <c>xml</c>.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // if the source contains XML tags, the target must too
        const expected = [
            new Result({
                severity: "error",
                description: "The number of XML <b> elements in the target (0) does not match the number in the source (1).",
                id: "xml.test",
                source: 'This <b>string</b> contains <c0>xml tags</c0> in it.',
                highlight: 'Target: Diese Zeichenfolge enthält <c>xml</c>.<e0/>',
                rule,
                locale: "de-DE",
                pathName: "a/b/c.xliff"
            }),
            new Result({
                severity: "error",
                description: "The number of XML <c0> elements in the target (0) does not match the number in the source (1).",
                id: "xml.test",
                source: 'This <b>string</b> contains <c0>xml tags</c0> in it.',
                highlight: 'Target: Diese Zeichenfolge enthält <c>xml</c>.<e0/>',
                rule,
                locale: "de-DE",
                pathName: "a/b/c.xliff"
            }),
            new Result({
                severity: "error",
                description: "The XML element <c> in the target does not appear in the source.",
                id: "xml.test",
                source: 'This <b>string</b> contains <c0>xml tags</c0> in it.',
                highlight: 'Target: Diese Zeichenfolge enthält <e0><c></e0>xml<e0></c></e0>.',
                rule,
                locale: "de-DE",
                pathName: "a/b/c.xliff"
            })
        ];
        expect(actual).toStrictEqual(expected);
    });

    test("ResourceXML match tags with attributes", () => {
        expect.assertions(2);

        const rule = new ResourceXML();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "xml.test",
            sourceLocale: "en-US",
            source: 'This string contains <a href="url">xml tags</a> in it.',
            targetLocale: "de-DE",
            target: 'Diese Zeichenfolge enthält <a href="url">xml</a>.',
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(actual).toBeUndefined();
    });

    test("ResourceXML do not match empty tags", () => {
        expect.assertions(2);

        const rule = new ResourceXML();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "xml.test",
            sourceLocale: "en-US",
            source: 'This string contains <c0>xml tags</c0> in it.',
            targetLocale: "de-DE",
            target: "Diese Zeichenfolge enthält <>c0xml</>c0.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // if the source contains XML tags, the target must too
        const expected = [
            new Result({
                severity: "error",
                description: "Empty XML elements <> and </> are not allowed in the target.",
                id: "xml.test",
                source: 'This string contains <c0>xml tags</c0> in it.',
                highlight: 'Target: Diese Zeichenfolge enthält <e0><></e0>c0xml<e0></></e0>c0.',
                rule,
                locale: "de-DE",
                pathName: "a/b/c.xliff"
            }),
            new Result({
                severity: "error",
                description: "XML in translation is not well-formed. Error: Unmatched closing tag: c0.",
                id: "xml.test",
                source: 'This string contains <c0>xml tags</c0> in it.',
                highlight: 'Target: Diese Zeichenfolge enthält <>c0xml</>c0.<e0/>',
                rule,
                locale: "de-DE",
                pathName: "a/b/c.xliff"
            })
        ];
        expect(actual).toStrictEqual(expected);
    });
});

