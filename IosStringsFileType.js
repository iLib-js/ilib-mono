/*
 * IosStringsFileType.js - manages a collection of iOS strings resource files
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
var path = require("path");
var ilib = require("ilib");
var Locale = require("ilib/lib/Locale.js");

var IosStringsFile = require("./IosStringsFile.js");

/**
 * @class Manage a collection of iOS strings resource files.
 *
 * @param {Project} project that this type is in
 */
var IosStringsFileType = function(project) {
    this.type = "xib";
    this.datatype = "x-xib";

    this.resourceFiles = {};

    this.project = project;
    this.API = project.getAPI();
    this.logger = this.API.getLogger("loctool.plugin.IosStringsFileType");

    this.extensions = [ ".strings" ];

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
 * Return true if this file type handles the type of file in the
 * given path name.
 * @param {String} pathName the path to check
 * @returns true if this file type handles the given path name, and
 * false otherwise
 */
IosStringsFileType.prototype.handles = function(pathName) {
    this.logger.debug("IosStringsFileType handles " + pathName + "?");

    var ret = true;
    var parent = path.dirname(pathName);
    var dir = path.normalize(path.dirname(parent));

    if (parent && parent.substring(parent.length - 6) === ".lproj") {
        var resdir = path.normalize((this.project.options.resourceDirs && this.project.options.resourceDirs["objc"]) || ".");
        ret = path.basename(parent) !== "Base.lproj" && path.basename(pathName) !== "Localizable.strings";
    }

    this.logger.trace("dir being tested is is " + dir);

    // this.logger.trace("resdir: " + resdir + " dir: " + dir);
    var ret = ret && (pathName.length > 8) && (pathName.substring(pathName.length - 8) === ".strings");

    if (ret) {
        var base = path.basename(parent, ".lproj");
        // this.logger.trace("testing " + dir);
        ret = (base === "." || base === "en-US") && base !== "Base";
    }

    this.logger.debug(ret ? "Yes" : "No");
    return ret;
};

/**
 * Write out all resources for this file type. For iOS resources, each
 * resource file is written out by itself. This method will
 * iterate through all of the resource files it knows about and cause them
 * each to write themselves out.
 * @param {TranslationSet} translations the set of translations from the
 * repository
 * @param {Array.<String>} locales the list of locales to localize to
 */
IosStringsFileType.prototype.write = function(translations, locales) {
    // distribute all the new resources to their resource files ...
    this.logger.trace("distributing all new resources to their resource files");
    var res, file,
        resources = this.extracted.getAll(),
        db = this.project.db,
        translationLocales = locales.filter(function(locale) {
            return locale !== this.project.sourceLocale && locale !== this.project.pseudoLocale;
        }.bind(this));

    this.logger.trace("There are " + resources.length + " resources to add.");

    for (var i = 0; i < resources.length; i++) {
        res = resources[i];

        // for each extracted string, write out the translations of it
        translationLocales.forEach(function(locale) {
            this.logger.trace("Adding translations for " + res.reskey + " to locale " + locale);

            db.getResourceByHashKey(res.hashKeyForTranslation(locale), function(err, translated) {
                var r = translated; // default to the source language if the translation is not there
                if (!translated || res.dnt) {
                    r = res.clone();
                    r.setTargetLocale(locale);
                    r.setTarget(res.getSource());
                    r.setState("new");

                    this.newres.add(r);

                    this.logger.trace("No translation for " + res.reskey + " to " + locale + ". Adding to new resources file.");
                }

                file = this.getResourceFile(r);
                file.addResource(r);
                this.logger.trace("Added " + r.reskey + " to " + file.pathName);
            }.bind(this));
        }.bind(this));
    }

    resources = this.pseudo.getAll().filter(function(resource) {
        return resource.datatype === this.datatype;
    }.bind(this));

    for (var i = 0; i < resources.length; i++) {
        res = resources[i];
        file = this.getResourceFile(res);
        file.addResource(res);
        this.logger.trace("Added " + res.reskey + " to " + file.pathName);
    }

    this.logger.trace("Now writing out the resource files");
    // ... and then let them write themselves out
    for (var hash in this.resourceFiles) {
        file = this.resourceFiles[hash];
        file.write();
    }
};

IosStringsFileType.prototype.name = function() {
    return "iOS Strings Resource File";
};

/**
 * Return a new file of the current file type using the given
 * path name.
 *
 * @param {String} pathName the path of the resource file
 * @return {IosStringsFile} a resource file instance for the
 * given path
 */
IosStringsFileType.prototype.newFile = function(pathName) {
    var file = new IosStringsFile({
        project: this.project,
        pathName: pathName,
        type: this
    });

    this.resourceFiles[pathName] = file;
    return file;
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
IosStringsFileType.prototype.getResourceFilePath = function(locale, pathName, type, flavor) {
    var l = new Locale(locale || this.project.sourceLocale);
    var localeDir, dir, newPath;

    var localeMapping = {
        "en-GB": "en-001.lproj",
        "es-ES": "es-ES.lproj",
        "ps-DO": "ps.lproj",
        "zh-Hans-CN": "zh-Hans.lproj",
        "zh-Hant-HK": "zh-Hant.lproj",
        "zh-Hant-TW": "zh-Hant-TW.lproj"
    };

    localeDir = localeMapping[locale] || (l.language === "en" ? l.getSpec() : l.language) + ".lproj";
    this.logger.trace("Getting resource file path for locale " + locale + ": " + localeDir);

    if (type === "x-xib" && !flavor) {
        // strings from xib files go into the xib's localized strings file instead of the main project strings file
        var base = path.basename(pathName, ".xib");

        // this is the parent dir
        var parent = path.dirname(path.dirname(pathName));
        newPath = path.join(parent, localeDir, base + ".strings");
    } else {
        var filename = (flavor || "Localizable") + ".strings";
        dir = this.project.getResourceDirs("objc")[0] || ".";
        newPath = path.join(dir, localeDir, filename);
    }
    return newPath;
};

/**
 * Find or create the resource file object for the given project, context,
 * and locale.
 *
 * @param {Resource} res resource to find the resource file for
 * @return {IosStringsFile} the Android resource file that serves the
 * given project, context, and locale.
 */
IosStringsFileType.prototype.getResourceFile = function(res) {
    var locale = res.getTargetLocale() || res.getSourceLocale(),
        pathName = res.getPath(),
        type = res.getDataType(),
        flavor = res.getFlavor && res.getFlavor();
    var newPath = this.getResourceFilePath(locale, pathName, type, flavor);

    this.logger.trace("getResourceFile converted path " + pathName + " for locale " + locale + " to path " + newPath);

    var resfile = this.resourceFiles && this.resourceFiles[newPath];

    if (!resfile) {
        resfile = this.resourceFiles[newPath] = new IosStringsFile({
            project: this.project,
            locale: locale || this.project.sourceLocale,
            pathName: newPath,
            type: this
        });

        this.logger.trace("Defining new resource file");
    } else {
        this.logger.trace("Returning existing resource file");
    }

    return resfile;
};

/**
 * Return all resource files known to this file type instance.
 *
 * @returns {Array.<IosStringsFile>} an array of resource files
 * known to this file type instance
 */
IosStringsFileType.prototype.getAll = function() {
    return this.resourceFiles;
};

/**
 * Clear the cache of resource files so that new ones can be created.
 */
IosStringsFileType.prototype.clear = function() {
    this.resourceFiles = {};
};

IosStringsFileType.prototype.getDataType = function() {
    return this.datatype;
};

IosStringsFileType.prototype.getResourceTypes = function() {
    return {
        "string": "IosLayoutResourceString"
    };
};

/**
 * Return the list of file name extensions that this plugin can
 * process.
 *
 * @returns {Array.<string>} the list of file name extensions
 */
IosStringsFileType.prototype.getExtensions = function() {
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
IosStringsFileType.prototype.getExtracted = function() {
    return this.extracted;
};

/**
 * Add the contents of the given translation set to the extracted resources
 * for this file type.
 *
 * @param {TranslationSet} set set of resources to add to the current set
 */
IosStringsFileType.prototype.addSet = function(set) {
    this.extracted.addSet(set);
};

/**
 * Return the translation set containing all of the new
 * resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * new resources
 */
IosStringsFileType.prototype.getNew = function() {
    return this.newres;
};

/**
 * Return the translation set containing all of the pseudo
 * localized resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * pseudo localized resources
 */
IosStringsFileType.prototype.getPseudo = function() {
    return this.pseudo;
};

/**
 * Return the list of file name extensions that this plugin can
 * process.
 *
 * @returns {Array.<string>} the list of file name extensions
 */
IosStringsFileType.prototype.getExtensions = function() {
    return this.extensions;
};

module.exports = IosStringsFileType;
