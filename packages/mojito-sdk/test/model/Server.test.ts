/*
 * Server.test.ts - unit tests for the Server domain root
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

import { Drop } from "../../src/model/Drop";
import { Repository } from "../../src/model/Repository";
import { RepositoryType } from "../../src/model/RepositoryType";
import { Screenshot } from "../../src/model/Screenshot";
import { SourceString } from "../../src/model/SourceString";
import { User } from "../../src/model/User";
import { createJsonFetch, createTestClient } from "./testClient";

describe("Server", () => {
    test("repository types can be loaded and created from the server", async () => {
        const { fetchImpl, getLastRequest } = createJsonFetch((_url, init) => {
            if (init?.method === "POST") {
                return {
                    id: 8,
                    name: "mobile",
                    integrityCheckers: [{
                        assetExtension: "json",
                        integrityCheckerType: "MESSAGE_FORMAT",
                    }],
                };
            }
            return { id: 3, name: "web" };
        });
        const server = createTestClient(fetchImpl).server;

        const loaded = await server.getRepositoryType(3);
        expect(loaded).toBeInstanceOf(RepositoryType);
        expect(loaded.name).toBe("web");
        expect(new URL(getLastRequest().url).pathname).toBe("/api/repo-types/3");

        const created = await server.createRepositoryType({
            name: "mobile",
            integrityCheckers: [{ assetExtension: "json", integrityCheckerType: "MESSAGE_FORMAT" }],
        });
        expect(created.id).toBe(8);
        expect(created.integrityCheckers).toEqual([
            { assetExtension: "json", integrityCheckerType: "MESSAGE_FORMAT" },
        ]);
    });

    test("users lists accounts without keeping passwords", async () => {
        const { fetchImpl, getLastRequest } = createJsonFetch(() => ({
            content: [{ id: 1, username: "alice", password: "hash" }],
        }));
        const users = await createTestClient(fetchImpl).server.users();

        expect(users[0]).toBeInstanceOf(User);
        expect(users[0].id).toBe(1);
        expect(users[0].username).toBe("alice");
        expect("password" in users[0]).toBe(false);
        const url = new URL(getLastRequest().url);
        expect(url.pathname).toBe("/api/users");
        expect(url.searchParams.get("page")).toBe("0");
        expect(url.searchParams.get("size")).toBe("50");
    });

    test("createUser sends the password and returns an account without it", async () => {
        const { fetchImpl, getLastRequest } = createJsonFetch(() => ({
            id: 2,
            username: "bob",
            password: "secret",
        }));
        const user = await createTestClient(fetchImpl).server.createUser({
            username: "bob",
            password: "secret",
        });

        expect(user.username).toBe("bob");
        expect("password" in user).toBe(false);
        expect(JSON.parse(String(getLastRequest().init?.body))).toEqual({
            username: "bob",
            password: "secret",
        });
    });

    test("searchSourceStrings posts cross-repository filters", async () => {
        const { fetchImpl, getLastRequest } = createJsonFetch(() => [
            { tmTextUnitId: 4, name: "hello", source: "Hello", repositoryName: "demo" },
        ]);
        const strings = await createTestClient(fetchImpl).server.searchSourceStrings({
            repositoryIds: [9],
            source: "Hello",
        });

        expect(strings[0]).toBeInstanceOf(SourceString);
        expect(strings[0].repositoryName).toBe("demo");
        expect(JSON.parse(String(getLastRequest().init?.body))).toEqual({
            repositoryIds: [9],
            source: "Hello",
        });
    });

    test("databaseLatency maps the monitoring snapshot", async () => {
        const { fetchImpl, getLastRequest } = createJsonFetch(() => ({
            timestamp: "2026-01-01T00:00:00Z",
            iterations: 3,
            raw: { averageLatencyMs: 1.5, measurements: [{ iteration: 1, latencyMs: 1.5 }] },
        }));
        const latency = await createTestClient(fetchImpl).server.databaseLatency({ iterations: 3 });

        expect(latency).toEqual({
            timestamp: "2026-01-01T00:00:00Z",
            iterations: 3,
            raw: {
                measurements: [{ iteration: 1, latencyMs: 1.5 }],
                minLatencyMs: undefined,
                maxLatencyMs: undefined,
                averageLatencyMs: 1.5,
            },
            hibernateHealth: undefined,
            hibernateRepo: undefined,
        });
        const url = new URL(getLastRequest().url);
        expect(url.pathname).toBe("/api/monitoring/db");
        expect(url.searchParams.get("iterations")).toBe("3");
    });

    test("collection helpers are methods on the owning object", () => {
        expect("list" in Repository).toBe(false);
        expect("find" in Repository).toBe(false);
        expect("get" in Repository).toBe(false);
        expect("create" in Repository).toBe(false);
        expect("list" in RepositoryType).toBe(false);
        expect("list" in Drop).toBe(false);
        expect("export" in Drop).toBe(false);
        expect("list" in Screenshot).toBe(false);
        expect("search" in SourceString).toBe(false);
        expect("me" in User).toBe(false);
        expect("isSessionActive" in User).toBe(false);
    });
});
