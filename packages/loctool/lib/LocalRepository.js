/*
 * LocalRepository.js - a collection of resource strings backed by a local set of files
 *
 * Copyright © 2016-2017, 2020, 2022, 2024 HealthTap, Inc.
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
var getIntermediateFile = require("./IntermediateFileFactory.js");

var logger = log4js.getLogger("loctool.lib.LocalRepository");

/**
 * @class A class that represents the local story of a set of
 * translations used in a project.
 *
 * @constructor
 * @param {String} sourceLocale the source locale for this set
 */
var LocalRepository = function (options) {
    logger.trace("LocalRepository constructor called");
    this.sourceLocale = "en-US";
    if (options) {
        this.sourceLocale = options.sourceLocale || "en-US";
        this.pseudoLocale = options.pseudoLocale;
        this.pathName = options.pathName;
        this.project = options.project || {settings:{}};
        this.xliffsDir = !this.pathName && options.xliffsDir ?
            (ilib.isArray(options.xliffsDir) ? options.xliffsDir : [options.xliffsDir]) :
            undefined;
        this.intermediateFormat = options.intermediateFormat;
    }
    this.intermediateFormat = this.intermediateFormat || "xliff";
    this.ts = new TranslationSet(this.sourceLocale);
};

// Recognize file names that use the BCP-47 locale specs of the form language-Script-REGION where:
// - language is the 2 letter lower-case ISO 639 code for the language
// - Script the 4 letter ISO 15924 code for the script with only the first letter capitalized. This part is optional.
// - REGION is the 2 letter upper-case ISO 3166 code for the region, OR the 3-digit UN.49 region code. This part is also optional.
var xliffFileFilter = /(^|[^a-z])([a-z][a-z][a-z]?)(-([A-Z][a-z][a-z][a-z]))?(-([A-Z][A-Z]|[0-9][0-9][0-9]))?\.xliff$/;
var poFileFilter = /(^|[^a-z])([a-z][a-z][a-z]?)(-([A-Z][a-z][a-z][a-z]))?(-([A-Z][A-Z]|[0-9][0-9][0-9]))?\.po$/;

// recognize the UN.49 3-digit region codes
var numericRegionCode = /^[0-9][0-9][0-9]$/;

/**
 * Initialize this repository and read in all of the strings.
 *
 * @param {Project} project the current project
 * @param {Function(Object, Object)} cb callback to call when the
 * initialization is done
 */
LocalRepository.prototype.init = function(cb) {
    if (!this.ts) {
        this.ts = new TranslationSet(this.sourceLocale); // empty set to start a new project
    }

    var numIFsRead = 0;
    var fileFormat = this.intermediateFormat;
    var fileFilter = fileFormat === "xliff" ? xliffFileFilter : poFileFilter;

    if (this.xliffsDir && this.xliffsDir.length > 0) {
        this.xliffsDir.forEach(function(dir) {
            if (fs.existsSync(dir)) {
                var list = fs.readdirSync(dir);
                var pathName;

                list.filter(function(file) {
                    var match = fileFilter.exec(file);
                    if (!match ||
                       match.length < 2 ||
                       (match.length >= 3 && match[2] && !utils.iso639[match[2]]) ||
                       (match.length >= 5 && match[4] && !utils.iso15924[match[4]]) ||
                       (match.length >= 7 && match[6] && !utils.iso3166[match[6]] && !numericRegionCode.test(match[6]))) {
                        return false;
                    }
                    return true;
                }).forEach(function (file) {
                    pathName = path.join(dir, file);
                    if (fs.existsSync(pathName)) {
                        var intermediateFile = getIntermediateFile({
                            sourceLocale: this.sourceLocale,
                            path: pathName
                        });
                        logger.info("Reading in translations from the xliffs dir: " + pathName);
                        var ts = intermediateFile.read();
                        this.ts.addSet(ts);
                        numIFsRead++;
                    } else {
                        logger.warn("Could not open file: " + pathName);
                    }
                }.bind(this));
                if (numIFsRead === 0) {
                    logger.warn("Dir exists, but could not read any translation files from it: " + this.xliffsDir);
                }
            } else {
               logger.warn("Xliff dir " + dir + " does not exist.");
            }
        }.bind(this));
    }

    if (this.pathName) {
        if (fs.existsSync(this.pathName)) {
            var intermediateFile = getIntermediateFile({
                path: this.pathName,
                sourceLocale: this.sourceLocale
            });
            logger.info("Reading in translations from: " + this.pathName);
            var ts = intermediateFile.read();
            this.ts.addSet(ts);
        } else {
            logger.debug("Could not open intermediate file: " + this.pathName);
        }
    }

    if (this.project.settings.convertPlurals) {
        this.ts.convertToPluralRes();
    }

    cb();
};

/**
 * Get a resource by its database id.
 *
 * @param {number} id the id of the record in the DB
 * @param {Function(Object, Object)} cb callback to call with the error code and the
 * resulting DB row or undefined if the retrieval did not succeed
 */
LocalRepository.prototype.get = function(id, cb) {
    cb(null, this.ts.getBy({id: id}));
};

/**
 * Get a resource by the given criteria.
 * @param {Object} criteria the filter criteria to select the resources to return
 * @param {Function(Object, Array.<Resource>|undefined)} cb callback to call with the error code and the
 * resulting array of Resources, or undefined if the retrieval did not succeed
 */
LocalRepository.prototype.getBy = function(options, cb) {
    logger.trace("Getting a resource by criteria");
    var resources = this.ts.getBy(options);
    cb(null, resources ? resources : []);
};

/**
 * Get a single resource with the given criteria. This method returns undefined if there is no
 * resource with the exact criteria given.
 *
 * @param {String} key The key of the resource being sought.
 * @param {String|undefined} type the type of this resource (string, array, or plural). Default is "string"
 * @param {String|undefined} context The optional context of the resource being sought.
 * @param {String|undefined} locale the locale of the resources
 * @param {String|undefined} project the project of the resources
 * @param {String|undefined} pathName path to the file containing the resource
 * @param {String|undefined} datatype data type of the resource being sought
 * @param {Function(Object, Array.<Resource>|undefined)} cb callback to call with the error code and the
 * resulting array of Resources, or undefined if the retrieval did not succeed
 */
LocalRepository.prototype.getResource = function(key, type, context, locale, project, pathName, datatype, cb) {
    logger.trace("Getting a resource by criteria");
    cb(null, this.ts.get(key, type, context, locale, project, pathName));
};

/**
 * Get a single resource with the given hashkey. This method returns undefined if there is no
 * resource with the exact criteria given.
 *
 * @param {String} hashkey The hashkey of the resource being sought.
 * @param {Function(Object, Resource|undefined)} cb callback to call with the error code and the
 * resulting Resource, or undefined if the retrieval did not succeed
 */
LocalRepository.prototype.getResourceByHashKey = function(hashkey, cb) {
    logger.trace("Getting a resource by criteria");
    cb(null, this.ts.get(hashkey));
};

/**
 * Get a single resource with the given hashkey. This method returns undefined if there is no
 * resource with the exact criteria given. Checks the byClean object in TranslationSet
 *
 * @param {String} hashkey The hashkey of the resource being sought.
 * @param {Function(Object, Resource|undefined)} cb callback to call with the error code and the
 * resulting Resource, or undefined if the retrieval did not succeed
 */
LocalRepository.prototype.getResourceByCleanHashKey = function(hashkey, cb) {
    logger.trace("Getting a resource by criteria");
    cb(null, this.ts.getClean(hashkey));
};

/**
 * Return an array of all the project names in the database.
 *
 * @param {Function(Array.<string>|undefined)} cb callback to call when
 * the names are retrieved. If there are no projects yet, then this
 * will return undefined.
 */
LocalRepository.prototype.getProjects = function(cb) {
    cb(this.ts.getProjects());
};

/**
 * Return an array of all the contexts within the given project
 * in the database. The root context is just the empty string.
 * The root context is where all strings will go if they are
 * not given an explicit context in the resource file or code.
 *
 * @param {String} project the project that contains the contexts
 * @param {Function(Array.<string>)} cb callback to call when
 * the contexts are retrieved. If there are no contexts in the
 * project, this method will return undefined.
 */
LocalRepository.prototype.getContexts = function(project, cb) {
    cb(this.ts.getContexts(project));
};

/**
 * Return an array of all the locales available within the given
 * project and context in the database. The root context is just
 * the empty string. The locales are returned as BCP-47 locale
 * specs.
 *
 * @param {String} project the project that contains the contexts
 * @param {String} context the context that contains the locales.
 * Use the empty string "" for the default/root context.
 * @param {Function(Array.<string>)} cb callback to call when
 * the locales are retrieved. If there are no locales in the
 * project/contexts, this method will return undefined.
 */
LocalRepository.prototype.getLocales = function(project, context, cb) {
    var locales = this.ts.getLocales(project, context);
    cb(locales);
};

/**
 * Return the translation set for local repository
 *
 * @returns {TranslationSet} the translation set
 *
 */
 LocalRepository.prototype.getTranslationSet = function() {
    return this.ts;
};

/**
 * Call the callback with true if the DB already contains the
 * given resource.
 *
 * @param {Resource} resource the resource to check
 * @param {Function(Array.<Resource>|undefined)} cb the callback
 * to call once it has been determined whether the DB contains
 * the resource already. If not, it returns undefined.
 */
LocalRepository.prototype.contains = function(resource, cb) {
    cb(this.ts.getBy(resource).length > 0);
};

/**
 * Add a resource to this set. If this resource has the same key
 * as an existing resource, but a different locale, then this
 * resource is added a translation instead.
 *
 * @param {Resource} resource a resource to add to this set
 * @param {Function} cb function to call when the resource is added
 */
LocalRepository.prototype.add = function(resource, cb) {
    this.ts.add(resource);
    cb(null, {
        affectedRows: resource.size()
    });
};

/**
 * Add every resource in the given translation set to this
 * repository. The resources will be updated if the resource
 * is already in the repository but contain different fields,
 * and will be added as new if not.
 *
 * @param {TranslationSet} set an set of resources to add
 * to the DB
 * @param {Function} cb callback function to call once
 * the resources are added to the DB
 */
LocalRepository.prototype.addAll = function(set, cb) {
    this.ts.addSet(set);
    cb(null, {
        affectedRows: set.size()
    });
};

/**
 * Return the number of strings in this set. This counts one for each plural string
 * and for each array member, so this does not correspond to the number of resources.
 *
 * @param {Function(number)} cb callback to call when the size of the table is determined
 */
LocalRepository.prototype.size = function(cb) {
    cb(this.ts.size());
};

/**
 * Remove a resource from the database. If the resource has an id, then the row with that id
 * will be removed.
 * @param {Resource} resource the resource to remove
 * @param {Function(Object,boolean)} cb the callback function to call when the removal is done.
 * The second parameter is a boolean that tells whether or not the removal was successful.
 */
LocalRepository.prototype.remove = function(resource, cb) {
    cb(null, this.ts.remove(resource));
};

/**
 * Remove all Resources from the table. WARNING: THIS IS PERMANENT. You can't get the records back
 * again. This method was intended to
 * be used in the unit tests only. Regular code should never call this method.
 * @param {Function} cb callback to call when the clear is done
 */
LocalRepository.prototype.clear = function(cb) {
    logger.trace("Clearing all resources");
    this.ts.clear();
    cb();
};

/**
 * Close the connection to the database and clean up. After this method is called,
 * no more calls can be made.
 * @param {Function} cb callback to call when the repository is closed
 */
LocalRepository.prototype.close = function(cb) {
    logger.trace("Closing local repository. Set is dirty? " + this.ts.isDirty());

    if (this.pathName && this.ts.isDirty()) {
        var fileFormat = this.intermediateFormat;
        var intermediateFile = getIntermediateFile({
            type: fileFormat,
            sourceLocale: this.sourceLocale,
            project: this.project,
            version: (this.project && this.project.settings.xliffVersion) || "1.2",
            path: this.pathName
        });
        logger.debug("Writing resources to " + this.pathName);
        intermediateFile.write(this.ts);
    }
    cb();
};

module.exports = LocalRepository;
