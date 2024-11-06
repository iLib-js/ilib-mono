/*
 * merge.js - merge two or more tmx objects together and produce another
 * tmx object with the superset of all of them
 *
 * Copyright © 2023 JEDLSoft
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

import fs from 'fs';
import TMX from 'ilib-tmx';

/**
 * Merge two or more tmx objects together and produce another
 * tmx object with the superset of all of them.
 *
 * @param {Object} options options controlling this diff
 * @param {Array.<String>} files an array of paths to tmx files to merge
 */
export function merge(options, files) {
    if (!files || !Array.isArray(files) || files.length < 2) {
        console.log("Nothing to merge...");
        return;
    }
    const tmxs = files.map(file => new TMX({path: file}));

    const mergeTmx = tmxs[0].merge(tmxs.slice(1));
    const mergeString = mergeTmx.serialize();
    if (options.opt.outputfile) {
        fs.writeFileSync(options.opt.outputfile, mergeString, "utf-8");
    } else {
        console.log(mergeString);
    }
}

export default merge;
