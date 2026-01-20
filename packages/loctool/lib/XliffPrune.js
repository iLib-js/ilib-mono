/*
 * XliffPrune.js - select and delete translation units based on criteria
 *
 * Copyright © 2026 Box, Inc.
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

var XliffFactory = require("./XliffFactory.js");

var logger = log4js.getLogger("loctool.lib.XliffPrune");

var XliffPrune = function XliffPrune(settings) {
    if (!settings) return;

    var target = XliffFactory({
        path: settings.outfile,
        version: settings.xliffVersion,
        style: settings.xliffStyle
    });
    logger.info("xliff style: `" + settings.xliffStyle + "`");

    if (!settings.infiles || settings.infiles.length !== 1) {
        throw new Error("Exactly one input file must be specified in 'infiles'.");
    }

    var infile = settings.infiles[0];

    if (!fs.existsSync(infile)) {
        throw new Error("Input file does not exist: " + infile);
    }

    logger.info("Processing " + infile + " ...");
    var data = fs.readFileSync(infile, "utf-8");
    var xliff = new XliffFactory({
        version: settings.xliffVersion,
        style: settings.xliffStyle
    });
    xliff.deserialize(data);
    let units = Object.values(xliff.getTranslationUnits());

    if (units.length > 0 && settings.criteria) {
        var criteria = XliffPrune.parseCriteria(settings.criteria);

        units = units.filter(function(unit) {
            if (criteria.category && (!unit.quantity || unit.quantity !== criteria.category)) {
                return true;
            }

            if (criteria.index && (!unit.ordinal || unit.ordinal !== criteria.index)) {
                return true;
            }

            if (criteria.fields) {
                var fieldNames = Object.keys(criteria.fields);
                for (var i = 0; i < fieldNames.length; i++) {
                    var field = fieldNames[i];
                    var re = criteria.fields[fieldNames[i]];
                    re.lastIndex = 0;
                    if (unit[field].match(re) === null) {
                        return true;
                    }
                }
            }

            return false; // Exclude units matching the criteria
        });
    }

    if (units.length > 0) {
        target.addTranslationUnits(units);
    } else {
        logger.warn("No translation units remain after deletion.");
    }

    return target;
};

XliffPrune.write = function (xliff) {
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

XliffPrune.parseCriteria = function (criteria) {
    if (!criteria) return {};

    var criteriaObj = {};

    var parts = criteria.split(/,/g);
    parts.every(function(part) {
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

        return true;
    });

    return criteriaObj;
};

module.exports = XliffPrune;
