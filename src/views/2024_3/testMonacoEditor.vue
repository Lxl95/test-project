<template>
  <div id="app" class="flex-row">
    <div class="left-content">
      <div class="flex-row">
        <div class="wrap">
          <p style="background: #6aa84f">html</p>
          <monaco-edito ref="html" :width="'500px'" :height="'290px'" :language="'html'"></monaco-edito>
        </div>
        <div class="wrap">
          <p style="background: #cc4125">css</p>
          <monaco-edito ref="css" :width="'500px'" :height="'290px'" :language="'css'"></monaco-edito>
        </div>
      </div>
      <div class="wrap">
        <p style="background: #f1c232">js</p>
        <monaco-edito ref="js" :height="'260px'"></monaco-edito>
      </div>
    </div>
    <div class="right-content">
      <button @click="runCode">运行</button>
      <p>实现结果：</p>
      <iframe class="view-panel" id="preview" frameborder="0"></iframe>
    </div>
  </div>
</template>

<script>
import MonacoEdito from './monacoEditor.vue';

export default {
  name: 'app',
  components: {
    MonacoEdito
  },
  mounted() {
    this.initValue();
  },
  methods: {
    initValue() {
      var htmlString = `<div class="my-box">
  一段文本内容
</div>`;
      var cssString = `.my-box {
  font-size: 20px;
  color: red;
}`;
      var jsString = `alert('打开弹框')`;
      // 调用monaco组件的方法，设置monaco编辑器的值
      this.$nextTick(() => {
        this.$refs.html.setEditorValue(htmlString);
        this.$refs.css.setEditorValue(cssString);
        this.$refs.js.setEditorValue(jsString);
      });
    },
    runCode() {
      var html = this.$refs.html.getEditorValue();
      var css = this.$refs.css.getEditorValue();
      var js = this.$refs.js.getEditorValue();
      let code = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Editor</title>
        <style>${css}</style>
        </head>
        <body>${html}</body>
        <script>${js}<\/script>
        </html>
       `;
      console.log(code);
      const preview = document.getElementById('preview');
      preview.setAttribute('srcdoc', code);
    }
  }
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
}
.flex-row {
  display: flex;
  flex-direction: row;
}
.result {
  border: 1px solid #ccc;
  width: 100%;
  height: 500px;
}
.left-content {
  width: 1000px;
}
.right-content {
  margin-left: 15px;
  padding: 10px;
  width: 30%;
}
.wrap {
  display: flex;
  flex-direction: column;
  width: 500px;
}
.wrap p {
  padding: 5px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
}
.right-content p {
  margin: 5px 0;
}
button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #409eff;
  border: 1px solid #409eff;
  color: #ffffff;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
}
</style>
