/*
 * MdxFileType.js - Represents a collection of Mdx files
 *
 * Copyright © 2025, Box, Inc.
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
var mm = require("micromatch");
var MdxFile = require("./MdxFile.js");
var YamlFileType = require('ilib-loctool-yaml');

var MdxFileType = function(project) {
    this.type = "md";
    this.datatype = "mdx";
    this.project = project;
    this.API = project.getAPI();

    this.logger = this.API.getLogger("loctool.lib.MdxFileType");

    // default extensions
    this.extensions = [ ".mdx", ".md" ];

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

    this.fileInfo = {
        translated: [],
        untranslated: []
    }

    this.yamlFileType = new YamlFileType(this.project);
};

/**
 * Initialize the file type. This is called by the loctool's Project.init()
 * method to allow file types to perform async initialization (e.g., loading
 * ESM-only packages like remark-mdx).
 * 
 * @param {Function} cb callback function to call when initialization is complete
 */
MdxFileType.prototype.init = function(cb) {
    var MdxFile = require("./MdxFile.js");
    
    // Initialize the remark-mdx parser (ESM-only package)
    MdxFile.initMdxParser(function(err) {
        if (err) {
            this.logger.error("Failed to initialize remark-mdx parser: " + err.message);
            this.logger.error(err);
            // Continue anyway - the error will be caught when parse() is called
        }
        cb();
    }.bind(this));
};

var defaultMappings = {
    "**/*.mdx": {
        template: "[locale]/[dir]/[filename]"
    }
};

/**
 * Return the mapping corresponding to this path.
 * @param {String} pathName the path to check
 * @returns {Object} the mapping object corresponding to the
 * path or undefined if none of the mappings match
 */
MdxFileType.prototype.getMapping = function(pathName) {
    if (typeof(pathName) === "undefined") {
        return undefined;
    }
    var mappings, match, mdSettings = this.project.settings && this.project.settings.mdx;
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

MdxFileType.prototype.getDefaultMapping = function() {
    return defaultMappings["**/*.mdx"];
}

var alreadyLoc = new RegExp(/(^|\/)(([a-z][a-z])(-[A-Z][a-z][a-z][a-z])?(-([A-Z][A-Z])(-[A-Z]+)?)?)\//);

/**
 * Return true if the given path is an Mdx template file and is handled
 * by the current file type.
 *
 * @param {String} pathName path to the file being questions
 * @returns {boolean} true if the path is a java file, or false
 * otherwise
 */
MdxFileType.prototype.handles = function(pathName) {
    this.logger.debug("MdxFileType handles " + pathName + "?");
    var extension = path.extname(pathName).toLowerCase();
    var ret = (this.extensions.indexOf(extension) > -1);
    var normalized = pathName;

    if (ret) {
        var match = alreadyLoc.exec(pathName);
        if (match && match.length > 2) {
            if (this.API.utils.iso639[match[3]]) {
                if (match.length < 6 || !match[6] || !this.API.utils.iso3166[match[6]]) {
                    ret = true;
                } else {
                    ret = (match[2] === this.project.sourceLocale);
                }
            } else {
                ret = true;
            }
        }
    }

    if (ret) {
        // normalize the extension so the matching below can work
        normalized = pathName.substring(0, pathName.lastIndexOf('.')) + ".mdx";
    }

    // If it has the right filename extension, then match at least one of the mapping
    // patterns. If it isn't in a mapping, we don't handle it.
    if (ret) {
        ret = false;
        // first check if it is a source file
        var mdSettings = this.project.settings && this.project.settings.mdx;
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
                        if (locale && locale !== this.project.sourceLocale) {
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

MdxFileType.prototype.name = function() {
    return "Mdx File Type";
};

/**
 * Write out the aggregated resources for this file type. In
 * some cases, the string are written out to a common resource
 * file, and in other cases, to a type-specific resource file.
 * In yet other cases, nothing is written out, as the each of
 * the files themselves are localized individually, so there
 * are no aggregated strings.
 */
MdxFileType.prototype.write = function() {
    // templates are localized individually, so we don't have to
    // write out the resources
};

MdxFileType.prototype.newFile = function(path, options) {
    return new MdxFile({
        project: this.project,
        pathName: path,
        type: this,
        targetLocale: options && options.locale
    });
};

MdxFileType.prototype.getDataType = function() {
    return this.datatype;
};

MdxFileType.prototype.getResourceTypes = function() {
    return {};
};

MdxFileType.prototype.getExtensions = function() {
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
MdxFileType.prototype.getExtracted = function() {
    return this.extracted;
};

/**
 * Add the contents of the given translation set to the extracted resources
 * for this file type.
 *
 * @param {TranslationSet} set set of resources to add to the current set
 */
MdxFileType.prototype.addSet = function(set) {
    this.extracted.addSet(set);
};

/**
 * Return the translation set containing all of the new
 * resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * new resources
 */
MdxFileType.prototype.getNew = function() {
    // get the new strings from the front matter and the file itself and
    // put them together
    var set = this.API.newTranslationSet(this.project.getSourceLocale());
    set.addSet(this.yamlFileType.getNew());
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
MdxFileType.prototype.getPseudo = function() {
    // get the pseudo strings from the front matter and the file itself and
    // put them together
    var set = this.API.newTranslationSet(this.project.getSourceLocale());
    set.addSet(this.yamlFileType.getPseudo());
    set.addSet(this.pseudo);
    return set;
};

MdxFileType.prototype.addTranslationStatus = function(fileInfo) {
    if (fileInfo.fullyTranslated) {
        this.fileInfo.translated.push(fileInfo.path);
    } else {
        this.fileInfo.untranslated.push(fileInfo.path);
    }
};

MdxFileType.prototype.projectClose = function() {
    if (this.project.settings && this.project.settings.mdx && this.project.settings.mdx.fullyTranslated) {
        var fileName = path.join(this.project.root, "translation-status.json");
        fs.writeFileSync(fileName, JSON.stringify(this.fileInfo, undefined, 4), "utf-8");
    }
};

/**
 * @private
 */
MdxFileType.prototype.getYamlFileType = function() {
    return this.yamlFileType;
};

module.exports = MdxFileType;
