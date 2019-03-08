/*
 * testCSVFileType.js - test the CSV file type handler object.
 *
 * Copyright © 2019, Box, Inc.
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

if (!CSVFileType) {
    var CSVFileType = require("../CSVFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
}

var p = new CustomProject({
    sourceLocale: "en-US",
    plugins: ["../."]
}, "./testfiles", {
    locales:["en-GB"]
});

module.exports.CSVfiletype = {
    testCSVFileTypeConstructor: function(test) {
        test.expect(1);

        var htf = new CSVFileType(p);

        test.ok(htf);

        test.done();
    },

    testCSVFileTypeHandlesCSV: function(test) {
        test.expect(2);

        var htf = new CSVFileType(p);
        test.ok(htf);

        test.ok(htf.handles("foo.csv"));

        test.done();
    },

    testCSVFileTypeHandlesCSV: function(test) {
        test.expect(2);

        var htf = new CSVFileType(p);
        test.ok(htf);

        test.ok(htf.handles("foo.CSV"));

        test.done();
    },

    testCSVFileTypeHandlestsv: function(test) {
        test.expect(2);

        var htf = new CSVFileType(p);
        test.ok(htf);

        test.ok(htf.handles("foo.tsv"));

        test.done();
    },

    testCSVFileTypeHandlesTSV: function(test) {
        test.expect(2);

        var htf = new CSVFileType(p);
        test.ok(htf);

        test.ok(htf.handles("foo.TSV"));

        test.done();
    },

    testCSVFileTypeHandlesFalseClose: function(test) {
        test.expect(2);

        var htf = new CSVFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("foo.lcsv"));

        test.done();
    },

    testCSVFileTypeHandlesTrueWithDir: function(test) {
        test.expect(2);

        var htf = new CSVFileType(p);
        test.ok(htf);

        test.ok(htf.handles("a/b/c/foo.csv"));

        test.done();
    },

    testCSVFileTypeHandlesAlreadyLocalizedGB: function(test) {
        test.expect(2);

        var htf = new CSVFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("en-GB/a/b/c/foo.csv"));

        test.done();
    },

    testCSVFileTypeHandlesAlreadyLocalizedCN: function(test) {
        test.expect(2);

        var htf = new CSVFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("zh-Hans-CN/a/b/c/foo.csv"));

        test.done();
    },

    testCSVFileTypeHandlesAlreadyLocalizedWithFlavor: function(test) {
        test.expect(2);

        var htf = new CSVFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("en-ZA-ASDF/a/b/c/foo.csv"));

        test.done();
    },

    testCSVFileTypeHandleszhHKAlreadyLocalizedWithFlavor: function(test) {
        test.expect(2);

        var htf = new CSVFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("zh-Hant-HK-ASDF/a/b/c/foo.csv"));

        test.done();
    },

    testCSVFileTypeHandlesSourceDirIsNotLocalized: function(test) {
        test.expect(2);

        var htf = new CSVFileType(p);
        test.ok(htf);

        test.ok(htf.handles("en-US/a/b/c/foo.csv"));

        test.done();
    }
};
