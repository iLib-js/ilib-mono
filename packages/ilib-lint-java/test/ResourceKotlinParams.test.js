/*
 * ResourceKotlinParams.test.js - Test for ResourceKotlinParams rule
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

import ResourceKotlinParams from '../src/ResourceKotlinParams.js';
import { ResourceString, ResourceArray, ResourcePlural } from 'ilib-tools-common';
import { SourceFile, IntermediateRepresentation } from 'ilib-lint-common';

describe('ResourceKotlinParams', () => {
    let rule;
    let sourceFile;

    beforeEach(() => {
        rule = new ResourceKotlinParams();
        sourceFile = new SourceFile('test.kt');
    });

    test('should extract Kotlin string template parameters correctly', () => {
        expect(rule.extractKotlinParams('Hello $name, you have $count messages')).toEqual(['name', 'count']);
        expect(rule.extractKotlinParams('Price: $price')).toEqual(['price']);
        expect(rule.extractKotlinParams('Hello ${user.name}, you have ${messages.size} messages')).toEqual(['user.name', 'messages.size']);
        expect(rule.extractKotlinParams('No parameters here')).toEqual([]);
        expect(rule.extractKotlinParams('')).toEqual([]);
        expect(rule.extractKotlinParams(null)).toEqual([]);
    });

    test('should handle complex expressions in Kotlin templates', () => {
        expect(rule.extractKotlinParams('Hello ${if (age >= 18) "adult" else "minor"}')).toEqual(['if (age >= 18) "adult" else "minor"']);
        expect(rule.extractKotlinParams('Count: ${items.size}')).toEqual(['items.size']);
        expect(rule.extractKotlinParams('${user.firstName} ${user.lastName}')).toEqual(['user.firstName', 'user.lastName']);
    });

    test('should check if all required parameters are present', () => {
        expect(rule.hasAllRequiredParams(['name'], ['name'])).toBe(true);
        expect(rule.hasAllRequiredParams(['name', 'count'], ['name', 'count'])).toBe(true);
        expect(rule.hasAllRequiredParams(['name', 'count'], ['name'])).toBe(false);
        expect(rule.hasAllRequiredParams(['name'], [])).toBe(false);
    });

    test('should detect missing parameters in string resources', () => {
        const resource = new ResourceString({ key: 'test.key', source: 'Hello $name, you have $count messages', target: 'Hola $name, tienes mensajes' });
        const ir = new IntermediateRepresentation({ type: 'resource', ir: [resource], sourceFile });
        
        const result = rule.match({ ir, locale: 'es-ES' });
        
        expect(result).toBeTruthy();
        expect(result.description).toContain('Missing Kotlin string template parameters in target: $count');
    });

    test('should not trigger when all parameters are present', () => {
        const resource = new ResourceString({ key: 'test.key', source: 'Hello $name, you have $count messages', target: 'Hola $name, tienes $count mensajes' });
        const ir = new IntermediateRepresentation({ type: 'resource', ir: [resource], sourceFile });
        
        const result = rule.match({ ir, locale: 'es-ES' });
        
        expect(result).toBeUndefined();
    });

    test('should not trigger when no parameters are present', () => {
        const resource = new ResourceString({ key: 'test.key', source: 'Hello world', target: 'Hola mundo' });
        const ir = new IntermediateRepresentation({ type: 'resource', ir: [resource], sourceFile });
        
        const result = rule.match({ ir, locale: 'es-ES' });
        
        expect(result).toBeUndefined();
    });

    test('should handle array resources', () => {
        const resource = new ResourceArray({ key: 'test.key', source: ['Hello $name', 'You have $count messages'], target: ['Hola $name', 'Tienes mensajes'] });
        const ir = new IntermediateRepresentation({ type: 'resource', ir: [resource], sourceFile });
        
        const result = rule.match({ ir, locale: 'es-ES' });
        
        expect(result).toBeTruthy();
        expect(result.description).toContain('Missing Kotlin string template parameters in target array item [1]: $count');
    });

    test('should handle plural resources', () => {
        const resource = new ResourcePlural({ 
            key: 'test.key', 
            source: { one: 'You have $count message', other: 'You have $count messages' },
            target: { one: 'Tienes $count mensaje', other: 'Tienes mensajes' }
        });
        const ir = new IntermediateRepresentation({ type: 'resource', ir: [resource], sourceFile });
        
        const result = rule.match({ ir, locale: 'es-ES' });
        
        expect(result).toBeTruthy();
        expect(result.description).toContain('Missing Kotlin string template parameters in target plural (other): $count');
    });

    test('should handle mixed simple and expression parameters', () => {
        const resource = new ResourceString({ key: 'test.key', source: 'Hello $name, you have ${messages.size} messages', target: 'Hola $name, tienes mensajes' });
        const ir = new IntermediateRepresentation({ type: 'resource', ir: [resource], sourceFile });
        
        const result = rule.match({ ir, locale: 'es-ES' });
        
        expect(result).toBeTruthy();
        expect(result.description).toContain('Missing Kotlin string template parameters in target: $messages');
    });

    test('should warn about extra parameters in target string', () => {
        const resource = new ResourceString({ key: 'test.key', source: 'Hello $name', target: 'Hola $name, tienes $count mensajes' });
        const ir = new IntermediateRepresentation({ type: 'resource', ir: [resource], sourceFile });
        
        const result = rule.match({ ir, locale: 'es-ES' });
        
        expect(result).toBeTruthy();
        expect(result.severity).toBe('warning');
        expect(result.description).toContain('Extra Kotlin string template parameters in target: $count');
        expect(result.highlight).toContain('<e0>$count</e0>');
    });

    test('should warn about extra parameters in target array', () => {
        const resource = new ResourceArray({ key: 'test.key', source: ['Hello $name'], target: ['Hola $name, tienes $count mensajes'] });
        const ir = new IntermediateRepresentation({ type: 'resource', ir: [resource], sourceFile });
        
        const result = rule.match({ ir, locale: 'es-ES' });
        
        expect(result).toBeTruthy();
        expect(result.severity).toBe('warning');
        expect(result.description).toContain('Extra Kotlin string template parameters in target array item [0]: $count');
        expect(result.highlight).toContain('<e0>$count</e0>');
    });

    test('should warn about extra parameters in target plural', () => {
        const resource = new ResourcePlural({ 
            key: 'test.key', 
            source: { one: 'You have $count message', other: 'You have $count messages' },
            target: { one: 'Tienes $count mensaje, $extra', other: 'Tienes $count mensajes' }
        });
        const ir = new IntermediateRepresentation({ type: 'resource', ir: [resource], sourceFile });
        
        const result = rule.match({ ir, locale: 'es-ES' });
        
        expect(result).toBeTruthy();
        expect(result.severity).toBe('warning');
        expect(result.description).toContain('Extra Kotlin string template parameters in target plural (one): $extra');
        expect(result.highlight).toContain('<e0>$extra</e0>');
    });

    test('should handle multiple extra parameters', () => {
        const resource = new ResourceString({ key: 'test.key', source: 'Hello $name', target: 'Hola $name, tienes $count $extra mensajes' });
        const ir = new IntermediateRepresentation({ type: 'resource', ir: [resource], sourceFile });
        
        const result = rule.match({ ir, locale: 'es-ES' });
        
        expect(result).toBeTruthy();
        expect(result.severity).toBe('warning');
        expect(result.description).toContain('Extra Kotlin string template parameters in target: $count, $extra');
        expect(result.highlight).toContain('<e0>$count</e0>');
        expect(result.highlight).toContain('<e0>$extra</e0>');
    });

    test('should handle extra expression parameters', () => {
        const resource = new ResourceString({ key: 'test.key', source: 'Hello $name', target: 'Hola $name, tienes ${messages.size} mensajes' });
        const ir = new IntermediateRepresentation({ type: 'resource', ir: [resource], sourceFile });
        
        const result = rule.match({ ir, locale: 'es-ES' });
        
        expect(result).toBeTruthy();
        expect(result.severity).toBe('warning');
        expect(result.description).toContain('Extra Kotlin string template parameters in target: $messages');
        expect(result.highlight).toContain('<e0>${messages.size}</e0>');
    });
}); 