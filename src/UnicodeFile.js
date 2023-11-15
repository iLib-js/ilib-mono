/*
 * UnicodeFile.js - read and parse a file downloaded from the unicode repository
 *
 * Copyright © 2022, JEDLSoft
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

/**
 * @class
 *
 * Parses a Unicode-style file. Unicode files have comments, blank
 * lines and content lines. Content lines have fields separated with
 * a semi-colon, which are optionally followed by a comment. This
 * class automatically skips all comments and blank lines and only
 * retrieves content lines.<p>
 *
 * It is up to the caller to interpret the fields in a content line
 * as it sees fit. Content lines do not necessarily all contain the
 * same number of fields.<p>
 *
 * The options must contain only one of the following properties:
 *
 * <ul>
 * <li>path - Path to the file to read on disk
 * <li>string - The actual in-memory text of the file
 * </ul>
 *
 * The options can also contain zero or more of the following properties:
 *
 * <ul>
 * <li>splitChar - defines the field separator. This can be a character or
 * regular expression to split each line on. Default is semi-colon ';'
 * <li>commentString - defines the string that introduces a line comment.
 * Everything after this string to the end of the line is ignored as a comment.
 * Default is the hash char '#'.
 * <li>multilineComments - this file can have comments that start with an @
 * and then continue with empty fields to start each line. The initial line
 * and all the continuation lines should be skipped.
 * </ul>
 *
 * @param {Object.<path:string,string:string,splitChar:string,commentString:string>} options options governing the construction of this file
 */
export default class UnicodeFile {
    constructor(options) {
        let data;

        this.rows = [];
        this.splitChar = ';';
        this.commentString = '#';

        if (options) {
            if (options.path) {
                data = fs.readFileSync(options.path, "utf-8");
            }
            if (options.string) {
                data = options.string;
            }
            if (options.splitChar) {
                this.splitChar = options.splitChar;
            }
            if (options.commentString) {
                this.commentString = options.commentString;
            }
            if (typeof(options.multilineComments) === "boolean" || options.multilineComments) {
                this.multilineComments = !!options.multilineComments;
            }
        }

        if (!data) {
            return undefined;
        }

        const string = (data.charAt(data.length-1) === '\n') ? data.substring(0, data.length-1): data;
        const rows =  string.split('\n');
        let row;

        for (let i = 0; i < rows.length; i++) {
            if (rows[i].trim().charAt(0) === '@') {
                if (this.multilineComments) {
                    while (i+1 < rows.length && rows[i+1].charAt(0) === this.splitChar) {
                        i++;
                    }
                }
            } else {
                const commentStart = rows[i].indexOf(this.commentString);
                row = (commentStart === -1) ? rows[i] : rows[i].substring(0, commentStart);
                row = row.trim();
                if (row.length > 0) {
                    this.rows.push(row);
                }
            }
        }
    }

    /**
     * Return the number of content lines in this unicode file.
     * @return {number} the number of content lines in this unicode file
     */
    length() {
        return this.rows.length;
    }

    /**
     * Return the content line with the given index.
     *
     * @param {number} index the index of the given content line
     * @return {Array.<string>} an array of content values as strings
     */
    get(index) {
        const row = (index >= 0 && index < this.rows.length) ? this.rows[index] : undefined;
        return row && row.split(this.splitChar);
    }

    /**
     * Return the whole line at the given index
     * @param index line number to get
     * @returns {string} the whole line at the given index
     */
    getLine(index) {
        return (index >= 0 && index < this.rows.length) ? this.rows[index] : undefined;
    }
};