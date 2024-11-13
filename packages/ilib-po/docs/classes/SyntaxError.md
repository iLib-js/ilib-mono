[**ilib-po**](../index.md) • **Docs**

***

[ilib-po](../index.md) / SyntaxError

# Class: SyntaxError

Error thrown when there was a syntax error in the input file

## Extends

- `Error`

## Constructors

### new SyntaxError()

> **new SyntaxError**(`filename`, `message`): [`SyntaxError`](SyntaxError.md)

Create a new instance of the error

#### Parameters

• **filename**: `string`

the name of the file where the syntax error occurred

• **message**: `string`

a description of the syntax error

#### Returns

[`SyntaxError`](SyntaxError.md)

#### Overrides

`Error.constructor`

#### Defined in

[packages/ilib-po/src/SyntaxError.ts:29](https://github.com/iLib-js/ilib-mono/blob/260275b25bcc6bce9b244e4270a501d1b8cd6fc8/packages/ilib-po/src/SyntaxError.ts#L29)

## Properties

### message

> **message**: `string`

#### Inherited from

`Error.message`

#### Defined in

node\_modules/.pnpm/typescript@5.6.3/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### name

> **name**: `string`

#### Inherited from

`Error.name`

#### Defined in

node\_modules/.pnpm/typescript@5.6.3/node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

`Error.stack`

#### Defined in

node\_modules/.pnpm/typescript@5.6.3/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Optional override for formatting stack traces

#### Parameters

• **err**: `Error`

• **stackTraces**: `CallSite`[]

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

`Error.prepareStackTrace`

#### Defined in

node\_modules/.pnpm/@types+node@20.17.4/node\_modules/@types/node/globals.d.ts:98

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

`Error.stackTraceLimit`

#### Defined in

node\_modules/.pnpm/@types+node@20.17.4/node\_modules/@types/node/globals.d.ts:100

## Methods

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

#### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

#### Returns

`void`

#### Inherited from

`Error.captureStackTrace`

#### Defined in

node\_modules/.pnpm/@types+node@20.17.4/node\_modules/@types/node/globals.d.ts:91
