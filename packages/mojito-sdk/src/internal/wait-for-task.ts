/*
 * wait-for-task.ts - hide Mojito pollable tasks behind Promises
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
import type { AsyncOperationOptions } from "../model/types";

type PollableTaskDto = components["schemas"]["PollableTask"];

const DEFAULT_TIMEOUT_MS = 5 * 60 * 1000;
const DEFAULT_POLL_INTERVAL_MS = 500;

type MojitoRpc = {
    call<T = unknown>(operationId: string, params?: Record<string, unknown>): Promise<T>;
};

function delay(milliseconds: number, signal?: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
        if (signal?.aborted) {
            reject(signal.reason ?? new Error("Operation aborted"));
            return;
        }

        const onAbort = () => {
            clearTimeout(timer);
            reject(signal?.reason ?? new Error("Operation aborted"));
        };
        const timer = setTimeout(() => {
            signal?.removeEventListener("abort", onAbort);
            resolve();
        }, milliseconds);
        signal?.addEventListener("abort", onAbort, { once: true });
    });
}

/** Wait for an internal Mojito task and return its output. */
export async function waitForTask(
    client: MojitoRpc,
    task: PollableTaskDto | undefined,
    options: AsyncOperationOptions = {},
): Promise<unknown> {
    if (!task?.id) {
        return undefined;
    }

    const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    const pollIntervalMs = options.pollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS;
    const deadline = Date.now() + timeoutMs;
    let current = task;

    while (!current.allFinished) {
        if (Date.now() >= deadline) {
            throw new Error(`Mojito operation ${task.id} timed out after ${timeoutMs}ms`);
        }
        await delay(pollIntervalMs, options.signal);
        current = (await client.call<PollableTaskDto>("getPollableTaskById", {
            pollableTaskId: task.id,
        })) ?? {};
    }

    if (current.errorMessage) {
        throw new Error(current.errorMessage);
    }

    return client.call("getPollableTaskOutput", { pollableTaskId: task.id });
}
