/*
 * GenerateMode.js - Read xliff files.
 *
 * Copyright © 2020, 2024-2025, JEDLSoft
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
var ilib = require("ilib");

var utils = require("./utils.js");
var TranslationSet = require("./TranslationSet.js");
var iff = require("./IntermediateFileFactory.js");

var getIntermediateFile = iff.getIntermediateFile;
var logger = log4js.getLogger("loctool.lib.GenerateMode");

/**
 * @class A class that represents the local store of a set of
 * translations used in a project.
 *
 * @constructor
 * @param {Object} options the options for this mode
 * @param {String} options.translationsDir the directory that contains the intermediate files
 */
var GenerateMode = function (options) {
    logger.trace("GenerateMode constructor called");
    this.translationsDir = ["."];

    if (options) {
        var transDir = options.translationsDir || options.xliffsDir;
        this.translationsDir = transDir ?
            (ilib.isArray(transDir) ? transDir : [transDir]) :
            ["."];
        this.settings = options.settings;
    }
    this.ts = new TranslationSet(this.sourceLocale);
};

var xliffFileFilter = /([.*][\-])?([a-z][a-z][a-z]?)(-([A-Z][a-z][a-z][a-z]))?(-([A-Z][A-Z]))?\.xliff$/;
var poFileFilter = /([.*][\-])?([a-z][a-z][a-z]?)(-([A-Z][a-z][a-z][a-z]))?(-([A-Z][A-Z]))?\.po$/;

/**
 * Initialize this repository and read in all of the strings.
 *
 * @param {Project} project the current project
 * @param {Function(Object, Object)} cb callback to call when the
 * initialization is done
 */
GenerateMode.prototype.init = function() {
    var dirs = this.translationsDir;
    var list = [];
    var fileFormat = (this.settings && this.settings.intermediateFormat) || "xliff";
    var fileFilter = fileFormat === "xliff" ? xliffFileFilter : poFileFilter;

    dirs.forEach(function(dir) {
        try {
            var paths = fs.readdirSync(dir);
            list = list.concat(paths.map(function(filePath) {
               return path.normalize(path.join(dir, filePath));
            }));
        } catch (err) {
            logger.warn("xliff dir " + dir + " is an invalid directory");
        }
    });

    if (list) {
        list.filter(function(file) {
            var match = fileFilter.exec(file);
            if (!match ||
               match.length < 2 ||
               (match.length >= 3 && match[2] && !utils.iso639[match[2]]) ||
               (match.length >= 5 && match[4] && !utils.iso15924[match[4]]) ||
               (match.length >= 7 && match[6] && !utils.iso3166[match[6]])) {
                return false;
            }
            return true;
        }).forEach(function (pathName) {
            var intermediateFile = getIntermediateFile({
                sourceLocale: this.sourceLocale,
                path: pathName,
                style: this.settings?.xliffStyle || "standard",
            });
            if (fs.existsSync(pathName)) {
                this.ts.addSet(intermediateFile.read());
            } else {
                logger.warn("Could not open intermediate file: " + pathName);
            }
        }.bind(this));
    }
};

GenerateMode.prototype.getTranslationsDir = function() {
    return this.translationsDir;
};

GenerateMode.prototype.setTranslationsDir = function(dir) {
    this.translationsDir = ilib.isArray(dir) ? dir : [dir];
};

GenerateMode.prototype.getResSize = function() {
    return this.ts.resources.length;
};

module.exports = GenerateMode;