/*
 * treenode.test.js - test the TreeNode object
 *
 * Copyright © 2019, 2021, 2024 JEDLSoft
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

import Node from "../src/TreeNode.js";

describe("testTreeNode", () => {
    test("NodeConstructor", () => {
        expect.assertions(2);

        // default type
        let node = new Node();
        expect(node).toBeTruthy();
        expect(node.children.length).toBe(0);
    });

    test("NodeConstructorDefaultType", () => {
        expect.assertions(4);

        // default type
        let node = new Node();
        expect(node).toBeTruthy();
        expect(node.type).toBe("text");
        expect(!node.value).toBeTruthy();
        expect(node.children.length).toBe(0);
    });

    test("NodeConstructorCopyAllProperties", () => {
        expect.assertions(6);

        let node = new Node({
            type: "text",
            value: "foo",
            index: 5,
            isRoot: false
        });
        expect(node).toBeTruthy();
        expect(node.children.length).toBe(0);
        expect(node.type).toBe("text");
        expect(node.value).toBe("foo");
        expect(node.index).toBe(5);
        expect(node.isRoot).toBe(false);
    });

    test("NodeConstructorDontCopyUndefinedProperties", () => {
        expect.assertions(5);

        let node = new Node({
            type: "text",
            value: "foo",
            index: undefined
        });
        expect(node).toBeTruthy();
        expect(node.children.length).toBe(0);
        expect(node.type).toBe("text");
        expect(node.value).toBe("foo");
        expect(typeof(node.index)).toBe('undefined');
    });

    test("NodeConstructorDontCopyNullProperties", () => {
        expect.assertions(5);

        let node = new Node({
            type: "text",
            value: "foo",
            isRoot: null
        });
        expect(node).toBeTruthy();
        expect(node.children.length).toBe(0);
        expect(node.type).toBe("text");
        expect(node.value).toBe("foo");
        expect(node.isRoot).toBe(null);
    });

    test("NodeConstructorRejectChildren", () => {
        expect.assertions(3);

        let node = new Node({
            type: "text",
            children: [new Node({type: "a"})]
        });

        expect(node).toBeTruthy();
        expect(node.children.length).toBe(0);
        expect(node.type).toBe("text");
    });

    test("NodeAddHasChildren", () => {
        expect.assertions(3);

        let node = new Node({
            type: "text",
            value: "foo"
        });
        expect(node).toBeTruthy();

        let parent = new Node({
            type: "parent"
        });
        expect(parent.children.length).toBe(0);

        parent.add(node);

        expect(parent.children).toBeTruthy();
    });

    test("NodeAddRightNumberOfChildren", () => {
        expect.assertions(2);

        let parent = new Node({
            type: "parent"
        });
        expect(parent.children.length).toBe(0);

        parent.add(new Node({
            type: "text",
            value: "foo"
        }));

        expect(parent.children.length).toBe(1);
    });

    test("NodeAddRightNumberOfChildrenMultiple", () => {
        expect.assertions(3);

        let parent = new Node({
            type: "parent"
        });
        expect(parent.children.length).toBe(0);

        parent.add(new Node({
            type: "text",
            value: "foo"
        }));

        expect(parent.children.length).toBe(1);

        parent.add(new Node({
            type: "text",
            value: "bar"
        }));

        expect(parent.children.length).toBe(2);
    });

    test("NodeAddRightChildren", () => {
        expect.assertions(6);

        let parent = new Node({
            type: "parent"
        });
        expect(parent.children.length).toBe(0);

        parent.add(new Node({
            type: "text",
            value: "foo"
        }));

        parent.add(new Node({
            type: "text",
            value: "bar"
        }));

        expect(parent.children.length).toBe(2);

        expect(parent.children[0].type).toBe("text");
        expect(parent.children[0].value).toBe("foo");

        expect(parent.children[1].type).toBe("text");
        expect(parent.children[1].value).toBe("bar");
    });

    test("NodeAddRightNumberOfChildrenArray", () => {
        expect.assertions(2);

        let parent = new Node({
            type: "parent"
        });
        expect(parent.children.length).toBe(0);

        parent.addChildren([
            new Node({
                type: "text",
                value: "foo"
            }),
            new Node({
                type: "text",
                value: "bar"
            })
        ]);

        expect(parent.children.length).toBe(2);
    });

    test("NodeAddArrayRightChildren", () => {
        expect.assertions(6);

        let parent = new Node({
            type: "parent"
        });
        expect(parent.children.length).toBe(0);

        parent.addChildren([
            new Node({
                type: "text",
                value: "foo"
            }),
            new Node({
                type: "text",
                value: "bar"
            })
        ]);

        expect(parent.children.length).toBe(2);

        expect(parent.children[0].type).toBe("text");
        expect(parent.children[0].value).toBe("foo");

        expect(parent.children[1].type).toBe("text");
        expect(parent.children[1].value).toBe("bar");
    });

    test("NodeAddArraysMultiple", () => {
        expect.assertions(12);

        let parent = new Node({
            type: "parent"
        });
        expect(parent.children.length).toBe(0);

        parent.addChildren([
            new Node({
                type: "text",
                value: "foo"
            }),
            new Node({
                type: "text",
                value: "bar"
            })
        ]);

        parent.addChildren([
            new Node({
                type: "text",
                value: "asdf"
            }),
            new Node({
                type: "text",
                value: "rach"
            }),
            new Node({
                type: "text",
                value: "blort"
            })
        ]);

        expect(parent.children.length).toBe(5);

        expect(parent.children[0].type).toBe("text");
        expect(parent.children[0].value).toBe("foo");

        expect(parent.children[1].type).toBe("text");
        expect(parent.children[1].value).toBe("bar");

        expect(parent.children[2].type).toBe("text");
        expect(parent.children[2].value).toBe("asdf");

        expect(parent.children[3].type).toBe("text");
        expect(parent.children[3].value).toBe("rach");

        expect(parent.children[4].type).toBe("text");
        expect(parent.children[4].value).toBe("blort");
    });

    test("NodeAddRejectNonNode", () => {
        expect.assertions(3);

        let parent = new Node({
            type: "parent"
        });
        expect(parent.children.length).toBe(0);

        parent.add(new Node({
            type: "text",
            value: "foo"
        }));

        expect(parent.children.length).toBe(1);

        // not a Node instance
        parent.add({
            type: "text",
            value: "foo"
        });

        expect(parent.children.length).toBe(1);
    });

    test("NodeAddArrayNonArray", () => {
        expect.assertions(2);

        let parent = new Node({
            type: "parent"
        });
        expect(parent.children.length).toBe(0);

        // should not add nodes that are not in an array
        parent.addChildren(new Node({
            type: "text",
            value: "foo"
        }));

        expect(parent.children.length).toBe(0);
    });

    test("NodeAddArrayRejectNonNodes", () => {
        expect.assertions(2);

        let parent = new Node({
            type: "parent"
        });
        expect(parent.children.length).toBe(0);

        parent.addChildren([
            new Node({
                type: "text",
                value: "foo"
            }),
            {
                type: "text",
                value: "bar"
            }
        ]);

        expect(parent.children.length).toBe(0);
    });

    test("NodeAddUndefined", () => {
        expect.assertions(3);

        let parent = new Node({
            type: "parent"
        });
        expect(parent.children.length).toBe(0);

        parent.add(new Node({
            type: "text",
            value: "foo"
        }));

        expect(parent.children.length).toBe(1);

        // not a Node instance
        parent.add();

        expect(parent.children.length).toBe(1);
    });

    test("NodeAddNull", () => {
        expect.assertions(3);

        let parent = new Node({
            type: "parent"
        });
        expect(parent.children.length).toBe(0);

        parent.add(new Node({
            type: "text",
            value: "foo"
        }));

        expect(parent.children.length).toBe(1);

        // not a Node instance
        parent.add(null);

        expect(parent.children.length).toBe(1);
    });

    test("NodeAddIntrinsic", () => {
        expect.assertions(3);

        let parent = new Node({
            type: "parent"
        });
        expect(parent.children.length).toBe(0);

        parent.add(new Node({
            type: "text",
            value: "foo"
        }));

        expect(parent.children.length).toBe(1);

        // not a Node instance
        parent.add(5);
        parent.add("foo");
        parent.add(true);

        expect(parent.children.length).toBe(1);
    });

    test("NodeAddChildrenEmpty", () => {
        expect.assertions(3);

        let parent = new Node({
            type: "parent"
        });
        expect(parent.children.length).toBe(0);

        parent.add(new Node({
            type: "text",
            value: "foo"
        }));

        expect(parent.children.length).toBe(1);

        // not an array of Node instances
        parent.addChildren([]);

        expect(parent.children.length).toBe(1);
    });

    test("NodeAddChildrenUndefined", () => {
        expect.assertions(3);

        let parent = new Node({
            type: "parent"
        });
        expect(parent.children.length).toBe(0);

        parent.add(new Node({
            type: "text",
            value: "foo"
        }));

        expect(parent.children.length).toBe(1);

        // not an array of Node instances
        parent.addChildren([undefined, undefined]);

        expect(parent.children.length).toBe(1);
    });

    test("NodeAddChildrenNull", () => {
        expect.assertions(3);

        let parent = new Node({
            type: "parent"
        });
        expect(parent.children.length).toBe(0);

        parent.add(new Node({
            type: "text",
            value: "foo"
        }));

        expect(parent.children.length).toBe(1);

        // not an array of Node instances
        parent.addChildren([null, null]);

        expect(parent.children.length).toBe(1);
    });

    test("NodeAddIntrinsic", () => {
        expect.assertions(3);

        let parent = new Node({
            type: "parent"
        });
        expect(parent.children.length).toBe(0);

        parent.add(new Node({
            type: "text",
            value: "foo"
        }));

        expect(parent.children.length).toBe(1);

        // not an array of Node instances
        parent.addChildren([5]);
        parent.addChildren(["foo"]);
        parent.addChildren([true]);

        expect(parent.children.length).toBe(1);
    });

    test("NodeToArraySimpleRightLength", () => {
        expect.assertions(4);

        let parent = new Node({
            type: "parent"
        });
        expect(parent.children.length).toBe(0);

        parent.add(new Node({
            type: "text",
            value: "foo"
        }));

        parent.add(new Node({
            type: "text",
            value: "bar"
        }));

        expect(parent.children.length).toBe(2);

        let array = parent.toArray();

        expect(array).toBeTruthy();
        expect(array.length).toBe(4);
    });

    test("NodeToArraySimpleRightContents", () => {
        expect.assertions(11);

        let parent = new Node({
            type: "parent"
        });
        expect(parent.children.length).toBe(0);

        parent.add(new Node({
            type: "text",
            value: "foo"
        }));

        parent.add(new Node({
            type: "text",
            value: "bar"
        }));

        expect(parent.children.length).toBe(2);

        let array = parent.toArray();

        expect(array).toBeTruthy();

        expect(array[0].type).toBe("parent");
        expect(array[0].use).toBe("start");

        expect(array[1].type).toBe("text");
        expect(array[1].value).toBe("foo");

        expect(array[2].type).toBe("text");
        expect(array[2].value).toBe("bar");

        expect(array[3].type).toBe("parent");
        expect(array[3].use).toBe("end");
    });

    test("NodeToArrayEmptyComponents", () => {
        expect.assertions(10);

        let parent = new Node({
            type: "parent"
        });
        expect(parent.children.length).toBe(0);

        parent.add(new Node({
            type: "component",
            extra: {name: "A"}
        }));

        expect(parent.children.length).toBe(1);

        let array = parent.toArray();

        expect(array).toBeTruthy();

        expect(array[0].type).toBe("parent");
        expect(array[0].use).toBe("start");

        expect(array[1].type).toBe("component");
        expect(array[1].extra).toStrictEqual({name: "A"});
        expect(array[1].use).toBe("startend");

        expect(array[2].type).toBe("parent");
        expect(array[2].use).toBe("end");
    });

    test("NodeToArrayDegenerate", () => {
        expect.assertions(5);

        let parent = new Node({
            type: "parent"
        });
        expect(parent.children.length).toBe(0);

        let array = parent.toArray();

        expect(array).toBeTruthy();
        expect(array.length).toBe(1);

        expect(array[0].type).toBe("parent");
        expect(array[0].use).toBe("startend");
    });

    test("NodeToArrayMultiLevelRightLength", () => {
        expect.assertions(4);

        let parent = new Node({
            type: "parent"
        });
        expect(parent.children.length).toBe(0);

        let child = new Node({
            type: "text",
            value: "foo"
        });

        child.add(new Node({
            type: "text",
            value: "asdf"
        }));

        parent.add(child);

        child = new Node({
            type: "text",
            value: "bar"
        });

        child.add(new Node({
            type: "text",
            value: "blah"
        }));

        parent.add(child);

        expect(parent.children.length).toBe(2);

        let array = parent.toArray();

        expect(array).toBeTruthy();

        expect(array.length).toBe(8);
    });

    test("NodeToArrayMultiLevelRightContents", () => {
        expect.assertions(24);

        let parent = new Node({
            type: "parent"
        });

        let child = new Node({
            type: "text",
            value: "foo"
        });

        child.add(new Node({
            type: "text",
            value: "asdf"
        }));

        parent.add(child);

        child = new Node({
            type: "text",
            value: "bar"
        });

        child.add(new Node({
            type: "text",
            value: "blah"
        }));

        parent.add(child);

        expect(parent.children.length).toBe(2);

        let array = parent.toArray();

        expect(array).toBeTruthy();

        expect(array[0].type).toBe("parent");
        expect(array[0].use).toBe("start");

        expect(array[1].type).toBe("text");
        expect(array[1].value).toBe("foo");
        expect(array[1].use).toBe("start");

        expect(array[2].type).toBe("text");
        expect(array[2].value).toBe("asdf");
        expect(!array[2].use).toBeTruthy();

        expect(array[3].type).toBe("text");
        expect(array[3].value).toBe("foo");
        expect(array[3].use).toBe("end");

        expect(array[4].type).toBe("text");
        expect(array[4].value).toBe("bar");
        expect(array[4].use).toBe("start");

        expect(array[5].type).toBe("text");
        expect(array[5].value).toBe("blah");
        expect(!array[5].use).toBeTruthy();

        expect(array[6].type).toBe("text");
        expect(array[6].value).toBe("bar");
        expect(array[6].use).toBe("end");

        expect(array[7].type).toBe("parent");
        expect(array[7].use).toBe("end");
    });

    test("NodeFromArrayRightNumberOfChildren", () => {
        expect.assertions(3);

        let array = [];
        array.push(new Node({
            type: "parent",
            use: "start"
        }));
        array.push(new Node({
            type: "text",
            value: "foo"
        }));
        array.push(new Node({
            type: "text",
            value: "bar"
        }));
        array.push(new Node({
            type: "parent",
            use: "end"
        }));

        let node = Node.fromArray(array);

        expect(node).toBeTruthy();
        expect(node.children).toBeTruthy();
        expect(node.children.length).toBe(2);
    });

    test("NodeFromArrayRightChildren", () => {
        expect.assertions(6);

        let array = [];
        array.push(new Node({
            type: "parent",
            use: "start"
        }));
        array.push(new Node({
            type: "text",
            value: "foo"
        }));
        array.push(new Node({
            type: "text",
            value: "bar"
        }));
        array.push(new Node({
            type: "parent",
            use: "end"
        }));

        let node = Node.fromArray(array);

        expect(node).toBeTruthy();
        expect(node.children).toBeTruthy();

        expect(node.children[0].type).toBe("text");
        expect(node.children[0].value).toBe("foo");

        expect(node.children[1].type).toBe("text");
        expect(node.children[1].value).toBe("bar");
    });

    test("NodeFromArrayMultiLevelRightContents", () => {
        expect.assertions(24);

        let array = [];
        array.push(new Node({
            type: "parent",
            use: "start"
        }));
        array.push(new Node({
            type: "text",
            value: "foo",
            use: "start"
        }));
        array.push(new Node({
            type: "text",
            value: "asdf"
        }));
        array.push(new Node({
            type: "text",
            value: "foo",
            use: "end"
        }));
        array.push(new Node({
            type: "text",
            value: "bar",
            use: "start"
        }));
        array.push(new Node({
            type: "text",
            value: "blah"
        }));
        array.push(new Node({
            type: "text",
            value: "bar",
            use: "end"
        }));
        array.push(new Node({
            type: "parent",
            use: "end"
        }));

        expect(array.length).toBe(8);

        var node = Node.fromArray(array);

        expect(node).toBeTruthy();
        expect(node.children).toBeTruthy();
        expect(node.children.length).toBe(2);
        expect(node.type).toBe("parent");
        expect(!node.use).toBeTruthy();

        let child = node.children[0];

        expect(child.type).toBe("text");
        expect(child.value).toBe("foo");
        expect(child.children).toBeTruthy();
        expect(child.children.length).toBe(1);
        expect(!child.use).toBeTruthy();

        let grandchild = child.children[0];

        expect(grandchild.type).toBe("text");
        expect(grandchild.value).toBe("asdf");
        expect(grandchild.children.length).toBe(0);
        expect(!grandchild.use).toBeTruthy();

        child = node.children[1];

        expect(child.type).toBe("text");
        expect(child.value).toBe("bar");
        expect(child.children).toBeTruthy();
        expect(child.children.length).toBe(1);
        expect(!child.use).toBeTruthy();

        grandchild = child.children[0];

        expect(grandchild.type).toBe("text");
        expect(grandchild.value).toBe("blah");
        expect(grandchild.children.length).toBe(0);
        expect(!grandchild.use).toBeTruthy();
    });

    test("NodeFromArraySelfClosing", () => {
        expect.assertions(6);

        let array = [];
        array.push(new Node({
            type: "parent",
            use: "start"
        }));
        array.push(new Node({
            type: "component",
            extra: {name: "A"},
            use: "startend"
        }));
        array.push(new Node({
            type: "parent",
            use: "end"
        }));

        let node = Node.fromArray(array);

        expect(node).toBeTruthy();
        expect(node.children).toBeTruthy();
        expect(node.children.length).toBe(1);

        expect(node.children[0]).toBeTruthy();
        expect(node.children[0].children).toBeTruthy();
        expect(node.children[0].children.length).toBe(0);
    });

    test("NodeFromArrayDegenerate", () => {
        expect.assertions(4);

        let array = [new Node({
            type: "parent"
        })];

        expect(array.length).toBe(1);

        var node = Node.fromArray(array);

        expect(node).toBeTruthy();
        expect(node.children.length).toBe(0);
        expect(node.type).toBe("parent");
    });

    test("NodeFromArrayRejectUndefined", () => {
        expect.assertions(1);

        var node = Node.fromArray();

        expect(!node).toBeTruthy();
    });

    test("NodeFromArrayRejectNullArray", () => {
        expect.assertions(1);

        var node = Node.fromArray(null);

        expect(!node).toBeTruthy();
    });

    test("NodeFromArrayRejectNullValue", () => {
        expect.assertions(2);

        let array = [null];

        expect(array.length).toBe(1);

        var node = Node.fromArray(array);

        expect(!node).toBeTruthy();
    });

    test("NodeFromArrayRejectIntrinsicArray", () => {
        expect.assertions(1);

        var node = Node.fromArray(5);

        expect(!node).toBeTruthy();
    });

    test("NodeFromArrayRejectIntrinsicValues", () => {
        expect.assertions(2);

        let array = [5, "array", true];

        expect(array.length).toBe(3);

        var node = Node.fromArray(array);

        expect(!node).toBeTruthy();
    });

    test("NodeFromArrayRejectEmpty", () => {
        expect.assertions(2);

        let array = [];

        expect(array.length).toBe(0);

        var node = Node.fromArray(array);

        expect(!node).toBeTruthy();
    });

    test("NodeFromArrayRejectNonNodes", () => {
        expect.assertions(2);

        let array = [{
            type: "foo",
            value: "bar"
        }];

        expect(array.length).toBe(1);

        var node = Node.fromArray(array);

        expect(!node).toBeTruthy();
    });

    test("NodeFromArrayNonTree", () => {
        expect.assertions(14);

        let array = [];
        array.push(new Node({
            type: "text",
            value: "foobar"
        }));
        array.push(new Node({
            type: "component",
            use: "start",
            extra: {
                name: "X"
            }
        }));
        array.push(new Node({
            type: "component",
            extra: {name: "A"},
            use: "startend"
        }));
        array.push(new Node({
            type: "component",
            use: "end"
        }));
        array.push(new Node({
            type: "text",
            value: "asdf asdf"
        }));

        let node = Node.fromArray(array);

        // should get an automatic root node and the
        // nodes above should be its children
        expect(node).toBeTruthy();

        expect(node.type).toBe("root");
        expect(node.children).toBeTruthy();
        expect(node.children.length).toBe(3);

        expect(node.children[0]).toBeTruthy();
        expect(node.children[0].type).toBe("text");
        expect(node.children[0].value).toBe("foobar");

        expect(node.children[1]).toBeTruthy();
        expect(node.children[1].type).toBe("component");
        expect(node.children[1].extra).toStrictEqual({name: "X"});
        expect(node.children[1].children.length).toBe(1);

        expect(node.children[2]).toBeTruthy();
        expect(node.children[2].type).toBe("text");
        expect(node.children[2].value).toBe("asdf asdf");
    });

    test("NodeFromArrayNotWellFormed", () => {
        expect.assertions(12);

        let array = [];
        array.push(new Node({
            type: "text",
            value: "asdf",
        }));
        array.push(new Node({
            type: "parent",
            use: "start"
        }));
        array.push(new Node({
            type: "text",
            value: "bar",
        }));
        array.push(new Node({
            type: "parent",
            use: "end"
        }));
        // this one is an end without a start:
        array.push(new Node({
            type: "parent",
            use: "end"
        }));
        // this one should not cause an exception
        array.push(new Node({
            type: "text",
            value: "foo",
        }));

        let node = Node.fromArray(array);

        expect(node).toBeTruthy();

        expect(node.type).toBe("root");
        expect(node.children).toBeTruthy();
        expect(node.children.length).toBe(3);

        expect(node.children[0]).toBeTruthy();
        expect(node.children[0].type).toBe("text");
        expect(node.children[0].value).toBe("asdf");

        expect(node.children[1]).toBeTruthy();
        expect(node.children[1].type).toBe("parent");

        expect(node.children[2]).toBeTruthy();
        expect(node.children[2].type).toBe("text");
        expect(node.children[2].value).toBe("foo");
    });
});