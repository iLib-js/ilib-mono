/*
 * PipelineElement.js - superclass for pipeline elements
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

/**
 * @class superclass for pipeline elements
 *
 * A pipeline element is the superclass for all classes that can be used
 * in a pipeline. A pipeline element can be used along with a number of
 * other pipeline elements of the same type to process a particular type
 * of file. Each pipeline element should define a type, a name, and
 * a description.
 *
 * @abstract
 */
class PipelineElement {
    /**
     * Construct a new pipeline element instance.
     *
     * @param {Object} [options] options to the constructor
     * @param {Function} [options.getLogger] a callback function provided by
     * @param {object} [options.settings] additional settings that can be passed from the
     * pipeline element to the linter to retrieve the log4js logger
     */
    constructor(options) {
        if (this.constructor === PipelineElement) {
            throw new Error("Cannot instantiate abstract class PipelineElement directly!");
        }
        this.getLogger = options?.getLogger;
    }

    /**
     * A callback function provided by the linter to retrieve the log4js logger
     * @type {Function | undefined}
     */
    getLogger;

    /**
     * Initialize the current plugin.
     */
    init() {}

    /**
     * Name of this type of pipeline element
     *
     * Concrete subclasses must define this property.
     * @readonly
     * @abstract
     * @type {string}
     */
    // @ts-expect-error: concrete subclasses must define this property
    name;

    /**
     * Return the name of this type of pipeline element.
     * Concrete subclasses must define {@link PipelineElement.name}.
     *
     * @returns {String} return the name of this type of pipeline element
     */
    getName() {
        return this.name;
    }

    /**
     * Description of what this pipeline element does and what kinds of files it
     * handles for users who are trying to discover whether or not to use it.
     *
     * Concrete subclasses must define this property.
     * @readonly
     * @abstract
     * @type {string}
     */
    // @ts-expect-error: concrete subclasses must define this property
    description;

    /**
     * Return a description of what this pipeline element does and what kinds of files it
     * handles for users who are trying to discover whether or not to use it.
     *
     * Subclass must define {@link PipelineElement.description}.
     *
     * @returns {String} a description of this pipeline element.
     */
    getDescription() {
        return this.description;
    }

    /**
     * Type of file that this pipeline element processes. The type should be
     * a unique name that matches with the type of other pipeline elements that
     * process this same type of file.
     *
     * There are three types that are reserved, however:
     *
     * - resource - the pipeline element returns an array of Resource instances as
     *   defined in {@link https://github.com/ilib-js/ilib-tools-common}.
     * - line - the pipeline element produces a set of lines as an array of strings
     * - string - the pipeline element doesn't parse. Instead, it just treats the
     *   the file as one long string.
     *
     * Concrete subclasses must define this property.
     * @readonly
     * @abstract
     * @type {string}
     */
    // @ts-expect-error: concrete subclasses must define this property
    type;

    /**
     * Return the type of file that this pipeline element processes. The type should be
     * a unique name that matches with the type of other pipeline elements that
     * process this same type of file.
     *
     * Concrete subclasses must define {@link PipelineElement.type}.
     *
     * @abstract
     * @returns {String} the name of the type of file that this pipeline element processes
     */
    getType() {
        return this.type;
    }
};

export default PipelineElement;
