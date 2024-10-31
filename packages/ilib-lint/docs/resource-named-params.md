# resource-named-params

Ensure that named parameters that appear in the source string are also used in the
translated string. Named parameters have the syntax {name}. That is, they are a
simple name surrounded by curly braces. The same parameter must also exist in the
target string with the same name. Sometimes translators accidentally translate
the name of the parameter. Also, if the target string contains a parameter that
the source string does not, you will also get this error.