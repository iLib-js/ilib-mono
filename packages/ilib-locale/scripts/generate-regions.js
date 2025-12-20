#!/usr/bin/env node
/*
 * generate-regions.js - Generate the a2toa3regmap.js file from ISO 3166-1 data
 *
 * Copyright © 2022, 2025 JEDLSoft
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

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use createRequire to import the CommonJS module
const require = createRequire(import.meta.url);
const iso3166 = require('iso-3166-1');

// Build the alpha-2 to alpha-3 mapping
const regMap = {};
iso3166.all().forEach(country => {
    regMap[country.alpha2] = country.alpha3;
});

// Sort the keys alphabetically
const sortedKeys = Object.keys(regMap).sort();
const sortedMap = {};
sortedKeys.forEach(key => {
    sortedMap[key] = regMap[key];
});

// Generate the output file content
const output = `/*
 * a2toa3regmap.js - Map ISO 3166 alpha2 codes to alpha3 codes
 *
 * Copyright © 2022, 2025 JEDLSoft
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

// This file is auto-generated from iso-3166-1 package data
// Do not edit manually. Run "pnpm run generate:regions" to regenerate.

export const a2toa3regmap = {
${sortedKeys.map(key => `    "${key}": "${sortedMap[key]}"`).join(',\n')}
}
`;

// Write the output file
const outputPath = join(__dirname, '../src/a2toa3regmap.js');
writeFileSync(outputPath, output, 'utf8');

console.log(`Generated ${outputPath} with ${sortedKeys.length} region codes.`);

