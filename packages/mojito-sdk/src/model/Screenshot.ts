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

import type { MojitoClient } from "./MojitoClient";
import type { ForwardCompatParams } from "./types";

/** Review state of a screenshot. */
export type ScreenshotStatus = "REJECTED" | "NEEDS_REVIEW" | "ACCEPTED";

/** How screenshot text-unit filters are matched. */
export type ScreenshotSearchType = "EXACT" | "CONTAINS" | "ILIKE";

/** Domain fields used to construct a screenshot. */
export type ScreenshotProps = {
    id?: number;
    name?: string;
    sourceUrl?: string;
    status?: ScreenshotStatus;
    sequence?: number;
    comment?: string;
};

/** Filters for finding screenshots. */
export type ScreenshotListParams = ForwardCompatParams<{
    repositoryIds?: readonly number[];
    locales?: readonly Locale[];
    /** Screenshot name. Sent as Mojito's `screenshotName` query parameter. */
    name?: string;
    status?: ScreenshotStatus;
    /** Linked source-string name. Sent as Mojito's `name` query parameter. */
    textUnitName?: string;
    /** Linked source-string content. */
    textUnitSource?: string;
    /** Linked translation content. */
    textUnitTarget?: string;
    searchType?: ScreenshotSearchType;
}>;

/** Mutable screenshot fields. */
export type ScreenshotUpdateParams = ForwardCompatParams<{
    name?: string;
    status?: ScreenshotStatus;
    sequence?: number;
    comment?: string;
}>;

/**
 * Parameters for creating a screenshot on a source string
 * (`SourceString.createScreenshot`).
 */
export type ScreenshotCreateParams = ForwardCompatParams<{
    name: string;
    sourceUrl?: string;
    status?: ScreenshotStatus;
    sequence?: number;
    comment?: string;
    /** Screenshot-run name. Defaults to {@link ScreenshotCreateParams.name}. */
    runName?: string;
}>;

type ScreenshotWire = ScreenshotProps & {
    src?: string;
    textUnits?: readonly {
        tmTextUnit?: { id?: number };
    }[];
};

/** A screenshot that gives translators visual context for source strings. */
export class Screenshot {
    private readonly client: MojitoClient;
    private readonly props: ScreenshotProps;

    /**
     * @param client SDK session.
     * @param props Domain fields for this screenshot.
     */
    constructor(client: MojitoClient, props: ScreenshotProps = {}) {
        this.client = client;
        this.props = { ...props };
    }

    get id(): number | undefined {
        return this.props.id;
    }

    get name(): string | undefined {
        return this.props.name;
    }

    get sourceUrl(): string | undefined {
        return this.props.sourceUrl;
    }

    get status(): ScreenshotStatus | undefined {
        return this.props.status;
    }

    async update(params: ScreenshotUpdateParams): Promise<Screenshot> {
        if (this.id === undefined) {
            throw new Error("Screenshot.update requires a screenshot id");
        }
        const result = await this.client.call<ScreenshotWire>("updateScreenshot", {
            id: this.id,
            body: params,
        });
        return screenshotFromDto(this.client, result ?? {});
    }

    async delete(): Promise<void> {
        if (this.id === undefined) {
            throw new Error("Screenshot.delete requires a screenshot id");
        }
        await this.client.call("deleteScreenshot", { id: this.id });
    }
}

/** Map a screenshot payload onto {@link Screenshot}. */
export function screenshotFromDto(client: MojitoClient, data: ScreenshotWire): Screenshot {
    return new Screenshot(client, {
        id: data.id,
        name: data.name,
        sourceUrl: data.sourceUrl ?? data.src,
        status: data.status,
        sequence: data.sequence,
        comment: data.comment,
    });
}

/** Search screenshots. `name` filters the screenshot; `textUnitName` filters linked strings. */
export async function listScreenshots(
    client: MojitoClient,
    params: ScreenshotListParams = {},
): Promise<Screenshot[]> {
    const rows = await queryScreenshots(client, params);
    return rows.map((item) => screenshotFromDto(client, item));
}

/**
 * Screenshots owned by one source string.
 *
 * The query uses the string name and content. Rows that include text-unit
 * links are kept only when one of those links is this string. Rows that omit
 * links are kept, because the server-side filter is then the only signal.
 */
export async function listScreenshotsForSourceString(
    client: MojitoClient,
    sourceString: {
        id: number;
        name?: string;
        content?: string;
        repositoryId?: number;
    },
    params: Omit<ScreenshotListParams, "repositoryIds" | "textUnitName" | "textUnitSource"> = {},
): Promise<Screenshot[]> {
    const hasTextUnitFilter = sourceString.name !== undefined || sourceString.content !== undefined;
    const requestedSearchType = params.searchType;
    const searchType: ScreenshotSearchType | undefined =
        requestedSearchType === "EXACT" ||
        requestedSearchType === "CONTAINS" ||
        requestedSearchType === "ILIKE"
            ? requestedSearchType
            : (hasTextUnitFilter ? "EXACT" : undefined);
    const rows = await queryScreenshots(client, {
        ...params,
        repositoryIds: sourceString.repositoryId === undefined
            ? undefined
            : [sourceString.repositoryId],
        textUnitName: sourceString.name,
        textUnitSource: sourceString.content,
        searchType,
    });
    return rows
        .filter((item) => includesSourceString(item, sourceString.id))
        .map((item) => screenshotFromDto(client, item));
}

async function queryScreenshots(
    client: MojitoClient,
    params: ScreenshotListParams,
): Promise<ScreenshotWire[]> {
    const {
        repositoryIds,
        locales,
        name,
        status,
        textUnitName,
        textUnitSource,
        textUnitTarget,
        searchType,
        ...extras
    } = params;
    const result = await client.call<readonly ScreenshotWire[]>("getScreeenshots", {
        "repositoryIds[]": repositoryIds,
        "bcp47Tags[]": locales?.map((locale) => locale.getSpec()),
        screenshotName: name,
        status,
        name: textUnitName,
        source: textUnitSource,
        target: textUnitTarget,
        searchType,
        ...extras,
    });
    return [...(result ?? [])];
}

function includesSourceString(data: ScreenshotWire, sourceStringId: number): boolean {
    if (!data.textUnits) {
        return true;
    }
    return data.textUnits.some((unit) => unit.tmTextUnit?.id === sourceStringId);
}
