## Classes

<dl>
<dt><a href="#FileStats">FileStats</a></dt>
<dd><p>Represent statistics about source files.</p></dd>
<dt><a href="#Fix">Fix</a></dt>
<dd><p>Container object through which [Rule](#Rule) can pass
instructions (of any kind) which a corresponding [Fixer](#Fixer)
should follow while modifying the [IntermediateRepresentation](#IntermediateRepresentation)
to remediate the issue.</p></dd>
<dt><a href="#Fixer">Fixer</a></dt>
<dd><p>Class that applies fixes produced by rules onto the intermediate representation</p></dd>
<dt><a href="#Formatter">Formatter</a></dt>
<dd><p>Represent an output formatter</p></dd>
<dt><a href="#IntermediateRepresentation">IntermediateRepresentation</a></dt>
<dd><p>Representation of parser results</p></dd>
<dt><a href="#NotImplementedError">NotImplementedError</a></dt>
<dd><p>Error thrown when an abstract method is called but not implemented</p></dd>
<dt><a href="#Parser">Parser</a></dt>
<dd><p>common SPI for parser plugins</p>
<p>A parser converts source files into intermediate representations that can be
checked for problems by the rules.</p></dd>
<dt><a href="#PipelineElement">PipelineElement</a></dt>
<dd><p>superclass for pipeline elements</p>
<p>A pipeline element is the superclass for all classes that can be used
in a pipeline. A pipeline is used to process a particular type
of file. Pipeline elements are used in sequence to parse, then transform,
and then serialize the content of the file. Each element can be used along
with a number of other pipeline elements of the same type which all
process the same type of file. Each pipeline element should define a type,
a name, and a description.</p></dd>
<dt><a href="#Plugin">Plugin</a></dt>
<dd><p>common SPI that all plugins must implement</p></dd>
<dt><a href="#Result">Result</a></dt>
<dd><p>Represent an ilib-lint rule check result</p></dd>
<dt><a href="#Rule">Rule</a></dt>
<dd><p>Represent an ilib-lint rule.</p></dd>
<dt><a href="#Serializer">Serializer</a></dt>
<dd><p>common SPI for serializer plugins</p>
<p>A serializer converts an IntermediateRepresentation into a SourceFile instance
that can be written back to disk. For example, an xliff serializer can take
an array of Resource instances and convert it into xliff file format and set
that as the content of the SourceFile it produces.</p></dd>
<dt><a href="#SourceFile">SourceFile</a></dt>
<dd><p>Represent a source file. Source files are text files that are
candidates for applying lint rules. Source files could mean any type of
text file. Examples may include source code files written in some programming
language, CSS files, HTML files, config files, resource files used to represent
translations for a product, or XLIFF files that contain all the translations
for a product. The source file may have subclasses that could represent data
that is more ephemeral, such as the rows of a database table. The URI passed
to the constructor should contain sufficient information for this class
or a subclass to be able to load the data from where it is stored.
The intention is that parsers classes should produce these
as a by-product of loading and parsing the text file on disk as a way of
representing the data that is being linted.</p></dd>
<dt><a href="#Transformer">Transformer</a></dt>
<dd><p>common SPI for transformer plugins</p>
<p>A transformer is a plugin that takes an intermediate representation of a
file and transforms it in some way, and returns a new intermediate
representation that is a modified version of the original. For example,
a filter transformer might remove some of the entries in the intermediate
representation that match a certain pattern, or it might
add new entries to the intermediate representation.</p></dd>
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
as their Unicode codepoint value, e.g. <code>\u3000</code> becomes <code>[U+3000]</code>.<p></p></dd>
</dl>

## Functions

<dl>
<dt><a href="#isKebabCase">isKebabCase(str)</a> ⇒ <code>boolean</code></dt>
<dd><p>Return true if the given string is written with kebab case. Kebab
case is where words are separated with dashes, looking like they
have been strung out on a kebab stick.</p>
<p>Example: this-is-kebab-case-text</p></dd>
<dt><a href="#isCamelCase">isCamelCase(str)</a> ⇒ <code>boolean</code></dt>
<dd><p>Return true if the given string is written with camel case. Camel
case is where words are not separated by spaces but the first letter
of each word is capitalized, looking like the humps of a camel.</p>
<p>Example: thisIsCamelCaseText</p></dd>
<dt><a href="#isSnakeCase">isSnakeCase(str)</a> ⇒ <code>boolean</code></dt>
<dd><p>Return true if the given string is written with snake case. Snake
case is where words are separated with underscores, looking like they
have been strung out horizontally like a snake.</p>
<p>Example: this_is_snake_case_text</p></dd>
</dl>

<a name="FileStats"></a>

## FileStats
<p>Represent statistics about source files.</p>

**Kind**: global class  

* [FileStats](#FileStats)
    * [new FileStats([options])](#new_FileStats_new)
    * [.addStats(stats)](#FileStats+addStats) ⇒
    * [.getFiles()](#FileStats+getFiles) ⇒ <code>Number</code>
    * [.addFiles(num)](#FileStats+addFiles) ⇒ [<code>FileStats</code>](#FileStats)
    * [.getLines()](#FileStats+getLines) ⇒ <code>Number</code>
    * [.addLines(num)](#FileStats+addLines) ⇒ [<code>FileStats</code>](#FileStats)
    * [.getBytes()](#FileStats+getBytes) ⇒ <code>Number</code>
    * [.addBytes(num)](#FileStats+addBytes) ⇒ [<code>FileStats</code>](#FileStats)
    * [.getModules()](#FileStats+getModules) ⇒ <code>Number</code>
    * [.addModules(num)](#FileStats+addModules) ⇒ [<code>FileStats</code>](#FileStats)


* * *

<a name="new_FileStats_new"></a>

### new FileStats([options])
<p>Construct an file statistics instance. Each count in the
statistics instance is optional except for the files.</p>


| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | <p>options to the constructor</p> |
| options.files | <code>Number</code> | <p>the number of source files being counted. If not given, this defaults to 1.</p> |
| [options.lines] | <code>Number</code> | <p>the number of lines in those source files</p> |
| [options.bytes] | <code>Number</code> | <p>the number of bytes in those source files</p> |
| [options.modules] | <code>Number</code> | <p>the number of modules in those source files. The definition of a &quot;module&quot; are given by the programming language and may mean things like functions or classes. It is up to the parser for that programming language to count these.</p> |


* * *

<a name="FileStats+addStats"></a>

### fileStats.addStats(stats) ⇒
<p>Add statistics from another instance into this one and return
the result.</p>

**Kind**: instance method of [<code>FileStats</code>](#FileStats)  
**Returns**: <p>{FileStats] the current instance</p>  

| Param | Type | Description |
| --- | --- | --- |
| stats | [<code>FileStats</code>](#FileStats) | <p>the other instance to add to the current one</p> |


* * *

<a name="FileStats+getFiles"></a>

### fileStats.getFiles() ⇒ <code>Number</code>
<p>Get the number of source files being counted.</p>

**Kind**: instance method of [<code>FileStats</code>](#FileStats)  
**Returns**: <code>Number</code> - <p>the number of source files being counted</p>  

* * *

<a name="FileStats+addFiles"></a>

### fileStats.addFiles(num) ⇒ [<code>FileStats</code>](#FileStats)
<p>Add the given amount to the number of files.</p>

**Kind**: instance method of [<code>FileStats</code>](#FileStats)  
**Returns**: [<code>FileStats</code>](#FileStats) - <p>the current instance</p>  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>Number</code> | <p>the amount to add</p> |


* * *

<a name="FileStats+getLines"></a>

### fileStats.getLines() ⇒ <code>Number</code>
<p>Get the number of source file lines being counted.</p>

**Kind**: instance method of [<code>FileStats</code>](#FileStats)  
**Returns**: <code>Number</code> - <p>the number of source file lines being counted</p>  

* * *

<a name="FileStats+addLines"></a>

### fileStats.addLines(num) ⇒ [<code>FileStats</code>](#FileStats)
<p>Add the given amount to the number of lines.</p>

**Kind**: instance method of [<code>FileStats</code>](#FileStats)  
**Returns**: [<code>FileStats</code>](#FileStats) - <p>the current instance</p>  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>Number</code> | <p>the amount to add</p> |


* * *

<a name="FileStats+getBytes"></a>

### fileStats.getBytes() ⇒ <code>Number</code>
<p>Get the number of source file bytes being counted.</p>

**Kind**: instance method of [<code>FileStats</code>](#FileStats)  
**Returns**: <code>Number</code> - <p>the number of source file bytes being counted</p>  

* * *

<a name="FileStats+addBytes"></a>

### fileStats.addBytes(num) ⇒ [<code>FileStats</code>](#FileStats)
<p>Add the given amount to the number of bytes.</p>

**Kind**: instance method of [<code>FileStats</code>](#FileStats)  
**Returns**: [<code>FileStats</code>](#FileStats) - <p>the current instance</p>  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>Number</code> | <p>the amount to add</p> |


* * *

<a name="FileStats+getModules"></a>

### fileStats.getModules() ⇒ <code>Number</code>
<p>Get the number of source file modules being counted. Modules
are filetype-dependent. It is up to the parser instance to determine
what is a module and what is not. An example could be that a
functional language like C might define a function as a module,
whereas an object-oriented language like C++ might define a class
as a module.</p>

**Kind**: instance method of [<code>FileStats</code>](#FileStats)  
**Returns**: <code>Number</code> - <p>the number of source file modules being counted</p>  

* * *

<a name="FileStats+addModules"></a>

### fileStats.addModules(num) ⇒ [<code>FileStats</code>](#FileStats)
<p>Add the given amount to the number of modules.</p>

**Kind**: instance method of [<code>FileStats</code>](#FileStats)  
**Returns**: [<code>FileStats</code>](#FileStats) - <p>the current instance</p>  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>Number</code> | <p>the amount to add</p> |


* * *

<a name="Fix"></a>

## *Fix*
<p>Container object through which [Rule](#Rule) can pass
instructions (of any kind) which a corresponding [Fixer](#Fixer)
should follow while modifying the [IntermediateRepresentation](#IntermediateRepresentation)
to remediate the issue.</p>

**Kind**: global abstract class  

* *[Fix](#Fix)*
    * *[new Fix()](#new_Fix_new)*
    * **[.type](#Fix+type) : <code>string</code>**
    * *[.applied](#Fix+applied) : <code>boolean</code>*


* * *

<a name="new_Fix_new"></a>

### *new Fix()*
<p>A subclass of Fix can contain any properties - it is up to
the corresponding Fixer (i.e. with a matching [Fix.type](Fix.type))
to interpret them appropriately and apply them
to the IntermediateRepresentation.</p>
<p>Due to that, a recommended approach is that the Fixer
should also be a Fix factory, so that the Rule
could only express the Fix instructions with
capabilities that the Fixer provides.</p>
<p>Example scenario:</p>
<p>Take an IntermediateRepresentation with type <code>string</code>
which stores content of a file verbatim:</p>
<pre class="prettyprint source lang-text"><code>birds are not real birds are not real birds are not real
</code></pre>
<p>and a Rule (type <code>string</code>) which ensures that the word <code>birds</code>
should always be surrounded by quotes.</p>
<p>Rule would produce the following results:</p>
<ol>
<li>birds are not quoted (span 0 - 5)</li>
<li>birds are not quoted (span 19 - 24)</li>
<li>birds are not quoted (span 38 - 43)</li>
</ol>
<p>To fix each of them, quotes need to be inserted:</p>
<ol>
<li>fix: insert quote at 0 and 5</li>
<li>fix: insert quote at 19 and 24</li>
<li>fix: insert quote at 38 and 43</li>
</ol>
<p>If there are no Fix and Fixer with type <code>string</code>,
they could be implemented like in the following example:</p>
<pre class="prettyprint source lang-js"><code>class StringFixCommand {
    commandId;
    position;
}

class InsertCommand extends StringFixCommand {
    commandId = &quot;INSERT&quot;;
    content;
}

class RemoveCommand extends StringFixCommand {
    commandId = &quot;REMOVE&quot;;
    length;
}

class StringFix extends Fix {
    commands; // StringFixCommand[]
}

class StringFixer {
    applyFixes(representation, fixes) {} // applyFixes(representation: IntermediateRepresentation, fixes: StringFix[]): void
    createFix(commands) {}               // createFix(commands: StringFixCommand[]): StringFix
    insertStringAt(position, content) {} // insertStringAt(position: number, content: string): InsertCommand
    removeStringAt(position, length) {}  // removeStringAt(position: number, length: number): RemoveCommand
}
</code></pre>
<p>Rule should then accept an instance of a StringFixer,
and for each produced result provide a fix:</p>
<pre class="prettyprint source"><code>new Result({
    // ...
    fix: fixer.createFix([fixer.insertStringAt(0, &quot;\&quot;&quot;), fixer.insertStringAt(5, &quot;\&quot;&quot;)])
});
</code></pre>
<p>So that the linter could call</p>
<pre class="prettyprint source"><code>fixer.applyFixes(ir, results.map(r => r.fix))
</code></pre>


* * *

<a name="Fix+type"></a>

### **fix.type : <code>string</code>**
<p>Unique identifier which allows to dynamically match
the Fix to its corresponding Fixer and IntermediateRepresentation
onto which it should be applied.</p>
<p>Subclass must define this property.</p>

**Kind**: instance abstract property of [<code>Fix</code>](#Fix)  
**Read only**: true  

* * *

<a name="Fix+applied"></a>

### *fix.applied : <code>boolean</code>*
<p>If the fix had been applied by the fixer.
Fixer is expected to set this flag after it had applied the fix.</p>

**Kind**: instance property of [<code>Fix</code>](#Fix)  

* * *

<a name="Fixer"></a>

## *Fixer*
<p>Class that applies fixes produced by rules onto the intermediate representation</p>

**Kind**: global abstract class  

* *[Fixer](#Fixer)*
    * *[new Fixer([options])](#new_Fixer_new)*
    * **[.type](#Fixer+type) : <code>string</code>**
    * **[.applyFixes(ir, fixes)](#Fixer+applyFixes) ⇒ <code>void</code>**


* * *

<a name="new_Fixer_new"></a>

### *new Fixer([options])*

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | <p>Placeholder for options that should be provided upon the Fixer subclass instantiation</p> |


* * *

<a name="Fixer+type"></a>

### **fixer.type : <code>string</code>**
<p>Unique identifier which allows to dynamically match
the Fixer to its corresponding IntermediateRepresentation
onto which it should apply the supplied Fixes.</p>
<p>Subclass must define this property.</p>

**Kind**: instance abstract property of [<code>Fixer</code>](#Fixer)  
**Read only**: true  

* * *

<a name="Fixer+applyFixes"></a>

### **fixer.applyFixes(ir, fixes) ⇒ <code>void</code>**
<p>Modify the Intermediate Representation instance by applying provided fixes.
Fix can be anything as long as the Fixer knows how to apply it onto the IR,
as described in [Fix](#Fix).</p>
<p>Fixer should know to avoid applying conflicting fixes
(i.e. those that would modify the same part of the underlying representation)
or to offset subsequent fixes after applying one of them.</p>
<p>For those fixes that have been applied, Fixer is expected to set the flag [Fix.applied](Fix.applied).</p>
<p>Example scenario:</p>
<p>Take an IntermediateRepresentation with type <code>string</code>
which stores content of a file verbatim:</p>
<pre class="prettyprint source lang-text"><code>birds are not real birds are not real birds are not real
</code></pre>
<p>and a Rule (type <code>string</code>) which ensures that the word <code>birds</code>
should always be surrounded by quotes.</p>
<p>The following fixes have been produced:</p>
<ol>
<li>insert <code>&quot;</code> at 0 and 5</li>
<li>insert <code>&quot;</code> at 19 and 24</li>
<li>insert <code>&quot;</code> at 38 and 43</li>
</ol>
<p>Expected fixed string is:</p>
<pre class="prettyprint source lang-text"><code>&quot;birds&quot; are not real &quot;birds&quot; are not real &quot;birds&quot; are not real
</code></pre>
<p>Which contains quotes at 0, 6, 21, 27, 42, 48. In this scenario, fixer needs to know
that after every time it inserted some string into the IR, it needs to offset indices
of the remaining insertion points appropriately.</p>
<p>Take another Rule which ensures that the file should always begin with an exclamation mark.
It would produce the following fix:</p>
<ol>
<li>insert <code>!</code> at 0</li>
</ol>
<p>This fix overlaps with fix from the other rule (insert <code>&quot;</code> at 0 and 5) because the fixer
can't tell which symbol goes first (<code>&quot;!birds&quot;</code> or <code>!&quot;birds&quot;</code>). One of those fixes
needs to be skipped.</p>

**Kind**: instance abstract method of [<code>Fixer</code>](#Fixer)  

| Param | Type | Description |
| --- | --- | --- |
| ir | [<code>IntermediateRepresentation</code>](#IntermediateRepresentation) | <p>Intermediate Representaion instance which will be modified by the fixer when the fixes are applied</p> |
| fixes | [<code>Array.&lt;Fix&gt;</code>](#Fix) | <p>Array of fixes which Fixer should attempt to apply</p> |


* * *

<a name="Formatter"></a>

## *Formatter*
<p>Represent an output formatter</p>

**Kind**: global abstract class  

* *[Formatter](#Formatter)*
    * *[new Formatter([options])](#new_Formatter_new)*
    * *[.getName()](#Formatter+getName) ⇒ <code>String</code>*
    * *[.getDescription()](#Formatter+getDescription) ⇒ <code>String</code>*
    * **[.format(result)](#Formatter+format) ⇒ <code>String</code>**
    * **[.formatOutput([options])](#Formatter+formatOutput) ⇒ <code>String</code>**


* * *

<a name="new_Formatter_new"></a>

### *new Formatter([options])*
<p>Construct an formatter instance. Formatters and formatter plugins
should implement this abstract class.</p>


| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | <p>options to the constructor</p> |
| options.getLogger | <code>function</code> | <p>a callback function provided by the linter to retrieve the log4js logger</p> |


* * *

<a name="Formatter+getName"></a>

### *formatter.getName() ⇒ <code>String</code>*
<p>Get the name of the formatter. This should be a unique string.</p>

**Kind**: instance method of [<code>Formatter</code>](#Formatter)  
**Returns**: <code>String</code> - <p>the name of this formatter</p>  

* * *

<a name="Formatter+getDescription"></a>

### *formatter.getDescription() ⇒ <code>String</code>*
<p>Return a general description of the formatter for use in help output.</p>

**Kind**: instance method of [<code>Formatter</code>](#Formatter)  
**Returns**: <code>String</code> - <p>a general description of the formatter</p>  

* * *

<a name="Formatter+format"></a>

### **formatter.format(result) ⇒ <code>String</code>**
<p>Format the given result with the current formatter and return the
formatted string.</p>

**Kind**: instance abstract method of [<code>Formatter</code>](#Formatter)  
**Returns**: <code>String</code> - <p>the formatted result</p>  

| Param | Type | Description |
| --- | --- | --- |
| result | [<code>Result</code>](#Result) | <p>the result to format</p> |


* * *

<a name="Formatter+formatOutput"></a>

### **formatter.formatOutput([options]) ⇒ <code>String</code>**
<p>Provide the information for the formatter as an object and
return the formatted string that contains a lot of information
according to the formatter's needs.</p>
<p>The method supposed to format the entire output, including headers,
footers and summaries and formatted Result instances.
If the formatOutput is defined, the linter does not call format()
directly and it is up to formatOutput to do so. If formatOutput
is not defined in a Formatter plugin, then ilib-lint will use its
own default headers and footers and will call format to format each Result.</p>

**Kind**: instance abstract method of [<code>Formatter</code>](#Formatter)  
**Returns**: <code>String</code> - <p>the formatted result</p>  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | <p>Information that the method can use to format the output</p> |
| [options.name] | <code>string</code> | <p>name of the this project</p> |
| [options.fileStats] | [<code>FileStats</code>](#FileStats) | <p>The stats information of the file</p> |
| [options.resultStats] | <code>Object</code> | <p>Information about the lint result of the  file</p> |
| [options.results] | <code>Object</code> | <p>list containing all issues in this project</p> |
| [options.score] | <code>Number</code> | <p>I18N score for this project</p> |
| [options.totalTime] | <code>Number</code> | <p>Total elapsed time by the tool for this project</p> |
| [options.errorOnly] | <code>Boolean</code> | <p>true, if only errors are displayed</p> |


* * *

<a name="IntermediateRepresentation"></a>

## IntermediateRepresentation
<p>Representation of parser results</p>

**Kind**: global class  

* [IntermediateRepresentation](#IntermediateRepresentation)
    * [new IntermediateRepresentation(params)](#new_IntermediateRepresentation_new)
    * [.type](#IntermediateRepresentation+type) : <code>string</code>
    * [.ir](#IntermediateRepresentation+ir) : <code>any</code>
    * [.sourceFile](#IntermediateRepresentation+sourceFile) : [<code>SourceFile</code>](#SourceFile)
    * [.stats](#IntermediateRepresentation+stats) : [<code>FileStats</code>](#FileStats) \| <code>undefined</code>
    * [.getType()](#IntermediateRepresentation+getType) ⇒ <code>String</code>
    * [.getRepresentation()](#IntermediateRepresentation+getRepresentation) ⇒ <code>any</code>
    * [.getSourceFile()](#IntermediateRepresentation+getSourceFile) ⇒ [<code>SourceFile</code>](#SourceFile)


* * *

<a name="new_IntermediateRepresentation_new"></a>

### new IntermediateRepresentation(params)
<p>Construct a new intermediate representation of a parsed file.</p>


| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | <p>parameters for this representation</p> |
| params.type | <code>String</code> | <p>a unique name for this type of representation</p> |
| params.ir | <code>any</code> | <p>the intermediate representation of this file</p> |
| params.sourceFile | [<code>SourceFile</code>](#SourceFile) | <p>the file that is being represented</p> |
| [params.stats] | [<code>FileStats</code>](#FileStats) | <p>statistics about the file that was parsed</p> |


* * *

<a name="IntermediateRepresentation+type"></a>

### intermediateRepresentation.type : <code>string</code>
<p>A unique name for this type of representation</p>

**Kind**: instance property of [<code>IntermediateRepresentation</code>](#IntermediateRepresentation)  
**Read only**: true  

* * *

<a name="IntermediateRepresentation+ir"></a>

### intermediateRepresentation.ir : <code>any</code>
<p>Representation that was parsed from the file</p>

**Kind**: instance property of [<code>IntermediateRepresentation</code>](#IntermediateRepresentation)  

* * *

<a name="IntermediateRepresentation+sourceFile"></a>

### intermediateRepresentation.sourceFile : [<code>SourceFile</code>](#SourceFile)
<p>Instance of a source file class of the file that was parsed</p>

**Kind**: instance property of [<code>IntermediateRepresentation</code>](#IntermediateRepresentation)  
**Read only**: true  

* * *

<a name="IntermediateRepresentation+stats"></a>

### intermediateRepresentation.stats : [<code>FileStats</code>](#FileStats) \| <code>undefined</code>
<p>Statistics about the file that was parsed</p>

**Kind**: instance property of [<code>IntermediateRepresentation</code>](#IntermediateRepresentation)  
**Read only**: true  

* * *

<a name="IntermediateRepresentation+getType"></a>

### intermediateRepresentation.getType() ⇒ <code>String</code>
<p>Return the type of this representation.</p>

**Kind**: instance method of [<code>IntermediateRepresentation</code>](#IntermediateRepresentation)  
**Returns**: <code>String</code> - <p>The type of this representation</p>  

* * *

<a name="IntermediateRepresentation+getRepresentation"></a>

### intermediateRepresentation.getRepresentation() ⇒ <code>any</code>
<p>Return the representation that was parsed from the file.</p>

**Kind**: instance method of [<code>IntermediateRepresentation</code>](#IntermediateRepresentation)  
**Returns**: <code>any</code> - <p>the representation</p>  

* * *

<a name="IntermediateRepresentation+getSourceFile"></a>

### intermediateRepresentation.getSourceFile() ⇒ [<code>SourceFile</code>](#SourceFile)
<p>Return the source file that was parsed.</p>

**Kind**: instance method of [<code>IntermediateRepresentation</code>](#IntermediateRepresentation)  
**Returns**: [<code>SourceFile</code>](#SourceFile) - <p>the instance of a source file class for
the source file that was parsed</p>  

* * *

<a name="NotImplementedError"></a>

## NotImplementedError
<p>Error thrown when an abstract method is called but not implemented</p>

**Kind**: global class  

* * *

<a name="Parser"></a>

## *Parser*
<p>common SPI for parser plugins</p>
<p>A parser converts source files into intermediate representations that can be
checked for problems by the rules.</p>

**Kind**: global abstract class  

* *[Parser](#Parser)*
    * *[new Parser([options])](#new_Parser_new)*
    * **[.extensions](#Parser+extensions) : <code>Array.&lt;string&gt;</code>**
    * *[.getExtensions()](#Parser+getExtensions) ⇒ <code>Array.&lt;String&gt;</code>*
    * **[.parse(sourceFile)](#Parser+parse) ⇒ [<code>Array.&lt;IntermediateRepresentation&gt;</code>](#IntermediateRepresentation)**


* * *

<a name="new_Parser_new"></a>

### *new Parser([options])*
<p>Construct a new parser instance.</p>


| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | <p>options to the constructor</p> |
| [options.getLogger] | <code>function</code> | <p>a callback function provided by</p> |
| [options.settings] | <code>object</code> | <p>additional settings that can be passed to the parser the linter to retrieve the log4js logger</p> |


* * *

<a name="Parser+extensions"></a>

### **parser.extensions : <code>Array.&lt;string&gt;</code>**
<p>List of extensions of the files that this parser handles.
The extensions are listed without the dot. eg. [&quot;json&quot;, &quot;jsn&quot;]</p>
<p>Subclass must define this property.</p>

**Kind**: instance abstract property of [<code>Parser</code>](#Parser)  
**Read only**: true  

* * *

<a name="Parser+getExtensions"></a>

### *parser.getExtensions() ⇒ <code>Array.&lt;String&gt;</code>*
<p>Return the list of extensions of the files that this parser handles.
The extensions are listed without the dot. eg. [&quot;json&quot;, &quot;jsn&quot;].</p>
<p>Subclass must define [Parser.extensions](Parser.extensions).</p>

**Kind**: instance method of [<code>Parser</code>](#Parser)  
**Returns**: <code>Array.&lt;String&gt;</code> - <p>a list of file name extensions</p>  

* * *

<a name="Parser+parse"></a>

### **parser.parse(sourceFile) ⇒ [<code>Array.&lt;IntermediateRepresentation&gt;</code>](#IntermediateRepresentation)**
<p>Parse the current file into intermediate representations. This
representation may be anything you like, as long as the rules you
implement also can use this same format to check for problems.</p>
<p>Many parsers produce an abstract syntax tree. The tree could have
a different style depending on the programming language, but
generally, each node has a type, a name, and an array of children,
as well as additional information that depends on the type of
the node.</p>
<p>Other types of intermediate representation could include:</p>
<ul>
<li>lines - just split the file into an array of lines in order</li>
<li>string - treat the whole file like a big string</li>
<li>concrete syntax tree - a tree the represents the actual
syntactical elements in the file. This can be converted to
an abstract syntax tree afterwards, which would be more useful
for checking for problems.</li>
<li>resources - array of instances of Resource classes as
defined in [https://github.com/iLib-js/ilib-mono/tree/main/packages/ilib-tools-common](https://github.com/iLib-js/ilib-mono/tree/main/packages/ilib-tools-common).
This is the preference intermediate representation for
resource files like Java properties or xliff. There are many
rules that already know how to process Resource instances.</li>
<li>
<ul>
<li>
<ul>
<li>the star is a special type that means that the pipeline element
can handle any type of file. Typically, this is used for pipeline elements
that are used to check the content of the file for problems that are
not related to the structure of the file itself, such as checking for
character encoding problems or other issues.</li>
</ul>
</li>
</ul>
</li>
</ul>

**Kind**: instance abstract method of [<code>Parser</code>](#Parser)  
**Returns**: [<code>Array.&lt;IntermediateRepresentation&gt;</code>](#IntermediateRepresentation) - <p>the intermediate representations</p>  

| Param | Type | Description |
| --- | --- | --- |
| sourceFile | [<code>SourceFile</code>](#SourceFile) | <p>the source file to parse</p> |


* * *

<a name="PipelineElement"></a>

## *PipelineElement*
<p>superclass for pipeline elements</p>
<p>A pipeline element is the superclass for all classes that can be used
in a pipeline. A pipeline is used to process a particular type
of file. Pipeline elements are used in sequence to parse, then transform,
and then serialize the content of the file. Each element can be used along
with a number of other pipeline elements of the same type which all
process the same type of file. Each pipeline element should define a type,
a name, and a description.</p>

**Kind**: global abstract class  

* *[PipelineElement](#PipelineElement)*
    * *[new PipelineElement([options])](#new_PipelineElement_new)*
    * *[.getLogger](#PipelineElement+getLogger) : <code>function</code> \| <code>undefined</code>*
    * **[.name](#PipelineElement+name) : <code>string</code>**
    * **[.description](#PipelineElement+description) : <code>string</code>**
    * **[.type](#PipelineElement+type) : <code>string</code>**
    * *[.init()](#PipelineElement+init)*
    * *[.getName()](#PipelineElement+getName) ⇒ <code>String</code>*
    * *[.getDescription()](#PipelineElement+getDescription) ⇒ <code>String</code>*
    * **[.getType()](#PipelineElement+getType) ⇒ <code>String</code>**


* * *

<a name="new_PipelineElement_new"></a>

### *new PipelineElement([options])*
<p>Construct a new pipeline element instance.</p>


| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | <p>options to the constructor</p> |
| [options.getLogger] | <code>function</code> | <p>a callback function provided by the linter to retrieve the log4js logger</p> |
| [options.settings] | <code>object</code> | <p>additional settings that can be passed from the linter to pipeline element from the configuration file</p> |


* * *

<a name="PipelineElement+getLogger"></a>

### *pipelineElement.getLogger : <code>function</code> \| <code>undefined</code>*
<p>A callback function provided by the linter to retrieve the log4js logger</p>

**Kind**: instance property of [<code>PipelineElement</code>](#PipelineElement)  

* * *

<a name="PipelineElement+name"></a>

### **pipelineElement.name : <code>string</code>**
<p>Name of this type of pipeline element</p>
<p>Concrete subclasses must define this property.</p>

**Kind**: instance abstract property of [<code>PipelineElement</code>](#PipelineElement)  
**Read only**: true  

* * *

<a name="PipelineElement+description"></a>

### **pipelineElement.description : <code>string</code>**
<p>Description of what this pipeline element does and what kinds of files it
handles for users who are trying to discover whether or not to use it.</p>
<p>Concrete subclasses must define this property.</p>

**Kind**: instance abstract property of [<code>PipelineElement</code>](#PipelineElement)  
**Read only**: true  

* * *

<a name="PipelineElement+type"></a>

### **pipelineElement.type : <code>string</code>**
<p>Type of file that this pipeline element processes. The type should be
a unique name that matches with the type of other pipeline elements that
process this same type of file. The linter will ensure that when a
pipeline element is of a particular type, only IntermediateRepresentation
instances with the same type are sent in to that element for processing.</p>
<p>There are three types that are reserved, however:</p>
<ul>
<li>resource - the pipeline element returns an array of Resource instances as
defined in [https://github.com/iLib-js/ilib-mono/tree/main/packages/ilib-tools-common](https://github.com/iLib-js/ilib-mono/tree/main/packages/ilib-tools-common).</li>
<li>line - the pipeline element produces a set of lines as an array of strings</li>
<li>string - the pipeline element doesn't parse. Instead, it just treats the
the file as one long string.</li>
<li>
<ul>
<li>
<ul>
<li>the star is a special type that means that the pipeline element
can handle any type of file. Typically, this is used for pipeline elements
that are used to check the content of the file for problems that are
not related to the structure of the file itself, such as checking for
character encoding problems or other issues.</li>
</ul>
</li>
</ul>
</li>
</ul>
<p>Concrete subclasses must define this property.</p>

**Kind**: instance abstract property of [<code>PipelineElement</code>](#PipelineElement)  
**Read only**: true  

* * *

<a name="PipelineElement+init"></a>

### *pipelineElement.init()*
<p>Initialize the current plugin.</p>

**Kind**: instance method of [<code>PipelineElement</code>](#PipelineElement)  

* * *

<a name="PipelineElement+getName"></a>

### *pipelineElement.getName() ⇒ <code>String</code>*
<p>Return the name of this type of pipeline element.
Concrete subclasses must define [PipelineElement.name](PipelineElement.name).</p>

**Kind**: instance method of [<code>PipelineElement</code>](#PipelineElement)  
**Returns**: <code>String</code> - <p>return the name of this type of pipeline element</p>  

* * *

<a name="PipelineElement+getDescription"></a>

### *pipelineElement.getDescription() ⇒ <code>String</code>*
<p>Return a description of what this pipeline element does and what kinds of files it
handles for users who are trying to discover whether or not to use it.</p>
<p>Subclass must define [PipelineElement.description](PipelineElement.description).</p>

**Kind**: instance method of [<code>PipelineElement</code>](#PipelineElement)  
**Returns**: <code>String</code> - <p>a description of this pipeline element.</p>  

* * *

<a name="PipelineElement+getType"></a>

### **pipelineElement.getType() ⇒ <code>String</code>**
<p>Return the type of file that this pipeline element processes. The type should be
a unique name that matches with the type of other pipeline elements that
process this same type of file.</p>
<p>Concrete subclasses must define [PipelineElement.type](PipelineElement.type).</p>

**Kind**: instance abstract method of [<code>PipelineElement</code>](#PipelineElement)  
**Returns**: <code>String</code> - <p>the name of the type of file that this pipeline element processes</p>  

* * *

<a name="Plugin"></a>

## *Plugin*
<p>common SPI that all plugins must implement</p>

**Kind**: global abstract class  

* *[Plugin](#Plugin)*
    * *[new Plugin([options])](#new_Plugin_new)*
    * **[.init()](#Plugin+init) ⇒ <code>Promise.&lt;void&gt;</code> \| <code>void</code>**
    * *[.getRules()](#Plugin+getRules) ⇒ <code>Array.&lt;(Class\|Object)&gt;</code>*
    * *[.getRuleSets()](#Plugin+getRuleSets) ⇒ <code>Object</code>*
    * *[.getParsers()](#Plugin+getParsers) ⇒ <code>Array.&lt;Class&gt;</code>*
    * *[.getFormatters()](#Plugin+getFormatters) ⇒ <code>Array.&lt;(Class\|Object)&gt;</code>*
    * *[.getFixers()](#Plugin+getFixers) ⇒ <code>Array.&lt;Class&gt;</code>*
    * *[.getTransformers()](#Plugin+getTransformers) ⇒ <code>Array.&lt;Class&gt;</code>*
    * *[.getSerializers()](#Plugin+getSerializers) ⇒ <code>Array.&lt;Class&gt;</code>*


* * *

<a name="new_Plugin_new"></a>

### *new Plugin([options])*
<p>Construct a new plugin. The options can vary depending on the
the plugin.</p>


| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | <p>options to the constructor</p> |
| options.getLogger | <code>function</code> | <p>a callback function provided by the linter to retrieve the log4js logger</p> |


* * *

<a name="Plugin+init"></a>

### **plugin.init() ⇒ <code>Promise.&lt;void&gt;</code> \| <code>void</code>**
<p>Initialize the current plugin, if necessary.</p>

**Kind**: instance abstract method of [<code>Plugin</code>](#Plugin)  
**Returns**: <code>Promise.&lt;void&gt;</code> \| <code>void</code> - <p>a promise to initialize or undefined if the
initialization is synchronous or if no initialization is necessary</p>  

* * *

<a name="Plugin+getRules"></a>

### *plugin.getRules() ⇒ <code>Array.&lt;(Class\|Object)&gt;</code>*
<p>For a plugin that implements rules, this returns a list of Rule
classes that this plugin implements. Note this is the class itself,
not an instance of the class. The linter may need to instantiate
this rule multiple times with different optional parameters.</p>

**Kind**: instance method of [<code>Plugin</code>](#Plugin)  
**Returns**: <code>Array.&lt;(Class\|Object)&gt;</code> - <p>list of Rule classes implemented
by this plugin or objects that are definitions of declarative rules</p>  

* * *

<a name="Plugin+getRuleSets"></a>

### *plugin.getRuleSets() ⇒ <code>Object</code>*
<p>Return a number of pre-defined rule sets. The idea behind this
method is that the plugin can define sets of rules that users of
the plugin can rely on. As the plugin
developer adds new rules in their plugin, they can also update
the rule set to include those new rules and users of this plugin
will get enhanced functionality automatically without changing
their own configuration.<p></p>
<p>For example, if there is a plugin named
&quot;android&quot;, the plugin writer can add support for Java, Kotlin,
and properties files in the same plugin by adding parsers and rules
for each file type. They can then also add rulesets called &quot;java&quot;,
&quot;kotlin&quot; and &quot;properties&quot; which will apply all the rules from this
plugin that are appropriate for the file types.<p></p>
<p>By convention, these rulesets are named the same as the file type
that they support, but this is not a strict requirement. Plugin
writers should document the rulesets that the plugin supports in
the README.md for that plugin so that users know that it is available.</p>

**Kind**: instance method of [<code>Plugin</code>](#Plugin)  
**Returns**: <code>Object</code> - <p>an object where the properties are the names of
rulesets and the values are objects that configure a ruleset. The
properties of this subobject are the names of the rules and the
values are the optional parameters for the rule, or &quot;true&quot; to indicate
that the rule should be turned on for this set.</p>  

* * *

<a name="Plugin+getParsers"></a>

### *plugin.getParsers() ⇒ <code>Array.&lt;Class&gt;</code>*
<p>For a &quot;parser&quot; type of plugin, this returns a list of Parser classes
that this plugin implements. Note this is the class, not an
instance of the class. The linter may need to instantiate this
parser multiple times.</p>

**Kind**: instance method of [<code>Plugin</code>](#Plugin)  
**Returns**: <code>Array.&lt;Class&gt;</code> - <p>list of Parser classes implemented by this
plugin</p>  

* * *

<a name="Plugin+getFormatters"></a>

### *plugin.getFormatters() ⇒ <code>Array.&lt;(Class\|Object)&gt;</code>*
<p>For a &quot;formatter&quot; type of plugin, this returns a list of Formatter
classes that this plugin implements. Note this is the class, not an
instance of the class. The linter may need to instantiate this
formatter multiple times.</p>

**Kind**: instance method of [<code>Plugin</code>](#Plugin)  
**Returns**: <code>Array.&lt;(Class\|Object)&gt;</code> - <p>list of Formatter classes implemented
by this plugin or objects that are definitions of declarative formatters</p>  

* * *

<a name="Plugin+getFixers"></a>

### *plugin.getFixers() ⇒ <code>Array.&lt;Class&gt;</code>*
<p>For a &quot;fixer&quot; type of plugin, this returns a list of Fixer
classes that this plugin implements. Note this is the class, not an
instance of the class. The linter may need to instantiate this
formatter multiple times.</p>

**Kind**: instance method of [<code>Plugin</code>](#Plugin)  
**Returns**: <code>Array.&lt;Class&gt;</code> - <p>array of Fixer classes implemented
by this plugin</p>  

* * *

<a name="Plugin+getTransformers"></a>

### *plugin.getTransformers() ⇒ <code>Array.&lt;Class&gt;</code>*
<p>For a &quot;transformer&quot; type of plugin, this returns a list of Transformer
classes that this plugin implements. Note this is the class, not an
instance of the class. The linter may need to instantiate this transformer
multiple times.</p>

**Kind**: instance method of [<code>Plugin</code>](#Plugin)  
**Returns**: <code>Array.&lt;Class&gt;</code> - <p>list of Transformer classes implemented
by this plugin</p>  

* * *

<a name="Plugin+getSerializers"></a>

### *plugin.getSerializers() ⇒ <code>Array.&lt;Class&gt;</code>*
<p>For a &quot;serializer&quot; type of plugin, this returns a list of Serializer
classes that this plugin implements. Note this is the class, not an
instance of the class. The linter may need to instantiate this serializer
multiple times.</p>

**Kind**: instance method of [<code>Plugin</code>](#Plugin)  
**Returns**: <code>Array.&lt;Class&gt;</code> - <p>list of Serializer classes implemented
by this plugin</p>  

* * *

<a name="Result"></a>

## Result
<p>Represent an ilib-lint rule check result</p>

**Kind**: global class  

* [Result](#Result)
    * [new Result(fields)](#new_Result_new)
    * [.severity](#Result+severity) : <code>&quot;error&quot;</code> \| <code>&quot;warning&quot;</code> \| <code>&quot;suggestion&quot;</code>
    * [.description](#Result+description) : <code>String</code>
    * [.pathName](#Result+pathName) : <code>String</code>
    * [.rule](#Result+rule) : [<code>Rule</code>](#Rule)
    * [.highlight](#Result+highlight) : <code>String</code>
    * [.id](#Result+id) : <code>String</code> \| <code>undefined</code>
    * [.source](#Result+source) : <code>String</code> \| <code>undefined</code>
    * [.lineNumber](#Result+lineNumber) : <code>Number</code> \| <code>undefined</code>
    * [.charNumber](#Result+charNumber) : <code>Number</code> \| <code>undefined</code>
    * [.endLineNumber](#Result+endLineNumber) : <code>Number</code> \| <code>undefined</code>
    * [.endCharNumber](#Result+endCharNumber) : <code>Number</code> \| <code>undefined</code>
    * [.locale](#Result+locale) : <code>String</code> \| <code>undefined</code>
    * [.fix](#Result+fix) : [<code>Fix</code>](#Fix) \| <code>undefined</code>


* * *

<a name="new_Result_new"></a>

### new Result(fields)
<p>Construct an ilib-lint rule check result. Rules should return this
type when reporting issues in the source files.</p>
<p>Some extra notes about the properties in the fields parameter:</p>
<ul>
<li>severity: Should have one of the following values:
<ul>
<li>suggestion - a suggestion of a better way to do things. The current way is
not incorrect, but probably not optimal</li>
<li>warning - a problem that should be fixed, but which does not prevent
your app from operating internationally. This is more severe than a suggestion.</li>
<li>error - a problem that must be fixed. This type of problem will prevent
your app from operating properly internationally and could possibly even
crash your app in some cases.</li>
</ul>
</li>
<li>description: In order to make the ilib-lint output useful, this description should
attempt to make the following things clear:
<ul>
<li>What part is wrong</li>
<li>Why it is wrong</li>
<li>Suggestions on how to fix it</li>
</ul>
</li>
</ul>
<p>For the <code>highlight</code> property, a snippet of the input that has a problem is reproduced
with XML tags around the problem part, if it is known. The tags are of the form
&lt;eX&gt; where X is a digit starting with 0 and progressing to 9 for each
subsequent problem. If the file type is XML already, the rest of the line will
be XML-escaped first.</p>
<p>Example:</p>
<p>&quot;const str = rb.getString(&lt;e0&gt;id&lt;/e0&gt;);&quot;</p>
<p>In this example rule, <code>getString()</code> must be called with a static string in order for
the loctool to be able to extract that string. The line above calls <code>getString()</code>
with a variable named &quot;id&quot; as a parameter instead of a static string, so it fails this
check. The variable is then highlighted with the e0 tag and put into the <code>highlight</code>
field of the Result instance. Callers can then translate the open and close tags
appropriately for the output device, such as ASCII escapes for a regular terminal, or
HTML tags for a web-based device.</p>
<p>Only the severity, description, pathName, and rule are required. All other
properties are optional. All fields are stored in this result and are public.</p>


| Param | Type | Description |
| --- | --- | --- |
| fields | <code>Object</code> | <p>result fields</p> |
| fields.severity | <code>&quot;error&quot;</code> \| <code>&quot;warning&quot;</code> \| <code>&quot;suggestion&quot;</code> | <p>one of &quot;error&quot;, &quot;warning&quot;, or &quot;suggestion&quot;</p> |
| fields.description | <code>String</code> | <p>description of the problem in the source file</p> |
| fields.pathName | <code>String</code> | <p>name of the file that the issue was found in</p> |
| fields.rule | [<code>Rule</code>](#Rule) | <p>the rule that generated this result</p> |
| fields.highlight | <code>String</code> | <p>highlighted text from the source file indicating where the issue was optionally including some context. For resources, this is either the source or target string, where-ever the problem occurred.</p> |
| [fields.id] | <code>String</code> | <p>for rule that check resources, this is the id of of the resource that generated this result</p> |
| [fields.source] | <code>String</code> | <p>for rule that check resources, this is the source string of the resource that generated this result</p> |
| [fields.lineNumber] | <code>Number</code> | <p>if the parser included location information in the intermediate representation, this gives the line number in the source file where the problem occurred</p> |
| [fields.charNumber] | <code>Number</code> | <p>if the parser included location information in the intermediate representation, this gives the character number within the line in the source file where the problem occurred</p> |
| [fields.endLineNumber] | <code>Number</code> | <p>if the parser included location information in the intermediate representation, this gives the last line number in the source file where the problem occurred</p> |
| [fields.endCharNumber] | <code>Number</code> | <p>if the parser included location information in the intermediate representation, this gives the last character number within the line in the source file where the problem occurred</p> |
| [fields.locale] | <code>String</code> | <p>for locale-sensitive rules, this gives an indication of which locale generated this result</p> |
| [fields.fix] | [<code>Fix</code>](#Fix) | <p>object which contains info needed by the [Fixer](#Fixer) to perform the fix for this result</p> |


* * *

<a name="Result+severity"></a>

### result.severity : <code>&quot;error&quot;</code> \| <code>&quot;warning&quot;</code> \| <code>&quot;suggestion&quot;</code>
<p>One of the following:</p>
<ul>
<li>suggestion - a suggestion of a better way to do things. The current way is
not incorrect, but probably not optimal</li>
<li>warning - a problem that should be fixed, but which does not prevent
your app from operating internationally. This is more severe than a suggestion.</li>
<li>error - a problem that must be fixed. This type of problem will prevent
your app from operating properly internationally and could possibly even
crash your app in some cases.</li>
</ul>

**Kind**: instance property of [<code>Result</code>](#Result)  

* * *

<a name="Result+description"></a>

### result.description : <code>String</code>
<p>description of the problem in the source file</p>

**Kind**: instance property of [<code>Result</code>](#Result)  

* * *

<a name="Result+pathName"></a>

### result.pathName : <code>String</code>
<p>name of the file that the issue was found in</p>

**Kind**: instance property of [<code>Result</code>](#Result)  

* * *

<a name="Result+rule"></a>

### result.rule : [<code>Rule</code>](#Rule)
<p>the rule that generated this result</p>

**Kind**: instance property of [<code>Result</code>](#Result)  

* * *

<a name="Result+highlight"></a>

### result.highlight : <code>String</code>
<p>highlighted text from the source file indicating where the issue was optionally including some context. For resources, this is either the source or target string, where-ever the problem occurred.</p>

**Kind**: instance property of [<code>Result</code>](#Result)  

* * *

<a name="Result+id"></a>

### result.id : <code>String</code> \| <code>undefined</code>
<p>for rule that check resources, this is the id of of the resource that generated this result</p>

**Kind**: instance property of [<code>Result</code>](#Result)  

* * *

<a name="Result+source"></a>

### result.source : <code>String</code> \| <code>undefined</code>
<p>for rule that check resources, this is the source string of the resource that generated this result</p>

**Kind**: instance property of [<code>Result</code>](#Result)  

* * *

<a name="Result+lineNumber"></a>

### result.lineNumber : <code>Number</code> \| <code>undefined</code>
<p>if the parser included location information in the intermediate representation, this gives the line number in the source file where the problem occurred</p>

**Kind**: instance property of [<code>Result</code>](#Result)  

* * *

<a name="Result+charNumber"></a>

### result.charNumber : <code>Number</code> \| <code>undefined</code>
<p>if the parser included location information in the intermediate representation, this gives the character number within the line in the source file where the problem occurred</p>

**Kind**: instance property of [<code>Result</code>](#Result)  

* * *

<a name="Result+endLineNumber"></a>

### result.endLineNumber : <code>Number</code> \| <code>undefined</code>
<p>if the parser included location information in the intermediate representation, this gives the last line number in the source file where the problem occurred</p>

**Kind**: instance property of [<code>Result</code>](#Result)  

* * *

<a name="Result+endCharNumber"></a>

### result.endCharNumber : <code>Number</code> \| <code>undefined</code>
<p>if the parser included location information in the intermediate representation, this gives the last character number within the line in the source file where the problem occurred</p>

**Kind**: instance property of [<code>Result</code>](#Result)  

* * *

<a name="Result+locale"></a>

### result.locale : <code>String</code> \| <code>undefined</code>
<p>for locale-sensitive rules, this gives an indication of which locale generated this result</p>

**Kind**: instance property of [<code>Result</code>](#Result)  

* * *

<a name="Result+fix"></a>

### result.fix : [<code>Fix</code>](#Fix) \| <code>undefined</code>
<p>An object which contains info needed for the [Fixer](#Fixer) to perform the fix for this result</p>

**Kind**: instance property of [<code>Result</code>](#Result)  

* * *

<a name="Rule"></a>

## *Rule*
<p>Represent an ilib-lint rule.</p>

**Kind**: global abstract class  

* *[Rule](#Rule)*
    * *[new Rule([options])](#new_Rule_new)*
    * **[.name](#Rule+name) : <code>string</code>**
    * **[.description](#Rule+description) : <code>string</code>**
    * *[.link](#Rule+link) : <code>string</code> \| <code>undefined</code>*
    * *[.type](#Rule+type) : <code>string</code>*
    * *[.sourceLocale](#Rule+sourceLocale) : <code>string</code>*
    * *[.getName()](#Rule+getName) ⇒ <code>String</code>*
    * *[.getDescription()](#Rule+getDescription) ⇒ <code>String</code>*
    * *[.getLink()](#Rule+getLink) ⇒ <code>String</code> \| <code>undefined</code>*
    * *[.getRuleType()](#Rule+getRuleType) ⇒ <code>String</code>*
    * *[.getSourceLocale()](#Rule+getSourceLocale) ⇒ <code>String</code>*
    * **[.match(options)](#Rule+match) ⇒ [<code>Result</code>](#Result) \| [<code>Array.&lt;Result&gt;</code>](#Result) \| <code>undefined</code>**


* * *

<a name="new_Rule_new"></a>

### *new Rule([options])*
<p>Construct an ilib-lint rule. Rules in plugins should implement this
abstract class.</p>


| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | <p>options to the constructor</p> |
| [options.sourceLocale] | <code>String</code> | <p>the source locale of the files being linted</p> |
| [options.getLogger] | <code>function</code> | <p>a callback function provided by the linter to retrieve the log4js logger</p> |


* * *

<a name="Rule+name"></a>

### **rule.name : <code>string</code>**
<p>name of the rule. This should be a string with a dash-separated
set of words (kebab or dash case). Example: &quot;resource-match-whitespace&quot;</p>
<p>Subclass must define this property.</p>

**Kind**: instance abstract property of [<code>Rule</code>](#Rule)  
**Read only**: true  

* * *

<a name="Rule+description"></a>

### **rule.description : <code>string</code>**
<p>General description of the type of problems that this rule is
testing for. This description is not related to particular matches, so
it cannot be more specific. Examples:</p>
<ul>
<li>&quot;translation should use the appropriate quote style&quot;</li>
<li>&quot;parameters to the translation wrapper function must not be concatenated&quot;</li>
<li>&quot;translation should match the whitespace of the source string&quot;</li>
</ul>
<p>Subclass must define this property.</p>

**Kind**: instance abstract property of [<code>Rule</code>](#Rule)  
**Read only**: true  

* * *

<a name="Rule+link"></a>

### *rule.link : <code>string</code> \| <code>undefined</code>*
<p>Optional web link that gives more complete explanation about the Rule
and how to resolve the problem.</p>
<p>Subclass should define this property.</p>

**Kind**: instance property of [<code>Rule</code>](#Rule)  
**Read only**: true  

* * *

<a name="Rule+type"></a>

### *rule.type : <code>string</code>*
<p>Type of intermediate representation that this rule can process. Rules can
be any type as long as there is a parser that produces that type. By convention,
there are a few types that are already defined:</p>
<ul>
<li>resource - This checks a translated Resource instance with a source string
and a translation string for a given locale. For example, a rule that checks that
substitution parameters that exist in the source string also are
given in the target string. Typically, resource files like po, properties, or xliff
are parsed into an array of Resource instances as its intermediate representations.</li>
<li>line - This rule checks single lines of a file. eg. a rule to
check the parameters to a function call.</li>
<li>string - This rule checks the entire file as a single string. Often, this type
of representation is used with source code files that are checked with regular
expressions, which often mean declarative rules.</li>
<li>{other} - You can choose to return any other string here that uniquely identifies the
representation that a parser produces.</li>
</ul>
<p>Typically, a full parser for a programming language will return something like
an abstract syntax tree as an intermediate format. For example, the acorn parser
for javascript returns an abstract syntax tree in JSTree format. The parser may
choose to return the string &quot;ast-jstree&quot; as its identifier, as long as there are
rules that are looking for that same string. The parser can return any string it
likes just as long as there are rules that know how to check it.</p>
<p>Subclass should define this property to indicate that
it's meant for a specific type of representation (unless it's meant for the default &quot;string&quot;).</p>

**Kind**: instance property of [<code>Rule</code>](#Rule)  
**Read only**: true  

* * *

<a name="Rule+sourceLocale"></a>

### *rule.sourceLocale : <code>string</code>*
<p>Source locale for this rule.</p>

**Kind**: instance property of [<code>Rule</code>](#Rule)  
**Read only**: true  

* * *

<a name="Rule+getName"></a>

### *rule.getName() ⇒ <code>String</code>*
<p>Get the name of the rule. This should be a string with a dash-separated
set of words (kebab or dash case). Example: &quot;resource-match-whitespace&quot;</p>
<p>Subclass must define [Rule.name](Rule.name).</p>

**Kind**: instance method of [<code>Rule</code>](#Rule)  
**Returns**: <code>String</code> - <p>the name of this rule</p>  

* * *

<a name="Rule+getDescription"></a>

### *rule.getDescription() ⇒ <code>String</code>*
<p>Return a general description of the type of problems that this rule is
testing for. This description is not related to particular matches, so
it cannot be more specific. Examples:</p>
<ul>
<li>&quot;translation should use the appropriate quote style&quot;</li>
<li>&quot;parameters to the translation wrapper function must not be concatenated&quot;</li>
<li>&quot;translation should match the whitespace of the source string&quot;</li>
</ul>
<p>Subclass must define [Rule.description](Rule.description).</p>

**Kind**: instance method of [<code>Rule</code>](#Rule)  
**Returns**: <code>String</code> - <p>a general description of the type of problems that this rule is
testing for</p>  

* * *

<a name="Rule+getLink"></a>

### *rule.getLink() ⇒ <code>String</code> \| <code>undefined</code>*
<p>Return the optional web link that gives more complete explanation about the Rule
and how to resolve the problem.</p>
<p>Subclass should define [Rule.link](Rule.link).</p>

**Kind**: instance method of [<code>Rule</code>](#Rule)  
**Returns**: <code>String</code> \| <code>undefined</code> - <p>an URL to a web page that explains the problem this rule checks for</p>  

* * *

<a name="Rule+getRuleType"></a>

### *rule.getRuleType() ⇒ <code>String</code>*
<p>Type of intermediate representation that this rule can process. Rules can
be any type as long as there is a parser that produces that type.</p>

**Kind**: instance method of [<code>Rule</code>](#Rule)  
**Returns**: <code>String</code> - <p>a string that names the type of intermediate representation
that this rule knows how to check</p>  
**See**: [Rule.type](Rule.type)

Subclass should define [Rule.type](Rule.type).  

* * *

<a name="Rule+getSourceLocale"></a>

### *rule.getSourceLocale() ⇒ <code>String</code>*
<p>Get the source locale for this rule.</p>

**Kind**: instance method of [<code>Rule</code>](#Rule)  
**Returns**: <code>String</code> - <p>the source locale for this rule</p>  

* * *

<a name="Rule+match"></a>

### **rule.match(options) ⇒ [<code>Result</code>](#Result) \| [<code>Array.&lt;Result&gt;</code>](#Result) \| <code>undefined</code>**
<p>Test whether or not this rule matches the input. If so, produce [Result](#Result) instances
that document what the problems are.</p>

**Kind**: instance abstract method of [<code>Rule</code>](#Rule)  
**Returns**: [<code>Result</code>](#Result) \| [<code>Array.&lt;Result&gt;</code>](#Result) \| <code>undefined</code> - <p>a Result instance describing the problem if
the rule check fails for this locale, or an array of such Result instances if
there are multiple problems with the same input, or <code>undefined</code> if there is no
problem found (ie. the rule does not match).</p>  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | <p>The options object as per the description</p> |
| options.ir | [<code>IntermediateRepresentation</code>](#IntermediateRepresentation) | <p>The intermediate representation of the file to check</p> |
| options.locale | <code>String</code> | <p>the locale against which this rule should be checked. Some rules are locale-sensitive, others not.</p> |
| options.file | <code>string</code> | <p>the file where the resource came from</p> |
| [options.parameters] | <code>object</code> | <p>optional additional parameters for this rule from the configuration file</p> |


* * *

<a name="Serializer"></a>

## *Serializer*
<p>common SPI for serializer plugins</p>
<p>A serializer converts an IntermediateRepresentation into a SourceFile instance
that can be written back to disk. For example, an xliff serializer can take
an array of Resource instances and convert it into xliff file format and set
that as the content of the SourceFile it produces.</p>

**Kind**: global abstract class  

* *[Serializer](#Serializer)*
    * *[new Serializer([options])](#new_Serializer_new)*
    * **[.serialize(representations)](#Serializer+serialize) ⇒ [<code>SourceFile</code>](#SourceFile)**


* * *

<a name="new_Serializer_new"></a>

### *new Serializer([options])*
<p>Construct a new serializer instance.</p>


| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | <p>options to the constructor</p> |
| [options.getLogger] | <code>function</code> | <p>a callback function provided by the linter to retrieve the log4js logger</p> |
| [options.settings] | <code>object</code> | <p>additional settings that can be passed to the serializer implementation</p> |


* * *

<a name="Serializer+serialize"></a>

### **serializer.serialize(representations) ⇒ [<code>SourceFile</code>](#SourceFile)**
<p>Serialize the given intermediate representation into a SourceFile instance. The
intermediate representation is an object that represents the parsed
form of the file. The serializer converts this object into a SourceFile
that can be written back to disk. For example, an xliff serializer can take
an intermediate representation that is an array of Resource instances and
convert it into xliff file format and set that as the content of the SourceFile
it produces.</p>
<p>The type of the intermediate representation that this serializer can handle
is specified in the <code>type</code> property of this instance passed to the constructor.
The linter will only allow this serializer to be used for intermediate
representations of that type so they must match. The source file that is
returned must have the same type as the intermediate representation.</p>

**Kind**: instance abstract method of [<code>Serializer</code>](#Serializer)  
**Returns**: [<code>SourceFile</code>](#SourceFile) - <p>the source file that contains the serialized form of the
given intermediate representation</p>  

| Param | Type | Description |
| --- | --- | --- |
| representations | [<code>Array.&lt;IntermediateRepresentation&gt;</code>](#IntermediateRepresentation) | <p>the array of intermediate representations to serialize</p> |


* * *

<a name="SourceFile"></a>

## SourceFile
<p>Represent a source file. Source files are text files that are
candidates for applying lint rules. Source files could mean any type of
text file. Examples may include source code files written in some programming
language, CSS files, HTML files, config files, resource files used to represent
translations for a product, or XLIFF files that contain all the translations
for a product. The source file may have subclasses that could represent data
that is more ephemeral, such as the rows of a database table. The URI passed
to the constructor should contain sufficient information for this class
or a subclass to be able to load the data from where it is stored.
The intention is that parsers classes should produce these
as a by-product of loading and parsing the text file on disk as a way of
representing the data that is being linted.</p>

**Kind**: global class  

* [SourceFile](#SourceFile)
    * [new SourceFile(uri, [options])](#new_SourceFile_new)
    * [.logger](#SourceFile+logger) : <code>function</code> \| <code>undefined</code>
    * [.filePath](#SourceFile+filePath) : <code>String</code>
    * [.raw](#SourceFile+raw) : <code>Buffer</code> \| <code>undefined</code>
    * [.content](#SourceFile+content) : <code>String</code>
    * [.type](#SourceFile+type) : <code>String</code>
    * [.dirty](#SourceFile+dirty) : <code>Boolean</code>
    * [.read()](#SourceFile+read)
    * [.getPath()](#SourceFile+getPath) ⇒ <code>String</code>
    * [.getRaw()](#SourceFile+getRaw) ⇒ <code>Buffer</code> \| <code>undefined</code>
    * [.getContent()](#SourceFile+getContent) ⇒ <code>String</code>
    * [.getLines()](#SourceFile+getLines) ⇒ <code>Array.&lt;String&gt;</code> \| <code>undefined</code>
    * ~~[.setLines(lines)](#SourceFile+setLines)~~
    * [.getLength()](#SourceFile+getLength) ⇒ <code>Number</code>
    * [.getType()](#SourceFile+getType) ⇒ <code>String</code>
    * [.isDirty()](#SourceFile+isDirty) ⇒ <code>Boolean</code>
    * [.write()](#SourceFile+write) ⇒ <code>Boolean</code>


* * *

<a name="new_SourceFile_new"></a>

### new SourceFile(uri, [options])
<p>Construct a new source file instance.</p>


| Param | Type | Description |
| --- | --- | --- |
| uri | <code>String</code> | <p>URI or path to the source file</p> |
| [options] | <code>Object</code> | <p>options to the constructor</p> |
| [options.file] | [<code>SourceFile</code>](#SourceFile) | <p>the source file to copy from. Other options will override the fields in this file</p> |
| [options.sourceLocale] | <code>String</code> | <p>the source locale of the files being linted</p> |
| [options.getLogger] | <code>function</code> | <p>a callback function provided by the linter to retrieve the log4js logger</p> |
| [options.type] | <code>String</code> | <p>the type of this file</p> |
| [options.content] | <code>String</code> | <p>the content of the file</p> |


* * *

<a name="SourceFile+logger"></a>

### sourceFile.logger : <code>function</code> \| <code>undefined</code>
<p>A callback function provided by the linter to retrieve the log4js logger</p>

**Kind**: instance property of [<code>SourceFile</code>](#SourceFile)  
**Access**: protected  

* * *

<a name="SourceFile+filePath"></a>

### sourceFile.filePath : <code>String</code>
<p>URI or path to the source file.</p>

**Kind**: instance property of [<code>SourceFile</code>](#SourceFile)  
**Access**: protected  

* * *

<a name="SourceFile+raw"></a>

### sourceFile.raw : <code>Buffer</code> \| <code>undefined</code>
<p>The raw bytes of the file stored in a Buffer.</p>

**Kind**: instance property of [<code>SourceFile</code>](#SourceFile)  
**Access**: protected  

* * *

<a name="SourceFile+content"></a>

### sourceFile.content : <code>String</code>
<p>The content of the file, stored as regular Javascript string
encoded in UTF-8.</p>

**Kind**: instance property of [<code>SourceFile</code>](#SourceFile)  
**Access**: protected  

* * *

<a name="SourceFile+type"></a>

### sourceFile.type : <code>String</code>
<p>The type of this file. This should match the type of
pipeline elements that process this same type of file. If the type
of a file is not known, then the type should be &quot;string&quot; which means
that the file is treated as a plain string of text.</p>

**Kind**: instance property of [<code>SourceFile</code>](#SourceFile)  
**Access**: protected  

* * *

<a name="SourceFile+dirty"></a>

### sourceFile.dirty : <code>Boolean</code>
<p>Whether or not the file has been written to disk.</p>

**Kind**: instance property of [<code>SourceFile</code>](#SourceFile)  
**Access**: protected  

* * *

<a name="SourceFile+read"></a>

### sourceFile.read()
<p>Read the contents of the file into memory.</p>

**Kind**: instance method of [<code>SourceFile</code>](#SourceFile)  
**Throws**:

- <p>Error if the file could not be read, or if it is not encoded in UTF-8</p>
- <code>Error</code> <p>if the file could not be read</p>

**Access**: protected  

* * *

<a name="SourceFile+getPath"></a>

### sourceFile.getPath() ⇒ <code>String</code>
<p>Get the URI or path to this source file.</p>

**Kind**: instance method of [<code>SourceFile</code>](#SourceFile)  
**Returns**: <code>String</code> - <p>URI or path to this source file</p>  

* * *

<a name="SourceFile+getRaw"></a>

### sourceFile.getRaw() ⇒ <code>Buffer</code> \| <code>undefined</code>
<p>Return the raw contents of the file as a Buffer of bytes.
This has not been converted into a Unicode string yet.</p>

**Kind**: instance method of [<code>SourceFile</code>](#SourceFile)  
**Returns**: <code>Buffer</code> \| <code>undefined</code> - <p>a buffer containing the bytes of this file</p>  

* * *

<a name="SourceFile+getContent"></a>

### sourceFile.getContent() ⇒ <code>String</code>
<p>Get the content of this file encoded as a regular Javascript
string.</p>

**Kind**: instance method of [<code>SourceFile</code>](#SourceFile)  
**Returns**: <code>String</code> - <p>the content of the file, encoded as a JS string</p>  

* * *

<a name="SourceFile+getLines"></a>

### sourceFile.getLines() ⇒ <code>Array.&lt;String&gt;</code> \| <code>undefined</code>
<p>Get the content of this file, encoded as an array of lines. Each
line has its trailing newline character removed.</p>

**Kind**: instance method of [<code>SourceFile</code>](#SourceFile)  
**Returns**: <code>Array.&lt;String&gt;</code> \| <code>undefined</code> - <p>the content as an array of lines</p>  

* * *

<a name="SourceFile+setLines"></a>

### ~~sourceFile.setLines(lines)~~
***Deprecated***

<p>Set the content of this file to the given array of lines. Do not call
this method any more. It is deprecated and will be removed soon.</p>

**Kind**: instance method of [<code>SourceFile</code>](#SourceFile)  

| Param | Type | Description |
| --- | --- | --- |
| lines | <code>Array.&lt;String&gt;</code> | <p>the lines to set as the content</p> |


* * *

<a name="SourceFile+getLength"></a>

### sourceFile.getLength() ⇒ <code>Number</code>
<p>The current length of the file content, including any modifications.
Note that this is the length of the content in Unicode characters,
not the length of the raw bytes.</p>

**Kind**: instance method of [<code>SourceFile</code>](#SourceFile)  
**Returns**: <code>Number</code> - <p>the length in Unicode characters of this file</p>  

* * *

<a name="SourceFile+getType"></a>

### sourceFile.getType() ⇒ <code>String</code>
<p>Return the type of this file. This should match the type of
pipeline elements that process this same type of file.</p>

**Kind**: instance method of [<code>SourceFile</code>](#SourceFile)  
**Returns**: <code>String</code> - <p>the type of this file</p>  

* * *

<a name="SourceFile+isDirty"></a>

### sourceFile.isDirty() ⇒ <code>Boolean</code>
<p>Return whether or not the content of this instance is
different than the content of the file on disk.</p>

**Kind**: instance method of [<code>SourceFile</code>](#SourceFile)  
**Returns**: <code>Boolean</code> - <p>true if the file is different than
the content of this instance, false otherwise</p>  

* * *

<a name="SourceFile+write"></a>

### sourceFile.write() ⇒ <code>Boolean</code>
<p>Write the file. If the path is given and it is different from the
path of the current file, then it is written to the other path.
Otherwise, this file will overwrite the source file. The path to
the file must exist first.</p>

**Kind**: instance method of [<code>SourceFile</code>](#SourceFile)  
**Returns**: <code>Boolean</code> - <p>true if the file was successfully written, false
if there was some error or if the file was not modified from the original</p>  

* * *

<a name="Transformer"></a>

## *Transformer*
<p>common SPI for transformer plugins</p>
<p>A transformer is a plugin that takes an intermediate representation of a
file and transforms it in some way, and returns a new intermediate
representation that is a modified version of the original. For example,
a filter transformer might remove some of the entries in the intermediate
representation that match a certain pattern, or it might
add new entries to the intermediate representation.</p>

**Kind**: global abstract class  

* *[Transformer](#Transformer)*
    * *[new Transformer([options])](#new_Transformer_new)*
    * **[.transform(representation, results)](#Transformer+transform) ⇒ [<code>IntermediateRepresentation</code>](#IntermediateRepresentation)**


* * *

<a name="new_Transformer_new"></a>

### *new Transformer([options])*
<p>Construct a new transformer instance.</p>


| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | <p>options to the constructor</p> |
| [options.getLogger] | <code>function</code> | <p>a callback function provided by</p> |
| [options.settings] | <code>object</code> | <p>additional settings that can be passed to the linter to retrieve the log4js logger</p> |


* * *

<a name="Transformer+transform"></a>

### **transformer.transform(representation, results) ⇒ [<code>IntermediateRepresentation</code>](#IntermediateRepresentation)**
<p>Transform the given intermediate representation and return a new
intermediate representation that is a modified version of the original.</p>

**Kind**: instance abstract method of [<code>Transformer</code>](#Transformer)  
**Returns**: [<code>IntermediateRepresentation</code>](#IntermediateRepresentation) - <p>the new intermediate representation
that is the transformed version of the original</p>  

| Param | Type | Description |
| --- | --- | --- |
| representation | [<code>IntermediateRepresentation</code>](#IntermediateRepresentation) | <p>the intermediate representation to transform</p> |
| results | [<code>Array.&lt;Result&gt;</code>](#Result) \| <code>undefined</code> | <p>the results of the rules that were applied earlier in the pipeline, or undefined if there are no results or if the rules have not been applied yet</p> |


* * *

<a name="withVisibleWhitespace"></a>

## withVisibleWhitespace ⇒ <code>string</code>
<p>Replace whitespace in input string with visible representations<p></p>
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

**Kind**: global constant  
**Returns**: <code>string</code> - <p>String in which whitespaces are replaced with visible representations</p>  
**Note**: If a non-string is passed on input, returned value will be an empty string.  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | <p>Input string</p> |


* * *

<a name="isKebabCase"></a>

## isKebabCase(str) ⇒ <code>boolean</code>
<p>Return true if the given string is written with kebab case. Kebab
case is where words are separated with dashes, looking like they
have been strung out on a kebab stick.</p>
<p>Example: this-is-kebab-case-text</p>

**Kind**: global function  
**Returns**: <code>boolean</code> - <p>true if the entire string is kebab case, and
false otherwise</p>  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>String</code> | <p>the string to test</p> |


* * *

<a name="isCamelCase"></a>

## isCamelCase(str) ⇒ <code>boolean</code>
<p>Return true if the given string is written with camel case. Camel
case is where words are not separated by spaces but the first letter
of each word is capitalized, looking like the humps of a camel.</p>
<p>Example: thisIsCamelCaseText</p>

**Kind**: global function  
**Returns**: <code>boolean</code> - <p>true if the entire string is kebab case, and
false otherwise</p>  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>String</code> | <p>the string to test</p> |


* * *

<a name="isSnakeCase"></a>

## isSnakeCase(str) ⇒ <code>boolean</code>
<p>Return true if the given string is written with snake case. Snake
case is where words are separated with underscores, looking like they
have been strung out horizontally like a snake.</p>
<p>Example: this_is_snake_case_text</p>

**Kind**: global function  
**Returns**: <code>boolean</code> - <p>true if the entire string is snake case, and
false otherwise</p>  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>String</code> | <p>the string to test</p> |


* * *

