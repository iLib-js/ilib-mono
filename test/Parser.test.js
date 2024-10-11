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

class MockSourceFile extends SourceFile {
    constructor(path, options) {
        super(path, options ?? { getLogger: () => { } });
        this.content = "This is a test";
        this.dirty = false;
    }

    getContent() {
        return this.content;
    }

    setContent(content) {
        this.content = content;
        this.dirty = true;
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
        return;
    }
}

class MockParser extends Parser {
    constructor() {
        super();
        this.name = "mock";
        this.extensions = [ "x", "y", "z" ];
        this.description = "A mock parser that doesn't really do a whole heck of a lot of anything.";
    }

    // @override
    getType() {
        return "ast";
    }

    // @override
    parse(sourceFile) {
        // does not actually parse anything
        const content = sourceFile.getContent();
        return new IntermediateRepresentation({
            type: "resource",
            ir: content,
            sourceFile
        });
    }

    // @override
    get canWrite() {
        return true;
    }

    // @override
    write(ir) {
        const newSource = new MockSourceFile(ir.sourceFile.getPath(), { getLogger: () => { } });
        newSource.setContent(ir.getRepresentation());
        return newSource;
    }
}

describe("testParser", () => {
    test("ParserNormal", () => {
        expect.assertions(1);

        const parser = new MockParser();

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

        const parser = new MockParser();

        expect(parser).toBeTruthy();

        expect(parser.getName()).toBe("mock");
    });

    test("ParserGetDescription", () => {
        expect.assertions(2);

        const parser = new MockParser();

        expect(parser).toBeTruthy();

        expect(parser.getDescription()).toBe("A mock parser that doesn't really do a whole heck of a lot of anything.");
    });

    test("ParserGetExtensions", () => {
        expect.assertions(2);

        const parser = new MockParser();

        expect(parser).toBeTruthy();

        expect(parser.getExtensions()).toEqual([ "x", "y", "z" ]);
    });

    test("ParserGetType", () => {
        expect.assertions(2);

        const parser = new MockParser();

        expect(parser).toBeTruthy();

        expect(parser.getType()).toBe("ast");
    });

    test("ParserGetCanWrite", () => {
        expect.assertions(2);

        const parser = new MockParser();

        expect(parser).toBeTruthy();

        expect(parser.canWrite).toBe(false);
    });

    test("Parsing a file", () => {
        expect.assertions(2);

        const parser = new MockParser();
        const sourceFile = new MockSourceFile("test/testfiles/xliff/test.xliff");

        const ir = parser.parse(sourceFile);
        expect(ir).toBeTruthy();
        expect(ir.getRepresentation()).toBe("This is a test");
    });

    test("Writing a file", () => {
        expect.assertions(2);

        const parser = new MockParser();
        const sourceFile = new MockSourceFile("test/testfiles/xliff/test.xliff");

        const ir = parser.parse(sourceFile);
        expect(ir).toBeTruthy();

        const newFile = parser.write(ir);
        expect(newFile.isDirty()).toBeTruthy();
    });

    test("Update the representation and convert back to a source file", () => {
        expect.assertions(3);

        const parser = new MockParser();
        const sourceFile = new MockSourceFile("test/testfiles/xliff/test.xliff");

        const ir = parser.parse(sourceFile);
        expect(ir).toBeTruthy();
        expect(ir.getRepresentation()).toBe("This is a test");

        const newIR = new IntermediateRepresentation({
            type: "string",
            ir: "This is a different test",
            sourceFile
        });

        const newSourceFile = parser.write(newIR);
        expect(newSourceFile.getContent()).toBe("This is a different test");
    });
});

