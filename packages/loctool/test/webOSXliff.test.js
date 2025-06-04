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

if (!webOSXliff) {
    var webOSXliff = require("../lib/webOSXliff.js");
    var ResourceString = require("../lib/ResourceString.js");
    var XliffMerge = require("../lib/XliffMerge.js");
    var XliffSplit = require("../lib/XliffSplit.js");
}

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
    test("XliffConstructorFull", function() {
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
    test("XliffGetPath", function() {
        expect.assertions(2);

        var x = new webOSXliff({
            path: "foo/bar/x.xliff"
        });
        expect(x).toBeTruthy();

        expect(x.getPath()).toBe("foo/bar/x.xliff");
    });
    test("XliffSetPath", function() {
        expect.assertions(3);

        var x = new webOSXliff({
            path: "foo/bar/x.xliff"
        });
        expect(x).toBeTruthy();
        expect(x.getPath()).toBe("foo/bar/x.xliff");
        x.setPath("asdf/asdf/y.xliff");
        expect(x.getPath()).toBe("asdf/asdf/y.xliff");
    });
    test("XliffSetPathInitiallyEmpty", function() {
        expect.assertions(3);

        var x = new webOSXliff();
        expect(x).toBeTruthy();
        expect(!x.getPath()).toBeTruthy();
        x.setPath("asdf/asdf/y.xliff");
        expect(x.getPath()).toBe("asdf/asdf/y.xliff");
    });
    test("XliffAddResource", function() {
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
    test("XliffSize", function() {
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
    test("XliffAddMultipleResources", function() {
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
    test("XliffAddMultipleResourcesRightSize", function() {
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
    test("XliffAddMultipleResourcesOverwrite", function() {
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

    test("XliffAddMultipleResourcesOverwriteRightSize", function() {
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
    test("XliffAddMultipleResourcesNoOverwrite", function() {
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
    test("XliffAddResourceDontAddSourceLocaleAsTarget", function() {
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
    test("XliffGetResourcesMultiple", function() {
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
    //xliff split/merge
    test("XliffMerge_write_en_US_Style", function() {
        expect.assertions(2);
    
        var settings = {};
        settings.xliffVersion = 2;
        settings.xliffStyle = "webOS";
        settings.infiles = [
            "test/testfiles/xliff20/app1/en-US.xliff",
            "test/testfiles/xliff20/app2/en-US.xliff",
        ];
        var target = XliffMerge(settings);
        expect(target).toBeTruthy();
    
        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff version="2.0" srcLang="en-KR" trgLang="en-US" xmlns:l="http://ilib-js.com/loctool">\n' +
        '  <file id="app1_f1" original="app1">\n' +
        '    <group id="app1_g1" name="cpp">\n' +
        '      <unit id="app1_1">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1a</source>\n' +
        '          <target>app1:String 1a</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="app1_2">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1b</source>\n' +
        '          <target>app1:String 1b</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '    <group id="app1_g2" name="x-json">\n' +
        '      <unit id="app1_3">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1c</source>\n' +
        '          <target>app1:String 1c</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '  <file id="app2_f2" original="app2">\n' +
        '    <group id="app2_g3" name="javascript">\n' +
        '      <unit id="app2_1">\n' +
        '        <segment>\n' +
        '          <source>app2: String 2a</source>\n' +
        '          <target>app2: String 2a</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="app2_2">\n' +
        '        <segment>\n' +
        '          <source>app2: String 2b</source>\n' +
        '          <target>app2: String 2b</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';
        expect(actual).toBe(expected);
    });
    test("XliffSplitdistritueSerialize_xliffStyle", function() {
        expect.assertions(2);
        var settings = {};
        settings.xliffVersion = 2;
        settings.infiles = [
            "test/testfiles/xliff20/merge-en-US-style.xliff",
        ];
        settings.xliffStyle = "webOS"
        var superset = XliffSplit(settings);
        var result = XliffSplit.distribute(superset, settings);
        expect(result).toBeTruthy();

        var actual = result["app2"].serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff version="2.0" srcLang="en-KR" trgLang="en-US" xmlns:l="http://ilib-js.com/loctool">\n' +
        '  <file id="app2_f1" original="app2">\n' +
        '    <group id="app2_g1" name="javascript">\n' +
        '      <unit id="app2_1">\n' +
        '        <segment>\n' +
        '          <source>app2: String 2a</source>\n' +
        '          <target>app2: String 2a</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="app2_2">\n' +
        '        <segment>\n' +
        '          <source>app2: String 2b</source>\n' +
        '          <target>app2: String 2b</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';

        expect(actual).toBe(expected);
    });
    test("XliffMerge_write_en_US_CustomStyle_wrongStyle", function() {
        expect.assertions(2);
    
        var settings = {};
        settings.xliffVersion = 2;
        settings.xliffStyle = "custommm";
        settings.infiles = [
            "test/testfiles/xliff20/app1/en-US.xliff",
            "test/testfiles/xliff20/app2/en-US.xliff",
        ];
    
        var target = XliffMerge(settings);
        expect(target).toBeTruthy();
        var actual = target.serialize();
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff version="2.0" srcLang="en-KR" trgLang="en-US" xmlns:l="http://ilib-js.com/loctool">\n' +
        '  <file original="app1" l:project="app1">\n' +
        '    <group id="group_1" name="cpp">\n' +
        '      <unit id="app1_1" type="res:string" l:datatype="cpp">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1a</source>\n' +
        '          <target>app1:String 1a</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="app1_2" type="res:string" l:datatype="cpp">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1b</source>\n' +
        '          <target>app1:String 1b</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '    <group id="group_2" name="x-json">\n' +
        '      <unit id="app1_3" type="res:string" l:datatype="x-json">\n' +
        '        <segment>\n' +
        '          <source>app1:String 1c</source>\n' +
        '          <target>app1:String 1c</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '  <file original="app2" l:project="app2">\n' +
        '    <group id="group_3" name="javascript">\n' +
        '      <unit id="app2_1" type="res:string" l:datatype="javascript">\n' +
        '        <segment>\n' +
        '          <source>app2: String 2a</source>\n' +
        '          <target>app2: String 2a</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="app2_2" type="res:string" l:datatype="javascript">\n' +
        '        <segment>\n' +
        '          <source>app2: String 2b</source>\n' +
        '          <target>app2: String 2b</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>';
        expect(actual).toBe(expected);
    });
});