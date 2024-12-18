/*
 * POIntermediateFile.js - represents an intermediate file in PO file format
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
var PO = require("ilib-po");
var POFile = PO.POFile;

var TranslationSet = require("./TranslationSet.js");
var convert = require("./convertResources.js");
var IntermediateFile = require("./IntermediateFile.js");

var convertResourceToLoctool = convert.convertResourceToLoctool;
var convertResourceToCommon = convert.convertResourceToCommon;

/**
 * @class POIntermediateFile
 * @inherits IntermediateFile
 * @constructor
 * @param {Object} options options controlling the constructor, most of
 * of which are passed to the PO library
 * @param {String} options.path path to the file
 * @param {String} options.project name of the project that these strings belong to
 * @param {String} options.version
 * @param {String} options.sourceLocale locale of the source strings
 * @param {String} [options.targetLocale] locale of the target strings (if any)
 * @param {boolean} [options.contextInKey] whether not the context of the string
 * should be included in the key
 * @param {String} [options.datatype] type of the data where these strings came from
 */
var POIntermediateFile = function(options) {
    this.path = options.path;
    this.po = new POFile({
        sourceLocale: options.sourceLocale,
        targetLocale: options.targetLocale,
        projectName: options.project,
        datatype: options.datatype,
        contextInKey: options.contextInKey,
        pathName: options.path
    });
};

POIntermediateFile.prototype = new IntermediateFile();
POIntermediateFile.prototype.constructor = POIntermediateFile;
POIntermediateFile.prototype.parent = IntermediateFile.prototype;

/**
 * @override
 */
POIntermediateFile.prototype.read = function() {
    if (!fs.existsSync(this.path)) {
        throw new Error("File not found: " + this.path);
    }
    var data = fs.readFileSync(this.path, "utf-8");
    var resources = this.po.parse(data);
    var set = new TranslationSet();
    if (resources && resources.size() > 0) {
        set.addAll(resources.getAll().map(convertResourceToLoctool));
    }
    return set;
};

/**
 * @override
 */
POIntermediateFile.prototype.write = function(set) {
    var newSet = new TranslationSet();
    newSet.addAll(set.getAll().map(convertResourceToCommon));
    var data = this.po.generate(newSet);
    fs.writeFileSync(this.path, data, "utf-8");
};

module.exports = POIntermediateFile;
