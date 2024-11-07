/*
 * MarkdownFileType.js - Represents a collection of Markdown files
 *
 * Copyright © 2019, Box, Inc.
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
var log4js = require("log4js");

var MarkdownFile = require("./MarkdownFile.js");

var logger = log4js.getLogger("loctool.lib.MarkdownFileType");

var MarkdownFileType = function(project) {
    this.type = "md";
    this.datatype = "markdown";
    this.project = project;
    this.API = project.getAPI();

    this.extensions = [ ".md", ".markdown", ".mdown", ".mkd", ".rst", ".rmd" ];

    this.extracted = this.API.newTranslationSet(project.getSourceLocale());
    this.newres = this.API.newTranslationSet(project.getSourceLocale());
    this.pseudo = this.API.newTranslationSet(project.getSourceLocale());

    this.pseudos = {};

    // generate all the pseudo bundles we'll need
    project.locales && project.locales.forEach(function(locale) {
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

var alreadyLoc = new RegExp(/(^|\/)(([a-z][a-z])(-[A-Z][a-z][a-z][a-z])?(-([A-Z][A-Z])(-[A-Z]+)?)?)\//);

/**
 * Return true if the given path is an Markdown template file and is handled
 * by the current file type.
 *
 * @param {String} pathName path to the file being questions
 * @returns {boolean} true if the path is a java file, or false
 * otherwise
 */
MarkdownFileType.prototype.handles = function(pathName) {
    logger.debug("MarkdownFileType handles " + pathName + "?");
    var extension = path.extname(pathName).toLowerCase();
    var ret = (this.extensions.indexOf(extension) > -1);

    if (ret) {
        var match = alreadyLoc.exec(pathName);
        if (match && match.length > 2) {
            if (this.API.utils.iso639[match[3]]) {
                if (match.length < 6 || !match[6] || !this.API.utils.iso3166[match[6]]) {
                    return true;
                }
                return match[2] === this.project.sourceLocale;
            } else {
                return true;
            }
        }
    }
    logger.debug(ret ? "Yes" : "No");
    return ret;
};

MarkdownFileType.prototype.name = function() {
    return "Markdown File Type";
};

/**
 * Write out the aggregated resources for this file type. In
 * some cases, the string are written out to a common resource
 * file, and in other cases, to a type-specific resource file.
 * In yet other cases, nothing is written out, as the each of
 * the files themselves are localized individually, so there
 * are no aggregated strings.
 */
MarkdownFileType.prototype.write = function() {
    // templates are localized individually, so we don't have to
    // write out the resources
};

MarkdownFileType.prototype.newFile = function(path) {
    return new MarkdownFile({
        project: this.project,
        pathName: path,
        type: this
    });
};

MarkdownFileType.prototype.getDataType = function() {
    return this.datatype;
};

MarkdownFileType.prototype.getResourceTypes = function() {
    return {};
};

MarkdownFileType.prototype.getExtensions = function() {
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
MarkdownFileType.prototype.getExtracted = function() {
    return this.extracted;
};

/**
 * Add the contents of the given translation set to the extracted resources
 * for this file type.
 *
 * @param {TranslationSet} set set of resources to add to the current set
 */
MarkdownFileType.prototype.addSet = function(set) {
    this.extracted.addSet(set);
};

/**
 * Return the translation set containing all of the new
 * resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * new resources
 */
MarkdownFileType.prototype.getNew = function() {
    return this.newres;
};

/**
 * Return the translation set containing all of the pseudo
 * localized resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * pseudo localized resources
 */
MarkdownFileType.prototype.getPseudo = function() {
    return this.pseudo;
};

module.exports = MarkdownFileType;
