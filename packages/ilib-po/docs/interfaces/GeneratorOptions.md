[**ilib-po**](../index.md) • **Docs**

***

[ilib-po](../index.md) / GeneratorOptions

# Interface: GeneratorOptions

Options for the generator constructor

## Properties

### contextInKey?

> `optional` **contextInKey**: `boolean`

whether the context should be included as part of the key or not

#### Default

```ts
false
```

#### Defined in

[packages/ilib-po/src/Generator.ts:43](https://github.com/iLib-js/ilib-mono/blob/ddf9d893c14f3d56f8b7c289351b045aed9742ab/packages/ilib-po/src/Generator.ts#L43)

***

### datatype?

> `optional` **datatype**: `string`

The default data type of the resources

#### Defined in

[packages/ilib-po/src/Generator.ts:48](https://github.com/iLib-js/ilib-mono/blob/ddf9d893c14f3d56f8b7c289351b045aed9742ab/packages/ilib-po/src/Generator.ts#L48)

***

### pathName

> **pathName**: `string`

the path to the po file

#### Defined in

[packages/ilib-po/src/Generator.ts:29](https://github.com/iLib-js/ilib-mono/blob/ddf9d893c14f3d56f8b7c289351b045aed9742ab/packages/ilib-po/src/Generator.ts#L29)

***

### projectName?

> `optional` **projectName**: `string`

The name of the project that the resources belong to

#### Defined in

[packages/ilib-po/src/Generator.ts:53](https://github.com/iLib-js/ilib-mono/blob/ddf9d893c14f3d56f8b7c289351b045aed9742ab/packages/ilib-po/src/Generator.ts#L53)

***

### targetLocale?

> `optional` **targetLocale**: `string` \| `Locale`

the target locale of the file

#### Default

```ts
"en"
```

#### Defined in

[packages/ilib-po/src/Generator.ts:36](https://github.com/iLib-js/ilib-mono/blob/ddf9d893c14f3d56f8b7c289351b045aed9742ab/packages/ilib-po/src/Generator.ts#L36)
