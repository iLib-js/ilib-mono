/*
 * RepositoryType.ts - high-level Mojito repository type
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

import type { components } from "../generated/openapi";
import type { MojitoClient } from "./MojitoClient";
import type { ForwardCompatParams } from "./types";

type RepositoryTypeDto = components["schemas"]["RepoType_RepoType"];
type IntegrityCheckerDto = components["schemas"]["RepoTypeIntegrityChecker_RepoType"];

/** Integrity rule applied to matching asset extensions. */
export type RepositoryTypeIntegrityChecker = {
    assetExtension?: string;
    integrityCheckerType?: IntegrityCheckerDto["integrityCheckerType"];
};

type RepositoryTypeFields = {
    name: string;
    description?: string;
    aiPrompt?: string;
    integrityCheckers?: readonly RepositoryTypeIntegrityChecker[];
};

/** Configuration inherited by repositories of the same kind. */
export type RepositoryTypeCreateParams = ForwardCompatParams<RepositoryTypeFields>;

/** Fields that may be changed on a repository type. */
export type RepositoryTypeUpdateParams = ForwardCompatParams<Partial<RepositoryTypeFields>>;

/** A named repository configuration, including AI and integrity-check settings. */
export class RepositoryType {
    private readonly client: MojitoClient;
    private readonly dto: RepositoryTypeDto;

    /**
     * @param client SDK session.
     * @param data Repository type payload from the API.
     */
    constructor(client: MojitoClient, data: RepositoryTypeDto = {}) {
        this.client = client;
        this.dto = data;
    }

    get id(): number | undefined {
        return this.dto.id;
    }

    get name(): string | undefined {
        return this.dto.name;
    }

    get description(): string | undefined {
        return this.dto.description;
    }

    get aiPrompt(): string | undefined {
        return this.dto.aiPrompt;
    }

    get integrityCheckers(): readonly RepositoryTypeIntegrityChecker[] {
        return this.dto.integrityCheckers ?? [];
    }

    static async list(
        client: MojitoClient,
        params: ForwardCompatParams<{ name?: string }> = {},
    ): Promise<RepositoryType[]> {
        const result = await client.call<readonly RepositoryTypeDto[]>("getRepoTypes", params);
        return (result ?? []).map((item) => new RepositoryType(client, item));
    }

    static async get(
        client: MojitoClient,
        repositoryTypeId: number,
    ): Promise<RepositoryType> {
        const result = await client.call<RepositoryTypeDto>("getRepoTypeById", {
            repoTypeId: repositoryTypeId,
        });
        return new RepositoryType(client, result ?? {});
    }

    static async create(
        client: MojitoClient,
        params: RepositoryTypeCreateParams,
    ): Promise<RepositoryType> {
        const result = await client.call<RepositoryTypeDto>("createRepoType", { body: params });
        return new RepositoryType(client, result ?? {});
    }

    async update(params: RepositoryTypeUpdateParams): Promise<void> {
        if (this.id === undefined) {
            throw new Error("RepositoryType.update requires a repository type id");
        }
        await this.client.call("updateRepoType", {
            repoTypeId: this.id,
            body: params,
        });
    }

    async delete(): Promise<void> {
        if (this.id === undefined) {
            throw new Error("RepositoryType.delete requires a repository type id");
        }
        await this.client.call("deleteRepoType", { repoTypeId: this.id });
    }
}
