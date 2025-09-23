/**
 * ScriptInfo.ts - information about scripts
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

import { scriptData, type ScriptDataEntry } from './ScriptData';
import { ScriptDirection } from './ScriptDirection';

/**
 * Helper function to get script info with boolean flags from the script data.
 *
 * @param code - The ISO 15924 4-letter script code
 * @returns ScriptInfoData object if found, undefined otherwise
 *
 * @internal
 */
function getScriptInfo(code: string): ScriptInfoData | undefined {
    const data = scriptData.find(entry => entry[0] === code);
    if (!data) return undefined;
    
    return {
        nb: data[1],
        nm: data[2],
        lid: data[3],
        rtl: data[4] || false,
        ime: data[5] || false,
        casing: data[6] || false
    };
}

/**
 * Helper function to get all available script codes.
 *
 * @returns Array of all ISO 15924 4-letter script codes
 *
 * @internal
 */
function getAllScriptCodes(): string[] {
    return scriptData.map((entry: ScriptDataEntry) => entry[0]);
}

/**
 * Interface for script information data.
 */
interface ScriptInfoData {
    nb: number;
    nm: string;
    lid: string;
    rtl: boolean;
    ime: boolean;
    casing: boolean;
}

/**
 * Factory function to create a ScriptInfo instance.
 * 
 * @param script - The ISO 15924 4-letter script code (e.g., 'Latn', 'Arab', 'Hani')
 * @returns A ScriptInfo instance if the script is recognized, undefined otherwise
 * 
 * @example
 * ```typescript
 * import scriptInfoFactory from 'ilib-scriptinfo';
 * 
 * const latin = scriptInfoFactory('Latn');
 * if (latin) {
 *     console.log(latin.name); // "Latin"
 *     console.log(latin.scriptDirection); // "ltr" (left-to-right)
 * }
 * 
 * const unknown = scriptInfoFactory('Xyz');
 * if (unknown) {
 *     // This won't execute - unknown will be undefined
 *     console.log(unknown.name);
 * }
 * ```
 */
export function scriptInfoFactory(script: string | number | null | undefined): ScriptInfo | undefined {
    if (!script) return undefined;
    
    const scriptString = String(script).trim();
    if (!scriptString) return undefined;
    
    const info = getScriptInfo(scriptString);
    if (!info) return undefined;
    
    return new ScriptInfo(scriptString, info);
}

/**
 * ScriptInfo class provides information about writing scripts based on ISO 15924.
 *
 * This class offers access to script properties including:
 * - ISO 15924 4-letter codes and numbers
 * - Script names in English
 * - Long identifiers
 * - Writing direction (LTR/RTL)
 * - Input method requirements
 * - Letter casing behavior
 *
 * @example
 * ```typescript
 * import scriptInfoFactory from 'ilib-scriptinfo';
 *
 * const latin = scriptInfoFactory('Latn');
 * if (latin) {
 *     console.log(latin.name); // "Latin"
 *     console.log(latin.scriptDirection); // "ltr" (left-to-right)
 * }
 * ```
 */
export class ScriptInfo {
    /**
     * The ISO 15924 4-letter script code.
     *
     * @example
     * ```typescript
     * const latin = scriptInfoFactory('Latn');
     * if (latin) {
     *     console.log(latin.code); // "Latn"
     * }
     * ```
     */
    readonly code: string;

    /**
     * The ISO 15924 script number.
     *
     * @example
     * ```typescript
     * const latin = scriptInfoFactory('Latn');
     * if (latin) {
     *     console.log(latin.codeNumber); // 215
     * }
     * ```
     */
    readonly codeNumber: number;

    /**
     * The English name of the script.
     *
     * @example
     * ```typescript
     * const latin = scriptInfoFactory('Latn');
     * if (latin) {
     *     console.log(latin.name); // "Latin"
     * }
     * ```
     */
    readonly name: string;

    /**
     * The long identifier for the script.
     *
     * @example
     * ```typescript
     * const latin = scriptInfoFactory('Latn');
     * if (latin) {
     *     console.log(latin.longCode); // "Latin"
     * }
     * ```
     */
    readonly longCode: string;

    /**
     * The writing direction of the script.
     *
     * @example
     * ```typescript
     * const latin = scriptInfoFactory('Latn');
     * if (latin) {
     *     console.log(latin.scriptDirection); // ScriptDirection.LTR
     * }
     * 
     * const arabic = scriptInfoFactory('Arab');
     * if (arabic) {
     *     console.log(arabic.scriptDirection); // ScriptDirection.RTL
     * }
     * ```
     */
    readonly scriptDirection: ScriptDirection;

    /**
     * Whether the script requires an Input Method Editor (IME).
     *
     * @example
     * ```typescript
     * const chinese = scriptInfoFactory('Hani');
     * if (chinese) {
     *     console.log(chinese.needsIME); // true
     * }
     * 
     * const latin = scriptInfoFactory('Latn');
     * if (latin) {
     *     console.log(latin.needsIME); // false
     * }
     * ```
     */
    readonly needsIME: boolean;

    /**
     * Whether the script has special casing behavior.
     *
     * @example
     * ```typescript
     * const latin = scriptInfoFactory('Latn');
     * if (latin) {
     *     console.log(latin.casing); // true
     * }
     * 
     * const thai = scriptInfoFactory('Thai');
     * if (thai) {
     *     console.log(thai.casing); // false
     * }
     * ```
     */
    readonly casing: boolean;

    /**
     * Internal constructor - use scriptInfoFactory() instead.
     *
     * @private
     * @param script - The ISO 15924 4-letter script code
     * @param info - The script information data
     * @internal
     */
    constructor(script: string, info: ScriptInfoData) {
        this.code = script;
        this.codeNumber = info.nb;
        this.name = info.nm;
        this.longCode = info.lid;
        this.scriptDirection = info.rtl ? ScriptDirection.RTL : ScriptDirection.LTR;
        this.needsIME = info.ime || false;
        this.casing = info.casing || false;
    }

    /**
     * Gets all available script codes.
     *
     * @returns Array of all ISO 15924 4-letter script codes
     *
     * @example
     * ```typescript
     * const allScripts = ScriptInfo.getAllScripts();
     * console.log(allScripts.includes('Latn')); // true
     * console.log(allScripts.includes('Arab')); // true
     * ```
     */
    static getAllScripts(): string[] {
        return ScriptInfo._getScriptsArray();
    }

    /**
     * Internal method to get the scripts array.
     * 
     * @returns Array of all script codes
     * @internal
     */
    private static _getScriptsArray(): string[] {
        return getAllScriptCodes();
    }
}
