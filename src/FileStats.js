/*
 * FileStats.js - statistics about a file or a number of files
 *
 * Copyright © 2023 JEDLSoft
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
 * @class Represent statistics about source files.
 */
class FileStats {
    /** @private */ files = 1;
    /** @private */ lines;
    /** @private */ modules;

    /**
     * Construct an file statistics instance. Each count in the
     * statistics instance is optional except for the files.
     *
     * @param {Object} [options] options to the constructor
     * @param {Number} options.files the number of source files
     * being counted. If not given, this defaults to 1.
     * @param {Number} [options.lines] the number of lines in those
     * source files
     * @param {Number} [options.modules] the number of modules in
     * those source files. The definition of a "module" are given
     * by the programming language and may mean things like functions
     * or classes. It is up to the parser for that programming language
     * to count these.
     */
    constructor(options) {
        if (!options) return;
        ["files", "lines", "modules"].forEach(property => {
            if (typeof(options[property]) === 'number') this[property] = options[property];
        });
    }

    /**
     * Add statistics from another instance into this one and return
     * the result.
     *
     * @param {FileStats} stats the other instance to add to the current one
     * @returns {FileStats] the current instance
     */
    addStats(stats) {
        if (!stats || typeof(stats) !== 'object' || !(stats instanceof FileStats)) return this;
        ["files", "lines", "modules"].forEach(property => {
            this[property] += stats[property];
        });
        if (typeof(stats.files) !== 'number') {
            this.files++;
        }
        return this;
    }

    /**
     * Get the number of source files being counted.
     *
     * @returns {Number} the number of source files being counted
     */
    getFiles() {
        return this.files || 1;
    }

    /**
     * Add the given amount to the number of files.
     * @param {Number} num the amount to add
     * @returns {FileStats} the current instance
     */
    addFiles(num) {
        if (typeof(num) !== 'number') return this;
        this.files += num;
        return this;
    }

    /**
     * Get the number of source file lines being counted.
     *
     * @returns {Number} the number of source file lines being counted
     */
    getLines() {
        return this.lines || 0;
    }

    /**
     * Add the given amount to the number of lines.
     *
     * @param {Number} num the amount to add
     * @returns {FileStats} the current instance
     */
    addLines(num) {
        if (typeof(num) !== 'number') return this;
        this.lines += num;
        return this;
    }

    /**
     * Get the number of source file modules being counted.
     *
     * @returns {Number} the number of source file modules being counted
     */
    getModules() {
        return this.modules || 0;
    }

    /**
     * Add the given amount to the number of modules.
     *
     * @param {Number} num the amount to add
     * @returns {FileStats} the current instance
     */
    addModules(num) {
        if (typeof(num) !== 'number') return this;
        this.modules += num;
        return this;
    }
}

export default FileStats;