/*
 * boxClientFactory.ts — construct BoxClient from BoxAIModelInitOptions
 *
 * Copyright © 2026, JEDLSoft
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

import fs from "fs";
import {
    BoxClient,
    BoxDeveloperTokenAuth,
    BoxJwtAuth,
    JwtConfig,
} from "box-node-sdk";
import type {
    BoxAIModelInitOptions,
    BoxDeveloperJwtConfig,
} from "./BoxAIModelInitOptions";

const ENV_PLACEHOLDER = /^\$\{(.+)\}$/;

const SETUP_README_HINT =
    "See README.md in the ilib-ai package for how to configure credentials and environment variables before running.";

function unsetEnvironmentVariableError(name: string): Error {
    return new Error(
        `Box AI: environment variable "${name}" is not set. ${SETUP_README_HINT}`
    );
}

function envPlaceholderName(value: string | undefined): string | undefined {
    if (!value) return undefined;
    const m = value.match(ENV_PLACEHOLDER);
    return m?.[1];
}

/**
 * Resolves a config string. Values of the form `${NAME}` are read from `process.env`.
 * If that variable is missing or empty, throws and does not use the placeholder as a literal.
 */
export function resolveEnv(value: string | undefined): string | undefined {
    if (!value) return undefined;
    const name = envPlaceholderName(value);
    if (!name) return value;
    const envVal = process.env[name];
    if (envVal === undefined || envVal === "") {
        throw unsetEnvironmentVariableError(name);
    }
    return envVal;
}

/**
 * Like {@link resolveEnv} but unresolved `${NAME}` placeholders yield `undefined`
 * instead of throwing (for {@link isBoxInitConfigured}).
 */
export function tryResolveEnv(value: string | undefined): string | undefined {
    if (!value) return undefined;
    const name = envPlaceholderName(value);
    if (!name) return value;
    const envVal = process.env[name];
    if (envVal === undefined || envVal === "") {
        return undefined;
    }
    return envVal;
}

function collectInitStringFields(init: BoxAIModelInitOptions): string[] {
    return [
        init.accessToken,
        init.configPath,
        init.clientId,
        init.clientSecret,
        init.privateKey,
        init.privateKeyPath,
        init.passphrase,
        init.publicKeyId,
        init.enterpriseId,
        init.userId,
        init.contextFileId,
    ].filter((v): v is string => typeof v === "string");
}

function firstUnresolvedEnvVar(init: BoxAIModelInitOptions): string | undefined {
    for (const field of collectInitStringFields(init)) {
        const name = envPlaceholderName(field);
        if (!name) continue;
        const envVal = process.env[name];
        if (envVal === undefined || envVal === "") {
            return name;
        }
    }
    return undefined;
}

/**
 * Builds a {@link BoxClient} for Box Platform and Box AI calls using the same
 * credential patterns as the official Box Node SDK.
 */
function jwtAuthFromDeveloperConsoleConfig(
    cfg: BoxDeveloperJwtConfig,
    init: BoxAIModelInitOptions
): BoxJwtAuth {
    const payload: Record<string, unknown> = {
        boxAppSettings: cfg.boxAppSettings,
    };
    if (cfg.enterpriseID !== undefined && cfg.enterpriseID !== "") {
        payload.enterpriseID = cfg.enterpriseID;
    }
    if (cfg.userID !== undefined && cfg.userID !== "") {
        payload.userID = cfg.userID;
    }
    const jwtConfig = JwtConfig.fromConfigJsonString(JSON.stringify(payload));

    const userSubject = resolveEnv(init.userId) ?? cfg.userID;
    const enterpriseSubject = resolveEnv(init.enterpriseId) ?? cfg.enterpriseID;

    if (userSubject) {
        return new BoxJwtAuth({ config: jwtConfig }).withUserSubject(
            String(userSubject)
        );
    }
    if (enterpriseSubject) {
        return new BoxJwtAuth({ config: jwtConfig }).withEnterpriseSubject(
            String(enterpriseSubject)
        );
    }
    return new BoxJwtAuth({ config: jwtConfig });
}

export async function createBoxClientFromInit(
    init: BoxAIModelInitOptions
): Promise<BoxClient> {
    const accessToken = resolveEnv(init.accessToken);
    if (accessToken) {
        const auth = new BoxDeveloperTokenAuth({ token: accessToken });
        return new BoxClient({ auth });
    }

    if (init.boxDeveloperJwtConfig?.boxAppSettings) {
        const auth = jwtAuthFromDeveloperConsoleConfig(
            init.boxDeveloperJwtConfig,
            init
        );
        return new BoxClient({ auth });
    }

    const configPath = resolveEnv(init.configPath);
    if (configPath && fs.existsSync(configPath)) {
        const jwtConfig = JwtConfig.fromConfigFile(configPath);
        const userId = resolveEnv(init.userId);
        const enterpriseId = resolveEnv(init.enterpriseId);
        const auth = userId
            ? new BoxJwtAuth({ config: jwtConfig }).withUserSubject(userId)
            : enterpriseId
              ? new BoxJwtAuth({ config: jwtConfig }).withEnterpriseSubject(
                    enterpriseId
                )
              : new BoxJwtAuth({ config: jwtConfig });
        return new BoxClient({ auth });
    }

    const clientId = resolveEnv(init.clientId);
    const clientSecret = resolveEnv(init.clientSecret);
    const publicKeyId = resolveEnv(init.publicKeyId) ?? "default";
    let privateKey = resolveEnv(init.privateKey);
    const privateKeyPath = resolveEnv(init.privateKeyPath);
    if (!privateKey && privateKeyPath) {
        privateKey = fs.readFileSync(privateKeyPath, "utf8");
    }
    const passphrase = init.passphrase ? resolveEnv(init.passphrase) ?? "" : "";

    if (!clientId || !clientSecret || !privateKey) {
        throw new Error(
            `Box AI: accessToken, configPath, or clientId + clientSecret + (privateKey | privateKeyPath) is required. ${SETUP_README_HINT}`
        );
    }

    const userId = resolveEnv(init.userId);
    const enterpriseId = resolveEnv(init.enterpriseId);
    const sub = userId ?? enterpriseId;
    if (!sub) {
        throw new Error(
            `Box AI: enterpriseId (service account) or userId (app user) is required for JWT auth. ${SETUP_README_HINT}`
        );
    }

    const configJson = JSON.stringify({
        boxAppSettings: {
            clientID: clientId,
            clientSecret,
            appAuth: {
                publicKeyID: publicKeyId,
                privateKey,
                passphrase,
            },
        },
        ...(userId ? { userID: sub } : { enterpriseID: sub }),
    });

    const jwtConfig = JwtConfig.fromConfigJsonString(configJson);
    const auth = userId
        ? new BoxJwtAuth({ config: jwtConfig }).withUserSubject(userId)
        : new BoxJwtAuth({ config: jwtConfig }).withEnterpriseSubject(sub);
    return new BoxClient({ auth });
}

/**
 * Returns true when {@link createBoxClientFromInit} has enough information to build a client.
 */
export function isBoxInitConfigured(init: BoxAIModelInitOptions): boolean {
    if (tryResolveEnv(init.accessToken)) return true;
    if (init.boxDeveloperJwtConfig?.boxAppSettings) return true;
    const configPath = tryResolveEnv(init.configPath);
    if (configPath && fs.existsSync(configPath)) return true;
    const clientId = tryResolveEnv(init.clientId);
    const clientSecret = tryResolveEnv(init.clientSecret);
    let privateKey = tryResolveEnv(init.privateKey);
    const privateKeyPath = tryResolveEnv(init.privateKeyPath);
    if (!privateKey && privateKeyPath && fs.existsSync(privateKeyPath)) {
        privateKey = " ";
    }
    const sub = tryResolveEnv(init.userId) ?? tryResolveEnv(init.enterpriseId);
    return !!(clientId && clientSecret && privateKey && sub);
}

/**
 * Throws if Box credentials are insufficient for {@link createBoxClientFromInit}.
 */
export function assertBoxInitConfigured(init: BoxAIModelInitOptions): void {
    const unset = firstUnresolvedEnvVar(init);
    if (unset) {
        throw unsetEnvironmentVariableError(unset);
    }
    if (isBoxInitConfigured(init)) return;
    throw new Error(
        `Box AI model initialization failed: provide accessToken, boxDeveloperJwtConfig (Developer Console JSON), configPath, or JWT credentials (clientId, clientSecret, privateKey or privateKeyPath, and enterpriseId or userId). ${SETUP_README_HINT}`
    );
}
