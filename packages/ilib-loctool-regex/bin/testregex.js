#!/usr/bin/env node
/*
 * testregex.js - utility command to test your regex project against
 * real files
 *
 * Copyright © 2024 Box, Inc.
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

var fs = require("fs");

var ProjectFactory = require("loctool/lib/ProjectFactory.js");
var RegexFileType = require("../RegexFileType.js");

if (process.argv.length < 4) {
    console.log("Usage: testregex path-to-project-dir file1 [file2 ...]");
    console.log("Test the regular expressions in the given ilib-loctool-regex project against the given files.");

    process.exit(1);
}

var projectDir = process.argv[2];
var files = process.argv.slice(3);

var project = ProjectFactory(projectDir, {
    sourceLocale: "en-US"
});

var rft = new RegexFileType(project);

function stringifyRegexResult(result) {
    if (!result) return;
    var str = "[\n";
    for (var i = 0; i < result.length; i++) {
        var stringified = JSON.stringify(result[i]).replace(/[\[\]]/g, "");
        stringified = stringified.length > 80 ? stringified.substring(0, 79) + '…"' : stringified;
        var matchString = result[i] ? stringified : "undefined"
        str += '  "' + i + '": ' + matchString + ",\n";
    }
    str += '  "groups": ';
    var groups = {};
    Object.keys(result.groups).forEach(function(key) {
        if (key.match(/^\d/)) {
            return;
        }
        groups[key] = result.groups[key];
    })
    str += JSON.stringify(groups, undefined, 2).split(/\n/g).join("\n  ") + ",\n";
    str += '  "index": ' + result.index + ",\n";
    str += '  "length": ' + result.length + "\n";
    str += "]";
    if (!groups.source) {
        str += ",\nWarning: no source group found in the match! Cannot create a Resource from this match.";
    }
    return str;
}

files.forEach(function(file) {
    try {
        var data = fs.readFileSync(file, "utf-8");
        var regexFile = rft.newFile(file, {});
        console.log("File: " + file);
        console.log('Matched mapping: "' + rft.getMappingName(file) + '"');
        regexFile.parse(data, function(info) {
            console.log("Trying regular expression: /" + info.expression.expression + "/" + info.expression.flags);
            console.log("  Result:\n" + stringifyRegexResult(info.result));
        });
        console.log("\n");
    } catch (e) {
        console.log("Error reading file " + file + ": " + e);
    }
});

console.log("Done.");
