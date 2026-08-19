/*
 * Locale.ts - high-level Locale helpers for Mojito
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
import type { ForwardCompatParams, LocaleData } from "./types";

/**
 * A Mojito locale (BCP 47 language tag).
 */
export class Locale {
    /** Underlying locale JSON from Mojito. */
    readonly data: LocaleData;

    /**
     * @param data Locale payload.
     */
    constructor(data: LocaleData = {}) {
        this.data = data;
    }

    /** Locale id when present. */
    get id(): number | undefined {
        return this.data.id;
    }

    /** BCP 47 tag when present. */
    get bcp47Tag(): string | undefined {
        return this.data.bcp47Tag;
    }

    /**
     * List locales, optionally filtered by BCP 47 tag.
     *
     * @param client Low-level client.
     * @param params Optional `bcp47Tag` filter and extras.
     */
    static async list(
        client: LowLevelClient,
        params: ForwardCompatParams<{ bcp47Tag?: string }> = {},
    ): Promise<Locale[]> {
        const result = await client.call<LocaleData[]>("getLocales", params);
        return (result ?? []).map((item) => new Locale(item));
    }
}
