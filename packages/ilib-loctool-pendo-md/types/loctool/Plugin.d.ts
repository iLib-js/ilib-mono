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
