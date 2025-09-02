# xliff-header-encoding

This rule checks that the encoding of an XLIFF file is correct. It does so by checking the declared encoding in the XLIFF file's XML header (a.k.a [XML prolog](https://www.w3schools.com/xml/xml_syntax.asp#:~:text=XML%20prolog)):

```xml
<?xml version="1.0" encoding="utf-8"?>
```

The rule will produce an error only when all of the following conditions are met:

1. the XML prolog is present
2. the encoding attribute is present in the XML prolog
3. value of the encoding attribute does not match the expected encoding

Encoding specifier comparison is case-insensitive.

## Options

-   `encoding`: The expected encoding of the XLIFF header. Defaults to `utf-8`.

## Fixing This

If you are seeing this type of error, you can do one of two things:

1. Update the header of your xml file to have the right character set name
1. Convert your file to the named character set using a tool like [iconv](https://www.npmjs.com/package/iconv)
