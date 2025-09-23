/**
 * Utility functions for the TypeScript sample
 *
 * Copyright © 2025, Box, Inc.
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
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { scriptInfoFactory, ScriptInfo } from 'ilib-scriptinfo';

/**
 * Find the correct case version of a script code
 * @param searchCode - The script code to search for
 * @param allScripts - Array of all available script codes
 * @returns The correct case version of the script code, or null if not found
 */
export function findCorrectCase(searchCode: string, allScripts: string[]): string | null {
    const searchLower: string = searchCode.toLowerCase();
    for (const code of allScripts) {
        if (code.toLowerCase() === searchLower) {
            return code;
        }
    }
    return null;
}

/**
 * Search for script codes that match the given term
 * @param searchTerm - The term to search for
 * @param allScripts - Array of all available script codes
 * @returns Array of matching script codes with their names
 */
export function searchScriptCodes(searchTerm: string, allScripts: string[]): Array<{code: string, name: string}> {
    const matches: Array<{code: string, name: string}> = [];
    const searchLower: string = searchTerm.toLowerCase();

    for (const code of allScripts) {
        const scriptInfo: ScriptInfo | undefined = scriptInfoFactory(code);
        const name: string | undefined = scriptInfo?.getName();

        // Check if the search term matches the code (case-insensitive)
        if (code.toLowerCase().includes(searchLower)) {
            matches.push({ code, name: name || code });
        }
        // Also check if the search term matches the script name (case-insensitive)
        else if (name && name.toLowerCase().includes(searchLower)) {
            matches.push({ code, name });
        }
    }

    return matches;
}

/**
 * Show help information
 */
export function showHelp(): void {
    console.log(`
ilib-scriptinfo TypeScript Sample App
====================================

A command-line tool that demonstrates the ilib-scriptinfo package with full
TypeScript type safety and IntelliSense support. Shows information about writing
scripts based on ISO 15924 codes.

USAGE
-----
tsx index.ts <script-code>
tsx index.ts --help

PARAMETERS
----------
<script-code>    ISO 15924 4-letter script code (e.g., Latn, Arab, Hani)

OPTIONS
-------
--help           Show this help message

EXAMPLES
--------
tsx index.ts Latn          # Look up Latin script information
tsx index.ts Arab          # Look up Arabic script information
tsx index.ts Hani          # Look up Han (Chinese) script information
tsx index.ts Deva          # Look up Devanagari script information
tsx index.ts Cyrl          # Look up Cyrillic script information

OUTPUT
------
The tool displays all available script properties in a tabular format:
• Code: ISO 15924 4-letter script code
• Code Number: ISO 15924 numeric code
• Name: English name of the script
• Long Code: Long identifier for the script
• Script Direction: Writing direction (ltr/rtl)
• IME Requirement: Whether input method editor is needed
• Casing Info: Whether script uses letter case

TYPESCRIPT FEATURES
------------------
• Full type safety with TypeScript declarations
• IntelliSense support for all methods and properties
• Compile-time error checking
• Type annotations for better code documentation
• Enum type safety for ScriptDirection values

For more information, visit: https://github.com/ilib-js/ilib-scriptinfo
`);
}
