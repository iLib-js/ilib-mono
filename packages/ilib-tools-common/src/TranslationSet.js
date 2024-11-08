/*
 * TranslationSet.js - a collection of resource strings
 *
 * Copyright © 2016-2017, 2019-2020 HealthTap, Inc.
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

import log4js from "@log4js-node/log4js-api";

const logger = log4js.getLogger("tools-common.TranslationSet");

/**
 * @class A class that represents a set of translations used in
 * a project.
 *
 * @constructor
 * @param {String} sourceLocale the source locale for this set
 * @param {Object=} options options controlling this set
 */
class TranslationSet {
    constructor(sourceLocale) {
        this.sourceLocale = sourceLocale || "zxx-XX";

        this.resources = [];
        this.byHashKey = {};
        this.byCleanHashKey = {};
        this.dirty = false;
        this.stringsBySource = {};
        this.byResKey = {};
        this.resourceIndex = 0;
    }

    /**
     * Get a resource by its hashkey.
     *
     * @param {String} hashkey The unique hashkey of the resource being sought.
     * @returns {Resource|undefined} a resource corresponding to the hashkey, or undefined if there is no
     * resource with that key
     */
    get(hashkey) {
        logger.trace("Get a resource by hashkey " + hashkey);
        return this.byHashKey[hashkey];
    }

    /**
     * Get a resource by its clean string hashkey.
     *
     * @param {String} hashkey The unique hashkey of the resource being sought.
     * @returns {Resource|undefined} a resource corresponding to the hashkey, or undefined if there is no
     * resource with that key
     */
    getClean(hashkey) {
        logger.trace("Get a resource by clean hashkey " + hashkey);
        return this.byCleanHashKey[hashkey];
    }

    /**
     * Get a resource by its source string and context. The source string must be written
     * in the language and script of the source locale. For array types, the
     * source string
     * must be one of the values in the string array. For plural types, it
     * must be one of the values of the quantities.<p>
     *
     * If the context is undefined,
     * this method will find the base generic resource with no context.
     *
     * @param {String} source The source string to look up
     * @param {String|undefined} context The optional context of the resource being sought.
     * @returns {Resource|undefined} a resource corresponding to the source string, or
     * undefined if there is no resource with that source
     */
    getBySource(source, context) {
        logger.trace("Get a resource by source");
        return this.stringsBySource[source + '@' + context];
    }

    /**
     * Return all resources in this set.
     *
     * @returns {Array.<Resource>} an array of resources in this set,
     * possibly empty
     */
    getAll() {
        return this.resources;
    }

    /**
     * @private
     */
    addRes(resource, hashKey, cleanKey) {
        const existingClean = this.byCleanHashKey[cleanKey];

        logger.trace("New resource " + hashKey + " " + cleanKey);
        this.resources.push(resource);
        this.byHashKey[hashKey] = resource;
        if ( existingClean ){
            logger.trace("Overwrite cleanKey " + cleanKey);
        } else {
            logger.trace("New cleanKey " + cleanKey);
            this.byCleanHashKey[cleanKey] = resource;
        }
        this.dirty = true;

        if (resource.resType === "string" && resource.autoKey) {
            this.stringsBySource[resource.getSource() + '@' + resource.context] = resource;
        }
    }

    /**
     * Add a resource to this set. If this resource has the same key
     * as an existing resource, but a different locale, then this
     * resource is added a translation instead.
     *
     * @param {Resource} resource a resource to add to this set
     */
    add(resource) {
        if (!resource) return;

        let existing;
        const key = resource.getKey(), hashKey = resource.hashKey();
        const cleanKey = resource.cleanHashKey();
        logger.trace("Add a resource. Hash: " + hashKey + " clean: " + cleanKey + " resource:" + JSON.stringify(resource));

        existing = this.byHashKey[hashKey];
        const existingClean = this.byCleanHashKey[cleanKey];

        if (existing) {
            logger.trace("Same key as existing resource: " + JSON.stringify(existing));
            if (existing.isInstance(resource)) {
                existing.addInstance(resource);
            } else if (resource.resType === "string") {
                if (resource.getSource() !== existing.getSource() ||
                        resource.getComment() !== existing.getComment() ||
                        resource.getState() !== existing.getState() ||
                        resource.getId() !== existing.getId()) {
                    logger.debug("Updating source");
                    logger.debug("Key: " + key);
                    logger.debug("Existing Source: " + existing.getSource() + "(" + existing.pathName + ")");
                    logger.debug("New Source: " + resource.getSource() + "(" + resource.pathName + ")");

                    resource = { ...resource, ...existing };
                    this.dirty = true;
                } else {
                    this.addRes(resource, hashKey, cleanKey);
                }
            }
        } else {
            this.addRes(resource, hashKey, cleanKey);
        }
    }

    /**
     * Add every resource in the given array to this set.
     * @param {Array.<Resource>} resources an array of resources to add
     * to this set
     */
    addAll(resources) {
        if (resources && resources.length) {
            resources.forEach(function(resource) {
                this.add(resource);
            }.bind(this));
        }
    }

    /**
     * Add every resource in the given translation set to this set,
     * merging the results together.
     *
     * @param {TranslationSet} set an set of resources to add
     * to this set
     */
    addSet(set) {
        if (set && set.resources && set.resources.length) {
            this.addAll(set.resources);
        } else {
            logger.trace("addSet: nothing to add");
        }
    }

    /**
     * Return the number of unique resources in this set.
     * @returns {number} the number of unique resources in this set
     */
    size() {
        return this.resources.length;
    }

    /**
     * Reset the dirty flag to false, meaning the set is clean. This will
     * allow callers to tell if any more resources were added after
     * this call was made because adding those resources will set
     * the dirty flag to true again.
     */
    setClean() {
        this.dirty = false;
    }

    /**
     * Return whether or not this set is dirty. The dirty flag is set
     * whenever a new resource was added to or removed from the set
     * after it was created or since the last time the setClean method
     * was called.
     * @return {boolean} true if the set is dirty, false otherwise
     */
    isDirty() {
        return this.dirty;
    }

    /**
     * Remove a resource from the set. The resource must have at
     * least enough fields specified to uniquely identify the
     * resource to remove. These are: project, context, locale,
     * resType, and reskey.
     *
     * @param {Resource} resource The resource to remove
     * @returns {boolean} true if the resource was removed successfully
     * and false otherwise
     */
    remove(resource) {
        let ret = false;

        if (resource && resource.project && resource.context && resource.targetLocale && resource.reskey && resource.resType) {
            for (let i = 0; i < this.resources.length; i++) {
                const res = this.resources[i];
                if (resource.project === res.project &&
                        resource.context == res.context &&
                        resource.getSourceLocale() === res.getSourceLocale() &&
                        resource.getTargetLocale() === res.getTargetLocale() &&
                        resource.getKey() === res.getKey()) {
                    const hashKey = resource.hashKey();
                    this.byHashKey[hashKey] = undefined;
                    if (resource.resType === "string") {
                        this.stringsBySource[res.getSource() + '@' + res.context] = undefined;
                    }
                    this.resources.splice(i, 1);
                    this.dirty = true;
                    ret = true;
                    break;
                }
            }
        } else {
            logger.warn("Invalid call to remove resource " + JSON.stringify(resource));
        }

        return ret;
    }

    /**
     * @private
     */
    _select(criteria) {
        const fields = Object.keys(criteria);

        return this.resources.filter(function(res) {
            return fields.every(function(field) {
                return Array.isArray(criteria[field]) ?
                    (criteria[field].length === 0 ||
                    criteria[field].some(function(value) {
                        return res[field] === value;
                    })) :
                    res[field] === criteria[field];
            });
        });
    }

    /**
     * Get a resource by the given criteria.
     * @param {Object} criteria the filter criteria to select the resources to return
     * @returns {Array.<Resource>|undefined} the array of Resources, or undefined if the
     * retrieval did not find any resources that match or there was some error
     */
    getBy(options) {
        logger.trace("Getting resources by criteria");

        return this._select(options);
    }

    /**
     * Return an array of all the project names in the database.
     *
     * @returns {Array.<String>|undefined} the array of project names
     * or undefined if there are no projects in the set
     */
    getProjects() {
        const set = new Set();

        this.resources.map(res => {
            set.add(res.getProject());
        });

        const projects = [ ... set.values() ];
        return projects.length ? projects : undefined;
    }

    /**
     * Return an array of all the contexts within the given project
     * in the set. The root context is just the empty string.
     * The root context is where all strings will go if they are
     * not given an explicit context in the resource file or code.
     *
     * @param {String|undefined} project the project that contains
     * the contexts or undefined to mean all projects
     * @returns {Array.<String>|undefined} the array of context names
     * or undefined if there are no contexts in the set
     */
    getContexts(project) {
        const set = new Set();

        this.resources.map(res => {
            if (!project || res.getProject() === project) {
                const context = res.getContext();
                set.add(context ? context : "");
            }
        });

        const contexts = [ ... set.values() ];
        return contexts.length ? contexts : undefined;
    }

    /**
     * Return an array of all the locales available within the given
     * project and context in the set. The root context is just
     * the empty string. The locales are returned as BCP-47 locale
     * specs.
     *
     * @param {String|undefined} project the project that contains
     * the contexts or undefined to mean all projects
     * @param {String|undefined} context the context that contains
     * the locales or undefined to mean all locales.
     * Use the empty string "" for the default/root context.
     * @returns {Array.<String>|undefined} the array of context names
     * or undefined if there are no contexts in the set
     */
    getLocales(project, context) {
        const set = new Set();

        this.resources.map(res => {
            if ((!project || res.getProject() === project) && (!context || res.getContext() === context)) {
                set.add(res.getTargetLocale());
            }
        });

        const locales = [ ... set.values() ].sort();
        return locales.length ? locales : undefined;
    }

    /**
     * Clear all resources from this set.
     */
    clear() {
        this.resources = [];
        this.byHashKey = {};
        this.dirty = false;
        this.stringsBySource = {};
        this.byResKey = {};
    }

    /**
     * Return a new translation set that contains the differences
     * between the current set and the other set. Resources are
     * added to the difference set if they exist in the other
     * set but not the current one, or if they exist in both
     * sets, but contain different fields.
     *
     * @param {TranslationSet} other the other set to diff against
     * @returns {TranslationSet} the differences between the other
     * set and this one
     */
    diff(other) {
        const otherres = other.getAll();
        const diff = new TranslationSet(this.sourceLocale);
        let res, existing;

        for (let i = 0; i < otherres.length; i++) {
            res = otherres[i];
            existing = this.byHashKey[res.hashKey()];

            if (!existing || !existing.equals(res)) {
                diff.add(res);
            }
        }

        return diff;
    }
}

export default TranslationSet;
