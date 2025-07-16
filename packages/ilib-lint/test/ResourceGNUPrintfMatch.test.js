/*
 * ResourceGNUPrintfMatch.test.js - test the GNU printf parameter matching rule
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
        expect(actual[0].description).toContain("Source string GNU printf parameter %2$d not found in the target string.");
        expect(actual[1].description).toContain("Extra target string GNU printf parameter %1$f not found in the source string.");
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
        expect(actual[0].description).toContain("Source string GNU printf parameter %2$d not found in the target string.");
        expect(actual[1].description).toContain("Extra target string GNU printf parameter %2$s not found in the source string.");
        expect(actual[0].highlight).toContain('<e0>'); // At least one highlight
        expect(actual[1].highlight).toContain('<e0>'); // At least one highlight
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

        expect(actual[0].description).toContain("Source string GNU printf parameter %1$s not found in the target string.");
        expect(actual[1].description).toContain("Extra target string GNU printf parameter %1$d not found in the source string.");
        expect(actual[0].highlight).toContain('<e0>'); // At least one highlight
        expect(actual[1].highlight).toContain('<e0>'); // At least one highlight
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
        // Check that we have both missing and extra parameter errors in a single result
        expect(actual[0].description).toContain("Source string GNU printf parameter %2$d not found in the target string.");
        expect(actual[1].description).toContain("Extra target string GNU printf parameter %2$s not found in the source string.");
        // Check that highlights are correct with sequential tags
        expect(actual[0].highlight).toContain('<e0>'); // At least one highlight
        expect(actual[1].highlight).toContain('<e0>'); // At least one highlight
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

    // Test Swift/Objective-C printf style formatting with %@ specifiers
    test("should handle Swift/Objective-C printf style with %@ specifiers", () => {
        expect.assertions(1);

        const rule = new ResourceGNUPrintfMatch();
        const resource = new ResourceString({
            key: "printf.swift.test",
            sourceLocale: "en-US",
            source: 'Hello %@, you have %d items.',
            targetLocale: "es-ES",
            target: 'Hola %@, tienes %d artículos.',
            pathName: "a/b/c.strings"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.strings"
        });
        expect(actual).toBeUndefined();
    });

    test("should handle Swift/Objective-C printf style with positional %@ specifiers", () => {
        expect.assertions(1);

        const rule = new ResourceGNUPrintfMatch();
        const resource = new ResourceString({
            key: "printf.swift.positional.test",
            sourceLocale: "en-US",
            source: 'Hello %1$@, you have %2$d items.',
            targetLocale: "es-ES",
            target: 'Hola %1$@, tienes %2$d artículos.',
            pathName: "a/b/c.strings"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.strings"
        });
        expect(actual).toBeUndefined();
    });

    test("should handle mixed Swift/Objective-C and GNU printf specifiers", () => {
        expect.assertions(1);

        const rule = new ResourceGNUPrintfMatch();
        const resource = new ResourceString({
            key: "printf.mixed.test",
            sourceLocale: "en-US",
            source: 'User %@ has %d items worth %1.2f dollars.',
            targetLocale: "es-ES",
            target: 'El usuario %@ tiene %d artículos por %1.2f dólares.',
            pathName: "a/b/c.strings"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.strings"
        });
        expect(actual).toBeUndefined();
    });

    test("should report missing %@ parameter in target", () => {
        expect.assertions(3);

        const rule = new ResourceGNUPrintfMatch();
        const resource = new ResourceString({
            key: "printf.swift.missing.test",
            sourceLocale: "en-US",
            source: 'Hello %@, you have %d items.',
            targetLocale: "es-ES",
            target: 'Hola, tienes %d artículos.',
            pathName: "a/b/c.strings"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.strings"
        });
        const expected = new Result({
            severity: "error",
            description: "Source string GNU printf parameter %@ not found in the target string.",
            rule,
            id: "printf.swift.missing.test",
            source: 'Hello %@, you have %d items.',
            highlight: '<e0>Hola, tienes %d artículos.</e0>',
            pathName: "a/b/c.strings"
        });
        expect(Array.isArray(actual)).toBeTruthy();
        expect(actual && Array.isArray(actual) && actual.length).toBe(1);
        expect(actual && Array.isArray(actual) && actual[0]).toStrictEqual(expected);
    });

    test("should report extra %@ parameter in target", () => {
        expect.assertions(3);

        const rule = new ResourceGNUPrintfMatch();
        const resource = new ResourceString({
            key: "printf.swift.extra.test",
            sourceLocale: "en-US",
            source: 'Hello, you have %d items.',
            targetLocale: "es-ES",
            target: 'Hola %@, tienes %d artículos.',
            pathName: "a/b/c.strings"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.strings"
        });
        const expected = new Result({
            severity: "error",
            description: "Extra target string GNU printf parameter %@ not found in the source string.",
            rule,
            id: "printf.swift.extra.test",
            source: 'Hello, you have %d items.',
            highlight: 'Hola <e0>%@</e0>, tienes %d artículos.',
            pathName: "a/b/c.strings"
        });
        expect(Array.isArray(actual)).toBeTruthy();
        expect(actual && Array.isArray(actual) && actual.length).toBe(1);
        expect(actual && Array.isArray(actual) && actual[0]).toStrictEqual(expected);
    });

    test("should handle Swift/Objective-C printf style in array resources", () => {
        expect.assertions(1);

        const rule = new ResourceGNUPrintfMatch();
        const resource = new ResourceArray({
            key: "printf.swift.array.test",
            sourceLocale: "en-US",
            source: [
                "Hello %@, you have %d items.",
                "Goodbye %@, you had %d items."
            ],
            targetLocale: "es-ES",
            target: [
                "Hola %@, tienes %d artículos.",
                "Adiós %@, tenías %d artículos."
            ],
            pathName: "a/b/c.strings"
        });

        const sourceFile = new SourceFile("a/b/c.strings", {
            getLogger: () => ({ debug: () => {}, info: () => {}, warn: () => {}, error: () => {} })
        });
        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile
        });
        const actual = rule.match({
            ir,
            file: "a/b/c.strings"
        });

        expect(actual).toBeUndefined();
    });

    test("should handle Swift/Objective-C printf style in plural resources", () => {
        expect.assertions(1);

        const rule = new ResourceGNUPrintfMatch();
        const resource = new ResourcePlural({
            key: "printf.swift.plural.test",
            sourceLocale: "en-US",
            source: {
                "one": "You have %@ item.",
                "other": "You have %@ items."
            },
            targetLocale: "es-ES",
            target: {
                "one": "Tienes %@ artículo.",
                "other": "Tienes %@ artículos."
            },
            pathName: "a/b/c.strings"
        });

        const sourceFile = new SourceFile("a/b/c.strings", {
            getLogger: () => ({ debug: () => {}, info: () => {}, warn: () => {}, error: () => {} })
        });
        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile
        });
        const actual = rule.match({
            ir,
            file: "a/b/c.strings"
        });

        expect(actual).toBeUndefined();
    });

    // Test multiple %s parameters in source and target
    test("should pass when both source and target have two %s parameters", () => {
        expect.assertions(1);
        const rule = new ResourceGNUPrintfMatch();
        const resource = new ResourceString({
            key: "printf.multiple.s.match",
            sourceLocale: "en-US",
            source: 'Hello %s, your friend %s is here.',
            targetLocale: "es-ES",
            target: 'Hola %s, tu amigo %s está aquí.',
            pathName: "a/b/c.strings"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.strings"
        });
        expect(actual).toBeUndefined();
    });

    test("should report missing %s parameter in target if source has two and target has one", () => {
        expect.assertions(3);
        const rule = new ResourceGNUPrintfMatch();
        const resource = new ResourceString({
            key: "printf.multiple.s.missing",
            sourceLocale: "en-US",
            source: 'Hello %s, your friend %s is here.',
            targetLocale: "es-ES",
            target: 'Hola %s está aquí.',
            pathName: "a/b/c.strings"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.strings"
        });
        expect(Array.isArray(actual)).toBeTruthy();
        expect(actual && Array.isArray(actual) && actual.length).toBe(1);
        expect(actual && Array.isArray(actual) && actual[0].description).toContain('%s not found in the target string');
    });

    test("should report extra %s parameter in target if source has two and target has three", () => {
        expect.assertions(4);
        const rule = new ResourceGNUPrintfMatch();
        const resource = new ResourceString({
            key: "printf.multiple.s.extra",
            sourceLocale: "en-US",
            source: 'Hello %s, your friend %s is here.',
            targetLocale: "es-ES",
            target: 'Hola %s, tu amigo %s y %s están aquí.',
            pathName: "a/b/c.strings"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.strings"
        });
        expect(Array.isArray(actual)).toBeTruthy();
        expect(actual && Array.isArray(actual) && actual.length).toBe(1);
        expect(actual && Array.isArray(actual) && actual[0].description).toContain('Extra target string GNU printf parameter %s not found in the source string');
        // Check that the last occurrence of %s is highlighted (the extra one)
        expect(actual && Array.isArray(actual) && actual[0].highlight).toBe('Hola %s, tu amigo %s y <e0>%s</e0> están aquí.');
    });

    test("should report extra %s parameter in target if source has one and target has two", () => {
        expect.assertions(4);
        const rule = new ResourceGNUPrintfMatch();
        const resource = new ResourceString({
            key: "printf.multiple.s.extra2",
            sourceLocale: "en-US",
            source: 'Hello %s!',
            targetLocale: "es-ES",
            target: 'Hola %s y %s!',
            pathName: "a/b/c.strings"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.strings"
        });
        expect(Array.isArray(actual)).toBeTruthy();
        expect(actual && Array.isArray(actual) && actual.length).toBe(1);
        expect(actual && Array.isArray(actual) && actual[0].description).toContain('Extra target string GNU printf parameter %s not found in the source string');
        // Check that the last occurrence of %s is highlighted (the extra one)
        expect(actual && Array.isArray(actual) && actual[0].highlight).toBe('Hola %s y <e0>%s</e0>!');
    });

    test("should report two extra %s parameters in target with sequential highlights", () => {
        const rule = new ResourceGNUPrintfMatch();
        const resource = new ResourceString({
            key: "printf.multiple.s.extra3",
            sourceLocale: "en-US",
            source: 'Hello %s!',
            targetLocale: "es-ES",
            target: 'Hola %s, %s y %s!',
            pathName: "a/b/c.strings"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.strings"
        });
        expect(Array.isArray(actual)).toBeTruthy();
        expect(actual && Array.isArray(actual) && actual.length).toBe(1);
        const result = actual && Array.isArray(actual) && actual[0];
        if (result) {
            expect(result.description).toContain('Extra target string GNU printf parameter %s not found in the source string.');
            // Check that both extra parameters are highlighted with sequential tags
            expect(result.highlight).toBe('Hola %s, <e0>%s</e0> y <e1>%s</e1>!');
        }
    });

    test("should report two missing parameters in target as two separate results", () => {
        const rule = new ResourceGNUPrintfMatch();
        const resource = new ResourceString({
            key: "printf.missing.two",
            sourceLocale: "en-US",
            source: 'Hello %s, you have %d items.',
            targetLocale: "es-ES",
            target: 'Hola!',
            pathName: "a/b/c.strings"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.strings"
        });
        expect(Array.isArray(actual)).toBeTruthy();
        if (Array.isArray(actual)) {
            expect(actual.length).toBe(2);
            // Each result should have a single highlight
            expect(actual[0].highlight).toBe('<e0>Hola!</e0>');
            expect(actual[1].highlight).toBe('<e0>Hola!</e0>');
            // Each result should mention a different missing parameter
            expect(actual[0].description).toMatch(/not found in the target string/);
            expect(actual[1].description).toMatch(/not found in the target string/);
            expect(actual[0].description).not.toBe(actual[1].description);
        }
    });

    test("should report two extra parameters of the same type in target as one result with sequential highlights", () => {
        const rule = new ResourceGNUPrintfMatch();
        const resource = new ResourceString({
            key: "printf.extra.two.same",
            sourceLocale: "en-US",
            source: 'Hello %s!',
            targetLocale: "es-ES",
            target: 'Hola %s y %s!',
            pathName: "a/b/c.strings"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.strings"
        });
        expect(Array.isArray(actual)).toBeTruthy();
        if (Array.isArray(actual)) {
            expect(actual.length).toBe(1);
            // Should highlight both extra %s with <e0> and <e1>
            expect(actual[0].highlight).toBe('Hola %s y <e0>%s</e0>!');
            expect(actual[0].description).toContain('Extra target string GNU printf parameter %s not found in the source string');
        }
    });

    test("should report two extra parameters of different types in target as two results", () => {
        const rule = new ResourceGNUPrintfMatch();
        const resource = new ResourceString({
            key: "printf.extra.two.diff",
            sourceLocale: "en-US",
            source: 'Hello!',
            targetLocale: "es-ES",
            target: 'Hola %s y %d!',
            pathName: "a/b/c.strings"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.strings"
        });
        expect(Array.isArray(actual)).toBeTruthy();
        if (Array.isArray(actual)) {
            expect(actual.length).toBe(2);
            // Each result should have a single highlight for its parameter
            const highlights = actual.map(r => r.highlight);
            expect(highlights).toContain('Hola <e0>%s</e0> y %d!')
            expect(highlights).toContain('Hola %s y <e0>%d</e0>!')
            // Each result should mention a different extra parameter
            expect(actual[0].description).not.toBe(actual[1].description);
            expect(actual[0].description).toMatch(/Extra target string GNU printf parameter/);
            expect(actual[1].description).toMatch(/Extra target string GNU printf parameter/);
        }
    });
});