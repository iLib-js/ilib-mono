/*
 * Resource.js - super class that represents a resource
 *
 * Copyright © 2022-2024 JEDLSoft
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

const validStates = {
    "new":true,
    "translated":true,
    "accepted":true
}

const translationImportant = [
    "context",
    "datatype",
    "dnt",
    "flavor",
    "project",
    "reskey",
    "resType",
    "sourceLocale",
    "targetLocale"
];


/**
 * @class Represents a resource from a resource file or
 * extracted from the code.
 * @abstract
 */
class Resource {
    /**
     * Construct a new Resource instance.
     * The props may contain any
     * of the following properties:
     *
     * <ul>
     * <li>project {String} - the project that this resource is in
     * <li><i>context</i> {String} - The context for this resource,
     * such as "landscape mode", or "7200dp", which differentiates it
     * from the base resource that has no special context. The default
     * if this property is not specified is undefined, meaning no
     * context.
     * <li>sourceLocale {String} - the locale of the source resource.
     * <li>targetLocale {String} - the locale of the target resource.
     * <li>key {String} - the unique key of this string, which should include the context
     * of the string
     * <li>pathName {String} - pathName to the file where the string was extracted from
     * <li>autoKey {boolean} - true if the key was generated based on the source text
     * <li>state {String} - current state of the resource (ie. "new", "translated", or "accepted")
     * <li>id {String} - the id of the current resource
     * <li>comment {String} - the comment (translator's note) of this resource
     * <li>dnt {boolean} - Do not translate this resource when this is set to true. Default: false
     * <li>datatype {String} - the type of file that this resource came from
     * <li>flavor {String} - the "flavor" of this string, if any. (Android)
     * <li>location {Location} - the location in the file given in pathName where this this resource
     * is located
     * </ul>
     *
     * @constructor
     * @param {Object} props properties of the string, as defined above
     */
    constructor(props) {
        if (this.constructor === Resource) {
            throw new Error("Cannot instantiate abstract class Resource!");
        }

        this.autoKey = false;

        if (props) {
            this.project = props.project;
            this.context = props.context || undefined; // avoid the empty string
            this.sourceLocale = props.sourceLocale || props.locale;
            this.targetLocale = props.targetLocale;
            this.reskey = props.key || props.reskey;
            this.pathName = props.pathName;
            this.autoKey = typeof(props.autoKey) === "boolean" ? props.autoKey : false;
            this.state = props.state || undefined;
            this.id = props.id; // the database id
            this.formatted = props.formatted; // for Android layout resources
            this.comment = props.comment;
            this.origin = props.origin || "source";
            this.dnt = props.dnt;
            this.datatype = props.datatype;
            this.sourceHash = props.sourceHash;
            this.localize = typeof(props.localize) === "boolean" ? props.localize : true; // some files have resources we do not want to localize/translate
            this.flavor = props.flavor;
            this.index = props.index;
            this.location = props.location; // optional location of the transunits in the xml file
        }

        this.instances = [];
        this.pathName = this.pathName || "";
        this.dirty = false;
    }

    /**
     * Return the project that this resource was found in.
     *
     * @returns {String} the project of this resource
     */
    getProject() {
        return this.project;
    }

    /**
     * Return the unique key of this resource.
     *
     * @returns {String} the unique key of this resource
     */
    getKey() {
        return this.reskey;
    }

    /**
     * Return the source string or strings for this resource.
     *
     * @returns {String|Array.<String>|Object} the source string or
     * strings of this resource
     */
    getSource() {
        return this.source;
    }

    /**
     * Return the target string or strings for this resource.
     *
     * @returns {String|Array.<String>|Object} the source string or
     * strings of this resource
     */
    getTarget() {
        return this.target;
    }

    /**
     * Return the resource type of this resource. This is one of
     * string, array, or plural.
     *
     * @returns {String} the resource type of this resource
     */
    getType() {
        return this.resType || "string";
    }

    /**
     * Return the data type of this resource.
     *
     * @returns {String} the data type of this resource
     */
    getDataType() {
        return this.datatype;
    }

    /**
     * Return true if the key of this resource was automatically generated,
     * and false if it was an explicit key.
     *
     * @returns {boolean} true if the key of this string was auto generated,
     * false otherwise
     */
    getAutoKey() {
        return this.autoKey;
    }

    /**
     * Return the context of this resource, or undefined if there
     * is no context.
     * @returns {String|undefined} the context of this resource, or undefined if there
     * is no context.
     */
    getContext() {
        return this.context;
    }

    /**
     * Return the source locale of this resource, or undefined if there
     * is no context or the locale is the same as the project's source locale.
     * @returns {String|undefined} the locale of this resource, or undefined if there
     * is no locale.
     */
    getSourceLocale() {
        return this.sourceLocale || "en-US";
    }

    /**
     * Set the source locale of this resource.
     * @param {String} locale the source locale of this resource
     */
    setSourceLocale(locale) {
        this.sourceLocale = locale || this.sourceLocale;
        this.dirty = true;
    }

    /**
     * Return the target locale of this resource, or undefined if the resource
     * is a source-only resource.
     * @returns {String|undefined} the locale of this resource, or undefined if there
     * is no locale.
     */
    getTargetLocale() {
        return this.targetLocale;
    }

    /**
     * Set the target locale of this resource.
     * @param {String} locale the target locale of this resource
     */
    setTargetLocale(locale) {
        this.targetLocale = locale || this.targetLocale;
        this.dirty = true;
    }

    /**
     * Return the state of this resource. This is a string that gives the
     * stage of life of this resource. Currently, it can be one of "new",
     * "translated", or "accepted".
     *
     * @returns {String} the state of this resource
     */
    getState() {
        return this.state;
    }

    /**
     * Set the project of this resource. This is a string that gives the
     * id of the project for this resource.
     *
     * @param {String} project the project name to set for this resource
     */
    setProject(project) {
        this.project = project;
        this.dirty = true;
    }

    /**
     * Set the state of this resource. This is a string that gives the
     * stage of life of this resource. Currently, it can be one of "new",
     * "translated", or "accepted".
     *
     * @param {String} state the state of this resource
     */
    setState(state) {
        this.state = validStates[state] ? state : this.state;
        this.dirty = true;
    }

    /**
     * Return the original path to the file from which this resource was
     * originally extracted.
     *
     * @returns {String} the path to the file containing this resource
     */
    getPath() {
        return this.pathName;
    }

    /**
     * Return the translator's comment for this resource if there is
     * one, or undefined if not.
     *
     * @returns {String|undefined} the translator's comment for this resource
     * if the engineer put one in the code
     */
    getComment() {
        return this.comment;
    }

    /**
     * Set the translator's comment for this resource.
     *
     * @param {String|undefined} comment the translator's comment to set. Use
     * undefined to clear the comment
     */
    setComment(comment) {
        this.comment = comment;
        this.dirty = true;
    }

    /**
     * Get the "do not translate" flag for this resource.
     *
     * @returns {boolean} true means that the current resource should not
     * be translated, and false means it will be translated.
     */
    getDNT() {
        return typeof(this.dnt) === 'boolean' ? this.dnt : false;
    }

    /**
     * Set the "do not translate" flag for this resource.
     *
     * @param {boolean} flag set the dnt flag to this value
     */
    setDNT(flag) {
        if (typeof(flag) !== 'boolean') {
            throw new TypeError('value must be boolean');
        }
        this.dnt = flag;
        this.dirty = true;
    }

    /**
     * Return the database id if this resource has previously been saved in the
     * database.
     *
     * @returns {number|undefined} the database id if this resource has previously
     * been saved in the database, or undefined if it is has not
     */
    getId() {
        return this.id;
    }

    /**
     * Return the origin of this resource. The origin may be either the string
     * "source" or "target". Source origin resources are ones that are extracted
     * from the source code, whereas target ones are translations from the
     * translators.
     *
     * @returns {String} the origin of this resource
     */
    getOrigin() {
        return this.origin;
    }

    /**
     * Return the localize flag of this resource.
     * This flag indicates whether we should look up a translation for this resource.
     * When false, we should simply substitute the source back
     *
     * @returns {Boolean} the localize flag of this resource
     */
    getLocalize() {
      return this.localize;
    }

    /**
     * Return the name of the flavor for this resource, or undefined
     * for the "main" or default flavor.
     *
     *  @return {String|undefined} the name of the flavor for this
     *  resource or undefined for the main or default flavor
     */
    getFlavor() {
        return this.flavor;
    }

    /**
     * Return true if the other resource represents the same resource as
     * the current one. The project, context, locale, key, flavor, and type must
     * match. Other fields such as the pathName, state, and comment fields are
     * ignored as minor variations.
     *
     * @param {Resource} other another resource to test against the current one
     * @returns {boolean} true if these represent the same resource, false otherwise
     */
    same(other) {
        if (!other) return false;

        const props = ["project", "context", "sourceLocale", "targetLocale", "reskey", "resType", "flavor"];
        for (let i = 0; i < props.length; i++) {
            if (this[props[i]] !== other[props[i]]) {
                return false;
            }
        }

        return true;
    }

    /**
     * Escape text for writing to a database in a SQL command. This puts single
     * quotes around the string, and makes sure that all single quotes within
     * the string are escaped.
     *
     * @param {Object} str the item to escape
     * @returns {String} the escaped string
     */
    escapeText(str) {
        switch (typeof(str)) {
        case "string":
            // unescape first, then re-escape to make everything consistent
            return "'" + str.replace(/\\'/g, "'").replace(/'/g, "\\'") + "'";
        case "undefined":
            return "NULL";
        case "boolean":
            return str ? "TRUE" : "FALSE";
        default:
            if (str === null) {
                return "NULL";
            }
            return str.toString();
        }
    }

    /**
     * Add an instance of the same resource to the list of
     * instances. If the given resource matches the
     * current instance in all properties that affect the
     * possible translation, and differs from the current
     * instance by some property that does not affect
     * its translation, it will be added as an instance of
     * the same string. The following properties affect the
     * translation:
     *
     * <ul>
     * <li>context</li>
     * <li>datatype</li>
     * <li>dnt</li>
     * <li>flavor</li>
     * <li>project</li>
     * <li>reskey</li>
     * <li>resType</li>
     * <li>source</li>
     * <li>sourceHash</li>
     * <li>sourceArray</li>
     * <li>sourceLocale</li>
     * <li>targetLocale</li>
     * </ul>
     *
     * Differences in other properties, such as "comment" or
     * "origin" are considered instances of the same resource.
     *
     * If this method is given a resource that differs from
     * the current one by one of the above translation affecting
     * properties, it is not added to the list of instances. This
     * can be checked easily by calling the isInstance() method.
     *
     * @param {Resource} an instance of the current resource to
     * record
     * @returns {boolean} true if the instance was added, and
     * and false otherwise
     */
    addInstance(resource) {
        if (!this.isInstance(resource)) {
            return false;
        }
        const unique = this !== resource && this.instances.every(res => {
            return res !== resource;
        });
        if (!unique) {
            return false;
        }
        this.instances.push(resource);
        this.dirty = true;
        return true;
    }

    /**
     * Check if the given resource is an instance of the current
     * resource. This method returns true if all properties which
     * affect the possible translation match between the given and
     * the current resource.
     *
     * @param {Resource} a resource to check
     * @returns {boolean} true if this is an instance of
     * the current resource, false otherwise.
     */
    isInstance(resource) {
        if (typeof(resource) !== 'object' || !(resource instanceof Resource)) {
            return false;
        }

        return translationImportant.every(prop => {
            return this[prop] === resource[prop];
        });
    }

    /**
     * Return the list of instances of the current resource.
     *
     * @returns {Array.<Resource>} the list of instances of
     * the current resource
     */
    getInstances() {
        return this.instances;
    }

    /**
     * Return true if this instance has been modified since its creation, and false otherwise.
     */
    isDirty() {
        return this.dirty
    }

    /**
     * Clear the dirty flag. This is used for example when the Resource was
     * written to disk and the modifications are already recorded, allowing
     * new modifications later.
     */
    clearDirty() {
        this.dirty = false;
    }

    /**
     * Return the location of the resource instance in the original file where it was read
     * from. This is usually an object containing a line and a char property which gives the
     * line number and character within that line where the representation of the resource
     * instance starts.
     *
     * @returns {Location|undefined} the location information, or undefined if no location
     * information is available
     */
    getLocation() {
        return this.location?.getLocation();
    }
}

export default Resource;
