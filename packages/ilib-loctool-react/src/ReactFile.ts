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

import {API, File, Project, ResourceString, TranslationSet} from "loctool";
import fs from "fs";
import {extract, mapToResources} from "./resourceUtils";

export class ReactFile implements File {
    private readonly translationSet: TranslationSet<ResourceString>;

    /**
     * private readonly path: A reference to the path of the file.
     * private readonly loctool API: A reference to the loctool {@link API} instance which provides functionality to the plugin.
     */
    constructor(
        private readonly path: string,
        private readonly loctoolApi: API,
        private readonly sourceLocale: string,
        private readonly project: Project
    ) {
        this.translationSet = this.loctoolApi.newTranslationSet(sourceLocale);
    }

    /**
     * Extracts all the localizable strings from the file and adds them to the project's translation set.
     * This method
     *   * opens the file,
     *   * reads its contents,
     *   * parses it and
     *   * adds each string it finds to the project's translation set, which can be retrieved from the API passed to the constructor.
     */
    extract(): void {
        const messages = extract(this.path);

        const resources = mapToResources({
            messages,
            options: {
                sourceLocale: this.sourceLocale,
                projectId: this.project.getProjectId(),
            },
            createResource: this.loctoolApi.newResource.bind(this),
        });

        this.translationSet.addAll(resources);
    }

    /**
     * Returns the translations set (a set of ResourceString objects) for the ReactFile.
     */
    getTranslationSet() {
        return this.translationSet;
    }

    /**
     * NOOP, as the source file is not modified in any way during the extraction.
     */
    write() {
    }

    /**
     * NOOP.
     * This should return the location on disk where the localized version of this file should be written,
     * but it looks like this method was never used by `ilib-loctool`.
     */
    getLocalizedPath(_locale: string): string {
        return "";
    }

    /**
     * NOOP. `ilib-loctool-react` plugin does not write any localized content to a file.
     */
    localize(
        _translations: TranslationSet<ResourceString>,
        _locales: string[]
    ) {
    }
}
