
const config = require('../webpack.config.js'),
    path = require('path');

// 处理打包配置
config.mode = 'production';

config.output = {
    path: path.join(process.cwd(), 'dist'),
    filename: '[name].js',
    publicPath: './'
};

config.optimization = {
    splitChunks: {
        cacheGroups: {
            vendors: {
                name: 'chunk-vendors',
                test: /[\\/]node_modules[\\/]/,
                priority: 10,
                chunks: 'all',
                minChunks: 1
            },
            common: {
                name: 'chunk-common',
                test: function (module) {
                    if (!module.resource) {
                        return false;
                    }

                    if (module.resource.includes(`src${path.sep}common`)) {
                        return true;
                    }

                    return false;
                },
                minChunks: 1,
                priority: 20,
                chunks: 'initial',
                reuseExistingChunk: true
            }
        }
    }
};

module.exports = config;
