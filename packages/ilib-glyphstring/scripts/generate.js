/*
 * generate.js - tool to generate glyph information from
 * the CLDR and UCD data files
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
/*
 * This code is intended to be run under node.js
 */
import fs from 'fs';
import path from 'path';
import { Utils } from 'ilib-data-utils';
import Locale from 'ilib-locale';
import stringify from 'json-stable-stringify';
import { iso15924 } from 'iso-15924';

const merge = Utils.merge;
const mergeAndPrune = Utils.mergeAndPrune;
const makeDirs = Utils.makeDirs;

function loadJson(filePath) {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function usage() {
    console.log("Usage: generate [-h] [dataDir [codeDir]]\n" +
        "Generate the normalization data.\n\n" +
        "-h or --help\n" +
        "  this help\n" +
        "dataDir\n" +
        "  directory to output the normalization data json files. Default: current_dir/locale.\n" +
        "codeDir\n" +
        "  directory to output the generated code files. Default: current_dir/src.");
    process.exit(1);
}

process.argv.forEach((val, index, array) => {
    if (val === "-h" || val === "--help") {
        usage();
    }
});

console.log("generate - generate glyph information files.\n" +
    "Copyright (c) 2024 JEDLSoft");

let toDir = "./locale";
let codeDir = "./lib";

process.argv.forEach((val, index, array) => {
    if (val === "-h" || val === "--help") {
        usage();
    }
});

if (process.argv.length < 2) {
    console.error('Error: not enough arguments');
    usage();
}

if (process.argv.length > 2) {
    toDir = process.argv[2];
    if (process.argv.length > 3) {
        codeDir = process.argv[3];
    } else {
        codeDir = toDir;
    }
}

if (!fs.existsSync(toDir)) {
    mkdirs(toDir);
    if (!fs.existsSync(toDir)) {
        console.error("Could not access target data directory " + toDir);
        usage();
    }
}
if (!fs.existsSync(codeDir)) {
    mkdirs(codeDir);
    if (!fs.existsSync(codeDir)) {
        console.error("Could not access target code directory " + codeDir);
        usage();
    }
}

let canonicalMappings = {};
let canonicalDecomp = {};
let canonicalComp = {};
let compatibilityMappings = {};
let compatibilityDecomp = {};
let combiningMappings = {};
let compositionExclusions = [];
let scriptName;
let ranges = [];
let rangeToScript = [];

/**
 * Expand one character according to the given canonical and
 * compatibility mappings.
 * @param {string} ch character to map
 * @param {object} canon the canonical mappings to apply
 * @param {object} compat the compatibility mappings to apply, or undefined
 * if only the canonical mappings are needed
 * @return {string} the mapped character
 */
function expand(ch, canon, compat) {
    let expansion = "";
    let result = canon[ch];
    if (!result && compat) {
        result = compat[ch];
    }
    if (result && result !== ch) {
        let it = new Utils.charIterator(result);
        while (it.hasNext()) {
            const c = it.next();
            expansion += expand(c, canon, compat);
        }
    } else {
        expansion = ch;
    }
    return expansion;
}

function compareByStart(left, right) {
    return left[1] - right[1];
}

function findScript(str) {
    const cp = Utils.UTF16ToCodePoint(str);
    const i = Utils.findMember(rangeToScript, cp);
    if (i !== -1) {
        return rangeToScript[i][2];
    }
    return "Zyyy"; // default is "common" script which is shared by all scripts
}

function genCode(script, form) {
    const str =
        "/*\n" +
        " * " + script + ".js - include file for normalization data for a particular script\n" +
        " * \n" +
        " * Copyright © 2013-2018, 2020-2021 JEDLSoft\n" +
        " *\n" +
        " * Licensed under the Apache License, Version 2.0 (the \"License\");\n" +
        " * you may not use this file except in compliance with the License.\n" +
        " * You may obtain a copy of the License at\n" +
        " *\n" +
        " *     http://www.apache.org/licenses/LICENSE-2.0\n" +
        " *\n" +
        " * Unless required by applicable law or agreed to in writing, software\n" +
        " * distributed under the License is distributed on an \"AS IS\" BASIS,\n" +
        " * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n" +
        " *\n" +
        " * See the License for the specific language governing permissions and\n" +
        " * limitations under the License.\n" +
        " */\n" +
        "/* WARNING: THIS IS A FILE GENERATED BY gennorm.js. DO NOT EDIT BY HAND. */\n";

    return str;
}

function mkdirs(path) {
    if (!fs.existsSync(path)) {
        return fs.mkdirSync(path);
    }
}

const ef = loadJson("node_modules/ucd-full/DerivedNormalizationProps.json");
for (let i = 0; i < ef.DerivedNormalizationProps.length; i++ ) {
    const entry = ef.DerivedNormalizationProps[i];
    if (entry.property === "Full_Composition_Exclusion") {
        const range = entry.range.map(element => parseInt(element, 16));
        compositionExclusions.push(range);
    }
}
//console.log("Full exclusion table is:\n" + JSON.stringify(compositionExclusions));

const ud = loadJson("node_modules/ucd-full/UnicodeData.json");

for (let i = 0; i < ud.UnicodeData.length; i++ ) {
    const entry = ud.UnicodeData[i];
    const c = Utils.hexStringUTF16String(entry.codepoint);
    let decomposition;
    // the decomposition type is given in <angle brackets> at the beginning of the mapping.
    // if there are no angle brackets, then this is a canonical mapping
    if (entry.characterDecompositionMapping) {
        decomposition = entry.characterDecompositionMapping;
        if (decomposition.length && decomposition[0] === '<') {
            decomposition = entry.characterDecompositionMapping.split(/\s+/g).slice(1).join(' ');
            compatibilityMappings[c] = Utils.hexStringUTF16String(decomposition);
        } else {
            // decompositionType is "canonical"
            decomposition = Utils.hexStringUTF16String(decomposition);
            canonicalMappings[c] = decomposition;
            if (!Utils.isMember(compositionExclusions, Utils.UTF16ToCodePoint(c))) {
                canonicalComp[decomposition] = c;
            //} else {
            //    console.log("Composition from " + Utils.UTF16ToCodePoint(c) + " to " + Utils.UTF16ToCodePoint(entry.characterDecompositionMapping) + " is on the exclusion list.");
            }
        }
    }

    const temp = entry.canonicalCombiningClass;
    if (temp > 0) {
        combiningMappings[c] = parseInt(temp);
    }
}

let fullToShortMap = {};

iso15924.forEach(script => {
    fullToShortMap[(script.pva && script.pva.toLowerCase()) || script.name.toLowerCase()] = script.code;
});

const sf = loadJson("node_modules/ucd-full/Scripts.json");

for (let i = 0; i < sf.Scripts.length; i++) {
    const entry = sf.Scripts[i];
    scriptName = entry.script;
    scriptName = fullToShortMap[scriptName.toLowerCase()] || scriptName;
    const range = entry.range.map(element => {
        return parseInt(element, 16);
    });

    if (range.length > 1) {
        ranges.push([range[0], range[1], scriptName]);
    } else {
        ranges.push([range[0], range[0], scriptName]);
    }
}

ranges.sort(compareByStart);
rangeToScript = Utils.coelesce(ranges, 1);

let script;
let nfdByScript = {};
let nfcByScript = {};
let nfkdByScript = {};

// the Unicode data has only the binary decompositions. That is, the first of
// two chars of a decomposition may be itself decomposable. So, apply the
// decompositions recursively here to pre-calculate the full decomposition
// before writing out the files.

for (let mapping in canonicalMappings) {
    if (mapping && canonicalMappings[mapping]) {
        canonicalDecomp[mapping] = expand(mapping, canonicalMappings);

        script = findScript(mapping);
        if (typeof(nfdByScript[script]) === 'undefined') {
            nfdByScript[script] = {};
        }
        nfdByScript[script][mapping] = canonicalDecomp[mapping];
    }
}

for (let mapping in compatibilityMappings) {
    if (mapping && compatibilityMappings[mapping]) {
        const expansion = expand(mapping, canonicalDecomp, compatibilityMappings);
        if (expansion && expansion !== mapping) {
            compatibilityDecomp[mapping] = expansion;

            script = findScript(mapping);
            if (typeof(nfkdByScript[script]) === 'undefined') {
                nfkdByScript[script] = {};
            }
            nfkdByScript[script][mapping] = compatibilityDecomp[mapping];
        }
    }
}

for (let mapping in canonicalComp) {
    if (mapping && canonicalComp[mapping]) {
        script = findScript(mapping);
        if (typeof(nfcByScript[script]) === 'undefined') {
            nfcByScript[script] = {};
        }
        nfcByScript[script][mapping] = canonicalComp[mapping];
    }
}

mkdirs(`${toDir}/nfd`);
mkdirs(`${toDir}/nfc`);
mkdirs(`${toDir}/nfkd`);

mkdirs(`${codeDir}/nfd`);
mkdirs(`${codeDir}/nfc`);
mkdirs(`${codeDir}/nfkd`);
mkdirs(`${codeDir}/nfkc`);

fs.writeFile(`${toDir}/nfd/all.json`, stringify(canonicalDecomp, {space: 4}), err => {
    if (err) {
        throw err;
    }
});
fs.writeFile(`${codeDir}/nfd/all.js`, genCode("all", "nfd"), err => {
    if (err) {
        throw err;
    }
});

for (script in nfdByScript) {
    if (script && nfdByScript[script]) {
        fs.writeFile(`${toDir}/nfd/` + script + ".json", stringify(nfdByScript[script], {space: 4}), err => {
            if (err) {
                throw err;
            }
        });

        fs.writeFile(`${codeDir}/nfd/` + script + ".js", genCode(script, "nfd"), err => {
            if (err) {
                throw err;
            }
        });
    }
}

fs.writeFile(`${toDir}/nfc/all.json`, stringify(canonicalComp, {space: 4}), err => {
    if (err) {
        throw err;
    }
});

fs.writeFile(`${codeDir}/nfc/all.js`, genCode("all", "nfc"), err => {
    if (err) {
        throw err;
    }
});

for (script in nfcByScript) {
    if (script && nfcByScript[script]) {
        fs.writeFile(`${toDir}/nfc/` + script + ".json", stringify(nfcByScript[script], {space: 4}), err => {
            if (err) {
                throw err;
            }
        });
        fs.writeFile(`${codeDir}/nfc/` + script + ".js", genCode(script, "nfc"), err => {
            if (err) {
                throw err;
            }
        });
    }
}

fs.writeFile(`${toDir}/nfkd/all.json`, stringify(compatibilityDecomp, {space: 4}), err => {
    if (err) {
        throw err;
    }
});
fs.writeFile(`${codeDir}/nfkd/all.js`, genCode("all", "nfkd"), err => {
    if (err) {
        throw err;
    }
});

for (script in nfkdByScript) {
    if (script && nfkdByScript[script]) {
        fs.writeFile(`${toDir}/nfkd/` + script + ".json", stringify(nfkdByScript[script], {space: 4}), err => {
            if (err) {
                throw err;
            }
        });

        fs.writeFile(`${codeDir}/nfkd/` + script + ".js", genCode(script, "nfkd"), err => {
            if (err) {
                throw err;
            }
        });
    }
}

fs.writeFile(`${codeDir}/nfkc/all.js`, genCode("all", "nfkc"), err => {
    if (err) {
        throw err;
    }
});

for (script in nfkdByScript) {
    if (script && nfkdByScript[script]) {
        fs.writeFile(`${codeDir}/nfkc/` + script + ".js", genCode(script, "nfkc"), err => {
            if (err) {
                throw err;
            }
        });
    }
}

fs.writeFile(`${toDir}/ccc.json`, stringify(combiningMappings, {space: 4}), err => {
    if (err) {
        throw err;
    }
});
