/*
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

/**
 * Enumeration of script writing directions.
 */
export enum ScriptDirection {
    /** Left-to-right writing direction */
    LTR = "ltr",
    /** Right-to-left writing direction */
    RTL = "rtl"
}

/**
 * Interface representing the internal script data structure.
 * 
 * This interface defines the structure of script information as stored internally,
 * with all properties being required for known scripts.
 */
interface ScriptInfoData {
    /** ISO 15924 numeric code */
    nb: number;
    /** Script name in English */
    nm: string;
    /** Long identifier for the script */
    lid: string;
    /** Whether the script is right-to-left */
    rtl: boolean;
    /** Whether the script typically requires an IME */
    ime: boolean;
    /** Whether the script uses letter case */
    casing: boolean;
}

/**
 * Helper function to get script info with boolean flags from the script data.
 * 
 * @param code - The ISO 15924 4-letter script code
 * @returns ScriptInfoData object if found, null otherwise
 * 
 * @internal
 */
function getScriptInfo(code: string): ScriptInfoData | null {
    const index = scriptData.findIndex(entry => entry[0] === code);
    if (index === -1) return null;
    
    const data = scriptData[index];
    if (!data) return null;
    
    return {
        nb: data[1] as number,
        nm: data[2] as string,
        lid: data[3] as string,
        rtl: (data[4] as boolean) || false,
        ime: (data[5] as boolean) || false,
        casing: (data[6] as boolean) || false
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
    return scriptData.map(entry => entry[0] as string);
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
 * import { ScriptInfo } from 'ilib-scriptinfo';
 * 
 * const latin = new ScriptInfo('Latn');
 * console.log(latin.getName()); // "Latin"
 * console.log(latin.getScriptDirection()); // "ltr" (left-to-right)
 * 
 * const arabic = new ScriptInfo('Arab');
 * console.log(arabic.getScriptDirection()); // "rtl" (right-to-left)
 * ```
 */
export class ScriptInfo {
    private script: string;
    private info: ScriptInfoData | null;

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
     * // Valid script
     * const scriptInfo = new ScriptInfo('Latn');
     * 
     * // Unknown script
     * const unknown = new ScriptInfo('Xxxx');
     * console.log(unknown.getCode()); // "Xxxx"
     * console.log(unknown.getName()); // undefined
     * console.log(unknown.getScriptDirection()); // ScriptDirection.LTR
     * ```
     */
    constructor(script: string) {
        this.script = script;
        this.info = script ? getScriptInfo(script) : null;
    }

    /**
     * Returns the ISO 15924 4-letter script code.
     * 
     * @returns The script code as a string, or the original input if the script is not found
     * 
     * @example
     * ```typescript
     * const scriptInfo = new ScriptInfo('Latn');
     * console.log(scriptInfo.getCode()); // "Latn"
     * 
     * const unknown = new ScriptInfo('Xxxx');
     * console.log(unknown.getCode()); // "Xxxx"
     * ```
     */
    getCode(): string {
        return this.script;
    }

    /**
     * Returns the ISO 15924 numeric code for the script.
     * 
     * @returns The numeric code as a number, or undefined if the script is not found
     * 
     * @example
     * ```typescript
     * const scriptInfo = new ScriptInfo('Latn');
     * console.log(scriptInfo.getCodeNumber()); // 215
     * 
     * const unknown = new ScriptInfo('Xxxx');
     * console.log(unknown.getCodeNumber()); // undefined
     * ```
     */
    getCodeNumber(): number | undefined {
        return this.info?.nb;
    }

    /**
     * Returns the English name of the script.
     * 
     * @returns The script name as a string, or undefined if the script is not found
     * 
     * @example
     * ```typescript
     * const scriptInfo = new ScriptInfo('Latn');
     * console.log(scriptInfo.getName()); // "Latin"
     * 
     * const unknown = new ScriptInfo('Xxxx');
     * console.log(unknown.getName()); // undefined
     * ```
     */
    getName(): string | undefined {
        return this.info?.nm;
    }

    /**
     * Returns the long identifier for the script.
     * 
     * @returns The long identifier as a string, or undefined if the script is not found
     * 
     * @example
     * ```typescript
     * const scriptInfo = new ScriptInfo('Latn');
     * console.log(scriptInfo.getLongCode()); // "Latin"
     * 
     * const unknown = new ScriptInfo('Xxxx');
     * console.log(unknown.getLongCode()); // undefined
     * ```
     */
    getLongCode(): string | undefined {
        return this.info?.lid;
    }

    /**
     * Returns the writing direction of the script.
     * 
     * @returns `ScriptDirection.RTL` for right-to-left scripts, `ScriptDirection.LTR` for left-to-right scripts (default for unknown scripts)
     * 
     * @example
     * ```typescript
     * const latin = new ScriptInfo('Latn');
     * console.log(latin.getScriptDirection()); // ScriptDirection.LTR
     * 
     * const arabic = new ScriptInfo('Arab');
     * console.log(arabic.getScriptDirection()); // ScriptDirection.RTL
     * 
     * const unknown = new ScriptInfo('Xxxx');
     * console.log(unknown.getScriptDirection()); // ScriptDirection.LTR
     * ```
     */
    getScriptDirection(): ScriptDirection {
        return this.info?.rtl ? ScriptDirection.RTL : ScriptDirection.LTR;
    }

    /**
     * Returns whether the script typically requires an Input Method Editor (IME).
     * 
     * @returns true if the script typically requires an IME, false otherwise (default for unknown scripts)
     * 
     * @example
     * ```typescript
     * const latin = new ScriptInfo('Latn');
     * console.log(latin.getNeedsIME()); // false
     * 
     * const hangul = new ScriptInfo('Hang');
     * console.log(hangul.getNeedsIME()); // true
     * 
     * const unknown = new ScriptInfo('Xxxx');
     * console.log(unknown.getNeedsIME()); // false
     * ```
     */
    getNeedsIME(): boolean {
        return this.info?.ime ?? false;
    }

    /**
     * Returns whether the script uses letter case (uppercase/lowercase).
     * 
     * @returns true if the script uses letter case, false otherwise (default for unknown scripts)
     * 
     * @example
     * ```typescript
     * const latin = new ScriptInfo('Latn');
     * console.log(latin.getCasing()); // true
     * 
     * const arabic = new ScriptInfo('Arab');
     * console.log(arabic.getCasing()); // false
     * 
     * const unknown = new ScriptInfo('Xxxx');
     * console.log(unknown.getCasing()); // false
     * ```
     */
    getCasing(): boolean {
        return this.info?.casing ?? false;
    }

    /**
     * @internal
     * Returns an array of all available script codes.
     * 
     * @returns Array of ISO 15924 4-letter script codes
     */
    static _getScriptsArray(): string[] {
        return getAllScriptCodes();
    }

    /**
     * Returns an array of all available script codes.
     * 
     * @returns Array of ISO 15924 4-letter script codes for all supported scripts
     * 
     * @example
     * ```typescript
     * const allScripts = ScriptInfo.getAllScripts();
     * console.log(allScripts.length); // 226
     * console.log(allScripts.includes('Latn')); // true
     * console.log(allScripts.includes('Arab')); // true
     * ```
     */
    static getAllScripts(): string[] {
        return ScriptInfo._getScriptsArray();
    }
} 