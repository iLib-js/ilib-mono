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

export {
    getApiInfo,
    getCompatibleMojitoRange,
    getMojitoVersion,
    getOpenApiSpecVersion,
    getSdkVersion,
    isCompatibleMojitoVersion,
} from "./version";
export type { MojitoApiInfo } from "./version";

export { MojitoHttpError } from "./lowlevel/errors";

export {
    Asset,
    Branch,
    Drop,
    MojitoClient,
    MojitoLocale,
    Repository,
    RepositoryType,
    Screenshot,
    SourceString,
    Translation,
    User,
} from "./model";
export type {
    AiReviewResult,
    AiTranslationOptions,
    AssetImportLocalizedParams,
    AssetListParams,
    AssetLocalizeParams,
    AssetPseudoLocalizeParams,
    AsyncOperationOptions,
    AuthenticationMode,
    BranchListParams,
    DropExportParams,
    DropImportParams,
    DropListParams,
    ForwardCompatParams,
    MojitoClientOptions,
    MojitoConnectionConfig,
    MojitoLocaleOptions,
    Pageable,
    RepositoryCreateParams,
    RepositoryListParams,
    RepositoryTypeCreateParams,
    RepositoryTypeIntegrityChecker,
    RepositoryTypeUpdateParams,
    RepositoryUpdateParams,
    ScreenshotListParams,
    ScreenshotUpdateParams,
    SourceStringSearchParams,
    TranslationProps,
    TranslationStatus,
} from "./model";
