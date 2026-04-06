/*
 * integrationCredentialsMapping.test.ts
 *
 * Copyright © 2026, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

import path from "path";

import type { BoxIntegrationCredentialsFile } from "../test-integration/loadIntegrationCredentials";
import {
    normalizeIntegrationCredentialPaths,
    stripIntegrationOnlyFields,
} from "../test-integration/loadIntegrationCredentials";

describe("stripIntegrationOnlyFields (Box Developer Console JSON)", () => {
    test("maps top-level boxAppSettings + enterpriseID to boxDeveloperJwtConfig", () => {
        const raw: BoxIntegrationCredentialsFile = {
            boxAppSettings: {
                clientID: "cid",
                clientSecret: "sec",
                appAuth: {
                    publicKeyID: "kid",
                    privateKey: "-----BEGIN KEY-----\nx\n-----END KEY-----\n",
                    passphrase: "pw",
                },
            },
            enterpriseID: "999",
            contextFileId: "f1",
            rootFolderId: "r1",
        };
        const init = stripIntegrationOnlyFields(raw);
        expect(init.boxDeveloperJwtConfig?.boxAppSettings.clientID).toBe("cid");
        expect(init.boxDeveloperJwtConfig?.enterpriseID).toBe("999");
        expect((init as { contextFileId?: string }).contextFileId).toBeUndefined();
    });

    test("preserves optional userId override for app-user JWT (alongside console export)", () => {
        const raw: BoxIntegrationCredentialsFile = {
            boxAppSettings: {
                clientID: "c",
                clientSecret: "s",
                appAuth: {
                    publicKeyID: "k",
                    privateKey: "pk",
                    passphrase: "p",
                },
            },
            enterpriseID: "9999999",
            userId: "123456789",
        };
        const init = stripIntegrationOnlyFields(raw);
        expect(init.userId).toBe("123456789");
        expect(init.boxDeveloperJwtConfig?.enterpriseID).toBe("9999999");
    });

    test("passes through legacy flat clientId-style init unchanged (minus integration keys)", () => {
        const raw: BoxIntegrationCredentialsFile = {
            clientId: "x",
            clientSecret: "y",
            publicKeyId: "z",
            privateKeyPath: "/abs/key.pvk",
            userId: "1",
            contextFileId: "",
        };
        const init = stripIntegrationOnlyFields(raw);
        expect(init.clientId).toBe("x");
        expect(init.boxDeveloperJwtConfig).toBeUndefined();
    });

    test("overlay: jwtConfigPath resolves to configPath-only init (two-file layout)", () => {
        const raw: BoxIntegrationCredentialsFile = {
            configPath: "/abs/9999999_xxxxxxx_config.json",
            userId: "123456789",
            contextFileId: "f1",
        };
        const init = stripIntegrationOnlyFields(raw);
        expect(init.configPath).toBe("/abs/9999999_xxxxxxx_config.json");
        expect(init.userId).toBe("123456789");
        expect(init.boxDeveloperJwtConfig).toBeUndefined();
    });
});

describe("normalizeIntegrationCredentialPaths", () => {
    test("merges jwtConfigPath into configPath and resolves relative to baseDir", () => {
        const baseDir = "/proj/packages/ilib-ai/test-integration";
        const parsed: BoxIntegrationCredentialsFile = {
            jwtConfigPath: "9999999_xxxxxxx_config.json",
        };
        normalizeIntegrationCredentialPaths(parsed, baseDir);
        expect(parsed.configPath).toBe(
            path.join(baseDir, "9999999_xxxxxxx_config.json")
        );
        expect(
            (parsed as { jwtConfigPath?: string }).jwtConfigPath
        ).toBeUndefined();
    });
});
