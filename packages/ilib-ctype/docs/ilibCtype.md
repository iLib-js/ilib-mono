## Constants

<dl>
<dt><a href="#propertyAliases">propertyAliases</a></dt>
<dd><p>Map from general-category aliases (lower-cased) to the short property
codes used as keys inside the ctype_* data tables.</p>
<p>Callers may pass either the short code (&quot;Mn&quot;) or the long Unicode name
(&quot;Nonspacing_Mark&quot;); both resolve to the same internal lookup.</p>
</dd>
<dt><a href="#categoryTables">categoryTables</a></dt>
<dd><p>General-category data tables keyed by the first letter of the short
property code (L, M, N, Z, C, P, S). Kept private so the on-disk /
in-memory format can change without breaking callers.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#resolvePropertyCode">resolvePropertyCode(propertyType)</a> ⇒ <code>string</code> | <code>undefined</code></dt>
<dd><p>Resolve a user-supplied property name to the short general-category
code used as a key in the ctype_* tables.</p>
</dd>
</dl>

<a name="propertyAliases"></a>

## propertyAliases
Map from general-category aliases (lower-cased) to the short property
codes used as keys inside the ctype_* data tables.

Callers may pass either the short code ("Mn") or the long Unicode name
("Nonspacing_Mark"); both resolve to the same internal lookup.

**Kind**: global constant  

* * *

<a name="categoryTables"></a>

## categoryTables
General-category data tables keyed by the first letter of the short
property code (L, M, N, Z, C, P, S). Kept private so the on-disk /
in-memory format can change without breaking callers.

**Kind**: global constant  

* * *

<a name="resolvePropertyCode"></a>

## resolvePropertyCode(propertyType) ⇒ <code>string</code> \| <code>undefined</code>
Resolve a user-supplied property name to the short general-category
code used as a key in the ctype_* tables.

**Kind**: global function  
**Returns**: <code>string</code> \| <code>undefined</code> - short code such as "Mn", or undefined if unknown  

| Param | Type | Description |
| --- | --- | --- |
| propertyType | <code>string</code> | short code or long Unicode name |


* * *

