/*
 * Xliff.js - convert an Xliff file into a set of resources and vice versa
 *
 * Copyright © 2022-2023 JEDLSoft
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

import { Xliff, TranslationUnit } from 'ilib-xliff';
import log4js from "@log4js-node/log4js-api";

import ResourceString from './ResourceString.js';
import ResourceArray from './ResourceArray.js';
import ResourcePlural from './ResourcePlural.js';
import TranslationSet from './TranslationSet.js';
import Location from './Location.js';

import { isEmpty } from './utils.js';

const logger = log4js.getLogger("tools-common.ResourceXliff");

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
 * @class a class that represents resources as an xliff file.
 */
class ResourceXliff {
    /**
     * Construct a new resource xliff instance. Operation of the instance
     * is controlled via the options. The options may be undefined, which represents a new,
     * clean Xliff instance. The options object may also
     * be an object with the following properties:
     *
     * <ul>
     * <li><i>path</i> - the path to the xliff file on disk
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
     * <li><i>version</i> - The version of xliff that will be produced by this instance. This
     * may be either "1.2" or "2.0"
     * </ul>
     *
     * @constructor
     * @param {Array.<Object>|undefined} options options to
     * initialize the file, or undefined for a new empty file
     */
    constructor(options) {
        if (options) {
            this["tool-id"] = options["tool-id"];
            this["tool-name"] = options["tool-name"];
            this["tool-version"] = options["tool-version"];
            this["tool-company"] = options["tool-company"];
            this.copyright = options.copyright;
            this.path = options.path;
            this.sourceLocale = options.sourceLocale || "en-US";
            this.project = options.project;
            this.allowDups = options.allowDups;
            this.style =  options.style || "standard";
            if (typeof(options.version) !== 'undefined') {
                this.version = options.version;
            }
        }
        this.sourceLocale = this.sourceLocale || "en-US";

        this.xliff = new Xliff(options);
        this.ts = new TranslationSet(this.sourceLocale);
    }

    /**
     * Convert a resource into one or more translation units.
     *
     * @private
     * @param {Resource} res the resource to convert
     * @returns {Array.<TranslationUnit>} an array of translation units
     * that represent the resource
     */
    convertResource(res) {
        let units = [], tu;

        try {
            switch (res.resType) {
            case "string":
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
                    flavor: res.getFlavor ? res.getFlavor() : undefined,
                    translate: !res.getDNT(),
                    location: res.getLocation()
                });
                units.push(tu);
                break;

            case "array":
                const sarr = res.getSource();
                let tarr = res.getTarget();

                tu = new TranslationUnit({
                    project: res.project,
                    key: res.getKey(),
                    file: res.getPath(),
                    source: " ",
                    sourceLocale: res.getSourceLocale(),
                    targetLocale: res.getTargetLocale(),
                    state: res.getState(),
                    id: res.getId(),
                    translated: true,
                    context: res.context,
                    comment: res.comment,
                    resType: res.resType,
                    datatype: res.datatype,
                    flavor: res.getFlavor ? res.getFlavor() : undefined,
                    translate: !res.getDNT(),
                    location: res.getLocation()
                });

                for (let j = 0; j < sarr.length; j++) {
                    // only output array items that have a translation
                    if (sarr[j]) {
                        const newtu = tu.clone();
                        newtu.source = sarr[j];
                        newtu.ordinal = j;

                        if (tarr && j < tarr.length && tarr[j]) {
                            newtu.target = tarr[j];
                        }

                        newtu.ordinal = j;
                        units.push(newtu);
                    } else if (tarr[j]) {
                        logger.warn("Translated array  " + res.getKey() + " has no source string at index " + j + ". Cannot translate. Resource is: " + JSON.stringify(res, undefined, 4));
                    }
                }
                break;

            case "plural":
                tu = new TranslationUnit({
                    project: res.project,
                    key: res.getKey(),
                    file: res.getPath(),
                    source: " ",
                    sourceLocale: res.getSourceLocale(),
                    targetLocale: res.getTargetLocale(),
                    state: res.getState(),
                    id: res.getId(),
                    translated: true,
                    context: res.context,
                    resType: res.resType,
                    datatype: res.datatype,
                    flavor: res.getFlavor ? res.getFlavor() : undefined,
                    location: res.getLocation(),
                    translate: !res.getDNT()
                });

                const sp = res.getSource();
                const tp = res.getTarget();

                if (!tp || isEmpty(tp)) {
                    for (let p in sp) {
                        const newtu = tu.clone();
                        newtu.source = sp[p];
                        newtu.quantity = p;
                        newtu.comment = generatePluralComment(res, sp, p);
                        units.push(newtu);
                    }
                } else {
                    for (let p in tp) {
                        const newtu = tu.clone();
                        newtu.source = sp[p] || sp.other;
                        newtu.target = tp[p];
                        newtu.quantity = p;
                        newtu.comment = generatePluralComment(res, sp, p);
                        units.push(newtu);
                    }
                }
                break;
            }
        } catch (e) {
            logger.warn(e);
            logger.warn(JSON.stringify(res));
            logger.warn("Skipping that resource.");
        }

        return units;
    }

    /**
     * Convert a translation unit to a new loctool resource.
     *
     * @private
     * @param {TranslationUnit} tu the translation to convert
     * @return {Resource} the corresponding resource
     */
    convertTransUnit(tu) {
        let res;

        switch (tu.resType) {
        default:
            res = new ResourceString({
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
                flavor: tu.flavor,
                location: new Location(tu.location)
            });

            if (tu.target) {
                res.setTarget(tu.target);
            }
            break;

        case "array":
            var arr = [];
            arr[tu.ordinal] = tu.source;
            res = new ResourceArray({
                pathName: tu.file,
                project: tu.project,
                id: tu.id,
                key: tu.key,
                sourceLocale: tu.sourceLocale,
                source: arr,
                targetLocale: tu.targetLocale,
                target: [],
                context: tu.context,
                comment: tu.comment,
                resType: tu.resType,
                datatype: tu.datatype,
                state: tu.state,
                flavor: tu.flavor,
                location: new Location(tu.location)
            });

            if (tu.target) {
                res.addTargetItem(tu.ordinal, tu.target);
            }
            break;

        case "plural":
            var strings = {};
            strings[tu.quantity] = tu.source;
            res = new ResourcePlural({
                pathName: tu.file,
                project: tu.project,
                id: tu.id,
                key: tu.key,
                sourceLocale: tu.sourceLocale,
                source: strings,
                targetLocale: tu.targetLocale,
                target: {},
                context: tu.context,
                comment: tu.comment,
                resType: tu.resType,
                datatype: tu.datatype,
                state: tu.state,
                flavor: tu.flavor,
                location: new Location(tu.location)
            });

            if (tu.target) {
                res.addTargetPlural(tu.quantity, tu.target);
            }
            break;
        }

        if (typeof(tu.translate) === "boolean") {
            res.setDNT(!tu.translate);
        }

        return res;
    }

    getPath() {
        return this.path;
    }

    setPath(newPath) {
        this.path = newPath;
    }

    parse(xml) {
        const tuList = this.xliff.deserialize(xml);
        let res;

        if (tuList) {
            for (var j = 0; j < tuList.length; j++) {
                const tu = tuList[j];
                let comment;

                switch (tu.resType) {
                default:
                    res = this.convertTransUnit(tu);
                    this.ts.add(res);
                    break;

                case "array":
                    res = this.ts.get(ResourceArray.hashKey(tu.project, tu.context, tu.targetLocale || tu.sourceLocale, tu.key));
                    if (res) {
                        // if it already exists, amend the existing resource instead of creating a new one
                        res.addSourceItem(tu.ordinal, tu.source);
                        if (tu.target) {
                            res.addTargetItem(tu.ordinal, tu.target);
                        }
                    } else {
                        res = this.convertTransUnit(tu);
                        this.ts.add(res);
                    }
                    break;

                case "plural":
                    res = this.ts.get(ResourcePlural.hashKey(tu.project, tu.context, tu.targetLocale || tu.sourceLocale, tu.key));
                    if (res) {
                        // if it already exists, amend the existing resource instead of creating a new one
                        res.addSourcePlural(tu.quantity, tu.source);
                        if (tu.target) {
                            res.addTargetPlural(tu.quantity, tu.target);
                        }
                    } else {
                        res = this.convertTransUnit(tu);
                        this.ts.add(res);
                    }
                    break;
                }
            }
        }

        return this.ts;
    }

    getResources(criteria) {
        if (!criteria) return this.ts.getAll();
        return this.ts.getBy(criteria);
    }

    addResource(res) {
        if (!res) return;

        if (res.getTargetLocale() === this.sourceLocale || res.getTargetLocale() === "en") {
            // don't add this one... cannot translate TO the source locale!
            return;
        }

        this.ts.add(res);
    }

    getText() {
        let units = [];

        if (this.ts.size() > 0) {
            // first convert the resources into translation units
            let resources = this.ts.getAll();

            if (this.allowDups) {
                // only look at the initial set of resources
                const initialLength = resources.length;
                for (let i = 0; i < initialLength; i++) {
                    const res = resources[i];
                    const instances = res.getInstances();
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

        // start with no translation units in it
        this.xliff.clear();
        this.xliff.addTranslationUnits(units);

        return this.xliff.serialize(true);
    }

    /**
     * Return the number of lines in the xml representation of this file.
     *
     * @returns {Number} the number of lines in the xml
     */
    getLines() {
        return this.xliff.getLines();
    }

    /**
     * Return the number of resources in this resource xliff file.
     * @returns {Number} the number of resources in this file
     */
    size() {
        return this.ts.size();
    }

    /**
     * Get the version number of this file. Currently, it only supports
     * xliff v1.2 and v2.0.
     * @returns {String} the version number of the file
     */
    getVersion() {
        return this.version;
    }
}

export default ResourceXliff;
