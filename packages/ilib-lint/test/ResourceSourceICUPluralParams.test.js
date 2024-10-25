/*
 * ResourceSourceICUPluralParams.test.js
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
import { ResourceString } from 'ilib-tools-common';
import { Result } from 'ilib-lint-common';
import ResourceSourceICUPluralParams from '../src/rules/ResourceSourceICUPluralParams.js';

describe("that parameters in the other category also exist in the one category", () => {
    test("when the one category is missing the replacement param", () => {
        expect.assertions(2);

        const rule = new ResourceSourceICUPluralParams();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: '{count, plural, one {There is one singular.} other {There are {count} plurals.}}',
            pathName: "a/b/c.xliff"
        });
        const result = rule.matchString({
            source: resource.getSource(),
            resource,
            file: "a/b/c.xliff"
        });
        const expected = new Result({
            severity: "error",
            description: 'Missing replacement param "count" in the "one" category',
            id: "plural.test",
            source: '{count, plural, one {There is one singular.} other {There are {count} plurals.}}',
            highlight: '<e0>{count, plural, one {There is one singular.} other {There are {count} plurals.}}</e0>',
            rule,
            pathName: "a/b/c.xliff"
        });
        expect(result).toStrictEqual(expected);
    });

    test("when the one category is missing the hash replacement param", () => {
        expect.assertions(2);

        const rule = new ResourceSourceICUPluralParams();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: '{count, plural, one {There is one singular.} other {There are # plurals.}}',
            pathName: "a/b/c.xliff"
        });
        const result = rule.matchString({
            source: resource.getSource(),
            resource,
            file: "a/b/c.xliff"
        });
        const expected = new Result({
            severity: "error",
            description: 'Missing replacement param "count" in the "one" category',
            id: "plural.test",
            source: '{count, plural, one {There is one singular.} other {There are # plurals.}}',
            highlight: '<e0>{count, plural, one {There is one singular.} other {There are # plurals.}}</e0>',
            rule,
            pathName: "a/b/c.xliff"
        });
        expect(result).toStrictEqual(expected);
    });

    test("when the one category has a different replacement param", () => {
        expect.assertions(2);

        const rule = new ResourceSourceICUPluralParams();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: '{count, plural, one {There is {n} singular.} other {There are {count} plurals.}}',
            pathName: "a/b/c.xliff"
        });
        const result = rule.matchString({
            source: resource.getSource(),
            resource,
            file: "a/b/c.xliff"
        });
        const expected = new Result({
            severity: "error",
            description: 'Missing replacement param "count" in the "one" category',
            id: "plural.test",
            source: '{count, plural, one {There is {n} singular.} other {There are {count} plurals.}}',
            highlight: '<e0>{count, plural, one {There is {n} singular.} other {There are {count} plurals.}}</e0>',
            rule,
            pathName: "a/b/c.xliff"
        });
        expect(result).toStrictEqual(expected);
    });

    test("when there are no params in the other category", () => {
        expect.assertions(2);

        const rule = new ResourceSourceICUPluralParams();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: '{count, plural, one {This is singular} other {This is plural}}',
            pathName: "a/b/c.xliff"
        });
        const result = rule.matchString({
            source: resource.getSource(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(result).toBeFalsy();
    });

    test("when there are no params in the other category with nested plurals", () => {
        expect.assertions(2);

        const rule = new ResourceSourceICUPluralParams();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: '{count, plural, one {{total, plural, one {There is {count} of {total} item available} other {There is {count} of {total} items available}}} other {{total, plural, one {There are {count} of {total} item available} other {There are {count} of {total} items available}}}}',
            pathName: "a/b/c.xliff"
        });
        const result = rule.matchString({
            source: resource.getSource(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(result).toBeFalsy();
    });

    test("when the replacement params match", () => {
        expect.assertions(2);

        const rule = new ResourceSourceICUPluralParams();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: '{count, plural, one {There is {count} item available.} other {There are {count} items available.}}',
            pathName: "a/b/c.xliff"
        });
        const result = rule.matchString({
            source: resource.getSource(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(result).toBeFalsy();
    });

    test("when the replacement params are hash sign and match", () => {
        expect.assertions(2);

        const rule = new ResourceSourceICUPluralParams();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: '{count, plural, one {There is # item available.} other {There are # items available.}}',
            pathName: "a/b/c.xliff"
        });
        const result = rule.matchString({
            source: resource.getSource(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(result).toBeFalsy();
    });

    test("when the replacement params are mixed between hash sign and variable name", () => {
        expect.assertions(2);

        const rule = new ResourceSourceICUPluralParams();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: '{count, plural, one {There is # item available.} other {There are {count} items available.}}',
            pathName: "a/b/c.xliff"
        });
        const result = rule.matchString({
            source: resource.getSource(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(result).toBeFalsy();
    });

    test("when the replacement params in other do not include the switch variable", () => {
        expect.assertions(2);

        const rule = new ResourceSourceICUPluralParams();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: '{count, plural, one {There is {x} item available.} other {There are {n} items available.}}',
            pathName: "a/b/c.xliff"
        });
        const result = rule.matchString({
            source: resource.getSource(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(result).toBeFalsy();
    });

    test("when multiple replacement params match", () => {
        expect.assertions(2);

        const rule = new ResourceSourceICUPluralParams();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: '{count, plural, one {There is {count} {description} item available.} other {There are {count} {description} items available.}}',
            pathName: "a/b/c.xliff"
        });
        const result = rule.matchString({
            source: resource.getSource(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(result).toBeFalsy();
    });

    test("when multiple replacement params match reversed", () => {
        expect.assertions(2);

        const rule = new ResourceSourceICUPluralParams();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: '{count, plural, one {There is {description} {count} item available.} other {There are {count} {description} items available.}}',
            pathName: "a/b/c.xliff"
        });
        const result = rule.matchString({
            source: resource.getSource(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(result).toBeFalsy();
    });

    test("when multiple replacement params match in nested plurals", () => {
        expect.assertions(2);

        const rule = new ResourceSourceICUPluralParams();
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
            pathName: "a/b/c.xliff"
        });
        const result = rule.matchString({
            source: resource.getSource(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(result).toBeFalsy();
    });

    test("if there is a missing other category", () => {
        expect.assertions(2);

        const rule = new ResourceSourceICUPluralParams();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: '{count, plural, one {This is singular}}',
            pathName: "a/b/c.xliff"
        });
        const result = rule.matchString({
            source: resource.getSource(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(result).toBeFalsy();
    });

    test("if there is a missing one category", () => {
        expect.assertions(2);

        const rule = new ResourceSourceICUPluralParams();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: '{count, plural, other {There are # files.}}',
            pathName: "a/b/c.xliff"
        });
        const result = rule.matchString({
            source: resource.getSource(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(result).toBeFalsy();
    });

    test("if there is a =1 category instead", () => {
        expect.assertions(2);

        const rule = new ResourceSourceICUPluralParams();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: '{count, plural, =1 {There is one file.} other {There are # files.}}',
            pathName: "a/b/c.xliff"
        });
        const result = rule.matchString({
            source: resource.getSource(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(result).toBeFalsy();
    });

    test("if the select is not a plural string", () => {
        expect.assertions(2);

        const rule = new ResourceSourceICUPluralParams();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: '{count, select, male {He said} female {She said} other {They said}}',
            pathName: "a/b/c.xliff"
        });
        const result = rule.matchString({
            source: resource.getSource(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(result).toBeFalsy();
    });

    test("Plural embedded in the middle of a string that has no error", () => {
        expect.assertions(2);

        const rule = new ResourceSourceICUPluralParams();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: 'The file is located in {count, plural, one {# collection} other {# collections}} visible to user {name}.' ,
            pathName: "a/b/c.xliff"
        });
        const result = rule.matchString({
            source: resource.getSource(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(result).toBeFalsy();
    });

});

