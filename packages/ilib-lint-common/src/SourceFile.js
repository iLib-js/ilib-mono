/*
 * SourceFile.js - Represent a file that will be linted
 *
 * Copyright © 2024-2025 JEDLSoft
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

import fs from "fs";
import path from "path";
import { Buffer } from "buffer";
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
     * @param {SourceFile} [options.file] the source file to copy from. Other options
     * will override the fields in this file
     * @param {String} [options.sourceLocale] Deprecated: the source locale of the files
     * being linted
     * @param {Function} [options.getLogger] a callback function provided by
     * the linter to retrieve the log4js logger
     * @param {String} [options.type] the type of this file
     * @param {String} [options.content] the content of the file
     * @param {Buffer} [options.raw] the raw bytes of the file
     * @constructor
     */
    constructor(uri, options) {
        if (!uri) {
            throw new Error("Attempt to create a SourceFile without a file path");
        }
        this.filePath = uri;
        if (options?.file) {
            this.logger = options.file.logger;
            this.sourceLocale = options.file.sourceLocale;
            this.raw = options.file.raw;
            this.content = options.file.content;
            this.dirty = options.file.dirty;
        }
        // other options can override the file options
        if (typeof options?.getLogger === "function") {
            this.logger = options.getLogger("ilib-lint-common.SourceFile");
        }
        if (options?.sourceLocale) {
            this.sourceLocale = options.sourceLocale;
        }
        if (options?.type) {
            this.type = options.type;
        }
        if (typeof options?.content === "string") {
            this.content = options.content;
            if (this.content) {
                this.dirty = true;
                this.raw = Buffer.from(this.content, "utf8");
            }
        } else if (options?.raw) {
            this.raw = options.raw;
            if (this.raw) {
                this.dirty = true;
                this.content = this.raw.toString("utf8");
            }
        }
    }

    /**
     * Read the contents of the file into memory.
     * @throws Error if the file could not be read, or if it is not encoded in UTF-8
     * @protected
     * @throws {Error} if the file could not be read
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
     * The locale of this file
     * @deprecated
     * @type {string}
     * @default "en-US"
     */
    sourceLocale = "en-US";

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
     * @type {Buffer|undefined}
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
            if (this.raw === undefined) {
                throw new Error("Raw is undefined");
            }
        }
        return this.raw;
    }

    /**
     * The content of the file, stored as regular Javascript string
     * encoded in UTF-8.
     *
     * @type {String|undefined}
     * @protected
     */
    content;

    /**
     * Get the content of this file encoded as a regular Javascript
     * string.
     * @returns {String} the content of the file, encoded as a JS string
     */
    getContent() {
        if (typeof this.content === "undefined") {
            this.read();
            if (typeof this.content === "undefined") {
                throw new Error("Content is undefined");
            }
        }

        return this.content;
    }

    /**
     * Get the content of this file, encoded as an array of lines. Each
     * line has its trailing newline character removed.
     * @returns {Array.<String>|undefined} the content as an array of lines
     */
    getLines() {
        if (typeof this.content === "undefined") {
            this.read();
        }
        return this.content?.split(/[\r\n]+/g);
    }

    /**
     * Set the content of this file to the given array of lines. Do not call
     * this method any more. It is deprecated and will be removed soon.
     *
     * @deprecated
     * @param {Array.<String>} lines the lines to set as the content
     */
    setLines(lines) {
        // Should not call setLines in the SourceFile class
        throw new NotImplementedError();
    }

    /**
     * The current length of the file content, including any modifications.
     * Note that this is the length of the content in Unicode characters,
     * not the length of the raw bytes.
     *
     * @returns {Number} the length in Unicode characters of this file
     */
    getLength() {
        if (this.content === undefined) {
            this.read();
        }
        return this.content?.length || 0;
    }

    /**
     * The type of this file. This should match the type of
     * pipeline elements that process this same type of file. If the type
     * of a file is not known, then the type should be "string" which means
     * that the file is treated as a plain string of text.
     *
     * @type {String}
     * @protected
     */
    type = "string";

    /**
     * Return the type of this file. This should match the type of
     * pipeline elements that process this same type of file.
     *
     * @returns {String} the type of this file
     */
    getType() {
        return this.type;
    }

    /**
     * Whether or not the file has been written to disk.
     *
     * @type {Boolean}
     * @protected
     */
    dirty = false;

    /**
     * Return whether or not the content of this instance is
     * different than the content of the file on disk.
     *
     * @returns {Boolean} true if the file is different than
     * the content of this instance, false otherwise
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
     * @returns {Boolean} true if the file was successfully written, false
     * if there was some error or if the file was not modified from the original
     */
    write() {
        if (this.filePath && this.isDirty()) {
            const dir = path.dirname(this.filePath);
            fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
            fs.writeFileSync(this.filePath, this.getContent() || "", "utf-8");
            this.dirty = false;
            return true;
        }
        return false;
    }
}

export default SourceFile;
