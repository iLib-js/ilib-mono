#!/usr/bin/env node

var fs = require('fs');
var scriptInfoFactory = require('ilib-scriptinfo').scriptInfoFactory;
var ScriptInfo = require('ilib-scriptinfo').ScriptInfo;
var ScriptDirection = require('ilib-scriptinfo').ScriptDirection;

/**
 * Sample command-line application demonstrating ilib-scriptinfo usage with CommonJS.
 * 
 * Usage: node index.js <script-code>
 * Example: node index.js Latn
 * Example: node index.js Arab
 * Example: node index.js Hani
 */
function showHelp() {
    console.log(
        '\n' +
        'ilib-scriptinfo Legacy Sample App\n' +
        '=================================\n' +
        '\n' +
        'A command-line tool that demonstrates the ilib-scriptinfo package by looking up\n' +
        'information about writing scripts based on ISO 15924 codes.\n' +
        '\n' +
        'This sample uses CommonJS (require) and ES5 syntax for maximum compatibility\n' +
        'with older Node.js versions.\n' +
        '\n' +
        'USAGE\n' +
        '-----\n' +
        'node index.js <script-code>\n' +
        'node index.js --help\n' +
        '\n' +
        'PARAMETERS\n' +
        '----------\n' +
        '<script-code>    ISO 15924 4-letter script code (e.g., Latn, Arab, Hani)\n' +
        '\n' +
        'OPTIONS\n' +
        '-------\n' +
        '--help           Show this help message\n' +
        '\n' +
        'EXAMPLES\n' +
        '--------\n' +
        'node index.js Latn          # Look up Latin script information\n' +
        'node index.js Arab          # Look up Arabic script information\n' +
        'node index.js Hani          # Look up Han (Chinese) script information\n' +
        'node index.js Deva          # Look up Devanagari script information\n' +
        'node index.js Cyrl          # Look up Cyrillic script information\n' +
        '\n' +
        'OUTPUT\n' +
        '------\n' +
        'The tool displays all available script properties in a tabular format:\n' +
        '• Code: ISO 15924 4-letter script code\n' +
        '• Code Number: ISO 15924 numeric code\n' +
        '• Name: English name of the script\n' +
        '• Long Code: Long identifier for the script\n' +
        '• Script Direction: Writing direction (ltr/rtl)\n' +
        '• Needs IME: Whether script requires Input Method Editor\n' +
        '• Uses Casing: Whether script uses letter case\n' +
        '\n' +
        'COMMON SCRIPT CODES\n' +
        '------------------\n' +
        'Latn - Latin\n' +
        'Arab - Arabic\n' +
        'Hani - Han (Chinese)\n' +
        'Deva - Devanagari\n' +
        'Cyrl - Cyrillic\n' +
        'Grek - Greek\n' +
        'Hebr - Hebrew\n' +
        'Thai - Thai\n' +
        'Hang - Hangul (Korean)\n' +
        'Kana - Katakana\n' +
        'Hira - Hiragana\n' +
        '\n' +
        'For a complete list of all available script codes, the tool will show\n' +
        'examples when an unknown script code is provided.\n' +
        '\n' +
        'MORE INFORMATION\n' +
        '----------------\n' +
        'This is a legacy sample application demonstrating the ilib-scriptinfo package\n' +
        'using CommonJS and ES5 for maximum compatibility with older Node.js versions.\n' +
        'For the modern ES module version, see samples/esm/.\n'
    );
}

/**
 * Find the correct case for a script code by searching through all available codes
 * @param {string} searchCode - The script code to find (case-insensitive)
 * @param {string[]} allScripts - Array of all available script codes
 * @returns {string|null} The correct case version of the script code, or null if not found
 */
function findCorrectCase(searchCode, allScripts) {
    var searchLower = searchCode.toLowerCase();
    for (var i = 0; i < allScripts.length; i++) {
        var code = allScripts[i];
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
    var matches = [];
    var searchLower = searchTerm.toLowerCase();
    
    for (var i = 0; i < allScripts.length; i++) {
        var code = allScripts[i];
        var scriptInfo = scriptInfoFactory(code);
        var name = scriptInfo ? scriptInfo.getName() : null;
        
        // Check if the search term matches the code (case-insensitive)
        if (code.toLowerCase().indexOf(searchLower) !== -1) {
            matches.push({ code: code, name: name });
        }
        // Also check if the search term matches the script name (case-insensitive)
        else if (name && name.toLowerCase().indexOf(searchLower) !== -1) {
            matches.push({ code: code, name: name });
        }
    }
    
    return matches;
}

var args = process.argv.slice(2);

// Show help if no arguments or --help flag
if (args.length === 0 || args.indexOf('--help') !== -1) {
    showHelp();
    process.exit(0);
}

// Check for too many arguments
if (args.length > 1) {
    console.error('Error: Invalid number of arguments');
    console.error('');
    console.error('Usage: node index.js <script-code>');
    console.error('Example: node index.js Latn');
    console.error('');
    console.error('For more information, run: node index.js --help');
    process.exit(1);
}

var inputScriptCode = args[0];
var allScripts = ScriptInfo.getAllScripts();

// Try to find the correct case for the script code
var correctCaseCode = findCorrectCase(inputScriptCode, allScripts);
var scriptCodeToUse = correctCaseCode || inputScriptCode;

// Create a ScriptInfo instance for the script code
var scriptInfo = scriptInfoFactory(scriptCodeToUse);

// Check if script was recognized
if (!scriptInfo) {
    console.log('\n❌ Unknown script code: "' + inputScriptCode + '"');
    
    // Search for similar script codes
    var matches = searchScriptCodes(inputScriptCode, allScripts);
    
    if (matches.length > 0) {
        console.log('🔍 Found ' + matches.length + ' similar script code(s):');
        for (var i = 0; i < matches.length; i++) {
            var match = matches[i];
            console.log('   ' + match.code + ' - ' + match.name);
        }
        
        if (matches.length === 1) {
            console.log('\n💡 Did you mean: ' + matches[0].code + '?');
        }
    } else {
        console.log('💡 No similar script codes found for "' + inputScriptCode + '"');
        console.log('💡 Try one of these valid script codes:');
        
        // Show some example script codes
        var examples = allScripts.slice(0, 10); // Show first 10 as examples
        for (var i = 0; i < examples.length; i++) {
            var code = examples[i];
            var example = scriptInfoFactory(code);
            if (example) {
                console.log('   ' + code + ' - ' + example.getName());
            }
        }
        
        if (allScripts.length > 10) {
            console.log('   ... and ' + (allScripts.length - 10) + ' more scripts');
        }
    }
    
    console.log('\n');
    process.exit(0);
}

// Print header
console.log('\nScript Information for "' + inputScriptCode + '"');
console.log('='.repeat(50));

// Get all available properties and their values
var properties = [
    { name: 'Code', value: scriptCodeToUse },
    { name: 'Code Number', value: scriptInfo.getCodeNumber().toString() },
    { name: 'Name', value: scriptInfo.getName() },
    { name: 'Long Code', value: scriptInfo.getLongCode() }
];

// Add emoji+English information to the table for better readability
// Add direction information with emoji
var direction = scriptInfo.getScriptDirection();
var directionEmoji = direction === ScriptDirection.RTL ? '📝 RTL' : '📝 LTR';
var directionText = direction === ScriptDirection.RTL ? 'Right-to-Left' : 'Left-to-Right';
properties.push({ name: 'Script Direction', value: directionEmoji + ' ' + directionText });

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
var maxNameLength = 0;
for (var i = 0; i < properties.length; i++) {
    var prop = properties[i];
    if (prop.name.length > maxNameLength) {
        maxNameLength = prop.name.length;
    }
}

// Print properties in tabular format
for (var i = 0; i < properties.length; i++) {
    var property = properties[i];
    var paddedName = property.name;
    while (paddedName.length < maxNameLength) {
        paddedName += ' ';
    }
    console.log(paddedName + ' | ' + property.value);
}

// Print footer
console.log('='.repeat(50));
console.log('\n');
