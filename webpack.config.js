module.exports = (env = {}, argv = {}) => {
  const production = argv.mode === 'production';
  const analyze = argv.test === 'analyze';
  const serving = Boolean(env.WEBPACK_SERVE);

  const config = require('./build.config.js');
  const packageJson = require('./package.json');

  const fs = require('fs');
  const path = require('path');
  const webpack = require('webpack');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const MiniCssExtractPlugin = require('mini-css-extract-plugin');
  const {VueLoaderPlugin} = require('vue-loader');
  const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
  const autoprefixer = require('autoprefixer');
  const cssnano = require('cssnano');
  const {simpleGit} = require('simple-git');

  const publicPath = (config.dir || './build') + '/';
  const resultPath = path.resolve(__dirname, '..' + publicPath);
  const port = require('portfinder-sync').getPort(8080);
  const developmentUrl = 'https://localhost:' + port + '/';

  class StaticCopyPlugin {
    constructor (sourceDirectory) {
      this.sourceDirectory = sourceDirectory;
    }

    apply (compiler) {
      compiler.hooks.emit.tapAsync('StaticCopyPlugin', (compilation, callback) => {
        const sourceRoot = path.resolve(__dirname, this.sourceDirectory);
        if (!fs.existsSync(sourceRoot)) {
          callback();
          return;
        }

        const addDirectory = (directory) => {
          fs.readdirSync(directory, {withFileTypes: true}).forEach(entry => {
            const absolutePath = path.join(directory, entry.name);
            if (entry.isDirectory()) {
              addDirectory(absolutePath);
              return;
            }

            const relativePath = path.relative(sourceRoot, absolutePath).split(path.sep).join('/');
            const content = fs.readFileSync(absolutePath);
            compilation.assets[relativePath] = {
              source: () => content,
              size: () => content.length
            };
          });
        };

        addDirectory(sourceRoot);
        callback();
      });
    }
  }

  class CleanOutputPlugin {
    constructor (outputDirectory) {
      this.outputDirectory = outputDirectory;
    }

    apply (compiler) {
      compiler.hooks.beforeRun.tap('CleanOutputPlugin', () => {
        if (!fs.existsSync(this.outputDirectory)) {
          return;
        }

        fs.readdirSync(this.outputDirectory).forEach(item => {
          fs.rmSync(path.join(this.outputDirectory, item), {recursive: true, force: true});
        });
      });
    }
  }

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
  const devServer = {
    allowedHosts: 'all',
    port,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  };

  if (serving) {
    devServer.server = {
      type: 'https',
      options: {
        key: fs.readFileSync(path.resolve(__dirname, '.cert/localhost-key.pem')),
        cert: fs.readFileSync(path.resolve(__dirname, '.cert/localhost.pem'))
      }
    };
  }

  return {
    entry: {
      app: './src/index.js',
      polyfill: ['core-js/stable', 'regenerator-runtime/runtime']
    },
    optimization: {
      splitChunks: {
        chunks (chunk) {
        }
      }
    },
    performance: {
      maxEntrypointSize: 1024000,
      maxAssetSize: 512000
    },
    output: {
      filename: '[name].js',
      chunkFilename: '[name].[hash].js',
      path: production ? resultPath : '/',
      publicPath: production ? publicPath : developmentUrl,
      futureEmitAssets: true
    },
    devtool: production ? false : 'inline-source-map',
    devServer,
    plugins: [].concat(
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css'
      }),
      new StaticCopyPlugin('static'),
      new VueLoaderPlugin(),
      new webpack.DefinePlugin({
        'DIR': JSON.stringify(production ? config.dir + '/' : developmentUrl),
        'PRODUCTION': production,
        'VERSION': JSON.stringify(packageJson.version)
      }),
      production ? [] : htmlPlugins,
      analyze ? new BundleAnalyzerPlugin() : [],
      production ? new CleanOutputPlugin(resultPath) : [],
      production ? {
        apply: (compiler) => {
          compiler.hooks.done.tap('Git', () => {
            simpleGit('../').add('.' + publicPath + '*');
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
        use: 'pug-html-loader'
      }, production ? {
        test: /\.js?$/,
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
            postcssOptions: {
              plugins: production
                ? [autoprefixer({remove: false}), cssnano({preset: ['default', {zindex: false}]})]
                : []
            }
          }
        }, {
          loader: 'resolve-url-loader',
          options: {
            sourceMap: production
          }
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: production
          }
        }]
      }, {
        test: /icons.+\.svg$/,
        use: [{
          loader: 'svg-sprite-loader',
          options: {}
        }]
      }, {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            outputPath: 'img/',
            name: '[name].[ext]',
            publicPath: './img'
          }
        }]
      }, {
        test: /font.+\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            outputPath: 'fonts/',
            name: '[name].[ext]',
            publicPath: './fonts'
          }
        }]
      }]
    }
  };
};
