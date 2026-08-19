#!/usr/bin/env node

/*
 * index.ts - command-line sample for mojito-sdk
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

import {
    MojitoClient,
    getApiInfo,
    getOpenApiSpecVersion,
    getSdkVersion,
} from "mojito-sdk";

function printUsage(): void {
    console.log("Usage: pnpm run:sample -- <command> [options]");
    console.log("");
    console.log("Commands:");
    console.log("  version              Print SDK and OpenAPI versions");
    console.log("  repos list [name]    List repositories (optional name filter)");
    console.log("  drops list [--repository-id <id>]");
    console.log("  locales list [bcp47] List locales");
    console.log("  me                   Print the current Mojito user");
}

function getFlag(args: string[], name: string): string | undefined {
    const index = args.indexOf(name);
    if (index < 0) {
        return undefined;
    }
    return args[index + 1];
}

async function main(): Promise<void> {
    const args = process.argv.slice(2).filter((argument) => argument !== "--");
    const command = args[0];

    if (command === "version") {
        const info = await getApiInfo();
        console.log(`sdk=${getSdkVersion()}`);
        console.log(`openapi=${getOpenApiSpecVersion()}`);
        console.log(`openapiHash=${info.openApiSpecHash}`);
        return;
    }

    if (!command || command === "--help" || command === "-h") {
        printUsage();
        return;
    }

    const client = new MojitoClient();

    if (command === "repos" && args[1] === "list") {
        const name = args[2];
        const repos = await client.listRepositories(name ? { name } : {});
        for (const repo of repos) {
            console.log(`${repo.id}\t${repo.name ?? ""}`);
        }
        return;
    }

    if (command === "drops" && args[1] === "list") {
        const repositoryIdRaw = getFlag(args, "--repository-id");
        const drops = await client.listDrops({
            repositoryId: repositoryIdRaw ? Number(repositoryIdRaw) : undefined,
        });
        for (const drop of drops) {
            console.log(`${drop.id}\t${drop.name ?? ""}`);
        }
        return;
    }

    if (command === "locales" && args[1] === "list") {
        const bcp47Tag = args[2];
        const locales = await client.listLocales(bcp47Tag ? { bcp47Tag } : {});
        for (const locale of locales) {
            console.log(`${locale.id}\t${locale.bcp47Tag ?? ""}`);
        }
        return;
    }

    if (command === "me") {
        const me = await client.me();
        console.log(JSON.stringify(me, null, 2));
        return;
    }

    printUsage();
    process.exitCode = 1;
}

main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exitCode = 1;
});
