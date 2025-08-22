/*
 * Parser.js - common SPI for parser plugins
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

import NotImplementedError from "./NotImplementedError.js";
import PipelineElement from "./PipelineElement.js";

/** @ignore @typedef {import("./IntermediateRepresentation.js").default} IntermediateRepresentation */
/** @ignore @typedef {import("./SourceFile.js").default} SourceFile */

/**
 * @class common SPI for parser plugins
 *
 * A parser converts source files into intermediate representations that can be
 * checked for problems by the rules.
 *
 * @abstract
 */
class Parser extends PipelineElement {
    /**
     * Construct a new parser instance.
     *
     * @param {Object} [options] options to the constructor
     * @param {Function} [options.getLogger] a callback function provided by
     * @param {object} [options.settings] additional settings that can be passed to the parser
     * the linter to retrieve the log4js logger
     */
    constructor(options) {
        super(options);
        if (this.constructor === Parser) {
            throw new Error("Cannot instantiate abstract class Parser directly!");
        }
    }

    /**
     * List of extensions of the files that this parser handles.
     * The extensions are listed without the dot. eg. ["json", "jsn"]
     *
     * Subclass must define this property.
     * @readonly
     * @abstract
     * @type {string[]}
     */
    // @ts-expect-error: subclass must define this property
    extensions;

    /**
     * Return the list of extensions of the files that this parser handles.
     * The extensions are listed without the dot. eg. ["json", "jsn"].
     *
     * Subclass must define {@link Parser.extensions}.
     *
     * @returns {Array.<String>} a list of file name extensions
     */
    getExtensions() {
        return this.extensions;
    }

    /**
     * Parse the current file into intermediate representations. This
     * representation may be anything you like, as long as the rules you
     * implement also can use this same format to check for problems.
     *
     * Many parsers produce an abstract syntax tree. The tree could have
     * a different style depending on the programming language, but
     * generally, each node has a type, a name, and an array of children,
     * as well as additional information that depends on the type of
     * the node.
     *
     * Other types of intermediate representation could include:
     *
     * - lines - just split the file into an array of lines in order
     * - string - treat the whole file like a big string
     * - concrete syntax tree - a tree the represents the actual
     *   syntactical elements in the file. This can be converted to
     *   an abstract syntax tree afterwards, which would be more useful
     *   for checking for problems.
     * - resources - array of instances of Resource classes as
     *   defined in {@link https://github.com/iLib-js/ilib-mono/tree/main/packages/ilib-tools-common}.
     *   This is the preference intermediate representation for
     *   resource files like Java properties or xliff. There are many
     *   rules that already know how to process Resource instances.
     * - * - the star is a special type that means that the pipeline element
     *   can handle any type of file. Typically, this is used for pipeline elements
     *   that are used to check the content of the file for problems that are
     *   not related to the structure of the file itself, such as checking for
     *   character encoding problems or other issues.
     *
     * @param {SourceFile} sourceFile the source file to parse
     * @abstract
     * @returns {IntermediateRepresentation[]} the intermediate representations
     */
    parse(sourceFile) {
        throw new NotImplementedError();
    }
}

export default Parser;
