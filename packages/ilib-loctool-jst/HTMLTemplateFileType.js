/*
 * HTMLTemplateFileType.js - Represents a collection of java files
 *
 * Copyright © 2019, 2023 Box, Inc.
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
var ilib = require("ilib");
var Locale = require("ilib/lib/Locale.js");

var HTMLTemplateFile = require("./HTMLTemplateFile.js");

var HTMLTemplateFileType = function(project) {
    this.type = "html";
    this.datatype = "html";

    this.project = project;
    this.API = project.getAPI();

    this.extensions = [ ".html", ".htm" ];

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
    this.logger = this.API.getLogger("loctool.plugin.HTMLTemplateFileType");
};

var alreadyLoc = new RegExp(/\.([a-z][a-z](-[A-Z][a-z][a-z][a-z])?(-[A-Z][A-Z](-[A-Z]+)?)?)\.tmpl\.html$/);

/**
 * Return true if the given path is an HTML template file and is handled
 * by the current file type.
 *
 * @param {String} pathName path to the file being questions
 * @returns {boolean} true if the path is a java file, or false
 * otherwise
 */
HTMLTemplateFileType.prototype.handles = function(pathName) {
    this.logger.debug("HTMLTemplateFileType handles " + pathName + "?");
    var ret = (pathName.length > 10) && (pathName.substring(pathName.length - 10) === ".tmpl.html");
    if (ret) {
        var match = alreadyLoc.exec(pathName);
        ret = (match && match.length) ? match[1] === this.project.sourceLocale : true;
    }
    this.logger.debug(ret ? "Yes" : "No");
    return ret;
};

HTMLTemplateFileType.prototype.name = function() {
    return "HTML Template File Type";
};

/**
 * Write out the aggregated resources for this file type. In
 * some cases, the string are written out to a common resource
 * file, and in other cases, to a type-specific resource file.
 * In yet other cases, nothing is written out, as the each of
 * the files themselves are localized individually, so there
 * are no aggregated strings.
 */
HTMLTemplateFileType.prototype.write = function() {
    // templates are localized individually, so we don't have to
    // write out the resources
};

HTMLTemplateFileType.prototype.newFile = function(path) {
    return new HTMLTemplateFile({
        project: this.project,
        pathName: path,
        type: this
    });
};

HTMLTemplateFileType.prototype.getDataType = function() {
    return this.datatype;
};

HTMLTemplateFileType.prototype.getResourceTypes = function() {
    return {};
};

/**
 * Return the list of file name extensions that this plugin can
 * process.
 *
 * @returns {Array.<string>} the list of file name extensions
 */
HTMLTemplateFileType.prototype.getExtensions = function() {
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
HTMLTemplateFileType.prototype.getExtracted = function() {
    return this.extracted;
};

/**
 * Add the contents of the given translation set to the extracted resources
 * for this file type.
 *
 * @param {TranslationSet} set set of resources to add to the current set
 */
HTMLTemplateFileType.prototype.addSet = function(set) {
    this.extracted.addSet(set);
};

/**
 * Return the translation set containing all of the new
 * resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * new resources
 */
HTMLTemplateFileType.prototype.getNew = function() {
    return this.newres;
};

/**
 * Return the translation set containing all of the pseudo
 * localized resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * pseudo localized resources
 */
HTMLTemplateFileType.prototype.getPseudo = function() {
    return this.pseudo;
};

module.exports = HTMLTemplateFileType;
