/*
 * CSVFile.js - plugin to extract resources from a CSV source code file
 *
 * Copyright © 2020 JEDLSoft
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

var logger = log4js.getLogger("loctool.lib.CSVFile");

var whiteSpaceChars = [' ', '\t', '\f', '\n', '\r', '\v'];

/**
 * Create a new CSV file with the given path name and within
 * the given project.
 *
 * @param {Project} project the project object
 * @param {String} pathName path to the file relative to the root
 * of the project
 * file
 */
var CSVFile = function(options) {
    if (!options) return;

    this.project = options.project;
    this.pathName = options.pathName;

    this.datatype = "x-csv";
    this.API = this.project.getAPI();

    this.rowSeparatorRegex = new RegExp(options.rowSeparatorRegex || options.rowSeparator || '[\n\r\f]+');
    this.rowSeparator = options.rowSeparator || '\n';
    this.columnSeparator = options.columnSeparator || ',';

    var white, sep = whiteSpaceChars.indexOf(this.columnSeparator);
    white = (sep > -1) ? '[' + whiteSpaceChars.map(function(ch) {
        return ch !== this.columnSeparator ? ch : undefined;
    }.bind(this)).join('') + ']' : '\\s';

    this.columnSeparatorRegex = new RegExp(white + '*("(([^"]|\\\\"|"")*)"|([^' +
            this.columnSeparator + ']|\\\\' + this.columnSeparator + ')*)' +
            white + '*(' + this.columnSeparator + '|$)', "g");

    this.records = options.records || [];
    this.names = options.names || [];
    this.localizable = new Set(options.localizable);

    this.type = options.type;
    this.key = options.key || this.names[0];

    this.set = this.API.newTranslationSet(this.project ? this.project.sourceLocale : "zxx-XX");
};

/**
 * @private
 */
CSVFile.prototype._splitIt = function (line) {
    // take care of the escaped separators first
    var escaped = line.replace("\\" + this.columnSeparator, "%comma%");

    var result, results = [];

    this.columnSeparatorRegex.lastIndex = 0; // reset manually just to be safe

    while (this.columnSeparatorRegex.lastIndex < line.length && (result = this.columnSeparatorRegex.exec(escaped)) !== null) {
        var field = "";

        if (result[1]) {
            // result[2] is a quoted string -- unescape two double-quotes to only one
            field = result[2] ? result[2].replace(/""/g, '"') : result[1];
        }

        results.push(field.trim());
    }

    // put the escaped separators back again and unescape them
    return results.map(function(entry) {
        return entry.replace("%comma%", this.columnSeparator);
    }.bind(this));
}

/**
 * Make a new key for the given string.
 *
 * @private
 * @param {String} source the source string to make a resource
 * key for
 * @returns {String} a unique key for this string
 */
CSVFile.prototype.makeKey = function(source) {
    // the English source is the key as well with compressed and trimmed whitespace
    return source.
        replace(/\s+/g, " ").
        trim();
};

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 * @param {String} data the string to parse
 */
CSVFile.prototype.parse = function(data) {
    logger.debug("Parsing file " + this.pathName);
    if (!data) {
        this.records = [];
        return;
    }

    var lines = data.split(this.rowSeparatorRegex).filter(function(line) {
        return line && line.trim().length > 0;
    });

    // assume the first record has the names of the columns in it
    var names = this._splitIt(lines[0]);
    this.names = names;
    lines = lines.slice(1);

    this.records = lines.map(function(line) {
        var fields = this._splitIt(line);
        var json = {};
        names.forEach(function(name, i) {
            json[name] = i < fields.length ? fields[i] : "";
        });

        return json;
    }.bind(this));
};

/**
 * Extract all the localizable strings from the CSV file and add them to the
 * project's translation set.
 */
CSVFile.prototype.extract = function() {
    logger.debug("Extracting strings from " + this.pathName);
    if (this.pathName) {
        var p = path.join(this.project.root, this.pathName);
        try {
            var data = fs.readFileSync(p, "utf8");
            if (data) {
                this.parse(data);
            }
        } catch (e) {
            logger.warn("Could not read file: " + p);
            logger.warn(e);
        }
    }

    if (!this.records) this.records = []; // no file to load, so no records!
};

/**
 * Return the set of resources found in the current CSV file.
 *
 * @returns {TranslationSet} The set of resources found in the
 * current CSV file.
 */
CSVFile.prototype.getTranslationSet = function() {
    return this.set;
}

/**
 * Return the location on disk where the version of this file localized
 * for the given locale should be written.
 * @param {String] locale the locale spec for the target locale
 * @returns {String} the localized path name
 */
CSVFile.prototype.getLocalizedPath = function(locale) {
    return "";
    // TODO: implement CSVFile.getLocalizedPath()
    /*
    var fullPath = path.join(this.project.root, this.pathName);
    var dirName = path.dirname(fullPath);
    var fileName = path.basename(fullPath);

    var parts = fileName.split(".");

    if (parts.length > 2) {
        if (parts.length > 3 && parts[parts.length-3] === this.project.sourceLocale) {
            parts.splice(parts.length-3, 1, locale);
        } else {
            parts.splice(parts.length-2, 0, locale);
        }
    } else if (parts.length > 1) {
        parts.splice(parts.length-1, 0, locale);
    } else {
        parts.splice(parts.length, 0, locale);
    }
    return path.join(dirName, parts.join("."));
    */
};

/**
 * Localize the text of the current file to the given locale and return
 * the results.
 *
 * @param {TranslationSet} translations the current set of translations
 * @param {String} locale the locale to translate to
 * @returns {String} the localized text of this file
 */
CSVFile.prototype.localizeText = function(translations, locale) {
    return this.names.join(this.columnSeparator) + this.rowSeparator + this.records.map(function(record) {
        return this.names.map(function(name) {
            var text = record[name] || "",
                translated = text;

            var source = this.API.utils.escapeInvalidChars(text);
            var key = this.makeKey(source);
            var tester = this.API.newResource({
                type: "string",
                project: this.project.getProjectId(),
                sourceLocale: this.project.getSourceLocale(),
                reskey: key,
                datatype: this.datatype
            });
            var hashkey = tester.hashKeyForTranslation(locale);
            var translatedResource = translations.get(hashkey);

            if (text) {
                if (locale === this.project.pseudoLocale && this.project.settings.nopseudo) {
                    translated = source;
                } else if (translatedResource) {
                    translated = translatedResource.getTarget();
                } else if (this.type) {
                    if (this.type.pseudos && this.type.pseudos[locale]) {
                        var sourceLocale = this.type.pseudos[locale].getPseudoSourceLocale();
                        if (sourceLocale !== this.project.sourceLocale) {
                            // translation is derived from a different locale's translation instead of from the source string
                            var sourceRes = translations.get(tester.hashKeyForTranslation(sourceLocale));
                            source = sourceRes ? sourceRes.getTarget() : source;
                        }
                        translated = this.type.pseudos[locale].getString(source);
                    } else {
                        logger.trace("New string found: " + source);
                        this.type.newres.add(this.API.newResource({
                            resType: "string",
                            project: this.project.getProjectId(),
                            key: key,
                            sourceLocale: this.project.sourceLocale,
                            source: text,
                            targetLocale: locale,
                            target: text,
                            autoKey: true,
                            pathName: this.pathName,
                            state: "new",
                            datatype: this.datatype
                        }));
                        translated = this.project.settings.nopseudo && locale === this.project.pseudoLocale ? text : this.type.pseudoBundle.getStringJS(text);
                    }
                }
            }

            if (translated.indexOf(this.columnSeparator) > -1 || translated.trim() !== translated || translated.indexOf('\n') > -1 || translated.indexOf('"') > -1) {
                translated = '"' + translated.replace(/"/g, '""') + '"';
            }

            return translated;
        }.bind(this)).join(this.columnSeparator);
    }.bind(this)).join(this.rowSeparator);
};

/**
 * Localize the contents of this csv file and write out the
 * localized csv file to a different file path.
 *
 * @param {TranslationSet} translations the current set of
 * translations
 * @param {Array.<String>} locales array of locales to translate to
 */
CSVFile.prototype.localize = function(translations, locales) {
    // don't localize if there are no records
    if (this.records) {
        for (var i = 0; i < locales.length; i++) {
            var pathName = this.getLocalizedPath(locales[i]);
            logger.debug("Writing file " + pathName);
            var p = path.join(this.project.target, pathName);
            var d = path.dirname(p);
            this.API.utils.makeDirs(d);

            fs.writeFileSync(p, this.localizeText(translations, locales[i]), "utf-8");
        }
    } else {
        logger.debug(this.pathName + ": No records, no localize");
    }
};

/**
 * Merge the contents of the other csv file into the current one.
 * The records in each file are matched by a key which should be
 * specified to the constructor of this instance. Records in the
 * other csv which have the same key as an existing record in
 * this csv file which overwrite the values in the current file.
 * <p>
 * If the other csv file has a different schema than the current
 * one, then this method creates a superset record with merged
 * fields. For example, if the current csv has columns "a", "b",
 * and "c", and the other one has "a", "b", and "d" and the key
 * is given with column "a", then after the merge, records in
 * the current csv will have columns "a", "b", "c", and "d",
 * which may have empty values for some records.
 * <p>
 * @param {CSVFile} other an other csv file to merge with the
 * current one
 */
CSVFile.prototype.merge = function(other) {
    if (!other || !other.names || !other.records) return;

    other.names.forEach(function(name) {
        if (this.names.indexOf(name) === -1) {
            // missing
            this.names.push(name);
        }
    }.bind(this));

    if (!this.keyHash) {
        this.keyHash = {};
        this.records.forEach(function(record) {
            if (record[this.key]) {
                this.keyHash[record[this.key]] = record;
            }
        }.bind(this));
    }
    other.records.forEach(function(otherRecord) {
        var key = otherRecord[other.key];
        if (this.keyHash[key]) {
            // merge them
            var thisRecord = this.keyHash[key];
            other.names.forEach(function(name) {
                if (name !== other.key && otherRecord[name]) {
                    thisRecord[name] = otherRecord[name];
                }
            }.bind(this));
        } else {
            // add a new one
            this.records.push(otherRecord);
            this.keyHash[key] = otherRecord;
        }
    }.bind(this));
};

CSVFile.prototype.write = function() {
    var data = this.localizeText(undefined, this.project.sourceLocale);

    var p = path.join(this.project.target, this.pathName);
    var d = path.dirname(p);
    this.API.utils.makeDirs(d);

    if (data) {
        fs.writeFileSync(p, data, "utf-8");
    }
};

module.exports = CSVFile;
