const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const { CleanPlugin } = require('webpack');


module.exports = {
  mode: 'development',
  cache: true,
  entry: {
    main: './src/index.ts',
    simple_bar: './src/simple_bar/index.ts',
    grouped_bar: './src/grouped_bar/index.ts',
    multi_line: './src/multi_line/index.ts',
    scatter_hist: './src/scatter_hist/index.ts',
    free_form: './src/free_form/index.ts'
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      // [FONT]
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'], // resolve these extensions
    fallback: {
      "path": require.resolve("path-browserify"),
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "buffer": require.resolve("buffer/"),
      "fs": false,
    },
  },


  output: {
    // filename: 'bundle.js', // the output bundle name
    filename: '[name].[contenthash].bundle.js', // Ensure unique filenames
    path: path.resolve(__dirname, 'dist'), // output path
    publicPath: '/', // public path
    clean: true, // Clean the output directory before emit
  },


  devtool: 'inline-source-map', // enable sourcemaps for debugging
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Serve files from the dist directory
    },
    compress: true, // Enable gzip compression
    port: 9000, // Default to port 9000
  },
  plugins: [
    new MonacoWebpackPlugin({
      languages: ['json'],
    }),
    new HtmlWebpackPlugin({
      title: 'Tactile Vega Lite',
      template: 'src/index.html',
    }),
    new HtmlWebpackPlugin({
      template: './src/simple_bar/index.html',
      filename: 'simple_bar/index.html',
      chunks: ['simple_bar'],
    }),
    new HtmlWebpackPlugin({
      template: './src/grouped_bar/index.html',
      filename: 'grouped_bar/index.html',
      chunks: ['grouped_bar'],
    }),
    new HtmlWebpackPlugin({
      template: './src/multi_line/index.html',
      filename: 'multi_line/index.html',
      chunks: ['multi_line'],
    }),
    new HtmlWebpackPlugin({
      template: './src/scatter_hist/index.html',
      filename: 'scatter_hist/index.html',
      chunks: ['scatter_hist'],
    }),
    new HtmlWebpackPlugin({
      template: './src/free_form/index.html',
      filename: 'free_form/index.html',
      chunks: ['free_form'],
    }),
    new CopyPlugin({
      patterns: [
        { from: 'src/worker.js', to: 'worker.js' },
        { from: 'node_modules/liblouis-build/build-no-tables-utf32.js', to: 'lib/' },
        { from: 'node_modules/liblouis-build/build-no-tables-utf16.js', to: 'lib/' },
        { from: 'node_modules/liblouis/easy-api.js', to: 'lib/' },
        { from: 'node_modules/liblouis-build/tables/', to: 'lib/tables/' },
      ],
    }),
  ],
  externals: {
    // Exclude liblouis from bundling
    // 'liblouis-build': 'commonjs liblouis-build',
    // 'liblouis/easy-api': 'commonjs liblouis/easy-api',
    // 'liblouis/capi.js': 'commonjs liblouis/capi.js',
  },

};
