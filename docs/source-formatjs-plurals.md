# source-formatjs-plurals

If you received this error, then there is a syntax error in a plural string in
your React code. Strings are expected to follow the syntax for formatjs plurals.
More info on the expected syntax can be found [here](https://formatjs.io/docs/core-concepts/icu-syntax/#plural-format).

Example:

```javascript
defineMessages([
    {
        id: "myprogram.unique.id",
        defaultMessage: "{count, plural, one {There is one file} other {There are # files}",
        description: "Shown in the dialog that pops up when you delete a folder."
    }
]);
```

In the above example, the plural does not contain a balanced number of opening and closing curly braces.
There should be an extra closing curly brace at the end of the defaultMessage.
