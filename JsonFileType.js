/*
 * JsonFileType.js - Represents a collection of json files
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

var fs = require("fs");
var path = require("path");
var ilib = require("ilib");
var Locale = require("ilib/lib/Locale.js");
var log4js = require("log4js");
var mm = require("micromatch");
var JsonFile = require("./JsonFile.js");

var logger = log4js.getLogger("loctool.plugin.JsonFileType");

var JsonFileType = function(project) {
    this.type = "json";
    this.datatype = "json";

    this.project = project;
    this.API = project.getAPI();

    this.extensions = [ ".json", ".jso", ".jsn" ];

    this.extracted = this.API.newTranslationSet(project.getSourceLocale());
    this.newres = this.API.newTranslationSet(project.getSourceLocale());
    this.pseudo = this.API.newTranslationSet(project.getSourceLocale());

    this.pseudos = {};

    // generate all the pseudo bundles we'll need
    project.locales && project.locales.forEach(function(locale) {
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
 * Return true if the given path is an Json template file and is handled
 * by the current file type.
 *
 * @param {String} pathName path to the file being questions
 * @returns {boolean} true if the path is a java file, or false
 * otherwise
 */
JsonFileType.prototype.handles = function(pathName) {
    logger.debug("JsonFileType handles " + pathName + "?");
    var ret = false;
    var normalized = pathName;

    if (pathName.length > 4 &&
        (pathName.substring(pathName.length - 4) === ".jso" || pathName.substring(pathName.length - 4) === ".jsn")) {
        ret = true;
        // normalize the extension so the matching below can work
        normalized = pathName.substring(0, pathName.length - 4) + ".json";
    }

    if (!ret) {
        ret = pathName.length > 5 && pathName.substring(pathName.length - 5) === ".json";
    }

    // now match at least one of the mapping patterns
    if (ret) {
        ret = false;
        // first check if it is a source file
        var jsonSettings = this.project.settings.json;
        var defaultMappings = {
            "**/*.json": {
                template: "[dir]/[localeDir]/strings.json"
            }
        };
        var mappings = (jsonSettings && jsonSettings.mappings) ? jsonSettings.mappings : defaultMappings;
        var patterns = Object.keys(mappings);
        ret = mm.isMatch(pathName, patterns) || mm.isMatch(normalized, patterns);

        // now check if it is an already-localized file, and if it has a different locale than the
        // source locale, then we don't need to extract those strings
        if (ret) {
            for (var i = 0; i < patterns.length; i++) {
                var locale = this.getLocaleFromPath(mappings[patterns[i]].template, pathName);
                if (locale && locale !== this.project.sourceLocale) {
                    ret = false;
                    break;
                }
            }
        }
    }
    logger.debug(ret ? "Yes" : "No");
    return ret;
};

JsonFileType.prototype.name = function() {
    return "Json File Type";
};

var matchExprs = {
    "dir": ".*?",
    "locale": "(?<language>[a-z][a-z][a-z]?)(-(?<script>[A-Z][a-z][a-z][a-z]))?(-(?<region>[A-Z][A-Z]|[0-9][0-9][0-9]))?",
    "language": "(?<language>[a-z][a-z][a-z]?)",
    "script": "(?<script>[A-Z][a-z][a-z][a-z])",
    "region": "(?<region>[A-Z][A-Z]|[0-9][0-9][0-9])",
    "localeDir": "(?<language>[a-z][a-z][a-z]?)(/(?<script>[A-Z][a-z][a-z][a-z]))?(/(?<region>[A-Z][A-Z]|[0-9][0-9][0-9]))?",
    "localeUnder": "(?<language>[a-z][a-z][a-z]?)(_(?<script>[A-Z][a-z][a-z][a-z]))?(_(?<region>[A-Z][A-Z]|[0-9][0-9][0-9]))?",
};

/**
 * Return a locale encoded in the path using template to parse that path.
 * @param {String} template template for the output file
 * @param {String} pathname path to the source file
 * @returns {String} the locale within the path
 */
JsonFileType.prototype.getLocaleFromPath = function(template, pathname) {
    var regex = "";

    for (var i = 0; i < template.length; i++) {
        if ( template[i] !== '[' ) {
            regex += template[i];
        } else {
            var start = ++i;
            while (i < template.length && template[i] !== ']') {
                i++;
            }
            var keyword = template.substring(start, i);
            switch (keyword) {
                case 'filename':
                    regex += path.basename(pathname);
                    break;
                case 'basename':
                    regex += path.basename(pathname, ".json");
                    break;
                default:
                    regex += matchExprs[keyword];
                    break;
            }
        }
    }

    var re = new RegExp(regex, "u");
    var match;

    if ((match = re.exec(pathname)) !== null) {
        var groups = match.groups;
        if (groups) {
            var l = new Locale(groups.language, groups.region, undefined, groups.script);
            return l.getSpec();
        }
    }

    return "";
};

/**
 * Return the location on disk where the version of this file localized
 * for the given locale should be written.
 * @param {String} template template for the output file
 * @param {String} pathname path to the source file
 * @param {String} locale the locale spec for the target locale
 * @returns {String} the localized path name
 */
JsonFileType.prototype.getLocalizedPath = function(template, pathname, locale) {
    var output = "";
    var l = new Locale(locale);

    for (var i = 0; i < template.length; i++) {
        if ( template[i] !== '[' ) {
            output += template[i];
        } else {
            var start = ++i;
            while (i < template.length && template[i] !== ']') {
                i++;
            }
            var keyword = template.substring(start, i);
            switch (keyword) {
                case 'dir':
                    output += path.dirname(pathname);
                    break;
                case 'filename':
                    output += path.basename(pathname);
                    break;
                case 'basename':
                    output += path.basename(pathname, ".json");
                    break;
                default:
                case 'locale':
                    output += locale;
                    break;
                case 'language':
                    output += l.getLanguage();
                    break;
                case 'script':
                    output += l.getScript();
                    break;
                case 'region':
                    output += l.getRegion();
                    break;
                case 'localeDir':
                    output += l.getSpec().replace(/-/g, '/');
                    break;
                case 'localeUnder':
                    output += l.getSpec().replace(/-/g, '_');
                    break;
            }
        }
    }

    return output;
};

/**
 * Write out the aggregated resources for this file type. In
 * some cases, the string are written out to a common resource
 * file, and in other cases, to a type-specific resource file.
 * In yet other cases, nothing is written out, as the each of
 * the files themselves are localized individually, so there
 * are no aggregated strings.
 */
JsonFileType.prototype.write = function() {
    // templates are localized individually, so we don't have to
    // write out the resources
};

JsonFileType.prototype.newFile = function(path) {
    return new JsonFile({
        project: this.project,
        pathName: path,
        type: this
    });
};

JsonFileType.prototype.getDataType = function() {
    return this.datatype;
};

JsonFileType.prototype.getResourceTypes = function() {
    return {};
};

JsonFileType.prototype.getExtensions = function() {
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
JsonFileType.prototype.getExtracted = function() {
    return this.extracted;
};

/**
 * Add the contents of the given translation set to the extracted resources
 * for this file type.
 *
 * @param {TranslationSet} set set of resources to add to the current set
 */
JsonFileType.prototype.addSet = function(set) {
    this.extracted.addSet(set);
};

/**
 * Return the translation set containing all of the new
 * resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * new resources
 */
JsonFileType.prototype.getNew = function() {
    return this.newres;
};

/**
 * Return the translation set containing all of the pseudo
 * localized resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * pseudo localized resources
 */
JsonFileType.prototype.getPseudo = function() {
    return this.pseudo;
};

module.exports = JsonFileType;
