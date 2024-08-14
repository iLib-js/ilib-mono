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
import UglifyJS from 'uglify-js-export';

let ilibPath;
let incPath;
let outDir;
let locales;
let outFileName;
let isCompressed;
let jsFileList = [];
let allJSList = [];

const reDependentPattern = new RegExp(/require\(\s*(\"|\')\.*\/(.*\.js)(\"|\')\)\;/, "g");
const reDataPattern = new RegExp(/\/\/\s*!data\s*(([^\\])+)/, "g");

function assembleilib(options) {
    ilibPath = options.opt.ilibPath || ".";
    incPath = options.opt.ilibincPath || "./src/ilib-assemble-inc.js";
    locales = options.opt.locales;
    outDir = options.args[0];
    outFileName = options.opt.outjsFileName || "ilib-assemble.js";
    isCompressed = options.opt.compressed || false;
    readIncFile(incPath);
    readJSFiles();
}

function readIncFile(incpath) {
    if (incpath) {
        let info = readFile(incpath, "utf-8");
        let lines = info.split('\n');
        lines.forEach(line => {
            if (line.indexOf('js') != -1) {
                jsFileList.push(line);
            }
        });
    }
}

function readFile(filepath) {
    let readData = "";
    if (!filepath) return;

    if (fs.existsSync(filepath)) {
        readData = fs.readFileSync(filepath, "utf-8");
        return readData;
    } else {
        //console.log("The file [" + filepath + "] does not exist.");
    }
}

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
        if (readData) {
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
        }
    });

    allJSList = [...new Set([...jsFileList, ...dependentJS])];

    assemblejs();
    assemblelocale();
}

function deletePatterns(data) {
    const deletePattern1 = /var\s*[^;]*=[^;]require[^;]*;/g;
    const deletePattern2 = /module\.exports\s*=\s*\b(?:(?!ilib)\w)+\b\;/g;
    const macroPattern = /\/\/\s*\!macro\s*ilibVersion/g;
    const readPkg = readFile(path.join(ilibPath, "package.json"));
    const ilibVersion = JSON.parse(readPkg).version;
    data = data.replaceAll(deletePattern1, "").replaceAll(deletePattern2, "").replaceAll(macroPattern, '"' +ilibVersion+ '"');

    return data;
}

function assembleLocaleRootData() {
    let readData;
    let allData = "";
    dependentData.forEach(function(data){
        let dataPath = path.join(ilibPath, "js/data/locale", data + ".json" );
        readData = readFile(dataPath);
        allData += "ilib.data." + data + " = " + readData + ";\n";
    });
    return allData;
}

function assembleZoneinfo() {
    let readData;
    let zoneinfoPath = path.join(ilibPath, "js/data/locale/zoneinfo");
    readData = zoneinfoWalk(zoneinfoPath);
    return readData;
}

let allTimeZoneData = "";
function zoneinfoWalk(zoneinfoPath) {
    let dirList;
    if (fs.existsSync(zoneinfoPath)) {
        dirList = fs.readdirSync(zoneinfoPath);
    }
    if (dirList && dirList.length > 0)  {
        dirList.forEach(function(dir) {
            let filePath = path.join(zoneinfoPath, dir);
            let stat = fs.statSync(filePath);
            if (stat && stat.isDirectory()) {
                zoneinfoWalk(filePath);
            } else {
                let timezoneID = filePath.replace(path.join(ilibPath, "js/data/locale/zoneinfo/"), "").replace(".json", "");
                let readData = readFile(filePath);
                allTimeZoneData += 'ilib.data.zoneinfo["' + timezoneID + '"] = ' + readData + ';\n';
            }
        });
    }

    return allTimeZoneData;
}

function assemblejs() {
    let readData = "";
    let filePath;
    allJSList.forEach(function(file){
        if (file !== 'index.js') {
            filePath = path.join(ilibPath, "js/lib", file);
        }
        readData = readFile(filePath, "utf-8");
        if (readData) assembleJSAll += readData;
    });

    assembleJSAll = deletePatterns(assembleJSAll);
    assembleJSAll += assembleLocaleRootData();
    assembleJSAll += assembleZoneinfo();

    console.log("writing " + path.join(outDir, outFileName) + " file.");
    if (isCompressed) {
        fs.writeFileSync(path.join(outDir, outFileName), UglifyJS.minify(assembleJSAll).code, "utf-8");
    } else {
        fs.writeFileSync(path.join(outDir, outFileName), assembleJSAll, "utf-8");
    }
}

let outFile = {};
function assemblelocale() {
    let iliblocalePath = path.join(ilibPath, "js/data/locale");
    locales.forEach(function(loc){
        let lo = new Locale(loc);
        let lang = lo.language;
        let script = lo.script;
        let region = lo.region;

        let jsonPath;
        let readData;
        dependentData.forEach(function(jsonName) {
            if (outFile[lang] == undefined) {
                outFile[lang] = {};
            }

            if (lang) {
                jsonPath = path.join(iliblocalePath, lang, jsonName + ".json");
                readData = readFile(jsonPath);
                if (readData) outFile[lang]["ilib.data." + jsonName + "_" + lang] = readData;

                if (script) {
                    jsonPath = path.join(iliblocalePath, lang, script, jsonName + ".json");
                    readData = readFile(jsonPath);
                    if (readData) outFile[lang]["ilib.data." + jsonName + "_" + lang + "_" + script] = readData;

                    if (region) {
                        jsonPath = path.join(iliblocalePath, lang, region, jsonName + ".json");
                        readData = readFile(jsonPath);
                        if (readData) outFile[lang]["ilib.data." + jsonName + "_" + lang + "_" + region] = readData;

                        jsonPath = path.join(iliblocalePath, lang, script, region, jsonName + ".json");
                        readData = readFile(jsonPath);
                        if (readData) outFile[lang]["ilib.data." + jsonName + "_" + lang + "_" + script + "_" + region] = readData;

                        jsonPath = path.join(iliblocalePath, "und", region, jsonName + ".json");
                        readData = readFile(jsonPath);
                        if (readData) outFile[lang]["ilib.data." + jsonName + "_und_" + region] = readData;
                    }
                } else if (region) {
                    jsonPath = path.join(iliblocalePath, lang, region, jsonName + ".json");
                    readData = readFile(jsonPath);
                    if (readData) outFile[lang]["ilib.data." + jsonName + "_" + lang + "_" + region] = readData;

                    jsonPath = path.join(iliblocalePath, "und", region, jsonName + ".json");
                    readData = readFile(jsonPath);
                    if (readData) outFile[lang]["ilib.data." + jsonName + "_und_" + region] = readData;
                }
            } else {
                console.log("The locale " + lo.getSpec() +  " is missing language code.");
            }
        });
    });

    for (let loc in outFile) {
        let contents = "";
        for(let keys in outFile[loc]){
            contents += keys + " = " + outFile[loc][keys] + "\n";
        }
        console.log("writing " + outDir + "/"+ loc + ".js file.");
        let resultFilePath = path.join(outDir, loc + ".js");
        if (isCompressed) {
            fs.writeFileSync(resultFilePath, UglifyJS.minify(contents).code, "utf-8");
        } else {
            fs.writeFileSync(resultFilePath, contents, "utf-8");
        }
    }
}

export default assembleilib;