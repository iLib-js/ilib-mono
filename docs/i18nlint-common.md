## Classes

<dl>
<dt><a href="#Formatter">Formatter</a></dt>
<dd><p>Represent an output formatter</p>
</dd>
<dt><a href="#IntermediateRepresentation">IntermediateRepresentation</a></dt>
<dd><p>Representation of parser results</p>
</dd>
<dt><a href="#Parser">Parser</a></dt>
<dd><p>common SPI for parser plugins</p>
</dd>
<dt><a href="#Plugin">Plugin</a></dt>
<dd><p>common SPI that all plugins must implement</p>
</dd>
<dt><a href="#Result">Result</a></dt>
<dd><p>Represent an ilib-lint rule check result</p>
</dd>
<dt><a href="#Rule">Rule</a></dt>
<dd><p>Represent an ilib-lint rule.</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#withVisibleWhitespace">withVisibleWhitespace</a> ⇒ <code>string</code></dt>
<dd><p>Replace whitespace in input string with visible representations<p></p>
<p>The following explicit mapping is used:<p></p>
<table>
<thead>
  <tr><th>Whitespace</th><th>Description</th><th>Representation</th><th>Description</th></tr>
</thead>
<tbody>
  <tr><td> \u0020 </td><td> regular space      </td><td> ⎵ </td><td> open box            </td></tr>
  <tr><td> \u00a0 </td><td> non-breaking space </td><td> ⍽ </td><td> shouldered open box </td></tr>
  <tr><td> \t     </td><td> tabulator          </td><td> → </td><td> tab symbol          </td></tr>
  <tr><td> \r     </td><td> carriage return    </td><td> ␍ </td><td> CR symbol           </td></tr>
  <tr><td> \n     </td><td> line feed          </td><td> ␊ </td><td> LF symbol           </td></tr>
  <tr><td> \v     </td><td> vertical tab       </td><td> ␋ </td><td> VT symbol           </td></tr>
</tbody>
</table>

<p>Additionally, whitespaces not included in explicit mapping are represented
as their Unicode codepoint value, e.g. <code>\u3000</code> becomes <code>[U+3000]</code>.<p></p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#isKebabCase">isKebabCase(str)</a> ⇒ <code>boolean</code></dt>
<dd><p>Return true if the given string is written with kebab case. Kebab
case is where words are separated with dashes, looking like they
have been strung out on a kebab stick.</p>
<p>Example: this-is-kebab-case-text</p>
</dd>
<dt><a href="#isCamelCase">isCamelCase(str)</a> ⇒ <code>boolean</code></dt>
<dd><p>Return true if the given string is written with camel case. Camel
case is where words are not separated by spaces but the first letter
of each word is capitalized, looking like the humps of a camel.</p>
<p>Example: thisIsCamelCaseText</p>
</dd>
<dt><a href="#isSnakeCase">isSnakeCase(str)</a> ⇒ <code>boolean</code></dt>
<dd><p>Return true if the given string is written with snake case. Snake
case is where words are separated with underscores, looking like they
have been strung out horizontally like a snake.</p>
<p>Example: this_is_snake_case_text</p>
</dd>
</dl>

## Interfaces

<dl>
<dt><a href="#LintAPI">LintAPI</a></dt>
<dd><p>common API interface that the linter provides to plugins</p>
</dd>
</dl>

<a name="LintAPI"></a>

## LintAPI
common API interface that the linter provides to plugins

**Kind**: global interface  

* * *

<a name="LintAPI+getLogger"></a>

### lintAPI.getLogger() ⇒ <code>Logger</code>
Return the log4js logger that the plugin can use to do logging.

**Kind**: instance method of [<code>LintAPI</code>](#LintAPI)  
**Returns**: <code>Logger</code> - return the logger to use  

* * *

<a name="Formatter"></a>

## *Formatter*
Represent an output formatter

**Kind**: global abstract class  

* *[Formatter](#Formatter)*
    * *[new Formatter([options])](#new_Formatter_new)*
    * *[.getName()](#Formatter+getName) ⇒ <code>String</code>*
    * *[.getDescription()](#Formatter+getDescription) ⇒ <code>String</code>*
    * **[.format(result)](#Formatter+format) ⇒ <code>String</code>**


* * *

<a name="new_Formatter_new"></a>

### *new Formatter([options])*
Construct an formatter instance. Formatters and formatter plugins
should implement this abstract class.


| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | options to the constructor |
| options.API | [<code>LintAPI</code>](#LintAPI) | the callback API provided by the linter |


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

<a name="IntermediateRepresentation"></a>

## IntermediateRepresentation
Representation of parser results

**Kind**: global class  

* [IntermediateRepresentation](#IntermediateRepresentation)
    * [new IntermediateRepresentation(params)](#new_IntermediateRepresentation_new)
    * [.getType()](#IntermediateRepresentation+getType) ⇒ <code>String</code>
    * [.getRepresentation()](#IntermediateRepresentation+getRepresentation) ⇒ <code>\*</code>
    * [.getPath()](#IntermediateRepresentation+getPath) ⇒ <code>String</code>


* * *

<a name="new_IntermediateRepresentation_new"></a>

### new IntermediateRepresentation(params)
Construct a new intermediate representation of a parsed file.


| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | parameters for this representation |
| params.type | <code>String</code> | a unique name for this type of representation |
| params.ir | <code>\*</code> | the intermediate representation of this file |
| params.filePath | <code>String</code> | the path to the current file |


* * *

<a name="IntermediateRepresentation+getType"></a>

### intermediateRepresentation.getType() ⇒ <code>String</code>
Return the type of this representation.

**Kind**: instance method of [<code>IntermediateRepresentation</code>](#IntermediateRepresentation)  
**Returns**: <code>String</code> - The type of this representation  

* * *

<a name="IntermediateRepresentation+getRepresentation"></a>

### intermediateRepresentation.getRepresentation() ⇒ <code>\*</code>
Return the representation that was parsed from the file.

**Kind**: instance method of [<code>IntermediateRepresentation</code>](#IntermediateRepresentation)  
**Returns**: <code>\*</code> - the representation  

* * *

<a name="IntermediateRepresentation+getPath"></a>

### intermediateRepresentation.getPath() ⇒ <code>String</code>
Return the file path to the file that was parsed.

**Kind**: instance method of [<code>IntermediateRepresentation</code>](#IntermediateRepresentation)  
**Returns**: <code>String</code> - the path to the file that was parsed  

* * *

<a name="Parser"></a>

## *Parser*
common SPI for parser plugins

**Kind**: global abstract class  

* *[Parser](#Parser)*
    * *[new Parser([options])](#new_Parser_new)*
    * **[.init()](#Parser+init)**
    * *[.getName()](#Parser+getName) ⇒ <code>String</code>*
    * *[.getDescription()](#Parser+getDescription) ⇒ <code>String</code>*
    * *[.getExtensions()](#Parser+getExtensions) ⇒ <code>Array.&lt;String&gt;</code>*
    * **[.parse()](#Parser+parse) ⇒ [<code>IntermediateRepresentation</code>](#IntermediateRepresentation)**
    * **[.getType()](#Parser+getType) ⇒ <code>String</code>**


* * *

<a name="new_Parser_new"></a>

### *new Parser([options])*
Construct a new plugin.


| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | options to the constructor |
| options.API | [<code>LintAPI</code>](#LintAPI) | the callback API provided by the linter |


* * *

<a name="Parser+init"></a>

### **parser.init()**
Initialize the current plugin.

**Kind**: instance abstract method of [<code>Parser</code>](#Parser)  

* * *

<a name="Parser+getName"></a>

### *parser.getName() ⇒ <code>String</code>*
Return the name of this type of parser.
Subclasses should assign `this.name` in their constructor.

**Kind**: instance method of [<code>Parser</code>](#Parser)  
**Returns**: <code>String</code> - return the name of this type of parser  

* * *

<a name="Parser+getDescription"></a>

### *parser.getDescription() ⇒ <code>String</code>*
Return a description of what this parser does and what kinds of files it
handles for users who are trying to discover whether or not to use it.

**Kind**: instance method of [<code>Parser</code>](#Parser)  
**Returns**: <code>String</code> - a description of this parser.  

* * *

<a name="Parser+getExtensions"></a>

### *parser.getExtensions() ⇒ <code>Array.&lt;String&gt;</code>*
Return the list of extensions of the files that this parser handles.
The extensions are listed without the dot. eg. ["json", "jsn"].
Subclasses should assign `this.extensions` in their constructor.

**Kind**: instance method of [<code>Parser</code>](#Parser)  
**Returns**: <code>Array.&lt;String&gt;</code> - a list of file name extensions  

* * *

<a name="Parser+parse"></a>

### **parser.parse() ⇒ [<code>IntermediateRepresentation</code>](#IntermediateRepresentation)**
Parse the current file into an intermediate representation. This
representation may be anything you like, as long as the rules you
implement also can use this same format to check for problems.<p>

Many parsers produce an abstract syntax tree. The tree could have
a different style depending on the programming language, but
generally, each node has a type, a name, and an array of children,
as well as additional information that depends on the type of
the node.<p>

Other types of intermediate representation could include:<p>

<ul>
<li>lines - just split the file into an array of lines in order
<li>string - treat the whole file like a big string
<li>concrete syntax tree - a tree the represents the actual
  syntactical elements in the file. This can be converted to
  an abstract syntax tree afterwards, which would be more useful
  for checking for problems.
<li>resources - array of instances of Resource classes as
  defined in [https://github.com/ilib-js/ilib-tools-common](https://github.com/ilib-js/ilib-tools-common).
  This is the preference intermediate representation for
  resource files like Java properties or xliff. There are many
  rules that already know how to process Resource instances.
</ul>

**Kind**: instance abstract method of [<code>Parser</code>](#Parser)  
**Returns**: [<code>IntermediateRepresentation</code>](#IntermediateRepresentation) - the intermediate representation  

* * *

<a name="Parser+getType"></a>

### **parser.getType() ⇒ <code>String</code>**
Return the type of intermediate representation that this parser
produces. The type should be a unique name that matches with
the rule type for rules that process this intermediate representation.<p>

There are three types that are reserved, however:<p>

<ul>
<li>resource - the parser returns an array of Resource instances as
  defined in [https://github.com/ilib-js/ilib-tools-common](https://github.com/ilib-js/ilib-tools-common).
<li>line - the parser produces a set of lines as an array of strings
<li>string - the parser doesn't parse. Instead, it just treats the
  the file as one long string.
</ul>

**Kind**: instance abstract method of [<code>Parser</code>](#Parser)  
**Returns**: <code>String</code> - the name of the current type of intermediate
representation.  

* * *

<a name="Plugin"></a>

## *Plugin*
common SPI that all plugins must implement

**Kind**: global abstract class  

* *[Plugin](#Plugin)*
    * *[new Plugin([options])](#new_Plugin_new)*
    * **[.init()](#Plugin+init) ⇒ <code>Promise.&lt;void&gt;</code> \| <code>undefined</code>**
    * *[.getAPIVersion()](#Plugin+getAPIVersion)*
    * *[.getRules()](#Plugin+getRules) ⇒ <code>Array.&lt;Class&gt;</code>*
    * *[.getRuleSets()](#Plugin+getRuleSets) ⇒ <code>Object</code>*
    * *[.getParsers()](#Plugin+getParsers) ⇒ <code>Array.&lt;Class&gt;</code>*
    * *[.getFormatters()](#Plugin+getFormatters) ⇒ <code>Array.&lt;Class&gt;</code>*


* * *

<a name="new_Plugin_new"></a>

### *new Plugin([options])*
Construct a new plugin. The options can vary depending on the
the plugin.


| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | options to the constructor |
| options.API | [<code>LintAPI</code>](#LintAPI) | the callback API provided by the linter |


* * *

<a name="Plugin+init"></a>

### **plugin.init() ⇒ <code>Promise.&lt;void&gt;</code> \| <code>undefined</code>**
Initialize the current plugin, if necessary.

**Kind**: instance abstract method of [<code>Plugin</code>](#Plugin)  
**Returns**: <code>Promise.&lt;void&gt;</code> \| <code>undefined</code> - a promise to initialize or undefined if the
initialization is synchronous or if no initialization is necessary  

* * *

<a name="Plugin+getAPIVersion"></a>

### *plugin.getAPIVersion()*
Return the version of the API that this plugin was built for.

**Kind**: instance method of [<code>Plugin</code>](#Plugin)  

* * *

<a name="Plugin+getRules"></a>

### *plugin.getRules() ⇒ <code>Array.&lt;Class&gt;</code>*
For a plugin that implements rules, this returns a list of Rule
classes that this plugin implements. Note this is the class itself,
not an instance of the class. The linter may need to instantiate
this rule multiple times with different optional parameters.

**Kind**: instance method of [<code>Plugin</code>](#Plugin)  
**Returns**: <code>Array.&lt;Class&gt;</code> - list of Rule classes implemented by this
plugin  

* * *

<a name="Plugin+getRuleSets"></a>

### *plugin.getRuleSets() ⇒ <code>Object</code>*
Return a number of pre-defined rule sets. The idea behind this
method is that the plugin can define sets of rules that users of
the plugin can rely on. As the plugin
developer adds new rules in their plugin, they can also update
the rule set to include those new rules and users of this plugin
will get enhanced functionality automatically without changing
their own configuration.<p>

For example, if there is a plugin named
"android", the plugin writer can add support for Java, Kotlin,
and properties files in the same plugin by adding parsers and rules
for each file type. They can then also add rulesets called "java",
"kotlin" and "properties" which will apply all the rules from this
plugin that are appropriate for the file types.<p>

By convention, these rulesets are named the same as the file type
that they support, but this is not a strict requirement. Plugin
writers should document the rulesets that the plugin supports in
the README.md for that plugin so that users know that it is available.

**Kind**: instance method of [<code>Plugin</code>](#Plugin)  
**Returns**: <code>Object</code> - an object where the properties are the names of
rulesets and the values are objects that configure a ruleset. The
properties of this subobject are the names of the rules and the
values are the optional parameters for the rule, or "true" to indicate
that the rule should be turned on for this set.  

* * *

<a name="Plugin+getParsers"></a>

### *plugin.getParsers() ⇒ <code>Array.&lt;Class&gt;</code>*
For a "parser" type of plugin, this returns a list of Parser classes
that this plugin implements. Note this is the class, not an
instance of the class. The linter may need to instantiate this
parser multiple times.

**Kind**: instance method of [<code>Plugin</code>](#Plugin)  
**Returns**: <code>Array.&lt;Class&gt;</code> - list of Parser classes implemented by this
plugin  

* * *

<a name="Plugin+getFormatters"></a>

### *plugin.getFormatters() ⇒ <code>Array.&lt;Class&gt;</code>*
For a "formatter" type of plugin, this returns a list of Formatter
classes that this plugin implements. Note this is the class, not an
instance of the class. The linter may need to instantiate this
formatter multiple times.

**Kind**: instance method of [<code>Plugin</code>](#Plugin)  
**Returns**: <code>Array.&lt;Class&gt;</code> - list of Formatter classes implemented by this
plugin  

* * *

<a name="Result"></a>

## *Result*
Represent an ilib-lint rule check result

**Kind**: global abstract class  

* * *

<a name="new_Result_new"></a>

### *new Result(fields)*
Construct an ilib-lint rule check result. Rules should return this
type when reporting issues in the source files.<p>

Some extra notes about the properties in the fields parameter: <p>

<ul>
<li>severity: Should have one of the following values:
    <ul>
    <li>suggestion - a suggestion of a better way to do things. The current way is
      not incorrect, but probably not optimal
    <li>warning - a problem that should be fixed, but which does not prevent
      your app from operating internationally. This is more severe than a suggestion.
    <li>error - a problem that must be fixed. This type of problem will prevent
      your app from operating properly internationally and could possibly even
      crash your app in some cases.
    </ul>
<li>description: In order to make the ilib-lint output useful, this description should
  attempt to make the following things clear:
    <ul>
    <li>What part is wrong
    <li>Why it is wrong
    <li>Suggestions on how to fix it
    </ul>
</ul>

For the `highlight` property, a snippet of the input that has a problem is reproduced
with XML tags around the problem part, if it is known. The tags are of the form
&lt;eX&gt; where X is a digit starting with 0 and progressing to 9 for each
subsequent problem. If the file type is XML already, the rest of the line will
be XML-escaped first.<p>

Example:<p>

"const str = rb.getString(&lt;e0>id&lt;/e0>);"<p>

In this example rule, `getString()` must be called with a static string in order for
the loctool to be able to extract that string. The line above calls `getString()`
with a variable named "id" as a parameter instead of a static string, so it fails this
check. The variable is then highlighted with the e0 tag and put into the `highlight`
field of the Result instance. Callers can then translate the open and close tags
appropriately for the output device, such as ASCII escapes for a regular terminal, or
HTML tags for a web-based device.<p>

Only the severity, description, pathName, and rule are required. All other
properties are optional. All fields are stored in this result and are public.<p>


| Param | Type | Description |
| --- | --- | --- |
| fields | <code>Object</code> | result fields |
| fields.severity | <code>String</code> | one of "error", "warning", or "suggestion" |
| fields.description | <code>String</code> | description of the problem in the source file |
| fields.pathName | <code>String</code> | name of the file that the issue was found in |
| fields.rule | [<code>Rule</code>](#Rule) | the rule that generated this result |
| fields.highlight | <code>String</code> | highlighted text from the source file indicating where the issue was optionally including some context. For resources, this is either the source or target string, where-ever the problem occurred. |
| [fields.id] | <code>String</code> | for rule that check resources, this is the id of of the resource that generated this result |
| [fields.source] | <code>String</code> | for rule that check resources, this is the source string of the resource that generated this result |
| [fields.lineNumber] | <code>Number</code> | if the parser included location information in the intermediate representation, this gives the line number in the source file where the problem occurred |
| [fields.locale] | <code>String</code> | for locale-sensitive rules, this gives an indication of which locale generated this result |


* * *

<a name="Rule"></a>

## *Rule*
Represent an ilib-lint rule.

**Kind**: global abstract class  

* *[Rule](#Rule)*
    * *[new Rule([options])](#new_Rule_new)*
    * *[.getName()](#Rule+getName) ⇒ <code>String</code>*
    * *[.getDescription()](#Rule+getDescription) ⇒ <code>String</code>*
    * *[.getLink()](#Rule+getLink) ⇒ <code>String</code>*
    * *[.getRuleType()](#Rule+getRuleType) ⇒ <code>String</code>*
    * *[.getSourceLocale()](#Rule+getSourceLocale) ⇒ <code>String</code>*
    * **[.match(options)](#Rule+match) ⇒ [<code>Result</code>](#Result) \| [<code>Array.&lt;Result&gt;</code>](#Result) \| <code>undefined</code>**


* * *

<a name="new_Rule_new"></a>

### *new Rule([options])*
Construct an ilib-lint rule. Rules in plugins should implement this
abstract class.


| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | options to the constructor |
| options.sourceLocale | <code>String</code> | the source locale of the files being linted |
| options.API | [<code>LintAPI</code>](#LintAPI) | the callback API provided by the linter |


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

<ul>
<li>"translation should use the appropriate quote style"
<li>"parameters to the translation wrapper function must not be concatenated"
<li>"translation should match the whitespace of the source string"
</ul>

**Kind**: instance method of [<code>Rule</code>](#Rule)  
**Returns**: <code>String</code> - a general description of the type of problems that this rule is
testing for  

* * *

<a name="Rule+getLink"></a>

### *rule.getLink() ⇒ <code>String</code>*
Return the optional web link that gives more complete explanation about the Rule
and how to resolve the problem.

**Kind**: instance method of [<code>Rule</code>](#Rule)  
**Returns**: <code>String</code> - an URL to a web page that explains the problem this rule checks for  

* * *

<a name="Rule+getRuleType"></a>

### *rule.getRuleType() ⇒ <code>String</code>*
Return the type of intermediate representation that this rule can process. Rules can
be any type as long as there is a parser that produces that type. By convention,
there are a few types that are already defined:<p>

<ul>
<li>resource - This checks a translated Resource instance with a source string
  and a translation string for a given locale. For example, a rule that checks that
  substitution parameters that exist in the source string also are
  given in the target string. Typically, resource files like po, properties, or xliff
  are parsed into an array of Resource instances as its intermediate representations.
<li>line - This rule checks single lines of a file. eg. a rule to
  check the parameters to a function call.
<li>string - This rule checks the entire file as a single string. Often, this type
  of representation is used with source code files that are checked with regular
  expressions, which often mean declarative rules.
<li>{other} - You can choose to return any other string here that uniquely identifies the
  representation that a parser produces.
</ul>

Typically, a full parser for a programming language will return something like
an abstract syntax tree as an intermediate format. For example, the acorn parser
for javascript returns an abstract syntax tree in JSTree format. The parser may
choose to return the string "ast-jstree" as its identifier, as long as there are
rules that are looking for that same string. The parser can return any string it
likes just as long as there are rules that know how to check it.

**Kind**: instance method of [<code>Rule</code>](#Rule)  
**Returns**: <code>String</code> - a string that names the type of intermediate representation
that this rule knows how to check  

* * *

<a name="Rule+getSourceLocale"></a>

### *rule.getSourceLocale() ⇒ <code>String</code>*
Get the source locale for this rule.

**Kind**: instance method of [<code>Rule</code>](#Rule)  
**Returns**: <code>String</code> - the source locale for this rule  

* * *

<a name="Rule+match"></a>

### **rule.match(options) ⇒ [<code>Result</code>](#Result) \| [<code>Array.&lt;Result&gt;</code>](#Result) \| <code>undefined</code>**
Test whether or not this rule matches the input. If so, produce {@see Result} instances
that document what the problems are.<p>

**Kind**: instance abstract method of [<code>Rule</code>](#Rule)  
**Returns**: [<code>Result</code>](#Result) \| [<code>Array.&lt;Result&gt;</code>](#Result) \| <code>undefined</code> - a Result instance describing the problem if
the rule check fails for this locale, or an array of such Result instances if
there are multiple problems with the same input, or `undefined` if there is no
problem found (ie. the rule does not match).  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | The options object as per the description above |
| options.ir | <code>\*</code> | The intermediate representation of the file to check |
| options.locale | <code>String</code> | the locale against which this rule should be checked. Some rules are locale-sensitive, others not. |
| [options.parameters] | <code>\*</code> | parameters for this rule from the configuration file |


* * *

<a name="withVisibleWhitespace"></a>

## withVisibleWhitespace ⇒ <code>string</code>
Replace whitespace in input string with visible representations<p>

The following explicit mapping is used:<p>

<table>
<thead>
  <tr><th>Whitespace</th><th>Description</th><th>Representation</th><th>Description</th></tr>
</thead>
<tbody>
  <tr><td> \u0020 </td><td> regular space      </td><td> ⎵ </td><td> open box            </td></tr>
  <tr><td> \u00a0 </td><td> non-breaking space </td><td> ⍽ </td><td> shouldered open box </td></tr>
  <tr><td> \t     </td><td> tabulator          </td><td> → </td><td> tab symbol          </td></tr>
  <tr><td> \r     </td><td> carriage return    </td><td> ␍ </td><td> CR symbol           </td></tr>
  <tr><td> \n     </td><td> line feed          </td><td> ␊ </td><td> LF symbol           </td></tr>
  <tr><td> \v     </td><td> vertical tab       </td><td> ␋ </td><td> VT symbol           </td></tr>
</tbody>
</table>

Additionally, whitespaces not included in explicit mapping are represented
as their Unicode codepoint value, e.g. `\u3000` becomes `[U+3000]`.<p>

**Kind**: global constant  
**Returns**: <code>string</code> - String in which whitespaces are replaced with visible representations  
**Note**: If a non-string is passed on input, returned value will be an empty string.  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | Input string |


* * *

<a name="isKebabCase"></a>

## isKebabCase(str) ⇒ <code>boolean</code>
Return true if the given string is written with kebab case. Kebab
case is where words are separated with dashes, looking like they
have been strung out on a kebab stick.

Example: this-is-kebab-case-text

**Kind**: global function  
**Returns**: <code>boolean</code> - true if the entire string is kebab case, and
false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>String</code> | the string to test |


* * *

<a name="isCamelCase"></a>

## isCamelCase(str) ⇒ <code>boolean</code>
Return true if the given string is written with camel case. Camel
case is where words are not separated by spaces but the first letter
of each word is capitalized, looking like the humps of a camel.

Example: thisIsCamelCaseText

**Kind**: global function  
**Returns**: <code>boolean</code> - true if the entire string is kebab case, and
false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>String</code> | the string to test |


* * *

<a name="isSnakeCase"></a>

## isSnakeCase(str) ⇒ <code>boolean</code>
Return true if the given string is written with snake case. Snake
case is where words are separated with underscores, looking like they
have been strung out horizontally like a snake.

Example: this_is_snake_case_text

**Kind**: global function  
**Returns**: <code>boolean</code> - true if the entire string is snake case, and
false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>String</code> | the string to test |


* * *

