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

the options to use to create this PO file

#### Returns

[`Parser`](Parser.md)

#### Defined in

[packages/ilib-po/src/Parser.ts:107](https://github.com/iLib-js/ilib-mono/blob/c0fae8bde5f06bd45cef09be8f7ab667ccfdb8fe/packages/ilib-po/src/Parser.ts#L107)

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

[packages/ilib-po/src/Parser.ts:139](https://github.com/iLib-js/ilib-mono/blob/c0fae8bde5f06bd45cef09be8f7ab667ccfdb8fe/packages/ilib-po/src/Parser.ts#L139)
