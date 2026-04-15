/*
 * SwiftParams.test.js - test the SwiftParams rule
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

import SwiftParams from '../src/rules/SwiftParams.js';
import { SourceFile, IntermediateRepresentation } from 'ilib-lint-common';
import { ResourceString, ResourceArray, ResourcePlural, Location } from 'ilib-tools-common';

describe('SwiftParams', () => {
    let rule;
    let sourceFile;

    beforeEach(() => {
        rule = new SwiftParams();
        sourceFile = new SourceFile('test.swift', { type: 'swift' });
    });

    describe('extractParameters', () => {
        test('should extract simple Swift parameters', () => {
            const str = 'Hello \\(name), you have \\(count) items';
            const params = rule.extractParameters(str);
            expect(params).toEqual(['\\(name)', '\\(count)']);
        });

        test('should extract complex expressions', () => {
            const str = 'You have \\(count == 1 ? "item" : "items")';
            const params = rule.extractParameters(str);
            expect(params).toEqual(['\\(count == 1 ? "item" : "items")']);
        });

        test('should extract formatted values', () => {
            const str = 'Price: \\(price, specifier: "%.2f")';
            const params = rule.extractParameters(str);
            expect(params).toEqual(['\\(price, specifier: "%.2f")']);
        });

        test('should extract method calls', () => {
            const str = 'User: \\(user.getName())';
            const params = rule.extractParameters(str);
            expect(params).toEqual(['\\(user.getName()']);
        });

        test('should extract computed properties', () => {
            const str = 'Full name: \\(user.fullName)';
            const params = rule.extractParameters(str);
            expect(params).toEqual(['\\(user.fullName)']);
        });

        test('should handle multiple parameters', () => {
            const str = 'Hello \\(firstName) \\(lastName), you have \\(count) items worth \\(price, specifier: "%.2f")';
            const params = rule.extractParameters(str);
            expect(params).toEqual(['\\(firstName)', '\\(lastName)', '\\(count)', '\\(price, specifier: "%.2f")']);
        });

        test('should handle no parameters', () => {
            const str = 'Hello world';
            const params = rule.extractParameters(str);
            expect(params).toEqual([]);
        });

        test('should handle empty string', () => {
            const str = '';
            const params = rule.extractParameters(str);
            expect(params).toEqual([]);
        });

        test('should handle null/undefined', () => {
            expect(rule.extractParameters(null)).toEqual([]);
            expect(rule.extractParameters(undefined)).toEqual([]);
        });

        test('should handle escaped backslashes', () => {
            // In Swift, '\\(name)' is a literal backslash and parenthesis, not interpolation
            const str = 'This is not a parameter: \\\\(name)';
            const params = rule.extractParameters(str);
            expect(params).toEqual([]);
        });
    });

    describe('String Resources', () => {
        test('should pass when parameters match', () => {
            const resource = new ResourceString({
                key: 'greeting',
                source: 'Hello \\(name), you have \\(count) items',
                target: 'Bonjour \\(name), vous avez \\(count) articles',
                pathName: 'test.swift',
                lineNumber: 10,
                charNumber: 5
            });

            const ir = new IntermediateRepresentation({
                sourceFile: sourceFile,
                type: 'resource',
                ir: [resource]
            });

            const results = rule.match({ locale: 'fr-FR', ir });
            expect(results).toBeUndefined();
        });

        test('should fail when target is missing parameters', () => {
            const resource = new ResourceString({
                key: 'greeting',
                source: 'Hello \\(name), you have \\(count) items',
                target: 'Bonjour \\(name)',
                pathName: 'test.swift',
                lineNumber: 10,
                charNumber: 5
            });

            const ir = new IntermediateRepresentation({
                sourceFile: sourceFile,
                type: 'resource',
                ir: [resource]
            });

            const results = rule.match({ locale: 'fr-FR', ir });
            expect(results).toHaveLength(1);
            expect(results[0].severity).toBe('error');
            expect(results[0].description).toContain('Source string Swift parameter \\(count) not found in the target string');
            expect(results[0].id).toBe('greeting');
        });

        test('should fail when target has extra parameters', () => {
            const resource = new ResourceString({
                key: 'greeting',
                source: 'Hello \\(name)',
                target: 'Bonjour \\(name), vous avez \\(count) articles',
                pathName: 'test.swift',
                lineNumber: 10,
                charNumber: 5
            });

            const ir = new IntermediateRepresentation({
                sourceFile: sourceFile,
                type: 'resource',
                ir: [resource]
            });

            const results = rule.match({ locale: 'fr-FR', ir });
            expect(results).toHaveLength(1);
            expect(results[0].severity).toBe('error');
            expect(results[0].description).toContain('Extra target string Swift parameter \\(count) not found in the source string');
            expect(results[0].id).toBe('greeting');
        });

        test('should fail when target has different parameter names', () => {
            const resource = new ResourceString({
                key: 'greeting',
                source: 'Hello \\(name), you have \\(count) items',
                target: 'Bonjour \\(user), vous avez \\(items) articles',
                pathName: 'test.swift',
                lineNumber: 10,
                charNumber: 5
            });

            const ir = new IntermediateRepresentation({
                sourceFile: sourceFile,
                type: 'resource',
                ir: [resource]
            });

            const results = rule.match({ locale: 'fr-FR', ir });
            expect(results).toHaveLength(4);
            expect(results[0].description).toContain('Source string Swift parameter \\(name) not found in the target string');
            expect(results[1].description).toContain('Source string Swift parameter \\(count) not found in the target string');
            expect(results[2].description).toContain('Extra target string Swift parameter \\(user) not found in the source string');
            expect(results[3].description).toContain('Extra target string Swift parameter \\(items) not found in the source string');
        });

        test('should pass when no parameters in either string', () => {
            const resource = new ResourceString({
                key: 'greeting',
                source: 'Hello world',
                target: 'Bonjour le monde',
                pathName: 'test.swift',
                lineNumber: 10,
                charNumber: 5
            });

            const ir = new IntermediateRepresentation({
                sourceFile: sourceFile,
                type: 'resource',
                ir: [resource]
            });

            const results = rule.match({ locale: 'fr-FR', ir });
            expect(results).toBeUndefined();
        });

        test('should handle complex expressions', () => {
            const resource = new ResourceString({
                key: 'items',
                source: 'You have \\(count == 1 ? "item" : "items")',
                target: 'Vous avez \\(count == 1 ? "article" : "articles")',
                pathName: 'test.swift',
                lineNumber: 10,
                charNumber: 5
            });

            const ir = new IntermediateRepresentation({
                sourceFile: sourceFile,
                resources: [resource],
                type: 'swift',
                ir: {}
            });

            const results = rule.match({ locale: 'fr-FR', ir });
            expect(results).toBeUndefined();
        });
    });

    describe('Array Resources', () => {
        test('should check each array element', () => {
            const resource = new ResourceArray({
                key: 'messages',
                source: [
                    'Hello \\(name)',
                    'You have \\(count) items',
                    'Price: \\(price, specifier: "%.2f")'
                ],
                target: [
                    'Bonjour \\(name)',
                    'Vous avez \\(count) articles',
                    'Prix: \\(price, specifier: "%.2f")'
                ],
                pathName: 'test.swift',
                lineNumber: 10,
                charNumber: 5
            });

            const ir = new IntermediateRepresentation({
                sourceFile: sourceFile,
                type: 'resource',
                ir: [resource]
            });

            const results = rule.match({ locale: 'fr-FR', ir });
            expect(results).toBeUndefined();
        });

        test('should fail when array elements have mismatched parameters', () => {
            const resource = new ResourceArray({
                key: 'messages',
                source: [
                    'Hello \\(name)',
                    'You have \\(count) items'
                ],
                target: [
                    'Bonjour \\(user)',
                    'Vous avez \\(items) articles'
                ],
                pathName: 'test.swift',
                lineNumber: 10,
                charNumber: 5
            });

            const ir = new IntermediateRepresentation({
                sourceFile: sourceFile,
                type: 'resource',
                ir: [resource]
            });

            const results = rule.match({ locale: 'fr-FR', ir });
            expect(results).toHaveLength(4);
        });

        test('should handle arrays of different lengths', () => {
            const resource = new ResourceArray({
                key: 'messages',
                source: [
                    'Hello \\(name)',
                    'You have \\(count) items'
                ],
                target: [
                    'Bonjour \\(name)'
                ],
                pathName: 'test.swift',
                lineNumber: 10,
                charNumber: 5
            });

            const ir = new IntermediateRepresentation({
                sourceFile: sourceFile,
                type: 'resource',
                ir: [resource]
            });

            const results = rule.match({ locale: 'fr-FR', ir });
            expect(results).toHaveLength(1);
            expect(results[0].description).toContain('Source string Swift parameter \\(count) not found in the target string');
        });
    });

    describe('Plural Resources', () => {
        test('should check each plural category', () => {
            const resource = new ResourcePlural({
                key: 'items',
                source: {
                    'one': 'You have \\(count) item',
                    'other': 'You have \\(count) items'
                },
                target: {
                    'one': 'Vous avez \\(count) article',
                    'other': 'Vous avez \\(count) articles'
                },
                pathName: 'test.swift',
                lineNumber: 10,
                charNumber: 5
            });

            const ir = new IntermediateRepresentation({
                sourceFile: sourceFile,
                type: 'resource',
                ir: [resource]
            });

            const results = rule.match({ locale: 'fr-FR', ir });
            expect(results).toBeUndefined();
        });

        test('should fail when plural categories have mismatched parameters', () => {
            const resource = new ResourcePlural({
                key: 'items',
                source: {
                    'one': 'You have \\(count) item',
                    'other': 'You have \\(count) items'
                },
                target: {
                    'one': 'Vous avez \\(items) article',
                    'other': 'Vous avez \\(items) articles'
                },
                pathName: 'test.swift',
                lineNumber: 10,
                charNumber: 5
            });

            const ir = new IntermediateRepresentation({
                sourceFile: sourceFile,
                type: 'resource',
                ir: [resource]
            });

            const results = rule.match({ locale: 'fr-FR', ir });
            expect(results).toHaveLength(4);
            expect(results[0].description).toContain('Source string Swift parameter \\(count) not found in the target string');
            expect(results[1].description).toContain('Extra target string Swift parameter \\(items) not found in the source string');
        });

        test('should handle missing plural categories in target', () => {
            const resource = new ResourcePlural({
                key: 'items',
                source: {
                    'one': 'You have \\(count) item',
                    'other': 'You have \\(count) items'
                },
                target: {
                    'one': 'Vous avez \\(count) article'
                },
                pathName: 'test.swift',
                lineNumber: 10,
                charNumber: 5
            });

            const ir = new IntermediateRepresentation({
                sourceFile: sourceFile,
                type: 'resource',
                ir: [resource]
            });

            const results = rule.match({ locale: 'fr-FR', ir });
            expect(results).toHaveLength(1);
            expect(results[0].description).toContain('Source string Swift parameter \\(count) not found in the target string');
        });
    });

    describe('Error Reporting', () => {
        test('should include proper location information', () => {
            const resource = new ResourceString({
                key: 'greeting',
                source: 'Hello \\(name)',
                target: 'Bonjour \\(user)',
                pathName: 'test.swift',
                location: new Location({ line: 15, char: 8 })
            });

            const ir = new IntermediateRepresentation({
                sourceFile: sourceFile,
                type: 'resource',
                ir: [resource]
            });

            const results = rule.match({ locale: 'fr-FR', ir });
            expect(results).toHaveLength(2);
            expect(results[0].pathName).toBe('test.swift');
            expect(results[0].lineNumber).toBe(15);
            expect(results[0].charNumber).toBe(8);
        });

        test('should highlight extra parameters in target', () => {
            const resource = new ResourceString({
                key: 'greeting',
                source: 'Hello \\(name)',
                target: 'Bonjour \\(name) et \\(user)',
                pathName: 'test.swift',
                lineNumber: 10,
                charNumber: 5
            });

            const ir = new IntermediateRepresentation({
                sourceFile: sourceFile,
                type: 'resource',
                ir: [resource]
            });

            const results = rule.match({ locale: 'fr-FR', ir });
            expect(results).toHaveLength(1);
            expect(results[0].highlight).toContain('<e0>\\(user)</e0>');
        });
    });

    describe('Highlighting Functionality', () => {
        test('should highlight target string when parameters are missing', () => {
            const resource = new ResourceString({
                key: 'greeting',
                source: 'Hello \\(name), you have \\(count) items',
                target: 'Bonjour \\(name)',
                pathName: 'test.swift',
                lineNumber: 10,
                charNumber: 5
            });

            const ir = new IntermediateRepresentation({
                sourceFile: sourceFile,
                type: 'resource',
                ir: [resource]
            });

            const results = rule.match({ locale: 'fr-FR', ir });
            expect(results).toHaveLength(1);
            expect(results[0].highlight).toBe('<e0>Bonjour \\(name)</e0>');
            expect(results[0].description).toContain('Source string Swift parameter \\(count) not found in the target string');
        });

        test('should highlight target string when target is missing entirely', () => {
            const resource = new ResourceString({
                key: 'greeting',
                source: 'Hello \\(name), you have \\(count) items',
                target: undefined,
                pathName: 'test.swift',
                lineNumber: 10,
                charNumber: 5
            });

            const ir = new IntermediateRepresentation({
                sourceFile: sourceFile,
                type: 'resource',
                ir: [resource]
            });

            const results = rule.match({ locale: 'fr-FR', ir });
            expect(results).toHaveLength(1);
            expect(results[0].highlight).toBe('<e0></e0>');
            expect(results[0].description).toContain('Source string Swift parameter \\(name) not found in the target string');
        });

        test('should highlight individual extra parameters with different numbers', () => {
            const resource = new ResourceString({
                key: 'greeting',
                source: 'Hello \\(name)',
                target: 'Bonjour \\(name) et \\(user) et \\(count)',
                pathName: 'test.swift',
                lineNumber: 10,
                charNumber: 5
            });

            const ir = new IntermediateRepresentation({
                sourceFile: sourceFile,
                type: 'resource',
                ir: [resource]
            });

            const results = rule.match({ locale: 'fr-FR', ir });
            expect(results).toHaveLength(2);
            
            // Check that each extra parameter is highlighted with a different number
            const highlights = results.map(r => r.highlight);
            expect(highlights).toContain('Bonjour \\(name) et <e0>\\(user)</e0> et \\(count)');
            expect(highlights).toContain('Bonjour \\(name) et \\(user) et <e1>\\(count)</e1>');
        });

        test('should highlight multiple extra parameters in complex expressions', () => {
            const resource = new ResourceString({
                key: 'complex',
                source: 'You have \\(count) items',
                target: 'Vous avez \\(count) articles et \\(price, specifier: "%.2f") et \\(user.getName())',
                pathName: 'test.swift',
                lineNumber: 10,
                charNumber: 5
            });

            const ir = new IntermediateRepresentation({
                sourceFile: sourceFile,
                type: 'resource',
                ir: [resource]
            });

            const results = rule.match({ locale: 'fr-FR', ir });
            expect(results).toHaveLength(2);
            
            const highlights = results.map(r => r.highlight);
            expect(highlights).toContain('Vous avez \\(count) articles et <e0>\\(price, specifier: "%.2f")</e0> et \\(user.getName())');
            expect(highlights).toContain('Vous avez \\(count) articles et \\(price, specifier: "%.2f") et <e1>\\(user.getName()</e1>)');
        });

        test('should highlight target when both missing and extra parameters exist', () => {
            const resource = new ResourceString({
                key: 'mixed',
                source: 'Hello \\(name), you have \\(count) items',
                target: 'Bonjour \\(user), vous avez \\(price)',
                pathName: 'test.swift',
                lineNumber: 10,
                charNumber: 5
            });

            const ir = new IntermediateRepresentation({
                sourceFile: sourceFile,
                type: 'resource',
                ir: [resource]
            });

            const results = rule.match({ locale: 'fr-FR', ir });
            expect(results).toHaveLength(4);
            
            // Check missing parameters highlight the entire target
            const missingResults = results.filter(r => r.description.includes('not found in the target string'));
            expect(missingResults).toHaveLength(2);
            missingResults.forEach(result => {
                expect(result.highlight).toBe('<e0>Bonjour \\(user), vous avez \\(price)</e0>');
            });
            
            // Check extra parameters highlight individual parameters
            const extraResults = results.filter(r => r.description.includes('Extra target string Swift parameter'));
            expect(extraResults).toHaveLength(2);
            const extraHighlights = extraResults.map(r => r.highlight);
            expect(extraHighlights).toContain('Bonjour <e0>\\(user)</e0>, vous avez \\(price)');
            expect(extraHighlights).toContain('Bonjour \\(user), vous avez <e1>\\(price)</e1>');
        });

        test('should handle highlighting in array resources', () => {
            const resource = new ResourceArray({
                key: 'messages',
                source: [
                    'Hello \\(name)',
                    'You have \\(count) items'
                ],
                target: [
                    'Bonjour \\(user)',
                    'Vous avez \\(items)'
                ],
                pathName: 'test.swift',
                lineNumber: 10,
                charNumber: 5
            });

            const ir = new IntermediateRepresentation({
                sourceFile: sourceFile,
                type: 'resource',
                ir: [resource]
            });

            const results = rule.match({ locale: 'fr-FR', ir });
            expect(results).toHaveLength(4);
            
            // Check that array elements are highlighted correctly
            const highlights = results.map(r => r.highlight);
            expect(highlights).toContain('<e0>Bonjour \\(user)</e0>'); // Missing parameter
            expect(highlights).toContain('Bonjour <e0>\\(user)</e0>'); // Extra parameter
            expect(highlights).toContain('<e0>Vous avez \\(items)</e0>'); // Missing parameter
            expect(highlights).toContain('Vous avez <e0>\\(items)</e0>'); // Extra parameter
        });

        test('should handle highlighting in plural resources', () => {
            const resource = new ResourcePlural({
                key: 'items',
                source: {
                    'one': 'You have \\(count) item',
                    'other': 'You have \\(count) items'
                },
                target: {
                    'one': 'Vous avez \\(items) article',
                    'other': 'Vous avez \\(items) articles'
                },
                pathName: 'test.swift',
                lineNumber: 10,
                charNumber: 5
            });

            const ir = new IntermediateRepresentation({
                sourceFile: sourceFile,
                type: 'resource',
                ir: [resource]
            });

            const results = rule.match({ locale: 'fr-FR', ir });
            expect(results).toHaveLength(4);
            
            // Check that plural categories are highlighted correctly
            const highlights = results.map(r => r.highlight);
            expect(highlights).toContain('<e0>Vous avez \\(items) article</e0>'); // Missing parameter
            expect(highlights).toContain('Vous avez <e0>\\(items)</e0> article'); // Extra parameter
            expect(highlights).toContain('<e0>Vous avez \\(items) articles</e0>'); // Missing parameter
            expect(highlights).toContain('Vous avez <e0>\\(items)</e0> articles'); // Extra parameter
        });
    });
}); 