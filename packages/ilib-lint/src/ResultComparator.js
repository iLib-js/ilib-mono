/*
 * ResultComparator.js - Compare two results to see which should come first
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

/**
 * Compare two Result instances:
 *
 * 1. alphabetically by source file path
 * 2. numerically by line number within the source file
 *
 * @param {Number} -1 if left comes first, 1 if right comes first,
 * and 0 if they are equal
 */
function ResultComparator(left, right) {
    if (left.pathName < right.pathName) {
        return -1;
    } else if (left.pathName > right.pathName) {
        return 1;
    } else if (typeof(left.lineNumber) === 'undefined' && typeof(right.lineNumber) === 'undefined') {
        return 0;
    } else if (typeof(left.lineNumber) === 'undefined') {
        return -1;
    } else if (typeof(right.lineNumber) === 'undefined') {
        return 1;
    } else if (left.lineNumber < right.lineNumber) {
        return -1;
    } else if (left.lineNumber > right.lineNumber) {
        return 1;
    }
    return 0;
};

export default ResultComparator;