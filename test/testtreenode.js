/*
 * testtreenode.js - test the TreeNode object
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

import Node from "../TreeNode.js";

module.exports.testTreeNode = {
    testNodeConstructor: function(test) {
        test.expect(2);

        // default type
        let node = new Node();
        test.ok(node);
        test.ok(!node.children);

        test.done();
    },

    testNodeConstructorDefaultType: function(test) {
        test.expect(4);

        // default type
        let node = new Node();
        test.ok(node);
        test.equal(node.type, "text");
        test.ok(!node.value);
        test.ok(!node.children);

        test.done();
    },

    testNodeConstructorCopyAllProperties: function(test) {
        test.expect(4);

        let node = new Node({
            type: "text",
            value: "foo",
            index: 5,
            isRoot: false
        });
        test.ok(node);
        test.ok(!node.children);
        test.equal(node.type, "text");
        test.equal(node.value, "foo");
        test.equal(node.index, 5);
        test.equal(node.isRoot, false);

        test.done();
    },

    testNodeConstructorRejectChildren: function(test) {
        test.expect(3);

        let node = new Node({
            type: "text",
            children: [new Node({type: "a"})]
        });
        
        test.ok(node);
        test.ok(!node.children);
        test.equal(node.type, "text");

        test.done();
    },

    testNodeAddHasChildren: function(test) {
        test.expect(4);

        let node = new Node({
            type: "text",
            value: "foo"
        });
        test.ok(node);
        
        let parent = new Node({
            type: "parent"
        });
        test.ok(!parent.children);
        
        parent.add(node);
        
        test.ok(parent.children);

        test.done();
    },

    testNodeAddRightNumberOfChildren: function(test) {
        test.expect(3);

        let parent = new Node({
            type: "parent"
        });
        test.ok(!parent.children);
        
        parent.add(new Node({
            type: "text",
            value: "foo"
        }));
        
        test.equal(parent.children.length, 1);

        test.done();
    },

    testNodeAddRightNumberOfChildrenMultiple: function(test) {
        test.expect(4);

        let parent = new Node({
            type: "parent"
        });
        test.ok(!parent.children);
        
        parent.add(new Node({
            type: "text",
            value: "foo"
        }));
        
        test.equal(parent.children.length, 1);

        parent.add(new Node({
            type: "text",
            value: "bar"
        }));
        
        test.equal(parent.children.length, 2);

        test.done();
    },

    testNodeAddRightChildren: function(test) {
        test.expect(4);

        let parent = new Node({
            type: "parent"
        });
        test.ok(!parent.children);
        
        parent.add(new Node({
            type: "text",
            value: "foo"
        }));
        
        parent.add(new Node({
            type: "text",
            value: "bar"
        }));
        
        test.equal(parent.children.length, 2);

        test.equal(parent.children[0].type, "text");
        test.equal(parent.children[0].value, "foo");
        
        test.equal(parent.children[1].type, "text");
        test.equal(parent.children[1].value, "bar");

        test.done();
    },

    testNodeAddRejectNonNode: function(test) {
        test.expect(3);

        let parent = new Node({
            type: "parent"
        });
        test.ok(!parent.children);
        
        parent.add(new Node({
            type: "text",
            value: "foo"
        }));
        
        test.equal(parent.children.length, 1);

        // not a Node instance
        parent.add({
            type: "text",
            value: "foo"
        });
        
        test.equal(parent.children.length, 1);

        test.done();
    },

    testNodeAddUndefined: function(test) {
        test.expect(3);

        let parent = new Node({
            type: "parent"
        });
        test.ok(!parent.children);
        
        parent.add(new Node({
            type: "text",
            value: "foo"
        }));
        
        test.equal(parent.children.length, 1);

        // not a Node instance
        parent.add();
        
        test.equal(parent.children.length, 1);

        test.done();
    },

    testNodeToArraySimpleRightLength: function(test) {
        test.expect(4);

        let parent = new Node({
            type: "parent"
        });
        test.ok(!parent.children);
        
        parent.add(new Node({
            type: "text",
            value: "foo"
        }));
        
        parent.add(new Node({
            type: "text",
            value: "bar"
        }));
        
        test.equal(parent.children.length, 2);

        let array = parent.toArray();
        
        test.ok(array);
        test.equal(array.length, 4);

        test.done();
    },

    testNodeToArraySimpleRightContents: function(test) {
        test.expect(11);

        let parent = new Node({
            type: "parent"
        });
        test.ok(!parent.children);
        
        parent.add(new Node({
            type: "text",
            value: "foo"
        }));
        
        parent.add(new Node({
            type: "text",
            value: "bar"
        }));
        
        test.equal(parent.children.length, 2);

        let array = parent.toArray();
        
        test.ok(array);
        
        test.equal(array[0].type, "parent");
        test.equal(array[0].use, "start");
        
        test.equal(array[1].type, "text");
        test.equal(array[1].value, "foo");

        test.equal(array[2].type, "text");
        test.equal(array[2].value, "bar");

        test.equal(array[3].type, "parent");
        test.equal(array[3].use, "end");

        test.done();
    },

    testNodeToArrayDegenerate: function(test) {
        test.expect(5);

        let parent = new Node({
            type: "parent"
        });
        test.ok(!parent.children);
        
        let array = parent.toArray();
        
        test.ok(array);
        test.equal(array.length, 1);
        
        test.equal(array[0].type, "parent");
        test.equal(array[0].use, "start");

        test.done();
    },

    testNodeToArrayMultiLevelRightLength: function(test) {
        test.expect(4);

        let parent = new Node({
            type: "parent"
        });
        test.ok(!parent.children);
        
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
        
        test.equal(parent.children.length, 2);

        let array = parent.toArray();
        
        test.ok(array);
        
        test.equal(array.length, 8);

        test.done();
    },

    testNodeToArrayMultiLevelRightContents: function(test) {
        test.expect(24);

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
        
        test.equal(parent.children.length, 2);

        let array = parent.toArray();
        
        test.ok(array);
        
        test.equal(array[0].type, "parent");
        test.equal(array[0].use, "start");
        
        test.equal(array[1].type, "text");
        test.equal(array[1].value, "foo");
        test.equal(array[1].use, "start");

        test.equal(array[2].type, "text");
        test.equal(array[2].value, "asdf");
        test.ok(!array[2].use);

        test.equal(array[3].type, "text");
        test.equal(array[3].value, "foo");
        test.equal(array[3].use, "end");

        test.equal(array[4].type, "text");
        test.equal(array[4].value, "bar");
        test.equal(array[4].use, "start");

        test.equal(array[5].type, "text");
        test.equal(array[5].value, "blah");
        test.ok(!array[5].use);

        test.equal(array[6].type, "text");
        test.equal(array[6].value, "bar");
        test.equal(array[6].use, "end");

        test.equal(array[7].type, "parent");
        test.equal(array[7].use, "end");

        test.done();
    },

};