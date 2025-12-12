/*
 * JsonResourceFile.js - represents a JSON resource file with header/footer for testing
 *
 * Copyright © 2024, Box, Inc.
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
var Locale = require("ilib/lib/Locale.js");

/**
 * @class Represents a JSON resource file with a header and footer.
 * This is a test resource file type used to verify the resourceFileTypes
 * delegation feature of the ilib-loctool-json plugin.
 *
 * @param {Object} props properties that control the construction of this file.
 */
var JsonResourceFile = function(props) {
    this.locale = new Locale(props.locale || "en-US");
    this.project = props.project;
    this.API = props.API || props.project.getAPI();
    this.pathName = props.pathName;
    this.type = props.type;
    this.header = props.header || "";
    this.footer = props.footer || "";
    this.logger = this.API.getLogger("loctool.plugin.JsonResourceFile");

    this.set = this.API.newTranslationSet(this.project ? this.project.sourceLocale : "zxx-XX");
};

/**
 * We don't read resource files. We only write them.
 */
JsonResourceFile.prototype.extract = function() {};

/**
 * Get the locale of this resource file.
 *
 * @returns {String} the locale spec of this file
 */
JsonResourceFile.prototype.getLocale = function() {
    return this.locale;
};

/**
 * Get the context of this resource file.
 *
 * @returns {String|undefined} the context of this file
 */
JsonResourceFile.prototype.getContext = function() {
    return undefined;
};

/**
 * Get all resources from this file.
 *
 * @returns {Array.<Resource>} all of the resources available in this resource file.
 */
JsonResourceFile.prototype.getAll = function() {
    return this.set.getAll();
};

/**
 * Add a resource to this file.
 *
 * @param {Resource} res a resource to add to this file
 */
JsonResourceFile.prototype.addResource = function(res) {
    this.logger.trace("JsonResourceFile.addResource: " + JSON.stringify(res) + " to " + this.project.getProjectId() + ", " + this.locale);
    var resLocale = res.getTargetLocale() || res.getSourceLocale();
    if (res && res.getProject() === this.project.getProjectId()) {
        this.logger.trace("correct project. Adding.");
        this.set.add(res);
    } else {
        if (res) {
            this.logger.warn("Attempt to add a resource to a resource file with the incorrect project.");
        } else {
            this.logger.warn("Attempt to add an undefined resource to a resource file.");
        }
    }
};

/**
 * Return true if this resource file has been modified since it was loaded from disk.
 *
 * @returns {boolean} true if this resource file has been modified
 */
JsonResourceFile.prototype.isDirty = function() {
    return this.set.isDirty();
};

/**
 * We don't localize resource files.
 */
JsonResourceFile.prototype.localize = function() {};

/**
 * Generate the content of the resource file.
 *
 * @private
 * @returns {String} the content of the resource file
 */
JsonResourceFile.prototype.getContent = function() {
    var json = {};
    var resources = this.set.getAll();

    resources.forEach(function(res) {
        var key = res.getKey();
        switch (res.getType()) {
            case 'plural':
                json[key] = res.getTargetPlurals() || res.getSourcePlurals();
                break;
            case 'array':
                json[key] = res.getTargetArray() || res.getSourceArray();
                break;
            default:
                json[key] = res.getTarget() || res.getSource();
                break;
        }
    });

    return this.header + JSON.stringify(json, null, 4) + this.footer;
};

/**
 * Find the path for the resource file.
 *
 * @param {String} locale the name of the locale
 * @return {String} the resource file path
 */
JsonResourceFile.prototype.getResourceFilePath = function(locale) {
    if (this.pathName) return this.pathName;

    var l = new Locale(locale || this.locale.getSpec());
    var filename = l.getSpec() + ".json";
    var dir = this.project.getResourceDirs("json")[0] || "resources";

    return path.join(dir, filename);
};

/**
 * Write the resource file out to disk.
 */
JsonResourceFile.prototype.write = function() {
    var filePath = this.getResourceFilePath();

    this.logger.debug("Writing JSON resource file for locale " + this.locale.getSpec() + " to " + filePath);

    var p = path.join(this.project.target, filePath);
    var d = path.dirname(p);
    this.API.utils.makeDirs(d);

    fs.writeFileSync(p, this.getContent(), "utf-8");
};

/**
 * Return the set of resources found in this resource file.
 *
 * @returns {TranslationSet} The set of resources
 */
JsonResourceFile.prototype.getTranslationSet = function() {
    return this.set;
};

module.exports = JsonResourceFile;

