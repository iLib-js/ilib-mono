/*
 * JsonFileType.js - Represents a collection of json files
 *
 * Copyright © 2021-2023, Box, Inc.
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
var mm = require("micromatch");
var JsonFile = require("./JsonFile.js");

var JsonFileType = function(project) {
    this.type = "json";
    this.datatype = "json";

    this.project = project;
    this.API = project.getAPI();

    this.logger = this.API.getLogger("loctool.plugin.JsonFileType");

    this.extensions = [ ".json", ".jso", ".jsn" ];

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

    this.resourceFiles = {};
    this.schemas = {};
    this.refs = {};
    this.loadSchemas(".");
};

JsonFileType.prototype.loadSchemaFile = function(pathName) {
    try {
        var schema = fs.readFileSync(pathName, "utf-8");
        var schemaObj = JSON.parse(schema);
        this.schemas[pathName] = schemaObj;
        this.refs[schemaObj["$id"]] = schemaObj;
    } catch (e) {
        this.logger.fatal("Error while parsing schema file " + pathName);
        throw e;
    }
};

JsonFileType.prototype.loadSchemaDir = function(pathName) {
    var files = fs.readdirSync(pathName);
    if (files) {
        files.forEach(function(file) {
            var full = path.join(pathName, file);
            this.loadSchemaDirOrFile(full);
        }.bind(this));
    }
};

JsonFileType.prototype.loadSchemaDirOrFile = function(pathName) {
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
JsonFileType.prototype.hasType = function(schema) {
    return typeKeywords.find(function(keyword) {
        return typeof(schema[keyword]) !== 'undefined';
    });
};

JsonFileType.prototype.findRefs = function(root, schema, ref) {
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
 * Return the default schema for json files.
 * @returns {Object} the default schema
 */
JsonFileType.prototype.getDefaultSchema = function() {
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
JsonFileType.prototype.getSchema = function(uri) {
    return uri && this.refs[uri] || this.getDefaultSchema();
};

/**
 * Load all the schema files into memory.
 */
JsonFileType.prototype.loadSchemas = function(pathName) {
    var jsonSettings = this.project.settings.json;

    if (jsonSettings) {
        var schemas = jsonSettings.schemas;
        if (schemas) {
            schemas.forEach(function(schema) {
                var full = path.join(pathName, schema);
                this.loadSchemaDirOrFile(full);
            }.bind(this));
        }
    } else {
        // default schema for all json files with key/value pairs
        this.schemas = {
            "default": this.getDefaultSchema()
        };
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
    "**/*.json": {
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
JsonFileType.prototype.getMapping = function(pathName) {
    if (typeof(pathName) === "undefined") {
        return defaultMappings["**/*.json"];
    }
    var jsonSettings = this.project.settings.json;
    var mappings = (jsonSettings && jsonSettings.mappings) ? jsonSettings.mappings : defaultMappings;
    var patterns = Object.keys(mappings);
    var normalized = path.normalize(
        pathName.endsWith(".jso") || pathName.endsWith(".jsn") ?
            pathName.substring(0, pathName.length - 4) + ".json" :
            pathName
    );

    var match = patterns.find(function(pattern) {
        return mm.isMatch(pathName, pattern) || mm.isMatch(normalized, pattern);
    });

    return match && mappings[match];
}

/**
 * Return true if the given path is an Json template file and is handled
 * by the current file type.
 *
 * @param {String} pathName path to the file being questions
 * @returns {boolean} true if the path is a java file, or false
 * otherwise
 */
JsonFileType.prototype.handles = function(pathName) {
    this.logger.debug("JsonFileType handles " + pathName + "?");
    var ret = false;
    var normalized = path.normalize(pathName);

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
        var mappings = (jsonSettings && jsonSettings.mappings) ? jsonSettings.mappings : defaultMappings;
        var patterns = Object.keys(mappings);
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
    this.logger.debug(ret ? "Yes" : "No");
    return ret;
};

JsonFileType.prototype.name = function() {
    return "Json File Type";
};

/**
 * Return the location on disk where the version of this file localized
 * for the given locale should be written.
 * @param {String} template template for the output file
 * @param {String} pathname path to the source file
 * @param {String} locale the locale spec for the target locale
 * @returns {String} the localized path name
 */
JsonFileType.prototype.getLocalizedPath = function(mapping, pathname, locale) {
    var template = mapping && mapping.template;
    // var l = this.getOutputLocale(mapping, locale);
    var l = new Locale(locale);

    if (!template) {
        template = defaultMappings["**/*.json"].template;
    }

    return path.normalize(this.API.utils.formatPath(template, {
        sourcepath: pathname,
        locale: l
    }));
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
    this.logger.trace("Now writing out " + Object.keys(this.resourceFiles).length + " resource files");
    for (var hash in this.resourceFiles) {
        var file = this.resourceFiles[hash];
        file.write();
    }
};

JsonFileType.prototype.newFile = function(pathName, options) {
    return new JsonFile({
        project: this.project,
        pathName: pathName,
        type: this,
        locale: options.locale
    });
};

/**
 * Find or create the resource file object for the given project, context,
 * and locale.
 *
 * @param {String} locale the name of the locale in which the resource
 * file will reside
 * @param {String} pathName path to the resource file, if known, or undefined otherwise
 * @return {JavaScriptResourceFile} the Android resource file that serves the
 * given project, context, and locale.
 */
JsonFileType.prototype.getResourceFile = function(locale, pathName) {
    var key = locale || this.project.sourceLocale;

    var resfile = this.resourceFiles && this.resourceFiles[key];

    if (!resfile) {
        resfile = this.resourceFiles[key] = this.newFile(pathName, {
            project: this.project,
            locale: key
        });

        this.logger.trace("Defining new resource file");
    }

    return resfile;
};

/**
 * Return all resource files known to this file type instance.
 *
 * @returns {Array.<JavaScriptResourceFile>} an array of resource files
 * known to this file type instance
 */
JsonFileType.prototype.getAll = function() {
    return this.resourceFiles;
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
