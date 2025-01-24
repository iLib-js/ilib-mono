/*
 * DirectoryWalk.js - Represent a tree of files and directories on disk
 *
 * Copyright © 2024-2025 JEDLSoft
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

import fs from 'node:fs';
import path from 'node:path';
import mm from 'micromatch';

function hasItems(list) {
    return typeof(list) !== 'undefined' && Array.isArray(list) && list.length > 0;
}

/**
 * Does the actual directory walk and return a list of files and directories.
 *
 * @param {String} dirPath The path to the directory to walk
 * @param {Array<String>} includes A list of micromatch patterns to include in the walk.
 *   If a pattern matches both an exclude and an include, the
 *   include will override the exclude.
 * @param {Array<String>} excludes A list of micromatch patterns to exclude from the walk.
 *   If a pattern matches a directory, that directory will not be recursively searched.
 * @returns {Object[]} an array of file names in the directory, filtered by the excludes
 * and includes list
 * @private
 */
function walkDir(root, dirPath, includes, excludes) {
    let included;
    let list = [];

    const fullPath = path.join(root, dirPath);
    const items = fs.readdirSync(fullPath);
    if (items && items.length !== 0) {
        items.sort();
    }

    const inc = hasItems(includes);
    const exc = hasItems(excludes);

    for (const file of items) {
        // don't walk into the . and .. directories
        if (file === "." || file === "..") {
            continue;
        }

        const relativePath = path.normalize(path.join(dirPath, file));

        const stat = fs.statSync(path.join(root, relativePath), {throwIfNoEntry: false});

        included = !inc || exc || stat.isDirectory(); // reset the included flag

        if (exc) {
            included = !mm.isMatch(relativePath, excludes);
            // override the excludes if the includes list is defined
            if (inc && !included) {
                included = mm.isMatch(relativePath, includes);
            }
        } else if (inc && !stat.isDirectory()) {
            included = mm.isMatch(relativePath, includes);
        }

        if (!included) {
            continue;
        }

        if (stat.isDirectory()) {
            const children = walkDir(root, relativePath, includes, excludes);
            if (children && children.length > 0) {
                list.push({
                    type: "directory",
                    path: relativePath,
                    children: walkDir(root, relativePath, includes, excludes)
                });
            }
        } else {
            list.push({
                type: "file",
                path: relativePath
            });
        }
    }

    return list;
}


/**
 * Recursively walk a directory and return a list of files and directories
 * within that directory. The walk is controlled via a list of exclude and
 * include patterns. Each pattern should be a micromatch pattern like this:
 *
 * <code>
 * "*.json"
 * </code>
 *
 * The full relative path to every file and directory in the top-level directory
 * will be included, unless it matches an exclude pattern, it which case, it will
 * be excluded from the output. However, if the path
 * also matches an include pattern, it will still be included nonetheless. The
 * idea is that you can exclude a whole category of files (like all json files),
 * but include specific ones. For example, you may exclude all json files, but
 * still want to include the "config.json" file.<p>
 *
 * The return value is an array of objects that look like this:
 * <code>
 * {
 *   "type": "file",
 *   "path": "a/b/c/d"
 * }
 *
 * or
 *
 * {
 *   "type": "directory",
 *   "path": "a/b/c/e",
 *   "children": [
 *     {
 *       "type": "file",
 *       "path": "a/b/c/e/f"
 *     },
 *     {
 *       "type": "file",
 *       "path": "a/b/c/e/g"
 *     }
 *   ]
 * }
 * </code>
 *
 * That is, each entry is either a file or a directory. If it is a directory, it will have a "children"
 * property that contains an array of the children of that directory. The path property is the full path
 * to the file or directory relative to the root directory.
 *
 * @param {Array<String>} includes A list of micromatch patterns to include in the walk.
 * If a pattern matches both an exclude and an include, the
 * include will override the exclude.
 * @param {Array<String>} excludes A list of micromatch patterns to exclude from the walk.
 * If a pattern matches a directory, that directory will not be recursively searched.
 * @returns {DirItem[]} an array of file names in the directory, filtered
 * by the excludes and includes list
 */
function walk(root, includes, excludes) {
    let list = [];

    if (typeof(root) !== "string") {
        return [];
    }

    let stat;

    try {
        stat = fs.statSync(root, {throwIfNoEntry: false});
        if (stat && stat.isDirectory()) {
            list = walkDir(root, ".", includes, excludes);
        } else if (stat.isFile()) {
            list = [{
                type: "file",
                path: root
            }];
        }
    } catch (e) {
        // ignore errors
    }
    return list;
}

export default walk;
