/**
 * Copyright © 2026 Box, Inc.
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

import path from "path";
import CustomProject from "loctool/lib/CustomProject.js";
import PendoXliffFileType from "../../src/loctool/PendoXliffFileType";

// CustomProject extends Project at runtime; loctool types don't reflect this
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createFileType(project: any): PendoXliffFileType {
    return new PendoXliffFileType(project, project.getAPI());
}

function projectRoot(project: unknown): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return (project as any).getRoot() as string;
}

const projectWithCustomMappingsForPath = new CustomProject(
    {
        sourceLocale: "en-US",
        id: "pendo-test-path",
        plugins: [],
    },
    "./testfiles",
    {
        locales: ["pl-PL"],
        pendo: {
            mappings: {
                "l10n/xliff/guides/*.xliff": {
                    template: "[dir]/[basename]_[locale].[extension]",
                },
            },
        },
    }
);

const projectSourceWithoutLocaleForPath = new CustomProject(
    {
        sourceLocale: "en-US",
        id: "pendo-no-locale-path",
        plugins: [],
    },
    "./testfiles",
    {
        locales: ["de", "fr"],
        pendo: {
            mappings: {
                "**/guides.xliff": {
                    template: "[dir]/[basename]_[locale].xliff",
                },
            },
        },
    }
);

describe("getLocalizedPath (via PendoXliffFileType → newFile)", () => {
    describe("template [dir]/[basename]_[locale].[extension]", () => {
        it("replaces source locale in basename with target (en-US → pl-PL)", () => {
            const fileType = createFileType(projectWithCustomMappingsForPath);
            const pendoFile = fileType.newFile("l10n/xliff/guides/zJ14meSfAuIGNT7VDDzReXI8HM4_en-US.xliff");
            const expected = path.join(
                projectRoot(projectWithCustomMappingsForPath),
                "l10n/xliff/guides/zJ14meSfAuIGNT7VDDzReXI8HM4_pl-PL.xliff"
            );
            expect(pendoFile.getLocalizedPath("pl-PL")).toBe(expected);
        });

        it("replaces language-only source suffix with target (en → fr)", () => {
            const projectEn = new CustomProject(
                { sourceLocale: "en", id: "pendo-en", plugins: [] },
                "./testfiles",
                {
                    locales: ["fr"],
                    pendo: {
                        mappings: {
                            "l10n/xliff/guides/*.xliff": {
                                template: "[dir]/[basename]_[locale].[extension]",
                            },
                        },
                    },
                }
            );
            const fileTypeEn = createFileType(projectEn);
            const pendoFile = fileTypeEn.newFile("l10n/xliff/guides/guide_en.xliff");
            const expected = path.join(projectRoot(projectEn), "l10n/xliff/guides/guide_fr.xliff");
            expect(pendoFile.getLocalizedPath("fr")).toBe(expected);
        });

        it("handles hash-like basename with en-US source", () => {
            const fileType = createFileType(projectWithCustomMappingsForPath);
            const pendoFile = fileType.newFile("l10n/xliff/guides/zJ14meSfAuIGNT7VDDzReXI8HM4_en-US.xliff");
            const expected = path.join(
                projectRoot(projectWithCustomMappingsForPath),
                "l10n/xliff/guides/zJ14meSfAuIGNT7VDDzReXI8HM4_fr.xliff"
            );
            expect(pendoFile.getLocalizedPath("fr")).toBe(expected);
        });

        it("uses localeMap for the locale segment in the output path", () => {
            const projectWithLocaleMap = new CustomProject(
                {
                    sourceLocale: "en-US",
                    id: "pendo-locale-map-path",
                    plugins: [],
                },
                "./testfiles",
                {
                    locales: ["xx-XX"],
                    localeMap: { "xx-XX": "yy-YY" },
                    pendo: {
                        mappings: {
                            "l10n/xliff/guides/*.xliff": {
                                template: "[dir]/[basename]_[locale].[extension]",
                            },
                        },
                    },
                }
            );
            const fileType = createFileType(projectWithLocaleMap);
            const pendoFile = fileType.newFile("l10n/xliff/guides/zJ14meSfAuIGNT7VDDzReXI8HM4_en-US.xliff");
            const expected = path.join(
                projectRoot(projectWithLocaleMap),
                "l10n/xliff/guides/zJ14meSfAuIGNT7VDDzReXI8HM4_yy-YY.xliff"
            );
            expect(pendoFile.getLocalizedPath("xx-XX")).toBe(expected);
        });
    });

    describe("source path without locale suffix (guides.xliff)", () => {
        it("builds guides_<locale>.xliff from guides.xliff (de)", () => {
            const fileType = createFileType(projectSourceWithoutLocaleForPath);
            const pendoFile = fileType.newFile("l10n/xliff/guides.xliff");
            const expected = path.join(projectRoot(projectSourceWithoutLocaleForPath), "l10n/xliff/guides_de.xliff");
            expect(pendoFile.getLocalizedPath("de")).toBe(expected);
        });

        it("builds guides_<locale>.xliff for French", () => {
            const fileType = createFileType(projectSourceWithoutLocaleForPath);
            const pendoFile = fileType.newFile("l10n/xliff/guides.xliff");
            const expected = path.join(projectRoot(projectSourceWithoutLocaleForPath), "l10n/xliff/guides_fr.xliff");
            expect(pendoFile.getLocalizedPath("fr")).toBe(expected);
        });

        it("preserves nested directories", () => {
            const fileType = createFileType(projectSourceWithoutLocaleForPath);
            const pendoFile = fileType.newFile("a/b/c/guides.xliff");
            const expected = path.join(projectRoot(projectSourceWithoutLocaleForPath), "a/b/c/guides_de.xliff");
            expect(pendoFile.getLocalizedPath("de")).toBe(expected);
        });
    });
});
