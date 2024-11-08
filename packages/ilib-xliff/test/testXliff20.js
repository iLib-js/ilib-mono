/*
 * testXliff20.js - test the Xliff 2.0 object.
 *
 * Copyright © 2022-2023 JEDLSoft
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

import Xliff from "../src/Xliff.js";
import TranslationUnit from "../src/TranslationUnit.js";

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

export const testXliff20 = {
    testXliff20Constructor: function(test) {
        test.expect(1);

        var x = new Xliff({version: "2.0"});
        test.ok(x);

        test.done();
    },

    testXliff20ConstructorIsEmpty: function(test) {
        test.expect(2);

        var x = new Xliff({version: "2.0"});
        test.ok(x);

        test.equal(x.size(), 0);
        test.done();
    },

    testXliff20ConstructorRightVersion: function(test) {
        test.expect(2);

        var x = new Xliff({version: "2.0"});
        test.ok(x);

        test.equal(x.getVersion(), "2.0");
        test.done();
    },

    testXliff20ConstructorNumericVersion12: function(test) {
        test.expect(2);

        var x = new Xliff({version: 1.2});
        test.ok(x);

        test.equal(x.getVersion(), "1.2");
        test.done();
    },

    testXliff20ConstructorNumericVersion20: function(test) {
        test.expect(2);

        var x = new Xliff({version: 2.0});
        test.ok(x);

        test.equal(x.getVersion(), "2.0");
        test.done();
    },

    testXliff20ConstructorFull: function(test) {
        test.expect(8);

        var x = new Xliff({
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

    testXliff20AddTranslationUnit: function(test) {
        test.expect(11);

        const x = new Xliff({version: 2.0});
        test.ok(x);

        let tu = new TranslationUnit({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            file: "foo/bar/asdf.java",
            project: "webapp",
            resType: "string",
            state: "new",
            comment: "This is a comment",
            datatype: "java"
        });

        x.addTranslationUnit(tu);

        const tulist = x.getTranslationUnits();

        test.ok(tulist);

        test.equal(tulist.length, 1);
        test.equal(tulist[0].source, "Asdf asdf");
        test.equal(tulist[0].sourceLocale, "en-US");
        test.equal(tulist[0].key, "foobar");
        test.equal(tulist[0].file, "foo/bar/asdf.java");
        test.equal(tulist[0].state, "new");
        test.equal(tulist[0].comment, "This is a comment");
        test.equal(tulist[0].project, "webapp");
        test.equal(tulist[0].datatype, "java");

        test.done();
    },

    testXliff20AddTranslationUnitMultiple: function(test) {
        test.expect(19);

        const x = new Xliff({version: 2.0});
        test.ok(x);

        let tu = new TranslationUnit({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            file: "foo/bar/asdf.java",
            project: "webapp",
            resType: "string",
            state: "new",
            comment: "This is a comment",
            datatype: "java"
        });

        x.addTranslationUnit(tu);

        tu = new TranslationUnit({
            source: "foobar",
            sourceLocale: "en-US",
            key: "asdf",
            file: "x.java",
            project: "webapp",
            resType: "array",
            state: "translated",
            comment: "No comment",
            datatype: "javascript"
        });

        x.addTranslationUnit(tu);

        const tulist = x.getTranslationUnits();

        test.ok(tulist);

        test.equal(tulist.length, 2);
        test.equal(tulist[0].source, "Asdf asdf");
        test.equal(tulist[0].sourceLocale, "en-US");
        test.equal(tulist[0].key, "foobar");
        test.equal(tulist[0].file, "foo/bar/asdf.java");
        test.equal(tulist[0].state, "new");
        test.equal(tulist[0].comment, "This is a comment");
        test.equal(tulist[0].project, "webapp");
        test.equal(tulist[0].datatype, "java");

        test.equal(tulist[1].source, "foobar");
        test.equal(tulist[1].sourceLocale, "en-US");
        test.equal(tulist[1].key, "asdf");
        test.equal(tulist[1].file, "x.java");
        test.equal(tulist[1].state, "translated");
        test.equal(tulist[1].comment, "No comment");
        test.equal(tulist[1].project, "webapp");
        test.equal(tulist[1].datatype, "javascript");

        test.done();
    },

    testXliff20AddTranslationUnitAddSameTUTwice: function(test) {
        test.expect(11);

        const x = new Xliff({version: 2.0});
        test.ok(x);

        let tu = new TranslationUnit({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            file: "foo/bar/asdf.java",
            project: "webapp",
            resType: "string",
            state: "new",
            comment: "This is a comment",
            datatype: "java"
        });

        x.addTranslationUnit(tu);
        x.addTranslationUnit(tu); // second time should not add anything

        const tulist = x.getTranslationUnits();

        test.ok(tulist);

        test.equal(tulist.length, 1);
        test.equal(tulist[0].source, "Asdf asdf");
        test.equal(tulist[0].sourceLocale, "en-US");
        test.equal(tulist[0].key, "foobar");
        test.equal(tulist[0].file, "foo/bar/asdf.java");
        test.equal(tulist[0].state, "new");
        test.equal(tulist[0].comment, "This is a comment");
        test.equal(tulist[0].project, "webapp");
        test.equal(tulist[0].datatype, "java");

        test.done();
    },

    testXliff20AddTranslationUnits: function(test) {
        test.expect(19);

        const x = new Xliff({version: 2.0});
        test.ok(x);

        
        x.addTranslationUnits([
            new TranslationUnit({
                source: "Asdf asdf",
                sourceLocale: "en-US",
                key: "foobar",
                file: "foo/bar/asdf.java",
                project: "webapp",
                resType: "string",
                state: "new",
                comment: "This is a comment",
                datatype: "java"
            }),
            new TranslationUnit({
                source: "foobar",
                sourceLocale: "en-US",
                key: "asdf",
                file: "x.java",
                project: "webapp",
                resType: "array",
                state: "translated",
                comment: "No comment",
                datatype: "javascript"
            })
        ]);

        const tulist = x.getTranslationUnits();

        test.ok(tulist);

        test.equal(tulist.length, 2);
        test.equal(tulist[0].source, "Asdf asdf");
        test.equal(tulist[0].sourceLocale, "en-US");
        test.equal(tulist[0].key, "foobar");
        test.equal(tulist[0].file, "foo/bar/asdf.java");
        test.equal(tulist[0].state, "new");
        test.equal(tulist[0].comment, "This is a comment");
        test.equal(tulist[0].project, "webapp");
        test.equal(tulist[0].datatype, "java");

        test.equal(tulist[1].source, "foobar");
        test.equal(tulist[1].sourceLocale, "en-US");
        test.equal(tulist[1].key, "asdf");
        test.equal(tulist[1].file, "x.java");
        test.equal(tulist[1].state, "translated");
        test.equal(tulist[1].comment, "No comment");
        test.equal(tulist[1].project, "webapp");
        test.equal(tulist[1].datatype, "javascript");

        test.done();
    },

    testXliff20Size: function(test) {
        test.expect(3);

        const x = new Xliff({version: 2.0});
        test.ok(x);

        test.equal(x.size(), 0);

        x.addTranslationUnits([
            new TranslationUnit({
                source: "Asdf asdf",
                sourceLocale: "en-US",
                key: "foobar",
                file: "foo/bar/asdf.java",
                project: "webapp",
                resType: "string",
                state: "new",
                comment: "This is a comment",
                datatype: "java"
            }),
            new TranslationUnit({
                source: "foobar",
                sourceLocale: "en-US",
                key: "asdf",
                file: "x.java",
                project: "webapp",
                resType: "array",
                state: "translated",
                comment: "No comment",
                datatype: "javascript"
            })
        ]);

        test.equal(x.size(), 2);

        test.done();
    },

    testXliff20SerializeSourceOnly: function(test) {
        test.expect(2);

        const x = new Xliff({version: 2.0});
        test.ok(x);

        const tu = new TranslationUnit({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            file: "foo/bar/asdf.java",
            project: "webapp",
            resType: "string",
            state: "new",
            comment: "This is a comment",
            datatype: "java"
        })

        x.addTranslationUnit(tu);

        let actual = x.serialize();
        let expected =
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<xliff version="2.0" srcLang="en-US" xmlns:l="http://ilib-js.com/loctool">\n' +
            '  <file original="foo/bar/asdf.java" l:project="webapp">\n' +
            '    <group id="group_1" name="java">\n' +
            '      <unit id="1" name="foobar" type="res:string" l:datatype="java">\n' +
            '        <notes>\n' +
            '          <note appliesTo="source">This is a comment</note>\n' +
            '        </notes>\n' +
            '        <segment>\n' +
            '          <source>Asdf asdf</source>\n' +
            '        </segment>\n' +
            '      </unit>\n' +
            '    </group>\n' +
            '  </file>\n' +
            '</xliff>';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXliff20SerializeFull: function(test) {
        test.expect(2);

        const x = new Xliff({version: 2.0});
        test.ok(x);

        const tu = new TranslationUnit({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            target: "bam bam",
            targetLocale: "de-DE",
            key: "foobar",
            file: "foo/bar/asdf.java",
            project: "webapp",
            resType: "string",
            state: "new",
            comment: "This is a comment",
            datatype: "java"
        })

        x.addTranslationUnit(tu);

        let actual = x.serialize();
        let expected =
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
            '  <file original="foo/bar/asdf.java" l:project="webapp">\n' +
            '    <group id="group_1" name="java">\n' +
            '      <unit id="1" name="foobar" type="res:string" l:datatype="java">\n' +
            '        <notes>\n' +
            '          <note appliesTo="source">This is a comment</note>\n' +
            '        </notes>\n' +
            '        <segment>\n' +
            '          <source>Asdf asdf</source>\n' +
            '          <target state="new">bam bam</target>\n' +
            '        </segment>\n' +
            '      </unit>\n' +
            '    </group>\n' +
            '  </file>\n' +
            '</xliff>';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXliff20SerializeWithSourceAndTargetAndComment: function(test) {
        test.expect(2);

        const x = new Xliff({version: 2.0});
        test.ok(x);

        let tu = new TranslationUnit({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            target: "foobarfoo",
            targetLocale: "de-DE",
            key: "foobar",
            file: "foo/bar/asdf.java",
            project: "webapp",
            comment: "foobar is where it's at!",
            datatype: "plaintext"
        });

        x.addTranslationUnit(tu);

        tu = new TranslationUnit({
            source: "baby baby",
            sourceLocale: "en-US",
            target: "bebe bebe",
            targetLocale: "de-DE",
            key: "huzzah",
            file: "foo/bar/j.java",
            project: "webapp",
            comment: "come & enjoy it with us",
            datatype: "plaintext"
        });

        x.addTranslationUnit(tu);

        let expected =
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

        let actual = x.serialize();

        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    },

    testXliff20SerializeWithSourceOnlyAndPlurals: function(test) {
        test.expect(2);

        const x = new Xliff({version: 2.0});
        test.ok(x);

        let tu = new TranslationUnit({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            file: "foo/bar/asdf.java",
            datatype: "plaintext",
            project: "androidapp",
            targetLocale: "de-DE",
            resType: "string"
        });

        x.addTranslationUnit(tu);

        x.addTranslationUnits([
            new TranslationUnit({
                source: "0",
                sourceLocale: "en-US",
                key: "huzzah",
                file: "foo/bar/j.java",
                project: "webapp",
                targetLocale: "de-DE",
                datatype: "x-android-resource",
                quantity: "zero",
                resType: "plural",
                comment: '{"pluralForm":"zero","pluralFormOther":"huzzah"}'
            }),
            new TranslationUnit({
                source: "1",
                sourceLocale: "en-US",
                key: "huzzah",
                file: "foo/bar/j.java",
                project: "webapp",
                targetLocale: "de-DE",
                datatype: "x-android-resource",
                quantity: "one",
                resType: "plural",
                comment: '{"pluralForm":"one","pluralFormOther":"huzzah"}'
            }),
            new TranslationUnit({
                source: "few",
                sourceLocale: "en-US",
                key: "huzzah",
                file: "foo/bar/j.java",
                project: "webapp",
                targetLocale: "de-DE",
                datatype: "x-android-resource",
                quantity: "few",
                resType: "plural",
                comment: '{"pluralForm":"few","pluralFormOther":"huzzah"}'
            })
        ]);

        let actual = x.serialize();
        let expected =
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
            '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
            '    <group id="group_1" name="plaintext">\n' +
            '      <unit id="1" name="foobar" type="res:string" l:datatype="plaintext">\n' +
            '        <segment>\n' +
            '          <source>Asdf asdf</source>\n' +
            '        </segment>\n' +
            '      </unit>\n' +
            '    </group>\n' +
            '  </file>\n' +
            '  <file original="foo/bar/j.java" l:project="webapp">\n' +
            '    <group id="group_2" name="x-android-resource">\n' +
            '      <unit id="2" name="huzzah" type="res:plural" l:datatype="x-android-resource" l:category="zero">\n' +
            '        <notes>\n' +
            '          <note appliesTo="source">{"pluralForm":"zero","pluralFormOther":"huzzah"}</note>\n' +
            '        </notes>\n' +
            '        <segment>\n' +
            '          <source>0</source>\n' +
            '        </segment>\n' +
            '      </unit>\n' +
            '      <unit id="3" name="huzzah" type="res:plural" l:datatype="x-android-resource" l:category="one">\n' +
            '        <notes>\n' +
            '          <note appliesTo="source">{"pluralForm":"one","pluralFormOther":"huzzah"}</note>\n' +
            '        </notes>\n' +
            '        <segment>\n' +
            '          <source>1</source>\n' +
            '        </segment>\n' +
            '      </unit>\n' +
            '      <unit id="4" name="huzzah" type="res:plural" l:datatype="x-android-resource" l:category="few">\n' +
            '        <notes>\n' +
            '          <note appliesTo="source">{"pluralForm":"few","pluralFormOther":"huzzah"}</note>\n' +
            '        </notes>\n' +
            '        <segment>\n' +
            '          <source>few</source>\n' +
            '        </segment>\n' +
            '      </unit>\n' +
            '    </group>\n' +
            '  </file>\n' +
            '</xliff>';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXliff20SerializeWithHeader: function(test) {
        test.expect(2);

        const x = new Xliff({
            version: "2.0",
            "tool-id": "loctool",
            "tool-name": "Localization Tool",
            "tool-version": "1.2.34",
            "tool-company": "My Company, Inc.",
            copyright: "Copyright 2016, My Company, Inc. All rights reserved.",
            path: "a/b/c.xliff"
        });
        test.ok(x);

        const tu = new TranslationUnit({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            target: "baby baby",
            targetLocale: "nl-NL",
            key: "foobar",
            file: "foo/bar/asdf.java",
            datatype: "plaintext",
            project: "webapp",
            origin: "target"
        });

        x.addTranslationUnit(tu);

        let actual = x.serialize();
        let expected =
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

    testXliff20SerializeWithXMLEscaping: function(test) {
        test.expect(2);

        const x = new Xliff({version: 2.0});
        test.ok(x);

        x.addTranslationUnits([
            new TranslationUnit({
                source: "Asdf <b>asdf</b>",
                sourceLocale: "en-US",
                target: "Asdf 'quotes'",
                targetLocale: "de-DE",
                key: 'foobar "asdf"',
                file: "foo/bar/asdf.java",
                project: "androidapp",
                origin: "target",
                datatype: "plaintext"
            }),
            new TranslationUnit({
                source: "baby &lt;b&gt;baby&lt;/b&gt;",
                sourceLocale: "en-US",
                target: "baby #(test)",
                targetLocale: "de-DE",
                key: "huzzah &quot;asdf&quot; #(test)",
                file: "foo/bar/j.java",
                project: "webapp",
                origin: "target",
                datatype: "plaintext"
            })
        ]);

        let actual = x.serialize();
        let expected =
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

    testXliff20SerializeWithXMLEscapingInResname: function(test) {
        test.expect(2);

        const x = new Xliff({version: 2.0});
        test.ok(x);

        x.addTranslationUnits([
            new TranslationUnit({
                source: "Asdf <b>asdf</b>",
                sourceLocale: "en-US",
                target: "Asdf 'quotes'",
                targetLocale: "de-DE",
                key: 'foobar <i>asdf</i>',
                file: "foo/bar/asdf.java",
                project: "androidapp",
                origin: "target",
                datatype: "plaintext"
            }),
            new TranslationUnit({
                source: "baby &lt;b&gt;baby&lt;/b&gt;",
                sourceLocale: "en-US",
                target: "baby #(test)",
                targetLocale: "de-DE",
                key: "huzzah <b>asdf</b> #(test)",
                file: "foo/bar/j.java",
                project: "webapp",
                origin: "target",
                datatype: "plaintext"
            })
        ]);

        let actual = x.serialize();
        let expected =
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <group id="group_1" name="plaintext">\n' +
                '      <unit id="1" name="foobar &lt;i>asdf&lt;/i>" type="res:string" l:datatype="plaintext">\n' +
                '        <segment>\n' +
                '          <source>Asdf &lt;b&gt;asdf&lt;/b&gt;</source>\n' +
                '          <target>Asdf \'quotes\'</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <group id="group_2" name="plaintext">\n' +
                '      <unit id="2" name="huzzah &lt;b>asdf&lt;/b> #(test)" type="res:string" l:datatype="plaintext">\n' +
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

    testXliff20SerializeWithXMLEscapingWithQuotes: function(test) {
        test.expect(2);

        const x = new Xliff({version: 2.0});
        test.ok(x);

        const tu = new TranslationUnit({
            source: "Here are \"double\" and 'single' quotes.",
            sourceLocale: "en-US",
            target: "Hier zijn \"dubbel\" en 'singel' quotaties.",
            targetLocale: "nl-NL",
            key: '"double" and \'single\'',
            file: "foo/bar/asdf.java",
            project: "androidapp",
            origin: "target",
            datatype: "plaintext"
        });

        x.addTranslationUnit(tu);

        test.equal(x.serialize(),
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

    testXliff20SerializeWithEscapeCharsInResname: function(test) {
        test.expect(2);

        const x = new Xliff({version: 2.0});
        test.ok(x);

        x.addTranslationUnits([
            new TranslationUnit({
                source: "Asdf asdf",
                sourceLocale: "en-US",
                target: "Asdf translated",
                targetLocale: "de-DE",
                key: 'asdf \\n\\nasdf',
                file: "foo/bar/asdf.java",
                project: "androidapp",
                origin: "target",
                datatype: "plaintext"
            }),
            new TranslationUnit({
                source: "asdf \\t\\n\\n",
                sourceLocale: "en-US",
                target: "fdsa \\t\\n\\n fdsa\\n",
                targetLocale: "de-DE",
                key: "asdf \\t\\n\\n asdf\\n",
                file: "foo/bar/j.java",
                project: "webapp",
                origin: "target",
                datatype: "plaintext"
            })
        ]);

        let actual = x.serialize();
        let expected =
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <group id="group_1" name="plaintext">\n' +
                '      <unit id="1" name="asdf \\n\\nasdf" type="res:string" l:datatype="plaintext">\n' +
                '        <segment>\n' +
                '          <source>Asdf asdf</source>\n' +
                '          <target>Asdf translated</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <group id="group_2" name="plaintext">\n' +
                '      <unit id="2" name="asdf \\t\\n\\n asdf\\n" type="res:string" l:datatype="plaintext">\n' +
                '        <segment>\n' +
                '          <source>asdf \\t\\n\\n</source>\n' +
                '          <target>fdsa \\t\\n\\n fdsa\\n</target>\n' +
                '        </segment>\n' +
                '      </unit>\n' +
                '    </group>\n' +
                '  </file>\n' +
                '</xliff>';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXliff20SerializeWithTranslationUnitsDifferentLocales: function(test) {
        test.expect(2);

        var x = new Xliff({version: "2.0"});
        test.ok(x);

        x.addTranslationUnit(new TranslationUnit({
            "source": "bababa",
            "sourceLocale": "en-US",
            "target": "ababab",
            "targetLocale": "fr-FR",
            "key": "asdf",
            "file": "/a/b/asdf.js",
            "project": "iosapp",
            "id": 2333,
            "resType":"string",
            "origin": "source",
            "context": "asdfasdf",
            "comment": "this is a comment"
        }));

        try {
            x.addTranslationUnit(new TranslationUnit({
                "source": "a",
                "sourceLocale": "en-US",
                "target": "b",
                "targetLocale": "de-DE",
                "key": "foobar",
                "file": "/a/b/asdf.js",
                "project": "iosapp",
                "id": 2334,
                "resType":"string",
                "origin": "source",
                "context": "asdfasdf",
                "comment": "this is a comment"
            }));
        } catch (e) {
            // cannot add new units with a different source/language combo
            test.ok(e);
        }

        test.done();
    },

    testXliff20SerializeWithTranslateFlagFalse: function(test) {
        test.expect(2);

        const x = new Xliff({version: 2.0});
        test.ok(x);

        const tu = new TranslationUnit({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            target: "bam bam",
            targetLocale: "de-DE",
            key: "foobar",
            file: "foo/bar/asdf.java",
            project: "webapp",
            resType: "string",
            state: "new",
            comment: "This is a comment",
            datatype: "java",
            translate: false
        })

        x.addTranslationUnit(tu);

        let actual = x.serialize();
        let expected =
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
            '  <file original="foo/bar/asdf.java" l:project="webapp">\n' +
            '    <group id="group_1" name="java">\n' +
            '      <unit id="1" name="foobar" type="res:string" l:datatype="java" translate="false">\n' +
            '        <notes>\n' +
            '          <note appliesTo="source">This is a comment</note>\n' +
            '        </notes>\n' +
            '        <segment>\n' +
            '          <source>Asdf asdf</source>\n' +
            '          <target state="new">bam bam</target>\n' +
            '        </segment>\n' +
            '      </unit>\n' +
            '    </group>\n' +
            '  </file>\n' +
            '</xliff>';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXliff20SerializeWithTranslateFlagTrue: function(test) {
        test.expect(2);

        const x = new Xliff({version: 2.0});
        test.ok(x);

        const tu = new TranslationUnit({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            target: "bam bam",
            targetLocale: "de-DE",
            key: "foobar",
            file: "foo/bar/asdf.java",
            project: "webapp",
            resType: "string",
            state: "new",
            comment: "This is a comment",
            datatype: "java",
            translate: true
        })

        x.addTranslationUnit(tu);

        let actual = x.serialize();
        let expected =
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
            '  <file original="foo/bar/asdf.java" l:project="webapp">\n' +
            '    <group id="group_1" name="java">\n' +
            '      <unit id="1" name="foobar" type="res:string" l:datatype="java">\n' +
            '        <notes>\n' +
            '          <note appliesTo="source">This is a comment</note>\n' +
            '        </notes>\n' +
            '        <segment>\n' +
            '          <source>Asdf asdf</source>\n' +
            '          <target state="new">bam bam</target>\n' +
            '        </segment>\n' +
            '      </unit>\n' +
            '    </group>\n' +
            '  </file>\n' +
            '</xliff>';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXliff20DeserializeWithSourceOnly: function(test) {
        test.expect(25);

        const x = new Xliff({version: 2.0});
        test.ok(x);

        x.deserialize(
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

        let tulist = x.getTranslationUnits();

        test.ok(tulist);

        test.equal(tulist.length, 2);

        test.equal(tulist[0].source, "Asdf asdf");
        test.equal(tulist[0].sourceLocale, "en-US");
        test.ok(!tulist[0].target);
        test.equal(tulist[0].targetLocale, "de-DE");
        test.equal(tulist[0].key, "foobar");
        test.equal(tulist[0].file, "foo/bar/asdf.java");
        test.equal(tulist[0].project, "androidapp");
        test.equal(tulist[0].resType, "string");
        test.equal(tulist[0].id, "1");
        test.equal(typeof(tulist[0].translate), 'undefined');
        test.deepEqual(tulist[0].location, {line: 4, char: 5});

        test.equal(tulist[1].source, "baby baby");
        test.equal(tulist[1].sourceLocale, "en-US");
        test.ok(!tulist[1].target);
        test.equal(tulist[1].targetLocale, "de-DE");
        test.equal(tulist[1].key, "huzzah");
        test.equal(tulist[1].file, "foo/bar/j.java");
        test.equal(tulist[1].project, "webapp");
        test.equal(tulist[1].resType, "string");
        test.equal(tulist[1].id, "2");
        test.equal(typeof(tulist[1].translate), 'undefined');
        test.deepEqual(tulist[1].location, {line: 11, char: 5});

        test.done();
    },

    testXliff20DeserializeWithSourceAndTarget: function(test) {
        test.expect(23);

        const x = new Xliff({version: 2.0});
        test.ok(x);

        x.deserialize(
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
        let tulist = x.getTranslationUnits();
        // console.log("x is now " + JSON.stringify(x, undefined, 4));

        test.ok(tulist);

        test.equal(tulist.length, 2);

        test.equal(tulist[0].source, "Asdf asdf");
        test.equal(tulist[0].sourceLocale, "en-US");
        test.equal(tulist[0].key, "foobar");
        test.equal(tulist[0].file, "foo/bar/asdf.java");
        test.equal(tulist[0].project, "androidapp");
        test.equal(tulist[0].resType, "string");
        test.equal(tulist[0].id, "1");
        test.equal(tulist[0].target, "foobarfoo");
        test.equal(tulist[0].targetLocale, "de-DE");
        test.deepEqual(tulist[0].location, {line: 3, char: 5});

        test.equal(tulist[1].source, "baby baby");
        test.equal(tulist[1].sourceLocale, "en-US");
        test.equal(tulist[1].key, "huzzah");
        test.equal(tulist[1].file, "foo/bar/j.java");
        test.equal(tulist[1].project, "webapp");
        test.equal(tulist[1].resType, "string");
        test.equal(tulist[1].id, "2");
        test.equal(tulist[1].target, "bebe bebe");
        test.equal(tulist[1].targetLocale, "de-DE");
        test.deepEqual(tulist[1].location, {line: 11, char: 5});

        test.done();
    },

    testXliff20DeserializeWithXMLUnescaping: function(test) {
        test.expect(19);

        const x = new Xliff({version: 2.0});
        test.ok(x);

        x.deserialize(
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

        let tulist = x.getTranslationUnits();

        test.ok(tulist);

        test.equal(tulist.length, 2);

        test.equal(tulist[0].source, "Asdf <b>asdf</b>");
        test.equal(tulist[0].sourceLocale, "en-US");
        test.equal(tulist[0].key, "foobar");
        test.equal(tulist[0].file, "foo/bar/asdf.java");
        test.equal(tulist[0].project, "androidapp");
        test.equal(tulist[0].resType, "string");
        test.equal(tulist[0].id, "1");
        test.ok(!tulist[0].target);

        test.equal(tulist[1].source, "baby &lt;b&gt;baby&lt;/b&gt;");
        test.equal(tulist[1].sourceLocale, "en-US");
        test.equal(tulist[1].key, "huzzah");
        test.equal(tulist[1].file, "foo/bar/j.java");
        test.equal(tulist[1].project, "webapp");
        test.equal(tulist[1].resType, "string");
        test.equal(tulist[1].id, "2");
        test.ok(!tulist[1].target);

        test.done();
    },

    testXliff20DeserializeWithXMLUnescapingInResname: function(test) {
        test.expect(19);

        const x = new Xliff({version: 2.0});
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" xmlns:l="http://ilib-js.com/loctool" srcLang="en-US">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="foobar &lt;a>link&lt;/a>" type="res:string">\n' +
                '      <segment>\n' +
                '        <source>Asdf &lt;b&gt;asdf&lt;/b&gt;</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <unit id="2" name="&lt;b>huzzah&lt;/b>" type="res:string">\n' +
                '      <segment>\n' +
                '        <source>baby &amp;lt;b&amp;gt;baby&amp;lt;/b&amp;gt;</source>\n' +   // double escaped!
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>');

        let tulist = x.getTranslationUnits();

        test.ok(tulist);

        test.equal(tulist.length, 2);

        test.equal(tulist[0].source, "Asdf <b>asdf</b>");
        test.equal(tulist[0].sourceLocale, "en-US");
        test.equal(tulist[0].key, "foobar <a>link</a>");
        test.equal(tulist[0].file, "foo/bar/asdf.java");
        test.equal(tulist[0].project, "androidapp");
        test.equal(tulist[0].resType, "string");
        test.equal(tulist[0].id, "1");
        test.ok(!tulist[0].target);

        test.equal(tulist[1].source, "baby &lt;b&gt;baby&lt;/b&gt;");
        test.equal(tulist[1].sourceLocale, "en-US");
        test.equal(tulist[1].key, "<b>huzzah</b>");
        test.equal(tulist[1].file, "foo/bar/j.java");
        test.equal(tulist[1].project, "webapp");
        test.equal(tulist[1].resType, "string");
        test.equal(tulist[1].id, "2");
        test.ok(!tulist[1].target);

        test.done();
    },

    testXliff20DeserializeWithEscapedNewLines: function(test) {
        test.expect(17);

        const x = new Xliff({version: 2.0});
        test.ok(x);

        x.deserialize(
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

        let tulist = x.getTranslationUnits();

        test.ok(tulist);

        test.equal(tulist.length, 2);

        test.equal(tulist[0].source, "a\\nb");
        test.equal(tulist[0].sourceLocale, "en-US");
        test.equal(tulist[0].key, "foobar");
        test.equal(tulist[0].file, "foo/bar/asdf.java");
        test.equal(tulist[0].project, "androidapp");
        test.equal(tulist[0].resType, "string");
        test.equal(tulist[0].id, "1");

        test.equal(tulist[1].source, "e\\nh");
        test.equal(tulist[1].sourceLocale, "en-US");
        test.equal(tulist[1].key, "huzzah");
        test.equal(tulist[1].file, "foo/bar/j.java");
        test.equal(tulist[1].project, "webapp");
        test.equal(tulist[1].resType, "string");
        test.equal(tulist[1].id, "2");

        test.done();
    },

    testXliff20DeserializeWithEscapedNewLinesInResname: function(test) {
        test.expect(17);

        const x = new Xliff({version: 2.0});
        test.ok(x);

        x.deserialize(
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

        let tulist = x.getTranslationUnits();

        test.ok(tulist);

        test.equal(tulist.length, 2);

        test.equal(tulist[0].source, "a\\nb");
        test.equal(tulist[0].sourceLocale, "en-US");
        test.equal(tulist[0].key, "foobar\\nbar\\t");
        test.equal(tulist[0].file, "foo/bar/asdf.java");
        test.equal(tulist[0].project, "androidapp");
        test.equal(tulist[0].resType, "string");
        test.equal(tulist[0].id, "1");

        test.equal(tulist[1].source, "e\\nh");
        test.equal(tulist[1].sourceLocale, "en-US");
        test.equal(tulist[1].key, "huzzah\\n\\na plague on both your houses");
        test.equal(tulist[1].file, "foo/bar/j.java");
        test.equal(tulist[1].project, "webapp");
        test.equal(tulist[1].resType, "string");
        test.equal(tulist[1].id, "2");

        test.done();
    },

    testXliff20DeserializeWithContext: function(test) {
        test.expect(19);

        const x = new Xliff({version: 2.0});
        test.ok(x);

        x.deserialize(
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

        let tulist = x.getTranslationUnits();

        test.ok(tulist);

        test.equal(tulist.length, 2);

        test.equal(tulist[0].source, "Asdf asdf");
        test.equal(tulist[0].sourceLocale, "en-US");
        test.equal(tulist[0].key, "foobar");
        test.equal(tulist[0].file, "foo/bar/asdf.java");
        test.equal(tulist[0].project, "androidapp");
        test.equal(tulist[0].resType, "string");
        test.equal(tulist[0].id, "1");
        test.equal(tulist[0].context, "na na na");

        test.equal(tulist[1].source, "baby baby");
        test.equal(tulist[1].sourceLocale, "en-US");
        test.equal(tulist[1].key, "huzzah");
        test.equal(tulist[1].file, "foo/bar/j.java");
        test.equal(tulist[1].project, "webapp");
        test.equal(tulist[1].resType, "string");
        test.equal(tulist[1].id, "2");
        test.equal(tulist[1].context, "asdf");

        test.done();
    },

    testXliff20DeserializeEmptySource: function(test) {
        test.expect(12);

        const x = new Xliff({version: 2.0});
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="fr-FR" xmlns:l="http://ilib-js.com/loctool">\n' +
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

        let tulist = x.getTranslationUnits();

        test.ok(tulist);

        test.equal(tulist.length, 1);

        test.equal(tulist[0].source, "baby baby");
        test.equal(tulist[0].sourceLocale, "en-US");
        test.equal(tulist[0].key, "huzzah");
        test.equal(tulist[0].file, "foo/bar/j.java");
        test.equal(tulist[0].project, "webapp");
        test.equal(tulist[0].resType, "string");
        test.equal(tulist[0].id, "2");

        test.equal(tulist[0].target, "bebe bebe");
        test.equal(tulist[0].targetLocale, "fr-FR");

        test.done();
    },

    testXliff20DeserializeEmptyTarget: function(test) {
        test.expect(17);

        const x = new Xliff({version: 2.0});
        test.ok(x);

        x.deserialize(
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

        let tulist = x.getTranslationUnits();

        test.ok(tulist);

        test.equal(tulist.length, 2);

        test.equal(tulist[0].source, "Asdf asdf");
        test.equal(tulist[0].sourceLocale, "en-US");
        test.equal(tulist[0].key, "foobar");
        test.equal(tulist[0].file, "foo/bar/asdf.java");
        test.equal(tulist[0].project, "androidapp");
        test.equal(tulist[0].resType, "string");
        test.equal(tulist[0].id, "1");

        test.equal(tulist[1].source, "baby baby");
        test.equal(tulist[1].sourceLocale, "en-US");
        test.equal(tulist[1].key, "huzzah");
        test.equal(tulist[1].file, "foo/bar/j.java");
        test.equal(tulist[1].project, "webapp");
        test.equal(tulist[1].resType, "string");
        test.equal(tulist[1].id, "2");

        test.done();
    },

    testXliff20DeserializeWithMrkTagInTarget: function(test) {
        test.expect(12);

        const x = new Xliff({version: 2.0});
        test.ok(x);

        x.deserialize(
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<xliff version="2.0" srcLang="en-US" trgLang="fr-FR" xmlns:l="http://ilib-js.com/loctool">\n' +
            '  <file original="foo/bar/j.java" l:project="webapp">\n' +
            '    <unit id="2" name="huzzah" type="res:string">\n' +
            '      <segment>\n' +
            '        <source>baby baby</source>\n' +
            '        <seg-source><mrk mtype="seg" mid="4">baby baby</mrk></seg-source>\n' +
            '        <target><mrk mtype="seg" mid="4">bebe bebe</mrk></target>\n' +
            '      </segment>\n' +
            '    </unit>\n' +
            '  </file>\n' +
            '</xliff>');

        let tulist = x.getTranslationUnits();

        test.ok(tulist);

        test.equal(tulist.length, 1);

        test.equal(tulist[0].source, "baby baby");
        test.equal(tulist[0].sourceLocale, "en-US");
        test.equal(tulist[0].key, "huzzah");
        test.equal(tulist[0].file, "foo/bar/j.java");
        test.equal(tulist[0].project, "webapp");
        test.equal(tulist[0].resType, "string");
        test.equal(tulist[0].id, "2");
        test.equal(tulist[0].target, "bebe bebe");
        test.equal(tulist[0].targetLocale, "fr-FR");

        test.done();
    },

    testXliff20DeserializeWithEmptyMrkTagInTarget: function(test) {
        test.expect(10);

        const x = new Xliff({version: 2.0});
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="fr-FR" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <unit id="2" name="huzzah" type="res:string">\n' +
                '      <segment>\n' +
                '        <source>baby baby</source>\n' +
                '        <seg-source><mrk mtype="seg" mid="4">baby baby</mrk></seg-source>\n' +
                '        <target><mrk mtype="seg" mid="4"></mrk></target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>');

        let tulist = x.getTranslationUnits();

        test.ok(tulist);

        test.equal(tulist.length, 1);

        test.equal(tulist[0].source, "baby baby");
        test.equal(tulist[0].sourceLocale, "en-US");
        test.equal(tulist[0].key, "huzzah");
        test.equal(tulist[0].file, "foo/bar/j.java");
        test.equal(tulist[0].project, "webapp");
        test.equal(tulist[0].resType, "string");
        test.equal(tulist[0].id, "2");

        test.done();
    },

    testXliff20DeserializeWithMultipleMrkTagsInTargetEuro: function(test) {
        test.expect(12);

        const x = new Xliff({version: 2.0});
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="fr-FR" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <unit id="2" name="huzzah" type="res:string">\n' +
                '      <segment>\n' +
                '        <source>baby baby</source>\n' +
                '        <seg-source><mrk mtype="seg" mid="4">baby baby</mrk></seg-source>\n' +
                '        <target><mrk mtype="seg" mid="4">This is segment 1.</mrk> <mrk mtype="seg" mid="5">This is segment 2.</mrk> <mrk mtype="seg" mid="6">This is segment 3.</mrk></target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>');

        let tulist = x.getTranslationUnits();

        test.ok(tulist);

        test.equal(tulist.length, 1);

        test.equal(tulist[0].source, "baby baby");
        test.equal(tulist[0].sourceLocale, "en-US");
        test.equal(tulist[0].key, "huzzah");
        test.equal(tulist[0].file, "foo/bar/j.java");
        test.equal(tulist[0].project, "webapp");
        test.equal(tulist[0].resType, "string");
        test.equal(tulist[0].id, "2");

        test.equal(tulist[0].target, "This is segment 1. This is segment 2. This is segment 3.");
        test.equal(tulist[0].targetLocale, "fr-FR");

        test.done();
    },

    testXliff20DeserializeWithMultipleMrkTagsInTargetAsian: function(test) {
        test.expect(12);

        const x = new Xliff({version: 2.0});
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="zh-Hans-CN" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <unit id="2" name="huzzah" type="res:string">\n' +
                '      <segment>\n' +
                '        <source>baby baby</source>\n' +
                '        <seg-source><mrk mtype="seg" mid="4">baby baby</mrk></seg-source>\n' +
                '        <target><mrk mtype="seg" mid="4">This is segment 1.</mrk> <mrk mtype="seg" mid="5">This is segment 2.</mrk> <mrk mtype="seg" mid="6">This is segment 3.</mrk></target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>');

        let tulist = x.getTranslationUnits();

        test.ok(tulist);

        test.equal(tulist.length, 1);

        test.equal(tulist[0].source, "baby baby");
        test.equal(tulist[0].sourceLocale, "en-US");
        test.equal(tulist[0].key, "huzzah");
        test.equal(tulist[0].file, "foo/bar/j.java");
        test.equal(tulist[0].project, "webapp");
        test.equal(tulist[0].resType, "string");
        test.equal(tulist[0].id, "2");

        test.equal(tulist[0].target, "This is segment 1.This is segment 2.This is segment 3.");
        test.equal(tulist[0].targetLocale, "zh-Hans-CN");

        test.done();
    },

    testXliff20DeserializePreserveSourceWhitespace: function(test) {
        test.expect(9);

        const x = new Xliff({version: 2.0});
        test.ok(x);

        x.deserialize(
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

        let tulist = x.getTranslationUnits();

        test.ok(tulist);

        test.equal(tulist.length, 1);

        test.equal(tulist[0].source, "      Add Another");
        test.equal(tulist[0].sourceLocale, "en-US");
        test.equal(tulist[0].key, "      Add Another");
        test.equal(tulist[0].file, "UI/AddAnotherButtonView.m");
        test.equal(tulist[0].project, "iosapp");
        test.equal(tulist[0].resType, "string");

        test.done();
    },

    testXliff20DeserializePreserveTargetWhitespace: function(test) {
        test.expect(9);

        const x = new Xliff({version: 2.0});
        test.ok(x);

        x.deserialize(
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

        let tulist = x.getTranslationUnits();

        test.ok(tulist);

        test.equal(tulist.length, 1);

        test.equal(tulist[0].target, " Añadir    Otro  ");
        test.equal(tulist[0].targetLocale, "es-US");
        test.equal(tulist[0].key, "      Add Another");
        test.equal(tulist[0].file, "UI/AddAnotherButtonView.m");
        test.equal(tulist[0].project, "iosapp");
        test.equal(tulist[0].resType, "string");

        test.done();
    },

    testXliff20DeserializeStillAcceptsAnnotatesAttr: function(test) {
        test.expect(19);

        const x = new Xliff({
            allowDups: true,
            version: 2.0
        });
        test.ok(x);

        x.deserialize(
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
            '        <note appliesTo="target">this is a different comment</note>\n' +
            '      </notes>\n' +
            '      <segment>\n' +
            '        <source>bababa</source>\n' +
            '        <target>ababab</target>\n' +
            '      </segment>\n' +
            '    </unit>\n' +
            '  </file>\n' +
            '</xliff>');

        let tulist = x.getTranslationUnits();

        test.ok(tulist);

        test.equal(tulist.length, 2);

        test.equal(tulist[0].target, "ababab");
        test.equal(tulist[0].targetLocale, "fr-FR");
        test.equal(tulist[0].key, "asdf");
        test.equal(tulist[0].file, "/a/b/asdf.js");
        test.equal(tulist[0].project, "iosapp");
        test.equal(tulist[0].resType, "string");
        test.equal(tulist[0].context, "asdfasdf");
        test.equal(tulist[0].comment, "this is a comment");

        test.equal(tulist[1].target, "ababab");
        test.equal(tulist[1].targetLocale, "fr-FR");
        test.equal(tulist[1].key, "asdf");
        test.equal(tulist[1].file, "/a/b/asdf.js");
        test.equal(tulist[1].project, "iosapp");
        test.equal(tulist[1].resType, "string");
        test.equal(tulist[1].context, "asdfasdf");
        test.equal(tulist[1].comment, "this is a different comment");

        test.done();
    },

    testXliffGetLinesDefault: function(test) {
        test.expect(2);

        const x = new Xliff({
            allowDups: true,
            version: 2.0
        });
        test.ok(x);

        // default value
        test.equal(x.getLines(), 0);
        test.done();
    },

    testXliffGetBytesDefault: function(test) {
        test.expect(2);

        const x = new Xliff({
            allowDups: true,
            version: 2.0
        });
        test.ok(x);

        // default value
        test.equal(x.getBytes(), 0);
        test.done();
    },

    testXliffGetLinesDeserialize: function(test) {
        test.expect(3);

        const x = new Xliff({
            allowDups: true,
            version: 2.0
        });
        test.ok(x);

        test.equal(x.getLines(), 0);

        x.deserialize(
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
            '        <note appliesTo="target">this is a different comment</note>\n' +
            '      </notes>\n' +
            '      <segment>\n' +
            '        <source>bababa</source>\n' +
            '        <target>ababab</target>\n' +
            '      </segment>\n' +
            '    </unit>\n' +
            '  </file>\n' +
            '</xliff>');

        test.equal(x.getLines(), 23);
        test.done();
    },

    testXliffGetLinesSerialize: function(test) {
        test.expect(4);

        const x = new Xliff({version: 2.0});
        test.ok(x);

        test.equal(x.getLines(), 0);

        x.addTranslationUnits([
            new TranslationUnit({
                source: "Asdf asdf",
                sourceLocale: "en-US",
                target: "Asdf",
                targetLocale: "de-DE",
                key: 'foobar asdf',
                file: "foo/bar/asdf.java",
                project: "androidapp",
                origin: "target",
                datatype: "plaintext"
            }),
            new TranslationUnit({
                source: "baby baby",
                sourceLocale: "en-US",
                target: "baby",
                targetLocale: "de-DE",
                key: "huzzah asdf test",
                file: "foo/bar/j.java",
                project: "webapp",
                origin: "target",
                datatype: "plaintext"
            })
        ]);

        let actual = x.serialize();
        test.ok(actual);
        test.equal(x.getLines(), 23);

        test.done();
    },

    testXliffGetBytesDeserialize: function(test) {
        test.expect(3);

        const x = new Xliff({
            allowDups: true,
            version: 2.0
        });
        test.ok(x);

        test.equal(x.getBytes(), 0);

        x.deserialize(
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
            '        <note appliesTo="target">this is a different comment</note>\n' +
            '      </notes>\n' +
            '      <segment>\n' +
            '        <source>bababa</source>\n' +
            '        <target>ababab</target>\n' +
            '      </segment>\n' +
            '    </unit>\n' +
            '  </file>\n' +
            '</xliff>');

        test.equal(x.getBytes(), 746);
        test.done();
    },

    testXliffGetBytesSerialize: function(test) {
        test.expect(4);

        const x = new Xliff({version: 2.0});
        test.ok(x);

        test.equal(x.getBytes(), 0);

        x.addTranslationUnits([
            new TranslationUnit({
                source: "Asdf asdf",
                sourceLocale: "en-US",
                target: "Asdf",
                targetLocale: "de-DE",
                key: 'foobar asdf',
                file: "foo/bar/asdf.java",
                project: "androidapp",
                origin: "target",
                datatype: "plaintext"
            }),
            new TranslationUnit({
                source: "baby baby",
                sourceLocale: "en-US",
                target: "baby",
                targetLocale: "de-DE",
                key: "huzzah asdf test",
                file: "foo/bar/j.java",
                project: "webapp",
                origin: "target",
                datatype: "plaintext"
            })
        ]);

        let actual = x.serialize();
        test.ok(actual);
        test.equal(x.getBytes(), 788);

        test.done();
    },

    testXliff20DeserializeWithTranslateFlagFalse: function(test) {
        test.expect(13);

        const x = new Xliff({version: 2.0});
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="foobar" type="res:string" translate="false">\n' +
                '      <segment>\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>foobarfoo</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>');

        // console.log("x is " + JSON.stringify(x, undefined, 4));
        let tulist = x.getTranslationUnits();
        // console.log("x is now " + JSON.stringify(x, undefined, 4));

        test.ok(tulist);

        test.equal(tulist.length, 1);

        test.equal(tulist[0].source, "Asdf asdf");
        test.equal(tulist[0].sourceLocale, "en-US");
        test.equal(tulist[0].key, "foobar");
        test.equal(tulist[0].file, "foo/bar/asdf.java");
        test.equal(tulist[0].project, "androidapp");
        test.equal(tulist[0].resType, "string");
        test.equal(tulist[0].id, "1");
        test.equal(tulist[0].target, "foobarfoo");
        test.equal(tulist[0].targetLocale, "de-DE");
        test.equal(tulist[0].translate, false);

        test.done();
    },

    testXliff20DeserializeWithTranslateFlagTrue: function(test) {
        test.expect(13);

        const x = new Xliff({version: 2.0});
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="foobar" type="res:string" translate="true">\n' +
                '      <segment>\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>foobarfoo</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>');

        // console.log("x is " + JSON.stringify(x, undefined, 4));
        let tulist = x.getTranslationUnits();
        // console.log("x is now " + JSON.stringify(x, undefined, 4));

        test.ok(tulist);

        test.equal(tulist.length, 1);

        test.equal(tulist[0].source, "Asdf asdf");
        test.equal(tulist[0].sourceLocale, "en-US");
        test.equal(tulist[0].key, "foobar");
        test.equal(tulist[0].file, "foo/bar/asdf.java");
        test.equal(tulist[0].project, "androidapp");
        test.equal(tulist[0].resType, "string");
        test.equal(tulist[0].id, "1");
        test.equal(tulist[0].target, "foobarfoo");
        test.equal(tulist[0].targetLocale, "de-DE");
        test.equal(typeof(tulist[0].translate), 'undefined');

        test.done();
    },

    testXliff20DeserializeWithTranslateFlagNo: function(test) {
        test.expect(13);

        const x = new Xliff({version: 2.0});
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="foobar" type="res:string" translate="no">\n' +
                '      <segment>\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>foobarfoo</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '</xliff>');

        // console.log("x is " + JSON.stringify(x, undefined, 4));
        let tulist = x.getTranslationUnits();
        // console.log("x is now " + JSON.stringify(x, undefined, 4));

        test.ok(tulist);

        test.equal(tulist.length, 1);

        test.equal(tulist[0].source, "Asdf asdf");
        test.equal(tulist[0].sourceLocale, "en-US");
        test.equal(tulist[0].key, "foobar");
        test.equal(tulist[0].file, "foo/bar/asdf.java");
        test.equal(tulist[0].project, "androidapp");
        test.equal(tulist[0].resType, "string");
        test.equal(tulist[0].id, "1");
        test.equal(tulist[0].target, "foobarfoo");
        test.equal(tulist[0].targetLocale, "de-DE");
        test.equal(tulist[0].translate, false);

        test.done();
    }
};
