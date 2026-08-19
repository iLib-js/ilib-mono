/*
 * version.ts - version information for mojito-sdk
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

import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
    OPENAPI_GENERATED_AT,
    OPENAPI_SPEC_HASH,
    OPENAPI_SPEC_VERSION,
} from "./lowlevel/spec-meta";
import type { LowLevelClient } from "./lowlevel/client";

type PackageMetadata = {
    version: string;
};

/**
 * Return the version of the installed Mojito SDK package (SDK semver only).
 *
 * This is unrelated to the Mojito server / OpenAPI version.
 *
 * @returns The semantic version from the SDK's package metadata.
 */
export function getSdkVersion(): string {
    const packageMetadata = JSON.parse(
        readFileSync(join(__dirname, "../package.json"), "utf8"),
    ) as PackageMetadata;
    return packageMetadata.version;
}

/**
 * Return the Mojito OpenAPI / API surface version this SDK build supports.
 *
 * Taken from the cached OpenAPI `info.version` at generation time. This is not
 * the SDK package semver.
 *
 * @returns OpenAPI info.version string (often `v0` for Mojito).
 */
export function getOpenApiSpecVersion(): string {
    return OPENAPI_SPEC_VERSION;
}

/**
 * Metadata describing the Mojito API surface this SDK was generated against,
 * and optionally live server info when a client is provided.
 */
export type MojitoApiInfo = {
    /** OpenAPI info.version from the cached spec. */
    openApiSpecVersion: string;
    /** Short hash of the cached OpenAPI document. */
    openApiSpecHash: string;
    /** When the cached metadata was generated. */
    generatedAt: string;
    /** SDK package semver. */
    sdkVersion: string;
    /**
     * Live server payload when available.
     * Mojito does not currently expose a dedicated public version endpoint in
     * the OpenAPI used for this build; this field is then omitted.
     */
    server?: unknown;
};

/**
 * Return version / API metadata for clients.
 *
 * When a {@link LowLevelClient} is passed, the SDK may attempt to fetch live
 * server metadata. If no suitable endpoint exists, only generation metadata is
 * returned.
 *
 * @param client Optional authenticated low-level client.
 */
export async function getApiInfo(client?: LowLevelClient): Promise<MojitoApiInfo> {
    const info: MojitoApiInfo = {
        openApiSpecVersion: OPENAPI_SPEC_VERSION,
        openApiSpecHash: OPENAPI_SPEC_HASH,
        generatedAt: OPENAPI_GENERATED_AT,
        sdkVersion: getSdkVersion(),
    };

    if (!client) {
        return info;
    }

    // No dedicated version operation in the current OpenAPI. Probe session as a
    // connectivity check and leave server metadata unset.
    try {
        await client.call("isSessionActive");
    } catch {
        // Ignore — callers still get generation metadata.
    }
    return info;
}
