#!/usr/bin/env node

/**
 * TypeScript sample command-line application demonstrating ilib-scriptinfo usage.
 * 
 * Usage: tsx index.ts <script-code>
 * Example: tsx index.ts Latn
 * Example: tsx index.ts Arab
 * Example: tsx index.ts Hani
 * 
 * This sample demonstrates full TypeScript type safety and IntelliSense support.
 */

import { scriptInfoFactory, ScriptInfo, ScriptDirection } from 'ilib-scriptinfo';

/**
 * Show help information
 */
function showHelp(): void {
    console.log(`
ilib-scriptinfo TypeScript Sample App
====================================

A command-line tool that demonstrates the ilib-scriptinfo package with full
TypeScript type safety and IntelliSense support. Shows information about writing
scripts based on ISO 15924 codes.

USAGE
-----
node index.js <script-code>
node index.js --help

PARAMETERS
----------
<script-code>    ISO 15924 4-letter script code (e.g., Latn, Arab, Hani)

OPTIONS
-------
--help           Show this help message

EXAMPLES
--------
node index.js Latn          # Look up Latin script information
node index.js Arab          # Look up Arabic script information
node index.js Hani          # Look up Han (Chinese) script information
node index.js Deva          # Look up Devanagari script information
node index.js Cyrl          # Look up Cyrillic script information

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

/**
 * Find the correct case version of a script code
 * @param searchCode - The script code to search for
 * @param allScripts - Array of all available script codes
 * @returns The correct case version of the script code, or null if not found
 */
function findCorrectCase(searchCode: string, allScripts: string[]): string | null {
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
function searchScriptCodes(searchTerm: string, allScripts: string[]): Array<{code: string, name: string}> {
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
 * Display script information with full type safety
 * @param scriptCode - The 4-letter ISO 15924 script code
 */
function displayScriptInfo(scriptCode: string): void {
    console.log(`\nScript Information for "${scriptCode}"`);
    console.log("=".repeat(50));
    
    // Type-safe static method call to get all scripts
    const allScripts: string[] = ScriptInfo.getAllScripts();
    
    // First try exact match
    let script: ScriptInfo | undefined = scriptInfoFactory(scriptCode);
    
    // If not found, try case correction
    if (!script) {
        const correctCase: string | null = findCorrectCase(scriptCode, allScripts);
        if (correctCase) {
            script = scriptInfoFactory(correctCase);
        }
    }
    
    if (!script) {
        console.log(`❌ Unknown script code: "${scriptCode}"`);
        
        // Search for similar script codes
        const similarScripts: Array<{code: string, name: string}> = searchScriptCodes(scriptCode, allScripts);
        
        if (similarScripts.length > 0) {
            console.log(`🔍 Found ${similarScripts.length} similar script code(s):`);
            similarScripts.slice(0, 5).forEach(s => {
                console.log(`   ${s.code} - ${s.name}`);
            });
        } else {
            console.log("💡 No similar script codes found");
        }
        
        console.log("\n💡 Try one of these valid script codes:");
        const commonScripts: string[] = ['Latn', 'Arab', 'Hani', 'Cyrl', 'Deva'];
        commonScripts.forEach(s => {
            const sInfo: ScriptInfo | undefined = scriptInfoFactory(s);
            if (sInfo) {
                console.log(`   ${s} - ${sInfo.getName()}`);
            }
        });
        return;
    }
    
    // All method calls are fully typed with IntelliSense support
    const direction: ScriptDirection = script.getScriptDirection();
    const directionEmoji: string = direction === ScriptDirection.LTR ? "📝 LTR Left-to-Right" : "📝 RTL Right-to-Left";
    const imeEmoji: string = script.getNeedsIME() ? "⌨️  IME required" : "⌨️  No IME required";
    const casingEmoji: string = script.getCasing() ? "🔤 Uses letter case" : "🔤 No letter case";
    
    console.log(`Code             | ${script.getCode()}`);
    console.log(`Code Number      | ${script.getCodeNumber()}`);
    console.log(`Name             | ${script.getName()}`);
    console.log(`Long Code        | ${script.getLongCode()}`);
    console.log(`Script Direction | ${directionEmoji}`);
    console.log(`IME Requirement  | ${imeEmoji}`);
    console.log(`Casing Info      | ${casingEmoji}`);
    }

const args: string[] = process.argv.slice(2);

// Type-safe argument handling
if (args.length === 0) {
    showHelp();
    process.exit(0);
}

if (args.length > 1) {
    console.error("Error: Invalid number of arguments");
    console.error("Usage: node index.js <script-code>");
    console.error("Example: node index.js Latn");
    process.exit(1);
}

const scriptCode: string = args[0];

if (scriptCode === "--help" || scriptCode === "-h") {
    showHelp();
    process.exit(0);
}

// Display script information with full type safety
displayScriptInfo(scriptCode);
