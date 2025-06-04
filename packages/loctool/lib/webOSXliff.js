
/*
 * webOSXliff.js - model an xliff file for the webOS
 *
 * Copyright © 2025, JEDLSoft
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
var log4js = require("log4js");
var xmljs = require("xml-js");
var ilib = require("ilib");

var logger = log4js.getLogger("loctool.lib.Xliff");
var ResourceFactory = require("./ResourceFactory.js");
var TranslationSet = require("./TranslationSet.js");
var TranslationUnit = require("./Xliff.js").TranslationUnit;

/**
 * @class A class that represents an webOS  file.
 * The options may be undefined, which represents a new,
 * clean Xliff instance. The options object may also
 * be an object with the following properties:
 *
 * <ul>
 * <li><i>path</i> - the path to the xliff file on disk
 * <li><i>sourceLocale</i> - specify the default source locale if a resource doesn't have a locale itself
 * <li><i>allowDups</i> - allow duplicate resources in the xliff. By default, dups are
 * filtered out. This option allows you to have trans-units that represent instances of the
 * same resource in the file with different metadata. For example, two instances of a
 * resource may have different comments which may both be useful to translators or
 * two instances of the same resource may have been extracted from different source files.
 * <li><i>version</i> - The version of xliff that will be produced by this instance.
 * </ul>
 *
 * @constructor
 * @param {Array.<Object>|undefined} options options to
 * initialize the file, or undefined for a new empty file
 */

var webOSXliff = function webOSXliff(options) {
    if (options) {
        this.path = options.path;
        this.sourceLocale = options.sourceLocale;
        this.project = options.project;
        this.allowDups = options.allowDups;
        this.metadata = options.metadata;
        if (typeof(options.version) !== 'undefined') {
            this.version = Number.parseFloat(options.version);
        }
    }

    this.sourceLocale = this.sourceLocale || "en-US";
    this.version = this.version || 2.0;
    // place to store the translation units
    this.tu = [];
    this.tuhash = {};

    this.ts = new TranslationSet(this.sourceLocale);
}

webOSXliff.prototype.parse = function(xliff) {
    var sourceLocale = xliff._attributes["srcLang"] || this.project.sourceLocale;
    var targetLocale = xliff._attributes["trgLang"];
    
    if (xliff.file) {
        var files = ilib.isArray(xliff.file) ? xliff.file : [ xliff.file ];
         for (var i = 0; i < files.length; i++) {
            var fileSettings = {};
            var file = files[i];
            var unitsElement = [];
             fileSettings = {
                pathName: file._attributes["original"],
                locale: sourceLocale,
                project: file._attributes["l:project"] || file._attributes["original"],
                targetLocale: targetLocale,
                flavor: file._attributes["l:flavor"]
            };
            unitsElement = (typeof (file["group"]) != 'undefined') ? file.group : file;
            unitsElement = makeArray(unitsElement);
             for (var j=0; j < unitsElement.length; j++) {
                if (unitsElement[j].unit) {
                    var transUnits = makeArray(unitsElement[j].unit);
                    var unitElementName = unitsElement[j]["_attributes"].name;
                    transUnits.forEach(function(tu) {
                        var comment, state;
                        var datatype = tu._attributes["l:datatype"] || unitElementName;
                        var source = "", target = "";
                         if (tu.notes && tu.notes.note) {
                            comment = ilib.isArray(tu.notes.note) ?
                                tu.notes.note[0]["_text"] :
                                tu.notes.note["_text"];
                        }
                         var resname = tu._attributes.name;
                        var restype = "string";
                        if (tu._attributes.type && tu._attributes.type.startsWith("res:")) {
                            restype = tu._attributes.type.substring(4);
                        }
                         if (tu.segment) {
                            var segments = makeArray(tu.segment);
                            for (var j = 0; j < segments.length; j++) {
                                var segment = segments[j];
                                 if (segment.source["_text"]) {
                                    source += segment.source["_text"];
                                    if (segment.target) {
                                        target += segment.target["_text"];
                                         if (segment.target.state) {
                                            state = segment.target._attributes.state;
                                        }
                                    }
                                }
                            }
                        }
                         if (!resname) {
                            resname = source;
                        }
                         if (source.trim()) {
                            try {
                                var unit = new TranslationUnit({
                                    file: fileSettings.pathName,
                                    sourceLocale: fileSettings.locale,
                                    project: fileSettings.project,
                                    id: tu._attributes.id,
                                    key: unescapeAttr(resname),
                                    source: source,
                                    context: tu._attributes["l:context"],
                                    comment: comment,
                                    targetLocale: targetLocale,
                                    target: target,
                                    resType: restype,
                                    state: state,
                                    datatype: datatype,
                                    flavor: this.getFlavor(this.metadata, tu["mda:metadata"])
                                });
                                this.tu.push(unit);
                            } catch (e) {
                                logger.warn("Skipping invalid translation unit found in xliff file.\n" + e);
                            }
                        } else {
                            logger.warn("Found translation unit with an empty or missing source element. File: " + fileSettings.pathName + " Resname: " + tu.resname);
                        }
                    }.bind(this));
                }
            }
        }
    }
}


/**
 * Get the flavor data in thie unit
 *
 * @returns {String} the flavor info in thie unit.
 */
webOSXliff.prototype.getFlavor = function(metadata, tuData) {
    if (!tuData) return undefined;

    this.type = metadata["device-type"];
    var dataArr = tuData["mda:metaGroup"]['mda:meta'];
    var result = undefined;
    dataArr.forEach((item) => {
        if (item['_attributes']['type'] == this.type) {
            result = item['_text'];
        }
    });
    return result;
};

/**
 * Get the translation units in this xliff.
 *
 * @returns {Array.<Object>} the translation units in this xliff
 */
webOSXliff.prototype.getTranslationUnits = function() {
    return this.tu;
};

webOSXliff.prototype._hashKey = function(project, context, sourceLocale, targetLocale, key, type, path, ordinal, quantity, flavor) {
    var key = [key, type || "string", sourceLocale || this.sourceLocale, targetLocale || "", context || "", project, path || "", ordinal || "", quantity || "", flavor || ""].join("_");
    logger.trace("Hashkey is " + key);
    return key;
};


/**
 * Add this translation unit to this xliff.
 *
 * @param {TranslationUnit} unit the translation unit to add to this xliff
 */
webOSXliff.prototype.addTranslationUnit = function(unit) {
    logger.trace("Xliff " + this.path + ": Adding translation unit: " + JSON.stringify(unit, undefined, 4));

    var hashKeySource = this._hashKey(unit.project, unit.context, unit.sourceLocale, "", unit.key, unit.resType, unit.file, unit.ordinal, unit.quantity, unit.flavor),
        hashKeyTarget = this._hashKey(unit.project, unit.context, unit.sourceLocale, unit.targetLocale, unit.key, unit.resType, unit.file, unit.ordinal, unit.quantity, unit.flavor);

    if (unit.targetLocale) {
        var oldUnit = this.tuhash[hashKeySource];
        if (oldUnit) {
            logger.trace("Replacing old source-only unit in favour of this joint source/target unit");
            this.tuhash[hashKeySource] = undefined;
            JSUtils.shallowCopy(unit, oldUnit);
            this.tuhash[hashKeyTarget] = oldUnit;
            return;
        }
    }

    var oldUnit = this.tuhash[hashKeyTarget];
    if (oldUnit && !this.allowDups) {
        logger.trace("Merging unit");
        // update the old unit with this new info
        JSUtils.shallowCopy(unit, oldUnit);
    } else {
        if (this.version >= 2 && this.tu.length) {
            if (this.tu[0].targetLocale !== unit.targetLocale) {
                throw "Mismatched target locale";
            }
        }

        logger.trace("Adding new unit");
        this.tu.push(unit);
        this.tuhash[hashKeyTarget] = unit;
    }
};

/**
 * Add translation units to this xliff.
 *
 * @param {Array.<Object>} files the translation units to add to this xliff
 */
webOSXliff.prototype.addTranslationUnits = function(units) {
    for (var i = 0; i < units.length; i++) {
        this.addTranslationUnit(units[i]);
    }
};

/**
 * Add a resource to this xliff file. If a resource
 * with the same file, locale, context, and key already
 * exists in this xliff file, what happens to it is
 * determined by the allowDups option. If this is false,
 * the existing resource will be replaced, and if it
 * is true, this new resource will be added as an
 * instance of the existing resource.
 *
 * @param {Resource} res a resource to add
 */
webOSXliff.prototype.addResource = function(res) {
    if (!res) return;

    if (res.getTargetLocale() === this.sourceLocale || res.getTargetLocale() === "en") {
        // don't add this one... cannot translate TO the source locale!
        return;
    }

    this.ts.add(res);
};

/**
 * Add a set of resources to this xliff file. If a resource
 * with the same file, locale, context, and key already
 * exists in this xliff file, it will be
 * replaced instead of adding this unit to the file.
 *
 * @param {TranslationSet} set a set of resources to add
 */
webOSXliff.prototype.addSet = function(set) {
    if (!set) return;
    this.ts.addSet(set);
};

/**
 * Get the resources from this xliff file with the
 * given criteria. If the criteria object is undefined or empty,
 * then all resources are returned. If the criteria parameter
 * is an object, then only resources with properties
 * that match the properties and values in the criteria
 * object are returned.
 *
 * @param {Object|undefined} criteria an object with criteria for
 * selecting which resources to retrieve
 * @return {Array.<Resource>} an array of resources that match
 * the given criteria.
 */
webOSXliff.prototype.getResources = function(criteria) {
    var set = this.getTranslationSet();
    if (!criteria) return set.getAll();
    return set.getBy(criteria);
};

/**
 * Return the translation set containing all of the resources in
 * this xliff file.
 *
 * @returns {TranslationSet} the set of all resources in this file
 */
webOSXliff.prototype.getTranslationSet = function() {
    // if there are translation units, convert them to
    // resources in a translation set before returning the set.
    var res;

    if (this.tu) {
        for (var j = 0; j < this.tu.length; j++) {
            var comment, tu = this.tu[j];
            res = ResourceFactory({
                pathName: tu.file,
                project: tu.project,
                id: tu.id,
                key: tu.key,
                sourceLocale: tu.sourceLocale,
                source: tu.source,
                targetLocale: tu.targetLocale,
                context: tu.context,
                comment: tu.comment,
                resType: tu.resType,
                datatype: tu.datatype,
                state: tu.state,
                flavor: tu.flavor
            });
            
            if (tu.target) {
                res.setTarget(tu.target);
            }
            this.ts.add(res);
        }
    }
    return this.ts
};

/**
 * Deserialize the given string as an xml file in xliff format
 * into this xliff instance. If there are any existing translation
 * units already in this instance, they will be removed first.
 *
 * @param {String} xml the xliff format text to parse
 */
webOSXliff.prototype.deserialize = function(xml) {
    var json = xmljs.xml2js(xml, {
        trim: false,
        nativeTypeAttribute: true,
        compact: true
    });
    // logger.trace("json is " + JSON.stringify(json, undefined, 4));
    this.ts = new TranslationSet(this.sourceLocale);
    this.parse(json.xliff);
    return this.ts;
}

/**
 * Serialize this xliff instance as an customized xliff 2.0 format string.
 * @param {Array.<TranslationUnit>} units an array of units to convert to a string
 * @return {String} the current instance encoded as an customized xliff 2.0
 * format string
 */
webOSXliff.prototype.toStringData = function(units) {
    var sourceLocale = units[0].sourceLocale;
    var targetLocale = units[0].targetLocale;

    units = units.filter(function(unit) {
        return unit.sourceLocale === sourceLocale && (!targetLocale || unit.targetLocale === targetLocale);
    });

    var json = {
        xliff: {
            _attributes: {
                "version": versionString(this.version),
                "srcLang": sourceLocale,
            }
        }
    };

    if (targetLocale) {
        json.xliff._attributes.trgLang = targetLocale;
    }

    json.xliff._attributes["xmlns:l"] = "http://ilib-js.com/loctool";

    logger.trace("Units to write out is " + JSON.stringify(units, undefined, 4));

    // now finally add each of the units to the json

    var files = {};
    var index = 1;
    var fileIndex = 1;
    var datatype;
    var groupIndex = 1;

    for (var i = 0; i < units.length; i++) {
        var tu = units[i];
        if (!tu) {
            console.log("undefined?");
        }
        var hashKey = tu.project;
        var file = files[hashKey];
        if (!file) {
            files[hashKey] = file = {
                _attributes: {
                    "id": tu.project + "_f" + fileIndex++,
                    "original": tu.project
                },
                group : [
                    {
                        _attributes: {
                            "id": tu.project + "_g" + groupIndex++,
                            "name": tu.datatype || "javascript"
                        },
                        unit: []
                    }
                ]
            };
        }

        var tujson = {
            _attributes: {
                "id": (tu.id || index++),
                "name": (tu.source !== tu.key) ? escapeAttr(tu.key) : undefined,
            }
        };

        if (tu.comment) {
            tujson.notes = {
                "note": [
                    {
                        _attributes: {
                            "appliesTo": "source"
                        },
                        "_text": tu.comment
                    }
                ]
            };
        }

        tujson.segment = [
            {
                "source": {
                    "_text": tu.source
                }
            }
        ];

        if (tu.id && tu.id > index) {
            index = tu.id + 1;
        }

        if (tu.target) {
            tujson.segment[0].target = {
                _attributes: {
                    state: tu.state,
                },
                "_text": tu.target
            };
        }

        datatype = tu.datatype || "javascript";
        if (!files[hashKey].group) {
            files[hashKey].group = [];
        }

        var groupSet = {
            _attributes: {},
            unit: []
        }

        var existGroup = files[hashKey].group.filter(function(item) {
            if (item._attributes.name === datatype) {
                return item;
            }
        })

        if (existGroup.length > 0) {
            existGroup[0].unit.push(tujson);
        } else {
            groupSet._attributes.id = tu.project+ "_g" + groupIndex++;
            groupSet._attributes.name = datatype;
            files[hashKey].group.push(groupSet);
            groupSet.unit.push(tujson);
        }
    }

    // sort the file tags so that they come out in the same order each time
    if (!json.xliff.file) {
        json.xliff.file = [];
    }
    Object.keys(files).sort().forEach(function(fileHashKey) {
        json.xliff.file.push(files[fileHashKey]);
    });

    var xml = '<?xml version="1.0" encoding="utf-8"?>\n' + xmljs.js2xml(json, {
        compact: true,
        spaces: 2
    });

    return xml;
}

/**
 * Serialize this xliff instance to a string that contains
 * the xliff format xml text.
 *
 * @param {boolean} untranslated if true, add the untranslated resources
 * to the xliff file without target tags. Otherwiwe, untranslated
 * resources are skipped.
 * @return {String} the current instance encoded as an xliff format
 * xml text
 */
webOSXliff.prototype.serialize = function(untranslated) {
    var units = [];
    if (this.ts.size() > 0) {
        // first convert the resources into translation units
        var resources = this.ts.getAll();
        var tu;

        if (this.allowDups) {
            // only look at the initial set of resources
            var initialLength = resources.length;
            for (var i = 0; i < initialLength; i++) {
                var res = resources[i];
                var instances = res.getInstances();
                if (instances && instances.length) {
                    resources = resources.concat(instances);
                    resources[i].instances = undefined;
                }
            }
        }
        resources.sort(function(left, right) {
            if (typeof(left.index) === 'number' && typeof(right.index) === 'number') {
                return left.index - right.index;
            }
            if (typeof(left.id) === 'number' && typeof(right.id) === 'number') {
                return left.id - right.id;
            }
            // no ids and no indexes? Well, then don't rearrange
            return 0;
        });

        // now add the translations
        for (var i = 0; i < resources.length; i++) {
            var res = resources[i];
            if (res.getTargetLocale() !== this.sourceLocale) {
                units = units.concat(this.convertResource(res));
            }
        }
    }

    if (this.tu && this.tu.length > 0) {
        units = units.concat(this.tu);
    }

    return this.toStringData(units);

}

/**
 * Convert a resource into one or more translation units.
 *
 * @private
 * @param {Resource} res the resource to convert
 * @returns {Array.<TranslationUnit>} an array of translation units
 * that represent the resource
 */
webOSXliff.prototype._convertResource = function(res) {
    var units = [], tu;

    try {
        tu = new TranslationUnit({
            project: res.project,
            key: res.getKey(),
            file: res.getPath(),
            sourceLocale: res.getSourceLocale(),
            source: res.getSource(),
            targetLocale: res.getTargetLocale(),
            target: res.getTarget(),
            state: res.getState(),
            id: res.getId(),
            translated: true,
            context: res.context,
            comment: res.comment,
            resType: res.resType,
            datatype: res.datatype,
            flavor: res.getFlavor ? res.getFlavor() : undefined
        });
        units.push(tu);
    } catch (e) {
        logger.warn(e);
        logger.warn(JSON.stringify(res));
        logger.warn("Skipping that resource.");
    }
    return units;
};

/**
 * Convert a resource into translation units.
 *
 * @param {Resource} res the resource to convert
 * @returns {Array.<TranslationUnit>} an array of translation units
 * that represent the resource
 */
webOSXliff.prototype.convertResource = function(res) {
    return this._convertResource(res);
};

/**
 * Return the number of translation units in this xliff
 * file.
 *
 * @return {number} the number of translation units in this xliff file
 */
webOSXliff.prototype.size = function() {
    return this.ts.size();
};

/**
 * Get the path to this xliff file.
 * @returns {String|undefined} the path to this xliff file
 */
webOSXliff.prototype.getPath = function() {
    return this.path;
};

/**
 * Set the path to this xliff file.
 * @param {String} the path to the xliff file
 */
webOSXliff.prototype.setPath = function(pathName) {
    this.path = pathName;
};

function makeArray(arrayOrObject) {
    return ilib.isArray(arrayOrObject) ? arrayOrObject : [ arrayOrObject ];
}

/**
 * Return the original string based on the one that was used as an attribute value.
 * @param {string} str the string to unescape
 * @returns {string} the unescaped string
 */
function unescapeAttr(str) {
    if (!str) return;
    return str.
        replace(/&lt;/g, '<').
        replace(/&quot;/g, '"').
        replace(/&apos;/g, "'").
        replace(/&amp;/g, "&");
}

function versionString(num) {
    parts = ("" + num).split(".");
    integral = parts[0].toString();
    fraction = parts[1] || "0";
    return integral + '.' + fraction;
}

module.exports = webOSXliff;
