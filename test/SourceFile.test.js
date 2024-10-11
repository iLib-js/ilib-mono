/*
 * SourceFile.test.js - test the source file object
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

import fs from 'fs';
import SourceFile from '../src/SourceFile.js';
import jest from 'jest-mock';

// Mock the getLogger function
const getLogger = (loggerName) => {
    return {
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    };
};

describe('SourceFile', () => {
    const filePath1 = './test/testfiles/testfile1.txt';
    const filePath2 = './test/testfiles/testfile2.txt';
    const filePath3 = './test/testfiles/testfile3.txt';
    const filePath4 = './test/testfiles/testfile4.txt';

    test('should throw an error if created without a file path', () => {
        expect.assertions(1);

        expect(() => new SourceFile()).toThrowError('Attempt to create a SourceFile without a file path');
    });

    test('should create a SourceFile instance with the correct properties', () => {
        expect.assertions(2);

        const sourceFile = new SourceFile(filePath1, { getLogger });
        expect(sourceFile.getPath()).toBe(filePath1);
        expect(sourceFile.getType()).toBe("");
    });

    test('should create a SourceFile instance with provided options', () => {
        expect.assertions(2);

        const customLogger = { log: jest.fn() };
        const type = "test";
        const sourceFile = new SourceFile(filePath1, {
            type
        });
        expect(sourceFile.getPath()).toBe(filePath1);
        expect(sourceFile.getType()).toBe("test");
    });

    test('should read the raw file into memory correctly', () => {
        expect.assertions(2);

        const sourceFile = new SourceFile(filePath1, { getLogger });

        expect(sourceFile.getRaw()).toBeDefined();
        expect(sourceFile.isDirty()).toBe(false);
    });

    test('should read the cooked file into memory correctly', () => {
        expect.assertions(2);

        const sourceFile = new SourceFile(filePath1, { getLogger });

        expect(sourceFile.getContent()).toBe('Mock file content');
        expect(sourceFile.isDirty()).toBe(false);
    });

    test('should get the path to the source file', () => {
        expect.assertions(1);

        const sourceFile = new SourceFile(filePath1, { getLogger });
        expect(sourceFile.getPath()).toBe(filePath1);
    });

    test('should get the raw contents of the file as a Buffer', () => {
        expect.assertions(2);

        const sourceFile = new SourceFile(filePath1, { getLogger });
        const rawBuffer = sourceFile.getRaw();

        expect(Buffer.isBuffer(rawBuffer)).toBe(true);
        expect(rawBuffer.toString('utf-8')).toBe('Mock file content');
    });

    test('should get the content of the file as a string', () => {
        expect.assertions(1);

        const sourceFile = new SourceFile(filePath1, { getLogger });
        expect(sourceFile.getContent()).toBe('Mock file content');
    });

   test('should get lines from the file content', () => {
        expect.assertions(3);

        const sourceFile = new SourceFile(filePath2, { getLogger });
        const lines = sourceFile.getLines();

        expect(Array.isArray(lines)).toBe(true);
        expect(lines).toHaveLength(3);
        expect(lines).toEqual(['Line 1', 'Line 2', 'Line 3']);
    });

    test('should set lines to the file content', () => {
        expect.assertions(1);

        const sourceFile = new SourceFile(filePath2, { getLogger });
        const newLines = ['New Line 1', 'New Line 2', 'New Line 3'];
        sourceFile.setLines(newLines);

        expect(sourceFile.getLines()).toEqual(newLines);
    });

    test('should not set lines to an empty array if null is provided', () => {
        expect.assertions(1);

        const sourceFile = new SourceFile(filePath2, { getLogger });
        sourceFile.setLines(null);

        expect(sourceFile.getLines()).toEqual(['Line 1', 'Line 2', 'Line 3']);
    });

    test('should not set lines to an empty array if undefined is provided', () => {
        expect.assertions(1);

        const sourceFile = new SourceFile(filePath2, { getLogger });
        sourceFile.setLines(undefined);

        expect(sourceFile.getLines()).toEqual(['Line 1', 'Line 2', 'Line 3']);
    });

    test('should not set lines to an empty array if lines are not provided', () => {
        expect.assertions(1);

        const sourceFile = new SourceFile(filePath2, { getLogger });
        sourceFile.setLines();

        expect(sourceFile.getLines()).toEqual(['Line 1', 'Line 2', 'Line 3']);
    });

    test('should handle empty lines in the file content', () => {
        expect.assertions(1);

        const sourceFile = new SourceFile(filePath3, { getLogger });

        expect(sourceFile.getLines()).toEqual(['', '']);
    });

    test('should handle a single line in the file content', () => {
        expect.assertions(1);

        const sourceFile = new SourceFile(filePath4, { getLogger });

        expect(sourceFile.getLines()).toEqual(['Single Line']);
    });

    test('should set lines to an empty array if an empty array is provided', () => {
        expect.assertions(2);

        const sourceFile = new SourceFile(filePath2, { getLogger });
        const emptyLines = [];

        expect(sourceFile.getLines()).toEqual(['Line 1', 'Line 2', 'Line 3']);
        sourceFile.setLines(emptyLines);
        expect(sourceFile.getLines()).toEqual(['']);
    });

    test('length is set correctly', () => {
        expect.assertions(1);

        const sourceFile = new SourceFile(filePath2, { getLogger });

        expect(sourceFile.getLength()).toBe(20);
    });

    test('length is updated after setLines', () => {
        expect.assertions(2);

        const sourceFile = new SourceFile(filePath2, { getLogger });

        expect(sourceFile.getLength()).toBe(20);
        const newLines = ['New Line 1', 'New Line 2', 'New Line 3'];
        sourceFile.setLines(newLines);
        expect(sourceFile.getLength()).toBe(32);
    });

    test('dirty flag is updated after setLines', () => {
        expect.assertions(2);

        const sourceFile = new SourceFile(filePath2, { getLogger });

        expect(sourceFile.isDirty()).toBeFalsy();
        const newLines = ['New Line 1', 'New Line 2', 'New Line 3'];
        sourceFile.setLines(newLines);
        expect(sourceFile.isDirty()).toBeTruthy();
    });

    test('write to another file', () => {
        expect.assertions(2);

        const outputFile = "./test/testfiles/x.txt";
        if (fs.existsSync(outputFile)) {
            fs.unlinkSync(outputFile);
        }

        const sourceFile = new SourceFile(filePath2, { getLogger });
        expect(fs.existsSync(outputFile)).toBeFalsy();
        sourceFile.write(outputFile);
        expect(fs.existsSync(outputFile)).toBeTruthy();
    });

    test('write to same file', () => {
        expect.assertions(1);

        const filePath = "./test/testfiles/x.txt";
        fs.writeFileSync(filePath, "This is a test.\nThis is only a test.\n", "utf-8");

        const sourceFile = new SourceFile(filePath, { getLogger });
        const newLines = ['Come, they told me', 'Pah rumppah pum pum'];
        sourceFile.setLines(newLines);
        sourceFile.write();

        const content = fs.readFileSync(filePath, "utf-8");
        expect(content).toBe("Come, they told me\nPah rumppah pum pum");
    });

    test('write to the same file after calling setContent', () => {
        expect.assertions(2);

        const filePath = "./test/testfiles/x.txt";
        fs.writeFileSync(filePath, "This is a test.\nThis is only a test.\n", "utf-8");

        const sourceFile = new SourceFile(filePath, { getLogger });
        expect(sourceFile.getContent()).toBe("This is a test.\nThis is only a test.\n");

        sourceFile.setContent("Come, they told me\nPah rumppah pum pum");
        sourceFile.write();

        const content = fs.readFileSync(filePath, "utf-8");
        expect(content).toBe("Come, they told me\nPah rumppah pum pum");
    });
});