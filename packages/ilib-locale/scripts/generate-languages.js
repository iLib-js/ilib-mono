#!/usr/bin/env node
/*
 * generate-languages.js - Generate the a1toa3langmap.js file from ISO 639 data
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

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the codes.json from @cospired/i18n-iso-languages
// Format: [alpha1, alpha3-T, alpha3-B, ref]
const codesPath = join(__dirname, '../node_modules/@cospired/i18n-iso-languages/codes.json');
const codes = JSON.parse(readFileSync(codesPath, 'utf8'));

// Build the alpha-1 to alpha-3 mapping using the terminological (alpha3-T) code
const langMap = {};
codes.forEach(entry => {
    const alpha1 = entry[0];
    const alpha3T = entry[1]; // ISO 639-2/T (terminological)
    langMap[alpha1] = alpha3T;
});

// Sort the keys alphabetically
const sortedKeys = Object.keys(langMap).sort();
const sortedMap = {};
sortedKeys.forEach(key => {
    sortedMap[key] = langMap[key];
});

// Generate the output file content
const output = `/*
 * a1toa3langmap.js - Map ISO 639 alpha2 codes to alpha3 codes
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

// This file is auto-generated from @cospired/i18n-iso-languages codes.json
// Do not edit manually. Run "pnpm run generate:languages" to regenerate.

export const a1toa3langmap = {
${sortedKeys.map(key => `    "${key}": "${sortedMap[key]}"`).join(',\n')}
};
`;

// Write the output file
const outputPath = join(__dirname, '../src/a1toa3langmap.js');
writeFileSync(outputPath, output, 'utf8');

console.log(`Generated ${outputPath} with ${sortedKeys.length} language codes.`);

