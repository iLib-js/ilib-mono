/*
 * POFile.ts - parse and generate PO files
 *
 * Copyright © 2024 Box, Inc.
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

import fs from 'node:fs';
import path from 'node:path';

// @ts-ignore
import { TranslationSet, ResourceString, ResourcePlural } from 'ilib-tools-common';
import Locale from 'ilib-locale';

import SyntaxError from './SyntaxError.ts';
import Parser from './Parser.ts';
import Generator from './Generator.ts';

import type { Token, TokenType } from './Tokenizer.ts';

export type POFileOptions = {
    pathName: string,
    sourceLocale?: string,
    targetLocale?: string,
    projectName?: string,
    datatype?: string,
    contextInKey?: boolean
};

/** @private */
type CommentType = "translator" | "extracted" | "flags" | "previous" | "paths";

type Comments = {
    [key in CommentType]?: string[]
};

type PluralCategory = "zero" | "one" | "two" | "few" | "many" | "other";

type Plural = {
    other: string,
    zero?: string,
    one?: string,
    two?: string,
    few?: string,
    many?: string
};

const commentTypeMap = {
    ' ': "translator",
    '.': "extracted",
    ',': "flags",
    '|': "previous",
    ':': "paths"
};

const rePathStrip = /^: *(([^: ]|:[^\d])+)(:\d+)?/;

/**
 * Escape quotes in a string.
 * @private
 * @param str the string to escape
 * @returns the escaped string
 */
function escapeQuotes(str: string): string {
    if (!str) return "";
    return str ? str.replace(/"/g, '\\"') : str;
}

/**
 * Unescape quotes in a string.
 * @private
 * @param str the string to unescape
 * @returns the unescaped string
 */
function unescapeQuotes(str: string): string {
    if (!str) return "";
    return str ? str.replace(/\\"/g, '"') : str;
}


/**
 * @class POFile
 * Represents a GNU PO resource file.
 */
class POFile {
    private pathName: string;
    private data?: string;
    private index: number = 0;
    private sourceLocale: Locale;
    private targetLocale?: Locale;
    private resourceIndex: number = 0;
    private projectName: string;
    private contextInKey: boolean;

    private commentsToIgnore: Set<string> = new Set();
    private datatype?: string;

    /**
     * Create a new PO file with the given path name.
     * @constructor
     * @param options the options to use to create this PO file
     * @param options.pathName path to the file relative to the root
     * @param [options.sourceLocale] the locale of the file
     * @param [options.targetLocale] the locale of the file
     * @param [options.projectName] the name of the project
     * @param [options.datatype] the type of the file
     * @param [options.contextInKey] whether the context is part of the key
     */
    constructor(options: POFileOptions) {
        if (!options) throw new SyntaxError("POFile", "Missing required options in POFile constructor (pathName)");

        this.pathName = options.pathName;

        this.sourceLocale = new Locale(options?.sourceLocale ?? "en-US");
        this.targetLocale = options?.targetLocale ? new Locale(options.targetLocale) : undefined;
        this.projectName = options?.projectName ?? path.basename(this.pathName, ".po");
        this.datatype = options?.datatype ?? "po";
        this.contextInKey = options?.contextInKey ?? false;
    }

    /**
     * Parse the data string looking for the localizable strings and add them to the
     * project's translation set. This function uses a finite state machine to
     * handle the parsing.
     *
     * @param data the string to parse
     * @throws SyntaxError if there is a syntax error in the file
     * @returns the set of resources extracted from the file
     */
    parse(data: string): TranslationSet {
        const parser = new Parser({
            pathName: this.pathName,
            sourceLocale: this.sourceLocale,
            targetLocale: this.targetLocale,
            projectName: this.projectName,
            datatype: this.datatype,
            contextInKey: this.contextInKey,
        });

        return parser.parse(data);
    }

    /**
     * Get the path name of this PO file.
     * @returns the path name of this PO file
     */
    getPathName(): string {
        return this.pathName;
    }

    /**
     * Get the source locale of this PO file.
     * @returns the source locale of this PO file
     */
    getSourceLocale(): string {
        return this.sourceLocale.getSpec();
    }

    /**
     * Get the target locale of this PO file.
     * @returns the target locale of this PO file
     */
    getTargetLocale(): string | undefined {
        return this.targetLocale?.getSpec();
    }

    /**
     * Get the project name of this PO file.
     * @returns the project name of this PO file
     */
    getProjectName(): string {
        return this.projectName;
    }

    /**
     * Get the datatype of this PO file.
     * @returns the datatype of this PO file
     */
    getDatatype(): string {
        return this.datatype;
    }

    /**
     * Get whether the context is part of the key in this PO file.
     * @returns whether the context is part of the key in this PO file
     */
    getContextInKey(): boolean {
        return this.contextInKey;
    }

    /**
     * Read the PO file from disk and extract all the resources from it.
     */
    read() {
    }

    /**
     * Generate the PO file again from the resources. Each resource in the set
     * should have the same target locale. If a resource has a target locale
     * that is different from the target locale of this PO file, it will be
     * ignored.
     *
     * @param set the set of resources to generate the PO file from
     * @returns the generated PO file
     */
    generate(set: TranslationSet): string {
        const generator = new Generator({
            pathName: this.pathName,
            targetLocale: this.targetLocale,
            projectName: this.projectName,
            datatype: this.datatype,
            contextInKey: this.contextInKey
        });

        return generator.generate(set);
    }

    /**
     * Write the resource file out to disk again.
     * @param set the set of resources to write
     */
    write(set: TranslationSet) {
        fs.writeFileSync(this.pathName, this.generate(set), "utf-8");
    }
}

export default POFile;
