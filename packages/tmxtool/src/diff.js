/*
 * diff.js - compare two tmx objects and produce another tmx object
 * with the diffs
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
 * 
 * @param {Object} options options controlling this diff
 * @param {String} file1 the path to the first tmx to compare
 * @param {String} file2 the path to the second tmx to compare
 */
export function diff(options, file1, file2) {
    const tmx1 = new TMX({path: file1});
    const tmx2 = new TMX({path: file2});
    const difftmx = tmx1.diff(tmx2);
    const diffstring = difftmx.serialize();
    if (options.opt.outputfile) {
        fs.writeFileSync(options.opt.outputfile, diffstring, "utf-8");
    } else {
        console.log(diffstring);
    }
}

export default diff;
