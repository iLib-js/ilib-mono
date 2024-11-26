## Functions

<dl>
<dt><a href="#create">create(translated, source)</a> ⇒ <code>MessageAccumulator</code></dt>
<dd><p>Factory method to create a new MessageAccumulator instance from
the given string and a source message accumulator. This will
parse the string and create the equivalent tree from it, and
then attach the &quot;extra&quot; information from the source accumulator
to the equivalent nodes in the new accumulator. This includes
the source information for components and replacement parameters.</p>
</dd>
<dt><a href="#addText">addText(text)</a></dt>
<dd><p>Add text to the current context of the string.</p>
</dd>
<dt><a href="#addParam">addParam(extra)</a></dt>
<dd><p>Add a replacement parameter to the string. This is a coding
for a replacement parameter in the programming language
or i18n library that does substitutions. By coding the replacement
parameters instead of leaving them in as-is, the strings are
normalized.<p></p>
<p>This has two advantages. First, translations for strings
with the same text but different replacement parameter styles
can be shared across i18n libraries. For
example, some libraries use &quot;C&quot; style parameters like &quot;%1s&quot;
and others use named parameters like &quot;{name}&quot;. That means
the translation of &quot;User %1s logged in.&quot; and of &quot;User {name}
logged in.&quot; should have the exact same translation.<p></p>
<p>Second, the parameters can be numbered automatically so that
the translator has the freedom to re-arrange the parameters
in a string with multiple parameters as required by the
grammar of the target language. For some parameter styles
that use numbered parameters instead of named ones, the
caller may need to amend original parameter to insert the
number if the original code did not have it already. That
is bad style anyways and you should strongly discourage your
engineers from writing strings with multiple replacement
parameters that are unnumbered.<p></p>
<p>Parameters appear in the composed string as XML tags that
are distinct from the component tags. When creating a
translated string, the parameters are substituted back
into the string.</p>
</dd>
<dt><a href="#push">push(extra, keep)</a></dt>
<dd><p>Create a new subcontext for a component such that all text
added to the accumulator goes into the new context.<p></p>
<p>A component is represented in the composed string as an
XML tag that is numbered according to the order of the
components in the string. This class maintains a mapping
between the component number and the given &quot;extra&quot;
information so that this can be used to create a translated
accumulator with the same extra info. (See the
MessageAccumulator.create static function.)</p>
</dd>
<dt><a href="#pop">pop()</a> ⇒ <code>Object</code> | <code>undefined</code></dt>
<dd><p>Pop the current context from the stack and return to the previous
context. If the current context is already the root, then this
represents an unbalanced string.</p>
</dd>
<dt><a href="#getString">getString()</a> ⇒ <code>string</code></dt>
<dd><p>Return the message accumulated so far, including any components
as a string that contains &quot;c&quot; + a number to represent those
components.</p>
</dd>
<dt><a href="#getPrefix">getPrefix()</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Return all of the irrelevant parts of the string at the beginning
of the message.<p></p>
<p>For a minimal string, all of the components that are irrelevant
for translation are removed. This method returns all of the irrelevant
components and text units that appear at the beginning of the string.</p>
</dd>
<dt><a href="#getMinimalString">getMinimalString()</a> ⇒ <code>string</code></dt>
<dd><p>Return the message accumulated so far as a string, including
any components, and leaving out any contexts that are irrelevant
for translation purposes. This method is similar to getString()
with the irrelevant parts removed. This includes:</p>
<ul>
<li>Any components that surround the entire message
<li>Any components that are at the beginning or end of the message
and which do not have any translatable text in them.
<li>Any text at the beginning or end of the string that only
contains whitespace.
</ul>

<p>A minimal string must either start with non-whitespace text or end with
non-whitespace text or both.<p></p>
<p>After all the irrelevant parts are removed, the remaining components
are renumbered so that the first one to appear starts at zero, the
second one is one, etc.</p>
</dd>
<dt><a href="#getSuffix">getSuffix()</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Return all of the irrelevant parts of the string at the end
of the message.<p></p>
<p>For a minimal string, all of the components that are irrelevant
for translation are removed. This method returns all of the irrelevant
components and text units that appear at the end of the string.</p>
</dd>
<dt><a href="#getTextLength">getTextLength()</a> ⇒ <code>number</code></dt>
<dd><p>Return the number of characters of non-whitespace text that
have been accumulated so far in this accumulator. Components
are left out.</p>
</dd>
<dt><a href="#getCurrentLevel">getCurrentLevel()</a> ⇒ <code>number</code></dt>
<dd><p>Return the current depth of the context stack. If the accumulator is
currently at the root, it will return 0.</p>
</dd>
<dt><a href="#isRoot">isRoot()</a> ⇒ <code>boolean</code></dt>
<dd><p>Return true if the current context is the root of the message.</p>
</dd>
<dt><a href="#getExtra">getExtra(componentNumber)</a> ⇒ <code>Object</code></dt>
<dd><p>Return the mapping between components and the &quot;extra&quot;
information used when creating those components.</p>
</dd>
<dt><a href="#getParam">getParam(paramNumber)</a> ⇒ <code>Object</code></dt>
<dd><p>Return the mapping between a replacement parameter
and the &quot;extra&quot; information used when creating those
components.</p>
</dd>
<dt><a href="#getMapping">getMapping()</a> ⇒ <code>Object</code></dt>
<dd><p>Return the mappings between component names and
their &quot;extra&quot; information they represent.</p>
</dd>
</dl>

<a name="create"></a>

## create(translated, source) ⇒ <code>MessageAccumulator</code>
Factory method to create a new MessageAccumulator instance from
the given string and a source message accumulator. This will
parse the string and create the equivalent tree from it, and
then attach the "extra" information from the source accumulator
to the equivalent nodes in the new accumulator. This includes
the source information for components and replacement parameters.

**Kind**: global function  
**Returns**: <code>MessageAccumulator</code> - a new message accumulator
instance equivalent to the given string  

| Param | Type | Description |
| --- | --- | --- |
| translated | <code>String</code> | the translated string to parse |
| source | <code>MessageAccumulator</code> | the source message for this translation |


* * *

<a name="addText"></a>

## addText(text)
Add text to the current context of the string.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | the text to add |


* * *

<a name="addParam"></a>

## addParam(extra)
Add a replacement parameter to the string. This is a coding
for a replacement parameter in the programming language
or i18n library that does substitutions. By coding the replacement
parameters instead of leaving them in as-is, the strings are
normalized.<p>

This has two advantages. First, translations for strings
with the same text but different replacement parameter styles
can be shared across i18n libraries. For
example, some libraries use "C" style parameters like "%1s"
and others use named parameters like "{name}". That means
the translation of "User %1s logged in." and of "User {name}
logged in." should have the exact same translation.<p>

Second, the parameters can be numbered automatically so that
the translator has the freedom to re-arrange the parameters
in a string with multiple parameters as required by the
grammar of the target language. For some parameter styles
that use numbered parameters instead of named ones, the
caller may need to amend original parameter to insert the
number if the original code did not have it already. That
is bad style anyways and you should strongly discourage your
engineers from writing strings with multiple replacement
parameters that are unnumbered.<p>

Parameters appear in the composed string as XML tags that
are distinct from the component tags. When creating a
translated string, the parameters are substituted back
into the string.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| extra | <code>Object</code> | extra information that the caller can use to identify the original replacement parameter |


* * *

<a name="push"></a>

## push(extra, keep)
Create a new subcontext for a component such that all text
added to the accumulator goes into the new context.<p>

A component is represented in the composed string as an
XML tag that is numbered according to the order of the
components in the string. This class maintains a mapping
between the component number and the given "extra"
information so that this can be used to create a translated
accumulator with the same extra info. (See the
MessageAccumulator.create static function.)

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| extra | <code>Object</code> | extra information that the caller would like to associate with the component. For example, this may be a node in an AST from parsing the original text. |
| keep | <code>boolean</code> | true if this node should always be kept and not optimized out during the getMinimalString |


* * *

<a name="pop"></a>

## pop() ⇒ <code>Object</code> \| <code>undefined</code>
Pop the current context from the stack and return to the previous
context. If the current context is already the root, then this
represents an unbalanced string.

**Kind**: global function  
**Returns**: <code>Object</code> \| <code>undefined</code> - the extra information associated with the
context that is being popped, or undefined if we are already at the
root and there is nothing to pop  

* * *

<a name="getString"></a>

## getString() ⇒ <code>string</code>
Return the message accumulated so far, including any components
as a string that contains "c" + a number to represent those
components.

**Kind**: global function  
**Returns**: <code>string</code> - the accumulated string so far  

* * *

<a name="getPrefix"></a>

## getPrefix() ⇒ <code>Array.&lt;Object&gt;</code>
Return all of the irrelevant parts of the string at the beginning
of the message.<p>

For a minimal string, all of the components that are irrelevant
for translation are removed. This method returns all of the irrelevant
components and text units that appear at the beginning of the string.

**Kind**: global function  
**Returns**: <code>Array.&lt;Object&gt;</code> - an array of "extra" and text units that
are irrelevant  

* * *

<a name="getMinimalString"></a>

## getMinimalString() ⇒ <code>string</code>
Return the message accumulated so far as a string, including
any components, and leaving out any contexts that are irrelevant
for translation purposes. This method is similar to getString()
with the irrelevant parts removed. This includes:

<ul>
<li>Any components that surround the entire message
<li>Any components that are at the beginning or end of the message
and which do not have any translatable text in them.
<li>Any text at the beginning or end of the string that only
contains whitespace.
</ul>

A minimal string must either start with non-whitespace text or end with
non-whitespace text or both.<p>

After all the irrelevant parts are removed, the remaining components
are renumbered so that the first one to appear starts at zero, the
second one is one, etc.

**Kind**: global function  
**Returns**: <code>string</code> - the accumuilated string so far with all irrelevant
components removed.  

* * *

<a name="getSuffix"></a>

## getSuffix() ⇒ <code>Array.&lt;Object&gt;</code>
Return all of the irrelevant parts of the string at the end
of the message.<p>

For a minimal string, all of the components that are irrelevant
for translation are removed. This method returns all of the irrelevant
components and text units that appear at the end of the string.

**Kind**: global function  
**Returns**: <code>Array.&lt;Object&gt;</code> - an array of "extra" and text units that
are irrelevant  

* * *

<a name="getTextLength"></a>

## getTextLength() ⇒ <code>number</code>
Return the number of characters of non-whitespace text that
have been accumulated so far in this accumulator. Components
are left out.

**Kind**: global function  
**Returns**: <code>number</code> - the length of the non-whitespace text accumulated so far  

* * *

<a name="getCurrentLevel"></a>

## getCurrentLevel() ⇒ <code>number</code>
Return the current depth of the context stack. If the accumulator is
currently at the root, it will return 0.

**Kind**: global function  
**Returns**: <code>number</code> - the current depth of the context stack, or 0 if there
is nothing on the stack yet  

* * *

<a name="isRoot"></a>

## isRoot() ⇒ <code>boolean</code>
Return true if the current context is the root of the message.

**Kind**: global function  
**Returns**: <code>boolean</code> - true if the current context is the root  

* * *

<a name="getExtra"></a>

## getExtra(componentNumber) ⇒ <code>Object</code>
Return the mapping between components and the "extra"
information used when creating those components.

**Kind**: global function  
**Returns**: <code>Object</code> - the "extra" information that was
given when the component was created  

| Param | Type | Description |
| --- | --- | --- |
| componentNumber | <code>number</code> | the number of the component for which the "extra" information is being sought |


* * *

<a name="getParam"></a>

## getParam(paramNumber) ⇒ <code>Object</code>
Return the mapping between a replacement parameter
and the "extra" information used when creating those
components.

**Kind**: global function  
**Returns**: <code>Object</code> - the "extra" information that was
given when the parameter was created  

| Param | Type | Description |
| --- | --- | --- |
| paramNumber | <code>number</code> | the number of the parameter for which the "extra" information is being sought |


* * *

<a name="getMapping"></a>

## getMapping() ⇒ <code>Object</code>
Return the mappings between component names and
their "extra" information they represent.

**Kind**: global function  
**Returns**: <code>Object</code> - the mapping between the
component names and their "extra" information.  

* * *

