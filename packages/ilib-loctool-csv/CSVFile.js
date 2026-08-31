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
var CSV = require("ilib-csv").CSV;

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
            columnSep = this.mapping.columnSeparator || this.mapping.columnSeparatorChar;
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
    this.columnSeparator = columnSep || ',';

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

    var csv = new CSV({
        rowSeparatorRegex: this.rowSeparatorRegex,
        columnSeparator: this.columnSeparator,
        headerRow: this.headerRow,
        columns: this.columns
    });
    var records = csv.parse(data);

    if (records.length > 0 && !this.columns) {
        var names = Object.keys(records[0]);
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

    this.records = records;

    this.records.forEach(function(record) {
        this.columns.forEach(function(column) {
            var value = record[column.name];
            if (value && (!this.localizable || this.localizable.has(column.name))) {
                var source = this.API.utils.escapeInvalidChars(value);
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
    if (this.records && this.records.length && this.columns) {
        var translatedRecords = this.records.map(function(record) {
            var out = {};
            this.columns.forEach(function(column) {
                var text = record[column.name] || "",
                    translated = text;

                if (text && translations && (this.localizable && this.localizable.has(column.name))) {
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

                    if (locale === this.project.pseudoLocale && this.project.settings.nopseudo) {
                        translated = source;
                    } else if (translatedResource) {
                        translated = translatedResource.getTarget();
                    } else if (this.type) {
                        if (this.type.pseudos && this.type.pseudos[locale]) {
                            var sourceLocale = this.type.pseudos[locale].getPseudoSourceLocale();
                            if (sourceLocale !== this.sourceLocale) {
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

                out[column.name] = translated;
            }.bind(this));
            return out;
        }.bind(this));

        var csv = new CSV({
            outputRowSeparator: this.rowSeparator,
            columnSeparator: this.columnSeparator,
            headerRow: this.headerRow,
            columns: this.columns
        });
        return csv.generate(translatedRecords);
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
