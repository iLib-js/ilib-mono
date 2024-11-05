# source-icu-plural-params

If you received this error, then there is a replacement parameter in the string
for the "other" category in your plural, and this replacement parameter does not
appear anywhere in the string for the "one" category.

Example of the error:

```
{count, plural, one {There is one file.} other {There are {count} files.}}
```

The `{count}` replacement parameter is missing from the "one" category.

Corrected string:

```
{count, plural, one {There is {count} file.} other {There are {count} files.}}
```

The reason is simple. In English, there is only one number that is singular, and
that's the number 1. So, we can get away with making the "one" category have a
hard-coded string with the spelled-out "one" in it or a hard-coded digit 1.

But, in many other languages, there are multiple numbers that are considered singular.
(Believe it or not!)

Example in Russian:

| category | numbers that belong to this category   |
| -------- | ---------------------------------------|
| one      | 1, 21, 31, 41, ..., 101, 121, 131, ... |
| few      | 2 - 4, 22 - 24, 32 - 34, ...           |
| many     | 0, 5 - 20, 24 - 30, 34 - 40, ...       |

As such, if count = 31 at the time the message is formatted, then the Russian message will
tell the user the user that there is only 1 file, which is very confusing. Not the
right message!

Remember, linguists are language specialists and have never trained as
programmers. We cannot expect them to understand when and how to modify the string for
the "one" category in their translation to insert the `{count}` parameter to work around
this problem.
