/*
 * Repository.ts - high-level Repository object for Mojito
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

import type { LowLevelClient } from "../lowlevel/client";
import type { ForwardCompatParams, RepositoryData } from "./types";

/** Parameters for finding/listing repositories. */
export type RepositoryListParams = ForwardCompatParams<{
    /** Optional exact repository name filter. */
    name?: string;
}>;

/** Parameters for creating a repository. */
export type RepositoryCreateParams = ForwardCompatParams<{
    name: string;
    description?: string;
    checkSLA?: boolean;
    dropExporterType?: string;
    sourceLocale?: { id?: number; bcp47Tag?: string };
    repositoryLocales?: unknown[];
}>;

/**
 * A Mojito repository (project) that holds assets and text units.
 */
export class Repository {
    /** Underlying repository JSON from Mojito. */
    readonly data: RepositoryData;
    private readonly client: LowLevelClient;

    /**
     * @param client Low-level Mojito client.
     * @param data Repository payload from the API.
     */
    constructor(client: LowLevelClient, data: RepositoryData = {}) {
        this.client = client;
        this.data = data;
    }

    /** Numeric repository id when present. */
    get id(): number | undefined {
        return this.data.id;
    }

    /** Repository name when present. */
    get name(): string | undefined {
        return this.data.name;
    }

    /**
     * List repositories. When `name` is omitted, callers should be aware that
     * some Mojito builds require it; unknown extras are still forwarded.
     *
     * @param client Low-level client.
     * @param params Optional name filter and extras.
     */
    static async list(
        client: LowLevelClient,
        params: RepositoryListParams = {},
    ): Promise<Repository[]> {
        const result = await client.call<RepositoryData[]>("getRepositories_1", params);
        return (result ?? []).map((item) => new Repository(client, item));
    }

    /**
     * Find repositories by exact name.
     *
     * @param client Low-level client.
     * @param name Repository name.
     * @param extras Extra forwarded parameters.
     */
    static async find(
        client: LowLevelClient,
        name: string,
        extras: ForwardCompatParams = {},
    ): Promise<Repository[]> {
        return Repository.list(client, { name, ...extras });
    }

    /**
     * Load a repository by id.
     *
     * @param client Low-level client.
     * @param repositoryId Repository id.
     * @param extras Extra forwarded parameters.
     */
    static async get(
        client: LowLevelClient,
        repositoryId: number,
        extras: ForwardCompatParams = {},
    ): Promise<Repository> {
        const data = await client.call<RepositoryData>("getRepositoryById", {
            repositoryId,
            ...extras,
        });
        return new Repository(client, data ?? {});
    }

    /**
     * Create a repository.
     *
     * @param client Low-level client.
     * @param params Create payload.
     */
    static async create(
        client: LowLevelClient,
        params: RepositoryCreateParams,
    ): Promise<Repository> {
        const data = await client.call<RepositoryData>("createRepository", {
            body: params,
        });
        return new Repository(client, data ?? {});
    }

    /**
     * Update this repository via PATCH.
     *
     * @param params Fields to update (merged with extras).
     */
    async update(params: ForwardCompatParams<Partial<RepositoryData>>): Promise<string | undefined> {
        if (this.id === undefined) {
            throw new Error("Repository.update requires a repository id");
        }
        return this.client.call<string>("updateRepository", {
            repositoryId: this.id,
            body: params,
        });
    }

    /**
     * Delete this repository.
     *
     * @param extras Extra forwarded parameters.
     */
    async delete(extras: ForwardCompatParams = {}): Promise<void> {
        if (this.id === undefined) {
            throw new Error("Repository.delete requires a repository id");
        }
        await this.client.call("deleteRepositoryById", {
            repositoryId: this.id,
            ...extras,
        });
    }
}
