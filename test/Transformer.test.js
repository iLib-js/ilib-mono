/*
 * Transformer.test.js - test the transformer superclass object
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

import Transformer from '../src/Transformer.js';
import IntermediateRepresentation from '../src/IntermediateRepresentation.js';
import SourceFile from '../src/SourceFile.js';

import {describe, expect, test} from '@jest/globals';

/**
 * @jest-environment node
 */

class TestSourceFile extends SourceFile {
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

class TestTransformer extends Transformer {
    name = "test";
    description = "A test transformer that doesn't really do a whole heck of a lot of anything.";
    type = "lines";

    constructor(options) {
        super(options);
    }

    // @override
    transform(representation) {
        // does not actually transform anything
        representation.getRepresentation().pop();
        return new IntermediateRepresentation({
            type: representation.getType(),
            ir: representation.getRepresentation(),
            sourceFile: representation.sourceFile
        });
    }
}

describe("testTransformer", () => {
    test("Transformer normal constructor", () => {
        expect.assertions(1);

        const transformer = new TestTransformer();

        expect(transformer).toBeTruthy();
    });

    test("Transformer cannot instantiate an abstract class directly", () => {
        expect.assertions(1);

        expect(() => {
            new Transformer();
        }).toThrow();
    });

    test("GetName returns the right name", () => {
        expect.assertions(2);

        const transformer = new TestTransformer();

        expect(transformer).toBeTruthy();

        expect(transformer.getName()).toBe("test");
    });

    test("GetDescription returns the right description", () => {
        expect.assertions(2);

        const transformer = new TestTransformer();

        expect(transformer).toBeTruthy();

        expect(transformer.getDescription()).toBe("A test transformer that doesn't really do a whole heck of a lot of anything.");
    });

    test("GetType return the right type", () => {
        expect.assertions(2);

        const transformer = new TestTransformer();

        expect(transformer).toBeTruthy();

        expect(transformer.getType()).toBe("lines");
    });

    test("Transforming a file", () => {
        expect.assertions(2);

        const transformer = new TestTransformer();
        const sourceFile = new TestSourceFile("test/testfiles/xliff/test.xliff");
        const representation = new IntermediateRepresentation({
            type: transformer.getType(),
            ir: ["This is a test", "this is only a test"],
            sourceFile
        });

        const ir = transformer.transform(representation);
        expect(ir).toBeTruthy();
        // deletes the last entry in the array
        expect(ir.getRepresentation()).toStrictEqual(["This is a test"]);
    });

    test("Make sure the representation is immutable", () => {
        expect.assertions(2);
    
        const transformer = new TestTransformer();
        const sourceFile = new TestSourceFile("test/testfiles/xliff/test.xliff");
        const representation = new IntermediateRepresentation({
            type: transformer.getType(),
            ir: ["This is a test", "this is only a test"],
            sourceFile
        });
    
        const ir = transformer.transform(representation);
        expect(ir).toBeTruthy();
        // should return a new object, not the same one
        expect(ir).not.toBe(representation);
    });
});

