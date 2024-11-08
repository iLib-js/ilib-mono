# iLib Tree Node

Simple class to build, construct, and deconstruct an arbitrary tree
structure.

A node in the tree may have an arbitrary number of children. Each node
must have a type property and can optionally have any number of other
properties. There will also be a "children" property which will contain
any possible children, as well as a "use" and a "parent" property, so
the properties "children" and "use" and "parent" are reserved.

There is no tree structure per-se, only nodes. Any node can be considered
to be the root of a tree. Even a single node is a tree of size 1.

### Building a Tree from Scratch

To build a tree from scratch, you can use the following methods:

```
node.add() - add a child node to the current node
```

To create a tree, create a new Node instance and then add it as
a child to another Node instance.

Example of building a tree from scratch:

```
import Node from 'ilib-tree-node';

let parent = new Node({
    type: 'x'
});

let child = new Node({
    type: 'text',
    value: "this is a string"
});

parent.add(child);

// add an anonymous node
parent.add(new Node({
    type: 'text',
    value: "another string"
}));
```

### Deconstructing the Tree to an Array of Nodes

To deconstruct (flatten) the tree into an array of nodes, simply use:

```
node.toArray() - deconstruct the tree into an array of nodes
```

If a node has children, the toArray method will add a start node with
the "use" property set to "start", followed
by the children within that node, followed finally by an end node with
the "use" property set to "end". This happens recursively for all the
children such that the entire tree underneath the node is flattened as
well.

The array can be reconstructed back
into a tree using the information in the "use" property. Any node that
does not have children will get added to the array as-is.

### Reconstructing the Tree from an Array of Nodes

To reconstruct a tree from an array of nodes, use the following static method:

```
Node.fromArray(array) - reconstruct the tree from an array of nodes
```

This method will use the "use" property to rebuild a tree of varying depths.

You may add a "use" property to any
nodes in your array, as long as the start and end nodes for any
node type are balanced and well-formed. (ie. they are properly nested
like XML open and closing tags.). If they are not well-formed, this
method will create a tree with an unexpected structure. Any array
that is a result of a toArray call is guaranteed to be well-formed.

### Unist Trees

Note that this type of tree follows the [unist](https://github.com/syntax-tree/unist)
interface for a tree, and therefore any of the unist utilities may be
used to manipulate the tree.

To convert a regular unist tree into a ilib-tree-node tree, simply
do the following:

```
import Node from 'ilib-tree-node';
import map from 'unist-utils-map';

let ast = X; // some unist tree, probably from a parser

let treeNode = map(ast, node => new Node(node));
```

## License

Copyright © 2018-2024, JEDLSoft

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License.

# Release Notes

## v2.0.0

- convert all unit tests from nodeunit to jest
- export the es6 code as real es6 modules and old transpiled javascript
  for older packages to use (breaking change)

## v1.3.0

- implement the ability to add an array of nodes to the children at the
same time with the new `addChildren` method

