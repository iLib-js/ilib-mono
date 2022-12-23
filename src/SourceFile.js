/*
 * SourceFile.js - Represent a source file
 *
 * Copyright © 2022 JEDLSoft
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

import path from 'node:path';
import fs from 'node:fs';
import { getLocaleFromPath, TranslationSet } from 'ilib-tools-common';

import DirItem from './DirItem.js';

/**
 * @class Represent a source file
 */
class SourceFile extends DirItem {
    /**
     * Construct a source file instance
     * The options parameter can contain any of the following properties:
     *
     * - filePath {String} path to the file
     *
     * @param {Object} options options for constructing this source file
     * @param {Project} project the project where this file is located
     */
    constructor(filePath, options, project) {
        super(filePath, options, project);
        if (!options || !filePath) {
            throw "Incorrect options given to SourceFile constructor";
        }
        this.filePath = filePath;
        this.type = "line";

        let parserClasses;
        let extension = path.extname(this.filePath);
        if (extension) {
            // remove the dot
            extension = extension.substring(1);
            const pm = project.getParserManager();
            this.parserClasses = pm.get(extension);
        }
    }

    /**
     * Return the locale gleaned from the file path using the template in
     * the settings, or undefined if no locale could be found.
     *
     * @returns {String} the locale gleaned from the path, or the empty
     * string if no locale could be found.
     */
    getLocaleFromPath() {
        if (this.settings && this.settings.template) {
            return getLocaleFromPath(this.settings.template, this.filePath);
        }
        return "";
    }

    /**
     * Parse the current source file into a list of resources (in the case of
     * resource files, or lines in the case of other types of files.
     * @param {Array.<Parser>} parsers parsers for the current source file
     * @returns {Object} the parsed representation of this file
     */
    parse() {
        if (!this.filePath) return;
        if (this.parserClasses && this.parserClasses.length) {
            const ts = new TranslationSet();
            for (const parser of this.parserClasses) {
                const p = new parser({
                    filePath: this.filePath
                });
                p.parse();
                this.type = "resource";
                ts.addAll(p.getResources());
            }

            this.resources = ts.getAll();
            return this.resources;
        } else {
            const data = fs.readFileSync(this.filePath, "utf-8");
            this.lines = data.split(/\n/g);
            this.type = "line";
            return this.lines;
        }
    }

    /**
     * Check the current file and return a list of issues found in this file.
     * This method parses the source file and applies each rule in turn
     * using the given locales.
     *
     * @param {RuleSet} ruleset a set of rules to apply
     * @param {Array.<Locale>} locales a set of locales to apply
     * @returns {Array.<Result>} a list of natch results
     */
    findIssues(ruleset, locales) {
        let issues = [], names;
        const detectedLocale = this.getLocaleFromPath();

        if (detectedLocale && locales.indexOf(detectedLocale) < -1) {
            // not one of the locales we need to check
            return issues;
        }

        names = ruleset.getRules(this.type);
        if (names && names.length) {
            names.forEach(name => {
                const rule = ruleset.getRule(name, {
                    ...this.project.getOptions(),
                    ...this.project.getSettings()
                });
                switch (this.type) {
                case "line":
                    for (let i = 0; i < this.lines.length; i++) {
                        const result = rule.match({
                            line: this.lines[i],
                            locale: detectedLocale,
                            file: this.filePath
                        });
                        if (result) issues = issues.concat(result);
                    }
                    break;
                case "resource":
                    this.resources.forEach(resource => {
                        const result = rule.match({
                            locale: resource.getTargetLocale(),
                            resource,
                            file: this.filePath
                        });
                        if (result) issues = issues.concat(result);
                    });
                    break;
                }
            });
        }

        return issues;
    }
};

export default SourceFile;
