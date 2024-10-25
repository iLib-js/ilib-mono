/*
 * ResourceNoManualCurrencyFormatting.test.js - test the built-in regular-expression-based rules
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

describe("make sure that Resources have No Manual Currency Formatting Allowed", () => {
    test("Resource Has Manual Currency Formatting", () => {
        expect.assertions(8);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-manual-currency-formatting"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "It costs ${num}.",
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
        expect(actual[0].description).toBe("Do not format currencies in English strings. Use a locale-sensitive number formatter and substitute the result of that into this string.");
        expect(actual[0].highlight).toBe("Source: It costs <e0>${num}</e0>.");
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("Resource Has No Manual Currency Formatting", () => {
        expect.assertions(2);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-manual-currency-formatting"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "It costs {num}.",
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

    test("Resource Has Manual Currency Formatting With Whitespace", () => {
        expect.assertions(8);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-manual-currency-formatting"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "It costs $ {num}.",
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
        expect(actual[0].description).toBe("Do not format currencies in English strings. Use a locale-sensitive number formatter and substitute the result of that into this string.");
        expect(actual[0].highlight).toBe("Source: It costs <e0>$ {num}</e0>.");
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("Resource Has Manual Currency Formatting and a Crazy Param Name", () => {
        expect.assertions(8);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-manual-currency-formatting"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "It costs ${numCapital_$foo.bar}.",
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
        expect(actual[0].description).toBe("Do not format currencies in English strings. Use a locale-sensitive number formatter and substitute the result of that into this string.");
        expect(actual[0].highlight).toBe("Source: It costs <e0>${numCapital_$foo.bar}</e0>.");
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("Resource Has Manual Currency Formatting at the Start Of the String", () => {
        expect.assertions(8);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-manual-currency-formatting"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "${num} per month",
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
        expect(actual[0].description).toBe("Do not format currencies in English strings. Use a locale-sensitive number formatter and substitute the result of that into this string.");
        expect(actual[0].highlight).toBe("Source: <e0>${num}</e0> per month");
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("Resource Has Manual Currency Formatting at the End Of the String", () => {
        expect.assertions(8);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-manual-currency-formatting"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "Cost is ${num}",
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
        expect(actual[0].description).toBe("Do not format currencies in English strings. Use a locale-sensitive number formatter and substitute the result of that into this string.");
        expect(actual[0].highlight).toBe("Source: Cost is <e0>${num}</e0>");
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("Plural Resource Has Manual Currency Formatting", () => {
        expect.assertions(13);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-manual-currency-formatting"));
        expect(rule).toBeTruthy();

        const resource = new ResourcePlural({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: {
                one: "Cost is ${cost}.",
                other: "Costs are ${cost}."
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
        expect(actual[0].description).toBe("Do not format currencies in English strings. Use a locale-sensitive number formatter and substitute the result of that into this string.");
        expect(actual[0].highlight).toBe("Source: Cost is <e0>${cost}</e0>.");
        expect(actual[0].pathName).toBe("a/b/c.xliff");

        expect(actual[1].severity).toBe("error");
        expect(actual[1].id).toBe("matcher.test");
        expect(actual[1].description).toBe("Do not format currencies in English strings. Use a locale-sensitive number formatter and substitute the result of that into this string.");
        expect(actual[1].highlight).toBe("Source: Costs are <e0>${cost}</e0>.");
        expect(actual[1].pathName).toBe("a/b/c.xliff");
    });

    test("Array Resource Has Manual Currency Formatting", () => {
        expect.assertions(13);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-manual-currency-formatting"));
        expect(rule).toBeTruthy();

        const resource = new ResourceArray({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: [
                "Cost is ${cost}.",
                "Costs are ${cost}."
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
        expect(actual[0].description).toBe("Do not format currencies in English strings. Use a locale-sensitive number formatter and substitute the result of that into this string.");
        expect(actual[0].highlight).toBe("Source: Cost is <e0>${cost}</e0>.");
        expect(actual[0].pathName).toBe("a/b/c.xliff");

        expect(actual[1].severity).toBe("error");
        expect(actual[1].id).toBe("matcher.test");
        expect(actual[1].description).toBe("Do not format currencies in English strings. Use a locale-sensitive number formatter and substitute the result of that into this string.");
        expect(actual[1].highlight).toBe("Source: Costs are <e0>${cost}</e0>.");
        expect(actual[1].pathName).toBe("a/b/c.xliff");
    });
});
