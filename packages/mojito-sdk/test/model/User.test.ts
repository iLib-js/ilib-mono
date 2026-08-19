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

        const me = await User.me(client, { detailed: true });
        expect(me.username).toBe("alice");
        expect(me.givenName).toBe("Alice");

        const url = new URL(getLastRequest().url);
        expect(url.pathname).toBe("/api/users/me");
        expect(url.searchParams.get("detailed")).toBe("true");
    });

    test("isSessionActive accepts a boolean payload", async () => {
        const { fetchImpl } = createJsonFetch(() => true);
        const client = createTestClient(fetchImpl);
        await expect(User.isSessionActive(client)).resolves.toBe(true);
    });

    test("isSessionActive accepts an object payload with active", async () => {
        const { fetchImpl } = createJsonFetch(() => ({ active: false }));
        const client = createTestClient(fetchImpl);
        await expect(User.isSessionActive(client)).resolves.toBe(false);
    });
});
