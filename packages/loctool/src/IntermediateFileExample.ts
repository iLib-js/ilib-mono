/*
 * IntermediateFileExample.ts - example usage of the intermediate file factory
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

import { 
    getIntermediateFile, 
    getIntermediateFileExtension, 
    getIntermediateFileExtensions,
    getIntermediateFileType,
    isIntermediateFile
} from './IntermediateFileFactory';
import { IntermediateFileOptions } from './IIntermediateFile';

// Declare require for Node.js modules
declare const require: any;
declare const module: any;

/**
 * Example class demonstrating usage of the intermediate file factory
 */
export class IntermediateFileExample {
    
    /**
     * Example: Create different types of intermediate files
     */
    static async createIntermediateFiles(): Promise<void> {
        console.log('=== Creating Different Intermediate File Types ===');
        
        // XLIFF file example
        const xliffOptions: IntermediateFileOptions = {
            path: './output/example.xliff',
            type: 'xliff',
            project: 'ExampleProject',
            sourceLocale: 'en-US',
            targetLocale: 'es-ES',
            version: '1.2',
            style: 'standard'
        };
        
        const xliffFile = getIntermediateFile(xliffOptions);
        console.log(`Created ${xliffFile.getType()} file: ${xliffFile.path}`);
        
        // PO file example  
        const poOptions: IntermediateFileOptions = {
            path: './output/example.po',
            type: 'po',
            project: 'ExampleProject',
            sourceLocale: 'en-US',
            targetLocale: 'fr-FR',
            datatype: 'plaintext'
        };
        
        const poFile = getIntermediateFile(poOptions);
        console.log(`Created ${poFile.getType()} file: ${poFile.path}`);
        
        // Properties file example
        const propertiesOptions: IntermediateFileOptions = {
            path: './output/example.properties',
            type: 'properties',
            project: 'ExampleProject',
            sourceLocale: 'en-US',
            targetLocale: 'de-DE',
            contextInKey: true
        };
        
        const propertiesFile = getIntermediateFile(propertiesOptions);
        console.log(`Created ${propertiesFile.getType()} file: ${propertiesFile.path}`);
    }
    
    /**
     * Example: Auto-detect file type from extension
     */
    static async autoDetectFileTypes(): Promise<void> {
        console.log('\n=== Auto-detecting File Types ===');
        
        const filePaths = [
            './data/strings.xliff',
            './data/messages.po',
            './data/labels.properties',
            './data/unknown.txt'
        ];
        
        filePaths.forEach(filePath => {
            const type = getIntermediateFileType(filePath);
            const isIntermediate = isIntermediateFile(filePath);
            console.log(`${filePath}: type=${type || 'unknown'}, isIntermediate=${isIntermediate}`);
        });
    }
    
    /**
     * Example: Work with sample resources
     */
    static async workWithResources(): Promise<void> {
        console.log('\n=== Working with Sample Resources ===');
        
        // Create sample resources
        const sampleResources = [
            {
                id: 'welcome.message',
                source: 'Welcome to our application!',
                target: 'Bienvenido a nuestra aplicación!',
                getKey: () => 'welcome.message',
                getSource: () => 'Welcome to our application!',
                getTarget: () => 'Bienvenido a nuestra aplicación!',
                getState: () => 'translated',
                getComment: () => 'Welcome message shown on app start'
            },
            {
                id: 'button.login',
                source: 'Log In',
                target: 'Iniciar Sesión',
                getKey: () => 'button.login',
                getSource: () => 'Log In',
                getTarget: () => 'Iniciar Sesión',
                getState: () => 'translated',
                getComment: () => 'Login button text'
            }
        ];
        
        // Create a simple set-like structure
        const resourceSet = {
            resources: sampleResources,
            size: () => sampleResources.length,
            getAll: () => sampleResources,
            add: (resource: any) => sampleResources.push(resource),
            addAll: (resources: any[]) => sampleResources.push(...resources)
        };
        
        console.log(`Created resource set with ${resourceSet.size()} resources`);
        
        // Test with each intermediate file type
        await this.testFileTypeWithResources('xliff', resourceSet);
        await this.testFileTypeWithResources('po', resourceSet);
        await this.testFileTypeWithResources('properties', resourceSet);
    }
    
    /**
     * Test a specific file type with sample resources
     */
    private static async testFileTypeWithResources(fileType: string, resourceSet: any): Promise<void> {
        try {
            const extension = getIntermediateFileExtension(fileType);
            const filePath = `./output/test.${extension}`;
            
            console.log(`\n--- Testing ${fileType.toUpperCase()} format ---`);
            
            const options: IntermediateFileOptions = {
                path: filePath,
                type: fileType,
                project: 'TestProject',
                sourceLocale: 'en-US',
                targetLocale: 'es-ES',
                version: fileType === 'xliff' ? '1.2' : undefined,
                style: fileType === 'xliff' ? 'standard' : undefined
            };
            
            const intermediateFile = getIntermediateFile(options);
            
            console.log(`Created ${intermediateFile.getType()} intermediate file`);
            console.log(`Source locale: ${intermediateFile.getSourceLocale()}`);
            console.log(`Target locale: ${intermediateFile.getTargetLocale()}`);
            console.log(`Project: ${intermediateFile.getProject()}`);
            
            // Write resources to file
            intermediateFile.write(resourceSet);
            console.log(`Wrote ${resourceSet.size()} resources to ${filePath}`);
            
            // Note: Reading would require the actual files to exist
            // In a real scenario, you would read the file back like this:
            // const readResources = intermediateFile.read();
            // console.log(`Read back ${readResources.size()} resources`);
            
        } catch (error) {
            console.error(`Error testing ${fileType}: ${error}`);
        }
    }
    
    /**
     * Example: Show supported file extensions
     */
    static showSupportedExtensions(): void {
        console.log('\n=== Supported File Extensions ===');
        
        const extensions = getIntermediateFileExtensions();
        console.log('Supported extensions:', extensions.join(', '));
        
        // Show mapping of type to extension
        const types = ['xliff', 'po', 'properties'];
        types.forEach(type => {
            const ext = getIntermediateFileExtension(type);
            console.log(`${type} -> .${ext}`);
        });
    }
    
    /**
     * Example: Error handling
     */
    static demonstrateErrorHandling(): void {
        console.log('\n=== Error Handling Examples ===');
        
        // Try to create file with unsupported type
        try {
            getIntermediateFile({
                path: './output/test.xml',
                type: 'xml',
                project: 'Test',
                sourceLocale: 'en-US'
            });
        } catch (error) {
            console.log('Expected error for unsupported type:', (error as Error).message);
        }
        
        // Try to create file without options
        try {
            getIntermediateFile(null as any);
        } catch (error) {
            console.log('Expected error for null options:', (error as Error).message);
        }
        
        // Try to read non-existent file
        try {
            const file = getIntermediateFile({
                path: './nonexistent/file.xliff',
                project: 'Test',
                sourceLocale: 'en-US'
            });
            file.read();
        } catch (error) {
            console.log('Expected error for non-existent file:', (error as Error).message);
        }
    }
}

// Example usage
if (require.main === module) {
    console.log('Intermediate File Factory Examples\n');
    
    IntermediateFileExample.createIntermediateFiles().catch(console.error);
    IntermediateFileExample.autoDetectFileTypes().catch(console.error);
    IntermediateFileExample.workWithResources().catch(console.error);
    IntermediateFileExample.showSupportedExtensions();
    IntermediateFileExample.demonstrateErrorHandling();
} 