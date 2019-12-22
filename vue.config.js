var webpack =require('webpack');
module.exports = {

    publicPath: './',
    configureWebpack: {
      plugins: [
        new webpack.ProvidePlugin({
           zrender:"zrender",
          "windows.zrender":"zrender"
        })
      ]
    },
  
    lintOnSave: undefined
  }
  