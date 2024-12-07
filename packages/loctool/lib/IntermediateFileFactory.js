/*
 * IntermediateFileFactory.js - represents an intermediate file that is used to
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

var path = require("path");

var POIntermediateFile = require("./POIntermediateFile.js");
var XliffIntermediateFile = require("./XliffIntermediateFile.js");

/**
 * Factory function to create an intermediate file of the requested type from the given path.
 * @static
 * @param {Object} options options for the intermediate file
 * @param {String} options.path the path to the file
 * @param {String} [options.type] the type of the file. This should be either "xliff" or "po".
 * Default is to determine the type from the file extension.
 * @param {String} [options.sourceLocale] the source locale of the file
 * @param {String} [options.targetLocale] the target locale of the file
 * @param {String} [options.project] the project that the file is associated with
 * @param {String} [options.version] the version of the file (for xliff files: "1.2" or "2.0")
 * @param {String} [options.datatype] the datatype of the file
 * @param {boolean} [options.contextInKey] whether the context should be included in the key
 * @param {String} [options.style] style of the file (for xliff files)
 * @returns {IntermediateFile} the intermediate file
 * @throws {Error} if the type is not recognized
 */
var getIntermediateFile = function(options) {
    if (!options) return; // nothing to do
    let type = options.type;
    if (!type && options.path) {
        var ext = path.extname(options.path);
        if (ext === ".xlf" || ext === ".xliff") {
            type = "xliff";
        } else if (ext === ".po" || ext === ".pot") {
            type = "po";
        }
    }
    if (type === "xliff") {
        return new XliffIntermediateFile(options);
    } else if (type === "po") {
        return new POIntermediateFile(options);
    } else {
        throw new Error("Unknown intermediate file type: " + type);
    }
};

module.exports = getIntermediateFile;
