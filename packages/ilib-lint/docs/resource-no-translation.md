# resource-no-translation

This rule ensures that each resource in a resource file has a translation. This rule
looks to see if the source and target strings in a resource are different from
each other case- and whitespace-insensitively. There are some exceptions to this
where it does not report a problem if the two are the same:

1. If the source locale and the target locale share a common language and script,
then the translation can be the same as the source, as it is very common for
dialects of a language to use the same words.
1. If the source has the "do not translate" flag turned on.
1. If the source string is a single word. To reduce the false positives, this rule
only checks resources where there are multiple words in the source string.

Example failure case:

```xml
      <trans-unit id="1" resname="foobar" restype="string" datatype="plaintext">
        <source>This is a source string.</source>
        <target>This is a source string.</target>
      </trans-unit>
```

Example cases which do not cause problems:

```xml
      <trans-unit id="1" resname="foobar" restype="string" datatype="plaintext">
        <source>This is a source string.</source>
        <target>Dies ist ein Zielzeichenfolge.</target>
      </trans-unit>
      <trans-unit id="2" resname="foobar2" restype="string" datatype="plaintext">
        <source>thisIsASingleWordCamelCaseString</source>
        <target>thisIsASingleWordCamelCaseString</target>
      </trans-unit>
```
