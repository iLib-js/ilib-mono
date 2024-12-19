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

[packages/ilib-po/src/POFile.ts:101](https://github.com/iLib-js/ilib-mono/blob/bbaba6e1d1be2b1d17df08b5e5a2853c275b9abd/packages/ilib-po/src/POFile.ts#L101)

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

[packages/ilib-po/src/POFile.ts:208](https://github.com/iLib-js/ilib-mono/blob/bbaba6e1d1be2b1d17df08b5e5a2853c275b9abd/packages/ilib-po/src/POFile.ts#L208)

***

### getContextInKey()

> **getContextInKey**(): `boolean`

Get whether the context is part of the key in this PO file.

#### Returns

`boolean`

whether the context is part of the key in this PO file

#### Defined in

[packages/ilib-po/src/POFile.ts:195](https://github.com/iLib-js/ilib-mono/blob/bbaba6e1d1be2b1d17df08b5e5a2853c275b9abd/packages/ilib-po/src/POFile.ts#L195)

***

### getDatatype()

> **getDatatype**(): `undefined` \| `string`

Get the datatype of this PO file.

#### Returns

`undefined` \| `string`

the datatype of this PO file

#### Defined in

[packages/ilib-po/src/POFile.ts:187](https://github.com/iLib-js/ilib-mono/blob/bbaba6e1d1be2b1d17df08b5e5a2853c275b9abd/packages/ilib-po/src/POFile.ts#L187)

***

### getPathName()

> **getPathName**(): `string`

Get the path name of this PO file.

#### Returns

`string`

the path name of this PO file

#### Defined in

[packages/ilib-po/src/POFile.ts:155](https://github.com/iLib-js/ilib-mono/blob/bbaba6e1d1be2b1d17df08b5e5a2853c275b9abd/packages/ilib-po/src/POFile.ts#L155)

***

### getProjectName()

> **getProjectName**(): `string`

Get the project name of this PO file.

#### Returns

`string`

the project name of this PO file

#### Defined in

[packages/ilib-po/src/POFile.ts:179](https://github.com/iLib-js/ilib-mono/blob/bbaba6e1d1be2b1d17df08b5e5a2853c275b9abd/packages/ilib-po/src/POFile.ts#L179)

***

### getSourceLocale()

> **getSourceLocale**(): `string`

Get the source locale of this PO file.

#### Returns

`string`

the source locale of this PO file

#### Defined in

[packages/ilib-po/src/POFile.ts:163](https://github.com/iLib-js/ilib-mono/blob/bbaba6e1d1be2b1d17df08b5e5a2853c275b9abd/packages/ilib-po/src/POFile.ts#L163)

***

### getTargetLocale()

> **getTargetLocale**(): `undefined` \| `string`

Get the target locale of this PO file.

#### Returns

`undefined` \| `string`

the target locale of this PO file

#### Defined in

[packages/ilib-po/src/POFile.ts:171](https://github.com/iLib-js/ilib-mono/blob/bbaba6e1d1be2b1d17df08b5e5a2853c275b9abd/packages/ilib-po/src/POFile.ts#L171)

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

[packages/ilib-po/src/POFile.ts:147](https://github.com/iLib-js/ilib-mono/blob/bbaba6e1d1be2b1d17df08b5e5a2853c275b9abd/packages/ilib-po/src/POFile.ts#L147)
