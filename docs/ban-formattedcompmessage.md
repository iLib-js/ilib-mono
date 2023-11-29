# ban-formattedcompmessage

`FormattedCompMessage` component is deprecated and should be replaced.

## Why

`FormattedCompMessage` is a custom [box-ui-elements component](https://github.com/box/box-ui-elements/blob/master/src/components/i18n/FormattedCompMessage.js) that was introduced to support rich text formatting in a safe manner in react-intl v2.

Since v3, react-intl natively supports rich text formatting through `FormattedMessage` as shown in their [documentation](https://formatjs.io/docs/react-intl/components/#rich-text-formatting):

```jsx
<FormattedMessage
    id="foo"
    defaultMessage="To buy a shoe, <a>visit our website</a> and <cta>buy a shoe</cta>"
    values={{
        a: (chunks) => (
            <a
                class="external_link"
                target="_blank"
                href="https://www.example.com/shoe"
            >
                {chunks}
            </a>
        ),
        cta: (chunks) => <strong class="important">{chunks}</strong>
    }}
/>
```

Because of that, `FormattedCompMessage` is deprecated and all its usages should be replaced with `FormattedMessage`.

## How to upgrade

Before:

```jsx
<FormattedCompMessage id="mystring" description="translator's comment">
    You can <span class="foo">delete</span> <Link to={url}>these files</Link>, or just <span id="x" class="unshare">unshare them</span>.
</FormattedCompMessage>
```

After:

```jsx
<FormattedMessage
    id="mystring"
    description="translator's comment"
    defaultMessage="You can <foo>delete</foo> <link>these files</link>, or just <unshare>unshare them</unshare>."
    values={{
        foo: (str) => <span class="foo">{str}</span>,
        link: (text) => <Link to={url}>{text}</Link>,
        unshare: (label) => (
            <span id="x" class="unshare">
                {label}
            </span>
        )
    }}
/>
```

## See also

-   [react-intl rich text formatting documentation](https://formatjs.io/docs/react-intl/components/#rich-text-formatting)
-   [rich text formatting changes in react-intl v2 -> v3 upgrade guide](https://formatjs.io/docs/react-intl/upgrade-guide-3x/#enhanced-formattedmessage--formatmessage-rich-text-formatting)
