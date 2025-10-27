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

// per https://github.com/iLib-js/loctool/blob/201b56fc5a524ae578b55f582ff9b309010b4c3c/docs/Plugins.md#filetype-class
declare module "loctool" {
    export interface FileType {
        // note: the following commented-out constructor signature is instead defined in the Plugin interface
        // /**
        //  * Construct a new instance of this filetype subclass to represent
        //  * a collection of files of this type. Instances of this class
        //  * should store the API for use later to access things inside of
        //  * the loctool.
        //  *
        //  * @param project an instance of a project in which this
        //  * filetype exists
        //  * @param API a set of calls that that the plugin can use
        //  * to get things done
        //  */
        // /* eslint-disable-next-line @typescript-eslint/no-misused-new --
        //  * loctool expects that plugin returns a class which it then instantiates
        //  * using specifically this signature;
        //  * see https://github.com/iLib-js/loctool/blob/285401359f923c1be11e7329b549ed11b4099637/lib/CustomProject.js#L108
        //  */
        // constructor(project: Project, API: API): FileType;

        /**
         * Return true if the given path is handled by the current file type.
         *
         * @param pathName path to the file being queried
         * @returns true if the path is handled by this type,
         * or false otherwise
         */
        handles(pathName: string): boolean;

        /**
         * Return the file name extensions that correspond to this file
         * type. The extensions should be returned as an array of strings
         * that include the dot or other separator. The extensions array
         * is used to do a rough filter of all the files, and the
         * handles() method is called for each file to verify whether
         * or not that particular file is handled.
         *
         * @example
         * // Extensions for Java files:
         * getExtensions() {
         *     return [".java", ".jav"];
         * }
         *
         * @returns an array of strings that give the
         * file name extensions of the files that this file type handles
         */
        getExtensions(): string[];

        /**
         * Return a unique name for this type of plugin that can be
         * displayed to a user.
         *
         * @returns a unique name for this type of plugin
         */
        name(): string;

        /**
         * Write out the aggregated resources for this file type. In
         * some cases, the string are written out to a common resource
         * file, and in other cases, to a type-specific resource file.
         * In yet other cases, nothing is written out, as the each of
         * the files themselves are localized individually, so there
         * are no aggregated strings.
         */
        write(): void;

        /**
         * Return a new instance of a file class for the given path.
         * This method acts as a factory for the file class that
         * goes along with this filetype class.
         * @param pathInProject path to the file to represent \
         * NOTE: per https://github.com/iLib-js/loctool/blob/285401359f923c1be11e7329b549ed11b4099637/loctool.js#L650
         * it seems that loctool supplies a path relative to the project root
         * @returns a File class instance for the given path
         */
        newFile(pathInProject: string): File;

        /**
         * Return a unique string that can be used to identify strings
         * that come from this type of file. This is used in XLIFF files
         * and a few other places to identify the file type. The value
         * must be one of the strings from the XLIFF specification
         * at [http://docs.oasis-open.org/xliff/v1.2/os/xliff-core.html#datatype]
         * or a custom string that starts with "x-".
         *
         * @returns a unique string to identify strings from
         * this type of file
         */
        getDataType(): string;

        /**
         * Return a hash that maps the class of a resource to a specific
         * resource type. The properties of the hash are the classes "string",
         * "array", and "plural". The values are one of the resource types
         * given below in the discussion about resources. If any of the
         * properties are left out, the default is assumed. The default for
         * "string" is "string", for "array" is "array", and for "plural" it
         * is "plural". If the return value is undefined, all of the classes
         * will use the default types.
         *
         * @example
         * // Return value for an Android string which defines strings as
         * // being of the context string type, and arrays and plurals are
         * // of the default type:
         * {
         *     "string": "contextString"
         * }
         *
         * @returns a object which maps the resource class
         * name to the resource type
         */
        getDataTypes(): Record<string, string> | undefined;

        /**
         * Return the translation set containing all of the extracted
         * resources for all instances of this type of file. This includes
         * all new strings and all existing strings. If it was extracted
         * from a source file, it should be returned here.
         *
         * @returns the set containing all of the
         * extracted resources
         */
        getExtracted(): TranslationSet;

        /**
         * Add the contents of the given translation set to the extracted resources
         * for this file type.
         *
         * @param set set of resources to add to the current set
         */
        addSet(set: TranslationSet): void;

        /**
         * Return the translation set containing all of the new
         * resources for all instances of this type of file.
         *
         * @returns the set containing all of the
         * new resources
         */
        getNew(): TranslationSet;

        /**
         * Return the translation set containing all of the pseudo
         * localized resources for all instances of this type of file.
         *
         * @returns the set containing all of the
         * pseudo localized resources
         */
        getPseudo(): TranslationSet;
    }
}
