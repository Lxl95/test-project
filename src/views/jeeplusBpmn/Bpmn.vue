<template>
  <div>
    <div class="headerBtn">
      <el-button @click="handleSave" icon="el-icon-folder" size="mini" type="primary">保存</el-button>
    </div>
    <div id="bpmn-container"></div>
    <el-tabs>
      <el-tab-pane label="节点" name="1">
        <el-button @click="AddNode" size="mini" type="primary">添加节点</el-button>
        <el-table :data="AllNodeList" border stripe style="width: 100%; margin: 10px">
          <el-table-column align="center" type="index" width="80" />
          <el-table-column prop="id" label="节点Id" />
          <el-table-column prop="name" label="节点名称" />
          <el-table-column prop="TaskCode" label="节点编号" />
          <el-table-column prop="x" label="节点位置x" />
          <el-table-column prop="y" label="节点位置y" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="连线" name="2"></el-tab-pane>
    </el-tabs>
    <el-button @click="confirmAdd" size="mini" type="primary">确认添加</el-button>
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
      processId: '',
      dialogVisible: false,
      AllNodeList: [],
      AllConnectionList: []
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const that = this;
      this.bpmnModeler = new BpmnModeler({
        container: '#bpmn-container',
        additionalModules: [
          {
            translate: ['value', customTranslate], //翻译
            labelEditingProvider: ['value', ''] // 禁用节点编辑
          }
        ],
        moddleExtensions: {
          // flowable: flowableModdle
        }
      });
      var xml = templateXml;
      this.processId = new Date().getTime();
      xml = xml.replace(/process_processId/g, 'process' + this.processId);
      xml = xml.replace(/流程_processId/g, '流程' + this.processId);

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
      const that = this;
      // 监听节点选择变化
      this.bpmnModeler.on('selection.changed', e => {
        const element = e.newSelection[0];
        console.log(element, 'selection.changed');
        that.NodeElement = element;
      });
      // 监听节点选择变化
      this.bpmnModeler.on('element.dblclick', e => {
        const { element } = e;
        console.log(element, 'element.dblclick');
        that.NodeElement = element;
        that.InitNodeData();
      });
      //  监听节点属性变化
      this.bpmnModeler.on('element.changed', e => {
        const { element } = e;
        console.log(element, 'element.changed');
        that.NodeElement = element;
      });
    },
    InitNodeData() {
      if (this.NodeElement && this.NodeElement.type === 'bpmn:UserTask') {
        const businessObject = this.NodeElement.businessObject;
        this.formData = {
          type: this.NodeElement.type,
          id: businessObject.id,
          name: businessObject.name,
          TaskCode: businessObject.$attrs.TaskCode
        };
        this.dialogVisible = true;
      }
    },
    confirm_UpdateNode() {
      // 节点名称的更新
      const modeling = this.bpmnModeler.get('modeling');
      modeling.updateProperties(this.NodeElement, { name: this.formData.name });
      // 自定义节点属性的存储
      modeling.updateProperties(this.NodeElement, { TaskCode: this.formData.TaskCode });
      console.log(this.NodeElement, '更新');
      this.dialogVisible = false;
    },
    handleSave() {
      this.bpmnModeler.saveXML({ format: true }, (err, xml) => {
        if (err) {
          this.$message.error(err);
        } else {
          console.log(xml);
        }
      });
    },
    AddNode() {
      // const TaskCode =
      this.AllNodeList.push({
        id: '',
        name: '任务1',
        TaskCode: '0001',
        x: '300',
        y: '200'
      });
    },
    confirmAdd() {
      // this.AllNodeList.forEach(item => {
      //   if(!item.id) {
      //     // 新增节点
      //     const taskShape = this.bpmnModeler.get('elementFactory').createShape({
      //       type: 'bpmn:UserTask',
      //       x:item.x,
      //       y:item.y,
      //       width: 100,
      //       height: 80
      //     })
      //     this.bpmnModeler.get('canvas').addShape(taskShape)
      //     this.bpmnModeler.get('modeling').updateProperties(taskShape, {name: item.name });
      //     this.bpmnModeler.get('modeling').updateProperties(taskShape, { TaskCode: item.TaskCode });
      //     item.id = taskShape.id
      //   }
      // })
      const modeler = this.bpmnModeler;
      const elementFactory = modeler.get('elementFactory'),
        elementRegistry = modeler.get('elementRegistry'),
        modeling = modeler.get('modeling');

      // (2) Get the existing process and the start event
      const process = elementRegistry.get('process' + this.processId),
        startEvent = elementRegistry.get('StartEvent_01ydzqe');

      // (3) Create a new diagram shape
      const task = elementFactory.createShape({ type: 'bpmn:UserTask' });

      // (4) Add the new task to the diagram
      modeling.createShape(task, { x: 400, y: 100 }, process);

      // You can now access the new task through the element registry
      console.log(elementRegistry.get(task.id)); // Shape { "type": "bpmn:UserTask", ... }

      // (5) Connect the existing start event to new task
      modeling.connect(startEvent, task);

      // (6) Create a end event shape
      const endEvent = elementFactory.createShape({ type: 'bpmn:EndEvent' });

      // (7) Add the new end event shape to the diagram
      modeling.createShape(endEvent, { x: 600, y: 100 }, process);

      // (8) Create a new sequence flow connection that connects the task to the end event
      modeling.createConnection(task, endEvent, { type: 'bpmn:SequenceFlow' }, process);
    }
  }
};
</script>

<style>
#bpmn-container {
  height: 50vh;
  background: url('./static/img/bpmnBg.svg');
}
.headerBtn {
  padding: 10px;
}
</style>
