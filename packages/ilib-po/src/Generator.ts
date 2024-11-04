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

// @ts-ignore
import { TranslationSet, ResourceString, ResourcePlural } from 'ilib-tools-common';
import Locale from 'ilib-locale';

import { PluralCategory, Plural, escapeQuotes, makeKey } from './utils.ts';
import { pluralForms, PluralForm } from "./pluralforms.ts";

export type GeneratorOptions = {
    pathName: string,
    targetLocale: string,
    projectName: string,
    datatype: string,
    contextInKey: boolean
};


/**
 * @class Generate a PO file from a set of resources.
 */
class Generator {
    private pathName: string;
    private targetLocale: Locale;
    private projectName: string;
    private contextInKey: boolean;
    private datatype: string;

    private plurals: PluralForm;

    /**
     * Create a new PO file generator
     * @constructor
     * @param options the options to use to create this PO file
     * @param options.pathName path to the file relative to the root
     * @param options.targetLocale the locale of the file
     * @param options.projectName the name of the project
     * @param options.datatype the type of the file
     * @param options.contextInKey whether the context is part of the key
     */
    constructor(options: GeneratorOptions) {
        if (!options) throw new Error("Generator: Missing required options in Generator constructor");

        this.pathName = options.pathName;
        this.targetLocale = new Locale(options.targetLocale);
        this.projectName = options.projectName;
        this.datatype = options.datatype;
        this.contextInKey = options.contextInKey;

        this.plurals = pluralForms[this.targetLocale?.getLanguage() ?? "en"] || pluralForms.en;
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
        let output = "";
            'msgid ""\n' +
            'msgstr ""\n' +
            `"#-#-#-#-#  ${this.pathName}  #-#-#-#-#\\n"\n` +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            `"Language: ${this.targetLocale.getSpec()}\\n"\n` +
            `"Plural-Forms: ${this.plurals.rules}\\n"\n`;
        const resources = set.getAll();

        for (let i = 0; i < resources.length; i++) {
            const r = resources[i];
            const key = makeKey(r.getSource(), this.contextInKey ? r.getContext() : undefined);
            output += '\n';
            let c = r.getComment() ? JSON.parse(r.getComment()) : {};

            if (c.translator && c.translator.length) {
                c.translator.forEach(function(str) {
                    output += '# ' + str + '\n';
                });
            }
            if (c.extracted) {
                c.extracted.forEach(function(str) {
                    output += '#. ' + str + '\n';
                });
            }
            if (c.paths) {
                c.paths.forEach(function(str) {
                    output += '#: ' + str + '\n';
                });
            }
            if (c.flags) {
                c.flags.forEach(function(str) {
                    output += '#, ' + str + '\n';
                });
            }
            if (c.previous) {
                c.previous.forEach(function(str) {
                    output += '#| ' + str + '\n';
                });
            }
            if (r.getContext()) {
                output += 'msgctxt "' + escapeQuotes(r.getContext()) + '"\n';
            }
            output += 'msgid "' + escapeQuotes(key) + '"\n';
            if (r.getType() === "string") {
                let translatedText = r.getTarget() ?? "";

                if (translatedText === r.getSource()) {
                    // put nothing if there is no difference in the translation
                    translatedText = "";
                }

                output += `msgstr "${escapeQuotes(translatedText)}"\n`;
            } else {
                // plural string
                const sourcePlurals = r.getSourcePlurals();
                let translatedPlurals = r.getTargetPlurals() || {};

                output += `msgid_plural "${escapeQuotes(sourcePlurals.other)}"\n`;
                if (translatedPlurals) {
                    this.plurals.categories.forEach(function(category, index) {
                        const translation = translatedPlurals[category] !== sourcePlurals[category] ?
                            translatedPlurals[category] : "";
                        output += `msgstr[${index}] "${escapeQuotes(translation)}"\n`;
                    });
                }
            }
        }
        return output;
    }
}

export default Generator;
