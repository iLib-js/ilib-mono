/*
 * PHPResourceFileType.js - manages a collection of PHP resource files
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

var mm = require("micromatch");
var Locale = require("ilib-locale");

var PHPResourceFile = require("./PHPResourceFile.js");

var defaultTemplate = "resource-files/Translation[locale].php";

/**
 * @class Manage a collection of Android resource files.
 *
 * @constructor
 * @param {Project} project that this type is in
 */
var PHPResourceFileType = function(project) {
    this.type = "PHP";

    this.project = project;
    this.resourceFiles = {};
    this.API = project.getAPI();

    this.extensions = [ ".php" ];

    this.logger = this.API.getLogger("loctool.plugin.PHPResourceFileType");

    this.extracted = this.API.newTranslationSet(project.getSourceLocale());
    this.newres = this.API.newTranslationSet(project.getSourceLocale());
    this.pseudo = this.API.newTranslationSet(project.getSourceLocale());
};

/*
PHPResourceFileType.prototype = new FileType();
PHPResourceFileType.prototype.parent = FileType;
PHPResourceFileType.prototype.constructor = PHPResourceFileType;
*/

/**
 * Return true if this file type handles the type of file in the
 * given path name.
 * @param {String} pathName the path to check
 * @returns true if this file type handles the given path name, and
 * false otherwise
 */
PHPResourceFileType.prototype.handles = function(pathName) {
    // php resource files are only generated. Existing ones are never read in.
    this.logger.debug("PHPResourceFileType handles " + pathName + "?");

    this.logger.debug("No");
    return false;
};

/**
 * Return the location on disk where the resource file for the given
 * locale should be written.
 *
 * @param {String} locale the locale spec for the target locale
 * @returns {String} the localized path name
 */
PHPResourceFileType.prototype.getLocalizedPath = function(locale) {
    var template = (this.project.settings &&
        this.project.settings.php &&
        this.project.settings.php.template) || defaultTemplate;
    var l = new Locale(this.project.getOutputLocale(locale));

    return path.normalize(path.join(this.project.root, this.API.utils.formatPath(template, {
        locale: l
    })));
};

/**
 * Write out all resources for this file type. For PHP resources, each
 * resource file is written out by itself. This method will
 * iterate through all of the resource files it knows about and cause them
 * each to write out.
 */
PHPResourceFileType.prototype.write = function() {
    this.logger.trace("Now writing out " + Object.keys(this.resourceFiles).length + " resource files");
    for (var hash in this.resourceFiles) {
        var file = this.resourceFiles[hash];
        file.write();
    }
};

PHPResourceFileType.prototype.name = function() {
    return "PHP Resource File";
};

/**
 * Return a new file of the current file type using the given
 * path name.
 *
 * @param {String} pathName the path of the resource file
 * @return {PHPResourceFile} a resource file instance for the
 * given path
 */
PHPResourceFileType.prototype.newFile = function(pathName, options) {
    if (this.resourceFiles[options.locale]) {
        return this.resourceFiles[options.locale];
    }

    var file = new PHPResourceFile({
        project: this.project,
        pathName: pathName,
        type: this,
        locale: options.locale
    });

    var locale = file.getLocale() || this.project.sourceLocale;

    this.resourceFiles[locale] = file;
    return file;
};

/**
 * Find or create the resource file object for the given locale.
 *
 * @param {String} locale the name of the locale in which the resource
 * file will reside
 * @param {String} pathName the optional path to the resource file if the
 * caller has already calculated what it should be
 * @return {PHPResourceFile} the PHP resource file that serves the
 * given locale.
 */
PHPResourceFileType.prototype.getResourceFile = function(locale, pathName) {
    var loc = locale || this.project.sourceLocale;
    var key = [loc, pathName].join("_");

    var resfile = this.resourceFiles && this.resourceFiles[key];

    if (!resfile) {
        resfile = this.resourceFiles[key] = new PHPResourceFile({
            project: this.project,
            locale: loc,
            pathName: pathName,
            type: this
        });

        this.logger.trace("Defining new resource file");
    }

    return resfile;
};

/**
 * Return all resource files known to this file type instance.
 *
 * @returns {Array.<PHPResourceFile>} an array of resource files
 * known to this file type instance
 */
PHPResourceFileType.prototype.getAll = function() {
    return this.resourceFiles;
};

/**
 * Ensure that all resources collected so far have a pseudo translation.
 */
PHPResourceFileType.prototype.generatePseudo = function(locale, pb) {
    var resources = this.extracted.getBy({
        sourceLocale: pb.getSourceLocale()
    });
    this.logger.trace("Found " + resources.length + " source resources for " + pb.getSourceLocale());
    var resource;

    resources.forEach(function(resource) {
        if (resource && resource.getKey() !== "app_id" && resource.getKey() !== "live_sdk_client_id") {
            this.logger.trace("Generating pseudo for " + resource.getKey());
            var res = resource.generatePseudo(locale, pb);
            if (res && res.getSource() !== res.getTarget()) {
                this.pseudo.add(res);
            }
        }
    }.bind(this));
};

PHPResourceFileType.prototype.getDataType = function() {
    return this.datatype;
};

PHPResourceFileType.prototype.getResourceTypes = function() {
    return {};
};

/**
 * Return the list of file name extensions that this plugin can
 * process.
 *
 * @returns {Array.<string>} the list of file name extensions
 */
PHPResourceFileType.prototype.getExtensions = function() {
    return this.extensions;
};

/**
 * Return the name of the node module that implements the resource file type, or
 * the path to a PHP file that implements the resource filetype.
 * @returns {Function|undefined} node module name or path, or undefined if this file type does not
 * need resource files
 */
PHPResourceFileType.prototype.getResourceFileType = function() {};

/**
 * Return the translation set containing all of the extracted
 * resources for all instances of this type of file. This includes
 * all new strings and all existing strings. If it was extracted
 * from a source file, it should be returned here.
 *
 * @returns {TranslationSet} the set containing all of the
 * extracted resources
 */
PHPResourceFileType.prototype.getExtracted = function() {
    return this.extracted;
};

/**
 * Add the contents of the given translation set to the extracted resources
 * for this file type.
 *
 * @param {TranslationSet} set set of resources to add to the current set
 */
PHPResourceFileType.prototype.addSet = function(set) {
    this.extracted.addSet(set);
};

/**
 * Return the translation set containing all of the new
 * resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * new resources
 */
PHPResourceFileType.prototype.getNew = function() {
    return this.newres;
};

/**
 * Return the translation set containing all of the pseudo
 * localized resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * pseudo localized resources
 */
PHPResourceFileType.prototype.getPseudo = function() {
    return this.pseudo;
};

module.exports = PHPResourceFileType;
