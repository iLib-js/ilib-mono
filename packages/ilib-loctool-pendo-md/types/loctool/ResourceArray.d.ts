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

// per https://github.com/iLib-js/loctool/blob/201b56fc5a524ae578b55f582ff9b309010b4c3c/docs/Plugins.md#resourcearray
declare module "loctool" {
    export class ResourceArray extends Resource {
        getType(): ResourceTypeArray;

        /**
         * Return the array of source strings for this resource.
         *
         * @returns the array of strings that are
         * the source of this resource
         */
        getSourceArray(): string[];

        /**
         * Set the array of source strings for this resource.
         *
         * @param arr the array of strings to set
         * as the source array
         */
        setSourceArray(arr: string[]): void;

        /**
         * Return the array of target strings for this resource. The
         * target string at array position N corresponds to the source
         * string at position N.
         *
         * @returns the array of strings that are
         * the target value of this resource
         */
        getTargetArray(): string[];

        /**
         * Set the array of target strings for this resource.
         *
         * @param arr the array of strings to set
         * as the target array
         */
        setTargetArray(arr: string[]): void;

        /**
         * Return the source string with the given index into the array.
         *
         * @param i The index of the string being sought
         * @returns the value of the string at index i or
         * undefined if i is outside the bounds of the array
         */
        getSource(i: number): string | undefined;

        /**
         * Return the target string with the given index into the array.
         *
         * @param i The index of the string being sought
         * @returns the value of the string at index i or
         * undefined if i is outside the bounds of the array
         */
        getTarget(i: number): string | undefined;

        /**
         * Add a string to the source array at index i.
         *
         * @param i the index at which to add the string
         * @param str the string to add
         */
        addSource(i: number, str: string): void;

        /**
         * Add a string to the target array at index i.
         *
         * @param i the index at which to add the string
         * @param str the string to add
         */
        addTarget(i: number, str: string): void;

        /**
         * Return the length of the array of strings in this resource.
         *
         * @returns the length of the array of strings in this
         * resource
         */
        size(): number;
    }
}
