/*
 * index.ts - auth package exports for mojito-sdk
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

import {
    buildBaseUrl,
    resolveConnectionConfig,
} from "./properties";
import { HeaderAuth } from "./header-auth";
import { createStatefulAuthFromConfig } from "./stateful-auth";
import type { AuthProvider, MojitoConnectionConfig } from "./types";

export type {
    AuthProvider,
    AuthenticationMode,
    CredentialProviderKind,
    MojitoConnectionConfig,
} from "./types";
export { CookieJar } from "./cookie-jar";
export {
    buildBaseUrl,
    connectionConfigFromProperties,
    defaultCliConfigDir,
    loadPropertiesFromDir,
    parseProperties,
    resolveConnectionConfig,
} from "./properties";
export { HeaderAuth } from "./header-auth";
export {
    StatefulFormLoginAuth,
    createStatefulAuthFromConfig,
} from "./stateful-auth";
export type { StatefulFormLoginAuthOptions } from "./stateful-auth";

/**
 * Create an {@link AuthProvider} for the given Mojito connection settings.
 *
 * STATELESS (MSAL) is not implemented yet; configure STATEFUL or HEADER.
 *
 * @param overrides Explicit connection overrides.
 * @param options Optional CLI config loading controls and fetch implementation.
 */
export function createAuthProvider(
    overrides: MojitoConnectionConfig = {},
    options: {
        configDir?: string;
        loadCliConfig?: boolean;
        fetchImpl?: typeof fetch;
    } = {},
): { baseUrl: string; auth: AuthProvider; config: ReturnType<typeof resolveConnectionConfig> } {
    const config = resolveConnectionConfig(overrides, options);
    const baseUrl = buildBaseUrl(config);

    if (config.authenticationMode === "HEADER") {
        return {
            baseUrl,
            config,
            auth: new HeaderAuth(config.headers ?? {}),
        };
    }

    if (config.authenticationMode === "STATELESS") {
        throw new Error(
            "STATELESS (MSAL) authentication is not implemented in mojito-sdk yet; use STATEFUL or HEADER",
        );
    }

    return {
        baseUrl,
        config,
        auth: createStatefulAuthFromConfig(baseUrl, config, options.fetchImpl),
    };
}
