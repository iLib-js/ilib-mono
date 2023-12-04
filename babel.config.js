module.exports = {
    "presets": [[
      "@babel/preset-env", {
         "targets": {
            "node": "current",
            "browsers": "cover 99.5%"
         }
      }
   ]],
   "plugins": ["add-module-exports"]
};
