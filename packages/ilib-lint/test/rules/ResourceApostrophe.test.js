/*
 * ResourceApostrophe.test.js - test the resource-apostrophe rule
 *
 * Copyright © 2025 JEDLSoft
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

import { ResourceArray, ResourcePlural, ResourceString } from 'ilib-tools-common';
import ResourceTargetChecker from '../../src/rules/ResourceTargetChecker.js';
import { regexRules } from '../../src/plugins/BuiltinPlugin.js';
import { IntermediateRepresentation, SourceFile } from 'ilib-lint-common';
import ResourceFixer from '../../src/plugins/resource/ResourceFixer.js';

const rule = regexRules.find(rule => rule?.name === "resource-apostrophe");

describe("resource-apostrophe rule", () => {
    test("detects ASCII straight quotes used as apostrophes", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.test",
            sourceLocale: "en-US",
            targetLocale: "en-GB",
            source: "It's a test.",
            target: "It\'s a test.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        expect(results.length).toBe(1);
        const result = results[0];
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.test");
        expect(result.description).toBe("The word \"It's\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>It's</e0> a test.");
        expect(result.source).toBe("It's a test.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("returns undefined if the target string uses the correct Unicode apostrophe", () => {
        expect.assertions(1);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.test",
            sourceLocale: "en-US",
            targetLocale: "en-GB",
            source: "It's a test.",
            target: "It\u2019s a test.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeUndefined();
    });

    test("detects ASCII straight quotes in GB English", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.english",
            sourceLocale: "en-US",
            targetLocale: "en-GB",
            source: "It's a beautiful day.",
            target: "It's a beautiful day.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.english");
        expect(result.description).toBe("The word \"It's\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>It's</e0> a beautiful day.");
        expect(result.source).toBe("It's a beautiful day.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in French", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.french",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            source: "It's summer.",
            target: "C'est l\u2019été.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.french");
        expect(result.description).toBe("The word \"C'est\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>C'est</e0> l\u2019été.");
        expect(result.source).toBe("It's summer.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in German", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.german",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            source: "That it is good.",
            target: "Dass's gut ist.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.german");
        expect(result.description).toBe("The word \"Dass's\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>Dass's</e0> gut ist.");
        expect(result.source).toBe("That it is good.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in Italian", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.italian",
            sourceLocale: "en-US",
            targetLocale: "it-IT",
            source: "The friend has arrived.",
            target: "L'amico è arrivato.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.italian");
        expect(result.description).toBe("The word \"L'amico\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>L'amico</e0> è arrivato.");
        expect(result.source).toBe("The friend has arrived.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in Spanish", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.spanish",
            sourceLocale: "en-US",
            targetLocale: "es-ES",
            source: "D'Artagnan is a famous character.",
            target: "D'Artagnan es un personaje famoso.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.spanish");
        expect(result.description).toBe("The word \"D'Artagnan\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>D'Artagnan</e0> es un personaje famoso.");
        expect(result.source).toBe("D'Artagnan is a famous character.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in Hawaiian", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.hawaiian",
            sourceLocale: "en-US",
            targetLocale: "haw-US",
            source: "Ka'u is a district on the Big Island.",
            target: "O Ka\'u ka moku ma ka Mokupuni Nui.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.hawaiian");
        expect(result.description).toBe("The word \"Ka'u\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: O <e0>Ka'u</e0> ka moku ma ka Mokupuni Nui.");
        expect(result.source).toBe("Ka'u is a district on the Big Island.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in Samoan", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.samoan",
            sourceLocale: "en-US",
            targetLocale: "sm-WS",
            source: "The school is near the house.",
            target: "O le a'oga e latalata i le fale.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.samoan");
        expect(result.description).toBe("The word \"a'oga\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: O le <e0>a'oga</e0> e latalata i le fale.");
        expect(result.source).toBe("The school is near the house.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in Tongan", () => {
        expect.assertions(14);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.tongan",
            sourceLocale: "en-US",
            targetLocale: "to-TO",
            source: "The value is important.",
            target: "Ko e fakau'a 'oku mahu'inga.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        expect(results.length).toBe(2);

        const result1 = results[0];
        expect(result1.severity).toBe("error");
        expect(result1.id).toBe("apostrophe.tongan");
        expect(result1.description).toBe("The word \"fakau'a\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result1.highlight).toBe("Target: Ko e <e0>fakau'a</e0> 'oku mahu'inga.");
        expect(result1.source).toBe("The value is important.");
        expect(result1.pathName).toBe("a/b/c.xliff");

        // ignore the word 'oku because we can't tell if it's an apostrophe or a quote symbol
        
        const result2 = results[1];
        expect(result2.severity).toBe("error");
        expect(result2.id).toBe("apostrophe.tongan");
        expect(result2.description).toBe("The word \"mahu'inga\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result2.highlight).toBe("Target: Ko e fakau'a 'oku <e0>mahu'inga</e0>.");
        expect(result2.source).toBe("The value is important.");
        expect(result2.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in Guarani", () => {
        expect.assertions(14);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.guarani",
            sourceLocale: "en-US",
            targetLocale: "gn-PY",
            source: "Language is a tool.",
            target: "Ñe'ẽ ha'e peteĩ tembiporu.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        expect(results.length).toBe(2);

        const result1 = results[0];
        expect(result1.severity).toBe("error");
        expect(result1.id).toBe("apostrophe.guarani");
        expect(result1.description).toBe("The word \"Ñe'ẽ\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result1.highlight).toBe("Target: <e0>Ñe'ẽ</e0> ha'e peteĩ tembiporu.");
        expect(result1.source).toBe("Language is a tool.");
        expect(result1.pathName).toBe("a/b/c.xliff");

        const result2 = results[1];
        expect(result2.severity).toBe("error");
        expect(result2.id).toBe("apostrophe.guarani");
        expect(result2.description).toBe("The word \"ha'e\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result2.highlight).toBe("Target: Ñe'ẽ <e0>ha'e</e0> peteĩ tembiporu.");
        expect(result2.source).toBe("Language is a tool.");
        expect(result2.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in Finnish", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.finnish",
            sourceLocale: "en-US",
            targetLocale: "fi-FI",
            source: "The taste of raw meat is strong.",
            target: "Raa'an lihan maku on voimakas.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.finnish");
        expect(result.description).toBe("The word \"Raa'an\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>Raa'an</e0> lihan maku on voimakas.");
        expect(result.source).toBe("The taste of raw meat is strong.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in Estonian", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.estonian",
            sourceLocale: "en-US",
            targetLocale: "et-EE",
            source: "I am here.",
            target: "Ma's siin.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.estonian");
        expect(result.description).toBe("The word \"Ma's\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>Ma's</e0> siin.");
        expect(result.source).toBe("I am here.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in Turkish", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.turkish",
            sourceLocale: "en-US",
            targetLocale: "tr-TR",
            source: "The population of Istanbul is increasing.",
            target: "İstanbul'un nüfusu artıyor.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.turkish");
        expect(result.description).toBe("The word \"İstanbul'un\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>İstanbul'un</e0> nüfusu artıyor.");
        expect(result.source).toBe("The population of Istanbul is increasing.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in Welsh", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.welsh",
            sourceLocale: "en-US",
            targetLocale: "cy-GB",
            source: "It's nice today.",
            target: "Mae'n braf heddiw.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.welsh");
        expect(result.description).toBe("The word \"Mae'n\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>Mae'n</e0> braf heddiw.");
        expect(result.source).toBe("It's nice today.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in Irish", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.irish",
            sourceLocale: "en-US",
            targetLocale: "ga-IE",
            source: "You are here.",
            target: "Tá's anseo.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.irish");
        expect(result.description).toBe("The word \"Tá's\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>Tá's</e0> anseo.");
        expect(result.source).toBe("You are here.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in Catalan", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.catalan",
            sourceLocale: "en-US",
            targetLocale: "ca-ES",
            source: "The man is happy.",
            target: "L'home està content.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.catalan");
        expect(result.description).toBe("The word \"L'home\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>L'home</e0> està content.");
        expect(result.source).toBe("The man is happy.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in Portuguese", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.portuguese",
            sourceLocale: "en-US",
            targetLocale: "pt-PT",
            source: "Where are you from?",
            target: "D'onde você é?",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.portuguese");
        expect(result.description).toBe("The word \"D'onde\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>D'onde</e0> você é?");
        expect(result.source).toBe("Where are you from?");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in Albanian", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.albanian",
            sourceLocale: "en-US",
            targetLocale: "sq-AL",
            source: "No problem.",
            target: "S'ka problem.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.albanian");
        expect(result.description).toBe("The word \"S'ka\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>S'ka</e0> problem.");
        expect(result.source).toBe("No problem.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });



    // Additional language tests for apostrophe usage
    test("detects ASCII straight quotes in Swedish", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.swedish",
            sourceLocale: "en-US",
            targetLocale: "sv-SE",
            source: "The house is big.",
            target: "Hus'et är stort.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.swedish");
        expect(result.description).toBe("The word \"Hus'et\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>Hus'et</e0> är stort.");
        expect(result.source).toBe("The house is big.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in Norwegian", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.norwegian",
            sourceLocale: "en-US",
            targetLocale: "no-NO",
            source: "The book is good.",
            target: "Bok'a er god.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.norwegian");
        expect(result.description).toBe("The word \"Bok'a\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>Bok'a</e0> er god.");
        expect(result.source).toBe("The book is good.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in Icelandic", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.icelandic",
            sourceLocale: "en-US",
            targetLocale: "is-IS",
            source: "The mountain is high.",
            target: "Fjall'ið er hátt.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.icelandic");
        expect(result.description).toBe("The word \"Fjall'ið\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>Fjall'ið</e0> er hátt.");
        expect(result.source).toBe("The mountain is high.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in Faroese", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.faroese",
            sourceLocale: "en-US",
            targetLocale: "fo-FO",
            source: "The fish is fresh.",
            target: "Fisk'urin er ferskur.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.faroese");
        expect(result.description).toBe("The word \"Fisk'urin\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>Fisk'urin</e0> er ferskur.");
        expect(result.source).toBe("The fish is fresh.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });







    test("detects ASCII straight quotes in Manx", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.manx",
            sourceLocale: "en-US",
            targetLocale: "gv-IM",
            source: "The cat is sleeping.",
            target: "Ta'n kayt cadley.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.manx");
        expect(result.description).toBe("The word \"Ta'n\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>Ta'n</e0> kayt cadley.");
        expect(result.source).toBe("The cat is sleeping.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in Scottish Gaelic", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.scottish_gaelic",
            sourceLocale: "en-US",
            targetLocale: "gd-GB",
            source: "The dog is running.",
            target: "Tha'n cù a' ruith.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.scottish_gaelic");
        expect(result.description).toBe("The word \"Tha'n\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>Tha'n</e0> cù a' ruith.");
        expect(result.source).toBe("The dog is running.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    // Tests for Slavic languages with apostrophe usage
    test("detects ASCII straight quotes in Ukrainian", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.ukrainian",
            sourceLocale: "en-US",
            targetLocale: "uk-UA",
            source: "The computer is working.",
            target: "Комп'ютер працює.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.ukrainian");
        expect(result.description).toBe("The word \"Комп'ютер\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>Комп'ютер</e0> працює.");
        expect(result.source).toBe("The computer is working.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in Belarusian", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.belarusian",
            sourceLocale: "en-US",
            targetLocale: "be-BY",
            source: "The language is beautiful.",
            target: "Мо'ва прыгожая.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.belarusian");
        expect(result.description).toBe("The word \"Мо'ва\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>Мо'ва</e0> прыгожая.");
        expect(result.source).toBe("The language is beautiful.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in Bulgarian", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.bulgarian",
            sourceLocale: "en-US",
            targetLocale: "bg-BG",
            source: "The word is short.",
            target: "Ду'мата е кратка.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.bulgarian");
        expect(result.description).toBe("The word \"Ду'мата\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>Ду'мата</e0> е кратка.");
        expect(result.source).toBe("The word is short.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    // Tests for Baltic languages
    test("detects ASCII straight quotes in Lithuanian", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.lithuanian",
            sourceLocale: "en-US",
            targetLocale: "lt-LT",
            source: "The house is old.",
            target: "Nama's senas.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.lithuanian");
        expect(result.description).toBe("The word \"Nama's\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>Nama's</e0> senas.");
        expect(result.source).toBe("The house is old.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in Latvian", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.latvian",
            sourceLocale: "en-US",
            targetLocale: "lv-LV",
            source: "The book is interesting.",
            target: "Grā'mata ir interesanta.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.latvian");
        expect(result.description).toBe("The word \"Grā'mata\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>Grā'mata</e0> ir interesanta.");
        expect(result.source).toBe("The book is interesting.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    // Tests for Celtic languages with different apostrophe patterns
    test("detects ASCII straight quotes in Irish with eclipsis", () => {
        expect.assertions(1);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.irish_eclipsis",
            sourceLocale: "en-US",
            targetLocale: "ga-IE",
            source: "The cat is black.",
            target: "Tá an gcat dubh.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeUndefined();
    });

    // Tests for African languages with apostrophe usage
    test("detects ASCII straight quotes in Swahili", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.swahili",
            sourceLocale: "en-US",
            targetLocale: "sw-KE",
            source: "The child is sleeping.",
            target: "Mtoto'a amelala.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.swahili");
        expect(result.description).toBe("The word \"Mtoto'a\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>Mtoto'a</e0> amelala.");
        expect(result.source).toBe("The child is sleeping.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in Zulu", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.zulu",
            sourceLocale: "en-US",
            targetLocale: "zu-ZA",
            source: "The man is working.",
            target: "Indoda'yisebenza.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.zulu");
        expect(result.description).toBe("The word \"Indoda'yisebenza\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>Indoda'yisebenza</e0>.");
        expect(result.source).toBe("The man is working.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    // Tests for Middle Eastern languages
    test("detects ASCII straight quotes in Hebrew", () => {
        expect.assertions(1);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.hebrew",
            sourceLocale: "en-US",
            targetLocale: "he-IL",
            source: "The book is on the table.",
            target: "הספר על השולחן.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeUndefined();
    });

    test("detects ASCII straight quotes in Arabic", () => {
        expect.assertions(1);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.arabic",
            sourceLocale: "en-US",
            targetLocale: "ar-SA",
            source: "The house is big.",
            target: "البيت كبير.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeUndefined();
    });

    // Tests for different apostrophe usage patterns
    test("detects multiple ASCII straight quotes in a single string", () => {
        expect.assertions(14);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.multiple",
            sourceLocale: "en-US",
            targetLocale: "en-US",
            source: "Don't forget to check the user's settings.",
            target: "Don't forget to check the user's settings.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        expect(results.length).toBe(2);

        const result1 = results[0];
        expect(result1.severity).toBe("error");
        expect(result1.id).toBe("apostrophe.multiple");
        expect(result1.description).toBe("The word \"Don't\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result1.highlight).toBe("Target: <e0>Don't</e0> forget to check the user's settings.");
        expect(result1.source).toBe("Don't forget to check the user's settings.");
        expect(result1.pathName).toBe("a/b/c.xliff");

        const result2 = results[1];
        expect(result2.severity).toBe("error");
        expect(result2.id).toBe("apostrophe.multiple");
        expect(result2.description).toBe("The word \"user's\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result2.highlight).toBe("Target: Don't forget to check the <e0>user's</e0> settings.");
        expect(result2.source).toBe("Don't forget to check the user's settings.");
        expect(result2.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in possessive forms", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.possessive",
            sourceLocale: "en-US",
            targetLocale: "en-US",
            source: "The children's toys are broken.",
            target: "The children's toys are broken.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.possessive");
        expect(result.description).toBe("The word \"children's\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: The <e0>children's</e0> toys are broken.");
        expect(result.source).toBe("The children's toys are broken.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in contractions with numbers", () => {
        expect.assertions(14);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.contraction_numbers",
            sourceLocale: "en-US",
            targetLocale: "en-US",
            source: "It's 2024 and we're ready.",
            target: "It's 2024 and we're ready.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        expect(results.length).toBe(2);

        const result1 = results[0];
        expect(result1.severity).toBe("error");
        expect(result1.id).toBe("apostrophe.contraction_numbers");
        expect(result1.description).toBe("The word \"It's\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result1.highlight).toBe("Target: <e0>It's</e0> 2024 and we're ready.");
        expect(result1.source).toBe("It's 2024 and we're ready.");
        expect(result1.pathName).toBe("a/b/c.xliff");

        const result2 = results[1];
        expect(result2.severity).toBe("error");
        expect(result2.id).toBe("apostrophe.contraction_numbers");
        expect(result2.description).toBe("The word \"we're\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result2.highlight).toBe("Target: It's 2024 and <e0>we're</e0> ready.");
        expect(result2.source).toBe("It's 2024 and we're ready.");
        expect(result2.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in French elision", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.french_elision",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            source: "The apple is red.",
            target: "La pomme est rouge. L'homme mange.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.french_elision");
        expect(result.description).toBe("The word \"L'homme\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: La pomme est rouge. <e0>L'homme</e0> mange.");
        expect(result.source).toBe("The apple is red.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in Italian elision", () => {
        expect.assertions(14);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.italian_elision",
            sourceLocale: "en-US",
            targetLocale: "it-IT",
            source: "The friend is here.",
            target: "L'amico è qui. D'accordo!",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        expect(results.length).toBe(2);

        const result1 = results[0];
        expect(result1.severity).toBe("error");
        expect(result1.id).toBe("apostrophe.italian_elision");
        expect(result1.description).toBe("The word \"L'amico\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result1.highlight).toBe("Target: <e0>L'amico</e0> è qui. D'accordo!");
        expect(result1.source).toBe("The friend is here.");
        expect(result1.pathName).toBe("a/b/c.xliff");

        const result2 = results[1];
        expect(result2.severity).toBe("error");
        expect(result2.id).toBe("apostrophe.italian_elision");
        expect(result2.description).toBe("The word \"D'accordo\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result2.highlight).toBe("Target: L'amico è qui. <e0>D'accordo</e0>!");
        expect(result2.source).toBe("The friend is here.");
        expect(result2.pathName).toBe("a/b/c.xliff");
    });

    // Tests for edge cases and special scenarios
    test("handles strings with no apostrophes correctly", () => {
        expect.assertions(1);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.none",
            sourceLocale: "en-US",
            targetLocale: "en-GB",
            source: "This string has no apostrophes.",
            target: "This string has no apostrophes.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeUndefined();
    });

    test("handles strings with only Unicode apostrophes correctly", () => {
        expect.assertions(1);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.unicode_only",
            sourceLocale: "en-US",
            targetLocale: "en-GB",
            source: "It\u2019s a beautiful day.",
            target: "It\u2019s a beautiful day.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeUndefined();
    });

    // Tests for languages that don't use apostrophes
    test("handles languages without apostrophes correctly", () => {
        expect.assertions(1);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.no_apostrophe_lang",
            sourceLocale: "en-US",
            targetLocale: "ja-JP",
            source: "The book is on the table.",
            target: "本は机の上にあります。",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeUndefined();
    });

    test("handles Chinese languages correctly", () => {
        expect.assertions(1);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.chinese",
            sourceLocale: "en-US",
            targetLocale: "zh-CN",
            source: "The computer is working.",
            target: "电脑正在工作。",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeUndefined();
    });

    test("handles Korean correctly", () => {
        expect.assertions(1);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.korean",
            sourceLocale: "en-US",
            targetLocale: "ko-KR",
            source: "The weather is nice.",
            target: "날씨가 좋습니다.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeUndefined();
    });

    // Tests for special apostrophe usage in specific contexts


    test("detects ASCII straight quotes in business contexts", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.business",
            sourceLocale: "en-US",
            targetLocale: "en-US",
            source: "The company's profits increased.",
            target: "The company's profits increased.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.business");
        expect(result.description).toBe("The word \"company's\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: The <e0>company's</e0> profits increased.");
        expect(result.source).toBe("The company's profits increased.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    // Tests for additional European languages
    test("detects ASCII straight quotes in Romanian", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.romanian",
            sourceLocale: "en-US",
            targetLocale: "ro-RO",
            source: "The man is working.",
            target: "Bărba'ul lucrează.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.romanian");
        expect(result.description).toBe("The word \"Bărba'ul\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>Bărba'ul</e0> lucrează.");
        expect(result.source).toBe("The man is working.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in Hungarian", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.hungarian",
            sourceLocale: "en-US",
            targetLocale: "hu-HU",
            source: "The book is interesting.",
            target: "A köny'v érdekes.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.hungarian");
        expect(result.description).toBe("The word \"köny'v\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: A <e0>köny'v</e0> érdekes.");
        expect(result.source).toBe("The book is interesting.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in Czech", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.czech",
            sourceLocale: "en-US",
            targetLocale: "cs-CZ",
            source: "The word is long.",
            target: "Slov'o je dlouhé.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.czech");
        expect(result.description).toBe("The word \"Slov'o\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>Slov'o</e0> je dlouhé.");
        expect(result.source).toBe("The word is long.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in Slovak", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.slovak",
            sourceLocale: "en-US",
            targetLocale: "sk-SK",
            source: "The house is big.",
            target: "Dom'o je veľký.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.slovak");
        expect(result.description).toBe("The word \"Dom'o\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>Dom'o</e0> je veľký.");
        expect(result.source).toBe("The house is big.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in Polish", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.polish",
            sourceLocale: "en-US",
            targetLocale: "pl-PL",
            source: "The book is good.",
            target: "Książ'ka jest dobra.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.polish");
        expect(result.description).toBe("The word \"Książ'ka\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>Książ'ka</e0> jest dobra.");
        expect(result.source).toBe("The book is good.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    // Tests for additional Pacific languages




    // Tests for special apostrophe usage in indigenous languages
    test("detects ASCII straight quotes in Inuktitut", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.inuktitut",
            sourceLocale: "en-US",
            targetLocale: "iu-CA",
            source: "The snow is white.",
            target: "Aputi'k qaqulluniq.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.inuktitut");
        expect(result.description).toBe("The word \"Aputi'k\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>Aputi'k</e0> qaqulluniq.");
        expect(result.source).toBe("The snow is white.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    // Tests for edge cases with special characters
    test("handles strings with emojis and apostrophes correctly", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.emoji",
            sourceLocale: "en-US",
            targetLocale: "en-GB",
            source: "It's a great day! 😊",
            target: "It's a great day! 😊",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.emoji");
        expect(result.description).toBe("The word \"It's\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>It's</e0> a great day! 😊");
        expect(result.source).toBe("It's a great day! 😊");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("handles strings with special Unicode characters correctly", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.unicode_special",
            sourceLocale: "en-US",
            targetLocale: "en-GB",
            source: "The café's menu is excellent.",
            target: "The café's menu is excellent.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.unicode_special");
        expect(result.description).toBe("The word \"café's\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: The <e0>café's</e0> menu is excellent.");
        expect(result.source).toBe("The café's menu is excellent.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    // Tests for different file types and contexts
    test("works correctly with different file extensions", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.different_file",
            sourceLocale: "en-US",
            targetLocale: "en-GB",
            source: "The user's profile is updated.",
            target: "The user's profile is updated.",
            pathName: "src/components/UserProfile.jsx"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "src/components/UserProfile.jsx"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.different_file");
        expect(result.description).toBe("The word \"user's\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: The <e0>user's</e0> profile is updated.");
        expect(result.source).toBe("The user's profile is updated.");
        expect(result.pathName).toBe("src/components/UserProfile.jsx");
    });

    // Tests for different source locales
    test("works correctly with different source locales", () => {
        expect.assertions(1);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.different_source",
            sourceLocale: "fr-FR",
            targetLocale: "en-US",
            source: "L'homme est grand.",
            target: "The man is tall.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeUndefined();
    });

    // Tests for fixer functionality
    test("applies fixes for ASCII straight quotes in German text", () => {
        expect.assertions(4);

        const rule = new ResourceTargetChecker(regexRules.find(rule => rule?.name === "resource-apostrophe"));
        expect(rule).toBeTruthy();
        const fixer = new ResourceFixer();

        const resource = new ResourceString({
            key: "apostrophe.fixer.german",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            source: "That it is good.",
            target: "Dass's gut ist.",
            pathName: "a/b/c.xliff"
        });

        const results = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        expect(results.length).toBe(1);

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("a/b/c.xliff", {}),
            dirty: false
        });
        fixer.applyFixes(ir, results.map(result => result.fix));

        // Should be replaced with Unicode apostrophe
        expect(resource.getTarget()).toBe("Dass\u2019s gut ist.");
    });

    test("applies fixes for ASCII straight quotes in French elision", () => {
        expect.assertions(4);

        const rule = new ResourceTargetChecker(regexRules.find(rule => rule?.name === "resource-apostrophe"));
        expect(rule).toBeTruthy();
        const fixer = new ResourceFixer();

        const resource = new ResourceString({
            key: "apostrophe.fixer.french",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            source: "The man is eating.",
            target: "L\'homme mange.",
            pathName: "a/b/c.xliff"
        });

        const results = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        expect(results.length).toBe(1);

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("a/b/c.xliff", {}),
            dirty: false
        });
        fixer.applyFixes(ir, results.map(result => result.fix));

        // Should be replaced with Unicode apostrophe
        expect(resource.getTarget()).toBe("L\u2019homme mange.");
    });

    test("applies fixes for multiple ASCII straight quotes in a single string", () => {
        expect.assertions(4);

        const rule = new ResourceTargetChecker(regexRules.find(rule => rule?.name === "resource-apostrophe"));
        expect(rule).toBeTruthy();
        const fixer = new ResourceFixer();

        const resource = new ResourceString({
            key: "apostrophe.fixer.multiple",
            sourceLocale: "en-US",
            targetLocale: "es-ES",
            source: "The man's car from here is here.",
            target: "El coche d\'el hombre d\'aqui está aquí.",
            pathName: "a/b/c.xliff"
        });

        const results = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        expect(results.length).toBe(2);

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("a/b/c.xliff", {}),
            dirty: false
        });
        fixer.applyFixes(ir, results.map(result => result.fix));

        // Should be replaced with Unicode apostrophes
        expect(resource.getTarget()).toBe("El coche d\u2019el hombre d\u2019aqui está aquí.");
    });

    test("applies fixes for ASCII straight quotes in possessive forms", () => {
        expect.assertions(4);

        const rule = new ResourceTargetChecker(regexRules.find(rule => rule?.name === "resource-apostrophe"));
        expect(rule).toBeTruthy();
        const fixer = new ResourceFixer();

        const resource = new ResourceString({
            key: "apostrophe.fixer.possessive",
            sourceLocale: "en-US",
            targetLocale: "pt-BR",
            source: "The woman's house and the man's car are beautiful.",
            target: "A casa d\'a mulher e o carro d\'o homem são bonitos.",
            pathName: "a/b/c.xliff"
        });

        const results = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        expect(results.length).toBe(2);

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("a/b/c.xliff", {}),
            dirty: false
        });
        fixer.applyFixes(ir, results.map(result => result.fix));

        // Should be replaced with Unicode apostrophes
        expect(resource.getTarget()).toBe("A casa d\u2019a mulher e o carro d\u2019o homem são bonitos.");
    });

    test("applies fixes for ASCII straight quotes in Hawaiian place names", () => {
        expect.assertions(4);

        const rule = new ResourceTargetChecker(regexRules.find(rule => rule?.name === "resource-apostrophe"));
        expect(rule).toBeTruthy();
        const fixer = new ResourceFixer();

        const resource = new ResourceString({
            key: "apostrophe.fixer.hawaiian",
            sourceLocale: "en-US",
            targetLocale: "haw-US",
            source: "Ka'u is a district on the Big Island.",
            target: "ʻO Ka\'u ka moku ma ka Mokupuni Nui.",
            pathName: "a/b/c.xliff"
        });

        const results = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        expect(results.length).toBe(1);

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("a/b/c.xliff", {}),
            dirty: false
        });
        fixer.applyFixes(ir, results.map(result => result.fix));

        // Should be replaced with Unicode apostrophe
        expect(resource.getTarget()).toBe("ʻO Ka\u2019u ka moku ma ka Mokupuni Nui.");
    });

    test("applies fixes for ASCII straight quotes in Italian elision", () => {
        expect.assertions(4);

        const rule = new ResourceTargetChecker(regexRules.find(rule => rule?.name === "resource-apostrophe"));
        expect(rule).toBeTruthy();
        const fixer = new ResourceFixer();

        const resource = new ResourceString({
            key: "apostrophe.fixer.italian",
            sourceLocale: "en-US",
            targetLocale: "it-IT",
            source: "The friend and the girlfriend are here.",
            target: "L\'amico e l\'amica sono qui.",
            pathName: "a/b/c.xliff"
        });

        const results = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        expect(results.length).toBe(2);

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("a/b/c.xliff", {}),
            dirty: false
        });
        fixer.applyFixes(ir, results.map(result => result.fix));

        // Should be replaced with Unicode apostrophes
        expect(resource.getTarget()).toBe("L\u2019amico e l\u2019amica sono qui.");
    });

    test("applies fixes for ASCII straight quotes in business context", () => {
        expect.assertions(4);

        const rule = new ResourceTargetChecker(regexRules.find(rule => rule?.name === "resource-apostrophe"));
        expect(rule).toBeTruthy();
        const fixer = new ResourceFixer();

        const resource = new ResourceString({
            key: "apostrophe.fixer.business",
            sourceLocale: "en-US",
            targetLocale: "sv-SE",
            source: "The company's profits increased and the customers' needs grew.",
            target: "Företagets vinster ök\'ade och kundernas behov väx\'te.",
            pathName: "a/b/c.xliff"
        });

        const results = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        expect(results.length).toBe(2);

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("a/b/c.xliff", {}),
            dirty: false
        });
        fixer.applyFixes(ir, results.map(result => result.fix));

        // Should be replaced with Unicode apostrophes
        expect(resource.getTarget()).toBe("Företagets vinster ök\u2019ade och kundernas behov väx\u2019te.");
    });

    test("applies fixes for ASCII straight quotes in academic context", () => {
        expect.assertions(4);

        const rule = new ResourceTargetChecker(regexRules.find(rule => rule?.name === "resource-apostrophe"));
        expect(rule).toBeTruthy();
        const fixer = new ResourceFixer();

        const resource = new ResourceString({
            key: "apostrophe.fixer.academic",
            sourceLocale: "en-US",
            targetLocale: "no-NO",
            source: "The students' papers are due and the teacher's comments are coming.",
            target: "Studentenes oppgaver forfall\'er og lærerens kommentarer kom\'er.",
            pathName: "a/b/c.xliff"
        });

        const results = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        expect(results.length).toBe(2);

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("a/b/c.xliff", {}),
            dirty: false
        });
        fixer.applyFixes(ir, results.map(result => result.fix));

        // Should be replaced with Unicode apostrophes
        expect(resource.getTarget()).toBe("Studentenes oppgaver forfall\u2019er og lærerens kommentarer kom\u2019er.");
    });

    // ResourceArray tests
    test("ResourceArray with no apostrophe issues", () => {
        expect.assertions(2);
        const rule = new ResourceTargetChecker(regexRules.find(rule => rule?.name === "resource-apostrophe"));
        expect(rule).toBeTruthy();

        const resource = new ResourceArray({
            key: "test.array",
            sourceLocale: "en-US",
            source: ["The man's car is here.", "The woman's house is beautiful."],
            targetLocale: "es-ES",
            target: ["El coche del hombre está aquí.", "La casa de la mujer es bonita."],
            pathName: "test.xliff"
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("test.xliff", {}),
            dirty: false
        });

        const result = rule.match({ir, file: "test.xliff"});

        expect(result).toBeUndefined();
    });

    test("ResourceArray with apostrophe issues", () => {
        expect.assertions(5);
        const rule = new ResourceTargetChecker(regexRules.find(rule => rule?.name === "resource-apostrophe"));
        expect(rule).toBeTruthy();

        const resource = new ResourceArray({
            key: "test.array",
            sourceLocale: "en-US",
            source: ["The man's car is here.", "The woman's house is beautiful."],
            targetLocale: "es-ES",
            target: ["El coche d\'el hombre está aquí.", "La casa d\'a mujer es bonita."],
            pathName: "test.xliff"
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("test.xliff", {}),
            dirty: false
        });

        const result = rule.match({ir, file: "test.xliff"});

        expect(result).toBeTruthy();
        // Result can be a single object or an array
        const results = Array.isArray(result) ? result : [result];
        expect(results.length).toBe(2);
        expect(results[0].severity).toBe("error");
        expect(results[1].severity).toBe("error");
    });

    // ResourcePlural tests
    test("ResourcePlural with no apostrophe issues", () => {
        expect.assertions(2);
        const rule = new ResourceTargetChecker(regexRules.find(rule => rule?.name === "resource-apostrophe"));
        expect(rule).toBeTruthy();

        const resource = new ResourcePlural({
            key: "test.plural",
            sourceLocale: "en-US",
            source: {
                one: "The woman's car is here.",
                other: "The women's cars are here."
            },
            targetLocale: "fr-FR",
            target: {
                one: "La voiture de la femme est ici.",
                other: "Les voitures des femmes sont ici."
            },
            pathName: "test.xliff"
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("test.xliff", {}),
            dirty: false
        });

        const result = rule.match({ir, file: "test.xliff"});

        expect(result).toBeUndefined();
    });

    test("ResourcePlural with apostrophe issues", () => {
        expect.assertions(15);
        const rule = new ResourceTargetChecker(regexRules.find(rule => rule?.name === "resource-apostrophe"));
        expect(rule).toBeTruthy();

        const resource = new ResourcePlural({
            key: "test.plural",
            sourceLocale: "en-US",
            source: {
                one: "The man's car is here.",
                other: "The men's cars are here."
            },
            targetLocale: "fr-FR",
            target: {
                one: "La voiture d'l'homme est ici.",
                other: "Les voitures d'es hommes sont ici."
            },
            pathName: "test.xliff"
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("test.xliff", {}),
            dirty: false
        });

        const result = rule.match({ir, file: "test.xliff"});

        expect(result).toBeTruthy();
        // Result can be a single object or an array
        const results = Array.isArray(result) ? result : [result];
        expect(results.length).toBe(2);
        
        // Check first result (one form)
        expect(results[0].severity).toBe("error");
        expect(results[0].id).toBe("test.plural");
        expect(results[0].description).toBe("The word \"d'l'homme\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(results[0].highlight).toBe("Target(one): La voiture <e0>d'l'homme</e0> est ici.");
        expect(results[0].source).toBe("The man's car is here.");
        expect(results[0].pathName).toBe("test.xliff");
        
        // Check second result (other form)
        expect(results[1].severity).toBe("error");
        expect(results[1].id).toBe("test.plural");
        expect(results[1].description).toBe("The word \"d'es\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(results[1].highlight).toBe("Target(other): Les voitures <e0>d'es</e0> hommes sont ici.");
        expect(results[1].source).toBe("The men's cars are here.");
        expect(results[1].pathName).toBe("test.xliff");
    });

    // ResourceArray fixer test
    test("applies fixes to ResourceArray with ASCII straight quotes", () => {
        expect.assertions(4);

        const rule = new ResourceTargetChecker(regexRules.find(rule => rule?.name === "resource-apostrophe"));
        expect(rule).toBeTruthy();
        const fixer = new ResourceFixer();

        const resource = new ResourceArray({
            key: "test.array.fixer",
            sourceLocale: "en-US",
            source: ["The man's car is here.", "The woman's house is beautiful."],
            targetLocale: "es-ES",
            target: ["El coche d\'el hombre está aquí.", "La casa d\'a mujer es bonita."],
            pathName: "test.xliff"
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("test.xliff", {}),
            dirty: false
        });

        const result = rule.match({ir, file: "test.xliff"});

        expect(result).toBeTruthy();
        // Result can be a single object or an array
        const results = Array.isArray(result) ? result : [result];
        expect(results.length).toBe(2);

        // Apply fixes to the resource
        fixer.applyFixes(ir, results.map(result => result.fix));

        // Should be replaced with Unicode apostrophes
        expect(resource.getTarget()).toEqual(["El coche d\u2019el hombre está aquí.", "La casa d\u2019a mujer es bonita."]);
    });

    // ResourcePlural fixer test
    test("applies fixes to ResourcePlural with ASCII straight quotes", () => {
        expect.assertions(4);

        const rule = new ResourceTargetChecker(regexRules.find(rule => rule?.name === "resource-apostrophe"));
        expect(rule).toBeTruthy();
        const fixer = new ResourceFixer();

        const resource = new ResourcePlural({
            key: "test.plural.fixer",
            sourceLocale: "en-US",
            source: {
                one: "The man's car is here.",
                other: "The men's cars are here."
            },
            targetLocale: "fr-FR",
            target: {
                one: "La voiture d'l'homme est ici.",
                other: "Les voitures d'es hommes sont ici."
            },
            pathName: "test.xliff"
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("test.xliff", {}),
            dirty: false
        });

        const result = rule.match({ir, file: "test.xliff"});

        expect(result).toBeTruthy();
        // Result can be a single object or an array
        const results = Array.isArray(result) ? result : [result];
        expect(results.length).toBe(2);

        // Apply fixes to the resource
        fixer.applyFixes(ir, results.map(result => result.fix));

        // Should be replaced with Unicode apostrophes
        expect(resource.getTarget()).toEqual({
            one: "La voiture d\u2019l\u2019homme est ici.",
            other: "Les voitures d\u2019es hommes sont ici."
        });
    });

    test("detects ASCII straight quotes in Dutch", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.dutch",
            sourceLocale: "en-US",
            targetLocale: "nl-NL",
            source: "That is correct.",
            target: "Da's correct.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.dutch");
        expect(result.description).toBe("The word \"Da's\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>Da's</e0> correct.");
        expect(result.source).toBe("That is correct.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in Afrikaans", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.afrikaans",
            sourceLocale: "en-US",
            targetLocale: "af-ZA",
            source: "There is a tree.",
            target: "Daar's 'n boom.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.afrikaans");
        expect(result.description).toBe("The word \"Daar's\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>Daar's</e0> 'n boom.");
        expect(result.source).toBe("There is a tree.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in Danish", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.danish",
            sourceLocale: "en-US",
            targetLocale: "da-DK",
            source: "There is a book.",
            target: "Der's en bog.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.danish");
        expect(result.description).toBe("The word \"Der's\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>Der's</e0> en bog.");
        expect(result.source).toBe("There is a book.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in Maltese", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.maltese",
            sourceLocale: "en-US",
            targetLocale: "mt-MT",
            source: "It wasn't there.",
            target: "Ma'kienx hemm.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.maltese");
        expect(result.description).toBe("The word \"Ma'kienx\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>Ma'kienx</e0> hemm.");
        expect(result.source).toBe("It wasn't there.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in Breton", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.breton",
            sourceLocale: "en-US",
            targetLocale: "br-FR",
            source: "There is bread.",
            target: "N'eus bara.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.breton");
        expect(result.description).toBe("The word \"N'eus\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>N'eus</e0> bara.");
        expect(result.source).toBe("There is bread.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in Cornish", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.cornish",
            sourceLocale: "en-US",
            targetLocale: "kw-GB",
            source: "There is sea.",
            target: "N'eus mor.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.cornish");
        expect(result.description).toBe("The word \"N'eus\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>N'eus</e0> mor.");
        expect(result.source).toBe("There is sea.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in Maori", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.maori",
            sourceLocale: "en-US",
            targetLocale: "mi-NZ",
            source: "It is not here.",
            target: "Ka'ore i konei.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.maori");
        expect(result.description).toBe("The word \"Ka'ore\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>Ka'ore</e0> i konei.");
        expect(result.source).toBe("It is not here.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    test("detects ASCII straight quotes in Tahitian", () => {
        expect.assertions(8);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.tahitian",
            sourceLocale: "en-US",
            targetLocale: "ty-PF",
            source: "It is not deep.",
            target: "E'ore hohonu.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeTruthy();
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("apostrophe.tahitian");
        expect(result.description).toBe("The word \"E'ore\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.");
        expect(result.highlight).toBe("Target: <e0>E'ore</e0> hohonu.");
        expect(result.source).toBe("It is not deep.");
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    // Test that actual quoted strings are ignored (no false positives)
    test("ignores actual quoted strings in Dutch", () => {
        expect.assertions(1);
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "apostrophe.dutch.quotes",
            sourceLocale: "en-US",
            targetLocale: "nl-NL",
            source: "The phrase 'how are you' means how are you.",
            target: "De uitdrukking 'hoe gaat het' betekent hoe gaat het.",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // Should not produce any results since 'hoe gaat het' is a quoted string, not an apostrophe
        // The rule should ignore the quoted phrase with multiple Dutch words
        expect(results).toBeUndefined();
    });
});
