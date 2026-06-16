/**
 * assemble.mjs - Custom assemble file for demo purposes
 *
 * This file demonstrates how to use the --assemble flag with ilib-assemble
 * to directly include custom locale data without creating a full ilib package.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, basename, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSUtils, Utils } from 'ilib-common';
import JSON5 from 'json5';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, 'data');

/**
 * Recursively find all JSON files in a directory.
 */
function findJsonFiles(dir, fileList = []) {
    if (!existsSync(dir)) return fileList;
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
 *   "mydata.json" -> "root"
 *   "en/mydata.json" -> "en"
 *   "en/US/mydata.json" -> "en-US"
 */
function pathToLocaleSpec(relPath) {
    const parts = relPath.split('/');
    parts.pop(); // Remove filename
    if (parts.length === 0) {
        return 'root';
    }
    return parts.join('-');
}

/**
 * Read all locale data from the data directory into a map keyed by sublocale.
 * @returns {Object} Map of sublocale -> basename -> data
 */
function readAllLocaleData() {
    const allData = {};
    const jsonFiles = findJsonFiles(dataDir);

    for (const filePath of jsonFiles) {
        const relPath = relative(dataDir, filePath);
        const localeSpec = pathToLocaleSpec(relPath);
        const baseName = basename(filePath, '.json');

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
            console.log(`    Warning: Could not parse ${filePath}: ${e.message}`);
        }
    }

    return allData;
}

/**
 * Assemble locale data from the data directory.
 *
 * ilib-assemble expects data in this format:
 * {
 *   "<requested-locale>": {
 *     "<sublocale>": {
 *       "<basename>": { ... data ... }
 *     }
 *   }
 * }
 */
function assemble(options) {
    if (!options || !options.locales) {
        return Promise.resolve(undefined);
    }

    // Read all data from the data directory
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
