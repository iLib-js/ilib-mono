/*
 * JsonResourceFileType.js - manages a collection of JSON resource files for testing
 *
 * Copyright © 2024, Box, Inc.
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
var JsonResourceFile = require("./JsonResourceFile.js");

/**
 * @class Manage a collection of JSON resource files for testing.
 * This plugin writes JSON files with a configurable header and footer,
 * used to test the resourceFileTypes delegation feature.
 *
 * @param {Project} project that this type is in
 * @param {API} API the loctool API object
 */
var JsonResourceFileType = function(project, API) {
    this.type = "json";
    this.datatype = "json";

    this.project = project;
    this.API = API || project.getAPI();
    this.logger = this.API.getLogger("loctool.plugin.JsonResourceFileType");

    this.resourceFiles = {};
    this.extensions = [".json"];

    // Get header/footer from project settings
    var jsonSettings = this.project.settings && this.project.settings["json-resource"];
    this.header = (jsonSettings && jsonSettings.header) || "// AUTO-GENERATED FILE - DO NOT EDIT\n";
    this.footer = (jsonSettings && jsonSettings.footer) || "\n// END OF FILE\n";
};

/**
 * Return true if this file type handles the type of file in the
 * given path name.
 * @param {String} pathName the path to check
 * @returns true if this file type handles the given path name, and
 * false otherwise
 */
JsonResourceFileType.prototype.handles = function(pathName) {
    // Resource files are only generated, never read
    this.logger.debug("JsonResourceFileType handles " + pathName + "? No");
    return false;
};

/**
 * Write out all resources for this file type.
 */
JsonResourceFileType.prototype.write = function() {
    this.logger.trace("Now writing out " + Object.keys(this.resourceFiles).length + " json resource files");
    for (var hash in this.resourceFiles) {
        var file = this.resourceFiles[hash];
        file.write();
    }
};

JsonResourceFileType.prototype.name = function() {
    return "JSON Resource File";
};

/**
 * Return a new file of the current file type using the given
 * path name.
 *
 * @param {String} pathName the path of the resource file
 * @return {JsonResourceFile} a resource file instance for the given path
 */
JsonResourceFileType.prototype.newFile = function(pathName, options) {
    return new JsonResourceFile({
        project: this.project,
        pathName: pathName,
        type: this,
        locale: options && options.locale,
        API: this.API,
        header: this.header,
        footer: this.footer
    });
};

/**
 * Find or create the resource file object for the given locale and path.
 *
 * @param {String} locale the name of the locale in which the resource file will reside
 * @param {String} pathName the path to the resource file
 * @return {JsonResourceFile} the resource file that serves the given locale
 */
JsonResourceFileType.prototype.getResourceFile = function(locale, pathName) {
    var key = (locale || this.project.sourceLocale) + "-" + (pathName || "default");

    var resfile = this.resourceFiles && this.resourceFiles[key];

    if (!resfile) {
        resfile = this.resourceFiles[key] = new JsonResourceFile({
            project: this.project,
            pathName: pathName,
            type: this,
            locale: locale || this.project.sourceLocale,
            API: this.API,
            header: this.header,
            footer: this.footer
        });

        this.logger.trace("Defining new json resource file for " + key);
    }

    return resfile;
};

/**
 * Return all resource files known to this file type instance.
 *
 * @returns {Object} an object mapping keys to resource files
 */
JsonResourceFileType.prototype.getAll = function() {
    return this.resourceFiles;
};

JsonResourceFileType.prototype.getDataType = function() {
    return this.datatype;
};

JsonResourceFileType.prototype.getResourceTypes = function() {
    return {};
};

/**
 * Return the list of file name extensions that this plugin can process.
 *
 * @returns {Array.<string>} the list of file name extensions
 */
JsonResourceFileType.prototype.getExtensions = function() {
    return this.extensions;
};

/**
 * Return the translation set containing all of the extracted
 * resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the extracted resources
 */
JsonResourceFileType.prototype.getExtracted = function() {
    return this.API.newTranslationSet(this.project.getSourceLocale());
};

/**
 * Add the contents of the given translation set to the extracted resources
 * for this file type.
 *
 * @param {TranslationSet} set set of resources to add to the current set
 */
JsonResourceFileType.prototype.addSet = function(set) {};

/**
 * Return the translation set containing all of the new
 * resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the new resources
 */
JsonResourceFileType.prototype.getNew = function() {
    return this.API.newTranslationSet(this.project.getSourceLocale());
};

/**
 * Return the translation set containing all of the pseudo
 * localized resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the pseudo localized resources
 */
JsonResourceFileType.prototype.getPseudo = function() {
    return this.API.newTranslationSet(this.project.getSourceLocale());
};

module.exports = JsonResourceFileType;

