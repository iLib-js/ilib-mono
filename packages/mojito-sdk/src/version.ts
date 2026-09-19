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
import type { MojitoClient } from "./model/MojitoClient";

type PackageMetadata = {
    version: string;
};

type Semver = {
    major: number;
    minor: number;
    patch: number;
};

/**
 * Return the version of the installed Mojito SDK package (SDK semver only).
 *
 * This is unrelated to the Mojito server version.
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
 * Return the Mojito version this SDK was generated against.
 *
 * Taken from `info.version` in the cached OpenAPI document. This SDK can call
 * any Mojito that satisfies the npm caret range of that version
 * (`getCompatibleMojitoRange()`).
 *
 * @returns OpenAPI `info.version` from `openapi/openapi.json`.
 */
export function getMojitoVersion(): string {
    return OPENAPI_SPEC_VERSION;
}

/**
 * Return the Mojito OpenAPI / API surface version this SDK build supports.
 *
 * Alias of {@link getMojitoVersion}.
 *
 * @returns OpenAPI info.version string.
 */
export function getOpenApiSpecVersion(): string {
    return getMojitoVersion();
}

/**
 * Return the npm caret range of Mojito versions this SDK can call.
 *
 * For a Mojito version of `3.4.5` this is `^3.4.5` (`>=3.4.5 <4.0.0`).
 *
 * @returns Caret range string, for example `^3.4.5`.
 */
export function getCompatibleMojitoRange(): string {
    return caretRange(getMojitoVersion());
}

/**
 * Return whether a Mojito version is caret-compatible with the version this
 * SDK was generated against.
 *
 * @param mojitoVersion Version reported by a Mojito server.
 * @returns True when `mojitoVersion` satisfies {@link getCompatibleMojitoRange}.
 */
export function isCompatibleMojitoVersion(mojitoVersion: string): boolean {
    return satisfiesMojitoCaret(getMojitoVersion(), mojitoVersion);
}

/**
 * Metadata describing the Mojito API surface this SDK was generated against,
 * and optionally live server info when a client is provided.
 */
export type MojitoApiInfo = {
    /** Mojito version from OpenAPI `info.version` (same as {@link getMojitoVersion}). */
    mojitoVersion: string;
    /** Npm caret range of Mojito versions this SDK can call. */
    compatibleMojitoRange: string;
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
 * When a {@link MojitoClient} is passed, the SDK may attempt to fetch live
 * server metadata. If no suitable endpoint exists, only generation metadata is
 * returned.
 *
 * @param client Optional authenticated SDK session.
 */
export async function getApiInfo(client?: MojitoClient): Promise<MojitoApiInfo> {
    const mojitoVersion = getMojitoVersion();
    const info: MojitoApiInfo = {
        mojitoVersion,
        compatibleMojitoRange: caretRange(mojitoVersion),
        openApiSpecVersion: mojitoVersion,
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

/**
 * Test whether `mojitoVersion` satisfies the npm caret of `createdFor`.
 *
 * @param createdFor Mojito version this SDK was generated against.
 * @param mojitoVersion Candidate Mojito version.
 */
export function satisfiesMojitoCaret(createdFor: string, mojitoVersion: string): boolean {
    const base = parseSemver(createdFor);
    const candidate = parseSemver(mojitoVersion);
    if (!base || !candidate) {
        return false;
    }

    if (compare(candidate, base) < 0) {
        return false;
    }

    if (base.major > 0) {
        return candidate.major === base.major;
    }
    if (base.minor > 0) {
        return candidate.major === 0 && candidate.minor === base.minor;
    }
    return candidate.major === 0 && candidate.minor === 0 && candidate.patch === base.patch;
}

function caretRange(version: string): string {
    const parsed = parseSemver(version);
    if (!parsed) {
        return `^${version}`;
    }
    return `^${parsed.major}.${parsed.minor}.${parsed.patch}`;
}

function parseSemver(version: string): Semver | undefined {
    const match = /^v?(\d+)(?:\.(\d+))?(?:\.(\d+))?/i.exec(version.trim());
    if (!match) {
        return undefined;
    }
    return {
        major: Number(match[1]),
        minor: Number(match[2] ?? 0),
        patch: Number(match[3] ?? 0),
    };
}

function compare(left: Semver, right: Semver): number {
    if (left.major !== right.major) {
        return left.major - right.major;
    }
    if (left.minor !== right.minor) {
        return left.minor - right.minor;
    }
    return left.patch - right.patch;
}
