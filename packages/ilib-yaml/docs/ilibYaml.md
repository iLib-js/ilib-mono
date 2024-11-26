<a name="Yaml"></a>

## Yaml
Represents a yaml source file.

**Kind**: global class  

* [Yaml](#Yaml)
    * [new Yaml(props)](#new_Yaml_new)
    * [.getLocale()](#Yaml+getLocale) ⇒ <code>string</code>
    * [.getCommentPrefix()](#Yaml+getCommentPrefix) ⇒ <code>string</code>
    * [.getPath()](#Yaml+getPath) ⇒ <code>string</code>
    * [.deserialize(content)](#Yaml+deserialize)
    * [.serialize()](#Yaml+serialize) ⇒ <code>string</code>
    * [.getResource(reskey)](#Yaml+getResource) ⇒ <code>Resource</code> \| <code>undefined</code>
    * [.getResources()](#Yaml+getResources) ⇒ <code>Array.&lt;Resource&gt;</code>
    * [.getTranslationSet()](#Yaml+getTranslationSet) ⇒ <code>TranslationSet</code>
    * [.addResource(res)](#Yaml+addResource) ⇒ <code>boolean</code>
    * [.addResources(resourceArray)](#Yaml+addResources) ⇒ <code>boolean</code>


* * *

<a name="new_Yaml_new"></a>

### new Yaml(props)
Constructor a new Yaml instance.

If the instance is constructed with a sourceYaml parameter, then the resources
for this intance will be considered to be translated strings. Every string read
from the current yaml file will be looked up in the sourceYaml instance by id
for the corresponding source string and strings in this instance will be the
translated string. If no sourceYaml parameter is provided, then this instance
will be considered as a source yaml, and all strings read will appear as the
source of the Resource instances.<p>

If the yaml contains comments, these will appear as comments on the Resource
instances as well.


| Param | Type | Description |
| --- | --- | --- |
| props | <code>Object</code> | properties that control the construction of this file. |
| props.sourceYaml | <code>YamlFile</code> | If the current file contains translations, the corresponding source string can be found in this yaml instance |
| props.sourceLocale | <code>string</code> | If no source yaml is given, you can still set the source locale for this instance using this parameter |
| props.pathName | <code>string</code> | The path to the file |
| props.project | <code>string</code> | The name of the project to apply to all Resource instances |
| props.locale | <code>string</code> | for source-only yaml files, this is the source locale. For source and target yaml files, this is the target locale to apply to all Resource instances |
| props.context | <code>string</code> | The context to apply to every Resource instance |
| props.state | <code>string</code> | The state to apply to every Resource instance |
| props.datatype | <code>string</code> | The datatype to apply to every Resource instance |
| props.flavor | <code>string</code> | The flavor to apply to every Resource instance |
| props.commentPrefix | <code>string</code> | if a comment for a yaml entry begins with this string, that prefix will be stripped off of the comment automatically before being attached to the new Resource as a translator's comment |
| props.filter | <code>function</code> | Provide a filter that tells whether or not the current key/value pair should be included as a Resource. This filter is called on each yaml entry before the Resource is created. If the filter returns false, the entry is skipped and no Resource is created. If it returns true, or if there was no filter specified, then the Resource is created normally. |


* * *

<a name="Yaml+getLocale"></a>

### yaml.getLocale() ⇒ <code>string</code>
Return the locale of this instance.

**Kind**: instance method of [<code>Yaml</code>](#Yaml)  
**Returns**: <code>string</code> - the locale of this instance  

* * *

<a name="Yaml+getCommentPrefix"></a>

### yaml.getCommentPrefix() ⇒ <code>string</code>
Return the comment prefix set in the constructor.
This is the prefix to automatically strip from the
comments added to Resource instances.

**Kind**: instance method of [<code>Yaml</code>](#Yaml)  
**Returns**: <code>string</code> - the comment prefix  

* * *

<a name="Yaml+getPath"></a>

### yaml.getPath() ⇒ <code>string</code>
Return the path name that is used to construct all Resource instances.

**Kind**: instance method of [<code>Yaml</code>](#Yaml)  
**Returns**: <code>string</code> - the path used to construct all Resource instances  

* * *

<a name="Yaml+deserialize"></a>

### yaml.deserialize(content)
Deserialize a string containing the contents of a yaml file into an array
of Resource instances.

**Kind**: instance method of [<code>Yaml</code>](#Yaml)  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>string</code> | The contents of the file to parse |


* * *

<a name="Yaml+serialize"></a>

### yaml.serialize() ⇒ <code>string</code>
Serialize the Resources in this instance into a yaml file format and
return it as a string.

**Kind**: instance method of [<code>Yaml</code>](#Yaml)  
**Returns**: <code>string</code> - the Resources in this instance as a yaml file  

* * *

<a name="Yaml+getResource"></a>

### yaml.getResource(reskey) ⇒ <code>Resource</code> \| <code>undefined</code>
Return the resource in this instance with the given reskey or undefined
if the resource is not found.

**Kind**: instance method of [<code>Yaml</code>](#Yaml)  
**Returns**: <code>Resource</code> \| <code>undefined</code> - the resource with the given reskey  

| Param | Type | Description |
| --- | --- | --- |
| reskey | <code>string</code> | the key for the resource being sought |


* * *

<a name="Yaml+getResources"></a>

### yaml.getResources() ⇒ <code>Array.&lt;Resource&gt;</code>
Return an array of resources in this yaml file.

**Kind**: instance method of [<code>Yaml</code>](#Yaml)  
**Returns**: <code>Array.&lt;Resource&gt;</code> - an array of resources in this yaml  

* * *

<a name="Yaml+getTranslationSet"></a>

### yaml.getTranslationSet() ⇒ <code>TranslationSet</code>
Return a translation set with all the resources from the current file in it.

**Kind**: instance method of [<code>Yaml</code>](#Yaml)  
**Returns**: <code>TranslationSet</code> - the set with all the resources in it  

* * *

<a name="Yaml+addResource"></a>

### yaml.addResource(res) ⇒ <code>boolean</code>
Add a resource to this instance. The locale of the resource
should correspond to the locale of the file, and the
context of the resource should match the context of
the file.

**Kind**: instance method of [<code>Yaml</code>](#Yaml)  
**Returns**: <code>boolean</code> - if the resource was added successfully, and false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| res | <code>Resource</code> | a resource to add to this file |


* * *

<a name="Yaml+addResources"></a>

### yaml.addResources(resourceArray) ⇒ <code>boolean</code>
Add an array of resources to this instance.

**Kind**: instance method of [<code>Yaml</code>](#Yaml)  
**Returns**: <code>boolean</code> - true if all resources were added successfully, and false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| resourceArray | <code>Array.&lt;Resource&gt;</code> | the array of resources to add |


* * *

