/*
 * Resource.test.js - test the base resource object
 *
 * Copyright © 2022-2023, 2025 JEDLSoft
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

// For the most part, we need to test ResourceString instead of Resource
// directly because you cannot instantiate an abstract class. But, we
// can test the functionality of Resource via the ResourceString

describe("testResource", () => {
    test("ResourceConstructorEmpty", () => {
        expect.assertions(1);

        const rs = new ResourceString();
        expect(rs).toBeTruthy();
    });

    test("ResourceConstructorNoProps", () => {
        expect.assertions(1);

        const rs = new ResourceString({});
        expect(rs).toBeTruthy();
    });

    test("ResourceConstructor", () => {
        expect.assertions(1);

        const rs = new ResourceString({
            key: "asdf",
            source: "This is a test",
            sourceLocale: "de-DE",
            pathName: "a/b/c.java"
        });
        expect(rs).toBeTruthy();
    });

    test("ResourceGetAllFields", () => {
        expect.assertions(17);

        const rs = new ResourceString({
            project: "x",
            context: "y",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            reskey: "z",
            pathName: "a",
            autoKey: true,
            state: "new",
            id: 4,
            formatted: true,
            comment: "c",
            dnt: true,
            datatype: "d",
            localize: true,
            flavor: "e",
            resfile: "a/b/c/resource.xliff"
        });
        expect(rs).toBeTruthy();

        expect(rs.getProject()).toBe("x");
        expect(rs.getContext()).toBe("y");
        expect(rs.getSourceLocale()).toBe("en-US");
        expect(rs.getTargetLocale()).toBe("ja-JP");
        expect(rs.getKey()).toBe("z");
        expect(rs.getPath()).toBe("a");
        expect(rs.getAutoKey()).toBeTruthy();
        expect(rs.getState()).toBe("new");
        expect(rs.getId()).toBe(4);
        expect(rs.formatted).toBeTruthy();
        expect(rs.getComment()).toBe("c");
        expect(rs.getDNT()).toBeTruthy();
        expect(rs.getDataType()).toBe("d");
        expect(rs.localize).toBeTruthy();
        expect(rs.getFlavor()).toBe("e");
        expect(rs.getResFile()).toBe("a/b/c/resource.xliff");
    });

    test("ResourceIsInstanceSame", () => {
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
            targetLocale: "ja-JP"
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
            targetLocale: "ja-JP"
        });
        expect(dup).toBeTruthy();

        expect(rs.isInstance(dup)).toBeTruthy();
    });

    test("ResourceIsInstanceDifferInTranslationAffectingProperty", () => {
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
            targetLocale: "ja-JP"
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
            targetLocale: "de-DE"
        });
        expect(dup).toBeTruthy();

        expect(!rs.isInstance(dup)).toBeTruthy();
    });

    test("ResourceIsInstanceMissingProperty", () => {
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
            targetLocale: "ja-JP"
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
            sourceLocale: "en-US"
        });
        expect(dup).toBeTruthy();

        expect(!rs.isInstance(dup)).toBeTruthy();
    });

    test("ResourceIsInstanceDifferInTranslationNotAffectingProperty", () => {
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
            pathName: "a/b/c.md"
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
            pathName: "e/f/g.md"
        });
        expect(dup).toBeTruthy();

        expect(rs.isInstance(dup)).toBeTruthy();
    });

    test("ResourceIsInstanceEmpty", () => {
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
            pathName: "a/b/c.md"
        });
        expect(rs).toBeTruthy();

        const dup = new ResourceString({});
        expect(dup).toBeTruthy();

        expect(!rs.isInstance(dup)).toBeTruthy();
    });

    test("ResourceIsInstanceUndefined", () => {
        expect.assertions(2);

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
            pathName: "a/b/c.md"
        });
        expect(rs).toBeTruthy();

        expect(!rs.isInstance(undefined)).toBeTruthy();
    });

    test("ResourceIsInstanceNull", () => {
        expect.assertions(2);

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
            pathName: "a/b/c.md"
        });
        expect(rs).toBeTruthy();

        expect(!rs.isInstance(null)).toBeTruthy();
    });

    test("ResourceIsInstanceNotObject", () => {
        expect.assertions(2);

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
            pathName: "a/b/c.md"
        });
        expect(rs).toBeTruthy();

        expect(!rs.isInstance("foo")).toBeTruthy();
    });

    test("ResourceAddInstance", () => {
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
            pathName: "a/b/c.md"
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
            pathName: "d/e/f.md"
        });
        expect(dup).toBeTruthy();

        expect(rs.addInstance(dup)).toBeTruthy();
    });

    test("ResourceAddInstanceNotInstance", () => {
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
            pathName: "a/b/c.md"
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
            targetLocale: "de-DE",
            pathName: "d/e/f.md"
        });
        expect(dup).toBeTruthy();

        expect(!rs.addInstance(dup)).toBeTruthy();
    });

    test("ResourceAddInstanceSelf", () => {
        expect.assertions(2);

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
            pathName: "a/b/c.md"
        });
        expect(rs).toBeTruthy();

        // can't add yourself as an instance of yourself
        expect(!rs.addInstance(rs)).toBeTruthy();
    });

    test("ResourceAddInstanceUndefined", () => {
        expect.assertions(2);

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
            pathName: "a/b/c.md"
        });
        expect(rs).toBeTruthy();

        expect(!rs.addInstance(undefined)).toBeTruthy();
    });

    test("ResourceAddInstanceNull", () => {
        expect.assertions(2);

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
            pathName: "a/b/c.md"
        });
        expect(rs).toBeTruthy();

        expect(!rs.addInstance(null)).toBeTruthy();
    });

    test("ResourceAddInstanceNotObject", () => {
        expect.assertions(2);

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
            pathName: "a/b/c.md"
        });
        expect(rs).toBeTruthy();

        expect(!rs.addInstance("asdf")).toBeTruthy();
    });

    test("ResourceGetInstancesRightNumber", () => {
        expect.assertions(5);

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
            pathName: "a/b/c.md"
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
            pathName: "d/e/f.md"
        });
        expect(dup).toBeTruthy();

        expect(rs.addInstance(dup)).toBeTruthy();

        const instances = rs.getInstances();

        expect(instances).toBeTruthy();
        expect(instances.length).toBe(1);
    });

    test("ResourceGetInstancesRightContent", () => {
        expect.assertions(5);

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
            pathName: "a/b/c.md"
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
            pathName: "d/e/f.md"
        });
        expect(dup).toBeTruthy();

        expect(rs.addInstance(dup)).toBeTruthy();

        const instances = rs.getInstances();

        expect(instances).toBeTruthy();
        expect(instances[0]).toStrictEqual(dup);
    });

    test("ResourceGetInstancesNone", () => {
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
            pathName: "a/b/c.md"
        });
        expect(rs).toBeTruthy();

        const instances = rs.getInstances();

        expect(instances).toBeTruthy();
        expect(instances.length).toBe(0);
    });

    test("ResourceGetInstancesMultipleRightNumber", () => {
        expect.assertions(9);

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
            pathName: "a/b/c.md"
        });
        expect(rs).toBeTruthy();

        let dup = new ResourceString({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "d/e/f.md"
        });
        expect(dup).toBeTruthy();

        expect(rs.addInstance(dup)).toBeTruthy();

        dup = new ResourceString({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "g/h/i.md"
        });
        expect(dup).toBeTruthy();

        expect(rs.addInstance(dup)).toBeTruthy();

        dup = new ResourceString({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "j/k/l.md"
        });
        expect(dup).toBeTruthy();

        expect(rs.addInstance(dup)).toBeTruthy();

        const instances = rs.getInstances();

        expect(instances).toBeTruthy();
        expect(instances.length).toBe(3);
    });

    test("ResourceGetInstancesMultipleRightContent", () => {
        expect.assertions(9);

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
            pathName: "a/b/c.md"
        });
        expect(rs).toBeTruthy();

        let dup = new ResourceString({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "d/e/f.md"
        });
        expect(dup).toBeTruthy();

        expect(rs.addInstance(dup)).toBeTruthy();

        dup = new ResourceString({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "g/h/i.md"
        });
        expect(dup).toBeTruthy();

        expect(rs.addInstance(dup)).toBeTruthy();

        dup = new ResourceString({
            context: "a",
            datatype: "markdown",
            dnt: false,
            flavor: "asdf",
            project: "foo",
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "j/k/l.md"
        });
        expect(dup).toBeTruthy();

        expect(rs.addInstance(dup)).toBeTruthy();

        const instances = rs.getInstances();

        expect(instances).toBeTruthy();
        expect(instances[2]).toStrictEqual(dup);
    });

    test("ResourceSetSourceLocale", () => {
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
            pathName: "a/b/c.md"
        });
        expect(rs).toBeTruthy();

        expect(rs.getSourceLocale()).toBe("en-US");

        rs.setSourceLocale("de-DE");

        expect(rs.getSourceLocale()).toBe("de-DE");
    });

    test("ResourceSetSourceLocaleIsDirty", () => {
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
            pathName: "a/b/c.md"
        });
        expect(rs).toBeTruthy();

        expect(rs.isDirty()).toBeFalsy();

        rs.setSourceLocale("de-DE");

        expect(rs.isDirty()).toBeTruthy();
    });

    test("ResourceSetTargetLocale", () => {
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
            pathName: "a/b/c.md"
        });
        expect(rs).toBeTruthy();

        expect(rs.getTargetLocale()).toBe("ja-JP");

        rs.setTargetLocale("de-DE");

        expect(rs.getTargetLocale()).toBe("de-DE");
    });

    test("ResourceSetTargetLocaleIsDirty", () => {
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
            pathName: "a/b/c.md"
        });
        expect(rs).toBeTruthy();

        expect(rs.isDirty()).toBeFalsy();

        rs.setTargetLocale("de-DE");

        expect(rs.isDirty()).toBeTruthy();
    });

    test("ResourceSetState", () => {
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
            pathName: "a/b/c.md",
            state: "new"
        });
        expect(rs).toBeTruthy();

        expect(rs.getState()).toBe("new");

        rs.setState("translated");

        expect(rs.getState()).toBe("translated");
    });

    test("ResourceSetTargetLocaleIsDirty", () => {
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
            pathName: "a/b/c.md",
            state: "new"
        });
        expect(rs).toBeTruthy();

        expect(rs.isDirty()).toBeFalsy();

        rs.setState("translated");

        expect(rs.isDirty()).toBeTruthy();
    });

    test("ResourceSetProject", () => {
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
            pathName: "a/b/c.md",
            state: "new"
        });
        expect(rs).toBeTruthy();

        expect(rs.getProject()).toBe("foo");

        rs.setProject("asdf");

        expect(rs.getProject()).toBe("asdf");
    });

    test("ResourceSetProjectIsDirty", () => {
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
            pathName: "a/b/c.md",
            state: "new"
        });
        expect(rs).toBeTruthy();

        expect(rs.isDirty()).toBeFalsy();

        rs.setState("translated");

        expect(rs.isDirty()).toBeTruthy();
    });

    test("ResourceSetComment", () => {
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
            pathName: "a/b/c.md",
            state: "new",
            comment: "comment"
        });
        expect(rs).toBeTruthy();

        expect(rs.getComment()).toBe("comment");

        rs.setComment("other");

        expect(rs.getComment()).toBe("other");
    });

    test("ResourceSetCommentIsDirty", () => {
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
            pathName: "a/b/c.md",
            state: "new"
        });
        expect(rs).toBeTruthy();

        expect(rs.isDirty()).toBeFalsy();

        rs.setComment("asdf");

        expect(rs.isDirty()).toBeTruthy();
    });

    test("ResourceSetDNT", () => {
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
            pathName: "a/b/c.md",
            state: "new",
            comment: "comment"
        });
        expect(rs).toBeTruthy();

        expect(rs.getDNT()).toBeFalsy();

        rs.setDNT(true);

        expect(rs.getDNT()).toBeTruthy();
    });

    test("ResourceSetDNTIsDirty", () => {
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
            pathName: "a/b/c.md",
            state: "new"
        });
        expect(rs).toBeTruthy();

        expect(rs.isDirty()).toBeFalsy();

        rs.setDNT(true);

        expect(rs.isDirty()).toBeTruthy();
    });

    test("ResourceClearDirty", () => {
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
            pathName: "a/b/c.md"
        });
        expect(rs).toBeTruthy();

        expect(rs.isDirty()).toBeFalsy();

        rs.setSourceLocale("de-DE");

        expect(rs.isDirty()).toBeTruthy();

        rs.clearDirty();

        expect(!rs.isDirty()).toBeTruthy();
    });

    // Test all valid XLIFF 1.2 standard states using test.each
    test.each([
        ["needs-translation"],
        ["needs-l10n"],
        ["needs-adaptation"],
        ["translated"],
        ["needs-review-translation"],
        ["needs-review-l10n"],
        ["needs-review-adaptation"],
        ["final"]
    ])("ResourceSetStateXLIFF12Standard - %s", (state) => {
        expect.assertions(2);

        const rs = new ResourceString({
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "a/b/c.md",
            state: "new"
        });
        expect(rs).toBeTruthy();

        rs.setState(state);
        expect(rs.getState()).toBe(state);
    });

    // Test ilib/mojito custom states using test.each
    test.each([
        ["new"],
        ["signed-off"],
        ["accepted"]
    ])("ResourceSetStateIlibCustom - %s", (state) => {
        expect.assertions(2);

        const rs = new ResourceString({
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "a/b/c.md",
            state: "translated"
        });
        expect(rs).toBeTruthy();

        rs.setState(state);
        expect(rs.getState()).toBe(state);
    });

    // Test custom states with x- prefix using test.each
    test.each([
        ["x-pending-approval"],
        ["x-initial-draft"],
        ["x-rejected"],
        ["x-ready-for-review"],
        ["x-custom-workflow"],
        ["x-multi-word-state"],
        ["x-123-numeric"]
    ])("ResourceSetStateCustomXPrefix - %s", (state) => {
        expect.assertions(2);

        const rs = new ResourceString({
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "a/b/c.md",
            state: "new"
        });
        expect(rs).toBeTruthy();

        rs.setState(state);
        expect(rs.getState()).toBe(state);
    });

    // Test invalid states that should throw errors
    test.each([
        ["invalid-state"],
        ["not-x-prefixed"],
        ["x"], // just "x" without hyphen
        ["x-"], // x- with nothing after
        [""], // empty string
        [null], // null value
        [undefined], // undefined value
        [123], // numeric value
        [{}], // object value
        ["needs translation"], // space instead of hyphen
        ["NEEDS-TRANSLATION"], // uppercase (case sensitive)
        ["translated-extra"] // valid state with extra text
    ])("ResourceSetStateInvalidThrowsError - %s", (invalidState) => {
        expect.assertions(2);

        const rs = new ResourceString({
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "a/b/c.md",
            state: "new"
        });
        expect(rs).toBeTruthy();

        // Should throw an error when invalid state is set
        expect(() => {
            rs.setState(invalidState);
        }).toThrow();
    });

    // Test specific error message content
    test("ResourceSetStateErrorMessage", () => {
        expect.assertions(2);

        const rs = new ResourceString({
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "a/b/c.md",
            state: "new"
        });
        expect(rs).toBeTruthy();

        // Should throw an error with specific message
        expect(() => {
            rs.setState("invalid-state");
        }).toThrow('Attempt to set an invalid state on a resource: "invalid-state". Valid states are: needs-translation, needs-l10n, needs-adaptation, translated, needs-review-translation, needs-review-l10n, needs-review-adaptation, final, new, signed-off, accepted, or custom states starting with "x-"');
    });

    // Test state transitions between valid states
    test("ResourceSetStateTransitions", () => {
        expect.assertions(8);

        const rs = new ResourceString({
            reskey: "test.string",
            resType: "string",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            pathName: "a/b/c.md",
            state: "new"
        });
        expect(rs).toBeTruthy();

        // Test progression through workflow states
        rs.setState("needs-translation");
        expect(rs.getState()).toBe("needs-translation");

        rs.setState("translated");
        expect(rs.getState()).toBe("translated");

        rs.setState("needs-review-translation");
        expect(rs.getState()).toBe("needs-review-translation");

        rs.setState("final");
        expect(rs.getState()).toBe("final");

        // Test custom workflow states
        rs.setState("x-pending-approval");
        expect(rs.getState()).toBe("x-pending-approval");

        rs.setState("signed-off");
        expect(rs.getState()).toBe("signed-off");

        rs.setState("accepted");
        expect(rs.getState()).toBe("accepted");
    });

});
