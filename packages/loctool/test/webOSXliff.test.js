/*
 * webOSXliff.test.js - test the webOSXliff object.
 *
  * Copyright © 2025, JEDLSoft
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

var webOSXliff = require("../lib/webOSXliff.js");
var ResourceString = require("../lib/ResourceString.js");
var XliffMerge = require("../lib/XliffMerge.js");
var XliffSplit = require("../lib/XliffSplit.js");

describe("webOSxliff", function() {
    test("webOSXliffConstructor", function() {
        expect.assertions(1);
        var x = new webOSXliff();
        expect(x).toBeTruthy();
    });
    test("webOSXliffConstructorIsEmpty", function() {
        expect.assertions(2);
        var x = new webOSXliff();
        expect(x).toBeTruthy();
        expect(x.size()).toBe(0);
    });
    test("webOSXliffVersion", function() {
        expect.assertions(2);
        var x = new webOSXliff();
        expect(x).toBeTruthy();
        expect(x.getVersion()).toBe(2.0);
    });
    test("webOSXliffConstructorFull", function() {
        expect.assertions(5);
        var x = new webOSXliff({
            project: "test-project",
            sourceLocale: "en-KR",
            version: "2",
            path: "a/b/c.xliff"
        });
        expect(x).toBeTruthy();

        expect(x["project"]).toBe("test-project");
        expect(x["sourceLocale"]).toBe("en-KR");
        expect(x["version"]).toBe(2);
        expect(x.path).toBe("a/b/c.xliff");
    });
    test("webOSXliffGetPath", function() {
        expect.assertions(2);
        var x = new webOSXliff({
            path: "foo/bar/x.xliff"
        });
        expect(x).toBeTruthy();
        expect(x.getPath()).toBe("foo/bar/x.xliff");
    });
    test("webOSXliffSetPath", function() {
        expect.assertions(3);
        var x = new webOSXliff({
            path: "foo/bar/x.xliff"
        });
        expect(x).toBeTruthy();
        expect(x.getPath()).toBe("foo/bar/x.xliff");
        x.setPath("asdf/asdf/y.xliff");
        expect(x.getPath()).toBe("asdf/asdf/y.xliff");
    });
    test("webOSXliffSetPathInitiallyEmpty", function() {
        expect.assertions(3);
        var x = new webOSXliff();
        expect(x).toBeTruthy();
        expect(!x.getPath()).toBeTruthy();
        x.setPath("asdf/asdf/y.xliff");
        expect(x.getPath()).toBe("asdf/asdf/y.xliff");
    });
    test("webOSXliffAddResource", function() {
        expect.assertions(11);
        var x = new webOSXliff();
        expect(x).toBeTruthy();
        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-KR",
            key: "foobar",
            pathName: "foo/bar/asdf.js",
            autoKey: false,
            state: "new",
            context: "asdf",
            comment: "this is a comment",
            project: "webapp"
        });

        x.addResource(res);
        var reslist = x.getResources({
            reskey: "foobar"
        });

        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(1);
        expect(reslist[0].getSource()).toBe("Asdf asdf");
        expect(reslist[0].getSourceLocale()).toBe("en-KR");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.js");
        expect(reslist[0].getState()).toBe("new");
        expect(reslist[0].getContext()).toBe("asdf");
        expect(reslist[0].getComment()).toBe("this is a comment");
        expect(reslist[0].getProject()).toBe("webapp");
    });
    test("webOSXliffSize", function() {
        expect.assertions(3);
        var x = new webOSXliff();
        expect(x).toBeTruthy();
        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-KR",
            key: "foobar",
            pathName: "foo/bar/asdf.js",
            autoKey: false,
            state: "new",
            context: "asdf",
            comment: "this is a comment",
            project: "webapp"
        });

        expect(x.size()).toBe(0);
        x.addResource(res);
        expect(x.size()).toBe(1);
    });
    test("webOSXliffAddMultipleResources", function() {
        expect.assertions(8);
        var x = new webOSXliff();
        expect(x).toBeTruthy();

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-KR",
            key: "foobar",
            pathName: "foo/bar/asdf.js",
            project: "webapp"
        });

        x.addResource(res);
        res = new ResourceString({
            source: "baby baby",
            sourceLocale: "en-KR",
            key: "huzzah",
            pathName: "foo/bar/asdf.js",
            project: "webapp"
        });

        x.addResource(res);
        var reslist = x.getResources({
            reskey: "foobar"
        });

        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(1);
        expect(reslist[0].getSource()).toBe("Asdf asdf");
        expect(reslist[0].getSourceLocale()).toBe("en-KR");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.js");
        expect(reslist[0].getProject()).toBe("webapp");
    });
    test("webOSXliffAddMultipleResourcesRightSize", function() {
        expect.assertions(3);
        var x = new webOSXliff();
        expect(x).toBeTruthy();
        expect(x.size()).toBe(0);

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-KR",
            key: "foobar",
            pathName: "foo/bar/asdf.js",
            project: "webapp"
        });

        x.addResource(res);
        res = new ResourceString({
            source: "baby baby",
            sourceLocale: "en-KR",
            key: "huzzah",
            pathName: "foo/bar/j.js",
            project: "webapp"
        });

        x.addResource(res);
        expect(x.size()).toBe(2);
    });
    test("webOSXliffAddMultipleResourcesOverwrite", function() {
        expect.assertions(9);
        var x = new webOSXliff();
        expect(x).toBeTruthy();

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-KR",
            key: "foobar",
            pathName: "foo/bar/asdf.js",
            project: "webapp"
        });

        x.addResource(res);

        // this one has the same source, locale, key, and file
        // so it should overwrite the one above
        res = new ResourceString({
            source: "baby baby",
            sourceLocale: "en-KR",
            key: "foobar",
            pathName: "foo/bar/asdf.js",
            comment: "blah blah blah",
            project: "webapp"
        });

        x.addResource(res);

        var reslist = x.getResources({
            reskey: "foobar"
        });

        expect(reslist).toBeTruthy();

        expect(reslist.length).toBe(1);
        expect(reslist[0].getSource()).toBe("baby baby");
        expect(reslist[0].getSourceLocale()).toBe("en-KR");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.js");
        expect(reslist[0].getProject()).toBe("webapp");
        expect(reslist[0].getComment()).toBe("blah blah blah");
    });

    test("webOSXliffAddMultipleResourcesOverwriteRightSize", function() {
        expect.assertions(4);
        var x = new webOSXliff();
        expect(x).toBeTruthy();

        expect(x.size()).toBe(0);

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-KR",
            key: "foobar",
            pathName: "foo/bar/asdf.js",
            project: "webapp"
        });

        x.addResource(res);

        expect(x.size()).toBe(1);

        // this one has the same source, locale, key, and file
        // so it should overwrite the one above
        res = new ResourceString({
            source: "baby baby",
            sourceLocale: "en-KR",
            key: "foobar",
            pathName: "foo/bar/asdf.js",
            comment: "blah blah blah",
            project: "webapp"
        });

        x.addResource(res);

        expect(x.size()).toBe(1);
    });
    test("webOSXliffAddMultipleResourcesNoOverwrite", function() {
        expect.assertions(13);
        var x = new webOSXliff();
        expect(x).toBeTruthy();

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-KR",
            key: "foobar",
            pathName: "foo/bar/asdf.js",
            project: "webapp"
        });

        x.addResource(res);

        // this one has a different locale
        // so it should not overwrite the one above
        res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "fr-FR",
            key: "foobar",
            pathName: "foo/bar/asdf.js",
            comment: "blah blah blah",
            project: "webapp"
        });

        x.addResource(res);

        var reslist = x.getResources({
            reskey: "foobar"
        });

        expect(reslist).toBeTruthy();

        expect(reslist.length).toBe(2);

        expect(reslist[0].getSource()).toBe("Asdf asdf");
        expect(reslist[0].getSourceLocale()).toBe("en-KR");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.js");
        expect(!reslist[0].getComment()).toBeTruthy();

        expect(reslist[1].getSource()).toBe("Asdf asdf");
        expect(reslist[1].getSourceLocale()).toBe("fr-FR");
        expect(reslist[1].getKey()).toBe("foobar");
        expect(reslist[1].getPath()).toBe("foo/bar/asdf.js");
        expect(reslist[1].getComment()).toBe("blah blah blah");
    });
    test("webOSXliffAddResourceDontAddSourceLocaleAsTarget", function() {
        expect.assertions(2);

        var x = new webOSXliff({
            sourceLocale: "en-KR"
        });
        expect(x).toBeTruthy();

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-KR",
            key: "foobar",
            pathName: "foo/bar/asdf.js",
            project: "webapp"
        });

        x.addResource(res);

        // should not add this one
        res = new ResourceString({
            source: "baby baby",
            target: "babes babes",
            targetLocale: "en-KR",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "webapp",
            origin: "target"
        });
        
        x.addResource(res);
        expect(x.size()).toBe(1);
    });
    test("webOSXliffGetResourcesMultiple", function() {
        expect.assertions(11);
        var x = new webOSXliff();
        expect(x).toBeTruthy();

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-KR",
            key: "foobar",
            pathName: "foo/bar/asdf.js",
            project: "webapp",
            origin: "source"
        });

        x.addResource(res);
        res = new ResourceString({
            source: "baby baby",
            sourceLocale: "en-KR",
            key: "huzzah",
            pathName: "foo/bar/j.js",
            project: "webapp",
            origin: "origin"
        });

        x.addResource(res);

        var reslist = x.getResources({
            sourceLocale: "en-KR"
        });

        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(2);

        expect(reslist[0].getSource()).toBe("Asdf asdf");
        expect(reslist[0].getSourceLocale()).toBe("en-KR");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.js");

        expect(reslist[1].getSource()).toBe("baby baby");
        expect(reslist[1].getSourceLocale()).toBe("en-KR");
        expect(reslist[1].getKey()).toBe("huzzah");
        expect(reslist[1].getPath()).toBe("foo/bar/j.js");
    });

    test("webOSXliffDeserializeTest", function() {
        expect.assertions(24);

        var x = new webOSXliff();
        expect(x).toBeTruthy();

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" version="2.0" srcLang="en-KR" trgLang="ko-KR">\n' +
                '  <file id="f1" original="foo/bar/asdf.java" >\n' +
                '    <group id="g1" name="javascript">\n' +
                '      <unit id="1">\n' +
                '        <segment>\n' +
                '          <source>Closed Caption Settings</source>\n' +
                '          <target>자막 설정</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '      <unit id="2">\n' +
                '        <segment>\n' +
                '          <source>Low</source>\n' +
                '          <target>낮음</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();

        expect(reslist).toBeTruthy();

        expect(reslist[0].getSource()).toBe("Closed Caption Settings");
        expect(reslist[0].getSourceLocale()).toBe("en-KR");
        expect(reslist[0].getTarget()).toBe("자막 설정");
        expect(reslist[0].getTargetLocale()).toBe("ko-KR");
        expect(reslist[0].getKey()).toBe("Closed Caption Settings");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("foo/bar/asdf.java");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].datatype).toBe("javascript");
        expect(!reslist[0].getComment()).toBeTruthy();
        expect(reslist[0].getId()).toBe("1");

        expect(reslist[1].getSource()).toBe("Low");
        expect(reslist[1].getSourceLocale()).toBe("en-KR");
        expect(reslist[1].getTarget()).toBe("낮음");
        expect(reslist[1].getTargetLocale()).toBe("ko-KR");
        expect(reslist[1].getKey()).toBe("Low");
        expect(reslist[1].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[1].getProject()).toBe("foo/bar/asdf.java");
        expect(reslist[1].resType).toBe("string");
        expect(reslist[1].datatype).toBe("javascript");
        expect(!reslist[1].getComment()).toBeTruthy();
        expect(reslist[1].getId()).toBe("2");
    });

    test("webOSXliffDeserializeRealFile", function() {
        expect.assertions(37);

        var x = new webOSXliff();
        expect(x).toBeTruthy();

        var fs = require("fs");
        var str = fs.readFileSync("test/testfiles/xliff_webOS/ko-KR.xliff", "utf-8");
        x.deserialize(str);

        var reslist = x.getResources();
        expect(reslist).toBeTruthy();
        expect(reslist.length).toBe(7);

        expect(reslist[0].getSource()).toBe("Closed Caption Settings");
        expect(reslist[0].getSourceLocale()).toBe("en-KR");
        expect(reslist[0].getTarget()).toBe("자막 설정");
        expect(reslist[0].getTargetLocale()).toBe("ko-KR");
        expect(reslist[0].getKey()).toBe("Closed Caption Settings");
        expect(reslist[0].getPath()).toBe("settings");
        expect(reslist[0].getProject()).toBe("settings");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].datatype).toBe("javascript");
        expect(!reslist[0].getComment()).toBeTruthy();
        expect(reslist[0].getId()).toBe("settings_1");

        expect(reslist[3].getSource()).toBe("Low");
        expect(reslist[3].getSourceLocale()).toBe("en-KR");
        expect(reslist[3].getTarget()).toBe("낮음");
        expect(reslist[3].getTargetLocale()).toBe("ko-KR");
        expect(reslist[3].getKey()).toBe("pictureControlLow_Male");
        expect(reslist[3].getPath()).toBe("settings");
        expect(reslist[3].getProject()).toBe("settings");
        expect(reslist[3].resType).toBe("string");
        expect(reslist[3].datatype).toBe("javascript");
        expect(!reslist[3].getComment()).toBeTruthy();
        expect(reslist[3].getId()).toBe("settings_1524");

        expect(reslist[6].getSource()).toBe("SEARCH");
        expect(reslist[6].getSourceLocale()).toBe("en-KR");
        expect(reslist[6].getTarget()).toBe("검색");
        expect(reslist[6].getTargetLocale()).toBe("ko-KR");
        expect(reslist[6].getKey()).toBe("SEARCH");
        expect(reslist[6].getPath()).toBe("settings");
        expect(reslist[6].getProject()).toBe("settings");
        expect(reslist[6].resType).toBe("string");
        expect(reslist[6].datatype).toBe("x-qml");
        expect(reslist[6].getComment()).toBeTruthy();
        expect(reslist[6].getComment()).toBe("copy strings from voice app");
        expect(reslist[6].getId()).toBe("settings_22");
    });

    test("webOSXliffDeserialize", function() {
        expect.assertions(8);
        var x = new webOSXliff();
        x.deserialize(
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff version="2.0" srcLang="en-KR" trgLang="de-DE" xmlns="urn:oasis:names:tc:xliff:document:2.0">\n' +
        '  <file id="sample-webos-cs_f1" original="sample-webos-c">\n' +
        '      <group id="sample-webos-c_g1" name="c">\n' +
        '        <unit id="sample-webos-c_g1_1">\n' +
        '          <segment>\n' +
        '            <source>Asdf asdf</source>\n' +
        '            <target>foobarfoo</target>\n' +
        '          </segment>\n' +
        '        </unit>\n' +
        '      </group>\n' +
        '  </file>\n' +
        '</xliff>');

        expect(x).toBeTruthy();

        var result = x.getResources();
        expect(result).toBeTruthy();
        expect(result.length).toBe(1);

        expect(result[0].getSource()).toBe("Asdf asdf");
        expect(result[0].getSourceLocale()).toBe("en-KR");
        expect(result[0].getTargetLocale()).toBe("de-DE");
        expect(result[0].getKey()).toBe("Asdf asdf");
        expect(result[0].getTarget()).toBe("foobarfoo");
    });
    test("webOSXliffDeserialize_metadata", function() {
        expect.assertions(9);

        var x = new webOSXliff({
            metadata: {"device-type": "SoundBar"}
        });
        x.deserialize(
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" version="2.0"\n' +
        'xmlns:mda="urn:oasis:names:tc:xliff:metadata:2.0"\n' +
        'srcLang="en-KR" trgLang="ko-KR">\n' +
        '  <file id="sample-webos-cs_f1" original="sample-webos-c">\n' +
        '      <group id="sample-webos-c_g1" name="c">\n' +
        '        <unit id="sample-webos-c_g1_1">\n' +
        '          <mda:metadata>\n' +
        '            <mda:metaGroup category="device-type">\n' +
        '              <mda:meta type="Monitor">"Monitor" 이용이 불가능합니다</mda:meta>\n' +
        '              <mda:meta type="Box">"Box" 이용이 불가능합니다</mda:meta>\n' +
        '              <mda:meta type="SoundBar">"SoundBar" 이용이 불가능합니다</mda:meta>\n' +
        '            </mda:metaGroup>\n' +
        '          </mda:metadata>\n' +
        '          <segment>\n' +
        '            <source>NOT AVAILABLE</source>\n' +
        '            <target>이용이 불가능합니다</target>\n' +
        '          </segment>\n' +
        '        </unit>\n' +
        '      </group>\n' +
        '  </file>\n' +
        '</xliff>');

        expect(x).toBeTruthy();

        var result = x.getResources();
        expect(result).toBeTruthy();
        expect(result.length).toBe(1);

        var expectedMetadata = {
                "mda:metaGroup": {
                    "mda:meta": [
                        {
                            "_attributes" : {"type": "Monitor"},
                            "_text": "\"Monitor\" 이용이 불가능합니다"
                        },
                        {
                            "_attributes" : {"type": "Box"},
                            "_text": "\"Box\" 이용이 불가능합니다"
                        },
                        {
                            "_attributes" : {"type": "SoundBar"},
                            "_text": "\"SoundBar\" 이용이 불가능합니다"
                        }
                    ],
                    "_attributes": {
                        "category": "device-type"
                    }
                }
            }

        expect(result[0].getSource()).toBe("NOT AVAILABLE");
        expect(result[0].getSourceLocale()).toBe("en-KR");
        expect(result[0].getTargetLocale()).toBe("ko-KR");
        expect(result[0].getKey()).toBe("NOT AVAILABLE");
        expect(result[0].getTarget()).toBe("이용이 불가능합니다");
        expect(result[0].getMetadata()).toStrictEqual(expectedMetadata);
    });
    test("webOSXliffDeserialize_metadata_undefined", function() {
        expect.assertions(8);
        var x = new webOSXliff();
        x.deserialize(
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" version="2.0"\n' +
        '       xmlns:mda="urn:oasis:names:tc:xliff:metadata:2.0"\n' +
        '       srcLang="en-KR" trgLang="ko-KR">\n' +
        '  <file id="sample-webos-cs_f1" original="sample-webos-c">\n' +
        '      <group id="sample-webos-c_g1" name="c">\n' +
        '        <unit id="sample-webos-c_g1_1">\n' +
        '          <mda:metadata>\n' +
        '            <mda:metaGroup category="device-type">\n' +
        '              <mda:meta type="Monitor">"Monitor" 이용이 불가능합니다</mda:meta>\n' +
        '              <mda:meta type="Box">"Box" 이용이 불가능합니다</mda:meta>\n' +
        '              <mda:meta type="SoundBar">"SoundBar" 이용이 불가능합니다</mda:meta>\n' +
        '            </mda:metaGroup>\n' +
        '          </mda:metadata>\n' +
        '          <segment>\n' +
        '            <source>NOT AVAILABLE</source>\n' +
        '            <target>이용이 불가능합니다</target>\n' +
        '          </segment>\n' +
        '        </unit>\n' +
        '      </group>\n' +
        '  </file>\n' +
        '</xliff>');

        expect(x).toBeTruthy();

        var result = x.getResources();
        expect(result).toBeTruthy();
        expect(result.length).toBe(1);

        expect(result[0].getSource()).toBe("NOT AVAILABLE");
        expect(result[0].getSourceLocale()).toBe("en-KR");
        expect(result[0].getTargetLocale()).toBe("ko-KR");
        expect(result[0].getKey()).toBe("NOT AVAILABLE");
        expect(result[0].getTarget()).toBe("이용이 불가능합니다");
    });
    test("webOSXliffDeserialize_metadata_undefined2", function() {
        expect.assertions(8);

        var x = new webOSXliff({
            metadata: {"device-type": "Monitor"}
        });
        x.deserialize(
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff version="2.0" srcLang="en-KR" trgLang="ko-KR" xmlns="urn:oasis:names:tc:xliff:document:2.0">\n' +
        '  <file id="sample-webos-cs_f1" original="sample-webos-c">\n' +
        '      <group id="sample-webos-c_g1" name="c">\n' +
        '        <unit id="sample-webos-c_g1_1">\n' +
        '          <segment>\n' +
        '            <source>NOT AVAILABLE</source>\n' +
        '            <target>이용이 불가능합니다</target>\n' +
        '          </segment>\n' +
        '        </unit>\n' +
        '      </group>\n' +
        '  </file>\n' +
        '</xliff>');

        expect(x).toBeTruthy();

        var result = x.getResources();
        expect(result).toBeTruthy();
        expect(result.length).toBe(1);

        expect(result[0].getSource()).toBe("NOT AVAILABLE");
        expect(result[0].getSourceLocale()).toBe("en-KR");
        expect(result[0].getTargetLocale()).toBe("ko-KR");
        expect(result[0].getKey()).toBe("NOT AVAILABLE");
        expect(result[0].getTarget()).toBe("이용이 불가능합니다");
    });
})