# resource-completeness

If you received this error, it means that there are resources in your project
which don't have either source or target element defined. To resolve this, add missing elements.

For xliff 1.2 complete resources might look like this:

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
