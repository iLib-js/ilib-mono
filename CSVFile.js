/*
 * CSVFile.js - plugin to extract resources from a CSV source code file
 *
 * Copyright © 2020, 2023 JEDLSoft
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

    this.API = this.project.getAPI();
    this.type = options.type;

    this.mapping = this.type.getMapping(this.pathName);

    var sepRE = options.rowSeparatorRegex || options.rowSeparator;
    var sep = options.rowSeparator;
    var columnSep = options.columnSeparator;
    var headerRow = options.headerRow;
    var columns = options.columns;

    if (this.mapping) {
        if (!sepRE) {
            sepRE = this.mapping.rowSeparatorRegex || this.mapping.rowSeparatorRegex;
        }

        if (!sep) {
            sep = this.mapping.rowSeparator;
        }

        if (!columnSep) {
            columnSep = this.mapping.columnSeparator;
        }

        if (!columns) {
            columns = this.mapping.columns;
        }

        if (typeof(headerRow) === 'undefined') {
            headerRow = this.mapping.headerRow;
        }
    }

    this.rowSeparatorRegex = new RegExp(sepRE || '[\n\r\f]+');
    this.rowSeparator = sep || '\n';
    this.columnSeparator =  columnSep || ',';

    var white, sep = whiteSpaceChars.indexOf(this.columnSeparator);
    white = (sep > -1) ? '[' + whiteSpaceChars.map(function(ch) {
        return ch !== this.columnSeparator ? ch : undefined;
    }.bind(this)).join('') + ']' : '\\s';

    this.columnSeparatorRegex = new RegExp(white + '*("(([^"]|\\\\"|"")*)"|([^' +
            this.columnSeparator + ']|\\\\' + this.columnSeparator + ')*)' +
            white + '*(' + this.columnSeparator + '|$)', "g");

    this.records = options.records || [];
    this.headerRow = typeof(headerRow) === 'boolean' ? headerRow : true;
    this.columns = columns;

    var key;

    // undefined means all columns are localizable
    this.localizable = this.columns ? new Set(this.columns.filter(function(column) {
        if (column.key) {
            key = column.name;
        }
        return typeof(column.localizable) === 'boolean' && column.localizable;
    }).map(function(column) {
        return column.name;
    })) : undefined;

    this.key = options.key || key;

    this.sourceLocale = options.sourceLocale || (this.project && this.project.sourceLocale) || "zxx-XX";
    this.targetLocale = options.targetLocale; // if available

    this.set = this.API.newTranslationSet(this.sourceLocale);
    this.resourceIndex = 0;

    this.logger = this.API.getLogger("loctool.lib.CSVFile");
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
    this.logger.debug("Parsing file " + this.pathName);
    if (!data) {
        this.records = [];
        return;
    }

    var lines = data.split(this.rowSeparatorRegex).filter(function(line) {
        return line && line.trim().length > 0;
    });

    if (this.headerRow) {
        // the first record has the names of the columns in it
        if (!this.columns) {
            var names = this._splitIt(lines[0]);
            if (names && names.length) {
                if (!this.localizable) {
                    this.localizable = new Set();
                }
                this.columns = names.map(function(name) {
                    this.localizable.add(name);
                    return {
                        name: name,
                        localizable: true
                    };
                }.bind(this));
            }
        }
        lines = lines.slice(1);
    }

    this.records = lines.map(function(line) {
        var fields = this._splitIt(line);
        var json = {};
        this.columns.forEach(function(column, i) {
            json[column.name] = i < fields.length ? fields[i] : "";

            if (json[column.name] && (!this.localizable || this.localizable.has(column.name))) {
                // localizable field
                var source = this.API.utils.escapeInvalidChars(json[column.name]);
                this.set.add(this.API.newResource({
                    resType: "string",
                    project: this.project.getProjectId(),
                    key: this.makeKey(source),
                    sourceLocale: this.sourceLocale,
                    source: source,
                    pathName: this.pathName,
                    state: "new",
                    datatype: this.type.datatype,
                    index: this.resourceIndex++
                }));
            }
        }.bind(this));

        return json;
    }.bind(this));
};

/**
 * Extract all the localizable strings from the CSV file and add them to the
 * project's translation set.
 */
CSVFile.prototype.extract = function() {
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
            this.logger.warn(e);
        }
    }

    if (!this.records) this.records = []; // no file to load, so no records!
};

/**
 * Get the locale of this resource file. For Xliff files, this
 * can be extracted automatically based on the name of the directory
 * that the file is in.
 *
 * @returns {String} the locale spec of this file
 */
CSVFile.prototype.getLocale = function() {
    return this.locale;
};

/**
 * Get all resources from this file. This will return all resources
 * of mixed types (strings, arrays, or plurals).
 *
 * @returns {Resource} all of the resources available in this resource file.
 */
CSVFile.prototype.getAll = function() {
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
CSVFile.prototype.addResource = function(res) {
    this.logger.trace("CSVFile.addResource: " + JSON.stringify(res) + " to " + this.project.getProjectId() + ", " + this.locale + ", " + JSON.stringify(this.context));
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
    return this.API.utils.getLocalizedPath(this.mapping.template, this.pathName, locale);
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
    var header = this.headerRow && this.columns ? this.columns.map(function(column) { return column.name; }).join(this.columnSeparator) + this.rowSeparator : "";
    if (this.records && this.records.length) {
        return header + this.records.map(function(record) {
            return this.columns.map(function(column) {
                var text = record[column.name] || "",
                    translated = text;
    
                if (!text || !translations || (this.localizable && !this.localizable.has(column.name))) {
                    // not translatable or not a translatable column
                    return text;
                }
    
                var source = this.API.utils.escapeInvalidChars(text);
                var key = this.makeKey(source);
                var tester = this.API.newResource({
                    type: "string",
                    project: this.project.getProjectId(),
                    sourceLocale: this.sourceLocale,
                    reskey: key,
                    datatype: this.type.datatype
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
                            if (sourceLocale !== this.sourceLocale) {
                                // translation is derived from a different locale's translation instead of from the source string
                                var sourceRes = translations.get(tester.hashKeyForTranslation(sourceLocale));
                                source = sourceRes ? sourceRes.getTarget() : source;
                            }
                            translated = this.type.pseudos[locale].getString(source);
                        } else {
                            this.logger.trace("New string found: " + source);
                            this.type.newres.add(this.API.newResource({
                                resType: "string",
                                project: this.project.getProjectId(),
                                key: key,
                                sourceLocale: this.sourceLocale,
                                source: text,
                                targetLocale: locale,
                                target: text,
                                autoKey: true,
                                pathName: this.pathName,
                                state: "new",
                                datatype: this.type.datatype
                            }));
                            translated = !this.project.settings.nopseudo && this.type && this.type.missingPseudo ?
                                    this.type.missingPseudo.getString(text) : text;
                        }
                    }
                }
    
                if (translated.indexOf(this.columnSeparator) > -1 || translated.trim() !== translated || translated.indexOf('\n') > -1 || translated.indexOf('"') > -1) {
                    translated = '"' + translated.replace(/"/g, '""') + '"';
                }
    
                return translated;
            }.bind(this)).join(this.columnSeparator);
        }.bind(this)).join(this.rowSeparator);
    } else if (this.set.size() > 0) {
        // no source records available, so just output the resources by making
        // a simple 3 column file
        // with the first column being the key, the second being the source, and the
        // third being the translation (if any)
        var resources = this.set.getAll();
        return "key,source,target" + this.rowSeparator + resources.map(function(res) {
            return [
                res.getKey(),
                res.getSource(),
                res.getTarget()
            ].join(this.columnSeparator);
        }.bind(this)).join(this.rowSeparator);
    } else {
        console.log("ilib-loctool-csv: Warning: no records or resources to generate.");
        return undefined;
    }
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
            this.logger.debug("Writing file " + pathName);
            var p = path.join(this.project.target, pathName);
            var d = path.dirname(p);
            this.API.utils.makeDirs(d);
            var text = this.localizeText(translations, locales[i]);
            if (text) {
                fs.writeFileSync(p, text, "utf-8");
            } else {
                console.log("ilib-loctool-csv: warning: no contents written for file " + pathName);
            }
        }
    } else {
        this.logger.debug(this.pathName + ": No records, no localize");
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
    if (!other || !other.columns || !other.records) return;

    other.columns.forEach(function(column) {
        if (!this.columns.some(function(column2) { return column2.name === column.name; })) {
            // missing
            this.columns.push(column);
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
            other.columns.forEach(function(column) {
                if (column.name !== other.key && otherRecord[column.name]) {
                    thisRecord[column.name] = otherRecord[column.name];
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
