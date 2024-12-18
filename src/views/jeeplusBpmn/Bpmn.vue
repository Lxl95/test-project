<template>
  <div>
    <div class="headerBtn">
      <el-button @click="handleSave" icon="el-icon-folder" size="mini" type="primary">保存</el-button>
    </div>
    <div id="bpmn-container"></div>
  </div>
</template>

<script>
import BpmnModeler from 'jeeplus-bpmn/lib/Modeler';
// import flowableModdle from './static/js/flowable.json';
import customTranslate from './static/js/customTranslate.js';
import { templateXml } from './static/js/template.js';
// import './static/css/bpmn.css';
import 'bpmn-js/dist/assets/diagram-js.css' // 基础样式
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css' // 节点基础图标
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css' // 节点完整图标

export default {
  data() {
    return {
      bpmnModeler: null
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.bpmnModeler = new BpmnModeler({
        container: '#bpmn-container',
        additionalModules: [
          {
            translate: ['value', customTranslate], //翻译
            // labelEditingProvider: ['value', ''] // 禁用节点编辑
          }
        ],
        moddleExtensions: {
          // flowable: flowableModdle
        }
      });
      var xml = templateXml;
      const processId = new Date().getTime();
      xml = xml.replace(/process_processId/g, 'process' + processId);
      xml = xml.replace(/流程_processId/g, '流程' + processId);

      this.bpmnModeler.importXML(xml, function (err) {
        if (err) {
          console.log('error rendering', err);
        } else {
          console.log('rendered');
        }
      });
    },
    handleSave() {
      this.bpmnModeler.saveXML({ format: true }, (err, xml) => {
        if (err) {
          this.$message.error(err);
        } else {
          console.log(xml);
        }
      });
    }
  }
};
</script>

<style>
#bpmn-container {
  height: 100vh;
  background: url('./static/img/bpmnBg.svg');
}
.headerBtn {
  padding: 10px;
}
</style>
