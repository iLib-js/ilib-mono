/*
 * Server.ts - domain root for one Mojito instance
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
import {
    insertRepository,
    listRepositories,
    loadRepository,
    type Repository,
    type RepositoryCreateParams,
    type RepositoryListParams,
} from "./Repository";
import {
    insertRepositoryType,
    listRepositoryTypes,
    loadRepositoryType,
    type RepositoryType,
    type RepositoryTypeCreateParams,
    type RepositoryTypeListParams,
} from "./RepositoryType";
import { listScreenshots, type Screenshot, type ScreenshotListParams } from "./Screenshot";
import { searchSourceStrings, type SourceString, type SourceStringSearchParams } from "./SourceString";
import type { ForwardCompatParams } from "./types";
import {
    insertUser,
    listUsers,
    loadCurrentUser,
    loadSessionActive,
    type User,
    type UserCreateParams,
    type UserListParams,
} from "./User";

type DbMonitoringSnapshot = components["schemas"]["DbMonitoringSnapshot"];

/** One latency sample from a database monitoring run. */
export type LatencyMeasurement = {
    iteration?: number;
    latencyMs?: number;
};

/** Summary of one database latency series. */
export type LatencySeries = {
    measurements?: readonly LatencyMeasurement[];
    minLatencyMs?: number;
    maxLatencyMs?: number;
    averageLatencyMs?: number;
};

/** Result of probing Mojito's database latency. */
export type DatabaseLatency = {
    timestamp?: string;
    iterations?: number;
    raw?: LatencySeries;
    hibernateHealth?: LatencySeries;
    hibernateRepo?: LatencySeries;
};

/**
 * Domain root for one Mojito instance.
 *
 * Collections and whole-server actions live here. Session and transport stay
 * on {@link MojitoClient}. Obtain this object from `client.server`.
 */
export class Server {
    private readonly client: MojitoClient;

    /**
     * @param client SDK session this server belongs to.
     */
    constructor(client: MojitoClient) {
        this.client = client;
    }

    /** List repositories visible to the current session. */
    repositories(params: RepositoryListParams = {}): Promise<Repository[]> {
        return listRepositories(this.client, params);
    }

    /**
     * Find repositories by exact name.
     *
     * @param name Repository name.
     * @param extras Extra forwarded parameters.
     */
    findRepository(
        name: string,
        extras: Omit<RepositoryListParams, "name"> = {},
    ): Promise<Repository[]> {
        return listRepositories(this.client, { ...extras, name });
    }

    /**
     * Load a repository by id.
     *
     * @param repositoryId Repository id.
     * @param extras Extra forwarded parameters.
     */
    getRepository(repositoryId: number, extras: ForwardCompatParams = {}): Promise<Repository> {
        return loadRepository(this.client, repositoryId, extras);
    }

    /**
     * Create a repository.
     *
     * @param params Create payload.
     */
    createRepository(params: RepositoryCreateParams): Promise<Repository> {
        return insertRepository(this.client, params);
    }

    /** List repository types. */
    repositoryTypes(params: RepositoryTypeListParams = {}): Promise<RepositoryType[]> {
        return listRepositoryTypes(this.client, params);
    }

    /**
     * Find repository types by exact name.
     *
     * @param name Repository type name.
     * @param extras Extra forwarded parameters.
     */
    findRepositoryType(
        name: string,
        extras: Omit<RepositoryTypeListParams, "name"> = {},
    ): Promise<RepositoryType[]> {
        return listRepositoryTypes(this.client, { ...extras, name });
    }

    /** Load a repository type by id. */
    getRepositoryType(repositoryTypeId: number): Promise<RepositoryType> {
        return loadRepositoryType(this.client, repositoryTypeId);
    }

    /** Create a repository type. */
    createRepositoryType(params: RepositoryTypeCreateParams): Promise<RepositoryType> {
        return insertRepositoryType(this.client, params);
    }

    /** List user accounts. */
    users(params: UserListParams = {}): Promise<User[]> {
        return listUsers(this.client, params);
    }

    /**
     * Find accounts by username.
     *
     * @param username Account username.
     * @param extras Extra forwarded parameters, including pageable options.
     */
    findUser(
        username: string,
        extras: Omit<UserListParams, "username"> = {},
    ): Promise<User[]> {
        return listUsers(this.client, { ...extras, username });
    }

    /** Create a user account. The password is not retained on the returned object. */
    createUser(params: UserCreateParams): Promise<User> {
        return insertUser(this.client, params);
    }

    /**
     * Return the currently authenticated user profile.
     *
     * @param extras Extra forwarded parameters.
     */
    me(extras: ForwardCompatParams = {}): Promise<User> {
        return loadCurrentUser(this.client, extras);
    }

    /**
     * Check whether the current session is active.
     *
     * @param extras Extra forwarded parameters.
     */
    isSessionActive(extras: ForwardCompatParams = {}): Promise<boolean> {
        return loadSessionActive(this.client, extras);
    }

    /** Search screenshots across repositories. */
    screenshots(params: ScreenshotListParams = {}): Promise<Screenshot[]> {
        return listScreenshots(this.client, params);
    }

    /** Search source strings across repositories. */
    searchSourceStrings(params: SourceStringSearchParams = {}): Promise<SourceString[]> {
        return searchSourceStrings(this.client, params);
    }

    /**
     * Probe database latency for this Mojito instance.
     *
     * @param params Optional iteration count and extras forwarded to Mojito.
     */
    async databaseLatency(
        params: ForwardCompatParams<{ iterations?: number }> = {},
    ): Promise<DatabaseLatency> {
        const snapshot = await this.client.call<DbMonitoringSnapshot>("getDatabaseLatency", params);
        if (!snapshot) {
            return {};
        }
        return {
            timestamp: snapshot.timestamp,
            iterations: snapshot.iterations,
            raw: latencySeries(snapshot.raw),
            hibernateHealth: latencySeries(snapshot.hibernateHealth),
            hibernateRepo: latencySeries(snapshot.hibernateRepo),
        };
    }
}

function latencySeries(
    series: components["schemas"]["LatencySeries"] | undefined,
): LatencySeries | undefined {
    if (!series) {
        return undefined;
    }
    return {
        measurements: series.measurements?.map((item) => ({
            iteration: item.iteration,
            latencyMs: item.latencyMs,
        })),
        minLatencyMs: series.minLatencyMs,
        maxLatencyMs: series.maxLatencyMs,
        averageLatencyMs: series.averageLatencyMs,
    };
}
