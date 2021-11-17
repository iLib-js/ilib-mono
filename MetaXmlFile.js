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
var log4js = require("log4js");
var xmljs = require("xml-js");

var IString = require("ilib/lib/IString");
var Locale = require("ilib/lib/Locale");
var sfLocales = require("./sflocales.json");

var logger = log4js.getLogger("loctool.lib.MetaXmlFile");

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

    this.set = this.API.newTranslationSet(this.project ? this.project.sourceLocale : "zxx-XX");
    this.mapping = this.type.getMapping(this.pathName);
    this.schema = this.mapping ? this.type.getSchema(this.mapping.schema) : this.type.getDefaultSchema();
    this.resourceIndex = 0;

    this.xmlFile = this.type.xmlFileType.newFile(this.pathName, {
        mapping: this.mapping
    });
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

var skipProperties = {
    "_attributes": true,
    "_declaration": true
};

MetaXmlFile.prototype.addResource = function(key, text, comment, autoKey, context) {
    if (!this.API.utils.isDNT(comment)) {
        if (!key) {
            key = this.makeKey(text);
            autoKey = true;
        }
        var res = this.API.newResource({
            datatype: this.type.datatype,
            resType: "string",
            key: key,
            source: text,
            pathName: this.pathName,
            sourceLocale: this.locale || this.sourceLocale,
            project: this.project.getProjectId(),
            autoKey: autoKey,
            comment: comment,
            dnt: this.API.utils.isDNT(comment),
            index: this.resourceIndex++,
            context: context
        });
        this.set.add(res);
        this.dirty = true;
    }
};

function textOrComment(node) {
    return (node._text && node._text.trim()) || (node._comment && node._comment.trim());
}

MetaXmlFile.prototype.handleCustom = function(context, subnode) {
    var text, key, comment, autoKey;

    if (subnode.name && subnode.name._text) {
        key = subnode.name._text.trim();
        autoKey = false;
    }

    comment = subnode._comment && subnode._comment.trim();

    if (subnode.label) {
        text = textOrComment(subnode.label);
        if (text && text.length) {
            if (subnode._attributes) {
                comment = subnode._attributes["x-i18n"];
            }
            logger.trace("Found resource type " + context + " with string " + text + " and comment " + comment);
            this.addResource(key, text, comment, autoKey, context);
        }
    }

    if (subnode.description) {
        text = textOrComment(subnode.description);
        if (text && text.length) {
            if (subnode._attributes) {
                comment = subnode._attributes["x-i18n"];
            }
            logger.trace("Found resource type " + context + " with string " + text + " and comment " + comment);
            this.addResource(key + ".description", text, comment, autoKey, context);
        }
    }
}

MetaXmlFile.prototype.handleReportTypes = function(context, subnode) {
    var text, key, comment, autoKey;

    if (subnode.name && subnode.name._text) {
        key = subnode.name._text.trim();
        autoKey = false;
    }

    comment = subnode._comment;

    if (subnode.description) {
        text = textOrComment(subnode.description);
        if (text && text.length) {
            if (subnode._attributes) {
                comment = subnode._attributes["x-i18n"];
            }
            logger.trace("Found resource type " + context + " with string " + text + " and comment " + comment);
            this.addResource(key + ".description", text, comment, autoKey, context);
        }
    }

    if (subnode.label) {
        text = textOrComment(subnode.label);
        if (text && text.length) {
            if (subnode._attributes) {
                comment = subnode._attributes["x-i18n"];
            }
            logger.trace("Found resource type " + context + " with string " + text + " and comment " + comment);
            this.addResource(key, text, comment, autoKey, context);
        }
    }

    if (subnode.sections) {
        var sections = ilib.isArray(subnode.sections) ? subnode.sections : [ subnode.sections ];
        for (var i = 0; i < sections.length; i++) {
            autoKey = false;
            var section = sections[i];
            var label = textOrComment(section.label);
            var subkey = textOrComment(section.name);
            if (!subkey) {
                subkey = this.makeKey(label);
                autoKey = true;
            }
            subkey = [key, subkey].join('.');
            this.addResource(subkey, label, comment, autoKey, context + ".sections");
        }
    }
}

var localizableElements = {
    "customApplications": true,
    "customLabels": true,
    "customTabs": true,
    "quickActions": true,
    "reportTypes": true
};

/**
 * Walk the node tree looking for properties that have localizable values, then extract
 * them and resourcify them.
 * @private
 */
MetaXmlFile.prototype.walkLayout = function(node) {
    var comment, id, subnodes, subnode, text, autoKey;

    for (var p in node) {
        if (p in localizableElements) {
            subnodes = ilib.isArray(node[p]) ? node[p] : [ node[p] ];
            for (var i = 0; i < subnodes.length; i++) {
                subnode = subnodes[i];
                if (p === "reportTypes") {
                    this.handleReportTypes(p, subnode);
                } else {
                    this.handleCustom(p, subnode);
                }
            }
        } else if (typeof(node[p]) === "object" && !(p in skipProperties)) {
            this.walkLayout(node[p]);
        }
    }
};

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 * @param {String} data the string to parse
 */
MetaXmlFile.prototype.parse = function(data) {
    logger.debug("Extracting strings from " + this.pathName);

    this.xmlFile.parse(data);

    /*
    this.xml = data;
    this.contents = xmljs.xml2js(data, {
        trim: false,
        nativeTypeAttribute: true,
        compact: true
    });
    this.resourceIndex = 0;

    this.walkLayout(this.contents);
    */
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
    return this.xmlFile.set;
}

/**
 * Return the location on disk where the version of this file localized
 * for the given locale should be written.
 * @param {String] locale the locale spec for the target locale
 * @returns {String} the localized path name
 */
MetaXmlFile.prototype.getLocalizedPath = function(locale) {
    var spec = locale || this.project.sourceLocale;
    if (sfLocales[spec]) {
        spec = sfLocales[spec];
    }
    spec = spec.replace(/-/g, "_");

    var filename = path.basename(this.pathName);
    var dirname = path.dirname(this.pathName);

    return this.type.smartJoin(dirname, spec + ".translation-meta.xml");
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
