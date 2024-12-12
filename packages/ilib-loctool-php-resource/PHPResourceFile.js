/*
 * PHPResourceFile.js - represents a PHP resource file
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
var Locale = require("ilib-locale");

/**
 * @class Represents a PHP resource file.
 *
 * @constructor
 * @param {Object} props properties that control the construction of this file.
 * @param {string} props.project the project that this resource file is part of
 * @param {string} props.pathName the path to the file, relative
 * to the root
 * @param {string} props.locale the locale of this resource file
 * @param {string} props.type the type of this resource file
 */
var PHPResourceFile = function(props) {
    this.locale = new Locale();

    if (props) {
        this.project = props.project;
        this.pathName = props.pathName;
        this.locale = new Locale(props.locale);
        this.API = props.project.getAPI();
        this.type = props.type;
    }

    this.logger = this.API.getLogger("loctool.plugin.PHPResourceFile");

    this.set = this.API.newTranslationSet(this.project && this.project.sourceLocale || "en-US");
};

/**
 * We don't read PHP resource files. We only write them.
 */
PHPResourceFile.prototype.extract = function() {};

/**
 * Get the locale of this resource file. For Android resource files, this
 * can be extracted automatically based on the name of the directory
 * that the file is in.
 *
 * @returns {String} the locale spec of this file
 */
PHPResourceFile.prototype.getLocale = function() {
    return this.locale;
};

/**
 * Get the locale of this resource file. For Android resource files, this
 * can be extracted automatically based on the name of the directory
 * that the file is in.
 *
 * @returns {String} the locale spec of this file
 */
PHPResourceFile.prototype.getContext = function() {
    return this.context;
};

/**
 * Get all resources from this file. This will return all resources
 * of mixed types (strings, arrays, or plurals).
 *
 * @returns {Resource} all of the resources available in this resource file.
 */
PHPResourceFile.prototype.getAll = function() {
    return this.set.getAll();
};

/**
 * Add a resource to this file. The locale of the resource
 * should correspond to the locale of the file, and the
 * context of the resource should match the context of
 * the file.
 *
 * @param {Resource} res a resource to add to this file
 */
PHPResourceFile.prototype.addResource = function(res) {
    this.logger.trace("PHPResourceFile.addResource: " + JSON.stringify(res) + " to " + this.project.getProjectId() + ", " + this.locale + ", " + JSON.stringify(this.context));
    var resLocale = res.getTargetLocale() || res.getSourceLocale();
    if (res && res.getProject() === this.project.getProjectId() && resLocale === this.locale.getSpec()) {
        this.logger.trace("correct project, context, and locale. Adding.");
        this.set.add(res);
    } else {
        if (res) {
            if (res.getProject() !== this.project.getProjectId()) {
                this.logger.warn("Attempt to add a resource to a resource file with the incorrect project.");
            } else {
                this.logger.warn("Attempt to add a resource to a resource file with the incorrect locale. " + resLocale + " vs. " + this.locale.getSpec());
            }
        } else {
            this.logger.warn("Attempt to add an undefined resource to a resource file.");
        }
    }
};

/**
 * Return true if this resource file has been modified
 * since it was loaded from disk.
 *
 * @returns {boolean} true if this resource file has been
 * modified since it was loaded
 */
PHPResourceFile.prototype.isDirty = function() {
    return this.set.isDirty();
};

// we don't localize resource files
PHPResourceFile.prototype.localize = function() {};

function clean(str) {
    return str.replace(/\s+/, " ").trim();
}

function escapeQuotes(str) {
    return str.replace(/'/g, "\\'");
}

/**
 * Return the default locale spec for this resource file.
 * @private
 */
PHPResourceFile.prototype.getDefaultSpec = function() {
    if (!this.defaultSpec) {
        this.defaultSpec = this.project.settings.localeDefaults ?
            this.API.utils.getLocaleDefault(this.locale, this.flavor, this.project.settings.localeDefaults) :
            this.locale.getSpec();
    }

    return this.defaultSpec;
};

/**
 * Generate the content of the resource file.
 *
 * @private
 * @returns {String} the content of the resource file
 */
PHPResourceFile.prototype.getContent = function() {
    var spec = this.project.getOutputLocale(this.locale.getSpec());
    var prefix =
        '<?php\n' +
        '\n' +
        '/**\n' +
        ' * === Auto-generated class. Do not manually edit this file. ===\n' +
        ' *\n' +
        ' */\n' +
        // make sure to remove any hyphens from the locale spec so that it is
        // a valid PHP class name
        'class Translation' + spec.replace(/-/g, "") + '\n' +
        '{\\n' +
        '    /**\n' +
        '     * Gives the pre-populated map of tags to translations\n' +
        '     *\n' +
        '     * @return array\n' +
        '     */\n' +
        '    public function getTranslationsMap() {\n' +
        '        return [';
    var suffix =
        '        ];\n' +
        '    }\n' +
        '}\n' +
        '\n' +
        '?>\n';

    var output = prefix;

    if (this.set.isDirty()) {
        var resources = this.set.getAll();

        // make sure resources are sorted by key so that git diff works nicely across runs of the loctool
        resources.sort(function(left, right) {
            return (left.getKey() < right.getKey()) ? -1 : (left.getKey() > right.getKey() ? 1 : 0);
        });

        var resText = "";
        resources.map(function(resource) {
            if (resource.getTarget()) {
                this.logger.trace("writing translation for " + resource.getKey() + " as " + resource.getTarget());
                if (resText.length > 0) {
                    resText += ",";
                }
                resText += "\n            '" +
                    escapeQuotes(resource.getKey()) +
                    "' => '" +
                    escapeQuotes(resource.getTarget()) +
                    "'";
            } else {
                this.logger.trace("String resource " + resource.getKey() + " has no target text. Skipping...");
            }
        }.bind(this));
        output += resText;
    }
    output += '\n';
    output += suffix;

    return output;
};

/**
 * Find the path for the resource file for the given locale.
 *
 * @param {String} locale the name of the locale in which the resource
 * file will reside
 * @return {String} the php resource file path that serves the
 * given locale.
 */
PHPResourceFile.prototype.getResourceFilePath = function(locale) {
    if (this.pathName) return this.pathName;

    return this.type.getLocalizedPath(this.locale);
};

/**
 * Write the resource file out to disk again.
 */
PHPResourceFile.prototype.write = function() {
    this.logger.trace("writing resource file. [" + this.project.getProjectId() + "," + this.locale + "]");
    if (this.set.isDirty()) {
        if (!this.pathName) {
            this.logger.trace("Calculating path name ");

            // must be a new file, so create the name
            this.pathName = this.getResourceFilePath(this.locale);
        } else {
            this.defaultSpec = this.locale.getSpec();
        }

        this.logger.info("Writing PHP resources for locale " + this.locale + " to file " + this.pathName);

        dir = path.dirname(this.pathName);
        this.API.utils.makeDirs(dir);

        var js = this.getContent();
        fs.writeFileSync(this.pathName, js, "utf8");
        this.logger.debug("Wrote string translations to file " + this.pathName);
    } else {
        this.logger.debug("File " + this.pathName + " is not dirty. Skipping.");
    }
};

/**
 * Return the set of resources found in the current Android
 * resource file.
 *
 * @returns {TranslationSet} The set of resources found in the
 * current Java file.
 */
PHPResourceFile.prototype.getTranslationSet = function() {
    return this.set;
}

module.exports = PHPResourceFile;
