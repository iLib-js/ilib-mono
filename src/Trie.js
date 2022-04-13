/*
 * Trie.js - implementation of a trie data structure
 *
 * Copyright © 2013, 2018, 2021-2022 JEDLSoft
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
 * @constructor
 * @class
 */
export function TrieNode(obj) {
    this.obj = obj;
};

/**
 * Create a new, empty trie instance.
 *
 * @class
 */
export default class Trie {
    constructor() {
        this.nodes = {};
    }

    /**
     * Add a node to the trie that maps from the given array
     * to the given object.
     *
     * @param {Array.<string>} from
     * @param {Object} to
     */
    add(from, to) {
        //console.log("from length is " + from.length);
        let trienode = this.nodes;
        let dest = new TrieNode(to);

        for (var j = 0; j < from.length-1; j++) {
            switch (typeof(trienode[from[j]])) {
                case 'number':
                case 'string':
                    //console.log("existing leaf node " + from[j]);
                    // context-sensitive?
                    let temp = {
                        "__leaf": trienode[from[j]]
                    };
                    trienode[from[j]] = temp;
                    break;

                case 'object':
                    if (trienode[from[j]] instanceof TrieNode) {
                        //console.log("existing leaf node " + from[j]);
                        // context-sensitive? We have more to add, but
                        // there is a leaf here already. Push it down as
                        // a leaf and go on.
                        let temp = {
                            "__leaf": trienode[from[j]]
                        };
                        trienode[from[j]] = temp;
                    }
                    break;

                case 'undefined':
                    //console.log("new node " + from[j]);
                    trienode[from[j]] = {};
                    break;
            }

            trienode = trienode[from[j]];
        }

        //console.log("setting node " + from[j] + " to " + to);
        if (!exports.isEmpty(trienode[from[j]])) {
            //console.log("Add existing node leaf " + from[j]);
            // context-sensitive?
            trienode[from[j]].__leaf = dest;
        } else {
            //console.log("Adding new node " + from[j]);
            trienode[from[j]] = dest;
        }
    };

    /**
     * @private
     * @param {Object} node
     * @returns {Object}
     */
    _clean(node) {
        let json = {};

        for (var prop in node) {
            switch (typeof(node[prop])) {
                case 'undefined':
                    // ignore
                    break;
                case 'object':
                    if (node[prop] instanceof TrieNode) {
                        if (typeof(node[prop].obj) === 'object' && node[prop].obj instanceof Array && node[prop].obj.length === 1) {
                            json[prop] = node[prop].obj[0];
                        } else {
                            json[prop] = node[prop].obj;
                        }
                    } else {
                        json[prop] = this._clean(node[prop]);
                    }
                    break;
            }
        }

        return json;
    };

    /**
     * Return the clean form of the trie.
     */
    cleanForm() {
        return this._clean(this.nodes);
    };


    /**
     * Return a new tree where each of the children are sorted in the object.
     * This relies on node preserving the order of insertion, which is not
     * guaranteed, but works for now. The children are recursively sorted,
     * so the entire tree should come out sorted.
     *
     * @private
     * @param {Object} node the top node of this tree
     * @returns {Object} the sorted tree
     */
    sortTree(node) {
        let keys;
        let result;

        if (typeof(node) === "object") {
            // don't mess with the order of arrays
            if (exports.isArray(node)) {
                result = [];
                node.forEach(function(element) {
                    result.push(exports.sortTree(element));
                });
            } else {
                keys = Object.keys(node);
                result = {};
                keys.sort().forEach(function(key) {
                    result[key] = exports.sortTree(node[key]);
                });
            }
        } else {
            result = node;
        }

        return result;
    }
}
