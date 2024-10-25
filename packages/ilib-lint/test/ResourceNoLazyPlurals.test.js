/*
 * ResourceNoLazyPlurals.test.js - test the built-in regular-expression-based rules
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
import { ResourceString, ResourceArray, ResourcePlural } from 'ilib-tools-common';

import ResourceSourceChecker from '../src/rules/ResourceSourceChecker.js';
import { regexRules } from '../src/plugins/BuiltinPlugin.js';

import { Result } from 'ilib-lint-common';

function findRuleDefinition(name) {
    return regexRules.find(rule => rule.name === name);
}

describe("testResourceNoLazyPlurals", () => {
    test("ResourceLazyPluralString", () => {
        expect.assertions(8);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-lazy-plurals"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "There are {num} file(s) in the folder.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(actual.length).toBe(1);

        expect(actual[0].severity).toBe("warning");
        expect(actual[0].id).toBe("matcher.test");
        expect(actual[0].description).toBe("The (s) construct is not allowed in source strings. Use real plural syntax instead.");
        expect(actual[0].highlight).toBe("Source: There are {num} <e0>file(s)</e0> in the folder.");
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceNoLazyPluralString", () => {
        expect.assertions(2);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-lazy-plurals"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "There are {num} file in the folder.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(!actual).toBeTruthy();
    });

    test("ResourceNoLazyPluralMidWordString", () => {
        expect.assertions(2);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-lazy-plurals"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "There are {num} file(s)asdf in the folder.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(!actual).toBeTruthy();
    });

    test("ResourceNoLazyPluralNotPluralString", () => {
        expect.assertions(2);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-lazy-plurals"));
        expect(rule).toBeTruthy();

        // no word before the (s) means no match
        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "There are {num} file (s) in the folder.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(!actual).toBeTruthy();
    });

    test("ResourceLazyPluralEndOfString", () => {
        expect.assertions(8);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-lazy-plurals"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "There are {num} files in {folderNum} folder(s)",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(actual.length).toBe(1);

        expect(actual[0].severity).toBe("warning");
        expect(actual[0].id).toBe("matcher.test");
        expect(actual[0].description).toBe("The (s) construct is not allowed in source strings. Use real plural syntax instead.");
        expect(actual[0].highlight).toBe("Source: There are {num} files in {folderNum} <e0>folder(s)</e0>");
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceLazyPluralBeginningOfString", () => {
        expect.assertions(8);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-lazy-plurals"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "File(s) deleted",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(actual.length).toBe(1);

        expect(actual[0].severity).toBe("warning");
        expect(actual[0].id).toBe("matcher.test");
        expect(actual[0].description).toBe("The (s) construct is not allowed in source strings. Use real plural syntax instead.");
        expect(actual[0].highlight).toBe("Source: <e0>File(s)</e0> deleted");
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceLazyPluralMultipleString", () => {
        expect.assertions(13);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-lazy-plurals"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "There are {num} file(s) in the folder(s)",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(actual.length).toBe(2);

        expect(actual[0].severity).toBe("warning");
        expect(actual[0].id).toBe("matcher.test");
        expect(actual[0].description).toBe("The (s) construct is not allowed in source strings. Use real plural syntax instead.");
        expect(actual[0].highlight).toBe("Source: There are {num} <e0>file(s)</e0> in the folder(s)");
        expect(actual[0].pathName).toBe("a/b/c.xliff");

        expect(actual[1].severity).toBe("warning");
        expect(actual[1].id).toBe("matcher.test");
        expect(actual[1].description).toBe("The (s) construct is not allowed in source strings. Use real plural syntax instead.");
        expect(actual[1].highlight).toBe("Source: There are {num} file(s) in the <e0>folder(s)</e0>");
        expect(actual[1].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceLazyPluralEndingInPunctString", () => {
        expect.assertions(8);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-lazy-plurals"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "There are {num} file(s).",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(actual.length).toBe(1);

        expect(actual[0].severity).toBe("warning");
        expect(actual[0].id).toBe("matcher.test");
        expect(actual[0].description).toBe("The (s) construct is not allowed in source strings. Use real plural syntax instead.");
        expect(actual[0].highlight).toBe("Source: There are {num} <e0>file(s)</e0>.");
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });
});
