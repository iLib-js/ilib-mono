/*
 * YamlFileType.js - manages a collection of tap-i18n style yaml files
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

var Locale = require("ilib/lib/Locale.js");
var ResBundle = require("ilib/lib/ResBundle.js");
var mm = require("micromatch");

var YamlFile = require("./YamlFile.js");

/**
 * @class Manage a collection of tap-i18n resource files.
 *
 * @param {Project} project that this type is in
 */
var YamlFileType = function(project) {
    this.type = "tap-i18n";
    this.datatype = "x-yaml";

    this.resourceFiles = {};

    this.project = project;
    this.API = project.getAPI();
    this.logger = this.API.getLogger("loctool.lib.TapI18nYamlFileType");

    this.extensions = [ ".yml", ".yaml" ];

    this.extracted = this.API.newTranslationSet(project.getSourceLocale());
    this.newres = this.API.newTranslationSet(project.getSourceLocale());
    this.pseudo = this.API.newTranslationSet(project.getSourceLocale());

    this.pseudos = {};

    // generate all the pseudo bundles we'll need
    project.settings && project.settings.locales && project.settings.locales.forEach(function(locale) {
        var pseudo = this.API.getPseudoBundle(locale, this, project);
        if (pseudo) {
            this.pseudos[locale] = pseudo;
        }
    }.bind(this));

    // for use with missing strings
    if (!project.settings.nopseudo) {
        this.missingPseudo = this.API.getPseudoBundle(project.pseudoLocale, this, project);
    }
};

/**
 * Default mapping if none was provided in the yaml config.
 *
 * @type Object
 **/
var defaultMappings = {
    "**/*.ya?ml": {
        template: "[dir]/[locale].[extension]"
    }
};

YamlFileType.prototype.getMapping = function (pathName) {
    if (typeof(pathName) === "undefined") {
        return undefined;
    }

    var yamlSettings = this.project.settings.tap;

    var mappings = (yamlSettings && yamlSettings.mappings) ? yamlSettings.mappings : defaultMappings;
    var patterns = Object.keys(mappings);

    var match = patterns.find(function(pattern) {
        return mm.isMatch(pathName, pattern);
    });

    return match && mappings[match];
};

/**
 * Returns default mapping value.
 *
 * @returns {Object}
 */
YamlFileType.prototype.getDefaultMapping = function() {
    return defaultMappings["**/*.ya?ml"];
}

/**
 * Return true if this file type handles the type of file in the
 * given path name.
 * @param {String} pathName the path to check
 * @returns true if this file type handles the given path name, and
 * false otherwise
 */
YamlFileType.prototype.handles = function(pathName) {
    this.logger.debug("YamlFileType handles " + pathName + "?");

    var mapping = this.getMapping(pathName);

    // No matching mapping exist => not localizable.
    if (!mapping) {
        return false;
    }

    // Check if this file is an already localized file.
    var yamlSettings = this.project.settings.tap;
    var mappings = (yamlSettings && yamlSettings.mappings) ? yamlSettings.mappings : defaultMappings;
    var patterns = Object.keys(mappings);

    // Check all mappings and see if filename matches mapping's template.
    for (var i = 0; i < patterns.length; i++) {
        var locale = this.API.utils.getLocaleFromPath(mappings[patterns[i]].template, pathName);

        if (locale && locale !== this.project.sourceLocale) {
            return false;
        }
    }

    return true;
};

/**
 * Write out all resources for this file type. For Android resources, each
 * Android resource file is written out by itself. This method will
 * iterate through all of the resource files it knows about and cause them
 * each to write themselves out.
 */
YamlFileType.prototype.write = function() {
    // yaml files are localized individually, so we don't have to
    // write out the resources
};

YamlFileType.prototype.name = function() {
    return "Tap Yaml File";
};

/**
 * Return a new file of the current file type using the given
 * path name.
 *
 * @param {String} pathName the path of the resource file
 * @return {AndroidResourceFile} a resource file instance for the
 * given path
 */
YamlFileType.prototype.newFile = function(pathName) {
    return new YamlFile({
        project: this.project,
        pathName: pathName,
        type: this
    });
};

YamlFileType.prototype.getDataType = function() {
    return this.datatype;
};

YamlFileType.prototype.getResourceTypes = function() {
    return {};
};

/**
 * Return the list of file name extensions that this plugin can
 * process.
 *
 * @returns {Array.<string>} the list of file name extensions
 */
YamlFileType.prototype.getExtensions = function() {
    return this.extensions;
};

/**
 * Return the translation set containing all of the extracted
 * resources for all instances of this type of file. This includes
 * all new strings and all existing strings. If it was extracted
 * from a source file, it should be returned here.
 *
 * @returns {TranslationSet} the set containing all of the
 * extracted resources
 */
YamlFileType.prototype.getExtracted = function() {
    return this.extracted;
};

/**
 * Add the contents of the given translation set to the extracted resources
 * for this file type.
 *
 * @param {TranslationSet} set set of resources to add to the current set
 */
YamlFileType.prototype.addSet = function(set) {
    this.extracted.addSet(set);
};

/**
 * Return the translation set containing all of the new
 * resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * new resources
 */
YamlFileType.prototype.getNew = function() {
    return this.newres;
};

/**
 * Return the translation set containing all of the pseudo
 * localized resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * pseudo localized resources
 */
YamlFileType.prototype.getPseudo = function() {
    return this.pseudo;
};

/**
 * Return the list of file name extensions that this plugin can
 * process.
 *
 * @returns {Array.<string>} the list of file name extensions
 */
YamlFileType.prototype.getExtensions = function() {
    return this.extensions;
};

module.exports = YamlFileType;
