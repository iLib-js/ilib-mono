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

// per https://github.com/iLib-js/loctool/blob/201b56fc5a524ae578b55f582ff9b309010b4c3c/docs/Plugins.md#api-class
declare module "loctool" {
    /** the resource is a simple string */
    type ResTypeString = "string";

    /** the resource is an array of strings */
    type ResTypeArray = "array";

    /** the resource is a string with plural forms */
    type ResTypePlural = "plural";

    /**
     * the resource is a simple string with a context.
     * Strings in the different contexts may have the same content,
     * but are differentiated by their context.
     */
    type ResTypeContextString = "contextString";

    /**
     * the resource is a string from an iOS file.
     * These strings are handled slightly differently in that loctool
     * keeps track of the the source file where the string came from
     * originally so that it can write the translations to
     * appropriate .strings file.
     */
    type ResTypeIosString = "iosString";

    /**
     * Possible type identifiers for a resource.
     *
     * Possible values per
     * [`API.newResource` method documentation](https://github.com/iLib-js/loctool/blob/201b56fc5a524ae578b55f582ff9b309010b4c3c/docs/Plugins.md#api-class)
     *
     * Note that implementation of {@link API.newResource} seems to allow for the factory to be extended - so this type
     * should then be extended as well, see {@link ResourceFactoryMap} documentation.
     */
    interface ResTypeMap {
        string: ResTypeString;
        array: ResTypeArray;
        plural: ResTypePlural;
        contextString: ResTypeContextString;
        iosString: ResTypeIosString;
    }

    type ResType = ResTypeMap[keyof ResTypeMap];

    /**
     * Defines possible return types of the resource factory method {@link API.newResource}
     * per https://github.com/iLib-js/loctool/blob/201b56fc5a524ae578b55f582ff9b309010b4c3c/lib/ResourceFactory.js
     *
     * Note that the implementation linked above seems to allow for the factory to be extended - so this type should then be extended as well:
     * ```typescript
     * // define const identifier
     * type ResTypeCustom = "myCustomType";
     *
     * declare module "loctool" {
     *     // insert it into known resource type identifiers
     *     interface ResTypeMap {
     *         myCustomType: ResTypeCustom;
     *     }
     *     // and known return types of the resource factory method
     *     interface ResourceFactoryMap {
     *         myCustomType: ResTypeCustom;
     *     }
     * }
     * // implement the custom resource class
     * class ResourceCustom extends Resource {
     *     // use the defined type identifier
     *     getType(): ResTypeCustom {
     *         return "myCustomType";
     *     }
     * }
     * ```
     */
    interface ResourceFactoryMap {
        string: ResourceString;
        array: ResourceArray;
        plural: ResourcePlural;
        iosString: ResourceString;
        contextString: ResourceString;
    }

    /**
     * Concrete return type of the {@link API.newResource} method
     * inferred based on the value provided to {@link NewResourceOptions.resType}.
     */
    type InstantiatedResource<T extends ResType> = ResourceFactoryMap[T];

    type BaseResourceOptions<T extends ResType> = {
        /** Type of resource to instantiate */
        resType: T;

        /** name of the project containing this resource */
        project?: string;

        /** the unique key of this resource */
        key?: string;

        /** the source locale of this resource */
        sourceLocale?: string;

        /**
         * boolean value which is true when the key is
         * generated automatically from the source rather
         * than given explicitly.
         */
        autoKey?: boolean;

        /** path to the file where this resource was extracted */
        pathName?: string;

        /**
         * state of the current resource.
         * Almost always, plugins should report that the state is "new".
         */
        state?: string;

        /** translator's comment */
        comment?: string;

        /**
         * data type used in xliff files to identify strings
         * as having been extracted from this type of file
         */
        datatype?: string;

        /** numerical index that gives the order of the strings in the source file. */
        index?: number;
    };

    type StringResourceOptions = {
        /**
         * the source string for the "string", "iosString"
         * and "contextString" resTypes
         */
        source?: string;
    };

    type ArrayResourceOptions = {
        /** the source array for the "array" resType */
        sourceArray?: string[];
    };

    type PluralResourceOptions = {
        /**
         * an object mapping CLDR plural categories to
         * source strings for the "plural" resType
         */
        sourcePlurals?: Record<string, string>;
    };

    interface ResourceOptionsMap {
        string: StringResourceOptions;
        iosString: StringResourceOptions;
        contextString: StringResourceOptions;
        array: ArrayResourceOptions;
        plural: PluralResourceOptions;
    }

    type NewResourceOptions<T extends ResType = ResType> = BaseResourceOptions<T> & ResourceOptionsMap[T];

    type ResBundle = unknown;
    type APIUtils = unknown;

    export class API {
        /**
         * Return a new instance of a resource of the given type.
         * The options are passed to the resource subclass
         * constructor. The primary option is the "resType".
         *
         * @returns an instance of a resource subclass
         */
        newResource<T extends ResType>(options: NewResourceOptions<T>): InstantiatedResource<T>;

        /**
         * Create a new translation set. A translation set is
         * a set of resources which contain meta-data about their
         * strings and the source and translated strings themselves.
         * A translation set may contain the same source phrase
         * multiple times if the meta-data is different because the
         * same phrase may be used in different ways in different
         * contexts of the application and thus may need a different
         * translation.<p>
         *
         * This is differentiated from a translation memory where
         * there are translations of source strings or phrases
         * without meta-data and possibly broken into shorter units.
         * A translation memory may also have multiple translations
         * for a particular source phrase, but which one should be
         * used for a particular source string in the application
         * is unclear because there is no meta-data associating
         * each translation with the source string.<p>
         *
         * The purpose of a translation memory is to aid a translator
         * in reusing translations that they have previous done
         * for consistency and speed of translation. The purpose
         * of a translation set is to denote which translations
         * are used for each source string in the application in
         * its idiosyncratic context.<p>
         *
         * The loctool uses translation sets to collect source strings
         * in the application and to represent translations of them.
         *
         * @param sourceLocale the locale spec of the
         * source locale. If not specified, the project's source
         * locale is used.
         * @returns a new translation set instance
         */
        newTranslationSet<R extends Resource = Resource>(sourceLocale?: string): TranslationSet<R>;

        /**
         * Object containing some utility functions and data that the
         * plugin may need.
         */
        get utils(): APIUtils;

        /**
         * Return true if the given locale spec is for a pseudo-locale.
         * A pseudo-locale is one where an algorithm is applied
         * to the source text to create a pseudo-localization. This is
         * useful for localization enablement testing or font testing.
         *
         * @param locale the locale spec for the locale to test
         * @returns true if the given locale is a pseudo-locale
         * and false otherwise.
         */
        isPseudoLocale(locale: string): boolean;

        /**
         * Return a pseudo-translation resource bundle. This kind of
         * resource bundle applies a function over a source string to
         * produce a translated string. The resulting translated string
         * may be used for i18n testing or as an actual translation.
         *
         * @param locale the target locale of the pseudo bundle
         * @param filetype the file type of the file where
         *   the source strings are extracted from
         * @param project the project where the source
         *   strings are extracted from
         * @returns a resource bundle that automatically
         *   translates source strings
         */
        getPseudoBundle(locale: string, filetype: FileType, project: Project): ResBundle;

        /**
         * Return a FileType instance that represents the type of file
         * that is used as a resource file for the given source file
         * type. For example, Java source files use the properties files
         * as resource file types.
         * @param type the type of source file
         * @returns a file type instance that represents the
         *   resource file type for the given source file type
         */
        getResourceFileType(type: string): FileType;
    }
}
