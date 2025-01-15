<a name="IString"></a>

## IString
Create a new ilib string instance. This string inherits from and
extends the Javascript String class. It can be
used almost anywhere that a normal Javascript string is used, though in
some instances you will need to call the [#toString](#toString) method when
a built-in Javascript string is needed. The formatting methods are
methods that are not in the intrinsic String class and are most useful
when localizing strings in an app or web site in combination with
the ResBundle class.<p>

This class is named IString ("ilib string") so as not to conflict with the
built-in Javascript String class.

**Kind**: global class  

* [IString](#IString)
    * [new IString(string, [options])](#new_IString_new)
    * _instance_
        * [.format(params)](#IString+format) ⇒
        * [.formatChoice(argIndex, params)](#IString+formatChoice) ⇒ <code>string</code>
        * [.at(offset)](#IString+at) ⇒ [<code>IString</code>](#IString)
        * [.charAt(index)](#IString+charAt) ⇒ [<code>IString</code>](#IString)
        * [.charCodeAt(index)](#IString+charCodeAt) ⇒ <code>number</code>
        * [.codePointAt(index)](#IString+codePointAt) ⇒ <code>number</code>
        * [.concat(strings)](#IString+concat) ⇒ [<code>IString</code>](#IString)
        * [.endsWith()](#IString+endsWith) ⇒ <code>boolean</code>
        * [.includes(searchValue, start)](#IString+includes) ⇒ <code>boolean</code>
        * [.indexOf(searchValue, start)](#IString+indexOf) ⇒ <code>number</code>
        * [.lastIndexOf(searchValue, start)](#IString+lastIndexOf) ⇒ <code>number</code>
        * [.localeCompare(compareString, [locales], [options])](#IString+localeCompare)
        * [.match(regexp)](#IString+match) ⇒ <code>Array.&lt;string&gt;</code>
        * [.matchAll(regexp)](#IString+matchAll) ⇒ <code>iterator</code>
        * [.normalize(form)](#IString+normalize) ⇒ [<code>IString</code>](#IString)
        * [.padEnd()](#IString+padEnd) ⇒ [<code>IString</code>](#IString)
        * [.padStart()](#IString+padStart) ⇒ [<code>IString</code>](#IString)
        * [.repeat()](#IString+repeat) ⇒ [<code>IString</code>](#IString)
        * [.replace(searchValue, newValue)](#IString+replace) ⇒ [<code>IString</code>](#IString)
        * [.replaceAll(searchValue, newValue)](#IString+replaceAll) ⇒ [<code>IString</code>](#IString)
        * [.search(regexp)](#IString+search) ⇒ <code>number</code>
        * [.slice(start, end)](#IString+slice) ⇒ [<code>IString</code>](#IString)
        * [.split(separator, limit)](#IString+split) ⇒ <code>Array.&lt;string&gt;</code>
        * [.startsWith()](#IString+startsWith) ⇒ <code>boolean</code>
        * [.substr(start, length)](#IString+substr) ⇒ [<code>IString</code>](#IString)
        * [.substring(from, to)](#IString+substring) ⇒ [<code>IString</code>](#IString)
        * [.toLocaleLowerCase()](#IString+toLocaleLowerCase) ⇒ [<code>IString</code>](#IString)
        * [.toLocaleUpperCase()](#IString+toLocaleUpperCase) ⇒ [<code>IString</code>](#IString)
        * [.toLowerCase()](#IString+toLowerCase) ⇒ [<code>IString</code>](#IString)
        * [.toString()](#IString+toString) ⇒ <code>string</code>
        * [.toUpperCase()](#IString+toUpperCase) ⇒ [<code>IString</code>](#IString)
        * [.trim()](#IString+trim) ⇒ [<code>IString</code>](#IString)
        * [.trimEnd()](#IString+trimEnd) ⇒ [<code>IString</code>](#IString)
        * [.trimStart()](#IString+trimStart) ⇒ [<code>IString</code>](#IString)
        * [.valueOf()](#IString+valueOf) ⇒ <code>string</code>
        * [.trimRight()](#IString+trimRight) ⇒ [<code>IString</code>](#IString)
        * [.trimLeft()](#IString+trimLeft) ⇒ [<code>IString</code>](#IString)
        * [.forEach(callback)](#IString+forEach)
        * [.forEachCodePoint(callback)](#IString+forEachCodePoint)
        * [.iterator()](#IString+iterator) ⇒ <code>Object</code>
        * [.charIterator()](#IString+charIterator) ⇒ <code>Object</code>
        * [.getLocale()](#IString+getLocale) ⇒ <code>string</code>
        * [.codePointLength()](#IString+codePointLength) ⇒ <code>number</code>
    * _static_
        * [.create(locale, options)](#IString.create) ⇒ <code>Promise</code>
        * [.isSurrogate(ch)](#IString.isSurrogate) ⇒ <code>boolean</code>
        * [.fromCodePoint(codepoint)](#IString.fromCodePoint) ⇒ <code>string</code>
        * [.toCodePoint(str, index)](#IString.toCodePoint) ⇒ <code>number</code>
        * [.@@Iterator()](#IString.@@Iterator)


* * *

<a name="new_IString_new"></a>

### new IString(string, [options])
Create a new ilib string instance.<p>

The options may contain the following properties:
<ul>
<li>locale - the locale of this string
</ul>


| Param | Type | Description |
| --- | --- | --- |
| string | <code>string</code> \| [<code>IString</code>](#IString) | initialize this instance with this string |
| [options] | <code>options</code> | options governing the construction of this instance |


* * *

<a name="IString+format"></a>

### iString.format(params) ⇒
Format this string instance as a message, replacing the parameters with
the given values.<p>

The string can contain any text that a regular Javascript string can
contain. Replacement parameters have the syntax:

<pre>
{name}
</pre>

Where "name" can be any string surrounded by curly brackets. The value of
"name" is taken from the parameters argument.<p>

Example:

<pre>
const str = new IString("There are {num} objects.");
console.log(str.format({
  num: 12
});
</pre>

Would give the output:

<pre>
There are 12 objects.
</pre>

If a property is missing from the parameter block, the replacement
parameter substring is left untouched in the string, and a different
set of parameters may be applied a second time. This way, different
parts of the code may format different parts of the message that they
happen to know about.<p>

Example:

<pre>
const str = new IString("There are {num} objects in the {container}.");
console.log(str.format({
  num: 12
});
</pre>

Would give the output:<p>

<pre>
There are 12 objects in the {container}.
</pre>

The result can then be formatted again with a different parameter block that
specifies a value for the container property.

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: a new IString instance with as many replacement parameters filled
out as possible with real values.  

| Param | Description |
| --- | --- |
| params | a Javascript object containing values for the replacement parameters in the current string |


* * *

<a name="IString+formatChoice"></a>

### iString.formatChoice(argIndex, params) ⇒ <code>string</code>
Format a string as one of a choice of strings dependent on the value of
a particular argument index or array of indices.<p>

The syntax of the choice string is as follows. The string contains a
series of choices separated by a vertical bar character "|". Each choice
has a value or range of values to match followed by a hash character "#"
followed by the string to use if the variable matches the criteria.<p>

Example string:

<pre>
const num = 2;
const str = new IString("0#There are no objects.|1#There is one object.|2#There are {number} objects.");
console.log(str.formatChoice(num, {
  number: num
}));
</pre>

Gives the output:

<pre>
"There are 2 objects."
</pre>

The strings to format may contain replacement variables that will be formatted
using the format() method above and the params argument as a source of values
to use while formatting those variables.<p>

If the criterion for a particular choice is empty, that choice will be used
as the default one for use when none of the other choice's criteria match.<p>

Example string:

<pre>
const num = 22;
const str = new IString("0#There are no objects.|1#There is one object.|#There are {number} objects.");
console.log(str.formatChoice(num, {
  number: num
}));
</pre>

Gives the output:

<pre>
"There are 22 objects."
</pre>

If multiple choice patterns can match a given argument index, the first one
encountered in the string will be used. If no choice patterns match the
argument index, then the default choice will be used. If there is no default
choice defined, then this method will return an empty string.<p>

<b>Special Syntax</b><p>

For any choice format string, all of the patterns in the string should be
of a single type: numeric, boolean, or string/regexp. The type of the
patterns is determined by the type of the argument index parameter.<p>

If the argument index is numeric, then some special syntax can be used
in the patterns to match numeric ranges.<p>

<ul>
<li><i>&gt;x</i> - match any number that is greater than x
<li><i>&gt;=x</i> - match any number that is greater than or equal to x
<li><i>&lt;x</i> - match any number that is less than x
<li><i>&lt;=x</i> - match any number that is less than or equal to x
<li><i>start-end</i> - match any number in the range [start,end)
<li><i>zero</i> - match any number in the class "zero". (See below for
a description of number classes.)
<li><i>one</i> - match any number in the class "one"
<li><i>two</i> - match any number in the class "two"
<li><i>few</i> - match any number in the class "few"
<li><i>many</i> - match any number in the class "many"
<li><i>other</i> - match any number in the other or default class
</ul>

A number class defines a set of numbers that receive a particular syntax
in the strings. For example, in Slovenian, integers ending in the digit
"1" are in the "one" class, including 1, 21, 31, ... 101, 111, etc.
Similarly, integers ending in the digit "2" are in the "two" class.
Integers ending in the digits "3" or "4" are in the "few" class, and
every other integer is handled by the default string.<p>

The definition of what numbers are included in a class is locale-dependent.
They are defined in the data file plurals.json. If your string is in a
different locale than the default for ilib, you should call the setLocale()
method of the string instance before calling this method.<p>

<b>Other Pattern Types</b><p>

If the argument index is a boolean, the string values "true" and "false"
may appear as the choice patterns.<p>

If the argument index is of type string, then the choice patterns may contain
regular expressions, or static strings as degenerate regexps.<p>

<b>Multiple Indexes</b><p>

If you have 2 or more indexes to format into a string, you can pass them as
an array. When you do that, the patterns to match should be a comma-separate
list of patterns as per the rules above.<p>

Example string:

<pre>
const str = new IString("zero,zero#There are no objects on zero pages.|one,one#There is 1 object on 1 page.|other,one#There are {number} objects on 1 page.|#There are {number} objects on {pages} pages.");
const num = 4, pages = 1;
console.log(str.formatChoice([num, pages], {
  number: num,
  pages: pages
}));
</pre>

Gives the output:<p>

<pre>
"There are 4 objects on 1 page."
</pre>

Note that when there is a single index, you would typically leave the pattern blank to
indicate the default choice. When there are multiple indices, sometimes one of the
patterns has to be the default case when the other is not. Rather than leaving one or
more of the patterns blank with commas that look out-of-place in the middle of it, you
can use the word "other" to indicate a match with the default or other choice. The above example
shows the use of the "other" pattern. That said, you are allowed to leave the pattern
blank if you so choose. In the example above, the pattern for the third string could
easily have been written as ",one" instead of "other,one" and the result will be the same.

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: <code>string</code> - the formatted string  
**Throws**:

- "syntax error in choice format pattern: " if there is a syntax error


| Param | Type | Description |
| --- | --- | --- |
| argIndex | <code>\*</code> \| <code>Array.&lt;\*&gt;</code> | The index into the choice array of the current parameter, or an array of indices |
| params | <code>Object</code> | The hash of parameter values that replace the replacement variables in the string |


* * *

<a name="IString+at"></a>

### iString.at(offset) ⇒ [<code>IString</code>](#IString)
Same as String.at()

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: [<code>IString</code>](#IString) - the single UTF-16 code point located at the specified offset  

| Param | Type | Description |
| --- | --- | --- |
| offset | <code>number</code> | offset into the string |


* * *

<a name="IString+charAt"></a>

### iString.charAt(index) ⇒ [<code>IString</code>](#IString)
Same as String.charAt()

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: [<code>IString</code>](#IString) - the character at the given index  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | the index of the character being sought |


* * *

<a name="IString+charCodeAt"></a>

### iString.charCodeAt(index) ⇒ <code>number</code>
Same as String.charCodeAt(). This only reports on
2-byte UCS-2 Unicode values, and does not take into
account supplementary characters encoded in UTF-16.
If you would like to take account of those characters,
use codePointAt() instead.

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: <code>number</code> - the character code of the character at the
given index in the string  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | the index of the character being sought |


* * *

<a name="IString+codePointAt"></a>

### iString.codePointAt(index) ⇒ <code>number</code>
Return the code point at the given index when the string is viewed
as an array of code points. If the index is beyond the end of the
array of code points or if the index is negative, -1 is returned.

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: <code>number</code> - code point of the character at the given index into
the string  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | index of the code point |


* * *

<a name="IString+concat"></a>

### iString.concat(strings) ⇒ [<code>IString</code>](#IString)
Same as String.concat()

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: [<code>IString</code>](#IString) - a concatenation of the given strings  

| Param | Type | Description |
| --- | --- | --- |
| strings | <code>string</code> | strings to concatenate to the current one |


* * *

<a name="IString+endsWith"></a>

### iString.endsWith() ⇒ <code>boolean</code>
Same as String.endsWith().

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: <code>boolean</code> - true if the given characters are found at
the end of the string, and false otherwise  

* * *

<a name="IString+includes"></a>

### iString.includes(searchValue, start) ⇒ <code>boolean</code>
Same as String.includes()

**Kind**: instance method of [<code>IString</code>](#IString)  

| Param | Type | Description |
| --- | --- | --- |
| searchValue | <code>string</code> | string to search for |
| start | <code>number</code> | index into the string to start searching, or undefined to search the entire string |


* * *

<a name="IString+indexOf"></a>

### iString.indexOf(searchValue, start) ⇒ <code>number</code>
Same as String.indexOf()

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: <code>number</code> - index into the string of the string being sought,
or -1 if the string is not found  

| Param | Type | Description |
| --- | --- | --- |
| searchValue | <code>string</code> | string to search for |
| start | <code>number</code> | index into the string to start searching, or undefined to search the entire string |


* * *

<a name="IString+lastIndexOf"></a>

### iString.lastIndexOf(searchValue, start) ⇒ <code>number</code>
Same as String.lastIndexOf()

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: <code>number</code> - index into the string of the string being sought,
or -1 if the string is not found  

| Param | Type | Description |
| --- | --- | --- |
| searchValue | <code>string</code> | string to search for |
| start | <code>number</code> | index into the string to start searching, or undefined to search the entire string |


* * *

<a name="IString+localeCompare"></a>

### iString.localeCompare(compareString, [locales], [options])
Same as String.localeCompare()

**Kind**: instance method of [<code>IString</code>](#IString)  

| Param | Type |
| --- | --- |
| compareString | <code>String</code> | 
| [locales] | <code>String</code> | 
| [options] | <code>Object</code> | 


* * *

<a name="IString+match"></a>

### iString.match(regexp) ⇒ <code>Array.&lt;string&gt;</code>
Same as String.match()

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: <code>Array.&lt;string&gt;</code> - an array of matches  

| Param | Type | Description |
| --- | --- | --- |
| regexp | <code>string</code> | the regular expression to match |


* * *

<a name="IString+matchAll"></a>

### iString.matchAll(regexp) ⇒ <code>iterator</code>
Same as String.matchAll()

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: <code>iterator</code> - an iterator of the matches  

| Param | Type | Description |
| --- | --- | --- |
| regexp | <code>string</code> | the regular expression to match |


* * *

<a name="IString+normalize"></a>

### iString.normalize(form) ⇒ [<code>IString</code>](#IString)
Same as String.normalize(). If this JS engine does not support
this method, then you can use the NormString class of ilib
to the same thing (albeit a little slower).

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: [<code>IString</code>](#IString) - the normalize version of the string  

| Param | Type | Description |
| --- | --- | --- |
| form | <code>String</code> | the name of the Unicode Normalization Form |


* * *

<a name="IString+padEnd"></a>

### iString.padEnd() ⇒ [<code>IString</code>](#IString)
Same as String.padEnd().

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: [<code>IString</code>](#IString) - a string of the specified length with the
pad string applied at the end of the current string  

* * *

<a name="IString+padStart"></a>

### iString.padStart() ⇒ [<code>IString</code>](#IString)
Same as String.padStart().

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: [<code>IString</code>](#IString) - a string of the specified length with the
pad string applied at the end of the current string  

* * *

<a name="IString+repeat"></a>

### iString.repeat() ⇒ [<code>IString</code>](#IString)
Same as String.repeat().

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: [<code>IString</code>](#IString) - a new string containing the specified number
of copies of the given string  

* * *

<a name="IString+replace"></a>

### iString.replace(searchValue, newValue) ⇒ [<code>IString</code>](#IString)
Same as String.replace()

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: [<code>IString</code>](#IString) - a new string with all the matches replaced
with the new value  

| Param | Type | Description |
| --- | --- | --- |
| searchValue | <code>string</code> | a regular expression to search for |
| newValue | <code>string</code> | the string to replace the matches with |


* * *

<a name="IString+replaceAll"></a>

### iString.replaceAll(searchValue, newValue) ⇒ [<code>IString</code>](#IString)
Same as String.replaceAll()

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: [<code>IString</code>](#IString) - a new string with all the matches replaced
with the new value  

| Param | Type | Description |
| --- | --- | --- |
| searchValue | <code>string</code> | a regular expression to search for |
| newValue | <code>string</code> | the string to replace the matches with |


* * *

<a name="IString+search"></a>

### iString.search(regexp) ⇒ <code>number</code>
Same as String.search()

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: <code>number</code> - position of the match, or -1 for no match  

| Param | Type | Description |
| --- | --- | --- |
| regexp | <code>string</code> | the regular expression to search for |


* * *

<a name="IString+slice"></a>

### iString.slice(start, end) ⇒ [<code>IString</code>](#IString)
Same as String.slice()

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: [<code>IString</code>](#IString) - a slice of the current string  

| Param | Type | Description |
| --- | --- | --- |
| start | <code>number</code> | first character to include in the string |
| end | <code>number</code> | include all characters up to, but not including the end character |


* * *

<a name="IString+split"></a>

### iString.split(separator, limit) ⇒ <code>Array.&lt;string&gt;</code>
Same as String.split()

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: <code>Array.&lt;string&gt;</code> - the parts of the current string split
by the separator  

| Param | Type | Description |
| --- | --- | --- |
| separator | <code>string</code> | regular expression to match to find separations between the parts of the text |
| limit | <code>number</code> | maximum number of items in the final output array. Any items beyond that limit will be ignored. |


* * *

<a name="IString+startsWith"></a>

### iString.startsWith() ⇒ <code>boolean</code>
Same as String.startsWith().

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: <code>boolean</code> - true if the given characters are found at
the beginning of the string, and false otherwise  

* * *

<a name="IString+substr"></a>

### iString.substr(start, length) ⇒ [<code>IString</code>](#IString)
Same as String.substr()

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: [<code>IString</code>](#IString) - the requested substring  

| Param | Type | Description |
| --- | --- | --- |
| start | <code>number</code> | the index of the character that should begin the returned substring |
| length | <code>number</code> | the number of characters to return after the start character. |


* * *

<a name="IString+substring"></a>

### iString.substring(from, to) ⇒ [<code>IString</code>](#IString)
Same as String.substring()

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: [<code>IString</code>](#IString) - the requested substring  

| Param | Type | Description |
| --- | --- | --- |
| from | <code>number</code> | the index of the character that should begin the returned substring |
| to | <code>number</code> | the index where to stop the extraction. If omitted, extracts the rest of the string |


* * *

<a name="IString+toLocaleLowerCase"></a>

### iString.toLocaleLowerCase() ⇒ [<code>IString</code>](#IString)
Same as String.toLocaleLowerCase(). If the JS engine does not support this
method, you can use the ilib CaseMapper class instead.

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: [<code>IString</code>](#IString) - a new string representing the calling string
converted to lower case, according to any locale-sensitive
case mappings  

* * *

<a name="IString+toLocaleUpperCase"></a>

### iString.toLocaleUpperCase() ⇒ [<code>IString</code>](#IString)
Same as String.toLocaleUpperCase(). If the JS engine does not support this
method, you can use the ilib CaseMapper class instead.

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: [<code>IString</code>](#IString) - a new string representing the calling string
converted to upper case, according to any locale-sensitive
case mappings  

* * *

<a name="IString+toLowerCase"></a>

### iString.toLowerCase() ⇒ [<code>IString</code>](#IString)
Same as String.toLowerCase(). Note that this method is
not locale-sensitive.

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: [<code>IString</code>](#IString) - a string with all the characters
lower-cased  

* * *

<a name="IString+toString"></a>

### iString.toString() ⇒ <code>string</code>
Same as String.toString()

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: <code>string</code> - this instance as regular Javascript string  

* * *

<a name="IString+toUpperCase"></a>

### iString.toUpperCase() ⇒ [<code>IString</code>](#IString)
Same as String.toUpperCase(). Note that this method is
not locale-sensitive. Use toLocaleUpperCase() instead
to get locale-sensitive behaviour.

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: [<code>IString</code>](#IString) - a string with all the characters
upper-cased  

* * *

<a name="IString+trim"></a>

### iString.trim() ⇒ [<code>IString</code>](#IString)
Same as String.trim().

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: [<code>IString</code>](#IString) - a new string representing the calling string stripped
of whitespace from both ends.  

* * *

<a name="IString+trimEnd"></a>

### iString.trimEnd() ⇒ [<code>IString</code>](#IString)
Same as String.trimEnd().

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: [<code>IString</code>](#IString) - a new string representing the calling string stripped
of whitespace from its (right) end.  

* * *

<a name="IString+trimStart"></a>

### iString.trimStart() ⇒ [<code>IString</code>](#IString)
Same as String.trimStart().

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: [<code>IString</code>](#IString) - A new string representing the calling string stripped
of whitespace from its beginning (left end).  

* * *

<a name="IString+valueOf"></a>

### iString.valueOf() ⇒ <code>string</code>
Same as String.valueOf()

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: <code>string</code> - this instance as a regular Javascript string  

* * *

<a name="IString+trimRight"></a>

### iString.trimRight() ⇒ [<code>IString</code>](#IString)
Same as String.trimRight().

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: [<code>IString</code>](#IString) - a new string representing the calling string stripped
of whitespace from its (right) end.  

* * *

<a name="IString+trimLeft"></a>

### iString.trimLeft() ⇒ [<code>IString</code>](#IString)
Same as String.trimLeft().

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: [<code>IString</code>](#IString) - A new string representing the calling string stripped
of whitespace from its beginning (left end).  

* * *

<a name="IString+forEach"></a>

### iString.forEach(callback)
Call the callback with each character in the string one at
a time, taking care to step through the surrogate pairs in
the UTF-16 encoding properly.<p>

The standard Javascript String's charAt() method only
returns a particular 16-bit character in the
UTF-16 encoding scheme.
If the index to charAt() is pointing to a low- or
high-surrogate character,
it will return the surrogate character rather
than the the character
in the supplementary planes that the two surrogates together
encode. This function will call the callback with the full
character, making sure to join two
surrogates into one character in the supplementary planes
where necessary.<p>

**Kind**: instance method of [<code>IString</code>](#IString)  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | a callback function to call with each full character in the current string |


* * *

<a name="IString+forEachCodePoint"></a>

### iString.forEachCodePoint(callback)
Call the callback with each numeric code point in the string one at
a time, taking care to step through the surrogate pairs in
the UTF-16 encoding properly.<p>

The standard Javascript String's charCodeAt() method only
returns information about a particular 16-bit character in the
UTF-16 encoding scheme.
If the index to charCodeAt() is pointing to a low- or
high-surrogate character,
it will return the code point of the surrogate character rather
than the code point of the character
in the supplementary planes that the two surrogates together
encode. This function will call the callback with the full
code point of each character, making sure to join two
surrogates into one code point in the supplementary planes.<p>

**Kind**: instance method of [<code>IString</code>](#IString)  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | a callback function to call with each code point in the current string |


* * *

<a name="IString+iterator"></a>

### iString.iterator() ⇒ <code>Object</code>
Return an iterator that will step through all of the characters
in the string one at a time and return their code points, taking
care to step through the surrogate pairs in UTF-16 encoding
properly.<p>

The standard Javascript String's charCodeAt() method only
returns information about a particular 16-bit character in the
UTF-16 encoding scheme.
If the index is pointing to a low- or high-surrogate character,
it will return a code point of the surrogate character rather
than the code point of the character
in the supplementary planes that the two surrogates together
encode.<p>

The iterator instance returned has two methods, hasNext() which
returns true if the iterator has more code points to iterate through,
and next() which returns the next code point as a number.<p>

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: <code>Object</code> - an iterator
that iterates through all the code points in the string  

* * *

<a name="IString+charIterator"></a>

### iString.charIterator() ⇒ <code>Object</code>
Return an iterator that will step through all of the characters
in the string one at a time, taking
care to step through the surrogate pairs in UTF-16 encoding
properly.<p>

The standard Javascript String's charAt() method only
returns information about a particular 16-bit character in the
UTF-16 encoding scheme.
If the index is pointing to a low- or high-surrogate character,
it will return that surrogate character rather
than the surrogate pair which represents a character
in the supplementary planes.<p>

The iterator instance returned has two methods, hasNext() which
returns true if the iterator has more characters to iterate through,
and next() which returns the next character.<p>

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: <code>Object</code> - an iterator
that iterates through all the characters in the string  

* * *

<a name="IString+getLocale"></a>

### iString.getLocale() ⇒ <code>string</code>
Return the locale to use when processing choice formats. The locale
affects how number classes are interpretted. In some cultures,
the limit "few" maps to "any integer that ends in the digits 2 to 9" and
in yet others, "few" maps to "any integer that ends in the digits
3 or 4".

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: <code>string</code> - localespec to use when processing choice
formats with this string  

* * *

<a name="IString+codePointLength"></a>

### iString.codePointLength() ⇒ <code>number</code>
Return the number of code points in this string. This may be different
than the number of characters, as the UTF-16 encoding that Javascript
uses for its basis returns surrogate pairs separately. Two 2-byte
surrogate characters together make up one character/code point in
the supplementary character planes. If your string contains no
characters in the supplementary planes, this method will return the
same thing as the length() method.

**Kind**: instance method of [<code>IString</code>](#IString)  
**Returns**: <code>number</code> - the number of code points in this string  

* * *

<a name="IString.create"></a>

### IString.create(locale, options) ⇒ <code>Promise</code>
Factory method to create a new instance of IString asynchronously.
The parameters are the same as for the constructor, but it returns
a `Promise` instead of the instance directly.

**Kind**: static method of [<code>IString</code>](#IString)  
**Returns**: <code>Promise</code> - a promise to load a LocaleInfo instance. The resolved
value of the promise is the new instance of LocaleInfo,  

| Param | Type | Description |
| --- | --- | --- |
| locale | <code>string</code> | the locale to get the info for |
| options | <code>Object</code> | the same objects you would send to a constructor |


* * *

<a name="IString.isSurrogate"></a>

### IString.isSurrogate(ch) ⇒ <code>boolean</code>
Return true if the given character is a Unicode surrogate character,
either high or low.

**Kind**: static method of [<code>IString</code>](#IString)  
**Returns**: <code>boolean</code> - true if the character is a surrogate  

| Param | Type | Description |
| --- | --- | --- |
| ch | <code>string</code> | character to check |


* * *

<a name="IString.fromCodePoint"></a>

### IString.fromCodePoint(codepoint) ⇒ <code>string</code>
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

**Kind**: static method of [<code>IString</code>](#IString)  
**Returns**: <code>string</code> - a string containing the character represented by the codepoint  

| Param | Type | Description |
| --- | --- | --- |
| codepoint | <code>number</code> | UCS-4 code point to convert to a character |


* * *

<a name="IString.toCodePoint"></a>

### IString.toCodePoint(str, index) ⇒ <code>number</code>
Convert the character or the surrogate pair at the given
index into the intrinsic Javascript string to a Unicode
UCS-4 code point.

**Kind**: static method of [<code>IString</code>](#IString)  
**Returns**: <code>number</code> - code point of the character at the
given index into the string  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | string to get the code point from |
| index | <code>number</code> | index into the string |


* * *

<a name="IString.@@Iterator"></a>

### IString.@@Iterator()
Implement the iterator protocol over the characters in the string
as a generator function. This allows an IString to be used with
the for..of operator:

<pre>
const s = new IString("test");
for (let ch of s) {
    console.log(ch);
}
// prints:
// t
// e
// s
// t
</pre>

It can also be used with the spread operator:
<pre>
const s = new IString("test");
console.log(`Chars are ${...s}`);
// prints:
// Chars are ['t','e','s','t']
</pre>

This iterator properly skips over UTF-16 surrogate pairs and
return the "astral plane" Unicode characters.

**Kind**: static method of [<code>IString</code>](#IString)  

* * *

