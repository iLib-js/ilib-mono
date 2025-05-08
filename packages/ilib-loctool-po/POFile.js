/*
 * POFile.js - plugin to extract resources from an PO file
 *
 * Copyright © 2021-2022, 2025 Box, Inc.
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
var PO = require("ilib-po").POFile;
var ToolsCommon = require("ilib-tools-common");
var Locale = require("ilib-locale");

var pluralForms = require("./pluralforms.json");

var commentTypes = {
    "translator": true,
    "extracted": true,
    "flags": true,
    "previous": true,
    "paths": true
};

/**
 * Create a new PO file with the given path name and within
 * the given project.
 *
 * @param {Project} project the project object
 * @param {String} pathName path to the file relative to the root
 * of the project file
 * @param {FileType} type the file type instance of this file
 */
var POFile = function(options) {
    this.project = options.project;
    this.pathName = options.pathName || "";
    this.type = options.type;

    this.API = this.project.getAPI();

    this.set = this.API.newTranslationSet(this.project ? this.project.sourceLocale : "zxx-XX");
    this.mapping = this.type.getMapping(this.pathName);
    this.logger = this.API.getLogger("loctool.plugin.POFile");

    this.localeSpec = options.locale || (this.mapping && this.API.utils.getLocaleFromPath(this.mapping.template, this.pathName)) || "en-US";
    this.locale = new Locale(this.localeSpec);

    if (this.mapping && this.mapping.ignoreComments) {
        if (typeof(this.mapping.ignoreComments) === "boolean") {
            this.commentsToIgnore = new Set(this.mapping.ignoreComments ? Object.keys(commentTypes) : undefined);
        } else {
            this.commentsToIgnore = new Set();
            if (Array.isArray(this.mapping.ignoreComments)) {
                this.mapping.ignoreComments.forEach(function(element) {
                    if (commentTypes[element]) {
                        this.commentsToIgnore.add(element);
                    }
                }.bind(this));
            }
        }
    } else {
        this.commentsToIgnore = new Set();
    }

    this.resourceIndex = 0;

    this.po = new PO({
        sourceLocale: this.project.sourceLocale,
        targetLocale: this.localeSpec,
        projectName: this.project.getProjectId(),
        contextInKey: this.mapping && this.mapping.contextInKey
    });
};

POFile.prototype.convertCommonToLoctool = function(resource) {
    if (!resource) return undefined;
    var type = resource.getType();
    var options = {
        resType: type,
        project: resource.getProject(),
        sourceLocale: resource.getSourceLocale(),
        targetLocale: resource.getTargetLocale(),
        pathName: resource.getPath(),
        datatype: resource.getDataType(),
        context: resource.getContext(),
        reskey: resource.getKey(),
        state: resource.getState(),
        comment: resource.getComment(),
        autoKey: resource.autoKey,
        flavor: resource.getFlavor()
    };
    if (type === "string") {
        options.source = resource.getSource();
        options.target = resource.getTarget();
    } else if (type === "plural") {
        options.sourceStrings = resource.getSource();
        options.targetStrings = resource.getTarget();
    } else if (type === "array") {
        options.sourceArray = resource.getSource();
        options.targetArray = resource.getTarget();
    }
    return this.API.newResource(options);
};

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set. This function uses a finite state machine to
 * handle the parsing.
 * @param {String} data the string to parse
 */
POFile.prototype.parse = function(data) {
    this.logger.debug("Extracting strings from " + this.pathName);

    var set = this.po.parse(data);
    var resources = set.getAll();
    this.set.addAll(resources.map(function(resource) {
        return this.convertCommonToLoctool(resource);
    }.bind(this)));
};

/**
 * Extract all the localizable strings from the PO file and add them to the
 * project's translation set.
 */
POFile.prototype.extract = function() {
    this.logger.debug("Extracting strings from " + this.pathName);
    if (this.pathName) {
        var p = path.join(this.project.root, this.pathName);
        try {
            var data = fs.readFileSync(p, "utf8");
            if (data) {
                this.parse(data);
            }
        } catch (e) {
            this.logger.warn("Could not read file: " + p);
            this.logger.warn(e);
        }
    }
};

/**
 * Return the set of resources found in the current PO file.
 *
 * @returns {TranslationSet} The set of resources found in the
 * current PO file.
 */
POFile.prototype.getTranslationSet = function() {
    return this.set;
}

/**
 * Write the resource file out to disk again.
 */
POFile.prototype.write = function() {
    var pathName = this.pathName || this.getLocalizedPath(this.localeSpec);
    this.logger.debug("Writing file " + pathName);
    var p = path.join(this.project.target, pathName);
    var d = path.dirname(p);
    this.API.utils.makeDirs(d);

    fs.writeFileSync(p, this.localizeText(undefined, this.localeSpec, pathName), "utf-8");
};

/**
 * Add a resource to this file. The locale of the resource
 * should correspond to the locale of the file, and the
 * context of the resource should match the context of
 * the file.
 *
 * @param {Resource} res a resource to add to this file
 */
POFile.prototype.addResource = function(res) {
    this.logger.trace("POFile.addResource: " + JSON.stringify(res) + " to " + this.project.getProjectId() + ", " + this.locale + ", " + JSON.stringify(this.context));
    var resLocale = res.getTargetLocale();
    if (res && res.getProject() === this.project.getProjectId()) {
        this.logger.trace("correct project. Adding.");
        if (resLocale && resLocale !== this.localeSpec) {
            // This one is not the right locale, so add it as a source-only resource
            // so that it can be a placeholder for the real translation later on
            this.set.add(this.API.newResource({
                resType: res.getType(),
                sourceStrings: (res.getType() === "plural") ? res.getSourcePlurals() : undefined,
                source: (res.getType() === "string") ? res.getSource() : undefined,
                sourceLocale: res.getSourceLocale(),
                project: res.getProject(),
                key: res.getKey(),
                pathName: res.getPath(),
                state: "new",
                comment: res.getComment(),
                datatype: this.type.datatype,
                context: res.getContext(),
                index: this.resourceIndex++
            }));
        } else {
            this.set.add(res);
        }
    } else {
        if (res) {
            if (res.getProject() !== this.project.getProjectId()) {
                this.logger.warn("Attempt to add a resource to a resource file with the incorrect project.");
            } else {
                this.logger.warn("Attempt to add a resource to a resource file with the incorrect locale. " + resLocale + " vs. " + this.localeSpec);
            }
        } else {
            this.logger.warn("Attempt to add an undefined resource to a resource file.");
        }
    }
};

/**
 * Return true if this resource file has been modified
 * since it was loaded from disk.
 *
 * @returns {boolean} true if this resource file has been
 * modified since it was loaded
 */
POFile.prototype.isDirty = function() {
    return this.set.isDirty();
};

/**
 * Return the location on disk where the version of this file localized
 * for the given locale should be written.
 * @param {String] locale the locale spec for the target locale
 * @returns {String} the localized path name
 */
POFile.prototype.getLocalizedPath = function(locale) {
    return this.type.getLocalizedPath(this.mapping, this.pathName, locale);
};

/**
 * Return the source locale of this PO file.
 * @returns {string} the locale spec for the source locale
 */
POFile.prototype.getSourceLocale = function() {
    return this.project.sourceLocale;
};

/**
 * Return the target locale of this PO file.
 * @returns {string} the locale spec for the target locale
 */
POFile.prototype.getTargetLocale = function() {
    return this.localeSpec;
};

/**
 * Return the translated version of the given string.
 * If the string is not translated, then it will return the
 * source string, or an empty string if the source string
 * is undefined.
 *
 * @param {TranslationSet} translations the current set of translations
 * @param {String} str the source string to translate
 * @param {String} locale the locale to translate to
 * @returns {String} the translation of the source string or the source string itself
 * if the string is not translated yet
 */
POFile.prototype.translateString = function(translations, resource, locale) {
    var str = resource.getSource();
    var hashkey = resource.hashKeyForTranslation(locale);
    var translated = translations.getClean(hashkey);
    var source, translatedText = str;
    if ((locale !== this.project.pseudoLocale || !this.project.settings.nopseudo) &&
        (!translated && this.type && this.type.pseudos[locale])) {
        var source, sourceLocale = this.type.pseudos[locale].getPseudoSourceLocale();
        if (sourceLocale !== this.project.sourceLocale) {
            // translation is derived from a different locale's translation instead of from the source string
            var sourceRes = translations.getClean(resource.cleanHashKey(), this.type.datatype);
            source = sourceRes ? sourceRes.getTarget() : text;
        } else {
            source = text;
        }
        translatedText = this.type.pseudos[locale].getString(source);
    } else {
        if (translated) {
            translatedText = translated.getTarget();
        } else {
            if (this.type && this.API.utils.containsActualText(str)) {
                this.logger.trace("New string found: " + str);
                this.type.newres.add(this.API.newResource({
                    resType: "string",
                    project: resource.getProject(),
                    key: resource.getKey(),
                    sourceLocale: resource.getSourceLocale(),
                    source: str,
                    targetLocale: locale,
                    target: str,
                    pathName: resource.getPath(),
                    state: "new",
                    comment: resource.getComment(),
                    datatype: resource.getDataType(),
                    context: resource.getContext(),
                    index: this.resourceIndex++
                }));
                translatedText = this.type && this.type.missingPseudo && !this.project.settings.nopseudo ?
                        this.type.missingPseudo.getString(str) : "";
            }
        }
    }

    if (translatedText === resource.getSource()) {
        // put nothing if there is no difference in the translation
        translatedText = "";
    }

    return translatedText;
};

/**
 * Translate plural strings in the given resource.
 * If the plural string is not translated, then it will return the
 * source plural strings, or an empty object if the source plural
 * strings are undefined. If the plural is missing a required plural
 * category, then it will either backfill the translation of category
 * if it can, or else it will add that category with an empty string.
 *
 * @param {TranslationSet} translations the current set of translations
 * @param {Array<String>} pluralCategories the list of plural categories to
 * use for the target locale
 * @param {ResourcePlural} resource the plural resource to translate
 * @param {String} targetLocale the locale to translate to
 * @returns {Object} the plural object containing the translations, or the
 * source plural object if this plural is not translated yet
 */

POFile.prototype.translatePluralString = function(translations, pluralCategories, resource, targetLocale) {
    var sourcePlurals = resource.getSourcePlurals();
    var hashkey = resource.hashKeyForTranslation(targetLocale);
    var translated = translations.getClean(hashkey);
    var translatedPlurals = {};
    pluralCategories.forEach(function(category) {
        // initialize all categories to empty strings
        translatedPlurals[category] = "";
    });
    if ((targetLocale !== this.project.pseudoLocale || !this.project.settings.nopseudo) &&
        (!translated && this.type && this.type.pseudos[targetLocale])) {
        var source, sourceLocale = this.type.pseudos[targetLocale].getPseudoSourceLocale();
        if (sourceLocale !== this.project.sourceLocale) {
            // translation is derived from a different locale's translation instead of from the source string
            var sourceRes = translations.getClean(
                resource.cleanHashKey(),
                this.type.datatype);
            source = sourceRes ? sourceRes.getTargetPlurals() : translatedPlurals;
        } else {
            source = translatedPlurals;
        }
        translatedPlurals = this.API.utils.objectMap(source, function(item) {
            return this.type.pseudos[targetLocale].getString(item);
        }.bind(this));
    } else {
        if (translated) {
            translatedPlurals = translated.getTargetPlurals();
        } else {
            if (this.type) {
                this.logger.trace("New plural found: " + JSON.stringify(sourcePlurals));
                this.type.newres.add(this.API.newResource({
                    resType: "plural",
                    project: resource.getProject(),
                    key: resource.getKey(),
                    sourceLocale: resource.getSourceLocale(),
                    sourceStrings: sourcePlurals,
                    targetLocale: targetLocale,
                    targetStrings: translatedPlurals,
                    pathName: resource.getPath(),
                    state: "new",
                    datatype: resource.getDataType(),
                    context: resource.getContext(),
                    index: this.resourceIndex++
                }));
                if (this.type && this.type.missingPseudo && !this.project.settings.nopseudo) {
                    translatedPlurals = this.API.utils.objectMap(sourcePlurals, function(item) {
                        return this.type.missingPseudo.getString(item);
                    }.bind(this));
                }
            }
        }
    }

    return translatedPlurals;
};

/**
 * Localize the text of the current file to the given locale and return
 * the results.
 *
 * @param {TranslationSet} translations the current set of translations
 * @param {String} locale the locale to translate to
 * @param {String} pathName the path name of the file to write the localized text to
 * @returns {String} the localized text of this file
 */
POFile.prototype.localizeText = function(translations, locale, pathName) {
    var inputLocale = new Locale(locale);
    var l = this.type.getOutputLocale(this.mapping, locale);
    var plurals = pluralForms[l.getLanguage()] || pluralForms.en;
    var pluralCategories = plurals.categories;

    var headerLocale;
    var headerLocaleStyle = (this.mapping && this.mapping.headerLocale) || "mapped";
    switch (headerLocaleStyle) {
        case "full":
            headerLocale = inputLocale.getSpec();
            break;
        case "abbreviated":
            headerLocale = inputLocale.getLanguage();
            break;
        default:
            headerLocale = l.getSpec();
            break;
    }

    var resources = this.set.getAll().map(function(resource) {
        var params = {
            resType: resource.getType(),
            project: resource.getProject(),
            sourceLocale: resource.getSourceLocale(),
            targetLocale: locale,
            pathName: resource.getPath(),
            datatype: resource.getDataType(),
            context: resource.getContext(),
            reskey: resource.getKey(),
            state: resource.getState(),
            comment: resource.getComment(),
            autoKey: resource.autoKey,
            flavor: resource.getFlavor()
        };

        if (resource.getType() === "plural") {
            params.source = resource.getSourcePlurals();
            params.target = translations ? this.translatePluralString(translations, pluralCategories, resource, locale) : resource.getTargetPlurals();

            return new ToolsCommon.ResourcePlural(params);
        } else {
            params.source = resource.getSource();
            params.target = translations ? this.translateString(translations, resource, locale) : resource.getTarget();
            return new ToolsCommon.ResourceString(params);
        }
    }.bind(this));

    var translationSet = new ToolsCommon.TranslationSet(this.project.sourceLocale);
    translationSet.addAll(resources);

    var po = new PO({
        projectName: this.project.getProjectId(),
        sourceLocale: this.project.sourceLocale,
        targetLocale: headerLocale,
        contextInKey: this.mapping && this.mapping.contextInKey,
        pathName: pathName
    });

    return po.generate(translationSet);
};

/**
 * Localize the contents of this PO file and write out the
 * localized PO file to a different file path.
 *
 * @param {TranslationSet} translations the current set of
 * translations
 * @param {Array.<String>} locales array of locales to translate to
 */
POFile.prototype.localize = function(translations, locales) {
    // don't localize if there is no text
    for (var i = 0; i < locales.length; i++) {
        if (!this.project.isSourceLocale(locales[i])) {
            // skip variants for now until we can handle them properly
            var l = new Locale(locales[i]);
            if (!l.getVariant()) {
                var pathName = this.getLocalizedPath(locales[i]);
                this.logger.debug("Writing file " + pathName);
                var p = path.join(this.project.target, pathName);
                var d = path.dirname(p);
                this.API.utils.makeDirs(d);

                fs.writeFileSync(p, this.localizeText(translations, locales[i], pathName), "utf-8");
            }
        }
    }
};

module.exports = POFile;
