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

[packages/ilib-po/src/POFile.ts:101](https://github.com/iLib-js/ilib-mono/blob/93e89be607a435a4b66a7be8ed5050a5552f16db/packages/ilib-po/src/POFile.ts#L101)

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

[packages/ilib-po/src/POFile.ts:206](https://github.com/iLib-js/ilib-mono/blob/93e89be607a435a4b66a7be8ed5050a5552f16db/packages/ilib-po/src/POFile.ts#L206)

***

### getContextInKey()

> **getContextInKey**(): `boolean`

Get whether the context is part of the key in this PO file.

#### Returns

`boolean`

whether the context is part of the key in this PO file

#### Defined in

[packages/ilib-po/src/POFile.ts:193](https://github.com/iLib-js/ilib-mono/blob/93e89be607a435a4b66a7be8ed5050a5552f16db/packages/ilib-po/src/POFile.ts#L193)

***

### getDatatype()

> **getDatatype**(): `undefined` \| `string`

Get the datatype of this PO file.

#### Returns

`undefined` \| `string`

the datatype of this PO file

#### Defined in

[packages/ilib-po/src/POFile.ts:185](https://github.com/iLib-js/ilib-mono/blob/93e89be607a435a4b66a7be8ed5050a5552f16db/packages/ilib-po/src/POFile.ts#L185)

***

### getPathName()

> **getPathName**(): `string`

Get the path name of this PO file.

#### Returns

`string`

the path name of this PO file

#### Defined in

[packages/ilib-po/src/POFile.ts:153](https://github.com/iLib-js/ilib-mono/blob/93e89be607a435a4b66a7be8ed5050a5552f16db/packages/ilib-po/src/POFile.ts#L153)

***

### getProjectName()

> **getProjectName**(): `string`

Get the project name of this PO file.

#### Returns

`string`

the project name of this PO file

#### Defined in

[packages/ilib-po/src/POFile.ts:177](https://github.com/iLib-js/ilib-mono/blob/93e89be607a435a4b66a7be8ed5050a5552f16db/packages/ilib-po/src/POFile.ts#L177)

***

### getSourceLocale()

> **getSourceLocale**(): `string`

Get the source locale of this PO file.

#### Returns

`string`

the source locale of this PO file

#### Defined in

[packages/ilib-po/src/POFile.ts:161](https://github.com/iLib-js/ilib-mono/blob/93e89be607a435a4b66a7be8ed5050a5552f16db/packages/ilib-po/src/POFile.ts#L161)

***

### getTargetLocale()

> **getTargetLocale**(): `undefined` \| `string`

Get the target locale of this PO file.

#### Returns

`undefined` \| `string`

the target locale of this PO file

#### Defined in

[packages/ilib-po/src/POFile.ts:169](https://github.com/iLib-js/ilib-mono/blob/93e89be607a435a4b66a7be8ed5050a5552f16db/packages/ilib-po/src/POFile.ts#L169)

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

[packages/ilib-po/src/POFile.ts:145](https://github.com/iLib-js/ilib-mono/blob/93e89be607a435a4b66a7be8ed5050a5552f16db/packages/ilib-po/src/POFile.ts#L145)
