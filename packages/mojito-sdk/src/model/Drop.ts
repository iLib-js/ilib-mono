/*
 * Drop.ts - high-level Drop object for Mojito translation drops
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
import type { DropData, ForwardCompatParams, Page, Pageable } from "./types";

/** Parameters for listing drops. */
export type DropListParams = ForwardCompatParams<{
    repositoryId?: number;
    imported?: boolean;
    canceled?: boolean;
    pageable?: Pageable;
}>;

/** Parameters for exporting a drop. */
export type DropExportParams = ForwardCompatParams<{
    repositoryId: number;
    type?: string;
    locales?: string[];
    useInheritance?: boolean;
    uploadTime?: unknown;
}>;

/** Parameters for importing a translated drop. */
export type DropImportParams = ForwardCompatParams<{
    repositoryId?: number;
    dropId?: number;
    status?: string;
}>;

/** Parameters for canceling a drop. */
export type DropCancelParams = ForwardCompatParams<{
    dropId?: number;
}>;

/**
 * A Mojito drop: a batch of strings exported to a translation vendor.
 */
export class Drop {
    /** Underlying drop JSON from Mojito. */
    readonly data: DropData;
    private readonly client: LowLevelClient;

    /**
     * @param client Low-level Mojito client.
     * @param data Drop payload from the API.
     */
    constructor(client: LowLevelClient, data: DropData = {}) {
        this.client = client;
        this.data = data;
    }

    /** Numeric drop id when present. */
    get id(): number | undefined {
        return this.data.id;
    }

    /** Drop name when present. */
    get name(): string | undefined {
        return this.data.name;
    }

    /**
     * List drops, optionally filtered by repository / import state.
     *
     * Unknown extra parameters are forwarded to the backend.
     *
     * @param client Low-level client.
     * @param params List filters and pageable options.
     */
    static async list(
        client: LowLevelClient,
        params: DropListParams = {},
    ): Promise<Drop[]> {
        const pageable = params.pageable ?? { page: 0, size: 50 };
        const page = await client.call<Page<DropData>>("getDrops", {
            ...params,
            pageable,
        });
        return (page?.content ?? []).map((item) => new Drop(client, item));
    }

    /**
     * Export a new drop for translation.
     *
     * @param client Low-level client.
     * @param params Export configuration (`repositoryId` required).
     * @returns Export configuration response from Mojito (includes pollable task).
     */
    static async export(
        client: LowLevelClient,
        params: DropExportParams,
    ): Promise<Record<string, unknown>> {
        return client.call<Record<string, unknown>>("exportDrop", { body: params });
    }

    /**
     * Import translations for a drop.
     *
     * @param client Low-level client.
     * @param params Import configuration.
     */
    static async import(
        client: LowLevelClient,
        params: DropImportParams,
    ): Promise<Record<string, unknown>> {
        return client.call<Record<string, unknown>>("importDrop", { body: params });
    }

    /**
     * Cancel this drop (or the drop id supplied in params).
     *
     * @param params Optional override fields; defaults `dropId` from this instance.
     */
    async cancel(params: DropCancelParams = {}): Promise<Record<string, unknown>> {
        const dropId = params.dropId ?? this.id;
        if (dropId === undefined) {
            throw new Error("Drop.cancel requires a dropId");
        }
        return this.client.call<Record<string, unknown>>("cancelDrop", {
            body: { ...params, dropId },
        });
    }

    /**
     * Force-complete a partially imported drop.
     *
     * @param params Optional extras forwarded to the backend.
     */
    async complete(params: ForwardCompatParams = {}): Promise<void> {
        if (this.id === undefined) {
            throw new Error("Drop.complete requires a drop id");
        }
        await this.client.call("completeDropById", { dropId: this.id, ...params });
    }
}
