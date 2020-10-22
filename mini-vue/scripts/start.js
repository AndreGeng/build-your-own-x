const webpack = require("webpack")
const WebpackDevServer = require("webpack-dev-server")
const webpackConfig = require("../webpack.config")

const compiler = webpack(webpackConfig)

const devServerConfig = webpackConfig.devServer
const server = new WebpackDevServer(compiler, devServerConfig)
server.listen(devServerConfig.port, () => {
  console.log(`server started on port ${port}`)
})
