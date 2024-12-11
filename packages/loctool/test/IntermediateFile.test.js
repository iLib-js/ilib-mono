/*
 * IntermediateFile.test.js - test the abstraction layer for intermediate files
 *
 * Copyright © 2024 Box, Inc.
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
var fs = require("fs");
var ToolsCommon = require("ilib-tools-common");

var getIntermediateFile = require("../lib/IntermediateFileFactory.js");
var TranslationSet = require("../lib/TranslationSet.js");
var ResourceFactory = require("../lib/ResourceFactory.js");

describe("intermediate file", function() {
    afterEach(function() {
        if (fs.existsSync("test/testfiles/foo.xliff")) {
            fs.unlinkSync("test/testfiles/foo.xliff");
        }
        if (fs.existsSync("test/testfiles/foo.po")) {
            fs.unlinkSync("test/testfiles/foo.po");
        }
    });

    test("test writing an intermediate file in xliff format", function() {
        expect.assertions(1);

        var set = new TranslationSet();
        set.add(ResourceFactory({
            resType: "string",
            project: "foo",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "resources/en/US/foo.json",
            datatype: "json",
            context: "foo",
            key: "foo",
            source: "bar",
            target: "baz",
            state: "new",
            comment: "foo bar",
            autoKey: false
        }));

        var file = getIntermediateFile({
            path: "test/testfiles/foo.xliff"
        });

        file.write(set);

        expect(fs.existsSync("test/testfiles/foo.xliff")).toBe(true);
    });

    test("test writing an intermediate file in xliff format has the right contents", function() {
        expect.assertions(1);

        var set = new TranslationSet();
        set.add(ResourceFactory({
            resType: "string",
            project: "foobar",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "resources/en/US/foo.json",
            datatype: "json",
            context: "foo",
            key: "foo",
            source: "bar",
            target: "baz",
            state: "new",
            comment: "foo bar",
            autoKey: false
        }));
        set.add(ResourceFactory({
            resType: "plural",
            project: "foobar",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "resources/en/US/foo.json",
            datatype: "json",
            context: "foo",
            key: "asdf",
            sourcePlurals: {
                one: "bar",
                other: "bars"
            },
            targetPlurals: {
                one: "baz",
                other: "bazzes"
            },
            state: "new",
            comment: "foo bar",
            autoKey: false
        }));
        set.add(ResourceFactory({
            resType: "array",
            project: "foobar",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "resources/en/US/foo.json",
            datatype: "json",
            context: "foo",
            key: "asdf",
            sourceArray: ["bar", "baz"],
            targetArray: ["baz", "bazzes"],
            state: "new",
            comment: "foo bar",
            autoKey: false
        }));

        var file = getIntermediateFile({
            path: "test/testfiles/foo.xliff",
        });

        file.write(set);

        var data = fs.readFileSync("test/testfiles/foo.xliff", "utf-8");
        var expected = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<xliff version="1.2">\n' +
            '  <file original="resources/en/US/foo.json" source-language="en-US" target-language="fr-FR" product-name="foobar">\n' +
            '    <body>\n' +
            '      <trans-unit id="1" resname="foo" restype="string" datatype="json" x-context="foo">\n' +
            '        <source>bar</source>\n' +
            '        <target state="new">baz</target>\n' +
            '        <note>foo bar</note>\n' +
            '      </trans-unit>\n' +
            '      <trans-unit id="2" resname="asdf" restype="plural" datatype="json" extype="one" x-context="foo">\n' +
            '        <source>bar</source>\n' +
            '        <target state="new">baz</target>\n' +
            '        <note>foo bar</note>\n' +
            '      </trans-unit>\n' +
            '      <trans-unit id="3" resname="asdf" restype="plural" datatype="json" extype="other" x-context="foo">\n' +
            '        <source>bars</source>\n' +
            '        <target state="new">bazzes</target>\n' +
            '        <note>foo bar</note>\n' +
            '      </trans-unit>\n' +
            '      <trans-unit id="4" resname="asdf" restype="array" datatype="json" extype="0" x-context="foo">\n' +
            '        <source>bar</source>\n' +
            '        <target state="new">baz</target>\n' +
            '        <note>foo bar</note>\n' +
            '      </trans-unit>\n' +
            '      <trans-unit id="5" resname="asdf" restype="array" datatype="json" extype="1" x-context="foo">\n' +
            '        <source>baz</source>\n' +
            '        <target state="new">bazzes</target>\n' +
            '        <note>foo bar</note>\n' +
            '      </trans-unit>\n' +
            '    </body>\n' +
            '  </file>\n' +
            '</xliff>';
        expect(data).toBe(expected);
    });

    test("test reading an intermediate file in xliff format", function() {
        expect.assertions(40);

        var data = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<xliff version="1.2">\n' +
            '  <file original="resources/en/US/foo.json" source-language="en-US" target-language="fr-FR" product-name="foobar">\n' +
            '    <body>\n' +
            '      <trans-unit id="1" resname="foo" restype="string" datatype="json" x-context="foo">\n' +
            '        <source>bar</source>\n' +
            '        <target state="new">baz</target>\n' +
            '        <note>foo bar</note>\n' +
            '      </trans-unit>\n' +
            '      <trans-unit id="2" resname="asdf" restype="plural" datatype="json" extype="one" x-context="foo">\n' +
            '        <source>bar</source>\n' +
            '        <target state="new">baz</target>\n' +
            '        <note>foo bar</note>\n' +
            '      </trans-unit>\n' +
            '      <trans-unit id="3" resname="asdf" restype="plural" datatype="json" extype="other" x-context="foo">\n' +
            '        <source>bars</source>\n' +
            '        <target state="new">bazzes</target>\n' +
            '        <note>foo bar</note>\n' +
            '      </trans-unit>\n' +
            '      <trans-unit id="4" resname="asdf" restype="array" datatype="json" extype="0" x-context="foo">\n' +
            '        <source>bar</source>\n' +
            '        <target state="new">baz</target>\n' +
            '        <note>foo bar</note>\n' +
            '      </trans-unit>\n' +
            '      <trans-unit id="5" resname="asdf" restype="array" datatype="json" extype="1" x-context="foo">\n' +
            '        <source>baz</source>\n' +
            '        <target state="new">bazzes</target>\n' +
            '        <note>foo bar</note>\n' +
            '      </trans-unit>\n' +
            '    </body>\n' +
            '  </file>\n' +
            '</xliff>';

        fs.writeFileSync("test/testfiles/foo.xliff", data, "utf-8");

        var file = getIntermediateFile({
            path: "test/testfiles/foo.xliff"
        });

        var set = file.read();

        expect(set.size()).toBe(3);
        var resources = set.getAll();

        var res = resources[0];
        expect(res.getType()).toBe("string");
        expect(res.getProject()).toBe("foobar");
        expect(res.getSourceLocale()).toBe("en-US");
        expect(res.getTargetLocale()).toBe("fr-FR");
        expect(res.getPath()).toBe("resources/en/US/foo.json");
        expect(res.getDataType()).toBe("json");
        expect(res.getContext()).toBe("foo");
        expect(res.getKey()).toBe("foo");
        expect(res.getSource()).toBe("bar");
        expect(res.getTarget()).toBe("baz");
        expect(res.getState()).toBe("new");
        expect(res.getComment()).toBe("foo bar");
        expect(res.getAutoKey()).toBe(false);

        res = resources[1];

        expect(res.getType()).toBe("plural");
        expect(res.getProject()).toBe("foobar");
        expect(res.getSourceLocale()).toBe("en-US");
        expect(res.getTargetLocale()).toBe("fr-FR");
        expect(res.getPath()).toBe("resources/en/US/foo.json");
        expect(res.getDataType()).toBe("json");
        expect(res.getContext()).toBe("foo");
        expect(res.getKey()).toBe("asdf");
        expect(res.getSourcePlurals()).toStrictEqual({ one: "bar", other: "bars" });
        expect(res.getTargetPlurals()).toStrictEqual({ one: "baz", other: "bazzes" });
        expect(res.getState()).toBe("new");
        expect(res.getComment()).toBe("foo bar");
        expect(res.getAutoKey()).toBe(false);

        res = resources[2];

        expect(res.getType()).toBe("array");
        expect(res.getProject()).toBe("foobar");
        expect(res.getSourceLocale()).toBe("en-US");
        expect(res.getTargetLocale()).toBe("fr-FR");
        expect(res.getPath()).toBe("resources/en/US/foo.json");
        expect(res.getDataType()).toBe("json");
        expect(res.getContext()).toBe("foo");
        expect(res.getKey()).toBe("asdf");
        expect(res.getSourceArray()).toStrictEqual(["bar", "baz"]);
        expect(res.getTargetArray()).toStrictEqual(["baz", "bazzes"]);
        expect(res.getState()).toBe("new");
        expect(res.getComment()).toBe("foo bar");
        expect(res.getAutoKey()).toBe(false);
    });

    test("test writing an intermediate file in PO format", function() {
        expect.assertions(1);

        var set = new TranslationSet();
        set.add(ResourceFactory({
            resType: "string",
            project: "foo",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "resources/en/US/foo.json",
            datatype: "json",
            context: "foo",
            key: "foo",
            source: "bar",
            target: "baz",
            state: "new",
            comment: "foo bar",
            autoKey: false
        }));

        var file = getIntermediateFile({
            path: "test/testfiles/foo.po"
        });

        file.write(set);

        expect(fs.existsSync("test/testfiles/foo.po")).toBe(true);
    });

    test("test writing an intermediate file in PO format has the right contents", function() {
        expect.assertions(1);

        var set = new TranslationSet();
        set.add(ResourceFactory({
            resType: "string",
            project: "foobar",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "resources/en/US/foo.json",
            datatype: "json",
            context: "foo",
            key: "asdfasdf",
            source: "bar",
            target: "baz",
            state: "new",
            comment: "foo bar",
            autoKey: false
        }));
        set.add(ResourceFactory({
            resType: "plural",
            project: "foobar",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "resources/en/US/foo.json",
            datatype: "json",
            context: "foo",
            key: "asdf",
            sourcePlurals: {
                one: "bar",
                other: "bars"
            },
            targetPlurals: {
                one: "baz",
                other: "bazzes"
            },
            state: "new",
            comment: "foo bar",
            autoKey: false
        }));
        set.add(ResourceFactory({
            resType: "array",
            project: "foobar",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "resources/en/US/foo.json",
            datatype: "json",
            context: "foo",
            key: "fdsa",
            sourceArray: ["bar", "baz"],
            targetArray: ["baz", "bazzes"],
            state: "new",
            comment: "foo bar",
            autoKey: false
        }));

        var file = getIntermediateFile({
            path: "test/testfiles/foo.po",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            project: "foobar",
            datatype: "json"
        });

        file.write(set);

        var data = fs.readFileSync("test/testfiles/foo.po", "utf-8");
        var expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  test/testfiles/foo.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: fr-FR\\n"\n' +
            '"Plural-Forms: nplurals=2; plural=n>1;\\n"\n' +
            '"Data-Type: json\\n"\n' +
            '"Project: foobar\\n"\n' +
            '\n' +
            '#. foo bar\n' +
            '#: resources/en/US/foo.json\n' +
            '#k asdfasdf\n' +
            'msgctxt "foo"\n' +
            'msgid "bar"\n' +
            'msgstr "baz"\n' +
            '\n' +
            '#. foo bar\n' +
            '#: resources/en/US/foo.json\n' +
            '#k asdf\n' +
            'msgctxt "foo"\n' +
            'msgid "bar"\n' +
            'msgid_plural "bars"\n' +
            'msgstr[0] "baz"\n' +
            'msgstr[1] "bazzes"\n' +
            '\n' +
            '#. foo bar\n' +
            '#: resources/en/US/foo.json\n' +
            'msgctxt "foo"\n' +
            '#k fdsa\n' +
            '## 0\n' +
            'msgid "bar"\n' +
            'msgstr "baz"\n' +
            '\n' +
            '#k fdsa\n' +
            '## 1\n' +
            'msgid "baz"\n' +
            'msgstr "bazzes"\n';
        expect(data).toBe(expected);
    });

    test("test reading an intermediate file in PO format", function() {
        expect.assertions(40);

        var data =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  test/testfiles/foo.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: fr-FR\\n"\n' +
            '"Plural-Forms: nplurals=2; plural=n>1;\\n"\n' +
            '"Data-Type: json\\n"\n' +
            '"Project: manhattan\\n"\n' +
            '\n' +
            '#. foo bar\n' +
            '#: resources/en/US/foo.json\n' +
            '#k asdfasdf\n' +
            'msgctxt "foo"\n' +
            'msgid "bar"\n' +
            'msgstr "baz"\n' +
            '\n' +
            '#. foo bar\n' +
            '#: resources/en/US/foo.json\n' +
            '#k asdf\n' +
            'msgctxt "foo"\n' +
            'msgid "bar"\n' +
            'msgid_plural "bars"\n' +
            'msgstr[0] "baz"\n' +
            'msgstr[1] "bazzes"\n' +
            '\n' +
            '#. foo bar\n' +
            '#: resources/en/US/foo.json\n' +
            'msgctxt "foo"\n' +
            '#k fdsa\n' +
            '## 0\n' +
            'msgid "bar"\n' +
            'msgstr "baz"\n' +
            '\n' +
            '#k fdsa\n' +
            '## 1\n' +
            'msgid "baz"\n' +
            'msgstr "bazzes"\n';

        fs.writeFileSync("test/testfiles/foo.po", data, "utf-8");

        var file = getIntermediateFile({
            path: "test/testfiles/foo.po",
            datatype: "json"
        });

        var set = file.read();

        expect(set.size()).toBe(3);
        var resources = set.getAll();

        var res = resources[0];
        expect(res.getType()).toBe("string");
        expect(res.getProject()).toBe("manhattan");
        expect(res.getSourceLocale()).toBe("en-US");
        expect(res.getTargetLocale()).toBe("fr-FR");
        expect(res.getPath()).toBe("resources/en/US/foo.json");
        expect(res.getDataType()).toBe("json");
        expect(res.getContext()).toBe("foo");
        expect(res.getKey()).toBe("asdfasdf");
        expect(res.getSource()).toBe("bar");
        expect(res.getTarget()).toBe("baz");
        expect(res.getState()).toBe("new");
        expect(res.getComment()).toBe("{\"extracted\":[\"foo bar\"],\"paths\":[\"resources/en/US/foo.json\"]}");
        expect(res.getAutoKey()).toBe(false);

        res = resources[1];

        expect(res.getType()).toBe("plural");
        expect(res.getProject()).toBe("manhattan");
        expect(res.getSourceLocale()).toBe("en-US");
        expect(res.getTargetLocale()).toBe("fr-FR");
        expect(res.getPath()).toBe("resources/en/US/foo.json");
        expect(res.getDataType()).toBe("json");
        expect(res.getContext()).toBe("foo");
        expect(res.getKey()).toBe("asdf");
        expect(res.getSourcePlurals()).toStrictEqual({ one: "bar", other: "bars" });
        expect(res.getTargetPlurals()).toStrictEqual({ one: "baz", other: "bazzes" });
        expect(res.getState()).toBe("new");
        expect(res.getComment()).toBe("{\"extracted\":[\"foo bar\"],\"paths\":[\"resources/en/US/foo.json\"]}");
        expect(res.getAutoKey()).toBe(false);

        res = resources[2];

        expect(res.getType()).toBe("array");
        expect(res.getProject()).toBe("manhattan");
        expect(res.getSourceLocale()).toBe("en-US");
        expect(res.getTargetLocale()).toBe("fr-FR");
        expect(res.getPath()).toBe("resources/en/US/foo.json");
        expect(res.getDataType()).toBe("json");
        expect(res.getContext()).toBe("foo");
        expect(res.getKey()).toBe("fdsa");
        expect(res.getSourceArray()).toStrictEqual(["bar", "baz"]);
        expect(res.getTargetArray()).toStrictEqual(["baz", "bazzes"]);
        expect(res.getState()).toBe("new");
        expect(res.getComment()).toBe("{\"extracted\":[\"foo bar\"],\"paths\":[\"resources/en/US/foo.json\"]}");
        expect(res.getAutoKey()).toBe(false);
    });
});
