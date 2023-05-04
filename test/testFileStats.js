/*
 * testFileStats.js - test the file statistics object
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

export const testFileStats = {
    testFileStatsEmpty: function(test) {
        test.expect(3);

        const stats = new FileStats();
        test.equal(stats.getFiles(), 1);
        test.equal(stats.getLines(), 0);
        test.equal(stats.getModules(), 0);

        test.done();
    },

    testFileStatsWithOptions: function(test) {
        test.expect(3);

        const stats = new FileStats({
            files: 4,
            lines: 456,
            modules: 2
        });
        test.equal(stats.getFiles(), 4);
        test.equal(stats.getLines(), 456);
        test.equal(stats.getModules(), 2);

        test.done();
    },

    testFileStatsWithNonObjectOptions: function(test) {
        test.expect(3);

        const stats = new FileStats(true);
        test.equal(stats.getFiles(), 1);
        test.equal(stats.getLines(), 0);
        test.equal(stats.getModules(), 0);

        test.done();
    },

    testFileStatsWithOptionsThatAreNotNumbers: function(test) {
        test.expect(3);

        const stats = new FileStats({
            files: true,
            lines: [1],
            modules: "asdf"
        });
        test.equal(stats.getFiles(), 1);
        test.equal(stats.getLines(), 0);
        test.equal(stats.getModules(), 0);

        test.done();
    },

    testFileStatsAddStats: function(test) {
        test.expect(6);

        const stats1 = new FileStats({
            files: 4,
            lines: 456,
            modules: 2
        });
        const stats2 = new FileStats({
            files: 8,
            lines: 44,
            modules: 8
        });

        test.equal(stats1.getFiles(), 4);
        test.equal(stats1.getLines(), 456);
        test.equal(stats1.getModules(), 2);

        stats1.addStats(stats2);

        test.equal(stats1.getFiles(), 12);
        test.equal(stats1.getLines(), 500);
        test.equal(stats1.getModules(), 10);

        test.done();
    },

    testFileStatsAddStatsNotAStatsInstance1: function(test) {
        test.expect(6);

        const stats = new FileStats({
            files: 4,
            lines: 456,
            modules: 2
        });

        test.equal(stats.getFiles(), 4);
        test.equal(stats.getLines(), 456);
        test.equal(stats.getModules(), 2);

        stats.addStats({x:2});

        test.equal(stats.getFiles(), 4);
        test.equal(stats.getLines(), 456);
        test.equal(stats.getModules(), 2);

        test.done();
    },

    testFileStatsAddStatsNotAStatsInstance2: function(test) {
        test.expect(6);

        const stats = new FileStats({
            files: 4,
            lines: 456,
            modules: 2
        });

        test.equal(stats.getFiles(), 4);
        test.equal(stats.getLines(), 456);
        test.equal(stats.getModules(), 2);

        stats.addStats(true);

        test.equal(stats.getFiles(), 4);
        test.equal(stats.getLines(), 456);
        test.equal(stats.getModules(), 2);

        test.done();
    },

    testFileStatsAddFiles: function(test) {
        test.expect(6);

        const stats = new FileStats({
            files: 4,
            lines: 456,
            modules: 2
        });

        test.equal(stats.getFiles(), 4);
        test.equal(stats.getLines(), 456);
        test.equal(stats.getModules(), 2);

        stats.addFiles(23);

        test.equal(stats.getFiles(), 27);
        test.equal(stats.getLines(), 456);
        test.equal(stats.getModules(), 2);

        test.done();
    },

    testFileStatsAddFilesNotNumber: function(test) {
        test.expect(6);

        const stats = new FileStats({
            files: 4,
            lines: 456,
            modules: 2
        });

        test.equal(stats.getFiles(), 4);
        test.equal(stats.getLines(), 456);
        test.equal(stats.getModules(), 2);

        stats.addFiles("asdf");

        test.equal(stats.getFiles(), 4);
        test.equal(stats.getLines(), 456);
        test.equal(stats.getModules(), 2);

        test.done();
    },

    testFileStatsAddLines: function(test) {
        test.expect(6);

        const stats = new FileStats({
            files: 4,
            lines: 456,
            modules: 2
        });

        test.equal(stats.getFiles(), 4);
        test.equal(stats.getLines(), 456);
        test.equal(stats.getModules(), 2);

        stats.addLines(23);

        test.equal(stats.getFiles(), 4);
        test.equal(stats.getLines(), 479);
        test.equal(stats.getModules(), 2);

        test.done();
    },

    testFileStatsAddLinesNotNumber: function(test) {
        test.expect(6);

        const stats = new FileStats({
            files: 4,
            lines: 456,
            modules: 2
        });

        test.equal(stats.getFiles(), 4);
        test.equal(stats.getLines(), 456);
        test.equal(stats.getModules(), 2);

        stats.addLines("asdf");

        test.equal(stats.getFiles(), 4);
        test.equal(stats.getLines(), 456);
        test.equal(stats.getModules(), 2);

        test.done();
    },

    testFileStatsAddModules: function(test) {
        test.expect(6);

        const stats = new FileStats({
            files: 4,
            lines: 456,
            modules: 2
        });

        test.equal(stats.getFiles(), 4);
        test.equal(stats.getLines(), 456);
        test.equal(stats.getModules(), 2);

        stats.addModules(23);

        test.equal(stats.getFiles(), 4);
        test.equal(stats.getLines(), 456);
        test.equal(stats.getModules(), 25);

        test.done();
    },

    testFileStatsAddModulesNotNumber: function(test) {
        test.expect(6);

        const stats = new FileStats({
            files: 4,
            lines: 456,
            modules: 2
        });

        test.equal(stats.getFiles(), 4);
        test.equal(stats.getLines(), 456);
        test.equal(stats.getModules(), 2);

        stats.addModules("asdf");

        test.equal(stats.getFiles(), 4);
        test.equal(stats.getLines(), 456);
        test.equal(stats.getModules(), 2);

        test.done();
    },
};

