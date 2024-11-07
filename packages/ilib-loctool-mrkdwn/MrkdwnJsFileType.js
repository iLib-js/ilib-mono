/*
 * MrkdwnJsFileType.js - Represents a collection of Mrkdwn files
 *
 * Copyright © 2024, Box, Inc.
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

var Locale = require("ilib/lib/Locale.js");
var path = require("path");
var mm = require("micromatch");
var MrkdwnJsFile = require("./MrkdwnJsFile.js");

var MrkdwnJsFileType = function(project) {
    this.type = "mrkdwn";
    this.datatype = "mrkdwn";
    this.project = project;
    this.API = project.getAPI();

    this.logger = this.API.getLogger("loctool.lib.MrkdwnJsFileType");

    this.extensions = [ ".js" ];

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
        template: "[dir]/[basename]_[locale].js"
    }
};

/**
 * Return the mapping corresponding to this path.
 * @param {String} pathName the path to check
 * @returns {Object} the mapping object corresponding to the
 * path or undefined if none of the mappings match
 */
MrkdwnJsFileType.prototype.getMapping = function(pathName) {
    if (typeof(pathName) === "undefined") {
        return undefined;
    }
    var mappings, match, mdSettings = this.project.settings && this.project.settings.mrkdwn;
    if (mdSettings) {
        mappings = mdSettings.mappings || defaultMappings;
        var patterns = Object.keys(mappings);

        if (patterns) {
            match = patterns.find(function(pattern) {
                return mm.isMatch(pathName, pattern);
            });
        }
    }

    return match && mappings[match];
}

MrkdwnJsFileType.prototype.getDefaultMapping = function() {
    return defaultMappings["**/*.js"];
}

var alreadyLoc = new RegExp(/(^|\/)(([a-z][a-z])(-[A-Z][a-z][a-z][a-z])?(-([A-Z][A-Z])(-[A-Z]+)?)?)\//);

/**
 * Return true if the given path is an Mrkdwn template file and is handled
 * by the current file type.
 *
 * @param {String} pathName path to the file being questions
 * @returns {boolean} true if the path is a java file, or false
 * otherwise
 */
MrkdwnJsFileType.prototype.handles = function(pathName) {
    this.logger.debug("MrkdwnJsFileType handles " + pathName + "?");
    var extension = path.extname(pathName).toLowerCase();
    var ret = (this.extensions.indexOf(extension) > -1);
    var normalized = pathName;

    if (ret) {
        // see if this file contains a locale spec, which means it is an already
        // localized file that we don't need to re-localize
        var match = alreadyLoc.exec(pathName);
        if (match) {
            var wholeRegexMatches = match.length > 2;
            var wholeLocaleSpec = match[2];
            var languageMatch = match[3];
            var regionMatch = match[6];
            if (wholeRegexMatches) {
                if (this.API.utils.iso639[languageMatch]) {
                    if (match.length < 6 || !regionMatch || !this.API.utils.iso3166[regionMatch]) {
                        ret = true;
                    } else {
                        ret = (wholeLocaleSpec === this.project.sourceLocale);
                    }
                } else {
                    ret = true;
                }
            }
        }
    }

    if (ret) {
        // normalize the extension so the matching below can work
        normalized = pathName.substring(0, pathName.lastIndexOf('.')) + ".js";
    }

    // If it has the right filename extension, then match at least one of the mapping
    // patterns. If it isn't in a mapping, we don't handle it.
    if (ret) {
        ret = false;
        // first check if it is a source file
        var mdSettings = this.project.settings && this.project.settings.mrkdwn;
        if (mdSettings) {
            var mappings = mdSettings.mappings || defaultMappings;
            var patterns = Object.keys(mappings);
            if (patterns) {
                ret = mm.isMatch(pathName, patterns) || mm.isMatch(normalized, patterns);

                // now check if it is an already-localized file, and if it has a different locale than the
                // source locale, then we don't need to extract those strings
                if (ret) {
                    for (var i = 0; i < patterns.length; i++) {
                        var locale = this.API.utils.getLocaleFromPath(mappings[patterns[i]].template, pathName);
                        var loc = new Locale(locale);
                        if (locale && loc.isValid() && locale !== this.project.sourceLocale) {
                            ret = false;
                            break;
                        }
                    }
                }
            }
        }
    }

    this.logger.debug(ret ? "Yes" : "No");
    return ret;
};

MrkdwnJsFileType.prototype.name = function() {
    return "Mrkdwn File Type";
};

/**
 * Write out the aggregated resources for this file type. In
 * some cases, the string are written out to a common resource
 * file, and in other cases, to a type-specific resource file.
 * In yet other cases, nothing is written out, as the each of
 * the files themselves are localized individually, so there
 * are no aggregated strings.
 */
MrkdwnJsFileType.prototype.write = function() {
    // files are localized individually, so we don't have to
    // write out the resources
};

MrkdwnJsFileType.prototype.newFile = function(path, options) {
    return new MrkdwnJsFile({
        project: this.project,
        pathName: path,
        type: this,
        targetLocale: options && options.locale
    });
};

MrkdwnJsFileType.prototype.getDataType = function() {
    return this.datatype;
};

MrkdwnJsFileType.prototype.getResourceTypes = function() {
    return {};
};

MrkdwnJsFileType.prototype.getExtensions = function() {
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
MrkdwnJsFileType.prototype.getExtracted = function() {
    return this.extracted;
};

/**
 * Add the contents of the given translation set to the extracted resources
 * for this file type.
 *
 * @param {TranslationSet} set set of resources to add to the current set
 */
MrkdwnJsFileType.prototype.addSet = function(set) {
    this.extracted.addSet(set);
};

/**
 * Return the translation set containing all of the new
 * resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * new resources
 */
MrkdwnJsFileType.prototype.getNew = function() {
    // get the new strings from the front matter and the file itself and
    // put them together
    var set = this.API.newTranslationSet(this.project.getSourceLocale());
    set.addSet(this.newres);
    return set;
};

/**
 * Return the translation set containing all of the pseudo
 * localized resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * pseudo localized resources
 */
MrkdwnJsFileType.prototype.getPseudo = function() {
    // get the pseudo strings from the front matter and the file itself and
    // put them together
    var set = this.API.newTranslationSet(this.project.getSourceLocale());
    set.addSet(this.pseudo);
    return set;
};

MrkdwnJsFileType.prototype.projectClose = function() {
};

module.exports = MrkdwnJsFileType;
