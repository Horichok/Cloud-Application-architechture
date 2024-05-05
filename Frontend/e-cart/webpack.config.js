// webpack.config.js
// webpack.config.js

const path = require('path');

module.exports = {
  // other webpack configuration options...

  resolve: {
    fallback: {
      vm: require.resolve('vm-browserify'),
      crypto: require.resolve('crypto-browserify')
    }
  }
};

