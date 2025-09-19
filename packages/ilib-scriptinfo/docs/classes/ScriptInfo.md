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
import scriptInfoFactory from 'ilib-scriptinfo';

const latin = scriptInfoFactory('Latn');
if (latin) {
    console.log(latin.getName()); // "Latin"
    console.log(latin.getScriptDirection()); // "ltr" (left-to-right)
}
```

## Constructors

### new ScriptInfo()

> **new ScriptInfo**(`script`, `info`): [`ScriptInfo`](ScriptInfo.md)

**`Internal`**

Internal constructor - use createScriptInfo() instead.

#### Parameters

• **script**: `string`

The ISO 15924 4-letter script code

• **info**: `ScriptInfoData`

The script information data

#### Returns

[`ScriptInfo`](ScriptInfo.md)

#### Defined in

[ScriptInfo.ts:139](https://github.com/iLib-js/ilib-mono/blob/792cc31c3c0b58d9ce2952f5c37ae16b46acf0bc/packages/ilib-scriptinfo/src/ScriptInfo.ts#L139)

## Methods

### getCasing()

> **getCasing**(): `boolean`

Checks if the script has special casing behavior.

#### Returns

`boolean`

`true` if the script has special casing, `false` otherwise

#### Example

```typescript
const latin = scriptInfoFactory('Latn');
if (latin) {
    console.log(latin.getCasing()); // true
}

const thai = scriptInfoFactory('Thai');
if (thai) {
    console.log(thai.getCasing()); // false
}
```

#### Defined in

[ScriptInfo.ts:276](https://github.com/iLib-js/ilib-mono/blob/792cc31c3c0b58d9ce2952f5c37ae16b46acf0bc/packages/ilib-scriptinfo/src/ScriptInfo.ts#L276)

***

### getCode()

> **getCode**(): `string`

Gets the ISO 15924 4-letter script code.

#### Returns

`string`

The script code as a string

#### Example

```typescript
const latin = scriptInfoFactory('Latn');
if (latin) {
    console.log(latin.getCode()); // "Latn"
}
```

#### Defined in

[ScriptInfo.ts:157](https://github.com/iLib-js/ilib-mono/blob/792cc31c3c0b58d9ce2952f5c37ae16b46acf0bc/packages/ilib-scriptinfo/src/ScriptInfo.ts#L157)

***

### getCodeNumber()

> **getCodeNumber**(): `undefined` \| `number`

Gets the ISO 15924 script number.

#### Returns

`undefined` \| `number`

The numeric script code, or `undefined` if not recognized

#### Example

```typescript
const latin = scriptInfoFactory('Latn');
if (latin) {
    console.log(latin.getCodeNumber()); // 215
}
```

#### Defined in

[ScriptInfo.ts:174](https://github.com/iLib-js/ilib-mono/blob/792cc31c3c0b58d9ce2952f5c37ae16b46acf0bc/packages/ilib-scriptinfo/src/ScriptInfo.ts#L174)

***

### getLongCode()

> **getLongCode**(): `undefined` \| `string`

Gets the long identifier for the script.

#### Returns

`undefined` \| `string`

The long script identifier, or `undefined` if not recognized

#### Example

```typescript
const latin = scriptInfoFactory('Latn');
if (latin) {
    console.log(latin.getLongCode()); // "Latin"
}
```

#### Defined in

[ScriptInfo.ts:208](https://github.com/iLib-js/ilib-mono/blob/792cc31c3c0b58d9ce2952f5c37ae16b46acf0bc/packages/ilib-scriptinfo/src/ScriptInfo.ts#L208)

***

### getName()

> **getName**(): `undefined` \| `string`

Gets the English name of the script.

#### Returns

`undefined` \| `string`

The script name in English, or `undefined` if not recognized

#### Example

```typescript
const latin = scriptInfoFactory('Latn');
if (latin) {
    console.log(latin.getName()); // "Latin"
}
```

#### Defined in

[ScriptInfo.ts:191](https://github.com/iLib-js/ilib-mono/blob/792cc31c3c0b58d9ce2952f5c37ae16b46acf0bc/packages/ilib-scriptinfo/src/ScriptInfo.ts#L191)

***

### getNeedsIME()

> **getNeedsIME**(): `boolean`

Checks if the script requires an Input Method Editor (IME).

#### Returns

`boolean`

`true` if the script requires an IME, `false` otherwise

#### Example

```typescript
const chinese = scriptInfoFactory('Hani');
if (chinese) {
    console.log(chinese.getNeedsIME()); // true
}

const latin = scriptInfoFactory('Latn');
if (latin) {
    console.log(latin.getNeedsIME()); // false
}
```

#### Defined in

[ScriptInfo.ts:254](https://github.com/iLib-js/ilib-mono/blob/792cc31c3c0b58d9ce2952f5c37ae16b46acf0bc/packages/ilib-scriptinfo/src/ScriptInfo.ts#L254)

***

### getScriptDirection()

> **getScriptDirection**(): [`ScriptDirection`](../enumerations/ScriptDirection.md)

Gets the writing direction of the script.

#### Returns

[`ScriptDirection`](../enumerations/ScriptDirection.md)

`ScriptDirection.LTR` for left-to-right scripts,
         `ScriptDirection.RTL` for right-to-left scripts,
         or `ScriptDirection.LTR` as default for unknown scripts

#### Example

```typescript
const latin = scriptInfoFactory('Latn');
if (latin) {
    console.log(latin.getScriptDirection()); // ScriptDirection.LTR
}

const arabic = scriptInfoFactory('Arab');
if (arabic) {
    console.log(arabic.getScriptDirection()); // ScriptDirection.RTL
}
```

#### Defined in

[ScriptInfo.ts:232](https://github.com/iLib-js/ilib-mono/blob/792cc31c3c0b58d9ce2952f5c37ae16b46acf0bc/packages/ilib-scriptinfo/src/ScriptInfo.ts#L232)

***

### getAllScripts()

> `static` **getAllScripts**(): `string`[]

Gets all available script codes.

#### Returns

`string`[]

Array of all ISO 15924 4-letter script codes

#### Example

```typescript
const allScripts = ScriptInfo.getAllScripts();
console.log(allScripts.includes('Latn')); // true
console.log(allScripts.includes('Arab')); // true
```

#### Defined in

[ScriptInfo.ts:292](https://github.com/iLib-js/ilib-mono/blob/792cc31c3c0b58d9ce2952f5c37ae16b46acf0bc/packages/ilib-scriptinfo/src/ScriptInfo.ts#L292)
