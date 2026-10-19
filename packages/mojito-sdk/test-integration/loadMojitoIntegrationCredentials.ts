/*
 * loadMojitoIntegrationCredentials.ts - local credentials for Mojito integration tests
 *
 * Copyright © 2026 JEDLSoft
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
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { MojitoConfig } from "../src/auth/mojito-config";
import type { MojitoClientOptions } from "../src/model/MojitoClient";

/** Mandated filename inside `test-integration/`. */
export const MOJITO_INTEGRATION_CREDENTIALS_FILE =
    "mojito-integration-credentials.json";

/**
 * Local overlay for Mojito integration tests.
 *
 * Connection fields match {@link MojitoClientOptions}. The remaining fields are
 * test-only and are not passed to {@link MojitoClient}.
 */
export type MojitoIntegrationCredentialsFile = MojitoClientOptions & {
    /** Prefer this repository when listing/searching. Empty means first listed. */
    repositoryName?: string;
    /** Optional source-text filter for the search smoke test. */
    searchSource?: string;
    /** Max strings to request in the search smoke test. Default: 5. */
    searchLimit?: number;
};

/** Test-only knobs stripped before constructing {@link MojitoClient}. */
export type MojitoIntegrationTestOptions = {
    repositoryName?: string;
    searchSource?: string;
    searchLimit: number;
};

/**
 * Absolute path to `test-integration/mojito-integration-credentials.json`.
 *
 * @param packageRoot Absolute path to the `mojito-sdk` package root.
 */
export function resolveMojitoIntegrationCredentialsPath(packageRoot: string): string {
    return join(packageRoot, "test-integration", MOJITO_INTEGRATION_CREDENTIALS_FILE);
}

/**
 * Resolve username from the credentials file or `MOJITO_USERNAME`.
 *
 * @param raw Parsed credentials file.
 * @returns Trimmed username, or undefined when neither source has one.
 */
export function resolveMojitoUsername(
    raw: MojitoIntegrationCredentialsFile,
): string | undefined {
    const fromFile = raw.username?.trim();
    if (fromFile) {
        return fromFile;
    }
    const fromEnv = process.env.MOJITO_USERNAME?.trim();
    return fromEnv || undefined;
}

/**
 * Resolve password from the credentials file or `MOJITO_PASSWORD`.
 *
 * @param raw Parsed credentials file.
 * @returns Password, or undefined when neither source has one.
 */
export function resolveMojitoPassword(
    raw: MojitoIntegrationCredentialsFile,
): string | undefined {
    const fromFile = raw.password?.trim();
    if (fromFile) {
        return fromFile;
    }
    const fromEnv = process.env.MOJITO_PASSWORD?.trim();
    return fromEnv || undefined;
}

/**
 * True when the credentials carry enough inline auth for the SDK to connect
 * without reading Mojito CLI property files.
 *
 * @param raw Parsed credentials file.
 */
export function hasInlineMojitoAuth(raw: MojitoIntegrationCredentialsFile): boolean {
    const headers = raw.headers ?? {};
    if (Object.keys(headers).length > 0) {
        return true;
    }
    if (raw.authenticationMode === "HEADER") {
        return false;
    }
    return !!(resolveMojitoUsername(raw) && resolveMojitoPassword(raw));
}

/**
 * True when the credentials ask to load CLI property files and at least one of
 * the resolved layered files exists on disk.
 *
 * @param raw Parsed credentials file.
 */
export function hasCliPropertyFiles(raw: MojitoIntegrationCredentialsFile): boolean {
    if (raw.loadCliConfig !== true) {
        return false;
    }
    const files = MojitoConfig.resolveCliConfigFiles({
        configDir: raw.configDir,
        configFiles: raw.configFiles,
        profiles: raw.profiles,
    });
    return files.some((file) => existsSync(file));
}

/**
 * Split a credentials file into client options and test-only knobs.
 *
 * @param raw Parsed credentials file.
 */
export function stripMojitoIntegrationOnlyFields(
    raw: MojitoIntegrationCredentialsFile,
): { clientOptions: MojitoClientOptions; testOptions: MojitoIntegrationTestOptions } {
    const {
        repositoryName,
        searchSource,
        searchLimit,
        ...rest
    } = raw;

    const username = resolveMojitoUsername(raw);
    const password = resolveMojitoPassword(raw);
    const clientOptions: MojitoClientOptions = {
        loadCliConfig: false,
        ...rest,
    };
    if (username !== undefined) {
        clientOptions.username = username;
    }
    if (password !== undefined) {
        clientOptions.password = password;
    }

    const limit = typeof searchLimit === "number" && searchLimit > 0 ? searchLimit : 5;
    return {
        clientOptions,
        testOptions: {
            repositoryName: repositoryName?.trim() || undefined,
            searchSource: searchSource?.trim() || undefined,
            searchLimit: limit,
        },
    };
}

/**
 * Read `mojito-integration-credentials.json`. Missing files yield an empty object.
 *
 * @param packageRoot Absolute path to the `mojito-sdk` package root.
 */
export function loadMojitoIntegrationCredentialsFile(
    packageRoot: string,
): MojitoIntegrationCredentialsFile {
    const configPath = resolveMojitoIntegrationCredentialsPath(packageRoot);
    if (!existsSync(configPath)) {
        return {};
    }
    const raw = readFileSync(configPath, "utf8");
    return JSON.parse(raw) as MojitoIntegrationCredentialsFile;
}

/**
 * Load client options for a live Mojito connection.
 *
 * @param packageRoot Absolute path to the `mojito-sdk` package root.
 */
export function loadMojitoClientOptions(packageRoot: string): MojitoClientOptions {
    return stripMojitoIntegrationOnlyFields(
        loadMojitoIntegrationCredentialsFile(packageRoot),
    ).clientOptions;
}

/**
 * Load test-only knobs (preferred repository, search term, limit).
 *
 * @param packageRoot Absolute path to the `mojito-sdk` package root.
 */
export function loadMojitoIntegrationTestOptions(
    packageRoot: string,
): MojitoIntegrationTestOptions {
    return stripMojitoIntegrationOnlyFields(
        loadMojitoIntegrationCredentialsFile(packageRoot),
    ).testOptions;
}

/**
 * Whether live Mojito integration suites should run.
 *
 * True when the credentials file exists and either:
 * - supplies inline STATEFUL/HEADER auth, or
 * - sets `loadCliConfig: true` and at least one of the resolved layered CLI
 *   property files exists (`configFiles`, or `configDir` + `profiles`).
 *
 * Username/password may also come from `MOJITO_USERNAME` / `MOJITO_PASSWORD`.
 *
 * @param packageRoot Absolute path to the `mojito-sdk` package root.
 */
export function mojitoIntegrationCredentialsPresent(packageRoot: string): boolean {
    const configPath = resolveMojitoIntegrationCredentialsPath(packageRoot);
    if (!existsSync(configPath)) {
        return false;
    }
    try {
        const raw = loadMojitoIntegrationCredentialsFile(packageRoot);
        return hasInlineMojitoAuth(raw) || hasCliPropertyFiles(raw);
    } catch {
        return false;
    }
}
