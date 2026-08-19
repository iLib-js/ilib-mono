/*
 * Repository.test.ts - unit tests for the Repository object model
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

import { Repository } from "../../src/model/Repository";
import { createJsonFetch, createTestClient } from "./testClient";

describe("Repository", () => {
    test("list maps array results into Repository instances", async () => {
        const { fetchImpl, getLastRequest } = createJsonFetch(() => [
            { id: 1, name: "alpha" },
            { id: 2, name: "beta" },
        ]);
        const client = createTestClient(fetchImpl);

        const repos = await Repository.list(client, { name: "alpha", extra: true });
        expect(repos).toHaveLength(2);
        expect(repos[0]).toBeInstanceOf(Repository);
        expect(repos[0].id).toBe(1);
        expect(repos[1].name).toBe("beta");

        const url = new URL(getLastRequest().url);
        expect(url.pathname).toBe("/api/repositories");
        expect(url.searchParams.get("name")).toBe("alpha");
        expect(url.searchParams.get("extra")).toBe("true");
    });

    test("find forwards the name filter to list", async () => {
        const { fetchImpl, getLastRequest } = createJsonFetch(() => [{ id: 3, name: "demo" }]);
        const client = createTestClient(fetchImpl);

        const repos = await Repository.find(client, "demo", { includeDeleted: false });
        expect(repos[0].name).toBe("demo");
        const url = new URL(getLastRequest().url);
        expect(url.searchParams.get("name")).toBe("demo");
        expect(url.searchParams.get("includeDeleted")).toBe("false");
    });

    test("get loads a repository by id", async () => {
        const { fetchImpl, getLastRequest } = createJsonFetch(() => ({
            id: 42,
            name: "loaded",
        }));
        const client = createTestClient(fetchImpl);

        const repo = await Repository.get(client, 42);
        expect(repo.id).toBe(42);
        expect(repo.name).toBe("loaded");
        expect(new URL(getLastRequest().url).pathname).toBe("/api/repositories/42");
    });

    test("create posts a repository body", async () => {
        const { fetchImpl, getLastRequest } = createJsonFetch(() => ({
            id: 9,
            name: "created",
        }));
        const client = createTestClient(fetchImpl);

        const repo = await Repository.create(client, {
            name: "created",
            description: "desc",
            futureFlag: 1,
        });
        expect(repo.id).toBe(9);
        expect(getLastRequest().init?.method).toBe("POST");
        expect(JSON.parse(String(getLastRequest().init?.body))).toEqual({
            name: "created",
            description: "desc",
            futureFlag: 1,
        });
    });

    test("update patches the repository and delete removes it", async () => {
        const calls: Array<{ url: string; method?: string; body?: string }> = [];
        const fetchImpl: typeof fetch = async (input, init) => {
            calls.push({
                url: String(input),
                method: init?.method,
                body: init?.body !== undefined ? String(init.body) : undefined,
            });
            if (init?.method === "PATCH") {
                return new Response("updated", { status: 200 });
            }
            return new Response("", { status: 200 });
        };
        const client = createTestClient(fetchImpl);
        const repo = new Repository(client, { id: 11, name: "old" });

        const updateResult = await repo.update({ description: "new", keepOpen: true });
        expect(updateResult).toBe("updated");
        expect(calls[0].method).toBe("PATCH");
        expect(calls[0].url).toContain("/api/repositories/11");
        expect(JSON.parse(String(calls[0].body))).toEqual({
            description: "new",
            keepOpen: true,
        });

        await repo.delete({ soft: true });
        expect(calls[1].method).toBe("DELETE");
        expect(calls[1].url).toContain("/api/repositories/11");
        expect(new URL(calls[1].url).searchParams.get("soft")).toBe("true");
    });

    test("update and delete require an id", async () => {
        const client = createTestClient(async () => new Response("{}", { status: 200 }));
        const repo = new Repository(client, {});
        await expect(repo.update({ name: "x" })).rejects.toThrow(/requires a repository id/);
        await expect(repo.delete()).rejects.toThrow(/requires a repository id/);
    });
});
