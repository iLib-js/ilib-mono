[**ilib-po**](../index.md) • **Docs**

***

[ilib-po](../index.md) / POFileOptions

# Type Alias: POFileOptions

> **POFileOptions**: `object`

Options for the POFile constructor

## Type declaration

### contextInKey?

> `optional` **contextInKey**: `boolean`

whether the context should be included as part of the key or not

### datatype?

> `optional` **datatype**: `string`

the type of the data in the po file. This might be something like "python" or "javascript" to
indicate the type of the code that the strings are used in.

### pathName?

> `optional` **pathName**: `string`

the path to the po file

### projectName?

> `optional` **projectName**: `string`

the name of the project that this po file is a part of

### sourceLocale?

> `optional` **sourceLocale**: `string`

the source locale of the file

### targetLocale?

> `optional` **targetLocale**: `string`

the target locale of the file

## Defined in

[packages/ilib-po/src/POFile.ts:31](https://github.com/iLib-js/ilib-mono/blob/c0fae8bde5f06bd45cef09be8f7ab667ccfdb8fe/packages/ilib-po/src/POFile.ts#L31)
