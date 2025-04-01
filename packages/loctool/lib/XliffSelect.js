/*
 * XliffSelect.js - select translation units and write them to an output
 * file
 *
 * Copyright © 2024 Box, Inc.
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

var TranslationSet = require("./TranslationSet.js");
var Xliff = require("./Xliff.js");

var logger = log4js.getLogger("loctool.lib.XliffSelect");

// very simple tokenizer that only tokenizes by whitespace. This, of
// course, does not work so well in languages that do not use spaces
// between the words.
function wordCount(string) {
    return string.split(/\s+/).filter(function(word) {
        return word.trim().length > 0;
    }).length;
}

/**
 * Return a hash for the translation unit. This is used to identify
 * translation units in the cache so we can avoid adding duplicates.
 * @private
 * @param {TranslationUnit} unit the translation unit to hash
 * @returns {string} the hash for the translation unit
 */
function tuHash(unit) {
    return [unit.project, unit.targetLocale, unit.key].join("_");
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

    var target = new Xliff({
        path: settings.outfile,
        version: settings.xliffVersion,
        style: settings.xliffStyle
    });

    var unitCache = {};

    settings.infiles.forEach(function (file) {
        if (fileNameCache.has(file)) return;
        if (fs.existsSync(file)) {
            logger.info("Selecting from " + file + " ...");
            var data = fs.readFileSync(file, "utf-8");
            var xliff = new Xliff({
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
                unit.extended["original-file"] = file;
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

    if (units.length > 0 && settings.criteria) {
        var criteria = XliffSelect.parseCriteria(settings.criteria);
        var totalunits = 0;
        var sourcewords = 0;
        var targetwords = 0;
        
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
            if (criteria.maxunits) {
                if (totalunits >= criteria.maxunits) {
                    return false;
                }
                totalunits++;
            }

            if (criteria.maxsource) {
                var count = wordCount(unit.source);
                if (sourcewords + count >= criteria.maxsource) {
                    return false;
                }
                sourcewords += count;
            }

            if (criteria.maxtarget) {
                var count = wordCount(unit.target);
                if (targetwords + count >= criteria.maxtarget) {
                    return false;
                }
                targetwords += count;
            }

            if (criteria.category && (!unit.quantity || unit.quantity !== criteria.category)) {
                // units that are part of a plural have a quantity field
                return false;
            }

            if (criteria.index && (!unit.ordinal || unit.ordinal !== criteria.index)) {
                // units that are part of an array have an ordinal field
                return false;
            }

            if (criteria.fields) {
                var fieldNames = Object.keys(criteria.fields);
                for (var i = 0; i < fieldNames.length; i++) {
                    var field = fieldNames[i];
                    var re = criteria.fields[fieldNames[i]];
                    re.lastIndex = 0;
                    if (unit[field].match(re) === null) {
                        return false;
                    }
                }
            }

            return true;
        });
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
        } else {
            // get the first equals sign only, as there may be equals signs in the regex
            var equals = part.indexOf("=");
            if (equals > 0) {
                var field = part.substring(0, equals);
                var value = part.substring(equals+1);
                if (!value) {
                    throw new Error("Incorrect syntax for criteria: " + part);
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
                if (!criteriaObj.fields) criteriaObj.fields = {};
                criteriaObj.fields[field] = regex;
            } else {
                throw new Error("Incorrect syntax for criteria: " + part);
            }
        }

        return true;
    });

    return criteriaObj;
};


module.exports = XliffSelect;