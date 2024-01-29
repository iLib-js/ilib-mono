/*
 * SourceFile.js - Represent a file that will be linted
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

import fs from 'fs';
import NotImplementedError from "./NotImplementedError.js";

/**
 * @class Represent a source file. Source files are text files that are
 * candidates for applying lint rules. Source files could mean any type of
 * text file. Examples may include source code files written in some programming
 * language, CSS files, HTML files, config files, resource files used to represent
 * translations for a product, or XLIFF files that contain all the translations
 * for a product. The source file may have subclasses that could represent data
 * that is more ephemeral, such as the rows of a database table. The URI passed
 * to the constructor should contain sufficient information for this class
 * or a subclass to be able to load the data from where it is stored.
 * The intention is that parsers classes should produce these
 * as a by-product of loading and parsing the text file on disk as a way of
 * representing the data that is being linted.
 */
class SourceFile {
    /**
     * Construct a new source file instance. 
     *
     * @param {String} uri URI or path to the source file
     * @param {Object} [options] options to the constructor
     * @param {String} [options.sourceLocale] the source locale of the files
     * being linted
     * @param {Function} [options.getLogger] a callback function provided by
     * the linter to retrieve the log4js logger
     * @param [String] [options.type] the type of this file
     * @constructor
     */
    constructor(uri, options) {
        if (!uri) {
            throw new Error("Attempt to create a SourceFile without a file path");
        }
        this.filePath = uri;
        this.logger = (typeof(options.getLogger) === "function") ? options.getLogger("ilib-lint-common.SourceFile") : undefined;
        this.sourceLocale = options?.sourceLocale || "en-US";
        this.type = options?.type || "";
    }

    /**
     * Read the contents of the file into memory.
     * @throws Error if the file could not be read, or if it is not encoded in UTF-8
     * @protected
     */
    read() {
        // do not convert to a string for the raw property
        this.raw = fs.readFileSync(this.filePath);

        // ... but do convert for the string property
        this.content = this.raw.toString("utf-8");

        // mark as not modified with respect to the source
        this.dirty = false;
    }

    /** 
     * A callback function provided by the linter to retrieve the log4js logger
     * @type {Function | undefined}
     * @protected
     */
    logger;

    /**
     * URI or path to the source file. 
     * @type {String}
     * @protected
     */
    filePath;

    /**
     * Get the URI or path to this source file.
     * 
     * @returns {String} URI or path to this source file
     */
    getPath() {
        return this.filePath;
    }

    /**
     * The raw bytes of the file stored in a Buffer.
     * @type {Buffer}
     * @protected
     */
    raw;
    
    /**
     * Return the raw contents of the file as a Buffer of bytes.
     * This has not been converted into a Unicode string yet.
     * @returns {Buffer} a buffer containing the bytes of this file
     */
    getRaw() {
        if (this.raw === undefined) {
            this.read();
        }
        return this.raw;
    }

    /**
     * The content of the file, stored as regular Javascript string
     * encoded in UTF-8.
     *
     * @type {String}
     * @protected
     */
    content;
    
    /**
     * Get the content of this file encoded as a regular Javascript
     * string.
     * @returns {String} the content of the file, encoded as a JS string
     */
    getContent() {
        if (this.content === undefined) {
            this.read();
        }
        return this.content;
    }
    
    /**
     * Get the content of this file, encoded as an array of lines. Each
     * line has its trailing newline character removed.
     * @returns {Array.<String>} the content as an array of lines
     */
    getLines() {
        if (this.content === undefined) {
            this.read();
        }
        return this.content.split(/[\r\n]+/g);
    }

    /**
     * Set the content of this file to the given array of lines. Each
     * line should not have a trailing newline character. The file
     * remains modified in-memory only and is not written out to disk
     * until the {@link "SourceFile#write"} method is called. The newlines
     * (LF only) are re-added before the contents are written back to disk.
     * @param {Array.<String>} lines the lines to set as the content
     */
    setLines(lines) {
        if (Array.isArray(lines)) {
            this.content = lines.join('\n');
            this.raw = Buffer.from(this.content, "utf8");
            this.dirty = true;
        }
    }

    /**
     * The current length of the file, including any modifications.
     * @returns {Number} the length in Unicode characters of this file
     */
    getLength() {
        if (this.content === undefined) {
            this.read();
        }
        return this.content.length;
    }

    /**
     * The type of this file.
     * @type {String}
     * @protected
     */
    type;
    
    /**
     * Return the name of the filetype assigned to this file. This can
     * be used to find settings that govern the parsing and processing
     * of this file.
     * @returns {String} the filetype of this file
     */
    getType() {
        return this.type;
    }

    /**
     * Whether or not the file has been modified.
     * @type {Boolean}
     * @protected
     */
    dirty = false;

    /**
     * Return whether or not this instance has been modifed
     * from the original source.
     * 
     * @returns {Boolean} true if the file has been modified
     */
    isDirty() {
        return this.dirty;
    }

    /**
     * Write the file. If the path is given and it is different from the
     * path of the current file, then it is written to the other path.
     * Otherwise, this file will overwrite the source file. The path to
     * the file must exist first.
     *
     * @param {String} [filePath] optional path to write the file to
     * @returns {Boolean} true if the file was successfully written, false
     * if there was some error or if the file was not modified from the original
     */
    write(filePath) {
        if (filePath || this.isDirty()) {
            fs.writeFileSync(filePath || this.filePath, this.getContent(), "utf-8");
            this.isDirty = false;
            return true;
        }
        return false;
    }
}

export default SourceFile;
