const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path')

module.exports = {
  transpileDependencies: true,
  lintOnSave: false, // 关闭Eslint
  configureWebpack: {
    plugins: [new MonacoWebpackPlugin({ languages: ['javascript', 'typescript', 'html', 'css', 'json'] })],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  },
  runtimeCompiler: true,
  chainWebpack: config => {
    config.resolve.alias.set('vue$', 'vue/dist/vue.esm.js');
  }
};
