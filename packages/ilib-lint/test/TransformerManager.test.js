/*
 * TransformerManager.test.js - test the Transformer factory
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

import { Transformer } from 'ilib-lint-common';

import TransformerManager from '../src/TransformerManager.js';

import ErrorFilterTransformer from '../src/plugins/ErrorFilterTransformer.js';

class MockTransformer extends Transformer {
    constructor(options) {
        super(options);
        this.name = "mock-transformer";
        this.type = "xyz";
    }

    transform(representation) {
        return "";
    }
}

// does not extend Transformer
class NotMockTransformer {
    constructor(options) {
        this.name = "not-mock-transformer";
        this.extensions = [ "xyz" ];
    }

    getExtensions() {
        return this.extensions;
    }
}

describe("testTransformerManager", () => {
    test("TransformerManager nothing to get when empty", () => {
        expect.assertions(1);

        const mgr = new TransformerManager();
        // not defined yet
        const transformer = mgr.get("js");

        expect(transformer).toBeUndefined();
    });

    test("TransformerManager add a transformer", () => {
        expect.assertions(3);

        const mgr = new TransformerManager();
        let transformer = mgr.get("mock-transformer");
        expect(transformer).toBeUndefined();

        mgr.add([MockTransformer]);
        transformer = mgr.get("mock-transformer");

        expect(transformer).toBeDefined();
        expect(transformer instanceof MockTransformer).toBeTruthy();
    });

    test("TransformerManager add transformer that do not inherit from Transformer", () => {
        expect.assertions(2);

        const mgr = new TransformerManager();
        let transformer = mgr.get("not-mock-transformer");
        expect(transformer).toBeUndefined();

        mgr.add([NotMockTransformer]);
        transformer = mgr.get("not-mock-transformer");

        expect(transformer).toBeUndefined();
    });

    test("TransformerManager make sure the built-in transformer are there", () => {
        expect.assertions(2);

        const mgr = new TransformerManager();
        let transformer = mgr.get("errorfilter");

        expect(transformer).toBeDefined();
        expect(transformer instanceof ErrorFilterTransformer).toBeTruthy();
    });

    test("TransformerManager return a list of transformers of a given type", () => {
        expect.assertions(4);

        const mgr = new TransformerManager();
        mgr.add([MockTransformer]);

        const transformers = mgr.getTransformers("xyz");

        expect(transformers).toBeDefined();
        expect(Array.isArray(transformers)).toBeTruthy();
        expect(transformers.length).toBe(1);
        expect(transformers[0]).toBe("mock-transformer");
    });
});

