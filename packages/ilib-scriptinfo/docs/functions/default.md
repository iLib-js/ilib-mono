[**ilib-scriptinfo**](../index.md) • **Docs**

***

[ilib-scriptinfo](../index.md) / default

# Function: default()

> **default**(`script`): [`ScriptInfo`](../classes/ScriptInfo.md) \| `undefined`

Factory function to create a ScriptInfo instance.

## Parameters

• **script**: `undefined` \| `null` \| `string` \| `number`

The ISO 15924 4-letter script code (e.g., 'Latn', 'Arab', 'Hani')

## Returns

[`ScriptInfo`](../classes/ScriptInfo.md) \| `undefined`

A ScriptInfo instance if the script is recognized, undefined otherwise

## Example

```typescript
import scriptInfoFactory from 'ilib-scriptinfo';

const latin = scriptInfoFactory('Latn');
if (latin) {
    console.log(latin.getName()); // "Latin"
    console.log(latin.getScriptDirection()); // "ltr" (left-to-right)
}

const unknown = scriptInfoFactory('Xyz');
if (unknown) {
    // This won't execute - unknown will be undefined
    console.log(unknown.getName());
}
```

## Defined in

[ScriptInfo.ts:94](https://github.com/iLib-js/ilib-mono/blob/792cc31c3c0b58d9ce2952f5c37ae16b46acf0bc/packages/ilib-scriptinfo/src/ScriptInfo.ts#L94)
