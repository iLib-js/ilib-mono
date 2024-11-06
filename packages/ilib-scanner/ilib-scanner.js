#!/usr/bin/env node
/**
 * scanner.js - A utility to scan your web site looking for references
 * to ilib classes it needs in order to create a webpack metafile that
 * allows you to create a minimal webpacked ilib tailored specifically
 * for your site.
 *
 * @license
 * Copyright © 2018, 2022 JEDLSoft
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

var fs = require("fs");
var path = require("path");
var Locale = require("ilib-locale");
var OptionsParser = require("options-parser");
var classes;

// In order to include automatically non-gregorian CalendarDate when using DateFactory or JS Date
var dateSet = [
    "DateFactory",
    "GregorianDate",
    "JulianDate"
];

var localeCalMap = {
    "ET" : "EthiopicDate",
    "TR" : "IslamicDate",
    "SA" : "IslamicDate",
    "MA" : "IslamicDate",
    "DZ" : "IslamicDate",
    "DJ" : "IslamicDate",
    "ER" : "IslamicDate",
    "TN" : "IslamicDate",
    "LY" : "IslamicDate",
    "SD" : "IslamicDate",
    "JO" : "IslamicDate",
    "LB" : "IslamicDate",
    "MR" : "IslamicDate",
    "SY" : "IslamicDate",
    "IQ" : "IslamicDate",
    "YE" : "IslamicDate",
    "AE" : "IslamicDate",
    "OM" : "IslamicDate",
    "QA" : "IslamicDate",
    "BH" : "IslamicDate",
    "KM" : "IslamicDate",
    "KW" : "IslamicDate",
    "PS" : "IslamicDate",
    "PK" : "IslamicDate",
    "TD" : "IslamicDate",
    "TM" : "IslamicDate",
    "KG" : "IslamicDate",
    "BD" : "IslamicDate",
    "EG" : ["IslamicDate", "CopticDate"],
    "IR" : ["IslamicDate", "PersianDate", "PersianAlgoDate"],
    "AF" : ["IslamicDate", "PersianDate", "PersianAlgoDate"],
    "IL" : ["HebrewDate", "IslamicDate"],
    "TH" : "ThaiSolarDate",
    "CN" : "HanDate",
    "CX" : "HanDate",
    "TW" : "HanDate",
    "HK" : "HanDate",
    "MO" : "HanDate",
    "SG" : "HanDate"
 }

var optionConfig = {
    help: {
        short: "h",
        showHelp: { 
            banner: 'Usage: ilib-scanner [-h] [options] outputFile [input_file_or_directory ...]'
        }
    },
    assembly: {
        short: "a",
        "default": "assembled",
        help: "How you want to load locale data. Valid values are 'assembled', 'dynamic', and 'dynamicdata'. Default: 'assembled'."
    },
    compilation: {
        short: "c",
        "default": "compiled",
        help: "Whether you want the output to be compiled with uglify-js. Valid values are 'compiled', and 'uncompiled'. Default: 'compiled'."
    },
    locales: {
        short: "l",
        "default": [
            "en-AU", "en-CA", "en-GB", "en-IN", "en-NG", "en-PH",
            "en-PK", "en-US", "en-ZA", "de-DE", "fr-CA", "fr-FR",
            "es-AR", "es-ES", "es-MX", "id-ID", "it-IT", "ja-JP",
            "ko-KR", "pt-BR", "ru-RU", "tr-TR", "vi-VN", "zxx-XX",
            "zh-Hans-CN", "zh-Hant-HK", "zh-Hant-TW", "zh-Hans-SG"
        ],
        help: "Locales you want your webapp to support. Value is a comma-separated list of BCP-47 style locale tags. Default: the top 20 locales on the internet by traffic."
    },
    ilibRoot: {
        short: "i",
        varName: "ilibRoot",
        help: "Explicitly specify the location of the root of ilib. If not specified, this scanner will rely on node to find the ilib instance in the node_modules directory."
    },
    mode: {
        short: "m",
        help: "Set the mode to 'production' or 'development' for webpack 4. Default: no mode (mode is not valid in webpack versions<4).",
        varName: "mode"
    },
    classPath: {
        short: "p",
        help: "Explicitly specify the `ilib-unpack.js` path which unpacks a set of ilib routines webpacked into the global scope.",
    }
};

var options = OptionsParser.parse(optionConfig);

if (options.args.length < 1) {
    OptionsParser.help(optionConfig, {
        banner: 'Usage: ilib-scanner [-h] [options] outputFile [input_file_or_directory ...]'
    });
    process.exit(1);
}

var outputPath = options.args[0];

var files = options.args.slice(1);
if (files.length === 0) {
    files.push(".");
}

var outputFile = path.basename(outputPath);
var outputDir = path.dirname(outputPath) || ".";
var webpackConfigPath = path.join(outputDir, "webpack.config.js");
var locales = typeof(options.opt.locales) === "string" ? options.opt.locales.split(",") : options.opt.locales;
var ilibRoot = options.opt.ilibRoot;
var mode = options.opt.mode;
var classPath = options.opt.classPath;

var classSet = new Set();

function loadIlibClasses() {
    
    if (ilibRoot) {
        if(classPath){
            classes = require(path.join(ilibRoot, classPath));
        } else {
            classes = require(path.join(ilibRoot, "lib/ilib-unpack.js"));
        }
    } else {
        classes = require("ilib/lib/ilib-unpack.js");
    }
}

var dateTypes = new Set();
var addCalDateList = [];

function maplocaleCalDate(locales){
    locales.forEach(function(lo){
        var locale = new Locale(lo);
        var region = locale.getRegion();
        var dates = localeCalMap[region];
        if (dates) {
            dates = Array.isArray(dates) ? dates : [dates];
            dates.forEach(function(type) {
                dateTypes.add(type);
            });
        }
    });
    addCalDateList = Array.from(dateTypes);
}

function scanFileOrDir(pathName) {
    try {
        stat = fs.statSync(pathName);
        if (stat) {
            if (stat.isDirectory()) {
                var list = fs.readdirSync(pathName);

                list.forEach(function (file) {
                    if (file !== "node_modules") {
                        scanFileOrDir(path.join(pathName, file));
                    }
                });
            } else if (!pathName.startsWith("ilib")) {
                loadIlibClasses();
                var data = fs.readFileSync(pathName, "utf-8");

                classes.forEach(function(cls) {
                    if (data.indexOf(cls) > -1) {
                        classSet.add(cls);
                    }
                    if ((data.indexOf("new Date") > -1) || (dateSet.indexOf("DateFactory") > -1)){
                        dateSet.forEach(function(calDate){
                            classSet.add(calDate);
                        });
                        if (addCalDateList.length > 0){
                            addCalDateList.forEach(function(list){
                                classSet.add(list);
                            });
                        }
                    }
                });
            }
        } else {
            console.log("Error: could not access " + pathName);
        }
    } catch (e) {
        console.log("Error: could not access " + pathName);
    }
}

maplocaleCalDate(locales);
files.forEach(function(file) {
    scanFileOrDir(file);
});

var metaFileContents =
    "/*\n" +
    " * WARNING: this is a file generated by ilib-scanner.\n" +
    " * Do not hand edit or else your changes may be overwritten and lost.\n" +
    " * Instead, re-run the scanner to generate a new version of this file.\n" +
    " */\n\n" +
    'var ilib = require("' + (ilibRoot || "ilib") + '");\n\n';

classSet.forEach(function(cls) {
    metaFileContents += 'ilib.' + cls + ' = require("' + (ilibRoot || "ilib") + '/lib/' + cls + '.js");\n';
});

metaFileContents +=
    '\nrequire("' + (ilibRoot || "ilib") + '/lib/ilib-unpack.js");\n\n' +
    'module.exports = ilib;\n';

fs.writeFileSync(outputPath, metaFileContents, "utf-8");

var webpackConfigContents =
    "/*\n" +
    " * WARNING: this is a file generated by ilib-scanner.\n" +
    " * Do not hand edit or else your changes may be overwritten and lost.\n" +
    " * Instead, re-run the scanner to generate a new version of this file.\n" +
    " */\n\n" +
    "var path = require('path');\n" +
    "var webpack = require('webpack');\n" +
    "var IlibWebpackPlugin = require('ilib-webpack-plugin');\n" +
    "var options = {\n" +
    "    locales: " + JSON.stringify(locales) + ",\n" +
    "    assembly: '" + options.opt.assembly + "',\n" +
    "    compilation: '" + options.opt.compilation + "',\n" +
    (ilibRoot ? "    ilibRoot: '" + ilibRoot + "',\n" : "") +
    "    size: 'custom',\n" +
    "    target: 'web',\n" +
    "    tempDir: 'assets'\n" +
    "};\n" +
    "module.exports = {\n" +
    "    entry: path.resolve('./" + outputFile + "'),\n" +
    (mode ? "    mode: '" + mode + "',\n" : "") +
    "    output: {\n" +
    "        filename: 'ilib.js',\n" +
    "        chunkFilename: 'ilib.[name].js',\n" +
    "        path: path.resolve('.'),\n" +
    "        publicPath: '" + outputDir + "/',\n" +
    "        library: 'ilib',\n" +
    "        libraryTarget: 'umd'\n" +
    "    },\n" +
    "    module: {\n" +
    "        rules: [{\n" +
    "            test: /\.js$/,\n" +
    "            use: {\n" +
    "                loader: 'ilib-webpack-loader',\n" +
    "                options: options\n" +
    "            }\n" +
    "        }]\n" +
    "    },\n" +
    "    plugins: [\n" +
    "        new webpack.DefinePlugin({\n" +
    "            __VERSION__: JSON.stringify(require('" + (ilibRoot || 'ilib') + "/package.json').version)\n" +
    "        }),\n" +
    "        new IlibWebpackPlugin(options)\n" +
    "    ]\n" +
    "};\n";

fs.writeFileSync(webpackConfigPath, webpackConfigContents, "utf-8");

console.log(`Done. Output is in ${outputPath} and ${webpackConfigPath}`);

