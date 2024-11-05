# source-icu-unexplained-params

This rule checks if replacement parameters mentioned in the source string are mentioned in the comment for translators as well.

It's good practice to provide some description for replacement parameters to translators. They can do a much better job translating if they know what each replacement parameter represents.

Example:

```js
export default defineMessages({
    newFeatureNotice: {
        defaultMessage: 'Examine other usage by {ruleUser}.',
        description: 'Notice about other usage examples.',
        id: 'app.popups.otherUsages',
    },
}
```

Given the string description above, it's hard to tell for certain what the parameter will contain. To ensure translators correctly interpret this message, provide a description like so:

```js
export default defineMessages({
    newFeatureNotice: {
        defaultMessage: 'Examine other usage by {ruleUser}.',
        description: 'Notice about other usage examples. ruleUser is an email address of the user that violated the rule.',
        id: 'app.popups.otherUsages',
    },
}
```