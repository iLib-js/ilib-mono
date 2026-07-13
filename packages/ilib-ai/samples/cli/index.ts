#!/usr/bin/env node

/*
 * index.ts — ilib-ai CLI sample (interactive prompt loop)
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
import * as readline from "readline";

import type { AIModelAdapter } from "ilib-ai";
import type { BoxAIModelInitOptions } from "ilib-ai";
import type { BoxDeveloperJwtConfig } from "ilib-ai";
import type { OpenAIModelInitOptions } from "ilib-ai";
import {
    OPENAI_ADAPTER_NAME,
    createAIModelAdapter,
    listKnownAIModelAdapterNames,
    type KnownAIModelAdapterName,
} from "ilib-ai";

const SYSTEM_PROMPT =
    "You are a helpful assistant. Reply concisely in plain text unless the user asks otherwise.";

const DEFAULT_CREDENTIALS_FILE = "credentials.json";

type CredentialsFile = OpenAIModelInitOptions &
    BoxAIModelInitOptions & {
        jwtConfigPath?: string;
        defaultModel?: string;
        enterpriseID?: string;
        userID?: string;
        boxAppSettings?: BoxDeveloperJwtConfig["boxAppSettings"];
    };

type CliOptions = {
    adapterName: KnownAIModelAdapterName;
    llmModel: string | null;
    credentialsFile: string;
    credentialsPath: string;
};

function printUsage(): void {
    const adapters = listKnownAIModelAdapterNames().join(", ");
    console.log(`Usage: pnpm run:sample -- [options]

  --credentials <file>  Credentials JSON in the current directory (default: ${DEFAULT_CREDENTIALS_FILE})
  --model <name>        Adapter id (${adapters}) or an LLM model id (e.g. gpt-4o-mini).
                        Known adapter ids select that integration; any other value is
                        treated as an LLM model id with the OpenAI adapter.

Interactive commands:
  .info                 Print connection and adapter information
  .exit                 End the session
  Ctrl-D (EOF)          End the session

Copy credentials.example.json to credentials.json in the directory where you run the CLI.`);
}

function resolveCredentialsPath(fileName: string): string {
    if (path.isAbsolute(fileName)) {
        throw new Error(
            "Credentials file must be a name or relative path in the current directory"
        );
    }
    const resolved = path.resolve(process.cwd(), fileName);
    const cwd = path.resolve(process.cwd());
    if (
        resolved !== cwd &&
        !resolved.startsWith(cwd + path.sep)
    ) {
        throw new Error(
            "Credentials file must resolve inside the current directory"
        );
    }
    return resolved;
}

function resolveCredentialPathField(
    value: string | undefined,
    cwd: string
): string | undefined {
    const trimmed = value?.trim();
    if (!trimmed) {
        return undefined;
    }
    if (path.isAbsolute(trimmed)) {
        throw new Error(
            "Credential paths in the JSON file must be relative to the current directory"
        );
    }
    return path.resolve(cwd, trimmed);
}

function parseCliOptions(argv: string[]): CliOptions | null {
    const known = listKnownAIModelAdapterNames();
    let modelArg: string | null = null;
    let credentialsFile = DEFAULT_CREDENTIALS_FILE;
    const args = argv.slice(2).filter((a) => a !== "--");

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === "--help" || arg === "-h") {
            printUsage();
            return null;
        }
        if (arg === "--model" && args[i + 1]) {
            modelArg = args[++i];
            continue;
        }
        if (arg === "--credentials" && args[i + 1]) {
            credentialsFile = args[++i];
            continue;
        }
        console.error(`Unknown argument: ${arg}`);
        printUsage();
        return null;
    }

    let credentialsPath: string;
    try {
        credentialsPath = resolveCredentialsPath(credentialsFile);
    } catch (err) {
        console.error(err instanceof Error ? err.message : String(err));
        return null;
    }

    let adapterName: KnownAIModelAdapterName = OPENAI_ADAPTER_NAME;
    let llmModel: string | null = null;

    if (modelArg) {
        if (known.includes(modelArg as KnownAIModelAdapterName)) {
            adapterName = modelArg as KnownAIModelAdapterName;
        } else {
            llmModel = modelArg;
        }
    }

    return {
        adapterName,
        llmModel,
        credentialsFile,
        credentialsPath,
    };
}

function loadCredentialsFile(credentialsPath: string): CredentialsFile {
    if (!fs.existsSync(credentialsPath)) {
        throw new Error(
            `Credentials file not found: ${credentialsPath} (current directory: ${process.cwd()})`
        );
    }
    try {
        return JSON.parse(
            fs.readFileSync(credentialsPath, "utf8")
        ) as CredentialsFile;
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        throw new Error(`Failed to read credentials file: ${msg}`);
    }
}

function buildAdapterInit(
    adapterName: KnownAIModelAdapterName,
    credentialsPath: string
): OpenAIModelInitOptions | BoxAIModelInitOptions {
    const creds = loadCredentialsFile(credentialsPath);
    const cwd = process.cwd();

    if (adapterName === OPENAI_ADAPTER_NAME) {
        const apiKey = creds.apiKey?.trim();
        if (!apiKey) {
            throw new Error(
                `OpenAI: credentials file must include a non-empty "apiKey" (${credentialsPath})`
            );
        }
        const init: OpenAIModelInitOptions = { apiKey };
        if (creds.baseUrl?.trim()) {
            init.baseUrl = creds.baseUrl.trim();
        }
        if (creds.defaultModel?.trim()) {
            init.defaultModel = creds.defaultModel.trim();
        }
        return init;
    }

    const init: BoxAIModelInitOptions = {};
    if (creds.accessToken?.trim()) {
        init.accessToken = creds.accessToken.trim();
    }

    const configPath =
        resolveCredentialPathField(creds.configPath, cwd) ??
        resolveCredentialPathField(creds.jwtConfigPath, cwd);
    if (configPath) {
        init.configPath = configPath;
    }

    if (creds.contextFileId?.trim()) {
        init.contextFileId = creds.contextFileId.trim();
    }
    if (creds.userId?.trim()) {
        init.userId = creds.userId.trim();
    }
    if (creds.enterpriseId?.trim()) {
        init.enterpriseId = creds.enterpriseId.trim();
    }

    if (creds.boxAppSettings) {
        init.boxDeveloperJwtConfig = {
            boxAppSettings: creds.boxAppSettings,
        };
        if (creds.enterpriseID?.trim()) {
            init.boxDeveloperJwtConfig.enterpriseID = creds.enterpriseID.trim();
        }
        if (creds.userID?.trim()) {
            init.boxDeveloperJwtConfig.userID = creds.userID.trim();
        }
    }

    if (
        !init.accessToken &&
        !init.configPath &&
        !init.boxDeveloperJwtConfig?.boxAppSettings
    ) {
        throw new Error(
            `Box AI: credentials file must include accessToken, configPath/jwtConfigPath, or boxAppSettings (${credentialsPath})`
        );
    }
    return init;
}

function resolveLlmModel(adapter: AIModelAdapter, override: string | null): string {
    if (override?.trim()) {
        return override.trim();
    }
    return adapter.getCapabilities().defaultModel;
}

async function printInfo(
    adapter: AIModelAdapter,
    llmModel: string,
    credentialsFile: string
): Promise<void> {
    const caps = adapter.getCapabilities();
    console.log(`Credentials:  ${credentialsFile} (current directory)`);
    console.log(`Provider:     ${adapter.getDisplayName()} (${adapter.getProviderId()})`);
    console.log(`LLM model:    ${llmModel}`);
    console.log(`Connected:    ${adapter.isConnected() ? "yes" : "no"}`);
    console.log(`Configured:   ${adapter.isConfigured() ? "yes" : "no"}`);
    console.log(
        `Model list:   ${caps.supportsModelListing ? "supported" : "not supported"}`
    );
    if (caps.maxConcurrentRequests !== undefined) {
        console.log(`Concurrency:  ${caps.maxConcurrentRequests}`);
    }

    if (adapter.isConnected() && caps.supportsModelListing) {
        const models = await adapter.listAvailableModels();
        const preview = models
            .slice(0, 5)
            .map((m) => m.id)
            .join(", ");
        const suffix =
            models.length > 5 ? `, … (${models.length} total)` : "";
        console.log(`Models:       ${preview || "(none)"}${suffix}`);
    }
}

async function main(): Promise<void> {
    const options = parseCliOptions(process.argv);
    if (options === null) {
        const isHelp =
            process.argv.includes("--help") || process.argv.includes("-h");
        process.exit(isHelp ? 0 : 1);
    }

    const init = buildAdapterInit(
        options.adapterName,
        options.credentialsPath
    );
    const adapter = createAIModelAdapter(options.adapterName, init);

    console.log(`Connecting to ${adapter.getDisplayName()}…`);
    await adapter.connect();

    const llmModel = resolveLlmModel(adapter, options.llmModel);
    console.log(
        `Connected. LLM model: ${llmModel}. Type .info, .exit, or your prompt. Ctrl-D to quit.\n`
    );

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: Boolean(process.stdin.isTTY && process.stdout.isTTY),
        prompt: "> ",
    });

    let busy = false;
    let closing = false;

    const shutdown = async (): Promise<void> => {
        if (closing) {
            return;
        }
        closing = true;
        rl.close();
        await adapter.disconnect();
        console.log("\nDone.");
    };

    const handleLine = async (line: string): Promise<void> => {
        const input = line.trim();

        if (input === ".exit") {
            await shutdown();
            return;
        }

        if (input === ".info") {
            await printInfo(adapter, llmModel, options.credentialsFile);
            if (!closing) {
                rl.prompt();
            }
            return;
        }

        if (!input) {
            if (!closing) {
                rl.prompt();
            }
            return;
        }

        if (busy) {
            console.log("(still waiting for the previous response…)");
            if (!closing) {
                rl.prompt();
            }
            return;
        }

        busy = true;
        try {
            const res = await adapter.complete({
                systemPrompt: SYSTEM_PROMPT,
                userContent: input,
                model: llmModel,
            });
            if (res.error) {
                console.error(`Error: ${res.error.message}`);
            } else {
                console.log(res.rawContent);
            }
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            console.error(`Error: ${msg}`);
        } finally {
            busy = false;
            if (!closing) {
                rl.prompt();
            }
        }
    };

    rl.on("line", (line: string) => {
        void handleLine(line);
    });

    rl.on("close", () => {
        void (async () => {
            if (!closing) {
                closing = true;
                await adapter.disconnect();
            }
            process.exit(0);
        })();
    });

    rl.prompt();
}

main().catch((err) => {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(msg);
    process.exit(1);
});
