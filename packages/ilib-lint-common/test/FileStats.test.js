/*
 * FileStats.test.js - test the file statistics object
 *
 * Copyright © 2023 JEDLSoft
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

import FileStats from '../src/FileStats.js';

describe("testFileStats", () => {
    test("FileStatsEmpty", () => {
        expect.assertions(5);

        const stats = new FileStats();
        expect(stats.getFiles()).toBe(1);
        expect(stats.getLines()).toBe(0);
        expect(stats.getBytes()).toBe(0);
        expect(stats.getModules()).toBe(0);
        expect(stats.getWords()).toBe(0);
    });

    test("FileStatsWithOptions", () => {
        expect.assertions(5);

        const stats = new FileStats({
            files: 4,
            lines: 456,
            bytes: 7853,
            modules: 2,
            words: 1234
        });
        expect(stats.getFiles()).toBe(4);
        expect(stats.getLines()).toBe(456);
        expect(stats.getBytes()).toBe(7853);
        expect(stats.getModules()).toBe(2);
        expect(stats.getWords()).toBe(1234);
    });

    test("FileStatsWithNonObjectOptions", () => {
        expect.assertions(5);

        // @ts-ignore
        const stats = new FileStats(true);
        expect(stats.getFiles()).toBe(1);
        expect(stats.getLines()).toBe(0);
        expect(stats.getBytes()).toBe(0);
        expect(stats.getModules()).toBe(0);
        expect(stats.getWords()).toBe(0);
    });

    test("FileStatsWithOptionsThatAreNotNumbers", () => {
        expect.assertions(5);

        const stats = new FileStats({
            files: true,
            lines: [1],
            bytes: foo => { return "bar"; },
            modules: "asdf",
            words: null
        });
        expect(stats.getFiles()).toBe(1);
        expect(stats.getLines()).toBe(0);
        expect(stats.getBytes()).toBe(0);
        expect(stats.getModules()).toBe(0);
        expect(stats.getWords()).toBe(0);
    });

    test("FileStatsAddStats", () => {
        expect.assertions(10);

        const stats1 = new FileStats({
            files: 4,
            lines: 456,
            bytes: 32452,
            modules: 2,
            words: 1234
        });
        const stats2 = new FileStats({
            files: 8,
            lines: 44,
            bytes: 94343,
            modules: 8,
            words: 5678
        });

        expect(stats1.getFiles()).toBe(4);
        expect(stats1.getLines()).toBe(456);
        expect(stats1.getBytes()).toBe(32452);
        expect(stats1.getModules()).toBe(2);
        expect(stats1.getWords()).toBe(1234);

        stats1.addStats(stats2);

        expect(stats1.getFiles()).toBe(12);
        expect(stats1.getLines()).toBe(500);
        expect(stats1.getBytes()).toBe(126795);
        expect(stats1.getModules()).toBe(10);
        expect(stats1.getWords()).toBe(6912);
    });

    test("FileStatsAddStatsToEmptyObj", () => {
        expect.assertions(10);

        const stats1 = new FileStats();
        const stats2 = new FileStats({
            files: 8,
            lines: 44,
            bytes: 94343,
            modules: 8,
            words: 5678
        });

        expect(stats1.getFiles()).toBe(1);
        expect(stats1.getLines()).toBe(0);
        expect(stats1.getBytes()).toBe(0);
        expect(stats1.getModules()).toBe(0);
        expect(stats1.getWords()).toBe(0);

        stats1.addStats(stats2);

        expect(stats1.getFiles()).toBe(9);
        expect(stats1.getLines()).toBe(44);
        expect(stats1.getBytes()).toBe(94343);
        expect(stats1.getModules()).toBe(8);
        expect(stats1.getWords()).toBe(5678);
    });

    test("FileStatsAddStatsNotAStatsInstance1", () => {
        expect.assertions(10);

        const stats = new FileStats({
            files: 4,
            lines: 456,
            bytes: 3423,
            modules: 2,
            words: 1234
        });

        expect(stats.getFiles()).toBe(4);
        expect(stats.getLines()).toBe(456);
        expect(stats.getBytes()).toBe(3423);
        expect(stats.getModules()).toBe(2);
        expect(stats.getWords()).toBe(1234);

        // @ts-ignore
        stats.addStats({x:2});

        expect(stats.getFiles()).toBe(4);
        expect(stats.getLines()).toBe(456);
        expect(stats.getBytes()).toBe(3423);
        expect(stats.getModules()).toBe(2);
        expect(stats.getWords()).toBe(1234);
    });

    test("FileStatsAddStatsNotAStatsInstance2", () => {
        expect.assertions(10);

        const stats = new FileStats({
            files: 4,
            lines: 456,
            bytes: 3423,
            modules: 2,
            words: 1234
        });

        expect(stats.getFiles()).toBe(4);
        expect(stats.getLines()).toBe(456);
        expect(stats.getBytes()).toBe(3423);
        expect(stats.getModules()).toBe(2);
        expect(stats.getWords()).toBe(1234);

        // @ts-ignore
        stats.addStats(true);

        expect(stats.getFiles()).toBe(4);
        expect(stats.getLines()).toBe(456);
        expect(stats.getBytes()).toBe(3423);
        expect(stats.getModules()).toBe(2);
        expect(stats.getWords()).toBe(1234);
    });

    test("FileStatsAddFiles", () => {
        expect.assertions(10);

        const stats = new FileStats({
            files: 4,
            lines: 456,
            bytes: 3423,
            modules: 2,
            words: 1234
        });

        expect(stats.getFiles()).toBe(4);
        expect(stats.getLines()).toBe(456);
        expect(stats.getBytes()).toBe(3423);
        expect(stats.getModules()).toBe(2);
        expect(stats.getWords()).toBe(1234);

        stats.addFiles(23);

        expect(stats.getFiles()).toBe(27);
        expect(stats.getLines()).toBe(456);
        expect(stats.getBytes()).toBe(3423);
        expect(stats.getModules()).toBe(2);
        expect(stats.getWords()).toBe(1234);
    });

    test("FileStatsAddFilesNotNumber", () => {
        expect.assertions(10);

        const stats = new FileStats({
            files: 4,
            lines: 456,
            bytes: 3423,
            modules: 2,
            words: 1234
        });

        expect(stats.getFiles()).toBe(4);
        expect(stats.getLines()).toBe(456);
        expect(stats.getBytes()).toBe(3423);
        expect(stats.getModules()).toBe(2);
        expect(stats.getWords()).toBe(1234);

        // @ts-ignore
        stats.addFiles("asdf");

        expect(stats.getFiles()).toBe(4);
        expect(stats.getLines()).toBe(456);
        expect(stats.getBytes()).toBe(3423);
        expect(stats.getModules()).toBe(2);
        expect(stats.getWords()).toBe(1234);
    });

    test("FileStatsAddLines", () => {
        expect.assertions(10);

        const stats = new FileStats({
            files: 4,
            lines: 456,
            bytes: 3423,
            modules: 2,
            words: 1234
        });

        expect(stats.getFiles()).toBe(4);
        expect(stats.getLines()).toBe(456);
        expect(stats.getBytes()).toBe(3423);
        expect(stats.getModules()).toBe(2);
        expect(stats.getWords()).toBe(1234);

        stats.addLines(23);

        expect(stats.getFiles()).toBe(4);
        expect(stats.getLines()).toBe(479);
        expect(stats.getBytes()).toBe(3423);
        expect(stats.getModules()).toBe(2);
        expect(stats.getWords()).toBe(1234);
    });

    test("FileStatsAddLinesNotNumber", () => {
        expect.assertions(10);

        const stats = new FileStats({
            files: 4,
            lines: 456,
            bytes: 3423,
            modules: 2,
            words: 1234
        });

        expect(stats.getFiles()).toBe(4);
        expect(stats.getLines()).toBe(456);
        expect(stats.getBytes()).toBe(3423);
        expect(stats.getModules()).toBe(2);
        expect(stats.getWords()).toBe(1234);

        // @ts-ignore
        stats.addLines("asdf");

        expect(stats.getFiles()).toBe(4);
        expect(stats.getLines()).toBe(456);
        expect(stats.getBytes()).toBe(3423);
        expect(stats.getModules()).toBe(2);
        expect(stats.getWords()).toBe(1234);
    });

    test("FileStatsAddBytes", () => {
        expect.assertions(10);

        const stats = new FileStats({
            files: 4,
            lines: 456,
            bytes: 3423,
            modules: 2,
            words: 1234
        });

        expect(stats.getFiles()).toBe(4);
        expect(stats.getLines()).toBe(456);
        expect(stats.getBytes()).toBe(3423);
        expect(stats.getModules()).toBe(2);
        expect(stats.getWords()).toBe(1234);

        stats.addBytes(23);

        expect(stats.getFiles()).toBe(4);
        expect(stats.getLines()).toBe(456);
        expect(stats.getBytes()).toBe(3446);
        expect(stats.getModules()).toBe(2);
        expect(stats.getWords()).toBe(1234);
    });

    test("FileStatsAddBytesNotNumber", () => {
        expect.assertions(10);

        const stats = new FileStats({
            files: 4,
            lines: 456,
            bytes: 3423,
            modules: 2,
            words: 1234
        });

        expect(stats.getFiles()).toBe(4);
        expect(stats.getLines()).toBe(456);
        expect(stats.getBytes()).toBe(3423);
        expect(stats.getModules()).toBe(2);
        expect(stats.getWords()).toBe(1234);

        // @ts-ignore
        stats.addBytes("asdf");

        expect(stats.getFiles()).toBe(4);
        expect(stats.getLines()).toBe(456);
        expect(stats.getBytes()).toBe(3423);
        expect(stats.getModules()).toBe(2);
        expect(stats.getWords()).toBe(1234);
    });

    test("FileStatsAddModules", () => {
        expect.assertions(10);

        const stats = new FileStats({
            files: 4,
            lines: 456,
            bytes: 3423,
            modules: 2,
            words: 1234
        });

        expect(stats.getFiles()).toBe(4);
        expect(stats.getLines()).toBe(456);
        expect(stats.getBytes()).toBe(3423);
        expect(stats.getModules()).toBe(2);
        expect(stats.getWords()).toBe(1234);

        stats.addModules(23);

        expect(stats.getFiles()).toBe(4);
        expect(stats.getLines()).toBe(456);
        expect(stats.getBytes()).toBe(3423);
        expect(stats.getModules()).toBe(25);
        expect(stats.getWords()).toBe(1234);
    });

    test("FileStatsAddModulesNotNumber", () => {
        expect.assertions(10);

        const stats = new FileStats({
            files: 4,
            lines: 456,
            bytes: 3423,
            modules: 2,
            words: 1234
        });

        expect(stats.getFiles()).toBe(4);
        expect(stats.getLines()).toBe(456);
        expect(stats.getBytes()).toBe(3423);
        expect(stats.getModules()).toBe(2);
        expect(stats.getWords()).toBe(1234);

        // @ts-ignore
        stats.addModules("asdf");

        expect(stats.getFiles()).toBe(4);
        expect(stats.getLines()).toBe(456);
        expect(stats.getBytes()).toBe(3423);
        expect(stats.getModules()).toBe(2);
        expect(stats.getWords()).toBe(1234);
    });

    test("FileStatsAddWords", () => {
        expect.assertions(10);

        const stats = new FileStats({
            files: 4,
            lines: 456,
            bytes: 3423,
            modules: 2,
            words: 1234
        });

        expect(stats.getFiles()).toBe(4);
        expect(stats.getLines()).toBe(456);
        expect(stats.getBytes()).toBe(3423);
        expect(stats.getModules()).toBe(2);
        expect(stats.getWords()).toBe(1234);

        stats.addWords(23);

        expect(stats.getFiles()).toBe(4);
        expect(stats.getLines()).toBe(456);
        expect(stats.getBytes()).toBe(3423);
        expect(stats.getModules()).toBe(2);
        expect(stats.getWords()).toBe(1257);
    });

    test("FileStatsAddWordsNotNumber", () => {
        expect.assertions(10);

        const stats = new FileStats({
            files: 4,
            lines: 456,
            bytes: 3423,
            modules: 2,
            words: 1234
        });

        expect(stats.getFiles()).toBe(4);
        expect(stats.getLines()).toBe(456);
        expect(stats.getBytes()).toBe(3423);
        expect(stats.getModules()).toBe(2);
        expect(stats.getWords()).toBe(1234);

        // @ts-ignore
        stats.addWords("asdf");

        expect(stats.getFiles()).toBe(4);
        expect(stats.getLines()).toBe(456);
        expect(stats.getBytes()).toBe(3423);
        expect(stats.getModules()).toBe(2);
        expect(stats.getWords()).toBe(1234);
    });

});

