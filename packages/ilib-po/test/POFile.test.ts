/*
 * POFile.test.ts - test the po and pot file handler object.
 *
 * Copyright © 2024 Box, Inc.
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

import { ResourceString } from "ilib-tools-common";

import POFile from "../src/POFile";

describe("pofile", () => {
  test("POFile Constructor no args", () => {
    expect.assertions(1);

    expect(() => {
      // @ts-expect-error -- testing invalid args
      const pof = new POFile(undefined);
    }).toThrow();
  });

  test("POFile Constructor missing args", () => {
    expect.assertions(1);

    expect(() => {
      new POFile(
        // @ts-expect-error -- testing invalid args
        { pathName: undefined },
      );
    }).toThrow();
  });

  test("POFile constructor with basic options", () => {
    expect.assertions(2);

    const pof = new POFile({
      pathName: "./testfiles/po/messages.po",
    });

    expect(pof).toBeTruthy();
    expect(pof.getPathName()).toBe("./testfiles/po/messages.po");
  });

  test("POFile constructor test defaults", () => {
    expect.assertions(6);

    const pof = new POFile({
      pathName: "./testfiles/po/messages.po",
    });

    expect(pof).toBeTruthy();
    expect(pof.getSourceLocale()).toBe("en-US");
    expect(pof.getTargetLocale()).toBeUndefined();
    expect(pof.getProjectName()).toBe("messages");
    expect(pof.getDatatype()).toBe("po");
    expect(pof.getContextInKey()).toBeFalsy();
  });
  test("POFile constructor with all the options", () => {
    expect.assertions(7);

    const pof = new POFile({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en",
      targetLocale: "de-DE",
      projectName: "foo",
      datatype: "javascript",
      contextInKey: true,
    });
    expect(pof).toBeTruthy();
    expect(pof.getPathName()).toBe("./testfiles/po/messages.po");
    expect(pof.getSourceLocale()).toBe("en");
    expect(pof.getTargetLocale()).toBe("de-DE");
    expect(pof.getProjectName()).toBe("foo");
    expect(pof.getDatatype()).toBe("javascript");
    expect(pof.getContextInKey()).toBeTruthy();
  });

  test("POFile parse simple", () => {
    expect.assertions(7);

    const pof = new POFile({
      pathName: "./testfiles/po/messages.po",
    });
    expect(pof).toBeTruthy();

    const set = pof.parse('msgid "string 1"\n');

    expect(set).toBeTruthy();

    const r = set.get(
      ResourceString.hashKey("messages", "en-US", "string 1", "po"),
    );
    expect(r).toBeTruthy();

        expect(r.getSource()).toBe("string 1");
        expect(r.getSourceLocale()).toBe("en-US");
        expect(r.getKey()).toBe("string 1");
        expect(r.getType()).toBe("string");
    });

    test("parses escaped backslashes and quotes", () => {
        const file = new POFile({
            pathName: "./testfiles/po/messages.po",
            targetLocale: "es-ES",
        });

        const set = file.parse(
            'msgid "Name cannot contain \\"/\\", \\"\\\\\\", or characters outside the basic multilingual plane.\\""\n' +
            'msgstr "El nombre no puede contener \\"/\\", \\"\\\\\\", o caracteres fuera del plano multilingüe básico.\\""\n'
        );

        const source = 'Name cannot contain "/", "\\", or characters outside the basic multilingual plane."';
        const target = 'El nombre no puede contener "/", "\\", o caracteres fuera del plano multilingüe básico."';


        // When a target locale exists and there is a translation, ResourceString.hashKey()
        // uses the target locale (not the source locale).
        const resource = set.get(ResourceString.hashKey("messages", "es-ES", source, "po"));

        expect(resource.getSource()).toBe(source);
        expect(resource.getTarget()).toBe(target);
    });
});
