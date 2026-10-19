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
import {
    listScreenshotsForSourceString,
    screenshotFromDto,
    type Screenshot,
    type ScreenshotCreateParams,
    type ScreenshotListParams,
} from "./Screenshot";
import {
    Translation,
    translationFromHistory,
    type TranslationCreateParams,
    type TranslationProps,
    type TranslationStatus,
} from "./Translation";
import type { AsyncOperationOptions, ForwardCompatParams } from "./types";

type TextUnitDto = components["schemas"]["TextUnitDTO"];
type TranslationHistoryDto = components["schemas"]["TMTextUnitVariant_TranslationHistorySummary"];
type AiTranslateResponseDto = components["schemas"]["ProtoAiTranslateResponse"];
type ScreenshotRunDto = components["schemas"]["ScreenshotRun"];

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

/** Mutable fields for a virtual-asset source string. */
export type SourceStringUpdateParams = ForwardCompatParams<{
    name?: string;
    content?: string;
    comment?: string;
    pluralForm?: string;
    pluralFormOther?: string;
    doNotTranslate?: boolean;
}>;

/** Domain fields used to construct a source string. */
export type SourceStringProps = {
    id?: number;
    name?: string;
    content?: string;
    comment?: string;
    repositoryName?: string;
    repositoryId?: number;
    assetPath?: string;
    /** Asset that owns this string. Required for virtual-asset update/delete. */
    assetId?: number;
    translation?: TranslationProps;
};

/** A source-language string stored in a Mojito repository. */
export class SourceString {
    private readonly client: MojitoClient;
    private readonly props: SourceStringProps;

    /**
     * @param client SDK session.
     * @param props Domain fields for this source string.
     */
    constructor(client: MojitoClient, props: SourceStringProps = {}) {
        this.client = client;
        this.props = { ...props };
    }

    get id(): number | undefined {
        return this.props.id;
    }

    get name(): string | undefined {
        return this.props.name;
    }

    get content(): string | undefined {
        return this.props.content;
    }

    get comment(): string | undefined {
        return this.props.comment;
    }

    get repositoryName(): string | undefined {
        return this.props.repositoryName;
    }

    /** Translation included with this search result, when a locale was requested. */
    get translation(): Translation | undefined {
        if (!this.props.translation) {
            return undefined;
        }
        return new Translation(this.client, this.props.translation);
    }

    /**
     * Update this source string on its virtual asset.
     *
     * Deletes the previous virtual text unit (matched by name) and re-adds it
     * with the merged fields.
     */
    async update(params: SourceStringUpdateParams): Promise<SourceString> {
        const assetId = this.requireAssetId("update");
        const name = params.name ?? this.name;
        if (!name) {
            throw new Error("SourceString.update requires a source string name");
        }
        const content = params.content ?? this.content;
        const comment = params.comment ?? this.comment;
        if (this.name) {
            await this.client.call("deleteTextUnit", {
                assetId,
                body: {
                    name: this.name,
                    content: this.content,
                    comment: this.comment,
                },
            });
        }
        const task = await this.client.call<components["schemas"]["PollableTask"]>(
            "addTextUnits",
            {
                assetId,
                body: [{
                    name,
                    content,
                    comment,
                    pluralForm: params.pluralForm,
                    pluralFormOther: params.pluralFormOther,
                    doNotTranslate: params.doNotTranslate,
                    ...omitKnown(params, [
                        "name",
                        "content",
                        "comment",
                        "pluralForm",
                        "pluralFormOther",
                        "doNotTranslate",
                    ]),
                }],
            },
        );
        await waitForTask(this.client, task);
        return new SourceString(this.client, {
            ...this.props,
            name,
            content,
            comment,
            assetId,
        });
    }

    /**
     * Delete this source string from its virtual asset.
     */
    async delete(): Promise<void> {
        const assetId = this.requireAssetId("delete");
        if (!this.name) {
            throw new Error("SourceString.delete requires a source string name");
        }
        await this.client.call("deleteTextUnit", {
            assetId,
            body: {
                name: this.name,
                content: this.content,
                comment: this.comment,
            },
        });
    }

    /**
     * Create a translation of this source string in one locale.
     *
     * @param params Locale, translated content, and optional status/comment.
     */
    async createTranslation(params: TranslationCreateParams): Promise<Translation> {
        const { locale, content, comment, status, ...extras } = params;
        const result = await this.client.call<TextUnitDto>("addTextUnit", {
            body: {
                tmTextUnitId: this.id,
                assetId: this.props.assetId,
                name: this.name,
                source: this.content,
                comment: this.comment,
                target: content,
                targetLocale: locale.getSpec(),
                targetComment: comment,
                status,
                repositoryName: this.repositoryName,
                assetPath: this.props.assetPath,
                ...extras,
            },
        });
        const props = translationPropsFromTextUnit(result ?? {});
        return new Translation(this.client, {
            ...props,
            sourceStringId: this.id ?? props?.sourceStringId,
            locale: props?.locale ?? locale,
            content: props?.content ?? content,
            comment: props?.comment ?? comment,
            status: props?.status ?? status,
        });
    }

    /**
     * Create a screenshot linked to this source string.
     *
     * @param params Screenshot name and optional image URL / review fields.
     */
    async createScreenshot(params: ScreenshotCreateParams): Promise<Screenshot> {
        if (this.id === undefined) {
            throw new Error("SourceString.createScreenshot requires a source string id");
        }
        const { name, sourceUrl, status, sequence, comment, runName, ...extras } = params;
        const run = await this.client.call<ScreenshotRunDto>("createOrAddToScreenshotRun", {
            body: {
                name: runName ?? name,
                repository: this.props.repositoryId === undefined
                    ? undefined
                    : { id: this.props.repositoryId },
                screenshots: [{
                    name,
                    src: sourceUrl,
                    status,
                    sequence,
                    comment,
                    textUnits: [{
                        tmTextUnit: { id: this.id },
                        name: this.name,
                        source: this.content,
                    }],
                    ...extras,
                }],
            },
        });
        const created = run?.screenshots?.[0];
        return screenshotFromDto(this.client, created ?? {
            name,
            sourceUrl,
            status,
            sequence,
            comment,
        });
    }

    /**
     * Current translations of this source string, typically one per target locale.
     *
     * Pass `locales` to choose which current translations Mojito returns.
     * Past wordings for one locale are {@link SourceString.getTranslationHistory}.
     */
    async translations(
        params: Omit<SourceStringSearchParams, "sourceStringIds"> = {},
    ): Promise<Translation[]> {
        if (this.id === undefined) {
            throw new Error("SourceString.translations requires a source string id");
        }
        const repositoryIds: number[] | undefined = this.props.repositoryId === undefined
            ? params.repositoryIds as number[] | undefined
            : [this.props.repositoryId];
        const repositoryNames: string[] | undefined =
            this.props.repositoryId === undefined &&
            this.props.repositoryName !== undefined &&
            params.repositoryNames === undefined &&
            params.repositoryIds === undefined
                ? [this.props.repositoryName]
                : params.repositoryNames as string[] | undefined;
        const rows = await searchSourceStrings(this.client, {
            ...params,
            sourceStringIds: [this.id],
            repositoryIds,
            repositoryNames,
        });
        return rows.flatMap((row) => {
            const translation = row.translation;
            return translation ? [translation] : [];
        });
    }

    /**
     * Screenshots that give visual context for this source string.
     */
    async screenshots(
        params: Omit<ScreenshotListParams, "repositoryIds" | "textUnitName" | "textUnitSource"> = {},
    ): Promise<Screenshot[]> {
        if (this.id === undefined) {
            throw new Error("SourceString.screenshots requires a source string id");
        }
        return listScreenshotsForSourceString(this.client, {
            id: this.id,
            name: this.name,
            content: this.content,
            repositoryId: this.props.repositoryId,
        }, params);
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
        return (result ?? []).map((item) => translationFromHistory(this.client, this.id, item));
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

    private requireAssetId(method: string): number {
        if (this.props.assetId === undefined) {
            throw new Error(`SourceString.${method} requires an asset id`);
        }
        return this.props.assetId;
    }
}

/** Defaults applied when mapping search rows onto {@link SourceString}. */
export type SourceStringSearchDefaults = {
    repositoryId?: number;
    assetId?: number;
};

/** Search source strings across repositories. */
export async function searchSourceStrings(
    client: MojitoClient,
    params: SourceStringSearchParams = {},
    defaults: SourceStringSearchDefaults = {},
): Promise<SourceString[]> {
    const { sourceStringIds, locales, ...body } = params;
    const result = await client.call<readonly TextUnitDto[]>("getTextUnitsWithPost", {
        body: {
            ...body,
            tmTextUnitIds: sourceStringIds,
            localeTags: locales?.map((locale) => locale.getSpec()),
        },
    });
    const repositoryId = defaults.repositoryId ??
        (params.repositoryIds?.length === 1 ? params.repositoryIds[0] : undefined);
    return (result ?? []).map((item) =>
        sourceStringFromDto(client, item, repositoryId, defaults.assetId));
}

/** Map a text-unit search row onto {@link SourceString}. */
export function sourceStringFromDto(
    client: MojitoClient,
    data: TextUnitDto,
    repositoryId?: number,
    assetId?: number,
): SourceString {
    return new SourceString(client, {
        id: data.tmTextUnitId,
        name: data.name,
        content: data.source,
        comment: data.comment,
        repositoryName: data.repositoryName,
        repositoryId,
        assetPath: data.assetPath,
        assetId: assetId ?? data.assetId,
        translation: translationPropsFromTextUnit(data),
    });
}

function omitKnown<T extends object, K extends keyof T>(
    value: T,
    keys: readonly K[],
): Omit<T, K> {
    const copy = { ...value };
    for (const key of keys) {
        delete copy[key];
    }
    return copy;
}

function translationPropsFromTextUnit(data: TextUnitDto): TranslationProps | undefined {
    if (
        data.tmTextUnitVariantId === undefined &&
        data.target === undefined &&
        data.targetLocale === undefined
    ) {
        return undefined;
    }
    return {
        id: data.tmTextUnitVariantId,
        sourceStringId: data.tmTextUnitId,
        locale: data.targetLocale ? new LocaleConstructor(data.targetLocale) : undefined,
        content: data.target,
        comment: data.targetComment,
        status: data.status as TranslationStatus | undefined,
        includedInLocalizedFile: data.includedInLocalizedFile,
    };
}
