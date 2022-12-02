/*
 * testXliff20.js - test the Xliff 2.0 object.
 *
 * Copyright © 2019,2021 JEDLSoft
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

import fs from "node:fs";

import ResourceArray from "../src/ResourceArray.js";
import ResourcePlural from "../src/ResourcePlural.js";
import ResourceString from "../src/ResourceString.js";
import ResourceXliff from "../src/ResourceXliff.js";

function diff(a, b) {
    var min = Math.min(a.length, b.length);

    for (var i = 0; i < min; i++) {
        if (a[i] !== b[i]) {
            console.log("Found difference at character " + i);
            console.log("a: " + a.substring(i));
            console.log("b: " + b.substring(i));
            break;
        }
    }
}

export const testResourceXliff20 = {
    testXliff20Constructor: function(test) {
        test.expect(1);

        var x = new ResourceXliff({version: "2.0"});
        test.ok(x);

        test.done();
    },

    testXliff20ConstructorIsEmpty: function(test) {
        test.expect(2);

        var x = new ResourceXliff({version: "2.0"});
        test.ok(x);

        test.equal(x.size(), 0);
        test.done();
    },

    testXliff20ConstructorRightVersion: function(test) {
        test.expect(2);

        var x = new ResourceXliff({version: "2.0"});
        test.ok(x);

        test.equal(x.getVersion(), "2.0");
        test.done();
    },

    testXliff20ConstructorNumericVersion12: function(test) {
        test.expect(2);

        var x = new ResourceXliff({version: 1.2});
        test.ok(x);

        test.equal(x.getVersion(), "1.2");
        test.done();
    },

    testXliff20ConstructorNumericVersion20: function(test) {
        test.expect(2);

        var x = new ResourceXliff({version: 2.0});
        test.ok(x);

        test.equal(x.getVersion(), "2.0");
        test.done();
    },

    testXliff20ConstructorFull: function(test) {
        test.expect(8);

        var x = new ResourceXliff({
            version: "2.0",
            "tool-id": "loctool",
            "tool-name": "Localization Tool",
            "tool-version": "1.2.34",
            "tool-company": "My Company, Inc.",
            copyright: "Copyright 2016, My Company, Inc. All rights reserved.",
            path: "a/b/c.xliff"
        });
        test.ok(x);

        test.equal(x.getVersion(), "2.0");

        test.equal(x["tool-id"], "loctool");
        test.equal(x["tool-name"], "Localization Tool"),
        test.equal(x["tool-version"], "1.2.34"),
        test.equal(x["tool-company"], "My Company, Inc."),
        test.equal(x.copyright, "Copyright 2016, My Company, Inc. All rights reserved."),
        test.equal(x.path, "a/b/c.xliff");

        test.done();
    },

    testXliff20GetPath: function(test) {
        test.expect(2);

        var x = new ResourceXliff({
            version: "2.0",
            path: "foo/bar/x.xliff"
        });
        test.ok(x);

        test.equal(x.getPath(), "foo/bar/x.xliff");

        test.done();
    },


    testXliff20SetPath: function(test) {
        test.expect(3);

        var x = new ResourceXliff({
            version: "2.0",
            path: "foo/bar/x.xliff"
        });
        test.ok(x);

        test.equal(x.getPath(), "foo/bar/x.xliff");

        x.setPath("asdf/asdf/y.xliff");

        test.equal(x.getPath(), "asdf/asdf/y.xliff");

        test.done();
    },

    testXliff20SetPathInitiallyEmpty: function(test) {
        test.expect(3);

        var x = new ResourceXliff({version: "2.0"});
        test.ok(x);

        test.ok(!x.getPath());

        x.setPath("asdf/asdf/y.xliff");

        test.equal(x.getPath(), "asdf/asdf/y.xliff");

        test.done();
    },

    testXliff20AddResource: function(test) {
        test.expect(11);

        var x = new ResourceXliff({version: "2.0"});
        test.ok(x);

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
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

        test.ok(reslist);

        test.equal(reslist.length, 1);
        test.equal(reslist[0].getSource(), "Asdf asdf");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getState(), "new");
        test.equal(reslist[0].getContext(), "asdf");
        test.equal(reslist[0].getComment(), "this is a comment");
        test.equal(reslist[0].getProject(), "webapp");

        test.done();
    },

    testXliff20Size: function(test) {
        test.expect(3);

        var x = new ResourceXliff({version: "2.0"});
        test.ok(x);

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            autoKey: false,
            state: "new",
            context: "asdf",
            comment: "this is a comment",
            project: "webapp"
        });

        test.equal(x.size(), 0);

        x.addResource(res);

        test.equal(x.size(), 1);

        test.done();
    },

    testXliff20AddMultipleResources: function(test) {
        test.expect(8);

        var x = new ResourceXliff({version: "2.0"});
        test.ok(x);

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp"
        });

        x.addResource(res);

        res = new ResourceString({
            source: "baby baby",
            sourceLocale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "webapp"
        });

        x.addResource(res);

        var reslist = x.getResources({
            reskey: "foobar"
        });

        test.ok(reslist);

        test.equal(reslist.length, 1);
        test.equal(reslist[0].getSource(), "Asdf asdf");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "webapp");

        test.done();
    },

    testXliff20AddMultipleResourcesRightSize: function(test) {
        test.expect(3);

        var x = new ResourceXliff({version: "2.0"});
        test.ok(x);
        test.equal(x.size(), 0);

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp"
        });

        x.addResource(res);

        res = new ResourceString({
            source: "baby baby",
            sourceLocale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "webapp"
        });

        x.addResource(res);

        test.equal(x.size(), 2);

        test.done();
    },

    testXliff20AddMultipleResourcesAddInstance: function(test) {
        test.expect(17);

        var x = new ResourceXliff({version: "2.0"});
        test.ok(x);

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp"
        });

        x.addResource(res);

        // this one has the same source, locale, key, and pathName
        // so it should add an instance
        res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            comment: "blah blah blah",
            project: "webapp"
        });

        x.addResource(res);

        var reslist = x.getResources({
            reskey: "foobar"
        });

        test.ok(reslist);

        test.equal(reslist.length, 1);
        test.equal(reslist[0].getSource(), "Asdf asdf");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "webapp");
        test.ok(!reslist[0].getComment());

        const inst = reslist[0].getInstances();
        test.ok(inst);

        test.equal(inst.length, 1);
        test.equal(inst[0].getSource(), "Asdf asdf");
        test.equal(inst[0].getSourceLocale(), "en-US");
        test.equal(inst[0].getKey(), "foobar");
        test.equal(inst[0].getPath(), "foo/bar/asdf.java");
        test.equal(inst[0].getProject(), "webapp");
        test.equal(inst[0].getComment(), "blah blah blah");

        test.done();
    },

    testXliff20AddMultipleResourcesOverwriteRightSize: function(test) {
        test.expect(4);

        var x = new ResourceXliff({version: "2.0"});
        test.ok(x);

        test.equal(x.size(), 0);

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp"
        });

        x.addResource(res);

        test.equal(x.size(), 1);

        // this one has the same source, locale, key, and file
        // so it should overwrite the one above
        res = new ResourceString({
            source: "baby baby",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            comment: "blah blah blah",
            project: "webapp"
        });

        x.addResource(res);

        test.equal(x.size(), 1);

        test.done();
    },

    testXliff20AddMultipleResourcesNoOverwrite: function(test) {
        test.expect(13);

        var x = new ResourceXliff({version: "2.0"});
        test.ok(x);

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp"
        });

        x.addResource(res);

        // this one has a different locale
        // so it should not overwrite the one above
        res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "fr-FR",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            comment: "blah blah blah",
            project: "webapp"
        });

        x.addResource(res);

        var reslist = x.getResources({
            reskey: "foobar"
        });

        test.ok(reslist);

        test.equal(reslist.length, 2);

        test.equal(reslist[0].getSource(), "Asdf asdf");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.ok(!reslist[0].getComment());

        test.equal(reslist[1].getSource(), "Asdf asdf");
        test.equal(reslist[1].getSourceLocale(), "fr-FR");
        test.equal(reslist[1].getKey(), "foobar");
        test.equal(reslist[1].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[1].getComment(), "blah blah blah");

        test.done();
    },

    testXliff20AddResourceDontAddSourceLocaleAsTarget: function(test) {
        test.expect(2);

        var x = new ResourceXliff({
            version: "2.0",
            sourceLocale: "en-US"
        });
        test.ok(x);

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp"
        });

        x.addResource(res);

        // should not add this one
        res = new ResourceString({
            source: "baby baby",
            target: "babes babes",
            targetLocale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "webapp",
            origin: "target"
        });

        x.addResource(res);

        test.equal(x.size(), 1);

        test.done();
    },

    testXliff20GetResourcesMultiple: function(test) {
        test.expect(11);

        var x = new ResourceXliff({version: "2.0"});
        test.ok(x);

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            origin: "source"
        });

        x.addResource(res);

        res = new ResourceString({
            source: "baby baby",
            sourceLocale: "en-US",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "webapp",
            origin: "origin"
        });

        x.addResource(res);

        var reslist = x.getResources({
            sourceLocale: "en-US"
        });

        test.ok(reslist);

        test.equal(reslist.length, 2);

        test.equal(reslist[0].getSource(), "Asdf asdf");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");

        test.equal(reslist[1].getSource(), "baby baby");
        test.equal(reslist[1].getSourceLocale(), "en-US");
        test.equal(reslist[1].getKey(), "huzzah");
        test.equal(reslist[1].getPath(), "foo/bar/j.java");

        test.done();
    },

    testXliff20GetTextWithExplicitIds: function(test) {
        test.expect(2);

        var x = new ResourceXliff({version: "2.0"});
        test.ok(x);

        let res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            target: "baby baby",
            targetLocale: "nl-NL",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "androidapp",
            origin: "target",
            id: 4444444
        });

        x.addResource(res);

        res = new ResourceString({
            source: "abcdef",
            sourceLocale: "en-US",
            target: "hijklmn",
            targetLocale: "nl-NL",
            key: "asdf",
            pathName: "foo/bar/asdf.java",
            project: "androidapp",
            origin: "target"
        });

        x.addResource(res);

        var actual = x.getText();
        var expected =
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="nl-NL" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <group id="group_1" name="plaintext">\n' +
                '      <unit id="4444444" name="foobar" type="res:string" l:datatype="plaintext">\n' +
                '        <segment>\n' +
                '          <source>Asdf asdf</source>\n' +
                '          <target>baby baby</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '      <unit id="4444445" name="asdf" type="res:string" l:datatype="plaintext">\n' +
                '        <segment>\n' +
                '          <source>abcdef</source>\n' +
                '          <target>hijklmn</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '</xliff>';
        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    },

    testXliff20GetTextWithSourceAndTarget: function(test) {
        test.expect(2);

        var x = new ResourceXliff({version: "2.0"});
        test.ok(x);

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            target: "foobarfoo",
            targetLocale: "de-DE",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            origin: "target"
        });

        x.addResource(res);

        res = new ResourceString({
            source: "baby baby",
            sourceLocale: "en-US",
            target: "bebe bebe",
            targetLocale: "de-DE",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "webapp",
            origin: "target"
        });

        x.addResource(res);

        var expected =
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="webapp">\n' +
                '    <group id="group_1" name="plaintext">\n' +
                '      <unit id="1" name="foobar" type="res:string" l:datatype="plaintext">\n' +
                '        <segment>\n' +
                '          <source>Asdf asdf</source>\n' +
                '          <target>foobarfoo</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <group id="group_2" name="plaintext">\n' +
                '      <unit id="2" name="huzzah" type="res:string" l:datatype="plaintext">\n' +
                '        <segment>\n' +
                '          <source>baby baby</source>\n' +
                '          <target>bebe bebe</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '</xliff>';

        diff(x.getText(), expected);
        test.equal(x.getText(), expected);

        test.done();
    },

    testXliff20GetTextWithSourceAndTargetAndComment: function(test) {
        test.expect(2);

        var x = new ResourceXliff({version: "2.0"});
        test.ok(x);

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            target: "foobarfoo",
            targetLocale: "de-DE",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            comment: "foobar is where it's at!"
        });

        x.addResource(res);

        res = new ResourceString({
            source: "baby baby",
            sourceLocale: "en-US",
            target: "bebe bebe",
            targetLocale: "de-DE",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "webapp",
            comment: "come & enjoy it with us"
        });

        x.addResource(res);

        var expected =
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="webapp">\n' +
                '    <group id="group_1" name="plaintext">\n' +
                '      <unit id="1" name="foobar" type="res:string" l:datatype="plaintext">\n' +
                '        <notes>\n' +
                '          <note appliesTo="source">foobar is where it\'s at!</note>\n' +
                '        </notes>\n' +
                '        <segment>\n' +
                '          <source>Asdf asdf</source>\n' +
                '          <target>foobarfoo</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <group id="group_2" name="plaintext">\n' +
                '      <unit id="2" name="huzzah" type="res:string" l:datatype="plaintext">\n' +
                '        <notes>\n' +
                '          <note appliesTo="source">come &amp; enjoy it with us</note>\n' +
                '        </notes>\n' +
                '        <segment>\n' +
                '          <source>baby baby</source>\n' +
                '          <target>bebe bebe</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '</xliff>';

        var actual = x.getText();

        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    },

    testXliff20GetTextWithHeader: function(test) {
        test.expect(2);

        var x = new ResourceXliff({
            version: "2.0",
            "tool-id": "loctool",
            "tool-name": "Localization Tool",
            "tool-version": "1.2.34",
            "tool-company": "My Company, Inc.",
            copyright: "Copyright 2016, My Company, Inc. All rights reserved.",
            path: "a/b/c.xliff"
        });
        test.ok(x);

        const res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            target: "baby baby",
            targetLocale: "nl-NL",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            origin: "target"
        });

        x.addResource(res);

        var actual = x.getText();
        var expected =
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="nl-NL" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="webapp">\n' +
                '    <group id="group_1" name="plaintext">\n' +
                '      <unit id="1" name="foobar" type="res:string" l:datatype="plaintext">\n' +
                '        <segment>\n' +
                '          <source>Asdf asdf</source>\n' +
                '          <target>baby baby</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '    <header>\n' +
                '      <tool tool-id="loctool" tool-name="Localization Tool" tool-version="1.2.34" tool-company="My Company, Inc." copyright="Copyright 2016, My Company, Inc. All rights reserved."/>\n' +
                '    </header>\n' +
                '  </file>\n' +
                '</xliff>';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXliff20GetTextWithPlurals: function(test) {
        test.expect(2);

        var x = new ResourceXliff({version: "2.0"});
        test.ok(x);

        const res = new ResourcePlural({
            source: {
                "one": "There is 1 object.",
                "other": "There are {n} objects."
            },
            sourceLocale: "en-US",
            target: {
                "one": "Da gibts 1 Objekt.",
                "other": "Da gibts {n} Objekten."
            },
            targetLocale: "de-DE",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "androidapp",
            resType: "plural",
            origin: "target",
            autoKey: true,
            state: "new",
            datatype: "ruby"
        });

        x.addResource(res);

        var actual = x.getText();
        var expected =
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <group id="group_1" name="ruby">\n' +
                '      <unit id="1" name="foobar" type="res:plural" l:datatype="ruby" l:category="one">\n' +
                '        <notes>\n' +
                '          <note appliesTo="source">{"pluralForm":"one","pluralFormOther":"foobar"}</note>\n' +
                '        </notes>\n' +
                '        <segment>\n' +
                '          <source>There is 1 object.</source>\n' +
                '          <target state="new">Da gibts 1 Objekt.</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '      <unit id="2" name="foobar" type="res:plural" l:datatype="ruby" l:category="other">\n' +
                '        <notes>\n' +
                '          <note appliesTo="source">{"pluralForm":"other","pluralFormOther":"foobar"}</note>\n' +
                '        </notes>\n' +
                '        <segment>\n' +
                '          <source>There are {n} objects.</source>\n' +
                '          <target state="new">Da gibts {n} Objekten.</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '</xliff>';
        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    },

    testXliff20GetTextWithPluralsToLangWithMorePluralsThanEnglish: function(test) {
        test.expect(2);

        var x = new ResourceXliff({version: "2.0"});
        test.ok(x);

        const res = new ResourcePlural({
            source: {
                "one": "There is 1 object.",
                "other": "There are {n} objects."
            },
            sourceLocale: "en-US",
            target: {
                "one": "Имеется {n} объект.",
                "few": "Есть {n} объекта.",
                "other": "Всего {n} объектов."
            },
            targetLocale: "ru-RU",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "androidapp",
            resType: "plural",
            origin: "target",
            autoKey: true,
            state: "new",
            datatype: "ruby"
        });

        x.addResource(res);

        var actual = x.getText();
        var expected =
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="ru-RU" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <group id="group_1" name="ruby">\n' +
                '      <unit id="1" name="foobar" type="res:plural" l:datatype="ruby" l:category="one">\n' +
                '        <notes>\n' +
                '          <note appliesTo="source">{"pluralForm":"one","pluralFormOther":"foobar"}</note>\n' +
                '        </notes>\n' +
                '        <segment>\n' +
                '          <source>There is 1 object.</source>\n' +
                '          <target state="new">Имеется {n} объект.</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '      <unit id="2" name="foobar" type="res:plural" l:datatype="ruby" l:category="few">\n' +
                '        <notes>\n' +
                '          <note appliesTo="source">{"pluralForm":"few","pluralFormOther":"foobar"}</note>\n' +
                '        </notes>\n' +
                '        <segment>\n' +
                '          <source>There are {n} objects.</source>\n' +
                '          <target state="new">Есть {n} объекта.</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '      <unit id="3" name="foobar" type="res:plural" l:datatype="ruby" l:category="other">\n' +
                '        <notes>\n' +
                '          <note appliesTo="source">{"pluralForm":"other","pluralFormOther":"foobar"}</note>\n' +
                '        </notes>\n' +
                '        <segment>\n' +
                '          <source>There are {n} objects.</source>\n' +
                '          <target state="new">Всего {n} объектов.</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '</xliff>';
        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    },

    testXliff20GetTextWithArrays: function(test) {
        test.expect(2);

        var x = new ResourceXliff({version: "2.0"});
        test.ok(x);

        const res = new ResourceArray({
            sourceArray: ["Zero", "One", "Two"],
            sourceLocale: "en-US",
            targetArray: ["Zero", "Eins", "Zwei"],
            targetLocale: "de-DE",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "androidapp",
            origin: "target"
        });

        x.addResource(res);

        var actual = x.getText();
        var expected =
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <group id="group_1" name="x-android-resource">\n' +
                '      <unit id="1" name="foobar" type="res:array" l:datatype="x-android-resource" l:index="0">\n' +
                '        <segment>\n' +
                '          <source>Zero</source>\n' +
                '          <target>Zero</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '      <unit id="2" name="foobar" type="res:array" l:datatype="x-android-resource" l:index="1">\n' +
                '        <segment>\n' +
                '          <source>One</source>\n' +
                '          <target>Eins</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '      <unit id="3" name="foobar" type="res:array" l:datatype="x-android-resource" l:index="2">\n' +
                '        <segment>\n' +
                '          <source>Two</source>\n' +
                '          <target>Zwei</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '</xliff>';
        diff(actual, expected)
        test.equal(actual, expected);
        test.done();
    },

    testXliff20GetTextWithXMLEscaping: function(test) {
        test.expect(2);

        var x = new ResourceXliff({version: "2.0"});
        test.ok(x);

        var res = new ResourceString({
            source: "Asdf <b>asdf</b>",
            sourceLocale: "en-US",
            target: "Asdf 'quotes'",
            targetLocale: "de-DE",
            key: 'foobar "asdf"',
            pathName: "foo/bar/asdf.java",
            project: "androidapp",
            origin: "target"
        });

        x.addResource(res);

        res = new ResourceString({
            source: "baby &lt;b&gt;baby&lt;/b&gt;",
            sourceLocale: "en-US",
            target: "baby #(test)",
            targetLocale: "de-DE",
            key: "huzzah &quot;asdf&quot; #(test)",
            pathName: "foo/bar/j.java",
            project: "webapp",
            origin: "target"
        });

        x.addResource(res);

        var actual = x.getText();
        var expected =
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <group id="group_1" name="plaintext">\n' +
                '      <unit id="1" name="foobar &quot;asdf&quot;" type="res:string" l:datatype="plaintext">\n' +
                '        <segment>\n' +
                '          <source>Asdf &lt;b&gt;asdf&lt;/b&gt;</source>\n' +
                '          <target>Asdf \'quotes\'</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <group id="group_2" name="plaintext">\n' +
                '      <unit id="2" name="huzzah &amp;quot;asdf&amp;quot; #(test)" type="res:string" l:datatype="plaintext">\n' +
                '        <segment>\n' +
                '          <source>baby &amp;lt;b&amp;gt;baby&amp;lt;/b&amp;gt;</source>\n' +   // double escaped!
                '          <target>baby #(test)</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '</xliff>';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXliff20GetTextWithXMLEscapingWithQuotes: function(test) {
        test.expect(2);

        var x = new ResourceXliff({version: "2.0"});
        test.ok(x);

        var res = new ResourceString({
            source: "Here are \"double\" and 'single' quotes.",
            sourceLocale: "en-US",
            target: "Hier zijn \"dubbel\" en 'singel' quotaties.",
            targetLocale: "nl-NL",
            key: '"double" and \'single\'',
            pathName: "foo/bar/asdf.java",
            project: "androidapp",
            origin: "target"
        });

        x.addResource(res);

        test.equal(x.getText(),
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="nl-NL" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <group id="group_1" name="plaintext">\n' +
                '      <unit id="1" name="&quot;double&quot; and &apos;single&apos;" type="res:string" l:datatype="plaintext">\n' +
                '        <segment>\n' +
                '          <source>Here are "double" and \'single\' quotes.</source>\n' +
                '          <target>Hier zijn "dubbel" en \'singel\' quotaties.</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '</xliff>');

        test.done();
    },

    testXliff20GetTextWithEscapeCharsInResname: function(test) {
        test.expect(2);

        var x = new ResourceXliff({version: "2.0"});
        test.ok(x);

        var res = new ResourceString({
            source: "Here are \\ndouble\\n quotes.",
            sourceLocale: "en-US",
            target: "Hier zijn \\ndubbel\\n quotaties.",
            targetLocale: "nl-NL",
            key: 'Double \\ndouble\\n.',
            pathName: "foo/bar/asdf.java",
            project: "androidapp",
            origin: "target"
        });

        x.addResource(res);

        test.equal(x.getText(),
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="nl-NL" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <group id="group_1" name="plaintext">\n' +
                '      <unit id="1" name="Double \\ndouble\\n." type="res:string" l:datatype="plaintext">\n' +
                '        <segment>\n' +
                '          <source>Here are \\ndouble\\n quotes.</source>\n' +
                '          <target>Hier zijn \\ndubbel\\n quotaties.</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '</xliff>');

        test.done();
    },

    testXliff20GetTextWithComments: function(test) {
        test.expect(2);

        var x = new ResourceXliff({version: "2.0"});
        test.ok(x);

        const res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            target: "baby baby",
            targetLocale: "nl-NL",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "androidapp",
            comment: "A very nice string",
            origin: "target"
        });

        x.addResource(res);

        test.equal(x.getText(),
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="nl-NL" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <group id="group_1" name="plaintext">\n' +
                '      <unit id="1" name="foobar" type="res:string" l:datatype="plaintext">\n' +
                '        <notes>\n' +
                '          <note appliesTo="source">A very nice string</note>\n' +
                '        </notes>\n' +
                '        <segment>\n' +
                '          <source>Asdf asdf</source>\n' +
                '          <target>baby baby</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '</xliff>');

        test.done();
    },

    testXliff20ParseWithSourceOnly: function(test) {
        test.expect(21);

        var x = new ResourceXliff();
        test.ok(x);

        x.parse(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" \n' +
                '  xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="foobar" type="res:string" l:datatype="plaintext">\n' +
                '      <segment>\n' +
                '        <source>Asdf asdf</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <unit id="2" name="huzzah" type="res:string" l:datatype="plaintext">\n' +
                '      <segment>\n' +
                '        <source>baby baby</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 2);

        test.equal(reslist[0].getSource(), "Asdf asdf");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.ok(!reslist[0].getTarget());
        test.equal(reslist[0].getTargetLocale(), "de-DE");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "androidapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), "1");

        test.equal(reslist[1].getSource(), "baby baby");
        test.equal(reslist[1].getSourceLocale(), "en-US");
        test.ok(!reslist[1].getTarget());
        test.equal(reslist[1].getTargetLocale(), "de-DE");
        test.equal(reslist[1].getKey(), "huzzah");
        test.equal(reslist[1].getPath(), "foo/bar/j.java");
        test.equal(reslist[1].getProject(), "webapp");
        test.equal(reslist[1].resType, "string");
        test.equal(reslist[1].getId(), "2");

        test.done();
    },

    testXliff20ParseWithSourceAndTarget: function(test) {
        test.expect(21);

        var x = new ResourceXliff();
        test.ok(x);

        x.parse(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="foobar" type="res:string">\n' +
                '      <segment>\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>foobarfoo</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <unit id="2" name="huzzah" type="res:string">\n' +
                '      <segment>\n' +
                '        <source>baby baby</source>\n' +
                '        <target>bebe bebe</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>');

        // console.log("x is " + JSON.stringify(x, undefined, 4));
        var reslist = x.getResources();
        // console.log("x is now " + JSON.stringify(x, undefined, 4));

        test.ok(reslist);

        test.equal(reslist.length, 2);

        test.equal(reslist[0].getSource(), "Asdf asdf");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "androidapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), "1");
        test.equal(reslist[0].getTarget(), "foobarfoo");
        test.equal(reslist[0].getTargetLocale(), "de-DE");

        test.equal(reslist[1].getSource(), "baby baby");
        test.equal(reslist[1].getSourceLocale(), "en-US");
        test.equal(reslist[1].getKey(), "huzzah");
        test.equal(reslist[1].getPath(), "foo/bar/j.java");
        test.equal(reslist[1].getProject(), "webapp");
        test.equal(reslist[1].resType, "string");
        test.equal(reslist[1].getId(), "2");
        test.equal(reslist[1].getTarget(), "bebe bebe");
        test.equal(reslist[1].getTargetLocale(), "de-DE");

        test.done();
    },

    testXliff20ParseWithXMLUnescaping: function(test) {
        test.expect(19);

        var x = new ResourceXliff();
        test.ok(x);

        x.parse(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" xmlns:l="http://ilib-js.com/loctool" srcLang="en-US">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="foobar" type="res:string">\n' +
                '      <segment>\n' +
                '        <source>Asdf &lt;b&gt;asdf&lt;/b&gt;</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <unit id="2" name="huzzah" type="res:string">\n' +
                '      <segment>\n' +
                '        <source>baby &amp;lt;b&amp;gt;baby&amp;lt;/b&amp;gt;</source>\n' +   // double escaped!
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 2);

        test.equal(reslist[0].getSource(), "Asdf <b>asdf</b>");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "androidapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), "1");
        test.ok(!reslist[0].getTarget());

        test.equal(reslist[1].getSource(), "baby &lt;b&gt;baby&lt;/b&gt;");
        test.equal(reslist[1].getSourceLocale(), "en-US");
        test.equal(reslist[1].getKey(), "huzzah");
        test.equal(reslist[1].getPath(), "foo/bar/j.java");
        test.equal(reslist[1].getProject(), "webapp");
        test.equal(reslist[1].resType, "string");
        test.equal(reslist[1].getId(), "2");
        test.ok(!reslist[1].getTarget());

        test.done();
    },

    testXliff20ParseWithEscapedNewLines: function(test) {
        test.expect(17);

        var x = new ResourceXliff();
        test.ok(x);

        x.parse(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="en-CA" \n' +
                '  xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="foobar" type="res:string">\n' +
                '      <segment>\n' +
                '        <source>a\\nb</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <unit id="2" name="huzzah" type="res:string">\n' +
                '      <segment>\n' +
                '        <source>e\\nh</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 2);

        test.equal(reslist[0].getSource(), "a\\nb");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "androidapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), "1");

        test.equal(reslist[1].getSource(), "e\\nh");
        test.equal(reslist[1].getSourceLocale(), "en-US");
        test.equal(reslist[1].getKey(), "huzzah");
        test.equal(reslist[1].getPath(), "foo/bar/j.java");
        test.equal(reslist[1].getProject(), "webapp");
        test.equal(reslist[1].resType, "string");
        test.equal(reslist[1].getId(), "2");

        test.done();
    },

    testXliff20ParseWithEscapedNewLinesInResname: function(test) {
        test.expect(17);

        var x = new ResourceXliff();
        test.ok(x);

        x.parse(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="en-CA" \n' +
                '  xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="foobar\\nbar\\t" type="res:string">\n' +
                '      <segment>\n' +
                '        <source>a\\nb</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <unit id="2" name="huzzah\\n\\na plague on both your houses" type="res:string">\n' +
                '      <segment>\n' +
                '        <source>e\\nh</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 2);

        test.equal(reslist[0].getSource(), "a\\nb");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar\\nbar\\t");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "androidapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), "1");

        test.equal(reslist[1].getSource(), "e\\nh");
        test.equal(reslist[1].getSourceLocale(), "en-US");
        test.equal(reslist[1].getKey(), "huzzah\\n\\na plague on both your houses");
        test.equal(reslist[1].getPath(), "foo/bar/j.java");
        test.equal(reslist[1].getProject(), "webapp");
        test.equal(reslist[1].resType, "string");
        test.equal(reslist[1].getId(), "2");

        test.done();
    },

    testXliff20ParseWithPlurals: function(test) {
        test.expect(10);

        var x = new ResourceXliff();
        test.ok(x);

        x.parse(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" xmlns:l="http://ilib-js.com/loctool" srcLang="en-US">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="foobar" type="res:plural" l:datatype="x-android-resource" l:category="one">\n' +
                '      <segment>\n' +
                '        <source>There is 1 object.</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '    <unit id="2" name="foobar" type="res:plural" l:datatype="x-android-resource" l:category="other">\n' +
                '      <segment>\n' +
                '        <source>There are {n} objects.</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>');

        // console.log("x is " + JSON.stringify(x, undefined, 4));

        var reslist = x.getResources();

        // console.log("after get resources x is " + JSON.stringify(x, undefined, 4));

        test.ok(reslist);

        test.equal(reslist.length, 1);

        test.deepEqual(reslist[0].getSourcePlurals(), {
            one: "There is 1 object.",
            other: "There are {n} objects."
        });
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "androidapp");
        test.equal(reslist[0].resType, "plural");
        test.equal(reslist[0].getId(), "1");

        test.done();
    },

    testXliff20ParseWithPluralsTranslated: function(test) {
        test.expect(13);

        var x = new ResourceXliff();
        test.ok(x);

        x.parse(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="es-US" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="foobar" type="res:plural" l:datatype="x-android-resource" l:category="one">\n' +
                '      <segment>\n' +
                '        <source>There is 1 object.</source>\n' +
                '        <target>Hay 1 objeto.</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '    <unit id="2" name="foobar" type="res:plural" l:datatype="x-android-resource" l:category="other">\n' +
                '      <segment>\n' +
                '        <source>There are {n} objects.</source>\n' +
                '        <target>Hay {n} objetos.</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>');

        // console.log("x is " + JSON.stringify(x, undefined, 4));

        var reslist = x.getResources();

        // console.log("after get resources x is " + JSON.stringify(x, undefined, 4));

        test.ok(reslist);

        test.equal(reslist.length, 1);

        test.deepEqual(reslist[0].getSourcePlurals(), {
            one: "There is 1 object.",
            other: "There are {n} objects."
        });
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "androidapp");
        test.equal(reslist[0].resType, "plural");
        test.equal(reslist[0].getId(), "1");
        test.equal(reslist[0].getOrigin(), "source");

        test.deepEqual(reslist[0].getTargetPlurals(), {
            one: "Hay 1 objeto.",
            other: "Hay {n} objetos."
        });
        test.equal(reslist[0].getTargetLocale(), "es-US");

        test.done();
    },

    testXliff20ParseWithArrays: function(test) {
        test.expect(10);

        var x = new ResourceXliff();
        test.ok(x);

        x.parse(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="foobar" type="res:array" l:datatype="x-android-resource" l:index="0">\n' +
                '      <segment>\n' +
                '        <source>Zero</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '    <unit id="2" name="foobar" type="res:array" l:datatype="x-android-resource" l:index="1">\n' +
                '      <segment>\n' +
                '        <source>One</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '    <unit id="3" name="foobar" type="res:array" l:datatype="x-android-resource" l:index="2">\n' +
                '      <segment>\n' +
                '        <source>Two</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 1);

        test.deepEqual(reslist[0].getSourceArray(), ["Zero", "One", "Two"]);
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "androidapp");
        test.equal(reslist[0].resType, "array");
        test.ok(!reslist[0].getTargetArray());

        test.done();
    },

    testXliff20ParseWithArraysTranslated: function(test) {
        test.expect(12);

        var x = new ResourceXliff();
        test.ok(x);

        x.parse(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="foobar" type="res:array" l:datatype="x-android-resource" l:index="0">\n' +
                '      <segment>\n' +
                '        <source>Zero</source>\n' +
                '        <target>Zero</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '    <unit id="2" name="foobar" type="res:array" l:datatype="x-android-resource" l:index="1">\n' +
                '      <segment>\n' +
                '        <source>One</source>\n' +
                '        <target>Eins</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '    <unit id="3" name="foobar" type="res:array" l:datatype="x-android-resource" l:index="2">\n' +
                '      <segment>\n' +
                '        <source>Two</source>\n' +
                '        <target>Zwei</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 1);

        test.deepEqual(reslist[0].getSourceArray(), ["Zero", "One", "Two"]);
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "androidapp");
        test.equal(reslist[0].resType, "array");
        test.equal(reslist[0].getOrigin(), "source");
        test.deepEqual(reslist[0].getTargetArray(), ["Zero", "Eins", "Zwei"]);
        test.equal(reslist[0].getTargetLocale(), "de-DE");

        test.done();
    },

    testXliff20ParseWithArraysAndTranslations: function(test) {
        test.expect(20);

        var x = new ResourceXliff();
        test.ok(x);

        x.parse(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="es-US" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="res/values/arrays.xml" l:project="androidapp">\n' +
                '    <unit id="2" name="huzzah" type="res:array" l:datatype="x-android-resource" l:index="0">\n' +
                '      <segment>\n' +
                '        <source>This is element 0</source>\n' +
                '        <target>Este es 0</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '    <unit id="3" name="huzzah" type="res:array" l:datatype="x-android-resource" l:index="1">\n' +
                '      <segment>\n' +
                '        <source>This is element 1</source>\n' +
                '        <target>Este es 1</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '    <unit id="4" name="huzzah" type="res:array" l:datatype="x-android-resource" l:index="2">\n' +
                '      <segment>\n' +
                '        <source>This is element 2</source>\n' +
                '        <target>Este es 2</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '    <unit id="5" name="huzzah" type="res:array" l:datatype="x-android-resource" l:index="3">\n' +
                '      <segment>\n' +
                '        <source>This is element 3</source>\n' +
                '        <target>Este es 3</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 1);

        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getTargetLocale(), "es-US");
        test.equal(reslist[0].getKey(), "huzzah");
        test.equal(reslist[0].getPath(), "res/values/arrays.xml");
        test.equal(reslist[0].getProject(), "androidapp");
        test.equal(reslist[0].resType, "array");
        test.equal(reslist[0].getOrigin(), "source");

        var items = reslist[0].getSourceArray();

        test.equal(items.length, 4);
        test.equal(items[0], "This is element 0");
        test.equal(items[1], "This is element 1");
        test.equal(items[2], "This is element 2");
        test.equal(items[3], "This is element 3");

        items = reslist[0].getTargetArray();

        test.equal(items.length, 4);
        test.equal(items[0], "Este es 0");
        test.equal(items[1], "Este es 1");
        test.equal(items[2], "Este es 2");
        test.equal(items[3], "Este es 3");

        test.done();
    },

    testXliff20ParseWithArraysAndTranslationsPartial: function(test) {
        test.expect(20);

        var x = new ResourceXliff();
        test.ok(x);

        x.parse(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="es-US" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="res/values/arrays.xml" l:project="androidapp">\n' +
                '    <unit id="5" name="huzzah" type="res:array" l:datatype="x-android-resource" l:index="3">\n' +
                '      <segment>\n' +
                '        <source>This is element 3</source>\n' +
                '        <target>Este es 3</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 1);

        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getTargetLocale(), "es-US");
        test.equal(reslist[0].getKey(), "huzzah");
        test.equal(reslist[0].getPath(), "res/values/arrays.xml");
        test.equal(reslist[0].getProject(), "androidapp");
        test.equal(reslist[0].resType, "array");
        test.equal(reslist[0].getOrigin(), "source");

        var items = reslist[0].getSourceArray();

        test.equal(items.length, 4);
        test.equal(items[0], null);
        test.equal(items[1], null);
        test.equal(items[2], null);
        test.equal(items[3], "This is element 3");

        items = reslist[0].getTargetArray();

        test.equal(items.length, 4);
        test.equal(items[0], null);
        test.equal(items[1], null);
        test.equal(items[2], null);
        test.equal(items[3], "Este es 3");

        test.done();
    },

    testXliff20ParseWithComments: function(test) {
        test.expect(18);

        var x = new ResourceXliff();
        test.ok(x);

        x.parse(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" xmlns:l="http://ilib-js.com/loctool" srcLang="en-US">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="foobar" type="res:string">\n' +
                '      <notes>\n' +
                '        <note appliesTo="source">A very nice string</note>\n' +
                '      </notes>\n' +
                '      <segment>\n' +
                '        <source>Asdf asdf</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <unit id="2" name="huzzah" type="res:string">\n' +
                '      <notes>\n' +
                '        <note appliesTo="source">Totally awesome.</note>\n' +
                '      </notes>\n' +
                '      <segment>\n' +
                '        <source>baby baby</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist[0].getSource(), "Asdf asdf");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "androidapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getComment(), "A very nice string");
        test.equal(reslist[0].getId(), "1");

        test.equal(reslist[1].getSource(), "baby baby");
        test.equal(reslist[1].getSourceLocale(), "en-US");
        test.equal(reslist[1].getKey(), "huzzah");
        test.equal(reslist[1].getPath(), "foo/bar/j.java");
        test.equal(reslist[1].getProject(), "webapp");
        test.equal(reslist[1].resType, "string");
        test.equal(reslist[1].getComment(), "Totally awesome.");
        test.equal(reslist[1].getId(), "2");

        test.done();
    },

    testXliff20ParseWithContext: function(test) {
        test.expect(19);

        var x = new ResourceXliff();
        test.ok(x);

        x.parse(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="foobar" type="res:string" l:context="na na na">\n' +
                '      <segment>\n' +
                '        <source>Asdf asdf</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <unit id="2" name="huzzah" type="res:string" l:context="asdf">\n' +
                '      <segment>\n' +
                '        <source>baby baby</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 2);

        test.equal(reslist[0].getSource(), "Asdf asdf");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "androidapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), "1");
        test.equal(reslist[0].getContext(), "na na na");

        test.equal(reslist[1].getSource(), "baby baby");
        test.equal(reslist[1].getSourceLocale(), "en-US");
        test.equal(reslist[1].getKey(), "huzzah");
        test.equal(reslist[1].getPath(), "foo/bar/j.java");
        test.equal(reslist[1].getProject(), "webapp");
        test.equal(reslist[1].resType, "string");
        test.equal(reslist[1].getId(), "2");
        test.equal(reslist[1].getContext(), "asdf");

        test.done();
    },

    testXliff20ParseRealFile: function(test) {
        test.expect(3);

        var x = new ResourceXliff();
        test.ok(x);

        var str = fs.readFileSync("test/testfiles/test4.xliff", "utf-8");

        x.parse(str);

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 4);

        test.done();
    },

    testXliff20ParseEmptySource: function(test) {
        test.expect(12);

        var x = new ResourceXliff();
        test.ok(x);

        x.parse(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="foobar" type="res:string" l:context="na na na">\n' +
                '      <segment>\n' +
                '        <source></source>\n' +
                '        <target>Baby Baby</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <unit id="2" name="huzzah" type="res:string">\n' +
                '      <segment>\n' +
                '        <source>baby baby</source>\n' +
                '        <target>bebe bebe</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 1);

        test.equal(reslist[0].getSource(), "baby baby");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "huzzah");
        test.equal(reslist[0].getPath(), "foo/bar/j.java");
        test.equal(reslist[0].getProject(), "webapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), "2");

        test.equal(reslist[0].getTarget(), "bebe bebe");
        test.equal(reslist[0].getTargetLocale(), "de-DE");

        test.done();
    },

    testXliff20ParseEmptyTarget: function(test) {
        test.expect(23);

        var x = new ResourceXliff();
        test.ok(x);

        x.parse(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="fr-FR" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="foobar" type="res:string">\n' +
                '      <segment>\n' +
                '        <source>Asdf asdf</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <unit id="2" name="huzzah" type="res:string">\n' +
                '      <segment>\n' +
                '        <source>baby baby</source>\n' +
                '        <target></target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 2);

        test.equal(reslist[0].getSource(), "Asdf asdf");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.ok(!reslist[0].getTarget());
        test.equal(reslist[0].getTargetLocale(), "fr-FR");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "androidapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), "1");
        test.equal(reslist[0].getOrigin(), "source");

        test.equal(reslist[1].getSource(), "baby baby");
        test.equal(reslist[1].getSourceLocale(), "en-US");
        test.ok(!reslist[0].getTarget());
        test.equal(reslist[0].getTargetLocale(), "fr-FR");
        test.equal(reslist[1].getKey(), "huzzah");
        test.equal(reslist[1].getPath(), "foo/bar/j.java");
        test.equal(reslist[1].getProject(), "webapp");
        test.equal(reslist[1].resType, "string");
        test.equal(reslist[1].getId(), "2");
        test.equal(reslist[1].getOrigin(), "source");

        test.done();
    },

    testXliff20ParseEmptyTargetNoTargetLocale: function(test) {
        test.expect(23);

        var x = new ResourceXliff();
        test.ok(x);

        x.parse(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" xmlns:l="http://ilib-js.com/loctool" srcLang="en-US">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="foobar" type="res:string">\n' +
                '      <segment>\n' +
                '        <source>Asdf asdf</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <unit id="2" name="huzzah" type="res:string">\n' +
                '      <segment>\n' +
                '        <source>baby baby</source>\n' +
                '        <target></target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 2);

        test.equal(reslist[0].getSource(), "Asdf asdf");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.ok(!reslist[0].getTarget());
        test.ok(!reslist[0].getTargetLocale());
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "androidapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), "1");
        test.equal(reslist[0].getOrigin(), "source");

        test.equal(reslist[1].getSource(), "baby baby");
        test.equal(reslist[1].getSourceLocale(), "en-US");
        test.ok(!reslist[0].getTarget());
        test.ok(!reslist[0].getTargetLocale());
        test.equal(reslist[1].getKey(), "huzzah");
        test.equal(reslist[1].getPath(), "foo/bar/j.java");
        test.equal(reslist[1].getProject(), "webapp");
        test.equal(reslist[1].resType, "string");
        test.equal(reslist[1].getId(), "2");
        test.equal(reslist[1].getOrigin(), "source");

        test.done();
    },

    testXliff20ParseWithMultipleSegments: function(test) {
        test.expect(12);

        var x = new ResourceXliff();
        test.ok(x);

        x.parse(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="fr-FR" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <unit id="2" name="huzzah" type="res:string">\n' +
                '      <segment id="1">\n' +
                '        <source>seg1 </source>\n' +
                '        <target>This is segment 1. </target>\n' +
                '      </segment>\n' +
                '      <segment id="2">\n' +
                '        <source>seg2 </source>\n' +
                '        <target>This is segment 2. </target>\n' +
                '      </segment>\n' +
                '      <segment id="3">\n' +
                '        <source>seg3</source>\n' +
                '        <target>This is segment 3.</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 1);

        test.equal(reslist[0].getSource(), "seg1 seg2 seg3");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "huzzah");
        test.equal(reslist[0].getPath(), "foo/bar/j.java");
        test.equal(reslist[0].getProject(), "webapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].getId(), "2");

        test.equal(reslist[0].getTarget(), "This is segment 1. This is segment 2. This is segment 3.");
        test.equal(reslist[0].getTargetLocale(), "fr-FR");

        test.done();
    },

    testXliff20ParsePreserveSourceWhitespace: function(test) {
        test.expect(9);

        var x = new ResourceXliff();
        test.ok(x);

        x.parse(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="es-US" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="UI/AddAnotherButtonView.m" l:project="iosapp">\n' +
                '    <unit id="196" name="      Add Another" type="res:string" l:datatype="x-objective-c">\n' +
                '      <segment>\n' +
                '        <source>      Add Another</source>\n' +
                '        <target>Añadir Otro</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 1);

        test.equal(reslist[0].getSource(), "      Add Another");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "      Add Another");
        test.equal(reslist[0].getPath(), "UI/AddAnotherButtonView.m");
        test.equal(reslist[0].getProject(), "iosapp");
        test.equal(reslist[0].resType, "string");

        test.done();
    },

    testXliff20ParsePreserveTargetWhitespace: function(test) {
        test.expect(9);

        var x = new ResourceXliff();
        test.ok(x);

        x.parse(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="es-US" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="UI/AddAnotherButtonView.m" l:project="iosapp">\n' +
                '    <unit id="196" name="      Add Another" type="res:string" l:datatype="x-objective-c">\n' +
                '      <segment>\n' +
                '        <source>      Add Another</source>\n' +
                '        <target> Añadir    Otro  </target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 1);

        test.equal(reslist[0].getTarget(), " Añadir    Otro  ");
        test.equal(reslist[0].getTargetLocale(), "es-US");
        test.equal(reslist[0].getKey(), "      Add Another");
        test.equal(reslist[0].getPath(), "UI/AddAnotherButtonView.m");
        test.equal(reslist[0].getProject(), "iosapp");
        test.equal(reslist[0].resType, "string");

        test.done();
    },

    testXliff20AddResourcesWithInstances: function(test) {
        test.expect(9);

        var x = new ResourceXliff({
            version: "2.0",
            allowDups: true
        });
        test.ok(x);

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp"
        });

        var res2 = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            comment: "special translators note"
        });
        res.addInstance(res2);

        x.addResource(res);

        var reslist = x.getResources({
            reskey: "foobar"
        });

        test.ok(reslist);

        test.equal(reslist.length, 1);
        test.equal(reslist[0].getSource(), "Asdf asdf");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "webapp");
        test.ok(!reslist[0].getComment());

        test.done();
    },

    testXliff20AddMultipleResourcesAddInstances: function(test) {
        test.expect(17);

        var x = new ResourceXliff({
            version: "2.0",
            allowDups: true
        });
        test.ok(x);

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp"
        });

        x.addResource(res);

        // this one has the same source, locale, key, and file
        // so it should create an instance of the first one
        res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            comment: "blah blah blah",
            project: "webapp"
        });

        x.addResource(res);

        var reslist = x.getResources({
            reskey: "foobar"
        });

        test.ok(reslist);

        test.equal(reslist.length, 1);
        test.equal(reslist[0].getSource(), "Asdf asdf");
        test.equal(reslist[0].getSourceLocale(), "en-US");
        test.equal(reslist[0].getKey(), "foobar");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "webapp");
        test.ok(!reslist[0].getComment());

        var instances = reslist[0].getInstances();
        test.ok(instances);
        test.equal(instances.length, 1);

        test.equal(instances[0].getSource(), "Asdf asdf");
        test.equal(instances[0].getSourceLocale(), "en-US");
        test.equal(instances[0].getKey(), "foobar");
        test.equal(instances[0].getPath(), "foo/bar/asdf.java");
        test.equal(instances[0].getProject(), "webapp");
        test.equal(instances[0].getComment(), "blah blah blah");

        test.done();
    },

    testXliff20GetTextWithResourcesWithInstancesWithNoTarget: function(test) {
        test.expect(2);

        var x = new ResourceXliff({
            version: "2.0",
            allowDups: true
        });
        test.ok(x);

        var res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp"
        });

        x.addResource(res);

        // this one has the same source, locale, key, and file
        // so it should create an instance of the first one
        res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            comment: "blah blah blah",
            project: "webapp"
        });

        x.addResource(res);

        var expected =
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<xliff version="2.0" srcLang="en-US" xmlns:l="http://ilib-js.com/loctool">\n' +
            '  <file original="foo/bar/asdf.java" l:project="webapp">\n' +
            '    <group id="group_1" name="plaintext">\n' +
            '      <unit id="1" name="foobar" type="res:string" l:datatype="plaintext">\n' +
            '        <segment>\n' +
            '          <source>Asdf asdf</source>\n' +
            '        </segment>\n' +
            '      </unit>\n' +
            '      <unit id="2" name="foobar" type="res:string" l:datatype="plaintext">\n' +
            '        <notes>\n' +
            '          <note appliesTo="source">blah blah blah</note>\n' +
            '        </notes>\n' +
            '        <segment>\n' +
            '          <source>Asdf asdf</source>\n' +
            '        </segment>\n' +
            '      </unit>\n' +
            '    </group>\n' +
            '  </file>\n' +
            '</xliff>';

        var actual = x.getText();
        diff(actual, expected);

        test.equal(actual, expected);

        test.done();
    },

    testXliff20ParseCreateInstances: function(test) {
        test.expect(21);

        var x = new ResourceXliff({
            version: "2.0",
            allowDups: true
        });
        test.ok(x);

        x.parse(
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<xliff version="2.0" srcLang="en-US" trgLang="fr-FR" xmlns:l="http://ilib-js.com/loctool">\n' +
            '  <file original="/a/b/asdf.js" l:project="iosapp">\n' +
            '    <unit id="2333" name="asdf" type="res:string" l:context="asdfasdf">\n' +
            '      <notes>\n' +
            '        <note appliesTo="source">this is a comment</note>\n' +
            '      </notes>\n' +
            '      <segment>\n' +
            '        <source>bababa</source>\n' +
            '        <target>ababab</target>\n' +
            '      </segment>\n' +
            '    </unit>\n' +
            '    <unit id="2334" name="asdf" type="res:string" l:context="asdfasdf">\n' +
            '      <notes>\n' +
            '        <note appliesTo="source">this is a different comment</note>\n' +
            '      </notes>\n' +
            '      <segment>\n' +
            '        <source>bababa</source>\n' +
            '        <target>ababab</target>\n' +
            '      </segment>\n' +
            '    </unit>\n' +
            '  </file>\n' +
            '</xliff>');

        var reslist = x.getResources();

        test.ok(reslist);

        test.equal(reslist.length, 1);

        test.equal(reslist[0].getTarget(), "ababab");
        test.equal(reslist[0].getTargetLocale(), "fr-FR");
        test.equal(reslist[0].getKey(), "asdf");
        test.equal(reslist[0].getPath(), "/a/b/asdf.js");
        test.equal(reslist[0].getProject(), "iosapp");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].context, "asdfasdf");
        test.equal(reslist[0].comment, "this is a comment");

        var instances = reslist[0].getInstances();
        test.ok(instances);
        test.equal(instances.length, 1);

        test.equal(instances[0].getTarget(), "ababab");
        test.equal(instances[0].getTargetLocale(), "fr-FR");
        test.equal(instances[0].getKey(), "asdf");
        test.equal(instances[0].getPath(), "/a/b/asdf.js");
        test.equal(instances[0].getProject(), "iosapp");
        test.equal(instances[0].resType, "string");
        test.equal(instances[0].context, "asdfasdf");
        test.equal(instances[0].comment, "this is a different comment");

        test.done();
    },

    testXliff20ParseLGStyleXliff: function(test) {
        test.expect(24);

        var x = new ResourceXliff();
        test.ok(x);

        x.parse(
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

        test.ok(reslist);

        test.equal(reslist[0].getSource(), "Closed Caption Settings");
        test.equal(reslist[0].getSourceLocale(), "en-KR");
        test.equal(reslist[0].getTarget(), "자막 설정");
        test.equal(reslist[0].getTargetLocale(), "ko-KR");
        test.equal(reslist[0].getKey(), "Closed Caption Settings");
        test.equal(reslist[0].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[0].getProject(), "foo/bar/asdf.java");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].datatype, "javascript");
        test.ok(!reslist[0].getComment());
        test.equal(reslist[0].getId(), "1");

        test.equal(reslist[1].getSource(), "Low");
        test.equal(reslist[1].getSourceLocale(), "en-KR");
        test.equal(reslist[1].getTarget(), "낮음");
        test.equal(reslist[1].getTargetLocale(), "ko-KR");
        test.equal(reslist[1].getKey(), "Low");
        test.equal(reslist[1].getPath(), "foo/bar/asdf.java");
        test.equal(reslist[1].getProject(), "foo/bar/asdf.java");
        test.equal(reslist[1].resType, "string");
        test.equal(reslist[1].datatype, "javascript");
        test.ok(!reslist[1].getComment());
        test.equal(reslist[1].getId(), "2");

        test.done();
    },

    testXliff20ParseRealLGFile: function(test) {
        test.expect(37);

        var x = new ResourceXliff();
        test.ok(x);

        var str = fs.readFileSync("test/testfiles/test5.xliff", "utf-8");

        x.parse(str);

        var reslist = x.getResources();
        test.ok(reslist);
        test.equal(reslist.length, 7);

        test.equal(reslist[0].getSource(), "Closed Caption Settings");
        test.equal(reslist[0].getSourceLocale(), "en-KR");
        test.equal(reslist[0].getTarget(), "자막 설정");
        test.equal(reslist[0].getTargetLocale(), "ko-KR");
        test.equal(reslist[0].getKey(), "Closed Caption Settings");
        test.equal(reslist[0].getPath(), "settings");
        test.equal(reslist[0].getProject(), "settings");
        test.equal(reslist[0].resType, "string");
        test.equal(reslist[0].datatype, "javascript");
        test.ok(!reslist[0].getComment());
        test.equal(reslist[0].getId(), "settings_1");

        test.equal(reslist[3].getSource(), "Low");
        test.equal(reslist[3].getSourceLocale(), "en-KR");
        test.equal(reslist[3].getTarget(), "낮음");
        test.equal(reslist[3].getTargetLocale(), "ko-KR");
        test.equal(reslist[3].getKey(), "pictureControlLow_Male");
        test.equal(reslist[3].getPath(), "settings");
        test.equal(reslist[3].getProject(), "settings");
        test.equal(reslist[3].resType, "string");
        test.equal(reslist[3].datatype, "javascript");
        test.ok(!reslist[3].getComment());
        test.equal(reslist[3].getId(), "settings_1524");

        test.equal(reslist[6].getSource(), "SEARCH");
        test.equal(reslist[6].getSourceLocale(), "en-KR");
        test.equal(reslist[6].getTarget(), "검색");
        test.equal(reslist[6].getTargetLocale(), "ko-KR");
        test.equal(reslist[6].getKey(), "SEARCH");
        test.equal(reslist[6].getPath(), "settings");
        test.equal(reslist[6].getProject(), "settings");
        test.equal(reslist[6].resType, "string");
        test.equal(reslist[6].datatype, "x-qml");
        test.ok(reslist[6].getComment());
        test.equal(reslist[6].getComment(), "copy strings from voice app");
        test.equal(reslist[6].getId(), "settings_22");

        test.done();
    }
};
