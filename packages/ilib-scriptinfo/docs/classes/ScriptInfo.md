[**ilib-scriptinfo**](../index.md) • **Docs**

***

[ilib-scriptinfo](../index.md) / ScriptInfo

# Class: ScriptInfo

ScriptInfo class provides information about writing scripts based on ISO 15924.

This class offers access to script properties including:
- ISO 15924 4-letter codes and numbers
- Script names in English
- Long identifiers
- Writing direction (LTR/RTL)
- Input method requirements
- Letter casing behavior

## Example

```typescript
import ScriptInfo from 'ilib-scriptinfo';

const latin = new ScriptInfo('Latn');
console.log(latin.getName()); // "Latin"
console.log(latin.getScriptDirection()); // "ltr" (left-to-right)

const arabic = new ScriptInfo('Arab');
console.log(arabic.getScriptDirection()); // "rtl" (right-to-left)
```

## Constructors

### new ScriptInfo()

> **new ScriptInfo**(`script`): [`ScriptInfo`](ScriptInfo.md)

Creates a new ScriptInfo instance for the specified script.

#### Parameters

• **script**: `string`

The ISO 15924 4-letter script code (e.g., 'Latn', 'Arab', 'Hani')

If the script code is not recognized or is invalid:
- The instance will still be created successfully
- `getCode()` will return the original input
- `getCodeNumber()`, `getName()`, and `getLongCode()` will return `undefined`
- `getScriptDirection()` will return `ScriptDirection.LTR` (default)
- `getNeedsIME()` and `getCasing()` will return `false` (default)

#### Returns

[`ScriptInfo`](ScriptInfo.md)

#### Example

```typescript
// Valid script
const scriptInfo = new ScriptInfo('Latn');

// Unknown script
const unknown = new ScriptInfo('Xxxx');
console.log(unknown.getCode()); // "Xxxx"
console.log(unknown.getName()); // undefined
console.log(unknown.getScriptDirection()); // ScriptDirection.LTR
```

#### Defined in

[index.ts:140](https://github.com/iLib-js/ilib-mono/blob/0b76a4b893ca9a570f06cd6f0821e7f81ba67455/packages/ilib-scriptinfo/src/index.ts#L140)

## Methods

### getCasing()

> **getCasing**(): `boolean`

Returns whether the script uses letter case (uppercase/lowercase).

#### Returns

`boolean`

true if the script uses letter case, false otherwise (default for unknown scripts)

#### Example

```typescript
const latin = new ScriptInfo('Latn');
console.log(latin.getCasing()); // true

const arabic = new ScriptInfo('Arab');
console.log(arabic.getCasing()); // false

const unknown = new ScriptInfo('Xxxx');
console.log(unknown.getCasing()); // false
```

#### Defined in

[index.ts:277](https://github.com/iLib-js/ilib-mono/blob/0b76a4b893ca9a570f06cd6f0821e7f81ba67455/packages/ilib-scriptinfo/src/index.ts#L277)

***

### getCode()

> **getCode**(): `string`

Returns the ISO 15924 4-letter script code.

#### Returns

`string`

The script code as a string, or the original input if the script is not found

#### Example

```typescript
const scriptInfo = new ScriptInfo('Latn');
console.log(scriptInfo.getCode()); // "Latn"

const unknown = new ScriptInfo('Xxxx');
console.log(unknown.getCode()); // "Xxxx"
```

#### Defined in

[index.ts:159](https://github.com/iLib-js/ilib-mono/blob/0b76a4b893ca9a570f06cd6f0821e7f81ba67455/packages/ilib-scriptinfo/src/index.ts#L159)

***

### getCodeNumber()

> **getCodeNumber**(): `undefined` \| `number`

Returns the ISO 15924 numeric code for the script.

#### Returns

`undefined` \| `number`

The numeric code as a number, or undefined if the script is not found

#### Example

```typescript
const scriptInfo = new ScriptInfo('Latn');
console.log(scriptInfo.getCodeNumber()); // 215

const unknown = new ScriptInfo('Xxxx');
console.log(unknown.getCodeNumber()); // undefined
```

#### Defined in

[index.ts:177](https://github.com/iLib-js/ilib-mono/blob/0b76a4b893ca9a570f06cd6f0821e7f81ba67455/packages/ilib-scriptinfo/src/index.ts#L177)

***

### getLongCode()

> **getLongCode**(): `undefined` \| `string`

Returns the long identifier for the script.

#### Returns

`undefined` \| `string`

The long identifier as a string, or undefined if the script is not found

#### Example

```typescript
const scriptInfo = new ScriptInfo('Latn');
console.log(scriptInfo.getLongCode()); // "Latin"

const unknown = new ScriptInfo('Xxxx');
console.log(unknown.getLongCode()); // undefined
```

#### Defined in

[index.ts:214](https://github.com/iLib-js/ilib-mono/blob/0b76a4b893ca9a570f06cd6f0821e7f81ba67455/packages/ilib-scriptinfo/src/index.ts#L214)

***

### getName()

> **getName**(): `undefined` \| `string`

Returns the English name of the script.

#### Returns

`undefined` \| `string`

The script name as a string, or undefined if the script is not found

#### Example

```typescript
const scriptInfo = new ScriptInfo('Latn');
console.log(scriptInfo.getName()); // "Latin"

const unknown = new ScriptInfo('Xxxx');
console.log(unknown.getCode()); // "Xxxx"
console.log(unknown.getName()); // undefined
```

#### Defined in

[index.ts:196](https://github.com/iLib-js/ilib-mono/blob/0b76a4b893ca9a570f06cd6f0821e7f81ba67455/packages/ilib-scriptinfo/src/index.ts#L196)

***

### getNeedsIME()

> **getNeedsIME**(): `boolean`

Returns whether the script typically requires an Input Method Editor (IME).

#### Returns

`boolean`

true if the script typically requires an IME, false otherwise (default for unknown scripts)

#### Example

```typescript
const latin = new ScriptInfo('Latn');
console.log(latin.getNeedsIME()); // false

const hangul = new ScriptInfo('Hang');
console.log(hangul.getNeedsIME()); // true

const unknown = new ScriptInfo('Xxxx');
console.log(unknown.getNeedsIME()); // false
```

#### Defined in

[index.ts:256](https://github.com/iLib-js/ilib-mono/blob/0b76a4b893ca9a570f06cd6f0821e7f81ba67455/packages/ilib-scriptinfo/src/index.ts#L256)

***

### getScriptDirection()

> **getScriptDirection**(): [`ScriptDirection`](../enumerations/ScriptDirection.md)

Returns the writing direction of the script.

#### Returns

[`ScriptDirection`](../enumerations/ScriptDirection.md)

`ScriptDirection.RTL` for right-to-left scripts, `ScriptDirection.LTR` for left-to-right scripts (default for unknown scripts)

#### Example

```typescript
const latin = new ScriptInfo('Latn');
console.log(latin.getScriptDirection()); // ScriptDirection.LTR

const arabic = new ScriptInfo('Arab');
console.log(arabic.getScriptDirection()); // ScriptDirection.RTL

const unknown = new ScriptInfo('Xxxx');
console.log(unknown.getScriptDirection()); // ScriptDirection.LTR
```

#### Defined in

[index.ts:235](https://github.com/iLib-js/ilib-mono/blob/0b76a4b893ca9a570f06cd6f0821e7f81ba67455/packages/ilib-scriptinfo/src/index.ts#L235)

***

### \_getScriptsArray()

> `static` **\_getScriptsArray**(): `string`[]

**`Internal`**

Returns an array of all available script codes.

#### Returns

`string`[]

Array of ISO 15924 4-letter script codes

#### Defined in

[index.ts:287](https://github.com/iLib-js/ilib-mono/blob/0b76a4b893ca9a570f06cd6f0821e7f81ba67455/packages/ilib-scriptinfo/src/index.ts#L287)

***

### getAllScripts()

> `static` **getAllScripts**(): `string`[]

Returns an array of all available script codes.

#### Returns

`string`[]

Array of ISO 15924 4-letter script codes for all supported scripts

#### Example

```typescript
const allScripts = ScriptInfo.getAllScripts();
console.log(allScripts.length); // 226
console.log(allScripts.includes('Latn')); // true
console.log(allScripts.includes('Arab')); // true
```

#### Defined in

[index.ts:304](https://github.com/iLib-js/ilib-mono/blob/0b76a4b893ca9a570f06cd6f0821e7f81ba67455/packages/ilib-scriptinfo/src/index.ts#L304)
