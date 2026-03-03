/*
 * CSVFileType.js - Represents a collection of CSV files
 *
 * Copyright © 2019-2020, 2023 Box, Inc.
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
var Locale = require("ilib/lib/Locale.js");
var ResBundle = require("ilib/lib/ResBundle.js");
var mm = require("micromatch");

var CSVFile = require("./CSVFile.js");

var CSVFileType = function(project) {
    this.type = "csv";
    this.datatype = "x-csv";
    this.project = project;
    this.API = project.getAPI();

    this.extensions = [ ".csv", ".CSV", ".tsv", ".TSV" ];

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

    this.logger = this.API.getLogger("loctool.lib.CSVFileType");
};

var alreadyLoc = new RegExp(/(^|\/)([a-z][a-z](-[A-Z][a-z][a-z][a-z])?(-[A-Z][A-Z](-[A-Z]+)?)?)\//);

/**
 * Return true if the given path is an CSV template file and is handled
 * by the current file type.
 *
 * @param {String} pathName path to the file being questions
 * @returns {boolean} true if the path is a java file, or false
 * otherwise
 */
CSVFileType.prototype.handles = function(pathName) {
    this.logger.debug("CSVFileType handles " + pathName + "?");
    var extension = path.extname(pathName).toLowerCase();
    var ret = (this.extensions.indexOf(extension) > -1);

    if (ret) {
        var match = alreadyLoc.exec(pathName);
        ret = (match && match.length > 2) ? match[2] === this.project.sourceLocale : true;
    }
    this.logger.debug(ret ? "Yes" : "No");
    return ret;
};

CSVFileType.prototype.name = function() {
    return "CSV File Type";
};

/**
 * Write out the aggregated resources for this file type. In
 * some cases, the string are written out to a common resource
 * file, and in other cases, to a type-specific resource file.
 * In yet other cases, nothing is written out, as the each of
 * the files themselves are localized individually, so there
 * are no aggregated strings.
 */
CSVFileType.prototype.write = function() {
    // templates are localized individually, so we don't have to
    // write out the resources
};

CSVFileType.prototype.newFile = function(path, options) {
    return new CSVFile({
        project: this.project,
        pathName: path,
        type: this,
        targetLocale: options && options.targetLocale
    });
};

CSVFileType.prototype.getDataType = function() {
    return this.datatype;
};

CSVFileType.prototype.getResourceTypes = function() {
    return {};
};

CSVFileType.prototype.getExtensions = function() {
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
CSVFileType.prototype.getExtracted = function() {
    return this.extracted;
};

/**
 * Add the contents of the given translation set to the extracted resources
 * for this file type.
 *
 * @param {TranslationSet} set set of resources to add to the current set
 */
CSVFileType.prototype.addSet = function(set) {
    this.extracted.addSet(set);
};

/**
 * Return the translation set containing all of the new
 * resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * new resources
 */
CSVFileType.prototype.getNew = function() {
    return this.newres;
};

/**
 * Return the translation set containing all of the pseudo
 * localized resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * pseudo localized resources
 */
CSVFileType.prototype.getPseudo = function() {
    return this.pseudo;
};

var defaultMappings = {
    "**/*.csv": {
        method: "copy",
        template: "[dir]/[basename]-[locale].[extension]",
        rowSeparatorRegex: '[\n\r\f]+',
        columnSeparatorChar: ','
    },
    "**/*.tsv": {
        method: "copy",
        template: "[dir]/[basename]-[locale].[extension]",
        rowSeparatorRegex: '[\n\r\f]+',
        columnSeparatorChar: '\t'
    }
};

/**
 * Return the mapping corresponding to this path.
 * @param {String} pathName the path to check
 * @returns {Object} the mapping object corresponding to the
 * path or undefined if none of the mappings match
 */
CSVFileType.prototype.getMapping = function(pathName) {
    if (typeof(pathName) === "undefined") {
        return undefined;
    }
    var csvSettings = this.project.settings.csv;
    var mappings = (csvSettings && csvSettings.mappings) ? csvSettings.mappings : defaultMappings;
    var patterns = Object.keys(mappings);
    var normalized = pathName.toLowerCase();

    var match = patterns.find(function(pattern) {
        return mm.isMatch(pathName, pattern) || mm.isMatch(normalized, pattern);
    });

    return match && mappings[match];
}

module.exports = CSVFileType;
