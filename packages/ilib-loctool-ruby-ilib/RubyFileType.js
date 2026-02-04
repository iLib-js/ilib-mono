/*
 * RubyFileType.js - Represents a collection of Ruby files
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
var ResBundle = require("ilib/lib/ResBundle.js");

var RubyFile = require("./RubyFile.js");

var RubyFileType = function(project) {
    this.type = "ruby";
    this.datatype = "ruby";

    this.project = project;
    this.API = project.getAPI();

    this.extensions = [ ".rb", ".rabl", ".haml" ];

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
    this.logger = this.API.getLogger("loctool.plugin.RubyFileType");
};

var alreadyLoc = new RegExp(/\.([a-z][a-z](-[A-Z][a-z][a-z][a-z])?(-[A-Z][A-Z](-[A-Z]+)?)?)\.html\.haml$/);

/**
 * Return true if the given path is a Ruby file and is handled
 * by the current file type.
 *
 * @param {String} pathName path to the file being questions
 * @returns {boolean} true if the path is a Ruby file, or false
 * otherwise
 */
RubyFileType.prototype.handles = function(pathName) {
    this.logger.debug("RubyFileType handles " + pathName + "?");
    var ret = pathName.length > 10 && pathName.substring(pathName.length - 10) === ".html.haml";
    if (ret) {
        var match = alreadyLoc.exec(pathName);
        ret = (match && match.length) ? match[1] === this.project.sourceLocale : true;
    }

    ret = ret || (pathName.length > 3 && pathName.substring(pathName.length - 3) === ".rb");
    ret = ret || (pathName.length > 5 && pathName.substring(pathName.length - 5) === ".rabl");

    this.logger.debug(ret ? "Yes" : "No");
    return ret;
};

RubyFileType.prototype.name = function() {
    return "Ruby File Type";
};

RubyFileType.prototype.checkAllPluralCases = function(extracted, translated) {
    var fullyTranslated = true;
    if (extracted.resType === "plural") {
        // check each element of the hash to see if it is translated
        var items = extracted.getSourcePlurals();
        var translatedItems = translated.getTargetPlurals();
        var newItems = {};

        if (!items.one || !items.other) {
            this.logger.warn('Source code is missing the "one" or the "other" case in Rb.p:');
            this.logger.warn('path: ' + extracted.pathName);
            this.logger.warn('strings: ' + JSON.stringify(items));
        }

        for (var p in items) {
            var item = items[p];
            if (!translatedItems[p]) {
                // translatedItems[p] = item; // use the English as backup
                fullyTranslated = false;
                newItems[p] = item;
            }
        }

        if (!fullyTranslated) {
            this.logger.trace("Not fully translated to locale " + translated.getTargetLocale());
            this.logger.trace("Missing English plural cases: " + JSON.stringify(newItems));

            var newres = translated.clone();
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
RubyFileType.prototype.write = function(translations, locales) {
    // distribute all the resources to their resource files
    // and then let them write themselves out
    var resFileType = this.project.getResourceFileType(this.type);
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
            this.logger.trace("Localizing Ruby strings to " + locale);

            if (!res.dnt) {
                db.getResourceByHashKey(res.hashKeyForTranslation(locale), function(err, translated) {
                    var r = translated; // default to the source language if the translation is not there
                    if (!translated) {
                        // see if a haml string has the translation because haml strings sometimes become
                        // wrapped with Rb.t
                        r = res.clone();
                        r.setTargetLocale(locale);
                        r.datatype = this.datatype;
                        this.logger.trace("ruby hash key is " + r.hashKeyForTranslation(locale));
                        db.getResourceByHashKey(r.hashKeyForTranslation(locale), function(err, translated) {
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
                                this.checkAllPluralCases(res, translated);
                                file = resFileType.getResourceFile({ locale: locale, flavor: res.getFlavor() });
                                file.addResource(translated);
                                this.logger.trace("Added " + r.reskey + " to " + file.pathName);
                            }
                        }.bind(this));
                    } else {
                        this.checkAllPluralCases(res, translated);
                        file = resFileType.getResourceFile({ locale: locale, flavor: res.getFlavor() });
                        file.addResource(translated);
                        this.logger.trace("Added " + r.reskey + " to " + file.pathName);
                    }
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
        file = resFileType.getResourceFile({ locale: res.getTargetLocale(), flavor: res.getFlavor() });
        file.addResource(res);
        this.logger.trace("Added " + res.reskey + " to " + file.pathName);
    }
};

RubyFileType.prototype.newFile = function(path) {
    return new RubyFile({
        project: this.project,
        pathName: path,
        type: this,
        sourceLocale: this.project.sourceLocale
    });
};

RubyFileType.prototype.getDataType = function() {
    return this.datatype;
};

RubyFileType.prototype.getResourceTypes = function() {
    return {};
};

/**
 * Return the list of file name extensions that this plugin can
 * process.
 *
 * @returns {Array.<string>} the list of file name extensions
 */
RubyFileType.prototype.getExtensions = function() {
    return this.extensions;
};

/**
 * Return the list of file name extensions that this plugin can
 * process.
 *
 * @returns {Array.<string>} the list of file name extensions
 */
RubyFileType.prototype.getExtensions = function() {
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
RubyFileType.prototype.getExtracted = function() {
    return this.extracted;
};

/**
 * Add the contents of the given translation set to the extracted resources
 * for this file type.
 *
 * @param {TranslationSet} set set of resources to add to the current set
 */
RubyFileType.prototype.addSet = function(set) {
    this.extracted.addSet(set);
};

/**
 * Return the translation set containing all of the new
 * resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * new resources
 */
RubyFileType.prototype.getNew = function() {
    return this.newres;
};

/**
 * Return the translation set containing all of the pseudo
 * localized resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * pseudo localized resources
 */
RubyFileType.prototype.getPseudo = function() {
    return this.pseudo;
};

module.exports = RubyFileType;
