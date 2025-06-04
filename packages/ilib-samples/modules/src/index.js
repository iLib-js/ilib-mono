/*
 * index.js - demonstrate the es6 modules based ilib packages
 * 
 * Copyright © 2022, JEDLSoft
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

import LocaleInfo from 'ilib-localeinfo';

if (process.argv.length < 2) {
    console.log("Usage: index.mjs locale-spec");
}

const locale = process.argv[2];

const li = new LocaleInfo(locale);

console.log(`Locale information for locale ${locale}`);
console.log(JSON.stringify(li, undefined, 4));
