/*
 * box-adapter-connection.integration.test.ts
 *
 * Copyright © 2026, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

import path from "path";

import { BoxAIModelAdapter } from "../src/BoxAIModelAdapter";
import {
    integrationCredentialsPresent,
    loadBoxInit,
} from "./loadIntegrationCredentials";

const packageRoot = path.join(__dirname, "..");

const describeCred = integrationCredentialsPresent(packageRoot)
    ? describe
    : describe.skip;

describeCred("Box AIModelAdapter — connection (integration)", () => {
    test("loadBoxInit yields a configured adapter", () => {
        const init = loadBoxInit(packageRoot);
        const adapter = new BoxAIModelAdapter(init);
        expect(adapter.isConfigured()).toBe(true);
        expect(adapter.isConnected()).toBe(false);
    });

    test("connect() validates JWT with Box (users.getUserMe) and sets isConnected", async () => {
        const init = loadBoxInit(packageRoot);
        const adapter = new BoxAIModelAdapter(init);
        await adapter.connect();
        expect(adapter.isConnected()).toBe(true);
        await adapter.disconnect();
        expect(adapter.isConnected()).toBe(false);
    });

    test("connect() twice without disconnect is idempotent (still connected)", async () => {
        const init = loadBoxInit(packageRoot);
        const adapter = new BoxAIModelAdapter(init);
        await adapter.connect();
        await adapter.connect();
        expect(adapter.isConnected()).toBe(true);
        await adapter.disconnect();
    });
});
