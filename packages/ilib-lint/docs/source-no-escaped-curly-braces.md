# source-no-escaped-curly-braces

Ensure that source strings do not contain replacement parameters with
curly braces that are escaped with single single-quotes. Single-quoted replacement
parameters are escaped in the ICU messageformat syntax, which is often not what is
intended. Single quotes in the source string should use Unicode single quotes
(U+2018 and U+2019) or if you specifically need straight ASCII quotes, they should
be tripled to escape them.

Examples:

Bad source string: The name is '{name}'.<br>
Preferred source string: The name is ‘{name}’.  (Unicode single quotes)<br>
Preferred source string: The name is “{name}”.  (Unicode double quotes)<br>
Acceptable source string: The name is '''{name}'''.  (Tripled ASCII single quotes)<br>
Acceptable source string: The name is "{name}".  (ASCII double quotes)