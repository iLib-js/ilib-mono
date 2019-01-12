/**
 * TreeNode.js - build, construct, and deconstruct a tree
 *
 * @license
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


/**
 * @class Node
 * @param {Object} an object to make into a tree node
 */
export default class Node {
    /**
     * Create a new node instance.
     */
    constructor(obj) {
        if (obj) {
            // shallow copy all properties into this node
            Object.keys(obj).forEach(key => {
                if (key !== "children") {
                    this[key] = obj[key];
                }
            });
        } else {
            this.type = "text";
        }
    }

    /**
     * Add a child node to the current context of the tree.
     * @param {Node} child the child to add
     */
    add(child) {
        if (typeof(child) !== "object" || !(child instanceof Node)) {
            return;
        }

        if (typeof(this.children) === 'undefined') {
            this.children = [];
        }
        this.children.push(child);
    }

    /**
     * Flatten the current node and all of its descendents into an
     * array and return it. When a node has children, it is
     * flattened into two nodes: a start node, followed by nodes for
     * all its children, and an end node. The start and end nodes
     * are marked by a "use" property set to "start" and "end".
     *
     * @returns {Array.<Node>} an array of Nodes flattened from
     * the current node
     */
    toArray() {
        if (this.children) {
            var ret = [];

            var clone = new Node(this);
            clone.use = "start";
            ret.push(clone);

            for (var i = 0; i < this.children.length; i++) {
                ret = ret.concat(this.children[i].toArray());
            }

            clone = new Node(this);
            clone.use = "end";
            ret.push(clone);
        } else {
            this.use = undefined;
            return [this];
        }
    }

    /**
     * Recreate a full tree again from a flattened array of Node
     * instances. If the instances are well-formed (that is,
     * all start nodes are matched with end nodes with strict
     * nesting), then the tree is valid. If the array is not
     * well-formed, then the shape of the resulting tree will
     * probably not be valid and the results of this static method
     * are not defined.
     *
     * @static
     * @param {Array.<Node>} array the array of Node instances
     * to reconstruct into a tree
     * @returns {Node} a node that is the root of a tree
     * reconstructed from the array of Nodes
     */
    static fromArray(array) {
    }
}
