[**ilib-po**](../index.md) • **Docs**

***

[ilib-po](../index.md) / Generator

# Class: Generator

Generate a PO file from a set of resources.

## Constructors

### new Generator()

> **new Generator**(`options`): [`Generator`](Generator.md)

Create a new PO file generator

#### Parameters

• **options**: [`GeneratorOptions`](../type-aliases/GeneratorOptions.md)

the options to use to create this PO file

#### Returns

[`Generator`](Generator.md)

#### Defined in

[packages/ilib-po/src/Generator.ts:68](https://github.com/iLib-js/ilib-mono/blob/c0fae8bde5f06bd45cef09be8f7ab667ccfdb8fe/packages/ilib-po/src/Generator.ts#L68)

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

the generated PO file as a string

#### Defined in

[packages/ilib-po/src/Generator.ts:89](https://github.com/iLib-js/ilib-mono/blob/c0fae8bde5f06bd45cef09be8f7ab667ccfdb8fe/packages/ilib-po/src/Generator.ts#L89)
