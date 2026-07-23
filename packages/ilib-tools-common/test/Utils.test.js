/*
 * Utils.test.js - test the utility functions
 *
 * Copyright © 2022-2023, 2025-2026 JEDLSoft
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

import fs from 'fs';
import semver from 'semver';
import Locale from 'ilib-locale';
import {
    formatLocaleParams,
    formatPath,
    parsePath,
    getLocaleFromPath,
    cleanString,
    isEmpty,
    makeDirs,
    containsActualText,
    objectMap,
    hashKey,
    nonBreakingTags,
    selfClosingTags,
    ignoreTags,
    localizableAttributes,
    getLanguagePluralCategories
} from "../src/index.js";

/**
 * @private
 */
function rmr(pathName) {
    if (semver.gte(process.version, 'v14.4.0')) {
        fs.rmSync(pathName, {recursive: true, force: true});
    } else {
        fs.rmdirSync(pathName, {recursive: true});
    }
}

describe("testUtils", () => {
    test("UtilsIsEmpty", () => {
        expect.assertions(1);

        expect(isEmpty({})).toBeTruthy();
    });

    test("UtilsIsEmptyNot", () => {
        expect.assertions(1);

        expect(!isEmpty({a: "a"})).toBeTruthy();
    });

    test("UtilsIsEmptyUndefined", () => {
        expect.assertions(1);

        expect(isEmpty()).toBeTruthy();
    });

    test("UtilsIsEmptyNull", () => {
        expect.assertions(1);

        expect(isEmpty(null)).toBeTruthy();
    });

    test("UtilsIsEmptyNumber", () => {
        expect.assertions(1);

        expect(isEmpty(2)).toBeTruthy();
    });

    test("UtilsIsEmptyArray", () => {
        expect.assertions(1);

        expect(!isEmpty(["a", "b"])).toBeTruthy();
    });

    test("UtilsIsEmptyArray2", () => {
        expect.assertions(1);

        expect(isEmpty([])).toBeTruthy();
    });

    test("UtilsCleanString", () => {
        expect.assertions(1);

        expect(cleanString(' \n \t \\    &quot;a    b&apos;s &lt;b&gt;&amp; c’s     ')).toBe("\"a b's <b>& c's");
    });

    test("UtilsCleanStringBadInput", () => {
        expect.assertions(6);

        expect(cleanString('')).toBe('');
        expect(!cleanString(null)).toBeTruthy();
        expect(!cleanString(undefined)).toBeTruthy();
        expect(!cleanString(345)).toBeTruthy();
        expect(!cleanString(true)).toBeTruthy();
        expect(!cleanString({'obj': 'foo'})).toBeTruthy();
    });

    test("FormatLocaleParamsLocale", () => {
        expect.assertions(1);

        expect(formatLocaleParams('[locale]', "de-DE")).toBe("de-DE");
    });

    test("FormatLocaleParamsLanguage", () => {
        expect.assertions(1);

        expect(formatLocaleParams('[language]', "de-DE")).toBe("de");
    });

    test("FormatLocaleParamsScript", () => {
        expect.assertions(1);

        expect(formatLocaleParams('[script]', "zh-Hans-CN")).toBe("Hans");
    });

    test("FormatLocaleParamsScriptNotThere", () => {
        expect.assertions(1);

        expect(formatLocaleParams('[script]', "de-DE")).toBe("");
    });

    test("FormatLocaleParamsRegion", () => {
        expect.assertions(1);

        expect(formatLocaleParams('[region]', "de-DE")).toBe("DE");
    });

    test("FormatLocaleParamsRegionNotThere", () => {
        expect.assertions(1);

        expect(formatLocaleParams('[region]', "de")).toBe("");
    });

    test("FormatLocaleParamsLocaleDir", () => {
        expect.assertions(1);

        expect(formatLocaleParams('[localeDir]', "zh-Hans-CN")).toBe("zh/Hans/CN");
    });

    test("FormatLocaleParamsLocaleUnder", () => {
        expect.assertions(1);

        expect(formatLocaleParams('[localeUnder]', "zh-Hans-CN")).toBe("zh_Hans_CN");
    });

    test("FormatLocaleParamsLocaleLower", () => {
        expect.assertions(1);

        expect(formatLocaleParams('[localeLower]', "zh-Hans-CN")).toBe("zh-hans-cn");
    });

    test("FormatLocaleParamsMultiple", () => {
        expect.assertions(1);

        expect(formatLocaleParams('strings_[language]_[region].json', "de-DE")).toBe("strings_de_DE.json");
    });

    test("FormatLocaleParamsPreservesUnknownKeywords", () => {
        expect.assertions(1);

        expect(formatLocaleParams('[dir]/[locale]/strings.json', "de-DE")).toBe("[dir]/de-DE/strings.json");
    });

    test("FormatLocaleParamsEmptyTemplate", () => {
        expect.assertions(1);

        expect(formatLocaleParams('', "de-DE")).toBe("");
    });

    test("FormatLocaleParamsUndefinedTemplate", () => {
        expect.assertions(1);

        expect(formatLocaleParams(undefined, "de-DE")).toBe("");
    });

    test("FormatLocaleParamsPreservesDoubleSlashes", () => {
        expect.assertions(1);

        // This is the critical test - double slashes in comments should be preserved
        expect(formatLocaleParams('// This is a comment for [locale]\nexport default ', "de-DE")).toBe("// This is a comment for de-DE\nexport default ");
    });

    test("FormatLocaleParamsWithHeader", () => {
        expect.assertions(1);

        const header = "// This is a generated file. DO NOT MODIFY BY HAND\nexport default ";
        expect(formatLocaleParams(header, "de-DE")).toBe("// This is a generated file. DO NOT MODIFY BY HAND\nexport default ");
    });

    test("FormatLocaleParamsWithLocaleObject", () => {
        expect.assertions(1);

        // Test that Locale objects are accepted as well as strings
        const l = new Locale("fr-CA");
        expect(formatLocaleParams('strings_[locale].json', l)).toBe("strings_fr-CA.json");
    });

    test("FormatLocaleParamsLanguageMissing", () => {
        expect.assertions(1);

        // "DE" is a region only, no language
        expect(formatLocaleParams('[language]/strings.json', "DE")).toBe("/strings.json");
    });

    test("FormatLocaleParamsRegionMissing", () => {
        expect.assertions(1);

        // "de" is a language only, no region
        expect(formatLocaleParams('[region]/strings.json', "de")).toBe("/strings.json");
    });

    test("FormatLocaleParamsScriptMissing", () => {
        expect.assertions(1);

        // "zh-CN" has no script
        expect(formatLocaleParams('[script]/strings.json', "zh-CN")).toBe("/strings.json");
    });

    test("GetLocalizedPathLocaleDir", () => {
        expect.assertions(1);

        expect(formatPath('resources/[localeDir]/strings.json', {
            sourcepath: "x/y/strings.json",
            locale: "de-DE"
        })).toBe("resources/de/DE/strings.json");
    });

    test("GetLocalizedPathDir", () => {
        expect.assertions(1);

        expect(formatPath('[dir]/[localeDir]/strings.json', {
            sourcepath: "x/y/strings.json",
            locale: "de-DE"
        })).toBe("x/y/de/DE/strings.json");
    });

    test("GetLocalizedPathBasename", () => {
        expect.assertions(1);

        expect(formatPath('[localeDir]/tr-[basename].j', {
            sourcepath: "x/y/strings.json",
            locale: "de-DE"
        })).toBe("de/DE/tr-strings.j");
    });

    test("GetLocalizedPathBasenameAlternateExtension", () => {
        expect.assertions(1);

        expect(formatPath('[localeDir]/tr-[basename].j', {
            sourcepath: "x/y/strings.md",
            locale: "de-DE"
        })).toBe("de/DE/tr-strings.j");
    });

    test("GetLocalizedPathFilename", () => {
        expect.assertions(1);

        expect(formatPath('[localeDir]/tr-[filename]', {
            sourcepath: "x/y/strings.json",
            locale: "de-DE"
        })).toBe("de/DE/tr-strings.json");
    });

    test("GetLocalizedPathExtension", () => {
        expect.assertions(1);

        expect(formatPath('[localeDir]/tr-foobar.[extension]', {
            sourcepath: "x/y/strings.jsn",
            locale: "de-DE"
        })).toBe("de/DE/tr-foobar.jsn");
    });

    test("GetLocalizedPathExtensionNotThere", () => {
        expect.assertions(1);

        expect(formatPath('[localeDir]/tr-foobar.[extension]', {
            sourcepath: "x/y/strings",
            locale: "de-DE"
        })).toBe("de/DE/tr-foobar.");
    });

    test("GetLocalizedPathLocale", () => {
        expect.assertions(1);

        expect(formatPath('[dir]/[locale]/strings.json', {
            sourcepath: "x/y/strings.json",
            locale: "de-DE"
        })).toBe("x/y/de-DE/strings.json");
    });

    test("GetLocalizedPathLanguage", () => {
        expect.assertions(1);

        expect(formatPath('[dir]/[language]/strings.json', {
            sourcepath: "x/y/strings.json",
            locale: "de-DE"
        })).toBe("x/y/de/strings.json");
    });

    test("GetLocalizedPathLanguageNotThere", () => {
        expect.assertions(1);

        expect(formatPath('[dir]/[language]/strings.json', {
            sourcepath: "x/y/strings.json",
            locale: "DE"
        })).toBe("x/y/strings.json");
    });

    test("GetLocalizedPathRegion", () => {
        expect.assertions(1);

        expect(formatPath('[dir]/[region]/strings.json', {
            sourcepath: "x/y/strings.json",
            locale: "de-DE"
        })).toBe("x/y/DE/strings.json");
    });

    test("GetLocalizedPathRegionNotThere", () => {
        expect.assertions(1);

        expect(formatPath('[dir]/[region]/strings.json', {
            sourcepath: "x/y/strings.json",
            locale: "de"
        })).toBe("x/y/strings.json");
    });

    test("GetLocalizedPathScript", () => {
        expect.assertions(1);

        expect(formatPath('[dir]/[script]/strings.json', {
            sourcepath: "x/y/strings.json",
            locale: "zh-Hans-CN"
        })).toBe("x/y/Hans/strings.json");
    });

    test("GetLocalizedPathScriptNotThere", () => {
        expect.assertions(1);

        expect(formatPath('[dir]/[script]/strings.json', {
            sourcepath: "x/y/strings.json",
            locale: "zh-CN"
        })).toBe("x/y/strings.json");
    });

    test("GetLocalizedPathLocaleUnder", () => {
        expect.assertions(1);

        expect(formatPath('[dir]/strings_[localeUnder].json', {
            sourcepath: "x/y/strings.json",
            locale: "zh-Hans-CN"
        })).toBe("x/y/strings_zh_Hans_CN.json");
    });

    test("GetLocalizedPathLocaleLower", () => {
        expect.assertions(1);

        expect(formatPath('[dir]/strings_[localeLower].json', {
            sourcepath: "x/y/strings.json",
            locale: "zh-Hans-CN"
        })).toBe("x/y/strings_zh-hans-cn.json");
    });

    test("GetLocalizedPathResourceDir", () => {
        expect.assertions(1);

        expect(formatPath('[resourceDir]/[locale]/strings.json', {
            sourcepath: "x/y/strings.json",
            locale: "de-DE",
            resourceDir: "resources"
        })).toBe("resources/de-DE/strings.json");
    });

    test("GetLocalizedPathResourceDirWithLocaleDir", () => {
        expect.assertions(1);

        expect(formatPath('[resourceDir]/[localeDir]/[filename]', {
            sourcepath: "src/strings.json",
            locale: "zh-Hans-CN",
            resourceDir: "i18n"
        })).toBe("i18n/zh/Hans/CN/strings.json");
    });

    test("GetLocalizedPathResourceDirNotProvided", () => {
        expect.assertions(1);

        // When resourceDir is not provided, it defaults to "."
        expect(formatPath('[resourceDir]/[locale]/strings.json', {
            sourcepath: "x/y/strings.json",
            locale: "de-DE"
        })).toBe("de-DE/strings.json");
    });

    test("GetLocalizedPathResourceDirMultiple", () => {
        expect.assertions(1);

        // Multiple occurrences of [resourceDir] should all be replaced
        expect(formatPath('[resourceDir]/[locale]/[resourceDir]/strings.json', {
            sourcepath: "x/y/strings.json",
            locale: "de-DE",
            resourceDir: "res"
        })).toBe("res/de-DE/res/strings.json");
    });

    test("GetLocalizedPathBasenameNoExtension", () => {
        expect.assertions(1);

        // Files without extensions should return the full filename for [basename]
        expect(formatPath('[dir]/[basename]_[locale]', {
            sourcepath: "x/y/Makefile",
            locale: "de-DE"
        })).toBe("x/y/Makefile_de-DE");
    });

    describe("parsePath fills partial results when template does not match", () => {
        // When the source path has no locale (e.g. guides.xliff, messages.properties),
        // but the template expects a locale, then parsePath cannot fully match the template.
        // It should still fill dir, basename, extension, filename from the path so the caller can pass
        // them to formatPath.
        test("returns dir basename extension for guides.xliff when template expects locale", () => {
            expect.assertions(1);

            const actual = parsePath('[dir]/[basename]_[locale].[extension]', "l10n/xliff/guides.xliff");
            expect(actual).toStrictEqual({
                dir: "l10n/xliff",
                basename: "guides",
                extension: "xliff",
                filename: "guides.xliff"
            });
        });

        test("returns dir basename extension for messages.properties-style path", () => {
            expect.assertions(1);

            const actual = parsePath('[dir]/[basename]_[locale].[extension]', "src/main/resources/messages.properties");
            expect(actual).toStrictEqual({
                dir: "src/main/resources",
                basename: "messages",
                extension: "properties",
                filename: "messages.properties"
            });
        });

        test("returns partial results for nested path without locale", () => {
            expect.assertions(1);

            const actual = parsePath('[dir]/[basename]_[locale].xliff', "a/b/c/guides.xliff");
            expect(actual).toStrictEqual({
                dir: "a/b/c",
                basename: "guides",
                extension: "xliff",
                filename: "guides.xliff"
            });
        });

        test("returns partial results for file at root", () => {
            expect.assertions(1);

            const actual = parsePath('[dir]/[basename]_[locale].[extension]', "guides.xliff");
            expect(actual).toStrictEqual({
                dir: ".",
                basename: "guides",
                extension: "xliff",
                filename: "guides.xliff"
            });
        });

        test("returns dir basename extension for [language]/[dir]/[basename].[extension] template", () => {
            expect.assertions(1);

            // Template has locale (language) at start; path has no locale
            const actual = parsePath('[language]/[dir]/[basename].[extension]', "guides/l10n/using-ai.md");
            expect(actual).toStrictEqual({
                dir: "guides/l10n",
                basename: "using-ai",
                extension: "md",
                filename: "using-ai.md"
            });
        });

        test("returns partial results for [language]/[dir]/[basename].[extension] with nested path", () => {
            expect.assertions(1);

            const actual = parsePath('[language]/[dir]/[basename].[extension]', "en/docs/guides/getting-started.mdx");
            expect(actual).toStrictEqual({
                language: "en",
                dir: "docs/guides",
                basename: "getting-started",
                extension: "mdx"
            });
        });

        test("parses [language]/[dir]/[basename].[extension] with multi-dot filename (basename.locale.extension)", () => {
            expect.assertions(1);

            // Filename "getting-started.en-US.mdx" has multiple dots; extension is after last dot
            const actual = parsePath('[language]/[dir]/[basename].[extension]', "en/docs/guides/getting-started.en-US.mdx");
            expect(actual).toStrictEqual({
                language: "en",
                dir: "docs/guides",
                basename: "getting-started.en-US",
                extension: "mdx"
            });
        });

        test("parses [dir]/[basename].[locale].[extension] with multi-dot filename (basename.locale.extension)", () => {
            expect.assertions(1);

            // Filename "getting-started.en-US.mdx" has multiple dots; extension is after last dot
            // the fr-FR is thrown in there at the beginning of the path to try and fool the parser into thinking it's a locale.
            const actual = parsePath('[dir]/[basename].[locale].[extension]', "fr-FR/docs/guides/getting-started.en-US.mdx");
            expect(actual).toStrictEqual({
                locale: "en-US",
                language: "en",
                region: "US",
                dir: "fr-FR/docs/guides",
                basename: "getting-started",
                extension: "mdx"
            });
        });

    });

    describe("parsePath uses source locale when no locale in path", () => {
        // When template does not match (or match has no locale), use sourceLocale to fill
        // locale, language, script, region. Use Locale class to parse source locale.
        test("fills locale parts from sourceLocale for guides.xliff", () => {
            expect.assertions(1);

            const actual = parsePath('[dir]/[basename]_[locale].[extension]', "l10n/xliff/guides.xliff", "en-US");
            expect(actual).toStrictEqual({
                dir: "l10n/xliff",
                basename: "guides",
                extension: "xliff",
                filename: "guides.xliff",
                locale: "en-US",
                language: "en",
                region: "US"
            });
        });

        test("fills locale script from sourceLocale for zh-Hans-CN", () => {
            expect.assertions(1);

            const actual = parsePath('[dir]/[basename]_[locale].[extension]', "docs/readme.md", "zh-Hans-CN");
            expect(actual).toStrictEqual({
                dir: "docs",
                basename: "readme",
                extension: "md",
                filename: "readme.md",
                locale: "zh-Hans-CN",
                language: "zh",
                script: "Hans",
                region: "CN"
            });
        });

        test("fills locale parts for [language]/[dir]/[basename].[extension] with sourceLocale", () => {
            expect.assertions(1);

            const actual = parsePath('[language]/[dir]/[basename].[extension]', "guides/l10n/using-ai.md", "en-US");
            expect(actual).toStrictEqual({
                dir: "guides/l10n",
                basename: "using-ai",
                extension: "md",
                filename: "using-ai.md",
                locale: "en-US",
                language: "en",
                region: "US"
            });
        });
    });

    describe("formatPath with parts from parsePath (caller passes parts, not sourcepath)", () => {
        // Caller uses parsePath to get parts, then passes them to formatPath.
        // formatPath does not call parsePath; it uses the provided parts.
        test("produces localized path from parsePath parts for guides.xliff", () => {
            expect.assertions(1);

            const parsed = parsePath('[dir]/[basename]_[locale].[extension]', "l10n/xliff/guides.xliff");
            expect(formatPath('[dir]/[basename]_[locale].[extension]', {
                ...parsed,
                locale: "de"
            })).toBe("l10n/xliff/guides_de.xliff");
        });

        test("produces localized path for messages.properties-style", () => {
            expect.assertions(1);

            const parsed = parsePath('[dir]/[basename]_[locale].[extension]', "src/main/resources/messages.properties");
            expect(formatPath('[dir]/[basename]_[locale].[extension]', {
                ...parsed,
                locale: "fr-FR"
            })).toBe("src/main/resources/messages_fr-FR.properties");
        });

        test("produces localized path for nested path", () => {
            expect.assertions(1);

            const parsed = parsePath('[dir]/[basename]_[locale].xliff', "a/b/c/guides.xliff");
            expect(formatPath('[dir]/[basename]_[locale].xliff', {
                ...parsed,
                locale: "pl-PL"
            })).toBe("a/b/c/guides_pl-PL.xliff");
        });

        test("produces localized path for file at root", () => {
            expect.assertions(1);

            const parsed = parsePath('[dir]/[basename]_[locale].[extension]', "guides.xliff");
            expect(formatPath('[dir]/[basename]_[locale].[extension]', {
                ...parsed,
                locale: "ja"
            })).toBe("guides_ja.xliff");
        });

        test("produces path without trailing dot when extension is empty", () => {
            expect.assertions(1);

            // Path "asdf/bar/simple" has no extension; [basename].[extension] should not produce "simple."
            expect(formatPath('[locale]/[dir]/[basename].[extension]', {
                sourcepath: "asdf/bar/simple",
                locale: "fr-FR"
            })).toBe("fr-FR/asdf/bar/simple");
        });

        test("produces localized path for [language]/[dir]/[basename].[extension] template", () => {
            expect.assertions(1);

            const parsed = parsePath('[language]/[dir]/[basename].[extension]', "guides/l10n/using-ai.md", "en-US");
            expect(formatPath('[language]/[dir]/[basename].[extension]', {
                ...parsed,
                locale: "de"
            })).toBe("de/guides/l10n/using-ai.md");
        });

        test("produces localized path for [language]/[dir]/[basename].[extension] with full locale", () => {
            expect.assertions(1);

            const parsed = parsePath('[language]/[dir]/[basename].[extension]', "en/docs/guides/getting-started.mdx", "en-US");
            expect(formatPath('[language]/[dir]/[basename].[extension]', {
                ...parsed,
                locale: "zh-Hans-CN"
            })).toBe("zh/docs/guides/getting-started.mdx");
        });
    });

    test("ParsePath", () => {
        expect.assertions(1);

        const actual = parsePath('[dir]/[basename]_[locale].[extension].foo', "x/y/strings_de-DE.json.foo");
        const expected = {
            dir: "x/y",
            basename: "strings",
            locale: "de-DE",
            language: "de",
            region: "DE",
            extension: "json"
        };
        expect(actual).toStrictEqual(expected);
    });

    test("ParsePathPartialMatch", () => {
        expect.assertions(1);

        const actual = parsePath('[dir]/[basename]_en-US.[extension]', "x/y/strings_en-US.json");
        const expected = {
            dir: "x/y",
            basename: "strings",
            extension: "json"
        };
        expect(actual).toStrictEqual(expected);
    });

    test("ParsePathNoMatch", () => {
        expect.assertions(1);

        // missing the underscore - template expects [basename]_en-US, path has "en-US.json"
        // parsePath fills partial results (dir, basename, extension, filename) from path
        const actual = parsePath('[dir]/[basename]_en-US.[extension]', "x/y/en-US.json");
        expect(actual).toStrictEqual({
            dir: "x/y",
            basename: "en-US",
            extension: "json",
            filename: "en-US.json"
        });
    });

    test("GetLocaleFromPathDir", () => {
        expect.assertions(1);

        expect(getLocaleFromPath('[dir]/strings.json', "x/y/strings.json")).toBe("");
    });

    test("GetLocaleFromPathBasename", () => {
        expect.assertions(1);

        expect(getLocaleFromPath('[dir]/[basename].json', "x/y/strings.json")).toBe("");
    });

    test("GetLocaleFromPathBasenameAlternateExtension", () => {
        expect.assertions(1);

        expect(getLocaleFromPath('[dir]/[basename].md', "x/y/strings.md")).toBe("");
    });

    test("GetLocaleFromPathBasenameWithLocaleDir", () => {
        expect.assertions(1);

        expect(getLocaleFromPath('[dir]/[locale]/[basename].json', "x/y/zh-Hans-CN/strings.json")).toBe("zh-Hans-CN");
    });

    test("GetLocaleFromPathBasenameWithLocaleAlternateExtension", () => {
        expect.assertions(1);

        expect(getLocaleFromPath('[dir]/[locale]/[basename].md', "x/y/de-DE/strings.md")).toBe("de-DE");
    });

    test("GetLocaleFromPathBasenameAndLocaleTogether1", () => {
        expect.assertions(1);

        expect(getLocaleFromPath('[dir]/[basename]_[locale].[extension]', "x/y/strings_de-DE.json")).toBe("de-DE");
    });

    test("GetLocaleFromPathBasenameAndLocaleTogether2", () => {
        expect.assertions(1);

        expect(getLocaleFromPath('[dir]/[basename]_[localeUnder].[extension]', "x/y/strings_de_DE.json")).toBe("de-DE");
    });

    test("GetLocaleFromPathBasenameAndLocaleTogetherWithHashLikeBasename language code only", () => {
        expect.assertions(1);

        // basename is a long alphanumeric ID (e.g. content hash), locale is short (e.g. fr)
        expect(getLocaleFromPath('[dir]/[basename]_[locale].[extension]', "l10n/xliff/guides/zJ14meSfAuIGNT7VDDzReXI8HM4_fr.xliff")).toBe("fr");
    });

    test("GetLocaleFromPathBasenameAndLocaleTogetherWithHashLikeBasename locale with region", () => {
        expect.assertions(1);

        // basename is a long alphanumeric ID (e.g. content hash), locale is short (e.g. fr)
        expect(getLocaleFromPath('[dir]/[basename]_[locale].[extension]', "l10n/xliff/guides/zJ14meSfAuIGNT7VDDzReXI8HM4_fr-FR.xliff")).toBe("fr-FR");
    });

    test("GetLocaleFromPathBasenameAndLocaleTogetherWithHashLikeBasename full locale", () => {
        expect.assertions(1);

        // basename is a long alphanumeric ID (e.g. content hash), locale is short (e.g. fr)
        expect(getLocaleFromPath('[dir]/[basename]_[locale].[extension]', "l10n/xliff/guides/zJ14meSfAuIGNT7VDDzReXI8HM4_zh-Hans-CN.xliff")).toBe("zh-Hans-CN");
    });


    test("GetLocaleFromPathFilename", () => {
        expect.assertions(1);

        expect(getLocaleFromPath('[dir]/[filename]', "x/y/strings.json")).toBe("");
    });

    test("GetLocaleFromPathLocale", () => {
        expect.assertions(1);

        expect(getLocaleFromPath('[dir]/[locale]/strings.json', "x/y/de-DE/strings.json")).toBe("de-DE");
    });

    test("GetLocaleFromPathLocaleLong", () => {
        expect.assertions(1);

        expect(getLocaleFromPath('[dir]/[locale]/strings.json', "x/y/zh-Hans-CN/strings.json")).toBe("zh-Hans-CN");
    });

    test("GetLocaleFromPathLocaleShort", () => {
        expect.assertions(1);

        expect(getLocaleFromPath('[dir]/[locale]/strings.json', "x/y/fr/strings.json")).toBe("fr");
    });

    test("GetLocaleFromPathLanguage", () => {
        expect.assertions(1);

        expect(getLocaleFromPath('[dir]/[language]/strings.json', "x/y/de/strings.json")).toBe("de");
    });

    test("GetLocaleFromPathScript", () => {
        expect.assertions(1);

        expect(getLocaleFromPath('[dir]/[language]-[script]/strings.json', "x/y/zh-Hans/strings.json")).toBe("zh-Hans");
    });

    test("GetLocaleFromPathRegion", () => {
        expect.assertions(1);

        expect(getLocaleFromPath('[dir]/[region]/strings.json', "x/y/JP/strings.json")).toBe("JP");
    });

    test("GetLocaleFromPathLocaleDir", () => {
        expect.assertions(1);

        expect(getLocaleFromPath('[dir]/[localeDir]/strings.json', "x/y/de/DE/strings.json")).toBe("de-DE");
    });

    test("GetLocaleFromPathLocaleDirShort", () => {
        expect.assertions(1);

        expect(getLocaleFromPath('[dir]/[localeDir]/strings.json', "x/y/de/strings.json")).toBe("de");
    });

    test("GetLocaleFromPathLocaleDirLong", () => {
        expect.assertions(1);

        expect(getLocaleFromPath('[dir]/[localeDir]/strings.json', "x/y/zh/Hans/CN/strings.json")).toBe("zh-Hans-CN");
    });

    test("GetLocaleFromPathLocaleDirStart", () => {
        expect.assertions(1);

        expect(getLocaleFromPath('[localeDir]/strings.json', "de/DE/strings.json")).toBe("de-DE");
    });

    test("GetLocaleFromPathLocaleUnder", () => {
        expect.assertions(1);

        expect(getLocaleFromPath('[dir]/strings_[localeUnder].json', "x/y/strings_de_DE.json")).toBe("de-DE");
    });

    test("GetLocaleFromPathLocaleUnderShort", () => {
        expect.assertions(1);

        expect(getLocaleFromPath('[dir]/strings_[localeUnder].json', "x/y/strings_de.json")).toBe("de");
    });

    test("GetLocaleFromPathLocaleUnderLong", () => {
        expect.assertions(1);

        expect(getLocaleFromPath('[dir]/strings_[localeUnder].json', "x/y/strings_zh_Hans_CN.json")).toBe("zh-Hans-CN");
    });

    test("GetLocaleFromPathLocaleLower", () => {
        expect.assertions(1);

        expect(getLocaleFromPath('[dir]/strings_[localeLower].json', "x/y/strings_de-de.json")).toBe("de-DE");
    });

    test("GetLocaleFromPathLocaleLowerShort", () => {
        expect.assertions(1);

        expect(getLocaleFromPath('[dir]/strings_[localeLower].json', "x/y/strings_de.json")).toBe("de");
    });

    test("GetLocaleFromPathLocaleLowerLong", () => {
        expect.assertions(1);

        expect(getLocaleFromPath('[dir]/strings_[localeLower].json', "x/y/strings_zh-hans-cn.json")).toBe("zh-Hans-CN");
    });

    test("GetLocaleFromPathLanguageTemplateWithNonLocaleDirectoryReturnsEmpty", () => {
        expect.assertions(2);
        // MDX-style template [language]/[dir]/[filename]: English at root, localized under ja/, etc.
        // When path is a source file at root (e.g. guides/ai-studio/index.mdx), the first segment
        // must not be mistaken for a language code. "guides" and "documentation" are too long
        // (language is 2-3 letters) so they must not match; without ^ anchor they could match
        // in the middle (e.g. "des" from "guides") and wrongly return a locale.
        expect(getLocaleFromPath("[language]/[dir]/[filename]", "guides/ai-studio/index.mdx")).toBe("");
        expect(getLocaleFromPath("[language]/[dir]/[filename]", "documentation/getting-started/page.mdx")).toBe("");
    });

    test("GetLocaleFromPathLocaleTemplateWithNonLocaleDirectoryReturnsEmpty", () => {
        expect.assertions(3);
        // [locale]/[dir]/[filename]: first segment must be a valid locale (e.g. en, de-DE), not a directory name.
        expect(getLocaleFromPath("[locale]/[dir]/[filename]", "guides/ai-studio/index.mdx")).toBe("");
        expect(getLocaleFromPath("[locale]/[dir]/[filename]", "content/faq/index.mdx")).toBe("");
        expect(getLocaleFromPath("[locale]/[dir]/[filename]", "samples/code/demo.mdx")).toBe("");
    });

    test("GetLocaleFromPathValidLanguageAtRootStillMatches", () => {
        expect.assertions(3);
        // Valid 2- or 3-letter language codes at first segment should still be recognized.
        expect(getLocaleFromPath("[language]/[dir]/[filename]", "ja/guides/ai-studio/index.mdx")).toBe("ja");
        expect(getLocaleFromPath("[language]/[dir]/[filename]", "en/guides/ai-studio/index.mdx")).toBe("en");
        expect(getLocaleFromPath("[language]/[dir]/[filename]", "de/getting-started/page.mdx")).toBe("de");
    });

    test("GetLocaleFromPathLanguageMatchesJaFooAndJaWithLeadingDotSlash", () => {
        expect.assertions(2);
        expect(getLocaleFromPath("[language]/[dir]/[filename]", "ja/foo.mdx")).toBe("ja");
        expect(getLocaleFromPath("[language]/[dir]/[filename]", "./ja/foo.mdx")).toBe("ja");
    });

    test("GetLocaleFromPathLanguageDoesNotMatchLongFirstSegment", () => {
        expect.assertions(3);
        expect(getLocaleFromPath("[language]/[dir]/[filename]", "guides/foo.mdx")).toBe("");
        expect(getLocaleFromPath("[language]/[dir]/[filename]", "./guides/foo.mdx")).toBe("");
        expect(getLocaleFromPath("[language]/[dir]/[filename]", "guides")).toBe("");
    });

    test("ParsePathDirFilenameCapturesFullDirIncludingLeadingDotSlash", () => {
        expect.assertions(3);
        // [dir] captures multiple segments and preserves leading "./"
        expect(parsePath("[dir]/[filename]", "./guides/foo/bar/foo.mdx")).toStrictEqual({ dir: "./guides/foo/bar" });
        expect(parsePath("[dir]/[filename]", "./foo.mdx")).toStrictEqual({ dir: "." });
        expect(parsePath("[dir]/[filename]", "foo.mdx")).toStrictEqual({ dir: "." });
    });

    test("GetLocaleFromPathResourcesLocaleDirMessagesPo", () => {
        expect.assertions(6);
        // template "resources/[localeDir]/messages.po" so handles() can distinguish source vs already-localized
        expect(getLocaleFromPath("resources/[localeDir]/messages.po", "resources/en/GB/messages.po")).toBe("en-GB");
        expect(getLocaleFromPath("resources/[localeDir]/messages.po", "./resources/en/GB/messages.po")).toBe("en-GB");
        expect(getLocaleFromPath("resources/[localeDir]/messages.po", "resources/zh/Hans/CN/messages.po")).toBe("zh-Hans-CN");
        expect(getLocaleFromPath("resources/[localeDir]/messages.po", "./resources/zh/Hans/CN/messages.po")).toBe("zh-Hans-CN");
        expect(getLocaleFromPath("resources/[localeDir]/messages.po", "resources/en/US/messages.po")).toBe("en-US");
        expect(getLocaleFromPath("resources/[localeDir]/messages.po", "./resources/en/US/messages.po")).toBe("en-US");
    });

    test("ParsePathDirLocalePropertiesNoMatchWhenFilenameIsNotLocale", () => {
        expect.assertions(1);
        // Regression: "test.properties" must NOT match [dir]/[locale].properties - "test" is not a valid locale.
        // parsePath returns partial fill (dir, basename, extension, filename) with no locale - getLocaleFromPath will return "".
        expect(parsePath("[dir]/[locale].properties", "./test/testfiles/test.properties")).toStrictEqual({
            dir: "./test/testfiles",
            basename: "test",
            extension: "properties",
            filename: "test.properties"
        });
    });

    test("ParsePathDirLocalePropertiesWithOptionalDir", () => {
        expect.assertions(4);
        // PropertiesParser uses [dir]/[locale].properties for locale-only filenames (e.g. de-DE.properties).
        // Must capture dir so callers can build source paths like ./test/testfiles/en-US.properties.
        const actual = parsePath("[dir]/[locale].properties", "./test/testfiles/de-DE.properties");
        expect(actual.dir).toBe("./test/testfiles");
        expect(actual.locale).toBe("de-DE");
        expect(actual.language).toBe("de");
        expect(actual.region).toBe("DE");
    });

    test("ParsePathDirLocalePoWithOptionalDir", () => {
        expect.assertions(2);
        // Loctool PO plugin: [dir]/[locale].po with ./de.po (no dir) must match and return locale "de".
        expect(parsePath("[dir]/[locale].po", "./de.po")).toStrictEqual({ dir: ".", locale: "de", language: "de" });
        expect(getLocaleFromPath("[dir]/[locale].po", "./de.po")).toBe("de");
    });

    test("ParsePathDirBasenameLocaleProperties", () => {
        expect.assertions(5);
        // dir must include leading "./" so built paths stay "./test/testfiles/..."
        const actual = parsePath("[dir]/[basename]_[locale].properties", "./test/testfiles/test_de-DE.properties");
        expect(actual.dir).toBe("./test/testfiles");
        expect(actual.basename).toBe("test");
        expect(actual.locale).toBe("de-DE");
        expect(actual.language).toBe("de");
        expect(actual.region).toBe("DE");
    });

    test("ContainsActualTextHtml", () => {
        expect.assertions(1);

        expect(containsActualText(`<html><body>text</body></html>`)).toBeTruthy();
    });

    test("ContainsActualTextHtml", () => {
        expect.assertions(1);

        expect(!containsActualText(`<html><body><img src="This is a test"/></body></html>`)).toBeTruthy();
    });

    test("ContainsActualTextEntities", () => {
        expect.assertions(1);

        expect(containsActualText(`&uuml; text &lt;`)).toBeTruthy();
    });

    test("ContainsActualTextEntitiesFalse", () => {
        expect.assertions(1);

        expect(!containsActualText(`&uuml; &lt;`)).toBeTruthy();
    });

    test("ObjectMapCount", () => {
        expect.assertions(1);

        const obj = {
            subobj: {
                number: 4,
                bool: true
            },
            another: {
                yetAnother: {
                    text: "hey yeah"
                }
            }
        };
        const expected = {
            subobj: {
                number: "foo",
                bool: "foo"
            },
            another: {
                yetAnother: {
                    text: "foo"
                }
            }
        };
        const actual = objectMap(obj, (node) => {
            return "foo";
        });

        expect(actual).toStrictEqual(expected);
    });

    test("HashKey", () => {
        expect.assertions(1);

        expect(hashKey("This is a test")).toBe("r654479252");
    });

    test("HashKeySimpleTexts1", () => {
        expect.assertions(5);

        expect(hashKey("Settings in your profile")).toBe("r618035987");
        expect(hashKey("All locations")).toBe("r246937959");
        expect(hashKey("Conditions")).toBe("r103883086");
        expect(hashKey("Everything")).toBe("r414542544");
        expect(hashKey("Locations")).toBe("r29058502");
    });

    test("HashKeySimpleTexts2", () => {
        expect.assertions(5);

        expect(hashKey("Procedures")).toBe("r807691021");
        expect(hashKey("Functions")).toBe("r535786086");
        expect(hashKey("Morning and afternoon")).toBe("r409842466");
        expect(hashKey("Evening")).toBe("r72303136");
        expect(hashKey("Nighttime")).toBe("r332185734");
    });

    test("HashKeySimpleTexts3", () => {
        expect.assertions(8);

        expect(hashKey("Private Profile")).toBe("r314592735");
        expect(hashKey("People you are connected to")).toBe("r711926199");
        expect(hashKey("Notifications")).toBe("r284964820");
        expect(hashKey("News")).toBe("r613036745");
        expect(hashKey("More Tips")).toBe("r216617786");
        expect(hashKey("Filters")).toBe("r81370429");
        expect(hashKey("Referral Link")).toBe("r140625167");
        expect(hashKey("Questions")).toBe("r256277957");
    });

    test("HashKeyEscapes", () => {
        expect.assertions(2);

        expect(hashKey("Can\'t find id")).toBe("r743945592");
        expect(hashKey("Can\'t find an application for SMS")).toBe("r909283218");
    });

    test("HashKeyPunctuation", () => {
        expect.assertions(6);

        expect(hashKey("{name}({generic_name})")).toBe("r300446104");
        expect(hashKey("{name}, {sharer_name} {start}found this interesting{end}")).toBe("r8321889");
        expect(hashKey("{sharer_name} {start}found this interesting{end}")).toBe("r639868344");
        expect(hashKey("Grow your network")).toBe("r214079422");
        expect(hashKey("Failed to send connection request!")).toBe("r1015770123");
        expect(hashKey("Connection request copied!")).toBe("r136272443");
    });

    test("HashKeySameStringMeansSameKey", () => {
        expect.assertions(2);

        expect(hashKey("This is a test")).toBe("r654479252");
        expect(hashKey("This is a test")).toBe("r654479252");
    });

    test("MakeDirs", () => {
        expect.assertions(2);

        rmr("./testfiles/testdir");
        expect(!fs.existsSync("./testfiles/testdir")).toBeTruthy();
        makeDirs("./testfiles/testdir");
        expect(fs.existsSync("./testfiles/testdir")).toBeTruthy();
        rmr("./testfiles/testdir");
    });

    test("that the HTML data is exported properly", () => {
        expect.assertions(8);

        expect(nonBreakingTags.a).toBe(true);
        expect(nonBreakingTags.abbr).toBe(true);

        expect(selfClosingTags.area).toBe(true);
        expect(selfClosingTags.base).toBe(true);

        expect(ignoreTags.code).toBe(true);
        expect(ignoreTags.output).toBe(true);

        expect(localizableAttributes.area.alt).toBe(true);
        expect(localizableAttributes["*"]["aria-label"]).toBe(true);
    });
});

describe("test the plural categories for various languages", () => {
    test("getLanguagePluralCategories for English", () => {
        expect.assertions(1);

        const categories = getLanguagePluralCategories("en");
        expect(categories).toStrictEqual(["one", "other"]);
    });

    test("getLanguagePluralCategories for English with region", () => {
        expect.assertions(1);

        // should extract the language part of the locale specification
        const categories = getLanguagePluralCategories("en-US");
        expect(categories).toStrictEqual(["one", "other"]);
    });

    test("getLanguagePluralCategories for German", () => {
        expect.assertions(1);

        // German is not explicitly defined in the CLDR data, so it should
        // default to the English plural categories
        const categories = getLanguagePluralCategories("de");
        expect(categories).toStrictEqual(["one", "other"]);
    });

    test("getLanguagePluralCategories for German with region", () => {
        expect.assertions(1);

        // German is not explicitly defined in the CLDR data, so it should
        // default to the English plural categories
        const categories = getLanguagePluralCategories("de-DE");
        expect(categories).toStrictEqual(["one", "other"]);
    });

    test("getLanguagePluralCategories for Arabic", () => {
        expect.assertions(1);

        const categories = getLanguagePluralCategories("ar");
        expect(categories).toStrictEqual(["zero", "one", "two", "few", "many", "other"]);
    });

    test("getLanguagePluralCategories for Arabic with region", () => {
        expect.assertions(1);

        const categories = getLanguagePluralCategories("ar-SA");
        expect(categories).toStrictEqual(["zero", "one", "two", "few", "many", "other"]);
    });

    test("getLanguagePluralCategories for Polish", () => {
        expect.assertions(1);

        const categories = getLanguagePluralCategories("pl");
        expect(categories).toStrictEqual(["one", "few", "many", "other"]);
    });

    test("getLanguagePluralCategories for Polish with region", () => {
        expect.assertions(1);

        const categories = getLanguagePluralCategories("pl-PL");
        expect(categories).toStrictEqual(["one", "few", "many", "other"]);
    });

    test("getLanguagePluralCategories for Russian", () => {
        expect.assertions(1);

        const categories = getLanguagePluralCategories("ru");
        expect(categories).toStrictEqual(["one", "few", "many", "other"]);
    });

    test("getLanguagePluralCategories for Chinese", () => {
        expect.assertions(1);

        const categories = getLanguagePluralCategories("zh");
        expect(categories).toStrictEqual(["other"]);
    });

    test("getLanguagePluralCategories for Japanese", () => {
        expect.assertions(1);

        const categories = getLanguagePluralCategories("ja");
        expect(categories).toStrictEqual(["other"]);
    });

    test("getLanguagePluralCategories for Japanese with region", () => {
        expect.assertions(1);

        const categories = getLanguagePluralCategories("ja-JP");
        expect(categories).toStrictEqual(["other"]);
    });

    test("getLanguagePluralCategories for Hindi", () => {
        expect.assertions(1);

        const categories = getLanguagePluralCategories("hi");
        expect(categories).toStrictEqual(["one", "other"]);
    });

    test("getLanguagePluralCategories for undefined language", () => {
        expect.assertions(1);

        const categories = getLanguagePluralCategories(undefined);
        expect(categories).toStrictEqual(["one", "other"]);
    });
});