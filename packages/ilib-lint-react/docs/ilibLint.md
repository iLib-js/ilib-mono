## Classes

<dl>
<dt><a href="#FlowParser">FlowParser</a></dt>
<dd><p>Parser for Javascript files based on the Babel parser. This
parser can parse Javascript with flow types and with React JSX
elements. It can also parse regular Javascript with flow without
any React JSX in it. By default, this parser will parse .js and
.jsx files. If you put your javascript with flow in a file with a
different file name extension, you can use the name &quot;FlowParser&quot;
in your filetype parsers array to use this parser.</p>
</dd>
<dt><a href="#JSParser">JSParser</a></dt>
<dd><p>Parser for Javascript files based on the Babel parser.
By default, this parser will parse .js files. If you put your
javascript in a file with a different file name extension, you
can use the name &quot;JSParser&quot; in your filetype parsers array to
use this parser.</p>
</dd>
<dt><a href="#JSXParser">JSXParser</a></dt>
<dd><p>Parser for Javascript files that may contain React JSX elements,
based on the the Babel parser. By default, this parser will parse
.jsx files. If you put your JSX in a file with a different file name
extension, you can use the name &quot;JSXParser&quot; in your filetype parsers array
to use this parser.</p>
</dd>
<dt><a href="#PropertiesParser">PropertiesParser</a></dt>
<dd><p>Parser for Java style properties files. By default, this parser
will parse .properties files. If you put your properties in a file with
a different file name extension, you can use the name &quot;PropertiesParser&quot;
in your filetype parsers array to use this parser. N.B. This parser does
not parse new-style xml properties files, only the older &quot;a = b&quot; style.</p>
</dd>
<dt><a href="#TSXParser">TSXParser</a></dt>
<dd><p>Parser For Typescript files based on the Babel parser.
This parser can parse any Typescript file with or without React
JSX elements in it. By default, this parser will parse .ts and
.tsx files. If you put your typescript in a file with a different
file name extension, you can use the name &quot;TSXParser&quot; in your
filetype parsers array to use this parser.</p>
</dd>
<dt><a href="#FormatjsPlurals">FormatjsPlurals</a></dt>
<dd><p>Represent an ilib-lint rule.</p>
</dd>
</dl>

<a name="FlowParser"></a>

## FlowParser
Parser for Javascript files based on the Babel parser. This
parser can parse Javascript with flow types and with React JSX
elements. It can also parse regular Javascript with flow without
any React JSX in it. By default, this parser will parse .js and
.jsx files. If you put your javascript with flow in a file with a
different file name extension, you can use the name "FlowParser"
in your filetype parsers array to use this parser.

**Kind**: global class  

* [FlowParser](#FlowParser)
    * [new FlowParser()](#new_FlowParser_new)
    * [.parse()](#FlowParser+parse) ⇒ <code>Array.&lt;IntermediateRepresentation&gt;</code>


* * *

<a name="new_FlowParser_new"></a>

### new FlowParser()
Construct a new plugin.


* * *

<a name="FlowParser+parse"></a>

### flowParser.parse() ⇒ <code>Array.&lt;IntermediateRepresentation&gt;</code>
Parse the current file into an intermediate representation.

**Kind**: instance method of [<code>FlowParser</code>](#FlowParser)  
**Returns**: <code>Array.&lt;IntermediateRepresentation&gt;</code> - the AST representation
of the jsx file  

* * *

<a name="JSParser"></a>

## JSParser
Parser for Javascript files based on the Babel parser.
By default, this parser will parse .js files. If you put your
javascript in a file with a different file name extension, you
can use the name "JSParser" in your filetype parsers array to
use this parser.

**Kind**: global class  

* [JSParser](#JSParser)
    * [new JSParser()](#new_JSParser_new)
    * [.parse(sourceFile)](#JSParser+parse) ⇒ <code>Array.&lt;IntermediateRepresentation&gt;</code>


* * *

<a name="new_JSParser_new"></a>

### new JSParser()
Construct a new plugin.


* * *

<a name="JSParser+parse"></a>

### jsParser.parse(sourceFile) ⇒ <code>Array.&lt;IntermediateRepresentation&gt;</code>
Parse the current file into an intermediate representation.

**Kind**: instance method of [<code>JSParser</code>](#JSParser)  
**Returns**: <code>Array.&lt;IntermediateRepresentation&gt;</code> - the AST representation
of the jsx file  

| Param | Type | Description |
| --- | --- | --- |
| sourceFile | <code>SourceFile</code> | the source file to parse |


* * *

<a name="JSXParser"></a>

## JSXParser
Parser for Javascript files that may contain React JSX elements,
based on the the Babel parser. By default, this parser will parse
.jsx files. If you put your JSX in a file with a different file name
extension, you can use the name "JSXParser" in your filetype parsers array
to use this parser.

**Kind**: global class  

* [JSXParser](#JSXParser)
    * [new JSXParser()](#new_JSXParser_new)
    * [.parse(sourceFile)](#JSXParser+parse) ⇒ <code>Array.&lt;IntermediateRepresentation&gt;</code>


* * *

<a name="new_JSXParser_new"></a>

### new JSXParser()
Construct a new plugin.


* * *

<a name="JSXParser+parse"></a>

### jsxParser.parse(sourceFile) ⇒ <code>Array.&lt;IntermediateRepresentation&gt;</code>
Parse the current file into an intermediate representation.

**Kind**: instance method of [<code>JSXParser</code>](#JSXParser)  
**Returns**: <code>Array.&lt;IntermediateRepresentation&gt;</code> - the AST representation
of the jsx file  

| Param | Type | Description |
| --- | --- | --- |
| sourceFile | <code>SourceFile</code> | the source file to parse |


* * *

<a name="PropertiesParser"></a>

## PropertiesParser
Parser for Java style properties files. By default, this parser
will parse .properties files. If you put your properties in a file with
a different file name extension, you can use the name "PropertiesParser"
in your filetype parsers array to use this parser. N.B. This parser does
not parse new-style xml properties files, only the older "a = b" style.

**Kind**: global class  

* [PropertiesParser](#PropertiesParser)
    * [new PropertiesParser()](#new_PropertiesParser_new)
    * [.parse(sourceFile)](#PropertiesParser+parse) ⇒ <code>Array.&lt;IntermediateRepresentation&gt;</code>


* * *

<a name="new_PropertiesParser_new"></a>

### new PropertiesParser()
Construct a new plugin.


* * *

<a name="PropertiesParser+parse"></a>

### propertiesParser.parse(sourceFile) ⇒ <code>Array.&lt;IntermediateRepresentation&gt;</code>
Parse the current file into an intermediate representation. If the
file is a target (translation) file, then also attempt to read the
source locale file in order to get complete resources.

**Kind**: instance method of [<code>PropertiesParser</code>](#PropertiesParser)  
**Returns**: <code>Array.&lt;IntermediateRepresentation&gt;</code> - the AST representation
of the properties file  

| Param | Type | Description |
| --- | --- | --- |
| sourceFile | <code>SourceFile</code> | the source file to parse |


* * *

<a name="TSXParser"></a>

## TSXParser
Parser For Typescript files based on the Babel parser.
This parser can parse any Typescript file with or without React
JSX elements in it. By default, this parser will parse .ts and
.tsx files. If you put your typescript in a file with a different
file name extension, you can use the name "TSXParser" in your
filetype parsers array to use this parser.

**Kind**: global class  

* [TSXParser](#TSXParser)
    * [new TSXParser()](#new_TSXParser_new)
    * [.name](#TSXParser+name)
    * [.description](#TSXParser+description)
    * [.extensions](#TSXParser+extensions)
    * [.type](#TSXParser+type)
    * [.parse()](#TSXParser+parse)


* * *

<a name="new_TSXParser_new"></a>

### new TSXParser()
Construct a new plugin.


* * *

<a name="TSXParser+name"></a>

### tsxParser.name
**Kind**: instance property of [<code>TSXParser</code>](#TSXParser)  
**Read only**: true  

* * *

<a name="TSXParser+description"></a>

### tsxParser.description
**Kind**: instance property of [<code>TSXParser</code>](#TSXParser)  
**Read only**: true  

* * *

<a name="TSXParser+extensions"></a>

### tsxParser.extensions
**Kind**: instance property of [<code>TSXParser</code>](#TSXParser)  
**Read only**: true  

* * *

<a name="TSXParser+type"></a>

### tsxParser.type
**Kind**: instance property of [<code>TSXParser</code>](#TSXParser)  
**Read only**: true  

* * *

<a name="TSXParser+parse"></a>

### tsxParser.parse()
**Kind**: instance method of [<code>TSXParser</code>](#TSXParser)  

* * *

<a name="FormatjsPlurals"></a>

## FormatjsPlurals
Represent an ilib-lint rule.

**Kind**: global class  

* [FormatjsPlurals](#FormatjsPlurals)
    * [new FormatjsPlurals()](#new_FormatjsPlurals_new)
    * [.match()](#FormatjsPlurals+match)


* * *

<a name="new_FormatjsPlurals_new"></a>

### new FormatjsPlurals()
Make a new rule instance.


* * *

<a name="FormatjsPlurals+match"></a>

### formatjsPlurals.match()
**Kind**: instance method of [<code>FormatjsPlurals</code>](#FormatjsPlurals)  

* * *

