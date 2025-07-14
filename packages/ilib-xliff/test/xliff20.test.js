/*
 * xliff20.test.js - test the Xliff 2.0 object.
 *
 * Copyright © 2022-2025 JEDLSoft
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

describe("XLIFF 2.0", () => {
    test("should create Xliff 2.0 instance", () => {
        expect.assertions(1);
        var x = new Xliff({version: "2.0"});
        expect(x).toBeTruthy();
    });

    test("should create empty Xliff 2.0 instance", () => {
        expect.assertions(2);
        var x = new Xliff({version: "2.0"});
        expect(x).toBeTruthy();
        expect(x.size()).toBe(0);
    });

    test("should have correct version 2.0", () => {
        expect.assertions(2);
        var x = new Xliff({version: "2.0"});
        expect(x).toBeTruthy();
        expect(x.getVersion()).toBe(2.0);
    });

    test("should handle numeric version 1.2", () => {
        expect.assertions(2);
        var x = new Xliff({version: 1.2});
        expect(x).toBeTruthy();
        expect(x.getVersion()).toBe(1.2);
    });

    test("should handle numeric version 2.0", () => {
        expect.assertions(2);
        var x = new Xliff({version: 2.0});
        expect(x).toBeTruthy();
        expect(x.getVersion()).toBe(2.0);
    });

    test("should create Xliff 2.0 instance with full configuration", () => {
        expect.assertions(8);
        var x = new Xliff({
            version: "2.0",
            "tool-id": "loctool",
            "tool-name": "Localization Tool",
            "tool-version": "1.2.34",
            "tool-company": "My Company, Inc.",
            copyright: "Copyright 2016, My Company, Inc. All rights reserved.",
            path: "a/b/c.xliff"
        });
        expect(x).toBeTruthy();
        expect(x.getVersion()).toBe(2.0);
        expect(x["tool-id"]).toBe("loctool");
        expect(x["tool-name"]).toBe("Localization Tool");
        expect(x["tool-version"]).toBe("1.2.34");
        expect(x["tool-company"]).toBe("My Company, Inc.");
        expect(x.copyright).toBe("Copyright 2016, My Company, Inc. All rights reserved.");
        expect(x.path).toBe("a/b/c.xliff");
    });

    test("should add translation unit to Xliff 2.0", () => {
        expect.assertions(11);
        const x = new Xliff({version: 2.0});
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

    test("should add multiple translation units to Xliff 2.0", () => {
        expect.assertions(19);
        const x = new Xliff({version: 2.0});
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

    test("should handle adding same translation unit twice in Xliff 2.0", () => {
        expect.assertions(11);
        const x = new Xliff({version: 2.0});
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

    test('should add translation unit with same TU twice without duplication in Xliff 2.0', () => {
        const x = new Xliff({version: 2.0});
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

    test('should add multiple translation units at once to Xliff 2.0', () => {
        const x = new Xliff({version: 2.0});
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

    test('should return correct size of translation units in Xliff 2.0', () => {
        const x = new Xliff({version: 2.0});
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

    test('should serialize XLIFF 2.0 with source only', () => {
        const x = new Xliff({version: 2.0});
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

        expect(actual).toBe(expected);
    });

    test('should serialize XLIFF 2.0 with source and target', () => {
        const x = new Xliff({version: 2.0});
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

        expect(actual).toBe(expected);
    });

    test('should serialize XLIFF 2.0 with source, target and comments', () => {
        const x = new Xliff({version: 2.0});
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
        expect(actual).toBe(expected);
    });

    test('should serialize XLIFF 2.0 with extended attributes', () => {
        const x = new Xliff({version: 2.0});
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
            datatype: "plaintext",
            extended: {
                foo: "bar"
            }
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
            datatype: "plaintext",
            extended: {
                baz: "quux"
            }
        });

        x.addTranslationUnit(tu);

        let expected =
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="webapp">\n' +
                '    <group id="group_1" name="plaintext">\n' +
                '      <unit id="1" name="foobar" type="res:string" l:datatype="plaintext" l:foo="bar">\n' +
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
                '      <unit id="2" name="huzzah" type="res:string" l:datatype="plaintext" l:baz="quux">\n' +
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
        expect(actual).toBe(expected);
    });

    test('should deserialize XLIFF 2.0 with XML-escaped content', () => {
        const x = new Xliff({version: 2.0});
        expect(x).toBeTruthy();

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
            '        <source>baby &amp;lt;b&amp;gt;baby&amp;lt;/b&amp;gt;</source>\n' +
            '      </segment>\n' +
            '    </unit>\n' +
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
        expect(!tulist[0].target).toBeTruthy();
        expect(tulist[1].source).toBe("baby &lt;b&gt;baby&lt;/b&gt;");
        expect(tulist[1].sourceLocale).toBe("en-US");
        expect(tulist[1].key).toBe("<b>huzzah</b>");
        expect(tulist[1].file).toBe("foo/bar/j.java");
        expect(tulist[1].project).toBe("webapp");
        expect(tulist[1].resType).toBe("string");
        expect(tulist[1].id).toBe("2");
        expect(!tulist[1].target).toBeTruthy();
    });

    test('should deserialize XLIFF 2.0 with escaped newlines', () => {
        const x = new Xliff({version: 2.0});
        expect(x).toBeTruthy();

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

    test('should serialize XLIFF 2.0 with XML escaping and quotes', () => {
        const x = new Xliff({version: 2.0});
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
    });

    test('should serialize XLIFF 2.0 with escape characters in resname', () => {
        const x = new Xliff({version: 2.0});
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

        expect(actual).toBe(expected);
    });

    test('should handle translation units with different locales', () => {
        var x = new Xliff({version: "2.0"});
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

        expect(() => {
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
        }).toThrow();
    });

    test('should serialize XLIFF 2.0 with translate flag set to false', () => {
        const x = new Xliff({version: 2.0});
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

        expect(actual).toBe(expected);
    });

    test('should serialize XLIFF 2.0 with translate flag set to true', () => {
        const x = new Xliff({version: 2.0});
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

        expect(actual).toBe(expected);
    });

    test('should deserialize XLIFF 2.0 with source only', () => {
        const x = new Xliff({version: 2.0});
        expect(x).toBeTruthy();

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

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(2);

        expect(tulist[0].source).toBe("Asdf asdf");
        expect(tulist[0].sourceLocale).toBe("en-US");
        expect(!tulist[0].target).toBeTruthy();
        expect(tulist[0].targetLocale).toBe("de-DE");
        expect(tulist[0].key).toBe("foobar");
        expect(tulist[0].file).toBe("foo/bar/asdf.java");
        expect(tulist[0].project).toBe("androidapp");
        expect(tulist[0].resType).toBe("string");
        expect(tulist[0].id).toBe("1");
        expect(typeof(tulist[0].translate)).toBe('undefined');
        expect(tulist[0].location).toEqual({line: 4, char: 5});

        expect(tulist[1].source).toBe("baby baby");
        expect(tulist[1].sourceLocale).toBe("en-US");
        expect(!tulist[1].target).toBeTruthy();
        expect(tulist[1].targetLocale).toBe("de-DE");
        expect(tulist[1].key).toBe("huzzah");
        expect(tulist[1].file).toBe("foo/bar/j.java");
        expect(tulist[1].project).toBe("webapp");
        expect(tulist[1].resType).toBe("string");
        expect(tulist[1].id).toBe("2");
        expect(typeof(tulist[1].translate)).toBe('undefined');
        expect(tulist[1].location).toEqual({line: 11, char: 5});
    });

    test('should deserialize XLIFF 2.0 with source and target', () => {
        const x = new Xliff({version: 2.0});
        expect(x).toBeTruthy();

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
        expect(tulist[0].location).toEqual({line: 3, char: 5});

        expect(tulist[1].source).toBe("baby baby");
        expect(tulist[1].sourceLocale).toBe("en-US");
        expect(tulist[1].key).toBe("huzzah");
        expect(tulist[1].file).toBe("foo/bar/j.java");
        expect(tulist[1].project).toBe("webapp");
        expect(tulist[1].resType).toBe("string");
        expect(tulist[1].id).toBe("2");
        expect(tulist[1].target).toBe("bebe bebe");
        expect(tulist[1].targetLocale).toBe("de-DE");
        expect(tulist[1].location).toEqual({line: 11, char: 5});
    });

    test('should deserialize XLIFF 2.0 with resfile', () => {
        const x = new Xliff({version: 2.0});
        expect(x).toBeTruthy();

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
        expect(tulist[0].location).toEqual({line: 3, char: 5});
        expect(tulist[0].resfile).toBe("a/b/c/resfile.xliff");

        expect(tulist[1].source).toBe("baby baby");
        expect(tulist[1].sourceLocale).toBe("en-US");
        expect(tulist[1].key).toBe("huzzah");
        expect(tulist[1].file).toBe("foo/bar/j.java");
        expect(tulist[1].project).toBe("webapp");
        expect(tulist[1].resType).toBe("string");
        expect(tulist[1].id).toBe("2");
        expect(tulist[1].target).toBe("bebe bebe");
        expect(tulist[1].targetLocale).toBe("de-DE");
        expect(tulist[1].location).toEqual({line: 11, char: 5});
        expect(tulist[1].resfile).toBe("a/b/c/resfile.xliff");
    });

    test('should deserialize XLIFF 2.0 with extended attributes', () => {
        const x = new Xliff({version: 2.0});
        expect(x).toBeTruthy();

        x.deserialize(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="2.0" srcLang="en-US" trgLang="de-DE" xmlns:l="http://ilib-js.com/loctool">\n' +
                '  <file original="foo/bar/asdf.java" l:project="androidapp">\n' +
                '    <unit id="1" name="foobar" type="res:string" l:foo="bar">\n' +
                '      <segment>\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>foobarfoo</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" l:project="webapp">\n' +
                '    <unit id="2" name="huzzah" type="res:string" l:baz="quux">\n' +
                '      <segment>\n' +
                '        <source>baby baby</source>\n' +
                '        <target>bebe bebe</target>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
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
        expect(tulist[0].location).toEqual({line: 3, char: 5});
        expect(tulist[0].extended).toEqual({"foo": "bar"});

        expect(tulist[1].source).toBe("baby baby");
        expect(tulist[1].sourceLocale).toBe("en-US");
        expect(tulist[1].key).toBe("huzzah");
        expect(tulist[1].file).toBe("foo/bar/j.java");
        expect(tulist[1].project).toBe("webapp");
        expect(tulist[1].resType).toBe("string");
        expect(tulist[1].id).toBe("2");
        expect(tulist[1].target).toBe("bebe bebe");
        expect(tulist[1].targetLocale).toBe("de-DE");
        expect(tulist[1].location).toEqual({line: 11, char: 5});
        expect(tulist[1].extended).toEqual({"baz": "quux"});
    });

    test('should deserialize XLIFF 2.0 with XML unescaping', () => {
        const x = new Xliff({version: 2.0});
        expect(x).toBeTruthy();

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
                '        <source>baby &amp;lt;b&amp;gt;baby&amp;lt;/b&amp;gt;</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
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
        expect(!tulist[0].target).toBeTruthy();

        expect(tulist[1].source).toBe("baby &lt;b&gt;baby&lt;/b&gt;");
        expect(tulist[1].sourceLocale).toBe("en-US");
        expect(tulist[1].key).toBe("huzzah");
        expect(tulist[1].file).toBe("foo/bar/j.java");
        expect(tulist[1].project).toBe("webapp");
        expect(tulist[1].resType).toBe("string");
        expect(tulist[1].id).toBe("2");
        expect(!tulist[1].target).toBeTruthy();
    });

    test('should deserialize XLIFF 2.0 with XML unescaping in resname', () => {
        const x = new Xliff({version: 2.0});
        expect(x).toBeTruthy();

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
                '        <source>baby &amp;lt;b&amp;gt;baby&amp;lt;/b&amp;gt;</source>\n' +
                '      </segment>\n' +
                '    </unit>\n' +
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
        expect(!tulist[0].target).toBeTruthy();

        expect(tulist[1].source).toBe("baby &lt;b&gt;baby&lt;/b&gt;");
        expect(tulist[1].sourceLocale).toBe("en-US");
        expect(tulist[1].key).toBe("<b>huzzah</b>");
        expect(tulist[1].file).toBe("foo/bar/j.java");
        expect(tulist[1].project).toBe("webapp");
        expect(tulist[1].resType).toBe("string");
        expect(tulist[1].id).toBe("2");
        expect(!tulist[1].target).toBeTruthy();
    });

    test('should deserialize XLIFF 2.0 with escaped newlines in resname', () => {
        const x = new Xliff({version: 2.0});
        expect(x).toBeTruthy();

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

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(2);

        expect(tulist[0].source).toBe("a\\nb");
        expect(tulist[0].sourceLocale).toBe("en-US");
        expect(tulist[0].key).toBe("foobar\\nbar\\t");
        expect(tulist[0].file).toBe("foo/bar/asdf.java");
        expect(tulist[0].project).toBe("androidapp");
        expect(tulist[0].resType).toBe("string");
        expect(tulist[0].id).toBe("1");

        expect(tulist[1].source).toBe("e\\nh");
        expect(tulist[1].sourceLocale).toBe("en-US");
        expect(tulist[1].key).toBe("huzzah\\n\\na plague on both your houses");
        expect(tulist[1].file).toBe("foo/bar/j.java");
        expect(tulist[1].project).toBe("webapp");
        expect(tulist[1].resType).toBe("string");
        expect(tulist[1].id).toBe("2");
    });

    test('should deserialize XLIFF 2.0 with context', () => {
        const x = new Xliff({version: 2.0});
        expect(x).toBeTruthy();

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

    test('should deserialize XLIFF 2.0 with empty source', () => {
        const x = new Xliff({version: 2.0});
        expect(x).toBeTruthy();

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

    test('should deserialize XLIFF 2.0 with empty target', () => {
        const x = new Xliff({version: 2.0});
        expect(x).toBeTruthy();

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

    test('should deserialize XLIFF 2.0 with mrk tag in target', () => {
        const x = new Xliff({version: 2.0});
        expect(x).toBeTruthy();

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

    test('should deserialize XLIFF 2.0 with empty mrk tag in target', () => {
        const x = new Xliff({version: 2.0});
        expect(x).toBeTruthy();

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

    test('should deserialize XLIFF 2.0 with multiple mrk tags in target (European)', () => {
        const x = new Xliff({version: 2.0});
        expect(x).toBeTruthy();

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

    test('should deserialize XLIFF 2.0 with multiple mrk tags in target (Asian)', () => {
        const x = new Xliff({version: 2.0});
        expect(x).toBeTruthy();

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

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(1);

        expect(tulist[0].source).toBe("baby baby");
        expect(tulist[0].sourceLocale).toBe("en-US");
        expect(tulist[0].key).toBe("huzzah");
        expect(tulist[0].file).toBe("foo/bar/j.java");
        expect(tulist[0].project).toBe("webapp");
        expect(tulist[0].resType).toBe("string");
        expect(tulist[0].id).toBe("2");

        expect(tulist[0].target).toBe("This is segment 1.This is segment 2.This is segment 3.");
        expect(tulist[0].targetLocale).toBe("zh-Hans-CN");
    });

    test('should deserialize XLIFF 2.0 preserving source whitespace', () => {
        const x = new Xliff({version: 2.0});
        expect(x).toBeTruthy();

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

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(1);

        expect(tulist[0].source).toBe("      Add Another");
        expect(tulist[0].sourceLocale).toBe("en-US");
        expect(tulist[0].key).toBe("      Add Another");
        expect(tulist[0].file).toBe("UI/AddAnotherButtonView.m");
        expect(tulist[0].project).toBe("iosapp");
        expect(tulist[0].resType).toBe("string");
    });

    test('should deserialize XLIFF 2.0 preserving target whitespace', () => {
        const x = new Xliff({version: 2.0});
        expect(x).toBeTruthy();

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

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(1);

        expect(tulist[0].target).toBe(" Añadir    Otro  ");
        expect(tulist[0].targetLocale).toBe("es-US");
        expect(tulist[0].key).toBe("      Add Another");
        expect(tulist[0].file).toBe("UI/AddAnotherButtonView.m");
        expect(tulist[0].project).toBe("iosapp");
        expect(tulist[0].resType).toBe("string");
    });

    test('should deserialize XLIFF 2.0 with notes and appliesTo attribute', () => {
        const x = new Xliff({
            allowDups: true,
            version: 2.0
        });
        expect(x).toBeTruthy();

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

        expect(tulist).toBeTruthy();
        expect(tulist.length).toBe(2);

        expect(tulist[0].target).toBe("ababab");
        expect(tulist[0].targetLocale).toBe("fr-FR");
        expect(tulist[0].key).toBe("asdf");
        expect(tulist[0].file).toBe("/a/b/asdf.js");
        expect(tulist[0].project).toBe("iosapp");
        expect(tulist[0].resType).toBe("string");
        expect(tulist[0].context).toBe("asdfasdf");
        expect(tulist[0].comment).toBe("this is a comment");

        expect(tulist[1].target).toBe("ababab");
        expect(tulist[1].targetLocale).toBe("fr-FR");
        expect(tulist[1].key).toBe("asdf");
        expect(tulist[1].file).toBe("/a/b/asdf.js");
        expect(tulist[1].project).toBe("iosapp");
        expect(tulist[1].resType).toBe("string");
        expect(tulist[1].context).toBe("asdfasdf");
        expect(tulist[1].comment).toBe("this is a different comment");
    });

    test('should get default lines count', () => {
        const x = new Xliff({
            allowDups: true,
            version: 2.0
        });
        expect(x).toBeTruthy();

        // default value
        expect(x.getLines()).toBe(0);
    });

    test('should get default bytes count', () => {
        const x = new Xliff({
            allowDups: true,
            version: 2.0
        });
        expect(x).toBeTruthy();

        // default value
        expect(x.getBytes()).toBe(0);
    });

    test('should get lines count after deserialization', () => {
        const x = new Xliff({
            allowDups: true,
            version: 2.0
        });
        expect(x).toBeTruthy();

        expect(x.getLines()).toBe(0);

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

        expect(x.getLines()).toBe(23);
    });

    test('should get lines count after serialization', () => {
        const x = new Xliff({version: 2.0});
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
        expect(x.getLines()).toBe(23);
    });

    test('should get bytes count after deserialization', () => {
        const x = new Xliff({
            allowDups: true,
            version: 2.0
        });
        expect(x).toBeTruthy();

        expect(x.getBytes()).toBe(0);

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

        expect(x.getBytes()).toBe(746);
    });

    test('should get bytes count after serialization', () => {
        const x = new Xliff({version: 2.0});
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
        expect(x.getBytes()).toBe(788);
    });

    test('should deserialize XLIFF 2.0 with translate flag false', () => {
        const x = new Xliff({version: 2.0});
        expect(x).toBeTruthy();

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

    test('should deserialize XLIFF 2.0 with translate flag true', () => {
        const x = new Xliff({version: 2.0});
        expect(x).toBeTruthy();

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
        expect(typeof(tulist[0].translate)).toBe('undefined');
    });

    test('should deserialize XLIFF 2.0 with translate flag no', () => {
        const x = new Xliff({version: 2.0});
        expect(x).toBeTruthy();

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