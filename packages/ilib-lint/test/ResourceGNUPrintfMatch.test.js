/*
 * ResourceGNUPrintfMatch.test.js - test the GNU printf parameter matching rule
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

import { Result } from 'ilib-lint-common';
import { IntermediateRepresentation, SourceFile } from 'ilib-lint-common';
import { ResourceString, ResourceArray, ResourcePlural, Location } from 'ilib-tools-common';
import ResourceGNUPrintfMatch from '../src/rules/ResourceGNUPrintfMatch.js';

describe("testResourceGNUPrintfMatch", () => {
    // Test basic functionality
    test("should create rule instance", () => {
        expect.assertions(1);

        const rule = new ResourceGNUPrintfMatch();
        expect(rule).toBeTruthy();
    });

    // Test basic GNU printf parameter matching
    test("should match identical GNU printf parameters", () => {
        expect.assertions(1);

        const rule = new ResourceGNUPrintfMatch();
        const resource = new ResourceString({
            key: "printf.test",
            sourceLocale: "en-US",
            source: 'Hello %1$s, you have %2$d items.',
            targetLocale: "de-DE",
            target: 'Hallo %1$s, Sie haben %2$d Artikel.',
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

    // Test missing parameters in target
    test("should report missing parameters in target", () => {
        expect.assertions(3);

        const rule = new ResourceGNUPrintfMatch();
        const resource = new ResourceString({
            key: "printf.test",
            sourceLocale: "en-US",
            source: 'Hello %1$s, you have %2$d items.',
            targetLocale: "de-DE",
            target: 'Hallo %1$s, Sie haben Artikel.',
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
            description: "Source string GNU printf parameter %2$d not found in the target string.",
            rule,
            id: "printf.test",
            source: 'Hello %1$s, you have %2$d items.',
            highlight: '<e0>Hallo %1$s, Sie haben Artikel.</e0>',
            pathName: "a/b/c.xliff"
        });
        expect(Array.isArray(actual)).toBeTruthy();
        expect(actual && Array.isArray(actual) && actual.length).toBe(1);
        expect(actual && Array.isArray(actual) && actual[0]).toStrictEqual(expected);
    });

    // Test extra parameters in target
    test("should report extra parameters in target", () => {
        expect.assertions(3);

        const rule = new ResourceGNUPrintfMatch();
        const resource = new ResourceString({
            key: "printf.test",
            sourceLocale: "en-US",
            source: 'This string contains no parameters.',
            targetLocale: "de-DE",
            target: 'Diese Zeichenfolge enthält %1$d Parameter.',
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
            description: "Extra target string GNU printf parameter %1$d not found in the source string.",
            rule,
            id: "printf.test",
            source: 'This string contains no parameters.',
            highlight: 'Diese Zeichenfolge enthält <e0>%1$d</e0> Parameter.',
            pathName: "a/b/c.xliff"
        });
        expect(Array.isArray(actual)).toBeTruthy();
        expect(actual && Array.isArray(actual) && actual.length).toBe(1);
        expect(actual && Array.isArray(actual) && actual[0]).toStrictEqual(expected);
    });

    // Test both missing and extra parameters
    test("should report both missing and extra parameters", () => {
        expect.assertions(4);

        const rule = new ResourceGNUPrintfMatch();
        const resource = new ResourceString({
            key: "printf.test",
            sourceLocale: "en-US",
            source: 'Hello %1$s, you have %2$d items.',
            targetLocale: "de-DE",
            target: 'Hallo %1$s, Sie haben %1$f Artikel.',
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should report that %2$d is missing in the target and %1$f is extra in the target
        expect(Array.isArray(actual)).toBeTruthy();
        expect(actual && Array.isArray(actual) && actual.length).toBe(2);
        const descriptions = Array.isArray(actual) ? actual.map(r => r.description) : [];
        expect(descriptions).toContain("Source string GNU printf parameter %2$d not found in the target string.");
        expect(descriptions).toContain("Extra target string GNU printf parameter %1$f not found in the source string.");
    });

    // Test GNU printf format specifiers
    test("should handle various GNU printf format specifiers", () => {
        expect.assertions(1);

        const rule = new ResourceGNUPrintfMatch();
        const resource = new ResourceString({
            key: "printf.test",
            sourceLocale: "en-US",
            source: 'Value: %1$d, Float: %2$f, String: %3$s, Hex: %4$x',
            targetLocale: "de-DE",
            target: 'Wert: %1$d, Float: %2$f, String: %3$s, Hex: %4$x',
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

    // Test width and precision from arguments
    test("should handle width and precision from arguments", () => {
        expect.assertions(1);

        const rule = new ResourceGNUPrintfMatch();
        const resource = new ResourceString({
            key: "printf.test",
            sourceLocale: "en-US",
            source: 'Width: %*d, Precision: %.*f, Both: %*.*f',
            targetLocale: "de-DE",
            target: 'Breite: %*d, Präzision: %.*f, Beide: %*.*f',
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

    // Test GNU extensions
    test("should handle GNU printf extensions", () => {
        expect.assertions(1);

        const rule = new ResourceGNUPrintfMatch();
        const resource = new ResourceString({
            key: "printf.test",
            sourceLocale: "en-US",
            source: 'Octal: %1$o, Binary: %2$b, Pointer: %3$p',
            targetLocale: "de-DE",
            target: 'Oktal: %1$o, Binär: %2$b, Zeiger: %3$p',
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

    // Test flags and modifiers
    test("should handle flags and modifiers", () => {
        expect.assertions(1);

        const rule = new ResourceGNUPrintfMatch();
        const resource = new ResourceString({
            key: "printf.test",
            sourceLocale: "en-US",
            source: 'Left: %-10s, Zero: %05d, Plus: %+d',
            targetLocale: "de-DE",
            target: 'Links: %-10s, Null: %05d, Plus: %+d',
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

    // Test no parameters case
    test("should handle strings with no parameters", () => {
        expect.assertions(1);

        const rule = new ResourceGNUPrintfMatch();
        const resource = new ResourceString({
            key: "printf.test",
            sourceLocale: "en-US",
            source: 'This string has no parameters.',
            targetLocale: "de-DE",
            target: 'Diese Zeichenfolge hat keine Parameter.',
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

    // Test array resources
    test("should handle array resources correctly", () => {
        expect.assertions(1);

        const rule = new ResourceGNUPrintfMatch();
        const resource = new ResourceArray({
            key: "printf.array.test",
            sourceLocale: "en-US",
            source: [
                "Hello %1$s, you have %2$d items.",
                "Goodbye %1$s, you had %2$d items."
            ],
            targetLocale: "de-DE",
            target: [
                "Hallo %1$s, Sie haben %2$d Artikel.",
                "Auf Wiedersehen %1$s, Sie hatten %2$d Artikel."
            ],
            pathName: "a/b/c.xliff"
        });

        // Test that ResourceRule.match() automatically handles array matching
        const sourceFile = new SourceFile("a/b/c.xliff", {
            getLogger: () => ({ debug: () => {}, info: () => {}, warn: () => {}, error: () => {} })
        });
        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile
        });
        const actual = rule.match({
            ir,
            file: "a/b/c.xliff"
        });

        // Should pass because all parameters match correctly
        expect(actual).toBeUndefined();
    });

    // Test plural resources
    test("should handle plural resources correctly", () => {
        expect.assertions(1);

        const rule = new ResourceGNUPrintfMatch();
        const resource = new ResourcePlural({
            key: "printf.plural.test",
            sourceLocale: "en-US",
            source: {
                "one": "You have %1$s item.",
                "other": "You have %1$s items."
            },
            targetLocale: "de-DE",
            target: {
                "one": "Sie haben %1$s Element.",
                "other": "Sie haben %1$s Elemente."
            },
            pathName: "a/b/c.xliff"
        });

        // Test that ResourceRule.match() automatically handles category matching
        const sourceFile = new SourceFile("a/b/c.xliff", {
            getLogger: () => ({ debug: () => {}, info: () => {}, warn: () => {}, error: () => {} })
        });
        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile
        });
        const actual = rule.match({
            ir,
            file: "a/b/c.xliff"
        });

        // Should pass because all parameters match correctly
        expect(actual).toBeUndefined();
    });

    // Test array resources with mismatched parameter
    test("should report mismatched parameters in array resources", () => {
        expect.assertions(6);

        const rule = new ResourceGNUPrintfMatch();
        const resource = new ResourceArray({
            key: "printf.array.test",
            sourceLocale: "en-US",
            source: [
                "Hello %1$s, you have %2$d items.",
                "Goodbye %1$s, you had %2$d items."
            ],
            targetLocale: "de-DE",
            target: [
                "Hallo %1$s, Sie haben %2$s Artikel.", // %2$s instead of %2$d
                "Auf Wiedersehen %1$s, Sie hatten %2$d Artikel."
            ],
            pathName: "a/b/c.xliff"
        });

        // Test that ResourceRule.match() automatically handles array matching
        const sourceFile = new SourceFile("a/b/c.xliff", {
            getLogger: () => ({ debug: () => {}, info: () => {}, warn: () => {}, error: () => {} })
        });
        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile
        });
        const actual = rule.match({
            ir,
            file: "a/b/c.xliff"
        });

        // Should return results because first array element has mismatched parameters
        expect(Array.isArray(actual)).toBeTruthy();
        expect(actual && Array.isArray(actual) && actual.length).toBe(2);
        // Check that we have both missing and extra parameter errors
        const descriptions = Array.isArray(actual) ? actual.map(r => r.description) : [];
        expect(descriptions).toContain("Source string GNU printf parameter %2$d not found in the target string.");
        expect(descriptions).toContain("Extra target string GNU printf parameter %2$s not found in the source string.");
        
        // Check that highlights are correct
        const highlights = Array.isArray(actual) ? actual.map(r => r.highlight) : [];
        expect(highlights).toContain('<e0>Hallo %1$s, Sie haben %2$s Artikel.</e0>'); // Missing parameter - entire string highlighted
        expect(highlights).toContain('<e0>Hallo %1$s, Sie haben %2$s Artikel.</e0>'); // Extra parameter - entire string highlighted
    });

    // Test plural resources with mismatched parameter
    test("should report mismatched parameters in plural resources", () => {
        expect.assertions(6);

        const rule = new ResourceGNUPrintfMatch();
        const resource = new ResourcePlural({
            key: "printf.plural.test",
            sourceLocale: "en-US",
            source: {
                "one": "You have %1$s item.",
                "other": "You have %1$s items."
            },
            targetLocale: "de-DE",
            target: {
                "one": "Sie haben %1$d Element.", // %1$d instead of %1$s
                "other": "Sie haben %1$s Elemente."
            },
            pathName: "a/b/c.xliff"
        });

        // Test that ResourceRule.match() automatically handles category matching
        const sourceFile = new SourceFile("a/b/c.xliff", {
            getLogger: () => ({ debug: () => {}, info: () => {}, warn: () => {}, error: () => {} })
        });
        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile
        });
        const actual = rule.match({
            ir,
            file: "a/b/c.xliff"
        });

        // Should return results because "one" category has mismatched parameters
        expect(Array.isArray(actual)).toBeTruthy();
        expect(actual && Array.isArray(actual) && actual.length).toBe(2);
        // Check that we have both missing and extra parameter errors
        const descriptions = Array.isArray(actual) ? actual.map(r => r.description) : [];
        expect(descriptions).toContain("Source string GNU printf parameter %1$s not found in the target string.");
        expect(descriptions).toContain("Extra target string GNU printf parameter %1$d not found in the source string.");
        
        // Check that highlights are correct
        const highlights = Array.isArray(actual) ? actual.map(r => r.highlight) : [];
        expect(highlights).toContain('<e0>Sie haben %1$d Element.</e0>'); // Missing parameter - entire string highlighted
        expect(highlights).toContain('<e0>Sie haben %1$d Element.</e0>'); // Extra parameter - entire string highlighted
    });

    // Test plural resources with different category counts (English to Russian)
    test("should handle plural resources with different category counts", () => {
        expect.assertions(1);

        const rule = new ResourceGNUPrintfMatch();
        const resource = new ResourcePlural({
            key: "printf.plural.english.russian.test",
            sourceLocale: "en-US",
            source: {
                "one": "You have %1$s item.",
                "other": "You have %1$s items."
            },
            targetLocale: "ru-RU",
            target: {
                "one": "У вас %1$s элемент.",
                "few": "У вас %1$s элемента.", // Russian "few" category
                "many": "У вас %1$s элементов.", // Russian "many" category
                "other": "У вас %1$s элементов." // Russian "other" category
            },
            pathName: "a/b/c.xliff"
        });

        // Test that ResourceRule.match() automatically handles category matching
        // Russian "few" category should be matched against English "other" category
        const sourceFile = new SourceFile("a/b/c.xliff", {
            getLogger: () => ({ debug: () => {}, info: () => {}, warn: () => {}, error: () => {} })
        });
        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile
        });
        const actual = rule.match({
            ir,
            file: "a/b/c.xliff"
        });

        // Should pass because all parameters match correctly
        expect(actual).toBeUndefined();
    });

    // Test plural resources with mismatched parameters in different category counts
    test("should report mismatched parameters in plural resources with different category counts", () => {
        expect.assertions(6);

        const rule = new ResourceGNUPrintfMatch();
        const resource = new ResourcePlural({
            key: "printf.plural.english.russian.mismatch.test",
            sourceLocale: "en-US",
            source: {
                "one": "You have %1$s item.",
                "other": "You have %1$s items and %2$d categories."
            },
            targetLocale: "ru-RU",
            target: {
                "one": "У вас %1$s элемент.",
                "few": "У вас %1$s элемента и %2$s категории.", // Missing %2$d, has %2$s instead
                "many": "У вас %1$s элементов и %2$d категорий.",
                "other": "У вас %1$s элементов и %2$d категорий."
            },
            pathName: "a/b/c.xliff"
        });

        // Test that ResourceRule.match() automatically handles category matching
        // Russian "few" category should be matched against English "other" category
        const sourceFile = new SourceFile("a/b/c.xliff", {
            getLogger: () => ({ debug: () => {}, info: () => {}, warn: () => {}, error: () => {} })
        });
        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile
        });
        const actual = rule.match({
            ir,
            file: "a/b/c.xliff"
        });

        // Should return results because "few" category has mismatched parameters
        expect(Array.isArray(actual)).toBeTruthy();
        expect(actual && Array.isArray(actual) && actual.length).toBe(2);
        // Check that we have both missing and extra parameter errors
        const descriptions = Array.isArray(actual) ? actual.map(r => r.description) : [];
        expect(descriptions).toContain("Source string GNU printf parameter %2$d not found in the target string.");
        expect(descriptions).toContain("Extra target string GNU printf parameter %2$s not found in the source string.");
        
        // Check that highlights are correct
        const highlights = Array.isArray(actual) ? actual.map(r => r.highlight) : [];
        expect(highlights).toContain('<e0>У вас %1$s элемента и %2$s категории.</e0>'); // Missing parameter - entire string highlighted
        expect(highlights).toContain('<e0>У вас %1$s элемента и %2$s категории.</e0>'); // Extra parameter - entire string highlighted
    });

    // Test that location parameters are included in Result objects
    test("should include location parameters in result objects", () => {
        expect.assertions(4);

        const rule = new ResourceGNUPrintfMatch();
        const resource = new ResourceString({
            key: "printf.test",
            sourceLocale: "en-US",
            source: 'Hello %1$s, you have %2$d items.',
            targetLocale: "de-DE",
            target: 'Hallo %1$s, Sie haben Artikel.',
            pathName: "a/b/c.xliff",
            location: new Location({ line: 10, char: 5, offset: null })
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(Array.isArray(actual)).toBeTruthy();
        expect(actual && Array.isArray(actual) && actual.length).toBe(1);
        const result = actual && Array.isArray(actual) && actual[0];
        expect(result && result.lineNumber).toBe(10);
        expect(result && result.charNumber).toBe(5);
    });
}); 