/*
 * ResourceNoManualDateFormatting.test.js - test the built-in regular-expression-based rules
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
import { ResourceString, ResourceArray, ResourcePlural } from 'ilib-tools-common';

import ResourceSourceChecker from '../src/rules/ResourceSourceChecker.js';
import { regexRules } from '../src/plugins/BuiltinPlugin.js';

import { Result, IntermediateRepresentation, SourceFile } from 'ilib-lint-common';

function findRuleDefinition(name) {
    return regexRules.find(rule => rule.name === name);
}

const sourceFile = new SourceFile("a/b/c.xliff", {});

describe("testResourceNoManualDateageFormatting", () => {
    test("ResourceManualDateFormatting", () => {
        expect.assertions(8);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-manual-date-formatting"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "The event occurred on {MM}/{dd}/{yyyy}.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(actual.length).toBe(1);

        expect(actual[0].severity).toBe("error");
        expect(actual[0].id).toBe("matcher.test");
        expect(actual[0].description).toBe("Do not format dates or times in English strings. Use a locale-sensitive date formatter and substitute the result of that into this string.");
        expect(actual[0].highlight).toBe("Source: The event occurred on <e0>{MM}/{dd}/{yyyy}</e0>.");
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceManualDateFormattingNoProblem", () => {
        expect.assertions(2);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-manual-date-formatting"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "The speed was {megabytes}/{day}.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeFalsy();
    });

    test("ResourceManualDateFormattingTestPlural", () => {
        expect.assertions(8);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-manual-date-formatting"));
        expect(rule).toBeTruthy();

        const resource = new ResourcePlural({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: {
                one: "The event occurred on {MM}/{dd}/{yyyy}.",
                other: "Costs are {cost}."
            },
            pathName: "a/b/c.xliff"
        });
        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile
        });

        const actual = rule.match({
            file: "a/b/c.xliff",
            ir
        });

        expect(actual).toBeTruthy();
        expect(Array.isArray(actual)).toBeFalsy();

        expect(actual.severity).toBe("error");
        expect(actual.id).toBe("matcher.test");
        expect(actual.description).toBe("Do not format dates or times in English strings. Use a locale-sensitive date formatter and substitute the result of that into this string.");
        expect(actual.highlight).toBe("Source: The event occurred on <e0>{MM}/{dd}/{yyyy}</e0>.");
        expect(actual.pathName).toBe("a/b/c.xliff");
    });

    test("ResourceManualDateFormattingTestArray", () => {
        expect.assertions(8);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-manual-date-formatting"));
        expect(rule).toBeTruthy();

        const resource = new ResourceArray({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: [
                "The event occurred on {MM}/{dd}/{yyyy}.",
                "Costs are ${cost}."
            ],
            pathName: "a/b/c.xliff"
        });
        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile
        });

        const actual = rule.match({
            file: "a/b/c.xliff",
            ir
        });

        expect(actual).toBeTruthy();
        expect(Array.isArray(actual)).toBeFalsy();

        expect(actual.severity).toBe("error");
        expect(actual.id).toBe("matcher.test");
        expect(actual.description).toBe("Do not format dates or times in English strings. Use a locale-sensitive date formatter and substitute the result of that into this string.");
        expect(actual.highlight).toBe("Source: The event occurred on <e0>{MM}/{dd}/{yyyy}</e0>.");
        expect(actual.pathName).toBe("a/b/c.xliff");
    });

    test("ResourceManualDateFormattingTestArrayEachType", () => {
        expect.assertions(4);

        const expected = [
            "Source: The event occurred on <e0>{years}/{months}/{days}</e0>.",
            "Source: The event occurred on <e0>{year}/{month}/{day}</e0>.",
            "Source: The event occurred on <e0>{yyyy}/{MM}/{dd}</e0>.",
            "Source: The event occurred on <e0>{yy}/{MM}/{dd}</e0>.",
            "Source: The event occurred on <e0>{years}-{months}-{days}</e0>.",
            "Source: The event occurred on <e0>{year}-{month}-{day}</e0>.",
            "Source: The event occurred on <e0>{yyyy}-{MM}-{dd}</e0>.",
            "Source: The event occurred on <e0>{yy}-{MM}-{dd}</e0>.",
            "Source: The event occurred on <e0>{years}.{months}.{days}</e0>.",
            "Source: The event occurred on <e0>{year}.{month}.{day}</e0>.",
            "Source: The event occurred on <e0>{yyyy}.{MM}.{dd}</e0>.",
            "Source: The event occurred on <e0>{yy}.{MM}.{dd}</e0>.",

            "Source: The event occurred on <e0>{months}/{days}/{years}</e0>.",
            "Source: The event occurred on <e0>{month}/{day}/{year}</e0>.",
            "Source: The event occurred on <e0>{months}-{days}-{years}</e0>.",
            "Source: The event occurred on <e0>{month}-{day}-{year}</e0>.",
            "Source: The event occurred on <e0>{months}.{days}.{years}</e0>.",
            "Source: The event occurred on <e0>{month}.{day}.{year}</e0>.",
            "Source: The event occurred on <e0>{month} {day}, {year}</e0>.",
            "Source: The event occurred on <e0>{month} {days}, {years}</e0>.",
            "Source: The event occurred on <e0>{MM}/{dd}/{yyyy}</e0>.",
            "Source: The event occurred on <e0>{MM}/{dd}/{yy}</e0>.",
            "Source: The event occurred on <e0>{MM}-{dd}-{yyyy}</e0>.",
            "Source: The event occurred on <e0>{MM}-{dd}-{yy}</e0>.",
            "Source: The event occurred on <e0>{MM}.{dd}.{yyyy}</e0>.",
            "Source: The event occurred on <e0>{MM}.{dd}.{yy}</e0>.",
            "Source: The event occurred on <e0>{MMM} {dd}, {yy}</e0>.",
            "Source: The event occurred on <e0>{MMM} {dd}, {yyyy}</e0>.",
            "Source: The event occurred on <e0>{MMM} {d}, {yy}</e0>.",
            "Source: The event occurred on <e0>{MMM} {d}, {yyyy}</e0>.",
            "Source: The event occurred on <e0>{MMMM} {dd}, {yy}</e0>.",
            "Source: The event occurred on <e0>{MMMM} {dd}, {yyyy}</e0>.",

            "Source: The event occurred on <e0>{days}/{months}/{years}</e0>.",
            "Source: The event occurred on <e0>{day}/{month}/{year}</e0>.",
            "Source: The event occurred on <e0>{days}-{months}-{years}</e0>.",
            "Source: The event occurred on <e0>{day}-{month}-{year}</e0>.",
            "Source: The event occurred on <e0>{days}.{months}.{years}</e0>.",
            "Source: The event occurred on <e0>{day}.{month}.{year}</e0>.",
            "Source: The event occurred on <e0>{day} {month}, {year}</e0>.",
            "Source: The event occurred on <e0>{day} {months}, {years}</e0>.",
            "Source: The event occurred on <e0>{dd}/{MM}/{yyyy}</e0>.",
            "Source: The event occurred on <e0>{dd}/{MM}/{yy}</e0>.",
            "Source: The event occurred on <e0>{dd}-{MM}-{yyyy}</e0>.",
            "Source: The event occurred on <e0>{dd}-{MM}-{yy}</e0>.",
            "Source: The event occurred on <e0>{dd}.{MM}.{yyyy}</e0>.",
            "Source: The event occurred on <e0>{dd}.{MM}.{yy}</e0>.",
            "Source: The event occurred on <e0>{dd} {MMM}, {yy}</e0>.",
            "Source: The event occurred on <e0>{dd} {MMM}, {yyyy}</e0>.",
            "Source: The event occurred on <e0>{d} {MMM}, {yy}</e0>.",
            "Source: The event occurred on <e0>{d} {MMM}, {yyyy}</e0>.",
            "Source: The event occurred on <e0>{dd} {MMMM}, {yy}</e0>.",
            "Source: The event occurred on <e0>{dd} {MMMM}, {yyyy}</e0>.",

            "Source: The event occurred on <e0>{years}/{months}</e0>.",
            "Source: The event occurred on <e0>{year}/{month}</e0>.",
            "Source: The event occurred on <e0>{yyyy}/{MM}</e0>.",
            "Source: The event occurred on <e0>{yyyy}/{MMM}</e0>.",
            "Source: The event occurred on <e0>{yyyy}/{MMM}</e0>.",
            "Source: The event occurred on <e0>{yy}/{MM}</e0>.",
            "Source: The event occurred on <e0>{yy}/{MMM}</e0>.",
            "Source: The event occurred on <e0>{yy}/{MMM}</e0>.",
            "Source: The event occurred on <e0>{years}-{months}</e0>.",
            "Source: The event occurred on <e0>{year}-{month}</e0>.",
            "Source: The event occurred on <e0>{yyyy}-{MM}</e0>.",
            "Source: The event occurred on <e0>{yyyy}-{MMM}</e0>.",
            "Source: The event occurred on <e0>{yyyy}-{MMM}</e0>.",
            "Source: The event occurred on <e0>{yy}-{MM}</e0>.",
            "Source: The event occurred on <e0>{yy}-{MMM}</e0>.",
            "Source: The event occurred on <e0>{yy}-{MMM}</e0>.",
            "Source: The event occurred on <e0>{years}.{months}</e0>.",
            "Source: The event occurred on <e0>{year}.{month}</e0>.",
            "Source: The event occurred on <e0>{yyyy}.{MM}</e0>.",
            "Source: The event occurred on <e0>{yyyy}.{MMM}</e0>.",
            "Source: The event occurred on <e0>{yyyy}.{MMM}</e0>.",
            "Source: The event occurred on <e0>{yy}.{MM}</e0>.",
            "Source: The event occurred on <e0>{yy}.{MMM}</e0>.",
            "Source: The event occurred on <e0>{yy}.{MMM}</e0>.",

            "Source: The event occurred on <e0>{months}/{years}</e0>.",
            "Source: The event occurred on <e0>{month}/{year}</e0>.",
            "Source: The event occurred on <e0>{months}-{years}</e0>.",
            "Source: The event occurred on <e0>{month}-{year}</e0>.",
            "Source: The event occurred on <e0>{months}.{years}</e0>.",
            "Source: The event occurred on <e0>{month}.{year}</e0>.",
            "Source: The event occurred on <e0>{month} {year}</e0>.",
            "Source: The event occurred on <e0>{month}, {year}</e0>.",
            "Source: The event occurred on <e0>{months}, {years}</e0>.",
            "Source: The event occurred on <e0>{MM}/{yyyy}</e0>.",
            "Source: The event occurred on <e0>{MM}/{yy}</e0>.",
            "Source: The event occurred on <e0>{MM}-{yyyy}</e0>.",
            "Source: The event occurred on <e0>{MM}-{yy}</e0>.",
            "Source: The event occurred on <e0>{MM}.{yyyy}</e0>.",
            "Source: The event occurred on <e0>{MM}.{yy}</e0>.",
            "Source: The event occurred on <e0>{MMM}, {yy}</e0>.",
            "Source: The event occurred on <e0>{MMM}, {yyyy}</e0>.",
            "Source: The event occurred on <e0>{MMMM}, {yy}</e0>.",
            "Source: The event occurred on <e0>{MMMM}, {yyyy}</e0>.",

            "Source: The event occurred on <e0>{months}/{days}</e0>.",
            "Source: The event occurred on <e0>{month}/{day}</e0>.",
            "Source: The event occurred on <e0>{months}-{days}</e0>.",
            "Source: The event occurred on <e0>{month}-{day}</e0>.",
            "Source: The event occurred on <e0>{months}.{days}</e0>.",
            "Source: The event occurred on <e0>{month}.{day}</e0>.",
            "Source: The event occurred on <e0>{month} {day}</e0>.",
            "Source: The event occurred on <e0>{months} {days}</e0>.",
            "Source: The event occurred on <e0>{MM}/{dd}</e0>.",
            "Source: The event occurred on <e0>{MM}/{d}</e0>.",
            "Source: The event occurred on <e0>{MM}-{dd}</e0>.",
            "Source: The event occurred on <e0>{MM}-{d}</e0>.",
            "Source: The event occurred on <e0>{MM}.{dd}</e0>.",
            "Source: The event occurred on <e0>{MM}.{d}</e0>.",
            "Source: The event occurred on <e0>{MMM} {dd}</e0>.",
            "Source: The event occurred on <e0>{MMM} {d}</e0>.",
            "Source: The event occurred on <e0>{MMMM} {dd}</e0>.",
            "Source: The event occurred on <e0>{MMMM} {d}</e0>.",

            "Source: The event occurred on <e0>{days}/{months}</e0>.",
            "Source: The event occurred on <e0>{day}/{month}</e0>.",
            "Source: The event occurred on <e0>{days}-{months}</e0>.",
            "Source: The event occurred on <e0>{day}-{month}</e0>.",
            "Source: The event occurred on <e0>{days}.{months}</e0>.",
            "Source: The event occurred on <e0>{day}.{month}</e0>.",
            "Source: The event occurred on <e0>{day} {month}</e0>.",
            "Source: The event occurred on <e0>{day} {months}</e0>.",
            "Source: The event occurred on <e0>{dd}/{MM}</e0>.",
            "Source: The event occurred on <e0>{d}/{MM}</e0>.",
            "Source: The event occurred on <e0>{dd}-{MM}</e0>.",
            "Source: The event occurred on <e0>{d}-{MM}</e0>.",
            "Source: The event occurred on <e0>{dd}.{MM}</e0>.",
            "Source: The event occurred on <e0>{d}.{MM}</e0>.",
            "Source: The event occurred on <e0>{dd} {MMM}</e0>.",
            "Source: The event occurred on <e0>{d} {MMM}</e0>.",
            "Source: The event occurred on <e0>{dd} {MMM}</e0>.",
            "Source: The event occurred on <e0>{d} {MMM}</e0>.",
            "Source: The event occurred on <e0>{dd} {MMMM}</e0>.",
            "Source: The event occurred on <e0>{d} {MMMM}</e0>.",

            "Source: The event occurred at <e0>{hours}:{minutes}:{seconds}</e0>.",
            "Source: The event occurred at <e0>{hour}:{minute}:{second}</e0>.",
            "Source: The event occurred at <e0>{hour}:{min}:{sec}</e0>.",
            "Source: The event occurred at <e0>{HH}:{mm}:{ss}</e0>.",
            "Source: The event occurred at <e0>{hh}:{mm}:{ss}</e0>.",
            "Source: The event occurred at <e0>{H}:{m}:{s}</e0>.",
            "Source: The event occurred at <e0>{h}:{m}:{s}</e0>.",

            "Source: The event occurred at <e0>{hours}:{minutes}</e0>.",
            "Source: The event occurred at <e0>{hour}:{minute}</e0>.",
            "Source: The event occurred at <e0>{hour}:{min}</e0>.",
            "Source: The event occurred at <e0>{hh}:{mm}</e0>.",
            "Source: The event occurred at <e0>{h}:{m}</e0>.",
            "Source: The event occurred at <e0>{HH}:{mm}</e0>.",
            "Source: The event occurred at <e0>{H}:{m}</e0>."
        ];

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-manual-date-formatting"));
        expect(rule).toBeTruthy();

        const resource = new ResourceArray({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: [
                "The event occurred on {years}/{months}/{days}.",
                "The event occurred on {year}/{month}/{day}.",
                "The event occurred on {yyyy}/{MM}/{dd}.",
                "The event occurred on {yy}/{MM}/{dd}.",
                "The event occurred on {years}-{months}-{days}.",
                "The event occurred on {year}-{month}-{day}.",
                "The event occurred on {yyyy}-{MM}-{dd}.",
                "The event occurred on {yy}-{MM}-{dd}.",
                "The event occurred on {years}.{months}.{days}.",
                "The event occurred on {year}.{month}.{day}.",
                "The event occurred on {yyyy}.{MM}.{dd}.",
                "The event occurred on {yy}.{MM}.{dd}.",

                "The event occurred on {months}/{days}/{years}.",
                "The event occurred on {month}/{day}/{year}.",
                "The event occurred on {months}-{days}-{years}.",
                "The event occurred on {month}-{day}-{year}.",
                "The event occurred on {months}.{days}.{years}.",
                "The event occurred on {month}.{day}.{year}.",
                "The event occurred on {month} {day}, {year}.",
                "The event occurred on {month} {days}, {years}.",
                "The event occurred on {MM}/{dd}/{yyyy}.",
                "The event occurred on {MM}/{dd}/{yy}.",
                "The event occurred on {MM}-{dd}-{yyyy}.",
                "The event occurred on {MM}-{dd}-{yy}.",
                "The event occurred on {MM}.{dd}.{yyyy}.",
                "The event occurred on {MM}.{dd}.{yy}.",
                "The event occurred on {MMM} {dd}, {yy}.",
                "The event occurred on {MMM} {dd}, {yyyy}.",
                "The event occurred on {MMM} {d}, {yy}.",
                "The event occurred on {MMM} {d}, {yyyy}.",
                "The event occurred on {MMMM} {dd}, {yy}.",
                "The event occurred on {MMMM} {dd}, {yyyy}.",

                "The event occurred on {days}/{months}/{years}.",
                "The event occurred on {day}/{month}/{year}.",
                "The event occurred on {days}-{months}-{years}.",
                "The event occurred on {day}-{month}-{year}.",
                "The event occurred on {days}.{months}.{years}.",
                "The event occurred on {day}.{month}.{year}.",
                "The event occurred on {day} {month}, {year}.",
                "The event occurred on {day} {months}, {years}.",
                "The event occurred on {dd}/{MM}/{yyyy}.",
                "The event occurred on {dd}/{MM}/{yy}.",
                "The event occurred on {dd}-{MM}-{yyyy}.",
                "The event occurred on {dd}-{MM}-{yy}.",
                "The event occurred on {dd}.{MM}.{yyyy}.",
                "The event occurred on {dd}.{MM}.{yy}.",
                "The event occurred on {dd} {MMM}, {yy}.",
                "The event occurred on {dd} {MMM}, {yyyy}.",
                "The event occurred on {d} {MMM}, {yy}.",
                "The event occurred on {d} {MMM}, {yyyy}.",
                "The event occurred on {dd} {MMMM}, {yy}.",
                "The event occurred on {dd} {MMMM}, {yyyy}.",

                "The event occurred on {years}/{months}.",
                "The event occurred on {year}/{month}.",
                "The event occurred on {yyyy}/{MM}.",
                "The event occurred on {yyyy}/{MMM}.",
                "The event occurred on {yyyy}/{MMM}.",
                "The event occurred on {yy}/{MM}.",
                "The event occurred on {yy}/{MMM}.",
                "The event occurred on {yy}/{MMM}.",
                "The event occurred on {years}-{months}.",
                "The event occurred on {year}-{month}.",
                "The event occurred on {yyyy}-{MM}.",
                "The event occurred on {yyyy}-{MMM}.",
                "The event occurred on {yyyy}-{MMM}.",
                "The event occurred on {yy}-{MM}.",
                "The event occurred on {yy}-{MMM}.",
                "The event occurred on {yy}-{MMM}.",
                "The event occurred on {years}.{months}.",
                "The event occurred on {year}.{month}.",
                "The event occurred on {yyyy}.{MM}.",
                "The event occurred on {yyyy}.{MMM}.",
                "The event occurred on {yyyy}.{MMM}.",
                "The event occurred on {yy}.{MM}.",
                "The event occurred on {yy}.{MMM}.",
                "The event occurred on {yy}.{MMM}.",

                "The event occurred on {months}/{years}.",
                "The event occurred on {month}/{year}.",
                "The event occurred on {months}-{years}.",
                "The event occurred on {month}-{year}.",
                "The event occurred on {months}.{years}.",
                "The event occurred on {month}.{year}.",
                "The event occurred on {month} {year}.",
                "The event occurred on {month}, {year}.",
                "The event occurred on {months}, {years}.",
                "The event occurred on {MM}/{yyyy}.",
                "The event occurred on {MM}/{yy}.",
                "The event occurred on {MM}-{yyyy}.",
                "The event occurred on {MM}-{yy}.",
                "The event occurred on {MM}.{yyyy}.",
                "The event occurred on {MM}.{yy}.",
                "The event occurred on {MMM}, {yy}.",
                "The event occurred on {MMM}, {yyyy}.",
                "The event occurred on {MMMM}, {yy}.",
                "The event occurred on {MMMM}, {yyyy}.",

                "The event occurred on {months}/{days}.",
                "The event occurred on {month}/{day}.",
                "The event occurred on {months}-{days}.",
                "The event occurred on {month}-{day}.",
                "The event occurred on {months}.{days}.",
                "The event occurred on {month}.{day}.",
                "The event occurred on {month} {day}.",
                "The event occurred on {months} {days}.",
                "The event occurred on {MM}/{dd}.",
                "The event occurred on {MM}/{d}.",
                "The event occurred on {MM}-{dd}.",
                "The event occurred on {MM}-{d}.",
                "The event occurred on {MM}.{dd}.",
                "The event occurred on {MM}.{d}.",
                "The event occurred on {MMM} {dd}.",
                "The event occurred on {MMM} {d}.",
                "The event occurred on {MMMM} {dd}.",
                "The event occurred on {MMMM} {d}.",

                "The event occurred on {days}/{months}.",
                "The event occurred on {day}/{month}.",
                "The event occurred on {days}-{months}.",
                "The event occurred on {day}-{month}.",
                "The event occurred on {days}.{months}.",
                "The event occurred on {day}.{month}.",
                "The event occurred on {day} {month}.",
                "The event occurred on {day} {months}.",
                "The event occurred on {dd}/{MM}.",
                "The event occurred on {d}/{MM}.",
                "The event occurred on {dd}-{MM}.",
                "The event occurred on {d}-{MM}.",
                "The event occurred on {dd}.{MM}.",
                "The event occurred on {d}.{MM}.",
                "The event occurred on {dd} {MMM}.",
                "The event occurred on {d} {MMM}.",
                "The event occurred on {dd} {MMM}.",
                "The event occurred on {d} {MMM}.",
                "The event occurred on {dd} {MMMM}.",
                "The event occurred on {d} {MMMM}.",

                "The event occurred at {hours}:{minutes}:{seconds}.",
                "The event occurred at {hour}:{minute}:{second}.",
                "The event occurred at {hour}:{min}:{sec}.",
                "The event occurred at {HH}:{mm}:{ss}.",
                "The event occurred at {hh}:{mm}:{ss}.",
                "The event occurred at {H}:{m}:{s}.",
                "The event occurred at {h}:{m}:{s}.",

                "The event occurred at {hours}:{minutes}.",
                "The event occurred at {hour}:{minute}.",
                "The event occurred at {hour}:{min}.",
                "The event occurred at {hh}:{mm}.",
                "The event occurred at {h}:{m}.",
                "The event occurred at {HH}:{mm}.",
                "The event occurred at {H}:{m}."
            ],
            pathName: "a/b/c.xliff"
        });
        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile
        });

        const actual = rule.match({
            file: "a/b/c.xliff",
            ir
        });

        expect(actual).toBeTruthy();
        expect(actual.length).toBe(expected.length);

        const highlights = actual.map(result => result.highlight);
        expect(highlights).toStrictEqual(expected);
    });

    test("ResourceManualDateFormattingStartOfString", () => {
        expect.assertions(8);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-manual-date-formatting"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "{MM}/{dd}/{yyyy}: event occurred.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(actual.length).toBe(1);

        expect(actual[0].severity).toBe("error");
        expect(actual[0].id).toBe("matcher.test");
        expect(actual[0].description).toBe("Do not format dates or times in English strings. Use a locale-sensitive date formatter and substitute the result of that into this string.");
        expect(actual[0].highlight).toBe("Source: <e0>{MM}/{dd}/{yyyy}</e0>: event occurred.");
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceManualDateFormattingEndOfString", () => {
        expect.assertions(8);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-manual-date-formatting"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "The event occurred on {MM}/{dd}/{yyyy}",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(actual.length).toBe(1);

        expect(actual[0].severity).toBe("error");
        expect(actual[0].id).toBe("matcher.test");
        expect(actual[0].description).toBe("Do not format dates or times in English strings. Use a locale-sensitive date formatter and substitute the result of that into this string.");
        expect(actual[0].highlight).toBe("Source: The event occurred on <e0>{MM}/{dd}/{yyyy}</e0>");
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });
});
