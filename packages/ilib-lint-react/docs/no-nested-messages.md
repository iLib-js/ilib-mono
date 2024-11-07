# no-nested-messages

This rule checks for one way in which strings in your code are not localizable because
they are broken up in multiple pieces. (Yes, there are multiple ways!)

Translators need entire sentences or fragments in order
to translate properly. Grammar rules and word ordering are different in other
languages, so you cannot translate parts of an English sentence separately and glue
them together in the same order as in English and expect to get the right results
in all other languages.

Specifically, this rule checks that the code does not use a `FormattedMessage`
component inside of another `FormattedMessage` component. Also, it checks for calls
to `intl.formatMessage()` within a `FormattedMessage` component which is the
imperative programming version of the same thing.

Example of incorrect usage:

```javascript
export class CustomComponent extends React.Component {
    render() {
        return (
            <>
                <FormattedMessage
                    id="my.unique.id"
                    defaultMessage="You agree to the {termsAndConditionsLink} by using this software."
                    description="Part of the legal notices to the user at the bottom of the page"
                    values={{
                        termsAndConditionsLink:
                            <a href="terms.html">
                                <FormattedMessage
                                    id="terms.and.conditions"
                                    defaultMessage="terms and conditions"
                                    description="content of the link that points at the terms and conditions page"
                                />
                            </a>
                    }}
                />
            </>
        );
    }
}
```

In the above example, the translation of the phrase "terms and conditions" is substituted
in to the outer string. However, the translator that receives the outer string in their
work queue will be confused as to how to translate the word "the" right before the
substitution parameter. Is the item mentioned in the parameter masculine or feminine?
Is it plural or singular? Is it in accusative or dative case? The translator cannot know
because the second phrase appears in a different point in their work queue or may even
be assigned to a different translator. The translator cannot assume the two strings are
linked together, because one or the other string may be shared with another usage of
the same string in a different context.

The solution is to use rich text formatting feature of react-intl instead, like this:

```javascript
export class CustomComponent extends React.Component {
    render() {
        return (
            <>
                <FormattedMessage
                    id="my.unique.id"
                    defaultMessage="You agree to the <a>terms and conditions</a> by using this software."
                    description="Part of the legal notices to the user at the bottom of the page"
                    values={{
                        a: (chunks) => <a href="terms.html">{chunks}</a>
                    }}
                />
            </>
        );
    }
}
```

This allows the translator to see the whole string and translate all its parts
correctly in context, and even to re-arrange the parts as needed by the grammar of the
target language. This results in a much better translation across all languages.
