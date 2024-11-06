# source-no-manual-currency-formatting

Ensure that source strings do not contain manually formatted currencies.
Currencies should be formatted with a locale-sensitive number formatter,
such as the `FormattedNumber` component in react-intl, and the result
should be substituted into the current string. Most number formatters can
format basic numbers, percentages, or a currency amounts and there is
usually a "style" parameter that selects which one of those the caller needs.

Bad source string:

```
${cost} per month.
```

Preferred source string:

```
{cost} per month.
```

Where the cost is formatted by a number formatter and the result
substituted into the string.

Example in React with react-intl:

```js
const messages = defineMessages({
    monthlySubscriptionFee: {
        id: "unique.id",
        description: "Tells the user how much the monthly fee is for our service.",
        defaultMessage: "{cost} per month"
    }
});

<FormattedMessage {...messages.monthlySubscriptionFee} values={{
    cost: <FormattedNumber
        value={this.fees.monthly}
        currency={this.user.preferredCurrency}
        style="currency"
    />
}}/>
```