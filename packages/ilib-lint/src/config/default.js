/*
 * default.js - default configuration of the linter
 *
 * Copyright © 2023-2024 JEDLSoft
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
/** @ignore @typedef {import("./Configuration.js").Configuration} Configuration */

export const /** @type {Configuration} */ defaultConfiguration = {
        name: "ilib-lint",
        // top 27 locales on the internet by volume
        locales: [
            "en-AU",
            "en-CA",
            "en-GB",
            "en-IN",
            "en-NG",
            "en-PH",
            "en-PK",
            "en-US",
            "en-ZA",
            "de-DE",
            "fr-CA",
            "fr-FR",
            "es-AR",
            "es-ES",
            "es-MX",
            "id-ID",
            "it-IT",
            "ja-JP",
            "ko-KR",
            "pt-BR",
            "ru-RU",
            "tr-TR",
            "vi-VN",
            "zh-Hans-CN",
            "zh-Hant-HK",
            "zh-Hant-TW",
            "zh-Hans-SG"
        ],
        filetypes: {
            // @ts-ignore TODO fix missing required property "template"
            xliff: {
                ruleset: "resource-check-all"
            }
        },
        paths: {
            "**/*.xliff": "xliff"
        },
        excludes: [
            "**/.git",
            "**/node_modules",
            "**/.svn",
            "package.json",
            "package-lock.json"
        ],
        autofix: false
    };

export default defaultConfiguration;
