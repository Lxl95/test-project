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
      <!-- <iframe class="view-panel" id="preview" frameborder="0"></iframe> -->
      <div id="iframewrapper"></div>
    </div>
  </div>
</template>

<script>
import MonacoEdito from './monacoEditor.vue';
import Vue from 'vue';

export default {
  name: 'app',
  components: {
    MonacoEdito
  },
  data() {
    return {
      show: false
    };
  },
  mounted() {
    this.initValue();
  },
  methods: {
    initValue() {
      var htmlString = `<div class="my-box">
  一段文本内容{{name}}
  <el-button type="warning">警告按钮</el-button>
  <el-button type="danger">危险按钮</el-button>
</div>`;
      var cssString = `.my-box {
  font-size: 20px;
  color: red;
}`;
      var jsString = `alert('打开弹框');`;
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
      var text = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Editor</title>
        <style>${css}</style>
        <!-- 引入样式 -->
        <link rel="stylesheet" href="/vue/element-ui/lib/theme-chalk/index.css">
        <script src="/vue/vue.min.js"><\/script>
        <!-- 引入组件库 -->
        <script src="/vue/element-ui/lib/index.js"><\/script>
        </head>
        <body id="app">${html}</body>
        <script>${js}<\/script>
        <script>
        // Vue.use(ELEMENT)
         const app = new Vue({
          el: '#app',
          // template: '',
          data: {
        name: '小猪猪'
      }
         })
          console.log(app);
        <\/script>
        </html>
       `;
      var patternHtml = /<html[^>]*>((.|[\n\r])*)<\/html>/im;
      var patternHead = /<head[^>]*>((.|[\n\r])*)<\/head>/im;
      var array_matches_head = patternHead.exec(text);
      var patternBody = /<body[^>]*>((.|[\n\r])*)<\/body>/im;

      var array_matches_body = patternBody.exec(text);
      var basepath_flag = 1;
      var basepath = '';
      if (basepath_flag) {
        basepath = '<base href="/public" target="_blank">';
      }
      if (array_matches_head) {
        text = text.replace('<head>', '<head>' + basepath);
      } else if (patternHtml) {
        text = text.replace('<html>', '<head>' + basepath + '</head>');
      } else if (array_matches_body) {
        text = text.replace('<body>', '<body>' + basepath);
      } else {
        text = basepath + text;
      }
      var ifr = document.createElement('iframe');
      ifr.setAttribute('frameborder', '0');
      ifr.setAttribute('id', 'iframeResult');

      document.getElementById('iframewrapper').innerHTML = '';
      document.getElementById('iframewrapper').appendChild(ifr);

      var ifrw = ifr.contentWindow ? ifr.contentWindow : ifr.contentDocument.document ? ifr.contentDocument.document : ifr.contentDocument;
      ifrw.document.open();
      console.log(text);

      ifrw.document.write(text);
      ifrw.document.close();
      // autodivheight();
    }

    // runCode() {
    //   var html = this.$refs.html.getEditorValue();
    //   var css = this.$refs.css.getEditorValue();
    //   var js = this.$refs.js.getEditorValue();
    //   let code = `
    //     <!DOCTYPE html>
    //     <html lang="en">
    //     <head>
    //     <meta charset="UTF-8">
    //     <meta http-equiv="X-UA-Compatible" content="IE=edge">
    //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //     <title>Editor</title>
    //     <style>${css}</style>
    //     <!-- 引入样式 -->
    //     <link rel="stylesheet" href="/vue/element-ui/lib/theme-chalk/index.css">
    //     <script src="/vue/vue.min.js"><\/script>
    //     <!-- 引入组件库 -->
    //     <script src="/vue/element-ui/lib/index.js"><\/script>
    //     </head>
    //     <body id="app">${html}</body>
    //     <script>${js}<\/script>
    //     <script>
    //     Vue.use(ELEMENT)
    //      const app = new Vue({
    //       el: '#app',
    //       // template: '',
    //       data: {
    //     name: '小猪猪'
    //   }
    //      })
    //       console.log(app);
    //     <\/script>
    //     </html>
    //    `;
    //   console.log(code);
    //   const preview = document.getElementById('preview');
    //   preview.setAttribute('srcdoc', code);
    // }
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
