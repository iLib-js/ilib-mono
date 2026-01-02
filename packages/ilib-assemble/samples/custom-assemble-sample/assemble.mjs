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
 * Assemble locale data from the data directory.
 */
function assemble(options) {
    const localeData = {};

    if (!options || !options.locales) {
        return Promise.resolve(undefined);
    }

    // Get all sublocales for the requested locales
    const sublocalesSet = new Set();
    options.locales.forEach(locale => {
        const sublocales = Utils.getSublocales(locale);
        sublocales.forEach(sub => sublocalesSet.add(sub));
    });

    // Find all JSON files in data directory
    const jsonFiles = findJsonFiles(dataDir);

    for (const filePath of jsonFiles) {
        const relPath = relative(dataDir, filePath);
        const localeSpec = pathToLocaleSpec(relPath);
        const baseName = basename(filePath, '.json');

        // Only include data for requested locales/sublocales
        if (!sublocalesSet.has(localeSpec)) {
            continue;
        }

        try {
            const content = readFileSync(filePath, 'utf-8');
            const data = JSON5.parse(content);

            if (!localeData[localeSpec]) {
                localeData[localeSpec] = {};
            }

            localeData[localeSpec][baseName] = JSUtils.merge(
                localeData[localeSpec][baseName] || {},
                data
            );
        } catch (e) {
            console.log(`    Warning: Could not parse ${filePath}: ${e.message}`);
        }
    }

    return Promise.resolve(localeData);
}

export default assemble;

