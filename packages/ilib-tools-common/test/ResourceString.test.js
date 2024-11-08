/*
 * ResourceString.test.js - test the resource string object.
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

import { ResourceString } from "../src/index.js";

describe("testResourceString", () => {
    test("ResourceStringConstructorEmpty", () => {
        expect.assertions(1);

        const rs = new ResourceString();
        expect(rs).toBeTruthy();
    });

    test("ResourceStringConstructorNoProps", () => {
        expect.assertions(1);

        const rs = new ResourceString({});
        expect(rs).toBeTruthy();
    });

    test("ResourceStringConstructor", () => {
        expect.assertions(1);

        const rs = new ResourceString({
            key: "asdf",
            source: "This is a test",
            sourceLocale: "de-DE",
            pathName: "a/b/c.java"
        });
        expect(rs).toBeTruthy();
    });

    test("ResourceStringConstructorWithContext", () => {
        expect.assertions(1);

        const rs = new ResourceString({
            key: "asdf",
            source: "This is a test",
            sourceLocale: "de-DE",
            pathName: "a/b/c.java",
            context: "landscape"
        });
        expect(rs).toBeTruthy();
    });

    test("ResourceStringConstructorWithSourceAndTarget", () => {
        expect.assertions(1);

        const rs = new ResourceString({
            key: "asdf",
            source: "This is a test",
            sourceLocale: "en-US",
            pathName: "a/b/c.java",
            target: "Dies ist einen Test.",
            targetLocale: "de-DE"
        });
        expect(rs).toBeTruthy();
    });

    test("ResourceStringConstructorRightContents", () => {
        expect.assertions(7);

        const rs = new ResourceString({
            key: "asdf",
            source: "This is a test",
            sourceLocale: "de-DE",
            pathName: "a/b/c.java"
        });
        expect(rs).toBeTruthy();

        expect(rs.getKey()).toBe("asdf");
        expect(rs.getSource()).toBe("This is a test");
        expect(rs.getSourceLocale()).toBe("de-DE");
        expect(rs.pathName).toBe("a/b/c.java");
        expect(!rs.getTarget()).toBeTruthy(); // source-only string
        expect(!rs.getTargetLocale()).toBeTruthy();
    });

    test("ResourceStringConstructorSourceTargetRightContents", () => {
        expect.assertions(7);

        const rs = new ResourceString({
            key: "asdf",
            source: "This is a test",
            sourceLocale: "en-US",
            pathName: "a/b/c.java",
            target: "Dies ist einen Test.",
            targetLocale: "de-DE"
        });
        expect(rs).toBeTruthy();

        expect(rs.getKey()).toBe("asdf");
        expect(rs.getSource()).toBe("This is a test");
        expect(rs.sourceLocale).toBe("en-US");
        expect(rs.pathName).toBe("a/b/c.java");
        expect(rs.getTarget()).toBe("Dies ist einen Test.");
        expect(rs.getTargetLocale()).toBe("de-DE");
    });

    test("ResourceStringConstructorDefaults", () => {
        expect.assertions(6);

        const rs = new ResourceString({
            key: "asdf",
            source: "This is a test",
            pathName: "a/b/c.java"
        });
        expect(rs).toBeTruthy();

        // got the right one?
        expect(rs.getKey()).toBe("asdf");

        // now the defaults
        expect(rs.sourceLocale).toBe("en-US");
        expect(rs.origin).toBe("source");
        expect(rs.datatype).toBe("plaintext");
        expect(rs.resType).toBe("string");
    });

    test("ResourceStringGetKey", () => {
        expect.assertions(2);

        const rs = new ResourceString({
            key: "foo",
            source: "source string",
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        expect(rs).toBeTruthy();
        expect(rs.getKey()).toBe("foo");
    });

    test("ResourceStringAutoKey", () => {
        expect.assertions(2);

        const rs = new ResourceString({
            key: "foo",
            source: "source string",
            autoKey: true,
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        expect(rs).toBeTruthy();
        expect(rs.getAutoKey()).toBeTruthy();
    });

    test("ResourceStringNotAutoKey", () => {
        expect.assertions(2);

        const rs = new ResourceString({
            key: "foo",
            source: "source string",
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        expect(rs).toBeTruthy();
        expect(!rs.getAutoKey()).toBeTruthy();
    });

    test("ResourceStringGetKeyEmpty", () => {
        expect.assertions(2);

        const rs = new ResourceString();
        expect(rs).toBeTruthy();
        expect(!rs.getKey()).toBeTruthy();
    });

    test("ResourceStringGetContext", () => {
        expect.assertions(2);

        const rs = new ResourceString({
            key: "foo",
            source: "source string",
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE",
            context: "landscape"
        });
        expect(rs).toBeTruthy();
        expect(rs.getContext()).toBe("landscape");
    });

    test("ResourceStringGetContextEmpty", () => {
        expect.assertions(2);

        const rs = new ResourceString({
            key: "foo",
            source: "source string",
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        expect(rs).toBeTruthy();
        expect(!rs.getContext()).toBeTruthy();
    });

    test("ResourceStringGetSource", () => {
        expect.assertions(2);

        const rs = new ResourceString({
            key: "foo",
            source: "source string",
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        expect(rs).toBeTruthy();
        expect(rs.getSource()).toBe("source string");
    });

    test("ResourceStringSize", () => {
        expect.assertions(2);

        const rs = new ResourceString({
            key: "foo",
            source: "source string",
            pathName: "a/b/c.txt",
            locale: "de-DE"
        });

        expect(rs).toBeTruthy();
        expect(rs.size()).toBe(1); // should always be 1
    });

    test("ResourceStringGetSourceEmpty", () => {
        expect.assertions(2);

        const rs = new ResourceString();
        expect(rs).toBeTruthy();
        expect(!rs.getSource()).toBeTruthy();
    });

    test("ResourceStringClone", () => {
        expect.assertions(10);

        const rs = new ResourceString({
            project: "foo",
            context: "blah",
            targetLocale: "de-DE",
            key: "asdf",
            source: "This is a test",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(rs).toBeTruthy();

        const rs2 = rs.clone();

        expect(rs2).toBeTruthy();
        expect(rs2.project).toBe(rs.project);
        expect(rs2.context).toBe(rs.context);
        expect(rs2.sourceLocale).toBe(rs.sourceLocale);
        expect(rs2.reskey).toBe(rs.reskey);
        expect(rs2.getSource()).toStrictEqual(rs.getSource());
        expect(rs2.pathName).toBe(rs.pathName);
        expect(rs2.comment).toBe(rs.comment);
        expect(rs2.state).toBe(rs.state);
    });

    test("ResourceStringCloneWithOverrides", () => {
        expect.assertions(13);

        const rs = new ResourceString({
            project: "foo",
            context: "blah",
            key: "asdf",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Dies ist einen Test.",
            targetLocale: "de-DE",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(rs).toBeTruthy();

        const rs2 = rs.clone({
            targetLocale: "fr-FR",
            target: "Ceci est une teste.",
            state: "asdfasdf"
        });

        expect(rs2).toBeTruthy();
        expect(rs2.project).toBe(rs.project);
        expect(rs2.context).toBe(rs.context);
        expect(rs2.sourceLocale).toBe(rs.sourceLocale);
        expect(rs2.reskey).toBe(rs.reskey);
        expect(rs2.getSource()).toStrictEqual(rs.getSource());
        expect(rs2.getTarget()).toStrictEqual("Ceci est une teste.");
        expect(rs2.pathName).toBe(rs.pathName);
        expect(rs2.comment).toBe(rs.comment);
        expect(rs2.state).toBe("asdfasdf");

        expect(rs2.getTargetLocale() !== rs.getTargetLocale()).toBeTruthy();
        expect(rs2.getTarget() !== rs.getTarget()).toBeTruthy();
    });

    test("ResourceStringEquals", () => {
        expect.assertions(3);

        const ra1 = new ResourceString({
            project: "foo",
            context: "blah",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            key: "asdf",
            source: "This is a test",
            target: "Eine Test",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        const ra2 = new ResourceString({
            project: "foo",
            context: "blah",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            key: "asdf",
            source: "This is a test",
            target: "Eine Test",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        expect(ra1).toBeTruthy();
        expect(ra2).toBeTruthy();

        expect(ra1.equals(ra2)).toBeTruthy();
    });

    test("ResourceStringEqualsNot", () => {
        expect.assertions(3);

        const ra1 = new ResourceString({
            project: "foo",
            context: "asdf",
            sourceLocale: "en-US",
            key: "asdf",
            source: "This is a test",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        const ra2 = new ResourceString({
            project: "foo",
            context: "blah",
            sourceLocale: "en-US",
            key: "asdf",
            source: "This is a test",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        expect(ra1).toBeTruthy();
        expect(ra2).toBeTruthy();

        expect(!ra1.equals(ra2)).toBeTruthy();
    });

    test("ResourceStringEqualsNotTarget", () => {
        expect.assertions(3);

        const ra1 = new ResourceString({
            project: "foo",
            context: "blah",
            sourceLocale: "en-US",
            key: "asdf",
            source: "This is a test",
            targetLocale: "de-DE",
            target: "Einen Test!",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        const ra2 = new ResourceString({
            project: "foo",
            context: "blah",
            sourceLocale: "en-US",
            key: "asdf",
            source: "This is a test",
            targetLocale: "de-AT",
            target: "Einen Test!",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        expect(ra1).toBeTruthy();
        expect(ra2).toBeTruthy();

        expect(!ra1.equals(ra2)).toBeTruthy();
    });

    test("ResourceStringEqualsDifferentFlavor", () => {
        expect.assertions(3);

        const ra1 = new ResourceString({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: "This is a test",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted",
            flavor: "vanilla"
        });

        const ra2 = new ResourceString({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: "This is a test",
            pathName: "x.java",
            comment: "asdf asdf asdf asdf asdf",
            state: "done"
        });

        expect(ra1).toBeTruthy();
        expect(ra2).toBeTruthy();

        expect(!ra1.equals(ra2)).toBeTruthy();
    });

    test("ResourceStringEqualsIgnoreSomeFields", () => {
        expect.assertions(3);

        const ra1 = new ResourceString({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: "This is a test",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        const ra2 = new ResourceString({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: "This is a test",
            pathName: "x.java",
            comment: "asdf asdf asdf asdf asdf",
            state: "done"
        });

        expect(ra1).toBeTruthy();
        expect(ra2).toBeTruthy();

        expect(ra1.equals(ra2)).toBeTruthy();
    });

    test("ResourceStringEqualsContentDifferent", () => {
        expect.assertions(3);

        const ra1 = new ResourceString({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: "This is a test",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        const ra2 = new ResourceString({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: "This is not a test",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        expect(ra1).toBeTruthy();
        expect(ra2).toBeTruthy();

        expect(!ra1.equals(ra2)).toBeTruthy();
    });

    test("ResourceStringStaticHashKey", () => {
        expect.assertions(1);

        expect(ResourceString.hashKey("iosapp", "de-DE", "This is a test", "html", "chocolate")).toBe("rs_iosapp_de-DE_This is a test_html_chocolate_");
    });

    test("ResourceStringStaticHashKeyWithContext", () => {
        expect.assertions(1);

        expect(ResourceString.hashKey("iosapp", "de-DE", "This is a test", "html", "chocolate", "context")).toBe("rs_iosapp_de-DE_This is a test_html_chocolate_context");
    });

    test("ResourceStringStaticHashKeyMissingParts", () => {
        expect.assertions(1);

        expect(ResourceString.hashKey(undefined, "de-DE", undefined, undefined)).toBe("rs__de-DE____");
    });

    test("ResourceStringHashKey", () => {
        expect.assertions(2);

        const rs = new ResourceString({
            project: "iosapp",
            key: "This is a test",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Dies ist einen Test.",
            targetLocale: "de-DE",
            pathName: "a/b/c.java",
            datatype: "html"
        });
        expect(rs).toBeTruthy();

        expect(rs.hashKey()).toBe("rs_iosapp_de-DE_This is a test_html__");
    });

    test("ResourceStringHashKeyWithFlavor", () => {
        expect.assertions(2);

        const rs = new ResourceString({
            project: "iosapp",
            key: "This is a test",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Dies ist einen Test.",
            targetLocale: "de-DE",
            pathName: "a/b/c.java",
            datatype: "html",
            flavor: "chocolate"
        });
        expect(rs).toBeTruthy();

        expect(rs.hashKey()).toBe("rs_iosapp_de-DE_This is a test_html_chocolate_");
    });

    test("ResourceStringHashKeyWithFlavorAndContext", () => {
        expect.assertions(2);

        const rs = new ResourceString({
            project: "iosapp",
            key: "This is a test",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Dies ist einen Test.",
            targetLocale: "de-DE",
            pathName: "a/b/c.java",
            datatype: "html",
            flavor: "chocolate",
            context: "context"
        });
        expect(rs).toBeTruthy();

        expect(rs.hashKey()).toBe("rs_iosapp_de-DE_This is a test_html_chocolate_context");
    });

    test("ResourceStringSourceOnlyHashKey", () => {
        expect.assertions(2);

        const rs = new ResourceString({
            project: "iosapp",
            key: "This is a test",
            source: "This is a test",
            sourceLocale: "en-US",
            pathName: "a/b/c.java",
            datatype: "html"
        });
        expect(rs).toBeTruthy();

        expect(rs.hashKey()).toBe("rs_iosapp_en-US_This is a test_html__");
    });

    test("ResourceStringIsInstanceSame", () => {
        expect.assertions(3);

        const rs = new ResourceString({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: "This is a test"
        });
        expect(rs).toBeTruthy();

        const dup = new ResourceString({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: "This is a test"
        });
        expect(dup).toBeTruthy();

        expect(rs.isInstance(dup)).toBeTruthy();
    });

    test("ResourceStringIsInstanceDifferingOnlyInWhitespace", () => {
        expect.assertions(3);

        const rs = new ResourceString({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: "This is a test "
        });
        expect(rs).toBeTruthy();

        const dup = new ResourceString({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: "This \tis a   test    "
        });
        expect(dup).toBeTruthy();

        expect(rs.isInstance(dup)).toBeTruthy();
    });

    test("ResourceStringIsInstanceDifferingInSource", () => {
        expect.assertions(3);

        const rs = new ResourceString({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: "This is a test"
        });
        expect(rs).toBeTruthy();

        const dup = new ResourceString({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: "This is a test."
        });
        expect(dup).toBeTruthy();

        expect(!rs.isInstance(dup)).toBeTruthy();
    });

    test("ResourceStringSetSource", () => {
        expect.assertions(3);

        const rs = new ResourceString({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: "source string",
            target: "target string"
        });
        expect(rs).toBeTruthy();

        expect(rs.getSource()).toStrictEqual("source string");
        rs.setSource("other source");
        expect(rs.getSource()).toStrictEqual("other source");
    });

    test("ResourceStringSetSourceIsDirty", () => {
        expect.assertions(4);

        const rs = new ResourceString({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: "source string",
            target: "target string"
        });
        expect(rs).toBeTruthy();

        expect(rs.getSource()).toStrictEqual("source string");
        expect(!rs.isDirty()).toBeTruthy();

        rs.setSource("other source");
        expect(rs.isDirty()).toBeTruthy();
    });

    test("ResourceStringSetTarget", () => {
        expect.assertions(3);

        const rs = new ResourceString({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: "source string",
            target: "target string"
        });
        expect(rs).toBeTruthy();

        expect(rs.getTarget()).toStrictEqual("target string");
        rs.setTarget("other target");
        expect(rs.getTarget()).toStrictEqual("other target");
    });

    test("ResourceStringSetTargetIsDirty", () => {
        expect.assertions(4);

        const rs = new ResourceString({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: "source string",
            target: "target string"
        });
        expect(rs).toBeTruthy();

        expect(rs.getTarget()).toStrictEqual("target string");
        expect(!rs.isDirty()).toBeTruthy();

        rs.setTarget("other target");
        expect(rs.isDirty()).toBeTruthy();
    });

});