const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
  },
  chainWebpack: (config) => {
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
    if (process.env.NODE_ENV === 'development') {
      config.plugins.delete('eslint')
    }
  },
  lintOnSave: false,
  devServer: {
    port: 8080,
    hot: true,
    compress: true,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_API_URL || 'http://172.18.128.1:80',
        changeOrigin: true,
        secure: false,
      },
      '/login': {
        target: process.env.VUE_APP_API_URL || 'http://172.18.128.1:80',
        changeOrigin: true,
        secure: false,
        bypass: (req) => {
          if (req.method === 'GET' && req.headers.accept && req.headers.accept.includes('text/html')) {
            return '/index.html'
          }
        },
      },
      '/register': {
        target: process.env.VUE_APP_API_URL || 'http://172.18.128.1:80',
        changeOrigin: true,
        secure: false,
        bypass: (req) => {
          if (req.method === 'GET' && req.headers.accept && req.headers.accept.includes('text/html')) {
            return '/index.html'
          }
        },
      },
      '/logout': {
        target: process.env.VUE_APP_API_URL || 'http://172.18.128.1:80',
        changeOrigin: true,
        secure: false,
        bypass: (req) => {
          if (req.method === 'GET' && req.headers.accept && req.headers.accept.includes('text/html')) {
            return '/index.html'
          }
        },
      },
    },
  },
})
