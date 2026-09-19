/*
 * SourceString.ts - high-level Mojito source string
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
import type { MojitoClient } from "./MojitoClient";
import { Translation, type TranslationStatus } from "./Translation";
import type { AsyncOperationOptions, ForwardCompatParams } from "./types";

type TextUnitDto = components["schemas"]["TextUnitDTO"];
type TranslationHistoryDto = components["schemas"]["TMTextUnitVariant_TranslationHistorySummary"];
type AiTranslateResponseDto = components["schemas"]["ProtoAiTranslateResponse"];

const LocaleConstructor = require("ilib-locale") as typeof Locale;

/** Search criteria for source strings and their translations. */
export type SourceStringSearchParams = ForwardCompatParams<{
    repositoryIds?: number[];
    repositoryNames?: string[];
    sourceStringIds?: number[];
    assetPath?: string;
    name?: string;
    source?: string;
    target?: string;
    locales?: Locale[];
    searchType?: "EXACT" | "CONTAINS" | "ILIKE";
    limit?: number;
    offset?: number;
}>;

/** Options for translating a source string with AI. */
export type AiTranslationOptions = AsyncOperationOptions & {
    locale: Locale;
    model?: string;
    promptSuffix?: string;
    glossaryName?: string;
};

/** A source-language string stored in a Mojito repository. */
export class SourceString {
    private readonly client: MojitoClient;
    private readonly dto: TextUnitDto;

    /**
     * @param client SDK session.
     * @param data Text unit payload from the API.
     */
    constructor(client: MojitoClient, data: TextUnitDto = {}) {
        this.client = client;
        this.dto = data;
    }

    get id(): number | undefined {
        return this.dto.tmTextUnitId;
    }

    get name(): string | undefined {
        return this.dto.name;
    }

    get content(): string | undefined {
        return this.dto.source;
    }

    get comment(): string | undefined {
        return this.dto.comment;
    }

    get repositoryName(): string | undefined {
        return this.dto.repositoryName;
    }

    /** Translation included with this search result, when a locale was requested. */
    get translation(): Translation | undefined {
        if (
            this.dto.tmTextUnitVariantId === undefined &&
            this.dto.target === undefined &&
            this.dto.targetLocale === undefined
        ) {
            return undefined;
        }
        return new Translation(this.client, {
            id: this.dto.tmTextUnitVariantId,
            sourceStringId: this.id,
            locale: this.dto.targetLocale
                ? new LocaleConstructor(this.dto.targetLocale)
                : undefined,
            content: this.dto.target,
            comment: this.dto.targetComment,
            status: this.dto.status,
            includedInLocalizedFile: this.dto.includedInLocalizedFile,
        });
    }

    /**
     * Search source strings. Prefer {@link Asset.sourceStrings} when you already
     * have the containing asset.
     *
     * @param client SDK session.
     * @param params Search filters.
     */
    static async search(
        client: MojitoClient,
        params: SourceStringSearchParams = {},
    ): Promise<SourceString[]> {
        const { sourceStringIds, locales, ...body } = params;
        const result = await client.call<readonly TextUnitDto[]>("getTextUnitsWithPost", {
            body: {
                ...body,
                tmTextUnitIds: sourceStringIds,
                localeTags: locales?.map((locale) => locale.getSpec()),
            },
        });
        return (result ?? []).map((item) => new SourceString(client, item));
    }

    /** Load the translation history for one locale. */
    async getTranslationHistory(locale: Locale): Promise<Translation[]> {
        if (this.id === undefined) {
            throw new Error("SourceString.getTranslationHistory requires a source string id");
        }
        const result = await this.client.call<readonly TranslationHistoryDto[]>(
            "getTextUnitHistory",
            { tmTextUnitId: this.id, bcp47Tag: locale.getSpec() },
        );
        return (result ?? []).map((item) => new Translation(this.client, {
            id: item.id,
            sourceStringId: this.id,
            locale: item.locale?.bcp47Tag
                ? new LocaleConstructor(item.locale.bcp47Tag)
                : undefined,
            content: item.content,
            comment: item.comment,
            status: item.status as TranslationStatus | undefined,
            includedInLocalizedFile: item.includedInLocalizedFile,
        }));
    }

    /** Translate this source string with Mojito's AI translation workflow. */
    async translateWithAi(options: AiTranslationOptions): Promise<void> {
        if (this.id === undefined || !this.repositoryName) {
            throw new Error(
                "SourceString.translateWithAi requires a source string id and repository name",
            );
        }
        const response = await this.client.call<AiTranslateResponseDto>("aiTranslate", {
            body: {
                repositoryName: this.repositoryName,
                targetBcp47tags: [options.locale.getSpec()],
                tmTextUnitIds: [this.id],
                useModel: options.model,
                promptSuffix: options.promptSuffix,
                glossaryName: options.glossaryName,
            },
        });
        await waitForTask(this.client, response?.pollableTask, options);
    }
}
