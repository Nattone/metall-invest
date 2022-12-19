const { resolve } = require('path')
const { sync } = require('glob')
// const fs = require('fs')
const CompressionPlugin = require('compression-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const BundleTracker = require('webpack-bundle-tracker')
const HandlebarsPlugin = require('handlebars-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const PATHS = {
  src: resolve(__dirname, 'src'),
  dist: resolve(__dirname, 'dist'),
}

// const PAGES_DIR = `${PATHS.src}/templates/`
// const PAGES = fs.readdirSync(PAGES_DIR).filter((fileName) => fileName.endsWith('.hbs'))

module.exports = (env = {}, argv = {}) => {
  const isProduction = argv.mode === 'production'

  const pagesEntries = sync('./src/pages/**/*').filter((file) => file.match(/.*\.(js|scss)$/))
  const componentsEntries = sync('./src/components/**/*').filter((file) => file.match(/.*\.(js|scss)$/))

  const config = {
    entry: {
      main: [
        'normalize.css',
        '~/index.js',
        '~/index.scss',
        ...componentsEntries,
        ...pagesEntries,
      ],
    },
    output: {
      filename: 'js/[name].js',
      path: PATHS.dist,
      publicPath: '',
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            name: 'vendor',
            chunks: 'all',
          },
        },
      },
      minimizer: [
        new TerserPlugin({
          extractComments: true,
          parallel: true,
        }),
      ],
      emitOnErrors: isProduction,
    },

    cache: {
      type: 'filesystem',
    },
    module: {
      rules: [
        // JS
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        },
        // Fonts
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          },
        },
        // Images
        {
          test: /\.(png|jpg|gif|svg)$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          },
        },
        // Styles
        {
          test: /\.(css|scss)$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: { esModule: false },
            },
            {
              loader: 'css-loader',
              options: { importLoaders: 1, url: false },
            },
            { loader: 'postcss-loader' },
            { loader: 'sass-loader' },
          ],
        },
      ],
    },
    plugins: [
      ...(isProduction ? [new CleanWebpackPlugin()] : []),

      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
      }),
      new HtmlWebpackPlugin({
        // the template you want to use
        template: resolve(__dirname, 'src/components/common/head.hbs'),
        // the output file name
        filename: resolve(__dirname, 'dist/_head.hbs'),
        inject: 'head',
        hash: true,
        minify: false,
      }),

      new CopyWebpackPlugin({
        patterns: [
          { from: `${PATHS.src}/img`, to: 'img' },
          // { from: `${PATHS.src}/mocks`, to: 'mocks' },
          // { from: `${PATHS.src}/fonts`, to: 'assets/fonts' },
          // { from: `${PATHS.src}/static`, to: '' },
        ],
      }),

      new HandlebarsPlugin({
        // path to hbs entry file(s). Also supports nested directories if write path.join(process.cwd(), "app", "src", "**", "*.hbs"),
        entry: resolve(__dirname, 'src/pages/*/index.hbs'),
        // output path and filename(s). This should lie within the webpacks output-folder
        // if ommited, the input filepath stripped of its extension will be used
        output: resolve(__dirname, 'dist/[path].html'),
        // you can also add a [path] variable, which will emit the files with their relative path, like
        // output: resolve(__dirname, "build", [path], "[name].html"),

        // data passed to main hbs template: `main-template(data)`
        // data: require("./app/data/project.json"),
        // or add it as filepath to rebuild data on change using webpack-dev-server
        // data: resolve(__dirname, 'src/data/app.json'),
        data: resolve(__dirname, 'src/data.json'),

        // globbed path to partials, where folder/filename is unique
        partials: [resolve(__dirname, 'html/*/*.hbs'), resolve(__dirname, 'src/components/*/*.hbs')],

        // register custom helpers. May be either a function or a glob-pattern
        helpers: {
          projectHelpers: resolve(__dirname, 'src/helpers/*.helper.js'),
        },

        // hooks
        // getTargetFilepath: function (filepath, outputTemplate) {},
        // getPartialId: function (filePath) {}
        // onBeforeSetup: function (Handlebars) {},
        // onBeforeAddPartials: function (Handlebars, partialsMap) {},
        // onBeforeCompile: function (Handlebars, templateContent) {},
        // onBeforeRender: function (Handlebars, data, filename) {},
        // onBeforeSave: function (Handlebars, resultHtml, filename) {},
        // onDone: function (Handlebars, filename) {},

        htmlWebpackPlugin: {
          enabled: true, // register all partials from html-webpack-plugin, defaults to `false`
          prefix: 'html', // where to look for htmlWebpackPlugin output. default is "html"
        },
      }),

      new BundleTracker({
        path: './',
        filename: 'webpack-bundle-tracker.json',
      }),

      ...(isProduction ? [new CompressionPlugin({ test: /\.(js|css)$/i })] : []),
    ],
    resolve: {
      alias: {
        '~': PATHS.src,
      },
      extensions: ['.js'],
      modules: ['node_modules'],
    },
    devServer: {
      port: 8080,
      historyApiFallback: false,
      allowedHosts: 'all',
      hot: false,
      watchFiles: ['src/**/*'],
      client: {
        // progress: true,
        overlay: {
          errors: true,
          warnings: false,
        },
      },
    },
  }

  return config
}
