/*
 * OpenAPIFileType.js - Represents a collection of json files
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

var fs = require('fs');
const path = require('path');

var JsonFileType = require('ilib-loctool-json/JsonFileType');
var MarkdownFileType = require('ilib-loctool-ghfm/MarkdownFileType');
var OpenAPIFile = require('./OpenAPIFile');

var OpenAPIFileType = function(project) {
    this.type = 'openapi';
    this.datatype = 'openapi';
    this.extensions = ['.json', '.jso', '.jsn'];
    this.project = project;

    this.API = project.getAPI();
    this.extracted = this.API.newTranslationSet(project.getSourceLocale());
    this.newres = this.API.newTranslationSet(project.getSourceLocale());
    this.pseudo = this.API.newTranslationSet(project.getSourceLocale());

    // Copy over openapi config to json key to enable support of mappings from the json plugin.
    project.settings.json = project.settings.openapi;

    this.markdownFileType = new MarkdownFileType(project);
    this.jsonFileType = new JsonFileType(project);

    // Load default OpenAPI schema bundled with the plugin.
    var defaultSchemaPath = path.resolve(__dirname, 'schema.json');
    this.jsonFileType.loadSchemaFile(defaultSchemaPath);
    this.jsonFileType.findRefs(
        this.jsonFileType.schemas[defaultSchemaPath],
        this.jsonFileType.schemas[defaultSchemaPath],
        '#');

    this.logger = this.API.getLogger('loctool.plugin.OpenAPIFileType');
}

/**
 * Return the location on disk where the version of this file localized
 * for the given locale should be written.
 *
 * @param {String} template template for the output file
 * @param {String} pathname path to the source file
 * @param {String} locale the locale spec for the target locale
 * @returns {String} the localized path name
 */
OpenAPIFileType.prototype.getLocalizedPath = function(template, pathname, locale) {
    return this.jsonFileType.getLocalizedPath({
        template: template
    }, pathname, locale);
}

/**
 * Return a locale encoded in the path using template to parse that path.
 *
 * @param {String} template template for the output file
 * @param {String} pathname path to the source file
 * @returns {String} the locale within the path
 */
OpenAPIFileType.prototype.getLocaleFromPath = function(template, pathname) {
    return this.API.utils.getLocaleFromPath(template, pathname);
}

/**
 * Return the mapping corresponding to this path.
 *
 * @param {String} pathName the path to check
 * @returns {Object} the mapping object corresponding to the
 * path or undefined if none of the mappings match
 */
OpenAPIFileType.prototype.getMapping = function(pathName) {
    return this.jsonFileType.getMapping(pathName);
}
/**
 * Return true if the given path is an Json template file and is handled
 * by the current file type.
 *
 * @param {String} pathName path to the file to be checked
 * @returns {boolean} true if file is handled by the plugin, or
 * false otherwise
 */
OpenAPIFileType.prototype.handles = function(pathName) {
    return this.jsonFileType.handles(pathName);
}
/**
 * Return dataType of the plugin.
 *
 * @returns {String}
 */
OpenAPIFileType.prototype.getDataType = function() {
    return this.datatype;
};
/**
 * Return resource types of the plugin.
 *
 * @returns {{}}
 */
OpenAPIFileType.prototype.getResourceTypes = function() {
    return {};
}
/**
 * Return extensions handled by the plugin.
 *
 * @returns {Array.<String>}
 */
OpenAPIFileType.prototype.getExtensions = function() {
    return this.extensions;
};

OpenAPIFileType.prototype.write = function() {
    // templates are localized individually, so we don't have to
    // write out the resources
};

/**
 * Return the translation set containing all of the pseudo
 * localized resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * pseudo localized resources
 */
OpenAPIFileType.prototype.getPseudo = function() {
    return this.pseudo;
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
OpenAPIFileType.prototype.getExtracted = function() {
    return this.extracted;
};

/**
 * Return the translation set containing all of the new
 * resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * new resources
 */
OpenAPIFileType.prototype.getNew = function() {
    return this.newres;
};
/**
 * Return a new OpenAPIFile object.
 *
 * @param {String} path path to a file
 * @param {Object} options additional options to be passed
 * to a file object
 * @returns {OpenAPIFile}
 */
OpenAPIFileType.prototype.newFile = function(path, options) {
    this.logger.debug('Add new file ' + path);

    return new OpenAPIFile({
        project: this.project,
        pathName: path,
        type: this,
        targetLocale: options && options.locale
    });
};

/**
 * Add the contents of the given translation set to the extracted resources
 * for this file type.
 *
 * @param {TranslationSet} set set of resources to add to the current set
 */
OpenAPIFileType.prototype.addSet = function(set) {
    this.extracted.addSet(set);
};
/**
 * Return file type name.
 *
 * @returns {String}
 */
OpenAPIFileType.prototype.name = function() {
    return 'OpenAPI File Type';
};

module.exports = OpenAPIFileType;
