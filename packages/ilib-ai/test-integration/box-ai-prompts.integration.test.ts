/*
 * box-ai-prompts.integration.test.ts
 *
 * Real Box AI calls using credentials from `test-integration/box-integration-credentials.json`.
 * Uses the official Box SDK (`createBoxClientFromInit` + `client.ai.createAiTextGen`) because
 * {@link BoxAIModelAdapter.complete} is not wired yet; once it is, these assertions can move
 * to adapter-only tests.
 *
 * Copyright © 2026, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

import path from "path";

import type { BoxClient } from "box-node-sdk";

import { createBoxClientFromInit } from "../src/boxClientFactory";
import type { BoxIntegrationCredentialsFile } from "./loadIntegrationCredentials";
import {
    integrationCredentialsPresent,
    loadBoxInit,
    loadIntegrationCredentialsFile,
} from "./loadIntegrationCredentials";

const packageRoot = path.join(__dirname, "..");

const describeCred = integrationCredentialsPresent(packageRoot)
    ? describe
    : describe.skip;

/** Default model name for Box AI text gen (see Box “Supported AI models”). */
const BOX_AI_MODEL = "azure__openai__gpt_4o_mini";

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

/**
 * Box AI text generation requires one file item. Use **`contextFileId`** or **`rootFolderId`**
 * in `box-integration-credentials.json` (see README).
 */
async function resolveContextFileId(
    client: BoxClient,
    creds: BoxIntegrationCredentialsFile
): Promise<string> {
    const directFile = creds.contextFileId?.trim();
    if (directFile) {
        return directFile;
    }
    const folderId = creds.rootFolderId?.trim();
    if (!folderId) {
        throw new Error(
            "Add contextFileId or rootFolderId to test-integration/box-integration-credentials.json (see README)"
        );
    }
    let items;
    try {
        items = await client.folders.getFolderItems(folderId, {
            queryParams: { limit: 1000 },
        });
    } catch (err: unknown) {
        const boxDetail =
            err &&
            typeof err === "object" &&
            "responseInfo" in err &&
            (err as { responseInfo?: { body?: { context_info?: unknown } } })
                .responseInfo?.body?.context_info != null
                ? JSON.stringify(
                      (
                          err as {
                              responseInfo: { body: { context_info: unknown } };
                          }
                      ).responseInfo.body.context_info
                  )
                : err instanceof Error
                  ? err.message
                  : String(err);
        throw new Error(
            `Box getFolderItems failed for rootFolderId="${folderId}". ` +
                `Confirm the folder exists and the JWT app user can access it, or set contextFileId to a file id. ${boxDetail}`
        );
    }
    const entries = items.entries ?? [];
    const file = entries.find((e: { type?: string }) => e.type === "file");
    if (!file || !("id" in file)) {
        throw new Error(
            `No file found under folder ${folderId}; upload a file or set contextFileId`
        );
    }
    return String((file as { id: string }).id);
}

describeCred("Box AI — real prompts (integration)", () => {
    let client: BoxClient;
    let contextFileId: string;

    beforeAll(async () => {
        const creds = loadIntegrationCredentialsFile(packageRoot);
        const init = loadBoxInit(packageRoot);
        client = await createBoxClientFromInit(init);
        contextFileId = await resolveContextFileId(client, creds);
    }, 120000);

    test("structured JSON echo (fixed schema and values)", async () => {
        const prompt = [
            "You must reply with ONLY valid JSON. No markdown, no code fences, no explanation.",
            'Schema: {"format": string, "echo": string, "sum": number}',
            'Required values: format must be exactly "ilib-ai-test-v1", echo must be exactly "ok", sum must be exactly 7.',
        ].join("\n");

        const res = await client.ai.createAiTextGen({
            prompt,
            items: [{ type: "file", id: contextFileId }],
            aiAgent: {
                type: "ai_agent_text_gen",
                basicGen: { model: BOX_AI_MODEL },
            },
        });

        expect(typeof res.answer).toBe("string");
        expect(res.answer.length).toBeGreaterThan(0);

        const parsed = parseJsonFromAnswer(res.answer) as {
            format?: string;
            echo?: string;
            sum?: number;
        };
        expect(parsed.format).toBe("ilib-ai-test-v1");
        expect(parsed.echo).toBe("ok");
        expect(parsed.sum).toBe(7);
    }, 120000);

    test("structured JSON with expected content (capital of France)", async () => {
        const prompt = [
            "Reply with ONLY valid JSON. No markdown or code fences.",
            'Shape: {"format":"ilib-ai-geo-v1","country":"France","capital":"<English name of the capital city>"}',
            "The country field must be exactly France. capital must be the common English name of France's capital.",
        ].join("\n");

        const res = await client.ai.createAiTextGen({
            prompt,
            items: [{ type: "file", id: contextFileId }],
            aiAgent: {
                type: "ai_agent_text_gen",
                basicGen: { model: BOX_AI_MODEL },
            },
        });

        const parsed = parseJsonFromAnswer(res.answer) as {
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
