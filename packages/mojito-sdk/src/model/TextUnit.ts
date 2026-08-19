/*
 * TextUnit.ts - high-level TextUnit helpers for Mojito
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

import type { LowLevelClient } from "../lowlevel/client";
import type { ForwardCompatParams, TextUnitData } from "./types";

/** Body for POST /api/textunits/search. */
export type TextUnitSearchParams = ForwardCompatParams<{
    repositoryIds?: number[];
    repositoryNames?: string[];
    localeTags?: string[];
    tmTextUnitIds?: number[];
    searchType?: string;
    searchEnabled?: boolean;
    limit?: number;
    offset?: number;
}>;

/**
 * A Mojito text unit (string) and related search helpers.
 */
export class TextUnit {
    /** Underlying text-unit JSON from Mojito. */
    readonly data: TextUnitData;

    /**
     * @param _client Low-level Mojito client (reserved for future instance methods).
     * @param data Text unit payload.
     */
    constructor(_client: LowLevelClient, data: TextUnitData = {}) {
        this.data = data;
    }

    /** TM text unit id when present. */
    get id(): number | undefined {
        return this.data.tmTextUnitId;
    }

    /**
     * Search text units.
     *
     * @param client Low-level client.
     * @param params Search body fields; extras are forwarded.
     */
    static async search(
        client: LowLevelClient,
        params: TextUnitSearchParams = {},
    ): Promise<TextUnit[]> {
        const result = await client.call<TextUnitData[]>("getTextUnitsWithPost", {
            body: params,
        });
        return (result ?? []).map((item) => new TextUnit(client, item));
    }
}
