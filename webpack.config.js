/**
 * Created by A ciTy on 2019/1/5.
 */

const webpack = require('webpack'),
  path = require('path'),
  HTMLPlugin = require('html-webpack-plugin');
//  CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const config = {

  entry: {
    app: path.join(__dirname, '/src', 'index.js')
  },

  cache: true,

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        // exclude: /node_modules\/(?!(@gw)$\/).*/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workerParallelJobs: 50,
              poolTimeout: 2000,
              // 池(pool)分配给 worker 的工作数量
              poolParallelJobs: 50,
              poolRespawn: process.env.NODE_ENV === 'production'
            }
          },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
            /* options: {
                    cacheDirectory: true,
                    presets: [
                        [
                            '@babel/env',
                            { modules: false }
                        ],
                        '@babel/react'
                    ],
                    plugins: [
                        '@babel/plugin-transform-runtime',
                        '@babel/plugin-syntax-dynamic-import',
                        '@babel/plugin-proposal-optional-chaining',
                        'react-hot-loader/babel',
                        'transform-class-properties',
                        ['import', {
                            libraryName: 'antd',
                            style: true
                        }]
                    ]
                } */
          }
          // your expensive loader (e.g babel-loader)
        ]
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader'
      },
      {
        test: /\b[a-z_/]+\.(scss)$/,
        exclude: [
          /assets/, /global/, path.resolve(__dirname, './src/ui/src')
        ],
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[path][name]-[local]'
              }
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true
              }
              /* modifyVars: {
                  ...darkTheme,
                  hack: `true;@import "${require.resolve(path.resolve(__dirname, './assets/css/antd_theme.less'))}";`
              }, */
              // getThemeVariables({
              //     dark: true // 开启暗黑模式
              // }),
            }
          }
        ]
      },
      {
        test: /\b[a-z_/]+\.(scss)$/,
        include: [
          /assets/, /global/, path.resolve(__dirname, './src/ui/src')
        ],
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|woff|woff2|eot|ttf|mp3|mp4)$/,
        include: [
          /components/, /assets/, /style/
        ],
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              esModule: false
            }
          }
        ],
        type: 'javascript/auto'
      },
      {
        test: /\.ttf$/,
        include: /monaco-editor/,
        use: ['file-loader']
      },
      {
        // 3. 其他所有 SVG（不带 ?react/?inline）用 asset/inline 处理
        test: /\.svg$/i,
        type: 'asset/inline',
        resourceQuery: { 
            not: [/react/, /inline/] // 排除带 ?react 或 ?inline 的情况
        }
      }
    ]
  },

  plugins: [
    //  new CaseSensitivePathsPlugin({
    //      debug: false
    //  }),
    new HTMLPlugin({
      template: path.resolve(__dirname, './index.html'),
      hash:true
    })
  ],

  optimization: {
    runtimeChunk: {
      name: 'manifest'
    },
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'initial'
        }
      }
    }
  },
  // externals: {
  //   react: 'React',
  //   'react-dom': 'ReactDOM',
  //   antd: 'antd',
  //   '@ant-design/icons': 'icons'
  // },
  resolve: {
    // 如果引入的文件没有后缀名
    extensions: ['.jsx', '.js', '.tsx', '.ts'],
    fallback: {
      path: false
    }
  }

};

module.exports = config;
