/*
 * IntermediateFile.js - represents an intermediate file that is used to
 * store the results of string extraction for the purpose of translation.
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
var path = require("path");

var IntermediateFile = require("./IntermediateFile.js");
var XliffFactory = require("./XliffFactory.js");
/**
 * @class An intermediate file in xliff format.
 * @inherits IntermediateFile
 * @constructor
 * @param {Object} options options for the intermediate file
 * @param {String} options.path the path to the file
 * @param {String} options.type the type of the file. This should be either "xliff" or "po".
 * @param {String} [options.sourceLocale] the source locale of the file
 * @param {String} [options.targetLocale] the target locale of the file
 * @param {String} [options.project] the project that the file is associated with
 * @param {String} [options.version] the version of the file (for xliff files: "1.2" or "2.0")
 * @param {String} [options.datatype] the datatype of the file
 * @param {String} [options.style] style of the file (for xliff files)
 * @param {boolean} [options.contextInKey] whether the context should be included in the key
 */
var XliffIntermediateFile = function(options) {
    this.path = options.path;
    this.xliff = XliffFactory(options);
};

XliffIntermediateFile.prototype = new IntermediateFile();
XliffIntermediateFile.prototype.constructor = XliffIntermediateFile;
XliffIntermediateFile.prototype.parent = IntermediateFile.prototype;

/**
 * @override
 */
XliffIntermediateFile.prototype.read = function() {
    if (!fs.existsSync(this.path)) {
        throw new Error("File not found: " + this.path);
    }
    var data = fs.readFileSync(this.path, "utf-8");
    this.xliff.deserialize(data);
    return this.xliff.getTranslationSet();
};

/**
 * @override
 */
XliffIntermediateFile.prototype.write = function(set) {
    this.xliff.addSet(set);
    fs.writeFileSync(this.path, this.xliff.serialize(true), "utf-8");
};

module.exports = XliffIntermediateFile;
