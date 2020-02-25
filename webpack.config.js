module.exports = (env, argv) => {
  const production = argv.mode === 'production';
  const analyze = argv.test === 'analyze';

  const config = require('./build.config.js');
  const packageJson = require('./package.json');

  const path = require('path');
  const webpack = require('webpack');
  const publicPath = (config.dir || './build') + '/';
  const resultPath = path.resolve(__dirname, '..' + publicPath);
  const MiniCssExtractPlugin = require('mini-css-extract-plugin');
  const CleanWebpackPlugin = require('clean-webpack-plugin');
  const CopyWebpackPlugin = require('copy-webpack-plugin');
  // const WebpackFtpUpload = require('webpack-ftp-upload-plugin')
  const autoprefixer = require('autoprefixer');
  const cssnano = require('cssnano')({zindex: false});
  const {VueLoaderPlugin} = require('vue-loader');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const fs = require('fs');
  const port = require('portfinder-sync').getPort(8080);

  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

  //MultiPage
  function generateHtmlPlugins (templateDir) {
    const templates = fs.readdirSync(path.resolve(__dirname, templateDir));
    return templates.map(item => {
      const parts = item.split('.');
      const name = parts[0];
      const extension = parts[1];
      return new HtmlWebpackPlugin({
        filename: `${name}.html`,
        template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`)
      });
    });
  }

  const htmlPlugins = generateHtmlPlugins('./src/templates/page');

  return {
    entry: {
      app: './src/index.js',
      polyfill: ['babel-polyfill']
    },
    optimization: {
      // minimizer: [new UglifyJsPlugin()],
      splitChunks: {
        chunks (chunk) {
        }        //   cacheGroups: {
        //     commons: {
        //       test: /[\\/]node_modules[\\/]/,
        //       name: 'vendors',
        //       chunks: 'all'
        //     }
        //   }
      }
    },
    performance: {
      maxEntrypointSize: 1024000,
      maxAssetSize: 512000
    },
    output: {
      filename: '[name].js',
      chunkFilename: '[name].[hash].js',
      // filename: 'app.js',
      // chunkFilename: '[name].js',
      path: production ? resultPath : '/',
      publicPath: production ? publicPath : '//localhost:' + port + '/',
      // library: 'rere',
      futureEmitAssets: true
    },
    devtool: production ? false : 'inline-source-map',
    devServer: {
      disableHostCheck: true,
      https: true,
      port: port,
      // before (app) {
      //   app.post('*', (req, res) => {
      //     res.redirect(req.originalUrl);
      //   });
      // },
      headers: {
        'Access-Control-Allow-Origin': 'localhost:' + port,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
      }
    },
    plugins: [].concat(
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css'
      }),
      new CopyWebpackPlugin([{from: 'static', to: '.'}]),
      new VueLoaderPlugin(),
      new webpack.DefinePlugin({
        'DIR': JSON.stringify(production ? config.dir + '/' : '//localhost:' + port + '/'),
        'PRODUCTION': production,
        'VERSION': JSON.stringify(packageJson.version)
      }),
      production ? [] : htmlPlugins,
      analyze ? new BundleAnalyzerPlugin() : [],
      production ? new CleanWebpackPlugin([resultPath + '/*'], {allowExternal: true, beforeEmit: true}) : [],
      production ? {
        apply: (compiler) => {
          compiler.hooks.done.tap('Git', (compilation) => {
            const simpleGit = require('simple-git')('../');
            simpleGit.add('.' + publicPath + '*');
            return true;
          });
        }
      } : []
    ),
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.esm.js'
      }
    },
    module: {
      rules: [{
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            js: 'babel-loader',
            scss: 'sass-loader',
            options: {
              sourceMap: !production
            }
          }
        }
      }, {
        test: /\.pug$/,
        use: 'pug-loader'
      }, production ? {
        test: /\.js?$/,
        // exclude: /(node_modules)/,
        loader: 'babel-loader',
        options: {
          sourceMap: !production
        }
      } : {}, {
        test: /\.s?css$/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
          options: {}
        }, {
          loader: 'css-loader',
          options: {
            sourceMap: !production
          }
        }, {
          loader: 'postcss-loader',
          options: {
            sourceMap: production ? false : 'inline',
            plugins: production ? [autoprefixer({remove: false}), cssnano] : []
          }
        }, {
          loader: 'resolve-url-loader',
          options: {
            sourceMap: production
          }
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: production,
            sourceMapContents: false
          }
        }]
      }, {
        test: /icons.+\.svg$/,
        use: [].concat({
            loader: 'svg-sprite-loader',
            options: {}
          },
          'svg-fill-loader',
          production ? {
            loader: 'image-webpack-loader'
          } : [])
      }, {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        use: [].concat({
            loader: 'file-loader',
            options: {
              outputPath: 'img/',
              name: '[name].[ext]',
              publicPath: './img'
            }
          },
          production ? [{
            loader: 'image-webpack-loader',
            options: {
              disable: true
            }
          }] : [])
      }, {
        test: /font.+\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'fonts/',
              name: '[name].[ext]',
              publicPath: './fonts'
            }
          }
        ]
      }]
    }
  };
};