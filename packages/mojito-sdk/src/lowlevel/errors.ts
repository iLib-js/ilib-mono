/*
 * errors.ts - HTTP / API errors for mojito-sdk
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

/**
 * Error thrown when a Mojito HTTP request fails.
 */
export class MojitoHttpError extends Error {
    /** HTTP status code. */
    readonly status: number;
    /** Response body text when available. */
    readonly body: string;
    /** Request method. */
    readonly method: string;
    /** Request URL. */
    readonly url: string;

    /**
     * @param message Human-readable error message.
     * @param details Status and request context.
     */
    constructor(
        message: string,
        details: { status: number; body: string; method: string; url: string },
    ) {
        super(message);
        this.name = "MojitoHttpError";
        this.status = details.status;
        this.body = details.body;
        this.method = details.method;
        this.url = details.url;
    }
}
