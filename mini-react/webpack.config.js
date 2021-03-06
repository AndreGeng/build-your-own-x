const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    exampleWithReact: "./example-with-react",
    exampleWithMiniReact: "./example-with-mini-react",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[chunkhash].js",
  },
  mode: "development",
  module: {
    rules: [{
      test: /\.js$/,
      exclude: [        
        path.resolve(__dirname, "node_modules"),
      ],
      use: [{
        loader: "babel-loader",
      }]
    }, {
      test: /\.pcss$/,
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
      ]
    }]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "ExampleWithReact",
      filename: "public/example-with-react.html",
      chunks: ["exampleWithReact"],
      template: "./public/index.html",
    }),
    new HtmlWebpackPlugin({
      title: "ExampleWithReact",
      filename: "public/example-with-mini-react.html",
      chunks: ["exampleWithMiniReact"],
      template: "./public/index.html",
    }),
  ],
  devtool: "cheap-module-source-map",
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 3002,
  }
}
