## Classes

<dl>
<dt><a href="#FakeLoader">FakeLoader</a> ⇐ <code><a href="#Loader">Loader</a></code></dt>
<dd><p>Class that pretends to be a loader, but really isn&#39;t.</p>
</dd>
<dt><a href="#Loader">Loader</a></dt>
<dd><p>Superclass of the loader classes that contains shared functionality.</p>
<p>Loaders are the layer of code that knows how to load files from where-ever
they are stored based on the platform and environment. They do not know
anything about the file contents other than that they are in plain text
and they are encoded in UTF-8.<p></p>
<p>All loaders must support asynchronous operation. That is, they take
a file name or a list of file names and return a promise to load
them. Some loader may optionally also support synchronous operation
as well if the locale files are located locally and the platform supports
it.<p></p>
</dd>
<dt><a href="#NodeLoader">NodeLoader</a> ⇐ <code><a href="#Loader">Loader</a></code></dt>
<dd><p>Class that loads files under nodejs.</p>
<p>All loaders must support asynchronous operation. That is, they take
a file name or a list of file names and return a promise to load
them. Some loader may optionally also support synchronous operation
as well if the locale files are located locally.</p>
</dd>
<dt><a href="#WebpackLoader">WebpackLoader</a> ⇐ <code><a href="#Loader">Loader</a></code></dt>
<dd><p>Class that loads files under Webpack.</p>
<p>All loaders must support asynchronous operation. That is, they take
a file name or a list of file names and return a promise to load
them. Some loader may optionally also support synchronous operation
as well if the locale files are located locally.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#registerLoader">registerLoader(loaderClass)</a></dt>
<dd><p>Register a loader with the loader factory. The loader must return
which platforms it is a loader for.</p>
</dd>
<dt><a href="#LoaderFactory">LoaderFactory()</a> ⇒ <code><a href="#Loader">Loader</a></code></dt>
<dd><p>Factory method that returns a loader instance that is appropriate
for the current platform. The current platform is determined using
the ilib-env package.</p>
</dd>
</dl>

<a name="FakeLoader"></a>

## FakeLoader ⇐ [<code>Loader</code>](#Loader)
Class that pretends to be a loader, but really isn't.

**Kind**: global class  
**Extends**: [<code>Loader</code>](#Loader)  

* [FakeLoader](#FakeLoader) ⇐ [<code>Loader</code>](#Loader)
    * [new FakeLoader(options)](#new_FakeLoader_new)
    * [.getPlatforms()](#FakeLoader+getPlatforms) ⇒ <code>Array.&lt;string&gt;</code>
    * [.getName()](#FakeLoader+getName) ⇒ <code>string</code>
    * [.supportsSync()](#FakeLoader+supportsSync) ⇒ <code>boolean</code>
    * [.loadFile(pathName, options)](#FakeLoader+loadFile) ⇒ <code>Promise</code> \| <code>string</code> \| <code>undefined</code>
    * [.setSyncMode()](#Loader+setSyncMode)
    * [.setAsyncMode()](#Loader+setAsyncMode)
    * [.addPaths(paths)](#Loader+addPaths)
    * [.loadFiles(paths, options)](#Loader+loadFiles) ⇒ <code>Promise</code> \| <code>Array.&lt;string&gt;</code> \| <code>undefined</code>


* * *

<a name="new_FakeLoader_new"></a>

### new FakeLoader(options)
Create a loader instance.


| Param | Type |
| --- | --- |
| options | <code>Object</code> | 


* * *

<a name="FakeLoader+getPlatforms"></a>

### fakeLoader.getPlatforms() ⇒ <code>Array.&lt;string&gt;</code>
Return an array of platform names for the platforms that this
loader supports.

**Kind**: instance method of [<code>FakeLoader</code>](#FakeLoader)  
**Overrides**: [<code>getPlatforms</code>](#Loader+getPlatforms)  
**Returns**: <code>Array.&lt;string&gt;</code> - the names of the platform.  

* * *

<a name="FakeLoader+getName"></a>

### fakeLoader.getName() ⇒ <code>string</code>
Return a string identifying this type of loader.

**Kind**: instance method of [<code>FakeLoader</code>](#FakeLoader)  
**Overrides**: [<code>getName</code>](#Loader+getName)  
**Returns**: <code>string</code> - the name of this type of loader  

* * *

<a name="FakeLoader+supportsSync"></a>

### fakeLoader.supportsSync() ⇒ <code>boolean</code>
Return true if this loader supports synchronous operation.
Loaders for particular platforms should override this
method if they support synchronous and return true.

**Kind**: instance method of [<code>FakeLoader</code>](#FakeLoader)  
**Overrides**: [<code>supportsSync</code>](#Loader+supportsSync)  
**Returns**: <code>boolean</code> - true if this loader supports synchronous
operation, or false otherwise.  

* * *

<a name="FakeLoader+loadFile"></a>

### fakeLoader.loadFile(pathName, options) ⇒ <code>Promise</code> \| <code>string</code> \| <code>undefined</code>
Load an individual file specified by the path name, and return its
content. If the file does not exist or could not be loaded, this method
will return undefined.<p>

The options object may contain any of these properties:
<ul>
<li>sync {boolean} - when true, load the file synchronously, else load
it asynchronously. Loaders that do not support synchronous loading will
ignore this option.
</ul>

For files that end with a ".js" or ".mjs" extension, this method should
treat the file as a Javascript module and load it accordingly. All other
file types will be loaded as UTF-8 text.

**Kind**: instance method of [<code>FakeLoader</code>](#FakeLoader)  
**Overrides**: [<code>loadFile</code>](#Loader+loadFile)  
**Returns**: <code>Promise</code> \| <code>string</code> \| <code>undefined</code> - A promise to load the file contents
in async mode or a string which is the contents of the file in sync mode.
If this method returns undefined or the promise resolves to the value
undefined, this indicates that the file did not exist or could not be
loaded.  

| Param | Type | Description |
| --- | --- | --- |
| pathName | <code>string</code> | a file name to load |
| options | <code>Object</code> | options guiding the load, as per above |


* * *

<a name="Loader+setSyncMode"></a>

### fakeLoader.setSyncMode()
Set synchronous mode for loaders that support it. In synchronous
mode, loading a file will be done synchronously if the "sync"
option is not explicitly given to loadFile or loadFiles. For
loaders that do not support synchronous loading, this method has
no effect. Files will continue to be loaded asynchronously.

**Kind**: instance method of [<code>FakeLoader</code>](#FakeLoader)  
**Overrides**: [<code>setSyncMode</code>](#Loader+setSyncMode)  

* * *

<a name="Loader+setAsyncMode"></a>

### fakeLoader.setAsyncMode()
Set asynchronous mode. In asynchronous
mode, loading a file will be done asynchronously if the "sync"
option is not explicitly given to loadFile or loadFiles. This
is the default behaviour, and loaders will behave this way when
they are first created.

**Kind**: instance method of [<code>FakeLoader</code>](#FakeLoader)  
**Overrides**: [<code>setAsyncMode</code>](#Loader+setAsyncMode)  

* * *

<a name="Loader+addPaths"></a>

### fakeLoader.addPaths(paths)
Add an array of paths to search for files.

**Kind**: instance method of [<code>FakeLoader</code>](#FakeLoader)  
**Overrides**: [<code>addPaths</code>](#Loader+addPaths)  

| Param | Type | Description |
| --- | --- | --- |
| paths | <code>Array.&lt;string&gt;</code> | to search |


* * *

<a name="Loader+loadFiles"></a>

### fakeLoader.loadFiles(paths, options) ⇒ <code>Promise</code> \| <code>Array.&lt;string&gt;</code> \| <code>undefined</code>
Load a number of files specified by an array of file names, and return an
array of content. The array of content is in the same order as the file
names such that the n'th element of the return array is the content
of the file with the n'th file name in the paths parameter. If any
particular file does not exist or could not be loaded, that entry in the
return array will be undefined.<p>

The options object may contain any of these properties:
<ul>
<li>sync {boolean} - when true, load the files synchronously, else load
them asynchronously. Loaders that do not support synchronous loading will
ignore this option.
</ul>

The loadFiles method depends on the subclass to implement the abstract
method loadFile to load individual files.

**Kind**: instance method of [<code>FakeLoader</code>](#FakeLoader)  
**Overrides**: [<code>loadFiles</code>](#Loader+loadFiles)  
**Returns**: <code>Promise</code> \| <code>Array.&lt;string&gt;</code> \| <code>undefined</code> - A promise to load the
array of files or an array where each element is either
a string which is the contents of a file. If any element of the returned
array or the array that that the promise resolves to is undefined, this
indicates that that particular file did not exist or could not be loaded.  

| Param | Type | Description |
| --- | --- | --- |
| paths | <code>Array.&lt;string&gt;</code> | an array of file names to load |
| options | <code>Object</code> | options guiding the load, as per above |


* * *

<a name="Loader"></a>

## Loader
Superclass of the loader classes that contains shared functionality.

Loaders are the layer of code that knows how to load files from where-ever
they are stored based on the platform and environment. They do not know
anything about the file contents other than that they are in plain text
and they are encoded in UTF-8.<p>

All loaders must support asynchronous operation. That is, they take
a file name or a list of file names and return a promise to load
them. Some loader may optionally also support synchronous operation
as well if the locale files are located locally and the platform supports
it.<p>

**Kind**: global class  

* [Loader](#Loader)
    * [new Loader(options)](#new_Loader_new)
    * *[.getPlatforms()](#Loader+getPlatforms) ⇒ <code>Array.&lt;string&gt;</code>*
    * *[.getName()](#Loader+getName) ⇒ <code>string</code>*
    * *[.supportsSync()](#Loader+supportsSync) ⇒ <code>boolean</code>*
    * [.setSyncMode()](#Loader+setSyncMode)
    * [.setAsyncMode()](#Loader+setAsyncMode)
    * [.addPaths(paths)](#Loader+addPaths)
    * *[.loadFile(pathName, options)](#Loader+loadFile) ⇒ <code>Promise</code> \| <code>string</code> \| <code>undefined</code>*
    * [.loadFiles(paths, options)](#Loader+loadFiles) ⇒ <code>Promise</code> \| <code>Array.&lt;string&gt;</code> \| <code>undefined</code>


* * *

<a name="new_Loader_new"></a>

### new Loader(options)
Create a loader instance.


| Param | Type |
| --- | --- |
| options | <code>Object</code> | 


* * *

<a name="Loader+getPlatforms"></a>

### *loader.getPlatforms() ⇒ <code>Array.&lt;string&gt;</code>*
Return an array of platform names for the platforms that this
loader supports.

**Kind**: instance abstract method of [<code>Loader</code>](#Loader)  
**Returns**: <code>Array.&lt;string&gt;</code> - the names of the platform.  

* * *

<a name="Loader+getName"></a>

### *loader.getName() ⇒ <code>string</code>*
Return a string identifying this type of loader.

**Kind**: instance abstract method of [<code>Loader</code>](#Loader)  
**Returns**: <code>string</code> - the name of this type of loader  

* * *

<a name="Loader+supportsSync"></a>

### *loader.supportsSync() ⇒ <code>boolean</code>*
Return true if this loader supports synchronous operation.
Loaders for particular platforms should override this
method if they support synchronous and return true.

**Kind**: instance abstract method of [<code>Loader</code>](#Loader)  
**Returns**: <code>boolean</code> - true if this loader supports synchronous
operation, or false otherwise.  

* * *

<a name="Loader+setSyncMode"></a>

### loader.setSyncMode()
Set synchronous mode for loaders that support it. In synchronous
mode, loading a file will be done synchronously if the "sync"
option is not explicitly given to loadFile or loadFiles. For
loaders that do not support synchronous loading, this method has
no effect. Files will continue to be loaded asynchronously.

**Kind**: instance method of [<code>Loader</code>](#Loader)  

* * *

<a name="Loader+setAsyncMode"></a>

### loader.setAsyncMode()
Set asynchronous mode. In asynchronous
mode, loading a file will be done asynchronously if the "sync"
option is not explicitly given to loadFile or loadFiles. This
is the default behaviour, and loaders will behave this way when
they are first created.

**Kind**: instance method of [<code>Loader</code>](#Loader)  

* * *

<a name="Loader+addPaths"></a>

### loader.addPaths(paths)
Add an array of paths to search for files.

**Kind**: instance method of [<code>Loader</code>](#Loader)  

| Param | Type | Description |
| --- | --- | --- |
| paths | <code>Array.&lt;string&gt;</code> | to search |


* * *

<a name="Loader+loadFile"></a>

### *loader.loadFile(pathName, options) ⇒ <code>Promise</code> \| <code>string</code> \| <code>undefined</code>*
Load an individual file specified by the path name, and return its
content. If the file does not exist or could not be loaded, this method
will return undefined.<p>

The options object may contain any of these properties:
<ul>
<li>sync {boolean} - when true, load the file synchronously, else load
it asynchronously. Loaders that do not support synchronous loading will
ignore this option.
</ul>

For files that end with a ".js" or ".mjs" extension, this method should
treat the file as a Javascript module and load it accordingly. All other
file types will be loaded as UTF-8 text.<p>

For Javascript modules, the module is returned from this method. This
may either be a function exported from the module, or an object containing
a "default" property which is a function exported from the module. This
exported function should be called with no arguments and should return
the locale data for the locale.

**Kind**: instance abstract method of [<code>Loader</code>](#Loader)  
**Returns**: <code>Promise</code> \| <code>string</code> \| <code>undefined</code> - A promise to load the file contents
in async mode or a string which is the contents of the file in sync mode.
If this method returns undefined or the promise resolves to the value
undefined, this indicates that the file did not exist or could not be
loaded.  

| Param | Type | Description |
| --- | --- | --- |
| pathName | <code>string</code> | a file name to load |
| options | <code>Object</code> | options guiding the load, as per above |


* * *

<a name="Loader+loadFiles"></a>

### loader.loadFiles(paths, options) ⇒ <code>Promise</code> \| <code>Array.&lt;string&gt;</code> \| <code>undefined</code>
Load a number of files specified by an array of file names, and return an
array of content. The array of content is in the same order as the file
names such that the n'th element of the return array is the content
of the file with the n'th file name in the paths parameter. If any
particular file does not exist or could not be loaded, that entry in the
return array will be undefined.<p>

The options object may contain any of these properties:
<ul>
<li>sync {boolean} - when true, load the files synchronously, else load
them asynchronously. Loaders that do not support synchronous loading will
ignore this option.
</ul>

The loadFiles method depends on the subclass to implement the abstract
method loadFile to load individual files.

**Kind**: instance method of [<code>Loader</code>](#Loader)  
**Returns**: <code>Promise</code> \| <code>Array.&lt;string&gt;</code> \| <code>undefined</code> - A promise to load the
array of files or an array where each element is either
a string which is the contents of a file. If any element of the returned
array or the array that that the promise resolves to is undefined, this
indicates that that particular file did not exist or could not be loaded.  

| Param | Type | Description |
| --- | --- | --- |
| paths | <code>Array.&lt;string&gt;</code> | an array of file names to load |
| options | <code>Object</code> | options guiding the load, as per above |


* * *

<a name="NodeLoader"></a>

## NodeLoader ⇐ [<code>Loader</code>](#Loader)
Class that loads files under nodejs.

All loaders must support asynchronous operation. That is, they take
a file name or a list of file names and return a promise to load
them. Some loader may optionally also support synchronous operation
as well if the locale files are located locally.

**Kind**: global class  
**Extends**: [<code>Loader</code>](#Loader)  

* [NodeLoader](#NodeLoader) ⇐ [<code>Loader</code>](#Loader)
    * [new NodeLoader(options)](#new_NodeLoader_new)
    * [.getPlatforms()](#NodeLoader+getPlatforms) ⇒ <code>Array.&lt;string&gt;</code>
    * [.getName()](#NodeLoader+getName) ⇒ <code>string</code>
    * [.supportsSync()](#NodeLoader+supportsSync) ⇒ <code>boolean</code>
    * [.loadFile(pathName, options)](#NodeLoader+loadFile) ⇒ <code>Promise</code> \| <code>string</code> \| <code>undefined</code>
    * [.setSyncMode()](#Loader+setSyncMode)
    * [.setAsyncMode()](#Loader+setAsyncMode)
    * [.addPaths(paths)](#Loader+addPaths)
    * [.loadFiles(paths, options)](#Loader+loadFiles) ⇒ <code>Promise</code> \| <code>Array.&lt;string&gt;</code> \| <code>undefined</code>


* * *

<a name="new_NodeLoader_new"></a>

### new NodeLoader(options)
Create a loader instance.


| Param | Type |
| --- | --- |
| options | <code>Object</code> | 


* * *

<a name="NodeLoader+getPlatforms"></a>

### nodeLoader.getPlatforms() ⇒ <code>Array.&lt;string&gt;</code>
Return an array of platform names for the platforms that this
loader supports.

**Kind**: instance method of [<code>NodeLoader</code>](#NodeLoader)  
**Overrides**: [<code>getPlatforms</code>](#Loader+getPlatforms)  
**Returns**: <code>Array.&lt;string&gt;</code> - the names of the platform.  

* * *

<a name="NodeLoader+getName"></a>

### nodeLoader.getName() ⇒ <code>string</code>
Return a string identifying this type of loader.

**Kind**: instance method of [<code>NodeLoader</code>](#NodeLoader)  
**Overrides**: [<code>getName</code>](#Loader+getName)  
**Returns**: <code>string</code> - the name of this type of loader  

* * *

<a name="NodeLoader+supportsSync"></a>

### nodeLoader.supportsSync() ⇒ <code>boolean</code>
Return true if this loader supports synchronous operation.
Loaders for particular platforms should override this
method if they support synchronous and return true.

**Kind**: instance method of [<code>NodeLoader</code>](#NodeLoader)  
**Overrides**: [<code>supportsSync</code>](#Loader+supportsSync)  
**Returns**: <code>boolean</code> - true if this loader supports synchronous
operation, or false otherwise.  

* * *

<a name="NodeLoader+loadFile"></a>

### nodeLoader.loadFile(pathName, options) ⇒ <code>Promise</code> \| <code>string</code> \| <code>undefined</code>
Load an individual file specified by the path name, and return its
content. If the file does not exist or could not be loaded, this method
will return undefined.<p>

The options object may contain any of these properties:
<ul>
<li>sync {boolean} - when true, load the file synchronously, else load
it asynchronously. Loaders that do not support synchronous loading will
ignore this option.
</ul>

For files that end with a ".js" or ".mjs" extension, this method should
treat the file as a Javascript module and load it accordingly. All other
file types will be loaded as UTF-8 text.

**Kind**: instance method of [<code>NodeLoader</code>](#NodeLoader)  
**Overrides**: [<code>loadFile</code>](#Loader+loadFile)  
**Returns**: <code>Promise</code> \| <code>string</code> \| <code>undefined</code> - A promise to load the file contents
in async mode or a string which is the contents of the file in sync mode.
If this method returns undefined or the promise resolves to the value
undefined, this indicates that the file did not exist or could not be
loaded.  

| Param | Type | Description |
| --- | --- | --- |
| pathName | <code>string</code> | a file name to load |
| options | <code>Object</code> | options guiding the load, as per above |


* * *

<a name="Loader+setSyncMode"></a>

### nodeLoader.setSyncMode()
Set synchronous mode for loaders that support it. In synchronous
mode, loading a file will be done synchronously if the "sync"
option is not explicitly given to loadFile or loadFiles. For
loaders that do not support synchronous loading, this method has
no effect. Files will continue to be loaded asynchronously.

**Kind**: instance method of [<code>NodeLoader</code>](#NodeLoader)  
**Overrides**: [<code>setSyncMode</code>](#Loader+setSyncMode)  

* * *

<a name="Loader+setAsyncMode"></a>

### nodeLoader.setAsyncMode()
Set asynchronous mode. In asynchronous
mode, loading a file will be done asynchronously if the "sync"
option is not explicitly given to loadFile or loadFiles. This
is the default behaviour, and loaders will behave this way when
they are first created.

**Kind**: instance method of [<code>NodeLoader</code>](#NodeLoader)  
**Overrides**: [<code>setAsyncMode</code>](#Loader+setAsyncMode)  

* * *

<a name="Loader+addPaths"></a>

### nodeLoader.addPaths(paths)
Add an array of paths to search for files.

**Kind**: instance method of [<code>NodeLoader</code>](#NodeLoader)  
**Overrides**: [<code>addPaths</code>](#Loader+addPaths)  

| Param | Type | Description |
| --- | --- | --- |
| paths | <code>Array.&lt;string&gt;</code> | to search |


* * *

<a name="Loader+loadFiles"></a>

### nodeLoader.loadFiles(paths, options) ⇒ <code>Promise</code> \| <code>Array.&lt;string&gt;</code> \| <code>undefined</code>
Load a number of files specified by an array of file names, and return an
array of content. The array of content is in the same order as the file
names such that the n'th element of the return array is the content
of the file with the n'th file name in the paths parameter. If any
particular file does not exist or could not be loaded, that entry in the
return array will be undefined.<p>

The options object may contain any of these properties:
<ul>
<li>sync {boolean} - when true, load the files synchronously, else load
them asynchronously. Loaders that do not support synchronous loading will
ignore this option.
</ul>

The loadFiles method depends on the subclass to implement the abstract
method loadFile to load individual files.

**Kind**: instance method of [<code>NodeLoader</code>](#NodeLoader)  
**Overrides**: [<code>loadFiles</code>](#Loader+loadFiles)  
**Returns**: <code>Promise</code> \| <code>Array.&lt;string&gt;</code> \| <code>undefined</code> - A promise to load the
array of files or an array where each element is either
a string which is the contents of a file. If any element of the returned
array or the array that that the promise resolves to is undefined, this
indicates that that particular file did not exist or could not be loaded.  

| Param | Type | Description |
| --- | --- | --- |
| paths | <code>Array.&lt;string&gt;</code> | an array of file names to load |
| options | <code>Object</code> | options guiding the load, as per above |


* * *

<a name="WebpackLoader"></a>

## WebpackLoader ⇐ [<code>Loader</code>](#Loader)
Class that loads files under Webpack.

All loaders must support asynchronous operation. That is, they take
a file name or a list of file names and return a promise to load
them. Some loader may optionally also support synchronous operation
as well if the locale files are located locally.

**Kind**: global class  
**Extends**: [<code>Loader</code>](#Loader)  

* [WebpackLoader](#WebpackLoader) ⇐ [<code>Loader</code>](#Loader)
    * [new WebpackLoader(options)](#new_WebpackLoader_new)
    * [.getPlatforms()](#WebpackLoader+getPlatforms) ⇒ <code>Array.&lt;string&gt;</code>
    * [.getName()](#WebpackLoader+getName) ⇒ <code>string</code>
    * [.loadFile(pathName, options)](#WebpackLoader+loadFile) ⇒ <code>Promise</code> \| <code>undefined</code>
    * *[.supportsSync()](#Loader+supportsSync) ⇒ <code>boolean</code>*
    * [.setSyncMode()](#Loader+setSyncMode)
    * [.setAsyncMode()](#Loader+setAsyncMode)
    * [.addPaths(paths)](#Loader+addPaths)
    * [.loadFiles(paths, options)](#Loader+loadFiles) ⇒ <code>Promise</code> \| <code>Array.&lt;string&gt;</code> \| <code>undefined</code>


* * *

<a name="new_WebpackLoader_new"></a>

### new WebpackLoader(options)
Create a loader instance.


| Param | Type |
| --- | --- |
| options | <code>Object</code> | 


* * *

<a name="WebpackLoader+getPlatforms"></a>

### webpackLoader.getPlatforms() ⇒ <code>Array.&lt;string&gt;</code>
Return an array of platform names for the platforms that this
loader supports.

**Kind**: instance method of [<code>WebpackLoader</code>](#WebpackLoader)  
**Overrides**: [<code>getPlatforms</code>](#Loader+getPlatforms)  
**Returns**: <code>Array.&lt;string&gt;</code> - the names of the platform.  

* * *

<a name="WebpackLoader+getName"></a>

### webpackLoader.getName() ⇒ <code>string</code>
Return a string identifying this type of loader.

**Kind**: instance method of [<code>WebpackLoader</code>](#WebpackLoader)  
**Overrides**: [<code>getName</code>](#Loader+getName)  
**Returns**: <code>string</code> - the name of this type of loader  

* * *

<a name="WebpackLoader+loadFile"></a>

### webpackLoader.loadFile(pathName, options) ⇒ <code>Promise</code> \| <code>undefined</code>
Load an individual file specified by the path name, and return its
content. If the file does not exist or could not be loaded, this method
will return undefined.<p>

There are no options that this loader uses, so the options parameter is
ignored.<p>

The file loaded must be a javascript file named for the full BCP-47 locale
spec (eg. "zh-Hans-CN.js") or "root.js" for the generic shared data. The
files should be constructed before webpack is
called. In order to include the data file automatically in webpack, you must
create a resolver alias called "calling-module" to point to the location where
the file was generated. Example setting in webpack.config.js

<code>
   "resolve": {
       "alias": {
           "calling-module": "my-module/locale"
       }
   }
</code>

The value may be the name of your module with an optional subpath, or the
absolute path to the directory where the files are stored. Without this alias,
no files will be included and the webpack build will fail.<p>

For files that end with a ".js" or ".mjs" extension, this method should
treat the file as a Javascript module and load it accordingly. All other
file types will be loaded as UTF-8 text.

**Kind**: instance method of [<code>WebpackLoader</code>](#WebpackLoader)  
**Overrides**: [<code>loadFile</code>](#Loader+loadFile)  
**Returns**: <code>Promise</code> \| <code>undefined</code> - A promise to load the file contents
in async mode. If this method returns undefined or the promise resolves
to the value undefined, this indicates that the file did not exist or
could not be loaded.  

| Param | Type | Description |
| --- | --- | --- |
| pathName | <code>string</code> | a file name to load |
| options | <code>Object</code> | options guiding the load, as per above |


* * *

<a name="Loader+supportsSync"></a>

### *webpackLoader.supportsSync() ⇒ <code>boolean</code>*
Return true if this loader supports synchronous operation.
Loaders for particular platforms should override this
method if they support synchronous and return true.

**Kind**: instance abstract method of [<code>WebpackLoader</code>](#WebpackLoader)  
**Overrides**: [<code>supportsSync</code>](#Loader+supportsSync)  
**Returns**: <code>boolean</code> - true if this loader supports synchronous
operation, or false otherwise.  

* * *

<a name="Loader+setSyncMode"></a>

### webpackLoader.setSyncMode()
Set synchronous mode for loaders that support it. In synchronous
mode, loading a file will be done synchronously if the "sync"
option is not explicitly given to loadFile or loadFiles. For
loaders that do not support synchronous loading, this method has
no effect. Files will continue to be loaded asynchronously.

**Kind**: instance method of [<code>WebpackLoader</code>](#WebpackLoader)  
**Overrides**: [<code>setSyncMode</code>](#Loader+setSyncMode)  

* * *

<a name="Loader+setAsyncMode"></a>

### webpackLoader.setAsyncMode()
Set asynchronous mode. In asynchronous
mode, loading a file will be done asynchronously if the "sync"
option is not explicitly given to loadFile or loadFiles. This
is the default behaviour, and loaders will behave this way when
they are first created.

**Kind**: instance method of [<code>WebpackLoader</code>](#WebpackLoader)  
**Overrides**: [<code>setAsyncMode</code>](#Loader+setAsyncMode)  

* * *

<a name="Loader+addPaths"></a>

### webpackLoader.addPaths(paths)
Add an array of paths to search for files.

**Kind**: instance method of [<code>WebpackLoader</code>](#WebpackLoader)  
**Overrides**: [<code>addPaths</code>](#Loader+addPaths)  

| Param | Type | Description |
| --- | --- | --- |
| paths | <code>Array.&lt;string&gt;</code> | to search |


* * *

<a name="Loader+loadFiles"></a>

### webpackLoader.loadFiles(paths, options) ⇒ <code>Promise</code> \| <code>Array.&lt;string&gt;</code> \| <code>undefined</code>
Load a number of files specified by an array of file names, and return an
array of content. The array of content is in the same order as the file
names such that the n'th element of the return array is the content
of the file with the n'th file name in the paths parameter. If any
particular file does not exist or could not be loaded, that entry in the
return array will be undefined.<p>

The options object may contain any of these properties:
<ul>
<li>sync {boolean} - when true, load the files synchronously, else load
them asynchronously. Loaders that do not support synchronous loading will
ignore this option.
</ul>

The loadFiles method depends on the subclass to implement the abstract
method loadFile to load individual files.

**Kind**: instance method of [<code>WebpackLoader</code>](#WebpackLoader)  
**Overrides**: [<code>loadFiles</code>](#Loader+loadFiles)  
**Returns**: <code>Promise</code> \| <code>Array.&lt;string&gt;</code> \| <code>undefined</code> - A promise to load the
array of files or an array where each element is either
a string which is the contents of a file. If any element of the returned
array or the array that that the promise resolves to is undefined, this
indicates that that particular file did not exist or could not be loaded.  

| Param | Type | Description |
| --- | --- | --- |
| paths | <code>Array.&lt;string&gt;</code> | an array of file names to load |
| options | <code>Object</code> | options guiding the load, as per above |


* * *

<a name="registerLoader"></a>

## registerLoader(loaderClass)
Register a loader with the loader factory. The loader must return
which platforms it is a loader for.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| loaderClass | <code>Class</code> | a loader class from which to make an instance |


* * *

<a name="LoaderFactory"></a>

## LoaderFactory() ⇒ [<code>Loader</code>](#Loader)
Factory method that returns a loader instance that is appropriate
for the current platform. The current platform is determined using
the ilib-env package.

**Kind**: global function  
**Returns**: [<code>Loader</code>](#Loader) - a loader instance for this platform  

* * *

