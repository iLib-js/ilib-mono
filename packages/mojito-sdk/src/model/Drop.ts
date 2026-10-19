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
type ImportDropDto = components["schemas"]["ImportDropConfig"];
type CancelDropDto = components["schemas"]["CancelDropConfig"];

/** Parameters for listing drops of one repository. */
export type DropListParams = ForwardCompatParams<{
    imported?: boolean;
    canceled?: boolean;
    pageable?: Pageable;
}>;

/** Parameters for exporting a drop from the repository that owns it. */
export type DropExportParams = ForwardCompatParams<{
    type?: "TRANSLATION" | "REVIEW";
    locales?: readonly Locale[];
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

/** Domain fields used to construct a drop. */
export type DropProps = {
    id?: number;
    name?: string;
    canceled?: boolean;
    repositoryId?: number;
};

/**
 * A Mojito drop: a batch of strings exported to a translation vendor.
 */
export class Drop {
    private readonly client: MojitoClient;
    private readonly props: DropProps;

    /**
     * @param client SDK session.
     * @param props Domain fields for this drop.
     */
    constructor(client: MojitoClient, props: DropProps = {}) {
        this.client = client;
        this.props = { ...props };
    }

    /** Numeric drop id when present. */
    get id(): number | undefined {
        return this.props.id;
    }

    /** Drop name when present. */
    get name(): string | undefined {
        return this.props.name;
    }

    get isCanceled(): boolean {
        return !!this.props.canceled;
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
        const repositoryId = params.repositoryId ?? this.props.repositoryId;
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
            name: this.name,
            canceled: this.props.canceled,
            repositoryId,
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

/** Map a drop payload onto {@link Drop}. */
export function dropFromDto(
    client: MojitoClient,
    data: DropDto,
    repositoryId?: number,
): Drop {
    return new Drop(client, {
        id: data.id,
        name: data.name,
        canceled: data.canceled,
        repositoryId: repositoryId ?? data.repository?.id,
    });
}
