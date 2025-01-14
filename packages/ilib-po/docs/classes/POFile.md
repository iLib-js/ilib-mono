[**ilib-po**](../index.md) • **Docs**

***

[ilib-po](../index.md) / POFile

# Class: POFile

Represents a GNU PO resource file.

## Constructors

### new POFile()

> **new POFile**(`options`): [`POFile`](POFile.md)

Create a new PO file with the given path name.

#### Parameters

• **options**: [`POFileOptions`](../interfaces/POFileOptions.md)

#### Returns

[`POFile`](POFile.md)

#### Defined in

[packages/ilib-po/src/POFile.ts:100](https://github.com/iLib-js/ilib-mono/blob/ddf9d893c14f3d56f8b7c289351b045aed9742ab/packages/ilib-po/src/POFile.ts#L100)

## Methods

### generate()

> **generate**(`set`): `string`

Generate the PO file again from the resources. Each resource in the set
should have the same target locale. If a resource has a target locale
that is different from the target locale of this PO file, it will be
ignored.

#### Parameters

• **set**: `TranslationSet`

the set of resources to generate the PO file from

#### Returns

`string`

the generated PO file

#### Defined in

[packages/ilib-po/src/POFile.ts:207](https://github.com/iLib-js/ilib-mono/blob/ddf9d893c14f3d56f8b7c289351b045aed9742ab/packages/ilib-po/src/POFile.ts#L207)

***

### getContextInKey()

> **getContextInKey**(): `boolean`

Get whether the context is part of the key in this PO file.

#### Returns

`boolean`

whether the context is part of the key in this PO file

#### Defined in

[packages/ilib-po/src/POFile.ts:194](https://github.com/iLib-js/ilib-mono/blob/ddf9d893c14f3d56f8b7c289351b045aed9742ab/packages/ilib-po/src/POFile.ts#L194)

***

### getDatatype()

> **getDatatype**(): `undefined` \| `string`

Get the datatype of this PO file.

#### Returns

`undefined` \| `string`

the datatype of this PO file

#### Defined in

[packages/ilib-po/src/POFile.ts:186](https://github.com/iLib-js/ilib-mono/blob/ddf9d893c14f3d56f8b7c289351b045aed9742ab/packages/ilib-po/src/POFile.ts#L186)

***

### getPathName()

> **getPathName**(): `string`

Get the path name of this PO file.

#### Returns

`string`

the path name of this PO file

#### Defined in

[packages/ilib-po/src/POFile.ts:154](https://github.com/iLib-js/ilib-mono/blob/ddf9d893c14f3d56f8b7c289351b045aed9742ab/packages/ilib-po/src/POFile.ts#L154)

***

### getProjectName()

> **getProjectName**(): `string`

Get the project name of this PO file.

#### Returns

`string`

the project name of this PO file

#### Defined in

[packages/ilib-po/src/POFile.ts:178](https://github.com/iLib-js/ilib-mono/blob/ddf9d893c14f3d56f8b7c289351b045aed9742ab/packages/ilib-po/src/POFile.ts#L178)

***

### getSourceLocale()

> **getSourceLocale**(): `undefined` \| `string`

Get the source locale of this PO file.

#### Returns

`undefined` \| `string`

the source locale of this PO file

#### Defined in

[packages/ilib-po/src/POFile.ts:162](https://github.com/iLib-js/ilib-mono/blob/ddf9d893c14f3d56f8b7c289351b045aed9742ab/packages/ilib-po/src/POFile.ts#L162)

***

### getTargetLocale()

> **getTargetLocale**(): `undefined` \| `string`

Get the target locale of this PO file.

#### Returns

`undefined` \| `string`

the target locale of this PO file

#### Defined in

[packages/ilib-po/src/POFile.ts:170](https://github.com/iLib-js/ilib-mono/blob/ddf9d893c14f3d56f8b7c289351b045aed9742ab/packages/ilib-po/src/POFile.ts#L170)

***

### parse()

> **parse**(`data`): `TranslationSet`

Parse the data string looking for the localizable strings and add them to the
project's translation set. This function uses a finite state machine to
handle the parsing.

#### Parameters

• **data**: `string`

the string to parse

#### Returns

`TranslationSet`

the set of resources extracted from the file

#### Throws

when there is a syntax error in the file

#### Defined in

[packages/ilib-po/src/POFile.ts:146](https://github.com/iLib-js/ilib-mono/blob/ddf9d893c14f3d56f8b7c289351b045aed9742ab/packages/ilib-po/src/POFile.ts#L146)
