/*
 * CSV.test.ts - test the CSV parser and serializer
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
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { CSV } from "../src/index";

describe("ilib-csv", () => {
  describe("parse", () => {
    test("parse simple csv", () => {
      const csv = new CSV();
      const data = "id,name,description\n1,foo,bar\n2,baz,qux";
      const records = csv.parse(data);
      expect(records).toHaveLength(2);
      expect(records[0]).toEqual({
        id: "1",
        name: "foo",
        description: "bar",
      });
      expect(records[1]).toEqual({
        id: "2",
        name: "baz",
        description: "qux",
      });
    });

    test("parse with headerRow false", () => {
      const csv = new CSV({
        headerRow: false,
        columns: ["id", "name", "description"],
      });
      const data = "1,foo,bar\n2,baz,qux";
      const records = csv.parse(data);
      expect(records).toHaveLength(2);
      expect(records[0]).toEqual({
        id: "1",
        name: "foo",
        description: "bar",
      });
    });

    test("parse quoted fields", () => {
      const csv = new CSV();
      const data = 'id,name\n1,"foo, bar"\n2,"baz"""';
      const records = csv.parse(data);
      expect(records[0].name).toBe("foo, bar");
      expect(records[1].name).toBe('baz"');
    });

    test("parse escaped comma", () => {
      const csv = new CSV();
      const data = "id,name\n1,foo\\, bar\n2,baz";
      const records = csv.parse(data);
      expect(records[0].name).toBe("foo, bar");
    });

    test("parse tsv", () => {
      const csv = new CSV({ columnSeparator: "\t" });
      const data = "id\tname\tdesc\n1\tfoo\tbar\n2\tbaz\tqux";
      const records = csv.parse(data);
      expect(records).toHaveLength(2);
      expect(records[0]).toEqual({ id: "1", name: "foo", desc: "bar" });
    });

    test("parse empty returns empty array", () => {
      const csv = new CSV();
      expect(csv.parse("")).toEqual([]);
      expect(csv.parse(null as unknown as string)).toEqual([]);
    });
  });

  describe("generate", () => {
    test("generate simple records", () => {
      const csv = new CSV();
      const records = [
        { id: "1", name: "foo", description: "bar" },
        { id: "2", name: "baz", description: "qux" },
      ];
      const out = csv.generate(records);
      expect(out).toContain("id,name,description");
      expect(out).toContain("1,foo,bar");
      expect(out).toContain("2,baz,qux");
    });

    test("generate escapes fields with comma", () => {
      const csv = new CSV();
      const records = [{ name: "foo, bar" }];
      expect(csv.generate(records)).toContain('"foo, bar"');
    });

    test("generate escapes fields with quote", () => {
      const csv = new CSV();
      const records = [{ name: 'foo"bar' }];
      expect(csv.generate(records)).toContain('"foo""bar"');
    });

    test("generate with custom options", () => {
      const csv = new CSV({
        outputRowSeparator: "\r\n",
        columns: ["a", "b"],
      });
      const records = [{ a: "1", b: "2" }];
      expect(csv.generate(records)).toContain("\r\n");
      expect(csv.generate(records)).toContain("a,b");
    });
  });

  describe("getPathName", () => {
    test("returns pathName when set", () => {
      const csv = new CSV({ pathName: "./data.csv" });
      expect(csv.getPathName()).toBe("./data.csv");
    });

    test("returns undefined when not set", () => {
      const csv = new CSV();
      expect(csv.getPathName()).toBeUndefined();
    });
  });

  describe("round-trip", () => {
    test("parse then generate preserves data", () => {
      const csv = new CSV();
      const data = "id,name,description\n1,foo,bar\n2,baz,qux";
      const records = csv.parse(data);
      const out = csv.generate(records);
      const records2 = csv.parse(out);
      expect(records2).toEqual(records);
    });
  });
});
