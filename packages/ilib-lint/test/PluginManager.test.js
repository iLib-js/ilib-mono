/*
 * PluginManager.test.js - test the plugin manager
 *
 * Copyright © 2022-2024 JEDLSoft
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

import path from "node:path";

import PluginManager from '../src/PluginManager.js';
import { Parser, Result, SourceFile } from 'ilib-lint-common';
import { ResourceString } from 'ilib-tools-common';
import { TestFixerTypeId } from './ilib-lint-plugin-test/src/TestFixer.js';

describe("testPluginManager", () => {
    test("PluginManagerNormal", () => {
        expect.assertions(1);

        const pm = new PluginManager();

        expect(pm).toBeTruthy();
    });

    test("PluginManagerGetParserManager", () => {
        expect.assertions(2);

        const plgmgr = new PluginManager();
        expect(plgmgr).toBeTruthy();

        const parserMgr = plgmgr.getParserManager();
        expect(parserMgr).toBeTruthy();
    });

    test("PluginManagerGetFormatterManager", () => {
        expect.assertions(2);

        const plgmgr = new PluginManager();
        expect(plgmgr).toBeTruthy();

        const formatterMgr = plgmgr.getFormatterManager();
        expect(formatterMgr).toBeTruthy();
    });

    test("PluginManagerGetRuleManager", () => {
        expect.assertions(2);

        const plgmgr = new PluginManager();
        expect(plgmgr).toBeTruthy();

        const rm = plgmgr.getRuleManager();
        expect(rm).toBeTruthy();
    });

    test("PluginManagerGetLoadPlugin", () => {
        expect.assertions(4);

        const plgmgr = new PluginManager();
        expect(plgmgr).toBeTruthy();

        return plgmgr.load([
            "ilib-lint-plugin-test"
        ]).then(result => {
            expect(result).toBeTruthy();
            expect(result.length).toBe(1);
            expect(result[0].status).toBe("fulfilled");
        });

    });

    test("PluginManagerGetLoadPluginRightParser", () => {
        expect.assertions(6);

        const plgmgr = new PluginManager();
        expect(plgmgr).toBeTruthy();

        return plgmgr.load([
            "ilib-lint-plugin-test"
        ]).then(result => {
            expect(result).toBeTruthy();

            const pm = plgmgr.getParserManager();
            expect(pm).toBeTruthy();
            const parsers = pm.get("xyz");
            expect(parsers).toBeTruthy();
            expect(parsers.length).toBe(1);

            const testParser = parsers[0];
            expect(testParser.getName()).toBe("parser-xyz");
        });
    });

    test("PluginManagerGetLoadPluginParserWorks", () => {
        expect.assertions(12);

        const plgmgr = new PluginManager();
        expect(plgmgr).toBeTruthy();

        return plgmgr.load([
            "ilib-lint-plugin-test"
        ]).then(result => {
            expect(result).toBeTruthy();

            const pm = plgmgr.getParserManager();
            const parsers = pm.get("xyz");
            const testParser = parsers[0];
            expect(testParser).toBeTruthy();
            expect(testParser.getName()).toBe("parser-xyz");

            const ir = testParser.parse(new SourceFile("./test/testfiles/strings.xyz", {}));
            const resources = ir[0].getRepresentation();
            expect(resources).toBeTruthy();
            expect(resources.length).toBe(3);

            for (let i = 0; i < 3; i++) {
                expect(resources[i].getSource()).toBe(`string${i+1}`);
                expect(resources[i].getTarget()).toBe(`value${i+1}`);
            }
        });
    });

    test("PluginManager load the right plugin with the ilib-lint- prefix", () => {
        expect.assertions(5);

        const plgmgr = new PluginManager();
        expect(plgmgr).toBeTruthy();

        return plgmgr.load([
            "ilib-lint-plugin-test"
        ]).then(result => {
            expect(result).toBeTruthy();

            const fm = plgmgr.getFormatterManager();
            expect(fm).toBeTruthy();
            const formatter = fm.get("formatter-test");
            expect(formatter).toBeTruthy();
            expect(formatter.getName()).toBe("formatter-test");
        });
    });

    test("PluginManagerGetLoadPluginFormatterWorks", () => {
        expect.assertions(6);

        const plgmgr = new PluginManager();
        expect(plgmgr).toBeTruthy();
        const fm = plgmgr.getFormatterManager();
        const rm = plgmgr.getRuleManager();

        return plgmgr.load([
            "ilib-lint-plugin-test"
        ]).then(result => {
            expect(result).toBeTruthy();

            const formatter = fm.get("formatter-test");
            expect(formatter).toBeTruthy();
            const rule = rm.get("resource-test");
            expect(rule).toBeTruthy();

            const str = formatter.format(new Result({
                severity: "warning",
                description: 'Source string should not contain the word "test"',
                id: "formatter.test",
                highlight: "Source: This string has the word <e0>test</e0> in it.",
                pathName: "z/y/a.xyz",
                rule
            }));

            expect(str).toBeTruthy();
            expect(str).toBe(`z/y/a.xyz:
__Source_string_should_not_contain_the_word_"test"
__Key:_formatter.test
__Source:_This_string_has_the_word_>>test<<_in_it.
__Rule_(resource-test):_Test_for_the_existence_of_the_word_'test'_in_the_strings.\n`);
        });
    });

    test("PluginManager load the right plugin without the ilib-lint- prefix", () => {
        expect.assertions(5);

        const plgmgr = new PluginManager();
        expect(plgmgr).toBeTruthy();

        return plgmgr.load([
            "plugin-test"
        ]).then(result => {
            expect(result).toBeTruthy();

            const fm = plgmgr.getFormatterManager();
            expect(fm).toBeTruthy();
            // the plugin "plugin-test" does not have a formatter, but the
            // "ilib-lint-plugin-test" does, so if we got the wrong one without the prefix,
            // this below would fail
            const formatter = fm.get("formatter-test");
            expect(formatter).toBeTruthy();
            expect(formatter.getName()).toBe("formatter-test");
        });
    });

    test("PluginManager load the specific plugin if given an absolute path", () => {
        expect.assertions(4);

        const plgmgr = new PluginManager();
        expect(plgmgr).toBeTruthy();
        const fullPath = path.join(process.cwd(), "test", "plugin-test");
        return plgmgr.load([
            fullPath
        ]).then(result => {
            expect(result).toBeTruthy();

            const fm = plgmgr.getFormatterManager();
            expect(fm).toBeTruthy();
            // the plugin "plugin-test" does not have a formatter, so if we got the wrong
            // one (the one with the prefix), then formatter will be not undefined
            const formatter = fm.get("formatter-test");
            expect(formatter).toBeFalsy();
        });
    });

    test("PluginManager load the specific plugin if given a relative path", () => {
        expect.assertions(4);

        const plgmgr = new PluginManager();
        expect(plgmgr).toBeTruthy();
        const relPath = path.join("test", "plugin-test");
        return plgmgr.load([
            relPath
        ]).then(result => {
            expect(result).toBeTruthy();

            const fm = plgmgr.getFormatterManager();
            expect(fm).toBeTruthy();
            // the plugin "plugin-test" does not have a formatter, so if we got the wrong
            // one (the one with the prefix), then formatter will be not undefined
            const formatter = fm.get("formatter-test");
            expect(formatter).toBeFalsy();
        });
    });

    test("PluginManagerGetLoadPluginRightRules", () => {
        expect.assertions(9);

        const plgmgr = new PluginManager();
        expect(plgmgr).toBeTruthy();
        const rm = plgmgr.getRuleManager();
        expect(rm).toBeTruthy();
        const size = rm.size();

        return plgmgr.load([
            "ilib-lint-plugin-test"
        ]).then(result => {
            expect(result).toBeTruthy();
            expect(rm.size()).toBe(size + 1); // the plugin added 1 new one

            const rules = rm.getRules();
            expect(rules).toBeTruthy();
            expect(rules.length).toBe(size + 1);
            expect(typeof(rules[size])).toBe('function');
            const rule = rm.get("resource-test");
            expect(Object.getPrototypeOf(rule).constructor.name).toBe("TestRule");
            expect(rule.getName()).toBe("resource-test");
        });
    });

    test("PluginManagerGetLoadPluginRulesWork", () => {
        expect.assertions(13);

        const plgmgr = new PluginManager();
        expect(plgmgr).toBeTruthy();
        const rm = plgmgr.getRuleManager();
        expect(rm).toBeTruthy();

        return plgmgr.load([
            "ilib-lint-plugin-test"
        ]).then(loadResult => {
            expect(loadResult).toBeTruthy();

            const rule = rm.get("resource-test");

            expect(rule).toBeTruthy();
            let result = rule.match({
                locale: "de-DE",
                resource: new ResourceString({
                    key: "quote.test",
                    sourceLocale: "en-US",
                    source: 'This string contains “quotes” in it.',
                    targetLocale: "de-DE",
                    target: 'Diese Zeichenfolge enthält "Anführungszeichen".',
                    pathName: "a/b/c.xliff"
                }),
                file: "x"
            });
            expect(!result).toBeTruthy();

            result = rule.match({
                locale: "de-DE",
                resource: new ResourceString({
                    key: "plugin.test",
                    sourceLocale: "en-US",
                    source: 'This string contains the word test in it.',
                    targetLocale: "de-DE",
                    target: 'Diese Zeichenfolge enthält den Wort "Test" drin.',
                    pathName: "a/b/c.xliff"
                }),
                file: "x"
            });
            expect(result).toBeTruthy();
            expect(!Array.isArray(result)).toBeTruthy();
            expect(result.severity).toBe("warning");
            expect(result.description).toBe('Source string should not contain the word "test"');
            expect(result.rule).toBe(rule);
            expect(result.id).toBe("plugin.test");
            expect(result.highlight).toBe("Source: This string contains the word <e0>test</e0> in it.");
            expect(result.pathName).toBe("x");
        });
    });

    test("PluginManagerGetLoadPluginRightRuleSets", () => {
        expect.assertions(7);

        const plgmgr = new PluginManager();
        expect(plgmgr).toBeTruthy();
        const rm = plgmgr.getRuleManager();
        expect(rm).toBeTruthy();
        const size = rm.sizeRuleSetDefinitions();

        return plgmgr.load([
            "ilib-lint-plugin-test"
        ]).then(result => {
            expect(result).toBeTruthy();
            expect(rm.sizeRuleSetDefinitions()).toBe(size + 1); // the plugin added 1 new one

            const set = rm.getRuleSetDefinition("test");
            expect(set).toBeTruthy();
            expect(set["resource-test"]).toBeTruthy();
            expect(typeof(set["resource-test"])).toBe('boolean');
        });
    });

    test("PluginManagerGetBuiltInRuleSets", () => {
        expect.assertions(10);

        const plgmgr = new PluginManager();
        expect(plgmgr).toBeTruthy();
        const rm = plgmgr.getRuleManager();
        expect(rm).toBeTruthy();
        const size = rm.sizeRuleSetDefinitions();

        expect(rm.sizeRuleSetDefinitions()).toBe(2);

        const genericRuleset = rm.getRuleSetDefinition("generic");
        expect(genericRuleset).toBeTruthy();
        expect(genericRuleset["resource-icu-plurals"]).toBeTruthy();
        expect(genericRuleset["resource-url-match"]).toBeTruthy();
        expect(typeof(genericRuleset["resource-icu-plurals"])).toBe('boolean');
        expect(typeof(genericRuleset["resource-url-match"])).toBe('boolean');

        const sourceRuleset = rm.getRuleSetDefinition("source");
        expect(sourceRuleset).toBeTruthy();
        expect(typeof(sourceRuleset["resource-source-icu-plural-syntax"])).toBe('boolean');
    });

    test("PluginManagerGetLoadPluginRightFixer", () => {
        expect.assertions(5);

        const plgmgr = new PluginManager();
        expect(plgmgr).toBeTruthy();

        return plgmgr.load([
            "ilib-lint-plugin-test"
        ]).then(result => {
            expect(result).toBeTruthy();

            const fixerManager = plgmgr.getFixerManager();
            expect(fixerManager).toBeTruthy();
            const fixer = fixerManager.get(TestFixerTypeId);
            expect(fixer).toBeTruthy();
            expect(fixer?.type).toBe(TestFixerTypeId);
        });
    });

    test("PluginManager make sure we cannot load an old plugin at all", () => {
        expect.assertions(7);

        const plgmgr = new PluginManager();
        expect(plgmgr).toBeTruthy();

        return plgmgr.load([
            "i18nlint-plugin-test-old"
        ]).then(result => {
            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBeTruthy();
            expect(result[0].value).toBeUndefined();

            // should not be able to load the old plugin, so the def parser
            // should not be available. The StringParser is the default
            // parser
            const pm = plgmgr.getParserManager();
            const parsers = pm.get("def");
            expect(parsers).toBeTruthy();
            expect(parsers.length).toBe(1);

            const testParser = parsers[0];
            expect(testParser.getName()).toBe("string");
        }).catch(e2 => {
            // should throw an exception because the plugin is found
            // but not accepted
            console.dir(`error is ${e2}`);
            expect(e2).toBeFalsy();
        });
    });

    test("PluginManager make sure we cannot load an obsolete plugin", () => {
        expect.assertions(7);

        const plgmgr = new PluginManager();
        expect(plgmgr).toBeTruthy();

        return plgmgr.load([
            "ilib-lint-plugin-obsolete"
        ]).then(result => {
            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBeTruthy();
            expect(result[0].value).toBeUndefined();

            // should not be able to load the old plugin, so the ghi parser
            // should not be available. The StringParser is the default
            // parser
            const pm = plgmgr.getParserManager();
            const parsers = pm.get("ghi");
            expect(parsers).toBeTruthy();
            expect(parsers.length).toBe(1);

            const testParser = parsers[0];
            expect(testParser.getName()).toBe("string");
        }).catch(e2 => {
            // should throw an exception because the plugin is found
            // but not accepted
            console.dir(`error is ${e2}`);
            expect(e2).toBeFalsy();
        });
    });
});

