/*
 * resolve-locale.ts - map BCP 47 tags onto Mojito numeric locale ids
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

type LocaleDto = components["schemas"]["Locale"];

type MojitoRpc = {
    call<T = unknown>(operationId: string, params?: Record<string, unknown>): Promise<T>;
};

const localeIds = new WeakMap<object, Map<string, number>>();

/** Resolve a BCP 47 tag to the numeric locale id Mojito paths require. */
export async function resolveLocaleId(
    client: MojitoRpc,
    locale: Locale,
): Promise<number> {
    const localeSpec = locale.getSpec();

    let cache = localeIds.get(client);
    if (!cache) {
        cache = new Map();
        localeIds.set(client, cache);
    }

    const cached = cache.get(localeSpec);
    if (cached !== undefined) {
        return cached;
    }

    const result = await client.call<readonly LocaleDto[]>("getLocales", {
        bcp47Tag: localeSpec,
    });
    const match = (result ?? []).find((candidate) => candidate.bcp47Tag === localeSpec);
    if (match?.id === undefined) {
        throw new Error(`Unknown Mojito locale "${localeSpec}"`);
    }

    cache.set(localeSpec, match.id);
    return match.id;
}
