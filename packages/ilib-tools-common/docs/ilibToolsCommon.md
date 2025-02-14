## Classes

<dl>
<dt><a href="#Location">Location</a></dt>
<dd><p>Represents the location of a resource in a file</p>
</dd>
<dt><a href="#Resource">Resource</a></dt>
<dd><p>Represents a resource from a resource file or
extracted from the code.</p>
</dd>
<dt><a href="#ResourceArray">ResourceArray</a></dt>
<dd><p>A class that models a resource that is an array of strings.</p>
</dd>
<dt><a href="#ResourcePlural">ResourcePlural</a></dt>
<dd><p>A class that models a resource that handles translations of
plurals.</p>
</dd>
<dt><a href="#ResourceString">ResourceString</a></dt>
<dd><p>Represents a string resource from a resource file or
extracted from the code.</p>
</dd>
<dt><a href="#ResourceXliff">ResourceXliff</a></dt>
<dd><p>a class that represents resources as an xliff file.</p>
</dd>
<dt><a href="#TranslationSet">TranslationSet</a></dt>
<dd><p>A class that represents a set of translations used in
a project.</p>
</dd>
<dt><a href="#TranslationUnit">TranslationUnit</a></dt>
<dd><p>Represent a translation unit. A translation unit is
a segment in the source language, along with one or
more variants, which are translations to various
target languages. A translation unit may contain more
than one translation for a particular locale, as there
are sometimes more than one translation for a particular
phrase in the source language, depending on the context.</p>
</dd>
<dt><a href="#TranslationVariant">TranslationVariant</a></dt>
<dd><p>A class that represents a translation unit variant.</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#nonBreakingTags">nonBreakingTags</a></dt>
<dd><p>A hash containing a list of HTML tags that do not
cause a break in a resource string. These tags should
be included in the middle of the string.</p>
</dd>
<dt><a href="#selfClosingTags">selfClosingTags</a></dt>
<dd><p>A hash containing a list of HTML tags that are
typically self-closing. That is, in HTML4 and earlier,
the close tag was not needed for these.</p>
</dd>
<dt><a href="#ignoreTags">ignoreTags</a></dt>
<dd><p>A hash containing a list of HTML tags where
the text content inside of those tags should be
ignored for localization purposes. Instead,
those contents should just be copied to the
localized file unmodified.</p>
</dd>
<dt><a href="#localizableAttributes">localizableAttributes</a></dt>
<dd><p>List of html5 tags and their attributes that contain localizable strings.
The &quot;*&quot; indicates it applies to the given attributes on every tag.
Also added ARIA attributes to localize for accessibility. For more details,
see <a href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/">https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/</a></p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#walk">walk(root, includes, excludes)</a> ⇒ <code>Array.&lt;DirItem&gt;</code></dt>
<dd><p>Recursively walk a directory and return a list of files and directories
within that directory. The walk is controlled via a list of exclude and
include patterns. Each pattern should be a micromatch pattern like this:</p>
<code>
"*.json"
</code>

<p>The full relative path to every file and directory in the top-level directory
will be included, unless it matches an exclude pattern, it which case, it will
be excluded from the output. However, if the path
also matches an include pattern, it will still be included nonetheless. The
idea is that you can exclude a whole category of files (like all json files),
but include specific ones. For example, you may exclude all json files, but
still want to include the &quot;config.json&quot; file.<p></p>
<p>The return value is an array of objects that look like this:
<code>
{
  "type": "file",
  "path": "a/b/c/d"
}</p>
<p>or</p>
<p>{
  "type": "directory",
  "path": "a/b/c/e",
  "children": [
    {
      "type": "file",
      "path": "a/b/c/e/f"
    },
    {
      "type": "file",
      "path": "a/b/c/e/g"
    }
  ]
}
</code></p>
<p>That is, each entry is either a file or a directory. If it is a directory, it will have a &quot;children&quot;
property that contains an array of the children of that directory. The path property is the full path
to the file or directory relative to the root directory.</p>
</dd>
<dt><a href="#convertPluralResToICU">convertPluralResToICU(resource)</a> ⇒ <code><a href="#ResourceString">ResourceString</a></code> | <code>undefined</code></dt>
<dd><p>Convert a plural resource to an ICU-style plural string resource.
This allows for shoe-horning plurals into systems that do not
support plurals, or at least don&#39;t offer a way to import them
properly. All other fields are copied from the plural resource
parameter into the returned resource string unchanged.
The complement function is convertICUToPluralRes() which does
the opposite.</p>
</dd>
<dt><a href="#convertICUToPluralRes">convertICUToPluralRes(resource)</a> ⇒ <code><a href="#ResourcePlural">ResourcePlural</a></code> | <code>undefined</code></dt>
<dd><p>Convert a an ICU-style plural string resource into plural resource.
This allows for shoe-horning plurals into systems that do not
support plurals, or at least don&#39;t offer a way to export them
properly. All other fields are copied from the string resource
parameter into the returned resource plural unchanged.
The complement function is convertPluralResToICU() which does
the opposite.</p>
</dd>
<dt><a href="#cleanString">cleanString(str)</a> ⇒ <code>String</code></dt>
<dd><p>Clean a string for matching against other strings by removing
differences that are inconsequential for translation.</p>
</dd>
<dt><a href="#isEmpty">isEmpty(obj)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Is an empty object or not</p>
</dd>
<dt><a href="#formatPath">formatPath(template, parameters)</a> ⇒ <code>string</code></dt>
<dd><p>Format a file path using a path template and parameters.</p>
<p>This function is used to generate an output file path for a given
source file path and a locale specifier.
The template replaces strings in square brackets with special values,
and keeps any characters intact that are not in square brackets.
This function recognizes and replaces the following strings in
templates:</p>
<ul>
<li>[dir] the original directory where the source file
came from. This is given as a directory that is relative
to the root of the project. eg. &quot;foo/bar/strings.json&quot; -&gt; &quot;foo/bar&quot;</li>
<li>[filename] the file name of the source file.
eg. &quot;foo/bar/strings.json&quot; -&gt; &quot;strings.json&quot;</li>
<li>[basename] the basename of the source file without any extension
eg. &quot;foo/bar/strings.json&quot; -&gt; &quot;strings&quot;</li>
<li>[extension] the extension part of the file name of the source file.
etc. &quot;foo/bar/strings.json&quot; -&gt; &quot;json&quot;</li>
<li>[locale] the full BCP-47 locale specification for the target locale
eg. &quot;zh-Hans-CN&quot; -&gt; &quot;zh-Hans-CN&quot;</li>
<li>[language] the language portion of the full locale
eg. &quot;zh-Hans-CN&quot; -&gt; &quot;zh&quot;</li>
<li>[script] the script portion of the full locale
eg. &quot;zh-Hans-CN&quot; -&gt; &quot;Hans&quot;</li>
<li>[region] the region portion of the full locale
eg. &quot;zh-Hans-CN&quot; -&gt; &quot;CN&quot;</li>
<li>[localeDir] the full locale where each portion of the locale
is a directory in this order: [langage], [script], [region].
eg, &quot;zh-Hans-CN&quot; -&gt; &quot;zh/Hans/CN&quot;, but &quot;en&quot; -&gt; &quot;en&quot;.</li>
<li>[localeUnder] the full BCP-47 locale specification, but using
underscores to separate the locale parts instead of dashes.
eg. &quot;zh-Hans-CN&quot; -&gt; &quot;zh_Hans_CN&quot;</li>
<li>[localeLower] the full BCP-47 locale specification, but makes
all locale parts lowercased.
eg. &quot;zh-Hans-CN&quot; -&gt; &quot;zh-hans-cn&quot;</li>
</ul>
<p>The parameters may include the following:</p>
<ul>
<li>sourcepath - the path to the source file, relative to the root of
the project</li>
<li>locale - the locale for the output file path</li>
</ul>
</dd>
<dt><a href="#parsePath">parsePath(template, pathname)</a> ⇒ <code>Object</code></dt>
<dd><p>Parse a path according to the given template, and return the parts.
The parts can be any of the fields mentioned in the <a href="#formatPath">formatPath</a>
documentation. If any field is not parsed, the result is an empty object</p>
</dd>
<dt><a href="#getLocaleFromPath">getLocaleFromPath(template, pathname)</a> ⇒ <code>String</code></dt>
<dd><p>Return a locale encoded in the path using template to parse that path.
See {#formatPath} for the full description of the syntax of the template.</p>
</dd>
<dt><a href="#containsActualText">containsActualText(str)</a> ⇒ <code>boolean</code></dt>
<dd><p>Return true if the string still contains some text after removing all HTML tags and entities.</p>
</dd>
<dt><a href="#objectMap">objectMap(object, visitor)</a> ⇒ <code>*</code></dt>
<dd><p>Recursively visit every node in an object and call the visitor on any
primitive values.</p>
</dd>
<dt><a href="#hashKey">hashKey(source)</a> ⇒ <code>String</code></dt>
<dd><p>Return a standard hash of the given source string.</p>
</dd>
</dl>

<a name="Location"></a>

## Location
Represents the location of a resource in a file

**Kind**: global class  

* [Location](#Location)
    * [new Location(info)](#new_Location_new)
    * [.getLocation()](#Location+getLocation)


* * *

<a name="new_Location_new"></a>

### new Location(info)
Construct a new Location instance. A location should have either an offset from
the beginning of the file, or a line & character number. The first line of the
file is considered line 0, and the first character in a line is character 0.


| Param | Type | Description |
| --- | --- | --- |
| info | <code>Object</code> | location info of the resource |
| info.offset | <code>Number</code> | offset of the first character of the resource relative to the beginning of the file |
| info.line | <code>Number</code> | line number of the resource |
| info.char | <code>Number</code> | character number of the resource |


* * *

<a name="Location+getLocation"></a>

### location.getLocation()
Return the location information

**Kind**: instance method of [<code>Location</code>](#Location)  

* * *

<a name="Resource"></a>

## *Resource*
Represents a resource from a resource file or
extracted from the code.

**Kind**: global abstract class  

* *[Resource](#Resource)*
    * *[new Resource(props)](#new_Resource_new)*
    * *[.resType](#Resource+resType) : <code>String</code> \| <code>undefined</code>*
    * *[.source](#Resource+source) : <code>String</code> \| <code>Array.&lt;String&gt;</code> \| <code>Object</code>*
    * *[.target](#Resource+target) : <code>String</code> \| <code>Array.&lt;String&gt;</code> \| <code>Object</code>*
    * *[.getProject()](#Resource+getProject) ⇒ <code>String</code>*
    * *[.getKey()](#Resource+getKey) ⇒ <code>String</code>*
    * *[.getSource()](#Resource+getSource) ⇒ <code>String</code> \| <code>Array.&lt;String&gt;</code> \| <code>Object</code>*
    * *[.getTarget()](#Resource+getTarget) ⇒ <code>String</code> \| <code>Array.&lt;String&gt;</code> \| <code>Object</code> \| <code>undefined</code>*
    * *[.getType()](#Resource+getType) ⇒ <code>String</code>*
    * *[.getDataType()](#Resource+getDataType) ⇒ <code>String</code>*
    * *[.getAutoKey()](#Resource+getAutoKey) ⇒ <code>boolean</code>*
    * *[.getContext()](#Resource+getContext) ⇒ <code>String</code> \| <code>undefined</code>*
    * *[.getSourceLocale()](#Resource+getSourceLocale) ⇒ <code>String</code> \| <code>undefined</code>*
    * *[.setSourceLocale(locale)](#Resource+setSourceLocale)*
    * *[.getTargetLocale()](#Resource+getTargetLocale) ⇒ <code>String</code> \| <code>undefined</code>*
    * *[.setTargetLocale(locale)](#Resource+setTargetLocale)*
    * *[.getState()](#Resource+getState) ⇒ <code>String</code>*
    * *[.setProject(project)](#Resource+setProject)*
    * *[.setState(state)](#Resource+setState)*
    * *[.getPath()](#Resource+getPath) ⇒ <code>String</code>*
    * *[.getComment()](#Resource+getComment) ⇒ <code>String</code> \| <code>undefined</code>*
    * *[.setComment(comment)](#Resource+setComment)*
    * *[.getDNT()](#Resource+getDNT) ⇒ <code>boolean</code>*
    * *[.setDNT(flag)](#Resource+setDNT)*
    * *[.getId()](#Resource+getId) ⇒ <code>number</code> \| <code>undefined</code>*
    * *[.getOrigin()](#Resource+getOrigin) ⇒ <code>String</code>*
    * *[.getLocalize()](#Resource+getLocalize) ⇒ <code>Boolean</code>*
    * *[.getFlavor()](#Resource+getFlavor) ⇒ <code>String</code> \| <code>undefined</code>*
    * *[.same(other)](#Resource+same) ⇒ <code>boolean</code>*
    * *[.escapeText(str)](#Resource+escapeText) ⇒ <code>String</code>*
    * *[.addInstance(resource)](#Resource+addInstance) ⇒ <code>boolean</code>*
    * *[.isInstance(resource)](#Resource+isInstance) ⇒ <code>boolean</code>*
    * *[.getInstances()](#Resource+getInstances) ⇒ [<code>Array.&lt;Resource&gt;</code>](#Resource)*
    * *[.isDirty()](#Resource+isDirty)*
    * *[.clearDirty()](#Resource+clearDirty)*
    * *[.getLocation()](#Resource+getLocation) ⇒ [<code>Location</code>](#Location) \| <code>undefined</code>*


* * *

<a name="new_Resource_new"></a>

### *new Resource(props)*
Construct a new Resource instance.
The props may contain any
of the following properties:

<ul>
<li>project {String} - the project that this resource is in
<li><i>context</i> {String} - The context for this resource,
such as "landscape mode", or "7200dp", which differentiates it
from the base resource that has no special context. The default
if this property is not specified is undefined, meaning no
context.
<li>sourceLocale {String} - the locale of the source resource.
<li>targetLocale {String} - the locale of the target resource.
<li>key {String} - the unique key of this string, which should include the context
of the string
<li>pathName {String} - pathName to the file where the string was extracted from
<li>autoKey {boolean} - true if the key was generated based on the source text
<li>state {String} - current state of the resource (ie. "new", "translated", or "accepted")
<li>id {String} - the id of the current resource
<li>comment {String} - the comment (translator's note) of this resource
<li>dnt {boolean} - Do not translate this resource when this is set to true. Default: false
<li>datatype {String} - the type of file that this resource came from
<li>flavor {String} - the "flavor" of this string, if any. (Android)
<li>location {Location} - the location in the file given in pathName where this this resource
is located
</ul>


| Param | Type | Description |
| --- | --- | --- |
| props | <code>Object</code> | properties of the string, as defined above |


* * *

<a name="Resource+resType"></a>

### *resource.resType : <code>String</code> \| <code>undefined</code>*
The type of this resource instance.

**Kind**: instance property of [<code>Resource</code>](#Resource)  

* * *

<a name="Resource+source"></a>

### *resource.source : <code>String</code> \| <code>Array.&lt;String&gt;</code> \| <code>Object</code>*
The source string or strings for the resource.

**Kind**: instance property of [<code>Resource</code>](#Resource)  

* * *

<a name="Resource+target"></a>

### *resource.target : <code>String</code> \| <code>Array.&lt;String&gt;</code> \| <code>Object</code>*
The target string or strings for the resource.

**Kind**: instance property of [<code>Resource</code>](#Resource)  

* * *

<a name="Resource+getProject"></a>

### *resource.getProject() ⇒ <code>String</code>*
Return the project that this resource was found in.

**Kind**: instance method of [<code>Resource</code>](#Resource)  
**Returns**: <code>String</code> - the project of this resource  

* * *

<a name="Resource+getKey"></a>

### *resource.getKey() ⇒ <code>String</code>*
Return the unique key of this resource.

**Kind**: instance method of [<code>Resource</code>](#Resource)  
**Returns**: <code>String</code> - the unique key of this resource  

* * *

<a name="Resource+getSource"></a>

### *resource.getSource() ⇒ <code>String</code> \| <code>Array.&lt;String&gt;</code> \| <code>Object</code>*
Return the source string or strings for this resource.

**Kind**: instance method of [<code>Resource</code>](#Resource)  
**Returns**: <code>String</code> \| <code>Array.&lt;String&gt;</code> \| <code>Object</code> - the source string or
strings of this resource  

* * *

<a name="Resource+getTarget"></a>

### *resource.getTarget() ⇒ <code>String</code> \| <code>Array.&lt;String&gt;</code> \| <code>Object</code> \| <code>undefined</code>*
Return the target string or strings for this resource.

**Kind**: instance method of [<code>Resource</code>](#Resource)  
**Returns**: <code>String</code> \| <code>Array.&lt;String&gt;</code> \| <code>Object</code> \| <code>undefined</code> - the source string or
strings of this resource  

* * *

<a name="Resource+getType"></a>

### *resource.getType() ⇒ <code>String</code>*
Return the resource type of this resource. This is one of
string, array, or plural.

**Kind**: instance method of [<code>Resource</code>](#Resource)  
**Returns**: <code>String</code> - the resource type of this resource  

* * *

<a name="Resource+getDataType"></a>

### *resource.getDataType() ⇒ <code>String</code>*
Return the data type of this resource.

**Kind**: instance method of [<code>Resource</code>](#Resource)  
**Returns**: <code>String</code> - the data type of this resource  

* * *

<a name="Resource+getAutoKey"></a>

### *resource.getAutoKey() ⇒ <code>boolean</code>*
Return true if the key of this resource was automatically generated,
and false if it was an explicit key.

**Kind**: instance method of [<code>Resource</code>](#Resource)  
**Returns**: <code>boolean</code> - true if the key of this string was auto generated,
false otherwise  

* * *

<a name="Resource+getContext"></a>

### *resource.getContext() ⇒ <code>String</code> \| <code>undefined</code>*
Return the context of this resource, or undefined if there
is no context.

**Kind**: instance method of [<code>Resource</code>](#Resource)  
**Returns**: <code>String</code> \| <code>undefined</code> - the context of this resource, or undefined if there
is no context.  

* * *

<a name="Resource+getSourceLocale"></a>

### *resource.getSourceLocale() ⇒ <code>String</code> \| <code>undefined</code>*
Return the source locale of this resource, or undefined if there
is no context or the locale is the same as the project's source locale.

**Kind**: instance method of [<code>Resource</code>](#Resource)  
**Returns**: <code>String</code> \| <code>undefined</code> - the locale of this resource, or undefined if there
is no locale.  

* * *

<a name="Resource+setSourceLocale"></a>

### *resource.setSourceLocale(locale)*
Set the source locale of this resource.

**Kind**: instance method of [<code>Resource</code>](#Resource)  

| Param | Type | Description |
| --- | --- | --- |
| locale | <code>String</code> | the source locale of this resource |


* * *

<a name="Resource+getTargetLocale"></a>

### *resource.getTargetLocale() ⇒ <code>String</code> \| <code>undefined</code>*
Return the target locale of this resource, or undefined if the resource
is a source-only resource.

**Kind**: instance method of [<code>Resource</code>](#Resource)  
**Returns**: <code>String</code> \| <code>undefined</code> - the locale of this resource, or undefined if there
is no locale.  

* * *

<a name="Resource+setTargetLocale"></a>

### *resource.setTargetLocale(locale)*
Set the target locale of this resource.

**Kind**: instance method of [<code>Resource</code>](#Resource)  

| Param | Type | Description |
| --- | --- | --- |
| locale | <code>String</code> | the target locale of this resource |


* * *

<a name="Resource+getState"></a>

### *resource.getState() ⇒ <code>String</code>*
Return the state of this resource. This is a string that gives the
stage of life of this resource. Currently, it can be one of "new",
"translated", or "accepted".

**Kind**: instance method of [<code>Resource</code>](#Resource)  
**Returns**: <code>String</code> - the state of this resource  

* * *

<a name="Resource+setProject"></a>

### *resource.setProject(project)*
Set the project of this resource. This is a string that gives the
id of the project for this resource.

**Kind**: instance method of [<code>Resource</code>](#Resource)  

| Param | Type | Description |
| --- | --- | --- |
| project | <code>String</code> | the project name to set for this resource |


* * *

<a name="Resource+setState"></a>

### *resource.setState(state)*
Set the state of this resource. This is a string that gives the
stage of life of this resource. Currently, it can be one of "new",
"translated", or "accepted".

**Kind**: instance method of [<code>Resource</code>](#Resource)  

| Param | Type | Description |
| --- | --- | --- |
| state | <code>String</code> | the state of this resource |


* * *

<a name="Resource+getPath"></a>

### *resource.getPath() ⇒ <code>String</code>*
Return the original path to the file from which this resource was
originally extracted.

**Kind**: instance method of [<code>Resource</code>](#Resource)  
**Returns**: <code>String</code> - the path to the file containing this resource  

* * *

<a name="Resource+getComment"></a>

### *resource.getComment() ⇒ <code>String</code> \| <code>undefined</code>*
Return the translator's comment for this resource if there is
one, or undefined if not.

**Kind**: instance method of [<code>Resource</code>](#Resource)  
**Returns**: <code>String</code> \| <code>undefined</code> - the translator's comment for this resource
if the engineer put one in the code  

* * *

<a name="Resource+setComment"></a>

### *resource.setComment(comment)*
Set the translator's comment for this resource.

**Kind**: instance method of [<code>Resource</code>](#Resource)  

| Param | Type | Description |
| --- | --- | --- |
| comment | <code>String</code> \| <code>undefined</code> | the translator's comment to set. Use undefined to clear the comment |


* * *

<a name="Resource+getDNT"></a>

### *resource.getDNT() ⇒ <code>boolean</code>*
Get the "do not translate" flag for this resource.

**Kind**: instance method of [<code>Resource</code>](#Resource)  
**Returns**: <code>boolean</code> - true means that the current resource should not
be translated, and false means it will be translated.  

* * *

<a name="Resource+setDNT"></a>

### *resource.setDNT(flag)*
Set the "do not translate" flag for this resource.

**Kind**: instance method of [<code>Resource</code>](#Resource)  

| Param | Type | Description |
| --- | --- | --- |
| flag | <code>boolean</code> | set the dnt flag to this value |


* * *

<a name="Resource+getId"></a>

### *resource.getId() ⇒ <code>number</code> \| <code>undefined</code>*
Return the database id if this resource has previously been saved in the
database.

**Kind**: instance method of [<code>Resource</code>](#Resource)  
**Returns**: <code>number</code> \| <code>undefined</code> - the database id if this resource has previously
been saved in the database, or undefined if it is has not  

* * *

<a name="Resource+getOrigin"></a>

### *resource.getOrigin() ⇒ <code>String</code>*
Return the origin of this resource. The origin may be either the string
"source" or "target". Source origin resources are ones that are extracted
from the source code, whereas target ones are translations from the
translators.

**Kind**: instance method of [<code>Resource</code>](#Resource)  
**Returns**: <code>String</code> - the origin of this resource  

* * *

<a name="Resource+getLocalize"></a>

### *resource.getLocalize() ⇒ <code>Boolean</code>*
Return the localize flag of this resource.
This flag indicates whether we should look up a translation for this resource.
When false, we should simply substitute the source back

**Kind**: instance method of [<code>Resource</code>](#Resource)  
**Returns**: <code>Boolean</code> - the localize flag of this resource  

* * *

<a name="Resource+getFlavor"></a>

### *resource.getFlavor() ⇒ <code>String</code> \| <code>undefined</code>*
Return the name of the flavor for this resource, or undefined
for the "main" or default flavor.

**Kind**: instance method of [<code>Resource</code>](#Resource)  
**Returns**: <code>String</code> \| <code>undefined</code> - the name of the flavor for this
 resource or undefined for the main or default flavor  

* * *

<a name="Resource+same"></a>

### *resource.same(other) ⇒ <code>boolean</code>*
Return true if the other resource represents the same resource as
the current one. The project, context, locale, key, flavor, and type must
match. Other fields such as the pathName, state, and comment fields are
ignored as minor variations.

**Kind**: instance method of [<code>Resource</code>](#Resource)  
**Returns**: <code>boolean</code> - true if these represent the same resource, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Resource</code>](#Resource) | another resource to test against the current one |


* * *

<a name="Resource+escapeText"></a>

### *resource.escapeText(str) ⇒ <code>String</code>*
Escape text for writing to a database in a SQL command. This puts single
quotes around the string, and makes sure that all single quotes within
the string are escaped.

**Kind**: instance method of [<code>Resource</code>](#Resource)  
**Returns**: <code>String</code> - the escaped string  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>Object</code> | the item to escape |


* * *

<a name="Resource+addInstance"></a>

### *resource.addInstance(resource) ⇒ <code>boolean</code>*
Add an instance of the same resource to the list of
instances. If the given resource matches the
current instance in all properties that affect the
possible translation, and differs from the current
instance by some property that does not affect
its translation, it will be added as an instance of
the same string. The following properties affect the
translation:

<ul>
<li>context</li>
<li>datatype</li>
<li>dnt</li>
<li>flavor</li>
<li>project</li>
<li>reskey</li>
<li>resType</li>
<li>source</li>
<li>sourceHash</li>
<li>sourceArray</li>
<li>sourceLocale</li>
<li>targetLocale</li>
</ul>

Differences in other properties, such as "comment" or
"origin" are considered instances of the same resource.

If this method is given a resource that differs from
the current one by one of the above translation affecting
properties, it is not added to the list of instances. This
can be checked easily by calling the isInstance() method.

**Kind**: instance method of [<code>Resource</code>](#Resource)  
**Returns**: <code>boolean</code> - true if the instance was added, and
and false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| resource | [<code>Resource</code>](#Resource) | an instance of the current resource to record |


* * *

<a name="Resource+isInstance"></a>

### *resource.isInstance(resource) ⇒ <code>boolean</code>*
Check if the given resource is an instance of the current
resource. This method returns true if all properties which
affect the possible translation match between the given and
the current resource.

**Kind**: instance method of [<code>Resource</code>](#Resource)  
**Returns**: <code>boolean</code> - true if this is an instance of
the current resource, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| resource | [<code>Resource</code>](#Resource) | a resource to check |


* * *

<a name="Resource+getInstances"></a>

### *resource.getInstances() ⇒ [<code>Array.&lt;Resource&gt;</code>](#Resource)*
Return the list of instances of the current resource.

**Kind**: instance method of [<code>Resource</code>](#Resource)  
**Returns**: [<code>Array.&lt;Resource&gt;</code>](#Resource) - the list of instances of
the current resource  

* * *

<a name="Resource+isDirty"></a>

### *resource.isDirty()*
Return true if this instance has been modified since its creation, and false otherwise.

**Kind**: instance method of [<code>Resource</code>](#Resource)  

* * *

<a name="Resource+clearDirty"></a>

### *resource.clearDirty()*
Clear the dirty flag. This is used for example when the Resource was
written to disk and the modifications are already recorded, allowing
new modifications later.

**Kind**: instance method of [<code>Resource</code>](#Resource)  

* * *

<a name="Resource+getLocation"></a>

### *resource.getLocation() ⇒ [<code>Location</code>](#Location) \| <code>undefined</code>*
Return the location of the resource instance in the original file where it was read
from. This is usually an object containing a line and a char property which gives the
line number and character within that line where the representation of the resource
instance starts.

**Kind**: instance method of [<code>Resource</code>](#Resource)  
**Returns**: [<code>Location</code>](#Location) \| <code>undefined</code> - the location information, or undefined if no location
information is available  

* * *

<a name="ResourceArray"></a>

## ResourceArray
A class that models a resource that is an array of strings.

**Kind**: global class  

* [ResourceArray](#ResourceArray)
    * [new ResourceArray(props)](#new_ResourceArray_new)
    * _instance_
        * [.setSource(arr)](#ResourceArray+setSource)
        * [.setTarget(arr)](#ResourceArray+setTarget)
        * ~~[.getSourceArray()](#ResourceArray+getSourceArray) ⇒ <code>Array.&lt;String&gt;</code>~~
        * ~~[.getTargetArray()](#ResourceArray+getTargetArray) ⇒ <code>Array.&lt;String&gt;</code>~~
        * [.getSourceItem(i)](#ResourceArray+getSourceItem) ⇒ <code>String</code> \| <code>undefined</code>
        * [.getTargetItem(i)](#ResourceArray+getTargetItem) ⇒ <code>String</code> \| <code>undefined</code>
        * [.addSourceItem(i, str)](#ResourceArray+addSourceItem)
        * [.addTargetItem(i, str)](#ResourceArray+addTargetItem)
        * [.size()](#ResourceArray+size) ⇒ <code>number</code>
        * [.clone()](#ResourceArray+clone) ⇒ [<code>ResourceArray</code>](#ResourceArray)
        * [.equals(other)](#ResourceArray+equals) ⇒ <code>boolean</code>
        * [.equals(other)](#ResourceArray+equals) ⇒ <code>boolean</code>
        * [.hashKey()](#ResourceArray+hashKey) ⇒ <code>String</code>
        * [.hashKeyForTranslation(locale)](#ResourceArray+hashKeyForTranslation) ⇒ <code>String</code>
        * [.cleanHashKey()](#ResourceArray+cleanHashKey) ⇒ <code>String</code>
        * [.cleanHashKeyForTranslation(locale)](#ResourceArray+cleanHashKeyForTranslation) ⇒ <code>String</code>
        * [.isInstance(resource)](#ResourceArray+isInstance) ⇒ <code>boolean</code>
    * _static_
        * [.resClass](#ResourceArray.resClass)
        * [.hashKey()](#ResourceArray.hashKey) ⇒ <code>String</code>


* * *

<a name="new_ResourceArray_new"></a>

### new ResourceArray(props)
Construct a new ResourceArray instance.

Arrays of strings are used in Android apps, as well as some other
places, to specify things like the values for a drop-down box in
a UI.<p>

The properties in the props parameter may be any of the following:

<ul>
<li><i>key</i> {String} - The unique key of the array resource
<li><i>locale</i> {String} - The locale specifier that gives the
languages that the array's strings are written in
<li><i>pathName</i> {String} - The path to the file that contains
this array resource
<li><i>context</i> {String} - The context for this resource,
such as "landscape mode", or "7200dp", which differentiates it
from the base resource that has no special context. The default
if this property is not specified is undefined, meaning no
context.
<li><i>source</i> {Array.&lt;String&gt;} An array of strings
that are the source language values of this resource
<li><i>target</i> {Array.&lt;String&gt;} An array of strings
that are the target language values of this resource
</ul>


| Param | Type | Description |
| --- | --- | --- |
| props | <code>Object</code> | Any of the properties given above |


* * *

<a name="ResourceArray+setSource"></a>

### resourceArray.setSource(arr)
Set the array of source strings for this resource.

**Kind**: instance method of [<code>ResourceArray</code>](#ResourceArray)  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array.&lt;String&gt;</code> | the array of strings to set as the source array |


* * *

<a name="ResourceArray+setTarget"></a>

### resourceArray.setTarget(arr)
Set the array of target strings for this resource.

**Kind**: instance method of [<code>ResourceArray</code>](#ResourceArray)  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array.&lt;String&gt;</code> | the array of strings to set as the target array |


* * *

<a name="ResourceArray+getSourceArray"></a>

### ~~resourceArray.getSourceArray() ⇒ <code>Array.&lt;String&gt;</code>~~
***Use getSource() instead***

Return the array of source strings. This method is here
for backwards compatilibity with the loctool plugins.

**Kind**: instance method of [<code>ResourceArray</code>](#ResourceArray)  
**Returns**: <code>Array.&lt;String&gt;</code> - the array of source strings  

* * *

<a name="ResourceArray+getTargetArray"></a>

### ~~resourceArray.getTargetArray() ⇒ <code>Array.&lt;String&gt;</code>~~
***Use getTarget() instead***

Return the array of target strings. This method is here
for backwards compatilibity with the loctool plugins.

**Kind**: instance method of [<code>ResourceArray</code>](#ResourceArray)  
**Returns**: <code>Array.&lt;String&gt;</code> - the array of target strings  

* * *

<a name="ResourceArray+getSourceItem"></a>

### resourceArray.getSourceItem(i) ⇒ <code>String</code> \| <code>undefined</code>
Return the source string with the given index into the array.

**Kind**: instance method of [<code>ResourceArray</code>](#ResourceArray)  
**Returns**: <code>String</code> \| <code>undefined</code> - the value of the string at index i or
undefined if i is outside the bounds of the array  

| Param | Type | Description |
| --- | --- | --- |
| i | <code>number</code> | The index of the string being sought |


* * *

<a name="ResourceArray+getTargetItem"></a>

### resourceArray.getTargetItem(i) ⇒ <code>String</code> \| <code>undefined</code>
Return the target string with the given index into the array.

**Kind**: instance method of [<code>ResourceArray</code>](#ResourceArray)  
**Returns**: <code>String</code> \| <code>undefined</code> - the value of the string at index i or
undefined if i is outside the bounds of the array  

| Param | Type | Description |
| --- | --- | --- |
| i | <code>number</code> | The index of the string being sought |


* * *

<a name="ResourceArray+addSourceItem"></a>

### resourceArray.addSourceItem(i, str)
Add a string to the source array at index i.

**Kind**: instance method of [<code>ResourceArray</code>](#ResourceArray)  

| Param | Type | Description |
| --- | --- | --- |
| i | <code>number</code> | the index at which to add the string |
| str | <code>String</code> | the string to add |


* * *

<a name="ResourceArray+addTargetItem"></a>

### resourceArray.addTargetItem(i, str)
Add a string to the target array at index i.

**Kind**: instance method of [<code>ResourceArray</code>](#ResourceArray)  

| Param | Type | Description |
| --- | --- | --- |
| i | <code>number</code> | the index at which to add the string |
| str | <code>String</code> | the string to add |


* * *

<a name="ResourceArray+size"></a>

### resourceArray.size() ⇒ <code>number</code>
Return the length of the array of strings in this resource.

**Kind**: instance method of [<code>ResourceArray</code>](#ResourceArray)  
**Returns**: <code>number</code> - the length of the array of strings in this
resource  

* * *

<a name="ResourceArray+clone"></a>

### resourceArray.clone() ⇒ [<code>ResourceArray</code>](#ResourceArray)
Clone this resource and override the properties with the given ones.

**Kind**: instance method of [<code>ResourceArray</code>](#ResourceArray)  
**Returns**: [<code>ResourceArray</code>](#ResourceArray) - a clone of this resource  
**Params**: <code>Object\|undefined</code> overrides optional properties to override in
the cloned object  

* * *

<a name="ResourceArray+equals"></a>

### resourceArray.equals(other) ⇒ <code>boolean</code>
Return true if the other resources contains the same resources as
the current one. The pathName, state, and comment fields are
ignored as minor variations.

**Kind**: instance method of [<code>ResourceArray</code>](#ResourceArray)  
**Returns**: <code>boolean</code> - true if these represent the same resource, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Resource</code>](#Resource) | another resource to test against the current one |


* * *

<a name="ResourceArray+equals"></a>

### resourceArray.equals(other) ⇒ <code>boolean</code>
Return true if the other resource contains the exact same resource as
the current one. All fields must match.

**Kind**: instance method of [<code>ResourceArray</code>](#ResourceArray)  
**Returns**: <code>boolean</code> - true if these represent the same resource, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Resource</code>](#Resource) | another resource to test against the current one |


* * *

<a name="ResourceArray+hashKey"></a>

### resourceArray.hashKey() ⇒ <code>String</code>
Return the a hash key that uniquely identifies this resource.

**Kind**: instance method of [<code>ResourceArray</code>](#ResourceArray)  
**Returns**: <code>String</code> - a unique hash key for this resource  

* * *

<a name="ResourceArray+hashKeyForTranslation"></a>

### resourceArray.hashKeyForTranslation(locale) ⇒ <code>String</code>
Return the a hash key that uniquely identifies the translation of
this resource to the given locale.

**Kind**: instance method of [<code>ResourceArray</code>](#ResourceArray)  
**Returns**: <code>String</code> - a unique hash key for this resource  

| Param | Type | Description |
| --- | --- | --- |
| locale | <code>String</code> | a locale spec of the desired translation |


* * *

<a name="ResourceArray+cleanHashKey"></a>

### resourceArray.cleanHashKey() ⇒ <code>String</code>
Return the a hash key that uniquely identifies this resource, but uses the cleaned version of the string

**Kind**: instance method of [<code>ResourceArray</code>](#ResourceArray)  
**Returns**: <code>String</code> - a unique hash key for this resource  

* * *

<a name="ResourceArray+cleanHashKeyForTranslation"></a>

### resourceArray.cleanHashKeyForTranslation(locale) ⇒ <code>String</code>
Return the a hash key that uniquely identifies the translation of
this resource to the given locale.

**Kind**: instance method of [<code>ResourceArray</code>](#ResourceArray)  
**Returns**: <code>String</code> - a unique hash key for this resource  

| Param | Type | Description |
| --- | --- | --- |
| locale | <code>String</code> | a locale spec of the desired translation |


* * *

<a name="ResourceArray+isInstance"></a>

### resourceArray.isInstance(resource) ⇒ <code>boolean</code>
Check if the given resource is an instance of the current
resource.

**Kind**: instance method of [<code>ResourceArray</code>](#ResourceArray)  
**Returns**: <code>boolean</code> - true if this is an instance of
the current resource, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| resource | [<code>Resource</code>](#Resource) | a resource to check |


* * *

<a name="ResourceArray.resClass"></a>

### ResourceArray.resClass
The class of this kind of array resource.

**Kind**: static constant of [<code>ResourceArray</code>](#ResourceArray)  

* * *

<a name="ResourceArray.hashKey"></a>

### ResourceArray.hashKey() ⇒ <code>String</code>
Calculate a resource key string for this class of resource given the
parameters.

**Kind**: static method of [<code>ResourceArray</code>](#ResourceArray)  
**Returns**: <code>String</code> - a hash key  

* * *

<a name="ResourcePlural"></a>

## ResourcePlural
A class that models a resource that handles translations of
plurals.

**Kind**: global class  

* [ResourcePlural](#ResourcePlural)
    * [new ResourcePlural(props)](#new_ResourcePlural_new)
    * _instance_
        * [.setSource(plurals)](#ResourcePlural+setSource)
        * ~~[.getSourcePlurals()](#ResourcePlural+getSourcePlurals) ⇒ <code>Array.&lt;String&gt;</code>~~
        * ~~[.getTargetPlurals()](#ResourcePlural+getTargetPlurals) ⇒ <code>Array.&lt;String&gt;</code>~~
        * ~~[.getSourceStrings()](#ResourcePlural+getSourceStrings) ⇒ <code>Array.&lt;String&gt;</code>~~
        * ~~[.getTargetStrings()](#ResourcePlural+getTargetStrings) ⇒ <code>Array.&lt;String&gt;</code>~~
        * [.setTarget(plurals)](#ResourcePlural+setTarget)
        * [.getSourcePlural()](#ResourcePlural+getSourcePlural) ⇒ <code>String</code>
        * [.getTargetPlural()](#ResourcePlural+getTargetPlural) ⇒ <code>String</code>
        * ~~[.getClasses()](#ResourcePlural+getClasses) ⇒ <code>Array.&lt;string&gt;</code>~~
        * [.getCategories()](#ResourcePlural+getCategories) ⇒ <code>Array.&lt;string&gt;</code>
        * [.getAllValidCategories()](#ResourcePlural+getAllValidCategories) ⇒ <code>Array.&lt;string&gt;</code>
        * [.addSourcePlural(pluralCategory, str)](#ResourcePlural+addSourcePlural)
        * [.addTargetPlural(pluralCategory, str)](#ResourcePlural+addTargetPlural)
        * [.size()](#ResourcePlural+size) ⇒ <code>number</code>
        * [.clone()](#ResourcePlural+clone) ⇒ [<code>ResourceArray</code>](#ResourceArray)
        * [.equals(other)](#ResourcePlural+equals) ⇒ <code>boolean</code>
        * [.hashKey()](#ResourcePlural+hashKey) ⇒ <code>String</code>
        * [.hashKeyForTranslation(locale)](#ResourcePlural+hashKeyForTranslation) ⇒ <code>String</code>
        * [.cleanHashKey()](#ResourcePlural+cleanHashKey) ⇒ <code>String</code>
        * [.cleanHashKeyForTranslation(locale)](#ResourcePlural+cleanHashKeyForTranslation) ⇒ <code>String</code>
        * [.isInstance(a)](#ResourcePlural+isInstance) ⇒ <code>boolean</code>
        * [.getPivots()](#ResourcePlural+getPivots)
    * _static_
        * [.resClass](#ResourcePlural.resClass)
        * [.validPluralCategories](#ResourcePlural.validPluralCategories)
        * [.hashKey()](#ResourcePlural.hashKey) ⇒ <code>String</code>


* * *

<a name="new_ResourcePlural_new"></a>

### new ResourcePlural(props)
Construct a new instance of a plural resource.

Hashes of strings are used in Android apps to specify translations
of the various categories of plurals.<p>

The props may contain any
of properties from the Resource constructor and additionally,
these properties:

<ul>
<li><i>source</i> {Object} A hash of strings that map the categories
to translations.
</ul>

The properties of the strings hash can be any of the categories supported
by the Unicode CLDR data:

<ul>
<li>zero
<li>one
<li>two
<li>few
<li>many
</ul>


| Param | Type | Description |
| --- | --- | --- |
| props | <code>Object</code> | Any of the properties given above |


* * *

<a name="ResourcePlural+setSource"></a>

### resourcePlural.setSource(plurals)
Set the source plurals hash of this plurals resource.

**Kind**: instance method of [<code>ResourcePlural</code>](#ResourcePlural)  

| Param | Type | Description |
| --- | --- | --- |
| plurals | <code>Object</code> | the source hash |


* * *

<a name="ResourcePlural+getSourcePlurals"></a>

### ~~resourcePlural.getSourcePlurals() ⇒ <code>Array.&lt;String&gt;</code>~~
***Use getSource() instead***

Return the array of source strings. This method is here
for backwards compatilibity with the loctool plugins.

**Kind**: instance method of [<code>ResourcePlural</code>](#ResourcePlural)  
**Returns**: <code>Array.&lt;String&gt;</code> - the array of source strings  

* * *

<a name="ResourcePlural+getTargetPlurals"></a>

### ~~resourcePlural.getTargetPlurals() ⇒ <code>Array.&lt;String&gt;</code>~~
***Use getTarget() instead***

Return the array of target strings. This method is here
for backwards compatilibity with the loctool plugins.

**Kind**: instance method of [<code>ResourcePlural</code>](#ResourcePlural)  
**Returns**: <code>Array.&lt;String&gt;</code> - the array of target strings  

* * *

<a name="ResourcePlural+getSourceStrings"></a>

### ~~resourcePlural.getSourceStrings() ⇒ <code>Array.&lt;String&gt;</code>~~
***Use getSource() instead***

Return the array of source strings. This method is here
for backwards compatilibity with the loctool plugins.

**Kind**: instance method of [<code>ResourcePlural</code>](#ResourcePlural)  
**Returns**: <code>Array.&lt;String&gt;</code> - the array of source strings  

* * *

<a name="ResourcePlural+getTargetStrings"></a>

### ~~resourcePlural.getTargetStrings() ⇒ <code>Array.&lt;String&gt;</code>~~
***Use getTarget() instead***

Return the array of target strings. This method is here
for backwards compatilibity with the loctool plugins.

**Kind**: instance method of [<code>ResourcePlural</code>](#ResourcePlural)  
**Returns**: <code>Array.&lt;String&gt;</code> - the array of target strings  

* * *

<a name="ResourcePlural+setTarget"></a>

### resourcePlural.setTarget(plurals)
Set the target plurals hash of this plurals resource.

**Kind**: instance method of [<code>ResourcePlural</code>](#ResourcePlural)  

| Param | Type | Description |
| --- | --- | --- |
| plurals | <code>Object</code> | the target hash |


* * *

<a name="ResourcePlural+getSourcePlural"></a>

### resourcePlural.getSourcePlural() ⇒ <code>String</code>
Return the source string of the given plural category.

**Kind**: instance method of [<code>ResourcePlural</code>](#ResourcePlural)  
**Returns**: <code>String</code> - the source string for the given
plural category  

* * *

<a name="ResourcePlural+getTargetPlural"></a>

### resourcePlural.getTargetPlural() ⇒ <code>String</code>
Return the target string of the given plural category.

**Kind**: instance method of [<code>ResourcePlural</code>](#ResourcePlural)  
**Returns**: <code>String</code> - the target string for the given
plural category  

* * *

<a name="ResourcePlural+getClasses"></a>

### ~~resourcePlural.getClasses() ⇒ <code>Array.&lt;string&gt;</code>~~
***Use getCategories instead***

Return an array of names of source categories of plurals
that are used in this resource.

**Kind**: instance method of [<code>ResourcePlural</code>](#ResourcePlural)  
**Returns**: <code>Array.&lt;string&gt;</code> - an array of source categories  

* * *

<a name="ResourcePlural+getCategories"></a>

### resourcePlural.getCategories() ⇒ <code>Array.&lt;string&gt;</code>
Return an array of names of source categories of plurals
that are used in this resource, either in the source or
target.

**Kind**: instance method of [<code>ResourcePlural</code>](#ResourcePlural)  
**Returns**: <code>Array.&lt;string&gt;</code> - an array of source categories  

* * *

<a name="ResourcePlural+getAllValidCategories"></a>

### resourcePlural.getAllValidCategories() ⇒ <code>Array.&lt;string&gt;</code>
Return an array of names of all possible categories
of plurals, even if they are not currently used in this
plural instance.

**Kind**: instance method of [<code>ResourcePlural</code>](#ResourcePlural)  
**Returns**: <code>Array.&lt;string&gt;</code> - an array of category names  

* * *

<a name="ResourcePlural+addSourcePlural"></a>

### resourcePlural.addSourcePlural(pluralCategory, str)
Add a string with the given plural category to the source of
this plural resource.

**Kind**: instance method of [<code>ResourcePlural</code>](#ResourcePlural)  

| Param | Type | Description |
| --- | --- | --- |
| pluralCategory | <code>String</code> | the CLDR category of this string |
| str | <code>String</code> | the source string to add for the category |


* * *

<a name="ResourcePlural+addTargetPlural"></a>

### resourcePlural.addTargetPlural(pluralCategory, str)
Add a string with the given plural category to the target of
this plural resource.

**Kind**: instance method of [<code>ResourcePlural</code>](#ResourcePlural)  

| Param | Type | Description |
| --- | --- | --- |
| pluralCategory | <code>String</code> | the CLDR category of this string |
| str | <code>String</code> | the target string to add for the category |


* * *

<a name="ResourcePlural+size"></a>

### resourcePlural.size() ⇒ <code>number</code>
Return the length of the array of strings in this resource.

**Kind**: instance method of [<code>ResourcePlural</code>](#ResourcePlural)  
**Returns**: <code>number</code> - the length of the array of strings in this
resource  

* * *

<a name="ResourcePlural+clone"></a>

### resourcePlural.clone() ⇒ [<code>ResourceArray</code>](#ResourceArray)
Clone this resource and override the properties with the given ones.

**Kind**: instance method of [<code>ResourcePlural</code>](#ResourcePlural)  
**Returns**: [<code>ResourceArray</code>](#ResourceArray) - a clone of this resource  
**Params**: <code>Object\|undefined</code> overrides optional properties to override in
the cloned object  

* * *

<a name="ResourcePlural+equals"></a>

### resourcePlural.equals(other) ⇒ <code>boolean</code>
Return true if the other resources contains the same resources as
the current one. The pathName, state, and comment fields are
ignored as minor variations.

**Kind**: instance method of [<code>ResourcePlural</code>](#ResourcePlural)  
**Returns**: <code>boolean</code> - true if these represent the same resource, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Resource</code>](#Resource) | another resource to test against the current one |


* * *

<a name="ResourcePlural+hashKey"></a>

### resourcePlural.hashKey() ⇒ <code>String</code>
Return the a hash key that uniquely identifies this resource.

**Kind**: instance method of [<code>ResourcePlural</code>](#ResourcePlural)  
**Returns**: <code>String</code> - a unique hash key for this resource  

* * *

<a name="ResourcePlural+hashKeyForTranslation"></a>

### resourcePlural.hashKeyForTranslation(locale) ⇒ <code>String</code>
Return the a hash key that uniquely identifies the translation of
this resource to the given locale.

**Kind**: instance method of [<code>ResourcePlural</code>](#ResourcePlural)  
**Returns**: <code>String</code> - a unique hash key for this resource  

| Param | Type | Description |
| --- | --- | --- |
| locale | <code>String</code> | a locale spec of the desired translation |


* * *

<a name="ResourcePlural+cleanHashKey"></a>

### resourcePlural.cleanHashKey() ⇒ <code>String</code>
Return the a hash key that uniquely identifies this resource.

**Kind**: instance method of [<code>ResourcePlural</code>](#ResourcePlural)  
**Returns**: <code>String</code> - a unique hash key for this resource  

* * *

<a name="ResourcePlural+cleanHashKeyForTranslation"></a>

### resourcePlural.cleanHashKeyForTranslation(locale) ⇒ <code>String</code>
Return the a hash key that uniquely identifies the translation of
this resource to the given locale.

**Kind**: instance method of [<code>ResourcePlural</code>](#ResourcePlural)  
**Returns**: <code>String</code> - a unique hash key for this resource  

| Param | Type | Description |
| --- | --- | --- |
| locale | <code>String</code> | a locale spec of the desired translation |


* * *

<a name="ResourcePlural+isInstance"></a>

### resourcePlural.isInstance(a) ⇒ <code>boolean</code>
Check if the given resource is an instance of the current
resource.

**Kind**: instance method of [<code>ResourcePlural</code>](#ResourcePlural)  
**Returns**: <code>boolean</code> - true if this is an instance of
the current resource, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| a | [<code>Resource</code>](#Resource) | resource to check |


* * *

<a name="ResourcePlural+getPivots"></a>

### resourcePlural.getPivots()
**Kind**: instance method of [<code>ResourcePlural</code>](#ResourcePlural)  

* * *

<a name="ResourcePlural.resClass"></a>

### ResourcePlural.resClass
The class of this kind of string plural.

**Kind**: static constant of [<code>ResourcePlural</code>](#ResourcePlural)  

* * *

<a name="ResourcePlural.validPluralCategories"></a>

### ResourcePlural.validPluralCategories
Acceptable values for plural categories

**Kind**: static constant of [<code>ResourcePlural</code>](#ResourcePlural)  

* * *

<a name="ResourcePlural.hashKey"></a>

### ResourcePlural.hashKey() ⇒ <code>String</code>
Calculate a resource key string for this category of resource given the
parameters.

**Kind**: static method of [<code>ResourcePlural</code>](#ResourcePlural)  
**Returns**: <code>String</code> - a hash key  

* * *

<a name="ResourceString"></a>

## ResourceString
Represents a string resource from a resource file or
extracted from the code.

**Kind**: global class  

* [ResourceString](#ResourceString)
    * [new ResourceString(props)](#new_ResourceString_new)
    * _instance_
        * [.setSource(str)](#ResourceString+setSource)
        * [.setTarget(str)](#ResourceString+setTarget)
        * [.size()](#ResourceString+size) ⇒ <code>number</code>
        * [.clone()](#ResourceString+clone) ⇒ [<code>ResourceArray</code>](#ResourceArray)
        * [.equals(other)](#ResourceString+equals) ⇒ <code>boolean</code>
        * [.hashKey()](#ResourceString+hashKey) ⇒ <code>String</code>
        * [.hashKeyForTranslation(locale)](#ResourceString+hashKeyForTranslation) ⇒ <code>String</code>
        * [.cleanHashKey()](#ResourceString+cleanHashKey) ⇒ <code>String</code>
        * [.cleanHashKeyForTranslation(locale)](#ResourceString+cleanHashKeyForTranslation) ⇒ <code>String</code>
        * [.isInstance(a)](#ResourceString+isInstance) ⇒ <code>boolean</code>
    * _static_
        * [.resClass](#ResourceString.resClass)
        * [.hashKey(project, locale, reskey, datatype, flavor, context)](#ResourceString.hashKey) ⇒ <code>String</code>
        * [.cleanHashKey(project, locale, reskey, datatype, flavor, context)](#ResourceString.cleanHashKey) ⇒ <code>String</code>


* * *

<a name="new_ResourceString_new"></a>

### new ResourceString(props)
Construct a new ResourceString instance. The props may contain any
of properties from the Resource constructor and additionally,
these properties:

<ul>
<li>source {String} - the source string associated with this key
</ul>


| Param | Type | Description |
| --- | --- | --- |
| props | <code>Object</code> | properties of the string, as defined above |


* * *

<a name="ResourceString+setSource"></a>

### resourceString.setSource(str)
Set the source string written in the source
locale of this resource string.

**Kind**: instance method of [<code>ResourceString</code>](#ResourceString)  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>String</code> | the source string |


* * *

<a name="ResourceString+setTarget"></a>

### resourceString.setTarget(str)
Set the target string of this resource.

**Kind**: instance method of [<code>ResourceString</code>](#ResourceString)  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>String</code> | the target string |


* * *

<a name="ResourceString+size"></a>

### resourceString.size() ⇒ <code>number</code>
Return the number of strings in this resource.

**Kind**: instance method of [<code>ResourceString</code>](#ResourceString)  
**Returns**: <code>number</code> - the number of strings in this resource  

* * *

<a name="ResourceString+clone"></a>

### resourceString.clone() ⇒ [<code>ResourceArray</code>](#ResourceArray)
Clone this resource and override the properties with the given ones.

**Kind**: instance method of [<code>ResourceString</code>](#ResourceString)  
**Returns**: [<code>ResourceArray</code>](#ResourceArray) - a clone of this resource  
**Params**: <code>Object\|undefined</code> overrides optional properties to override in
the cloned object  

* * *

<a name="ResourceString+equals"></a>

### resourceString.equals(other) ⇒ <code>boolean</code>
Return true if the other resource contains the exact same resource as
the current one. All fields must match.

**Kind**: instance method of [<code>ResourceString</code>](#ResourceString)  
**Returns**: <code>boolean</code> - true if these represent the same resource, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Resource</code>](#Resource) | another resource to test against the current one |


* * *

<a name="ResourceString+hashKey"></a>

### resourceString.hashKey() ⇒ <code>String</code>
Return the a hash key that uniquely identifies this resource.

**Kind**: instance method of [<code>ResourceString</code>](#ResourceString)  
**Returns**: <code>String</code> - a unique hash key for this resource  

* * *

<a name="ResourceString+hashKeyForTranslation"></a>

### resourceString.hashKeyForTranslation(locale) ⇒ <code>String</code>
Return the a hash key that uniquely identifies the translation of
this resource to the given locale.

**Kind**: instance method of [<code>ResourceString</code>](#ResourceString)  
**Returns**: <code>String</code> - a unique hash key for this resource  

| Param | Type | Description |
| --- | --- | --- |
| locale | <code>String</code> | a locale spec of the desired translation |


* * *

<a name="ResourceString+cleanHashKey"></a>

### resourceString.cleanHashKey() ⇒ <code>String</code>
Return the a hash key that uniquely identifies this resource, but cleaned

**Kind**: instance method of [<code>ResourceString</code>](#ResourceString)  
**Returns**: <code>String</code> - a unique hash key for this resource, but cleaned  

* * *

<a name="ResourceString+cleanHashKeyForTranslation"></a>

### resourceString.cleanHashKeyForTranslation(locale) ⇒ <code>String</code>
Return the a hash key that uniquely identifies the translation of
this resource to the given locale, but cleaned

**Kind**: instance method of [<code>ResourceString</code>](#ResourceString)  
**Returns**: <code>String</code> - a unique hash key for this resource's string  

| Param | Type | Description |
| --- | --- | --- |
| locale | <code>String</code> | a locale spec of the desired translation |


* * *

<a name="ResourceString+isInstance"></a>

### resourceString.isInstance(a) ⇒ <code>boolean</code>
Check if the given resource is an instance of the current
resource.

**Kind**: instance method of [<code>ResourceString</code>](#ResourceString)  
**Returns**: <code>boolean</code> - true if this is an instance of
the current resource, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| a | [<code>Resource</code>](#Resource) | resource to check |


* * *

<a name="ResourceString.resClass"></a>

### ResourceString.resClass
The class of this kind of string resource.

**Kind**: static constant of [<code>ResourceString</code>](#ResourceString)  

* * *

<a name="ResourceString.hashKey"></a>

### ResourceString.hashKey(project, locale, reskey, datatype, flavor, context) ⇒ <code>String</code>
Calculate a resource key string for this class of resource given the
parameters.

**Kind**: static method of [<code>ResourceString</code>](#ResourceString)  
**Returns**: <code>String</code> - a hash key  

| Param | Type | Description |
| --- | --- | --- |
| project | <code>String</code> | the project of the string |
| locale | <code>String</code> | the locale of the string |
| reskey | <code>String</code> | the key of the string |
| datatype | <code>String</code> | the datatype of the string |
| flavor | <code>String</code> | the flavor of the string |
| context | <code>String</code> | the context of the string |


* * *

<a name="ResourceString.cleanHashKey"></a>

### ResourceString.cleanHashKey(project, locale, reskey, datatype, flavor, context) ⇒ <code>String</code>
Calculate a resource key string for this class of resource given the
parameters.

**Kind**: static method of [<code>ResourceString</code>](#ResourceString)  
**Returns**: <code>String</code> - a hash key  

| Param | Type | Description |
| --- | --- | --- |
| project | <code>String</code> | the project of the string |
| locale | <code>String</code> | the locale of the string |
| reskey | <code>String</code> | the key of the string |
| datatype | <code>String</code> | the datatype of the string |
| flavor | <code>String</code> | the flavor of the string |
| context | <code>String</code> | the context of the string |


* * *

<a name="ResourceXliff"></a>

## ResourceXliff
a class that represents resources as an xliff file.

**Kind**: global class  

* [ResourceXliff](#ResourceXliff)
    * [new ResourceXliff(options)](#new_ResourceXliff_new)
    * [.getLines()](#ResourceXliff+getLines) ⇒ <code>Number</code>
    * [.size()](#ResourceXliff+size) ⇒ <code>Number</code>
    * [.getVersion()](#ResourceXliff+getVersion) ⇒ <code>String</code>


* * *

<a name="new_ResourceXliff_new"></a>

### new ResourceXliff(options)
Construct a new resource xliff instance. Operation of the instance
is controlled via the options. The options may be undefined, which represents a new,
clean Xliff instance. The options object may also
be an object with the following properties:

<ul>
<li><i>path</i> - the path to the xliff file on disk
<li><i>tool-id</i> - the id of the tool that saved this xliff file
<li><i>tool-name</i> - the full name of the tool that saved this xliff file
<li><i>tool-version</i> - the version of the tool that save this xliff file
<li><i>tool-company</i> - the name of the company that made this tool
<li><i>copyright</i> - a copyright notice that you would like included into the xliff file
<li><i>sourceLocale</i> - specify the default source locale if a resource doesn't have a locale itself
<li><i>allowDups</i> - allow duplicate resources in the xliff. By default, dups are
filtered out. This option allows you to have trans-units that represent instances of the
same resource in the file with different metadata. For example, two instances of a
resource may have different comments which may both be useful to translators or
two instances of the same resource may have been extracted from different source files.
<li><i>version</i> - The version of xliff that will be produced by this instance. This
may be either "1.2" or "2.0"
</ul>


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Array.&lt;Object&gt;</code> \| <code>undefined</code> | options to initialize the file, or undefined for a new empty file |


* * *

<a name="ResourceXliff+getLines"></a>

### resourceXliff.getLines() ⇒ <code>Number</code>
Return the number of lines in the xml representation of this file.

**Kind**: instance method of [<code>ResourceXliff</code>](#ResourceXliff)  
**Returns**: <code>Number</code> - the number of lines in the xml  

* * *

<a name="ResourceXliff+size"></a>

### resourceXliff.size() ⇒ <code>Number</code>
Return the number of resources in this resource xliff file.

**Kind**: instance method of [<code>ResourceXliff</code>](#ResourceXliff)  
**Returns**: <code>Number</code> - the number of resources in this file  

* * *

<a name="ResourceXliff+getVersion"></a>

### resourceXliff.getVersion() ⇒ <code>String</code>
Get the version number of this file. Currently, it only supports
xliff v1.2 and v2.0.

**Kind**: instance method of [<code>ResourceXliff</code>](#ResourceXliff)  
**Returns**: <code>String</code> - the version number of the file  

* * *

<a name="TranslationSet"></a>

## TranslationSet
A class that represents a set of translations used in
a project.

**Kind**: global class  

* [TranslationSet](#TranslationSet)
    * [new TranslationSet(sourceLocale, [options])](#new_TranslationSet_new)
    * [.get(hashkey)](#TranslationSet+get) ⇒ [<code>Resource</code>](#Resource) \| <code>undefined</code>
    * [.getClean(hashkey)](#TranslationSet+getClean) ⇒ [<code>Resource</code>](#Resource) \| <code>undefined</code>
    * [.getBySource(source, context)](#TranslationSet+getBySource) ⇒ [<code>Resource</code>](#Resource) \| <code>undefined</code>
    * [.getAll()](#TranslationSet+getAll) ⇒ [<code>Array.&lt;Resource&gt;</code>](#Resource)
    * [.add(resource)](#TranslationSet+add)
    * [.addAll(resources)](#TranslationSet+addAll)
    * [.addSet(set)](#TranslationSet+addSet)
    * [.size()](#TranslationSet+size) ⇒ <code>number</code>
    * [.setClean()](#TranslationSet+setClean)
    * [.isDirty()](#TranslationSet+isDirty) ⇒ <code>boolean</code>
    * [.remove(resource)](#TranslationSet+remove) ⇒ <code>boolean</code>
    * [.getBy(criteria)](#TranslationSet+getBy) ⇒ [<code>Array.&lt;Resource&gt;</code>](#Resource) \| <code>undefined</code>
    * [.getProjects()](#TranslationSet+getProjects) ⇒ <code>Array.&lt;String&gt;</code> \| <code>undefined</code>
    * [.getContexts(project)](#TranslationSet+getContexts) ⇒ <code>Array.&lt;String&gt;</code> \| <code>undefined</code>
    * [.getLocales(project, context)](#TranslationSet+getLocales) ⇒ <code>Array.&lt;String&gt;</code> \| <code>undefined</code>
    * [.clear()](#TranslationSet+clear)
    * [.diff(other)](#TranslationSet+diff) ⇒ [<code>TranslationSet</code>](#TranslationSet)


* * *

<a name="new_TranslationSet_new"></a>

### new TranslationSet(sourceLocale, [options])

| Param | Type | Description |
| --- | --- | --- |
| sourceLocale | <code>String</code> | the source locale for this set |
| [options] | <code>Object</code> | options controlling this set |


* * *

<a name="TranslationSet+get"></a>

### translationSet.get(hashkey) ⇒ [<code>Resource</code>](#Resource) \| <code>undefined</code>
Get a resource by its hashkey.

**Kind**: instance method of [<code>TranslationSet</code>](#TranslationSet)  
**Returns**: [<code>Resource</code>](#Resource) \| <code>undefined</code> - a resource corresponding to the hashkey, or undefined if there is no
resource with that key  

| Param | Type | Description |
| --- | --- | --- |
| hashkey | <code>String</code> | The unique hashkey of the resource being sought. |


* * *

<a name="TranslationSet+getClean"></a>

### translationSet.getClean(hashkey) ⇒ [<code>Resource</code>](#Resource) \| <code>undefined</code>
Get a resource by its clean string hashkey.

**Kind**: instance method of [<code>TranslationSet</code>](#TranslationSet)  
**Returns**: [<code>Resource</code>](#Resource) \| <code>undefined</code> - a resource corresponding to the hashkey, or undefined if there is no
resource with that key  

| Param | Type | Description |
| --- | --- | --- |
| hashkey | <code>String</code> | The unique hashkey of the resource being sought. |


* * *

<a name="TranslationSet+getBySource"></a>

### translationSet.getBySource(source, context) ⇒ [<code>Resource</code>](#Resource) \| <code>undefined</code>
Get a resource by its source string and context. The source string must be written
in the language and script of the source locale. For array types, the
source string
must be one of the values in the string array. For plural types, it
must be one of the values of the quantities.<p>

If the context is undefined,
this method will find the base generic resource with no context.

**Kind**: instance method of [<code>TranslationSet</code>](#TranslationSet)  
**Returns**: [<code>Resource</code>](#Resource) \| <code>undefined</code> - a resource corresponding to the source string, or
undefined if there is no resource with that source  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>String</code> | The source string to look up |
| context | <code>String</code> \| <code>undefined</code> | The optional context of the resource being sought. |


* * *

<a name="TranslationSet+getAll"></a>

### translationSet.getAll() ⇒ [<code>Array.&lt;Resource&gt;</code>](#Resource)
Return all resources in this set.

**Kind**: instance method of [<code>TranslationSet</code>](#TranslationSet)  
**Returns**: [<code>Array.&lt;Resource&gt;</code>](#Resource) - an array of resources in this set,
possibly empty  

* * *

<a name="TranslationSet+add"></a>

### translationSet.add(resource)
Add a resource to this set. If this resource has the same key
as an existing resource, but a different locale, then this
resource is added a translation instead.

**Kind**: instance method of [<code>TranslationSet</code>](#TranslationSet)  

| Param | Type | Description |
| --- | --- | --- |
| resource | [<code>Resource</code>](#Resource) | a resource to add to this set |


* * *

<a name="TranslationSet+addAll"></a>

### translationSet.addAll(resources)
Add every resource in the given array to this set.

**Kind**: instance method of [<code>TranslationSet</code>](#TranslationSet)  

| Param | Type | Description |
| --- | --- | --- |
| resources | [<code>Array.&lt;Resource&gt;</code>](#Resource) | an array of resources to add to this set |


* * *

<a name="TranslationSet+addSet"></a>

### translationSet.addSet(set)
Add every resource in the given translation set to this set,
merging the results together.

**Kind**: instance method of [<code>TranslationSet</code>](#TranslationSet)  

| Param | Type | Description |
| --- | --- | --- |
| set | [<code>TranslationSet</code>](#TranslationSet) | an set of resources to add to this set |


* * *

<a name="TranslationSet+size"></a>

### translationSet.size() ⇒ <code>number</code>
Return the number of unique resources in this set.

**Kind**: instance method of [<code>TranslationSet</code>](#TranslationSet)  
**Returns**: <code>number</code> - the number of unique resources in this set  

* * *

<a name="TranslationSet+setClean"></a>

### translationSet.setClean()
Reset the dirty flag to false, meaning the set is clean. This will
allow callers to tell if any more resources were added after
this call was made because adding those resources will set
the dirty flag to true again.

**Kind**: instance method of [<code>TranslationSet</code>](#TranslationSet)  

* * *

<a name="TranslationSet+isDirty"></a>

### translationSet.isDirty() ⇒ <code>boolean</code>
Return whether or not this set is dirty. The dirty flag is set
whenever a new resource was added to or removed from the set
after it was created or since the last time the setClean method
was called.

**Kind**: instance method of [<code>TranslationSet</code>](#TranslationSet)  
**Returns**: <code>boolean</code> - true if the set is dirty, false otherwise  

* * *

<a name="TranslationSet+remove"></a>

### translationSet.remove(resource) ⇒ <code>boolean</code>
Remove a resource from the set. The resource must have at
least enough fields specified to uniquely identify the
resource to remove. These are: project, context, locale,
resType, and reskey.

**Kind**: instance method of [<code>TranslationSet</code>](#TranslationSet)  
**Returns**: <code>boolean</code> - true if the resource was removed successfully
and false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| resource | [<code>Resource</code>](#Resource) | The resource to remove |


* * *

<a name="TranslationSet+getBy"></a>

### translationSet.getBy(criteria) ⇒ [<code>Array.&lt;Resource&gt;</code>](#Resource) \| <code>undefined</code>
Get a resource by the given criteria.

**Kind**: instance method of [<code>TranslationSet</code>](#TranslationSet)  
**Returns**: [<code>Array.&lt;Resource&gt;</code>](#Resource) \| <code>undefined</code> - the array of Resources, or undefined if the
retrieval did not find any resources that match or there was some error  

| Param | Type | Description |
| --- | --- | --- |
| criteria | <code>Object</code> | the filter criteria to select the resources to return |


* * *

<a name="TranslationSet+getProjects"></a>

### translationSet.getProjects() ⇒ <code>Array.&lt;String&gt;</code> \| <code>undefined</code>
Return an array of all the project names in the database.

**Kind**: instance method of [<code>TranslationSet</code>](#TranslationSet)  
**Returns**: <code>Array.&lt;String&gt;</code> \| <code>undefined</code> - the array of project names
or undefined if there are no projects in the set  

* * *

<a name="TranslationSet+getContexts"></a>

### translationSet.getContexts(project) ⇒ <code>Array.&lt;String&gt;</code> \| <code>undefined</code>
Return an array of all the contexts within the given project
in the set. The root context is just the empty string.
The root context is where all strings will go if they are
not given an explicit context in the resource file or code.

**Kind**: instance method of [<code>TranslationSet</code>](#TranslationSet)  
**Returns**: <code>Array.&lt;String&gt;</code> \| <code>undefined</code> - the array of context names
or undefined if there are no contexts in the set  

| Param | Type | Description |
| --- | --- | --- |
| project | <code>String</code> \| <code>undefined</code> | the project that contains the contexts or undefined to mean all projects |


* * *

<a name="TranslationSet+getLocales"></a>

### translationSet.getLocales(project, context) ⇒ <code>Array.&lt;String&gt;</code> \| <code>undefined</code>
Return an array of all the locales available within the given
project and context in the set. The root context is just
the empty string. The locales are returned as BCP-47 locale
specs.

**Kind**: instance method of [<code>TranslationSet</code>](#TranslationSet)  
**Returns**: <code>Array.&lt;String&gt;</code> \| <code>undefined</code> - the array of context names
or undefined if there are no contexts in the set  

| Param | Type | Description |
| --- | --- | --- |
| project | <code>String</code> \| <code>undefined</code> | the project that contains the contexts or undefined to mean all projects |
| context | <code>String</code> \| <code>undefined</code> | the context that contains the locales or undefined to mean all locales. Use the empty string "" for the default/root context. |


* * *

<a name="TranslationSet+clear"></a>

### translationSet.clear()
Clear all resources from this set.

**Kind**: instance method of [<code>TranslationSet</code>](#TranslationSet)  

* * *

<a name="TranslationSet+diff"></a>

### translationSet.diff(other) ⇒ [<code>TranslationSet</code>](#TranslationSet)
Return a new translation set that contains the differences
between the current set and the other set. Resources are
added to the difference set if they exist in the other
set but not the current one, or if they exist in both
sets, but contain different fields.

**Kind**: instance method of [<code>TranslationSet</code>](#TranslationSet)  
**Returns**: [<code>TranslationSet</code>](#TranslationSet) - the differences between the other
set and this one  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>TranslationSet</code>](#TranslationSet) | the other set to diff against |


* * *

<a name="TranslationUnit"></a>

## TranslationUnit
Represent a translation unit. A translation unit is
a segment in the source language, along with one or
more variants, which are translations to various
target languages. A translation unit may contain more
than one translation for a particular locale, as there
are sometimes more than one translation for a particular
phrase in the source language, depending on the context.

**Kind**: global class  

* [TranslationUnit](#TranslationUnit)
    * [new TranslationUnit(options)](#new_TranslationUnit_new)
    * [.clone()](#TranslationUnit+clone) ⇒ [<code>TranslationUnit</code>](#TranslationUnit)
    * [.hashKey()](#TranslationUnit+hashKey) ⇒ <code>string</code>
    * [.getVariants(locale)](#TranslationUnit+getVariants) ⇒ [<code>Array.&lt;TranslationVariant&gt;</code>](#TranslationVariant)
    * [.addVariant(variant)](#TranslationUnit+addVariant)
    * [.addVariants(variants)](#TranslationUnit+addVariants)
    * [.getProperties()](#TranslationUnit+getProperties) ⇒ <code>Object</code>
    * [.addProperties(properties)](#TranslationUnit+addProperties)


* * *

<a name="new_TranslationUnit_new"></a>

### new TranslationUnit(options)
Create a new translation unit.

The options may be undefined, which represents
a new, clean TranslationUnit instance. The options object may also
be an object with the following properties:

<ul>
<li><i>source</i> - source text for this unit (required)
<li><i>sourceLocale</i> - the source locale spec for this unit (required)
<li><i>target</i> - target text for this unit (optional)
<li><i>targetLocale</i> - the target locale spec for this unit (optional)
<li><i>key</i> - the unique resource key for this translation unit (required)
<li><i>file</i> - path to the original source code file that contains the
source text of this translation unit (required)
<li><i>project</i> - the project that this string/unit is part of
<li><i>resType</i> - type of this resource (string, array, plural) (optional)
<li><i>state</i> - the state of the current unit (optional)
<li><i>comment</i> - the translator's comment for this unit (optional)
<li><i>datatype</i> - the source of the data of this unit (optional)
<li><i>flavor</i> - the flavor that this string comes from (optional)
<li><i>location</i> - the location information where this string is encoded in the file
<li><i>translate</i> - flag that tells whether to translate this unit (optional)
</ul>

If the required properties are not given, the constructor throws an exception.<p>

For newly extracted strings, there is no target text yet. There must be a target
locale for the translators to use when creating new target text, however. This
means that there may be multiple translation units in a file with the same
source locale and no target text, but different target locales.


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | options for this unit |


* * *

<a name="TranslationUnit+clone"></a>

### translationUnit.clone() ⇒ [<code>TranslationUnit</code>](#TranslationUnit)
Clone the current unit and return the clone.

**Kind**: instance method of [<code>TranslationUnit</code>](#TranslationUnit)  
**Returns**: [<code>TranslationUnit</code>](#TranslationUnit) - a clone of the current unit.  

* * *

<a name="TranslationUnit+hashKey"></a>

### translationUnit.hashKey() ⇒ <code>string</code>
Return a unique hash key for this translation unit. The
hash key is calculated from the source string and locale
and does not depend on the properties or variants in
the unit.

**Kind**: instance method of [<code>TranslationUnit</code>](#TranslationUnit)  
**Returns**: <code>string</code> - the unique hash key  

* * *

<a name="TranslationUnit+getVariants"></a>

### translationUnit.getVariants(locale) ⇒ [<code>Array.&lt;TranslationVariant&gt;</code>](#TranslationVariant)
Return the list of variants for this translation unit. If the locale
parameter is specified, only return the variants for the given locale.

**Kind**: instance method of [<code>TranslationUnit</code>](#TranslationUnit)  
**Returns**: [<code>Array.&lt;TranslationVariant&gt;</code>](#TranslationVariant) - the variants for
this translation unit  

| Param | Type | Description |
| --- | --- | --- |
| locale | <code>String</code> \| <code>undefined</code> | the locale to find |


* * *

<a name="TranslationUnit+addVariant"></a>

### translationUnit.addVariant(variant)
Add a single variant to this translation unit. This variant
is only added if it is unique in this translation unit. That is,
No other variant exists in this unit with the same locale and
string.

**Kind**: instance method of [<code>TranslationUnit</code>](#TranslationUnit)  

| Param | Type | Description |
| --- | --- | --- |
| variant | [<code>TranslationVariant</code>](#TranslationVariant) | the variant to add |


* * *

<a name="TranslationUnit+addVariants"></a>

### translationUnit.addVariants(variants)
Add an array of variants to this translation unit. This only
adds a variant if it is unique. That is, the unit is not
added if the locale and string are the same as an existing
variant.

**Kind**: instance method of [<code>TranslationUnit</code>](#TranslationUnit)  

| Param | Type | Description |
| --- | --- | --- |
| variants | [<code>Array.&lt;TranslationVariant&gt;</code>](#TranslationVariant) | the array of variants to add |


* * *

<a name="TranslationUnit+getProperties"></a>

### translationUnit.getProperties() ⇒ <code>Object</code>
Return the list of properties and their values for this translation unit.

**Kind**: instance method of [<code>TranslationUnit</code>](#TranslationUnit)  
**Returns**: <code>Object</code> - an object mapping properties to values  

* * *

<a name="TranslationUnit+addProperties"></a>

### translationUnit.addProperties(properties)
Add a property to this translation unit.

**Kind**: instance method of [<code>TranslationUnit</code>](#TranslationUnit)  

| Param | Type | Description |
| --- | --- | --- |
| properties | <code>Object</code> | an object that maps properties to values |


* * *

<a name="TranslationVariant"></a>

## TranslationVariant
A class that represents a translation unit variant.

**Kind**: global class  

* [TranslationVariant](#TranslationVariant)
    * [new TranslationVariant(options)](#new_TranslationVariant_new)
    * [.hashKey()](#TranslationVariant+hashKey) ⇒ <code>string</code>


* * *

<a name="new_TranslationVariant_new"></a>

### new TranslationVariant(options)
Options may contain the following properties:
- locale: locale of the target string
- string: the translation for this locale


| Param | Type |
| --- | --- |
| options | <code>Object</code> | 


* * *

<a name="TranslationVariant+hashKey"></a>

### translationVariant.hashKey() ⇒ <code>string</code>
Return a unique hash key for this translation unit variant. The
hash key is calculated from the source string and locale.

**Kind**: instance method of [<code>TranslationVariant</code>](#TranslationVariant)  
**Returns**: <code>string</code> - the unique hash key  

* * *

<a name="nonBreakingTags"></a>

## nonBreakingTags
A hash containing a list of HTML tags that do not
cause a break in a resource string. These tags should
be included in the middle of the string.

**Kind**: global constant  

* * *

<a name="selfClosingTags"></a>

## selfClosingTags
A hash containing a list of HTML tags that are
typically self-closing. That is, in HTML4 and earlier,
the close tag was not needed for these.

**Kind**: global constant  

* * *

<a name="ignoreTags"></a>

## ignoreTags
A hash containing a list of HTML tags where
the text content inside of those tags should be
ignored for localization purposes. Instead,
those contents should just be copied to the
localized file unmodified.

**Kind**: global constant  

* * *

<a name="localizableAttributes"></a>

## localizableAttributes
List of html5 tags and their attributes that contain localizable strings.
The "*" indicates it applies to the given attributes on every tag.
Also added ARIA attributes to localize for accessibility. For more details,
see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/

**Kind**: global constant  

* * *

<a name="walk"></a>

## walk(root, includes, excludes) ⇒ <code>Array.&lt;DirItem&gt;</code>
Recursively walk a directory and return a list of files and directories
within that directory. The walk is controlled via a list of exclude and
include patterns. Each pattern should be a micromatch pattern like this:

<code>
"*.json"
</code>

The full relative path to every file and directory in the top-level directory
will be included, unless it matches an exclude pattern, it which case, it will
be excluded from the output. However, if the path
also matches an include pattern, it will still be included nonetheless. The
idea is that you can exclude a whole category of files (like all json files),
but include specific ones. For example, you may exclude all json files, but
still want to include the "config.json" file.<p>

The return value is an array of objects that look like this:
<code>
{
  "type": "file",
  "path": "a/b/c/d"
}

or

{
  "type": "directory",
  "path": "a/b/c/e",
  "children": [
    {
      "type": "file",
      "path": "a/b/c/e/f"
    },
    {
      "type": "file",
      "path": "a/b/c/e/g"
    }
  ]
}
</code>

That is, each entry is either a file or a directory. If it is a directory, it will have a "children"
property that contains an array of the children of that directory. The path property is the full path
to the file or directory relative to the root directory.

**Kind**: global function  
**Returns**: <code>Array.&lt;DirItem&gt;</code> - an array of file names in the directory, filtered
by the excludes and includes list  

| Param | Type | Description |
| --- | --- | --- |
| root | <code>String</code> | The path to the directory to walk |
| includes | <code>Array.&lt;String&gt;</code> | A list of micromatch patterns to include in the walk. If a pattern matches both an exclude and an include, the include will override the exclude. |
| excludes | <code>Array.&lt;String&gt;</code> | A list of micromatch patterns to exclude from the walk. If a pattern matches a directory, that directory will not be recursively searched. |


* * *

<a name="convertPluralResToICU"></a>

## convertPluralResToICU(resource) ⇒ [<code>ResourceString</code>](#ResourceString) \| <code>undefined</code>
Convert a plural resource to an ICU-style plural string resource.
This allows for shoe-horning plurals into systems that do not
support plurals, or at least don't offer a way to import them
properly. All other fields are copied from the plural resource
parameter into the returned resource string unchanged.
The complement function is convertICUToPluralRes() which does
the opposite.

**Kind**: global function  
**Returns**: [<code>ResourceString</code>](#ResourceString) \| <code>undefined</code> - the plural resource converted into a
string resource, or undefined if the resource is not a plural resource  

| Param | Type | Description |
| --- | --- | --- |
| resource | [<code>ResourcePlural</code>](#ResourcePlural) | the resource to convert into an ICU-style plural resource string |

**Example**  
```js
if plural resource has source plurals like this:
{
  "one": "# item",
  "other": "# items"
}
and the pivot variable name is "count", then this function returns
a ResourceString instance that contains the string:
  "{count, plural, one {# item} other {# items}}"
```

* * *

<a name="convertICUToPluralRes"></a>

## convertICUToPluralRes(resource) ⇒ [<code>ResourcePlural</code>](#ResourcePlural) \| <code>undefined</code>
Convert a an ICU-style plural string resource into plural resource.
This allows for shoe-horning plurals into systems that do not
support plurals, or at least don't offer a way to export them
properly. All other fields are copied from the string resource
parameter into the returned resource plural unchanged.
The complement function is convertPluralResToICU() which does
the opposite.

**Kind**: global function  
**Returns**: [<code>ResourcePlural</code>](#ResourcePlural) \| <code>undefined</code> - the resource string converted into a
plural resource, or undefined if the resource is not a string resource  

| Param | Type | Description |
| --- | --- | --- |
| resource | [<code>ResourceString</code>](#ResourceString) | the ICU-style plural resource string to convert into a plural resource |


* * *

<a name="cleanString"></a>

## cleanString(str) ⇒ <code>String</code>
Clean a string for matching against other strings by removing
differences that are inconsequential for translation.

**Kind**: global function  
**Returns**: <code>String</code> - the cleaned string  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>String</code> | string to clean |


* * *

<a name="isEmpty"></a>

## isEmpty(obj) ⇒ <code>Boolean</code>
Is an empty object or not

**Kind**: global function  
**Returns**: <code>Boolean</code> - true if there are no properties, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | object to test |


* * *

<a name="formatPath"></a>

## formatPath(template, parameters) ⇒ <code>string</code>
Format a file path using a path template and parameters.

This function is used to generate an output file path for a given
source file path and a locale specifier.
The template replaces strings in square brackets with special values,
and keeps any characters intact that are not in square brackets.
This function recognizes and replaces the following strings in
templates:
- [dir] the original directory where the source file
  came from. This is given as a directory that is relative
  to the root of the project. eg. "foo/bar/strings.json" -> "foo/bar"
- [filename] the file name of the source file.
  eg. "foo/bar/strings.json" -> "strings.json"
- [basename] the basename of the source file without any extension
  eg. "foo/bar/strings.json" -> "strings"
- [extension] the extension part of the file name of the source file.
  etc. "foo/bar/strings.json" -> "json"
- [locale] the full BCP-47 locale specification for the target locale
  eg. "zh-Hans-CN" -> "zh-Hans-CN"
- [language] the language portion of the full locale
  eg. "zh-Hans-CN" -> "zh"
- [script] the script portion of the full locale
  eg. "zh-Hans-CN" -> "Hans"
- [region] the region portion of the full locale
  eg. "zh-Hans-CN" -> "CN"
- [localeDir] the full locale where each portion of the locale
  is a directory in this order: [langage], [script], [region].
  eg, "zh-Hans-CN" -> "zh/Hans/CN", but "en" -> "en".
- [localeUnder] the full BCP-47 locale specification, but using
  underscores to separate the locale parts instead of dashes.
  eg. "zh-Hans-CN" -> "zh_Hans_CN"
- [localeLower] the full BCP-47 locale specification, but makes
  all locale parts lowercased.
  eg. "zh-Hans-CN" -> "zh-hans-cn"

The parameters may include the following:
- sourcepath - the path to the source file, relative to the root of
  the project
- locale - the locale for the output file path

**Kind**: global function  
**Returns**: <code>string</code> - the formatted file path  

| Param | Type | Description |
| --- | --- | --- |
| template | <code>string</code> | the string to escape |
| parameters | <code>Object</code> | the parameters to format into the template |


* * *

<a name="parsePath"></a>

## parsePath(template, pathname) ⇒ <code>Object</code>
Parse a path according to the given template, and return the parts.
The parts can be any of the fields mentioned in the [formatPath](#formatPath)
documentation. If any field is not parsed, the result is an empty object

**Kind**: global function  
**Returns**: <code>Object</code> - an object mapping the fields to their values in the
the pathname  

| Param | Type | Description |
| --- | --- | --- |
| template | <code>String</code> | the ilib template for matching against the path |
| pathname | <code>String</code> | the path name to match against the template |


* * *

<a name="getLocaleFromPath"></a>

## getLocaleFromPath(template, pathname) ⇒ <code>String</code>
Return a locale encoded in the path using template to parse that path.
See {#formatPath} for the full description of the syntax of the template.

**Kind**: global function  
**Returns**: <code>String</code> - the locale within the path, or undefined if no locale found  

| Param | Type | Description |
| --- | --- | --- |
| template | <code>String</code> | template for the output file |
| pathname | <code>String</code> | path to the source file |


* * *

<a name="containsActualText"></a>

## containsActualText(str) ⇒ <code>boolean</code>
Return true if the string still contains some text after removing all HTML tags and entities.

**Kind**: global function  
**Returns**: <code>boolean</code> - true if there is text left over, and false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | the string to check |


* * *

<a name="objectMap"></a>

## objectMap(object, visitor) ⇒ <code>\*</code>
Recursively visit every node in an object and call the visitor on any
primitive values.

**Kind**: global function  
**Returns**: <code>\*</code> - the same type as the original object, but with every
primitive processed by the visitor function  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>\*</code> | any object, arrary, or primitive |
| visitor | <code>function</code> | function to call on any primitive |


* * *

<a name="hashKey"></a>

## hashKey(source) ⇒ <code>String</code>
Return a standard hash of the given source string.

**Kind**: global function  
**Returns**: <code>String</code> - the hash key  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>String</code> | the source string as extracted from the source code, unmodified |


* * *

