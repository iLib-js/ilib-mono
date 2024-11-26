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
var PO = require("ilib-po");
var POFile = PO.POFile;
var TranslationSet = require("./TranslationSet.js");

var Xliff = require("./Xliff.js");
var convert = require("./convertResources.js");

/**
 * @interface Represents an intermediate file that is used to store the results of string extraction for the purpose of translation.
 *
 * @param {Object} options options for the intermediate file
 * @abstract
 */
var IntermediateFile = function(options) {};

IntermediateFile.prototype = {
    /**
     * Read the given intermediate file and return the resources that it contains.
     * @abstract
     * @returns {TranslationSet} a set containing the resources in the file
     * @throws {Error} if the file cannot be read
     */
    read: function() {},

    /**
     * Encode the given resources into the type of intermediate
     * file and write it out.
     *
     * @abstract
     * @param {TranslationSet} set the set of resources to write
     * @throws {Error} if the file cannot be written
     */
    write: function(set) {}
};

var XliffIntermediateFile = function(options) {
    this.path = options.path;
    this.xliff = new Xliff({
        sourceLocale: options.sourceLocale,
        targetLocale: options.targetLocale,
        project: options.project,
        version: options.version,
        style: options.style,
        allowDups: options.allowDups,
        datatype: options.datatype,
        contextInKey: options.contextInKey
    });
};

XliffIntermediateFile.prototype = new IntermediateFile();
XliffIntermediateFile.prototype.constructor = XliffIntermediateFile;
XliffIntermediateFile.prototype.parent = IntermediateFile.prototype;

XliffIntermediateFile.prototype.read = function() {
    if (!fs.existsSync(this.path)) {
        throw new Error("File not found: " + this.path);
    }
    var data = fs.readFileSync(this.path, "utf-8");
    this.xliff.deserialize(data);
    return this.xliff.getTranslationSet();
};

XliffIntermediateFile.prototype.write = function(set) {
    this.xliff.addSet(set);
    fs.writeFileSync(this.path, this.xliff.serialize(true), "utf-8");
};

var POIntermediateFile = function(options) {
    this.path = options.path;
    this.po = new POFile({
        sourceLocale: options.sourceLocale,
        targetLocale: options.targetLocale,
        project: options.project,
        version: options.version,
        style: options.style,
        allowDups: options.allowDups,
        datatype: options.datatype,
        contextInKey: options.contextInKey,
        pathName: options.path
    });
};

POIntermediateFile.prototype = new IntermediateFile();
POIntermediateFile.prototype.constructor = POIntermediateFile;
POIntermediateFile.prototype.parent = IntermediateFile.prototype;

POIntermediateFile.prototype.read = function() {
    if (!fs.existsSync(this.path)) {
        throw new Error("File not found: " + this.path);
    }
    var data = fs.readFileSync(this.path, "utf-8");
    var resources = this.po.parse(data);
    var set = new TranslationSet();
    if (resources && resources.length) {
        var converted = resources.map(function(resource) {
            return convert.convertResourceToLoctool(resource);
        });
        set.addAll(converted);
    }
    return set;
};

POIntermediateFile.prototype.write = function(set) {
    var resources = set.getAll();
    var common = resources.map(function(resource) {
        return convert.convertResourceToCommon(resource);
    });
    var newSet = new TranslationSet();
    newSet.addAll(common);
    var data = this.po.generate(newSet);
    fs.writeFileSync(this.path, data, "utf-8");
};

/**
 * Factory function to create an intermediate file of the requested type from the given path.
 * @static
 * @param {Object} options options for the intermediate file
 * @param {String} options.path the path to the file
 * @param {String} options.type the type of the file. This should be either "xliff" or "po".
 * @param {String} [options.sourceLocale] the source locale of the file
 * @param {String} [options.targetLocale] the target locale of the file
 * @param {String} [options.project] the project that the file is associated with
 * @param {String} [options.version] the version of the file
 * @param {String} [options.style] the style of the file (Valid parameters depend on the type of the file)
 * @param {boolean} [options.allowDups] whether to allow duplicate resources in the file
 * @param {String} [options.datatype] the datatype of the file
 * @param {boolean} [options.contextInKey] whether the context should be included in the key
 * @returns {IntermediateFile} the intermediate file
 * @throws {Error} if the type is not recognized
 */
var getIntermediateFile = function(options) {
    if (!options) return; // nothing to do
    if (options.type === "xliff") {
        return new XliffIntermediateFile(options);
    } else if (options.type === "po") {
        return new POIntermediateFile(options);
    } else {
        throw new Error("Unknown intermediate file type: " + options.type);
    }
};

module.exports = {
    IntermediateFile: IntermediateFile,
    getIntermediateFile: getIntermediateFile
};
