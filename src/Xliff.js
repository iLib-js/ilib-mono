/*
 * Xliff.js - model an xliff file
 *
 * Copyright © 2016-2017, 2019-2022 HealthTap, Inc. and JEDLSoft
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

import xmljs from 'xml-js';
import Locale from 'ilib-locale';
import { JSUtils } from 'ilib-common';

import TranslationUnit from './TranslationUnit.js';

/**
 * Return a string that can be used as an HTML attribute value.
 * @private
 * @param {string} str the string to escape
 * @returns {string} the escaped string
 */
function escapeAttr(str) {
    if (!str) return;
    return str.
        replace(/&/g, "&amp;").
        replace(/"/g, "&quot;").
        replace(/'/g, "&apos;").
        replace(/</g, "&lt;");
}

/**
 * Return the original string based on the one that was used as an attribute value.
 * @private
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

/**
 * @private
 */
function generatePluralComment(res, sourcePlurals, form) {
    var json = {};

    if (res.comment) {
        try {
            // see if its json already. If so, we'll add to it
            json = JSON.parse(res.comment);
        } catch (e) {
            // not json, so just return it as is
            return res.comment;
        }
    }

    json.pluralForm = form;
    json.pluralFormOther = res.getKey();

    return JSON.stringify(json);
}

/**
 * @private
 */
function versionString(num) {
    const parts = ("" + num).split(".");
    const integral = parts[0].toString();
    const fraction = parts[1] || "0";
    return integral + '.' + fraction;
}

/**
 * @private
 */
function makeArray(arrayOrObject) {
    return Array.isArray(arrayOrObject) ? arrayOrObject : [ arrayOrObject ];
}

/**
 * @private
 */
function makeTUHashKey(tu) {
    return [tu.file, tu.sourceLocale, tu.targetLocale || "", tu.project].join("_");
}

/**
 * Return true if the given locale spec is for an Asian locale that does
 * not have spaces between words, or false for any other type of language.
 *
 * @private
 * @param {String} spec the locale specification of the locale to test
 * @returns {boolean} true if the given spec is for an Asian locale, or
 * false otherwise
 */
function isAsianLocale(spec) {
    var locale = new Locale(spec);
    switch (locale.getLanguage()) {
        case 'zh':
        case 'ja':
        case 'th':
            return true;
        default:
            return false;
    }
}

/**
 * @class A class that represents an xliff file. Xliff stands for Xml 
 * Localization Interchange File Format.
 */
export default class Xliff {

    /**
     * Construct a new Xliff instance. The options may be undefined,
     * which represents a new, clean Xliff instance. The options object may also
     * be an object with any of the following properties:
     *
     * <ul>
     * <li><i>tool-id</i> - the id of the tool that saved this xliff file
     * <li><i>tool-name</i> - the full name of the tool that saved this xliff file
     * <li><i>tool-version</i> - the version of the tool that save this xliff file
     * <li><i>tool-company</i> - the name of the company that made this tool
     * <li><i>copyright</i> - a copyright notice that you would like included into the xliff file
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
    constructor(options) {
        this.version = 1.2;

        if (options) {
            this["tool-id"] = options["tool-id"];
            this["tool-name"] = options["tool-name"];
            this["tool-version"] = options["tool-version"];
            this["tool-company"] = options["tool-company"];
            this.copyright = options.copyright;
            this.path = options.path;
            this.sourceLocale = options.sourceLocale;
            this.project = options.project;
            this.allowDups = options.allowDups;
            this.style =  options.style || "standard";
            if (typeof(options.version) !== 'undefined') {
                this.version = Number.parseFloat(options.version);
            }
        }

        this.sourceLocale = this.sourceLocale || "en-US";

        // place to store the translation units
        this.tu = [];
        this.tuhash = {};
    }

    /**
     * @private
     * @param project
     * @param context
     * @param sourceLocale
     * @param targetLocale
     * @param key
     * @param type
     * @param path
     * @returns {String} the hash of the above parameters
     */
    _hashKey(project, context, sourceLocale, targetLocale, key, type, path, ordinal, quantity, flavor) {
        const hashkey = [key, type || "string", sourceLocale || this.sourceLocale, targetLocale || "", context || "", project, path || "", ordinal || "", quantity || "", flavor || ""].join("_");
        return hashkey;
    }

    /**
     * Get the translation units in this xliff.
     *
     * @returns {Array.<Object>} the translation units in this xliff
     */
    getTranslationUnits() {
        return this.tu;
    }

    /**
     * Add this translation unit to this xliff.
     *
     * @param {TranslationUnit} unit the translation unit to add to this xliff
     */
    addTranslationUnit = function(unit) {
        // console.log("Xliff " + this.path + ": Adding translation unit: " + JSON.stringify(unit, undefined, 4));

        var hashKeySource = this._hashKey(unit.project, unit.context, unit.sourceLocale, "", unit.key, unit.resType, unit.file, unit.ordinal, unit.quantity, unit.flavor),
            hashKeyTarget = this._hashKey(unit.project, unit.context, unit.sourceLocale, unit.targetLocale, unit.key, unit.resType, unit.file, unit.ordinal, unit.quantity, unit.flavor);

        if (unit.targetLocale) {
            var oldUnit = this.tuhash[hashKeySource];
            if (oldUnit) {
                // console.log("Replacing old source-only unit in favour of this joint source/target unit");
                this.tuhash[hashKeySource] = undefined;
                JSUtils.shallowCopy(unit, oldUnit);
                this.tuhash[hashKeyTarget] = oldUnit;
                return;
            }
        }

        var oldUnit = this.tuhash[hashKeyTarget];
        if (oldUnit && !this.allowDups) {
            // console.log("Merging unit");
            // update the old unit with this new info
            JSUtils.shallowCopy(unit, oldUnit);
        } else {
            if (this.version >= 2 && this.tu.length) {
                if (this.tu[0].targetLocale !== unit.targetLocale) {
                    throw "Mismatched target locale";
                }
            }

            // console.log("Adding new unit");
            this.tu.push(unit);
            this.tuhash[hashKeyTarget] = unit;
        }
    }

    /**
     * Add translation units to this xliff.
     *
     * @param {Array.<Object>} files the translation units to add to this xliff
     */
    addTranslationUnits(units) {
        units.forEach((unit) => {
            this.addTranslationUnit(unit);
        });
    }

    /**
     * Return the number of translation units in this xliff file.
     *
     * @return {number} the number of translation units in this xliff file
     */
    size() {
        return this.tu.length;
    }

    /**
     * Serialize this xliff instance as an xliff 1.2 string.
     * @return {String} the current instance encoded as an xliff 1.2
     * format string
     */
    toString1() {
        const units = this.tu;

        let json = {
            xliff: {
                _attributes: {
                    version: versionString(this.version)
                }
            }
        };

        // console.log("Units to write out is " + JSON.stringify(units, undefined, 4));

        // now finally add each of the units to the json

        let files = {};
        let index = 1;

        for (var i = 0; i < units.length; i++) {
            let tu = units[i];
            if (!tu) {
                console.log("undefined?");
            }
            var hashKey = makeTUHashKey(tu);
            var file = files[hashKey];
            if (!file) {
                files[hashKey] = file = {
                    _attributes: {
                        "original": tu.file,
                        "source-language": tu.sourceLocale,
                        "target-language": tu.targetLocale,
                        "product-name": tu.project,
                        "x-flavor": tu.flavor
                    }
                };
                if (this["tool-id"] || this["tool-name"] || this["tool-version"] || this["tool-company"] ||  this["company"]) {
                    file.header = {
                        "tool": {
                            _attributes: {
                                "tool-id": this["tool-id"],
                                "tool-name": this["tool-name"],
                                "tool-version": this["tool-version"],
                                "tool-company": this["tool-company"],
                                "copyright": this["copyright"]
                            }
                        }
                    };
                }
                file.body = {};
            }

            var tujson = {
                _attributes: {
                    "id": (tu.id || index++),
                    "resname": escapeAttr(tu.key),
                    "restype": tu.resType || "string",
                    "datatype": tu.datatype
                },
                "source": {
                    "_text": tu.source
                }
            };

            if (tu.id && tu.id > index) {
                index = tu.id + 1;
            }

            if (tu.resType === "plural") {
                tujson._attributes.extype = tu.quantity || "other";
            }
            if (tu.resType === "array") {
                tujson._attributes.extype = tu.ordinal;
            }

            if (tu.target) {
                tujson.target = {
                    _attributes: {
                        state: tu.state
                    },
                    "_text": tu.target
                };
            }
            if (tu.comment) {
                tujson.note = {
                    "_text": tu.comment
                };
            }
            if (tu.context) {
                tujson._attributes["x-context"] = tu.context;
            }
            if (!file.body["trans-unit"]) {
                file.body["trans-unit"] = [];
            }

            file.body["trans-unit"].push(tujson);
        }

        // sort the file tags so that they come out in the same order each time
        if (!json.xliff.file) {
            json.xliff.file = [];
        }
        Object.keys(files).sort().forEach(function(fileHashKey) {
            json.xliff.file.push(files[fileHashKey]);
        });

        // logger.trace("json is " + JSON.stringify(json, undefined, 4));

        return '<?xml version="1.0" encoding="utf-8"?>\n' + xmljs.js2xml(json, {
            compact: true,
            spaces: 2
        });
    }

    /**
     * Serialize this xliff instance as an xliff 2.0 string.
     * @return {String} the current instance encoded as an xliff 2.0
     * format string
     */
    toString2() {
        // in xliff 2.* you can only put one source/target locale combo into a file,
        // so we have to take only the units that are allowed. We will key off the
        // first translation unit

        var sourceLocale = this.tu[0].sourceLocale;
        var targetLocale = this.tu[0].targetLocale;

        const units = this.tu.filter((unit) => {
            return unit.sourceLocale === sourceLocale && (!targetLocale || unit.targetLocale === targetLocale);
        });

        let json = {
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

        // console.log("Units to write out is " + JSON.stringify(units, undefined, 4));

        // now finally add each of the units to the json

        let files = {};
        let index = 1;
        let datatype;
        let groupIndex = 1;

        for (var i = 0; i < units.length; i++) {
            let tu = units[i];
            if (!tu) {
                console.log("undefined?");
            }
            let hashKey = makeTUHashKey(tu);
            let file = files[hashKey];
            if (!file) {
                files[hashKey] = file = {
                    _attributes: {
                        "original": tu.file,
                        "l:project": tu.project,
                        "l:flavor": tu.flavor
                    },
                    group : [
                        {
                            _attributes: {
                                "id": "group_" + groupIndex++,
                                "name": tu.datatype || "plaintext"
                            },
                            unit: []
                        }
                    ]
                };
                if (this["tool-id"] || this["tool-name"] || this["tool-version"] || this["tool-company"] ||  this["company"]) {
                    file.header = {
                        "tool": {
                            _attributes: {
                                "tool-id": this["tool-id"],
                                "tool-name": this["tool-name"],
                                "tool-version": this["tool-version"],
                                "tool-company": this["tool-company"],
                                "copyright": this["copyright"]
                            }
                        }
                    };
                }
            }

            var tujson = {
                _attributes: {
                    "id": (tu.id || index++),
                    "name": (tu.source !== tu.key) ? escapeAttr(tu.key) : undefined,
                    "type": "res:" + (tu.resType || "string"),
                    "l:datatype": tu.datatype
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

            if (tu.resType === "plural") {
                tujson._attributes["l:category"] = tu.quantity || "other";
            }
            if (tu.resType === "array") {
                tujson._attributes["l:index"] = tu.ordinal;
            }

            if (tu.target) {
                tujson.segment[0].target = {
                    _attributes: {
                        state: tu.state,
                    },
                    "_text": tu.target
                };
            }
            if (tu.context) {
                tujson._attributes["l:context"] = tu.context;
            }

            datatype = tujson._attributes["l:datatype"] || "plaintext";
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
            });

            if (existGroup.length > 0) {
                existGroup[0].unit.push(tujson);
            } else {
                groupSet._attributes.id = "group_" + groupIndex++;
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

        return '<?xml version="1.0" encoding="utf-8"?>\n' + xmljs.js2xml(json, {
            compact: true,
            spaces: 2
        });
    }

    /**
     * Serialize this xliff instance as an customized xliff 2.0 format string.
     * @return {String} the current instance encoded as an customized xliff 2.0
     * format string
     */
    toStringCustom() {
        var sourceLocale = this.tu[0].sourceLocale;
        var targetLocale = this.tu[0].targetLocale;

        const units = this.tu.filter((unit) => {
            return unit.sourceLocale === sourceLocale && (!targetLocale || unit.targetLocale === targetLocale);
        });

        let json = {
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

        // console.log("Units to write out is " + JSON.stringify(units, undefined, 4));

        // now finally add each of the units to the json

        let files = {};
        let index = 1;
        let fileIndex = 1;
        let datatype;
        let groupIndex = 1;

        for (let i = 0; i < units.length; i++) {
            let tu = units[i];
            if (!tu) {
                console.log("undefined?");
            }
            let hashKey = tu.project;
            let file = files[hashKey];
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

            let tujson = {
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

            let groupSet = {
                _attributes: {},
                unit: []
            }

            let existGroup = files[hashKey].group.filter(function(item) {
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

        return '<?xml version="1.0" encoding="utf-8"?>\n' + xmljs.js2xml(json, {
            compact: true,
            spaces: 2
        });
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
    serialize(untranslated) {
        let units = [];

        return ((this.version < 2) ? this.toString1() : (this.style == "custom" ? this.toStringCustom(): this.toString2()));
    }

    /**
     * Parse xliff 1.* files
     * @private
     */
    parse1(xliff) {
        if (xliff.file) {
            const files = makeArray(xliff.file);
            let comment;

            for (var i = 0; i < files.length; i++) {
                let fileSettings = {};
                let file = files[i];

                fileSettings = {
                    pathName: file._attributes.original,
                    locale: file._attributes["source-language"],
                    project: file._attributes["product-name"] || file._attributes["original"],
                    targetLocale: file._attributes["target-language"],
                    flavor: file._attributes["x-flavor"]
                };

                fileSettings.isAsianLocale = isAsianLocale(fileSettings.targetLocale);

                if (file.body && file.body["trans-unit"]) {
                    const units = makeArray(file.body["trans-unit"]);

                    units.forEach((tu) => {
                        if (tu.source && tu.source["_text"] && tu.source["_text"].trim().length > 0) {
                            let targetString;
                            if (tu.target) {
                                if (tu.target["_text"]) {
                                    targetString = tu.target["_text"];
                                } else if (tu.target.mrk) {
                                    if (Array.isArray(tu.target.mrk)) {
                                        const targetSegments = tu.target.mrk.map((mrk) => {
                                            return mrk["_text"];
                                        })
                                        targetString = targetSegments.join(fileSettings.isAsianLocale ? '' : ' ');
                                    } else {
                                        targetString = tu.target.mrk["_text"];
                                    }
                                }
                            }

                            if (!tu._attributes.resname) {
                                if (tu.source._attributes && tu.source._attributes["x-key"]) {
                                    tu.source["_text"] = tu.source._attributes["x-key"];
                                    tu._attributes.resname = tu.source._attributes["x-key"];
                                } else {
                                    tu._attributes.resname = tu.source["_text"];
                                }
                            }

                            try {
                                const unit = new TranslationUnit({
                                    file: fileSettings.pathName,
                                    sourceLocale: fileSettings.locale,
                                    project: fileSettings.project,
                                    id: tu._attributes.id,
                                    key: unescapeAttr(tu._attributes.resname),
                                    source: tu.source["_text"],
                                    context: tu._attributes["x-context"],
                                    comment: comment,
                                    targetLocale: fileSettings.targetLocale,
                                    comment: tu.note && tu.note["_text"],
                                    target: targetString,
                                    resType: tu._attributes.restype,
                                    state: tu.target && tu.target._attributes && tu.target._attributes.state,
                                    datatype: tu._attributes.datatype,
                                    flavor: fileSettings.flavor
                                });
                                switch (unit.resType) {
                                case "array":
                                    unit.ordinal = tu._attributes.extype && Number(tu._attributes.extype).valueOf();
                                    break;
                                case "plural":
                                    unit.quantity = tu._attributes.extype;
                                    break;
                                }
                                this.tu.push(unit);
                            } catch (e) {
                                console.log("Skipping invalid translation unit found in xliff file.\n" + e);
                            }
                        } else {
                            // console.log("Found translation unit with an empty or missing source element. File: " + fileSettings.pathName + " Resname: " + tu._attributes.resname);
                        }
                    });
                }
            }
        }
    }

    /**
     * Parse xliff 2.* files
     * @private
     */
    parse2(xliff) {
        const sourceLocale = xliff._attributes["srcLang"] || "en-US";
        const targetLocale = xliff._attributes["trgLang"];

        if (xliff.file) {
            const files = makeArray(xliff.file);

            for (var i = 0; i < files.length; i++) {
                let fileSettings = {};
                const file = files[i];
                let unitsElement = [];

                fileSettings = {
                    pathName: file._attributes["original"],
                    locale: sourceLocale,
                    project: file._attributes["l:project"] || file._attributes["original"],
                    targetLocale: targetLocale,
                    flavor: file._attributes["l:flavor"]
                };

                fileSettings.isAsianLocale = isAsianLocale(fileSettings.targetLocale);

                unitsElement = (typeof (file["group"]) != 'undefined') ? file.group : file;
                unitsElement = makeArray(unitsElement);

                for (let j = 0; j < unitsElement.length; j++) {
                    if (unitsElement[j].unit) {
                        var transUnits = makeArray(unitsElement[j].unit);
                        var unitElementName = unitsElement[j]["_attributes"].name;
                        transUnits.forEach(function(tu) {
                            let comment, state;
                            const datatype = tu._attributes["l:datatype"] || unitElementName;
                            let source = "", target = "";

                            if (tu.notes && tu.notes.note) {
                                comment = Array.isArray(tu.notes.note) ?
                                    tu.notes.note[0]["_text"] :
                                    tu.notes.note["_text"];
                            }

                            const resname = tu._attributes.name;
                            let restype = "string";
                            if (tu._attributes.type && tu._attributes.type.startsWith("res:")) {
                                restype = tu._attributes.type.substring(4);
                            }

                            if (tu.segment) {
                                const segments = makeArray(tu.segment);
                                for (var j = 0; j < segments.length; j++) {
                                    const segment = segments[j];

                                    if (segment.source["_text"]) {
                                        source += segment.source["_text"];
                                        if (segment.target) {
                                            if (segment.target["_text"]) {
                                                target += segment.target["_text"];
                                            } else if (segment.target.mrk) {
                                                if (Array.isArray(segment.target.mrk)) {
                                                    const targetSegments = segment.target.mrk.map((mrk) => {
                                                        return mrk["_text"];
                                                    })
                                                    target += targetSegments.join(fileSettings.isAsianLocale ? '' : ' ');
                                                } else {
                                                    target += segment.target.mrk["_text"];
                                                }
                                            }
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
                                    const unit = new TranslationUnit({
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
                                        flavor: fileSettings.flavor
                                    });
                                    switch (restype) {
                                    case "array":
                                        unit.ordinal = tu._attributes["l:index"] && Number(tu._attributes["l:index"]).valueOf();
                                        break;
                                    case "plural":
                                        unit.quantity = tu._attributes["l:category"];
                                        break;
                                    }
                                    this.tu.push(unit);
                                } catch (e) {
                                    console.log("Skipping invalid translation unit found in xliff file.\n" + e);
                                }
                            } else {
                                // console.log("Found translation unit with an empty or missing source element. File: " + fileSettings.pathName + " Resname: " + tu.resname);
                            }
                        }.bind(this));
                    }
                }
            }
        }
    }

    /**
     * Deserialize the given string as an xml file in xliff format
     * into this xliff instance. If there are any existing translation
     * units already in this instance, they will be removed first.
     *
     * @param {String} xml the xliff format text to parse
     */
    deserialize(xml) {
        const json = xmljs.xml2js(xml, {
            trim: false,
            nativeTypeAttribute: true,
            compact: true
        });

        if (json.xliff) {
            if (!json.xliff._attributes || !json.xliff._attributes.version ||
                    (!json.xliff._attributes.version.startsWith("1") && !json.xliff._attributes.version.startsWith("2"))) {
                // console.log("Unknown xliff version " + json.xliff._attributes.version + ". Cannot continue parsing.");
                return;
            }

            if (json.xliff._attributes.version.startsWith("1")) {
                this.parse1(json.xliff);
            } else {
                this.parse2(json.xliff);
            }
        }

        return this.tu;
    };

    /**
     * Return the version of this xliff file. If you deserialize a string into this
     * instance of Xliff, the version will be reset to whatever is found inside of
     * the xliff file.
     *
     * @returns {String} the version of this xliff
     */
    getVersion() {
        return this.version || "1.2";
    }
}