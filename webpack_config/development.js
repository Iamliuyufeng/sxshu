/**
 * Created by A ciTy on 2017/3/29.
 */

const config = require('../webpack.config.js')
const ESLintPlugin = require('eslint-webpack-plugin')
const fs = require('fs')

config.mode = 'development'
const proxyTarget = 'dev' // 枚举范围：targetMap的key

const targetMap = {
  dev: {
    url: 'https://10.10.3.12:4999'
  },
  test: {
    url: 'https://10.10.3.13:4999',
    key: fs.readFileSync('./pfx/om_1825849177586352128_server.key'),
    cert: fs.readFileSync('./pfx/om_1825849177586352128_server.crt')
  },
  iphmDev: {
    url: 'https://10.12.42.71:4999'
  },
  production: {
    url: 'https://10.10.0.28:4999'
  }
}

const getTarget = targetServer => {
  const urlObject = new URL(targetMap[targetServer].url)
  const target = {
    protocol: urlObject.protocol,
    host: urlObject.hostname,
    port: urlObject.port
  }

  targetMap[targetServer].key && (target.key = targetMap[targetServer].key)
  targetMap[targetServer].cert && (target.cert = targetMap[targetServer].cert)
  return target
}

const target = getTarget(proxyTarget)

// 处理webpack开发服务器

config.devServer = {
  historyApiFallback: true,
  disableHostCheck: true,
  https: {
    spdy: {
      protocols: ['http/1.1']
    }
  },
  proxy: {
    '/api': {
      target,
      secure: false
    },
    '/sjpd/service': {
      target: 'http://192.168.0.3:8000/',
      pathRewrite: { '^/sjpd/service': '' }
    },
    '/sjpd-node/api': {
      target: 'http://127.0.0.1:7080/',
      pathRewrite: { '^/sjpd-node': '' }
    },
    '/fe-static': {
      target,
      secure: false
    }
  },
  hot: true,
  stats: {
    assets: false,
    excludeAssets: 'img'
  }
}

// 处理打包方式

config.devtool = 'eval-cheap-module-source-map'

config.output = {
  filename: '[name].js',
  chunkFilename: '[name].chunk.js'
}

// config.plugins.push(
//   new ESLintPlugin({
//     fix: true,
//     threads: true,
//     extensions: ['js', 'jsx'],
//     eslintPath: require.resolve('eslint')
//   })
// );

module.exports = config
