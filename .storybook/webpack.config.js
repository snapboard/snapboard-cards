const path = require('path');

// Export a function. Accept the base config as the only param.
module.exports = async ({ config, mode }) => {
  // Make whatever fine-grained changes you need
  config.module.rules.push({
    test: /\.ya?ml/,
    use: ['raw-loader'],
  });

  // Change CSS to raw loader
  config.module.rules[2].use = ['raw-loader']

  // console.log(config)

  // Return the altered config
  return config;
};