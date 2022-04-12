/*
 * locinfo.js - the overall loc info generator
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

import stringify from 'json-stable-stringify';

import genClock from './clock';
import genCurrencies from './currencies';
import genDelimiters from './delimiters';

let root = {};

genClock(root);
genCurrencies(root);
genDelimiters(root);

console.log("root is:\n" + stringify(root, {space: 4}));