# resource-url-match

Ensure that URLs that appear in the source string are also used in the translated string.
This rule checks the source string for anything that matches an URL. If found, the same
URL must appear in the translation of the string as well. In some cases, you may want a
different URL in the translation. In that case, this rule should be turned off for that
string.