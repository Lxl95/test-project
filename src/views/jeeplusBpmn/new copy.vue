<template>
  <div class="flow-designer">
     <div class="toolbar">
      <button @click="getFlowData">获取 JSON</button>
      <button @click="loadSampleData">加载示例 JSON</button>
      <button @click="clearCanvas">清空画布</button>
    </div>
    <!-- 画布容器 -->
    <div class="canvas-wrapper">
      <div id="lf-container" ref="lfContainer"></div>
    </div>

    <!-- 节点属性编辑弹窗 -->
    <div v-if="dialogVisible" class="dialog-mask" @click.self="closeDialog">
      <div class="dialog-box">
        <h3>编辑节点属性</h3>
        <div class="form-item">
          <label>节点 ID</label>
          <input v-model="editingNode.id" disabled />
        </div>
        <div class="form-item">
          <label>节点类型</label>
          <input v-model="editingNode.type" disabled />
        </div>
        <div class="form-item">
          <label>显示文本</label>
          <input v-model="editingNode.properties.text" placeholder="请输入文本" />
        </div>
        <div class="form-item">
          <label>背景颜色</label>
          <input v-model="editingNode.properties.style.fill" placeholder="#ffffff" />
        </div>
        <div class="dialog-actions">
          <button class="btn-save" @click="saveNode">保存</button>
          <button class="btn-cancel" @click="closeDialog">取消</button>
        </div>
      </div>
    </div>

    <!-- 工具栏 -->
   
  </div>
</template>

<script>
// ===== 修正点 1：导入正确的基类 =====
import LogicFlow from '@logicflow/core'
// 导入节点基类：CircleNode, CircleNodeModel, RectNode, RectNodeModel
import { CircleNode, CircleNodeModel, RectNode, RectNodeModel } from '@logicflow/core'
import '@logicflow/core/dist/index.css'

// ===== 修正点 2：继承具体的节点类，而非 NodeModel/NodeView =====

// 开始节点（绿色圆形）：继承 CircleNode 和 CircleNodeModel
class StartNodeModel extends CircleNodeModel {
  // 重写获取默认样式的方法
  getNodeStyle() {
    const style = super.getNodeStyle()
    // style.fill = '#52c41a'
    // style.stroke = '#389e0d'
    return style
  }
  // 可在此重写其他方法
}
class StartNodeView extends CircleNode {}

// 结束节点（红色圆角矩形）：继承 RectNode 和 RectNodeModel
class EndNodeModel extends RectNodeModel {
  getNodeStyle() {
    const style = super.getNodeStyle()
    // style.fill = '#ff4d4f'
    // style.stroke = '#cf1322'
    return style
  }
}
class EndNodeView extends RectNode {}

export default {
  name: 'FlowDesigner',
  data() {
    return {
      lfInstance: null,
      dialogVisible: false,
      editingNode: {
        id: '',
        type: '',
        properties: {
          text: '',
          style: { fill: '' }
        }
      }
    }
  },
  mounted() {
    this.initLogicFlow()
  },
  beforeDestroy() {
    if (this.lfInstance) {
      this.lfInstance.destroy()
    }
  },
  methods: {
    initLogicFlow() {
      const container = this.$refs.lfContainer

      this.lfInstance = new LogicFlow({
        container,
        background: { color: '#f5f5f5' },
        grid: { size: 20, visible: true }
      })

      // ===== 修正点 3：注册节点时使用新的类 =====
      this.lfInstance.register({
        type: 'start',
        model: StartNodeModel,
        view: StartNodeView
      })
      this.lfInstance.register({
        type: 'end',
        model: EndNodeModel,
        view: EndNodeView
      })

      this.lfInstance.render()

      // 节点点击事件
      this.lfInstance.on('node:click', ({ data }) => {
        this.openDialog(data)
      })

      // 加载示例数据
      this.loadSampleData()
    },

    openDialog(nodeData) {
      const clone = JSON.parse(JSON.stringify(nodeData))
      if (!clone.properties) clone.properties = {}
      if (!clone.properties.style) clone.properties.style = { fill: '' }
      this.editingNode = clone
      this.dialogVisible = true
    },

    closeDialog() {
      this.dialogVisible = false
    },

    saveNode() {
      const nodeId = this.editingNode.id
      if (!nodeId) return
      const nodeModel = this.lfInstance.getNodeModelById(nodeId)
      if (!nodeModel) return
      const newProps = {
        text: this.editingNode.properties.text,
        style: {
          fill: this.editingNode.properties.style.fill
        }
      }
      nodeModel.setProperties(newProps)
      this.lfInstance.render()
      this.closeDialog()
    },

    getFlowData() {
      if (!this.lfInstance) return
      const data = this.lfInstance.getGraphData()
      console.log('流程图 JSON:', JSON.stringify(data, null, 2))
      alert('数据已输出到控制台')
    },

    loadSampleData() {
      if (!this.lfInstance) return
      const sampleData = {
        nodes: [
          {
            id: 'node_start',
            type: 'start',
            x: 400,
            y: 150,
            properties: {
              text: '开始',
              style: { fill: '#52c41a' }
            }
          },
          {
            id: 'node_end',
            type: 'end',
            x: 400,
            y: 350,
            properties: {
              text: '结束',
              style: { fill: '#ff4d4f' }
            }
          }
        ],
        edges: [
          {
            id: 'edge_1',
            sourceNodeId: 'node_start',
            targetNodeId: 'node_end',
            type: 'polyline',
            properties: {
              text: '流程连线'
            }
          }
        ]
      }
      this.lfInstance.clearData()
      this.lfInstance.render(sampleData)
    },

    clearCanvas() {
      if (!this.lfInstance) return
      this.lfInstance.clearData()
      this.lfInstance.render()
    }
  }
}
</script>

<style scoped>
.flow-designer {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}
.canvas-wrapper {
  flex: 1;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}
#lf-container {
  width: 100%;
  height: 100%;
}
.toolbar {
  display: flex;
  gap: 12px;
  padding: 12px 20px;
  background: #fafafa;
  border-top: 1px solid #e8e8e8;
  flex-shrink: 0;
}
.toolbar button {
  padding: 6px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.toolbar button:hover {
  border-color: #40a9ff;
  color: #40a9ff;
}
.dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.dialog-box {
  background: #fff;
  border-radius: 8px;
  padding: 24px 28px;
  width: 420px;
  max-width: 90%;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.2);
}
.dialog-box h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
  color: #333;
  text-align: center;
}
.form-item {
  display: flex;
  align-items: center;
  margin-bottom: 14px;
}
.form-item label {
  width: 80px;
  font-size: 14px;
  color: #555;
  flex-shrink: 0;
}
.form-item input {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border 0.2s;
}
.form-item input:focus {
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(64, 169, 255, 0.2);
}
.form-item input:disabled {
  background: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}
.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}
.dialog-actions button {
  padding: 6px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-save {
  background: #1890ff;
  color: #fff;
}
.btn-save:hover {
  background: #40a9ff;
}
.btn-cancel {
  background: #f0f0f0;
  color: #333;
}
.btn-cancel:hover {
  background: #e0e0e0;
}
</style>