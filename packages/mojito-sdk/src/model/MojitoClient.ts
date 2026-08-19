/*
 * MojitoClient.ts - high-level facade over the Mojito SDK
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
import { Drop, type DropExportParams, type DropImportParams, type DropListParams } from "./Drop";
import { Locale } from "./Locale";
import { PollableTask } from "./PollableTask";
import {
    Repository,
    type RepositoryCreateParams,
    type RepositoryListParams,
} from "./Repository";
import { TextUnit, type TextUnitSearchParams } from "./TextUnit";
import { User } from "./User";
import type { ForwardCompatParams } from "./types";

export type MojitoClientOptions = MojitoConnectionConfig & {
    /** Optional absolute base URL override (skips host/port assembly). */
    baseUrl?: string;
    /** Load `~/.l10n/config/cli` properties. Default true. */
    loadCliConfig?: boolean;
    /** Override CLI config directory. */
    configDir?: string;
    /** Optional fetch implementation (useful in tests). */
    fetchImpl?: typeof fetch;
    /** Inject a pre-built low-level client (advanced / testing). */
    lowLevel?: LowLevelClient;
};

/**
 * Entry point for the Mojito SDK.
 *
 * Wraps authentication, the OpenAPI low-level client, and high-level resources.
 */
export class MojitoClient {
    /** Low-level OpenAPI HTTP client. */
    readonly lowLevel: LowLevelClient;
    /** Resolved absolute Mojito base URL. */
    readonly baseUrl: string;

    /**
     * @param options Connection overrides and optional test hooks.
     */
    constructor(options: MojitoClientOptions = {}) {
        if (options.lowLevel) {
            this.lowLevel = options.lowLevel;
            this.baseUrl = options.baseUrl ?? "";
            return;
        }

        const { auth, baseUrl } = createAuthProvider(options, {
            configDir: options.configDir,
            loadCliConfig: options.loadCliConfig,
            fetchImpl: options.fetchImpl,
        });
        this.baseUrl = options.baseUrl ?? baseUrl;
        this.lowLevel = new LowLevelClient({
            baseUrl: this.baseUrl,
            auth,
            fetchImpl: options.fetchImpl,
        });
    }

    /** List repositories. */
    listRepositories(params?: RepositoryListParams): Promise<Repository[]> {
        return Repository.list(this.lowLevel, params);
    }

    /** Find repositories by name. */
    findRepositories(name: string, extras?: ForwardCompatParams): Promise<Repository[]> {
        return Repository.find(this.lowLevel, name, extras);
    }

    /** Get a repository by id. */
    getRepository(repositoryId: number, extras?: ForwardCompatParams): Promise<Repository> {
        return Repository.get(this.lowLevel, repositoryId, extras);
    }

    /** Create a repository. */
    createRepository(params: RepositoryCreateParams): Promise<Repository> {
        return Repository.create(this.lowLevel, params);
    }

    /** List drops. */
    listDrops(params?: DropListParams): Promise<Drop[]> {
        return Drop.list(this.lowLevel, params);
    }

    /** Export a drop for translation. */
    exportDrop(params: DropExportParams): Promise<Record<string, unknown>> {
        return Drop.export(this.lowLevel, params);
    }

    /** Import a translated drop. */
    importDrop(params: DropImportParams): Promise<Record<string, unknown>> {
        return Drop.import(this.lowLevel, params);
    }

    /** Search text units. */
    searchTextUnits(params?: TextUnitSearchParams): Promise<TextUnit[]> {
        return TextUnit.search(this.lowLevel, params);
    }

    /** List locales. */
    listLocales(params?: ForwardCompatParams<{ bcp47Tag?: string }>): Promise<Locale[]> {
        return Locale.list(this.lowLevel, params);
    }

    /** Get a pollable task by id. */
    getPollableTask(pollableTaskId: number, extras?: ForwardCompatParams): Promise<PollableTask> {
        return PollableTask.get(this.lowLevel, pollableTaskId, extras);
    }

    /** Current authenticated user. */
    me(extras?: ForwardCompatParams): Promise<Record<string, unknown>> {
        return User.me(this.lowLevel, extras);
    }

    /**
     * Escape hatch for any OpenAPI operation by operationId.
     *
     * @param operationId OpenAPI operationId.
     * @param params Path/query/body parameters.
     */
    call<T = unknown>(operationId: string, params?: Record<string, unknown>): Promise<T> {
        return this.lowLevel.call<T>(operationId, params);
    }
}
