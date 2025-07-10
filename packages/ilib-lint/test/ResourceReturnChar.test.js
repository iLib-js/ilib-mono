/*
 * ResourceReturnChar.test.js - Unit tests for ResourceReturnChar rule
 *
 * Copyright © 2023-2024 JEDLSoft
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

import ResourceReturnChar from "../src/rules/ResourceReturnChar.js";
import { ResourceString, ResourceArray, ResourcePlural } from 'ilib-tools-common';
import { IntermediateRepresentation, SourceFile } from 'ilib-lint-common';

describe("ResourceReturnChar rule", () => {
    test("constructs the rule", () => {
        const rule = new ResourceReturnChar();
        expect(rule.name).toBe("resource-return-char");
        expect(rule.description).toContain("return characters");
        expect(rule.type).toBe("resource");
    });

    test("LF return characters match", () => {
        const rule = new ResourceReturnChar();
        const resource = new ResourceString({
            key: "test.key",
            sourceLocale: "en-US",
            source: "Line 1\nLine 2\nLine 3",
            targetLocale: "de-DE",
            target: "Zeile 1\nZeile 2\nZeile 3",
            pathName: "test.xliff",
            lineNumber: 10
        });

        const result = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource: resource,
            file: resource.pathName
        });

        expect(result).toBeUndefined();
    });

    test("LF return characters mismatch triggers error", () => {
        const rule = new ResourceReturnChar();
        const resource = new ResourceString({
            key: "test.key",
            sourceLocale: "en-US",
            source: "Line 1\nLine 2\nLine 3",
            targetLocale: "de-DE",
            target: "Zeile 1\nZeile 2",
            pathName: "test.xliff",
            lineNumber: 10
        });

        const result = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource: resource,
            file: resource.pathName
        });

        expect(result).toBeTruthy();
        expect(result.severity).toBe("error");
        expect(result.description).toContain("source has 2 return character(s), target has 1");
        expect(result.highlight).toContain("Source has 2 return character(s), target has 1");
    });

    test("CRLF return characters match", () => {
        const rule = new ResourceReturnChar();
        const resource = new ResourceString({
            key: "test.key",
            sourceLocale: "en-US",
            source: "Line 1\r\nLine 2\r\nLine 3",
            targetLocale: "de-DE",
            target: "Zeile 1\r\nZeile 2\r\nZeile 3",
            pathName: "test.xliff",
            lineNumber: 10
        });

        const result = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource: resource,
            file: resource.pathName
        });

        expect(result).toBeUndefined();
    });

    test("CRLF return characters mismatch triggers error", () => {
        const rule = new ResourceReturnChar();
        const resource = new ResourceString({
            key: "test.key",
            sourceLocale: "en-US",
            source: "Line 1\r\nLine 2\r\nLine 3",
            targetLocale: "de-DE",
            target: "Zeile 1\r\nZeile 2",
            pathName: "test.xliff",
            lineNumber: 10
        });

        const result = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource: resource,
            file: resource.pathName
        });

        expect(result).toBeTruthy();
        expect(result.severity).toBe("error");
        expect(result.description).toContain("source has 2 return character(s), target has 1");
    });

    test("CR return characters match", () => {
        const rule = new ResourceReturnChar();
        const resource = new ResourceString({
            key: "test.key",
            sourceLocale: "en-US",
            source: "Line 1\rLine 2\rLine 3",
            targetLocale: "de-DE",
            target: "Zeile 1\rZeile 2\rZeile 3",
            pathName: "test.xliff",
            lineNumber: 10
        });

        const result = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource: resource,
            file: resource.pathName
        });

        expect(result).toBeUndefined();
    });

    test("CR return characters mismatch triggers error", () => {
        const rule = new ResourceReturnChar();
        const resource = new ResourceString({
            key: "test.key",
            sourceLocale: "en-US",
            source: "Line 1\rLine 2\rLine 3",
            targetLocale: "de-DE",
            target: "Zeile 1\rZeile 2",
            pathName: "test.xliff",
            lineNumber: 10
        });

        const result = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource: resource,
            file: resource.pathName
        });

        expect(result).toBeTruthy();
        expect(result.severity).toBe("error");
        expect(result.description).toContain("source has 2 return character(s), target has 1");
    });

    test("Mixed return characters (LF and CRLF) are counted correctly", () => {
        const rule = new ResourceReturnChar();
        const resource = new ResourceString({
            key: "test.key",
            sourceLocale: "en-US",
            source: "Line 1\nLine 2\r\nLine 3\nLine 4",
            targetLocale: "de-DE",
            target: "Zeile 1\nZeile 2\r\nZeile 3\nZeile 4",
            pathName: "test.xliff",
            lineNumber: 10
        });

        const result = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource: resource,
            file: resource.pathName
        });

        expect(result).toBeUndefined();
    });

    test("Mixed return characters mismatch triggers error", () => {
        const rule = new ResourceReturnChar();
        const resource = new ResourceString({
            key: "test.key",
            sourceLocale: "en-US",
            source: "Line 1\nLine 2\r\nLine 3\nLine 4",
            targetLocale: "de-DE",
            target: "Zeile 1\nZeile 2\r\nZeile 3",
            pathName: "test.xliff",
            lineNumber: 10
        });

        const result = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource: resource,
            file: resource.pathName
        });

        expect(result).toBeTruthy();
        expect(result.severity).toBe("error");
        expect(result.description).toContain("source has 3 return character(s), target has 2");
    });

    test("No return characters in either source or target", () => {
        const rule = new ResourceReturnChar();
        const resource = new ResourceString({
            key: "test.key",
            sourceLocale: "en-US",
            source: "Simple text without returns",
            targetLocale: "de-DE",
            target: "Einfacher Text ohne Zeilenumbrüche",
            pathName: "test.xliff",
            lineNumber: 10
        });

        const result = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource: resource,
            file: resource.pathName
        });

        expect(result).toBeUndefined();
    });

    test("Source has returns but target doesn't", () => {
        const rule = new ResourceReturnChar();
        const resource = new ResourceString({
            key: "test.key",
            sourceLocale: "en-US",
            source: "Line 1\nLine 2",
            targetLocale: "de-DE",
            target: "Zeile 1 Zeile 2",
            pathName: "test.xliff",
            lineNumber: 10
        });

        const result = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource: resource,
            file: resource.pathName
        });

        expect(result).toBeTruthy();
        expect(result.severity).toBe("error");
        expect(result.description).toContain("source has 1 return character(s), target has 0");
    });

    test("Target has returns but source doesn't", () => {
        const rule = new ResourceReturnChar();
        const resource = new ResourceString({
            key: "test.key",
            sourceLocale: "en-US",
            source: "Line 1 Line 2",
            targetLocale: "de-DE",
            target: "Zeile 1\nZeile 2",
            pathName: "test.xliff",
            lineNumber: 10
        });

        const result = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource: resource,
            file: resource.pathName
        });

        expect(result).toBeTruthy();
        expect(result.severity).toBe("error");
        expect(result.description).toContain("source has 0 return character(s), target has 1");
    });

    test("Empty strings do not trigger", () => {
        const rule = new ResourceReturnChar();
        const resource = new ResourceString({
            key: "test.key",
            sourceLocale: "en-US",
            source: "",
            targetLocale: "de-DE",
            target: "",
            pathName: "test.xliff",
            lineNumber: 10
        });

        const result = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource: resource,
            file: resource.pathName
        });

        expect(result).toBeUndefined();
    });

    test("Null or undefined strings do not trigger", () => {
        const rule = new ResourceReturnChar();
        const resource = new ResourceString({
            key: "test.key",
            sourceLocale: "en-US",
            source: null,
            targetLocale: "de-DE",
            target: undefined,
            pathName: "test.xliff",
            lineNumber: 10
        });

        const result = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource: resource,
            file: resource.pathName
        });

        expect(result).toBeUndefined();
    });

    test("Complex return character patterns are handled correctly", () => {
        const rule = new ResourceReturnChar();
        const resource = new ResourceString({
            key: "test.key",
            sourceLocale: "en-US",
            source: "Line 1\r\n\nLine 3\rLine 4\n\r\nLine 6",
            targetLocale: "de-DE",
            target: "Zeile 1\r\n\nZeile 3\rZeile 4\n\r\nZeile 6",
            pathName: "test.xliff",
            lineNumber: 10
        });

        const result = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource: resource,
            file: resource.pathName
        });

        expect(result).toBeUndefined();
    });

    test("Complex return character patterns mismatch triggers error", () => {
        const rule = new ResourceReturnChar();
        const resource = new ResourceString({
            key: "test.key",
            sourceLocale: "en-US",
            source: "Line 1\r\n\nLine 3\rLine 4\n\r\nLine 6",
            targetLocale: "de-DE",
            target: "Zeile 1\r\n\nZeile 3\rZeile 4\n",
            pathName: "test.xliff",
            lineNumber: 10
        });

        const result = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource: resource,
            file: resource.pathName
        });

        expect(result).toBeTruthy();
        expect(result.severity).toBe("error");
        expect(result.description).toContain("source has 5 return character(s), target has 4");
    });

    test("ResourceArray with matching return characters", () => {
        const rule = new ResourceReturnChar();
        const resource = new ResourceArray({
            key: "test.array",
            sourceLocale: "en-US",
            source: ["Line 1\nLine 2", "Line 3\nLine 4"],
            targetLocale: "de-DE",
            target: ["Zeile 1\nZeile 2", "Zeile 3\nZeile 4"],
            pathName: "test.xliff",
            lineNumber: 10
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("test.xliff", {}),
            dirty: false
        });

        const result = rule.match({ir, file: "test.xliff"});

        expect(result).toBeUndefined();
    });

    test("ResourceArray with mismatched return characters", () => {
        const rule = new ResourceReturnChar();
        const resource = new ResourceArray({
            key: "test.array",
            sourceLocale: "en-US",
            source: ["Line 1\nLine 2", "Line 3\nLine 4"],
            targetLocale: "de-DE",
            target: ["Zeile 1\nZeile 2", "Zeile 3"],
            pathName: "test.xliff",
            lineNumber: 10
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("test.xliff", {}),
            dirty: false
        });

        const result = rule.match({ir, file: "test.xliff"});

        expect(result).toBeTruthy();
        // Result can be a single object or an array
        const results = Array.isArray(result) ? result : [result];
        expect(results.length).toBe(1);
        expect(results[0].severity).toBe("error");
        expect(results[0].description).toContain("source has 1 return character(s), target has 0");
    });

    test("ResourceArray with multiple mismatched return characters", () => {
        const rule = new ResourceReturnChar();

        const resource = new ResourceArray({
            key: "test.array",
            sourceLocale: "en-US",
            source: ["Line 1\nLine 2", "Line 3\nLine 4", "Line 5"],
            targetLocale: "de-DE",
            target: ["Zeile 1\nZeile 2", "Zeile 3", "Zeile 5\nZeile 6"],
            pathName: "test.xliff",
            lineNumber: 10
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("test.xliff", {}),
            dirty: false
        });

        const result = rule.match({ir, file: "test.xliff"});

        expect(result).toBeTruthy();
        // Result can be a single object or an array
        const results = Array.isArray(result) ? result : [result];
        expect(results.length).toBe(2);

        // First mismatch: source has 1 return, target has 0
        expect(results[0].severity).toBe("error");
        expect(results[0].description).toContain("source has 1 return character(s), target has 0");

        // Second mismatch: source has 0 returns, target has 1
        expect(results[1].severity).toBe("error");
        expect(results[1].description).toContain("source has 0 return character(s), target has 1");
    });

    test("ResourcePlural with matching return characters", () => {
        const rule = new ResourceReturnChar();
        const resource = new ResourcePlural({
            key: "test.plural",
            sourceLocale: "en-US",
            source: {
                one: "Line 1\nLine 2",
                other: "Lines 1\nLines 2\nLines 3"
            },
            targetLocale: "de-DE",
            target: {
                one: "Zeile 1\nZeile 2",
                other: "Zeilen 1\nZeilen 2\nZeilen 3"
            },
            pathName: "test.xliff",
            lineNumber: 10
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("test.xliff", {}),
            dirty: false
        });

        const result = rule.match({ir, file: "test.xliff"});

        expect(result).toBeUndefined();
    });

    test("ResourcePlural with mismatched return characters", () => {
        const rule = new ResourceReturnChar();
        const resource = new ResourcePlural({
            key: "test.plural",
            sourceLocale: "en-US",
            source: {
                one: "Line 1\nLine 2",
                other: "Lines 1\nLines 2\nLines 3"
            },
            targetLocale: "de-DE",
            target: {
                one: "Zeile 1\nZeile 2",
                other: "Zeilen 1\nZeilen 2"
            },
            pathName: "test.xliff",
            lineNumber: 10
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("test.xliff", {}),
            dirty: false
        });

        const result = rule.match({ir, file: "test.xliff"});

        expect(result).toBeTruthy();
        // Result can be a single object or an array
        const results = Array.isArray(result) ? result : [result];
        expect(results.length).toBe(1);
        expect(results[0].severity).toBe("error");
        expect(results[0].description).toContain("source has 2 return character(s), target has 1");
    });

    test("ResourcePlural with multiple mismatched return characters", () => {
        const rule = new ResourceReturnChar();
        const resource = new ResourcePlural({
            key: "test.plural",
            sourceLocale: "en-US",
            source: {
                one: "Line 1\nLine 2",
                other: "Lines 1\nLines 2\nLines 3"
            },
            targetLocale: "de-DE",
            target: {
                one: "Zeile 1",
                other: "Zeilen 1\nZeilen 2\nZeilen 3\nZeilen 4"
            },
            pathName: "test.xliff",
            lineNumber: 10
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("test.xliff", {}),
            dirty: false
        });

        const result = rule.match({ir, file: "test.xliff"});

        expect(result).toBeTruthy();
        // Result can be a single object or an array
        const results = Array.isArray(result) ? result : [result];
        expect(results.length).toBe(2);

        // First mismatch: source has 1 return, target has 0
        expect(results[0].severity).toBe("error");
        expect(results[0].description).toContain("source has 1 return character(s), target has 0");

        // Second mismatch: source has 2 returns, target has 3
        expect(results[1].severity).toBe("error");
        expect(results[1].description).toContain("source has 2 return character(s), target has 3");
    });

    test("ResourcePlural with mixed return character types", () => {
        const rule = new ResourceReturnChar();
        const resource = new ResourcePlural({
            key: "test.plural",
            sourceLocale: "en-US",
            source: {
                one: "Line 1\r\nLine 2",
                other: "Lines 1\nLines 2\r\nLines 3"
            },
            targetLocale: "de-DE",
            target: {
                one: "Zeile 1\r\nZeile 2",
                other: "Zeilen 1\nZeilen 2\r\nZeilen 3"
            },
            pathName: "test.xliff",
            lineNumber: 10
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("test.xliff", {}),
            dirty: false
        });

        const result = rule.match({ir, file: "test.xliff"});

        expect(result).toBeUndefined();
    });

    test("ResourcePlural with mixed return character type mismatch", () => {
        const rule = new ResourceReturnChar();
        const resource = new ResourcePlural({
            key: "test.plural",
            sourceLocale: "en-US",
            source: {
                one: "Line 1\r\nLine 2",
                other: "Lines 1\nLines 2\r\nLines 3"
            },
            targetLocale: "de-DE",
            target: {
                one: "Zeile 1\r\nZeile 2",
                other: "Zeilen 1\nZeilen 2"
            },
            pathName: "test.xliff",
            lineNumber: 10
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("test.xliff", {}),
            dirty: false
        });

        const result = rule.match({ir, file: "test.xliff"});

        expect(result).toBeTruthy();
        // Result can be a single object or an array
        const results = Array.isArray(result) ? result : [result];
        expect(results.length).toBe(1);
        expect(results[0].severity).toBe("error");
        expect(results[0].description).toContain("source has 2 return character(s), target has 1");
    });
});