/*
 * ErrorFilterTransformer.test.js
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

import { Transformer, IntermediateRepresentation, Result } from "ilib-lint-common";
import { ResourceString, ResourceArray, ResourcePlural } from "ilib-tools-common";

import ErrorFilterTransformer from "../src/plugins/ErrorFilterTransformer.js";

describe("ErrorFilterTransformer", () => {
    test("is a subclass of Transformer", () => {
        expect.assertions(1);

        expect(ErrorFilterTransformer.prototype instanceof Transformer).toBeTruthy();
    });

    test("can be constructed", () => {
        expect.assertions(1);

        const eft = new ErrorFilterTransformer();
        expect(eft).toBeInstanceOf(ErrorFilterTransformer);
    });

    test("can filter errors out of an intermediate representation", () => {
        expect.assertions(1);

        const eft = new ErrorFilterTransformer();
        const resource1 = new ResourceString({
            project: "project",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "path/to/file.js",
            reskey: "key1",
            source: "source1",
            target: "target1"
        });
        const resource2 = new ResourceString({
            project: "project",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "path/to/file.js",
            reskey: "key2",
            source: "source2",
            target: "target2"
        });
        const resources = [
            resource1,
            resource2
        ];
        const results = [
            new Result({
                severity: "error",
                pathName: "path/to/file.js",
                description: "error description",
                rule: jest.fn(() => "rule"),
                highlight: "highlight",
                id: "key1",
                source: "source1",
                locale: "fr-FR"
            })
        ];

        const representation = new IntermediateRepresentation({
            type: "resource",
            ir: resources,
            sourceFile: jest.fn(() => "sourceFile")
        });

        const transformed = eft.transform(representation, results, undefined);

        expect(transformed).toBeDefined();
        const ir = transformed.getRepresentation();
        expect(Array.isArray(ir)).toBeTruthy();
        expect(ir.length).toBe(1);
        // resource1 should be filtered out because it has an error
        expect(ir[0]).toEqual(resource2);
    });
    
    test("returns the same represetation if there are only warnings", () => {
        expect.assertions(1);

        const eft = new ErrorFilterTransformer();
        const resource1 = new ResourceString({
            project: "project",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "path/to/file.js",
            reskey: "key1",
            source: "source1",
            target: "target1"
        });
        const resource2 = new ResourceString({
            project: "project",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "path/to/file.js",
            reskey: "key2",
            source: "source2",
            target: "target2"
        });
        const resources = [
            resource1,
            resource2
        ];
        const results = [
            new Result({
                // this is a warning, not an error!
                severity: "warning",
                pathName: "path/to/file.js",
                description: "warning description",
                rule: jest.fn(() => "rule"),
                highlight: "highlight",
                id: "key1",
                source: "source1",
                locale: "fr-FR"
            })
        ];

        const representation = new IntermediateRepresentation({
            type: "resource",
            ir: resources,
            sourceFile: jest.fn(() => "sourceFile")
        });

        const transformed = eft.transform(representation, results, undefined);

        expect(transformed).toBe(representation);
    });
    
    test("returns the same representation if there are no results", () => {
        expect.assertions(1);

        const eft = new ErrorFilterTransformer();
        const resource1 = new ResourceString({
            project: "project",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "path/to/file.js",
            reskey: "key1",
            source: "source1",
            target: "target1"
        });
        const resource2 = new ResourceString({
            project: "project",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "path/to/file.js",
            reskey: "key2",
            source: "source2",
            target: "target2"
        });
        const resources = [
            resource1,
            resource2
        ];

        const representation = new IntermediateRepresentation({
            type: "resource",
            ir: resources,
            sourceFile: jest.fn(() => "sourceFile")
        });

        const transformed = eft.transform(representation, [], undefined);

        expect(transformed).toBe(representation);
    });

    test("returns the original representation if it is not a resource representation", () => {
        expect.assertions(1);

        const eft = new ErrorFilterTransformer();
        const representation = new IntermediateRepresentation({
            type: "not-resource",
            ir: "ir",
            sourceFile: "sourceFile"
        });

        const transformed = eft.transform(representation, [], undefined);

        expect(transformed).toBe(representation);
    });
    
    test("returns the original representation if the representation is empty", () => {
        expect.assertions(1);

        const eft = new ErrorFilterTransformer();
        const representation = new IntermediateRepresentation({
            type: "resource",
            ir: [],
            sourceFile: "sourceFile"
        });

        const transformed = eft.transform(representation, [], undefined);

        expect(transformed).toBe(representation);
    });
    
    test("returns the original representation if the results only contains errors that do not apply to the resources", () => {
        expect.assertions(1);

        const eft = new ErrorFilterTransformer();
        const resource1 = new ResourceString({
            project: "project",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "path/to/file.js",
            reskey: "key1",
            source: "source1",
            target: "target1"
        });
        const resource2 = new ResourceString({
            project: "project",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "path/to/file.js",
            reskey: "key2",
            source: "source2",
            target: "target2"
        });
        const resources = [
            resource1,
            resource2
        ];
        const results = [
            new Result({
                severity: "error",
                pathName: "path/to/other/file.js",
                description: "error description",
                rule: jest.fn(() => "rule"),
                highlight: "highlight",
                id: "key58",    // not in the resources array above
                source: "source1",
                locale: "fr-FR"
            })
        ];

        const representation = new IntermediateRepresentation({
            type: "resource",
            ir: resources,
            sourceFile: jest.fn(() => "sourceFile")
        });

        const transformed = eft.transform(representation, results, undefined);

        expect(transformed).toBe(representation);
    });
});