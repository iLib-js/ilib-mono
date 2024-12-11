/*
 * Serializer.test.js - test the serializer superclass object
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

import Parser from '../src/Parser.js';
import Serializer from '../src/Serializer.js';
import IntermediateRepresentation from '../src/IntermediateRepresentation.js';
import SourceFile from '../src/SourceFile.js';

import {describe, expect, test} from '@jest/globals';

function rmrf(path) {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}

afterEach(function() {
    [
        "test/testfiles/test.txt",
        "test/testfiles/test2.txt"
    ].forEach(rmrf);
});

/**
 * @jest-environment node
 * @type {import('@jest/types').Global.TestFrameworkGlobals}
 */

class TestParser extends Parser {
    constructor() {
        super();
        this.name = "test";
        this.type = "test";
        this.extensions = [ "x", "y", "z" ];
        this.description = "A mock parser that doesn't really do a whole heck of a lot of anything.";
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
            ir: content, // straight-up, as is
            sourceFile
        })];
    }
}

class TestSerializer extends Serializer {
    constructor() {
        super();
        this.name = "test";
        this.type = "test";
        this.description = "A mock serializer that doesn't really do a whole heck of a lot of anything.";
    }

    /**
     * @param {IntermediateRepresentation} representation
     * @returns {SourceFile}
     */
    serialize(representation) {
        // does not actually serialize anything. Just use the content as is.
        return new SourceFile(representation.sourceFile.getPath(), {
            file: representation.sourceFile,
            content: representation.ir
        });
    }
}

describe("testSerializer", () => {
    test("SerializerNormal", () => {
        expect.assertions(1);

        const serializer = new TestSerializer();

        expect(serializer).toBeTruthy();
    });

    test("SerializerCannotInstantiateAbstractClass", () => {
        expect.assertions(1);

        expect(() => {
            new Serializer();
        }).toThrow();
    });

    test("SerializerGetName", () => {
        expect.assertions(2);

        const serializer = new TestSerializer();

        expect(serializer).toBeTruthy();

        expect(serializer.getName()).toBe("test");
    });

    test("SerializerGetDescription", () => {
        expect.assertions(2);

        const serializer = new TestSerializer();

        expect(serializer).toBeTruthy();

        expect(serializer.getDescription()).toBe("A mock serializer that doesn't really do a whole heck of a lot of anything.");
    });

    test("SerializerGetType", () => {
        expect.assertions(2);

        const serializer = new TestSerializer();

        expect(serializer).toBeTruthy();

        expect(serializer.getType()).toBe("test");
    });

    test("Writing a file", () => {
        expect.assertions(3);

        const parser = new TestParser();
        if (fs.existsSync("test/testfiles/test.txt")) {
            fs.unlinkSync("test/testfiles/test.txt");
        }
        fs.writeFileSync("test/testfiles/test.txt", "This is a test");
        const sourceFile = new SourceFile("test/testfiles/test.txt");

        const irArray = parser.parse(sourceFile);
        expect(irArray).toBeTruthy();
        const ir = irArray[0];
        expect(ir).toBeTruthy();

        const serializer = new TestSerializer();
        const newFile = serializer.serialize(ir);
        expect(newFile.isDirty()).toBeTruthy();
    });

    test("Writing a file gives the correct content", () => {
        expect.assertions(1);

        const parser = new TestParser();
        if (fs.existsSync("test/testfiles/test.txt")) {
            fs.unlinkSync("test/testfiles/test.txt");
        }
        fs.writeFileSync("test/testfiles/test.txt", "This is a test");
        const sourceFile = new SourceFile("test/testfiles/test.txt");

        const irArray = parser.parse(sourceFile);
        const ir = irArray[0];

        const serializer = new TestSerializer();
        const newFile = serializer.serialize(ir);
        newFile.write();

        const newContent = fs.readFileSync("test/testfiles/test.txt", "utf-8");
        expect(newContent).toBe("This is a test");
    });

    test("Update the representation and convert back to a source file", () => {
        expect.assertions(4);

        const parser = new TestParser();
        if (fs.existsSync("test/testfiles/test.txt")) {
            fs.unlinkSync("test/testfiles/test.txt");
        }
        fs.writeFileSync("test/testfiles/test.txt", "This is a test");
        const sourceFile = new SourceFile("test/testfiles/test.txt");

        const ir = parser.parse(sourceFile);
        expect(ir).toBeTruthy();
        expect(ir[0].getRepresentation()).toBe("This is a test");

        const serializer = new TestSerializer();
        const newIR = new IntermediateRepresentation({
            type: "string",
            ir: "This is a different test",
            sourceFile
        });

        if (fs.existsSync("test/testfiles/test2.txt")) {
            fs.unlinkSync("test/testfiles/test2.txt");
        }
        const newSourceFile = new SourceFile("test/testfiles/test2.txt", {
            file: serializer.serialize(newIR)
        });
        expect(newSourceFile.getContent()).toBe("This is a different test");

        newSourceFile.write();
        const newContent = fs.readFileSync("test/testfiles/test2.txt", "utf-8");
        expect(newContent).toBe("This is a different test");
    });
});

