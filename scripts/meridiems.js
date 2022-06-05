/*
 * meridiems.js - generate the meridiems information
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

import { setValue } from './common';

export default function genMeridiems(root) {
    // hard code

    let value = "gregorian";
    setValue(root, [], "meridiems", value);
    console.log(`Meridiem: root -> ${value}`);

    value = "ethiopic";
    setValue(root, ["am"], "meridiems", value);
    console.log(`Meridiem: am -> ${value}`);
};
