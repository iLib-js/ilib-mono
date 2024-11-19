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

import path from "path";

// @ts-expect-error -- untyped package
import { TranslationSet } from "ilib-tools-common";
// @ts-expect-error -- untyped package
import Locale from "ilib-locale";

import Parser from "./Parser";
import Generator from "./Generator";

/** Options for the POFile constructor */
export interface POFileOptions {
    /** the path to the po file */
    pathName: string;

    /**
     * the name of the project that this po file is a part of
     *
     * By default, this will be set to the base name of {@link pathName} without the `.po` extension
     */
    projectName?: string;

    /**
     * the source locale of the file
     *
     * @default "en-US"
     */
    sourceLocale?: string;

    /**
     * the target locale of the file
     *
     * @default undefined
     */
    targetLocale?: string;

    /**
     * the type of the data in the po file
     *
     * This might be something like "python" or "javascript" to
     * indicate the type of the code that the strings are used in.
     *
     * @default "po"
     */
    datatype?: string;

    /**
     * whether the context should be included as part of the key or not
     *
     * @default false
     */
    contextInKey?: boolean;
}

/**
 * Represents a GNU PO resource file.
 */
class POFile {
    /** the path to the po file */
    private pathName: string;
    /** the source locale of the file */
    private sourceLocale: Locale;
    /** the target locale of the file */
    private targetLocale?: Locale;
    /** the name of the project that this po file is a part of */
    private projectName: string;
    /** whether the context should be included as part of the key or not */
    private contextInKey: boolean;
    /**
     * the type of the data in the po file
     *
     * This might be something like "python" or "javascript" to
     * indicate the type of the code that the strings are used in.
     */
    private datatype?: string;

    private parser: Parser;
    private generator: Generator;

    /**
     * Create a new PO file with the given path name.
     */
    constructor(options: POFileOptions) {
        if (!options) throw new Error("Missing required options in POFile constructor");

        const optionsWithDefaults = {
            sourceLocale: "en-US",
            targetLocale: undefined,
            datatype: "po",
            contextInKey: false,
            ...options,
        };

        this.pathName = options.pathName;

        this.sourceLocale = new Locale(optionsWithDefaults.sourceLocale);
        this.targetLocale = optionsWithDefaults.targetLocale ? new Locale(optionsWithDefaults.targetLocale) : undefined;
        this.projectName = optionsWithDefaults.projectName ?? path.basename(this.pathName, ".po");
        this.datatype = optionsWithDefaults.datatype;
        this.contextInKey = optionsWithDefaults.contextInKey;

        this.parser = new Parser({
            pathName: this.pathName,
            sourceLocale: this.sourceLocale,
            targetLocale: this.targetLocale,
            projectName: this.projectName,
            datatype: this.datatype,
            contextInKey: this.contextInKey,
        });

        this.generator = new Generator({
            pathName: this.pathName,
            targetLocale: this.targetLocale,
            contextInKey: this.contextInKey,
        });
    }

    /**
     * Parse the data string looking for the localizable strings and add them to the
     * project's translation set. This function uses a finite state machine to
     * handle the parsing.
     *
     * @param data the string to parse
     * @throws {SyntaxError} when there is a syntax error in the file
     * @returns the set of resources extracted from the file
     */
    parse(data: string): TranslationSet {
        return this.parser.parse(data);
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
    getDatatype(): string | undefined {
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
     * Generate the PO file again from the resources. Each resource in the set
     * should have the same target locale. If a resource has a target locale
     * that is different from the target locale of this PO file, it will be
     * ignored.
     *
     * @param set the set of resources to generate the PO file from
     * @returns the generated PO file
     */
    generate(set: TranslationSet): string {
        return this.generator.generate(set);
    }
}

export default POFile;
