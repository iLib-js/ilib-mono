/*
 * Asset.ts - high-level Mojito source asset
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
import { resolveLocaleId } from "../internal/resolve-locale";
import { waitForTask } from "../internal/wait-for-task";
import type { MojitoClient } from "./MojitoClient";
import {
    searchSourceStrings,
    sourceStringFromDto,
    type SourceString,
    type SourceStringSearchParams,
} from "./SourceString";
import type { AsyncOperationOptions, ForwardCompatParams } from "./types";

type AssetDto = components["schemas"]["Asset"];
type LocalizedAssetDto = components["schemas"]["LocalizedAssetBody"];
type ImportLocalizedAssetDto = components["schemas"]["ImportLocalizedAssetBody"];
type PollableTaskDto = components["schemas"]["PollableTask"];
type TextUnitDto = components["schemas"]["TextUnitDTO"];
type VirtualAssetTextUnitDto = components["schemas"]["VirtualAssetTextUnit"];
type VirtualAssetDto = components["schemas"]["VirtualAsset"];

/** Filter selected when localizing or importing an asset. */
export type AssetFilterConfigId =
    | "PROPERTIES_JAVA"
    | "MACSTRINGSDICT_FILTER_KEY"
    | "XCODE_XLIFF"
    | "CSV_ADOBE_MAGENTO"
    | "HTML_ALPHA";

/** Filters for listing assets in a repository. */
export type AssetListParams = ForwardCompatParams<{
    path?: string;
    deleted?: boolean;
    virtual?: boolean;
}>;

/**
 * Parameters for importing a source file into a repository (`Repository.createAsset`).
 *
 * `path` and `content` are required to construct the resulting asset and run extraction.
 */
export type AssetCreateParams = ForwardCompatParams<{
    path: string;
    content: string;
    branch?: string;
    branchCreatedByUsername?: string;
    branchNotifiers?: readonly string[];
    pushRunName?: string;
    filterConfigIdOverride?: AssetFilterConfigId;
    filterOptions?: readonly string[];
    extractedContent?: boolean;
    commitHash?: string;
    wait?: AsyncOperationOptions;
}>;

/** Parameters for creating a virtual asset (`Repository.createVirtualAsset`). */
export type VirtualAssetCreateParams = ForwardCompatParams<{
    path: string;
}>;

/** Mutable fields for a virtual asset. */
export type AssetUpdateParams = ForwardCompatParams<{
    path?: string;
    deleted?: boolean;
}>;

/** Fields required to create a source string on an asset. */
export type SourceStringCreateParams = ForwardCompatParams<{
    name: string;
    content: string;
    comment?: string;
    pluralForm?: string;
    pluralFormOther?: string;
    doNotTranslate?: boolean;
}>;

/** Options for batch virtual-asset source-string writes. */
export type SourceStringBatchOptions = {
    wait?: AsyncOperationOptions;
};

/** Formatting controls shared by the localization endpoints. */
type AssetFilterOptions = {
    filterConfigIdOverride?: AssetFilterConfigId;
    filterOptions?: readonly string[];
};

/** Options for generating a localized version of source content. */
export type AssetLocalizeParams = ForwardCompatParams<AssetFilterOptions & {
    /** Target locale. */
    locale: Locale;
    /** Source content to localize. */
    content: string;
    /** Locale tag to write into the output, when it differs from `locale`. */
    outputBcp47tag?: string;
    /** How to treat strings with no translation in the target locale. */
    inheritanceMode?: "REMOVE_UNTRANSLATED" | "USE_PARENT";
    /** Which translation statuses to include. */
    status?: "ALL" | "ACCEPTED_OR_NEEDS_REVIEW" | "ACCEPTED";
    /** Name recorded for this pull run. */
    pullRunName?: string;
}>;

/** Options for generating pseudo-localized content. */
export type AssetPseudoLocalizeParams = ForwardCompatParams<AssetFilterOptions & {
    /** Source content to pseudo-localize. */
    content: string;
    /** Character substitution strategy. */
    substituteType?: "RANDOM" | "CONSISTENT";
}>;

/** Options for importing translated content back into Mojito. */
export type AssetImportLocalizedParams = ForwardCompatParams<AssetFilterOptions & {
    /** Locale of the translated content. */
    locale: Locale;
    /** Translated content to import. */
    content: string;
    /** Status to assign when the target equals the source. */
    statusForEqualTarget?: "SKIPPED" | "REVIEW_NEEDED" | "TRANSLATION_NEEDED" | "APPROVED";
    /** Waiting behavior for the background import. */
    wait?: AsyncOperationOptions;
}>;

/** Domain fields used to construct an asset. */
export type AssetProps = {
    id?: number;
    path?: string;
    virtual?: boolean;
    deleted?: boolean;
    /** Repository that contains this asset. Scopes {@link Asset.sourceStrings}. */
    repositoryId?: number;
};

/** A source file or virtual source asset in a Mojito repository. */
export class Asset {
    private readonly client: MojitoClient;
    private readonly props: AssetProps;

    /**
     * @param client SDK session.
     * @param props Domain fields for this asset.
     */
    constructor(client: MojitoClient, props: AssetProps = {}) {
        this.client = client;
        this.props = { ...props };
    }

    get id(): number | undefined {
        return this.props.id;
    }

    get path(): string | undefined {
        return this.props.path;
    }

    get isVirtual(): boolean {
        return !!this.props.virtual;
    }

    get isDeleted(): boolean {
        return !!this.props.deleted;
    }

    /**
     * Update this virtual asset's path or deleted flag.
     *
     * Uses Mojito's create-or-update virtual asset endpoint.
     */
    async update(params: AssetUpdateParams): Promise<Asset> {
        const assetId = this.requireId("update");
        const { path, deleted, ...extras } = params;
        const result = await this.client.call<VirtualAssetDto>("createOrUpdateVirtualAsset", {
            body: {
                id: assetId,
                repositoryId: this.props.repositoryId,
                path: path ?? this.path,
                ...(deleted === undefined ? {} : { deleted }),
                ...extras,
            },
        });
        return new Asset(this.client, {
            id: result?.id ?? assetId,
            path: result?.path ?? path ?? this.path,
            virtual: true,
            deleted: result?.deleted ?? deleted ?? this.props.deleted,
            repositoryId: result?.repositoryId ?? this.props.repositoryId,
        });
    }

    /**
     * Search source strings that belong to this asset.
     *
     * The search is limited to this asset's path. When the asset knows its
     * repository, that repository is included so the same path in another
     * repository is not returned.
     */
    async sourceStrings(
        params: Omit<SourceStringSearchParams, "assetPath" | "repositoryIds"> = {},
    ): Promise<SourceString[]> {
        if (!this.path) {
            throw new Error("Asset.sourceStrings requires an asset path");
        }
        return searchSourceStrings(this.client, {
            ...params,
            assetPath: this.path,
            ...(this.props.repositoryId === undefined
                ? {}
                : { repositoryIds: [this.props.repositoryId] }),
        }, {
            repositoryId: this.props.repositoryId,
            assetId: this.id,
        });
    }

    /**
     * Create one source string on this asset.
     *
     * @param params Name, content, and optional metadata for the new string.
     */
    async createSourceString(params: SourceStringCreateParams): Promise<SourceString> {
        const assetId = this.requireId("createSourceString");
        const { name, content, comment, pluralForm, pluralFormOther, doNotTranslate, ...extras } =
            params;
        const result = await this.client.call<TextUnitDto>("addTextUnit", {
            body: {
                assetId,
                name,
                source: content,
                comment,
                pluralForm,
                pluralFormOther,
                doNotTranslate,
                assetPath: this.path,
                ...extras,
            },
        });
        return sourceStringFromDto(
            this.client,
            result ?? {},
            this.props.repositoryId,
            assetId,
        );
    }

    /**
     * Add source strings to this virtual asset, waiting for Mojito to finish.
     *
     * @param units Strings to add.
     * @param options Waiting behavior for the background task.
     */
    async createSourceStrings(
        units: readonly SourceStringCreateParams[],
        options: SourceStringBatchOptions = {},
    ): Promise<void> {
        const assetId = this.requireId("createSourceStrings");
        const task = await this.client.call<PollableTaskDto>("addTextUnits", {
            assetId,
            body: units.map(toVirtualAssetTextUnit),
        });
        await waitForTask(this.client, task, options.wait);
    }

    /**
     * Replace all source strings on this virtual asset, waiting for Mojito to finish.
     *
     * @param units The complete set of strings that should remain on the asset.
     * @param options Waiting behavior for the background task.
     */
    async replaceSourceStrings(
        units: readonly SourceStringCreateParams[],
        options: SourceStringBatchOptions = {},
    ): Promise<void> {
        const assetId = this.requireId("replaceSourceStrings");
        const task = await this.client.call<PollableTaskDto>("replaceTextUnits", {
            assetId,
            body: units.map(toVirtualAssetTextUnit),
        });
        await waitForTask(this.client, task, options.wait);
    }

    /**
     * Localize source content into one target locale.
     *
     * @param params Target locale, source content, and formatting options.
     * @returns The localized content.
     */
    async localize(params: AssetLocalizeParams): Promise<string> {
        const assetId = this.requireId("localize");
        const { locale, ...body } = params;
        const localeId = await resolveLocaleId(this.client, locale);
        const result = await this.client.call<LocalizedAssetDto>(
            "getLocalizedAssetForContent",
            { assetId, localeId, body },
        );
        return this.requireContent(result?.content, "localize");
    }

    /**
     * Pseudo-localize source content to check for layout and encoding issues.
     *
     * @param params Source content and substitution options.
     * @returns The pseudo-localized content.
     */
    async pseudoLocalize(params: AssetPseudoLocalizeParams): Promise<string> {
        const assetId = this.requireId("pseudoLocalize");
        const result = await this.client.call<LocalizedAssetDto>(
            "getPseudoLocalizedAssetForContent",
            { assetId, body: params },
        );
        return this.requireContent(result?.content, "pseudoLocalize");
    }

    /**
     * Import translated content for one locale, waiting for Mojito to finish.
     *
     * @param params Locale, translated content, and import options.
     */
    async importLocalized(params: AssetImportLocalizedParams): Promise<void> {
        const assetId = this.requireId("importLocalized");
        const { locale, wait, ...body } = params;
        const localeId = await resolveLocaleId(this.client, locale);
        const result = await this.client.call<ImportLocalizedAssetDto>(
            "importLocalizedAsset",
            { assetId, localeId, body },
        );
        await waitForTask(this.client, result?.pollableTask, wait);
    }

    async delete(): Promise<void> {
        await this.client.call("deleteAssetById", {
            assetId: this.requireId("delete"),
        });
    }

    private requireId(method: string): number {
        if (this.id === undefined) {
            throw new Error(`Asset.${method} requires an asset id`);
        }
        return this.id;
    }

    private requireContent(content: string | undefined, method: string): string {
        if (content === undefined) {
            throw new Error(`Asset.${method} returned no content`);
        }
        return content;
    }
}

/** Map an asset payload onto {@link Asset}. */
export function assetFromDto(
    client: MojitoClient,
    data: AssetDto,
    repositoryId?: number,
): Asset {
    return new Asset(client, {
        id: data.id,
        path: data.path,
        virtual: data.virtual,
        deleted: data.deleted,
        repositoryId: repositoryId ?? data.repository?.id,
    });
}

function toVirtualAssetTextUnit(params: SourceStringCreateParams): VirtualAssetTextUnitDto {
    const { name, content, comment, pluralForm, pluralFormOther, doNotTranslate, ...extras } =
        params;
    return {
        name,
        content,
        comment,
        pluralForm,
        pluralFormOther,
        doNotTranslate,
        ...extras,
    };
}
