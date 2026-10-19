/*
 * User.test.ts - unit tests for the User helpers
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

import { User } from "../../src/model/User";
import { createJsonFetch, createTestClient } from "./testClient";

describe("User", () => {
    test("me returns the current user profile", async () => {
        const { fetchImpl, getLastRequest } = createJsonFetch(() => ({
            username: "alice",
            givenName: "Alice",
        }));
        const client = createTestClient(fetchImpl);

        const me = await client.server.me({ detailed: true });
        expect(me.username).toBe("alice");
        expect(me.givenName).toBe("Alice");

        const url = new URL(getLastRequest().url);
        expect(url.pathname).toBe("/api/users/me");
        expect(url.searchParams.get("detailed")).toBe("true");
    });

    test("isSessionActive accepts a boolean payload", async () => {
        const { fetchImpl } = createJsonFetch(() => true);
        const client = createTestClient(fetchImpl);
        await expect(client.server.isSessionActive()).resolves.toBe(true);
    });

    test("isSessionActive accepts an object payload with active", async () => {
        const { fetchImpl } = createJsonFetch(() => ({ active: false }));
        const client = createTestClient(fetchImpl);
        await expect(client.server.isSessionActive()).resolves.toBe(false);
    });

    test("update and delete use the user id", async () => {
        const calls: Array<{ url: string; method?: string; body?: string }> = [];
        const fetchImpl: typeof fetch = async (input, init) => {
            calls.push({
                url: String(input),
                method: init?.method,
                body: init?.body === undefined ? undefined : String(init.body),
            });
            return new Response("", { status: 200 });
        };
        const user = new User(createTestClient(fetchImpl), { id: 8, username: "alice" });

        await user.update({ givenName: "Alicia" });
        await user.delete();

        expect(calls[0].method).toBe("PATCH");
        expect(calls[0].url).toContain("/api/users/8");
        expect(JSON.parse(calls[0].body ?? "")).toEqual({ givenName: "Alicia" });
        expect(calls[1].method).toBe("DELETE");
        expect(calls[1].url).toContain("/api/users/8");
    });

    test("update and delete require a user id", async () => {
        const user = new User(
            createTestClient(async () => new Response("", { status: 200 })),
            { username: "alice" },
        );
        await expect(user.update({ givenName: "A" })).rejects.toThrow(/requires a user id/);
        await expect(user.delete()).rejects.toThrow(/requires a user id/);
    });
});
