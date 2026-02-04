/*
 * AndroidResourceFileType.js - manages a collection of android resource files
 *
 * Copyright © 2020-2021, 2023 JEDLSoft
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

var path = require("path");
var Locale = require("ilib/lib/Locale.js");

var AndroidResourceFile = require("./AndroidResourceFile.js");

/**
 * @class Manage a collection of Android resource files.
 *
 * @param {Project} project that this type is in
 */
var AndroidResourceFileType = function(project) {
    this.type = "java";
    this.datatype = "x-android-resource";

    this.resourceFiles = {};
    this.inputFiles = {};
    this.extensions = [ ".xml" ];

    this.project = project;
    this.API = project.getAPI();

    this.extracted = this.API.newTranslationSet(project.getSourceLocale());
    this.newres = this.API.newTranslationSet(project.getSourceLocale());
    this.pseudo = this.API.newTranslationSet(project.getSourceLocale());

    this.logger = this.API.getLogger("loctool.lib.AndroidResourceFileType");
};

var extensionRE = new RegExp(/\.xml$/);
var dirRE = new RegExp("^value");
var lang = new RegExp("[a-z][a-z]");
var reg = new RegExp("r[A-Z][A-Z]");
var fullLocale = /-b\+[a-z][a-z]\+[A-Z][a-z][a-z][a-z]\+[A-Z][A-Z]/;

/**
 * Return true if this file type handles the type of file in the
 * given path name.
 * @param {String} pathName the path to check
 * @returns true if this file type handles the given path name, and
 * false otherwise
 */
AndroidResourceFileType.prototype.handles = function(pathName) {
    this.logger.debug("AndroidResourceFileType handles " + pathName + "?");

    if (!extensionRE.test(pathName)) {
        this.logger.debug("No");
        return false;
    }

    var pathElements = pathName.split('/');
    if (pathElements.length < 3 || pathElements[pathElements.length-3] !== "res") {
        this.logger.debug("No");
        return false;
    }

    var dir = pathElements[pathElements.length-2];

    if (!dirRE.test(dir)) {
        this.logger.debug("No");
        return false;
    }

    if (fullLocale.test(dir)) {
        this.logger.debug("No");
        return false;
    }

    var parts = dir.split("-");

    for (var i = parts.length-1; i > 0; i--) {
        if (reg.test(parts[i]) && this.API.utils.iso3166[parts[i]]) {
            // already localized dir
            this.logger.debug("No");
            return false;
        }

        if (lang.test(parts[i]) && this.API.utils.iso639[parts[i]]) {
            // already localized dir
            this.logger.debug("No");
            return false;
        }
    }

    this.logger.debug("Yes");
    return true;
};

/**
 * Write out all resources for this file type. For Android resources, each
 * Android resource file is written out by itself. This method will
 * iterate through all of the resource files it knows about and cause them
 * each to write themselves out.
 * @param {TranslationSet} translations the set of translations from the
 * repository
 * @param {Array.<String>} locales the list of locales to localize to
 */
AndroidResourceFileType.prototype.write = function(translations, locales) {
    // distribute all the new resources to their resource files ...
    this.logger.trace("distributing all new resources to their resource files");
    var res, file,
        resources = this.extracted.getAll(),
        db = this.project.db,
        translationLocales = locales.filter(function(locale) {
            return locale !== this.project.sourceLocale && locale !== this.project.pseudoLocale && !this.API.isPseudoLocale(locale);
        }.bind(this));

    this.logger.trace("There are " + resources.length + " resources to add.");

    for (var i = 0; i < resources.length; i++) {
        res = resources[i];

        // for each extracted string, write out the translations of it
        translationLocales.forEach(function(locale) {
            this.logger.trace("Localizing Java strings to " + locale);

            db.getResourceByHashKey(res.hashKeyForTranslation(locale), function(err, translated) {
                var r = translated; // default to the source language if the translation is not there
                if (res.dnt) {
                    this.logger.trace("Resource " + res.reskey + " is set to 'do not translate'");
                } else if (!translated) {
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

                    this.logger.trace("No translation for " + res.reskey + " to " + locale + ". Leaving blank.");
                } else {
                    var fullyTranslated = true;
                    var anyTranslated = false;

                    if (r.resType === "array") {
                        // check each element of the array to see if it is translated
                        var items = res.getSourceArray();
                        var newItems = [];

                        var translatedItems = r.getTargetArray();
                        for (var i = 0; i < items.length; i++) {
                            if (!translatedItems[i]) {
                                translatedItems[i] = items[i]; // use the English as backup
                                fullyTranslated = false;
                                newItems.push(items[i]);
                            } else {
                                newItems.push(null); // already translated
                                anyTranslated = true;
                            }
                        }
                        if (!fullyTranslated) {
                            var newres = r.clone();
                            newres.setSourceArray(newItems);
                            newres.setTargetLocale(locale);
                            newres.setTargetArray(newItems);
                            newres.setState("new");

                            this.newres.add(newres);
                        }
                    } else if (r.resType === "plural") {
                        // check each element of the hash to see if it is translated
                        var items = res.getSourcePlurals();
                        var newItems = {};

                        var translatedItems = r.getTargetPlurals();
                        for (var p in items) {
                            var item = items[p];
                            if (!translatedItems[p]) {
                                translatedItems[p] = item; // use the English as backup
                                fullyTranslated = false;
                                newItems[p] = item;
                            } else {
                                anyTranslated = true;
                            }
                        }
                        if (!fullyTranslated) {
                            var newres = r.clone();
                            newres.setSourcePlurals(newItems);
                            newres.setTargetLocale(locale);
                            newres.setTargetPlurals(newItems);
                            newres.setState("new");

                            this.newres.add(newres);
                        }
                    } else {
                        // string
                        if (this.API.utils.cleanString(res.getSource()) !== this.API.utils.cleanString(r.getSource())) {
                            this.logger.trace("extracted   source: " + this.API.utils.cleanString(res.getSource()));
                            this.logger.trace("translation source: " + this.API.utils.cleanString(r.getSource()));
                            var newres = res.clone();
                            newres.setTargetLocale(locale);
                            newres.setTarget(r.getTarget());
                            newres.setState("new");
                            newres.setComment('The source string has changed. Please update the translation to match if necessary. Previous source: "' + r.getSource() + '"');
                            this.newres.add(newres);
                            anyTranslated = false;
                        } else {
                            anyTranslated = (res.getSource() !== r.getTarget());
                        }
                    }

                    // only write out this resource if any part of it is translated. If none of it is
                    // translated, just skip it and Android will default back to the base English
                    // strings instead.
                    if (anyTranslated) {
                        file = this.getResourceFile({ context: r.context, locale: locale, type: r.resType + "s", pathName: r.pathName });
                        file.addResource(r);
                        this.logger.trace("Added " + r.getKey() + " to " + file.pathName);
                    }
                }
            }.bind(this));
        }.bind(this));
    }

    resources = this.pseudo.getAll().filter(function(resource) {
        return resource.datatype === this.datatype;
    }.bind(this));

    for (var i = 0; i < resources.length; i++) {
        res = resources[i];
        file = this.getResourceFile({ context: res.context, locale: res.getTargetLocale(), type: res.resType + "s", pathName: res.pathName });
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

AndroidResourceFileType.prototype.name = function() {
    return "Android Resource File";
};

function makeHashKey(context, locale, type, flavor) {
    return [(context || "default"), (locale || "default"), type, flavor].join("_");
}

/**
 * Return a new file of the current file type using the given
 * path name.
 *
 * @param {String} pathName the path of the resource file
 * @return {AndroidResourceFile} a resource file instance for the
 * given path
 */
AndroidResourceFileType.prototype.newFile = function(pathName) {
    var file = new AndroidResourceFile({
        project: this.project,
        pathName: pathName,
        type: this
    });

    this.inputFiles[pathName] = file;

    return file;
};

/**
 * Find or create the resource file object for the given project, context,
 * locale, and flavor. If the original file that this resource came from
 * exists within a flavor, then the resource file for this resource should
 * also be in that same flavor. If the original file is not within a
 * flavor, this resource should go into the main resources.
 *
 * @param {Object} [options] options identifying the resource file; either options.locale or options.resource is required
 * @param {string} [options.context] optional context (e.g. for Android qualified resources)
 * @param {string} [options.locale] locale of the resource file; required if options.resource is not provided
 * @param {string} [options.type] resource type (e.g. "strings", "arrays", "plurals")
 * @param {string} [options.pathName] path to the original file that this resource came from (for flavor lookup)
 * @param {Resource} [options.resource] when provided, context/locale/type/pathName can be derived from the resource; required if options.locale is not provided
 * @return {AndroidResourceFile} the Android resource file that serves the
 * given project, context, and locale.
 */
AndroidResourceFileType.prototype.getResourceFile = function(options) {
    var opts = options || {};
    var context = opts.context !== undefined ? opts.context : (opts.resource && opts.resource.context);
    var locale = opts.locale || (opts.resource && opts.resource.getTargetLocale && opts.resource.getTargetLocale());
    var type = opts.type || (opts.resource && opts.resource.resType && opts.resource.resType + "s");
    var original = opts.pathName || (opts.resource && opts.resource.pathName);
    // first find the flavor
    var flavor = (this.project.flavors && this.project.flavors.getFlavorForPath(original));
    var key = makeHashKey(context, locale, type, flavor);

    var resfile = this.resourceFiles && this.resourceFiles[key];

    if (!resfile) {
        var pathName, settings, defaultLocales;

        settings = (this.project &&
            this.project.settings &&
            this.project.settings &&
            this.project.settings.AndroidResourceFile) || {};

        defaultLocales = settings.defaultLocales;

        var valueDir = "values";

        if (locale !== this.project.sourceLocale) {
            var l = new Locale(locale);
            valueDir += "-" + l.getLanguage();

            // If we have a version of Spanish, for example es-ES, that is not
            // the default, then the language dir should contain the region. That is, "values-es" is the default "es-US", and
            // "values-es-rES" is the non-default version of Spanish, so it needs its region.
            if (locale === this.project.pseudoLocale || (defaultLocales && defaultLocales[l.getLanguage()] && locale !== defaultLocales[l.getLanguage()])) {
                valueDir += "-r" + l.getRegion();
            }
        }

        if (context) {
            valueDir += "-" + context;
        }

        var resdir = (flavor && flavor !== "main" && this.project.flavors) ? this.project.flavors.getResourceDirs(flavor)[0] : this.project.getResourceDirs("java")[0];
        pathName = path.join(resdir, valueDir, type + ".xml");

        if (this.inputFiles[pathName]) {
            // if the resource file already exists as an input file, don't overwrite it. Just
            // write a new file beside it instead.
            pathName = path.join(resdir, valueDir, type + "-auto.xml");
        }

        resfile = this.resourceFiles[key] = new AndroidResourceFile({
            project: this.project,
            context: context,
            locale: locale || this.project.sourceLocale,
            type: type,
            pathName: pathName
        });

        this.logger.trace("Defining new resource file");
    }

    return resfile;
};

/**
 * Return all resource files known to this file type instance.
 *
 * @returns {Array.<AndroidResourceFile>} an array of resource files
 * known to this file type instance
 */
AndroidResourceFileType.prototype.getAll = function() {
    return this.resourceFiles;
};

/**
 * Ensure that all resources collected so far have a pseudo translation.
 */
AndroidResourceFileType.prototype.generatePseudo = function(locale, pb) {
    var resources = this.extracted.getBy({
        sourceLocale: pb.getSourceLocale()
    });
    this.logger.trace("Found " + resources.length + " source resources for " + pb.getSourceLocale());
    var resource;

    resources.forEach(function(resource) {
        if (resource && resource.getKey() !== "app_id" && resource.getKey() !== "live_sdk_client_id") {
            this.logger.trace("Generating pseudo for " + resource.getKey());
            var pseudoized = resource.generatePseudo(locale, pb);
            if (pseudoized) {
                if ((resource.resType === 'string' && resource.getSource() !== pseudoized.getTarget()) ||
                    (resource.resType === 'array' && resource.getSourceArray() !== pseudoized.getTargetArray()) ||
                    (resource.resType === 'plural' && resource.getSourcePlurals() !== pseudoized.getTargetPlurals())){
                    this.pseudo.add(pseudoized);
                }
            } else {
                this.logger.trace("No pseudo match for " + resource.getKey());
            }
        }
    }.bind(this));
    return this.pseudo;
};

AndroidResourceFileType.prototype.getDataType = function() {
    return this.datatype;
};

AndroidResourceFileType.prototype.getResourceTypes = function() {
    return {
        "string": "ContextResourceString"
    };
};

AndroidResourceFileType.prototype.getExtensions = function() {
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
AndroidResourceFileType.prototype.getExtracted = function() {
    return this.extracted;
};

/**
 * Add the contents of the given translation set to the extracted resources
 * for this file type.
 *
 * @param {TranslationSet} set set of resources to add to the current set
 */
AndroidResourceFileType.prototype.addSet = function(set) {
    this.extracted.addSet(set);
};

/**
 * Return the translation set containing all of the new
 * resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * new resources
 */
AndroidResourceFileType.prototype.getNew = function() {
    return this.newres;
};

/**
 * Return the translation set containing all of the pseudo
 * localized resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * pseudo localized resources
 */
AndroidResourceFileType.prototype.getPseudo = function() {
    return this.pseudo;
};

/**
 * Return the name of the node module that implements the resource file type, or
 * the path to a javascript file that implements the resource filetype.
 * @returns {Function|undefined} node module name or path, or undefined if this file type does not
 * need resource files
 */
AndroidResourceFileType.prototype.getResourceFileType = function() {};


module.exports = AndroidResourceFileType;
