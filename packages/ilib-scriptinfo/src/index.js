/*
 * ScriptInfo.js - information about scripts
 *
 * Copyright © 2012-2018, 2025 JEDLSoft
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

import { scriptData } from './ScriptData.js';

// Helper function to get script info with boolean flags
function getScriptInfo(code) {
    const index = scriptData.findIndex(entry => entry[0] === code);
    if (index === -1) return null;
    
    const data = scriptData[index];
    return {
        nb: data[1],
        nm: data[2],
        lid: data[3],
        rtl: data[4] || false,
        ime: data[5] || false,
        casing: data[6] || false
    };
}

// Get all script codes
function getAllScriptCodes() {
    return scriptData.map(entry => entry[0]);
}

export class ScriptInfo {
    constructor(script) {
        this.script = script;
        this.info = script && getScriptInfo(script);
    }

    getCode() {
        return this.script;
    }

    getCodeNumber() {
        return this.info ? this.info.nb : undefined;
    }

    getName() {
        return this.info ? this.info.nm : undefined;
    }

    getLongCode() {
        return this.info ? this.info.lid : undefined;
    }

    getScriptDirection() {
        return this.info && this.info.rtl ? "rtl" : "ltr";
    }

    getNeedsIME() {
        return this.info ? this.info.ime : false;
    }

    getCasing() {
        return this.info ? this.info.casing : false;
    }

    static _getScriptsArray() {
        return getAllScriptCodes();
    }

    static getAllScripts() {
        return ScriptInfo._getScriptsArray();
    }
}