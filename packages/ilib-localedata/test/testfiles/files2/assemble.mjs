/**
 * assemble.mjs - Assemble test locale data from this directory
 *
 * This file is used by ilib-assemble with the --assemble flag to
 * directly include test locale data files into the assembled output.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, basename, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSUtils, Utils } from 'ilib-common';
import JSON5 from 'json5';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Recursively find all JSON files in a directory.
 * @param {string} dir - The directory to search
 * @param {string[]} fileList - Accumulator for found files
 * @returns {string[]} Array of file paths
 */
function findJsonFiles(dir, fileList = []) {
    const entries = readdirSync(dir);
    for (const entry of entries) {
        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
            findJsonFiles(fullPath, fileList);
        } else if (entry.endsWith('.json')) {
            fileList.push(fullPath);
        }
    }
    return fileList;
}

/**
 * Convert a relative path to a locale spec.
 * Examples:
 *   "tester.json" -> "root"
 *   "en/tester.json" -> "en"
 *   "en/US/tester.json" -> "en-US"
 *   "ja/JP/tester.json" -> "ja-JP"
 *
 * @param {string} relPath - Relative path from the base directory
 * @returns {string} The locale spec
 */
function pathToLocaleSpec(relPath) {
    const parts = relPath.split('/');
    // Remove the filename
    parts.pop();

    if (parts.length === 0) {
        return 'root';
    }

    // Join the parts with hyphen to form locale spec
    return parts.join('-');
}

/**
 * Read all locale data from this directory into a map keyed by sublocale.
 * @returns {Object} Map of sublocale -> basename -> data
 */
function readAllLocaleData() {
    const allData = {};
    const jsonFiles = findJsonFiles(__dirname);

    for (const filePath of jsonFiles) {
        const relPath = relative(__dirname, filePath);
        const localeSpec = pathToLocaleSpec(relPath);
        const baseName = basename(filePath, '.json');

        // Skip special files that aren't locale data
        if (baseName === 'assemble') {
            continue;
        }

        try {
            const content = readFileSync(filePath, 'utf-8');
            const data = JSON5.parse(content);

            if (!allData[localeSpec]) {
                allData[localeSpec] = {};
            }

            allData[localeSpec][baseName] = JSUtils.merge(
                allData[localeSpec][baseName] || {},
                data
            );
        } catch (e) {
            // Skip files that can't be parsed (like intentionally invalid JSON)
            console.log(`    Warning: Could not parse ${filePath}: ${e.message}`);
        }
    }

    return allData;
}

/**
 * Assemble locale data from this directory.
 *
 * ilib-assemble expects data in this format:
 * {
 *   "<requested-locale>": {
 *     "<sublocale>": {
 *       "<basename>": { ... data ... }
 *     }
 *   }
 * }
 *
 * @param {Object} options - Options object containing:
 *   - locales: Array of locale specs to include
 * @returns {Promise<Object>} Locale data in the format above
 */
function assemble(options) {
    if (!options || !options.locales) {
        return Promise.resolve(undefined);
    }

    // Read all data from this directory
    const allData = readAllLocaleData();

    // Build the result in the format ilib-assemble expects
    const result = {};

    for (const requestedLocale of options.locales) {
        const sublocales = Utils.getSublocales(requestedLocale);
        const localeResult = {};

        for (const sublocale of sublocales) {
            if (allData[sublocale]) {
                localeResult[sublocale] = allData[sublocale];
            }
        }

        if (Object.keys(localeResult).length > 0) {
            result[requestedLocale] = localeResult;
        }
    }

    return Promise.resolve(result);
}

export default assemble;
