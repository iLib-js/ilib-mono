<a name="inRange"></a>

## inRange(num, rangeName, obj) ⇒ <code>boolean</code>
Actual implementation for withinRange. Searches the given object for ranges.
The range names are taken from the Unicode range names in
http://www.unicode.org/Public/UNIDATA/extracted/DerivedGeneralCategory.txt

<ul>
<li>Cn - Unassigned
<li>Lu - Uppercase_Letter
<li>Ll - Lowercase_Letter
<li>Lt - Titlecase_Letter
<li>Lm - Modifier_Letter
<li>Lo - Other_Letter
<li>Mn - Nonspacing_Mark
<li>Me - Enclosing_Mark
<li>Mc - Spacing_Mark
<li>Nd - Decimal_Number
<li>Nl - Letter_Number
<li>No - Other_Number
<li>Zs - Space_Separator
<li>Zl - Line_Separator
<li>Zp - Paragraph_Separator
<li>Cc - Control
<li>Cf - Format
<li>Co - Private_Use
<li>Cs - Surrogate
<li>Pd - Dash_Punctuation
<li>Ps - Open_Punctuation
<li>Pe - Close_Punctuation
<li>Pc - Connector_Punctuation
<li>Po - Other_Punctuation
<li>Sm - Math_Symbol
<li>Sc - Currency_Symbol
<li>Sk - Modifier_Symbol
<li>So - Other_Symbol
<li>Pi - Initial_Punctuation
<li>Pf - Final_Punctuation
</ul>

**Kind**: global function  
**Returns**: <code>boolean</code> - true if the first character is within the named
range  
**Access**: protected  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>number</code> | code point of the character to examine |
| rangeName | <code>string</code> | the name of the range to check |
| obj | <code>Object</code> | object containing the character range data |


* * *

