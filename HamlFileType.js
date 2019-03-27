/*
 * HamlFileType.js - Represents a collection of Haml files
 *
 * Copyright © 2016-2017, HealthTap, Inc.
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
var log4js = require("log4js");
const spawnSync = require('child_process').spawnSync;
var ilib = require("ilib");
var Locale = require("ilib/lib/Locale.js");
var ResBundle = require("ilib/lib/ResBundle.js");

var HamlFile = require("./HamlFile.js");

var logger = log4js.getLogger("loctool.lib.HamlFileType");

var HamlFileType = function(project) {
    this.type = "ruby";
    this.datatype = "x-haml";
    
    this.project = project;
    this.API = project.getAPI();
    
    this.extracted = this.API.newTranslationSet(project.getSourceLocale());
    this.newres = this.API.newTranslationSet(project.getSourceLocale());
    this.pseudo = this.API.newTranslationSet(project.getSourceLocale());

    this.files = [];

    this.extensions = [ ".haml" ];

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

var alreadyLoc = new RegExp(/\.([a-z][a-z](-[A-Z][a-z][a-z][a-z])?(-[A-Z][A-Z](-[A-Z]+)?)?)\.html\.haml$/);

/**
 * Return true if the given path is a Haml file and is handled
 * by the current file type.
 *
 * @param {String} pathName path to the file being questions
 * @returns {boolean} true if the path is a Haml file, or false
 * otherwise
 */
HamlFileType.prototype.handles = function(pathName) {
    logger.debug("HamlFileType handles " + pathName + "?");
    // var ret = extensionRE.test(pathName);
    var ret = pathName.length > 10 && pathName.substring(pathName.length - 10) === ".html.haml";
    if (ret) {
        var match = alreadyLoc.exec(pathName);
        ret = (match && match.length) ? match[1] === this.project.sourceLocale : true;
    }

    logger.debug(ret ? "Yes" : "No");
    return ret;
};

HamlFileType.prototype.name = function() {
    return "Haml File Type";
};

/**
 * Write out the aggregated resources for this file type. In
 * some cases, the string are written out to a common resource
 * file, and in other cases, to a type-specific resource file.
 * In yet other cases, nothing is written out, as the each of
 * the files themselves are localized individually, so there
 * are no aggregated strings.
 */
HamlFileType.prototype.write = function() {};

HamlFileType.prototype.newFile = function(pathName) {
    logger.trace("Creating new haml file for " + pathName + " len " + this.files.length);
    this.files.push(pathName);
    return new HamlFile({
        project: this.project,
        pathName: pathName,
        type: this
    });
};

HamlFileType.prototype.getDataType = function() {
    return this.datatype;
};

HamlFileType.prototype.getResourceTypes = function() {
    return {};
};

module.exports = HamlFileType;
