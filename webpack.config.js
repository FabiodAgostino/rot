const path = require('path');

module.exports = {
  // ... altre impostazioni di configurazione ...

  resolve: {
    fallback: {
      timers: require.resolve('timers-browserify')
    }
  }
};