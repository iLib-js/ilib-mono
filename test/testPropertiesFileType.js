/*
 * testPropertiesFileType.js - test the Java properties file type handler object.
 *
 * Copyright © 2019, JEDLSoft
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

if (!PropertiesFileType) {
    var PropertiesFileType = require("../PropertiesFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
}

var p = new CustomProject({
    id: "webapp",
    name: "webapp",
    sourceLocale: "en-US"
}, "./test/testfiles", {
    locales:["en-GB"]
});

module.exports.propertiesfiletype = {
    testPropertiesFileTypeConstructor: function(test) {
        test.expect(1);

        var htf = new PropertiesFileType(p);

        test.ok(htf);

        test.done();
    },

    testPropertiesFileTypeHandlesPropertiesTrue: function(test) {
        test.expect(2);

        var htf = new PropertiesFileType(p);
        test.ok(htf);

        test.ok(htf.handles("foo.properties"));

        test.done();
    },

    testPropertiesFileTypeHandlesPropertiesFalseClose: function(test) {
        test.expect(2);

        var htf = new PropertiesFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("fooproperties"));

        test.done();
    },

    testPropertiesFileTypeHandlesFalse: function(test) {
        test.expect(2);

        var htf = new PropertiesFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("foo.html"));

        test.done();
    },

    testPropertiesFileTypeHandlesXmlFalse: function(test) {
        test.expect(2);

        var htf = new PropertiesFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("foo.xml"));

        test.done();
    },

    testPropertiesFileTypeHandlesAlreadyLocalized: function(test) {
        test.expect(3);

        var htf = new PropertiesFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("foo_de.properties"));
        test.ok(!htf.handles("foo_de_DE.properties"));

        test.done();
    },

    testPropertiesFileTypeHandlesSourceLocale: function(test) {
        test.expect(2);

        var htf = new PropertiesFileType(p);
        test.ok(htf);

        test.ok(htf.handles("foo_en_US.properties"));

        test.done();
    },

    testPropertiesFileTypeHandlesAlmostSourceLocale: function(test) {
        test.expect(2);

        var htf = new PropertiesFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("foo_en.properties"));

        test.done();
    },

    testPropertiesFileTypeHandlesPropertiesTrueWithDir: function(test) {
        test.expect(2);

        var htf = new PropertiesFileType(p);
        test.ok(htf);

        test.ok(htf.handles("a/b/c/foo.properties"));

        test.done();
    },

    testPropertiesFileTypeHandlesPropertiesAlreadyLocalizeWithDir: function(test) {
        test.expect(2);

        var htf = new PropertiesFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("a/b/c/foo_de_DE.properties"));

        test.done();
    }

};
