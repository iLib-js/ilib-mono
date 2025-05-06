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

import { Transformer, IntermediateRepresentation, Result, SourceFile } from "ilib-lint-common";
import { ResourceString, ResourceArray, ResourcePlural } from "ilib-tools-common";
import { jest } from "@jest/globals";

import ErrorFilterTransformer from "../../src/plugins/ErrorFilterTransformer.js";
import ResourceFixer from "../../src/plugins/resource/ResourceFixer.js";
import ResourceStringFixCommand from "../../src/plugins/resource/ResourceStringFixCommand.js";

const sourceFile = new SourceFile("path/to/file.xliff", {
    sourceLocale: "en-US",
    type: "resource",
});

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

    test("can filter errors out of an intermediate representation with resource strings", () => {
        expect.assertions(4);

        const eft = new ErrorFilterTransformer();
        const resource1 = new ResourceString({
            project: "project",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "path/to/file.js",
            reskey: "key1",
            source: "source1",
            target: "target1",
            resfile: "path/to/resfile.xliff",
        });
        const resource2 = new ResourceString({
            project: "project",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "path/to/file.js",
            reskey: "key2",
            source: "source2",
            target: "target2",
            resfile: "path/to/resfile.xliff",
        });
        const resources = [resource1, resource2];
        const results = [
            new Result({
                severity: "error",
                pathName: "path/to/resfile.xliff",
                description: "error description",
                rule: jest.fn(() => "rule"),
                highlight: "highlight",
                id: "key1",
                source: "source1",
                locale: "fr-FR",
            }),
        ];

        const representation = new IntermediateRepresentation({
            type: "resource",
            ir: resources,
            sourceFile,
        });

        const transformed = eft.transform(representation, results);

        expect(transformed).toBeDefined();
        const ir = transformed.getRepresentation();
        expect(Array.isArray(ir)).toBeTruthy();
        expect(ir.length).toBe(1);
        // resource1 should be filtered out because it has an error
        expect(ir[0]).toEqual(resource2);
    });

    test("can filter errors out of an intermediate representation when the resources do not come from a resource file", () => {
        expect.assertions(4);

        const eft = new ErrorFilterTransformer();
        const resource1 = new ResourceString({
            project: "project",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "path/to/file.js",
            reskey: "key1",
            source: "source1",
            target: "target1",
        });
        const resource2 = new ResourceString({
            project: "project",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "path/to/file.js",
            reskey: "key2",
            source: "source2",
            target: "target2",
        });
        const resources = [resource1, resource2];
        const results = [
            new Result({
                severity: "error",
                pathName: "path/to/file.js",
                description: "error description",
                rule: jest.fn(() => "rule"),
                highlight: "highlight",
                id: "key1",
                source: "source1",
                locale: "fr-FR",
            }),
        ];

        const representation = new IntermediateRepresentation({
            type: "resource",
            ir: resources,
            sourceFile,
        });

        const transformed = eft.transform(representation, results);

        expect(transformed).toBeDefined();
        const ir = transformed.getRepresentation();
        expect(Array.isArray(ir)).toBeTruthy();
        expect(ir.length).toBe(1);
        // resource1 should be filtered out because it has an error
        expect(ir[0]).toEqual(resource2);
    });

    test("can filter errors out of an intermediate representation with resource arrays", () => {
        expect.assertions(4);

        const eft = new ErrorFilterTransformer();
        const resource1 = new ResourceArray({
            project: "project",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "path/to/file.js",
            reskey: "key1",
            source: ["source1", "source2", "source3"],
            target: ["target1", "target2", "target3"],
            resfile: "path/to/resfile.xliff",
        });
        const resource2 = new ResourceArray({
            project: "project",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "path/to/file.js",
            reskey: "key2",
            source: ["sourceA", "sourceB", "sourceC"],
            target: ["targetA", "targetB", "targetC"],
            resfile: "path/to/resfile.xliff",
        });
        const resources = [resource1, resource2];
        const results = [
            new Result({
                severity: "error",
                pathName: "path/to/resfile.xliff",
                description: "error description",
                rule: jest.fn(() => "rule"),
                highlight: "highlight",
                id: "key1",
                source: '["source1", "source2", "source3"]',
                locale: "fr-FR",
            }),
        ];

        const representation = new IntermediateRepresentation({
            type: "resource",
            ir: resources,
            sourceFile,
        });

        const transformed = eft.transform(representation, results);

        expect(transformed).toBeDefined();
        const ir = transformed.getRepresentation();
        expect(Array.isArray(ir)).toBeTruthy();
        expect(ir.length).toBe(1);
        // resource1 should be filtered out because it has an error
        expect(ir[0]).toEqual(resource2);
    });

    test("can filter errors out of an intermediate representation with resource plurals", () => {
        expect.assertions(4);

        const eft = new ErrorFilterTransformer();
        const resource1 = new ResourcePlural({
            project: "project",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "path/to/file.js",
            reskey: "key1",
            source: {
                one: "source1",
                other: "source2",
            },
            target: {
                one: "target1",
                other: "target2",
            },
            resfile: "path/to/resfile.xliff",
        });
        const resource2 = new ResourceArray({
            project: "project",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "path/to/file.js",
            reskey: "key2",
            source: {
                one: "sourceA",
                other: "sourceB",
            },
            target: {
                one: "targetA",
                manyy: "targetB",
                other: "targetC",
            },
            resfile: "path/to/resfile.xliff",
        });
        const resources = [resource1, resource2];
        const results = [
            new Result({
                severity: "error",
                pathName: "path/to/resfile.xliff",
                description: "error description",
                rule: jest.fn(() => "rule"),
                highlight: "highlight",
                id: "key1",
                source: '{"one": "source1", "other": "source2"}',
                locale: "fr-FR",
            }),
        ];

        const representation = new IntermediateRepresentation({
            type: "resource",
            ir: resources,
            sourceFile,
        });

        const transformed = eft.transform(representation, results);

        expect(transformed).toBeDefined();
        const ir = transformed.getRepresentation();
        expect(Array.isArray(ir)).toBeTruthy();
        expect(ir.length).toBe(1);
        // resource1 should be filtered out because it has an error
        expect(ir[0]).toEqual(resource2);
    });

    test("returns the same representation if there are only warnings", () => {
        expect.assertions(1);

        const eft = new ErrorFilterTransformer();
        const resource1 = new ResourceString({
            project: "project",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "path/to/file.js",
            reskey: "key1",
            source: "source1",
            target: "target1",
            resfile: "path/to/resfile.xliff",
        });
        const resource2 = new ResourceString({
            project: "project",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "path/to/file.js",
            reskey: "key2",
            source: "source2",
            target: "target2",
            resfile: "path/to/resfile.xliff",
        });
        const resources = [resource1, resource2];
        const results = [
            new Result({
                // this is a warning, not an error!
                severity: "warning",
                pathName: "path/to/resfile.xliff",
                description: "warning description",
                rule: jest.fn(() => "rule"),
                highlight: "highlight",
                id: "key1",
                source: "source1",
                locale: "fr-FR",
            }),
        ];

        const representation = new IntermediateRepresentation({
            type: "resource",
            ir: resources,
            sourceFile,
        });

        const transformed = eft.transform(representation, results);

        expect(transformed).toStrictEqual(representation);
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
            target: "target1",
            resfile: "path/to/resfile.xliff",
        });
        const resource2 = new ResourceString({
            project: "project",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "path/to/file.js",
            reskey: "key2",
            source: "source2",
            target: "target2",
            resfile: "path/to/resfile.xliff",
        });
        const resources = [resource1, resource2];

        const representation = new IntermediateRepresentation({
            type: "resource",
            ir: resources,
            sourceFile,
        });

        const transformed = eft.transform(representation, []);

        expect(transformed).toStrictEqual(representation);
    });

    test("returns the same representation if results are undefined", () => {
        expect.assertions(1);

        const eft = new ErrorFilterTransformer();
        const resource1 = new ResourceString({
            project: "project",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "path/to/file.js",
            reskey: "key1",
            source: "source1",
            target: "target1",
            resfile: "path/to/resfile.xliff",
        });
        const resource2 = new ResourceString({
            project: "project",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "path/to/file.js",
            reskey: "key2",
            source: "source2",
            target: "target2",
            resfile: "path/to/resfile.xliff",
        });
        const resources = [resource1, resource2];

        const representation = new IntermediateRepresentation({
            type: "resource",
            ir: resources,
            sourceFile,
        });

        const transformed = eft.transform(representation, undefined);

        expect(transformed).toStrictEqual(representation);
    });

    test("returns the original representation if it is not a resource representation", () => {
        expect.assertions(1);

        const eft = new ErrorFilterTransformer();
        const representation = new IntermediateRepresentation({
            type: "not-resource",
            ir: "ir",
            sourceFile,
        });

        const transformed = eft.transform(representation, []);

        expect(transformed).toBe(representation);
    });

    test("returns the original representation if the representation is empty", () => {
        expect.assertions(1);

        const eft = new ErrorFilterTransformer();
        const representation = new IntermediateRepresentation({
            type: "resource",
            ir: [],
            sourceFile,
        });

        const transformed = eft.transform(representation, []);

        expect(transformed).toStrictEqual(representation);
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
            target: "target1",
            resfile: "path/to/resfile.xliff",
        });
        const resource2 = new ResourceString({
            project: "project",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "path/to/file.js",
            reskey: "key2",
            source: "source2",
            target: "target2",
            resfile: "path/to/resfile.xliff",
        });
        const resources = [resource1, resource2];
        const results = [
            new Result({
                severity: "error",
                pathName: "path/to/resfile.xliff",
                description: "error description",
                rule: jest.fn(() => "rule"),
                highlight: "highlight",
                id: "key58", // not in the resources array above
                source: "source1",
                locale: "fr-FR",
            }),
        ];

        const representation = new IntermediateRepresentation({
            type: "resource",
            ir: resources,
            sourceFile,
        });

        const transformed = eft.transform(representation, results);

        expect(transformed).toStrictEqual(representation);
    });

    test("returns the original representation if the results only contains errors that do not apply to the resources because of the locale", () => {
        expect.assertions(1);

        const eft = new ErrorFilterTransformer();
        const resource1 = new ResourceString({
            project: "project",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "path/to/file.js",
            reskey: "key1",
            source: "source1",
            target: "target1",
            resfile: "path/to/resfile.xliff",
        });
        const resource2 = new ResourceString({
            project: "project",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "path/to/file.js",
            reskey: "key2",
            source: "source2",
            target: "target2",
            resfile: "path/to/resfile.xliff",
        });
        const resources = [resource1, resource2];
        const results = [
            new Result({
                severity: "error",
                pathName: "path/to/resfile.xliff",
                description: "error description",
                rule: jest.fn(() => "rule"),
                highlight: "highlight",
                id: "key1",
                source: "source1",
                locale: "de-DE",
            }),
        ];

        const representation = new IntermediateRepresentation({
            type: "resource",
            ir: resources,
            sourceFile,
        });

        const transformed = eft.transform(representation, results);

        // results should not apply because of the locale, so the representation should be the same
        const expected = new IntermediateRepresentation({
            type: "resource",
            ir: resources,
            sourceFile,
        });

        expect(transformed).toEqual(expected);
    });

    test("returns the original representation if the results only contains errors that do not apply to the resources because of the path", () => {
        expect.assertions(1);

        const eft = new ErrorFilterTransformer();
        const resource1 = new ResourceString({
            project: "project",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "path/to/file.js",
            reskey: "key1",
            source: "source1",
            target: "target1",
            resfile: "path/to/resfile.xliff",
        });
        const resource2 = new ResourceString({
            project: "project",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "path/to/file.js",
            reskey: "key2",
            source: "source2",
            target: "target2",
            resfile: "path/to/resfile.xliff",
        });
        const resources = [resource1, resource2];
        const results = [
            new Result({
                severity: "error",
                pathName: "path/to/this/file.xliff", // not in the resources array above
                description: "error description",
                rule: jest.fn(() => "rule"),
                highlight: "highlight",
                id: "key1",
                source: "source1",
                locale: "fr-FR",
            }),
        ];

        const representation = new IntermediateRepresentation({
            type: "resource",
            ir: resources,
            sourceFile,
        });

        const transformed = eft.transform(representation, results);

        // results should not apply because of the path, so the representation should be the same
        const expected = new IntermediateRepresentation({
            type: "resource",
            ir: resources,
            sourceFile,
        });

        expect(transformed).toEqual(expected);
    });

    test("filters out the resource with the right hash and leaves the other locales alone", () => {
        expect.assertions(1);

        const eft = new ErrorFilterTransformer();
        const resource1 = new ResourceString({
            project: "project",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "path/to/file.js",
            reskey: "key1",
            source: "source1",
            target: "target1",
            resfile: "path/to/fr-FR.xliff",
        });
        const resource2 = new ResourceString({
            project: "project",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            pathName: "path/to/file.js",
            reskey: "key1",
            source: "source1",
            target: "target2",
            resfile: "path/to/de-DE.xliff",
        });
        const resources = [resource1, resource2];
        const results = [
            new Result({
                severity: "error",
                pathName: "path/to/de-DE.xliff", // only matches the second resource
                description: "error description",
                rule: jest.fn(() => "rule"),
                highlight: "highlight",
                id: "key1",
                source: "source1",
                locale: "de-DE",
            }),
        ];

        const representation = new IntermediateRepresentation({
            type: "resource",
            ir: resources,
            sourceFile,
        });

        const transformed = eft.transform(representation, results);

        // should filter out only the German resource and leave the French one alone
        const expected = new IntermediateRepresentation({
            type: "resource",
            ir: [resource1],
            sourceFile,
            dirty: true,
        });

        expect(transformed).toEqual(expected);
    });

    test("filters out the resource with the right hash and leaves the other paths alone", () => {
        expect.assertions(1);

        const eft = new ErrorFilterTransformer();
        const resource1 = new ResourceString({
            project: "project",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "path/to/file.js",
            reskey: "key1",
            source: "source1",
            target: "target1",
            resfile: "path/to/fr-FR.xliff",
        });
        const resource2 = new ResourceString({
            project: "project",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "path/to/other/file.js",
            reskey: "key1",
            source: "source1",
            target: "target1",
            resfile: "path/to/other/fr-FR.xliff",
        });
        const resources = [resource1, resource2];
        const results = [
            new Result({
                severity: "error",
                pathName: "path/to/other/fr-FR.xliff", // only matches the second resource
                description: "error description",
                rule: jest.fn(() => "rule"),
                highlight: "highlight",
                id: "key1",
                source: "source1",
                locale: "fr-FR",
            }),
        ];

        const representation = new IntermediateRepresentation({
            type: "resource",
            ir: resources,
            sourceFile,
        });

        const transformed = eft.transform(representation, results);

        // should filter out only the second resource and leave the first one alone
        const expected = new IntermediateRepresentation({
            type: "resource",
            ir: [resource1],
            // @ts-ignore
            sourceFile,
            dirty: true,
        });

        expect(transformed).toEqual(expected);
    });

    test("can avoid filtering error results out of an intermediate representation if an auto-fix has been applied to them", () => {
        expect.assertions(5);

        const eft = new ErrorFilterTransformer();
        const resource1 = new ResourceString({
            project: "project",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "path/to/file.js",
            reskey: "key1",
            source: "source1",
            target: "target1",
            resfile: "path/to/resfile.xliff",
        });
        const resource2 = new ResourceString({
            project: "project",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "path/to/file.js",
            reskey: "key2",
            source: "source2",
            target: "target2",
            resfile: "path/to/resfile.xliff",
        });
        const resources = [resource1, resource2];
        const fixer = new ResourceFixer();
        const results = [
            new Result({
                severity: "error",
                pathName: "path/to/resfile.xliff",
                description: "error description",
                rule: jest.fn(() => "rule"),
                highlight: "highlight",
                id: "key1",
                source: "source1",
                locale: "fr-FR",
                fix: ResourceFixer.createFix({
                    resource: resource1,
                    commands: [ResourceStringFixCommand.replaceAfter(0, 3, "fixedSource")],
                }),
            }),
        ];

        // pretend that the fix has been applied
        // @ts-ignore
        results[0].fix.applied = true;
        const representation = new IntermediateRepresentation({
            type: "resource",
            ir: resources,
            sourceFile,
            dirty: true,
        });

        const transformed = eft.transform(representation, results);

        expect(transformed).toBeDefined();
        const ir = transformed.getRepresentation();
        expect(Array.isArray(ir)).toBeTruthy();
        // resource1 should not be filtered out because it has an applied fix, even though it is an error result
        expect(ir.length).toBe(2);
        expect(ir[0]).toEqual(resource1);
        expect(ir[1]).toEqual(resource2);
    });
});
