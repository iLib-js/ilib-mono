/*
 * XliffCompare.js - Compare two xliff files and output the differences
 *
 * Copyright © 2026 JEDLSoft
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
var path = require('path');
var log4js = require("log4js");
var XliffFactory = require("./XliffFactory.js");

var logger = log4js.getLogger("loctool.lib.XliffCompare");

/**
 * Compute a hash key for a translation unit. Matches the logic in
 * webOSXliff._hashKey so that unit identity is consistent across styles.
 * @private
 */
function tuHash(unit) {
    return [
        unit.source, unit.key, unit.resType || "string",
        unit.sourceLocale || "", unit.targetLocale || "",
        unit.context || "", unit.project || "", unit.file || "",
        unit.ordinal || "", unit.quantity || "", unit.flavor || "",
        unit.datatype || ""
    ].join("_");
}

/**
 * Compare two xliff files and return the differences categorized as
 * modified, added, and deleted translation units.
 *
 * - modified: unit exists in both files (same hash key) but target text differs
 * - added: unit exists only in current_xliff
 * - deleted: unit exists only in previous_xliff
 *
 * @param {Object} settings
 * @param {Array.<string>} settings.infiles [previous_xliff_path, current_xliff_path]
 * @param {string} settings.outfile path to the output directory
 * @param {number} settings.xliffVersion xliff version
 * @param {string} settings.xliffStyle xliff style
 * @returns {{ modified: Array, added: Array, deleted: Array } | undefined}
 */
var XliffCompare = function XliffCompare(settings) {
    if (!settings || !settings.infiles) return;

    var previousXliff = XliffFactory({ version: settings.xliffVersion, style: settings.xliffStyle });
    var currentXliff = XliffFactory({ version: settings.xliffVersion, style: settings.xliffStyle });

    if (!fs.existsSync(settings.infiles[0])) {
        logger.warn("Could not open previous file " + settings.infiles[0]);
        return;
    }
    if (!fs.existsSync(settings.infiles[1])) {
        logger.warn("Could not open current file " + settings.infiles[1]);
        return;
    }

    previousXliff.deserialize(fs.readFileSync(settings.infiles[0], "utf-8"));
    currentXliff.deserialize(fs.readFileSync(settings.infiles[1], "utf-8"));

    var previousUnits = previousXliff.getTranslationUnits();
    var currentUnits = currentXliff.getTranslationUnits();

    var previousMap = {};
    previousUnits.forEach(function(u) { previousMap[tuHash(u)] = u; });

    var currentMap = {};
    currentUnits.forEach(function(u) { currentMap[tuHash(u)] = u; });

    var modified = [];
    var added = [];
    var deleted = [];

    currentUnits.forEach(function(u) {
        var key = tuHash(u);
        if (!previousMap[key]) {
            added.push(u);
        } else if (u.target !== previousMap[key].target ||
                JSON.stringify(u.metadata) !== JSON.stringify(previousMap[key].metadata)) {
            modified.push(u);
        }
    });

    previousUnits.forEach(function(u) {
        if (!currentMap[tuHash(u)]) {
            deleted.push(u);
        }
    });

    return { modified: modified, added: added, deleted: deleted };
};

/**
 * Write the compare results to the output directory.
 * Files are only created if there are units of that type.
 *
 * @param {{ modified: Array, added: Array, deleted: Array }} result
 * @param {Object} settings
 * @returns {boolean} true if done
 */
XliffCompare.write = function(result, settings) {
    if (!result) return false;

    var outDir = settings.outfile;
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    function writeIfAny(units, filename) {
        if (!units || units.length === 0) {
            logger.info("No units for " + filename + ", skipping.");
            return;
        }
        var outPath = path.join(outDir, filename);
        var xliff = XliffFactory({
            path: outPath,
            version: settings.xliffVersion,
            style: settings.xliffStyle
        });
        xliff.addTranslationUnits(units);
        logger.info("Writing out " + outPath + "...");
        fs.writeFileSync(outPath, xliff.serialize(), "utf-8");
    }

    writeIfAny(result.modified, "modified.xliff");
    writeIfAny(result.added, "added.xliff");
    writeIfAny(result.deleted, "deleted.xliff");

    return true;
};

module.exports = XliffCompare;
