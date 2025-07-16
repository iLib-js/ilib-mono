<a name="LocaleInfo"></a>

## LocaleInfo
Create a new locale info instance. Locale info instances give information about
the default settings for a particular locale. These settings may be overridden
by various parts of the code, and should be used as a fall-back setting of last
resort. <p>

The optional options object holds extra parameters if they are necessary. The
current list of supported options are:

<ul>
<li><i>sync</i> - tell whether to load any missing locale data synchronously or
asynchronously. If this option is given as "false", then the "onLoad"
callback must be given, as the instance returned from this constructor will
not be usable for a while.
</ul>

If this copy of ilib is pre-assembled and all the data is already available,
or if the data was already previously loaded, then this constructor will call
the onLoad callback immediately when the initialization is done.
If the onLoad option is not given, this class will only attempt to load any
missing locale data synchronously.

**Kind**: global class  
**See**: {ilib.setLoaderCallback} for information about registering a loader callback
function  

* [LocaleInfo](#LocaleInfo)
    * [new LocaleInfo(locale, [options])](#new_LocaleInfo_new)
    * _instance_
        * [.getLanguageName()](#LocaleInfo+getLanguageName) ⇒ <code>string</code>
        * [.getRegionName()](#LocaleInfo+getRegionName) ⇒ <code>string</code> \| <code>undefined</code>
        * [.getClock()](#LocaleInfo+getClock) ⇒ <code>string</code>
        * [.getLocale()](#LocaleInfo+getLocale) ⇒ <code>Locale</code>
        * [.getUnits()](#LocaleInfo+getUnits) ⇒ <code>string</code>
        * [.getCalendar()](#LocaleInfo+getCalendar) ⇒ <code>string</code>
        * [.getFirstDayOfWeek()](#LocaleInfo+getFirstDayOfWeek) ⇒ <code>number</code>
        * [.getWeekEndStart()](#LocaleInfo+getWeekEndStart) ⇒ <code>number</code>
        * [.getWeekEndEnd()](#LocaleInfo+getWeekEndEnd) ⇒ <code>number</code>
        * [.getTimeZone()](#LocaleInfo+getTimeZone) ⇒ <code>string</code>
        * [.getDecimalSeparator()](#LocaleInfo+getDecimalSeparator) ⇒ <code>string</code>
        * [.getNativeDecimalSeparator()](#LocaleInfo+getNativeDecimalSeparator) ⇒ <code>string</code>
        * [.getGroupingSeparator()](#LocaleInfo+getGroupingSeparator) ⇒ <code>string</code>
        * [.getNativeGroupingSeparator()](#LocaleInfo+getNativeGroupingSeparator) ⇒ <code>string</code>
        * [.getPrimaryGroupingDigits()](#LocaleInfo+getPrimaryGroupingDigits) ⇒ <code>number</code>
        * [.getSecondaryGroupingDigits()](#LocaleInfo+getSecondaryGroupingDigits) ⇒ <code>number</code>
        * [.getPercentageFormat()](#LocaleInfo+getPercentageFormat) ⇒ <code>string</code>
        * [.getNegativePercentageFormat()](#LocaleInfo+getNegativePercentageFormat) ⇒ <code>string</code>
        * [.getPercentageSymbol()](#LocaleInfo+getPercentageSymbol) ⇒ <code>string</code>
        * [.getExponential()](#LocaleInfo+getExponential) ⇒ <code>string</code>
        * [.getNativeExponential()](#LocaleInfo+getNativeExponential) ⇒ <code>string</code>
        * [.getNativePercentageSymbol()](#LocaleInfo+getNativePercentageSymbol) ⇒ <code>string</code>
        * [.getNegativeNumberFormat()](#LocaleInfo+getNegativeNumberFormat) ⇒ <code>string</code>
        * [.getCurrencyFormats()](#LocaleInfo+getCurrencyFormats) ⇒ <code>Object</code>
        * [.getCurrency()](#LocaleInfo+getCurrency) ⇒ <code>string</code>
        * [.getDigitsStyle()](#LocaleInfo+getDigitsStyle) ⇒ <code>string</code>
        * [.getDigits()](#LocaleInfo+getDigits) ⇒ <code>string</code> \| <code>undefined</code>
        * [.getNativeDigits()](#LocaleInfo+getNativeDigits) ⇒ <code>string</code> \| <code>undefined</code>
        * [.getRoundingMode()](#LocaleInfo+getRoundingMode) ⇒ <code>string</code>
        * [.getDefaultScript()](#LocaleInfo+getDefaultScript) ⇒ <code>string</code>
        * [.getScript()](#LocaleInfo+getScript) ⇒ <code>string</code>
        * [.getAllScripts()](#LocaleInfo+getAllScripts) ⇒ <code>Array.&lt;string&gt;</code>
        * [.getMeridiemsStyle()](#LocaleInfo+getMeridiemsStyle) ⇒ <code>string</code>
        * [.getPaperSize()](#LocaleInfo+getPaperSize) ⇒ <code>string</code>
        * [.getDelimiterQuotationStart()](#LocaleInfo+getDelimiterQuotationStart) ⇒ <code>string</code>
        * [.getDelimiterQuotationEnd()](#LocaleInfo+getDelimiterQuotationEnd) ⇒ <code>string</code>
    * _static_
        * [.create(locale, options)](#LocaleInfo.create) ⇒ <code>Promise</code>


* * *

<a name="new_LocaleInfo_new"></a>

### new LocaleInfo(locale, [options])

| Param | Type | Description |
| --- | --- | --- |
| locale | <code>Locale</code> \| <code>string</code> | the locale for which the info is sought, or undefined for |
| [options] | <code>Object</code> | the locale for which the info is sought, or undefined for the current locale |


* * *

<a name="LocaleInfo+getLanguageName"></a>

### localeInfo.getLanguageName() ⇒ <code>string</code>
Return the name of the locale's language in English.

**Kind**: instance method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>string</code> - the name of the locale's language in English  

* * *

<a name="LocaleInfo+getRegionName"></a>

### localeInfo.getRegionName() ⇒ <code>string</code> \| <code>undefined</code>
Return the name of the locale's region in English. If the locale
has no region, this returns undefined.

**Kind**: instance method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>string</code> \| <code>undefined</code> - the name of the locale's region in English  

* * *

<a name="LocaleInfo+getClock"></a>

### localeInfo.getClock() ⇒ <code>string</code>
Return whether this locale commonly uses the 12- or the 24-hour clock.

**Kind**: instance method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>string</code> - "12" if the locale commonly uses a 12-hour clock, or "24"
if the locale commonly uses a 24-hour clock.  

* * *

<a name="LocaleInfo+getLocale"></a>

### localeInfo.getLocale() ⇒ <code>Locale</code>
Return the locale that this info object was created with.

**Kind**: instance method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>Locale</code> - The locale spec of the locale used to construct this info instance  

* * *

<a name="LocaleInfo+getUnits"></a>

### localeInfo.getUnits() ⇒ <code>string</code>
Return the name of the measuring system that is commonly used in the given locale.
Valid values are "uscustomary", "imperial", and "metric".

**Kind**: instance method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>string</code> - The name of the measuring system commonly used in the locale  

* * *

<a name="LocaleInfo+getCalendar"></a>

### localeInfo.getCalendar() ⇒ <code>string</code>
Return the name of the calendar that is commonly used in the given locale.

**Kind**: instance method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>string</code> - The name of the calendar commonly used in the locale  

* * *

<a name="LocaleInfo+getFirstDayOfWeek"></a>

### localeInfo.getFirstDayOfWeek() ⇒ <code>number</code>
Return the day of week that starts weeks in the current locale. Days are still
numbered the standard way with 0 for Sunday through 6 for Saturday, but calendars
should be displayed and weeks calculated with the day of week returned from this
function as the first day of the week.

**Kind**: instance method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>number</code> - the day of the week that starts weeks in the current locale.  

* * *

<a name="LocaleInfo+getWeekEndStart"></a>

### localeInfo.getWeekEndStart() ⇒ <code>number</code>
Return the day of week that starts weekend in the current locale. Days are still
numbered the standard way with 0 for Sunday through 6 for Saturday.

**Kind**: instance method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>number</code> - the day of the week that starts weeks in the current locale.  

* * *

<a name="LocaleInfo+getWeekEndEnd"></a>

### localeInfo.getWeekEndEnd() ⇒ <code>number</code>
Return the day of week that starts weekend in the current locale. Days are still
numbered the standard way with 0 for Sunday through 6 for Saturday.

**Kind**: instance method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>number</code> - the day of the week that starts weeks in the current locale.  

* * *

<a name="LocaleInfo+getTimeZone"></a>

### localeInfo.getTimeZone() ⇒ <code>string</code>
Return the default time zone for this locale. Many locales span across multiple
time zones. In this case, the time zone with the largest population is chosen
to represent the locale. This is obviously not that accurate, but then again,
this method's return value should only be used as a default anyways.

**Kind**: instance method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>string</code> - the default time zone for this locale.  

* * *

<a name="LocaleInfo+getDecimalSeparator"></a>

### localeInfo.getDecimalSeparator() ⇒ <code>string</code>
Return the decimal separator for formatted numbers in this locale.

**Kind**: instance method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>string</code> - the decimal separator char  

* * *

<a name="LocaleInfo+getNativeDecimalSeparator"></a>

### localeInfo.getNativeDecimalSeparator() ⇒ <code>string</code>
Return the decimal separator for formatted numbers in this locale for native script.

**Kind**: instance method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>string</code> - the decimal separator char  

* * *

<a name="LocaleInfo+getGroupingSeparator"></a>

### localeInfo.getGroupingSeparator() ⇒ <code>string</code>
Return the separator character used to separate groups of digits on the
integer side of the decimal character.

**Kind**: instance method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>string</code> - the grouping separator char  

* * *

<a name="LocaleInfo+getNativeGroupingSeparator"></a>

### localeInfo.getNativeGroupingSeparator() ⇒ <code>string</code>
Return the separator character used to separate groups of digits on the
integer side of the decimal character for the native script if present other than the default script.

**Kind**: instance method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>string</code> - the grouping separator char  

* * *

<a name="LocaleInfo+getPrimaryGroupingDigits"></a>

### localeInfo.getPrimaryGroupingDigits() ⇒ <code>number</code>
Return the minimum number of digits grouped together on the integer side
for the first (primary) group.
In western European cultures, groupings are in 1000s, so the number of digits
is 3.

**Kind**: instance method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>number</code> - the number of digits in a primary grouping, or 0 for no grouping  

* * *

<a name="LocaleInfo+getSecondaryGroupingDigits"></a>

### localeInfo.getSecondaryGroupingDigits() ⇒ <code>number</code>
Return the minimum number of digits grouped together on the integer side
for the second or more (secondary) group.<p>

In western European cultures, all groupings are by 1000s, so the secondary
size should be 0 because there is no secondary size. In general, if this
method returns 0, then all groupings are of the primary size.<p>

For some other cultures, the first grouping (primary)
is 3 and any subsequent groupings (secondary) are two. So, 100000 would be
written as: "1,00,000".

**Kind**: instance method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>number</code> - the number of digits in a secondary grouping, or 0 for no
secondary grouping.  

* * *

<a name="LocaleInfo+getPercentageFormat"></a>

### localeInfo.getPercentageFormat() ⇒ <code>string</code>
Return the format template used to format percentages in this locale.

**Kind**: instance method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>string</code> - the format template for formatting percentages  

* * *

<a name="LocaleInfo+getNegativePercentageFormat"></a>

### localeInfo.getNegativePercentageFormat() ⇒ <code>string</code>
Return the format template used to format percentages in this locale
with negative amounts.

**Kind**: instance method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>string</code> - the format template for formatting percentages  

* * *

<a name="LocaleInfo+getPercentageSymbol"></a>

### localeInfo.getPercentageSymbol() ⇒ <code>string</code>
Return the symbol used for percentages in this locale.

**Kind**: instance method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>string</code> - the symbol used for percentages in this locale  

* * *

<a name="LocaleInfo+getExponential"></a>

### localeInfo.getExponential() ⇒ <code>string</code>
Return the symbol used for exponential in this locale.

**Kind**: instance method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>string</code> - the symbol used for exponential in this locale  

* * *

<a name="LocaleInfo+getNativeExponential"></a>

### localeInfo.getNativeExponential() ⇒ <code>string</code>
Return the symbol used for exponential in this locale for native script.

**Kind**: instance method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>string</code> - the symbol used for exponential in this locale for native script  

* * *

<a name="LocaleInfo+getNativePercentageSymbol"></a>

### localeInfo.getNativePercentageSymbol() ⇒ <code>string</code>
Return the symbol used for percentages in this locale for native script.

**Kind**: instance method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>string</code> - the symbol used for percentages in this locale for native script  

* * *

<a name="LocaleInfo+getNegativeNumberFormat"></a>

### localeInfo.getNegativeNumberFormat() ⇒ <code>string</code>
Return the format template used to format negative numbers in this locale.

**Kind**: instance method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>string</code> - the format template for formatting negative numbers  

* * *

<a name="LocaleInfo+getCurrencyFormats"></a>

### localeInfo.getCurrencyFormats() ⇒ <code>Object</code>
Return an object containing the format templates for formatting currencies
in this locale. The object has a number of properties in it that each are
a particular style of format. Normally, this contains a "common" and an "iso"
style, but may contain others in the future.

**Kind**: instance method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>Object</code> - an object containing the format templates for currencies  

* * *

<a name="LocaleInfo+getCurrency"></a>

### localeInfo.getCurrency() ⇒ <code>string</code>
Return the currency that is legal in the locale, or which is most commonly
used in regular commerce.

**Kind**: instance method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>string</code> - the ISO 4217 code for the currency of this locale  

* * *

<a name="LocaleInfo+getDigitsStyle"></a>

### localeInfo.getDigitsStyle() ⇒ <code>string</code>
Return a string that describes the style of digits used by this locale.
Possible return values are:
<ul>
<li><i>western</i> - uses the regular western 10-based digits 0 through 9
<li><i>optional</i> - native 10-based digits exist, but in modern usage,
this locale most often uses western digits
<li><i>native</i> - native 10-based native digits exist and are used
regularly by this locale
<li><i>custom</i> - uses native digits by default that are not 10-based
</ul>

**Kind**: instance method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>string</code> - string that describes the style of digits used in this locale  

* * *

<a name="LocaleInfo+getDigits"></a>

### localeInfo.getDigits() ⇒ <code>string</code> \| <code>undefined</code>
Return the digits of the default script if they are defined.
If not defined, the default should be the regular "Arabic numerals"
used in the Latin script. (0-9)

**Kind**: instance method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>string</code> \| <code>undefined</code> - the digits used in the default script  

* * *

<a name="LocaleInfo+getNativeDigits"></a>

### localeInfo.getNativeDigits() ⇒ <code>string</code> \| <code>undefined</code>
Return the digits of the native script if they are defined.

**Kind**: instance method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>string</code> \| <code>undefined</code> - the digits used in the default script  

* * *

<a name="LocaleInfo+getRoundingMode"></a>

### localeInfo.getRoundingMode() ⇒ <code>string</code>
If this locale typically uses a different type of rounding for numeric
formatting other than halfdown, especially for currency, then it can be
specified in the localeinfo. If the locale uses the default, then this
method returns undefined. The locale's rounding method overrides the
rounding method for the currency itself, which can sometimes shared
between various locales so it is less specific.

**Kind**: instance method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>string</code> - the name of the rounding mode typically used in this
locale, or "halfdown" if the locale does not override the default  

* * *

<a name="LocaleInfo+getDefaultScript"></a>

### localeInfo.getDefaultScript() ⇒ <code>string</code>
Return the default script used to write text in the language of this
locale. Text for most languages is written in only one script, but there
are some languages where the text can be written in a number of scripts,
depending on a variety of things such as the region, ethnicity, religion,
etc. of the author. This method returns the default script for the
locale, in which the language is most commonly written.<p>

The script is returned as an ISO 15924 4-letter code.

**Kind**: instance method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>string</code> - the ISO 15924 code for the default script used to write
text in this locale  

* * *

<a name="LocaleInfo+getScript"></a>

### localeInfo.getScript() ⇒ <code>string</code>
Return the script used for the current locale. If the current locale
explicitly defines a script, then this script is returned. If not, then
the default script for the locale is returned.

**Kind**: instance method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>string</code> - the ISO 15924 code for the script used to write
text in this locale  
**See**: LocaleInfo.getDefaultScript  

* * *

<a name="LocaleInfo+getAllScripts"></a>

### localeInfo.getAllScripts() ⇒ <code>Array.&lt;string&gt;</code>
Return an array of script codes which are used to write text in the current
language. Text for most languages is written in only one script, but there
are some languages where the text can be written in a number of scripts,
depending on a variety of things such as the region, ethnicity, religion,
etc. of the author. This method returns an array of script codes in which
the language is commonly written.

**Kind**: instance method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>Array.&lt;string&gt;</code> - an array of ISO 15924 codes for the scripts used
to write text in this language  

* * *

<a name="LocaleInfo+getMeridiemsStyle"></a>

### localeInfo.getMeridiemsStyle() ⇒ <code>string</code>
Return the default style of meridiems used in this locale. Meridiems are
times of day like AM/PM. In a few locales with some calendars, for example
Amharic/Ethiopia using the Ethiopic calendar, the times of day may be
split into different segments than simple AM/PM as in the Gregorian
calendar. Only a few locales are like that. For most locales, formatting
a Gregorian date will use the regular Gregorian AM/PM meridiems.

**Kind**: instance method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>string</code> - the default meridiems style used in this locale. Possible
values are "gregorian", "chinese", and "ethiopic"  

* * *

<a name="LocaleInfo+getPaperSize"></a>

### localeInfo.getPaperSize() ⇒ <code>string</code>
Return the default PaperSize information in this locale.

**Kind**: instance method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>string</code> - default PaperSize in this locale  

* * *

<a name="LocaleInfo+getDelimiterQuotationStart"></a>

### localeInfo.getDelimiterQuotationStart() ⇒ <code>string</code>
Return the default Delimiter QuotationStart information in this locale.

**Kind**: instance method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>string</code> - default QuotationStart in this locale  

* * *

<a name="LocaleInfo+getDelimiterQuotationEnd"></a>

### localeInfo.getDelimiterQuotationEnd() ⇒ <code>string</code>
Return the default Delimiter QuotationEnd information in this locale.

**Kind**: instance method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>string</code> - default QuotationEnd in this locale  

* * *

<a name="LocaleInfo.create"></a>

### LocaleInfo.create(locale, options) ⇒ <code>Promise</code>
Factory method to create a new instance of LocaleInfo asynchronously.
The parameters are the same as for the constructor, but it returns
a `Promise` instead of the instance directly.

**Kind**: static method of [<code>LocaleInfo</code>](#LocaleInfo)  
**Returns**: <code>Promise</code> - a promise to load a LocaleInfo instance. The resolved
value of the promise is the new instance of LocaleInfo,  

| Param | Type | Description |
| --- | --- | --- |
| locale | <code>string</code> | the locale to get the info for |
| options | <code>Object</code> | the same objects you would send to a constructor |


* * *

