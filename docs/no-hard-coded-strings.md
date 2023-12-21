# no-hard-coded-strings

This rule checks for hard-coded strings in your code, which are, of course, not localizable.

## JSX/TSX

This rule checks your jsx/tsx code for text elements in the middle of your components.

Example:

```jsx
render() {
    return (
        <>
            <Button className="some-button" type="button">
                Click me
            </Button>
        </>
    );
}
```

In this example, the text "Click me" will be flagged as hard-coded text. There are two
methods for resolving this problem, depending on the style of your project:

Method 1: (leaving the text in the file)

```jsx
render() {
    return (
        <>
            <Button className="some-button" type="button">
                <FormattedMessage
                    id="unique-id"
                    defaultMessage="Click me"
                    description="Notes for the translator to understand what this message is about and how it is used in the UI"
                />
            </Button>
        </>
    );
}
```

Method 2: (extracting the text elsewhere)

```jsx
messages.js:
import { defineMessages } from 'react-intl';

export default defineMessages({
    unique_id: {
        id: "unique-id",
        defaultMessage: "Click me",
        description: "Notes for the translator to understand what this message is about and how it is used in the UI"
    }
});

in your original source file:
render() {
    return (
        <>
            <Button className="some-button" type="button">
                <FormattedMessage {...messages.unique_id} />
            </Button>
        </>
    );
}
```

The rule and the fixes above can also work with JS+Flow or Typescript.

## Imperative React

If you are using imperative React in your Javascript, this rule will still work. Example:

```js
render() {
    return React.createElement(
        React.Fragment,
        {},
        React.createElement(Button, { className: "some-button", type: "button" }, "Click me")
    );
}
```

In this example, the text "Click me" will be flagged as hard-coded text, just like in the first example. The
fix is to use imperative React API `intl.formatMessage` to get the translation:

```js
render() {
    return React.createElement(
        React.Fragment,
        {},
        React.createElement(
            Button, 
            { className: "some-button", type: "button" }, 
            intl.formatMessage(messages.unique_id)
        )
    );
}
```

## HTML Attributes

Some HTML attributes on some HTML tags are commonly shown in the UI and should therefore be
translated. This rule will find those attribute values and flag them. Example:

```jsx
render() {
    return (
        <>
            <input type="button" placeholder="Your Name" />
        </>
    );
}
```

In the above example, the value of the `placeholder` attribute is supposed to be localized,
but is unfortunately hard-coded. This rule will flag that.

The fix is to use `intl.formatMessage` to get the translation:

```jsx
render() {
    return (
        <>
            <input type="button" placeholder={intl.formatMessage(unique_id)} />
        </>
    );
}
```

For some attributes, such as "title" and all of the "aria-*" attributes, the values will
be flagged for all components and HTML tags.

### Table of Localizable Attributes

| tag | attribute |
| ---- | ----- |
| area | alt |
| img | alt |
| input | alt |
| input | placeholder |
| optgroup | label |
| option | label |
| textarea | placeholder |
| track | label |
| * | title |
| * | aria-braillelabel |
| * | aria-brailleroledescription |
| * | aria-description |
| * | aria-label |
| * | aria-placeholder |
| * | aria-roledescription |
| * | aria-rowindextext |
| * | aria-valuetext |

"*" in the above table means "all components and HTML tags"

### Attributes in Imperative React

This rule will also check the attributes in imperative React. Example:

```js
render() {
    return React.createElement(
        React.Fragment,
        {},
        React.createElement(input, { placeholder: "Your name", type: "button" })
    );
}
```

The rule will flag the text "Your name" as hard-coded. The fix is to use `intl.formatMessage`:

```jsx
render() {
    return React.createElement(
        React.Fragment,
        {},
        React.createElement(input, { placeholder: intl.formatMessage(messages.myMessage), type: "button" })
    );
}
```

## See also

- [react-intl rich text formatting documentation](https://formatjs.io/docs/react-intl/components/#rich-text-formatting)
- [react-intl imperative API `intl.formatMessage`](https://formatjs.io/docs/react-intl/api/#formatmessage)
- [rich text formatting changes in react-intl v2 -> v3 upgrade guide](https://formatjs.io/docs/react-intl/upgrade-guide-3x/#enhanced-formattedmessage--formatmessage-rich-text-formatting)
