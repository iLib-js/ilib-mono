/*
 * Branch.ts - high-level Mojito repository branch
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

import type { components } from "../generated/openapi";
import { waitForTask } from "../internal/wait-for-task";
import type { MojitoClient } from "./MojitoClient";
import type { AsyncOperationOptions, ForwardCompatParams } from "./types";

type BranchDto = components["schemas"]["Branch"];
type PollableTaskDto = components["schemas"]["PollableTask"];

/** Filters for branches belonging to a repository. */
export type BranchListParams = ForwardCompatParams<{
    name?: string;
    deleted?: boolean;
    translated?: boolean;
}>;

/** Domain fields used to construct a branch. */
export type BranchProps = {
    id?: number;
    name?: string;
    deleted?: boolean;
    repositoryId?: number;
};

/** A source-control/content branch within a Mojito repository. */
export class Branch {
    private readonly client: MojitoClient;
    private readonly props: BranchProps;

    /**
     * @param client SDK session.
     * @param props Domain fields for this branch.
     */
    constructor(client: MojitoClient, props: BranchProps = {}) {
        this.client = client;
        this.props = { ...props };
    }

    get id(): number | undefined {
        return this.props.id;
    }

    get name(): string | undefined {
        return this.props.name;
    }

    get isDeleted(): boolean {
        return !!this.props.deleted;
    }

    async delete(options: AsyncOperationOptions = {}): Promise<void> {
        const repositoryId = this.props.repositoryId;
        if (repositoryId === undefined || this.id === undefined) {
            throw new Error("Branch.delete requires a repository id and branch id");
        }
        const task = await this.client.call<PollableTaskDto>("deleteBranch", {
            repositoryId,
            branchId: this.id,
        });
        await waitForTask(this.client, task, options);
    }
}

/** Map a branch payload onto {@link Branch}. */
export function branchFromDto(
    client: MojitoClient,
    data: BranchDto,
    repositoryId?: number,
): Branch {
    return new Branch(client, {
        id: data.id,
        name: data.name,
        deleted: data.deleted,
        repositoryId: repositoryId ?? data.repository?.id,
    });
}
