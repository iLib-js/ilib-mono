/*
 * xliff12.test.js - test the Xliff object with v1.2 xliff files
 *
 * Copyright © 2016-2017, 2019-2025 HealthTap, Inc. and JEDLSoft
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

describe("XLIFF 1.2", () => {
    test("should create Xliff instance with default constructor", () => {
        expect.assertions(1);
        const x = new Xliff();
        expect(x).toBeTruthy();
    });

    test("should create empty Xliff instance", () => {
        expect.assertions(2);
        const x = new Xliff();
        expect(x).toBeTruthy();
        expect(x.size()).toBe(0);
    });

    test("should create Xliff instance with full configuration", () => {
        expect.assertions(7);
        const x = new Xliff({
            "tool-id": "loctool",
            "tool-name": "Localization Tool",
            "tool-version": "1.2.34",
            "tool-company": "My Company, Inc.",
            copyright: "Copyright 2016, My Company, Inc. All rights reserved.",
            path: "a/b/c.xliff"
        });
        expect(x).toBeTruthy();
        expect(x["tool-id"]).toBe("loctool");
        expect(x["tool-name"]).toBe("Localization Tool");
        expect(x["tool-version"]).toBe("1.2.34");
        expect(x["tool-company"]).toBe("My Company, Inc.");
        expect(x.copyright).toBe("Copyright 2016, My Company, Inc. All rights reserved.");
        expect(x.path).toBe("a/b/c.xliff");
    });

    test("should get default version 1.2", () => {
        expect.assertions(2);
        const x = new Xliff();
        expect(x).toBeTruthy();
        expect(x.getVersion()).toBe(1.2);
    });

    test("should get version 1.2 when explicitly set", () => {
        expect.assertions(2);
        const x = new Xliff({
            version: "1.2"
        });
        expect(x).toBeTruthy();
        expect(x.getVersion()).toBe(1.2);
    });

    test("should get version 2.0 when explicitly set", () => {
        expect.assertions(2);
        const x = new Xliff({
            version: "2.0"
        });
        expect(x).toBeTruthy();
        expect(x.getVersion()).toBe(2.0);
    });

    test("should add single translation unit", () => {
        expect.assertions(11);
        const x = new Xliff();
        expect(x).toBeTruthy();

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

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(1);
        expect(tulist[0].source).toBe("Asdf asdf");
        expect(tulist[0].sourceLocale).toBe("en-US");
        expect(tulist[0].key).toBe("foobar");
        expect(tulist[0].file).toBe("foo/bar/asdf.java");
        expect(tulist[0].state).toBe("new");
        expect(tulist[0].comment).toBe("This is a comment");
        expect(tulist[0].project).toBe("webapp");
        expect(tulist[0].datatype).toBe("java");
    });

    test("should add multiple translation units", () => {
        expect.assertions(19);
        const x = new Xliff();
        expect(x).toBeTruthy();

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

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(2);
        expect(tulist[0].source).toBe("Asdf asdf");
        expect(tulist[0].sourceLocale).toBe("en-US");
        expect(tulist[0].key).toBe("foobar");
        expect(tulist[0].file).toBe("foo/bar/asdf.java");
        expect(tulist[0].state).toBe("new");
        expect(tulist[0].comment).toBe("This is a comment");
        expect(tulist[0].project).toBe("webapp");
        expect(tulist[0].datatype).toBe("java");

        expect(tulist[1].source).toBe("foobar");
        expect(tulist[1].sourceLocale).toBe("en-US");
        expect(tulist[1].key).toBe("asdf");
        expect(tulist[1].file).toBe("x.java");
        expect(tulist[1].state).toBe("translated");
        expect(tulist[1].comment).toBe("No comment");
        expect(tulist[1].project).toBe("webapp");
        expect(tulist[1].datatype).toBe("javascript");
    });

    test("should handle adding same translation unit twice", () => {
        expect.assertions(11);
        const x = new Xliff();
        expect(x).toBeTruthy();

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
        x.addTranslationUnit(tu);

        const tulist = x.getTranslationUnits();

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(1);
        expect(tulist[0].source).toBe("Asdf asdf");
        expect(tulist[0].sourceLocale).toBe("en-US");
        expect(tulist[0].key).toBe("foobar");
        expect(tulist[0].file).toBe("foo/bar/asdf.java");
        expect(tulist[0].state).toBe("new");
        expect(tulist[0].comment).toBe("This is a comment");
        expect(tulist[0].project).toBe("webapp");
        expect(tulist[0].datatype).toBe("java");
    });

    test('should add translation unit with same TU twice without duplication', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(1);
        expect(tulist[0].source).toBe("Asdf asdf");
        expect(tulist[0].sourceLocale).toBe("en-US");
        expect(tulist[0].key).toBe("foobar");
        expect(tulist[0].file).toBe("foo/bar/asdf.java");
        expect(tulist[0].state).toBe("new");
        expect(tulist[0].comment).toBe("This is a comment");
        expect(tulist[0].project).toBe("webapp");
        expect(tulist[0].datatype).toBe("java");
    });

    test('should add multiple translation units at once', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(2);
        expect(tulist[0].source).toBe("Asdf asdf");
        expect(tulist[0].sourceLocale).toBe("en-US");
        expect(tulist[0].key).toBe("foobar");
        expect(tulist[0].file).toBe("foo/bar/asdf.java");
        expect(tulist[0].state).toBe("new");
        expect(tulist[0].comment).toBe("This is a comment");
        expect(tulist[0].project).toBe("webapp");
        expect(tulist[0].datatype).toBe("java");

        expect(tulist[1].source).toBe("foobar");
        expect(tulist[1].sourceLocale).toBe("en-US");
        expect(tulist[1].key).toBe("asdf");
        expect(tulist[1].file).toBe("x.java");
        expect(tulist[1].state).toBe("translated");
        expect(tulist[1].comment).toBe("No comment");
        expect(tulist[1].project).toBe("webapp");
        expect(tulist[1].datatype).toBe("javascript");
    });

    test('should return correct size of translation units', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();
        expect(x.size()).toBe(0);

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

        expect(x.size()).toBe(2);
    });

    test('should serialize XLIFF with source only', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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
        });

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

        expect(actual).toBe(expected);
    });

    test('should serialize XLIFF with source and target', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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
        });

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

        expect(actual).toBe(expected);
    });

    test('should serialize XLIFF with source, target and comments', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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
        expect(actual).toBe(expected);
    });

    test('should serialize XLIFF with extended attributes', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

        let tu = new TranslationUnit({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            target: "foobarfoo",
            targetLocale: "de-DE",
            key: "foobar",
            file: "foo/bar/asdf.java",
            project: "webapp",
            comment: "foobar is where it's at!",
            extended: {
                foo: "bar"
            }
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
            comment: "come & enjoy it with us",
            extended: {
                baz: "quux"
            }
        });

        x.addTranslationUnit(tu);

        let expected =
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string" x-foo="bar">\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>foobarfoo</target>\n' +
                '        <note>foobar is where it\'s at!</note>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string" x-baz="quux">\n' +
                '        <source>baby baby</source>\n' +
                '        <target>bebe bebe</target>\n' +
                '        <note>come &amp; enjoy it with us</note>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';

        let actual = x.serialize();
        expect(actual).toBe(expected);
    });

    test("should serialize with source only and plurals", () => {
        expect.assertions(2);
        const x = new Xliff();
        expect(x).toBeTruthy();

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

        expect(actual).toBe(expected);
    });

    test('should serialize XLIFF with header information', () => {
        const x = new Xliff({
            "tool-id": "loctool",
            "tool-name": "Localization Tool",
            "tool-version": "1.2.34",
            "tool-company": "My Company, Inc.",
            copyright: "Copyright 2016, My Company, Inc. All rights reserved.",
            path: "a/b/c.xliff"
        });
        expect(x).toBeTruthy();

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

        expect(actual).toBe(expected);
    });

    test('should serialize XLIFF with XML escaping', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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

        expect(actual).toBe(expected);
    });

    test('should serialize XLIFF with XML escaping in resname', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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

        expect(actual).toBe(expected);
    });

    test('should serialize XLIFF with XML escaping with quotes', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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

        expect(x.serialize()).toBe(
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
    });

    test('should serialize XLIFF with escape characters in resname', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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

        expect(actual).toBe(expected);
    });

    test('should serialize XLIFF with translation units in different locales', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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

        expect(actual).toBe(expected);
    });

    test('should serialize XLIFF with translate flag set to false', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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
        });

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

        expect(actual).toBe(expected);
    });

    test('should serialize XLIFF with translate flag set to true', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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
        });

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

        expect(actual).toBe(expected);
    });

    test('should deserialize XLIFF with source only', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(2);

        expect(tulist[0].source).toBe("Asdf asdf");
        expect(tulist[0].sourceLocale).toBe("en-US");
        expect(tulist[0].target).toBeFalsy();
        expect(tulist[0].targetLocale).toBe("de-DE");
        expect(tulist[0].key).toBe("foobar");
        expect(tulist[0].file).toBe("foo/bar/asdf.java");
        expect(tulist[0].project).toBe("androidapp");
        expect(tulist[0].resType).toBe("string");
        expect(tulist[0].id).toBe("1");
        expect(tulist[0].location).toEqual({line: 4, char: 7});

        expect(tulist[1].source).toBe("baby baby");
        expect(tulist[1].sourceLocale).toBe("en-US");
        expect(tulist[1].target).toBeFalsy();
        expect(tulist[1].targetLocale).toBe("fr-FR");
        expect(tulist[1].key).toBe("huzzah");
        expect(tulist[1].file).toBe("foo/bar/j.java");
        expect(tulist[1].project).toBe("webapp");
        expect(tulist[1].resType).toBe("string");
        expect(tulist[1].id).toBe("2");
        expect(tulist[1].location).toEqual({line: 11, char: 7});
    });

    test('should deserialize XLIFF with source and target', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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

        let tulist = x.getTranslationUnits();

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(2);

        expect(tulist[0].source).toBe("Asdf asdf");
        expect(tulist[0].sourceLocale).toBe("en-US");
        expect(tulist[0].key).toBe("foobar");
        expect(tulist[0].file).toBe("foo/bar/asdf.java");
        expect(tulist[0].project).toBe("androidapp");
        expect(tulist[0].resType).toBe("string");
        expect(tulist[0].id).toBe("1");
        expect(tulist[0].target).toBe("foobarfoo");
        expect(tulist[0].targetLocale).toBe("de-DE");
        expect(tulist[0].translate).toBeUndefined();
        expect(tulist[0].location).toEqual({line: 4, char: 7});

        expect(tulist[1].source).toBe("baby baby");
        expect(tulist[1].sourceLocale).toBe("en-US");
        expect(tulist[1].key).toBe("huzzah");
        expect(tulist[1].file).toBe("foo/bar/j.java");
        expect(tulist[1].project).toBe("webapp");
        expect(tulist[1].resType).toBe("string");
        expect(tulist[1].id).toBe("2");
        expect(tulist[1].target).toBe("bebe bebe");
        expect(tulist[1].targetLocale).toBe("fr-FR");
        expect(tulist[1].translate).toBeUndefined();
        expect(tulist[1].location).toEqual({line: 12, char: 7});
    });

    test('should deserialize XLIFF with resfile', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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
                '</xliff>', "a/b/c/resfile.xliff");

        let tulist = x.getTranslationUnits();

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(2);

        expect(tulist[0].source).toBe("Asdf asdf");
        expect(tulist[0].sourceLocale).toBe("en-US");
        expect(tulist[0].key).toBe("foobar");
        expect(tulist[0].file).toBe("foo/bar/asdf.java");
        expect(tulist[0].project).toBe("androidapp");
        expect(tulist[0].resType).toBe("string");
        expect(tulist[0].id).toBe("1");
        expect(tulist[0].target).toBe("foobarfoo");
        expect(tulist[0].targetLocale).toBe("de-DE");
        expect(tulist[0].translate).toBeUndefined();
        expect(tulist[0].location).toEqual({line: 4, char: 7});
        expect(tulist[0].resfile).toBe("a/b/c/resfile.xliff");

        expect(tulist[1].source).toBe("baby baby");
        expect(tulist[1].sourceLocale).toBe("en-US");
        expect(tulist[1].key).toBe("huzzah");
        expect(tulist[1].file).toBe("foo/bar/j.java");
        expect(tulist[1].project).toBe("webapp");
        expect(tulist[1].resType).toBe("string");
        expect(tulist[1].id).toBe("2");
        expect(tulist[1].target).toBe("bebe bebe");
        expect(tulist[1].targetLocale).toBe("fr-FR");
        expect(tulist[1].translate).toBeUndefined();
        expect(tulist[1].location).toEqual({line: 12, char: 7});
        expect(tulist[1].resfile).toBe("a/b/c/resfile.xliff");
    });

    test('should deserialize XLIFF with extended attributes', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string" x-extension="arbitrary data">\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>foobarfoo</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string" x-extension="more arbitrary data">\n' +
                '        <source>baby baby</source>\n' +
                '        <target>bebe bebe</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        let tulist = x.getTranslationUnits();

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(2);

        expect(tulist[0].source).toBe("Asdf asdf");
        expect(tulist[0].sourceLocale).toBe("en-US");
        expect(tulist[0].key).toBe("foobar");
        expect(tulist[0].file).toBe("foo/bar/asdf.java");
        expect(tulist[0].project).toBe("androidapp");
        expect(tulist[0].resType).toBe("string");
        expect(tulist[0].id).toBe("1");
        expect(tulist[0].target).toBe("foobarfoo");
        expect(tulist[0].targetLocale).toBe("de-DE");
        expect(tulist[0].translate).toBeUndefined();
        expect(tulist[0].location).toEqual({line: 4, char: 7});
        expect(tulist[0].extended).toEqual({ "extension": "arbitrary data" });

        expect(tulist[1].source).toBe("baby baby");
        expect(tulist[1].sourceLocale).toBe("en-US");
        expect(tulist[1].key).toBe("huzzah");
        expect(tulist[1].file).toBe("foo/bar/j.java");
        expect(tulist[1].project).toBe("webapp");
        expect(tulist[1].resType).toBe("string");
        expect(tulist[1].id).toBe("2");
        expect(tulist[1].target).toBe("bebe bebe");
        expect(tulist[1].targetLocale).toBe("fr-FR");
        expect(tulist[1].translate).toBeUndefined();
        expect(tulist[1].location).toEqual({line: 12, char: 7});
        expect(tulist[1].extended).toEqual({ "extension": "more arbitrary data" });
    });

    test('should deserialize XLIFF with XML unescaping', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(2);

        expect(tulist[0].source).toBe("Asdf <b>asdf</b>");
        expect(tulist[0].sourceLocale).toBe("en-US");
        expect(tulist[0].key).toBe("foobar");
        expect(tulist[0].file).toBe("foo/bar/asdf.java");
        expect(tulist[0].project).toBe("androidapp");
        expect(tulist[0].resType).toBe("string");
        expect(tulist[0].id).toBe("1");
        expect(tulist[0].target).toBeFalsy();
        expect(tulist[0].location).toEqual({line: 4, char: 7});

        expect(tulist[1].source).toBe("baby &lt;b&gt;baby&lt;/b&gt;");
        expect(tulist[1].sourceLocale).toBe("en-US");
        expect(tulist[1].key).toBe("huzzah");
        expect(tulist[1].file).toBe("foo/bar/j.java");
        expect(tulist[1].project).toBe("webapp");
        expect(tulist[1].resType).toBe("string");
        expect(tulist[1].id).toBe("2");
        expect(tulist[1].target).toBeFalsy();
        expect(tulist[1].location).toEqual({line: 11, char: 7});
    });

    test('should deserialize XLIFF with XML unescaping in resname', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(2);

        expect(tulist[0].source).toBe("Asdf <b>asdf</b>");
        expect(tulist[0].sourceLocale).toBe("en-US");
        expect(tulist[0].key).toBe("foobar <a>link</a>");
        expect(tulist[0].file).toBe("foo/bar/asdf.java");
        expect(tulist[0].project).toBe("androidapp");
        expect(tulist[0].resType).toBe("string");
        expect(tulist[0].id).toBe("1");
        expect(tulist[0].target).toBeFalsy();
        expect(tulist[0].location).toEqual({line: 4, char: 7});

        expect(tulist[1].source).toBe("baby &lt;b&gt;baby&lt;/b&gt;");
        expect(tulist[1].sourceLocale).toBe("en-US");
        expect(tulist[1].key).toBe("<b>huzzah</b>");
        expect(tulist[1].file).toBe("foo/bar/j.java");
        expect(tulist[1].project).toBe("webapp");
        expect(tulist[1].resType).toBe("string");
        expect(tulist[1].id).toBe("2");
        expect(tulist[1].target).toBeFalsy();
        expect(tulist[1].location).toEqual({line: 11, char: 7});
    });

    test('should deserialize XLIFF with escaped newlines', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(2);

        expect(tulist[0].source).toBe("a\\nb");
        expect(tulist[0].sourceLocale).toBe("en-US");
        expect(tulist[0].key).toBe("foobar");
        expect(tulist[0].file).toBe("foo/bar/asdf.java");
        expect(tulist[0].project).toBe("androidapp");
        expect(tulist[0].resType).toBe("string");
        expect(tulist[0].id).toBe("1");

        expect(tulist[1].source).toBe("e\\nh");
        expect(tulist[1].sourceLocale).toBe("en-US");
        expect(tulist[1].key).toBe("huzzah");
        expect(tulist[1].file).toBe("foo/bar/j.java");
        expect(tulist[1].project).toBe("webapp");
        expect(tulist[1].resType).toBe("string");
        expect(tulist[1].id).toBe("2");
    });

    test('should deserialize XLIFF with escaped newlines in resname', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(2);

        expect(tulist[0].source).toBe("a\\nb");
        expect(tulist[0].sourceLocale).toBe("en-US");
        expect(tulist[0].key).toBe("foobar\\n\\nasdf");
        expect(tulist[0].file).toBe("foo/bar/asdf.java");
        expect(tulist[0].project).toBe("androidapp");
        expect(tulist[0].resType).toBe("string");
        expect(tulist[0].id).toBe("1");

        expect(tulist[1].source).toBe("e\\nh");
        expect(tulist[1].sourceLocale).toBe("en-US");
        expect(tulist[1].key).toBe("huzzah\\t\\n");
        expect(tulist[1].file).toBe("foo/bar/j.java");
        expect(tulist[1].project).toBe("webapp");
        expect(tulist[1].resType).toBe("string");
        expect(tulist[1].id).toBe("2");
    });

    test('should deserialize XLIFF with context', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(2);

        expect(tulist[0].source).toBe("Asdf asdf");
        expect(tulist[0].sourceLocale).toBe("en-US");
        expect(tulist[0].key).toBe("foobar");
        expect(tulist[0].file).toBe("foo/bar/asdf.java");
        expect(tulist[0].project).toBe("androidapp");
        expect(tulist[0].resType).toBe("string");
        expect(tulist[0].id).toBe("1");
        expect(tulist[0].context).toBe("na na na");

        expect(tulist[1].source).toBe("baby baby");
        expect(tulist[1].sourceLocale).toBe("en-US");
        expect(tulist[1].key).toBe("huzzah");
        expect(tulist[1].file).toBe("foo/bar/j.java");
        expect(tulist[1].project).toBe("webapp");
        expect(tulist[1].resType).toBe("string");
        expect(tulist[1].id).toBe("2");
        expect(tulist[1].context).toBe("asdf");
    });

    test('should deserialize XLIFF with empty source', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(1);

        expect(tulist[0].source).toBe("baby baby");
        expect(tulist[0].sourceLocale).toBe("en-US");
        expect(tulist[0].key).toBe("huzzah");
        expect(tulist[0].file).toBe("foo/bar/j.java");
        expect(tulist[0].project).toBe("webapp");
        expect(tulist[0].resType).toBe("string");
        expect(tulist[0].id).toBe("2");
        expect(tulist[0].target).toBe("bebe bebe");
        expect(tulist[0].targetLocale).toBe("fr-FR");
    });

    test('should deserialize XLIFF with empty target', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(2);

        expect(tulist[0].source).toBe("Asdf asdf");
        expect(tulist[0].sourceLocale).toBe("en-US");
        expect(tulist[0].key).toBe("foobar");
        expect(tulist[0].file).toBe("foo/bar/asdf.java");
        expect(tulist[0].project).toBe("androidapp");
        expect(tulist[0].resType).toBe("string");
        expect(tulist[0].id).toBe("1");

        expect(tulist[1].source).toBe("baby baby");
        expect(tulist[1].sourceLocale).toBe("en-US");
        expect(tulist[1].key).toBe("huzzah");
        expect(tulist[1].file).toBe("foo/bar/j.java");
        expect(tulist[1].project).toBe("webapp");
        expect(tulist[1].resType).toBe("string");
        expect(tulist[1].id).toBe("2");
    });

    test('should deserialize XLIFF with mrk tag in target', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(1);

        expect(tulist[0].source).toBe("baby baby");
        expect(tulist[0].sourceLocale).toBe("en-US");
        expect(tulist[0].key).toBe("huzzah");
        expect(tulist[0].file).toBe("foo/bar/j.java");
        expect(tulist[0].project).toBe("webapp");
        expect(tulist[0].resType).toBe("string");
        expect(tulist[0].id).toBe("2");
        expect(tulist[0].target).toBe("bebe bebe");
        expect(tulist[0].targetLocale).toBe("fr-FR");
    });

    test('should deserialize XLIFF with empty mrk tag in target', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(1);

        expect(tulist[0].source).toBe("baby baby");
        expect(tulist[0].sourceLocale).toBe("en-US");
        expect(tulist[0].key).toBe("huzzah");
        expect(tulist[0].file).toBe("foo/bar/j.java");
        expect(tulist[0].project).toBe("webapp");
        expect(tulist[0].resType).toBe("string");
        expect(tulist[0].id).toBe("2");
    });

    test('should deserialize XLIFF with multiple mrk tags in target', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(1);

        expect(tulist[0].source).toBe("baby baby");
        expect(tulist[0].sourceLocale).toBe("en-US");
        expect(tulist[0].key).toBe("huzzah");
        expect(tulist[0].file).toBe("foo/bar/j.java");
        expect(tulist[0].project).toBe("webapp");
        expect(tulist[0].resType).toBe("string");
        expect(tulist[0].id).toBe("2");
        expect(tulist[0].target).toBe("This is segment 1. This is segment 2. This is segment 3.");
        expect(tulist[0].targetLocale).toBe("fr-FR");
    });

    test('should deserialize XLIFF with multiple mrk tags in target for Asian languages', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(1);

        expect(tulist[0].source).toBe("baby baby");
        expect(tulist[0].sourceLocale).toBe("en-US");
        expect(tulist[0].key).toBe("huzzah");
        expect(tulist[0].file).toBe("foo/bar/j.java");
        expect(tulist[0].project).toBe("webapp");
        expect(tulist[0].resType).toBe("string");
        expect(tulist[0].id).toBe("2");
        expect(tulist[0].target).toBe("This is segment 1. This is segment 2. This is segment 3.");
        expect(tulist[0].targetLocale).toBe("zh-Hans-CN");
    });

    test('should deserialize XLIFF preserving whitespace between inline elements in source', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(1);

        expect(tulist[0].source).toBe("This is group 1.\nThis is group 2. This is group 3.");
        expect(tulist[0].sourceLocale).toBe("en-US");
        expect(tulist[0].key).toBe("huzzah");
        expect(tulist[0].file).toBe("foo/bar/j.java");
        expect(tulist[0].project).toBe("webapp");
        expect(tulist[0].resType).toBe("string");
        expect(tulist[0].id).toBe("2");
        expect(tulist[0].target).toBeFalsy();
        expect(tulist[0].targetLocale).toBe("");
    });

    test('should deserialize XLIFF preserving whitespace between inline elements in target', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(1);

        expect(tulist[0].source).toBe("baby baby");
        expect(tulist[0].sourceLocale).toBe("en-US");
        expect(tulist[0].key).toBe("huzzah");
        expect(tulist[0].file).toBe("foo/bar/j.java");
        expect(tulist[0].project).toBe("webapp");
        expect(tulist[0].resType).toBe("string");
        expect(tulist[0].id).toBe("2");
        expect(tulist[0].target).toBe("This is segment 1.\nThis is segment 2. This is segment 3.");
        expect(tulist[0].targetLocale).toBe("fr-FR");
    });

    test('should deserialize XLIFF with x tag in source', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(1);

        expect(tulist[0].source).toBe("Less-than sign (<) is not allowed in XLIFF.");
        expect(tulist[0].sourceLocale).toBe("en-US");
        expect(tulist[0].key).toBe("huzzah");
        expect(tulist[0].file).toBe("foo/bar/j.java");
        expect(tulist[0].project).toBe("webapp");
        expect(tulist[0].resType).toBe("string");
        expect(tulist[0].id).toBe("2");
        expect(tulist[0].target).toBeFalsy();
        expect(tulist[0].targetLocale).toBe("");
    });

    test('should deserialize XLIFF with x tag in source and target', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(1);

        expect(tulist[0].source).toBe("Less-than sign (<) is not allowed in XLIFF.");
        expect(tulist[0].sourceLocale).toBe("en-US");
        expect(tulist[0].key).toBe("huzzah");
        expect(tulist[0].file).toBe("foo/bar/j.java");
        expect(tulist[0].project).toBe("webapp");
        expect(tulist[0].resType).toBe("string");
        expect(tulist[0].id).toBe("2");
        expect(tulist[0].target).toBe("Le signe inférieur (<) n'est pas autorisé dans XLIFF.");
        expect(tulist[0].targetLocale).toBe("fr-FR");
    });

    test('should deserialize XLIFF with inline tag with content', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(1);

        expect(tulist[0].source).toBe("<B>Bold <I>Bold and Italic</B> Italics</I>");
        expect(tulist[0].sourceLocale).toBe("en-US");
        expect(tulist[0].key).toBe("huzzah");
        expect(tulist[0].file).toBe("foo/bar/j.java");
        expect(tulist[0].project).toBe("webapp");
        expect(tulist[0].resType).toBe("string");
        expect(tulist[0].id).toBe("2");
        expect(tulist[0].target).toBeFalsy();
        expect(tulist[0].targetLocale).toBe("");
    });

    test('should deserialize XLIFF with inline tag preferring content over equiv-text', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(1);

        expect(tulist[0].source).toBe("The icon <img src=\"testNode.gif\"/> represents a conditional node.");
        expect(tulist[0].sourceLocale).toBe("en-US");
        expect(tulist[0].key).toBe("huzzah");
        expect(tulist[0].file).toBe("foo/bar/j.java");
        expect(tulist[0].project).toBe("webapp");
        expect(tulist[0].resType).toBe("string");
        expect(tulist[0].id).toBe("2");
        expect(tulist[0].target).toBeFalsy();
        expect(tulist[0].targetLocale).toBe("");
    });

    test('should deserialize XLIFF with CDATA', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(1);

        expect(tulist[0].source).toBe("In CDATA sections, even the less-than sign < is allowed.");
        expect(tulist[0].sourceLocale).toBe("en-US");
        expect(tulist[0].key).toBe("huzzah");
        expect(tulist[0].file).toBe("foo/bar/j.java");
        expect(tulist[0].project).toBe("webapp");
        expect(tulist[0].resType).toBe("string");
        expect(tulist[0].id).toBe("2");
        expect(tulist[0].target).toBeFalsy();
        expect(tulist[0].targetLocale).toBe("");
    });

    test('should deserialize XLIFF preserving source whitespace', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(1);

        expect(tulist[0].source).toBe("      Add Another");
        expect(tulist[0].sourceLocale).toBe("en-US");
        expect(tulist[0].key).toBe("      Add Another");
        expect(tulist[0].file).toBe("UI/AddAnotherButtonView.m");
        expect(tulist[0].project).toBe("iosapp");
        expect(tulist[0].resType).toBe("string");
        expect(tulist[0].location).toEqual({line: 4, char: 7});
    });

    test('should deserialize XLIFF preserving target whitespace', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(1);

        expect(tulist[0].target).toBe(" Añadir    Otro  ");
        expect(tulist[0].targetLocale).toBe("es-US");
        expect(tulist[0].key).toBe("      Add Another");
        expect(tulist[0].file).toBe("UI/AddAnotherButtonView.m");
        expect(tulist[0].project).toBe("iosapp");
        expect(tulist[0].resType).toBe("string");
    });

    test('should deserialize XLIFF still accepting annotates attribute', () => {
        const x = new Xliff({
            allowDups: true
        });
        expect(x).toBeTruthy();

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

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(2);

        expect(tulist[0].target).toBe("ababab");
        expect(tulist[0].targetLocale).toBe("fr-FR");
        expect(tulist[0].key).toBe("asdf");
        expect(tulist[0].file).toBe("/a/b/asdf.js");
        expect(tulist[0].project).toBe("iosapp");
        expect(tulist[0].resType).toBe("string");
        expect(tulist[0].id).toBe("2333");
        expect(tulist[0].context).toBe("asdfasdf");
        expect(tulist[0].comment).toBe("this is a comment");

        expect(tulist[1].target).toBe("ababab");
        expect(tulist[1].targetLocale).toBe("fr-FR");
        expect(tulist[1].key).toBe("asdf");
        expect(tulist[1].file).toBe("/a/b/asdf.js");
        expect(tulist[1].project).toBe("iosapp");
        expect(tulist[1].resType).toBe("string");
        expect(tulist[1].id).toBe("2334");
        expect(tulist[1].context).toBe("asdfasdf");
        expect(tulist[1].comment).toBe("this is a different comment");
    });

    test('should get default lines count', () => {
        const x = new Xliff({
            allowDups: true
        });
        expect(x).toBeTruthy();
        expect(x.getLines()).toBe(0);
    });

    test('should get default bytes count', () => {
        const x = new Xliff({
            allowDups: true
        });
        expect(x).toBeTruthy();
        expect(x.getBytes()).toBe(0);
    });

    test('should get lines count after deserialization', () => {
        const x = new Xliff({
            allowDups: true
        });
        expect(x).toBeTruthy();
        expect(x.getLines()).toBe(0);

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

        expect(x.getLines()).toBe(17);
    });

    test('should get lines count after serialization', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();
        expect(x.getLines()).toBe(0);

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
        expect(actual).toBeTruthy();
        expect(x.getLines()).toBe(19);
    });

    test('should get bytes count after deserialization', () => {
        const x = new Xliff({
            allowDups: true
        });
        expect(x).toBeTruthy();
        expect(x.getBytes()).toBe(0);

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

        expect(x.getBytes()).toBe(663);
    });

    test('should get bytes count after serialization', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();
        expect(x.getBytes()).toBe(0);

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
        expect(actual).toBeTruthy();
        expect(x.getBytes()).toBe(699);
    });

    test('should deserialize XLIFF with translate flag set to false', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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

        let tulist = x.getTranslationUnits();

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(1);

        expect(tulist[0].source).toBe("Asdf asdf");
        expect(tulist[0].sourceLocale).toBe("en-US");
        expect(tulist[0].key).toBe("foobar");
        expect(tulist[0].file).toBe("foo/bar/asdf.java");
        expect(tulist[0].project).toBe("androidapp");
        expect(tulist[0].resType).toBe("string");
        expect(tulist[0].id).toBe("1");
        expect(tulist[0].target).toBe("foobarfoo");
        expect(tulist[0].targetLocale).toBe("de-DE");
        expect(tulist[0].translate).toBe(false);
    });

    test('should deserialize XLIFF with translate flag set to true', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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

        let tulist = x.getTranslationUnits();

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(1);

        expect(tulist[0].source).toBe("Asdf asdf");
        expect(tulist[0].sourceLocale).toBe("en-US");
        expect(tulist[0].key).toBe("foobar");
        expect(tulist[0].file).toBe("foo/bar/asdf.java");
        expect(tulist[0].project).toBe("androidapp");
        expect(tulist[0].resType).toBe("string");
        expect(tulist[0].id).toBe("1");
        expect(tulist[0].target).toBe("foobarfoo");
        expect(tulist[0].targetLocale).toBe("de-DE");
        expect(tulist[0].translate).toBeUndefined();
    });

    test('should deserialize XLIFF with translate flag set to no', () => {
        const x = new Xliff();
        expect(x).toBeTruthy();

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

        let tulist = x.getTranslationUnits();

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(1);

        expect(tulist[0].source).toBe("Asdf asdf");
        expect(tulist[0].sourceLocale).toBe("en-US");
        expect(tulist[0].key).toBe("foobar");
        expect(tulist[0].file).toBe("foo/bar/asdf.java");
        expect(tulist[0].project).toBe("androidapp");
        expect(tulist[0].resType).toBe("string");
        expect(tulist[0].id).toBe("1");
        expect(tulist[0].target).toBe("foobarfoo");
        expect(tulist[0].targetLocale).toBe("de-DE");
        expect(tulist[0].translate).toBe(false);
    });
}); 