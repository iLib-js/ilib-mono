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

import type Locale from "ilib-locale" with { "resolution-mode": "import" };

import type { components } from "../generated/openapi";
import { waitForTask } from "../internal/wait-for-task";
import type { MojitoClient } from "./MojitoClient";
import type { AsyncOperationOptions, ForwardCompatParams, Pageable } from "./types";

type DropDto = components["schemas"]["Drop_DropSummary"];
type DropPageDto = components["schemas"]["PageDrop_DropSummary"];
type ExportDropDto = components["schemas"]["ExportDropConfig"];
type ImportDropDto = components["schemas"]["ImportDropConfig"];
type CancelDropDto = components["schemas"]["CancelDropConfig"];

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
    type?: "TRANSLATION" | "REVIEW";
    locales?: Locale[];
    useInheritance?: boolean;
    uploadTime?: string;
    wait?: AsyncOperationOptions;
}>;

/** Parameters for importing a translated drop. */
export type DropImportParams = ForwardCompatParams<{
    repositoryId?: number;
    status?: "TRANSLATION_NEEDED" | "REVIEW_NEEDED" | "APPROVED";
    wait?: AsyncOperationOptions;
}>;

/**
 * A Mojito drop: a batch of strings exported to a translation vendor.
 */
export class Drop {
    private readonly client: MojitoClient;
    private readonly dto: DropDto;

    /**
     * @param client SDK session.
     * @param data Drop payload from the API.
     */
    constructor(client: MojitoClient, data: DropDto = {}) {
        this.client = client;
        this.dto = data;
    }

    /** Numeric drop id when present. */
    get id(): number | undefined {
        return this.dto.id;
    }

    /** Drop name when present. */
    get name(): string | undefined {
        return this.dto.name;
    }

    get isCanceled(): boolean {
        return !!this.dto.canceled;
    }

    /**
     * List drops, optionally filtered by repository / import state.
     *
     * Unknown extra parameters are forwarded to the backend.
     *
     * @param client SDK session.
     * @param params List filters and pageable options.
     */
    static async list(
        client: MojitoClient,
        params: DropListParams = {},
    ): Promise<Drop[]> {
        const pageable = params.pageable ?? { page: 0, size: 50 };
        const page = await client.call<DropPageDto>("getDrops", {
            ...params,
            pageable,
        });
        return (page?.content ?? []).map((item) => new Drop(client, item));
    }

    /**
     * Export a new drop for translation.
     *
     * Prefer {@link Repository.exportDrop} when you already have a repository
     * instance.
     *
     * @param client SDK session.
     * @param params Export configuration (`repositoryId` required).
     * @returns The exported drop after Mojito finishes the background operation.
     */
    static async export(
        client: MojitoClient,
        params: DropExportParams,
    ): Promise<Drop> {
        const { wait, locales, ...body } = params;
        const response = await client.call<ExportDropDto>("exportDrop", {
            body: {
                ...body,
                locales: locales?.map((locale) => locale.getSpec()),
            },
        });
        await waitForTask(client, response?.pollableTask, wait);
        return new Drop(client, {
            id: response?.dropId,
            repository: { id: params.repositoryId },
        });
    }

    /**
     * Import translations for this drop.
     *
     * @param params Import configuration. `repositoryId` defaults to the
     *     repository recorded on this drop.
     */
    async import(params: DropImportParams = {}): Promise<Drop> {
        if (this.id === undefined) {
            throw new Error("Drop.import requires a drop id");
        }
        const repositoryId = params.repositoryId ?? this.dto.repository?.id;
        if (repositoryId === undefined) {
            throw new Error("Drop.import requires a repository id");
        }
        const { wait, ...body } = params;
        const response = await this.client.call<ImportDropDto>("importDrop", {
            body: { ...body, dropId: this.id, repositoryId },
        });
        await waitForTask(this.client, response?.pollableTask, wait);
        return new Drop(this.client, {
            id: this.id,
            repository: { id: repositoryId },
        });
    }

    /**
     * Cancel this drop.
     *
     * @param options Waiting behavior for the background cancel.
     */
    async cancel(options: AsyncOperationOptions = {}): Promise<void> {
        if (this.id === undefined) {
            throw new Error("Drop.cancel requires a dropId");
        }
        const response = await this.client.call<CancelDropDto>("cancelDrop", {
            body: { dropId: this.id },
        });
        await waitForTask(this.client, response?.pollableTask, options);
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
