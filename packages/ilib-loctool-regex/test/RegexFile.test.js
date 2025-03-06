/*
 * RegexFile.test.js - test the Regex file handler object.
 *
 * Copyright © 2024-2025 Box, Inc.
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

var RegexFile = require("../RegexFile.js");
var RegexFileType = require("../RegexFileType.js");
var CustomProject =  require("loctool/lib/CustomProject.js");

var p = new CustomProject({
    id: "app",
    plugins: [
        require.resolve("../.")
    ],
    sourceLocale: "en-US",
    resourceFileTypes: {
        "javascript": "ilib-loctool-javascript-resource"
    }
}, "./test/testfiles", {
    "locales":["en-GB", "de-DE", "fr-FR", "ja-JP"],
    "regex": {
        "mappings": {
            "**/*.js": {
                "resourceFileType": "javascript",
                "template": "resources/strings_[locale].json",
                "sourceLocale": "en-US",
                "expressions": [
                    {
                        // regular string $t('string')
                        "expression": "\\$t\\s*\\(\\s*[\'\"](?<source>[^\'\"]*)[\'\"]\\s*\\)",
                        "flags": "g",
                        "datatype": "javascript",
                        "resourceType": "string",
                        "keyStrategy": "hash"
                    },
                    {
                        // plural string $p('singular', 'plural')
                        "expression": "\\$p\\s*\\(\\s*[\'\"](?<source>[^\'\"]*)[\'\"]\\s*,\\s*[\'\"](?<sourcePlural>[^\'\"]*)[\'\"]\\s*\\)",
                        "flags": "g",
                        "datatype": "javascript",
                        "resourceType": "plural",
                        "keyStrategy": "hash"
                    },
                    {
                        // array of strings $a(["string1", "string2"])
                        "expression": "\\$a\\s*\\(\\s*\\[(?<source>[^\\]]*)\\s*\\]\\s*\\)",
                        "flags": "g",
                        "datatype": "javascript",
                        "resourceType": "array",
                        "keyStrategy": "hash"
                    },
                    {
                        // regular string, but where the key strategy is to use the whole source string
                        "expression": "\\$wholekey\\s*\\(\\s*[\'\"](?<source>[^\'\"]*)[\'\"]\\s*\\)",
                        "flags": "g",
                        "datatype": "javascript",
                        "resourceType": "string",
                        "keyStrategy": "source"
                    },
                    {
                        // regular string, but where the key strategy is to use the trunctated source string
                        "expression": "\\$truncatedkey\\s*\\(\\s*[\'\"](?<source>[^\'\"]*)[\'\"]\\s*\\)",
                        "flags": "g",
                        "datatype": "javascript",
                        "resourceType": "string",
                        "keyStrategy": "truncate"
                    },
                    {
                        // regular string that contains escaped Unicode characters. We include the "u" flag
                        // in the regular expression flags
                        "expression": "\\$u\\s*\\(\\s*[\'\"](?<source>[^\'\"]*)[\'\"]\\s*\\)",
                        "flags": "gu",
                        "datatype": "javascript",
                        "resourceType": "string",
                        "keyStrategy": "hash"
                    }
                ]
            },
            "**/*.tmpl": {
                "resourceFileType": "javascript",
                "template": "resources/Translation[locale].json",
                "sourceLocale": "en-US",
                "escapeStyle": "smarty",
                "expressions": [
                    {
                        // example:
                        // {* @L10N This comment is on the same line *} {'Your password change is cancelled.'|f:'login_password_change_cancelled'}
                        "expression": "\\{\\*.*?@L10N\\s*(?<comment>[^*]*?)\\s*\\*\\}.*\\{.*?'(?<source>[^']*)'\\s*\\|\\s*f:\\s*'(?<key>[^']*)'.*?\\}",
                        "flags": "g",
                        "datatype": "template",
                        "resourceType": "string"
                    },
                    {
                        // example:
                        // {* @L10N The message shown to users whose passwords have just been changed *}
                        // {'Your password was changed. Please log in again.'|f:'login_success_password_changed'}
                        "expression": "\\{\\*.*?@L10N\\s*(?<comment>[^*]*?)\\s*\\*\\}.*\\n.*\\{.*?'(?<source>[^']*)'\\s*\\|\\s*f:\\s*'(?<key>[^']*)'.*?\\}",
                        "flags": "g",
                        "datatype": "template",
                        "resourceType": "string"
                    },
                    {
                        // example:
                        // {'Your password was changed. Please log in again.'|f:'login_success_password_changed'}
                        "expression": "\\{.*?'(?<source>[^']*)'\\s*\\|\\s*f:\\s*'(?<key>[^']*)'.*?\\}",
                        "flags": "g",
                        "datatype": "template",
                        "resourceType": "string"
                    }
                ]
            }
        }
    },
    "php": {
        "localeMap": {
            "en-US": "EnUS",
            "en-GB": "EnGB",
            "de-DE": "DeDE",
            "fr-FR": "FrFR",
            "ja-JP": "JaJP"
        },
        "sourceLocale": "en-US"
    }
});

var p2 = new CustomProject({
    id: "emptyapp",
    plugins: [require.resolve("../.")],
    sourceLocale: "en-US"
}, "./test/testfiles", {
    "locales":["en-GB", "de-DE", "fr-FR", "ja-JP"],
    "regex": {
        "mappings": {
            "**/*.js": {
                "template": "resources/strings_[locale].json"
                // no other settings to test if we detect the lack of them
            }
        }
    }
});

var rft = new RegexFileType(p);
var rft2 = new RegexFileType(p2);

describe("regex file tests", function() {
    test("RegexFileConstructor", function() {
        expect.assertions(1);

        var rf = new RegexFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();
    });

    test("RegexFileConstructorParams", function() {
        expect.assertions(1);

        var rf = new RegexFile({
            project: p,
            pathName: "./testfiles/js/t1.js",
            type: rft
        });

        expect(rf).toBeTruthy();
    });

    test("RegexFileConstructorNoFile", function() {
        expect.assertions(1);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();
    });

    test("RegexFile MakeKey returns the hash for javascript files", function() {
        expect.assertions(2);

        var rf = new RegexFile({
            project: p,
            pathName: "./testfiles/js/t1.js",
            type: rft
        });
        expect(rf).toBeTruthy();

        // the config says to use a hash for the key for javascript files
        expect(rf.makeKey("This is a test")).toBe("r654479252");
    });

    test("RegexFileParse simple string", function() {
        expect.assertions(6);

        var rf = new RegexFile({
            project: p,
            pathName: "./testfiles/js/t1.js",
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("$t('This is a test')");

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
        expect(r.getDataType()).toBe("javascript");
    });

    test("RegexFileParse more complex string", function() {
        expect.assertions(5);

        var rf = new RegexFile({
            project: p,
            pathName: "./testfiles/js/t1.js",
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("if (subcat == 'Has types') {\n    title = $t('Types of {topic}').format({topic: topic.attribute.name});\n}");

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("Types of {topic}");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Types of {topic}");
        expect(r.getKey()).toBe("r1028922458");
    });

    test("RegexFileParse simple string but ignore the whitespace", function() {
        expect.assertions(5);

        var rf = new RegexFile({
            project: p,
            pathName: "./testfiles/js/t1.js",
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('   $t  (    \t "This is a test"    );  ');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
    });

    test("RegexFileParse simple string and translation set has the right size", function() {
        expect.assertions(4);

        var rf = new RegexFile({
            project: p,
            pathName: "./testfiles/js/t1.js",
            type: rft
        });
        expect(rf).toBeTruthy();

        var set = rf.getTranslationSet();
        expect(set.size()).toBe(0);

        rf.parse("$t('This is a test');");

        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
    });

    test("RegexFileParse plural string", function() {
        expect.assertions(6);

        var rf = new RegexFile({
            project: p,
            pathName: "./testfiles/js/t1.js",
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("$p('This is the singular', 'This is the plural');");

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var resources = set.getBy({
            reskey: "r145739915"
        });
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(1);
        var r = resources[0];
        expect(r.getSourcePlurals()).toStrictEqual({
            "one": "This is the singular",
            "other": "This is the plural"
        });
        expect(r.getKey()).toBe("r145739915");
    });

    test("RegexFileParse array of strings", function() {
        expect.assertions(6);

        var rf = new RegexFile({
            project: p,
            pathName: "./testfiles/js/t1.js",
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("$a( ['This is the first string', 'This is the second string'] );");

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var resources = set.getBy({
            reskey: "r523019971"
        });
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(1);
        var r = resources[0];
        expect(r.getSourceArray()).toStrictEqual([
            "This is the first string",
            "This is the second string"
        ]);
        expect(r.getKey()).toBe("r523019971");
    });

    test("RegexFileParseWithKey", function() {
        expect.assertions(7);

        var rf = new RegexFile({
            project: p,
            pathName: "./testfiles/templates/t1.tmpl",
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('<span class="alert alert-info">{\'Your password was changed. Please log in again.\'|f:\'login_success_password_changed\'}</span>');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var resources = set.getBy({
            reskey: "login_success_password_changed"
        });
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(1);
        var r = resources[0];
        expect(r.getSource()).toBe("Your password was changed. Please log in again.");
        expect(r.getKey()).toBe("login_success_password_changed");
        expect(r.getDataType()).toBe("template");
    });

    test("RegexFile parse multiple strings in the same file", function() {
        expect.assertions(8);

        var rf = new RegexFile({
            project: p,
            pathName: "./testfiles/js/t1.js",
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("$t('This is a test');\n" +
            "\ta.parse(\"This is another test.\");\n" +
            "\t\t$t('This is also a test');");

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");

        r = set.getBySource("This is also a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is also a test");
        expect(r.getKey()).toBe("r999080996");
    });

    test("RegexFile parse multiple strings with keys", function() {
        expect.assertions(12);

        var rf = new RegexFile({
            project: p,
            pathName: "./testfiles/templates/t1.tmpl",
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse(
            '<span class="alert alert-info">{\'Your password was changed. Please log in again.\'|f:\'login_success_password_changed\'}</span>\n' +
            '<span class="alert alert-info">{\'Forgot your password?\'|f:\'login_forgot_password\'}</span>');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var resources = set.getBy({
            reskey: "login_success_password_changed"
        });
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(1);
        var r = resources[0];
        expect(r.getSource()).toBe("Your password was changed. Please log in again.");
        expect(r.getAutoKey()).toBeTruthy();
        expect(r.getKey()).toBe("login_success_password_changed");

        resources = set.getBy({
            reskey: "login_forgot_password"
        });
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(1);
        r = resources[0];
        expect(r.getSource()).toBe("Forgot your password?");
        expect(r.getAutoKey()).toBeTruthy();
        expect(r.getKey()).toBe("login_forgot_password");
    });

    test("RegexFile parse multiple strings on the same line", function() {
        expect.assertions(12);

        var rf = new RegexFile({
            project: p,
            pathName: "./testfiles/js/t1.js",
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("$t('This is a test'), $t('This is a second test'), $t('This is a third test');");

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(3);

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");

        r = set.getBySource("This is a second test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a second test");
        expect(r.getKey()).toBe("r1039674256");

        r = set.getBySource("This is a third test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a third test");
        expect(r.getKey()).toBe("r917302952");
    });

    test("RegexFile parse with translator's comments", function() {
        expect.assertions(7);

        var rf = new RegexFile({
            project: p,
            pathName: "./testfiles/templates/t1.tmpl",
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('{* @L10N The message shown to users whose passwords have just been changed *}\n' +
            '{\'Your password was changed. Please log in again.\'|f:\'login_success_password_changed\'}\n');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var resources = set.getBy({
            reskey: "login_success_password_changed"
        });
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(1);
        var r = resources[0];
        expect(r.getSource()).toBe("Your password was changed. Please log in again.");
        expect(r.getKey()).toBe("login_success_password_changed");
        expect(r.getComment()).toBe("The message shown to users whose passwords have just been changed");
    });

    test("RegexFileParse multiple strings with unique IDs and their own separate comments", function() {
        expect.assertions(12);

        var rf = new RegexFile({
            project: p,
            pathName: "./testfiles/templates/t1.tmpl",
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('{* @L10N foo *}{\'This is a test\'|f:\'asdf\'}\n' +
            '{* @L10N bar *}{\'This is also a test\'|f:\'kdkdkd\'}\n');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var resources = set.getBy({
            reskey: "asdf"
        });
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(1);
        var r = resources[0];
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("asdf");
        expect(r.getComment()).toBe("foo");

        resources = set.getBy({
            reskey: "kdkdkd"
        });
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(1);
        r = resources[0];
        expect(r.getSource()).toBe("This is also a test");
        expect(r.getKey()).toBe("kdkdkd");
        expect(r.getComment()).toBe("bar");
    });

    test("RegexFileParse when parsing multiple strings, make sure an empty source string does not derail the rest of the file", function() {
        expect.assertions(9);

        var rf = new RegexFile({
            project: p,
            pathName: "./testfiles/templates/t1.tmpl",
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('{* @L10N foo *}{\'\'|f:\'asdf\'}\n' +
            'stuff stuff stuff stuff stuff\n' +
            '{* @L10N bar *}{\'This is also a test\'|f:\'kdkdkd\'}\n');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var resources = set.getBy({
            reskey: "asdf"
        });
        expect(resources).toBeTruthy();
        // should not create a resource with an empty source string
        expect(resources.length).toBe(0);

        resources = set.getBy({
            reskey: "kdkdkd"
        });
        expect(resources).toBeTruthy();
        // should not stop parsing the file after the empty source string.
        // should still find the second resource
        expect(resources.length).toBe(1);
        r = resources[0];
        expect(r.getSource()).toBe("This is also a test");
        expect(r.getKey()).toBe("kdkdkd");
        expect(r.getComment()).toBe("bar");
    });

    test("RegexFileParseWithDups", function() {
        expect.assertions(7);

        var rf = new RegexFile({
            project: p,
            pathName: "./testfiles/js/t1.js",
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("$t('This is a test');\n" +
            "\ta.parse('This is another test to see that it doesn\'t extract this one erroneously.');\n" +
            "\t\t$t('This is a test');\n");

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var resources = set.getBy({
            reskey: "r654479252"
        });
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(1);
        var r = resources[0];
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");

        // should not have two entries with the same key and the same source
        expect(set.size()).toBe(1);
    });

    test("RegexFileParse dups that differ by key only", function() {
        expect.assertions(10);

        var rf = new RegexFile({
            project: p,
            pathName: "./testfiles/templates/t1.tmpl",
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('{\'This is a test\'|f:\'asdf\'}\n' +
            '{\'This is a test\'|f:\'kdkdkd\'}\n');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var resources = set.getBy({
            reskey: "asdf"
        });
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(1);
        var r = resources[0];
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("asdf");

        resources = set.getBy({
            reskey: "kdkdkd"
        });
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(1);
        r = resources[0];
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("kdkdkd");
    });

    test("RegexFile when the result of parsing is the empty string", function() {
        expect.assertions(3);

        var rf = new RegexFile({
            project: p,
            pathName: "./testfiles/js/t1.js",
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("var subcats = [$t(''), $t(''), $t('')];\n");

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        // no need to translate empty strings!
        expect(set.size()).toBe(0);
    });

    test("RegexFile using a whole key strategy", function() {
        expect.assertions(6);

        var rf = new RegexFile({
            project: p,
            pathName: "./testfiles/js/t1.js",
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('$wholekey("This is a test with a really long source string that just drones on and on and on");');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var resources = set.getBy({
            reskey: "This is a test with a really long source string that just drones on and on and on"
        });
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(1);
        var r = resources[0];
        expect(r.getSource()).toBe("This is a test with a really long source string that just drones on and on and on");
        expect(r.getKey()).toBe("This is a test with a really long source string that just drones on and on and on");
    });

    test("RegexFile using a truncated key strategy", function() {
        expect.assertions(6);

        var rf = new RegexFile({
            project: p,
            pathName: "./testfiles/js/t1.js",
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('$truncatedkey("This is a test with a really long source string that just drones on and on and on");');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        // should truncate the key to 32 characters
        var resources = set.getBy({
            reskey: "This is a test with a really lon"
        });
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(1);
        var r = resources[0];
        expect(r.getSource()).toBe("This is a test with a really long source string that just drones on and on and on");
        expect(r.getKey()).toBe("This is a test with a really lon");
    });


    test("RegexFile using a key with escaped Unicode characters", function() {
        expect.assertions(6);

        var rf = new RegexFile({
            project: p,
            pathName: "./testfiles/js/t1.js",
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('$u("This is a test with an escaped Unicode character: \\u00a9");');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var resources = set.getBy({
            reskey: "r604348468"
        });
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(1);
        var r = resources[0];
        expect(r.getSource()).toBe("This is a test with an escaped Unicode character: ©");
        expect(r.getKey()).toBe("r604348468");
    });

    test("RegexFile extract strings from a file on disk", function() {
        expect.assertions(10);

        var rf = new RegexFile({
            project: p,
            pathName: "./js/t1.js",
            type: rft
        });
        expect(rf).toBeTruthy();

        // should read the file
        rf.extract();

        var set = rf.getTranslationSet();

        expect(set.size()).toBe(2);

        var resources = set.getBy({
            reskey: "r654479252"
        });
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(1);
        var r = resources[0];
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");

        var resources = set.getBy({
            reskey: "r963237711"
        });
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(1);
        var r = resources[0];
        expect(r.getSource()).toBe("This is a test with a unique id");
        expect(r.getKey()).toBe("r963237711");
    });

    test("RegexFile extract strings from a template file on disk", function() {
        expect.assertions(32);

        var rf = new RegexFile({
            project: p,
            pathName: "./tmpl/topic_types.tmpl",
            type: rft
        });
        expect(rf).toBeTruthy();

        // should read the file and apply the right set of regexes
        rf.extract();

        var set = rf.getTranslationSet();

        expect(set.size()).toBe(9);

        var resources = set.getBy({
            reskey: "description"
        });
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(1);
        var r = resources[0];
        expect(r.getSource()).toBe("Description");
        expect(r.getKey()).toBe("description");
        expect(r.getDataType()).toBe("template");
        expect(r.getComment()).toBe("topic type label for the icon");

        resources = set.getBy({
            reskey: "participants"
        });
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(1);
        r = resources[0];
        expect(r.getSource()).toBe("Participants");
        expect(r.getKey()).toBe("participants");
        expect(r.getDataType()).toBe("template");
        expect(r.getComment()).toBe("topic type label for the icon");

        resources = set.getBy({
            reskey: "activities"
        });
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(1);
        r = resources[0];
        expect(r.getSource()).toBe("Activities and Events");
        expect(r.getKey()).toBe("activities");
        expect(r.getDataType()).toBe("template");
        expect(r.getComment()).toBe("topic type label for the icon");

        resources = set.getBy({
            reskey: "see_more"
        });
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(1);
        r = resources[0];
        expect(r.getSource()).toBe("See more");
        expect(r.getKey()).toBe("see_more");
        expect(r.getDataType()).toBe("template");
        expect(r.getComment()).toBe("label for the button that shows more items");

        resources = set.getBy({
            reskey: "cancel"
        });
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(1);
        r = resources[0];
        expect(r.getSource()).toBe("Cancel");
        expect(r.getKey()).toBe("cancel");
        expect(r.getDataType()).toBe("template");
        expect(r.getComment()).toBeUndefined();
    });

    test("RegexFileExtractUndefinedFile", function() {
        expect.assertions(2);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        // should attempt to read the file and not fail
        rf.extract();

        var set = rf.getTranslationSet();

        expect(set.size()).toBe(0);
    });

    test("RegexFileExtractBogusFile", function() {
        expect.assertions(2);

        var rf = new RegexFile({
            project: p,
            pathName: "./java/foo.js",
            type: rft
        });
        expect(rf).toBeTruthy();

        // should attempt to read the file and not fail
        rf.extract();

        var set = rf.getTranslationSet();

        expect(set.size()).toBe(0);
    });

    test("RegexFile reports missing a mapping for a file, but goes on", function() {
        expect.assertions(2);

        var rf = new RegexFile({
            project: p2,
            pathName: "./testfiles/js/t1.php",  // no mappings for php files
            type: rft2
        });
        expect(rf).toBeTruthy();

        var actual = rf.parse("$t('This is a test');");
        expect(actual).toBeUndefined();
    });

    test("RegexFile throws correct error if you attempt to parse a file with no expressions available", function() {
        expect.assertions(1);

        var rf = new RegexFile({
            project: p2,
            pathName: "./testfiles/js/t1.js",
            type: rft2
        });

        // there is a mapping for *.js files, but there are no regular expressions in it
        // in this case, we throw the error to force the user to put in some regular expressions

        expect(() => rf.parse("$t('This is a test');")).toThrow(
            new Error("No expressions found in project.json for ./testfiles/js/t1.js")
        );
    });

    test("RegexFile gets the right unescaped source string in a javascript file", function() {
        expect.assertions(5);

        var rf = new RegexFile({
            project: p,
            pathName: "./testfiles/js/t1.js",
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("$t('foob`\\n\\r\\t\\\\a\\u317Dr\\u{1D11E}');");

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        // javascript escaping is the default, so it doesn't need to be
        // specified in the mapping
        var r = set.getBySource("foob`\n\r\t\\a\u317Dr\u{1D11E}");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("foob`\n\r\t\\a\u317Dr\u{1D11E}");
        expect(r.getKey()).toBe("r157823627");
    });

    test("RegexFile gets the right unescaped source string in a Smarty template file", function() {
        expect.assertions(5);

        var rf = new RegexFile({
            project: p,
            pathName: "./testfiles/templates/t1.tmpl",
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("{\'abc \\\"e\\\" \\$\\n\\r\\t\\f\\vT \\u{317D}r\\u{1D11E}\'|f:\'key\'}");

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        // smarty escaping doesn't do Unicode characters
        var r = set.getBySource("abc \"e\" $\n\r\t\f\vT \\u{317D}r\\u{1D11E}");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("abc \"e\" $\n\r\t\f\vT \\u{317D}r\\u{1D11E}");
        expect(r.getKey()).toBe("key");
    });
});
