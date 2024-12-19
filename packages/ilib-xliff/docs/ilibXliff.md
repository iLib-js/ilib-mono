## Classes

<dl>
<dt><a href="#TranslationUnit">TranslationUnit</a></dt>
<dd><p>A class that represents an translation unit in an
xliff file.</p>
</dd>
<dt><a href="#Xliff">Xliff</a></dt>
<dd><p>A class that represents an xliff file. Xliff stands for Xml 
Localization Interchange File Format.</p>
</dd>
</dl>

<a name="TranslationUnit"></a>

## TranslationUnit
A class that represents an translation unit in an
xliff file.

**Kind**: global class  

* [TranslationUnit](#TranslationUnit)
    * [new TranslationUnit(options)](#new_TranslationUnit_new)
    * [.clone()](#TranslationUnit+clone) ⇒ [<code>TranslationUnit</code>](#TranslationUnit)


* * *

<a name="new_TranslationUnit_new"></a>

### new TranslationUnit(options)
Construct a new translation unit The options may be undefined, which represents
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
<li><i>translate</i> - flag that tells whether to translate this unit (optional)
</ul>

If the required properties are not given, the constructor throws an exception.<p>

For newly extracted strings, there is no target text yet. There must be a target
locale for the translators to use when creating new target text, however. This
means that there may be multiple translation units in a file with the same
source locale and no target text, but different target locales.


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> \| <code>undefined</code> | options to initialize the unit, or undefined for a new empty unit |


* * *

<a name="TranslationUnit+clone"></a>

### translationUnit.clone() ⇒ [<code>TranslationUnit</code>](#TranslationUnit)
Clone the current unit and return the clone.

**Kind**: instance method of [<code>TranslationUnit</code>](#TranslationUnit)  
**Returns**: [<code>TranslationUnit</code>](#TranslationUnit) - a clone of the current unit.  

* * *

<a name="Xliff"></a>

## Xliff
A class that represents an xliff file. Xliff stands for Xml 
Localization Interchange File Format.

**Kind**: global class  

* [Xliff](#Xliff)
    * [new Xliff(options)](#new_Xliff_new)
    * [.addTranslationUnit](#Xliff+addTranslationUnit)
    * [.getTranslationUnits()](#Xliff+getTranslationUnits) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.addTranslationUnits(files)](#Xliff+addTranslationUnits)
    * [.size()](#Xliff+size) ⇒ <code>number</code>
    * [.toString1()](#Xliff+toString1) ⇒ <code>String</code>
    * [.toString2()](#Xliff+toString2) ⇒ <code>String</code>
    * [.toStringCustom()](#Xliff+toStringCustom) ⇒ <code>String</code>
    * [.serialize(untranslated)](#Xliff+serialize) ⇒ <code>String</code>
    * [.deserialize(xml)](#Xliff+deserialize)
    * [.getVersion()](#Xliff+getVersion) ⇒ <code>String</code>
    * [.clear()](#Xliff+clear)


* * *

<a name="new_Xliff_new"></a>

### new Xliff(options)
Construct a new Xliff instance. The options may be undefined,
which represents a new, clean Xliff instance. The options object may also
be an object with any of the following properties:

<ul>
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
<li><i>version</i> - The version of xliff that will be produced by this instance.
</ul>


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Array.&lt;Object&gt;</code> \| <code>undefined</code> | options to initialize the file, or undefined for a new empty file |


* * *

<a name="Xliff+addTranslationUnit"></a>

### xliff.addTranslationUnit
Add this translation unit to this xliff.

**Kind**: instance property of [<code>Xliff</code>](#Xliff)  

| Param | Type | Description |
| --- | --- | --- |
| unit | [<code>TranslationUnit</code>](#TranslationUnit) | the translation unit to add to this xliff |


* * *

<a name="Xliff+getTranslationUnits"></a>

### xliff.getTranslationUnits() ⇒ <code>Array.&lt;Object&gt;</code>
Get the translation units in this xliff.

**Kind**: instance method of [<code>Xliff</code>](#Xliff)  
**Returns**: <code>Array.&lt;Object&gt;</code> - the translation units in this xliff  

* * *

<a name="Xliff+addTranslationUnits"></a>

### xliff.addTranslationUnits(files)
Add translation units to this xliff.

**Kind**: instance method of [<code>Xliff</code>](#Xliff)  

| Param | Type | Description |
| --- | --- | --- |
| files | <code>Array.&lt;Object&gt;</code> | the translation units to add to this xliff |


* * *

<a name="Xliff+size"></a>

### xliff.size() ⇒ <code>number</code>
Return the number of translation units in this xliff file.

**Kind**: instance method of [<code>Xliff</code>](#Xliff)  
**Returns**: <code>number</code> - the number of translation units in this xliff file  

* * *

<a name="Xliff+toString1"></a>

### xliff.toString1() ⇒ <code>String</code>
Serialize this xliff instance as an xliff 1.2 string.

**Kind**: instance method of [<code>Xliff</code>](#Xliff)  
**Returns**: <code>String</code> - the current instance encoded as an xliff 1.2
format string  

* * *

<a name="Xliff+toString2"></a>

### xliff.toString2() ⇒ <code>String</code>
Serialize this xliff instance as an xliff 2.0 string.

**Kind**: instance method of [<code>Xliff</code>](#Xliff)  
**Returns**: <code>String</code> - the current instance encoded as an xliff 2.0
format string  

* * *

<a name="Xliff+toStringCustom"></a>

### xliff.toStringCustom() ⇒ <code>String</code>
Serialize this xliff instance as an customized xliff 2.0 format string.

**Kind**: instance method of [<code>Xliff</code>](#Xliff)  
**Returns**: <code>String</code> - the current instance encoded as an customized xliff 2.0
format string  

* * *

<a name="Xliff+serialize"></a>

### xliff.serialize(untranslated) ⇒ <code>String</code>
Serialize this xliff instance to a string that contains
the xliff format xml text.

**Kind**: instance method of [<code>Xliff</code>](#Xliff)  
**Returns**: <code>String</code> - the current instance encoded as an xliff format
xml text  

| Param | Type | Description |
| --- | --- | --- |
| untranslated | <code>boolean</code> | if true, add the untranslated resources to the xliff file without target tags. Otherwiwe, untranslated resources are skipped. |


* * *

<a name="Xliff+deserialize"></a>

### xliff.deserialize(xml)
Deserialize the given string as an xml file in xliff format
into this xliff instance. If there are any existing translation
units already in this instance, they will be removed first.

**Kind**: instance method of [<code>Xliff</code>](#Xliff)  

| Param | Type | Description |
| --- | --- | --- |
| xml | <code>String</code> | the xliff format text to parse |


* * *

<a name="Xliff+getVersion"></a>

### xliff.getVersion() ⇒ <code>String</code>
Return the version of this xliff file. If you deserialize a string into this
instance of Xliff, the version will be reset to whatever is found inside of
the xliff file.

**Kind**: instance method of [<code>Xliff</code>](#Xliff)  
**Returns**: <code>String</code> - the version of this xliff  

* * *

<a name="Xliff+clear"></a>

### xliff.clear()
Clear the current xliff file of all translation units and start from scratch. All
the settings from the constructor are still kept. Only the translation units are
removed.

**Kind**: instance method of [<code>Xliff</code>](#Xliff)  

* * *

