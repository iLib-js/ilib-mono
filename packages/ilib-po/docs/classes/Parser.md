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

[packages/ilib-po/src/Parser.ts:133](https://github.com/iLib-js/ilib-mono/blob/bbaba6e1d1be2b1d17df08b5e5a2853c275b9abd/packages/ilib-po/src/Parser.ts#L133)

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

[packages/ilib-po/src/Parser.ts:171](https://github.com/iLib-js/ilib-mono/blob/bbaba6e1d1be2b1d17df08b5e5a2853c275b9abd/packages/ilib-po/src/Parser.ts#L171)
