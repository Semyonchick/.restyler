module.exports = (env, argv) => {
  const production = argv.mode === 'production'

  const config = require(production ? './config.prod.json' : './config.dev.json')
  const packageJson = require('./package.json')

  const path = require('path')
  const webpack = require('webpack')
  const resultPath = path.resolve(__dirname, config.dir)
  const MiniCssExtractPlugin = require('mini-css-extract-plugin')
  const CleanWebpackPlugin = require('clean-webpack-plugin')
  const LiveReloadPlugin = require('webpack-livereload-plugin')
  const CopyWebpackPlugin = require('copy-webpack-plugin')
  const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')
  const WebpackFtpUpload = require('webpack-ftp-upload-plugin')
  const autoprefixer = require('autoprefixer')
  const cssnano = require('cssnano')
  const {VueLoaderPlugin} = require('vue-loader')

  return {
    output: {
      filename: 'app.js',
      path: resultPath,
      publicPath: '/'
    },
    devtool: argv.mode === 'production' ? false : 'inline-source-map',
    plugins: [].concat(new MiniCssExtractPlugin({filename: 'app.css'}),
      new CopyWebpackPlugin([{from: 'static', to: '.'}]),
      new SpriteLoaderPlugin({plainSprite: true}),
      new LiveReloadPlugin({delay: 100}),
      new VueLoaderPlugin(),
      new webpack.DefinePlugin({
        'DIR': config.dir,
        'PRODUCTION': JSON.stringify(production),
        'VERSION': JSON.stringify(packageJson.version)
      }),
      !production && config.ftp ? new WebpackFtpUpload(Object.assign({
        local: resultPath
      }, config.ftp)) : [],
      production ? new CleanWebpackPlugin([resultPath + '/*'], {allowExternal: true}) : []
    ),
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.esm.js'
      }
    },
    module: {
      rules: [{
        test: /\.vue$/,
        loader: 'vue-loader'
      }, {
        test: /\.s?css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', {
          loader: 'postcss-loader',
          options: {
            plugins: production ? [autoprefixer, cssnano] : []
          }
        }, {
          loader: 'fast-sass-loader',
          options: {
            sourceMap: true
          }
        }]
      }, {
        test: /icons.+\.svg$/,
        use: [].concat({
            loader: 'svg-sprite-loader',
            options: {
              // spriteModule: {},
              extract: true
            }
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
            options: {}
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
  }
}