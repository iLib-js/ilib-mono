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

// per https://github.com/iLib-js/loctool/blob/201b56fc5a524ae578b55f582ff9b309010b4c3c/docs/Plugins.md#file-class
declare module "loctool" {
    export interface File {
        // note: the following constructor signature is commented out
        // because as per the documentation, File class should be instantiated
        // by FileType class
        // /**
        //  * Construct a new instance of this file class for the file
        //  * at the given pathName.
        //  *
        //  * @param pathName path to the file to respresent
        //  * @param API a set of calls that that the plugin can use
        //  * to get things done.
        //  */
        // /* eslint-disable-next-line @typescript-eslint/no-misused-new --
        //  * even though it currently seems that loctool does NOT instantiate
        //  * this class on its own anywhere, constructor signature is nonetheless
        //  * defined as part of the File interface in the documentation
        //  */
        // constructor(pathName: string, API: API): File;

        /**
         * Extract all the localizable strings from the file and add
         * them to the project's translation set. This method should
         * open the file, read its contents, parse it, and add each
         * string it finds to the project's traslation set, which can
         * be retrieved from the API passed to the constructor.
         */
        extract(): void;

        /**
         * Return the set of string resources found in the current file.
         *
         * @returns The set of resources found in the
         * current file.
         */
        getTranslationSet(): TranslationSet;

        /**
         * If the source file was modified in any way during the
         * extraction, this method allows the plugin to write out the
         * source file back to disk to the appropriate file.
         */
        write(): void;

        /**
         * Return the location on disk where the version of this file,
         * localized for the given locale, should be written.
         *
         * @param locale the locale spec for the target locale
         * @returns the localized path name
         */
        getLocalizedPath(locale: string): string;

        /**
         * Localize the contents of this file and write out the
         * localized file to a different file path.
         *
         * @param translations the current set of
         * translations
         * @param locales array of locales to translate to
         */
        localize(translations: TranslationSet, locales: string[]): void;
    }
}
