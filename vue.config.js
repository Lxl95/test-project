const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  transpileDependencies: true,
  lintOnSave: false, // 关闭Eslint
  configureWebpack: {
    plugins: [new MonacoWebpackPlugin({ languages: ['javascript', 'typescript', 'html', 'css', 'json'] })]
  }
};
