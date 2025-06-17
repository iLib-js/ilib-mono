const baseConfig = require('../../jest.config.js');

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-csv",
        color: "red",
    }
}


module.exports = config;

