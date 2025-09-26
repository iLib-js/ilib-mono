#!/usr/bin/env node

/**
 * TypeScript sample for ilib-scriptinfo
 *
 * This sample demonstrates how to use the ilib-scriptinfo library with full TypeScript support.
 * It shows the core functionality: creating script info instances and accessing script properties.
 */

import { scriptInfoFactory, ScriptInfo, ScriptDirection } from 'ilib-scriptinfo';
import { findCorrectCase, searchScriptCodes, showHelp } from './utils.js';

/**
 * Display script information - this is the main library usage demonstration
 * @param scriptCode - The 4-letter ISO 15924 script code
 */
function displayScriptInfo(scriptCode: string): void {
    console.log(`\nScript Information for "${scriptCode}"`);
    console.log("=".repeat(50));

    // Get all available scripts (static method usage)
    const allScripts: string[] = ScriptInfo.getAllScripts();

    // Try to get script info (factory function usage)
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
                console.log(`   ${s} - ${sInfo.name}`);
            }
        });
        return;
    }

    // Display script properties (instance property usage)
    const direction: ScriptDirection = script.scriptDirection;
    const directionEmoji: string = direction === ScriptDirection.LTR ? "📝 LTR Left-to-Right" : "📝 RTL Right-to-Left";
    const imeEmoji: string = script.needsIME ? "⌨️  IME required" : "⌨️  No IME required";
    const casingEmoji: string = script.casing ? "🔤 Uses letter case" : "🔤 No letter case";

    console.log(`Code             | ${script.code}`);
    console.log(`Code Number      | ${script.codeNumber}`);
    console.log(`Name             | ${script.name}`);
    console.log(`Long Code        | ${script.longCode}`);
    console.log(`Script Direction | ${directionEmoji}`);
    console.log(`IME Requirement  | ${imeEmoji}`);
    console.log(`Casing Info      | ${casingEmoji}`);
}

/**
 * Main function
 */
function main(): void {
    const args: string[] = process.argv.slice(2);

    if (args.length === 0) {
        showHelp();
        return;
    }

    if (args.length > 1) {
        console.error("Error: Invalid number of arguments");
        console.error("Usage: tsx index.ts <script-code>");
        console.error("Example: tsx index.ts Latn");
        process.exit(1);
    }

    const scriptCode: string = args[0];

    if (scriptCode === "--help" || scriptCode === "-h") {
        showHelp();
        return;
    }

    // This is the main library usage demonstration
    displayScriptInfo(scriptCode);
}

// Run the main function
main();