/*
 * CSVFileType.test.js - test the CSV file type handler object.
 *
 * Copyright © 2019, 2023 Box, Inc.
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
describe("csvfiletype", function() {
    test("CSVFileTypeConstructor", function() {
        expect.assertions(1);
        var htf = new CSVFileType(p);
        expect(htf).toBeTruthy();
    });
    test("CSVFileTypeHandlesCSV", function() {
        expect.assertions(2);
        var htf = new CSVFileType(p);
        expect(htf).toBeTruthy();
        expect(htf.handles("foo.csv")).toBeTruthy();
    });
    test("CSVFileTypeHandlesCSV", function() {
        expect.assertions(2);
        var htf = new CSVFileType(p);
        expect(htf).toBeTruthy();
        expect(htf.handles("foo.CSV")).toBeTruthy();
    });
    test("CSVFileTypeHandlestsv", function() {
        expect.assertions(2);
        var htf = new CSVFileType(p);
        expect(htf).toBeTruthy();
        expect(htf.handles("foo.tsv")).toBeTruthy();
    });
    test("CSVFileTypeHandlesTSV", function() {
        expect.assertions(2);
        var htf = new CSVFileType(p);
        expect(htf).toBeTruthy();
        expect(htf.handles("foo.TSV")).toBeTruthy();
    });
    test("CSVFileTypeHandlesFalseClose", function() {
        expect.assertions(2);
        var htf = new CSVFileType(p);
        expect(htf).toBeTruthy();
        expect(!htf.handles("foo.lcsv")).toBeTruthy();
    });
    test("CSVFileTypeHandlesTrueWithDir", function() {
        expect.assertions(2);
        var htf = new CSVFileType(p);
        expect(htf).toBeTruthy();
        expect(htf.handles("a/b/c/foo.csv")).toBeTruthy();
    });
    test("CSVFileTypeHandlesAlreadyLocalizedGB", function() {
        expect.assertions(2);
        var htf = new CSVFileType(p);
        expect(htf).toBeTruthy();
        expect(!htf.handles("en-GB/a/b/c/foo.csv")).toBeTruthy();
    });
    test("CSVFileTypeHandlesAlreadyLocalizedCN", function() {
        expect.assertions(2);
        var htf = new CSVFileType(p);
        expect(htf).toBeTruthy();
        expect(!htf.handles("zh-Hans-CN/a/b/c/foo.csv")).toBeTruthy();
    });
    test("CSVFileTypeHandlesAlreadyLocalizedWithFlavor", function() {
        expect.assertions(2);
        var htf = new CSVFileType(p);
        expect(htf).toBeTruthy();
        expect(!htf.handles("en-ZA-ASDF/a/b/c/foo.csv")).toBeTruthy();
    });
    test("CSVFileTypeHandleszhHKAlreadyLocalizedWithFlavor", function() {
        expect.assertions(2);
        var htf = new CSVFileType(p);
        expect(htf).toBeTruthy();
        expect(!htf.handles("zh-Hant-HK-ASDF/a/b/c/foo.csv")).toBeTruthy();
    });
    test("CSVFileTypeHandlesSourceDirIsNotLocalized", function() {
        expect.assertions(2);
        var htf = new CSVFileType(p);
        expect(htf).toBeTruthy();
        expect(htf.handles("en-US/a/b/c/foo.csv")).toBeTruthy();
    });
});
