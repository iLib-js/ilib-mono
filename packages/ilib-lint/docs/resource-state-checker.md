# resource-state-checker

If you received this error, it means that there are resources in your project
that have a disallowed state field. To resolve this, try changing the state of
the resources to have one of the allowed states.

## Configuration

By default, this rule checks that all resources have the state "translated". You can configure it to check for different states in your `ilib-lint.json` configuration file:

### Single State
To require all resources to have a specific state (e.g., "signed-off"):

```json
{
  "rulesets": {
    "my-rule": {
      "resource-state-checker": "signed-off"
    }
  }
}
```

### Multiple Allowed States
To allow resources to have any of several states:

```json
{
  "rulesets": {
    "my-rule": {
      "resource-state-checker": ["translated", "needs-review"]
    }
  }
}
```

### Default Behavior
If you don't specify a parameter, the rule defaults to requiring "translated":

```json
{
  "rulesets": {
    "my-rule": {
      "resource-state-checker": true
    }
  }
}
```

## Valid States

The resource-state-checker supports the following valid states:

### XLIFF 2.0 Standard States
- `initial`
- `translated`
- `reviewed`
- `final`

### XLIFF 1.2 Standard States
- `new`
- `needs-translation`
- `needs-adaptation`
- `needs-l10n`
- `needs-review-translation`
- `needs-review-adaptation`
- `needs-review-l10n`
- `signed-off`

### Additional Common States
- `needs-review`
- `fuzzy`

### Mojito Open Source Project States
- `accepted`
- `rejected`
- `approved`
- `needs-approval`

### Custom States
- Any state with `x-` prefix (e.g., `x-custom-state`, `x-my-workflow`)

## Examples

For xliff 1.2 resources where you want the states to have the value "translated",
they might look like this:

```xml
    <trans-unit id="1" resname="example" restype="string" datatype="javascript">
      <source>This is the source text.</source>
      <target state="translated">Dies ist der Quelltext</target>
    </trans-unit>
```

In xliff 2.0 resources, they might look like this:

```xml
    <unit id="1">
      <segment>
        <source>This is the source text.</source>
        <target state="translated">Dies ist der Quelltext</target>
      </segment>
    </unit>
```

### Using Mojito States

For projects using Mojito translation management, you can configure the checker to use Mojito-specific states:

```json
{
  "rulesets": {
    "my-rule": {
      "resource-state-checker": ["accepted", "approved"]
    }
  }
}
```

### Using Custom States

You can also use custom states with the `x-` prefix for project-specific workflows:

```json
{
  "rulesets": {
    "my-rule": {
      "resource-state-checker": ["x-ready-for-review", "x-approved-by-manager"]
    }
  }
}
```
