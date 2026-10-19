/*
 * mojitoCredentialsMapping.test.ts - static tests for integration credential loading
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

import { existsSync } from "node:fs";
import { MojitoConfig } from "../src/auth/mojito-config";
import {
    hasCliPropertyFiles,
    hasInlineMojitoAuth,
    resolveMojitoPassword,
    resolveMojitoUsername,
    stripMojitoIntegrationOnlyFields,
} from "./loadMojitoIntegrationCredentials";

describe("mojito integration credentials mapping", () => {
    const originalUsername = process.env.MOJITO_USERNAME;
    const originalPassword = process.env.MOJITO_PASSWORD;

    afterEach(() => {
        if (originalUsername === undefined) {
            delete process.env.MOJITO_USERNAME;
        } else {
            process.env.MOJITO_USERNAME = originalUsername;
        }
        if (originalPassword === undefined) {
            delete process.env.MOJITO_PASSWORD;
        } else {
            process.env.MOJITO_PASSWORD = originalPassword;
        }
    });

    test("stripMojitoIntegrationOnlyFields keeps connection fields and defaults loadCliConfig to false", () => {
        const { clientOptions, testOptions } = stripMojitoIntegrationOnlyFields({
            host: "mojito.example",
            port: 443,
            scheme: "https",
            username: "alice",
            password: "secret",
            repositoryName: "demo",
            searchSource: "Hello",
            searchLimit: 3,
        });

        expect(clientOptions).toEqual({
            loadCliConfig: false,
            host: "mojito.example",
            port: 443,
            scheme: "https",
            username: "alice",
            password: "secret",
        });
        expect(testOptions).toEqual({
            repositoryName: "demo",
            searchSource: "Hello",
            searchLimit: 3,
        });
    });

    test("file credentials win over environment variables", () => {
        process.env.MOJITO_USERNAME = "from-env";
        process.env.MOJITO_PASSWORD = "env-secret";
        expect(resolveMojitoUsername({ username: "from-file" })).toBe("from-file");
        expect(resolveMojitoPassword({ password: "file-secret" })).toBe("file-secret");
    });

    test("environment variables fill blank username/password", () => {
        process.env.MOJITO_USERNAME = "from-env";
        process.env.MOJITO_PASSWORD = "env-secret";
        expect(resolveMojitoUsername({ username: "  " })).toBe("from-env");
        expect(resolveMojitoPassword({})).toBe("env-secret");
    });

    test("hasInlineMojitoAuth accepts STATEFUL user/pass or HEADER maps", () => {
        expect(hasInlineMojitoAuth({
            username: "alice",
            password: "secret",
        })).toBe(true);
        expect(hasInlineMojitoAuth({
            authenticationMode: "HEADER",
            headers: { "CF-Access-Client-Id": "id" },
        })).toBe(true);
        expect(hasInlineMojitoAuth({
            authenticationMode: "HEADER",
        })).toBe(false);
        expect(hasInlineMojitoAuth({
            username: "alice",
        })).toBe(false);
        expect(hasInlineMojitoAuth({
            loadCliConfig: true,
        })).toBe(false);
    });

    test("searchLimit falls back to 5 when missing or non-positive", () => {
        expect(stripMojitoIntegrationOnlyFields({}).testOptions.searchLimit).toBe(5);
        expect(stripMojitoIntegrationOnlyFields({ searchLimit: 0 }).testOptions.searchLimit).toBe(5);
        expect(stripMojitoIntegrationOnlyFields({ searchLimit: -1 }).testOptions.searchLimit).toBe(5);
    });

    test("hasCliPropertyFiles requires loadCliConfig and at least one resolved file", () => {
        expect(hasCliPropertyFiles({
            loadCliConfig: true,
            configDir: "/tmp/mojito-config-does-not-exist",
            profiles: ["cli"],
        })).toBe(false);

        const defaultDir = MojitoConfig.defaultCliConfigDir();
        const defaultFiles = MojitoConfig.resolveCliConfigFiles({
            configDir: defaultDir,
            profiles: ["cli", "formlogincredentialprovider"],
        });
        expect(hasCliPropertyFiles({
            loadCliConfig: true,
            configDir: defaultDir,
            profiles: ["cli", "formlogincredentialprovider"],
        })).toBe(defaultFiles.some((file) => existsSync(file)));

        expect(hasCliPropertyFiles({
            loadCliConfig: false,
            configDir: defaultDir,
        })).toBe(false);
    });

    test("stripMojitoIntegrationOnlyFields keeps configFiles and profiles", () => {
        const { clientOptions } = stripMojitoIntegrationOnlyFields({
            loadCliConfig: true,
            configDir: "~/.l10n/config/cli",
            profiles: ["cli", "formlogincredentialprovider"],
            configFiles: [
                "~/.l10n/config/cli/application.properties",
                "~/.l10n/config/cli/application-cli.properties",
            ],
            repositoryName: "demo",
        });

        expect(clientOptions.loadCliConfig).toBe(true);
        expect(clientOptions.configDir).toBe("~/.l10n/config/cli");
        expect(clientOptions.profiles).toEqual(["cli", "formlogincredentialprovider"]);
        expect(clientOptions.configFiles).toEqual([
            "~/.l10n/config/cli/application.properties",
            "~/.l10n/config/cli/application-cli.properties",
        ]);
    });
});
