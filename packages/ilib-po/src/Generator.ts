/*
 * Generator.ts - generate a PO file from a set of resources
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

import { TranslationSet } from "ilib-tools-common";
// @ts-expect-error -- untyped package
import Locale from "ilib-locale";

import { Comments, CommentType, escapeQuotes, makeKey } from "./utils";
import { pluralForms, PluralForm } from "./pluralforms";

/** Options for the generator constructor */
export interface GeneratorOptions {
    /** the path to the po file */
    pathName: string;

    /**
     * the target locale of the file
     *
     * @default "en"
     */
    targetLocale?: string;

    /**
     * whether the context should be included as part of the key or not
     *
     * @default false
     */
    contextInKey?: boolean;

    /**
     * The default data type of the resources
     */
     datatype?: string;

    /**
     * The name of the project that the resources belong to
     */
    projectName?: string;
}

/**
 * Generate a PO file from a set of resources.
 */
class Generator {
    /** the path to the po file */
    private pathName: string;
    /** the target locale of the file */
    private targetLocale: Locale;
    /** whether the context should be included as part of the key or not */
    private contextInKey: boolean;
    /** the default data type of the resources */
    private datatype: string | undefined;
    /** the name of the project that the resources belong to */
    private projectName: string;

    private plurals: PluralForm;

    /**
     * Create a new PO file generator
     */
    constructor(options: GeneratorOptions) {
        if (!options) throw new Error("Generator: Missing required options in Generator constructor");

        const optionsWithDefaults = {
            targetLocale: "en",
            contextInKey: false,
            ...options,
        };

        this.pathName = options.pathName;
        this.targetLocale = new Locale(optionsWithDefaults.targetLocale);
        this.contextInKey = optionsWithDefaults.contextInKey;
        this.datatype = optionsWithDefaults.datatype;
        this.projectName = optionsWithDefaults.projectName ?? "default";

        this.plurals = pluralForms[this.targetLocale.getLanguage() ?? "en"] || pluralForms.en;
    }

    /**
     * Generate the PO file again from the resources. Each resource in the set
     * should have the same target locale. If a resource has a target locale
     * that is different from the target locale of this PO file, it will be
     * ignored.
     *
     * @param set the set of resources to generate the PO file from
     * @returns the generated PO file as a string
     */
    generate(set: TranslationSet): string {
        let output =
            'msgid ""\n' +
            'msgstr ""\n' +
            `"#-#-#-#-#  ${this.pathName}  #-#-#-#-#\\n"\n` +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            `"Language: ${this.targetLocale.getSpec()}\\n"\n` +
            `"Plural-Forms: ${this.plurals.rules}\\n"\n`;
        if (this.datatype) {
            output += `"Data-Type: ${this.datatype}\\n"\n`;
        }
        if (this.projectName) {
            output += `"Project: ${this.projectName}\\n"\n`;
        }
        const resources = set.getAll();

        for (let i = 0; i < resources.length; i++) {
            const r = resources[i];
            const type = r.getType();
            const key: string = r.getKey() ?? makeKey(type, r.getSource(), this.contextInKey && r.getContext());
            output += "\n";
            const comment = r.getComment();
            let c: Comments = {};
            if (comment) {
                c = comment[0] === "{" ? JSON.parse(comment) : {
                    [CommentType.EXTRACTED]: [comment],
                };
            }

            if (c[CommentType.TRANSLATOR]?.length) {
                c[CommentType.TRANSLATOR].forEach(str => {
                    output += `# ${str}\n`;
                });
            }
            if (c[CommentType.EXTRACTED]?.length) {
                c[CommentType.EXTRACTED].forEach(str => {
                    output += `#. ${str}\n`;
                });
            }
            if (c[CommentType.PATHS]?.length) {
                c[CommentType.PATHS].forEach(str => {
                    output += `#: ${str}\n`;
                });
            } else if (r.getPath()) {
                output += `#: ${r.getPath()}\n`;
            }
            if (c[CommentType.FLAGS]?.length) {
                c[CommentType.FLAGS].forEach(str => {
                    output += `#, ${str}\n`;
                });
            }
            if (c[CommentType.PREVIOUS]?.length) {
                c[CommentType.PREVIOUS].forEach(str => {
                    output += `#| ${str}\n`;
                });
            }
            if (r.getDataType() && this.datatype !== r.getDataType()) {
                output += `#d ${r.getDataType()}\n`;
            }
            if (r.getProject() && this.projectName !== r.getProject()) {
                output += `#p ${r.getProject()}\n`;
            }
            if (type === "string" && r.getSource() !== key) {
                output += `#k ${escapeQuotes(r.getKey())}\n`;
            } else if (type === "plural") {
                const generatedKey = makeKey("plural", r.getSource(), this.contextInKey && r.getContext());
                if (key !== generatedKey) {
                    output += `#k ${escapeQuotes(r.getKey())}\n`;
                }
            }
            if (r.getContext()) {
                output += `msgctxt "${escapeQuotes(r.getContext())}"\n`;
            }
            if (type === "string") {
                output += `msgid "${escapeQuotes(r.getSource())}"\n`;
                let translatedText = r.getTarget() ?? "";

                if (translatedText === r.getSource()) {
                    // put nothing if there is no difference in the translation
                    translatedText = "";
                }

                output += `msgstr "${escapeQuotes(translatedText)}"\n`;
            } else if (type === "array") {
                const sourceArray = r.getSource();
                let translatedArray = r.getTarget() || [];

                sourceArray.forEach((source: string, index: number) => {
                    if (index > 0) {
                        output += "\n";
                    }
                    const translation = translatedArray[index] !== source ? translatedArray[index] : "";
                    output += `#k ${escapeQuotes(r.getKey())}\n`;
                    output += `## ${index}\n`;
                    output += `msgid "${escapeQuotes(source)}"\n`;
                    output += `msgstr "${escapeQuotes(translation)}"\n`;
                });
            } else {
                // plural string
                const sourcePlurals = r.getSource();
                output += `msgid "${escapeQuotes(sourcePlurals.one)}"\n`;
                let translatedPlurals = r.getTarget() || {};

                output += `msgid_plural "${escapeQuotes(sourcePlurals.other)}"\n`;
                if (translatedPlurals) {
                    this.plurals.categories.forEach((category, index) => {
                        const translation =
                            translatedPlurals[category] !== sourcePlurals[category] ? translatedPlurals[category] : "";
                        output += `msgstr[${index}] "${escapeQuotes(translation)}"\n`;
                    });
                }
            }
        }
        return output;
    }
}

export default Generator;
