# resource-icu-plurals-translated

ICU-style plurals and selects are notoriously difficult for translators to get right.
This is because they are professional linguists, not programmers, and are usually
not clear on concepts like "balanced brackets" and such. To be fair, the syntax
is rather complicated, and if their translation tool does not automatically
pick out which parts need to be translated and which do not, they sometimes do not
interpret the plural syntax properly despite their best efforts. This means they end
up not translating parts of the string that do in fact need a translation.

If you got this warning, it means that the translator did not translate one or
more of the categories of a plural or select and it is the exact same string as in
the source. Sometimes, this is okay because the translation of the source string
is exactly the same in the target language, which means you can ignore this warning.
This is why this rule produces warnings instead of errors. A majority of the time,
however, it is a case of a missed translation.

Example:

English: "{numberOfFiles, plural, one {# file} other {# files}}"<br>
German: "{numberOfFiles, plural, one {# file} other {# Dateien}}

In this case, the German translator missed the "one" category. The string will
need to be sent back to the translator for retranslation.