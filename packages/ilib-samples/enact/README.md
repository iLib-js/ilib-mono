
### Enact Development Setup

* Enact CLI development Tool
reference : https://enactjs.com/docs/tutorials/setup/

```
npm install -g @enact/cli
```
* Available npm Tasks
npm tasks vary by package and are defined within a scripts object in the package.json file. 

  * `npm run serve`  - Packages and hosts the app on a local http server using webpack-dev-server. Supports hot module replacement and inline updates as the source code changes.
  * `npm run pack` - Packages the app into ./dist in development mode (unminified code, with any applicable development code).
  * `npm run pack-p` - Packages the app into ./dist in production mode (minified code, with development code dropped).
  * `npm run clean` - Deletes the ./dist directory

### i18n (internationalization)
* https://enactjs.com/docs/developer-guide/i18n/
* i18n library : https://enactjs.com/docs/modules/i18n/$L/

### Reference
* [Enact CLI Development Tool](https://enactjs.com/docs/developer-tools/cli/)