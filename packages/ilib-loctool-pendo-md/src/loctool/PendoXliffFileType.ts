/**
 * Copyright © 2024, Box, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licensefs/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { FileType, Project, API, TranslationSet, ResourceString } from "loctool";
import path from "node:path";
import PendoXliffFile, { type TranslationUnit } from "./PendoXliffFile";
import micromatch from "micromatch";

/**
 * XLIFF file exported from Pendo for translation.
 *
 * This loctool plugin transforms the XLIFF file exported from Pendo
 * into another XLIFF file in which markdown syntax of the source string
 * is escaped using components (`<c0>`). This helps translators avoid
 * breaking the formatting during translation.
 *
 * In addition to escaping the markdown syntax, description of
 * the inserted components is also appended to the Resource comment field
 * of the resulting XLIFF file - this helps translators understand the
 * original formatting of the source string.
 *
 * Backconversion of strings received from translation (with escaped syntax)
 * is done by re-parsing source strings and using the obtained component
 * data as reference.
 */
export class PendoXliffFileType implements FileType {
    constructor(project: Project, loctoolAPI: API) {
        this.project = project;
        this.loctoolAPI = loctoolAPI;
    }

    /**
     * Reference to the loctool {@link Project} instance which uses this file type.
     */
    private readonly project: Project;

    /**
     * Additional functionality provided by loctool to the plugin.
     */
    private readonly loctoolAPI: API;

    private static readonly extensions = [".xliff", ".xlf"];
    getExtensions(): string[] {
        return PendoXliffFileType.extensions;
    }

    /** human-readable file type name */
    private static readonly name = "Pendo XLIFF";
    name(): string {
        return PendoXliffFileType.name;
    }

    /**
     * [XLIFF datatype](https://docs.oasis-open.org/xliff/v1.2/os/xliff-core.html#datatype)
     * identifier for Pendo markdown strings.
     *
     * XLIFFs exported from pendo use <file datatype="pendoguide">,
     * so resources produced by this plugin are custom escaped versions of that datatype.
     */
    public static readonly datatype = "x-pendoguide-escaped";
    getDataType(): string {
        // strings in XLIFFs exported from Pendo are markdown with custom extensions
        return PendoXliffFileType.datatype;
    }

    getDataTypes(): Record<string, string> | undefined {
        // use defaults
        return undefined;
    }

    get sourceLocale() {
        // Per convention (e.g. https://github.com/iLib-js/loctool/blob/285401359f923c1be11e7329b549ed11b4099637/lib/MarkdownFileType.js#L70)
        // it seems that source locale should always come from the project
        return this.project.getSourceLocale();
    }

    handles(pathInProject: string): boolean {
        // only pick files which match some path mapping
        const pathMapping = this.getMappingForPath(pathInProject);
        if (!pathMapping) {
            return false;
        }

        // per convention, only pick files which match project's source locale
        // (this is done to avoid processing files which are already localized)
        /* eslint-disable-next-line
         @typescript-eslint/no-unsafe-assignment,
         @typescript-eslint/no-unsafe-call,
         @typescript-eslint/no-explicit-any,
         @typescript-eslint/no-unsafe-member-access -- yet undocumented utility method,
         signature based on https://github.com/iLib-js/ilib-loctool-tap-i18n/blob/7585e97497e16475bfce1fc034caf0c7716229e1/YamlFileType.js#L122 */
        const fileLocale: string = (this.loctoolAPI.utils as any).getLocaleFromPath(
            pathMapping.template,
            pathInProject,
        );
        if (fileLocale !== this.sourceLocale) {
            return false;
        }

        return true;
    }

    write(): void {
        // no-op
        // per loctool convention, when localized files are written individually
        // there is no need to implement this method
        // (which is meant to write out aggregated resources - whatever that means);
        // this plugin intends to take a source XLIFF file on the input and from it
        // parse resources which have the source string transformed (markdown syntax escaped)
        // while on the output, it should produce one copy of the original XLIFF file
        // for each target locale (with the translated string backconverted from the escaped syntax
        // using the original non-escaped source string as a reference)
    }

    /**
     * Collection of instantiated {@link PendoXliffFile}s by this file type.
     *
     * See {@link getExtracted} on why this is needed.
     */
    private readonly files: Record<string, PendoXliffFile> = {};

    newFile(pathInProject: string): PendoXliffFile {
        if (this.files[pathInProject]) {
            throw new Error(`Attempt to create a file that already exists: ${pathInProject}`);
        }

        const actualPath = path.join(this.project.getRoot(), pathInProject);

        // inject localized path generator, translation set creation and locale mapping
        // into the file instance capturing parameters from the current context where needed
        //
        // (this is done to decouple file processing logic from plugin-related logic
        // (accessing loctool API, project, configuration etc.)

        // register the file instance
        this.files[pathInProject] = new PendoXliffFile(
            actualPath,
            (loctoolLocale) => path.join(this.project.getRoot(), this.getLocalizedPath(pathInProject, loctoolLocale)),
            (loctoolLocale) => this.getOuputLocale(loctoolLocale),
            (units) => this.createTranslationSet(units),
        );

        return this.files[pathInProject];
    }

    /**
     * Default path mappings for Pendo XLIFF files.
     */
    private static readonly defaultPathMappings: Record<string, { template: string }> = {
        "**/*.xl(if)?f": {
            template: "[dir]/[basename]_[locale].[extension]",
        },
    };

    /** Name of the project settings section specific for this plugin */
    private static readonly pluginConfigSectionId = "pendo";

    /**
     * Retrieves a specific section of the current plugin configuration from project config.
     */
    private getPluginConfig(section: string) {
        // config access based on https://github.com/iLib-js/ilib-loctool-tap-i18n/blob/7585e97497e16475bfce1fc034caf0c7716229e1/YamlFileType.js#L77-L84
        // @ts-expect-error -- undocumented
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- undocumented
        return this.project.settings?.[PendoXliffFileType.pluginConfigSectionId]?.[section] as unknown;
    }

    /**
     * Provides template mappings for paths (from project config and default ones).
     *
     * These can be used to parse locale from path and generate corresponding localized paths.
     *
     * Mappings can be specified in project.json like this
     * ```json
     * {
     *   "settings": {
     *     "pendo": {
     *       "mappings": {
     *        "**\/*.xliff": {
     *            "template": "[dir]/[basename]_[locale].[extension]"
     *         }
     *      }
     *   }
     * }
     */
    private getPathMappings() {
        const mappings: unknown = this.getPluginConfig("mappings");

        if (!mappings) {
            return PendoXliffFileType.defaultPathMappings;
        }

        // validate mappings
        if (!Object.keys(mappings).length) {
            throw new Error("Path mappings for Pendo XLIFF files must contain at least one entry");
        }

        for (const [pattern, mapping] of Object.entries(mappings) as [string, unknown][]) {
            // make sure that mapping is an object with a template string
            if (
                !(
                    mapping &&
                    typeof mapping === "object" &&
                    "template" in mapping &&
                    typeof mapping.template === "string" &&
                    mapping.template.length > 0
                )
            ) {
                throw new Error(`Path mapping for pattern ${pattern} is missing a template`);
            }
        }

        return mappings as Record<string, { template: string }>;
    }

    /**
     * Obtain path mapping template applicable to the provided path.
     */
    private getMappingForPath(pathInProject: string) {
        return Object.entries(this.getPathMappings()).find(([pattern]) =>
            // note: this should be offloaded to loctool eventually
            micromatch.isMatch(pathInProject, pattern),
        )?.[1];
    }

    /**
     * Given a source file path and a locale, returns a path where the localized file should be written
     * (accounting for locale mapping and path template mapping).
     */
    private getLocalizedPath(pathInProject: string, loctoolLocale: string) {
        // apply locale mapping for output path
        const outputLocale = this.getOuputLocale(loctoolLocale);

        const mapping = this.getMappingForPath(pathInProject);
        if (!mapping) {
            throw new Error(`No applicable path mapping found for path: ${pathInProject}`);
        }

        /* eslint-disable-next-line
         @typescript-eslint/no-unsafe-assignment,
         @typescript-eslint/no-unsafe-call,
         @typescript-eslint/no-explicit-any,
         @typescript-eslint/no-unsafe-member-access -- yet undocumented utility method,
         signature based on https://github.com/iLib-js/ilib-loctool-ghfm/blob/4db00063852758e801f1d0b2c7b7a98ead38bde1/MarkdownFile.js#L938-L941 */
        const localizedPath: string = (this.loctoolAPI.utils as any).formatPath(mapping.template, {
            sourcepath: pathInProject,
            locale: outputLocale,
        });

        return localizedPath;
    }

    /**
     * Given a target locale (as provided by loctool), return the locale that should be used in the output file.
     */
    private getOuputLocale(loctoolLocale: string): string {
        // config access based on https://github.com/iLib-js/ilib-loctool-tap-i18n/blob/7585e97497e16475bfce1fc034caf0c7716229e1/YamlFileType.js#L77-L84
        // except that localeMap is in root "settings" section rather than in the plugin-specific one
        // @ts-expect-error -- undocumented
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- undocumented
        const localeMap = this.project.settings?.localeMap as unknown;

        // if there is a locale mapping, use it
        if (
            localeMap &&
            typeof localeMap === "object" &&
            loctoolLocale in localeMap &&
            // @ts-expect-error -- undocumented
            typeof localeMap[loctoolLocale] === "string" &&
            // @ts-expect-error -- undocumented
            localeMap[loctoolLocale].length > 0
        ) {
            // @ts-expect-error -- undocumented
            return localeMap[loctoolLocale];
        }

        return loctoolLocale;
    }

    /**
     * Wraps translation units in loctool's ResourceString objects.
     */
    private createTranslationSet(units: TranslationUnit[]) {
        // convert to loctool resources
        const resources = units.map((unit) =>
            this.loctoolAPI.newResource({
                resType: "string",
                key: unit.key,
                sourceLocale: unit.sourceLocale,
                source: unit.source,
                comment: unit.comment,
                // not sure if this is used by loctool anywhere,
                // but it's required per the Resource interface definition
                project: this.project.getProjectId(),
            }),
        );

        // wrap in a translation set
        const translationSet = this.loctoolAPI.newTranslationSet<ResourceString>(this.project.getSourceLocale());
        translationSet.addAll(resources);

        return translationSet;
    }

    getExtracted(): TranslationSet {
        // this should ouput a translationset with merged resources from all files
        // which fit this filetype;
        // note: this means that the instance of the filetype class has to keep track of all files it
        // has processed (i.e. each {@link newFile} call should add the file to a list)

        const translationSet = this.loctoolAPI.newTranslationSet(this.sourceLocale);

        for (const path in this.files) {
            const file = this.files[path];
            translationSet.addSet(file.getTranslationSet());
        }

        return translationSet;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- noop, see comment in method
    addSet(set: TranslationSet): void {
        // no-op
        // it's not clear why would the filetype need to add a set of translations to itself
        // given that per the getExtracted method, sets should come from the files
    }

    getNew(): TranslationSet {
        // not sure how this differs from getExtracted
        return this.getExtracted();
    }

    getPseudo(): TranslationSet {
        return this.loctoolAPI.newTranslationSet(this.sourceLocale);
    }

    getResourceTypes() {
        // per https://github.com/iLib-js/loctool/blob/285401359f923c1be11e7329b549ed11b4099637/lib/Project.js#L235-L244:
        // even though not specified in the documeted plugin interface, loctool seems to expect
        // either getResourceTypes() or registerDataTypes() to be present;
        // getResourceTypes() is expected to return a mapping between `datatype` identifier and
        // a class name registered in the ResourceFactory while registerDataTypes();
        // based on existing implementations for built-in file types, it seems that
        // registerDataTypes() does a similar thing but using internal access to the ResourceFactory
        return {
            [this.getDataType()]: "ResourceString",
        } as const;
    }
}

export default PendoXliffFileType;
