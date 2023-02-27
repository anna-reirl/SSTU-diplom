const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    headers: { "Access-Control-Allow-Origin": "*" },
    proxy: {
      "/api": {
          target: "http://localhost:3000"
      },
      "/static": {
        target: "http://localhost:3000"
      }
    }
  },
  transpileDependencies: true,
});
