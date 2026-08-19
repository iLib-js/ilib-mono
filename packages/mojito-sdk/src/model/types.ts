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

/** Minimal locale representation from Mojito. */
export type LocaleData = {
    id?: number;
    bcp47Tag?: string;
    [key: string]: unknown;
};

/** Drop summary as returned by GET /api/drops. */
export type DropData = {
    id?: number;
    name?: string;
    createdDate?: string;
    dropExporterType?: string;
    dropExporterConfig?: string;
    canceled?: boolean;
    exportFailed?: boolean;
    importFailed?: boolean;
    partiallyImported?: boolean;
    lastImportedDate?: string;
    repository?: { id?: number; name?: string; [key: string]: unknown };
    importPollableTask?: PollableTaskData;
    exportPollableTask?: PollableTaskData;
    [key: string]: unknown;
};

/** Repository entity (create/get/list). */
export type RepositoryData = {
    id?: number;
    name?: string;
    description?: string;
    deleted?: boolean;
    checkSLA?: boolean;
    dropExporterType?: string;
    sourceLocale?: LocaleData;
    repositoryLocales?: Array<{
        id?: number;
        locale?: LocaleData;
        toBeFullyTranslated?: boolean;
        [key: string]: unknown;
    }>;
    [key: string]: unknown;
};

/** Pollable background task. */
export type PollableTaskData = {
    id?: number;
    name?: string;
    allFinished?: boolean;
    message?: string;
    errorMessage?: string;
    finishedDate?: string;
    [key: string]: unknown;
};

/** Text unit DTO from search endpoints. */
export type TextUnitData = {
    tmTextUnitId?: number;
    name?: string;
    content?: string;
    comment?: string;
    locale?: string;
    target?: string;
    repositoryName?: string;
    [key: string]: unknown;
};

/** Current user profile. */
export type UserProfileData = {
    username?: string;
    givenName?: string;
    surname?: string;
    [key: string]: unknown;
};

/** Page wrapper used by drop listing. */
export type Page<T> = {
    content?: T[];
    totalElements?: number;
    totalPages?: number;
    size?: number;
    number?: number;
    [key: string]: unknown;
};
