## Classes

<dl>
<dt><a href="#DirItem">DirItem</a></dt>
<dd><p>Represent a directory item.</p>
<p>A directory item is the superclass of either a source file or a project.
Directories themselves are not represented.</p>
</dd>
<dt><a href="#FileType">FileType</a></dt>
<dd><p>Represent a type of file in an ilib-lint project.</p>
<p>Each file is classified into a particular file type. If
none of the file type definitions match, then the file will
be classified as being in the default &quot;unknown&quot; file type.
Files in the unknown file type are usually not processed.</p>
</dd>
<dt><a href="#FixerManager">FixerManager</a></dt>
<dd><p>Manages a collection of fixers that this instance of ilib-lint
knows about.</p>
</dd>
<dt><a href="#FormatterManager">FormatterManager</a></dt>
<dd><p>Manages a collection of formatters that this instance of ilib-lint
knows about.</p>
</dd>
<dt><a href="#LintableFile">LintableFile</a></dt>
<dd><p>Represent a source file</p>
</dd>
<dt><a href="#ParserManager">ParserManager</a></dt>
<dd><p>Manages a collection of parsers that this instance of ilib-lint
knows about.</p>
</dd>
<dt><a href="#PluginManager">PluginManager</a></dt>
<dd><p>Represent a plugin manager, which loads a list of plugins
and then maintains references to them</p>
</dd>
<dt><a href="#Project">Project</a></dt>
<dd><p>Represent an ilin-lint project.</p>
<p>A project is defined as a root directory and a configuration that
goes with it that tells the linter how to process files it finds
in that root directory. Subprojects can be nested inside of the
the top project as indicated by the presence of a new configuration
file in the subdirectory.</p>
</dd>
<dt><a href="#RuleManager">RuleManager</a></dt>
<dd><p>a class to manage all the possible rules</p>
</dd>
<dt><a href="#RuleSet">RuleSet</a></dt>
<dd><p>Represent a set of ilib-lint rules. The rule manager keeps
track of all the rules that are known to this run of the linter,
and a RuleSet is a named set of rule instances that have been
initialized with certain options for some or all of those rules.</p>
</dd>
<dt><a href="#FileConfigurationProvider">FileConfigurationProvider</a></dt>
<dd></dd>
<dt><a href="#FolderConfigurationProvider">FolderConfigurationProvider</a></dt>
<dd></dd>
<dt><a href="#AnsiConsoleFormatter">AnsiConsoleFormatter</a></dt>
<dd><p>Represent an output formatter for an ANSI console/terminal</p>
</dd>
<dt><a href="#ConfigBasedFormatter">ConfigBasedFormatter</a></dt>
<dd><p>Represent an output formatter for an ANSI console/terminal</p>
</dd>
<dt><a href="#BuiltinPlugin">BuiltinPlugin</a></dt>
<dd><p>ilib-lint plugin that can parse XLIFF files</p>
</dd>
<dt><a href="#LineParser">LineParser</a></dt>
<dd><p>Parser for plain text files that splits them by lines</p>
</dd>
<dt><a href="#LineSerializer">LineSerializer</a></dt>
<dd><p>Serializer for plain text files that splits them by lines</p>
</dd>
<dt><a href="#XliffParser">XliffParser</a></dt>
<dd><p>Parser for XLIFF files based on the ilib-xliff library.</p>
</dd>
<dt><a href="#XliffSerializer">XliffSerializer</a></dt>
<dd><p>Serializer for XLIFF files based on the ilib-xliff library.</p>
</dd>
<dt><a href="#StringParser">StringParser</a></dt>
<dd><p>Parser for plain text files that treats the whole file as a
simple string.</p>
</dd>
<dt><a href="#StringSerializer">StringSerializer</a></dt>
<dd><p>Serializer for plain text files that treats the whole file as a
simple string.</p>
</dd>
<dt><a href="#LineRegexpChecker">LineRegexpChecker</a></dt>
<dd><p>Source checker class that checks for regular expressions
that match in source code. This rule is a file checker that checks
the text of a file without really parsing it.</p>
</dd>
<dt><a href="#ResourceCamelCase">ResourceCamelCase</a></dt>
<dd><p>Class representing an ilib-lint programmatic rule for linting camel cased strings.</p>
</dd>
<dt><a href="#ResourceCompleteness">ResourceCompleteness</a></dt>
<dd><p>Rule to check that a resource has both source and target elements</p>
</dd>
<dt><a href="#ResourceDNTTerms">ResourceDNTTerms</a></dt>
<dd><p>Rule to ensure that Do Not Translate terms have not been translated;
i.e., if a DNT term appears in source, it has to appear in target as well</p>
</dd>
<dt><a href="#ResourceEdgeWhitespace">ResourceEdgeWhitespace</a></dt>
<dd><p>Rule to check that whitespaces on edges of target match those on edges of source</p>
</dd>
<dt><a href="#ResourceICUPluralTranslation">ResourceICUPluralTranslation</a></dt>
<dd><p>Represent an ilib-lint rule.</p>
</dd>
<dt><a href="#ResourceICUPlurals">ResourceICUPlurals</a></dt>
<dd><p>Represent an ilib-lint rule.</p>
</dd>
<dt><a href="#ResourceMatcher">ResourceMatcher</a></dt>
<dd><p>Resource checker class that checks that any regular expressions
that matches in the source also appears in the translation.</p>
</dd>
<dt><a href="#ResourceNoTranslation">ResourceNoTranslation</a></dt>
<dd><p>Represent an ilib-lint rule.</p>
</dd>
<dt><a href="#ResourceQuoteStyle">ResourceQuoteStyle</a></dt>
<dd><p>Represent an ilib-lint rule.</p>
</dd>
<dt><a href="#ResourceRule">ResourceRule</a></dt>
<dd></dd>
<dt><a href="#ResourceSnakeCase">ResourceSnakeCase</a></dt>
<dd><p>Class representing an ilib-lint programmatic rule for linting snake cased strings.</p>
</dd>
<dt><a href="#ResourceSourceChecker">ResourceSourceChecker</a></dt>
<dd><p>Resource checker class that checks that any regular expressions
that matches in the source also appears in the translation.</p>
</dd>
<dt><a href="#ResourceSourceICUPluralCategories">ResourceSourceICUPluralCategories</a></dt>
<dd><p>Verifies that categories of an ICU plural in a Resource&#39;s source are valid</p>
</dd>
<dt><a href="#ResourceSourceICUPluralParams">ResourceSourceICUPluralParams</a></dt>
<dd><p>Verifies that the &quot;one&quot; category of an ICU plural in a Resource&#39;s source
contains a replacement parameter. If it does not, it makes it more difficult
to translate to languages where there are more than one number in the &quot;one&quot;
category, such as Russian.</p>
</dd>
<dt><a href="#ResourceSourceICUPluralSyntax">ResourceSourceICUPluralSyntax</a></dt>
<dd><p>Verifies that syntax of an ICU plural in a Resource&#39;s source is valid</p>
</dd>
<dt><a href="#ResourceSourceICUUnexplainedParams">ResourceSourceICUUnexplainedParams</a></dt>
<dd><p>Check if replacement parameters mentioned in the English source string are
mentioned in the description field as well. Translators can do a much better
job of translating if they know what each replacement parameter represents.</p>
</dd>
<dt><a href="#ResourceStateChecker">ResourceStateChecker</a></dt>
<dd><p>Represent an ilib-lint rule.</p>
</dd>
<dt><a href="#ResourceTargetChecker">ResourceTargetChecker</a></dt>
<dd><p>Resource checker class that checks that any regular expressions
that matches in the source also appears in the translation.</p>
</dd>
<dt><a href="#ResourceUniqueKeys">ResourceUniqueKeys</a></dt>
<dd><p>Represent an ilib-lint rule.</p>
</dd>
<dt><a href="#ResourceXML">ResourceXML</a></dt>
<dd><p>Represent an ilib-lint rule.</p>
</dd>
<dt><a href="#SourceRegexpChecker">SourceRegexpChecker</a></dt>
<dd><p>Source checker class that checks for regular expressions
that match in source code. This rule is a file checker that checks
the text of a file without really parsing it.</p>
</dd>
</dl>

## Members

<dl>
<dt><a href="#severity">severity</a> : <code><a href="#Severity">Severity</a></code></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#typeMap">typeMap</a></dt>
<dd><p>Map the types in the declarative rules to a Rule subclass that handles
that type.</p>
</dd>
<dt><a href="#DeclarativeRuleTypes">DeclarativeRuleTypes</a></dt>
<dd><p>Allowed types of a declarative rule</p>
</dd>
<dt><a href="#defaultConfiguration">defaultConfiguration</a> : <code><a href="#Configuration">Configuration</a></code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#ResultComparator">ResultComparator(-1)</a></dt>
<dd><p>Compare two Result instances:</p>
<ol>
<li>alphabetically by source file path</li>
<li>numerically by line number within the source file</li>
</ol>
</dd>
<dt><a href="#concatIntlAstText">concatIntlAstText(astElements)</a> ⇒ <code>string</code></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#FixerClass">FixerClass</a> : <code>Class</code></dt>
<dd><p>Constructor of <a href="Fixer">Fixer</a> or its subclass</p>
</dd>
<dt><a href="#RegisteredFixerEntry">RegisteredFixerEntry</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#FixerRegistry">FixerRegistry</a> : <code>Object.&lt;string, RegisteredFixerEntry&gt;</code></dt>
<dd></dd>
<dt><a href="#Configuration">Configuration</a></dt>
<dd><p>Configuration for a project</p>
</dd>
<dt><a href="#DeclarativeFormatterDefinition">DeclarativeFormatterDefinition</a></dt>
<dd></dd>
<dt><a href="#Ruleset">Ruleset</a> : <code>Record.&lt;string, any&gt;</code></dt>
<dd><p>Some rules can be shared between file
  types and others are more specific to the file type. As such, it is
  sometimes convenient to to name a set of rules and refer to the whole set
  by its name instead of listing them all out. Ruleset is an object that
  configures each rule that should be included in that set. The rules are
  turned on with a value &quot;true&quot; or with a rule-specific option. They are
  turned off with a falsy value.</p>
</dd>
<dt><a href="#Filetype">Filetype</a></dt>
<dd></dd>
<dt><a href="#DeclarativeRuleDefinition">DeclarativeRuleDefinition</a></dt>
<dd></dd>
<dt><a href="#ExplicitTerms">ExplicitTerms</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#FileTerms">FileTerms</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#BaseRegExpCollection">BaseRegExpCollection</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#SourceRegExpCollection">SourceRegExpCollection</a> : <code><a href="#BaseRegExpCollection">BaseRegExpCollection</a></code></dt>
<dd></dd>
<dt><a href="#ExtendedRegExpCollection">ExtendedRegExpCollection</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#RegExpCollectionForLocale">RegExpCollectionForLocale</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#ModeLocaleOnly">ModeLocaleOnly</a> : <code>&quot;localeOnly&quot;</code></dt>
<dd><p>Allow only localized quotes in the target string. This also sets default result severity to &quot;error&quot;.</p>
</dd>
<dt><a href="#Severity">Severity</a> : <code>&quot;error&quot;</code> | <code>&quot;warning&quot;</code> | <code>&quot;suggestion&quot;</code></dt>
<dd><p>Result severity.</p>
</dd>
<dt><a href="#Modes">Modes</a> : <code><a href="#ModeLocaleOnly">ModeLocaleOnly</a></code></dt>
<dd><p>One-param rule configuration.</p>
</dd>
<dt><a href="#Configuration">Configuration</a> : <code><a href="#Modes">Modes</a></code></dt>
<dd><p>Parameters that can be set through rule configuration file.</p>
</dd>
</dl>

## Interfaces

<dl>
<dt><a href="#ConfigurationProvider">ConfigurationProvider</a></dt>
<dd></dd>
</dl>

<a name="ConfigurationProvider"></a>

## ConfigurationProvider
**Kind**: global interface  

* * *

<a name="ConfigurationProvider+loadConfiguration"></a>

### configurationProvider.loadConfiguration ⇒ [<code>Promise.&lt;Configuration&gt;</code>](#Configuration)
**Kind**: instance interface of [<code>ConfigurationProvider</code>](#ConfigurationProvider)  

* * *

<a name="DirItem"></a>

## *DirItem*
Represent a directory item.

A directory item is the superclass of either a source file or a project.
Directories themselves are not represented.

**Kind**: global abstract class  

* *[DirItem](#DirItem)*
    * *[new DirItem()](#new_DirItem_new)*
    * *[.getFilePath()](#DirItem+getFilePath) ⇒ <code>String</code>*
    * **[.parse()](#DirItem+parse) ⇒ <code>Array.&lt;IntermediateRepresentation&gt;</code>**
    * **[.findIssues(locales)](#DirItem+findIssues) ⇒ <code>Array.&lt;Result&gt;</code>**


* * *

<a name="new_DirItem_new"></a>

### *new DirItem()*
Construct a new directory item
The options parameter can contain any of the following properties:

- filePath {String} path to the file
- settings {Object} the settings from the ilib-lint config that
  apply to this file
- pluginManager {PluginManager} the plugin manager for this run of
  the ilib-lint tool


* * *

<a name="DirItem+getFilePath"></a>

### *dirItem.getFilePath() ⇒ <code>String</code>*
Return the file path for this source file.

**Kind**: instance method of [<code>DirItem</code>](#DirItem)  
**Returns**: <code>String</code> - the file path for this source file  

* * *

<a name="DirItem+parse"></a>

### **dirItem.parse() ⇒ <code>Array.&lt;IntermediateRepresentation&gt;</code>**
Parse the current directory item.

**Kind**: instance abstract method of [<code>DirItem</code>](#DirItem)  
**Returns**: <code>Array.&lt;IntermediateRepresentation&gt;</code> - the parsed
representations of this file  

* * *

<a name="DirItem+findIssues"></a>

### **dirItem.findIssues(locales) ⇒ <code>Array.&lt;Result&gt;</code>**
Check the directory item and return a list of issues found in it.

**Kind**: instance abstract method of [<code>DirItem</code>](#DirItem)  
**Returns**: <code>Array.&lt;Result&gt;</code> - a list of natch results  

| Param | Type | Description |
| --- | --- | --- |
| locales | <code>Array.&lt;Locale&gt;</code> | a set of locales to apply |


* * *

<a name="FileType"></a>

## FileType
Represent a type of file in an ilib-lint project.

Each file is classified into a particular file type. If
none of the file type definitions match, then the file will
be classified as being in the default "unknown" file type.
Files in the unknown file type are usually not processed.

**Kind**: global class  

* [FileType](#FileType)
    * [new FileType(options)](#new_FileType_new)
    * [.getParserClasses(extension)](#FileType+getParserClasses) ⇒ <code>Array.&lt;Class&gt;</code>
    * [.getRuleSetNames()](#FileType+getRuleSetNames) ⇒ <code>Array.&lt;String&gt;</code>
    * [.getRules()](#FileType+getRules) ⇒ <code>Array.&lt;Rule&gt;</code>


* * *

<a name="new_FileType_new"></a>

### new FileType(options)
Contructor a new instance of a file type. The options
for a file type must contain the following properties:

- name - the name or glob spec for this file type
- project - the Project that this file type is a part of

Additionally, the options may optionally contain the
following properties:

- locales (Array of String) - list of locales to use with this file type,
  which overrides the global locales for the project
- type (String) - specifies the way that files of this file type
  are parsed. This can be one of "resource", "source", "line", or
  "ast".
- template (String) - the path name template for this file type
  which shows how to extract the locale from the path
  name if the path includes it. Many file types do not
  include the locale in the path, and in those cases,
  the template can be left out.
- ruleset (Array of String) - a list of rule set names
  to use with this file type
- parsers (Array of String) - an array of names of parsers to
  apply to this file type. This is mainly useful when the source
  code is in a file with an unexpected or ambiguous file
  name extension. For example, a ".js" file may contain
  regular Javascript code, but it may also be React JSX
  code, or even Javascript with JSX and Flow type definitions.

The array of parsers will be used to attempt to parse each
source file. If a parser throws an exception/error while parsing,
the linter will note that an error occurred and move on to
the next parser to see if that one will work. If ALL parsers
fail for a particular file, then this tool will print an
error message to the output about it.


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | the options governing the construction of this file type as documented above |


* * *

<a name="FileType+getParserClasses"></a>

### fileType.getParserClasses(extension) ⇒ <code>Array.&lt;Class&gt;</code>
Return an array of classes of parsers to use with this file type.
If the parsers are not named explicitly in the configuration,
this method will check with the parser manager to find all parsers
that can parse files with the given file name extension. If there
are none available, this method returned undefined;

**Kind**: instance method of [<code>FileType</code>](#FileType)  
**Returns**: <code>Array.&lt;Class&gt;</code> - an array of parser classes to use with
files of this type.  

| Param | Type | Description |
| --- | --- | --- |
| extension | <code>String</code> | file name extension of the file being parsed |


* * *

<a name="FileType+getRuleSetNames"></a>

### fileType.getRuleSetNames() ⇒ <code>Array.&lt;String&gt;</code>
Return an array of names of rule sets.

**Kind**: instance method of [<code>FileType</code>](#FileType)  
**Returns**: <code>Array.&lt;String&gt;</code> - a list of rule set names  

* * *

<a name="FileType+getRules"></a>

### fileType.getRules() ⇒ <code>Array.&lt;Rule&gt;</code>
Return a rule set that contains all the rules in all of the rule set
definitions.

**Kind**: instance method of [<code>FileType</code>](#FileType)  
**Returns**: <code>Array.&lt;Rule&gt;</code> - a list of rule instances of all the rules in
all of the ruleset definitions  

* * *

<a name="FixerManager"></a>

## FixerManager
Manages a collection of fixers that this instance of ilib-lint
knows about.

**Kind**: global class  

* [FixerManager](#FixerManager)
    * [new FixerManager([options])](#new_FixerManager_new)
    * [.get(type, options)](#FixerManager+get) ⇒ <code>Fixer</code> \| <code>undefined</code>
    * [.add(fixerClasses)](#FixerManager+add)
    * [.size()](#FixerManager+size) ⇒ <code>Number</code>


* * *

<a name="new_FixerManager_new"></a>

### new FixerManager([options])
Create a new formatter manager.


| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | options controlling the construction of this object |
| [options.fixers] | [<code>Array.&lt;FixerClass&gt;</code>](#FixerClass) |  |


* * *

<a name="FixerManager+get"></a>

### fixerManager.get(type, options) ⇒ <code>Fixer</code> \| <code>undefined</code>
Instantiate a formatter for a requested type identifier,
to use it for applying Fixes.

**Kind**: instance method of [<code>FixerManager</code>](#FixerManager)  
**Returns**: <code>Fixer</code> \| <code>undefined</code> - instance of the Fixer if any is registered for given type  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>String</code> | type identifier for which a Fixer instance should be returned |
| options | <code>Object</code> \| <code>undefined</code> | options for this instance from the config file |


* * *

<a name="FixerManager+add"></a>

### fixerManager.add(fixerClasses)
Add a fixer subclass to this registry so that other code
can request instances for a given type identifier.

**Kind**: instance method of [<code>FixerManager</code>](#FixerManager)  

| Param | Type | Description |
| --- | --- | --- |
| fixerClasses | [<code>Array.&lt;FixerClass&gt;</code>](#FixerClass) | the list of fixer classes to add |


* * *

<a name="FixerManager+size"></a>

### fixerManager.size() ⇒ <code>Number</code>
Return how many rules this manager knows about.

**Kind**: instance method of [<code>FixerManager</code>](#FixerManager)  
**Returns**: <code>Number</code> - the number of rules this manager knows about.  

* * *

<a name="FormatterManager"></a>

## FormatterManager
Manages a collection of formatters that this instance of ilib-lint
knows about.

**Kind**: global class  
**Params**: <code>Object</code> options options controlling the construction of this object  

* [FormatterManager](#FormatterManager)
    * [new FormatterManager()](#new_FormatterManager_new)
    * [.get(name, options)](#FormatterManager+get) ⇒ <code>Formatter</code>
    * [.add(formatters)](#FormatterManager+add)
    * [.getDescriptions()](#FormatterManager+getDescriptions) ⇒ <code>Object</code>
    * [.size()](#FormatterManager+size) ⇒ <code>Number</code>


* * *

<a name="new_FormatterManager_new"></a>

### new FormatterManager()
Create a new formatter manager instance.


* * *

<a name="FormatterManager+get"></a>

### formatterManager.get(name, options) ⇒ <code>Formatter</code>
Return a formatter instance with the given name for use in
formatting the output.

**Kind**: instance method of [<code>FormatterManager</code>](#FormatterManager)  
**Returns**: <code>Formatter</code> - the formatter to use  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | name of the formatter to return |
| options | <code>Object</code> \| <code>undefined</code> | options for this instance of the formatter from the config file, if any |


* * *

<a name="FormatterManager+add"></a>

### formatterManager.add(formatters)
Add a list of formatter classes to this factory so that other code
can find them.

**Kind**: instance method of [<code>FormatterManager</code>](#FormatterManager)  

| Param | Type | Description |
| --- | --- | --- |
| formatters | <code>Array.&lt;(Class\|Object)&gt;</code> | the list of formatter classes or definitions to add |


* * *

<a name="FormatterManager+getDescriptions"></a>

### formatterManager.getDescriptions() ⇒ <code>Object</code>
Return an object where the properties are the formatter names and the
values are the formatter descriptions.

**Kind**: instance method of [<code>FormatterManager</code>](#FormatterManager)  
**Returns**: <code>Object</code> - the formatter names and descriptions  

* * *

<a name="FormatterManager+size"></a>

### formatterManager.size() ⇒ <code>Number</code>
Return how many rules this manager knows about.

**Kind**: instance method of [<code>FormatterManager</code>](#FormatterManager)  
**Returns**: <code>Number</code> - the number of rules this manager knows about.  

* * *

<a name="LintableFile"></a>

## LintableFile
Represent a source file

**Kind**: global class  

* [LintableFile](#LintableFile)
    * [new LintableFile(filePath, options, project)](#new_LintableFile_new)
    * [.irs](#LintableFile+irs) : <code>Array.&lt;IntermediateRepresentation&gt;</code>
    * [.getLocaleFromPath()](#LintableFile+getLocaleFromPath) ⇒ <code>String</code>
    * [.parse()](#LintableFile+parse) ⇒ <code>Array.&lt;IntermediateRepresentation&gt;</code>
    * [.findIssues(locales)](#LintableFile+findIssues) ⇒ <code>Array.&lt;Result&gt;</code>
    * [.getIRs()](#LintableFile+getIRs) ⇒ <code>Array.&lt;IntermediateRepresentation&gt;</code>
    * [.getStats()](#LintableFile+getStats) ⇒ <code>FileStats</code>


* * *

<a name="new_LintableFile_new"></a>

### new LintableFile(filePath, options, project)
Construct a source file instance
The options parameter can contain any of the following properties:


| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>String</code> | path to the source file |
| options | <code>Object</code> | options for constructing this source file |
| options.filetype | [<code>FileType</code>](#FileType) | file type of this source file |
| options.filePath | <code>String</code> | path to the file |
| [options.settings] | <code>object</code> | additional settings from the ilib-lint config that apply to this file |
| project | [<code>Project</code>](#Project) | the project where this file is located |


* * *

<a name="LintableFile+irs"></a>

### lintableFile.irs : <code>Array.&lt;IntermediateRepresentation&gt;</code>
**Kind**: instance property of [<code>LintableFile</code>](#LintableFile)  

* * *

<a name="LintableFile+getLocaleFromPath"></a>

### lintableFile.getLocaleFromPath() ⇒ <code>String</code>
Return the locale gleaned from the file path using the template in
the settings, or undefined if no locale could be found.

**Kind**: instance method of [<code>LintableFile</code>](#LintableFile)  
**Returns**: <code>String</code> - the locale gleaned from the path, or the empty
string if no locale could be found.  

* * *

<a name="LintableFile+parse"></a>

### lintableFile.parse() ⇒ <code>Array.&lt;IntermediateRepresentation&gt;</code>
Parse the current source file into a list of Intermediate Representaitons

**Kind**: instance method of [<code>LintableFile</code>](#LintableFile)  
**Returns**: <code>Array.&lt;IntermediateRepresentation&gt;</code> - the parsed representations
of this file  

* * *

<a name="LintableFile+findIssues"></a>

### lintableFile.findIssues(locales) ⇒ <code>Array.&lt;Result&gt;</code>
Check the current file and return a list of issues found in this file.
This method parses the source file and applies each rule in turn
using the given locales. Optionally, it also applies the available auto-fixes
and overwrites the underlying file depending if it's enabled in the project config options.

**Kind**: instance method of [<code>LintableFile</code>](#LintableFile)  
**Returns**: <code>Array.&lt;Result&gt;</code> - a list of natch results  

| Param | Type | Description |
| --- | --- | --- |
| locales | <code>Array.&lt;string&gt;</code> | a set of locales to apply |


* * *

<a name="LintableFile+getIRs"></a>

### lintableFile.getIRs() ⇒ <code>Array.&lt;IntermediateRepresentation&gt;</code>
Get the intermediate representations of this file.

**Kind**: instance method of [<code>LintableFile</code>](#LintableFile)  
**Returns**: <code>Array.&lt;IntermediateRepresentation&gt;</code> - the intermediate representations
of this file  

* * *

<a name="LintableFile+getStats"></a>

### lintableFile.getStats() ⇒ <code>FileStats</code>
Return the stats for the file after issues were found.

**Kind**: instance method of [<code>LintableFile</code>](#LintableFile)  
**Returns**: <code>FileStats</code> - the stats for the current file  

* * *

<a name="ParserManager"></a>

## ParserManager
Manages a collection of parsers that this instance of ilib-lint
knows about.

**Kind**: global class  
**Params**: <code>Object</code> options options controlling the construction of this object  

* [ParserManager](#ParserManager)
    * [new ParserManager()](#new_ParserManager_new)
    * [.get(extension)](#ParserManager+get) ⇒ <code>Array.&lt;Parser&gt;</code>
    * [.getByName(name)](#ParserManager+getByName) ⇒ <code>Parser</code> \| <code>undefined</code>
    * [.add(parsers)](#ParserManager+add)
    * [.getDescriptions()](#ParserManager+getDescriptions) ⇒ <code>Object</code>


* * *

<a name="new_ParserManager_new"></a>

### new ParserManager()
Create a new parser manager instance.


* * *

<a name="ParserManager+get"></a>

### parserManager.get(extension) ⇒ <code>Array.&lt;Parser&gt;</code>
Return a list of parsers for the given file name extension

**Kind**: instance method of [<code>ParserManager</code>](#ParserManager)  
**Returns**: <code>Array.&lt;Parser&gt;</code> - the array of parsers that handle
the given type of file  

| Param | Type | Description |
| --- | --- | --- |
| extension | <code>String</code> | the extension to get the parsers for |


* * *

<a name="ParserManager+getByName"></a>

### parserManager.getByName(name) ⇒ <code>Parser</code> \| <code>undefined</code>
Return the parser with the given name.

**Kind**: instance method of [<code>ParserManager</code>](#ParserManager)  
**Returns**: <code>Parser</code> \| <code>undefined</code> - the parser with the given name or undefined if
none was found with that name.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the name of the parser being sought |


* * *

<a name="ParserManager+add"></a>

### parserManager.add(parsers)
Add a list of parsers to this factory so that other code
can find them.

**Kind**: instance method of [<code>ParserManager</code>](#ParserManager)  

| Param | Type | Description |
| --- | --- | --- |
| parsers | <code>Array.&lt;Parser&gt;</code> | the list of parsers to add |


* * *

<a name="ParserManager+getDescriptions"></a>

### parserManager.getDescriptions() ⇒ <code>Object</code>
Return an object where the properties are the parser names and the
values are the parser descriptions.

**Kind**: instance method of [<code>ParserManager</code>](#ParserManager)  
**Returns**: <code>Object</code> - the parser names and descriptions  

* * *

<a name="PluginManager"></a>

## PluginManager
Represent a plugin manager, which loads a list of plugins
and then maintains references to them

**Kind**: global class  

* [PluginManager](#PluginManager)
    * [new PluginManager()](#new_PluginManager_new)
    * [.getParserManager()](#PluginManager+getParserManager) ⇒ [<code>ParserManager</code>](#ParserManager)
    * [.getFormatterManager()](#PluginManager+getFormatterManager) ⇒ [<code>FormatterManager</code>](#FormatterManager)
    * [.getFixerManager()](#PluginManager+getFixerManager) ⇒ [<code>FixerManager</code>](#FixerManager)
    * [.getRuleManager()](#PluginManager+getRuleManager) ⇒ [<code>RuleManager</code>](#RuleManager)
    * [.getRuleSet()](#PluginManager+getRuleSet) ⇒ [<code>FormatterManager</code>](#FormatterManager)
    * [.add(a)](#PluginManager+add)
    * [.load(names)](#PluginManager+load) ⇒ <code>Promise</code>


* * *

<a name="new_PluginManager_new"></a>

### new PluginManager()
Construct a new plugin manager.


* * *

<a name="PluginManager+getParserManager"></a>

### pluginManager.getParserManager() ⇒ [<code>ParserManager</code>](#ParserManager)
Return the parser manager for this plugin manager.
This manages both the built-in parsers, and the parsers
loaded from the plugins.

**Kind**: instance method of [<code>PluginManager</code>](#PluginManager)  
**Returns**: [<code>ParserManager</code>](#ParserManager) - the parser manager for this
plugin manager.  

* * *

<a name="PluginManager+getFormatterManager"></a>

### pluginManager.getFormatterManager() ⇒ [<code>FormatterManager</code>](#FormatterManager)
Return the formatter manager for this plugin manager. This
manages both the built-in formatters, and the formatters
loaded from the plugins.

**Kind**: instance method of [<code>PluginManager</code>](#PluginManager)  
**Returns**: [<code>FormatterManager</code>](#FormatterManager) - the formatter manager for this
plugin manager.  

* * *

<a name="PluginManager+getFixerManager"></a>

### pluginManager.getFixerManager() ⇒ [<code>FixerManager</code>](#FixerManager)
Return the fixer manager for this plugin manager. This
manages both the built-in fixers, and the fixers
loaded from the plugins.

**Kind**: instance method of [<code>PluginManager</code>](#PluginManager)  
**Returns**: [<code>FixerManager</code>](#FixerManager) - the fixer manager for this
plugin manager.  

* * *

<a name="PluginManager+getRuleManager"></a>

### pluginManager.getRuleManager() ⇒ [<code>RuleManager</code>](#RuleManager)
Return the rule manager for this plugin manager. This
manages both the built-in rules, and the rules
loaded from the plugins.

**Kind**: instance method of [<code>PluginManager</code>](#PluginManager)  
**Returns**: [<code>RuleManager</code>](#RuleManager) - the rule manager for this
plugin manager.  

* * *

<a name="PluginManager+getRuleSet"></a>

### pluginManager.getRuleSet() ⇒ [<code>FormatterManager</code>](#FormatterManager)
Return the rules in this manager. This is from both the
built-in rules and the rules loaded from the plugins.

**Kind**: instance method of [<code>PluginManager</code>](#PluginManager)  
**Returns**: [<code>FormatterManager</code>](#FormatterManager) - the rule set for this plugin manager.  

* * *

<a name="PluginManager+add"></a>

### pluginManager.add(a)
Add the already-loaded plugin to this manager.

**Kind**: instance method of [<code>PluginManager</code>](#PluginManager)  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>Plugin</code> | plugin to add |


* * *

<a name="PluginManager+load"></a>

### pluginManager.load(names) ⇒ <code>Promise</code>
Load the named plugin or plugins. If the names param is given
as a string, a single plugin is loaded. If it is an array of strings,
each named plugin is loaded. This method returns Promise

**Kind**: instance method of [<code>PluginManager</code>](#PluginManager)  
**Returns**: <code>Promise</code> - a promise to load the named plugins.  
**Accept**: <code>Array.&lt;Object&gt;</code> an array of promise statuses. The status
field will either be "fulfilled" and the value field will be the
Plugin instance, or "rejected" and the reason field will be filled
with a description of why the plugin could not be loaded.  
**Reject**: the plugins could not be found or loaded  

| Param | Type | Description |
| --- | --- | --- |
| names | <code>String</code> \| <code>Array.&lt;String&gt;</code> | name or names of plugins to load |


* * *

<a name="Project"></a>

## Project
Represent an ilin-lint project.

A project is defined as a root directory and a configuration that
goes with it that tells the linter how to process files it finds
in that root directory. Subprojects can be nested inside of the
the top project as indicated by the presence of a new configuration
file in the subdirectory.

**Kind**: global class  

* [Project](#Project)
    * [new Project(root, options, config)](#new_Project_new)
    * [.scan(paths)](#Project+scan)
    * [.init()](#Project+init) ⇒ <code>Promise</code>
    * [.getName()](#Project+getName) ⇒ <code>String</code>
    * [.getRoot()](#Project+getRoot) ⇒ <code>String</code>
    * [.getIncludes()](#Project+getIncludes) ⇒ <code>Array.&lt;String&gt;</code>
    * [.getExcludes()](#Project+getExcludes) ⇒ <code>Array.&lt;String&gt;</code>
    * [.getOptions()](#Project+getOptions) ⇒ <code>Array.&lt;String&gt;</code>
    * [.getSourceLocale()](#Project+getSourceLocale) ⇒ <code>String</code>
    * [.getLocales()](#Project+getLocales) ⇒ <code>Array.&lt;String&gt;</code>
    * [.getPluginManager()](#Project+getPluginManager) ⇒ [<code>PluginManager</code>](#PluginManager)
    * [.getParserManager()](#Project+getParserManager) ⇒ [<code>ParserManager</code>](#ParserManager)
    * [.getRuleManager()](#Project+getRuleManager) ⇒ [<code>RuleManager</code>](#RuleManager)
    * [.getFixerManager()](#Project+getFixerManager) ⇒ [<code>FixerManager</code>](#FixerManager)
    * [.getFileType(name)](#Project+getFileType) ⇒ [<code>FileType</code>](#FileType)
    * [.getFileTypeForPath(pathName)](#Project+getFileTypeForPath) ⇒ [<code>FileType</code>](#FileType)
    * [.add(item)](#Project+add)
    * [.get()](#Project+get) ⇒ [<code>Array.&lt;LintableFile&gt;</code>](#LintableFile)
    * [.findIssues()](#Project+findIssues) ⇒ <code>Array.&lt;Result&gt;</code>
    * [.getScore()](#Project+getScore) ⇒ <code>Number</code>
    * [.run()](#Project+run) ⇒ <code>Number</code>


* * *

<a name="new_Project_new"></a>

### new Project(root, options, config)
Construct a new project.


| Param | Type | Description |
| --- | --- | --- |
| root | <code>String</code> | root directory for this project |
| options | <code>Object</code> | properties controlling how this run of the linter works, mostly from the command-line options |
| config | <code>Object</code> | contents of a configuration file for this project |


* * *

<a name="Project+scan"></a>

### project.scan(paths)
Scan the given paths for files and subprojects to process later.
If this method finds a subproject, it will be added to the list
as well, and its scan method will be called.

**Kind**: instance method of [<code>Project</code>](#Project)  

| Param | Type | Description |
| --- | --- | --- |
| paths | <code>Array.&lt;String&gt;</code> | an array of paths to scan |


* * *

<a name="Project+init"></a>

### project.init() ⇒ <code>Promise</code>
Initialize this project. This returns a promise to load the
plugins and initializes them.

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: <code>Promise</code> - a promise to initialize the project  
**Accept**: <code>boolean</code> true when everything was initialized correct  
**Reject**: the initialization failed  

* * *

<a name="Project+getName"></a>

### project.getName() ⇒ <code>String</code>
Get the unique name of this project.

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: <code>String</code> - the unique name of this project.  

* * *

<a name="Project+getRoot"></a>

### project.getRoot() ⇒ <code>String</code>
Return the root directory for this project.

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: <code>String</code> - the path to the root directory of this project  

* * *

<a name="Project+getIncludes"></a>

### project.getIncludes() ⇒ <code>Array.&lt;String&gt;</code>
Return the includes list for this project.

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: <code>Array.&lt;String&gt;</code> - the includes for this project  

* * *

<a name="Project+getExcludes"></a>

### project.getExcludes() ⇒ <code>Array.&lt;String&gt;</code>
Return the excludes list for this project.

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: <code>Array.&lt;String&gt;</code> - the excludes for this project  

* * *

<a name="Project+getOptions"></a>

### project.getOptions() ⇒ <code>Array.&lt;String&gt;</code>
Return the options for this project.

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: <code>Array.&lt;String&gt;</code> - the options for this project  

* * *

<a name="Project+getSourceLocale"></a>

### project.getSourceLocale() ⇒ <code>String</code>
Get the source locale for this project. This is the locale in
which the strings and source code are written.

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: <code>String</code> - the source locale for this project.  

* * *

<a name="Project+getLocales"></a>

### project.getLocales() ⇒ <code>Array.&lt;String&gt;</code>
Return the list of global locales for this project.

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: <code>Array.&lt;String&gt;</code> - the list of global locales for this project  

* * *

<a name="Project+getPluginManager"></a>

### project.getPluginManager() ⇒ [<code>PluginManager</code>](#PluginManager)
Return the plugin manager for this project.

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: [<code>PluginManager</code>](#PluginManager) - the plugin manager for this project  

* * *

<a name="Project+getParserManager"></a>

### project.getParserManager() ⇒ [<code>ParserManager</code>](#ParserManager)
Return the parser manager for this project.

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: [<code>ParserManager</code>](#ParserManager) - the parser manager for this project  

* * *

<a name="Project+getRuleManager"></a>

### project.getRuleManager() ⇒ [<code>RuleManager</code>](#RuleManager)
Return the rule manager for this project.

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: [<code>RuleManager</code>](#RuleManager) - the rule manager for this project  

* * *

<a name="Project+getFixerManager"></a>

### project.getFixerManager() ⇒ [<code>FixerManager</code>](#FixerManager)
Return the fixer manager for this project.

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: [<code>FixerManager</code>](#FixerManager) - the fixer manager for this project  

* * *

<a name="Project+getFileType"></a>

### project.getFileType(name) ⇒ [<code>FileType</code>](#FileType)
Return the named file type definition. Projects have two
default file types that are always defined for every project:
"xliff", and "unknown".

- xliff - handles all *.xliff files using the XliffParser.
It uses the default resources rule set to perform all regular
resource checks.
- unknown - handles all file types that are not otherwise
matched. It does not perform any rule checks on any file.

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: [<code>FileType</code>](#FileType) - the requested file type, or undefined if
there is no such file type  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the name or the glob expression used to identify the requested file type |


* * *

<a name="Project+getFileTypeForPath"></a>

### project.getFileTypeForPath(pathName) ⇒ [<code>FileType</code>](#FileType)
Using the path mappings, find the file type that applies for
the given path. If no mappings apply, the "unkown" file type
will be returned.

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: [<code>FileType</code>](#FileType) - the file type instance that applies to
the given file.  

| Param | Type | Description |
| --- | --- | --- |
| pathName | <code>String</code> | the path to the file to test |


* * *

<a name="Project+add"></a>

### project.add(item)
Add a directory item to this project.

**Kind**: instance method of [<code>Project</code>](#Project)  

| Param | Type | Description |
| --- | --- | --- |
| item | [<code>DirItem</code>](#DirItem) | directory item to add |


* * *

<a name="Project+get"></a>

### project.get() ⇒ [<code>Array.&lt;LintableFile&gt;</code>](#LintableFile)
Return all directory items in this project.

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: [<code>Array.&lt;LintableFile&gt;</code>](#LintableFile) - the directory items in this project.  

* * *

<a name="Project+findIssues"></a>

### project.findIssues() ⇒ <code>Array.&lt;Result&gt;</code>
Find all issues with the files located within this project and
all subprojects, and return them together in an array.

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: <code>Array.&lt;Result&gt;</code> - a list of results  

* * *

<a name="Project+getScore"></a>

### project.getScore() ⇒ <code>Number</code>
Return the I18N Score of this project. The score is a number from
zero to 100 which gives the approximate localization readiness of
the whole project. The absolute number of the score is not as
important as the relative movement of the score, as the increase
in score shows an improvement in localizability.

In this particular score, errors are weighted most heavily,
followed by warnings at a medium level, and suggestions at a
very light level.

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: <code>Number</code> - the score (0-100) for this project.  

* * *

<a name="Project+run"></a>

### project.run() ⇒ <code>Number</code>
Find all issues in this project and all subprojects and print
them with the chosen formatter. This is the main loop.

**Kind**: instance method of [<code>Project</code>](#Project)  
**Returns**: <code>Number</code> - the exit value  

* * *

<a name="RuleManager"></a>

## RuleManager
a class to manage all the possible rules

**Kind**: global class  
**Params**: <code>Object</code> options options controlling the construction of this object  

* [RuleManager](#RuleManager)
    * [new RuleManager()](#new_RuleManager_new)
    * [.get(name, options)](#RuleManager+get) ⇒ <code>Rule</code> \| <code>undefined</code>
    * [.add(ruleConfig)](#RuleManager+add)
    * [.getRules()](#RuleManager+getRules) ⇒ <code>Array.&lt;Rule&gt;</code>
    * [.getDescriptions()](#RuleManager+getDescriptions) ⇒ <code>Object</code>
    * [.addRuleSetDefinition(name, ruleDefs)](#RuleManager+addRuleSetDefinition)
    * [.addRuleSetDefinitions(ruleDefs)](#RuleManager+addRuleSetDefinitions)
    * [.getRuleSetDefinition(name)](#RuleManager+getRuleSetDefinition) ⇒ <code>Object</code>
    * [.getRuleSetDefinitions()](#RuleManager+getRuleSetDefinitions) ⇒ <code>Object</code>
    * [.sizeRuleSetDefinitions()](#RuleManager+sizeRuleSetDefinitions) ⇒ <code>Number</code>
    * [.size()](#RuleManager+size) ⇒ <code>Number</code>


* * *

<a name="new_RuleManager_new"></a>

### new RuleManager()
Create new Rule manager instance.

There are two types of Rules out there: declarative and programmatic.
Declarative rules are based on regular expressions and are configured
through a simple json file which specifies the regular expressions and
some metadata. Programmatic rules are a little more complicated and
are declared through plugin code.

This factory function can create Rule instances out for any type of
rule.


* * *

<a name="RuleManager+get"></a>

### ruleManager.get(name, options) ⇒ <code>Rule</code> \| <code>undefined</code>
Return a rule instance for the given name.

**Kind**: instance method of [<code>RuleManager</code>](#RuleManager)  
**Returns**: <code>Rule</code> \| <code>undefined</code> - an instance of the required rule or undefined if
the rule cannot be found  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | name of the rule to return |
| options | <code>Object</code> \| <code>undefined</code> | options for this instance of the rule from the config file, if any |


* * *

<a name="RuleManager+add"></a>

### ruleManager.add(ruleConfig)
Register a new rule for the rule factory. The rule can be either declarative
or programmatic. If the `ruleConfig` parameter is an object, the rule is
considered to be declarative. If it is a function, it is considered to be
programmatic.

A declarative config for a Rule must contain the following properties:

- type - the type of the Rule required. This can be one of the declarative
  types. The values for declarative types are limited to the following:
    - resource-matcher - Checks resources for matches. Any matches for
      the given regular expression the source string must also appear
      somewhere in the target string.
    - resource-source - Check resources for matches of the regular
      expression in the source string. Matches in the source string trigger
      issues to be generated.
    - resource-target - Check resources for matches of the regular
      expression in the target string. Matches in the target string trigger
      issues to be generated.
    - sourcefile - Check source files for matches of the regular
      expression. Matches in the source file trigger issues to be generated.
- name - the dash-separated unique name of this Rule, such as
  "resource-check-plurals"
- description - a general description of what this rule is checking for
- note - a one-line note that will be printed on screen when the
  check fails. Example: "The URL {matchString} did not appear in the
  the target." Currently, {matchString} is the only replacement
  param that is supported.

An attempt to register a declarative rule that does not have all of the above
properties will result in an exception being thrown.

A programmatic config must be given as a subclass of the Rule class. The
class will be queried for its metadata in order to register it properly.

Both the declarative and programmatic rules define a unique name, which is
what is used to instantiate the rule using the RuleFactory function.

**Kind**: instance method of [<code>RuleManager</code>](#RuleManager)  
**Throws**:

- if the required properties are not given in the declarative config
or the Class does not inherit from Rule.


| Param | Type | Description |
| --- | --- | --- |
| ruleConfig | <code>Object</code> \| <code>Class</code> \| <code>Array.&lt;(Object\|Class)&gt;</code> | the configuration for the new rule or rules to register |


* * *

<a name="RuleManager+getRules"></a>

### ruleManager.getRules() ⇒ <code>Array.&lt;Rule&gt;</code>
Return all the rule classes that this manager knows about.

**Kind**: instance method of [<code>RuleManager</code>](#RuleManager)  
**Returns**: <code>Array.&lt;Rule&gt;</code> - an array of rule classes that this manager
knows about  

* * *

<a name="RuleManager+getDescriptions"></a>

### ruleManager.getDescriptions() ⇒ <code>Object</code>
Return an object where the properties are the rule names and the
values are the rule descriptions.

**Kind**: instance method of [<code>RuleManager</code>](#RuleManager)  
**Returns**: <code>Object</code> - the rule names and descriptions  

* * *

<a name="RuleManager+addRuleSetDefinition"></a>

### ruleManager.addRuleSetDefinition(name, ruleDefs)
Add a ruleset definition to this rule manager.

**Kind**: instance method of [<code>RuleManager</code>](#RuleManager)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the name of this ruleset definition |
| ruleDefs | <code>Object</code> | definitions of rules in this definition and their optional parameters |


* * *

<a name="RuleManager+addRuleSetDefinitions"></a>

### ruleManager.addRuleSetDefinitions(ruleDefs)
Add an object full of ruleset definitions to this rule manager.

**Kind**: instance method of [<code>RuleManager</code>](#RuleManager)  

| Param | Type | Description |
| --- | --- | --- |
| ruleDefs | <code>Object</code> | an object where the properties are the rule name, and the values are the rule definitions. |


* * *

<a name="RuleManager+getRuleSetDefinition"></a>

### ruleManager.getRuleSetDefinition(name) ⇒ <code>Object</code>
Return the named ruleset definition.

**Kind**: instance method of [<code>RuleManager</code>](#RuleManager)  
**Returns**: <code>Object</code> - the ruleset definition  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the name of the ruleset definition to return |


* * *

<a name="RuleManager+getRuleSetDefinitions"></a>

### ruleManager.getRuleSetDefinitions() ⇒ <code>Object</code>
Return all of the ruleset definitions. The definitions are
returned as an object where the properties are the name of the
ruleset, and the value is an array that names all of the
rules in that set.

**Kind**: instance method of [<code>RuleManager</code>](#RuleManager)  
**Returns**: <code>Object</code> - the ruleset definitions  

* * *

<a name="RuleManager+sizeRuleSetDefinitions"></a>

### ruleManager.sizeRuleSetDefinitions() ⇒ <code>Number</code>
Return the number of named ruleset definitions that are
known by this instance of the rule manager.

**Kind**: instance method of [<code>RuleManager</code>](#RuleManager)  
**Returns**: <code>Number</code> - the number of named ruleset definitions  

* * *

<a name="RuleManager+size"></a>

### ruleManager.size() ⇒ <code>Number</code>
Return how many rules this manager knows about.

**Kind**: instance method of [<code>RuleManager</code>](#RuleManager)  
**Returns**: <code>Number</code> - the number of rules this manager knows about.  

* * *

<a name="RuleSet"></a>

## RuleSet
Represent a set of ilib-lint rules. The rule manager keeps
track of all the rules that are known to this run of the linter,
and a RuleSet is a named set of rule instances that have been
initialized with certain options for some or all of those rules.

**Kind**: global class  

* [RuleSet](#RuleSet)
    * [new RuleSet(rules)](#new_RuleSet_new)
    * [.addRule(rule)](#RuleSet+addRule)
    * [.add(rules)](#RuleSet+add)
    * [.removeRule(name)](#RuleSet+removeRule)
    * [.getRule(name)](#RuleSet+getRule) ⇒ <code>Rule</code>
    * [.getRules(type)](#RuleSet+getRules) ⇒ <code>Array.&lt;Rule&gt;</code>
    * [.getSize()](#RuleSet+getSize) ⇒ <code>Number</code>


* * *

<a name="new_RuleSet_new"></a>

### new RuleSet(rules)
Construct an ilib-lint rule set.


| Param | Type | Description |
| --- | --- | --- |
| rules | <code>Array.&lt;Rule&gt;</code> | a list of rules to initialize this set |


* * *

<a name="RuleSet+addRule"></a>

### ruleSet.addRule(rule)
Add a rule instnace to this rule set.

**Kind**: instance method of [<code>RuleSet</code>](#RuleSet)  

| Param | Type | Description |
| --- | --- | --- |
| rule | <code>Rule</code> | the instance to add |


* * *

<a name="RuleSet+add"></a>

### ruleSet.add(rules)
Add rule instances to this rule set.
If a rule is added that already exists in the set, it will
override the previous definition. This way, the rule is
only ever added once.

**Kind**: instance method of [<code>RuleSet</code>](#RuleSet)  

| Param | Type | Description |
| --- | --- | --- |
| rules | <code>Array.&lt;Rule&gt;</code> | a list of rule instances to add |


* * *

<a name="RuleSet+removeRule"></a>

### ruleSet.removeRule(name)
Remove a rule from the set. This might happen if a user explicitly sets
a rule to "false" in the set in order to turn off a rule that was turned
on by a different set.

**Kind**: instance method of [<code>RuleSet</code>](#RuleSet)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | unique name of the rule to remove |


* * *

<a name="RuleSet+getRule"></a>

### ruleSet.getRule(name) ⇒ <code>Rule</code>
Return the rule instance with the given name.

**Kind**: instance method of [<code>RuleSet</code>](#RuleSet)  
**Returns**: <code>Rule</code> - a rule instance with the given name, or undefined
if the rule is not part of this set  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | unique name of the rule |


* * *

<a name="RuleSet+getRules"></a>

### ruleSet.getRules(type) ⇒ <code>Array.&lt;Rule&gt;</code>
Return a list of rule instances in this set.

**Kind**: instance method of [<code>RuleSet</code>](#RuleSet)  
**Returns**: <code>Array.&lt;Rule&gt;</code> - a list of rule instances  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>String</code> | optional parameter that restricts the type of rules returned. If no type is specified, all rules are returned. |


* * *

<a name="RuleSet+getSize"></a>

### ruleSet.getSize() ⇒ <code>Number</code>
Return the number of rules in this set.

**Kind**: instance method of [<code>RuleSet</code>](#RuleSet)  
**Returns**: <code>Number</code> - the number of rules in this set  

* * *

<a name="AnsiConsoleFormatter"></a>

## AnsiConsoleFormatter
Represent an output formatter for an ANSI console/terminal

**Kind**: global class  

* [AnsiConsoleFormatter](#AnsiConsoleFormatter)
    * [new AnsiConsoleFormatter()](#new_AnsiConsoleFormatter_new)
    * [.format(result)](#AnsiConsoleFormatter+format) ⇒ <code>String</code>


* * *

<a name="new_AnsiConsoleFormatter_new"></a>

### new AnsiConsoleFormatter()
Construct an formatter instance.


* * *

<a name="AnsiConsoleFormatter+format"></a>

### ansiConsoleFormatter.format(result) ⇒ <code>String</code>
Format the given result with the current formatter and return the
formatted string.

**Kind**: instance method of [<code>AnsiConsoleFormatter</code>](#AnsiConsoleFormatter)  
**Returns**: <code>String</code> - the formatted result  

| Param | Type | Description |
| --- | --- | --- |
| result | <code>Result</code> | the result to format |


* * *

<a name="BuiltinPlugin"></a>

## BuiltinPlugin
ilib-lint plugin that can parse XLIFF files

**Kind**: global class  

* [BuiltinPlugin](#BuiltinPlugin)
    * [new BuiltinPlugin()](#new_BuiltinPlugin_new)
    * [.getParsers()](#BuiltinPlugin+getParsers) ⇒ <code>Array.&lt;Parser&gt;</code>
    * [.getSerializers()](#BuiltinPlugin+getSerializers) ⇒ <code>Array.&lt;Parser&gt;</code>
    * [.getRules()](#BuiltinPlugin+getRules)
    * [.getRuleSets()](#BuiltinPlugin+getRuleSets)
    * [.getFormatters()](#BuiltinPlugin+getFormatters)


* * *

<a name="new_BuiltinPlugin_new"></a>

### new BuiltinPlugin()
Create a new xliff plugin instance.


* * *

<a name="BuiltinPlugin+getParsers"></a>

### builtinPlugin.getParsers() ⇒ <code>Array.&lt;Parser&gt;</code>
For a "parser" type of plugin, this returns a list of Parser classes
that this plugin implements.

**Kind**: instance method of [<code>BuiltinPlugin</code>](#BuiltinPlugin)  
**Returns**: <code>Array.&lt;Parser&gt;</code> - list of Parser classes implemented by this
plugin  

* * *

<a name="BuiltinPlugin+getSerializers"></a>

### builtinPlugin.getSerializers() ⇒ <code>Array.&lt;Parser&gt;</code>
For a "serializer" type of plugin, this returns a list of Serializer classes
that this plugin implements.

**Kind**: instance method of [<code>BuiltinPlugin</code>](#BuiltinPlugin)  
**Returns**: <code>Array.&lt;Parser&gt;</code> - list of Serializer classes implemented by this
plugin  

* * *

<a name="BuiltinPlugin+getRules"></a>

### builtinPlugin.getRules()
**Kind**: instance method of [<code>BuiltinPlugin</code>](#BuiltinPlugin)  

* * *

<a name="BuiltinPlugin+getRuleSets"></a>

### builtinPlugin.getRuleSets()
**Kind**: instance method of [<code>BuiltinPlugin</code>](#BuiltinPlugin)  

* * *

<a name="BuiltinPlugin+getFormatters"></a>

### builtinPlugin.getFormatters()
**Kind**: instance method of [<code>BuiltinPlugin</code>](#BuiltinPlugin)  

* * *

<a name="LineParser"></a>

## LineParser
Parser for plain text files that splits them by lines

**Kind**: global class  

* [LineParser](#LineParser)
    * [new LineParser()](#new_LineParser_new)
    * [.parse(sourceFile)](#LineParser+parse) ⇒ <code>Array.&lt;IntermediateRepresentation&gt;</code>


* * *

<a name="new_LineParser_new"></a>

### new LineParser()
Construct a new plugin.


* * *

<a name="LineParser+parse"></a>

### lineParser.parse(sourceFile) ⇒ <code>Array.&lt;IntermediateRepresentation&gt;</code>
Parse the current file into an intermediate representation.

**Kind**: instance method of [<code>LineParser</code>](#LineParser)  
**Returns**: <code>Array.&lt;IntermediateRepresentation&gt;</code> - the intermediate representations of
the source file  

| Param | Type | Description |
| --- | --- | --- |
| sourceFile | <code>SourceFile</code> | the file to be parsed |


* * *

<a name="LineSerializer"></a>

## LineSerializer
Serializer for plain text files that splits them by lines

**Kind**: global class  

* [LineSerializer](#LineSerializer)
    * [new LineSerializer()](#new_LineSerializer_new)
    * [.serialize(ir)](#LineSerializer+serialize) ⇒ <code>SourceFile</code>


* * *

<a name="new_LineSerializer_new"></a>

### new LineSerializer()
Construct a new plugin.


* * *

<a name="LineSerializer+serialize"></a>

### lineSerializer.serialize(ir) ⇒ <code>SourceFile</code>
Convert the intermediate representation back into a source file.

**Kind**: instance method of [<code>LineSerializer</code>](#LineSerializer)  
**Returns**: <code>SourceFile</code> - the source file with the contents of the intermediate
representation  

| Param | Type | Description |
| --- | --- | --- |
| ir | <code>IntermediateRepresentation</code> | the intermediate representation to convert |


* * *

<a name="XliffParser"></a>

## XliffParser
Parser for XLIFF files based on the ilib-xliff library.

**Kind**: global class  

* [XliffParser](#XliffParser)
    * [new XliffParser()](#new_XliffParser_new)
    * [.parse(sourceFile)](#XliffParser+parse) ⇒ <code>Array.&lt;IntermediateRepresentation&gt;</code>


* * *

<a name="new_XliffParser_new"></a>

### new XliffParser()
Construct a new plugin.


* * *

<a name="XliffParser+parse"></a>

### xliffParser.parse(sourceFile) ⇒ <code>Array.&lt;IntermediateRepresentation&gt;</code>
Parse the current file into an intermediate representation.

**Kind**: instance method of [<code>XliffParser</code>](#XliffParser)  
**Returns**: <code>Array.&lt;IntermediateRepresentation&gt;</code> - the intermediate representations of
the source file  

| Param | Type | Description |
| --- | --- | --- |
| sourceFile | <code>SourceFile</code> | the file to be parsed |


* * *

<a name="XliffSerializer"></a>

## XliffSerializer
Serializer for XLIFF files based on the ilib-xliff library.

**Kind**: global class  

* [XliffSerializer](#XliffSerializer)
    * [new XliffSerializer()](#new_XliffSerializer_new)
    * [.serialize(ir)](#XliffSerializer+serialize) ⇒ <code>SourceFile</code>


* * *

<a name="new_XliffSerializer_new"></a>

### new XliffSerializer()
Construct a new plugin.


* * *

<a name="XliffSerializer+serialize"></a>

### xliffSerializer.serialize(ir) ⇒ <code>SourceFile</code>
Convert the intermediate representation back into a source file.

**Kind**: instance method of [<code>XliffSerializer</code>](#XliffSerializer)  
**Returns**: <code>SourceFile</code> - the source file with the contents of the intermediate
representation  

| Param | Type | Description |
| --- | --- | --- |
| ir | <code>IntermediateRepresentation</code> | the intermediate representation to convert |


* * *

<a name="StringParser"></a>

## StringParser
Parser for plain text files that treats the whole file as a
simple string.

**Kind**: global class  

* [StringParser](#StringParser)
    * [new StringParser()](#new_StringParser_new)
    * [.parse()](#StringParser+parse)
    * [.write(ir)](#StringParser+write)


* * *

<a name="new_StringParser_new"></a>

### new StringParser()
Construct a new plugin.


* * *

<a name="StringParser+parse"></a>

### stringParser.parse()
Parse the current file into an intermediate representation.

**Kind**: instance method of [<code>StringParser</code>](#StringParser)  

* * *

<a name="StringParser+write"></a>

### stringParser.write(ir)
**Kind**: instance method of [<code>StringParser</code>](#StringParser)  

| Param | Type |
| --- | --- |
| ir | <code>IntermediateRepresentation</code> | 


* * *

<a name="StringSerializer"></a>

## StringSerializer
Serializer for plain text files that treats the whole file as a
simple string.

**Kind**: global class  

* [StringSerializer](#StringSerializer)
    * [new StringSerializer()](#new_StringSerializer_new)
    * [.serialize(ir)](#StringSerializer+serialize) ⇒ <code>SourceFile</code>


* * *

<a name="new_StringSerializer_new"></a>

### new StringSerializer()
Construct a new plugin.


* * *

<a name="StringSerializer+serialize"></a>

### stringSerializer.serialize(ir) ⇒ <code>SourceFile</code>
Convert the intermediate representation back into a source file.

**Kind**: instance method of [<code>StringSerializer</code>](#StringSerializer)  
**Returns**: <code>SourceFile</code> - the source file with the contents of the intermediate
representation  

| Param | Type | Description |
| --- | --- | --- |
| ir | <code>IntermediateRepresentation</code> | the intermediate representation to convert |


* * *

<a name="LineRegexpChecker"></a>

## LineRegexpChecker
Source checker class that checks for regular expressions
that match in source code. This rule is a file checker that checks
the text of a file without really parsing it.

**Kind**: global class  

* [LineRegexpChecker](#LineRegexpChecker)
    * [new LineRegexpChecker(options)](#new_LineRegexpChecker_new)
    * [.match()](#LineRegexpChecker+match)


* * *

<a name="new_LineRegexpChecker_new"></a>

### new LineRegexpChecker(options)
Construct a new declarative regular expression-based source checker.

The options must contain the following required properties:

- name - a unique name for this rule
- description - a one-line description of what this rule checks for.
  Example: "Check that the source does not contain calls to function X"
- note - a one-line note that will be printed on screen when the
  regexp matches (ie. the check fails). Example: "The file foo.java contained
  a call to function X, which is deprecated."
  (Currently, 'matchString' is the only replacement
  param that is supported.)
- sourceLocale - locale (if any) of the source
- link - an URL to a document that explains this rule in more detail
- severity - severity of the results of this rule. This should be one of
  "error", "warning", or "suggestion".
- regexps - an array of strings that encode regular expressions to
  look for


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | options as documented above |


* * *

<a name="LineRegexpChecker+match"></a>

### lineRegexpChecker.match()
**Kind**: instance method of [<code>LineRegexpChecker</code>](#LineRegexpChecker)  

* * *

<a name="ResourceCamelCase"></a>

## ResourceCamelCase
Class representing an ilib-lint programmatic rule for linting camel cased strings.

**Kind**: global class  

* [ResourceCamelCase](#ResourceCamelCase)
    * [new ResourceCamelCase(options)](#new_ResourceCamelCase_new)
    * [.matchString(params)](#ResourceCamelCase+matchString) ⇒ <code>Result</code> \| <code>undefined</code>
    * [.isCamelCase(string)](#ResourceCamelCase+isCamelCase) ⇒ <code>boolean</code>


* * *

<a name="new_ResourceCamelCase_new"></a>

### new ResourceCamelCase(options)
Create a ResourceCamelCase rule instance.


| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> |  |
| [options.param] | <code>object</code> |  |
| [options.param.except] | <code>Array.&lt;string&gt;</code> | An array of strings to exclude from the rule. |


* * *

<a name="ResourceCamelCase+matchString"></a>

### resourceCamelCase.matchString(params) ⇒ <code>Result</code> \| <code>undefined</code>
Check if a source string is in camel case and if the target string is the same as the source.

**Kind**: instance method of [<code>ResourceCamelCase</code>](#ResourceCamelCase)  
**Returns**: <code>Result</code> \| <code>undefined</code> - A Result with severity 'error' if the source string is in camel case and target string is not the same as the source string, otherwise undefined.  

| Param | Type |
| --- | --- |
| params | <code>Object</code> | 


* * *

<a name="ResourceCamelCase+isCamelCase"></a>

### resourceCamelCase.isCamelCase(string) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>ResourceCamelCase</code>](#ResourceCamelCase)  
**Returns**: <code>boolean</code> - Returns true for a string that is in camel case (matches one of the regular expressions declared in the constructor).
Otherwise, returns false.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| string | <code>string</code> | A non-empty string to check. |


* * *

<a name="ResourceCompleteness"></a>

## ResourceCompleteness
Rule to check that a resource has both source and target elements

**Kind**: global class  

* [ResourceCompleteness](#ResourceCompleteness)
    * [.name](#ResourceCompleteness+name)
    * [.description](#ResourceCompleteness+description)
    * [.link](#ResourceCompleteness+link)
    * [.matchString(params)](#ResourceCompleteness+matchString) ⇒ <code>Array.&lt;Result&gt;</code> \| <code>undefined</code>


* * *

<a name="ResourceCompleteness+name"></a>

### resourceCompleteness.name
**Kind**: instance property of [<code>ResourceCompleteness</code>](#ResourceCompleteness)  
**Read only**: true  

* * *

<a name="ResourceCompleteness+description"></a>

### resourceCompleteness.description
**Kind**: instance property of [<code>ResourceCompleteness</code>](#ResourceCompleteness)  
**Read only**: true  

* * *

<a name="ResourceCompleteness+link"></a>

### resourceCompleteness.link
**Kind**: instance property of [<code>ResourceCompleteness</code>](#ResourceCompleteness)  
**Read only**: true  

* * *

<a name="ResourceCompleteness+matchString"></a>

### resourceCompleteness.matchString(params) ⇒ <code>Array.&lt;Result&gt;</code> \| <code>undefined</code>
Check that a given resource has both source and target tags set

**Kind**: instance method of [<code>ResourceCompleteness</code>](#ResourceCompleteness)  
**Returns**: <code>Array.&lt;Result&gt;</code> \| <code>undefined</code> - the results  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | a parameters object |
| params.source | <code>string</code> | the source string |
| params.target | <code>string</code> | the target string |
| params.resource | <code>Resource</code> | the resource being checked |
| params.file | <code>string</code> | the file where the resource came from |


* * *

<a name="ResourceDNTTerms"></a>

## ResourceDNTTerms
Rule to ensure that Do Not Translate terms have not been translated;
i.e., if a DNT term appears in source, it has to appear in target as well

**Kind**: global class  

* [ResourceDNTTerms](#ResourceDNTTerms)
    * _instance_
        * [.name](#ResourceDNTTerms+name)
        * [.description](#ResourceDNTTerms+description)
        * [.link](#ResourceDNTTerms+link)
        * [._dntTerms](#ResourceDNTTerms+_dntTerms) : <code>Array.&lt;string&gt;</code>
        * [.matchString(props)](#ResourceDNTTerms+matchString) ⇒ <code>Array.&lt;Result&gt;</code> \| <code>undefined</code>
    * _static_
        * [.parseTermsFromJsonFile(path)](#ResourceDNTTerms.parseTermsFromJsonFile)
        * [.parseTermsFromTxtFile()](#ResourceDNTTerms.parseTermsFromTxtFile)


* * *

<a name="ResourceDNTTerms+name"></a>

### resourceDNTTerms.name
**Kind**: instance property of [<code>ResourceDNTTerms</code>](#ResourceDNTTerms)  
**Read only**: true  

* * *

<a name="ResourceDNTTerms+description"></a>

### resourceDNTTerms.description
**Kind**: instance property of [<code>ResourceDNTTerms</code>](#ResourceDNTTerms)  
**Read only**: true  

* * *

<a name="ResourceDNTTerms+link"></a>

### resourceDNTTerms.link
**Kind**: instance property of [<code>ResourceDNTTerms</code>](#ResourceDNTTerms)  
**Read only**: true  

* * *

<a name="ResourceDNTTerms+_dntTerms"></a>

### resourceDNTTerms.\_dntTerms : <code>Array.&lt;string&gt;</code>
**Kind**: instance property of [<code>ResourceDNTTerms</code>](#ResourceDNTTerms)  
**Access**: protected  
**Read only**: true  

* * *

<a name="ResourceDNTTerms+matchString"></a>

### resourceDNTTerms.matchString(props) ⇒ <code>Array.&lt;Result&gt;</code> \| <code>undefined</code>
Check that if a given resource has a DNT term in the source, then
it also exists in the target

**Kind**: instance method of [<code>ResourceDNTTerms</code>](#ResourceDNTTerms)  
**Returns**: <code>Array.&lt;Result&gt;</code> \| <code>undefined</code> - the results  

| Param | Type | Description |
| --- | --- | --- |
| props | <code>Object</code> |  |
| props.source | <code>string</code> | the source string |
| props.target | <code>string</code> | the target string |
| props.resource | <code>Resource</code> | the resource being checked |
| props.file | <code>string</code> | the file where the resource came from |


* * *

<a name="ResourceDNTTerms.parseTermsFromJsonFile"></a>

### ResourceDNTTerms.parseTermsFromJsonFile(path)
Parse DNT terms from a JSON `string[]` file

**Kind**: static method of [<code>ResourceDNTTerms</code>](#ResourceDNTTerms)  

| Param | Description |
| --- | --- |
| path | Path to a DNT dictionary stored as JSON `string[]` file |


* * *

<a name="ResourceDNTTerms.parseTermsFromTxtFile"></a>

### ResourceDNTTerms.parseTermsFromTxtFile()
Parse DNT terms from a text file by treating each line in file as a separate term

While parsing, it excludes empty lines and trims leading/trailing whitespace on each line

**Kind**: static method of [<code>ResourceDNTTerms</code>](#ResourceDNTTerms)  

* * *

<a name="ResourceEdgeWhitespace"></a>

## ResourceEdgeWhitespace
Rule to check that whitespaces on edges of target match those on edges of source

**Kind**: global class  

* [ResourceEdgeWhitespace](#ResourceEdgeWhitespace)
    * [.name](#ResourceEdgeWhitespace+name)
    * [.description](#ResourceEdgeWhitespace+description)
    * [.link](#ResourceEdgeWhitespace+link)
    * [.matchString()](#ResourceEdgeWhitespace+matchString)


* * *

<a name="ResourceEdgeWhitespace+name"></a>

### resourceEdgeWhitespace.name
**Kind**: instance property of [<code>ResourceEdgeWhitespace</code>](#ResourceEdgeWhitespace)  
**Read only**: true  

* * *

<a name="ResourceEdgeWhitespace+description"></a>

### resourceEdgeWhitespace.description
**Kind**: instance property of [<code>ResourceEdgeWhitespace</code>](#ResourceEdgeWhitespace)  
**Read only**: true  

* * *

<a name="ResourceEdgeWhitespace+link"></a>

### resourceEdgeWhitespace.link
**Kind**: instance property of [<code>ResourceEdgeWhitespace</code>](#ResourceEdgeWhitespace)  
**Read only**: true  

* * *

<a name="ResourceEdgeWhitespace+matchString"></a>

### resourceEdgeWhitespace.matchString()
**Kind**: instance method of [<code>ResourceEdgeWhitespace</code>](#ResourceEdgeWhitespace)  

* * *

<a name="ResourceICUPluralTranslation"></a>

## ResourceICUPluralTranslation
Represent an ilib-lint rule.

**Kind**: global class  

* [ResourceICUPluralTranslation](#ResourceICUPluralTranslation)
    * [new ResourceICUPluralTranslation()](#new_ResourceICUPluralTranslation_new)
    * [.matchString()](#ResourceICUPluralTranslation+matchString)


* * *

<a name="new_ResourceICUPluralTranslation_new"></a>

### new ResourceICUPluralTranslation()
Make a new rule instance.


* * *

<a name="ResourceICUPluralTranslation+matchString"></a>

### resourceICUPluralTranslation.matchString()
Check a string in a resource for missing translations of plurals or selects.

**Kind**: instance method of [<code>ResourceICUPluralTranslation</code>](#ResourceICUPluralTranslation)  

* * *

<a name="ResourceICUPlurals"></a>

## ResourceICUPlurals
Represent an ilib-lint rule.

**Kind**: global class  

* * *

<a name="new_ResourceICUPlurals_new"></a>

### new ResourceICUPlurals()
Make a new rule instance.


* * *

<a name="ResourceMatcher"></a>

## ResourceMatcher
Resource checker class that checks that any regular expressions
that matches in the source also appears in the translation.

**Kind**: global class  

* [ResourceMatcher](#ResourceMatcher)
    * [new ResourceMatcher(options)](#new_ResourceMatcher_new)
    * [.checkString()](#ResourceMatcher+checkString)


* * *

<a name="new_ResourceMatcher_new"></a>

### new ResourceMatcher(options)
Construct a new regular expression-based resource checker.

The options must contain the following required properties:

- name - a unique name for this rule
- description - a one-line description of what this rule checks for.
  Example: "Check that URLs in the source also appear in the target"
- note - a one-line note that will be printed on screen when the
  check fails. Example: "The URL {matchString} did not appear in the
  the target." (Currently, matchString is the only replacement
  param that is supported.)
- sourceLocale - locale (if any) of the source
- link - an URL to a document that explains this rule in more detail
- severity - severity of the results of this rule. This should be one of
  "error", "warning", or "suggestion".
- regexps - an array of strings that encode regular expressions to
  look for


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | options as documented above |


* * *

<a name="ResourceMatcher+checkString"></a>

### resourceMatcher.checkString()
**Kind**: instance method of [<code>ResourceMatcher</code>](#ResourceMatcher)  

* * *

<a name="ResourceNoTranslation"></a>

## ResourceNoTranslation
Represent an ilib-lint rule.

**Kind**: global class  

* [ResourceNoTranslation](#ResourceNoTranslation)
    * [new ResourceNoTranslation(options)](#new_ResourceNoTranslation_new)
    * [.matchString()](#ResourceNoTranslation+matchString)


* * *

<a name="new_ResourceNoTranslation_new"></a>

### new ResourceNoTranslation(options)
Make a new rule instance.


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | options as documented above |


* * *

<a name="ResourceNoTranslation+matchString"></a>

### resourceNoTranslation.matchString()
**Kind**: instance method of [<code>ResourceNoTranslation</code>](#ResourceNoTranslation)  

* * *

<a name="ResourceQuoteStyle"></a>

## ResourceQuoteStyle
Represent an ilib-lint rule.

**Kind**: global class  

* [ResourceQuoteStyle](#ResourceQuoteStyle)
    * [new ResourceQuoteStyle([options])](#new_ResourceQuoteStyle_new)
    * [.matchString(params)](#ResourceQuoteStyle+matchString)


* * *

<a name="new_ResourceQuoteStyle_new"></a>

### new ResourceQuoteStyle([options])
Make a new rule instance.


| Param | Type |
| --- | --- |
| [options] | <code>object</code> | 
| [options.sourceLocale] | <code>string</code> | 
| [options.param] | [<code>Configuration</code>](#Configuration) | 


* * *

<a name="ResourceQuoteStyle+matchString"></a>

### resourceQuoteStyle.matchString(params)
**Kind**: instance method of [<code>ResourceQuoteStyle</code>](#ResourceQuoteStyle)  

| Param | Type |
| --- | --- |
| params | <code>Object</code> | 
| params.source | <code>string</code> \| <code>undefined</code> | 
| params.target | <code>string</code> \| <code>undefined</code> | 
| params.resource | <code>Resource</code> | 
| params.file | <code>string</code> | 


* * *

<a name="ResourceRule"></a>

## ResourceRule
**Kind**: global class  

* [ResourceRule](#ResourceRule)
    * [new ResourceRule(options)](#new_ResourceRule_new)
    * [.locales](#ResourceRule+locales) : <code>Set.&lt;string&gt;</code> \| <code>undefined</code>
    * [.skipLocales](#ResourceRule+skipLocales) : <code>Set.&lt;string&gt;</code> \| <code>undefined</code>
    * [.getRuleType()](#ResourceRule+getRuleType)
    * *[.matchString(params)](#ResourceRule+matchString) ⇒ <code>Result</code> \| <code>Array.&lt;Result&gt;</code> \| <code>undefined</code>*
    * [.match()](#ResourceRule+match)


* * *

<a name="new_ResourceRule_new"></a>

### new ResourceRule(options)
Construct a new resource checker rule.

If a subclass defines a property "locales" with the
value being a Set of locale lang-specs, then this
class will ensure that the rule is only applied to
resources that match one of the lang-specs in the
the set. If the subclass defines a property "skipLocales", with
the value being a Set of locale lang-specs, then this class will
ensure that the rule is only applied to resources that do not match
any of the lang-specs in the set.


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | options as documented above |


* * *

<a name="ResourceRule+locales"></a>

### resourceRule.locales : <code>Set.&lt;string&gt;</code> \| <code>undefined</code>
Ensure that the rule is only applied to resources that match one of
the lang-specs in the the set.

These should be language specifiers (e.g. "it", not "it-IT").

**Kind**: instance property of [<code>ResourceRule</code>](#ResourceRule)  
**Access**: protected  

* * *

<a name="ResourceRule+skipLocales"></a>

### resourceRule.skipLocales : <code>Set.&lt;string&gt;</code> \| <code>undefined</code>
Ensure that the rule is only applied to resources that do not match
any of the lang-specs in the set.

These should be language specifiers (e.g. "it", not "it-IT").

**Kind**: instance property of [<code>ResourceRule</code>](#ResourceRule)  
**Access**: protected  

* * *

<a name="ResourceRule+getRuleType"></a>

### resourceRule.getRuleType()
All rules of this type are resource rules.

**Kind**: instance method of [<code>ResourceRule</code>](#ResourceRule)  

* * *

<a name="ResourceRule+matchString"></a>

### *resourceRule.matchString(params) ⇒ <code>Result</code> \| <code>Array.&lt;Result&gt;</code> \| <code>undefined</code>*
Check a string pair for problems. In various resources, there are
sometimes no source string or no target string and the source or target
parameters may be undefined or the empty string. It is up to the subclass
to determine what to do with that situation. For plural or array
resources, this method will be called multiple times, once for each pair
of array entries, or for each pair of plural category strings.

**Kind**: instance abstract method of [<code>ResourceRule</code>](#ResourceRule)  
**Returns**: <code>Result</code> \| <code>Array.&lt;Result&gt;</code> \| <code>undefined</code> - any results
found in this string or undefined if no problems were
found.  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | parameters for the string matching |
| params.source | <code>String</code> \| <code>undefined</code> | the source string to match against |
| params.target | <code>String</code> \| <code>undefined</code> | the target string to match |
| params.file | <code>String</code> | the file path where the resources came from |
| params.resource | <code>Resource</code> | the resource that contains the source and/or target string |


* * *

<a name="ResourceRule+match"></a>

### resourceRule.match()
**Kind**: instance method of [<code>ResourceRule</code>](#ResourceRule)  

* * *

<a name="ResourceSnakeCase"></a>

## ResourceSnakeCase
Class representing an ilib-lint programmatic rule for linting snake cased strings.

**Kind**: global class  

* [ResourceSnakeCase](#ResourceSnakeCase)
    * [new ResourceSnakeCase(options)](#new_ResourceSnakeCase_new)
    * [.matchString(params)](#ResourceSnakeCase+matchString) ⇒ <code>Result</code> \| <code>undefined</code>
    * [.isSnakeCase(string)](#ResourceSnakeCase+isSnakeCase) ⇒ <code>boolean</code>


* * *

<a name="new_ResourceSnakeCase_new"></a>

### new ResourceSnakeCase(options)
Create a ResourceSnakeCase rule instance.


| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> |  |
| [options.param] | <code>object</code> |  |
| [options.param.except] | <code>Array.&lt;string&gt;</code> | An array of strings to exclude from the rule. |


* * *

<a name="ResourceSnakeCase+matchString"></a>

### resourceSnakeCase.matchString(params) ⇒ <code>Result</code> \| <code>undefined</code>
Check if a source string is in snake case and if the target string is the same as the source.

**Kind**: instance method of [<code>ResourceSnakeCase</code>](#ResourceSnakeCase)  
**Returns**: <code>Result</code> \| <code>undefined</code> - A Result with severity 'error' if the source string is in snake case and target string is not the same as the source string, otherwise undefined.  

| Param | Type |
| --- | --- |
| params | <code>Object</code> | 


* * *

<a name="ResourceSnakeCase+isSnakeCase"></a>

### resourceSnakeCase.isSnakeCase(string) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>ResourceSnakeCase</code>](#ResourceSnakeCase)  
**Returns**: <code>boolean</code> - Returns true for a string that is in snake case (matches one of the regular expressions declared in the constructor).
Otherwise, returns false.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| string | <code>string</code> | A non-empty string to check. |


* * *

<a name="ResourceSourceChecker"></a>

## ResourceSourceChecker
Resource checker class that checks that any regular expressions
that matches in the source also appears in the translation.

**Kind**: global class  

* [ResourceSourceChecker](#ResourceSourceChecker)
    * [new ResourceSourceChecker(options)](#new_ResourceSourceChecker_new)
    * [.checkString()](#ResourceSourceChecker+checkString)


* * *

<a name="new_ResourceSourceChecker_new"></a>

### new ResourceSourceChecker(options)
Construct a new regular expression-based resource checker.

The options must contain the following required properties:

- name - a unique name for this rule
- description - a one-line description of what this rule checks for.
  Example: "Check that URLs in the source conform to proper URL syntax"
- note - a one-line note that will be printed on screen when the
  check fails. Example: "The URL {matchString} is not well-formed."
  (Currently, matchString is the only replacement
  param that is supported.)
- regexps - an array of strings that encode regular expressions to
  look for


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | options as documented above |


* * *

<a name="ResourceSourceChecker+checkString"></a>

### resourceSourceChecker.checkString()
**Kind**: instance method of [<code>ResourceSourceChecker</code>](#ResourceSourceChecker)  

* * *

<a name="ResourceStateChecker"></a>

## ResourceStateChecker
Represent an ilib-lint rule.

**Kind**: global class  

* [ResourceStateChecker](#ResourceStateChecker)
    * [new ResourceStateChecker(options)](#new_ResourceStateChecker_new)
    * [.match()](#ResourceStateChecker+match)


* * *

<a name="new_ResourceStateChecker_new"></a>

### new ResourceStateChecker(options)
Make a new rule instance. The options parameter can have
a "param" property in it that will contain one of the
following types of values:

- string - all Resource instances should have a state value
  equal to this value
- array of string - all Resource instances should have
  a state value that is one of the values contained in
  this array

If there is no "param" property (ie. the user just put
`"resource-state-checker": true,` into their ruleset
configuration), then this checker will check that all
Resource instances have the state field value of
"translated".


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | options as documented above |


* * *

<a name="ResourceStateChecker+match"></a>

### resourceStateChecker.match()
**Kind**: instance method of [<code>ResourceStateChecker</code>](#ResourceStateChecker)  

* * *

<a name="ResourceTargetChecker"></a>

## ResourceTargetChecker
Resource checker class that checks that any regular expressions
that matches in the source also appears in the translation.

**Kind**: global class  

* [ResourceTargetChecker](#ResourceTargetChecker)
    * [new ResourceTargetChecker(options)](#new_ResourceTargetChecker_new)
    * [.checkString()](#ResourceTargetChecker+checkString)


* * *

<a name="new_ResourceTargetChecker_new"></a>

### new ResourceTargetChecker(options)
Construct a new regular expression-based resource checker.

The options must contain the following required properties:

- name - a unique name for this rule
- description - a one-line description of what this rule checks for.
  Example: "Check that URLs in the target are valid."
- note - a one-line note that will be printed on screen when the
  check fails. Example: "The URL {matchString} is not valid."
  (Currently, matchString is the only replacement
  param that is supported.)
- regexps - an array of strings that encode regular expressions to
  look for


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | options as documented above |


* * *

<a name="ResourceTargetChecker+checkString"></a>

### resourceTargetChecker.checkString()
**Kind**: instance method of [<code>ResourceTargetChecker</code>](#ResourceTargetChecker)  

* * *

<a name="ResourceUniqueKeys"></a>

## ResourceUniqueKeys
Represent an ilib-lint rule.

**Kind**: global class  

* [ResourceUniqueKeys](#ResourceUniqueKeys)
    * [new ResourceUniqueKeys(options)](#new_ResourceUniqueKeys_new)
    * [.match()](#ResourceUniqueKeys+match)


* * *

<a name="new_ResourceUniqueKeys_new"></a>

### new ResourceUniqueKeys(options)
Make a new rule instance.


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | options as documented above |


* * *

<a name="ResourceUniqueKeys+match"></a>

### resourceUniqueKeys.match()
**Kind**: instance method of [<code>ResourceUniqueKeys</code>](#ResourceUniqueKeys)  

* * *

<a name="ResourceXML"></a>

## ResourceXML
Represent an ilib-lint rule.

**Kind**: global class  

* [ResourceXML](#ResourceXML)
    * [new ResourceXML()](#new_ResourceXML_new)
    * [.matchString()](#ResourceXML+matchString)


* * *

<a name="new_ResourceXML_new"></a>

### new ResourceXML()
Make a new rule instance.


* * *

<a name="ResourceXML+matchString"></a>

### resourceXML.matchString()
**Kind**: instance method of [<code>ResourceXML</code>](#ResourceXML)  

* * *

<a name="SourceRegexpChecker"></a>

## SourceRegexpChecker
Source checker class that checks for regular expressions
that match in source code. This rule is a file checker that checks
the text of a file without really parsing it.

**Kind**: global class  

* [SourceRegexpChecker](#SourceRegexpChecker)
    * [new SourceRegexpChecker(options)](#new_SourceRegexpChecker_new)
    * [.match()](#SourceRegexpChecker+match)


* * *

<a name="new_SourceRegexpChecker_new"></a>

### new SourceRegexpChecker(options)
Construct a new declarative regular expression-based source checker.

The options must contain the following required properties:

- name - a unique name for this rule
- description - a one-line description of what this rule checks for.
  Example: "Check that the source does not contain calls to function X"
- note - a one-line note that will be printed on screen when the
  regexp matches (ie. the check fails). Example: "The file foo.java contained
  a call to function X, which is deprecated."
  (Currently, 'matchString' is the only replacement
  param that is supported.)
- sourceLocale - locale (if any) of the source
- link - an URL to a document that explains this rule in more detail
- severity - severity of the results of this rule. This should be one of
  "error", "warning", or "suggestion".
- regexps - an array of strings that encode regular expressions to
  look for


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | options as documented above |


* * *

<a name="SourceRegexpChecker+match"></a>

### sourceRegexpChecker.match()
**Kind**: instance method of [<code>SourceRegexpChecker</code>](#SourceRegexpChecker)  

* * *

<a name="severity"></a>

## severity : [<code>Severity</code>](#Severity)
**Kind**: global variable  

* * *

<a name="typeMap"></a>

## typeMap
Map the types in the declarative rules to a Rule subclass that handles
that type.

**Kind**: global constant  

* * *

<a name="DeclarativeRuleTypes"></a>

## DeclarativeRuleTypes
Allowed types of a declarative rule

**Kind**: global constant  

* [DeclarativeRuleTypes](#DeclarativeRuleTypes)
    * [.resource-matcher](#DeclarativeRuleTypes.resource-matcher)
    * [.resource-source](#DeclarativeRuleTypes.resource-source)
    * [.resource-target](#DeclarativeRuleTypes.resource-target)
    * [.sourcefile](#DeclarativeRuleTypes.sourcefile)


* * *

<a name="DeclarativeRuleTypes.resource-matcher"></a>

### DeclarativeRuleTypes.resource-matcher
Check resources in a resource file. The regular expressions that match in
the source strings must also match in the target string

**Kind**: static property of [<code>DeclarativeRuleTypes</code>](#DeclarativeRuleTypes)  

* * *

<a name="DeclarativeRuleTypes.resource-source"></a>

### DeclarativeRuleTypes.resource-source
Check resources in a resource file. If the regular expressions match in
the source string of a resource, a result will be generated

**Kind**: static property of [<code>DeclarativeRuleTypes</code>](#DeclarativeRuleTypes)  

* * *

<a name="DeclarativeRuleTypes.resource-target"></a>

### DeclarativeRuleTypes.resource-target
Check resources in a resource file. If the regular expressions match in
the target string of a resource, a result will be generated

**Kind**: static property of [<code>DeclarativeRuleTypes</code>](#DeclarativeRuleTypes)  

* * *

<a name="DeclarativeRuleTypes.sourcefile"></a>

### DeclarativeRuleTypes.sourcefile
Check the text in a source file, such as a java file or a python file.
Regular expressions that match in the source file will generate results

**Kind**: static property of [<code>DeclarativeRuleTypes</code>](#DeclarativeRuleTypes)  

* * *

<a name="defaultConfiguration"></a>

## defaultConfiguration : [<code>Configuration</code>](#Configuration)
**Kind**: global constant  

* * *

<a name="ResultComparator"></a>

## ResultComparator(-1)
Compare two Result instances:

1. alphabetically by source file path
2. numerically by line number within the source file

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| -1 | <code>Number</code> | if left comes first, 1 if right comes first, and 0 if they are equal |


* * *

<a name="concatIntlAstText"></a>

## concatIntlAstText(astElements) ⇒ <code>string</code>
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| astElements | <code>Array.&lt;MessageFormatElement&gt;</code> |  |


* * *

<a name="FixerClass"></a>

## FixerClass : <code>Class</code>
Constructor of [Fixer](Fixer) or its subclass

**Kind**: global typedef  

* * *

<a name="RegisteredFixerEntry"></a>

## RegisteredFixerEntry : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> |  |
| class | [<code>FixerClass</code>](#FixerClass) | Subclass of the Fixer (class, not an instance) |


* * *

<a name="FixerRegistry"></a>

## FixerRegistry : <code>Object.&lt;string, RegisteredFixerEntry&gt;</code>
**Kind**: global typedef  

* * *

<a name="Configuration"></a>

## Configuration
Configuration for a project

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>string</code> |  | Name of this project |
| locales | <code>Array.&lt;string&gt;</code> |  | That name the default set of locales for the   whole project if they are not configured by each path |
| [sourceLocale] | <code>string</code> | <code>&quot;\&quot;en-US\&quot;&quot;</code> | Name the locale for source strings   in this app. Default if not specified is "en-US". Default is `"en-US"` |
| [excludes] | <code>Array.&lt;string&gt;</code> |  | An array of micromatch expressions for files   or folders in the project to exclude from the recursive search. |
| [rules] | [<code>Array.&lt;DeclarativeRuleDefinition&gt;</code>](#DeclarativeRuleDefinition) |  | An array of declarative   regular-expression-based rules to use with this project |
| [formatters] | [<code>Array.&lt;DeclarativeFormatterDefinition&gt;</code>](#DeclarativeFormatterDefinition) |  | An array of   declarative output formatters |
| [rulesets] | <code>Record.&lt;string, Ruleset&gt;</code> |  | Named sets of rules. Some   rules can be shared between file types and others are more specific to the   file type. As such, it is sometimes convenient to to name a set of rules   and refer to the whole set by its name instead of listing them all out. |
| filetypes | <code>Record.&lt;string, Filetype&gt;</code> |  | A set of configurations for   various file types. The file types are given dash-separated names such as   "python-source-files" so that they can be referred to in the paths object   below. Properties in the filetypes object are the name of the file type,   and the values are an object that gives the settings for that file type |
| paths | <code>Record.&lt;string, (string\|Filetype)&gt;</code> |  | This maps sets of files   to file types. The properties in this object are   [micromatch](https://github.com/micromatch/micromatch) glob expressions   that select a subset of files within the current project. The glob   expressions can only be relative to the root of the project. The value of   each glob expression property should be either a string that names a file   type for files that match the glob expression, or an on-the-fly unnamed   definition of the file type. If you specify the file type directly, it   cannot be shared with other mappings, so it is usually a good idea to   define a named file type in the "filetypes" property first. |
| [autofix] | <code>boolean</code> |  |  |


* * *

<a name="DeclarativeFormatterDefinition"></a>

## DeclarativeFormatterDefinition
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | A unique name for this formatter |
| description | <code>string</code> | A description of this formatter to show to   users |
| template | <code>string</code> | A template string that shows how the various   fields of a Result instance should be formatted, plus two extras that come   from the rule: ruleName and ruleDescription |
| highlightStart | <code>string</code> | String to use as the highlight starting   marker in the highlight string |
| highlightEnd | <code>string</code> | String to use as the highlight ending marker   in the highlight string |


* * *

<a name="Ruleset"></a>

## Ruleset : <code>Record.&lt;string, any&gt;</code>
Some rules can be shared between file
  types and others are more specific to the file type. As such, it is
  sometimes convenient to to name a set of rules and refer to the whole set
  by its name instead of listing them all out. Ruleset is an object that
  configures each rule that should be included in that set. The rules are
  turned on with a value "true" or with a rule-specific option. They are
  turned off with a falsy value.

**Kind**: global typedef  

* * *

<a name="Filetype"></a>

## Filetype
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| template | <code>string</code> | A template that can be used to parse the file   name for the locale of that file. |
| [locales] | <code>Array.&lt;string&gt;</code> | A set of locales that override the global   locales list. If not specified, the file type uses the global set of   locales. |
| ruleset | <code>string</code> \| <code>Array.&lt;string&gt;</code> \| [<code>Ruleset</code>](#Ruleset) | Name the rule set or list of   rule sets to use with files of this type if the value is a string or an   array of strings. When the value is a list of strings, the rules are a   superset of all of the rules in the named rule sets. If the value is an   object, then it is considered to be an on-the-fly unnamed rule set defined   directly. |


* * *

<a name="DeclarativeRuleDefinition"></a>

## DeclarativeRuleDefinition
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>DeclarativeRuleType</code> | The type of this rule |
| name | <code>string</code> | A unique dash-separated name of this rule. eg.   "resource-url-match" |
| description | <code>string</code> | A description of what this rule is trying to   do. eg. "Ensure that URLs that appear in the source string are also used in   the translated string" |
| note | <code>string</code> | String to use when the regular expression check   fails. eg. "URL '{matchString}' from the source string does not appear in   the target string". Note that you can use `{matchString}` to show the user   the string that the regular expression matched in the source but not in the   target. |
| regexps | <code>Array.&lt;string&gt;</code> | An array of regular expressions to match in the   source and target strings. If any one of those expressions matches in the   source, but not the target, the rule will create a Result that will be   formatted for the user. |
| [link] | <code>string</code> | The URL to a web page that explains this rule in   more detail |


* * *

<a name="ExplicitTerms"></a>

## ExplicitTerms : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| terms | <code>Array.&lt;string&gt;</code> | Explicit list of DNT terms to check |


* * *

<a name="FileTerms"></a>

## FileTerms : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| termsFilePath | <code>string</code> | Path to DNT terms file (either absolute or relative to current working directory) |
| [termsFileType] | <code>&quot;json&quot;</code> \| <code>&quot;txt&quot;</code> | Determines how DNT file should be parsed - either as JSON or as TXT with one term per line |


* * *

<a name="BaseRegExpCollection"></a>

## BaseRegExpCollection : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| quoteStart | <code>string</code> | 
| quoteStartAlt | <code>string</code> | 
| quoteEnd | <code>string</code> | 
| quoteEndAlt | <code>string</code> | 
| quotesNative | <code>RegExp</code> | 
| quotesNativeAlt | <code>RegExp</code> | 


* * *

<a name="SourceRegExpCollection"></a>

## SourceRegExpCollection : [<code>BaseRegExpCollection</code>](#BaseRegExpCollection)
**Kind**: global typedef  

* * *

<a name="ExtendedRegExpCollection"></a>

## ExtendedRegExpCollection : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| quotesAll | <code>RegExp</code> | 
| quotesAllAlt | <code>RegExp</code> | 
| nonQuoteChars | <code>string</code> | 
| nonQuoteCharsAlt | <code>string</code> | 


* * *

<a name="RegExpCollectionForLocale"></a>

## RegExpCollectionForLocale : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| quotesAscii | <code>RegExp</code> | 
| quotesAsciiAlt | <code>RegExp</code> | 
| source | [<code>SourceRegExpCollection</code>](#SourceRegExpCollection) | 
| target | <code>TargetRegExpCollection</code> | 


* * *

<a name="ModeLocaleOnly"></a>

## ModeLocaleOnly : <code>&quot;localeOnly&quot;</code>
Allow only localized quotes in the target string. This also sets default result severity to "error".

**Kind**: global typedef  

* * *

<a name="Severity"></a>

## Severity : <code>&quot;error&quot;</code> \| <code>&quot;warning&quot;</code> \| <code>&quot;suggestion&quot;</code>
Result severity.

**Kind**: global typedef  

* * *

<a name="Modes"></a>

## Modes : [<code>ModeLocaleOnly</code>](#ModeLocaleOnly)
One-param rule configuration.

**Kind**: global typedef  

* * *

<a name="Configuration"></a>

## Configuration : [<code>Modes</code>](#Modes)
Parameters that can be set through rule configuration file.

**Kind**: global typedef  

* * *

