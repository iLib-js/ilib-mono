/*
 * index.ts - public API for mojito-sdk
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

export { getApiInfo, getOpenApiSpecVersion, getSdkVersion } from "./version";
export type { MojitoApiInfo } from "./version";

export {
    createAuthProvider,
    buildBaseUrl,
    resolveConnectionConfig,
    HeaderAuth,
    StatefulFormLoginAuth,
} from "./auth";
export type {
    AuthProvider,
    AuthenticationMode,
    MojitoConnectionConfig,
} from "./auth";

export {
    LowLevelClient,
    MojitoHttpError,
    OPENAPI_SPEC_HASH,
    OPENAPI_SPEC_VERSION,
    OPERATIONS,
} from "./lowlevel";
export type { JsonValue, OperationParams } from "./lowlevel";

export {
    Drop,
    Locale,
    MojitoClient,
    PollableTask,
    Repository,
    TextUnit,
    User,
} from "./model";
export type {
    DropData,
    DropExportParams,
    DropImportParams,
    DropListParams,
    ForwardCompatParams,
    LocaleData,
    MojitoClientOptions,
    Pageable,
    PollableTaskData,
    RepositoryCreateParams,
    RepositoryData,
    RepositoryListParams,
    TextUnitData,
    TextUnitSearchParams,
    UserProfileData,
} from "./model";
