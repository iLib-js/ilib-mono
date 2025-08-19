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
    const index = scriptData.findIndex((entry: ScriptDataEntry) => entry[0] === code);
    if (index === -1) return undefined;
    
    const data = scriptData[index];
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
 * import ScriptInfo from 'ilib-scriptinfo';
 *
 * const latin = new ScriptInfo('Latn');
 * console.log(latin.getName()); // "Latin"
 * console.log(latin.getScriptDirection()); // "ltr" (left-to-right)
 *
 * const arabic = new ScriptInfo('Arab');
 * console.log(arabic.getScriptDirection()); // "rtl" (right-to-left)
 * ```
 */
export default class ScriptInfo {
    private script: string | number | null | undefined;
    private scriptString: string;
    private info: ScriptInfoData | undefined;

    /**
     * Creates a new ScriptInfo instance for the specified script.
     *
     * @param script - The ISO 15924 4-letter script code (e.g., 'Latn', 'Arab', 'Hani')
     *
     * If the script code is not recognized or is invalid:
     * - The instance will still be created successfully
     * - `getCode()` will return the original input
     * - `getCodeNumber()`, `getName()`, and `getLongCode()` will return `undefined`
     * - `getScriptDirection()` will return `ScriptDirection.LTR` (default)
     * - `getNeedsIME()` and `getCasing()` will return `false` (default)
     *
     * @example
     * ```typescript
     * const latin = new ScriptInfo('Latn');
     * const unknown = new ScriptInfo('Xyz'); // Still creates instance
     * ```
     */
    constructor(script: string | number | null | undefined) {
        this.script = script;
        this.scriptString = String(script || '');
        this.info = this.scriptString ? getScriptInfo(this.scriptString) : undefined;
    }

    /**
     * Gets the ISO 15924 4-letter script code.
     *
     * @returns The script code exactly as provided to the constructor
     *
     * @example
     * ```typescript
     * const latin = new ScriptInfo('Latn');
     * console.log(latin.getCode()); // "Latn"
     * 
     * const numeric = new ScriptInfo(123);
     * console.log(numeric.getCode()); // 123
     * 
     * const nullScript = new ScriptInfo(null);
     * console.log(nullScript.getCode()); // null
     * ```
     */
    getCode(): string | number | null | undefined {
        return this.script;
    }

    /**
     * Gets the ISO 15924 script number.
     *
     * @returns The numeric script code, or `undefined` if not recognized
     *
     * @example
     * ```typescript
     * const latin = new ScriptInfo('Latn');
     * console.log(latin.getCodeNumber()); // 215
     * ```
     */
    getCodeNumber(): number | undefined {
        return this.info?.nb;
    }

    /**
     * Gets the English name of the script.
     *
     * @returns The script name in English, or `undefined` if not recognized
     *
     * @example
     * ```typescript
     * const latin = new ScriptInfo('Latn');
     * console.log(latin.getName()); // "Latin"
     * ```
     */
    getName(): string | undefined {
        return this.info?.nm;
    }

    /**
     * Gets the long identifier for the script.
     *
     * @returns The long script identifier, or `undefined` if not recognized
     *
     * @example
     * ```typescript
     * const latin = new ScriptInfo('Latn');
     * console.log(latin.getLongCode()); // "Latin"
     * ```
     */
    getLongCode(): string | undefined {
        return this.info?.lid;
    }

    /**
     * Gets the writing direction of the script.
     *
     * @returns `ScriptDirection.LTR` for left-to-right scripts,
     *          `ScriptDirection.RTL` for right-to-left scripts,
     *          or `ScriptDirection.LTR` as default for unknown scripts
     *
     * @example
     * ```typescript
     * const latin = new ScriptInfo('Latn');
     * console.log(latin.getScriptDirection()); // ScriptDirection.LTR
     *
     * const arabic = new ScriptInfo('Arab');
     * console.log(arabic.getScriptDirection()); // ScriptDirection.RTL
     * ```
     */
    getScriptDirection(): ScriptDirection {
        return this.info?.rtl ? ScriptDirection.RTL : ScriptDirection.LTR;
    }

    /**
     * Checks if the script requires an Input Method Editor (IME).
     *
     * @returns `true` if the script requires an IME, `false` otherwise
     *
     * @example
     * ```typescript
     * const chinese = new ScriptInfo('Hani');
     * console.log(chinese.getNeedsIME()); // true
     *
     * const latin = new ScriptInfo('Latn');
     * console.log(latin.getNeedsIME()); // false
     * ```
     */
    getNeedsIME(): boolean {
        return this.info?.ime || false;
    }

    /**
     * Checks if the script has special casing behavior.
     *
     * @returns `true` if the script has special casing, `false` otherwise
     *
     * @example
     * ```typescript
     * const latin = new ScriptInfo('Latn');
     * console.log(latin.getCasing()); // true
     *
     * const thai = new ScriptInfo('Thai');
     * console.log(thai.getCasing()); // false
     * ```
     */
    getCasing(): boolean {
        return this.info?.casing || false;
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
