## Classes

<dl>
<dt><a href="#Node">Node</a></dt>
<dd></dd>
<dt><a href="#Node">Node</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#isNode">isNode()</a></dt>
<dd><p>TreeNode.js - build, construct, and deconstruct a tree</p>
</dd>
</dl>

<a name="Node"></a>

## Node
**Kind**: global class  

* [Node](#Node)
    * [new Node(an)](#new_Node_new)
    * [new Node()](#new_Node_new)
    * _instance_
        * [.add(child)](#Node+add)
        * [.toArray()](#Node+toArray) ⇒ [<code>Array.&lt;Node&gt;</code>](#Node)
    * _static_
        * [.fromArray(array)](#Node.fromArray) ⇒ [<code>Node</code>](#Node)


* * *

<a name="new_Node_new"></a>

### new Node(an)

| Param | Type | Description |
| --- | --- | --- |
| an | <code>Object</code> | object to make into a tree node |


* * *

<a name="new_Node_new"></a>

### new Node()
Create a new node instance.


* * *

<a name="Node+add"></a>

### node.add(child)
Add a child node to the current context of the tree.

**Kind**: instance method of [<code>Node</code>](#Node)  

| Param | Type | Description |
| --- | --- | --- |
| child | [<code>Node</code>](#Node) | the child to add |


* * *

<a name="Node+toArray"></a>

### node.toArray() ⇒ [<code>Array.&lt;Node&gt;</code>](#Node)
Flatten the current node and all of its descendents into an
array and return it. When a node has children, it is
flattened into two nodes: a start node, followed by nodes for
all its children, and an end node. The start and end nodes
are marked by a "use" property set to "start" and "end".

**Kind**: instance method of [<code>Node</code>](#Node)  
**Returns**: [<code>Array.&lt;Node&gt;</code>](#Node) - an array of Nodes flattened from
the current node  

* * *

<a name="Node.fromArray"></a>

### Node.fromArray(array) ⇒ [<code>Node</code>](#Node)
Recreate a full tree again from a flattened array of Node
instances. If the instances are well-formed (that is,
all start nodes are matched with end nodes with strict
nesting), then the tree is valid. If the array is not
well-formed, then the shape of the resulting tree will
probably not be valid and the results of this static method
are not defined.

**Kind**: static method of [<code>Node</code>](#Node)  
**Returns**: [<code>Node</code>](#Node) - a node that is the root of a tree
reconstructed from the array of Nodes  

| Param | Type | Description |
| --- | --- | --- |
| array | [<code>Array.&lt;Node&gt;</code>](#Node) | the array of Node instances to reconstruct into a tree |


* * *

<a name="Node"></a>

## Node
**Kind**: global class  

* [Node](#Node)
    * [new Node(an)](#new_Node_new)
    * [new Node()](#new_Node_new)
    * _instance_
        * [.add(child)](#Node+add)
        * [.toArray()](#Node+toArray) ⇒ [<code>Array.&lt;Node&gt;</code>](#Node)
    * _static_
        * [.fromArray(array)](#Node.fromArray) ⇒ [<code>Node</code>](#Node)


* * *

<a name="new_Node_new"></a>

### new Node(an)

| Param | Type | Description |
| --- | --- | --- |
| an | <code>Object</code> | object to make into a tree node |


* * *

<a name="new_Node_new"></a>

### new Node()
Create a new node instance.


* * *

<a name="Node+add"></a>

### node.add(child)
Add a child node to the current context of the tree.

**Kind**: instance method of [<code>Node</code>](#Node)  

| Param | Type | Description |
| --- | --- | --- |
| child | [<code>Node</code>](#Node) | the child to add |


* * *

<a name="Node+toArray"></a>

### node.toArray() ⇒ [<code>Array.&lt;Node&gt;</code>](#Node)
Flatten the current node and all of its descendents into an
array and return it. When a node has children, it is
flattened into two nodes: a start node, followed by nodes for
all its children, and an end node. The start and end nodes
are marked by a "use" property set to "start" and "end".

**Kind**: instance method of [<code>Node</code>](#Node)  
**Returns**: [<code>Array.&lt;Node&gt;</code>](#Node) - an array of Nodes flattened from
the current node  

* * *

<a name="Node.fromArray"></a>

### Node.fromArray(array) ⇒ [<code>Node</code>](#Node)
Recreate a full tree again from a flattened array of Node
instances. If the instances are well-formed (that is,
all start nodes are matched with end nodes with strict
nesting), then the tree is valid. If the array is not
well-formed, then the shape of the resulting tree will
probably not be valid and the results of this static method
are not defined.

**Kind**: static method of [<code>Node</code>](#Node)  
**Returns**: [<code>Node</code>](#Node) - a node that is the root of a tree
reconstructed from the array of Nodes  

| Param | Type | Description |
| --- | --- | --- |
| array | [<code>Array.&lt;Node&gt;</code>](#Node) | the array of Node instances to reconstruct into a tree |


* * *

<a name="isNode"></a>

## isNode()
TreeNode.js - build, construct, and deconstruct a tree

**Kind**: global function  
**License**: Copyright © 2019, 2021, 2024 JEDLSoft

Licensed under the Apache License, Version 2.0 (the &quot;License&quot;);
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an &quot;AS IS&quot; BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License.  

* * *

