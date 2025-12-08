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

// per https://github.com/iLib-js/loctool/blob/201b56fc5a524ae578b55f582ff9b309010b4c3c/docs/Plugins.md#resourcestring
declare module "loctool" {
    export class ResourceString extends Resource {
        getType(): ResourceTypeString;

        /**
         * Return the source string written in the source
         * locale of this resource string.
         *
         * @returns the source string
         */
        getSource(): string;

        /**
         * Set the source string written in the source
         * locale of this resource string.
         *
         * @param str the source string
         */
        setSource(str: string): string;

        /**
         * Return the string written in the target locale.
         *
         * @returns the source string
         */
        getTarget(): string;

        /**
         * Set the target string of this resource.
         *
         * @param str the target string
         */
        setTarget(str: string): string;
    }
}
