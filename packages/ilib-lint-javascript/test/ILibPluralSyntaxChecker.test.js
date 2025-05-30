/*
 * ILibPluralSyntaxChecker.test.js - test the ilib target plural string checker rule
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
import { ResourceString, ResourcePlural, ResourceArray } from 'ilib-tools-common';

import { IntermediateRepresentation, SourceFile } from 'ilib-lint-common';

import ILibPluralSyntaxChecker from '../src/ILibPluralSyntaxChecker.js';

const sourceFile = new SourceFile("a/b/c.xliff");
    
describe("test ilib target plural syntax checker", () => {
    test("match works properly with a valid plural string", () => {
        expect.assertions(1);

        const checker = new ILibPluralSyntaxChecker();
        const resource = new ResourceString({
            key: "testKey",
            sourceLocale: "en-US",
            source: "one#singular|other#plural",
            targetLocale: "de-DE",
            target: "one#einzelig|other#mehrzahl"
        });
        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile
        });
        
        const actual = checker.match({ ir, locale: "en-US" });
        expect(actual).toBeUndefined();
    });
    
    test("match works properly with an invalid plural string", () => {
        expect.assertions(7);

        const checker = new ILibPluralSyntaxChecker();
        const resource = new ResourceString({
            key: "testKey",
            sourceLocale: "en-US",
            source: "one#singular|other#plural",
            targetLocale: "de-DE",
            target: "one#einzelig|other"  // missing choice for 'other'
        });
        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile
        });
        
        const actual = checker.match({ ir, locale: "en-US" });
        expect(actual).toBeDefined();
        
        expect(actual.severity).toBe("error");
        expect(actual.id).toBe("testKey");
        expect(actual.description).toBe("The plural syntax of the target string is incorrect.");
        expect(actual.highlight).toBe("<e0>one#einzelig|other</e0>");
        expect(actual.source).toBe('one#singular|other#plural');
        expect(actual.pathName).toBe("a/b/c.xliff");
    });
    
    test("match works properly with a minimal plural string", () => {
        expect.assertions(1);

        const checker = new ILibPluralSyntaxChecker();
        const resource = new ResourceString({
            key: "testKey",
            sourceLocale: "en-US",
            source: "one#singular",
            targetLocale: "de-DE",
            target: "one#einzelig"
        });
        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile
        });
        
        const actual = checker.match({ ir, locale: "en-US" });
        expect(actual).toBeUndefined();
    });
    
    test("match works properly with an empty plural string", () => {
        expect.assertions(1);

        const checker = new ILibPluralSyntaxChecker();
        const resource = new ResourceString({
            key: "testKey",
            sourceLocale: "en-US",
            source: "",
            targetLocale: "de-DE",
            target: ""
        });
        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile
        });
        
        const actual = checker.match({ ir, locale: "en-US" });
        expect(actual).toBeUndefined();
    });
    
    test("match works properly with plural strings in an array", () => {
        expect.assertions(1);

        const checker = new ILibPluralSyntaxChecker();
        const resource = new ResourcePlural({
            key: "testKey",
            sourceLocale: "en-US",
            source: ["one#singular|other#plural", "two#another"],
            targetLocale: "de-DE",
            target: ["one#einzelig|other#mehrzahl", "two#anderer"]
        });
        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile
        });
        
        const actual = checker.match({ ir, locale: "en-US" });
        expect(actual).toBeUndefined();
    });
    
    test("match works properly with plural strings in an array with an invalid plural string", () => {
        expect.assertions(7);

        const checker = new ILibPluralSyntaxChecker();
        const resource = new ResourceArray({
            key: "testKey",
            sourceLocale: "en-US",
            source: ["one#singular|other#plural", "two#another"],
            targetLocale: "de-DE",
            target: ["one#einzelig|other", "two#anderer"]  // missing choice for 'other'
        });
        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile
        });
        
        const actual = checker.match({ ir, locale: "en-US" });
        expect(actual).toBeDefined();
        
        expect(actual.severity).toBe("error");
        expect(actual.id).toBe("testKey");
        expect(actual.description).toBe("The plural syntax of a string in the target array is incorrect.");
        expect(actual.highlight).toBe("[0] <e0>one#einzelig|other</e0>");
        expect(actual.source).toBe('one#singular|other#plural');
        expect(actual.pathName).toBe("a/b/c.xliff");
    });
    
    test("match works properly with plural strings in an array with a minimal plural string", () => {
        expect.assertions(1);

        const checker = new ILibPluralSyntaxChecker();
        const resource = new ResourceArray({
            key: "testKey",
            sourceLocale: "en-US",
            source: ["one#singular", "two#another"],
            targetLocale: "de-DE",
            target: ["one#einzelig", "two#anderer"]
        });
        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile
        });
        
        const actual = checker.match({ ir, locale: "en-US" });
        expect(actual).toBeUndefined();
    });
    
    test("match works properly with plural strings in an array with an empty plural string", () => {
        expect.assertions(1);

        const checker = new ILibPluralSyntaxChecker();
        const resource = new ResourceArray({
            key: "testKey",
            sourceLocale: "en-US",
            source: ["", "two#another"],
            targetLocale: "de-DE",
            target: ["", "two#anderer"]
        });
        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile
        });
        
        const actual = checker.match({ ir, locale: "en-US" });
        expect(actual).toBeUndefined();
    });

    test("match works properly with plural strings in an array with a mix of valid and invalid plural strings", () => {
        expect.assertions(7);

        const checker = new ILibPluralSyntaxChecker();
        const resource = new ResourceArray({
            key: "testKey",
            sourceLocale: "en-US",
            source: ["one#singular|other#plural", "two#another"],
            targetLocale: "de-DE",
            target: ["one#einzelig|other", "two#anderer"]  // first is invalid, second is valid
        });
        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile
        });
        
        const actual = checker.match({ ir, locale: "en-US" });
        expect(actual).toBeDefined();
        
        expect(actual.severity).toBe("error");
        expect(actual.id).toBe("testKey");
        expect(actual.description).toBe("The plural syntax of a string in the target array is incorrect.");
        expect(actual.highlight).toBe("[0] <e0>one#einzelig|other</e0>");
        expect(actual.source).toBe('one#singular|other#plural');
        expect(actual.pathName).toBe("a/b/c.xliff");
    });
    
    test("match works properly with plural strings nested in a plural resource", () => {
        expect.assertions(1);

        const checker = new ILibPluralSyntaxChecker();
        const resource = new ResourcePlural({
            key: "testKey",
            sourceLocale: "en-US",
            source: {
                one: "one#singular|other#plural",
                two: "two#another"
            },
            targetLocale: "de-DE",
            target: {
                one: "one#einzelig|other",
                two: "two#anderer"
            }
        });
        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile
        });
        
        const actual = checker.match({ ir, locale: "en-US" });
        expect(actual).toBeDefined();
    });
    
    test("match works properly with plural strings nested in a plural resource with an invalid plural string", () => {
        expect.assertions(7);

        const checker = new ILibPluralSyntaxChecker();
        const resource = new ResourcePlural({
            key: "testKey",
            sourceLocale: "en-US",
            source: {
                one: "one#singular|other#plural",
                two: "two#another"
            },
            targetLocale: "de-DE",
            target: {
                one: "one#einzelig|other",  // missing choice for 'other'
                two: "two#anderer"
            }
        });
        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile
        });
        
        const actual = checker.match({ ir, locale: "en-US" });
        expect(actual).toBeDefined();
        
        expect(actual.severity).toBe("error");
        expect(actual.id).toBe("testKey");
        expect(actual.description).toBe("The plural syntax of a string in the target plural is incorrect.");
        expect(actual.highlight).toBe("(one) <e0>one#einzelig|other</e0>");
        expect(actual.source).toBe('one#singular|other#plural');
        expect(actual.pathName).toBe("a/b/c.xliff");
    });
    
});
