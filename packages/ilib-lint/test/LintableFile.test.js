/*
 * LintableFile.test.js - test the source file class
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

import LintableFile from '../src/LintableFile.js';
import Project from '../src/Project.js';
import PluginManager from '../src/PluginManager.js';

const config = {
    "name": "test",
    "locales": [
        "en-US",
        "de-DE",
        "ja-JP",
        "ko-KR"
    ],
    "paths": {
        "**/*.json": {
            "locales": [
                "en-US",
                "de-DE",
                "ja-JP"
            ]
        },
        "**/*.xliff": {
            "rules": {
                "resource-icu-plurals": true,
                "resource-quote-style": true,
                "resource-url-match": true,
                "resource-named-params": "localeOnly"
            }
        }
    }
};

const config2 = {
    "name": "test2",
    "locales": [
        "en-US",
        "de-DE",
        "ja-JP",
        "ko-KR"
    ],
    "plugins": [
        "plugin-test"
    ],
    "excludes": [
        "node_modules/**",
        ".git/**",
        "docs/**"
    ],
    "rulesets": {
        "test": {
            "resource-icu-plurals": true,
            "resource-quote-style": true,
            "resource-url-match": true,
            "resource-named-params": "localeOnly"
        }
    },
    "filetypes": {
        "json-modified": {
            "parsers": [ "parser-xyz" ],
            "ruleset": [ "test" ]
        }
    },
    "paths": {
        // it has an odd filename extension, so we have to explicitly name the
        // parser above as the one from our plugin-test
        "**/*.pdq": "json-modified"
    }
};

const project = new Project(".", {
    pluginManager: new PluginManager()
}, config);

const project2 = new Project(".", {
    pluginManager: new PluginManager()
}, config2);

describe("testLintableFile", () => {
    beforeAll(() => {
        return project.init().then(() => {
            return project2.init();
        });
    });

    test("LintableFile", () => {
        expect.assertions(2);

        const filetype = project.getFileTypeForPath("test/testfiles/test.xliff");
        const lf = new LintableFile("a", { filetype }, project);
        expect(lf).toBeTruthy();
        expect(lf.getFilePath()).toBe("a");
    });

    test("LintableFileMissingParams", () => {
        expect.assertions(1);

        expect(() => {
            new LintableFile();
        }).toThrow();
    });

    test("LintableFileBadParams", () => {
        expect.assertions(1);

        expect(() => {
            new LintableFile("", {}, {});
        }).toThrow();
    });

    test("LintableFileWithSettings", () => {
        expect.assertions(2);

        const filetype = project.getFileTypeForPath("test/testfiles/test.xliff");
        const lf = new LintableFile("a", {
            settings: {
                template: "x"
            },
            filetype
        }, project);
        expect(lf).toBeTruthy();
        expect(lf.getFilePath()).toBe("a");
    });

    test("LintableFileGetLocaleFromPath", () => {
        expect.assertions(2);

        const filetype = project.getFileTypeForPath("src/filemanager/xrs/messages_de_DE.properties");
        const lf = new LintableFile("src/filemanager/xrs/messages_de_DE.properties", {
            settings: {
                template: "[dir]/messages_[localeUnder].properties"
            },
            filetype
        }, project);
        expect(lf).toBeTruthy();
        expect(lf.getLocaleFromPath()).toBe("de-DE");
    });

    test("LintableFileGetLocaleFromPathNone", () => {
        expect.assertions(2);

        const filetype = project.getFileTypeForPath("src/filemanager/xrs/Excludes.java");
        const lf = new LintableFile("src/filemanager/xrs/Excludes.java", {
            settings: {
                template: "[dir]/messages_[localeUnder].properties"
            },
            filetype
        }, project);
        expect(lf).toBeTruthy();
        expect(lf.getLocaleFromPath()).toBe("");
    });

    test("LintableFileGetLocaleFromPathNoTemplate", () => {
        expect.assertions(2);

        const filetype = project.getFileTypeForPath("src/filemanager/xrs/messages_de_DE.properties");
        const lf = new LintableFile("src/filemanager/xrs/messages_de_DE.properties", {
            settings: {
            },
            filetype
        }, project);
        expect(lf).toBeTruthy();
        expect(lf.getLocaleFromPath()).toBe("");
    });

    test("LintableFileParse", () => {
        expect.assertions(4);

        const filetype = project.getFileTypeForPath("test/testfiles/xliff/test.xliff");
        const lf = new LintableFile("test/testfiles/xliff/test.xliff", {
            settings: {
            },
            filetype
        }, project);
        expect(lf).toBeTruthy();
        lf.findIssues("de-DE");
        const ir = lf.getIRs()[0];
        const resources = ir.getRepresentation();
        expect(resources).toBeTruthy();
        expect(Array.isArray(resources)).toBeTruthy();
        expect(resources.length).toBe(1);
    });

    test("LintableFileParseRightContents", () => {
        expect.assertions(9);

        const filetype = project.getFileTypeForPath("test/testfiles/xliff/test.xliff");
        const lf = new LintableFile("test/testfiles/xliff/test.xliff", {
            settings: {
            },
            filetype
        }, project);
        expect(lf).toBeTruthy();
        lf.findIssues("de-DE");
        const ir = lf.getIRs();
        expect(ir).toBeTruthy();
        expect(Array.isArray(ir)).toBeTruthy();
        expect(ir.length).toBe(1);
        expect(ir[0].getType()).toBe("resource");
        const resources = ir[0].getRepresentation();
        expect(resources.length).toBe(1);
        expect(resources[0].source).toBe("Asdf asdf");
        expect(resources[0].target).toBe("foobarfoo");
        expect(resources[0].reskey).toBe("foobar");
    });

    test("LintableFileParseRightTypeResource", () => {
        expect.assertions(5);

        const filetype = project.getFileTypeForPath("test/testfiles/xliff/test.xliff");
        const lf = new LintableFile("test/testfiles/xliff/test.xliff", {
            settings: {
            },
            filetype
        }, project);
        expect(lf).toBeTruthy();
        lf.findIssues("de-DE");
        const ir = lf.getIRs();
        expect(ir).toBeTruthy();
        expect(Array.isArray(ir)).toBeTruthy();
        expect(ir.length).toBe(1);
        expect(ir[0].getType()).toBe("resource");
    });

    test("LintableFileParseNonResourceFile", () => {
        expect.assertions(7);

        const filetype = project.getFileTypeForPath("test/ilib-mock/index.js");
        const lf = new LintableFile("test/ilib-mock/index.js", {
            filetype,
            settings: {
            }
        }, project);
        expect(lf).toBeTruthy();
        lf.findIssues("de-DE");
        const ir = lf.getIRs();
        expect(ir).toBeTruthy();
        expect(Array.isArray(ir)).toBeTruthy();
        expect(ir.length).toBe(1);
        expect(ir[0].getType()).toBe("string");
        const source = ir[0].getRepresentation();
        expect(source).toBeTruthy();
        expect(source.length).toBe(117); // how many chars in this source file?
    });

    test("LintableFile parse an oddly-named file using a named parser instead of the default one", () => {
        expect.assertions(7);

        const filetype = project2.getFileTypeForPath("test/testfiles/strings.pdq");
        const lf = new LintableFile("test/testfiles/strings.pdq", {
            filetype,
            settings: {
            }
        }, project2);
        expect(lf).toBeTruthy();
        lf.findIssues("de-DE");
        const ir = lf.getIRs();
        expect(ir).toBeTruthy();
        expect(Array.isArray(ir)).toBeTruthy();
        expect(ir.length).toBe(1);
        expect(ir[0].getType()).toBe("resource"); // from the xyz parser ilib-lint-plugin-test
        const source = ir[0].getRepresentation();
        expect(source).toBeTruthy();
        expect(source.length).toBe(3); // how many resources in this resource file?
    });

    test("LintableFile parse an oddly-named file using the default parser not using a named parser", () => {
        expect.assertions(7);

        const filetype = project.getFileTypeForPath("test/testfiles/strings.pdq");
        const lf = new LintableFile("test/testfiles/strings.pdq", {
            filetype,
            settings: {
            }
        }, project);
        expect(lf).toBeTruthy();
        lf.findIssues("de-DE");
        const ir = lf.getIRs();
        expect(ir).toBeTruthy();
        expect(Array.isArray(ir)).toBeTruthy();
        expect(ir.length).toBe(1);
        // can't determine the file type, so it just parses it as one big string
        expect(ir[0].getType()).toBe("string");
        const source = ir[0].getRepresentation();
        expect(source).toBeTruthy();
        expect(source.length).toBe(78); // how many chars in this source file?
    });
});
