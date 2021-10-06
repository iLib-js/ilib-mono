/*
 * XmlFileType.js - Represents a collection of XML files
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
// var log4js = require("log4js");
var mm = require("micromatch");
var XmlFile = require("./XmlFile.js");

// var logger = log4js.getLogger("loctool.plugin.XmlFileType");

var XmlFileType = function(project) {
    this.type = "xml";
    this.datatype = "xml";

    this.project = project;
    this.API = project.getAPI();

    this.extensions = [ ".xml", ".jso", ".jsn" ];

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

    this.schemas = {};
    this.refs = {};
    this.loadSchemas(".");
};

XmlFileType.prototype.loadSchemaFile = function(pathName) {
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
            var full = path.join(pathName, file);
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

var typeKeywords = [
    "type",
    "contains",
    "allOf",
    "anyOf",
    "oneOf",
    "not",
    "$ref"
];

/**
 * Return true if the schema has a type. The type could be indicated by
 * the presence of any of the following fields:
 * - type
 * - contains
 * - allOf
 * - anyOf
 * - oneOf
 * - not
 * - $ref
 * @param {Object} schema the schema to check
 * @returns {boolean} true if the schema contains a type, false otherwise
 */
XmlFileType.prototype.hasType = function(schema) {
    return typeKeywords.find(function(keyword) {
        return typeof(schema[keyword]) !== 'undefined';
    });
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

/**
 * Return the default schema for xml files.
 * @returns {Object} the default schema
 */
XmlFileType.prototype.getDefaultSchema = function() {
    return {
        "$schema": "http://json-schema.org/draft-07/schema",
        "$id": "strings-schema",
        "type": "object",
        "description": "A flat object of properties with localizable values",
        "additionalProperties": {
            "type": "string",
            "localizable": true
        }
    };
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
        if (schemas) {
            schemas.forEach(function(schema) {
                var full = path.join(pathName, schema);
                this.loadSchemaDirOrFile(full);
            }.bind(this));
        }
    } else {
        // default schema for all XML files with key/value pairs
        this.schemas = {
            "default": {
                "$schema": "http://json-schema.org/draft-07/schema",
                "$id": "strings-schema",
                "type": "object",
                "description": "A collection of properties with localizable values",
                "additionalProperties": {
                    "type": "string",
                    "localizable": true
                }
            }
        }
        this.refs[this.schemas["default"]["$id"]] = this.schemas["default"];
    }

    // now find all the refs
    for (var file in this.schemas) {
        var schema = this.schemas[file];
        this.findRefs(schema, schema, "#");
    }
    // connect the mappings to the schemas
};

var defaultMappings = {
    "**/*.xml": {
        schema: "strings-schema",
        method: "copy",
        template: "resources/[localeDir]/[filename]"
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
    var normalized = pathName.endsWith(".jso") || pathName.endsWith(".jsn") ?
        pathName.substring(0, pathName.length - 4) + ".xml" :
        pathName;

    var match = patterns.find(function(pattern) {
        return mm.isMatch(pathName, pattern) || mm.isMatch(normalized, pattern);
    });

    return match && mappings[match];
}

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
    var ret = false;
    var normalized = pathName;

    if (pathName.length > 4 &&
        (pathName.substring(pathName.length - 4) === ".jso" || pathName.substring(pathName.length - 4) === ".jsn")) {
        ret = true;
        // normalize the extension so the matching below can work
        normalized = pathName.substring(0, pathName.length - 4) + ".xml";
    }

    if (!ret) {
        ret = pathName.length > 5 && pathName.substring(pathName.length - 5) === ".xml";
    }

    // now match at least one of the mapping patterns
    if (ret) {
        ret = false;
        // first check if it is a source file
        var xmlSettings = this.project.settings.xml;
        var mappings = (xmlSettings && xmlSettings.mappings) ? xmlSettings.mappings : defaultMappings;
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
    // logger.debug(ret ? "Yes" : "No");
    return ret;
};

XmlFileType.prototype.name = function() {
    return "XML File Type";
};

var matchExprs = {
    "dir": {
        regex: ".*?",
        brackets: 0,
    },
    "locale": {
        regex: "([a-z][a-z][a-z]?)(-([A-Z][a-z][a-z][a-z]))?(-([A-Z][A-Z]|[0-9][0-9][0-9]))?",
        brackets: 5,
        groups: {
            language: 1,
            script: 3,
            region: 5
        }
    },
    "language": {
        regex: "([a-z][a-z][a-z]?)",
        brackets: 1,
        groups: {
            language: 1
        }
    },
    "script": {
        regex: "([A-Z][a-z][a-z][a-z])",
        brackets: 1,
        groups: {
            script: 1
        }
    },
    "region": {
        regex: "([A-Z][A-Z]|[0-9][0-9][0-9])",
        brackets: 1,
        groups: {
            region: 1
        }
    },
    "localeDir": {
        regex: "([a-z][a-z][a-z]?)(/([A-Z][a-z][a-z][a-z]))?(/([A-Z][A-Z]|[0-9][0-9][0-9]))?",
        brackets: 5,
        groups: {
            language: 1,
            script: 3,
            region: 5
        }
    },
    "localeUnder": {
        regex: "([a-z][a-z][a-z]?)(_([A-Z][a-z][a-z][a-z]))?(_([A-Z][A-Z]|[0-9][0-9][0-9]))?",
        brackets: 5,
        groups: {
            language: 1,
            script: 3,
            region: 5
        }
    },
};

/**
 * Return a locale encoded in the path using template to parse that path.
 * @param {String} template template for the output file
 * @param {String} pathname path to the source file
 * @returns {String} the locale within the path
 */
XmlFileType.prototype.getLocaleFromPath = function(template, pathname) {
    var regex = "";
    var matchGroups = {};
    var totalBrackets = 0;

    if (!template) {
        template = defaultMappings["**/*.xml"].template;
    }

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
                case 'extension':
                    var base = path.basename(pathname);
                    regex += base.substring(base.lastIndexOf('.')+1);
                    break;
                case 'basename':
                    regex += path.basename(pathname, ".xml");
                    break;
                default:
                    regex += matchExprs[keyword].regex;
                    for (var prop in matchExprs[keyword].groups) {
                        matchGroups[prop] = totalBrackets + matchExprs[keyword].groups[prop];
                    }
                    totalBrackets += matchExprs[keyword].brackets;
                    break;
            }
        }
    }

    var re = new RegExp(regex, "u");
    var match;

    if ((match = re.exec(pathname)) !== null) {
        var groups = {};
        var found = false;
        for (var groupName in matchGroups) {
            if (match[matchGroups[groupName]]) {
                groups[groupName] = match[matchGroups[groupName]];
                found = true;
            }
        }
        if (found) {
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
XmlFileType.prototype.getLocalizedPath = function(template, pathname, locale) {
    var output = "";
    var l = new Locale(locale);

    if (!template) {
        template = defaultMappings["**/*.xml"].template;
    }

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
                case 'extension':
                    var base = path.basename(pathname);
                    output += base.substring(base.lastIndexOf('.')+1);
                    break;
                case 'basename':
                    output += path.basename(pathname, ".xml");
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
XmlFileType.prototype.write = function() {
    // templates are localized individually, so we don't have to
    // write out the resources
};

XmlFileType.prototype.newFile = function(path) {
    return new XmlFile({
        project: this.project,
        pathName: path,
        type: this
    });
};

XmlFileType.prototype.getDataType = function() {
    return this.datatype;
};

XmlFileType.prototype.getResourceTypes = function() {
    return {};
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
