[**ilib-po**](../index.md) • **Docs**

***

[ilib-po](../index.md) / Parser

# Class: Parser

Parse a PO file
Represents a GNU PO resource file.

## Constructors

### new Parser()

> **new Parser**(`options`): [`Parser`](Parser.md)

Create a new PO file with the given path name.

#### Parameters

• **options**: `ParserOptions`

#### Returns

[`Parser`](Parser.md)

#### Defined in

[packages/ilib-po/src/Parser.ts:117](https://github.com/iLib-js/ilib-mono/blob/2476eed8f7d6e8d3967aa6de3e229a9bd34f9e08/packages/ilib-po/src/Parser.ts#L117)

## Methods

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

[packages/ilib-po/src/Parser.ts:153](https://github.com/iLib-js/ilib-mono/blob/2476eed8f7d6e8d3967aa6de3e229a9bd34f9e08/packages/ilib-po/src/Parser.ts#L153)
