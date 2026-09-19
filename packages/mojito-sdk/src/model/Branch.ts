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

/** A source-control/content branch within a Mojito repository. */
export class Branch {
    private readonly client: MojitoClient;
    private readonly repositoryId: number | undefined;
    private readonly dto: BranchDto;

    /**
     * @param client SDK session.
     * @param data Branch payload from the API.
     * @param repositoryId Repository that owns this branch.
     */
    constructor(client: MojitoClient, data: BranchDto = {}, repositoryId?: number) {
        this.client = client;
        this.dto = data;
        this.repositoryId = repositoryId ?? data.repository?.id;
    }

    get id(): number | undefined {
        return this.dto.id;
    }

    get name(): string | undefined {
        return this.dto.name;
    }

    get isDeleted(): boolean {
        return !!this.dto.deleted;
    }

    async delete(options: AsyncOperationOptions = {}): Promise<void> {
        if (this.repositoryId === undefined || this.id === undefined) {
            throw new Error("Branch.delete requires a repository id and branch id");
        }
        const task = await this.client.call<PollableTaskDto>("deleteBranch", {
            repositoryId: this.repositoryId,
            branchId: this.id,
        });
        await waitForTask(this.client, task, options);
    }
}
