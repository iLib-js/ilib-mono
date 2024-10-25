/*
 * ResourceSourceICUPluralCategories.test.js
 *
 * Copyright © 2023-2024 JEDLSoft
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
import { ResourceString } from "ilib-tools-common";
import { Result } from "ilib-lint-common";
import ResourceSourceICUPluralCategories from "../src/rules/ResourceSourceICUPluralCategories.js";

describe("testFlat", () => {
    test("MatchNoError", () => {
        expect.assertions(2);

        const rule = new ResourceSourceICUPluralCategories();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: "{count, plural, one {This is singular} other {This is plural}}",
            pathName: "a/b/c.xliff",
        });
        const result = rule.matchString({
            source: resource.getSource(),
            resource,
            file: "a/b/c.xliff",
        });
        expect(result).toStrictEqual([]);
    });

    test("MissingCategoryOne", () => {
        expect.assertions(2);

        const rule = new ResourceSourceICUPluralCategories();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: "{count, plural, other {This is plural}}",
            pathName: "a/b/c.xliff",
        });
        const result = rule.matchString({
            source: resource.getSource(),
            resource,
            file: "a/b/c.xliff",
        });

        const expected = [
            new Result({
                severity: "error",
                description: 'Missing required plural category "one"',
                pathName: "a/b/c.xliff",
                rule,
                highlight: "<e0>{count, plural, other {This is plural}}</e0>",
                id: "plural.test",
                source: "{count, plural, other {This is plural}}",
            }),
        ];
        expect(result).toStrictEqual(expected);
    });

    test("MissingCategoryOther", () => {
        expect.assertions(2);

        const rule = new ResourceSourceICUPluralCategories();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: "{count, plural, one {This is singular}}",
            pathName: "a/b/c.xliff",
        });
        const result = rule.matchString({
            source: resource.getSource(),
            resource,
            file: "a/b/c.xliff",
        });

        // missing "other" is an ICU plural syntax error,
        // so a different rule should catch that
        expect(result).toStrictEqual([]);
    });

    test("ExtraCategoryTwo", () => {
        expect.assertions(2);

        const rule = new ResourceSourceICUPluralCategories();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: "{count, plural, one {This is singular} two {This is a pair} other {This is plural}}",
            pathName: "a/b/c.xliff",
        });
        const result = rule.matchString({
            source: resource.getSource(),
            resource,
            file: "a/b/c.xliff",
        });

        const expected = [];
        expect(result).toStrictEqual(expected);
    });

    test("InvalidOneCategory", () => {
        expect.assertions(2);

        const rule = new ResourceSourceICUPluralCategories();
        expect(rule).toBeTruthy();

        // category "=1" instead of "one"
        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: "{count, plural, =1 {This is singular} other {This is plural}}",
            pathName: "a/b/c.xliff",
        });
        const result = rule.matchString({
            source: resource.getSource(),
            resource,
            file: "a/b/c.xliff",
        });

        const expected = [
            new Result({
                severity: "error",
                description: 'Category "=1" in plural should be "one" instead',
                pathName: "a/b/c.xliff",
                rule,
                highlight: "<e0>{This is singular}</e0>",
                id: "plural.test",
                source: "{count, plural, =1 {This is singular} other {This is plural}}",
            }),
        ];
        expect(result).toStrictEqual(expected);
    });
});

describe("testNested", () => {
    test("MatchNestedNoError", () => {
        expect.assertions(2);

        const rule = new ResourceSourceICUPluralCategories();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: "{count, plural, one {{total, plural, one {There is {count} of {total} item available} other {There is {count} of {total} items available}}} other {{total, plural, one {There are {count} of {total} item available} other {There are {count} of {total} items available}}}}",
            pathName: "a/b/c.xliff",
        });
        const result = rule.matchString({
            source: resource.getSource(),
            resource,
            file: "a/b/c.xliff",
        });
        expect(result).toStrictEqual([]);
    });

    test("MatchNestedMissingSingleOne", () => {
        expect.assertions(2);

        const rule = new ResourceSourceICUPluralCategories();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: "{count, plural, one {{total, plural, other {There is {count} of {total} items available}}} other {{total, plural, one {There are {count} of {total} item available} other {There are {count} of {total} items available}}}}",
            pathName: "a/b/c.xliff",
        });
        const result = rule.matchString({
            source: resource.getSource(),
            resource,
            file: "a/b/c.xliff",
        });

        const expected = [
            new Result({
                severity: "error",
                description: 'Missing required plural category "one"',
                pathName: "a/b/c.xliff",
                rule,
                highlight: "<e0>{total, plural, other {There is {count} of {total} items available}}</e0>",
                id: "plural.test",
                source: "{count, plural, one {{total, plural, other {There is {count} of {total} items available}}} other {{total, plural, one {There are {count} of {total} item available} other {There are {count} of {total} items available}}}}",
            }),
        ];

        expect(result).toStrictEqual(expected);
    });

    test("MatchNestedMissingMultipleOne", () => {
        expect.assertions(2);

        const rule = new ResourceSourceICUPluralCategories();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: "{count, plural, one {{total, plural, other {There is {count} of {total} items available}}} other {{total, plural, other {There are {count} of {total} items available}}}}",
            pathName: "a/b/c.xliff",
        });
        const result = rule.matchString({
            source: resource.getSource(),
            resource,
            file: "a/b/c.xliff",
        });

        const expected = [
            new Result({
                severity: "error",
                description: 'Missing required plural category "one"',
                pathName: "a/b/c.xliff",
                rule,
                highlight: "<e0>{total, plural, other {There is {count} of {total} items available}}</e0>",
                id: "plural.test",
                source: "{count, plural, one {{total, plural, other {There is {count} of {total} items available}}} other {{total, plural, other {There are {count} of {total} items available}}}}",
            }),
            new Result({
                severity: "error",
                description: 'Missing required plural category "one"',
                pathName: "a/b/c.xliff",
                rule,
                highlight: "<e0>{total, plural, other {There are {count} of {total} items available}}</e0>",
                id: "plural.test",
                source: "{count, plural, one {{total, plural, other {There is {count} of {total} items available}}} other {{total, plural, other {There are {count} of {total} items available}}}}",
            }),
        ];

        expect(result).toStrictEqual(expected);
    });

    test("MatchNestedMissingMultipleMixed", () => {
        expect.assertions(2);

        const rule = new ResourceSourceICUPluralCategories();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: "{count, plural, one {{total, plural, other {There is {count} of {total} items available}}} other {{total, plural, =1 {There is {count} of {total} item available} other {There are {count} of {total} items available}}}}",
            pathName: "a/b/c.xliff",
        });
        const result = rule.matchString({
            source: resource.getSource(),
            resource,
            file: "a/b/c.xliff",
        });

        const expected = [
            new Result({
                severity: "error",
                description: 'Missing required plural category "one"',
                pathName: "a/b/c.xliff",
                rule,
                highlight: "<e0>{total, plural, other {There is {count} of {total} items available}}</e0>",
                id: "plural.test",
                source: "{count, plural, one {{total, plural, other {There is {count} of {total} items available}}} other {{total, plural, =1 {There is {count} of {total} item available} other {There are {count} of {total} items available}}}}",
            }),
            new Result({
                severity: "error",
                description: 'Category "=1" in plural should be "one" instead',
                pathName: "a/b/c.xliff",
                rule,
                highlight: "<e0>{There is {count} of {total} item available}</e0>",
                id: "plural.test",
                source: "{count, plural, one {{total, plural, other {There is {count} of {total} items available}}} other {{total, plural, =1 {There is {count} of {total} item available} other {There are {count} of {total} items available}}}}",
            }),
        ];

        expect(result).toStrictEqual(expected);
    });

    test("MatchNestedMissingSingleOther", () => {
        expect.assertions(2);

        const rule = new ResourceSourceICUPluralCategories();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: "{count, plural, one {{total, plural, one {There is {count} of {total} item available} other {There is {count} of {total} items available}}} other {{total, plural, one {There are {count} of {total} item available}}}}",
            pathName: "a/b/c.xliff",
        });
        const result = rule.matchString({
            source: resource.getSource(),
            resource,
            file: "a/b/c.xliff",
        });

        // missing "other" is an ICU plural syntax error,
        // so a different rule should catch that
        expect(result).toStrictEqual([]);
    });

    test("MatchNestedMissingMultipleOther", () => {
        expect.assertions(2);

        const rule = new ResourceSourceICUPluralCategories();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: "{count, plural, one {{total, plural, one {There is {count} of {total} item available}}} other {{total, plural, one {There are {count} of {total} item available}}}}",
            pathName: "a/b/c.xliff",
        });
        const result = rule.matchString({
            source: resource.getSource(),
            resource,
            file: "a/b/c.xliff",
        });

        // missing "other" is an ICU plural syntax error,
        // so a different rule should catch that
        expect(result).toStrictEqual([]);
    });

    test("MatchNestedMultiLineNoError", () => {
        expect.assertions(2);

        const rule = new ResourceSourceICUPluralCategories();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: `{count, plural,
                one {
                    {total, plural,
                        one {There is {count} of {total} item available}
                        other {There is {count} of {total} items available}
                    }
                }
                other {
                    {total, plural,
                        one {There are {count} of {total} item available}
                        other {There are {count} of {total} items available}
                    }
                }
            }`,
            pathName: "a/b/c.xliff",
        });
        const result = rule.matchString({
            source: resource.getSource(),
            resource,
            file: "a/b/c.xliff",
        });
        expect(result).toStrictEqual([]);
    });

    test("MatchNestedExtra", () => {
        expect.assertions(2);

        const rule = new ResourceSourceICUPluralCategories();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: "{count, plural, one {{total, plural, one {There is {count} of {total} item available} =2 {There is {count} of two items available} other {There is {count} of {total} items available}}} other {{total, plural, one {There are {count} of {total} item available} other {There are {count} of {total} items available}}}}",
            pathName: "a/b/c.xliff",
        });
        const result = rule.matchString({
            source: resource.getSource(),
            resource,
            file: "a/b/c.xliff",
        });

        const expected = [];
        expect(result).toStrictEqual(expected);
    });
});
