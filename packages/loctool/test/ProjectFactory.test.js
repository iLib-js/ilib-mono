/*
 * ProjectFactory.test.js - test class used to load Projects
 *
 * Copyright © 2017, 2020, 2023, 2025-2026, HealthTap, Inc.
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

if (!ProjectFactory) {
    var ProjectFactory= require("../lib/ProjectFactory.js");
}
var fs = require("fs");
var path = require("path");

describe("projectfactory", function() {
    test("ProjectFactoryCreationAllEmpty", function() {
        expect.assertions(1);
        var project = ProjectFactory('', {});
        expect(project).toBeUndefined();
    });

    test("ProjectFactoryCreationFromJsonNoSettings", function() {
        expect.assertions(5);
        var project = ProjectFactory('./test/testfiles', {});
        expect(project).not.toBe(undefined);
        expect(project.settings).not.toBeUndefined();
        expect(project.root).toBe('./test/testfiles');
        expect(project.sourceLocale).toBe('en-US');
        expect(project.pseudoLocale).toBe('de-DE');
    });

    test("ProjectFactoryCreationFromJsonWithSettingsMerged", function() {
        expect.assertions(4);
        var project = ProjectFactory('./test/testfiles', {'abc': 'def'});
        expect(project).not.toBe(undefined);
        expect(project.settings).not.toBe(undefined);
        var set = project.settings;
        expect(set['abc']).toBe('def');
        expect(set.locales).not.toBe(undefined);
    });

    test("ProjectFactoryCreationFromJsonWithSettingsOverwrite", function() {
        expect.assertions(4);
        var project = ProjectFactory('./test/testfiles', {'locales': ['def']});
        expect(project).not.toBe(undefined);
        expect(project.settings).not.toBe(undefined);
        var set = project.settings;
        expect(set.locales).not.toBe(undefined);
        var loc = set.locales;
        expect(loc.length).not.toBe(1);
    });

    test("ProjectFactoryCorrectRoot", function() {
        expect.assertions(2);
        var project = ProjectFactory('./test/testfiles', {'locales': ['def']});
        expect(project).toBeTruthy();
        expect(project.root).toBe('./test/testfiles');
    });

    test("ProjectFactoryCorrectDefaultTarget", function() {
        expect.assertions(2);
        var project = ProjectFactory('./test/testfiles', {'locales': ['def']});
        expect(project).toBeTruthy();
        // should be relative to the root of the project
        expect(project.target).toBe('test/testfiles');
    });

    test("ProjectFactoryCorrectDefaultTranslationsDir", function() {
        expect.assertions(2);
        var project = ProjectFactory('./test/testfiles', {'locales': ['def']});
        expect(project).toBeTruthy();
        // should be relative to the root of the project
        expect(project.translationsDir).toStrictEqual(['test/testfiles']);
    });

    test("ProjectFactoryCorrectDefaultXliffsOut", function() {
        expect.assertions(2);
        var project = ProjectFactory('./test/testfiles', {'locales': ['def']});
        expect(project).toBeTruthy();
        // should be relative to the root of the project
        expect(project.xliffsOut).toBe('test/testfiles');
    });

    test("ProjectFactoryCorrectExplicitTarget", function() {
        expect.assertions(2);
        var project = ProjectFactory('./test/testfiles', {'locales': ['def'], 'targetDir': 'foobar'});
        expect(project).toBeTruthy();
        // should be relative to the root of the project
        expect(project.target).toBe('test/testfiles/foobar');
    });

    test("ProjectFactoryCorrectExplicitTranslationsDir", function() {
        expect.assertions(2);
        var project = ProjectFactory('./test/testfiles', {'locales': ['def'], 'translationsDir': 'asdf'});
        expect(project).toBeTruthy();
        // should be relative to the root of the project
        expect(project.translationsDir).toStrictEqual(['test/testfiles/asdf']);
    });

    test("ProjectFactoryCorrectExplicitTranslationsDir still accepts old xliffsDir parameter", function() {
        expect.assertions(2);
        var project = ProjectFactory('./test/testfiles', {'locales': ['def'], 'xliffsDir': 'asdf'});
        expect(project).toBeTruthy();
        // should be relative to the root of the project
        expect(project.translationsDir).toStrictEqual(['test/testfiles/asdf']);
    });

    test("ProjectFactoryCorrectExplicitXliffsOut", function() {
        expect.assertions(2);
        var project = ProjectFactory('./test/testfiles', {'locales': ['def'], 'xliffsOut': 'blah'});
        expect(project).toBeTruthy();
        // should be relative to the root of the project
        expect(project.xliffsOut).toBe('test/testfiles/blah');
    });

    test("ProjectFactoryAbsolutePathTargetDir", function() {
        expect.assertions(2);
        var targetAbsolutePath = '/foo/asdf';
        var project = ProjectFactory('./test/testfiles', {'locales': ['def'], 'targetDir': targetAbsolutePath});
        expect(project).toBeTruthy();
        // should be relative to the root of the project
        expect(project.target).toBe('/foo/asdf');
    });

    test("ProjectFactoryAbsolutePathTranslationsDir", function() {
        expect.assertions(2);
        var xliffAbsolutePath = '/foo/asdf';
        var project = ProjectFactory('./test/testfiles', {'locales': ['def'], 'translationsDir': xliffAbsolutePath});
        expect(project).toBeTruthy();
        // should be relative to the root of the project
        expect(project.translationsDir).toStrictEqual(['/foo/asdf']);
    });

    test("ProjectFactoryAbsolutePathxliffsOut", function() {
        expect.assertions(2);
        var xliffAbsolutePath = '/foo/asdf';
        var project = ProjectFactory('./test/testfiles', {'locales': ['def'], 'xliffsOut': xliffAbsolutePath});
        expect(project).toBeTruthy();
        // should be relative to the root of the project
        expect(project.xliffsOut).toBe('/foo/asdf');
    });

    test("ProjectFactoryDefaultConfigFileName", function() {
        expect.assertions(2);
        expect(ProjectFactory.getConfigFileName({})).toBe("project.json");
        expect(ProjectFactory.getConfigFileName(undefined)).toBe("project.json");
    });

    test("ProjectFactoryDefaultConfigFileLoadsProjectJson", function() {
        expect.assertions(2);
        var project = ProjectFactory('./test/testfiles', {});
        expect(project).not.toBeUndefined();
        // make sure it loaded the default project.json file instead of the loctool.json file
        expect(project.getProjectId()).toBe('loctest');
    });

    test("ProjectFactoryCustomConfigFileName", function() {
        expect.assertions(3);
        expect(ProjectFactory.getConfigFileName({configFile: "loctool.json"})).toBe("loctool.json");

        var project = ProjectFactory('./test/testfiles', {configFile: "loctool.json"});
        expect(project).not.toBeUndefined();
        expect(project.options.id).toBe("loctest-alt");
    });

    test("ProjectFactoryCustomConfigFileNameDoesNotLoadDefault", function() {
        expect.assertions(1);
        var project = ProjectFactory('./test/testfiles', {configFile: "missing-config.json"});
        expect(project).toBeUndefined();
    });

    test("ProjectFactoryCustomConfigFileNameInSubdirectory", function() {
        expect.assertions(3);
        var project = ProjectFactory('./test/testfiles/x/y/z', {configFile: "loctool.json"});
        expect(project).not.toBeUndefined();
        expect(project.getProjectId()).toBe('loctest-nested');
        expect(project.root).toBe('./test/testfiles/x/y/z');
    });

});

describe("ProjectFactory.validateLoctoolConfig", function() {
    test("accepts config with valid $schema", function() {
        var result = ProjectFactory.validateLoctoolConfig({
            "$schema": ProjectFactory.LOCTOOL_SCHEMA,
            "name": "Test",
            "id": "test",
            "projectType": "web"
        });
        expect(result.valid).toBe(true);
    });

    test("rejects config with wrong $schema", function() {
        var result = ProjectFactory.validateLoctoolConfig({
            "$schema": "https://nx.dev/schemas/project-schema.json",
            "name": "Test",
            "id": "test",
            "projectType": "web"
        });
        expect(result.valid).toBe(false);
        expect(result.reason).toContain("$schema");
    });

    test("rejects config missing required id", function() {
        var result = ProjectFactory.validateLoctoolConfig({
            "name": "Test",
            "projectType": "web"
        });
        expect(result.valid).toBe(false);
        expect(result.reason).toContain("id");
    });

    test("rejects config with invalid projectType", function() {
        var result = ProjectFactory.validateLoctoolConfig({
            "name": "Test",
            "id": "test",
            "projectType": "library"
        });
        expect(result.valid).toBe(false);
        expect(result.reason).toContain("projectType");
    });

    test("accepts custom config without plugins", function() {
        var result = ProjectFactory.validateLoctoolConfig({
            "name": "Test",
            "id": "test",
            "projectType": "custom"
        });
        expect(result.valid).toBe(true);
    });

    test("rejects config when all extra properties are foreign", function() {
        var result = ProjectFactory.validateLoctoolConfig({
            "name": "Test",
            "id": "test",
            "projectType": "custom",
            "targets": {},
            "sourceRoot": "src"
        });
        expect(result.valid).toBe(false);
        expect(result.reason).toContain("unrecognized properties");
    });

    test("accepts legacy config without $schema when properties are valid", function() {
        var result = ProjectFactory.validateLoctoolConfig({
            "name": "Loctool Test",
            "id": "loctest",
            "projectType": "web",
            "resourceDirs": {"js": "public"},
            "settings": {"locales": ["de-DE"]}
        });
        expect(result.valid).toBe(true);
        expect(result.unknownProperties).toBeUndefined();
    });

    test("accepts config with unknown properties when at least one extra is allowed", function() {
        var result = ProjectFactory.validateLoctoolConfig({
            "name": "Test",
            "id": "test",
            "projectType": "web",
            "settings": {"locales": ["de-DE"]},
            "unknownProperty": true
        });
        expect(result.valid).toBe(true);
        expect(result.unknownProperties).toStrictEqual(["unknownProperty"]);
    });

    test("accepts minimal config with only required properties", function() {
        var result = ProjectFactory.validateLoctoolConfig({
            "name": "Test",
            "id": "test",
            "projectType": "web"
        });
        expect(result.valid).toBe(true);
    });
});

describe("ProjectFactory config file validation", function() {
    function loadConfigFixture(subdir) {
        var file = path.join(__dirname, "testfiles", "config-validation", subdir, "project.json");
        return JSON.parse(fs.readFileSync(file, "utf8"));
    }

    test("loads valid config with $schema from disk", function() {
        var props = loadConfigFixture("valid-with-schema");
        expect(ProjectFactory.validateLoctoolConfig(props).valid).toBe(true);

        var project = ProjectFactory('./test/testfiles/config-validation/valid-with-schema', {});
        expect(project).toBeTruthy();
        expect(project.getProjectId()).toBe('valid-with-schema');
    });

    test("ignores config with wrong $schema from disk", function() {
        var props = loadConfigFixture("invalid-wrong-schema");
        var validation = ProjectFactory.validateLoctoolConfig(props);
        expect(validation.valid).toBe(false);
        expect(validation.reason).toContain("$schema");

        var project = ProjectFactory('./test/testfiles/config-validation/invalid-wrong-schema', {});
        expect(project).toBeUndefined();
    });

    test("ignores config missing required properties from disk", function() {
        var props = loadConfigFixture("invalid-missing-id");
        var validation = ProjectFactory.validateLoctoolConfig(props);
        expect(validation.valid).toBe(false);
        expect(validation.reason).toContain("id");

        var project = ProjectFactory('./test/testfiles/config-validation/invalid-missing-id', {});
        expect(project).toBeUndefined();
    });

    test("ignores config with invalid projectType from disk", function() {
        var props = loadConfigFixture("invalid-project-type");
        var validation = ProjectFactory.validateLoctoolConfig(props);
        expect(validation.valid).toBe(false);
        expect(validation.reason).toContain("projectType");

        var project = ProjectFactory('./test/testfiles/config-validation/invalid-project-type', {});
        expect(project).toBeUndefined();
    });

    test("loads custom config without plugins from disk", function() {
        var props = loadConfigFixture("valid-custom-no-plugins");
        var validation = ProjectFactory.validateLoctoolConfig(props);
        expect(validation.valid).toBe(true);

        var project = ProjectFactory('./test/testfiles/config-validation/valid-custom-no-plugins', {});
        expect(project).toBeTruthy();
        expect(project.getProjectId()).toBe('valid-custom-no-plugins');
    });

    test("ignores config with only foreign extra properties from disk", function() {
        var props = loadConfigFixture("invalid-all-foreign");
        var validation = ProjectFactory.validateLoctoolConfig(props);
        expect(validation.valid).toBe(false);
        expect(validation.reason).toContain("unrecognized properties");

        var project = ProjectFactory('./test/testfiles/config-validation/invalid-all-foreign', {});
        expect(project).toBeUndefined();
    });

    test("loads valid minimal config without $schema from disk", function() {
        var props = loadConfigFixture("valid-minimal");
        expect(ProjectFactory.validateLoctoolConfig(props).valid).toBe(true);

        var project = ProjectFactory('./test/testfiles/config-validation/valid-minimal', {});
        expect(project).toBeTruthy();
        expect(project.getProjectId()).toBe('valid-minimal');
    });

    test("loads config with unknown properties and reports them for warnings from disk", function() {
        var props = loadConfigFixture("valid-with-warnings");
        var validation = ProjectFactory.validateLoctoolConfig(props);
        expect(validation.valid).toBe(true);
        expect(validation.unknownProperties).toStrictEqual(["unknownProperty"]);

        var project = ProjectFactory('./test/testfiles/config-validation/valid-with-warnings', {});
        expect(project).toBeTruthy();
        expect(project.getProjectId()).toBe('valid-with-warnings');
    });

    test("existing testfiles project.json still loads without $schema", function() {
        var project = ProjectFactory('./test/testfiles', {});
        expect(project).toBeTruthy();
        expect(project.getProjectId()).toBe('loctest');
    });

    test("init getConfig includes loctool $schema", function() {
        var project = ProjectFactory.newProject({
            name: "Init Test",
            id: "init-test",
            projectType: "web",
            rootDir: "."
        }, {});
        var config = project.getConfig({configFile: "project.json"});
        expect(config.$schema).toBe(ProjectFactory.LOCTOOL_SCHEMA);
        expect(config.projectType).toBe("web");
    });
});

