const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

const cesiumPath = 'cesium'

module.exports = {
    webpack: {
      alias: {
        "react-dom": "@hot-loader/react-dom"
      },
      configure: (webpackConfig, { env, paths }) => {
        webpackConfig.module = {
          ...webpackConfig.module,
          unknownContextCritical: false
        }
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          splitChunks: {
            cacheGroups: {
              commons: {
                  test: /[\\/]node_modules[\\/]cesium/,
                  name: 'CesiumBundle',
                  chunks: 'all',
                  minChunks: 2
              }
            }
          }
        }

        return webpackConfig
      }
    },
    plugins: [
      { plugin: require("craco-plugin-react-hot-reload") },
      { plugin: require("craco-cesium")({loadPartially:true, cesiumPath: '/cesium'}) }
    ],

  };