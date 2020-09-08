const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require('path');

const cesiumSource = "node_modules/cesium/Source";
const cesiumWorkers = "../Build/Cesium/Workers";
const cesiumPath = ''

module.exports = {
    webpack: {
      alias: {
        "react-dom": "@hot-loader/react-dom"
      },
      plugins: [
        new BundleAnalyzerPlugin()
      ]
    },
    plugins: [
      { plugin: require("craco-plugin-react-hot-reload") },
      { plugin: require("craco-cesium")() }
    ],

  };