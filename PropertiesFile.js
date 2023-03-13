/*
 * PropertiesFile.js - represents a old-format java properties file
 *
 * Copyright © 2019, 2023 JEDLSoft
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
var isSpace = require("ilib/lib/isSpace.js");
var Locale = require("ilib/lib/Locale.js");
var IString = require("ilib/lib/IString.js");

/**
 * @class Represents a Java properties file in the traditional format.
 * If you need a new style xml properties file, you should use
 * ilib-loctool-properties-xml.<p>
 *
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
var PropertiesFile = function(props) {
    this.locale = new Locale();

    if (props) {
        this.project = props.project;
        this.pathName = props.pathName;
        this.locale = new Locale(props.locale);
        this.API = props.project.getAPI();
        this.type = props.type;
    }

    this.set = this.API.newTranslationSet(this.project && this.project.sourceLocale || "en-US");
    this.logger = this.API.getLogger("loctool.plugin.PropertiesFile");
};

var reUnicodeChar = /\\u([a-fA-F0-9]{1,4})/g;

/**
 * Unescape the string to make the same string that would be
 * in memory in the target programming language. This includes
 * unescaping both special and Unicode characters.
 *
 * @static
 * @param {String} string the string to unescape
 * @returns {String} the unescaped string
 */
PropertiesFile.unescapeString = function(string) {
    var unescaped = string;

    while ((match = reUnicodeChar.exec(unescaped))) {
        if (match && match.length > 1) {
            var value = parseInt(match[1], 16);
            unescaped = unescaped.replace(match[0], IString.fromCodePoint(value));
            reUnicodeChar.lastIndex = 0;
        }
    }

    unescaped = unescaped.
        replace(/^\\\\/g, "\\").
        replace(/([^\\])\\\\/g, "$1\\").
        replace(/\\'/g, "'").
        replace(/\\"/g, '"');

    return unescaped;
};

var singleLineRe = /^\s*(\S+)\s*[=:]\s*(.*)$/;
var commentRe = /#(\s*i18n:\s*)?(.*)$/;

function skipLine(line) {
    if (!line || !line.length) return true;
    var i = 0;
    while (isSpace(line[i]) && i < line.length) i++;
    if (i >= line.length || line[i] === '#' || line[i] === "!") return true;
    return false;
}

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 * @param {String} data the string to parse
 */
PropertiesFile.prototype.parse = function(data) {
    var match, match2, source, comment = undefined, lines = data.split(/\n/g);

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (skipLine(line)) {
            // any comments for the next line?
            commentRe.lastIndex = 0;
            match2 = commentRe.exec(line);
            if (match2 && match2[2]) {
                comment = match2[2];
            }
        } else {
            singleLineRe.lastIndex = 0;
            match = singleLineRe.exec(line);
            if (match) {
                source = match[2];
                commentRe.lastIndex = 0;
                match2 = commentRe.exec(source);
                if (match2 && match2[2]) {
                    comment = match2[2];
                    source = source.substring(0, match2.index);
                }
                var res = this.API.newResource({
                    resType: "string",
                    project: this.project.getProjectId(),
                    key: match[1],
                    sourceLocale: this.project.sourceLocale,
                    source: PropertiesFile.unescapeString(source),
                    autoKey: true,
                    pathName: this.pathName,
                    state: "new",
                    comment: comment,
                    datatype: this.type.datatype,
                    flavor: this.flavor
                });
                if (this.set.get(res.hashKey())) {
                    throw this.pathName + ":" + i + " Syntax error. Duplicate key " + match[1] + " found.";
                }
                this.set.add(res);
                comment = undefined; // reset for the next one
            }
        }
    }
};

/**
 * Extract the strings from the java properties file
 */
PropertiesFile.prototype.extract = function() {
    this.logger.debug("Extracting strings from " + this.pathName);
    if (this.pathName) {
        var p = path.join(this.project.root, this.pathName);
        try {
            var data = fs.readFileSync(p, "utf8");
            if (data) {
                this.parse(data);
            }
        } catch (e) {
            this.logger.warn("Could not read file: " + p);
        }
    }
};

/**
 * Get the path to this file.
 *
 * @returns {String} the path to this file
 */
PropertiesFile.prototype.getPath = function() {
    return this.pathName;
};

/**
 * Get the locale of this resource file. For Android resource files, this
 * can be extracted automatically based on the name of the directory
 * that the file is in.
 *
 * @returns {String} the locale spec of this file
 */
PropertiesFile.prototype.getLocale = function() {
    return this.locale;
};

/**
 * Get the locale of this resource file. For Android resource files, this
 * can be extracted automatically based on the name of the directory
 * that the file is in.
 *
 * @returns {String} the locale spec of this file
 */
PropertiesFile.prototype.getContext = function() {
    return this.context;
};

/**
 * Get all resources from this file. This will return all resources
 * of mixed types (strings, arrays, or plurals).
 *
 * @returns {Resource} all of the resources available in this resource file.
 */
PropertiesFile.prototype.getAll = function() {
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
PropertiesFile.prototype.addResource = function(res) {
    this.logger.trace("PropertiesFile.addResource: " + JSON.stringify(res) + " to " + this.project.getProjectId() + ", " + this.locale + ", " + JSON.stringify(this.context));
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
PropertiesFile.prototype.isDirty = function() {
    return this.set.isDirty();
};

// we don't localize resource files
PropertiesFile.prototype.localize = function() {};

function escapeString(str) {
    // if (!str) return undefined;
    str = str.replace(/(^|[^\\])"/g, '$1\\"');
    str = str.replace(/\n/g, "\\n");
    str = str.replace(/\t/g, "\\t");
    return str;
}

// we don't localize resource files
PropertiesFile.prototype.localize = function() {};

/**
 * Generate the content of the resource file.
 *
 * @private
 * @returns {String} the content of the resource file
 */
PropertiesFile.prototype.getContent = function() {
    var resources = this.set.getAll();
    var content = "";

    // make sure resources are sorted by key so that git diff works nicely across runs of the loctool
    resources.sort(function(left, right) {
        return (left.getKey() < right.getKey()) ? -1 : (left.getKey() > right.getKey() ? 1 : 0);
    });

    for (var j = 0; j < resources.length; j++) {
        var resource = resources[j];
        var target = resource.getTarget() || resource.getSource();
        content += resource.getKey() + ' = ' + escapeString(target);
        var comment = resource.getComment();
        if (comment) content += "# " + comment;
        content += '\n';
    }

    return content;
};

/**
 * Write the resource file out to disk again.
 */
PropertiesFile.prototype.write = function() {
    this.logger.trace("writing resource file. [" + [this.project.getProjectId(), this.locale].join(", ") + "]");
    if (this.set.isDirty()) {
        var dir;

        if (!this.pathName) {
            this.pathName = this.type.getResourceFilePath(this.locale || this.project.sourceLocale, undefined, "properties", this.flavor);
        }

        var p = path.join(this.project.target, this.pathName);
        dir = path.dirname(p);

        var resources = this.set.getAll();

        this.logger.info("Writing properties file for locale " + this.locale + " to file " + this.pathName);

        var content = this.getContent();

        this.API.utils.makeDirs(dir);

        fs.writeFileSync(p, content, "utf8");
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
PropertiesFile.prototype.getTranslationSet = function() {
    return this.set;
}

module.exports = PropertiesFile;
