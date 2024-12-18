<template>
  <div>
    <div class="headerBtn">
      <el-button @click="handleSave" icon="el-icon-folder" size="mini" type="primary">保存</el-button>
    </div>
    <div id="bpmn-container"></div>
    <el-dialog title="" :visible.sync="dialogVisible" width="80%">
        <el-form :model="formData">
            <el-form-item label="节点名称">
                <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="节点编号">
                <el-input v-model="formData.TaskCode"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirm_UpdateNode">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import BpmnModeler from 'jeeplus-bpmn/lib/Modeler';
// import flowableModdle from './static/js/flowable.json';
import customTranslate from './static/js/customTranslate.js';
import { templateXml } from './static/js/template.js';
// import './static/css/bpmn.css';
import 'bpmn-js/dist/assets/diagram-js.css'; // 基础样式
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'; // 节点基础图标
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'; // 节点完整图标

export default {
  data() {
    return {
      bpmnModeler: null,
      NodeElement: null,
      formData: {},
      dialogVisible:false
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const that = this
      this.bpmnModeler = new BpmnModeler({
        container: '#bpmn-container',
        additionalModules: [
          {
            translate: ['value', customTranslate],//翻译
            labelEditingProvider: ['value', ''] // 禁用节点编辑
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
          that.eventBus();
        }
      });
    },
    eventBus() {
      const that = this
      // 监听节点选择变化
      this.bpmnModeler.on('selection.changed', e => {
        const element = e.newSelection[0];
        console.log(element, 'selection.changed');
        that.NodeElement = element
      });
      // 监听节点选择变化
      this.bpmnModeler.on('element.dblclick', e => {
        const { element } = e;
        console.log(element,'element.dblclick');
        that.NodeElement = element
        that.InitNodeData()
      });
      //  监听节点属性变化
      this.bpmnModeler.on('element.changed', e => {
        const { element } = e;
        console.log(element,'element.changed');
        that.NodeElement = element
      });
    },
    InitNodeData() {
      if(this.NodeElement && this.NodeElement.type === "bpmn:UserTask") {
        this.formData = {
          name: this.NodeElement.name,
          TaskCode: this.NodeElement.businessObject.$attrs.TaskCode
        }
        this.dialogVisible = true
      }
    },
    confirm_UpdateNode() {
      // 节点名称的更新
      const modeling = this.bpmnModeler.get('modeling');
      modeling.updateProperties(this.NodeElement, { name: this.formData.name });
      // 自定义节点属性的存储
      modeling.updateProperties(this.NodeElement, { TaskCode: this.formData.TaskCode });
      console.log(this.NodeElement, '更新');
      this.dialogVisible = false
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
