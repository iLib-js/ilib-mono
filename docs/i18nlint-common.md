## Classes

<dl>
<dt><a href="#Formatter">Formatter</a></dt>
<dd><p>Represent an output formatter</p>
</dd>
<dt><a href="#Parser">Parser</a></dt>
<dd><p>common SPI for parser plugins</p>
</dd>
<dt><a href="#Plugin">Plugin</a></dt>
<dd><p>common SPI that all plugins must implement</p>
</dd>
<dt><a href="#Result">Result</a></dt>
<dd><p>Represent an i18nlint rule check result</p>
</dd>
<dt><a href="#Rule">Rule</a></dt>
<dd><p>Represent an i18nlint rule.</p>
</dd>
</dl>

<a name="Formatter"></a>

## *Formatter*
Represent an output formatter

**Kind**: global abstract class  

* *[Formatter](#Formatter)*
    * *[new Formatter()](#new_Formatter_new)*
    * *[.getName()](#Formatter+getName) ⇒ <code>String</code>*
    * *[.getDescription()](#Formatter+getDescription) ⇒ <code>String</code>*
    * **[.format(result)](#Formatter+format) ⇒ <code>String</code>**


* * *

<a name="new_Formatter_new"></a>

### *new Formatter()*
Construct an formatter instance. Formatters and formatter plugins
should implement this abstract class.


* * *

<a name="Formatter+getName"></a>

### *formatter.getName() ⇒ <code>String</code>*
Get the name of the formatter. This should be a unique string.

**Kind**: instance method of [<code>Formatter</code>](#Formatter)  
**Returns**: <code>String</code> - the name of this formatter  

* * *

<a name="Formatter+getDescription"></a>

### *formatter.getDescription() ⇒ <code>String</code>*
Return a general description of the formatter for use in help output.

**Kind**: instance method of [<code>Formatter</code>](#Formatter)  
**Returns**: <code>String</code> - a general description of the formatter  

* * *

<a name="Formatter+format"></a>

### **formatter.format(result) ⇒ <code>String</code>**
Format the given result with the current formatter and return the
formatted string.

**Kind**: instance abstract method of [<code>Formatter</code>](#Formatter)  
**Returns**: <code>String</code> - the formatted result  

| Param | Type | Description |
| --- | --- | --- |
| result | [<code>Result</code>](#Result) | the result to format |


* * *

<a name="Parser"></a>

## *Parser*
common SPI for parser plugins

**Kind**: global abstract class  

* *[Parser](#Parser)*
    * *[new Parser()](#new_Parser_new)*
    * **[.init()](#Parser+init)**
    * *[.parse()](#Parser+parse)*
    * *[.getResources()](#Parser+getResources) ⇒ <code>Array.&lt;Resource&gt;</code>*


* * *

<a name="new_Parser_new"></a>

### *new Parser()*
Construct a new plugin.


* * *

<a name="Parser+init"></a>

### **parser.init()**
Initialize the current plugin,

**Kind**: instance abstract method of [<code>Parser</code>](#Parser)  

* * *

<a name="Parser+parse"></a>

### *parser.parse()*
Parse the current file into an intermediate representation.

**Kind**: instance method of [<code>Parser</code>](#Parser)  

* * *

<a name="Parser+getResources"></a>

### *parser.getResources() ⇒ <code>Array.&lt;Resource&gt;</code>*
For a "resource" type of plugin, this returns a list of Resource instances
that result from parsing the file.

**Kind**: instance method of [<code>Parser</code>](#Parser)  
**Returns**: <code>Array.&lt;Resource&gt;</code> - list of Resource instances in this file  

* * *

<a name="Plugin"></a>

## *Plugin*
common SPI that all plugins must implement

**Kind**: global abstract class  

* *[Plugin](#Plugin)*
    * *[new Plugin()](#new_Plugin_new)*
    * **[.init()](#Plugin+init)**
    * **[.getType()](#Plugin+getType) ⇒ <code>String</code>**
    * *[.getExtensions()](#Plugin+getExtensions) ⇒ <code>Array.&lt;String&gt;</code>*
    * *[.getRules()](#Plugin+getRules) ⇒ [<code>Array.&lt;Rule&gt;</code>](#Rule)*
    * *[.getParsers()](#Plugin+getParsers) ⇒ [<code>Array.&lt;Parser&gt;</code>](#Parser)*
    * *[.getFormatters()](#Plugin+getFormatters) ⇒ [<code>Array.&lt;Formatter&gt;</code>](#Formatter)*


* * *

<a name="new_Plugin_new"></a>

### *new Plugin()*
Construct a new plugin.


* * *

<a name="Plugin+init"></a>

### **plugin.init()**
Initialize the current plugin,

**Kind**: instance abstract method of [<code>Plugin</code>](#Plugin)  

* * *

<a name="Plugin+getType"></a>

### **plugin.getType() ⇒ <code>String</code>**
Return the type of this plugin. This can be one of the
following:

<ul>
<li>rule - this plugin implements a new rules
<li>parser - this plugin knows how to parse files more deeply
than line-by-line
<li>formatter - this plugin formats results for a particular
type of output
</ul>

**Kind**: instance abstract method of [<code>Plugin</code>](#Plugin)  
**Returns**: <code>String</code> - tells what type of plugin this is  

* * *

<a name="Plugin+getExtensions"></a>

### *plugin.getExtensions() ⇒ <code>Array.&lt;String&gt;</code>*
Return the list of extensions of the files that this parser handles.
The extensions are listed without the dot. eg. ["json", "jsn"]

**Kind**: instance method of [<code>Plugin</code>](#Plugin)  
**Returns**: <code>Array.&lt;String&gt;</code> - a list of file name extensions  

* * *

<a name="Plugin+getRules"></a>

### *plugin.getRules() ⇒ [<code>Array.&lt;Rule&gt;</code>](#Rule)*
For a "rule" type of plugin, this returns a list of Rule instances
that this plugin implements.

**Kind**: instance method of [<code>Plugin</code>](#Plugin)  
**Returns**: [<code>Array.&lt;Rule&gt;</code>](#Rule) - list of Rule instances implemented by this
plugin  

* * *

<a name="Plugin+getParsers"></a>

### *plugin.getParsers() ⇒ [<code>Array.&lt;Parser&gt;</code>](#Parser)*
For a "parser" type of plugin, this returns a list of Parser classes
that this plugin implements.

**Kind**: instance method of [<code>Plugin</code>](#Plugin)  
**Returns**: [<code>Array.&lt;Parser&gt;</code>](#Parser) - list of Parser classes implemented by this
plugin  

* * *

<a name="Plugin+getFormatters"></a>

### *plugin.getFormatters() ⇒ [<code>Array.&lt;Formatter&gt;</code>](#Formatter)*
For a "formatter" type of plugin, this returns a list of Formatter
instances that this plugin implements.

**Kind**: instance method of [<code>Plugin</code>](#Plugin)  
**Returns**: [<code>Array.&lt;Formatter&gt;</code>](#Formatter) - list of Formatter instances implemented by this
plugin  

* * *

<a name="Result"></a>

## *Result*
Represent an i18nlint rule check result

**Kind**: global abstract class  

* * *

<a name="new_Result_new"></a>

### *new Result(fields)*
Construct an i18nlint rule check result. Rules should return this
type when reporting issues in the source files. The fields can
contain any of the following properties:

- severity {String}: "warning" or "error" (required)
- description {String}: description of the problem in the source file
  (required)
- pathName {String}: name of the file that the issue was found in (required)
- rule {Rule}: the rule that generated this issue (required)
- id {String}: key of a resource being checked
- source {String}: for resource problems, this is the original source string
- highlight {String}: highlighted text from the source file indicating
  where the issue was. For resources, this is either the source or target
  string, where-ever the problem occurred
- lineNumber {Number}: line number in the source fie where the issue
  was found
- locale {String}: locale of associated with this issue

Only the severity, description, pathName, and rule are required. All other
properties are optional.


| Param | Type | Description |
| --- | --- | --- |
| fields | <code>Object</code> | result fields |


* * *

<a name="Rule"></a>

## *Rule*
Represent an i18nlint rule.

**Kind**: global abstract class  

* *[Rule](#Rule)*
    * *[new Rule()](#new_Rule_new)*
    * *[.getName()](#Rule+getName) ⇒ <code>String</code>*
    * *[.getDescription()](#Rule+getDescription) ⇒ <code>String</code>*
    * *[.getRuleType()](#Rule+getRuleType) ⇒ <code>String</code>*
    * *[.match(options)](#Rule+match) ⇒ [<code>Result</code>](#Result) \| [<code>Array.&lt;Result&gt;</code>](#Result) \| <code>undefined</code>*


* * *

<a name="new_Rule_new"></a>

### *new Rule()*
Construct an i18nlint rule. Rules in plugins should implement this
abstract class.


* * *

<a name="Rule+getName"></a>

### *rule.getName() ⇒ <code>String</code>*
Get the name of the rule. This should be a string with a dash-separated
set of words (kebab or dash case). Example: "resource-match-whitespace"

**Kind**: instance method of [<code>Rule</code>](#Rule)  
**Returns**: <code>String</code> - the name of this rule  

* * *

<a name="Rule+getDescription"></a>

### *rule.getDescription() ⇒ <code>String</code>*
Return a general description of the type of problems that this rule is
testing for. This description is not related to particular matches, so
it cannot be more specific. Examples:

"translation should use the appropriate quote style"
"parameters to the translation wrapper function must not be concatenated"
"translation should match the whitespace of the source string"

**Kind**: instance method of [<code>Rule</code>](#Rule)  
**Returns**: <code>String</code> - a general description of the type of problems that this rule is
testing for  

* * *

<a name="Rule+getRuleType"></a>

### *rule.getRuleType() ⇒ <code>String</code>*
Return the type of this rule. Rules can be organized into the following
types:

- A resource rule. This checks a translated resource with a source string
  and a translation to a given locale. eg. a rule that checks that
  substitution parameters that exist in the source string also are
  given in the target string.
- A line rule. This rule checks single lines of a file. eg. a rule to
  check the parameters to a function call.
- A multiline rule. This rule checks multiple lines at once to find
  problems that may span multiple lines. For example, a rule to enforce
  a policy that all translatable strings in a source file have an appropriate
  translator's comment on them.
- A multifile rule. This rule checks problems across multiple files. eg.
  a rule to check that ids for translatable strings are unique across all
  files.

**Kind**: instance method of [<code>Rule</code>](#Rule)  
**Returns**: <code>String</code> - a string with either "resource", "line", "multiline", or
"multifile".  

* * *

<a name="Rule+match"></a>

### *rule.match(options) ⇒ [<code>Result</code>](#Result) \| [<code>Array.&lt;Result&gt;</code>](#Result) \| <code>undefined</code>*
Return whether or not this rule matches the input. The options object can
contain any of the following properties:

<ul>
<li>locale - the locale against which this rule should be checked. Some rules
are locale-sensitive, others not.
<li>resource - the resource to test this rule against. For resource rules, this
is a required property.
<li>line - a single line of a file to test this rule against (for line rules)
<li>lines - all the lines of a file to test this rule against (for multiline rules
and multifile rules)
<li>pathName - the name of the current file being matched in multifile rules.
<li>parameters - (optional) parameters for this rule from the configuration file
</ul>

The return value from this method when a rule matches is an object with the
following properties:

<ul>
<li>severity - the severity of this match. This can be one of the following:
  <ul>
  <li>suggestion - a suggestion of a better way to do things. The current way is
  not incorrect, but probably not optimal
  <li>warning - a problem that should be fixed, but which does not prevent
  your app from operating internationally. This is more severe than a suggestion.
  <li>error - a problem that must be fixed. This type of problem will prevent
  your app from operating properly internationally and could possibly even
  crash your app in some cases.
  </ul>
<li>description - a description of the problem to display to the user. In order
to make the i18nlint output useful, this description should attempt to make the
following things clear:
  <ul>
  <li>What part is wrong
  <li>Why it is wrong
  <li>Suggestions on how to fix it
  </ul>
<li>lineNumber - the line number where the match occurred in multiline rules
<li>highlight - the line where the problem occurred, highlighted with XML syntax
(see below)
</ul>

For the `highlight` property, the line that has a problem is reproduced with
XML tags around the problem part, if it is known. The tags are of the form
&lt;eX&gt; where X is a digit starting with 0 and progressing to 9 for each
subsequent problem. If the file type is XML already, the rest of the line will
be XML-escaped first.<p>

Example:<p>

"const str = rb.getString(<e0>id</e0>);"<p>

In this rule, `getString()` must be called with a static string in order for the
loctool to be able to extract that string. The line above calls `getString()`
with a variable named "id" as a parameter. The variable is highlighted with the
e0 tag. Callers can then translate the open and close tags appropriately for
the output device, such as ASCII escapes for a regular terminal, or HTML tags
for a web-based device.

**Kind**: instance method of [<code>Rule</code>](#Rule)  
**Returns**: [<code>Result</code>](#Result) \| [<code>Array.&lt;Result&gt;</code>](#Result) \| <code>undefined</code> - an object describing the problem if the rule
does match for this locale, or an array of such Objects if there are multiple
problems with the same input, or undefined if the rule does not match  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | The options object as per the description above |


* * *

