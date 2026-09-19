/*
 * index.ts - high-level object model exports
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

export { Asset } from "./Asset";
export type {
    AssetImportLocalizedParams,
    AssetListParams,
    AssetLocalizeParams,
    AssetPseudoLocalizeParams,
} from "./Asset";
export { Branch } from "./Branch";
export type { BranchListParams } from "./Branch";
export { Drop } from "./Drop";
export type {
    DropExportParams,
    DropImportParams,
    DropListParams,
} from "./Drop";
export { MojitoClient } from "./MojitoClient";
export type {
    AuthenticationMode,
    MojitoClientOptions,
    MojitoConnectionConfig,
} from "./MojitoClient";
export { MojitoLocale } from "./MojitoLocale";
export type { MojitoLocaleOptions } from "./MojitoLocale";
export { Repository } from "./Repository";
export type {
    RepositoryCreateParams,
    RepositoryListParams,
    RepositoryUpdateParams,
} from "./Repository";
export { RepositoryType } from "./RepositoryType";
export type {
    RepositoryTypeCreateParams,
    RepositoryTypeIntegrityChecker,
    RepositoryTypeUpdateParams,
} from "./RepositoryType";
export { Screenshot } from "./Screenshot";
export type { ScreenshotListParams, ScreenshotUpdateParams } from "./Screenshot";
export { SourceString } from "./SourceString";
export type { AiTranslationOptions, SourceStringSearchParams } from "./SourceString";
export { Translation } from "./Translation";
export type {
    AiReviewResult,
    TranslationProps,
    TranslationStatus,
} from "./Translation";
export { User } from "./User";
export type {
    AsyncOperationOptions,
    ForwardCompatParams,
    Pageable,
} from "./types";
