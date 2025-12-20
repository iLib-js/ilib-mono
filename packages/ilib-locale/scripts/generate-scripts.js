#!/usr/bin/env node
/*
 * generate-scripts.js - Generate the scripts.js file from the UCD data
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

// Read the ScriptInfo.json from ucd-full
const scriptInfoPath = join(__dirname, '../node_modules/ucd-full/ScriptInfo.json');
const scriptInfo = JSON.parse(readFileSync(scriptInfoPath, 'utf8'));

// Extract just the script codes and sort them alphabetically
const scriptCodes = scriptInfo.iso15924
    .map(script => script.code)
    .sort();

// Generate the output file content
const output = `/*
 * scripts.js - List out the ISO 15924 script codes
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

// This file is auto-generated from ucd-full ScriptInfo.json
// Do not edit manually. Run "pnpm run generate:scripts" to regenerate.

export const iso15924 = {
    "scripts": [
${scriptCodes.map(code => `        "${code}"`).join(',\n')}
    ]
}`;

// Write the output file
const outputPath = join(__dirname, '../src/scripts.js');
writeFileSync(outputPath, output, 'utf8');

console.log(`Generated ${outputPath} with ${scriptCodes.length} script codes.`);

