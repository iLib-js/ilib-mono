/*
 * openaiCredentialsMapping.test.ts
 *
 * Static tests for {@link loadOpenAiIntegrationCredentials} (no live OpenAI API).
 *
 * Copyright © 2026, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

import type { OpenAiIntegrationCredentialsFile } from "./loadOpenAiIntegrationCredentials";
import {
    resolveOpenAiApiKey,
    stripOpenAiIntegrationOnlyFields,
} from "./loadOpenAiIntegrationCredentials";

describe("stripOpenAiIntegrationOnlyFields", () => {
    const originalEnv = process.env.OPENAI_API_KEY;

    afterEach(() => {
        if (originalEnv === undefined) {
            delete process.env.OPENAI_API_KEY;
        } else {
            process.env.OPENAI_API_KEY = originalEnv;
        }
    });

    test("maps apiKey and optional baseUrl to OpenAIModelInitOptions", () => {
        const raw: OpenAiIntegrationCredentialsFile = {
            apiKey: "sk-test",
            baseUrl: "https://api.openai.com",
            integrationTestModel: "gpt-4o-mini",
        };
        const init = stripOpenAiIntegrationOnlyFields(raw);
        expect(init.apiKey).toBe("sk-test");
        expect(init.baseUrl).toBe("https://api.openai.com");
        expect(
            (init as { integrationTestModel?: string }).integrationTestModel
        ).toBeUndefined();
    });

    test("resolveOpenAiApiKey falls back to OPENAI_API_KEY when file key is empty", () => {
        process.env.OPENAI_API_KEY = "sk-from-env";
        const raw: OpenAiIntegrationCredentialsFile = { apiKey: "" };
        expect(resolveOpenAiApiKey(raw)).toBe("sk-from-env");
        const init = stripOpenAiIntegrationOnlyFields(raw);
        expect(init.apiKey).toBe("sk-from-env");
    });

    test("file apiKey wins over OPENAI_API_KEY", () => {
        process.env.OPENAI_API_KEY = "sk-env";
        const raw: OpenAiIntegrationCredentialsFile = { apiKey: "sk-file" };
        expect(resolveOpenAiApiKey(raw)).toBe("sk-file");
    });
});
