/*
 * ILibPluralCategoriesChecker.test.js - test the ilib target plural categories checker rule
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

import { IntermediateRepresentation, SourceFile, Result } from 'ilib-lint-common';

import ILibPluralCategoriesChecker from '../src/ILibPluralCategoriesChecker.js';

const sourceFile = new SourceFile("a/b/c.xliff");
    
describe("test ilib target plural categories checker", () => {
    test("test valid plural categories", () => {
        expect.assertions(1);

        const resource = new ResourceString({
            key: "test",
            sourceLocale: "en-US",
            source: "one#singular|other#plural",
            targetLocale: "fr-FR",
            target: "one#singulier|many#beaucoup|other#pluriel",
            pathName: sourceFile.getPath()
        })
        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [ resource ],
            sourceFile: sourceFile,
        });

        const rule = new ILibPluralCategoriesChecker({ sourceLocale: "en-US" });
        const results = rule.match({ ir, locale: "fr-FR" });
        expect(results).toBeUndefined();
    });
    
    test("test invalid plural categories", () => {
        expect.assertions(7);

        const resource = new ResourceString({
            key: "test",
            sourceLocale: "en-US",
            source: "one#singular|other#plural",
            targetLocale: "ru-RU",
            target: "one#один|other#другой|many#много",
            pathName: sourceFile.getPath()
        })
        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [ resource ],
            sourceFile: sourceFile,
        });

        const rule = new ILibPluralCategoriesChecker({ sourceLocale: "en-US" });
        const results = rule.match({ ir, locale: "ru-RU" });
        expect(results).toBeTruthy();
        expect(results).toBeInstanceOf(Result);
        
        expect(results.severity).toBe("error");
        expect(results.description).toBe("Missing categories in target string: few. Expecting these: one, few, many, other");
        expect(results.highlight).toBe("<e0>one#один|other#другой|many#много</e0>");
        expect(results.locale).toBe("ru-RU");
        expect(results.pathName).toBe("a/b/c.xliff");
    });
});
