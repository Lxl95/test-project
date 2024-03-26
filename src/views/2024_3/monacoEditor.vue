<template>
  <div ref="mainEditor" :style="{ width: width, height: height }"></div>
</template>

<script>
import * as monaco from 'monaco-editor';

export default {
  name: 'Monaco',
  props: {
    // 根据传过来的数据来设置编辑器语言
    language: {
      type: String,
      default: 'javascript'
    },
    // 根据传过来的数据来设置编辑器的值
    editorValue: {
      type: String,
      default: ''
    },
    theme: {
      type: String,
      default: 'hc-dark'
    },
    width: {
      type: String,
      default: '500px'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      monacoEditor: null
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 使用 - 创建 monacoEditor 对象
      this.monacoEditor = monaco.editor.create(this.$refs.mainEditor, {
        theme: this.theme, // 主题 vs-dark, vs, hc-black
        value: this.editorValue, // 默认显示的值
        language: this.language,
        folding: true, // 是否折叠
        foldingHighlight: true, // 折叠等高线
        foldingStrategy: 'indentation', // 折叠方式  auto | indentation
        showFoldingControls: 'always', // 是否一直显示折叠 always | mouseover
        disableLayerHinting: true, // 等宽优化
        emptySelectionClipboard: false, // 空选择剪切板
        selectionClipboard: false, // 选择剪切板
        automaticLayout: true, // 自动布局
        codeLens: false, // 代码镜头
        scrollBeyondLastLine: false, // 滚动完最后一行后再滚动一屏幕
        colorDecorators: true, // 颜色装饰器
        accessibilitySupport: 'off', // 辅助功能支持  "auto" | "off" | "on"
        lineNumbers: 'on', // 行号 取值： "on" | "off" | "relative" | "interval" | function
        lineNumbersMinChars: 5, // 行号最小字符   number
        enableSplitViewResizing: false,
        readOnly: false, //是否只读  取值 true | false
        minimap: {
          // 关闭代码缩略图
          enabled: false // 是否启用预览图
        },
        scrollBeyondLastLine: false, // 禁用额外滚动区
        scrollbar: {
          verticalScrollbarSize: 4, // 垂直滚动条宽度，默认px
          horizontalScrollbarSize: 4 // 水平滚动条高度
        },
        contextmenu: false // 禁用右键菜单
      });
      // 自定义主题背景色
      monaco.editor.defineTheme('CodeSampleTheme', {
        base: 'vs',
        inherit: true,
        rules: [{ background: '#F6F6F7' }],
        colors: {
          // 相关颜色属性配置
          'editor.background': '#F6F6F7' // 背景色
        }
      });
      // 监听内容变化
      this.monacoEditor.onDidChangeModelContent(content => {
        console.log('内容变化', content);
      });
      // 监听失去焦点事件
      this.monacoEditor.onDidBlurEditorText(e => {
        console.log('失去焦点', e);
      });
      // 在划选过程中打印选中的值
      this.monacoEditor.onDidChangeCursorSelection(e => {
        const model = this.monacoEditor.getModel();
        let select = this.monacoEditor.getSelection();
        console.log('选中', model.getValueInRange(select));
      });
      // // 设置主题
      console.log(this.theme);
      monaco.editor.setTheme('vs-dark');
    },
    // 设置并获取monaco编辑器的值
    setEditorValue(newValue) {
      // const newModel = monaco.editor.createModel(
      //   data, // 值
      //   this.language // 语言
      // );
      // this.monacoEditor.setModel(newModel);
      // 设置自定义的主题背景色
      // monaco.editor.setTheme('CodeSampleTheme');
      this.monacoEditor.setValue(newValue);
    },
    getEditorValue() {
      return this.monacoEditor.getValue();
    }
  }
};
</script>

<style lang="scss" scoped></style>
