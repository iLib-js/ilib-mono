/*
 * mergeJson.js - merge JSON files for ilib
 *
 * Copyright © 2026 JEDLSoft
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

import fs from 'fs';
import path from 'path';
import { JSUtils, Utils } from 'ilib-common';
import loadData from './loadData.js';

const reDependentPattern = /require\(\s*["']\.*\/([^"']+\.js)["']\);/g;
const reDataPattern = /\/\/\s*!data\s+([^\n\r]+)/g;

function mergeJson(options) {
    console.log("Merging JSON files...");
    const incPath = options.opt.ilibincPath || "./ilib-all-inc.js";
    const locales = options.opt.locales;

    const jsFileList = [];
    readIncFile(incPath, jsFileList);
    const dependentData = readJSFiles(jsFileList);
    
    checkMjsFiles(dependentData);
    
    return dependentData;
}

function readIncFile(incpath, jsFileList) {
    if (incpath) {
        const info = readFile(incpath);
        info.split('\n').forEach(line => {
            const trimmed = line.trim();
            if (!trimmed) return;
            jsFileList.push(trimmed.endsWith(".js") ? trimmed : trimmed + ".js");
        });
    }
}


function readFile(filepath) {
    if (!filepath) return "";
    try {
        return fs.readFileSync(filepath, "utf-8");
    } catch {
        console.log(`The file [${filepath}] does not exist.`);
        return "";
    }
}

function readJSFiles(jsFileList) {
    const fileCache = new Map();
    const visitedJS = new Set(jsFileList);
    const queue = [...jsFileList];

    while (queue.length > 0) {
        const file = queue.shift();
        const jsPath = path.join(process.cwd(), "js/lib", file);
        const readData = readFile(jsPath);
        if (readData) {
            fileCache.set(file, readData);
            for (const match of readData.matchAll(reDependentPattern)) {
                const dep = match[1];
                if (!visitedJS.has(dep)) {
                    visitedJS.add(dep);
                    queue.push(dep);
                }
            }
        }
    }

    return extractData([...visitedJS], fileCache);
}

function extractData(jsList, fileCache) {
    const dependentData = new Set();
    jsList.forEach(function(file) {
        const readData = fileCache.get(file) || readFile(path.join(process.cwd(), "js/lib", file));
        if (readData) {
            for (const match of readData.matchAll(reDataPattern)) {
                match[1].trim().split(/\s+/).forEach(name => {
                    if (name) dependentData.add(name);
                });
            }
        }
    });
    return [...dependentData];
}

function checkMjsFiles(dependentData) {
    let promise = Promise.resolve();
    dependentData.forEach(name => {
        console.log(`Checking for ${name}.mjs...`);
        const mjsPath = path.join(process.cwd(), "js/assemblefiles", `${name}.mjs`);
        return loadData(`${name}`, {}).then(result => {
            if (result && typeof(result) === 'object') {
                console.log(`Found ${name}.mjs`);
                for(const sublocale in result) {
                    localeData = JSUtils.merge(localeData, data[sublocale], true);
                }
                return true;
            } else {
                console.log(`Missing ${name}.mjs`);
            }
            return result;
        
        });
    });
}

export default mergeJson;