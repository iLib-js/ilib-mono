/*
 * genlikelyloc.js - ilib tool to generate the localematch.json files from
 * the CLDR data files
 *
 * Copyright © 2013-2020, 2022-2023 JEDLSoft
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

var fs = require('fs');
var path = require('path');
var Locale = require('ilib-locale');

var likelySubtags = require('cldr-core/supplemental/likelySubtags.json');
var territoryContainment = require('cldr-core/supplemental/territoryContainment.json');

function usage() {
    console.log("Usage: genlikelyloc [-h] [ locale_data_dir ]\n" +
            "Generate likely locale match information file.\n" +
            "-h or --help\n" +
            "  this help\n" +
            "locale_data_dir\n" +
            "  the top level of the ilib locale data directory");
    process.exit(1);
}

var localeDirName;

process.argv.forEach(function (val, index, array) {
    if (val === "-h" || val === "--help") {
        usage();
    }
});

localeDirName = process.argv[2] || path.join(module.path || ".", "../src");

console.log("genlikelyloc - generate the localematch.js file.\n" +
        "Copyright (c) 2013-2020, 2022-2023 JEDLSoft");

console.log("locale dir: " + localeDirName);

if (!fs.existsSync(localeDirName)) {
    console.error("Could not access locale data directory " + localeDirName);
    usage();
}

var likelySubtags, likelySubtagsData, filename, json;

var localematch = {};

// Likely Locales

var likelylocales = {};
likelySubtagsData = likelySubtags.supplemental;

for (var partial in likelySubtagsData.likelySubtags) {
    if (partial && likelySubtagsData.likelySubtags[partial]) {
        var partialLoc = new Locale(partial);
        var full = new Locale(likelySubtagsData.likelySubtags[partial]);
        if (partialLoc.language === "und") {
            var cleanloc = new Locale(undefined, partialLoc.region, undefined, partialLoc.script);

            // add them with and without the "und" part
            likelylocales[cleanloc.getSpec()] = full.getSpec();
            likelylocales[partial] = full.getSpec();

            if (!partialLoc.script) {
                // this is the official locale for the region
                var langscript = new Locale(full.language, undefined, undefined, full.script);
                if (!likelylocales[langscript.getSpec()]) {
                    likelylocales[langscript.getSpec()] = full.getSpec();
                }
                var langregion = new Locale(full.language, full.region);
                if (!likelylocales[langregion.getSpec()]) {
                    likelylocales[langregion.getSpec()] = full.getSpec();
                }
            }
        } else {
            likelylocales[partial] = full.getSpec();
            if (!partialLoc.script && !partialLoc.region) {
                // this is the default locale for the language. Now generate the language + script for this and the
                // language + region because sometimes cldr does not contain them for some reason
                var langscript = new Locale(full.language, undefined, undefined, full.script);
                if (!likelylocales[langscript.getSpec()]) {
                    likelylocales[langscript.getSpec()] = full.getSpec();
                }
                var langregion = new Locale(full.language, full.region);
                if (!likelylocales[langregion.getSpec()]) {
                    likelylocales[langregion.getSpec()] = full.getSpec();
                }
            }
        }
    }
}

// fill in the gaps left by cldr -- these should be submitted to cldr for consideration
var additional = JSON.parse(fs.readFileSync(path.join(module.path, "likelyLocalesAdditional.json"), "utf-8"));
for (var territory in additional) {
    var fullspec = additional[territory];
    var full = new Locale(fullspec);

    if (territory && !likelylocales[territory]) {
        likelylocales[territory] = fullspec;
    }

    if (full.region && !likelylocales[full.region]) {
        likelylocales[full.region] = fullspec;
    }

    if (full.language && !likelylocales[full.language]) {
        likelylocales[full.language] = fullspec;
    }

    var langscript = new Locale(full.language, undefined, undefined, full.script);
    if (!likelylocales[langscript.getSpec()]) {
        likelylocales[langscript.getSpec()] = fullspec;
    }

    if (full.region) {
        if (!likelylocales["und-" + full.region]) {
            likelylocales["und-" + full.region] = fullspec;
        }

        var langregion = new Locale(full.language, full.region);
        if (!likelylocales[langregion.getSpec()]) {
            likelylocales[langregion.getSpec()] = fullspec;
        }

        var scriptregion = new Locale(undefined, full.region, undefined, full.script);
        if (!likelylocales[scriptregion.getSpec()]) {
            likelylocales[scriptregion.getSpec()] = fullspec;
        }
    }
}

function sortObject(obj) {
    var ret = {};
    Object.keys(obj).sort().forEach(function(prop) {
        ret[prop] = obj[prop];
    });
    return ret;
}

localematch.likelyLocales = sortObject(likelylocales);

// territory containments
var containment = {};
var containmentReverse = {};
var parentsHash = {};
var data = territoryContainment.supplemental.territoryContainment;

for (var territory in data) {
    if (territory.indexOf("-status") === -1) {
        var t = territory + "-status-grouping";
        if (data[t]) {
            containment[territory] = data[t]["_contains"].concat(data[territory]["_contains"]);
        } else {
            containment[territory] = data[territory]["_contains"];
        }

        containment[territory].forEach(function(region) {
            if (!parentsHash[region]) parentsHash[region] = [];
            parentsHash[region].push(territory);
        });
    }
}

function reverseArray(arr) {
    var ret = [];
    for (var i = arr.length-1; i > -1; i--) {
        ret.push(arr[i]);
    }
    return ret;
}

function toArray(set) {
    // convert from set to array
    var elements = [];
    set.forEach(function(element) {
        elements.push(element);
    });

    return elements;
}

function getAncestors(region) {
    // already calculated previously
    if (containmentReverse[region]) return containmentReverse[region];

    if (!parentsHash[region]) return []; // only the whole world has no parents

    // get all the ancestors of the current region...
    var parentsArray = parentsHash[region].map(function(parent) {
        return getAncestors(parent).concat([parent]);
    });

    // then add the biggest territories first as measured by the smallest
    // number of steps to the root of the tree
    parentsArray.sort(function(left, right) {
        return left.length - right.length;
    });

    // take care of duplicates using a set
    var set = new Set();
    // do a breadth-first insert into the set so that the largest territories
    // get added before smaller ones do
    var max = parentsArray.reduce(function(accumulator, currentValue) {
        return (currentValue.length > accumulator) ? currentValue.length : accumulator;
    }, 0);
    for (var i = 0; i < max; i++) {
        parentsArray.forEach(function(arr) {
            if (i < arr.length) {
                set.add(arr[i]);
            }
        });
    }

    containmentReverse[region] = toArray(set).reverse();
    return containmentReverse[region];
}

var empty = new Set();

function topologicalCompare(ancestors, left, right) {
    var leftNode = ancestors[left] || empty;
    var rightNode = ancestors[right] || empty;

    if (rightNode.has(left)) {
        if (!leftNode.has(right)) {
            return 1;
        }
    } else if (leftNode.has(right)) {
        return -1;
    }
    return 0;
}

function getAncestors(parentList, set, code) {
    if (parentList[code]) {
        parentList[code].forEach(function(subcode) {
            set.add(subcode);
            getAncestors(parentList, set, subcode);
        });
    }
}

function generateTerritoryHierarchy(containment) {
    var parentList = {};
    var code;

    for (code in containment) {
        var children = containment[code];
        children.forEach(function(child) {
            if (!parentList[child]) {
                parentList[child] = [];
            }
            parentList[child].push(code);
        });
    }

    // enumerate all ancestors for each node
    var ancestors = {};
    for (code in parentList) {
        var set = new Set();
        getAncestors(parentList, set, code);
        ancestors[code] = set;
    }

    // now sort them topologically
    var containmentReverse = {};
    for (code in ancestors) {
        var list = toArray(ancestors[code]);
        containmentReverse[code] = list.sort(topologicalCompare.bind(null, ancestors));
    }

    return containmentReverse;
}

containmentReverse = generateTerritoryHierarchy(containment);

localematch.territoryContainment = sortObject(containment);
localematch.territoryContainmentReverse = sortObject(containmentReverse);

// macro languages
var ml = JSON.parse(fs.readFileSync(path.join(module.path, "macroLanguages.json"), "utf-8"));

var mlReverse = {};
for (var macrolang in ml) {
    ml[macrolang].sort();
    ml[macrolang].forEach(function(lang) {
        mlReverse[lang] = macrolang;
    });
}

localematch.macroLanguages = sortObject(ml);
localematch.macroLanguagesReverse = sortObject(mlReverse);

// mutual intelligibility

var mi = JSON.parse(fs.readFileSync(path.join(module.path, "mutualIntelligibility.json"), "utf-8"));

localematch.mutualIntelligibility = mi;

console.log("Writing localematch.js...");

// now write out the system resources

var preamble = `
/*
 * localematch.js - Locale match mappings
 *
 * Copyright © 2022-2023 JEDLSoft
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

export const matchdata = `;

var filename = path.join(localeDirName, "localematch.js");
fs.writeFile(filename, preamble + JSON.stringify(localematch, true, 4) + ';\n', function (err) {
    if (err) {
        console.log(err);
        throw err;
    }
});

console.log("Done.");
