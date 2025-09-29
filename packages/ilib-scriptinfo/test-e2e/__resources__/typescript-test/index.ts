#!/usr/bin/env node

// Simple TypeScript test for ilib-scriptinfo
import { scriptInfoFactory, ScriptInfo } from 'ilib-scriptinfo';

const latin: ScriptInfo | undefined = scriptInfoFactory('Latn');
const arabic: ScriptInfo | undefined = scriptInfoFactory('Arab');

console.log(JSON.stringify(latin, null, 4));
console.log(JSON.stringify(arabic, null, 4));

const allScripts = ScriptInfo.getAllScripts();
console.log(JSON.stringify(allScripts, null, 4));
