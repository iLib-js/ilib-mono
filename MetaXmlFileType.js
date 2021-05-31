/*
 * MetaXmlFileType.js - Represents a collection of java files
 *
 * Copyright © 2021, Box, Inc.
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

var MetaXmlFile = require("./MetaXmlFile.js");
var sfLocales = require("./sflocales.json");

var logger = log4js.getLogger("loctool.lib.MetaXmlFileType");

var MetaXmlFileType = function(project) {
    this.type = "metaxml";
    this.datatype = "metaxml";

    this.project = project;
    this.API = this.project.getAPI();

    this.extensions = [ ".xml" ];

    this.extracted = this.API.newTranslationSet(this.project.getSourceLocale());
    this.newres = this.API.newTranslationSet(this.project.getSourceLocale());
    this.pseudo = this.API.newTranslationSet(this.project.getSourceLocale());

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
 * Return true if the given path is a java file and is handled
 * by the current file type.
 *
 * @param {String} pathName path to the file being questions
 * @returns {boolean} true if the path is a java file, or false
 * otherwise
 */
MetaXmlFileType.prototype.handles = function(pathName) {
    logger.debug("MetaXmlFileType handles " + pathName + "?");
    if (!pathName || !pathName.length) {
        logger.debug("No");
        return false;
    }

    // check the path too
    var ret = true;
    var filename = path.basename(pathName);
    if (filename !== "en_US.translation-meta.xml") {
        ret = false;
    } else {
        var parts = path.dirname(pathName).split(/\//g);
        if (parts[parts.length-1] !== "translations") {
            ret = false;
        }
    }
    logger.debug(ret ? "Yes" : "No");
    return ret;
};

MetaXmlFileType.prototype.name = function() {
    return "MetaXml File Type";
};

/**
 * Write out the aggregated resources for this file type. In
 * some cases, the string are written out to a common resource
 * file, and in other cases, to a type-specific resource file.
 * In yet other cases, nothing is written out, as the each of
 * the files themselves are localized individually, so there
 * are no aggregated strings.
 * @param {TranslationSet} translations the set of translations from the
 * repository
 * @param {Array.<String>} locales the list of locales to localize to
 */
MetaXmlFileType.prototype.write = function(translations, locales) {
    // metaxml files are localized individually, so we don't have to
    // write out the resources
};

MetaXmlFileType.prototype.newFile = function(path) {
    return new MetaXmlFile({
        project: this.project,
        pathName: path,
        type: this
    });
};

MetaXmlFileType.prototype.getDataType = function() {
    return this.datatype;
};

MetaXmlFileType.prototype.getResourceTypes = function() {
    return {
        "string": "ContextResourceString"
    };
};

MetaXmlFileType.prototype.getExtensions = function() {
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
MetaXmlFileType.prototype.getExtracted = function() {
    return this.extracted;
};

/**
 * Add the contents of the given translation set to the extracted resources
 * for this file type.
 *
 * @param {TranslationSet} set set of resources to add to the current set
 */
MetaXmlFileType.prototype.addSet = function(set) {
    this.extracted.addSet(set);
};

/**
 * Return the translation set containing all of the new
 * resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * new resources
 */
MetaXmlFileType.prototype.getNew = function() {
    return this.newres;
};

/**
 * Return the translation set containing all of the pseudo
 * localized resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * pseudo localized resources
 */
MetaXmlFileType.prototype.getPseudo = function() {
    return this.pseudo;
};

/**
 * Find the path for the resource file for the given project, context,
 * and locale.
 *
 * @param {String} locale the name of the locale in which the resource
 * file will reside
 * @param {String} pathName path name of the resource being added.
 * @param {String} type one of "objc" or "xib" strings from each source
 * file type go into different types of resource files
 * @param {String|undefined} flavor the name of the flavor if any
 * @return {String} the ios strings resource file path that serves the
 * given project, context, and locale.
 */
MetaXmlFileType.prototype.getResourceFilePath = function(locale, pathName) {
    var spec = locale || this.project.sourceLocale;
    if (sfLocales[spec]) {
        spec = sfLocales[spec];
    }
    spec = spec.replace(/-/g, "_");

    var filename = path.basename(pathName);
    var dirname = path.dirname(pathName);

    return path.join(dirname, spec + ".translation-meta.xml");
};

module.exports = MetaXmlFileType;
