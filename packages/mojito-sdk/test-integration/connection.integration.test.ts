/*
 * connection.integration.test.ts - live Mojito connection smoke tests
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

import path from "node:path";

import { MojitoClient } from "../src/model/MojitoClient";
import { SourceString } from "../src/model/SourceString";
import {
    loadMojitoClientOptions,
    loadMojitoIntegrationTestOptions,
    mojitoIntegrationCredentialsPresent,
} from "./loadMojitoIntegrationCredentials";

const packageRoot = path.join(__dirname, "..");

const describeCred = mojitoIntegrationCredentialsPresent(packageRoot)
    ? describe
    : describe.skip;

describeCred("Mojito SDK — connection (integration)", () => {
    test("lists repositories from the live server", async () => {
        const client = new MojitoClient(loadMojitoClientOptions(packageRoot));
        const repos = await client.server.repositories();

        expect(Array.isArray(repos)).toBe(true);
        expect(repos.length).toBeGreaterThan(0);
        expect(typeof repos[0].id).toBe("number");
        expect(typeof repos[0].name).toBe("string");
        expect(repos[0].name?.length).toBeGreaterThan(0);
    });

    test("searches source strings in one repository", async () => {
        const client = new MojitoClient(loadMojitoClientOptions(packageRoot));
        const testOptions = loadMojitoIntegrationTestOptions(packageRoot);
        const repos = await client.server.repositories(
            testOptions.repositoryName ? { name: testOptions.repositoryName } : {},
        );

        expect(repos.length).toBeGreaterThan(0);
        const repo = repos[0];
        expect(repo.id).toBeDefined();
        expect(repo.name).toBeTruthy();

        const strings = await client.server.searchSourceStrings({
            repositoryIds: repo.id === undefined ? undefined : [repo.id],
            repositoryNames: repo.name ? [repo.name] : undefined,
            source: testOptions.searchSource,
            searchType: testOptions.searchSource ? "CONTAINS" : undefined,
            limit: testOptions.searchLimit,
        });

        expect(Array.isArray(strings)).toBe(true);
        // An empty result still proves auth + the search endpoint worked.
        for (const unit of strings) {
            expect(unit).toBeInstanceOf(SourceString);
        }
        if (strings.length > 0) {
            expect(
                strings[0].id !== undefined ||
                    strings[0].content !== undefined ||
                    strings[0].name !== undefined,
            ).toBe(true);
        }
    });
});
