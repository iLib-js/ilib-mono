# source-no-manual-date-formatting

Ensure that source strings do not contain manually formatted dates or times.
Dates and times should be formatted with a locale-sensitive date formatter,
such as the `FormattedDate` component in react-intl, and the result
should be substituted into the current string.

The reason that you should use a date formatting library are:

- linguists are not programmers, and often they do not either understand the
  date formats or they do not know what do with them, meaning that the date
  format will not be updated for the target locale as you might expect
- most translations are done per language, but dates are not only dependent
  on the language. They are dependent on both the language and region. An
  example is US dates versus British dates. Both regions speak English, but
  in the US, dates are MM/dd/yy and in the UK, dates are dd/MM/yy. A string
  in English would get the date wrong for at least one of the two countries.

This rule searches for any manually formatted dates or times and reports
an error for each one.

Bad source string:

```
The deployment was triggered at {hh}:{mm} on {MM}/{dd}/{yy}.
```

Preferred source string:

```
The deployment was triggered at {formattedDateTime}
```

Example in React with react-intl:

```js
const messages = defineMessages({
    deploymentStarted: {
        id: "unique.id",
        description: "Status message to the user after the deployment is started",
        defaultMessage: "The deployment was triggered at {formattedDateTime}"
    }
});

<FormattedMessage {...messages.deploymentStarted} values={{
    formattedDateTime: <FormattedDate
        value={deployment.getStart()}
        year: "numeric"
        month: "numeric"
        day: "numeric"
        hour: "numeric"
        minute: "numeric"
    />
}}/>
```