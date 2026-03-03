/*
 * PHPResourceFile.test.js - test the PHP file handler object.
 *
 * Copyright © 2024 Box, Inc.
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

var PHPResourceFile = require("../PHPResourceFile.js");
var PHPResourceFileType = require("../PHPResourceFileType.js");
var CustomProject = require("loctool/lib/CustomProject.js");

var p = new CustomProject({
    id: "webapp",
    sourceLocale: "en-US",
    resourceDirs: {
        "js": "localized"
    }
}, "./testfiles", {
    locales:["en-GB", "de-DE", "de-AT"],
    // map to non-standard locale specifiers
    "localeMap": {
        "da-DK": "DaDK",
        "de-DE": "DeDE",
        "en-US": "EnUS",
        "en-GB": "EnGB",
        "es-ES": "EsES",
        "fr-FR": "FrFR",
        "it-IT": "ItIT",
        "ja-JP": "JaJP",
        "ko-KR": "KoKR",
        "pt-BR": "PtBR",
        "sv-SE": "SvSE",
        "zh-Hans-CN": "ZhCN",
        "zh-Hant-HK": "ZhHK",
        "zh-Hant-TW": "ZhTW",
        "zh-Hans-SG": "ZhSG"
    },
    "php": {
        "template": "localized/Translation[locale].php"
    }
});

var phpft = new PHPResourceFileType(p);

describe("PHPresourcefile", function() {
    test("PHPResourceFileConstructor", function() {
        expect.assertions(1);

        var phprf = new PHPResourceFile({
            type: phpft,
            project: p
        });
        expect(phprf).toBeTruthy();
    });

    test("PHPResourceFileConstructorParams", function() {
        expect.assertions(1);

        var phprf = new PHPResourceFile({
            type: phpft,
            project: p,
            pathName: "localized/TranslationEnUS.php",
            targetLocale: "en-US"
        });

        expect(phprf).toBeTruthy();
    });

    test("PHPResourceFileIsDirty", function() {
        expect.assertions(3);

        var phprf = new PHPResourceFile({
            type: phpft,
            project: p,
            pathName: "localized/TranslationDeDE.php",
            targetLocale: "de-DE"
        });

        expect(phprf).toBeTruthy();
        expect(!phprf.isDirty()).toBeTruthy();

        [
            p.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "source_text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "more_source_text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "yet_more_source_text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            phprf.addResource(res);
        });

        expect(phprf.isDirty()).toBeTruthy();
    });

    test("PHPResourceFileRightContents", function() {
        expect.assertions(2);

        var phprf = new PHPResourceFile({
            type: phpft,
            project: p,
            pathName: "localized/TranslationDeDE.php",
            targetLocale: "de-DE"
        });

        expect(phprf).toBeTruthy();

        [
            p.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "source_text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "more_source_text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "yet_more_source_text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            phprf.addResource(res);
        });

        var expected =
            '<?php\n' +
            '\n' +
            '/**\n' +
            ' * === Auto-generated class. Do not manually edit this file. ===\n' +
            ' *\n' +
            ' */\n' +
            'class TranslationDeDE\n' +
            '{\\n' +
            '    /**\n' +
            '     * Gives the pre-populated map of tags to translations\n' +
            '     *\n' +
            '     * @return array\n' +
            '     */\n' +
            '    public function getTranslationsMap() {\n' +
            '        return [\n' +
            "            'more_source_text' => 'mehr Quellentext',\n" +
            "            'source_text' => 'Quellentext',\n" +
            "            'yet_more_source_text' => 'noch mehr Quellentext'\n" +
            '        ];\n' +
            '    }\n' +
            '}\n' +
            '\n' +
            '?>\n';
        
        expect(phprf.getContent()).toBe(expected);
    });

    test("PHPResourceFileGetContentsNoContent", function() {
        expect.assertions(2);

        var phprf = new PHPResourceFile({
            type: phpft,
            project: p,
            pathName: "localized/TranslationDeDE.php",
            targetLocale: "de-DE"
        });

        expect(phprf).toBeTruthy();

        var expected =
            '<?php\n' +
            '\n' +
            '/**\n' +
            ' * === Auto-generated class. Do not manually edit this file. ===\n' +
            ' *\n' +
            ' */\n' +
            'class TranslationDeDE\n' +
            '{\\n' +
            '    /**\n' +
            '     * Gives the pre-populated map of tags to translations\n' +
            '     *\n' +
            '     * @return array\n' +
            '     */\n' +
            '    public function getTranslationsMap() {\n' +
            '        return [\n' +
            '        ];\n' +
            '    }\n' +
            '}\n' +
            '\n' +
            '?>\n';

        expect(phprf.getContent()).toBe(expected);
    });

    test("PHPResourceFile don't escape double quotes", function() {
        expect.assertions(2);

        var phprf = new PHPResourceFile({
            type: phpft,
            project: p,
            pathName: "localized/TranslationDeDE.php",
            targetLocale: "de-DE"
        });

        expect(phprf).toBeTruthy();
        [
            p.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "source_text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellen\"text"
            }),
            p.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "more_source_text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellen\"text"
            })
        ].forEach(function(res) {
            phprf.addResource(res);
        });

        var expected =
            '<?php\n' +
            '\n' +
            '/**\n' +
            ' * === Auto-generated class. Do not manually edit this file. ===\n' +
            ' *\n' +
            ' */\n' +
            'class TranslationDeDE\n' +
            '{\\n' +
            '    /**\n' +
            '     * Gives the pre-populated map of tags to translations\n' +
            '     *\n' +
            '     * @return array\n' +
            '     */\n' +
            '    public function getTranslationsMap() {\n' +
            '        return [\n' +
            "            'more_source_text' => 'mehr Quellen\"text',\n" +
            "            'source_text' => 'Quellen\"text'\n" +
            '        ];\n' +
            '    }\n' +
            '}\n' +
            '\n' +
            '?>\n';

        expect(phprf.getContent()).toBe(expected);
    });

    test("PHPResourceFile Do Escape Single Quotes", function() {
        expect.assertions(2);

        var phprf = new PHPResourceFile({
            type: phpft,
            project: p,
            pathName: "localized/TranslationDeDE.php",
            targetLocale: "de-DE"
        });

        expect(phprf).toBeTruthy();
        [
            p.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "source_text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellen'text"
            }),
            p.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "more_source_text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellen'text"
            })
        ].forEach(function(res) {
            phprf.addResource(res);
        });

        var expected =
            '<?php\n' +
            '\n' +
            '/**\n' +
            ' * === Auto-generated class. Do not manually edit this file. ===\n' +
            ' *\n' +
            ' */\n' +
            'class TranslationDeDE\n' +
            '{\\n' +
            '    /**\n' +
            '     * Gives the pre-populated map of tags to translations\n' +
            '     *\n' +
            '     * @return array\n' +
            '     */\n' +
            '    public function getTranslationsMap() {\n' +
            '        return [\n' +
            "            'more_source_text' => 'mehr Quellen\\'text',\n" +
            "            'source_text' => 'Quellen\\'text'\n" +
            '        ];\n' +
            '    }\n' +
            '}\n' +
            '\n' +
            '?>\n';

        expect(phprf.getContent()).toBe(expected);
    });

    test("PHPResourceFileGetResourceFilePathDefaultLocaleForLanguageNoDefaultAvailable", function() {
        expect.assertions(2);

        var phprf = new PHPResourceFile({
            type: phpft,
            project: p,
            targetLocale: "de-DE"
        });

        expect(phprf).toBeTruthy();

        expect(phprf.getResourceFilePath()).toBe("testfiles/localized/TranslationDeDE.php");
    });

    test("PHPResourceFileGetResourceFilePathDefaultLocaleForLanguageZH", function() {
        expect.assertions(2);

        var phprf = new PHPResourceFile({
            type: phpft,
            project: p,
            targetLocale: "zh-Hans-CN"
        });

        expect(phprf).toBeTruthy();

        expect(phprf.getResourceFilePath()).toBe("testfiles/localized/TranslationZhCN.php");
    });

    test("PHPResourceFileGetResourceFilePathDefaultLocale", function() {
        expect.assertions(2);

        // should default to English/US
        var phprf = new PHPResourceFile({
            type: phpft,
            project: p
        });

        expect(phprf).toBeTruthy();

        expect(phprf.getResourceFilePath()).toBe("testfiles/localized/TranslationEnUS.php");
    });

    test("PHPResourceFileGetResourceFilePathAlreadyHasPath", function() {
        expect.assertions(2);

        var phprf = new PHPResourceFile({
            type: phpft,
            project: p,
            targetLocale: "de-AT",
            pathName: "path/to/foo.php"
        });

        expect(phprf).toBeTruthy();

        expect(phprf.getResourceFilePath()).toBe("path/to/foo.php");
    });

    test("PHPResourceFileGetContentDefaultLocale", function() {
        expect.assertions(2);

        var phprf = new PHPResourceFile({
            type: phpft,
            project: p,
            targetLocale: "de-DE"
        });

        expect(phprf).toBeTruthy();

        [
            p.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "source_text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "more_source_text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "yet_more_source_text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            phprf.addResource(res);
        });

        // should use the default locale spec in the first line
        var expected =
            '<?php\n' +
            '\n' +
            '/**\n' +
            ' * === Auto-generated class. Do not manually edit this file. ===\n' +
            ' *\n' +
            ' */\n' +
            'class TranslationDeDE\n' +
            '{\\n' +
            '    /**\n' +
            '     * Gives the pre-populated map of tags to translations\n' +
            '     *\n' +
            '     * @return array\n' +
            '     */\n' +
            '    public function getTranslationsMap() {\n' +
            '        return [\n' +
            "            'more_source_text' => 'mehr Quellentext',\n" +
            "            'source_text' => 'Quellentext',\n" +
            "            'yet_more_source_text' => 'noch mehr Quellentext'\n" +
            '        ];\n' +
            '    }\n' +
            '}\n' +
            '\n' +
            '?>\n';

        var actual = phprf.getContent();

        expect(actual).toBe(expected);
    });

    test("PHPResourceFileGetContentDefaultLocaleZH", function() {
        expect.assertions(2);

        var phprf = new PHPResourceFile({
            type: phpft,
            project: p,
            targetLocale: "zh-Hans-CN"
        });

        expect(phprf).toBeTruthy();

        [
            p.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "zh-Hans-CN",
                key: "source_text",
                sourceLocale: "en-US",
                source: "source text",
                target: "源文本"
            }),
            p.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "zh-Hans-CN",
                key: "more_source_text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "更多源文本"
            }),
            p.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "zh-Hans-CN",
                key: "yet_more_source_text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "还有附加源文本"
            })
        ].forEach(function(res) {
            phprf.addResource(res);
        });

        // should use the default locale spec in the first line
        var expected =
            '<?php\n' +
            '\n' +
            '/**\n' +
            ' * === Auto-generated class. Do not manually edit this file. ===\n' +
            ' *\n' +
            ' */\n' +
            'class TranslationZhCN\n' +
            '{\\n' +
            '    /**\n' +
            '     * Gives the pre-populated map of tags to translations\n' +
            '     *\n' +
            '     * @return array\n' +
            '     */\n' +
            '    public function getTranslationsMap() {\n' +
            '        return [\n' +
            "            'more_source_text' => '更多源文本',\n" +
            "            'source_text' => '源文本',\n" +
            "            'yet_more_source_text' => '还有附加源文本'\n" +
            '        ];\n' +
            '    }\n' +
            '}\n' +
            '\n' +
            '?>\n';

        var actual = phprf.getContent();

        expect(actual).toBe(expected);
    });

    test("PHPResourceFileGetContentDefaultLocaleZH2", function() {
        expect.assertions(2);

        var phprf = new PHPResourceFile({
            type: phpft,
            project: p,
            targetLocale: "zh-Hant-HK"
        });

        expect(phprf).toBeTruthy();

        [
            p.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "zh-Hant-HK",
                key: "source_text",
                sourceLocale: "en-US",
                source: "source text",
                target: "原始文字"
            }),
            p.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "zh-Hant-HK",
                key: "more_source_text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "更多源文本"
            }),
            p.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "zh-Hant-HK",
                key: "yet_more_source_text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "還有額外的源文本"
            })
        ].forEach(function(res) {
            phprf.addResource(res);
        });

        // should use the default locale spec in the first line
        var expected =
            '<?php\n' +
            '\n' +
            '/**\n' +
            ' * === Auto-generated class. Do not manually edit this file. ===\n' +
            ' *\n' +
            ' */\n' +
            'class TranslationZhHK\n' +
            '{\\n' +
            '    /**\n' +
            '     * Gives the pre-populated map of tags to translations\n' +
            '     *\n' +
            '     * @return array\n' +
            '     */\n' +
            '    public function getTranslationsMap() {\n' +
            '        return [\n' +
            "            'more_source_text' => '更多源文本',\n" +
            "            'source_text' => '原始文字',\n" +
            "            'yet_more_source_text' => '還有額外的源文本'\n" +
            '        ];\n' +
            '    }\n' +
            '}\n' +
            '\n' +
            '?>\n';

        var actual = phprf.getContent();

        expect(actual).toBe(expected);
    });

    test("PHPResourceFile right contents for a locale that is not in the locale map", function() {
        expect.assertions(2);

        var phprf = new PHPResourceFile({
            type: phpft,
            project: p,
            targetLocale: "nl-NL"
        });

        expect(phprf).toBeTruthy();

        [
            p.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "nl-NL",
                key: "source_text",
                sourceLocale: "en-US",
                source: "source text",
                target: "bron tekst"
            }),
            p.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "nl-NL",
                key: "more_source_text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "meer bron tekst"
            }),
            p.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "nl-NL",
                key: "yet_more_source_text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "nog meer bron tekst"
            })
        ].forEach(function(res) {
            phprf.addResource(res);
        });

        // should use the default locale spec in the first line
        var expected =
            '<?php\n' +
            '\n' +
            '/**\n' +
            ' * === Auto-generated class. Do not manually edit this file. ===\n' +
            ' *\n' +
            ' */\n' +
            // the dash should be removed from the locale name to make this a valid PHP identifier
            'class TranslationnlNL\n' +
            '{\\n' +
            '    /**\n' +
            '     * Gives the pre-populated map of tags to translations\n' +
            '     *\n' +
            '     * @return array\n' +
            '     */\n' +
            '    public function getTranslationsMap() {\n' +
            '        return [\n' +
            "            'more_source_text' => 'meer bron tekst',\n" +
            "            'source_text' => 'bron tekst',\n" +
            "            'yet_more_source_text' => 'nog meer bron tekst'\n" +
            '        ];\n' +
            '    }\n' +
            '}\n' +
            '\n' +
            '?>\n';

        var actual = phprf.getContent();

        expect(actual).toBe(expected);
    });

});
