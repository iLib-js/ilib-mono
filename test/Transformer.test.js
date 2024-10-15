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

class MockTransformer extends Transformer {
    name = "mock";
    description = "A mock transformer that doesn't really do a whole heck of a lot of anything.";
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
    test("TransformerNormal", () => {
        expect.assertions(1);

        const transformer = new MockTransformer();

        expect(transformer).toBeTruthy();
    });

    test("TransformerCannotInstantiateAbstractClass", () => {
        expect.assertions(1);

        expect(() => {
            new Transformer();
        }).toThrow();
    });

    test("TransformerGetName", () => {
        expect.assertions(2);

        const transformer = new MockTransformer();

        expect(transformer).toBeTruthy();

        expect(transformer.getName()).toBe("mock");
    });

    test("TransformerGetDescription", () => {
        expect.assertions(2);

        const transformer = new MockTransformer();

        expect(transformer).toBeTruthy();

        expect(transformer.getDescription()).toBe("A mock transformer that doesn't really do a whole heck of a lot of anything.");
    });

    test("TransformerGetType", () => {
        expect.assertions(2);

        const transformer = new MockTransformer();

        expect(transformer).toBeTruthy();

        expect(transformer.getType()).toBe("lines");
    });

    test("Transforming a file", () => {
        expect.assertions(2);

        const transformer = new MockTransformer();
        const sourceFile = new MockSourceFile("test/testfiles/xliff/test.xliff");
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
});

