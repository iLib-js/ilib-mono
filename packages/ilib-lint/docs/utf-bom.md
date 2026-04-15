# utf-bom

This rule ensures that the file does not start with a [UTF-8 byte order mark (BOM)](https://en.wikipedia.org/wiki/Byte_order_mark#UTF-8).

It will produce an error only when the file starts with UTF-8 BOM byte sequence `EF BB BF`.

## Fix

The rule provides an autofix that removes the BOM bytes from the file. It will be applied automatically when the `--fix` flag is used.

To fix the issue manually, simply remove the BOM bytes from the beginning of the file, e.g. through command line:

```sh
sed '1s/^\xEF\xBB\xBF//' < input.xliff > output.xliff
```

or use a text editor to re-save the file using _UTF-8 without BOM_ encoding.
