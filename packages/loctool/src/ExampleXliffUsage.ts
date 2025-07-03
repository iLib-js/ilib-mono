/*
 * ExampleXliffUsage.ts - example of how to use the xliff factory
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
import { createXliff } from './XliffFactory';
import { XliffUtils } from './XliffUtils';

// Declare module types
declare const require: any;
declare const module: any;

/**
 * Example showing how to use the xliff factory in existing loctool functionality
 */
export class ExampleXliffUsage {
    
    /**
     * Example: Create an xliff file based on config settings
     */
    static async createXliffExample(config: Config): Promise<void> {
        console.log(`Creating xliff with style: ${config.xliffStyle}, version: ${config.xliffVersion}`);
        
        // Create xliff instance based on config
        const xliff = createXliff(config);
        
        console.log(`Created ${xliff.getStyle()} xliff version ${xliff.getVersion()}`);
        
        // Set locales
        xliff.setLocales(config.sourceLocale || 'en-US', config.targetLocale || 'es-ES');
        
        // Add some sample translation units
        xliff.addTranslationUnit({
            id: 'welcome.message',
            source: 'Welcome to our application!',
            target: '¡Bienvenido a nuestra aplicación!',
            state: 'translated',
            note: 'Welcome message shown on home page'
        });
        
        xliff.addTranslationUnit({
            id: 'login.button',
            source: 'Log In',
            target: 'Iniciar Sesión',
            state: 'translated',
            note: 'Login button text'
        });
        
        // Generate xliff content
        const xliffContent = xliff.generate({});
        console.log('Generated xliff content:', xliffContent.substring(0, 200) + '...');
    }
    
    /**
     * Example: Process xliff files using utility functions
     */
    static async processXliffExample(config: Config): Promise<void> {
        const inputFiles = ['input1.xliff', 'input2.xliff'];
        const outputFile = 'merged.xliff';
        
        try {
            // Merge multiple xliff files
            await XliffUtils.mergeXliffFiles(inputFiles, outputFile, config);
            console.log(`Merged xliff files into ${outputFile}`);
            
            // Split by language
            const languageFiles = await XliffUtils.splitXliffByLanguage(outputFile, './output/languages', config);
            console.log('Split by language:', languageFiles);
            
            // Split by project
            const projectFiles = await XliffUtils.splitXliffByProject(outputFile, './output/projects', config);
            console.log('Split by project:', projectFiles);
            
            // Validate xliff file
            const validation = await XliffUtils.validateXliffFile(outputFile, config);
            if (validation.valid) {
                console.log('Xliff file is valid');
            } else {
                console.log('Xliff validation errors:', validation.errors);
            }
            
        } catch (error) {
            console.error('Error processing xliff files:', error);
        }
    }
    
    /**
     * Example: Compare standard vs custom xliff output
     */
    static async compareXliffStyles(): Promise<void> {
        const standardConfig = new Config({
            xliffStyle: 'standard',
            xliffVersion: 1.2,
            sourceLocale: 'en-US',
            targetLocale: 'fr-FR'
        });
        
        const customConfig = new Config({
            xliffStyle: 'custom',
            xliffVersion: 2.0,
            sourceLocale: 'en-US',
            targetLocale: 'fr-FR'
        });
        
        // Create both xliff types
        const standardXliff = createXliff(standardConfig);
        const customXliff = createXliff(customConfig);
        
        // Set same locales
        standardXliff.setLocales('en-US', 'fr-FR');
        customXliff.setLocales('en-US', 'fr-FR');
        
        // Add same translation unit to both
        const sampleUnit = {
            id: 'sample.text',
            source: 'Hello, world!',
            target: 'Bonjour, le monde!',
            state: 'translated',
            note: 'Sample greeting'
        };
        
        standardXliff.addTranslationUnit(sampleUnit);
        customXliff.addTranslationUnit(sampleUnit);
        
        // Generate and compare
        const standardOutput = standardXliff.generate({});
        const customOutput = customXliff.generate({});
        
        console.log('\n=== Standard Xliff Output ===');
        console.log(standardOutput);
        
        console.log('\n=== Custom Xliff Output ===');
        console.log(customOutput);
        
        console.log('\n=== Comparison ===');
        console.log(`Standard style: ${standardXliff.getStyle()}, version: ${standardXliff.getVersion()}`);
        console.log(`Custom style: ${customXliff.getStyle()}, version: ${customXliff.getVersion()}`);
    }
}

// Example usage
if (require.main === module) {
    const config = new Config({
        xliffStyle: 'standard', // or 'custom'
        xliffVersion: 1.2,
        sourceLocale: 'en-US',
        targetLocale: 'es-ES'
    });
    
    ExampleXliffUsage.createXliffExample(config).catch(console.error);
    ExampleXliffUsage.processXliffExample(config).catch(console.error);
    ExampleXliffUsage.compareXliffStyles().catch(console.error);
} 