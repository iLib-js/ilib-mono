# resource-icu-plurals

If you received this error, then there is a syntax error in your plural string in
the source String or in the translation string. Strings are expected to follow the
ICU format plurals. More info can be found [here](https://formatjs.io/docs/core-concepts/icu-syntax/#plural-format).

There may be multiple types of errors:

- The source contains a plural, but the translation does not. Obviously, you need
  to ask the translator to put in the correct plural.
- The translation contains a plural, but it is not in the right syntax. Make sure
  it follows the syntax as per above.
- The translation contains a plural and it is in the right syntax, but it has the
  wrong categories. Each locale uses a different set of categories of plurals. For
  example, Russian uses "one", "few", and "other", whereas Japanese only uses
  "other". The translator should know which categories their language uses and add
  the appropriate categories to the plural or subtract the ones that are not
  needed.
- The translation contains a plural in the right syntax, but it uses plural categories
  that the target locale does not need. In this case, simply remove the unneeded
  plural category translation.
