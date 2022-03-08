/*
 * index.js - utilities to load ilib locale data
 *
 * Copyright © 2022 JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { getPlatform } from 'ilib-env';
import LoaderFactory from 'ilib-loader';

class LocaleData {
/**
 * Find locale data or load it in. If the data with the given name is preassembled, it will
 * find the data in ilib.data. If the data is not preassembled but there is a loader function,
 * this function will call it to load the data. Otherwise, the callback will be called with
 * undefined as the data. This function will create a cache under the given class object.
 * If data was successfully loaded, it will be set into the cache so that future access to
 * the same data for the same locale is much quicker.<p>
 *
 * The parameters can specify any of the following properties:<p>
 *
 * <ul>
 * <li><i>name</i> - String. The name of the file being loaded. Default: ResBundle.json
 * <li><i>object</i> - String. The name of the class attempting to load data. This is used to differentiate parts of the cache.
 * <li><i>locale</i> - Locale. The locale for which data is loaded. Default is the current locale.
 * <li><i>nonlocale</i> - boolean. If true, the data being loaded is not locale-specific.
 * <li><i>type</i> - String. Type of file to load. This can be "json" or "other" type. Default: "json"
 * <li><i>replace</i> - boolean. When merging json objects, this parameter controls whether to merge arrays
 * or have arrays replace each other. If true, arrays in child objects replace the arrays in parent
 * objects. When false, the arrays in child objects are concatenated with the arrays in parent objects.
 * <li><i>root</i> - String. If provided, look in this root directory first for files, and then fall back
 * to the standard include paths if they are not found in this root. If not provided, just search the
 * standard include paths.
 * <li><i>returnOne</i> - return only the first file found. Do not merge many locale data files into one.
 * <li><i>sync</i> - boolean. Whether or not to load the data synchronously
 * </ul>
 *
 * @param {Object} params Parameters configuring how to load the files (see above)
 */
export function loadData(params) {
};

export function addPaths(paths) {}
export function getPaths() {}
