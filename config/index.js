'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {
    env: require('./dev.env'),
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api/dc': {
        target: 'http://192.168.10.145:80',
        changeOrigin: true,
        pathRewrite: {
          '^/api/dc': '/api/dc'
        }
      },
      '/api/activity': {
        target: 'http://192.168.10.128:8085',
        changeOrigin: true,
        pathRewrite: {
          '^/api/activity': '/api/activity'
        }
      },
      '/api/portalCore': {
        target: 'http://192.168.10.202:8088',
        // target: 'http://192.168.10.128:8088',
        // target: 'http://192.168.3.111:8081',
        changeOrigin: true,
        pathRewrite: {
          '^/api/portalCore': '/api/portalCore'
        }
      },
      '/api/pay': {
        target: 'http://192.168.10.145:8089',
        changeOrigin: true,
        pathRewrite: {
          '^/api/pay': '/api/pay'
        }
      },
      '/api/dealer': {
        target: 'http://192.168.10.101:8899',
        // target: 'http://192.168.10.123:8899',
        changeOrigin: true,
        pathRewrite: {
          '^/api/dealer': '/api/dealer'
        }
      },
      '/api/help': {
        target: 'http://192.168.10.144:8887',
        changeOrigin: true,
        pathRewrite: {
          '^/api/help': 'api/help'
        }
      },
      '/starhome': {
        target: 'http://www.starhome.vip/index.php?route=product/product&path=60&product_id=52',
        changeOrigin: true,
        pathRewrite: {
          '^/starhome': 'http://www.starhome.vip/index.php?route=product/product&path=60&product_id=52'
        }
      },
      '/facebook': {
        target: 'https://www.facebook.com/StarHome.vip',
        changeOrigin: true,
        pathRewrite: {
          '^/facebook': 'https://www.facebook.com/StarHome.vip'
        }
      }
    },

    // Various Dev Server settings
    host: '192.168.3.181', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
