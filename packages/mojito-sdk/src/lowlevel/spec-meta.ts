/*
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

/** OpenAPI info.version from the cached Mojito spec used to generate this SDK. */
export const OPENAPI_SPEC_VERSION = "v0";

/** Short content hash of the cached OpenAPI document. */
export const OPENAPI_SPEC_HASH = "ce3581fac3125050";

/** ISO timestamp when this metadata was generated. */
export const OPENAPI_GENERATED_AT = "2026-08-15T04:29:49.484Z";

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
export const OPERATIONS: Record<string, OperationMeta> = {
    "getTextUnits": {
        "operationId": "getTextUnits",
        "method": "GET",
        "path": "/api/virtualAssets/{assetId}/textUnits",
        "tags": [
            "virtual-asset-ws"
        ],
        "summary": "",
        "pathParams": [
            "assetId"
        ],
        "queryParams": [
            {
                "name": "doNotTranslateFilter",
                "required": false,
                "isPageable": false
            }
        ],
        "hasBody": false
    },
    "replaceTextUnits": {
        "operationId": "replaceTextUnits",
        "method": "PUT",
        "path": "/api/virtualAssets/{assetId}/textUnits",
        "tags": [
            "virtual-asset-ws"
        ],
        "summary": "",
        "pathParams": [
            "assetId"
        ],
        "queryParams": [],
        "hasBody": true
    },
    "addTextUnits": {
        "operationId": "addTextUnits",
        "method": "POST",
        "path": "/api/virtualAssets/{assetId}/textUnits",
        "tags": [
            "virtual-asset-ws"
        ],
        "summary": "",
        "pathParams": [
            "assetId"
        ],
        "queryParams": [],
        "hasBody": true
    },
    "deleteTextUnit": {
        "operationId": "deleteTextUnit",
        "method": "DELETE",
        "path": "/api/virtualAssets/{assetId}/textUnits",
        "tags": [
            "virtual-asset-ws"
        ],
        "summary": "",
        "pathParams": [
            "assetId"
        ],
        "queryParams": [],
        "hasBody": true
    },
    "updateScreenshot": {
        "operationId": "updateScreenshot",
        "method": "PUT",
        "path": "/api/screenshots/{id}",
        "tags": [
            "screenshot-ws"
        ],
        "summary": "",
        "pathParams": [
            "id"
        ],
        "queryParams": [],
        "hasBody": true
    },
    "deleteScreenshot": {
        "operationId": "deleteScreenshot",
        "method": "DELETE",
        "path": "/api/screenshots/{id}",
        "tags": [
            "screenshot-ws"
        ],
        "summary": "",
        "pathParams": [
            "id"
        ],
        "queryParams": [],
        "hasBody": false
    },
    "getImage": {
        "operationId": "getImage",
        "method": "GET",
        "path": "/api/images/**",
        "tags": [
            "image-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": false
    },
    "uploadImage": {
        "operationId": "uploadImage",
        "method": "PUT",
        "path": "/api/images/**",
        "tags": [
            "image-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": true
    },
    "createOrUpdateVirtualAsset": {
        "operationId": "createOrUpdateVirtualAsset",
        "method": "POST",
        "path": "/api/virtualAssets",
        "tags": [
            "virtual-asset-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": true
    },
    "getLocalizedTextUnits": {
        "operationId": "getLocalizedTextUnits",
        "method": "GET",
        "path": "/api/virtualAssets/{assetId}/locale/{localeId}/textUnits",
        "tags": [
            "virtual-asset-ws"
        ],
        "summary": "",
        "pathParams": [
            "assetId",
            "localeId"
        ],
        "queryParams": [
            {
                "name": "inheritanceMode",
                "required": false,
                "isPageable": false
            }
        ],
        "hasBody": false
    },
    "importLocalizedTextUnits": {
        "operationId": "importLocalizedTextUnits",
        "method": "POST",
        "path": "/api/virtualAssets/{assetId}/locale/{localeId}/textUnits",
        "tags": [
            "virtual-asset-ws"
        ],
        "summary": "",
        "pathParams": [
            "assetId",
            "localeId"
        ],
        "queryParams": [],
        "hasBody": true
    },
    "getUsers": {
        "operationId": "getUsers",
        "method": "GET",
        "path": "/api/users",
        "tags": [
            "user-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [
            {
                "name": "username",
                "required": false,
                "isPageable": false
            },
            {
                "name": "pageable",
                "required": true,
                "isPageable": true
            }
        ],
        "hasBody": false
    },
    "createUser": {
        "operationId": "createUser",
        "method": "POST",
        "path": "/api/users",
        "tags": [
            "user-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": true
    },
    "changePassword": {
        "operationId": "changePassword",
        "method": "POST",
        "path": "/api/users/pw",
        "tags": [
            "user-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": true
    },
    "sync": {
        "operationId": "sync",
        "method": "POST",
        "path": "/api/thirdparty/sync",
        "tags": [
            "third-party-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": true
    },
    "getTextUnitsWithGet": {
        "operationId": "getTextUnitsWithGet",
        "method": "GET",
        "path": "/api/textunits",
        "tags": [
            "text-unit-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [
            {
                "name": "textUnitSearchBody",
                "required": true,
                "isPageable": false
            }
        ],
        "hasBody": false
    },
    "addTextUnit": {
        "operationId": "addTextUnit",
        "method": "POST",
        "path": "/api/textunits",
        "tags": [
            "text-unit-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": true
    },
    "importTextUnitBatch": {
        "operationId": "importTextUnitBatch",
        "method": "POST",
        "path": "/api/textunitsBatch",
        "tags": [
            "text-unit-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": true
    },
    "importStatistics": {
        "operationId": "importStatistics",
        "method": "POST",
        "path": "/api/textunits/statistics",
        "tags": [
            "text-unit-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [
            {
                "name": "repositoryName",
                "required": true,
                "isPageable": false
            },
            {
                "name": "assetPath",
                "required": true,
                "isPageable": false
            }
        ],
        "hasBody": true
    },
    "getTextUnitsWithPost": {
        "operationId": "getTextUnitsWithPost",
        "method": "POST",
        "path": "/api/textunits/search",
        "tags": [
            "text-unit-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": true
    },
    "searchTextUnitsHybrid": {
        "operationId": "searchTextUnitsHybrid",
        "method": "POST",
        "path": "/api/textunits/search-hybrid",
        "tags": [
            "text-unit-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": true
    },
    "saveGitBlameWithUsages": {
        "operationId": "saveGitBlameWithUsages",
        "method": "POST",
        "path": "/api/textunits/gitBlameWithUsagesBatch",
        "tags": [
            "text-unit-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": true
    },
    "checkTMTextUnit": {
        "operationId": "checkTMTextUnit",
        "method": "POST",
        "path": "/api/textunits/check",
        "tags": [
            "text-unit-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": true
    },
    "getScreeenshots": {
        "operationId": "getScreeenshots",
        "method": "GET",
        "path": "/api/screenshots",
        "tags": [
            "screenshot-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [
            {
                "name": "repositoryIds[]",
                "required": false,
                "isPageable": false
            },
            {
                "name": "bcp47Tags[]",
                "required": false,
                "isPageable": false
            },
            {
                "name": "screenshotName",
                "required": false,
                "isPageable": false
            },
            {
                "name": "status",
                "required": false,
                "isPageable": false
            },
            {
                "name": "name",
                "required": false,
                "isPageable": false
            },
            {
                "name": "source",
                "required": false,
                "isPageable": false
            },
            {
                "name": "target",
                "required": false,
                "isPageable": false
            },
            {
                "name": "searchType",
                "required": false,
                "isPageable": false
            },
            {
                "name": "screenshotRunType",
                "required": false,
                "isPageable": false
            },
            {
                "name": "limit",
                "required": false,
                "isPageable": false
            },
            {
                "name": "offset",
                "required": false,
                "isPageable": false
            }
        ],
        "hasBody": false
    },
    "createOrAddToScreenshotRun": {
        "operationId": "createOrAddToScreenshotRun",
        "method": "POST",
        "path": "/api/screenshots",
        "tags": [
            "screenshot-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": true
    },
    "setRotation": {
        "operationId": "setRotation",
        "method": "POST",
        "path": "/api/rotation",
        "tags": [
            "rotation-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": true
    },
    "getRepositories_1": {
        "operationId": "getRepositories_1",
        "method": "GET",
        "path": "/api/repositories",
        "tags": [
            "repository-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [
            {
                "name": "name",
                "required": true,
                "isPageable": false
            }
        ],
        "hasBody": false
    },
    "createRepository": {
        "operationId": "createRepository",
        "method": "POST",
        "path": "/api/repositories",
        "tags": [
            "repository-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": true
    },
    "importRepository": {
        "operationId": "importRepository",
        "method": "POST",
        "path": "/api/repositories/{repositoryId}/xliffImport",
        "tags": [
            "repository-ws"
        ],
        "summary": "",
        "pathParams": [
            "repositoryId"
        ],
        "queryParams": [],
        "hasBody": true
    },
    "aiTranslate": {
        "operationId": "aiTranslate",
        "method": "POST",
        "path": "/api/proto-ai-translate",
        "tags": [
            "ai-translate-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": true
    },
    "aiTranslateRetryImport": {
        "operationId": "aiTranslateRetryImport",
        "method": "POST",
        "path": "/api/proto-ai-translate/retry-import",
        "tags": [
            "ai-translate-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": true
    },
    "aiReview": {
        "operationId": "aiReview",
        "method": "POST",
        "path": "/api/proto-ai-review",
        "tags": [
            "ai-review-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": true
    },
    "aiReviewRetryImport": {
        "operationId": "aiReviewRetryImport",
        "method": "POST",
        "path": "/api/proto-ai-review/retry-import",
        "tags": [
            "ai-review-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": true
    },
    "getSingleTranslation": {
        "operationId": "getSingleTranslation",
        "method": "POST",
        "path": "/api/machine-translation",
        "tags": [
            "machine-translation-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": true
    },
    "translateRepository": {
        "operationId": "translateRepository",
        "method": "POST",
        "path": "/api/machine-translation/repository",
        "tags": [
            "machine-translation-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": true
    },
    "getTranslations": {
        "operationId": "getTranslations",
        "method": "POST",
        "path": "/api/machine-translation-batch",
        "tags": [
            "machine-translation-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": true
    },
    "copyTM": {
        "operationId": "copyTM",
        "method": "POST",
        "path": "/api/leveraging/copyTM",
        "tags": [
            "leveraging-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": true
    },
    "importDrop": {
        "operationId": "importDrop",
        "method": "POST",
        "path": "/api/drops/import",
        "tags": [
            "drop-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": true
    },
    "importXliff": {
        "operationId": "importXliff",
        "method": "POST",
        "path": "/api/drops/importXliff",
        "tags": [
            "drop-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": true
    },
    "exportDrop": {
        "operationId": "exportDrop",
        "method": "POST",
        "path": "/api/drops/export",
        "tags": [
            "drop-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": true
    },
    "completeDropById": {
        "operationId": "completeDropById",
        "method": "POST",
        "path": "/api/drops/complete/{dropId}",
        "tags": [
            "drop-ws"
        ],
        "summary": "",
        "pathParams": [
            "dropId"
        ],
        "queryParams": [],
        "hasBody": false
    },
    "cancelDrop": {
        "operationId": "cancelDrop",
        "method": "POST",
        "path": "/api/drops/cancel",
        "tags": [
            "drop-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": true
    },
    "getCommits": {
        "operationId": "getCommits",
        "method": "GET",
        "path": "/api/commits",
        "tags": [
            "commit-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [
            {
                "name": "repositoryId",
                "required": true,
                "isPageable": false
            },
            {
                "name": "commitNames",
                "required": false,
                "isPageable": false
            },
            {
                "name": "pushRunName",
                "required": false,
                "isPageable": false
            },
            {
                "name": "pullRunName",
                "required": false,
                "isPageable": false
            },
            {
                "name": "hasPushRun",
                "required": false,
                "isPageable": false
            },
            {
                "name": "hasPullRun",
                "required": false,
                "isPageable": false
            },
            {
                "name": "pageable",
                "required": true,
                "isPageable": true
            }
        ],
        "hasBody": false
    },
    "createCommit": {
        "operationId": "createCommit",
        "method": "POST",
        "path": "/api/commits",
        "tags": [
            "commit-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": true
    },
    "associateCommitToPushRun": {
        "operationId": "associateCommitToPushRun",
        "method": "POST",
        "path": "/api/commits/pushRun",
        "tags": [
            "commit-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": true
    },
    "associateCommitToPullRun": {
        "operationId": "associateCommitToPullRun",
        "method": "POST",
        "path": "/api/commits/pullRun",
        "tags": [
            "commit-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": true
    },
    "getLastPushedCommit": {
        "operationId": "getLastPushedCommit",
        "method": "POST",
        "path": "/api/commits/lastPushed/",
        "tags": [
            "commit-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": true
    },
    "getLastPushRun": {
        "operationId": "getLastPushRun",
        "method": "POST",
        "path": "/api/commits/lastPushRun/",
        "tags": [
            "commit-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": true
    },
    "getLastPulledCommit": {
        "operationId": "getLastPulledCommit",
        "method": "POST",
        "path": "/api/commits/lastPulled/",
        "tags": [
            "commit-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": true
    },
    "getLastPullRun": {
        "operationId": "getLastPullRun",
        "method": "POST",
        "path": "/api/commits/lastPullRun/",
        "tags": [
            "commit-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": true
    },
    "postClob": {
        "operationId": "postClob",
        "method": "POST",
        "path": "/api/clobstorage",
        "tags": [
            "clob-storage-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": true
    },
    "getBoxSDKServiceConfig": {
        "operationId": "getBoxSDKServiceConfig",
        "method": "GET",
        "path": "/api/boxSDKServiceConfigs",
        "tags": [
            "box-sdk-service-config-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": false
    },
    "setBoxSDKServiceConfig": {
        "operationId": "setBoxSDKServiceConfig",
        "method": "POST",
        "path": "/api/boxSDKServiceConfigs",
        "tags": [
            "box-sdk-service-config-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": true
    },
    "getAssets": {
        "operationId": "getAssets",
        "method": "GET",
        "path": "/api/assets",
        "tags": [
            "asset-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [
            {
                "name": "repositoryId",
                "required": true,
                "isPageable": false
            },
            {
                "name": "path",
                "required": false,
                "isPageable": false
            },
            {
                "name": "deleted",
                "required": false,
                "isPageable": false
            },
            {
                "name": "virtual",
                "required": false,
                "isPageable": false
            },
            {
                "name": "branchId",
                "required": false,
                "isPageable": false
            }
        ],
        "hasBody": false
    },
    "importSourceAsset": {
        "operationId": "importSourceAsset",
        "method": "POST",
        "path": "/api/assets",
        "tags": [
            "asset-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": true
    },
    "deleteAssetsOfBranches": {
        "operationId": "deleteAssetsOfBranches",
        "method": "DELETE",
        "path": "/api/assets",
        "tags": [
            "asset-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [
            {
                "name": "branchId",
                "required": false,
                "isPageable": false
            }
        ],
        "hasBody": true
    },
    "xliffExportAsync": {
        "operationId": "xliffExportAsync",
        "method": "POST",
        "path": "/api/assets/{assetId}/xliffExport",
        "tags": [
            "asset-ws"
        ],
        "summary": "",
        "pathParams": [
            "assetId"
        ],
        "queryParams": [
            {
                "name": "bcp47tag",
                "required": true,
                "isPageable": false
            }
        ],
        "hasBody": true
    },
    "getPseudoLocalizedAssetForContent": {
        "operationId": "getPseudoLocalizedAssetForContent",
        "method": "POST",
        "path": "/api/assets/{assetId}/pseudo",
        "tags": [
            "asset-ws"
        ],
        "summary": "",
        "pathParams": [
            "assetId"
        ],
        "queryParams": [],
        "hasBody": true
    },
    "getLocalizedAssetForContentAsync": {
        "operationId": "getLocalizedAssetForContentAsync",
        "method": "POST",
        "path": "/api/assets/{assetId}/localized",
        "tags": [
            "asset-ws"
        ],
        "summary": "",
        "pathParams": [
            "assetId"
        ],
        "queryParams": [],
        "hasBody": true
    },
    "getLocalizedAssetForContent": {
        "operationId": "getLocalizedAssetForContent",
        "method": "POST",
        "path": "/api/assets/{assetId}/localized/{localeId}",
        "tags": [
            "asset-ws"
        ],
        "summary": "",
        "pathParams": [
            "assetId",
            "localeId"
        ],
        "queryParams": [],
        "hasBody": true
    },
    "importLocalizedAsset": {
        "operationId": "importLocalizedAsset",
        "method": "POST",
        "path": "/api/assets/{assetId}/localized/{localeId}/import",
        "tags": [
            "asset-ws"
        ],
        "summary": "",
        "pathParams": [
            "assetId",
            "localeId"
        ],
        "queryParams": [],
        "hasBody": true
    },
    "getLocalizedAssetForContentParallel": {
        "operationId": "getLocalizedAssetForContentParallel",
        "method": "POST",
        "path": "/api/assets/{assetId}/localized/parallel",
        "tags": [
            "asset-ws"
        ],
        "summary": "",
        "pathParams": [
            "assetId"
        ],
        "queryParams": [],
        "hasBody": true
    },
    "deleteUserByUserId": {
        "operationId": "deleteUserByUserId",
        "method": "DELETE",
        "path": "/api/users/{userId}",
        "tags": [
            "user-ws"
        ],
        "summary": "",
        "pathParams": [
            "userId"
        ],
        "queryParams": [],
        "hasBody": false
    },
    "updateUserByUserId": {
        "operationId": "updateUserByUserId",
        "method": "PATCH",
        "path": "/api/users/{userId}",
        "tags": [
            "user-ws"
        ],
        "summary": "",
        "pathParams": [
            "userId"
        ],
        "queryParams": [],
        "hasBody": true
    },
    "getRepositoryById": {
        "operationId": "getRepositoryById",
        "method": "GET",
        "path": "/api/repositories/{repositoryId}",
        "tags": [
            "repository-ws"
        ],
        "summary": "",
        "pathParams": [
            "repositoryId"
        ],
        "queryParams": [],
        "hasBody": false
    },
    "deleteRepositoryById": {
        "operationId": "deleteRepositoryById",
        "method": "DELETE",
        "path": "/api/repositories/{repositoryId}",
        "tags": [
            "repository-ws"
        ],
        "summary": "",
        "pathParams": [
            "repositoryId"
        ],
        "queryParams": [],
        "hasBody": false
    },
    "updateRepository": {
        "operationId": "updateRepository",
        "method": "PATCH",
        "path": "/api/repositories/{repositoryId}",
        "tags": [
            "repository-ws"
        ],
        "summary": "",
        "pathParams": [
            "repositoryId"
        ],
        "queryParams": [],
        "hasBody": true
    },
    "isSessionActive": {
        "operationId": "isSessionActive",
        "method": "GET",
        "path": "/api/users/session",
        "tags": [
            "user-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": false
    },
    "getCurrentUser": {
        "operationId": "getCurrentUser",
        "method": "GET",
        "path": "/api/users/me",
        "tags": [
            "user-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": false
    },
    "getTextUnitHistory": {
        "operationId": "getTextUnitHistory",
        "method": "GET",
        "path": "/api/textunits/{tmTextUnitId}/history",
        "tags": [
            "text-unit-ws"
        ],
        "summary": "",
        "pathParams": [
            "tmTextUnitId"
        ],
        "queryParams": [
            {
                "name": "bcp47Tag",
                "required": true,
                "isPageable": false
            }
        ],
        "hasBody": false
    },
    "searchTextUnitsHybridGetResults": {
        "operationId": "searchTextUnitsHybridGetResults",
        "method": "GET",
        "path": "/api/textunits/search-hybrid/results/{requestId}",
        "tags": [
            "text-unit-ws"
        ],
        "summary": "",
        "pathParams": [
            "requestId"
        ],
        "queryParams": [],
        "hasBody": false
    },
    "getGitBlameWithUsages": {
        "operationId": "getGitBlameWithUsages",
        "method": "GET",
        "path": "/api/textunits/gitBlameWithUsages",
        "tags": [
            "text-unit-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [
            {
                "name": "repositoryIds[]",
                "required": false,
                "isPageable": false
            },
            {
                "name": "repositoryNames[]",
                "required": false,
                "isPageable": false
            },
            {
                "name": "tmTextUnitId",
                "required": false,
                "isPageable": false
            },
            {
                "name": "usedFilter",
                "required": false,
                "isPageable": false
            },
            {
                "name": "statusFilter",
                "required": false,
                "isPageable": false
            },
            {
                "name": "doNotTranslateFilter",
                "required": false,
                "isPageable": false
            },
            {
                "name": "limit",
                "required": false,
                "isPageable": false
            },
            {
                "name": "offset",
                "required": false,
                "isPageable": false
            }
        ],
        "hasBody": false
    },
    "getTextUnitsCount": {
        "operationId": "getTextUnitsCount",
        "method": "GET",
        "path": "/api/textunits/count",
        "tags": [
            "text-unit-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [
            {
                "name": "textUnitSearchBody",
                "required": true,
                "isPageable": false
            }
        ],
        "hasBody": false
    },
    "getBranchesOfRepository": {
        "operationId": "getBranchesOfRepository",
        "method": "GET",
        "path": "/api/repositories/{repositoryId}/branches",
        "tags": [
            "repository-ws"
        ],
        "summary": "",
        "pathParams": [
            "repositoryId"
        ],
        "queryParams": [
            {
                "name": "name",
                "required": false,
                "isPageable": false
            },
            {
                "name": "deleted",
                "required": false,
                "isPageable": false
            },
            {
                "name": "translated",
                "required": false,
                "isPageable": false
            },
            {
                "name": "createdBefore",
                "required": false,
                "isPageable": false
            }
        ],
        "hasBody": false
    },
    "deleteBranch": {
        "operationId": "deleteBranch",
        "method": "DELETE",
        "path": "/api/repositories/{repositoryId}/branches",
        "tags": [
            "repository-ws"
        ],
        "summary": "",
        "pathParams": [
            "repositoryId"
        ],
        "queryParams": [
            {
                "name": "branchId",
                "required": true,
                "isPageable": false
            }
        ],
        "hasBody": false
    },
    "getAllDynamicJobs": {
        "operationId": "getAllDynamicJobs",
        "method": "GET",
        "path": "/api/quartz/jobs/dynamic",
        "tags": [
            "quartz-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": false
    },
    "deleteAllDynamicJobs": {
        "operationId": "deleteAllDynamicJobs",
        "method": "DELETE",
        "path": "/api/quartz/jobs/dynamic",
        "tags": [
            "quartz-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": false
    },
    "aiTranslateReport": {
        "operationId": "aiTranslateReport",
        "method": "GET",
        "path": "/api/proto-ai-translate/report/{pollableTaskId}",
        "tags": [
            "ai-translate-ws"
        ],
        "summary": "",
        "pathParams": [
            "pollableTaskId"
        ],
        "queryParams": [],
        "hasBody": false
    },
    "aiTranslateReportLocale": {
        "operationId": "aiTranslateReportLocale",
        "method": "GET",
        "path": "/api/proto-ai-translate/report/{pollableTaskId}/locale/{bcp47Tag}",
        "tags": [
            "ai-translate-ws"
        ],
        "summary": "",
        "pathParams": [
            "pollableTaskId",
            "bcp47Tag"
        ],
        "queryParams": [],
        "hasBody": false
    },
    "getAiReviewForSingleTextUnit": {
        "operationId": "getAiReviewForSingleTextUnit",
        "method": "GET",
        "path": "/api/proto-ai-review-single-text-unit",
        "tags": [
            "ai-review-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [
            {
                "name": "protoAiReviewSingleTextUnitRequest",
                "required": true,
                "isPageable": false
            }
        ],
        "hasBody": false
    },
    "getPollableTaskById": {
        "operationId": "getPollableTaskById",
        "method": "GET",
        "path": "/api/pollableTasks/{pollableTaskId}",
        "tags": [
            "pollable-task-ws"
        ],
        "summary": "",
        "pathParams": [
            "pollableTaskId"
        ],
        "queryParams": [],
        "hasBody": false
    },
    "getPollableTaskOutput": {
        "operationId": "getPollableTaskOutput",
        "method": "GET",
        "path": "/api/pollableTasks/{pollableTaskId}/output",
        "tags": [
            "pollable-task-ws"
        ],
        "summary": "",
        "pathParams": [
            "pollableTaskId"
        ],
        "queryParams": [],
        "hasBody": false
    },
    "getPollableTaskInput": {
        "operationId": "getPollableTaskInput",
        "method": "GET",
        "path": "/api/pollableTasks/{pollableTaskId}/input",
        "tags": [
            "pollable-task-ws"
        ],
        "summary": "",
        "pathParams": [
            "pollableTaskId"
        ],
        "queryParams": [],
        "hasBody": false
    },
    "getDatabaseLatency": {
        "operationId": "getDatabaseLatency",
        "method": "GET",
        "path": "/api/monitoring/db",
        "tags": [
            "db-monitoring-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [
            {
                "name": "iterations",
                "required": false,
                "isPageable": false
            }
        ],
        "hasBody": false
    },
    "getMachineTranslationConfiguration": {
        "operationId": "getMachineTranslationConfiguration",
        "method": "GET",
        "path": "/api/machine-translation/config",
        "tags": [
            "machine-translation-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": false
    },
    "getLocales": {
        "operationId": "getLocales",
        "method": "GET",
        "path": "/api/locales",
        "tags": [
            "locale-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [
            {
                "name": "bcp47Tag",
                "required": false,
                "isPageable": false
            }
        ],
        "hasBody": false
    },
    "getDrops": {
        "operationId": "getDrops",
        "method": "GET",
        "path": "/api/drops",
        "tags": [
            "drop-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [
            {
                "name": "repositoryId",
                "required": false,
                "isPageable": false
            },
            {
                "name": "imported",
                "required": false,
                "isPageable": false
            },
            {
                "name": "canceled",
                "required": false,
                "isPageable": false
            },
            {
                "name": "pageable",
                "required": true,
                "isPageable": true
            }
        ],
        "hasBody": false
    },
    "getDeltasForRuns": {
        "operationId": "getDeltasForRuns",
        "method": "GET",
        "path": "/api/deltas/state",
        "tags": [
            "delta-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [
            {
                "name": "repositoryId",
                "required": true,
                "isPageable": false
            },
            {
                "name": "pushRunIds",
                "required": true,
                "isPageable": false
            },
            {
                "name": "bcp47Tags",
                "required": false,
                "isPageable": false
            },
            {
                "name": "pullRunIds",
                "required": false,
                "isPageable": false
            }
        ],
        "hasBody": false
    },
    "getDeltasFromDate": {
        "operationId": "getDeltasFromDate",
        "method": "GET",
        "path": "/api/deltas/date",
        "tags": [
            "delta-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [
            {
                "name": "repositoryId",
                "required": true,
                "isPageable": false
            },
            {
                "name": "bcp47Tags",
                "required": false,
                "isPageable": false
            },
            {
                "name": "fromDate",
                "required": false,
                "isPageable": false
            },
            {
                "name": "toDate",
                "required": false,
                "isPageable": false
            },
            {
                "name": "pageable",
                "required": true,
                "isPageable": true
            }
        ],
        "hasBody": false
    },
    "getCsrfToken": {
        "operationId": "getCsrfToken",
        "method": "GET",
        "path": "/api/csrf-token",
        "tags": [
            "csrf-token-controller"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [],
        "hasBody": false
    },
    "getCommitsDetailed": {
        "operationId": "getCommitsDetailed",
        "method": "GET",
        "path": "/api/commits/detailed",
        "tags": [
            "commit-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [
            {
                "name": "repositoryId",
                "required": true,
                "isPageable": false
            },
            {
                "name": "commitNames",
                "required": false,
                "isPageable": false
            },
            {
                "name": "pushRunName",
                "required": false,
                "isPageable": false
            },
            {
                "name": "pullRunName",
                "required": false,
                "isPageable": false
            },
            {
                "name": "hasPushRun",
                "required": false,
                "isPageable": false
            },
            {
                "name": "hasPullRun",
                "required": false,
                "isPageable": false
            },
            {
                "name": "pageable",
                "required": true,
                "isPageable": true
            }
        ],
        "hasBody": false
    },
    "getClob": {
        "operationId": "getClob",
        "method": "GET",
        "path": "/api/clobstorage/{uuid}",
        "tags": [
            "clob-storage-ws"
        ],
        "summary": "",
        "pathParams": [
            "uuid"
        ],
        "queryParams": [],
        "hasBody": false
    },
    "getBranchesOfRepository_1": {
        "operationId": "getBranchesOfRepository_1",
        "method": "GET",
        "path": "/api/branchStatistics",
        "tags": [
            "branch-statistic-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [
            {
                "name": "createdByUserName",
                "required": false,
                "isPageable": false
            },
            {
                "name": "branchId",
                "required": false,
                "isPageable": false
            },
            {
                "name": "branchName",
                "required": false,
                "isPageable": false
            },
            {
                "name": "search",
                "required": false,
                "isPageable": false
            },
            {
                "name": "deleted",
                "required": false,
                "isPageable": false
            },
            {
                "name": "empty",
                "required": false,
                "isPageable": false
            },
            {
                "name": "totalCountLte",
                "required": false,
                "isPageable": false
            },
            {
                "name": "createdBefore",
                "required": false,
                "isPageable": false
            },
            {
                "name": "createdAfter",
                "required": false,
                "isPageable": false
            },
            {
                "name": "pageable",
                "required": true,
                "isPageable": true
            }
        ],
        "hasBody": false
    },
    "xliffExport": {
        "operationId": "xliffExport",
        "method": "GET",
        "path": "/api/assets/{assetId}/xliffExport/{tmXliffId}",
        "tags": [
            "asset-ws"
        ],
        "summary": "",
        "pathParams": [
            "assetId",
            "tmXliffId"
        ],
        "queryParams": [],
        "hasBody": false
    },
    "getAssetIds": {
        "operationId": "getAssetIds",
        "method": "GET",
        "path": "/api/assets/ids",
        "tags": [
            "asset-ws"
        ],
        "summary": "",
        "pathParams": [],
        "queryParams": [
            {
                "name": "repositoryId",
                "required": true,
                "isPageable": false
            },
            {
                "name": "deleted",
                "required": false,
                "isPageable": false
            },
            {
                "name": "virtual",
                "required": false,
                "isPageable": false
            },
            {
                "name": "branchId",
                "required": false,
                "isPageable": false
            }
        ],
        "hasBody": false
    },
    "getAssetTextUnitUsages": {
        "operationId": "getAssetTextUnitUsages",
        "method": "GET",
        "path": "/api/assetTextUnits/{assetTextUnitId}/usages",
        "tags": [
            "text-unit-ws"
        ],
        "summary": "",
        "pathParams": [
            "assetTextUnitId"
        ],
        "queryParams": [],
        "hasBody": false
    },
    "deleteTMTextUnitCurrentVariant": {
        "operationId": "deleteTMTextUnitCurrentVariant",
        "method": "DELETE",
        "path": "/api/textunits/{textUnitId}",
        "tags": [
            "text-unit-ws"
        ],
        "summary": "",
        "pathParams": [
            "textUnitId"
        ],
        "queryParams": [],
        "hasBody": false
    },
    "deleteAssetById": {
        "operationId": "deleteAssetById",
        "method": "DELETE",
        "path": "/api/assets/{assetId}",
        "tags": [
            "asset-ws"
        ],
        "summary": "",
        "pathParams": [
            "assetId"
        ],
        "queryParams": [],
        "hasBody": false
    }
} as const;
