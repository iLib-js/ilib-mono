# file-encoding

This rule checks that the encoding of a file is correct. It will produce an error if contents of the file cannot be decoded using the specified encoding.

## Options

-   `encoding`: The expected encoding of the file. Defaults to `utf-8`.

## Fixing This

If you see this type of error, then you need to convert your file from its current character
set to utf-8 instead. (Or whatever encoding is given in the options.) There are many tools
for doing this, the most popular one being [iconv](https://www.npmjs.com/package/iconv)
