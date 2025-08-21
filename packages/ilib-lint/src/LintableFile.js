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
import { Fix, IntermediateRepresentation, Parser, Result, SourceFile, FileStats, Serializer } from "ilib-lint-common";
import DirItem from "./DirItem.js";
import Project from "./Project.js";
import FileType from "./FileType.js";

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
     * @returns {Array.<IntermediateRepresentation>} the parsed representations
     * of this file
     */
    parse() {
        if (!this.filePath) return [];
        const irs = this.parsers.flatMap((parser) => {
            try {
                return parser.parse(this.sourceFile);
            } catch (e) {
                logger.trace(`Parser ${parser.getName()} could not parse file ${this.sourceFile.getPath()}`);
                logger.trace(e);
            }
        });
        if (!irs || irs.length === 0) {
            throw new Error(
                `All available parsers failed to parse file ${this.sourceFile.getPath()}. Try configuring another parser or excluding this file from the lint project.`
            );
        }
        return irs;
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

        if (!this.filePath) return [];
        /**
         * @type {IntermediateRepresentation[]}
         */
        this.irs = [];

        const results = this.parsers.flatMap((parser) => {
            const /** @type {Result[]} */ fixedResults = [];
            let /** @type {Result[]} */ currentParseResults = [];

            try {
                let changesMade = false;
                let irs = parser.parse(this.sourceFile);

                do {
                    // indicate that for current round, we did not modify the current representations yet
                    changesMade = false;
                    // clear the results of the current parse in case any results were left over from the previous iteration
                    // which do not match the current intermediate representations any more, or which repeat the same issues
                    currentParseResults = [];

                    for (const ir of irs) {
                        // find the rules that are appropriate for this intermediate representation and then apply them
                        const rules = this.filetype.getRules().filter((rule) => rule.getRuleType() === ir.getType());

                        rules.forEach((rule) => {
                            logger.debug(`Checking rule  : ${rule.name}`);
                        });
                        logger.debug("");

                        // apply rules
                        const results = rules
                            .flatMap(
                                (rule) =>
                                    rule.match({
                                        ir,
                                        locale: detectedLocale || this.project.getSourceLocale(),
                                        file: this.filePath,
                                    }) ?? []
                            )
                            .filter((result) => result);
                        const fixable = results.filter((result) => result?.fix !== undefined);

                        let fixer;
                        if (
                            // ensure that autofixing is enabled
                            true === this.project.getConfig().autofix &&
                            // and that any fixable results were produced
                            fixable.length > 0 &&
                            // and that the fixer for this type of IR is avaliable
                            (fixer = this.project.getFixerManager().get(ir.getType()))
                        ) {
                            // attempt to apply fixes to the current IR
                            const fixes = /** @type {Fix[]} */ (fixable.map((result) => result.fix));
                            fixer.applyFixes(ir, fixes);

                            // check if anything had been applied
                            if (fixes.some((fix) => fix.applied)) {
                                // indicate that the content has been modified and the re-applying the rules should occur
                                changesMade = true;

                                // after writing out the fixed content, we may need to reparse to see if any new issues appeared,
                                // while preserving the results that have been fixed so far;
                                // fixer should have set the `applied` flag of each applied Fix
                                // so accumulate the corresponding results
                                fixedResults.push(...results.filter((result) => result.fix?.applied));
                            }
                        }

                        if (!changesMade) {
                            // otherwise, just accumulate the results of the current parse for each IRs
                            currentParseResults.push(...results);
                        }
                    }
                    // if a write had occurred for a given parser, redo the rule application
                } while (changesMade);

                if (irs) {
                    this.irs = this.irs.concat(irs);
                }
            } catch (e) {
                if (this.parsers.length === 1) {
                    // if this is the only parser for this file, throw an exception right away so the user
                    // can see what the specific parse error was from the parser
                    throw new Error(
                        `Could not parse file ${this.sourceFile.getPath()}. Try configuring another parser or excluding this file from the lint project.`,
                        // @ts-expect-error: Error cause is only available since Node 16.9, but it's OK to pass it in older versions
                        {
                            cause: e,
                        }
                    );
                }
                logger.trace(`Parser ${parser.getName()} could not parse file ${this.sourceFile.getPath()}`);
                logger.trace(e);
            }

            // once all intermediate representations have been processed for the given parser
            // without any modifications, finally return all of the results accumulated during auto-fixing
            // and the remaining ones that were produced by the rules which did not involve any fixes
            return [...fixedResults, ...currentParseResults];
        });
        if (this.irs.length === 0) {
            throw new Error(
                `All available parsers failed to parse file ${this.sourceFile.getPath()}. Try configuring another parser or excluding this file from the lint project.`
            );
        }

        return results;
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
