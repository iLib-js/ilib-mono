/*
 * RegexFileType.js - Represents a collection of regex-parsable files
 *
 * Copyright © 2024 JEDLSoft
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
var mm = require("micromatch");

var RegexFile = require("./RegexFile.js");

var RegexFileType = function(project) {
    this.type = "regex";
    this.datatype = "regex";

    this.project = project;
    this.API = project.getAPI();

    this.logger = this.API.getLogger("loctool.plugin.RegexFileType");

    // figure out what file extensions we should be looking for by looking at the minimatch
    // expressions in the mappings
    if (project.settings && project.settings.regex && project.settings.regex.mappings) {
        this.mappings = project.settings.regex.mappings;
        var globExpressions = Object.keys(project.settings.regex.mappings);
        this.extensions = globExpressions.map(function(expression) {
            var match = expression.match(/\.(\w+)$/);
            if (match && match.length > 1) {
                return match[1];
            }
            // no extension in this glob expression, so don't return anything
            return undefined;
        }.bind(this));

        // make sure all of the resource file types are loaded
        this.fileTypes = {};
        globExpressions.forEach(function(expression) {
            var mapping = project.settings.regex.mappings[expression];
            if (mapping && mapping.resourceFileType) {
                var resourceFileTypeClass = require(mapping.resourceFileType);
                mapping.resourceFileTypeInstance = new resourceFileTypeClass(project);
            }
        });
    }

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
 * Return the mapping corresponding to this path.
 * @param {String} pathName the path to check
 * @returns {Object} the mapping object corresponding to the
 * path or undefined if none of the mappings match
 */
RegexFileType.prototype.getMapping = function(pathName) {
    if (typeof(pathName) === "undefined") {
        return undefined;
    }
    pathName = path.normalize(pathName);
    var regexSettings = this.project.settings.regex;
    var mappings = regexSettings && regexSettings.mappings;
    if (!mappings) {
        return undefined;
    }
    var patterns = Object.keys(mappings);

    var match = patterns.find(function(pattern) {
        return mm.isMatch(pathName, pattern);
    });

    return match && mappings[match];
}

/**
 * Return true if the given path is a file that is handled by this
 * configuration. In order to be handled by this configuration, the
 * path must match one of the mapping patterns and must not be a
 * resource file.
 *
 * @param {String} pathName path to the file in question
 * @returns {boolean} true if the path is handled by this
 * configuration, or false otherwise
 */
RegexFileType.prototype.handles = function(pathName) {
    this.logger.debug("RegexFileType handles " + pathName + "?");
    var ret = false;

    var mapping = this.getMapping(pathName);
    if (!mapping) {
        this.logger.debug("No");
        return false;
    }

    // resource files should be handled by the resource file plugin instead
    if (this.project.isResourcePath("regex", pathName)) {
        this.logger.debug("No");
        return false;
    }

    this.logger.debug("Yes");
    return true;
};

RegexFileType.prototype.name = function() {
    return "Regex File Type";
};

/**
 * Return the alternate output locale or the shared output locale for the given
 * mapping. If there are no locale mappings, it returns the locale parameter.
 *
 * @param {Object} mapping the mapping for this source file
 * @param {String} locale the locale spec for the target locale
 * @returns {Locale} the output locale
 */
RegexFileType.prototype.getOutputLocale = function(mapping, locale) {
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
RegexFileType.prototype.getLocalizedPath = function(mapping, pathname, locale) {
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
RegexFileType.prototype.write = function(translations, locales) {
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
            this.logger.trace("Localizing Regex strings to " + locale);

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

                    file = resFileType.getResourceFile(locale, this.getLocalizedPath(res.mapping, res.getPath(), locale));
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
            file = resFileType.getResourceFile(res.getTargetLocale(), this.getLocalizedPath(res.mapping, res.getPath(), locale));
            file.addResource(res);
            this.logger.trace("Added " + res.reskey + " to " + file.pathName);
        }
    }
};

RegexFileType.prototype.newFile = function(path, options) {
    return new RegexFile({
        project: this.project,
        pathName: path,
        type: this,
        locale: options && options.targetLocale
    });
};

RegexFileType.prototype.getDataType = function() {
    return this.datatype;
};

RegexFileType.prototype.getResourceTypes = function() {
    return {};
};

/**
 * Return the list of file name extensions that this plugin can
 * process.
 *
 * @returns {Array.<string>} the list of file name extensions
 */
RegexFileType.prototype.getExtensions = function() {
    return this.extensions;
};

/**
 * Return the name of the node module that implements the resource file type, or
 * the path to a Regex file that implements the resource filetype.
 * @returns {Function|undefined} node module name or path, or undefined if this file type does not
 * need resource files
 */
RegexFileType.prototype.getResourceFileType = function() {
    // no generic resource file type for regex files
};

/**
 * Return the file type that implements the resource file type for the given path.
 * The path is matched against the mappings in the project settings to determine
 * which resource file type to use.
 *
 * @param {String} pathName path to the file in question
 * @returns {Function|undefined} an instance of the file type class, or undefined if
 * the file type could not be determined
 */
RegexFileType.prototype.getResourceFileTypeForPath = function(pathName) {
    var mapping = this.getMapping(pathName);
    if (mapping && mapping.resourceFileTypeInstance) {
        return mapping.resourceFileTypeInstance;
    }
    return undefined;
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
RegexFileType.prototype.getExtracted = function() {
    return this.extracted;
};

/**
 * Add the contents of the given translation set to the extracted resources
 * for this file type.
 *
 * @param {TranslationSet} set set of resources to add to the current set
 */
RegexFileType.prototype.addSet = function(set) {
    this.extracted.addSet(set);
};

/**
 * Return the translation set containing all of the new
 * resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * new resources
 */
RegexFileType.prototype.getNew = function() {
    return this.newres;
};

/**
 * Return the translation set containing all of the pseudo
 * localized resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * pseudo localized resources
 */
RegexFileType.prototype.getPseudo = function() {
    return this.pseudo;
};

module.exports = RegexFileType;
