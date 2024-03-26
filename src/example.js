// 第 1 步：创建一个 Vue 实例
const Vue = require('vue');
const app = new Vue({
  template: `<div class="my-box">
  一段文本内容{{name}}
  <el-button type="warning">警告按钮</el-button>
  <el-button type="danger">危险按钮</el-button>
</div>`,
  data: { name: 'lxl' }
});
// 第 2 步：创建一个 renderer
const renderer = require('vue-server-renderer').createRenderer();
// 第 3 步：将 Vue 实例渲染为 HTML
renderer.renderToString(app, (err, html) => {
  if (err) throw err;
  console.log(html);
  // => <div data-server-rendered="true">Hello World</div>
});
