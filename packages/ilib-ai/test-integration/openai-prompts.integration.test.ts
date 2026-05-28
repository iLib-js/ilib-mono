/*
 * openai-prompts.integration.test.ts
 *
 * Real OpenAI Chat Completions via {@link OpenAIModelAdapter.complete}.
 *
 * Copyright © 2026, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

import path from "path";
import fs from "fs";

import { OpenAIModelAdapter } from "../src/OpenAIModelAdapter";
import {
    loadOpenAiInit,
    loadOpenAiIntegrationTestModel,
    openAiIntegrationCredentialsPresent,
} from "./loadOpenAiIntegrationCredentials";

const packageRoot = path.join(__dirname, "..");

const describeCred = openAiIntegrationCredentialsPresent(packageRoot)
    ? describe
    : describe.skip;

/**
 * Strips optional ``` fences so JSON.parse works if the model wraps output.
 */
function parseJsonFromAnswer(raw: string): unknown {
    let s = raw.trim();
    const fence = /^```(?:json)?\s*([\s\S]*?)```$/im;
    const m = s.match(fence);
    if (m) {
        s = m[1].trim();
    }
    return JSON.parse(s);
}

const MINIMAL_PING_EXPECTED_PATH = path.join(
    __dirname,
    "fixtures/minimal-ping-expected.json"
);

describeCred("OpenAI — real prompts (integration)", () => {
    let adapter: OpenAIModelAdapter;
    let model: string;

    beforeAll(async () => {
        const init = loadOpenAiInit(packageRoot);
        model = loadOpenAiIntegrationTestModel(packageRoot);
        adapter = new OpenAIModelAdapter(init);
        await adapter.connect();
    }, 120000);

    afterAll(async () => {
        await adapter.disconnect();
    });

    test("minimal ping — fixed JSON message (deterministic)", async () => {
        const expected = JSON.parse(
            fs.readFileSync(MINIMAL_PING_EXPECTED_PATH, "utf8")
        ) as { format: string; message: string };

        const res = await adapter.complete({
            systemPrompt: [
                "You must reply with ONLY valid JSON. No markdown, no code fences, no explanation.",
                "Return exactly one JSON object with keys format (string) and message (string).",
                `Required values: format must be exactly ${JSON.stringify(expected.format)}, message must be exactly ${JSON.stringify(expected.message)}.`,
            ].join("\n"),
            userContent: "Ping.",
            model,
            parameters: { temperature: 0, maxTokens: 64 },
        });

        expect(res.error).toBeUndefined();
        expect(typeof res.rawContent).toBe("string");
        expect(res.rawContent.length).toBeGreaterThan(0);

        const parsed = parseJsonFromAnswer(res.rawContent) as {
            format?: string;
            message?: string;
        };
        expect(parsed).toEqual(expected);
    }, 120000);

    test("structured JSON echo (fixed schema and values)", async () => {
        const res = await adapter.complete({
            systemPrompt: [
                "You must reply with ONLY valid JSON. No markdown, no code fences, no explanation.",
                'Schema: {"format": string, "echo": string, "sum": number}',
                'Required values: format must be exactly "ilib-ai-test-v1", echo must be exactly "ok", sum must be exactly 7.',
            ].join("\n"),
            userContent: "Reply now.",
            model,
            parameters: { temperature: 0, maxTokens: 256 },
        });

        expect(res.error).toBeUndefined();
        expect(typeof res.rawContent).toBe("string");
        expect(res.rawContent.length).toBeGreaterThan(0);

        const parsed = parseJsonFromAnswer(res.rawContent) as {
            format?: string;
            echo?: string;
            sum?: number;
        };
        expect(parsed.format).toBe("ilib-ai-test-v1");
        expect(parsed.echo).toBe("ok");
        expect(parsed.sum).toBe(7);
    }, 120000);

    test("structured JSON with expected content (capital of France)", async () => {
        const res = await adapter.complete({
            systemPrompt: [
                "Reply with ONLY valid JSON. No markdown or code fences.",
                'Shape: {"format":"ilib-ai-geo-v1","country":"France","capital":"<English name of the capital city>"}',
                "The country field must be exactly France. capital must be the common English name of France's capital.",
            ].join("\n"),
            userContent: "Reply now.",
            model,
            parameters: { temperature: 0, maxTokens: 256 },
        });

        expect(res.error).toBeUndefined();

        const parsed = parseJsonFromAnswer(res.rawContent) as {
            format?: string;
            country?: string;
            capital?: string;
        };
        expect(parsed.format).toBe("ilib-ai-geo-v1");
        expect(parsed.country).toBe("France");
        expect(parsed.capital).toBeDefined();
        expect(String(parsed.capital).toLowerCase()).toContain("paris");
    }, 120000);
});
