/*
 * Yaml.test.js - test the Yaml object.
 *
 * Copyright © 2016-2017, 2023 2021- 2022-2023 HealthTap, Inc. and JEDLSoft
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
if (!YamlFile) {
    var YamlFile = require("../YamlFile.js");
    var YamlFileType = require("../YamlFileType.js");
    var ContextResourceString = require("loctool/lib/ContextResourceString.js");
    var ResourcePlural = require("loctool/lib/ResourcePlural.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
    var TranslationSet =  require("loctool/lib/TranslationSet.js");
}
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
    yaml: {
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
        expect(!y.getFlavor()).toBeTruthy();
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
        expect(!y.getFlavor()).toBeTruthy();
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
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBy({
            reskey: "Jobs"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("Jobs");
        expect(r[0].getKey()).toBe("Jobs");
        expect(!r[0].getComment()).toBeTruthy();
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
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getAll();
        expect(r).toBeTruthy();
        expect(r.length).toBe(6);
        expect(r[0].getSource()).toBe("Jobs");
        expect(r[0].getSourceLocale()).toBe("en-US"); // source locale
        expect(r[0].getKey()).toBe("foo/bar/x\\.en-US\\.html\\.haml.r9834724545");
        expect(!r[0].getContext()).toBeTruthy();
        expect(r[1].getSource()).toBe("Our internship program");
        expect(r[1].getSourceLocale()).toBe("en-US"); // source locale
        expect(r[1].getKey()).toBe("foo/bar/x\\.en-US\\.html\\.haml.r9483762220");
        expect(!r[1].getContext()).toBeTruthy();
        expect(r[2].getSource()).toBe('Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
                'and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
                'directly from experienced, successful entrepreneurs.\n');
        expect(r[2].getSourceLocale()).toBe("en-US"); // source locale
        expect(r[2].getKey()).toBe("foo/bar/x\\.en-US\\.html\\.haml.r6782977423");
        expect(!r[2].getContext()).toBeTruthy();
        expect(r[3].getSource()).toBe("Working at MyCompany");
        expect(r[3].getSourceLocale()).toBe("en-US"); // source locale
        expect(r[3].getKey()).toBe("foo/ssss/asdf\\.en-US\\.html\\.haml.r4524523454");
        expect(!r[3].getContext()).toBeTruthy();
        expect(r[4].getSource()).toBe("Jobs");
        expect(r[4].getSourceLocale()).toBe("en-US"); // source locale
        expect(r[4].getKey()).toBe("foo/ssss/asdf\\.en-US\\.html\\.haml.r3254356823");
        expect(!r[4].getContext()).toBeTruthy();
        expect(r[5].getSource()).toBe("test of many levels");
        expect(r[5].getSourceLocale()).toBe("en-US"); // source locale
        expect(r[5].getKey()).toBe("foo.bar.asdf.test");
        expect(!r[5].getContext()).toBeTruthy();
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
        var set = yml.getTranslationSet();
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
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getAll();
        expect(r).toBeTruthy();
        expect(r.length).toBe(6);
        // locale is not special for this type of yml file, so it should appear in the context
        expect(r[0].getSource()).toBe("Jobs");
        expect(r[0].getSourceLocale()).toBe("en-US");
        expect(r[0].getKey()).toBe("r70221679.a.r9834724545");
        expect(!r[0].getContext()).toBeTruthy();
        expect(r[1].getSource()).toBe("Our internship program");
        expect(r[1].getSourceLocale()).toBe("en-US");
        expect(r[1].getKey()).toBe("r70221679.a.r9483762220");
        expect(r[2].getSource()).toBe('Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
                'and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
                'directly from experienced, successful entrepreneurs.\n');
        expect(r[2].getSourceLocale()).toBe("en-US");
        expect(r[2].getKey()).toBe("r70221679.a.r6782977423");
        expect(r[3].getSource()).toBe("Working at MyCompany");
        expect(r[3].getSourceLocale()).toBe("en-US");
        expect(r[3].getKey()).toBe("r70221679.b.r4524523454");
        expect(r[4].getSource()).toBe("Jobs");
        expect(r[4].getSourceLocale()).toBe("en-US");
        expect(r[4].getKey()).toBe("r70221679.b.r3254356823");
        expect(r[5].getSource()).toBe("test of many levels");
        expect(r[5].getSourceLocale()).toBe("en-US");
        expect(r[5].getKey()).toBe("r70221679.foo.bar.asdf.test");
    });
    test("YamlFileParseMultipleLevels", function() {
        expect.assertions(19);
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        yml.parse(
            'duration:\n' +
            '  top_header: Refine Your Query\n' +
            '  header:\n' +
            '    person: "%ACK_SAMPLE%"\n' +
            '    subaccount: "%ACK_SAMPLE%" \n' +
            '  variations:\n' +
            '    person: "A %NAME% name?"\n' +
            '    subaccount: "A %SUBACCOUNT_NAME%\'s name?"\n' +
            '    asdf:\n' +
            '      a: x y z\n' +
            '      c: a b c\n'
        );
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getAll();
        expect(r).toBeTruthy();
        expect(r.length).toBe(5);
        // locale is not special for this type of yml file, so it should appear in the context
        expect(r[0].getSource()).toBe("Refine Your Query");
        expect(r[0].getSourceLocale()).toBe("en-US");
        expect(r[0].getKey()).toBe("duration.top_header");
        expect(r[1].getSource()).toBe("A %NAME% name?");
        expect(r[1].getSourceLocale()).toBe("en-US");
        expect(r[1].getKey()).toBe("duration.variations.person");
        expect(r[2].getSource()).toBe('A %SUBACCOUNT_NAME%\'s name?');
        expect(r[2].getSourceLocale()).toBe("en-US");
        expect(r[2].getKey()).toBe("duration.variations.subaccount");
        expect(r[3].getSource()).toBe("x y z");
        expect(r[3].getSourceLocale()).toBe("en-US");
        expect(r[3].getKey()).toBe("duration.variations.asdf.a");
        expect(r[4].getSource()).toBe("a b c");
        expect(r[4].getSourceLocale()).toBe("en-US");
        expect(r[4].getKey()).toBe("duration.variations.asdf.c");
    });
    test("YamlFileParseSimpleRightSize", function() {
        expect.assertions(4);
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        var set = yml.getTranslationSet();
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
        var set = yml.getTranslationSet();
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
        var set = yml.getTranslationSet();
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
        var set = yml.getTranslationSet();
        expect(set.size()).toBe(3);
        var r = set.getAll();
        expect(r[0].getComment()).toBe(undefined);
        expect(r[1].getComment()).toBe("this is multiline\n comment");
        expect(r[2].getComment()).toBe(undefined);
    });
    test("YamlFileParseArray", function() {
        expect.assertions(14);
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        var set = yml.getTranslationSet();
        expect(set.size()).toBe(0);
        yml.parse(
                '---\n' +
                'Jobs:\n' +
                '  - one and\n' +
                '  - two and\n' +
                '  - three\n' +
                '  - four\n');
        expect(set).toBeTruthy();
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getAll();
        expect(r).toBeTruthy();
        expect(r.length).toBe(4);
        expect(r[0].getSource()).toBe("one and");
        expect(r[0].getKey()).toBe("Jobs.0");
        expect(r[1].getSource()).toBe("two and");
        expect(r[1].getKey()).toBe("Jobs.1");
        expect(r[2].getSource()).toBe("three");
        expect(r[2].getKey()).toBe("Jobs.2");
        expect(r[3].getSource()).toBe("four");
        expect(r[3].getKey()).toBe("Jobs.3");
    });
    test("YamlParseArrayComments", function() {
        expect.assertions(18);
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        var set = yml.getTranslationSet();
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
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getAll();
        expect(r).toBeTruthy();
        expect(r.length).toBe(4);
        expect(r[0].getSource()).toBe("one and");
        expect(r[0].getKey()).toBe("Jobs.0");
        expect(r[0].getComment()).toBe(undefined);
        expect(r[1].getSource()).toBe("two and");
        expect(r[1].getKey()).toBe("Jobs.1");
        expect(r[1].getComment()).toBe("second level comment");
        expect(r[2].getSource()).toBe("three");
        expect(r[2].getKey()).toBe("Jobs.2");
        expect(r[2].getComment()).toBe(undefined);
        expect(r[3].getSource()).toBe("four");
        expect(r[3].getKey()).toBe("Jobs.3");
        expect(r[3].getComment()).toBe("second level comment");
    });
    test("YamlFileParseArrayWithIds", function() {
        expect.assertions(18);
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        var set = yml.getTranslationSet();
        expect(set.size()).toBe(0);
        yml.parse(
                '---\n' +
                'options:\n' +
                '  - name: attention\n' +
                '    display_value: Usually requires immediate attention\n' +
                '    color: reddish\n' +
                '    bars_count: 5\n' +
                '    action_options:\n' +
                '    - :emergency\n' +   // should ignore these
                '    - :see_support_rep\n' +
                '    - :find_sales_person\n' +
                '    - :ask_free_question\n' +
                '    - :learn_more\n' +
                '  - name: urgent-consult\n' +
                '    display_value: Usually requires an immediate sales person attention\n' +
                '    color: orange\n' +
                '    bars_count: 4\n' +
                '    care_options:\n' +
                '    - :see_support_rep\n' +
                '    - :find_sales_persopn\n' +
                '    - :learn_more\n' +
                '    - :emergency\n' +
                '    - :ask_free_question\n' +
                'exploring_options:\n' +
                '  - :learn_more\n' +
                '  - :take_action\n' +
                '  - :ask_free_question\n' +
                '  - :see_support_rep\n' +
                '  - :find_sales_person\n' +
                '  - :emergency\n\n');
        expect(set).toBeTruthy();
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getAll();
        expect(r).toBeTruthy();
        expect(r.length).toBe(6);
        expect(r[0].getSource()).toBe("attention");
        expect(r[0].getKey()).toBe("options.0.name");
        expect(r[1].getSource()).toBe("Usually requires immediate attention");
        expect(r[1].getKey()).toBe("options.0.display_value");
        expect(r[2].getSource()).toBe("reddish");
        expect(r[2].getKey()).toBe("options.0.color");
        expect(r[3].getSource()).toBe("urgent-consult");
        expect(r[3].getKey()).toBe("options.1.name");
        expect(r[4].getSource()).toBe("Usually requires an immediate sales person attention");
        expect(r[4].getKey()).toBe("options.1.display_value");
        expect(r[5].getSource()).toBe("orange");
        expect(r[5].getKey()).toBe("options.1.color");
    });
    test("YamlFileParseIgnoreUnderscoreValues", function() {
        expect.assertions(3);
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        yml.parse('---\n' +
                'Working_at_MyCompany: Working_at_MyCompany\n' +
                'Jobs: Jobs_Report\n');
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
    });
    test("YamlFileParseIgnoreRubyIds", function() {
        expect.assertions(3);
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        yml.parse('---\n' +
                'a: :foo\n' +
                'b: :bar\n');
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
    });
    test("YamlFileParseIgnoreRubyIdsWithQuotes", function() {
        expect.assertions(3);
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        yml.parse('---\n' +
                'a: ":foo"\n' +
                'b: ":bar"\n');
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
    });
    test("YamlFileParseIgnoreNoSpacesWithPunctuation", function() {
        expect.assertions(3);
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        // not words... embedded punctuation is probably not English
        yml.parse('---\n' +
                'a: "http://foo.bar.com/asdf/asdf.html"\n' +
                'b: "bar.asdf"\n');
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
    });
    test("YamlFileParseIgnoreNoSpacesTooShort", function() {
        expect.assertions(3);
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        // too short for most English words
        yml.parse('---\n' +
                'a: "a"\n' +
                'b: "ab"\n' +
                'c: "abc"\n');
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
    });
    test("YamlFileParseIgnoreNoSpacesTooLong", function() {
        expect.assertions(3);
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        // too long for regular English words
        yml.parse('---\n' +
                'a: "generalpractitionercardidnumber"\n' +
                'b: "huasdfHfasYEwqlkasdfjklHAFaihaFAasysfkjasdfLASDFfihASDFKsadfhysafJSKf"\n');
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
    });
    test("YamlFileParseIgnoreNoSpacesWithNumbers", function() {
        expect.assertions(3);
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        // embedded numbers is not English
        yml.parse('---\n' +
                'a: "Abc3"\n' +
                'b: "Huasdfafawql4kja"\n');
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
    });
    test("YamlFileParseIgnoreNoSpacesWithCamelCase", function() {
        expect.assertions(3);
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        // camel case means identifier, not English
        yml.parse('---\n' +
                'a: "LargeFormat"\n' +
                'b: "NeedsAttention"\n');
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
    });
    test("YamlFileParseIgnoreNoSpacesAllCapsOkay", function() {
        expect.assertions(3);
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        // all caps case means identifier, not English
        yml.parse('---\n' +
                'a: "LARGE"\n' +
                'b: "ATTENTION"\n');
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
    });
    test("YamlFileParseIgnoreNoSpacesTrueAndFalse", function() {
        expect.assertions(3);
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        // boolean means identifier, not English
        yml.parse('---\n' +
                'a: true\n' +
                'b: false\n');
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
    });
    test("YamlFileParseIgnoreNoSpacesOnlyDigits", function() {
        expect.assertions(3);
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        // only digits means identifier, not English
        yml.parse('---\n' +
                'a: 452345\n' +
                'b: 344\n');
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
    });
    test("YamlFileParseIgnoreNoSpacesHex", function() {
        expect.assertions(3);
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        // only hex means identifier, not English
        yml.parse('---\n' +
                'a: cbca81213eb5901b8ae4f8ac\n' +
                'b: ab21fe4f440EA4\n');
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
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
        var set = yml.getTranslationSet();
        expect(set.size()).toBe(10);
        var r = set.getBy({
            reskey: "r343014569.Marketing"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("Marketing");
        expect(r[0].getKey()).toBe("r343014569.Marketing");
        expect(!r[0].getComment()).toBeTruthy();
        var r = set.getBy({
            reskey: "r343014569.Everyone_at_MyCompany_has_not_only_welcomed_us_interns,_but_given_us_a_chance_to_ask_questions_and_really_learn_about_what_they_do\\._That's_why_I'm_thrilled_to_be_a_part_of_this_team_and_part_of_a_company_that_will,_I'm_sure,_soon_be_a_household_name\\."
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("Everyone at MyCompany has not only welcomed us interns, but given us a chance to ask questions and really learn about what they do. That's why I'm thrilled to be a part of this team and part of a company that will, I'm sure, soon be a household name.");
        expect(r[0].getKey()).toBe("r343014569.Everyone_at_MyCompany_has_not_only_welcomed_us_interns,_but_given_us_a_chance_to_ask_questions_and_really_learn_about_what_they_do\\._That's_why_I'm_thrilled_to_be_a_part_of_this_team_and_part_of_a_company_that_will,_I'm_sure,_soon_be_a_household_name\\.");
        expect(!r[0].getComment()).toBeTruthy();
        var r = set.getBy({
            reskey: "r343014569.Learn_by_contributing_to_a_venture_that_will_change_the_world"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("Learn by contributing to a venture that will change the world");
        expect(r[0].getKey()).toBe("r343014569.Learn_by_contributing_to_a_venture_that_will_change_the_world");
        expect(!r[0].getComment()).toBeTruthy();
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
        var set = yml.getTranslationSet();
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
        var set = yml.getTranslationSet();
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
            new ContextResourceString({
                project: "webapp",
                sourceLocale: "de-DE",
                key: "r699351263.source_text",
                source: "Quellen\"text",
                comment: "foo",
                path: "asdf.yml",
                context: "asdf.yml"
            }),
            new ContextResourceString({
                project: "webapp",
                sourceLocale: "de-DE",
                key: "r699351263.more_source_text",
                source: "mehr Quellen\"text",
                comment: "bar",
                path: "asdf.yml",
                context: "asdf.yml"
            })
        ].forEach(function(res) {
            yml.addResource(res);
        });
        diff(yml.getContent(),
            'more_source_text: mehr Quellen\"text\n' +
            'source_text: Quellen\"text\n'
        );
        expect(yml.getContent()).toBe('more_source_text: mehr Quellen\"text\n' +
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
            new ContextResourceString({
                project: "webapp",
                sourceLocale: "zh-Hans-CN",
                key: "r761853813.• &amp;nbsp; Address a particular topic",
                source: "• &amp;nbsp; 解决一个特定的主题",
                comment: " ",
                path: "zh.yml",
                context: "zh.yml"
            }),
            new ContextResourceString({
                project: "webapp",
                sourceLocale: "zh-Hans-CN",
                key: "r761853813.&apos;&#41;, url&#40;imgs/masks/top_bar",
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
        diff(yml.getContent(), expected);
        expect(yml.getContent()).toBe(expected);
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
            new ContextResourceString({
                project: "webapp",
                sourceLocale: "zh-Hans-CN",
                key: "r761853813.short key",
                source: "this is text that is relatively long and can run past the end of the page\nSo, we put a new line in the middle of it.",
                comment: " ",
                path: "zh.yml",
                context: "zh.yml"
            }),
            new ContextResourceString({
                project: "webapp",
                sourceLocale: "zh-Hans-CN",
                key: "r761853813.A very long key that happens to have \n new line characters in the middle of it\\. Very very long\\. How long is it? It's so long that it won't even fit in 64 bits\\.",
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
        diff(yml.getContent(), expected);
        expect(yml.getContent()).toBe(expected);
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
            new ContextResourceString({
                project: "webapp",
                sourceLocale: "zh-Hans-CN",
                key: "r761853813.foo.bar.key1",
                source: "medium length text that doesn't go beyond one line",
                comment: " ",
                path: "zh.yml"
            }),
            new ContextResourceString({
                project: "webapp",
                sourceLocale: "zh-Hans-CN",
                key: "r761853813.foo.bar.asdf.key2",
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
        diff(yml.getContent(), expected);
        expect(yml.getContent()).toBe(expected);
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
        expect(yml.getContent()).toBe('{}\n');
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
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.get(ContextResourceString.hashKey("webapp", undefined, "en-US", "r343014569.The_perks_of_interning", "x-yaml"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("The perks of interning");
        expect(r.getKey()).toBe("r343014569.The_perks_of_interning");
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
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.get(ContextResourceString.hashKey("webapp", undefined, "en-US", "r485332932.saved_someone_else_time.subject", "x-yaml"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Someone said a colleague’s answer to your question saved them a lot of time:");
        expect(r.getKey()).toBe("r485332932.saved_someone_else_time.subject");
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
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.get(ContextResourceString.hashKey("webapp", undefined, "en-US", "r485332932.member_question_asked@answered.email_subject", "x-yaml"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("%1, %2 has answered a question you asked!");
        expect(r.getKey()).toBe("r485332932.member_question_asked@answered.email_subject");
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
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.get(ContextResourceString.hashKey("webapp", undefined, "en-US", "r485332932.member_question_asked@answered.email_subject", "x-yaml"));
        expect(r).toBeTruthy();
        expect(r instanceof ContextResourceString).toBeTruthy();
    });
    test("YamlFileParseIgnoreNonStringValues", function() {
        expect.assertions(16);
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        yml.parse(
            '---\n' +
            'credit_card_expired:\n' +
            '  subject: "ALERT: Your %1 credit card has expired"\n' +
            '  body: \'Add your updated credit card information to resume using your account without further disruption.\'\n' +
            '  ctoa: \'Update credit card info\'\n' +
            '  push_data: "ALERT: Your %1 credit card has expired. Add your updated credit card information to resume using your account without further disruption"\n' +
            '  global_link: member_settings\n' +
            '  sms_data: ""\n' +
            '  setting_name: credit_card_updates\n' +
            '  daily_limit_exception_email: true\n' +
            '  night_blackout: true\n'
        );
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getAll();
        expect(r).toBeTruthy();
        expect(r.length).toBe(4);
        expect(r[0].getSource()).toBe("ALERT: Your %1 credit card has expired");
        expect(r[0].getSourceLocale()).toBe("en-US");
        expect(r[0].getKey()).toBe("credit_card_expired.subject");
        expect(r[1].getSource()).toBe("Add your updated credit card information to resume using your account without further disruption.");
        expect(r[1].getSourceLocale()).toBe("en-US");
        expect(r[1].getKey()).toBe("credit_card_expired.body");
        expect(r[2].getSource()).toBe('Update credit card info');
        expect(r[2].getSourceLocale()).toBe("en-US");
        expect(r[2].getKey()).toBe("credit_card_expired.ctoa");
        expect(r[3].getSource()).toBe("ALERT: Your %1 credit card has expired. Add your updated credit card information to resume using your account without further disruption");
        expect(r[3].getSourceLocale()).toBe("en-US");
        expect(r[3].getKey()).toBe("credit_card_expired.push_data");
    });
    test("YamlFileParseIgnoreStringLikeIdValues", function() {
        expect.assertions(4);
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        yml.parse(
            '---\n' +
            'credit_card_expired:\n' +
            '  subject: "ALERT: Your %1 credit card has expired"\n' +
            '  body: \'Add your updated credit card information to resume using your account without further disruption.\'\n' +
            '  ctoa: \'Update credit card info\'\n' +
            '  push_data: "ALERT: Your %1 credit card has expired. Add your updated credit card information to resume using your account without further disruption"\n' +
            '  global_link: member_settings\n' +
            '  sms_data: ""\n' +
            '  setting_name: credit_card_updates\n' +
            '  daily_limit_exception_email: true\n' +
            '  night_blackout: true\n'
        );
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBy({
            reskey: "global_link"
        });
        expect(r).toBeTruthy();
        expect(r.length).toBe(0);
    });
    test("YamlFileParseIgnoreBooleanValues", function() {
        expect.assertions(4);
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        yml.parse(
            '---\n' +
            'credit_card_expired:\n' +
            '  subject: "ALERT: Your %1 credit card has expired"\n' +
            '  body: \'Add your updated credit card information to resume using your account without further disruption.\'\n' +
            '  ctoa: \'Update credit card info\'\n' +
            '  push_data: "ALERT: Your %1 credit card has expired. Add your updated credit card information to resume using your account without further disruption"\n' +
            '  global_link: member_settings\n' +
            '  sms_data: ""\n' +
            '  setting_name: credit_card_updates\n' +
            '  daily_limit_exception_email: true\n' +
            '  night_blackout: true\n'
        );
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBy({
            reskey: "credit_card_expired.night_blackout"
        });
        expect(r).toBeTruthy();
        expect(r.length).toBe(0);
    });
    test("YamlFileParseIgnoreEmptyValues", function() {
        expect.assertions(4);
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        yml.parse(
            '---\n' +
            'credit_card_expired:\n' +
            '  subject: "ALERT: Your %1 credit card has expired"\n' +
            '  body: \'Add your updated credit card information to resume using your account without further disruption.\'\n' +
            '  ctoa: \'Update credit card info\'\n' +
            '  push_data: "ALERT: Your %1 credit card has expired. Add your updated credit card information to resume using your account without further disruption"\n' +
            '  global_link: member_settings\n' +
            '  sms_data: ""\n' +
            '  setting_name: credit_card_updates\n' +
            '  daily_limit_exception_email: true\n' +
            '  night_blackout: true\n'
        );
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBy({
            reskey: "credit_card_expired.sms_data"
        });
        expect(r).toBeTruthy();
        expect(r.length).toBe(0);
    });
    test("YamlFileParseIgnoreEmptyValues", function() {
        expect.assertions(4);
        var yml = new YamlFile({
            project: p,
            type: yft
        });
        expect(yml).toBeTruthy();
        yml.parse(
            '---\n' +
            'credit_card_expired:\n' +
            '  subject: "ALERT: Your %1 credit card has expired"\n' +
            '  body: \'Add your updated credit card information to resume using your account without further disruption.\'\n' +
            '  ctoa: \'Update credit card info\'\n' +
            '  push_data: "ALERT: Your %1 credit card has expired. Add your updated credit card information to resume using your account without further disruption"\n' +
            '  global_link: member_settings\n' +
            '  sms_data: ""\n' +
            '  expert_campaign: 2\n' +
            '  setting_name: credit_card_updates\n' +
            '  daily_limit_exception_email: true\n' +
            '  night_blackout: true\n'
        );
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBy({
            reskey: "credit_card_expired.expert_campaign"
        });
        expect(r).toBeTruthy();
        expect(r.length).toBe(0);
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
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource('%1, you’re saving time!');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('%1, you’re saving time!');
        expect(r.getSourceLocale()).toBe('en-US');
        expect(r.getKey()).toBe('thanked_note_time_saved.email_subject');
        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
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
            '  daily_limit_exception_email: true\n' +
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
        var set = yml.getTranslationSet();
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
        var translations = new TranslationSet();
        translations.addAll([
            new ContextResourceString({
                project: "webapp",
                key: 'thanked_note_time_saved.email_subject',
                source: '%1, You\'re saving time!',
                target: '%1, vous économisez du temps!',
                targetLocale: "fr-FR",
                datatype: "x-yaml"
            }),
            new ContextResourceString({
                project: "webapp",
                key: 'thanked_note_time_saved.subject',
                source: 'You’ve been thanked for saving a colleague\'s time!',
                target: 'Vous avez été remercié pour économiser du temps!',
                targetLocale: "fr-FR",
                datatype: "x-yaml"
            }),
            new ContextResourceString({
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
            '  daily_limit_exception_email: true\n' +
            '  email_subject: "%1, vous économisez du temps!"\n' +
            '  global_link: generic_link\n' +
            '  push_data: Vous avez économisé du temps! Voir %1\n' +
            '  setting_name: thanked_note_time_saved\n' +
            '  subject: Vous avez été remercié pour économiser du temps!\n';
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
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource('%1, you’re saving time!');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('%1, you’re saving time!');
        expect(r.getSourceLocale()).toBe('en-US');
        expect(r.getKey()).toBe('r70221679.thanked_note_time_saved.email_subject');
        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "webapp",
            key: 'r70221679.thanked_note_time_saved.email_subject',
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
            '  daily_limit_exception_email: true\n' +
            '  email_subject: "%1, vous économisez du temps!"\n' +
            '  global_link: generic_link\n' +
            '  push_data: You’ve saved lots of time! View %1\n' +
            '  setting_name: thanked_note_time_saved\n' +
            '  subject: You’ve been thanked for saving a colleague\'s time!\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });
    test("YamlParseOutputFile", function() {
        expect.assertions(5);
        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test2.yml"
        });
        expect(y).toBeTruthy();
        y.extract();
        var outputFileContents =
            'saved_someone_else_time:\n' +
            '  subject: "asdf"\n';
        y.parseOutputFile(outputFileContents);
        var set = y.getTranslationSet();
        expect(set).toBeTruthy();
        //expect(set.getBySource('d', 'title@do_not_read_me')).toBe(undefined);
        var r = set.getBy({reskey: 'r485332932.saved_someone_else_time.subject'});
        expect(r).toBeTruthy();
        expect(r.length).toBe(1);
        expect(r[0].getSource()).toBe('Someone said a colleague’s answer to your question saved them a lot of time:');
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
        expect(y.getLocalizedPath('de-DE')).toBe('de-DE/test2.yml');
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
            "asdf:\n"+
            "  few: This is a different case\n" +
            "  one: This is singular\n" +
            "  two: This is double\n";
        diff(yml.getContent(),expected);
        expect(yml.getContent()).toBe(expected);
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
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        var r = set.getAll();
        expect(r).toBeTruthy();
        expect(r.length).toBe(2);
        expect(r[0].getSource()).toBe("foobar");
        expect(r[0].getSourceLocale()).toBe("en-US");
        expect(r[0].getKey()).toBe("a");
        expect(!r[0].getContext()).toBeTruthy();
        expect(r[0].getFlavor()).toBe("CHOCOLATE");
        expect(r[1].getSource()).toBe("barfoo");
        expect(r[1].getSourceLocale()).toBe("en-US");
        expect(r[1].getKey()).toBe("b");
        expect(!r[1].getContext()).toBeTruthy();
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
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        var r = set.getAll();
        expect(r).toBeTruthy();
        expect(r.length).toBe(2);
        expect(r[0].getSource()).toBe("foobar");
        expect(r[0].getSourceLocale()).toBe("en-US");
        expect(r[0].getKey()).toBe("a");
        expect(!r[0].getContext()).toBeTruthy();
        expect(!r[0].getFlavor()).toBeTruthy();
        expect(r[1].getSource()).toBe("barfoo");
        expect(r[1].getSourceLocale()).toBe("en-US");
        expect(r[1].getKey()).toBe("b");
        expect(!r[1].getContext()).toBeTruthy();
        expect(!r[1].getFlavor()).toBeTruthy();
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
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        var r = set.getAll();
        expect(r).toBeTruthy();
        expect(r.length).toBe(2);
        expect(r[0].getTarget()).toBe("foobar");
        expect(r[0].getTargetLocale()).toBe("es-US");
        expect(r[0].getSourceLocale()).toBe("en-US");
        expect(r[0].getKey()).toBe("a");
        expect(!r[0].getContext()).toBeTruthy();
        expect(!r[0].getFlavor()).toBeTruthy();
        expect(r[1].getTarget()).toBe("barfoo");
        expect(r[1].getTargetLocale()).toBe("es-US");
        expect(r[1].getSourceLocale()).toBe("en-US");
        expect(r[1].getKey()).toBe("b");
        expect(!r[1].getContext()).toBeTruthy();
        expect(!r[1].getFlavor()).toBeTruthy();
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
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        var r = set.getAll();
        expect(r).toBeTruthy();
        expect(r.length).toBe(2);
        expect(r[0].getSource()).toBe("foobar");
        expect(r[0].getSourceLocale()).toBe("en-US");
        expect(r[0].getKey()).toBe("r975324452.a");
        expect(r[0].getFlavor()).toBe("CHOCOLATE");
        expect(r[1].getSource()).toBe("barfoo");
        expect(r[1].getSourceLocale()).toBe("en-US");
        expect(r[1].getKey()).toBe("r975324452.b");
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
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        var r = set.getAll();
        expect(r).toBeTruthy();
        expect(r.length).toBe(2);
        expect(r[0].getTarget()).toBe("foobar");
        expect(r[0].getTargetLocale()).toBe("en-ZA");
        expect(r[0].getSourceLocale()).toBe("en-US");
        expect(r[0].getKey()).toBe("r848382201.a");
        expect(!r[0].getFlavor()).toBeTruthy();
        expect(r[1].getTarget()).toBe("barfoo");
        expect(r[1].getTargetLocale()).toBe("en-ZA");
        expect(r[1].getSourceLocale()).toBe("en-US");
        expect(r[1].getKey()).toBe("r848382201.b");
        expect(!r[1].getFlavor()).toBeTruthy();
    });
});

describe("yamlfile testsWithLegacySchema", function() {
    test("YamlGetSchemaPath", function() {
        expect.assertions(2);
        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "foo/bar/x.yml"
        });
        expect(y).toBeTruthy();
        expect(y.getSchemaPath()).toBe("foo/bar/x-schema.json");
    });
    test("YamlGetSchemaPathNoFile", function() {
        expect.assertions(2);
        var y = new YamlFile({
            project: p,
            type: yft
        });
        expect(y).toBeTruthy();
        expect(y.getSchemaPath()).toBeUndefined();
    });
    test("YamlExtractSchemaFile", function() {
        expect.assertions(2);
        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test3.yml"
        });
        expect(y).toBeTruthy();
        y.extract();
        expect(y.getSchema()).not.toBeUndefined();
    });
    test("YamlGetExcludedKeysFromSchema", function() {
        expect.assertions(3);
        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test3.yml"
        });
        expect(y).toBeTruthy();
        expect(y.getExcludedKeysFromSchema().length).toBe(1);
        expect(y.getExcludedKeysFromSchema()[0]).toBe('do_not_read_me');
    });
    test("YamlGetExcludedKeysFromSchemaWithoutSchema", function() {
        expect.assertions(3);
        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test.yml"
        });
        expect(y).toBeTruthy();
        expect(y.getSchema()).toBe(undefined);
        expect(y.getExcludedKeysFromSchema().length).toBe(0);
    });
    test("YamlParseExcludedKeys", function() {
        expect.assertions(4);
        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test3.yml"
        });
        expect(y).toBeTruthy();
        y.extract();
        var set = y.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.getBySource('good').getLocalize()).toBe(true);
        expect(!set.getBySource('bad')).toBeTruthy();
    });
    test("YamlUseLocalizedDirectoriesFromSchema", function() {
        expect.assertions(2);
        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test3.yml"
        });
        expect(y).toBeTruthy();
        y.schema = {}
        y.schema['useLocalizedDirectories'] = false;
        expect(y.getUseLocalizedDirectoriesFromSchema()).toBe(false);
    });
    test("YamlUseLocalizedDirectoriesFromSchemaWithoutSchema", function() {
        expect.assertions(3);
        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test.yml"
        });
        expect(y).toBeTruthy();
        expect(y.getSchema()).toBe(undefined);
        expect(y.getUseLocalizedDirectoriesFromSchema()).toBe(true);
    });
    test("YamlGetLocalizedPathWithLocalizedDirectories", function() {
        expect.assertions(2);
        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test3.yml"
        });
        expect(y).toBeTruthy();
        y.schema['useLocalizedDirectories'] = true;
        expect(y.getLocalizedPath('de-DE')).toBe('de-DE/test3.yml');
    });
    test("YamlGetLocalizedPathWithoutLocalizedDirectories", function() {
        expect.assertions(2);
        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test3.yml"
        });
        expect(y).toBeTruthy();
        y.schema['useLocalizedDirectories'] = false;
        expect(y.getLocalizedPath('de-DE')).toBe('test3.yml');
    });
    test("YamlGetOutputFilenameForLocaleWithoutSchema", function() {
        expect.assertions(2);
        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test2.yml"
        });
        expect(y).toBeTruthy();
        expect(y.getOutputFilenameForLocale('de-DE')).toBe('test2.yml');
    });
    test("YamlGetOutputFilenameForLocaleWithSchema", function() {
        expect.assertions(2);
        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test2.yml"
        });
        expect(y).toBeTruthy();
        y.schema = {};
        y.schema['outputFilenameMapping'] = {
            'de-DE': './de.yml'
        }
        expect(y.getOutputFilenameForLocale('de-DE')).toBe('./de.yml');
    });
    test("YamlGetLocalizedPathWithLocalizedDirs", function() {
        expect.assertions(2);
        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test2.yml"
        });
        expect(y).toBeTruthy();
        y.schema = {
            useLocalizedDirectories: true
        };
        expect(y.getLocalizedPath('de-DE')).toBe('de-DE/test2.yml');
    });
    test("YamlGetLocalizedPathWithLocalizedDirsAndOutputFilenameMapping", function() {
        expect.assertions(2);
        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test2.yml"
        });
        expect(y).toBeTruthy();
        y.schema = {
            useLocalizedDirectories: true,
            outputFilenameMapping: {
                'de-DE': './de.yml'
            }
        };
        expect(y.getLocalizedPath('de-DE')).toBe('de-DE/de.yml');
    });
    test("YamlGetLocalizedPathWithOutputFilenameMappingAndWithoutLocalizedDirectories", function() {
        expect.assertions(2);
        var y = new YamlFile({
            project: p,
            type: yft,
            pathName: "./test2.yml"
        });
        expect(y).toBeTruthy();
        y.schema = {
            'outputFilenameMapping': {
                'de-DE': './de.yml'
            },
            'useLocalizedDirectories': false
        };
        expect(y.getLocalizedPath('de-DE')).toBe('./de.yml');
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
        var set = yml.getTranslationSet();
        expect(set.size()).toBe(3);
        var r = set.getAll();
        expect(r[0].getComment()).toBe("Prefixed comment");
        expect(r[1].getComment()).toBe("Prefixed comment with spaces before");
        expect(r[2].getComment()).toBe(undefined);
    });
    test("YamlFileExtractGetCommentPrefix", function() {
        expect.assertions(6);
        var yml = new YamlFile({
            project: projectWithMappings,
            type: yamlFileTypeWithMappings,
            pathName: "test3.yml"
        });
        expect(yml).toBeTruthy();
        expect(yml.getCommentPrefix()).toBe('L10N:');
        yml.extract();
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        var r = set.getAll();
        expect(r[0].getComment()).toBe('Comment with prefix');
        expect(r[1].getComment()).toBe(undefined);
    });
});
