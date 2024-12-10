const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const fs = require('fs');

// Dynamically generate entry points for examples
const generateEntryPoints = () => {
  const srcPath = path.resolve(__dirname, 'src');
  const dirs = fs.readdirSync(srcPath).filter(dir =>
    fs.existsSync(path.join(srcPath, dir, 'index.ts'))
  );
  const entry = {};
  dirs.forEach(dir => {
    entry[dir] = path.join(srcPath, dir, 'index.ts');
  });
  return entry;
};

// Generate HtmlWebpackPlugin instances dynamically
const generateHtmlPlugins = () => {
  const srcPath = path.resolve(__dirname, 'src');
  const dirs = fs.readdirSync(srcPath).filter(dir =>
    fs.existsSync(path.join(srcPath, dir, 'index.html'))
  );
  return dirs.map(dir =>
    new HtmlWebpackPlugin({
      template: `src/${dir}/index.html`,
      filename: `${dir}/index.html`,
      chunks: [dir],
    })
  );
};

module.exports = {
  mode: 'development',
  cache: true,
  entry: {
    main: './src/index.ts',
    ...generateEntryPoints(), // Include dynamically found entries
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
    ...generateHtmlPlugins(), // Dynamically generated HTML plugins
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

  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },

};
