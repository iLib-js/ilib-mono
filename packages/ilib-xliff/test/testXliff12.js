/*
 * testXliff12.js - test the Xliff object with v1.2 xliff files
 *
 * Copyright © 2016-2017, 2019-2023 HealthTap, Inc. and JEDLSoft
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
    let min = Math.min(a.length, b.length);

    for (let i = 0; i < min; i++) {
        if (a[i] !== b[i]) {
            console.log("Found difference at character " + i);
            console.log("a: " + a.substring(i));
            console.log("b: " + b.substring(i));
            break;
        }
    }
}

export const testXliff12 = {
    testXliffConstructor: function(test) {
        test.expect(1);

        const x = new Xliff();
        test.ok(x);

        test.done();
    },

    testXliffConstructorIsEmpty: function(test) {
        test.expect(2);

        const x = new Xliff();
        test.ok(x);

        test.equal(x.size(), 0);

        test.done();
    },

    testXliffConstructorFull: function(test) {
        test.expect(7);

        const x = new Xliff({
            "tool-id": "loctool",
            "tool-name": "Localization Tool",
            "tool-version": "1.2.34",
            "tool-company": "My Company, Inc.",
            copyright: "Copyright 2016, My Company, Inc. All rights reserved.",
            path: "a/b/c.xliff"
        });
        test.ok(x);

        test.equal(x["tool-id"], "loctool");
        test.equal(x["tool-name"], "Localization Tool"),
        test.equal(x["tool-version"], "1.2.34"),
        test.equal(x["tool-company"], "My Company, Inc."),
        test.equal(x.copyright, "Copyright 2016, My Company, Inc. All rights reserved."),
        test.equal(x.path, "a/b/c.xliff");

        test.done();
    },

    testXliffGetVersionDefault: function(test) {
        test.expect(2);

        const x = new Xliff();
        test.ok(x);
        
        test.equal(x.getVersion(), "1.2");

        test.done();
    },

    testXliffGetVersion12: function(test) {
        test.expect(2);

        const x = new Xliff({
            version: "1.2"
        });
        test.ok(x);
        
        test.equal(x.getVersion(), "1.2");

        test.done();
    },

    testXliffGetVersion20: function(test) {
        test.expect(2);

        const x = new Xliff({
            version: "2.0"
        });
        test.ok(x);
        
        test.equal(x.getVersion(), "2.0");

        test.done();
    },

    testXliffAddTranslationUnit: function(test) {
        test.expect(11);

        const x = new Xliff();
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

    testXliffAddTranslationUnitMultiple: function(test) {
        test.expect(19);

        const x = new Xliff();
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

    testXliffAddTranslationUnitAddSameTUTwice: function(test) {
        test.expect(11);

        const x = new Xliff();
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

    testXliffAddTranslationUnits: function(test) {
        test.expect(19);

        const x = new Xliff();
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

    testXliffSize: function(test) {
        test.expect(3);

        const x = new Xliff();
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

    testXliffSerializeSourceOnly: function(test) {
        test.expect(2);

        const x = new Xliff();
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
            '<xliff version="1.2">\n' +
            '  <file original="foo/bar/asdf.java" source-language="en-US" product-name="webapp">\n' +
            '    <body>\n' +
            '      <trans-unit id="1" resname="foobar" restype="string" datatype="java">\n' +
            '        <source>Asdf asdf</source>\n' +
            '        <note>This is a comment</note>\n' +
            '      </trans-unit>\n' +
            '    </body>\n' +
            '  </file>\n' +
            '</xliff>';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXliffSerializeFull: function(test) {
        test.expect(2);

        const x = new Xliff();
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
            '<xliff version="1.2">\n' +
            '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="webapp">\n' +
            '    <body>\n' +
            '      <trans-unit id="1" resname="foobar" restype="string" datatype="java">\n' +
            '        <source>Asdf asdf</source>\n' +
            '        <target state="new">bam bam</target>\n' +
            '        <note>This is a comment</note>\n' +
            '      </trans-unit>\n' +
            '    </body>\n' +
            '  </file>\n' +
            '</xliff>';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXliffSerializeWithSourceAndTargetAndComment: function(test) {
        test.expect(2);

        const x = new Xliff();
        test.ok(x);

        let tu = new TranslationUnit({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            target: "foobarfoo",
            targetLocale: "de-DE",
            key: "foobar",
            file: "foo/bar/asdf.java",
            project: "webapp",
            comment: "foobar is where it's at!"
        });

        x.addTranslationUnit(tu);

        tu = new TranslationUnit({
            source: "baby baby",
            sourceLocale: "en-US",
            target: "bebe bebe",
            targetLocale: "fr-FR",
            key: "huzzah",
            file: "foo/bar/j.java",
            project: "webapp",
            comment: "come & enjoy it with us"
        });

        x.addTranslationUnit(tu);

        let expected =
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string">\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>foobarfoo</target>\n' +
                '        <note>foobar is where it\'s at!</note>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source>baby baby</source>\n' +
                '        <target>bebe bebe</target>\n' +
                '        <note>come &amp; enjoy it with us</note>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';

        let actual = x.serialize();

        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    },

    testXliffSerializeWithSourceOnlyAndPlurals: function(test) {
        test.expect(2);

        const x = new Xliff();
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
                targetLocale: "fr-FR",
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
                targetLocale: "fr-FR",
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
                targetLocale: "fr-FR",
                datatype: "x-android-resource",
                quantity: "few",
                resType: "plural",
                comment: '{"pluralForm":"few","pluralFormOther":"huzzah"}'
            })
        ]);

        let actual = x.serialize();
        let expected =
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<xliff version="1.2">\n' +
            '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="androidapp">\n' +
            '    <body>\n' +
            '      <trans-unit id="1" resname="foobar" restype="string" datatype="plaintext">\n' +
            '        <source>Asdf asdf</source>\n' +
            '      </trans-unit>\n' +
            '    </body>\n' +
            '  </file>\n' +
            '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="webapp">\n' +
            '    <body>\n' +
            '      <trans-unit id="2" resname="huzzah" restype="plural" datatype="x-android-resource" extype="zero">\n' +
            '        <source>0</source>\n' +
            '        <note>{"pluralForm":"zero","pluralFormOther":"huzzah"}</note>\n' +
            '      </trans-unit>\n' +
            '      <trans-unit id="3" resname="huzzah" restype="plural" datatype="x-android-resource" extype="one">\n' +
            '        <source>1</source>\n' +
            '        <note>{"pluralForm":"one","pluralFormOther":"huzzah"}</note>\n' +
            '      </trans-unit>\n' +
            '      <trans-unit id="4" resname="huzzah" restype="plural" datatype="x-android-resource" extype="few">\n' +
            '        <source>few</source>\n' +
            '        <note>{"pluralForm":"few","pluralFormOther":"huzzah"}</note>\n' +
            '      </trans-unit>\n' +
            '    </body>\n' +
            '  </file>\n' +
            '</xliff>';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXliffSerializeWithHeader: function(test) {
        test.expect(2);

        const x = new Xliff({
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
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="nl-NL" product-name="webapp">\n' +
                '    <header>\n' +
                '      <tool tool-id="loctool" tool-name="Localization Tool" tool-version="1.2.34" tool-company="My Company, Inc." copyright="Copyright 2016, My Company, Inc. All rights reserved."/>\n' +
                '    </header>\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string" datatype="plaintext">\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>baby baby</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXliffSerializeWithXMLEscaping: function(test) {
        test.expect(2);

        const x = new Xliff();
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
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar &quot;asdf&quot;" restype="string" datatype="plaintext">\n' +
                '        <source>Asdf &lt;b&gt;asdf&lt;/b&gt;</source>\n' +
                '        <target>Asdf \'quotes\'</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="de-DE" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah &amp;quot;asdf&amp;quot; #(test)" restype="string" datatype="plaintext">\n' +
                '        <source>baby &amp;lt;b&amp;gt;baby&amp;lt;/b&amp;gt;</source>\n' +   // double escaped!
                '        <target>baby #(test)</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXliffSerializeWithXMLEscapingInResname: function(test) {
        test.expect(2);

        const x = new Xliff();
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
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar &lt;i>asdf&lt;/i>" restype="string" datatype="plaintext">\n' +
                '        <source>Asdf &lt;b&gt;asdf&lt;/b&gt;</source>\n' +
                '        <target>Asdf \'quotes\'</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="de-DE" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah &lt;b>asdf&lt;/b> #(test)" restype="string" datatype="plaintext">\n' +
                '        <source>baby &amp;lt;b&amp;gt;baby&amp;lt;/b&amp;gt;</source>\n' +   // double escaped!
                '        <target>baby #(test)</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXliffSerializeWithXMLEscapingWithQuotes: function(test) {
        test.expect(2);

        const x = new Xliff();
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
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="nl-NL" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="&quot;double&quot; and &apos;single&apos;" restype="string" datatype="plaintext">\n' +
                '        <source>Here are "double" and \'single\' quotes.</source>\n' +
                '        <target>Hier zijn "dubbel" en \'singel\' quotaties.</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        test.done();
    },

    testXliffSerializeWithEscapeCharsInResname: function(test) {
        test.expect(2);

        const x = new Xliff();
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
                source: "asdf \\t\\n\\n asdf\\n",
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
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="asdf \\n\\nasdf" restype="string" datatype="plaintext">\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>Asdf translated</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="de-DE" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="asdf \\t\\n\\n asdf\\n" restype="string" datatype="plaintext">\n' +
                '        <source>asdf \\t\\n\\n asdf\\n</source>\n' +
                '        <target>fdsa \\t\\n\\n fdsa\\n</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXliffSerializeWithTranslationUnitsDifferentLocales: function(test) {
        test.expect(2);

        const x = new Xliff();
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

        let actual = x.serialize();
        let expected =
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="/a/b/asdf.js" source-language="en-US" target-language="de-DE" product-name="iosapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2334" resname="foobar" restype="string" x-context="asdfasdf">\n' +
                '        <source>a</source>\n' +
                '        <target>b</target>\n' +
                '        <note>this is a comment</note>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="/a/b/asdf.js" source-language="en-US" target-language="fr-FR" product-name="iosapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2333" resname="asdf" restype="string" x-context="asdfasdf">\n' +
                '        <source>bababa</source>\n' +
                '        <target>ababab</target>\n' +
                '        <note>this is a comment</note>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';

        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    },

    testXliffSerializeWithTranslateFlagFalse: function(test) {
        test.expect(2);

        const x = new Xliff();
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
            '<xliff version="1.2">\n' +
            '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="webapp">\n' +
            '    <body>\n' +
            '      <trans-unit id="1" resname="foobar" restype="string" datatype="java" translate="false">\n' +
            '        <source>Asdf asdf</source>\n' +
            '        <target state="new">bam bam</target>\n' +
            '        <note>This is a comment</note>\n' +
            '      </trans-unit>\n' +
            '    </body>\n' +
            '  </file>\n' +
            '</xliff>';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXliffSerializeWithTranslateFlagTrue: function(test) {
        test.expect(2);

        const x = new Xliff();
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
            '<xliff version="1.2">\n' +
            '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="webapp">\n' +
            '    <body>\n' +
            '      <trans-unit id="1" resname="foobar" restype="string" datatype="java">\n' +
            '        <source>Asdf asdf</source>\n' +
            '        <target state="new">bam bam</target>\n' +
            '        <note>This is a comment</note>\n' +
            '      </trans-unit>\n' +
            '    </body>\n' +
            '  </file>\n' +
            '</xliff>';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXliffDeserializeWithSourceOnly: function(test) {
        test.expect(23);

        const x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string" datatype="plaintext">\n' +
                '        <source>Asdf asdf</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string" datatype="plaintext">\n' +
                '        <source>baby baby</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
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
        test.deepEqual(tulist[0].location, {line: 4, char: 7});

        test.equal(tulist[1].source, "baby baby");
        test.equal(tulist[1].sourceLocale, "en-US");
        test.ok(!tulist[1].target);
        test.equal(tulist[1].targetLocale, "fr-FR");
        test.equal(tulist[1].key, "huzzah");
        test.equal(tulist[1].file, "foo/bar/j.java");
        test.equal(tulist[1].project, "webapp");
        test.equal(tulist[1].resType, "string");
        test.equal(tulist[1].id, "2");
        test.deepEqual(tulist[1].location, {line: 11, char: 7});

        test.done();
    },

    testXliffDeserializeWithSourceAndTarget: function(test) {
        test.expect(25);

        const x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string">\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>foobarfoo</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source>baby baby</source>\n' +
                '        <target>bebe bebe</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
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
        test.equal(typeof(tulist[0].translate), 'undefined');
        test.deepEqual(tulist[0].location, {line: 4, char: 7});

        test.equal(tulist[1].source, "baby baby");
        test.equal(tulist[1].sourceLocale, "en-US");
        test.equal(tulist[1].key, "huzzah");
        test.equal(tulist[1].file, "foo/bar/j.java");
        test.equal(tulist[1].project, "webapp");
        test.equal(tulist[1].resType, "string");
        test.equal(tulist[1].id, "2");
        test.equal(tulist[1].target, "bebe bebe");
        test.equal(tulist[1].targetLocale, "fr-FR");
        test.equal(typeof(tulist[1].translate), 'undefined');
        test.deepEqual(tulist[1].location, {line: 12, char: 7});

        test.done();
    },

    testXliffDeserializeWithXMLUnescaping: function(test) {
        test.expect(21);

        const x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string">\n' +
                '        <source>Asdf &lt;b&gt;asdf&lt;/b&gt;</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source>baby &amp;lt;b&amp;gt;baby&amp;lt;/b&amp;gt;</source>\n' +   // double escaped!
                '      </trans-unit>\n' +
                '    </body>\n' +
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
        test.deepEqual(tulist[0].location, {line: 4, char: 7});

        test.equal(tulist[1].source, "baby &lt;b&gt;baby&lt;/b&gt;");
        test.equal(tulist[1].sourceLocale, "en-US");
        test.equal(tulist[1].key, "huzzah");
        test.equal(tulist[1].file, "foo/bar/j.java");
        test.equal(tulist[1].project, "webapp");
        test.equal(tulist[1].resType, "string");
        test.equal(tulist[1].id, "2");
        test.ok(!tulist[1].target);
        test.deepEqual(tulist[1].location, {line: 11, char: 7});

        test.done();
    },

    testXliffDeserializeWithXMLUnescapingInResname: function(test) {
        test.expect(19);

        const x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar &lt;a>link&lt;/a>" restype="string">\n' +
                '        <source>Asdf &lt;b&gt;asdf&lt;/b&gt;</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="&lt;b>huzzah&lt;/b>" restype="string">\n' +
                '        <source>baby &amp;lt;b&amp;gt;baby&amp;lt;/b&amp;gt;</source>\n' +   // double escaped!
                '      </trans-unit>\n' +
                '    </body>\n' +
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

    testXliffDeserializeWithEscapedNewLines: function(test) {
        test.expect(17);

        const x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="en-CA" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string">\n' +
                '        <source>a\\nb</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="en-CA" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source>e\\nh</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
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

    testXliffDeserializeWithEscapedNewLinesInResname: function(test) {
        test.expect(17);

        const x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="en-CA" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar\\n\\nasdf" restype="string">\n' +
                '        <source>a\\nb</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="en-CA" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah\\t\\n" restype="string">\n' +
                '        <source>e\\nh</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        let tulist = x.getTranslationUnits();

        test.ok(tulist);

        test.equal(tulist.length, 2);

        test.equal(tulist[0].source, "a\\nb");
        test.equal(tulist[0].sourceLocale, "en-US");
        test.equal(tulist[0].key, "foobar\\n\\nasdf");
        test.equal(tulist[0].file, "foo/bar/asdf.java");
        test.equal(tulist[0].project, "androidapp");
        test.equal(tulist[0].resType, "string");
        test.equal(tulist[0].id, "1");

        test.equal(tulist[1].source, "e\\nh");
        test.equal(tulist[1].sourceLocale, "en-US");
        test.equal(tulist[1].key, "huzzah\\t\\n");
        test.equal(tulist[1].file, "foo/bar/j.java");
        test.equal(tulist[1].project, "webapp");
        test.equal(tulist[1].resType, "string");
        test.equal(tulist[1].id, "2");

        test.done();
    },

    testXliffDeserializeWithContext: function(test) {
        test.expect(19);

        const x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string" x-context="na na na">\n' +
                '        <source>Asdf asdf</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string" x-context="asdf">\n' +
                '        <source>baby baby</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
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

    testXliffDeserializeEmptySource: function(test) {
        test.expect(12);

        const x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string" x-context="na na na">\n' +
                '        <source></source>\n' +
                '        <target>Baby Baby</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source>baby baby</source>\n' +
                '        <target>bebe bebe</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
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

    testXliffDeserializeEmptyTarget: function(test) {
        test.expect(17);

        const x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string">\n' +
                '        <source>Asdf asdf</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source>baby baby</source>\n' +
                '        <target></target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
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

    testXliffDeserializeWithMrkTagInTarget: function(test) {
        test.expect(12);

        const x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source>baby baby</source><seg-source><mrk mtype="seg" mid="4">baby baby</mrk></seg-source><target><mrk mtype="seg" mid="4">bebe bebe</mrk></target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
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

    testXliffDeserializeWithEmptyMrkTagInTarget: function(test) {
        test.expect(10);

        const x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source>baby baby</source><seg-source><mrk mtype="seg" mid="4">baby baby</mrk></seg-source><target><mrk mtype="seg" mid="4"/></target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
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

    testXliffDeserializeWithMultipleMrkTagsInTarget: function(test) {
        test.expect(12);

        const x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source>baby baby</source><seg-source><mrk mtype="seg" mid="4">baby baby</mrk></seg-source><target><mrk mtype="seg" mid="4">This is segment 1.</mrk> <mrk mtype="seg" mid="5">This is segment 2.</mrk> <mrk mtype="seg" mid="6">This is segment 3.</mrk></target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
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

    testXliffDeserializeWithMultipleMrkTagsInTargetAsian: function(test) {
        test.expect(12);

        const x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="zh-Hans-CN" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source>baby baby</source><seg-source><mrk mtype="seg" mid="4">baby baby</mrk></seg-source><target><mrk mtype="seg" mid="4">This is segment 1.</mrk> <mrk mtype="seg" mid="5">This is segment 2.</mrk> <mrk mtype="seg" mid="6">This is segment 3.</mrk></target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
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
        // regardless of the target locale, preserve whitespace between mrk tags if it exists
        test.equal(tulist[0].target, "This is segment 1. This is segment 2. This is segment 3.");
        test.equal(tulist[0].targetLocale, "zh-Hans-CN");

        test.done();
    },

    testXliffDeserializePreserveWhitespaceBetweenInlineElementsInSource: function(test) {
        test.expect(12);

        const x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source><g id="1">This is group 1.</g>\n<g id="2">This is group 2.</g> <g id="3">This is group 3.</g></source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        let tulist = x.getTranslationUnits();

        test.ok(tulist);

        test.equal(tulist.length, 1);

        test.equal(tulist[0].source, "This is group 1.\nThis is group 2. This is group 3.");
        test.equal(tulist[0].sourceLocale, "en-US");
        test.equal(tulist[0].key, "huzzah");
        test.equal(tulist[0].file, "foo/bar/j.java");
        test.equal(tulist[0].project, "webapp");
        test.equal(tulist[0].resType, "string");
        test.equal(tulist[0].id, "2");

        test.ok(!tulist[0].target);
        test.equal(tulist[0].targetLocale, "");

        test.done();
    },

    testXliffDeserializePreserveWhitespaceBetweenInlineElementsInTarget: function(test) {
        test.expect(12);

        const x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source>baby baby</source>\n' +
                '        <seg-source><mrk mtype="seg" mid="4">baby baby</mrk></seg-source>\n'+
                '        <target><mrk mtype="seg" mid="4">This is segment 1.</mrk>\n'+
                '<mrk mtype="seg" mid="5">This is segment 2.</mrk> <mrk mtype="seg" mid="6">This is segment 3.</mrk></target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
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

        test.equal(tulist[0].target, "This is segment 1.\nThis is segment 2. This is segment 3.");
        test.equal(tulist[0].targetLocale, "fr-FR");

        test.done();
    },

    testXliffDeserializeWithXTagInSource: function(test) {
        test.expect(12);

        const x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source>Less-than sign (<x id="1" equiv-text="&lt;"/>) is not allowed in XLIFF.</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        let tulist = x.getTranslationUnits();

        test.ok(tulist);

        test.equal(tulist.length, 1);

        test.equal(tulist[0].source, "Less-than sign (<) is not allowed in XLIFF.");
        test.equal(tulist[0].sourceLocale, "en-US");
        test.equal(tulist[0].key, "huzzah");
        test.equal(tulist[0].file, "foo/bar/j.java");
        test.equal(tulist[0].project, "webapp");
        test.equal(tulist[0].resType, "string");
        test.equal(tulist[0].id, "2");

        test.ok(!tulist[0].target);
        test.equal(tulist[0].targetLocale, "");

        test.done();
    },

    testXliffDeserializeWithXTagInSourceAndTarget: function(test) {
        test.expect(12);

        const x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source>Less-than sign (<x id="1" equiv-text="&lt;"/>) is not allowed in XLIFF.</source>\n' +
                '        <target>Le signe inférieur (<x id="1" equiv-text="&lt;"/>) n\'est pas autorisé dans XLIFF.</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        let tulist = x.getTranslationUnits();

        test.ok(tulist);

        test.equal(tulist.length, 1);

        test.equal(tulist[0].source, "Less-than sign (<) is not allowed in XLIFF.");
        test.equal(tulist[0].sourceLocale, "en-US");
        test.equal(tulist[0].key, "huzzah");
        test.equal(tulist[0].file, "foo/bar/j.java");
        test.equal(tulist[0].project, "webapp");
        test.equal(tulist[0].resType, "string");
        test.equal(tulist[0].id, "2");

        test.equal(tulist[0].target, "Le signe inférieur (<) n\'est pas autorisé dans XLIFF.");
        test.equal(tulist[0].targetLocale, "fr-FR");

        test.done();
    },

    testXliffDeserializeInlineTagWithContent: function(test) {
        test.expect(12);

        const x = new Xliff();
        test.ok(x);

        // example based on https://www.gala-global.org/tmx-14b:
        // <B>Bold <I>Bold and Italic</B> Italics</I>
        //
        // note that non-well-formedness is intentional here (as per the XLIFF spec for <bpt> and <ept> elements)
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source><bpt id="1">&lt;B></bpt>Bold <bpt id="2">&lt;I></bpt>Bold and Italic<ept id="1">&lt;/B></ept> Italics<ept id="2">&lt;/I></ept></source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        let tulist = x.getTranslationUnits();

        test.ok(tulist);

        test.equal(tulist.length, 1);

        test.equal(tulist[0].source, "<B>Bold <I>Bold and Italic</B> Italics</I>");
        test.equal(tulist[0].sourceLocale, "en-US");
        test.equal(tulist[0].key, "huzzah");
        test.equal(tulist[0].file, "foo/bar/j.java");
        test.equal(tulist[0].project, "webapp");
        test.equal(tulist[0].resType, "string");
        test.equal(tulist[0].id, "2");

        test.ok(!tulist[0].target);
        test.equal(tulist[0].targetLocale, "");

        test.done();
    },

    testXliffDeserializeInlineTagPreferContentOverEquivText: function(test) {
        test.expect(12);

        const x = new Xliff();
        test.ok(x);

        // example based on https://www.gala-global.org/tmx-14b:
        // The icon <img src="testNode.gif"/> represents a conditional node.
        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source>The icon <ph x="1" equiv-text="">&lt;img src="testNode.gif"/></ph> represents a conditional node.</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        let tulist = x.getTranslationUnits();

        test.ok(tulist);

        test.equal(tulist.length, 1);

        test.equal(tulist[0].source, "The icon <img src=\"testNode.gif\"/> represents a conditional node.");
        test.equal(tulist[0].sourceLocale, "en-US");
        test.equal(tulist[0].key, "huzzah");
        test.equal(tulist[0].file, "foo/bar/j.java");
        test.equal(tulist[0].project, "webapp");
        test.equal(tulist[0].resType, "string");
        test.equal(tulist[0].id, "2");

        test.ok(!tulist[0].target);
        test.equal(tulist[0].targetLocale, "");

        test.done();
    },

    testXliffDeserializeWithCdata: function(test) {
        test.expect(12);

        const x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source><![CDATA[In CDATA sections, even the less-than sign < is allowed.]]></source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        let tulist = x.getTranslationUnits();

        test.ok(tulist);

        test.equal(tulist.length, 1);

        test.equal(tulist[0].source, "In CDATA sections, even the less-than sign < is allowed.");
        test.equal(tulist[0].sourceLocale, "en-US");
        test.equal(tulist[0].key, "huzzah");
        test.equal(tulist[0].file, "foo/bar/j.java");
        test.equal(tulist[0].project, "webapp");
        test.equal(tulist[0].resType, "string");
        test.equal(tulist[0].id, "2");

        test.ok(!tulist[0].target);
        test.equal(tulist[0].targetLocale, "");

        test.done();
    },

    testXliffDeserializePreserveSourceWhitespace: function(test) {
        test.expect(10);

        const x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="UI/AddAnotherButtonView.m" source-language="en-US" target-language="es-US" product-name="iosapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="196" resname="      Add Another" restype="string" datatype="x-objective-c">\n' +
                '        <source>      Add Another</source>\n' +
                '        <target>Añadir Otro</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
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
        test.deepEqual(tulist[0].location, {line: 4, char: 7});

        test.done();
    },

    testXliffDeserializePreserveTargetWhitespace: function(test) {
        test.expect(9);

        const x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="UI/AddAnotherButtonView.m" source-language="en-US" target-language="es-US" product-name="iosapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="196" resname="      Add Another" restype="string" datatype="x-objective-c">\n' +
                '        <source>      Add Another</source>\n' +
                '        <target> Añadir    Otro  </target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
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

    testXliffDeserializeStillAcceptsAnnotatesAttr: function(test) {
        test.expect(21);

        const x = new Xliff({
            allowDups: true
        });
        test.ok(x);

        x.deserialize(
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<xliff version="1.2">\n' +
            '  <file original="/a/b/asdf.js" source-language="en-US" target-language="fr-FR" product-name="iosapp">\n' +
            '    <body>\n' +
            '      <trans-unit id="2333" resname="asdf" restype="string" x-context="asdfasdf">\n' +
            '        <source>bababa</source>\n' +
            '        <target>ababab</target>\n' +
            '        <note annotates="source">this is a comment</note>\n' +
            '      </trans-unit>\n' +
            '      <trans-unit id="2334" resname="asdf" restype="string" x-context="asdfasdf">\n' +
            '        <source>bababa</source>\n' +
            '        <target>ababab</target>\n' +
            '        <note annotates="source">this is a different comment</note>\n' +
            '      </trans-unit>\n' +
            '    </body>\n' +
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
        test.deepEqual(tulist[0].location, {line: 4, char: 7});

        test.equal(tulist[1].target, "ababab");
        test.equal(tulist[1].targetLocale, "fr-FR");
        test.equal(tulist[1].key, "asdf");
        test.equal(tulist[1].file, "/a/b/asdf.js");
        test.equal(tulist[1].project, "iosapp");
        test.equal(tulist[1].resType, "string");
        test.equal(tulist[1].context, "asdfasdf");
        test.equal(tulist[1].comment, "this is a different comment");
        test.deepEqual(tulist[1].location, {line: 9, char: 7});

        test.done();
    },

    testXliffGetLinesDefault: function(test) {
        test.expect(2);

        const x = new Xliff({
            allowDups: true
        });
        test.ok(x);

        // default value
        test.equal(x.getLines(), 0);
        test.done();
    },

    testXliffGetBytesDefault: function(test) {
        test.expect(2);

        const x = new Xliff({
            allowDups: true
        });
        test.ok(x);

        // default value
        test.equal(x.getBytes(), 0);
        test.done();
    },

    testXliffGetLinesDeserialize: function(test) {
        test.expect(3);

        const x = new Xliff({
            allowDups: true
        });
        test.ok(x);

        test.equal(x.getLines(), 0);

        x.deserialize(
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<xliff version="1.2">\n' +
            '  <file original="/a/b/asdf.js" source-language="en-US" target-language="fr-FR" product-name="iosapp">\n' +
            '    <body>\n' +
            '      <trans-unit id="2333" resname="asdf" restype="string" x-context="asdfasdf">\n' +
            '        <source>bababa</source>\n' +
            '        <target>ababab</target>\n' +
            '        <note annotates="source">this is a comment</note>\n' +
            '      </trans-unit>\n' +
            '      <trans-unit id="2334" resname="asdf" restype="string" x-context="asdfasdf">\n' +
            '        <source>bababa</source>\n' +
            '        <target>ababab</target>\n' +
            '        <note annotates="source">this is a different comment</note>\n' +
            '      </trans-unit>\n' +
            '    </body>\n' +
            '  </file>\n' +
            '</xliff>');

        test.equal(x.getLines(), 17);
        test.done();
    },

    testXliffGetLinesSerialize: function(test) {
        test.expect(4);

        const x = new Xliff();
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
        test.equal(x.getLines(), 19);

        test.done();
    },

    testXliffGetBytesDeserialize: function(test) {
        test.expect(3);

        const x = new Xliff({
            allowDups: true
        });
        test.ok(x);

        test.equal(x.getBytes(), 0);

        x.deserialize(
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<xliff version="1.2">\n' +
            '  <file original="/a/b/asdf.js" source-language="en-US" target-language="fr-FR" product-name="iosapp">\n' +
            '    <body>\n' +
            '      <trans-unit id="2333" resname="asdf" restype="string" x-context="asdfasdf">\n' +
            '        <source>bababa</source>\n' +
            '        <target>ababab</target>\n' +
            '        <note annotates="source">this is a comment</note>\n' +
            '      </trans-unit>\n' +
            '      <trans-unit id="2334" resname="asdf" restype="string" x-context="asdfasdf">\n' +
            '        <source>bababa</source>\n' +
            '        <target>ababab</target>\n' +
            '        <note annotates="source">this is a different comment</note>\n' +
            '      </trans-unit>\n' +
            '    </body>\n' +
            '  </file>\n' +
            '</xliff>');

        test.equal(x.getBytes(), 663);
        test.done();
    },

    testXliffGetBytesSerialize: function(test) {
        test.expect(4);

        const x = new Xliff();
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
        test.equal(x.getBytes(), 699);

        test.done();
    },

    testXliffDeserializeWithTranslateFlagFalse: function(test) {
        test.expect(13);

        const x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string" translate="false">\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>foobarfoo</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
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

    testXliffDeserializeWithTranslateFlagTrue: function(test) {
        test.expect(13);

        const x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string" translate="true">\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>foobarfoo</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
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

    testXliffDeserializeWithTranslateFlagNo: function(test) {
        test.expect(13);

        const x = new Xliff();
        test.ok(x);

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string" translate="no">\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>foobarfoo</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
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
