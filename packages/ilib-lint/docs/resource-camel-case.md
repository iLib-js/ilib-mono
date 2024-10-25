# resource-camel-case

If the source string contains only camel case and no whitespace, then the target must be the same.

The source string is treated as 'Do Not Translate' because camelCased strings are generally not meant to be translated.
Instead, they are commonly used in software as identifiers, variable names, or control strings.

## Rule explanation
Camel case is a way of writing phrases without spaces and with capitalized words.
The first word can start with either case, and the following words have an initial uppercase letter.
Camel-cased words cannot contain spaces or punctuation such as dots (.), underscores (_), or dashes (-) within the word.
Only letters and digits are allowed.

In this context, any string that conforms to the following rule is considered camel case and should not be translated:
* Words in lower and upper camel case (including trailing and leading whitespace), and digits at any position. For example:
    * lowerCamelCase
    * UpperCamelCase a.k.a. PascalCase
    * 1owerCamelC4as3
    * 0pperCamelC4se3

    
## Examples
### Correct
Correctly matched camel case variations in a Spanish (es-ES) translation, where both source and target are the same:

1. lowerCamelCase
    - source: `accessGranted`
    - target: `accessGranted`

2. UpperCamelCase
    - source: `AccessGranted`
    - target: `AccessGranted`

3. lowerCamelCase with digits at any position
    - source: `1access2Granted3`
    - target: `1access2Granted3`
   
4. upperCamelCase with digits
    - source: `AccessGranted123`
    - target: `AccessGranted123`

### Incorrect
Incorrectly matched camel case in a Spanish translation:

1. lowerCamelCase
- source: `accessGranted`
- target: `accesoConcedido`

2. upperCamelCase
- source: `AccessGranted`
- target: `AccesoConcedido`


Problems in the above incorrect translation:
The "accessGranted" and "AccessGranted" camel-cased strings were translated when it should have been treated as "Do Not Translate".
