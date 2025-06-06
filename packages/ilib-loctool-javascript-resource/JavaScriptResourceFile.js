/*
 * JavaScriptResourceFile.js - represents a javascript resource file
 *
 * Copyright © 2019-2022, 2025 JEDLSoft
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
 * @class Represents an Android resource file.
 * The props may contain any of the following properties:
 *
 * <ul>
 * <li>project - the name of the project for this file
 * <li>pathName - the path to the file, relative to the root of the project
 * <li>type - type of this resource file
 * <li>locale - the locale of this file
 * </ul>
 * @param {Object} props properties that control the construction of this file.
 */
var JavaScriptResourceFile = function(props) {
    this.locale = new Locale();

    if (props) {
        this.project = props.project;
        this.pathName = props.pathName;
        this.locale = new Locale(props.locale);
        this.API = props.project.getAPI();
        this.type = props.type;
    }

    this.logger = this.API.getLogger("loctool.plugin.JavaScriptResourceFile");

    this.set = this.API.newTranslationSet(this.project && this.project.sourceLocale || "en-US");
    
    // defaults
    this.header = "ilib.data.strings_[localeUnder] = ";
    this.footer = ";\n";

    if (this.project && this.project.settings && this.project.settings.javascript) {
        var settings = this.project.settings.javascript;
        if (settings.header) {
            this.header = settings.header;
        }
        if (settings.footer) {
            this.footer = settings.footer;
        }
    }
};

/**
 * We don't read javascript resource files. We only write them.
 */
JavaScriptResourceFile.prototype.extract = function() {};

/**
 * Get the locale of this resource file. For Android resource files, this
 * can be extracted automatically based on the name of the directory
 * that the file is in.
 *
 * @returns {String} the locale spec of this file
 */
JavaScriptResourceFile.prototype.getLocale = function() {
    return this.locale;
};

/**
 * Get the locale of this resource file. For Android resource files, this
 * can be extracted automatically based on the name of the directory
 * that the file is in.
 *
 * @returns {String} the locale spec of this file
 */
JavaScriptResourceFile.prototype.getContext = function() {
    return this.context;
};

/**
 * Get all resources from this file. This will return all resources
 * of mixed types (strings, arrays, or plurals).
 *
 * @returns {Resource} all of the resources available in this resource file.
 */
JavaScriptResourceFile.prototype.getAll = function() {
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
JavaScriptResourceFile.prototype.addResource = function(res) {
    this.logger.trace("JavaScriptResourceFile.addResource: " + JSON.stringify(res) + " to " + this.project.getProjectId() + ", " + this.locale + ", " + JSON.stringify(this.context));
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
JavaScriptResourceFile.prototype.isDirty = function() {
    return this.set.isDirty();
};

// we don't localize resource files
JavaScriptResourceFile.prototype.localize = function() {};

function clean(str) {
    return str.replace(/\s+/, " ").trim();
}

/**
 * @private
 */
JavaScriptResourceFile.prototype.getDefaultSpec = function() {
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
JavaScriptResourceFile.prototype.getContent = function() {
    var json = {};

    if (this.set.isDirty()) {
        var resources = this.set.getAll();

        // make sure resources are sorted by key so that git diff works nicely across runs of the loctool
        resources.sort(function(left, right) {
            return (left.getKey() < right.getKey()) ? -1 : (left.getKey() > right.getKey() ? 1 : 0);
        });

        for (var j = 0; j < resources.length; j++) {
            var resource = resources[j];
            if (resource.getSource() && resource.getTarget()) {
                if (clean(resource.getSource()) !== clean(resource.getTarget())) {
                    this.logger.trace("writing translation for " + resource.getKey() + " as " + resource.getTarget());
                    json[resource.getKey()] = this.project.settings.identify ?
                        '<span loclang="javascript" locid="' + resource.getKey() + '">' + resource.getTarget() + '</span>' :
                        resource.getTarget();
                } else {
                    this.logger.trace("skipping translation with no change");
                }
            } else {
                this.logger.warn("String resource " + resource.getKey() + " has no source text. Skipping...");
            }
        }
    }

    var defaultLocale = this.pathName ? this.locale : new Locale(this.getDefaultSpec());

    // allow for a project-specific prefix to the file to do things like importing modules and such
    var output = "";
    var settings = this.project.settings;
    if (settings && settings.JavaScriptResourceFile && settings.JavaScriptResourceFile.prefix) {
        output = settings.JavaScriptResourceFile.prefix;
    }
    output += this.API.utils.formatPath(this.header, {
        locale: defaultLocale
    });
    output += JSON.stringify(json, undefined, 4);
    output += this.API.utils.formatPath(this.footer, {
        locale: defaultLocale
    });

    // take care of double-escaped unicode chars
    output = output.replace(/\\\\u/g, "\\u");

    return output;
};

/**
 * Find the path for the resource file for the given project, context,
 * and locale.
 *
 * @param {String} locale the name of the locale in which the resource
 * file will reside
 * @param {String|undefined} flavor the name of the flavor if any
 * @return {String} the ios strings resource file path that serves the
 * given project, context, and locale.
 */
JavaScriptResourceFile.prototype.getResourceFilePath = function(locale, flavor) {
    if (this.pathName) return this.pathName;

    var localeDir, dir, newPath, spec;
    locale = locale || this.locale;

    var defaultSpec = this.getDefaultSpec();

    var filename = defaultSpec + ".js";

    dir = path.join(this.project.target, this.project.getResourceDirs("js")[0] ||this.project.getResourceDirs("javascript")[0] || ".");
    newPath = path.join(dir, filename);

    this.logger.trace("Getting resource file path for locale " + locale + ": " + newPath);

    return newPath;
};

/**
 * Write the resource file out to disk again.
 */
JavaScriptResourceFile.prototype.write = function() {
    this.logger.trace("writing resource file. [" + this.project.getProjectId() + "," + this.locale + "]");
    if (this.set.isDirty()) {
        if (!this.pathName) {
            this.logger.trace("Calculating path name ");

            // must be a new file, so create the name
            this.pathName = this.getResourceFilePath();
        } else {
            this.defaultSpec = this.locale.getSpec();
        }

        var json = {};

        this.logger.info("Writing JavaScript resources for locale " + this.locale + " to file " + this.pathName);

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
JavaScriptResourceFile.prototype.getTranslationSet = function() {
    return this.set;
}

module.exports = JavaScriptResourceFile;
