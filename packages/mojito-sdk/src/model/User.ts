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
import type { ForwardCompatParams, Pageable } from "./types";

type UserDto = components["schemas"]["User"];
type UserProfileDto = components["schemas"]["UserProfile"];
type UserPageDto = components["schemas"]["PageUser"];

/** Mojito account role. */
export type UserRole = "ROLE_PM" | "ROLE_TRANSLATOR" | "ROLE_ADMIN" | "ROLE_USER";

/** Domain fields used to construct a user. */
export type UserProps = {
    id?: number;
    username?: string;
    givenName?: string;
    surname?: string;
    commonName?: string;
    role?: UserRole;
    enabled?: boolean;
    canTranslateAllLocales?: boolean;
};

/** Fields for creating an account. `password` is sent once and not stored on the result. */
export type UserCreateParams = ForwardCompatParams<{
    username: string;
    password?: string;
    givenName?: string;
    surname?: string;
    commonName?: string;
    enabled?: boolean;
    canTranslateAllLocales?: boolean;
}>;

/** Fields that may be changed on an account. */
export type UserUpdateParams = ForwardCompatParams<Partial<UserCreateParams>>;

/** Filters for listing accounts. */
export type UserListParams = ForwardCompatParams<{
    username?: string;
    pageable?: Pageable;
}>;

/**
 * A Mojito user.
 */
export class User {
    private readonly client: MojitoClient;
    private readonly props: UserProps;

    /**
     * @param client SDK session.
     * @param props Domain fields for this account.
     */
    constructor(client: MojitoClient, props: UserProps = {}) {
        this.client = client;
        this.props = { ...props };
    }

    get id(): number | undefined {
        return this.props.id;
    }

    get username(): string | undefined {
        return this.props.username;
    }

    get givenName(): string | undefined {
        return this.props.givenName;
    }

    get surname(): string | undefined {
        return this.props.surname;
    }

    get commonName(): string | undefined {
        return this.props.commonName;
    }

    get role(): UserRole | undefined {
        return this.props.role;
    }

    get enabled(): boolean | undefined {
        return this.props.enabled;
    }

    get canTranslateAllLocales(): boolean | undefined {
        return this.props.canTranslateAllLocales;
    }

    /**
     * Update this account.
     *
     * @param params Fields to change.
     */
    async update(params: UserUpdateParams): Promise<void> {
        if (this.id === undefined) {
            throw new Error("User.update requires a user id");
        }
        await this.client.call("updateUserByUserId", {
            userId: this.id,
            body: params,
        });
    }

    /** Delete this account. */
    async delete(): Promise<void> {
        if (this.id === undefined) {
            throw new Error("User.delete requires a user id");
        }
        await this.client.call("deleteUserByUserId", { userId: this.id });
    }
}

type UserWire = UserDto | UserProfileDto;

/** Map a user or profile payload onto {@link User}, dropping secrets such as password. */
export function userFromDto(client: MojitoClient, data: UserWire): User {
    const record = data as UserDto & UserProfileDto;
    return new User(client, {
        id: record.id,
        username: record.username,
        givenName: record.givenName,
        surname: record.surname,
        commonName: record.commonName,
        role: record.role,
        enabled: record.enabled,
        canTranslateAllLocales: record.canTranslateAllLocales,
    });
}

/** List accounts. Pageable defaults to the first page of 50. */
export async function listUsers(
    client: MojitoClient,
    params: UserListParams = {},
): Promise<User[]> {
    const { pageable, ...rest } = params;
    const page = await client.call<UserPageDto>("getUsers", {
        ...rest,
        pageable: pageable ?? { page: 0, size: 50 },
    });
    return (page?.content ?? []).map((item) => userFromDto(client, item));
}

/** Create an account. */
export async function insertUser(
    client: MojitoClient,
    params: UserCreateParams,
): Promise<User> {
    const result = await client.call<UserDto>("createUser", { body: params });
    return userFromDto(client, result ?? {});
}

/** Load the authenticated account profile. */
export async function loadCurrentUser(
    client: MojitoClient,
    extras: ForwardCompatParams = {},
): Promise<User> {
    const result = await client.call<UserProfileDto>("getCurrentUser", extras);
    return userFromDto(client, result ?? {});
}

/** Whether the current session is active. */
export async function loadSessionActive(
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
    return !!(result && result.active);
}
