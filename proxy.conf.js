const PROXY_CONFIG = {
  '**/v1/**': {
    target: 'http://localhost:8080',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: { '^/v1': '/v1' },
  },
  '/subscription/socket': {
    target: 'ws://localhost:8080',
    secure: false,
    ws: true,
    changeOrigin: true,
    logLevel: 'debug',
  },
  '/repos/SyncVizion/card-market-ui/issues': {
    target: 'https://api.github.com',
    secure: true,
    changeOrigin: true,
    logLevel: 'debug',
  },
  '/graphql': {
    target: 'https://api.github.com',
    secure: true,
    changeOrigin: true,
    logLevel: 'debug',
  },
};

module.exports = PROXY_CONFIG;
