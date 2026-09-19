#!/usr/bin/env node
/*
 * generate-spec-meta.js - generate low-level operation metadata from OpenAPI
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

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const packageRoot = path.resolve(__dirname, "..");
const specPath = path.join(packageRoot, "openapi", "openapi.json");
const outputPath = path.join(packageRoot, "src", "lowlevel", "spec-meta.ts");
const methods = new Set(["get", "post", "put", "patch", "delete", "head", "options"]);

function operationMetadata(spec) {
    const operations = {};

    for (const [operationPath, pathItem] of Object.entries(spec.paths || {})) {
        for (const [method, operation] of Object.entries(pathItem)) {
            if (!methods.has(method) || !operation || !operation.operationId) {
                continue;
            }

            const parameters = [
                ...(pathItem.parameters || []),
                ...(operation.parameters || []),
            ];
            operations[operation.operationId] = {
                operationId: operation.operationId,
                method: method.toUpperCase(),
                path: operationPath,
                tags: operation.tags || [],
                summary: operation.summary || "",
                pathParams: parameters
                    .filter((parameter) => parameter.in === "path")
                    .map((parameter) => parameter.name),
                queryParams: parameters
                    .filter((parameter) => parameter.in === "query")
                    .map((parameter) => ({
                        name: parameter.name,
                        required: !!parameter.required,
                        isPageable: parameter.schema?.$ref?.endsWith("/Pageable") || false,
                    })),
                hasBody: !!operation.requestBody,
            };
        }
    }

    return operations;
}

function main() {
    const source = fs.readFileSync(specPath, "utf8");
    const spec = JSON.parse(source);
    const hash = crypto.createHash("sha256").update(source).digest("hex").slice(0, 16);
    const operations = operationMetadata(spec);
    const generated = `/*
 * spec-meta.ts - OpenAPI generation metadata for mojito-sdk
 *
 * AUTO-GENERATED. Do not edit by hand.
 *
 * Copyright © 2026 JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

/** Mojito version (OpenAPI info.version) from the cached spec used to generate this SDK. */
export const OPENAPI_SPEC_VERSION = ${JSON.stringify(spec.info?.version || "")};

/** Short content hash of the cached OpenAPI document. */
export const OPENAPI_SPEC_HASH = ${JSON.stringify(hash)};

/** ISO timestamp when this metadata was generated. */
export const OPENAPI_GENERATED_AT = ${JSON.stringify(new Date().toISOString())};

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

export type QueryParamMeta = {
    name: string;
    required: boolean;
    isPageable: boolean;
};

export type OperationMeta = {
    operationId: string;
    method: HttpMethod;
    path: string;
    tags: string[];
    summary: string;
    pathParams: string[];
    queryParams: QueryParamMeta[];
    hasBody: boolean;
};

/** Registry of Mojito OpenAPI operations. */
export const OPERATIONS: Record<string, OperationMeta> = ${JSON.stringify(operations, null, 4)};
`;

    fs.writeFileSync(outputPath, generated, "utf8");
    console.log(`Wrote ${path.relative(packageRoot, outputPath)} (${Object.keys(operations).length} operations)`);
}

main();
