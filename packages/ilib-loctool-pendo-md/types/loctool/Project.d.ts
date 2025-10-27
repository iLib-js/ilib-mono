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

// per https://github.com/iLib-js/loctool/blob/201b56fc5a524ae578b55f582ff9b309010b4c3c/docs/Plugins.md#the-project-class
declare module "loctool" {
    export class Project {
        /**
         * Return the translation set for this project.
         *
         * @returns the translation set
         */
        getTranslationSet(): TranslationSet;

        /**
         * Return the unique id of this project. Often this is the
         * name of the repository in source control.
         *
         * @returns the unique id of this project
         */
        getProjectId(): string;

        /**
         * Return the root directory of this project.
         *
         * @returns the path to the root dir of this project
         */
        getRoot(): string;

        /**
         * Add the given path name the list of files in this project.
         *
         * @param pathName the path to add to the project
         */
        addPath(pathName: string): void;

        /**
         * Return an array of resource directories for the file type.
         * If there are no resource directories for the file type,
         * then this returns an empty array.
         *
         * @param type ?
         * @returns an array of resource directories
         * for the file type.
         */
        getResourceDirs(type: string): string[];

        /**
         * Return true if the given path is included in the list of
         * resource directories for the given type. This method returns
         * true for any path to a directory or file within any resource
         * directory or any of its subdirectories.
         *
         * @param type the type of resources being tested
         * @param pathName the directory name to test
         * @returns true if the path is within one of
         * the resource directories, and false otherwise
         */
        isResourcePath(type: string, pathName: string): boolean;

        /**
         * Return true if the given locale is the source locale of this
         * project, or any of the flavors thereof.
         * @param locale the locale spec to test
         * @returns true if the given locale is the source
         * locale of this project or any of its flavors, and false
         * otherwise.
         */
        isSourceLocale(locale: string): boolean;

        /**
         * Get the source locale for this project.
         *
         * @returns the locale spec for the source locale of
         * this project
         */
        getSourceLocale(): string;

        /**
         * Get the pseudo-localization locale for this project.
         *
         * @returns the locale spec for the pseudo locale of
         * this project
         */
        getPseudoLocale(): string;

        /**
         * Return the resource file type for this project.
         * The resource file type will be able to read in and
         * write out resource files and other file types put
         * their resources here. The type parameter tells
         * which type of resources are being sought. A project
         * for example may contain separate resource files for
         * javascript and ruby.
         *
         * @param type the type of resource being sought
         * @returns the resource file type for this
         * project, which may be an instance of another file
         * type plugin
         */
        getResourceFileType(type: string): FileType;
    }
}
