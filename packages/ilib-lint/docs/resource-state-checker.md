# resource-state-checker

If you received this error, it means that there are resources in your project
that have a disallowed state field. To resolve this, try changing the state of
the resources to have one of the allowed states.

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
