/*
 * YamlResourceFileType.js - manages a collection of yaml resource files
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
var ResBundle = require("ilib/lib/ResBundle.js");

var YamlResourceFile = require("./YamlResourceFile.js");

/**
 * @class Manage a collection of Android resource files.
 *
 * @param {Project} project that this type is in
 */
var YamlResourceFileType = function(project) {
    this.type = "ruby";
    this.datatype = "x-yaml";

    this.resourceFiles = {};

    this.project = project;
    this.API = project.getAPI();

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
    this.logger = this.API.getLogger("loctool.lib.YamlResourceFileType");
};

/**
 * Return true if this file type handles the type of file in the
 * given path name.
 * @param {String} pathName the path to check
 * @returns true if this file type handles the given path name, and
 * false otherwise
 */
YamlResourceFileType.prototype.handles = function(pathName) {
    this.logger.debug("YamlResourceFileType handles " + pathName + "?");

    var ret = pathName.length > 4 && pathName.substring(pathName.length - 4) === ".yml";

    if (ret) {
        if (this.project.isResourcePath("yml", pathName)) {
            var base = path.basename(pathName, ".yml");
            var pathLoc = new Locale(base);
            var sourceLoc = new Locale(this.project.sourceLocale);
            ret = (pathLoc.language === sourceLoc.language);
            if (ret && pathLoc.script) {
                ret = (pathLoc.script === sourceLoc.script);
            }
            if (ret && pathLoc.region) {
                ret = (pathLoc.region === sourceLoc.region);
            }
        } else {
            ret = false;
        }
    }

    this.logger.debug(ret ? "Yes" : "No");
    return ret;
};

/**
 * @private
 */
YamlResourceFileType.prototype.checkAllPluralCases = function (sourceRes, res, locale) {
    var fullyTranslated = true;
    if (res.resType === "plural") {
        // check each element of the hash to see if it is translated
        var items = sourceRes.getSourcePlurals();
        var newItems = {};

        var translatedItems = res.getTargetPlurals();
        for (var p in items) {
            var item = items[p];
            if (!translatedItems[p]) {
                // translatedItems[p] = item; // use the English as backup
                fullyTranslated = false;
                newItems[p] = item;
            }
        }

        if (!fullyTranslated) {
            //this.logger.debug("Not fully translated to locale " + locale);
            //this.logger.debug("Missing English plural cases: " + JSON.stringify(newItems));

            //this.logger.debug("Adding source: " + JSON.stringify(newSourceRes));

            var newres = res.clone();
            newres.sourceStrings = newItems;
            newres.targetStrings = newItems;
            newres.setTargetLocale(locale);
            newres.setState("new");
            this.newres.add(newres);

            //this.logger.debug("Adding target: " + JSON.stringify(newres));
        }
    }

    return fullyTranslated;
}

/**
 * Write out all resources for this file type. For Android resources, each
 * Android resource file is written out by itself. This method will
 * iterate through all of the resource files it knows about and cause them
 * each to write themselves out.
 * @param {TranslationSet} translations the set of translations from the
 * repository
 * @param {Array.<String>} locales the list of locales to localize to
 */
YamlResourceFileType.prototype.write = function(translations, locales) {
    // distribute all the resources to their resource files
    // and then let them write themselves out
    var resFileType = this;
    var res, file,
        resources = this.extracted.getAll(),
        db = this.project.db,
        translationLocales = locales.filter(function(locale) {
            return locale !== this.project.sourceLocale && locale !== this.project.pseudoLocale && !this.project.isSourceLocale(locale);
        }.bind(this));

    for (var i = 0; i < resources.length; i++) {
        res = resources[i];

        // for each extracted string, write out the translations of it
        translationLocales.forEach(function(locale) {
            this.logger.trace("Localizing Yaml strings to " + locale);
            if (!res.dnt) {
                db.getResourceByHashKey(res.hashKeyForTranslation(locale), function(err, translated) {
                    var r = translated; // default to the source language if the translation is not there
                    if (!translated) {
                        r = res.clone();
                        r.setTargetLocale(locale);
                        switch (res.resType) {
                        case "array":
                            r.setTargetArray(r.getSourceArray());
                            break;
                        case "plural":
                            r.setTargetPlurals(r.getSourcePlurals());
                            break;
                        default:
                            r.setTarget(r.getSource());
                        }
                        r.setState("new");

                        this.newres.add(r);

                        this.logger.trace("No translation for " + res.reskey + " to " + locale);
                    } else {
                        this.checkAllPluralCases(res, r, locale);
                        file = resFileType.getResourceFile(locale, res.getFlavor());
                        file.addResource(translated);
                    }
                    this.logger.trace("Added " + r.reskey + " to " + (file ? file.pathName : "an unknown file"));
                }.bind(this));
            } else {
                this.logger.trace("DNT: " + r.reskey + ": " + r.getSource());
            }
        }.bind(this));
    }

    resources = this.pseudo.getAll().filter(function(resource) {
        return resources.datatype === this.datatype;
    });

    for (var i = 0; i < resources.length; i++) {
        res = resources[i];
        if (res.getTargetLocale() !== this.project.sourceLocale && res.getSource() !== res.getTarget()) {
            file = resFileType.getResourceFile(res.getTargetLocale());
            file.addResource(res);
            this.logger.trace("Added " + res.reskey + " to " + file.pathName);
        }
    }

    this.logger.trace("Now writing out the resource files");
    // ... and then let them write themselves out
    for (var hash in this.resourceFiles) {
        var file = this.resourceFiles[hash];
        file.write();
    }
};

YamlResourceFileType.prototype.name = function() {
    return "Yaml Resource File";
};

/**
 * Return a new file of the current file type using the given
 * path name.
 *
 * @param {String} pathName the path of the resource file
 * @return {AndroidResourceFile} a resource file instance for the
 * given path
 */
YamlResourceFileType.prototype.newFile = function(pathName) {
    var file = new YamlResourceFile({
        project: this.project,
        pathName: pathName,
        type: this
    });

    var locale = file.getLocale() || "default";

    this.resourceFiles[locale] = file;
    return file;
};

/**
 * Find or create the resource file object for the given project
 * and locale.
 *
 * @param {String} locale the name of the locale in which the resource
 * file will reside
 * @param {String} flavor the flavor of the resource type
 * @return {YamlResourceFile} the yaml resource file that serves the
 * given project and locale.
 */
YamlResourceFileType.prototype.getResourceFile = function(locale, flavor) {
    var key = (locale || this.project.sourceLocale) + (flavor ? '-' + flavor : '');

    var resfile = this.resourceFiles && this.resourceFiles[key];

    if (!resfile) {
        resfile = this.resourceFiles[key] = new YamlResourceFile({
            project: this.project,
            locale: locale,
            type: this,
            flavor: flavor
        });
    }

    return resfile;
};

/**
 * Ensure that all resources collected so far have a pseudo translation.
 * @param {String} locale the target locale for this pseudo
 * @param {Pseudo} pb the pseudo bundle to use to generate the strings
 */
YamlResourceFileType.prototype.generatePseudo = function(locale, pb) {
    var l = new Locale(locale);
    var resources = this.extracted.getBy({
        sourceLocale: pb.getSourceLocale()
    });
    this.logger.trace("Found " + resources.length + " source resources for " + pb.getSourceLocale());
    var resource;

    resources.forEach(function(resource) {
        this.logger.trace("Generating pseudo for " + resource.getKey());
        var res = resource.generatePseudo(locale, pb);
        if (res && res.getSource() !== res.getTarget()) {
            this.pseudo.add(res);
        }
    }.bind(this));
};

YamlResourceFileType.prototype.getDataType = function() {
    return this.datatype;
};

YamlResourceFileType.prototype.getResourceTypes = function() {
    return {
        "string": "ContextResourceString"
    };
};

/**
 * Return the list of file name extensions that this plugin can
 * process.
 *
 * @returns {Array.<string>} the list of file name extensions
 */
YamlResourceFileType.prototype.getExtensions = function() {
    return this.extensions;
};

/**
 * Return the list of file name extensions that this plugin can
 * process.
 *
 * @returns {Array.<string>} the list of file name extensions
 */
YamlResourceFileType.prototype.getExtensions = function() {
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
YamlResourceFileType.prototype.getExtracted = function() {
    return this.extracted;
};

/**
 * Add the contents of the given translation set to the extracted resources
 * for this file type.
 *
 * @param {TranslationSet} set set of resources to add to the current set
 */
YamlResourceFileType.prototype.addSet = function(set) {
    this.extracted.addSet(set);
};

/**
 * Return the translation set containing all of the new
 * resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * new resources
 */
YamlResourceFileType.prototype.getNew = function() {
    return this.newres;
};

/**
 * Return the translation set containing all of the pseudo
 * localized resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * pseudo localized resources
 */
YamlResourceFileType.prototype.getPseudo = function() {
    return this.pseudo;
};

module.exports = YamlResourceFileType;
