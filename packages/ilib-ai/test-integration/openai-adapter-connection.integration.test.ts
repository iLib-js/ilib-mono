/*
 * openai-adapter-connection.integration.test.ts
 *
 * Copyright © 2026, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

import path from "path";

import { OpenAIModelAdapter } from "../src/OpenAIModelAdapter";
import {
    loadOpenAiInit,
    openAiIntegrationCredentialsPresent,
} from "./loadOpenAiIntegrationCredentials";

const packageRoot = path.join(__dirname, "..");

const describeCred = openAiIntegrationCredentialsPresent(packageRoot)
    ? describe
    : describe.skip;

describeCred("OpenAI AIModelAdapter — connection (integration)", () => {
    test("loadOpenAiInit yields a configured adapter", () => {
        const init = loadOpenAiInit(packageRoot);
        const adapter = new OpenAIModelAdapter(init);
        expect(adapter.isConfigured()).toBe(true);
        expect(adapter.isConnected()).toBe(false);
    });

    test("connect() validates API key with OpenAI (GET /v1/models) and sets isConnected", async () => {
        const init = loadOpenAiInit(packageRoot);
        const adapter = new OpenAIModelAdapter(init);
        await adapter.connect();
        expect(adapter.isConnected()).toBe(true);
        await adapter.disconnect();
        expect(adapter.isConnected()).toBe(false);
    });

    test("connect() twice without disconnect is idempotent (still connected)", async () => {
        const init = loadOpenAiInit(packageRoot);
        const adapter = new OpenAIModelAdapter(init);
        await adapter.connect();
        await adapter.connect();
        expect(adapter.isConnected()).toBe(true);
        await adapter.disconnect();
    });

    test("listAvailableModels() returns at least one model after connect()", async () => {
        const init = loadOpenAiInit(packageRoot);
        const adapter = new OpenAIModelAdapter(init);
        await adapter.connect();
        const models = await adapter.listAvailableModels();
        expect(Array.isArray(models)).toBe(true);
        expect(models.length).toBeGreaterThan(0);
        expect(typeof models[0].id).toBe("string");
        await adapter.disconnect();
    });
});
