/*
 * Project.test.js - test the project object
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

import Project from '../src/Project.js';
import PluginManager from '../src/PluginManager.js';

const pluginManager = new PluginManager();

const genericConfig = {
    // the name is reaquired and should be unique amongst all your projects
    "name": "tester",
    // this is the global set of locales that applies unless something else overrides it
    "locales": [
        "en-US",
        "de-DE",
        "ja-JP",
        "ko-KR"
    ],
    // list of plugins to load
    "plugins": [
        "plugin-test"
    ],
    // default micromatch expressions to exclude from recursive dir searches
    "excludes": [
        "node_modules/**",
        ".git/**",
        "docs/**"
    ],
    // declarative definitions of new rules
    "rules": [
        // test that named parameters like {param} appear in both the source and target
        {
            "type": "resource-matcher",
            "name": "resource-named-params",
            "description": "Ensure that named parameters that appear in the source string are also used in the translated string",
            "note": "The named parameter '{matchString}' from the source string does not appear in the target string",
            "regexps": [ "\\{\\w+\\}" ]
        },
        {
            "type": "source-checker",
            "name": "source-no-normalize",
            "severity": "warning",
            "description": "Ensure that the normalize function is not called.",
            "note": "Do not call the normalize function, as it is deprecated.",
            "regexps": [ "\\.normalize\\s*\\(" ]
        }
    ],
    "formatters": [
        {
            "name": "minimal",
            "description": "A minimalistic formatter that only outputs the path and the highlight",
            "template": "{pathName}\n{highlight}\n",
            "highlightStart": ">>",
            "highlightEnd": "<<"
        }
    ],
    // named rule sets to be used with the file types
    "rulesets": {
        "react-rules": {
            // this is the declarative rule defined above
            "resource-named-params": true,
            // the "localeOnly" is an option that the quote matcher supports
            // so this both includes the rule in the rule set and instantiates
            // it with the "localeOnly" option
            "resource-quote-matcher": "localeOnly"
        },
        "js-rules": {
            "source-no-normalize": true
        }
    },
    // defines common settings for a particular types of file
    "filetypes": {
        "json": {
            // override the general locales
            "locales": [
                "en-US",
                "de-DE",
                "ja-JP"
            ],
            "template": "[dir]/[localeDir]/[basename].json"
        },
        "javascript": {
            "type": "source",
            "ruleset": [
                "js-rules"
            ]
        },
        "jsx": {
            "ruleset": [
                "react-rules"
            ]
        }
    },
    // this maps micromatch path expressions to a file type definition
    "paths": {
        // use the file type defined above
        "src/**/*.json": "json",
        "{src,test}/**/*.js": "javascript",
        "src/**/*.jsx": "jsx",
        // define a file type on the fly
        "**/*.xliff": {
            "ruleset": {
                "formatjs-plural-syntax": true,
                "formatjs-plural-categories": true,
                "formatjs-match-substitution-params": true,
                "match-quote-style": "localeOnly"
            }
        }
    }
};

const genericConfig2 = {
    // the name is reaquired and should be unique amongst all your projects
    "name": "tester2",
    "sourceLocale": "en-KR",
};

describe("testProject", () => {
    test("ProjectConstructorEmpty", () => {
        expect.assertions(1);

        const project = new Project("x", {pluginManager, opt: {}}, {});
        expect(project).toBeTruthy();
    });

    test("ProjectConstructorInsufficientParamsRoot", () => {
        expect.assertions(1);

        expect(() => {
            const project = new Project(undefined, {pluginManager, opt: {}}, {});
        }).toThrow();
    });

    test("ProjectConstructorInsufficientParamsOptions", () => {
        expect.assertions(1);

        expect(() => {
            const project = new Project("x", undefined, {});
        }).toThrow();
    });

    test("ProjectConstructorInsufficientParamsConfig", () => {
        expect.assertions(1);

        expect(() => {
            const project = new Project("x", {pluginManager, opt: {}});
        }).toThrow();
    });

    test("ProjectGetRoot", () => {
        expect.assertions(2);

        const project = new Project("x", {pluginManager, opt: {}}, {});
        expect(project).toBeTruthy();

        expect(project.getRoot()).toBe("x");
    });

    test("ProjectGetPluginManager", () => {
        expect.assertions(2);

        const project = new Project("x", {pluginManager, opt: {}}, {});
        expect(project).toBeTruthy();

        expect(project.getPluginManager()).toBe(pluginManager);
    });

    test("ProjectGetRuleManager", () => {
        expect.assertions(2);

        const project = new Project("x", {pluginManager, opt: {}}, {});
        expect(project).toBeTruthy();

        expect(project.getRuleManager()).toBe(pluginManager.getRuleManager());
    });

    test("ProjectGetParserManager", () => {
        expect.assertions(2);

        const project = new Project("x", {pluginManager, opt: {}}, {});
        expect(project).toBeTruthy();

        expect(project.getParserManager()).toBe(pluginManager.getParserManager());
    });

    test("ProjectGetExcludes", () => {
        expect.assertions(2);

        const project = new Project("x", {pluginManager, opt: {}}, genericConfig);
        expect(project).toBeTruthy();

        expect(project.getExcludes()).toBe(genericConfig.excludes);
    });

    test("ProjectGetOptions", () => {
        expect.assertions(2);

        const options = {
            "test": "x",
            "test2": "y",
            pluginManager
        };
        const project = new Project("x", options, genericConfig);
        expect(project).toBeTruthy();

        expect(project.getOptions()).toBe(options);
    });

    test("ProjectGetLocalesOptions", () => {
        expect.assertions(2);

        const options = {
            "locales": ["en-US", "ko-KR"],
            pluginManager
        };
        const project = new Project("x", options, genericConfig);
        expect(project).toBeTruthy();

        expect(project.getLocales()).toBe(options.locales);
    });

    test("ProjectGetLocalesFallbackToConfig", () => {
        expect.assertions(2);

        const options = {
            pluginManager
        };
        const project = new Project("x", options, genericConfig);
        expect(project).toBeTruthy();

        expect(project.getLocales()).toBe(genericConfig.locales);
    });

    test("ProjectGetSourceLocaleFallbackToConfig", () => {
        expect.assertions(2);

        const options = {
            pluginManager
        };
        const project = new Project("x", options, genericConfig);
        expect(project).toBeTruthy();

        expect(project.getSourceLocale()).toBe("en-US");
    });

    test("ProjectGetSourceLocaleFallbackToConfig2", () => {
        expect.assertions(2);

        const options = {
            pluginManager
        };
        const project = new Project("x", options, genericConfig2);
        expect(project).toBeTruthy();

        expect(project.getSourceLocale()).toBe("en-KR");
    });

    test("ProjectGetFileTypeForPath1", async () => {
        expect.assertions(2);

        const project = new Project("x", {pluginManager, opt: {}}, genericConfig);
        expect(project).toBeTruthy();

        // must initialize the project before the filetypes are available
        const result = await project.init();
        const ft = project.getFileTypeForPath("src/foo/ja/asdf.json");
        expect(ft.getName()).toBe("json");
    });

    test("ProjectGetFileTypeForPath2", async () => {
        expect.assertions(2);

        const project = new Project("x", {pluginManager, opt: {}}, genericConfig);
        expect(project).toBeTruthy();

        // must initialize the project before the filetypes are available
        const result = await project.init();
        const ft = project.getFileTypeForPath("src/foo/asdf.js");
        expect(ft.getName()).toBe("javascript");
    });

    test("ProjectGetFileTypeForPathUnknown", async () => {
        expect.assertions(2);

        const project = new Project("x", {pluginManager, opt: {}}, genericConfig);
        expect(project).toBeTruthy();

        // must initialize the project before the filetypes are available
        const result = await project.init();
        const ft = project.getFileTypeForPath("notsrc/foo/ja/asdf.json");
        expect(ft.getName()).toBe("unknown");
    });

    test("ProjectGetFileTypeForPathNormalizePath", async () => {
        expect.assertions(2);

        const project = new Project("x", {pluginManager, opt: {}}, genericConfig);
        expect(project).toBeTruthy();

        // must initialize the project before the filetypes are available
        const result = await project.init();
        const ft = project.getFileTypeForPath("./src/foo/ja/asdf.json");
        expect(ft.getName()).toBe("json");
    });

    test("ProjectGetFileTypeForPathAnonymousFileType", async () => {
        expect.assertions(2);

        const project = new Project("x", {pluginManager, opt: {}}, genericConfig);
        expect(project).toBeTruthy();

        // must initialize the project before the filetypes are available
        const result = await project.init();
        const ft = project.getFileTypeForPath("i18n/it-IT.xliff");
        // since it is not a pre-defined xliff with a real name, it uses
        // the mapping's glob as the name
        expect(ft.getName()).toBe("**/*.xliff");
    });

    test("ProjectInit", () => {
        expect.assertions(5);

        const project = new Project("x", {pluginManager, opt: {}}, genericConfig);
        expect(project).toBeTruthy();

        const pluginMgr = project.getPluginManager();
        expect(pluginMgr).toBeTruthy();

        return project.init().then((result) => {
            // verify that the init indeed loaded the test plugin
            const fmtmgr = pluginMgr.getFormatterManager();
            const fmtr = fmtmgr.get("formatter-test");
            expect(fmtr).toBeTruthy();

            const parserMgr = pluginMgr.getParserManager();
            const prsr = parserMgr.get("parser-xyz");
            expect(prsr).toBeTruthy();

            const ruleMgr = pluginMgr.getRuleManager();
            const rule = ruleMgr.get("resource-test");
            expect(rule).toBeTruthy();
        });
    });

    test("ProjectWalk", async () => {
        expect.assertions(6);

        const project = new Project("x", {pluginManager, opt: {}}, genericConfig);
        expect(project).toBeTruthy();

        const pluginMgr = project.getPluginManager();
        expect(pluginMgr).toBeTruthy();

        const result = await project.init();
        // verify that the init indeed loaded the test plugin
        expect(result).toBeTruthy();

        const files = await project.walk("./test/testfiles/js");
        expect(files).toBeTruthy();
        expect(files.length).toBe(1);
        expect(files[0].getFilePath()).toBe("test/testfiles/js/Path.js");
    });

    test("ProjectFindIssues", async () => {
        expect.assertions(20);

        const project = new Project("x", {pluginManager, opt: {}}, genericConfig);
        expect(project).toBeTruthy();

        const pluginMgr = project.getPluginManager();
        expect(pluginMgr).toBeTruthy();

        const result = await project.init();
        // verify that the init indeed loaded the test plugin
        expect(result).toBeTruthy();

        await project.walk("./test/testfiles/js");
        const results = project.findIssues(genericConfig.locales);
        expect(results).toBeTruthy();
        expect(results.length).toBe(3);

        expect(results[0].severity).toBe("warning");
        expect(results[0].description).toBe("Do not call the normalize function, as it is deprecated.");
        expect(results[0].highlight).toBe('    pathname = Path<e0>.normalize(</e0>pathname);');
        expect(results[0].pathName).toBe("test/testfiles/js/Path.js");
        expect(results[0].lineNumber).toBe(51);

        expect(results[1].severity).toBe("warning");
        expect(results[1].description).toBe("Do not call the normalize function, as it is deprecated.");
        expect(results[1].highlight).toBe('    return (pathname === ".") ? ".." : Path<e0>.normalize(</e0>pathname + "/..");');
        expect(results[1].pathName).toBe("test/testfiles/js/Path.js");
        expect(results[1].lineNumber).toBe(52);

        expect(results[2].severity).toBe("warning");
        expect(results[2].description).toBe("Do not call the normalize function, as it is deprecated.");
        expect(results[2].highlight).toBe('    return Path<e0>.normalize(</e0>arr.join("/"));');
        expect(results[2].pathName).toBe("test/testfiles/js/Path.js");
        expect(results[2].lineNumber).toBe(92);
    });

    test("Recursively get all source files in a whole project", async () => {
        expect.assertions(5);

        const project = new Project("test/testproject", {pluginManager, opt: {}}, genericConfig);
        expect(project).toBeTruthy();

        const pluginMgr = project.getPluginManager();
        expect(pluginMgr).toBeTruthy();

        await project.init();
        // verify that the init indeed loaded the test plugin
        const parserMgr = pluginMgr.getParserManager();
        const prsr = parserMgr.get("parser-xyz");
        expect(prsr).toBeTruthy();

        await project.scan(["./test/testproject"]);
        const files = project.get();

        expect(files).toBeTruthy();
        expect(files.map(file => file.getFilePath()).sort()).toStrictEqual([
            "test/testproject/x/empty.xyz",
            "test/testproject/x/test.xyz",
            "test/testproject/x/test_ru_RU.xyz"
        ]);
    });

    test("Verify that the project continues if the parser throws up", async () => {
        expect.assertions(7);

        const project = new Project("test/testproject", {pluginManager, opt: {}}, genericConfig);
        expect(project).toBeTruthy();

        const pluginMgr = project.getPluginManager();
        expect(pluginMgr).toBeTruthy();

        await project.init();
        // verify that the init indeed loaded the test plugin
        const parserMgr = pluginMgr.getParserManager();
        const prsr = parserMgr.get("parser-xyz");
        expect(prsr).toBeTruthy();

        // verify that the parser throws when there is empty data
        expect(() => {
            prsr.parseData();
        }).toThrow();

        await project.scan(["./test/testproject"]);

        // make sure the scan picked up the empty file which causes the parser to barf
        const files = project.get();
        expect(files).toBeTruthy();
        expect(files.filter(file => file.getFilePath() === "test/testproject/x/empty.xyz")).toBeTruthy();

        // should not throw
        const issues = project.findIssues(["en-US"]);
        expect(issues).toBeTruthy();
    });
});

