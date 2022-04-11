## Functions

<dl>
<dt><a href="#top">top()</a> ⇒ <code>Object</code> | <code>undefined</code></dt>
<dd><p>Return the value of the top object in the system. This could be global
for node, or window for browsers, etc.</p>
</dd>
<dt><a href="#getPlatform">getPlatform()</a> ⇒ <code>string</code></dt>
<dd><p>Return the name of the platform. Recognized platforms are:</p>
<ul>
<li>trireme</li>
<li>rhino</li>
<li>nodejs</li>
<li>qt</li>
<li>webos-webapp</li>
<li>webos</li>
<li>browser</li>
<li>unknown</li>
</ul>
<p>If the the platform is &quot;browser&quot;, you can call the function getBrowser()
to find out which one.</p>
</dd>
<dt><a href="#getBrowser">getBrowser()</a> ⇒ <code>string</code> | <code>undefined</code></dt>
<dd><p>If this package is running in a browser, return the name of that browser.</p>
</dd>
<dt><a href="#globalVar">globalVar(name)</a> ⇒ <code>*</code></dt>
<dd><p>Return the value of a global variable given its name in a way that works
correctly for the current platform.</p>
</dd>
<dt><a href="#isGlobal">isGlobal(name)</a> ⇒ <code>boolean</code></dt>
<dd><p>Return true if the global variable is defined on this platform.</p>
</dd>
<dt><a href="#getLocale">getLocale()</a> ⇒ <code>string</code></dt>
<dd><p>Return the default locale for this platform, if there is one.
If not, it will default to the locale &quot;en-US&quot;.<p></p>
</dd>
<dt><a href="#setLocale">setLocale(locale)</a></dt>
<dd><p>Set the default locale for ilib. This overrides the locale from the
platform. To clear the locale again and cause <code>getLocale</code> to
get the locale from the platform again, call <code>setLocale</code> with no
parameters.<p></p>
</dd>
<dt><a href="#getTimeZone">getTimeZone()</a> ⇒ <code>string</code></dt>
<dd><p>Return the default time zone for this platform if there is one.
If not, it will default to the the zone &quot;local&quot;.<p></p>
</dd>
<dt><a href="#setTimeZone">setTimeZone(zoneName)</a></dt>
<dd><p>Set the default time zone for ilib. This overrides the time zone from the
platform. To clear the time zone again and cause <code>getTimeZone</code> to
get the time zone from the platform again, call <code>setTimeZone</code> with no
parameters.<p></p>
</dd>
</dl>

<a name="top"></a>

## top() ⇒ <code>Object</code> \| <code>undefined</code>
Return the value of the top object in the system. This could be global
for node, or window for browsers, etc.

**Kind**: global function  
**Returns**: <code>Object</code> \| <code>undefined</code> - the top variable, or undefined if there is none on this
platform  

* * *

<a name="getPlatform"></a>

## getPlatform() ⇒ <code>string</code>
Return the name of the platform. Recognized platforms are:
- trireme
- rhino
- nodejs
- qt
- webos-webapp
- webos
- browser
- unknown

If the the platform is "browser", you can call the function getBrowser()
to find out which one.

**Kind**: global function  
**Returns**: <code>string</code> - string naming the platform  

* * *

<a name="getBrowser"></a>

## getBrowser() ⇒ <code>string</code> \| <code>undefined</code>
If this package is running in a browser, return the name of that browser.

**Kind**: global function  
**Returns**: <code>string</code> \| <code>undefined</code> - the name of the browser that this is running in ("firefox", "chrome", "ie",
"safari", "Edge", "iOS", or "opera"), or undefined if this is not running in a browser or if
the browser name could not be determined  

* * *

<a name="globalVar"></a>

## globalVar(name) ⇒ <code>\*</code>
Return the value of a global variable given its name in a way that works
correctly for the current platform.

**Kind**: global function  
**Returns**: <code>\*</code> - the global variable, or undefined if it does not exist  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the name of the variable to return |


* * *

<a name="isGlobal"></a>

## isGlobal(name) ⇒ <code>boolean</code>
Return true if the global variable is defined on this platform.

**Kind**: global function  
**Returns**: <code>boolean</code> - true if the global variable is defined on this platform, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the name of the variable to check |


* * *

<a name="getLocale"></a>

## getLocale() ⇒ <code>string</code>
Return the default locale for this platform, if there is one.
If not, it will default to the locale "en-US".<p>

**Kind**: global function  
**Returns**: <code>string</code> - the BCP-47 locale specifier for the default locale  

* * *

<a name="setLocale"></a>

## setLocale(locale)
Set the default locale for ilib. This overrides the locale from the
platform. To clear the locale again and cause `getLocale` to
get the locale from the platform again, call `setLocale` with no
parameters.<p>

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| locale | <code>string</code> | the BCP-47 locale specifier to set as the default locale |


* * *

<a name="getTimeZone"></a>

## getTimeZone() ⇒ <code>string</code>
Return the default time zone for this platform if there is one.
If not, it will default to the the zone "local".<p>

**Kind**: global function  
**Returns**: <code>string</code> - the default time zone for the platform  

* * *

<a name="setTimeZone"></a>

## setTimeZone(zoneName)
Set the default time zone for ilib. This overrides the time zone from the
platform. To clear the time zone again and cause `getTimeZone` to
get the time zone from the platform again, call `setTimeZone` with no
parameters.<p>

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| zoneName | <code>string</code> | the IANA name of the time zone |


* * *

