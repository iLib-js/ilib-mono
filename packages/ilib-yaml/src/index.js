/*
 * index.js - implement the YamlFile class
 *
 * Copyright © 2024 JEDLSoft
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

import * as yamllib from 'yaml';
import { ResourceString, ResourceArray, TranslationSet } from 'ilib-tools-common';

/**
 * @class Represents a yaml source file.
 *
 */
class Yaml {
    /**
     * Constructor a new Yaml instance.
     *
     * If the instance is constructed with a sourceYaml parameter, then the resources
     * for this intance will be considered to be translated strings. Every string read
     * from the current yaml file will be looked up in the sourceYaml instance by id
     * for the corresponding source string and strings in this instance will be the
     * translated string. If no sourceYaml parameter is provided, then this instance
     * will be considered as a source yaml, and all strings read will appear as the
     * source of the Resource instances.<p>
     *
     * If the yaml contains comments, these will appear as comments on the Resource
     * instances as well.
     *
     * @constructor
     * @param {Object} props properties that control the construction of this file.
     * @param {YamlFile} props.sourceYaml If the current file contains translations,
     * the corresponding source string can be found in this yaml instance
     * @param {string} props.sourceLocale If no source yaml is given, you can still
     * set the source locale for this instance using this parameter
     * @param {string} props.pathName The path to the file
     * @param {string} props.project The name of the project to apply to all Resource instances
     * @param {string} props.locale for source-only yaml files, this is the source locale.
     * For source and target yaml files, this is the target locale to apply
     * to all Resource instances
     * @param {string} props.context The context to apply to every Resource instance
     * @param {string} props.state The state to apply to every Resource instance
     * @param {string} props.datatype The datatype to apply to every Resource instance
     * @param {string} props.flavor The flavor to apply to every Resource instance
     * @param {string} props.commentPrefix if a comment for a yaml entry begins with this
     * string, that prefix will be stripped off of the comment automatically before being
     * attached to the new Resource as a translator's comment
     * @param {Function(string, string)} props.filter Provide a filter that tells whether
     * or not the current key/value pair should be included as a Resource. This filter
     * is called on each yaml entry before the Resource is created. If the filter returns
     * false, the entry is skipped and no Resource is created. If it returns true, or if
     * there was no filter specified, then the Resource is created normally.
     */
    constructor(props) {
        if (props) {
            this.sourceYaml = props.sourceYaml;
            this.pathName = props.pathName;
            this.project = props.project;
            this.sourceLocale = props.sourceLocale;
            this.locale = props.locale;
            this.context = props.context;
            this.state = props.state;
            this.datatype = props.datatype;
            this.flavor = props.flavor;
            this.commentPrefix = props.commentPrefix;
            this.filter = typeof(props.filter) === "function" ? props.filter : undefined;
        }

        if (!this.sourceLocale && this.sourceYaml) {
            this.sourceLocale = this.sourceYaml.getLocale();
        }
        this.sourceLocale = this.sourceLocale ?? "en-US";
        this.locale = this.locale ?? "en-US";
        this.commentsMap = new Map();
        this.set = new TranslationSet(this.sourceLocale);
    }

    /**
     * Return the locale of this instance.
     * @returns {string} the locale of this instance
     */
    getLocale() {
        return this.locale;
    }

    /**
     * Return the comment prefix set in the constructor.
     * This is the prefix to automatically strip from the
     * comments added to Resource instances.
     *
     * @returns {string} the comment prefix
     */
    getCommentPrefix() {
        return this.commentPrefix;
    }

    /**
     * Constructs full element key by escaping the dots.
     *
     * @param {string} prefix the prefix of this key
     * @param {string} key the key to normalize
     * @returns {string} the normalized key
     *
     * @private
     */
    normalizeKey(prefix, key) {
        return (prefix ? prefix + "." : "") + key.toString().replace(/\./g, '\\.');
    }

    /**
     * Extract comments from Node and store it in a map.
     * element_id => extracted_comment
     *
     * @param {String} key id of the node
     * @param {Object} node node to parse and extract comment from
     * @param {String} firstComment comment from the level above,
     * due to the fact that by default first comment in a YAMLMap is assigned
     * to the YAMLMap's value itself, but not the first element in the map
     *
     * @private
     */
    parseNodeComment(key, node, firstComment) {
        if (yamllib.isPair(node)) {
            if (firstComment || node.key.commentBefore) {
                this.commentsMap.set(this.normalizeKey(key, node.key.value), firstComment || node.key.commentBefore);
            }
            this.parseNodeComment(this.normalizeKey(key, node.key.value), node.value, node.value.commentBefore);
        } else if (yamllib.isSeq(node)) {
            node.items.forEach((mapNode, i) => {
                this.parseNodeComment(this.normalizeKey(key, i), mapNode, i === 0 ? firstComment : undefined);
            });
        } else if (yamllib.isMap(node)) {
            node.items.forEach((mapNode, i) => {
                this.parseNodeComment(key, mapNode, i === 0 ? firstComment : undefined);
            });
        } else if (yamllib.isScalar(node)) {
            if (firstComment || node.commentBefore) {
                this.commentsMap.set(key, firstComment || node.commentBefore);
            }
        }
    }

    /**
     * Parse a yml file as Document and traverse nodes tree
     * and extract comments.
     *
     * @private
     */
    parseComments() {
        if (!this.document) return; // can't parse undefined!

        this.document.contents.items.forEach(node => {
            this.parseNodeComment(undefined, node, this.document.contents.commentBefore);
        });
    }

    /**
     * @private
     */
    parseResources(prefix, obj, set) {
        let comment;
        const locale = this.locale;
        for (let key in obj) {
            const reskey = this.normalizeKey(prefix, key);
            const sourceResource = this.sourceYaml && this.sourceYaml.getResource(reskey);

            if (typeof(obj[key]) === "object") {
                if (Array.isArray(obj[key])) {
                    let params = {
                        resType: "array",
                        key: reskey,
                        autoKey: true,
                        pathName: this.pathName ?? sourceResource?.pathName,
                        project: this.project ?? sourceResource?.project,
                        datatype: this.datatype ?? sourceResource?.dataType,
                        flavor: this.flavor ?? sourceResource?.flavor,
                        context: this.context ?? sourceResource?.context,
                        index: this.resourceIndex++
                    };
                    if (locale === this.sourceLocale) {
                        params.sourceLocale = locale;
                        params.source = obj[key];
                    } else {
                        if (sourceResource) {
                            params.sourceLocale = sourceResource.getSourceLocale();
                            params.source = sourceResource.getSource();
                        }
                        params.target = obj[key];
                        params.targetLocale = locale;
                    }

                    if (this.commentsMap.has(reskey)) {
                        comment = this.commentsMap.get(reskey).trim();
                        params.comment = (this.commentPrefix && comment.startsWith(this.commentPrefix)) ?
                            comment.slice(this.commentPrefix.length).trim() :
                            comment;
                    }

                    const res = new ResourceArray(params);

                    set.add(res);
                } else {
                    this.parseResources(this.normalizeKey(prefix, key), obj[key], set);
                }
            } else {
                const resource = obj[key];

                // we check if filter is a function in the constructor
                if (this.filter && !this.filter(reskey, resource)) {
                    // skip this entry, as the caller has filtered it out
                    continue;
                }

                let params = {
                    resType: "string",
                    key: reskey,
                    autoKey: true,
                    pathName: this.pathName ?? sourceResource?.pathName,
                    project: this.project ?? sourceResource?.project,
                    datatype: this.datatype ?? sourceResource?.dataType,
                    flavor: this.flavor ?? sourceResource?.flavor,
                    context: this.context ?? sourceResource?.context,
                    index: this.resourceIndex++
                };
                if (locale === this.sourceLocale) {
                    params.sourceLocale = locale;
                    params.source = resource;
                } else {
                    if (sourceResource) {
                        params.sourceLocale = sourceResource.getSourceLocale();
                        params.source = sourceResource.getSource();
                    }
                    params.target = resource;
                    params.targetLocale = locale;
                }

                if (this.commentsMap.has(reskey)) {
                    comment = this.commentsMap.get(reskey).trim();
                    params.comment = (this.commentPrefix && comment.startsWith(this.commentPrefix)) ?
                        comment.slice(this.commentPrefix.length).trim() :
                        comment;
                }

                const res = new ResourceString(params);

                set.add(res);
            }
        }
    }

    /**
     * Return the path name that is used to construct all Resource instances.
     * @returns {string} the path used to construct all Resource instances
     */
    getPath() {
        return this.pathName;
    }

    /**
     * Deserialize a string containing the contents of a yaml file into an array
     * of Resource instances.
     *
     * @param {string} content The contents of the file to parse
     */
    deserialize(content) {
        this.resourceIndex = 0;
        this.document = yamllib.parseDocument(content);
        this.json = yamllib.parse(content);
        this.parseComments();
        this.parseResources(undefined, this.json, this.set);
    }

    /**
     * Serialize the Resources in this instance into a yaml file format and
     * return it as a string.
     *
     * @returns {string} the Resources in this instance as a yaml file
     */
    serialize() {
        let json = {};

        if (this.set.isDirty()) {
            const resources = this.set.getAll();

            for (let j = 0; j < resources.length; j++) {
                let resource = resources[j];
                if (resource.getTarget() || resource.getSource()) {
                    let key = resource.getKey();
                    let lastKey = key;
                    let parent = json;
                    if (key && key.length) {
                        let parts = key.split(/(?<!\\)\./g);
                        if (parts.length > 1) {
                            for (let i = 0; i < parts.length-1; i++) {
                                if (!parent[parts[i]]) {
                                    parent[parts[i]] = {};
                                }
                                parent = parent[parts[i]];
                            }
                        }
                        lastKey = parts[parts.length-1];
                    }
                    lastKey = lastKey.replace(/\\./g, '.');
                    parent[lastKey] = resource.getTarget() || resource.getSource();
                }
            }
        }

        // now convert the json back to yaml
        return yamllib.stringify(json, {
            schema: 'failsafe',
            sortMapEntries: true,
            lineWidth: 0,
            doubleQuotedAsJSON: true
        });
    }

    /**
     * Return the resource in this instance with the given reskey or undefined
     * if the resource is not found.
     * @param {string} reskey the key for the resource being sought
     * @returns {Resource | undefined} the resource with the given reskey
     */
    getResource(reskey) {
        const resources = this.set.getBy({
            reskey
        });
        return resources && resources[0];
    }

    /**
     * Return an array of resources in this yaml file.
     *
     * @returns {Array<Resource>} an array of resources in this yaml
     */
    getResources() {
        return this.set.getAll();
    }

    /**
     * Return a translation set with all the resources from the current file in it.
     *
     * @returns {TranslationSet} the set with all the resources in it
     */
    getTranslationSet() {
        return this.set;
    }

    /**
     * Add a resource to this instance. The locale of the resource
     * should correspond to the locale of the file, and the
     * context of the resource should match the context of
     * the file.
     *
     * @param {Resource} res a resource to add to this file
     * @returns {boolean} if the resource was added successfully, and false otherwise
     */
    addResource(resource) {
        if (typeof(resource) === "object" && resource && resource.getProject() === this.project) {
            this.set.add(resource);
            return true;
        }
        return false;
    }

    /**
     * Add an array of resources to this instance.
     * @param {Array<Resource>} resourceArray the array of resources to add
     * @returns {boolean} true if all resources were added successfully, and false otherwise
     */
    addResources(resourceArray) {
        if (!Array.isArray(resourceArray)) {
            return false;
        }
        return resourceArray.every(resource => {
            return this.addResource(resource);
        });
    }
}

export default Yaml;
