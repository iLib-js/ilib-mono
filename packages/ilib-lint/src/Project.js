/*
 * Project.js - Represents a particular ilin-lint project
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

import fs from "node:fs";
import path from "node:path";
import log4js from "log4js";
import mm from "micromatch";

import { FileStats, SourceFile, Formatter, Result } from "ilib-lint-common";

import LintableFile from "./LintableFile.js";
import DirItem from "./DirItem.js";
import FileType from "./FileType.js";
import { FolderConfigurationProvider } from "./config/ConfigurationProvider.js";
import ResultComparator from "./ResultComparator.js";
import FixerManager from "./FixerManager.js";
import ParserManager from "./ParserManager.js";
import PluginManager from "./PluginManager.js";
import RuleManager from "./RuleManager.js";
import SerializerManager from "./SerializerManager.js";
import TransformerManager from "./TransformerManager.js";

const logger = log4js.getLogger("ilib-lint.root.Project");

const rulesetDefinitions = {
    "resource-check-all": {
        "resource-icu-plurals": true,
        "resource-quote-style": "localeOnly",
        "resource-unique-keys": true,
        "resource-url-match": true,
        "resource-named-params": true,
        "resource-snake-case": true,
        "resource-camel-case": true,
    },
};

const xliffFileTypeDefinition = {
    name: "xliff",
    glob: "**/*.xliff",
    ruleset: ["resource-check-all"],
};

const unknownFileTypeDefinition = {
    name: "unknown",
    glob: "**/*",
};

/**
 * Return true if the given method name is a method that is
 * defined in the class itself and not inherited from a parent
 * class.
 *
 * @private
 * @template {abstract new (...args: any[]) => any} Class
 * @param {InstanceType<Class>} instance the instance to check
 * @param {String} methodName the name of the method to check
 * @param {Class} parentClass the parent class of the instance or one of its ancestors
 * @returns {boolean} true if the method is defined in the class itself
 */
function isOwnMethod(instance, methodName, parentClass) {
    return typeof instance[methodName] === "function" && instance[methodName] !== parentClass.prototype[methodName];
}

/**
 * @class Represent an ilin-lint project.
 *
 * A project is defined as a root directory and a configuration that
 * goes with it that tells the linter how to process files it finds
 * in that root directory. Subprojects can be nested inside of the
 * the top project as indicated by the presence of a new configuration
 * file in the subdirectory.
 */
class Project extends DirItem {
    /**
     * The plugin manager for this run of the ilib-lint tool
     * @type {PluginManager}
     */
    pluginMgr;

    /**
     * Construct a new project.
     *
     * @param {String} root root directory for this project
     * @param {Object} options properties controlling how this run of the linter
     * works, mostly from the command-line options
     * @param {PluginManager} options.pluginManager the plugin manager to use for this project
     * @param {Record<string, unknown>} [options.settings] the settings from the ilib-lint config that
     *  apply to this file
     * @param {Object} config contents of a configuration file for this project
     */
    constructor(root, options, config) {
        super(root, options, config);

        /** @type {DirItem[]} */
        this.dirItems = [];

        if (!options || !root || !config || !options.pluginManager) {
            throw "Insufficient params given to Project constructor";
        }

        this.root = root;
        this.options = options;
        this.config = config;
        if (this.config) {
            this.includes = this.config.paths ? Object.keys(this.config.paths) : ["**"];
            this.excludes = config.excludes;
            this.name = config.name;
        }

        this.sourceLocale = config?.sourceLocale || options?.opt?.sourceLocale;
        this.config.autofix = options?.opt?.fix === true || config?.autofix === true;

        this.pluginMgr = this.options.pluginManager;

        const ruleMgr = this.pluginMgr.getRuleManager();
        ruleMgr.addRuleSetDefinitions(rulesetDefinitions);

        this.filetypes = {
            xliff: new FileType({ project: this, ...xliffFileTypeDefinition }),
            unknown: new FileType({ project: this, ...unknownFileTypeDefinition }),
        };

        this.resultStats = {
            errors: 0,
            warnings: 0,
            suggestions: 0,
        };
    }

    /**
     *
     * Recursively walk a directory and return a list of files and directories
     * within that directory. The walk is controlled via a list of exclude and
     * include patterns. Each pattern should be a micromatch pattern like this:
     *
     * <code>
     * "*.json"
     * </code>
     *
     * The full path to every file and directory in the top-level directory will
     * be included, unless it matches an exclude pattern, it which case, it will be
     * excluded from the output. However, if the path
     * also matches an include pattern, it will still be included nonetheless. The
     * idea is that you can exclude a whole category of files (like all json files),
     * but include specific ones. For example, you may exclude all json files, but
     * still want to include the "config.json" file.<p>
     *
     * @param {String} root Directory to walk
     * @returns {Promise<DirItem[]>} an array of file names in the directory, filtered
     * by the excludes and includes list
     * @private
     */
    async walk(root) {
        let list;

        if (typeof root !== "string") {
            return [];
        }

        let includes = this.getIncludes();
        let excludes = this.getExcludes();
        let pathName, included, stat, glob;

        try {
            stat = fs.statSync(
                root,
                // @ts-expect-error: `throwIfNoEntry` is only available since 14.17.0
                // older versions don't throw so it's OK to pass it here
                { throwIfNoEntry: false }
            );
            if (stat) {
                if (stat.isDirectory()) {
                    const currentFolderConfigurationProvider = new FolderConfigurationProvider(root);
                    if (root !== this.root && (await currentFolderConfigurationProvider.hasConfigurationFile())) {
                        const config = await currentFolderConfigurationProvider.loadConfiguration();
                        const newProject = new Project(root, this.getOptions(), config);
                        includes = newProject.getIncludes();
                        excludes = newProject.getExcludes();
                        logger.trace(`New project ${newProject.getName()}`);
                        this.add(newProject);
                        await newProject.init();
                        await newProject.scan([root]);
                    } else {
                        list = fs.readdirSync(root);
                        logger.trace(`Searching dir ${root}`);

                        if (list && list.length !== 0) {
                            list.sort();
                            for (const file of list) {
                                if (file === "." || file === "..") {
                                    continue;
                                }

                                pathName = path.join(root, file);
                                included = true;

                                if (excludes) {
                                    logger.trace(`There are excludes. Relpath is ${pathName}`);
                                    included = !mm.isMatch(pathName, excludes);
                                }

                                if (included) {
                                    await this.walk(pathName);
                                }
                            }
                        }
                    }
                } else if (stat.isFile()) {
                    included = false;

                    if (includes) {
                        logger.trace(`There are includes.`);
                        mm.match(root, includes, {
                            onMatch: (params) => {
                                if (!glob && params.isMatch) {
                                    glob = params.glob;
                                    const settings = this.getSettings(glob);
                                    excludes = settings.excludes || excludes;
                                    included = excludes ? !mm.isMatch(root, excludes) : true;
                                }
                            },
                        });
                    }

                    if (included) {
                        logger.trace(`${root} ... included`);
                        glob = glob || "**";
                        const filetype = this.getFileTypeForPath(root);
                        this.add(
                            new LintableFile(
                                root,
                                {
                                    settings: this.getSettings(glob),
                                    filetype,
                                },
                                this
                            )
                        );
                    } else {
                        logger.trace(`${root} ... excluded`);
                    }
                } // else just ignore it
            } else {
                logger.warn(`File ${root} does not exist.`);
            }
        } catch (e) {
            logger.error(`Error while walking directory ${root}`, e);
        }

        return this.get();
    }

    /**
     * Scan the given paths for files and subprojects to process later.
     * If this method finds a subproject, it will be added to the list
     * as well, and its scan method will be called.
     *
     * @param {Array.<String>} paths an array of paths to scan
     */
    async scan(paths) {
        for (const pathName of paths) {
            await this.walk(pathName);
        }
    }

    /**
     * Initialize this project. This returns a promise to load the
     * plugins and initializes them.
     *
     * @returns {Promise<void>} a promise to initialize the project
     */
    async init() {
        if (this.config.plugins) {
            await this.pluginMgr.load(this.config.plugins);
        }

        // initialize any projects or files that have an init method.
        await Promise.all(this.dirItems.map((dirItem) => dirItem.init()));

        // This configuration processing below was moved here from the
        // constructor. The reason is that it has to be done after
        // the plugins are already loaded because the plugins themselves
        // may be providing some of the parsers, rules, rulesets, etc.
        // that are referenced in the config.

        const ruleMgr = this.pluginMgr.getRuleManager();
        const fmtMgr = this.pluginMgr.getFormatterManager();
        const fixerMgr = this.pluginMgr.getFixerManager();
        if (this.config.rules) {
            ruleMgr.add(this.config.rules);
        }
        if (this.config.rulesets) {
            ruleMgr.addRuleSetDefinitions(this.config.rulesets);
        }
        if (this.config.formatters) {
            fmtMgr.add(this.config.formatters);
        }
        if (this.config.fixers) {
            fixerMgr.add(this.config.fixers);
        }

        if (this.config.filetypes) {
            for (let ft in this.config.filetypes) {
                this.filetypes[ft] = new FileType({
                    name: ft,
                    project: this,
                    ...this.config.filetypes[ft],
                });
            }
        }
        if (this.config.paths) {
            this.mappings = this.config.paths;
            for (let glob in this.mappings) {
                let mapping = this.mappings[glob];
                if (typeof mapping === "object") {
                    // this is an "on-the-fly" file type
                    this.filetypes[glob] = new FileType({
                        name: glob,
                        project: this,
                        ...mapping,
                    });
                } else if (typeof mapping === "string") {
                    if (!this.filetypes[mapping]) {
                        throw `Mapping ${glob} is configured to use unknown filetype ${mapping}`;
                    }
                }
            }
        }

        const formatterName = this.options?.opt?.formatter || this.options.formatter || "ansi-console-formatter";
        const formatter = fmtMgr.get(formatterName);
        if (!formatter) {
            throw new Error(`Could not find formatter ${formatterName}`);
        }
        this.formatter = formatter;
    }

    /**
     * Get the unique name of this project.
     * @returns {String} the unique name of this project.
     */
    getName() {
        return this.name;
    }

    /**
     * Return the root directory for this project.
     * @returns {String} the path to the root directory of this project
     */
    getRoot() {
        return this.root;
    }

    /**
     * Return the includes list for this project.
     * @returns {Array.<String>} the includes for this project
     */
    getIncludes() {
        return this.includes ?? [];
    }

    /**
     * Return the excludes list for this project.
     * @returns {Array.<String>} the excludes for this project
     */
    getExcludes() {
        return this.excludes;
    }

    /**
     * Return the options for this project.
     * @returns {Array.<String>} the options for this project
     */
    getOptions() {
        return this.options;
    }

    /**
     * Get the source locale for this project. This is the locale in
     * which the strings and source code are written.
     *
     * @returns {String} the source locale for this project.
     */
    getSourceLocale() {
        return this.sourceLocale || "en-US";
    }

    /**
     * Return the list of global locales for this project.
     * @returns {Array.<String>} the list of global locales for this project
     */
    getLocales() {
        return this.options.locales || this.config.locales;
    }

    /**
     * Return the plugin manager for this project.
     * @returns {PluginManager} the plugin manager for this project
     */
    getPluginManager() {
        return this.options.pluginManager;
    }

    /**
     * Return the parser manager for this project.
     * @returns {ParserManager} the parser manager for this project
     */
    getParserManager() {
        const pluginMgr = this.options.pluginManager;
        return pluginMgr.getParserManager();
    }

    /**
     * Return the rule manager for this project.
     * @returns {RuleManager} the rule manager for this project
     */
    getRuleManager() {
        const pluginMgr = this.options.pluginManager;
        return pluginMgr.getRuleManager();
    }

    /**
     * Return the fixer manager for this project.
     * @returns {FixerManager} the fixer manager for this project
     */
    getFixerManager() {
        const pluginMgr = this.options.pluginManager;
        return pluginMgr.getFixerManager();
    }

    /**
     * Return the transformer manager for this project.
     * @returns {TransformerManager} the transformer manager for this project
     */
    getTransformerManager() {
        const pluginMgr = this.options.pluginManager;
        return pluginMgr.getTransformerManager();
    }

    /**
     * Return the serializer manager for this project.
     * @returns {SerializerManager} the serializer manager for this project
     */
    getSerializerManager() {
        const pluginMgr = this.options.pluginManager;
        return pluginMgr.getSerializerManager();
    }

    /**
     * Using the path mappings, find the file type that applies for
     * the given path. If no mappings apply, the "unkown" file type
     * will be returned.
     *
     * @param {String} pathName the path to the file to test
     * @returns {FileType} the file type instance that applies to
     * the given file.
     */
    getFileTypeForPath(pathName) {
        pathName = path.normalize(pathName);
        for (let glob in this.mappings) {
            if (mm.isMatch(pathName, glob)) {
                // if it is a string, it names the file type. If it is
                // something else, then it is an on-the-fly file type
                // definition
                const name = typeof this.mappings[glob] === "string" ? this.mappings[glob] : glob;
                return this.filetypes[name] || this.filetypes.unknown;
            }
        }
        // default: we don't know what this type of file is!
        return this.filetypes.unknown;
    }

    getRuleSet(glob) {
        if (this.config.paths && this.config.paths[glob]) {
            const rules = this.config.paths[glob].rules;
        }
    }

    getConfig() {
        return this.config;
    }

    getSettings(glob) {
        return (this.config.paths && this.config.paths[glob]) || {};
    }

    /**
     * Add a directory item to this project.
     *
     * @param {DirItem} item directory item to add
     */
    add(item) {
        this.dirItems.push(item);
    }

    /**
     * Return all lintable files in this project.
     * @returns {Array.<LintableFile>} the lintable files in this project.
     */
    get() {
        return this.dirItems
            .flatMap((dirItem) => {
                if (dirItem instanceof LintableFile) {
                    return dirItem;
                } else if (dirItem instanceof Project) {
                    return dirItem.get();
                } else {
                    return undefined;
                }
            })
            .filter((file) => !!file);
    }

    /**
     * Find all issues with the files located within this project and
     * all subprojects, and return them together in an array.
     *
     * @param {Array.<String>} locales the locales to find issues for
     * @returns {Array.<Result>} a list of results
     */
    findIssues(locales) {
        this.fileStats = new FileStats();

        return this.get()
            .flatMap((file) => {
                if (!this.options.opt.quiet && this.options.opt.progressInfo) {
                    logger.info(`Finding issues in file [${file.filePath}]`);
                }
                try {
                    const results = file.findIssues(locales);
                    this.fileStats?.addStats(file.getStats());
                    return results;
                } catch (e) {
                    logger.error(`Error finding issues in file [${file.filePath}]`, e);
                    return undefined;
                }
            })
            .filter((result) => !!result);
    }

    /**
     * Apply any transformer plugins to the intermediate representation of
     * each file.
     *
     * @param {Array.<Result>} results the results of the linting process
     */
    applyTransformers(results) {
        this.get().forEach((file) => file.applyTransformers(results));
    }

    /**
     * Serialize files in this project using the Serializer plugin for the
     * file type of each file.
     */
    serialize() {
        if (this.options.opt.write) {
            const files = this.get();
            files.forEach((file) => {
                const irs = file.getIRs();
                const fileType = file.getFileType();
                const serializer = fileType.getSerializer();
                if (file.isDirty() && serializer) {
                    let sourceFile = serializer.serialize(irs);
                    if (!this.options.opt.overwrite) {
                        let outputPath = `${sourceFile.getPath()}.modified`;
                        sourceFile = new SourceFile(outputPath, {
                            file: sourceFile,
                        });
                    }
                    sourceFile.write();
                }
            });
        }
    }

    /**
     * Return the I18N Score of this project. The score is a number from
     * zero to 100 which gives the approximate localization readiness of
     * the whole project. The absolute number of the score is not as
     * important as the relative movement of the score, as the increase
     * in score shows an improvement in localizability.
     *
     * In this particular score, errors are weighted most heavily,
     * followed by warnings at a medium level, and suggestions at a
     * very light level.
     *
     * @returns {Number} the score (0-100) for this project.
     */
    getScore() {
        if (!this.fileStats) {
            throw new Error("Attempt to calculate the I18N score without having retrieved the issues first.");
        }

        const base =
            this.fileStats.modules || this.fileStats.lines || this.fileStats.files || this.fileStats.bytes || 1;
        const demeritPoints =
            this.resultStats.errors * 5 + this.resultStats.warnings * 3 + this.resultStats.suggestions;

        // divide demerit points by the base so that larger projects are not penalized for
        // having more issues just because they have more files, lines, or modules
        // y intercept = 100
        // lim(x->infinity) of f(x) = 0
        return 100 / (1.0 + demeritPoints / base);
    }

    /**
     * Find all issues in this project and all subprojects and print
     * them with the chosen formatter. This is the main loop.
     * @returns {Number} the exit value
     */
    run() {
        let startTime = new Date();

        const results = this.findIssues(this.options.opt.locales);
        this.applyTransformers(results);
        this.serialize();
        let endTime = new Date();
        this.resultStats = {
            errors: 0,
            warnings: 0,
            suggestions: 0,
        };

        let totalTime = (endTime.getTime() - startTime.getTime()) / 1000;

        // make sure the results are organized by the order the lines appear in the
        // source file in order to make it easier for the engineer to fix all the
        // problems in the source file sequentially.
        results.sort(ResultComparator);
        let resultAll;
        if (results) {
            results.forEach((result) => {
                if (result.severity === "error") {
                    this.resultStats.errors++;
                } else if (result.severity === "warning") {
                    this.resultStats.warnings++;
                } else {
                    this.resultStats.suggestions++;
                }
            });
        }
        const fmt = new Intl.NumberFormat("en-US", {
            maxFractionDigits: 2,
        });
        const score = this.getScore();
        if (this.formatter && isOwnMethod(this.formatter, "formatOutput", Formatter)) {
            resultAll = this.formatter.formatOutput({
                name: this.options.opt.name || this.project.name,
                fileStats: this.fileStats,
                resultStats: this.resultStats,
                results: results,
                score: score,
                time: totalTime,
                errorsOnly: this.options.opt.errorsOnly || false,
            });
        } else {
            let outputArray = [];
            results.forEach((result) => {
                const str = this.formatter?.format(result);
                if (str) {
                    if (result.severity === "error") {
                        if (!this.options.opt.output) {
                            logger.error(str);
                        }
                        outputArray.push(str);
                    } else if (result.severity === "warning") {
                        if (!this.options.errorsOnly) {
                            if (!this.options.opt.output) {
                                logger.warn(str);
                            }
                            outputArray.push(str);
                        }
                    } else {
                        if (!this.options.errorsOnly) {
                            if (!this.options.opt.output) {
                                logger.info(str);
                            }
                            outputArray.push(str);
                        }
                    }
                }
                return str;
            });

            const lines = [
                `Total Elapse Time: ${String(totalTime)} seconds`,
                `                             ${`Average over`.padEnd(15, " ")}${`Average over`.padEnd(
                    15,
                    " "
                )}${`Average over`.padEnd(15, " ")}`,
                `                   Total     ${`${String(this.fileStats.files)} Files`.padEnd(15, " ")}${`${String(
                    this.fileStats.modules
                )} Modules`.padEnd(15, " ")}${`${String(this.fileStats.lines)} Lines`.padEnd(15, " ")}`,
            ];
            if (results.length) {
                // avoid division by zero if the fileStats is undefined or zero
                const errorsPerFile = this.resultStats.errors / (this?.fileStats?.files || 1);
                const warningsPerFile = this.resultStats.warnings / (this?.fileStats?.files || 1);
                const suggestionsPerFile = this.resultStats.suggestions / (this?.fileStats?.files || 1);
                const errorsPerModule = this.resultStats.errors / (this?.fileStats?.modules || 1);
                const warningsPerModule = this.resultStats.warnings / (this?.fileStats?.modules || 1);
                const suggestionsPerModule = this.resultStats.suggestions / (this?.fileStats?.modules || 1);
                const errorsPerLine = this.resultStats.errors / (this?.fileStats?.lines || 1);
                const warningsPerLine = this.resultStats.warnings / (this?.fileStats?.lines || 1);
                const suggestionsPerLine = this.resultStats.suggestions / (this?.fileStats?.lines || 1);
                lines.push(
                    `Errors:            ${String(this.resultStats.errors).padEnd(10, " ")}${fmt
                        .format(errorsPerFile)
                        .padEnd(15, " ")}${fmt.format(errorsPerModule).padEnd(15, " ")}${fmt
                        .format(errorsPerLine)
                        .padEnd(15, " ")}`
                );
                if (!this.options.errorsOnly) {
                    lines.push(
                        `Warnings:          ${String(this.resultStats.warnings).padEnd(10, " ")}${fmt
                            .format(warningsPerFile)
                            .padEnd(15, " ")}${fmt.format(warningsPerModule).padEnd(15, " ")}${fmt
                            .format(warningsPerLine)
                            .padEnd(15, " ")}`
                    );
                    lines.push(
                        `Suggestions:       ${String(this.resultStats.suggestions).padEnd(10, " ")}${fmt
                            .format(suggestionsPerFile)
                            .padEnd(15, " ")}${fmt.format(suggestionsPerModule).padEnd(15, " ")}${fmt
                            .format(suggestionsPerLine)
                            .padEnd(15, " ")}`
                    );
                }
            }
            lines.push(`I18N Score (0-100) ${fmt.format(score)}`);

            if (!this.options.opt.output) {
                lines.forEach((line) => {
                    logger.info(line);
                });
            }
            resultAll = outputArray.concat(lines).join("\n");
        }

        if (this.options.opt.output) {
            let file = this.options.opt.output;
            let fileDir = path.dirname(file);
            if (!fs.existsSync(fileDir)) {
                fs.mkdirSync(fileDir);
            }
            fs.writeFileSync(file, resultAll, "utf8");
            if (!this.options.opt.quiet && this.options.opt.progressInfo) {
                logger.info(`Wrote the results output to file ${file}`);
            }
        }

        return this.getExitValue();
    }

    /**
     * Status codes for the exit value of the run method.
     * @private
     * @readonly
     */
    static exitValues = /** @type {const} */ ({
        ERROR: 2,
        WARNING: 1,
        SUCCESS: 0,
    });

    /** @private */
    getExitValue() {
        // TODO fix types of project options and then clean up these local variables
        // TODO refactor runtime defaults to be closer to the definition of the options
        // currently defaults are based on this command line documentation
        // https://github.com/iLib-js/ilib-mono/blob/f252e4cf2fc573b51cbc5070778d67827f3174eb/packages/ilib-lint/src/index.js#L121-L143

        /**
         * Maximum number of errors to still pass
         * @type {number}
         */
        // @ts-expect-error: options.opt is not typed
        const maxErrors = this.options.opt["max-errors"] ?? 0;

        /**
         * Maximum number of warnings to still pass
         * @type {number}
         */
        // @ts-expect-error: options.opt is not typed
        const maxWarnings = this.options.opt["max-warnings"] ?? 0;

        /**
         * Maximum number of suggestions to still pass
         * @type {number | undefined}
         */
        // @ts-expect-error: options.opt is not typed
        const maxSuggestions = this.options.opt["max-suggestions"] ?? undefined;

        /**
         * Minimum score to pass
         * @type {number | undefined}
         */
        // @ts-expect-error: options.opt is not typed
        const minScore = this.options.opt["min-score"] ?? undefined;

        /**
         * Only return errors and supress warnings
         * @type {boolean}
         */
        // @ts-expect-error: options.errorsOnly is not typed
        const errorsOnly = Boolean(this.options.errorsOnly);

        if (this.resultStats.errors > maxErrors) {
            return Project.exitValues.ERROR;
        }

        if (minScore !== undefined) {
            const score = this.getScore();
            if (score < minScore) {
                return Project.exitValues.ERROR;
            }
        }

        // errorsOnly suppresses checking warning and suggestion counts
        if (!errorsOnly) {
            if (this.resultStats.warnings > maxWarnings) {
                return Project.exitValues.WARNING;
            }
            if (maxSuggestions !== undefined && this.resultStats.suggestions > maxSuggestions) {
                return Project.exitValues.WARNING;
            }
        }

        return Project.exitValues.SUCCESS;
    }

    clear() {
        this.dirItems = [];
    }
}

export default Project;
