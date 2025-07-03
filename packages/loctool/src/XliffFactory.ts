/*
 * XliffFactory.ts - factory for creating xliff instances based on style
 *
 * Copyright © 2025 HealthTap, Inc.
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

import { Config } from './Config';

// Declare module types for external dependencies
declare const require: any;

/**
 * Interface that all xliff implementations must implement
 */
export interface IXliff {
    /**
     * Parse an xliff string and return the parsed data
     */
    parse(xliffContent: string): any;

    /**
     * Generate an xliff string from the given data
     */
    generate(data: any): string;

    /**
     * Get the xliff version supported by this implementation
     */
    getVersion(): string;

    /**
     * Get the xliff style name
     */
    getStyle(): string;

    /**
     * Add a translation unit to the xliff
     */
    addTranslationUnit(unit: any): void;

    /**
     * Get all translation units from the xliff
     */
    getTranslationUnits(): any[];

    /**
     * Set the source and target locales
     */
    setLocales(sourceLocale: string, targetLocale: string): void;

    /**
     * Get the source locale
     */
    getSourceLocale(): string;

    /**
     * Get the target locale
     */
    getTargetLocale(): string;
}

/**
 * Factory function to create xliff instances based on the xliffStyle config setting
 */
export function createXliff(config: Config): IXliff {
    const style = config.xliffStyle || 'standard';
    const version = config.xliffVersion || 1.2;

    switch (style.toLowerCase()) {
        case 'standard':
            return new StandardXliff(version);
        case 'custom':
            return new CustomXliff(version);
        default:
            throw new Error(`Unsupported xliff style: ${style}. Supported styles are: standard, custom`);
    }
}

/**
 * Standard xliff implementation using ResourceXliff from ilib-tools-common
 */
export class StandardXliff implements IXliff {
    private version: string;
    private resourceXliff: any;
    private sourceLocale: string = 'en-US';
    private targetLocale: string = 'en-US';

    constructor(version: number | string) {
        this.version = String(version);
        
        // Import ResourceXliff from ilib-tools-common
        const { ResourceXliff } = require('ilib-tools-common');
        this.resourceXliff = new ResourceXliff({
            version: this.version,
            sourceLocale: this.sourceLocale,
            targetLocale: this.targetLocale
        });
    }

    parse(xliffContent: string): any {
        return this.resourceXliff.parse(xliffContent);
    }

    generate(data: any): string {
        return this.resourceXliff.generate(data);
    }

    getVersion(): string {
        return this.version;
    }

    getStyle(): string {
        return 'standard';
    }

    addTranslationUnit(unit: any): void {
        this.resourceXliff.addTranslationUnit(unit);
    }

    getTranslationUnits(): any[] {
        return this.resourceXliff.getTranslationUnits() || [];
    }

    setLocales(sourceLocale: string, targetLocale: string): void {
        this.sourceLocale = sourceLocale;
        this.targetLocale = targetLocale;
        this.resourceXliff.setSourceLocale(sourceLocale);
        this.resourceXliff.setTargetLocale(targetLocale);
    }

    getSourceLocale(): string {
        return this.sourceLocale;
    }

    getTargetLocale(): string {
        return this.targetLocale;
    }
}

/**
 * Custom xliff implementation with loctool-specific formatting
 */
export class CustomXliff implements IXliff {
    private version: string;
    private sourceLocale: string = 'en-US';
    private targetLocale: string = 'en-US';
    private translationUnits: any[] = [];
    private metadata: any = {};

    constructor(version: number | string) {
        this.version = String(version);
    }

    parse(xliffContent: string): any {
        // Custom parsing logic for loctool-specific xliff format
        try {
            const parser = require('xml2js');
            return new Promise((resolve, reject) => {
                parser.parseString(xliffContent, (err: any, result: any) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    // Extract translation units with custom logic
                    this.extractCustomTranslationUnits(result);
                    resolve(result);
                });
            });
        } catch (error) {
            throw new Error(`Failed to parse custom xliff: ${error}`);
        }
    }

    generate(data: any): string {
        // Custom generation logic for loctool-specific xliff format
        const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>`;
        const xliffVersion = this.version === '2' || this.version === '2.0' ? '2.1' : '1.2';
        
        if (xliffVersion.startsWith('2')) {
            return this.generateXliff2(data);
        } else {
            return this.generateXliff12(data);
        }
    }

    private generateXliff12(data: any): string {
        const units = this.translationUnits.map(unit => {
            const target = unit.target ? `<target>${this.escapeXml(unit.target)}</target>` : '';
            const comment = unit.comment ? `<!-- ${this.escapeXml(unit.comment)} -->` : '';
            const state = unit.state ? ` state="${unit.state}"` : '';
            
            return `    <trans-unit id="${this.escapeXml(unit.id)}"${state}>
      ${comment}
      <source>${this.escapeXml(unit.source)}</source>
      ${target}
      <note>${this.escapeXml(unit.note || '')}</note>
    </trans-unit>`;
        }).join('\n');

        return `<?xml version="1.0" encoding="UTF-8"?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file source-language="${this.sourceLocale}" target-language="${this.targetLocale}" datatype="plaintext">
    <header>
      <tool tool-id="loctool" tool-name="loctool" tool-version="2.12.0"/>
    </header>
    <body>
${units}
    </body>
  </file>
</xliff>`;
    }

    private generateXliff2(data: any): string {
        const units = this.translationUnits.map(unit => {
            const target = unit.target ? `<target>${this.escapeXml(unit.target)}</target>` : '';
            const comment = unit.comment ? `<!-- ${this.escapeXml(unit.comment)} -->` : '';
            const state = unit.state ? ` state="${unit.state}"` : '';
            
            return `    <unit id="${this.escapeXml(unit.id)}"${state}>
      ${comment}
      <segment>
        <source>${this.escapeXml(unit.source)}</source>
        ${target}
      </segment>
      <notes>
        <note>${this.escapeXml(unit.note || '')}</note>
      </notes>
    </unit>`;
        }).join('\n');

        return `<?xml version="1.0" encoding="UTF-8"?>
<xliff version="2.1" xmlns="urn:oasis:names:tc:xliff:document:2.1" srcLang="${this.sourceLocale}" trgLang="${this.targetLocale}">
  <file id="loctool">
    <header>
      <tool tool-id="loctool" tool-name="loctool" tool-version="2.12.0"/>
    </header>
${units}
  </file>
</xliff>`;
    }

    private extractCustomTranslationUnits(parsedXml: any): void {
        // Custom extraction logic for parsing xliff with loctool-specific features
        this.translationUnits = [];
        
        // Implementation would depend on the specific custom format requirements
        // This is a placeholder for the custom extraction logic
        if (parsedXml && parsedXml.xliff && parsedXml.xliff.file) {
            const files = Array.isArray(parsedXml.xliff.file) ? parsedXml.xliff.file : [parsedXml.xliff.file];
            
            files.forEach((file: any) => {
                if (file.body && file.body['trans-unit']) {
                    const units = Array.isArray(file.body['trans-unit']) ? file.body['trans-unit'] : [file.body['trans-unit']];
                    
                    units.forEach((unit: any) => {
                        this.translationUnits.push({
                            id: unit.$.id,
                            source: unit.source && unit.source[0],
                            target: unit.target && unit.target[0],
                            state: unit.$.state,
                            note: unit.note && unit.note[0]
                        });
                    });
                }
            });
        }
    }

    private escapeXml(text: string): string {
        if (!text) return '';
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }

    getVersion(): string {
        return this.version;
    }

    getStyle(): string {
        return 'custom';
    }

    addTranslationUnit(unit: any): void {
        this.translationUnits.push({
            id: unit.id || Date.now().toString(),
            source: unit.source,
            target: unit.target,
            state: unit.state,
            note: unit.note,
            comment: unit.comment
        });
    }

    getTranslationUnits(): any[] {
        return this.translationUnits;
    }

    setLocales(sourceLocale: string, targetLocale: string): void {
        this.sourceLocale = sourceLocale;
        this.targetLocale = targetLocale;
    }

    getSourceLocale(): string {
        return this.sourceLocale;
    }

    getTargetLocale(): string {
        return this.targetLocale;
    }
} 