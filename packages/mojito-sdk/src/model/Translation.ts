/*
 * Translation.ts - locale-specific translation of a Mojito source string
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
import type { MojitoClient } from "./MojitoClient";
import type { ForwardCompatParams } from "./types";

type AiReviewResponseDto = components["schemas"]["ProtoAiReviewSingleTextUnitResponse"];
type TranslationHistoryDto = components["schemas"]["TMTextUnitVariant_TranslationHistorySummary"];

const LocaleConstructor = require("ilib-locale") as typeof Locale;

/** Translation workflow status. */
export type TranslationStatus = "TRANSLATION_NEEDED" | "REVIEW_NEEDED" | "APPROVED";

/** Person recorded as creating a translation variant. */
export type TranslationAuthor = {
    id?: number;
    username?: string;
    givenName?: string;
    surname?: string;
    commonName?: string;
};

/** Comment attached to one translation variant. */
export type TranslationComment = {
    id?: number;
    createdDate?: string;
    content?: string;
    severity?: "INFO" | "WARNING" | "ERROR";
    type?: "LEVERAGING" | "INTEGRITY_CHECK" | "AI_TRANSLATE" | "QUALITY_CHECK" | "THIRD_PARTY_TMS_PULL" | "WORKBENCH_IMPORT";
};

/** Domain fields used to construct a translation. */
export type TranslationProps = {
    id?: number;
    sourceStringId?: number;
    locale?: Locale;
    content?: string;
    comment?: string;
    status?: TranslationStatus;
    includedInLocalizedFile?: boolean;
    /** When this variant was created. Often unset on a current search row. */
    createdDate?: string;
    /** Account that created this variant. Often unset on a current search row. */
    createdByUser?: TranslationAuthor;
    /** Comments stored on this variant. Often unset on a current search row. */
    comments?: readonly TranslationComment[];
};

/**
 * Parameters for creating a translation on a source string
 * (`SourceString.createTranslation`).
 */
export type TranslationCreateParams = ForwardCompatParams<{
    locale: Locale;
    content: string;
    comment?: string;
    status?: TranslationStatus;
}>;

/** Result of asking Mojito to review one translation with AI. */
export type AiReviewResult = {
    suggestedContent?: string;
    explanation?: string;
    confidence?: number;
    score?: number;
    reviewRequired?: boolean;
    reason?: string;
};

/** A translation of one source string into one locale. */
export class Translation {
    private readonly client: MojitoClient;
    private readonly values: TranslationProps;

    /**
     * @param client SDK session.
     * @param values Domain fields for this translation.
     */
    constructor(client: MojitoClient, values: TranslationProps = {}) {
        this.client = client;
        this.values = { ...values };
    }

    get id(): number | undefined {
        return this.values.id;
    }

    get sourceStringId(): number | undefined {
        return this.values.sourceStringId;
    }

    get locale(): Locale | undefined {
        return this.values.locale;
    }

    get content(): string | undefined {
        return this.values.content;
    }

    get comment(): string | undefined {
        return this.values.comment;
    }

    get status(): TranslationStatus | undefined {
        return this.values.status;
    }

    get includedInLocalizedFile(): boolean {
        return !!this.values.includedInLocalizedFile;
    }

    get createdDate(): string | undefined {
        return this.values.createdDate;
    }

    get createdByUser(): TranslationAuthor | undefined {
        return this.values.createdByUser;
    }

    get comments(): readonly TranslationComment[] | undefined {
        return this.values.comments;
    }

    /** Ask Mojito's AI reviewer to evaluate this translation. */
    async reviewWithAi(): Promise<AiReviewResult> {
        if (this.id === undefined) {
            throw new Error("Translation.reviewWithAi requires a translation id");
        }
        const response = await this.client.call<AiReviewResponseDto>(
            "getAiReviewForSingleTextUnit",
            { protoAiReviewSingleTextUnitRequest: { tmTextUnitVariantId: this.id } },
        );
        const review = response?.aiReviewOutput;
        return {
            suggestedContent: review?.altTarget?.content ?? review?.target?.content,
            explanation: review?.altTarget?.explanation ?? review?.target?.explanation,
            confidence: review?.altTarget?.confidenceLevel ?? review?.target?.confidenceLevel,
            score: review?.existingTargetRating?.score,
            reviewRequired: review?.reviewRequired?.required,
            reason: review?.reviewRequired?.reason,
        };
    }

    /**
     * Delete this translation's current variant.
     *
     * Mojito's path parameter is named `textUnitId`; this SDK passes the
     * translation (variant) id.
     */
    async delete(): Promise<void> {
        if (this.id === undefined) {
            throw new Error("Translation.delete requires a translation id");
        }
        await this.client.call("deleteTMTextUnitCurrentVariant", {
            textUnitId: this.id,
        });
    }
}

type HistoryAuthor = {
    id?: number;
    username?: string;
    givenName?: string;
    surname?: string;
    commonName?: string;
};

/** Map one history variant onto a {@link Translation}. */
export function translationFromHistory(
    client: MojitoClient,
    sourceStringId: number | undefined,
    item: TranslationHistoryDto,
): Translation {
    const locale = item.locale?.bcp47Tag
        ? new LocaleConstructor(item.locale.bcp47Tag)
        : undefined;
    return new Translation(client, {
        id: item.id,
        sourceStringId,
        locale,
        content: item.content,
        comment: item.comment,
        status: item.status,
        includedInLocalizedFile: item.includedInLocalizedFile,
        createdDate: item.createdDate,
        createdByUser: authorFrom(item.createdByUser),
        comments: item.tmTextUnitVariantComments?.map((comment) => ({
            id: comment.id,
            createdDate: comment.createdDate,
            content: comment.content,
            severity: comment.severity,
            type: comment.type,
        })),
    });
}

function authorFrom(user: HistoryAuthor | undefined): TranslationAuthor | undefined {
    if (!user) {
        return undefined;
    }
    return {
        id: user.id,
        username: user.username,
        givenName: user.givenName,
        surname: user.surname,
        commonName: user.commonName,
    };
}
