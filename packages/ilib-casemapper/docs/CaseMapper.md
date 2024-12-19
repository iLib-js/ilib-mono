<a name="CaseMapper"></a>

## CaseMapper
A class that can map strings to upper and lower case in a 
locale-sensitive manner.

**Kind**: global class  

* [CaseMapper](#CaseMapper)
    * [new CaseMapper([options])](#new_CaseMapper_new)
    * [.getLocale()](#CaseMapper+getLocale) ⇒ <code>Locale</code>
    * [.map(string)](#CaseMapper+map) ⇒ <code>string</code> \| <code>undefined</code>


* * *

<a name="new_CaseMapper_new"></a>

### new CaseMapper([options])
Create a new string case mapper instance that maps strings to upper or
lower case. This mapping will work for any string as characters
that have no case will be returned unchanged.<p>

The options may contain any of the following properties:

<ul>
<li><i>locale</i> - locale to use when loading the mapper. Some maps are
locale-dependent, and this locale selects the right one. Default if this is
not specified is the current locale.

<li><i>direction</i> - "toupper" for upper-casing, or "tolower" for lower-casing.
Default if not specified is "toupper".
</ul>


| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | options to initialize this mapper |


* * *

<a name="CaseMapper+getLocale"></a>

### caseMapper.getLocale() ⇒ <code>Locale</code>
Return the locale that this mapper was constructed with.

**Kind**: instance method of [<code>CaseMapper</code>](#CaseMapper)  
**Returns**: <code>Locale</code> - the locale that this mapper was constructed with  

* * *

<a name="CaseMapper+map"></a>

### caseMapper.map(string) ⇒ <code>string</code> \| <code>undefined</code>
Map a string to lower case in a locale-sensitive manner.

**Kind**: instance method of [<code>CaseMapper</code>](#CaseMapper)  

| Param | Type |
| --- | --- |
| string | <code>string</code> \| <code>undefined</code> | 


* * *

