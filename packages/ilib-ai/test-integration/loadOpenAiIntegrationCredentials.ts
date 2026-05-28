/*
 * loadOpenAiIntegrationCredentials.ts — fixed path under test-integration/
 *
 * Copyright © 2026, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

import fs from "fs";
import path from "path";

import type { OpenAIModelInitOptions } from "../src/OpenAIModelInitOptions";

/** Mandated filename (inside `test-integration/`). */
export const OPENAI_INTEGRATION_CREDENTIALS_FILE =
    "openai-integration-credentials.json";

/**
 * **`openai-integration-credentials.json`**: local overlay for OpenAI integration tests.
 * Fields match {@link OpenAIModelInitOptions}; {@link integrationTestModel} is test-only.
 */
export type OpenAiIntegrationCredentialsFile = OpenAIModelInitOptions & {
    /**
     * Default model id for integration prompt tests when a test does not override `model`.
     * Not passed to {@link OpenAIModelAdapter}.
     */
    integrationTestModel?: string;
};

/**
 * Absolute path to **`test-integration/openai-integration-credentials.json`** for this package.
 */
export function resolveOpenAiIntegrationCredentialsPath(
    packageRoot: string
): string {
    return path.join(
        packageRoot,
        "test-integration",
        OPENAI_INTEGRATION_CREDENTIALS_FILE
    );
}

/**
 * Resolves `apiKey` from the credentials file, or from **`process.env.OPENAI_API_KEY`**
 * when the file omits a non-empty key. Exported for unit tests.
 */
export function resolveOpenAiApiKey(
    raw: OpenAiIntegrationCredentialsFile
): string | undefined {
    const fromFile = raw.apiKey?.trim();
    if (fromFile) {
        return fromFile;
    }
    const fromEnv = process.env.OPENAI_API_KEY?.trim();
    if (fromEnv) {
        return fromEnv;
    }
    return undefined;
}

/**
 * Maps a parsed credentials file to {@link OpenAIModelInitOptions}. Exported for unit tests.
 */
export function stripOpenAiIntegrationOnlyFields(
    raw: OpenAiIntegrationCredentialsFile
): OpenAIModelInitOptions {
    const { integrationTestModel: _m, ...rest } = raw;
    const apiKey = resolveOpenAiApiKey(raw);
    const init: OpenAIModelInitOptions = { ...rest };
    if (apiKey) {
        init.apiKey = apiKey;
    }
    return init;
}

/**
 * Read **`openai-integration-credentials.json`**. Relative paths in init fields are not used
 * today (OpenAI init is key + optional baseUrl only).
 */
export function loadOpenAiIntegrationCredentialsFile(
    packageRoot: string
): OpenAiIntegrationCredentialsFile {
    const configPath = resolveOpenAiIntegrationCredentialsPath(packageRoot);
    if (!fs.existsSync(configPath)) {
        return { apiKey: "" };
    }
    const absConfig = path.resolve(configPath);
    const raw = fs.readFileSync(absConfig, "utf8");
    return JSON.parse(raw) as OpenAiIntegrationCredentialsFile;
}

/** {@link OpenAIModelInitOptions} only, for {@link OpenAIModelAdapter}. */
export function loadOpenAiInit(packageRoot: string): OpenAIModelInitOptions {
    return stripOpenAiIntegrationOnlyFields(
        loadOpenAiIntegrationCredentialsFile(packageRoot)
    );
}

/** Model id for integration prompt tests (file override or cheap default). */
export function loadOpenAiIntegrationTestModel(packageRoot: string): string {
    try {
        const creds = loadOpenAiIntegrationCredentialsFile(packageRoot);
        const fromFile = creds.integrationTestModel?.trim();
        if (fromFile) {
            return fromFile;
        }
    } catch {
        /* fall through */
    }
    return "gpt-4o-mini";
}

export function openAiIntegrationCredentialsPresent(packageRoot: string): boolean {
    const configPath = resolveOpenAiIntegrationCredentialsPath(packageRoot);
    if (fs.existsSync(configPath)) {
        try {
            const creds = loadOpenAiIntegrationCredentialsFile(packageRoot);
            const apiKey = resolveOpenAiApiKey(creds);
            return !!apiKey;
        } catch {
            return false;
        }
    }
    return !!process.env.OPENAI_API_KEY?.trim();
}
