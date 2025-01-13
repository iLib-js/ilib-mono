# ilib-istring

An intrinsic string replacement that includes formatting capabilities

## Installation

```sh
npm install ilib-istring
# or
yarn add ilib-istring
```

## The IString Class

The IString class is designed to be a drop-in replacement for the intrinsic
Javascript String class.

Full documentation: [IString class](./docs/ilibIString.md)

The String class does not allow subclassing, so the
IString class is a delegate class that delegates most of its methods to an
internal String instance, but adds functionality on top.

For this reason, most of the rest of thus documentation will focus on the
the methods of the IString class that are different from the String class.
To see the methods that are the same, see other sites like the
[MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
for details.

IString contains the following functionality above and beyond the String class:

- format - format parameters into a string
- formatChoice - format parameters into a string, taking care to pluralize
  properly for the locale
- codePointAt - return the Unicode code point at the given index
- forEach - visit each character in the string
- forEachCodePoint - visit each code point in the string
- iterator - return an iterator through the code points
- charIterator - return an iterator through the characters
- setLocale - set the locale of this string
- getLocale - get the locale of this string
- codePointLength - return the number of code points in this string

Additionally, this class modifies the behaviour of the following methods:

- constructor - add a second parameter
- localeCompare - always compare using the instance's locale rather than
  the system's locale

### Formatting

Two methods of the IString class that are not in the instrinsic String
class are the `format` and `formatChoice` methods.

#### Format

To format a string, pass in an object containing named parameters:

```javascript
import IString from "ilib-istring";

const string = new IString("This is a {value} test.");

console.log(string.format({ value: "big" }));
// will print:
// This is a big test.
```

Parameters will generally be converted to strings before formatting
them into the string. The result is an intrinsic String instance, as
presumably, you do not need the extra IString functionality after
formatting is done.

See the [format method documentation](./docs/IString.html#format)
for more details.

#### FormatChoice

In order to support plurals properly, the IString class includes a
[formatChoice](./docs/IString.html#formatChoice) method. Pluralization
is locale-dependent, as different
languages and cultures have different ways of handling plurals.

For example, in English, there are only singular and plural
categories. "one car" vs. "two cars" (or any other number of cars).
In Russian, there is a singular
category, a "few" category for the numbers 2 to 4, and a "many"
category for numbers from 5 to 9. That is, if you have 2 cars
"2 машины" (2 mashiny), then the word for "car" is spelled differently
than when you have 5 cars "5 машин" (5 mashin).

The definition of which numbers belong to which plural category are
locale-dependent. See [the description on the Unicode website](http://cldr.unicode.org/index/cldr-spec/plural-rules)
for more details about how plurals work in many languages.

In order to get pluralization correct for each string in any
locale, the string must have its own locale. This locale may be
different from the locale of the platform.

Choice strings can do more than simple pluralization. The syntax of the
string is similar to that of the Java `ChoiceFormat` class upon
which it was originally modeled. However, there are few enhancements
over the `ChoiceFormat` strings. Basically, the selector for each
choice can be a [CLDR plural category](http://cldr.unicode.org/index/cldr-spec/plural-rules#TOC-Choosing-Plural-Category-Names),
a number with an optional operator, a boolean, or even a regular
expression. This allows you to do things like switching on a string
like "gender", or on the result of a boolean expression.

To format a choice string:

```javascript
import IString from 'ilib-istring';

const x = 2;
const string = new IString("one#singular {x} string|#plural {x} string");
console.log(string.formatChoice(x, {x});
// will print: "plural 2 string"
```

To format a choice string based on gender:

```javascript
import IString from 'ilib-istring';

const gender = "female";
const string = new IString("male#The patient is male.|female#The patient is female.");
console.log(string.formatChoice(gender);
// will print: "The patient is female."
```

See the [formatChoice method documentation](./docs/IString.html#formatChoice)
for more details.

### Code Points

A code point is a unique number in Unicode which encodes a particular
character. The range of a code point is currently 0x000000 through
0x10FFFF, though the upper limit may change in the future. Code points
at or below 0xFFFF (2 bytes) are known as the Basic Multilingual Plane
(BMP) or UCS-2. Code points above 0xFFFF are in the extended planes,
also known colloquially as "the astral planes".

Unicode code points in Javascript strings are encoded as UTF-16. This
is a multi-byte encoding scheme where each character is either 2 or 4
bytes long. Unicode characters in a certain range (ie. a surrogate character)
must be joined with the following character to create a 4 byte character
in the extended planes. Characters that are not surrogate characters
are a simple character in the BMP.

Any character that the processing system does not recognize should be
skipped. In the UTF-16 encoding, older systems that can only process 2-byte
Unicode characters can still process UTF-16 strings by processing the string
2 bytes at a time and ignoring any character it does not recognize.

Unfortunately, most of the String methods are not code point aware
because they were designed before UTF-16 became the base encoding for
Javascript. That
is, if you ask it to give you the character at a particular index, it
will return the surrogate character. You have to know how to calculate
the code point yourself using the next character.

The new methods of IString now do the code point calculations for you.

- [codePointAt](./docs/IString.html#codePointAt) - split the string into a sequence of code points, and then
  return the code point at the given index. This is different than
  the `charAt` method, which returns Unicode characters.
- [forEach](./docs/IString.html#forEach) - split the string into a sequence of code points, convert
  each to a full character (in the BMP or extended planes) and then
  call a callback function for each character
- [forEachCodePoint](./docs/IString.html#forEachCodePoint) - split the string into a sequence of code points,
  and then call a callback function for each one
- [iterator](./docs/IString.html#iterator) - return an iterator through the sequence of code points
- [charIterator](./docs/IString.html#charIterator) - return an iterator through the sequence of code
  points that are returned as full characters
- [codePointLength](./docs/IString.html#codePointLength) - return the total number of code points in this string
  when the string is converted into a sequence of code points

### Return values

Most methods of the intrinsic string which return another instance of
String return an instance of IString instead.

For example, `String.substring()` returns a String, whereas
`IString.substring()` returns an IString.

### Iterator

In addition to the `iterator()` method, IString includes an
[@@Iterator](./docs/IString.html#.@@Iterator)
implementation. This means that it can support the "spread" operator ("...")
and any other language feature that uses the [@@Iterator] such as the
for-of construct.

Spread operator example, spreads accross all characters in the string:

```javascript
import IString from "ilib-istring";

var string = new IString("this is a test.");
console.log(JSON.stringify(...string));
// prints ['t','h','i','s',' ','a',' ','t','e','s','t','.']
```

```javascript
import IString from "ilib-istring";

var string = new IString("this is a test.");

for (let ch of string) {
  console.log(ch);
}
/*
prints:
t
h
i
s

i
s

a

t
e
s
t
.
*/
```

## License

Copyright © 2022-2023, JEDLSoft

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License.

## Release Notes

See [CHANGELOG.md](./CHANGELOG.md)
