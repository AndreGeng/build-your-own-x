const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  entry: {
    exampleWithVue: "./example-with-vue",
    exampleWithMiniVue: "./example-with-mini-vue",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js"
  },
  mode: "development",
  devtool: "cheap-module-source-map",
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 3002,
  },
  resolve: {
    extensions: [ '.js', '.vue' ],
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: [        
        path.resolve(__dirname, "node_modules"),
      ],
      use: [{
        loader: "babel-loader",
      }],
    }, {
      test: /\.p?css$/,
      exclude: [
        path.resolve(__dirname, "node_modules"),
      ],
      use: [ 
        "style-loader",
        {
          loader: "css-loader",
          options: {
            importLoaders: 1,
          },
        },
        "postcss-loader",
      ],
    }, {
      test: /\.vue$/,
      exclude: [
        path.resolve(__dirname, "node_modules"),
      ],
      use: [{
        loader: "vue-loader",
      }],
    }]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "ExampleWithVue",
      filename: "public/example-with-vue.html",
      chunks: ["exampleWithVue"],
      template: "./public/index.html",
    }),
    new HtmlWebpackPlugin({
      title: "ExampleWithMiniVue",
      filename: "public/example-with-mini-vue.html",
      chunks: ["exampleWithMiniVue"],
      template: "./public/index.html",
    }),
  ],
}
