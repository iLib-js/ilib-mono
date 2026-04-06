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

export function resolveEnv(value: string | undefined): string | undefined {
    if (!value) return undefined;
    const m = value.match(/^\$\{(.+)\}$/);
    if (m) return process.env[m[1]];
    return value;
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

    const userSubject =
        resolveEnv(init.userId) ?? init.userId ?? cfg.userID;
    const enterpriseSubject =
        resolveEnv(init.enterpriseId) ??
        init.enterpriseId ??
        cfg.enterpriseID;

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
    const accessToken = resolveEnv(init.accessToken) ?? init.accessToken;
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

    const configPath = init.configPath;
    if (configPath && fs.existsSync(configPath)) {
        const jwtConfig = JwtConfig.fromConfigFile(configPath);
        const auth = init.userId
            ? new BoxJwtAuth({ config: jwtConfig }).withUserSubject(init.userId)
            : init.enterpriseId
              ? new BoxJwtAuth({ config: jwtConfig }).withEnterpriseSubject(
                    resolveEnv(init.enterpriseId) ?? init.enterpriseId!
                )
              : new BoxJwtAuth({ config: jwtConfig });
        return new BoxClient({ auth });
    }

    const clientId = resolveEnv(init.clientId) ?? init.clientId;
    const clientSecret = resolveEnv(init.clientSecret) ?? init.clientSecret;
    const publicKeyId = init.publicKeyId ?? "default";
    let privateKey = init.privateKey;
    if (!privateKey && init.privateKeyPath) {
        privateKey = fs.readFileSync(init.privateKeyPath, "utf8");
    }
    const passphrase =
        init.passphrase
            ? resolveEnv(init.passphrase) ?? init.passphrase
            : "";

    if (!clientId || !clientSecret || !privateKey) {
        throw new Error(
            "Box AI: accessToken, configPath, or clientId + clientSecret + (privateKey | privateKeyPath) is required"
        );
    }

    const sub =
        init.userId ?? (resolveEnv(init.enterpriseId) ?? init.enterpriseId);
    if (!sub) {
        throw new Error(
            "Box AI: enterpriseId (service account) or userId (app user) is required for JWT auth"
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
        ...(init.userId ? { userID: sub } : { enterpriseID: sub }),
    });

    const jwtConfig = JwtConfig.fromConfigJsonString(configJson);
    const auth = init.userId
        ? new BoxJwtAuth({ config: jwtConfig }).withUserSubject(init.userId)
        : new BoxJwtAuth({ config: jwtConfig }).withEnterpriseSubject(sub);
    return new BoxClient({ auth });
}

/**
 * Returns true when {@link createBoxClientFromInit} has enough information to build a client.
 */
export function isBoxInitConfigured(init: BoxAIModelInitOptions): boolean {
    if (resolveEnv(init.accessToken) ?? init.accessToken) return true;
    if (init.boxDeveloperJwtConfig?.boxAppSettings) return true;
    if (init.configPath && fs.existsSync(init.configPath)) return true;
    const clientId = resolveEnv(init.clientId) ?? init.clientId;
    const clientSecret = resolveEnv(init.clientSecret) ?? init.clientSecret;
    let privateKey = init.privateKey;
    if (!privateKey && init.privateKeyPath && fs.existsSync(init.privateKeyPath)) {
        privateKey = " ";
    }
    const sub =
        init.userId ?? (resolveEnv(init.enterpriseId) ?? init.enterpriseId);
    return !!(clientId && clientSecret && privateKey && sub);
}

/**
 * Throws if Box credentials are insufficient for {@link createBoxClientFromInit}.
 */
export function assertBoxInitConfigured(init: BoxAIModelInitOptions): void {
    if (isBoxInitConfigured(init)) return;
    throw new Error(
        "Box AI model initialization failed: provide accessToken, boxDeveloperJwtConfig (Developer Console JSON), configPath, or JWT credentials (clientId, clientSecret, privateKey or privateKeyPath, and enterpriseId or userId)"
    );
}
