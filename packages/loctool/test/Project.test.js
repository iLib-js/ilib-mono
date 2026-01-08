/*
 * Project.test.js - test Project class
 *
 * Copyright © 2020-2021, 2023-2025 JEDLSoft
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

var fs = require('fs');

var ProjectFactory = require("../lib/ProjectFactory.js");
var Project = require("../lib/Project.js");

function rmrf(path) {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}

describe("project", function() {
    afterEach(function() {
        [
            "./test/testfiles/loctest-extracted.xliff",
            "./test/testfiles/loctest-new-es-US.xliff",
            "./test/testfiles/loctest-new-ja-JP.xliff",
            "./test/testfiles/loctest-new-zh-Hans-CN.xliff",
            "./test/testfiles/de-DE/md/test1.md",
            "./test/testfiles/en-GB/md/test1.md",
            "./test/testfiles/es-US/md/test1.md",
            "./test/testfiles/ja-JP/md/test1.md",
            "./test/testfiles/zh-Hans-CN/md/test1.md",
            "./test/testfiles/loctest-new-en-GB.pot",
            "./test/testfiles/loctest-new-en-GB.xliff",
            "./test/testfiles/project2/loctest-extracted.xliff",
            "./test/testfiles/project2/loctest-new-es-US.xliff",
            "./test/testfiles/project2/loctest-new-ja-JP.xliff",
            "./test/testfiles/project2/loctest-new-ru-RU.xliff",
            "./test/testfiles/project2/loctest-new-en-GB.xliff",
            "./test/testfiles/project2/loctest.xliff",
            "./test/testfiles/project2/res/values-en/arrays.xml",
            "./test/testfiles/project2/res/values-en/plurals.xml",
            "./test/testfiles/project2/res/values-es/arrays.xml",
            "./test/testfiles/project2/res/values-es/plurals.xml",
            "./test/testfiles/project2/res/values-ja/arrays.xml",
            "./test/testfiles/project2/res/values-ja/plurals.xml",
            "./test/testfiles/project2/res/values-ps-rDO/arrays.xml",
            "./test/testfiles/project2/res/values-ps-rDO/plurals.xml",
            "./test/testfiles/project2/res/values-ru/arrays.xml",
            "./test/testfiles/project2/res/values-ru/plurals.xml",
            "./test/testfiles/translations/loctest.xliff",
            "./test/testfiles/project3/loctest-extracted.xliff",
            "./test/testfiles/project3/loctest-new-es-US.xliff",
            "./test/testfiles/project3/loctest-new-ja-JP.xliff",
            "./test/testfiles/project3/loctest-new-zh-Hans-CN.xliff",
            "./test/testfiles/project3/es-US.mock",
            "./test/testfiles/project3/ja-JP.mock",
            "./test/testfiles/project3/zh-Hans-CN.mock",
            "./test/testfiles/loctest-extracted.pot",
            "./test/testfiles/loctest-new-es-US.pot",
            "./test/testfiles/loctest-new-ja-JP.pot",
            "./test/testfiles/loctest-new-zh-Hans-CN.pot",
            "./test/testfiles/project3/loctest-extracted.pot",
            "./test/testfiles/project3/loctest-new-es-US.pot",
            "./test/testfiles/project3/loctest-new-ja-JP.pot",
            "./test/testfiles/project3/loctest-new-zh-Hans-CN.pot"
        ].forEach(rmrf);
    });

    test("ProjectCreationAllEmpty", function() {
        expect.assertions(1);
        var project = ProjectFactory('', {});
        expect(project).toBeUndefined();
    });

    test("ProjectGeneratesExtractedXliff", function() {
        expect.assertions(2);

        // set up first
        expect(!fs.existsSync("./test/testfiles/loctest-extracted.xliff")).toBeTruthy();
        var project = ProjectFactory('./test/testfiles', {'locales': ['ja-JP']});
        project.addPath("md/test1.md");
        project.init(function() {
            project.extract(function() {
                project.generatePseudo();
                project.write(function() {
                    project.save(function() {
                        project.close(function() {
                            expect(fs.existsSync("./test/testfiles/loctest-extracted.xliff")).toBeTruthy();
                        });
                    });
                });
            });
        });
    });

    test("Project generates extracted PO file", function() {
        expect.assertions(2);

        // set up first
        expect(!fs.existsSync("./test/testfiles/loctest-extracted.pot")).toBeTruthy();
        var project = ProjectFactory('./test/testfiles', {
            'locales': ['ja-JP'],
            'intermediateFormat': 'po'
        });
        project.addPath("md/test1.md");
        project.init(function() {
            project.extract(function() {
                project.generatePseudo();
                project.write(function() {
                    project.save(function() {
                        project.close(function() {
                            expect(fs.existsSync("./test/testfiles/loctest-extracted.pot")).toBeTruthy();
                        });
                    });
                });
            });
        });
    });

    test("ProjectGeneratesNewStringsXliffs", function() {
        expect.assertions(6);
        // set up first
        expect(!fs.existsSync("./test/testfiles/loctest-new-es-US.xliff")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/loctest-new-ja-JP.xliff")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/loctest-new-zh-Hans-CN.xliff")).toBeTruthy();
        var project = ProjectFactory('./test/testfiles', {
            'translationsDir': "xliffs",
            'locales': ['ja-JP']
        });
        project.addPath("md/test1.md");
        project.init(function() {
            project.extract(function() {
                project.generatePseudo();
                project.write(function() {
                    project.save(function() {
                        project.close(function() {
                            expect(fs.existsSync("./test/testfiles/loctest-new-es-US.xliff")).toBeTruthy();
                            expect(fs.existsSync("./test/testfiles/loctest-new-ja-JP.xliff")).toBeTruthy();
                            expect(fs.existsSync("./test/testfiles/loctest-new-zh-Hans-CN.xliff")).toBeTruthy();
                        });
                    });
                });
            });
        });
    });

    test("Project generates new strings PO files", function() {
        expect.assertions(6);
        // set up first
        expect(!fs.existsSync("./test/testfiles/loctest-new-es-US.po")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/loctest-new-ja-JP.po")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/loctest-new-zh-Hans-CN.pot")).toBeTruthy();
        var project = ProjectFactory('./test/testfiles', {
            'translationsDir': "xliffs",
            'locales': ['ja-JP'],
            'intermediateFormat': 'po'
        });
        project.addPath("md/test1.md");
        project.init(function() {
            project.extract(function() {
                project.generatePseudo();
                project.write(function() {
                    project.save(function() {
                        project.close(function() {
                            expect(fs.existsSync("./test/testfiles/loctest-new-es-US.pot")).toBeTruthy();
                            expect(fs.existsSync("./test/testfiles/loctest-new-ja-JP.pot")).toBeTruthy();
                            expect(fs.existsSync("./test/testfiles/loctest-new-zh-Hans-CN.pot")).toBeTruthy();
                        });
                    });
                });
            });
        });
    });

    test("ProjectLocalizeOnlyGeneratesNoXliffs", function() {
        expect.assertions(8);
        // set up first
        expect(!fs.existsSync("./test/testfiles/loctest-extracted.xliff")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/loctest-new-es-US.xliff")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/loctest-new-ja-JP.xliff")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/loctest-new-zh-Hans-CN.xliff")).toBeTruthy();
        var project = ProjectFactory('./test/testfiles', {'localizeOnly': true, 'locales': ['ja-JP']});
        project.addPath("md/test1.md");
        project.init(function() {
            project.extract(function() {
                project.generatePseudo();
                project.write(function() {
                    project.save(function() {
                        project.close(function() {
                            expect(!fs.existsSync("./test/testfiles/loctest-extracted.xliff")).toBeTruthy();
                            expect(!fs.existsSync("./test/testfiles/loctest-new-es-US.xliff")).toBeTruthy();
                            expect(!fs.existsSync("./test/testfiles/loctest-new-ja-JP.xliff")).toBeTruthy();
                            expect(!fs.existsSync("./test/testfiles/loctest-new-zh-Hans-CN.xliff")).toBeTruthy();
                        });
                    });
                });
            });
        });
    });

    test("Project localize an md file, right files exist", function() {
        expect.assertions(12);

        // set up first
        expect(!fs.existsSync("./test/testfiles/loctest-new-es-US.xliff")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/loctest-new-ja-JP.xliff")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/loctest-new-zh-Hans-CN.xliff")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/es-US/md/test1.md")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/ja-JP/md/test1.md")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/zh-Hans-CN/md/test1.md")).toBeTruthy();
        var project = ProjectFactory('./test/testfiles', {
            translationsDir: "translations",
            locales: ['es-US', 'ja-JP', 'zh-Hans-CN']
        });
        project.addPath("md/test1.md");
        project.init(function() {
            project.extract(function() {
                project.write(function() {
                    project.save(function() {
                        project.close(function() {
                            // should have no new strings
                            expect(!fs.existsSync("./test/testfiles/loctest-new-es-US.xliff")).toBeTruthy();
                            expect(!fs.existsSync("./test/testfiles/loctest-new-ja-JP.xliff")).toBeTruthy();
                            expect(!fs.existsSync("./test/testfiles/loctest-new-zh-Hans-CN.xliff")).toBeTruthy();

                            expect(fs.existsSync("./test/testfiles/es-US/md/test1.md")).toBeTruthy();
                            expect(fs.existsSync("./test/testfiles/ja-JP/md/test1.md")).toBeTruthy();
                            expect(fs.existsSync("./test/testfiles/zh-Hans-CN/md/test1.md")).toBeTruthy();
                        });
                    });
                });
            });
        });
    });

    test("Project localize a mock file with plurals using no plural conversions", function() {
        expect.assertions(12);
        // set up first
        expect(!fs.existsSync("./test/testfiles/project3/loctest-new-es-US.xliff")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project3/loctest-new-ja-JP.xliff")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project3/loctest-new-zh-Hans-CN.xliff")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project3/es-US.mock")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project3/ja-JP.mock")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project3/zh-Hans-CN.mock")).toBeTruthy();

        var project = ProjectFactory('./test/testfiles/project3', {
            translationsDir: "translations2",
            locales: ['es-US', 'ja-JP', 'zh-Hans-CN']
        });
        project.addPath("en-US.mock");
        project.init(function() {
            project.extract(function() {
                project.write(function() {
                    project.save(function() {
                        project.close(function() {
                            // should have all new strings
                            expect(fs.existsSync("./test/testfiles/project3/loctest-new-es-US.xliff")).toBeTruthy();
                            expect(fs.existsSync("./test/testfiles/project3/loctest-new-ja-JP.xliff")).toBeTruthy();
                            expect(fs.existsSync("./test/testfiles/project3/loctest-new-zh-Hans-CN.xliff")).toBeTruthy();

                            expect(fs.existsSync("./test/testfiles/project3/es-US.mock")).toBeTruthy();
                            expect(fs.existsSync("./test/testfiles/project3/ja-JP.mock")).toBeTruthy();
                            expect(fs.existsSync("./test/testfiles/project3/zh-Hans-CN.mock")).toBeTruthy();
                        });
                    });
                });
            });
        });
    });

    test("Project localize a mock file with plurals using no plural conversions, right content", function() {
        expect.assertions(18);
        // set up first
        expect(!fs.existsSync("./test/testfiles/project3/loctest-new-es-US.xliff")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project3/loctest-new-ja-JP.xliff")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project3/loctest-new-zh-Hans-CN.xliff")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project3/es-US.mock")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project3/ja-JP.mock")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project3/zh-Hans-CN.mock")).toBeTruthy();

        var project = ProjectFactory('./test/testfiles/project3', {
            translationsDir: "translations1",
            locales: ['es-US', 'ja-JP', 'zh-Hans-CN']
        });
        project.addPath("en-US.mock");
        project.init(function() {
            project.extract(function() {
                project.write(function() {
                    project.save(function() {
                        project.close(function() {
                            var filename = "./test/testfiles/project3/loctest-new-es-US.xliff";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            var actual = fs.readFileSync(filename, "utf8");
                            var expected =
                                '<?xml version="1.0" encoding="utf-8"?>\n' +
                                '<xliff version="1.2">\n' +
                                '  <file original="en-US.mock" source-language="en-US" target-language="es-US" product-name="loctest">\n' +
                                '    <body>\n' +
                                '      <trans-unit id="1" resname="plu1" restype="plural" datatype="mock" extype="one">\n' +
                                '        <source>singular</source>\n' +
                                '        <target state="new">singular</target>\n' +
                                '        <note>{"pluralForm":"one","pluralFormOther":"plu1"}</note>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="2" resname="plu1" restype="plural" datatype="mock" extype="many">\n' +
                                '        <source>plural</source>\n' +
                                '        <target state="new">plural</target>\n' +
                                '        <note>{"pluralForm":"many","pluralFormOther":"plu1"}</note>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="3" resname="plu1" restype="plural" datatype="mock" extype="other">\n' +
                                '        <source>plural</source>\n' +
                                '        <target state="new">plural</target>\n' +
                                '        <note>{"pluralForm":"other","pluralFormOther":"plu1"}</note>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="4" resname="plu2" restype="plural" datatype="mock" extype="one">\n' +
                                '        <source>There is {n} item.</source>\n' +
                                '        <target state="new">There is {n} item.</target>\n' +
                                '        <note>{"pluralForm":"one","pluralFormOther":"plu2"}</note>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="5" resname="plu2" restype="plural" datatype="mock" extype="many">\n' +
                                '        <source>There are {n} items.</source>\n' +
                                '        <target state="new">There are {n} items.</target>\n' +
                                '        <note>{"pluralForm":"many","pluralFormOther":"plu2"}</note>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="6" resname="plu2" restype="plural" datatype="mock" extype="other">\n' +
                                '        <source>There are {n} items.</source>\n' +
                                '        <target state="new">There are {n} items.</target>\n' +
                                '        <note>{"pluralForm":"other","pluralFormOther":"plu2"}</note>\n' +
                                '      </trans-unit>\n' +
                                '    </body>\n' +
                                '  </file>\n' +
                                '</xliff>';
                            expect(actual).toBe(expected);

                            filename = "./test/testfiles/project3/loctest-new-ja-JP.xliff";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            var actual = fs.readFileSync(filename, "utf8");
                            var expected =
                                '<?xml version="1.0" encoding="utf-8"?>\n' +
                                '<xliff version="1.2">\n' +
                                '  <file original="en-US.mock" source-language="en-US" target-language="ja-JP" product-name="loctest">\n' +
                                '    <body>\n' +
                                '      <trans-unit id="1" resname="plu1" restype="plural" datatype="mock" extype="other">\n' +
                                '        <source>plural</source>\n' +
                                '        <target state="new">plural</target>\n' +
                                '        <note>{"pluralForm":"other","pluralFormOther":"plu1"}</note>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="2" resname="plu2" restype="plural" datatype="mock" extype="other">\n' +
                                '        <source>There are {n} items.</source>\n' +
                                '        <target state="new">There are {n} items.</target>\n' +
                                '        <note>{"pluralForm":"other","pluralFormOther":"plu2"}</note>\n' +
                                '      </trans-unit>\n' +
                                '    </body>\n' +
                                '  </file>\n' +
                                '</xliff>';
                            expect(actual).toBe(expected);

                            filename = "./test/testfiles/project3/loctest-new-zh-Hans-CN.xliff";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            var actual = fs.readFileSync(filename, "utf8");
                            var expected =
                                '<?xml version="1.0" encoding="utf-8"?>\n' +
                                '<xliff version="1.2">\n' +
                                '  <file original="en-US.mock" source-language="en-US" target-language="zh-Hans-CN" product-name="loctest">\n' +
                                '    <body>\n' +
                                '      <trans-unit id="1" resname="plu1" restype="plural" datatype="mock" extype="other">\n' +
                                '        <source>plural</source>\n' +
                                '        <target state="new">plural</target>\n' +
                                '        <note>{"pluralForm":"other","pluralFormOther":"plu1"}</note>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="2" resname="plu2" restype="plural" datatype="mock" extype="other">\n' +
                                '        <source>There are {n} items.</source>\n' +
                                '        <target state="new">There are {n} items.</target>\n' +
                                '        <note>{"pluralForm":"other","pluralFormOther":"plu2"}</note>\n' +
                                '      </trans-unit>\n' +
                                '    </body>\n' +
                                '  </file>\n' +
                                '</xliff>';
                            expect(actual).toBe(expected);

                            filename = "./test/testfiles/project3/es-US.mock";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            var actual = fs.readFileSync(filename, "utf8");
                            var expected =
                                '{\n' +
                                '    "arr1": [\n' +
                                '        "uno",\n' +
                                '        "dos",\n' +
                                '        "tres"\n' +
                                '    ],\n' +
                                '    "arr2": [\n' +
                                '        "quatro",\n' +
                                '        "cinco",\n' +
                                '        "seis"\n' +
                                '    ],\n' +
                                '    "foobar1": "Esta es una cadena de prueba",\n' +
                                '    "foobar2": "Esta es una segunda cadena de prueba",\n' +
                                '    "plu1": {\n' +
                                '        "one": "singular",\n' +
                                '        "other": "plural"\n' +
                                '    },\n' +
                                '    "plu2": {\n' +
                                '        "one": "There is {n} item.",\n' +
                                '        "other": "There are {n} items."\n' +
                                '    }\n' +
                                '}';
                            expect(actual).toBe(expected);

                            filename = "./test/testfiles/project3/ja-JP.mock";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            var actual = fs.readFileSync(filename, "utf8");
                            var expected =
                                '{\n' +
                                '    "arr1": [\n' +
                                '        "1",\n' +
                                '        "2",\n' +
                                '        "3"\n' +
                                '    ],\n' +
                                '    "arr2": [\n' +
                                '        "4",\n' +
                                '        "5",\n' +
                                '        "6"\n' +
                                '    ],\n' +
                                '    "foobar1": "これはテスト文字列です",\n' +
                                '    "foobar2": "これは 2 番目のテスト文字列です",\n' +
                                '    "plu1": {\n' +
                                '        "one": "singular",\n' +
                                '        "other": "plural"\n' +
                                '    },\n' +
                                '    "plu2": {\n' +
                                '        "one": "There is {n} item.",\n' +
                                '        "other": "There are {n} items."\n' +
                                '    }\n' +
                                '}';
                            expect(actual).toBe(expected);

                            filename = "./test/testfiles/project3/zh-Hans-CN.mock";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            var actual = fs.readFileSync(filename, "utf8");
                            var expected =
                                '{\n' +
                                '    "arr1": [\n' +
                                '        "一",\n' +
                                '        "二",\n' +
                                '        "三"\n' +
                                '    ],\n' +
                                '    "arr2": [\n' +
                                '        "四",\n' +
                                '        "五",\n' +
                                '        "六"\n' +
                                '    ],\n' +
                                '    "foobar1": "这是一个测试字符串",\n' +
                                '    "foobar2": "这是第二个测试字符串",\n' +
                                '    "plu1": {\n' +
                                '        "one": "singular",\n' +
                                '        "other": "plural"\n' +
                                '    },\n' +
                                '    "plu2": {\n' +
                                '        "one": "There is {n} item.",\n' +
                                '        "other": "There are {n} items."\n' +
                                '    }\n' +
                                '}';
                            expect(actual).toBe(expected);
                        });
                    });
                });
            });
        });
    });

    test("Project localize a mock file with plurals using no plural conversions, right content, using po files", function() {
        expect.assertions(18);
        // set up first
        expect(!fs.existsSync("./test/testfiles/project3/loctest-new-es-US.pot")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project3/loctest-new-ja-JP.pot")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project3/loctest-new-zh-Hans-CN.pot")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project3/es-US.mock")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project3/ja-JP.mock")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project3/zh-Hans-CN.mock")).toBeTruthy();

        var project = ProjectFactory('./test/testfiles/project3', {
            translationsDir: "translations2",
            locales: ['es-US', 'ja-JP', 'zh-Hans-CN'],
            intermediateFormat: 'po'
        });
        project.addPath("en-US.mock");
        project.init(function() {
            project.extract(function() {
                project.write(function() {
                    project.save(function() {
                        project.close(function() {
                            var filename = "./test/testfiles/project3/loctest-new-es-US.pot";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            var actual = fs.readFileSync(filename, "utf8");
                            var expected =
                                'msgid ""\n' +
                                'msgstr ""\n' +
                                '"#-#-#-#-#  test/testfiles/project3/loctest-new-es-US.pot  #-#-#-#-#\\n"\n' +
                                '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
                                '"Content-Transfer-Encoding: 8bit\\n"\n' +
                                '"Generated-By: loctool\\n"\n' +
                                '"Project-Id-Version: 1\\n"\n' +
                                '"Language: es-US\\n"\n' +
                                '"Plural-Forms: nplurals=2; plural=n != 1;\\n"\n' +
                                '"Project: loctest\\n"\n' +
                                '\n' +
                                '#: en-US.mock\n' +
                                '#d mock\n' +
                                '#k plu1\n' +
                                'msgid "singular"\n' +
                                'msgid_plural "plural"\n' +
                                'msgstr[0] ""\n' +
                                'msgstr[1] ""\n';
                            expect(actual).toBe(expected);

                            filename = "./test/testfiles/project3/loctest-new-ja-JP.pot";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            var actual = fs.readFileSync(filename, "utf8");
                            var expected =
                                'msgid ""\n' +
                                'msgstr ""\n' +
                                '"#-#-#-#-#  test/testfiles/project3/loctest-new-ja-JP.pot  #-#-#-#-#\\n"\n' +
                                '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
                                '"Content-Transfer-Encoding: 8bit\\n"\n' +
                                '"Generated-By: loctool\\n"\n' +
                                '"Project-Id-Version: 1\\n"\n' +
                                '"Language: ja-JP\\n"\n' +
                                '"Plural-Forms: nplurals=1; plural=0;\\n"\n' +
                                '"Project: loctest\\n"\n' +
                                '\n' +
                                '#: en-US.mock\n' +
                                '#d mock\n' +
                                '#k plu1\n' +
                                'msgid "singular"\n' +
                                'msgid_plural "plural"\n' +
                                'msgstr[0] ""\n';
                            expect(actual).toBe(expected);

                            filename = "./test/testfiles/project3/loctest-new-zh-Hans-CN.pot";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            var actual = fs.readFileSync(filename, "utf8");
                            var expected =
                                'msgid ""\n' +
                                'msgstr ""\n' +
                                '"#-#-#-#-#  test/testfiles/project3/loctest-new-zh-Hans-CN.pot  #-#-#-#-#\\n"\n' +
                                '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
                                '"Content-Transfer-Encoding: 8bit\\n"\n' +
                                '"Generated-By: loctool\\n"\n' +
                                '"Project-Id-Version: 1\\n"\n' +
                                '"Language: zh-Hans-CN\\n"\n' +
                                '"Plural-Forms: nplurals=1; plural=0;\\n"\n' +
                                '"Project: loctest\\n"\n' +
                                '\n' +
                                '#: en-US.mock\n' +
                                '#d mock\n' +
                                '#k plu1\n' +
                                'msgid "singular"\n' +
                                'msgid_plural "plural"\n' +
                                'msgstr[0] ""\n';
                            expect(actual).toBe(expected);

                            filename = "./test/testfiles/project3/es-US.mock";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            var actual = fs.readFileSync(filename, "utf8");
                            var expected =
                                '{\n' +
                                '    "arr1": [\n' +
                                '        "uno",\n' +
                                '        "dos",\n' +
                                '        "tres"\n' +
                                '    ],\n' +
                                '    "arr2": [\n' +
                                '        "cuatro",\n' +
                                '        "cinco",\n' +
                                '        "seis"\n' +
                                '    ],\n' +
                                '    "foobar1": "Esta es una cadena de prueba",\n' +
                                '    "foobar2": "Esta es una segunda cadena de prueba",\n' +
                                '    "plu1": {\n' +
                                '        "one": "singular",\n' +
                                '        "other": "plural"\n' +
                                '    },\n' +
                                '    "plu2": {\n' +
                                '        "other": "Hay {n} artículos.",\n' +
                                '        "one": "Hay {n} artículo."\n' +
                                '    }\n' +
                                '}';
                            expect(actual).toBe(expected);

                            filename = "./test/testfiles/project3/ja-JP.mock";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            var actual = fs.readFileSync(filename, "utf8");
                            var expected =
                                '{\n' +
                                '    "arr1": [\n' +
                                '        "1",\n' +
                                '        "2",\n' +
                                '        "3"\n' +
                                '    ],\n' +
                                '    "arr2": [\n' +
                                '        "4",\n' +
                                '        "5",\n' +
                                '        "6"\n' +
                                '    ],\n' +
                                '    "foobar1": "これはテスト文字列です",\n' +
                                '    "foobar2": "これは 2 番目のテスト文字列です",\n' +
                                '    "plu1": {\n' +
                                '        "one": "singular",\n' +
                                '        "other": "plural"\n' +
                                '    },\n' +
                                '    "plu2": {\n' +
                                '        "other": "項目が {n} つあります。"\n' +
                                '    }\n' +
                                '}';
                            expect(actual).toBe(expected);

                            filename = "./test/testfiles/project3/zh-Hans-CN.mock";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            var actual = fs.readFileSync(filename, "utf8");
                            var expected =
                                '{\n' +
                                '    "arr1": [\n' +
                                '        "一",\n' +
                                '        "二",\n' +
                                '        "三"\n' +
                                '    ],\n' +
                                '    "arr2": [\n' +
                                '        "四",\n' +
                                '        "五",\n' +
                                '        "六"\n' +
                                '    ],\n' +
                                '    "foobar1": "这是一个测试字符串",\n' +
                                '    "foobar2": "这是第二个测试字符串",\n' +
                                '    "plu1": {\n' +
                                '        "one": "singular",\n' +
                                '        "other": "plural"\n' +
                                '    },\n' +
                                '    "plu2": {\n' +
                                '        "other": "有 {n} 个项目。"\n' +
                                '    }\n' +
                                '}';
                            expect(actual).toBe(expected);
                        });
                    });
                });
            });
        });
    });

    test("Project localize a mock file with plurals using plural conversions", function() {
        expect.assertions(12);
        // set up first
        expect(!fs.existsSync("./test/testfiles/project3/loctest-new-es-US.xliff")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project3/loctest-new-ja-JP.xliff")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project3/loctest-new-zh-Hans-CN.xliff")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project3/es-US.mock")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project3/ja-JP.mock")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project3/zh-Hans-CN.mock")).toBeTruthy();
        var project = ProjectFactory('./test/testfiles/project3', {
            translationsDir: "translations2",
            locales: ['es-US', 'ja-JP', 'zh-Hans-CN'],
            convertPlurals: true
        });
        project.addPath("en-US.mock");

        project.init(function() {
            project.extract(function() {
                project.write(function() {
                    project.save(function() {
                        project.close(function() {
                            // should have all new strings
                            expect(fs.existsSync("./test/testfiles/project3/loctest-new-es-US.xliff")).toBeTruthy();
                            expect(fs.existsSync("./test/testfiles/project3/loctest-new-ja-JP.xliff")).toBeTruthy();
                            expect(fs.existsSync("./test/testfiles/project3/loctest-new-zh-Hans-CN.xliff")).toBeTruthy();

                            expect(fs.existsSync("./test/testfiles/project3/es-US.mock")).toBeTruthy();
                            expect(fs.existsSync("./test/testfiles/project3/ja-JP.mock")).toBeTruthy();
                            expect(fs.existsSync("./test/testfiles/project3/zh-Hans-CN.mock")).toBeTruthy();
                        });
                    });
                });
            });
        });
    });

    test("Project localize a mock file with plurals using plural conversions, right content", function() {
        expect.assertions(18);
        // set up first
        expect(!fs.existsSync("./test/testfiles/project3/loctest-new-es-US.xliff")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project3/loctest-new-ja-JP.xliff")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project3/loctest-new-zh-Hans-CN.xliff")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project3/es-US.mock")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project3/ja-JP.mock")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project3/zh-Hans-CN.mock")).toBeTruthy();
        var project = ProjectFactory('./test/testfiles/project3', {
            translationsDir: "translations1",
            locales: ['es-US', 'ja-JP', 'zh-Hans-CN'],
            convertPlurals: true
        });
        project.addPath("en-US.mock");

        project.init(function() {
            project.extract(function() {
                project.write(function() {
                    project.save(function() {
                        project.close(function() {
                            var filename = "./test/testfiles/project3/loctest-new-es-US.xliff";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            var actual = fs.readFileSync(filename, "utf8");
                            var expected =
                                '<?xml version="1.0" encoding="utf-8"?>\n' +
                                '<xliff version="1.2">\n' +
                                '  <file original="en-US.mock" source-language="en-US" target-language="es-US" product-name="loctest">\n' +
                                '    <body>\n' +
                                '      <trans-unit id="1" resname="plu1" restype="string" datatype="mock">\n' +
                                '        <source>{count, plural, one {singular} other {plural}}</source>\n' +
                                '        <target state="new">{count, plural, one {singular} many {plural} other {plural}}</target>\n' +
                                '      </trans-unit>\n' +
                                '    </body>\n' +
                                '  </file>\n' +
                                '</xliff>';
                            expect(actual).toBe(expected);

                            filename = "./test/testfiles/project3/loctest-new-ja-JP.xliff";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            var actual = fs.readFileSync(filename, "utf8");
                            var expected =
                                '<?xml version="1.0" encoding="utf-8"?>\n' +
                                '<xliff version="1.2">\n' +
                                '  <file original="en-US.mock" source-language="en-US" target-language="ja-JP" product-name="loctest">\n' +
                                '    <body>\n' +
                                '      <trans-unit id="1" resname="plu1" restype="string" datatype="mock">\n' +
                                '        <source>{count, plural, one {singular} other {plural}}</source>\n' +
                                '        <target state="new">{count, plural, other {plural}}</target>\n' +
                                '      </trans-unit>\n' +
                                '    </body>\n' +
                                '  </file>\n' +
                                '</xliff>';
                            expect(actual).toBe(expected);

                            filename = "./test/testfiles/project3/loctest-new-zh-Hans-CN.xliff";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            var actual = fs.readFileSync(filename, "utf8");
                            var expected =
                                '<?xml version="1.0" encoding="utf-8"?>\n' +
                                '<xliff version="1.2">\n' +
                                '  <file original="en-US.mock" source-language="en-US" target-language="zh-Hans-CN" product-name="loctest">\n' +
                                '    <body>\n' +
                                '      <trans-unit id="1" resname="plu1" restype="string" datatype="mock">\n' +
                                '        <source>{count, plural, one {singular} other {plural}}</source>\n' +
                                '        <target state="new">{count, plural, other {plural}}</target>\n' +
                                '      </trans-unit>\n' +
                                '    </body>\n' +
                                '  </file>\n' +
                                '</xliff>';
                            expect(actual).toBe(expected);

                            filename = "./test/testfiles/project3/es-US.mock";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            var actual = fs.readFileSync(filename, "utf8");
                            var expected =
                                '{\n' +
                                '    "arr1": [\n' +
                                '        "uno",\n' +
                                '        "dos",\n' +
                                '        "tres"\n' +
                                '    ],\n' +
                                '    "arr2": [\n' +
                                '        "quatro",\n' +
                                '        "cinco",\n' +
                                '        "seis"\n' +
                                '    ],\n' +
                                '    "foobar1": "Esta es una cadena de prueba",\n' +
                                '    "foobar2": "Esta es una segunda cadena de prueba",\n' +
                                '    "plu1": {\n' +
                                '        "one": "singular",\n' +
                                '        "other": "plural"\n' +
                                '    },\n' +
                                '    "plu2": {\n' +
                                '        "one": "Hay {n} artículo.",\n' +
                                '        "many": "Hay {n} artículos.",\n' +
                                '        "other": "Hay {n} artículos."\n' +
                                '    }\n' +
                                '}';
                            expect(actual).toBe(expected);

                            filename = "./test/testfiles/project3/ja-JP.mock";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            var actual = fs.readFileSync(filename, "utf8");
                            var expected =
                                '{\n' +
                                '    "arr1": [\n' +
                                '        "1",\n' +
                                '        "2",\n' +
                                '        "3"\n' +
                                '    ],\n' +
                                '    "arr2": [\n' +
                                '        "4",\n' +
                                '        "5",\n' +
                                '        "6"\n' +
                                '    ],\n' +
                                '    "foobar1": "これはテスト文字列です",\n' +
                                '    "foobar2": "これは 2 番目のテスト文字列です",\n' +
                                '    "plu1": {\n' +
                                '        "one": "singular",\n' +
                                '        "other": "plural"\n' +
                                '    },\n' +
                                '    "plu2": {\n' +
                                '        "other": "項目が {n} つあります。"\n' +
                                '    }\n' +
                                '}';
                            expect(actual).toBe(expected);

                            filename = "./test/testfiles/project3/zh-Hans-CN.mock";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            var actual = fs.readFileSync(filename, "utf8");
                            var expected =
                                '{\n' +
                                '    "arr1": [\n' +
                                '        "一",\n' +
                                '        "二",\n' +
                                '        "三"\n' +
                                '    ],\n' +
                                '    "arr2": [\n' +
                                '        "四",\n' +
                                '        "五",\n' +
                                '        "六"\n' +
                                '    ],\n' +
                                '    "foobar1": "这是一个测试字符串",\n' +
                                '    "foobar2": "这是第二个测试字符串",\n' +
                                '    "plu1": {\n' +
                                '        "one": "singular",\n' +
                                '        "other": "plural"\n' +
                                '    },\n' +
                                '    "plu2": {\n' +
                                '        "other": "有 {n} 个项目。"\n' +
                                '    }\n' +
                                '}';
                            expect(actual).toBe(expected);
                        });
                    });
                });
            });
        });
    });

    test("Project localize a mock file with plurals using plural conversions and still accepts the legacy xliffsDir parameter", function() {
        expect.assertions(18);
        // set up first
        expect(!fs.existsSync("./test/testfiles/project3/loctest-new-es-US.xliff")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project3/loctest-new-ja-JP.xliff")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project3/loctest-new-zh-Hans-CN.xliff")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project3/es-US.mock")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project3/ja-JP.mock")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project3/zh-Hans-CN.mock")).toBeTruthy();
        var project = ProjectFactory('./test/testfiles/project3', {
            xliffsDir: "translations1",
            locales: ['es-US', 'ja-JP', 'zh-Hans-CN'],
            convertPlurals: true
        });
        project.addPath("en-US.mock");

        project.init(function() {
            project.extract(function() {
                project.write(function() {
                    project.save(function() {
                        project.close(function() {
                            var filename = "./test/testfiles/project3/loctest-new-es-US.xliff";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            var actual = fs.readFileSync(filename, "utf8");
                            var expected =
                                '<?xml version="1.0" encoding="utf-8"?>\n' +
                                '<xliff version="1.2">\n' +
                                '  <file original="en-US.mock" source-language="en-US" target-language="es-US" product-name="loctest">\n' +
                                '    <body>\n' +
                                '      <trans-unit id="1" resname="plu1" restype="string" datatype="mock">\n' +
                                '        <source>{count, plural, one {singular} other {plural}}</source>\n' +
                                '        <target state="new">{count, plural, one {singular} many {plural} other {plural}}</target>\n' +
                                '      </trans-unit>\n' +
                                '    </body>\n' +
                                '  </file>\n' +
                                '</xliff>';
                            expect(actual).toBe(expected);

                            filename = "./test/testfiles/project3/loctest-new-ja-JP.xliff";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            var actual = fs.readFileSync(filename, "utf8");
                            var expected =
                                '<?xml version="1.0" encoding="utf-8"?>\n' +
                                '<xliff version="1.2">\n' +
                                '  <file original="en-US.mock" source-language="en-US" target-language="ja-JP" product-name="loctest">\n' +
                                '    <body>\n' +
                                '      <trans-unit id="1" resname="plu1" restype="string" datatype="mock">\n' +
                                '        <source>{count, plural, one {singular} other {plural}}</source>\n' +
                                '        <target state="new">{count, plural, other {plural}}</target>\n' +
                                '      </trans-unit>\n' +
                                '    </body>\n' +
                                '  </file>\n' +
                                '</xliff>';
                            expect(actual).toBe(expected);

                            filename = "./test/testfiles/project3/loctest-new-zh-Hans-CN.xliff";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            var actual = fs.readFileSync(filename, "utf8");
                            var expected =
                                '<?xml version="1.0" encoding="utf-8"?>\n' +
                                '<xliff version="1.2">\n' +
                                '  <file original="en-US.mock" source-language="en-US" target-language="zh-Hans-CN" product-name="loctest">\n' +
                                '    <body>\n' +
                                '      <trans-unit id="1" resname="plu1" restype="string" datatype="mock">\n' +
                                '        <source>{count, plural, one {singular} other {plural}}</source>\n' +
                                '        <target state="new">{count, plural, other {plural}}</target>\n' +
                                '      </trans-unit>\n' +
                                '    </body>\n' +
                                '  </file>\n' +
                                '</xliff>';
                            expect(actual).toBe(expected);

                            filename = "./test/testfiles/project3/es-US.mock";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            var actual = fs.readFileSync(filename, "utf8");
                            var expected =
                                '{\n' +
                                '    "arr1": [\n' +
                                '        "uno",\n' +
                                '        "dos",\n' +
                                '        "tres"\n' +
                                '    ],\n' +
                                '    "arr2": [\n' +
                                '        "quatro",\n' +
                                '        "cinco",\n' +
                                '        "seis"\n' +
                                '    ],\n' +
                                '    "foobar1": "Esta es una cadena de prueba",\n' +
                                '    "foobar2": "Esta es una segunda cadena de prueba",\n' +
                                '    "plu1": {\n' +
                                '        "one": "singular",\n' +
                                '        "other": "plural"\n' +
                                '    },\n' +
                                '    "plu2": {\n' +
                                '        "one": "Hay {n} artículo.",\n' +
                                '        "many": "Hay {n} artículos.",\n' +
                                '        "other": "Hay {n} artículos."\n' +
                                '    }\n' +
                                '}';
                            expect(actual).toBe(expected);

                            filename = "./test/testfiles/project3/ja-JP.mock";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            var actual = fs.readFileSync(filename, "utf8");
                            var expected =
                                '{\n' +
                                '    "arr1": [\n' +
                                '        "1",\n' +
                                '        "2",\n' +
                                '        "3"\n' +
                                '    ],\n' +
                                '    "arr2": [\n' +
                                '        "4",\n' +
                                '        "5",\n' +
                                '        "6"\n' +
                                '    ],\n' +
                                '    "foobar1": "これはテスト文字列です",\n' +
                                '    "foobar2": "これは 2 番目のテスト文字列です",\n' +
                                '    "plu1": {\n' +
                                '        "one": "singular",\n' +
                                '        "other": "plural"\n' +
                                '    },\n' +
                                '    "plu2": {\n' +
                                '        "other": "項目が {n} つあります。"\n' +
                                '    }\n' +
                                '}';
                            expect(actual).toBe(expected);

                            filename = "./test/testfiles/project3/zh-Hans-CN.mock";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            var actual = fs.readFileSync(filename, "utf8");
                            var expected =
                                '{\n' +
                                '    "arr1": [\n' +
                                '        "一",\n' +
                                '        "二",\n' +
                                '        "三"\n' +
                                '    ],\n' +
                                '    "arr2": [\n' +
                                '        "四",\n' +
                                '        "五",\n' +
                                '        "六"\n' +
                                '    ],\n' +
                                '    "foobar1": "这是一个测试字符串",\n' +
                                '    "foobar2": "这是第二个测试字符串",\n' +
                                '    "plu1": {\n' +
                                '        "one": "singular",\n' +
                                '        "other": "plural"\n' +
                                '    },\n' +
                                '    "plu2": {\n' +
                                '        "other": "有 {n} 个项目。"\n' +
                                '    }\n' +
                                '}';
                            expect(actual).toBe(expected);
                        });
                    });
                });
            });
        });
    });

    test("ProjectGeneratesCorrectPluralCategoriesInNewStringsXliffs", function() {
        expect.assertions(9);
        // set up first
        expect(!fs.existsSync("./test/testfiles/project2/loctest-new-es-US.xliff")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project2/loctest-new-ja-JP.xliff")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project2/loctest-new-ru-RU.xliff")).toBeTruthy();
        // adds Japanese and Russian to the list of locales to generate
        var project = ProjectFactory('./test/testfiles/project2', {});
        project.addPath("res/values/strings.xml");
        project.init(function() {
            project.extract(function() {
                project.generatePseudo();
                project.write(function() {
                    project.save(function() {
                        project.close(function() {
                            var filename = "./test/testfiles/project2/loctest-new-es-US.xliff";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            var actual = fs.readFileSync(filename, "utf8");
                            var expected =
                                '<?xml version="1.0" encoding="utf-8"?>\n' +
                                '<xliff version="1.2">\n' +
                                '  <file original="res/values/strings.xml" source-language="en-US" target-language="es-US" product-name="loctest">\n' +
                                '    <body>\n' +
                                '      <trans-unit id="1" resname="noSource" restype="array" datatype="x-android-resource" extype="0">\n' +
                                '        <source>a</source>\n' +
                                '        <target state="new">a</target>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="2" resname="noSource" restype="array" datatype="x-android-resource" extype="1">\n' +
                                '        <source>b</source>\n' +
                                '        <target state="new">b</target>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="3" resname="noSource" restype="array" datatype="x-android-resource" extype="3">\n' +
                                '        <source>c</source>\n' +
                                '        <target state="new">c</target>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="4" resname="foobar" restype="plural" datatype="x-android-resource" extype="one">\n' +
                                '        <source>%d friend commented</source>\n' +
                                '        <target state="new">%d friend commented</target>\n' +
                                '        <note>{"pluralForm":"one","pluralFormOther":"foobar"}</note>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="5" resname="foobar" restype="plural" datatype="x-android-resource" extype="many">\n' +
                                '        <source>%d friends commented</source>\n' +
                                '        <target state="new">%d friends commented</target>\n' +
                                '        <note>{"pluralForm":"many","pluralFormOther":"foobar"}</note>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="6" resname="foobar" restype="plural" datatype="x-android-resource" extype="other">\n' +
                                '        <source>%d friends commented</source>\n' +
                                '        <target state="new">%d friends commented</target>\n' +
                                '        <note>{"pluralForm":"other","pluralFormOther":"foobar"}</note>\n' +
                                '      </trans-unit>\n' +
                                '    </body>\n' +
                                '  </file>\n' +
                                '</xliff>';
                            expect(actual).toBe(expected);
                            filename = "./test/testfiles/project2/loctest-new-ja-JP.xliff";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            actual = fs.readFileSync(filename, "utf8");
                            expected =
                                '<?xml version="1.0" encoding="utf-8"?>\n' +
                                '<xliff version="1.2">\n' +
                                '  <file original="res/values/strings.xml" source-language="en-US" target-language="ja-JP" product-name="loctest">\n' +
                                '    <body>\n' +
                                '      <trans-unit id="1" resname="noSource" restype="array" datatype="x-android-resource" extype="0">\n' +
                                '        <source>a</source>\n' +
                                '        <target state="new">a</target>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="2" resname="noSource" restype="array" datatype="x-android-resource" extype="1">\n' +
                                '        <source>b</source>\n' +
                                '        <target state="new">b</target>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="3" resname="noSource" restype="array" datatype="x-android-resource" extype="3">\n' +
                                '        <source>c</source>\n' +
                                '        <target state="new">c</target>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="4" resname="foobar" restype="plural" datatype="x-android-resource" extype="other">\n' +
                                '        <source>%d friends commented</source>\n' +
                                '        <target state="new">%d friends commented</target>\n' +
                                '        <note>{"pluralForm":"other","pluralFormOther":"foobar"}</note>\n' +
                                '      </trans-unit>\n' +
                                '    </body>\n' +
                                '  </file>\n' +
                                '</xliff>';
                            expect(actual).toBe(expected);
                            filename = "./test/testfiles/project2/loctest-new-ru-RU.xliff";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            actual = fs.readFileSync(filename, "utf8");
                            expected =
                                '<?xml version="1.0" encoding="utf-8"?>\n' +
                                '<xliff version="1.2">\n' +
                                '  <file original="res/values/strings.xml" source-language="en-US" target-language="ru-RU" product-name="loctest">\n' +
                                '    <body>\n' +
                                '      <trans-unit id="1" resname="noSource" restype="array" datatype="x-android-resource" extype="0">\n' +
                                '        <source>a</source>\n' +
                                '        <target state="new">a</target>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="2" resname="noSource" restype="array" datatype="x-android-resource" extype="1">\n' +
                                '        <source>b</source>\n' +
                                '        <target state="new">b</target>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="3" resname="noSource" restype="array" datatype="x-android-resource" extype="3">\n' +
                                '        <source>c</source>\n' +
                                '        <target state="new">c</target>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="4" resname="foobar" restype="plural" datatype="x-android-resource" extype="one">\n' +
                                '        <source>%d friend commented</source>\n' +
                                '        <target state="new">%d friend commented</target>\n' +
                                '        <note>{"pluralForm":"one","pluralFormOther":"foobar"}</note>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="5" resname="foobar" restype="plural" datatype="x-android-resource" extype="few">\n' +
                                '        <source>%d friends commented</source>\n' +
                                '        <target state="new">%d friends commented</target>\n' +
                                '        <note>{"pluralForm":"few","pluralFormOther":"foobar"}</note>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="6" resname="foobar" restype="plural" datatype="x-android-resource" extype="many">\n' +
                                '        <source>%d friends commented</source>\n' +
                                '        <target state="new">%d friends commented</target>\n' +
                                '        <note>{"pluralForm":"many","pluralFormOther":"foobar"}</note>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="7" resname="foobar" restype="plural" datatype="x-android-resource" extype="other">\n' +
                                '        <source>%d friends commented</source>\n' +
                                '        <target state="new">%d friends commented</target>\n' +
                                '        <note>{"pluralForm":"other","pluralFormOther":"foobar"}</note>\n' +
                                '      </trans-unit>\n' +
                                '    </body>\n' +
                                '  </file>\n' +
                                '</xliff>';
                            expect(actual).toBe(expected);
                        });
                    });
                });
            });
        });
    });

    test("Project generates correct plural strings in new strings files with convertPlural turned on", function() {
        expect.assertions(9);
        // set up first
        expect(!fs.existsSync("./test/testfiles/project2/loctest-new-es-US.xliff")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project2/loctest-new-ja-JP.xliff")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project2/loctest-new-ru-RU.xliff")).toBeTruthy();
        // adds Japanese and Russian to the list of locales to generate
        var project = ProjectFactory('./test/testfiles/project2', {
            convertPlurals: true
        });
        project.addPath("res/values/strings.xml");

        project.init(function() {
            project.extract(function() {
                project.generatePseudo();
                project.write(function() {
                    project.save(function() {
                        project.close(function() {
                            var filename = "./test/testfiles/project2/loctest-new-es-US.xliff";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            var actual = fs.readFileSync(filename, "utf8");
                            var expected =
                                '<?xml version="1.0" encoding="utf-8"?>\n' +
                                '<xliff version="1.2">\n' +
                                '  <file original="res/values/strings.xml" source-language="en-US" target-language="es-US" product-name="loctest">\n' +
                                '    <body>\n' +
                                '      <trans-unit id="1" resname="noSource" restype="array" datatype="x-android-resource" extype="0">\n' +
                                '        <source>a</source>\n' +
                                '        <target state="new">a</target>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="2" resname="noSource" restype="array" datatype="x-android-resource" extype="1">\n' +
                                '        <source>b</source>\n' +
                                '        <target state="new">b</target>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="3" resname="noSource" restype="array" datatype="x-android-resource" extype="3">\n' +
                                '        <source>c</source>\n' +
                                '        <target state="new">c</target>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="4" resname="foobar" restype="string" datatype="x-android-resource">\n' +
                                '        <source>{count, plural, one {%d friend commented} other {%d friends commented}}</source>\n' +
                                '        <target state="new">{count, plural, one {%d friend commented} many {%d friends commented} other {%d friends commented}}</target>\n' +
                                '      </trans-unit>\n' +
                                '    </body>\n' +
                                '  </file>\n' +
                                '</xliff>';
                            expect(actual).toBe(expected);
                            filename = "./test/testfiles/project2/loctest-new-ja-JP.xliff";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            actual = fs.readFileSync(filename, "utf8");
                            expected =
                                '<?xml version="1.0" encoding="utf-8"?>\n' +
                                '<xliff version="1.2">\n' +
                                '  <file original="res/values/strings.xml" source-language="en-US" target-language="ja-JP" product-name="loctest">\n' +
                                '    <body>\n' +
                                '      <trans-unit id="1" resname="noSource" restype="array" datatype="x-android-resource" extype="0">\n' +
                                '        <source>a</source>\n' +
                                '        <target state="new">a</target>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="2" resname="noSource" restype="array" datatype="x-android-resource" extype="1">\n' +
                                '        <source>b</source>\n' +
                                '        <target state="new">b</target>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="3" resname="noSource" restype="array" datatype="x-android-resource" extype="3">\n' +
                                '        <source>c</source>\n' +
                                '        <target state="new">c</target>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="4" resname="foobar" restype="string" datatype="x-android-resource">\n' +
                                '        <source>{count, plural, one {%d friend commented} other {%d friends commented}}</source>\n' +
                                '        <target state="new">{count, plural, other {%d friends commented}}</target>\n' +
                                '      </trans-unit>\n' +
                                '    </body>\n' +
                                '  </file>\n' +
                                '</xliff>';
                            expect(actual).toBe(expected);
                            filename = "./test/testfiles/project2/loctest-new-ru-RU.xliff";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            actual = fs.readFileSync(filename, "utf8");
                            expected =
                                '<?xml version="1.0" encoding="utf-8"?>\n' +
                                '<xliff version="1.2">\n' +
                                '  <file original="res/values/strings.xml" source-language="en-US" target-language="ru-RU" product-name="loctest">\n' +
                                '    <body>\n' +
                                '      <trans-unit id="1" resname="noSource" restype="array" datatype="x-android-resource" extype="0">\n' +
                                '        <source>a</source>\n' +
                                '        <target state="new">a</target>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="2" resname="noSource" restype="array" datatype="x-android-resource" extype="1">\n' +
                                '        <source>b</source>\n' +
                                '        <target state="new">b</target>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="3" resname="noSource" restype="array" datatype="x-android-resource" extype="3">\n' +
                                '        <source>c</source>\n' +
                                '        <target state="new">c</target>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="4" resname="foobar" restype="string" datatype="x-android-resource">\n' +
                                '        <source>{count, plural, one {%d friend commented} other {%d friends commented}}</source>\n' +
                                '        <target state="new">{count, plural, one {%d friend commented} few {%d friends commented} many {%d friends commented} other {%d friends commented}}</target>\n' +
                                '      </trans-unit>\n' +
                                '    </body>\n' +
                                '  </file>\n' +
                                '</xliff>';
                            expect(actual).toBe(expected);
                        });
                    });
                });
            });
        });
    });

    test("Project generates correct plural strings in the extracted strings files with convertPlural turned on", function() {
        expect.assertions(3);
        // set up first
        expect(!fs.existsSync("./test/testfiles/project2/loctest-extracted.xliff")).toBeTruthy();
        var project = ProjectFactory('./test/testfiles/project2', {
            convertPlurals: true
        });
        project.addPath("res/values/strings.xml");
        project.init(function() {
            project.extract(function() {
                project.generatePseudo();
                project.write(function() {
                    project.save(function() {
                        project.close(function() {
                            var filename = "./test/testfiles/project2/loctest-extracted.xliff";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            var actual = fs.readFileSync(filename, "utf8");
                            var expected =
                                '<?xml version="1.0" encoding="utf-8"?>\n' +
                                '<xliff version="1.2">\n' +
                                '  <file original="res/values/strings.xml" source-language="en-US" product-name="loctest">\n' +
                                '    <body>\n' +
                                '      <trans-unit id="1" resname="app_id" restype="string" datatype="x-android-resource">\n' +
                                '        <source>151779581544891</source>\n' +
                                '        <note>Do not translate</note>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="2" resname="noSource" restype="array" datatype="x-android-resource" extype="0">\n' +
                                '        <source>a</source>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="3" resname="noSource" restype="array" datatype="x-android-resource" extype="1">\n' +
                                '        <source>b</source>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="4" resname="noSource" restype="array" datatype="x-android-resource" extype="3">\n' +
                                '        <source>c</source>\n' +
                                '      </trans-unit>\n' +
                                '      <trans-unit id="5" resname="foobar" restype="string" datatype="x-android-resource">\n' +
                                '        <source>{count, plural, one {%d friend commented} other {%d friends commented}}</source>\n' +
                                '      </trans-unit>\n' +
                                '    </body>\n' +
                                '  </file>\n' +
                                '</xliff>';
                            expect(actual).toBe(expected);
                        });
                    });
                });
            });
        });
    });

    test("ProjectGeneratesCorrectPluralCategoriesInNewStringsXliffs20", function() {
        expect.assertions(9);
        // set up first
        expect(!fs.existsSync("./test/testfiles/project2/loctest-new-es-US.xliff")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project2/loctest-new-ja-JP.xliff")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project2/loctest-new-ru-RU.xliff")).toBeTruthy();
        // adds Japanese and Russian to the list of locales to generate
        var project = ProjectFactory('./test/testfiles/project2', {
            xliffVersion: 2
        });
        project.addPath("res/values/strings.xml");
        project.init(function() {
            project.extract(function() {
                project.generatePseudo();
                project.write(function() {
                    project.save(function() {
                        project.close(function() {
                            var filename = "./test/testfiles/project2/loctest-new-es-US.xliff";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            var actual = fs.readFileSync(filename, "utf8");
                            var expected =
                                '<?xml version="1.0" encoding="utf-8"?>\n' +
                                '<xliff version="2.0" srcLang="en-US" trgLang="es-US" xmlns:l="http://ilib-js.com/loctool">\n' +
                                '  <file original="res/values/strings.xml" l:project="loctest">\n' +
                                '    <group id="group_1" name="x-android-resource">\n' +
                                '      <unit id="1" name="noSource" type="res:array" l:datatype="x-android-resource" l:index="0">\n' +
                                '        <segment>\n' +
                                '          <source>a</source>\n' +
                                '          <target state="new">a</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="2" name="noSource" type="res:array" l:datatype="x-android-resource" l:index="1">\n' +
                                '        <segment>\n' +
                                '          <source>b</source>\n' +
                                '          <target state="new">b</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="3" name="noSource" type="res:array" l:datatype="x-android-resource" l:index="3">\n' +
                                '        <segment>\n' +
                                '          <source>c</source>\n' +
                                '          <target state="new">c</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="4" name="foobar" type="res:plural" l:datatype="x-android-resource" l:category="one">\n' +
                                '        <notes>\n' +
                                '          <note appliesTo="source">{"pluralForm":"one","pluralFormOther":"foobar"}</note>\n' +
                                '        </notes>\n' +
                                '        <segment>\n' +
                                '          <source>%d friend commented</source>\n' +
                                '          <target state="new">%d friend commented</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="5" name="foobar" type="res:plural" l:datatype="x-android-resource" l:category="many">\n' +
                                '        <notes>\n' +
                                '          <note appliesTo="source">{"pluralForm":"many","pluralFormOther":"foobar"}</note>\n' +
                                '        </notes>\n' +
                                '        <segment>\n' +
                                '          <source>%d friends commented</source>\n' +
                                '          <target state="new">%d friends commented</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="6" name="foobar" type="res:plural" l:datatype="x-android-resource" l:category="other">\n' +
                                '        <notes>\n' +
                                '          <note appliesTo="source">{"pluralForm":"other","pluralFormOther":"foobar"}</note>\n' +
                                '        </notes>\n' +
                                '        <segment>\n' +
                                '          <source>%d friends commented</source>\n' +
                                '          <target state="new">%d friends commented</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '    </group>\n' +
                                '  </file>\n' +
                                '</xliff>';
                            expect(actual).toBe(expected);
                            filename = "./test/testfiles/project2/loctest-new-ja-JP.xliff";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            actual = fs.readFileSync(filename, "utf8");
                            expected =
                                '<?xml version="1.0" encoding="utf-8"?>\n' +
                                '<xliff version="2.0" srcLang="en-US" trgLang="ja-JP" xmlns:l="http://ilib-js.com/loctool">\n' +
                                '  <file original="res/values/strings.xml" l:project="loctest">\n' +
                                '    <group id="group_1" name="x-android-resource">\n' +
                                '      <unit id="1" name="noSource" type="res:array" l:datatype="x-android-resource" l:index="0">\n' +
                                '        <segment>\n' +
                                '          <source>a</source>\n' +
                                '          <target state="new">a</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="2" name="noSource" type="res:array" l:datatype="x-android-resource" l:index="1">\n' +
                                '        <segment>\n' +
                                '          <source>b</source>\n' +
                                '          <target state="new">b</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="3" name="noSource" type="res:array" l:datatype="x-android-resource" l:index="3">\n' +
                                '        <segment>\n' +
                                '          <source>c</source>\n' +
                                '          <target state="new">c</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="4" name="foobar" type="res:plural" l:datatype="x-android-resource" l:category="other">\n' +
                                '        <notes>\n' +
                                '          <note appliesTo="source">{"pluralForm":"other","pluralFormOther":"foobar"}</note>\n' +
                                '        </notes>\n' +
                                '        <segment>\n' +
                                '          <source>%d friends commented</source>\n' +
                                '          <target state="new">%d friends commented</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '    </group>\n' +
                                '  </file>\n' +
                                '</xliff>';
                            expect(actual).toBe(expected);
                            filename = "./test/testfiles/project2/loctest-new-ru-RU.xliff";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            actual = fs.readFileSync(filename, "utf8");
                            expected =
                                '<?xml version="1.0" encoding="utf-8"?>\n' +
                                '<xliff version="2.0" srcLang="en-US" trgLang="ru-RU" xmlns:l="http://ilib-js.com/loctool">\n' +
                                '  <file original="res/values/strings.xml" l:project="loctest">\n' +
                                '    <group id="group_1" name="x-android-resource">\n' +
                                '      <unit id="1" name="noSource" type="res:array" l:datatype="x-android-resource" l:index="0">\n' +
                                '        <segment>\n' +
                                '          <source>a</source>\n' +
                                '          <target state="new">a</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="2" name="noSource" type="res:array" l:datatype="x-android-resource" l:index="1">\n' +
                                '        <segment>\n' +
                                '          <source>b</source>\n' +
                                '          <target state="new">b</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="3" name="noSource" type="res:array" l:datatype="x-android-resource" l:index="3">\n' +
                                '        <segment>\n' +
                                '          <source>c</source>\n' +
                                '          <target state="new">c</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="4" name="foobar" type="res:plural" l:datatype="x-android-resource" l:category="one">\n' +
                                '        <notes>\n' +
                                '          <note appliesTo="source">{"pluralForm":"one","pluralFormOther":"foobar"}</note>\n' +
                                '        </notes>\n' +
                                '        <segment>\n' +
                                '          <source>%d friend commented</source>\n' +
                                '          <target state="new">%d friend commented</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="5" name="foobar" type="res:plural" l:datatype="x-android-resource" l:category="few">\n' +
                                '        <notes>\n' +
                                '          <note appliesTo="source">{"pluralForm":"few","pluralFormOther":"foobar"}</note>\n' +
                                '        </notes>\n' +
                                '        <segment>\n' +
                                '          <source>%d friends commented</source>\n' +
                                '          <target state="new">%d friends commented</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="6" name="foobar" type="res:plural" l:datatype="x-android-resource" l:category="many">\n' +
                                '        <notes>\n' +
                                '          <note appliesTo="source">{"pluralForm":"many","pluralFormOther":"foobar"}</note>\n' +
                                '        </notes>\n' +
                                '        <segment>\n' +
                                '          <source>%d friends commented</source>\n' +
                                '          <target state="new">%d friends commented</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="7" name="foobar" type="res:plural" l:datatype="x-android-resource" l:category="other">\n' +
                                '        <notes>\n' +
                                '          <note appliesTo="source">{"pluralForm":"other","pluralFormOther":"foobar"}</note>\n' +
                                '        </notes>\n' +
                                '        <segment>\n' +
                                '          <source>%d friends commented</source>\n' +
                                '          <target state="new">%d friends commented</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '    </group>\n' +
                                '  </file>\n' +
                                '</xliff>';
                            expect(actual).toBe(expected);
                        });
                    });
                });
            });
        });
    });

    test("Project generates correct plural strings in new strings file after convert option is turned on", function() {
        expect.assertions(9);
        // set up first
        expect(!fs.existsSync("./test/testfiles/project2/loctest-new-es-US.xliff")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project2/loctest-new-ja-JP.xliff")).toBeTruthy();
        expect(!fs.existsSync("./test/testfiles/project2/loctest-new-ru-RU.xliff")).toBeTruthy();
        // adds Japanese and Russian to the list of locales to generate
        var project = ProjectFactory('./test/testfiles/project2', {
            xliffVersion: 2,
            convertPlurals: true
        });
        project.addPath("res/values/strings.xml");
        project.init(function() {
            project.extract(function() {
                project.generatePseudo();
                project.write(function() {
                    project.save(function() {
                        project.close(function() {
                            var filename = "./test/testfiles/project2/loctest-new-es-US.xliff";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            var actual = fs.readFileSync(filename, "utf8");
                            var expected =
                                '<?xml version="1.0" encoding="utf-8"?>\n' +
                                '<xliff version="2.0" srcLang="en-US" trgLang="es-US" xmlns:l="http://ilib-js.com/loctool">\n' +
                                '  <file original="res/values/strings.xml" l:project="loctest">\n' +
                                '    <group id="group_1" name="x-android-resource">\n' +
                                '      <unit id="1" name="noSource" type="res:array" l:datatype="x-android-resource" l:index="0">\n' +
                                '        <segment>\n' +
                                '          <source>a</source>\n' +
                                '          <target state="new">a</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="2" name="noSource" type="res:array" l:datatype="x-android-resource" l:index="1">\n' +
                                '        <segment>\n' +
                                '          <source>b</source>\n' +
                                '          <target state="new">b</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="3" name="noSource" type="res:array" l:datatype="x-android-resource" l:index="3">\n' +
                                '        <segment>\n' +
                                '          <source>c</source>\n' +
                                '          <target state="new">c</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="4" name="foobar" type="res:string" l:datatype="x-android-resource">\n' +
                                '        <segment>\n' +
                                '          <source>{count, plural, one {%d friend commented} other {%d friends commented}}</source>\n' +
                                '          <target state="new">{count, plural, one {%d friend commented} many {%d friends commented} other {%d friends commented}}</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '    </group>\n' +
                                '  </file>\n' +
                                '</xliff>';
                            expect(actual).toBe(expected);
                            filename = "./test/testfiles/project2/loctest-new-ja-JP.xliff";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            actual = fs.readFileSync(filename, "utf8");
                            expected =
                                '<?xml version="1.0" encoding="utf-8"?>\n' +
                                '<xliff version="2.0" srcLang="en-US" trgLang="ja-JP" xmlns:l="http://ilib-js.com/loctool">\n' +
                                '  <file original="res/values/strings.xml" l:project="loctest">\n' +
                                '    <group id="group_1" name="x-android-resource">\n' +
                                '      <unit id="1" name="noSource" type="res:array" l:datatype="x-android-resource" l:index="0">\n' +
                                '        <segment>\n' +
                                '          <source>a</source>\n' +
                                '          <target state="new">a</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="2" name="noSource" type="res:array" l:datatype="x-android-resource" l:index="1">\n' +
                                '        <segment>\n' +
                                '          <source>b</source>\n' +
                                '          <target state="new">b</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="3" name="noSource" type="res:array" l:datatype="x-android-resource" l:index="3">\n' +
                                '        <segment>\n' +
                                '          <source>c</source>\n' +
                                '          <target state="new">c</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="4" name="foobar" type="res:string" l:datatype="x-android-resource">\n' +
                                '        <segment>\n' +
                                '          <source>{count, plural, one {%d friend commented} other {%d friends commented}}</source>\n' +
                                '          <target state="new">{count, plural, other {%d friends commented}}</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '    </group>\n' +
                                '  </file>\n' +
                                '</xliff>';
                            expect(actual).toBe(expected);
                            filename = "./test/testfiles/project2/loctest-new-ru-RU.xliff";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            actual = fs.readFileSync(filename, "utf8");
                            expected =
                                '<?xml version="1.0" encoding="utf-8"?>\n' +
                                '<xliff version="2.0" srcLang="en-US" trgLang="ru-RU" xmlns:l="http://ilib-js.com/loctool">\n' +
                                '  <file original="res/values/strings.xml" l:project="loctest">\n' +
                                '    <group id="group_1" name="x-android-resource">\n' +
                                '      <unit id="1" name="noSource" type="res:array" l:datatype="x-android-resource" l:index="0">\n' +
                                '        <segment>\n' +
                                '          <source>a</source>\n' +
                                '          <target state="new">a</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="2" name="noSource" type="res:array" l:datatype="x-android-resource" l:index="1">\n' +
                                '        <segment>\n' +
                                '          <source>b</source>\n' +
                                '          <target state="new">b</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="3" name="noSource" type="res:array" l:datatype="x-android-resource" l:index="3">\n' +
                                '        <segment>\n' +
                                '          <source>c</source>\n' +
                                '          <target state="new">c</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="4" name="foobar" type="res:string" l:datatype="x-android-resource">\n' +
                                '        <segment>\n' +
                                '          <source>{count, plural, one {%d friend commented} other {%d friends commented}}</source>\n' +
                                '          <target state="new">{count, plural, one {%d friend commented} few {%d friends commented} many {%d friends commented} other {%d friends commented}}</target>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '    </group>\n' +
                                '  </file>\n' +
                                '</xliff>';
                            expect(actual).toBe(expected);
                        });
                    });
                });
            });
        });
    });

    test("Project generates correct plural strings in new strings file after convert option is turned on", function() {
        expect.assertions(3);
        // set up first
        expect(!fs.existsSync("./test/testfiles/project2/loctest-extracted.xliff")).toBeTruthy();
        // adds Japanese and Russian to the list of locales to generate
        var project = ProjectFactory('./test/testfiles/project2', {
            xliffVersion: 2,
            convertPlurals: true
        });
        project.addPath("res/values/strings.xml");
        project.init(function() {
            project.extract(function() {
                project.generatePseudo();
                project.write(function() {
                    project.save(function() {
                        project.close(function() {
                            var filename = "./test/testfiles/project2/loctest-extracted.xliff";
                            expect(fs.existsSync(filename)).toBeTruthy();
                            var actual = fs.readFileSync(filename, "utf8");
                            var expected =
                                '<?xml version="1.0" encoding="utf-8"?>\n' +
                                '<xliff version="2.0" srcLang="en-US" xmlns:l="http://ilib-js.com/loctool">\n' +
                                '  <file original="res/values/strings.xml" l:project="loctest">\n' +
                                '    <group id="group_1" name="x-android-resource">\n' +
                                '      <unit id="1" name="app_id" type="res:string" l:datatype="x-android-resource">\n' +
                                '        <notes>\n' +
                                '          <note appliesTo="source">Do not translate</note>\n' +
                                '        </notes>\n' +
                                '        <segment>\n' +
                                '          <source>151779581544891</source>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="2" name="noSource" type="res:array" l:datatype="x-android-resource" l:index="0">\n' +
                                '        <segment>\n' +
                                '          <source>a</source>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="3" name="noSource" type="res:array" l:datatype="x-android-resource" l:index="1">\n' +
                                '        <segment>\n' +
                                '          <source>b</source>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="4" name="noSource" type="res:array" l:datatype="x-android-resource" l:index="3">\n' +
                                '        <segment>\n' +
                                '          <source>c</source>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '      <unit id="5" name="foobar" type="res:string" l:datatype="x-android-resource">\n' +
                                '        <segment>\n' +
                                '          <source>{count, plural, one {%d friend commented} other {%d friends commented}}</source>\n' +
                                '        </segment>\n' +
                                '      </unit>\n' +
                                '    </group>\n' +
                                '  </file>\n' +
                                '</xliff>';
                            expect(actual).toBe(expected);
                        });
                    });
                });
            });
        });
    });

    test("ProjectIsResourcePathYes", function() {
        expect.assertions(1);
        var project = ProjectFactory('./test/testfiles', {});
        expect(project.isResourcePath("js", "test/testfiles/public/localized_js/file.js")).toBeTruthy();
    });
    test("ProjectIsResourcePathNo", function() {
        expect.assertions(1);
        var project = ProjectFactory('./test/testfiles', {});
        expect(!project.isResourcePath("js", "test/testfiles/public/file.js")).toBeTruthy();
    });
    test("ProjectIsResourcePathNoTargetPath", function() {
        expect.assertions(1);
        var project = ProjectFactory('./test/testfiles', {});
        expect(!project.isResourcePath("js", "public/localized_js/file.js")).toBeTruthy();
    });
    test("ProjectIsResourcePathSubpath", function() {
        expect.assertions(1);
        var project = ProjectFactory('./test/testfiles', {});
        expect(project.isResourcePath("js", "test/testfiles/public/localized_js/zh/Hant/TW/file.js")).toBeTruthy();
    });
    test("ProjectIsResourcePathAnyFileName", function() {
        expect.assertions(1);
        var project = ProjectFactory('./test/testfiles', {});
        expect(project.isResourcePath("js", "test/testfiles/public/localized_js/resources.json")).toBeTruthy();
    });

    test("GetOutputLocaleMapped", function() {
        expect.assertions(1);
        var project = ProjectFactory('./test/testfiles', {
            localeMap: {
                "da-DK": "da",
                "pt-BR": "pt"
            }
        });
        expect(project.getOutputLocale("da-DK")).toBe("da");
    });
    test("GetOutputLocaleNotMapped", function() {
        expect.assertions(1);
        var project = ProjectFactory('./test/testfiles', {
            localeMap: {
                "da-DK": "da",
                "pt-BR": "pt"
            }
        });
        expect(project.getOutputLocale("da-DE")).toBe("da-DE");
    });
    test("GetOutputLocaleNoMap", function() {
        expect.assertions(1);
        var project = ProjectFactory('./test/testfiles', {});
        expect(project.getOutputLocale("da-DK")).toBe("da-DK");
    });
    test("GetOutputLocaleBogusMap", function() {
        expect.assertions(3);
        var project = ProjectFactory('./test/testfiles', {
            localeMap: {
                "da-DK": undefined,
                "pt-BR": null,
                "de-DE": ""
            }
        });
        expect(project.getOutputLocale("da-DK")).toBe("da-DK");
        expect(project.getOutputLocale("pt-BR")).toBe("pt-BR");
        expect(project.getOutputLocale("de-DE")).toBe("de-DE");
    });
    test("GetOutputLocaleInherit", function() {
        expect.assertions(2);
        var project = ProjectFactory('./test/testfiles', {
            localeInherit: {
                "en-AU": "en-GB",
                "en-CN": "en-GB"
            }
        });
        expect(project.getLocaleInherit("en-AU")).toBe("en-GB");
        expect(project.getLocaleInherit("en-CN")).toBe("en-GB");
    });
    test("GetOutputLocaleInheritEmpty", function() {
        expect.assertions(2);
        var project = ProjectFactory('./test/testfiles', {
            localeInherit: {
                "en-AU": "en-GB",
                "en-CN": "en-GB"
            }
        });
        expect(project.getLocaleInherit("ko-KR")).toBeUndefined();
        expect(project.getLocaleInherit()).toBeUndefined();
    });
    test("GetOutputLocaleInheritEmpty2", function() {
        expect.assertions(2);
        var project = ProjectFactory('./test/testfiles', {});
        expect(project.getLocaleInherit("ko-KR")).toBeUndefined();
        expect(project.getLocaleInherit()).toBeUndefined();
    });

    test("GetProjectType", function() {
        expect.assertions(1);
        var project = ProjectFactory('./test/testfiles', {});
        expect(project.getProjectType()).toBe("web");
    });

    test("GetProjectTypeCustom", function() {
        expect.assertions(1);
        var options = {
            rootDir: ".",
            projectType: "custom"
        };
        var project = ProjectFactory.newProject(options);
        expect(project.getProjectType()).toBe("custom");
    });

    test("Project creation supports translationsDir option", function() {
        expect.assertions(1);
        var options = {
            rootDir: "./test/testfiles/project2",
            projectType: "custom",
            translationsDir: "res"
        };
        var project = ProjectFactory.newProject(options);
        expect(project.translationsDir).toStrictEqual(["test/testfiles/project2/res"]);
    });

    test("Project creation still supports the deprecated xliffsDir option", function() {
        expect.assertions(1);
        var options = {
            rootDir: "./test/testfiles/project2",
            projectType: "custom",
            xliffsDir: "res"
        };
        var project = ProjectFactory.newProject(options);
        expect(project.translationsDir).toStrictEqual(["test/testfiles/project2/res"]);
    });

    test("Project creation supports translationsDir using the settings", function() {
        expect.assertions(1);
        var settings = {
            projectType: "custom",
            translationsDir: "xliffs"
        }
        var project = ProjectFactory('./test/testfiles', settings);
        expect(project.translationsDir).toStrictEqual(["test/testfiles/xliffs"]);
    });

    test("Project creation still supports the deprecated xliffsDir using the settings", function() {
        expect.assertions(1);
        var settings = {
            projectType: "custom",
            xliffsDir: "xliffs"
        }
        var project = ProjectFactory('./test/testfiles', settings);
        expect(project.translationsDir).toStrictEqual(["test/testfiles/xliffs"]);
    });

    test("isSourceLocale returns true when locale matches source locale", function() {
        expect.assertions(1);
        var project = ProjectFactory.newProject({
            rootDir: "./test/testfiles",
            projectType: "custom",
            sourceLocale: "en-US"
        });
        expect(project.isSourceLocale("en-US")).toBe(true);
    });

    test("isSourceLocale returns true when locale matches source locale with only language", function() {
        expect.assertions(1);
        var project = ProjectFactory.newProject({
            rootDir: "./test/testfiles",
            projectType: "custom",
            sourceLocale: "en"
        });
        expect(project.isSourceLocale("en")).toBe(true);
    });

    test("isSourceLocale returns false when locale has different language", function() {
        expect.assertions(1);
        var project = ProjectFactory.newProject({
            rootDir: "./test/testfiles",
            projectType: "custom",
            sourceLocale: "en-US"
        });
        expect(project.isSourceLocale("de-DE")).toBe(false);
    });

    test("isSourceLocale returns false when locale has different region", function() {
        expect.assertions(1);
        var project = ProjectFactory.newProject({
            rootDir: "./test/testfiles",
            projectType: "custom",
            sourceLocale: "en-US"
        });
        expect(project.isSourceLocale("en-GB")).toBe(false);
    });

    test("isSourceLocale returns false when locale has different script", function() {
        expect.assertions(1);
        var project = ProjectFactory.newProject({
            rootDir: "./test/testfiles",
            projectType: "custom",
            sourceLocale: "zh-Hans-CN"
        });
        expect(project.isSourceLocale("zh-Hant-CN")).toBe(false);
    });

    test("isSourceLocale returns false when locale has a variant but source does not", function() {
        expect.assertions(1);
        var project = ProjectFactory.newProject({
            rootDir: "./test/testfiles",
            projectType: "custom",
            sourceLocale: "en"
        });
        // Variant "pseudo" does not match undefined, so this returns false
        expect(project.isSourceLocale("en-pseudo")).toBe(false);
    });

    test("isSourceLocale returns false for locale with variant when source has no variant", function() {
        expect.assertions(1);
        var project = ProjectFactory.newProject({
            rootDir: "./test/testfiles",
            projectType: "custom",
            sourceLocale: "en-US"
        });
        // Variant "pseudo" does not match undefined, so this returns false
        expect(project.isSourceLocale("en-US-pseudo")).toBe(false);
    });

    test("isSourceLocale returns false for flavor variant when source has no variant", function() {
        expect.assertions(1);
        var project = ProjectFactory.newProject({
            rootDir: "./test/testfiles",
            projectType: "custom",
            sourceLocale: "en-US"
        });
        // isSourceLocale checks exact match including variant
        // Flavor handling is done in the file type classes, not here
        expect(project.isSourceLocale("en-US-CHOCOLATE")).toBe(false);
    });

    test("isSourceLocale returns true when both locale and source have same variant", function() {
        expect.assertions(1);
        var project = ProjectFactory.newProject({
            rootDir: "./test/testfiles",
            projectType: "custom",
            sourceLocale: "en-US-variant"
        });
        expect(project.isSourceLocale("en-US-variant")).toBe(true);
    });

    test("isSourceLocale returns false when locale and source have different variants", function() {
        expect.assertions(1);
        var project = ProjectFactory.newProject({
            rootDir: "./test/testfiles",
            projectType: "custom",
            sourceLocale: "en-US-variant1"
        });
        expect(project.isSourceLocale("en-US-variant2")).toBe(false);
    });

    test("isSourceLocale returns false when source has variant but locale does not", function() {
        expect.assertions(1);
        var project = ProjectFactory.newProject({
            rootDir: "./test/testfiles",
            projectType: "custom",
            sourceLocale: "en-US-variant"
        });
        expect(project.isSourceLocale("en-US")).toBe(false);
    });
});
