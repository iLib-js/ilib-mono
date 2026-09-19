#!/usr/bin/env node
/*
 * fetch-openapi.js - refresh openapi/openapi.json from a live Mojito instance
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
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const packageRoot = path.resolve(__dirname, "..");
const outputPath = path.join(packageRoot, "openapi", "openapi.json");

function stripAnsi(text) {
    return text.replace(/\u001b\[[0-9;]*m/g, "");
}

function fetchSpec() {
    const result = spawnSync("mojito-dev", ["api", "--spec"], {
        encoding: "utf8",
        maxBuffer: 32 * 1024 * 1024,
        env: process.env,
    });

    if (result.error) {
        if (result.error.code === "ENOENT") {
            throw new Error(
                "The `mojito` CLI was not found on PATH. Install it and retry."
            );
        }
        throw result.error;
    }

    if (result.status !== 0) {
        const stderr = stripAnsi(result.stderr || "").trim();
        throw new Error(
            `\`mojito api --spec\` exited with status ${result.status}` +
                (stderr ? `:\n${stderr}` : "")
        );
    }

    const stdout = stripAnsi(result.stdout || "").trim();
    if (!stdout) {
        throw new Error("`mojito api --spec` produced no output");
    }

    try {
        return JSON.parse(stdout);
    } catch (error) {
        throw new Error(
            `\`mojito api --spec\` did not return JSON: ${error.message}`
        );
    }
}

function main() {
    const spec = fetchSpec();
    if (!spec || typeof spec !== "object" || !spec.openapi) {
        throw new Error("Parsed document is not an OpenAPI object");
    }

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, `${JSON.stringify(spec, null, 2)}\n`, "utf8");

    const pathCount = Object.keys(spec.paths || {}).length;
    const schemaCount = Object.keys((spec.components && spec.components.schemas) || {}).length;
    const version = (spec.info && spec.info.version) || "(missing)";
    console.log(`Wrote ${path.relative(packageRoot, outputPath)}`);
    console.log(`OpenAPI ${spec.openapi}, info.version=${version}`);
    console.log(`paths=${pathCount} schemas=${schemaCount}`);
}

try {
    main();
} catch (error) {
    console.error(error.message || error);
    process.exit(1);
}
