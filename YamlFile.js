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
const TranslationSet = require("loctool/lib/TranslationSet");

var ResourceString = tools.ResourceString;
var ResourcePlural = tools.ResourcePlural;
var ResourceArray = tools.ResourceArray;

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

    this.locale = this.locale || (this.project && this.project.sourceLocale) || "en-US";
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
        locale: this.locale,
        context: this.context,
        datatype: this.type.getDataType(),
        flavor: this.flavor,
        commentPrefix: this.getCommentPrefix()
    });

    this.set = new TranslationSet(this.project.sourceLocale);
};

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
                basePlural = new ResourcePlural({
                    key: basekey,
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

            basePlural.addSourcePlural(category, resource.getSource());

            var target = resource.getTarget();
            if (target) {
                basePlural.addTargetPlural(category, target);
                basePlural.setTargetLocale(resource.getTargetLocale());
            }
        } else {
            // this is just a simple string resource
            stringSet.add(resource);
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
            var sourcePlurals = resource.getSource();
            var targetPlurals = resource.getTarget();
            var pluralCategories = Object.keys(targetPlurals ?? sourcePlurals).sort();
            pluralCategories.forEach(function(category) {
                var newres = new ResourceString({
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
                    newres.setTarget(targetPlurals[category]);
                    newres.setTargetLocale(resource.getTargetLocale());
                }
                filtered.add(newres);
            });
        } else {
            filtered.add(resource);
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
    var mapping = this.mapping || this.type.getMapping(this.pathName) || this.type.getDefaultMapping();

    return path.normalize(this.API.utils.formatPath(mapping.template, {
        sourcepath: this.pathName,
        locale: locale
    }));
};

/**
 *
 * @param {string} type type of the resource to create.
 * Must be one of "string", "array", or "plural"
 * @param {Object} options options to construct the new instance
 * @returns {Resource} a new resource instance
 * @private
 */
function testResourceFactory(type, options) {
    switch (type) {
        default:
        case 'string':
            return new ResourceString(options);
        case 'array':
            return new ResourceArray(options);
        case 'plural':
            return new ResourcePlural(options);
    }
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
        var source = resource.getSource();

        var tester = testResourceFactory(resource.getType(), {
            project: this.project.getProjectId(),
            sourceLocale: this.project.getSourceLocale(),
            source: resource.getSource(),
            reskey: reskey,
            pathName: this.pathName,
            datatype: this.type.datatype
        });
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
            if (translatedResource && this.API.utils.cleanString(translatedResource.getSource()) === this.API.utils.cleanString(source)) {
                this.logger.trace("Translation: " + translatedResource.getTarget());
                translation = translatedResource.getTarget();
            } else {
                var note = translatedResource ? 'The source string has changed. Please update the translation to match if necessary. Previous source: "' + translatedResource.getSource() + '"' : undefined;
                if (this.type) {
                    this.type.newres.add(new ResourceString({
                        project: this.project.getProjectId(),
                        key: reskey,
                        source: source,
                        sourceLocale: this.project.sourceLocale,
                        target: (translatedResource && translatedResource.getTarget()) || source,
                        targetLocale: locale,
                        pathName: this.pathName,
                        datatype: this.type.datatype,
                        state: "new",
                        flavor: this.flavor,
                        comment: note,
                        index: this.resourceIndex++
                    }));
                }
                this.logger.trace("Missing translation");
                translation = this.type && this.type.missingPseudo && !this.project.settings.nopseudo ?
                    this.type.missingPseudo.getString(source) : source;
            }
        }

        tester.setTarget(translation);
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
        this.logger.debug("Checking for existing output file " + pathName);

        try {
            p = path.join(this.project.root, pathName);
            if (fs.existsSync(p)) {
                var data = fs.readFileSync(p, "utf8");
                if (data) {
                    this.parseOutputFile(data);
                }
            }
        } catch (e) {
            this.logger.warn("Could not read file: " + p);
            this.logger.warn(e);
        }

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
