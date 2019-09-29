const path = require('path');

// Export a function. Accept the base config as the only param.
module.exports = async ({ config }) => {

  config.module.rules[0].exclude = /(node_modules|dist)/

  return config;
};