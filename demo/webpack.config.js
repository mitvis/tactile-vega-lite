const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
    main: './src/index.tsx',
    ...generateEntryPoints(), // Include dynamically found entries
  },

  module: {
    rules: [
      {
        test: /\.tsx$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-solid', '@babel/preset-typescript'],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.ts$/,
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
    mainFields: ['main', 'module'], // Prefer CJS over ESM
    alias: {
      'tactile-vega-lite': path.resolve(__dirname, '../lib/dist/index.js'),
    },
    fallback: {
      stream: false, // PapaParse tries to use stream but we don't need it for browser
    },
  },


  output: {
    filename: '[name].[contenthash].bundle.js', // Ensure unique filenames
    path: path.resolve(__dirname, 'dist'), // output path
    publicPath: process.env.NODE_ENV === 'production' ? '/tactile-vega-lite/' : '/', // public path
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
