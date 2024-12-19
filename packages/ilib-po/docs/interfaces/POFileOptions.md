[**ilib-po**](../index.md) • **Docs**

***

[ilib-po](../index.md) / POFileOptions

# Interface: POFileOptions

Options for the POFile constructor

## Properties

### contextInKey?

> `optional` **contextInKey**: `boolean`

whether the context should be included as part of the key or not

#### Default

```ts
false
```

#### Defined in

[packages/ilib-po/src/POFile.ts:70](https://github.com/iLib-js/ilib-mono/blob/93e89be607a435a4b66a7be8ed5050a5552f16db/packages/ilib-po/src/POFile.ts#L70)

***

### datatype?

> `optional` **datatype**: `string`

the type of the data in the po file

This might be something like "python" or "javascript" to
indicate the type of the code that the strings are used in.

#### Default

```ts
"po"
```

#### Defined in

[packages/ilib-po/src/POFile.ts:63](https://github.com/iLib-js/ilib-mono/blob/93e89be607a435a4b66a7be8ed5050a5552f16db/packages/ilib-po/src/POFile.ts#L63)

***

### pathName

> **pathName**: `string`

the path to the po file

#### Defined in

[packages/ilib-po/src/POFile.ts:32](https://github.com/iLib-js/ilib-mono/blob/93e89be607a435a4b66a7be8ed5050a5552f16db/packages/ilib-po/src/POFile.ts#L32)

***

### projectName?

> `optional` **projectName**: `string`

the name of the project that this po file is a part of

By default, this will be set to the base name of [pathName](POFileOptions.md#pathname) without the `.po` extension

#### Defined in

[packages/ilib-po/src/POFile.ts:39](https://github.com/iLib-js/ilib-mono/blob/93e89be607a435a4b66a7be8ed5050a5552f16db/packages/ilib-po/src/POFile.ts#L39)

***

### sourceLocale?

> `optional` **sourceLocale**: `string`

the source locale of the file

#### Default

```ts
"en-US"
```

#### Defined in

[packages/ilib-po/src/POFile.ts:46](https://github.com/iLib-js/ilib-mono/blob/93e89be607a435a4b66a7be8ed5050a5552f16db/packages/ilib-po/src/POFile.ts#L46)

***

### targetLocale?

> `optional` **targetLocale**: `string`

the target locale of the file

#### Default

```ts
undefined
```

#### Defined in

[packages/ilib-po/src/POFile.ts:53](https://github.com/iLib-js/ilib-mono/blob/93e89be607a435a4b66a7be8ed5050a5552f16db/packages/ilib-po/src/POFile.ts#L53)
