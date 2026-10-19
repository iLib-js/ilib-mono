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

/** Checker Mojito runs against strings in assets of a given extension. */
export type IntegrityCheckerType =
    | "MESSAGE_FORMAT"
    | "FLUENT"
    | "MESSAGE_FORMAT_DOUBLE_BRACES"
    | "PRINTF_LIKE"
    | "SIMPLE_PRINTF_LIKE"
    | "PRINTF_LIKE_IGNORE_PERCENTAGE_AFTER_BRACKETS"
    | "PRINTF_LIKE_VARIABLE_TYPE"
    | "PRINTF_LIKE_ADD_PARAMETER_SPECIFIER"
    | "COMPOSITE_FORMAT"
    | "WHITESPACE"
    | "TRAILING_WHITESPACE"
    | "HTML_TAG"
    | "ELLIPSIS"
    | "BACKQUOTE"
    | "EMPTY_TARGET_NOT_EMPTY_SOURCE"
    | "MARKDOWN_LINKS"
    | "PYTHON_FPRINT"
    | "EMAIL"
    | "URL"
    | "FORBIDS_CONTROL_CHARACTERS"
    | "MISC_AI_TRANSLATE";

/** Integrity rule applied to matching asset extensions. */
export type RepositoryTypeIntegrityChecker = {
    assetExtension?: string;
    integrityCheckerType?: IntegrityCheckerType;
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

/** Search criteria for listing repository types. */
export type RepositoryTypeListParams = ForwardCompatParams<{
    /** Optional exact repository type name filter. */
    name?: string;
}>;

/** Domain fields used to construct a repository type. */
export type RepositoryTypeProps = {
    id?: number;
    name?: string;
    description?: string;
    aiPrompt?: string;
    integrityCheckers?: readonly RepositoryTypeIntegrityChecker[];
};

/** A named repository configuration, including AI and integrity-check settings. */
export class RepositoryType {
    private readonly client: MojitoClient;
    private readonly props: RepositoryTypeProps;

    /**
     * @param client SDK session.
     * @param props Domain fields for this repository type.
     */
    constructor(client: MojitoClient, props: RepositoryTypeProps = {}) {
        this.client = client;
        this.props = {
            ...props,
            integrityCheckers: props.integrityCheckers ? [...props.integrityCheckers] : undefined,
        };
    }

    get id(): number | undefined {
        return this.props.id;
    }

    get name(): string | undefined {
        return this.props.name;
    }

    get description(): string | undefined {
        return this.props.description;
    }

    get aiPrompt(): string | undefined {
        return this.props.aiPrompt;
    }

    get integrityCheckers(): readonly RepositoryTypeIntegrityChecker[] {
        return this.props.integrityCheckers ?? [];
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

/** Map a repository-type payload onto {@link RepositoryType}. */
export function repositoryTypeFromDto(
    client: MojitoClient,
    data: RepositoryTypeDto,
): RepositoryType {
    return new RepositoryType(client, {
        id: data.id,
        name: data.name,
        description: data.description,
        aiPrompt: data.aiPrompt,
        integrityCheckers: data.integrityCheckers?.map((checker) => ({
            assetExtension: checker.assetExtension,
            integrityCheckerType: checker.integrityCheckerType,
        })),
    });
}

/** List repository types, optionally filtered by name. */
export async function listRepositoryTypes(
    client: MojitoClient,
    params: RepositoryTypeListParams = {},
): Promise<RepositoryType[]> {
    const result = await client.call<readonly RepositoryTypeDto[]>("getRepoTypes", params);
    return (result ?? []).map((item) => repositoryTypeFromDto(client, item));
}

/** Load one repository type by id. */
export async function loadRepositoryType(
    client: MojitoClient,
    repositoryTypeId: number,
): Promise<RepositoryType> {
    const result = await client.call<RepositoryTypeDto>("getRepoTypeById", {
        repoTypeId: repositoryTypeId,
    });
    return repositoryTypeFromDto(client, result ?? {});
}

/** Create a repository type. */
export async function insertRepositoryType(
    client: MojitoClient,
    params: RepositoryTypeCreateParams,
): Promise<RepositoryType> {
    const result = await client.call<RepositoryTypeDto>("createRepoType", { body: params });
    return repositoryTypeFromDto(client, result ?? {});
}
