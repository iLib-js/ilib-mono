/*
 * Yaml.test.js - test the Yaml class
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

import Yaml from '../src/index.js';
import { ResourceString } from 'ilib-tools-common';

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

describe("yaml class", () => {
    test("Yaml Constructor Empty", () => {
        expect.assertions(1);
        var y = new Yaml();
        expect(y).toBeTruthy();
    });

    test("Yaml getPath()", () => {
        expect.assertions(2);
        var y = new Yaml({
            pathName: "foo/bar/x.yml"
        });
        expect(y).toBeTruthy();
        expect(y.getPath()).toBe("foo/bar/x.yml");
    });

    test("YamlConstructorFull", () => {
        expect.assertions(2);
        var y = new Yaml({
            project: "project",
            pathName: "x/y/en-US.yml",
            locale: "en-US",
            context: "context",
            state: "new",
            datatype: "yaml",
            flavor: "chocolate"
        });
        expect(y).toBeTruthy();
        expect(y.getPath()).toBe("x/y/en-US.yml");
    });
});

describe("yaml parse/deserialize tests", () => {
    test("Yaml parse simple file", () => {
        expect.assertions(7);

        var yml = new Yaml();
        expect(yml).toBeTruthy();
        yml.deserialize('---\n' +
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
        expect(r[0].getSourceLocale()).toBe("en-US");
        expect(r[0].getComment()).toBeFalsy();
    });

    test("Yaml parse with subkeys", () => {
        expect.assertions(28);
        var yml = new Yaml();
        expect(yml).toBeTruthy();
        yml.deserialize(
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

    test("Yaml parse with locale and subkeys", () => {
        expect.assertions(22);
        var yml = new Yaml();
        expect(yml).toBeTruthy();
        yml.deserialize(
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

    test("Yaml parse with locale subkeys and path", () => {
        expect.assertions(29);
        var yml = new Yaml({
            pathName: "x/y/z/foo.yaml"
        });
        expect(yml).toBeTruthy();
        yml.deserialize(
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
        expect(r[0].getKey()).toBe("a.r9834724545");
        expect(r[0].getPath()).toBe("x/y/z/foo.yaml");
        expect(r[0].getContext()).toBeFalsy();

        expect(r[1].getSource()).toBe("Our internship program");
        expect(r[1].getSourceLocale()).toBe("en-US");
        expect(r[1].getKey()).toBe("a.r9483762220");
        expect(r[1].getPath()).toBe("x/y/z/foo.yaml");

        expect(r[2].getSource()).toBe('Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
                'and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
                'directly from experienced, successful entrepreneurs.\n');
        expect(r[2].getSourceLocale()).toBe("en-US");
        expect(r[2].getKey()).toBe("a.r6782977423");
        expect(r[2].getPath()).toBe("x/y/z/foo.yaml");

        expect(r[3].getSource()).toBe("Working at MyCompany");
        expect(r[3].getSourceLocale()).toBe("en-US");
        expect(r[3].getKey()).toBe("b.r4524523454");
        expect(r[3].getPath()).toBe("x/y/z/foo.yaml");

        expect(r[4].getSource()).toBe("Jobs");
        expect(r[4].getSourceLocale()).toBe("en-US");
        expect(r[4].getKey()).toBe("b.r3254356823");
        expect(r[4].getPath()).toBe("x/y/z/foo.yaml");

        expect(r[5].getSource()).toBe("test of many levels");
        expect(r[5].getSourceLocale()).toBe("en-US");
        expect(r[5].getKey()).toBe("foo.bar.asdf.test");
        expect(r[5].getPath()).toBe("x/y/z/foo.yaml");
    });

    test("Yaml parse multiple levels", () => {
        expect.assertions(25);
        var yml = new Yaml();
        expect(yml).toBeTruthy();
        yml.deserialize(
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
        // no filter, so we should have all the entries
        expect(r.length).toBe(7);
        // locale is not special for this type of yml file, so it should appear in the context
        expect(r[0].getSource()).toBe("Refine Your Query");
        expect(r[0].getSourceLocale()).toBe("en-US");
        expect(r[0].getKey()).toBe("duration.top_header");
        expect(r[1].getSource()).toBe("%ACK_SAMPLE%");
        expect(r[1].getSourceLocale()).toBe("en-US");
        expect(r[1].getKey()).toBe("duration.header.person");
        expect(r[2].getSource()).toBe("%ACK_SAMPLE%");
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

    test("Yaml parse multiple levels with a filter function", () => {
        expect.assertions(22);
        var yml = new Yaml({
            filter: (key, value) => {
                if (key === "duration.variations.asdf.a") {
                    return false;
                }
                return true;
            }
        });
        expect(yml).toBeTruthy();

        yml.deserialize(
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
        // with the filter, we should not have the "a" entry
        expect(r.length).toBe(6);
        // locale is not special for this type of yml file, so it should appear in the context
        expect(r[0].getSource()).toBe("Refine Your Query");
        expect(r[0].getSourceLocale()).toBe("en-US");
        expect(r[0].getKey()).toBe("duration.top_header");
        expect(r[1].getSource()).toBe("%ACK_SAMPLE%");
        expect(r[1].getSourceLocale()).toBe("en-US");
        expect(r[1].getKey()).toBe("duration.header.person");
        expect(r[2].getSource()).toBe("%ACK_SAMPLE%");
        expect(r[2].getSourceLocale()).toBe("en-US");
        expect(r[2].getKey()).toBe("duration.header.subaccount");
        expect(r[3].getSource()).toBe("A %NAME% name?");
        expect(r[3].getSourceLocale()).toBe("en-US");
        expect(r[3].getKey()).toBe("duration.variations.person");
        expect(r[4].getSource()).toBe('A %SUBACCOUNT_NAME%\'s name?');
        expect(r[4].getSourceLocale()).toBe("en-US");
        expect(r[4].getKey()).toBe("duration.variations.subaccount");
        expect(r[5].getSource()).toBe("a b c");
        expect(r[5].getSourceLocale()).toBe("en-US");
        expect(r[5].getKey()).toBe("duration.variations.asdf.c");
    });

    test("Yaml parse simple right size", () => {
        expect.assertions(4);
        var yml = new Yaml();
        expect(yml).toBeTruthy();
        var set = yml.getTranslationSet();
        expect(set.size()).toBe(0);
        yml.deserialize(
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

    test("Yaml parse comments", () => {
        expect.assertions(19);
        var yml = new Yaml();
        expect(yml).toBeTruthy();
        var set = yml.getTranslationSet();
        expect(set.size()).toBe(0);

        yml.deserialize('#first_a comment\n' +
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

    test("Yaml parse comments with trimming", () => {
        expect.assertions(5);
        var yml = new Yaml();
        expect(yml).toBeTruthy();
        yml.deserialize('# space before\n' +
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

    test("Yaml parse comments in multiline form", () => {
        expect.assertions(5);
        var yml = new Yaml();
        expect(yml).toBeTruthy();
        yml.deserialize('first: "string"\n' +
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

    test("Yaml parse comments with a prefix", () => {
        expect.assertions(5);
        var yml = new Yaml({
            commentPrefix: "i18n: "
        });
        expect(yml).toBeTruthy();
        yml.deserialize('# i18n: space before\n' +
            'first: "string"\n' +
            '#space after \n' +
            'second: "string"\n' +
            '#   i18n:   space both multiple        \n' +
            'third: "string"');
        var set = yml.getTranslationSet();
        expect(set.size()).toBe(3);
        var r = set.getAll();
        expect(r[0].getComment()).toBe("space before");
        expect(r[1].getComment()).toBe("space after");
        expect(r[2].getComment()).toBe("space both multiple");
    });

    test("Yaml parse array", () => {
        expect.assertions(11);
        var yml = new Yaml();
        expect(yml).toBeTruthy();
        var set = yml.getTranslationSet();
        expect(set.size()).toBe(0);

        yml.deserialize(
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
        expect(r.length).toBe(1);

        expect(r[0].getType()).toBe("array");

        const entries = r[0].getSource();

        expect(entries[0]).toBe("one and");
        expect(entries[1]).toBe("two and");
        expect(entries[2]).toBe("three");
        expect(entries[3]).toBe("four");
    });

    test("Yaml parse array with comments", () => {
        expect.assertions(11);
        var yml = new Yaml();
        expect(yml).toBeTruthy();
        var set = yml.getTranslationSet();
        expect(set.size()).toBe(0);

        yml.deserialize(
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
        expect(r.length).toBe(1);

        expect(r[0].getComment()).toBe("first level comment");

        const entries = r[0].getSource();

        expect(entries[0]).toBe("one and");
        expect(entries[1]).toBe("two and");
        expect(entries[2]).toBe("three");
        expect(entries[3]).toBe("four");
    });

    test("Yaml parse with source yaml", () => {
        expect.assertions(42);

        var src = new Yaml({
            pathName: "x/y/z/foo_en-US.yaml"
        });
        expect(src).toBeTruthy();
        src.deserialize(
                '---\n' +
                "  a:\n" +
                '    r9834724545: Jobs\n' +
                '    r9483762220: Our internship program\n' +
                '    r6782977423: |\n' +
                '      Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
                '      and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
                '      directly from experienced, successful entrepreneurs.\n' +
                '  b:\n' +
                '    r4524523454: Working at MyCompany\n' +
                '    r3254356823: Jobs\n' +
                '  foo:\n' +
                '    bar:\n' +
                '      asdf:\n' +
                '        test: test of many levels\n');

        var yml = new Yaml({
            pathName: "x/y/z/foo_nl-NL.yaml",
            sourceYaml: src,
            locale: "nl-NL"
        });
        expect(yml).toBeTruthy();
        yml.deserialize(
                '---\n' +
                "  a:\n" +
                '    r9834724545: Banen\n' +
                '    r9483762220: Onzere stage programma\n' +
                '    r6782977423: |\n' +
                '      Een stage lopen bij MyCompany geeft je de kans om innovatie te ervaren\n' +
                '      en persoonlijke groei bij een van de beste bedrijven in Silicon Valley, terwijl je leert\n'+
                '      rechtstreeks van ervaren, succesvolle ondernemers.\n' +
                '  b:\n' +
                '    r4524523454: Arbeiden met MyCompany\n' +
                '    r3254356823: Banen\n' +
                '  foo:\n' +
                '    bar:\n' +
                '      asdf:\n' +
                '        test: testen van vele niveaus\n');
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getAll();
        expect(r).toBeTruthy();
        expect(r.length).toBe(6);
        // locale is not special for this type of yml file, so it should appear in the context
        expect(r[0].getSource()).toBe("Jobs");
        expect(r[0].getSourceLocale()).toBe("en-US");
        expect(r[0].getTarget()).toBe("Banen");
        expect(r[0].getTargetLocale()).toBe("nl-NL");
        expect(r[0].getKey()).toBe("a.r9834724545");
        expect(r[0].getPath()).toBe("x/y/z/foo_nl-NL.yaml");
        expect(r[0].getContext()).toBeFalsy();

        expect(r[1].getSource()).toBe("Our internship program");
        expect(r[1].getSourceLocale()).toBe("en-US");
        expect(r[1].getTarget()).toBe("Onzere stage programma");
        expect(r[1].getTargetLocale()).toBe("nl-NL");
        expect(r[1].getKey()).toBe("a.r9483762220");
        expect(r[1].getPath()).toBe("x/y/z/foo_nl-NL.yaml");

        expect(r[2].getSource()).toBe('Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
                'and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
                'directly from experienced, successful entrepreneurs.\n');
        expect(r[2].getSourceLocale()).toBe("en-US");
        expect(r[2].getTarget()).toBe('Een stage lopen bij MyCompany geeft je de kans om innovatie te ervaren\n' +
                'en persoonlijke groei bij een van de beste bedrijven in Silicon Valley, terwijl je leert\n' +
                'rechtstreeks van ervaren, succesvolle ondernemers.\n');
        expect(r[2].getTargetLocale()).toBe("nl-NL");
        expect(r[2].getKey()).toBe("a.r6782977423");
        expect(r[2].getPath()).toBe("x/y/z/foo_nl-NL.yaml");

        expect(r[3].getSource()).toBe("Working at MyCompany");
        expect(r[3].getSourceLocale()).toBe("en-US");
        expect(r[3].getTarget()).toBe("Arbeiden met MyCompany");
        expect(r[3].getTargetLocale()).toBe("nl-NL");
        expect(r[3].getKey()).toBe("b.r4524523454");
        expect(r[3].getPath()).toBe("x/y/z/foo_nl-NL.yaml");

        expect(r[4].getSource()).toBe("Jobs");
        expect(r[4].getSourceLocale()).toBe("en-US");
        expect(r[4].getTarget()).toBe("Banen");
        expect(r[4].getTargetLocale()).toBe("nl-NL");
        expect(r[4].getKey()).toBe("b.r3254356823");
        expect(r[4].getPath()).toBe("x/y/z/foo_nl-NL.yaml");

        expect(r[5].getSource()).toBe("test of many levels");
        expect(r[5].getSourceLocale()).toBe("en-US");
        expect(r[5].getTarget()).toBe("testen van vele niveaus");
        expect(r[5].getTargetLocale()).toBe("nl-NL");
        expect(r[5].getKey()).toBe("foo.bar.asdf.test");
        expect(r[5].getPath()).toBe("x/y/z/foo_nl-NL.yaml");
    });

    test("Yaml parse with source yaml and calling getResources", () => {
        expect.assertions(41);

        var src = new Yaml({
            pathName: "x/y/z/foo_en-US.yaml"
        });
        expect(src).toBeTruthy();
        src.deserialize(
                '---\n' +
                "  a:\n" +
                '    r9834724545: Jobs\n' +
                '    r9483762220: Our internship program\n' +
                '    r6782977423: |\n' +
                '      Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
                '      and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
                '      directly from experienced, successful entrepreneurs.\n' +
                '  b:\n' +
                '    r4524523454: Working at MyCompany\n' +
                '    r3254356823: Jobs\n' +
                '  foo:\n' +
                '    bar:\n' +
                '      asdf:\n' +
                '        test: test of many levels\n');

        var yml = new Yaml({
            pathName: "x/y/z/foo_nl-NL.yaml",
            sourceYaml: src,
            locale: "nl-NL"
        });
        expect(yml).toBeTruthy();
        yml.deserialize(
                '---\n' +
                "  a:\n" +
                '    r9834724545: Banen\n' +
                '    r9483762220: Onzere stage programma\n' +
                '    r6782977423: |\n' +
                '      Een stage lopen bij MyCompany geeft je de kans om innovatie te ervaren\n' +
                '      en persoonlijke groei bij een van de beste bedrijven in Silicon Valley, terwijl je leert\n'+
                '      rechtstreeks van ervaren, succesvolle ondernemers.\n' +
                '  b:\n' +
                '    r4524523454: Arbeiden met MyCompany\n' +
                '    r3254356823: Banen\n' +
                '  foo:\n' +
                '    bar:\n' +
                '      asdf:\n' +
                '        test: testen van vele niveaus\n');
        var r = yml.getResources();
        expect(r).toBeTruthy();
        expect(r.length).toBe(6);
        // locale is not special for this type of yml file, so it should appear in the context
        expect(r[0].getSource()).toBe("Jobs");
        expect(r[0].getSourceLocale()).toBe("en-US");
        expect(r[0].getTarget()).toBe("Banen");
        expect(r[0].getTargetLocale()).toBe("nl-NL");
        expect(r[0].getKey()).toBe("a.r9834724545");
        expect(r[0].getPath()).toBe("x/y/z/foo_nl-NL.yaml");
        expect(r[0].getContext()).toBeFalsy();

        expect(r[1].getSource()).toBe("Our internship program");
        expect(r[1].getSourceLocale()).toBe("en-US");
        expect(r[1].getTarget()).toBe("Onzere stage programma");
        expect(r[1].getTargetLocale()).toBe("nl-NL");
        expect(r[1].getKey()).toBe("a.r9483762220");
        expect(r[1].getPath()).toBe("x/y/z/foo_nl-NL.yaml");

        expect(r[2].getSource()).toBe('Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
                'and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
                'directly from experienced, successful entrepreneurs.\n');
        expect(r[2].getSourceLocale()).toBe("en-US");
        expect(r[2].getTarget()).toBe('Een stage lopen bij MyCompany geeft je de kans om innovatie te ervaren\n' +
                'en persoonlijke groei bij een van de beste bedrijven in Silicon Valley, terwijl je leert\n' +
                'rechtstreeks van ervaren, succesvolle ondernemers.\n');
        expect(r[2].getTargetLocale()).toBe("nl-NL");
        expect(r[2].getKey()).toBe("a.r6782977423");
        expect(r[2].getPath()).toBe("x/y/z/foo_nl-NL.yaml");

        expect(r[3].getSource()).toBe("Working at MyCompany");
        expect(r[3].getSourceLocale()).toBe("en-US");
        expect(r[3].getTarget()).toBe("Arbeiden met MyCompany");
        expect(r[3].getTargetLocale()).toBe("nl-NL");
        expect(r[3].getKey()).toBe("b.r4524523454");
        expect(r[3].getPath()).toBe("x/y/z/foo_nl-NL.yaml");

        expect(r[4].getSource()).toBe("Jobs");
        expect(r[4].getSourceLocale()).toBe("en-US");
        expect(r[4].getTarget()).toBe("Banen");
        expect(r[4].getTargetLocale()).toBe("nl-NL");
        expect(r[4].getKey()).toBe("b.r3254356823");
        expect(r[4].getPath()).toBe("x/y/z/foo_nl-NL.yaml");

        expect(r[5].getSource()).toBe("test of many levels");
        expect(r[5].getSourceLocale()).toBe("en-US");
        expect(r[5].getTarget()).toBe("testen van vele niveaus");
        expect(r[5].getTargetLocale()).toBe("nl-NL");
        expect(r[5].getKey()).toBe("foo.bar.asdf.test");
        expect(r[5].getPath()).toBe("x/y/z/foo_nl-NL.yaml");
    });

    test("Yaml parse with source yaml, copying settings from the source", () => {
        expect.assertions(53);

        var src = new Yaml({
            pathName: "x/y/z/foo_en-US.yaml",
            flavor: "flava",
            context: "yo"
        });
        expect(src).toBeTruthy();
        src.deserialize(
                '---\n' +
                "  a:\n" +
                '    r9834724545: Jobs\n' +
                '    r9483762220: Our internship program\n' +
                '    r6782977423: |\n' +
                '      Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
                '      and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
                '      directly from experienced, successful entrepreneurs.\n' +
                '  b:\n' +
                '    r4524523454: Working at MyCompany\n' +
                '    r3254356823: Jobs\n' +
                '  foo:\n' +
                '    bar:\n' +
                '      asdf:\n' +
                '        test: test of many levels\n');

        var yml = new Yaml({
            pathName: "x/y/z/foo_nl-NL.yaml",
            sourceYaml: src,
            locale: "nl-NL"
        });
        expect(yml).toBeTruthy();
        yml.deserialize(
                '---\n' +
                "  a:\n" +
                '    r9834724545: Banen\n' +
                '    r9483762220: Onzere stage programma\n' +
                '    r6782977423: |\n' +
                '      Een stage lopen bij MyCompany geeft je de kans om innovatie te ervaren\n' +
                '      en persoonlijke groei bij een van de beste bedrijven in Silicon Valley, terwijl je leert\n'+
                '      rechtstreeks van ervaren, succesvolle ondernemers.\n' +
                '  b:\n' +
                '    r4524523454: Arbeiden met MyCompany\n' +
                '    r3254356823: Banen\n' +
                '  foo:\n' +
                '    bar:\n' +
                '      asdf:\n' +
                '        test: testen van vele niveaus\n');
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getAll();
        expect(r).toBeTruthy();
        expect(r.length).toBe(6);
        // locale is not special for this type of yml file, so it should appear in the context
        expect(r[0].getSource()).toBe("Jobs");
        expect(r[0].getSourceLocale()).toBe("en-US");
        expect(r[0].getTarget()).toBe("Banen");
        expect(r[0].getTargetLocale()).toBe("nl-NL");
        expect(r[0].getKey()).toBe("a.r9834724545");
        expect(r[0].getPath()).toBe("x/y/z/foo_nl-NL.yaml");
        expect(r[0].getFlavor()).toBe("flava");
        expect(r[0].getContext()).toBe("yo");

        expect(r[1].getSource()).toBe("Our internship program");
        expect(r[1].getSourceLocale()).toBe("en-US");
        expect(r[1].getTarget()).toBe("Onzere stage programma");
        expect(r[1].getTargetLocale()).toBe("nl-NL");
        expect(r[1].getKey()).toBe("a.r9483762220");
        expect(r[1].getPath()).toBe("x/y/z/foo_nl-NL.yaml");
        expect(r[1].getFlavor()).toBe("flava");
        expect(r[1].getContext()).toBe("yo");

        expect(r[2].getSource()).toBe('Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
                'and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
                'directly from experienced, successful entrepreneurs.\n');
        expect(r[2].getSourceLocale()).toBe("en-US");
        expect(r[2].getTarget()).toBe('Een stage lopen bij MyCompany geeft je de kans om innovatie te ervaren\n' +
                'en persoonlijke groei bij een van de beste bedrijven in Silicon Valley, terwijl je leert\n' +
                'rechtstreeks van ervaren, succesvolle ondernemers.\n');
        expect(r[2].getTargetLocale()).toBe("nl-NL");
        expect(r[2].getKey()).toBe("a.r6782977423");
        expect(r[2].getPath()).toBe("x/y/z/foo_nl-NL.yaml");
        expect(r[2].getFlavor()).toBe("flava");
        expect(r[2].getContext()).toBe("yo");

        expect(r[3].getSource()).toBe("Working at MyCompany");
        expect(r[3].getSourceLocale()).toBe("en-US");
        expect(r[3].getTarget()).toBe("Arbeiden met MyCompany");
        expect(r[3].getTargetLocale()).toBe("nl-NL");
        expect(r[3].getKey()).toBe("b.r4524523454");
        expect(r[3].getPath()).toBe("x/y/z/foo_nl-NL.yaml");
        expect(r[3].getFlavor()).toBe("flava");
        expect(r[3].getContext()).toBe("yo");

        expect(r[4].getSource()).toBe("Jobs");
        expect(r[4].getSourceLocale()).toBe("en-US");
        expect(r[4].getTarget()).toBe("Banen");
        expect(r[4].getTargetLocale()).toBe("nl-NL");
        expect(r[4].getKey()).toBe("b.r3254356823");
        expect(r[4].getPath()).toBe("x/y/z/foo_nl-NL.yaml");
        expect(r[4].getFlavor()).toBe("flava");
        expect(r[4].getContext()).toBe("yo");

        expect(r[5].getSource()).toBe("test of many levels");
        expect(r[5].getSourceLocale()).toBe("en-US");
        expect(r[5].getTarget()).toBe("testen van vele niveaus");
        expect(r[5].getTargetLocale()).toBe("nl-NL");
        expect(r[5].getKey()).toBe("foo.bar.asdf.test");
        expect(r[5].getPath()).toBe("x/y/z/foo_nl-NL.yaml");
        expect(r[5].getFlavor()).toBe("flava");
        expect(r[5].getContext()).toBe("yo");
    });

    test("Yaml parse with source yaml, not overriding settings in the target", () => {
        expect.assertions(53);

        var src = new Yaml({
            pathName: "x/y/z/foo_en-US.yaml",
            flavor: "f",
            context: "context"
        });
        expect(src).toBeTruthy();
        src.deserialize(
                '---\n' +
                "  a:\n" +
                '    r9834724545: Jobs\n' +
                '    r9483762220: Our internship program\n' +
                '    r6782977423: |\n' +
                '      Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
                '      and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
                '      directly from experienced, successful entrepreneurs.\n' +
                '  b:\n' +
                '    r4524523454: Working at MyCompany\n' +
                '    r3254356823: Jobs\n' +
                '  foo:\n' +
                '    bar:\n' +
                '      asdf:\n' +
                '        test: test of many levels\n');

        var yml = new Yaml({
            pathName: "x/y/z/foo_nl-NL.yaml",
            sourceYaml: src,
            locale: "nl-NL",
            flavor: "flava",
            context: "yo"
        });
        expect(yml).toBeTruthy();
        yml.deserialize(
                '---\n' +
                "  a:\n" +
                '    r9834724545: Banen\n' +
                '    r9483762220: Onzere stage programma\n' +
                '    r6782977423: |\n' +
                '      Een stage lopen bij MyCompany geeft je de kans om innovatie te ervaren\n' +
                '      en persoonlijke groei bij een van de beste bedrijven in Silicon Valley, terwijl je leert\n'+
                '      rechtstreeks van ervaren, succesvolle ondernemers.\n' +
                '  b:\n' +
                '    r4524523454: Arbeiden met MyCompany\n' +
                '    r3254356823: Banen\n' +
                '  foo:\n' +
                '    bar:\n' +
                '      asdf:\n' +
                '        test: testen van vele niveaus\n');
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getAll();
        expect(r).toBeTruthy();
        expect(r.length).toBe(6);
        // locale is not special for this type of yml file, so it should appear in the context
        expect(r[0].getSource()).toBe("Jobs");
        expect(r[0].getSourceLocale()).toBe("en-US");
        expect(r[0].getTarget()).toBe("Banen");
        expect(r[0].getTargetLocale()).toBe("nl-NL");
        expect(r[0].getKey()).toBe("a.r9834724545");
        expect(r[0].getPath()).toBe("x/y/z/foo_nl-NL.yaml");
        expect(r[0].getFlavor()).toBe("flava");
        expect(r[0].getContext()).toBe("yo");

        expect(r[1].getSource()).toBe("Our internship program");
        expect(r[1].getSourceLocale()).toBe("en-US");
        expect(r[1].getTarget()).toBe("Onzere stage programma");
        expect(r[1].getTargetLocale()).toBe("nl-NL");
        expect(r[1].getKey()).toBe("a.r9483762220");
        expect(r[1].getPath()).toBe("x/y/z/foo_nl-NL.yaml");
        expect(r[1].getFlavor()).toBe("flava");
        expect(r[1].getContext()).toBe("yo");

        expect(r[2].getSource()).toBe('Completing an internship at MyCompany gives you the opportunity to experience innovation\n' +
                'and personal growth at one of the best companies in Silicon Valley, all while learning\n' +
                'directly from experienced, successful entrepreneurs.\n');
        expect(r[2].getSourceLocale()).toBe("en-US");
        expect(r[2].getTarget()).toBe('Een stage lopen bij MyCompany geeft je de kans om innovatie te ervaren\n' +
                'en persoonlijke groei bij een van de beste bedrijven in Silicon Valley, terwijl je leert\n' +
                'rechtstreeks van ervaren, succesvolle ondernemers.\n');
        expect(r[2].getTargetLocale()).toBe("nl-NL");
        expect(r[2].getKey()).toBe("a.r6782977423");
        expect(r[2].getPath()).toBe("x/y/z/foo_nl-NL.yaml");
        expect(r[2].getFlavor()).toBe("flava");
        expect(r[2].getContext()).toBe("yo");

        expect(r[3].getSource()).toBe("Working at MyCompany");
        expect(r[3].getSourceLocale()).toBe("en-US");
        expect(r[3].getTarget()).toBe("Arbeiden met MyCompany");
        expect(r[3].getTargetLocale()).toBe("nl-NL");
        expect(r[3].getKey()).toBe("b.r4524523454");
        expect(r[3].getPath()).toBe("x/y/z/foo_nl-NL.yaml");
        expect(r[3].getFlavor()).toBe("flava");
        expect(r[3].getContext()).toBe("yo");

        expect(r[4].getSource()).toBe("Jobs");
        expect(r[4].getSourceLocale()).toBe("en-US");
        expect(r[4].getTarget()).toBe("Banen");
        expect(r[4].getTargetLocale()).toBe("nl-NL");
        expect(r[4].getKey()).toBe("b.r3254356823");
        expect(r[4].getPath()).toBe("x/y/z/foo_nl-NL.yaml");
        expect(r[4].getFlavor()).toBe("flava");
        expect(r[4].getContext()).toBe("yo");

        expect(r[5].getSource()).toBe("test of many levels");
        expect(r[5].getSourceLocale()).toBe("en-US");
        expect(r[5].getTarget()).toBe("testen van vele niveaus");
        expect(r[5].getTargetLocale()).toBe("nl-NL");
        expect(r[5].getKey()).toBe("foo.bar.asdf.test");
        expect(r[5].getPath()).toBe("x/y/z/foo_nl-NL.yaml");
        expect(r[5].getFlavor()).toBe("flava");
        expect(r[5].getContext()).toBe("yo");
    });

    test("Yaml parse with source yaml that has missing source strings", () => {
        expect.assertions(53);

        var src = new Yaml({
            pathName: "x/y/z/foo_en-US.yaml",
            flavor: "f",
            context: "context"
        });
        expect(src).toBeTruthy();
        src.deserialize(
                '---\n' +
                "  a:\n" +
                '    r9834724545: Jobs\n' +
                '    r9483762220: Our internship program\n' +
                '  b:\n' +
                '    r3254356823: Jobs\n' +
                '  foo:\n' +
                '    bar:\n' +
                '      asdf:\n' +
                '        test: test of many levels\n');

        var yml = new Yaml({
            pathName: "x/y/z/foo_nl-NL.yaml",
            sourceYaml: src,
            locale: "nl-NL",
            flavor: "flava",
            context: "yo"
        });
        expect(yml).toBeTruthy();
        yml.deserialize(
                '---\n' +
                "  a:\n" +
                '    r9834724545: Banen\n' +
                '    r9483762220: Onzere stage programma\n' +
                '    r6782977423: |\n' +
                '      Een stage lopen bij MyCompany geeft je de kans om innovatie te ervaren\n' +
                '      en persoonlijke groei bij een van de beste bedrijven in Silicon Valley, terwijl je leert\n'+
                '      rechtstreeks van ervaren, succesvolle ondernemers.\n' +
                '  b:\n' +
                '    r4524523454: Arbeiden met MyCompany\n' +
                '    r3254356823: Banen\n' +
                '  foo:\n' +
                '    bar:\n' +
                '      asdf:\n' +
                '        test: testen van vele niveaus\n');
        var set = yml.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getAll();
        expect(r).toBeTruthy();
        expect(r.length).toBe(6);
        // locale is not special for this type of yml file, so it should appear in the context
        expect(r[0].getSource()).toBe("Jobs");
        expect(r[0].getSourceLocale()).toBe("en-US");
        expect(r[0].getTarget()).toBe("Banen");
        expect(r[0].getTargetLocale()).toBe("nl-NL");
        expect(r[0].getKey()).toBe("a.r9834724545");
        expect(r[0].getPath()).toBe("x/y/z/foo_nl-NL.yaml");
        expect(r[0].getFlavor()).toBe("flava");
        expect(r[0].getContext()).toBe("yo");

        expect(r[1].getSource()).toBe("Our internship program");
        expect(r[1].getSourceLocale()).toBe("en-US");
        expect(r[1].getTarget()).toBe("Onzere stage programma");
        expect(r[1].getTargetLocale()).toBe("nl-NL");
        expect(r[1].getKey()).toBe("a.r9483762220");
        expect(r[1].getPath()).toBe("x/y/z/foo_nl-NL.yaml");
        expect(r[1].getFlavor()).toBe("flava");
        expect(r[1].getContext()).toBe("yo");

        expect(r[2].getSource()).toBeFalsy();
        expect(r[2].getSourceLocale()).toBe("en-US");
        expect(r[2].getTarget()).toBe('Een stage lopen bij MyCompany geeft je de kans om innovatie te ervaren\n' +
                'en persoonlijke groei bij een van de beste bedrijven in Silicon Valley, terwijl je leert\n' +
                'rechtstreeks van ervaren, succesvolle ondernemers.\n');
        expect(r[2].getTargetLocale()).toBe("nl-NL");
        expect(r[2].getKey()).toBe("a.r6782977423");
        expect(r[2].getPath()).toBe("x/y/z/foo_nl-NL.yaml");
        expect(r[2].getFlavor()).toBe("flava");
        expect(r[2].getContext()).toBe("yo");

        expect(r[3].getSource()).toBeFalsy();
        expect(r[3].getSourceLocale()).toBe("en-US");
        expect(r[3].getTarget()).toBe("Arbeiden met MyCompany");
        expect(r[3].getTargetLocale()).toBe("nl-NL");
        expect(r[3].getKey()).toBe("b.r4524523454");
        expect(r[3].getPath()).toBe("x/y/z/foo_nl-NL.yaml");
        expect(r[3].getFlavor()).toBe("flava");
        expect(r[3].getContext()).toBe("yo");

        expect(r[4].getSource()).toBe("Jobs");
        expect(r[4].getSourceLocale()).toBe("en-US");
        expect(r[4].getTarget()).toBe("Banen");
        expect(r[4].getTargetLocale()).toBe("nl-NL");
        expect(r[4].getKey()).toBe("b.r3254356823");
        expect(r[4].getPath()).toBe("x/y/z/foo_nl-NL.yaml");
        expect(r[4].getFlavor()).toBe("flava");
        expect(r[4].getContext()).toBe("yo");

        expect(r[5].getSource()).toBe("test of many levels");
        expect(r[5].getSourceLocale()).toBe("en-US");
        expect(r[5].getTarget()).toBe("testen van vele niveaus");
        expect(r[5].getTargetLocale()).toBe("nl-NL");
        expect(r[5].getKey()).toBe("foo.bar.asdf.test");
        expect(r[5].getPath()).toBe("x/y/z/foo_nl-NL.yaml");
        expect(r[5].getFlavor()).toBe("flava");
        expect(r[5].getContext()).toBe("yo");
    });

    test("Yaml deserialize with flavor", () => {
        expect.assertions(15);
        var yml = new Yaml({
            project: "webapp",
            locale: "en-US",
            flavor: "CHOCOLATE"
        });
        expect(yml).toBeTruthy();
        yml.deserialize('---\n' +
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
        expect(r[0].getContext()).toBeFalsy();
        expect(r[0].getFlavor()).toBe("CHOCOLATE");
        expect(r[1].getSource()).toBe("barfoo");
        expect(r[1].getSourceLocale()).toBe("en-US");
        expect(r[1].getKey()).toBe("b");
        expect(r[1].getContext()).toBeFalsy();
        expect(r[1].getFlavor()).toBe("CHOCOLATE");
    });

    test("Yaml deserialize with no flavor", () => {
        expect.assertions(15);

        var yml = new Yaml({
            project: "webapp",
            locale: "en-US"
        });
        expect(yml).toBeTruthy();
        yml.deserialize('---\n' +
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
        expect(r[0].getContext()).toBeFalsy();
        expect(r[0].getFlavor()).toBeFalsy();
        expect(r[1].getSource()).toBe("barfoo");
        expect(r[1].getSourceLocale()).toBe("en-US");
        expect(r[1].getKey()).toBe("b");
        expect(r[1].getContext()).toBeFalsy();
        expect(r[1].getFlavor()).toBeFalsy();
    });

    test("Yaml deserialize target with no flavor", () => {
        expect.assertions(17);

        var yml = new Yaml({
            project: "webapp",
            sourceLocale: "en-US",
            locale: "es-US"
        });
        expect(yml).toBeTruthy();
        yml.deserialize('---\n' +
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
        expect(r[0].getContext()).toBeFalsy();
        expect(r[0].getFlavor()).toBeFalsy();
        expect(r[1].getTarget()).toBe("barfoo");
        expect(r[1].getTargetLocale()).toBe("es-US");
        expect(r[1].getSourceLocale()).toBe("en-US");
        expect(r[1].getKey()).toBe("b");
        expect(r[1].getContext()).toBeFalsy();
        expect(r[1].getFlavor()).toBeFalsy();
    });
});

describe("yaml serialize tests", () => {
    test("Yaml add resources", () => {
        expect.assertions(3);

        var yml = new Yaml({
            project: "webapp",
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
        ].forEach(res => {
            expect(yml.addResource(res)).toBe(true);
        });
    });

    test("Yaml add resources rejects resources with the wrong project name", () => {
        expect.assertions(3);

        var yml = new Yaml({
            project: "webapp",
            pathName: "./asdf.yml",
            locale: "de-DE"
        });
        expect(yml).toBeTruthy();
        [
            new ResourceString({
                project: "a",
                sourceLocale: "de-DE",
                key: "source_text",
                source: "Quellen\"text",
                comment: "foo",
                path: "asdf.yml",
                context: "asdf.yml"
            }),
            new ResourceString({
                project: "b",
                sourceLocale: "de-DE",
                key: "more_source_text",
                source: "mehr Quellen\"text",
                comment: "bar",
                path: "asdf.yml",
                context: "asdf.yml"
            })
        ].forEach(res => {
            expect(yml.addResource(res)).toBe(false);
        });
    });

    test("Yaml add resources rejects resources that are not objects", () => {
        expect.assertions(5);

        var yml = new Yaml({
            project: "webapp",
            pathName: "./asdf.yml",
            locale: "de-DE"
        });
        expect(yml).toBeTruthy();
        [
            undefined,
            null,
            true,
            4.0
        ].forEach(res => {
            expect(yml.addResource(res)).toBe(false);
        });
    });

    test("Yaml add resource and then serialize", () => {
        expect.assertions(4);

        var yml = new Yaml({
            project: "webapp",
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
        ].forEach(res => {
            expect(yml.addResource(res)).toBe(true);
        });
        const actual = yml.serialize();
        const expected =
            'more_source_text: mehr Quellen\"text\n' +
            'source_text: Quellen\"text\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("Yaml add resources as an array and then serialize", () => {
        expect.assertions(3);
        var yml = new Yaml({
            project: "webapp",
            pathName: "./asdf.yml",
            locale: "de-DE"
        });
        expect(yml).toBeTruthy();
        expect(yml.addResources([
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
        ])).toBe(true);
        const actual = yml.serialize();
        const expected =
            'more_source_text: mehr Quellen\"text\n' +
            'source_text: Quellen\"text\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("Yaml add multilevel resource and then serialize", () => {
        expect.assertions(4);

        var yml = new Yaml({
            project: "webapp",
            pathName: "./asdf.yml",
            locale: "de-DE"
        });
        expect(yml).toBeTruthy();
        [
            new ResourceString({
                project: "webapp",
                sourceLocale: "de-DE",
                key: "a.b.source_text",
                source: "Quellen\"text",
                comment: "foo",
                path: "asdf.yml",
                context: "asdf.yml"
            }),
            new ResourceString({
                project: "webapp",
                sourceLocale: "de-DE",
                key: "a.c.more_source_text",
                source: "mehr Quellen\"text",
                comment: "bar",
                path: "asdf.yml",
                context: "asdf.yml"
            })
        ].forEach(res => {
            expect(yml.addResource(res)).toBe(true);
        });
        const actual = yml.serialize();
        const expected =
            'a:\n' +
            '  b:\n' +
            '    source_text: Quellen\"text\n' +
            '  c:\n' +
            '    more_source_text: mehr Quellen\"text\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("Yaml serialize something complicated", () => {
        expect.assertions(4);
        var yml = new Yaml({
            project: "webapp",
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
            expect(yml.addResource(res)).toBe(true);
        });
        var expected =
            '"&apos;&#41;, url&#40;imgs/masks/top_bar": "&apos;&#41;, url&#40;imgs/masks/top_bar康生活相"\n' +
            '• &amp;nbsp; Address a particular topic: • &amp;nbsp; 解决一个特定的主题\n';
        diff(yml.serialize(), expected);
        expect(yml.serialize()).toBe(expected);
    });

    test("Yaml serialize with newlines", () => {
        expect.assertions(4);
        var yml = new Yaml({
            project: "webapp",
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
            expect(yml.addResource(res)).toBe(true);
        });
        var expected =
            "\"A very long key that happens to have \\n new line characters in the middle of it. Very very long. How long is it? It's so long that it won't even fit in 64 bits.\": short text\n" +
            "short key: |-\n" +
            "  this is text that is relatively long and can run past the end of the page\n" +
            "  So, we put a new line in the middle of it.\n";
        diff(yml.serialize(), expected);
        expect(yml.serialize()).toBe(expected);
    });

    test("Yaml serialize with subkeys", () => {
        expect.assertions(4);
        var yml = new Yaml({
            project: "webapp",
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
            expect(yml.addResource(res)).toBe(true);
        });
        var expected =
            "foo:\n" +
            "  bar:\n" +
            "    asdf:\n" +
            "      key2: short text\n" +
            "    key1: medium length text that doesn't go beyond one line\n";
        diff(yml.serialize(), expected);
        expect(yml.serialize()).toBe(expected);
    });

    test("Yaml serialize empty", () => {
        expect.assertions(2);
        var yml = new Yaml({
            project: "webapp",
            pathName: "./asdf.yml",
            locale: "de-DE"
        });
        expect(yml).toBeTruthy();
        expect(yml.serialize()).toBe('{}\n');
    });
});

describe("yaml tests comment prefixes", () => {
    test("Yaml get comment prefix", () => {
        expect.assertions(2);
        var yml = new Yaml({
            project: "foobar",
            pathName: "source.yaml",
            commentPrefix: "L10N:"
        });
        expect(yml).toBeTruthy();
        expect(yml.getCommentPrefix()).toBe("L10N:");
    });

    test("Yaml get comment prefix not provided", () => {
        expect.assertions(2);
        var yml = new Yaml({
            project: "foobar",
            pathName: "random.yaml"
        });
        expect(yml).toBeTruthy();
        expect(yml.getCommentPrefix()).toBeUndefined();
    });

    test("Yaml parse prefixed comments", () => {
        expect.assertions(5);

        var yml = new Yaml({
            project: "foobar",
            pathName: "source.yaml",
            commentPrefix: "L10N:"
        });
        expect(yml).toBeTruthy();
        yml.deserialize('#L10N: Prefixed comment\n' +
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
        expect(r[2].getComment()).toBe("Not prefixed comment with L10N in it");
    });
});
