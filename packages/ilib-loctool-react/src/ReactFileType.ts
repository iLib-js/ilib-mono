/*
 * Copyright © 2025 JEDLSoft
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


import { API, FileType, Project, TranslationSet } from "loctool";
import { ReactFile } from "./ReactFile";
import path from "path";

/**
 * Represents a file type that can be handled by the plugin.
 */
export class ReactFileType implements FileType {
    private readonly sourceLocale: string;
    private static readonly datatype = "x-react";
    private static readonly extensions = [".js", ".jsx", ".ts", ".tsx"];
    private ReactFileInstance: ReactFile | undefined;

    /**
     * A unique name for this type of plugin that can be displayed to a user.
     */
    private static readonly pluginName =
        "Loctool plugin for extracting localizable strings from React projects.";

    /**
     * private readonly project: A reference to the loctool {@link Project} instance which uses ReactFileType.
     *
     * private readonly loctool API: A reference to the loctool {@link API} instance which provides functionality to the `ilib-loctool-react` plugin.
     */
    constructor(
        private readonly project: Project,
        private readonly loctoolApi: API
    ) {
        this.sourceLocale = this.project.getSourceLocale();
    }

    /**
     * Returns true if the given path is handled by the ReactFileType or false otherwise.
     */
    handles(filePath: string): boolean {
        return ReactFileType.extensions.includes(path.extname(filePath));
    }

    /**
     * Returns an array of extensions ReactFileType can handle.
     */
    getExtensions(): string[] {
        return ReactFileType.extensions;
    }

    /**
     * Returns a plugin name for ReactFileType.
     */
    name(): string {
        return ReactFileType.pluginName;
    }

    /**
     * NOOP. Nothing is written out from `ilib-loctool-react` by design.
     * It is used only for reading files and passing ResourceStrings back to `loctool`.
     */
    write() {}

    /**
     * Returns a new instance of ReactFile class for the given file path.
     */
    newFile(filePath: string): ReactFile {
        if (this.ReactFileInstance) {
            throw new Error("ReactFile instance is already initialized");
        }

        const fullPath = path.join(this.project.getRoot(), filePath);
        this.ReactFileInstance = new ReactFile(
            fullPath,
            this.loctoolApi,
            this.sourceLocale,
            this.project
        );

        return this.ReactFileInstance;
    }

    /**
     * Returns a unique string that can be used to identify strings that come from ReactFileType.
     */
    getDataType(): string {
        return ReactFileType.datatype;
    }

    /**
     * Returns undefined to use defaults hash that maps the class of a resource specific for ReactFile to a resource type.
     */
    getDataTypes(): undefined {
        return undefined;
    }

    /**
     * Returns the translation set containing all the extracted resources for all instances of ReactFileType.
     * This includes all new strings and all existing strings extracted from a source file.
     */
    getExtracted(): TranslationSet {
        if (!this.ReactFileInstance) {
            throw new Error("ReactFile instance is not initialized");
        }

        return this.ReactFileInstance.getTranslationSet();
    }

    /**
     * NOOP, as it's not clear why would the ReactFileType need to add a set of translations to itself
     * given that per the getExtracted method, sets should come from the ReactFile.
     */
    addSet(_set: TranslationSet): void {}

    /**
     * Returns the translation set containing all the new resources for all instances of ReactFileType.
     * Not sure how this differs from getExtracted method.
     */
    getNew(): TranslationSet {
        return this.getExtracted();
    }

    /**
     * Return the translation set containing all the pseudo localized resources for all instances of ReactFileType.
     */
    getPseudo(): TranslationSet {
        return this.loctoolApi.newTranslationSet(this.sourceLocale);
    }

    getResourceTypes() {
        /*
        According to:
        https://github.com/iLib-js/loctool/blob/285401359f923c1be11e7329b549ed11b4099637/lib/Project.js#L235-L244

        Even though not specified in the documented plugin interface, loctool seems to expect
        either getResourceTypes() or registerDataTypes() to be present.
        getResourceTypes() is expected to return a mapping between the `datatype` identifier and
        a class name registered in the ResourceFactory, while registerDataTypes()
        appears to do a similar thing, but with internal access to the ResourceFactory,
        based on existing implementations for built-in file types.
    */
        return {
            [ReactFileType.datatype]: "ResourceString",
        } as const;
    }
}
