# resource-no-escaped-curly-braces

Ensure that translated strings do not contain replacement parameters surrounded by
single single-quotes. Single quotes in the translated string should either use the
native Unicode quotes for the target language, or they should be tripled to escape
the quotes themselves. This is a change in recent versions of react-intl to comply
more closely with the ICU messageformat syntax that it claims to support.

Examples:

Bad: The name is '{name}'.<br>
Good: The name is « name »  (for French as an example)<br>
Good: The name is '''{name}'''.<br>
Good: The name is "{name}".
