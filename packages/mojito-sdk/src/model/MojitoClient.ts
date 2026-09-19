/*
 * MojitoClient.ts - session entry point for the Mojito SDK
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
    createAuthProvider,
    type MojitoConnectionConfig,
} from "../auth";
import { LowLevelClient } from "../lowlevel/client";

export type { AuthenticationMode, MojitoConnectionConfig } from "../auth";

export type MojitoClientOptions = MojitoConnectionConfig & {
    /** Optional absolute base URL override (skips host/port assembly). */
    baseUrl?: string;
    /** Load `~/.l10n/config/cli` properties. Default true. */
    loadCliConfig?: boolean;
    /** Override CLI config directory. */
    configDir?: string;
    /** Optional fetch implementation (useful in tests). */
    fetchImpl?: typeof fetch;
};

/**
 * Session for the Mojito SDK.
 *
 * Holds connection settings and authentication. Domain objects store this
 * instance and use {@link MojitoClient.call} for HTTP.
 */
export class MojitoClient {
    /** Resolved absolute Mojito base URL. */
    readonly baseUrl: string;
    private readonly transport: LowLevelClient;

    /**
     * @param options Connection overrides and optional test hooks.
     */
    constructor(options: MojitoClientOptions = {}) {
        const { auth, baseUrl } = createAuthProvider(options, {
            configDir: options.configDir,
            loadCliConfig: options.loadCliConfig,
            fetchImpl: options.fetchImpl,
        });
        this.baseUrl = options.baseUrl ?? baseUrl;
        this.transport = new LowLevelClient({
            baseUrl: this.baseUrl,
            auth,
            fetchImpl: options.fetchImpl,
        });
    }

    /**
     * Escape hatch for any OpenAPI operation by operationId.
     *
     * @param operationId OpenAPI operationId.
     * @param params Path/query/body parameters.
     */
    call<T = unknown>(operationId: string, params?: Record<string, unknown>): Promise<T> {
        return this.transport.call<T>(operationId, params);
    }
}
