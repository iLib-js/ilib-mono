/*
 * types.ts - shared high-level object model types
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

/** Forward-compatible parameter bag: known fields plus arbitrary extras. */
export type ForwardCompatParams<T extends object = object> = T & Record<string, unknown>;

/** Spring Data pageable query shape used by several Mojito list endpoints. */
export type Pageable = {
    page?: number;
    size?: number;
    sort?: string | string[];
};

/** Options shared by methods that wait for a Mojito background operation. */
export type AsyncOperationOptions = {
    /** Stop waiting when this signal is aborted. */
    signal?: AbortSignal;
    /** Maximum wait in milliseconds. Defaults to five minutes. */
    timeoutMs?: number;
    /** Initial polling delay in milliseconds. Defaults to 500. */
    pollIntervalMs?: number;
};
