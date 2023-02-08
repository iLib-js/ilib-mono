/*
 * OpenAPIFile.js - Represents a collection of json files
 *
 * Copyright © 2021, Box, Inc.
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

var path = require('path');
var fs = require('fs');

var JsonFile = require('ilib-loctool-json/JsonFile');
var MarkdownFile = require('ilib-loctool-ghfm/MarkdownFile');
var Locale = require('ilib/lib/Locale.js');

var OpenAPIFile = function(options) {
    this.pathName = path.normalize(options.pathName || "");
    this.project = options.project;
    this.targetLocale = options.targetLocale;

    options.jsonFileType = options.jsonFileType || options.type.jsonFileType;
    if (!options.jsonFileType) {
        if (options.type && options.type.jsonFileType) {
            options.jsonFileType = options.type.jsonFileType;
        } else {
            throw new Error('jsonFileType is not provided. Can not instantiate OpenAPIFile object');
        }
    }

    if (!options.markdownFileType) {
        if (options.type && options.type.markdownFileType) {
            options.markdownFileType = options.type.markdownFileType;
        } else {
            throw new Error('markdownFileType is not provided. Can not instantiate OpenAPIFile object');
        }
    }

    this.API = options.project.getAPI();
    this.type = options.type;

    this.jsonSet = this.API.newTranslationSet(this.project ? this.project.sourceLocale : 'zxx-XX');
    this.markdownSet = this.API.newTranslationSet(this.project ? this.project.sourceLocale : 'zxx-XX');

    options.type = options.jsonFileType;
    this.jsonFile = new JsonFile(options);

    options.type = options.markdownFileType;
    this.markdownFile = new MarkdownFile(options);

    this.logger = this.API.getLogger('loctool.plugin.OpenAPIFile');
}

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 *
 * Consists of two steps:
 * 1. Parse JSON structure with json parser
 * 2. Parse results of JSON parsing with markdown parser
 *
 * @param {String} data the string to parse
 */
OpenAPIFile.prototype.parse = function(data) {
    this.parseJson(data);
    this.parseMarkdown();
}
/**
 * Parse JSON data using ilib-loctool-json plugin.
 *
 * @private
 * @param {String} data the string to parse
 */
OpenAPIFile.prototype.parseJson = function(data) {
    this.jsonFile.parse(data);

    this.jsonSet = this.jsonFile.getTranslationSet();
}
/**
 * Parse JSON resources using ilib-loctool-ghfm plugin and get
 * final TranslationSet.
 *
 * @private
 */
OpenAPIFile.prototype.parseMarkdown = function() {
    // iterate through this.jsonSet and send strings to Markdown parse
    // Then update set based on the result from MD parser
    this.jsonSet.getAll().forEach(function(res) {
        if (res.resType === 'string') {
            this.markdownFile.parse(res.source);

            this.markdownSet.addSet(this.markdownFile.getTranslationSet());
            this.markdownFile.getTranslationSet().clear();
            this.markdownFile.comment = undefined;
        } else {
            // Any other type of resource but string should be added
            // to the resultion resource set right away without MD parsing
            this.markdownSet.add(res);
        }
    }.bind(this));
}

/**
 * Return the set of resources found in the current file.
 *
 * @returns {TranslationSet} The set of resources found in the
 * current file.
 */
OpenAPIFile.prototype.getTranslationSet = function() {
    return this.markdownSet;
}
/**
 * Return hashed key for a provided input string.
 *
 * @param {String} source string input to hash
 * @returns {String} a has key
 */
OpenAPIFile.prototype.makeKey = function(source) {
    return this.API.utils.hashKey(MarkdownFile.cleanString(source));
}

/**
 * Extract all the localizable strings from the Json file and add them to the
 * project's translation set.
 */
OpenAPIFile.prototype.extract = function() {
    this.logger.info('Extracting strings from ' + this.pathName);
    if (this.pathName) {
        var p = path.join(this.project.root, this.pathName);
        try {
            var data = fs.readFileSync(p, 'utf8');
            if (data) {
                this.parse(data);
            }
        }
        catch (e) {
            this.logger.warn('Could not read file: ' + p);
            this.logger.warn(e);
        }
    }
};
/**
 * Localize the contents of this OpenAPI file and write out the
 * localized OpenAPI file to a different file path.
 *
 * @param {TranslationSet} translations the current set of
 * translations
 * @param {Array.<String>} locales array of locales to translate to
 */
OpenAPIFile.prototype.localize = function(translations, locales) {
    // don't localize if there is no text
    for (var i = 0; i < locales.length; i++) {
        if (!this.project.isSourceLocale(locales[i])) {
            // skip variants for now until we can handle them properly
            var l = new Locale(locales[i]);
            if (!l.getVariant()) {
                var pathName = this.getLocalizedPath(locales[i]);
                this.logger.info('Writing file ' + pathName);
                var p = path.join(this.project.target, pathName);
                var d = path.dirname(p);
                this.API.utils.makeDirs(d);

                fs.writeFileSync(p, this.localizeText(translations, locales[i]), 'utf-8');
            }
        }
    }
}

/**
 * Return the location on disk where the version of this file localized
 * for the given locale should be written.
 *
 * @param {String} locale the locale spec for the target locale
 * @returns {String} the localized path name
 */
OpenAPIFile.prototype.getLocalizedPath = function(locale) {
    return this.jsonFile.getLocalizedPath(locale);
}

/**
 * Localize the text of the current file to the given locale and return
 * the results.
 *
 * @param {TranslationSet} translations the current set of translations
 * @param {String} locale the locale to translate to
 * @returns {String} the localized text of this file
 */
OpenAPIFile.prototype.localizeText = function(translations, locale) {
    var jsonTranslationSet = this.API.newTranslationSet(this.project ? this.project.sourceLocale : 'zxx-XX');

    this.jsonSet.getAll().forEach(function(res) {
        if (res.resType === 'string') {
            this.markdownFile.parse(res.source);
            var localizedMarkdown = this.markdownFile.localizeText(translations, locale)

            // Remove trailing new line as markdown always appends it to the end of the string.
            localizedMarkdown = localizedMarkdown.replace(/\n$/, '');

            res.setTarget(localizedMarkdown);
            res.setTargetLocale(locale);
            jsonTranslationSet.add(res);
        } else {
            // Any other type of resource but string should be added
            // to the json resource set right away without MD parsing
            var translatedResource = translations.get(res.hashKeyForTranslation(locale));

            if (translatedResource) {
                jsonTranslationSet.add(translatedResource);
            }
        }
    }.bind(this));

    return this.jsonFile.localizeText(jsonTranslationSet, locale);
}

module.exports = OpenAPIFile;
