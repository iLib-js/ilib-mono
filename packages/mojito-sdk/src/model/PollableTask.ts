/*
 * PollableTask.ts - high-level PollableTask object for Mojito
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
import type { ForwardCompatParams, PollableTaskData } from "./types";

/**
 * A Mojito long-running / background pollable task.
 */
export class PollableTask {
    /** Underlying task JSON from Mojito. */
    readonly data: PollableTaskData;
    private readonly client: LowLevelClient;

    /**
     * @param client Low-level Mojito client.
     * @param data Task payload.
     */
    constructor(client: LowLevelClient, data: PollableTaskData = {}) {
        this.client = client;
        this.data = data;
    }

    /** Task id when present. */
    get id(): number | undefined {
        return this.data.id;
    }

    /** Whether Mojito reports the task (and subtasks) finished. */
    get allFinished(): boolean {
        return !!this.data.allFinished;
    }

    /**
     * Load a pollable task by id.
     *
     * @param client Low-level client.
     * @param pollableTaskId Task id.
     * @param extras Extra forwarded parameters.
     */
    static async get(
        client: LowLevelClient,
        pollableTaskId: number,
        extras: ForwardCompatParams = {},
    ): Promise<PollableTask> {
        const data = await client.call<PollableTaskData>("getPollableTaskById", {
            pollableTaskId,
            ...extras,
        });
        return new PollableTask(client, data ?? {});
    }

    /**
     * Refresh this task from the server.
     *
     * @param extras Extra forwarded parameters.
     */
    async refresh(extras: ForwardCompatParams = {}): Promise<PollableTask> {
        if (this.id === undefined) {
            throw new Error("PollableTask.refresh requires a task id");
        }
        return PollableTask.get(this.client, this.id, extras);
    }
}
