/*
 * ResourceNoNounReplacementParams.test.js - test the built-in regular-expression-based rules
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

import { Result, IntermediateRepresentation, SourceFile } from 'ilib-lint-common';

function findRuleDefinition(name) {
    return regexRules.find(rule => rule.name === name);
}

const sourceFile = new SourceFile("a/b/c.xliff", {});

describe("testResourceNoNounReplacementParams", () => {
    test("ResourceNounParamTheString", () => {
        expect.assertions(8);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-noun-replacement-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "Delete the {fileType}.",
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

        expect(actual[0].severity).toBe("error");
        expect(actual[0].id).toBe("matcher.test");
        expect(actual[0].description).toBe("Do not substitute nouns into UI strings. Use separate strings for each noun instead.");
        expect(actual[0].highlight).toBe("Source: Delete <e0>the {fileType}</e0>.");
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceNounParamAString", () => {
        expect.assertions(8);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-noun-replacement-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "Delete a {fileType}.",
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

        expect(actual[0].severity).toBe("error");
        expect(actual[0].id).toBe("matcher.test");
        expect(actual[0].description).toBe("Do not substitute nouns into UI strings. Use separate strings for each noun instead.");
        expect(actual[0].highlight).toBe("Source: Delete <e0>a {fileType}</e0>.");
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceNounParamAnString", () => {
        expect.assertions(8);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-noun-replacement-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "Delete an {fileType}.",
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

        expect(actual[0].severity).toBe("error");
        expect(actual[0].id).toBe("matcher.test");
        expect(actual[0].description).toBe("Do not substitute nouns into UI strings. Use separate strings for each noun instead.");
        expect(actual[0].highlight).toBe("Source: Delete <e0>an {fileType}</e0>.");
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceNoNounParamString", () => {
        expect.assertions(2);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-noun-replacement-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "Delete the file.",
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

    test("ResourceParamNoArticleString", () => {
        expect.assertions(2);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-noun-replacement-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "Delete {fileName}.",
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

    test("ResourceNoNounParamWithTheElsewhereString", () => {
        expect.assertions(2);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-noun-replacement-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "Delete the file {fileName}?",
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

    test("ResourceNounParamTheMultipleString", () => {
        expect.assertions(13);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-noun-replacement-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "Delete the {fileType} and the {otherFileType}.",
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

        expect(actual[0].severity).toBe("error");
        expect(actual[0].id).toBe("matcher.test");
        expect(actual[0].description).toBe("Do not substitute nouns into UI strings. Use separate strings for each noun instead.");
        expect(actual[0].highlight).toBe("Source: Delete <e0>the {fileType}</e0> and the {otherFileType}.");
        expect(actual[0].pathName).toBe("a/b/c.xliff");

        expect(actual[1].severity).toBe("error");
        expect(actual[1].id).toBe("matcher.test");
        expect(actual[1].description).toBe("Do not substitute nouns into UI strings. Use separate strings for each noun instead.");
        expect(actual[1].highlight).toBe("Source: Delete the {fileType} and <e0>the {otherFileType}</e0>.");
        expect(actual[1].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceNounParamThePluralString", () => {
        expect.assertions(13);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-noun-replacement-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "{count, plural, one {Delete the {fileType}.} other {Delete the {fileTypePlural}.}}",
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

        expect(actual[0].severity).toBe("error");
        expect(actual[0].id).toBe("matcher.test");
        expect(actual[0].description).toBe("Do not substitute nouns into UI strings. Use separate strings for each noun instead.");
        expect(actual[0].highlight).toBe("Source: {count, plural, one {Delete <e0>the {fileType}</e0>.} other {Delete the {fileTypePlural}.}}");
        expect(actual[0].pathName).toBe("a/b/c.xliff");

        expect(actual[1].severity).toBe("error");
        expect(actual[1].id).toBe("matcher.test");
        expect(actual[1].description).toBe("Do not substitute nouns into UI strings. Use separate strings for each noun instead.");
        expect(actual[1].highlight).toBe("Source: {count, plural, one {Delete the {fileType}.} other {Delete <e0>the {fileTypePlural}</e0>.}}");
        expect(actual[1].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceNounParamThePlural", () => {
        expect.assertions(13);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-noun-replacement-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourcePlural({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: {
                one: "Delete the {fileType}.",
                other: "Delete the {fileTypes}."
            },
            pathName: "a/b/c.xliff"
        });
        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile
        });

        const actual = rule.match({
            file: "a/b/c.xliff",
            ir
        });

        expect(actual).toBeTruthy();
        expect(actual.length).toBe(2);

        expect(actual[0].severity).toBe("error");
        expect(actual[0].id).toBe("matcher.test");
        expect(actual[0].description).toBe("Do not substitute nouns into UI strings. Use separate strings for each noun instead.");
        expect(actual[0].highlight).toBe("Source: Delete <e0>the {fileType}</e0>.");
        expect(actual[0].pathName).toBe("a/b/c.xliff");

        expect(actual[1].severity).toBe("error");
        expect(actual[1].id).toBe("matcher.test");
        expect(actual[1].description).toBe("Do not substitute nouns into UI strings. Use separate strings for each noun instead.");
        expect(actual[1].highlight).toBe("Source: Delete <e0>the {fileTypes}</e0>.");
        expect(actual[1].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceNounParamTheArray", () => {
        expect.assertions(13);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-noun-replacement-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceArray({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: [
                "Delete the {fileType}.",
                "Delete the {fileTypes}."
            ],
            pathName: "a/b/c.xliff"
        });
        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile
        });

        const actual = rule.match({
            file: "a/b/c.xliff",
            ir
        });

        expect(actual).toBeTruthy();
        expect(actual.length).toBe(2);

        expect(actual[0].severity).toBe("error");
        expect(actual[0].id).toBe("matcher.test");
        expect(actual[0].description).toBe("Do not substitute nouns into UI strings. Use separate strings for each noun instead.");
        expect(actual[0].highlight).toBe("Source: Delete <e0>the {fileType}</e0>.");
        expect(actual[0].pathName).toBe("a/b/c.xliff");

        expect(actual[1].severity).toBe("error");
        expect(actual[1].id).toBe("matcher.test");
        expect(actual[1].description).toBe("Do not substitute nouns into UI strings. Use separate strings for each noun instead.");
        expect(actual[1].highlight).toBe("Source: Delete <e0>the {fileTypes}</e0>.");
        expect(actual[1].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceNounParamTheCapitalsString", () => {
        expect.assertions(18);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-noun-replacement-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "Delete The {fileType} And A {fileType} and An {fileType}.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(actual.length).toBe(3);

        expect(actual[0].severity).toBe("error");
        expect(actual[0].id).toBe("matcher.test");
        expect(actual[0].description).toBe("Do not substitute nouns into UI strings. Use separate strings for each noun instead.");
        expect(actual[0].highlight).toBe("Source: Delete <e0>The {fileType}</e0> And A {fileType} and An {fileType}.");
        expect(actual[0].pathName).toBe("a/b/c.xliff");

        expect(actual[1].severity).toBe("error");
        expect(actual[1].id).toBe("matcher.test");
        expect(actual[1].description).toBe("Do not substitute nouns into UI strings. Use separate strings for each noun instead.");
        expect(actual[1].highlight).toBe("Source: Delete The {fileType} And <e0>A {fileType}</e0> and An {fileType}.");
        expect(actual[1].pathName).toBe("a/b/c.xliff");

        expect(actual[2].severity).toBe("error");
        expect(actual[2].id).toBe("matcher.test");
        expect(actual[2].description).toBe("Do not substitute nouns into UI strings. Use separate strings for each noun instead.");
        expect(actual[2].highlight).toBe("Source: Delete The {fileType} And A {fileType} and <e0>An {fileType}</e0>.");
        expect(actual[2].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceNounParamNotWholeWordString", () => {
        expect.assertions(2);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-noun-replacement-params"));
        expect(rule).toBeTruthy();

        // should not match "a" and "the" when it is not a separate word
        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "Paula {verb} loathe {cucumber}.",
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

    test("ResourceNounParamTheStartOfString", () => {
        expect.assertions(8);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-noun-replacement-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "The {fileType} to delete.",
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

        expect(actual[0].severity).toBe("error");
        expect(actual[0].id).toBe("matcher.test");
        expect(actual[0].description).toBe("Do not substitute nouns into UI strings. Use separate strings for each noun instead.");
        expect(actual[0].highlight).toBe("Source: <e0>The {fileType}</e0> to delete.");
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceNounParamTheEndOfString", () => {
        expect.assertions(8);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-noun-replacement-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "Delete the {fileType}",
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

        expect(actual[0].severity).toBe("error");
        expect(actual[0].id).toBe("matcher.test");
        expect(actual[0].description).toBe("Do not substitute nouns into UI strings. Use separate strings for each noun instead.");
        expect(actual[0].highlight).toBe("Source: Delete <e0>the {fileType}</e0>");
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });
});
