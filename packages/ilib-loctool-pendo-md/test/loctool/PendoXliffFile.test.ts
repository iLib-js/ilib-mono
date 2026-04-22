/**
 * Copyright © 2024, Box, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licensefs/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { TranslationSet } from "loctool";
import fs from "fs";
import os from "os";
import path from "path";
import CustomProject from "loctool/lib/CustomProject.js";
import PendoXliffFile from "../../src/loctool/PendoXliffFile";
import PendoXliffFileType from "../../src/loctool/PendoXliffFileType";

const mockGetLocalizedPath = jest.fn();
const mockGetOutputLocale = jest.fn();
const mockCreateTranslationSet = jest.fn();

const makeXliff = (props: {
    datatype: string;
    sourceLocale: string;
    targetLocale?: string;
    transUnits: {
        resname: string;
        source: string;
        target?: string;
        note?: string;
    }[];
}) => `<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
    <file original="original-file" source-language="${props.sourceLocale}" target-language="${
    props.targetLocale
}" datatype="${props.datatype}">
        <body>${props.transUnits
            .map(
                (unit) => `
            <trans-unit id="${unit.resname}">
                <source>${unit.source}</source>
                <target${unit.target ? ` state="translated"` : ""}>${unit.target ?? ""}</target>
                <note>${unit.note ?? ""}</note>
            </trans-unit>`
            )
            .join("\n")}
        </body>
    </file>
</xliff>`;

/** Projects for {@link PendoXliffFileType.newFile} → {@link PendoXliffFile.getLocalizedPath} (path math only; no disk I/O). */
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

const makeFakeTranslations = (
    units: {
        locale: string;
        key: string;
        target: string;
    }[]
) =>
    ({
        getAll: () =>
            units.map(
                (unit) =>
                    ({
                        getKey: () => unit.key,
                        getTarget: () => unit.target,
                        getTargetLocale: () => unit.locale,
                        getType: () => "string",
                    } as unknown)
            ),
    } as unknown);

function newPendoFileAt(sourcePath: string): PendoXliffFile {
    return new PendoXliffFile(sourcePath, mockGetLocalizedPath, mockGetOutputLocale, mockCreateTranslationSet);
}

function removeDirRecursive(dir: string): void {
    if (!fs.existsSync(dir)) {
        return;
    }
    for (const name of fs.readdirSync(dir)) {
        const p = path.join(dir, name);
        if (fs.statSync(p).isDirectory()) {
            removeDirRecursive(p);
        } else {
            fs.unlinkSync(p);
        }
    }
    fs.rmdirSync(dir);
}

describe("PendoXliffFile", () => {
    describe("with a temp directory and real XLIFF files on disk", () => {
        let tmpDir: string;

        beforeEach(() => {
            tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "pendo-xliff-"));
        });

        afterEach(() => {
            removeDirRecursive(tmpDir);
            jest.resetAllMocks();
        });

        describe("extract", () => {
            it("should throw when given a non-existent file", () => {
                const file = newPendoFileAt(path.join(tmpDir, "does-not-exist.xliff"));
                expect(() => file.extract()).toThrow();
            });

            it.each([
                ["empty file", ``],
                ["plaintext file", `a plaintext file`],
                ["html file", `<html></html>`],
            ])("should throw when given an invalid file: %s", (_, content) => {
                const sourcePath = path.join(tmpDir, "bad.xliff");
                fs.writeFileSync(sourcePath, content, "utf-8");
                const file = newPendoFileAt(sourcePath);
                expect(() => file.extract()).toThrow();
            });

            it("should throw when given xliff version 2.0", () => {
                const xliff = `<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" version="2.0" srcLang="en" trgLang="fr"><file id="f1"></file></xliff>`;
                const sourcePath = path.join(tmpDir, "v2.xliff");
                fs.writeFileSync(sourcePath, xliff, "utf-8");
                const file = newPendoFileAt(sourcePath);
                expect(() => file.extract()).toThrow();
            });

            it("should extract a valid xliff file", () => {
                const xliff = makeXliff({
                    datatype: "x-undefined",
                    sourceLocale: "en-US",
                    transUnits: [
                        {
                            resname: "ContactInfo.customSupportEmail",
                            source: "Email Address",
                            note: "label for text input",
                        },
                    ],
                });
                const sourcePath = path.join(tmpDir, "valid.xliff");
                fs.writeFileSync(sourcePath, xliff, "utf-8");
                const file = newPendoFileAt(sourcePath);
                expect(() => file.extract()).not.toThrow();
            });
        });

        describe("getTranslationSet", () => {
            it("should throw if called before extraction", () => {
                const file = newPendoFileAt(path.join(tmpDir, "not-read.yet.xliff"));
                const extractSpy = jest.spyOn(file, "extract");
                expect(extractSpy).not.toHaveBeenCalled();
                expect(() => file.getTranslationSet()).toThrow();
            });

            it("should use injected factory to create a translation set", () => {
                const xliff = makeXliff({
                    datatype: "pendoguide",
                    sourceLocale: "en",
                    transUnits: [
                        {
                            resname: "ContactInfo.customSupportEmail",
                            source: "Email Address",
                            note: "label for text input",
                        },
                    ],
                });
                const sourcePath = path.join(tmpDir, "pendo.xliff");
                fs.writeFileSync(sourcePath, xliff, "utf-8");
                const file = newPendoFileAt(sourcePath);
                file.extract();

                const mockTranslationSet = "mocked translation set";
                mockCreateTranslationSet.mockReturnValue(mockTranslationSet);

                expect(file.getTranslationSet()).toBe(mockTranslationSet);
            });

            it("should put the extracted translation units in a translation set", () => {
                const xliff = makeXliff({
                    datatype: "pendoguide",
                    sourceLocale: "en",
                    transUnits: [
                        {
                            resname: "ContactInfo.customSupportEmail",
                            source: "Email Address",
                            note: "label for text input",
                        },
                    ],
                });
                const sourcePath = path.join(tmpDir, "pendo.xliff");
                fs.writeFileSync(sourcePath, xliff, "utf-8");
                const file = newPendoFileAt(sourcePath);
                file.extract();
                file.getTranslationSet();

                expect(mockCreateTranslationSet).toHaveBeenCalledWith(
                    expect.arrayContaining([
                        expect.objectContaining({
                            key: "ContactInfo.customSupportEmail",
                            source: "Email Address",
                            comment: "label for text input",
                        }),
                    ])
                );
            });

            describe("pendo strings", () => {
                it("should escape Pendo syntax in the source", () => {
                    const xliffWithPendoSyntax = makeXliff({
                        datatype: "pendoguide",
                        sourceLocale: "en",
                        transUnits: [
                            {
                                resname: "ContactInfo.customSupportEmail",
                                source: "Email {color: #FF0000}Address{/color}",
                                note: "label for text input",
                            },
                        ],
                    });
                    const sourcePath = path.join(tmpDir, "pendo-syntax.xliff");
                    fs.writeFileSync(sourcePath, xliffWithPendoSyntax, "utf-8");
                    const file = newPendoFileAt(sourcePath);
                    file.extract();
                    file.getTranslationSet();

                    expect(mockCreateTranslationSet).toHaveBeenCalledWith(
                        expect.arrayContaining([
                            expect.objectContaining({
                                key: "ContactInfo.customSupportEmail",
                                source: "Email <c0>Address</c0>",
                                comment: "label for text input [c0: color]",
                            }),
                        ])
                    );
                });

                it("should not escape Pendo syntax when datatype does not match", () => {
                    const xliffWithPendoSyntax = makeXliff({
                        datatype: "markdown",
                        sourceLocale: "en",
                        transUnits: [
                            {
                                resname: "ContactInfo.customSupportEmail",
                                source: "Email {color: #FF0000}Address{/color}",
                                note: "label for text input",
                            },
                        ],
                    });
                    const sourcePath = path.join(tmpDir, "md.xliff");
                    fs.writeFileSync(sourcePath, xliffWithPendoSyntax, "utf-8");
                    const file = newPendoFileAt(sourcePath);
                    file.extract();
                    file.getTranslationSet();

                    expect(mockCreateTranslationSet).toHaveBeenCalledWith(expect.arrayContaining([]));
                });
            });
        });

        describe("write", () => {
            it("should not write any files (should be a no-op)", () => {
                const file = newPendoFileAt(path.join(tmpDir, "never-written.xliff"));
                expect(() => file.write()).not.toThrow();
                expect(fs.readdirSync(tmpDir)).toEqual([]);
            });
        });

        describe("localize", () => {
            const targetLocale = "xx-XX";
            const localizedName = "localized-out.xliff";

            beforeEach(() => {
                mockGetLocalizedPath.mockReturnValue(path.join(tmpDir, localizedName));
                mockGetOutputLocale.mockImplementation((locale: string) => locale);
            });

            it("should unescape Pendo syntax in the target", () => {
                const xliff = makeXliff({
                    datatype: "pendoguide",
                    sourceLocale: "en",
                    transUnits: [
                        {
                            resname: "ContactInfo.customSupportEmail",
                            source: "Email {color: #FF0000}Address{/color}",
                            note: "label for text input",
                        },
                    ],
                });
                const sourcePath = path.join(tmpDir, "source.xliff");
                fs.writeFileSync(sourcePath, xliff, "utf-8");
                const file = newPendoFileAt(sourcePath);
                file.extract();

                const translations = makeFakeTranslations([
                    {
                        locale: targetLocale,
                        key: "ContactInfo.customSupportEmail",
                        target: "<c0>Adres</c0> E-mail",
                    },
                ]);
                file.localize(translations as TranslationSet, [targetLocale]);

                const outPath = path.join(tmpDir, localizedName);
                expect(fs.existsSync(outPath)).toBe(true);
                const written = fs.readFileSync(outPath, "utf-8");
                expect(written).toContain('target-language="xx-XX"');
                expect(written).toContain("Email {color: #FF0000}Address{/color}");
                expect(written).toContain("{color: #FF0000}Adres{/color} E-mail");
                expect(written).toContain('state="translated"');
            });

            it("should insert translations as-is if there is no Pendo syntax", () => {
                const xliff = makeXliff({
                    datatype: "pendoguide",
                    sourceLocale: "en",
                    transUnits: [
                        {
                            resname: "ContactInfo.customSupportEmail",
                            source: "Email Address",
                            note: "label for text input",
                        },
                    ],
                });
                const sourcePath = path.join(tmpDir, "source.xliff");
                fs.writeFileSync(sourcePath, xliff, "utf-8");
                const file = newPendoFileAt(sourcePath);
                file.extract();

                const translations = makeFakeTranslations([
                    {
                        locale: targetLocale,
                        key: "ContactInfo.customSupportEmail",
                        target: "Adres E-mail",
                    },
                ]);
                file.localize(translations as TranslationSet, [targetLocale]);

                const written = fs.readFileSync(path.join(tmpDir, localizedName), "utf-8");
                expect(written).toContain("Adres E-mail");
                expect(written).toContain('target-language="xx-XX"');
            });

            it("should insert translations for correct locale", () => {
                const xliff = makeXliff({
                    datatype: "pendoguide",
                    sourceLocale: "en",
                    transUnits: [
                        {
                            resname: "ContactInfo.customSupportEmail",
                            source: "Email Address",
                            note: "label for text input",
                        },
                    ],
                });
                const sourcePath = path.join(tmpDir, "source.xliff");
                fs.writeFileSync(sourcePath, xliff, "utf-8");
                const file = newPendoFileAt(sourcePath);
                file.extract();

                const translations = makeFakeTranslations([
                    {
                        locale: "xx-XX",
                        key: "ContactInfo.customSupportEmail",
                        target: "Adres E-mail",
                    },
                    {
                        locale: "yy-YY",
                        key: "ContactInfo.customSupportEmail",
                        target: "電子メールアドレス",
                    },
                ]);
                file.localize(translations as TranslationSet, ["yy-YY"]);

                const written = fs.readFileSync(path.join(tmpDir, localizedName), "utf-8");
                expect(written).toContain('target-language="yy-YY"');
                expect(written).toContain("電子メールアドレス");
            });

            it("should use mapped locale in localized file content", () => {
                const loctoolLocale = "xx-XX";
                const outputLocale = "yy-YY";
                mockGetOutputLocale.mockReturnValue(outputLocale);

                const xliff = makeXliff({
                    datatype: "pendoguide",
                    sourceLocale: "en",
                    transUnits: [
                        {
                            resname: "ContactInfo.customSupportEmail",
                            source: "Email Address",
                            note: "label for text input",
                        },
                    ],
                });
                const sourcePath = path.join(tmpDir, "source.xliff");
                fs.writeFileSync(sourcePath, xliff, "utf-8");
                const file = newPendoFileAt(sourcePath);
                file.extract();

                const translations = makeFakeTranslations([
                    {
                        locale: loctoolLocale,
                        key: "ContactInfo.customSupportEmail",
                        target: "Adres E-mail",
                    },
                ]);

                file.localize(translations as TranslationSet, [loctoolLocale]);

                expect(mockGetOutputLocale).toHaveBeenCalledWith(loctoolLocale);
                const written = fs.readFileSync(path.join(tmpDir, localizedName), "utf-8");
                expect(written).toContain('target-language="yy-YY"');
                expect(written).toContain("Adres E-mail");
            });

            it("should not use mapped locale in getLocalizedPath", () => {
                const loctoolLocale = "xx-XX";
                const outputLocale = "yy-YY";
                mockGetOutputLocale.mockReturnValue(outputLocale);

                const xliff = makeXliff({
                    datatype: "x-undefined",
                    sourceLocale: "en",
                    transUnits: [],
                });
                const sourcePath = path.join(tmpDir, "source.xliff");
                fs.writeFileSync(sourcePath, xliff, "utf-8");
                const file = newPendoFileAt(sourcePath);
                file.extract();

                const translations = makeFakeTranslations([]);
                file.localize(translations as TranslationSet, [loctoolLocale]);

                expect(mockGetLocalizedPath).toHaveBeenCalledWith(loctoolLocale);
            });

            it("should write the localized file to the path returned by getLocalizedPath", () => {
                const alternateOut = path.join(tmpDir, "alternate-out.xliff");
                mockGetLocalizedPath.mockReset().mockReturnValue(alternateOut);

                const xliff = makeXliff({
                    datatype: "x-undefined",
                    sourceLocale: "en",
                    transUnits: [],
                });
                const sourcePath = path.join(tmpDir, "source.xliff");
                fs.writeFileSync(sourcePath, xliff, "utf-8");
                const file = newPendoFileAt(sourcePath);
                file.extract();

                const translations = makeFakeTranslations([]);
                file.localize(translations as TranslationSet, ["xx-XX"]);

                expect(fs.existsSync(alternateOut)).toBe(true);
                expect(fs.readFileSync(alternateOut, "utf-8")).toContain("<xliff");
            });
        });
    });

    describe("getLocalizedPath delegates to the injected callback", () => {
        let file: PendoXliffFile;

        beforeEach(() => {
            file = newPendoFileAt(path.join(os.tmpdir(), "pendo-xliff-delegate-path-not-used.xliff"));
            jest.resetAllMocks();
        });

        it("should call the injected function and return its result", () => {
            const locale = "xx-XX";
            const returned = path.join(os.tmpdir(), "some-localized.xliff");
            mockGetLocalizedPath.mockReturnValue(returned);

            expect(file.getLocalizedPath(locale)).toBe(returned);
            expect(mockGetLocalizedPath).toHaveBeenCalledWith(locale);
        });

        it("should not call getOutputLocale for path resolution", () => {
            const locale = "xx-XX";
            mockGetLocalizedPath.mockReturnValue("/tmp/out.xliff");

            expect(file.getLocalizedPath(locale)).toBe("/tmp/out.xliff");
            expect(mockGetOutputLocale).not.toHaveBeenCalled();
        });
    });

    describe("getLocalizedPath with wiring from PendoXliffFileType.newFile", () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function createFileType(project: any): PendoXliffFileType {
            return new PendoXliffFileType(project, project.getAPI());
        }

        function projectRoot(project: unknown): string {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            return (project as any).getRoot() as string;
        }

        describe("with template [dir]/[basename]_[locale].[extension]", () => {
            it("should strip source locale from basename and replace with target locale (en-US -> pl-PL)", () => {
                const fileType = createFileType(projectWithCustomMappingsForPath);
                const pendoFile = fileType.newFile("l10n/xliff/guides/zJ14meSfAuIGNT7VDDzReXI8HM4_en-US.xliff");
                const expected = path.join(
                    projectRoot(projectWithCustomMappingsForPath),
                    "l10n/xliff/guides/zJ14meSfAuIGNT7VDDzReXI8HM4_pl-PL.xliff"
                );
                expect(pendoFile.getLocalizedPath("pl-PL")).toBe(expected);
            });

            it("should strip source locale from basename and replace with target locale (en -> fr)", () => {
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

            it("should produce correct path for hash-like basename with en-US source", () => {
                const fileType = createFileType(projectWithCustomMappingsForPath);
                const pendoFile = fileType.newFile("l10n/xliff/guides/zJ14meSfAuIGNT7VDDzReXI8HM4_en-US.xliff");
                const expected = path.join(
                    projectRoot(projectWithCustomMappingsForPath),
                    "l10n/xliff/guides/zJ14meSfAuIGNT7VDDzReXI8HM4_fr.xliff"
                );
                expect(pendoFile.getLocalizedPath("fr")).toBe(expected);
            });
        });

        describe("source file without locale suffix (guides.xliff -> guides_de.xliff)", () => {
            it("should derive dir, basename, extension when parsePath returns empty", () => {
                const fileType = createFileType(projectSourceWithoutLocaleForPath);
                const pendoFile = fileType.newFile("l10n/xliff/guides.xliff");
                const expected = path.join(projectRoot(projectSourceWithoutLocaleForPath), "l10n/xliff/guides_de.xliff");
                expect(pendoFile.getLocalizedPath("de")).toBe(expected);
            });

            it("should produce correct path for French", () => {
                const fileType = createFileType(projectSourceWithoutLocaleForPath);
                const pendoFile = fileType.newFile("l10n/xliff/guides.xliff");
                const expected = path.join(projectRoot(projectSourceWithoutLocaleForPath), "l10n/xliff/guides_fr.xliff");
                expect(pendoFile.getLocalizedPath("fr")).toBe(expected);
            });

            it("should work with nested path", () => {
                const fileType = createFileType(projectSourceWithoutLocaleForPath);
                const pendoFile = fileType.newFile("a/b/c/guides.xliff");
                const expected = path.join(projectRoot(projectSourceWithoutLocaleForPath), "a/b/c/guides_de.xliff");
                expect(pendoFile.getLocalizedPath("de")).toBe(expected);
            });
        });
    });
});
