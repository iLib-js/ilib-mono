<a name="Locale"></a>

## Locale
Represent a locale specifier instance.
Locales are specified either with a specifier string
that follows the BCP-47 convention (roughly: "language-region-script-variant") or
with 4 parameters that specify the language, region, variant, and script individually.

**Kind**: global class  

* [Locale](#Locale)
    * [new Locale(language, [region], [variant], [script])](#new_Locale_new)
    * _instance_
        * [.getLanguage()](#Locale+getLanguage) ⇒ <code>string</code> \| <code>undefined</code>
        * [.getLanguageAlpha3()](#Locale+getLanguageAlpha3) ⇒ <code>string</code> \| <code>undefined</code>
        * [.getRegion()](#Locale+getRegion) ⇒ <code>string</code> \| <code>undefined</code>
        * [.getRegionAlpha3()](#Locale+getRegionAlpha3) ⇒ <code>string</code> \| <code>undefined</code>
        * [.getScript()](#Locale+getScript) ⇒ <code>string</code> \| <code>undefined</code>
        * [.getVariant()](#Locale+getVariant) ⇒ <code>string</code> \| <code>undefined</code>
        * [.getSpec()](#Locale+getSpec) ⇒ <code>string</code>
        * [.getLangSpec()](#Locale+getLangSpec) ⇒ <code>string</code>
        * [.toString()](#Locale+toString) ⇒ <code>string</code>
        * [.equals()](#Locale+equals) ⇒ <code>boolean</code>
        * [.isValid()](#Locale+isValid) ⇒ <code>boolean</code>
    * _static_
        * [.regionAlpha2ToAlpha3(alpha2)](#Locale.regionAlpha2ToAlpha3) ⇒ <code>string</code> \| <code>undefined</code>
        * [.languageAlpha1ToAlpha3(alpha1)](#Locale.languageAlpha1ToAlpha3) ⇒ <code>string</code> \| <code>undefined</code>


* * *

<a name="new_Locale_new"></a>

### new Locale(language, [region], [variant], [script])
Create a new locale instance. Locales are specified either with a specifier string
that follows the BCP-47 convention (roughly: "language-region-script-variant") or
with 4 parameters that specify the language, region, variant, and script individually.<p>

The language is given as an ISO 639-1 two-letter, lower-case language code. You
can find a full list of these codes at
<a href="http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes">http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes</a><p>

The region is given as an ISO 3166-1 two-letter, upper-case region code. You can
find a full list of these codes at
<a href="http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2">http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2</a>.<p>

The variant is any string that does not contain a dash which further differentiates
locales from each other.<p>

The script is given as the ISO 15924 four-letter script code. In some locales,
text may be validly written in more than one script. For example, Serbian is often
written in both Latin and Cyrillic, though not usually mixed together. You can find a
full list of these codes at
<a href="http://en.wikipedia.org/wiki/ISO_15924#List_of_codes">http://en.wikipedia.org/wiki/ISO_15924#List_of_codes</a>.<p>

As an example in ilib, the script can be used in the date formatter. Dates formatted
in Serbian could have day-of-week names or month names written in the Latin
or Cyrillic script. Often one script is default such that sr-SR-Latn is the same
as sr-SR so the script code "Latn" can be left off of the locale spec.<p>

Each part is optional, and an empty string in the specifier before or after a
dash or as a parameter to the constructor denotes an unspecified value. In this
case, many of the ilib functions will treat the locale as generic. For example
the locale "en-" is equivalent to "en" and to "en--" and denotes a locale
of "English" with an unspecified region and variant, which typically matches
any region or variant.<p>

Without any arguments to the constructor, this function returns the locale of
the host Javascript engine.<p>


| Param | Type | Description |
| --- | --- | --- |
| language | <code>string</code> \| [<code>Locale</code>](#Locale) | the ISO 639 2-letter code for the language, or a full locale spec in BCP-47 format, or another Locale instance to copy from |
| [region] | <code>string</code> | the ISO 3166 2-letter code for the region |
| [variant] | <code>string</code> | the name of the variant of this locale, if any |
| [script] | <code>string</code> | the ISO 15924 code of the script for this locale, if any |


* * *

<a name="Locale+getLanguage"></a>

### locale.getLanguage() ⇒ <code>string</code> \| <code>undefined</code>
Return the ISO 639 language code for this locale.

**Kind**: instance method of [<code>Locale</code>](#Locale)  
**Returns**: <code>string</code> \| <code>undefined</code> - the language code for this locale  

* * *

<a name="Locale+getLanguageAlpha3"></a>

### locale.getLanguageAlpha3() ⇒ <code>string</code> \| <code>undefined</code>
Return the language of this locale as an ISO-639-alpha3 language code

**Kind**: instance method of [<code>Locale</code>](#Locale)  
**Returns**: <code>string</code> \| <code>undefined</code> - the alpha3 language code of this locale  

* * *

<a name="Locale+getRegion"></a>

### locale.getRegion() ⇒ <code>string</code> \| <code>undefined</code>
Return the ISO 3166 region code for this locale.

**Kind**: instance method of [<code>Locale</code>](#Locale)  
**Returns**: <code>string</code> \| <code>undefined</code> - the region code of this locale  

* * *

<a name="Locale+getRegionAlpha3"></a>

### locale.getRegionAlpha3() ⇒ <code>string</code> \| <code>undefined</code>
Return the region of this locale as an ISO-3166-alpha3 region code

**Kind**: instance method of [<code>Locale</code>](#Locale)  
**Returns**: <code>string</code> \| <code>undefined</code> - the alpha3 region code of this locale  

* * *

<a name="Locale+getScript"></a>

### locale.getScript() ⇒ <code>string</code> \| <code>undefined</code>
Return the ISO 15924 script code for this locale

**Kind**: instance method of [<code>Locale</code>](#Locale)  
**Returns**: <code>string</code> \| <code>undefined</code> - the script code of this locale  

* * *

<a name="Locale+getVariant"></a>

### locale.getVariant() ⇒ <code>string</code> \| <code>undefined</code>
Return the variant code for this locale

**Kind**: instance method of [<code>Locale</code>](#Locale)  
**Returns**: <code>string</code> \| <code>undefined</code> - the variant code of this locale, if any  

* * *

<a name="Locale+getSpec"></a>

### locale.getSpec() ⇒ <code>string</code>
Return the whole locale specifier as a string.

**Kind**: instance method of [<code>Locale</code>](#Locale)  
**Returns**: <code>string</code> - the locale specifier  

* * *

<a name="Locale+getLangSpec"></a>

### locale.getLangSpec() ⇒ <code>string</code>
Return the language locale specifier. This includes the
language and the script if it is available. This can be
used to see whether the written language of two locales
match each other regardless of the region or variant.

**Kind**: instance method of [<code>Locale</code>](#Locale)  
**Returns**: <code>string</code> - the language locale specifier  

* * *

<a name="Locale+toString"></a>

### locale.toString() ⇒ <code>string</code>
Express this locale object as a string. Currently, this simply calls the getSpec
function to represent the locale as its specifier.

**Kind**: instance method of [<code>Locale</code>](#Locale)  
**Returns**: <code>string</code> - the locale specifier  

* * *

<a name="Locale+equals"></a>

### locale.equals() ⇒ <code>boolean</code>
Return true if the the other locale is exactly equal to the current one.

**Kind**: instance method of [<code>Locale</code>](#Locale)  
**Returns**: <code>boolean</code> - whether or not the other locale is equal to the current one  

* * *

<a name="Locale+isValid"></a>

### locale.isValid() ⇒ <code>boolean</code>
Return true if the current locale uses a valid ISO codes for each component
of the locale that exists.

**Kind**: instance method of [<code>Locale</code>](#Locale)  
**Returns**: <code>boolean</code> - true if the current locale has all valid components, and
false otherwise.  

* * *

<a name="Locale.regionAlpha2ToAlpha3"></a>

### Locale.regionAlpha2ToAlpha3(alpha2) ⇒ <code>string</code> \| <code>undefined</code>
Return the ISO-3166 alpha3 equivalent region code for the given ISO 3166 alpha2
region code. If the given alpha2 code is not found, this function returns its
argument unchanged.

**Kind**: static method of [<code>Locale</code>](#Locale)  
**Returns**: <code>string</code> \| <code>undefined</code> - the alpha3 equivalent of the given alpha2 code, or the alpha2
parameter if the alpha2 value is not found  

| Param | Type | Description |
| --- | --- | --- |
| alpha2 | <code>string</code> \| <code>undefined</code> | the alpha2 code to map |


* * *

<a name="Locale.languageAlpha1ToAlpha3"></a>

### Locale.languageAlpha1ToAlpha3(alpha1) ⇒ <code>string</code> \| <code>undefined</code>
Return the ISO-639 alpha3 equivalent language code for the given ISO 639 alpha1
language code. If the given alpha1 code is not found, this function returns its
argument unchanged.

**Kind**: static method of [<code>Locale</code>](#Locale)  
**Returns**: <code>string</code> \| <code>undefined</code> - the alpha3 equivalent of the given alpha1 code, or the alpha1
parameter if the alpha1 value is not found  

| Param | Type | Description |
| --- | --- | --- |
| alpha1 | <code>string</code> \| <code>undefined</code> | the alpha1 code to map |


* * *

