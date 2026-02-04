#!/usr/bin/env node
/*
 * generate-scripts.js - Generate the scripts.js file from the UCD data
 *
 * Copyright © 2022, 2025-2026 JEDLSoft
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

// Extract just the ISO 15924 script codes and sort them alphabetically
const scriptCodes = scriptInfo.iso15924
    .map(script => script.code)
    .sort();

// Build mapping from script name in English to ISO 15924 code
// for use in parsing POSIX locale modifiers which are in English.
const scriptNameToCode = {};

/**
 * Convert accented characters to their ASCII base equivalents.
 * Uses Unicode NFD normalization to decompose characters, then removes combining marks.
 * @param {string} str - The string to convert
 * @returns {string} - The string with accented characters replaced by ASCII equivalents
 */
function toAscii(str) {
    // NFD decomposes characters like "é" into "e" + combining acute accent
    // Then we remove the combining marks (Unicode category Mn - Mark, Nonspacing)
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Check if a string contains only valid POSIX locale modifier characters.
 * POSIX modifiers only allow alphanumeric characters (no underscores or hyphens).
 * @param {string} str - The string to check
 * @returns {boolean} - True if the string is valid for a POSIX modifier
 */
function isValidPosixModifier(str) {
    return /^[a-z0-9]+$/.test(str);
}

/**
 * Normalize a script name for use as a POSIX locale modifier key.
 * A script name from a POSIX locale modifier is usually in plain English,
 * but may contain accents or other non-ASCII characters. We need to normalize
 * the name to a ASCII-only lowercase string that can be used as a key in the
 * mapping.
 * This function does the following:
 * - Convert accented characters to ASCII
 * - Lowercase
 * - Remove spaces (POSIX modifiers can't contain spaces or underscores)
 * - Filter out names that contain invalid POSIX modifier characters
 * @param {string} name - The script name to normalize
 * @returns {string[]} - Array containing the normalized name, or empty if invalid
 */
function normalizeScriptName(name) {
    const trimmed = name.trim();
    const ascii = toAscii(trimmed);
    const lower = ascii.toLowerCase();
    const noSpaces = lower.replace(/\s+/g, '');

    // Filter out entries that contain invalid POSIX modifier characters
    // (e.g., parentheses, hyphens, IPA symbols, superscript numbers, special quotes)
    if (!isValidPosixModifier(noSpaces)) {
        return [];
    }

    return [noSpaces];
}

/**
 * Check if a parenthetical should be excluded (variants, aliases for combinations)
 * @param {string} paren - The content inside parentheses
 * @returns {boolean} - True if this entry should be excluded
 */
function shouldExcludeParenthetical(paren) {
    const lower = paren.toLowerCase();
    return lower.includes('variant') || lower.includes('alias for');
}

/**
 * Extract script names from an englishName field. 
 * The englishName field may contain parenthetical content which should be
 * excluded from the mapping. Parenthetical content may contain comma-separated
 * aliases for combinations of scripts. We need to extract the main script name
 * and the aliases and add them to the mapping.
 * Example: "Latin (Latin Extended-A, Latin Extended-B)"
 * would add "latin" and "latin extended-a" and "latin extended-b" to the mapping.
 * 
 * @param {string} englishName - The englishName from UCD
 * @param {string} code - The ISO 15924 script code
 */
function extractScriptNames(englishName, code) {
    // Check for parenthetical content
    const parenMatch = englishName.match(/^(.+?)\s*\((.+)\)$/);

    if (parenMatch) {
        const mainPart = parenMatch[1];
        const parenContent = parenMatch[2];

        // Skip entries with "variant" or "alias for" in parentheses
        if (shouldExcludeParenthetical(parenContent)) {
            return;
        }

        // Add main part
        for (const normalized of normalizeScriptName(mainPart)) {
            scriptNameToCode[normalized] = code;
        }

        // Parse parenthetical content - may contain comma-separated aliases
        const aliases = parenContent.split(/,\s*/);
        for (const alias of aliases) {
            // Skip if alias contains excluded words
            if (!shouldExcludeParenthetical(alias)) {
                for (const normalized of normalizeScriptName(alias)) {
                    scriptNameToCode[normalized] = code;
                }
            }
        }
    } else {
        // No parentheses - check for comma-separated names
        const parts = englishName.split(/,\s*/);
        for (const part of parts) {
            for (const normalized of normalizeScriptName(part)) {
                scriptNameToCode[normalized] = code;
            }
        }
    }
}

// Process each script entry
for (const script of scriptInfo.iso15924) {
    if (script.englishName) {
        extractScriptNames(script.englishName, script.code);
    }
}

// Sort the mapping keys for consistent output
const sortedKeys = Object.keys(scriptNameToCode).sort();

// Generate the output file content
const output = `/*
 * scripts.js - List out the ISO 15924 script codes and name mappings
 *
 * Copyright © 2022, 2025-2026 JEDLSoft
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
};

/**
 * Mapping from lowercase script names (as used in POSIX locale modifiers)
 * to ISO 15924 script codes.
 */
export const scriptNameToCode = {
${sortedKeys.map(key => `    "${key}": "${scriptNameToCode[key]}"`).join(',\n')}
};
`;

// Write the output file
const outputPath = join(__dirname, '../src/scripts.js');
writeFileSync(outputPath, output, 'utf8');

console.log(`Generated ${outputPath} with ${scriptCodes.length} script codes and ${sortedKeys.length} name mappings.`);

