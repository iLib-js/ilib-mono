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

• **options**: [`GeneratorOptions`](../interfaces/GeneratorOptions.md)

#### Returns

[`Generator`](Generator.md)

#### Defined in

[packages/ilib-po/src/Generator.ts:76](https://github.com/iLib-js/ilib-mono/blob/ddf9d893c14f3d56f8b7c289351b045aed9742ab/packages/ilib-po/src/Generator.ts#L76)

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

[packages/ilib-po/src/Generator.ts:104](https://github.com/iLib-js/ilib-mono/blob/ddf9d893c14f3d56f8b7c289351b045aed9742ab/packages/ilib-po/src/Generator.ts#L104)
