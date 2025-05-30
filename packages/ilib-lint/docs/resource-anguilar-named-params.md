# resource-angular-named-params

Ensure that named Angular or Vue parameters that appear in the source string are
also used in the translated string. Named parameters have the syntax {{name}}.
That is, they are an expression surrounded by double curly braces. The same
parameter must also exist in the target string containing the same expression.
Sometimes translators accidentally translate
the text inside of the parameter or they forget to include the parameter in
the target string, and this rule helps to catch those cases.