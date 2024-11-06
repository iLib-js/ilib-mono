/*
 * walk.test.js - test the assemble utility
 *
 * Copyright © 2022, 2024 JEDLSoft
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

import walk from '../src/walk.js';

describe("testwalk", () => {
    test("WalkDir", () => {
        expect.assertions(3);
        const files = walk("test/ilib-mock", {quiet: true}).sort();
        expect(files.length).toBe(2);
        expect(files[0]).toBe("test/ilib-mock/assemble.mjs");
        expect(files[1]).toBe("test/ilib-mock/index.js");
    });

    test("WalkFile", () => {
        expect.assertions(2);
        const files = walk("test/ilib-mock/index.js", {quiet: true}).sort();
        expect(files.length).toBe(1);
        expect(files[0]).toBe("test/ilib-mock/index.js");
    });

    test("WalkNonExistentDir", () => {
        expect.assertions(1);
        const files = walk("test/ilib-mock/asdf", {quiet: true}).sort();
        expect(files.length).toBe(0);
    });

    test("WalkFileNonJSFile", () => {
        expect.assertions(1);
        const files = walk("test/ilib-mock/locale/mockdata.json", {quiet: true}).sort();
        expect(files.length).toBe(0);
    });

    test("WalkBadParamsUndefined", () => {
        expect.assertions(1);
        const files = walk({quiet: true}).sort();
        expect(files.length).toBe(0);
    });

    test("WalkBadParamsBoolean", () => {
        expect.assertions(1);
        const files = walk(true, {quiet: true}).sort();
        expect(files.length).toBe(0);
    });

    test("WalkBadParamsNumber", () => {
        expect.assertions(1);
        const files = walk(3, {quiet: true}).sort();
        expect(files.length).toBe(0);
    });

    test("WalkDirWithJsonExtension", () => {
        expect.assertions(8);
        const extensions = new Set();
        extensions.add(".json");
        const files = walk("test/ilib-mock/locale", {quiet: true, extensions }).sort();
        expect(files.length).toBe(7);
        expect(files[0]).toBe("test/ilib-mock/locale/de/DE/mockdata.json");
        expect(files[1]).toBe("test/ilib-mock/locale/de/mockdata.json");
        expect(files[2]).toBe("test/ilib-mock/locale/en/US/mockdata.json");
        expect(files[3]).toBe("test/ilib-mock/locale/en/mockdata.json");
        expect(files[4]).toBe("test/ilib-mock/locale/mockdata.json");
        expect(files[5]).toBe("test/ilib-mock/locale/und/DE/mockdata.json");
        expect(files[6]).toBe("test/ilib-mock/locale/und/US/mockdata.json");
    });

    test("WalkDirWithJsonExtension2", () => {
        expect.assertions(6);
        const extensions = new Set();
        extensions.add(".json");
        const files = walk("test/testfiles/resources2", {quiet: true, extensions }).sort();
        expect(files.length).toBe(5);
        expect(files[0]).toBe("test/testfiles/resources2/en/strings.json");
        expect(files[1]).toBe("test/testfiles/resources2/foobar.json");
        expect(files[2]).toBe("test/testfiles/resources2/ilibmanifest.json");
        expect(files[3]).toBe("test/testfiles/resources2/ko/strings.json");
        expect(files[4]).toBe("test/testfiles/resources2/strings.json");
    });
});
