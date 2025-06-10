const baseConfig = require('../../jest.config.js');

const config = {
    ...baseConfig,
    displayName: {
        name: "tmxtool",
        color: "magentaBright",
    }
}


module.exports = config;

