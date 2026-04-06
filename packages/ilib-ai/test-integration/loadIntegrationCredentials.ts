/*
 * loadIntegrationCredentials.ts — fixed path under test-integration/
 *
 * Copyright © 2026, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

import fs from "fs";
import path from "path";

import type {
    BoxAIModelInitOptions,
    BoxDeveloperJwtConfig,
} from "../src/BoxAIModelInitOptions";

/** Mandated filename (inside `test-integration/`). */
export const BOX_INTEGRATION_CREDENTIALS_FILE = "box-integration-credentials.json";

/**
 * **`box-integration-credentials.json`** (overlay): points at the Box JWT file via
 * {@link BoxAIModelInitOptions.configPath} or {@link jwtConfigPath}, plus integration-only
 * fields. Alternatively, the same file may embed {@link boxAppSettings} (single-file setup).
 */
export type BoxIntegrationCredentialsFile = BoxAIModelInitOptions & {
    /**
     * Path to the Developer Console JWT file (`<enterpriseID>_<publicKeyID>_config.json`).
     * Same as {@link BoxAIModelInitOptions.configPath}; if both are set, `configPath` wins.
     */
    jwtConfigPath?: string;
    /** Box file id passed to `createAiTextGen` `items`. Use this or `rootFolderId`. */
    contextFileId?: string;
    /** If `contextFileId` is omitted, the first file in this folder is used. */
    rootFolderId?: string;
    /**
     * Top-level key from the **Box Developer Console** JWT JSON download. When present,
     * {@link loadBoxInit} maps it (with `enterpriseID` / `userID`) to {@link BoxAIModelInitOptions.boxDeveloperJwtConfig}.
     */
    boxAppSettings?: BoxDeveloperJwtConfig["boxAppSettings"];
    /** Box console export (capital `ID`). */
    enterpriseID?: string;
    /** Box console export for app user subject. */
    userID?: string;
};

/**
 * Absolute path to **`test-integration/box-integration-credentials.json`** for this package.
 */
export function resolveIntegrationCredentialsPath(packageRoot: string): string {
    return path.join(packageRoot, "test-integration", BOX_INTEGRATION_CREDENTIALS_FILE);
}

/**
 * Maps a parsed `box-integration-credentials.json` (including Box Developer Console download
 * shape) to {@link BoxAIModelInitOptions}. Exported for unit tests.
 */
export function stripIntegrationOnlyFields(
    raw: BoxIntegrationCredentialsFile
): BoxAIModelInitOptions {
    const { contextFileId: _c, rootFolderId: _r, ...rest } = raw;

    if (rest.boxDeveloperJwtConfig?.boxAppSettings) {
        const out: BoxAIModelInitOptions = {
            boxDeveloperJwtConfig: rest.boxDeveloperJwtConfig,
        };
        if (rest.userId !== undefined && String(rest.userId).trim() !== "") {
            out.userId = String(rest.userId);
        }
        if (
            rest.enterpriseId !== undefined &&
            String(rest.enterpriseId).trim() !== ""
        ) {
            out.enterpriseId = String(rest.enterpriseId);
        }
        return out;
    }

    if (
        rest.boxAppSettings &&
        typeof rest.boxAppSettings === "object" &&
        rest.boxAppSettings !== null
    ) {
        const cfg: BoxDeveloperJwtConfig = {
            boxAppSettings: rest.boxAppSettings,
        };
        if (
            rest.enterpriseID !== undefined &&
            String(rest.enterpriseID).trim() !== ""
        ) {
            cfg.enterpriseID = String(rest.enterpriseID);
        }
        if (rest.userID !== undefined && String(rest.userID).trim() !== "") {
            cfg.userID = String(rest.userID);
        }
        const out: BoxAIModelInitOptions = {
            boxDeveloperJwtConfig: cfg,
        };
        if (rest.userId !== undefined && String(rest.userId).trim() !== "") {
            out.userId = String(rest.userId);
        }
        if (
            rest.enterpriseId !== undefined &&
            String(rest.enterpriseId).trim() !== ""
        ) {
            out.enterpriseId = String(rest.enterpriseId);
        }
        return out;
    }

    return rest as BoxAIModelInitOptions;
}

/**
 * After parsing **`box-integration-credentials.json`**: merges **`jwtConfigPath`** into
 * **`configPath`**, then resolves relative **`privateKeyPath`** / **`configPath`** against
 * **`baseDir`** (the `test-integration` directory).
 */
export function normalizeIntegrationCredentialPaths(
    parsed: BoxIntegrationCredentialsFile,
    baseDir: string
): BoxIntegrationCredentialsFile {
    if (!parsed.configPath && parsed.jwtConfigPath) {
        parsed.configPath = parsed.jwtConfigPath;
    }
    delete (parsed as { jwtConfigPath?: string }).jwtConfigPath;

    if (parsed.privateKeyPath && !path.isAbsolute(parsed.privateKeyPath)) {
        parsed.privateKeyPath = path.join(baseDir, parsed.privateKeyPath);
    }
    if (parsed.configPath && !path.isAbsolute(parsed.configPath)) {
        parsed.configPath = path.join(baseDir, parsed.configPath);
    }
    return parsed;
}

/**
 * Read and normalize paths. Relative **`privateKeyPath`** / **`configPath`** are resolved against
 * the **`test-integration`** directory (where the JSON file lives).
 */
export function loadIntegrationCredentialsFile(
    packageRoot: string
): BoxIntegrationCredentialsFile {
    const configPath = resolveIntegrationCredentialsPath(packageRoot);
    const absConfig = path.resolve(configPath);
    const raw = fs.readFileSync(absConfig, "utf8");
    const parsed = JSON.parse(raw) as BoxIntegrationCredentialsFile;
    const baseDir = path.dirname(absConfig);
    return normalizeIntegrationCredentialPaths(parsed, baseDir);
}

/** {@link BoxAIModelInitOptions} only, for adapters and `createBoxClientFromInit`. */
export function loadBoxInit(packageRoot: string): BoxAIModelInitOptions {
    return stripIntegrationOnlyFields(loadIntegrationCredentialsFile(packageRoot));
}

export function integrationCredentialsPresent(packageRoot: string): boolean {
    const configPath = resolveIntegrationCredentialsPath(packageRoot);
    if (!fs.existsSync(configPath)) {
        return false;
    }
    try {
        const creds = loadIntegrationCredentialsFile(packageRoot);
        const init = stripIntegrationOnlyFields(creds);
        if (init.boxDeveloperJwtConfig?.boxAppSettings) {
            return true;
        }
        if (init.privateKeyPath && !fs.existsSync(init.privateKeyPath)) {
            return false;
        }
        if (init.configPath && !fs.existsSync(init.configPath)) {
            return false;
        }
        if (
            !init.boxDeveloperJwtConfig?.boxAppSettings &&
            !init.configPath &&
            !init.accessToken &&
            !(init.clientId && (init.privateKeyPath || init.privateKey))
        ) {
            return false;
        }
        return true;
    } catch {
        return false;
    }
}
