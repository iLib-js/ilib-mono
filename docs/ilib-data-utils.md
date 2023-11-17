## Modules

<table>
  <thead>
    <tr>
      <th>Module</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td><a href="#module_Utils">Utils</a></td>
    <td></td>
    </tr>
</tbody>
</table>

## Classes

<dl>
<dt><a href="#TrieNode">TrieNode</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#getCharacter">getCharacter()</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#getName">getName()</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#getCategory">getCategory()</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#getCombiningClass">getCombiningClass()</a> ⇒ <code>number</code></dt>
<dd></dd>
<dt><a href="#getBidiClass">getBidiClass()</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#getDecompositionType">getDecompositionType()</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#getDecomposition">getDecomposition()</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#getNumericType">getNumericType()</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#getNumericValue">getNumericValue()</a> ⇒ <code>number</code></dt>
<dd></dd>
<dt><a href="#getBidiMirrored">getBidiMirrored()</a> ⇒ <code>boolean</code></dt>
<dd></dd>
<dt><a href="#getSimpleUppercase">getSimpleUppercase()</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#getSimpleLowercase">getSimpleLowercase()</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#getSimpleTitlecase">getSimpleTitlecase()</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#length">length()</a> ⇒ <code>number</code></dt>
<dd><p>Return the number of content lines in this unicode file.</p>
</dd>
<dt><a href="#ge">ge(index)</a> ⇒ <code>Array.&lt;string&gt;</code></dt>
<dd><p>Return the content line with the given index.</p>
</dd>
<dt><a href="#add">add(from, to)</a></dt>
<dd><p>Add a node to the trie that maps from the given array
to the given object.</p>
</dd>
<dt><a href="#cleanForm">cleanForm()</a></dt>
<dd><p>Return the clean form of the trie.</p>
</dd>
<dt><a href="#length">length()</a> ⇒ <code>number</code></dt>
<dd><p>Return the number of rows in this character database. Each row is
represented by a CharacterInfo object.</p>
</dd>
<dt><a href="#get">get(index)</a> ⇒ <code>CharacterInfo</code></dt>
<dd><p>Return the character info for a particular row in the database.</p>
</dd>
<dt><a href="#length">length()</a> ⇒ <code>number</code></dt>
<dd><p>Return the number of content lines in this unicode file.</p>
</dd>
<dt><a href="#get">get(index)</a> ⇒ <code>Array.&lt;string&gt;</code></dt>
<dd><p>Return the content line with the given index.</p>
</dd>
<dt><a href="#getLine">getLine(index)</a> ⇒ <code>string</code></dt>
<dd><p>Return the whole line at the given index</p>
</dd>
</dl>

<a name="module_Utils"></a>

## Utils

* [Utils](#module_Utils)
    * [.isArray(object)](#module_Utils.isArray) ⇒ <code>boolean</code>
    * [.hexToChar(hex)](#module_Utils.hexToChar) ⇒ <code>string</code>
    * [.hexStringUTF16String(hex)](#module_Utils.hexStringUTF16String) ⇒ <code>string</code>
    * [.toHexString(string)](#module_Utils.toHexString) ⇒ <code>string</code>
    * [.findMember(arr, num)](#module_Utils.findMember) ⇒ <code>number</code>
    * [.isMember(arr, num)](#module_Utils.isMember) ⇒ <code>boolean</code>
    * [.coelesce(ranges, skip)](#module_Utils.coelesce) ⇒ <code>Array.&lt;{Array.&lt;(string\|number)&gt;}&gt;</code>
    * [.merge(object1, object2, [name1], [name2])](#module_Utils.merge) ⇒ <code>Object</code>
    * [.localeMergeAndPrune(localeData)](#module_Utils.localeMergeAndPrune) ⇒ <code>Object</code>


* * *

<a name="module_Utils.isArray"></a>

### Utils.isArray(object) ⇒ <code>boolean</code>
Test whether an object is an javascript array.

**Kind**: static method of [<code>Utils</code>](#module_Utils)  
**Returns**: <code>boolean</code> - return true if the object is an array
and false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>\*</code> | The object to test |


* * *

<a name="module_Utils.hexToChar"></a>

### Utils.hexToChar(hex) ⇒ <code>string</code>
Return the character that is represented by the given hexadecimal encoding.

**Kind**: static method of [<code>Utils</code>](#module_Utils)  
**Returns**: <code>string</code> - the character that is equivalent to the hexadecimal  

| Param | Type | Description |
| --- | --- | --- |
| hex | <code>string</code> | the hexadecimal encoding of the code point of the character |


* * *

<a name="module_Utils.hexStringUTF16String"></a>

### Utils.hexStringUTF16String(hex) ⇒ <code>string</code>
Return a string created by interpretting the space-separated Unicode characters
encoded as hex digits.

Example: "0065 0066"  -> "ab"

**Kind**: static method of [<code>Utils</code>](#module_Utils)  
**Returns**: <code>string</code> - the equivalent string as regular UTF-16 Unicode characters  

| Param | Type | Description |
| --- | --- | --- |
| hex | <code>string</code> | the string of characters encoded as hex digits |


* * *

<a name="module_Utils.toHexString"></a>

### Utils.toHexString(string) ⇒ <code>string</code>
Re-encode the characters in a string as a space-separated sequence of 16-bit
hex values.

**Kind**: static method of [<code>Utils</code>](#module_Utils)  
**Returns**: <code>string</code> - the re-encoded string  

| Param | Type | Description |
| --- | --- | --- |
| string | <code>string</code> | string to re-encode |


* * *

<a name="module_Utils.findMember"></a>

### Utils.findMember(arr, num) ⇒ <code>number</code>
Do a binary search of an array of ranges and single values to determine
whether or not the given value is encoded in that array. If an element
is a single number, it must match exactly for that element to be returned
as a match. If the element is a range array, then the range array
has the low end of the range encoded in the 0th element, and the
high end in the 1st element. The range array may contain more elements
after that, but the extra elements are ignored. They may be used to
indicate other information about the range, such as a name for example.

**Kind**: static method of [<code>Utils</code>](#module_Utils)  
**Returns**: <code>number</code> - the index in the array of the matching element or -1 to indicate no
match  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array.&lt;(Array.&lt;number&gt;\|number)&gt;</code> | array of number or array of number to search |
| num | <code>number</code> | value to search for |


* * *

<a name="module_Utils.isMember"></a>

### Utils.isMember(arr, num) ⇒ <code>boolean</code>
Do a binary search of an array of ranges and single values to determine
whether or not the given character is encoded in that array.

**Kind**: static method of [<code>Utils</code>](#module_Utils)  
**Returns**: <code>boolean</code> - true if the number is in the array or within a range in the array  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array.&lt;(Array.&lt;number&gt;\|number)&gt;</code> |  |
| num | <code>number</code> | number to search for |


* * *

<a name="module_Utils.coelesce"></a>

### Utils.coelesce(ranges, skip) ⇒ <code>Array.&lt;{Array.&lt;(string\|number)&gt;}&gt;</code>
Coelesce ranges to shorten files and to make searching it more efficient. There are 4 cases:

1. [A] followed by [A+1]       -> [A, A+1]
2. [A] followed by [A+1, B]    -> [A, B]
3. [A, B] followed by [B+1]    -> [A, B+1]
4. [A, B] followed by [B+1, C] -> [A, C]

where A, B, and C represent particular values. Handle each case properly.

**Kind**: static method of [<code>Utils</code>](#module_Utils)  
**Returns**: <code>Array.&lt;{Array.&lt;(string\|number)&gt;}&gt;</code> - a coelesced array of ranges  

| Param | Type | Description |
| --- | --- | --- |
| ranges | <code>Array.&lt;{Array.&lt;(string\|number)&gt;}&gt;</code> | an array of range arrays |
| skip | <code>number</code> | the number of elements to skip before the range. If it is 0, look at elements 0 and 1, and if it is 1, then the range is in elements 1 and 2. |


* * *

<a name="module_Utils.merge"></a>

### Utils.merge(object1, object2, [name1], [name2]) ⇒ <code>Object</code>
Merge the properties of object2 into object1 in a deep manner and return a merged
object. If the property exists in both objects, the value in object2 will overwrite
the value in object1. If a property exists in object1, but not in object2, its value
will not be touched. If a property exists in object2, but not in object1, it will be
added to the merged result.<p>

Name1 and name2 are for creating debug output only. They are not necessary.<p>

**Kind**: static method of [<code>Utils</code>](#module_Utils)  
**Returns**: <code>Object</code> - the merged object  

| Param | Type | Description |
| --- | --- | --- |
| object1 | <code>\*</code> | the object to merge into |
| object2 | <code>\*</code> | the object to merge |
| [name1] | <code>string</code> | name of the object being merged into |
| [name2] | <code>string</code> | name of the object being merged in |


* * *

<a name="module_Utils.localeMergeAndPrune"></a>

### Utils.localeMergeAndPrune(localeData) ⇒ <code>Object</code>
This merge and prune uses the locale hierarchy to determine which
locales are parents and which are children. This is the same hierarchy that
ilib itself uses, which allows us to get the right merging and pruning.

The function getSublocales in ilib-common lists out the locale hierarchy
that ilib uses, and we follow this hierarchy here.

The input is an object where the property name is the locale spec (partial
or full) and the value is an object containing the property "data" which
contains the raw data as loaded from CLDR.

Once the merge and prune is done, each one will have three properties:

<ol>
<li>data - the raw data as loaded from the CLDR files. Should not be
be modified from the original input data.
<li>merged - the fully merged data. This merges the highest level data
(root) into successively lower levels along the locale hierarchy such
that the most specific locale has a superset of all the data of all
its ancestors.
<li>pruned - the pruned version of the merged data where the data is
the children nodes is removed if it is the same as its immediate parent
node. That is, merging from the root locale down to a particular locale
should produce the same thing as what the merged property above contains,
but with a smaller footprint because duplicates are removed.
</ol>

After this function is done, the caller should read the "pruned" property
for each locale.

**Kind**: static method of [<code>Utils</code>](#module_Utils)  
**Returns**: <code>Object</code> - merged/pruned object  

| Param | Type | Description |
| --- | --- | --- |
| localeData | <code>Object</code> | data to merge and prune |


* * *

<a name="TrieNode"></a>

## TrieNode
**Kind**: global class  

* * *

<a name="getCharacter"></a>

## getCharacter() ⇒ <code>string</code>
**Kind**: global function  

* * *

<a name="getName"></a>

## getName() ⇒ <code>string</code>
**Kind**: global function  

* * *

<a name="getCategory"></a>

## getCategory() ⇒ <code>string</code>
**Kind**: global function  

* * *

<a name="getCombiningClass"></a>

## getCombiningClass() ⇒ <code>number</code>
**Kind**: global function  

* * *

<a name="getBidiClass"></a>

## getBidiClass() ⇒ <code>string</code>
**Kind**: global function  

* * *

<a name="getDecompositionType"></a>

## getDecompositionType() ⇒ <code>string</code>
**Kind**: global function  

* * *

<a name="getDecomposition"></a>

## getDecomposition() ⇒ <code>string</code>
**Kind**: global function  

* * *

<a name="getNumericType"></a>

## getNumericType() ⇒ <code>string</code>
**Kind**: global function  

* * *

<a name="getNumericValue"></a>

## getNumericValue() ⇒ <code>number</code>
**Kind**: global function  

* * *

<a name="getBidiMirrored"></a>

## getBidiMirrored() ⇒ <code>boolean</code>
**Kind**: global function  

* * *

<a name="getSimpleUppercase"></a>

## getSimpleUppercase() ⇒ <code>string</code>
**Kind**: global function  

* * *

<a name="getSimpleLowercase"></a>

## getSimpleLowercase() ⇒ <code>string</code>
**Kind**: global function  

* * *

<a name="getSimpleTitlecase"></a>

## getSimpleTitlecase() ⇒ <code>string</code>
**Kind**: global function  

* * *

<a name="length"></a>

## length() ⇒ <code>number</code>
Return the number of content lines in this unicode file.

**Kind**: global function  
**Returns**: <code>number</code> - the number of content lines in this unicode file  

* * *

<a name="ge"></a>

## ge(index) ⇒ <code>Array.&lt;string&gt;</code>
Return the content line with the given index.

**Kind**: global function  
**Returns**: <code>Array.&lt;string&gt;</code> - an array of content values as strings  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | the index of the given content line |


* * *

<a name="add"></a>

## add(from, to)
Add a node to the trie that maps from the given array
to the given object.

**Kind**: global function  

| Param | Type |
| --- | --- |
| from | <code>Array.&lt;string&gt;</code> | 
| to | <code>Object</code> | 


* * *

<a name="cleanForm"></a>

## cleanForm()
Return the clean form of the trie.

**Kind**: global function  

* * *

<a name="length"></a>

## length() ⇒ <code>number</code>
Return the number of rows in this character database. Each row is
represented by a CharacterInfo object.

**Kind**: global function  
**Returns**: <code>number</code> - the number of rows in this character database  

* * *

<a name="get"></a>

## get(index) ⇒ <code>CharacterInfo</code>
Return the character info for a particular row in the database.

**Kind**: global function  
**Returns**: <code>CharacterInfo</code> - the character info at the given row  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | the row to return |


* * *

<a name="length"></a>

## length() ⇒ <code>number</code>
Return the number of content lines in this unicode file.

**Kind**: global function  
**Returns**: <code>number</code> - the number of content lines in this unicode file  

* * *

<a name="get"></a>

## get(index) ⇒ <code>Array.&lt;string&gt;</code>
Return the content line with the given index.

**Kind**: global function  
**Returns**: <code>Array.&lt;string&gt;</code> - an array of content values as strings  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | the index of the given content line |


* * *

<a name="getLine"></a>

## getLine(index) ⇒ <code>string</code>
Return the whole line at the given index

**Kind**: global function  
**Returns**: <code>string</code> - the whole line at the given index  

| Param | Description |
| --- | --- |
| index | line number to get |


* * *

