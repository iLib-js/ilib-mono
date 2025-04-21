/*
 * IntermediateRepresentation.test.js - test the IntermediateRepresentation class
 *
 * Copyright © 2024-2025 JEDLSoft
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

import IntermediateRepresentation from '../src/IntermediateRepresentation.js';
import SourceFile from '../src/SourceFile.js';
import FileStats from '../src/FileStats.js';

import {describe, expect, test} from '@jest/globals';

/**
 * @jest-environment node
 */

describe('IntermediateRepresentation', () => {
    test('should throw an error if created without required parameters', () => {
        expect.assertions(1);

        // @ts-ignore
        expect(() => new IntermediateRepresentation()).toThrowError('Missing required parameters in the IntermediateRepresentation constructor: type, ir, sourceFile');
    });

    test('should create an IntermediateRepresentation instance with the correct properties', () => {
        expect.assertions(4);

        const type = 'test';
        const ir = { test: 'test' };
        const sourceFile = new SourceFile('test', { getLogger: () => {} });
        const stats = new FileStats();
        const irInstance = new IntermediateRepresentation({
            type,
            ir,
            sourceFile,
            stats
        });
        expect(irInstance.type).toBe(type);
        expect(irInstance.ir).toBe(ir);
        expect(irInstance.sourceFile).toBe(sourceFile);
        expect(irInstance.stats).toBe(stats);
    });

    test("should set dirty to false by default", () => {
        expect.assertions(1);

        const irInstance = new IntermediateRepresentation({
            type: 'test',
            ir: { test: 'test' },
            sourceFile: new SourceFile('test', { getLogger: () => { } })
        });
        expect(irInstance.isDirty()).toBe(false);
    });

    test("should set dirty to true if passed in the constructor", () => {
        expect.assertions(1);

        const irInstance = new IntermediateRepresentation({
            type: 'test',
            ir: { test: 'test' },
            sourceFile: new SourceFile('test', { getLogger: () => { } }),
            dirty: true
        });
        expect(irInstance.isDirty()).toBe(true);
    });

    test("should return the correct type from getType()", () => {
        expect.assertions(1);

        const type = 'test';
        const irInstance = new IntermediateRepresentation({
            type,
            ir: { test: 'test' },
            sourceFile: new SourceFile('test', { getLogger: () => { } })
        });
        expect(irInstance.getType()).toBe(type);
    });

    test("should return the correct representation from getRepresentation()", () => {
        expect.assertions(1);

        const ir = { test: 'test' };
        const irInstance = new IntermediateRepresentation({
            type: 'test',
            ir,
            sourceFile: new SourceFile('test', { getLogger: () => { } })
        });
        expect(irInstance.getRepresentation()).toBe(ir);
    });

    test("should return the correct source file from getSourceFile()", () => {
        expect.assertions(1);

        const sourceFile = new SourceFile('test', { getLogger: () => { } });
        const irInstance = new IntermediateRepresentation({
            type: 'test',
            ir: { test: 'test' },
            sourceFile
        });
        expect(irInstance.getSourceFile()).toBe(sourceFile);
    });

    test("should return the correct stats from getStats()", () => {
        expect.assertions(1);

        const stats = new FileStats();
        const irInstance = new IntermediateRepresentation({
            type: 'test',
            ir: { test: 'test' },
            sourceFile: new SourceFile('test', { getLogger: () => { } }),
            stats
        });
        expect(irInstance.stats).toBe(stats);
    });
});
