/*
 * XmlFileType.js - Represents a collection of XML files
 *
 * Copyright © 2021, 2023 Box, Inc.
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
// var log4js = require("log4js");
var mm = require("micromatch");
var XmlFile = require("./XmlFile.js");

// var logger = log4js.getLogger("loctool.plugin.XmlFileType");

var XmlFileType = function(project) {
    this.type = "xml";
    this.datatype = "xml";

    this.project = project;
    this.API = project.getAPI();

    this.extensions = validExtensions;

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
    this.logger = this.API.getLogger("loctool.lib.XmlFileType");

    this.schemas = {};
    this.refs = {};
    this.loadSchemas(".");
};

/** join two paths unless the child is an absolute path */
function smartJoin(parent, child) {
    if (!parent) return child;
    if (!child) return parent;
    return (child[0] === "/") ? child : path.join(parent, child);
}

XmlFileType.prototype.loadSchemaFile = function(pathName) {
    // only read json files as schemas
    if (!pathName.endsWith(".json") && !pathName.endsWith(".jsn")) return;

    try {
        var schema = fs.readFileSync(pathName, "utf-8");
        var schemaObj = JSON.parse(schema);
        this.schemas[pathName] = schemaObj;
        this.refs[schemaObj["$id"]] = schemaObj;
    } catch (e) {
        // logger.fatal("Error while parsing schema file " + pathName);
        console.log("Error while parsing schema file " + pathName);
        throw e;
    }
};

XmlFileType.prototype.loadSchemaDir = function(pathName) {
    var files = fs.readdirSync(pathName);
    if (files) {
        files.forEach(function(file) {
            var full = smartJoin(pathName, file);
            this.loadSchemaDirOrFile(full);
        }.bind(this));
    }
};

XmlFileType.prototype.loadSchemaDirOrFile = function(pathName) {
    var stats = fs.statSync(pathName);
    if (!stats) return;
    if (stats.isDirectory()) {
       this.loadSchemaDir(pathName);
    } else {
       this.loadSchemaFile(pathName);
    }
};


XmlFileType.prototype.findRefs = function(root, schema, ref) {
    if (typeof(schema) !== 'object') return;

    if (typeof(root["$$refs"]) === 'undefined') {
        root["$$refs"] = {};
    }

    root["$$refs"][ref] = schema;

    // currently for simplicity, we only handle intra-schema
    // references so far. We'll have to implement the extra-schema
    // references later
    for (var prop in schema) {
        var subschema = schema[prop];

        // recurse through everything -- if it is not a
        // schema object, that's okay -- it won't have the
        // $anchor in it
        if (prop === '$anchor') {
            root["$$refs"]["#" + subschema] = schema;
        } else if (prop !== '$$refs') {
            var newref = ref + '/' + prop;
            if (Array.isArray(subschema)) {
                subschema.forEach(function(element, index) {
                    var arrayref = newref + '[' + index + ']';
                    this.findRefs(element, arrayref);
                }.bind(this));
            } else if (typeof(subschema) === 'object') {
                this.findRefs(root, subschema, newref);
            }
        }
    }
};

// The default schema if not otherwise specified is an android
// resource file.
var defaultSchema = require("./schemas/android-resource-schema.json");

/**
 * Return the default schema for xml files.
 * @returns {Object} the default schema
 */
XmlFileType.prototype.getDefaultSchema = function() {
    return defaultSchema;
};

/**
 * Get the schema associated with the given URI
 * @param {String} uri the uri identifying the schema
 * @returns {Object} the schema associated with the URI, or undefined if
 * that schema is not defined
 */
XmlFileType.prototype.getSchema = function(uri) {
    return this.refs[uri] || this.getDefaultSchema();
};

/**
 * Load all the schema files into memory.
 */
XmlFileType.prototype.loadSchemas = function(pathName) {
    var xmlSettings = this.project.settings.xml;

    if (xmlSettings) {
        var schemas = xmlSettings.schemas;
        schemas = Array.isArray(schemas) ? schemas : [schemas];
        if (schemas) {
            schemas.forEach(function(schema) {
                var full = smartJoin(pathName, schema);
                this.loadSchemaDirOrFile(full);
            }.bind(this));
        }
    }

    // now find all the refs
    for (var file in this.schemas) {
        var schema = this.schemas[file];
        this.findRefs(schema, schema, "#");
    }

    // default schema for all XML files
    this.schemas["default"] = defaultSchema;
    this.refs[this.schemas["default"]["$id"]] = this.schemas["default"];
    if (typeof(defaultSchema["$$refs"]) === 'undefined') {
        this.findRefs(defaultSchema, defaultSchema, "#");
    }

    // connect the mappings to the schemas
};

var defaultMappings = {
    "**/*.xml": {
        schema: "android-resource-schema",
        method: "copy",
        template: "[dir]/[basename]-[localeUnder].[extension]"
    }
};

/**
 * Return the mapping corresponding to this path.
 * @param {String} pathName the path to check
 * @returns {Object} the mapping object corresponding to the
 * path or undefined if none of the mappings match
 */
XmlFileType.prototype.getMapping = function(pathName) {
    if (typeof(pathName) === "undefined") {
        return undefined;
    }
    var xmlSettings = this.project.settings.xml;
    var mappings = (xmlSettings && xmlSettings.mappings) ? xmlSettings.mappings : defaultMappings;
    var patterns = Object.keys(mappings);
    var normalized = path.normalize(pathName);

    var match = patterns.find(function(pattern) {
        return mm.isMatch(normalized, pattern);
    });

    return match && mappings[match];
};

/**
 * Return the default mapping for this plugin.
 */
XmlFileType.prototype.getDefaultMapping = function() {
    return defaultMappings["**/*.xml"];
};

var validExtensions = [
    ".xml",
    ".ddi",
    ".docm",
    ".docx",
    ".dotm",
    ".gml",
    ".iml",
    ".mlt",
    ".plist",
    ".potm",
    ".potx",
    ".ppam",
    ".ppsx",
    ".pptm",
    ".pptx",
    ".properties",
    ".qti",
    ".sldx",
    ".thmx",
    ".uml",
    ".webloc",
    ".wsdl",
    ".xlam",
    ".xlm",
    ".xlsb",
    ".xlsm",
    ".xlsx",
    ".xmls",
    ".xslt",
    ".xspf",
    ".xtml"
];

/**
 * Return true if the given path is an XML template file and is handled
 * by the current file type.
 *
 * @param {String} pathName path to the file being questions
 * @returns {boolean} true if the path is a java file, or false
 * otherwise
 */
XmlFileType.prototype.handles = function(pathName) {
    // logger.debug("XmlFileType handles " + pathName + "?");
    if (!pathName) return false;

    var lastdot = pathName.lastIndexOf(".");
    var extension = pathName.substring(lastdot > -1 ? lastdot : 0);
    var ret = validExtensions.indexOf(extension) > -1;

    // now match at least one of the mapping patterns
    if (ret) {
        ret = false;
        // first check if it is a source file
        var mapping = this.getMapping(pathName);
        if (mapping) {
            ret = true;
            var locale = this.API.utils.getLocaleFromPath(mapping.template, pathName);
            if (locale && locale !== this.project.sourceLocale) {
                ret = false;
            }
        }
    }
    // logger.debug(ret ? "Yes" : "No");
    return ret;
};

XmlFileType.prototype.name = function() {
    return "XML File Type";
};

/**
 * Write out the aggregated resources for this file type. In
 * some cases, the string are written out to a common resource
 * file, and in other cases, to a type-specific resource file.
 * In yet other cases, nothing is written out, as the each of
 * the files themselves are localized individually, so there
 * are no aggregated strings.
 */
XmlFileType.prototype.write = function() {
    // xml files are localized individually, so we don't have to
    // write out the resources
};

XmlFileType.prototype.newFile = function(path, options) {
    var opts = Object.assign({
        project: this.project,
        pathName: path,
        type: this,
    }, options);
    return new XmlFile(opts);
};

XmlFileType.prototype.getDataType = function() {
    return this.datatype;
};

XmlFileType.prototype.getResourceTypes = function() {
    return {
        "string": "ContextResourceString"
    };
};

XmlFileType.prototype.getExtensions = function() {
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
XmlFileType.prototype.getExtracted = function() {
    return this.extracted;
};

/**
 * Add the contents of the given translation set to the extracted resources
 * for this file type.
 *
 * @param {TranslationSet} set set of resources to add to the current set
 */
XmlFileType.prototype.addSet = function(set) {
    this.extracted.addSet(set);
};

/**
 * Return the translation set containing all of the new
 * resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * new resources
 */
XmlFileType.prototype.getNew = function() {
    return this.newres;
};

/**
 * Return the translation set containing all of the pseudo
 * localized resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * pseudo localized resources
 */
XmlFileType.prototype.getPseudo = function() {
    return this.pseudo;
};

module.exports = XmlFileType;
