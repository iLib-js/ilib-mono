#!/usr/bin/env node

// Simple CommonJS test for ilib-scriptinfo
var scriptInfoFactory = require('ilib-scriptinfo').scriptInfoFactory;
var ScriptInfo = require('ilib-scriptinfo').ScriptInfo;

var latin = scriptInfoFactory('Latn');
var arabic = scriptInfoFactory('Arab');

console.log(JSON.stringify(latin, null, 4));
console.log(JSON.stringify(arabic, null, 4));

var allScripts = ScriptInfo.getAllScripts();
console.log(JSON.stringify(allScripts, null, 4));
