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

// per https://github.com/iLib-js/loctool/blob/201b56fc5a524ae578b55f582ff9b309010b4c3c/docs/Plugins.md#resource
declare module "loctool" {
    type ResourceProps = {
        /** the project that this resource is in */
        project: string;
        /**
         * The context for this resource, such as "landscape mode", or "7200dp",
         * which differentiates it from the base resource that has no special context.
         * The default if this property is not specified is undefined, meaning no context.
         */
        context?: string;
        /** the locale of the source resource. */
        sourceLocale: string;
        /** the locale of the target resource. */
        targetLocale: string;
        /** the unique key of this string, which should include the context of the string */
        key: string;
        /** pathName to the file where the string was extracted from */
        pathName: string;
        /** true if the key was generated based on the source text */
        autoKey: boolean;
        /** current state of the resource (ie. "new", "translated", or "accepted") */
        state: ResourceState;
    };

    type ResourceState = "new" | "translated" | "accepted";

    type ResourceTypeString = "string";
    type ResourceTypeArray = "array";
    type ResourceTypePlural = "plural";
    /**
     * Possible type identifiers for a resource as defined in Resource.getType() in
     * https://github.com/iLib-js/loctool/blob/201b56fc5a524ae578b55f582ff9b309010b4c3c/docs/Plugins.md#resource
     */
    type ResourceType = ResourceTypeString | ResourceTypeArray | ResourceTypePlural;

    export class Resource {
        /**
         * @class Represents a resource from a resource file or
         * extracted from the code.
         * @param props properties of the string
         */
        constructor(props: ResourceProps);

        /**
         * Return the project that this resource was found in.
         *
         * @returns the project of this resource
         */
        getProject(): string;

        /**
         * Return the unique key of this resource.
         *
         * @returns the unique key of this resource
         */
        getKey(): string;

        /**
         * Return the resource type of this resource.
         *
         * @returns the resource type of this resource
         */
        getType(): ResourceType;

        /**
         * Return the data type of this resource.
         *
         * @returns the data type of this resource
         */
        getDataType(): string;

        /**
         * Return true if the key of this resource was automatically generated,
         * and false if it was an explicit key.
         *
         * @returns true if the key of this string was auto generated,
         * false otherwise
         */
        getAutoKey(): boolean;

        /**
         * Return the context of this resource, or undefined if there
         * is no context.
         * @returns the context of this resource, or undefined if there
         * is no context.
         */
        getContext(): string | undefined;

        /**
         * Return the source locale of this resource, or undefined if there
         * is no context or the locale is the same as the project's source locale.
         * @returns the locale of this resource, or undefined if there
         * is no locale.
         */
        getSourceLocale(): string | undefined;

        /**
         * Set the source locale of this resource.
         * @param locale the source locale of this resource
         */
        setSourceLocale(locale: string): void;

        /**
         * Return the target locale of this resource, or undefined if the resource
         * is a source-only resource.
         * @returns the locale of this resource, or undefined if there
         * is no locale.
         */
        getTargetLocale(): string | undefined;

        /**
         * Set the target locale of this resource.
         * @param locale the target locale of this resource
         */
        setTargetLocale(locale: string): void;

        /**
         * Return the state of this resource. This is a string that gives the
         * stage of life of this resource. Currently, it can be one of "new",
         * "translated", or "accepted".
         *
         * @returns the state of this resource
         */
        getState(): ResourceState;

        /**
         * Set the state of this resource. This is a string that gives the
         * stage of life of this resource. Currently, it can be one of "new",
         * "translated", or "accepted".
         *
         * @param state the state of this resource
         */
        setState(state: ResourceState): void;

        /**
         * Return the original path to the file from which this resource was
         * originally extracted.
         *
         * @returns the path to the file containing this resource
         */
        getPath(): string;

        /**
         * Return the translator's comment for this resource if there is
         * one, or undefined if not.
         *
         * @returns the translator's comment for this resource
         * if the engineer put one in the code
         */
        getComment(): string | undefined;

        /**
         * Set the translator's comment for this resource.
         *
         * @param comment the translator's comment to set. Use
         * undefined to clear the comment
         */
        setComment(comment: string | undefined): void;

        /**
         * Return the localize flag of this resource.
         * This flag indicates whether we should look up a translation for this resource.
         * When false, we should simply substitute the source back
         *
         * @returns the localize flag of this resource
         */
        getLocalize(): boolean;

        /**
         * Return the name of the flavor for this resource, or undefined
         * for the "main" or default flavor.
         *
         *  @returns the name of the flavor for this
         *  resource or undefined for the main or default flavor
         */
        getFlavor(): string | undefined;

        /**
         * Return true if the other resource represents the same resource as
         * the current one. The project, context, locale, key, flavor, and type must
         * match. Other fields such as the pathName, state, and comment fields are
         * ignored as minor variations.
         *
         * @param other another resource to test against the current one
         * @returns true if these represent the same resource, false otherwise
         */
        same(other: Resource): boolean;

        /**
         * Return the number of strings in this resource.
         *
         * @returns the number of strings in this resource
         */
        size(): number;

        /**
         * Clone this resource and override the properties with the given ones.
         *
         * @param overrides optional properties to override in
         * the cloned object
         * @returns a clone of this resource
         */
        clone(overrides?: Partial<ResourceProps>): Resource;

        /**
         * Return true if the other resource contains the exact same resource as
         * the current one. All fields must match.
         *
         * @param other another resource to test against the current one
         * @returns true if these represent the same resource, false otherwise
         */
        equals(other: Resource): boolean;

        /**
         * Return the a hash key that uniquely identifies this resource. The hash
         * key is used to look up a resource in a translation set.
         *
         *  @returns a unique hash key for this resource
         */
        hashKey(): string;

        /**
         * Return the a hash key that uniquely identifies the translation of
         * this resource to the given locale.
         *
         * @param locale a locale spec of the desired translation
         * @returns a unique hash key for this resource
         */
        hashKeyForTranslation(locale: string): string;

        /**
         * Return the cleaned hash key that uniquely identifies this resource.
         * A cleaned hash key is meant to increase matches between source
         * strings that only differ in ways that do not affect the translation.
         * For example, if string #1 has 4 spaces at the beginning, and string
         * #2 has 12 spaces at the beginning, but they both have the exact
         * same text after that, there is no good reason that they should not
         * share the same translation. The spaces do not really affect the
         * traslation of that text. A cleaned hash key can be cleaned in
         * a variety of ways, and the exact methods used are unique to the
         * type of resource.
         *
         *  @returns a unique hash key for this resource, but cleaned
         */
        cleanHashKey(): string;

        /**
         * Return a cleaned hash key that uniquely identifies the translation of
         * this resource to the given locale. See above for a definition of a
         * cleaned hash key.
         *
         * @param locale a locale spec of the desired translation
         * @returns a unique hash key for this resource's string
         */
        cleanHashKeyForTranslation(locale: string): string;

        isInstance(resource);

        addInstance(resource);

        getInstances();
    }
}
