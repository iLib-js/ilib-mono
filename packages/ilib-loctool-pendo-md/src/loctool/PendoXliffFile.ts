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

import type { File, ResourceString, TranslationSet } from "loctool";
import fs from "node:fs";
import { backconvert, convert } from "../markdown/convert";
import type { ComponentList } from "../markdown/ast-transformer/component";
import { xml2js, js2xml, type Element } from "ilib-xml-js";

/**
 * Properties of a single translation unit extracted from the XLIFF file which
 * are needed for further processing in loctool.
 */
export type TranslationUnit = { key: string; sourceLocale: string; source: string; target?: string; comment?: string };

type XliffElement = Element & { name: typeof XLIFF.ELEMENT.XLIFF };
type FileElement = Element & {
    name: typeof XLIFF.ELEMENT.FILE;
    attributes: { datatype: typeof XLIFF.VALUE.PENDOGUIDE };
};
type TransUnitElement = Element & { name: typeof XLIFF.ELEMENT.TRANS_UNIT };

const XLIFF = {
    ELEMENT: {
        XLIFF: "xliff",
        FILE: "file",
        BODY: "body",
        GROUP: "group",
        TRANS_UNIT: "trans-unit",
        SOURCE: "source",
        TARGET: "target",
        NOTE: "note",
    },
    ATTRIBUTE: {
        ID: "id",
        RESNAME: "resname",
        DATATYPE: "datatype",
        RESTYPE: "restype",
        SOURCE_LOCALE: "source-language",
        TARGET_LOCALE: "target-language",
        STATE: "state",
        VERSION: "version",
    },
    VALUE: {
        TRANSLATED: "translated",
        PENDOGUIDE: "pendoguide",
    },
} as const;

export class PendoXliffFile implements File {
    // @TODO logger

    /**
     * Path to the file being localized (i.e. source file).
     */
    private readonly sourceFilePath: string;

    /**
     * Parsed XLIFF file.
     *
     * Used during extraction to obtain translation units,
     * and later during localization to create a localized copy of it.
     */
    private xliffDocument?: Element;

    /**
     * Modified translation units.
     *
     * This is a result of extracting translation units from the XLIFF file
     * and escaping their markdown syntax.
     *
     * Translation Units have modified source strings (escaped markdown syntax) and
     * modified comments (appended component descriptions).
     *
     * Such escaped TUs are output to loctool for translation after extraction.
     */
    private escapedUnits?: TranslationUnit[];

    /**
     * Data about markdown syntax escaped in corresponding source strings.
     *
     * This is used to backconvert localized strings to their original markdown syntax.
     *
     * Null values indicate that no components were found in the source string
     * and there is no need for backconversion.
     */
    private componentLists?: { [unitKey: string]: ComponentList | null };

    constructor(
        sourceFilePath: string,
        getLocalizedPath: typeof this.getLocalizedPath,
        getOuputLocale: typeof this.getOuputLocale,
        createTranslationSet: typeof this.createTranslationSet,
    ) {
        this.sourceFilePath = sourceFilePath;
        this.getLocalizedPath = getLocalizedPath;
        this.getOuputLocale = getOuputLocale;
        this.createTranslationSet = createTranslationSet;
    }

    private static loadXliffDocument(path: string) {
        const content = fs.readFileSync(path, "utf-8");

        // parse XML
        const document = xml2js(content, { compact: false }) as Element;

        // ensure it's a version 1.2 XLIFF
        const root = PendoXliffFile.getXliffRoot(document);
        if (root.attributes?.[XLIFF.ATTRIBUTE.VERSION] !== "1.2") {
            throw new Error("Only XLIFF version 1.2 is supported");
        }

        return document;
    }

    private static getXliffRoot(xliffDocument: Element): XliffElement {
        const [xliff] = xliffDocument.elements ?? [];
        if (!xliff || xliff.name !== "xliff") {
            throw new Error("Invalid XLIFF document structure");
        }
        return xliff as XliffElement;
    }

    /**
     * Find <file datatype="pendoguide"> elements within the supplied XLIFF root <xliff>.
     *
     * @param xliff reference to the root <xliff> element from the XLIFF document tree
     * @returns array of {@link Element} objects which are references to inside of the XML tree.
     * These elements can be mutated to change the contents of an existing XLIFF file structure.
     */
    private static findFileElements(xliff: XliffElement): FileElement[] {
        // <file datatype="pendoguide">
        return (xliff.elements?.filter(
            (el) =>
                el.name === XLIFF.ELEMENT.FILE && el.attributes?.[XLIFF.ATTRIBUTE.DATATYPE] === XLIFF.VALUE.PENDOGUIDE,
        ) ?? []) as FileElement[];
    }

    /**
     * Find <trans-unit> elements within the supplied XLIFF <file> element.
     *
     * @param fileElement reference to <file> element from the XLIFF document tree
     *
     * @returns array of {@link Element} objects which are references to inside of the XML tree.
     * These elements can be mutated to change the contents of an existing XLIFF file structure.
     */
    private static findTransUnitElements(file: FileElement): TransUnitElement[] {
        // <body>
        const [body] = file.elements?.filter((el) => el.name === XLIFF.ELEMENT.BODY) ?? [];
        if (!body) {
            // @TODO warn about missing body element
            return [];
        }

        // <group>
        // process all groups in the body
        const groups = body.elements?.filter((el) => el.name === XLIFF.ELEMENT.GROUP);

        // <trans-unit> (aggregate from all groups and direct in body)
        const units =
            [...(groups?.flatMap((group) => group.elements ?? []) ?? []), ...(body.elements ?? [])].filter(
                (el) => el.name === XLIFF.ELEMENT.TRANS_UNIT,
            ) ?? [];

        return units as TransUnitElement[];
    }

    private static extractUnits(xliff: XliffElement): TranslationUnit[] {
        const translationUnits: TranslationUnit[] = [];

        for (const file of PendoXliffFile.findFileElements(xliff)) {
            const sourceLocale = file.attributes?.[XLIFF.ATTRIBUTE.SOURCE_LOCALE];
            // source locale is required to identify translation units
            if (!sourceLocale || typeof sourceLocale !== "string") {
                // @TODO warn about missing source locale
                continue;
            }

            for (const unitElement of PendoXliffFile.findTransUnitElements(file)) {
                try {
                    const { key, source, comment } = PendoXliffFile.extractUnitData(unitElement);

                    // create a translation unit object
                    translationUnits.push({
                        key,
                        sourceLocale,
                        source,
                        comment: comment ? `${comment}` : undefined,
                    });
                } catch (_) {
                    // @TODO warn about unit extraction error
                }
            }
        }

        return translationUnits;
    }

    private static extractUnitData(unitElement: TransUnitElement): Omit<TranslationUnit, "sourceLocale"> {
        // extract translation unit data

        // in Pendo XLIFF files, the ID attribute is used as a key for translation units (rather than resname);
        // a key is required for loctool to identify translation units and it must be a string (not an index)
        const key = unitElement.attributes?.[XLIFF.ATTRIBUTE.ID];
        if (!key || typeof key !== "string") {
            throw new Error("Missing or invalid key attribute");
        }

        const sourceElement = unitElement.elements?.find((el) => el.name === XLIFF.ELEMENT.SOURCE);
        // support plaintext and CDATA content
        const source = sourceElement?.elements
            ?.map((el) => {
                if (el.type === "text") {
                    return el.text;
                } else if (el.type === "cdata") {
                    return el.cdata;
                } else {
                    return "";
                }
            })
            .join("");
        // non-empty source string is required for unit to be meaningful
        if (!source) {
            throw new Error("Missing or empty source string");
        }

        // extract optional comment from the unit
        const comment = unitElement.elements
            ?.find((el) => el.name === XLIFF.ELEMENT.NOTE)
            ?.elements?.find((el) => el.type === "text")?.text as string | undefined;

        return { key, source, comment };
    }

    /**
     * Escape markdown syntax in source strings of the supplied TUs
     * and insert escaped component descriptions into their comments.
     */
    private static toEscapedUnits(translationUnits: TranslationUnit[]) {
        return translationUnits.map((unit) => {
            // escape the source string and extract component list
            const [escapedSource, componentList] = convert(unit.source);

            if (componentList.length === 0) {
                // no components found, no need to modify the unit
                return [unit, null] as const;
            }

            // append description of all components to the unit comment
            // in the format: [c0: ComponentType, c1: ComponentType, ...]
            const componentComments = componentList
                .map((component, idx) => {
                    return `c${idx}: ${component.type}`;
                })
                .join(", ");
            const commentWithComponents = [unit.comment, `[${componentComments}]`].join(" ");

            // create a copy of the translation unit with changed source and comment
            const copy = { ...unit };
            copy.source = escapedSource;
            copy.comment = commentWithComponents;
            return [copy, componentList] as const;
        });
    }

    extract(): void {
        this.xliffDocument = PendoXliffFile.loadXliffDocument(this.sourceFilePath);
        const xliff = PendoXliffFile.getXliffRoot(this.xliffDocument);
        const translationUnits = PendoXliffFile.extractUnits(xliff);

        // in case of duplicate keys, keep only the first unit
        const uniqueKeys = new Set<string>();
        const uniqueUnits = translationUnits.filter((unit) => {
            if (uniqueKeys.has(unit.key)) {
                // @TODO warn about duplicate key
                return false;
            }
            uniqueKeys.add(unit.key);
            return true;
        });

        // units passed for further processing in loctool (e.g. creation of an output xliff file)
        // should have markdown syntax escaped
        const escapedUnits = PendoXliffFile.toEscapedUnits(uniqueUnits);

        // save the escaped units for extraction
        // and component lists for backconversion
        this.escapedUnits = escapedUnits.map(([unit]) => unit);
        this.componentLists = Object.fromEntries(
            escapedUnits.map(([unit, componentList]) => [unit.key, componentList]),
        );
    }

    /**
     * Wraps translation units in loctool's ResourceString objects.
     *
     * This should be injected by the file type class which has access to loctool's API.
     */
    private readonly createTranslationSet: (units: TranslationUnit[]) => TranslationSet<ResourceString>;

    /**
     * Output source strings from the original Pendo XLIFF file as loctool resources
     * with escaped markdown syntax.
     */
    getTranslationSet(): TranslationSet {
        if (!this.escapedUnits) {
            throw new Error("Invalid operation: attempt to get translation set without extracting first.");
        }

        // note: conversion to loctool resources is done in injected createTranslationSet method
        // this is because loctool does not really care about translations per file,
        // since eventually it aggregates everything through FileType.getExtracted method
        // - injection allows for decoupling the file processing logic from the loctool API
        return this.createTranslationSet(this.escapedUnits);
    }

    /**
     * Given a source path and a locale, returns a path where the localized file should be written.
     *
     * This method should be injected by file type class and it should account for
     * - path template mapping (automatically identify path components like locale)
     * - locale mapping (if needed)
     */
    readonly getLocalizedPath: (loctoolLocale: string) => string;

    /**
     * Given a target locale (as provided by loctool), return the locale that should be used
     * in the output file.
     */
    private readonly getOuputLocale: (loctoolLocale: string) => string;

    /**
     * Create a deep copy of the supplied XLIFF object.
     */
    private static copyXliff(xliffDocument: Element): Element {
        return xml2js(js2xml(xliffDocument, { compact: false }), { compact: false }) as Element;
    }

    /**
     * Given a set of translations provided by loctool, for each locale
     * write out a localized Pendo XLIFF file which is a copy of the source Pendo XLIFF but
     * with applicable translated strings inserted.
     */
    localize(translations: TranslationSet, loctoolLocales: string[]): void {
        if (!this.xliffDocument || !this.escapedUnits || !this.componentLists) {
            throw new Error("Invalid operation: attempt to localize without extracting first.");
        }

        for (const loctoolLocale of loctoolLocales) {
            const translationsForLocale = translations
                .getAll()
                .filter(
                    (resource) => resource.getType() === "string" && resource.getTargetLocale() === loctoolLocale,
                ) as ResourceString[];

            // make a deep copy of the source xliff - don't mutate the file that's already loaded
            const localizedXliffDocument = PendoXliffFile.copyXliff(this.xliffDocument);
            const xliff = PendoXliffFile.getXliffRoot(localizedXliffDocument);

            // apply the locale mapping so that the file has expected target locale set
            const outputLocale = this.getOuputLocale(loctoolLocale);

            // set target locale in all output files
            // note: this is a mapped locale which can be different from the locale provided by loctool
            const files = PendoXliffFile.findFileElements(xliff);
            for (const file of files) {
                file.attributes[XLIFF.ATTRIBUTE.TARGET_LOCALE] = outputLocale;
            }

            // mutate the translation units in the copy
            const copyUnits = files.flatMap((file) => PendoXliffFile.findTransUnitElements(file));
            for (const unitElement of copyUnits) {
                try {
                    // extract translation unit data for easier access
                    const unitData = PendoXliffFile.extractUnitData(unitElement);

                    // get translated string by matching TU ID
                    const translation = translationsForLocale.find((resource) => resource.getKey() === unitData.key);
                    if (!translation) {
                        throw new Error("Missing translation for unit");
                    }
                    let target = translation.getTarget();

                    // make sure that this unit has been processed and there is some data about components for it
                    if (!(unitData.key in this.componentLists)) {
                        throw new Error("Missing extracted component data for given unit");
                    }

                    // get extracted component list based on TU key
                    const referenceComponentList = this.componentLists[unitData.key];
                    if (null !== referenceComponentList) {
                        // use the matching component source string as reference to reinsert the original markdown syntax
                        // into the localized string
                        target = backconvert(target, referenceComponentList);
                    }

                    // update the target string in the xliff element
                    let targetElement = unitElement.elements?.find((el) => el.name === XLIFF.ELEMENT.TARGET);
                    if (!targetElement) {
                        // if necessary, create the target element
                        targetElement = { type: "element", name: XLIFF.ELEMENT.TARGET, elements: [] };
                        if (!unitElement.elements) {
                            unitElement.elements = [];
                        }
                        unitElement.elements.push(targetElement);
                    }
                    targetElement.elements = [{ type: "text", text: target }];

                    // set target state attribute to "translated"
                    targetElement.attributes = {
                        ...(targetElement.attributes ?? {}),
                        [XLIFF.ATTRIBUTE.STATE]: XLIFF.VALUE.TRANSLATED,
                    };
                } catch (_) {
                    // @TODO log backconversion error
                }
            }

            // write out the localized xliff file
            const localizedFilePath = this.getLocalizedPath(loctoolLocale);
            fs.writeFileSync(localizedFilePath, js2xml(localizedXliffDocument, { compact: false, spaces: 4 }), {
                encoding: "utf-8",
            });
        }
    }

    write(): void {
        // no-op, as the localized files are written in the localize method
    }
}

export default PendoXliffFile;
