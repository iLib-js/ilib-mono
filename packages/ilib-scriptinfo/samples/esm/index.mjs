#!/usr/bin/env node

import { readFileSync } from 'fs';
import scriptInfoFactory, { ScriptInfo, ScriptDirection } from 'ilib-scriptinfo';

/**
 * Sample command-line application demonstrating ilib-scriptinfo usage.
 * 
 * Usage: node index.js <script-code>
 * Example: node index.js Latn
 * Example: node index.js Arab
 * Example: node index.js Hani
 */
function showHelp() {
    console.log(`
ilib-scriptinfo Sample App
==========================

A command-line tool that demonstrates the ilib-scriptinfo package by looking up
information about writing scripts based on ISO 15924 codes.

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
• Needs IME: Whether script requires Input Method Editor
• Uses Casing: Whether script uses letter case

COMMON SCRIPT CODES
------------------
Latn - Latin
Arab - Arabic
Hani - Han (Chinese)
Deva - Devanagari
Cyrl - Cyrillic
Grek - Greek
Hebr - Hebrew
Thai - Thai
Hang - Hangul (Korean)
Kana - Katakana
Hira - Hiragana

For a complete list of all available script codes, the tool will show
examples when an unknown script code is provided.

MORE INFORMATION
----------------
This is a sample application demonstrating the ilib-scriptinfo package.
For more information about the package, see the main documentation.
`);
}

/**
 * Find the correct case for a script code by searching through all available codes
 * @param {string} searchCode - The script code to find (case-insensitive)
 * @param {string[]} allScripts - Array of all available script codes
 * @returns {string|null} The correct case version of the script code, or null if not found
 */
function findCorrectCase(searchCode, allScripts) {
    const searchLower = searchCode.toLowerCase();
    for (const code of allScripts) {
        if (code.toLowerCase() === searchLower) {
            return code;
        }
    }
    return null;
}

/**
 * Search for script codes that contain the given search term (case-insensitive)
 * @param {string} searchTerm - The term to search for
 * @param {string[]} allScripts - Array of all available script codes
 * @returns {Array} Array of matching script codes with their names
 */
function searchScriptCodes(searchTerm, allScripts) {
    const matches = [];
    const searchLower = searchTerm.toLowerCase();
    
    for (const code of allScripts) {
        const scriptInfo = scriptInfoFactory(code);
        const name = scriptInfo?.getName();
        
        // Check if the search term matches the code (case-insensitive)
        if (code.toLowerCase().includes(searchLower)) {
            matches.push({ code, name });
        }
        // Also check if the search term matches the script name (case-insensitive)
        else if (name && name.toLowerCase().includes(searchLower)) {
            matches.push({ code, name });
        }
    }
    
    return matches;
}

function main() {
    const args = process.argv.slice(2);
    
    // Show help if no arguments or --help flag
    if (args.length === 0 || args.includes('--help')) {
        showHelp();
        return;
    }
    
    // Check for too many arguments
    if (args.length > 1) {
        console.error('Error: Invalid number of arguments');
        console.error('');
        console.error('Usage: node index.js <script-code>');
        console.error('Example: node index.js Latn');
        console.error('Example: node index.js Arab');
        console.error('Example: node index.js Hani');
        console.error('');
        console.error('For more information, run: node index.js --help');
        process.exit(1);
    }
    
    const inputScriptCode = args[0];
    const allScripts = ScriptInfo.getAllScripts();
    
    // Try to find the correct case for the script code
    const correctCaseCode = findCorrectCase(inputScriptCode, allScripts);
    const scriptCodeToUse = correctCaseCode || inputScriptCode;
    
    // Create a ScriptInfo instance for the script code
    const scriptInfo = scriptInfoFactory(scriptCodeToUse);
    
    // Check if script was recognized
    if (!scriptInfo) {
        console.log(`\n❌ Unknown script code: "${inputScriptCode}"`);
        
        // Search for similar script codes
        const matches = searchScriptCodes(inputScriptCode, allScripts);
        
        if (matches.length > 0) {
            console.log(`🔍 Found ${matches.length} similar script code(s):`);
            matches.forEach(match => {
                console.log(`   ${match.code} - ${match.name}`);
            });
            
            if (matches.length === 1) {
                console.log(`\n💡 Did you mean: ${matches[0].code}?`);
            }
        } else {
            console.log(`💡 No similar script codes found for "${inputScriptCode}"`);
            console.log(`💡 Try one of these valid script codes:`);
            
            // Show some example script codes
            const examples = allScripts.slice(0, 10); // Show first 10 as examples
            examples.forEach(code => {
                const example = scriptInfoFactory(code);
                if (example) {
                    console.log(`   ${code} - ${example.getName()}`);
                }
            });
            
            if (allScripts.length > 10) {
                console.log(`   ... and ${allScripts.length - 10} more scripts`);
            }
        }
        
        console.log('\n');
        return;
    }
    
    // Print header
    console.log(`\nScript Information for "${inputScriptCode}"`);
    console.log('='.repeat(50));
    
    // Get all available properties and their values
    const properties = [
        { name: 'Code', value: scriptCodeToUse },
        { name: 'Code Number', value: scriptInfo.getCodeNumber().toString() },
        { name: 'Name', value: scriptInfo.getName() },
        { name: 'Long Code', value: scriptInfo.getLongCode() }
    ];
    
    // Add emoji+English information to the table for better readability
    // Add direction information with emoji
    const direction = scriptInfo.getScriptDirection();
    const directionEmoji = direction === ScriptDirection.RTL ? '📝 RTL' : '📝 LTR';
    const directionText = direction === ScriptDirection.RTL ? 'Right-to-Left' : 'Left-to-Right';
    properties.push({ name: 'Script Direction', value: `${directionEmoji} ${directionText}` });
    
    // Add IME information with emoji
    if (scriptInfo.getNeedsIME()) {
        properties.push({ name: 'IME Requirement', value: '⌨️  Requires Input Method Editor' });
    } else {
        properties.push({ name: 'IME Requirement', value: '⌨️  No IME required' });
    }
    
    // Add casing information with emoji
    if (scriptInfo.getCasing()) {
        properties.push({ name: 'Casing Info', value: '🔤 Uses letter case (uppercase/lowercase)' });
    } else {
        properties.push({ name: 'Casing Info', value: '🔤 No letter case' });
    }
    
    // Find the maximum length of property names for alignment
    const maxNameLength = Math.max(...properties.map(p => p.name.length));
    
    // Print properties in tabular format
    properties.forEach(property => {
        const paddedName = property.name.padEnd(maxNameLength);
        console.log(`${paddedName} | ${property.value}`);
    });
    
    // Print footer
    console.log('='.repeat(50));
    console.log('\n');
}

// Run the application
if (require.main === module) {
    main();
}
