[**ilib-po**](../README.md) • **Docs**

***

[ilib-po](../README.md) / POFile

# Class: POFile

POFile
Represents a GNU PO resource file.

## Constructors

### new POFile()

> **new POFile**(`options`): [`POFile`](POFile.md)

Create a new PO file with the given path name.

#### Parameters

• **options**: [`POFileOptions`](../type-aliases/POFileOptions.md)

the options to use to create this PO file

#### Returns

[`POFile`](POFile.md)

#### Defined in

[packages/ilib-po/src/POFile.ts:78](https://github.com/iLib-js/ilib-mono/blob/73e0590a5ef6f85f96f5564bad73e893068e1681/packages/ilib-po/src/POFile.ts#L78)

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

[packages/ilib-po/src/POFile.ts:177](https://github.com/iLib-js/ilib-mono/blob/73e0590a5ef6f85f96f5564bad73e893068e1681/packages/ilib-po/src/POFile.ts#L177)

***

### getContextInKey()

> **getContextInKey**(): `boolean`

Get whether the context is part of the key in this PO file.

#### Returns

`boolean`

whether the context is part of the key in this PO file

#### Defined in

[packages/ilib-po/src/POFile.ts:164](https://github.com/iLib-js/ilib-mono/blob/73e0590a5ef6f85f96f5564bad73e893068e1681/packages/ilib-po/src/POFile.ts#L164)

***

### getDatatype()

> **getDatatype**(): `string`

Get the datatype of this PO file.

#### Returns

`string`

the datatype of this PO file

#### Defined in

[packages/ilib-po/src/POFile.ts:156](https://github.com/iLib-js/ilib-mono/blob/73e0590a5ef6f85f96f5564bad73e893068e1681/packages/ilib-po/src/POFile.ts#L156)

***

### getPathName()

> **getPathName**(): `string`

Get the path name of this PO file.

#### Returns

`string`

the path name of this PO file

#### Defined in

[packages/ilib-po/src/POFile.ts:124](https://github.com/iLib-js/ilib-mono/blob/73e0590a5ef6f85f96f5564bad73e893068e1681/packages/ilib-po/src/POFile.ts#L124)

***

### getProjectName()

> **getProjectName**(): `string`

Get the project name of this PO file.

#### Returns

`string`

the project name of this PO file

#### Defined in

[packages/ilib-po/src/POFile.ts:148](https://github.com/iLib-js/ilib-mono/blob/73e0590a5ef6f85f96f5564bad73e893068e1681/packages/ilib-po/src/POFile.ts#L148)

***

### getSourceLocale()

> **getSourceLocale**(): `string`

Get the source locale of this PO file.

#### Returns

`string`

the source locale of this PO file

#### Defined in

[packages/ilib-po/src/POFile.ts:132](https://github.com/iLib-js/ilib-mono/blob/73e0590a5ef6f85f96f5564bad73e893068e1681/packages/ilib-po/src/POFile.ts#L132)

***

### getTargetLocale()

> **getTargetLocale**(): `string`

Get the target locale of this PO file.

#### Returns

`string`

the target locale of this PO file

#### Defined in

[packages/ilib-po/src/POFile.ts:140](https://github.com/iLib-js/ilib-mono/blob/73e0590a5ef6f85f96f5564bad73e893068e1681/packages/ilib-po/src/POFile.ts#L140)

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

SyntaxError if there is a syntax error in the file

#### Defined in

[packages/ilib-po/src/POFile.ts:116](https://github.com/iLib-js/ilib-mono/blob/73e0590a5ef6f85f96f5564bad73e893068e1681/packages/ilib-po/src/POFile.ts#L116)
