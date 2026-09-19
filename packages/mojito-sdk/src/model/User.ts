/*
 * User.ts - high-level User helpers for Mojito
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
import type { MojitoClient } from "./MojitoClient";
import type { ForwardCompatParams } from "./types";

type UserProfileDto = components["schemas"]["UserProfile"];

/**
 * A Mojito user.
 */
export class User {
    readonly client: MojitoClient;
    private readonly dto: UserProfileDto;

    /**
     * @param client SDK session.
     * @param data User profile payload.
     */
    constructor(client: MojitoClient, data: UserProfileDto = {}) {
        this.client = client;
        this.dto = data;
    }

    get username(): string | undefined {
        return this.dto.username;
    }

    get givenName(): string | undefined {
        return this.dto.givenName;
    }

    get surname(): string | undefined {
        return this.dto.surname;
    }

    get commonName(): string | undefined {
        return this.dto.commonName;
    }

    get role(): UserProfileDto["role"] {
        return this.dto.role;
    }

    /**
     * Return the currently authenticated user profile.
     *
     * @param client SDK session.
     * @param extras Extra forwarded parameters.
     */
    static async me(
        client: MojitoClient,
        extras: ForwardCompatParams = {},
    ): Promise<User> {
        const result = await client.call<UserProfileDto>("getCurrentUser", extras);
        return new User(client, result ?? {});
    }

    /**
     * Check whether the current session is active.
     *
     * @param client SDK session.
     * @param extras Extra forwarded parameters.
     */
    static async isSessionActive(
        client: MojitoClient,
        extras: ForwardCompatParams = {},
    ): Promise<boolean> {
        const result = await client.call<boolean | { active?: boolean }>(
            "isSessionActive",
            extras,
        );
        if (typeof result === "boolean") {
            return result;
        }
        return !!(result && (result as { active?: boolean }).active);
    }
}
