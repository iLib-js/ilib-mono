# resource-dnt-terms

Ensure that if a Do Not Translate term exists in source string, it also appears somewhere in the corresponding target string.

If You received this error, ensure that the missing DNT term is included in an unchanged form in the translated string.

## Configuration

List of DNT terms can be provided directly in rule's config by setting them in property `terms: string[]`.

Alternatively, terms can be provided via an external file by setting `termsFilePath: string` and `termsFileType: "json" | "txt"`.  
`termsFilePath` should contain either an absolute path, or relative to current working directory.  
`termsFileType` is used to determine how the terms file should be parsed:
- `txt` treats the file as plain text DNT terms, one in each line (any kind of line ending):
```
Some DNT term
Another DNT term
```
(it will also trim whitespace from beginning/end of the term and exclude empty lines)
- `json` expects the file to contain a JSON file with `string[]` at its root:
```json
[
    "Some DNT term",
    "Another DNT term"
]
```