/*
 * mojito-config.test.ts - unit tests for Mojito connection config interpretation
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

import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DEFAULT_CLI_PROFILES, MojitoConfig } from "../../src/auth/mojito-config";
import { Properties } from "../../src/auth/properties";

describe("MojitoConfig", () => {
    test("interprets CLI property keys, including header maps", () => {
        const config = MojitoConfig.fromProperties(Properties.parse(`
l10n.resttemplate.scheme=https
l10n.resttemplate.host=mojito.example
l10n.resttemplate.port=443
l10n.resttemplate.authentication-mode=HEADER
l10n.resttemplate.authentication.username=alice
l10n.resttemplate.authentication.password=secret
l10n.resttemplate.header.headers.CF-Access-Client-Id=id
l10n.resttemplate.header.headers.CF-Access-Client-Secret=secret2
`));

        expect(config.scheme).toBe("https");
        expect(config.host).toBe("mojito.example");
        expect(config.port).toBe(443);
        expect(config.authenticationMode).toBe("HEADER");
        expect(config.username).toBe("alice");
        expect(config.password).toBe("secret");
        expect(config.headers).toEqual({
            "CF-Access-Client-Id": "id",
            "CF-Access-Client-Secret": "secret2",
        });
        expect(config.baseUrl()).toBe("https://mojito.example");
    });

    test("applies defaults when CLI files are not loaded", () => {
        const config = MojitoConfig.resolve({}, { loadCliConfig: false });
        expect(config.scheme).toBe("http");
        expect(config.host).toBe("localhost");
        expect(config.port).toBe(8080);
        expect(config.authenticationMode).toBe("STATEFUL");
        expect(config.credentialProvider).toBe("CONFIG");
        expect(config.contextPath).toBe("");
        expect(config.loginFormPath).toBe("login");
        expect(config.loginPostPath).toBe("login");
        expect(config.csrfTokenPath).toBe("api/csrf-token");
        expect(config.headers).toEqual({});
        expect(config.baseUrl()).toBe("http://localhost:8080");
    });

    test("explicit overrides win over properties, except headers which merge", () => {
        const props = Properties.from({
            "l10n.resttemplate.host": "from-file",
            "l10n.resttemplate.port": "8080",
            "l10n.resttemplate.header.headers.CF-Access-Client-Id": "file-id",
            "l10n.resttemplate.header.headers.X-Keep": "keep",
        });
        const config = MojitoConfig.fromProperties(props, {
            host: "from-override",
            port: undefined,
            headers: { "CF-Access-Client-Id": "override-id" },
        });

        expect(config.host).toBe("from-override");
        expect(config.port).toBe(8080);
        expect(config.headers).toEqual({
            "CF-Access-Client-Id": "override-id",
            "X-Keep": "keep",
        });
    });

    test("normalizes the context path and login paths", () => {
        const config = new MojitoConfig({
            scheme: "https",
            host: "mojito.example",
            port: 443,
            contextPath: "mojito/",
            loginFormPath: "/login",
            csrfTokenPath: "/api/csrf-token",
        });

        expect(config.contextPath).toBe("/mojito");
        expect(config.loginFormPath).toBe("login");
        expect(config.csrfTokenPath).toBe("api/csrf-token");
        expect(config.baseUrl()).toBe("https://mojito.example/mojito");
    });

    test("treats a missing CLI directory as empty and still applies defaults", () => {
        const config = MojitoConfig.resolve(
            {},
            { configDir: join(tmpdir(), "mojito-config-missing-dir"), loadCliConfig: true },
        );
        expect(config.host).toBe("localhost");
        expect(config.port).toBe(8080);
        expect(config.baseUrl()).toBe("http://localhost:8080");
    });

    test("resolveCliConfigFiles uses Spring profile layering, not every file in the directory", () => {
        const dir = "/tmp/mojito-cli-config";
        const files = MojitoConfig.resolveCliConfigFiles({
            configDir: dir,
            profiles: ["cli", "formlogincredentialprovider"],
        });

        expect(files).toEqual([
            join(dir, "application.properties"),
            join(dir, "application-cli.properties"),
            join(dir, "application-formlogincredentialprovider.properties"),
        ]);
        expect(DEFAULT_CLI_PROFILES).toEqual(["cli", "formlogincredentialprovider"]);
    });

    test("layers only the selected profile files; later profiles win", () => {
        const dir = mkdtempSync(join(tmpdir(), "mojito-config-"));
        try {
            writeFileSync(
                join(dir, "application.properties"),
                "l10n.resttemplate.host=from-base\nl10n.resttemplate.port=8080\n",
            );
            writeFileSync(
                join(dir, "application-cli.properties"),
                "l10n.resttemplate.host=from-cli\n",
            );
            writeFileSync(
                join(dir, "application-dev.properties"),
                "l10n.resttemplate.host=from-dev\nl10n.resttemplate.scheme=https\n",
            );
            writeFileSync(
                join(dir, "application-test.properties"),
                "l10n.resttemplate.host=from-test\n",
            );

            const config = MojitoConfig.resolve({}, {
                configDir: dir,
                profiles: ["cli"],
            });
            expect(config.host).toBe("from-cli");
            expect(config.port).toBe(8080);
            expect(config.scheme).toBe("http");
            expect(config.baseUrl()).toBe("http://from-cli:8080");
        } finally {
            rmSync(dir, { recursive: true, force: true });
        }
    });

    test("explicit configFiles layer in the given order and skip missing files", () => {
        const dir = mkdtempSync(join(tmpdir(), "mojito-config-files-"));
        try {
            const base = join(dir, "application.properties");
            const cli = join(dir, "application-cli.properties");
            const missing = join(dir, "application-missing.properties");
            writeFileSync(base, "l10n.resttemplate.host=from-base\nl10n.resttemplate.port=8080\n");
            writeFileSync(cli, "l10n.resttemplate.host=from-cli\nl10n.resttemplate.scheme=https\n");

            const config = MojitoConfig.resolve({}, {
                configFiles: [base, missing, cli],
            });
            expect(config.host).toBe("from-cli");
            expect(config.port).toBe(8080);
            expect(config.scheme).toBe("https");
            expect(config.baseUrl()).toBe("https://from-cli:8080");
        } finally {
            rmSync(dir, { recursive: true, force: true });
        }
    });

    test("relative configFiles resolve against configDir", () => {
        const dir = mkdtempSync(join(tmpdir(), "mojito-config-rel-"));
        try {
            writeFileSync(
                join(dir, "application.properties"),
                "l10n.resttemplate.host=from-base\n",
            );
            writeFileSync(
                join(dir, "application-cli.properties"),
                "l10n.resttemplate.host=from-cli\n",
            );

            const config = MojitoConfig.resolve({}, {
                configDir: dir,
                configFiles: ["application.properties", "application-cli.properties"],
            });
            expect(config.host).toBe("from-cli");
        } finally {
            rmSync(dir, { recursive: true, force: true });
        }
    });

    test("defaultCliConfigDir points at ~/.l10n/config/cli", () => {
        expect(MojitoConfig.defaultCliConfigDir().replace(/\\/g, "/")).toMatch(
            /\/\.l10n\/config\/cli$/,
        );
    });
});
