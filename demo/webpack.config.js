const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

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
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'], // resolve these extensions
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
      title: 'Tactile Vega Lite Demo',
      template: 'src/index.html',
    }),
    ...generateHtmlPlugins(), // Dynamically generated HTML plugins
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'node_modules/tactile-vega-lite/dist/worker.min.js'),
          to: 'worker.js'
        },
        {
          from: path.resolve(__dirname, 'node_modules/tactile-vega-lite/dist/lib'),
          to: 'lib'
        }
      ]
    })
  ],

  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },

};
