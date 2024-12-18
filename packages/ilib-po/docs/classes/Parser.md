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

[packages/ilib-po/src/Parser.ts:131](https://github.com/iLib-js/ilib-mono/blob/f51f38d36fc6d0448a50f2150420f1900bba3e95/packages/ilib-po/src/Parser.ts#L131)

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

[packages/ilib-po/src/Parser.ts:169](https://github.com/iLib-js/ilib-mono/blob/f51f38d36fc6d0448a50f2150420f1900bba3e95/packages/ilib-po/src/Parser.ts#L169)
