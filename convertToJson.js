/*
 * convertToJson.js - convert an XML file to JSON format
 * for use in writing JSON schemas
 *
 * Copyright © 2021, Box, Inc.
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
var path = require("path");
var ilib = require("ilib");
var xmljs = require("xml-js");

if (process.argv.length < 2) {
    console.log("Usage: convertToJson xml-file-name");
    process.exit(1);
}

var filename = process.argv[2];

// logger.debug("Extracting strings from " + this.pathName);
if (filename) {
    try {
        var data = fs.readFileSync(filename, "utf8");
        if (data) {
            var json = xmljs.xml2js(data, {
                trim: false,
                nativeTypeAttribute: true,
                compact: true
            });

            console.log(JSON.stringify(json, undefined, 4));
        }
    } catch (e) {
        console.log("Could not read file: " + filename);
    }
};

