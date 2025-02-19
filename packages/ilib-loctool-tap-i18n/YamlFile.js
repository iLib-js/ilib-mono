/*
 * YamlFile.js - represents a tap-i18n style yaml resource file for localization.
 *
 * Copyright © 2024 Box, Inc.
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
var Yaml = require("ilib-yaml");
var Locale = require("ilib/lib/Locale.js");
var tools = require("ilib-tools-common");
var TranslationSet = require("loctool/lib/TranslationSet");


/**
 * @class Represents a yaml source file.
 * The props may contain any of the following properties:
 *
 * <ul>
 * <li>project - the name of the project for this file
 * <li>pathName - the path to the file, relative to the root of the project
 * <li>type - type of this resource file
 * <li>locale - the locale of this file
 * <li>flavor - the flavor of this file (for customized strings)
 * </ul>
 * @param {Object} props properties that control the construction of this file.
 */
var YamlFile = function(props) {
    if (props) {
        this.project = props.project;
        this.pathName = props.pathName;
        this.locale = props.locale;
        this.type = props.type;
        this.flavor = props.flavor;
    }

    this.API = this.project.getAPI();
    this.logger = this.API.getLogger("loctool.plugin.TapI18nYamlFile");
    this.sourceLocale = (this.project && this.project.sourceLocale) || "en-US";
    this.locale = this.locale || this.sourceLocale;
    this.mapping = this.type.getMapping(this.pathName);

    if (this.pathName && this.project && this.project.flavorList) {
        var filename = path.basename(this.pathName, ".yml");
        var l = new Locale(filename);
        if (l.getVariant() && this.project.flavorList.indexOf(l.getVariant()) > -1) {
            this.flavor = l.getVariant();
        }
    }

    this.yaml = new Yaml({
        pathName: this.pathName,
        project: this.project.getProjectId(),
        sourceLocale: this.sourceLocale,
        locale: this.locale,
        context: this.context,
        datatype: this.type.getDataType(),
        flavor: this.flavor,
        commentPrefix: this.getCommentPrefix()
    });

    this.set = new TranslationSet(this.project.sourceLocale);
};

// For documentation about the plural suffices, see the following:
// https://github.com/TAPevents/tap-i18n?tab=readme-ov-file#the-_--helper (search for code examples 5 & 6)
// https://i18next.github.io/i18next/pages/doc_features.html   (tap depends on i18next)
var pluralSuffices = {
    "_plural_indefinite": "other",
    "_plural_100": "other",
    "_plural_11": "many",
    "_plural_0": "zero",
    "_plural_1": "one",
    "_plural_2": "two",
    "_plural_3": "few",
    "_plural": "other",
    "_zero": "zero",
    "_one": "one",
    "_two": "two",
    "_few": "few",
    "_many": "many",
    "_other": "other",
    "_100": "other",
    "_11": "many",
    "_0": "zero",
    "_1": "one",
    "_2": "two",
    "_3": "few"
};

/**
 * Return whether or not the given resource represents one of
 * the plural forms of a string in this set. If the resource's
 * key has a recognized plural suffix, then the resource is a
 * plural form and that suffix is returned. If the resource is
 * the base form and other resources contain other plural forms,
 * then this method returns an empty string to indicate that
 * this is part of a plural, but it has no suffix. If the resource
 * is not a plural form, then this method returns undefined.
 *
 * @param {ResourceString} resource the resource to check
 * @returns {string|undefined} the plural category string if
 * this resource represents a plural form, or undefined if it
 * does not.
 */
function isPluralForm(set, resource) {
    // if this is a plural form, check for each suffix to see if
    // it is there
    var key = resource.getKey();
    var suffices = Object.keys(pluralSuffices);
    var suffix = suffices.find(function(suffix) {
        return key.endsWith(suffix);
    });
    if (suffix) return suffix;

    // if this is a base form, then check that some other plural
    // form exists in the set. If it does, this is the string for
    // the "one" (singular) plural category. If there is no other
    // resources with the same base and one of the prefixes, then
    // this is just a plain old string resource and we return
    // undefined
    suffix = suffices.find(function(suffix) {
        var resources = set.getBy({
            reskey: key + suffix
        });
        return resources.length ? resources[0] : false;
    });

    return suffix ? "" : undefined;
}

/**
 * Parse a yml file and store the resources found in it into the
 * file's translation set.
 *
 * @param {String} str the string to parse
 */
YamlFile.prototype.parse = function(str) {
    this.yaml.deserialize(str);
    // now post-process the StringResource instances to find the plurals
    // and convert them into PluralResource instances
    var set = this.yaml.getTranslationSet();
    var resources = set.getAll();
    var pluralSet = new TranslationSet(this.project.sourceLocale);
    var stringSet = new TranslationSet(this.project.sourceLocale);

    // The strategy is to take every resource that was parsed from the
    // yaml file and figure out whether or not it was part of a plural.
    // If so, add the string to a plural resource that is added to
    // the plural set, slowly building out all the plural categories
    // together over multiple string resources. If it is not part of
    // a plural, add it to the regular string/array set.
    // Then, at the end of this method, add all of the
    // plurals and strings together in a single set.
    resources.forEach(function(resource) {
        var key = resource.getKey();
        // if this resource represents part of a plural form, then
        // create a new plural or augment the existing plural
        var suffix = isPluralForm(set, resource);
        if (typeof(suffix) !== 'undefined') {
            var category = pluralSuffices[suffix] ?? "one";
            var basekey = suffix ? key.substring(0, key.length - suffix.length) : key;
            var basePlural;
            if (suffix) {
                var basePluralArray = pluralSet.getBy({
                    reskey: basekey
                });
                basePlural = basePluralArray && basePluralArray[0];
            }
            if (!basePlural) {
                // no plural there yet, so create a new one
                basePlural = this.API.newResource({
                    resType: "plural",
                    key: basekey,
                    sourceStrings: {},
                    sourceLocale: resource.getSourceLocale(),
                    project: resource.getProject(),
                    pathName: resource.getPath(),
                    datatype: resource.getDataType(),
                    flavor: resource.getFlavor(),
                    comment: resource.getComment(),
                    index: resource.index,
                    state: "new"
                });
                pluralSet.add(basePlural);
            }

            basePlural.addSource(category, resource.getSource());

            var target = resource.getTarget();
            if (target) {
                basePlural.addTarget(category, target);
                basePlural.setTargetLocale(resource.getTargetLocale());
            }
        } else {
            // this is just a simple string resource
            stringSet.add(this.convertToLoctoolResource(resource));
        }
    }.bind(this));

    this.set.clear();
    this.set.addAll(pluralSet.getAll());
    this.set.addAll(stringSet.getAll());
};

/**
 * Extract all of the resources from this file and keep them in
 * memory.
 */
YamlFile.prototype.extract = function() {
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
 * Get the path name of this resource file.
 *
 * @returns {String} the path name to this file
 */
YamlFile.prototype.getPath = function() {
    return this.pathName;
};

/**
 * Get the locale of this resource file.
 *
 * @returns {String} the locale spec of this file
 */
YamlFile.prototype.getLocale = function() {
    return this.locale;
};

/**
 * Get the locale of this resource file.
 *
 * @returns {String} the locale spec of this file
 */
YamlFile.prototype.getContext = function() {
    return this.getContext();
};

/**
 * Get the flavor of this resource file. The flavor determines
 * the customization of the strings, which allows for different English
 * source strings for the same resource key based on the flavor. For
 * example, if your app has the string "Log-in" when there is no flavor,
 * it might have the strings "Enter your partner ID:" for one partner,
 * and "Enter your member number:" for a different partner. Each of the
 * strings with a different flavor is a source string that needs to be
 * translated separately, even though they have the same key.
 *
 * @returns {String|undefined} the flavor of this file, or undefined
 * for no flavor
 */
YamlFile.prototype.getFlavor = function() {
    return this.flavor;
};


/**
 * Get all resources from this file. This will return all resources
 * of mixed types (strings, arrays, or plurals).
 *
 * @returns {Resource} all of the resources available in this resource file.
 */
YamlFile.prototype.getAll = function() {
    return this.set.getAll();
};

/**
 * Add a resource to this file. The locale of the resource
 * should correspond to the locale of the file, and the
 * context of the resource should match the context of
 * the file.
 *
 * @param {Resource} res a resource to add to this file
 */
YamlFile.prototype.addResource = function(res) {
    this.set.add(res);
};


/**
 * Add every resource in the given array to this file.
 * @param {Array.<Resource>} resources an array of resources to add
 * to this file
 */
YamlFile.prototype.addAll = function(resources) {
    this.set.addAll(resources);
};

YamlFile.prototype.convertToLoctoolResource = function(resource) {
    var resType = resource.getType();
    var options = {
        resType: resType,
        key: resource.getKey(),
        sourceLocale: resource.getSourceLocale(),
        targetLocale: resource.getTargetLocale(),
        project: resource.getProject(),
        pathName: resource.getPath(),
        datatype: resource.getDataType(),
        flavor: resource.getFlavor(),
        comment: resource.getComment(),
        state: "new"
    };

    switch (resType) {
        case 'plural':
            options.sourcePlurals = resource.getSource();
            options.targetPlurals = resource.getTarget();
            break;
        case 'array':
            options.sourceArray = resource.getSource();
            options.targetArray = resource.getTarget();
            break;
        default:
            options.source = resource.getSource();
            options.target = resource.getTarget();
            break;
    }

    return this.API.newResource(options);
};

YamlFile.prototype.convertToToolsResource = function(resource) {
    var resType = resource.getType();
    var options = {
        resType: resType,
        key: resource.getKey(),
        sourceLocale: resource.getSourceLocale(),
        targetLocale: resource.getTargetLocale(),
        project: resource.getProject(),
        pathName: resource.getPath(),
        datatype: resource.getDataType(),
        flavor: resource.getFlavor(),
        comment: resource.getComment(),
        state: "new"
    };

    switch (resType) {
        case 'plural':
            options.source = resource.getSourcePlurals();
            options.target = resource.getTargetPlurals();
            return new tools.ResourcePlural(options);
        case 'array':
            options.source = resource.getSourceArray();
            options.target = resource.getTargetArray();
            return new tools.ResourceArray(options);
        default:
            options.source = resource.getSource();
            options.target = resource.getTarget();
            return new tools.ResourceString(options);
    }
};

/**
 * Additional plural categories required for specified languages.
 * 
 * @type {Map<String, Array<String>>}
 */
var requiredPluralCategories = new Map([
    ["pl", [
        "many"
    ]],
    ["ru", [
        "many"
    ]]
]);

/**
 * Generate the content of the resource file.
 *
 * @param {TranslationSet} set the set to use to get the content
 * @private
 * @returns {String} the content of the resource file
 */
YamlFile.prototype.getContent = function(set) {
    // Run through each resource and convert any plural resources
    // into string resources so that they can be represented in
    // the yaml file properly as tap-i18n expects it. All other
    // types of resources are just left as-is.
    var resources = set.getAll();
    var filtered = new TranslationSet();

    resources.forEach(function(resource) {
        if (resource.getType() === "plural") {
            var sourcePlurals = resource.getSourcePlurals();
            var targetPlurals = resource.getTargetPlurals();

            // accumulate all plural categories which should be present in the output file:
            // 0. every plural must have at least the "other" category
            // 1a. categories from the target plural - translation should be provided for every category
            //     required in the target language
            // 1b. fallback to categories from the source plural in case no translations were provided
            // 2. categories required for the target language - some languages may require specific categories
            //    to be present in the output file even if they were not provided in translation
            //    (in this case the translation from "other" plural category will be used as a fallback)
            var pluralCategories = new Set(["other"]);
            Object.keys(targetPlurals || sourcePlurals).forEach(function (category) {
                pluralCategories.add(category);
            });
            var language = new Locale(resource.getTargetLocale()).getLanguage();
            var additionalCategories = requiredPluralCategories.get(language);
            if (additionalCategories) {
                additionalCategories.forEach(function (category) {
                    pluralCategories.add(category);
                });
            }
            
            Array.from(pluralCategories).sort().forEach(function(category) {
                var newres = new tools.ResourceString({
                    key: resource.getKey() + "_" + category,
                    sourceLocale: resource.getSourceLocale(),
                    // there should always at least be an "other" category
                    source: sourcePlurals[category] ?? sourcePlurals.other,
                    project: resource.getProject(),
                    pathName: resource.getPath(),
                    datatype: resource.getDataType(),
                    flavor: resource.getFlavor(),
                    comment: resource.getComment(),
                    state: "new"
                });
                if (targetPlurals) {
                    newres.setTarget(targetPlurals[category] ?? targetPlurals.other);
                    newres.setTargetLocale(resource.getTargetLocale());
                }
                filtered.add(newres);
            }.bind(this));
        } else {
            filtered.add(this.convertToToolsResource(resource));
        }
    }.bind(this));

    var y = new Yaml({
        pathName: this.pathName,
        project: this.project.getProjectId(),
        locale: this.locale,
        context: this.context,
        datatype: this.type.getDataType(),
        flavor: this.flavor,
        commentPrefix: this.getCommentPrefix()
    });
    y.addResources(filtered.getAll());

    return y.serialize();
};

//we don't write to yaml source files
YamlFile.prototype.write = function() {};

/**
 * Return the set of resources found in the current Android
 * resource file.
 *
 * @returns {TranslationSet} The set of resources found in the
 * current Java file.
 */
YamlFile.prototype.getTranslationSet = function() {
    return this.set;
}

/**
 * Return the location on disk where the version of this file localized
 * for the given locale should be written. This should be relative to
 * the root of the project.
 *
 * @param {String} locale the locale spec for the target locale
 * @returns {String} the localized path name
 */
YamlFile.prototype.getLocalizedPath = function(locale) {
    locale = this.project.getOutputLocale(locale);
    var mapping = this.mapping || this.type.getMapping(this.pathName) || this.type.getDefaultMapping();

    return path.normalize(this.API.utils.formatPath(mapping.template, {
        sourcepath: this.pathName,
        locale: locale
    }));
};

function getSource(resource) {
    var resType = resource.getType();
    if (resType === "plural") {
        return resource.getSourcePlurals();
    } else if (resType === "array") {
        return resource.getSourceArray()
    }

    return resource.getSource();
}

function setSource(resource, source) {
    var resType = resource.getType();
    if (resType === "plural") {
        return resource.setSourcePlurals(source);
    } else if (resType === "array") {
        return resource.setSourceArray(source)
    }

    return resource.setSource(source);
}

function getTranslation(resource) {
    var resType = resource.getType();
    if (resType === "plural") {
        return resource.getTargetPlurals();
    } else if (resType === "array") {
        return resource.getTargetArray()
    }

    return resource.getTarget();
}

function setTranslation(resource, translation) {
    var resType = resource.getType();
    if (resType === "plural") {
        return resource.setTargetPlurals(translation);
    } else if (resType === "array") {
        return resource.setTargetArray(translation)
    }

    return resource.setTarget(translation);
}

/**
 * Localize the text of the current file to the given locale and return
 * the results.
 *
 * @param {TranslationSet} translations the current set of translations
 * @param {String} locale the locale to translate to
 * @returns {String} the localized text of this file
 */
YamlFile.prototype.localizeText = function(translations, locale) {
    var resources = this.set.getAll();
    var localizedSet = new TranslationSet(this.sourceLocale);

    var translatedYaml = new Yaml({
        pathName: this.pathName,
        project: this.project.getProjectId(),
        locale: locale,
        context: this.context,
        datatype: this.type.getDataType(),
        flavor: this.flavor,
        commentPrefix: this.getCommentPrefix()
    });

    resources.forEach(function(resource) {
        var reskey = resource.getKey();
        var source = getSource(resource);
        var resType = resource.getType();
        var tester;

        if (resType === "plural") {
            tester = this.API.newResource({
                resType: resType,
                project: this.project.getProjectId(),
                sourceLocale: this.project.getSourceLocale(),
                sourceStrings: resource.getSourcePlurals(),
                reskey: reskey,
                pathName: this.pathName,
                datatype: this.type.datatype
            });
        } else if (resType === "array") {
            tester = this.API.newResource({
                resType: resType,
                project: this.project.getProjectId(),
                sourceLocale: this.project.getSourceLocale(),
                sourceArray: resource.getSourceArray(),
                reskey: reskey,
                pathName: this.pathName,
                datatype: this.type.datatype
            });
        } else {
            tester = this.API.newResource({
                resType: resType,
                project: this.project.getProjectId(),
                sourceLocale: this.project.getSourceLocale(),
                source: resource.getSource(),
                reskey: reskey,
                pathName: this.pathName,
                datatype: this.type.datatype
            });
        }
        var hashkey = tester.hashKeyForTranslation(locale);
        var translatedResource = translations.get(hashkey);
        var translation;

        if (locale === this.project.pseudoLocale && this.project.settings.nopseudo) {
            translation = source;
        } else if (!translatedResource && this.type && this.type.pseudos[locale]) {
            var sourceTemp, sourceLocale = this.type.pseudos[locale].getPseudoSourceLocale();
            if (sourceLocale !== this.project.sourceLocale) {
                // translation is derived from a different locale's translation instead of from the source string
                var sourceRes = translations.get(tester.hashKeyForTranslation(sourceLocale));
                sourceTemp = sourceRes ? sourceRes.getTarget() : source;
                translation = this.type.pseudos[locale].getString(sourceTemp);
            } else {
                translation = this.type.pseudos[locale].getString(source);
            }
        } else {
            if (translatedResource) {
                translation = getTranslation(translatedResource);
                this.logger.trace("Translation: " + translation);
            } else {
                var note = translatedResource ? 'The source string has changed. Please update the translation to match if necessary. Previous source: "' + translatedResource.getSource() + '"' : undefined;
                if (this.type) {
                    var newResource = this.API.newResource({
                        resType: resType,
                        project: this.project.getProjectId(),
                        key: reskey,
                        sourceLocale: this.project.sourceLocale,
                        targetLocale: locale,
                        pathName: this.pathName,
                        datatype: this.type.datatype,
                        state: "new",
                        flavor: this.flavor,
                        comment: note,
                        index: this.resourceIndex++
                    });
                    setSource(newResource, source);
                    setTranslation(newResource, translatedResource || source);
                    this.type.newres.add(newResource);
                }
                this.logger.trace("Missing translation");
                translation = this.type && this.type.missingPseudo && !this.project.settings.nopseudo ?
                    this.type.missingPseudo.getString(source) : source;
            }
        }

        setTranslation(tester, translation);
        tester.setTargetLocale(locale);

        localizedSet.add(tester);
    }.bind(this));

    return this.getContent(localizedSet);
};

/**
 * Localize the contents of this template file and write out the
 * localized template file to a different file path.
 *
 * @param {TranslationSet} translations the current set of
 * translations
 * @param {Array.<String>} locales array of locales to translate to
 */
YamlFile.prototype.localize = function(translations, locales) {
    for (var i = 0; i < locales.length; i++) {
        var p, pathName = this.getLocalizedPath(locales[i]);
        this.logger.debug("Writing file " + pathName);
        p = path.join(this.project.target, pathName);
        var dir = path.dirname(p);
        this.API.utils.makeDirs(dir);
        fs.writeFileSync(p, this.localizeText(translations, locales[i]), "utf-8");
    }
};

/**
 * Extract values of key 'commentPrefix' from the loaded schema
 *
 * @returns {String|undefined}
 */
YamlFile.prototype.getCommentPrefix = function() {
    return this.mapping && this.mapping.commentPrefix;
}

module.exports = YamlFile;
