/*
 * MetaXmlFile.js - plugin to extract resources from a MetaXml source code file
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

var ilib = require("ilib");
var fs = require("fs");
var path = require("path");
var xmljs = require("xml-js");

var IString = require("ilib/lib/IString");
var Locale = require("ilib/lib/Locale");
var sfLocales = require("./sflocales.json");

var logger = {
    error: function() {},
    info: function() {},
    warn: function() {},
    debug: function() {},
    trace: function() {}
};

/**
 * Create a new java file with the given path name and within
 * the given project.
 *
 * @param {Project} project the project object
 * @param {String} pathName path to the file relative to the root
 * of the project file
 * @param {FileType} type the file type instance of this file
 */
var MetaXmlFile = function(options) {
    options = options || {};
    this.project = options.project;
    this.pathName = options.pathName;
    this.type = options.type;

    this.API = this.project.getAPI();

    if (typeof(this.API.getLogger) === "function") {
        logger = this.API.getLogger("loctool.lib.MetaXmlFileType");
    }

    this.set = this.API.newTranslationSet(this.project ? this.project.sourceLocale : "zxx-XX");
    this.mapping = this.type.getMapping(this.pathName);
    this.schema = this.mapping ? this.type.getSchema(this.mapping.schema) : this.type.getDefaultSchema();
    this.resourceIndex = 0;
    this.locale = new Locale(options.locale || "en-US");

    this.xmlFile = this.type.xmlFileType.newFile(this.pathName, {
        mapping: this.mapping
    });

    this.translationFile = this.isTranslationFile(this.pathName);
};

var reUnicodeChar = /\\u([a-fA-F0-9]{1,4})/g;
var reOctalChar = /\\([0-8]{1,3})/g;

/**
 * Unescape the string to make the same string that would be
 * in memory in the target programming language. This includes
 * unescaping both special and Unicode characters.
 *
 * @static
 * @param {String} string the string to unescape
 * @returns {String} the unescaped string
 */
MetaXmlFile.unescapeString = function(string) {
    var unescaped = string;

    while ((match = reUnicodeChar.exec(unescaped))) {
        if (match && match.length > 1) {
            var value = parseInt(match[1], 16);
            unescaped = unescaped.replace(match[0], IString.fromCodePoint(value));
            reUnicodeChar.lastIndex = 0;
        }
    }

    while ((match = reOctalChar.exec(unescaped))) {
        if (match && match.length > 1) {
            var value = parseInt(match[1], 8);
            unescaped = unescaped.replace(match[0], IString.fromCodePoint(value));
            reOctalChar.lastIndex = 0;
        }
    }

    unescaped = unescaped.
        replace(/^\\\\/g, "\\").
        replace(/([^\\])\\\\/g, "$1\\").
        replace(/\\'/g, "'").
        replace(/\\"/g, '"');

    return unescaped;
};

/**
 * Clean the string to make a source string. This means
 * removing leading and trailing white space, compressing
 * whitespaces, and unescaping characters. This changes
 * the string from what it looks like in the source
 * code.
 *
 * @static
 * @param {String} string the string to clean
 * @returns {String} the cleaned string
 */
MetaXmlFile.cleanString = function(string) {
    var unescaped = MetaXmlFile.unescapeString(string);

    unescaped = unescaped.
        replace(/\\[btnfr]/g, " ").
        replace(/[ \n\t\r\f]+/g, " ").
        trim();

    return unescaped;
};


/**
 * Make a new key for the given string. This must correspond
 * exactly with the code in htglob jar file so that the
 * resources match up. See the class IResourceBundle in
 * this project under the java directory for the corresponding
 * code.
 *
 * @private
 * @param {String} source the source string to make a resource
 * key for
 * @returns {String} a unique key for this string
 */
MetaXmlFile.prototype.makeKey = function(source) {
    return this.API.utils.hashKey(MetaXmlFile.cleanString(source));
};

MetaXmlFile.prototype.isTranslationFile = function(pathName) {
    return !pathName || pathName.endsWith(".translation-meta.xml");
};

MetaXmlFile.prototype.addResource = function(res) {
    logger.trace("MetaXmlFile.addResource: " + JSON.stringify(res) + " to " + this.project.getProjectId() + ", " + this.locale + ", " + JSON.stringify(this.context));
    if (this.translationFile) {
        var ourResource = this.set.get(res.hashKey());
        if (!ourResource) {
            this.set.add(res);
        } else {
            switch (res.getType()) {
                default:
                case "string":
                    if (!ourResource.getSource()) {
                        ourResource.setSource(res.getSource());
                    }
                    break;
                case "plural":
                    if (!ourResource.getSourcePlurals()) {
                        ourResource.setSourcePlurals(res.getSourcePlurals());
                    }
                    break;
                case "array":
                    if (!ourResource.getSourceArray()) {
                        ourResource.setSourceArray(res.getSourceArray());
                    }
                    break;
            }
        }
    } // else do not add a resource to a non translation file
};

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 * @param {String} data the string to parse
 */
MetaXmlFile.prototype.parse = function(data) {
    logger.debug("Extracting strings from " + this.pathName);

    this.xmlFile.parse(data);
    if (this.translationFile) {
        var xmlSet = this.xmlFile.getTranslationSet();
        if (xmlSet.size() > 0) {
            this.set.addSet(xmlSet);
            // clean = no resources added yet
            this.set.setClean();
        }
    }
};

/**
 * Extract all the localizable strings from the meta xml file and add them to the
 * project's translation set.
 */
MetaXmlFile.prototype.extract = function() {
    logger.debug("Extracting strings from " + this.pathName);
    if (this.pathName) {
        var p = this.type.smartJoin(this.project.root, this.pathName);
        try {
            var data = fs.readFileSync(p, "utf8");
            if (data) {
                this.parse(data);
            }
        } catch (e) {
            logger.warn("Could not read file: " + p);
            logger.warn(e);
        }
    }
};

/**
 * Return the set of resources found in the current MetaXml file.
 *
 * @returns {TranslationSet} The set of resources found in the
 * current MetaXml file.
 */
MetaXmlFile.prototype.getTranslationSet = function() {
    if (this.set.size() === 0 && this.xmlFile.set.size() > 0) {
        this.set.addSet(this.xmlFile.set);
    }
    return this.set;
}

/**
 * Return the location on disk where the version of this file localized
 * for the given locale should be written.
 * @param {String] locale the locale spec for the target locale
 * @returns {String} the localized path name
 */
MetaXmlFile.prototype.getLocalizedPath = function(locale) {
    return this.type.getResourceFilePath(locale);
};

/**
 * Localize the text of the current file to the given locale and return
 * the results.
 *
 * @param {TranslationSet} translations the current set of translations
 * @param {String} locale the locale to translate to
 * @returns {String} the localized text of this file
 */
MetaXmlFile.prototype.localizeText = function(translations, locale) {
    return this.translationFile && this.xmlFile.localizeText(translations, locale);

/*
    var output = {
        _declaration: {
            _attributes: {
                version: "1.0",
                encoding: "UTF-8"
            }
        },
        Translations: {
            _attributes: {
                 xmlns: "http://soap.sforce.com/2006/04/metadata"
            }
        }
    };
    var resources = this.set.getAll();
    var reportTypes = {}, key, type;

    for (var i = 0; i < resources.length; i++) {
        var resource = resources[i];
        var hashkey = resource.hashKeyForTranslation(locale);
        var translated = translations.getClean(hashkey);
        if (!translated) {
            // new string
            var translated = this.API.newResource(resource);
            translated.target = translated.source;
            translated.targetLocale = locale;
            translated.state = "new";
            translated.index = this.resourceIndex++;
            this.type.newres.add(translated);
            if (this.type && this.type.missingPseudo && !this.project.settings.nopseudo) {
                translated = this.API.newResource(translated);
                translated.target = this.type.missingPseudo.getString(resource.source);
            }
        }

        if (typeof output.Translations[translated.context] === 'undefined') {
            output.Translations[translated.context] = [];
        }
        if (translated.context.startsWith("reportTypes")) {
            if (translated.context === "reportTypes") {
                if (translated.reskey.endsWith(".description")) {
                    key = translated.reskey.substring(0, translated.reskey.length - 12);
                    if (!reportTypes[key]) {
                        reportTypes[key] = {};
                    }
                    type = reportTypes[key];
                    type.description = {
                        _text: translated.target
                    };
                } else {
                    key = translated.reskey;
                    if (!reportTypes[key]) {
                        reportTypes[key] = {};
                    }
                    type = reportTypes[key];
                    type.label = {
                        _text: translated.target
                    };
                    type.name = {
                        _text: translated.reskey
                    };
                }
            } else {
                var parts = translated.reskey.split(/\./g);
                mainkey = parts[0];
                key = parts[1];

                if (!reportTypes[mainkey]) {
                    reportTypes[mainkey] = {};
                }
                type = reportTypes[mainkey];
                if (!type.sections) {
                    type.sections = [];
                }

                type.sections.push({
                    label: {
                        _text: translated.target
                    },
                    name: {
                        _text: key
                    }
                });
            }
        } else {
            output.Translations[translated.context].push({
                label: {
                    _text: translated.target
                },
                name: {
                    _text: translated.reskey
                }
            });
        }
    }
    var types = Object.keys(reportTypes);
    types.forEach(function(type) {
        output.Translations.reportTypes.push(reportTypes[type]);
    });

    return xmljs.json2xml(output, {
        spaces: 4,
        compact: true
    }) + '\n';
*/
};

/**
 * Localize the contents of this HTML file and write out the
 * localized HTML file to a different file path.
 *
 * @param {TranslationSet} translations the current set of
 * translations
 * @param {Array.<String>} locales array of locales to translate to
 */
MetaXmlFile.prototype.localize = function(translations, locales) {
    // don't localize these files individually. Instead, wait until
    // all of the files have been read and then use MetaXmlFileType.write()
    // to find all of the non translation files and distribute their
    // resources to the translation files, then write out each translation
    // file

    /*
    // don't localize if there is no text
    if (this.set.size() > 0 && translations && translations.size() > 0 && locales && locales.length > 0) {
        for (var i = 0; i < locales.length; i++) {
            if (!this.project.isSourceLocale(locales[i])) {
                // skip variants for now until we can handle them properly
                var l = new Locale(locales[i]);
                if (!l.getVariant()) {
                    var pathName = this.getLocalizedPath(locales[i]);
                    logger.debug("Writing file " + pathName);
                    var p = this.type.smartJoin(this.project.target, pathName);
                    var d = path.dirname(p);
                    this.API.utils.makeDirs(d);

                    fs.writeFileSync(p, this.localizeText(translations, locales[i]), "utf-8");
                }
            }
        }
    } else {
        logger.debug(this.pathName + ": No strings, no localize");
    }
    */
};

MetaXmlFile.prototype.write = function() {
    logger.trace("writing resource file. [" + [this.project.getProjectId(), this.locale].join(", ") + "]");
    if (this.set.isDirty()) {
        var dir;

        if (!this.pathName) {
            this.pathName = this.type.getResourceFilePath(this.locale || this.project.sourceLocale, undefined, "xml", this.flavor);
        }

        var p = this.type.smartJoin(this.project.target, this.pathName);
        dir = path.dirname(p);

        var resources = this.set.getAll();

        logger.info("Writing properties file for locale " + this.locale + " to file " + this.pathName);

        var content = this.getContent();

        this.API.utils.makeDirs(dir);

        fs.writeFileSync(p, content, "utf8");
        logger.debug("Wrote string translations to file " + this.pathName);
    } else {
        logger.debug("File " + this.pathName + " is not dirty. Skipping.");
    }
};

module.exports = MetaXmlFile;
