/*
 * Xliff.test.js - test the Xliff object.
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

import fs from "fs";

import { ResourceArray, ResourcePlural, ResourceString, ResourceXliff } from "../src/index.js";

function diff(a, b) {
    const min = Math.min(a.length, b.length);

    for (let i = 0; i < min; i++) {
        if (a[i] !== b[i]) {
            console.log("Found difference at character " + i);
            console.log("a: " + a.substring(i));
            console.log("b: " + b.substring(i));
            break;
        }
    }
}

describe("testResourceXliff", () => {
    test("ResourceXliffConstructor", () => {
        expect.assertions(1);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();
    });

    test("ResourceXliffConstructorIsEmpty", () => {
        expect.assertions(2);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        expect(x.size()).toBe(0);
    });

    test("ResourceXliffConstructorFull", () => {
        expect.assertions(7);

        const x = new ResourceXliff({
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

    test("ResourceXliffGetPath", () => {
        expect.assertions(2);

        const x = new ResourceXliff({
            path: "foo/bar/x.xliff"
        });
        expect(x).toBeTruthy();

        expect(x.getPath()).toBe("foo/bar/x.xliff");
    });


    test("ResourceXliffSetPath", () => {
        expect.assertions(3);

        const x = new ResourceXliff({
            path: "foo/bar/x.xliff"
        });
        expect(x).toBeTruthy();

        expect(x.getPath()).toBe("foo/bar/x.xliff");

        x.setPath("asdf/asdf/y.xliff");

        expect(x.getPath()).toBe("asdf/asdf/y.xliff");
    });

    test("ResourceXliffSetPathInitiallyEmpty", () => {
        expect.assertions(3);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        expect(!x.getPath()).toBeTruthy();

        x.setPath("asdf/asdf/y.xliff");

        expect(x.getPath()).toBe("asdf/asdf/y.xliff");
    });

    test("ResourceXliffAddResource", () => {
        expect.assertions(11);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        const res = new ResourceString({
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

        const reslist = x.getResources({
            reskey: "foobar"
        });

        expect(reslist).toBeTruthy();

        expect(reslist.length).toBe(1);
        expect(reslist[0].getSource()).toBe("Asdf asdf");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getState()).toBe("new");
        expect(reslist[0].getContext()).toBe("asdf");
        expect(reslist[0].getComment()).toBe("this is a comment");
        expect(reslist[0].getProject()).toBe("webapp");
    });

    test("ResourceXliffSize", () => {
        expect.assertions(3);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        const res = new ResourceString({
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

        expect(x.size()).toBe(0);

        x.addResource(res);

        expect(x.size()).toBe(1);
    });

    test("ResourceXliffAddMultipleResources", () => {
        expect.assertions(8);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        let res = new ResourceString({
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

        const reslist = x.getResources({
            reskey: "foobar"
        });

        expect(reslist).toBeTruthy();

        expect(reslist.length).toBe(1);
        expect(reslist[0].getSource()).toBe("Asdf asdf");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("webapp");
    });

    test("ResourceXliffAddMultipleResourcesRightSize", () => {
        expect.assertions(3);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();
        expect(x.size()).toBe(0);

        let res = new ResourceString({
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

        expect(x.size()).toBe(2);
    });

    test("ResourceXliffAddMultipleResourcesAddInstance", () => {
        expect.assertions(17);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        let res = new ResourceString({
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

        const reslist = x.getResources({
            reskey: "foobar"
        });

        expect(reslist).toBeTruthy();

        expect(reslist.length).toBe(1);
        expect(reslist[0].getSource()).toBe("Asdf asdf");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("webapp");
        expect(!reslist[0].getComment()).toBeTruthy();

        const inst = reslist[0].getInstances();
        expect(inst).toBeTruthy();

        expect(inst.length).toBe(1);
        expect(inst[0].getSource()).toBe("Asdf asdf");
        expect(inst[0].getSourceLocale()).toBe("en-US");
        expect(inst[0].getKey()).toBe("foobar");
        expect(inst[0].getPath()).toBe("foo/bar/asdf.java");
        expect(inst[0].getProject()).toBe("webapp");
        expect(inst[0].getComment()).toBe("blah blah blah");
    });

    test("ResourceXliffAddMultipleResourcesOverwriteRightSize", () => {
        expect.assertions(4);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        expect(x.size()).toBe(0);

        let res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp"
        });

        x.addResource(res);

        expect(x.size()).toBe(1);

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

        expect(x.size()).toBe(1);
    });

    test("ResourceXliffAddMultipleResourcesNoOverwrite", () => {
        expect.assertions(13);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        let res = new ResourceString({
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

        const reslist = x.getResources({
            reskey: "foobar"
        });

        expect(reslist).toBeTruthy();

        expect(reslist.length).toBe(2);

        expect(reslist[0].getSource()).toBe("Asdf asdf");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(!reslist[0].getComment()).toBeTruthy();

        expect(reslist[1].getSource()).toBe("Asdf asdf");
        expect(reslist[1].getSourceLocale()).toBe("fr-FR");
        expect(reslist[1].getKey()).toBe("foobar");
        expect(reslist[1].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[1].getComment()).toBe("blah blah blah");
    });

    test("ResourceXliffAddResourceDontAddSourceLocaleAsTarget", () => {
        expect.assertions(2);

        const x = new ResourceXliff({
            sourceLocale: "en-US"
        });
        expect(x).toBeTruthy();

        let res = new ResourceString({
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

        expect(x.size()).toBe(1);
    });

    test("ResourceXliffGetResourcesMultiple", () => {
        expect.assertions(11);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        let res = new ResourceString({
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

        const reslist = x.getResources({
            sourceLocale: "en-US"
        });

        expect(reslist).toBeTruthy();

        expect(reslist.length).toBe(2);

        expect(reslist[0].getSource()).toBe("Asdf asdf");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");

        expect(reslist[1].getSource()).toBe("baby baby");
        expect(reslist[1].getSourceLocale()).toBe("en-US");
        expect(reslist[1].getKey()).toBe("huzzah");
        expect(reslist[1].getPath()).toBe("foo/bar/j.java");
    });

    test("ResourceXliffGetTextWithExplicitIds", () => {
        expect.assertions(2);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

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

        const actual = x.getText();
        const expected =
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="nl-NL" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="4444444" resname="foobar" restype="string" datatype="plaintext">\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>baby baby</target>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="4444445" resname="asdf" restype="string" datatype="plaintext">\n' +
                '        <source>abcdef</source>\n' +
                '        <target>hijklmn</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("ResourceXliffGetTextWithSourceAndTarget", () => {
        expect.assertions(2);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        let res = new ResourceString({
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
            targetLocale: "fr-FR",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "webapp",
            origin: "target"
        });

        x.addResource(res);

        diff(x.getText(),
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string" datatype="plaintext">\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>foobarfoo</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string" datatype="plaintext">\n' +
                '        <source>baby baby</source>\n' +
                '        <target>bebe bebe</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        expect(x.getText()).toBe('<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string" datatype="plaintext">\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>foobarfoo</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string" datatype="plaintext">\n' +
                '        <source>baby baby</source>\n' +
                '        <target>bebe bebe</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');
    });

    test("ResourceXliffGetTextWithSourceAndTargetAndComment", () => {
        expect.assertions(2);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        let res = new ResourceString({
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
            targetLocale: "fr-FR",
            key: "huzzah",
            pathName: "foo/bar/j.java",
            project: "webapp",
            comment: "come & enjoy it with us"
        });

        x.addResource(res);

        const expected =
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string" datatype="plaintext">\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>foobarfoo</target>\n' +
                '        <note>foobar is where it\'s at!</note>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" target-language="fr-FR" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string" datatype="plaintext">\n' +
                '        <source>baby baby</source>\n' +
                '        <target>bebe bebe</target>\n' +
                '        <note>come &amp; enjoy it with us</note>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';

        const actual = x.getText();

        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("ResourceXliffGetTextWithHeader", () => {
        expect.assertions(2);

        const x = new ResourceXliff({
            "tool-id": "loctool",
            "tool-name": "Localization Tool",
            "tool-version": "1.2.34",
            "tool-company": "My Company, Inc.",
            copyright: "Copyright 2016, My Company, Inc. All rights reserved.",
            path: "a/b/c.xliff"
        });
        expect(x).toBeTruthy();

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

        const actual = x.getText();
        const expected =
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
        expect(actual).toBe(expected);
    });

    test("ResourceXliffGetTextWithPlurals", () => {
        expect.assertions(2);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        let res = new ResourcePlural({
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

        const actual = x.getText();
        const expected =
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="plural" datatype="ruby" extype="one">\n' +
                '        <source>There is 1 object.</source>\n' +
                '        <target state="new">Da gibts 1 Objekt.</target>\n' +
                '        <note>{"pluralForm":"one","pluralFormOther":"foobar"}</note>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="2" resname="foobar" restype="plural" datatype="ruby" extype="other">\n' +
                '        <source>There are {n} objects.</source>\n' +
                '        <target state="new">Da gibts {n} Objekten.</target>\n' +
                '        <note>{"pluralForm":"other","pluralFormOther":"foobar"}</note>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("ResourceXliffGetTextWithPluralsToLangWithMorePluralsThanEnglish", () => {
        expect.assertions(2);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

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

        const actual = x.getText();
        const expected =
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="ru-RU" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="plural" datatype="ruby" extype="one">\n' +
                '        <source>There is 1 object.</source>\n' +
                '        <target state="new">Имеется {n} объект.</target>\n' +
                '        <note>{"pluralForm":"one","pluralFormOther":"foobar"}</note>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="2" resname="foobar" restype="plural" datatype="ruby" extype="few">\n' +
                '        <source>There are {n} objects.</source>\n' +
                '        <target state="new">Есть {n} объекта.</target>\n' +
                '        <note>{"pluralForm":"few","pluralFormOther":"foobar"}</note>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="3" resname="foobar" restype="plural" datatype="ruby" extype="other">\n' +
                '        <source>There are {n} objects.</source>\n' +
                '        <target state="new">Всего {n} объектов.</target>\n' +
                '        <note>{"pluralForm":"other","pluralFormOther":"foobar"}</note>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("ResourceXliffGetTextWithArrays", () => {
        expect.assertions(2);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        const res = new ResourceArray({
            source: ["Zero", "One", "Two"],
            sourceLocale: "en-US",
            targetArray: ["Zero", "Eins", "Zwei"],
            targetLocale: "de-DE",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "androidapp",
            origin: "target"
        });

        x.addResource(res);

        const actual = x.getText();
        const expected =
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="array" datatype="x-android-resource" extype="0">\n' +
                '        <source>Zero</source>\n' +
                '        <target>Zero</target>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="2" resname="foobar" restype="array" datatype="x-android-resource" extype="1">\n' +
                '        <source>One</source>\n' +
                '        <target>Eins</target>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="3" resname="foobar" restype="array" datatype="x-android-resource" extype="2">\n' +
                '        <source>Two</source>\n' +
                '        <target>Zwei</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>';
        diff(actual, expected)
        expect(actual).toBe(expected);
    });

    test("ResourceXliffGetTextWithXMLEscaping", () => {
        expect.assertions(2);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        let res = new ResourceString({
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

        const actual = x.getText();
        const expected =
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
        expect(actual).toBe(expected);
    });

    test("ResourceXliffGetTextWithXMLEscapingInResname", () => {
        expect.assertions(2);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        let res = new ResourceString({
            source: "Asdf <b>asdf</b>",
            sourceLocale: "en-US",
            target: "Asdf 'quotes'",
            targetLocale: "de-DE",
            key: 'foobar <i>asdf</i>',
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
            key: "huzzah <b>asdf</b> #(test)",
            pathName: "foo/bar/j.java",
            project: "webapp",
            origin: "target"
        });

        x.addResource(res);

        const actual = x.getText();
        const expected =
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
        expect(actual).toBe(expected);
    });

    test("ResourceXliffGetTextWithXMLEscapingWithQuotes", () => {
        expect.assertions(2);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        const res = new ResourceString({
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

        expect(x.getText()).toBe('<?xml version="1.0" encoding="utf-8"?>\n' +
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

    test("ResourceXliffGetTextWithEscapeCharsInResname", () => {
        expect.assertions(2);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        let res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            target: "Asdf translated",
            targetLocale: "de-DE",
            key: 'asdf \\n\\nasdf',
            pathName: "foo/bar/asdf.java",
            project: "androidapp",
            origin: "target"
        });

        x.addResource(res);

        res = new ResourceString({
            source: "asdf \\t\\n\\n asdf\\n",
            sourceLocale: "en-US",
            target: "fdsa \\t\\n\\n fdsa\\n",
            targetLocale: "de-DE",
            key: "asdf \\t\\n\\n asdf\\n",
            pathName: "foo/bar/j.java",
            project: "webapp",
            origin: "target"
        });

        x.addResource(res);

        const actual = x.getText();
        const expected =
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
        expect(actual).toBe(expected);
    });

    test("ResourceXliffGetTextWithComments", () => {
        expect.assertions(2);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        let res = new ResourceString({
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

        expect(x.getText()).toBe('<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="nl-NL" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string" datatype="plaintext">\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <target>baby baby</target>\n' +
                '        <note>A very nice string</note>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');
    });

    test("ResourceXliffParseWithSourceOnly", () => {
        expect.assertions(23);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        x.parse(
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

        const reslist = x.getResources();

        expect(reslist).toBeTruthy();

        expect(reslist.length).toBe(2);

        expect(reslist[0].getSource()).toBe("Asdf asdf");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(!reslist[0].getTarget()).toBeTruthy();
        expect(reslist[0].getTargetLocale()).toBe("de-DE");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("androidapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].getId()).toBe("1");
        expect(reslist[0].getLocation()).toStrictEqual({
            line: 4,
            char: 7
        });

        expect(reslist[1].getSource()).toBe("baby baby");
        expect(reslist[1].getSourceLocale()).toBe("en-US");
        expect(!reslist[1].getTarget()).toBeTruthy();
        expect(reslist[1].getTargetLocale()).toBe("fr-FR");
        expect(reslist[1].getKey()).toBe("huzzah");
        expect(reslist[1].getPath()).toBe("foo/bar/j.java");
        expect(reslist[1].getProject()).toBe("webapp");
        expect(reslist[1].resType).toBe("string");
        expect(reslist[1].getId()).toBe("2");
        expect(reslist[1].getLocation()).toStrictEqual({
            line: 11,
            char: 7
        });
    });

    test("ResourceXliffParseWithSourceAndTarget", () => {
        expect.assertions(23);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        x.parse(
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
        const reslist = x.getResources();
        // console.log("x is now " + JSON.stringify(x, undefined, 4));

        expect(reslist).toBeTruthy();

        expect(reslist.length).toBe(2);

        expect(reslist[0].getSource()).toBe("Asdf asdf");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("androidapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].getId()).toBe("1");
        expect(reslist[0].getTarget()).toBe("foobarfoo");
        expect(reslist[0].getTargetLocale()).toBe("de-DE");
        expect(reslist[0].getLocation()).toStrictEqual({
            line: 4,
            char: 7
        });

        expect(reslist[1].getSource()).toBe("baby baby");
        expect(reslist[1].getSourceLocale()).toBe("en-US");
        expect(reslist[1].getKey()).toBe("huzzah");
        expect(reslist[1].getPath()).toBe("foo/bar/j.java");
        expect(reslist[1].getProject()).toBe("webapp");
        expect(reslist[1].resType).toBe("string");
        expect(reslist[1].getId()).toBe("2");
        expect(reslist[1].getTarget()).toBe("bebe bebe");
        expect(reslist[1].getTargetLocale()).toBe("fr-FR");
        expect(reslist[1].getLocation()).toStrictEqual({
            line: 12,
            char: 7
        });
    });

    test("ResourceXliffParseGetLines", () => {
        expect.assertions(2);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        x.parse(
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

        expect(x.getLines()).toBe(19);
    });

    test("ResourceXliffParseGetSize", () => {
        expect.assertions(2);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        x.parse(
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

        // only 2 resources result from all the above
        expect(x.size()).toBe(2);
    });

    test("ResourceXliffParseWithXMLUnescaping", () => {
        expect.assertions(19);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        x.parse(
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

        const reslist = x.getResources();

        expect(reslist).toBeTruthy();

        expect(reslist.length).toBe(2);

        expect(reslist[0].getSource()).toBe("Asdf <b>asdf</b>");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("androidapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].getId()).toBe("1");
        expect(!reslist[0].getTarget()).toBeTruthy();

        expect(reslist[1].getSource()).toBe("baby &lt;b&gt;baby&lt;/b&gt;");
        expect(reslist[1].getSourceLocale()).toBe("en-US");
        expect(reslist[1].getKey()).toBe("huzzah");
        expect(reslist[1].getPath()).toBe("foo/bar/j.java");
        expect(reslist[1].getProject()).toBe("webapp");
        expect(reslist[1].resType).toBe("string");
        expect(reslist[1].getId()).toBe("2");
        expect(!reslist[1].getTarget()).toBeTruthy();
    });

    test("ResourceXliffParseWithXMLUnescapingInResname", () => {
        expect.assertions(19);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        x.parse(
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

        const reslist = x.getResources();

        expect(reslist).toBeTruthy();

        expect(reslist.length).toBe(2);

        expect(reslist[0].getSource()).toBe("Asdf <b>asdf</b>");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar <a>link</a>");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("androidapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].getId()).toBe("1");
        expect(!reslist[0].getTarget()).toBeTruthy();

        expect(reslist[1].getSource()).toBe("baby &lt;b&gt;baby&lt;/b&gt;");
        expect(reslist[1].getSourceLocale()).toBe("en-US");
        expect(reslist[1].getKey()).toBe("<b>huzzah</b>");
        expect(reslist[1].getPath()).toBe("foo/bar/j.java");
        expect(reslist[1].getProject()).toBe("webapp");
        expect(reslist[1].resType).toBe("string");
        expect(reslist[1].getId()).toBe("2");
        expect(!reslist[1].getTarget()).toBeTruthy();
    });

    test("ResourceXliffParseWithEscapedNewLines", () => {
        expect.assertions(17);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        x.parse(
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

        const reslist = x.getResources();

        expect(reslist).toBeTruthy();

        expect(reslist.length).toBe(2);

        expect(reslist[0].getSource()).toBe("a\\nb");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("androidapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].getId()).toBe("1");

        expect(reslist[1].getSource()).toBe("e\\nh");
        expect(reslist[1].getSourceLocale()).toBe("en-US");
        expect(reslist[1].getKey()).toBe("huzzah");
        expect(reslist[1].getPath()).toBe("foo/bar/j.java");
        expect(reslist[1].getProject()).toBe("webapp");
        expect(reslist[1].resType).toBe("string");
        expect(reslist[1].getId()).toBe("2");
    });

    test("ResourceXliffParseWithEscapedNewLinesInResname", () => {
        expect.assertions(17);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        x.parse(
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

        const reslist = x.getResources();

        expect(reslist).toBeTruthy();

        expect(reslist.length).toBe(2);

        expect(reslist[0].getSource()).toBe("a\\nb");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar\\n\\nasdf");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("androidapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].getId()).toBe("1");

        expect(reslist[1].getSource()).toBe("e\\nh");
        expect(reslist[1].getSourceLocale()).toBe("en-US");
        expect(reslist[1].getKey()).toBe("huzzah\\t\\n");
        expect(reslist[1].getPath()).toBe("foo/bar/j.java");
        expect(reslist[1].getProject()).toBe("webapp");
        expect(reslist[1].resType).toBe("string");
        expect(reslist[1].getId()).toBe("2");
    });

    test("ResourceXliffParseWithPlurals", () => {
        expect.assertions(11);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        x.parse(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="plural" datatype="x-android-resource" extype="one">\n' +
                '        <source>There is 1 object.</source>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="2" resname="foobar" restype="plural" datatype="x-android-resource" extype="other">\n' +
                '        <source>There are {n} objects.</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        // console.log("x is " + JSON.stringify(x, undefined, 4));

        const reslist = x.getResources();

        // console.log("after get resources x is " + JSON.stringify(x, undefined, 4));

        expect(reslist).toBeTruthy();

        expect(reslist.length).toBe(1);

        expect(reslist[0].getSourcePlurals()).toStrictEqual({
            one: "There is 1 object.",
            other: "There are {n} objects."
        });
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("androidapp");
        expect(reslist[0].resType).toBe("plural");
        expect(reslist[0].getId()).toBe("1");
        expect(reslist[0].getLocation()).toStrictEqual({
            line: 4,
            char: 7
        });
    });

    test("ResourceXliffParseWithPluralsTranslated", () => {
        expect.assertions(13);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        x.parse(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="es-US" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="plural" datatype="x-android-resource" extype="one">\n' +
                '        <source>There is 1 object.</source>\n' +
                '        <target>Hay 1 objeto.</target>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="2" resname="foobar" restype="plural" datatype="x-android-resource" extype="other">\n' +
                '        <source>There are {n} objects.</source>\n' +
                '        <target>Hay {n} objetos.</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        // console.log("x is " + JSON.stringify(x, undefined, 4));

        const reslist = x.getResources();

        // console.log("after get resources x is " + JSON.stringify(x, undefined, 4));

        expect(reslist).toBeTruthy();

        expect(reslist.length).toBe(1);

        expect(reslist[0].getSourcePlurals()).toStrictEqual({
            one: "There is 1 object.",
            other: "There are {n} objects."
        });
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("androidapp");
        expect(reslist[0].resType).toBe("plural");
        expect(reslist[0].getId()).toBe("1");
        expect(reslist[0].getOrigin()).toBe("source");

        expect(reslist[0].getTargetPlurals()).toStrictEqual({
            one: "Hay 1 objeto.",
            other: "Hay {n} objetos."
        });
        expect(reslist[0].getTargetLocale()).toBe("es-US");
    });

    test("ResourceXliffParseWithArrays", () => {
        expect.assertions(11);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        x.parse(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="array" datatype="x-android-resource" extype="0">\n' +
                '        <source>Zero</source>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="2" resname="foobar" restype="array" datatype="x-android-resource" extype="1">\n' +
                '        <source>One</source>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="3" resname="foobar" restype="array" datatype="x-android-resource" extype="2">\n' +
                '        <source>Two</source>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        const reslist = x.getResources();

        expect(reslist).toBeTruthy();

        expect(reslist.length).toBe(1);

        expect(reslist[0].getSourceArray()).toStrictEqual(["Zero", "One", "Two"]);
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("androidapp");
        expect(reslist[0].resType).toBe("array");
        expect(!reslist[0].getTargetArray()).toBeTruthy();
        expect(reslist[0].getLocation()).toStrictEqual({
            line: 4,
            char: 7
        });
    });

    test("ResourceXliffParseWithArraysTranslated", () => {
        expect.assertions(12);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        x.parse(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" target-language="de-DE" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="array" datatype="x-android-resource" extype="0">\n' +
                '        <source>Zero</source>\n' +
                '        <target>Zero</target>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="2" resname="foobar" restype="array" datatype="x-android-resource" extype="1">\n' +
                '        <source>One</source>\n' +
                '        <target>Eins</target>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="3" resname="foobar" restype="array" datatype="x-android-resource" extype="2">\n' +
                '        <source>Two</source>\n' +
                '        <target>Zwei</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        const reslist = x.getResources();

        expect(reslist).toBeTruthy();

        expect(reslist.length).toBe(1);

        expect(reslist[0].getSourceArray()).toStrictEqual(["Zero", "One", "Two"]);
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("androidapp");
        expect(reslist[0].resType).toBe("array");
        expect(reslist[0].getOrigin()).toBe("source");
        expect(reslist[0].getTargetArray()).toStrictEqual(["Zero", "Eins", "Zwei"]);
        expect(reslist[0].getTargetLocale()).toBe("de-DE");
    });

    test("ResourceXliffParseWithArraysAndTranslations", () => {
        expect.assertions(20);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        x.parse(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="res/values/arrays.xml" source-language="en-US" target-language="es-US" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="array" datatype="x-android-resource" extype="0">\n' +
                '        <source>This is element 0</source>\n' +
                '        <target>Este es 0</target>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="3" resname="huzzah" restype="array" datatype="x-android-resource" extype="1">\n' +
                '        <source>This is element 1</source>\n' +
                '        <target>Este es 1</target>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="4" resname="huzzah" restype="array" datatype="x-android-resource" extype="2">\n' +
                '        <source>This is element 2</source>\n' +
                '        <target>Este es 2</target>\n' +
                '      </trans-unit>\n' +
                '      <trans-unit id="5" resname="huzzah" restype="array" datatype="x-android-resource" extype="3">\n' +
                '        <source>This is element 3</source>\n' +
                '        <target>Este es 3</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        const reslist = x.getResources();

        expect(reslist).toBeTruthy();

        expect(reslist.length).toBe(1);

        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getTargetLocale()).toBe("es-US");
        expect(reslist[0].getKey()).toBe("huzzah");
        expect(reslist[0].getPath()).toBe("res/values/arrays.xml");
        expect(reslist[0].getProject()).toBe("androidapp");
        expect(reslist[0].resType).toBe("array");
        expect(reslist[0].getOrigin()).toBe("source");

        let items = reslist[0].getSource();

        expect(items.length).toBe(4);
        expect(items[0]).toBe("This is element 0");
        expect(items[1]).toBe("This is element 1");
        expect(items[2]).toBe("This is element 2");
        expect(items[3]).toBe("This is element 3");

        items = reslist[0].getTarget();

        expect(items.length).toBe(4);
        expect(items[0]).toBe("Este es 0");
        expect(items[1]).toBe("Este es 1");
        expect(items[2]).toBe("Este es 2");
        expect(items[3]).toBe("Este es 3");
    });

    test("ResourceXliffParseWithArraysAndTranslationsPartial", () => {
        expect.assertions(20);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        x.parse(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="res/values/arrays.xml" source-language="en-US" target-language="es-US" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="5" resname="huzzah" restype="array" datatype="x-android-resource" extype="3">\n' +
                '        <source>This is element 3</source>\n' +
                '        <target>Este es 3</target>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        const reslist = x.getResources();

        expect(reslist).toBeTruthy();

        expect(reslist.length).toBe(1);

        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getTargetLocale()).toBe("es-US");
        expect(reslist[0].getKey()).toBe("huzzah");
        expect(reslist[0].getPath()).toBe("res/values/arrays.xml");
        expect(reslist[0].getProject()).toBe("androidapp");
        expect(reslist[0].resType).toBe("array");
        expect(reslist[0].getOrigin()).toBe("source");

        let items = reslist[0].getSourceArray();

        expect(items.length).toBe(4);
        expect(items[0]).toBeUndefined();
        expect(items[1]).toBeUndefined();
        expect(items[2]).toBeUndefined();
        expect(items[3]).toBe("This is element 3");

        items = reslist[0].getTargetArray();

        expect(items.length).toBe(4);
        expect(items[0]).toBeUndefined();
        expect(items[1]).toBeUndefined();
        expect(items[2]).toBeUndefined();
        expect(items[3]).toBe("Este es 3");
    });

    test("ResourceXliffParseWithComments", () => {
        expect.assertions(18);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        x.parse(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<xliff version="1.2">\n' +
                '  <file original="foo/bar/asdf.java" source-language="en-US" product-name="androidapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="1" resname="foobar" restype="string">\n' +
                '        <source>Asdf asdf</source>\n' +
                '        <note>A very nice string</note>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '  <file original="foo/bar/j.java" source-language="en-US" product-name="webapp">\n' +
                '    <body>\n' +
                '      <trans-unit id="2" resname="huzzah" restype="string">\n' +
                '        <source>baby baby</source>\n' +
                '        <note>Totally awesome.</note>\n' +
                '      </trans-unit>\n' +
                '    </body>\n' +
                '  </file>\n' +
                '</xliff>');

        const reslist = x.getResources();

        expect(reslist).toBeTruthy();

        expect(reslist[0].getSource()).toBe("Asdf asdf");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("androidapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].getComment()).toBe("A very nice string");
        expect(reslist[0].getId()).toBe("1");

        expect(reslist[1].getSource()).toBe("baby baby");
        expect(reslist[1].getSourceLocale()).toBe("en-US");
        expect(reslist[1].getKey()).toBe("huzzah");
        expect(reslist[1].getPath()).toBe("foo/bar/j.java");
        expect(reslist[1].getProject()).toBe("webapp");
        expect(reslist[1].resType).toBe("string");
        expect(reslist[1].getComment()).toBe("Totally awesome.");
        expect(reslist[1].getId()).toBe("2");
    });

    test("ResourceXliffParseWithContext", () => {
        expect.assertions(19);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        x.parse(
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

        const reslist = x.getResources();

        expect(reslist).toBeTruthy();

        expect(reslist.length).toBe(2);

        expect(reslist[0].getSource()).toBe("Asdf asdf");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("androidapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].getId()).toBe("1");
        expect(reslist[0].getContext()).toBe("na na na");

        expect(reslist[1].getSource()).toBe("baby baby");
        expect(reslist[1].getSourceLocale()).toBe("en-US");
        expect(reslist[1].getKey()).toBe("huzzah");
        expect(reslist[1].getPath()).toBe("foo/bar/j.java");
        expect(reslist[1].getProject()).toBe("webapp");
        expect(reslist[1].resType).toBe("string");
        expect(reslist[1].getId()).toBe("2");
        expect(reslist[1].getContext()).toBe("asdf");
    });

    test("ResourceXliffParseRealFile", () => {
        expect.assertions(3);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        const str = fs.readFileSync("test/testfiles/test.xliff", "utf-8");

        x.parse(str);

        const reslist = x.getResources();

        expect(reslist).toBeTruthy();

        expect(reslist.length).toBe(4);
    });

    test("ResourceXliffParseEmptySource", () => {
        expect.assertions(12);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        x.parse(
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

        const reslist = x.getResources();

        expect(reslist).toBeTruthy();

        expect(reslist.length).toBe(1);

        expect(reslist[0].getSource()).toBe("baby baby");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("huzzah");
        expect(reslist[0].getPath()).toBe("foo/bar/j.java");
        expect(reslist[0].getProject()).toBe("webapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].getId()).toBe("2");

        expect(reslist[0].getTarget()).toBe("bebe bebe");
        expect(reslist[0].getTargetLocale()).toBe("fr-FR");
    });

    test("ResourceXliffParseEmptyTarget", () => {
        expect.assertions(19);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        x.parse(
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

        const reslist = x.getResources();

        expect(reslist).toBeTruthy();

        expect(reslist.length).toBe(2);

        expect(reslist[0].getSource()).toBe("Asdf asdf");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("androidapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].getId()).toBe("1");
        expect(reslist[0].getOrigin()).toBe("source");

        expect(reslist[1].getSource()).toBe("baby baby");
        expect(reslist[1].getSourceLocale()).toBe("en-US");
        expect(reslist[1].getKey()).toBe("huzzah");
        expect(reslist[1].getPath()).toBe("foo/bar/j.java");
        expect(reslist[1].getProject()).toBe("webapp");
        expect(reslist[1].resType).toBe("string");
        expect(reslist[1].getId()).toBe("2");
        expect(reslist[1].getOrigin()).toBe("source");
    });

    test("ResourceXliffParseWithMrkTagInTarget", () => {
        expect.assertions(12);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        x.parse(
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

        const reslist = x.getResources();

        expect(reslist).toBeTruthy();

        expect(reslist.length).toBe(1);

        expect(reslist[0].getSource()).toBe("baby baby");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("huzzah");
        expect(reslist[0].getPath()).toBe("foo/bar/j.java");
        expect(reslist[0].getProject()).toBe("webapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].getId()).toBe("2");

        expect(reslist[0].getTarget()).toBe("bebe bebe");
        expect(reslist[0].getTargetLocale()).toBe("fr-FR");
    });

    test("ResourceXliffParseWithEmptyMrkTagInTarget", () => {
        expect.assertions(11);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        x.parse(
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

        const reslist = x.getResources();

        expect(reslist).toBeTruthy();

        expect(reslist.length).toBe(1);

        expect(reslist[0].getSource()).toBe("baby baby");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("huzzah");
        expect(reslist[0].getPath()).toBe("foo/bar/j.java");
        expect(reslist[0].getProject()).toBe("webapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].getId()).toBe("2");
        expect(reslist[0].getOrigin()).toBe("source");
    });

    test("ResourceXliffParseWithMultipleMrkTagsInTargetEuro", () => {
        expect.assertions(12);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        x.parse(
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

        const reslist = x.getResources();

        expect(reslist).toBeTruthy();

        expect(reslist.length).toBe(1);

        expect(reslist[0].getSource()).toBe("baby baby");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("huzzah");
        expect(reslist[0].getPath()).toBe("foo/bar/j.java");
        expect(reslist[0].getProject()).toBe("webapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].getId()).toBe("2");
            // it should preserve whitespace between inline elements
        expect(reslist[0].getTarget()).toBe("This is segment 1. This is segment 2. This is segment 3.");
        expect(reslist[0].getTargetLocale()).toBe("fr-FR");
    });

    test("ResourceXliffParseWithMultipleMrkTagsInTargetAsian", () => {
        expect.assertions(12);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        x.parse(
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

        const reslist = x.getResources();

        expect(reslist).toBeTruthy();

        expect(reslist.length).toBe(1);

        expect(reslist[0].getSource()).toBe("baby baby");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("huzzah");
        expect(reslist[0].getPath()).toBe("foo/bar/j.java");
        expect(reslist[0].getProject()).toBe("webapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].getId()).toBe("2");
        // it should preserve whitespace between inline elements
        expect(reslist[0].getTarget()).toBe("This is segment 1. This is segment 2. This is segment 3.");
        expect(reslist[0].getTargetLocale()).toBe("zh-Hans-CN");
    });

    test("ResourceXliffParsePreserveSourceWhitespace", () => {
        expect.assertions(9);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        x.parse(
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

        const reslist = x.getResources();

        expect(reslist).toBeTruthy();

        expect(reslist.length).toBe(1);

        expect(reslist[0].getSource()).toBe("      Add Another");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("      Add Another");
        expect(reslist[0].getPath()).toBe("UI/AddAnotherButtonView.m");
        expect(reslist[0].getProject()).toBe("iosapp");
        expect(reslist[0].resType).toBe("string");
    });

    test("ResourceXliffParsePreserveTargetWhitespace", () => {
        expect.assertions(9);

        const x = new ResourceXliff();
        expect(x).toBeTruthy();

        x.parse(
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

        const reslist = x.getResources();

        expect(reslist).toBeTruthy();

        expect(reslist.length).toBe(1);

        expect(reslist[0].getTarget()).toBe(" Añadir    Otro  ");
        expect(reslist[0].getTargetLocale()).toBe("es-US");
        expect(reslist[0].getKey()).toBe("      Add Another");
        expect(reslist[0].getPath()).toBe("UI/AddAnotherButtonView.m");
        expect(reslist[0].getProject()).toBe("iosapp");
        expect(reslist[0].resType).toBe("string");
    });

    test("ResourceXliffAddResourcesWithInstances", () => {
        expect.assertions(9);

        const x = new ResourceXliff({
            allowDups: true
        });
        expect(x).toBeTruthy();

        const res = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp"
        });

        const res2 = new ResourceString({
            source: "Asdf asdf",
            sourceLocale: "en-US",
            key: "foobar",
            pathName: "foo/bar/asdf.java",
            project: "webapp",
            comment: "special translators note"
        });
        res.addInstance(res2);

        x.addResource(res);

        const reslist = x.getResources({
            reskey: "foobar"
        });

        expect(reslist).toBeTruthy();

        expect(reslist.length).toBe(1);
        expect(reslist[0].getSource()).toBe("Asdf asdf");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("webapp");
        expect(!reslist[0].getComment()).toBeTruthy();
    });

    test("ResourceXliffAddMultipleResourcesAddInstances", () => {
        expect.assertions(17);

        const x = new ResourceXliff({
            allowDups: true
        });
        expect(x).toBeTruthy();

        let res = new ResourceString({
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

        const reslist = x.getResources({
            reskey: "foobar"
        });

        expect(reslist).toBeTruthy();

        expect(reslist.length).toBe(1);
        expect(reslist[0].getSource()).toBe("Asdf asdf");
        expect(reslist[0].getSourceLocale()).toBe("en-US");
        expect(reslist[0].getKey()).toBe("foobar");
        expect(reslist[0].getPath()).toBe("foo/bar/asdf.java");
        expect(reslist[0].getProject()).toBe("webapp");
        expect(!reslist[0].getComment()).toBeTruthy();

        const instances = reslist[0].getInstances();
        expect(instances).toBeTruthy();
        expect(instances.length).toBe(1);

        expect(instances[0].getSource()).toBe("Asdf asdf");
        expect(instances[0].getSourceLocale()).toBe("en-US");
        expect(instances[0].getKey()).toBe("foobar");
        expect(instances[0].getPath()).toBe("foo/bar/asdf.java");
        expect(instances[0].getProject()).toBe("webapp");
        expect(instances[0].getComment()).toBe("blah blah blah");
    });

    test("ResourceXliffGetTextWithResourcesWithInstances", () => {
        expect.assertions(2);

        const x = new ResourceXliff({
            allowDups: true
        });
        expect(x).toBeTruthy();

        let res = new ResourceString({
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

        const expected =
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<xliff version="1.2">\n' +
            '  <file original="foo/bar/asdf.java" source-language="en-US" product-name="webapp">\n' +
            '    <body>\n' +
            '      <trans-unit id="1" resname="foobar" restype="string" datatype="plaintext">\n' +
            '        <source>Asdf asdf</source>\n' +
            '      </trans-unit>\n' +
            '      <trans-unit id="2" resname="foobar" restype="string" datatype="plaintext">\n' +
            '        <source>Asdf asdf</source>\n' +
            '        <note>blah blah blah</note>\n' +
            '      </trans-unit>\n' +
            '    </body>\n' +
            '  </file>\n' +
            '</xliff>';

        const actual = x.getText();
        diff(actual, expected);

        expect(actual).toBe(expected);
    });

    test("ResourceXliffParseCreateInstances", () => {
        expect.assertions(21);

        const x = new ResourceXliff({
            allowDups: true
        });
        expect(x).toBeTruthy();

        x.parse(
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<xliff version="1.2">\n' +
            '  <file original="/a/b/asdf.js" source-language="en-US" target-language="fr-FR" product-name="iosapp">\n' +
            '    <body>\n' +
            '      <trans-unit id="2333" resname="asdf" restype="string" x-context="asdfasdf">\n' +
            '        <source>bababa</source>\n' +
            '        <target>ababab</target>\n' +
            '        <note>this is a comment</note>\n' +
            '      </trans-unit>\n' +
            '      <trans-unit id="2334" resname="asdf" restype="string" x-context="asdfasdf">\n' +
            '        <source>bababa</source>\n' +
            '        <target>ababab</target>\n' +
            '        <note>this is a different comment</note>\n' +
            '      </trans-unit>\n' +
            '    </body>\n' +
            '  </file>\n' +
            '</xliff>');

        const reslist = x.getResources();

        expect(reslist).toBeTruthy();

        expect(reslist.length).toBe(1);

        expect(reslist[0].getTarget()).toBe("ababab");
        expect(reslist[0].getTargetLocale()).toBe("fr-FR");
        expect(reslist[0].getKey()).toBe("asdf");
        expect(reslist[0].getPath()).toBe("/a/b/asdf.js");
        expect(reslist[0].getProject()).toBe("iosapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].context).toBe("asdfasdf");
        expect(reslist[0].comment).toBe("this is a comment");

        const instances = reslist[0].getInstances();
        expect(instances).toBeTruthy();
        expect(instances.length).toBe(1);

        expect(instances[0].getTarget()).toBe("ababab");
        expect(instances[0].getTargetLocale()).toBe("fr-FR");
        expect(instances[0].getKey()).toBe("asdf");
        expect(instances[0].getPath()).toBe("/a/b/asdf.js");
        expect(instances[0].getProject()).toBe("iosapp");
        expect(instances[0].resType).toBe("string");
        expect(instances[0].context).toBe("asdfasdf");
        expect(instances[0].comment).toBe("this is a different comment");
    });

    test("ResourceXliffParseStillAcceptsAnnotatesAttr", () => {
        expect.assertions(21);

        const x = new ResourceXliff({
            allowDups: true
        });
        expect(x).toBeTruthy();

        x.parse(
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

        const reslist = x.getResources();

        expect(reslist).toBeTruthy();

        expect(reslist.length).toBe(1);

        expect(reslist[0].getTarget()).toBe("ababab");
        expect(reslist[0].getTargetLocale()).toBe("fr-FR");
        expect(reslist[0].getKey()).toBe("asdf");
        expect(reslist[0].getPath()).toBe("/a/b/asdf.js");
        expect(reslist[0].getProject()).toBe("iosapp");
        expect(reslist[0].resType).toBe("string");
        expect(reslist[0].context).toBe("asdfasdf");
        expect(reslist[0].comment).toBe("this is a comment");

        const instances = reslist[0].getInstances();
        expect(instances).toBeTruthy();
        expect(instances.length).toBe(1);

        expect(instances[0].getTarget()).toBe("ababab");
        expect(instances[0].getTargetLocale()).toBe("fr-FR");
        expect(instances[0].getKey()).toBe("asdf");
        expect(instances[0].getPath()).toBe("/a/b/asdf.js");
        expect(instances[0].getProject()).toBe("iosapp");
        expect(instances[0].resType).toBe("string");
        expect(instances[0].context).toBe("asdfasdf");
        expect(instances[0].comment).toBe("this is a different comment");
    });
});
