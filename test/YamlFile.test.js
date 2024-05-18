/*
 * YamlFile.test.js - test the YamlFile object.
 *
 * Copyright © 2024 JEDLSoft
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

var YamlFile = require("../YamlFile.js");
var YamlFileType = require("../YamlFileType.js");
var tools = require("ilib-tools-common");
var CustomProject =  require("loctool/lib/CustomProject.js");

var ResourceString = tools.ResourceString;
var ResourcePlural = tools.ResourcePlural;
var ResourceArray = tools.ResourceArray;
var TranslationSet = tools.TranslationSet;

var path = require("path");
function diff(a, b) {
    var min = Math.min(a.length, b.length);
    for (var i = 0; i < min; i++) {
        if (a[i] !== b[i]) {
            console.log("Found difference at character " + i);
            console.log("a: " + a.substring(i));
            console.log("b: " + b.substring(i));
            break;
        }
    }
}
var p = new CustomProject({
    id: "webapp",
    sourceLocale: "en-US",
    resourceDirs: {
        yml: "a/b"
    },
    plugins: [
        path.join(process.cwd(), "YamlFileType")
    ]
}, "./test/testfiles", {
    locales:["en-GB"],
    nopseudo: true,
    targetDir: "testfiles",
    flavors: ["CHOCOLATE", "VANILLA"]
});

var yft = new YamlFileType(p);
var projectWithMappings = new CustomProject({
    id: "webapp",
    sourceLocale: "en-US",
    plugins: [
        path.join(process.cwd(), "YamlFileType")
    ]
}, "./test/testfiles", {
    locales:["en-GB"],
    nopseudo: true,
    targetDir: "testfiles",
    tap: {
        mappings: {
            "**/source.yaml": {
                template: "localized.[locale].yaml",
                commentPrefix: "L10N:"
            },
            "**/test3.yml": {
                template: "resources/[locale]/[filename]",
                excludedKeys: ["c"],
                commentPrefix: "L10N:"
            },
            "**/*.y?(a)ml": {
                template: "resources/[locale]/[filename]"
            }
        }
    }
});

var yamlFileTypeWithMappings = new YamlFileType(projectWithMappings);

describe("yamlfile", function() {
    test("YamlInit", function() {
        p.init(function() {
        });
    });

    test("YamlConstructorEmpty", function() {
        expect.assertions(1);
        var y = new YamlFile({
            project: p,
            type: yft
        });
        expect(y).toBeTruthy();
    });

    test("YamlConstructorEmptyNoFlavor", function() {
        expect.assertions(2);
        var y = new YamlFile({
            project: p,
            type: yft
        });
        expect(y).toBeTruthy();
        expect(y.getFlavor()).toBeFalsy();
    });

    test("YamlConstructorFull", function() {
        expect.assertions(2);
        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "x/y/en-US.yml"
        });
        expect(y).toBeTruthy();
        expect(y.getPath()).toBe("x/y/en-US.yml");
    });

    test("YamlGetPath", function() {
        expect.assertions(2);
        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "foo/bar/x.yml"
        });
        expect(y).toBeTruthy();
        expect(y.getPath()).toBe("foo/bar/x.yml");
    });

    test("YamlWithFlavor", function() {
        expect.assertions(2);
        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "foo/customized/en-US-VANILLA.yml"
        });
        expect(y).toBeTruthy();
        expect(y.getFlavor()).toBe("VANILLA");
    });

    test("YamlWithNonFlavor", function() {
        expect.assertions(2);
        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "foo/customized/en-US-PEACH.yml"
        });
        expect(y).toBeTruthy();
        // PEACH is not a flavor in the project
        expect(y.getFlavor()).toBeFalsy();
    });

    test("YamlFileParseSimpleGetByKey", function() {
        expect.assertions(6);
        var yml = new YamlFile({
            project: p,
            type: yft
        });

        expect(yml).toBeTruthy();
        yml.parse('---\n' +
                'Jobs: Jobs\n' +
                'Our_internship_program: Our internship program\n' +
                '? Completing_an_internship_at_MyCompany_gives_you_the_opportunity_to_experience_innovation_and_personal_growth_at_one_of_the_best_companies_in_Silicon_Valley,_all_while_learning_directly_from_experienced,_successful_entrepreneurs.\n' +
                ': Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
                '  and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
                '  directly from experienced, successful entrepreneurs.\n' +
                'Working_at_MyCompany: Working at My Company, Inc.\n');
        var set = yml.getTranslationSet("en-US");
        expect(set).toBeTruthy();
        var r = set.getBy({
            reskey: "Jobs"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("Jobs");
        expect(r[0].getKey()).toBe("Jobs");
        expect(r[0].getComment()).toBeFalsy();
    });

    test("YamlFileParseWithSubkeys", function() {
        expect.assertions(28);
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        yml.parse(
                '---\n' +
                "'foo/bar/x.en-US.html.haml':\n" +
                '  r9834724545: Jobs\n' +
                '  r9483762220: Our internship program\n' +
                '  r6782977423: |\n' +
                '    Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
                '    and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
                '    directly from experienced, successful entrepreneurs.\n' +
                "'foo/ssss/asdf.en-US.html.haml':\n" +
                '  r4524523454: Working at MyCompany\n' +
                '  r3254356823: Jobs\n' +
                'foo:\n' +
                '  bar:\n' +
                '    asdf:\n' +
                '      test: test of many levels\n');
        var set = yml.getTranslationSet("en-US");
        expect(set).toBeTruthy();
        var r = set.getAll();
        expect(r).toBeTruthy();
        expect(r.length).toBe(6);
        expect(r[0].getSource()).toBe("Jobs");
        expect(r[0].getSourceLocale()).toBe("en-US"); // source locale
        expect(r[0].getKey()).toBe("foo/bar/x\\.en-US\\.html\\.haml.r9834724545");
        expect(r[0].getContext()).toBeFalsy();
        expect(r[1].getSource()).toBe("Our internship program");
        expect(r[1].getSourceLocale()).toBe("en-US"); // source locale
        expect(r[1].getKey()).toBe("foo/bar/x\\.en-US\\.html\\.haml.r9483762220");
        expect(r[1].getContext()).toBeFalsy();
        expect(r[2].getSource()).toBe('Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
                'and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
                'directly from experienced, successful entrepreneurs.\n');
        expect(r[2].getSourceLocale()).toBe("en-US"); // source locale
        expect(r[2].getKey()).toBe("foo/bar/x\\.en-US\\.html\\.haml.r6782977423");
        expect(r[2].getContext()).toBeFalsy();
        expect(r[3].getSource()).toBe("Working at MyCompany");
        expect(r[3].getSourceLocale()).toBe("en-US"); // source locale
        expect(r[3].getKey()).toBe("foo/ssss/asdf\\.en-US\\.html\\.haml.r4524523454");
        expect(r[3].getContext()).toBeFalsy();
        expect(r[4].getSource()).toBe("Jobs");
        expect(r[4].getSourceLocale()).toBe("en-US"); // source locale
        expect(r[4].getKey()).toBe("foo/ssss/asdf\\.en-US\\.html\\.haml.r3254356823");
        expect(r[4].getContext()).toBeFalsy();
        expect(r[5].getSource()).toBe("test of many levels");
        expect(r[5].getSourceLocale()).toBe("en-US"); // source locale
        expect(r[5].getKey()).toBe("foo.bar.asdf.test");
        expect(r[5].getContext()).toBeFalsy();
    });

    test("YamlFileParseWithLocaleAndSubkeys", function() {
        expect.assertions(22);
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        yml.parse(
                '---\n' +
                "zh_Hans_CN:\n" +
                "  foo/bar:\n" +
                '    r9834724545: Jobs\n' +
                '    r9483762220: Our internship program\n' +
                '    r6782977423: |\n' +
                '      Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
                '      and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
                '      directly from experienced, successful entrepreneurs.\n' +
                "  foo/ssss:\n" +
                '    r4524523454: Working at MyCompany\n' +
                '    r3254356823: Jobs\n' +
                '  foo:\n' +
                '    bar:\n' +
                '      asdf:\n' +
                '        test: test of many levels\n');
        var set = yml.getTranslationSet("en-US");
        expect(set).toBeTruthy();
        var r = set.getAll();
        expect(r).toBeTruthy();
        expect(r.length).toBe(6);
        // locale is not special for this type of yml file, so it should appear in the context
        expect(r[0].getSource()).toBe("Jobs");
        expect(r[0].getSourceLocale()).toBe("en-US");
        expect(r[0].getKey()).toBe("zh_Hans_CN.foo/bar.r9834724545");
        expect(r[1].getSource()).toBe("Our internship program");
        expect(r[1].getSourceLocale()).toBe("en-US");
        expect(r[1].getKey()).toBe("zh_Hans_CN.foo/bar.r9483762220");
        expect(r[2].getSource()).toBe('Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
                'and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
                'directly from experienced, successful entrepreneurs.\n');
        expect(r[2].getSourceLocale()).toBe("en-US");
        expect(r[2].getKey()).toBe("zh_Hans_CN.foo/bar.r6782977423");
        expect(r[3].getSource()).toBe("Working at MyCompany");
        expect(r[3].getSourceLocale()).toBe("en-US");
        expect(r[3].getKey()).toBe("zh_Hans_CN.foo/ssss.r4524523454");
        expect(r[4].getSource()).toBe("Jobs");
        expect(r[4].getSourceLocale()).toBe("en-US");
        expect(r[4].getKey()).toBe("zh_Hans_CN.foo/ssss.r3254356823");
        expect(r[5].getSource()).toBe("test of many levels");
        expect(r[5].getSourceLocale()).toBe("en-US");
        expect(r[5].getKey()).toBe("zh_Hans_CN.foo.bar.asdf.test");
    });

    test("YamlFileParseWithLocaleSubkeysAndPath", function() {
        expect.assertions(23);
        var yml = new YamlFile({
            project: p,
            pathName: "x/y/z/foo.yaml",
            type: yft
        });
        expect(yml).toBeTruthy();
        yml.parse(
                '---\n' +
                "  a:\n" +
                '    r9834724545: Jobs\n' +
                '    r9483762220: Our internship program\n' +
                '    r6782977423: |\n' +
                '      Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
                '      and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
                '      directly from experienced, successful entrepreneurs.\n' +
                "  b:\n" +
                '    r4524523454: Working at MyCompany\n' +
                '    r3254356823: Jobs\n' +
                '  foo:\n' +
                '    bar:\n' +
                '      asdf:\n' +
                '        test: test of many levels\n');
        var set = yml.getTranslationSet("en-US");
        expect(set).toBeTruthy();
        var r = set.getAll();
        expect(r).toBeTruthy();
        expect(r.length).toBe(6);
        // locale is not special for this type of yml file, so it should appear in the context
        expect(r[0].getSource()).toBe("Jobs");
        expect(r[0].getSourceLocale()).toBe("en-US");
        expect(r[0].getKey()).toBe("a.r9834724545");
        expect(r[0].getContext()).toBeFalsy();
        expect(r[1].getSource()).toBe("Our internship program");
        expect(r[1].getSourceLocale()).toBe("en-US");
        expect(r[1].getKey()).toBe("a.r9483762220");
        expect(r[2].getSource()).toBe('Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
                'and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
                'directly from experienced, successful entrepreneurs.\n');
        expect(r[2].getSourceLocale()).toBe("en-US");
        expect(r[2].getKey()).toBe("a.r6782977423");
        expect(r[3].getSource()).toBe("Working at MyCompany");
        expect(r[3].getSourceLocale()).toBe("en-US");
        expect(r[3].getKey()).toBe("b.r4524523454");
        expect(r[4].getSource()).toBe("Jobs");
        expect(r[4].getSourceLocale()).toBe("en-US");
        expect(r[4].getKey()).toBe("b.r3254356823");
        expect(r[5].getSource()).toBe("test of many levels");
        expect(r[5].getSourceLocale()).toBe("en-US");
        expect(r[5].getKey()).toBe("foo.bar.asdf.test");
    });

    test("YamlFileParseMultipleLevels", function() {
        expect.assertions(25);
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        yml.parse(
            'duration:\n' +
            '  top_header: Refine Your Query\n' +
            '  header:\n' +
            '    person: "George"\n' +
            '    subaccount: "Admin" \n' +
            '  variations:\n' +
            '    person: "A %NAME% name?"\n' +
            '    subaccount: "A %SUBACCOUNT_NAME%\'s name?"\n' +
            '    asdf:\n' +
            '      a: x y z\n' +
            '      c: a b c\n'
        );
        var set = yml.getTranslationSet("en-US");
        expect(set).toBeTruthy();
        var r = set.getAll();
        expect(r).toBeTruthy();
        expect(r.length).toBe(7);
        // locale is not special for this type of yml file, so it should appear in the context
        expect(r[0].getSource()).toBe("Refine Your Query");
        expect(r[0].getSourceLocale()).toBe("en-US");
        expect(r[0].getKey()).toBe("duration.top_header");
        expect(r[1].getSource()).toBe("George");
        expect(r[1].getSourceLocale()).toBe("en-US");
        expect(r[1].getKey()).toBe("duration.header.person");
        expect(r[2].getSource()).toBe("Admin");
        expect(r[2].getSourceLocale()).toBe("en-US");
        expect(r[2].getKey()).toBe("duration.header.subaccount");
        expect(r[3].getSource()).toBe("A %NAME% name?");
        expect(r[3].getSourceLocale()).toBe("en-US");
        expect(r[3].getKey()).toBe("duration.variations.person");
        expect(r[4].getSource()).toBe('A %SUBACCOUNT_NAME%\'s name?');
        expect(r[4].getSourceLocale()).toBe("en-US");
        expect(r[4].getKey()).toBe("duration.variations.subaccount");
        expect(r[5].getSource()).toBe("x y z");
        expect(r[5].getSourceLocale()).toBe("en-US");
        expect(r[5].getKey()).toBe("duration.variations.asdf.a");
        expect(r[6].getSource()).toBe("a b c");
        expect(r[6].getSourceLocale()).toBe("en-US");
        expect(r[6].getKey()).toBe("duration.variations.asdf.c");
    });

    test("YamlFile parse plural forms simple", function() {
        expect.assertions(8);
        var yml = new YamlFile({
            project: p,
            type: yft
        });

        expect(yml).toBeTruthy();
        yml.parse('---\n' +
                'Jobs: Job\n' +
                'Jobs_plural: Jobs\n' +
                'file_count: There is {n} file in the folder.\n' +
                'file_count_plural: There are {n} files in the folder.\n');
        var set = yml.getTranslationSet("en-US");
        expect(set).toBeTruthy();
        var r = set.getBy({
            reskey: "Jobs"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toStrictEqual({
            "one": "Job",
            "other": "Jobs"
        });
        expect(r[0].getKey()).toBe("Jobs");
        r = set.getBy({
            reskey: "file_count"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toStrictEqual({
            "one": "There is {n} file in the folder.",
            "other": "There are {n} files in the folder."
        });
        expect(r[0].getKey()).toBe("file_count");
    });

    test("YamlFile parse plural forms with CLDR plural forms", function() {
        expect.assertions(8);
        var yml = new YamlFile({
            project: p,
            type: yft
        });

        expect(yml).toBeTruthy();
        yml.parse('---\n' +
                'Jobs_one: Job\n' +
                'Jobs_other: Jobs\n' +
                'file_count_one: There is {n} file in the folder.\n' +
                'file_count_other: There are {n} files in the folder.\n');
        var set = yml.getTranslationSet("en-US");
        expect(set).toBeTruthy();
        var r = set.getBy({
            reskey: "Jobs"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toStrictEqual({
            "one": "Job",
            "other": "Jobs"
        });
        expect(r[0].getKey()).toBe("Jobs");
        r = set.getBy({
            reskey: "file_count"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toStrictEqual({
            "one": "There is {n} file in the folder.",
            "other": "There are {n} files in the folder."
        });
        expect(r[0].getKey()).toBe("file_count");
    });

    test("YamlFileParseSimpleRightSize", function() {
        expect.assertions(4);
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        var set = yml.getTranslationSet("en-US");
        expect(set.size()).toBe(0);
        yml.parse(
                'Working_at_MyCompany: Working at MyCompany\n' +
                'Jobs: Jobs\n' +
                'Our_internship_program: Our internship program\n' +
                '? Completing_an_internship_at_MyCompany_gives_you_the_opportunity_to_experience_innovation_and_personal_growth_at_one_of_the_best_companies_in_Silicon_Valley,_all_while_learning_directly_from_experienced,_successful_entrepreneurs.\n' +
                ': Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
                '  and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
                '  directly from experienced, successful entrepreneurs.\n');
        expect(set).toBeTruthy();
        expect(set.size()).toBe(4);
    });

    test("YamlFileParseComments", function() {
        expect.assertions(19);
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        var set = yml.getTranslationSet("en-US");
        expect(set.size()).toBe(0);
        yml.parse('#first_a comment\n' +
            'first_a:\n' +
            '  #second_a comment\n' +
            '  second_a: "second a"\n' +
            '  #second_b comment\n' +
            '  second_b: "second b"\n' +
            '#first_b comment\n' +
            'first_b:\n' +
            '  #second_c comment\n' +
            '  second_c:\n' +
            '    third_a: "third a"\n' +
            '    #third_b comment\n' +
            '    third_b: "third b"\n' +
            '  #   \n' +
            '  second_d: "second d"\n');
        expect(set).toBeTruthy();
        expect(set.size()).toBe(5);
        var r = set.getAll();
        expect(r[0].getSource()).toBe("second a");
        expect(r[0].getKey()).toBe("first_a.second_a");
        expect(r[0].getComment()).toBe("second_a comment");
        expect(r[1].getSource()).toBe("second b");
        expect(r[1].getKey()).toBe("first_a.second_b");
        expect(r[1].getComment()).toBe("second_b comment");
        expect(r[2].getSource()).toBe("third a");
        expect(r[2].getKey()).toBe("first_b.second_c.third_a");
        expect(r[2].getComment()).toBe(undefined);
        expect(r[3].getSource()).toBe("third b");
        expect(r[3].getKey()).toBe("first_b.second_c.third_b");
        expect(r[3].getComment()).toBe("third_b comment");
        expect(r[4].getSource()).toBe("second d");
        expect(r[4].getKey()).toBe("first_b.second_d");
        expect(r[4].getComment()).toBe("");
    });

    test("YamlFileParseCommentTrim", function() {
        expect.assertions(5);
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        yml.parse('# space before\n' +
            'first: "string"\n' +
            '#space after \n' +
            'second: "string"\n' +
            '#   space both multiple        \n' +
            'third: "string"');
        var set = yml.getTranslationSet("en-US");
        expect(set.size()).toBe(3);
        var r = set.getAll();
        expect(r[0].getComment()).toBe("space before");
        expect(r[1].getComment()).toBe("space after");
        expect(r[2].getComment()).toBe("space both multiple");
    });

    test("YamlFileParseCommentMultiline", function() {
        expect.assertions(5);
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        yml.parse('first: "string"\n' +
            '# this is multiline\n' +
            '# comment    \n' +
            'second: "string"\n' +
            'third: "string"\n');
        var set = yml.getTranslationSet("en-US");
        expect(set.size()).toBe(3);
        var r = set.getAll();
        expect(r[0].getComment()).toBe(undefined);
        expect(r[1].getComment()).toBe("this is multiline\n comment");
        expect(r[2].getComment()).toBe(undefined);
    });

    test("YamlFileParseArray", function() {
        expect.assertions(8);
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        var set = yml.getTranslationSet("en-US");
        expect(set.size()).toBe(0);
        yml.parse(
                '---\n' +
                'Jobs:\n' +
                '  - one and\n' +
                '  - two and\n' +
                '  - three\n' +
                '  - four\n');
        expect(set).toBeTruthy();
        var set = yml.getTranslationSet("en-US");
        expect(set).toBeTruthy();
        var r = set.getAll();
        expect(r).toBeTruthy();
        expect(r.length).toBe(1);
        expect(r[0].getKey()).toBe("Jobs");
        expect(r[0].getSource()).toStrictEqual([
            "one and",
            "two and",
            "three",
            "four"
        ]);
    });

    test("YamlParseArrayComments", function() {
        expect.assertions(8);
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        var set = yml.getTranslationSet("en-US");
        expect(set.size()).toBe(0);
        yml.parse(
            '---\n' +
            '#first level comment\n' +
            'Jobs:\n' +
            '  - one and\n' +
            '  #second level comment\n' +
            '  - two and\n' +
            '  - three\n' +
            '  #second level comment\n' +
            '  - four\n');
        expect(set).toBeTruthy();
        var set = yml.getTranslationSet("en-US");
        expect(set).toBeTruthy();
        var r = set.getAll();
        expect(r).toBeTruthy();
        expect(r[0].getKey()).toBe("Jobs");
        expect(r[0].getSource()).toStrictEqual([
            "one and",
            "two and",
            "three",
            "four"
        ]);
        expect(r[0].getComment()).toBe("first level comment");
    });

    test("YamlFileParseWithFlavor", function() {
        expect.assertions(15);
        var yml = new YamlFile({
            project: p,
            locale: "en-US",
            type: yft,
            flavor: "CHOCOLATE"
        });
        expect(yml).toBeTruthy();
        yml.parse('---\n' +
                'a: foobar\n' +
                'b: barfoo\n');
        var set = yml.getTranslationSet("en-US");
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        var r = set.getAll();
        expect(r).toBeTruthy();
        expect(r.length).toBe(2);
        expect(r[0].getSource()).toBe("foobar");
        expect(r[0].getSourceLocale()).toBe("en-US");
        expect(r[0].getKey()).toBe("a");
        expect(r[0].getContext()).toBeFalsy();
        expect(r[0].getFlavor()).toBe("CHOCOLATE");
        expect(r[1].getSource()).toBe("barfoo");
        expect(r[1].getSourceLocale()).toBe("en-US");
        expect(r[1].getKey()).toBe("b");
        expect(r[1].getContext()).toBeFalsy();
        expect(r[1].getFlavor()).toBe("CHOCOLATE");
    });

    test("YamlFileParseWithNoFlavor", function() {
        expect.assertions(15);
        var yml = new YamlFile({
            project: p,
            locale: "en-US",
            type: yft
        });
        expect(yml).toBeTruthy();
        yml.parse('---\n' +
                'a: foobar\n' +
                'b: barfoo\n');
        var set = yml.getTranslationSet("en-US");
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        var r = set.getAll();
        expect(r).toBeTruthy();
        expect(r.length).toBe(2);
        expect(r[0].getSource()).toBe("foobar");
        expect(r[0].getSourceLocale()).toBe("en-US");
        expect(r[0].getKey()).toBe("a");
        expect(r[0].getContext()).toBeFalsy();
        expect(r[0].getFlavor()).toBeFalsy();
        expect(r[1].getSource()).toBe("barfoo");
        expect(r[1].getSourceLocale()).toBe("en-US");
        expect(r[1].getKey()).toBe("b");
        expect(r[1].getContext()).toBeFalsy();
        expect(r[1].getFlavor()).toBeFalsy();
    });

    test("YamlFileParseTargetWithNoFlavor", function() {
        expect.assertions(17);
        var yml = new YamlFile({
            project: p,
            locale: "es-US",
            type: yft
        });
        expect(yml).toBeTruthy();
        yml.parse('---\n' +
                'a: foobar\n' +
                'b: barfoo\n');
        var set = yml.getTranslationSet("en-US");
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        var r = set.getAll();
        expect(r).toBeTruthy();
        expect(r.length).toBe(2);
        expect(r[0].getTarget()).toBe("foobar");
        expect(r[0].getTargetLocale()).toBe("es-US");
        expect(r[0].getSourceLocale()).toBe("en-US");
        expect(r[0].getKey()).toBe("a");
        expect(r[0].getContext()).toBeFalsy();
        expect(r[0].getFlavor()).toBeFalsy();
        expect(r[1].getTarget()).toBe("barfoo");
        expect(r[1].getTargetLocale()).toBe("es-US");
        expect(r[1].getSourceLocale()).toBe("en-US");
        expect(r[1].getKey()).toBe("b");
        expect(r[1].getContext()).toBeFalsy();
        expect(r[1].getFlavor()).toBeFalsy();
    });

    test("YamlFileParseWithGleanedFlavor", function() {
        expect.assertions(13);
        var yml = new YamlFile({
            project: p,
            locale: "en-US",
            type: yft,
            pathName: "customization/en-CHOCOLATE.yml"
        });
        expect(yml).toBeTruthy();
        yml.parse('---\n' +
                'a: foobar\n' +
                'b: barfoo\n');
        var set = yml.getTranslationSet("en-US");
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        var r = set.getAll();
        expect(r).toBeTruthy();
        expect(r.length).toBe(2);
        expect(r[0].getSource()).toBe("foobar");
        expect(r[0].getSourceLocale()).toBe("en-US");
        expect(r[0].getKey()).toBe("a");
        expect(r[0].getFlavor()).toBe("CHOCOLATE");
        expect(r[1].getSource()).toBe("barfoo");
        expect(r[1].getSourceLocale()).toBe("en-US");
        expect(r[1].getKey()).toBe("b");
        expect(r[1].getFlavor()).toBe("CHOCOLATE");
    });

    test("YamlFileParseWithNoGleanedFlavor", function() {
        expect.assertions(15);
        var yml = new YamlFile({
            project: p,
            locale: "en-ZA",
            type: yft,
            pathName: "customization/en-ZA.yml"
        });
        expect(yml).toBeTruthy();
        yml.parse('---\n' +
                'a: foobar\n' +
                'b: barfoo\n');
        var set = yml.getTranslationSet("en-US");
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        var r = set.getAll();
        expect(r).toBeTruthy();
        expect(r.length).toBe(2);
        expect(r[0].getTarget()).toBe("foobar");
        expect(r[0].getTargetLocale()).toBe("en-ZA");
        expect(r[0].getSourceLocale()).toBe("en-US");
        expect(r[0].getKey()).toBe("a");
        expect(r[0].getFlavor()).toBeFalsy();
        expect(r[1].getTarget()).toBe("barfoo");
        expect(r[1].getTargetLocale()).toBe("en-ZA");
        expect(r[1].getSourceLocale()).toBe("en-US");
        expect(r[1].getKey()).toBe("b");
        expect(r[1].getFlavor()).toBeFalsy();
    });

    test("YamlFileExtractFile", function() {
        expect.assertions(14);
        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test.yml"
        });
        expect(yml).toBeTruthy();
        // should read the file
        yml.extract();
        var set = yml.getTranslationSet("en-US");
        expect(set.size()).toBe(10);
        var r = set.getBy({
            reskey: "Marketing"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("Marketing");
        expect(r[0].getKey()).toBe("Marketing");
        expect(r[0].getComment()).toBeFalsy();
        var r = set.getBy({
            reskey: "Everyone_at_MyCompany_has_not_only_welcomed_us_interns,_but_given_us_a_chance_to_ask_questions_and_really_learn_about_what_they_do\\._That's_why_I'm_thrilled_to_be_a_part_of_this_team_and_part_of_a_company_that_will,_I'm_sure,_soon_be_a_household_name\\."
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("Everyone at MyCompany has not only welcomed us interns, but given us a chance to ask questions and really learn about what they do. That's why I'm thrilled to be a part of this team and part of a company that will, I'm sure, soon be a household name.");
        expect(r[0].getKey()).toBe("Everyone_at_MyCompany_has_not_only_welcomed_us_interns,_but_given_us_a_chance_to_ask_questions_and_really_learn_about_what_they_do\\._That's_why_I'm_thrilled_to_be_a_part_of_this_team_and_part_of_a_company_that_will,_I'm_sure,_soon_be_a_household_name\\.");
        expect(r[0].getComment()).toBeFalsy();
        var r = set.getBy({
            reskey: "Learn_by_contributing_to_a_venture_that_will_change_the_world"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("Learn by contributing to a venture that will change the world");
        expect(r[0].getKey()).toBe("Learn_by_contributing_to_a_venture_that_will_change_the_world");
        expect(r[0].getComment()).toBeFalsy();
    });

    test("YamlFileExtractUndefinedFile", function() {
        expect.assertions(2);
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        // should attempt to read the file and not fail
        yml.extract();
        var set = yml.getTranslationSet("en-US");
        expect(set.size()).toBe(0);
    });

    test("YamlFileExtractBogusFile", function() {
        expect.assertions(2);
        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "./objc/en.lproj/asdf.yml"
        });
        expect(yml).toBeTruthy();
        // should attempt to read the file and not fail
        yml.extract();
        var set = yml.getTranslationSet("en-US");
        expect(set.size()).toBe(0);
    });

    test("YamlFileGetContent", function() {
        expect.assertions(2);
        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "./asdf.yml",
            locale: "de-DE"
        });
        expect(yml).toBeTruthy();
        [
            new ResourceString({
                project: "webapp",
                sourceLocale: "de-DE",
                key: "source_text",
                source: "Quellen\"text",
                comment: "foo",
                path: "asdf.yml",
                context: "asdf.yml"
            }),
            new ResourceString({
                project: "webapp",
                sourceLocale: "de-DE",
                key: "more_source_text",
                source: "mehr Quellen\"text",
                comment: "bar",
                path: "asdf.yml",
                context: "asdf.yml"
            })
        ].forEach(function(res) {
            yml.addResource(res);
        });
        diff(yml.getContent(yml.getTranslationSet()),
            'more_source_text: mehr Quellen\"text\n' +
            'source_text: Quellen\"text\n'
        );
        expect(yml.getContent(yml.getTranslationSet())).toBe('more_source_text: mehr Quellen\"text\n' +
            'source_text: Quellen\"text\n'
        );
    });

    test("YamlFileGetContentComplicated", function() {
        expect.assertions(2);
        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "./zh.yml",
            locale: "zh-Hans-CN"
        });
        expect(yml).toBeTruthy();
        [
            new ResourceString({
                project: "webapp",
                sourceLocale: "zh-Hans-CN",
                key: "• &amp;nbsp; Address a particular topic",
                source: "• &amp;nbsp; 解决一个特定的主题",
                comment: " ",
                path: "zh.yml",
                context: "zh.yml"
            }),
            new ResourceString({
                project: "webapp",
                sourceLocale: "zh-Hans-CN",
                key: "&apos;&#41;, url&#40;imgs/masks/top_bar",
                source: "&apos;&#41;, url&#40;imgs/masks/top_bar康生活相",
                comment: "bar",
                path: "zh.yml",
                context: "zh.yml"
            })
        ].forEach(function(res) {
            yml.addResource(res);
        });
        var expected =
            '"&apos;&#41;, url&#40;imgs/masks/top_bar": "&apos;&#41;, url&#40;imgs/masks/top_bar康生活相"\n' +
            '• &amp;nbsp; Address a particular topic: • &amp;nbsp; 解决一个特定的主题\n';
        diff(yml.getContent(yml.getTranslationSet()), expected);
        expect(yml.getContent(yml.getTranslationSet())).toBe(expected);
    });

    test("YamlFileGetContentWithNewlines", function() {
        expect.assertions(2);
        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "./zh.yml",
            locale: "zh-Hans-CN"
        });
        expect(yml).toBeTruthy();
        [
            new ResourceString({
                project: "webapp",
                sourceLocale: "zh-Hans-CN",
                key: "short key",
                source: "this is text that is relatively long and can run past the end of the page\nSo, we put a new line in the middle of it.",
                comment: " ",
                path: "zh.yml",
                context: "zh.yml"
            }),
            new ResourceString({
                project: "webapp",
                sourceLocale: "zh-Hans-CN",
                key: "A very long key that happens to have \n new line characters in the middle of it\\. Very very long\\. How long is it? It's so long that it won't even fit in 64 bits\\.",
                source: "short text",
                comment: "bar",
                path: "zh.yml",
                context: "zh.yml"
            })
        ].forEach(function(res) {
            yml.addResource(res);
        });
        var expected =
            "\"A very long key that happens to have \\n new line characters in the middle of it. Very very long. How long is it? It's so long that it won't even fit in 64 bits.\": short text\n" +
            "short key: |-\n" +
            "  this is text that is relatively long and can run past the end of the page\n" +
            "  So, we put a new line in the middle of it.\n";
        diff(yml.getContent(yml.getTranslationSet()), expected);
        expect(yml.getContent(yml.getTranslationSet())).toBe(expected);
    });

    test("YamlFileGetContentWithSubkeys", function() {
        expect.assertions(2);
        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "./zh.yml",
            locale: "zh-Hans-CN"
        });
        expect(yml).toBeTruthy();
        [
            new ResourceString({
                project: "webapp",
                sourceLocale: "zh-Hans-CN",
                key: "foo.bar.key1",
                source: "medium length text that doesn't go beyond one line",
                comment: " ",
                path: "zh.yml"
            }),
            new ResourceString({
                project: "webapp",
                sourceLocale: "zh-Hans-CN",
                key: "foo.bar.asdf.key2",
                source: "short text",
                comment: "bar",
                path: "zh.yml"
            })
        ].forEach(function(res) {
            yml.addResource(res);
        });
        var expected =
            "foo:\n" +
            "  bar:\n" +
            "    asdf:\n" +
            "      key2: short text\n" +
            "    key1: medium length text that doesn't go beyond one line\n";
        diff(yml.getContent(yml.getTranslationSet()), expected);
        expect(yml.getContent(yml.getTranslationSet())).toBe(expected);
    });

    test("YamlFileGetContentEmpty", function() {
        expect.assertions(2);
        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "./asdf.yml",
            locale: "de-DE"
        });
        expect(yml).toBeTruthy();
        expect(yml.getContent(yml.getTranslationSet())).toBe('{}\n');
    });

    test("YamlFileGetContentPlural", function() {
        expect.assertions(2);
        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "./asdf.yml",
            locale: "de-DE"
        });
        expect(yml).toBeTruthy();
        [
            new ResourcePlural({
                project: "webapp",
                sourceLocale: "de-DE",
                key: "asdf",
                sourceStrings: {
                    "one": "This is singular",
                    "two": "This is double",
                    "few": "This is a different case"
                },
                pathName: "a/b/c.java",
                comment: "foobar foo",
                state: "accepted"
            })
        ].forEach(function(res) {
            yml.addResource(res);
        });
        var expected =
            "asdf_few: This is a different case\n" +
            "asdf_one: This is singular\n" +
            "asdf_two: This is double\n";
        diff(yml.getContent(yml.getTranslationSet()),expected);
        expect(yml.getContent(yml.getTranslationSet())).toBe(expected);
    });

    test("YamlFileRealContent", function() {
        expect.assertions(5);

        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test.yml",
            locale: "en-US"
        });
        expect(yml).toBeTruthy();
        yml.extract();
        var set = yml.getTranslationSet("en-US");
        expect(set).toBeTruthy();
        var r = set.get(ResourceString.hashKey("webapp", "en-US", "The_perks_of_interning", "x-yaml"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("The perks of interning");
        expect(r.getKey()).toBe("The_perks_of_interning");
    });

    test("YamlFileRealContent2", function() {
        expect.assertions(6);
        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test2.yml",
            locale: "en-US"
        });
        expect(yml).toBeTruthy();
        yml.extract();
        var set = yml.getTranslationSet("en-US");
        expect(set).toBeTruthy();
        var r = set.get(ResourceString.hashKey("webapp", "en-US", "saved_someone_else_time.subject", "x-yaml"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Someone said a colleague’s answer to your question saved them a lot of time:");
        expect(r.getKey()).toBe("saved_someone_else_time.subject");
        expect(r.getSourceLocale()).toBe("en-US");
    });

    test("YamlFileAtInKeyName", function() {
        expect.assertions(6);
        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test2.yml",
            locale: "en-US"
        });
        expect(yml).toBeTruthy();
        yml.extract();
        var set = yml.getTranslationSet("en-US");
        expect(set).toBeTruthy();
        var r = set.get(ResourceString.hashKey("webapp", "en-US", "member_question_asked@answered.email_subject", "x-yaml"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("%1, %2 has answered a question you asked!");
        expect(r.getKey()).toBe("member_question_asked@answered.email_subject");
        expect(r.getSourceLocale()).toBe("en-US");
    });

    test("YamlFileRightResourceType", function() {
        expect.assertions(4);
        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test2.yml",
            locale: "en-US"
        });
        expect(yml).toBeTruthy();
        yml.extract();
        var set = yml.getTranslationSet("en-US");
        expect(set).toBeTruthy();
        var r = set.get(ResourceString.hashKey("webapp", "en-US", "member_question_asked@answered.email_subject", "x-yaml"));
        expect(r).toBeTruthy();
        expect(r instanceof ResourceString).toBeTruthy();
    });

    test("YamlFileLocalizeText", function() {
        expect.assertions(7);

        var yml = new YamlFile({
            project: p,
            type: yft,
            locale: "en-US"
        });
        expect(yml).toBeTruthy();
        yml.parse(
            'thanked_note_time_saved:\n' +
            '  email_subject: \'%1, you’re saving time!\'\n' +
            '  subject: You’ve been thanked for saving a colleague\'s time!\n' +
            '  body: “%1”\n' +
            '  ctoa: View %1\n' +
            '  push_data: You’ve saved lots of time! View %1\n' +
            '  global_link: generic_link\n' +
            '  setting_name: thanked_note_time_saved\n' +
            '  daily_limit_exception_email: true\n'
        );
        var set = yml.getTranslationSet("en-US");
        expect(set).toBeTruthy();
        var r = set.getBySource('%1, you’re saving time!');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('%1, you’re saving time!');
        expect(r.getSourceLocale()).toBe('en-US');
        expect(r.getKey()).toBe('thanked_note_time_saved.email_subject');
        var translations = new TranslationSet("en-US");
        translations.add(new ResourceString({
            project: "webapp",
            key: 'thanked_note_time_saved.email_subject',
            source: '%1, you\'re saving time!',
            target: '%1, vous économisez du temps!',
            targetLocale: "fr-FR",
            datatype: "x-yaml"
        }));
        var actual = yml.localizeText(translations, "fr-FR");
        var expected =
            'thanked_note_time_saved:\n' +
            '  body: “%1”\n' +
            '  ctoa: View %1\n' +
            '  email_subject: "%1, vous économisez du temps!"\n' +
            '  global_link: generic_link\n' +
            '  push_data: You’ve saved lots of time! View %1\n' +
            '  setting_name: thanked_note_time_saved\n' +
            '  subject: You’ve been thanked for saving a colleague\'s time!\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("YamlFileLocalizeTextMultiple", function() {
        expect.assertions(12);
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        yml.parse(
            'thanked_note_time_saved:\n' +
            '  email_subject: "%1, You\'re saving time!"\n' +
            '  subject: "You’ve been thanked for saving a colleague\'s time!"\n' +
            '  body: “%1”\n' +
            '  ctoa: View %1\n' +
            '  push_data: You\'ve saved time! View %1\n' +
            '  global_link: generic_link\n' +
            '  setting_name: thanked_note_time_saved\n' +
            '  daily_limit_exception_email: true\n'
        );
        var set = yml.getTranslationSet("en-US");
        expect(set).toBeTruthy();
        var r = set.getBySource('%1, You\'re saving time!');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('%1, You\'re saving time!');
        expect(r.getKey()).toBe('thanked_note_time_saved.email_subject');
        r = set.getBySource('You’ve been thanked for saving a colleague\'s time!');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('You’ve been thanked for saving a colleague\'s time!');
        expect(r.getKey()).toBe('thanked_note_time_saved.subject');
        r = set.getBySource('You\'ve saved time! View %1');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('You\'ve saved time! View %1');
        expect(r.getKey()).toBe('thanked_note_time_saved.push_data');
        var translations = new TranslationSet("en-US");
        translations.addAll([
            new ResourceString({
                project: "webapp",
                key: 'thanked_note_time_saved.email_subject',
                source: '%1, You\'re saving time!',
                target: '%1, vous économisez du temps!',
                targetLocale: "fr-FR",
                datatype: "x-yaml"
            }),
            new ResourceString({
                project: "webapp",
                key: 'thanked_note_time_saved.subject',
                source: 'You’ve been thanked for saving a colleague\'s time!',
                target: 'Vous avez été remercié pour économiser du temps!',
                targetLocale: "fr-FR",
                datatype: "x-yaml"
            }),
            new ResourceString({
                project: "webapp",
                key: 'thanked_note_time_saved.push_data',
                source: 'You’ve saved time! View %1',
                target: 'Vous avez économisé du temps! Voir %1',
                targetLocale: "fr-FR",
                datatype: "x-yaml"
            }),
        ]);
        var actual = yml.localizeText(translations, "fr-FR");
        var expected =
            'thanked_note_time_saved:\n' +
            '  body: “%1”\n' +
            '  ctoa: View %1\n' +
            '  email_subject: "%1, vous économisez du temps!"\n' +
            '  global_link: generic_link\n' +
            '  push_data: Vous avez économisé du temps! Voir %1\n' +
            '  setting_name: thanked_note_time_saved\n' +
            '  subject: Vous avez été remercié pour économiser du temps!\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("YamlFile localize text with arrays", function() {
        expect.assertions(7);
debugger;
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        yml.parse(
            'thanked_note_time_saved:\n' +
            '  email_subject:\n' +
            '    - "%1, You\'re saving time!"\n' +
            '    - "You’ve been thanked for saving a colleague\'s time!"\n' +
            '    - View %1\n'
        );
        var set = yml.getTranslationSet("en-US");
        expect(set).toBeTruthy();
        var resources = set.getAll();
        expect(resources.length).toBe(1);

        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getType()).toBe("array");

        expect(r.getSource()).toStrictEqual([
            '%1, You\'re saving time!',
            'You’ve been thanked for saving a colleague\'s time!',
            'View %1'
        ]);

        var translations = new TranslationSet("en-US");
        translations.add(
            new ResourceArray({
                project: "webapp",
                key: 'thanked_note_time_saved.email_subject',
                source: [
                    '%1, You\'re saving time!',
                    'You’ve been thanked for saving a colleague\'s time!',
                    'View %1'
                ],
                sourceLocale: "en-US",
                target: [
                    '%1, vous économisez du temps!',
                    'Vous avez été remercié pour économiser du temps!',
                    'Voir %1'
                ],
                targetLocale: "fr-FR",
                datatype: "x-yaml"
            })
        );
        var actual = yml.localizeText(translations, "fr-FR");
        var expected =
            'thanked_note_time_saved:\n' +
            '  email_subject:\n' +
            '    - "%1, vous économisez du temps!"\n' +
            '    - Vous avez été remercié pour économiser du temps!\n' +
            '    - Voir %1\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("YamlFile localize text with plurals", function() {
        expect.assertions(7);
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        yml.parse(
            'thanked_note_time_saved:\n' +
            '  email_subject_one: There is {n} item.\n' +
            '  email_subject_other: There are {n} items.\n'
        );
        var set = yml.getTranslationSet("en-US");
        expect(set).toBeTruthy();
        var resources = set.getAll();
        expect(resources.length).toBe(1);

        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getType()).toBe("plural");

        expect(r.getSource()).toStrictEqual({
            one: "There is {n} item.",
            other: "There are {n} items."
        });

        var translations = new TranslationSet("en-US");
        translations.add(
            new ResourcePlural({
                project: "webapp",
                key: 'thanked_note_time_saved.email_subject',
                source: {
                    one: "There is {n} item.",
                    other: "There are {n} items."
                },
                sourceLocale: "en-US",
                target: {
                    one: "Il y a {n} élément.",
                    other: "Il y a {n} éléments."
                },
                targetLocale: "fr-FR",
                datatype: "x-yaml"
            })
        );
        var actual = yml.localizeText(translations, "fr-FR");
        var expected =
            'thanked_note_time_saved:\n' +
            '  email_subject_one: Il y a {n} élément.\n' +
            '  email_subject_other: Il y a {n} éléments.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("YamlFile localize text with plurals and adding a plural category", function() {
        expect.assertions(7);
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        yml.parse(
            'thanked_note_time_saved:\n' +
            '  email_subject_one: There is {n} item.\n' +
            '  email_subject_other: There are {n} items.\n'
        );
        var set = yml.getTranslationSet("en-US");
        expect(set).toBeTruthy();
        var resources = set.getAll();
        expect(resources.length).toBe(1);

        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getType()).toBe("plural");

        expect(r.getSource()).toStrictEqual({
            one: "There is {n} item.",
            other: "There are {n} items."
        });

        var translations = new TranslationSet("en-US");
        translations.add(
            new ResourcePlural({
                project: "webapp",
                key: 'thanked_note_time_saved.email_subject',
                source: {
                    one: "There is {n} item.",
                    other: "There are {n} items."
                },
                sourceLocale: "en-US",
                target: {
                    one: "Jest {n} pozycja.",
                    few: "Jest {n} pozycje.",
                    other: "Jest {n} pozycji."
                },
                targetLocale: "pl-PL",
                datatype: "x-yaml"
            })
        );
        var actual = yml.localizeText(translations, "pl-PL");
        var expected =
            'thanked_note_time_saved:\n' +
            '  email_subject_few: Jest {n} pozycje.\n' +
            '  email_subject_one: Jest {n} pozycja.\n' +
            '  email_subject_other: Jest {n} pozycji.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("YamlFile localize text with plurals and removing a plural category", function() {
        expect.assertions(7);
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        yml.parse(
            'thanked_note_time_saved:\n' +
            '  email_subject_one: There is {n} item.\n' +
            '  email_subject_other: There are {n} items.\n'
        );
        var set = yml.getTranslationSet("en-US");
        expect(set).toBeTruthy();
        var resources = set.getAll();
        expect(resources.length).toBe(1);

        var r = resources[0];
        expect(r).toBeTruthy();
        expect(r.getType()).toBe("plural");

        expect(r.getSource()).toStrictEqual({
            one: "There is {n} item.",
            other: "There are {n} items."
        });

        var translations = new TranslationSet("en-US");
        translations.add(
            new ResourcePlural({
                project: "webapp",
                key: 'thanked_note_time_saved.email_subject',
                source: {
                    one: "There is {n} item.",
                    other: "There are {n} items."
                },
                sourceLocale: "en-US",
                target: {
                    other: "{n}件の商品があります。"
                },
                targetLocale: "ja-JP",
                datatype: "x-yaml"
            })
        );
        var actual = yml.localizeText(translations, "ja-JP");
        var expected =
            'thanked_note_time_saved:\n' +
            '  email_subject_other: "{n}件の商品があります。"\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("YamlFileLocalizeTextWithPath", function() {
        expect.assertions(7);
        var yml = new YamlFile({
            project: p,
            type: yft,
            pathName: "x/y/z/foo.yaml",
            locale: "en-US"
        });
        expect(yml).toBeTruthy();
        yml.parse(
            'thanked_note_time_saved:\n' +
            '  email_subject: \'%1, you’re saving time!\'\n' +
            '  subject: You’ve been thanked for saving a colleague\'s time!\n' +
            '  body: “%1”\n' +
            '  ctoa: View %1\n' +
            '  push_data: You’ve saved lots of time! View %1\n' +
            '  global_link: generic_link\n' +
            '  setting_name: thanked_note_time_saved\n' +
            '  daily_limit_exception_email: true\n'
        );
        var set = yml.getTranslationSet("en-US");
        expect(set).toBeTruthy();
        var r = set.getBySource('%1, you’re saving time!');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('%1, you’re saving time!');
        expect(r.getSourceLocale()).toBe('en-US');
        expect(r.getKey()).toBe('thanked_note_time_saved.email_subject');
        var translations = new TranslationSet("en-US");
        translations.add(new ResourceString({
            project: "webapp",
            key: 'thanked_note_time_saved.email_subject',
            source: '%1, you\'re saving time!',
            target: '%1, vous économisez du temps!',
            targetLocale: "fr-FR",
            datatype: "x-yaml"
        }));
        var actual = yml.localizeText(translations, "fr-FR");
        var expected =
            'thanked_note_time_saved:\n' +
            '  body: “%1”\n' +
            '  ctoa: View %1\n' +
            '  email_subject: "%1, vous économisez du temps!"\n' +
            '  global_link: generic_link\n' +
            '  push_data: You’ve saved lots of time! View %1\n' +
            '  setting_name: thanked_note_time_saved\n' +
            '  subject: You’ve been thanked for saving a colleague\'s time!\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("YamlGetLocalizedPathDefault", function() {
        expect.assertions(2);
        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test2.yml"
        });
        expect(y).toBeTruthy();
        y.extract();
        expect(y.getLocalizedPath('de-DE')).toBe('de-DE.yml');
    });
});

describe("yamlfile testsWithMapping", function() {
    test("YamlGetCommentPrefix", function() {
        expect.assertions(2);
        var yml = new YamlFile({
            project: projectWithMappings,
            type: yamlFileTypeWithMappings,
            pathName: "source.yaml"
        });
        expect(yml).toBeTruthy();
        expect(yml.getCommentPrefix()).toBe("L10N:");
    });

    test("YamlGetCommentPrefixNotProvided", function() {
        expect.assertions(2);
        var yml = new YamlFile({
            project: projectWithMappings,
            type: yamlFileTypeWithMappings,
            pathName: "random.yaml"
        });
        expect(yml).toBeTruthy();
        expect(yml.getCommentPrefix()).toBe(undefined);
    });

    test("testYamlGetLocalizedPathFromMapping", function () {
        expect.assertions(2);
        var yml = new YamlFile({
            project: projectWithMappings,
            type: yamlFileTypeWithMappings,
            pathName: "source.yaml"
        });
        expect(yml).toBeTruthy();
        expect(yml.getLocalizedPath('de-DE')).toBe('localized.de-DE.yaml');
    });

    test("YamlFileParsePrefixedComments", function() {
        expect.assertions(5);
        var yml = new YamlFile({
            project: projectWithMappings,
            type: yamlFileTypeWithMappings,
            pathName: "source.yaml"
        });
        expect(yml).toBeTruthy();
        yml.parse('#L10N: Prefixed comment\n' +
            'first: "string"\n' +
            '#  L10N:Prefixed comment with spaces before \n' +
            'second: "string"\n' +
            '# Not prefixed comment with L10N in it \n' +
            'third: "string"');
        var set = yml.getTranslationSet("en-US");
        expect(set.size()).toBe(3);
        var r = set.getAll();
        expect(r[0].getComment()).toBe("Prefixed comment");
        expect(r[1].getComment()).toBe("Prefixed comment with spaces before");
        expect(r[2].getComment()).toBe("Not prefixed comment with L10N in it");
    });

    test("YamlFileExtractGetCommentPrefix", function() {
        expect.assertions(7);
        var yml = new YamlFile({
            project: projectWithMappings,
            type: yamlFileTypeWithMappings,
            pathName: "test3.yml"
        });
        expect(yml).toBeTruthy();
        expect(yml.getCommentPrefix()).toBe('L10N:');
        yml.extract();
        var set = yml.getTranslationSet("en-US");
        expect(set).toBeTruthy();
        expect(set.size()).toBe(3);
        var r = set.getAll();
        expect(r[0].getComment()).toBe('Comment with prefix');
        expect(r[1].getComment()).toBe('Comment without prefix');
        expect(r[2].getComment()).toBeUndefined();
    });

    test("Yaml GetLocalizedPath alternate", function() {
        expect.assertions(2);

        var y = new YamlFile({
            project: projectWithMappings,
            type: yamlFileTypeWithMappings,
            pathName: "a/b/c/source.yaml"
        });
        expect(y).toBeTruthy();
        expect(y.getLocalizedPath('de-DE')).toBe('localized.de-DE.yaml');
    });
});
