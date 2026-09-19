/*
 * Screenshot.ts - high-level Mojito screenshot
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

type ScreenshotDto = components["schemas"]["Screenshot"];

/** Filters for finding screenshots. */
export type ScreenshotListParams = ForwardCompatParams<{
    repositoryIds?: readonly number[];
    locales?: readonly Locale[];
    name?: string;
}>;

/** Mutable screenshot fields. */
export type ScreenshotUpdateParams = ForwardCompatParams<{
    name?: string;
    status?: "REJECTED" | "NEEDS_REVIEW" | "ACCEPTED";
    sequence?: number;
    comment?: string;
}>;

/** A screenshot that gives translators visual context for source strings. */
export class Screenshot {
    private readonly client: MojitoClient;
    private readonly dto: ScreenshotDto;

    /**
     * @param client SDK session.
     * @param data Screenshot payload from the API.
     */
    constructor(client: MojitoClient, data: ScreenshotDto = {}) {
        this.client = client;
        this.dto = data;
    }

    get id(): number | undefined {
        return this.dto.id;
    }

    get name(): string | undefined {
        return this.dto.name;
    }

    get sourceUrl(): string | undefined {
        return this.dto.src;
    }

    get status(): ScreenshotDto["status"] {
        return this.dto.status;
    }

    static async list(
        client: MojitoClient,
        params: ScreenshotListParams = {},
    ): Promise<Screenshot[]> {
        const { repositoryIds, locales, name, ...extras } = params;
        const result = await client.call<readonly ScreenshotDto[]>("getScreeenshots", {
            "repositoryIds[]": repositoryIds,
            "bcp47Tags[]": locales?.map((locale) => locale.getSpec()),
            screenshotName: name,
            ...extras,
        });
        return (result ?? []).map((item) => new Screenshot(client, item));
    }

    async update(params: ScreenshotUpdateParams): Promise<Screenshot> {
        if (this.id === undefined) {
            throw new Error("Screenshot.update requires a screenshot id");
        }
        const result = await this.client.call<ScreenshotDto>("updateScreenshot", {
            id: this.id,
            body: params,
        });
        return new Screenshot(this.client, result ?? {});
    }

    async delete(): Promise<void> {
        if (this.id === undefined) {
            throw new Error("Screenshot.delete requires a screenshot id");
        }
        await this.client.call("deleteScreenshot", { id: this.id });
    }
}
