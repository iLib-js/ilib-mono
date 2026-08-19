/*
 * XliffSelect.js - select translation units and write them to an output
 * file
 *
 * Copyright © 2024,2026 Box, Inc.
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
var log4js = require("log4js");
var ISet = require("ilib/lib/ISet.js");

var utils = require('./utils.js');
var XliffFactory = require("./XliffFactory.js");

var logger = log4js.getLogger("loctool.lib.XliffSelect");

/**
 * Default fields used to decide whether a translation unit has already
 * been seen. Used for load-time deduplication and for the bare "unique"
 * selection criterion.
 * @private
 */
var defaultUniqueFields = [
    "project",
    "targetLocale",
    "key",
    "datatype",
    "flavor",
    "context",
    "source"
];

// very simple tokenizer that only tokenizes by whitespace. This, of
// course, does not work so well in languages that do not use spaces
// between the words.
function wordCount(string) {
    return string.split(/\s+/).filter(function(word) {
        return word.trim().length > 0;
    }).length;
}

/**
 * Normalize a field name used in a unique: criterion.
 * @private
 * @param {string} field the field name from the criteria
 * @returns {string} normalized field name
 */
function normalizeUniqueField(field) {
    if (field === "resname") return "key";
    return field;
}

/**
 * Return the value of a field on a translation unit for uniqueness hashing.
 * @private
 * @param {TranslationUnit} unit the translation unit
 * @param {string} field the field name
 * @returns {string} the value to include in the hash
 */
function uniqueFieldValue(unit, field) {
    if (field === "pathName") {
        return unit.pathName || unit.file || "";
    }
    if (field === "source" || field === "target") {
        return utils.hashKey(unit[field] || "");
    }
    return unit[field] || "";
}

/**
 * Return a hash for the translation unit. This is used to identify
 * translation units that have already been seen so they are not
 * selected again.
 * @private
 * @param {TranslationUnit} unit the translation unit to hash
 * @param {Array.<string>} [fields] fields to include in the hash;
 *        defaults to the full uniqueness field set
 * @returns {string} the hash for the translation unit
 */
function tuHash(unit, fields) {
    var hashFields = fields || defaultUniqueFields;
    return hashFields.map(function(field) {
        return uniqueFieldValue(unit, field);
    }).join("_");
}


/**
 * Select translation units from the given xliff files and write them
 * to the named xliff outfile
 *
 * @param {Object} settings the settings object that configures
 * how the tool will operate based on command-line args
 * @param {string} settings.outfile path to the output xliff file
 * @param {string} settings.xliffVersion the version of the xliff file
 * @param {string} settings.xliffStyle the style of the xliff file
 * @param {Array.<string>} settings.infiles the paths to input xliff files
 * @param {string} settings.criteria selection criteria from the command-line
 * @param {Map.<string, string>} settings.extendedAttr extended attributes to add to the selected units
 * @param {string} settings.id the project id to add to the selected units
 * @returns {Xliff} xliff file with data merged into one
 *
 */
var XliffSelect = function XliffSelect(settings) {
    if (!settings) return;

    // Remember which files we have already read, so we don't have
    // to read them again.
    var fileNameCache = new ISet();
    var projectName = settings.id;

    var target = new XliffFactory({
        path: settings.outfile,
        version: settings.xliffVersion,
        style: settings.xliffStyle
    });

    var unitCache = {};

    var inputFiles = Array.isArray(settings.infiles) ? settings.infiles : [settings.infiles];
    inputFiles.forEach(function (file) {
        if (fileNameCache.has(file)) return;
        if (fs.existsSync(file)) {
            logger.info("Selecting from " + file + " ...");
            var data = fs.readFileSync(file, "utf-8");
            var xliff = new XliffFactory({
                version: settings.xliffVersion,
                style: settings.xliffStyle
            });
            xliff.deserialize(data);
            xliff.getTranslationUnits().forEach(function(unit) {
                if (projectName) {
                    unit.project = projectName;
                }
                unit.extended = unit.extended || {};
                if (typeof(settings.extendedAttr) === "object") {
                    Object.assign(unit.extended, settings.extendedAttr);
                }
                if (!settings.prune) {
                    unit.extended["original-file"] = file;
                }
                // Always collapse exact duplicates using the default field set
                // while loading. Narrower uniqueness (e.g. unique:key+source) is
                // applied later as a selection filter.
                var hash = tuHash(unit);
                unitCache[hash] = unit;
            });
            fileNameCache.add(file);
        } else {
            logger.warn("Could not open input file " + file);
        }
    });

    let units = Object.values(unitCache); // get all the units from the cache

    // now that they are merged, select from them according to
    // the selection criteria

    if (units.length > 0) {
        if (!settings.criteria) {
            if (settings.prune) {
                units = [];
            }
        } else {
            var criteria = XliffSelect.parseCriteria(settings.criteria);
            var totalunits = 0;
            var sourcewords = 0;
            var targetwords = 0;
            var seen = new ISet();

            if (criteria.random) {
                // Mix up the units first and then perform the normal criteria below.
                // This works by first assigning a random number to each unit, then
                // sorting by that random number, and finally just dropping that
                // number so that we are left with an array of randomly sorted units
                // where more filter criteria can be applied below.
                var random = units.map(function(unit) {
                    return {
                        index: Math.random(),
                        unit: unit
                    };
                });
                units = random.sort(function(left, right) {
                    return left.index - right.index;
                }).map(function(element) {
                    return element.unit;
                });
            }

            units = units.filter(function(unit) {
                var match = true;

                if (criteria.category && (!unit.quantity || unit.quantity !== criteria.category)) {
                    // units that are part of a plural have a quantity field
                    match = false;
                }

                if (criteria.index && (!unit.ordinal || unit.ordinal !== criteria.index)) {
                    // units that are part of an array have an ordinal field
                    match = false;
                }

                if (criteria.fields) {
                    var fieldNames = Object.keys(criteria.fields);
                    for (var i = 0; i < fieldNames.length; i++) {
                        var field = fieldNames[i];
                        var re = criteria.fields[field];
                        re.lastIndex = 0;
                        if (!unit[field] || unit[field].match(re) === null) {
                            match = false;
                        }
                    }
                }

                if (criteria.notFields) {
                    var notFieldNames = Object.keys(criteria.notFields);
                    for (var j = 0; j < notFieldNames.length; j++) {
                        var nfield = notFieldNames[j];
                        var nre = criteria.notFields[nfield];
                        nre.lastIndex = 0;
                        if (unit[nfield] && unit[nfield].match(nre) !== null) {
                            match = false;
                        }
                    }
                }

                // Uniqueness is "do not select this unit again if one with the
                // same identity was already selected". Applied after field filters
                // and before size budgets so that maxunits/maxsource count selected
                // units only.
                if (match && criteria.uniqueFields) {
                    var id = tuHash(unit, criteria.uniqueFields);
                    if (seen.has(id)) {
                        match = false;
                    } else {
                        seen.add(id);
                    }
                }

                if (match && criteria.maxunits) {
                    if (totalunits >= criteria.maxunits) {
                        match = false;
                    } else {
                        totalunits++;
                    }
                }

                if (match && criteria.maxsource) {
                    var sourceCount = wordCount(unit.source);
                    if (sourcewords + sourceCount >= criteria.maxsource) {
                        match = false;
                    } else {
                        sourcewords += sourceCount;
                    }
                }

                if (match && criteria.maxtarget) {
                    var targetCount = wordCount(unit.target);
                    if (targetwords + targetCount >= criteria.maxtarget) {
                        match = false;
                    } else {
                        targetwords += targetCount;
                    }
                }

                if (settings.prune) {
                    return !match;
                } else {
                    return match;
                }
            });
        }
    }

    if (units.length > 0) {
        target.addTranslationUnits(units);
    } else {
        // if no units were selected, then just return the empty target
        logger.warn("No translation units matched the selection criteria.");
    }

    return target;
};

/**
 * Write the resource file out to disk.
 *
 * @param {Xliff} xliff file with data merged into one
 * @return {boolean} true if it is done
 */
XliffSelect.write = function (xliff) {
    if (!xliff) return;
    logger.info("Writing out " + xliff.getPath() + "...");
    fs.writeFileSync(xliff.getPath(), xliff.serialize(), "utf-8");
    return true;
};

var knownFields = {
    project: true,
    context: true,
    sourceLocale: true,
    targetLocale: true,
    key: true,
    pathName: true,
    state: true,
    comment: true,
    dnt: true,
    datatype: true,
    resType: true,
    flavor: true,
    source: true,
    target: true
};

var knownCategoryNames = {
    zero: true,
    one: true,
    two: true,
    few: true,
    many: true,
    other: true
};

/**
 * Take a command-line criteria string and parse it into an object
 * with criteria in it.
 * @param {String} criteria the criteria string
 * @returns {Object} an object with the parsed criteria in the form
 * of properties that map to values to test against
 */
XliffSelect.parseCriteria = function (criteria) {
    if (!criteria) return {};

    var criteriaObj = {};

    var parts = criteria.split(/,/g);
    parts.every(function(part) {
        var lowerPart = part.toLowerCase();

        if (lowerPart.startsWith("maxunits:")) {
            criteriaObj.maxunits = parseInt(part.substring(9));
        } else if (lowerPart.startsWith("maxsource:")) {
            criteriaObj.maxsource = parseInt(part.substring(10));
        } else if (lowerPart.startsWith("maxtarget:")) {
            criteriaObj.maxtarget = parseInt(part.substring(10));
        } else if (lowerPart === "random") {
            criteriaObj.random = true;
        } else if (lowerPart === "unique") {
            criteriaObj.uniqueFields = defaultUniqueFields.slice();
        } else if (lowerPart.startsWith("unique:")) {
            var fieldList = part.substring(7);
            if (!fieldList) {
                throw new Error("Incorrect syntax for criteria: " + part);
            }
            var fields = fieldList.split("+").map(function(f) {
                return f.trim();
            }).filter(function(f) {
                return f.length > 0;
            });
            if (fields.length === 0) {
                throw new Error("Incorrect syntax for criteria: " + part);
            }
            criteriaObj.uniqueFields = fields.map(function(field) {
                // resname is accepted as an alias for key in unique: criteria only
                var normalized = normalizeUniqueField(field);
                if (!knownFields[normalized]) {
                    throw new Error("Unknown field name in criteria: " + part);
                }
                return normalized;
            });
        } else {
            // get the first equals sign only, as there may be equals signs in the regex
            var equals = part.indexOf("=");
            if (equals > 0) {
                var field = part.substring(0, equals);
                var value = part.substring(equals+1);
                if (!value) {
                    throw new Error("Incorrect syntax for criteria: " + part);
                }
                var op = part.substring(equals-1, equals+1) === '!=' ? '!=' : '=';
                if (op === '!=') {
                    field = field.substring(0, field.length-1);
                }
                var regex = new RegExp(value);
                var dot = field.indexOf(".");
                if (dot > -1) {
                    var subpart = field.substring(dot+1);
                    field = field.substring(0, dot);
                    var number = parseInt(subpart);
                    if (isNaN(number)) {
                        if (knownCategoryNames[subpart]) {
                            criteriaObj.category = subpart;
                        } else {
                            throw new Error("Unknown category name in criteria: " + part);
                        }
                    } else {
                        criteriaObj.index = number;
                    }
                }
                if (!knownFields[field]) {
                    throw new Error("Unknown field name in criteria: " + part);
                }
                if (op === "!=") {
                    if (!criteriaObj.notFields) criteriaObj.notFields = {};
                    criteriaObj.notFields[field] = regex;
                } else if (op === "=") {
                    if (!criteriaObj.fields) criteriaObj.fields = {};
                    criteriaObj.fields[field] = regex;
                } else {
                    throw new Error("Unknown operator in criteria: " + part);
                }
            } else {
                throw new Error("Incorrect syntax for criteria: " + part);
            }
        }

        return true;
    });

    return criteriaObj;
};


module.exports = XliffSelect;
