/*
 * MetaXmlFileType.js - Represents a collection of java files
 *
 * Copyright © 2020, Box, Inc.
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
    this.type = "java";
    this.datatype = "java";

    this.project = project;
    this.API = this.project.getAPI();

    this.extensions = [ ".xml" ];

    this.extracted = this.API.newTranslationSet(this.project.getSourceLocale());
    this.newres = this.API.newTranslationSet(this.project.getSourceLocale());
    this.pseudo = this.API.newTranslationSet(this.project.getSourceLocale());
};

var filenameRE = new RegExp(/([\w\.]+)\.(\w+)-meta.xml$/);

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
    var ret = filenameRE.test(pathName);
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
    // distribute all the resources to their resource files
    // and then let them write themselves out
    var resFileType = this.project.getResourceFileType();
    var res, file,
        resources = this.extracted.getAll(),
        db = this.project.db,
        translationLocales = locales.filter(function(locale) {
            return locale !== this.project.sourceLocale && locale !== this.project.pseudoLocale;
        }.bind(this));

    for (var i = 0; i < resources.length; i++) {
        res = resources[i];
        // have to store the base English string or else there will be nothing to override in the translations
        file = resFileType.getResourceFile(res.context, res.getSourceLocale(), res.resType + "s", res.pathName);
        file.addResource(res);

        // for each extracted string, write out the translations of it
        translationLocales.forEach(function(locale) {
            logger.trace("Localizing MetaXml strings to " + locale);

            db.getResourceByHashKey(res.hashKeyForTranslation(locale), function(err, translated) {
                var r = translated;
                if (res.dnt) {
                    logger.trace("Resource " + res.reskey + " is set to 'do not translate'");
                } else if (!r || this.API.utils.cleanString(res.getSource()) !== this.API.utils.cleanString(r.getSource())) {
                    if (r) {
                        logger.trace("extracted   source: " + this.API.utils.cleanString(res.getSource()));
                        logger.trace("translation source: " + this.API.utils.cleanString(r.getSource()));
                    }
                    var note = r && 'The source string has changed. Please update the translation to match if necessary. Previous source: "' + r.getSource() + '"';
                    var newres = res.clone();
                    newres.setTargetLocale(locale);
                    newres.setTarget((r && r.getTarget()) || res.getSource());
                    newres.setState("new");
                    newres.setComment(note);

                    this.newres.add(newres);

                    // skip because the fallbacks will go to the English resources anyways
                    logger.trace("No translation for " + res.reskey + " to " + locale);
                } else if (r.getTarget() !== res.getSource()) {
                    file = resFileType.getResourceFile(r.context, locale, r.resType + "s", r.pathName);
                    file.addResource(r);
                    logger.trace("Added " + r.reskey + " to " + file.pathName);
                }
            }.bind(this));
        }.bind(this));
    }

    resources = this.pseudo.getAll().filter(function(resource) {
        return resource.datatype === this.datatype;
    }.bind(this));

    for (var i = 0; i < resources.length; i++) {
        res = resources[i];
        // only need to add the resource if it is different from the source text
        if (res.getSource() !== res.getTarget()) {
            file = resFileType.getResourceFile(res.context, res.getTargetLocale(), res.resType + "s", res.pathName);
            file.addResource(res);
            logger.trace("Added " + res.reskey + " to " + file.pathName);
        }
    }
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

    var root = path.dirname(pathName).split(/\//g);
    var filename = path.basename(pathName);
    var subpath = "";

    var parts = root;
    for (var i = 0; i < parts.length; i++) {
        if (parts[i] === "objects") {
            root = parts.slice(0, i);
            subpath = parts.slice(i+1);
        }
    }

    var target = root.concat(["objectTranslations"]);
    var match = filenameRE.exec(filename);
    if (subpath && subpath.length) {
        target.push(subpath[0] + "-" + spec);
        if (match) {
            filename = match[1] + '.' + match[2] + "Translation-meta.xml";
        }
    } else {
        if (match) {
            filename = match[1] + "-" + spec + '.' + match[2] + "Translation-meta.xml";
        }
    }

    target.push(filename);

    return target.join("/");
};

module.exports = MetaXmlFileType;
