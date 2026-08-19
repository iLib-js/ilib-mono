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

import type { LowLevelClient } from "../lowlevel/client";
import type { ForwardCompatParams, UserProfileData } from "./types";

/**
 * Helpers for Mojito user/session endpoints.
 */
export class User {
    /**
     * Return the currently authenticated user profile.
     *
     * @param client Low-level client.
     * @param extras Extra forwarded parameters.
     */
    static async me(
        client: LowLevelClient,
        extras: ForwardCompatParams = {},
    ): Promise<UserProfileData> {
        return (await client.call<UserProfileData>("getCurrentUser", extras)) ?? {};
    }

    /**
     * Check whether the current session is active.
     *
     * @param client Low-level client.
     * @param extras Extra forwarded parameters.
     */
    static async isSessionActive(
        client: LowLevelClient,
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
