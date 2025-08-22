#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const libPath = join(__dirname, '..', 'lib');

// Function to fix imports in a single file
function fixImportsInFile(filePath) {
    let content = readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    // Replace all relative imports to add .js extensions
    // This regex matches patterns like:
    // from './ModuleName'
    // from "./ModuleName"  
    // from './subdir/ModuleName'
    // from "./subdir/ModuleName"
    // import './ModuleName'
    // import "./ModuleName"
    // import './subdir/ModuleName'
    // import "./subdir/ModuleName"
    
    const importPattern = /(from\s+['"]\.\/[^'"]+)(['"])/g;
    content = content.replace(importPattern, (match, importPath, quote) => {
        // Check if the import path already has a file extension
        if (!importPath.match(/\.[a-zA-Z0-9]+$/)) {
            hasChanges = true;
            console.log(`  Fixed: ${match} → ${importPath}.js${quote}`);
            return `${importPath}.js${quote}`;
        }
        return match;
    });
    
    // Also handle direct import statements (import './module')
    const directImportPattern = /(import\s+['"]\.\/[^'"]+)(['"])/g;
    content = content.replace(directImportPattern, (match, importPath, quote) => {
        // Check if the import path already has a file extension
        if (!importPath.match(/\.[a-zA-Z0-9]+$/)) {
            hasChanges = true;
            console.log(`  Fixed: ${match} → ${importPath}.js${quote}`);
            return `${importPath}.js${quote}`;
        }
        return match;
    });
    
    // Write the fixed content back only if there were changes
    if (hasChanges) {
        writeFileSync(filePath, content, 'utf8');
        return true;
    }
    return false;
}

// Fix imports in all .js files in the lib directory
const files = readdirSync(libPath).filter(file => file.endsWith('.js'));
let fixedFiles = 0;

files.forEach(file => {
    const filePath = join(libPath, file);
    if (fixImportsInFile(filePath)) {
        fixedFiles++;
    }
});

console.log(`✅ Fixed relative imports in ${fixedFiles} of ${files.length} compiled JavaScript files`);
