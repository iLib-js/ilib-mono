/*
 * Copyright © 2024, Box, Inc. All Rights Reserved.
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
