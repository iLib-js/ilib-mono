import {Result} from 'ilib-lint-common';
import {ConfigBasedFormatter} from '../ConfigBasedFormatter.js';
import ResourceMatcher from "../../rules/ResourceMatcher.js";

describe('ConfigBasedFormatter', () => {
    it.each([
        {
            name: "a pair of opening and closing tags <eX></eX>",
            highlight: "This is just <e0>me</e0> testing.",
            expected: "This is just >>me<< testing."
        },
        {
            name: "a self-closing tag <eX/>",
            highlight: "This is just me testing.<e0/>",
            expected: "This is just me testing.>><<"
        },
        {
            name: "an opening tag <eX>",
            highlight: "This is just me testing.<e0>",
            expected: "This is just me testing.>>"
        },
        {
            name: "a closing tag </eX>",
            highlight: "This is just me testing.</e0>",
            expected: "This is just me testing.<<"
        },
    ])('replaces $name with highlight markers', ({highlight, expected}) => {
        const formatter = new ConfigBasedFormatter({
            "name": "test-formatter",
            "description": "A formatter for testing purposes",
            "template": "{highlight}",
            "highlightStart": ">>",
            "highlightEnd": "<<"
        })

        const result = formatter.format(new Result({
            description: "A description for testing purposes",
            highlight,
            id: "test.id",
            lineNumber: 123,
            pathName: "test.txt",
            rule: getTestRule(),
            severity: "error",
            source: "test"
        }));


        expect(result).toBe(expected);
    });
});

function getTestRule() {
    return new ResourceMatcher({
        "name": "testRule",
        "description": "Rule for testing purposes",
        "regexps": ["test"],
        "note": "test",
        "sourceLocale": "en-US",
        "link": ""
    });
}
