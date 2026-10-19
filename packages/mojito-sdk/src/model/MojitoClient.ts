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
import { Server } from "./Server";

export type { AuthenticationMode, MojitoConnectionConfig } from "../auth";

export type MojitoClientOptions = MojitoConnectionConfig & {
    /** Optional absolute base URL override (skips host/port assembly). */
    baseUrl?: string;
    /**
     * Load Mojito CLI property files. Default true.
     * Uses {@link configFiles}, or Spring-style {@link configDir} + {@link profiles}.
     */
    loadCliConfig?: boolean;
    /**
     * Directory for Spring-style `application[-profile].properties` lookup.
     * Default: `~/.l10n/config/cli`. Ignored when {@link configFiles} is set
     * except as the base for relative paths in that list.
     */
    configDir?: string;
    /**
     * Explicit property files to layer, in order (later wins). Prefer this when
     * environments share a directory but use different filenames.
     */
    configFiles?: readonly string[];
    /**
     * Spring profiles used when {@link configFiles} is omitted.
     * Default: `cli`, `formlogincredentialprovider` (same as the local `mojito` wrapper).
     */
    profiles?: readonly string[];
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
    private serverInstance?: Server;

    /**
     * @param options Connection overrides and optional test hooks.
     */
    constructor(options: MojitoClientOptions = {}) {
        const { auth, baseUrl } = createAuthProvider(options, {
            configDir: options.configDir,
            configFiles: options.configFiles,
            profiles: options.profiles,
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
     * Domain root for this session. Repeated access returns the same instance.
     */
    get server(): Server {
        return this.getServer();
    }

    /**
     * Domain root for this session. Same instance as {@link MojitoClient.server}.
     */
    getServer(): Server {
        this.serverInstance ??= new Server(this);
        return this.serverInstance;
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
