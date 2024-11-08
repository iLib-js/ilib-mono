/*
 * ResourceArray.test.js - test the resource array object.
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

import { ResourceArray } from "../src/index.js";

describe("testResourceArray", () => {
    test("ResourceArrayConstructorEmpty", () => {
        expect.assertions(1);

        const ra = new ResourceArray();
        expect(ra).toBeTruthy();
    });

    test("ResourceArrayConstructorNoProps", () => {
        expect.assertions(1);

        const ra = new ResourceArray({});
        expect(ra).toBeTruthy();
    });

    test("ResourceArrayConstructorEmptyNoSize", () => {
        expect.assertions(2);

        const ra = new ResourceArray();
        expect(ra).toBeTruthy();
        expect(ra.size()).toBe(0);
    });

    test("ResourceArrayConstructor", () => {
        expect.assertions(1);

        const ra = new ResourceArray({
            key: "asdf",
            source: ["This is a test", "This is also a test", "This is not"],
            sourceLocale: "de-DE",
            pathName: "a/b/c.java"
        });
        expect(ra).toBeTruthy();
    });

    test("ResourceArrayConstructorRightContents", () => {
        expect.assertions(5);

        const ra = new ResourceArray({
            key: "asdf",
            source: ["This is a test", "This is also a test", "This is not"],
            sourceLocale: "de-DE",
            pathName: "a/b/c.java"
        });
        expect(ra).toBeTruthy();

        expect(ra.getKey()).toBe("asdf");
        expect(ra.getSource()).toStrictEqual(["This is a test", "This is also a test", "This is not"]);
        expect(ra.getSourceLocale()).toBe("de-DE");
        expect(ra.pathName).toBe("a/b/c.java");
    });

    test("ResourceArrayConstructorFull", () => {
        expect.assertions(1);

        const ra = new ResourceArray({
            key: "asdf",
            source: ["This is a test", "This is also a test", "This is not"],
            sourceLocale: "en-US",
            target: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE",
            pathName: "a/b/c.java"
        });
        expect(ra).toBeTruthy();
    });

    test("ResourceArrayConstructorFullRightContents", () => {
        expect.assertions(7);

        const ra = new ResourceArray({
            key: "asdf",
            source: ["This is a test", "This is also a test", "This is not"],
            sourceLocale: "en-US",
            target: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE",
            pathName: "a/b/c.java"
        });
        expect(ra).toBeTruthy();

        expect(ra.getKey()).toBe("asdf");
        expect(ra.getSource()).toStrictEqual(["This is a test", "This is also a test", "This is not"]);
        expect(ra.getSourceLocale()).toBe("en-US");
        expect(ra.getTarget()).toStrictEqual(["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."]);
        expect(ra.getTargetLocale()).toBe("de-DE");
        expect(ra.pathName).toBe("a/b/c.java");
    });

    test("ResourceArrayConstructorBackwardsCompatible", () => {
        expect.assertions(7);

        const ra = new ResourceArray({
            key: "asdf",
            sourceArray: ["This is a test", "This is also a test", "This is not"],
            sourceLocale: "en-US",
            targetArray: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE",
            pathName: "a/b/c.java"
        });
        expect(ra).toBeTruthy();

        expect(ra.getKey()).toBe("asdf");
        expect(ra.getSourceArray()).toStrictEqual(["This is a test", "This is also a test", "This is not"]);
        expect(ra.getSourceLocale()).toBe("en-US");
        expect(ra.getTargetArray()).toStrictEqual(["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."]);
        expect(ra.getTargetLocale()).toBe("de-DE");
        expect(ra.pathName).toBe("a/b/c.java");
    });

    test("ResourceArrayConstructorDefaults", () => {
        expect.assertions(8);

        const ra = new ResourceArray({
            key: "asdf",
            source: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java"
        });
        expect(ra).toBeTruthy();

        // got the right one?
        expect(ra.getKey()).toBe("asdf");

        // now the defaults
        expect(ra.getSourceLocale()).toBe("en-US");
        expect(ra.origin).toBe("source");
        expect(ra.datatype).toBe("x-android-resource");
        expect(ra.resType).toBe("array");

        expect(!ra.getTargetLocale()).toBeTruthy();
        expect(!ra.target).toBeTruthy();
    });

    test("ResourceArrayConstructorRightSize", () => {
        expect.assertions(2);

        const ra = new ResourceArray({
            key: "asdf",
            source: ["This is a test", "This is also a test", "This is not"],
            sourceLocale: "de-DE",
            pathName: "a/b/c.java"
        });
        expect(ra).toBeTruthy();

        expect(ra.size()).toBe(3);
    });

    test("ResourceArrayGetKey", () => {
        expect.assertions(2);

        const ra = new ResourceArray({
            key: "foo",
            source: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        expect(ra).toBeTruthy();
        expect(ra.getKey()).toBe("foo");
    });

    test("ResourceArrayGetKeyEmpty", () => {
        expect.assertions(2);

        const ra = new ResourceArray();
        expect(ra).toBeTruthy();
        expect(!ra.getKey()).toBeTruthy();
    });

    test("ResourceStringGetContext", () => {
        expect.assertions(2);

        const ra = new ResourceArray({
            key: "foo",
            source: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE",
            context: "landscape"
        });
        expect(ra).toBeTruthy();
        expect(ra.getContext()).toBe("landscape");
    });

    test("ResourceStringGetContextEmpty", () => {
        expect.assertions(2);

        const ra = new ResourceArray({
            key: "foo",
            source: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        expect(ra).toBeTruthy();
        expect(!ra.getContext()).toBeTruthy();
    });

    test("ResourceArrayGetSource", () => {
        expect.assertions(2);

        const ra = new ResourceArray({
            key: "foo",
            source: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        expect(ra).toBeTruthy();
        expect(ra.getSource()).toStrictEqual(["This is a test", "This is also a test", "This is not"]);
    });

    test("ResourceArrayGetItemArrayEmpty", () => {
        expect.assertions(2);

        const ra = new ResourceArray();
        expect(ra).toBeTruthy();
        expect(ra.getSource()).toStrictEqual([]);
    });

    test("ResourceArrayGetTargetArrayEmpty", () => {
        expect.assertions(2);

        const ra = new ResourceArray();
        expect(ra).toBeTruthy();
        expect(!ra.getTarget()).toBeTruthy();
    });

    test("ResourceArrayGetItem", () => {
        expect.assertions(4);

        const ra = new ResourceArray({
            key: "foo",
            source: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        expect(ra).toBeTruthy();
        expect(ra.getSourceItem(0)).toBe("This is a test");
        expect(ra.getSourceItem(1)).toBe("This is also a test");
        expect(ra.getSourceItem(2)).toBe("This is not");
    });

    test("ResourceArrayGetTarget", () => {
        expect.assertions(4);

        const ra = new ResourceArray({
            key: "foo",
            source: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            sourceLocale: "en-US",
            target: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE"
        });
        expect(ra).toBeTruthy();
        expect(ra.getTargetItem(0)).toBe("Dies ist einen Test.");
        expect(ra.getTargetItem(1)).toBe("Dies ist auch einen Test.");
        expect(ra.getTargetItem(2)).toBe("Dies ist nicht.");
    });

    test("ResourceArrayGetItemNegativeIndex", () => {
        expect.assertions(2);

        const ra = new ResourceArray({
            key: "foo",
            source: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        expect(ra).toBeTruthy();
        expect(!ra.getSourceItem(-1)).toBeTruthy();
    });

    test("ResourceArrayGetTargetNegativeIndex", () => {
        expect.assertions(2);

        const ra = new ResourceArray({
            key: "foo",
            source: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            sourceLocale: "en-US",
            target: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE"
        });
        expect(ra).toBeTruthy();
        expect(!ra.getTargetItem(-1)).toBeTruthy();
    });

    test("ResourceArrayGetItemIndexTooBig", () => {
        expect.assertions(2);

        const ra = new ResourceArray({
            key: "foo",
            source: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        expect(ra).toBeTruthy();
        expect(!ra.getSourceItem(6)).toBeTruthy();
    });

    test("ResourceArrayGetTargetIndexTooBig", () => {
        expect.assertions(2);

        const ra = new ResourceArray({
            key: "foo",
            source: ["This is a test", "This is also a test", "This is not"],
            target: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE",
            pathName: "a/b/c.txt",
            sourceLocale: "en-US"
        });
        expect(ra).toBeTruthy();
        expect(!ra.getTargetItem(6)).toBeTruthy();
    });

    test("ResourceArrayGetIndexNotWhole", () => {
        expect.assertions(2);

        const ra = new ResourceArray({
            key: "foo",
            source: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.txt",
            sourceLocale: "de-DE"
        });
        expect(ra).toBeTruthy();
        expect(!ra.getSourceItem(2.6)).toBeTruthy();
    });

    test("ResourceArrayClone", () => {
        expect.assertions(12);

        const ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "en-US",
            key: "asdf",
            source: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted",
            target: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE"
        });
        expect(ra).toBeTruthy();

        const ra2 = ra.clone();

        expect(ra2).toBeTruthy();
        expect(ra2.project).toBe(ra.project);
        expect(ra2.context).toBe(ra.context);
        expect(ra2.getSourceLocale()).toBe(ra.getSourceLocale());
        expect(ra2.reskey).toBe(ra.reskey);
        expect(ra2.source).toStrictEqual(ra.source);
        expect(ra2.pathName).toBe(ra.pathName);
        expect(ra2.comment).toBe(ra.comment);
        expect(ra2.state).toBe(ra.state);
        expect(ra2.getTargetLocale()).toBe(ra.getTargetLocale());
        expect(ra2.target).toStrictEqual(ra.target);
    });

    test("ResourceArrayCloneWithOverrides", () => {
        expect.assertions(12);

        const ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(ra).toBeTruthy();

        const ra2 = ra.clone({
            sourceLocale: "fr-FR",
            state: "asdfasdf",
            target: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE"
        });

        expect(ra2).toBeTruthy();
        expect(ra2.project).toBe(ra.project);
        expect(ra2.context).toBe(ra.context);
        expect(ra2.getSourceLocale()).toBe("fr-FR");
        expect(ra2.reskey).toBe(ra.reskey);
        expect(ra2.array).toStrictEqual(ra.array);
        expect(ra2.pathName).toBe(ra.pathName);
        expect(ra2.comment).toBe(ra.comment);
        expect(ra2.state).toBe("asdfasdf");
        expect(ra2.getTargetLocale()).toBe("de-DE");
        expect(ra2.target).toStrictEqual(["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."]);
    });

    test("ResourceArrayAddSourceString", () => {
        expect.assertions(2);

        const ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(ra).toBeTruthy();

        ra.addSourceItem(3, "This is the third one")

        expect(ra.getSourceItem(3)).toBe("This is the third one");
    });

    test("ResourceArrayAddSourceStringIsDirty", () => {
        expect.assertions(4);

        const ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(ra).toBeTruthy();

        expect(!ra.isDirty()).toBeTruthy();
        ra.addSourceItem(3, "This is the third one")

        expect(ra.getSourceItem(3)).toBe("This is the third one");
        expect(ra.isDirty()).toBeTruthy();
    });

    test("ResourceArrayAddTargetString", () => {
        expect.assertions(2);

        const ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted",
            target: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE"
        });
        expect(ra).toBeTruthy();

        ra.addTargetItem(3, "This is the third one")

        expect(ra.getTargetItem(3)).toBe("This is the third one");
    });

    test("ResourceArrayAddTargetStringIsDirty", () => {
        expect.assertions(4);

        const ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted",
            target: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE"
        });
        expect(ra).toBeTruthy();

        expect(!ra.isDirty()).toBeTruthy();
        ra.addTargetItem(3, "This is the third one")

        expect(ra.getTargetItem(3)).toBe("This is the third one");
        expect(ra.isDirty()).toBeTruthy();
    });

    test("ResourceArrayAddStringReplace", () => {
        expect.assertions(3);

        const ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(ra).toBeTruthy();

        expect(ra.getSourceItem(2)).toBe("This is not");

        ra.addSourceItem(2, "This isn't a test")

        expect(ra.getSourceItem(2)).toBe("This isn't a test");
    });

    test("ResourceArrayAddTargetReplace", () => {
        expect.assertions(3);

        const ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted",
            target: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE"
        });
        expect(ra).toBeTruthy();

        expect(ra.getTargetItem(2)).toBe("Dies ist nicht.");

        ra.addTargetItem(2, "Dies ist nicht einen Test.")

        expect(ra.getTargetItem(2)).toBe("Dies ist nicht einen Test.");
    });

    test("ResourceArrayAddStringSize", () => {
        expect.assertions(3);

        const ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(ra).toBeTruthy();

        expect(ra.size()).toBe(3);

        ra.addSourceItem(3, "This is the third one")

        expect(ra.size()).toBe(4);
    });

    test("ResourceArrayAddTargetSize", () => {
        expect.assertions(3);

        const ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "en-US",
            key: "asdf",
            source: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted",
            target: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE"
        });
        expect(ra).toBeTruthy();

        expect(ra.size()).toBe(3);

        ra.addTargetItem(3, "This is the third one")

        expect(ra.size()).toBe(4);
    });

    test("ResourceArrayAddStringUndefined", () => {
        expect.assertions(3);

        const ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(ra).toBeTruthy();

        expect(ra.getSourceItem(1)).toBe("This is also a test");

        ra.addSourceItem(1, undefined)

        expect(ra.getSourceItem(1)).toBe("This is also a test");
    });

    test("ResourceArrayAddTargetUndefined", () => {
        expect.assertions(3);

        const ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted",
            target: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE"
        });
        expect(ra).toBeTruthy();

        expect(ra.getTargetItem(1)).toBe("Dies ist auch einen Test.");

        ra.addTargetItem(1, undefined)

        expect(ra.getTargetItem(1)).toBe("Dies ist auch einen Test.");
    });

    test("ResourceArrayAddStringNoIndex", () => {
        expect.assertions(3);

        const ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(ra).toBeTruthy();

        expect(ra.size()).toBe(3);

        ra.addSourceItem(undefined, "foobar")

        expect(ra.size()).toBe(3);
    });

    test("ResourceArrayAddTargetNoIndex", () => {
        expect.assertions(3);

        const ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted",
            target: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE"
        });
        expect(ra).toBeTruthy();

        expect(ra.size()).toBe(3);

        ra.addTargetItem(undefined, "foobar")

        expect(ra.size()).toBe(3);
    });

    test("ResourceArrayAddStringEmpty", () => {
        expect.assertions(3);

        const ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(ra).toBeTruthy();

        expect(ra.size()).toBe(0);

        ra.addSourceItem(0, "foobar")

        expect(ra.size()).toBe(1);
    });

    test("ResourceArrayAddStringEmptyRightContents", () => {
        expect.assertions(3);

        const ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(ra).toBeTruthy();

        expect(!ra.getSourceItem(0)).toBeTruthy();

        ra.addSourceItem(0, "foobar")

        expect(ra.getSourceItem(0)).toBe("foobar");
    });

    test("ResourceArrayAddTargetEmptyRightContents", () => {
        expect.assertions(3);

        const ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(ra).toBeTruthy();

        expect(!ra.getTargetItem(0)).toBeTruthy();

        ra.addTargetItem(0, "foobar")

        expect(ra.getTargetItem(0)).toBe("foobar");
    });

    test("ResourceArrayAddStringMultiple", () => {
        expect.assertions(6);

        const ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: ["This is a test", "This is also a test", "This is not"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(ra).toBeTruthy();

        ra.addSourceItem(3, "This is the third one")
        ra.addSourceItem(4, "This is the fourth one")

        expect(ra.getSourceItem(0)).toBe("This is a test");
        expect(ra.getSourceItem(1)).toBe("This is also a test");
        expect(ra.getSourceItem(2)).toBe("This is not");
        expect(ra.getSourceItem(3)).toBe("This is the third one");
        expect(ra.getSourceItem(4)).toBe("This is the fourth one");
    });

    test("ResourceArrayEqualsSourceOnly", () => {
        expect.assertions(3);

        const ra1 = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: ["a", "b", "c"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        const ra2 = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: ["a", "b", "c"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        expect(ra1).toBeTruthy();
        expect(ra2).toBeTruthy();

        expect(ra1.equals(ra2)).toBeTruthy();
    });

    test("ResourceArrayEqualsFull", () => {
        expect.assertions(3);

        const ra1 = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: ["a", "b", "c"],
            target: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        const ra2 = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: ["a", "b", "c"],
            target: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        expect(ra1).toBeTruthy();
        expect(ra2).toBeTruthy();

        expect(ra1.equals(ra2)).toBeTruthy();
    });

    test("ResourceArrayEqualsSourceOnlyNot", () => {
        expect.assertions(3);

        const ra1 = new ResourceArray({
            project: "foo",
            context: "asdf",
            sourceLocale: "de-DE",
            key: "asdf",
            source: ["a", "b", "c"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        const ra2 = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: ["a", "b", "c"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        expect(ra1).toBeTruthy();
        expect(ra2).toBeTruthy();

        expect(!ra1.equals(ra2)).toBeTruthy();
    });

    test("ResourceArrayEqualsFullNot", () => {
        expect.assertions(3);

        const ra1 = new ResourceArray({
            project: "foo",
            context: "asdf",
            sourceLocale: "de-DE",
            key: "asdf",
            source: ["a", "b", "c"],
            target: ["Dies ist einen Test.", "Dies ist auch einen Test.", "Dies ist nicht."],
            targetLocale: "de-DE",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        const ra2 = new ResourceArray({
            project: "foo",
            context: "asdf",
            sourceLocale: "de-DE",
            key: "asdf",
            source: ["a", "b", "c"],
            target: ["Dies ist einen Test.", "Dies ist auch Test.", "Dies ist nicht."],
            targetLocale: "de-DE",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        expect(ra1).toBeTruthy();
        expect(ra2).toBeTruthy();

        expect(!ra1.equals(ra2)).toBeTruthy();
    });

    test("ResourceArrayEqualsIgnoreSomeFields", () => {
        expect.assertions(3);

        const ra1 = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: ["a", "b", "c"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        const ra2 = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: ["a", "b", "c"],
            pathName: "x.java",
            comment: "asdf asdf asdf asdf asdf",
            state: "done"
        });

        expect(ra1).toBeTruthy();
        expect(ra2).toBeTruthy();

        expect(ra1.equals(ra2)).toBeTruthy();
    });

    test("ResourceArrayEqualsContentDifferent", () => {
        expect.assertions(3);

        const ra1 = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: ["a", "b", "c"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        const ra2 = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "de-DE",
            key: "asdf",
            source: ["a", "b", "d"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });

        expect(ra1).toBeTruthy();
        expect(ra2).toBeTruthy();

        expect(!ra1.equals(ra2)).toBeTruthy();
    });

    test("ResourceArrayStaticHashKey", () => {
        expect.assertions(1);

        expect(ResourceArray.hashKey("androidapp", "foo", "de-DE", "This is a test")).toBe("ra_androidapp_foo_de-DE_This is a test");
    });

    test("ResourceArrayStaticHashKeyMissingParts", () => {
        expect.assertions(1);

        expect(ResourceArray.hashKey(undefined, undefined, "de-DE", undefined)).toBe("ra___de-DE_");
    });

    test("ResourceArrayHashKeySourceOnly", () => {
        expect.assertions(2);

        const ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "en-US",
            key: "asdf",
            source: ["a", "b", "c"],
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(ra).toBeTruthy();

        expect(ra.hashKey()).toBe("ra_foo_blah_en-US_asdf");

    });

    test("ResourceArrayHashKeySourceOnly", () => {
        expect.assertions(2);

        const ra = new ResourceArray({
            project: "foo",
            context: "blah",
            sourceLocale: "en-US",
            key: "asdf",
            source: ["a", "b", "c"],
            target: ["Dies ist einen Test.", "Dies ist auch Test.", "Dies ist nicht."],
            targetLocale: "de-DE",
            pathName: "a/b/c.java",
            comment: "foobar foo",
            state: "accepted"
        });
        expect(ra).toBeTruthy();

        expect(ra.hashKey()).toBe("ra_foo_blah_de-DE_asdf");
    });

    test("ResourceArrayIsInstanceSame", () => {
        expect.assertions(3);

        const rs = new ResourceArray({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: ["a", "b", "c"]
        });
        expect(rs).toBeTruthy();

        const dup = new ResourceArray({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: ["a", "b", "c"]
        });
        expect(dup).toBeTruthy();

        expect(rs.isInstance(dup)).toBeTruthy();
    });

    test("ResourceArrayIsInstanceDifferingOnlyInWhitespace", () => {
        expect.assertions(3);

        const rs = new ResourceArray({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: ["a b c", "b", "c"]
        });
        expect(rs).toBeTruthy();

        const dup = new ResourceArray({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: [" a   b\t\tc  \t", " b", "c "]
        });
        expect(dup).toBeTruthy();

        expect(rs.isInstance(dup)).toBeTruthy();
    });

    test("ResourceArrayIsInstanceDifferingInSource", () => {
        expect.assertions(3);

        const rs = new ResourceArray({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: ["a", "b", "c"]
        });
        expect(rs).toBeTruthy();

        const dup = new ResourceArray({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: ["a", "b", "cd"]
        });
        expect(dup).toBeTruthy();

        expect(!rs.isInstance(dup)).toBeTruthy();
    });

    test("ResourceArraySetSource", () => {
        expect.assertions(3);

        const rs = new ResourceArray({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: ["a b c", "b", "c"],
            target: ["a b c", "b", "c"]
        });
        expect(rs).toBeTruthy();

        expect(rs.getSource()).toStrictEqual(["a b c", "b", "c"]);
        rs.setSource(["x", "y", "z"]);
        expect(rs.getSource()).toStrictEqual(["x", "y", "z"]);
    });

    test("ResourceArraySetSourceIsDirty", () => {
        expect.assertions(4);

        const rs = new ResourceArray({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: ["a b c", "b", "c"],
            target: ["a b c", "b", "c"]
        });
        expect(rs).toBeTruthy();

        expect(rs.getSource()).toStrictEqual(["a b c", "b", "c"]);
        expect(!rs.isDirty()).toBeTruthy();

        rs.setSource(["x", "y", "z"]);
        expect(rs.isDirty()).toBeTruthy();
    });

    test("ResourceArraySetTarget", () => {
        expect.assertions(3);

        const rs = new ResourceArray({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: ["a b c", "b", "c"],
            target: ["a b c", "b", "c"]
        });
        expect(rs).toBeTruthy();

        expect(rs.getTarget()).toStrictEqual(["a b c", "b", "c"]);
        rs.setTarget(["x", "y", "z"]);
        expect(rs.getTarget()).toStrictEqual(["x", "y", "z"]);
    });

    test("ResourceArraySetTargetIsDirty", () => {
        expect.assertions(4);

        const rs = new ResourceArray({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: ["a b c", "b", "c"],
            target: ["a b c", "b", "c"]
        });
        expect(rs).toBeTruthy();

        expect(rs.getTarget()).toStrictEqual(["a b c", "b", "c"]);
        expect(!rs.isDirty()).toBeTruthy();

        rs.setTarget(["x", "y", "z"]);
        expect(rs.isDirty()).toBeTruthy();
    });
});
