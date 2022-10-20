## Classes

<dl>
<dt><a href="#LocaleData">LocaleData</a></dt>
<dd><p>A locale data instance.</p>
<p>This class is a repository for locale-sensitive data only. For
non-locale data (ie. data that is not specific to a particular
locale), a class should load that data directly using a regular
javascript <code>import</code> statement or the asynchronous <code>import()</code>
function. This allows packagers like webpack
to include that data directly into the bundle.<p></p>
<p>Locale data instances should not be created directly. Instead,
use the <code>getLocaleData()</code> factory method, which returns a locale
data singleton.<p></p>
<p>Packages should not attempt to load any
locale data of another package. The other package may change what
data it stores, or how it is stored or encoded, without notice,
so depending
on another package&#39;s data is dangerous. Instead, that other package should
be designed to provide a stable API for the current package to get
any information that it may need.<p></p>
<h2>Finding Data</h2>

<p>This class finds locale data in multiple ways:</p>
<ol>
<li>by looking in the cache. If the required data is already loaded, it is
returned immediately. When loading data asynchronously, if the data is
found in the cache, a promise is
still returned, even though is resolved immediately.
<li>by looking for files that contain data about an entire locale.
<li>by looking for files that contain data about parts of a locale.
</ol>

<h2>Locale Data Files</h2>

<p>Files containing locale data can be encoded in two ways:</p>
<ol>
<li>JSON files. Data can be encoded as JSON files in JSON5 format.
<li>JS files. Data can be encoded inside of JS files that contain a
module that returns the locale data. These type of files may be loaded
dynamically when needed using "import", but are only available in
async mode.
</ol>

<p>All files need to be encoded in UTF-8.</p>
<h2>Roots</h2>

<p>Files are loaded from a list of roots. The locale data loader looks in
each root in order to find the locale data. When the file is
found, the locale data loader will stop looking in subsequent roots for
more data. The last root in the list is typically the &quot;locale&quot; directory
within the package itself and contains the locale data that the package
was originally shipped with. In
this way, locale data that comes with a package can be overridden by
other data that is perhaps customized by the app or the operating system
or it might be updated from what is in the original package.<p></p>
<p>The list of roots is global, shared by all instances of the locale data
class no matter what type of data is being loaded. In this way, an app
can set the roots once and all locale data
instances will use the same list. There are a number of static methods
on the locale data class to manage the list of roots.<p></p>
<p>For optimization, a root may contain a file named &quot;ilibmanifest.json&quot;.
If it is there, it will be loaded first. It should list all of the
contents of that root, and is used to prevent the loader from needing to
test whether files exist in the file system. That makes the file loader
a little faster since only the files that actually exist will be read.
For example, let&#39;s say we are attempting to load the locale data for
number formatting, but this root does not have any such data, the locale
data instance can avoid checking multiple directories/files inside that
root for the existance of that data, and skip directly on to the next root.<p></p>
<h2>Locale Data Files</h2>

<p>The locale data loader will look in each root for data about a particular
locale. There are two styles of locale data:</p>
<ol>
<li>Locale data for an entire locale at once
<li>Locale data split into constituent locale parts and data types
</ol>

<p>Files named for the entire locale appear in the top of the root and have
the form &quot;[locale-spec].json&quot; or &quot;[locale-spec].js&quot;. For example, data for
the Danish locale for Denmark would appear in &quot;[root]/da-DK.json&quot; file,
and would contain data for multiple data types.<p></p>
<p>Data that is split in to its locale parts exists in directories named after
the locale parts in files of the form &quot;[basename].json&quot; or &quot;[basename].js&quot;.
For example, data for number formatting in the locale Danish for Denmark
would appear in the file &quot;[root]/da/DK/numfmt.json&quot;.<p></p>
<p>The purpose for splitting the locale data into separate parts is so that the various
parts can be
cobbled together to support any arbitrary locale. For example, Vietnamese is
spoken by a minority of people in the United States, but the the locale
&quot;vi-US&quot; is not one that is normally specified. Yet that locale can be supported
simply by
combining the locale data for the Vietnamese language and the locale data
for the US region.<p></p>
<p>The data can be split into various parts based on which part of the locale
that the data is dependent upon. Some data is dependent on the language, some
on the region, some the script, and some on any combination of language, script,
or region. When the locale data class loads this data, it starts
off with the most generic information, which is the world-wide &quot;root&quot; locale,
and progressively overrides it with more specific info if it exists.
For example, number formatting is dependent on
both language and region. In Italian, the number grouping separator character is
a regular period. But Italian as spoken in Switzerland uses the
apostrophe ’ character instead. In this case, the &quot;it-CH&quot; locale would use most
of the settings from the root or the &quot;it&quot; language except for the grouping character,
which uses the more specific data of the apostrophe for the grouping character.<p></p>
<ul>
<li> [root]/numfmt.json -> contains grouping separator character is comma "," which is
 default for the world. eg. 100,000
<li>[root]/it/numfmt.json -> contains the grouping separator char period "." for any
place that speaks Italian, including Italy, Switzerland, San Marino, and Vatican City
as well as small parts of Austria, Slovenia, and Croatia. eg. 100.000
<li>[root]/it/CH/numfmt.json -> contains the grouping separator char apostrophe "’"
specifically for Italian as it is spoken in Switzerland. eg. 100’000
</ul>

<h2>Order of Specificity</h2>

<p>Locale data that is split based on locale parts are merged together to form the data
for the whole locale. It is merged starting with the least specific data (ie. default
data for the whole world) and going to the most specific data (ie. data that is
dependent on all of the specified locale parts.). The following list defines the
order in which the parts are merged:</p>
<ol>
<li> "root" (default for the whole world)
<li> language
<li> und/region
<li> language/script
<li> language/region
<li> region/variant
<li> language/script/region
<li> language/region/variant
<li> language/script/region/variant
</ol>

<p>If a file does not exist that contains locale data for that part of the locale, it will
simply be skipped. Note in the above, region-specific data appears under &quot;und/region&quot;
as the language is the minimum locale part and is required. The tag &quot;und&quot; stands for
the &quot;undefined&quot; language, which ilib uses to mean &quot;all languages&quot;.</p>
<h2>Synchronicity and Caching</h2>

<p>Data is loaded using an instance of a Loader from the ilib-loader package.
All locale data can be imported asynchronously, as every loader must support
asynchronous operation. Some loaders, such as the one for Node.js can also support
synchronous operation. When the LocaleData instance is created, you can request to
use synchronous operation, but the loader may not support it. Call the <code>isSync</code> method
after the LocaleData instance is created to find out whether or not you can operate
in synchronous mode.<p></p>
<p>The LocaleData instance can return data synchronously, even in asynchronous mode, if
the data is already cached. The data can get into the cache in multiple ways:</p>
<ul>
<li>Using `ensureLocale`. Some locale data can be pre-loaded from js files using the
`ensureLocale` method which will load the files asynchronously.

<li>Using `cacheData`. Data can be explicitly cached as well if you have some statically
loaded data in your
application and you wish to add it to the cache. Use the `cacheData` method to add
it to the cache.

<li>With a previous asynchronous call. If you create an ilib class asynchronously, its
data will be loaded into the cache for the requested locale. After the asynchronous call
completes, you can then create other instances for the same locale synchronously. For
example, if you load a date formatter for locale "de-DE" that formats the date and time
together, you can then synchronously create another data formatter for the same "de-DE"
locale that only formats the date or the time by itself, since they rely on the same
date formatting data.
</ul>

<p>The cache for locale data is shared amongst all instances of LocaleData in the global
scope. This means that if you have 2 copies of an ilib class loaded into your app,
they will share the same cache. Having 2 copies happens under nodejs for example if
those two copies are located in different paths with your application or if there are
two slightly different versions of the same ilib class.<p></p>
<p>If you are not sure whether or not data for your ilib class has been loaded yet, you
can use the <code>checkData</code> method to check. Ilib classes will use this method as well
to check if they can operate synchronously at the moment, even when the loader is in
asynchronous mode, because the locale data they need is already cached.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#getLocaleData">getLocaleData(options)</a> ⇒ <code><a href="#LocaleData">LocaleData</a></code> | <code>undefined</code></dt>
<dd><p>Return the locale data singleton for a package that needs data.</p>
</dd>
<dt><a href="#clearLocaleData">clearLocaleData()</a></dt>
<dd><p>Clear the whole locale data cache. This is mostly used for
unit testing, but can be used in your app if you need to cut
down on memory usage.</p>
</dd>
</dl>

<a name="LocaleData"></a>

## LocaleData
A locale data instance.

This class is a repository for locale-sensitive data only. For
non-locale data (ie. data that is not specific to a particular
locale), a class should load that data directly using a regular
javascript `import` statement or the asynchronous `import()`
function. This allows packagers like webpack
to include that data directly into the bundle.<p>

Locale data instances should not be created directly. Instead,
use the `getLocaleData()` factory method, which returns a locale
data singleton.<p>

Packages should not attempt to load any
locale data of another package. The other package may change what
data it stores, or how it is stored or encoded, without notice,
so depending
on another package's data is dangerous. Instead, that other package should
be designed to provide a stable API for the current package to get
any information that it may need.<p>

<h2>Finding Data</h2>

This class finds locale data in multiple ways:

<ol>
<li>by looking in the cache. If the required data is already loaded, it is
returned immediately. When loading data asynchronously, if the data is
found in the cache, a promise is
still returned, even though is resolved immediately.
<li>by looking for files that contain data about an entire locale.
<li>by looking for files that contain data about parts of a locale.
</ol>

<h2>Locale Data Files</h2>

Files containing locale data can be encoded in two ways:

<ol>
<li>JSON files. Data can be encoded as JSON files in JSON5 format.
<li>JS files. Data can be encoded inside of JS files that contain a
module that returns the locale data. These type of files may be loaded
dynamically when needed using "import", but are only available in
async mode.
</ol>

All files need to be encoded in UTF-8.

<h2>Roots</h2>

Files are loaded from a list of roots. The locale data loader looks in
each root in order to find the locale data. When the file is
found, the locale data loader will stop looking in subsequent roots for
more data. The last root in the list is typically the "locale" directory
within the package itself and contains the locale data that the package
was originally shipped with. In
this way, locale data that comes with a package can be overridden by
other data that is perhaps customized by the app or the operating system
or it might be updated from what is in the original package.<p>

The list of roots is global, shared by all instances of the locale data
class no matter what type of data is being loaded. In this way, an app
can set the roots once and all locale data
instances will use the same list. There are a number of static methods
on the locale data class to manage the list of roots.<p>

For optimization, a root may contain a file named "ilibmanifest.json".
If it is there, it will be loaded first. It should list all of the
contents of that root, and is used to prevent the loader from needing to
test whether files exist in the file system. That makes the file loader
a little faster since only the files that actually exist will be read.
For example, let's say we are attempting to load the locale data for
number formatting, but this root does not have any such data, the locale
data instance can avoid checking multiple directories/files inside that
root for the existance of that data, and skip directly on to the next root.<p>

<h2>Locale Data Files</h2>

The locale data loader will look in each root for data about a particular
locale. There are two styles of locale data:

<ol>
<li>Locale data for an entire locale at once
<li>Locale data split into constituent locale parts and data types
</ol>

Files named for the entire locale appear in the top of the root and have
the form "[locale-spec].json" or "[locale-spec].js". For example, data for
the Danish locale for Denmark would appear in "[root]/da-DK.json" file,
and would contain data for multiple data types.<p>

Data that is split in to its locale parts exists in directories named after
the locale parts in files of the form "[basename].json" or "[basename].js".
For example, data for number formatting in the locale Danish for Denmark
would appear in the file "[root]/da/DK/numfmt.json".<p>

The purpose for splitting the locale data into separate parts is so that the various
parts can be
cobbled together to support any arbitrary locale. For example, Vietnamese is
spoken by a minority of people in the United States, but the the locale
"vi-US" is not one that is normally specified. Yet that locale can be supported
simply by
combining the locale data for the Vietnamese language and the locale data
for the US region.<p>

The data can be split into various parts based on which part of the locale
that the data is dependent upon. Some data is dependent on the language, some
on the region, some the script, and some on any combination of language, script,
or region. When the locale data class loads this data, it starts
off with the most generic information, which is the world-wide "root" locale,
and progressively overrides it with more specific info if it exists.
For example, number formatting is dependent on
both language and region. In Italian, the number grouping separator character is
a regular period. But Italian as spoken in Switzerland uses the
apostrophe ’ character instead. In this case, the "it-CH" locale would use most
of the settings from the root or the "it" language except for the grouping character,
which uses the more specific data of the apostrophe for the grouping character.<p>

<ul>
<li> [root]/numfmt.json -> contains grouping separator character is comma "," which is
 default for the world. eg. 100,000
<li>[root]/it/numfmt.json -> contains the grouping separator char period "." for any
place that speaks Italian, including Italy, Switzerland, San Marino, and Vatican City
as well as small parts of Austria, Slovenia, and Croatia. eg. 100.000
<li>[root]/it/CH/numfmt.json -> contains the grouping separator char apostrophe "’"
specifically for Italian as it is spoken in Switzerland. eg. 100’000
</ul>

<h2>Order of Specificity</h2>

Locale data that is split based on locale parts are merged together to form the data
for the whole locale. It is merged starting with the least specific data (ie. default
data for the whole world) and going to the most specific data (ie. data that is
dependent on all of the specified locale parts.). The following list defines the
order in which the parts are merged:

<ol>
<li> "root" (default for the whole world)
<li> language
<li> und/region
<li> language/script
<li> language/region
<li> region/variant
<li> language/script/region
<li> language/region/variant
<li> language/script/region/variant
</ol>

If a file does not exist that contains locale data for that part of the locale, it will
simply be skipped. Note in the above, region-specific data appears under "und/region"
as the language is the minimum locale part and is required. The tag "und" stands for
the "undefined" language, which ilib uses to mean "all languages".

<h2>Synchronicity and Caching</h2>

Data is loaded using an instance of a Loader from the ilib-loader package.
All locale data can be imported asynchronously, as every loader must support
asynchronous operation. Some loaders, such as the one for Node.js can also support
synchronous operation. When the LocaleData instance is created, you can request to
use synchronous operation, but the loader may not support it. Call the `isSync` method
after the LocaleData instance is created to find out whether or not you can operate
in synchronous mode.<p>

The LocaleData instance can return data synchronously, even in asynchronous mode, if
the data is already cached. The data can get into the cache in multiple ways:

<ul>
<li>Using `ensureLocale`. Some locale data can be pre-loaded from js files using the
`ensureLocale` method which will load the files asynchronously.

<li>Using `cacheData`. Data can be explicitly cached as well if you have some statically
loaded data in your
application and you wish to add it to the cache. Use the `cacheData` method to add
it to the cache.

<li>With a previous asynchronous call. If you create an ilib class asynchronously, its
data will be loaded into the cache for the requested locale. After the asynchronous call
completes, you can then create other instances for the same locale synchronously. For
example, if you load a date formatter for locale "de-DE" that formats the date and time
together, you can then synchronously create another data formatter for the same "de-DE"
locale that only formats the date or the time by itself, since they rely on the same
date formatting data.
</ul>

The cache for locale data is shared amongst all instances of LocaleData in the global
scope. This means that if you have 2 copies of an ilib class loaded into your app,
they will share the same cache. Having 2 copies happens under nodejs for example if
those two copies are located in different paths with your application or if there are
two slightly different versions of the same ilib class.<p>

If you are not sure whether or not data for your ilib class has been loaded yet, you
can use the `checkData` method to check. Ilib classes will use this method as well
to check if they can operate synchronously at the moment, even when the loader is in
asynchronous mode, because the locale data they need is already cached.

**Kind**: global class  

* [LocaleData](#LocaleData)
    * [new LocaleData(packageName, options)](#new_LocaleData_new)
    * _instance_
        * [.isSync()](#LocaleData+isSync) ⇒ <code>boolean</code>
        * [.getPath()](#LocaleData+getPath) ⇒ <code>string</code>
        * [.loadData(params)](#LocaleData+loadData) ⇒ <code>Promise</code> \| <code>Object</code>
        * [.getRoots()](#LocaleData+getRoots) ⇒ <code>Array.&lt;string&gt;</code>
    * _static_
        * [.getGlobalRoots()](#LocaleData.getGlobalRoots) ⇒ <code>Array.&lt;string&gt;</code>
        * [.addGlobalRoot(the)](#LocaleData.addGlobalRoot)
        * [.removeGlobalRoot(the)](#LocaleData.removeGlobalRoot)
        * [.clearGlobalRoots()](#LocaleData.clearGlobalRoots)
        * [.ensureLocale(locale, [otherRoots])](#LocaleData.ensureLocale) ⇒ <code>Promise</code>
        * [.checkCache(packageName, locale, basename)](#LocaleData.checkCache) ⇒ <code>boolean</code>
        * [.cacheData(data, root)](#LocaleData.cacheData)
        * [.clearCache()](#LocaleData.clearCache)


* * *

<a name="new_LocaleData_new"></a>

### new LocaleData(packageName, options)
Create a locale data instance.

The options can contain the following properties:

<ul>
<li>path {string} (required) - The path to the local package's locale data on disk
<li>sync {boolean} - whether this locale data instance should operate in synchronous
mode by default. (Default value: false)
<li>useCache {boolean} - whether this locale data instance should use the locale
data cache or it should load the data each time. Specifying `false` for this option
will slow down constructors as it loads the same files again and again but it reduces
the memory footprint which may be more important than speed for small low-memory
devices. Default value: true
</ul>


| Param | Type | Description |
| --- | --- | --- |
| packageName | <code>string</code> | the unique name of the calling package. (eg. "LocaleInfo") |
| options | <code>Object</code> | options controlling the operation of this locale data instance, as detailed above |


* * *

<a name="LocaleData+isSync"></a>

### localeData.isSync() ⇒ <code>boolean</code>
Whether or not this locale data instance is loaded synchronously or not.
The default is for asynchronous operation. If the "sync" option is given
to the constructor with a truthy value, but the loader for the platform
does not synchronous operation, this locale data will still operate
asynchronously.

**Kind**: instance method of [<code>LocaleData</code>](#LocaleData)  
**Returns**: <code>boolean</code> - whether or not the default for this local data instance
loads data synchronously  

* * *

<a name="LocaleData+getPath"></a>

### localeData.getPath() ⇒ <code>string</code>
Return the path used to construct this LocaleData

**Kind**: instance method of [<code>LocaleData</code>](#LocaleData)  
**Returns**: <code>string</code> - path used to construct this LocaleData  

* * *

<a name="LocaleData+loadData"></a>

### localeData.loadData(params) ⇒ <code>Promise</code> \| <code>Object</code>
Find locale data or load it in. If the data with the given name is preassembled, it will
find the data in ilib.data. If the data is not preassembled but there is a loader function,
this function will call it to load the data. Otherwise, the callback will be called with
undefined as the data. This function will create a cache under the given class object.
If data was successfully loaded, it will be set into the cache so that future access to
the same data for the same locale is much quicker.<p>

The parameters can specify any of the following properties:<p>

<ul>
<li><i>basename</i> - String. The base name of the file being loaded. Default: ResBundle
<li><i>locale</i> - Locale. The locale for which data is loaded. Default is the current locale.
<li><i>replace</i> - boolean. When merging json objects, this parameter controls whether to merge arrays
or have arrays replace each other. If true, arrays in child objects replace the arrays in parent
objects. When false, the arrays in child objects are concatenated with the arrays in parent objects.
<li><i>returnOne</i> - return only the first file found. Do not merge many locale data files into one.
Default is "false".
<li><i>sync</i> - boolean. Whether or not to load the data synchronously
<li><i>mostSpecific</i> - boolean. When true, only the most specific locale data is returned. Multiple
locale data files are not merged into one. This is similar to returnOne except this one retuns the last
file, which is specific to the full locale, rather than the first one found which is specific to the
least specific locale (often the root). Default is "false".
<li><i>crossRoots</i> - boolean. When true, merge the locale data across the various roots. When false,
only the first data found for a locale is found, and the data for the same locale in other roots is
ignored. Default is "false" if not specified.
</ul>

**Kind**: instance method of [<code>LocaleData</code>](#LocaleData)  
**Returns**: <code>Promise</code> \| <code>Object</code> - the requested data or a promise to load the requested data  
**Fulfil**: <code>Object</code> the locale data  
**Reject**: <code>Error</code> if the data could not be loaded  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | Parameters configuring how to load the files (see above) |


* * *

<a name="LocaleData+getRoots"></a>

### localeData.getRoots() ⇒ <code>Array.&lt;string&gt;</code>
Return the list of roots that this LocaleData instance is using to load data.
The roots returned by this method always has the package path at the end of
it as the last-chance fallback for locale data. All the other roots override
it.

**Kind**: instance method of [<code>LocaleData</code>](#LocaleData)  
**Returns**: <code>Array.&lt;string&gt;</code> - the list of roots, in order  

* * *

<a name="LocaleData.getGlobalRoots"></a>

### LocaleData.getGlobalRoots() ⇒ <code>Array.&lt;string&gt;</code>
Return the list of roots shared by all of the instances of LocaleData. Entries
earlier in the list take precedence over entries later in the list.

**Kind**: static method of [<code>LocaleData</code>](#LocaleData)  
**Returns**: <code>Array.&lt;string&gt;</code> - the list of roots shared by all instances of LocaleData  

* * *

<a name="LocaleData.addGlobalRoot"></a>

### LocaleData.addGlobalRoot(the)
Add the path name to the beginning of the list of roots shared by all instances of
LocaleData. This method is static so that you can call it right at the beginning
of your app without creating an instance of LocaleData for any package.

**Kind**: static method of [<code>LocaleData</code>](#LocaleData)  

| Param | Type | Description |
| --- | --- | --- |
| the | <code>string</code> | path to add at the beginning of the list |


* * *

<a name="LocaleData.removeGlobalRoot"></a>

### LocaleData.removeGlobalRoot(the)
Remove the path from the list of roots shared by all instances of LocaleData.
If the path appears in the middle of the list, it will be removed from there
and the rest of the array will move down one.

**Kind**: static method of [<code>LocaleData</code>](#LocaleData)  

| Param | Type | Description |
| --- | --- | --- |
| the | <code>string</code> | path to remove |


* * *

<a name="LocaleData.clearGlobalRoots"></a>

### LocaleData.clearGlobalRoots()
Clear the list of roots shared by all instances of LocaleData.

**Kind**: static method of [<code>LocaleData</code>](#LocaleData)  

* * *

<a name="LocaleData.ensureLocale"></a>

### LocaleData.ensureLocale(locale, [otherRoots]) ⇒ <code>Promise</code>
Ensure that the data for a particular locale is loaded into the
cache so that it is available for future synchronous use.<p>

If the method completes successfully, the data is cached in the
same caching object as if the data was loaded with `loadData` method.
Because of this, future callers are not required
to call `loadData` asynchronously, even when the loader does not
support synchronous loading because the data is already cached.
The idea behind `ensureLocale` is to pre-load the data into the
cache. If the loader for the current platform
supports synchronous loading, this method will return a Promise that
resolves to true immediately because `loadData` can return the data
on-demand and it does not need to be pre-loaded.<p>

This method will look for files that are named [locale].js or
[locale].json where the locale is given as the full locale
specification. It looks for these files in the same list of roots
that `loadData` uses and merges the data it finds together. Data
from roots earlier in the list take precedence over data from roots
later in the list.<p>

The files named for the locale should contain the data of multiple
types. The first level of properties in the data should be the sublocales
of the locale. Within the sublocale property is the the basename
of the data. The properties within the basename property are the actual
locale data. For javascript files, the file should be a commonjs or
ESM style module that exports a function that takes no parameters.
This function should return the type of data described above.<p>

Example file "de-DE.js":

<code>
export default function getLocaleData() {
    return {
        "root": {
            "phonefmt": {
                "default": {
                    "example": "+1 211 555 1212",
                    etc.
                }
            }
         },
         "de": {
            "localeinfo": {
                "clock": "24",
                etc.
            }
         },
         "und-DE": {
            "phonefmt": {
                "default": {
                    "example": "030 12 34 56 78",
                    etc.
                }
            },
            "numplan": {
                "region": "DE",
                "countryCode": "+49",
                etc.
            }
         }
         "de-DE": {}
    };
};
</code>

The idea behind the sublocales is that the data for each sublocale can
be cached separately so that if a locale is requested that uses that
sublocale, it is available. For example, if the "de-DE" locale is
loaded with this method (as in the example above), the code may request
locale data for the "de" locale or the "und-DE" locale separately and it
will get the right data. Most
usefully, the root locale is given separately, so any requested locale
that does not match any of the sublocales can use the root locale data.<p>

If the data is loaded successfully, the Promise returned from this method
will resolve to `true`.
If there was an error loading the files, or if no files were found to
load, the Promise will resolve to `false`.<p>

**Kind**: static method of [<code>LocaleData</code>](#LocaleData)  
**Returns**: <code>Promise</code> - a promise to load the data with the resolved
value of true if the load was successful, and false if not  
**Fulfil**: <code>boolean</code> true if the locale data was successfully loaded or
false if it could be found  
**Reject**: <code>Error</code> if there was an error while loading the data  

| Param | Type | Description |
| --- | --- | --- |
| locale | <code>Locale</code> \| <code>string</code> | the Locale object or a string containing the locale spec |
| [otherRoots] | <code>Array.&lt;string&gt;</code> | an array of extra roots to search (other than the global roots) or undefined for no other roots |


* * *

<a name="LocaleData.checkCache"></a>

### LocaleData.checkCache(packageName, locale, basename) ⇒ <code>boolean</code>
Check to see if the given data basename for the given locale is available
in the cache. This method will return true if the locale data exists in the
the cache already or if it is known that the requested data does not exist.<p>

The following situations can occur:

<ul>
<li>Data available. The data for the locale was previously loaded and is
available. Returns true.
<li>No data. The data for the locale was previously loaded, but there was
specific data for this locale. Still returns true.
<li>Not available. The data for the locale was not previously loaded by
any of the methods and the next call to `loadData` will attempt to load
it. Returns false.
</ul>

Data can be considered to be "previously loaded" through any of the following:

<ul>
<li>`loadData` already attempted to load it, whether or not that attempt
succeeded
<li>The entire locale was already loaded using `ensureLocale`
<li>All the data was already provided statically from the application
using a call to `cacheData`.
</ul>

**Kind**: static method of [<code>LocaleData</code>](#LocaleData)  
**Returns**: <code>boolean</code> - true if the data is available, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| packageName | <code>string</code> | Name of the package to check for data |
| locale | <code>string</code> | full locale of the data to check |
| basename | <code>string</code> \| <code>undefined</code> | the basename of the data to check. If undefined, it will check if any data for any basename is available for the given locale |


* * *

<a name="LocaleData.cacheData"></a>

### LocaleData.cacheData(data, root)
The prepopulated data should have the following structure:

<pre>
{
   "locale": {
       "basename": {
           [ ... whatever data ... ]
       }
   }
}
</pre>

Replace the following in the above structure:
<ul>
<li>locale: the full locale specifier for the data. The data may have multiple
locales at the top level. Data that is only dependent on a region and not the language
or script, such as the time zone for the region, should use the language tag "und" (meaning
"undefined" language). eg. the timezone for the Netherlands should appear in
"und-NL".timezone.
<li>basename: the type of this particular data. This should be an object that contains
the settings for that locale. A locale property can contain data for multiple base
names at the same time. For example, it may contain data about phone number parsing
(basename "PhoneNumber") and phone number formatting (base name "PhoneFmt").
</ul>

**Kind**: static method of [<code>LocaleData</code>](#LocaleData)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | the locale date in the above format |
| root | <code>string</code> | the root from which this data was loaded |


* * *

<a name="LocaleData.clearCache"></a>

### LocaleData.clearCache()
Clear the locale data cache. This function is intended to be used by unit testing
to guarantee that the cache is clear before starting a new test.

**Kind**: static method of [<code>LocaleData</code>](#LocaleData)  

* * *

<a name="getLocaleData"></a>

## getLocaleData(options) ⇒ [<code>LocaleData</code>](#LocaleData) \| <code>undefined</code>
Return the locale data singleton for a package that needs data.

**Kind**: global function  
**Returns**: [<code>LocaleData</code>](#LocaleData) \| <code>undefined</code> - a locale data instance you can use
to load locale data, or undefined if it could not be created
or if the package name was not specified  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Options for the construction of the LocaleData instance. See the docs for the LocaleData constructor for details as to what this can contain. |


* * *

<a name="clearLocaleData"></a>

## clearLocaleData()
Clear the whole locale data cache. This is mostly used for
unit testing, but can be used in your app if you need to cut
down on memory usage.

**Kind**: global function  

* * *

