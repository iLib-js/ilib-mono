#!/usr/bin/env node
/*
 * legacyilibassemble.js - assemble of legacy style of ilib files.
 *
 * Copyright © 2024 JEDLSoft
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
import Locale from 'ilib-locale';

let ilibPath;
let ilibincPath;
let outDir;
let locales;
let jsFileList = [];
let allJSList = [];

const dependentsPatterns  = /require\(\s*(\"|\').*\/(.*.js)(\"|]')\)\;/g;
const reDependentPattern = new RegExp(/require\(\s*(\"|\').*\/(.*.js)(\"|]')\)\;$/, "g");
const reDataPattern = new RegExp(/\/\/\s*\!data\s*(.*)$/, "g");

function assembleilib(options) {
    console.log(options);
    ilibPath = options.opt.ilibPath;
    ilibincPath = options.opt.ilibincPath;
    locales = options.opt.locales;
    outDir = options.args[0];
    readIncFile(options.opt.ilibincPath);
    readJSFiles();
}

function readIncFile(incpath) {
    const info = fs.readFileSync(incpath, 'utf8');
    const lines = info.split('\n');
    lines.forEach(line => {
        if (line.indexOf('js') != -1) {
            jsFileList.push(line);
        }
    });
}
//node --inspect-brk src/index.js result --legacyilib --ilibPath ~/Source/develop/ --ilibincPath src/ilib-assemble-inc.js 
let extractjs = [];
let extractdata = [];
function readJSFiles() {
    let readData;
    let matchesJS;
    let matchesData;
    jsFileList.forEach(function(file){
        let jsPath = path.join(ilibPath, 'js/lib', file);
        if (fs.existsSync(jsPath)){
            readData = fs.readFileSync(jsPath, 'utf-8');

            matchesJS = [...readData.matchAll(reDependentPattern)];
            if (matchesJS.length > 0){
                matchesJS.forEach(function(item){
                    if (!extractjs.includes(item[2])) {
                        extractjs.push(item[2]);
                    }
                });
            }
            matchesData = [...readData.matchAll(reDataPattern)];
            if (matchesData.length > 0){
                matchesData.forEach(function(item){
                    matchesData.log('//');
                });
            }

        }
    });
    console.log(extractjs);
}

export default assembleilib;