/*
 * testPOFileType.js - test the po file type handler object.
 *
 * Copyright © 2021, Box, Inc.
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

if (!POFileType) {
    var POFileType = require("../POFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
}

var p = new CustomProject({
    sourceLocale: "en-US"
}, "./testfiles", {
    locales:["en-GB"],
    po: {
        "mappings": {
            "en.pot": {
                "method": "copy",
                "template": "[dir]/[locale].po"
            },
            "resources/en/US/strings.po": {
                "method": "copy",
                "template": "resources/[localeDir]/strings.po"
            },
            "**/messages.po": {
                "method": "copy",
                "template": "resources/[localeDir]/messages.po"
            },
            "**/test/str.jsn": {
                "method": "copy",
                "template": "[dir]/[localeDir]/str.po"
            }
        }
    }
});


var p2 = new CustomProject({
    sourceLocale: "en-US"
}, "./testfiles", {
    locales:["en-GB"],
    po: {
        mappings: {
            "**/strings.po": {
                "method": "copy",
                "template": "resources/[localeDir]/strings.po"
            }
        }
    }
});


module.exports.pofiletype = {
    testPOFileTypeConstructor: function(test) {
        test.expect(1);

        var jft = new POFileType(p);

        test.ok(jft);

        test.done();
    },

    testPOFileTypeGetLocalizedPathLocaleDir: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.equals(jft.getLocalizedPath('resources/[localeDir]/strings.po', "x/y/strings.po", "de-DE"), "resources/de/DE/strings.po");

        test.done();
    },

    testPOFileTypeGetLocalizedPathDir: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.equals(jft.getLocalizedPath('[dir]/[localeDir]/strings.po', "x/y/strings.po", "de-DE"), "x/y/de/DE/strings.po");

        test.done();
    },

    testPOFileTypeGetLocalizedPathBasename: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.equals(jft.getLocalizedPath('[localeDir]/tr-[basename].j', "x/y/strings.po", "de-DE"), "de/DE/tr-strings.j");

        test.done();
    },

    testPOFileTypeGetLocalizedPathFilename: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.equals(jft.getLocalizedPath('[localeDir]/tr-[filename]', "x/y/strings.po", "de-DE"), "de/DE/tr-strings.po");

        test.done();
    },

    testPOFileTypeGetLocalizedPathExtension: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.equals(jft.getLocalizedPath('[localeDir]/tr-foobar.[extension]', "x/y/strings.jsn", "de-DE"), "de/DE/tr-foobar.jsn");

        test.done();
    },

    testPOFileTypeGetLocalizedPathLocale: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.equals(jft.getLocalizedPath('[dir]/[locale]/strings.po', "x/y/strings.po", "de-DE"), "x/y/de-DE/strings.po");

        test.done();
    },

    testPOFileTypeGetLocalizedPathLanguage: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.equals(jft.getLocalizedPath('[dir]/[language]/strings.po', "x/y/strings.po", "de-DE"), "x/y/de/strings.po");

        test.done();
    },

    testPOFileTypeGetLocalizedPathRegion: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.equals(jft.getLocalizedPath('[dir]/[region]/strings.po', "x/y/strings.po", "de-DE"), "x/y/DE/strings.po");

        test.done();
    },

    testPOFileTypeGetLocalizedPathScript: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.equals(jft.getLocalizedPath('[dir]/[script]/strings.po', "x/y/strings.po", "zh-Hans-CN"), "x/y/Hans/strings.po");

        test.done();
    },

    testPOFileTypeGetLocalizedPathLocaleUnder: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.equals(jft.getLocalizedPath('[dir]/strings_[localeUnder].po', "x/y/strings.po", "zh-Hans-CN"), "x/y/strings_zh_Hans_CN.po");

        test.done();
    },

    testPOFileTypeGetLocaleFromPathDir: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.equals(jft.getLocaleFromPath('[dir]/strings.po', "x/y/strings.po"), "");

        test.done();
    },

    testPOFileTypeGetLocaleFromPathBasename: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.equals(jft.getLocaleFromPath('[dir]/[basename].po', "x/y/strings.po"), "");

        test.done();
    },

    testPOFileTypeGetLocaleFromPathFilename: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.equals(jft.getLocaleFromPath('[dir]/[filename]', "x/y/strings.po"), "");

        test.done();
    },

    testPOFileTypeGetLocaleFromPathLocale: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.equals(jft.getLocaleFromPath('[dir]/[locale]/strings.po', "x/y/de-DE/strings.po"), "de-DE");

        test.done();
    },

    testPOFileTypeGetLocaleFromPathLocaleLong: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.equals(jft.getLocaleFromPath('[dir]/[locale]/strings.po', "x/y/zh-Hans-CN/strings.po"), "zh-Hans-CN");

        test.done();
    },

    testPOFileTypeGetLocaleFromPathLocaleShort: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.equals(jft.getLocaleFromPath('[dir]/[locale]/strings.po', "x/y/fr/strings.po"), "fr");

        test.done();
    },

    testPOFileTypeGetLocaleFromPathLanguage: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.equals(jft.getLocaleFromPath('[dir]/[language]/strings.po', "x/y/de/strings.po"), "de");

        test.done();
    },

    testPOFileTypeGetLocaleFromPathScript: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.equals(jft.getLocaleFromPath('[dir]/[language]-[script]/strings.po', "x/y/zh-Hans/strings.po"), "zh-Hans");

        test.done();
    },

    testPOFileTypeGetLocaleFromPathRegion: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.equals(jft.getLocaleFromPath('[dir]/[region]/strings.po', "x/y/JP/strings.po"), "JP");

        test.done();
    },

     testPOFileTypeGetLocaleFromPathLocaleDir: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.equals(jft.getLocaleFromPath('[dir]/[localeDir]/strings.po', "x/y/de/DE/strings.po"), "de-DE");

        test.done();
    },

     testPOFileTypeGetLocaleFromPathLocaleDirShort: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.equals(jft.getLocaleFromPath('[dir]/[localeDir]/strings.po', "x/y/de/strings.po"), "de");

        test.done();
    },

     testPOFileTypeGetLocaleFromPathLocaleDirLong: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.equals(jft.getLocaleFromPath('[dir]/[localeDir]/strings.po', "x/y/zh/Hans/CN/strings.po"), "zh-Hans-CN");

        test.done();
    },

     testPOFileTypeGetLocaleFromPathLocaleDirStart: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.equals(jft.getLocaleFromPath('[localeDir]/strings.po', "de/DE/strings.po"), "de-DE");

        test.done();
    },

     testPOFileTypeGetLocaleFromPathLocaleUnder: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.equals(jft.getLocaleFromPath('[dir]/strings_[localeUnder].po', "x/y/strings_de_DE.po"), "de-DE");

        test.done();
    },

     testPOFileTypeGetLocaleFromPathLocaleUnderShort: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.equals(jft.getLocaleFromPath('[dir]/strings_[localeUnder].po', "x/y/strings_de.po"), "de");

        test.done();
    },

     testPOFileTypeGetLocaleFromPathLocaleUnderLong: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.equals(jft.getLocaleFromPath('[dir]/strings_[localeUnder].po', "x/y/strings_zh_Hans_CN.po"), "zh-Hans-CN");

        test.done();
    },

     testPOFileTypeGetMapping1: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.deepEqual(jft.getMapping("x/y/messages.po"), {
            "method": "copy",
            "template": "resources/[localeDir]/messages.po"
        });

        test.done();
    },

     testPOFileTypeGetMapping2: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.deepEqual(jft.getMapping("resources/en/US/strings.po"), {
            "method": "copy",
            "template": "resources/[localeDir]/strings.po"
        });

        test.done();
    },

     testPOFileTypeGetMappingNoMatch: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.ok(!jft.getMapping("x/y/msg.pso"));

        test.done();
    },

    testPOFileTypeHandlesExtensionPOTrue: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.ok(jft.handles("en-US.po"));

        test.done();
    },

    testPOFileTypeHandlesExtensionPOTTrue: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.ok(jft.handles("strings.pot"));

        test.done();
    },

    testPOFileTypeHandlesExtensionFalse: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.ok(!jft.handles("en-US.pohandle"));

        test.done();
    },

    testPOFileTypeHandlesNotSource: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.ok(!jft.handles("de.po"));

        test.done();
    },

    testPOFileTypeHandlesSource: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.ok(jft.handles("en-US.po"));

        test.done();
    },

    testPOFileTypeHandlesTrueWithDir: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.ok(jft.handles("x/y/z/messages.pot"));

        test.done();
    },

    testPOFileTypeHandlesFalseWrongDir: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.ok(!jft.handles("x/y/z/str.pot"));

        test.done();
    },

    testPOFileTypeHandlesFalseRightDir: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.ok(jft.handles("x/y/z/test/str.pot"));

        test.done();
    },

    testPOFileTypeHandlesTrueSourceLocale: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        test.ok(jft.handles("resources/en/US/messages.pot"));

        test.done();
    },

    testPOFileTypeHandlesAlternateExtensionTrue: function(test) {
        test.expect(3);

        var jft = new POFileType(p);
        test.ok(jft);

        test.ok(jft.handles("en-US.po"));
        test.ok(jft.handles("en-US.pot"));

        test.done();
    },

    testPOFileTypeHandlesAlreadyLocalizedGB: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        // This matches one of the templates, but thge locale is
        // not the source locale, so we don't need to
        // localize it again.
        test.ok(!jft.handles("resources/en/GB/messages.po"));

        test.done();
    },

    testPOFileTypeHandlesAlreadyLocalizedCN: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        // This matches one of the templates, but thge locale is
        // not the source locale, so we don't need to
        // localize it again.
        test.ok(!jft.handles("resources/zh/Hans/CN/messages.po"));

        test.done();
    },

    testPOFileTypeHandlesNotAlreadyLocalizedenUS: function(test) {
        test.expect(2);

        var jft = new POFileType(p);
        test.ok(jft);

        // we figure this out from the template
        test.ok(jft.handles("resources/en/US/messages.po"));

        test.done();
    }
};
