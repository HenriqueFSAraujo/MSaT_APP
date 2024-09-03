const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process': { 
        // Here you can set your env variables.
        ...process
        // SERVER_URL: JSON.stringify(process.env.SERVER_URL)
      }
    })
  ]
}