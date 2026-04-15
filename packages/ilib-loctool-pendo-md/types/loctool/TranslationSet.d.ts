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

// per https://github.com/iLib-js/loctool/blob/201b56fc5a524ae578b55f582ff9b309010b4c3c/docs/Plugins.md#translationset
declare module "loctool" {
    type Criteria = unknown;

    export class TranslationSet<R extends Resource = Resource> {
        /**
         * Get a resource by its hashkey.
         *
         * @param hashkey The unique hashkey of the resource being sought.
         * @returns a resource corresponding to the hashkey, or
         * undefined if there is no resource with that key
         */
        get(hashkey: string): R | undefined;

        /**
         * Get a resource by its clean string hashkey.
         *
         * @param hashkey The unique hashkey of the resource being sought.
         * @returns a resource corresponding to the hashkey, or undefined if there is no
         * resource with that key
         */
        getClean(hashkey: string): R | undefined;

        /**
         * Get a resource by its source string and context. The source string must be written
         * in the language and script of the source locale. For array types, the
         * source string
         * must be one of the values in the string array. For plural types, it
         * must be one of the values of the quantities.<p>
         *
         * If the context is undefined,
         * this method will find the base generic resource with no context.
         *
         * @param source The source string to look up
         * @param context The optional context of the resource being sought.
         * @returns a resource corresponding to the source string, or
         * undefined if there is no resource with that source
         */
        getBySource(source: string, context?: string): R | undefined;

        /**
         * Return all resources in this set.
         *
         * @returns an array of resources in this set,
         * possibly empty
         */
        getAll(): R[];

        /**
         * Add a resource to this set. If this resource has the same key
         * as an existing resource, but a different locale, then this
         * resource is added a translation instead.
         *
         * @param resource a resource to add to this set
         */
        add(resource: R): void;

        /**
         * Add every resource in the given array to this set.
         * @param resources an array of resources to add
         * to this set
         */
        addAll(resources: R[]): void;

        /**
         * Add every resource in the given translation set to this set,
         * merging the results together.
         *
         * @param set an set of resources to add
         * to this set
         */
        addSet(set: TranslationSet<R>): void;

        /**
         * Return the number of unique resources in this set.
         * @param context The optional context of the resource being counted.
         * @param locale the locale of the resources being counted
         * @returns the number of unique resources in this set
         */
        size(context?: string, locale?: string): number;

        /**
         * Reset the dirty flag to false, meaning the set is clean. This will
         * allow callers to tell if any more resources were added after
         * this call was made because adding those resources will set
         * the dirty flag to true again.
         */
        setClean(): void;

        /**
         * Return whether or not this set is dirty. The dirty flag is set
         * whenever a new resource was added to or removed from the set
         * after it was created or since the last time the setClean method
         * was called.
         * @returns true if the set is dirty, false otherwise
         */
        isDirty(): boolean;

        /**
         * Remove a resource from the set. The resource must have at
         * least enough fields specified to uniquely identify the
         * resource to remove. These are: project, context, locale,
         * resType, and reskey.
         *
         * @param resource The resource to remove
         * @returns true if the resource was removed successfully
         * and false otherwise
         */
        remove(resource: R): boolean;

        /**
         * Get a resource by the given criteria.
         * @param criteria the filter criteria to select the resources to return
         * @returns the array of Resources, or undefined if the
         * retrieval did not find any resources that match or there was some error
         */
        getBy(options: Criteria): R[] | undefined;

        /**
         * Return an array of all the project names in the database.
         *
         * @returns the array of project names
         * or undefined if there are no projects in the set
         */
        getProjects(): string[] | undefined;

        /**
         * Return an array of all the contexts within the given project
         * in the set. The root context is just the empty string.
         * The root context is where all strings will go if they are
         * not given an explicit context in the resource file or code.
         *
         * @param project the project that contains
         * the contexts or undefined to mean all projects
         * @returns the array of context names
         * or undefined if there are no contexts in the set
         */
        getContexts(project?: string): string[] | undefined;

        /**
         * Return an array of all the locales available within the given
         * project and context in the set. The root context is just
         * the empty string. The locales are returned as BCP-47 locale
         * specs.
         *
         * @param project the project that contains
         * the contexts or undefined to mean all projects
         * @param context the context that contains
         * the locales or undefined to mean all locales.
         * Use the empty string "" for the default/root context.
         * @returns the array of context names
         * or undefined if there are no contexts in the set
         */
        getLocales(project?: string, context?: string): string[] | undefined;

        /**
         * Clear all resources from this set.
         */
        clear(): void;

        /**
         * Return a new translation set that contains the differences
         * between the current set and the other set. Resources are
         * added to the difference set if they exist in the other
         * set but not the current one, or if they exist in both
         * sets, but contain different fields.
         *
         * @param other the other set to diff against
         * @returns the differences between the other
         * set and this one
         */
        diff<OtherR extends Resource = Resource>(other: TranslationSet<OtherR>): TranslationSet<R & OtherR>;
    }
}
