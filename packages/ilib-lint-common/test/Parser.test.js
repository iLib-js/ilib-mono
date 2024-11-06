/*
 * Parser.test.js - test the parser superclass object
 *
 * Copyright © 2022-2024 JEDLSoft
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

import Parser from '../src/Parser.js';
import IntermediateRepresentation from '../src/IntermediateRepresentation.js';
import SourceFile from '../src/SourceFile.js';

import {describe, expect, test} from '@jest/globals';

/**
 * @jest-environment node
 */

/** A mock parser that doesn't actually read anything from disk or parse anything. */
class MockSourceFile extends SourceFile {
    constructor(path, options) {
        super(path, options ?? { getLogger: () => { } });
        this.content = "This is a test";
        this.dirty = false;
    }

    getContent() {
        return this.content;
    }

    getPath() {
        return this.filePath;
    }

    getRaw() {
        return Buffer.from(this.content);
    }

    isDirty() {
        return this.dirty;
    }

    write() {
        this.dirty = false;
        return true;
    }
}

class TestParser extends Parser {
    constructor() {
        super();
        this.name = "test";
        this.extensions = [ "x", "y", "z" ];
        this.description = "A test parser that doesn't really do a whole heck of a lot of anything.";
    }

    // @override
    getType() {
        return "ast";
    }

    /**
     * @param {SourceFile} sourceFile
     * @returns {IntermediateRepresentation[]}
     */
    parse(sourceFile) {
        // does not actually parse anything
        const content = sourceFile.getContent();
        return [new IntermediateRepresentation({
            type: "resource",
            ir: content,
            sourceFile
        })];
    }
}

describe("testParser", () => {
    test("ParserNormal", () => {
        expect.assertions(1);

        const parser = new TestParser();

        expect(parser).toBeTruthy();
    });

    test("ParserCannotInstantiateAbstractClass", () => {
        expect.assertions(1);

        expect(() => {
            new Parser();
        }).toThrow();
    });

    test("ParserGetName", () => {
        expect.assertions(2);

        const parser = new TestParser();

        expect(parser).toBeTruthy();

        expect(parser.getName()).toBe("test");
    });

    test("ParserGetDescription", () => {
        expect.assertions(2);

        const parser = new TestParser();

        expect(parser).toBeTruthy();

        expect(parser.getDescription()).toBe("A test parser that doesn't really do a whole heck of a lot of anything.");
    });

    test("ParserGetExtensions", () => {
        expect.assertions(2);

        const parser = new TestParser();

        expect(parser).toBeTruthy();

        expect(parser.getExtensions()).toEqual([ "x", "y", "z" ]);
    });

    test("ParserGetType", () => {
        expect.assertions(2);

        const parser = new TestParser();

        expect(parser).toBeTruthy();

        expect(parser.getType()).toBe("ast");
    });

    test("Parsing a file", () => {
        expect.assertions(4);

        const parser = new TestParser();
        const sourceFile = new MockSourceFile("test/testfiles/xliff/test.xliff");

        const irArray = parser.parse(sourceFile);
        expect(irArray).toBeTruthy();
        expect(irArray.length).toBe(1);
        const ir = irArray[0];
        expect(ir).toBeTruthy();
        expect(ir.getRepresentation()).toBe("This is a test");
    });
});

