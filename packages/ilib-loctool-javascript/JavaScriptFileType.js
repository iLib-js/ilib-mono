/*
 * JavaScriptFileType.js - Represents a collection of javasript files
 *
 * Copyright © 2019, 2022 JEDLSoft
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
var Locale = require("ilib/lib/Locale.js");
var ResBundle = require("ilib/lib/ResBundle.js");
var mm = require("micromatch");

var JavaScriptFile = require("./JavaScriptFile.js");
var JavaScriptResourceFileType = require("ilib-loctool-javascript-resource");

var JavaScriptFileType = function(project) {
    this.type = "javascript";
    this.datatype = "javascript";

    this.project = project;
    this.API = project.getAPI();

    this.logger = this.API.getLogger("loctool.plugin.JavaScriptFileType");
    this.extensions = [ ".js", ".jsx", ".haml", ".html" ];

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

var defaultMappings = {
    "**/*.js": {
        template: "resources/[localeDir]/strings.json"
    },
    "**/*.html.haml": {
        template: "resources/[localeDir]/strings.json"
    },
    "**/*.tmpl.html": {
        template: "resources/[localeDir]/strings.json"
    }
};

/**
 * Return the mapping corresponding to this path.
 * @param {String} pathName the path to check
 * @returns {Object} the mapping object corresponding to the
 * path or undefined if none of the mappings match
 */
JavaScriptFileType.prototype.getMapping = function(pathName) {
    if (typeof(pathName) === "undefined") {
        return undefined;
    }
    var jsSettings = this.project.settings.javascript;
    var mappings = (jsSettings && jsSettings.mappings) ? jsSettings.mappings : defaultMappings;
    var patterns = Object.keys(mappings);

    var match = patterns.find(function(pattern) {
        return mm.isMatch(pathName, pattern);
    });

    return match && mappings[match];
}

var alreadyLocJS = new RegExp(/\.([a-z][a-z](-[A-Z][a-z][a-z][a-z])?(-[A-Z][A-Z](-[A-Z]+)?)?)\.js$/);
var alreadyLocHaml = new RegExp(/\.([a-z][a-z](-[A-Z][a-z][a-z][a-z])?(-[A-Z][A-Z](-[A-Z]+)?)?)\.html\.haml$/);
var alreadyLocTmpl = new RegExp(/\.([a-z][a-z](-[A-Z][a-z][a-z][a-z])?(-[A-Z][A-Z](-[A-Z]+)?)?)\.tmpl\.html$/);

/**
 * Return true if the given path is a java file and is handled
 * by the current file type.
 *
 * @param {String} pathName path to the file being questions
 * @returns {boolean} true if the path is a java file, or false
 * otherwise
 */
JavaScriptFileType.prototype.handles = function(pathName) {
    this.logger.debug("JavaScriptFileType handles " + pathName + "?");
    var ret = false;

    // resource files should be handled by the JavaScriptResourceType instead
    if (this.project.isResourcePath("js", pathName)) return false;

    ret = (pathName.endsWith(".js") || pathName.endsWith(".jsx") ||
        pathName.endsWith(".html.haml") || pathName.endsWith(".tmpl.html"));

    // now match at least one of the mapping patterns
    if (ret) {
        // first check if it is a source file
        var jsSettings = this.project.settings.javascript;
        if (jsSettings) {
            ret = false;
            var mappings = (jsSettings && jsSettings.mappings) ? jsSettings.mappings : defaultMappings;
            var patterns = Object.keys(mappings);
            ret = mm.isMatch(pathName, patterns);
            // now check if it is an already-localized file, and if it has a different locale than the
            // source locale, then we don't need to extract those strings
            if (ret) {
                for (var i = 0; i < patterns.length; i++) {
                    var locale = this.API.utils.getLocaleFromPath(mappings[patterns[i]].template, "./" + pathName);
                    if (locale && this.isValidLocale(locale) && locale !== this.project.sourceLocale) {
                        ret = false;
                        break;
                    }
                }
            }
        } else {
            // no js settings, so check for the locale in the path manually for backwards compatibility
            var match = alreadyLocJS.exec(pathName);
            if (match) {
                ret = match.length ? match[1] === this.project.sourceLocale : true;
            } else {
                match = alreadyLocHaml.exec(pathName);
                if (match) {
                    ret = match.length ? match[1] === this.project.sourceLocale : true;
                } else {
                    match = alreadyLocTmpl.exec(pathName);
                    if (match) {
                        ret = match.length ? match[1] === this.project.sourceLocale : true;
                    }
                }
            }
        }
    }

    this.logger.debug(ret ? "Yes" : "No");
    return ret;
};

JavaScriptFileType.prototype.name = function() {
    return "JavaScript File Type";
};

/**
 * Return the alternate output locale or the shared output locale for the given
 * mapping. If there are no locale mappings, it returns the locale parameter.
 *
 * @param {Object} mapping the mapping for this source file
 * @param {String} locale the locale spec for the target locale
 * @returns {Locale} the output locale
 */
JavaScriptFileType.prototype.getOutputLocale = function(mapping, locale) {
    // we can remove the replace() call after upgrading to
    // ilib 14.10.0 or later because it can parse locale specs
    // with underscores in them
    return new Locale(
        (mapping && mapping.localeMap && mapping.localeMap[locale] && mapping.localeMap[locale]) ||
        this.project.getOutputLocale(locale));
};

/**
 * Return the location on disk where the version of this file localized
 * for the given locale should be written.
 * @param {String} template template for the output file
 * @param {String} pathname path to the source file
 * @param {String} locale the locale spec for the target locale
 * @returns {String} the localized path name
 */
JavaScriptFileType.prototype.getLocalizedPath = function(mapping, pathname, locale) {
    var template = mapping && mapping.template;
    var l = this.getOutputLocale(mapping, locale);

    if (!template) {
        template = defaultMappings["**/*.js"].template;
    }

    return path.normalize(this.API.utils.formatPath(template, {
        sourcepath: pathname,
        locale: l
    }));
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
JavaScriptFileType.prototype.write = function(translations, locales) {
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
            this.logger.trace("Localizing JavaScript strings to " + locale);

            db.getResourceByCleanHashKey(res.cleanHashKeyForTranslation(locale), function(err, translated) {
                var r = translated;
                if (!translated || this.API.utils.cleanString(res.getSource()) !== this.API.utils.cleanString(r.getSource())) {
                    if (r) {
                        this.logger.trace("extracted   source: " + this.API.utils.cleanString(res.getSource()));
                        this.logger.trace("translation source: " + this.API.utils.cleanString(r.getSource()));
                    }
                    var note = r && 'The source string has changed. Please update the translation to match if necessary. Previous source: "' + r.getSource() + '"';
                    var newres = res.clone();
                    newres.setTargetLocale(locale);
                    newres.setTarget((r && r.getTarget()) || res.getSource());
                    newres.setState("new");
                    newres.setComment(note);

                    this.newres.add(newres);

                    this.logger.trace("No translation for " + res.reskey + " to " + locale);
                } else {
                    if (res.reskey != r.reskey) {
                        // if reskeys don't match, we matched on cleaned string.
                        //so we need to overwrite reskey of the translated resource to match
                        r = r.clone();
                        r.reskey = res.reskey;
                    }

                    file = resFileType.getResourceFile({ locale: locale, pathName: this.getLocalizedPath(res.mapping, res.getPath(), locale) });
                    file.addResource(r);
                    this.logger.trace("Added " + r.reskey + " to " + file.pathName);
                }
            }.bind(this));
        }.bind(this));
    }

    resources = this.pseudo.getAll().filter(function(resource) {
        return resource.datatype === this.datatype;
    }.bind(this));

    for (var i = 0; i < resources.length; i++) {
        res = resources[i];
        if (res.getTargetLocale() !== this.project.sourceLocale && res.getSource() !== res.getTarget()) {
            file = resFileType.getResourceFile({ locale: res.getTargetLocale(), pathName: this.getLocalizedPath(res.mapping, res.getPath(), res.getTargetLocale()) });
            file.addResource(res);
            this.logger.trace("Added " + res.reskey + " to " + file.pathName);
        }
    }
};

JavaScriptFileType.prototype.newFile = function(path, options) {
    return new JavaScriptFile({
        project: this.project,
        pathName: path,
        type: this,
        locale: options && options.targetLocale
    });
};

JavaScriptFileType.prototype.getDataType = function() {
    return this.datatype;
};

JavaScriptFileType.prototype.getResourceTypes = function() {
    return {};
};

/**
 * Return the list of file name extensions that this plugin can
 * process.
 *
 * @returns {Array.<string>} the list of file name extensions
 */
JavaScriptFileType.prototype.getExtensions = function() {
    return this.extensions;
};

/**
 * Return the name of the node module that implements the resource file type, or
 * the path to a javascript file that implements the resource filetype.
 * @returns {Function|undefined} node module name or path, or undefined if this file type does not
 * need resource files
 */
JavaScriptFileType.prototype.getResourceFileType = function() {
    return JavaScriptResourceFileType;
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
JavaScriptFileType.prototype.getExtracted = function() {
    return this.extracted;
};

/**
 * Add the contents of the given translation set to the extracted resources
 * for this file type.
 *
 * @param {TranslationSet} set set of resources to add to the current set
 */
JavaScriptFileType.prototype.addSet = function(set) {
    this.extracted.addSet(set);
};

/**
 * Return the translation set containing all of the new
 * resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * new resources
 */
JavaScriptFileType.prototype.getNew = function() {
    return this.newres;
};

/**
 * Return the translation set containing all of the pseudo
 * localized resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * pseudo localized resources
 */
JavaScriptFileType.prototype.getPseudo = function() {
    return this.pseudo;
};

module.exports = JavaScriptFileType;
