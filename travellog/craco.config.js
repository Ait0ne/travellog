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
        webpackConfig.plugins.push(
          new CopyWebpackPlugin([{ from: 'node_modules/cesium/Build/Cesium/Workers', to:  path.join(cesiumPath, "Workers") }]),
          new CopyWebpackPlugin([{ from: 'node_modules/cesium/Build/Cesium/ThirdParty', to:  path.join(cesiumPath, "ThirdParty") }]),
          new CopyWebpackPlugin([{ from: 'node_modules/cesium/Build/Cesium/Assets', to:  path.join(cesiumPath, "Assets") }]),
          new CopyWebpackPlugin([{ from: 'node_modules/cesium/Build/Cesium/Widgets', to:  path.join(cesiumPath, "Widgets") }]),
        )

        return webpackConfig
      }
    },
    plugins: [
      { plugin: require("craco-plugin-react-hot-reload") },
      { plugin: require("craco-cesium")({loadPartially:true}) }
    ],

  };