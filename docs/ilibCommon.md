## Classes

<dl>
<dt><a href="#ISet">ISet</a></dt>
<dd><p>A polyfill for Set in older browsers.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#isArray">isArray(object)</a> ⇒ <code>boolean</code></dt>
<dd><p>Polyfile to test whether an object is an javascript array.</p>
</dd>
<dt><a href="#shallowCopy">shallowCopy(source, target)</a></dt>
<dd><p>Perform a shallow copy of the source object to the target object. This only
copies the assignments of the source properties to the target properties,
but not recursively from there.<p></p>
</dd>
<dt><a href="#deepCopy">deepCopy(from, to)</a> ⇒ <code>Object</code></dt>
<dd><p>Perform a recursive deep copy from the &quot;from&quot; object to the &quot;deep&quot; object.</p>
</dd>
<dt><a href="#mapString">mapString(str, map)</a> ⇒ <code>string</code></dt>
<dd><p>Map a string to the given set of alternate characters. If the target set
does not contain a particular character in the input string, then that
character will be copied to the output unmapped.</p>
</dd>
<dt><a href="#indexOf">indexOf(array, obj)</a> ⇒ <code>number</code></dt>
<dd><p>Check if an object is a member of the given array. This is a polyfill for
Array.indexOf. If this javascript engine
support indexOf, it is used directly. Otherwise, this function implements it
itself. The idea is to make sure that you can use the quick indexOf if it is
available, but use a slower implementation in older engines as well.</p>
</dd>
<dt><a href="#pad">pad(str, length, [right])</a></dt>
<dd><p>Pad the str with zeros to the given length of digits.</p>
</dd>
<dt><a href="#toHexString">toHexString(string, [limit])</a> ⇒ <code>string</code></dt>
<dd><p>Convert a string into the hexadecimal representation
of the Unicode characters in that string.</p>
</dd>
<dt><a href="#isDate">isDate(object)</a> ⇒ <code>boolean</code></dt>
<dd><p>Test whether an object in a Javascript Date.</p>
</dd>
<dt><a href="#merge">merge(object1, object2, [replace], [name1], [name2])</a> ⇒ <code>Object</code></dt>
<dd><p>Merge the properties of object2 into object1 in a deep manner and return a merged
object. If the property exists in both objects, the value in object2 will overwrite
the value in object1. If a property exists in object1, but not in object2, its value
will not be touched. If a property exists in object2, but not in object1, it will be
added to the merged result.<p></p>
<p>Name1 and name2 are for creating debug output only. They are not necessary.<p></p>
</dd>
<dt><a href="#isEmpty">isEmpty(obj)</a> ⇒ <code>boolean</code></dt>
<dd><p>Return true if the given object has no properties.<p></p>
</dd>
<dt><a href="#hashCode">hashCode()</a></dt>
<dd></dd>
<dt><a href="#callAll">callAll(arr, action, callback)</a></dt>
<dd><p>Calls the given action function on each element in the given
array arr asynchronously and in order and finally call the given callback when they are
all done. The action function should take the array to
process as its parameter, and a callback function. It should
process the first element in the array and then call its callback
function with the result of processing that element (if any).</p>
</dd>
<dt><a href="#extend">extend(object1, [object2])</a> ⇒ <code>Object</code></dt>
<dd><p>Extend object1 by mixing in everything from object2 into it. The objects
are deeply extended, meaning that this method recursively descends the
tree in the objects and mixes them in at each level. Arrays are extended
by concatenating the elements of object2 onto those of object1.</p>
</dd>
<dt><a href="#fromCodePoint">fromCodePoint(codepoint)</a> ⇒ <code>string</code></dt>
<dd><p>Convert a UCS-4 code point to a Javascript string. The codepoint can be any valid
UCS-4 Unicode character, including supplementary characters. Standard Javascript
only supports supplementary characters using the UTF-16 encoding, which has
values in the range 0x0000-0xFFFF. String.fromCharCode() will only
give you a string containing 16-bit characters, and will not properly convert
the code point for a supplementary character (which has a value &gt; 0xFFFF) into
two UTF-16 surrogate characters. Instead, it will just just give you whatever
single character happens to be the same as your code point modulo 0x10000, which
is almost never what you want.<p></p>
<p>Similarly, that means if you use String.charCodeAt()
you will only retrieve a 16-bit value, which may possibly be a single
surrogate character that is part of a surrogate pair representing a character
in the supplementary plane. It will not give you a code point. Use
IString.codePointAt() to access code points in a string, or use
an iterator to walk through the code points in a string.</p>
</dd>
<dt><a href="#toCodePoint">toCodePoint(str, index)</a> ⇒ <code>number</code></dt>
<dd><p>Convert the character or the surrogate pair at the given
index into the intrinsic Javascript string to a Unicode
UCS-4 code point.</p>
</dd>
<dt><a href="#signum">signum(num)</a> ⇒ <code>number</code></dt>
<dd><p>Return the sign of the given number. If the sign is negative, this function
returns -1. If the sign is positive or zero, this function returns 1.</p>
</dd>
<dt><a href="#floor">floor(num)</a> ⇒ <code>number</code></dt>
<dd></dd>
<dt><a href="#ceiling">ceiling(num)</a> ⇒ <code>number</code></dt>
<dd></dd>
<dt><a href="#down">down(num)</a> ⇒ <code>number</code></dt>
<dd><p>Round a number towards 0.</p>
</dd>
<dt><a href="#up">up(num)</a> ⇒ <code>number</code></dt>
<dd><p>Round a number away from 0.</p>
</dd>
<dt><a href="#halfup">halfup(num)</a> ⇒ <code>number</code></dt>
<dd><p>Round a number up away from 0 if it is half way or larger, otherwise
round down.</p>
</dd>
<dt><a href="#halfdown">halfdown(num)</a> ⇒ <code>number</code></dt>
<dd><p>Round a number down towards 0 if it is half way or smaller, otherwise
round up.</p>
</dd>
<dt><a href="#halfeven">halfeven(num)</a> ⇒ <code>number</code></dt>
<dd><p>Round numbers up to the closest even number.</p>
</dd>
<dt><a href="#halfodd">halfodd(num)</a> ⇒ <code>number</code></dt>
<dd><p>Round numbers up to the closest odd number.</p>
</dd>
<dt><a href="#mod">mod(dividend, modulus)</a> ⇒</dt>
<dd><p>Do a proper modulo function.</p>
<p>The Javascript % operator will give the truncated
division algorithm, but for calendrical calculations, we need the Euclidean
division algorithm where the remainder of any division, whether the dividend
is negative or not, is always a positive number in the range [0, modulus).<p></p>
</dd>
<dt><a href="#amod">amod(dividend, modulus)</a> ⇒</dt>
<dd><p>Do a proper adjusted modulo function. The Javascript % operator will give the truncated
division algorithm, but for calendrical calculations, we need the Euclidean
division algorithm where the remainder of any division, whether the dividend
is negative or not, is always a positive number in the range (0, modulus]. The adjusted
modulo function differs from the regular modulo function in that when the remainder is
zero, the modulus should be returned instead.<p></p>
</dd>
<dt><a href="#shiftDecimal">shiftDecimal(number, precision)</a> ⇒ <code>number</code></dt>
<dd><p>Return the number with the decimal shifted by the given precision.
Positive precisions shift the decimal to the right giving larger
numbers, and negative ones shift the decimal to the left giving
smaller numbers.</p>
</dd>
<dt><a href="#log10">log10(num)</a> ⇒ <code>number</code></dt>
<dd><p>Returns the base 10 logarithm of a number. For platforms that support
Math.log10() it is used directly. For plaforms that do not, such as Qt/QML,
it will be calculated using a polyfill.</p>
</dd>
<dt><a href="#significant">significant(number, digits, round)</a> ⇒ <code>number</code></dt>
<dd><p>Return the given number with only the given number of significant digits.
The number of significant digits can start with the digits greater than
1 and straddle the decimal point, or it may start after the decimal point.
If the number of digits requested is less than 1, the original number
will be returned unchanged.</p>
</dd>
<dt><a href="#bsearch">bsearch(target, arr, [comparator])</a> ⇒</dt>
<dd><p>Binary search a sorted array for a particular target value.
If the exact value is not found, it returns the index of the smallest
entry that is greater than the given target value.<p></p>
<p>The comparator
parameter is a function that knows how to compare elements of the
array and the target. The function should return a value greater than 0
if the array element is greater than the target, a value less than 0 if
the array element is less than the target, and 0 if the array element
and the target are equivalent.<p></p>
<p>If the comparator function is not specified, this function assumes
the array and the target are numeric values and should be compared
as such.<p></p>
</dd>
<dt><a href="#bisectionSearch">bisectionSearch(target, low, high, precision, [func])</a> ⇒</dt>
<dd><p>Do a bisection search of a function for a particular target value.<p></p>
<p>The function to search is a function that takes a numeric parameter,
does calculations, and returns gives a numeric result. The
function should should be smooth and not have any discontinuities
between the low and high values of the parameter.</p>
</dd>
<dt><a href="#getSublocales">getSublocales(locale)</a> ⇒ <code>Array.&lt;string&gt;</code></dt>
<dd><p>Return an array of locales that represent the sublocales of
the given locale. These sublocales are intended to be used
to load locale data. Each sublocale might be represented
separately by files on disk in order to share them with other
locales that have the same sublocales. The sublocales are
given in the order that they should be loaded, which is
least specific to most specific.<p></p>
<p>For example, the locale &quot;en-US&quot; would have the sublocales
&quot;root&quot;, &quot;en&quot;, &quot;und-US&quot;, and &quot;en-US&quot;.<p></p>
<h4>Variations</h4>

<p>With only language and region specified, the following
sequence of sublocales will be generated:<p></p>
<pre>
root
language
und-region
language-region
</pre>

<p>With only language and script specified:<p></p>
<pre>
root
language
language-script
</pre>

<p>With only script and region specified:<p></p>
<pre>
root
und-region
</pre>

<p>With only region and variant specified:<p></p>
<pre>
root
und-region
region-variant
</pre>

<p>With only language, script, and region specified:<p></p>
<pre>
root
language
und-region
language-script
language-region
language-script-region
</pre>

<p>With only language, region, and variant specified:<p></p>
<pre>
root
language
und-region
language-region
und-region-variant
language-region-variant
</pre>

<p>With all parts specified:<p></p>
<pre>
root
language
und-region
language-script
language-region
und-region-variant
language-script-region
language-region-variant
language-script-region-variant
</pre></dd>
<dt><a href="#getLocFiles">getLocFiles(locale, name)</a> ⇒ <code>Array.&lt;string&gt;</code></dt>
<dd><p>Return an array of relative path names for the
files that represent the data for the given locale.<p></p>
<p>Note that to prevent the situation where a directory for
a language exists next to the directory for a region where
the language code and region code differ only by case, the
plain region directories are located under the special
&quot;undefined&quot; language directory which has the ISO code &quot;und&quot;.
The reason is that some platforms have case-insensitive
file systems, and you cannot have 2 directories with the
same name which only differ by case. For example, &quot;es&quot; is
the ISO 639 code for the language &quot;Spanish&quot; and &quot;ES&quot; is
the ISO 3166 code for the region &quot;Spain&quot;, so both the
directories cannot exist underneath &quot;locale&quot;. The region
therefore will be loaded from &quot;und/ES&quot; instead.<p></p>
<h4>Variations</h4>

<p>With only language and region specified, the following
sequence of paths will be generated:<p></p>
<pre>
language
und/region
language/region
</pre>

<p>With only language and script specified:<p></p>
<pre>
language
language/script
</pre>

<p>With only script and region specified:<p></p>
<pre>
und/region
</pre>

<p>With only region and variant specified:<p></p>
<pre>
und/region
region/variant
</pre>

<p>With only language, script, and region specified:<p></p>
<pre>
language
und/region
language/script
language/region
language/script/region
</pre>

<p>With only language, region, and variant specified:<p></p>
<pre>
language
und/region
language/region
region/variant
language/region/variant
</pre>

<p>With all parts specified:<p></p>
<pre>
language
und/region
language/script
language/region
region/variant
language/script/region
language/region/variant
language/script/region/variant
</pre></dd>
</dl>

<a name="ISet"></a>

## ISet
A polyfill for Set in older browsers.

**Kind**: global class  

* [ISet](#ISet)
    * [new ISet([elements])](#new_ISet_new)
    * [.add(element)](#ISet+add) ⇒ <code>boolean</code>
    * [.clear()](#ISet+clear)
    * [.contains(element)](#ISet+contains) ⇒ <code>boolean</code>
    * [.isEmpty()](#ISet+isEmpty) ⇒ <code>boolean</code>
    * [.remove(element)](#ISet+remove) ⇒ <code>boolean</code>
    * [.asArray()](#ISet+asArray) ⇒ <code>Array.&lt;\*&gt;</code>
    * [.toJson()](#ISet+toJson) ⇒ <code>string</code>
    * [.toJS()](#ISet+toJS) ⇒ <code>\*</code>
    * [.fromJS()](#ISet+fromJS) ⇒ [<code>ISet</code>](#ISet) \| <code>undefined</code>


* * *

<a name="new_ISet_new"></a>

### new ISet([elements])
Create a new set with elements in the given array. The type of
the set is gleaned from the type of the first element in the
elements array, or the first element added to the set. The type
may be "string" or "number", and all elements will be returned
as elements of that type.


| Param | Type | Description |
| --- | --- | --- |
| [elements] | <code>Array.&lt;(string\|number)&gt;</code> | initial elements to add to the set |


* * *

<a name="ISet+add"></a>

### iSet.add(element) ⇒ <code>boolean</code>
Adds the specified element or array of elements to this set if it is or they are not
already present.

**Kind**: instance method of [<code>ISet</code>](#ISet)  
**Returns**: <code>boolean</code> - true if this set did not already contain the specified element[s]  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>\*</code> \| <code>Array.&lt;\*&gt;</code> | element or array of elements to add |


* * *

<a name="ISet+clear"></a>

### iSet.clear()
Removes all of the elements from this set.

**Kind**: instance method of [<code>ISet</code>](#ISet)  

* * *

<a name="ISet+contains"></a>

### iSet.contains(element) ⇒ <code>boolean</code>
Returns true if this set contains the specified element.

**Kind**: instance method of [<code>ISet</code>](#ISet)  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>\*</code> | the element to test |


* * *

<a name="ISet+isEmpty"></a>

### iSet.isEmpty() ⇒ <code>boolean</code>
Returns true if this set contains no elements.

**Kind**: instance method of [<code>ISet</code>](#ISet)  

* * *

<a name="ISet+remove"></a>

### iSet.remove(element) ⇒ <code>boolean</code>
Removes the specified element from this set if it is present.

**Kind**: instance method of [<code>ISet</code>](#ISet)  
**Returns**: <code>boolean</code> - true if the set contained the specified element  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>\*</code> | the element to remove |


* * *

<a name="ISet+asArray"></a>

### iSet.asArray() ⇒ <code>Array.&lt;\*&gt;</code>
Return the set as a javascript array.

**Kind**: instance method of [<code>ISet</code>](#ISet)  
**Returns**: <code>Array.&lt;\*&gt;</code> - the set represented as a javascript array  

* * *

<a name="ISet+toJson"></a>

### iSet.toJson() ⇒ <code>string</code>
Represents the current set as json.

**Kind**: instance method of [<code>ISet</code>](#ISet)  
**Returns**: <code>string</code> - the current set represented as json  

* * *

<a name="ISet+toJS"></a>

### iSet.toJS() ⇒ <code>\*</code>
Convert to a javascript representation of this object.
In this case, it is a normal JS array.

**Kind**: instance method of [<code>ISet</code>](#ISet)  
**Returns**: <code>\*</code> - the JS representation of this object  

* * *

<a name="ISet+fromJS"></a>

### iSet.fromJS() ⇒ [<code>ISet</code>](#ISet) \| <code>undefined</code>
Convert from a js representation to an internal one.

**Kind**: instance method of [<code>ISet</code>](#ISet)  
**Returns**: [<code>ISet</code>](#ISet) \| <code>undefined</code> - the current object, or undefined if the conversion did not work  

* * *

<a name="isArray"></a>

## isArray(object) ⇒ <code>boolean</code>
Polyfile to test whether an object is an javascript array.

**Kind**: global function  
**Returns**: <code>boolean</code> - return true if the object is an array
and false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>\*</code> | The object to test |


* * *

<a name="shallowCopy"></a>

## shallowCopy(source, target)
Perform a shallow copy of the source object to the target object. This only
copies the assignments of the source properties to the target properties,
but not recursively from there.<p>

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>Object</code> | the source object to copy properties from |
| target | <code>Object</code> | the target object to copy properties into |


* * *

<a name="deepCopy"></a>

## deepCopy(from, to) ⇒ <code>Object</code>
Perform a recursive deep copy from the "from" object to the "deep" object.

**Kind**: global function  
**Returns**: <code>Object</code> - a reference to the the "to" object  

| Param | Type | Description |
| --- | --- | --- |
| from | <code>Object</code> | the object to copy from |
| to | <code>Object</code> | the object to copy to |


* * *

<a name="mapString"></a>

## mapString(str, map) ⇒ <code>string</code>
Map a string to the given set of alternate characters. If the target set
does not contain a particular character in the input string, then that
character will be copied to the output unmapped.

**Kind**: global function  
**Returns**: <code>string</code> - the source string where each character is mapped to alternate characters  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | a string to map to an alternate set of characters |
| map | <code>Array.&lt;string&gt;</code> \| <code>Object</code> | a mapping to alternate characters |


* * *

<a name="indexOf"></a>

## indexOf(array, obj) ⇒ <code>number</code>
Check if an object is a member of the given array. This is a polyfill for
Array.indexOf. If this javascript engine
support indexOf, it is used directly. Otherwise, this function implements it
itself. The idea is to make sure that you can use the quick indexOf if it is
available, but use a slower implementation in older engines as well.

**Kind**: global function  
**Returns**: <code>number</code> - index of the object in the array, or -1 if it is not in the array.  

| Param | Type | Description |
| --- | --- | --- |
| array | <code>Array.&lt;(Object\|string\|number)&gt;</code> | array to search |
| obj | <code>Object</code> \| <code>string</code> \| <code>number</code> | object being sought. This should be of the same type as the members of the array being searched. If not, this function will not return any results. |


* * *

<a name="pad"></a>

## pad(str, length, [right])
Pad the str with zeros to the given length of digits.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> \| <code>number</code> | the string or number to pad |
| length | <code>number</code> | the desired total length of the output string, padded |
| [right] | <code>boolean</code> | if true, pad on the right side of the number rather than the left. Default is false. |


* * *

<a name="toHexString"></a>

## toHexString(string, [limit]) ⇒ <code>string</code>
Convert a string into the hexadecimal representation
of the Unicode characters in that string.

**Kind**: global function  
**Returns**: <code>string</code> - a hexadecimal representation of the
Unicode characters in the input string  

| Param | Type | Description |
| --- | --- | --- |
| string | <code>string</code> | The string to convert |
| [limit] | <code>number</code> | the number of digits to use to represent the character (1 to 8) |


* * *

<a name="isDate"></a>

## isDate(object) ⇒ <code>boolean</code>
Test whether an object in a Javascript Date.

**Kind**: global function  
**Returns**: <code>boolean</code> - return true if the object is a Date
and false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> \| <code>null</code> \| <code>undefined</code> | The object to test |


* * *

<a name="merge"></a>

## merge(object1, object2, [replace], [name1], [name2]) ⇒ <code>Object</code>
Merge the properties of object2 into object1 in a deep manner and return a merged
object. If the property exists in both objects, the value in object2 will overwrite
the value in object1. If a property exists in object1, but not in object2, its value
will not be touched. If a property exists in object2, but not in object1, it will be
added to the merged result.<p>

Name1 and name2 are for creating debug output only. They are not necessary.<p>

**Kind**: global function  
**Returns**: <code>Object</code> - the merged object  

| Param | Type | Description |
| --- | --- | --- |
| object1 | <code>\*</code> | the object to merge into |
| object2 | <code>\*</code> | the object to merge |
| [replace] | <code>boolean</code> | if true, replace the array elements in object1 with those in object2. If false, concatenate array elements in object1 with items in object2. |
| [name1] | <code>string</code> | name of the object being merged into |
| [name2] | <code>string</code> | name of the object being merged in |


* * *

<a name="isEmpty"></a>

## isEmpty(obj) ⇒ <code>boolean</code>
Return true if the given object has no properties.<p>

**Kind**: global function  
**Returns**: <code>boolean</code> - true if the given object has no properties, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | the object to check |


* * *

<a name="hashCode"></a>

## hashCode()
**Kind**: global function  

* * *

<a name="callAll"></a>

## callAll(arr, action, callback)
Calls the given action function on each element in the given
array arr asynchronously and in order and finally call the given callback when they are
all done. The action function should take the array to
process as its parameter, and a callback function. It should
process the first element in the array and then call its callback
function with the result of processing that element (if any).

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array.&lt;Object&gt;</code> | the array to process |
| action | <code>function</code> | the action to perform on each element of the array |
| callback | <code>function</code> | the callback function to call with the results of processing each element of the array. |


* * *

<a name="extend"></a>

## extend(object1, [object2]) ⇒ <code>Object</code>
Extend object1 by mixing in everything from object2 into it. The objects
are deeply extended, meaning that this method recursively descends the
tree in the objects and mixes them in at each level. Arrays are extended
by concatenating the elements of object2 onto those of object1.

**Kind**: global function  
**Returns**: <code>Object</code> - returns object1  

| Param | Type | Description |
| --- | --- | --- |
| object1 | <code>Object</code> | the target object to extend |
| [object2] | <code>Object</code> | the object to mix in to object1 |


* * *

<a name="fromCodePoint"></a>

## fromCodePoint(codepoint) ⇒ <code>string</code>
Convert a UCS-4 code point to a Javascript string. The codepoint can be any valid
UCS-4 Unicode character, including supplementary characters. Standard Javascript
only supports supplementary characters using the UTF-16 encoding, which has
values in the range 0x0000-0xFFFF. String.fromCharCode() will only
give you a string containing 16-bit characters, and will not properly convert
the code point for a supplementary character (which has a value > 0xFFFF) into
two UTF-16 surrogate characters. Instead, it will just just give you whatever
single character happens to be the same as your code point modulo 0x10000, which
is almost never what you want.<p>

Similarly, that means if you use String.charCodeAt()
you will only retrieve a 16-bit value, which may possibly be a single
surrogate character that is part of a surrogate pair representing a character
in the supplementary plane. It will not give you a code point. Use
IString.codePointAt() to access code points in a string, or use
an iterator to walk through the code points in a string.

**Kind**: global function  
**Returns**: <code>string</code> - a string containing the character represented by the codepoint  

| Param | Type | Description |
| --- | --- | --- |
| codepoint | <code>number</code> | UCS-4 code point to convert to a character |


* * *

<a name="toCodePoint"></a>

## toCodePoint(str, index) ⇒ <code>number</code>
Convert the character or the surrogate pair at the given
index into the intrinsic Javascript string to a Unicode
UCS-4 code point.

**Kind**: global function  
**Returns**: <code>number</code> - code point of the character at the
given index into the string  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | string to get the code point from |
| index | <code>number</code> | index into the string |


* * *

<a name="signum"></a>

## signum(num) ⇒ <code>number</code>
Return the sign of the given number. If the sign is negative, this function
returns -1. If the sign is positive or zero, this function returns 1.

**Kind**: global function  
**Returns**: <code>number</code> - -1 if the number is negative, and 1 otherwise  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>number</code> | the number to test |


* * *

<a name="floor"></a>

## floor(num) ⇒ <code>number</code>
**Kind**: global function  
**Returns**: <code>number</code> - rounded number  
**Access**: protected  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>number</code> | number to round |


* * *

<a name="ceiling"></a>

## ceiling(num) ⇒ <code>number</code>
**Kind**: global function  
**Returns**: <code>number</code> - rounded number  
**Access**: protected  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>number</code> | number to round |


* * *

<a name="down"></a>

## down(num) ⇒ <code>number</code>
Round a number towards 0.

**Kind**: global function  
**Returns**: <code>number</code> - rounded number  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>number</code> | number to round |


* * *

<a name="up"></a>

## up(num) ⇒ <code>number</code>
Round a number away from 0.

**Kind**: global function  
**Returns**: <code>number</code> - rounded number  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>number</code> | number to round |


* * *

<a name="halfup"></a>

## halfup(num) ⇒ <code>number</code>
Round a number up away from 0 if it is half way or larger, otherwise
round down.

**Kind**: global function  
**Returns**: <code>number</code> - rounded number  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>number</code> | number to round |


* * *

<a name="halfdown"></a>

## halfdown(num) ⇒ <code>number</code>
Round a number down towards 0 if it is half way or smaller, otherwise
round up.

**Kind**: global function  
**Returns**: <code>number</code> - rounded number  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>number</code> | number to round |


* * *

<a name="halfeven"></a>

## halfeven(num) ⇒ <code>number</code>
Round numbers up to the closest even number.

**Kind**: global function  
**Returns**: <code>number</code> - rounded number  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>number</code> | number to round |


* * *

<a name="halfodd"></a>

## halfodd(num) ⇒ <code>number</code>
Round numbers up to the closest odd number.

**Kind**: global function  
**Returns**: <code>number</code> - rounded number  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>number</code> | number to round |


* * *

<a name="mod"></a>

## mod(dividend, modulus) ⇒
Do a proper modulo function.

The Javascript % operator will give the truncated
division algorithm, but for calendrical calculations, we need the Euclidean
division algorithm where the remainder of any division, whether the dividend
is negative or not, is always a positive number in the range [0, modulus).<p>

**Kind**: global function  
**Returns**: the remainder of dividing the dividend by the modulus.  

| Param | Type | Description |
| --- | --- | --- |
| dividend | <code>number</code> | the number being divided |
| modulus | <code>number</code> | the number dividing the dividend. This should always be a positive number. |


* * *

<a name="amod"></a>

## amod(dividend, modulus) ⇒
Do a proper adjusted modulo function. The Javascript % operator will give the truncated
division algorithm, but for calendrical calculations, we need the Euclidean
division algorithm where the remainder of any division, whether the dividend
is negative or not, is always a positive number in the range (0, modulus]. The adjusted
modulo function differs from the regular modulo function in that when the remainder is
zero, the modulus should be returned instead.<p>

**Kind**: global function  
**Returns**: the remainder of dividing the dividend by the modulus.  

| Param | Type | Description |
| --- | --- | --- |
| dividend | <code>number</code> | the number being divided |
| modulus | <code>number</code> | the number dividing the dividend. This should always be a positive number. |


* * *

<a name="shiftDecimal"></a>

## shiftDecimal(number, precision) ⇒ <code>number</code>
Return the number with the decimal shifted by the given precision.
Positive precisions shift the decimal to the right giving larger
numbers, and negative ones shift the decimal to the left giving
smaller numbers.

**Kind**: global function  
**Returns**: <code>number</code> - the number with the decimal point shifted by the
given number of decimals  

| Param | Type | Description |
| --- | --- | --- |
| number | <code>number</code> | the number to shift |
| precision | <code>number</code> | the number of places to move the decimal point |


* * *

<a name="log10"></a>

## log10(num) ⇒ <code>number</code>
Returns the base 10 logarithm of a number. For platforms that support
Math.log10() it is used directly. For plaforms that do not, such as Qt/QML,
it will be calculated using a polyfill.

**Kind**: global function  
**Returns**: <code>number</code> - the base-10 logarithm of the given number  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>number</code> | the number to take the logarithm of |


* * *

<a name="significant"></a>

## significant(number, digits, round) ⇒ <code>number</code>
Return the given number with only the given number of significant digits.
The number of significant digits can start with the digits greater than
1 and straddle the decimal point, or it may start after the decimal point.
If the number of digits requested is less than 1, the original number
will be returned unchanged.

**Kind**: global function  
**Returns**: <code>number</code> - the given number with only the requested number of
significant digits  

| Param | Type | Description |
| --- | --- | --- |
| number | <code>number</code> | the number to return with only significant digits |
| digits | <code>number</code> | the number of significant digits to include in the returned number |
| round | <code>function</code> | a rounding function to use |


* * *

<a name="bsearch"></a>

## bsearch(target, arr, [comparator]) ⇒
Binary search a sorted array for a particular target value.
If the exact value is not found, it returns the index of the smallest
entry that is greater than the given target value.<p>

The comparator
parameter is a function that knows how to compare elements of the
array and the target. The function should return a value greater than 0
if the array element is greater than the target, a value less than 0 if
the array element is less than the target, and 0 if the array element
and the target are equivalent.<p>

If the comparator function is not specified, this function assumes
the array and the target are numeric values and should be compared
as such.<p>

**Kind**: global function  
**Returns**: the index of the array into which the value would fit if
inserted, or -1 if given array is not an array or the target is not
a number  

| Param | Type | Description |
| --- | --- | --- |
| target | <code>\*</code> | element being sought |
| arr | <code>Array</code> | the array being searched |
| [comparator] | <code>function</code> | a comparator that is appropriate for comparing two entries in the array |


* * *

<a name="bisectionSearch"></a>

## bisectionSearch(target, low, high, precision, [func]) ⇒
Do a bisection search of a function for a particular target value.<p>

The function to search is a function that takes a numeric parameter,
does calculations, and returns gives a numeric result. The
function should should be smooth and not have any discontinuities
between the low and high values of the parameter.

**Kind**: global function  
**Returns**: an approximation of the input value to the function that gives the desired
target output value, correct to within the error range of Javascript floating point
arithmetic, or NaN if there was some error  

| Param | Type | Description |
| --- | --- | --- |
| target | <code>number</code> | value being sought |
| low | <code>number</code> | the lower bounds to start searching |
| high | <code>number</code> | the upper bounds to start searching |
| precision | <code>number</code> | minimum precision to support. Use 0 if you want to use the default. |
| [func] | <code>function</code> | function to search |


* * *

<a name="getSublocales"></a>

## getSublocales(locale) ⇒ <code>Array.&lt;string&gt;</code>
Return an array of locales that represent the sublocales of
the given locale. These sublocales are intended to be used
to load locale data. Each sublocale might be represented
separately by files on disk in order to share them with other
locales that have the same sublocales. The sublocales are
given in the order that they should be loaded, which is
least specific to most specific.<p>

For example, the locale "en-US" would have the sublocales
"root", "en", "und-US", and "en-US".<p>

<h4>Variations</h4>

With only language and region specified, the following
sequence of sublocales will be generated:<p>

<pre>
root
language
und-region
language-region
</pre>

With only language and script specified:<p>

<pre>
root
language
language-script
</pre>

With only script and region specified:<p>

<pre>
root
und-region
</pre>

With only region and variant specified:<p>

<pre>
root
und-region
region-variant
</pre>

With only language, script, and region specified:<p>

<pre>
root
language
und-region
language-script
language-region
language-script-region
</pre>

With only language, region, and variant specified:<p>

<pre>
root
language
und-region
language-region
und-region-variant
language-region-variant
</pre>

With all parts specified:<p>

<pre>
root
language
und-region
language-script
language-region
und-region-variant
language-script-region
language-region-variant
language-script-region-variant
</pre>

**Kind**: global function  
**Returns**: <code>Array.&lt;string&gt;</code> - An array of locale specifiers that
are the sublocales of the given on  

| Param | Type | Description |
| --- | --- | --- |
| locale | <code>Locale</code> \| <code>String</code> | the locale to find the sublocales for |


* * *

<a name="getLocFiles"></a>

## getLocFiles(locale, name) ⇒ <code>Array.&lt;string&gt;</code>
Return an array of relative path names for the
files that represent the data for the given locale.<p>

Note that to prevent the situation where a directory for
a language exists next to the directory for a region where
the language code and region code differ only by case, the
plain region directories are located under the special
"undefined" language directory which has the ISO code "und".
The reason is that some platforms have case-insensitive
file systems, and you cannot have 2 directories with the
same name which only differ by case. For example, "es" is
the ISO 639 code for the language "Spanish" and "ES" is
the ISO 3166 code for the region "Spain", so both the
directories cannot exist underneath "locale". The region
therefore will be loaded from "und/ES" instead.<p>

<h4>Variations</h4>

With only language and region specified, the following
sequence of paths will be generated:<p>

<pre>
language
und/region
language/region
</pre>

With only language and script specified:<p>

<pre>
language
language/script
</pre>

With only script and region specified:<p>

<pre>
und/region
</pre>

With only region and variant specified:<p>

<pre>
und/region
region/variant
</pre>

With only language, script, and region specified:<p>

<pre>
language
und/region
language/script
language/region
language/script/region
</pre>

With only language, region, and variant specified:<p>

<pre>
language
und/region
language/region
region/variant
language/region/variant
</pre>

With all parts specified:<p>

<pre>
language
und/region
language/script
language/region
region/variant
language/script/region
language/region/variant
language/script/region/variant
</pre>

**Kind**: global function  
**Returns**: <code>Array.&lt;string&gt;</code> - An array of relative path names
for the files that contain the locale data  

| Param | Type | Description |
| --- | --- | --- |
| locale | <code>Locale</code> | load the files for this locale |
| name | <code>string</code> | the file name of each file to load without any path |


* * *

