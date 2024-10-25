# source-no-manual-percentage-formatting

Ensure that source strings do not contain manually formatted percentages.
Percentages should be formatted with a locale-sensitive number formatter,
such as the `FormattedNumber` component in react-intl, and the result
should be substituted into the current string. Most number formatters can
format basic numbers, percentages, or a currency amounts and there is
usually a "style" parameter that selects which one of those the caller needs.

Bad source string:

```
{pctFiles}% of files uploaded.
```

Preferred source string:

```
{pctFiles} of files uploaded.
```

Where the pctFiles is formatted by a number formatter and the result
substituted into the string.

Example in React with react-intl:

```js
const messages = defineMessages({
    percentUploaded: {
        id: "unique.id",
        description: "Status message showing the user how much of the requested files have been uploaded so far.",
        defaultMessage: "{pctFiles} of files uploaded."
    }
});

<FormattedMessage {...messages.percentUploaded} values={{
    pctFiles: <FormattedNumber
        value={numUploaded/totalRequest}
        style="percent"
    />
}}/>
```