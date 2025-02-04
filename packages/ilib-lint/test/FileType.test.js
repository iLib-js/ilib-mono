/*
 * FileType.test.js - test the file type object
 *
 * Copyright © 2023-2025 JEDLSoft
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

import { Serializer } from 'ilib-lint-common';

import FileType from '../src/FileType.js';
import Project from '../src/Project.js';
import PluginManager from '../src/PluginManager.js';

const pluginManager = new PluginManager();
const ruleMgr = pluginManager.getRuleManager();

ruleMgr.addRuleSetDefinition("asdf", {
    "resource-icu-plurals": true,
    "resource-quote-style": "localeOnly"
});

ruleMgr.addRuleSetDefinition("no-state-checker", {
    "resource-state-checker": false
});

const project = new Project("x", {
    locales: ["fr-FR", "nl-NL"],
    pluginManager
}, {});

const projectWithValidPlugins = new Project("y", {
    locales: ["fr-FR", "nl-NL"],
    pluginManager
}, {
    plugins: [
        "ilib-lint-plugin-test"
    ],
    fileTypes: {
        "test": {
            "name": "test",
            "parsers": ["parser-xyz"],
            "formatter": ["formatter-xyz"],
            "serializer": "serializer-xyz"
        }
    }
});

const projectWithParserAndUnknownSerializer = new Project("z", {
    locales: ["fr-FR", "nl-NL"],
    pluginManager
}, {
    plugins: [
        "ilib-lint-plugin-test"
    ],
    fileTypes: {
        "test": {
            "name": "test",
            "parsers": ["parser-xyz"],
            "formatter": ["formatter-xyz"],
            "serializer": "non-existent-serializer"
        }
    }
});

class MockSerializer extends Serializer {
    constructor(options) {
        super(options);

        this.extensions = [ "mock" ];
        this.name = "mock-serializer";
        // this is different than the parser from ilib-lint-plugin-test which
        // is of type "resource"
        this.type = "mock-type";
    }

    serialize(irs) {
        return undefined;
    }
}

const serializerMgr = pluginManager.getSerializerManager();
serializerMgr.add([ MockSerializer ]);

const projectWithWrongTypeOfSerializer = new Project("a", {
    locales: ["fr-FR", "nl-NL"],
    pluginManager
}, {
    plugins: [
        "ilib-lint-plugin-test"
    ],
    fileTypes: {
        "test": {
            "name": "test",
            "parsers": ["parser-xyz"],
            "formatter": ["formatter-xyz"],
            // this serializer is different than the parser from ilib-lint-plugin-test which
            // is of type "resource"
            "serializer": "mock-serializer"
        }
    }
});

describe("testFileType", () => {
    beforeAll(async () => {
        await project.init();
        await projectWithValidPlugins.init();
        await projectWithParserAndUnknownSerializer.init();
        await projectWithWrongTypeOfSerializer.init();
    });

    test("FileTypeConstructorEmpty", () => {
        expect.assertions(1);

        const ft = new FileType({
            name: "test",
            project
        });
        expect(ft).toBeTruthy();
    });

    test("FileTypeConstructor loads plugins properly", () => {
        expect.assertions(1);

        const ft = new FileType({
            name: "test",
            project: projectWithValidPlugins,
            ...projectWithValidPlugins.config.fileTypes.test
        });
        expect(ft).toBeTruthy();
    });

    test("FileTypeConstructorInsufficientParamsName", () => {
        expect.assertions(1);

        expect(() => {
            const ft = new FileType({
                project
            });
        }).toThrow(/Missing required options to the FileType constructor/);
    });

    test("FileTypeConstructorInsufficientParamsProject", () => {
        expect.assertions(1);

        expect(() => {
            const ft = new FileType({
                name: "test"
            });
        }).toThrow(/Missing required options to the FileType constructor/);
    });

    test("FileTypeConstructor throws exception if the serializer names a type that doesn't exist", () => {
        expect.assertions(1);

        expect(() => {
            const ft = new FileType({
                name: "test",
                project: projectWithParserAndUnknownSerializer,
                ...projectWithParserAndUnknownSerializer.config.fileTypes.test
            });
        }).toThrow(/Could not find or instantiate serializer non-existent-serializer named in the configuration for filetype test/);
    });

    test("FileTypeConstructor throws exception if the serializer is a different type than the parser", () => {
        expect.assertions(1);

        expect(() => {
            const ft = new FileType({
                name: "test",
                project: projectWithWrongTypeOfSerializer,
                ...projectWithWrongTypeOfSerializer.config.fileTypes.test
            });
        }).toThrow(/The serializer mock-serializer processes representations of type mock-type, but the filetype test handles representations of type resource. The two types must match./);
    });

    test("FileTypeGetName", () => {
        expect.assertions(2);

        const ft = new FileType({
            name: "test",
            project
        });
        expect(ft).toBeTruthy();

        expect(ft.getName()).toBe("test");
    });

    test("FileTypeGetProject", () => {
        expect.assertions(2);

        const ft = new FileType({
            name: "test",
            project
        });
        expect(ft).toBeTruthy();

        expect(ft.getProject()).toBe(project);
    });

    test("FileTypeGetLocales", () => {
        expect.assertions(2);

        const locales = ["en-US", "de-DE"];
        const ft = new FileType({
            name: "test",
            locales,
            project
        });
        expect(ft).toBeTruthy();

        expect(ft.getLocales()).toBe(locales);
    });

    test("FileTypeGetLocalesFromProject", () => {
        expect.assertions(2);

        const ft = new FileType({
            name: "test",
            project
        });
        expect(ft).toBeTruthy();

        expect(ft.getLocales()).toEqual(["fr-FR", "nl-NL"]);
    });

    test("FileTypeGetTemplate", () => {
        expect.assertions(2);

        const template = "[dir]/[locale].json";
        const ft = new FileType({
            name: "test",
            template,
            project
        });
        expect(ft).toBeTruthy();

        expect(ft.getTemplate()).toBe(template);
    });

    test("FileTypeGetRuleSetNamesSingle", () => {
        expect.assertions(2);

        const ruleset = "ruleset1";
        const ft = new FileType({
            name: "test",
            ruleset,
            project
        });
        expect(ft).toBeTruthy();

        expect(ft.getRuleSetNames()).toStrictEqual([ "ruleset1" ]);
    });

    test("FileTypeGetRuleSetNamesMultiple", () => {
        expect.assertions(2);

        const ruleset = [ "ruleset1", "ruleset2" ];
        const ft = new FileType({
            name: "test",
            ruleset,
            project
        });
        expect(ft).toBeTruthy();

        expect(ft.getRuleSetNames()).toStrictEqual(ruleset);
    });

    test("FileTypeGetRuleSetNamesSingleArray", () => {
        expect.assertions(2);

        const ruleset = [ "ruleset1" ];
        const ft = new FileType({
            name: "test",
            ruleset,
            project
        });
        expect(ft).toBeTruthy();

        expect(ft.getRuleSetNames()).toStrictEqual(ruleset);
    });

    test("FileTypeGetRuleSetNamesUnnamed", () => {
        expect.assertions(4);

        const ruleset = {
            "resource-icu-plurals": true,
            "resource-quote-style": "localeOnly"
        };
        const ft = new FileType({
            name: "test",
            ruleset,
            project
        });
        expect(ft).toBeTruthy();

        const names = ft.getRuleSetNames();
        expect(Array.isArray(names)).toBeTruthy();
        expect(names.length).toBe(1);
        expect(names[0]).toBe("test-unnamed-ruleset");
    });

    test("FileTypeGetRuleSet", () => {
        expect.assertions(5);

        const ruleset = [ "asdf" ]; // defined at the top of this file
        const ft = new FileType({
            name: "test",
            ruleset,
            project
        });
        expect(ft).toBeTruthy();

        const rules = ft.getRules();

        expect(Array.isArray(rules)).toBeTruthy();
        expect(rules.length).toBe(2);
        expect(typeof(rules[0])).toBe('object');
        expect(typeof(rules[1])).toBe('object');
    });

    test("FileTypeGetRuleSetNoRulesetsAvailable", () => {
        expect.assertions(3);

        const ft = new FileType({
            name: "test",
            project
        });
        expect(ft).toBeTruthy();

        const rules = ft.getRules();

        expect(Array.isArray(rules)).toBeTruthy();
        expect(rules.length).toBe(0);
    });

    test("FileType contains particular rule", () => {
        expect.assertions(4);

        const ruleset = [ "generic" ];
        const ft = new FileType({
            name: "test",
            ruleset,
            project
        });
        expect(ft).toBeTruthy();

        const rules = ft.getRules();

        expect(Array.isArray(rules)).toBeTruthy();
        expect(rules.length).toBe(20);

        expect(rules.find(rule => rule.getName() === "resource-state-checker")).toBeTruthy();
    });

    test("FileType latter ruleset removes a rule", () => {
        expect.assertions(4);

        const ruleset = [
            "generic",
            "no-state-checker"  // defined at the top of this file
        ];
        const ft = new FileType({
            name: "test",
            ruleset,
            project
        });
        expect(ft).toBeTruthy();

        const rules = ft.getRules();

        expect(Array.isArray(rules)).toBeTruthy();
        expect(rules.length).toBe(19);

        expect(rules.find(rule => rule.getName() === "resource-state-checker")).toBeFalsy();
    });

});

