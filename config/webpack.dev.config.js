const merge = require('webpack-merge')
const webpackBaseConfig = require('./webpack.base.config')

module.exports = merge(webpackBaseConfig, {
  mode: 'development',
  devServer: {
    host: '0.0.0.0',
    inline: true,
    hot: true,
    port: 3010,
    open: true,
    noInfo: true
  },
})
