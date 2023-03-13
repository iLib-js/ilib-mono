/*
 * SwiftFileType.js - Represents a collection of Swift files
 *
 * Copyright © 2016-2017, 2019, 2023 HealthTap, Inc.
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
var ResBundle = require("ilib/lib/ResBundle.js");

var SwiftFile = require("./SwiftFile.js");

var SwiftFileType = function(project) {
    this.type = "swift";
    this.datatype = "x-swift";

    this.project = project;
    this.API = project.getAPI();

    this.extensions = [ ".swift", ".h" ];

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
    this.logger = this.API.getLogger("loctool.plugin.SwiftFileType");
};

/**
 * Return true if the given path is an objective C file and is handled
 * by the current file type.
 *
 * @param {String} pathName path to the file being questions
 * @returns {boolean} true if the path is an objective C file, or false
 * otherwise
 */
SwiftFileType.prototype.handles = function(pathName) {
    this.logger.debug("SwiftFileType handles " + pathName + "?");
    ret = (pathName.length > 6 && pathName.substring(pathName.length - 6) === ".swift") ||
        (pathName.length > 2 && pathName.substring(pathName.length - 2) === ".h");

    this.logger.debug(ret ? "Yes" : "No");
    return ret;
};

SwiftFileType.prototype.name = function() {
    return "Swift File Type";
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
SwiftFileType.prototype.write = function(translations, locales) {
    // distribute all the resources to their resource files
    // and then let them write themselves out
    var resFileType = this.project.getResourceFileType("swift");
    var res, file,
        resources = this.extracted.getAll(),
        db = this.project.db,
        translationLocales = locales.filter(function(locale) {
            return locale !== this.project.sourceLocale && locale !== this.project.pseudoLocale;
        }.bind(this));

    for (var i = 0; i < resources.length; i++) {
        res = resources[i];

        // for each extracted string, write out the translations of it
        translationLocales.forEach(function(locale) {
            this.logger.trace("Localizing Swift strings to " + locale);

            db.getResourceByHashKey(res.hashKeyForTranslation(locale), function(err, translated) {
                var r = translated; // default to the source language if the translation is not there
                if (!translated || res.dnt) {
                    r = res.clone();
                    r.setTargetLocale(locale);
                    r.setTarget(r.getSource());
                    r.setState("new");

                    this.newres.add(r);

                    this.logger.trace("No translation for " + res.reskey + " to " + locale + ". Adding to new resources file.");
                }
                if (res.reskey != r.reskey) {
                    // if reskeys don't match, we matched on cleaned string.
                    // so we need to overwrite reskey of the translated resource to match
                    r = r.clone();
                    r.reskey = res.reskey;
                }
                file = resFileType.getResourceFile(r);
                file.addResource(r);
                this.logger.trace("Added " + r.hashKey() + " to " + file.pathName);
            }.bind(this));
        }.bind(this));
    }

    resources = this.pseudo.getAll().filter(function(resource) {
        return resources.datatype === this.datatype;
    });

    for (var i = 0; i < resources.length; i++) {
        res = resources[i];
        file = resFileType.getResourceFile(res);
        file.addResource(res);
        this.logger.trace("Added " + res.reskey + " to " + file.pathName);
    }
};

SwiftFileType.prototype.newFile = function(path) {
    return new SwiftFile({
        project: this.project,
        pathName: path,
        type: this
    });
};

SwiftFileType.prototype.getDataType = function() {
    return this.datatype;
};

SwiftFileType.prototype.getResourceTypes = function() {
    return {};
};

/**
 * Return the list of file name extensions that this plugin can
 * process.
 *
 * @returns {Array.<string>} the list of file name extensions
 */
SwiftFileType.prototype.getExtensions = function() {
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
SwiftFileType.prototype.getExtracted = function() {
    return this.extracted;
};

/**
 * Add the contents of the given translation set to the extracted resources
 * for this file type.
 *
 * @param {TranslationSet} set set of resources to add to the current set
 */
SwiftFileType.prototype.addSet = function(set) {
    this.extracted.addSet(set);
};

/**
 * Return the translation set containing all of the new
 * resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * new resources
 */
SwiftFileType.prototype.getNew = function() {
    return this.newres;
};

/**
 * Return the translation set containing all of the pseudo
 * localized resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * pseudo localized resources
 */
SwiftFileType.prototype.getPseudo = function() {
    return this.pseudo;
};

/**
 * Return the list of file name extensions that this plugin can
 * process.
 *
 * @returns {Array.<string>} the list of file name extensions
 */
SwiftFileType.prototype.getExtensions = function() {
    return this.extensions;
};

module.exports = SwiftFileType;
