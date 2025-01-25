/*
 * DirectoryWalk.test.js - test the directory walk functionality
 *
 * Copyright © 2025, JEDLSoft
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

import { walk } from "../src/index.js";

describe("test walk", () => {
    test("test on a regular dir with no includes or excludes or subdirectories", () => {
        expect.assertions(1);

        const files = walk("./test/testfiles/walk");
        expect(files).toEqual([
            {
                type: "file",
                path: "test1.txt"
            },
            {
                type: "file",
                path: "test2.js"
            },
            {
                type: "file",
                path: "test3.php"
            }
        ]);
    });

    test("test on a file instead of a directory", () => {
        expect.assertions(1);

        const files = walk("./test/testfiles/walk/test1.txt");
        expect(files).toEqual([
            {
                type: "file",
                path: "./test/testfiles/walk/test1.txt"
            }
        ]);
    });

    test("test on a non-existent directory", () => {
        expect.assertions(1);

        const files = walk("./test/testfiles/walk2323");
        expect(files).toEqual([]);
    });

    test("test on a non-string param", () => {
        expect.assertions(1);

        const files = walk({"a": "test"});
        expect(files).toEqual([]);
    });

    test("test on a regular dir with includes only", () => {
        expect.assertions(1);

        const files = walk("./test/testfiles/walk", ["*.js"]);
        expect(files).toEqual([
            {
                type: "file",
                path: "test2.js"
            }
        ]);
    });

    test("test on a regular dir with multiple includes only", () => {
        expect.assertions(1);

        const files = walk("./test/testfiles/walk", ["*.php", "*.js"]);
        expect(files).toEqual([
            {
                type: "file",
                path: "test2.js"
            },
            {
                type: "file",
                path: "test3.php"
            }
        ]);
    });

    test("test on a regular dir with excludes only and null includes", () => {
        expect.assertions(1);

        const files = walk("./test/testfiles/walk", null, ["*.js"]);
        expect(files).toEqual([
            {
                type: "file",
                path: "test1.txt"
            },
            {
                type: "file",
                path: "test3.php"
            }
        ]);
    });

    test("test on a regular dir with excludes only and undefined includes", () => {
        expect.assertions(1);

        const files = walk("./test/testfiles/walk", undefined, ["*.js"]);
        expect(files).toEqual([
            {
                type: "file",
                path: "test1.txt"
            },
            {
                type: "file",
                path: "test3.php"
            }
        ]);
    });

    test("test on a regular dir with excludes only and non-array includes", () => {
        expect.assertions(1);

        const files = walk("./test/testfiles/walk", {}, ["*.js"]);
        expect(files).toEqual([
            {
                type: "file",
                path: "test1.txt"
            },
            {
                type: "file",
                path: "test3.php"
            }
        ]);
    });

    test("test on a regular dir with excludes only and empty includes", () => {
        expect.assertions(1);

        const files = walk("./test/testfiles/walk", [], ["*.js"]);
        expect(files).toEqual([
            {
                type: "file",
                path: "test1.txt"
            },
            {
                type: "file",
                path: "test3.php"
            }
        ]);
    });

    test("test on a regular dir with multiple excludes", () => {
        expect.assertions(1);

        const files = walk("./test/testfiles/walk", undefined, ["*.js", "*.php"]);
        expect(files).toEqual([
            {
                type: "file",
                path: "test1.txt"
            }
        ]);
    });

    test("test on a regular dir with includes and excludes", () => {
        expect.assertions(1);

        const files = walk("./test/testfiles/walk", ["test*"], ["*.php"]);
        expect(files).toEqual([
            {
                type: "file",
                path: "test1.txt"
            },
            {
                type: "file",
                path: "test2.js"
            },
            {
                type: "file",
                path: "test3.php"
            }
        ]);
    });

    test("test on a regular dir with includes and excludes where the include overrides the exclude", () => {
        expect.assertions(1);

        const files = walk("./test/testfiles/walk", ["test3.php"], ["test*"]);
        expect(files).toEqual([
            {
                type: "file",
                path: "test3.php"
            }
        ]);
    });

    test("test on a regular dir with subdirectories, but no includes or excludes", () => {
        expect.assertions(1);

        const files = walk("./test/testfiles/walk2");
        expect(files).toEqual([
            {
                type: "file",
                path: "README.md"
            },
            {
                type: "file",
                path: "a.js"
            },
            {
                type: "file",
                path: "b.js"
            },
            {
                type: "directory",
                path: "sub1",
                children: [
                    {
                        type: "file",
                        path: "sub1/c.js"
                    },
                    {
                        type: "directory",
                        path: "sub1/subsub1",
                        children: [
                            {
                                type: "file",
                                path: "sub1/subsub1/d.js"
                            }
                        ]
                    }
                ]
            },
            {
                type: "directory",
                path: "sub2",
                children: [
                    {
                        type: "file",
                        path: "sub2/e.js"
                    }
                ]
            }
        ]);
    });

    test("test on a regular dir with subdirectories, includes only", () => {
        expect.assertions(1);

        const files = walk("./test/testfiles/walk2", ["**/*.js"]);
        // should not pick up the README.md file
        expect(files).toEqual([
            {
                type: "file",
                path: "a.js"
            },
            {
                type: "file",
                path: "b.js"
            },
            {
                type: "directory",
                path: "sub1",
                children: [
                    {
                        type: "file",
                        path: "sub1/c.js"
                    },
                    {
                        type: "directory",
                        path: "sub1/subsub1",
                        children: [
                            {
                                type: "file",
                                path: "sub1/subsub1/d.js"
                            }
                        ]
                    }
                ]
            },
            {
                type: "directory",
                path: "sub2",
                children: [
                    {
                        type: "file",
                        path: "sub2/e.js"
                    }
                ]
            }
        ]);
    });

    test("test on a regular dir with subdirectories, multiple includes only", () => {
        expect.assertions(1);

        const files = walk("./test/testfiles/walk2", ["sub1/**/*.js", "sub2/**/*.js"]);
        // should not pick up the README.md file
        expect(files).toEqual([
            {
                type: "directory",
                path: "sub1",
                children: [
                    {
                        type: "file",
                        path: "sub1/c.js"
                    },
                    {
                        type: "directory",
                        path: "sub1/subsub1",
                        children: [
                            {
                                type: "file",
                                path: "sub1/subsub1/d.js"
                            }
                        ]
                    }
                ]
            },
            {
                type: "directory",
                path: "sub2",
                children: [
                    {
                        type: "file",
                        path: "sub2/e.js"
                    }
                ]
            }
        ]);
    });

    test("test on a regular dir with subdirectories, excludes only", () => {
        expect.assertions(1);
        const files = walk("./test/testfiles/walk2", [], ["**/*.js"]);
        expect(files).toEqual([
            {
                type: "file",
                path: "README.md"
            }
        ]);
    });

    test("test on a regular dir with subdirectories, includes and excludes, where the includes override the excludes", () => {
        expect.assertions(1);

        const files = walk("./test/testfiles/walk2", ["sub1/c.js"], ["sub1/*"]);
        expect(files).toEqual([
            {
                type: "file",
                path: "README.md"
            },
            {
                type: "file",
                path: "a.js"
            },
            {
                type: "file",
                path: "b.js"
            },
            {
                type: "directory",
                path: "sub1",
                children: [
                    {
                        type: "file",
                        path: "sub1/c.js"
                    }
                ]
            },
            {
                type: "directory",
                path: "sub2",
                children: [
                    {
                        type: "file",
                        path: "sub2/e.js"
                    }
                ]
            }
        ]);
    });
});
