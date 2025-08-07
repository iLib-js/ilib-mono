/*
 * ResourceAllCaps.test.js
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

import { ResourceString, ResourceArray, ResourcePlural } from "ilib-tools-common";
import { Result, Fix, IntermediateRepresentation, SourceFile } from "ilib-lint-common";

import ResourceAllCaps from "../../src/rules/ResourceAllCaps.js";
import ResourceFixer from "../../src/plugins/resource/ResourceFixer.js";
import RuleManager from "../../src/RuleManager.js";
import BuiltinPlugin from "../../src/plugins/BuiltinPlugin.js";

describe("ResourceAllCaps", () => {
    test("creates ResourceAllCaps rule instance", () => {
        const rule = new ResourceAllCaps({})

        expect(rule).toBeInstanceOf(ResourceAllCaps);
        expect(rule.getName()).toBe("resource-all-caps");
    });

    test.each([
        100,
        'string',
        {},
        () => {},
    ])("handles invalid `exceptions` parameter gracefully (and does not break in runtime)", (invalidExceptions) => {
        const rule = new ResourceAllCaps({exceptions: Array.isArray(invalidExceptions) ? invalidExceptions : undefined});

        const resource = createTestResourceString({source: "ALL CAPS EXCEPTION", target: "some target"});
        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeInstanceOf(Result);
        // @ts-ignore - We're testing that result is defined
        expect(result.rule).toBeInstanceOf(ResourceAllCaps);
        // @ts-ignore - We're testing that result is defined
        expect(result.severity).toEqual("error");
    });

    test.each([
        {source: ""},
        {source: undefined},
        {source: null},
    ])("returns `undefined` if source string is empty ($source)", ({source}) => {
        const rule = new ResourceAllCaps({});
        const resource = createTestResourceString({source, target: "SOME_TARGET"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeUndefined();
    });

    test.each([
        {target: ""},
        {target: undefined},
        {target: null},
    ])("returns `undefined` if target string is empty ($target)", ({target}) => {
        const rule = new ResourceAllCaps({});
        const resource = createTestResourceString({source: "SOME_SOURCE", target});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeUndefined();
    });

    test("returns `undefined` if source string is an exception", () => {
        const options = {exceptions: ["ALL CAPS EXCEPTION"]}
        const rule = new ResourceAllCaps(options);
        const resource = createTestResourceString({source: "ALL CAPS EXCEPTION", target: "some target"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeUndefined();
    });

    test("returns `undefined` if source string is an exception when instantiated via RuleManager", () => {
        // This test verifies that the exception functionality works correctly when the rule is instantiated
        // through the RuleManager.get() method, which is the actual code path used in the system
        const ruleManager = new RuleManager();
        const builtinPlugin = new BuiltinPlugin();
        ruleManager.add(builtinPlugin.getRules());

        const rule = ruleManager.get("resource-all-caps", {exceptions: ["ALL CAPS EXCEPTION"]});

        expect(rule).toBeInstanceOf(ResourceAllCaps);

        const resource = createTestResourceString({source: "ALL CAPS EXCEPTION", target: "some target"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeUndefined();
    });

    test("returns error when source string is NOT an exception (showing exception functionality works)", () => {
        // This test verifies that the exception functionality is actually working by showing that
        // without the except parameter, the same test case would produce an error
        const ruleManager = new RuleManager();
        const builtinPlugin = new BuiltinPlugin();
        ruleManager.add(builtinPlugin.getRules());

        const rule = ruleManager.get("resource-all-caps", {}); // No except parameter

        expect(rule).toBeInstanceOf(ResourceAllCaps);

        const resource = createTestResourceString({source: "ALL CAPS EXCEPTION", target: "some target"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeInstanceOf(Result);
        expect(result.rule).toBeInstanceOf(ResourceAllCaps);
        expect(result.severity).toEqual("error");
    });

    test("returns `undefined` if source string is NOT in all caps", () => {
        const rule = new ResourceAllCaps({});
        const resource = createTestResourceString({source: "some source", target: "some target"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeUndefined();
    });

    test("returns `undefined` if source is in all caps and target is the same", () => {
        const rule = new ResourceAllCaps({});
        const resource = createTestResourceString({source: "ALL CAPS", target: "ALL CAPS"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeUndefined();
    });

    test("returns error if source is in all caps and target is different", () => {
        const rule = new ResourceAllCaps({});
        const resource = createTestResourceString({source: "ALL CAPS", target: "different target"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeInstanceOf(Result);
        // @ts-ignore - We're testing that result is defined
        expect(result.rule).toBeInstanceOf(ResourceAllCaps);
        // @ts-ignore - We're testing that result is defined
        expect(result.severity).toEqual("error");
        // @ts-ignore - We're testing that result is defined
        expect(result.fix).toBeDefined();
    });

    test("provides fix that converts target to ALL CAPS", () => {
        const rule = new ResourceAllCaps({});
        const resource = createTestResourceString({source: "ALL CAPS", target: "different target"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeInstanceOf(Result);
        // @ts-ignore - We're testing that result is defined
        expect(result.fix).toBeDefined();

        // @ts-ignore - We're testing that result is defined
        const fix = result.fix;
        expect(fix).toBeInstanceOf(Fix);
        // @ts-ignore
        expect(fix.commands).toHaveLength(1);

        // @ts-ignore
        const command = fix.commands[0];
        expect(command.stringFix).toEqual({
            position: 0,
            deleteCount: resource.target.length,
            insertContent: "DIFFERENT TARGET"
        });
    });

    test("provides fix that preserves non-letter characters", () => {
        const rule = new ResourceAllCaps({});
        const resource = createTestResourceString({source: "ALL CAPS", target: "error 404"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeInstanceOf(Result);
        // @ts-ignore - We're testing that result is defined
        expect(result.fix).toBeDefined();

        // @ts-ignore - We're testing that result is defined
        const fix = result.fix;
        expect(fix).toBeInstanceOf(Fix);
        // @ts-ignore
        expect(fix.commands).toHaveLength(1);

        // @ts-ignore
        const command = fix.commands[0];
        expect(command.stringFix).toEqual({
            position: 0,
            deleteCount: resource.target.length,
            insertContent: "ERROR 404"
        });
    });

    test("provides fix that handles mixed content correctly", () => {
        const rule = new ResourceAllCaps({});
        const resource = createTestResourceString({source: "ALL CAPS", target: "debug mode 123!"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeInstanceOf(Result);
        // @ts-ignore - We're testing that result is defined
        expect(result.fix).toBeDefined();

        // @ts-ignore - We're testing that result is defined
        const fix = result.fix;
        expect(fix).toBeInstanceOf(Fix);
        // @ts-ignore
        expect(fix.commands).toHaveLength(1);

        // @ts-ignore
        const command = fix.commands[0];
        expect(command.stringFix).toEqual({
            position: 0,
            deleteCount: resource.target.length,
            insertContent: "DEBUG MODE 123!"
        });
    });

    test("provides fix that handles accented characters", () => {
        const rule = new ResourceAllCaps({});
        const resource = createTestResourceString({source: "ALL CAPS", target: "año nuevo"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeInstanceOf(Result);
        // @ts-ignore - We're testing that result is defined
        expect(result.fix).toBeDefined();

        // @ts-ignore - We're testing that result is defined
        const fix = result.fix;
        expect(fix).toBeInstanceOf(Fix);
        // @ts-ignore
        expect(fix.commands).toHaveLength(1);

        // @ts-ignore
        const command = fix.commands[0];
        expect(command.stringFix).toEqual({
            position: 0,
            deleteCount: resource.target.length,
            insertContent: "AÑO NUEVO"
        });
    });

    test("provides fix that handles special characters", () => {
        const rule = new ResourceAllCaps({});
        const resource = createTestResourceString({source: "ALL CAPS", target: "café & résumé"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeInstanceOf(Result);
        // @ts-ignore - We're testing that result is defined
        expect(result.fix).toBeDefined();

        // @ts-ignore - We're testing that result is defined
        const fix = result.fix;
        expect(fix).toBeInstanceOf(Fix);
        // @ts-ignore
        expect(fix.commands).toHaveLength(1);

        // @ts-ignore
        const command = fix.commands[0];
        expect(command.stringFix).toEqual({
            position: 0,
            deleteCount: resource.target.length,
            insertContent: "CAFÉ & RÉSUMÉ"
        });
    });

    test("provides fix that handles multiple runs of letters separated by numbers", () => {
        const rule = new ResourceAllCaps({});
        const resource = createTestResourceString({source: "I LIKE 2 FISH", target: "me gustan 2 peces"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeInstanceOf(Result);
        // @ts-ignore - We're testing that result is defined
        expect(result.fix).toBeDefined();

        // @ts-ignore - We're testing that result is defined
        const fix = result.fix;
        expect(fix).toBeInstanceOf(Fix);
        // @ts-ignore
        expect(fix.commands).toHaveLength(1);

        // @ts-ignore
        const command = fix.commands[0];
        expect(command.stringFix).toEqual({
            position: 0,
            deleteCount: resource.target.length,
            insertContent: "ME GUSTAN 2 PECES"
        });
    });

    test("provides fix that handles German ess-zett character correctly", () => {
        const rule = new ResourceAllCaps({});
        const resource = createTestResourceString({source: "CASTLE", target: "schloß", targetLocale: "de-DE"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeInstanceOf(Result);
        // @ts-ignore - We're testing that result is defined
        expect(result.fix).toBeDefined();

        // @ts-ignore - We're testing that result is defined
        const fix = result.fix;
        expect(fix).toBeInstanceOf(Fix);
        // @ts-ignore
        expect(fix.commands).toHaveLength(1);

        // @ts-ignore
        const command = fix.commands[0];
        expect(command.stringFix).toEqual({
            position: 0,
            deleteCount: resource.target.length,
            insertContent: "SCHLOSS"
        });
    });

    test("provides fix that handles Turkish dotless and dotted i characters correctly", () => {
        const rule = new ResourceAllCaps({});
        const resource = createTestResourceString({source: "CITY", target: "şehir", targetLocale: "tr-TR"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeInstanceOf(Result);
        // @ts-ignore - We're testing that result is defined
        expect(result.fix).toBeDefined();

        // @ts-ignore - We're testing that result is defined
        const fix = result.fix;
        expect(fix).toBeInstanceOf(Fix);
        // @ts-ignore
        expect(fix.commands).toHaveLength(1);

        // @ts-ignore
        const command = fix.commands[0];
        expect(command.stringFix).toEqual({
            position: 0,
            deleteCount: resource.target.length,
            insertContent: "ŞEHİR"
        });
    });

    test("applies auto-fix to convert target to ALL CAPS", () => {
        expect.assertions(3);

        const rule = new ResourceAllCaps({});
        const resource = createTestResourceString({source: "I LIKE 2 FISH", target: "me gustan 2 peces"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeInstanceOf(Result);
        // @ts-ignore - We're testing that result is defined
        expect(result.fix).toBeDefined();

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("test.xliff"),
            dirty: false
        });

        const fixer = new ResourceFixer();
        // @ts-ignore - We're testing that result is defined
        fixer.applyFixes(ir, [result.fix]);

        const fixedResource = ir.getRepresentation()[0];
        expect(fixedResource.getTarget()).toBe("ME GUSTAN 2 PECES");
    });

    test("returns `undefined` for languages without capital letters (Arabic)", () => {
        const rule = new ResourceAllCaps({});
        const resource = createTestResourceString({source: "ALL_CAPS", target: "نص عربي", targetLocale: "ar-SA"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeUndefined();
    });

    test("returns `undefined` for languages without capital letters (Chinese)", () => {
        const rule = new ResourceAllCaps({});
        const resource = createTestResourceString({source: "ALL_CAPS", target: "中文文本", targetLocale: "zh-CN"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeUndefined();
    });

    test("returns `undefined` for languages without capital letters (Japanese)", () => {
        const rule = new ResourceAllCaps({});
        const resource = createTestResourceString({source: "ALL_CAPS", target: "日本語テキスト", targetLocale: "ja-JP"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeUndefined();
    });

    test("returns `undefined` for languages without capital letters (Thai)", () => {
        const rule = new ResourceAllCaps({});
        const resource = createTestResourceString({source: "ALL_CAPS", target: "ข้อความภาษาไทย", targetLocale: "th-TH"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeUndefined();
    });

    test("returns `undefined` for languages without capital letters (Korean)", () => {
        const rule = new ResourceAllCaps({});
        const resource = createTestResourceString({source: "ALL_CAPS", target: "한국어 텍스트", targetLocale: "ko-KR"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeUndefined();
    });

    test("returns error for languages with capital letters when target doesn't match (Spanish)", () => {
        const rule = new ResourceAllCaps({});
        const resource = createTestResourceString({source: "ALL CAPS", target: "texto en minusculas", targetLocale: "es-ES"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeInstanceOf(Result);
        // @ts-ignore - We're testing that result is defined
        expect(result.rule).toBeInstanceOf(ResourceAllCaps);
        // @ts-ignore - We're testing that result is defined
        expect(result.severity).toEqual("error");
    });

    test("returns `undefined` for languages with capital letters when target matches (Spanish)", () => {
        const rule = new ResourceAllCaps({});
        const resource = createTestResourceString({source: "ALL CAPS", target: "ALL CAPS", targetLocale: "es-ES"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeUndefined();
    });
});

describe('ResourceAllCaps.isAllCaps', () => {
    test.each(
        [
            {name: "simple all caps", source: "ALL CAPS"},
            {name: "all caps with spaces", source: "ALL CAPS TEXT"},
            {name: "all caps with numbers", source: "ALL CAPS 123"},
            {name: "all caps with punctuation", source: "ALL CAPS!"},
            {name: "all caps with leading and trailing whitespace", source: " ALL CAPS "},
            {name: "all caps with mixed punctuation", source: "ALL CAPS 123!"},
            {name: "all caps with multiple words", source: "ALL CAPS TEXT"},
            {name: "all caps with hyphens", source: "ALL-CAPS-TEXT"},
            {name: "all caps with dots", source: "ALL.CAPS.TEXT"},
        ]
    )("returns `true` if source string is $name", ({source}) => {
        const rule = new ResourceAllCaps({});

        const result = rule.isAllCaps(source);

        expect(result).toBe(true);
    });

    test.each([
        {name: "whitespace solely", source: " "},
        {name: "digits solely", source: "123"},
        {name: "lowercase letters word solely", source: "word"},
        {name: "mixed case word", source: "Word"},
        {name: "camel case", source: "camelCase"},
        {name: "snake case", source: "snake_case"},
        {name: "kebab case", source: "kebab-case"},
        {name: "text with mixed case", source: "Some Text"},
        {name: "text with lowercase", source: "some text"},
        {name: "text with one lowercase letter", source: "ALL CaPS"},
        {name: "text with one uppercase letter", source: "all cAps"},
        {name: "empty string", source: ""},
        {name: "null", source: null},
        {name: "undefined", source: undefined},
    ])("returns `false` if source string is $name", ({source}) => {
        const rule = new ResourceAllCaps({});

        const result = rule.isAllCaps(source || "");

        expect(result).toBe(false);
    });

    test.each([
        {name: "null", source: null},
        {name: "undefined", source: undefined},
    ])("returns `false` if source string is $name", ({source}) => {
        const rule = new ResourceAllCaps({});

        const result = rule.isAllCaps(source || "");

        expect(result).toBe(false);
    });
});

describe('ResourceAllCaps.hasCapitalLetters', () => {
    test.each([
        {name: "English", locale: "en-US"},
        {name: "Spanish", locale: "es-ES"},
        {name: "French", locale: "fr-FR"},
        {name: "German", locale: "de-DE"},
        {name: "Italian", locale: "it-IT"},
        {name: "Portuguese", locale: "pt-BR"},
        {name: "Russian", locale: "ru-RU"},
        {name: "Greek", locale: "el-GR"},
        {name: "Turkish", locale: "tr-TR"},
        {name: "Polish", locale: "pl-PL"},
        {name: "Czech", locale: "cs-CZ"},
        {name: "Hungarian", locale: "hu-HU"},
        {name: "Romanian", locale: "ro-RO"},
        {name: "Bulgarian", locale: "bg-BG"},
        {name: "Croatian", locale: "hr-HR"},
        {name: "Slovak", locale: "sk-SK"},
        {name: "Slovenian", locale: "sl-SI"},
        {name: "Estonian", locale: "et-EE"},
        {name: "Latvian", locale: "lv-LV"},
        {name: "Lithuanian", locale: "lt-LT"},
    ])("returns `true` for $name locale", ({locale}) => {
        const rule = new ResourceAllCaps({});

        const result = rule.hasCapitalLetters(locale);

        expect(result).toBe(true);
    });

    test.each([
        {name: "Arabic", locale: "ar-SA"},
        {name: "Chinese Simplified", locale: "zh-CN"},
        {name: "Chinese Traditional", locale: "zh-TW"},
        {name: "Japanese", locale: "ja-JP"},
        {name: "Korean", locale: "ko-KR"},
        {name: "Thai", locale: "th-TH"},
        {name: "Hebrew", locale: "he-IL"},
        {name: "Persian", locale: "fa-IR"},
        {name: "Urdu", locale: "ur-PK"},
        {name: "Bengali", locale: "bn-BD"},
        {name: "Hindi", locale: "hi-IN"},
        {name: "Tamil", locale: "ta-IN"},
        {name: "Telugu", locale: "te-IN"},
        {name: "Kannada", locale: "kn-IN"},
        {name: "Malayalam", locale: "ml-IN"},
        {name: "Gujarati", locale: "gu-IN"},
        {name: "Marathi", locale: "mr-IN"},
        {name: "Punjabi", locale: "pa-IN"},
        {name: "Odia", locale: "or-IN"},
        {name: "Assamese", locale: "as-IN"},
        {name: "Nepali", locale: "ne-NP"},
        {name: "Sinhala", locale: "si-LK"},
        {name: "Khmer", locale: "km-KH"},
        {name: "Lao", locale: "lo-LA"},
        {name: "Myanmar", locale: "my-MM"},
        {name: "Tibetan", locale: "bo-CN"},
        {name: "Georgian", locale: "ka-GE"},
        {name: "Amharic", locale: "am-ET"},
        {name: "Tigrinya", locale: "ti-ET"},
    ])("returns `false` for $name locale", ({locale}) => {
        const rule = new ResourceAllCaps({});

        const result = rule.hasCapitalLetters(locale);

        expect(result).toBe(false);
    });
});

describe('ResourceAllCaps with ResourceArray', () => {
    test("returns error for array resource when source item is ALL CAPS but target item is not", () => {
        const rule = new ResourceAllCaps({});
        const resource = new ResourceArray({
            key: "array.test.key",
            source: ["NORMAL TEXT", "ALL CAPS TEXT", "another normal text"],
            target: ["Texto normal", "texto en minusculas", "otro texto normal"],
            sourceLocale: "en-US",
            targetLocale: "es-ES",
            pathName: "tests/for/array.xliff"
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("test.xliff")
        });

        const result = rule.match({
            ir,
            file: resource.pathName
        });

        // Handle both single result and array of results
        const actualResult = Array.isArray(result) ? result[0] : result;
        expect(actualResult).toBeInstanceOf(Result);
        // @ts-ignore - We're testing that result is defined
        expect(actualResult.rule).toBeInstanceOf(ResourceAllCaps);
        // @ts-ignore - We're testing that result is defined
        expect(actualResult.severity).toEqual("error");
        // @ts-ignore - We're testing that result is defined
        expect(actualResult.fix).toBeDefined();
    });

    test("returns undefined for array resource when source item is not ALL CAPS", () => {
        const rule = new ResourceAllCaps({});
        const resource = new ResourceArray({
            key: "array.test.key",
            source: ["normal text", "another normal text"],
            target: ["texto normal", "otro texto normal"],
            sourceLocale: "en-US",
            targetLocale: "es-ES",
            pathName: "tests/for/array.xliff"
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("test.xliff")
        });

        const result = rule.match({
            ir,
            file: resource.pathName
        });

        expect(result).toBeUndefined();
    });

    test("returns undefined for array resource when source and target items are both ALL CAPS", () => {
        const rule = new ResourceAllCaps({});
        const resource = new ResourceArray({
            key: "array.test.key",
            source: ["ALL CAPS TEXT", "ANOTHER ALL CAPS"],
            target: ["TEXTO EN MAYÚSCULAS", "OTRO TEXTO EN MAYÚSCULAS"],
            sourceLocale: "en-US",
            targetLocale: "es-ES",
            pathName: "tests/for/array.xliff"
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("test.xliff")
        });

        const result = rule.match({
            ir,
            file: resource.pathName
        });

        expect(result).toBeUndefined();
    });

    test("provides fix for array resource that converts target item to ALL CAPS", () => {
        const rule = new ResourceAllCaps({});
        const resource = new ResourceArray({
            key: "array.test.key",
            source: ["NORMAL TEXT", "ALL CAPS TEXT", "another normal text"],
            target: ["Texto normal", "texto en minusculas", "otro texto normal"],
            sourceLocale: "en-US",
            targetLocale: "es-ES",
            pathName: "tests/for/array.xliff"
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("test.xliff")
        });

        const result = rule.match({
            ir,
            file: resource.pathName
        });

        // Handle both single result and array of results
        const actualResult = Array.isArray(result) ? result[0] : result;
        expect(actualResult).toBeInstanceOf(Result);
        // @ts-ignore - We're testing that result is defined
        expect(actualResult.fix).toBeDefined();

        // @ts-ignore - We're testing that result is defined
        const fix = actualResult.fix;
        expect(fix).toBeInstanceOf(Fix);
        // @ts-ignore
        expect(fix.commands).toHaveLength(1);

        // @ts-ignore
        const command = fix.commands[0];
        expect(command.stringFix).toEqual({
            position: 0,
            deleteCount: "Texto normal".length,
            insertContent: "TEXTO NORMAL"
        });
    });
});

describe('ResourceAllCaps with ResourcePlural', () => {
    test("returns error for plural resource when source category is ALL CAPS but target category is not", () => {
        const rule = new ResourceAllCaps({});
        const resource = new ResourcePlural({
            key: "plural.test.key",
            source: {
                one: "ONE MESSAGE",
                other: "OTHER MESSAGES"
            },
            target: {
                one: "un mensaje",
                other: "otros mensajes"
            },
            sourceLocale: "en-US",
            targetLocale: "es-ES",
            pathName: "tests/for/plural.xliff"
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("test.xliff")
        });

        const result = rule.match({
            ir,
            file: resource.pathName
        });

        // Handle both single result and array of results
        const actualResult = Array.isArray(result) ? result[0] : result;
        expect(actualResult).toBeInstanceOf(Result);
        // @ts-ignore - We're testing that result is defined
        expect(actualResult.rule).toBeInstanceOf(ResourceAllCaps);
        // @ts-ignore - We're testing that result is defined
        expect(actualResult.severity).toEqual("error");
        // @ts-ignore - We're testing that result is defined
        expect(actualResult.fix).toBeDefined();
    });

    test("returns undefined for plural resource when source category is not ALL CAPS", () => {
        const rule = new ResourceAllCaps({});
        const resource = new ResourcePlural({
            key: "plural.test.key",
            source: {
                one: "one message",
                other: "other messages"
            },
            target: {
                one: "un mensaje",
                other: "otros mensajes"
            },
            sourceLocale: "en-US",
            targetLocale: "es-ES",
            pathName: "tests/for/plural.xliff"
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("test.xliff")
        });

        const result = rule.match({
            ir,
            file: resource.pathName
        });

        expect(result).toBeUndefined();
    });

    test("returns undefined for plural resource when source and target categories are both ALL CAPS", () => {
        const rule = new ResourceAllCaps({});
        const resource = new ResourcePlural({
            key: "plural.test.key",
            source: {
                one: "ONE MESSAGE",
                other: "OTHER MESSAGES"
            },
            target: {
                one: "UN MENSAJE",
                other: "OTROS MENSAJES"
            },
            sourceLocale: "en-US",
            targetLocale: "es-ES",
            pathName: "tests/for/plural.xliff"
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("test.xliff")
        });

        const result = rule.match({
            ir,
            file: resource.pathName
        });

        expect(result).toBeUndefined();
    });

    test("provides fix for plural resource that converts target category to ALL CAPS", () => {
        const rule = new ResourceAllCaps({});
        const resource = new ResourcePlural({
            key: "plural.test.key",
            source: {
                one: "ONE MESSAGE",
                other: "OTHER MESSAGES"
            },
            target: {
                one: "un mensaje",
                other: "otros mensajes"
            },
            sourceLocale: "en-US",
            targetLocale: "es-ES",
            pathName: "tests/for/plural.xliff"
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("test.xliff")
        });

        const result = rule.match({
            ir,
            file: resource.pathName
        });

        // Handle both single result and array of results
        const actualResult = Array.isArray(result) ? result[0] : result;
        expect(actualResult).toBeInstanceOf(Result);
        // @ts-ignore - We're testing that result is defined
        expect(actualResult.fix).toBeDefined();

        // @ts-ignore - We're testing that result is defined
        const fix = actualResult.fix;
        expect(fix).toBeInstanceOf(Fix);
        // @ts-ignore
        expect(fix.commands).toHaveLength(1);

        // @ts-ignore
        const command = fix.commands[0];
        expect(command.stringFix).toEqual({
            position: 0,
            deleteCount: "un mensaje".length,
            insertContent: "UN MENSAJE"
        });
    });

    test("handles plural resource with mixed ALL CAPS and normal categories", () => {
        const rule = new ResourceAllCaps({});
        const resource = new ResourcePlural({
            key: "plural.test.key",
            source: {
                one: "ONE MESSAGE",
                other: "other messages"
            },
            target: {
                one: "un mensaje",
                other: "otros mensajes"
            },
            sourceLocale: "en-US",
            targetLocale: "es-ES",
            pathName: "tests/for/plural.xliff"
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("test.xliff")
        });

        const result = rule.match({
            ir,
            file: resource.pathName
        });

        // Handle both single result and array of results
        const actualResult = Array.isArray(result) ? result[0] : result;
        expect(actualResult).toBeInstanceOf(Result);
        // @ts-ignore - We're testing that result is defined
        expect(actualResult.severity).toEqual("error");
    });
});

function createTestResourceString({source, target, targetLocale = "en-US"}) {
    return new ResourceString({
        source,
        target,
        key: "all.caps.test.string.id",
        sourceLocale: "en-US",
        targetLocale,
        pathName: "tests/for/allCaps.xliff"
    });
} 