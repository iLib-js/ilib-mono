/*
 * BoxAIModelInitOptions.ts — initialization parameters for BoxAIModelAdapter
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

/**
 * JWT application block as in the JSON **downloaded from the Box Developer Console**
 * (same root-level shape: `boxAppSettings` + `enterpriseID` and/or `userID`).
 *
 * @see {@link BoxAIModelInitOptions.boxDeveloperJwtConfig}
 */
export interface BoxDeveloperJwtConfig {
    boxAppSettings: {
        clientID: string;
        clientSecret: string;
        appAuth: {
            publicKeyID: string;
            privateKey: string;
            passphrase: string;
        };
    };
    /** Present in the standard console export for enterprise / service-account JWT. */
    enterpriseID?: string;
    /**
     * App user id when included in the console export (Box uses key **`userID`**).
     */
    userID?: string;
}

/**
 * Initialization parameters for {@link BoxAIModelAdapter}.
 *
 * Authentication uses the official **[Box Node SDK](https://github.com/box/box-node-sdk)** ([Box SDKs & tools](https://developer.box.com/sdks-and-tools)).
 * Provide **one** of the following:
 *
 * - **`accessToken`** — OAuth2 access token or developer token with the **`ai.readwrite`** scope (short-lived; refresh outside this library).
 * - **`boxDeveloperJwtConfig`** — **entire JWT object** as downloaded from the Box Developer Console (`boxAppSettings` + `enterpriseID` / `userID`). Easiest path for local JSON files.
 * - **`configPath`** — path to a JWT config JSON file from the Box Developer Console (same JSON as above, on disk).
 * - **Explicit JWT fields** — `clientId`, `clientSecret`, private key material, and either `enterpriseId` (service account) or `userId` (app user).
 *
 * Environment placeholders such as `${VAR}` in string fields are resolved from `process.env` where noted.
 */
export interface BoxAIModelInitOptions {
    /** Pre-obtained access token (e.g. from `${BOX_ACCESS_TOKEN}`). */
    accessToken?: string;
    /**
     * Box Developer Console JWT export (inline). Same structure as the downloaded JSON file:
     * `boxAppSettings`, optional `enterpriseID` and/or `userID`. When set, used before `configPath`
     * and before flat `clientId` / key fields.
     */
    boxDeveloperJwtConfig?: BoxDeveloperJwtConfig;
    /** Path to Box Developer Console JWT config JSON (alternative to individual credentials). */
    configPath?: string;
    /** Application client ID (JWT auth when not using `configPath`). */
    clientId?: string;
    /** Application client secret (JWT auth). */
    clientSecret?: string;
    /** PEM-encoded private key (or use `privateKeyPath`). */
    privateKey?: string;
    /** Path to a PEM private key file. */
    privateKeyPath?: string;
    /** Passphrase for an encrypted private key. */
    passphrase?: string;
    /** Public key id (optional; JWT `kid`). */
    publicKeyId?: string;
    /** Enterprise ID for service-account JWT subject. */
    enterpriseId?: string;
    /** App user ID for user-scoped JWT subject. */
    userId?: string;
    /**
     * Box **file** id used as the single `items` entry for {@link import("./BoxAIModelAdapter").BoxAIModelAdapter.complete}
     * (`createAiTextGen`). Required for completions; Box AI text generation expects file context.
     */
    contextFileId?: string;
}
