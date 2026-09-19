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
import { SourceString, type SourceStringSearchParams } from "./SourceString";
import type { AsyncOperationOptions, ForwardCompatParams } from "./types";

type AssetDto = components["schemas"]["Asset"];
type LocalizedAssetDto = components["schemas"]["LocalizedAssetBody"];
type ImportLocalizedAssetDto = components["schemas"]["ImportLocalizedAssetBody"];

/** Filters for listing assets in a repository. */
export type AssetListParams = ForwardCompatParams<{
    path?: string;
    deleted?: boolean;
    virtual?: boolean;
}>;

/** Formatting controls shared by the localization endpoints. */
type AssetFilterOptions = {
    filterConfigIdOverride?: LocalizedAssetDto["filterConfigIdOverride"];
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
    inheritanceMode?: LocalizedAssetDto["inheritanceMode"];
    /** Which translation statuses to include. */
    status?: LocalizedAssetDto["status"];
    /** Name recorded for this pull run. */
    pullRunName?: string;
}>;

/** Options for generating pseudo-localized content. */
export type AssetPseudoLocalizeParams = ForwardCompatParams<AssetFilterOptions & {
    /** Source content to pseudo-localize. */
    content: string;
    /** Character substitution strategy. */
    substituteType?: LocalizedAssetDto["substituteType"];
}>;

/** Options for importing translated content back into Mojito. */
export type AssetImportLocalizedParams = ForwardCompatParams<AssetFilterOptions & {
    /** Locale of the translated content. */
    locale: Locale;
    /** Translated content to import. */
    content: string;
    /** Status to assign when the target equals the source. */
    statusForEqualTarget?: ImportLocalizedAssetDto["statusForEqualTarget"];
    /** Waiting behavior for the background import. */
    wait?: AsyncOperationOptions;
}>;

/** A source file or virtual source asset in a Mojito repository. */
export class Asset {
    private readonly client: MojitoClient;
    private readonly dto: AssetDto;

    /**
     * @param client SDK session.
     * @param data Asset payload from the API.
     */
    constructor(client: MojitoClient, data: AssetDto = {}) {
        this.client = client;
        this.dto = data;
    }

    get id(): number | undefined {
        return this.dto.id;
    }

    get path(): string | undefined {
        return this.dto.path;
    }

    get isVirtual(): boolean {
        return !!this.dto.virtual;
    }

    get isDeleted(): boolean {
        return !!this.dto.deleted;
    }

    /** Search source strings that belong to this asset. */
    async sourceStrings(
        params: Omit<SourceStringSearchParams, "assetPath"> = {},
    ): Promise<SourceString[]> {
        if (!this.path) {
            throw new Error("Asset.sourceStrings requires an asset path");
        }
        return SourceString.search(this.client, {
            ...params,
            assetPath: this.path,
        });
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
