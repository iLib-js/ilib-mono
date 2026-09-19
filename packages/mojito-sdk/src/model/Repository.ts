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

import type Locale from "ilib-locale" with { "resolution-mode": "import" };

import type { components } from "../generated/openapi";
import { Asset, type AssetListParams } from "./Asset";
import { Branch, type BranchListParams } from "./Branch";
import { Drop, type DropExportParams, type DropListParams } from "./Drop";
import type { MojitoClient } from "./MojitoClient";
import { MojitoLocale } from "./MojitoLocale";
import { RepositoryType } from "./RepositoryType";
import { Screenshot, type ScreenshotListParams } from "./Screenshot";
import type { ForwardCompatParams } from "./types";

type RepositoryDto = components["schemas"]["Repository_Repository"];
type RepositoryWriteDto = components["schemas"]["Repository"];
type RepositoryLocaleDto = components["schemas"]["RepositoryLocale_Repository"];
type RepositoryTypeDto = components["schemas"]["RepoType_RepoType"];
type AssetDto = components["schemas"]["Asset"];
type BranchDto = components["schemas"]["Branch"];
type RepositoryDtoWithType = RepositoryDto & {
    readonly repoType?: RepositoryTypeDto;
};

const LocaleConstructor = require("ilib-locale") as typeof Locale;

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
    dropExporterType?: "BOX" | "FILE_SYSTEM";
    sourceLocale?: Locale;
    repositoryLocales?: readonly MojitoLocale[];
}>;

/** Mutable repository fields. */
export type RepositoryUpdateParams = ForwardCompatParams<
    Partial<RepositoryCreateParams>
>;

/**
 * A Mojito repository (project) that holds assets and text units.
 */
export class Repository {
    private readonly client: MojitoClient;
    private readonly dto: RepositoryDto;
    private readonly modeledType?: RepositoryType;

    /**
     * @param client SDK session.
     * @param data Repository payload from the API.
     */
    constructor(client: MojitoClient, data: RepositoryDto = {}, repositoryType?: RepositoryType) {
        this.client = client;
        this.dto = data;
        const repoType = (data as RepositoryDtoWithType).repoType;
        this.modeledType = repositoryType ??
            (repoType ? new RepositoryType(client, repoType) : undefined);
    }

    /** Numeric repository id when present. */
    get id(): number | undefined {
        return this.dto.id;
    }

    /** Repository name when present. */
    get name(): string | undefined {
        return this.dto.name;
    }

    get description(): string | undefined {
        return this.dto.description;
    }

    /**
     * Repository type when supplied by a future Mojito response or explicitly
     * associated by the caller.
     */
    get repositoryType(): RepositoryType | undefined {
        return this.modeledType;
    }

    /**
     * List repositories. When `name` is omitted, callers should be aware that
     * some Mojito builds require it; unknown extras are still forwarded.
     *
     * @param client SDK session.
     * @param params Optional name filter and extras.
     */
    static async list(
        client: MojitoClient,
        params: RepositoryListParams = {},
    ): Promise<Repository[]> {
        const result = await client.call<readonly RepositoryDto[]>("getRepositories_1", params);
        return (result ?? []).map((item) => new Repository(client, item));
    }

    /**
     * Find repositories by exact name.
     *
     * @param client SDK session.
     * @param name Repository name.
     * @param extras Extra forwarded parameters.
     */
    static async find(
        client: MojitoClient,
        name: string,
        extras: ForwardCompatParams = {},
    ): Promise<Repository[]> {
        return Repository.list(client, { name, ...extras });
    }

    /**
     * Load a repository by id.
     *
     * @param client SDK session.
     * @param repositoryId Repository id.
     * @param extras Extra forwarded parameters.
     */
    static async get(
        client: MojitoClient,
        repositoryId: number,
        extras: ForwardCompatParams = {},
    ): Promise<Repository> {
        const data = await client.call<RepositoryDto>("getRepositoryById", {
            repositoryId,
            ...extras,
        });
        return new Repository(client, data ?? {});
    }

    /**
     * Create a repository.
     *
     * @param client SDK session.
     * @param params Create payload.
     */
    static async create(
        client: MojitoClient,
        params: RepositoryCreateParams,
    ): Promise<Repository> {
        const data = await client.call<RepositoryDto>("createRepository", {
            body: repositoryWriteBody(params),
        });
        return new Repository(client, data ?? {});
    }

    /**
     * Update this repository via PATCH.
     *
     * @param params Fields to update (merged with extras).
     */
    async update(params: RepositoryUpdateParams): Promise<void> {
        if (this.id === undefined) {
            throw new Error("Repository.update requires a repository id");
        }
        await this.client.call("updateRepository", {
            repositoryId: this.id,
            body: repositoryWriteBody(params),
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

    /** List assets in this repository. */
    async assets(params: AssetListParams = {}): Promise<Asset[]> {
        const repositoryId = this.requireId("assets");
        const result = await this.client.call<readonly AssetDto[]>("getAssets", {
            ...params,
            repositoryId,
        });
        return (result ?? []).map((item) => new Asset(this.client, item));
    }

    /** List branches in this repository. */
    async branches(params: Omit<BranchListParams, "repositoryId"> = {}): Promise<Branch[]> {
        const repositoryId = this.requireId("branches");
        const result = await this.client.call<readonly BranchDto[]>("getBranchesOfRepository", {
            ...params,
            repositoryId,
        });
        return (result ?? []).map((item) => new Branch(this.client, item, repositoryId));
    }

    /** List drops for this repository. */
    drops(params: Omit<DropListParams, "repositoryId"> = {}): Promise<Drop[]> {
        return Drop.list(this.client, {
            ...params,
            repositoryId: this.requireId("drops"),
        });
    }

    /** Export a new drop for this repository. */
    exportDrop(params: Omit<DropExportParams, "repositoryId"> = {}): Promise<Drop> {
        return Drop.export(this.client, {
            ...params,
            repositoryId: this.requireId("exportDrop"),
        });
    }

    /** List screenshots associated with this repository. */
    screenshots(params: Omit<ScreenshotListParams, "repositoryIds"> = {}): Promise<Screenshot[]> {
        return Screenshot.list(this.client, {
            ...params,
            repositoryIds: [this.requireId("screenshots")],
        });
    }

    /** Get the target locales configured for this repository. */
    async getLocales(): Promise<MojitoLocale[]> {
        const data = await this.getCurrent();
        return (data.repositoryLocales ?? [])
            .filter((item) => !!item.locale?.bcp47Tag)
            .map((item) => mojitoLocaleFromDto(this.client, item));
    }

    /**
     * Replace the target locales configured for this repository.
     *
     * A fully translated locale has no inheritance. An inherited locale may
     * name a parent target locale; without one, it inherits from the source
     * locale.
     */
    async setLocales(locales: readonly MojitoLocale[]): Promise<void> {
        const repositoryId = this.requireId("setLocales");
        await this.client.call("updateRepository", {
            repositoryId,
            body: {
                repositoryLocales: locales.map(mojitoLocaleToDto),
            },
        });
    }

    /** Get this repository's plain source locale. */
    async getSourceLocale(): Promise<Locale | undefined> {
        const data = await this.getCurrent();
        return data.sourceLocale?.bcp47Tag
            ? new LocaleConstructor(data.sourceLocale.bcp47Tag)
            : undefined;
    }

    /** Set this repository's plain source locale. */
    async setSourceLocale(locale: Locale): Promise<void> {
        const repositoryId = this.requireId("setSourceLocale");
        await this.client.call("updateRepository", {
            repositoryId,
            body: {
                sourceLocale: { bcp47Tag: locale.getSpec() },
            },
        });
    }

    private requireId(method: string): number {
        if (this.id === undefined) {
            throw new Error(`Repository.${method} requires a repository id`);
        }
        return this.id;
    }

    private getCurrent(): Promise<RepositoryDto> {
        return this.client.call<RepositoryDto>("getRepositoryById", {
            repositoryId: this.requireId("get"),
        });
    }
}

function mojitoLocaleFromDto(
    client: MojitoClient,
    data: RepositoryLocaleDto,
): MojitoLocale {
    const locale = new LocaleConstructor(data.locale?.bcp47Tag);
    const parent = data.parentLocale?.locale?.bcp47Tag
        ? new LocaleConstructor(data.parentLocale.locale.bcp47Tag)
        : undefined;
    return new MojitoLocale(client, locale, {
        inherits: data.toBeFullyTranslated === false,
        parent,
    });
}

function mojitoLocaleToDto(locale: MojitoLocale): components["schemas"]["RepositoryLocale"] {
    return {
        locale: { bcp47Tag: locale.locale.getSpec() },
        toBeFullyTranslated: locale.isFullyTranslated,
        parentLocale: locale.parent
            ? {
                locale: { bcp47Tag: locale.parent.getSpec() },
            }
            : undefined,
    };
}

function repositoryWriteBody(params: RepositoryUpdateParams): RepositoryWriteDto {
    const { sourceLocale, repositoryLocales, ...rest } = params;
    return {
        ...rest,
        sourceLocale: sourceLocale
            ? { bcp47Tag: sourceLocale.getSpec() }
            : undefined,
        repositoryLocales: repositoryLocales?.map(mojitoLocaleToDto),
    };
}
