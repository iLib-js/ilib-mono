# ilib-scanner

ilib-scanner is a command-line utility that generates a webpack metafile that will include only those
ilib classes that your code actually needs. It does this by scanning your source code looking for
references to ilib classes.

Ilib supports a large number of locales (thousands!) and defines over 80 classes. If you assemble
all of that together, you will end up with a file that is many tens of megabytes large, which will
be ready for anything, but way too big to put on any website.

The reality is that the majority of web sites only support a limited set of locales and
use only need a limited set of international classes, and only need the locale data for those
specific locales and classes.

For those web apps that do not currently use webpack for their packaging, this scanner will help
create the webpack configuration file needed to create a custom version of ilib with only those
international classes that your code uses and only the locale data for the locales your app needs
to support.

If your app already uses webpack for its packaging, you can use that to create a custom version
of ilib yourself. See the documentation in the 
[ilib-webpack-loader](https://www.github.com/ilib-js/ilib-webpack-loader) for more information.

Installation
------------

Use `npm install ilib-scanner` or `yarn add ilib-scanner` to install the scanner.

Then, make sure that node_modules/.bin is in your path.

If your app is packaged with npm or yarn and has a package.json, put the following in your
"devDependencies" property:

```
    "ilib-scanner": "^1.0.0",
````

Usage
-----

1.  To run the scanner on your webapp, change directory to the root of your webapp, and run 
    `ilib-scanner` with the following options:
    
    ```
    ilib-scanner --assembly=assembled --locales=en-US,fr-FR --compilation=compiled ilib-include.js
    ```
    
    The "assembly" parameter can have the value of either "assembled" and "dynamicdata". Default is
    "assembled". "Assembled" means that all of the locale data is incorporated into the ilib file
    and therefore you can use any ilib class synchronously for the locale you have chosen. "Dynamicdata"
    means that the locale data goes into separate files for each locale which are loaded dynamically 
    when needed. Assembled ilib can be faster to load (less network back-and-forths) and classes can
    be instantiated synchronously, but the your webpack file can have a huge footprint. Dynamicdata
    solves the size problem at the expense of a little extra time to load the appropriate locale
    data.
    
    The value of the locales parameter is a comma-separated list of locales that your app needs
    to support. In our example, this is en-US for English/US and fr-FR for French/France. The locales
    should be given in BCP-47 format.
    
    The "compilation" parameter is one of "compiled" or "uncompiled". "Compiled" means that code is
    run through uglify first to compress/compile it, whereas "uncompiled" mean that the code
    is not modified before it is used in the webpack bundle. Use "uncompiled" if you need to debug
    things, and "compiled" otherwise to minimize the footprint and network transfer time.
    
    You must give the path to the metafile file you would like to generate. In this
    example, that is "ilib-include.js". The scanner will fill this file with explicit "require"
    calls for any ilib class your code uses.
    
    Optionally you can follow the metafile name with a list of the paths to you would like to scan.
    Without those explicit paths, the default is to recursively scan the current directory looking for js
    and html files.
    
    When the tool is done, the new files are generated in the same path that you gave to
    the metafile. So for example, if you gave the metafile path output/js/ilib-include.js, then
    the output files will be output/js/ilib-include.js and output/js/webpack.config.js.

1. Examine the webpack.config.js file to make sure the settings are appropriate. You can do things
   like change the name of the ilib output file (`output.filename` property) if desired. It should
   be set up to generate a file called ilib.js properly already, so you don't have to modify
   anything.

   If you have requested a dynamicdata build, you must make sure the `output.publicPath`
   property is set to the directory part of the URL where webpack can load the locale data
   files. For example, if you put ilib and the locale data files underneath
   "http://www.mycompany.com/scripts/js/ilib.js", then set the publicPath property to "/scripts/js/".
   Webpack uses XHR requests to the server where it loaded ilib.js from in order to load the
   corresponding locale data files under the path given in the publicPath directory.

1. Run "webpack" in the dir with the new webpack.config.js in it. It will churn for a while and
   then spit out files in the path
   named in the webpack.config.js. By default, the file name is "ilib.js".

1. Update your html files to include the new custom build of ilib with a standard script tag:

    ```html
    <script src="/path/to/ilib.js"></script>
    <script>
       // All of the classes have been copied to the global scope here, so
       // you can just start using them:
       new DateFmt({
           locale: "fr-FR",
           sync: false,
           onLoad: function(df) {
               alert("Aujourd'hui, c'est " + df.format(new Date()));
           }
       });
    </script>
    ```

Et voila. You are done.

Note that ilib automatically copies its public classes up to the global scope,
so you can just use them normally, not as a property of the "ilib" namespace.
If you used ilib 12.0 or earlier, this is the same as how it worked before, so
if you are upgrading to 13.0 or higher, you will probably
not need to change your code. If you don't want to pollute your global scope,
you can use all of the classes via the ilib namespace. Just remove the
require call for "ilib-unpack.js" in the generated metafile and rerun webpack.

Now upload the ilib.js (and for dynamicdata mode, all of the locale data
files as well) to your web server or check it in to your
repo so that it all gets published with the next push. We also recommend that
you check these files in to your source code control system.
