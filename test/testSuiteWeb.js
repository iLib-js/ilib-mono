/*
 * testSuiteWeb.js - test suite for this directory
 *
 * Copyright © 2021-2022, JEDLSoft
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

import { testSearch } from './testsearch.js';
import { testMathUtils } from './testmath.js';
import { testGlobal } from './testglobal.js';
import { testSet } from './testset.js';
import { testPath } from './testpath.js';
import { testUtils } from './testutils.js';
import { testStrings } from './teststrings.js';

export const tests = [
    testSearch,
    testMathUtils,
    testGlobal,
    testSet,
    testPath,
    testUtils,
    testStrings
];