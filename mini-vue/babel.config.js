module.exports = api => {
  api.cache.forever();
  const presets = [
    ["@babel/preset-env", {
      shippedProposals: true,
    }],
  ]
  const plugins = [];
  return {
    presets,
    plugins,
  }
}
