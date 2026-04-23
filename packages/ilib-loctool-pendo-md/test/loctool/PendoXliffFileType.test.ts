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

import PendoXliffFileType from "../../src/loctool/PendoXliffFileType";
import CustomProject from "loctool/lib/CustomProject.js";

// CustomProject extends Project at runtime; loctool types don't reflect this
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createFileType(project: any): PendoXliffFileType {
    return new PendoXliffFileType(project, project.getAPI());
}

const projectWithDefaultMappings = new CustomProject(
    {
        sourceLocale: "en-US",
        id: "pendo-test",
        plugins: [],
    },
    "./testfiles",
    {
        locales: ["pl-PL"],
    }
);

const projectWithCustomMappings = new CustomProject(
    {
        sourceLocale: "en-US",
        id: "pendo-test",
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

describe("PendoXliffFileType", () => {
    describe("constructor", () => {
        it("should create a PendoXliffFileType instance", () => {
            const fileType = createFileType(projectWithDefaultMappings);
            expect(fileType).toBeTruthy();
        });
    });

    describe("getExtensions", () => {
        it("should return xliff and xlf extensions", () => {
            const fileType = createFileType(projectWithDefaultMappings);
            const extensions = fileType.getExtensions();
            expect(extensions).toContain(".xliff");
            expect(extensions).toContain(".xlf");
        });
    });

    describe("name", () => {
        it("should return the file type name", () => {
            const fileType = createFileType(projectWithDefaultMappings);
            expect(fileType.name()).toBe("Pendo XLIFF");
        });
    });

    describe("getDataType", () => {
        it("should return the Pendo datatype", () => {
            const fileType = createFileType(projectWithDefaultMappings);
            expect(fileType.getDataType()).toBe("x-pendoguide-escaped");
        });
    });

    describe("handles", () => {
        describe("with default mappings", () => {
            it.each([
                {
                    path: "l10n/xliff/guides/zJ14meSfAuIGNT7VDDzReXI8HM4_en-US.xliff",
                    expected: true,
                    description: "should handle source locale file (en-US)",
                },
                {
                    path: "l10n/xliff/guides/zJ14meSfAuIGNT7VDDzReXI8HM4_en.xliff",
                    expected: true,
                    description:
                        "should handle source file with language-only suffix (_en) when source locale is en-US",
                },
                {
                    path: "l10n/xliff/guides/zJ14meSfAuIGNT7VDDzReXI8HM4_fr.xliff",
                    expected: false,
                    description: "should reject already localized file (fr)",
                },
                {
                    path: "l10n/xliff/guides/strings_de-DE.xliff",
                    expected: false,
                    description: "should reject already localized file (de-DE)",
                },
                {
                    path: "l10n/xliff/guides/content_zh-Hans-CN.xliff",
                    expected: false,
                    description: "should reject already localized file (zh-Hans-CN)",
                },
                {
                    path: "l10n/xliff/guides/guide_en-US.xlf",
                    expected: true,
                    description: "should handle .xlf extension with source locale",
                },
                {
                    path: "l10n/xliff/guides/guides.xliff",
                    expected: true,
                    description:
                        "should handle source file without locale suffix (e.g. guides.xliff, messages.properties-style)",
                },
            ])("$description", ({ path, expected }) => {
                const fileType = createFileType(projectWithDefaultMappings);
                expect(fileType.handles(path)).toBe(expected);
            });
        });

        describe("with custom mappings", () => {
            it("should handle source locale file matching custom pattern", () => {
                const fileType = createFileType(projectWithCustomMappings);
                expect(
                    fileType.handles("l10n/xliff/guides/zJ14meSfAuIGNT7VDDzReXI8HM4_en-US.xliff")
                ).toBe(true);
            });

            it("should reject already localized file (fr)", () => {
                const fileType = createFileType(projectWithCustomMappings);
                expect(
                    fileType.handles("l10n/xliff/guides/zJ14meSfAuIGNT7VDDzReXI8HM4_fr.xliff")
                ).toBe(false);
            });

            it("should reject path not matching custom pattern", () => {
                const fileType = createFileType(projectWithCustomMappings);
                expect(fileType.handles("other/dir/strings_en-US.xliff")).toBe(false);
            });
        });

        describe("handles with different source locales", () => {
            it("should handle when path locale matches source (fr)", () => {
                const projectFr = new CustomProject(
                    { sourceLocale: "fr", id: "pendo-fr", plugins: [] },
                    "./testfiles",
                    {
                        locales: ["en-US"],
                        pendo: {
                            mappings: {
                                "**/*.xliff": {
                                    template: "[dir]/[basename]_[locale].[extension]",
                                },
                            },
                        },
                    }
                );
                const fileType = createFileType(projectFr);
                expect(
                    fileType.handles("l10n/xliff/guides/zJ14meSfAuIGNT7VDDzReXI8HM4_fr.xliff")
                ).toBe(true);
            });

            it("should reject when path locale does not match source", () => {
                const projectFr = new CustomProject(
                    { sourceLocale: "fr", id: "pendo-fr", plugins: [] },
                    "./testfiles",
                    {
                        locales: ["en-US"],
                        pendo: {
                            mappings: {
                                "**/*.xliff": {
                                    template: "[dir]/[basename]_[locale].[extension]",
                                },
                            },
                        },
                    }
                );
                const fileType = createFileType(projectFr);
                expect(
                    fileType.handles("l10n/xliff/guides/zJ14meSfAuIGNT7VDDzReXI8HM4_en-US.xliff")
                ).toBe(false);
            });
        });
    });

    describe("getResourceTypes", () => {
        it("should return ResourceString for the datatype", () => {
            const fileType = createFileType(projectWithDefaultMappings);
            const resourceTypes = fileType.getResourceTypes();
            expect(resourceTypes["x-pendoguide-escaped"]).toBe("ResourceString");
        });
    });
});
