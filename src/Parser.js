/*
 * Parser.js - common SPI for parser plugins
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

/**
 * @class common SPI for parser plugins
 * @abstract
 */
class Parser {
    /**
     * Construct a new plugin.
     *
     * @param {Object} [options] options to the constructor
     * @param {Function} options.getLogger a callback function provided by
     * the linter to retrieve the log4js logger
     */
    constructor(options) {
        if (this.constructor === Parser) {
            throw new Error("Cannot instantiate abstract class Plugin directly!");
        }
    }

    /**
     * Initialize the current plugin.
     * @abstract
     */
    init() {}

    /**
     * Return the name of this type of parser.
     * Subclasses should assign `this.name` in their constructor.
     *
     * @returns {String} return the name of this type of parser
     */
    getName() {
        return this.name;
    }

    /**
     * Return a description of what this parser does and what kinds of files it
     * handles for users who are trying to discover whether or not to use it.
     *
     * @returns {String} a description of this parser.
     */
    getDescription() {
        return this.description;
    }

    /**
     * Return the list of extensions of the files that this parser handles.
     * The extensions are listed without the dot. eg. ["json", "jsn"].
     * Subclasses should assign `this.extensions` in their constructor.
     *
     * @returns {Array.<String>} a list of file name extensions
     */
    getExtensions() {
        return this.extensions;
    }

    /**
     * Parse the current file into an intermediate representation. This
     * representation may be anything you like, as long as the rules you
     * implement also can use this same format to check for problems.<p>
     *
     * Many parsers produce an abstract syntax tree. The tree could have
     * a different style depending on the programming language, but
     * generally, each node has a type, a name, and an array of children,
     * as well as additional information that depends on the type of
     * the node.<p>
     *
     * Other types of intermediate representation could include:<p>
     *
     * <ul>
     * <li>lines - just split the file into an array of lines in order
     * <li>string - treat the whole file like a big string
     * <li>concrete syntax tree - a tree the represents the actual
     *   syntactical elements in the file. This can be converted to
     *   an abstract syntax tree afterwards, which would be more useful
     *   for checking for problems.
     * <li>resources - array of instances of Resource classes as
     *   defined in {@link https://github.com/ilib-js/ilib-tools-common}.
     *   This is the preference intermediate representation for
     *   resource files like Java properties or xliff. There are many
     *   rules that already know how to process Resource instances.
     * </ul>
     *
     * @abstract
     * @returns {IntermediateRepresentation} the intermediate representation
     */
    parse() {}

    /**
     * Return the type of intermediate representation that this parser
     * produces. The type should be a unique name that matches with
     * the rule type for rules that process this intermediate representation.<p>
     *
     * There are three types that are reserved, however:<p>
     *
     * <ul>
     * <li>resource - the parser returns an array of Resource instances as
     *   defined in {@link https://github.com/ilib-js/ilib-tools-common}.
     * <li>line - the parser produces a set of lines as an array of strings
     * <li>string - the parser doesn't parse. Instead, it just treats the
     *   the file as one long string.
     * </ul>
     *
     * @abstract
     * @returns {String} the name of the current type of intermediate
     * representation.
     */
    getType() {}
};

export default Parser;
