/*
 * PollableTask.test.ts - unit tests for the PollableTask object model
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

import { PollableTask } from "../../src/model/PollableTask";
import { createJsonFetch, createTestClient } from "./testClient";

describe("PollableTask", () => {
    test("get loads a task by id", async () => {
        const { fetchImpl, getLastRequest } = createJsonFetch(() => ({
            id: 55,
            name: "export",
            allFinished: false,
        }));
        const client = createTestClient(fetchImpl);

        const task = await PollableTask.get(client, 55, { includeSubTasks: true });
        expect(task).toBeInstanceOf(PollableTask);
        expect(task.id).toBe(55);
        expect(task.allFinished).toBe(false);

        const url = new URL(getLastRequest().url);
        expect(url.pathname).toBe("/api/pollableTasks/55");
        expect(url.searchParams.get("includeSubTasks")).toBe("true");
    });

    test("refresh reloads the same task id", async () => {
        let calls = 0;
        const fetchImpl: typeof fetch = async (input) => {
            calls += 1;
            expect(String(input)).toContain("/api/pollableTasks/77");
            return new Response(
                JSON.stringify({ id: 77, allFinished: true, message: "done" }),
                { status: 200 },
            );
        };
        const client = createTestClient(fetchImpl);
        const task = new PollableTask(client, { id: 77, allFinished: false });

        const refreshed = await task.refresh();
        expect(refreshed.id).toBe(77);
        expect(refreshed.allFinished).toBe(true);
        expect(refreshed.data.message).toBe("done");
        expect(calls).toBe(1);
    });

    test("refresh requires a task id", async () => {
        const client = createTestClient(async () => new Response("{}", { status: 200 }));
        const task = new PollableTask(client, {});
        await expect(task.refresh()).rejects.toThrow(/requires a task id/);
    });
});
