/*
 * LintableFile.js - Represent a lintable source file
 *
 * Copyright © 2022-2025 JEDLSoft
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

import path from "node:path";
import log4js from "log4js";
import { getLocaleFromPath } from "ilib-tools-common";
import { IntermediateRepresentation, Parser, Result, SourceFile, FileStats, Serializer } from "ilib-lint-common";
import DirItem from "./DirItem.js";
import Project from "./Project.js";
import FileType from "./FileType.js";
import LintingStrategy from "./LintingStrategy.js";

const logger = log4js.getLogger("ilib-lint.root.LintableFile");

/**
 * @class Represent a source file
 */
class LintableFile extends DirItem {
    /**
     * The list of parsers that can parse this file.
     * @type {Parser[]}
     */
    parsers = [];

    /**
     * The serializer for this file type.
     * @type {Serializer|undefined}
     */
    serializer;

    /**
     * The file type of this source file
     * @type {FileType}
     */
    filetype;

    /**
     * The intermediate representations of this file
     * @type {IntermediateRepresentation[]}
     */
    irs = [];

    /**
     * Construct a source file instance
     * The options parameter can contain any of the following properties:
     *
     *
     * @constructor
     * @param {String} filePath path to the source file
     * @param {Object} options options for constructing this source file
     * @param {FileType} options.filetype file type of this source file
     * @param {String} [options.locale] locale of the file
     * @param {object} [options.settings] additional settings from the ilib-lint config that apply to this file
     * @param {Project} project the project where this file is located
     */
    constructor(filePath, options, project) {
        super(filePath, options, project);
        if (!options || !filePath || !options.filetype) {
            throw new Error("Incorrect options given to LintableFile constructor");
        }
        this.sourceFile = new SourceFile(filePath, {
            sourceLocale: options.locale,
            getLogger: log4js.getLogger.bind(log4js),
            type: options.filetype.getName(),
        });
        this.filetype = options.filetype;

        if (this.project.options.opt?.verbose) {
            logger.level = "debug";
        }
        this.parsers = [];
        let extension = path.extname(filePath);
        if (extension) {
            // remove the dot
            extension = extension.substring(1);
            this.parsers = this.filetype.getParsers(extension);
        }
        this.transformers = this.filetype.getTransformers();
        this.serializer = this.filetype.getSerializer();
    }

    /**
     * Return the locale gleaned from the file path using the template in
     * the settings, or undefined if no locale could be found.
     *
     * @returns {String} the locale gleaned from the path, or the empty
     * string if no locale could be found.
     */
    getLocaleFromPath() {
        if (this.settings?.template) {
            return getLocaleFromPath(this.settings.template, this.sourceFile.getPath());
        }
        return "";
    }

    /**
     * Parse the current source file into a list of Intermediate Representaitons
     */
    parse() {
        if (!this.filePath) {
            logger.warn(`No file path found for file, skipping parsing`);
            return;
        }
        if (this.parsers.length === 0) {
            logger.warn(`No parsers found for file ${this.filePath}, skipping parsing`);
            return;
        }

        this.irs = this.parsers.flatMap((parser) => {
            try {
                return parser.parse(this.sourceFile);
            } catch (e) {
                logger.trace(`Parser ${parser.getName()} could not parse file ${this.sourceFile.getPath()}`);
                logger.trace(e);
            }
        });

        if (this.irs.length === 0) {
            logger.error(`All available parsers failed to parse file ${this.sourceFile.getPath()}.`);
        }
    }

    /**
     * Check the current file and return a list of issues found in this file.
     * This method parses the source file and applies each rule in turn
     * using the given locales. Optionally, it also applies the available auto-fixes
     * and overwrites the underlying file depending if it's enabled in the project config options.
     *
     * @param {Array.<string>} locales a set of locales to apply
     * @returns {Array.<Result>} a list of natch results
     */
    findIssues(locales) {
        const detectedLocale = this.getLocaleFromPath();
        if (detectedLocale && !locales.includes(detectedLocale)) {
            // not one of the locales we need to check
            return [];
        }

        const locale = detectedLocale || this.project?.getSourceLocale();

        if (!this.filePath) return [];

        this.parse();

        const projectAutofixEnabled = this.project?.getConfig()?.autofix ?? false;

        return this.irs.flatMap((ir) => {
            /** @type {boolean} */
            const autofixEnabled = projectAutofixEnabled && !this.isDirty();
            return LintingStrategy.create({
                type: ir.getType(),
                fileType: this.filetype,
                autofixEnabled,
                fixerManager: this.project?.getFixerManager(),
            }).apply({
                ir,
                filePath: this.filePath,
                locale,
            });
        });
    }

    /**
     * Get the intermediate representations of this file.
     * @returns {Array.<IntermediateRepresentation>} the intermediate representations
     * of this file
     */
    getIRs() {
        return this.irs;
    }

    /**
     * Set the intermediate representations of this file.
     * @param {Array.<IntermediateRepresentation>} irs the intermediate representations
     * of this file
     */
    setIRs(irs) {
        if (irs.every((ir) => ir instanceof IntermediateRepresentation)) {
            this.irs = irs;
        } else {
            // should never happen
            throw new Error("Invalid intermediate representations provided to setIRs");
        }
    }

    /**
     * Return whether any of the intermediate representations of this file have been modified.
     * @returns {boolean}
     */
    isDirty() {
        return this.irs.some((ir) => ir.isDirty());
    }

    /**
     * Return the source file of this lintable file.
     * @returns {SourceFile} the source file
     */
    getSourceFile() {
        return this.sourceFile;
    }

    /**
     * Return the stats for the file after issues were found.
     * @returns {FileStats} the stats for the current file
     */
    getStats() {
        const fileStats = new FileStats();
        if (this.irs) {
            this.irs.forEach((ir) => {
                if (ir.stats) {
                    fileStats.addStats(ir.stats);
                }
            });
        }
        return fileStats;
    }

    /**
     * Return the file type of this file.
     * @returns {FileType} the file type of this file
     */
    getFileType() {
        return this.filetype;
    }

    /**
     * Apply the available transformers to the intermediate representations of this file.
     * @param {Array.<Result>} results the results of the rules that were applied earlier
     *   in the pipeline, or undefined if there are no results or if the rules have not been
     *   applied yet
     */
    applyTransformers(results) {
        const transformers = this.filetype.getTransformers();
        if (this.irs && this.irs.length > 0 && transformers && transformers.length > 0) {
            // For each intermediate representation, attempt to apply every transformer.
            // However, only those transformers that have the same type as the intermediate
            // representation can be applied.
            for (let i = 0; i < this.irs.length; i++) {
                if (!this.irs[i]) continue;
                transformers.forEach((transformer) => {
                    if (this.irs[i].getType() === transformer.getType()) {
                        const newIR = transformer.transform(this.irs[i], results);
                        if (newIR) {
                            this.irs[i] = newIR;
                        }
                    }
                });
            }
        }
    }
}

export default LintableFile;
