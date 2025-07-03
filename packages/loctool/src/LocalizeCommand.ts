/*
 * LocalizeCommand.ts - command to extract strings and generate localized resource files
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

import * as fs from 'fs';
import * as path from 'path';
import { BaseCommand } from './ICommand';
import { Config } from './Config';
import { Project } from './Project';

/**
 * Command to extract strings and generate localized resource files.
 * This is the default command.
 */
export class LocalizeCommand extends BaseCommand {
    readonly name = 'localize';
    readonly description = 'Extract strings and generate localized resource files. This is the default command.';

    private projectQueue: any[] = [];

    constructor(config: Config) {
        super(config);
    }

    async init(): Promise<void> {
        await super.init();
        
        const logger = this.getLogger();
        logger.info("loctool - extract strings from source code and localize them.");
        logger.info("Command: localize");
        logger.info("Searching root: " + this.config.rootDir);

        if (!fs.existsSync(this.config.rootDir)) {
            throw new Error("Could not access root dir " + this.config.rootDir);
        }
    }

    async run(): Promise<void> {
        const logger = this.getLogger();
        
        try {
            // Walk the directory tree to find projects
            await this.walk(this.config.rootDir);
            
            // Process all found projects
            await this.processProjects();
            
            logger.info("Done");
            
        } catch (error) {
            logger.error("Error during localization:", error);
            throw error;
        }
    }

    /**
     * Walk the directory tree to find and collect projects
     */
    private async walk(dir: string, parentProject?: Project): Promise<void> {
        const logger = this.getLogger();
        logger.trace("Searching " + dir);

        let project = parentProject;
        let projectRoot = false;

        // Try to create a new project if we find a project.json
        const newProject = await this.createProjectIfExists(dir);
        if (newProject) {
            project = newProject;
            projectRoot = true;
            logger.info("-------------------------------------------------------------------------------------------");
            logger.info('Project "' + project.config.name + '", type: ' + project.config.projectType);
            logger.trace("Project: ");
            logger.trace(project);

            this.projectQueue.push(project);

            // Handle includes
            if (project.config.includes && project.config.includes.length > 0) {
                for (const p of project.config.includes) {
                    if (fs.existsSync(p)) {
                        const stat = fs.statSync(p);
                        if (stat && stat.isDirectory()) {
                            logger.info(p);
                            await this.walk(p, project);
                        } else {
                            project.addPath(p);
                        }
                    } else {
                        logger.warn("File " + p + " which is listed in the includes in the project.json does not exist any more.");
                    }
                }
            }
        }

        const list = fs.readdirSync(dir);
        if (list && list.length !== 0) {
            for (const file of list.sort()) {
                const root = project ? project.getRoot() : this.config.rootDir;
                const pathName = path.join(dir, file);
                const relPath = path.relative(root, pathName);
                let included = true;

                if (project) {
                    const excludes = project.config.excludes || [];
                    if (excludes.length > 0) {
                        logger.trace("There are excludes. Relpath is " + relPath);
                        if (this.isMatch(relPath, excludes)) {
                            included = false;
                        }
                    }

                    // override the excludes
                    if (project.config.includes && project.config.includes.length > 0) {
                        logger.trace("There are includes. Relpath is " + relPath);
                        if (this.isMatch(relPath, project.config.includes)) {
                            included = true;
                        }
                    }
                } else {
                    if (this.isMatch(relPath, this.config.excludes)) {
                        included = false;
                    }
                }

                if (included) {
                    logger.trace("Included.");
                    if (fs.existsSync(pathName)) {
                        const stat = fs.statSync(pathName);
                        if (stat && stat.isDirectory()) {
                            logger.info(pathName);
                            await this.walk(pathName, project);
                        } else {
                            if (project) {
                                logger.info(relPath);
                                project.addPath(relPath);
                            } else {
                                logger.trace("Ignoring non-project file: " + relPath);
                            }
                        }
                    } else {
                        logger.warn("File " + pathName + " does not exist.");
                    }
                } else {
                    logger.trace("Excluded.");
                }
            }
        }

        if (projectRoot && project) {
            logger.info('Project "' + project.config.name + '" is done.');
            logger.info("-------------------------------------------------------------------------------------------");
        }
    }

    /**
     * Create a project if a project.json exists in the directory
     */
    private async createProjectIfExists(dir: string): Promise<Project | undefined> {
        const projectJsonPath = path.join(dir, "project.json");
        
        if (fs.existsSync(projectJsonPath)) {
            try {
                const data = fs.readFileSync(projectJsonPath, 'utf8');
                if (data.length > 0) {
                    const projectJson = JSON.parse(data);
                    const projectConfig = Config.fromProjectJson(projectJson);
                    const mergedConfig = Config.merge(this.config, projectConfig);
                    
                    return new Project(mergedConfig, dir);
                }
            } catch (error) {
                this.getLogger().error("Error parsing project.json at " + projectJsonPath + ":", error);
            }
        }
        
        return undefined;
    }

    /**
     * Process all projects in the queue
     */
    private async processProjects(): Promise<void> {
        const logger = this.getLogger();
        
        for (const project of this.projectQueue) {
            logger.debug("Processing project " + project.getProjectId());
            
            try {
                await this.initProject(project);
                await this.extractProject(project);
                this.generatePseudoProject(project);
                await this.writeProject(project);
                await this.saveProject(project);
                await this.closeProject(project);
            } catch (error) {
                logger.error(`Error processing project ${project.getProjectId()}:`, error);
                throw error;
            }
        }
    }

    /**
     * Initialize a project
     */
    private async initProject(project: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                project.init(() => {
                    resolve();
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Extract strings from a project
     */
    private async extractProject(project: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                project.extract(() => {
                    resolve();
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Generate pseudo-localization for a project (synchronous)
     */
    private generatePseudoProject(project: any): void {
        project.generatePseudo();
    }

    /**
     * Write output files for a project
     */
    private async writeProject(project: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                project.write(() => {
                    resolve();
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Save translations for a project
     */
    private async saveProject(project: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                project.save(() => {
                    resolve();
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Close a project
     */
    private async closeProject(project: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                project.close(() => {
                    resolve();
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Simple pattern matching (basic implementation)
     */
    private isMatch(path: string, patterns: string[]): boolean {
        // This is a simplified implementation - in the real code, 
        // you would use micromatch or similar for glob pattern matching
        return patterns.some(pattern => {
            // Simple exact match for now
            return path === pattern || path.includes(pattern);
        });
    }
} 