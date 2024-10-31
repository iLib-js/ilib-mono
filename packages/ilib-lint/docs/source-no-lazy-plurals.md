# source-no-lazy-plurals

Ensure that source strings do not contain "lazy" plurals. A lazy plural
is where you put the construct "(s)" at the end of a word to indicate that
the number may be singular or plural. Even in English, this looks a little
awkward because it looks like you didn't put the effort to get it right,
and also sometimes the plurality of the verb does not correspond to the
given number. In other languages with complex plural systems or where
pluralizing a word involves spelling changes in mid-word, it is close to
impossible to translate it properly.

German:

- "Auto" (car) -> "Autos" (cars)  add an "s" suffix
- "Tisch" (table) -> "Tische" (tables)  add an "e" suffix
- "Fuß" (foot) -> "Füße" (feet) add an "e" and modify the central vowel
- "Bäcker" (baker) -> "Bäcker" (bakers)  no suffix for this plural

Instead, you should use the proper plural syntax for your i18n library.
React-intl, for example, uses the ICU messageformat syntax as in this
example:

Bad source string:

```
There are {num} name(s).
```

Preferred source string:

```
{num, plural, one {There is {num} name.} other {There are {num} names.}}
```