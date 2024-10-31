# source-no-dashes-in-replacement-params

The formatjs libraries (as used as part of react-intl for example) do not
allow replacement parameters to contain a dash character in the name of
the parameter. If you got this error, simply rename your replacement
parameter and modify your code to match.

Bad replacement parameter: {this-doesnt-work}<br>
Good replacement parameters: {thisWorks}  or {this_works}