/*
 * MetaXmlFileType.js - Represents a collection of java files
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

var path = require("path");
var Locale = require("ilib/lib/Locale.js");
var ResBundle = require("ilib/lib/ResBundle.js");
var mm = require("micromatch");
var XmlFileType = require("ilib-loctool-xml");

var MetaXmlFile = require("./MetaXmlFile.js");
var sfLocales = require("./sflocales.json");

var logger = {
    error: function() {},
    info: function() {},
    warn: function() {},
    debug: function() {},
    trace: function() {}
};

var MetaXmlFileType = function(project) {
    this.type = "xml";
    this.datatype = "xml";

    this.project = project;
    this.API = this.project.getAPI();

    if (typeof(this.API.getLogger) === "function") {
        logger = this.API.getLogger("loctool.lib.MetaXmlFileType");
    }

    this.extensions = [ ".xml" ];

    this.extracted = this.API.newTranslationSet(this.project.getSourceLocale());
    this.newres = this.API.newTranslationSet(this.project.getSourceLocale());
    this.pseudo = this.API.newTranslationSet(this.project.getSourceLocale());

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

    if (!project.settings) {
        project.settings = {};
    }

    if (!project.settings.xml) {
        var mappings = this._getMappings();
        Object.assign(project.settings, {
            xml: {
                schemas: this.smartJoin(module.path, "./schemas"),
                mappings: mappings
            }
        });
    }
    this.xmlFileType = new XmlFileType(project);
};

/**
 * @private
 * Join two paths unless the child is an absolute path
 */
MetaXmlFileType.prototype.smartJoin = function(parent, child) {
    return (child[0] === "/") ? child : path.join(parent, child);
}

/**
 * Return the default schema for xml files.
 * @returns {Object} the default schema
 */
MetaXmlFileType.prototype.getDefaultSchema = function() {
    return this.xmlFileType.getSchema("translation-meta-xml-schema");
};

/**
 * Get the schema associated with the given URI
 * @param {String} uri the uri identifying the schema
 * @returns {Object} the schema associated with the URI, or undefined if
 * that schema is not defined
 */
MetaXmlFileType.prototype.getSchema = function(uri) {
    var schema = this.xmlFileType.getSchema(uri);
    if (schema === this.xmlFileType.getDefaultSchema()) {
        // our default is different than the xml plugin's default
        schema = this.getDefaultSchema();
    }
    return schema;
};

/**
 * @private
 */
MetaXmlFileType.prototype._getMappings = function() {
    var xmlSettings = this.project.settings.metaxml;
    return (xmlSettings && xmlSettings.mappings) ? xmlSettings.mappings : defaultMappings;
};

/**
 * Return the mapping corresponding to this path.
 * @param {String} pathName the path to check
 * @returns {Object} the mapping object corresponding to the
 * path or undefined if none of the mappings match
 */
MetaXmlFileType.prototype.getMapping = function(pathName) {
    if (typeof(pathName) === "undefined") {
        return this.getDefaultMapping();
    }

    var mappings = this._getMappings();
    var patterns = Object.keys(mappings);

    var match = patterns.find(function(pattern) {
        return mm.isMatch(pathName, pattern);
    });

    return match && mappings[match];
};

/**
 * Return the default mapping for this plugin.
 */
MetaXmlFileType.prototype.getDefaultMapping = function() {
    return defaultMappings["**/*.translation-meta.xml"];
};

var defaultMappings = {
    "**/*.app-meta.xml": {
        "schema": "customApplication-meta-xml-schema"
    },
    "**/*.field-meta.xml": {
        "schema": "customField-meta-xml-schema"
    },
    "**/*.labels-meta.xml": {
        "schema": "customLabels-meta-xml-schema"
    },
    "**/*.md-meta.xml": {
        "schema": "customMetadata-meta-xml-schema"
    },
    "**/*.object-meta.xml": {
        "schema": "customObject-meta-xml-schema"
    },
    "**/*.customPermission-meta.xml": {
        "schema": "customPermission-meta-xml-schema"
    },
    "**/*.tab-meta.xml": {
        "schema": "customTab-meta-xml-schema"
    },
    "**/*.quickAction-meta.xml": {
        "schema": "quickaction-meta-xml-schema"
    },
    "**/*.translation-meta.xml": {
        "schema": "translation-meta-xml-schema",
        "method": "copy",
        "template": "[dir]/[locale].translation-meta.xml"
    }
};

/**
 * Return true if the given path is a java file and is handled
 * by the current file type.
 *
 * @param {String} pathName path to the file being questions
 * @returns {boolean} true if the path is a java file, or false
 * otherwise
 */
MetaXmlFileType.prototype.handles = function(pathName) {
    logger.debug("MetaXmlFileType handles " + pathName + "?");
    if (!pathName || !pathName.length) {
        logger.debug("No");
        return false;
    }

    // check the path too
    var ret = true;
    var patterns = Object.keys(defaultMappings); 
    ret = patterns.find(function(pattern) {
        return mm.isMatch(pathName, pattern);
    });

    // check that we don't have an already translated file
    var base = path.basename(pathName);
    if (ret && base.endsWith(".translation-meta.xml")) {
        if (base === "en_US.translation-meta.xml") {
            var parts = path.dirname(pathName).split(/\//g);
            if (parts[parts.length-1] !== "translations") {
                ret = false;
            }
        } else {
            // an already translated file
            ret = false;
        }
    }
    logger.debug(ret ? "Yes" : "No");
    return ret;
};

MetaXmlFileType.prototype.name = function() {
    return "MetaXml File Type";
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
MetaXmlFileType.prototype.write = function(translations, locales) {
    // distribute all the resources to their resource files
    // and then let them write themselves out
    var resFileType = this.project.getResourceFileType();
    var res, file,
        resources = this.extracted.getAll(),
        db = this.project.db,
        translationLocales = locales.filter(function(locale) {
            return locale !== this.project.sourceLocale && locale !== this.project.pseudoLocale;
        }.bind(this));

    for (var i = 0; i < resources.length; i++) {
        res = resources[i];
        // have to store the base English string or else there will be nothing to override in the translations
        file = resFileType.getResourceFile(res.context, res.getSourceLocale(), res.resType + "s", res.pathName);
        file.addResource(res);

        // for each extracted string, write out the translations of it
        translationLocales.forEach(function(locale) {
            logger.trace("Localizing Java strings to " + locale);

            db.getResourceByHashKey(res.hashKeyForTranslation(locale), function(err, translated) {
                var r = translated;
                if (res.dnt) {
                    logger.trace("Resource " + res.reskey + " is set to 'do not translate'");
                } else if (!r || this.API.utils.cleanString(res.getSource()) !== this.API.utils.cleanString(r.getSource())) {
                    if (r) {
                        logger.trace("extracted   source: " + this.API.utils.cleanString(res.getSource()));
                        logger.trace("translation source: " + this.API.utils.cleanString(r.getSource()));
                    }
                    var note = r && 'The source string has changed. Please update the translation to match if necessary. Previous source: "' + r.getSource() + '"';
                    var newres = res.clone();
                    newres.setTargetLocale(locale);
                    newres.setTarget((r && r.getTarget()) || res.getSource());
                    newres.setState("new");
                    newres.setComment(note);

                    this.newres.add(newres);

                    // skip because the fallbacks will go to the English resources anyways
                    logger.trace("No translation for " + res.reskey + " to " + locale);
                } else if (r.getTarget() !== res.getSource()) {
                    file = resFileType.getResourceFile(r.context, locale, r.resType + "s", r.pathName);
                    file.addResource(r);
                    logger.trace("Added " + r.reskey + " to " + file.pathName);
                }
            }.bind(this));
        }.bind(this));
    }

    resources = this.pseudo.getAll().filter(function(resource) {
        return resource.datatype === this.datatype;
    }.bind(this));

    for (var i = 0; i < resources.length; i++) {
        res = resources[i];
        // only need to add the resource if it is different from the source text
        if (res.getSource() !== res.getTarget()) {
            file = resFileType.getResourceFile(res.context, res.getTargetLocale(), res.resType + "s", res.pathName);
            file.addResource(res);
            logger.trace("Added " + res.reskey + " to " + file.pathName);
        }
    }
};

MetaXmlFileType.prototype.newFile = function(path) {
    return new MetaXmlFile({
        project: this.project,
        pathName: path,
        type: this
    });
};

MetaXmlFileType.prototype.getDataType = function() {
    return this.datatype;
};

MetaXmlFileType.prototype.getResourceTypes = function() {
    return {};
};

MetaXmlFileType.prototype.getExtensions = function() {
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
MetaXmlFileType.prototype.getExtracted = function() {
    return this.extracted;
};

/**
 * Add the contents of the given translation set to the extracted resources
 * for this file type.
 *
 * @param {TranslationSet} set set of resources to add to the current set
 */
MetaXmlFileType.prototype.addSet = function(set) {
    this.extracted.addSet(set);
};

/**
 * Return the translation set containing all of the new
 * resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * new resources
 */
MetaXmlFileType.prototype.getNew = function() {
    return this.newres;
};

/**
 * Return the translation set containing all of the pseudo
 * localized resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * pseudo localized resources
 */
MetaXmlFileType.prototype.getPseudo = function() {
    return this.pseudo;
};

/**
 * Find the path for the resource file for the given project, context,
 * and locale.
 *
 * @param {String} locale the name of the locale in which the resource
 * file will reside
 * @param {String} pathName path name of the resource being added.
 * @param {String} type one of "objc" or "xib" strings from each source
 * file type go into different types of resource files
 * @param {String|undefined} flavor the name of the flavor if any
 * @return {String} the ios strings resource file path that serves the
 * given project, context, and locale.
 */
MetaXmlFileType.prototype.getResourceFilePath = function(locale, pathName) {
    var spec = locale || this.project.sourceLocale;
    if (sfLocales[spec]) {
        spec = sfLocales[spec];
    }

    var template = (this.project.settings && this.project.settings.metaxml && this.project.settings.metaxml.resourceFile) ||
        "force-app/main/default/translations/[localeUnder].translation-meta.xml";

    return path.normalize(this.API.utils.formatPath(template, {
        sourcepath: pathName,
        locale: spec
    }));
};


/**
 * Return the name of the node module that implements the resource file type, or
 * the path to a javascript file that implements the resource filetype.
 * @returns {FileType|undefined} class that implements a resource file type,
 * or undefined if this file type does not need resource files
 */
MetaXmlFileType.prototype.getResourceFileType = function() {
    // this is its own resource file type
    return MetaXmlFileType;
};

module.exports = MetaXmlFileType;
