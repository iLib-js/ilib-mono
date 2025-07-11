/*
 * ResourceJavaParams.test.js - Test for ResourceJavaParams rule
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

import ResourceJavaParams from '../src/ResourceJavaParams.js';
import { ResourceString, ResourceArray, ResourcePlural } from 'ilib-tools-common';
import { SourceFile, IntermediateRepresentation } from 'ilib-lint-common';

describe('ResourceJavaParams', () => {
    let rule;
    let sourceFile;

    beforeEach(() => {
        rule = new ResourceJavaParams();
        sourceFile = new SourceFile('test.properties');
    });

    test('should extract Java MessageFormat parameters correctly', () => {
        expect(rule.extractJavaParams('Hello {0}, you have {1} messages')).toEqual(['{0}', '{1}']);
        expect(rule.extractJavaParams('Price: {0,number,currency}')).toEqual(['{0,number,currency}']);
        expect(rule.extractJavaParams('Date: {0,date,short} at {0,time,short}')).toEqual(['{0,date,short}', '{0,time,short}']);
        expect(rule.extractJavaParams('No parameters here')).toEqual([]);
        expect(rule.extractJavaParams('')).toEqual([]);
        expect(rule.extractJavaParams(null)).toEqual([]);
    });

    test('should check if all required parameters are present', () => {
        expect(rule.hasAllRequiredParams(['{0}'], ['{0}'])).toBe(true);
        expect(rule.hasAllRequiredParams(['{0}', '{1}'], ['{0}', '{1}'])).toBe(true);
        expect(rule.hasAllRequiredParams(['{0}', '{1}'], ['{0}'])).toBe(false);
        expect(rule.hasAllRequiredParams(['{0}'], [])).toBe(false);
        expect(rule.hasAllRequiredParams(['{0,number,currency}'], ['{0,number,currency}'])).toBe(true);
        expect(rule.hasAllRequiredParams(['{0,number,currency}'], ['{0}'])).toBe(false);
        expect(rule.hasAllRequiredParams(['{0,number,currency}'], ['{0,date}'])).toBe(false);
    });

    test('should detect missing parameters in string resources', () => {
        const resource = new ResourceString({ key: 'test.key', source: 'Hello {0}, you have {1} messages', target: 'Hola {0}, tienes mensajes' });
        const ir = new IntermediateRepresentation({ type: 'resource', ir: [resource], sourceFile });

        const results = rule.match({ ir, locale: 'es-ES' });
        const error = Array.isArray(results) ? results.find(r => r && r.severity === 'error') : results;

        expect(error).toBeTruthy();
        expect(error.description).toContain('Missing Java MessageFormat parameters in target: {1}');
    });

    test('should not trigger when all parameters are present', () => {
        const resource = new ResourceString({ key: 'test.key', source: 'Hello {0}, you have {1} messages', target: 'Hola {0}, tienes {1} mensajes' });
        const ir = new IntermediateRepresentation({ type: 'resource', ir: [resource], sourceFile });

        const results = rule.match({ ir, locale: 'es-ES' });
        expect(results).toBeUndefined();
    });

    test('should not trigger when no parameters are present', () => {
        const resource = new ResourceString({ key: 'test.key', source: 'Hello world', target: 'Hola mundo' });
        const ir = new IntermediateRepresentation({ type: 'resource', ir: [resource], sourceFile });

        const results = rule.match({ ir, locale: 'es-ES' });
        expect(results).toBeUndefined();
    });

    test('should detect mismatched parameter formatting', () => {
        const resource = new ResourceString({ key: 'test.key', source: 'Price: {0,number,currency}', target: 'Precio: {0}' });
        const ir = new IntermediateRepresentation({ type: 'resource', ir: [resource], sourceFile });

        const results = rule.match({ ir, locale: 'es-ES' });
        const error = Array.isArray(results) ? results.find(r => r && r.severity === 'error') : results;

        expect(error).toBeTruthy();
        expect(error.description).toContain('Missing Java MessageFormat parameters in target: {0,number,currency}');
    });

    test('should handle array resources', () => {
        const resource = new ResourceArray({ key: 'test.key', source: ['Hello {0}', 'You have {1} messages'], target: ['Hola {0}', 'Tienes mensajes'] });
        const ir = new IntermediateRepresentation({ type: 'resource', ir: [resource], sourceFile });

        const results = rule.match({ ir, locale: 'es-ES' });
        const error = Array.isArray(results) && results.find(r => r && r.severity === 'error');
        expect(error).toBeTruthy();
        expect(error.description).toContain('Missing Java MessageFormat parameters in target array item [1]: {1}');
    });

    test('should handle plural resources', () => {
        const resource = new ResourcePlural({
            key: 'test.key',
            source: { one: 'You have {0} message', other: 'You have {0} messages' },
            target: { one: 'Tienes {0} mensaje', other: 'Tienes mensajes' }
        });
        const ir = new IntermediateRepresentation({ type: 'resource', ir: [resource], sourceFile });

        const results = rule.match({ ir, locale: 'es-ES' });
        const error = Array.isArray(results) && results.find(r => r && r.severity === 'error');
        expect(error).toBeTruthy();
        expect(error.description).toContain('Missing Java MessageFormat parameters in target plural (other): {0}');
    });

    test('should warn if there are extra parameters in the target (string)', () => {
        const resource = new ResourceString({ key: 'test.key', source: 'Hello {0}', target: 'Hola {0} y {1}' });
        const ir = new IntermediateRepresentation({ type: 'resource', ir: [resource], sourceFile });

        const results = rule.match({ ir, locale: 'es-ES' });
        const warning = Array.isArray(results) ? results.find(r => r && r.severity === 'warning') : results;
        expect(warning).toBeTruthy();
        expect(warning.severity).toBe('warning');
        expect(warning.description).toContain('Extra Java MessageFormat parameters in target: {1}');
    });

    test('should warn if there are extra parameters in the target (array)', () => {
        const resource = new ResourceArray({ key: 'test.key', source: ['Hello {0}', 'You have {1} messages'], target: ['Hola {0} y {2}', 'Tienes {1} mensajes'] });
        const ir = new IntermediateRepresentation({ type: 'resource', ir: [resource], sourceFile });

        const results = rule.match({ ir, locale: 'es-ES' });
        const warning = Array.isArray(results) && results.find(r => r && r.severity === 'warning');
        expect(warning).toBeTruthy();
        expect(warning.description).toContain('Extra Java MessageFormat parameters in target array item [0]: {2}');
    });

    test('should warn if there are extra parameters in the target (plural)', () => {
        const resource = new ResourcePlural({
            key: 'test.key',
            source: { one: 'You have {0} message', other: 'You have {0} messages' },
            target: { one: 'Tienes {0} mensaje', other: 'Tienes {0} mensajes y {1}' }
        });
        const ir = new IntermediateRepresentation({ type: 'resource', ir: [resource], sourceFile });

        const results = rule.match({ ir, locale: 'es-ES' });
        const warning = Array.isArray(results) && results.find(r => r && r.severity === 'warning');
        expect(warning).toBeTruthy();
        expect(warning.description).toContain('Extra Java MessageFormat parameters in target plural (other): {1}');
    });

    test('should highlight extra parameter in the target (string)', () => {
        const resource = new ResourceString({ key: 'test.key', source: 'Hello {0}', target: 'Hola {0} y {1}' });
        const ir = new IntermediateRepresentation({ type: 'resource', ir: [resource], sourceFile });
        const results = rule.match({ ir, locale: 'es-ES' });
        const warning = Array.isArray(results) ? results.find(r => r && r.severity === 'warning') : results;
        expect(warning).toBeTruthy();
        expect(warning.highlight).toContain('<e0>{1}</e0>');
        expect(warning.highlight).toContain('Hola {0} y <e0>{1}</e0>');
    });

    test('should highlight extra parameter in the target (array)', () => {
        const resource = new ResourceArray({ key: 'test.key', source: ['Hello {0}', 'You have {1} messages'], target: ['Hola {0} y {2}', 'Tienes {1} mensajes'] });
        const ir = new IntermediateRepresentation({ type: 'resource', ir: [resource], sourceFile });
        const results = rule.match({ ir, locale: 'es-ES' });
        const warning = Array.isArray(results) && results.find(r => r && r.severity === 'warning');
        expect(warning).toBeTruthy();
        expect(warning.highlight).toContain('<e0>{2}</e0>');
        expect(warning.highlight).toContain('Hola {0} y <e0>{2}</e0>');
    });

    test('should highlight extra parameter in the target (plural)', () => {
        const resource = new ResourcePlural({
            key: 'test.key',
            source: { one: 'You have {0} message', other: 'You have {0} messages' },
            target: { one: 'Tienes {0} mensaje', other: 'Tienes {0} mensajes y {1}' }
        });
        const ir = new IntermediateRepresentation({ type: 'resource', ir: [resource], sourceFile });
        const results = rule.match({ ir, locale: 'es-ES' });
        const warning = Array.isArray(results) && results.find(r => r && r.severity === 'warning');
        expect(warning).toBeTruthy();
        expect(warning.highlight).toContain('<e0>{1}</e0>');
        expect(warning.highlight).toContain('Tienes {0} mensajes y <e0>{1}</e0>');
    });

    test('should highlight multiple extra parameters in the target (string)', () => {
        const resource = new ResourceString({ key: 'test.key', source: 'Hello {0}', target: 'Hola {0} y {1} y {2}' });
        const ir = new IntermediateRepresentation({ type: 'resource', ir: [resource], sourceFile });
        const results = rule.match({ ir, locale: 'es-ES' });
        const warning = Array.isArray(results) ? results.find(r => r && r.severity === 'warning') : results;
        expect(warning).toBeTruthy();
        expect(warning.highlight).toContain('<e0>{1}</e0>');
        expect(warning.highlight).toContain('<e1>{2}</e1>');
        expect(warning.highlight).toContain('Hola {0} y <e0>{1}</e0> y <e1>{2}</e1>');
    });
});