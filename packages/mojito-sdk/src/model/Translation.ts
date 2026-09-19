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

type AiReviewResponseDto = components["schemas"]["ProtoAiReviewSingleTextUnitResponse"];

/** Translation workflow status. */
export type TranslationStatus = "TRANSLATION_NEEDED" | "REVIEW_NEEDED" | "APPROVED";

/** Domain fields used to construct a translation. */
export type TranslationProps = {
    id?: number;
    sourceStringId?: number;
    locale?: Locale;
    content?: string;
    comment?: string;
    status?: TranslationStatus;
    includedInLocalizedFile?: boolean;
};

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
}
