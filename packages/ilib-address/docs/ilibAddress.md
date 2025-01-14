## Classes

<dl>
<dt><a href="#Address">Address</a></dt>
<dd><p>A class to parse and represent mailing addresses</p>
</dd>
<dt><a href="#AddressFmt">AddressFmt</a></dt>
<dd><p>Format mailing addresses</p>
</dd>
</dl>

<a name="Address"></a>

## Address
A class to parse and represent mailing addresses

**Kind**: global class  

* [Address](#Address)
    * [new Address(freeformAddress, options)](#new_Address_new)
    * _instance_
        * [.streetAddress](#Address+streetAddress) : <code>string</code> \| <code>undefined</code>
        * [.locality](#Address+locality) : <code>string</code> \| <code>undefined</code>
        * [.region](#Address+region) : <code>string</code> \| <code>undefined</code>
        * [.postalCode](#Address+postalCode) : <code>string</code> \| <code>undefined</code>
        * [.postOffice](#Address+postOffice) : <code>string</code> \| <code>undefined</code>
        * [.country](#Address+country) : <code>string</code> \| <code>undefined</code>
        * [.countryCode](#Address+countryCode) : <code>string</code>
        * [.format](#Address+format) : <code>string</code>
    * _static_
        * [.create(freeformAddress, options)](#Address.create) ⇒ <code>Promise</code>


* * *

<a name="new_Address_new"></a>

### new Address(freeformAddress, options)
Create a new Address instance and parse a physical address.<p>

This function parses a physical address written in a free-form string.
It returns an object with a number of properties from the list below
that it may have extracted from that address.<p>

The following is a list of properties that the algorithm will return:<p>

<ul>
<li><i>streetAddress</i>: The street address, including house numbers and all.
<li><i>locality</i>: The locality of this address (usually a city or town).
<li><i>region</i>: The region where the locality is located. In the US, this
corresponds to states. In other countries, this may be provinces,
cantons, prefectures, etc. In some smaller countries, there are no
such divisions.
<li><i>postalCode</i>: Country-specific code for expediting mail. In the US,
this is the zip code.
<li><i>country</i>: The country of the address.
<li><i>countryCode</i>: The ISO 3166 2-letter region code for the destination
country in this address.
</ul>

The above properties will not necessarily appear in the instance. For
any individual property, if the free-form address does not contain
that property or it cannot be parsed out, the it is left out.<p>

The options parameter may contain any of the following properties:

<ul>
<li><i>locale</i> - locale or localeSpec to use to parse the address. If not
specified, this function will use the current ilib locale
</ul>

When an address cannot be parsed properly, the entire address will be placed
into the streetAddress property.<p>

When the freeformAddress is another Address, this will act like a copy
constructor.<p>


| Param | Type | Description |
| --- | --- | --- |
| freeformAddress | <code>string</code> \| [<code>Address</code>](#Address) | free-form address to parse, or a javascript object containing the fields |
| options | <code>Object</code> | options to the parser |


* * *

<a name="Address+streetAddress"></a>

### address.streetAddress : <code>string</code> \| <code>undefined</code>
The street address, including house numbers and all.

**Kind**: instance property of [<code>Address</code>](#Address)  

* * *

<a name="Address+locality"></a>

### address.locality : <code>string</code> \| <code>undefined</code>
The locality of this address (usually a city or town).

**Kind**: instance property of [<code>Address</code>](#Address)  

* * *

<a name="Address+region"></a>

### address.region : <code>string</code> \| <code>undefined</code>
The region (province, canton, prefecture, state, etc.) where the address is located.

**Kind**: instance property of [<code>Address</code>](#Address)  

* * *

<a name="Address+postalCode"></a>

### address.postalCode : <code>string</code> \| <code>undefined</code>
Country-specific code for expediting mail. In the US, this is the zip code.

**Kind**: instance property of [<code>Address</code>](#Address)  

* * *

<a name="Address+postOffice"></a>

### address.postOffice : <code>string</code> \| <code>undefined</code>
Optional city-specific code for a particular post office, used to expidite
delivery.

**Kind**: instance property of [<code>Address</code>](#Address)  

* * *

<a name="Address+country"></a>

### address.country : <code>string</code> \| <code>undefined</code>
The country of the address.

**Kind**: instance property of [<code>Address</code>](#Address)  

* * *

<a name="Address+countryCode"></a>

### address.countryCode : <code>string</code>
The 2 or 3 letter ISO 3166 region code for the destination country in this address.

**Kind**: instance property of [<code>Address</code>](#Address)  

* * *

<a name="Address+format"></a>

### address.format : <code>string</code>
private

**Kind**: instance property of [<code>Address</code>](#Address)  

* * *

<a name="Address.create"></a>

### Address.create(freeformAddress, options) ⇒ <code>Promise</code>
Factory method to create a new instance of AddressFmt asynchronously.
The parameters are the same as for the constructor, but it returns
a `Promise` instead of the instance directly.

**Kind**: static method of [<code>Address</code>](#Address)  
**Returns**: <code>Promise</code> - a promise to load a AddressFmt instance. The resolved
value of the promise is the new instance of AddressFmt,  

| Param | Type | Description |
| --- | --- | --- |
| freeformAddress | <code>string</code> \| [<code>Address</code>](#Address) | free-form address to parse, or a javascript object containing the fields |
| options | <code>Object</code> | the same objects you would send to a constructor |


* * *

<a name="AddressFmt"></a>

## AddressFmt
Format mailing addresses

**Kind**: global class  
**Construtor**:   

* [AddressFmt](#AddressFmt)
    * [new AddressFmt(options)](#new_AddressFmt_new)
    * _instance_
        * [.format(address)](#AddressFmt+format) ⇒ <code>string</code>
        * [.getFormatInfo(locale)](#AddressFmt+getFormatInfo) ⇒ <code>Promise</code>
    * _static_
        * [.create(freeformAddress, options)](#AddressFmt.create) ⇒ <code>Promise</code>


* * *

<a name="new_AddressFmt_new"></a>

### new AddressFmt(options)
Create a new formatter object to format physical addresses in a particular way.

The options object may contain the following properties, both of which are optional:

<ul>
<li><i>locale</i> - the locale to use to format this address. If not specified, it uses the default locale

<li><i>style</i> - the style of this address. The default style for each country usually includes all valid
fields for that country.
</ul>


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | options that configure how this formatter should work Returns a formatter instance that can format multiple addresses. |


* * *

<a name="AddressFmt+format"></a>

### addressFmt.format(address) ⇒ <code>string</code>
This function formats a physical address (Address instance) for display.
Whitespace is trimmed from the beginning and end of final resulting string, and
multiple consecutive whitespace characters in the middle of the string are
compressed down to 1 space character.

If the Address instance is for a locale that is different than the locale for this
formatter, then a hybrid address is produced. The country name is located in the
correct spot for the current formatter's locale, but the rest of the fields are
formatted according to the default style of the locale of the actual address.

Example: a mailing address in China, but formatted for the US might produce the words
"People's Republic of China" in English at the last line of the address, and the
Chinese-style address will appear in the first line of the address. In the US, the
country is on the last line, but in China the country is usually on the first line.

**Kind**: instance method of [<code>AddressFmt</code>](#AddressFmt)  
**Returns**: <code>string</code> - Returns a string containing the formatted address  

| Param | Type | Description |
| --- | --- | --- |
| address | [<code>Address</code>](#Address) | Address to format |


* * *

<a name="AddressFmt+getFormatInfo"></a>

### addressFmt.getFormatInfo(locale) ⇒ <code>Promise</code>
Return information about the address format that can be used
by UI builders to display a locale-sensitive set of input fields
based on the current formatter's settings.<p>

The object returned by this method is an array of address rows. Each
row is itself an array which may have one to four address
components in that row. Each address component is an object
that contains a component property and a label to display
with it. The label is written in the given locale, or the
locale of this formatter if it was not given.<p>

Optionally, if the address component is constrained to a
particular pattern or to a fixed list of possible values, then
the constraint rules are given in the "constraint" property.<p>

If an address component must conform to a particular pattern,
the regular expression that matches that pattern
is returned in "constraint". Mostly, it is only the postal code
component that can be validated in this way.<p>

If an address component should be limited
to a fixed list of values, then the constraint property will be
set to an array that lists those values. The constraint contains
an array of objects in the correct sorted order for the locale
where each object contains an code property containing the ISO code,
and a name field to show in UI.
The ISO codes should not be shown to the user and are intended to
represent the values in code. The names are translated to the given
locale or to the locale of this formatter if it was not given. For
the most part, it is the region and country components that
are constrained in this way.<p>

Here is what the result would look like for a US address:
<pre>
[
  [{
    "component": "streetAddress",
    "label": "Street Address"
  }],
  [{
    "component": "locality",
    "label": "City"
  },{
    "component": "region",
    "label": "State",
    "constraint": [{
      "code": "AL",
      "name": "Alabama"
    },{
      "code": "AK",
      "name": "Alaska"
    },{
      ...
    },{
      "code": "WY",
      "name": "Wyoming"
    }
  },{
    "component": "postalCode",
    "label": "Zip Code",
    "constraint": "[0-9]{5}(-[0-9]{4})?"
  }],
  [{
    "component": "country",
    "label": "Country",
    "constraint": [{
        "code": "AF",
        "name": "Afghanistan"
      },{
        "code": "AL",
        "name": "Albania"
      },{
      ...
      },{
        "code": "ZW",
        "name": "Zimbabwe"
    }]
  }]
]
</pre>
<p>

**Kind**: instance method of [<code>AddressFmt</code>](#AddressFmt)  
**Returns**: <code>Promise</code> - a promise to load the requested info  
**Accept**: <code>Array.&lt;Object&gt;</code> An array of rows of address components  
**Reject**: <code>undefined</code> No info available or info could not be loaded  

| Param | Type | Description |
| --- | --- | --- |
| locale | <code>Locale</code> \| <code>string</code> | the locale to translate the labels to. If not given, the locale of the formatter will be used. |

**Example** *(Example of calling the getFormatInfo method)*  
```js

// the AddressFmt should be created with the locale of the address you
// would like the user to enter. For example, if you have a "country"
// selector, you would create a new AddressFmt instance each time the
// selector is changed.
new AddressFmt({
  locale: 'nl-NL', // for addresses in the Netherlands
  onLoad: ilib.bind(this, function(fmt) {
    // The following is the locale of the UI you would like to see the labels
    // like "City" and "Postal Code" translated to. In this example, we
    // are showing an input form for Dutch addresses, but the labels are
    // written in US English.
    fmt.getAddressFormatInfo("en-US", true, ilib.bind(this, function(rows) {
      // iterate through the rows array and dynamically create the input
      // elements with the given labels
    }));
  })
});
```

* * *

<a name="AddressFmt.create"></a>

### AddressFmt.create(freeformAddress, options) ⇒ <code>Promise</code>
Factory method to create a new instance of AddressFmt asynchronously.
The parameters are the same as for the constructor, but it returns
a `Promise` instead of the instance directly.

**Kind**: static method of [<code>AddressFmt</code>](#AddressFmt)  
**Returns**: <code>Promise</code> - a promise to load a AddressFmt instance. The resolved
value of the promise is the new instance of AddressFmt,  

| Param | Type | Description |
| --- | --- | --- |
| freeformAddress | <code>string</code> \| [<code>Address</code>](#Address) | free-form address to parse, or a javascript object containing the fields |
| options | <code>Object</code> | the same objects you would send to a constructor |


* * *

