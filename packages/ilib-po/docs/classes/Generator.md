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

[packages/ilib-po/src/Generator.ts:77](https://github.com/iLib-js/ilib-mono/blob/f51f38d36fc6d0448a50f2150420f1900bba3e95/packages/ilib-po/src/Generator.ts#L77)

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

[packages/ilib-po/src/Generator.ts:104](https://github.com/iLib-js/ilib-mono/blob/f51f38d36fc6d0448a50f2150420f1900bba3e95/packages/ilib-po/src/Generator.ts#L104)
