/*
 * cli.e2e.test.ts — E2E tests for samples/cli
 *
 * Copyright © 2026, JEDLSoft
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
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as fs from "fs";
import * as path from "path";
import { spawn, type ChildProcessWithoutNullStreams } from "child_process";

const packageRoot = path.join(__dirname, "..");
const cliSampleDir = path.join(packageRoot, "samples/cli");
const cliE2eCwd = path.join(__dirname, "__testfiles__/cli");
const e2eCredentialsPath = path.join(cliE2eCwd, "credentials.json");
const tsxBin = path.join(cliSampleDir, "node_modules/.bin/tsx");
const cliEntry = path.join(cliSampleDir, "index.ts");
const minimalPingExpectedPath = path.join(
    packageRoot,
    "test-integration/fixtures/minimal-ping-expected.json"
);

const CONNECT_TIMEOUT_MS = 30000;
const RESPONSE_TIMEOUT_MS = 60000;
const EXIT_TIMEOUT_MS = 10000;

type ResolvedCredentials = {
    absolutePath: string;
    cliCwd: string;
    cliArg: string;
    llmModel: string;
};

type CliExecutionResult = {
    stdout: string;
    stderr: string;
    code: number | null;
    responseFromIndex: number;
};

type E2eCredentialsFile = {
    apiKey?: string;
    defaultModel?: string;
    integrationTestModel?: string;
};

function readE2eCredentialsFile(filePath: string): E2eCredentialsFile | null {
    if (!fs.existsSync(filePath)) {
        return null;
    }
    try {
        return JSON.parse(fs.readFileSync(filePath, "utf8")) as E2eCredentialsFile;
    } catch {
        return null;
    }
}

function resolveApiKey(parsed: E2eCredentialsFile | null): string | undefined {
    const fromFile = parsed?.apiKey?.trim();
    if (fromFile) {
        return fromFile;
    }
    return process.env.OPENAI_API_KEY?.trim();
}

function ensureE2eCredentialsFile(
    apiKey: string,
    parsed: E2eCredentialsFile | null
): void {
    if (parsed?.apiKey?.trim()) {
        return;
    }
    fs.mkdirSync(cliE2eCwd, { recursive: true });
    const defaultModel = parsed?.defaultModel?.trim() || "gpt-4o-mini";
    const integrationTestModel =
        parsed?.integrationTestModel?.trim() || defaultModel;
    const body: E2eCredentialsFile = {
        apiKey,
        defaultModel,
        integrationTestModel,
    };
    fs.writeFileSync(e2eCredentialsPath, `${JSON.stringify(body, null, 4)}\n`);
}

function e2eCredentialsPresent(): boolean {
    const parsed = readE2eCredentialsFile(e2eCredentialsPath);
    return !!resolveApiKey(parsed);
}

function resolveCredentialsForE2e(): ResolvedCredentials | null {
    const parsed = readE2eCredentialsFile(e2eCredentialsPath);
    const apiKey = resolveApiKey(parsed);
    if (!apiKey) {
        return null;
    }

    ensureE2eCredentialsFile(apiKey, parsed);

    const onDisk = readE2eCredentialsFile(e2eCredentialsPath);
    const llmModel =
        onDisk?.integrationTestModel?.trim() ||
        onDisk?.defaultModel?.trim() ||
        "gpt-4o-mini";

    return {
        absolutePath: e2eCredentialsPath,
        cliCwd: cliE2eCwd,
        cliArg: "credentials.json",
        llmModel,
    };
}

function assertCliPrerequisites(): void {
    if (!fs.existsSync(tsxBin)) {
        throw new Error(
            `tsx not found at ${tsxBin}. Run pnpm install in packages/ilib-ai/samples/cli`
        );
    }
    if (!fs.existsSync(path.join(packageRoot, "lib/index.js"))) {
        throw new Error(
            "ilib-ai is not built. Run pnpm build in packages/ilib-ai first"
        );
    }
}

function parseJsonFromAnswer(raw: string): unknown {
    let s = raw.trim();
    const fence = /^```(?:json)?\s*([\s\S]*?)```$/im;
    const m = s.match(fence);
    if (m) {
        s = m[1].trim();
    }
    return JSON.parse(s);
}

function assistantOutputChunk(
    stdout: string,
    fromIndex: number,
    prompt: string
): string {
    const chunk = stdout.slice(fromIndex);
    const promptPos = chunk.indexOf(prompt);
    if (promptPos !== -1) {
        const tail = chunk.slice(promptPos + prompt.length);
        const nextPrompt = tail.search(/\r?\n> /);
        return nextPrompt === -1 ? tail : tail.slice(0, nextPrompt);
    }
    const nextPrompt = chunk.search(/\r?\n> /);
    if (nextPrompt !== -1) {
        return chunk.slice(0, nextPrompt);
    }
    return chunk.replace(/\r?\n> \s*(\r)?$/, "");
}

function extractResponseText(stdout: string, fromIndex: number, prompt: string): string {
    return assistantOutputChunk(stdout, fromIndex, prompt).trim();
}

function hasCompleteJsonObject(text: string): boolean {
    const start = text.indexOf("{");
    if (start === -1) {
        return false;
    }
    let depth = 0;
    for (let i = start; i < text.length; i++) {
        if (text[i] === "{") {
            depth++;
        } else if (text[i] === "}") {
            depth--;
            if (depth === 0) {
                return true;
            }
        }
    }
    return false;
}

function isCliInputPromptReady(stdout: string): boolean {
    if (!stdout.includes("Connected.")) {
        return false;
    }
    const trimmed = stdout.trimEnd();
    return />\s*$/.test(trimmed) || />\s*\r$/.test(trimmed);
}

function isAiResponseComplete(
    stdout: string,
    fromIndex: number,
    prompt: string
): boolean {
    const chunk = stdout.slice(fromIndex);
    const promptPos = chunk.indexOf(prompt);

    let assistantPart = "";
    let hasReprompt = false;

    if (promptPos !== -1) {
        const afterPrompt = chunk.slice(promptPos + prompt.length);
        const repromptIdx = afterPrompt.search(/\r?\n> /);
        if (repromptIdx !== -1) {
            assistantPart = afterPrompt.slice(0, repromptIdx).trim();
            hasReprompt = true;
        } else {
            assistantPart = afterPrompt.trim();
            hasReprompt = /\r?\n> \s*(\r)?$/.test(chunk);
        }
    } else {
        const repromptIdx = chunk.search(/\r?\n> /);
        if (repromptIdx !== -1) {
            assistantPart = chunk.slice(0, repromptIdx).trim();
            hasReprompt = true;
        } else if (/\r?\n> \s*(\r)?$/.test(chunk)) {
            assistantPart = chunk.replace(/\r?\n> \s*(\r)?$/, "").trim();
            hasReprompt = true;
        } else {
            assistantPart = chunk.trim();
        }
    }

    if (!assistantPart) {
        return false;
    }

    if (hasReprompt) {
        return true;
    }

    return hasCompleteJsonObject(assistantPart);
}

function parseJsonFromStdout(
    stdout: string,
    fromIndex: number,
    prompt: string
): unknown {
    const body = extractResponseText(stdout, fromIndex, prompt);
    const start = body.indexOf("{");
    if (start === -1) {
        throw new Error(`No JSON object in CLI response:\n${body}`);
    }
    let depth = 0;
    let end = -1;
    for (let i = start; i < body.length; i++) {
        if (body[i] === "{") {
            depth++;
        } else if (body[i] === "}") {
            depth--;
            if (depth === 0) {
                end = i;
                break;
            }
        }
    }
    if (end === -1) {
        throw new Error(`Unbalanced JSON in CLI response:\n${body}`);
    }
    return parseJsonFromAnswer(body.slice(start, end + 1));
}

async function waitFor(
    predicate: () => boolean,
    timeoutMs: number,
    label: string,
    context?: () => string
): Promise<void> {
    const start = Date.now();
    while (!predicate()) {
        if (Date.now() - start > timeoutMs) {
            const detail = context?.() ?? "";
            throw new Error(
                `Timed out waiting for ${label} after ${timeoutMs}ms${detail}`
            );
        }
        await new Promise((r) => setTimeout(r, 50));
    }
}

function killChild(child: ChildProcessWithoutNullStreams): void {
    try {
        child.kill("SIGTERM");
    } catch {
        /* already dead */
    }
    setTimeout(() => {
        try {
            if (!child.killed) {
                child.kill("SIGKILL");
            }
        } catch {
            /* already dead */
        }
    }, 1000);
}

/**
 * Spawns a fresh CLI process, sends one AI prompt on stdin, waits for the
 * response on stdout, sends `.exit`, and waits for the process to exit.
 */
async function runCliExecution(
    credentials: ResolvedCredentials,
    aiPrompt: string
): Promise<CliExecutionResult> {
    assertCliPrerequisites();

    const args = [
        cliEntry,
        "--",
        "--credentials",
        credentials.cliArg,
        "--model",
        credentials.llmModel,
    ];

    const child = spawn(tsxBin, args, {
        cwd: credentials.cliCwd,
        env: process.env,
        stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk: Buffer) => {
        stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk: Buffer) => {
        stderr += chunk.toString();
    });

    try {
        await waitFor(
            () =>
                isCliInputPromptReady(stdout) || stderr.includes("Error:"),
            CONNECT_TIMEOUT_MS,
            "CLI input prompt",
            () =>
                `\nstdout tail:\n${stdout.slice(-800)}\nstderr:\n${stderr.slice(-400)}`
        );
        if (stderr.includes("Error:")) {
            throw new Error(`CLI failed to start:\n${stderr}`);
        }

        const responseFromIndex = stdout.length;
        const stderrBeforePrompt = stderr.length;
        child.stdin.write(`${aiPrompt}\n`);

        await waitFor(
            () =>
                isAiResponseComplete(stdout, responseFromIndex, aiPrompt) ||
                stderr.slice(stderrBeforePrompt).includes("Error:"),
            RESPONSE_TIMEOUT_MS,
            "AI response on stdout",
            () =>
                `\nstdout since prompt:\n${stdout.slice(responseFromIndex).slice(0, 1200)}\nstderr since prompt:\n${stderr.slice(stderrBeforePrompt).slice(0, 400)}`
        );
        const promptStderr = stderr.slice(stderrBeforePrompt);
        if (promptStderr.includes("Error:")) {
            throw new Error(
                `CLI prompt failed:\n${promptStderr}\nstdout:\n${stdout.slice(responseFromIndex)}`
            );
        }

        child.stdin.write(".exit\n");

        const exitCode = await new Promise<number | null>((resolve, reject) => {
            const timer = setTimeout(() => {
                killChild(child);
                reject(
                    new Error(
                        `CLI did not exit within ${EXIT_TIMEOUT_MS}ms after .exit\nstdout:\n${stdout}\nstderr:\n${stderr}`
                    )
                );
            }, EXIT_TIMEOUT_MS);

            child.once("close", (code) => {
                clearTimeout(timer);
                resolve(code);
            });
        });

        if (exitCode !== 0) {
            throw new Error(
                `CLI exited with code ${exitCode}\nstdout:\n${stdout}\nstderr:\n${stderr}`
            );
        }

        return { stdout, stderr, code: exitCode, responseFromIndex };
    } catch (err) {
        killChild(child);
        throw err;
    }
}

const credentials = resolveCredentialsForE2e();
const describeCred = e2eCredentialsPresent() ? describe : describe.skip;

describeCred("ilib-ai CLI sample (e2e)", () => {
    test("minimal ping returns fixed JSON message (deterministic)", async () => {
        const expected = JSON.parse(
            fs.readFileSync(minimalPingExpectedPath, "utf8")
        ) as { format: string; message: string };

        const prompt = [
            "You must reply with ONLY valid JSON. No markdown, no code fences, no explanation.",
            "Return exactly one JSON object with keys format (string) and message (string).",
            `Required values: format must be exactly ${JSON.stringify(expected.format)}, message must be exactly ${JSON.stringify(expected.message)}.`,
            "Reply now.",
        ].join(" ");

        const result = await runCliExecution(credentials!, prompt);
        expect(result.stderr).not.toMatch(/Error:/);

        const parsed = parseJsonFromStdout(
            result.stdout,
            result.responseFromIndex,
            prompt
        ) as {
            format?: string;
            message?: string;
        };
        expect(parsed).toEqual(expected);
    });

    test("structured JSON echo (fixed schema and values)", async () => {
        const prompt = [
            "You must reply with ONLY valid JSON. No markdown, no code fences, no explanation.",
            'Return exactly this JSON object and nothing else: {"format":"ilib-ai-test-v1","echo":"ok","sum":7}',
            "Reply now.",
        ].join(" ");

        const result = await runCliExecution(credentials!, prompt);
        expect(result.stderr).not.toMatch(/Error:/);

        const parsed = parseJsonFromStdout(
            result.stdout,
            result.responseFromIndex,
            prompt
        ) as {
            format?: string;
            echo?: string;
            sum?: number;
        };
        expect(parsed.format).toBe("ilib-ai-test-v1");
        expect(parsed.echo).toBe("ok");
        expect(parsed.sum).toBe(7);
    });

    test("structured JSON with expected content (capital of France)", async () => {
        const prompt = [
            "Reply with ONLY valid JSON. No markdown or code fences.",
            'Return exactly: {"format":"ilib-ai-geo-v1","country":"France","capital":"Paris"}',
            "Reply now.",
        ].join(" ");

        const result = await runCliExecution(credentials!, prompt);
        expect(result.stderr).not.toMatch(/Error:/);

        const parsed = parseJsonFromStdout(
            result.stdout,
            result.responseFromIndex,
            prompt
        ) as {
            format?: string;
            country?: string;
            capital?: string;
        };
        expect(parsed.format).toBe("ilib-ai-geo-v1");
        expect(parsed.country).toBe("France");
        expect(parsed.capital).toBeDefined();
        expect(String(parsed.capital).toLowerCase()).toBe("paris");
    });
});
