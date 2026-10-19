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
import { waitForTask } from "../internal/wait-for-task";
import {
    Asset,
    assetFromDto,
    type AssetCreateParams,
    type AssetListParams,
    type VirtualAssetCreateParams,
} from "./Asset";
import { branchFromDto, type Branch, type BranchListParams } from "./Branch";
import { Drop, dropFromDto, type DropExportParams, type DropListParams } from "./Drop";
import type { MojitoClient } from "./MojitoClient";
import { MojitoLocale } from "./MojitoLocale";
import { RepositoryType, repositoryTypeFromDto } from "./RepositoryType";
import { listScreenshots, type Screenshot, type ScreenshotListParams } from "./Screenshot";
import type { ForwardCompatParams } from "./types";

type RepositoryDto = components["schemas"]["Repository_Repository"];
type RepositoryWriteDto = components["schemas"]["Repository"];
type RepositoryLocaleDto = components["schemas"]["RepositoryLocale_Repository"];
type AssetDto = components["schemas"]["Asset"];
type BranchDto = components["schemas"]["Branch"];
type DropPageDto = components["schemas"]["PageDrop_DropSummary"];
type ExportDropDto = components["schemas"]["ExportDropConfig"];
type SourceAssetDto = components["schemas"]["SourceAsset"];
type VirtualAssetDto = components["schemas"]["VirtualAsset"];
type RepositoryDtoWithType = RepositoryDto & {
    readonly repoType?: components["schemas"]["RepoType_RepoType"];
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

/** Domain fields used to construct a repository. */
export type RepositoryProps = {
    id?: number;
    name?: string;
    description?: string;
    repositoryType?: RepositoryType;
};

/**
 * A Mojito repository (project) that holds assets and text units.
 */
export class Repository {
    private readonly client: MojitoClient;
    private readonly props: RepositoryProps;

    /**
     * @param client SDK session.
     * @param props Domain fields for this repository.
     */
    constructor(client: MojitoClient, props: RepositoryProps = {}) {
        this.client = client;
        this.props = { ...props };
    }

    /** Numeric repository id when present. */
    get id(): number | undefined {
        return this.props.id;
    }

    /** Repository name when present. */
    get name(): string | undefined {
        return this.props.name;
    }

    get description(): string | undefined {
        return this.props.description;
    }

    /**
     * Repository type when supplied by a future Mojito response or explicitly
     * associated by the caller.
     */
    get repositoryType(): RepositoryType | undefined {
        return this.props.repositoryType;
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
        return (result ?? []).map((item) => assetFromDto(this.client, item, repositoryId));
    }

    /**
     * Import a source file as a new asset, waiting for extraction to finish.
     *
     * @param params Path, content, and optional import options.
     */
    async createAsset(params: AssetCreateParams): Promise<Asset> {
        const repositoryId = this.requireId("createAsset");
        const { wait, path, content, ...rest } = params;
        const response = await this.client.call<SourceAssetDto>("importSourceAsset", {
            body: {
                repositoryId,
                path,
                content,
                ...rest,
            },
        });
        await waitForTask(this.client, response?.pollableTask, wait);
        return new Asset(this.client, {
            id: response?.addedAssetId,
            path: response?.path ?? path,
            virtual: false,
            repositoryId,
        });
    }

    /**
     * Create (or update by path) a virtual asset in this repository.
     *
     * @param params Path for the virtual asset.
     */
    async createVirtualAsset(params: VirtualAssetCreateParams): Promise<Asset> {
        const repositoryId = this.requireId("createVirtualAsset");
        const { path, ...rest } = params;
        const result = await this.client.call<VirtualAssetDto>("createOrUpdateVirtualAsset", {
            body: {
                repositoryId,
                path,
                ...rest,
            },
        });
        return new Asset(this.client, {
            id: result?.id,
            path: result?.path ?? path,
            virtual: true,
            deleted: result?.deleted,
            repositoryId: result?.repositoryId ?? repositoryId,
        });
    }

    /** List branches in this repository. */
    async branches(params: Omit<BranchListParams, "repositoryId"> = {}): Promise<Branch[]> {
        const repositoryId = this.requireId("branches");
        const result = await this.client.call<readonly BranchDto[]>("getBranchesOfRepository", {
            ...params,
            repositoryId,
        });
        return (result ?? []).map((item) => branchFromDto(this.client, item, repositoryId));
    }

    /** List drops for this repository. */
    async drops(params: DropListParams = {}): Promise<Drop[]> {
        const repositoryId = this.requireId("drops");
        const { pageable, ...rest } = params;
        const page = await this.client.call<DropPageDto>("getDrops", {
            ...rest,
            repositoryId,
            pageable: pageable ?? { page: 0, size: 50 },
        });
        return (page?.content ?? []).map((item) => dropFromDto(this.client, item, repositoryId));
    }

    /** Export a new drop for this repository. */
    async exportDrop(params: DropExportParams = {}): Promise<Drop> {
        const repositoryId = this.requireId("exportDrop");
        const { wait, locales, ...body } = params;
        const response = await this.client.call<ExportDropDto>("exportDrop", {
            body: {
                ...body,
                repositoryId,
                locales: locales?.map((locale) => locale.getSpec()),
            },
        });
        await waitForTask(this.client, response?.pollableTask, wait);
        return new Drop(this.client, {
            id: response?.dropId,
            repositoryId,
        });
    }

    /** List screenshots associated with this repository. */
    screenshots(params: Omit<ScreenshotListParams, "repositoryIds"> = {}): Promise<Screenshot[]> {
        return listScreenshots(this.client, {
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

/** Map a repository payload onto {@link Repository}. */
export function repositoryFromDto(client: MojitoClient, data: RepositoryDto): Repository {
    const repoType = (data as RepositoryDtoWithType).repoType;
    return new Repository(client, {
        id: data.id,
        name: data.name,
        description: data.description,
        repositoryType: repoType ? repositoryTypeFromDto(client, repoType) : undefined,
    });
}

/**
 * List repositories. When `name` is omitted, callers should be aware that
 * some Mojito builds require it; unknown extras are still forwarded.
 */
export async function listRepositories(
    client: MojitoClient,
    params: RepositoryListParams = {},
): Promise<Repository[]> {
    const result = await client.call<readonly RepositoryDto[]>("getRepositories_1", params);
    return (result ?? []).map((item) => repositoryFromDto(client, item));
}

/** Load a repository by id. */
export async function loadRepository(
    client: MojitoClient,
    repositoryId: number,
    extras: ForwardCompatParams = {},
): Promise<Repository> {
    const data = await client.call<RepositoryDto>("getRepositoryById", {
        repositoryId,
        ...extras,
    });
    return repositoryFromDto(client, data ?? {});
}

/** Create a repository. */
export async function insertRepository(
    client: MojitoClient,
    params: RepositoryCreateParams,
): Promise<Repository> {
    const data = await client.call<RepositoryDto>("createRepository", {
        body: repositoryWriteBody(params),
    });
    return repositoryFromDto(client, data ?? {});
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
