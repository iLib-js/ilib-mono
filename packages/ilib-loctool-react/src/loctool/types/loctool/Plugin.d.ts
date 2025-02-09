/*
 * Copyright © 2024, Box, Inc. All Rights Reserved.
 */

// loctool expects that plugin returns a class which it then instantiates on its own
// using specifically this signature;
// see https://github.com/iLib-js/loctool/blob/285401359f923c1be11e7329b549ed11b4099637/lib/CustomProject.js#L108
declare module "loctool" {
    export type Plugin = {
        /**
         * Construct a new instance of this filetype subclass to represent
         * a collection of files of this type. Instances of this class
         * should store the API for use later to access things inside of
         * the loctool.
         *
         * @param project an instance of a project in which this
         * filetype exists
         * @param API a set of calls that that the plugin can use
         * to get things done
         */
        new (project: Project, API: API): FileType;
    };
}
