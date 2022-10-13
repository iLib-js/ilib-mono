## Classes

<dl>
<dt><a href="#Name">Name</a></dt>
<dd><p>A class to parse names of people. Different locales have different conventions when it
comes to naming people.<p></p>
</dd>
<dt><a href="#NameFmt">NameFmt</a></dt>
<dd><p>Represents a formatter that can format person name instances (Name) for display to
a user.<p></p>
<p>Formatting names is a locale-dependent function, as the order of the components
depends on the locale. The following explains some of the details:<p></p>
<ul>
<li>In Western countries, the given name comes first, followed by a space, followed
by the family name. In Asian countries, the family name comes first, followed immediately
by the given name with no space. But, that format is only used with Asian names written
in ideographic characters. In Asian countries, especially ones where both an Asian and
a Western language are used (Hong Kong, Singapore, etc.), the convention is often to
follow the language of the name. That is, Asian names are written in Asian style, and
Western names are written in Western style. This class follows that convention as
well.
<li>In other Asian countries, Asian names
written in Latin script are written with Asian ordering. eg. "Xu Ping-an" instead
of the more Western order "Ping-an Xu", as the order is thought to go with the style
that is appropriate for the name rather than the style for the language being written.
<li>In some Spanish speaking countries, people often take both their maternal and
paternal last names as their own family name. When formatting a short or medium style
of that family name, only the paternal name is used. In the long style, all the names
are used. eg. "Juan Julio Raul Lopez Ortiz" took the name "Lopez" from his father and
the name "Ortiz" from his mother. His family name would be "Lopez Ortiz". The formatted
short style of his name would be simply "Juan Lopez" which only uses his paternal
family name of "Lopez".
<li>In many Western languages, it is common to use auxillary words in family names. For
example, the family name of "Ludwig von Beethoven" in German is "von Beethoven", not
"Beethoven". This class ensures that the family name is formatted correctly with
all auxillary words.
</ul></dd>
</dl>

<a name="Name"></a>

## Name
A class to parse names of people. Different locales have different conventions when it
comes to naming people.<p>

**Kind**: global class  

* [Name](#Name)
    * [new Name(name, [options])](#new_Name_new)
    * _instance_
        * [.prefix](#Name+prefix) : <code>string</code> \| <code>Array.&lt;string&gt;</code>
        * [.givenName](#Name+givenName) : <code>string</code> \| <code>Array.&lt;string&gt;</code>
        * [.middleName](#Name+middleName) : <code>string</code> \| <code>Array.&lt;string&gt;</code>
        * [.familyName](#Name+familyName) : <code>string</code> \| <code>Array.&lt;string&gt;</code>
        * [.suffix](#Name+suffix) : <code>string</code> \| <code>Array.&lt;string&gt;</code>
        * [.honorific](#Name+honorific) : <code>string</code> \| <code>Array.&lt;string&gt;</code>
        * [.getSortFamilyName()](#Name+getSortFamilyName) ⇒ <code>string</code> \| <code>undefined</code>
        * [.clone()](#Name+clone)
    * _static_
        * [.create(name, options)](#Name.create) ⇒ <code>Promise</code>


* * *

<a name="new_Name_new"></a>

### new Name(name, [options])
Create a new instance of a Name. This parses the name and puts the result in the various
fields.<p>

The options can contain any of the following properties:

<ul>
<li><i>locale</i> - use the rules and conventions of the given locale in order to parse
the name
<li><i>style</i> - explicitly use the named style to parse the name. Valid values so
far are "western" and "asian". If this property is not specified, then the style will
be gleaned from the name itself. This class will count the total number of Latin or Asian
characters. If the majority of the characters are in one style, that style will be
used to parse the whole name.
<li><i>order</i> - explicitly use the given order for names. In some locales, such
as Russian, names may be written equally validly as "givenName familyName" or "familyName
givenName". This option tells the parser which order to prefer, and overrides the
default order for the locale. Valid values are "gf" (given-family) or "fg" (family-given).
<li><i>useSpaces</i> - explicitly specifies whether to use spaces or not between the given name , middle name
and family name.
<li><i>compoundFamilyName</i> - for Asian and some other types of names, search for compound
family names. If this parameter is not specified, the default is to use the setting that is
most common for the locale. If it is specified, the locale default is
overridden with this flag.
</ul>

Additionally, a name instance can be constructed by giving the explicit
already-parsed fields or by using another name instance as the parameter. (That is,
it becomes a copy constructor.) The name fields can be any of the following:

<ul>
<li><i>prefix</i> - the prefix prepended to the name
<li><i>givenName</i> - the person's given or "first" name
<li><i>middleName</i> - one or more middle names, separated by spaces even if the
language doesn't use usually use spaces. The spaces are merely separators.
<li><i>familyName</i> - one or more family or "last" names, separated by spaces
even if the language doesn't use usually use spaces. The spaces are merely separators.
<li><i>suffix</i> - the suffix appended to the name
<li><i>honorific</i> - the honorific title of the name. This could be formatted
as a prefix or a suffix, depending on the customs of the particular locale. You
should only give either an honorific or a prefix/suffix, but not both.
</ul>

When the parser has completed its parsing, it fills in the same fields as listed
above.<p>

For names that include auxilliary words, such as the family name "van der Heijden", all
of the auxilliary words ("van der") will be included in the field.<p>

For names in some Spanish locales, it is assumed that the family name is doubled. That is,
a person may have a paternal family name followed by a maternal family name. All
family names will be listed in the familyName field as normal, separated by spaces.
When formatting the short version of such names, only the paternal family name is used.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> \| [<code>Name</code>](#Name) \| <code>Object</code> | the name to parse |
| [options] | <code>Object</code> | Options governing the construction of this name instance |


* * *

<a name="Name+prefix"></a>

### name.prefix : <code>string</code> \| <code>Array.&lt;string&gt;</code>
The prefixes for this name

**Kind**: instance property of [<code>Name</code>](#Name)  

* * *

<a name="Name+givenName"></a>

### name.givenName : <code>string</code> \| <code>Array.&lt;string&gt;</code>
The given (personal) name in this name.

**Kind**: instance property of [<code>Name</code>](#Name)  

* * *

<a name="Name+middleName"></a>

### name.middleName : <code>string</code> \| <code>Array.&lt;string&gt;</code>
The middle names used in this name. If there are multiple middle names, they all
appear in this field separated by spaces.

**Kind**: instance property of [<code>Name</code>](#Name)  

* * *

<a name="Name+familyName"></a>

### name.familyName : <code>string</code> \| <code>Array.&lt;string&gt;</code>
The family names in this name. If there are multiple family names, they all
appear in this field separated by spaces.

**Kind**: instance property of [<code>Name</code>](#Name)  

* * *

<a name="Name+suffix"></a>

### name.suffix : <code>string</code> \| <code>Array.&lt;string&gt;</code>
The suffixes for this name. If there are multiple suffixes, they all
appear in this field separated by spaces.

**Kind**: instance property of [<code>Name</code>](#Name)  

* * *

<a name="Name+honorific"></a>

### name.honorific : <code>string</code> \| <code>Array.&lt;string&gt;</code>
The honorific title for this name. This honorific will be used as the prefix
or suffix as dictated by the locale

**Kind**: instance property of [<code>Name</code>](#Name)  

* * *

<a name="Name+getSortFamilyName"></a>

### name.getSortFamilyName() ⇒ <code>string</code> \| <code>undefined</code>
When sorting names with auxiliary words (like "van der" or "de los"), determine
which is the "head word" and return a string that can be easily sorted by head
word. In English, names are always sorted by initial characters. In places like
the Netherlands or Germany, family names are sorted by the head word of a list
of names rather than the first element of that name.

**Kind**: instance method of [<code>Name</code>](#Name)  
**Returns**: <code>string</code> \| <code>undefined</code> - a string containing the family name[s] to be used for sorting
in the current locale, or undefined if there is no family name in this object  

* * *

<a name="Name+clone"></a>

### name.clone()
Return a shallow copy of the current instance.

**Kind**: instance method of [<code>Name</code>](#Name)  
**Access**: protected  

* * *

<a name="Name.create"></a>

### Name.create(name, options) ⇒ <code>Promise</code>
Factory method to create a new instance of Name asynchronously.
The parameters are the same as for the constructor, but it returns
a `Promise` instead of the instance directly.

**Kind**: static method of [<code>Name</code>](#Name)  
**Returns**: <code>Promise</code> - a promise to load a Name instance. The resolved
value of the promise is the new instance of Name,  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the name to parse |
| options | <code>Object</code> | the same objects you would send to a constructor |


* * *

<a name="NameFmt"></a>

## NameFmt
Represents a formatter that can format person name instances (Name) for display to
a user.<p>

Formatting names is a locale-dependent function, as the order of the components
depends on the locale. The following explains some of the details:<p>

<ul>
<li>In Western countries, the given name comes first, followed by a space, followed
by the family name. In Asian countries, the family name comes first, followed immediately
by the given name with no space. But, that format is only used with Asian names written
in ideographic characters. In Asian countries, especially ones where both an Asian and
a Western language are used (Hong Kong, Singapore, etc.), the convention is often to
follow the language of the name. That is, Asian names are written in Asian style, and
Western names are written in Western style. This class follows that convention as
well.
<li>In other Asian countries, Asian names
written in Latin script are written with Asian ordering. eg. "Xu Ping-an" instead
of the more Western order "Ping-an Xu", as the order is thought to go with the style
that is appropriate for the name rather than the style for the language being written.
<li>In some Spanish speaking countries, people often take both their maternal and
paternal last names as their own family name. When formatting a short or medium style
of that family name, only the paternal name is used. In the long style, all the names
are used. eg. "Juan Julio Raul Lopez Ortiz" took the name "Lopez" from his father and
the name "Ortiz" from his mother. His family name would be "Lopez Ortiz". The formatted
short style of his name would be simply "Juan Lopez" which only uses his paternal
family name of "Lopez".
<li>In many Western languages, it is common to use auxillary words in family names. For
example, the family name of "Ludwig von Beethoven" in German is "von Beethoven", not
"Beethoven". This class ensures that the family name is formatted correctly with
all auxillary words.
</ul>

**Kind**: global class  

* [NameFmt](#NameFmt)
    * [new NameFmt(options)](#new_NameFmt_new)
    * _instance_
        * [.getLocale()](#NameFmt+getLocale) ⇒ <code>Locale</code>
        * [.getStyle()](#NameFmt+getStyle) ⇒ <code>string</code>
        * [.getComponents()](#NameFmt+getComponents) ⇒ <code>string</code>
        * [.format(name)](#NameFmt+format) ⇒ <code>string</code> \| <code>undefined</code>
    * _static_
        * [.create(options)](#NameFmt.create) ⇒ <code>Promise</code>


* * *

<a name="new_NameFmt_new"></a>

### new NameFmt(options)
Create an instance of a name formatter.<p>

The options may contain the following properties:

<ul>
<li><i>locale</i> - Use the conventions of the given locale to construct the name format.
<li><i>style</i> - Format the name with the given style. The value of this property
should be one of the following strings:
  <ul>
    <li><i>short</i> - Format a short name with just the given and family names. eg. "John Smith"
    <li><i>medium</i> - Format a medium-length name with the given, middle, and family names.
    eg. "John James Smith"
    <li><i>long</i> - Format a long name with all names available in the given name object, including
    prefixes. eg. "Mr. John James Smith"
    <li><i>full</i> - Format a long name with all names available in the given name object, including
    prefixes and suffixes. eg. "Mr. John James Smith, Jr."
    <li><i>formal_short</i> - Format a name with the honorific or prefix/suffix and the family
    name. eg. "Mr. Smith"
    <li><i>formal_long</i> - Format a name with the honorific or prefix/suffix and the
    given and family name. eg. "Mr. John Smith"
    <li><i>familiar</i> - Format a name with the most familiar style that the culture of the locale
    will accept. In some locales, it is not rude to address people you just met by their given name.
    In others, it is rude to address a person in such a familiar style unless you are previously
    invited to do so or unless you have known them for a while. In this case, it will use a more formal
    style, but still as familiar as possible so as not to be rude.
  </ul>
<li><i>components</i> - Format the name with the given components in the correct
order for those components. Components are encoded as a string of letters representing
the desired components:
  <ul>
    <li><i>p</i> - prefixes
    <li><i>g</i> - given name
    <li><i>m</i> - middle names
    <li><i>f</i> - family name
    <li><i>s</i> - suffixes
    <li><i>h</i> - honorifics (selects the prefix or suffix as required by the locale)
  </ul>
</ul>
<p>

For example, the string "pf" would mean to only format any prefixes and family names
together and leave out all the other parts of the name.<p>

The components can be listed in any order in the string. The <i>components</i> option
overrides the <i>style</i> option if both are specified.


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | A set of options that govern how the formatter will behave |


* * *

<a name="NameFmt+getLocale"></a>

### nameFmt.getLocale() ⇒ <code>Locale</code>
Return the locale for this formatter instance.

**Kind**: instance method of [<code>NameFmt</code>](#NameFmt)  
**Returns**: <code>Locale</code> - the locale instance for this formatter  

* * *

<a name="NameFmt+getStyle"></a>

### nameFmt.getStyle() ⇒ <code>string</code>
Return the style of names returned by this formatter

**Kind**: instance method of [<code>NameFmt</code>](#NameFmt)  
**Returns**: <code>string</code> - the style of names returned by this formatter  

* * *

<a name="NameFmt+getComponents"></a>

### nameFmt.getComponents() ⇒ <code>string</code>
Return the list of components used to format names in this formatter

**Kind**: instance method of [<code>NameFmt</code>](#NameFmt)  
**Returns**: <code>string</code> - the list of components  

* * *

<a name="NameFmt+format"></a>

### nameFmt.format(name) ⇒ <code>string</code> \| <code>undefined</code>
Format the name for display in the current locale with the options set up
in the constructor of this formatter instance.<p>

If the name does not contain all the parts required for the style, those parts
will be left blank.<p>

There are two basic styles of formatting: European, and Asian. If this formatter object
is set for European style, but an Asian name is passed to the format method, then this
method will format the Asian name with a generic Asian template. Similarly, if the
formatter is set for an Asian style, and a European name is passed to the format method,
the formatter will use a generic European template.<p>

This means it is always safe to format any name with a formatter for any locale. You should
always get something at least reasonable as output.<p>

**Kind**: instance method of [<code>NameFmt</code>](#NameFmt)  
**Returns**: <code>string</code> \| <code>undefined</code> - the name formatted according to the style of this formatter instance  

| Param | Type | Description |
| --- | --- | --- |
| name | [<code>Name</code>](#Name) \| <code>Object</code> | the name instance to format, or an object containing name parts to format |


* * *

<a name="NameFmt.create"></a>

### NameFmt.create(options) ⇒ <code>Promise</code>
Factory method to create a new instance of NameFmt asynchronously.
The parameters are the same as for the constructor, but it returns
a `Promise` instead of the instance directly.

**Kind**: static method of [<code>NameFmt</code>](#NameFmt)  
**Returns**: <code>Promise</code> - a promise to load a NameFmt instance. The resolved
value of the promise is the new instance of NameFmt,  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | the same objects you would send to a constructor |


* * *

