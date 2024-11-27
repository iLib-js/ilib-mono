## Functions

<dl>
<dt><a href="#scanString">scanString(pathName, set)</a></dt>
<dd><p>Scan a string for references to ilib modules. The references are in
the form of ES6 import statements or older commonjs require calls:</p>
<ul>
<li>import something from 'ilib-something';
<li>import('ilib-module).then(do something with it)
<li>var something = require("ilib-something");
</ul></dd>
<dt><a href="#scan">scan(pathName, set)</a></dt>
<dd><p>Scan a file for references to ilib modules. The references are in
the form of ES6 import statements or older commonjs require calls:</p>
<ul>
<li>import something from 'ilib-something';
<li>import('ilib-module).then(do something with it)
<li>var something = require("ilib-something");
</ul></dd>
<dt><a href="#scanModule">scanModule(moduleName, options)</a> ⇒ <code>Promise</code></dt>
<dd><p>Scan an ilib module for locale data. This operates by loading
the module asynchronously, and then asking it if there is any
locale data. Specifically, it loads the js file called
&quot;<module>/assemble.mjs&quot; which should come with every ilib
package that publishes locale data. The idea is that each
module should be an expert in how its own locale data should
be published. This allows ilib modules to be updated and
to add new modules without needing to update ilib-assemble.</p>
<p>If the assemble.mjs does not exist in the package
or could otherwise not be loaded, then that module is skipped.
For example, modules such as <code>ilib-env</code> which do not contain any
locale data, and therefore do not need an assemble.mjs file in
them and will be quietly skipped.<p></p>
<p>The assemble.mjs module should be a node module that
exports a default assemble function with the signature:</p>
<code>
function assemble(options: Object): Promise
</code>

<p>That is, it takes an options object that can contain various
configuration options. The main options is the &quot;locales&quot; parameter
which is an array of locales to process.
It is expected that the assemble function will also include
all the merged data for sublocales. That is, if the array of
locales to process include the locale &quot;de-DE&quot;, then all the data
for &quot;de&quot;, &quot;und-DE&quot;, and &quot;de-DE&quot; will be assembled together in
one merged piece fo data. See the function <code>getSublocales</code> in the
the ilib module <code>ilib-common</code> for details on how the sublocales
work.<p></p>
<p>Loading js modules dynamically can only be accomplished using
asynchronous loading. Therefore, this function is
also asynchronous and returns a promise to load the data. The
assemble function in each module should also be asynchronous
and return its own promise that is added to the current one.<p></p>
<p>Locale data should be returned from the promise in a localeData
object in the following simple format:</p>
<code>
{
  "locale": {
    "basename": {
      locale data here
    }
  }
}
</code>

<p>That is, the top level properties are the locales from the
options.locales array. Inside of each locale object is a
basename for the data type. Inside of there is the actual
locale data. If a property at any level does not exist yet,
the assemble function should add and populate it. See the
documentation for the <code>ilib-localedata</code> package for more details
on how this data is structured and loaded.<p></p>
</dd>
<dt><a href="#scanResources">scanResources(dir, options)</a> ⇒ <code>Promise</code></dt>
<dd><p>Scan a resource dir for translated resource files.</p>
</dd>
<dt><a href="#walk">walk(dirOrFile, options)</a> ⇒ <code>Array.&lt;string&gt;</code></dt>
<dd><p>Walk a directory tree and return an array of the relative paths to
all javascript files found in that tree.</p>
<p>Options can contain any of the following properties:</p>
<ul>
<li>quiet (boolean) - if true, do not emit any output. Just report results.
<li>extensions (Set) - a set of extensions to scan for. If not specified,
this function will search for all Javascript files.
</ul></dd>
</dl>

<a name="scanString"></a>

## scanString(pathName, set)
Scan a string for references to ilib modules. The references are in
the form of ES6 import statements or older commonjs require calls:

<ul>
<li>import something from 'ilib-something';
<li>import('ilib-module).then(do something with it)
<li>var something = require("ilib-something");
</ul>

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| pathName | <code>string</code> | the path to the file to scan |
| set | <code>Set</code> | the set to which to add the name of each ilib module |


* * *

<a name="scan"></a>

## scan(pathName, set)
Scan a file for references to ilib modules. The references are in
the form of ES6 import statements or older commonjs require calls:

<ul>
<li>import something from 'ilib-something';
<li>import('ilib-module).then(do something with it)
<li>var something = require("ilib-something");
</ul>

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| pathName | <code>string</code> | the path to the file to scan |
| set | <code>Set</code> | the set to which to add the name of each ilib module |


* * *

<a name="scanModule"></a>

## scanModule(moduleName, options) ⇒ <code>Promise</code>
Scan an ilib module for locale data. This operates by loading
the module asynchronously, and then asking it if there is any
locale data. Specifically, it loads the js file called
"<module>/assemble.mjs" which should come with every ilib
package that publishes locale data. The idea is that each
module should be an expert in how its own locale data should
be published. This allows ilib modules to be updated and
to add new modules without needing to update ilib-assemble.

If the assemble.mjs does not exist in the package
or could otherwise not be loaded, then that module is skipped.
For example, modules such as `ilib-env` which do not contain any
locale data, and therefore do not need an assemble.mjs file in
them and will be quietly skipped.<p>

The assemble.mjs module should be a node module that
exports a default assemble function with the signature:

<code>
function assemble(options: Object): Promise
</code>

That is, it takes an options object that can contain various
configuration options. The main options is the "locales" parameter
which is an array of locales to process.
It is expected that the assemble function will also include
all the merged data for sublocales. That is, if the array of
locales to process include the locale "de-DE", then all the data
for "de", "und-DE", and "de-DE" will be assembled together in
one merged piece fo data. See the function `getSublocales` in the
the ilib module `ilib-common` for details on how the sublocales
work.<p>

Loading js modules dynamically can only be accomplished using
asynchronous loading. Therefore, this function is
also asynchronous and returns a promise to load the data. The
assemble function in each module should also be asynchronous
and return its own promise that is added to the current one.<p>

Locale data should be returned from the promise in a localeData
object in the following simple format:

<code>
{
  "locale": {
    "basename": {
      locale data here
    }
  }
}
</code>

That is, the top level properties are the locales from the
options.locales array. Inside of each locale object is a
basename for the data type. Inside of there is the actual
locale data. If a property at any level does not exist yet,
the assemble function should add and populate it. See the
documentation for the `ilib-localedata` package for more details
on how this data is structured and loaded.<p>

**Kind**: global function  
**Returns**: <code>Promise</code> - a promise to scan and load all the locale
data, and return it in the format documented above  

| Param | Type | Description |
| --- | --- | --- |
| moduleName | <code>string</code> | the name of the ilib module to scan |
| options | <code>Object</code> | options from the command-line |


* * *

<a name="scanResources"></a>

## scanResources(dir, options) ⇒ <code>Promise</code>
Scan a resource dir for translated resource files.

**Kind**: global function  
**Returns**: <code>Promise</code> - a promise to scan and load all the resource
file data, and return it in the format documented above  

| Param | Type | Description |
| --- | --- | --- |
| dir | <code>string</code> | the root directory to scan |
| options | <code>Object</code> | options from the command-line |


* * *

<a name="walk"></a>

## walk(dirOrFile, options) ⇒ <code>Array.&lt;string&gt;</code>
Walk a directory tree and return an array of the relative paths to
all javascript files found in that tree.

Options can contain any of the following properties:
<ul>
<li>quiet (boolean) - if true, do not emit any output. Just report results.
<li>extensions (Set) - a set of extensions to scan for. If not specified,
this function will search for all Javascript files.
</ul>

**Kind**: global function  
**Returns**: <code>Array.&lt;string&gt;</code> - an array of relative paths to all the
javascript files  

| Param | Type | Description |
| --- | --- | --- |
| dirOrFile | <code>string</code> | top level of the tree to start searching or a file to consider |
| options | <code>Object</code> | options to control the operation of this function |


* * *

