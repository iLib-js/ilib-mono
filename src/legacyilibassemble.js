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

const reDependentPattern = new RegExp(/require\(\s*(\"|\')\.*\/(.*\.js)(\"|\')\)\;/, "g");
const reDataPattern = new RegExp(/\/\/\s*!data\s*(([^\\])+)/, "g");

const localeIndependent = [
    "astro",
    "zoneinfo",
    "localematch",
    "ctype",
    "ctype_l",
    "ctype_m",
    "ctype_n",
    "ctype_p",
    "ctype_z",
    "scriptToRange",
    "pseudomap"
];

function assembleilib(options) {
    //console.log(options);
    ilibPath = options.opt.ilibPath;
    ilibincPath = options.opt.ilibincPath;
    locales = options.opt.locales;
    outDir = options.args[0];
    readIncFile(options.opt.ilibincPath);
    readJSFiles();
}

function readIncFile(incpath) {
    let info = readFile(incpath, 'utf8');
    let lines = info.split('\n');
    lines.forEach(line => {
        if (line.indexOf('js') != -1) {
            jsFileList.push(line);
        }
    });
}

function readFile(filepath) {
    let readData = "";
    if (!filepath) return;

    if (fs.existsSync(filepath)) {
        readData = fs.readFileSync(filepath, "utf-8");
        return readData;
    } else {
        console.log("The file [" + filepath + "] does not exist.");
    }
}

//node --inspect-brk src/index.js result --legacyilib --ilibPath ~/Source/develop/ --ilibincPath src/ilib-assemble-inc.js 

let dependentJS = [];
let dependentData = [];
let assembleJSAll= "";

function readJSFiles() {
    let readData;
    let matchedJS;
    let matchedData;
    jsFileList.forEach(function(file){
        let jsPath = path.join(ilibPath, "js/lib", file);
        readData = readFile(jsPath);

        matchedJS = [...readData.matchAll(reDependentPattern)];
        if (matchedJS.length > 0){
            matchedJS.forEach(function(item){
                if (!dependentJS.includes(item[2])) {
                    dependentJS.push(item[2]);
                }
            });
        }

        matchedData = reDataPattern.exec(readData);
        if (matchedData !== null){
            let result = matchedData[1].split('\n')[0].split(' ');
            result.forEach(function(item){
                if (!dependentData.includes(item)) {
                    dependentData.push(item);
                }
            });
        }
    });

    allJSList = [...new Set([...dependentJS, ...jsFileList])];

    assemblejs();
    //assemblelocale();
}

function deletePatterns(data) {
    const deletePattern1 = /var\s*[^;]*=[^;]require[^;]*;/g;
    const deletePattern2 = /module\.exports\s*=\s*[^;]*;/g;
    data = data.replaceAll(deletePattern1, "").replaceAll(deletePattern2, "");
    return data;
}

function assembleLocaleIndepententData() {
    let readData;
    let allData;
    dependentData.forEach(function(data){
        if (localeIndependent.indexOf(data) != -1) {
            let dataPath = path.join(ilibPath, "js/data/locale", data + ".json" );
            //ilib.data.plurals_af = {"one":{"eq":["n",1]}};
            readData = readFile(dataPath);
            allData += "ilib.data." + data + " = " + readData;
        }
    });
    return allData;
}

function assembleZoneinfo() {
    let readData;
    let zoneinfoPath = path.join(ilibPath, "js/data/locale/zoneinfo");
    readData = zoneinfoWalk(zoneinfoPath);
    return readData;
}

function zoneinfoWalk(zoneinfoPath) {
    let dirList = fs.readdirSync(zoneinfoPath);

    let allData = "";
    dirList.forEach(function(dir) {
        let filePath = path.join(zoneinfoPath, dir);
        let stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            zoneinfoWalk(filePath);
        } else {
            let timezoneID = filePath.replace(path.join(ilibPath, "js/data/locale/zoneinfo/"), "").replace(".json", "");
            let readData = readFile(filePath);
            allData += 'ilib.data.zoneinfo["' + timezoneID + '"] = ' + readData + ';\n';
        }
    });
    return allData;
}

function assemblejs() {
    allJSList.forEach(function(file){
        let filePath;
        let readData;
        if (file == 'index.js') {
            filePath = path.join(ilibPath, "js", file);
        } else {
            filePath = path.join(ilibPath, "js/lib", file);
        }
        readData = readFile(filePath, 'utf-8');
        assembleJSAll += readData;
    });

    assembleJSAll = deletePatterns(assembleJSAll);
    assembleJSAll += assembleLocaleIndepententData();
    assembleJSAll += assembleZoneinfo();

    fs.writeFileSync('result.js', assembleJSAll, 'utf-8');
}

export default assembleilib;