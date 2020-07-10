module.exports = {
    webpack: {
      alias: {
        "react-dom": "@hot-loader/react-dom"
      },
      plugins: []
    },
    plugins: [
      { plugin: require("craco-plugin-react-hot-reload") },
      { plugin: require("craco-cesium")() }
    ],
    options: {
      loadPartially: true
    }
  };