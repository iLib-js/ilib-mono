/*
 * path.test.js - test the Path polyfill class
 *
 * Copyright © 2018, 2023 2021- 2022-2023JEDLSoft
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

import Path from '../src/Path.js';

describe("testPath", () => {
    test("DirnameSimple", () => {
        expect.assertions(1);
        expect(Path.dirname("a/b")).toBe("a");
    });

    test("DirnameComplex", () => {
        expect.assertions(1);
        expect(Path.dirname("a/b/c/foo.txt")).toBe("a/b/c");
    });

    test("DirnameNoParent", () => {
        expect.assertions(1);
        expect(Path.dirname("a")).toBe(".");
    });

    test("DirnameNormalizeToo", () => {
        expect.assertions(1);
        expect(Path.dirname("a/../b/c.txt")).toBe("b");
    });

    test("BasenameSimple", () => {
        expect.assertions(1);
        expect(Path.basename("c.txt")).toBe("c.txt");
    });

    test("BasenameWithExtension", () => {
        expect.assertions(1);
        expect(Path.basename("c.txt", "txt")).toBe("c");
    });

    test("BasenameWithExtensionAndDot", () => {
        expect.assertions(1);
        expect(Path.basename("c.txt", ".txt")).toBe("c");
    });

    test("BasenameWithDir", () => {
        expect.assertions(1);
        expect(Path.basename("a/b/c.txt")).toBe("c.txt");
    });

    test("BasenameWithDirAndExtension", () => {
        expect.assertions(1);
        expect(Path.basename("a/b/c.txt", "txt")).toBe("c");
    });

    test("BasenameWithDirAndExtensionWithDot", () => {
        expect.assertions(1);
        expect(Path.basename("a/b/c.txt", ".txt")).toBe("c");
    });

    test("NormalizeSimple", () => {
        expect.assertions(1);
        expect(Path.normalize("a/b/c.txt")).toBe("a/b/c.txt");
    });

    test("NormalizeRemoveDotDotSecondSpot", () => {
        expect.assertions(1);
        expect(Path.normalize("a/../b/c.txt")).toBe("b/c.txt");
    });

    test("NormalizeRemoveDotDotFurtherDown", () => {
        expect.assertions(1);
        expect(Path.normalize("a/b/../b/c.txt")).toBe("a/b/c.txt");
    });

    test("NormalizeRemoveDot", () => {
        expect.assertions(1);
        expect(Path.normalize("a/./b/c.txt")).toBe("a/b/c.txt");
    });

    test("NormalizeRemoveDotBeginning", () => {
        expect.assertions(1);
        expect(Path.normalize("./b/c.txt")).toBe("b/c.txt");
    });

    test("NormalizeRemoveDotEnd", () => {
        expect.assertions(1);
        expect(Path.normalize("a/b/.")).toBe("a/b");
    });

    test("NormalizeRemoveDotsAmongstDotDots", () => {
        expect.assertions(1);
        expect(Path.normalize(".././../b/c.txt")).toBe("../../b/c.txt");
    });

    test("NormalizeDontRemoveInitialSlash", () => {
        expect.assertions(1);
        expect(Path.normalize("/b/c.txt")).toBe("/b/c.txt");
    });

    test("NormalizeRemoveDotButDontRemoveInitialSlash", () => {
        expect.assertions(1);
        expect(Path.normalize("/b/.")).toBe("/b");
    });

    test("NormalizeRemoveMultipleSlashes", () => {
        expect.assertions(1);
        expect(Path.normalize("a//b//c.txt")).toBe("a/b/c.txt");
    });

    test("NormalizeConvertDOSToPosix", () => {
        expect.assertions(1);
        expect(Path.normalize("a\\b\\c.txt")).toBe("a/b/c.txt");
    });

    test("JoinSimple", () => {
        expect.assertions(1);
        expect(Path.join("b", "c.txt")).toBe("b/c.txt");
    });

    test("JoinMultiple", () => {
        expect.assertions(1);
        expect(Path.join("a", "b", "c", "d.txt")).toBe("a/b/c/d.txt");
    });

    test("JoinSingular", () => {
        expect.assertions(1);
        expect(Path.join("d.txt")).toBe("d.txt");
    });

    test("JoinNormalizeToo", () => {
        expect.assertions(1);
        expect(Path.join("a", "..", "./c.txt")).toBe("c.txt");
    });

    test("JoinNoDuplicateSlashes", () => {
        expect.assertions(1);
        expect(Path.join("b/", "/c.txt")).toBe("b/c.txt");
    });

    test("JoinUndefined", () => {
        expect.assertions(1);
        expect(Path.join()).toBe("");
    });

    test("FileUriToPathAbsolute", () => {
        expect.assertions(1);
        expect(Path.fileUriToPath("file:///a/b/c")).toBe("/a/b/c");
    });

    test("FileUriToPathRelative", () => {
        expect.assertions(1);
        expect(Path.fileUriToPath("file:../a/b/c")).toBe("../a/b/c");
    });

    test("FileUriToPathLocalhostOrMountPoint", () => {
        expect.assertions(1);
        expect(Path.fileUriToPath("file://localhost/a/b/c")).toBe("/a/b/c");
    });

    test("FileUriToPathDrive", () => {
        expect.assertions(1);
        expect(Path.fileUriToPath("file://c:/a/b/c")).toBe("/a/b/c");
    });

    test("FileUriToPathNoProtocol", () => {
        expect.assertions(1);
        expect(() => {
            var x = Path.fileUriToPath("http://yahoo.com/a/b/c");
        }).toThrow();
    });

});